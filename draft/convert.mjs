#!/usr/bin/env node

import { convert } from './node_modules/mdpdf/src/index.js';
import { PDFDocument } from './node_modules/pdf-lib/cjs/index.js';
import { writeFileSync, readFileSync } from "node:fs";

async function removePage() {
  const letters = await PDFDocument.load(readFileSync("draft.pdf"));
  letters.removePage(0);
  letters.removePage(0);
  writeFileSync("draft.pdf", await letters.save());
}

let options = {
    ghStyle: false,
    defaultStyle: false,
    source: './draft.md',
    destination: './draft.pdf',
    styles: './style.css',
    header: './header.html',
    footer: './footer.html',
    //debug: './draft.html',
    pdf: {
        format: 'A4',
        orientation: 'portrait',
		    border: {
		      top: '20mm',
		      left: '20mm',
		      bottom: '20mm',
		      right: '20mm',
		    },
    }
};

console.log('Converting markdown to PDF');
convert(options).then((pdfPath) => {
    console.log('Stripping initial blank pages');
		removePage();
    console.log('Done');
    console.log('Generated PDF:', pdfPath);
}).catch((err) => {
    console.error(err);
});