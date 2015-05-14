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

;(function(vmf, document) {

	//Array to store registered callbacks for VMF events
	vmf.eventHandlers = {
		onReady: []
	};
	
	//Sub namespaces
	vmf.configuration = {};		//Everything pre-determined and static
	vmf.patterns = {};			//Modules and thier related functions
	vmf.utils = {};				//Utilities, ones that do not fit elsewhere :)
	vmf.cached = {};			//Cached items in VMF, as an when avilable
	vmf.cached.scripts = {};	//Cached scripts, sub namespace if "cached" object.
	vmf.cached.modules = {};	//Cached scripts, sub namespace if "cached" object.
	vmf.scEvent = false;
	//References to external directories and files
	//Simplified from v0.1
	vmf.configuration = {
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
	vmf.log = function(title, message) {
	//	console.log(message ? "[" + title + "] " + message : title);
	};

	//Handles managed errors within VMF
	vmf.error = function(title, message) {
	//	console.error(message ? "[" + title + "] " + message : title); //TODO: Streamline error handling
	};

	//Handles managed errors within VMF
	vmf.alert = function(title, message) {
	//	alert(message ? "[" + title + "] " + message : title); //TODO: Streamline error handling
	};

	//Create namespaces easily
	vmf.namespace = function(namespaceString) {
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
	vmf.ns = function(){return {//ns (namespace) methods
			use:function(_33){var ary=_33.split(".");var obj=window;for(var i in ary){if(!obj[ary[i]]){obj[ary[i]]={};obj=obj[ary[i]];}else{obj=obj[ary[i]];}}}};
	};
	vmf.dom = function(){ //dom methods
			return {
				onload:function(_b){$(document).ready(_b);},
				unload:function(_c){$(window).unload(_c);},
				id:function(id){return document.getElementById(id);},
				getHtml:function(id){return _1(id).html();},
				setHtml:function(id,val,pos){switch(pos){case "before":_1(id).prepend(val);break;case "after":_1(id).append(val);break;
				default:_1(id).html(val);}},
				addHandler:function(_12,_13,_14){(_12 instanceof jQuery?_12:jQuery(_12)).bind(_13,_14);},removeHandler:function(_15,_16,_17){(_15 instanceof jQuery?_15:jQuery(_15)).unbind(_16,_17);},
				get:function(_18){return $(_18);},
				serialize:function(_19){return jQuery(_19).serialize();},
				trigger:function(_1a,_1b){(_1a instanceof jQuery?_1a:jQuery(_1a)).trigger(_1b);}};
	};	

	//Gets the mapped URL for a module/script name
	vmf.utils.getScriptSourceURL = function(script) {
		return vmf.configuration.root + vmf.configuration.mappings[script];
	};

	//Loads a URL as a JavaScript into the document
	vmf.utils.loadScriptFromURL = function(url, callback) {
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
	vmf.utils.loadScripts = function(scripts, callback) {

		//Handle passing of single scripts as string
		if( typeof scripts === 'string' ) {
			//var a = new Array(); a.push(scripts); scripts = a;	//TODO: Refactor
			scripts=scripts.split("@#$");
		}

		scripts.forEach(function(script){

			if(vmf.cached.scripts[script]) {
				return vmf.error("Skipping load", "Script [" + script + "] already loaded.");
			} else {
				vmf.utils.loadScriptFromURL(script, function() {
					var self = this;
					vmf.cached.scripts[script] = true;
					vmf.log("Load Complete", script);
					if(callback) {
						var loadedAll = true;
						for(var i=0; i<scripts.length; i++) {
							if(!vmf.cached.scripts[scripts[i]]) loadedAll = false;
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
	vmf.utils.loadModules = function(modules, callback) {

		//Handle passing of single scripts as string
		if( typeof modules === 'string' ) {
			//var a = new Array(); a.push(scripts); scripts = a;	//TODO: Refactor
			modules=modules.split("@#$");
		}

		modules.forEach(function(module){

			if(! vmf.utils.getScriptSourceURL(module)) {
				return vmf.error("Module not found", module);
			} else if(vmf.cached.modules[module]) {
				return vmf.error("Skipping load", "Module [" + module + "] already loaded.");
			} else {
				vmf.utils.loadScriptFromURL(vmf.utils.getScriptSourceURL(module), function() {
					var self = this;
					vmf.cached.modules[module] = true;
					vmf.log("Load Complete", vmf.utils.getScriptSourceURL(module));
					if(callback) {
						var loadedAll = true;
						for(var i=0; i<modules.length; i++) {
							if(!vmf.cached.modules[modules[i]]) loadedAll = false;
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
	vmf.require = function(modules, callback) {
		vmf.utils.loadModules(modules, callback);
	};

	//Provides API to register onReady functions - a la jquery!
	vmf.ready = function(callback) {
		vmf.eventHandlers.onReady.push(callback);
	};
	
	//Executes functions registered for onReady
	function _onReadyHandler() {
		vmf.eventHandlers.onReady.forEach(function(callback){
			callback();
		});
	};

	//Entry Point
	//Project specific initialization for VMF (and required modules)
	//TODO: Add check for existence of required libraries, and skip loading if required

	//var vmfCore = document.getElementById("vmf-core"),
	//	vmfRoot = vmfCore ? vmfCore.getAttribute("data-root") : "";
	//vmf.configuration.root = vmfRoot + vmf.configuration.root;

	var thisScript = document.currentScript || (function() {
		    var scripts = document.getElementsByTagName("script");
		    return scripts[scripts.length - 1];
		})(),
		vmfRoot = thisScript.src.substring(0, thisScript.src.lastIndexOf("/") + 1);

	vmf.configuration.root = vmfRoot + vmf.configuration.root;		
	
	vmf.init = function() {
		vmf.require('jquery', function() {
			vmf.require(['modernizr','yepnope','bootstrap', 'mustache', 'microTemplate', 'parsley'], function() {
				_onReadyHandler();
			})
		});
	};

})( window.vmf = window.vmf || {}, document, undefined );