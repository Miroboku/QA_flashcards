from html.parser import HTMLParser

class MyHTMLParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack = []
        self.target_parent = None
        
    def handle_starttag(self, tag, attrs):
        attr_dict = dict(attrs)
        self.stack.append((tag, attr_dict.get('id', '')))
        
        if attr_dict.get('id') == 'tab-cards':
            self.target_parent = self.stack[-2]

    def handle_endtag(self, tag):
        # find last matching tag
        for i in range(len(self.stack)-1, -1, -1):
            if self.stack[i][0] == tag:
                self.stack.pop(i)
                break

parser = MyHTMLParser()
with open('index.html', encoding='utf-8') as f:
    parser.feed(f.read())

print(f"Parent of tab-cards is: {parser.target_parent}")
