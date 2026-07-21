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

function resolveComponentDependency(imp, folder) {
    if (imp.startsWith('../')) {
        const parts = imp.split('/');
        if (parts[1] && parts[1] !== '..' && parts[1] !== '.') {
            return parts[1];
        }
    }
    if (imp.startsWith('@/components/ui/')) {
        const parts = imp.substring('@/components/ui/'.length).split('/');
        if (parts[0]) {
            return parts[0];
        }
    }
    if (imp.startsWith('@/hooks/')) {
        const parts = imp.substring('@/hooks/'.length).split('/');
        if (parts[0]) {
            return parts[0];
        }
    }
    return null;
}

function cleanExistingJsonFiles(folderPath) {
    const jsonFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.json'));
    for (const jsonFile of jsonFiles) {
        fs.unlinkSync(path.join(folderPath, jsonFile));
    }
}

function buildRegistry() {
    console.log('Building Shadcn Component Registry with separated demo blocks...');
    
    const folders = fs.readdirSync(REGISTRY_DIR).filter(file => {
        return fs.statSync(path.join(REGISTRY_DIR, file)).isDirectory();
    });
    
    const items = [];
    
    for (const folder of folders) {
        const folderPath = path.join(REGISTRY_DIR, folder);
        const tsFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.tsx') || file.endsWith('.ts'));
        
        // Clean all JSON files in the folder first so we recreate them cleanly
        cleanExistingJsonFiles(folderPath);
        
        const coreFiles = tsFiles.filter(file => !/[-_]demo\.(tsx|ts)$/i.test(file));
        const demoFiles = tsFiles.filter(file => /[-_]demo\.(tsx|ts)$/i.test(file));
        
        // 1. Build Core Component Item
        if (coreFiles.length > 0) {
            const dependencies = new Set();
            const registryDependencies = new Set();
            
            for (const file of coreFiles) {
                const filePath = path.join(folderPath, file);
                const content = fs.readFileSync(filePath, 'utf8');
                const imports = getImports(content);
                
                for (const imp of imports) {
                    for (const [npmKey, npmVal] of NPM_DEPS_MAP.entries()) {
                        if (imp === npmKey || imp.startsWith(npmKey + '/')) {
                            dependencies.add(npmVal);
                        }
                    }
                    const regDep = resolveComponentDependency(imp, folder);
                    if (regDep && regDep !== folder) {
                        registryDependencies.add(regDep);
                    }
                }
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
            
            const coreItem = {
                name: folder,
                type: folder === 'hooks' ? 'registry:hook' : 'registry:ui',
                dependencies: Array.from(dependencies),
                registryDependencies: Array.from(registryDependencies),
                files: coreFiles.map(file => {
                    const isHook = folder === 'hooks' || file.startsWith('use-');
                    return {
                        path: `registry/new-york/${folder}/${file}`,
                        type: isHook ? 'registry:hook' : 'registry:component',
                        target: isHook ? `@hooks/${file}` : `@ui/${file}`
                    };
                })
            };
            
            const coreJsonPath = path.join(folderPath, `${folder}.json`);
            fs.writeFileSync(coreJsonPath, JSON.stringify(coreItem, null, 2), 'utf8');
            console.log(`Created core JSON: ${coreJsonPath}`);
            items.push(coreItem);
        }
        
        // 2. Build Demo Block Item (if demo files exist)
        if (demoFiles.length > 0) {
            const dependencies = new Set();
            const registryDependencies = new Set([folder]); // Depends on the core component
            
            for (const file of demoFiles) {
                const filePath = path.join(folderPath, file);
                const content = fs.readFileSync(filePath, 'utf8');
                const imports = getImports(content);
                
                for (const imp of imports) {
                    for (const [npmKey, npmVal] of NPM_DEPS_MAP.entries()) {
                        if (imp === npmKey || imp.startsWith(npmKey + '/')) {
                            dependencies.add(npmVal);
                        }
                    }
                    const regDep = resolveComponentDependency(imp, folder);
                    if (regDep && regDep !== folder) {
                        registryDependencies.add(regDep);
                    }
                }
            }
            
            const demoItem = {
                name: `${folder}-demo`,
                type: 'registry:block',
                dependencies: Array.from(dependencies),
                registryDependencies: Array.from(registryDependencies),
                files: demoFiles.map(file => {
                    return {
                        path: `registry/new-york/${folder}/${file}`,
                        type: 'registry:block',
                        target: `@ui/${file}`
                    };
                })
            };
            
            const demoJsonPath = path.join(folderPath, `${folder}-demo.json`);
            fs.writeFileSync(demoJsonPath, JSON.stringify(demoItem, null, 2), 'utf8');
            console.log(`Created demo JSON: ${demoJsonPath}`);
            items.push(demoItem);
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
