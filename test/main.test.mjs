import { expect } from 'chai';
import { load } from '../src/index.js';
import jsdom from 'jsdom';

const { JSDOM } = jsdom;

describe('scripts loaded with this package', () => {
  describe('simple add function', () => {
    it('should export the add function', () => {
      const exported = load({file:"browser.scripts/add.js", exports: ['add']});
      expect(exported.add(1,2)).to.equal(3);
    });
  });
  
  describe('simple add function with alert', () => {
    it('should export the add function and mock the alert function', () => {
      let alerted = 0;
      const exported = load({file:"browser.scripts/add.alert.js", context: {alert: answer => alerted = answer}, exports: ['add']});
      expect(exported.add(2,3)).to.equal(5);
      expect(alerted).to.equal(5);
    });
  });  

  describe('simple add function within dom', () => {
    it('should export the add function and mock the dom', () => {
      const dom = new JSDOM(`<!DOCTYPE html><button id="btn">action</button><p>response:</p><div id=answer></div></html>`);
      const { document } = dom.window;
      const exported = load({file:"browser.scripts/add.dom.js", context: {document}, exports: ['add']});
      expect(exported.add(40,2)).to.equal(42);
    });
  });

  describe('simple add function within jquery and dom', () => {
    it('should export the add function and mock the dom, jquery and invoke ready', () => {
      const dom = new JSDOM(`<!DOCTYPE html><p>answer:</p><div id=answer></div></html>`);
      let calledTimes = 0;
      const { document } = dom.window;
      const $ = function(_document) {
        return {ready: () => calledTimes++}
      };
      const exported = load({file:"browser.scripts/add.dom.jq.js", context: {document, $}, exports: ['add']});
      expect(exported.add(40,2)).to.equal(42);
      expect(calledTimes).to.equal(1);
    });
  });
});
