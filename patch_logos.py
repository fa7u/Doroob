import json
import re

def patch():
    # Load the new data
    with open('formatted_investments.json', 'r', encoding='utf-8') as f:
        new_items = json.load(f)

    # Load the App.tsx content
    with open('src/App.tsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # Create the new JSON string for items
    # We want it formatted similarly to the original
    new_items_json = json.dumps(new_items, indent=2, ensure_ascii=False)
    # Indent it correctly for App.tsx (it uses 6 spaces for objects)
    # The default indent=2 from json.dumps will be used as a base
    indented_items = []
    for line in new_items_json.split('\n'):
        indented_items.append('      ' + line)
    
    # We want to replace the whole bracket content
    # Look for "investments": { ... "items": [ ... ]
    # Using regex to find the specific investments block
    pattern = r'("investments":\s*{\s*"title":\s*"استثمارات الأعضاء",\s*"items":\s*\[)(.*?)(\s*\]\s*},)'
    
    def replacer(match):
        prefix = match.group(1)
        suffix = match.group(3)
        # We replace the middle part (match.group(2)) with our new items
        # formatted_investments.json is a list, we want what's inside the [ ]
        items_body = new_items_json[1:-1].strip()
        # Add 6 spaces indentation to each line of items_body
        lines = items_body.split('\n')
        indented_lines = []
        for line in lines:
            indented_lines.append('      ' + line)
        
        return prefix + '\n' + '\n'.join(indented_lines) + '\n    ' + suffix

    new_content = re.sub(pattern, replacer, content, flags=re.DOTALL)

    # Save the result
    with open('src/App.tsx', 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("Successfully patched src/App.tsx with 30 new logos.")

if __name__ == "__main__":
    patch()
