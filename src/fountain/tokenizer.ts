import { sections } from './sections';

export interface IToken {
  type?: string,
  text?: string,
  scene_number?: number,
  depth?: number
}

class ScriptTokenizer {
  /**
   * Cleans the script text to allow the parser to break
   * the script into correct tokens, pages, etc.
   * 
   * @param { String } script 
   * @returns { String }
   */
  clean(script: string): string {
    var s = script.replace(sections.boneyard, '\n$1\n')
      .replace(sections.standardizer, '\n')
      .replace(sections.cleaner, '')
      .replace(sections.whitespacer, '')
      // PR: Treat whitespace-only lines as empty
      // https://github.com/nathanhoad/fountain-js/pull/2
      .replace(/^\s+$/gm, '');
    return s;
  }


  /**
   * Return an array of token objects breaking the screenplay into type, text, etc. tokens.
   * 
   * @param { String } script - Text of the screenplay
   * @returns { Array<any> }
   */
  tokenize(script: string): any[] {
    let script_lines: string[] = this.clean(script).split(sections.splitter),
      match: any,
      parts: any,
      text: any,
      meta: any,
      tokens: IToken[] = [],
      scene_number: number = 0;

    for (let i = 0; i < script_lines.length; i++) {
      let line = script_lines[i];

      // title page
      if (sections.title_page.test(line)) {
        match = line.replace(sections.title_page, '\n$1').split(sections.splitter);
        for (let x = 0, length = match.length; x < length; x++) {
          parts = match[x].replace(sections.cleaner, '').split(/\:\n*/);

          // Handle titles with colons in them
          if (parts.length > 2) {
            const colonTitle = parts.slice(1).map(p => p.trim()).join(': ')
            tokens.push({ type: parts[0].trim().toLowerCase().replace(' ', '_'), text: colonTitle.trim() });
          } else {
            tokens.push({ type: parts[0].trim().toLowerCase().replace(' ', '_'), text: parts[1].trim() });
          }
        }
        continue;
      }

      /**
       * Scene headings
       * 
       * @todo:
       * - Figure out what the match fields are returning,
       *   and how to update the parsed meta results
       */
      if (match = line.match(sections.scene_heading)) {
        text = match[1] || match[2];

        if (text.indexOf('  ') !== text.length - 2) {
          if (meta = text.match(sections.scene_number)) {
            meta = meta[2];
            text = text.replace(sections.scene_number, '');
          }

          if (meta) {
            scene_number = meta
          }

          tokens.push({ type: 'scene_heading', text: text, scene_number: scene_number });

          // increment scene number
          scene_number += 1
        }
        continue;
      }

      // centered
      if (match = line.match(sections.centered)) {
        tokens.push({ type: 'centered', text: match[0].replace(/>|</g, '') });
        continue;
      }

      // transitions
      if (match = line.match(sections.transition)) {
        tokens.push({ type: 'transition', text: match[1] || match[2] });
        continue;
      }

      // dialogue blocks - characters, parentheticals and dialogue
      if (match = line.match(sections.dialogue)) {
        if (match[1].indexOf('  ') !== match[1].length - 2) {
          // PR: Fixed the bug where parentheticals are after the dialogue
          // https://github.com/nathanhoad/fountain-js/pull/7
          // parts = match[3].split(/(\(.+\))(?:\n+)/).reverse();
          parts = match[3].split(/(\(.+\))(?:\n+)/);

          let dual_diaglogue = !!match[2];

          if (dual_diaglogue) {
            // If dual dialogue, we need to traverse back four indexes
            // and insert those into a dual dialogue block
            // Get last index of the last inserted dialogue block
            let lastDialogueBeginIndex: number = 0;
            for (let idx = tokens.length - 1; idx >= 0; idx--) {
              if (tokens[idx].type === 'dialogue_begin') {
                lastDialogueBeginIndex = idx;
                break;
              }
            }

            const leftDualDialogueBlocks = tokens.splice(lastDialogueBeginIndex)
            tokens.push({ type: 'dual_dialogue_begin' });

            // Insert previous dialogue block into dual dialogue
            tokens = tokens.concat(leftDualDialogueBlocks)
          }


          tokens.push({ type: 'dialogue_begin' });
          tokens.push({ type: 'character', text: match[1].trim() });

          for (let x = 0, length = parts.length; x < length; x++) {
            text = parts[x].trim();

            if (text.length > 0) {
              tokens.push({ type: sections.parenthetical.test(text) ? 'parenthetical' : 'dialogue', text: text });
            }
          }

          tokens.push({ type: 'dialogue_end' });

          if (dual_diaglogue) {
            tokens.push({ type: 'dual_dialogue_end' });
          }
          continue;
        }
      }

      // section
      if (match = line.match(sections.section)) {
        tokens.push({ type: 'section', text: match[2], depth: match[1].length });
        continue;
      }

      // synopsis
      if (match = line.match(sections.synopsis)) {
        tokens.push({ type: 'synopsis', text: match[1] });
        continue;
      }

      // notes
      if (match = line.match(sections.note)) {
        tokens.push({ type: 'note', text: match[1] });
        continue;
      }

      // boneyard
      if (match = line.match(sections.boneyard)) {
        tokens.push({ type: match[0][0] === '/' ? 'boneyard_begin' : 'boneyard_end' });
        continue;
      }

      // page breaks
      if (sections.page_break.test(line)) {
        tokens.push({ type: 'page_break' });
        continue;
      }

      // line breaks
      if (sections.line_break.test(line)) {
        tokens.push({ type: 'line_break' });
        continue;
      }

      // lyrics
      if (sections.lyrics.test(line)) {
        tokens.push({ type: 'lyrics', text: line });
        continue;
      }

      tokens.push({ type: 'action', text: line });
    }

    return tokens;
  }
};

const tokenizer = new ScriptTokenizer()
export { tokenizer }