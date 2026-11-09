import browser from "webextension-polyfill";

const domain = new URL(location.href).origin.replace(
    /^(https?:\/\/)www\./,
    "$1"
);
const root = document.documentElement;

const applyBrightness = async () => {
    const result = await browser.storage.local.get([
        "knownWebsites",
        "globalBrightness",
    ]);
    const sitePreference = (result.knownWebsites || []).find(
        (site) => site.domain === domain
    );
    const brightness = sitePreference?.brightness ?? result.globalBrightness;

    if (brightness === undefined) {
        root.style.removeProperty("filter");
        return;
    }

    root.style.setProperty("filter", `brightness(${brightness / 100})`, "important");
};

applyBrightness();
browser.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "local" && (changes.knownWebsites || changes.globalBrightness)) {
        applyBrightness();
    }
});