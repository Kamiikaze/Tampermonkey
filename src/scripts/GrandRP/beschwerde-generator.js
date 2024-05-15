// ==UserScript==
// @name         GrandRP - Beschwerde Generator
// @namespace    https://greasyfork.org/users/928242
// @version      0.2
// @description  try to take over the world!
// @author       Kamikaze (https://github.com/Kamiikaze)
// @supportURL   https://github.com/Kamiikaze/Tampermonkey/issues
// @match        https://gta5grand.com/forum/forums/*/post-thread
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gta5grand.com
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    const formButtonRow = document.querySelector(".formRow .formSubmitRow-controls")

    const generateButtonEl = document.createElement('button');
    generateButtonEl.setAttribute('class', 'button--primary button button--icon button--icon--write');
    generateButtonEl.setAttribute('style', `
        position: absolute;
        z-index: 9999;
        margin: 0 10px;
    `);
    generateButtonEl.textContent = 'Generate';
    generateButtonEl.addEventListener("click", function(event){
        event.preventDefault()
        generateTemplate()
    });

    formButtonRow.append(generateButtonEl)

    const fields = loadDefaultFields()
    console.log("Loaded Fields:", fields)
    document.querySelector(".input.field_YourID").value = fields.myId
    document.querySelector(".input.field_PlayerReportID").value = fields.myName
})();

function getFields() {
    return {
        textBoxEl: document.querySelector(".fr-element.fr-view"),
        myId: document.querySelector(".input.field_YourID"),
        myName: document.querySelector(".input.field_PlayerReportID"),
        susId: document.querySelector(".input.field_PlayerReportSuspect"),
        proof: document.querySelector(".input.field_PlayerReportProof")
    }
}

function generateTemplate() {
    const fields = getFields()

    fields.textBoxEl.innerHTML = `<p><strong>Meine ID:</strong> ${fields.myId.value}</p>` +
    `<p><strong>ID der beschuldigten Person:</strong> ${fields.susId.value}</p>` +
    `<p><strong>Beweis:</strong> ${fields.proof.value.split(",").join("\n")}</p>` +
    `<p><strong>Situation:</strong> </p>` +
    `<p><strong>​</strong><br></p>`

    saveDefaultFields({myId: fields.myId.value, myName: fields.myName.value })
}

function saveDefaultFields(fields) {
    window.localStorage.setItem("defaultField", JSON.stringify(fields))
    console.log("Saved Fields:", fields)
}

function loadDefaultFields() {
    return JSON.parse(window.localStorage.getItem("defaultField"))
}
