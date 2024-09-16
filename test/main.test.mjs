import { expect } from 'chai';
import { load } from '../src/index.js';

const noop = ()=>0;

describe('simple add function', () => {
  it('should load browser script and export its add function with this package', () => {
    const exported = load({file:"browser.scripts/add.js", exports: ['add']});
    expect(exported.add(1,2)).to.equal(3);
  });
});

describe('simple add function with alert', () => {
  it('should load browser script, export its add function and stub the alert', () => {
    const exported = load({file:"browser.scripts/add.alert.js", context: {alert: noop}, exports: ['add']});
    expect(exported.add(1,2)).to.equal(3);
  });
});
