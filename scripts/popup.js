const brightnessSlider = document.getElementById("brightnessSlider");
const storePreferenceCheck = document.getElementById("storePreferenceCheck");
const options = document.getElementById("options");
let domain;

chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    let urlObject = new URL(tabs[0].url);
    domain = urlObject.origin.replace("www.", "");
});

const restorePopup = async () => {
    const result = await chrome.storage.local.get(["knownWebsites", "globalBrightness"])
    if (result.knownWebsites?.length) {

        let index = result.knownWebsites.findIndex((obj) => obj.domain === domain);

        if (index != -1) {
            storePreferenceCheck.checked = true;
            let brightness = result.knownWebsites[index].brightness;

            brightnessSlider.value = brightness;
            return;
        }
    }
    if (result.globalBrightness !== undefined) {
        brightnessSlider.value = result.globalBrightness;
    }
} 

const storeLocalBrightness = async () => {
    let knownWebsites = [];
    let result = await chrome.storage.local.get("knownWebsites")
    knownWebsites = result.knownWebsites || [];
    
    let index = knownWebsites.findIndex((obj) => obj.domain === domain);
    if (index != -1) {
        knownWebsites[index].brightness = brightnessSlider.value
    }
    else{
        knownWebsites.push({ domain, brightness: (brightnessSlider.value) });
    }

    chrome.storage.local.set({ knownWebsites });
}

const removeLocalBrightness = async () => {
    let knownWebsites = [];
    let result = await chrome.storage.local.get("knownWebsites")
    knownWebsites = result.knownWebsites || [];
    
    let index = knownWebsites.findIndex((obj) => obj.domain === domain);
    if (index != -1) {
        knownWebsites.splice(index, 1);
    }

    chrome.storage.local.set({ knownWebsites });
}

const setLocalBrightness = async = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs[0].url?.startsWith("chrome://")) return;
        chrome.scripting.executeScript(
            {
                target: { tabId: tabs[0].id },
                files: ["scripts/content.js"],
            },
            () => {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: () => {
                        setLocalBrightness();
                    },
                });
            }
        );
    });
}

const setGlobalBrightness = async = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs[0].url?.startsWith("chrome://")) return;
        chrome.scripting.executeScript(
            {
                target: { tabId: tabs[0].id },
                files: ["scripts/content.js"],
            },
            () => {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: () => {
                        setGlobalBrightness();
                    },
                });
            }
        );
    });
}

const storeGlobalBrightness = async () => {
    chrome.storage.local.set({ globalBrightness: (brightnessSlider.value) })
}

const sliderInput = () => {
    if (storePreferenceCheck.checked){
        storeLocalBrightness()
        setLocalBrightness()
    }
    else{
        storeGlobalBrightness()
        setGlobalBrightness()
    }
}

const checkboxInput = () => {
    if (storePreferenceCheck.checked){
        storeLocalBrightness()
        setLocalBrightness()
    }
    else{
        removeLocalBrightness()
    }
}

restorePopup()
brightnessSlider.addEventListener("input", sliderInput);
storePreferenceCheck.addEventListener("change", checkboxInput);

