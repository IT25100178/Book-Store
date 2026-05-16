import os

src_dir = r'c:\Users\VICTUS\Downloads\book details\lankabooks-frontend\src'
for root, dirs, files in os.walk(src_dir):
    for f in files:
        if f.endswith('.jsx'):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8') as file:
                content = file.read()
            
            # Fix text colors that were wrongly assigned to background variables
            content = content.replace("color: 'var(--bg-main)'", "color: 'var(--text-main)'")
            content = content.replace('color: "var(--bg-main)"', 'color: "var(--text-main)"')
            content = content.replace("color: 'var(--bg-card)'", "color: 'var(--text-main)'")
            content = content.replace('color: "var(--bg-card)"', 'color: "var(--text-main)"')
            
            content = content.replace("color: 'var(--border-color)'", "color: 'var(--text-muted)'")
            content = content.replace('color: "var(--border-color)"', 'color: "var(--text-muted)"')
            
            with open(path, 'w', encoding='utf-8') as file:
                file.write(content)
