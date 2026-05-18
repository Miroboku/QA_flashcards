with open('index.html', encoding='utf-8', errors='replace') as f:
    lines = f.readlines()

depth = 0
for i in range(100, 2500):
    line = lines[i]
    opens = line.count('<div')
    closes = line.count('</div')
    depth += opens - closes
    
    if 'id=' in line and ('tab-' in line or 'theory' in line):
        print(f'L{i+1}: depth={depth} -> {line.strip()[:60]}')

