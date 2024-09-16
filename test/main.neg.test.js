const assert = require('assert');

describe('simple add function when imported with vanilla commonJs require', () => {
  const vanillaRequire = require("./browser.scripts/add.js");
  it('should load something', () => {
    assert(typeof vanillaRequire !== "undefined");
  });
  it('should not find function in the required result', () => {
    assert(typeof vanillaRequire.A === "undefined");
  });
  it('should not find function in global scope', () => {
    assert(typeof A === "undefined");
  });
});