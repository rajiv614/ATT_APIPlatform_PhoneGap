define("att",["exports"],function(e){
/**
 * almond 0.2.5 Copyright (c) 2011-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap,
            foundI, foundStarMap, starI, i, j, part,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that "directory" and not name of the baseName's
                //module. For instance, baseName of "one/two/three", maps to
                //"one/two/three.js", but we want the directory, "one/two" for
                //this normalization.
                baseParts = baseParts.slice(0, baseParts.length - 1);

                name = baseParts.concat(name.split("/"));

                //start trimDots
                for (i = 0; i < name.length; i += 1) {
                    part = name[i];
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            break;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            } else if (name.indexOf('./') === 0) {
                // No baseName, so this is ID is resolved relative
                // to baseUrl, pull off the leading dot.
                name = name.substring(2);
            }
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            return req.apply(undef, aps.call(arguments, 0).concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relName) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i,
            args = [],
            usingExports;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (typeof callback === 'function') {

            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback.apply(defined[name], args);

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        config = cfg;
        if (config.deps) {
            req(config.deps, config.callback);
        }
        return req;
    };

    define = function (name, deps, callback) {

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());
define("../lib/almond", function(){});



//This module provides basic utility functions that att uses.

define('att/util',['require','exports','module'],function(require, exports, module) {
	
	var slice = Array.prototype.slice;
	var apply = Function.prototype.apply;
	var call = Function.prototype.call;
	
	function forEach(obj, func, scope) {
		if(typeof obj === 'object' && obj !== null) {
			var myScope = scope || obj;
			if(obj.forEach) {
	            if(obj.every) { //implements an alternative forEach with stop
	            	var stop;
	            	obj.every(function() {
	            		stop = func.apply(this, arguments);
	                    return stop !== undefined;
	            	}, myScope);
	            	return stop;
	            } else {
	            	obj.forEach.call(obj, func, scope);
	            }
	        } else {
	            for(var key in obj) {
	                if(obj.hasOwnProperty(key)) {
	                    var stop = func.call(myScope, obj[key], key, obj);
	                    if(stop) return stop;
	                }
	            }
	        }
	    }
	};
	exports.forEach = forEach;

	//Copies properties of the following objects to the toObj
	function copyObjTo(toObj) {
	    var copyObjs = slice.call(arguments, 1).reverse();
	    copyObjs.forEach(function(fromObj) {
	        forEach(fromObj, function(val, key){
	            toObj[key] = val;
	        });
	    });
	    return toObj;
	};
	exports.copyObjTo = copyObjTo;
	
	function isEmptyString(s) {
		return s === null || s === undefined || s === '';
	}
	
	function buildParams(paramConfigs, values, data) {
		var newParams = {};
		if(!values) values = {};
		
		forEach(paramConfigs, function(paramConfig, paramKey) {
			if(paramConfig === undefined) return;
			
			var paramVal = generateParamVal(values[paramKey], paramKey, paramConfig, data);
			if(!isEmptyString(paramVal)) {
				newParams[paramKey] = paramVal;
			}
		});
		
		return newParams;
	}
	exports.buildParams = buildParams;
	
	/**
	 * Parameter Config Object
	 * @param paramConfig {String/Object} - If a string is passed, the string is assumed to be the backup value
	 * @param paramConfig.paramKey {String} - key in the supplied params object
	 * @param paramConfig.backup {String/function(params, paramConfig)} - backup value if not in params, 
	 *        if it's a function, passes the params and paramConfig to generate the params
	 * @param paramConfig.required - {Boolean} if true, returns an error if not defined
	 * @param paramConfig.postProccess {function(val, params, paramConfig)} - method to run on the method value
	 * @param paramConfig.suffix {String} - text to add on the end of the header value
	 * @param paramConfig.prefix {String} - text to add to the beginning of the header value
	 * @param paramConfig.validate {function(val, params, paramConfig)} - should return an error if not valid
	 */
	
	function generateParamVal(val, key, paramConfig, data) {
		var paramConfigType = typeof paramConfig;
		if(paramConfigType === 'string' || paramConfigType === 'function') paramConfig = { backup: paramConfig };
		else if(paramConfigType === 'boolean') paramConfig = { required: paramConfig };
		
		if(!val && paramConfig.backup) {
			var backupType = typeof paramConfig.backup;
			if(backupType === 'function') {
				val = paramConfig.backup(data, paramConfig);
			} else if(backupType === 'string') {
				val = paramConfig.backup;
			}
		}
		
		if(paramConfig.postProcess) val = paramConfig.postProcess(val, data, paramConfig);
		
		val = val || '';
		if(paramConfig.prefix) val = paramConfig.prefix + val;
		if(paramConfig.suffix) val += paramConfig.suffix;
		
		if(!val && paramConfig.required) {
			var paramString = key ? ' "' + key + '"' : '';
			throw new Error('Required parameter' + paramString + ' is undefined');
		}
		
		if(paramConfig.validate) {
			//validate should throw if it fails
			paramConfig.validate(val, data, paramConfig);
		}
		
		return val;
	}
	
	var qs = exports.queryString = exports.qs = {};
	
	function addKeyValToArray(arr, key, val, assignmentVal) {
		arr.push(encodeURIComponent(key) + assignmentVal + encodeURIComponent(val));
	}
	
	//Stringify an object into a queryString
	function queryStringStringify(flatObj, delimiter, assignment) {
		if(typeof flatObj !== 'object') {
			return '';
		}
		
		var qsArr = [], assignmentVal = (typeof assignment === 'string') ? assignment : queryStringStringify.defaultAssignment;
        forEach(flatObj, function(val, key) {
        	if(isEmptyString(val)) return;
        	
        	if(Array.isArray(val)) {
        		qsArr.push(queryStringStringify.stringifyArray(key, val, delimiter, assignmentVal));
        	} else {
        		addKeyValToArray(qsArr, key, val, assignmentVal);
        	}
        });
        
        if(qsArr.length === 0) return '';
        
        return qsArr.join((typeof delimiter === 'string') ? delimiter : queryStringStringify.defaultDelimiter);
	};
	
	//Stringifies an array for a given key
	queryStringStringify.stringifyArray = function(key, arr, delimiter, assignment) {
		//The method ATT restful calls handles arrays
		var qsArr = [], assignmentVal = (typeof assignment === 'string') ? assignment : queryStringStringify.defaultAssignment;;
		arr.forEach(function(val, i) {
			addKeyValToArray(qsArr, key, val, assignmentVal);
		});
		return qsArr.join((typeof delimiter === 'string') ? delimiter : queryStringStringify.defaultDelimiter);
	};
	
	queryStringStringify.defaultDelimiter = '&';
	queryStringStringify.defaultAssignment = '=';
	
	qs.stringify = queryStringStringify;
	
	
	//Parses a queryString into a flat object
	function queryStringParse(qsString, delimiter, assignment) {
		var qsObj = {}, 
			assignmentVal = (typeof assignment === 'string') ? assignment : queryStringStringify.defaultAssignment,
			qsArr = qsString.split((typeof delimiter === 'string') ? delimiter : queryStringStringify.defaultDelimiter);
		
		qsArr.forEach(function(qsPart) {
			var components = qsPart.split(assignmentVal);
			if(components.length !== 2) return;
			
			var key = decodeURIComponent(components[0]),
				val = decodeURIComponent(components[1]),
				currentVal = qsObj[key];
			
			//Note: duplicates represent an array of values
			if(currentVal) {
				if(Array.isArray(currentVal)) {
					currentVal.push(val);
				} else {
					qsObj[key] = [currentVal, val];
				}
			} else {
				qsObj[key] = val;
			}
		});
		
		return qsObj;
	}
	queryStringParse.defaultDelimiter = '&';
	queryStringParse.defaultAssignment = '=';
	qs.parse = queryStringParse;
	
	
	function buildQueryString(allQSConfig, params, data) {
		return qs.stringify(buildParams(allQSConfig, params, data));
	}
	qs.buildFromConfig = buildQueryString;
	
	
	function getFromObject(obj, keyPath) {
		if(obj == null) return obj;
		
		var keyParts = keyPath.match(/(.*?)\.(.*)/);
		if(!keyParts) {
			return obj[keyPath];
		}
		
		var currentKey = keyParts[1];
		var otherKeys = keyParts[2];
		
		return getFromObject(obj[currentKey], otherKeys);
	}
	
	exports.getFromObject = function(obj, keyPath) {
		return getFromObject(obj, keyPath + '');
	};
	
	exports.arrayToHash = function() {
		return slice.call(arguments).reduce(function(totalHash, arr) {
			return arr.reduce(function(h, k) { h[k] = true; return h; }, totalHash);
		}, {});
	};
	
	//Needed to call functions on Titanium objects
	exports.apply = function(scope, method, args) {
		var myMethod = (typeof method === 'string') ? scope[method] : method;
		return apply.call(myMethod, scope, args);
	};
	
	var camelCase = exports.camelCase = function(str) {
		if(typeof str !== 'string') str += '';
		
		return str[0].toLowerCase() + str.slice(1);
	};
	
	var keysToCamelCase = exports.keysToCamelCase = function(obj) {
		if(Array.isArray(obj)) {
			return obj.map(keysToCamelCase);
		} else if(typeof obj !== 'object' || obj.toString() !== '[object Object]') {
			return obj;
		}
		
		var newObj = {};
		forEach(obj, function(val, key) {
			newObj[camelCase(key)] = keysToCamelCase(val);
			return false;
		});
		return newObj;
	};
	
	var capitalize = exports.capitalize = function(word) {
		return word[0].toUpperCase() + word.slice(1);
	};
	
	var log = exports.log = function() {
		console.log.apply(console, arguments);
	};
	
	var inherits = exports.inherits = function(NewClass, SuperClass, props) {
		NewClass.prototype = new SuperClass();
		NewClass.prototype.constructor = NewClass;
		SuperClass.prototype.super_ = SuperClass; //Similar to node.js
		copyObjTo(NewClass.prototype, props);
	};
});


define('att/constants',['require','exports','module','att/util'],function(require, exports, module) {
	var copyObjTo = require('att/util').copyObjTo;
	
	exports.header = {
		'accept': {
			JSON: 'application/json',
			XML: 'application/xml',
			URL_ENCODED: 'application/x-www-form-urlencoded'
		}
	};
	
	exports.paramKey = {
		HEADERS: 'headers',
		QUERY: 'query',
		URL_PARAMS: 'urlParams',
		FILE_PATH: 'filePath',
		BODY: 'body',
		ATTACHMENTS: 'attachments',
		OPTIONS: 'options'
	};
	
	exports.attachmentKeys = {
		BODY      : "body",
		FILE_PATH : "filePath",
		MIME_TYPE : "mimeType",
		NAME      : "name",
		ENCODING  : "fileEncoding"
	};
	
	exports.header.contentType = copyObjTo({}, exports.header.accept);
});

