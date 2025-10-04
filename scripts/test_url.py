import sys, urllib.request
url=sys.argv[1]
req=urllib.request.Request(url, method='HEAD', headers={'User-Agent':'Mozilla/5.0'})
with urllib.request.urlopen(req, timeout=10) as r:
    print(r.getcode())
