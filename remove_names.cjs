const fs = require('fs');

function removeNames() {
    console.log("Reading formatted_investments.json...");
    const data = JSON.parse(fs.readFileSync('formatted_investments.json', 'utf8'));
    
    console.log("Removing 'name' field from all items...");
    const updatedData = data.map(item => {
        const { name, ...rest } = item;
        return rest;
    });

    console.log("Saving updated data back to formatted_investments.json...");
    fs.writeFileSync('formatted_investments.json', JSON.stringify(updatedData, null, 2));
    console.log("Done!");
}

removeNames();