/*
 * TODO
 * 1. Make it so that filePath can use the 'file://' protocol in android
 */

/**
 * @description The ajax function is designed to take in the specified ajax parameters and make the
 * 	the HTTP request.  If a platform cannot handle an ajax parameter specified in the ajax API then
 * 	this function will thrown an error.
 * 
 * @method ajax(ajaxParams, success, fail) {Function} - Takes ajaxParams which describe the request
 * @param ajaxParams.url {String} - a string of the URL to send
 * @param ajaxParams.method {String} - the HTTP Method
 * @param [ajaxParams.headers] {Object} - A flat object of header titles to header values
 * @param [ajaxParams.query] {Object/String} - Either a flat object of query string keys to values a query string to append
 * @param [ajaxParams.body] {Object/String} - value to send in the request
 * @param [ajaxParams.filePath] {String} - file to send in the request, can't be used with body
 * @param [ajaxParams.attachments] {Array} - attachments to be sent in a multipart post, if ajaxParams.body is defined then posts multipart/related
 * @param [ajaxParams.options] {Object} - This is an object holding additional config parameters
 * @param [ajaxParams.options.isMultipart] {Boolean} - If attachments are present, this is true, if only body is specified 
 *                                         then the body is POSTed as the main part of multipart/related
 * @param success {Function} - success(response, attXHR) callback function on success
 * @param fail {Function} - fail(response, attXHR) callback function on success
 * @param [ajaxParams.responseFilePath] {String} - path where to save the response data, success response Object describes the filePathResponse
 * 
 * @param [attachmentObject.body] {String} - A string that will printed as multipart content, cannont be specified with filePath
 * @param [attachmentObject.filePath] {String} - File path that will be used as content, cannont be specified with body
 * @param attachmentObject.mimeType {String} - the Content-Type of the content
 * @param [attachmentObject.name] {String} - Name of the file/body.  Required if POSTing multipart/related
 * @param [attachmentObject.encoding="binary"] {String} - String encoding
 * 
 * The following are settings used by the ajax method to set for each platform
 * @attribute ajax.settings.getXHR {Function} - returns either a real or simulated XML HTTP Request object for the given platform
 * @attribute ajax.settings.timeout {Number} - number of milliseconds for the HTTP request to timeout
 * @attribute ajax.settings.isBridgeFunction {Function} - returns boolean of whether to use bridge function if the parameters can't be
 * 				handled in JavaScript by this platform.  Throws an error if there are parameters that can't be handled by bridge either
 * @attribute ajax.settings.bridgeFunction {Function} - makes the HTTP request if there are parameters that can't be handled in JavaScript
 */


define('att/ajax',['require','exports','module','att/util','att/constants'],function(require, exports, module) {
	var util = require('att/util')
	,	QS = util.qs
	,	constants = require('att/constants')
	,	functionsToExpose = ['abort', 'getResponseHeader', 'getAllResponseHeaders']
	,	valuesToExpose = ['readyState', 'responseText', 'responseData', 'responseType']
	,	valuesAfterHeaders = ['status', 'statusText'];
	
	var ajax;
	
	function generateErrorObj(type, message, errorProps) {
		var errorObj = {
			error: {
				type: type,
				message: message
			}
		};
		util.copyObjTo(errorObj.error, errorProps);
		return errorObj;
	}
	
	function formatError(e) {
		return generateErrorObj(e.constructor.name, e.message, { source: e });
	}
	
	function AttXHR(params, successCB, failCB) {
		if(true) util.log('Request: ' + JSON.stringify(params,null,3));
		
		if(params.isBridgeFunction || ajax.settings.isBridgeFunction(params)) {
			ajax.settings.bridgeFunction.call(this, params, successCB, failCB);
			return;
		}
		
		var attXHR = this
		,	xhr = ajax.settings.getXHR(params);
		
		if(!xhr) return;
		
		this.xhr = xhr;
		
		function exposeValues(name) {
			var val = xhr[name];
			if(typeof val !== undefined) attXHR[name] = val;
		}
		
		//Copy values from xhr to AttXHR
		var onreadystatechange = function() {
			valuesToExpose.forEach(exposeValues);
			
			//Accessing status before HEADERS_RECEIVED throws an error in chrome
			if(xhr.readyState >= xhr.HEADERS_RECEIVED) valuesAfterHeaders.forEach(exposeValues);
		};
		onreadystatechange();
		
		//Set up headers
		var headers = util.copyObjTo({}, params.headers), replied = false, timeoutHandle;
		
		//Set up listeners
		//Common reply pass through
		function onReply(replyFunc, data) {
			if(!replied) {
				onreadystatechange(); //Ensure the attAjax is in the right state
				
				//Note: Titanium on Android throws if timeoutHandle is not defined (and a number)
				if(timeoutHandle) clearTimeout(timeoutHandle);
				replied = true;
				replyFunc.call(attXHR, data, attXHR);
			}
		}
		
		function processResponseData() {
			var contentType = attXHR.getResponseHeader('Content-Type');
			return (contentType && contentType.indexOf(constants.header.contentType.JSON) >= 0) ?
				JSON.parse(xhr.responseText) :
				xhr.responseText;
		}
		
		var successFunc = function(evt) {
			if(true) util.log('Success: ' + xhr.responseText);
			
			if(xhr.status >= 400) {
				errorFunc.call(this, evt);
				return;
			}
			
			var data;
			try {
				data = processResponseData();
			} catch (e) {
				var errorObj = formatError(e);
				errorObj.error.type = 'AttXHRParseError';
				
				onReply(failCB, errorObj);
				return;
			}
			
			onReply(successCB, { data: data });
		};
		var errorFunc = function(evt) {
			var data;
			
			if(true) util.log('Error: ' + xhr.responseText);
			
			try { 
				data = processResponseData(); 
			} catch(e){}
			
			if(!data) data = xhr.responseText;
			
			var msg = evt.error || xhr.statusText || 'Connection Error';
			
			var errorObj = generateErrorObj('AttXHRRequestError', msg, {
				status: xhr.status
			});
			if(data) errorObj.data = data;
			
			onReply(failCB, errorObj);
		};
		function abortFunc() {
			if(timeoutHandle) {
				onReply(failCB, generateErrorObj('AttXHRAbortError', 'Request aborted'));
			}
		}
		
		if(true && xhr.addEventListener) {
			xhr.addEventListener('load', successFunc, false);
			xhr.addEventListener('error', errorFunc, false);
			xhr.addEventListener('abort', abortFunc, false);
			xhr.addEventListener('readystatechange', onreadystatechange);
		} else {
			xhr.onload = successFunc;
			xhr.onerror = errorFunc;
			xhr.onabort = abortFunc;
			xhr.readystatechange = onreadystatechange;
		}
		
		//Set up query string on the url
		var url = params.url;
		if(params.query) {
			var query = params.query, queryType = typeof query;
			query = (queryType === 'object') ? QS.stringify(query) :
					(queryType === 'string') ? query :
					false;
			
			if(query) url += '?' + query;
		}
		
		xhr.open(params.method, url, true);
		
		if(true) {
			headers["X-Requested-With"] = "XMLHttpRequest";
		}
		
		//Add headers
		
		
		//Set up the timeout
		var timeout = xhr.timeout = (params.timeout !== undefined) ? params.timeout : ajax.settings.timeout;
		if(true && timeout > 0) {
			//XMLHttpRequest doesn't have timeout built in on all browsers
			timeoutHandle = setTimeout(function() {
				timeoutHandle = null;
				xhr.abort();
				onReply(failCB, generateErrorObj('AttXHRTimeoutError', 'Request timed out after '+timeout+'ms'));
			}, timeout);
		}
		
		var body = params.body;
		if(typeof body === 'object') {
			switch(headers['Content-Type']) {
			case constants.header.contentType.JSON:
				body = JSON.stringify(params.body);
				break;
			case constants.header.contentType.URL_ENCODED:
				body = QS.stringify(params.body);
				break;
			default:
			}
			
			//TODO: Add Content-Length header of the stringified body:
			//headers['Content-Length'] = body.length + '';
		}
		
		util.forEach(headers, function(val, title) {
			if(val) xhr.setRequestHeader(title, val);
		});
		
		
		xhr.send(body);
	}
	
	functionsToExpose.forEach(function(funcName) {
		AttXHR.prototype[funcName] = function() {
			var xhr = this.xhr, method = xhr[funcName];
			return util.apply(xhr, method, arguments); //This is needed for Titanium on iPhone
		};
	});
	
	/*
	AttXHR.prototype.addEventListener = function(key, func) {
		var attXHR = this;
		this.xhr.addEventListener(key, function() {
			func.apply(attXHR, arguments);
		});
	};
	*/
	
	
	ajax = function ajax(params, successCB, failCB) {
		return new AttXHR(params, successCB, failCB);
	};
	
	
	//These are configurable global ajax settings that can be modified for each platform
	ajax.settings = {
		getXHR: (true) ? 
			function() {
				try {
					return new XMLHttpRequest();
				} catch(e) {}
			} : 
			function() {
				throw new Error('XMLHttpRequest is not defined. Override ajax.settings.getXHR to use the ajax function for this platform');
			}
		,
		timeout: 90000,
		isBridgeFunction: function(params) {
			return false;
		},
		bridgeFunction: function(){
			throw new Error('This method is not supported in this platform');
		}
	};
	
	module.exports = ajax;
});


