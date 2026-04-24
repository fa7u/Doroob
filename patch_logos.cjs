const fs = require('fs');

function patch() {
    const newItems = JSON.parse(fs.readFileSync('formatted_investments.json', 'utf8'));
    let content = fs.readFileSync('src/App.tsx', 'utf8');

    const newItemsJson = JSON.stringify(newItems, null, 2);
    
    // Extract the body of the array (remove [ and ])
    const itemsBody = newItemsJson.slice(1, -1).trim();
    
    // Add indentation
    const indentedBody = itemsBody.split('\n').map(line => '      ' + line).join('\n');

    // Build the regex
    const regex = /("investments":\s*{\s*"title":\s*"استثمارات الأعضاء",\s*"items":\s*\[)([\s\S]*?)(\s*\]\s*},)/;

    const newContent = content.replace(regex, (match, prefix, oldBody, suffix) => {
        return prefix + '\n' + indentedBody + '\n    ' + suffix;
    });

    fs.writeFileSync('src/App.tsx', newContent);
    console.log("Successfully patched src/App.tsx with 30 new logos.");
}

patch();
