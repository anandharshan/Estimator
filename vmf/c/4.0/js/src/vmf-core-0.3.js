/*
 * VMWARE JavaScript Framework - Core Functionality
 * Author : Tushar Roy
 * Last Modified : Mar 12, 2014
 */

	/* forEach fix - START */
	if (!Array.prototype.forEach) {

		Array.prototype.forEach = function (callback, thisArg) {

			var T, k;

			if (this == null) {
			  throw new TypeError(" this is null or not defined");
			}

			// 1. Let O be the result of calling ToObject passing the |this| value as the argument.
			var O = Object(this);

			// 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
			// 3. Let len be ToUint32(lenValue).
			var len = O.length >>> 0;

			// 4. If IsCallable(callback) is false, throw a TypeError exception.
			// See: http://es5.github.com/#x9.11
			if (typeof callback !== "function") {
			  throw new TypeError(callback + " is not a function");
			}

			// 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
			if (thisArg) {
			  T = thisArg;
			}

			// 6. Let k be 0
			k = 0;

			// 7. Repeat, while k < len
			while (k < len) {

			  var kValue;

			  // a. Let Pk be ToString(k).
			  //   This is implicit for LHS operands of the in operator
			  // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
			  //   This step can be combined with c
			  // c. If kPresent is true, then
			  if (k in O) {

			    // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
			    kValue = O[k];

			    // ii. Call the Call internal method of callback with T as the this value and
			    // argument list containing kValue, k, and O.
			    callback.call(T, kValue, k, O);
			  }
			  // d. Increase k by 1.
			  k++;
			}
			// 8. return undefined
		};
	}

	/* forEach fix - END */

