import { FinalDraftParser } from './fdx-parser'

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
    try {
      const xmlDocument = new DOMParser().parseFromString(script, "text/xml");

      let fountainScript = "";

      // Get title tag
      fountainScript += FinalDraftParser.getTitleFromXML(xmlDocument);

      // Get content
      fountainScript += FinalDraftParser.getContentFromXML(xmlDocument);

      return fountainScript;
    } catch (error) {
      console.warn("Could not parse to fountain. Please try another file.", error);
      return "Could not parse to fountain. Please try another file.";
    }
  }
}

const ScriptConverter = new Converter()
const convertToFountain = ScriptConverter.convertToFountain

export {
  ScriptConverter,
  convertToFountain
}