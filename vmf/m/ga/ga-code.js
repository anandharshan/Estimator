//***************************************************************************************************
//     Version 2.0 2/17/2011
//	   Authors: Rehan Asif & Allaedin Ezzedin @ E-Nor
//     Script for:
//	   - Mapping vmware src parameter to the Google Analytics Source parameter [utm_source]
//	   - Pushing the country/language to level 1 folders
//	   - Pushing the sub-domains to level 2 folders
//     - Append the search query parameter to the URL that is sent to GA.
//     - Pass the internal campaign information as a parameter with the URL that is sent to Google Analytics.
//***************************************************************************************************

// "q" is the search query parameter used for the main search module in vmware.com
// If this query parameter is changed for any reason, update the code below.
var site_search_term = get_parameter1('q');

// Assign the "SRC" value (if any) to "parameter" & "parameter1"
var parameter = get_parameter1('src');
var parameter1 = get_parameter2('src');


// If the src parameter contains "PaidSearch", then the page will be refreshed with the utm campaign parameters: 
// Source= google or bing | Medium= cpc | Campaign Name= src-tagged-url | Term= <src value> [eg, paidsearch_google_amer-us_view_free_pc_over_ip]

if (parameter != null) {
	if (((parameter1.match(/paidsearch_/))&&(parameter1.match(/google/))) != null) {
		window.location.hash = "utm_source=google&utm_medium=cpc&utm_campaign=src-tagged-url&utm_term=" + parameter;
	}
	else {
		if (((parameter1.match(/paidsearch_/))&&(parameter1.match(/bing/))) != null) {
			window.location.hash = "utm_source=bing&utm_medium=cpc&utm_campaign=src-tagged-url&utm_term=" + parameter;
		}
		else {
			// Internal campaign information 
			if ((parameter1.match(/www_/)) != null) {
				var internal_campaign = parameter;
			}
			else {
				window.location.hash = "utm_source=" + parameter + "&utm_medium=src&utm_campaign=src-tagged-url";
			}
		}
	}
}

function get_parameter1(name)
{
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&#]"+name+"=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.href);
    if( results == null )
      return null;
    else
      return results[1];
}

function get_parameter2(name)
{
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&#]"+name+"=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.href);
    if( results == null )
      return null;
    else
      return results[0];  
}


function constructVirtualPageview() {
	var virtualPageview = "/";
	var hostnameArray = window.location.hostname.split('.');
	var pathnameArray = window.location.pathname.split('/');
	var countries=["ap", "at", "br", "ca", "ch", "cn", "cz", "de", "es", "fr", "fr_be", "it", "jp", "kr", "lasp", "nl", "nl_be", "pl", "ru", "se", "tw", "uk"];
	var canadianLanguages=["en", "fr"];
	var countryIndex = -1;
	var canadaIndex = -1;
	
	// IE8 doesn't support the indexOf function of Javascript arrays.
	// Some details available at https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/IndexOf
	if (!Array.prototype.indexOf) {
		Array.prototype.indexOf = function (obj, start) {
			for (var i = (start || 0); i < this.length; i++) {
      			if (this[i] == obj) {
        			return i;
      				}
    			}
    		return -1;
  			}
		}
	
	// Detect if first part of pathname array is in country array, otherwise default to US.
	if (pathnameArray.length > 1) {
		countryIndex = countries.indexOf(pathnameArray[1]);
		}
	
	if (countryIndex != -1) {
		virtualPageview = virtualPageview + pathnameArray[1];
	
		// If country string is "ca", verify the next portion is "en" or "fr".
		if ((pathnameArray[1] == "ca") && (pathnameArray.length > 2)) {
			canadaIndex = canadianLanguages.indexOf(pathnameArray[2]);
		
			if (canadaIndex != -1) {
				virtualPageview = virtualPageview + "/" + pathnameArray[2];
				}
			}
		}
	else {
		virtualPageview = virtualPageview + "us";
		}
	
	// Detect if first part of hostname array contains www or the array is  2 elements long (no www), otherwise default to first array element.
	if ((hostnameArray[0] == "www") || (hostnameArray.length == 2)) {
		}
	else {
		virtualPageview = virtualPageview + "/" + hostnameArray[0];
		}
	
	// If the pathname includes a country, remove it from the pathname and add the modified pathname to the virtual pageview, otherwise add the pathname directly to the virtual pageview.
	if (countryIndex != -1) {
		modifiedPathname = window.location.pathname;
		modifiedPathname = modifiedPathname.substr(pathnameArray[1].length + 1);
		
		// For Canada, another round to remove extra languages from the pathname.
		if (canadaIndex != -1) {
			modifiedPathname = modifiedPathname.substr(pathnameArray[2].length + 1);
			}
		
		virtualPageview = virtualPageview + modifiedPathname;
		}
	else {
		virtualPageview = virtualPageview + window.location.pathname;
		}
	
	// If last character of virtual pageview is "/", add index.html at the end.
	if (virtualPageview.charAt(virtualPageview.length-1) == "/") {
		virtualPageview = virtualPageview + "index.html";
		}
		
	// If the search parameter [q] appears in the URL, then append the search query parameter to the URL that is sent to GA.
	if (site_search_term != null) {
		virtualPageview = virtualPageview + "?cat=vmware&q=" + site_search_term;
	}
	
	// If the src parameter contains "www_", append the internal campaign information to the URL that is sent to GA
	if (internal_campaign != null) {
		virtualPageview = virtualPageview + "?internal_campaign=" + internal_campaign;
	}
	
	return virtualPageview;
}