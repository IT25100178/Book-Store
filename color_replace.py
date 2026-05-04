import os

src_dir = r'c:\Users\VICTUS\Downloads\book details\lankabooks-frontend\src'
for root, dirs, files in os.walk(src_dir):
    for f in files:
        if f.endswith('.jsx'):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8') as file:
                content = file.read()
            
            # Replace inline color values with CSS variables
            content = content.replace("'white'", "'var(--bg-card)'")
            content = content.replace('"white"', '"var(--bg-card)"')
            content = content.replace("'#FFFFFF'", "'var(--bg-card)'")
            content = content.replace("'#F8FAFC'", "'var(--bg-main)'")
            content = content.replace("'#F1F5F9'", "'var(--bg-hover)'")
            content = content.replace("'#0F172A'", "'var(--text-main)'")
            content = content.replace("'#1E293B'", "'var(--text-main)'")
            content = content.replace("'#475569'", "'var(--text-muted)'")
            content = content.replace("'#64748B'", "'var(--text-muted)'")
            content = content.replace("'#94A3B8'", "'var(--text-light)'")
            content = content.replace("'#E2E8F0'", "'var(--border-color)'")
            content = content.replace("'#CBD5E1'", "'var(--border-color)'")
            
            with open(path, 'w', encoding='utf-8') as file:
                file.write(content)
