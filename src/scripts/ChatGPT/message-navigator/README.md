# ChatGPT Message Navigator

## Description

Seamlessly browse ChatGPT conversation messages with handy up/down buttons and live highlighting. Navigate through turns in any ChatGPT chat stream for quicker review and context.

* **Up/Down Buttons**: Easily jump to the previous or next message.
* **Message Counter**: Shows current position like `3 / 12`.
* **Highlight Effect**: Smooth fade‑in and fade‑out of the selected message.
* **Dark/Light Theme**: Adapts button styling and highlight color based on ChatGPT’s theme.

---

## Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) (or another UserScript manager).
2. Install the script by clicking [here](https://www.tampermonkey.net/script_installation.php#url=https://update.greasyfork.org/scripts/539557/ChatGPT%20Message%20Navigator.user.js).
   * or visit `http://greasyfork.org/de/scripts/539557-chatgpt-message-navigator`
3. Click **Install this script**.
4. Reload ChatGPT window and try it out on a conversation page.

![image](https://github.com/user-attachments/assets/cb50df7b-a439-4e81-b051-8a2742915ea7)

---

## Usage

1. Open a ChatGPT conversation.
2. Two navigation buttons will appear at the bottom‑right of the message thread.
3. Click **↑** to move to the previous message, **↓** to move to the next.
4. Observe the message counter update and the fade highlight on the selected message.

---

## Configuration

* **Highlight Duration**: Controlled by `HIGHLIGHT_DURATION` (ms) in the script header.
* **Highlight Colors**: Defined in the script CSS under `.navigator-highlight` for both themes.

---

## Support

Report issues or suggest features on the [GitHub Issues page](https://github.com/Kamiikaze/Tampermonkey/issues).

---

## License

MIT © Kamikaze

> Feel free to fork or modify as needed.
