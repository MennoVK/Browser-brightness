html = document.documentElement;
urlObject = new URL(location.href);
domain = urlObject.origin.replace("www.", "");

const setGlobalBrightness = async () => {
    const result = await chrome.storage.local.get("globalBrightness");
    const globalBrightness = result.globalBrightness;
    html.style.setProperty("filter", `brightness(${globalBrightness / 100})`, "important");
};

const setLocalBrightness = async () => {
    const result = await chrome.storage.local.get("knownWebsites");
    if (result.knownWebsites?.length) {
        let index = result.knownWebsites.findIndex((obj) => obj.domain === domain);

        if (index != -1) {
            let brightness = result.knownWebsites[index].brightness;

            html.style.setProperty("filter", `brightness(${brightness / 100})`, "important");
            return;
        }
    }
    setGlobalBrightness();
};

setLocalBrightness();