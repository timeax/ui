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

function buildRegistry() {
    console.log('Building Shadcn Component Registry with strict components.json alias rules...');
    
    const folders = fs.readdirSync(REGISTRY_DIR).filter(file => {
        return fs.statSync(path.join(REGISTRY_DIR, file)).isDirectory();
    });
    
    const items = [];
    
    for (const folder of folders) {
        const folderPath = path.join(REGISTRY_DIR, folder);
        const jsonFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.json'));
        
        let item;
        const tsFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.tsx') || file.endsWith('.ts'));
        
        if (jsonFiles.length > 0) {
            const jsonPath = path.join(folderPath, jsonFiles[0]);
            try {
                item = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
                console.log(`Loaded existing registry definition: ${folder}/${jsonFiles[0]}`);
            } catch (e) {
                console.error(`Error reading registry json ${jsonPath}:`, e);
            }
        }
        
        if (!item) {
            item = {
                name: folder,
                type: folder === 'hooks' ? 'registry:hook' : 'registry:ui',
                dependencies: [],
                registryDependencies: [],
                files: []
            };
        }
        
        // Auto-detect dependencies & files if not present or to ensure updates
        const dependencies = new Set(item.dependencies || []);
        const registryDependencies = new Set(item.registryDependencies || []);
        
        for (const file of tsFiles) {
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
        
        item.dependencies = Array.from(dependencies);
        item.registryDependencies = Array.from(registryDependencies);
        
        // strictly enforce shadcn target and file types
        item.files = tsFiles.map(file => {
            const isHook = folder === 'hooks' || file.startsWith('use-');
            return {
                path: `registry/new-york/${folder}/${file}`,
                type: isHook ? 'registry:hook' : 'registry:component',
                target: isHook ? `@hooks/${file}` : `@ui/${file}`
            };
        });
        
        // Save back individual JSON with normalized properties
        const individualJsonPath = path.join(folderPath, jsonFiles[0] || `${folder}.json`);
        fs.writeFileSync(individualJsonPath, JSON.stringify(item, null, 2), 'utf8');
        console.log(`Updated component JSON metadata: ${individualJsonPath}`);
        
        items.push(item);
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
