const defaultNaviPromise = browser.storage.local.get("defaultNavi");
const btns = document.querySelectorAll("button");
const outlineCSS = "3px solid #78c5ef";

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
		btns[0].style.border = "";
	} else {
		btns[0].style.border = outlineCSS;
		btns[1].style.border = "";
	}
}
