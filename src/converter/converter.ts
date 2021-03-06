import { FinalDraftParser } from './fdx-parser'
try {
  var jsdom = require("jsdom");
  var { JSDOM } = jsdom;
  var { window } = new JSDOM();
  var domParser = new window.DOMParser();
} catch (error) {
  jsdom = null
  console.warn("The npm package `jsdom` could not be found. Please install if you intend to use the ScriptConverter class.")
}

/**
 * A class object that holds various screenplay format converters.
 */
class Converter {
  /**
   * Parse a string XML document and convert it to a Fountain
   * syntaxed script.
   *
   * @see https://fountain.io/syntax
   */
  convertToFountain(script: string): string {
    if (jsdom) {
      try {
        const xmlDocument = domParser.parseFromString(script, "text/xml");

        let fountainScript = "";

        // Get title tag
        fountainScript += FinalDraftParser.getTitleFromXML(xmlDocument);

        // Get content
        fountainScript += FinalDraftParser.getContentFromXML(xmlDocument);

        return fountainScript;
      } catch (error) {
        console.warn("Could not parse to fountain. Please try another file.");
        return "Could not parse to fountain. Please try another file.";
      }
    }
  }
}

const ScriptConverter = new Converter()
const convertToFountain = ScriptConverter.convertToFountain

export {
  ScriptConverter,
  convertToFountain
}