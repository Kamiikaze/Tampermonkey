// ==UserScript==
// @name         Auto Select Favorite Hoster | aniworld.to & s.to
// @namespace    https://greasyfork.org/users/928242
// @version      1.1
// @description  Automatically opens your Stream on your favorite Hoster by order.
// @author       Kamikaze (https://github.com/Kamiikaze)
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aniworld.to
// @match        https://s.to/serie/stream/*
// @match        https://serien.sx/serie/stream/*
// @match        https://anicloud.io/anime/stream/*
// @match        https://aniworld.to/anime/stream/*
// @grant        none
// @license      MIT
// ==/UserScript==



// Example Hosters:
// ['VOE', 'Doodstream', 'Streamtape', 'Vidoza']
// Define your hosters in your preferred order
const hosterOrder = ['Vidoza', 'VOE', "Streamtape"];


/*** DO NOT CHANGE BELOW ***/


const availableHosters = [];

(() => {

	getHosterList()

	if (availableHosters.length < 0) return

	console.log("Hosters found:", availableHosters)

	const hoster = findFavHosterByOrder()

	if (!hoster) return

	console.log("Fav. Hoster found:", hoster)

	const iframe = getVideoIframe()

	if (!iframe) return

	console.log("Iframe found:", iframe)

	iframe.src = "/redirect/" + hoster.id

})();



function getHosterList() {
	const hosterListEl = document.querySelectorAll(".hosterSiteVideo > ul > li")

	for (let i = 0; i < hosterListEl.length; i++) {
		const host = hosterListEl[i]

		if (!isAvailable(host)) return

		availableHosters.push({
			name: host.getElementsByTagName("h4")[0].innerText,
			id: host.getAttribute("data-link-id"),
		})
	}
}

function isAvailable(host) {
	return host.style.display !== "none"
}

function findFavHosterByOrder() {
	let hoster = false

	for (let favHost of hosterOrder) {
		hoster = availableHosters.find( (avHost) => avHost.name === favHost )

		if (hoster) break;

	}
	return hoster
}

function getVideoIframe() {
	return document.querySelector(".inSiteWebStream iframe")
}