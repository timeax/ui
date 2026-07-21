import fs from 'fs';
import path from 'path';

const REGISTRY_DIR = './registry/new-york';
const ROOT_REGISTRY_PATH = './registry.json';

const NPM_DEPS_MAP = new Map([
    ['@radix-ui/react-aspect-ratio', '@radix-ui/react-aspect-ratio'],
    ['@radix-ui/react-dropdown-menu', '@radix-ui/react-dropdown-menu'],
    ['@radix-ui/react-scroll-area', '@radix-ui/react-scroll-area'],
    ['@radix-ui/react-slot', '@radix-ui/react-slot'],
    ['@radix-ui/react-checkbox', '@radix-ui/react-checkbox'],
    ['@radix-ui/react-dialog', '@radix-ui/react-dialog'],
    ['@radix-ui/react-popover', '@radix-ui/react-popover'],
    ['@radix-ui/react-tooltip', '@radix-ui/react-tooltip'],
    ['@radix-ui/react-sheet', '@radix-ui/react-sheet'],
    ['@radix-ui/react-tabs', '@radix-ui/react-tabs'],
    ['@radix-ui/react-alert-dialog', '@radix-ui/react-alert-dialog'],
    ['@radix-ui/react-select', '@radix-ui/react-select'],
    ['class-variance-authority', 'class-variance-authority'],
    ['clsx', 'clsx'],
    ['framer-motion', 'framer-motion'],
    ['lucide-react', 'lucide-react'],
    ['tailwind-merge', 'tailwind-merge'],
    ['@iconify/react', '@iconify/react'],
    ['@timeax/form-palette', '@timeax/form-palette']
]);

function getImports(fileContent) {
    const imports = [];
    const importRegex = /import\s+[\s\S]*?\s+from\s+['"]([^'"]+)['"]/g;
    let match;
    while ((match = importRegex.exec(fileContent)) !== null) {
        imports.push(match[1]);
    }
    return imports;
}

function resolveComponentDependency(importStr, currentDirName) {
    // Check if it's a relative import to another component directory
    if (importStr.startsWith('../')) {
        const parts = importStr.split('/');
        // e.g. ../date-text/date-text -> date-text
        if (parts[1] && parts[1] !== '..' && parts[1] !== '.') {
            return parts[1];
        }
    }
    
    // Check if it's an absolute import to our components
    if (importStr.startsWith('@/components/ui/')) {
        const parts = importStr.substring('@/components/ui/'.length).split('/');
        if (parts[0]) {
            return parts[0];
        }
    }
    
    if (importStr.startsWith('@/hooks/')) {
        const parts = importStr.substring('@/hooks/'.length).split('/');
        if (parts[0]) {
            return parts[0];
        }
    }

    return null;
}

function buildRegistry() {
    console.log('Building Shadcn Component Registry...');
    
    const folders = fs.readdirSync(REGISTRY_DIR).filter(file => {
        return fs.statSync(path.join(REGISTRY_DIR, file)).isDirectory();
    });
    
    const items = [];
    
    for (const folder of folders) {
        const folderPath = path.join(REGISTRY_DIR, folder);
        
        // Find existing json files
        const jsonFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.json'));
        
        if (jsonFiles.length > 0) {
            for (const jsonFile of jsonFiles) {
                const jsonPath = path.join(folderPath, jsonFile);
                try {
                    const item = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
                    
                    // Normalize paths in files
                    if (item.files) {
                        item.files = item.files.map(f => {
                            if (!f.path.startsWith('registry/')) {
                                f.path = `registry/new-york/${folder}/${f.path}`;
                            }
                            return f;
                        });
                    }
                    
                    items.push(item);
                    console.log(`Loaded existing registry definition: ${folder}/${jsonFile}`);
                } catch (e) {
                    console.error(`Error reading existing registry json ${jsonPath}:`, e);
                }
            }
        } else {
            // Generate metadata file
            console.log(`Generating registry metadata for component: ${folder}`);
            const tsFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.tsx') || file.endsWith('.ts'));
            
            const dependencies = new Set();
            const registryDependencies = new Set();
            const files = [];
            
            for (const file of tsFiles) {
                const filePath = path.join(folderPath, file);
                const content = fs.readFileSync(filePath, 'utf8');
                const imports = getImports(content);
                
                // Scan imports
                for (const imp of imports) {
                    // Check npm dependencies
                    for (const [npmKey, npmVal] of NPM_DEPS_MAP.entries()) {
                        if (imp === npmKey || imp.startsWith(npmKey + '/')) {
                            dependencies.add(npmVal);
                        }
                    }
                    
                    // Check registry dependencies
                    const regDep = resolveComponentDependency(imp, folder);
                    if (regDep && regDep !== folder) {
                        registryDependencies.add(regDep);
                    }
                }
                
                files.push({
                    path: `registry/new-york/${folder}/${file}`,
                    type: 'registry:ui'
                });
            }
            
            // Add radix-ui primitives based on standard components if not detected
            if (folder === 'checkbox') dependencies.add('@radix-ui/react-checkbox');
            if (folder === 'dialog') dependencies.add('@radix-ui/react-dialog');
            if (folder === 'dropdown-menu') dependencies.add('@radix-ui/react-dropdown-menu');
            if (folder === 'scroll-area') dependencies.add('@radix-ui/react-scroll-area');
            if (folder === 'select') dependencies.add('@radix-ui/react-select');
            if (folder === 'popover') dependencies.add('@radix-ui/react-popover');
            if (folder === 'tabs') dependencies.add('@radix-ui/react-tabs');
            if (folder === 'tooltip') dependencies.add('@radix-ui/react-tooltip');
            
            const generatedItem = {
                name: folder,
                type: 'registry:ui',
                dependencies: Array.from(dependencies),
                registryDependencies: Array.from(registryDependencies),
                files: files
            };
            
            // Write individual metadata JSON file
            const newJsonPath = path.join(folderPath, `${folder}.json`);
            fs.writeFileSync(newJsonPath, JSON.stringify(generatedItem, null, 2), 'utf8');
            console.log(`Created component JSON metadata: ${newJsonPath}`);
            
            items.push(generatedItem);
        }
    }
    
    const rootRegistry = {
        $schema: 'https://ui.shadcn.com/schema/registry.json',
        name: 'timeax',
        homepage: 'https://github.com/timeax/ui',
        items: items
    };
    
    fs.writeFileSync(ROOT_REGISTRY_PATH, JSON.stringify(rootRegistry, null, 2), 'utf8');
    console.log(`Successfully compiled root registry.json with ${items.length} items!`);
}

buildRegistry();
