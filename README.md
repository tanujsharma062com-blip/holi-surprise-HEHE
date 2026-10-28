# Holi, with love 🌸

A colourful, static Holi greeting website. Visitors can write a personal wish, create a link, and send it by copying it or sharing it on WhatsApp. Opening that link shows the recipient's name, the message, and the sender's name. No account or backend is needed.

## Run locally

From the project directory, start any static file server. For example:

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000> in a browser. The website uses only HTML, CSS, JavaScript, and local assets; there is no build step.

## Publish

The files can be published with GitHub Pages (or any static hosting provider). For GitHub Pages, publish the branch containing `index.html` from the repository root. Once the site is live, links created on the site use that same public address.

The names and optional message are included in the shareable URL, so avoid adding anything private. The website does not need to store submissions in a database.

Fraunces and DM Sans are distributed under the SIL Open Font License; copies of their licenses are in `assets/fonts/`.
