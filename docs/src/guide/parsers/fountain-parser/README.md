# FountainParser

Methods available:
- `parse`

##  `.parse()`

### Example

Below is an example of parsing a Fountain file using `screenplay-js`:

```javascript
import { FountainParser } from "screenplay-js";

// Read file as a string
const screenplay_string = yourFileReaderFunction(screenplay_file)

// Parse screenplay text
const script_json = FountainParser.parse(screenplay_string);
```

To configure the default options for parsing, pass in an additional argument with the desired options:

```javascript
const options = { /* custom parse options */ };
const script_json = FountainParser.parse(screenplay_string, options);
```

### Options

| Option | Required | Default | Type | Description |
|--------|--------|--------|--------|--------|
| **paginate** | `false` | `true` | `Boolean` | Whether to paginate the HTML results |
| **lines_per_page** | `false` | `"loose"` | `String` | How many approximate lines-per-page, [via FinalDraft](https://kb.finaldraft.com/s/article/How-many-lines-per-page-does-Final-Draft-write-and-what-are-my-line-spacing-options) |
| **script_html** | `false` | `false` | `Boolean` | Whether to add a HTML string to the returned [ScriptJSON object](#scriptjson) |
| **script_html_array** | `false` | `false` | `Boolean` | Whether to add an array of HTML strings to the returned [ScriptJSON object](#scriptjson) |
| **notes** | `false` | `true` | `Boolean` | Whether to parse note tokens from a Fountain file |
| **draft_date** | `false` | `true` | `Boolean` | Whether to parse the draft date token from a Fountain file |
| **boneyard** | `false` | `true` | `Boolean` | Whether to parse boneyard tokens from a Fountain file |
| **tokens** | `false` | `false` | `Boolean` | Whether to add a list of tokens in returned [ScriptJSON object](#scriptjson) |