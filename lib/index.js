"use strict";

var fs = require("fs");

function load(options) {
  var result = {};
  //
  // unpack options
  //
  var scriptToLoad = options.file || "";
  var context = options.context || {};
  var exports = options.exports && (options.exports.length && options.exports || Object.keys(options.exports)) || [];
  try {
    //
    // absolute path and filename of caller
    //
    var callerFileAndPath = _getCallerFile(1);
    //
    // absolute path of caller
    //
    var callerPath = callerFileAndPath.substring(0, callerFileAndPath.lastIndexOf("/")) + "/";
    //
    // absolute path to browser script
    //
    scriptToLoad = scriptToLoad[0] == "/" && scriptToLoad || callerPath + scriptToLoad;
    //
    // wrap browser script in a function
    //	first assign each context prop its own var to make them visible to browser script
    //	use ES3 as immune to any transpile
    //	unique var name to avoid name collision
    //
    var contextUnique = "_context_" + new Date().getTime();
    var srcFunction = "var " + contextUnique + " = arguments[0];";
    for (var prop in context) {
      srcFunction += "var " + prop + " = " + contextUnique + "." + prop + ";";
    } //
    // then load browser script (the meat) and concat to function
    //
    srcFunction += fs.readFileSync(scriptToLoad);
    //
    // lastly return vars to be exported from browser script
    //	unique var to avoid name collision
    //
    var resultUnique = "_result_" + new Date().getTime();
    srcFunction += "; var " + resultUnique + " = {};";
    exports.forEach(function (prop) {
      return srcFunction += resultUnique + "." + prop + " = " + prop + ";";
    });
    srcFunction += "return " + resultUnique + ";";
    //
    // parse and execute the function/script, should return vars to be exported
    //
    result = new Function(srcFunction)(context);
  } catch (err) {
    console.error("loading browser script '" + scriptToLoad + "' throws error " + err);
    result = {};
  }
  //
  // return browser script exports
  //
  return result;
}

// https://stackoverflow.com/questions/16697791/nodejs-get-filename-of-caller-function
function _getCallerFile(callerLevel) {
  var prepareStackTraceOrg = Error.prepareStackTrace;
  var err = new Error();
  Error.prepareStackTrace = function (_, stack) {
    return stack;
  };
  var stack = err.stack;
  Error.prepareStackTrace = prepareStackTraceOrg;
  var filename = stack[callerLevel + 1].getFileName();
  return filename.substring(0, 7) === "file://" ? filename.substring(7) : filename;
}

module.exports = {
  load: load
};