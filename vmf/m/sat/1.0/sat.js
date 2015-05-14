/*
    VMware Service Alert Tool (SAT)
    * load dynamic alerts into any webpage
*/
// TODO move this helper function to another file
vmf.countProperties = function(o) {
    if (o === null) return 0;
    // count the number of properties an object has
    if (o.__count__ !== undefined) {
        // optimization for browsers that support __count__
        return o.__count__;
    }
    var c = 0;
    for (k in o) {
        if (o.hasOwnProperty(k)) {
            c++;
        }
    }
    return c;
};
vmf.sat = function($){
    // calculate MD5 hash of current URL path
    // download JSON file based on MD5 hash and hostname
    // JSON files live on www.vmware.com/alerts/<hostname>/<md5>.js
    // check queryParams
    // find selector
    // load template
    // replace alert template place holders with title and messages
    // insert alert positioned by selector
    return {
        title: "VMware Self Service Alert System",
        root: vmf.hostname+"/sat",
        fetchAlerts: function(options) {
            // fetch the alerts
            // clear local variables
            vmf.sat.alerts = vmf.sat.template = null;
            // create md5 hash from url path
            if ($.md5 !== undefined) {
                // drop index.html from the end of a url to match the backend logic
                var urlHash = $.md5(window.location.pathname.replace(/\index.html$/,''));
                vmf.log.info("SAT: MD5 hash of URL path: "+urlHash);
                // set the fully qualified domain name
                var fqdm = window.location.hostname;
                // rewrite vmware.com to www.vmware.com
                if (fqdm == "vmware.com") { fqdm = "www.vmware.com"; }
                // check preview cookie and adjust root URL
                vmf.sat.preview = ($.cookie('sat') !== null) ? true : false;
                // set the path to fetch the alert from to preview or publish
                var alertPath = "publish";
                if (vmf.sat.preview) {
                    alertPath = "preview";
                }
                var alertURL = vmf.sat.root+"/"+alertPath+"/"+fqdm+"/"+urlHash+".js";
                vmf.log.info("SAT: Request URL: "+alertURL);
                // fetch the alert data
                $.getScriptCache(alertURL, function(response) {
                    // ensure reponse is evaluated
                    if (vmf.sat.alerts == undefined) { eval(response); }
                    if (typeof vmf.sat.alerts != "undefined" && vmf.sat.alerts !== null) {
                        // find alert with best match
                        var alert = vmf.sat.matchAlertQueryString(vmf.sat.alerts);
                        if (alert !== null) {
                            // find elements that match the selector
                            alert.elements = vmf.sat.findSelector(alert.selector);
                            if (alert.elements.length > 0) {
                                vmf.sat.fetchTemplate(alert);
                            } else {
                                vmf.log.error("SAT: no elements found that match an alert selector.");
                            }
                        } else {
                            vmf.log.warning("SAT: no alert found that matches the query string.");
                        }
                    } else {
                        vmf.log.warning("SAT: no alerts found for this url.");
                    }
                });
            }
        },
        loadAlertData: function(object) {
            // TODO validate micro format
            if (typeof object != "undefined" && object !== null) {
                vmf.sat.alerts = object;
            }
        },
        matchAlertQueryString: function(alerts) {
            var alert = null;
            // sort array by number of query string keys
            // therefore the first alert that matches will be the best match
            // NB: this should be optimized to run in the backend to off load the client
            alerts.sort(function(a,b) {
                var al = vmf.countProperties(a["query-string"]);
                var bl = vmf.countProperties(b["query-string"]);
                //vmf.log.debug("SAT: comparing "+al+" with "+bl+".");
                if (al < bl) {
                    return 1;
                } else if (a == b) {
                    return 0;
                } else {
                    return -1;
                }
            });
            // optimization for typical case with no query strings
            if (window.location.search === "") {
                alert = alerts.pop();
                // check if the last alert has query strings to match
                if (vmf.countProperties(alert["query-string"]) > 0) {
                    return null;
                } else {
                    return alert;
                }
            }
            // find the alert that matches the most query strings
            var al = alerts.length;
            for (var i=0; i<al; i++) {
                if (vmf.sat.matchQueryParams(alerts[i]["query-string"])) {
                    alert = alerts[i];
                    break;
                }
            }
            return alert;
        },
        matchQueryParams: function(queryString) {
            // match the query parameters
            if (typeof JSON != "undefined" && typeof JSON.stringify != "undefined") {
                vmf.log.info("SAT: query string: "+JSON.stringify(queryString));
            }
            var allParamsMatched = true;
            // extract the current urls query string in an array of parameters
            // remove the '?' at the beginning
            // and seperate parameters by '&' or ';'
            var liveParams = window.location.search.replace(/^\?/,'').replace('&amp;','&').replace(';','&').split('&');
            $.each(queryString, function(i, val) {
                vmf.log.debug("SAT: query parameter: "+i+"="+val);
                if ($.inArray((i+'='+val), liveParams) == -1) {
                    allParamsMatched = false;
                }
            });
            vmf.log.info("SAT: All query parameters matched? "+(allParamsMatched ? "Yes" : "No"));
            return allParamsMatched;
        },
        findSelector: function(selector) {
            // find the selected dom element
            // return an array of dom elements that match the xpath selector
            vmf.log.info("SAT: selector: "+selector);
            var elements = new Array();
            /* Firefox 3.6 seems to have broken the ANY_TYPE result
             * Changed result type to FIRST_ORDERED_NODE_TYPE, only matches first element
             * which works in IE8, IE7, IE6, FF3, FF2, Chrome3, Chrome4, Safari3, Safari4, and Opera10
             */
            var xpathResult = document.evaluate(selector, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            if (xpathResult !== null && xpathResult.resultType !== undefined) {
                switch (xpathResult.resultType) {
                    case XPathResult.UNORDERED_NODE_ITERATOR_TYPE:
                    case XPathResult.ORDERED_NODE_ITERATOR_TYPE:
                        vmf.log.debug("SAT: xpath result is a node iterator.");
                        // Firefox 3.6 introduced a bug where iterator state is invalid when result type is ANY_TYPE
                        if (!xpathResult.invalidIteratorState) {
                            // TODO: use while loop to support matching multiple elements
                            var elem = xpathResult.iterateNext();
                            if (elem !== null) {
                                elements.push(elem);
                                vmf.log.info("SAT: new element pushed on elements array.");
                            } else {
                                vmf.log.error("SAT: xpath result returned null after iteration.");
                            }
                        } else {
                            vmf.log.error("SAT: xpath result has invalid iterator state.");
                        }
                    break;
                    case XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE:
                    case XPathResult.ORDERED_NODE_SNAPSHOT_TYPE:
                        vmf.log.debug("SAT: xpath result is a node snapshot.");
                        if (xpathResult.snapshotLength) {
                            for ( var i=0; i < xpathResult.snapshotLength; i++) {
                                elements.push(xpathResult.snapshotItem(i));
                                vmf.log.info("SAT: new element pushed on elements array.");
                            }
                        } else {
                            vmf.log.error("SAT: selector could not be found.");
                        }
                    break;
                    case XPathResult.ANY_UNORDERED_NODE_TYPE:
                    case XPathResult.FIRST_ORDERED_NODE_TYPE:
                        vmf.log.debug("SAT: xpath result is a node.");
                        if (xpathResult.singleNodeValue) {
                            elements.push(xpathResult.singleNodeValue);
                            vmf.log.info("SAT: new element pushed on elements array.");
                        } else {
                            vmf.log.error("SAT: selector could not be found.");
                        }
                    break;
                    case XPathResult.ANY_TYPE:
                    case XPathResult.NUMBER_TYPE:
                    case XPathResult.STRING_TYPE:
                    case XPathResult.BOOLEAN_TYPE:
                    default:
                        vmf.log.error("SAT: unsupported xpath result type: "+xpathResult.resultType);
                    break;
                }
            }
            vmf.log.info("SAT: selector: elements found: "+elements.length);
            return elements;
        },
        fetchTemplate: function(options) {
            // load the alert layout template
            var templateURL = vmf.sat.root+"/templates/"+options.template;
            vmf.log.info("SAT: loading template from: "+templateURL);
            $.getScriptCache(templateURL, function(script) {
                // ensure script is executed
                if (vmf.sat.template === undefined) { eval(script); }
                var data = vmf.sat.template;
                vmf.log.debug("SAT: alert template: "+data);
                // replace template place holders with alert messages
                var splitLayout = data.split("<!-- ALERT_WRAPPER -->");
                var alertWrapper = splitLayout[1];
                var alertMessages = new Array();
                vmf.log.debug("SAT: number of alert messages found: "+options.alerts.length);
                $.each(options.alerts, function() {
                    // create final alert content for each alert message
                    var alertContent = alertWrapper;
                    // populate the alert layout template
                    // with the alert title and the alert messages
                    alertContent = alertContent.replace("<!-- ALERT_TITLE -->", this.title);
                    alertContent = alertContent.replace("<!-- ALERT_DESCRIPTION -->", this.description);
                    // links are optional, so check that the object exists
                    if (this.link != undefined && this.link !== null) {
                        // make sure the link title and link href
                        if (this.link.title != undefined && this.link.title !== null && this.link.href != undefined && this.link.href !== null) {
                            alertContent = alertContent.replace("<!-- ALERT_LINK_TITLE -->", this.link.title);
                            alertContent = alertContent.replace("<!-- ALERT_LINK_HREF -->", this.link.href);
                        }
                    }
                    alertMessages.push(alertContent);
                });
                // merge template pieces back together
                splitLayout[1] = alertMessages.join('');
                options.content = splitLayout.join('');
                vmf.log.debug("SAT: alert content: "+options.content);
                // the alert template is ready to be added to the dom
                vmf.sat.addAlert(options);
            });
        },
        loadTemplate: function(string) {
            // TODO validate template placeholders
            if (string !== undefined && string !== null) {
                vmf.sat.template = string;
            }
        },
        addAlert: function(options) {
            // insert the populated alert template by each element found by the selector
            // insert before/after/prepend/append based on alert position
            $.each(options.elements, function() {
                vmf.log.info("SAT: Adding the alerts to the DOM.");
                // make sure the specified position is a valid jQuery function
                if ($.isFunction($()[options.position])) {
                    $(this)[options.position](options.content);
                    $('div.alert-box').slideDown('fast');
                    // show preview banner if in preview mode
                    if (vmf.sat.preview) {
                        vmf.log.info("SAT: showing preview mode banner.");
                        $('div.alert-preview-container').slideDown('fast');
                    }
                } else {
                    vmf.log.error("SAT: "+options.position+"position is not valid.");
                }
            });
        },
        enterPreview: function() {
            // remove the current alerts
            $('div.alert-box').slideUp('fast', function() { $(this).remove(); });
            // create the preview cookie
            $.cookie('sat', '1', {path: '/', domain: '.vmware.com'});
            // fetch preview alerts
            vmf.sat.fetchAlerts();
        },
        exitPreview: function() {
            if (confirm("Are you sure you want to stop previewing future alerts and view the current alerts?")) {
                // destroy preview cookie
                $.cookie('sat', null, {path: '/', domain: '.vmware.com'});
                // remove preview banner and preview alerts
                $('div.alert-preview-container, div.alert-box').remove();
                // fetch published alerts
                vmf.sat.fetchAlerts();
            }
        }
    };
}(jQuery);
