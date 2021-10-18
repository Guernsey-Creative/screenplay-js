## Example and Usage

Below is an example of a class object for parsing a Final Draft (FDX) file
into a Fountain file-format, and then converting it to an HTML object
using [screenplay-js](https://github.com/Guernsey-Creative/screenplay-js).

You can also find a VueJS example in the `fdx-script-parser.vue` file. Feel free to use
within your VueJS project or convert it to whichever template or framework you're using.

```jsx
// Import ScriptConverter class from your file directory
// ScriptConverter class and functions can be found within this
// directory (or the examples directory of the [screenplay-js](https://github.com/Guernsey-Creative/screenplay-js) project.)
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

## Node.js or Server-Side Usage

If you are trying to use this in a node.js environment, you will need to install a 
package like [jsdom](https://github.com/jsdom/jsdom) to have access to the DOM in a non-browser environment.