/** @class RESTfulDefinition
 *  @description This Object is core of the API Layer.  It is designed to take API configurations
 *  	and perform common operations/validations/setup for each API to prepare the parameters for the 
 *  	Ajax Layer.  It uses a tree like structure to organize common APIs
 *  
 *  @method addDefinition {function(name, newObject)} - Attaches a new child RESTfulDefinition/ATTMethod to the current RESTfulDefinition.
 *  @method addMethod {function(name, method, params)} - Attaches a new child ATTMethod to the current RESTfulDefinition.
 *  @method getRoot {function(): RESTfulDefinition} - returns the root of the RESTfulDefinition tree
 *  @method forEachToRoot {function(func, scope)} - Simulates a Array.forEach function running from child to the root object
 *
 *  @method getHeaderConfig {function(): Object} - builds and returns config objects for headers for the given RESTfulDefinition
 *  @method getQueryStringConfig {function(): Object} - builds and returns config objects for query strings for the given RESTfulDefinition
 *	@method getUrlParamsConfig {function(): Object} - builds and returns config objects for URL parameters for the given RESTfulDefinition
 *	
 *	@method getHeaders {function(ajaxParams) : String} - Given ajax params, this returns a header object based on the total headerConfig
 *  			of the given RESTfulDefinition
 *  @method getQueryString {function(ajaxParams) : String} - Given ajax params, this returns a query string based on the total queryStringConfig
 *  			of the given RESTfulDefinition
 *  @method getUrl {function(ajaxParams) : String} - Given ajax params, this returns a URL string based on the total urlParamsConfig's
 *  			and total inferUrlParamsConfig which is generated from appendUrl's of the given RESTfulDefinition
 *  
 *  @method executor {function(attMethod, params, successCB, failCB) : result } - This is a pass-through method that is used
 *  			to run common operations based on the attMethod and params.  By default, it calls the parent executor but it
 *  			can be used to intercept and handle the request itself.
 *
 *  @param [appendUrl] {String} - URL fragment that is appended to the parent's appendUrl in getUrl
 *  @param [headerConfig] {Object} - Configuration object for the headers.
 *  @param [queryStringConfig] {Object} - Configuration object for the query string.
 *	@param [urlParamsConfig] {Object} - Configuration object for parameters in the URL.
 *  @param [methods] {Object} - temporary config object that sets up the ATTMethod branches on this object, deleted after setup
 *  
 */
/** Function ATTMethod extends RESTfulDefinition
 *  Branches of the ATT module tree, used create HTTP method calls.  The functions are defined
 *  by function([paramsObj], successCBFunc, failCBfunc)
 *  
 *  @method executor {Function} - This method can hold unique commands for the method but must be called by parent executors
 *  @param method - the HTTP method to be used, e.g. 'GET' or 'POST'
 *  @param authType - Determines what type of token is fetched and used for the request
 *  
 *  @returns Object
 *  @params active - active xhr or jqXHR request
 *  @params data - if executor returns data, it can be fetched here
 *  @params error - if an error occured, The object will be displayed here
 */

define('att/RESTfulDefinition',['require','exports','module','att/util','att/constants'],function(require, exports, module) {
	var util = require('att/util')
	,   copyObjTo = util.copyObjTo
	,   forEach = util.forEach
	,   buildParams = util.buildParams
	,   qs = util.qs
	,   constants = require('att/constants');
	
	
	//Sets up a basic ATT Object used for constructing our ATT method tree
	function RESTfulDefinition(props) {
		copyObjTo(this, props);
	}
	copyObjTo(RESTfulDefinition.prototype, {
		addDefinition: function(name, newObject) {
			if(!(newObject instanceof RESTfulDefinition) && typeof newObject !== 'function') {
				throw new Error('Only RESTfulDefinition or ATTMethod can be added with this method');
			}
			
			var objPath = name.split('.'),
				objName = objPath.pop(),
				target = this;
			
			objPath.forEach(function(pathObjName) {
				if(!target[pathObjName]) target[pathObjName] = new RESTfulDefinition();
				target = target[pathObjName];
			});
			
			forEach(newObject.methods, function(methodConfig, methodName) {
				newObject.addMethod(methodName, methodConfig.executor, methodConfig);
			});
			delete newObject.methods;
			
			target[objName] = newObject;
			newObject.parent = this;
		},
		addMethod: function(methodName, newMethod, props) {
			if(arguments.length < 3 && typeof newMethod === 'object') {
				var tmpMethod = props; //Ensure we use the correct undefined
				props = newMethod;
				newMethod = tmpMethod;
			}
			
			function ATTMethod(params, successCB, failCB) {
				if(arguments.length < 3) {
					failCB = successCB;
					successCB = params;
					params = {};
				}
				
				return ATTMethod.parent.executor(ATTMethod, params, successCB, failCB);
			}
			copyObjTo(ATTMethod, props, RESTfulDefinition.prototype, RESTfulDefinition.defaultMethodParams);
			ATTMethod.executor = newMethod;
			ATTMethod.methodName = methodName && methodName.match(/\.?([^.]*)$/)[1];
			
			this.addDefinition(methodName, ATTMethod); //This method adds the parent reference
		},
		forEachToRoot: function(func, scope) {
			var currentNode = this, depth = 0, myScope = scope || this;
			do {
				func.call(myScope, currentNode, depth++);
				currentNode = currentNode.parent;
			} while(currentNode);
		},
		getUrl: function(params) {
			var url = (this.parent ? this.parent.getUrl() : '') + (this.appendUrl || '');
			
			if(params) {
				var regex = this.getUrl.paramsRegex
				,	urlParams = buildParams(this.inferUrlParamsConfig(), params[constants.paramKey.URL_PARAMS], params);
				
				url = url.replace(regex, function(p, $1, $2, $3, i, w) {
					var urlParam = urlParams[$2];
					return ($3 && !urlParam) ? '' : $1 + urlParam;
				});
			}
			
			return url;
		},
		getHeaders: function(params) {
			return buildParams(this.getHeaderConfig(), params[constants.paramKey.HEADERS], params);
		},
		getQueryString: function(params) {
			return qs.buildFromConfig(this.getQueryStringConfig(), params[constants.paramKey.QUERY], params);
		},
		getRoot: function() {
			var root;
			this.forEachToRoot(function(currentNode) {
				root = currentNode;
			});
			return root;
		},
		executor: function() { //Default executor
			if(this.parent) return this.parent.executor.apply(this.parent, arguments);
		},
		inferUrlParamsConfig: function() {
			var regex = this.getUrl.paramsRegex;
			
			//Infers a urlParamConfig based on the url string
			var inferredUrlParamConfig = {};
			this.getUrl().replace(regex, function(p, $1, $2, $3, i, w) {
				inferredUrlParamConfig[$2] = !$3;
				return '';
			});
			
			return copyObjTo(inferredUrlParamConfig, this.getUrlParamsConfig());
		}
	});
	
	['headerConfig', 'queryStringConfig', 'urlParamsConfig'].forEach(function(configType) {
		var getMethodName = 'get' + configType[0].toUpperCase() + configType.substr(1);
		RESTfulDefinition.prototype[getMethodName] = function() {
			if(!this.parent) return this[configType];
			return copyObjTo({}, this.parent[getMethodName].apply(this.parent, arguments), this[configType]);
		};
	});
	
	//Expects the following format: '/path/:param1/:param2/:param3?'
	RESTfulDefinition.prototype.getUrl.paramsRegex = /(\/):([^\/?]*)(\?$)?/g;
	
	RESTfulDefinition.defaultMethodParams = {};
	
	module.exports = RESTfulDefinition;
});


