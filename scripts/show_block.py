import sys, codecs
path = sys.argv[1]
start = int(sys.argv[2])
end = int(sys.argv[3])
lines = codecs.open(path,'r','utf-8-sig').read().splitlines()
for i in range(start, min(end, len(lines))+1):
    print(f"{i}: {lines[i-1]}")
