// scripts/generate-licenses.js
const checker = require('license-checker');
const fs = require('fs');
const path = require('path');

const OUTPUT_PATH = path.join(__dirname, './packages/frontend/src/assets/licenses.json'); // Adjust path as needed

checker.init({
    start: path.join(__dirname, './'), // Project root
    production: true, // Exclude devDependencies
    // We only want the specific data we need
}, (err, packages) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }

    const formattedPackages = {};

    Object.keys(packages).filter(key => key !== "cubing@1.0.0").forEach(key => {
        const pkg = packages[key];
        const atIndex = key.lastIndexOf('@');
        const name = atIndex > 0 ? key.substring(0, atIndex) : key;
        // 1. Read the license content from the file system
        let licenseText = 'License text not found.';
        if (pkg.licenseFile && fs.existsSync(pkg.licenseFile)) {
            try {
                licenseText = fs.readFileSync(pkg.licenseFile, 'utf-8');
            } catch (e) {
                console.warn(`Could not read license file for ${key}`);
            }
        }

        // 2. Create a clean object for your frontend
        formattedPackages[key] = {
            name: name,
            licenses: pkg.licenses,
            repository: pkg.repository,
            publisher: pkg.publisher,
            licenseText: licenseText // <--- The full legal text
        };
    });

    // 3. Write to JSON file
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(formattedPackages, null, 2));
    console.log(`Licenses generated at ${OUTPUT_PATH}`);
});