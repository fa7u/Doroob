
import fs from 'fs';

try {
    const data = JSON.parse(fs.readFileSync('./formatted_investments.json', 'utf8'));
    const cleanedData = data.map(({ name, ...rest }) => rest);
    fs.writeFileSync('./formatted_investments.json', JSON.stringify(cleanedData, null, 2));
    console.log("Successfully cleaned formatted_investments.json by removing 'name' fields.");
} catch (e) {
    console.error("Error cleaning JSON:", e.message);
}
