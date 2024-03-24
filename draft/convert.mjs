#!/usr/bin/env node

import { convert } from './node_modules/mdpdf/src/index.js';
import { PDFDocument } from './node_modules/pdf-lib/cjs/index.js';
import { writeFileSync, readFileSync } from "node:fs";
import commander from "./node_modules/commander/index.js";

async function removePage(options) {
  const letters = await PDFDocument.load(readFileSync(options.destination));
  letters.removePage(0);
  letters.removePage(0);
  writeFileSync(options.destination, await letters.save());
}

commander
  .version('1.0.0', '-v, --version')
  .usage('[OPTIONS]...')
  .requiredOption('-i, --input <value>', 'input markdown file.')
  .requiredOption('-o, --output <value>', 'output PDF file.')
  .parse(process.argv);

const params = commander.opts();
const input = params.input;
const output = params.output;

let options = {
    ghStyle: false,
    defaultStyle: false,
    source: input,
    destination: output,
    styles: './ttr-style/style.css',
    header: './ttr-style/header.html',
    footer: './ttr-style/footer.html',
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
		removePage(options);
    console.log('Done');
    console.log('Generated PDF:', pdfPath);
}).catch((err) => {
    console.error(err);
});
