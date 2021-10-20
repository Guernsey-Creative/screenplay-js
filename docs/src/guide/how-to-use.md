# How to Use

After parsing a screenplay file into text, ScreenplayJS can parse a string and return a [ScriptJSON object](#scriptjson).

```javascript
import { FountainParser } from "screenplay-js";

// Read file as a string
const screenplay_string = yourFileReaderFunction(screenplay_file)

// Parse screenplay text
const script_json = FountainParser.parse(screenplay_string);
```

> For an example of reading a FDX file and other use cases read the [Use Cases and Examples section](./examples/converting-final-draft.md).