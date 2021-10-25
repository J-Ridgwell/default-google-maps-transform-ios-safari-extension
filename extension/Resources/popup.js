const defaultNaviPromise = browser.storage.local.get("defaultNavi");
const removeAdsPromise = browser.storage.local.get("removeGoogleSearchAds");
const btns = document.querySelectorAll("button");
const removeAdsCheckbox = document.getElementById("remove-ads-checkbox");
const outlineCSS = "3px solid #78c5ef";

removeAdsPromise.then((items) => {
	if (items.removeGoogleSearchAds) {
		removeAdsCheckbox.checked = true;
	}
});

defaultNaviPromise.then((items) => {
	if (items.defaultNavi === "waze" || items.defaultNavi === "apple-maps") {
		addOutline(items.defaultNavi);
	} else {
		browser.storage.local.set({ defaultNavi: "apple-maps" });
		addOutline("apple-maps");
	}
});

btns[0].addEventListener("click", navigationChoice);
btns[1].addEventListener("click", navigationChoice);
removeAdsCheckbox.addEventListener("click", () => {
    console.log(removeAdsCheckbox.checked)
	browser.storage.local.set({ removeGoogleSearchAds: removeAdsCheckbox.checked });
});
async function navigationChoice(event) {
	const err = await browser.storage.local.set({ defaultNavi: this.id ?? "apple-maps" });

	if (err) {
		console.log(`error: ${err}`);
		addOutline("apple-maps");
	} else {
		addOutline(this.id);
	}
}

function addOutline(appleOrWaze) {
	if (appleOrWaze === "apple-maps") {
		btns[1].style.border = outlineCSS;
		btns[1].style.fontWeight = "bold";
		btns[0].style.border = "";
		btns[0].style.fontWeight = "normal";
	} else {
		btns[0].style.border = outlineCSS;
		btns[0].style.fontWeight = "bold";
		btns[1].style.border = "";
		btns[1].style.fontWeight = "normal";
	}
}
