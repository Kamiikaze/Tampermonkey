// ==UserScript==
// @name         	Advanced Streaming | aniworld.to & s.to
// @name:de			Erweitertes Streaming | aniworld.to & s.to
// @namespace    	https://greasyfork.org/users/928242
// @version      	3.0
// @description  	Minimizing page elements to fit smaller screens and adding some usability improvements.
// @description:de 	Minimierung der Seitenelemente zur Anpassung an kleinere Bildschirme und Verbesserung der Benutzerfreundlichkeit.
// @author       	Kamikaze (https://github.com/Kamiikaze)
// @supportURL      https://github.com/Kamiikaze/Tampermonkey/issues
// @iconURL      	https://s.to/favicon.ico
// @match        	https://s.to/serie/stream/*
// @match        	https://serien.sx/serie/stream/*
// @match        	https://anicloud.io/anime/stream/*
// @match        	https://aniworld.to/anime/stream/*
// @require         https://greasyfork.org/scripts/455253-kamikaze-script-utils/code/Kamikaze'%20Script%20Utils.js
// @grant        	none
// @license      	MIT
// ==/UserScript==



// # # # # # #
// CONFIG
// You can disable features by replacing the value true with false.
// # # # # # #


// Enables shorter Window Tab Title
// Example: S3E8 - Black Clover | AniWorld.to
const enableShortWindowTitle = true

// Hides the section of Season Suggestions below the video
const enableHideSeasonSuggestions = true

// Closing the dropdown menu when mouse leaves (fix the perma-open menu)
const enableCloseMenuOnHoverLeave = true

// Adding a Link below "Watch Trailer" to search for it on YT (Because sometimes there is a Homepage linked to the Anime)
const enableAddTrailerSearchLink = true

// Adding a small box at bottom left to search the Anime on sites like MyAnimeList, Crunchyroll & more
const enableAddAnimeSearchBox = true

// Adding a small button at the right corner of the video frame to get to the next episode
const enableEpisodeNavButtons = true

// Enable/Disable search providers by changing the value either to true or false
// If you want to add your own provider let me know
const searchProviderList = {
	'Crunchyroll': false,
	'aniSearch':   false,
	'AnimePlanet': false,
	'MyAnimeList': true,
	'AmazonVideo': true,
}


// # # # # # #
// Styling
// Some adjustments to layout.
// You can disable features by replacing the value true with false.
// # # # # # #


// Set the height of the video player. (in pixel)
// Set to 0 to disabled it. Default: 480
const reducePlayerHeight = 150

// Hides the text to show/edit the description of the episode below episode title
const hideDescriptionEdit = true

// Hides the language box above the video player
const hideLanguageBox = true

// Hides seen episodes (marked green) from the Episode-List (You can still see them in the season overview
const hideSeenEpisodes = true



/*** DO NOT CHANGE BELOW ***/

/* global Logger getStreamData waitForElm addGlobalStyle */

const log = new Logger("Advanced Streaming");
log.setLogLevel(5);
let streamData = null;

(async () => {

	streamData = await getStreamData()

	// Features

	if (enableShortWindowTitle) shortWindowTitle()

	if (enableHideSeasonSuggestions) hideSeasonSuggestions()

	if (enableCloseMenuOnHoverLeave) closeMenuOnHoverLeave()

	if (enableAddTrailerSearchLink) addTrailerSearchLink()

	if (enableAddAnimeSearchBox) addAnimeSearchBox()

	if (enableEpisodeNavButtons) addEpisodeNavButtons()

	// Styles

	if (reducePlayerHeight > 0) {
		addGlobalStyle(`
            .inSiteWebStream, .inSiteWebStream iframe {height: ${reducePlayerHeight}px; }
            .hosterSiteTitle {padding: 5px 0 10px;}
        `)
	}

	if (hideDescriptionEdit) {
		addGlobalStyle(`
            .descriptionSpoilerLink, .descriptionSpoilerPlaceholder,
            .submitNewDescription, .hosterSectionTitle {
                display: none;
            }
        `)
	}

	if (hideLanguageBox) {
		addGlobalStyle(`
            .changeLanguageBox {
                display: none;
            }
        `)
	}

	if (hideSeenEpisodes) {
		if (streamData.currentEpisode == 0) return
		addGlobalStyle(`
            #stream > ul:nth-child(4) li .seen {
                display: none;
            }
        `)
	}

})();

function shortWindowTitle() {
	let pageTitle = ""
	if (streamData.currentSeason > 0) pageTitle += "S" + streamData.currentSeason
	if (streamData.currentEpisode > 0) pageTitle += "E" + streamData.currentEpisode
	window.document.title = `${ (pageTitle.length > 1) ? pageTitle + " - " : ""}${streamData.title} | ${streamData.host}`
}

async function hideSeasonSuggestions() {
	const container = await waitForElm(".ContentContainerBox")
	if (!container) return
	container.style = "display: none;"
	log.info("Hided Season Suggestions")
}

async function closeMenuOnHoverLeave() {
	const menu = await waitForElm(".dd")
	const modal = await waitForElm(".modal")

	menu.addEventListener('mouseleave', () => {
		modal.style = "display:none"
	})
}

