## About

ScreenplayJS is a [Fountain](https://fountain.io/) screenplay parser based on [fountain-js](https://github.com/mattdaly/Fountain.js) and [afterwriting-labs](https://github.com/ifrost/afterwriting-labs).

Have a screenplay written in Fountain and need it converted to an HTML format? ScreenplayJS can do just that. 

> ScreenplayJS was written in TypeScript and includes typings by default.

## Installation

```
npm install screenplay-js
```

```
yarn install screenplay-js
```

## How to Use

ScreenplayJS parses a string and returns a [ScriptJSON object](#scriptjson).

```
import { FountainParser } from "screenplay-js";

// Read file as a string
const screenplay_string = yourFileReaderFunction(screenplay_file)

// Parse screenplay text
const script_json = FountainParser.parse(screenplay_string);
```

> For other use cases read the [Use Cases and Examples section](#examples-and-use-cases).

## Parser Options

By default, ScreenplayJS parses Fountain tokens such as notes, boneyard, and draft date. It also omits returning a list of tokens. You can enable or disable parsing options in the global config or passing in parameters to the `parse` function.

Globally enabling token parsing:

```
import { FountainParser } from "screenplay-js";

// Enable token parsing
FountainParser.options.tokens = true;

// Read file as a string
const screenplay_string = yourFileReaderFunction(screenplay_file)

// Parse screenplay text
const script_json = FountainParser.parse(screenplay_string);
```

Enabling token parsing on the function:
```
import { FountainParser } from "screenplay-js";

// Read file as a string
const screenplay_string = yourFileReaderFunction(screenplay_file)

// Add token parsing to an options object
const your_options = { tokens: true }

// Parse screenplay text
const script_json = FountainParser.parse(screenplay_string, your_options);
```

> Note: There is no need to pass in the full options object. ScreenplayJS will merge your
> options in with the default config options.

The default options object looks like:

```
defaultOptions: IParserOptions = {
  paginate: true,
  lines_per_page: "loose",
  script_html: false,
  script_html_array: false,
  notes: true,
  draft_date: true,
  boneyard: true,
  tokens: false
}
```

## Outputs and Interfaces

If you are writing in TypeScript, then all of ScreenplayJS interfaces can be imported
and extended in your project and for your use-cases.

```
import { IScriptJSON } from 'screenplay-js'
```

### ScriptJSON

```
IScriptJSON {
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
```

### Token

```
IToken {
  type?: string,
  text?: string,
  scene_number?: number,
  depth?: number
}
```

### ScriptPage

```
IScriptPage {
  _id: string;
  html: string;
}
```

### Parser Options

```
IParserOptions {
  paginate: boolean,
  lines_per_page: 'none' | 'loose' | 'normal' | 'tight' | 'very_tight',
  script_html: boolean,
  script_html_array: boolean,
  notes: boolean,
  draft_date: boolean
  boneyard: boolean,
  tokens: boolean,
}
```

## Examples and Use Cases

### GuernseyBros

ScreenplayJS is used in the [GuernseyBros](https://www.guernseybros.com/) project. You can read their latest sketches, 
spec scripts, or feature length screenplays on their website. GuernseyBros uses VueJS, Nuxt, and ScreenplayJS to parse 
Fountain scripts into HTML, providing mobile responsive reading for their scripts and screenplays.


### Additional Examples

More examples will be added in the future!

## License

The MIT License (MIT)

Copyright (c) 2021 Aaron Guernsey

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.