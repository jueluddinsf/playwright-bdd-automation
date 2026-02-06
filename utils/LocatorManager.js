const fs = require('fs');
const path = require('path');

class LocatorManager {
    constructor() {
        this.locators = {};
        this.loadLocators();
    }

    loadLocators() {
        const locatorsDir = path.join(__dirname, '../locators');
        if (fs.existsSync(locatorsDir)) {
            const files = fs.readdirSync(locatorsDir);
            files.forEach(file => {
                if (path.extname(file) === '.json') {
                    const name = path.basename(file, '.json');
                    if (this.locators[name]) {
                        console.warn(`Warning: Duplicate locator file found for '${name}'. Overwriting.`);
                    }
                    try {
                        const content = JSON.parse(fs.readFileSync(path.join(locatorsDir, file), 'utf8'));
                        this.locators[name] = content;
                    } catch (e) {
                        console.error(`Error parsing locator file ${file}: ${e.message}`);
                    }
                }
            });
        }
    }

    getSelector(key) {
        // 1. Guard against common selector types that might contain dots but aren't page lookups
        const rawPrefixes = ['text=', 'xpath=', 'css=', '#', '//', 'button=', 'role='];
        if (rawPrefixes.some(prefix => key.startsWith(prefix))) {
            return key;
        }

        // 2. Expected format: "pageName.keyName" e.g., "login.username"
        if (!key.includes('.')) {
            return key;
        }

        const [page, ...rest] = key.split('.');
        // Ensure we strictly have a Page and Key structure
        if (rest.length === 0) return key;

        // If generic page exists, enforce looking up the key
        if (this.locators[page]) {
            const elementKey = rest.join('.');
            const pageLocators = this.locators[page];

            if (Object.prototype.hasOwnProperty.call(pageLocators, elementKey)) {
                return pageLocators[elementKey];
            } else {
                throw new Error(`Locator '${elementKey}' not found in page '${page}'. Check your ${page}.json file.`);
            }
        }

        // If page doesn't exist, we assume it's just a raw selector with a dot (e.g. "div.class")
        return key;
    }
}

module.exports = new LocatorManager();