;(function(VMF, document) {

	//Array to store registered callbacks for VMF events
	VMF.eventHandlers = {
		onReady: []
	};
	
	//Sub namespaces
	VMF.configuration = {};		//Everything pre-determined and static
	VMF.patterns = {};			//Modules and thier related functions
	VMF.utils = {};				//Utilities, ones that do not fit elsewhere :)
	VMF.cached = {};			//Cached items in VMF, as an when avilable
	VMF.cached.scripts = {};	//Cached scripts, sub namespace if "cached" object.
	VMF.cached.modules = {};	//Cached scripts, sub namespace if "cached" object.

	//References to external directories and files
	//Simplified from v0.1
	VMF.configuration = {
		root: ''
		,mappings: {
			'jquery': 		'jquery/jquery-1.11.0.min.js'
			,'modernizr': 	'modernizr/modernizr-latest.js'
			,'yepnope': 	'yepnope/yepnope.js'
			,'bootstrap': 	'bootstrap/bootstrap.min.js'
			,'mustache': 	'mustache/mustache.js'
			,'microTemplate': 'microTemplate/templateEngine.js'
			,'dataTable': 	'../../../m/datatable/src/js/jquery.dataTables.min.js'
			,'calendar': 	'../../../m/calendar/src/jquery.datepick.min.js'
			,'parsley': 	'../../../m/parsley/parsley.js'
		}
	};

	//Handles logs within VMF
	VMF.log = function(title, message) {
	//	console.log(message ? "[" + title + "] " + message : title);
	};

	//Handles managed errors within VMF
	VMF.error = function(title, message) {
	//	console.error(message ? "[" + title + "] " + message : title); //TODO: Streamline error handling
	};

	//Handles managed errors within VMF
	VMF.alert = function(title, message) {
	//	alert(message ? "[" + title + "] " + message : title); //TODO: Streamline error handling
	};

	//Create namespaces easily
	VMF.namespace = function(namespaceString) {
	    var parts = namespaceString.split('.'),
	        parent = window,
	        currentPart = '';    
	        
	    for(var i = 0, length = parts.length; i < length; i++) {
	        currentPart = parts[i];
	        parent[currentPart] = parent[currentPart] || {};
	        parent = parent[currentPart];
	    }
	    
	    return parent;
	}

	//Gets the mapped URL for a module/script name
	VMF.utils.getScriptSourceURL = function(script) {
		return VMF.configuration.root + VMF.configuration.mappings[script];
	};

	//Loads a URL as a JavaScript into the document
	VMF.utils.loadScriptFromURL = function(url, callback) {
	    var script = document.createElement("script"),
	    	head;
	    script.src = url;

	    if (script.readyState){  //IE
	        script.onreadystatechange = function() {
	            if (script.readyState == "loaded" || script.readyState == "complete") {
	                script.onreadystatechange = null;
	           		callback();
	            }
	        };
	    } else {  //Others
	        script.onload = function() {
	        	callback();
	        };
	    }
	    /* fetching head element - fix for IE */
	    head = document.head || document.getElementsByTagName('head')[0];
	    if( head ){
		    head.appendChild(script);
		}
	};
	
	//Introduced in v0.3 - Takes array of scripts (relative urls)
	//Loads each one if not loaded already
	//When all scripts are loaded, callback is executed
	VMF.utils.loadScripts = function(scripts, callback) {

		//Handle passing of single scripts as string
		if( typeof scripts === 'string' ) {
			//var a = new Array(); a.push(scripts); scripts = a;	//TODO: Refactor
			scripts=scripts.split("@#$");
		}

		scripts.forEach(function(script){

			if(VMF.cached.scripts[script]) {
				return VMF.error("Skipping load", "Script [" + script + "] already loaded.");
			} else {
				VMF.utils.loadScriptFromURL(script, function() {
					var self = this;
					VMF.cached.scripts[script] = true;
					VMF.log("Load Complete", script);
					if(callback) {
						var loadedAll = true;
						for(var i=0; i<scripts.length; i++) {
							if(!VMF.cached.scripts[scripts[i]]) loadedAll = false;
						}
						if(loadedAll) {
							callback();
						}
					}
				});
			}
		});
	};

	//Takes array of module names
	//Loads each one if not loaded already
	//When all modules are loaded, callback is executed
	VMF.utils.loadModules = function(modules, callback) {

		//Handle passing of single scripts as string
		if( typeof modules === 'string' ) {
			//var a = new Array(); a.push(scripts); scripts = a;	//TODO: Refactor
			modules=modules.split("@#$");
		}

		modules.forEach(function(module){

			if(! VMF.utils.getScriptSourceURL(module)) {
				return VMF.error("Module not found", module);
			} else if(VMF.cached.modules[module]) {
				return VMF.error("Skipping load", "Module [" + module + "] already loaded.");
			} else {
				VMF.utils.loadScriptFromURL(VMF.utils.getScriptSourceURL(module), function() {
					var self = this;
					VMF.cached.modules[module] = true;
					VMF.log("Load Complete", VMF.utils.getScriptSourceURL(module));
					if(callback) {
						var loadedAll = true;
						for(var i=0; i<modules.length; i++) {
							if(!VMF.cached.modules[modules[i]]) loadedAll = false;
						}
						if(loadedAll) {
							callback();
						}
					}
				});
			}
		});
	};

	//Introduced in v0.2 - Abstraction of loadModules (TODO:Review yepnope instead)
	//require checks (and loads if required) modules listed,
	//And executes callback after load completion
	VMF.require = function(modules, callback) {
		VMF.utils.loadModules(modules, callback);
	};

	//Provides API to register onReady functions - a la jquery!
	VMF.ready = function(callback) {
		VMF.eventHandlers.onReady.push(callback);
	};
	
	//Executes functions registered for onReady
	function _onReadyHandler() {
		VMF.eventHandlers.onReady.forEach(function(callback){
			callback();
		});
	};

	//Entry Point
	//Project specific initialization for VMF (and required modules)
	//TODO: Add check for existence of required libraries, and skip loading if required

	//var vmfCore = document.getElementById("vmf-core"),
	//	vmfRoot = vmfCore ? vmfCore.getAttribute("data-root") : "";
	//VMF.configuration.root = vmfRoot + VMF.configuration.root;

	var thisScript = document.currentScript || (function() {
		    var scripts = document.getElementsByTagName("script");
		    return scripts[scripts.length - 1];
		})(),
		vmfRoot = thisScript.src.substring(0, thisScript.src.lastIndexOf("/") + 1);

	VMF.configuration.root = vmfRoot + VMF.configuration.root;		
	
	VMF.init = function() {
		VMF.require('jquery', function() {
			VMF.require(['modernizr','yepnope','bootstrap', 'mustache', 'microTemplate', 'parsley'], function() {
				_onReadyHandler();
			})
		});
	};

})( window.VMF = window.VMF || {}, document, undefined );