define('att/main',['require','exports','module','att/ajax','att/util','att/constants','att/RESTfulDefinition'],function(require, exports, module) {
	var ajax = require('att/ajax')
	,   util = require('att/util')
	,   copyObjTo = util.copyObjTo
	,   forEach = util.forEach
	,   QS = util.qs
	,   constants = require('att/constants')
	,	RESTfulDefinition = require('att/RESTfulDefinition');
	
	/**
	 * @class ATT (at the root only)
	 * @method getProtocol {function() : String} - getter for protocol
	 * @method setProtocol {function(newProtocol)} - setter for protocol. Updates appendUrl
	 * @method getDomain {function() : String} - getter for domain
	 * @method setDomain {function(newDomain)} - setter for domain. Updates appendUrl
	 * 
	 * @class ATTMethod
	 * @method executor {function(formattedParams, params, successCB, failCB): Object} expected to be called by the root
	 * 		executor with formatted parameters, original parameters and callbacks.  Modify and return formattedParams
	 * 		to send to the formattedParams to the Ajax Layer.
	 */
	
	/*
	 * TODO Create a single callback. In wrapper, check if error parameter is set and reroute 
	 * to error callback in wrappers
	 */
	
	function formatError(err) {
		return {
			type: err.constructor.name,
			message: err.message,
			source: err
		};
	}
	
	function sendError(err, errorCB) {
		var errObj = { error: formatError(err) };
		errorCB(errObj);
		return errObj;
	}
	
	/*
	function sendSuccess(data, successCB) {
		var successObj = {
			data: data
		};
		successCB.call(this, successObj);
		return successObj;
	}
	*/
	
	function isValidBody(attachment, isAttachment) {
		var body = attachment[constants.attachmentKeys.BODY]
		,	fName = attachment[constants.attachmentKeys.FILE_PATH];
		
		if(body && fName) {
			var errString = 'Both "' + constants.attachmentKeys.BODY + '" and "' + 
					constants.attachmentKeys.FILE_PATH + '" cannot both be defined '+
					isAttachment ? 'in an attachment' : 'in the parameters';
			
			throw new Error(errString);
		} else if(isAttachment && !body && !fName) {
			throw new Error('Either "' + constants.attachmentKeys.BODY + '" or "' + 
					constants.attachmentKeys.FILE_PATH + '" must be defined in all attachments');
		}
	}
	
	function baseExecutor(attMethod, params, successCB, failCB) {
		
		var req = {}, attRoot = this.getRoot(); //Note: This should be true: attRoot === this
		
		function handleResponse(cb) {
			return function() {
				if(cb) cb.apply(this, arguments);
				delete req.active;
			};
		}
		
		function handleError(e) {
			req.error = formatError(e);
			failCB(req.error);
		}
		
		//get access token, setup headers from params, get url
		var buildRequest = function(tokenInfo) {
			
			var headers, qs, url;
			try {
				var queryString = params[constants.paramKey.QUERY];
				
				headers = attMethod.getHeaders(params);
				qs = (typeof queryString === 'string') ? queryString : attMethod.getQueryString(params);
				url = attMethod.getUrl(params);
				
				var attachments = params[constants.paramKey.ATTACHMENTS];
				attachments && attachments.forEach(function(att) {
					isValidBody(att, true);
				});
				
				isValidBody(params);
			} catch(e) {
				//headerConfig', 'queryStringConfig', 'urlParamsConfig
				e.message += '. Check inputted ' + 
							 (headers === undefined) ? 'header ' :
							 (qs === undefined) ? 'query string ' :
							 (url === undefined) ? 'url parameters ' : ''
						  +  'values for method "' + attMethod.methodName + '"';
				
				handleError(e);
				return;
			}
			
			if(tokenInfo) headers.Authorization = 'Bearer ' + tokenInfo.data.token;
			else if(!attMethod.tokenType === ATT.TokenType.NONE) {
				handleError(new Error('Missing access token for this request, fetch a new one'));
				return;
			}
			
			var formattedParams = copyObjTo({method: attMethod.method, url: url}, params);
			if(qs) formattedParams.query = qs;
			formattedParams.headers = headers;
			
			//allow modules to modify the ajax config
			var returnValue = attMethod.executor ? 
					attMethod.executor(formattedParams, params, successCB, failCB) :
					formattedParams;
			
			if(returnValue === formattedParams) { //then send the request
				formattedParams.methodName = attMethod.methodName;
				formattedParams.useBridge = attMethod.useBridge; //Temporary
				
				req.active = ajax(
					formattedParams,
					handleResponse(formattedParams.success || successCB),
					handleResponse(formattedParams.fail || failCB)
				);
				
			} else {
				if(returnValue instanceof Error) {
					handleError(returnValue);
					return;
				}
				
				//If a the return value is an object, copy keys to the request object
				if(returnValue && returnValue.constructor.toString() === '[object Object]') {
					copyObjTo(req, returnValue);
				} else {
					//Otherwise, make the returnValue accessable through data of the req obj
					req.data = returnValue;
				}
				
				successCB({data: returnValue});
			}
		};
		
		switch(attMethod.tokenType) {
		case ATT.TokenType.NONE:
			buildRequest();
			break;
		case ATT.TokenType.USER:
			attRoot.userAuthToken.fetch(
				handleResponse(buildRequest), 
				handleResponse(failCB)
			);
			break;
		case ATT.TokenType.ACCESS:
		default:
			attRoot.accessToken.fetch(
				handleResponse(buildRequest), 
				handleResponse(failCB)
			);
		}
			
		return req;
	}
	
	var ATT = module.exports = new RESTfulDefinition({
		executor: baseExecutor
	});
	
	(function() {
		var protocol, domain;
		function createAppendUrl() {
			return (protocol || '') + (domain || '');
		}
		
		ATT.setProtocol = function(newProtocol) {
			protocol = newProtocol;
			ATT.appendUrl = createAppendUrl();
		};
		ATT.getProtocol = function() {
			return protocol;
		};
		
		ATT.setDomain = function(newDomain) {
			domain = newDomain;
			ATT.appendUrl = createAppendUrl();
		};
		ATT.getDomain = function() {
			return domain;
		};
	})();
	
	//NOTE: When changing protocol or domain, make sure to change the PROTOCOL and DOMAIN
	//		in AttRequest.java to ensure bridge functions work properly.
	ATT.setProtocol('https://');
	ATT.setDomain('api.att.com'); //DEBUG: 'api-uat.pacer.bf.sl.attcompute.com'
	
	
	//Access token definitions and fetching wrappers
	
	ATT.TokenType = {
		NONE: 'noToken',
		ACCESS: 'accessToken',
		USER: 'userAuthToken'
	};
	
	RESTfulDefinition.defaultMethodParams.tokenType = ATT.TokenType.ACCESS;
	
	var appKey, secret, accessScopeStr, authScopeStr, oAuthCode
	,	possibleAuthScope = { IMMN: true, MIM: true, TL: true };
	
	
	ATT.addDefinition('OAuth', new RESTfulDefinition({
		appendUrl: '/oauth',
		methods: {
			'getAccessToken': {
				appendUrl: '/access_token',
				method: 'POST',
				tokenType: ATT.TokenType.NONE,
				headerConfig: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Accept': 'application/json'
				},
				executor: function(formattedParams, params, successCB, failCB) {
					var body = formattedParams.body;
					if(typeof body === 'string') body = QS.parse(body);
					
					if((!appKey && !body.client_id) || (!secret && !body.client_secret)) {
						var error = new Error('App Key or Secret are undefined. Set the keys recieved from developer.att.com');
						return sendError(error, failCB);
					}
					
					body.client_id = appKey;
					body.client_secret = secret;
					
					formattedParams.body = QS.stringify(body);
					return formattedParams;
				}
			},
			'obtainEndUserAuthorization': {
				method: 'GET',
				appendUrl: '/authorize',
				tokenType: ATT.TokenType.NONE,
				queryStringConfig: {
					'client_id'    : { required: true, backup: function() { return appKey; } },
					'scope'        : { required: true, backup: function() { return authScopeStr; } },
					'redirect_uri' : false
				},
				executor: function(formattedParams, params, successCB, failCB) {
					return {
						uri: (formattedParams.url + '?' + formattedParams.query)
					};
				}
			}
		}
	}));
	
	//Wrappers used to make getAccessToken and getUserAuthorization more convenient
	function TokenObject(props) {
		copyObjTo(this, props);
	}
	tokenObjProto = TokenObject.prototype;
	
	copyObjTo(tokenObjProto, {
		fetch: function(data, success, fail) {
			if(arguments.length === 2) {
				var tmpData = fail; //Should be undefined
				fail = success;
				success = data;
				data = tmpData;
			}
			
			var accessParams = {}, self = this;
			
			if(this.isExpired()) {
				//Set up for a refresh if the token has expired
				if(true) util.log('Refreshing the token in memory');
				
				accessParams.grant_type = 'refresh_token';
				accessParams.refresh_token = this.refreshToken;
			} else if(this.token) {
				//Return the token if we have one cached
				if(true) util.log('Used token from memory: ' + this.token);
				var tokenInfo = {
					data: this.getCache()
				};
				
				success.call(this, tokenInfo);
				return tokenInfo;
			} else {
				//Uniquely format the accessParams for this accessToken fetch
				if(true) util.log('Fetching a new token');
				try {
					this.formatParameters(accessParams, data);
				} catch(e) {
					return sendError(e, fail);
				}
			}
			
			var reqState = {
				appKey: appKey,
				accessTokenScope: accessScopeStr,
				userAuthScope: authScopeStr
			};
			
			var mySuccess = function(resp, ajax) {
				delete self.fetching;
				
				if(resp.data.error) {
					failCB.call(this, {error: {
						type: 'AuthorizationError',
						message: resp.data.error
					}});
					return;
				}
				
				var formattedResp = self.formatResponse(reqState, resp.data);
				self.save(formattedResp);
				
				if(success) success.call(self, { data: self.getCache() }, ajax);
			};
			
			var myFail = function(error, ajax) {
				delete self.fetching;
				if(fail) fail.apply(self, arguments);
			};
			
			var currentResp = ATT.OAuth.getAccessToken({body: accessParams}, mySuccess, myFail);
			
			//Set the "fetching" parameter to the AttXHR so that other requests can queue up
			//for the return of a new access token.
			if(currentResp.active) this.fetching = currentResp.active;
			
			return currentResp;
		},
		refresh: function(success, fail) {
			if(!this.refreshToken) {
				return sendError(new Error('Fetch a token before you can refresh it'), fail);
			}
			this.expiration = Date.now() - 10; //Expire the token to force a refresh
			return this.fetch(success, fail);
		},
		formatResponse: function(reqState, tokenResp) {
			//alert('tokenResp = ' + JSON.stringify(tokenResp, null, 3));
			
			var expiresIn = parseInt(tokenResp.expires_in);
			return {
				t: tokenResp.access_token, 						//token
				r: tokenResp.refresh_token, 					//refresh
				e: expiresIn && Date.now() + (1000 * expiresIn),//expiration
				k: reqState.appKey								//The app key associated with token
			};
		},
		keys: ['token', 'refreshToken', 'expiration', 'key', 'scope'],
		clearCache: function() {
			this.keys.forEach(function(key) {
				delete this[key];
			}, this);
		},
		getCache: function() {
			var tokenInfo = {};
			this.keys.forEach(function(key) {
				tokenInfo[key] = this[key];
			}, this);
			return tokenInfo;
		},
		cache: function(tokenData) {
			if(!tokenData.s || !tokenData.k) return;
			
			this.token = tokenData.t;
			this.refreshToken = tokenData.r;
			this.expiration = tokenData.e;
			this.key = tokenData.k;
			this.scope = tokenData.s;
		},
		isExpired: function() {
			return this.refreshToken && this.expiration !== 0 && this.expiration < Date.now();
		},
		//Delete the persisted token
		remove: function() {
			this.clearCache(); //If there is no persistence, just clear memory
		},
		//Persist the token
		save: function(tokenData) {
			this.cache(tokenData); //If there is no persistence, just cache in memory
		},   
		//load the persisted token into memory
		load: function() {
			
		}
	});
	
	function AccessToken(props) {
		copyObjTo(this, props);
	}
	
	//Extend TokenObject
	util.inherits(AccessToken, TokenObject, {
		formatParameters: function(accessParams, data) {
			if(!accessScopeStr) {
				throw new Error('Missing scope');
			}
			
			accessParams.scope = accessScopeStr;
			accessParams.grant_type = 'client_credentials';
		},
		formatResponse: function(reqState, tokenResp) {
			var formattedData = tokenObjProto.formatResponse.apply(this, arguments);
			formattedData.s = reqState.accessTokenScope;
			
			return formattedData;
		},
		cache: function(tokenData) {
			if(!accessScopeStr || tokenData.s === accessScopeStr) tokenObjProto.cache.apply(this, arguments);
		}
	});
	
	ATT.accessToken = new AccessToken();
	
	function UserAuthToken(props) {
		copyObjTo(this, props);
	}
	//Extend TokenObject
	util.inherits(UserAuthToken, TokenObject, {
		formatParameters: function(accessParams, localOAuthToken) {
			accessParams.code = (typeof localOAuthToken === 'string' && localOAuthToken) || oAuthCode;
			
			if(!accessParams.code) {
				var errMsg = 'oAuthCode is ' +
						((oAuthCode === null) ? 'no longer valid' : 'undefined');
				
				throw new Error(errMsg);
			}
			
			accessParams.grant_type = 'authorization_code';
		},
		formatResponse: function(reqState, tokenResp) {
			var formattedData = tokenObjProto.formatResponse.apply(this, arguments);
			formattedData.s = reqState.userAuthScope;
			return formattedData;
		},
		cache: function(tokenData) {
			if(!authScopeStr || tokenData.s === authScopeStr) tokenObjProto.cache.apply(this, arguments);
		}
	});
	ATT.userAuthToken = new UserAuthToken();
	
	function separateScope(newScope) {
		var accessScope = {}
		,	authScope = {};
		
		newScope.split(',').forEach(function(scopeVal) {
			if(possibleAuthScope[scopeVal]) {
				authScope[scopeVal] = true;
			} else {
				accessScope[scopeVal] = true;
			}
		});
		
		return {
			accessTokenScope: Object.keys(accessScope).sort().join(','),
			userAuthTokenScope: Object.keys(authScope).sort().join(',')
		};
	}
	
	ATT.setKeys = function(newAppKey, newSecret, newScope) {
		var newScopes = separateScope(newScope)
		,	newAccessScope = (newScopes.accessTokenScope && ATT.accessToken.scope !== newScopes.accessTokenScope)
		,	newAuthScope = (newScopes.userAuthTokenScope && ATT.userAuthToken.scope !== newScopes.userAuthTokenScope);
		
		if(appKey === newAppKey && secret === newSecret && !newAccessScope && !newAuthScope) {
			return; //Nothing changed so do nothing
		}
		
		if(ATT.accessToken.key !== newAppKey || newAccessScope) {
			ATT.accessToken.clearCache();
		}
		if(ATT.userAuthToken.key !== newAppKey || newAuthScope) {
			ATT.userAuthToken.clearCache();
		}
		
		appKey = newAppKey;
		secret = newSecret;
		if(newAccessScope) {
			accessScopeStr = newScopes.accessTokenScope;
		}
		if(newAuthScope) {
			authScopeStr = newScopes.userAuthTokenScope;
		}
	};
	
	ATT.setOAuthCode = function(newCode) {
		ATT.userAuthToken.clearCache();
		oAuthCode = newCode;
	};

	if(true) {
		ATT.addDefinition('SMS', new RESTfulDefinition({
			appendUrl: '/sms/v3/messaging',
			headerConfig: { 
				'Accept': false,
				'X-Arg': {
					postProcess: processXArgs
					}
				},
			methods: {
				'sendSMS': {
					appendUrl: '/outbox',
					method: 'POST',
					headerConfig: { 'Content-Type': true }
				},
				'getSMSDeliveryStatus': {
					appendUrl: '/outbox/:smsId',
					method: 'GET'
				},
				'getSMS': {
					appendUrl: '/inbox/:registrationId',
					method: 'GET'
				}
			}
		}));
	}
	
	if(true) {
		ATT.addDefinition('MMS', new RESTfulDefinition({
			appendUrl: '/mms/v3/messaging/outbox',
			headerConfig: { 
				'Accept': false,
				'X-Arg': {
					postProcess: processXArgs
					}
				 },
			methods: {
				'sendMMS': {
					method: 'POST',
					headerConfig: { 'Content-Type': true },
					useBridge: true
				},
				'getMMSDeliveryStatus': {
					method: 'GET',
					appendUrl: '/:mmsId'
				}
			}
		}));
	}
	
	
	if(false) {
		(function() {
			var paymentQSConfig = {
				'Signature'           : true,
				'SignedPaymentDetail' : true,
				'clientid'			  : { backup: function() { return appKey; }, required: true }
			};
			
			function newInteraction(formattedParams, params, successCB, failCB) {
				return formattedParams.url + '?' + formattedParams.query;
			}
			
			ATT.addDefinition('Payment', new RESTfulDefinition({
				appendUrl: '/rest/3/Commerce/Payment',
				methods: {
					'newSubscription': {
						appendUrl: '/Subscriptions',
						method: 'GET',
						tokenType: ATT.TokenType.NONE,
						executor: newInteraction,
						queryStringConfig: paymentQSConfig
					},
					'getSubscriptionStatus': {
						appendUrl: '/Subscriptions/:idType/:id',
						method: 'GET',
						headerConfig: { 'Accept': false }
					},
					'getSubscriptionDetails': {
						appendUrl: '/Subscriptions/:merchantSubscriptionId/Detail/:consumerId',
						method: 'GET',
						headerConfig: { 'Accept': false }
					},
					'newTransaction': {
						appendUrl: '/Transactions',
						method: 'GET',
						tokenType: ATT.TokenType.NONE,
						executor: newInteraction,
						queryStringConfig: paymentQSConfig
					},
					'getTransactionStatus': {
						method: 'GET',
						headerConfig: { 'Accept': false },
						appendUrl: '/Transactions/:idType/:id'
					},
					'refundTransaction': {
						appendUrl: '/Transactions/:transactionId',
						method: 'PUT',
						headerConfig: {
							'Content-Type': true,
							'Accept': false
						},
						queryStringConfig: {
							'Action': true
						}
					},
					'getNotification': {
						appendUrl: '/Notifications/:notificationId',
						method: 'GET',
						headerConfig: { 'Accept': false }
					},
					'acknowledgeNotification': {
						appendUrl: '/Notifications/:notificationId',
						method: 'PUT',
						headerConfig: { 'Accept': false }
					}
				}
			}));
		})();
	}
	
	// IMMN - This is IMMNv1
	if(true) {
		ATT.addDefinition('IMMN', new RESTfulDefinition({
			appendUrl: '/rest/1/MyMessages',
			headerConfig: { 'Accept': false },
			methods: {
				'sendMessage': {
					method: 'POST',
					headerConfig: {
						'Content-Type': true
					},
					tokenType: ATT.TokenType.USER,
					useBridge: true
				},
				'getMessageHeaders': {
					method: 'GET',
					tokenType: ATT.TokenType.USER,
					queryStringConfig: {
						HeaderCount: true,
						IndexCursor: false
					}
				},
				'getMessageContent': {
					method: 'GET',
					tokenType: ATT.TokenType.USER,
					appendUrl: '/:messageId/:partNumber?'
				}
			}
		}));
	}
	
	if(has('IAM')) {
		ATT.addDefinition('InAppMessaging', new RESTfulDefinition({
			appendUrl: '/myMessages/v2/',
			headerConfig: { 
				'Accept': false,
				'X-Arg': {
					postProcess: processXArgs
					}
				 },
			methods: {
				'sendMessage': {
					method: 'POST',
					appendUrl:'messages',
					tokenType: ATT.TokenType.USER,
					headerConfig: {
						'Content-Type': true,
						'Content-Length': false
					},
					useBridge: true 
				},
				'getMessageList': {
					method: 'GET',
					appendUrl:'messages',
					tokenType: ATT.TokenType.USER,
					queryStringConfig: {
						messageIds: false,
						isFavorite: false,
						limit: {
							backup : '500',
							required : true
						},
						offset: {
							backup: '0',
							required: true
						},
						isUnread: false,
						type: {
							backup: 'SMS,MMS'
						},
						isIncoming: false
					}
				},
				'getMessage': {
					method: 'GET',
					appendUrl:'messages/:messageId',
					tokenType: ATT.TokenType.USER,

				},
				'getMessageContent': {
					method: 'GET',
					appendUrl:'messages/:messageId/parts/:partId',
					tokenType: ATT.TokenType.USER,
				},
				'getMessagesDelta': {
					method: 'GET',
					appendUrl:'delta',
					tokenType: ATT.TokenType.USER,
					queryStringConfig: {
						state: true
					},
				},
				'updateMessages': {
					method: 'PUT',
					appendUrl:'messages',
					tokenType: ATT.TokenType.USER,
					headerConfig: {
						'Content-Type': true,
						'Content-Length': { 
							backup: function(params) {
								return params.body.length;
							},
						},

					}
				},
				'updateMessage': {
					method: 'PUT',
					appendUrl:'messages/:messageId',
					tokenType: ATT.TokenType.USER,
					headerConfig: {
						'Content-Type': true,
						'Content-Length': { 
							backup: function(params) {
								return params.body.length;
							}
						}
					}
				},
				'deleteMessages': {
					method: 'DELETE',
					appendUrl:'messages',
					tokenType: ATT.TokenType.USER,
					queryStringConfig: {
						messageIds: true
					}
				},
				'deleteMessage': {
					method: 'DELETE',
					appendUrl:'messages/:messageId',
					tokenType: ATT.TokenType.USER,
				},
				'createMessageIndex': {
					method: 'POST',
					appendUrl:'messages/index',
					tokenType: ATT.TokenType.USER
				},
				'getMessageIndexInfo': {
					method: 'GET',
					appendUrl:'messages/index/info',
					tokenType: ATT.TokenType.USER
				},
				'getNotificationConnectionDetails': {
					method: 'GET',
					appendUrl:'notificationConnectionDetails',
					tokenType: ATT.TokenType.USER,
					queryStringConfig: {
						queues: true
					}
				},
			}
		}));
	}
	
	if(false) {
		ATT.addDefinition('CMS', new RESTfulDefinition({
			appendUrl: '/rest/1/Sessions',
			headerConfig: {
				'Content-Type': true,
				'Accept': false
			},
			methods: {
				'createSession': {
					method: 'POST'
				},
				'sendSignal': {
					method: 'POST',
					appendUrl: '/:cmsId/Signals'
				}
			}
		}));
	}
	
	if(true) {
		ATT.addDefinition('Ads', new RESTfulDefinition({
			appendUrl: '/rest/1/ads',
			methods: {
				'getAds': {
					method: 'GET',
					headerConfig: {
						'Accept': false,
						'Udid': true,
						'X-Arg': {
							postProcess: processXArgs
						}
					},
					queryStringConfig: {
						Category: true,
						Gender: false,
						ZipCode: false,
						AreaCode: false,
						City: false,
						Country: false,
						Longitude: false,
						Latitude: false,
						MaxHeight: false,
						MaxWidth: false,
						MinHeight: false,
						MinWidth: false,
						Type: false,
						Timeout: false,
						AgeGroup: false,
						Over18: false,
						KeyWords: false,
						IsSizeRequired: false,
						Premium: false
					}
				}
			}
		}));
	}
	
	if(false) {
		ATT.addDefinition('WAPPush', new RESTfulDefinition({
			appendUrl: '/1/messages/outbox/wapPush',
			methods: {
				'sendWAPPush': {
					method: 'POST',
					headerConfig: {
						'Content-Type': true,
						'Accept': false,
						'X-Arg': {
							postProcess: processXArgs
						}
					},
					useBridge: true
				}
			}
		}));
	}
	
	if(false) {
		ATT.addDefinition('Location', new RESTfulDefinition({
			appendUrl: '/2/devices/location',
			methods: {
				'getDeviceLocation': {
					method: 'GET',
					tokenType: ATT.TokenType.USER,
					headerConfig: {
						'Accept': false,
						'X-Arg': {
							postProcess: processXArgs
						}
					},
					queryStringConfig: {
						'requestedAccuracy'  : false,
						'Tolerance'			 : false,
						'acceptableAccuracy' : false
					}
				}
			}
		}));
	}
	
	function processXArgs(val, params) {
		

		if(true) {

			var clientsdk = "att."+device.platform + "phonegap.3.1";
		
		}
		
		if(false) {

			var clientsdk = "att."+ Titanium.Platform.osname + ".titanium.3.2";
		
		}

		 var xargVal=(typeof val === 'string') ? val : QS.stringify(val, ',');
         
         if(xargVal.indexOf("ClientSdk")!= -1)
         	{
            	var clientsdkReg="$1" + clientsdk;
            	xargVal =xargVal.replace(/(ClientSdk=)[^,]*/, clientsdkReg);
         	}
         else
         	{
            	if(xargVal.length>0)
            	{
                	var newxargVal= ",ClientSdk=" + clientsdk;
                	xargVal=xargVal+newxargVal;
            	}
            	else
            	{
                	xargVal="ClientSdk=" + clientsdk;
            	}
         	} 
       
         return xargVal;
	}
	
	if(true || true || false) {
		ATT.addDefinition('Speech', new RESTfulDefinition({
			appendUrl: '/speech/v3/'
		}));
	}
	
	if(true) {
		ATT.Speech.addMethod('speechToText', null, {
			appendUrl: 'speechToText',
			method: 'POST',
			headerConfig: {
				'Accept': false,
				'Content-Type': true,
				'Transfer-Encoding': false,
				'X-SpeechContext': false,
				'X-SpeechSubContext': false,
				'Content-Language': false,
				'Content-Length': false,
				'X-Arg': {
					postProcess: processXArgs
				}
			},
			useBridge: true
		});
		
		/*
		ATT.addDefinition('Speech', new RESTfulDefinition({
			appendUrl: '/speech/v3/speechToText',
			methods: {
				'speechToText': {
					method: 'POST',
					headerConfig: {
						'Accept': false,
						'Content-Type': true,
						'Transfer-Encoding': false,
						'X-SpeechContext': false,
						'X-SpeechSubContext': false,
						'Content-Language': false,
						'Content-Length': false,
						'X-Arg': {
							postProcess: processXArgs
						}
					},
					useBridge: true
				}
			}
		}));
		*/
	}
	
	if(true) {
		ATT.Speech.addMethod('textToSpeech', null, {
			appendUrl: 'textToSpeech',
			method: 'POST',
			headerConfig: {
				'Accept': false,
				'Content-Type': true,
				'Content-Language': false,
				'Content-Length': { 
					backup: function(params) {
						return params.body.length;
					}
				},
				'X-Arg': {
					postProcess: processXArgs
				}
			},
			useBridge: true
		});
		
		/*
		ATT.addDefinition('TTS', new RESTfulDefinition({
			appendUrl: '/speech/v3/textToSpeech',
			methods: {
				'textToSpeech': {
					method: 'POST',
					headerConfig: {
						'Accept': false,
						'Content-Type': true,
						'Content-Language': false,
						'Content-Length': { 
							backup: function(params) {
								return params.body.length;
							}
						},
						'X-Arg': {
							postProcess: processXArgs
						}
					},
					useBridge: true
				}
			}
		}));
		*/
	}
	
	if(false) {
		ATT.Speech.addMethod('speechToTextCustom', null, {
			appendUrl: 'speechToTextCustom',
			method: 'POST',
			headerConfig: {
				'Accept': false,
				'Content-Type': 'multipart/x-srgs-audio',
				'Transfer-Encoding': false,
				'X-SpeechContext': false,
				'Content-Language': false,
				'Content-Length': false,
				'X-Arg': {
					postProcess: processXArgs
				}
			},
			useBridge: true
		});
	}
	
	ATT.addDefinition('Notary', new RESTfulDefinition({
		appendUrl: '/Security/Notary/Rest/1/SignedPayload',
		methods: {
			'signedPayload': {
				method: 'POST',
				headerConfig: {
					'Accept': false,
					'Content-Type': true,
					'Client_id': true, 
					'Client_secret': true,
					'X-Arg': {
					postProcess: processXArgs
						}
				},
				//TODO: Verify that this logic is correct...
				executor: function(formattedParams, params) {
					var token = ATT.accessToken.token;
					
					if(token && params.headers['Content-Type'] === constants.header.contentType.JSON
							&& util.getFromObject(params, 'body.MerchantPaymentRedirectUrl'))
					{
						params.body.MerchantPaymentRedirectUrl += "?token=" + token;
					}
					
					return formattedParams;
				}
			}
		}
	}));
	
	return ATT;
});



