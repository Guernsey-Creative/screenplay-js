import { IToken, tokenizer } from './tokenizer';
import { sections } from './sections';
import { v4 as uuid } from 'uuid';

/**
 * It's strongly recommended to use Normal because it comes closest to the 1-minute-per-page rule
 * relied upon by readers, development people, and (in particular) production staff.
 *
 * Reference: https://kb.finaldraft.com/s/article/How-many-lines-per-page-does-Final-Draft-write-and-what-are-my-line-spacing-options
 */
const LINES_PER_PAGE = {
  none: null,
  loose: 47,
  normal: 54,
  tight: 58,
  very_tight: 64,
}

export interface IScriptPage {
  _id: string;
  html: string;
}

export interface IParserOptions {
  paginate: boolean,
  lines_per_page: 'none' | 'loose' | 'normal' | 'tight' | 'very_tight',
  script_html: boolean,
  script_html_array: boolean,
  notes: boolean,
  draft_date: boolean
  boneyard: boolean
}

export interface ScriptJSON {
  title: String,
  credit: String,
  authors: string[],
  source: String,
  notes: String,
  draft_date: String,
  date: String,
  contact: String,
  copyright: String,
  scenes: string[],
  title_page_html: String,
  script_html: String,
  script_pages: IScriptPage[],
  script_pages_html: string[][],
  script_html_array: string[]
}

const defaultOptions: IParserOptions = {
  paginate: true,
  lines_per_page: "loose",
  script_html: false,
  script_html_array: false,
  notes: true,
  draft_date: true,
  boneyard: true,
};

class Parser {
  options: IParserOptions;

  constructor(options: IParserOptions = defaultOptions) {
    this.options = options
  }

  /**
   * Parse a screenplay written in .fountain and output meta results
   * for the screenplay.
   *
   * @param { String } script - Text of the screenplay
   * @param { Object } _options - Options to pass into the parse function
   */
  parse(script: string, _options: IParserOptions = this.options) {
    if (_options === undefined || _options === null) {
      _options = this.options
    }

    // Default options
    let options = { ..._options };

    let tokens = tokenizer.tokenize(script),
      title_page_html: any[] = [],
      script_html: any[] = [];

    const output: Partial<ScriptJSON> = {
      title: '',
      credit: '',
      authors: [],
      source: '',
      date: '',
      contact: '',
      copyright: '',
      scenes: [],
      title_page_html: '',
      script_pages: [],
      script_pages_html: [],
    };

    let dialogueCounter = 0;
    for (let token of tokens) {
      token.text = this.lexer(token.text);

      switch (token.type) {
        case 'title':
          title_page_html.push('<h1>' + token.text + '</h1>');
          output.title = token.text.replace('<br />', ' ').replace(/<(?:.|\n)*?>/g, '');
          break;
        case 'credit':
          title_page_html.push('<p class="credit">' + token.text + '</p>');
          output.credit = token.text;
          break;
        case 'author':
          title_page_html.push('<p class="authors">' + token.text + '</p>');
          if (output.authors) {
            output.authors.push(token.text)
          }
          break;
        case 'authors':
          title_page_html.push('<p class="authors">' + token.text + '</p>');
          if (output.authors) {
            output.authors = output.authors.concat(token.text.replace('<br />', "\n").replace(', ', ',').split(/[\n,]/));
          }
          break;
        case 'source':
          title_page_html.push('<p class="source">' + token.text + '</p>');
          output.source = (token.text);
          break;
        case 'notes':
          if (options.notes) {
            title_page_html.push('<p class="notes">' + token.text + '</p>');
            output.notes = token.text;
          }
          break;
        case 'draft_date':
          if (options.draft_date) {
            title_page_html.push('<p class="draft-date">' + token.text + '</p>');
            output.draft_date = token.text;
          }
          break;
        case 'date':
          title_page_html.push('<p class="date">' + token.text + '</p>');
          output.date = token.text;
          break;
        case 'contact':
          title_page_html.push('<p class="contact">' + token.text + '</p>');
          output.contact = token.text;
          break;
        case 'copyright':
          title_page_html.push('<p class="copyright">' + token.text + '</p>');
          output.copyright = token.text;
          break;

        case 'scene_heading':
          script_html.push(`<h6 ${token.scene_number || token.scene_number === 0 ? 'id="scene-heading--' + token.scene_number + '"' : null} class="scene-heading" data-scene-heading-index="${token.scene_number}">${token.text}</h6>`);
          if (output.scenes) {
            output.scenes.push(token.text);
          }
          break;
        case 'transition':
          script_html.push('<p class="transition">' + token.text + '</p>');
          break;

        case 'dual_dialogue_begin':
          script_html.push(`<div class="dual-dialogue" data-dialogue-index="${dialogueCounter}">`);
          dialogueCounter += 1;
          break;
        case 'dialogue_begin':
          script_html.push(`<div class="dialogue${token.dual ? ' ' + token.dual : ''}" data-dialogue-index="${dialogueCounter}">`);
          dialogueCounter += 1;
          break;
        case 'character':
          script_html.push('<p class="character">' + token.text.replace(/^@/, '') + '</p>');
          break;
        case 'parenthetical':
          script_html.push('<p class="parenthetical">' + token.text + '</p>');
          break;
        case 'dialogue':
          script_html.push('<p>' + token.text + '</p>');
          break;
        case 'dialogue_end':
          script_html.push('</div>');
          break;
        case 'dual_dialogue_end':
          script_html.push('</div>');
          break;

        case 'section':
          script_html.push('<p class="section" data-depth="' + token.depth + '">' + token.text + '</p>');
          break;
        case 'synopsis':
          script_html.push('<p class="synopsis">' + token.text + '</p>');
          break;

        case 'note':
          if (options.notes) {
            script_html.push('<!-- ' + token.text + ' -->');
          }
          break;
        case 'boneyard_begin':
          if (options.boneyard) {
            script_html.push('<!-- ');
          }
          break;
        case 'boneyard_end':
          if (options.boneyard) {
            script_html.push(' -->');
          }
          break;

        case 'lyrics':
          script_html.push('<p class="lyrics">' + token.text + '</p>');
          break;
        case 'action':
          script_html.push('<p class="action">' + token.text + '</p>');
          break;
        case 'centered':
          script_html.push('<p class="centered">' + token.text + '</p>');
          break;

        case 'page_break':
          script_html.push('<hr class="page-break" />');
          break;
        case 'line_break':
          script_html.push('<br />');
          break;
      }
    }

    output.title_page_html = title_page_html.join('');

    if (options.script_html) {
      output.script_html = script_html.join('');
    }

    if (options.script_html_array) {
      output.script_html_array = script_html;
    }

    if (options.paginate) {
      const { pages, pages_html } = this.paginate(script_html, options.lines_per_page)
      output.script_pages = pages
      output.script_pages_html = pages_html
    }

    return output;
  }

