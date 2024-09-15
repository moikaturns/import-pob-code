import { expect } from 'chai';
import { load } from '../src/index.js';

describe('simple add function', () => {
  it('should load browser script and export the add function', () => {
    const exported = load({file:"browser.add.js", exports: ['add']});
    expect(exported.add(1,2)).to.equal(3);
  });
});