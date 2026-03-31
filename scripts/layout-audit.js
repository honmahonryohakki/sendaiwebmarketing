const fs = require("fs");
const path = require("path");
const os = require("os");
const http = require("http");
const { spawn } = require("child_process");

const chromeCandidates = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
];

function findChrome() {
  for (const candidate of chromeCandidates) {
    if (fs.existsSync(candidate)) return candidate;
  }
  throw new Error("Chrome/Edge が見つかりません。");
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function httpGetJson(url) {
  return new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        let body = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          body += chunk;
        });
        res.on("end", () => {
          try {
            resolve(JSON.parse(body));
          } catch (error) {
            reject(error);
          }
        });
      })
      .on("error", reject);
  });
}

class CDP {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 0;
    this.pending = new Map();
    this.events = [];
  }

  async connect() {
    await new Promise((resolve, reject) => {
      this.ws.addEventListener("open", resolve, { once: true });
      this.ws.addEventListener("error", reject, { once: true });
    });

    this.ws.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (message.id) {
        const entry = this.pending.get(message.id);
        if (!entry) return;
        this.pending.delete(message.id);
        if (message.error) {
          entry.reject(new Error(message.error.message));
        } else {
          entry.resolve(message.result);
        }
        return;
      }
      this.events.push(message);
    });
  }

  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async waitFor(method, timeoutMs = 10000) {
    const started = Date.now();
    while (Date.now() - started < timeoutMs) {
      const index = this.events.findIndex((event) => event.method === method);
      if (index >= 0) {
        const [event] = this.events.splice(index, 1);
        return event.params || {};
      }
      await wait(50);
    }
    throw new Error(`${method} を待機中にタイムアウトしました。`);
  }

  close() {
    this.ws.close();
  }
}

function selectorFor(element) {
  if (!(element instanceof Element)) return "";
  const parts = [];
  let current = element;
  while (current && current.nodeType === 1 && parts.length < 4) {
    let part = current.tagName.toLowerCase();
    if (current.id) {
      part += `#${current.id}`;
      parts.unshift(part);
      break;
    }
    if (current.classList.length) {
      part += `.${Array.from(current.classList).slice(0, 2).join(".")}`;
    }
    const parent = current.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter(
        (child) => child.tagName === current.tagName
      );
      if (siblings.length > 1) {
        part += `:nth-of-type(${siblings.indexOf(current) + 1})`;
      }
    }
    parts.unshift(part);
    current = current.parentElement;
  }
  return parts.join(" > ");
}

const AUDIT_FN = `(() => {
  ${selectorFor.toString()}

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const candidates = Array.from(document.querySelectorAll("body *"));
  const overflowX = [];

  function hasScrollableOverflowAncestor(el) {
    let current = el.parentElement;
    while (current && current !== document.body) {
      const style = getComputedStyle(current);
      const allowsScroll = /(auto|scroll|clip)/.test(style.overflowX);
      if (allowsScroll && current.scrollWidth > current.clientWidth + 1) {
        return true;
      }
      current = current.parentElement;
    }
    return false;
  }

  for (const el of candidates) {
    const style = getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden") continue;
    const rect = el.getBoundingClientRect();
    if (!rect.width && !rect.height) continue;
    if (hasScrollableOverflowAncestor(el)) continue;
    const outside = rect.left < -1 || rect.right > viewportWidth + 1;
    if (!outside) continue;
    overflowX.push({
      selector: selectorFor(el),
      left: Number(rect.left.toFixed(1)),
      right: Number(rect.right.toFixed(1)),
      width: Number(rect.width.toFixed(1)),
      text: (el.innerText || "").replace(/\\s+/g, " ").trim().slice(0, 80),
    });
  }

  const textIssues = [];
  for (const el of document.querySelectorAll("h1,h2,h3,p,li,a,summary,dt,dd")) {
    const style = getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden") continue;
    const rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) continue;
    if (el.scrollWidth <= el.clientWidth + 1) continue;
    textIssues.push({
      selector: selectorFor(el),
      clientWidth: el.clientWidth,
      scrollWidth: el.scrollWidth,
      text: (el.innerText || "").replace(/\\s+/g, " ").trim().slice(0, 80),
    });
  }

  const flow = Array.from(document.querySelectorAll(".home-flow li")).map((el) => {
    const rect = el.getBoundingClientRect();
    const before = getComputedStyle(el, "::before");
    return {
      text: (el.innerText || "").replace(/\\s+/g, " ").trim().slice(0, 80),
      paddingLeft: getComputedStyle(el).paddingLeft,
      pseudoLeft: before.left,
      pseudoTop: before.top,
      rectHeight: Number(rect.height.toFixed(1)),
    };
  });

  const featureCards = Array.from(document.querySelectorAll(".cards article h3")).slice(0, 5).map((el) => {
    const rect = el.getBoundingClientRect();
    const cardRect = el.closest("article")?.getBoundingClientRect();
    return {
      text: (el.innerText || "").replace(/\\s+/g, " ").trim().slice(0, 80),
      fontSize: getComputedStyle(el).fontSize,
      lineHeight: getComputedStyle(el).lineHeight,
      width: Number(rect.width.toFixed(1)),
      height: Number(rect.height.toFixed(1)),
      cardTop: Number((cardRect?.top || 0).toFixed(1)),
      cardHeight: Number((cardRect?.height || 0).toFixed(1)),
    };
  });

  const headerParts = [".brand", ".nav", ".social-links"].map((selector) => {
    const el = document.querySelector(selector);
    if (!el) return { selector, exists: false };
    const rect = el.getBoundingClientRect();
    return {
      selector,
      exists: true,
      top: Number(rect.top.toFixed(1)),
      left: Number(rect.left.toFixed(1)),
      width: Number(rect.width.toFixed(1)),
      height: Number(rect.height.toFixed(1)),
    };
  });

  return {
    title: document.title,
    viewport: { width: viewportWidth, height: viewportHeight },
    document: {
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      clientHeight: document.documentElement.clientHeight,
      scrollHeight: document.documentElement.scrollHeight,
    },
    overflowX: overflowX.slice(0, 25),
    textIssues: textIssues.slice(0, 25),
    headerParts,
    flow,
    featureCards,
  };
})()`;

