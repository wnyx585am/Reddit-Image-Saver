// Run content.js in the active tab when the toolbar button is clicked
browser.browserAction.onClicked.addListener((tab) => {
    browser.tabs.executeScript(tab.id, { file: "content.js" })
        .catch((err) => console.error("Injection failed:", err));
});

// Download API is only available here, not in content scripts
browser.runtime.onMessage.addListener((msg) => {
    if (msg.type === "download") {
        browser.downloads.download({
            url: msg.url,
            filename: msg.filename,
            saveAs: false
        });
    }
});