async function addTrailerSearchLink() {
	const animeTitle = streamData.title
	const trailerBoxEl = await waitForElm(".add-series")

	const ytSearchLink = "https://www.youtube.com/results?search_query="

	const searchTrailerEl = document.createElement("a")
	searchTrailerEl.href = ytSearchLink + animeTitle + ' Trailer Deutsch'
	searchTrailerEl.text = "Trailer suchen"
	searchTrailerEl.classList.add("trailerButton")
	searchTrailerEl.target = "_blank"

	trailerBoxEl.append(searchTrailerEl)
}

async function addAnimeSearchBox() {
	if (window.location.hostname !== 'aniworld.to') return
	const rightColEl = await waitForElm(".add-series")
	const seriesTitel = streamData.title
	const searchBoxEl = document.createElement('div')
	searchBoxEl.classList.add('anime-search')
	const searchBoxTitel = document.createElement('p')
	searchBoxTitel.innerText = "Anime suchen bei:"


	rightColEl.append(searchBoxEl)
	searchBoxEl.append(searchBoxTitel)

	const sites = [
		{domain: "crunchyroll.com", searchUrl: "https://www.crunchyroll.com/de/search?q=#TITEL#", name: "Crunchyroll" },
		{domain: "anisearch.de", searchUrl: "https://www.anisearch.de/anime/index?text=#TITEL#", name: "aniSearch" },
		{domain: "anime-planet.com", searchUrl: "https://www.anime-planet.com/anime/all?name=#TITEL#", name: "AnimePlanet" },
		{domain: "myanimelist.net", searchUrl: "https://myanimelist.net/anime.php?q=#TITEL#&cat=anime", name: "MyAnimeList" },
		{domain: "amazon.de", searchUrl: "https://www.amazon.de/s?k=#TITEL#&i=instant-video", name: "AmazonVideo" },
	]

	for (let i = 0; i < sites.length; i++) {
		const site = sites[i]

		if (searchProviderList[site.name]) {
			const siteElement = document.createElement('a');
			siteElement.classList.add("sites")
			siteElement.target = "_blank"
			siteElement.href = site.searchUrl.replace("#TITEL#", seriesTitel)
			siteElement.innerHTML = `<img src="https://www.google.com/s2/favicons?sz=64&domain=${site.domain}" alt='${site.name} Logo Icon' />` + site.name

			searchBoxEl.append(siteElement)
		}
	}
}


addGlobalStyle(`
.anime-search {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    margin: 15px 5px;
    background: #313d4f;
    padding: 15px;
    border-radius: 3px;
    width: fit-content;
    position: fixed;
    left: 0;
    bottom: -8px;
    z-index: 99;
}

.anime-search .sites {
    padding: 5px 0;
}

.anime-search .sites img {
    max-width: 32px;
    width: 16px;
    margin-right: 5px;
    border-radius: 16px;
}
`)


async function addEpisodeNavButtons() {

	const episodeControls = document.createElement('div')
	episodeControls.id = "episodeControls"

	const nextBtn = document.createElement('button')
	nextBtn.classList.add('nextBtn')
	nextBtn.innerText = 'Next'



	const currentSeason = streamData.currentSeason
	const currentEpisode = streamData.currentEpisode
	const maxSeasons = streamData.seasonsCount
	const maxEpisodes = streamData.episodesCount

	nextBtn.addEventListener("click", function() {
		nextEpisode(currentSeason, currentEpisode, maxSeasons, maxEpisodes)
	})
	episodeControls.append(nextBtn)

	const videoContainer = await waitForElm(".hosterSiteVideo")
	videoContainer.insertBefore(episodeControls, videoContainer.querySelector(".inSiteWebStream"))

}

function nextEpisode(currSeason, currEpisode, maxSeasons, maxEpisodes) {

	let nextEpisode = currEpisode + 1
	let nextSeason = currSeason

	log.debug({ currSeason, currEpisode, maxSeasons, maxEpisodes, nextEpisode, nextSeason })

	if ( nextEpisode <= maxEpisodes ) {
		log.info("Next Episode", nextEpisode)
	}
	if ( nextEpisode > maxEpisodes ) {
		nextSeason ++
		if ( nextSeason <= maxSeasons ) {
			log.info("Next Season", nextSeason)
			nextEpisode = 1
			log.info("Next Episode", nextEpisode)
		}
		if ( nextSeason > maxSeasons ) {
			nextEpisode = false
			alert('Last Episode and Last Season')
		}
	}

	if ( !nextEpisode ) {
		alert('Episode not found')
		return
	}

	window.location.pathname = window.location.pathname.split( '/' ).slice( 0, 4 ).join( "/" ) + `/staffel-${ nextSeason }/episode-${ nextEpisode }`
}


addGlobalStyle(`
#episodeControls {
    width: 100%;
    height: 50px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: flex-end;
    align-items: center;
    margin: 10px 0;
}

#episodeControls button {
    width: 120px;
    height: fit-content;
    position: relative;
    padding: 10px 20px;
    background: #4160f9;
    color: #fff;
    font-size: 13px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
}

.nextBtn::after {
    content: ">";
    padding-left: 10px;
}



`, false)




