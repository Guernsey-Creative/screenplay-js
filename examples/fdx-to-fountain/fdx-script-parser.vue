<template>
  <div>
    <!-- File input -->
    <div>
      <label for="fdx-file-input"> Upload FDX file </label>
      <input id="fdx-file-input" type="file" @change="handleReadFile($event)" />
    </div>

    <!-- Display parsed results -->
    <div>
      <pre>{{ script_json }}</pre>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from "vue-property-decorator";
  import { ScriptConverter } from ".";
  import { FountainParser } from "../../src/screenplay-js";

  @Component
  export default class AccountScripts extends Vue {
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
</script>

<style lang="scss" scoped></style>

