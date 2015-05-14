/**
 * VMF session widget
 * Requires session.css for modal dialog styling.
 * @author Tim Wong (timwong@vmware.com)
 */
vmf.session = function($){

    var _min = -1; // minutes before the session timeout (used in dialog)
    var _wid = -1; // The ID of the warning modal dialog counter
    var _eid = -1; // The ID of the expire modla dialog counter
    var _lid = -1; // The ID of the last ping counter
    var _pid = -1; // The ID of the busy pinging interval counter
    // The configuration object 
    var _c = {
        warningInMin: 15, // i.e., 15 means 5 minutes before the session timeout
        sessionLifeInMin: 20, // 
        warningMsg: "Your session will expire in {0} minute(s).<br/>Please click 'Continue' to refresh your session.",
        expireMsg: "Your session has expired.<br/>Please click the 'Continue' button to login.",
        btnTxt: "Continue",
        sessionCookieName: "JSESSIONID_ACTP",
        checkCookieValue: false, // Support for checking the cookie value to determine whether the user has logged out
        logoutCookieVals: [], // Used with the checkCookieValue flag.  These are the cookie values that show that the user has logged out 
        sessionKeepAliveInMin: -1, // Support for keeping the session alive (longer than the sessionLifeinMin),
        div: "_vmf_session_container"
    };
    
    // Utility function for showing the modal dialog
    var _showDialog = function(){
        vmf.modal.show(_c.div, {
            containerCss: {
                height: '100px',
                width: '300px',
                background: '#fff'
            }
        });
    }
    
    // Utility function for setting the warning dialog content
    var _setWarnModalContent = function(){
    
        // If the checkCookie Value flag is set, check the cookie value to see if the session has expired.
        if (_c.checkCookieValue) {
            var _pass = true;
            var _cookieVal = vmf.cookie.read(_c.sessionCookieName);
            // If the cookie value does not exist, fail.
            if (_cookieVal == null) 
                _pass = false;
            else {
                // If the cookie value exists, and check it against the logoutCookieVals string array
                for (var i = 0; i < _c.logoutCookieVals.length; i++) {
                    if (_cookieVal == _c.logoutCookieVals[i]) 
                        _pass = false;
                }
            }
            // If the session has already expired, just show the expire dialog instead
            if (!_pass) {
                _showExpireModal(true);
                return false;
            }
        }
        
        // Setup the content, and display the dialog
        vmf.dom.setHtml(_c.div, "<p>" + _c.warningMsg.replace("{0}", "<b>" + _min + "</b>") + "</p><div><button>" + _c.btnTxt + "</button></div>");
        
        // Set up the event handler
        vmf.dom.addHandler(vmf.dom.get("#" + _c.div + " button"), "click", function(){
            // ping the servlet
            vmf.ajax.get(_c.servlet);
            // reset the timer
            _initDialogs();
            // hide the modal dialog
            vmf.modal.hide();
        });
        
        // Show the dialog
        _showDialog();
        
    }
    
    /**
     * Display the warning modal dialog
     */
    var _showWarnModal = function(){
        // loads in the modal module (if not existed), then set the modal content and display
        if (vmf.modal) 
            _setWarnModalContent();
        else vmf.loadJs("//www.vmware.com/files/include/module/modal.js", true, _setWarnModalContent);
    }
    
    /**
     * Private functon for showing the expire modal dialog
     * @param {Boolean} toBuildModal - Set to true to show the modal dialog
     */
    var _showExpireModal = function(toBuildModal){
        // Set the expire message
        vmf.dom.setHtml(_c.div, "<p>" + _c.expireMsg + "</p><div><button id='_vmf_cont_btn'>" + _c.btnTxt + "</button></div>");
        // When the user clicks on the 
        vmf.dom.addHandler(vmf.dom.get("#" + _c.div + " button"), "click", function(){
            (_c.redirectUrl) ? window.location = _c.redirectUrl : location.reload();
        });
        // If specified, show the modal dialog (used when the warning modal has not been shown yet)
        if (toBuildModal) 
            _showDialog();
    }
    
    var _initDialogs = function(){
    
        // _min is the number of minutes before the session expires
        _min = _c.sessionLifeInMin - _c.warningInMin;
        
        if (_c.sessionKeepAliveInMin > 0) {
            // If session-keep-alive is enabled,
            // then earning modal dialog shows up in sessionKeepAliveInMin - _min;
            // and the expire modal dialog shows up sessionKeepAliveInMin
            _wid = setTimeout(_showWarnModal, ((_c.sessionKeepAliveInMin - _min) * 60 * 1000));
            _eid = setTimeout(_showExpireModal, (_c.sessionKeepAliveInMin * 60 * 1000));
            // The last ping should take place in (session-keep-alive time minus the session-life-time)
            _ls = ((_c.sessionKeepAliveInMin - _c.sessionLifeInMin) * 60 * 1000);
            
            var keepAliveFor = (_c.sessionKeepAliveInMin - _c.sessionLifeInMin); // the time that we need to the session alive for
            var numOfPings = (Math.ceil(keepAliveFor / _c.sessionLifeInMin) * 2); // the number of pings required to keep the session alive
            var timeInterval = keepAliveFor / numOfPings; // the time interval in (mins) for each ping.
                        
            // Setup the busy pinging 
            _pid = setInterval(function(){
                vmf.ajax.get(_c.servlet);
            }, (timeInterval * 60 * 1000));
            
            // Setup the last ping
            _lid = setTimeout(function(){
                // Clear the interval timer as it is no longer needed after the last ping.
                clearInterval(_pid);
                // Make the last ping to the servlet
                vmf.ajax.get(_c.servlet);
            }, _ls);
            
        }
        else {
            // If session-keep-alive is disabled,
            // then warning modal dialog shows up in warningInMin.
            // and expire modal dialog shows up in sessionLifeInMin.
            _wid = setTimeout(_showWarnModal, (_c.warningInMin * 60 * 1000));
            _eid = setTimeout(_showExpireModal, (_c.sessionLifeInMin * 60 * 1000));
        }
        
    }
    return {
        enableMonitor: function(servlet, config){
        
            // Extend the configuration with (1) the servlet and (2) the user configuration 
            $.extend(_c, {
                servlet: servlet
            }, config);
            
            // Append a hidden div to the document body for showing the modal dialog
            if (!vmf.dom.id(_c.div)) 
                $("<div>").attr('id', _c.div).css("display", "none").appendTo($(document.body));
            
            // Initialize/reset the timer 
            _initDialogs();
            
        },
        disableMonitor: function(){
            clearTimeout(_wid);
            clearTimeout(_eid);
            clearTimeout(_lid);
            clearInterval(_pid);
        },
        resetMonitor: function(){
            _initDialogs();
        },
        isSessionValid: function(){
            return (vmf.cookie.read(_c.sessionCookieName) != null);
        }
    };
}(jQuery);
