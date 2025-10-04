import re
import sys
import codecs

path = sys.argv[1]
text = codecs.open(path, 'r', 'utf-8-sig').read()
srcs = re.findall(r'<img[^>]+src="([^"]+)"', text)
for s in srcs:
    print(s)

