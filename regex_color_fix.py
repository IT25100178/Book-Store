import os
import re

src_dir = r'c:\Users\VICTUS\Downloads\book details\lankabooks-frontend\src'
for root, dirs, files in os.walk(src_dir):
    for f in files:
        if f.endswith('.jsx'):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8') as file:
                content = file.read()
            
            # Use regex to catch #111, #161616, #1c1c1c, #222, #333 etc inside quotes or backticks
            # We want to replace exactly the string "#111" etc.
            
            # Backgrounds
            content = re.sub(r"(['`\"])#(?:161616|111|111111|0a0a0a|0A0A0A)\1", r"\1var(--bg-card)\1", content)
            
            # Hover / subtle backgrounds
            content = re.sub(r"(['`\"])#(?:1c1c1c|1C1C1C)\1", r"\1var(--bg-hover)\1", content)
            
            # Borders
            content = re.sub(r"(['`\"])#(?:222|222222|333|333333)\1", r"\1var(--border-color)\1", content)
            
            # If they are embedded in a string like `1px solid #1c1c1c`
            content = re.sub(r"#(?:161616|111|111111|0a0a0a|0A0A0A)\b", "var(--bg-card)", content)
            content = re.sub(r"#(?:1c1c1c|1C1C1C)\b", "var(--bg-hover)", content)
            content = re.sub(r"#(?:222|222222|333|333333)\b", "var(--border-color)", content)
            
            with open(path, 'w', encoding='utf-8') as file:
                file.write(content)