  /**
   * Loosely paginate parsed screenplays. New pages will occur when a page
   * break is identified in the script.
   */
  paginate(script_html: string[], lpp: string = this.options.lines_per_page): { pages: any, pages_html: any } {
    const lines_per_page = LINES_PER_PAGE[lpp];
    let pages: any[] = [];
    let pages_html: any[] = [];
    let page: number = 0;
    let isOpenDiv: boolean = false;
    let addNewPage: boolean = false;
    let addDialogueChunk: boolean = false;
    let dialogueChunk: string = '';

    for (let i = 0; i < script_html.length; i++) {
      const line = script_html[i];

      /**
       * If page break, increment page count, and
       * push onto a new page.
       */
      if (line.includes('page-break')) {
        page += 1;

        // Don't add the page-break html style
        continue;
      }

      /**
       * Add pagination based on the lines per page count
       */
      if (isOpenDiv === false && addNewPage) {
        page += 1;
        addNewPage = false;
      }

      if (line.includes('<div ') && line !== '</div>') {
        isOpenDiv = true;

        // Begin dialogue chunk
        if (line.includes('class="dialogue') || addDialogueChunk) {
          addDialogueChunk = true;
        }
      } else if (line === '</div>') {
        isOpenDiv = false;

        // Close dialogue chunk
        if (addDialogueChunk) {
          addDialogueChunk = false;
          dialogueChunk += line;
        }
      }

      /**
       * Toggle new page flag
       */
      if (i !== 0 && i % lines_per_page === 0) {
        addNewPage = true;
      }

      /**
       * Create a default empty array for page
       */
      if (!pages[page]) {
        pages[page] = [];
      }

      // Add html to current page index
      pages[page].push(line);

      /**
       * Create a default empty array for pages_html
       */
      if (!pages_html[page]) {
        pages_html[page] = [];
      }

      // Add dialogue chunked html to current page index
      if (dialogueChunk && !addDialogueChunk) {
        pages_html[page].push(dialogueChunk);
        dialogueChunk = '';
      } else if (addDialogueChunk) {
        dialogueChunk += line;
      } else {
        pages_html[page].push(line);

      }
    }

    /**
     * For each page, join the html into a string
     */
    for (let i = 0; i < pages.length; i++) {
      pages[i] = { _id: uuid(), html: pages[i].join("") };
    }

    return { pages, pages_html };
  }

  /**
   * Match and replace string elements with appropriate
   * inline CSS styles.
   *
   * @param { String } s
   */
  lexer(s: string): string | undefined | null {
    if (!s) {
      return;
    }

    const inline = {
      note: '<!-- $1 -->',
      line_break: '<br />',
      bold_italic_underline: '<strong><em><span style="text-decoration:underline !important">$2</span></em></strong>',
      bold_underline: '<strong><span style="text-decoration:underline !important">$2</span></strong>',
      italic_underline: '<em><span style="text-decoration:underline !important">$1</span></em>',
      bold_italic: '<strong><em>$2</em></strong>',
      bold: '<strong>$2</strong>',
      italic: '<em>$2</em>',
      underline: '<span style="text-decoration:underline !important">$2</span>'
    };

    let styles = ['bold_italic_underline', 'bold_underline', 'italic_underline', 'bold_italic', 'bold', 'italic', 'underline'],
      style,
      match;

    s = s.replace(sections.note_inline, inline.note)
      .replace(/\\\*/g, '[star]')
      .replace(/\\_/g, '[underline]')
      .replace(/\n/g, inline.line_break);

    for (const i in styles) {
      style = styles[i];
      match = sections[style];

      if (match.test(s)) {
        s = s.replace(match, inline[style]);
      }
    }

    return s.replace(/\[star\]/g, '*').replace(/\[underline\]/g, '_').trim();
  }
};

const FountainParser = new Parser()
export { FountainParser }