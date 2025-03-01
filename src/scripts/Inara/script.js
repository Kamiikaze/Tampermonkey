// ==UserScript==
// @name         Inara - Commodites Total Price
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  try to take over the world!
// @author       You
// @match        https://inara.cz/elite/commodities/?formbrief=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=inara.cz
// @grant        none
// ==/UserScript==

// # # # # # #
// CONFIG
// # # # # # #

// Row-Name for Total Price
const totalPriceText = "Total Price"

// Default value for total price calculations
const amountDefaultValue = 100


/*** DO NOT CHANGE BELOW ***/


// 1. Input-Feld für die gewünschte Menge hinzufügen
const mainblock = document.querySelector('.mainblock');
if (mainblock) {
    const filterContainer = document.createElement('div')
    filterContainer.id = "custom-filters"

    const amountFilter = document.createElement('div')
    amountFilter.id = "custom-filter-amount"

    amountFilter.innerHTML = `<label class="formlabelside">
    Buy/Sell Amount
    <span class="tooltip tooltipnoline" data-tooltiptext="Amount for total price calculations. If supply is less than amount, supply is highlighted red.">
      <span class="helpmark">?</span>
    </span></label>`

    const amountInput = document.createElement('input');
    amountInput.type = 'number';
    amountInput.value = amountDefaultValue;
    amountInput.id = 'desiredAmount';
    amountInput.style.marginBottom = '10px';

    amountFilter.append(amountInput)

    filterContainer.append(amountFilter)

    mainblock.insertBefore(filterContainer, mainblock.firstChild);
}

// 2. Gesamtpreis-Aktualisierungsfunktion
function updateTotalPrices() {
    const desiredQuantity = parseInt(document.querySelector('#desiredAmount')
        .value, 10) || 0;
    const table = document.querySelector('table');
    if (!table) return;

    // Überschrift für Gesamtpreis einfügen, falls noch nicht vorhanden
    const headerRow = table.querySelector('thead tr');
    if (!headerRow.querySelector('.total-header')) {
        const totalHeader = document.createElement('th');
        totalHeader.textContent = totalPriceText;
        totalHeader.className = 'total-header alignright';
        headerRow.insertBefore(totalHeader, headerRow.querySelector('th:nth-child(7)'));
    }

    // Funktion zum Erkennen des Tausender-Trennzeichens
    function detectThousandSeparator(priceStr) {
        priceStr = priceStr.trim();
        const dotMatches = priceStr.match(/\./g);
        const commaMatches = priceStr.match(/,/g);

        if (dotMatches) {
            if (dotMatches.length > 1) return '.';
            let parts = priceStr.split('.');
            if (parts[1] && parts[1].length === 3) return '.';
        } else if (commaMatches) {
            if (commaMatches.length > 1) return ',';
            let parts = priceStr.split(',');
            if (parts[1] && parts[1].length === 3) return ',';
        }
        return '';
    }

    // Funktion zur Formatierung einer Zahl mit Tausender-Trennzeichen
    function formatWithThousandSeparator(num, thousandSeparator) {
        return num.toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
    }

    // Function to calculate average of two numbers
    function calculateAverage(min, max) {
        return (min + max) / 2;
    }

    // Alle Zeilen im Tabellenkörper durchgehen
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
        // 6. Zelle als Unit-Price
        const unitPriceCell = row.querySelector('td:nth-child(6)');
        const supplyCell = row.querySelector('td:nth-child(5)');

        if (unitPriceCell) {
            // Preis extrahieren (nur Ziffern, Komma und Punkt)
            const rawPrice = unitPriceCell.textContent.replace(/[^\d.,\s-]/g, '').trim()
            const rawSupply = supplyCell.getAttribute('data-order')
            const thousandSep = detectThousandSeparator(rawPrice);

            let numericPrice;
            let isApproximate = false;

            // Check if the price is a range
            if (rawPrice.includes('-')) {
                const [minPrice, maxPrice] = rawPrice.split('-').map(price => {
                    const numericString = thousandSep ? price.split(thousandSep).join('') : price;
                    return parseInt(numericString, 10);
                });
                numericPrice = calculateAverage(minPrice, maxPrice);
                isApproximate = true;
            } else {
                const numericString = thousandSep ? rawPrice.split(thousandSep).join('') : rawPrice;
                numericPrice = parseInt(numericString, 10);
            }

            // Gesamtpreis berechnen
            const totalPrice = (numericPrice * desiredQuantity).toFixed();
            
            const formattedTotal = thousandSep ?
                formatWithThousandSeparator(totalPrice, thousandSep) + ' Cr' :
                totalPrice + ' Cr';

            // Append "~" if the price was a range
            const displayTotal = isApproximate ? `~${formattedTotal}` : formattedTotal;

            // Check if desiredQuantity > rawSupply
            let lowSupplyClass = ""
            if (desiredQuantity > rawSupply) {
                lowSupplyClass = " low-supply"
            }

            // Gesamtpreis-Zelle erstellen oder aktualisieren
            let totalPriceCell = row.querySelector('.total-price');
            if (!totalPriceCell) {
                totalPriceCell = document.createElement('td');
                totalPriceCell.className = 'alignright total-price';
                row.insertBefore(totalPriceCell, row.querySelector('td:nth-child(7)'));
            }
            totalPriceCell.textContent = displayTotal;
            supplyCell.className = 'alignright' + lowSupplyClass;
        }
    });
}

function GM_addStyle(css, important = true) {
    const head = document.head || document.getElementsByTagName('head')[0];
    if (!head) return;

    const style = document.createElement('style');
    style.type = 'text/css';

    if (important) style.innerHTML = css.replace(/;/g, ' !important;')
    else style.innerHTML = css

    head.appendChild(style);
}

function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

GM_addStyle(`

#custom-filters {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-evenly;
    gap: 5px 10px;
    padding: 10px;
}

#custom-filters > div {
  min-width: 140px;
  width: 19%;
}

td.low-supply {
  color: #ff8080;
}

`, false)


// 3. Event-Listener mit debounce, um bei Änderung des Input-Felds die Tabelle zu aktualisieren
const debouncedUpdate = debounce(updateTotalPrices, 500);
document.querySelector('#desiredAmount')
    .addEventListener('input', debouncedUpdate);

// Initiale Berechnung beim Laden
updateTotalPrices();