browser.runtime.sendMessage({ greeting: "hello" }).then((response) => {
    console.log("Received response: ", response);
});

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Received request: ", request);
});


const elementToObserve = document.querySelector("body");
const observeOptions = { subtree: false, childList: true, attributes: false };
const moreResultsBtn = document.getElementsByTagName('g-more-link')[0];
const seeOtherLocationsBtn = document.querySelector('[data-attrid^="see more locations"]');
const querySelectorString = '[href^="https://maps.google.com"], [data-url^="https://maps.google.com"], [data-link^="https://maps.google.com"]';

const observer = new MutationObserver(
    () => {
        console.log('observer is triggered');

        findElements();
    }
);

window.addEventListener('load', (event) => {
    findElements();
});

moreResultsBtn?.addEventListener('click', (event) => {
    console.log('More results button clicked');
    observer.observe(elementToObserve, observeOptions);
});

seeOtherLocationsBtn?.addEventListener('click', (event) => {
    console.log('More results button clicked');
    observer.observe(elementToObserve, observeOptions);

});


function findElements() {
    try {
        let elems = document.querySelectorAll(querySelectorString);
        
        for (const elem of elems) {
            const attributeKey = elem.getAttribute('data-url') ? 'data-url' : elem.getAttribute('data-link') ? 'data-link' : 'href';
            const attributeValue = elem.getAttribute(attributeKey);
            const converted = googleToApple(elem, attributeValue);
            console.info(`converted url: ${converted}`)
            elem.setAttribute(attributeKey, converted ?? attributeValue);
        }

    } catch (e) {
        console.error("error in findElements(): " + e.toString());
    }
}


function googleToApple(elem, attributeValue) {
    let url = attributeValue.toString();
    const stringToFind = 'https://maps.google.com/maps/dir//';
    const stringToFind1 = 'https://maps.google.com/maps/place//data=';
    const stringToFind2 = 'https://maps.google.com/maps?q=';
    
    console.log(url);
    
    if (url.indexOf(stringToFind) != -1) {
        try {
            let urlBuilder = url.slice(stringToFind.length, url.indexOf('/data=')).replaceAll(',','');
            return `https://maps.apple.com/?daddr=${urlBuilder}`;
        } catch (e) {
            console.error(`Error in stringToFind manipulation: ${e.toString()}`);
            return null;
        }
    }
    
    if (url.indexOf(stringToFind1) != -1) {
        try {
            let innerText = elem.innerText.replaceAll(' ', '+').replaceAll(',','');
            return `https://maps.apple.com/?daddr=${innerText}`;
        } catch (e) {
            console.error(`Error in stringToFind1 manipulation: ${e.toString()}`);
            return null;
        }
    }
    
    if (url.indexOf(stringToFind2) != -1) {
        try {
            let newString = url.slice(stringToFind2.length, url.indexOf('&'));
            return `https://maps.apple.com/?q=${newString}`;
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
