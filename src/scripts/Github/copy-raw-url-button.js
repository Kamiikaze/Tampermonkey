// ==UserScript==
// @name         	Button to copy the raw file URL | Github
// @name:de			Button zum Kopieren der Raw-Datei URL | Github
// @namespace  		https://greasyfork.org/users/928242
// @version      	1.1
// @description  	Adds a button at the end of each file row to copy the raw file URL
// @description:de  Fügt am Ende jeder Dateizeile eine Schaltfläche zum Kopieren der Raw File URL hinzu
// @author       	Kamikaze (https://github.com/Kamiikaze)
// @match        	https://github.com/*
// @icon         	https://www.google.com/s2/favicons?sz=64&domain=github.com
// @run-at       	document-ready
// @license      	MIT
// ==/UserScript==


const waitForFilelist = setInterval(() => {
	const fileListContainer = document.querySelector("div.Box > div.js-details-container.Details div")

	if ( !fileListContainer ) return

	const fileList = fileListContainer.children

	if ( fileList < 1 ) return

	appendButtons(fileList)

}, 1000)

function appendButtons(fileList) {
	for ( let i = 0; i < fileList.length; i++ ) {
		const file = fileList[i]

		if (
			file.classList.contains("sr-only") ||
			file.childElementCount !== 4
		) continue;

		const fileUrl = file.querySelector('div:nth-child(2) .js-navigation-open').href
		const rawFileUrl = fileUrl.replace('/blob/', '/raw/')

		file.append(creatyCopyButton(rawFileUrl))
	}
	// clearInterval(waitForFilelist)
};

function creatyCopyButton(copyText) {
	const copy2clipboard = `
		<clipboard-copy aria-label="Copy" value="test value" data-view-component="true" class="" tabindex="0" role="button" title="Copy raw file url">
			<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-copy">
			<path fill-rule="evenodd" d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"></path><path fill-rule="evenodd" d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z"></path>
			</svg>
		</clipboard-copy>`

	const copyButton = document.createElement('div')
	copyButton.setAttribute('role', 'gridcell')
	copyButton.style = "margin-left: 10px;"
	copyButton.innerHTML = copy2clipboard
	copyButton.children[0].value = copyText
	copyButton.children[0].style = "cursor: pointer;"

	return copyButton
}