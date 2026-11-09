import browser from "webextension-polyfill";

const brightnessSlider = document.getElementById("brightnessSlider");
const storePreferenceCheck = document.getElementById("storePreferenceCheck");

const getDomain = (url) => {
    try {
        const parsedUrl = new URL(url);
        if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
            return null;
        }
        return parsedUrl.origin.replace(/^(https?:\/\/)www\./, "$1");
    } catch {
        return null;
    }
};

const storeLocalBrightness = async (domain) => {
    const result = await browser.storage.local.get("knownWebsites");
    const knownWebsites = result.knownWebsites || [];
    const existingSite = knownWebsites.find((site) => site.domain === domain);

    if (existingSite) {
        existingSite.brightness = brightnessSlider.value;
    } else {
        knownWebsites.push({ domain, brightness: brightnessSlider.value });
    }

    await browser.storage.local.set({ knownWebsites });
};

const removeLocalBrightness = async (domain) => {
    const result = await browser.storage.local.get("knownWebsites");
    const knownWebsites = (result.knownWebsites || []).filter(
        (site) => site.domain !== domain
    );
    await browser.storage.local.set({ knownWebsites });
};

const initializePopup = async () => {
    const [activeTab] = await browser.tabs.query({
        active: true,
        lastFocusedWindow: true,
    });
    const domain = getDomain(activeTab?.url);

    if (!domain) {
        brightnessSlider.disabled = true;
        storePreferenceCheck.disabled = true;
        return;
    }

    const result = await browser.storage.local.get([
        "knownWebsites",
        "globalBrightness",
    ]);
    const sitePreference = (result.knownWebsites || []).find(
        (site) => site.domain === domain
    );

    if (sitePreference) {
        storePreferenceCheck.checked = true;
        brightnessSlider.value = sitePreference.brightness;
    } else if (result.globalBrightness !== undefined) {
        brightnessSlider.value = result.globalBrightness;
    }

    brightnessSlider.addEventListener("input", async () => {
        if (storePreferenceCheck.checked) {
            await storeLocalBrightness(domain);
        } else {
            await browser.storage.local.set({
                globalBrightness: brightnessSlider.value,
            });
        }
    });

    storePreferenceCheck.addEventListener("change", async () => {
        if (storePreferenceCheck.checked) {
            await storeLocalBrightness(domain);
        } else {
            await removeLocalBrightness(domain);
        }
    });
};

initializePopup();
