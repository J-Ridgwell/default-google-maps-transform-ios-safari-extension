const defaultNaviPromise = browser.storage.local.get("defaultNavi");

//console.log("running content.js");
//
//browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
//    console.log("Received request: ", request);
//});

const querySelectorString =
	'[data-url^="https://maps.google.com"], [href^="https://maps.google.com"], [data-link^="https://maps.google.com"]';

const wazeAuthority = "https://waze.com/ul"; // Requires '&navigate=yes' to be appended once address is inserted
const appleMapsAuthority = "https://maps.apple.com/";
let authority;
let urlParams = new Map([
	["beforeAddress", ""],
	["afterAddress", ""],
]);

const elementToObserve = document.querySelector("body");
const observeOptions = { subtree: false, childList: true, attributes: false };
const observer = new MutationObserver(() => {
	findElements();
});

window.addEventListener("load", (event) => {
	defaultNaviPromise.then(
		(items) => {
			authority = items.defaultNavi === "waze" ? wazeAuthority : appleMapsAuthority;
			findElements();
			observer.observe(elementToObserve, observeOptions);
		},
		(error) => {
			console.log(error);
		}
	);
});

//const moreResultsBtn = document.getElementsByTagName("g-more-link")[0];
//moreResultsBtn?.addEventListener("click", (event) => {
//	    console.log('More results button clicked');
//});
//
//const seeOtherLocationsBtn = document.querySelector(
//    '[data-attrid^="see more locations"]'
//);
//seeOtherLocationsBtn?.addEventListener("click", (event) => {
//	//    console.log('More results button clicked');
//});

function findElements() {
	try {
		const elems = document.querySelectorAll(querySelectorString);

		for (const elem of elems) {
			const attributeKey = elem.getAttribute("data-url")
				? "data-url"
				: elem.getAttribute("data-link")
				? "data-link"
				: "href";

			const attributeValue = elem.getAttribute(attributeKey);

			const convertedURL = createNavigationURL(
				extractAddress(elem, attributeValue)
			);
//            if (convertedURL) console.log(convertedURL);
			elem.setAttribute(attributeKey, convertedURL ?? attributeValue);
		}
	} catch (e) {
		console.error("error in findElements(): " + e.toString());
	}
}

// potentially still need to take care of character encodings for '+' or '&' in the name of the address
function extractAddress(elem, attributeValue) {
	let url = attributeValue.toString();
	const stringToFind = "https://maps.google.com/maps/dir//";
	const stringToFind1 = "https://maps.google.com/maps/place//data=";
	const stringToFind2 = "https://maps.google.com/maps?q=";
	let address;

	//	console.info(`Original URL: ${url}`);

	try {
		if (url.includes(stringToFind)) {
			address = url
				.slice(stringToFind.length, url.indexOf("/data="))
				.replaceAll(",", "");
			urlParams.set("beforeAddress", "?daddr=");
		}
		if (url.includes(stringToFind1)) {
			address = elem.innerText.replaceAll(" ", "+").replaceAll(",", "");
            urlParams.set("beforeAddress", "?daddr=");
		}
		if (url.includes(stringToFind2)) {
			address = url.slice(stringToFind2.length, url.indexOf("&"));
            urlParams.set("beforeAddress", "?q=");
		}
	} catch (e) {
		console.error(`Error in string manipulation: ${e.toString()}`);
		return null;
	}

	if (authority.includes("waze")) {
		address = address?.replaceAll("+", "%20");
		urlParams.set("beforeAddress", "?q=");
		urlParams.set("afterAddress", "&navigation=yes");
	}
    
	return address;
}

function createNavigationURL(address) {
	if (address != null)
		return `${authority}${urlParams.get("beforeAddress")}${address}${urlParams.get(
			"afterAddress"
		)}`;
}

//console.log("url = " + window.location.href);
//console.log("webNav = " + window.WebNavigation);
//console.log("proxy = " + browser.proxy);
//console.log("find = " + browser.find);
//console.log("events = " + browser.events);
//console.log("commands = " + browser.commands);
//console.log("storage = " + browser.storage);
//console.log("runtime = " + browser.runtime);
//console.log("chrome = " + chrome.webNavigation);