define('extensions/phonegap',['att/ajax', 'att/main'], function(ajax, ATT) {
	
	var attCordovaProviderName = 'AttPlugin'
	//TODO Remove unformatIOSParams as soon as the iOS bridge can handle 2.0 raw interface
	,	unformatAttachments = function(attachments) {
			if(!attachments || !attachments.length) return [{}];
			
			return attachments.map(function(attachment) {
				return {
					fileObject : attachment.body || undefined,
					filePath   : attachment.filePath || undefined,
					fileType   : attachment.mimeType || undefined,
					fileName   : attachment.name || undefined
				};
			});
		}
	,	convertMessageParams = function(params) {
			return {
				url 		: params.url,
				accessToken : params.headers.Authorization,
				accept 		: params.headers.Accept || '',
				contentType : params.headers['Content-Type'],
				body 		: params.body || '',
				attachments : unformatAttachments(params.attachments)
			};
		}
	,	unformatIOSParams = {
			'sendMMS'		: convertMessageParams,
			'sendMessage'	: convertMessageParams,
			'speechToText'  : function(params) {
				return {
					url 			: params.url,
					token 			: params.headers.Authorization,
					accept			: params.headers.Accept || '',
					contentType		: params.headers['Content-Type'],
					contentLanguage	: params.headers['Content-Language'] || '',
					contentLength	: params.headers['Content-Length'] || '',
					XSpeechContext	: params.headers['X-SpeechContext'] || 'Generic',
					transferEncoding: params.headers['Transfer-Encoding'] || '',
					xarg 			: params.headers['X-Arg'] || '',
					filePath 		: params.filePath
				};
			},
			'textToSpeech'  : function(params) {
				return {
					url 		: params.url,
					token 		: params.headers.Authorization,
					accept		: params.headers.Accept || '',
					contentType	: params.headers['Content-Type'],
					xarg 		: params.headers['X-Arg'] || '',
					body		: params.body,
					data		: '', //TODO What is data used for?
					filePath 	: params.responseFilePath
				};
			}
		};
	

	ajax.settings.isBridgeFunction = function(params) {
		//return (params.filePath || params.responseFilePath || params.attachments) ? true : false;
		return params.useBridge;
	};
	ajax.settings.bridgeFunction = function bridgeFunction(params, successCB, failCB) {
		var methodName = params.methodName;
		
		//TODO: Remove this once the iOS plugin can handle the raw interface
		if(device.platform.match(/iOS/)) {
			params = unformatIOSParams[methodName](params);
		}
		
		var mySuccess = function(resp) {
			successCB({ data: (resp.success || resp) });
		};
		
		//TODO in the future: Intercept successCB and format the response;
		
		Cordova.exec(mySuccess, failCB, attCordovaProviderName, methodName, [params]);
	};
	
	['accessToken', 'userAuthToken'].forEach(function(tokenName) {
		var tokenObj = ATT[tokenName]
		,	key = 'att.token.' + tokenName //Use a single key because these objects are singletons
		,	MyTokenObjectProto = tokenObj.constructor.prototype
		,	prevRemove = tokenObj.remove
		,	prevSave = tokenObj.save;
		
		MyTokenObjectProto.remove = function() {
			prevRemove.apply(this, arguments);
			localStorage.removeItem(key);
		};
		
		MyTokenObjectProto.save = function(tokenData) {
			localStorage.setItem(key, JSON.stringify(tokenData));
			prevSave.apply(this, arguments);
		};
		
		MyTokenObjectProto.load = function() {
			var tokenDataString = localStorage.getItem(key);
			if(!tokenDataString) return;
			if(true) console.log('Loading token from storage: ' + tokenDataString);
			
			this.cache(JSON.parse(tokenDataString));
		};
		
		tokenObj.load();
	});
	
	return ATT;
});


