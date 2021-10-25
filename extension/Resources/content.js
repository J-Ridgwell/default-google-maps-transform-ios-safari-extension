const defaultNaviPromise = browser.storage.local.get("defaultNavi");
const removeGoogleSearchAdsPromise = browser.storage.local.get("removeGoogleSearchAds");
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
	removeGoogleSearchAdsPromise.then((items) => {
		console.log(`promise has resolved. remove ads= ${items.removeGoogleSearchAds}`);
		if (items.removeGoogleSearchAds) {
			console.log("in if");
			removeAds();
		}
	});
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
			const extractedAddress = extractAddress(elem, attributeValue);
			const convertedURL = createNavigationURL(extractedAddress);

			elem.setAttribute(attributeKey, convertedURL ?? attributeValue);
		}
	} catch (e) {
		console.error("error in findElements(): " + e.toString());
	}
}
/*
<a href="https://maps.google.com/maps?client=safari&amp;hl=en&amp;biw=390&amp;bih=664&amp;gs_lcp=ChNtb2JpbGUtZ3dzLXdpei1zZXJwEAEYBDICCCkyAggpMgQIKRBHMgIIKTICCCkyAggpMgIIKTICCCkyAggpMgIIKTICCCkyAggpMgIIKTICCCkyAggpMg4IABDqAhCPARCMAxDlAjIOCAAQ6gIQjwEQjAMQ5QIyDggAEOoCEI8BEIwDEOUCMg4IABDqAhCPARCMAxDlAjIOCAAQ6gIQjwEQjAMQ5QIyDggAEOoCEI8BEIwDEOUCMg4IABDqAhCPARCMAxDlAjIOCAAQ6gIQjwEQjAMQ5QIyDggAEOoCEI8BEIwDEOUCMg4IABDqAhCPARCMAxDlAjIOCAAQ6gIQjwEQjAMQ5QIyDggAEOoCEI8BEIwDEOUCMg4IABDqAhCPARCMAxDlAjIOCAAQ6gIQjwEQjAMQ5QIyDggAEOoCEI8BEIwDEOUCUABYAGDfEGgCcAB4AIABAIgBAJIBAJgBAKABAbABHsABAQ&amp;um=1&amp;ie=UTF-8&amp;daddr=4250+Rosewood+Dr,+Pleasanton,+CA+94588&amp;geocode=FfE9PwIdVU28-CnvlTmQN-mPgDF7o6SInLeCGg&amp;ei=OKJwYeLfBsnP0PEPrbCioAo" data-tu="//www.googleadservices.com/pagead/aclk?sa=L&amp;ai=DChcSEwjcuZu6jtrzAhX_Da0GHVprAuMYABAFGgJwdg&amp;ohost=www.google.com&amp;cid=CAASEuRog2Ibk81pZa0knWh5e4Tqwg&amp;sig=AOD64_0lZLaeSCOuJbAzusGB3efp_Zl1JA&amp;q&amp;ctype=11&amp;adurl" onclick="wlctc(this); return false;" data-ved="2ahUKEwji25K6jtrzAhXJJzQIHS2YCKQQi0F6BAgEEAk"><span class="WzmYQb S003Ke ZoN4Lb z1asCe QoWzUe"><svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.71 11.29l-9-9c-.39-.39-1.02-.39-1.41 0l-9 9c-.39.39-.39 1.02 0 1.41l9 9c.39.39 1.02.39 1.41 0l9-9c.39-.38.39-1.01 0-1.41zM14 14.5V12h-4v3H8v-4c0-.55.45-1 1-1h5V7.5l3.5 3.5-3.5 3.5z"></path></svg></span></a>
*/

// potentially still need to take care of character encodings for '+' or '&' in the name of the address
function extractAddress(elem, attributeValue) {
	let url = attributeValue.toString();
	const stringToFind = "https://maps.google.com/maps/dir//";
	const stringToFind1 = "https://maps.google.com/maps/place//data=";
	const stringToFind2 = "https://maps.google.com/maps?q=";
	const stringToFind3 = "https://maps.google.com/maps/place/";
	let address;

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
		} else if (url.includes(stringToFind3)) {
			address = url
				.slice(stringToFind3.length, url.indexOf("/", stringToFind3.length + 1))
				.replaceAll(",", "");
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

function removeAds() {
	console.log("in remove ads");
	try {
		const elems = document.querySelectorAll("[data-text-ad='1']");
		console.log(`Found ${elems.length} ads to be removed`);
		for (const elem of elems) {
			elem.remove();
		}
	} catch (e) {
		console.error(`Error search for ads: ${e.toString()}`);
	}
}

// let addressPatterns = new Map();
// addressPatterns.set("https://maps.google.com/maps/dir//", () => {
// 	address = url.slice(stringToFind.length, url.indexOf("/data=")).replaceAll(",", "");
// 	urlParams.set("beforeAddress", "?daddr=");
// });

//console.log("url = " + window.location.href);
//console.log("webNav = " + window.WebNavigation);
//console.log("proxy = " + browser.proxy);
//console.log("find = " + browser.find);
//console.log("events = " + browser.events);
//console.log("commands = " + browser.commands);
//console.log("storage = " + browser.storage);
//console.log("runtime = " + browser.runtime);
//console.log("chrome = " + chrome.webNavigation);
