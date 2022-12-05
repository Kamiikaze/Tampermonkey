// ==UserScript==
// @name            WorkTime in Pagetitle - Personizer
// @name:de         Arbeitszeit im Seitentitel - Personizer
// @namespace       https://greasyfork.org/users/928242
// @version         0.1
// @description     Adding your current work time to page titel. No need to switch tab anymore to see your work time.
// @description:de  Zeigt die Arbeitszeit im Seitentitel an. Kein lästiges Tab wechseln mehr um die Arbeitszeit zu sehen.
// @author          Kamikaze (https://github.com/Kamiikaze)
// @supportURL      https://github.com/Kamiikaze/Tampermonkey/issues
// @match           https://www.personizer.com/app/*
// @require         https://greasyfork.org/scripts/455253-kamikaze-script-utils/code/Kamikaze'%20Script%20Utils.js
// @icon            https://www.google.com/s2/favicons?sz=64&domain=personizer.com
// @grant           none
// @license         MIT
// ==/UserScript==

// Identifier for Page Title if current running time is work or break time
const workTimeIdentifier = "▶"
const breakTimeIdentifier = "⏸"
const stopTimeIdentifier = "⏹️"

const workTimeText = "Arbeitszeit"
const breakTimeText = "Pausenzeit"

// Timer Update Interval (in seconds)
const intervalSpeed = 1


/*** DO NOT CHANGE BELOW ***/


/* global Logger getStreamData waitForElm */

const log = new Logger("Personizer - Window Title Timer")

/* Path: /app/dashboard/
<div class="time_tracker_widget__times mt-1">
	<div class="time_tracker_widget__worktime d-flex flex-column align-center">
		<p>Arbeitszeit</p>
		<span class="">05:08:21</span>
	</div>
</div>
 */

/* Path: /app/time-tracking/
<div class="timelogbar__timer">
	<div class="timelogbar__timer__focused">
		<span aria-hidden="true" class="v-icon notranslate mb-1 mr-1 theme--dark"></span>
		<span class="timelogbar__timer__text">00:00:00</span>
	</div>
</div>
 */

log.info("Starting Window Title Timer")

let clock, timeMode, timeIdentifier, workTime, breakTime = ""
const appPath = getAppPath();
let lastTime = '99:99:99'

/* Interval to update Page Title */
const timerInterval = setInterval(async () => {
	log.debug("Updating Page Title")

	if (!clock) await getClock()

	log.debug("Getting Time Mode")
	if (appPath === "dashboard") {
		await getDashboardTimeMode()
		workTime = await getDashboardRunningTime()
	} else if (appPath === "time-tracking") {
		log.warn("Time Tracking on this page not implemented yet")
	}

	getTimeIdentifier()

	log.debug('Time: ', workTime)

	document.title = `${timeIdentifier} ${workTime} | Personizer`

}, 1000)



/* Get Clock depending on app path */
async function getClock() {
	if (appPath === "dashboard") {
		clock = await waitForElm(".time_tracker_widget__worktime")
		log.debug("Found Clock: Dashboard", clock)

	} else if (appPath === "time-tracking") {
		clock = await waitForElm(".timelogbar__timer__text")
	}
}

/* Get Time Mode from Dashboard depending clock text */
async function getDashboardTimeMode() {
	const clockText = await waitForElm("p", clock)
	if (clockText.innerText === "Arbeitszeit") {
		timeMode = "work"
	} else if (clockText.innerText === "Pausenzeit") {
		timeMode = "break"
	}
	log.debug(`Time Mode: ${timeMode}`)
}

function getTimeIdentifier() {
	if (timeMode === "work") {
		timeIdentifier = workTimeIdentifier
	} else if (timeMode === "break") {
		timeIdentifier = breakTimeIdentifier
	} else {
		timeIdentifier = stopTimeIdentifier
	}
}

/* Get Running Time from Dashboard Clock */
async function getDashboardRunningTime() {
	const clockText = await waitForElm("span", clock)
	const time = clockText.innerText

	if (time === lastTime) {
		log.info("Time is stopped. Stopping Window Title Timer")

		timeMode = "stop"
		clearInterval(timerInterval)
		document.title = `${stopTimeIdentifier} ${workTime} | Personizer`
	} else {
		lastTime = time
	}

	return time
}

function getAppPath() {
	return window.location.pathname.split("/")[2]
}