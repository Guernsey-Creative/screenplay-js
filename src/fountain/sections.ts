class Sections {
  title_page = /^((?:title|credit|author[s]?|source|notes|draft date|date|contact|copyright)\:)/gim;

  scene_heading = /^((?:\*{0,3}_?)?(?:(?:int|ext|est|i\/e)[. ]).+)|^(?:\.(?!\.+))(.+)/i;
  scene_number = /( *#(.+)# *)/;

  transition = /^((?:FADE (?:TO BLACK|OUT)|CUT TO BLACK)\.|.+ TO\:)|^(?:> *)(.+)/;

  dialogue = /^(\@?[A-Za-z*_]+[0-9A-Z (._\-'’)]*)(\^?)?(?:\n(?!\n+))([\s\S]+)/;
  parenthetical = /^(\(.+\))$/;
  lyrics = /^~(.+)/g;
  action = /^(.+)/g;
  centered = /^(?:> *)(.+)(?: *<)(\n.+)*/g;

  section = /^(#+)(?: *)(.*)/;
  synopsis = /^(?:\=(?!\=+) *)(.*)/;

  note = /^(?:\[{2}(?!\[+))(.+)(?:\]{2}(?!\[+))$/;
  note_inline = /(?:\[{2}(?!\[+))([\s\S]+?)(?:\]{2}(?!\[+))/g;
  boneyard = /(^\/\*|^\*\/)$/g;

  page_break = /^\={3,}$/;
  line_break = /^ {2}$/;

  emphasis = /(_|\*{1,3}|_\*{1,3}|\*{1,3}_)(.+)(_|\*{1,3}|_\*{1,3}|\*{1,3}_)/g;
  bold_italic_underline = /(_{1}\*{3}(?=.+\*{3}_{1})|\*{3}_{1}(?=.+_{1}\*{3}))(.+?)(\*{3}_{1}|_{1}\*{3})/g;
  bold_underline = /(_{1}\*{2}(?=.+\*{2}_{1})|\*{2}_{1}(?=.+_{1}\*{2}))(.+?)(\*{2}_{1}|_{1}\*{2})/g;
  italic_underline = /(?:_{1}\*{1}(?=.+\*{1}_{1})|\*{1}_{1}(?=.+_{1}\*{1}))(.+?)(\*{1}_{1}|_{1}\*{1})/g;
  bold_italic = /(\*{3}(?=.+\*{3}))(.+?)(\*{3})/g;
  bold = /(\*{2}(?=.+\*{2}))(.+?)(\*{2})/g;
  italic = /(\*{1}(?=.+\*{1}))(.+?)(\*{1})/g;
  underline = /(_{1}(?=.+_{1}))(.+?)(_{1})/g;

  splitter = /\n{2,}/g;
  cleaner = /^\n+|\n+$/;
  standardizer = /\r\n|\r/g;
  whitespacer = /^\t+|^ {3,}/gm;
}

const sections = new Sections()
const title_page = sections.title_page;
const scene_heading = sections.scene_heading;
const scene_number = sections.scene_number;
const transition = sections.transition;
const dialogue = sections.dialogue;
const parenthetical = sections.parenthetical;
const lyrics = sections.lyrics;
const action = sections.action;
const centered = sections.centered;
const section = sections.section;
const synopsis = sections.synopsis;
const note = sections.note;
const note_inline = sections.note_inline;
const boneyard = sections.boneyard;
const page_break = sections.page_break;
const line_break = sections.line_break;
const emphasis = sections.emphasis;
const bold_italic_underline = sections.bold_italic_underline;
const bold_underline = sections.bold_underline;
const italic_underline = sections.italic_underline;
const bold_italic = sections.bold_italic;
const bold = sections.bold;
const italic = sections.italic;
const underline = sections.underline;
const splitter = sections.splitter;
const cleaner = sections.cleaner;
const standardizer = sections.standardizer;
const whitespacer = sections.whitespacer;

export {
  sections,
  title_page,
  scene_heading,
  scene_number,
  transition,
  dialogue,
  parenthetical,
  lyrics,
  action,
  centered,
  section,
  synopsis,
  note,
  note_inline,
  boneyard,
  page_break,
  line_break,
  emphasis,
  bold_italic_underline,
  bold_underline,
  italic_underline,
  bold_italic,
  bold,
  italic,
  underline,
  splitter,
  cleaner,
  standardizer,
  whitespacer,
}