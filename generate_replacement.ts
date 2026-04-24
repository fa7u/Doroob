
import fs from 'fs';

const top15 = JSON.parse(fs.readFileSync('top15.json', 'utf8'));
const formattedItems = JSON.stringify(top15, null, 2).replace(/"image": "(data:image\/[^;]+;base64,[^"]+)"/g, (match, p1) => {
    // Keep it as is
    return `"image": "${p1}"`;
});

const replacementContent = `    "items": ${formattedItems}`;
fs.writeFileSync('replacement.txt', replacementContent);
console.log("Replacement content generated in replacement.txt");
