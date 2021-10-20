## About

ScreenplayJS is a [Fountain](https://fountain.io/) screenplay parser based on [fountain-js](https://github.com/mattdaly/Fountain.js) and [afterwriting-labs](https://github.com/ifrost/afterwriting-labs).

Have a screenplay written in Fountain and need it converted to an HTML format? ScreenplayJS can do just that. 

## Documentation
For more detailed info, check out the [documentation](https://friendly-brahmagupta-74d600.netlify.app/).

## Installation

```
npm install screenplay-js
```

```
yarn add screenplay-js
```

## How to Use

After parsing a screenplay file into text, ScreenplayJS can parse a string and return a [ScriptJSON object](#scriptjson).

```
import { FountainParser } from "screenplay-js";

// Read file as a string
const screenplay_string = yourFileReaderFunction(screenplay_file)

// Parse screenplay text
const script_json = FountainParser.parse(screenplay_string);
```

> For an example of reading a FDX file and other use cases read the [Use Cases and Examples section](#examples-and-use-cases).

## Updating Configuration

By default, ScreenplayJS parses Fountain tokens such as notes, boneyard, and draft date. It also omits returning a list of tokens. You can enable or disable parsing options in the global config or by passing in parameters to the `parse` function.

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

**Note**: It is acceptable to pass in a partial options object. ScreenplayJS will merge your
options in with the default config options.

## Default Config Options

| Option | Required | Default | Type | Description |
|--------|--------|--------|--------|--------|
| paginate | false | true | boolean | Whether to paginate the HTML results |
| lines_per_page | false | "loose" | string | How many approximate lines-per-page, [via FinalDraft](https://kb.finaldraft.com/s/article/How-many-lines-per-page-does-Final-Draft-write-and-what-are-my-line-spacing-options) |
| script_html | false | false | boolean | Whether to add a HTML string to the returned [ScriptJSON object](#scriptjson) |
| script_html_array | false | false | boolean | Whether to add an array of HTML strings to the returned [ScriptJSON object](#scriptjson) |
| notes | false | true | boolean | Whether to parse note tokens from a Fountain file |
| draft_date | false | true | boolean | Whether to parse the draft date token from a Fountain file |
| boneyard | false | true | boolean | Whether to parse boneyard tokens from a Fountain file |
| tokens | false | false | boolean | Whether to add a list of tokens in returned [ScriptJSON object](#scriptjson) |

## Outputs and Interfaces

ScreenplayJS has various interfaces that can be imported and extended within your project.

Example of importing the `IScriptJSON` interface.

> For more about Interfaces read [TypeScript's documentation](https://www.typescriptlang.org/docs/handbook/interfaces.html)

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
spec scripts, or feature length screenplays on their website. 

GuernseyBros uses VueJS, Nuxt, and ScreenplayJS to parse 
Fountain scripts into HTML, providing mobile responsive scripts and screenplays.

### Uploading and Converting a FDX File to Fountain

An example of how to upload a Final Draft (FDX) file to Fountain screenplay format can be found in the 
exaples directory under the [fdx-to-fountain sub-directory](https://github.com/Guernsey-Creative/screenplay-js/tree/main/examples/fdx-to-fountain).

> This example is a TypeScript example written in VueJS. Feel free to copy-and-paste or convert it to the language
> of your choosing.

### Additional Examples

More examples will be added in the future. Check them out in the [example directory](https://github.com/Guernsey-Creative/screenplay-js/tree/main/examples)!

## License

MIT
