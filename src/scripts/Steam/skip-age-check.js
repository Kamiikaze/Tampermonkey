// ==UserScript==
// @name         Skip Steam Age Check
// @namespace    https://greasyfork.org/users/928242
// @version      0.1
// @description  Skiping Age Check at Steam Website
// @author       Kamikaze (https://github.com/Kamiikaze)
// @match        https://store.steampowered.com/agecheck/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steampowered.com
// @grant        none
// @run-at       document-ready
// @license      MIT
// ==/UserScript==

setInterval( () => {
	console.log("Trying to Skip Age check..")

	const yearSelectEl = document.getElementsByName("ageYear")[0]?.children

	if (yearSelectEl) {
		if (yearSelectEl.length < 0) return;
		// console.log(yearSelectEl.children)

		for (let i = 0; i < yearSelectEl.length; i++) {
			const option = yearSelectEl[i]
			option.removeAttribute('selected')

			if (option.value == '1999' ) {
				option.setAttribute('selected', true)
				ViewProductPage();
				console.log("Skipped!")
			}
		}
	} else {
		ViewProductPage();
		console.log("Skipped!")
	}
}, 1000)