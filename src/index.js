const fs = require("fs");

function load(options) {
  let result = {};
  //
  // unpack options
  //
  let scriptToLoad = options.file || "";
  const context = options.context || {};
  const exports =
    (options.exports &&
      ((options.exports.length && options.exports) ||
        Object.keys(options.exports))) ||
    [];
  try {
    //
    // absolute path and filename of caller
    //
    const callerFileAndPath = _getCallerFile(1);
    //
    // absolute path of caller
    //
    const callerPath =
      callerFileAndPath.substring(0, callerFileAndPath.lastIndexOf("/")) + "/";
    //
    // absolute path to browser script
    //
    scriptToLoad =
      (scriptToLoad[0] == "/" && scriptToLoad) || callerPath + scriptToLoad;
    //
    // wrap browser script in a function
    //	first assign each context prop its own var to make them visible to browser script
    //	use ES3 as immune to any transpile
    //	unique var name to avoid name collision
    //
    const contextUnique = `_context_${new Date().getTime()}`;
    let srcFunction = `var ${contextUnique} = arguments[0];`;
    for (let prop in context)
      srcFunction += `var ${prop} = ${contextUnique}.${prop};`;
    //
    // then load browser script (the meat) and concat to function
    //
    srcFunction += fs.readFileSync(scriptToLoad);
    //
    // lastly return vars to be exported from browser script
    //	unique var to avoid name collision
    //
    const resultUnique = `_result_${new Date().getTime()}`;
    srcFunction += `; var ${resultUnique} = {};`;
    exports.forEach(
      (prop) => (srcFunction += `${resultUnique}.${prop} = ${prop};`),
    );
    srcFunction += `return ${resultUnique};`;
    //
    // parse and execute the function/script, should return vars to be exported
    //
    result = new Function(srcFunction)(context);
  } catch (err) {
    console.error(
      `loading browser script '${scriptToLoad}' throws error ${err}`,
    );
    result = {};
  }
  //
  // return browser script exports
  //
  return result;
}

// https://stackoverflow.com/questions/16697791/nodejs-get-filename-of-caller-function
function _getCallerFile(callerLevel) {
  const prepareStackTraceOrg = Error.prepareStackTrace;
  const err = new Error();
  Error.prepareStackTrace = function (_, stack) {
    return stack;
  };
  const stack = err.stack;
  Error.prepareStackTrace = prepareStackTraceOrg;
  let filename = stack[callerLevel + 1].getFileName();
  return filename.substring(0,7) === "file://" ? filename.substring(7) : filename;
}

module.exports = {
  load,
};
