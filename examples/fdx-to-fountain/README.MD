## Example and Usage

Below is an example of a class object for parsing a Final Draft (FDX) file
into a Fountain file-format, and then converting it to an HTML object
using [screenplay-js](https://github.com/Guernsey-Creative/screenplay-js).

You can also find a VueJS example in the [fdx-script-parser.vue](https://github.com/Guernsey-Creative/screenplay-js/blob/main/examples/fdx-to-fountain/fdx-script-parser.vue) file. Feel free to use it
within your VueJS project or convert it to the framework you're working in.

## Parse a Final Draft (FDX) Script

```ts
// Import ScriptConverter class from your file directory
// ScriptConverter class and functions can be found within this
// directory (or the examples directory of the [screenplay-js](https://github.com/Guernsey-Creative/screenplay-js/tree/main/examples) project.)
import { ScriptConverter } from ".";

// Import FountainParser from screenplay-js
import { FountainParser } from "screenplay-js";

class FDXScriptParser {
  script_json: any = null;

  handleReadFile(evt: any) {
    let reader = new FileReader();
    if (evt && evt.target && evt.target.files) {
      reader.onload = (event) => {
        if (event && event.target) {
          const scriptText = event.target.result as string;

          // Parse to fountain
          const fountainScript = ScriptConverter.convertToFountain(scriptText);

          // Parse fountain to HTML
          this.script_json = FountainParser.parse(fountainScript);
        }
      };
      reader.readAsText(evt.target.files[0]);
    }
  }
}
```

## Converter Class

```ts
import { FinalDraftParser } from './fdx-parser'

/**
 * A class object that holds various screenplay format converters.
 */
class ScriptConverter {
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
```

## Final Draft Parser Class

```ts
class FinalDraftParser {
  /**
     * Read, parse, and build a title page text in Fountain
     * syntax. We assume that the only text here is the
     * title, credit, and author.
     *
     * @see https://fountain.io/syntax
     */
  getTitleFromXML(xmlDoc: Document): string {
    const titlePageStructure = ["Title:", "Credit:", "Author:"];
    const xmlTitleTag: string[] = [];
    let titleString = "";
    xmlDoc
      .querySelectorAll("FinalDraft TitlePage Content > Paragraph")
      .forEach((el: Element) => {
        if (el.textContent && el.textContent.trim()) {
          xmlTitleTag.push(el.textContent.trim());
        }
      });

    titlePageStructure.forEach((text: string, index: number) => {
      titleString += `${text} ${xmlTitleTag[index]} \n`;
    });

    return titleString;
  }

  /**
   * Read and parse the XML document's paragraph content to
   * Fountain syntax.
   *
   * @see https://fountain.io/syntax
   */
  getContentFromXML(xmlDoc: Document): string {
    let contentString = "";
    xmlDoc
      .querySelectorAll("FinalDraft > Content > Paragraph")
      .forEach((el: Element) => {
        var dual = el.querySelectorAll("DualDialogue");
        // Handle dual dialog
        if (dual.length) {
          var set_dual = false;
          dual[0]
            .querySelectorAll("Paragraph")
            .forEach((el: Element | HTMLElement) => {
              contentString += this.parseXMLElements(el, set_dual);
              set_dual = true;
            });
        } else {
          // Else parse the rest
          contentString += this.parseXMLElements(el);
        }
      });

    return contentString;
  }

  /**
   * Parse elements of an XML script to Fountain syntax.
   *
   * @see https://fountain.io/syntax
   */
  parseXMLElements(paragraph: HTMLElement | Element, dual: boolean = false): string {
    let type = paragraph.getAttribute("Type");
    let align = paragraph.getAttribute("Alignment");
    let page_break = paragraph.getAttribute("StartsNewPage");

    // Get paragraph text
    let text = "";
    paragraph.querySelectorAll("Text").forEach((el) => {
      if (el.textContent) {
        text += el.textContent;
      }
    });

    // Get notes
    var notes: string[] = [];
    paragraph.querySelectorAll("ScriptNote Paragraph Text").forEach((el) => {
      if (el.textContent && el.textContent.trim()) {
        notes.push(`[[${el.textContent.trim()}]]`);
      }
    });

    // Replace quote and apostrophe characters
    text = text
      .replace(/’/g, "'")
      .replace(/”/g, '"')
      .replace(/“/g, '"')
      .replace(/‘/g, "'");

    if (page_break === "Yes") {
      text += "\n====\n" + text;
    }

    if (
      type === "Character" ||
      type === "Scene Heading" ||
      type === "Transition"
    ) {
      text = text.toUpperCase();
    }

    if (notes.length) {
      if (type === "Scene Heading") {
        text += "\n\n" + notes.join("\n\n");
      } else {
        text += " " + notes.join(" ");
      }
    }

    if (type === "Character" && dual) {
      text += " ^";
    }
    if (type === "Transition") {
      text = "> " + text;
    }
    if (align === "Center") {
      text = "> " + text.split("\n").join(" ") + " <";
    }
    if (type === "Scene Heading") {
      if (
        !/^((?:\*{0,3}_?)?(?:(?:int|ext|est|i\/e)[. ]).+)|^(?:\.(?!\.+))(.+)/i.test(
          text
        )
      ) {
        text = "." + text;
      }
      let synopsis = paragraph.querySelectorAll(
        "SceneProperties Paragraph Text"
      );
      if (synopsis.length) {
        text += "\n\n";
        synopsis.forEach((el) => {
          if (el.textContent && el.textContent.trim()) {
            text += `= ${el.textContent.trim()}\n\n`;
          }
        });
      }
    }
    if (type !== "Parenthetical" && type !== "Dialogue") {
      text = "\n" + text;
    }
    if (type !== "Center") {
      text += "\n";
    }

    if (text.replace(/\n/g, "") === "") {
      return "";
    }

    return text;
  }
}
```

## Node.js or Server-Side Usage

If you are trying to use this in a node.js environment, you will need to install a 
package like [jsdom](https://github.com/jsdom/jsdom) to have access to the DOM in a non-browser environment.