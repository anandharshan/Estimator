// create a handy logging mechanism
// be nice and do not override other Log objects
// framework agnostic
vmf.log = {
	// changes these values to suit your needs
	levels: ['NONE', 'CRITICAL', 'ERROR', 'WARNING', 'INFO', 'DEBUG'], // defaults
	// set your default level of logging to display
	level: 0, // default
	// call this after setting your levels
	initialize: function() {
		this._create_log_functions();
		switch (window.location.hostname) {
		    case 'portal-vmwperf.vmware.com':
            case 'downloads-qa.vmware.com':
                // log only critical messages and error messages
                vmf.log.level = 0;
			break;
            case 'newcastle.vmware.com':
            case 'wwwa-dev-sso-1.vmware.com':
                // set log level for debugging
                vmf.log.level = 0;
            break;
            case 'serafina.vmware.com':
                // set log level for debugging
                vmf.log.level = 5;
            break;
            default:
            break;
        }
        
	},
	// internal function to create a function to each log level
	_create_log_functions: function() {
		var thisLevelsLength = this.levels.length;  // cache length of levels array
		for (var level=0; level<thisLevelsLength; level++) {
			eval('var logLevelFunction = function(message) { if (typeof message != "undefined" && message !== null && message.length > 0) this._log('+level+', message); }');
			this[this.levels[level].toLowerCase()] = logLevelFunction;
		}
	},
	// internal function called by in
	_log: function(level, message) {
		if (typeof level != 'undefined' && level !== null && level != NaN && level > 0 && level < this.levels.length && level <= this.level) {
			var logMessage = this.levels[level]+": "+message;
			// prefer logging to the firebug console
			if (typeof console != "undefined" && console !== null && typeof console.log != "undefined" && console.log !== null) {
				console.log(logMessage);
			} else {
				// otherwise log into an element in the page
				var logElement = document.getElementById('log');
				if (logElement === null) {
					// create a div to log messages to
					logElement = document.createElement('div');
					logElement.setAttribute('id', 'log');
					logElement.style.display = "block";
					document.getElementsByTagName('body')[0].appendChild(logElement);
				}
				var logLine = document.createElement('div');
				logLine.appendChild(document.createTextNode(logMessage));
				logElement.appendChild(logLine);
			}
		}
	}
};
vmf.log.initialize();
