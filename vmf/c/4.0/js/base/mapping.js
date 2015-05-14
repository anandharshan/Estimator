;(function(vmf){

function _getDomain(){
	var thisScript = document.currentScript || (function() {
		    var scripts = document.getElementsByTagName("script");
		    return scripts[scripts.length - 1];
		})(),
	 a = document.createElement("a");
	a.href= thisScript.src;
	return a.hostname;
}
vmf.configs = ({   
	
	baseUrl :"//"+_getDomain()+"/vmf",
	
	/**
	 * Alias names of the definitions which are mapped to the paths
	 */
	definitions: {
		"jquery":"c/4.0/js/vmf.min",
		"datatable":"m/datatable/4.0/js/dataTables.min",
		"calendar":"m/calendar/4.0/js/calendar.min",
		"parsley":"m/parsley/4.0/js/parsley",
		"vmf":"c/4.0/js/vmf.min",
		"mustache":"c/4.0/js/src/mustache/mustache",
		"microTemplate":"c/4.0/js/src/microTemplate/templateEngine",
		"json":"c/4.0/js/src/json/json3.min",
		"plot":"m/plot/1.0/jquery.jqplot"
	},
	
	/** 
	 * Useful for Declaring Dependencies :
	 * Specify the  modules which are not implemented AMD module structure and depending some other modules
	 */
	dependencies: {
		'*': ['vmf']
	},
	
	/**
	 * List of module names
	 */
	modules: {
		"calendar":{definition:"calendar",css:["m/calendar/4.0/css/starlight"]},
		"datatable":{definition:"datatable",css:["m/datatable/4.0/css/starlight"]},
		"plot":{definition:"plot",css:["m/plot/1.0/jquery.jqplot.min"]},
		"parsley":{definition:"parsley"},
		"mustache":{definition:"mustache"},
		"microTemplate":{definition:"microTemplate"},
		"json":{definition:"json"}
	}
		
});

var VMFModuleLoader = {

        /**
		 * Load Css File
		 */
		loadCss : function (urls) {
		   if(!urls){
				return;
		   }
		   if(Object.prototype.toString.call(urls) !='[object Array]') {
				urls = [urls];
		   }
		   for (var i = 0, loopLen = urls.length; i < loopLen; i++) {
				var link = document.createElement("link"),url = urls[i]+".css";
				link.type = "text/css";
				link.rel = "stylesheet";
				if(url.indexOf("/")!==0){
					url = vmf.configs.baseUrl+"/"+url;
				}
				link.href = url;
				document.getElementsByTagName("head")[0].appendChild(link);
			}
		},
		
		/**
		 * Looping through the css to load css files
		 */
		css:function (urls, module) {
			module = module || "___module__";
		    //if(urls && !require.defined(module)) {
			if(urls && vmf.configs["modules"][module] && !vmf.configs["modules"][module].moduleLoaded){
				VMFModuleLoader.loadCss(urls);
			}
		},
		
		/**
		 * Load Image Files
		 * @ param imgs - list of images array or image name string
		 * @ param module - optional
		 */
		loadImages: function(imgs,module){
			module = module || "___module__";
			if(imgs && imgs.length>0){
			   for(var img =0, imgLen = imgs.length; img<imgLen; img++){
					(new Image()).src = imgs[img].indexOf("/")!==0 ? vmf.configs.baseUrl+"/"+imgs[img]:imgs[img];
			   }
			}
		},
		
		/**
		 * Load JS Files
		 * @ param js - list of js array or js name string
		 * @ param cB - call back function
		 */
		loadJS: function(js,cB){
				VMFModuleLoader.loadDefinitions(js,cB,true);
		
		},
		/**
		 * Load Definitions  
		 *
		 * If the only argument to require is a string, then the module that
		 * is represented by that string is fetched for the appropriate context.
		 *
		 * If the first argument is an array, then it will be treated as an array
		 * of dependency string names to fetch. An optional function callback can
		 * be specified to execute when all of those dependencies are available.
		 *
		 *
		 * For Ex: loadDefinitions("/custom/j/yui",function(){alert("yui is loaded");});
		 *		   loadDefinitions(["/custom/j/yui","/custom/j/angular"],function(){alert("yui js and angular js are loaded");});
		 *
		 */
		
		loadDefinitions: function(definitions,cB, isExternal){
			if(!definitions) {
				return false;
			}
			if(Object.prototype.toString.call(definitions) !='[object Array]') {
				definitions = [definitions];
			}
			
			if(!cB){
				cB = function(){};
			}
			
			if(definitions.length>0){
				require(definitions,function(){
				  if(!isExternal){
					for(var d=0,dlen=definitions.length;d<dlen;d++){
						if(!vmf.configs["modules"][definitions[d]]){vmf.configs["modules"][definitions[d]] = {};}
						vmf.configs["modules"][definitions[d]]["moduleLoaded"] = true;
					}
				  }
				  cB.call(this);
				
				});
			}
		
		},
		
		/**
		 * Load modules 
		 *
		 * If the only argument to require is a string, then the module that
		 * is represented by that string is fetched for the appropriate context.
		 *
		 * If the first argument is an array, then it will be treated as an array
		 * of dependency string names to fetch. An optional function callback can
		 * be specified to execute when all of those dependencies are available.
		 *
		 * If the first and second arguments are arrays, then it will be treated as an array
		 * of dependency string names to fetch. Function callback can
		 * be specified to execute when each dependency is available.
		 *
		 * For Ex: loadModules("calendar",function(){alert("calendar is loaded");});
		 *		   loadModules(["calendar","datatable"],function(){alert("calendar and datatable are loaded");});
		 *		   loadModules(["calendar","datatable"],[function(){alert("calendar is loaded");},function(){alert("datatable is loaded");}]);
		 *
		 */
		
		loadModules : function (strModuleNames, cBs){
			if(!strModuleNames){
				return false;
			}
		    if(Object.prototype.toString.call(strModuleNames) !='[object Array]') {
				strModuleNames = [strModuleNames];
			}
			
			if(!cBs){
				cBs = function(){};
			}
			
			if(typeof VMFModule === "undefined"){VMFModule = vmf.configs;}
			
			var definitions = [];
			for(var d=0,dl = strModuleNames.length;d<dl;d++){
				var strModuleName = strModuleNames[d];
				if(VMFModule.modules && null == VMFModule.modules[strModuleName]){alert("module: " + strModuleName + " does not exist"); continue;}
				VMFModule.moduleObj = VMFModule.modules[strModuleName];
				var localObj = VMFModule.modules[strModuleName];
				//VMFModuleLoader.css(localObj.css,localObj.definition);				
				if(Object.prototype.toString.call(cBs) !='[object Array]') {
					definitions.push(localObj.definition);
				} else {
					VMFModuleLoader.loadDefinitions(localObj.definition, cBs[d]);
				}
				//VMFModuleLoader.loadImages(localObj.imgs,localObj.definition);
			}
			if(Object.prototype.toString.call(cBs) !='[object Array]') {
				VMFModuleLoader.loadDefinitions(definitions, cBs);
			}		
			
		},
		
		/**
		 * Filtering existing modules and custom modules
		 *
		 */
		_getResetModuleNames : function(modules){
			var tempModules = {}, tempModulesExist = false;
			if(!modules){
				return false;
			}
			for (var module in modules) {
				   /*if (vmf.configs.definitions.hasOwnProperty(module)) {
					  alert("module name "+module+" exist, please use other module name");
					  continue;
				   }*/
				   if(!vmf.configs["modules"][module]){
						vmf.configs["modules"][module] = {};
				   }
				   vmf.configs["modules"][module]["definition"] = module;				   
				   if(modules[module]["css"]){
						vmf.configs["modules"][module]["css"] = modules[module]["css"];
						vmf.configs["modules"][module]["moduleLoaded"]= false;
				   }
				   if(modules[module]["imgs"]){
						vmf.configs["modules"][module]["imgs"] = modules[module]["imgs"];
				   }				   
				   if(modules[module]["path"]){
						if(!tempModules["paths"]){
							tempModules["paths"] = {};
						}
						tempModules["paths"][module] = modules[module]["path"];
						vmf.configs["definitions"][module] = modules[module]["path"];
						require.undef(module);
				   }
				   if(modules[module]["deps"]){
						if(!tempModules["deps"]){
							tempModules["deps"] = {};
					    }
						tempModules["deps"][module] = modules[module]["deps"];
						vmf.configs["dependencies"][module] = modules[module]["deps"];	
						require.undef(module);
				   }
				   tempModulesExist = true;
			}
			return tempModulesExist && tempModules;
		
		},
		
		/**
		 * Set modules 
		 *
		 * Adding configurations
		 * {"licence":{"path":"../licence/licence2","deps":["datatable"],"css":[],imgs:[]}}
		 *
		 */
		setModule: function(modules){
			var config = {};
			if(modules){
			   	modules = VMFModuleLoader._getResetModuleNames(modules,"module");				
			}
			if(!modules){
				return false;
			}
			if(modules["paths"]){
				config.paths = modules["paths"];
			}
			if(modules["deps"]){
				config.shim = modules["deps"];
			}			
			requirejs.config(config);		
		},
		
		/**
		 *  Loading dependent css files and img files on each module load.
		 */
		onloadModule: function(moduleName){
			if(typeof VMFModule === "undefined"){VMFModule = vmf.configs;}	
			if(VMFModule.modules && VMFModule.modules[moduleName]){
				var localObj = VMFModule.modules[moduleName];
				VMFModuleLoader.css(localObj.css,localObj.definition);
				VMFModuleLoader.loadImages(localObj.imgs,localObj.definition);
			}
		}		
 		


}

/**
 * Does the request to load a module for the browser case.
 * Make this a separate function to allow other environments
 * to override it.
 *
 * @param {Object} context the require context to find state.
 * @param {String} moduleName the name of the module.
 * @param {Object} url the URL to the module.
 */
requirejs.load = function (context, moduleName, url) {
        var config = (context && context.config) || {},
            node,baseElement,
			isOpera = typeof opera !== 'undefined' && opera.toString() === '[object Opera]';
		if(config.onloadModule){
			config.onloadModule.call(this,moduleName);
		}
        if (requirejs.isBrowser) {
            //In the browser so use a script tag
            node = requirejs.createNode(config, moduleName, url);

            node.setAttribute('data-requirecontext', context.contextName);
            node.setAttribute('data-requiremodule', moduleName);

            //Set up load listener. Test attachEvent first because IE9 has
            //a subtle issue in its addEventListener and script onload firings
            //that do not match the behavior of all other browsers with
            //addEventListener support, which fire the onload event for a
            //script right after the script execution. See:
            //https://connect.microsoft.com/IE/feedback/details/648057/script-onload-event-is-not-fired-immediately-after-script-execution
            //UNFORTUNATELY Opera implements attachEvent but does not follow the script
            //script execution mode.
            if (node.attachEvent &&
                    //Check if node.attachEvent is artificially added by custom script or
                    //natively supported by browser
                    //read https://github.com/jrburke/requirejs/issues/187
                    //if we can NOT find [native code] then it must NOT natively supported.
                    //in IE8, node.attachEvent does not have toString()
                    //Note the test for "[native code" with no closing brace, see:
                    //https://github.com/jrburke/requirejs/issues/273
                    !(node.attachEvent.toString && node.attachEvent.toString().indexOf('[native code') < 0) &&
                    !isOpera) {
                //Probably IE. IE (at least 6-8) do not fire
                //script onload right after executing the script, so
                //we cannot tie the anonymous define call to a name.
                //However, IE reports the script as being in 'interactive'
                //readyState at the time of the define call.
                useInteractive = true;

                node.attachEvent('onreadystatechange', context.onScriptLoad);
                //It would be great to add an error handler here to catch
                //404s in IE9+. However, onreadystatechange will fire before
                //the error handler, so that does not help. If addEventListener
                //is used, then IE will fire error before load, but we cannot
                //use that pathway given the connect.microsoft.com issue
                //mentioned above about not doing the 'script execute,
                //then fire the script load event listener before execute
                //next script' that other browsers do.
                //Best hope: IE10 fixes the issues,
                //and then destroys all installs of IE 6-9.
                //node.attachEvent('onerror', context.onScriptError);
            } else {
                node.addEventListener('load', context.onScriptLoad, false);
                node.addEventListener('error', context.onScriptError, false);
            }
            node.src = url;

            //For some cache cases in IE 6-8, the script executes before the end
            //of the appendChild execution, so to tie an anonymous define
            //call to the module name (which is stored on the node), hold on
            //to a reference to this node, but clear after the DOM insertion.
            currentlyAddingScript = node;
			baseElement = document.getElementsByTagName('base')[0];
            if (baseElement) {
                requirejs.s.head.insertBefore(node, baseElement);
            } else {
                requirejs.s.head.appendChild(node);
            }
            currentlyAddingScript = null;

            return node;
        } else if (requirejs.isWebWorker) {
            try {
                //In a web worker, use importScripts. This is not a very
                //efficient use of importScripts, importScripts will block until
                //its script is downloaded and evaluated. However, if web workers
                //are in play, the expectation that a build has been done so that
                //only one script needs to be loaded anyway. This may need to be
                //reevaluated if other use cases become common.
                importScripts(url);

                //Account for anonymous modules
                context.completeLoad(moduleName);
            } catch (e) {
                context.onError(makeError('importscripts',
                                'importScripts failed for ' +
                                    moduleName + ' at ' + url,
                                e,
                                [moduleName]));
            }
        }
};

/**
 * Main configurations of require js	
 */
 
requirejs.config({
	baseUrl : vmf.configs.baseUrl,
	paths:vmf.configs.definitions,
	onloadModule:VMFModuleLoader.onloadModule,
    shim: vmf.configs.dependencies,	
	waitSeconds: 0	
});

/**
 * Exposed Methods
 *
 */
vmf.loadScript = VMFModuleLoader.loadJS;
vmf.loadCss = VMFModuleLoader.loadCss;
vmf.setModule = VMFModuleLoader.setModule;
vmf.include = VMFModuleLoader.loadModules;

if ( typeof define === "function" && define.amd ) {
	define( "vmf", [], function() {
		return vmf || {};
	});
}

})(window.vmf = window.vmf || {});
