# /assets/docs

This folder is where the site's PDF files live. The site's code already links to
the exact filenames below — drop your real PDFs in here with these exact names
and everything (View PDF, Download PDF, Download Resume) will work with no
further code changes.

| File to add               | Used by                                              |
|----------------------------|-------------------------------------------------------|
| `resume.pdf`               | The "Download Resume" button in the hero section       |
| `data-science-cert.pdf`    | "The Ultimate Job Ready Data Science Course" card       |
| `python-cert.pdf`          | "Complete 2025 Python Bootcamp" card                    |
| `web-dev-cert.pdf`         | "Ultimate Web Development Course 2026" card             |

## Notes

- Keep the filenames exactly as shown (all lowercase, hyphens, `.pdf`).
- Until a file is added, its button still works — the site checks for the file
  first and shows a friendly alert ("Resume is being updated — please check
  back soon, or reach out directly.") instead of a broken link or a raw 404.
- If you rename a certificate file, update the matching `data-pdf="..."`
  attribute on that certificate card in `index.html`.
- Recommended: keep each PDF under ~2–3 MB so the preview modal loads quickly
  on mobile connections.
