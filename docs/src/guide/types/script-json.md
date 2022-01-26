# ScriptJSON

| Field | Type | Description |
|--------|--------|--------|--------|--------|
| **title** | `string` | Title of the script. |
| **credit** | `string` | Attribution of the script, i.e. 'Written by'. |
| **authors** | `Array<string>` | Authors of the script |
| **source** | `string` | Source of the script, i.e. 'Story by...' |
| **notes** | `string` | Additional information about the script. |
| **draft_date** | `string` | Date of draft in a string format. |
| **date** | `string` | Published date of the script. |
| **contact** | `string` | Contact information of the authors. |
| **copyright** | `string` | Copyright year of the script. |
| **scenes** | `Array<string>` | The parsed scenes of a script. |
| **title_page_html** | `string` | The HTML of the script title page. |
| **script_html** | `string` | The HTML of the parsed script. |
| **script_pages** | `IScriptPage[]` | The parsed script broken into pages. Each page is represented by the array index. |
| **script_pages_html** | `Array<Array<string>>` | The HTML of the parsed script pages. |
| **script_html_array** | `Array<string>` | The HTML for the parsed script. |