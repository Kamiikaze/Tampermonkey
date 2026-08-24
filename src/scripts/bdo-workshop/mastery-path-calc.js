// ==UserScript==
// @name            Suggested Upgrades - Cheapest Path -  Net Cost
// @namespace       https://greasyfork.org/users/928242
// @version         1.0
// @description     Calculate and display the net cost of Suggested Upgrades for the "Cheapest Silver per Mastery" option
// @author          Kamikaze (https://github.com/Kamiikaze)
// @supportURL      https://github.com/Kamiikaze/Tampermonkey/issues
// @match           https://bdoworkshop.com/mastery-upgrade-path
// @icon            https://www.google.com/s2/favicons?sz=64&domain=bdoworkshop.com
// @grant           none
// @license         MIT
// ==/UserScript==

(function () {
    'use strict';

    const RESULT_ID = 'suggested-upgrades-net-cost';

    console.log('[Suggested Upgrades] Script loaded');

    // ------------------------------------------
    // Find the actual Suggested Upgrades container
    // ------------------------------------------

    function findContainer() {
        const title = [...document.querySelectorAll('span')]
            .find(el => el.textContent.trim() === 'Suggested Upgrades');

        if (!title) {
            console.warn(
                '[Suggested Upgrades] ✗ "Suggested Upgrades" title not found'
            );
            return null;
        }

        // DOM:
        // container
        //   ├── title header
        //   │    └── span "Suggested Upgrades"
        //   ├── column header
        //   └── rows
        const header = title.parentElement;
        const container = header?.parentElement;

        if (!container) {
            console.warn(
                '[Suggested Upgrades] ✗ Could not determine container'
            );
            return null;
        }

        console.log(
            '[Suggested Upgrades] ✓ Container found:',
            container
        );

        return container;
    }

    // ------------------------------------------
    // Check selected mode
    // ------------------------------------------

    function isCheapestMode() {
        const radio = document.querySelector(
            '#cheapest_silver_per_mastery'
        );

        const result = radio?.checked === true;

        console.log(
            '[Suggested Upgrades] Cheapest mode:',
            result
        );

        return result;
    }

    // ------------------------------------------
    // Parse prices
    // ------------------------------------------

    function parsePrice(text) {
        return Number(
            text
                .trim()
                .replace(/,/g, '')
        ) || 0;
    }

    // ------------------------------------------
    // Calculate
    // ------------------------------------------

    function calculate() {
        const container = findContainer();

        if (!container) {
            return null;
        }

        const children = [...container.children];

        console.log(
            '[Suggested Upgrades] Container children:',
            children
        );

        // Children:
        // [0] Suggested Upgrades title
        // [1] column headers
        // [2] item rows
        const headerRow = children[1];
        const rowsContainer = children[2];

        if (!headerRow || !rowsContainer) {
            console.warn(
                '[Suggested Upgrades] ✗ Could not find header/rows'
            );
            return null;
        }

        const headers = [...headerRow.children]
            .map(el => el.textContent.trim().toLowerCase());

        console.log(
            '[Suggested Upgrades] Headers:',
            headers
        );

        const gearIndex = headers.indexOf('gear price');
        const sellIndex = headers.indexOf('current sell');

        console.log(
            '[Suggested Upgrades] Gear index:',
            gearIndex,
            '| Sell index:',
            sellIndex
        );

        if (gearIndex === -1 || sellIndex === -1) {
            console.warn(
                '[Suggested Upgrades] ✗ Required columns not found'
            );
            return null;
        }

        const rows = [...rowsContainer.children];

        let totalGear = 0;
        let totalSell = 0;

        console.log(
            '[Suggested Upgrades] Found',
            rows.length,
            'item rows'
        );

        rows.forEach((row, index) => {
            const cells = [...row.children];

            const item = cells[1]?.textContent
                .replace('Other options', '')
                .trim();

            const gearPrice = parsePrice(
                cells[gearIndex]?.textContent || ''
            );

            const currentSell = parsePrice(
                cells[sellIndex]?.textContent || ''
            );

            totalGear += gearPrice;
            totalSell += currentSell;

            console.log(
                `[Suggested Upgrades] ${index + 1}. ${item}`,
                '| Gear:',
                gearPrice.toLocaleString(),
                '| Sell:',
                currentSell.toLocaleString()
            );
        });

        const netCost = totalGear - totalSell;

        console.log(
            '[Suggested Upgrades] ========================'
        );

        console.log(
            '[Suggested Upgrades] Gear total:',
            totalGear.toLocaleString()
        );

        console.log(
            '[Suggested Upgrades] Sell total:',
            totalSell.toLocaleString()
        );

        console.log(
            '[Suggested Upgrades] NET COST:',
            netCost.toLocaleString()
        );

        return {
            totalGear,
            totalSell,
            netCost
        };
    }

    // ------------------------------------------
    // Display
    // ------------------------------------------

    function updateDisplay() {
        console.log(
            '[Suggested Upgrades] Updating display...'
        );

        const existing = document.getElementById(RESULT_ID);

        if (!isCheapestMode()) {
            console.log(
                '[Suggested Upgrades] Not in cheapest mode → removing result'
            );

            existing?.remove();
            return;
        }

        const title = [...document.querySelectorAll('span')]
            .find(el => el.textContent.trim() === 'Suggested Upgrades');

        if (!title) {
            console.warn(
                '[Suggested Upgrades] Title not found'
            );
            return;
        }

        const result = calculate();

        if (!result) {
            console.warn(
                '[Suggested Upgrades] Calculation failed'
            );
            return;
        }

        let display = existing;

        if (!display) {
            display = document.createElement('span');

            display.id = RESULT_ID;

            display.className = "text-sm text-zinc-500 tabular-nums dark:text-zinc-400"

            title.insertAdjacentElement(
                'afterend',
                display
            );
            title.parentElement.classList.add("flex", "items-center", "gap-4")

            console.log(
                '[Suggested Upgrades] ✓ Result element created'
            );
        }

        const fullCalc =
              result.totalGear.toLocaleString() +
              ' - ' +
              result.totalSell.toLocaleString() +
              " = " +
              result.netCost.toLocaleString();

        display.textContent =
            `NetCost: ${fullCalc}`;

        console.log(
            '[Suggested Upgrades] ✓ Display:',
            display.textContent
        );
    }

    // ------------------------------------------
    // Radio changes
    // ------------------------------------------

    document.addEventListener('change', event => {
        if (
            event.target?.id === 'mastery_target' ||
            event.target?.id === 'cheapest_silver_per_mastery'
        ) {
            console.log(
                '[Suggested Upgrades] Radio changed:',
                event.target.id,
                'checked:',
                event.target.checked
            );

            updateDisplay();
        }
    });

    // ------------------------------------------
    // Watch for table changes
    // ------------------------------------------

    let updateTimeout;

    const observer = new MutationObserver(mutations => {
        const relevantChange = mutations.some(mutation => {
            return [...mutation.addedNodes, ...mutation.removedNodes]
                .some(node => {
                    if (node.nodeType !== Node.ELEMENT_NODE) {
                        return false;
                    }

                    // Ignore our own element
                    if (
                        node.id === RESULT_ID ||
                        node.closest?.(`#${RESULT_ID}`)
                    ) {
                        return false;
                    }

                    return true;
                });
        });

        if (!relevantChange) {
            return;
        }

        console.log(
            '[Suggested Upgrades] DOM changed → recalculating'
        );

        clearTimeout(updateTimeout);

        updateTimeout = setTimeout(() => {
            updateDisplay();
        }, 100);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // ------------------------------------------
    // Initial / delayed execution
    // ------------------------------------------

    updateDisplay();

    setTimeout(updateDisplay, 500);
    setTimeout(updateDisplay, 2000);

})();