async function main() {
  const fileArg = process.argv[2];
  const width = Number(process.argv[3] || 1440);
  const height = Number(process.argv[4] || 900);
  const screenshotPath = process.argv[5];

  if (!fileArg) {
    throw new Error("使い方: node scripts/layout-audit.js <html-path> [width] [height] [screenshot-path]");
  }

  const targetFile = path.resolve(fileArg);
  const fileUrl = `file:///${targetFile.replace(/\\\\/g, "/")}`;
  const chrome = findChrome();
  const port = 9222 + Math.floor(Math.random() * 2000);
  const profileDir = fs.mkdtempSync(path.join(os.tmpdir(), "layout-audit-"));

  const chromeProc = spawn(
    chrome,
    [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      `--remote-debugging-port=${port}`,
      "--allow-file-access-from-files",
      "--disable-features=Translate,MediaRouter",
      `--user-data-dir=${profileDir}`,
      "about:blank",
    ],
    { stdio: "ignore" }
  );

  try {
    let version;
    for (let i = 0; i < 50; i += 1) {
      try {
        version = await httpGetJson(`http://127.0.0.1:${port}/json/version`);
        break;
      } catch (error) {
        await wait(100);
      }
    }

    if (!version || !version.webSocketDebuggerUrl) {
      throw new Error("DevTools 接続に失敗しました。");
    }

    const cdp = new CDP(version.webSocketDebuggerUrl);
    await cdp.connect();

    await cdp.send("Target.createTarget", { url: "about:blank" });
    const targets = await httpGetJson(`http://127.0.0.1:${port}/json/list`);
    const pageTarget = targets.find((target) => target.type === "page" && target.url === "about:blank");
    if (!pageTarget) {
      throw new Error("監査用ページを作成できませんでした。");
    }

    const page = new CDP(pageTarget.webSocketDebuggerUrl);
    await page.connect();

    await page.send("Page.enable");
    await page.send("Runtime.enable");
    await page.send("DOM.enable");
    await page.send("Emulation.setDeviceMetricsOverride", {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: false,
      screenWidth: width,
      screenHeight: height,
    });

    await page.send("Page.navigate", { url: fileUrl });
    await page.waitFor("Page.loadEventFired", 15000);
    await wait(1500);

    const audit = await page.send("Runtime.evaluate", {
      expression: AUDIT_FN,
      returnByValue: true,
      awaitPromise: true,
    });

    if (screenshotPath) {
      const shot = await page.send("Page.captureScreenshot", {
        format: "png",
        captureBeyondViewport: true,
      });
      fs.writeFileSync(path.resolve(screenshotPath), Buffer.from(shot.data, "base64"));
    }

    console.log(JSON.stringify(audit.result.value, null, 2));

    page.close();
    cdp.close();
  } finally {
    chromeProc.kill();
    try {
      fs.rmSync(profileDir, { recursive: true, force: true });
    } catch (error) {
      // Chrome can briefly hold crashpad files; layout audit results are already emitted.
    }
  }
}

main().catch((error) => {
  console.error(error.stack || String(error));
  process.exit(1);
});
