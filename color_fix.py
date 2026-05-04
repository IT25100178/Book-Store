import os

src_dir = r'c:\Users\VICTUS\Downloads\book details\lankabooks-frontend\src'
for root, dirs, files in os.walk(src_dir):
    for f in files:
        if f.endswith('.jsx'):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8') as file:
                content = file.read()
            
            # Replace dark mode specific hardcoded colors with CSS variables
            content = content.replace("'#161616'", "'var(--bg-card)'")
            content = content.replace('"#161616"', '"var(--bg-card)"')
            
            content = content.replace("'#111111'", "'var(--bg-main)'")
            content = content.replace('"#111111"', '"var(--bg-main)"')
            
            content = content.replace("'#1c1c1c'", "'var(--bg-hover)'")
            content = content.replace('"#1c1c1c"', '"var(--bg-hover)"')
            
            content = content.replace("'#222222'", "'var(--border-color)'")
            content = content.replace('"#222222"', '"var(--border-color)"')
            content = content.replace("'#222'", "'var(--border-color)'")
            
            content = content.replace("'#333333'", "'var(--border-color)'")
            content = content.replace('"#333333"', '"var(--border-color)"')
            content = content.replace("'#333'", "'var(--border-color)'")
            
            content = content.replace("'#0A0A0A'", "'var(--bg-main)'")
            
            with open(path, 'w', encoding='utf-8') as file:
                file.write(content)
