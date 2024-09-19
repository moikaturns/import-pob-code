# import-pob-code
Import plain old browser code for unit testing in node.

# The Problem
JavaScript files intended to run in a browser that aren't defined as a module can be problematic to unit test with node frameworks. The scripts are referred to variously as plain old JavaScript, browser script, module-less or non-modular code and so on. An attempt to unit test such a script in node might look like this:

src/script.js
```
function A() {
  this.do = function() {return 42};
}
```

test/script.test.js
```
require('./../src/script.js');
describe('A', () => {
  if('should provide the answer to life, the universe and everything', () => {
    const a = new A();
    expect(a.do()).toEqual(42);
  }
}
```

The test fails because ```A``` is undefined. Every top-level name ```script.js``` defines wants to dump itself into the global namespace of the browser when it executes. This isn't a fault, it's just that in a node context this is prevented from happening. The act of requiring a file in node results in its script being wrapped inside a function. The name ```A``` in this script therefore no longer ends up in the global scope, thereby hiding it from the test file.

# Possible Solutions
Converting the files to JavaScript module syntax would work as browsers and node understand them, but might require quite a bit of refactoring. A cheap workaround could invole modifying the browser script so it recognises when it's running inside node and exports what's needed, this might not be pretty and the edits won't be adding much value to the script files themselves.

# This Solution
This library provides a non-intrusive way of requiring the non-modular browser script from within node, one which supports a way to export what's needed from a script for unit testing that doesn't involve modifying the original script.

To fix the test failure above with this library is a one-line change to the test file, like so:

./test/script.test.js
```
const A = require('@moikaturns/import-pob-code').load({ file: './../src/script.js', exports: ['A']}).A;
describe('A', () => {
  if('should provide the answer to life, the universe and everything', () => {
    const a = new A();
    expect(a.do()).toEqual(42);
  }
}
```

The above example should run without error.

# How It Works
The library's load method will synchronously read the target script specified by ```file``` then wrap it in a new function that returns an object containing references to the variables named by ```exports``` when the new function is invoked.

The load method can also be provided any number of variables in a ```context``` object that are made visible to the script when executed. This is useful to mock dependencies such as the DOM or 3rd party libraries the script expects to exist at runtime. See examples below.

# Further Examples
See unit test files.

# Usage
Installation:
```
npm install @moikaturns/import-pob-code --save-dev
```
For a simple example see 'This Solution' above.
