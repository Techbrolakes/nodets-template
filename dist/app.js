"use strict";
var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// node_modules/module-alias/index.js
var require_module_alias = __commonJS({
  "node_modules/module-alias/index.js"(exports, module2) {
    "use strict";
    var BuiltinModule = require("module");
    var Module = module2.constructor.length > 1 ? module2.constructor : BuiltinModule;
    var nodePath = require("path");
    var modulePaths = [];
    var moduleAliases = {};
    var moduleAliasNames = [];
    var oldNodeModulePaths = Module._nodeModulePaths;
    Module._nodeModulePaths = function(from) {
      var paths = oldNodeModulePaths.call(this, from);
      if (from.indexOf("node_modules") === -1) {
        paths = modulePaths.concat(paths);
      }
      return paths;
    };
    var oldResolveFilename = Module._resolveFilename;
    Module._resolveFilename = function(request, parentModule, isMain, options) {
      for (var i = moduleAliasNames.length; i-- > 0; ) {
        var alias = moduleAliasNames[i];
        if (isPathMatchesAlias(request, alias)) {
          var aliasTarget = moduleAliases[alias];
          if (typeof moduleAliases[alias] === "function") {
            var fromPath = parentModule.filename;
            aliasTarget = moduleAliases[alias](fromPath, request, alias);
            if (!aliasTarget || typeof aliasTarget !== "string") {
              throw new Error("[module-alias] Expecting custom handler function to return path.");
            }
          }
          request = nodePath.join(aliasTarget, request.substr(alias.length));
          break;
        }
      }
      return oldResolveFilename.call(this, request, parentModule, isMain, options);
    };
    function isPathMatchesAlias(path, alias) {
      if (path.indexOf(alias) === 0) {
        if (path.length === alias.length)
          return true;
        if (path[alias.length] === "/")
          return true;
      }
      return false;
    }
    function addPathHelper(path, targetArray) {
      path = nodePath.normalize(path);
      if (targetArray && targetArray.indexOf(path) === -1) {
        targetArray.unshift(path);
      }
    }
    function removePathHelper(path, targetArray) {
      if (targetArray) {
        var index = targetArray.indexOf(path);
        if (index !== -1) {
          targetArray.splice(index, 1);
        }
      }
    }
    function addPath(path) {
      var parent;
      path = nodePath.normalize(path);
      if (modulePaths.indexOf(path) === -1) {
        modulePaths.push(path);
        var mainModule = getMainModule();
        if (mainModule) {
          addPathHelper(path, mainModule.paths);
        }
        parent = module2.parent;
        while (parent && parent !== mainModule) {
          addPathHelper(path, parent.paths);
          parent = parent.parent;
        }
      }
    }
    function addAliases(aliases) {
      for (var alias in aliases) {
        addAlias(alias, aliases[alias]);
      }
    }
    function addAlias(alias, target) {
      moduleAliases[alias] = target;
      moduleAliasNames = Object.keys(moduleAliases);
      moduleAliasNames.sort();
    }
    function reset() {
      var mainModule = getMainModule();
      modulePaths.forEach(function(path) {
        if (mainModule) {
          removePathHelper(path, mainModule.paths);
        }
        Object.getOwnPropertyNames(require.cache).forEach(function(name) {
          if (name.indexOf(path) !== -1) {
            delete require.cache[name];
          }
        });
        var parent = module2.parent;
        while (parent && parent !== mainModule) {
          removePathHelper(path, parent.paths);
          parent = parent.parent;
        }
      });
      modulePaths = [];
      moduleAliases = {};
      moduleAliasNames = [];
    }
    function init(options) {
      if (typeof options === "string") {
        options = { base: options };
      }
      options = options || {};
      var candidatePackagePaths;
      if (options.base) {
        candidatePackagePaths = [nodePath.resolve(options.base.replace(/\/package\.json$/, ""))];
      } else {
        candidatePackagePaths = [nodePath.join(__dirname, "../.."), process.cwd()];
      }
      var npmPackage;
      var base;
      for (var i in candidatePackagePaths) {
        try {
          base = candidatePackagePaths[i];
          npmPackage = require(nodePath.join(base, "package.json"));
          break;
        } catch (e) {
        }
      }
      if (typeof npmPackage !== "object") {
        var pathString = candidatePackagePaths.join(",\n");
        throw new Error("Unable to find package.json in any of:\n[" + pathString + "]");
      }
      var aliases = npmPackage._moduleAliases || {};
      for (var alias in aliases) {
        if (aliases[alias][0] !== "/") {
          aliases[alias] = nodePath.join(base, aliases[alias]);
        }
      }
      addAliases(aliases);
      if (npmPackage._moduleDirectories instanceof Array) {
        npmPackage._moduleDirectories.forEach(function(dir) {
          if (dir === "node_modules")
            return;
          var modulePath = nodePath.join(base, dir);
          addPath(modulePath);
        });
      }
    }
    function getMainModule() {
      return require.main._simulateRepl ? void 0 : require.main;
    }
    module2.exports = init;
    module2.exports.addPath = addPath;
    module2.exports.addAlias = addAlias;
    module2.exports.addAliases = addAliases;
    module2.exports.isPathMatchesAlias = isPathMatchesAlias;
    module2.exports.reset = reset;
  }
});

// node_modules/module-alias/register.js
require_module_alias()();

// src/routes/hello.ts
var hello = () => {
  console.log("Hello Routes");
};
var hello_default = hello;

// src/app.ts
console.log("Hello world!");
hello_default();
