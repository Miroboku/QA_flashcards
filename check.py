from html.parser import HTMLParser

class MyHTMLParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.depth = 0
        self.tags = []
        
    def handle_starttag(self, tag, attrs):
        if tag in ('div', 'main', 'section', 'article', 'nav', 'aside'):
            self.depth += 1
            attr_dict = dict(attrs)
            if 'id' in attr_dict:
                self.tags.append((self.depth, tag, attr_dict['id'], self.getpos()[0]))

    def handle_endtag(self, tag):
        if tag in ('div', 'main', 'section', 'article', 'nav', 'aside'):
            self.depth -= 1

parser = MyHTMLParser()
with open('index.html', encoding='utf-8') as f:
    parser.feed(f.read())

for depth, tag, ident, line in parser.tags:
    if 'tab-' in ident or 'theory' in ident or 'practice' in ident:
        print(f"L{line}: Depth {depth}: <{tag} id={ident}>")
