/*
  BUILD MULTILANGUAGES

  Structure:

  ├─ lang/
  │  ├─ build.js 
  │  ├─ translations.json
  │  └─ templates
  │     ├─ index.html 
  │     └─ reveal.html 
  ├─ index.html
  ├─ it
  │  └─ index.html
  └─ r
    ├─ index.html
    └─ it
        └─ index.html
  
  1. in html insert the field keys inside {{...}} 
  2. Write translations in translations.json, under the lang key
  3. run "node build.js" from root
  
  example
  json: 
    {
      "en": {
        "title_page": "Secret Santa"
        ...
      }
      "it": {
        "title_page": "Babbo Natale segreto"
        ...
      }
    }
  html: <b> {{title_page}} </b>
  result:
    en: -> <b> Secret Santa </b>
    it: -> <b> Babbo Natale segreto </b>
  
*/

import * as fs from "fs";

const files = {
  index: "lang/templates/index.html",
  reveal: "lang/templates/reveal.html",
  lang: "lang/translations.json",
};

const indexFile = fs.readFileSync(files.index, "utf8");
const revealFile = fs.readFileSync(files.reveal, "utf8");

const translations = JSON.parse(fs.readFileSync(files.lang, "utf8"));

function compile(template, data) {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => data[key] || "");
}

Object.keys(translations).forEach((lang) => {
  const indexHtml = compile(indexFile, translations[lang]);
  const revealHtml = compile(revealFile, translations[lang]);

  const folder = lang == "en" ? "" : `${lang}/`;
  fs.writeFileSync(`${folder}index.html`, indexHtml);
  fs.writeFileSync(`r/${folder}index.html`, revealHtml);
});

// Object.keys(translations).forEach((lang) => {
//   const html = compile(revealFile, translations[lang]);
//   const folder = lang == "en" ? "" : `${lang}/`;
//   fs.writeFileSync(`reveal/${folder}index.html`, html);
// });

console.log("build completed");
