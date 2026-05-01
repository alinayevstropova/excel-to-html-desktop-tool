# Excel to HTML Desktop Tool

Electron and React desktop utility for converting structured Excel rows into reusable HTML content and inserting the generated output into ZIP archives.

## Why this project matters

This project demonstrates a practical automation workflow: file handling, spreadsheet parsing, previewing generated output, and packaging results for handoff. It combines frontend UI work with desktop app logic and local file processing.

## Features

- Upload Excel files and read workbook data
- Convert rows into configurable HTML elements
- Configure heading, text, image, form, and link output
- Preview generated HTML before saving
- Insert generated content into ZIP archives
- Desktop packaging with Electron

## Tech stack

- React
- Electron
- Material UI
- XLSX
- JSZip
- CRACO

## Project structure

```text
src/
  components/   File selectors, settings, preview, output UI
  services/     Excel parsing, formatting, ZIP, and file helpers
public/
  electron.js   Electron main process
  preload.js    Preload bridge
```

## Run locally

```bash
npm install
npm run electron-react
```

For a web-only development view:

```bash
npm start
```

## Next improvements

- Add TypeScript
- Add tests for Excel parsing and HTML formatting
- Add sample input files
- Add screenshots and a short workflow demo
- Harden file validation and error states
