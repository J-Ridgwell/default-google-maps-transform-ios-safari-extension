console.log("running content.js");
const elementToObserve = document.querySelector("body");
const wazeAuthority = "https://waze.com/ul"; // Requires '&navigate=yes' to be appended
const appleMapsAuthority = "maps://maps.apple.com/";
const authority = appleMapsAuthority;
const observeOptions = { subtree: false, childList: true, attributes: false };
const moreResultsBtn = document.getElementsByTagName('g-more-link')[0];
const seeOtherLocationsBtn = document.querySelector('[data-attrid^="see more locations"]');
const querySelectorString = '[data-url^="https://maps.google.com"], [href^="https://maps.google.com"], [data-link^="https://maps.google.com"]';

const observer = new MutationObserver(() => {
//        console.log('observer is triggered');
        findElements();
});

window.addEventListener('load', (event) => {
    console.info('Find elements upon finished loading');
    findElements();
    observer.observe(elementToObserve, observeOptions);
    
});

moreResultsBtn?.addEventListener('click', (event) => {
//    console.log('More results button clicked');
});

seeOtherLocationsBtn?.addEventListener('click', (event) => {
//    console.log('More results button clicked');
    

});

function findElements() {
    try {
        let elems = document.querySelectorAll(querySelectorString);
        console.log(elems.length);

        for (const elem of elems) {
            const attributeKey = elem.getAttribute('data-url') ? 'data-url' : elem.getAttribute('data-link') ? 'data-link' : 'href';
            const attributeValue = elem.getAttribute(attributeKey);
            extractAddress(elem, attributeValue);
            const converted = googleToApple(elem, attributeValue);
//            console.info(`converted url: ${converted}`)
            elem.setAttribute(attributeKey, converted ?? attributeValue);
        }

    } catch (e) {
        console.error("error in findElements(): " + e.toString());
    }
}


function extractAddress(elem, attributeValue) {
    let url = attributeValue.toString();
    const stringToFind = 'https://maps.google.com/maps/dir//';
    const stringToFind1 = 'https://maps.google.com/maps/place//data=';
    const stringToFind2 = 'https://maps.google.com/maps?q=';
    let address;
    console.info(`Original URL: ${url}`);

    if (url.includes(stringToFind)) {
        try {
            address = url.slice(stringToFind.length, url.indexOf('/data=')).replaceAll(',','');
        } catch (e) {
            console.error(`Error in stringToFind manipulation: ${e.toString()}`);
            return null;
        }
    }
    
    if (authority.includes("waze")) {
        address?.replaceAll('+', "%20");
    }
    
    return address;

}

function googleToApple(elem, attributeValue) {
    let url = attributeValue.toString();
    const stringToFind = 'https://maps.google.com/maps/dir//';
    const stringToFind1 = 'https://maps.google.com/maps/place//data=';
    const stringToFind2 = 'https://maps.google.com/maps?q=';
    
//    console.info(`Original URL: ${url}`);
    
    if (url.indexOf(stringToFind) != -1) {
        try {
            let urlBuilder = url.slice(stringToFind.length, url.indexOf('/data=')).replaceAll(',','');
            return `${authority}?daddr=${urlBuilder}`;
        } catch (e) {
            console.error(`Error in stringToFind manipulation: ${e.toString()}`);
            return null;
        }
    }
    
    if (url.indexOf(stringToFind1) != -1) {
        try {
            let innerText = elem.innerText.replaceAll(' ', '+').replaceAll(',','');
            return `${authority}?daddr=${innerText}`;
        } catch (e) {
            console.error(`Error in stringToFind1 manipulation: ${e.toString()}`);
            return null;
        }
    }
    
    if (url.indexOf(stringToFind2) != -1) {
        try {
            let newString = url.slice(stringToFind2.length, url.indexOf('&'));
            return `${authority}?q=${newString}`;
        } catch (e) {
            console.error(`Error in stringToFind2 manipulation: ${e.toString()}`);
            return null;
        }
    }

}







//window.location.href = "https://www.example.com";
//
////console.log("url = " + window.location.href);
//
////browser.webNavigation.onBeforeNavigate.addListener(                                (details) => {                                                    console.log(details);
////});
//
//console.log("webNav = " + window.WebNavigation);
//console.log("proxy = " + browser.proxy);
//console.log("find = " + browser.find);
//console.log("events = " + browser.events);
//console.log("commands = " + browser.commands);
//console.log("storage = " + browser.storage);
//console.log("runtime = " + browser.runtime);
//console.log("chrome = " + chrome.webNavigation);
