import fs from 'fs';

const data = JSON.parse(fs.readFileSync('investments_dump.json', 'utf8'));
// Sort by ID to ensure correct order
data.sort((a, b) => a.id - b.id);

const result = data.slice(0, 30).map(item => ({
  id: item.id,
  name: item.name,
  image: item.image
}));

console.log(JSON.stringify(result, null, 2));
