import codecs, re
path = 'docs/index.html'
text = codecs.open(path,'r','utf-8-sig').read()

# Replace BtoB with B2C globally
text = text.replace('BtoB', 'B2C')

# Remove "採用・" and "・採用" and "採用/" and "/採用"
text = text.replace('採用・', '')
text = text.replace('・採用', '')
text = text.replace('採用/', '')
text = text.replace('/採用', '')

codecs.open(path,'w','utf-8-sig').write(text)
print('updated')
