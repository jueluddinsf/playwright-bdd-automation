const { When } = require('@cucumber/cucumber');
const clickActions = require('../actions/ClickActions');
const inputActions = require('../actions/InputActions');
const LocatorManager = require('../utils/LocatorManager');

When('I click {string}', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await clickActions.click(this.page, selector);
});

When('I double click {string}', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await clickActions.doubleClick(this.page, selector);
});

When('I click on text {string}', async function (text) {
    await clickActions.click(this.page, `text=${text}`);
});

When('I fill {string} with {string}', async function (key, value) {
    const selector = LocatorManager.getSelector(key);
    await inputActions.fill(this.page, selector, value);
});

When('I type {string} into {string}', async function (value, key) {
    const selector = LocatorManager.getSelector(key);
    await inputActions.type(this.page, selector, value);
});

When('I clear {string}', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await inputActions.clear(this.page, selector);
});

When('I select option {string} from {string}', async function (option, key) {
    const selector = LocatorManager.getSelector(key);
    await inputActions.selectOption(this.page, selector, option);
});

When('I check {string}', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await inputActions.check(this.page, selector);
});

When('I uncheck {string}', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await inputActions.uncheck(this.page, selector);
});

When('I upload file {string} to {string}', async function (filePath, key) {
    const selector = LocatorManager.getSelector(key);
    await inputActions.uploadFile(this.page, selector, filePath);
});

When('I press {string} on {string}', async function (pressKey, key) {
    const selector = LocatorManager.getSelector(key);
    await inputActions.press(this.page, selector, pressKey);
});

When('I hover over {string}', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await clickActions.hover(this.page, selector);
});

When('I drag {string} to {string}', async function (sourceKey, targetKey) {
    const source = LocatorManager.getSelector(sourceKey);
    const target = LocatorManager.getSelector(targetKey);
    await clickActions.dragAndDrop(this.page, source, target);
});

When('I scroll to {string}', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await inputActions.scroll(this.page, selector);
});

When('I focus on {string}', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await inputActions.focus(this.page, selector);
});
