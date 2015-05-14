(function($,window){
	var onhashchange, 
		browser = $.browser, 
		mode = document.documentMode,
   		isOldIE = browser.msie && (mode === undefined || mode < 8),
   		nativehashchange = 'onhashchange' in window && !isOldIE;
		delay = 100;
  
 	function getHash( url ) {
		url = url || window.location.href;
		return url.replace( /^[^#]*#?(.*)$/, '$1' );
	};

	$.event.special.hashchange = {
    	setup: function() {
      		if(nativehashchange) { 
				return false; 
			}
      		$(onhashchange.start);
    	},
    	teardown: function() {
      		if(nativehashchange) { 
				return false;
			}
      		$(onhashchange.stop);
    	}
	};
  
  	onhashchange = (function(){
    	var self = {}, timeout, iframe, setHistory, getHistory;
    
    	function init(){
      		setHistory = getHistory = function(val){ return val; };
      		if (isOldIE) {
        		iframe = $('<iframe src="javascript:0"/>').hide().insertAfter('body')[0].contentWindow;
        		getHistory = function() {
          			return getHash(iframe.document.location.href);
        		};
        		setHistory = function(hash, history_hash ) {
          			if(hash !== history_hash) {
            			var doc = iframe.document;
            			doc.open().close();
            			doc.location.hash = '#' + hash;
          			}
        		};
        		setHistory(getHash());
      		}
    	};
    
    	self.start = function() {
      		if(timeout) {
				return; 
			}
      		var last_hash = getHash();

      		setHistory || init();

      		(function onloop(){
        		var hash = getHash(),

          		history_hash = getHistory(last_hash);

        		if(hash !== last_hash) {
          			setHistory(last_hash = hash, history_hash);
          			$(window).trigger('hashchange');
        		} 
				else if (history_hash !== last_hash) {
          			window.location.href = window.location.href.replace( /#.*/, '' ) + '#' + history_hash;
        		}
        		timeout = setTimeout(onloop, delay);
      		})();
    	};
    
    	self.stop = function() {
      		if (!iframe) {
        		timeout && clearTimeout(timeout);
        		timeout = 0;
      		}
    	};

    	return self;
	})();
  
})(jQuery,this);
