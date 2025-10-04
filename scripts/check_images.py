import codecs
import re
import urllib.request
import urllib.error

def check(url: str) -> int:
    req = urllib.request.Request(url, method='HEAD', headers={'User-Agent':'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            return resp.getcode()
    except urllib.error.HTTPError as e:
        return e.code
    except Exception:
        return -1

text = codecs.open('docs/index.html','r','utf-8-sig').read()
srcs = re.findall(r'<img[^>]+src="([^"]+)"', text)
for u in srcs:
    code = check(u)
    print(f"{code}\t{u}")

