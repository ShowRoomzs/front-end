import re, sys, html
from html.parser import HTMLParser

class Extract(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack=[]; self.out=[]; self.screen=None
    def handle_starttag(self, tag, attrs):
        a=dict(attrs); style=a.get('style','')
        if 'data-screen-label' in a:
            self.screen=a['data-screen-label']
        self.stack.append(style)
    def handle_endtag(self, tag):
        if self.stack: self.stack.pop()
    def handle_data(self, data):
        t=' '.join(data.split())
        if not t or not self.screen: return
        style=self.stack[-1] if self.stack else ''
        # 가장 가까운 조상 중 font/color 가진 스타일
        font=color=''
        for s in reversed(self.stack):
            if not font:
                m=re.search(r'font:\s*([^;]+)',s)
                if m: font=m.group(1).strip()
            m2=re.search(r'font-size:\s*([^;]+)',s)   # 뒤에서 덮어쓴 값이 최종
            if m2: font=(font+' | FINAL-SIZE '+m2.group(1).strip())
            if not color:
                m=re.search(r'(?<!background-)(?<!border-)\bcolor:\s*([^;]+)',s)
                if m: color=m.group(1).strip()
            if font and color: break
        self.out.append((self.screen,t,font,color))

src=open(sys.argv[1],encoding='utf-8').read()
p=Extract(); p.feed(src)
want=sys.argv[2] if len(sys.argv)>2 else None
for sc,t,f,c in p.out:
    if want and want not in sc: continue
    if len(t)>46: t=t[:46]+'…'
    print(f"{t}\n    font={f or '-'}  color={c or '-'}")
