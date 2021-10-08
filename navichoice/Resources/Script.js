//console.log("main html script h4= " + document.querySelector("h4").innerText);
//document.querySelector("h4").innerText = "hello there";
//document.querySelector("h4").value = 'changed';

//const btns = document.querySelectorAll("input");
//
//btns[0].addEventListener("click", navigationChoiceApple);
//btns[1].addEventListener("click", navigationChoiceWaze);
//
//function navigationChoiceApple(event) {
//    document.querySelector("h4").innerText = `Apple is now the default navigation`;
//    navigationChosen('apple');
//
//}
//
//function navigationChoiceWaze(event) {
//    document.querySelector("h4").innerText = `waze is now the default navigation`;
//    navigationChosen('waze');
//}
//
//function navigationChosen(name) {
//    browser.runtime.sendMessage({ name }).then((response) => {
//        console.log("Received response: ", response);
//    });
//}
