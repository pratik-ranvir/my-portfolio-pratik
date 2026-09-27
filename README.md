# Pratik Ranvir — Portfolio

A multi-file, production-ready portfolio site: dark cyberpunk / AI theme, glassmorphism
cards, an animated neural-grid canvas background, glowing gradient accents, project
filtering, and a PDF viewer/downloader for certificates and resume.

## Project structure

```
.
├── index.html                 Main page (semantic HTML, no build step needed)
├── assets/
│   ├── css/
│   │   └── style.css          All styling: theme tokens, glassmorphism, animations
│   ├── js/
│   │   └── main.js            Nav, particle background, filtering, PDF modal logic
│   ├── images/
│   │   └── profile.jpg        Placeholder avatar — replace with a real photo
│   └── docs/
│       ├── README.md          What PDFs to add and their exact filenames
│       ├── resume.pdf         ← add your own
│       ├── data-science-cert.pdf   ← add your own
│       ├── python-cert.pdf         ← add your own
│       └── web-dev-cert.pdf        ← add your own
└── README.md                  This file
```

## Before you publish

1. **Photo** — replace `assets/images/profile.jpg` with a real headshot (any image
   works; square, at least 500×500px, looks best in the circular frame).
2. **PDFs** — drop your resume and certificate PDFs into `assets/docs/` using the exact
   filenames listed in `assets/docs/README.md`. Until you do, the related buttons show a
   friendly "not uploaded yet" message instead of a broken link.
3. **Links** — GitHub, LinkedIn, email, and the live project link for Student Scheme
   Portal are already wired up in `index.html`.

## Running locally

No build step or dependencies. Either:
- Open `index.html` directly in a browser, or
- Serve it locally so the PDF `fetch()` existence checks work over `http://` rather
  than `file://` (some browsers block `fetch` on the `file://` protocol):
  ```bash
  python3 -m http.server 8000
  # then open http://localhost:8000
  ```

## Deploying to GitHub Pages

1. Push this folder's contents to the root of your `pratik-ranvir.github.io` repository.
2. In the repo's Settings → Pages, set the source to the `main` branch, root folder.
3. Your site will be live at `https://pratik-ranvir.github.io`.

## Tech notes

- No framework or build tool — plain HTML5, CSS3, and vanilla JavaScript.
- External dependencies are CDN-only: Google Fonts (Space Grotesk, Inter) and
  Font Awesome icons. Everything else is self-contained.
- The background animation and card entrance effects respect
  `prefers-reduced-motion`.
- Certificate "View PDF" opens an in-page modal with an embedded preview;
  "Download" triggers a direct file download. Both check the file exists first.
