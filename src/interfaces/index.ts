export interface IToken {
  type?: string,
  text?: string,
  scene_number?: number,
  depth?: number
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
  boneyard: boolean,
  tokens: boolean,
}

export interface IScriptJSON {
  title: String,
  credit: String,
  authors: string[],
  source: String,
  notes?: String,
  draft_date?: String,
  date: String,
  contact: String,
  copyright: String,
  scenes: string[],
  title_page_html: String,
  script_html?: String,
  script_pages: IScriptPage[],
  script_pages_html: string[][],
  script_html_array?: string[],
  tokens?: IToken[]
}