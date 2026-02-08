// ==UserScript==
// @name            Adjust Instant-Buttons Sound Volume | MyInstants
// @name:de         Anpassung der Instant-Button Lautstärke | MyInstants
// @namespace       https://greasyfork.org/users/928242
// @version         1.3
// @description     Adjust Instant-Buttons Sound Volume
// @description:de  Anpassung der Instant-Button Lautstärke
// @author          Kamikaze
// @match           https://www.myinstants.com/*
// @grant           none
// @license         MIT
// ==/UserScript==

(async () => {
    const savedVolume = parseFloat(localStorage.getItem("soundVol")) || 0.5;

    const audio = await waitForAudio();
    if (!audio) return;

    audio.volume = savedVolume;

    const container = document.createElement("div");
    container.id = "volume-control-container";
    container.classList.add("sticky");

    const label = document.createElement("label");
    label.textContent = "Volume:";

    const range = document.createElement("input");
    range.type = "range";
    range.min = "0";
    range.max = "1";
    range.step = "0.1";
    range.value = savedVolume;

    const number = document.createElement("input");
    number.type = "number";
    number.min = "0";
    number.max = "1";
    number.step = "0.1";
    number.value = savedVolume;

    container.append(label, range, number);
    document.body.appendChild(container);

    function changeVolume(vol) {
        const v = Math.min(1, Math.max(0, parseFloat(vol)));
        audio.volume = v;
        range.value = v;
        number.value = v;
        localStorage.setItem("soundVol", v.toFixed(1));
    }

    range.addEventListener("input", e => changeVolume(e.target.value));
    number.addEventListener("input", e => changeVolume(e.target.value));

    const style = document.createElement("style");
    style.textContent = `
        #volume-control-container {
            display: flex;
            gap: 15px;
            background: rgba(0,0,0,.8);
            padding: 10px 20px;
            border-radius: 10px;
            color: white;
        }

        #volume-control-container.sticky {
            position: fixed;
            top: 90px;
            right: 20px;
            z-index: 1000;
        }

        #volume-control-container input[type="number"] {
            width: 60px;
        }
    `;
    document.head.appendChild(style);
})();

function waitForAudio() {
    return new Promise(resolve => {
        const check = () => {
            if (window.audio instanceof HTMLAudioElement) {
                resolve(window.audio);
                return true;
            }
            return false;
        };

        if (check()) return;

        const obs = new MutationObserver(() => {
            if (check()) obs.disconnect();
        });

        obs.observe(document.body, { childList: true, subtree: true });

        setTimeout(() => resolve(null), 5000);
    });
}
