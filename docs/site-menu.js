(function () {
  var menuButtons = Array.prototype.slice.call(document.querySelectorAll(".menu-toggle"));

  if (!menuButtons.length) {
    return;
  }

  var script = document.currentScript;
  var root = "./";

  if (script) {
    var src = script.getAttribute("src") || "";
    var match = src.match(/^(.*)site-menu\.js(?:\?.*)?$/);
    root = match ? match[1] || "./" : root;
  }

  var links = [
    ["HOME", "トップ", "index.html"],
    ["SERVICES", "サービス一覧", "services-list.html"],
    ["AI CONSULTANT", "AIコンサルタント", "ai-consultant.html"],
    ["GENERATIVE AI", "生成AI導入", "generative-ai-support.html"],
    ["LISTING ADS", "リスティング広告代行", "listing.html"],
    ["MARKETER TRAINING", "マーケター育成", "marketer-training.html"],
    ["STUDY SUPPORT", "東北学習サービス", "tohoku-study.html"],
    ["FORTNITE", "Fortniteサービス", "fortnite.html"],
    ["COLUMN", "コラム", "column/"],
    ["PACKAGE", "パッケージ", "package.html"],
    ["ABOUT", "会社概要", "about.html"],
    ["RECRUIT", "採用情報", "recruit/"],
    ["CONTACT", "無料相談", "index.html#contact"]
  ];

  var subLinks = [
    ["PRIVACY", root + "privacy-policy.html", ""],
    [
      "LinkedIn",
      "https://www.linkedin.com/in/%E8%97%A4-%E5%8A%A0-bba339312/",
      "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/linkedin.svg"
    ],
    [
      "YouTube",
      "https://www.youtube.com/@LifeDesignChannel-e9i",
      "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/youtube.svg"
    ]
  ];

  var overlay = document.createElement("div");
  overlay.className = "site-menu-overlay";
  overlay.id = "site-menu-overlay";
  overlay.hidden = true;
  overlay.innerHTML =
    '<div class="site-menu-overlay__panel" role="dialog" aria-modal="true" aria-label="サイトメニュー">' +
    '<div class="site-menu-overlay__top">' +
    '<p class="site-menu-overlay__eyebrow">TOHOKU GAKUSHU SERVICE</p>' +
    '<button class="site-menu-close" type="button" aria-label="メニューを閉じる">Close</button>' +
    "</div>" +
    '<nav class="site-menu-list" aria-label="詳細ナビゲーション">' +
    links
      .map(function (item) {
        return (
          '<a class="site-menu-item" href="' +
          root +
          item[2] +
          '">' +
          '<span class="site-menu-item__label">' +
          item[0] +
          "</span>" +
          '<span class="site-menu-item__caption">' +
          item[1] +
          "</span>" +
          "</a>"
        );
      })
      .join("") +
    "</nav>" +
    '<div class="site-menu-sub">' +
    subLinks
      .map(function (item) {
        var external = item[1].indexOf("http") === 0;
        return (
          '<a href="' +
          item[1] +
          '"' +
          (external ? ' target="_blank" rel="noopener"' : "") +
          ">" +
          (item[2] ? '<img src="' + item[2] + '" alt="" aria-hidden="true" width="18" height="18">' : "") +
          "<span>" +
          item[0] +
          "</span>" +
          "</a>"
        );
      })
      .join("") +
    "</div>" +
    "</div>";

  document.body.appendChild(overlay);

  var panel = overlay.querySelector(".site-menu-overlay__panel");
  var closeButton = overlay.querySelector(".site-menu-close");
  var focusSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
  var lastActiveElement = null;
  var closeTimer = null;

  function setButtonsExpanded(expanded) {
    menuButtons.forEach(function (button) {
      button.setAttribute("aria-expanded", expanded ? "true" : "false");
      button.setAttribute("aria-label", expanded ? "メニューを閉じる" : "メニューを開く");
    });
  }

  function getFocusable() {
    return Array.prototype.slice.call(overlay.querySelectorAll(focusSelector));
  }

  function openMenu(button) {
    window.clearTimeout(closeTimer);
    lastActiveElement = button || document.activeElement;
    overlay.hidden = false;
    document.body.classList.add("is-menu-open");
    setButtonsExpanded(true);

    window.requestAnimationFrame(function () {
      overlay.classList.add("is-open");
      var focusable = getFocusable();
      (focusable[1] || closeButton).focus();
    });
  }

  function closeMenu() {
    if (overlay.hidden) {
      return;
    }

    overlay.classList.remove("is-open");
    document.body.classList.remove("is-menu-open");
    setButtonsExpanded(false);

    closeTimer = window.setTimeout(function () {
      overlay.hidden = true;
      if (lastActiveElement && typeof lastActiveElement.focus === "function") {
        lastActiveElement.focus();
      }
    }, 220);
  }

  function trapFocus(event) {
    if (event.key !== "Tab" || overlay.hidden) {
      return;
    }

    var focusable = getFocusable();
    var first = focusable[0];
    var last = focusable[focusable.length - 1];

    if (!first || !last) {
      return;
    }

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  menuButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      if (overlay.hidden) {
        openMenu(button);
      } else {
        closeMenu();
      }
    });
  });

  closeButton.addEventListener("click", closeMenu);
  overlay.addEventListener("click", function (event) {
    if (event.target === overlay || event.target.closest(".site-menu-item, .site-menu-sub a")) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !overlay.hidden) {
      closeMenu();
    }
  });

  panel.addEventListener("keydown", trapFocus);
})();
