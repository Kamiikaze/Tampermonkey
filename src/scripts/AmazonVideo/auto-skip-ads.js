// ==UserScript==
// @name         Amazon Video AutoSkip ADs
// @name:de         Amazon Video Automatisch Werbung überspringen
// @namespace    https://greasyfork.org/users/928242
// @version      0.6
// @description  Auto Skip Ads by watching Amazon Prime Video
// @description:de  Überspringt automatisch die Werbung beim ansehen von Videos auf Amazon Prime.
// @author       Kamikaze (https://github.com/Kamiikaze)
// @match        https://www.amazon.de/gp/video/detail/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.de
// @grant        none
// @license      MIT
// ==/UserScript==


// Change to the text matching your language for the skip button
const skipAdButtonText = 'Überspringen'

// How often in X seconds to scan for ADs
const scanInterval = 3

// Start scanning again in X minutes after AD has been skipped
const delayScanInterval = 5


/* ! ! ! ! ! ! ! !

Dont change below!

! ! ! ! ! ! ! ! */


let checkForAds = ''
let skipAdContainer = ''
let skipAdEl = ''
let skipButtonEl = ''
const clp = '[Amazon AutoSkip Script] '

startAdScan()

// Main Function Scanning for ADs
async function scanForADs() {

	if (!isVideoPlaying()) return;

	console.log(clp + "Scanning for running AD..")

	skipAdEl = await getSkipAdElement()

	skipCredits()

	console.log(clp + "skipButtonEl:", skipAdEl)

	if (!skipAdEl) return

	console.log(clp + "Detected playing AD. Trying to skip..")

	skipAd()
}

// Skipping the AD and restart delayed Scanning
function skipAd() {
	setTimeout( () => {
		skipAdEl.click()
		console.log(clp + "Skipped AD")
		restartAdScan()
	}, 3000 )
}

function skipCredits() {
	const buttonEl = document.querySelector("button.atvwebplayersdk-skipelement-button")

	if (!buttonEl) return;

	console.log(clp + "Skipped Credits")
	buttonEl.click()
}

// Checks if Video is played
function isVideoPlaying() {
	const videoContainer = document.querySelector("#dv-web-player")

	if (!videoContainer) return

	return videoContainer.classList.contains("dv-player-fullscreen")
}

// Finding SkipElement and returning it
async function getSkipAdElement() {
	skipAdContainer = document.querySelector("div.atvwebplayersdk-infobar-container > div > div:nth-child(3)")

	if (!skipAdContainer) return

	return await [...skipAdContainer.childNodes].find( (el) => {

		if (el.innerText == skipAdButtonText) {
			console.log(clp + "Found Skip-Button Element", el)
			console.log(clp + "Skip-Button Text:", el.innerText)

			return el
		}
	});
}

// Starting AdScan Interval
function startAdScan() {
	checkForAds = setInterval( () => { scanForADs() }, scanInterval * 1000 )
}

// Clearing Interval, Vars and delaying restart of scan
function restartAdScan() {
	clearInterval(checkForAds)

	checkForAds = ''
	skipAdContainer = ''
	skipAdEl = ''
	skipButtonEl = ''

	console.log(clp + `Restarting AdScan in ${delayScanInterval} Minutes.`)

	setTimeout( () => { startAdScan() }, delayScanInterval * 60 * 1000 )
}

