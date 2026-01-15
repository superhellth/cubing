const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const OUTPUT_PATH = path.join(__dirname, './packages/frontend/public/licenses.json');

console.log('Asking pnpm for production dependency tree...');

try {
  // 1. Ask pnpm to list all production dependencies recursively in JSON format
  // --prod: Exclude devDependencies
  // --depth Infinity: Get all nested dependencies
  // --json: Machine readable output
  // --long: Include details like "path" (crucial!)
  const pnpmOutput = execSync('pnpm list --prod --depth Infinity --json --long', {
    cwd: __dirname, // Run in this package's directory
    maxBuffer: 1024 * 1024 * 10 // Increase buffer for large trees
  }).toString();

  const pnpmData = JSON.parse(pnpmOutput);
  
  // pnpm returns an array (workspaces). We want the current project (usually the first item or find by name)
  const currentProject = pnpmData.find(p => p.name === require('./packages/frontend/package.json').name) || pnpmData[0];

  const packagesMap = new Map();

  // 2. Recursive function to traverse the pnpm tree
  function traverse(deps) {
    if (!deps) return;
    
    Object.entries(deps).forEach(([name, info]) => {
      // Create a unique key based on name and version
      const key = `${name}@${info.version}`;

      // Avoid duplicates
      if (packagesMap.has(key)) return;

      // 3. Process this package
      if (info.path) {
        try {
          // Read package.json for metadata
          const pkgJsonPath = path.join(info.path, 'package.json');
          if (fs.existsSync(pkgJsonPath)) {
            const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
            
            // Try to find license text file
            let licenseText = 'License text not found.';
            const licenseFiles = ['LICENSE', 'LICENSE.md', 'LICENSE.txt', 'COPYING', 'MIT-LICENSE'];
            
            for (const file of licenseFiles) {
              const licensePath = path.join(info.path, file);
              if (fs.existsSync(licensePath)) {
                licenseText = fs.readFileSync(licensePath, 'utf-8');
                break;
              }
            }

            packagesMap.set(key, {
              name: name,
              version: info.version,
              licenses: pkgJson.license || (pkgJson.licenses && pkgJson.licenses[0]?.type) || 'Unknown',
              repository: pkgJson.repository?.url || pkgJson.repository,
              publisher: pkgJson.author?.name || pkgJson.author,
              licenseText: licenseText
            });
          }
        } catch (e) {
          console.warn(`Error reading details for ${key}:`, e.message);
        }
      }

      // Recurse into this package's dependencies
      if (info.dependencies) {
        traverse(info.dependencies);
      }
    });
  }

  // Start traversal
  traverse(currentProject.dependencies);

  // 4. Convert Map to Object and Write
  const formattedPackages = Object.fromEntries(packagesMap);
  
  const dir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(formattedPackages, null, 2));
  console.log(`Generated licenses for ${packagesMap.size} packages at ${OUTPUT_PATH}`);

} catch (err) {
  console.error("Failed to generate licenses:", err);
  process.exit(1);
}