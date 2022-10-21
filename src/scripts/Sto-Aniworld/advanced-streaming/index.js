// ==UserScript==
// @name         Advanced Streaming for aniworld & s.to
// @namespace    https://greasyfork.org/users/928242
// @version      2.2
// @description  Minimize page elements to fit smaller screens and added some QoL.
// @author       Kamikaze (https://github.com/Kamiikaze)
// @iconURL      https://s.to/favicon.ico
// @match        https://s.to/serie/stream/*
// @match        https://serien.sx/serie/stream/*
// @match        https://anicloud.io/anime/stream/*
// @match        https://aniworld.to/anime/stream/*
// @grant        none
// @license      MIT
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



const thisFixesJustAnError = 'TrUsTmEiAmApRoFeSsIoNaL';

(() => {

	// Features

	if (enableShortWindowTitle) shortWindowTitle()

	if (enableHideSeasonSuggestions) hideSeasonSuggestions()

	if (enableCloseMenuOnHoverLeave) closeMenuOnHoverLeave()

	if (enableAddTrailerSearchLink) addTrailerSearchLink()

	if (enableAddAnimeSearchBox) addAnimeSearchBox()

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
		addGlobalStyle(`
            #stream > ul:nth-child(4) li .seen {
                display: none;
            }
        `)
	}

})();



function shortWindowTitle() {
	const windowTitleArray = window.document.title.split(" von ")

	const season = "S" + windowTitleArray[0].split(" ").slice(3,4)
	const episode = "E" + windowTitleArray[0].split(" ").slice(1,2)

	const name = windowTitleArray[1].split("|")[0]
	const site = windowTitleArray[1].split("|")[1].split(" - ")[0]

	window.document.title = `${season}${episode} - ${name} | ${site}`
}

function hideSeasonSuggestions() {
	const container = document.querySelector(".ContentContainerBox")
	if (!container) return
	container.style = "display: none;"
}

function closeMenuOnHoverLeave() {
	const menu = document.querySelector(".dd")
	const modal = document.querySelector(".modal")

	menu.addEventListener('mouseleave', () => {
		modal.style = "display:none"
	})
}

function addTrailerSearchLink() {
	const animeTitle = document.querySelector(".series-title > h1 > span").innerText
	const trailerBoxEl = document.querySelector(".add-series")

	const ytSearchLink = "https://www.youtube.com/results?search_query="

	const searchTrailerEl = document.createElement("a")
	searchTrailerEl.href = ytSearchLink + animeTitle + ' Trailer Deutsch'
	searchTrailerEl.text = "Trailer suchen"
	searchTrailerEl.classList.add("trailerButton")
	searchTrailerEl.target = "_blank"

	trailerBoxEl.append(searchTrailerEl)
}

function addAnimeSearchBox() {
	if (window.location.hostname !== 'aniworld.to') return
	const rightColEl = document.getElementsByClassName("add-series")[0]
	const seriesTitel = document.querySelector("div.series-title > h1 > span").innerText
	const searchBoxEl = document.createElement('div')
	searchBoxEl.classList.add('anime-search')
	const searchBoxTitel = document.createElement('p')
	searchBoxTitel.innerText = "Search Anime at:"

	rightColEl.append(searchBoxEl)
	searchBoxEl.append(searchBoxTitel)

	const sites = [
		{domain: "crunchyroll.com", searchUrl: "https://www.crunchyroll.com/de/search?q=#TITEL#", name: "Crunchyroll" },
		{domain: "anisearch.de", searchUrl: "https://www.anisearch.de/anime/index?text=#TITEL#", name: "aniSearch" },
		{domain: "anime-planet.com", searchUrl: "https://www.anime-planet.com/anime/all?name=#TITEL#", name: "AnimePlanet" },
		{domain: "myanimelist.net", searchUrl: "https://myanimelist.net/anime.php?q=#TITEL#&cat=anime", name: "MyAnimeList" },
		{domain: "amazon.de", searchUrl: "https://www.amazon.de/s?k=test&i=instant-video", name: "Amazon Video" },
	]

	for (let i = 0; i < sites.length; i++) {
		const site = sites[i]
		const siteElement = document.createElement('a');
		siteElement.classList.add("sites")
		siteElement.target = "_blank"
		siteElement.href = site.searchUrl.replace("#TITEL#", seriesTitel)
		siteElement.innerHTML = `<img src="https://www.google.com/s2/favicons?sz=64&domain=${site.domain}"/>` + site.name

		searchBoxEl.append(siteElement)
		// console.log(siteElement)

	}
}

function addGlobalStyle(css) {
	var head, style;
	head = document.getElementsByTagName('head')[0];
	if (!head) { return; }
	style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = css.replace(/;/g, ' !important;');
	head.appendChild(style);
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


function addEpisodeNavButtons() {

	const episodeControls = document.createElement('div')
	episodeControls.id = "episodeControls"

	const prevBtn = document.createElement('button')
	prevBtn.classList.add('prevBtn')
	prevBtn.innerText = 'Previous'

	const nextBtn = document.createElement('button')
	nextBtn.classList.add('nextBtn')
	nextBtn.innerText = 'Next'



	const currentSeason = parseInt(window.location.pathname.split('/')[4].split('-')[1])
	const currentEpisode = parseInt(window.location.pathname.split('/')[5].split('-')[1]) // add return if no episode selected
	const maxSeasons = parseInt(document.querySelector("#stream > ul:nth-child(1)").childElementCount - 1)
	const maxEpisodes = parseInt(document.querySelector("#stream > ul:nth-child(4)").childElementCount - 1)

	nextBtn.addEventListener("click", function() {
		nextEpisode(currentSeason, currentEpisode, maxSeasons, maxEpisodes)
	})
	episodeControls.append(prevBtn, nextBtn)

	const videoContainer = document.querySelector(".hosterSiteVideo")
	videoContainer.insertBefore(episodeControls, videoContainer.querySelector(".inSiteWebStream"))

}
addEpisodeNavButtons()

function nextEpisode(currSeason, currEpisode, maxSeasons, maxEpisodes) {

	let nextEpisode = currEpisode + 1
	let nextSeason = currSeason

	if ( nextEpisode <= maxEpisodes ) {
		console.log("Next Episode", nextEpisode)
	}
	if ( nextEpisode > maxEpisodes ) {
		nextSeason ++
		if ( nextSeason <= maxSeasons ) {
			console.log("Next Season", nextSeason)
			nextEpisode = 1
			console.log("Next Episode", nextEpisode)
		}
		if ( nextSeason > maxSeasons ) {
			nextEpisode = false
			alert('Last Episode and Last Season')
		}
	}

	if ( !nextEpisode ) return

	const newPath = window.location.pathname.split('/').slice(0, 4).join("/") + `/staffel-${nextSeason}/episode-${nextEpisode}`
	window.location.pathname = newPath
}


addGlobalStyle(`
#episodeControls {
    width: 100%;
    height: 50px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: space-between;
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

.prevBtn::before {
    content: "<";
    padding-right: 8px;
}

.nextBtn::after {
    content: ">";
    padding-left: 10px;
}



`)




