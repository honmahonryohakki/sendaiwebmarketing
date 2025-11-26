import sys, codecs
path = sys.argv[1]
keywords = sys.argv[2:]
text = codecs.open(path,'r','utf-8-sig').read().splitlines()
for i,l in enumerate(text,1):
    if any(k in l for k in keywords):
        print(f"{i}: {l}")
