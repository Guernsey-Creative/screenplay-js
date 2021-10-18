class Parser {
  /**
     * Read, parse, and build a title page text in Fountain
     * syntax. We assume that the only text here is the
     * title, credit, and author.
     *
     * @see https://fountain.io/syntax
     *
     * @todo
     * - Fix assumption if title page has more than these elements
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

const FinalDraftParser = new Parser()

export { FinalDraftParser }