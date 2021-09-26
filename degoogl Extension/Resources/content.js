console.log("hello world from content.js");

browser.runtime.sendMessage({ greeting: "hello" }).then((response) => {
    console.log("Received response: ", response);
});

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Received request: ", request);
});


const elementToObserve = document.querySelector("body");
const observeOptions = { subtree: false, childList: true, attributes: false };
const moreResultsBtn = document.getElementsByTagName('g-more-link')[0];

const observer = new MutationObserver(
    () => {
        console.log('observer is triggered');

        let elems = document.querySelectorAll('[data-url^="https://maps.google.com"]');

        for (const elem of elems) {
            let appleURL = googleToApple(elem);
            elem.setAttribute('data-url',appleURL ?? elem.getAttribute('data-url'));
        }
    }
);


moreResultsBtn.addEventListener('click', (event) => {
    console.log('More results button clicked');
    observer.observe(elementToObserve, observeOptions);
});

window.addEventListener('load', (event) => {
    console.log('page is fully loaded');
    findElements();
});


function findElements() {
    try {
        let elems = document.querySelectorAll('[href^="https://maps.google.com"]');
        
        for (const elem of elems) {
            console.log(elem);
            let appleURL = googleToApple(elem);
            elem.setAttribute('href', appleURL ?? elem.getAttribute('href'));
        }
        
        elems = document.querySelectorAll('[data-url^="https://maps.google.com"]');

        for (const elem of elems) {
            let appleURL = googleToApple(elem);
            elem.setAttribute('data-url', appleURL ?? elem.getAttribute('data-url'));
        }

        elems = document.querySelectorAll('[data-link^="https://maps.google.com"]')

        for (const elem of elems) {
            let appleURL = googleToApple(elem);
            elem.setAttribute('data-link', appleURL ?? elem.getAttribute('data-link'));
        }

    } catch (e) {
        console.error("error selecting: " + e.toString());
    }
}


function googleToApple(elem) {
    let url = elem.getAttribute('data-link') ?? elem.getAttribute('data-url') ?? elem.getAttribute('href');
    const stringToFind = 'https://maps.google.com/maps/dir//';
    const stringToFind1 = 'https://maps.google.com/maps/place//data=';
    const stringToFind2 = 'https://maps.google.com/maps?q=';
    let urlBuilder;
    
    console.log(url);
    
    if (url.indexOf(stringToFind) != -1) {
        try {
            urlBuilder = url.slice(stringToFind.length, url.indexOf('/data='));
            urlBuilder = urlBuilder.replaceAll(',','');
            let ret = `https://maps.apple.com/?daddr=${urlBuilder}`;
            console.log(ret);
            return ret;
        } catch (e) {
            console.error(`Error in stringToFind manipulation: ${e.toString()}`);
        }
    }
    
    if (url.indexOf(stringToFind1) != -1) {
        try {
            let innerText = elem.innerText;
            innerText = innerText.replaceAll(' ', '+').replaceAll(',','');
            let ret = `https://maps.apple.com/?daddr=${innerText}`;
            console.log(`innerText result= ${ret}`);
            return ret;
        } catch (e) {
            console.error(`Error in stringToFind1 manipulation: ${e.toString()}`);
            return null;
        }
    }
    
    if (url.indexOf(stringToFind2) != -1) {
        try {
            let newString = url.slice(stringToFind2.length, url.indexOf('&'));
            let ret = `https://maps.apple.com/?q=${newString}`;
            console.log(ret);
            return ret;
        } catch (e) {
            console.error(`Error in stringToFind2 manipulation: ${e.toString()}`);
        }
    }
    
    

    return null;
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
