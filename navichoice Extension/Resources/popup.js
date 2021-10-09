//console.log("Hello World from popup js", browser);
//
//browser.runtime.sendMessage({ greeting: "hello greeting from popup js" }).then((response) => {
//    console.log("Received response in popupjs: ", response);
//});
//
//document.querySelector("p").innerText = 'updated via javascript';

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
	navigationChosen("apple");
}

async function navigationChoiceWaze(event) {
	const err = await browser.storage.local.set({ defaultNavi: "waze" });
	if (err) console.log(`error: ${err}`);
	navigationChosen("waze");
}

function navigationChosen(name) {
	// browser.runtime.sendMessage({ name }).then((response) => {
	// 	console.log("Received response: ", response);
	// });
	// browser.runtime.sendNativeMessage(
	// 	"application.id",
	// 	{ message: name },
	// 	function (response) {
	// 		if (response) {
	// 			console.log("Received sendNativeMessage response:");
	// 			console.log(response);
	// 		}
	// 	}
	// );
}
