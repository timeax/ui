import fs from 'fs';

const README_PATH = './README.md';

function updateReadme() {
    let content = fs.readFileSync(README_PATH, 'utf8');
    
    // Replace all full JSON URLs with the new shorthand format
    // E.g., https://raw.githubusercontent.com/timeax/ui/main/public/r/smart-button.json -> timeax/ui/smart-button
    content = content.replace(
        /https:\/\/raw\.githubusercontent\.com\/timeax\/ui\/main\/public\/r\/([a-zA-Z0-9-_<>]+)\.json/g,
        'timeax/ui/$1'
    );
    
    fs.writeFileSync(README_PATH, content, 'utf8');
    console.log('Successfully updated README.md with the shorthand shadcn installation syntax!');
}

updateReadme();
