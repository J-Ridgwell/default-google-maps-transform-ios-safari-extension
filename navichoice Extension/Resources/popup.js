const defaultNaviPromise = browser.storage.local.get("defaultNavi");
const btns = document.querySelectorAll("input");

defaultNaviPromise.then((items) => {
	switch (items.defaultNavi) {
		case "waze":
			btns[1].checked = true;
			break;
		case "apple-maps":
			btns[0].checked = true;
			break;
		default:
			browser.storage.local.set({ defaultNavi: "apple-maps" });
			btns[0].checked = true;
	}
});

btns[0].addEventListener("click", navigationChoiceApple);
btns[1].addEventListener("click", navigationChoiceWaze);

async function navigationChoiceApple(event) {
	const err = await browser.storage.local.set({ defaultNavi: "apple-maps" });
	if (err) console.log(`error: ${err}`);
}

async function navigationChoiceWaze(event) {
	const err = await browser.storage.local.set({ defaultNavi: "waze" });
	if (err) console.log(`error: ${err}`);
}