define('wrappers/wrapper-1.0',['att/main', 'att/constants', 'att/util'], function(attBase, constants, util) {
	var ATT = {};
	
	function getCommonHeaders(params, withContentType) {
		var headers = {};
		if(!params) return headers;
		
		if(withContentType) headers['Content-Type'] = params.contentType;
		headers.Accept = params.accept;
		
		return headers;
	}
	
	function convertAttachment(oldAttachment) {
		var fileName = oldAttachment.fileName || undefined;
		if(!fileName && oldAttachment.filePath) {
			fileName = oldAttachment.filePath.match(/.*\/(.*)/)[1];
		}
		
		return {
			body: oldAttachment.fileObject || undefined,
			filePath: oldAttachment.filePath || undefined,
			fileName: fileName,
			mimeType: oldAttachment.fileType || undefined,
			name: fileName,
			encoding: oldAttachment.fileObject ? 'base64' : undefined
		};
	}
	
	function convertAttachments(oldAttachments) {
		if(!oldAttachments) return;
		return oldAttachments.map(convertAttachment);
	}
	
	ATT.authorize = function(accessKeyId, secretKey, scope, grantType, oAuthCode) {
		attBase.setKeys(accessKeyId, secretKey, scope);
		if(oAuthCode) attBase.setOAuthCode(oAuthCode);
	};
	
	ATT.setAccessToken = function(token, refreshToken, expiration) {
		attBase.accessToken.token = token;
		attBase.accessToken.refresh = refreshToken;
		attBase.accessToken.expiration = expiration;
	};
	
	if(true) {
		ATT.accessToken = attBase.accessToken;
		ATT.userAuthToken = attBase.userAuthToken;
	}
	
	ATT.getCachedAccessToken = function() { return attBase.accessToken.token; };
	ATT.getCachedUserAuthToken = function() { return attBase.userAuthToken.token; };
	
	if(true) {
		ATT.SMS = {
			'sendSMS': function(params, success, fail) {
				attBase.SMS.sendSMS({
					headers: getCommonHeaders(params, true),
					body: (params.contentType.toLowerCase() === 'application/json' && typeof params.body === 'object') ?
								JSON.stringify({outboundSMSRequest: params.body}) :
								params.body
				}, success, fail);
			},
			'getSMSDeliveryStatus': function(params, success, fail) {
				attBase.SMS.getSMSDeliveryStatus({
					headers: getCommonHeaders(params),
					urlParams: {
						smsId: params.smsId
					}
				}, success, fail);
			},
			'getSMS': function(params, success, fail) {
				attBase.SMS.getSMS({
					headers: getCommonHeaders(params),
					urlParams: {
						registrationId: params.registrationId
					}
				}, success, fail);
			}
		};
	}
	
	if(true) {
		ATT.MMS = {
			'sendMMS': function(params, success, fail) {
				var body = (params.contentType === constants.header.contentType.JSON)
						?	'{"outboundMessageRequest":' + ((typeof params.body === 'object') 
							?	JSON.stringify(params.body) : params.body) + '}'
						:	params.body;
				
				attBase.MMS.sendMMS({
					headers: getCommonHeaders(params, true),
					body: body,
					attachments: convertAttachments(params.attachments)
				}, success, fail);
			},
			'getMMSDeliveryStatus': function(params, success, fail) {
				attBase.MMS.getMMSDeliveryStatus({
					headers: getCommonHeaders(params),
					urlParams: {
						mmsId: params.id
					}
				}, success, fail);	
			}
		};
	}
	
	
	if(false) {
		(function() {
			var qsKeyMap = {
				'Signature'           : 'signature' ,
				'SignedPaymentDetail' : 'signedDocument',
				'clientid'			  : 'clientId'
			};
			
			function getNotificationFunction(methodName) {
				return function(params, success, fail) {
					attBase.Payment[methodName]({
						headers: getCommonHeaders(params),
						urlParams: {
							notificationId: params.notificationId
						}
					}, success, fail);
				};
			}
			
			ATT.Payment = {
				'newSubscription': function(params, success, fail) {
					var queryObj = {};
					util.forEach(qsKeyMap, function(paramKey, newKey) {
						queryObj[newKey] = params[paramKey];
					});
					
					attBase.Payment.newSubscription({
						query: queryObj
					}, success, fail);
				},
				'getSubscriptionStatus': function(params, success, fail) {
					var urlParams;
					if (params.subscriptionId) {
						urlParams = { idType: 'SubscriptionId', id: params.subscriptionId };
					} else if (params.merchantTransactionId) {
						urlParams = { idType: 'MerchantTransactionId', id: params.merchantTransactionId };
					} else if (params.subscriptionAuthCode) {
						urlParams = { idType: 'SubscriptionAuthCode', id: params.subscriptionAuthCode };
					}
					
					attBase.Payment.getSubscriptionStatus({
						headers: getCommonHeaders(params),
						urlParams: urlParams
					}, success, fail);
				},
				'getSubscriptionDetails': function(params, success, fail) {
					attBase.Payment.getSubscriptionDetails({
						headers: getCommonHeaders(params),
						urlParams: {
							merchantSubscriptionId: params.merchantSubscriptionId,
							consumerId: params.consumerId
						}
					}, success, fail);
				},
				'newTransaction': function(params, success, fail) {
					var queryObj = {};
					util.forEach(qsKeyMap, function(paramKey, newKey) {
						queryObj[newKey] = params[paramKey];
					});
					
					attBase.Payment.newTransaction({
						query: queryObj
					}, success, fail);
				},
				'getTransactionStatus': function(params, success, fail) {
					var urlParams;
					if (params.transactionId) {
						urlParams = { idType: 'TransactionId', id: params.transactionID };
					} else if (params.merchantTransactionId) {
						urlParams = { idType: 'MerchantTransactionId', id: params.merchantTransactionId };
					} else if (params.transactionAuthCode) {
						urlParams = { idType: 'TransactionAuthCode', id: params.transactionAuthCode };
					}
					
					attBase.Payment.getTransactionStatus({
						headers: getCommonHeaders(params),
						urlParams: urlParams
					}, success, fail);
				},
				'refundTransaction': function(params, success, fail) {
					attBase.Payment.refundTransaction({
						headers: getCommonHeaders(params, true),
						query: {
							Action: params.action
						},
						urlParams: {
							transactionId: params.transactionId
						},
						body: params.body
					}, success, fail);
				},
				'getNotification': getNotificationFunction('getNotification'),
				'acknowledgeNotification': getNotificationFunction('acknowledgeNotification')
			};
		})();
	}
	
	if(true) {
		ATT.IMMN = {
			'sendMessage': function(params, success, fail) {
				attBase.IMMN.sendMessage({
					headers: getCommonHeaders(params, true),
					body: params.body,
					attachment: convertAttachments(params.attachments)
				}, success, fail);
			},
			'getMessageHeaders': function(params, success, fail) {
				attBase.IMMN.getMessageHeaders({
					headers: getCommonHeaders(params),
					query: {
						HeaderCount: params.headerCount,
						IndexCursor: params.indexCursor
					}
				}, success, fail);
			},
			'getMessageContent': function(params, success, fail) {
				attBase.IMMN.getMessageContent({
					headers: getCommonHeaders(params),
					urlParams: {
						messageId: params.messageId,
						partNumber: params.partNumber
					}
				}, success, fail);
			}
		};
	}

	if(has('IAM')) {
		ATT.InAppMessaging = {
			'sendMessage': function(params, success, fail) {
				attBase.InAppMessaging.sendMessage({
					headers: getCommonHeaders(params, true),
					body: params.body,
					attachment: convertAttachments(params.attachments)
				}, success, fail);
			},
			//Method for backwards compatibility
			'getMessageHeaders': function(params, success, fail) {
				var qsObj = {
					//Backwards compatible
					limit: params.headerCount,
					offset: params.indexCursor
				};

				['messageIds', 'isFavorite', 'isUnread', 'type', 'IsIncoming'].forEach(function(key) {
					qsObj[key] = params[key];
				});
				
				console.warn('IMMN.getMessageHeaders is deprecated.  Use IMMN.getMessageList');
				
				attBase.InAppMessaging.getMessageList({
					headers: getCommonHeaders(params),
					query: qsObj
				}, success, fail);
			},
			'getMessageList': function(params, success, fail) {
				var qsObj = {};

				['limit', 'offset', 'messageIds', 'isFavorite', 'isUnread', 'type', 'IsIncoming'].forEach(function(key) {
					qsObj[key] = params[key];
				});

				attBase.InAppMessaging.getMessageList({
					headers: getCommonHeaders(params),
					query: qsObj
				}, success, fail);
			},
			'getMessage': function(params, success, fail) {
				attBase.InAppMessaging.getMessage({
					headers: getCommonHeaders(params),
					urlParams: {
						messageId: params.messageId
					}
				}, success, fail);
			},
			'getMessageContent': function(params, success, fail) {
				attBase.InAppMessaging.getMessageContent({
					headers: getCommonHeaders(params),
					urlParams: {
						messageId: params.messageId,
						partId: params.partNumber
					}
				}, success, fail);
			},
			'getMessagesDelta': function(params, success, fail) {
				
				attBase.InAppMessaging.getMessagesDelta({
					headers: getCommonHeaders(params),
					query: { state: params.state}
				}, success, fail);
			},
			'updateMessages': function(params, success, fail) {				
				if(typeof params.body !== 'string') {
					fail({error: '"body" parameter must be a String'});
					return;
				}
				
				var headerObj = getCommonHeaders(params, true);
				
				// Change in input suggestion.
				//var bodyString = (typeof params.body === 'object') ? JSON.stringify({messages: params.body}) : (params.body + '');
				headerObj['Content-Length'] = params.contentLength; //bodyString.length;
				
				attBase.InAppMessaging.updateMessages({
					headers: headerObj,
					body: params.body //Assumption: typeof params.body === 'string'
				}, success, fail);
			},
			'updateMessage': function(params, success, fail) {
				if(typeof params.body !== 'string') {
					fail({error: '"body" parameter must be a String'});
					return;
				}
				
				var headerObj = getCommonHeaders(params, true);

				headerObj['Content-Length'] = params.contentLength;
				
				attBase.InAppMessaging.updateMessage({
					headers: headerObj,
					urlParams: {
						messageId: params.messageId
					},
					body: params.body
				}, success, fail);
			},
			'deleteMessages': function(params, success, fail) {
				attBase.InAppMessaging.deleteMessages({
					headers: getCommonHeaders(params),
					query: { messageIds: params.messageIds}
				}, success, fail);
			},
			'deleteMessage': function(params, success, fail) {
				attBase.InAppMessaging.deleteMessage({
					headers: getCommonHeaders(params),
					urlParams: {
						messageId: params.messageId
					}
				}, success, fail);
			},
			'createMessageIndex': function(params, success, fail) {
				attBase.InAppMessaging.createMessageIndex({
					headers: getCommonHeaders(params),
				}, success, fail);
			},
			'getMessageIndexInfo': function(params, success, fail) {
				attBase.InAppMessaging.getMessageIndexInfo({
					headers: getCommonHeaders(params),
				}, success, fail);
			},
			'getNotificationConnectionDetails': function(params, success, fail) {
				var headerObj = getCommonHeaders(params);
				var qsObj = { queues: params.queues};
				
				attBase.InAppMessaging.getNotificationConnectionInfo({
					headers: headerObj,
					query: qsObj
				}, success, fail);
			}
		};
	}
	
	if(false) {
		ATT.CMS = {
			'createSession': function(params, success, fail) {
				attBase.CMS.createSession({
					headers: getCommonHeaders(params, true),
					body: params.body
				}, success, fail);
			},
			'sendSignal': function(params, success, fail) {
				attBase.CMS.sendSignal({
					headers: getCommonHeaders(params, true),
					urlParams: { cmsId: params.cmsId },
					body: params.body
				}, success, fail);
			}
		};
	}
	
	if(true) {
		ATT.Ads = {
			'getAds': function(params, success, fail) {
				var headers = getCommonHeaders(params);
				headers['Udid'] = params.udid;
				headers['User-Agent'] = params.userAgent;
				
				attBase.Ads.getAds({
					headers: headers,
					query: params.body
				}, success, fail);
			}
		};
	}
	
	ATT.OAuth = {
		'obtainEndUserAuthorization': function(params, success, fail) {
			attBase.OAuth.obtainEndUserAuthorization({
				headers: getCommonHeaders(params),
				query: {
					'client_id'    : params.clientId,
					'scope'        : params.scope,
					'redirect_uri' : params.redirectUrl
				}
			}, success, fail);
		}
	};
	
	
	
	if(false) {
		ATT.WAPPush = {
			'sendWAPPush': function(params, success, fail) {
				var pushObj = {};
				pushObj[constants.attachmentKeys.BODY] = body.data;
				pushObj[constants.attachmentKeys.NAME] = 'PushContent';
				pushObj[constants.attachmentKeys.MIME_TYPE] = 'text/xml';
				
				attBase.WAPPush.sendWAPPush({
					headers: getCommonHeaders(params, true),
					body: params.body,
					attachments: [pushObj]
				}, success, fail);
			}
		};
	}
	
	if(false) {
		ATT.Location = {
			'getDeviceLocation': function(params, success, fail) {
				attBase.Location.getDeviceLocation({
					headers: getCommonHeaders(params),
					query: {
						'requestedAccuracy'  : params.requestedAccuracy,
						'Tolerance'			 : params.tolerance,
						'acceptableAccuracy' : params.acceptableAccuracy
					}
				}, success, fail);
			}
		};
	}
	
	if(true) {
		ATT.Speech = {
			'speechToText': function(params, success, fail) {
				attBase.Speech.speechToText({
					headers: {
						'Accept'             : params.accept,
						'Content-Type'       : params.contentType,
						'Transfer-Encoding'  : params.transferEncoding,
						'X-SpeechContext'    : params.xSpeechContext,
						'X-SpeechSubContext' : params.xSpeechSubContext,
						'Content-Language'   : params.contentLanguage,
						'Content-Length'     : params.contentLength,
						'X-Arg'              : params.xArg || params.xarg
					},
					filePath: params.filePath
				}, success, fail);
			}
		};
	}
	
	if(true) {
		var origSpeechObj = ATT.Speech;
		ATT.Speech = origSpeechObj || {};
		
		ATT.Speech.textToSpeech = function(params, success, fail) {
			attBase.Speech.textToSpeech({
				headers: {
					'Accept'           : params.accept,
					'Content-Type'     : params.contentType,
					'Content-Language' : params.contentLanguage,
					'Content-Length'   : params.contentLength,
					'X-Arg'            : true ? params.xarg : params.xArg
				},
				responseFilePath: params.filePath,
				body: params.body
			}, success, fail);
		};
		
		if(true) {
			ATT.tts = { textToSpeech: ATT.Speech.textToSpeech };
			
			if(origSpeechObj) {
				delete origSpeechObj.textToSpeech;
			} else {
				delete ATT.Speech;
			}
		}
	}
	
	if(false) {
		var fileExtensionMimeTypes = {
			'wav': 'audio/wav',
			'amr': 'audio/amr',
			'awr': 'audio/amr-wb'
		};
		
		ATT.Speech = ATT.Speech || {};
		
		var textFileTypes = ['dictionary', 'grammar', 'grammar-prefix', 'grammar-altgram']
		,	textFileFunctions = {};
		
		textFileTypes.forEach(function(name) {
			var attName = 'x-' + name
			,	extension = (name === 'dictionary') ? 'pls' : 'srgs'
			,	mimeType = 'application/' + extension + '+xml';
			
			textFileFunctions[name] = function(data) {
				if(!data) return;
				
				var grammarAttachment = { name: attName,  mimeType: mimeType };
				
				if(typeof data === 'string') {
					//If there is no file extension then this must not be a filePath string so it must be the content
					var filePathMatch = data.match(/.*\.(.*)/);
					if(!filePathMatch || filePathMatch[1] !== extension) {
						data = { body: data };
					} else {
						data = { filePath: data };
					}
				}
				
				if(data.body) {
					grammarAttachment.body = data.body;
					if(data.filePath) grammarAttachment.fileName = data.filePath.match(/(.*\/|^)(.*)/)[2];
					if(data.encoding) grammarAttachment.encoding = data.encoding;
				} else {
					grammarAttachment.filePath = data.filePath;
				}
				
				return grammarAttachment;
			};
		});
		
		/*
		 * TODO expose grammar/dictionary Object options
		 */
		/**
		 * @method speechToTextCustom
		 * This method returns a text translation of a specified audio file using a custom set of hints for pronunciation and grammar. The audio file must be created in one of the following formats:
		 *
		 * &bull; 16-bit PCM WAV, single channel, 8 kHz sampling
		 *
		 * &bull; AMR (narrowband), 12.2 kbit/s, 8 kHz sampling.
		 *
		 * @param {Object} params An Object containing the following properties:
		 * @param {String/Object} [params.audioFile] A string with a filePath to the audio file or an object with the following properties:
		 * @param {String} [params.audioFile.filePath] The path to the audio file. If params.audioFile.body is also defined, this will be used as the file name in the request.
		 * @param {String} [params.audioFile.body] The audio file content.
		 * @param {String} [params.audioFile.type] The MIME type of the audio file.
		 * @param {String} [params.audioFile.encoding] The encoding format of the audio file.
		 * @param {String} [params.grammar] String of a file path or a string in Speech Recognition Grammar Specification (SRGS) format.
		 * @param {String} [params.grammarPrefix] Grammar rules for the prefix speech following the same format as params.grammar
		 * @param {String} [params.grammarAltgram] Grammar rules for alternative grammar, following the same format as params.grammar
		 * @param {String} [params.dictionary] String of a file path with pronunciation hints in the Pronunciation Lexicon Specification (PLS) format, or a string containing the pronunciation hints in the PLS format.
		 * @param {String} [params.language] The language of the audio recording, specified as an ISO code language string.
		 * @param {String/Object} [params.xArg] Either a comma-separated URL-encoded string or a flat object consisting of xArg parameter key/value pairs.  Please visit the <a href="https://developer.att.com/developer/basicTemplate.jsp?passedItemId=13100102&api=Speech&version=3">AT&T Restful API</a> for a list of all possible values
		 * @param {Object} [params.options] A set of options for the request.
		 * @param {Boolean} [params.options.emma] The option to callback with the response as a string following the EMMA protocol.
		 * @param {Boolean} [params.options.strict] If set to true, the response will strictly follow the passed in grammar rules
		 * @param {Boolean} [params.options.chunked] If set to true, this will send the audio file to server using a chunked protocol.
		 * 
		 * @param {Function} success This method is called if data is successfully returned.  The first argument will be contain the response in JSON object defined by the <a href="https://developer.att.com/developer/basicTemplate.jsp?passedItemId=13100102&api=Speech&version=3">AT&T Restful API</a>.
		 * @param {Function} fail This method is called if an error occurs.
		 * 
		 */
		
		//TODO Limit values of grammar and pronunciation to strings only, file path or body
		
		var sttc = ATT.Speech.speechToTextCustom = function(params, success, fail) {
			var attachments = [], options = params.options || {}, isEMMA = options.emma;
			
			//Add the text files
			textFileTypes.forEach(function(name) {
				//Converts words with a dash to camelCase, e.g. "grammar-prefix" to "grammarPrefix"
				var paramName = name.replace(/-[a-z]/, function(dashLetter) { return dashLetter[1].toUpperCase(); });
				var attachment = textFileFunctions[name](params[paramName]);
				if(attachment) attachments.push(attachment);
			});
			
			if(!params.audioFile) {
				throw new Error('missing required parameter "audioFile"');
			}
			
			attachments.push(sttc.handleAudioFile(params.audioFile));
			
			var formatSuccessResp = success && function(resp, ajax) {
				var formattedRespObj = resp.data;
				//TODO In the 2.0 wrapper create an interface that interperets the results and creates
				//		a consistant result on the success call
				
				success.call(this, formattedRespObj, ajax);
			};
			
			attBase.Speech.speechToTextCustom({
				headers: {
					'Accept'             : isEMMA ? 'application/emma+xml' : 'application/json',
					//'Transfer-Encoding'  : options.chunked && 'chunked', //TODO Implement this feature
					'X-SpeechContext'    : options.strict ? 'GrammarList' : 'GenericHints',
					'Content-Language'   : params.language,
					'X-Arg'              : params.xArg
				},
				attachments: attachments
			}, formatSuccessResp, fail);
		};
		
		//NOTE: Replace this function in other platforms to allow for passing platform
		//		specific file objects
		sttc.handleAudioFile = function(audioFile) {
			var filePath, mimeType, encoding;
			
			if(typeof audioFile === 'string') {
				filePath = audioFile;
			} else {
				filePath = audioFile.filePath;
				mimeType = audioFile.type;
				encoding = audioFile.encoding;
			}
			
			if(!mimeType && filePath) {
				var fileExtMatch = filePath.match(/.*\.(.*)/);
				var fileExtension = fileExtMatch && fileExtMatch[1];
				mimeType = fileExtensionMimeTypes[fileExtension];
			}
			
			var audioAttachment = {
				mimeType: mimeType,
				name: 'x-voice',
				encoding: encoding
			};
			
			if(audioFile.body) {
				audioAttachment.fileName = filePath && filePath.match(/(.*\/|^)(.*)/)[2];
				audioAttachment.body;
			} else {
				audioAttachment.filePath = filePath;
			}
			
			return audioAttachment;
		};
	}
	
	ATT.Notary = {
		'signedPayload': function(params, success, fail) {
			attBase.Notary.signedPayload({
				headers: {
					'Accept'        : params.accept,
					'Content-Type'  : params.contentType,
					'Client_id'     : params.clientId,
					'Client_secret' : params.clientSecret,
					'X-Arg'			: params.xArg || params.xarg
				},
				body: params.data
			}, success, fail);
		}
	};
	
	
	function stringifyResp(cb) {
		return function(data) {
			if (data!==null) {
				if(data.erorr!=undefined) {
                	if(data.error.status==401) {
                		attBase.accessToken.remove();  
                	}
            	}
            }
			arguments[0] = JSON.stringify(data);
			
			cb.apply(this, arguments);
		};
	}
	
	var skipStringify = function(methodName) {
		return ['newTransaction', 'newSubscription'].indexOf(methodName) >= 0 //Non stringified functions responses
				//Simulate a bug from from PhoneGap 1.0 versions
				|| (true && ['sendMMS', 'sendMessage', 'speechToText', 'textToSpeech'].indexOf(methodName) >= 0);
	};
	
	function formatMethodInput(customHandler, methodPath) {
		return function(params, success, fail) {
			var formattedSuccess = function(resp) {
				if(resp) arguments[0] = resp.data;
				
				if(skipStringify(methodPath[1])) {
					success.apply(this, arguments);
				} else {
					stringifyResp(success).apply(this, arguments);
				}
			};
			
			var formattedFail = stringifyResp(fail);
			
			customHandler(params, formattedSuccess, formattedFail);
		};
	}
	
	//NOTE: This is a list of new methods added later that will match the 2.0 Layer style
	var excludeMethods = {
		speechToTextCustom: true
	},
	excludeScopes = {
		accessToken: true, 
		userAuthToken: true
	};
	
	util.forEach(ATT, function(methods, scope) {
		if(typeof methods !== 'object' || excludeScopes[scope]) return;
		util.forEach(methods, function(method, methodName) {
			if(typeof method !== 'function' || excludeMethods[methodName]) return;
			methods[methodName] = formatMethodInput(method, [scope, methodName]);
		});
	});
	
	return ATT;
});var r=require;r("extensions/phonegap");e.ATT=r("wrappers/wrapper-1.0");});