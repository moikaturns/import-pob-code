import { expect } from 'chai';
import { load } from '../src/index.js';

const noop = ()=>0;

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
});
