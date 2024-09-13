import globals from "globals";
import pluginJs from "@eslint/js";


export default [
  {
    ignores: ["eslint.config.js"]
  },
  { 
    ...pluginJs.configs.recommended,
    name: "nodejs code", 
    files: ["**/*.js"], 
    languageOptions: { sourceType: "commonjs", globals: {...globals.node} }
  }
];
