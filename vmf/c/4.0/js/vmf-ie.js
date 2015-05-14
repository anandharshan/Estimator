/*
 HTML5 Shiv v3.7.0 | @afarkas @jdalton @jon_neal @rem | MIT/GPL2 Licensed
*/
(function(l,f){function m(){var a=e.elements;return"string"==typeof a?a.split(" "):a}function i(a){var b=n[a[o]];b||(b={},h++,a[o]=h,n[h]=b);return b}function p(a,b,c){b||(b=f);if(g)return b.createElement(a);c||(c=i(b));b=c.cache[a]?c.cache[a].cloneNode():r.test(a)?(c.cache[a]=c.createElem(a)).cloneNode():c.createElem(a);return b.canHaveChildren&&!s.test(a)?c.frag.appendChild(b):b}function t(a,b){if(!b.cache)b.cache={},b.createElem=a.createElement,b.createFrag=a.createDocumentFragment,b.frag=b.createFrag();
a.createElement=function(c){return!e.shivMethods?b.createElem(c):p(c,a,b)};a.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+m().join().replace(/[\w\-]+/g,function(a){b.createElem(a);b.frag.createElement(a);return'c("'+a+'")'})+");return n}")(e,b.frag)}function q(a){a||(a=f);var b=i(a);if(e.shivCSS&&!j&&!b.hasCSS){var c,d=a;c=d.createElement("p");d=d.getElementsByTagName("head")[0]||d.documentElement;c.innerHTML="x<style>article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}</style>";
c=d.insertBefore(c.lastChild,d.firstChild);b.hasCSS=!!c}g||t(a,b);return a}var k=l.html5||{},s=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,r=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,j,o="_html5shiv",h=0,n={},g;(function(){try{var a=f.createElement("a");a.innerHTML="<xyz></xyz>";j="hidden"in a;var b;if(!(b=1==a.childNodes.length)){f.createElement("a");var c=f.createDocumentFragment();b="undefined"==typeof c.cloneNode||
"undefined"==typeof c.createDocumentFragment||"undefined"==typeof c.createElement}g=b}catch(d){g=j=!0}})();var e={elements:k.elements||"abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video",version:"3.7.0",shivCSS:!1!==k.shivCSS,supportsUnknownElements:g,shivMethods:!1!==k.shivMethods,type:"default",shivDocument:q,createElement:p,createDocumentFragment:function(a,b){a||(a=f);
if(g)return a.createDocumentFragment();for(var b=b||i(a),c=b.frag.cloneNode(),d=0,e=m(),h=e.length;d<h;d++)c.createElement(e[d]);return c}};l.html5=e;q(f)})(this,document);
/*
  IE7/IE8/IE9.js - copyright 2004-2010, Dean Edwards
  http://code.google.com/p/ie7-js/
  http://www.opensource.org/licenses/mit-license.php
*/

/* W3C compliance for Microsoft Internet Explorer */

/* credits/thanks:
  Shaggy, Martijn Wargers, Jimmy Cerra, Mark D Anderson,
  Lars Dieckow, Erik Arvidsson, Gell�rt Gyuris, James Denny,
  Unknown W Brackets, Benjamin Westfarer, Rob Eberhardt,
  Bill Edney, Kevin Newman, James Crompton, Matthew Mastracci,
  Doug Wright, Richard York, Kenneth Kolano, MegaZone,
  Thomas Verelst, Mark 'Tarquin' Wilton-Jones, Rainer �hlfors,
  David Zulaica, Ken Kolano, Kevin Newman, Sjoerd Visscher,
  Ingo Chao
*/

// timestamp: Fri, 30 Apr 2010 20:59:18

(function(window, document) {

var IE7 = window.IE7 = {
  version: "2.1(beta4)",
  toString: K("[IE7]")
};
IE7.compat = 9;
var appVersion = IE7.appVersion = navigator.appVersion.match(/MSIE (\d\.\d)/)[1] - 0;

if (/ie7_off/.test(top.location.search) || appVersion < 5.5 || appVersion >= IE7.compat) return;

var MSIE5 = appVersion < 6;

var Undefined = K();
var documentElement = document.documentElement, body, viewport;
var ANON = "!";
var HEADER = ":link{ie7-link:link}:visited{ie7-link:visited}";

// -----------------------------------------------------------------------
// external
// -----------------------------------------------------------------------

var RELATIVE = /^[\w\.]+[^:]*$/;
function makePath(href, path) {
  if (RELATIVE.test(href)) href = (path || "") + href;
  return href;
};

function getPath(href, path) {
  href = makePath(href, path);
  return href.slice(0, href.lastIndexOf("/") + 1);
};

// Get the path to this script
var script = document.scripts[document.scripts.length - 1];
var path = getPath(script.src);

// Use microsoft's http request object to load external files
try {
  var httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
} catch (ex) {
  // ActiveX disabled
}

var fileCache = {};
function loadFile(href, path) {
  try {
    href = makePath(href, path);
    if (!fileCache[href]) {
      httpRequest.open("GET", href, false);
      httpRequest.send();
      if (httpRequest.status == 0 || httpRequest.status == 200) {
        fileCache[href] = httpRequest.responseText;
      }
    }
  } catch (ex) {
    // ignore errors
  }
  return fileCache[href] || "";
};

// -----------------------------------------------------------------------
// OO support
// -----------------------------------------------------------------------


// This is a cut-down version of base2 (http://code.google.com/p/base2/)

var _slice = Array.prototype.slice;

// private
var _FORMAT = /%([1-9])/g;
var _LTRIM = /^\s\s*/;
var _RTRIM = /\s\s*$/;
var _RESCAPE = /([\/()[\]{}|*+-.,^$?\\])/g;           // safe regular expressions
var _BASE = /\bbase\b/;
var _HIDDEN = ["constructor", "toString"];            // only override these when prototyping

var prototyping;

function Base(){};
Base.extend = function(_instance, _static) {
  // Build the prototype.
  prototyping = true;
  var _prototype = new this;
  extend(_prototype, _instance);
  prototyping = false;

  // Create the wrapper for the constructor function.
  var _constructor = _prototype.constructor;
  function klass() {
    // Don't call the constructor function when prototyping.
    if (!prototyping) _constructor.apply(this, arguments);
  };
  _prototype.constructor = klass;

  // Build the static interface.
  klass.extend = arguments.callee;
  extend(klass, _static);
  klass.prototype = _prototype;
  return klass;
};
Base.prototype.extend = function(source) {
  return extend(this, source);
};


// A collection of regular expressions and their associated replacement values.
// A Base class for creating parsers.

var HASH     = "#";
var ITEMS    = "#";
var KEYS     = ".";
var COMPILED = "/";

var REGGRP_BACK_REF        = /\\(\d+)/g,
    REGGRP_ESCAPE_COUNT    = /\[(\\.|[^\]\\])+\]|\\.|\(\?/g,
    REGGRP_PAREN           = /\(/g,
    REGGRP_LOOKUP          = /\$(\d+)/,
    REGGRP_LOOKUP_SIMPLE   = /^\$\d+$/,
    REGGRP_LOOKUPS         = /(\[(\\.|[^\]\\])+\]|\\.|\(\?)|\(/g,
    REGGRP_DICT_ENTRY      = /^<#\w+>$/,
    REGGRP_DICT_ENTRIES    = /<#(\w+)>/g;

var RegGrp = Base.extend({
  constructor: function(values) {
    this[KEYS] = [];
    this[ITEMS] = {};
    this.merge(values);
  },

  //dictionary: null,
  //ignoreCase: false,

  add: function(expression, replacement) {
    delete this[COMPILED];
    if (expression instanceof RegExp) {
      expression = expression.source;
    }
    if (!this[HASH + expression]) this[KEYS].push(String(expression));
    return this[ITEMS][HASH + expression] = new RegGrp.Item(expression, replacement, this);
  },

  compile: function(recompile) {
    if (recompile || !this[COMPILED]) {
      this[COMPILED] = new RegExp(this, this.ignoreCase ? "gi" : "g");
    }
    return this[COMPILED];
  },

  merge: function(values) {
    for (var i in values) this.add(i, values[i]);
  },

  exec: function(string) {
    var group = this,
        patterns = group[KEYS],
        items = group[ITEMS], item;
    var result = this.compile(true).exec(string);
    if (result) {
      // Loop through the RegGrp items.
      var i = 0, offset = 1;
      while ((item = items[HASH + patterns[i++]])) {
        var next = offset + item.length + 1;
        if (result[offset]) { // do we have a result?
          if (item.replacement === 0) {
            return group.exec(string);
          } else {
            var args = result.slice(offset, next), j = args.length;
            while (--j) args[j] = args[j] || ""; // some platforms return null/undefined for non-matching sub-expressions
            args[0] = {match: args[0], item: item};
            return args;
          }
        }
        offset = next;
      }
    }
    return null;
  },

  parse: function(string) {
    string += ""; // type safe
    var group = this,
        patterns = group[KEYS],
        items = group[ITEMS];
    return string.replace(this.compile(), function(match) {
      var args = [], item, offset = 1, i = arguments.length;
      while (--i) args[i] = arguments[i] || ""; // some platforms return null/undefined for non-matching sub-expressions
      // Loop through the RegGrp items.
      while ((item = items[HASH + patterns[i++]])) {
        var next = offset + item.length + 1;
        if (args[offset]) { // do we have a result?
          var replacement = item.replacement;
          switch (typeof replacement) {
            case "function":
              return replacement.apply(group, args.slice(offset, next));
            case "number":
              return args[offset + replacement];
            default:
              return replacement;
          }
        }
        offset = next;
      }
      return match;
    });
  },

  toString: function() {
    var strings = [],
        keys = this[KEYS],
        items = this[ITEMS], item;
    for (var i = 0; item = items[HASH + keys[i]]; i++) {
      strings[i] = item.source;
    }
    return "(" + strings.join(")|(") + ")";
  }
}, {
  IGNORE: null, // a null replacement value means that there is no replacement.

  Item: Base.extend({
    constructor: function(source, replacement, owner) {
      var length = source.indexOf("(") === -1 ? 0 : RegGrp.count(source);

      var dictionary = owner.dictionary;
      if (dictionary && source.indexOf("<#") !== -1) {
        if (REGGRP_DICT_ENTRY.test(source)) {
          var entry = dictionary[ITEMS][HASH + source.slice(2, -1)];
          source = entry.replacement;
          length = entry._length;
        } else {
          source = dictionary.parse(source);
        }
      }

      if (typeof replacement == "number") replacement = String(replacement);
      else if (replacement == null) replacement = 0;

      // Does the expression use sub-expression lookups?
      if (typeof replacement == "string" && REGGRP_LOOKUP.test(replacement)) {
        if (REGGRP_LOOKUP_SIMPLE.test(replacement)) { // A simple lookup? (e.g. "$2").
          // Store the index (used for fast retrieval of matched strings).
          var index = replacement.slice(1) - 0;
          if (index && index <= length) replacement = index;
        } else {
          // A complicated lookup (e.g. "Hello $2 $1.").
          var lookup = replacement, regexp;
          replacement = function(match) {
            if (!regexp) {
              regexp = new RegExp(source, "g" + (this.ignoreCase ? "i": ""));
            }
            return match.replace(regexp, lookup);
          };
        }
      }

      this.length = length;
      this.source = String(source);
      this.replacement = replacement;
    }
  }),

  count: function(expression) {
    return (String(expression).replace(REGGRP_ESCAPE_COUNT, "").match(REGGRP_PAREN) || "").length;
  }
});

var Dictionary = RegGrp.extend({
  parse: function(phrase) {
    // Prevent sub-expressions in dictionary entries from capturing.
    var entries = this[ITEMS];
    return phrase.replace(REGGRP_DICT_ENTRIES, function(match, entry) {
      entry = entries[HASH + entry];
      return entry ? entry._nonCapturing : match;
    });
  },

  add: function(expression, replacement) {
    // Get the underlying replacement value.
    if (replacement instanceof RegExp) {
      replacement = replacement.source;
    }
    // Translate the replacement.
    // The result is the original replacement recursively parsed by this dictionary.
    var nonCapturing = replacement.replace(REGGRP_LOOKUPS, _nonCapture);
    if (replacement.indexOf("(") !== -1) {
      var realLength = RegGrp.count(replacement);
    }
    if (replacement.indexOf("<#") !== -1) {
      replacement = this.parse(replacement);
      nonCapturing = this.parse(nonCapturing);
    }
    var item = this.base(expression, replacement);
    item._nonCapturing = nonCapturing;
    item._length = realLength || item.length; // underlying number of sub-groups
    return item;
  },

  toString: function() {
    return "(<#" + this[PATTERNS].join(">)|(<#") + ">)";
  }
});

function _nonCapture(match, escaped) {
  return escaped || "(?:"; // non-capturing
};

// =========================================================================
// lang/extend.js
// =========================================================================

function extend(object, source) { // or extend(object, key, value)
  if (object && source) {
    var proto = (typeof source == "function" ? Function : Object).prototype;
    // Add constructor, toString etc
    var i = _HIDDEN.length, key;
    if (prototyping) while (key = _HIDDEN[--i]) {
      var value = source[key];
      if (value != proto[key]) {
        if (_BASE.test(value)) {
          _override(object, key, value)
        } else {
          object[key] = value;
        }
      }
    }
    // Copy each of the source object's properties to the target object.
    for (key in source) if (typeof proto[key] == "undefined") {
      var value = source[key];
      // Check for method overriding.
      if (object[key] && typeof value == "function" && _BASE.test(value)) {
        _override(object, key, value);
      } else {
        object[key] = value;
      }
    }
  }
  return object;
};

function _override(object, name, method) {
  // Override an existing method.
  var ancestor = object[name];
  object[name] = function() {
    var previous = this.base;
    this.base = ancestor;
    var returnValue = method.apply(this, arguments);
    this.base = previous;
    return returnValue;
  };
};

function combine(keys, values) {
  // Combine two arrays to make a hash.
  if (!values) values = keys;
  var hash = {};
  for (var i in keys) hash[i] = values[i];
  return hash;
};

function format(string) {
  // Replace %n with arguments[n].
  // e.g. format("%1 %2%3 %2a %1%3", "she", "se", "lls");
  // ==> "she sells sea shells"
  // Only %1 - %9 supported.
  var args = arguments;
  var _FORMAT = new RegExp("%([1-" + arguments.length + "])", "g");
  return String(string).replace(_FORMAT, function(match, index) {
    return index < args.length ? args[index] : match;
  });
};

function match(string, expression) {
  // Same as String.match() except that this function will return an empty
  // array if there is no match.
  return String(string).match(expression) || [];
};

function rescape(string) {
  // Make a string safe for creating a RegExp.
  return String(string).replace(_RESCAPE, "\\$1");
};

// http://blog.stevenlevithan.com/archives/faster-trim-javascript
function trim(string) {
  return String(string).replace(_LTRIM, "").replace(_RTRIM, "");
};

function K(k) {
  return function() {
    return k;
  };
};

// -----------------------------------------------------------------------
// parsing
// -----------------------------------------------------------------------

var Parser = RegGrp.extend({ignoreCase: true});

var SINGLE_QUOTES       = /'/g,
    ESCAPED             = /'(\d+)'/g,
    ESCAPE              = /\\/g,
    UNESCAPE            = /\\([nrtf'"])/g;

var strings = [];

var encoder = new Parser({
  // comments
  "<!\\-\\-|\\-\\->": "",
  "\\/\\*[^*]*\\*+([^\\/][^*]*\\*+)*\\/": "",
  // get rid
  "@(namespace|import)[^;\\n]+[;\\n]": "",
  // strings
  "'(\\\\.|[^'\\\\])*'": encodeString,
  '"(\\\\.|[^"\\\\])*"': encodeString,
  // white space
  "\\s+": " "
});

function encode(selector) {
  return encoder.parse(selector).replace(UNESCAPE, "$1");
};

function decode(query) {
  // put string values back
  return query.replace(ESCAPED, decodeString);
};

function encodeString(string) {
  var index = strings.length;
  strings[index] = string.slice(1, -1)
    .replace(UNESCAPE, "$1")
    .replace(SINGLE_QUOTES, "\\'");
  return "'" + index + "'";
};

function decodeString(match, index) {
  var string = strings[index];
  if (string == null) return match;
  return "'" + strings[index] + "'";
};

function getString(value) {
  return value.indexOf("'") === 0 ? strings[value.slice(1, - 1)] : value;
};

// clone a "width" function to create a "height" function
var rotater = new RegGrp({
  Width: "Height",
  width: "height",
  Left:  "Top",
  left:  "top",
  Right: "Bottom",
  right: "bottom",
  onX:   "onY"
});

function rotate(fn) {
  return rotater.parse(fn);
};

// -----------------------------------------------------------------------
// event handling
// -----------------------------------------------------------------------

var eventHandlers = [];

function addResize(handler) {
  addRecalc(handler);
  addEventHandler(window, "onresize", handler);
};

// add an event handler (function) to an element
function addEventHandler(element, type, handler) {
  element.attachEvent(type, handler);
  // store the handler so it can be detached later
  eventHandlers.push(arguments);
};

// remove an event handler assigned to an element by IE7
function removeEventHandler(element, type, handler) {
  try {
    element.detachEvent(type, handler);
  } catch (ex) {
    // write a letter of complaint to microsoft..
  }
};

// remove event handlers (they eat memory)
addEventHandler(window, "onunload", function() {
  var handler;
  while (handler = eventHandlers.pop()) {
    removeEventHandler(handler[0], handler[1], handler[2]);
  }
});

function register(handler, element, condition) { // -@DRE
  //var set = handler[element.uniqueID];
  if (!handler.elements) handler.elements = {};
  if (condition) handler.elements[element.uniqueID] = element;
  else delete handler.elements[element.uniqueID];
  //return !set && condition;
  return condition;
};

addEventHandler(window, "onbeforeprint", function() {
  if (!IE7.CSS.print) new StyleSheet("print");
  IE7.CSS.print.recalc();
});

// -----------------------------------------------------------------------
// pixel conversion
// -----------------------------------------------------------------------

// this is handy because it means that web developers can mix and match
//  measurement units in their style sheets. it is not uncommon to
//  express something like padding in "em" units whilst border thickness
//  is most often expressed in pixels.

var PIXEL = /^\d+(px)?$/i;
var PERCENT = /^\d+%$/;
var getPixelValue = function(element, value) {
  if (PIXEL.test(value)) return parseInt(value);
  var style = element.style.left;
  var runtimeStyle = element.runtimeStyle.left;
  element.runtimeStyle.left = element.currentStyle.left;
  element.style.left = value || 0;
  value = element.style.pixelLeft;
  element.style.left = style;
  element.runtimeStyle.left = runtimeStyle;
  return value;
};

// -----------------------------------------------------------------------
// generic
// -----------------------------------------------------------------------

var $IE7 = "ie7-";

var Fix = Base.extend({
  constructor: function() {
    this.fixes = [];
    this.recalcs = [];
  },
  init: Undefined
});

// a store for functions that will be called when refreshing IE7
var recalcs = [];
function addRecalc(recalc) {
  recalcs.push(recalc);
};

IE7.recalc = function() {
  IE7.HTML.recalc();
  // re-apply style sheet rules (re-calculate ie7 classes)
  IE7.CSS.recalc();
  // apply global fixes to the document
  for (var i = 0; i < recalcs.length; i++) recalcs[i]();
};

function isFixed(element) {
  return element.currentStyle["ie7-position"] == "fixed";
};

// original style
function getDefinedStyle(element, propertyName) {
  return element.currentStyle[$IE7 + propertyName] || element.currentStyle[propertyName];
};

function setOverrideStyle(element, propertyName, value) {
  if (element.currentStyle[$IE7 + propertyName] == null) {
    element.runtimeStyle[$IE7 + propertyName] = element.currentStyle[propertyName];
  }
  element.runtimeStyle[propertyName] = value;
};

// Create a temporary element which is used to inherit styles
// from the target element.
function createTempElement(tagName) {
  var element = document.createElement(tagName || "object");
  element.style.cssText = "position:absolute;padding:0;display:block;border:none;clip:rect(0 0 0 0);left:-9999";
  element.ie7_anon = true;
  return element;
};


// =========================================================================
// ie7-css.js
// =========================================================================

var NEXT_SIBLING        = "(e.nextSibling&&IE7._getElementSibling(e,'next'))",
    PREVIOUS_SIBLING    = NEXT_SIBLING.replace(/next/g, "previous"),
    IS_ELEMENT          = "e.nodeName>'@'",
    IF_ELEMENT          = "if(" + IS_ELEMENT + "){";

var ID_ATTRIBUTE  = "(e.nodeName==='FORM'?IE7._getAttribute(e,'id'):e.id)";

var HYPERLINK = /a(#[\w-]+)?(\.[\w-]+)?:(hover|active)/i;
var FIRST_LINE_LETTER = /(.*)(:first-(line|letter))/;
var SPACE = /\s/;
var RULE = /((?:\\.|[^{\\])+)\{((?:\\.|[^}\\])+)\}/g;
var SELECTOR = /(?:\\.|[^,\\])+/g;

var styleSheets = document.styleSheets;

var inheritedProperties = [];

IE7.CSS = new (Fix.extend({ // single instance
  parser: new Parser,
  screen: "",
  print: "",
  styles: [],
  rules: [],
  pseudoClasses: appVersion < 7 ? "first\\-child" : "",
  dynamicPseudoClasses: {
    toString: function() {
      var strings = [];
      for (var pseudoClass in this) strings.push(pseudoClass);
      return strings.join("|");
    }
  },
  
  init: function() {
    var NONE = "^\x01$";
    var CLASS = "\\[class=?[^\\]]*\\]";
    var pseudoClasses = [];
    if (this.pseudoClasses) pseudoClasses.push(this.pseudoClasses);
    var dynamicPseudoClasses = this.dynamicPseudoClasses.toString(); 
    if (dynamicPseudoClasses) pseudoClasses.push(dynamicPseudoClasses);
    pseudoClasses = pseudoClasses.join("|");
    var unknown = appVersion < 7 ? ["[>+~\\[(]|([:.])[\\w-]+\\1"] : [CLASS];
    if (pseudoClasses) unknown.push(":(" + pseudoClasses + ")");
    this.UNKNOWN = new RegExp(unknown.join("|") || NONE, "i");
    var complex = appVersion < 7 ? ["\\[[^\\]]+\\]|[^\\s(\\[]+\\s*[+~]"] : [CLASS];
    var complexRule = complex.concat();
    if (pseudoClasses) complexRule.push(":(" + pseudoClasses + ")");
    Rule.COMPLEX = new RegExp(complexRule.join("|") || NONE, "ig");
    if (this.pseudoClasses) complex.push(":(" + this.pseudoClasses + ")");
    DynamicRule.COMPLEX = new RegExp(complex.join("|") || NONE, "i");
    dynamicPseudoClasses = "not\\(:" + dynamicPseudoClasses.split("|").join("\\)|not\\(:") + "\\)|" + dynamicPseudoClasses;
    DynamicRule.MATCH = new RegExp(dynamicPseudoClasses ? "(.*?):(" + dynamicPseudoClasses + ")(.*)" : NONE, "i");
    
    this.createStyleSheet();
    this.refresh();
  },
  
	addEventHandler: function() {
		addEventHandler.apply(null, arguments);
	},
  
  addFix: function(expression, replacement) {
    this.parser.add(expression, replacement);
  },
  
  addRecalc: function(propertyName, test, handler, replacement) {
    // recalcs occur whenever the document is refreshed using document.recalc()
    propertyName = propertyName.source || propertyName;
    test = new RegExp("([{;\\s])" + propertyName + "\\s*:\\s*" + test + "[^;}]*");
    var id = this.recalcs.length;
    if (typeof replacement == "string") replacement = propertyName + ":" + replacement;
    this.addFix(test, function(match) {
      if (typeof replacement == "function") replacement = replacement(match);
      return (replacement ? replacement : match) + ";ie7-" + match.slice(1) + ";ie7_recalc" + id + ":1";
    });
    this.recalcs.push(arguments);
    return id;
  },
  
  apply: function() {
    this.getInlineCSS();
    new StyleSheet("screen");
    this.trash();
  },
  
  createStyleSheet: function() {
    // create the IE7 style sheet
    document.getElementsByTagName("head")[0].appendChild(document.createElement("style"));
    this.styleSheet = styleSheets[styleSheets.length - 1];
    // flag it so we can ignore it during parsing
    this.styleSheet.ie7 = true;
    this.styleSheet.owningElement.ie7 = true;
    this.styleSheet.cssText = HEADER;
  },
  
  getInlineCSS: function() {// load inline styles
    var styleSheets = document.getElementsByTagName("style"), styleSheet;
    for (var i = styleSheets.length - 1; styleSheet = styleSheets[i]; i--) {
      if (!styleSheet.disabled && !styleSheet.ie7) {
        styleSheet._cssText = styleSheet.innerHTML;
      }
    }
  },
  
  getText: function(styleSheet, path) {
    // Internet Explorer will trash unknown selectors (it converts them to "UNKNOWN").
    // So we must reload external style sheets (internal style sheets can have their text
    // extracted through the innerHTML property).

    // load the style sheet text from an external file
    try {
      var cssText = styleSheet.cssText;
    } catch (e) {
      cssText = "";
    }
    if (httpRequest) cssText = loadFile(styleSheet.href, path) || cssText;
    return cssText;
  },
  
  recalc: function() {
    this.screen.recalc();
    // we're going to read through all style rules.
    //  certain rules have had ie7 properties added to them.
    //   e.g. p{top:0; ie7_recalc2:1; left:0}
    //  this flags a property in the rule as needing a fix.
    //  the selector text is then used to query the document.
    //  we can then loop through the results of the query
    //  and fix the elements.
    // we ignore the IE7 rules - so count them in the header
    var RECALCS = /ie7_recalc\d+/g;
    var start = HEADER.match(/[{,]/g).length;
    // only calculate screen fixes. print fixes don't show up anyway
    var rules = this.styleSheet.rules, rule;
    var calcs, calc, elements, element, i, j, k, id;
    // loop through all rules
    for (i = start; rule = rules[i]; i++) {
      var cssText = rule.style.cssText;
      // search for the "ie7_recalc" flag (there may be more than one)
      if (calcs = cssText.match(RECALCS)) {
        // use the selector text to query the document
        elements = cssQuery(rule.selectorText);
        // if there are matching elements then loop
        //  through the recalc functions and apply them
        //  to each element
        if (elements.length) for (j = 0; j < calcs.length; j++) {
          // get the matching flag (e.g. ie7_recalc3)
          id = calcs[j];
          // extract the numeric id from the end of the flag
          //  and use it to index the collection of recalc
          //  functions
          calc = IE7.CSS.recalcs[id.slice(10)][2];
          for (k = 0; (element = elements[k]); k++) {
            // apply the fix
            if (element.currentStyle[id]) calc(element, cssText);
          }
        }
      }
    }
  },
  
  refresh: function() {
    this.styleSheet.cssText = HEADER + this.screen + this.print;
  },
  
  trash: function() {
    // trash the old style sheets
    for (var i = 0; i < styleSheets.length; i++) {
      if (!styleSheets[i].ie7) {
        try {
          var cssText = styleSheets[i].cssText;
        } catch (e) {
          cssText = "";
        }
        if (cssText) styleSheets[i].cssText = "";
      }
    }
  }
}));

// -----------------------------------------------------------------------
//  IE7 StyleSheet class
// -----------------------------------------------------------------------

var StyleSheet = Base.extend({
  constructor: function(media) {
    this.media = media;
    this.load();
    IE7.CSS[media] = this;
    IE7.CSS.refresh();
  },
  
  createRule: function(selector, cssText) {
    var match;
    if (PseudoElement && (match = selector.match(PseudoElement.MATCH))) {
      return new PseudoElement(match[1], match[2], cssText);
    } else if (match = selector.match(DynamicRule.MATCH)) {
      if (!HYPERLINK.test(match[0]) || DynamicRule.COMPLEX.test(match[0])) {
        return new DynamicRule(selector, match[1], match[2], match[3], cssText);
      }
    } else {
      return new Rule(selector, cssText);
    }
    return selector + " {" + cssText + "}";
  },
  
  getText: function() {
    // store for style sheet text
    // parse media decalarations
    var MEDIA        = /@media\s+([^{]+?)\s*\{([^@]+\})\s*\}/gi;
    var IMPORTS      = /@import[^;\n]+/gi;
    var TRIM_IMPORTS = /@import\s+url\s*\(\s*["']?|["']?\s*\)\s*/gi;
    var URL          = /(url\s*\(\s*['"]?)([\w\.]+[^:\)]*['"]?\))/gi;

    var self = this;
    
    // Store loaded cssText URLs
    var fileCache = {};
    
    function getCSSText(styleSheet, path, media, level) {
      var cssText = "";
      if (!level) {
        media = toSimpleMedia(styleSheet.media);
        level = 0;
      }
      if (media === "none") {
        styleSheet.disabled = true;
        return "";
      }
      if (media === "all" || media === self.media) {
        // IE only allows importing style sheets three levels deep.
        // it will crash if you try to access a level below this
        try {
          var canAcess = !!styleSheet.cssText;
        } catch (exe) {}
        if (level < 3 && canAcess) {
          var hrefs = styleSheet.cssText.match(IMPORTS);
          // loop through imported style sheets
          for (var i = 0, imported; i < styleSheet.imports.length; i++) {
            var imported = styleSheet.imports[i];
            var href = styleSheet._href || styleSheet.href;
            imported._href = hrefs[i].replace(TRIM_IMPORTS, "");
            // call this function recursively to get all imported style sheets
            cssText += getCSSText(imported, getPath(href, path), media, level + 1);
          }
        }
        // retrieve inline style or load an external style sheet
        cssText += encode(styleSheet.href ? loadStyleSheet(styleSheet, path) : styleSheet.owningElement._cssText);
        cssText = parseMedia(cssText, self.media);
      }
      return cssText;
    };

    // Load all style sheets in the document
    for (var i = 0; i < styleSheets.length; i++) {
      var styleSheet = styleSheets[i];
      if (!styleSheet.disabled && !styleSheet.ie7) this.cssText += getCSSText(styleSheet);
    }
    
    // helper functions
    function parseMedia(cssText, media) {
      filterMedia.value = media;
      return cssText.replace(MEDIA, filterMedia);
    };
    
    function filterMedia(match, media, cssText) {
      media = toSimpleMedia(media);
      switch (media) {
        case "screen":
        case "print":
          if (media !== filterMedia.value) return "";
        case "all":
          return cssText;
      }
      return "";
    };
    
    function toSimpleMedia(media) {
      if (!media) return "all";
      var split = media.toLowerCase().split(/\s*,\s*/);
      media = "none";
      for (var i = 0; i < split.length; i++) {
        if (split[i] === "all") return "all";
        if (split[i] === "screen") {
          if (media === "print") return "all";
          media = "screen";
        } else if (split[i] === "print") {
          if (media === "screen") return "all";
          media = "print";
        }
      }
      return media;
    };
    
    // Load an external style sheet
    function loadStyleSheet(styleSheet, path) {
      var href = styleSheet._href || styleSheet.href;
      var url = makePath(href, path);
      // If the style sheet has already loaded then don't reload it
      if (fileCache[url]) return "";
      // Load from source
      fileCache[url] = styleSheet.disabled ? "" :
        fixUrls(IE7.CSS.getText(styleSheet, path), getPath(href, path));
      return fileCache[url];
    };

    // Fix CSS paths.
    // We're lumping all css text into one big style sheet so relative
    // paths have to be fixed. This is necessary anyway because of other
    // Internet Explorer bugs.
    function fixUrls(cssText, pathname) {
      // hack & slash
      return cssText.replace(URL, "$1" + pathname.slice(0, pathname.lastIndexOf("/") + 1) + "$2");
    };
  },
  
  load: function() {
    this.cssText = "";
    this.getText();
    this.parse();
    if (inheritedProperties.length) {
      this.cssText = parseInherited(this.cssText);
    }
    this.cssText = decode(this.cssText);
    fileCache = {};
  },
  
  parse: function() {
    var cssText = IE7.CSS.parser.parse(this.cssText);
    
    var declarations = "";
    this.cssText = cssText.replace(/@charset[^;]+;|@font\-face[^\}]+\}/g, function(match) {
      declarations += match + "\n";
      return "";
    });
    this.declarations = decode(declarations);
    
    // Parse the style sheet
    var offset = IE7.CSS.rules.length;
    var rules = [], rule;
    while ((rule = RULE.exec(this.cssText))) {
      var cssText = rule[2];
      if (cssText) {
        var fixDescendants = appVersion < 7 && cssText.indexOf("AlphaImageLoader") !== -1;
        var selectors = rule[1].match(SELECTOR), selector;
        for (var i = 0; selector = selectors[i]; i++) {
          selector = trim(selector);
          var isUnknown = IE7.CSS.UNKNOWN.test(selector);
          selectors[i] = isUnknown ? this.createRule(selector, cssText) : selector + "{" + cssText + "}";
          if (fixDescendants) selectors[i] += this.createRule(selector + ">*", "position:relative");
        }
        rules.push(selectors.join("\n"));
      }
    }
    this.cssText = rules.join("\n");
    this.rules = IE7.CSS.rules.slice(offset);
  },
  
  recalc: function() {
    var rule, i;
    for (i = 0; (rule = this.rules[i]); i++) rule.recalc();
  },
  
  toString: function() {
    return this.declarations + "@media " + this.media + "{" + this.cssText + "}";
  }
});

var PseudoElement;

// -----------------------------------------------------------------------
// IE7 style rules
// -----------------------------------------------------------------------

var Rule = IE7.Rule = Base.extend({
  constructor: function(selector, cssText) {
    this.id = IE7.CSS.rules.length;
    this.className = Rule.PREFIX + this.id;
    var pseudoElement = selector.match(FIRST_LINE_LETTER);
    this.selector = (pseudoElement ? pseudoElement[1] : selector) || "*";
    this.selectorText = this.parse(this.selector) + (pseudoElement ? pseudoElement[2] : "");
    this.cssText = cssText;
    this.MATCH = new RegExp("\\s" + this.className + "(\\s|$)", "g");
    IE7.CSS.rules.push(this);
    this.init();
  },
  
  init: Undefined,
  
  add: function(element) {
    // allocate this class
    element.className += " " + this.className;
  },
  
  recalc: function() {
    // execute the underlying css query for this class
    var match = cssQuery(this.selector);
    // add the class name for all matching elements
    for (var i = 0; i < match.length; i++) this.add(match[i]);
  },

  parse: function(selector) {
    // attempt to preserve specificity for "loose" parsing by
    //  removing unknown tokens from a css selector but keep as
    //  much as we can..
    var simple = selector.replace(Rule.CHILD, " ").replace(Rule.COMPLEX, "");
    if (appVersion < 7) simple = simple.replace(Rule.MULTI, "");
    var tags = match(simple, Rule.TAGS).length - match(selector, Rule.TAGS).length;
    var classes = match(simple, Rule.CLASSES).length - match(selector, Rule.CLASSES).length + 1;
    while (classes > 0 && Rule.CLASS.test(simple)) {
      simple = simple.replace(Rule.CLASS, "");
      classes--;
    }
    while (tags > 0 && Rule.TAG.test(simple)) {
      simple = simple.replace(Rule.TAG, "$1*");
      tags--;
    }
    simple += "." + this.className;
    classes = Math.min(classes, 2);
    tags = Math.min(tags, 2);
    var score = -10 * classes - tags;
    if (score > 0) {
      simple = simple + "," + Rule.MAP[score] + " " + simple;
    }
    return simple;
  },
  
  remove: function(element) {
    // deallocate this class
    element.className = element.className.replace(this.MATCH, "$1");
  },
  
  toString: function() {
    return format("%1 {%2}", this.selectorText, this.cssText);
  }
}, {
  CHILD: />/g,
  CLASS: /\.[\w-]+/,
  CLASSES: /[.:\[]/g,
  MULTI: /(\.[\w-]+)+/g,
  PREFIX: "ie7_class",
  TAG: /^\w+|([\s>+~])\w+/,
  TAGS: /^\w|[\s>+~]\w/g,
  MAP: {
    "1":  "html",
    "2":  "html body",
    "10": ".ie7_html",
    "11": "html.ie7_html",
    "12": "html.ie7_html body",
    "20": ".ie7_html .ie7_body",
    "21": "html.ie7_html .ie7_body",
    "22": "html.ie7_html body.ie7_body"
  }
});

// -----------------------------------------------------------------------
// IE7 dynamic style
// -----------------------------------------------------------------------

// object properties:
// attach: the element that an event handler will be attached to
// target: the element that will have the IE7 class applied

var DynamicRule = Rule.extend({
  // properties
  constructor: function(selector, attach, dynamicPseudoClass, target, cssText) {
    this.negated = dynamicPseudoClass.indexOf("not") === 0;
    if (this.negated) dynamicPseudoClass = dynamicPseudoClass.slice(5, -1);
    // initialise object properties
    this.attach = attach || "*";
    this.dynamicPseudoClass = IE7.CSS.dynamicPseudoClasses[dynamicPseudoClass];
    this.target = target;
    this.base(selector, cssText);
  },
  
  recalc: function() {
    // execute the underlying css query for this class
    var attaches = cssQuery(this.attach), attach;
    // process results
    for (var i = 0; attach = attaches[i]; i++) {
      // retrieve the event handler's target element(s)
      var target = this.target ? cssQuery(this.target, attach) : [attach];
      // attach event handlers for dynamic pseudo-classes
      if (target.length) this.dynamicPseudoClass.apply(attach, target, this);
    }
  }
});

// -----------------------------------------------------------------------
//  IE7 dynamic pseudo-classes
// -----------------------------------------------------------------------

var DynamicPseudoClass = Base.extend({
  constructor: function(name, apply) {
    this.name = name;
    this.apply = apply;
    this.instances = {};
    IE7.CSS.dynamicPseudoClasses[name] = this;
  },
  
  register: function(instance, negated) {
    // an "instance" is actually an Arguments object
    var _class = instance[2];
    if (!negated && _class.negated) {
      this.unregister(instance, true);
    } else {
      instance.id = _class.id + instance[0].uniqueID;
      if (!this.instances[instance.id]) {
        var target = instance[1], j;
        for (j = 0; j < target.length; j++) _class.add(target[j]);
        this.instances[instance.id] = instance;
      }
    }
  },
  
  unregister: function(instance, negated) {
    var _class = instance[2];
    if (!negated && _class.negated) {
      this.register(instance, true);
    } else {
      if (this.instances[instance.id]) {
        var target = instance[1], j;
        for (j = 0; j < target.length; j++) _class.remove(target[j]);
        delete this.instances[instance.id];
      }
    }
  }
});
  
// -----------------------------------------------------------------------
// dynamic pseudo-classes
// -----------------------------------------------------------------------

var Hover = new DynamicPseudoClass("hover", function(element) {
  var instance = arguments;
  IE7.CSS.addEventHandler(element, "onmouseenter", function() {
    Hover.register(instance);
  });
  IE7.CSS.addEventHandler(element, "onmouseleave", function() {
    Hover.unregister(instance);
  });
});

// globally trap the mouseup event (thanks Martijn!)
addEventHandler(document, "onmouseup", function() {
  var instances = Hover.instances;
  for (var i in instances)
    if (!instances[i][0].contains(event.srcElement))
      Hover.unregister(instances[i]);
});

var ATTR = {
  "=":  "%1==='%2'",                           // "[@%1='%2']"
  "~=": "(' '+%1+' ').indexOf(' %2 ')!==-1",   // "[contains(concat(' ',@%1,' '),' %2 ')]",
  "|=": "%1==='%2'||%1.indexOf('%2-')===0",    // "[@%1='%2' or starts-with(@%1,'%2-')]",
  "^=": "%1.indexOf('%2')===0",                // "[starts-with(@%1,'%2')]",
  "$=": "%1.slice(-'%2'.length)==='%2'",       // "[ends-with(@%1,'%2')]",
  "*=": "%1.indexOf('%2')!==-1"                // "[contains(@%1,'%2')]"
};
ATTR[""] = "%1!=null";                         // "[@%1]"

var FILTER = {
  "<#attr>": function(match, name, operator, value) {
    var attr = "IE7._getAttribute(e,'" + name + "')";
    value = getString(value);
    if (operator.length > 1) {
      if (!value || operator === "~=" && SPACE.test(value)) {
        return "false&&";
      }
      attr = "(" + attr + "||'')";
    }
    return "(" + format(ATTR[operator], attr, value) + ")&&";
  },

  "<#id>":    ID_ATTRIBUTE + "==='$1'&&",

  "<#class>": "e.className&&(' '+e.className+' ').indexOf(' $1 ')!==-1&&",

  // PSEDUO
  ":first-child":     "!" + PREVIOUS_SIBLING + "&&",
  ":link":           "e.currentStyle['ie7-link']=='link'&&",
  ":visited":        "e.currentStyle['ie7-link']=='visited'&&"
};

// =========================================================================
// ie7-html.js
// =========================================================================

// default font-sizes
//HEADER += "h1{font-size:2em}h2{font-size:1.5em;}h3{font-size:1.17em;}h4{font-size:1em}h5{font-size:.83em}h6{font-size:.67em}";

IE7.HTML = new (Fix.extend({ // single instance  
  fixed: {},
  
  init: Undefined,
  
  addFix: function() {
    // fixes are a one-off, they are applied when the document is loaded
    this.fixes.push(arguments);
  },
  
  apply: function() {
    for (var i = 0; i < this.fixes.length; i++) {
      var match = cssQuery(this.fixes[i][0]);
      var fix = this.fixes[i][1];
      for (var j = 0; j < match.length; j++) fix(match[j]);
    }
  },
  
  addRecalc: function() {
    // recalcs occur whenever the document is refreshed using document.recalc()
    this.recalcs.push(arguments);
  },
  
  recalc: function() {
    // loop through the fixes
    for (var i = 0; i < this.recalcs.length; i++) {
      var match = cssQuery(this.recalcs[i][0]);
      var recalc = this.recalcs[i][1], element;
      var key = Math.pow(2, i);
      for (var j = 0; (element = match[j]); j++) {
        var uniqueID = element.uniqueID;
        if ((this.fixed[uniqueID] & key) === 0) {
          element = recalc(element) || element;
          this.fixed[uniqueID] |= key;
        }
      }
    }
  }
}));

if (appVersion < 7) {  
  // provide support for the <abbr> tag.
  document.createElement("abbr");
  
  // bind to the first child control
  IE7.HTML.addRecalc("label", function(label) {
    if (!label.htmlFor) {
      var firstChildControl = cssQuery("input,textarea", label, true);
      if (firstChildControl) {
        addEventHandler(label, "onclick", function() {
          firstChildControl.click();
        });
      }
    }
  });
}

// =========================================================================
// ie7-layout.js
// =========================================================================

var NUMERIC = "[.\\d]";

(function() {
  var layout = IE7.Layout = {};

  // big, ugly box-model hack + min/max stuff

  // #tantek > #erik > #dean { voice-family: hacker; }

  // -----------------------------------------------------------------------
  // "layout"
  // -----------------------------------------------------------------------

  HEADER += "*{boxSizing:content-box}";

  // give an element "layout"
  layout.boxSizing = function(element) {
    if (!element.currentStyle.hasLayout) {
    //#  element.runtimeStyle.fixedHeight =
      element.style.height = "0cm";
      if (element.currentStyle.verticalAlign === "auto")
        element.runtimeStyle.verticalAlign = "top";
      // when an element acquires "layout", margins no longer collapse correctly
      collapseMargins(element);
    }
  };

  // -----------------------------------------------------------------------
  // Margin Collapse
  // -----------------------------------------------------------------------

  function collapseMargins(element) {
    if (element != viewport && element.currentStyle.position !== "absolute") {
      collapseMargin(element, "marginTop");
      collapseMargin(element, "marginBottom");
    }
  };

  function collapseMargin(element, type) {
    if (!element.runtimeStyle[type]) {
      var parentElement = element.parentElement;
      var isTopMargin = type === "marginTop";
      if (parentElement && parentElement.currentStyle.hasLayout && !IE7._getElementSibling(element, isTopMargin ? "previous" : "next")) return;
      var child = element[isTopMargin ? "firstChild" : "lastChild"];
      if (child && child.nodeName < "@") child = IE7._getElementSibling(child, isTopMargin ? "next" : "previous");
      if (child && child.currentStyle.styleFloat === "none" && child.currentStyle.hasLayout) {
        collapseMargin(child, type);
        margin = _getMargin(element, element.currentStyle[type]);
        childMargin = _getMargin(child, child.currentStyle[type]);
        if (margin < 0 || childMargin < 0) {
          element.runtimeStyle[type] = margin + childMargin;
        } else {
          element.runtimeStyle[type] = Math.max(childMargin, margin);
        }
        child.runtimeStyle[type] = "0px";
      }
    }
  };

  function _getMargin(element, value) {
    return value === "auto" ? 0 : getPixelValue(element, value);
  };

  // -----------------------------------------------------------------------
  // box-model
  // -----------------------------------------------------------------------

  // constants
  var UNIT = /^[.\d][\w]*$/, AUTO = /^(auto|0cm)$/;

  var apply = {};
  layout.borderBox = function(element){
    apply.Width(element);
    apply.Height(element);
  };

  var _fixWidth = function(HEIGHT) {
    apply.Width = function(element) {
      if (!PERCENT.test(element.currentStyle.width)) _fixWidth(element);
      if (HEIGHT) collapseMargins(element);
    };

    function _fixWidth(element, value) {
      if (!element.runtimeStyle.fixedWidth) {
        if (!value) value = element.currentStyle.width;
        element.runtimeStyle.fixedWidth = UNIT.test(value) ? Math.max(0, getFixedWidth(element, value)) + "px" : value;
        setOverrideStyle(element, "width", element.runtimeStyle.fixedWidth);
      }
    };

    function layoutWidth(element) {
      if (!isFixed(element)) {
        var layoutParent = element.offsetParent;
        while (layoutParent && !layoutParent.currentStyle.hasLayout) layoutParent = layoutParent.offsetParent;
      }
      return (layoutParent || viewport).clientWidth;
    };

    function getPixelWidth(element, value) {
      if (PERCENT.test(value)) return parseInt(parseFloat(value) / 100 * layoutWidth(element));
      return getPixelValue(element, value);
    };

    var getFixedWidth = function(element, value) {
      var borderBox = element.currentStyle["ie7-box-sizing"] === "border-box";
      var adjustment = 0;
      if (MSIE5 && !borderBox)
        adjustment += getBorderWidth(element) + getWidth(element, "padding");
      else if (!MSIE5 && borderBox)
        adjustment -= getBorderWidth(element) + getWidth(element, "padding");
      return getPixelWidth(element, value) + adjustment;
    };

    // easy way to get border thickness for elements with "layout"
    function getBorderWidth(element) {
      return element.offsetWidth - element.clientWidth;
    };

    // have to do some pixel conversion to get padding/margin thickness :-(
    function getWidth(element, type) {
      return getPixelWidth(element, element.currentStyle[type + "Left"]) + getPixelWidth(element, element.currentStyle[type + "Right"]);
    };

    // -----------------------------------------------------------------------
    // min/max
    // -----------------------------------------------------------------------

    HEADER += "*{minWidth:none;maxWidth:none;min-width:none;max-width:none}";

    // handle min-width property
    layout.minWidth = function(element) {
      // IE6 supports min-height so we frig it here
      //#if (element.currentStyle.minHeight === "auto") element.runtimeStyle.minHeight = 0;
      if (element.currentStyle["min-width"] != null) {
        element.style.minWidth = element.currentStyle["min-width"];
      }
      if (register(arguments.callee, element, element.currentStyle.minWidth !== "none")) {
        layout.boxSizing(element);
        _fixWidth(element);
        resizeWidth(element);
      }
    };

    // clone the minWidth function to make a maxWidth function
    eval("IE7.Layout.maxWidth=" + String(layout.minWidth).replace(/min/g, "max"));

    // apply min/max restrictions
    function resizeWidth(element) {
      // check boundaries
      if (element == document.body) {
        var width = element.clientWidth;
      } else {
        var rect = element.getBoundingClientRect();
        width = rect.right - rect.left;
      }
      if (element.currentStyle.minWidth !== "none" && width < getFixedWidth(element, element.currentStyle.minWidth)) {
        element.runtimeStyle.width = element.currentStyle.minWidth;
      } else if (element.currentStyle.maxWidth !== "none" && width >= getFixedWidth(element, element.currentStyle.maxWidth)) {
        element.runtimeStyle.width = element.currentStyle.maxWidth;
      } else {
        element.runtimeStyle.width = element.runtimeStyle.fixedWidth;
      }
    };

    // -----------------------------------------------------------------------
    // right/bottom
    // -----------------------------------------------------------------------

    function fixRight(element) {
      if (register(fixRight, element, /^(fixed|absolute)$/.test(element.currentStyle.position) &&
        getDefinedStyle(element, "left") !== "auto" &&
        getDefinedStyle(element, "right") !== "auto" &&
        AUTO.test(getDefinedStyle(element, "width")))) {
          resizeRight(element);
          layout.boxSizing(element);
      }
    };
    layout.fixRight = fixRight;

    function resizeRight(element) {
      var left = getPixelWidth(element, element.runtimeStyle._left || element.currentStyle.left);
      var width = layoutWidth(element) - getPixelWidth(element, element.currentStyle.right) -  left - getWidth(element, "margin");
      if (parseInt(element.runtimeStyle.width) === width) return;
      element.runtimeStyle.width = "";
      if (isFixed(element) || HEIGHT || element.offsetWidth < width) {
        if (!MSIE5) width -= getBorderWidth(element) + getWidth(element, "padding");
        if (width < 0) width = 0;
        element.runtimeStyle.fixedWidth = width;
        setOverrideStyle(element, "width", width);
      }
    };

  // -----------------------------------------------------------------------
  // window.onresize
  // -----------------------------------------------------------------------

    // handle window resize
    var clientWidth = 0;
    addResize(function() {
      if (!viewport) return;
      var i, wider = (clientWidth < viewport.clientWidth);
      clientWidth = viewport.clientWidth;
      // resize elements with "min-width" set
      var elements = layout.minWidth.elements;
      for (i in elements) {
        var element = elements[i];
        var fixedWidth = (parseInt(element.runtimeStyle.width) === getFixedWidth(element, element.currentStyle.minWidth));
        if (wider && fixedWidth) element.runtimeStyle.width = "";
        if (wider == fixedWidth) resizeWidth(element);
      }
      // resize elements with "max-width" set
      var elements = layout.maxWidth.elements;
      for (i in elements) {
        var element = elements[i];
        var fixedWidth = (parseInt(element.runtimeStyle.width) === getFixedWidth(element, element.currentStyle.maxWidth));
        if (!wider && fixedWidth) element.runtimeStyle.width = "";
        if (wider !== fixedWidth) resizeWidth(element);
      }
      // resize elements with "right" set
      for (i in fixRight.elements) resizeRight(fixRight.elements[i]);
    });

  // -----------------------------------------------------------------------
  // fix CSS
  // -----------------------------------------------------------------------
    if (MSIE5) {
      IE7.CSS.addRecalc("width", NUMERIC, apply.Width);
    }
    if (appVersion < 7) {
      IE7.CSS.addRecalc("max-width", NUMERIC, layout.maxWidth);
      IE7.CSS.addRecalc("right", NUMERIC, fixRight);
    } else if (appVersion == 7) {
      if (HEIGHT) IE7.CSS.addRecalc("height", "[\\d.]+%", function(element) {
        element.runtimeStyle.pixelHeight = parseInt(layoutWidth(element) * element.currentStyle["ie7-height"].slice(0, -1) / 100);
      });
    }
  };

  eval("var _fixHeight=" + rotate(_fixWidth));

  // apply box-model + min/max fixes
  _fixWidth();
  _fixHeight(true);
  
  if (appVersion < 7) {
    IE7.CSS.addRecalc("min-width", NUMERIC, layout.minWidth);
    IE7.CSS.addFix(/\bmin-height\s*/, "height");
  }
})();

// =========================================================================
// ie7-graphics.js
// =========================================================================

// a small transparent image used as a placeholder
var BLANK_GIF = makePath("blank.gif", path);

var ALPHA_IMAGE_LOADER = "DXImageTransform.Microsoft.AlphaImageLoader";
var PNG_FILTER = "progid:" + ALPHA_IMAGE_LOADER + "(src='%1',sizingMethod='%2')";
  
// regular expression version of the above
var PNG;

var filtered = [];

function fixImage(element) {
  if (PNG.test(element.src)) {
    // we have to preserve width and height
    var image = new Image(element.width, element.height);
    image.onload = function() {
      element.width = image.width;
      element.height = image.height;
      image = null;
    };
    image.src = element.src;
    // store the original url (we'll put it back when it's printed)
    element.pngSrc = element.src;
    // add the AlphaImageLoader thingy
    addFilter(element);
  }
};

if (appVersion < 7) {
  // ** IE7 VARIABLE
  // e.g. apply the hack to all files ending in ".png"
  // IE7_PNG_SUFFIX = ".png";
  // You can also set it to a RegExp
  // IE7_PNG_SUFFIX = /\d+\.png$/;

  // replace background(-image): url(..) ..  with background(-image): .. ;filter: ..;
  IE7.CSS.addFix(/background(-image)?\s*:\s*([^};]*)?url\(([^\)]+)\)([^;}]*)?/, function(match, $1, $2, url, $4) {
    url = getString(url);
    return PNG.test(url) ? "filter:" + format(PNG_FILTER, url, $4.indexOf("no-repeat") === -1 ? "scale" : "crop") +
      ";zoom:1;background" + ($1||"") + ":" + ($2||"") + "none" + ($4||"") : match;
  });

  // list-style-image
  IE7.CSS.addRecalc(/list\-style(\-image)?/, "[^};]*url", function(element) {
    var url = element.currentStyle.listStyleImage.slice(5, -2);
    if (PNG.test(url)) {
      if (element.nodeName === "LI") {
        fixListStyleImage(element, url)
      } else if (element.nodeName === "UL") {
        for (var i = 0, li; li = element.childNodes[i]; i++) {
          if (li.nodeName === "LI") fixListStyleImage(li, url);
        }
      }
    }
  });

  function fixListStyleImage(element, src) {
    var style = element.runtimeStyle;
    var originalHeight = element.offsetHeight;
    var image = new Image;
    image.onload = function() {
      var paddingLeft = element.currentStyle.paddingLeft;
      paddingLeft = paddingLeft === "0px" ? 0 : getPixelValue(element, paddingLeft);
      style.paddingLeft = (paddingLeft + this.width) + "px";
      style.marginLeft = -this.width + "px";
      style.listStyleType = "none";
      style.listStyleImage = "none";
      style.paddingTop = Math.max(originalHeight - element.offsetHeight, 0) + "px";
      addFilter(element, "crop", src);
      element.style.zoom = "100%";
    };
    image.src = src;
  };
  
  // -----------------------------------------------------------------------
  //  fix PNG transparency (HTML images)
  // -----------------------------------------------------------------------

  IE7.HTML.addRecalc("img,input", function(element) {
    if (element.nodeName === "INPUT" && element.type !== "image") return;
    fixImage(element);
    addEventHandler(element, "onpropertychange", function() {
      if (!printing && event.propertyName === "src" &&
        element.src.indexOf(BLANK_GIF) === -1) fixImage(element);
    });
  });

  // assume that background images should not be printed
  //  (if they are not transparent then they'll just obscure content)
  // but we'll put foreground images back...
  var printing = false;
  addEventHandler(window, "onbeforeprint", function() {
    printing = true;
    for (var i = 0; i < filtered.length; i++) removeFilter(filtered[i]);
  });
  addEventHandler(window, "onafterprint", function() {
    for (var i = 0; i < filtered.length; i++) addFilter(filtered[i]);
    printing = false;
  });
}

// apply a filter
function addFilter(element, sizingMethod, src) {
  var filter = element.filters[ALPHA_IMAGE_LOADER];
  if (filter) {
    filter.src = src || element.src;
    filter.enabled = true;
  } else {
    element.runtimeStyle.filter = format(PNG_FILTER, src || element.src, sizingMethod || "scale");
    filtered.push(element);
  }
  // remove the real image
  element.src = BLANK_GIF;
};

function removeFilter(element) {
  element.src = element.pngSrc;
  element.filters[ALPHA_IMAGE_LOADER].enabled = false;
};

// =========================================================================
// ie7-fixed.js
// =========================================================================

(function() {
  if (appVersion >= 7) return;
  
  // some things to consider for this hack.
  // the document body requires a fixed background. even if
  //  it is just a blank image.
  // you have to use setExpression instead of onscroll, this
  //  together with a fixed body background helps avoid the
  //  annoying screen flicker of other solutions.
  
  IE7.CSS.addRecalc("position", "fixed", _positionFixed, "absolute");
  IE7.CSS.addRecalc("background(-attachment)?", "[^};]*fixed", _backgroundFixed);
  
  // scrolling is relative to the documentElement (HTML tag) when in
  //  standards mode, otherwise it's relative to the document body
  var $viewport = MSIE5 ? "body" : "documentElement";
  
  function _fixBackground() {
    // this is required by both position:fixed and background-attachment:fixed.
    // it is necessary for the document to also have a fixed background image.
    // we can fake this with a blank image if necessary
    if (body.currentStyle.backgroundAttachment !== "fixed") {
      if (body.currentStyle.backgroundImage === "none") {
        body.runtimeStyle.backgroundRepeat = "no-repeat";
        body.runtimeStyle.backgroundImage = "url(" + BLANK_GIF + ")"; // dummy
      }
      body.runtimeStyle.backgroundAttachment = "fixed";
    }
    _fixBackground = Undefined;
  };
  
  var _tmp = createTempElement("img");
  
  function _isFixed(element) {
    return element ? isFixed(element) || _isFixed(element.parentElement) : false;
  };
  
  function _setExpression(element, propertyName, expression) {
    setTimeout("document.all." + element.uniqueID + ".runtimeStyle.setExpression('" + propertyName + "','" + expression + "')", 0);
  };
  
  // -----------------------------------------------------------------------
  //  backgroundAttachment: fixed
  // -----------------------------------------------------------------------
  
  function _backgroundFixed(element) {
    if (register(_backgroundFixed, element, element.currentStyle.backgroundAttachment === "fixed" && !element.contains(body))) {
      _fixBackground();
      util.bgLeft(element);
      util.bgTop(element);
      _backgroundPosition(element);
    }
  };
  
  function _backgroundPosition(element) {
    _tmp.src = element.currentStyle.backgroundImage.slice(5, -2);
    var parentElement = element.canHaveChildren ? element : element.parentElement;
    parentElement.appendChild(_tmp);
    util.setOffsetLeft(element);
    util.setOffsetTop(element);
    parentElement.removeChild(_tmp);
  };
  
  // -----------------------------------------------------------------------
  //  position: fixed
  // -----------------------------------------------------------------------
  
  function _positionFixed(element) {
    if (register(_positionFixed, element, isFixed(element))) {
      setOverrideStyle(element, "position",  "absolute");
      setOverrideStyle(element, "left",  element.currentStyle.left);
      setOverrideStyle(element, "top",  element.currentStyle.top);
      _fixBackground();
      IE7.Layout.fixRight(element);
      //IE7.Layout.fixBottom(element);
      _foregroundPosition(element);
    }
  };
  
  function _foregroundPosition(element, recalc) {
    document.body.getBoundingClientRect(); // force a reflow
    util.positionTop(element, recalc);
    util.positionLeft(element, recalc, true);
    if (!element.runtimeStyle.autoLeft && element.currentStyle.marginLeft === "auto" &&
      element.currentStyle.right !== "auto") {
      var left = viewport.clientWidth - util.getPixelWidth(element, element.currentStyle.right) -
        util.getPixelWidth(element, element.runtimeStyle._left) - element.clientWidth;
      if (element.currentStyle.marginRight === "auto") left = parseInt(left / 2);
      if (_isFixed(element.offsetParent)) element.runtimeStyle.pixelLeft += left;
      else element.runtimeStyle.shiftLeft = left;
    }
    if (!element.runtimeStyle.fixedWidth) util.clipWidth(element);
    if (!element.runtimeStyle.fixedHeight) util.clipHeight(element);
  };
  
  // -----------------------------------------------------------------------
  //  capture window resize
  // -----------------------------------------------------------------------
  
  function _resize() {
    // if the window has been resized then some positions need to be
    //  recalculated (especially those aligned to "right" or "top"
    var elements = _backgroundFixed.elements;
    for (var i in elements) _backgroundPosition(elements[i]);
    elements = _positionFixed.elements;
    for (i in elements) {
      _foregroundPosition(elements[i], true);
      _foregroundPosition(elements[i], true);
    }
    _timer = 0;
  };
  
  // use a timer (sometimes this is a good way to prevent resize loops)
  var _timer;
  addResize(function() {
    if (!_timer) _timer = setTimeout(_resize, 100);
  });

  // -----------------------------------------------------------------------
  //  rotated
  // -----------------------------------------------------------------------

  var util = {};
  
  var _horizontal = function(util) {
    util.bgLeft = function(element) {
      element.style.backgroundPositionX = element.currentStyle.backgroundPositionX;
      if (!_isFixed(element)) {
        _setExpression(element, "backgroundPositionX", "(parseInt(runtimeStyle.offsetLeft)+document." + $viewport + ".scrollLeft)||0");
      }
    };

    util.setOffsetLeft = function(element) {
      var propertyName = _isFixed(element) ? "backgroundPositionX" : "offsetLeft";
      element.runtimeStyle[propertyName] =
        util.getOffsetLeft(element, element.style.backgroundPositionX) -
        element.getBoundingClientRect().left - element.clientLeft + 2;
    };

    util.getOffsetLeft = function(element, position) {
      switch (position) {
        case "left":
        case "top":
          return 0;
        case "right":
        case "bottom":
          return viewport.clientWidth - _tmp.offsetWidth;
        case "center":
          return (viewport.clientWidth - _tmp.offsetWidth) / 2;
        default:
          if (PERCENT.test(position)) {
            return parseInt((viewport.clientWidth - _tmp.offsetWidth) * parseFloat(position) / 100);
          }
          _tmp.style.left = position;
          return _tmp.offsetLeft;
      }
    };

    util.clipWidth = function(element) {
      var fixWidth = element.runtimeStyle.fixWidth;
      element.runtimeStyle.borderRightWidth = "";
      element.runtimeStyle.width = fixWidth ? util.getPixelWidth(element, fixWidth) + "px" : "";
      if (element.currentStyle.width !== "auto") {
        var rect = element.getBoundingClientRect();
        var width = element.offsetWidth - viewport.clientWidth + rect.left - 2;
        if (width >= 0) {
          element.runtimeStyle.borderRightWidth = "0px";
          width = Math.max(getPixelValue(element, element.currentStyle.width) - width, 0);
          setOverrideStyle(element, "width",  width);
          return width;
        }
      }
    };

    util.positionLeft = function(element, recalc) {
      // if the element's width is in % units then it must be recalculated
      //  with respect to the viewport
      if (!recalc && PERCENT.test(element.currentStyle.width)) {
        element.runtimeStyle.fixWidth = element.currentStyle.width;
      }
      if (element.runtimeStyle.fixWidth) {
        element.runtimeStyle.width = util.getPixelWidth(element, element.runtimeStyle.fixWidth);
      }
      //if (recalc) {
      //  // if the element is fixed on the right then no need to recalculate
      //  if (!element.runtimeStyle.autoLeft) return;
      //} else {
        element.runtimeStyle.shiftLeft = 0;
        element.runtimeStyle._left = element.currentStyle.left;
        // is the element fixed on the right?
        element.runtimeStyle.autoLeft = element.currentStyle.right !== "auto" && element.currentStyle.left === "auto";
      //}
      // reset the element's "left" value and get it's natural position
      element.runtimeStyle.left = "";
      element.runtimeStyle.screenLeft = util.getScreenLeft(element);
      element.runtimeStyle.pixelLeft = element.runtimeStyle.screenLeft;
      // if the element is contained by another fixed element then there is no need to
      //  continually recalculate it's left position
      if (!recalc && !_isFixed(element.offsetParent)) {
        // onsrcoll produces jerky movement, so we use an expression
        _setExpression(element, "pixelLeft", "runtimeStyle.screenLeft+runtimeStyle.shiftLeft+document." + $viewport + ".scrollLeft");
      }
    };

    // I've forgotten how this works...
    util.getScreenLeft = function(element) { // thanks to kevin newman (captainn)
      var screenLeft = element.offsetLeft, nested = 1;
      if (element.runtimeStyle.autoLeft) {
        screenLeft = viewport.clientWidth - element.offsetWidth - util.getPixelWidth(element, element.currentStyle.right);
      }
      // accommodate margins
      if (element.currentStyle.marginLeft !== "auto") {
        screenLeft -= util.getPixelWidth(element, element.currentStyle.marginLeft);
      }
      while (element = element.offsetParent) {
        if (element.currentStyle.position !== "static") nested = -1;
        screenLeft += element.offsetLeft * nested;
      }
      return screenLeft;
    };

    util.getPixelWidth = function(element, value) {
      return PERCENT.test(value) ? parseInt(parseFloat(value) / 100 * viewport.clientWidth) : getPixelValue(element, value);
    };
  };
  eval("var _vertical=" + rotate(_horizontal));
  _horizontal(util);
  _vertical(util);
})();

// =========================================================================
// ie7-oveflow.js
// =========================================================================

/* ---------------------------------------------------------------------

  This module alters the structure of the document.
  It may adversely affect other CSS rules. Be warned.

--------------------------------------------------------------------- */

if (appVersion < 7) {
  var WRAPPER_STYLE = {
    backgroundColor: "transparent",
    backgroundImage: "none",
    backgroundPositionX: null,
    backgroundPositionY: null,
    backgroundRepeat: null,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftStyle: "none",
    borderTopStyle: "none",
    borderRightStyle: "none",
    borderBottomStyle: "none",
    borderLeftWidth: 0,
    borderLeftColor: "#000",
    borderTopColor: "#000",
    borderRightColor: "#000",
    borderBottomColor: "#000",
    height: null,
    marginTop: 0,
    marginBottom: 0,
    marginRight: 0,
    marginLeft: 0,
    width: "100%"
  };

  IE7.CSS.addRecalc("overflow", "visible", function(element) {
    if (element.currentStyle.position === "absolute") return;
    
    // don't do this again
    if (element.parentNode.ie7_wrapped) return;

    // if max-height is applied, makes sure it gets applied first
    if (IE7.Layout && element.currentStyle["max-height"] !== "auto") {
      IE7.Layout.maxHeight(element);
    }

    if (element.currentStyle.marginLeft === "auto") element.style.marginLeft = 0;
    if (element.currentStyle.marginRight === "auto") element.style.marginRight = 0;

    var wrapper = document.createElement(ANON);
    wrapper.ie7_wrapped = element;
    for (var propertyName in WRAPPER_STYLE) {
      wrapper.style[propertyName] = element.currentStyle[propertyName];
      if (WRAPPER_STYLE[propertyName] != null) {
        element.runtimeStyle[propertyName] = WRAPPER_STYLE[propertyName];
      }
    }
    wrapper.style.display = "block";
    wrapper.style.position = "relative";
    element.runtimeStyle.position = "absolute";
    element.parentNode.insertBefore(wrapper, element);
    wrapper.appendChild(element);
  });
}

// =========================================================================
// ie7-quirks.js
// =========================================================================

function ie7Quirks() {
  var FONT_SIZES = "xx-small,x-small,small,medium,large,x-large,xx-large".split(",");
  for (var i = 0; i < FONT_SIZES.length; i++) {
    FONT_SIZES[FONT_SIZES[i]] = FONT_SIZES[i - 1] || "0.67em";
  }
  
  IE7.CSS.addFix(/(font(-size)?\s*:\s*)([\w.-]+)/, function(match, label, size, value) {
    return label + (FONT_SIZES[value] || value);
  });
  
  var NEGATIVE = /^\-/, LENGTH = /(em|ex)$/i;
  var EM = /em$/i, EX = /ex$/i;

  getPixelValue = function(element, value) {
    if (PIXEL.test(value)) return parseInt(value)||0;
    var scale = NEGATIVE.test(value)? -1 : 1;
    if (LENGTH.test(value)) scale *= getFontScale(element);
    temp.style.width = scale < 0 ? value.slice(1) : value;
    body.appendChild(temp);
    // retrieve pixel width
    value = scale * temp.offsetWidth;
    // remove the temporary element
    temp.removeNode();
    return parseInt(value);
  };

  var temp = createTempElement();
  function getFontScale(element) {
    var scale = 1;
    temp.style.fontFamily = element.currentStyle.fontFamily;
    temp.style.lineHeight = element.currentStyle.lineHeight;
    //temp.style.fontSize = "";
    while (element != body) {
      var fontSize = element.currentStyle["ie7-font-size"];
      if (fontSize) {
        if (EM.test(fontSize)) scale *= parseFloat(fontSize);
        else if (PERCENT.test(fontSize)) scale *= (parseFloat(fontSize) / 100);
        else if (EX.test(fontSize)) scale *= (parseFloat(fontSize) / 2);
        else {
          temp.style.fontSize = fontSize;
          return 1;
        }
      }
      element = element.parentElement;
    }
    return scale;
  };

  // cursor:pointer (IE5.x)
  IE7.CSS.addFix(/cursor\s*:\s*pointer/, "cursor:hand");
  // display:list-item (IE5.x)
  IE7.CSS.addFix(/display\s*:\s*list-item/, "display:block");
  
  // -----------------------------------------------------------------------
  //  margin:auto
  // -----------------------------------------------------------------------
  
  function fixMargin(element) {
    var parent = element.parentElement;
    var margin = parent.offsetWidth - element.offsetWidth - getPaddingWidth(parent);
    var autoRight = (element.currentStyle["ie7-margin"] && element.currentStyle.marginRight === "auto") ||
      element.currentStyle["ie7-margin-right"] === "auto";
    switch (parent.currentStyle.textAlign) {
      case "right":
        margin = autoRight ? parseInt(margin / 2) : 0;
        element.runtimeStyle.marginRight = margin + "px";
        break;
      case "center":
        if (autoRight) margin = 0;
      default:
        if (autoRight) margin /= 2;
        element.runtimeStyle.marginLeft = parseInt(margin) + "px";
    }
  };

  function getPaddingWidth(element) {
    return getPixelValue(element, element.currentStyle.paddingLeft) +
      getPixelValue(element, element.currentStyle.paddingRight);
  };
  
  IE7.CSS.addRecalc("margin(-left|-right)?", "[^};]*auto", function(element) {
    if (register(fixMargin, element,
      element.parentElement &&
      element.currentStyle.display === "block" &&
      element.currentStyle.marginLeft === "auto" &&
      element.currentStyle.position !== "absolute")) {
        fixMargin(element);
    }
  });
  
  addResize(function() {
    for (var i in fixMargin.elements) {
      var element = fixMargin.elements[i];
      element.runtimeStyle.marginLeft =
      element.runtimeStyle.marginRight = "";
      fixMargin(element);
    }
  });
};


// =========================================================================
// ie8-css.js
// =========================================================================

var BRACKETS = "\\([^)]+\\)";

// pseudo-elements can be declared with a double colon
encoder.add(/::(before|after)/, ":$1");

if (appVersion < 8) {

  if (IE7.CSS.pseudoClasses) IE7.CSS.pseudoClasses += "|";
  IE7.CSS.pseudoClasses += "before|after|lang" + BRACKETS;

  // -----------------------------------------------------------------------
  // propertyName: inherit;
  // -----------------------------------------------------------------------
  
  function parseInherited(cssText) {
    return cssText.replace(new RegExp("([{;\\s])(" + inheritedProperties.join("|") + ")\\s*:\\s*([^;}]+)", "g"), "$1$2:$3;ie7-$2:$3");
  };

  var INHERITED = /[\w-]+\s*:\s*inherit/g;
  var STRIP_IE7_FLAGS = /ie7\-|\s*:\s*inherit/g;
  var DASH_LOWER = /\-([a-z])/g;
  function toUpper(match, chr) {return chr.toUpperCase()};
  
  IE7.CSS.addRecalc("[\\w-]+", "inherit", function(element, cssText) {
    if (element.parentElement) {
      var inherited = cssText.match(INHERITED);
      for (var i = 0; i < inherited.length; i++) {
        var propertyName = inherited[i].replace(STRIP_IE7_FLAGS, "");
        if (element.currentStyle["ie7-" + propertyName] === "inherit") {
          propertyName = propertyName.replace(DASH_LOWER, toUpper);
          //if (element.parentElement.currentStyle[propertyName] !== undefined)
          //  element.runtimeStyle[propertyName] = element.parentElement.currentStyle[propertyName];
          element.runtimeStyle[propertyName] = element.parentElement.currentStyle[propertyName];
        }
      }
    }
  }, function(match) {
    inheritedProperties.push(rescape(match.slice(1).split(":")[0]));
    return match;
  });

  // -----------------------------------------------------------------------
  // dynamic pseudo-classes
  // -----------------------------------------------------------------------

  var Focus = new DynamicPseudoClass("focus", function(element) {
    var instance = arguments;

    IE7.CSS.addEventHandler(element, "onfocus", function() {
      Focus.unregister(instance); // in case it starts with focus
      Focus.register(instance);
    });

    IE7.CSS.addEventHandler(element, "onblur", function() {
      Focus.unregister(instance);
    });

    // check the active element for initial state
    if (element == document.activeElement) {
      Focus.register(instance)
    }
  });

  var Active = new DynamicPseudoClass("active", function(element) {
    var instance = arguments;
    IE7.CSS.addEventHandler(element, "onmousedown", function() {
      Active.register(instance);
    });
  });

  // globally trap the mouseup event (thanks Martijn!)
  addEventHandler(document, "onmouseup", function() {
    var instances = Active.instances;
    for (var i in instances) Active.unregister(instances[i]);
  });

  // -----------------------------------------------------------------------
  // IE7 pseudo elements
  // -----------------------------------------------------------------------

  // constants
  var URL = /^url\s*\(\s*([^)]*)\)$/;
  var POSITION_MAP = {
    before0: "beforeBegin",
    before1: "afterBegin",
    after0: "afterEnd",
    after1: "beforeEnd"
  };

  var PseudoElement = IE7.PseudoElement = Rule.extend({
    constructor: function(selector, position, cssText) {
      // initialise object properties
      this.position = position;
      var content = cssText.match(PseudoElement.CONTENT), match, entity;
      if (content) {
        content = content[1];
        match = content.split(/\s+/);
        for (var i = 0; (entity = match[i]); i++) {
          match[i] = /^attr/.test(entity) ? {attr: entity.slice(5, -1)} :
            entity.charAt(0) === "'" ? getString(entity) : decode(entity);
        }
        content = match;
      }
      this.content = content;
      // CSS text needs to be decoded immediately
      this.base(selector, decode(cssText));
    },

    init: function() {
      // execute the underlying css query for this class
      this.match = cssQuery(this.selector);
      for (var i = 0; i < this.match.length; i++) {
        var runtimeStyle = this.match[i].runtimeStyle;
        if (!runtimeStyle[this.position]) runtimeStyle[this.position] = {cssText:""};
        runtimeStyle[this.position].cssText += ";" + this.cssText;
        if (this.content != null) runtimeStyle[this.position].content = this.content;
      }
    },

    create: function(target) {
      var generated = target.runtimeStyle[this.position];
      if (generated) {
        // copy the array of values
        var content = [].concat(generated.content || "");
        for (var j = 0; j < content.length; j++) {
          if (typeof content[j] == "object") {
            content[j] = target.getAttribute(content[j].attr);
          }
        }
        content = content.join("");
        var url = content.match(URL);
        var cssText = "overflow:hidden;" + generated.cssText.replace(/'/g, '"');
        var position = POSITION_MAP[this.position + Number(target.canHaveChildren)];
        var id = 'ie7_pseudo' + PseudoElement.count++;
        target.insertAdjacentHTML(position, format(PseudoElement.ANON, this.className, id, cssText, url ? "" : content));
        if (url) {
          var src = getString(url[1]);
          var pseudoElement = document.getElementById(id);
          pseudoElement.src = src;
          addFilter(pseudoElement, "crop");
          var targetIsFloated = target.currentStyle.styleFloat !== "none";
          if (pseudoElement.currentStyle.display === "inline" || targetIsFloated) {
            if (appVersion < 7 && targetIsFloated && target.canHaveChildren) {
              target.runtimeStyle.display = "inline";
              target.runtimeStyle.position = "relative";
              pseudoElement.runtimeStyle.position = "absolute";
            }
            pseudoElement.style.display = "inline-block";
            if (target.currentStyle.styleFloat !== "none") {
              pseudoElement.style.pixelWidth = target.offsetWidth;
            }
            var image = new Image;
            image.onload = function() {
              pseudoElement.style.pixelWidth = this.width;
              pseudoElement.style.pixelHeight = Math.max(this.height, pseudoElement.offsetHeight);
            };
            image.src = src;
          }
        }
        target.runtimeStyle[this.position] = null;
      }
    },

    recalc: function() {
      if (this.content == null) return;
      for (var i = 0; i < this.match.length; i++) {
        this.create(this.match[i]);
      }
    },

    toString: function() {
      return "." + this.className + "{display:inline}";
    }
  }, {
    CONTENT: /content\s*:\s*([^;]*)(;|$)/,
    ANON: "<ie7:! class='ie7_anon %1' id=%2 style='%3'>%4</ie7:!>",
    MATCH: /(.*):(before|after).*/,

    count: 0
  });

  IE7._getLang = function(element) {
    var lang = "";
    while (element && element.nodeType === 1) {
      lang = element.lang || element.getAttribute("lang") || "";
      if (lang) break;
      element = element.parentNode;
    }
    return lang;
  };

  FILTER = extend(FILTER, {
    ":lang\\(([^)]+)\\)":    "((ii=IE7._getLang(e))==='$1'||ii.indexOf('$1-')===0)&&"
  });
}

// =========================================================================
// ie8-html.js
// =========================================================================

var UNSUCCESSFUL = /^(submit|reset|button)$/;

// -----------------------------------------------------------------------
// <button>
// -----------------------------------------------------------------------

// IE bug means that innerText is submitted instead of "value"
IE7.HTML.addRecalc("button,input", function(button) {
  if (button.nodeName === "BUTTON") {
    var match = button.outerHTML.match(/ value="([^"]*)"/i);
    button.runtimeStyle.value = match ? match[1] : "";
  }
  // flag the button/input that was used to submit the form
  if (button.type === "submit") {
    addEventHandler(button, "onclick", function() {
      button.runtimeStyle.clicked = true;
      setTimeout("document.all." + button.uniqueID + ".runtimeStyle.clicked=false", 1);
    });
  }
});

// -----------------------------------------------------------------------
// <form>
// -----------------------------------------------------------------------

// only submit "successful controls
IE7.HTML.addRecalc("form", function(form) {
  addEventHandler(form, "onsubmit", function() {
    for (var element, i = 0; element = form[i]; i++) {
      if (UNSUCCESSFUL.test(element.type) && !element.disabled && !element.runtimeStyle.clicked) {
        element.disabled = true;
        setTimeout("document.all." + element.uniqueID + ".disabled=false", 1);
      } else if (element.nodeName === "BUTTON" && element.type === "submit") {
        setTimeout("document.all." + element.uniqueID + ".value='" + element.value + "'", 1);
        element.value = element.runtimeStyle.value;
      }
    }
  });
});

// -----------------------------------------------------------------------
// <img>
// -----------------------------------------------------------------------

// get rid of the spurious tooltip produced by the alt attribute on images
IE7.HTML.addRecalc("img", function(img) {
  if (img.alt && !img.title) img.title = "";
});

// =========================================================================
// ie8-layout.js
// =========================================================================

if (appVersion < 8) {
  IE7.CSS.addRecalc("border-spacing", NUMERIC, function(element) {
    if (element.currentStyle.borderCollapse !== "collapse") {
      element.cellSpacing = getPixelValue(element, element.currentStyle["ie7-border-spacing"].split(" ")[0]);
    }
  });
  IE7.CSS.addRecalc("box-sizing", "content-box", IE7.Layout.boxSizing);
  IE7.CSS.addRecalc("box-sizing", "border-box", IE7.Layout.borderBox);
}

// =========================================================================
// ie8-graphics.js
// =========================================================================

if (appVersion < 8) {
  // fix object[type=image/*]
  var IMAGE = /^image/i;
  IE7.HTML.addRecalc("object", function(element) {
    if (IMAGE.test(element.type)) {
      element.body.style.cssText = "margin:0;padding:0;border:none;overflow:hidden";
      return element;
    }
  });
}

// =========================================================================
// ie9-css.js
// =========================================================================

var NOT_NEXT_BY_TYPE     = "!IE7._getElementSiblingByType(e,'next')&&",
    NOT_PREVIOUS_BY_TYPE = NOT_NEXT_BY_TYPE.replace("next", "previous");

if (IE7.CSS.pseudoClasses) IE7.CSS.pseudoClasses += "|";
IE7.CSS.pseudoClasses += "(?:first|last|only)\\-(?:child|of\\-type)|empty|root|target|" +
  ("not|nth\\-child|nth\\-last\\-child|nth\\-of\\-type|nth\\-last\\-of\\-type".split("|").join(BRACKETS + "|") + BRACKETS);
  
// :checked
var Checked = new DynamicPseudoClass("checked", function(element) {
  if (typeof element.checked !== "boolean") return;
  var instance = arguments;
  IE7.CSS.addEventHandler(element, "onpropertychange", function() {
    if (event.propertyName === "checked") {
      if (element.checked === true) Checked.register(instance);
      else Checked.unregister(instance);
    }
  });
  // check current checked state
  if (element.checked === true) Checked.register(instance);
});

// :enabled
var Enabled = new DynamicPseudoClass("enabled", function(element) {
  if (typeof element.disabled !== "boolean") return;
  var instance = arguments;
  IE7.CSS.addEventHandler(element, "onpropertychange", function() {
    if (event.propertyName === "disabled") {
      if (element.disabled === false) Enabled.register(instance);
      else Enabled.unregister(instance);
    }
  });
  // check current disabled state
  if (element.disabled === false) Enabled.register(instance);
});

// :disabled
var Disabled = new DynamicPseudoClass("disabled", function(element) {
  if (typeof element.disabled !== "boolean") return;
  var instance = arguments;
  IE7.CSS.addEventHandler(element, "onpropertychange", function() {
    if (event.propertyName === "disabled") {
      if (element.disabled === true) Disabled.register(instance);
      else Disabled.unregister(instance);
    }
  });
  // check current disabled state
  if (element.disabled === true) Disabled.register(instance);
});

// :indeterminate (Kevin Newman)
var Indeterminate = new DynamicPseudoClass("indeterminate", function(element) {
  if (typeof element.indeterminate !== "boolean") return;
  var instance = arguments;
  IE7.CSS.addEventHandler(element, "onpropertychange", function() {
    if (event.propertyName === "indeterminate") {
      if (element.indeterminate === true) Indeterminate.register(instance);
      else Indeterminate.unregister(instance);
    }
  });
  IE7.CSS.addEventHandler(element, "onclick", function() {
    Indeterminate.unregister(instance);
  });
  // clever Kev says no need to check this up front
});

// :target
var Target = new DynamicPseudoClass("target", function(element) {
  var instance = arguments;
  // if an element has a tabIndex then it can become "active".
  //  The default is zero anyway but it works...
  if (!element.tabIndex) element.tabIndex = 0;
  // this doesn't detect the back button. I don't know how to do that without adding an iframe :-(
  IE7.CSS.addEventHandler(document, "onpropertychange", function() {
    if (event.propertyName === "activeElement") {
      if (element.id && element.id === location.hash.slice(1)) Target.register(instance);
      else Target.unregister(instance);
    }
  });
  // check the current location
  if (element.id && element.id === location.hash.slice(1)) Target.register(instance);
});

// Register a node and index its siblings.
var _currentIndex = 1, // -@DRE
    allIndexes = {_currentIndex: 1};

IE7._indexOf = function(element, last, ofType) {
  var parent = element.parentNode;
  if (!parent || parent.nodeType !== 1) return NaN;

  var tagName = ofType ? element.nodeName : "";
  if (tagName === "TR" && element.sectionRowIndex >= 0) {
    var index = element.sectionRowIndex;
    return last ? element.parentNode.rows.length - index + 1 : index;
  }
  if ((tagName === "TD" || tagName === "TH") && element.cellIndex >= 0) {
    index = element.cellIndex;
    return last ? element.parentNode.cells.length - index + 1 : index;
  }
  if (allIndexes._currentIndex !== _currentIndex) {
    allIndexes = {_currentIndex: _currentIndex};
  }
  var id = (parent.uniqueID) + "-" + tagName,
      indexes = allIndexes[id];
  if (!indexes) {
    indexes = {};
    var index = 0,
        child = parent.firstChild;
    while (child) {
      if (ofType ? child.nodeName === tagName : child.nodeName > "@") {
        indexes[child.uniqueID] = ++index;
      }
      child = child.nextSibling;
    }
    indexes.length = index;
    allIndexes[id] = indexes;
  }
  index = indexes[element.uniqueID];
  return last ? indexes.length - index + 1 : index;
};

IE7._isEmpty = function(node) {
  node = node.firstChild;
  while (node) {
    if (node.nodeType === 3 || node.nodeName > "@") return false;
    node = node.nextSibling;
  }
  return true;
};

IE7._getElementSiblingByType = function(node, direction) {
  var tagName = node.nodeName;
  direction += "Sibling";
  do {
    node = node[direction];
    if (node && node.nodeName === tagName) break;
  } while (node);
  return node;
};

var ONE = {"+": 1, "-": -1}, SPACES = / /g;

FILTER = extend(extend({
  ":nth(-last)?-(?:child|(of-type))\\((<#nth_arg>)\\)(<#filter>)?": function(match, last, ofType, args, filters) { // :nth- pseudo classes
    args = args.replace(SPACES, "");

    var index = "IE7._indexOf(e," + !!last + "," + !!ofType + ")";

    if (args === "even") args = "2n";
    else if (args === "odd") args = "2n+1";
    else if (!isNaN(args)) args = "0n" + ~~args;

    args = args.split("n");
    var a = ~~(ONE[args[0]] || args[0] || 1),
        b = ~~args[1];
    if (a === 0) {
      var expr = index + "===" + b;
    } else {
      expr = "((ii=" + index + ")-(" + b + "))%" + a + "===0&&ii" + (a < 0 ? "<" : ">") + "=" + b;
    }
    return this.parse(filters) + expr + "&&";
  },

  "<#negation>": function(match, simple) {
    if (/:not/i.test(simple)) throwSelectorError();

    if (/^[#.:\[]/.test(simple)) {
      simple = "*" + simple;
    }
    return "!(" + MATCHER.parse(simple).slice(3, -2) + ")&&";
  }
}, FILTER), {
  ":checked":         "e.checked===true&&",
  ":disabled":        "e.disabled===true&&",
  ":enabled":         "e.disabled===false&&",
  ":last-child":      "!" + NEXT_SIBLING + "&&",
  ":only-child":      "!" + PREVIOUS_SIBLING + "&&!" + NEXT_SIBLING + "&&",
  ":first-of-type":   NOT_PREVIOUS_BY_TYPE,
  ":last-of-type":    NOT_NEXT_BY_TYPE,
  ":only-of-type":    NOT_PREVIOUS_BY_TYPE + NOT_NEXT_BY_TYPE,

  ":empty":          "IE7._isEmpty(e)&&",
  ":root":           "e==R&&",
  ":target":         "H&&" + ID_ATTRIBUTE + "===H&&"
});

var HTML5 = "article,aside,audio,canvas,details,figcaption,figure,footer,header,hgroup,mark,menu,meter,nav,output,progress,section,summary,time,video".split(",");
for (var i = 0, tagName; tagName = HTML5[i]; i++) document.createElement(tagName);

HEADER += "datalist{display:none}\
details{padding-left:40px;display:block;margin:1em 0}\
meter,progress{vertical-align:-0.2em;width:5em;height:1em;display:inline-block}\
progress{width:10em;}\
article,aside,figcaption,footer,header,hgroup,summary,section,nav{display:block;margin:1em 0}\
figure{margin:1em 40px;display:block}\
mark{background:yellow}";

// =========================================================================
// ie9-layout.js
// =========================================================================

// =========================================================================
// ie9-graphics.js
// =========================================================================

IE7.CSS.addFix(/\bopacity\s*:\s*([\d.]+)/, function(match, value) {
  return "zoom:1;filter:Alpha(opacity=" + ((value * 100) || 1) + ")";
});

var MATCHER;

var cssQuery = (function() {
  var CONTEXT = /^[>+~]/;
  
  var useContext = false;
  
  // This is not a selector engine in the strictest sense. So it's best to silently error.
  function cssQuery(selector, context, single) {
    selector = trim(selector);
    if (!context) context = document;
    var ref = context;
    useContext = CONTEXT.test(selector);
    if (useContext) {
      context = context.parentNode;
      selector = "*" + selector;
    }
    try {
      return selectQuery.create(selector, useContext)(context, single ? null : [], ref);
    } catch (ex) {
      return single ? null : [];
    }
  };

  var VALID_SELECTOR = /^(\\.|[' >+~#.\[\]:*(),\w-\^|$=]|[^\x00-\xa0])+$/;

  var _EVALUATED = /^(href|src)$/;
  var _ATTRIBUTES = {
    "class": "className",
    "for": "htmlFor"
  };

  var IE7_CLASS_NAMES = /\sie7_\w+/g;

  var USE_IFLAG = /^(action|cite|codebase|data|dynsrc|href|longdesc|lowsrc|src|usemap|url)$/i;

  IE7._getAttribute = function(element, name) {
    if (element.getAttributeNode) {
      var attribute = element.getAttributeNode(name);
    }
    name = _ATTRIBUTES[name.toLowerCase()] || name;
    if (!attribute) attribute = element.attributes[name];
    var specified = attribute && attribute.specified;

    if (element[name] && typeof element[name] == "boolean") return name.toLowerCase();
    if ((specified && USE_IFLAG.test(name)) || (!attribute && MSIE5) || name === "value" || name === "type") {
      return element.getAttribute(name, 2);
    }
    if (name === "style") return element.style.cssText.toLowerCase() || null;

    return specified ? String(attribute.nodeValue) : null;
  };

  var names = "colSpan,rowSpan,vAlign,dateTime,accessKey,tabIndex,encType,maxLength,readOnly,longDesc";
  // Convert the list of strings to a hash, mapping the lowercase name to the camelCase name.
  extend(_ATTRIBUTES, combine(names.toLowerCase().split(","), names.split(",")));

  IE7._getElementSibling = function(node, direction) {
    direction += "Sibling";
    do {
      node = node[direction];
      if (node && node.nodeName > "@") break;
    } while (node);
    return node;
  };

  var IMPLIED_ASTERISK    = /(^|[, >+~])([#.:\[])/g,
      BLOCKS              = /\)\{/g,
      COMMA               = /,/,
      QUOTED              = /^['"]/,
      HEX_ESCAPE          = /\\([\da-f]{2,2})/gi,
      LAST_CHILD          = /last/i;

  IE7._byId = function(document, id) {
    var result = document.all[id] || null;
    // Returns a single element or a collection.
    if (!result || (result.nodeType && IE7._getAttribute(result, "id") === id)) return result;
    // document.all has returned a collection of elements with name/id
    for (var i = 0; i < result.length; i++) {
      if (IE7._getAttribute(result[i], "id") === id) return result[i];
    }
    return null;
  };

  // =========================================================================
  // dom/selectors-api/CSSSelectorParser.js
  // =========================================================================

  // http://www.w3.org/TR/css3-selectors/#w3cselgrammar (kinda)
  var CSSSelectorParser = RegGrp.extend({
    dictionary: new Dictionary({
      ident:           /\-?(\\.|[_a-z]|[^\x00-\xa0])(\\.|[\w-]|[^\x00-\xa0])*/,
      combinator:      /[\s>+~]/,
      operator:        /[\^~|$*]?=/,
      nth_arg:         /[+-]?\d+|[+-]?\d*n(?:\s*[+-]\s*\d+)?|even|odd/,
      tag:             /\*|<#ident>/,
      id:              /#(<#ident>)/,
      'class':         /\.(<#ident>)/,
      pseudo:          /\:([\w-]+)(?:\(([^)]+)\))?/,
      attr:            /\[(<#ident>)(?:(<#operator>)((?:\\.|[^\[\]#.:])+))?\]/,
      negation:        /:not\((<#tag>|<#id>|<#class>|<#attr>|<#pseudo>)\)/,
      sequence:        /(\\.|[~*]=|\+\d|\+?\d*n\s*\+\s*\d|[^\s>+~,\*])+/,
      filter:          /[#.:\[]<#sequence>/,
      selector:        /[^>+~](\\.|[^,])*?/,
      grammar:         /^(<#selector>)((,<#selector>)*)$/
    }),

    ignoreCase: true
  });

  var normalizer = new CSSSelectorParser({
    "\\\\.|[~*]\\s+=|\\+\\s+\\d": RegGrp.IGNORE,
    "\\[\\s+": "[",
    "\\(\\s+": "(",
    "\\s+\\)": ")",
    "\\s+\\]": "]",
    "\\s*([,>+~]|<#operator>)\\s*": "$1",
    "\\s+$": "",
    "\\s+": " "
  });

  function normalize(selector) {
    selector = normalizer.parse(selector.replace(HEX_ESCAPE, "\\x$1"))
      .replace(UNESCAPE, "$1")
      .replace(IMPLIED_ASTERISK, "$1*$2");
    if (!VALID_SELECTOR.test(selector)) throwSelectorError();
    return selector;
  };

  function unescape(query) {
    // put string values back
    return query.replace(ESCAPED, unescapeString);
  };

  function unescapeString(match, index) {
    return strings[index];
  };

  var BRACES = /\{/g, BRACES_ESCAPED = /\\{/g;

  function closeBlock(group) {
    return Array((group.replace(BRACES_ESCAPED, "").match(BRACES) || "").length + 1).join("}");
  };

  FILTER = new CSSSelectorParser(FILTER);

  var TARGET = /:target/i, ROOT = /:root/i;

  function getConstants(selector) {
    var constants = "";
    if (ROOT.test(selector)) constants += ",R=d.documentElement";
    if (TARGET.test(selector)) constants += ",H=d.location;H=H&&H.hash.replace('#','')";
    if (constants || selector.indexOf("#") !== -1) {
      constants = ",t=c.nodeType,d=t===9?c:c.ownerDocument||(c.document||c).parentWindow.document" + constants;
    }
    return "var ii" + constants + ";";
  };

  var COMBINATOR = {
    " ":   ";while(e!=s&&(e=e.parentNode)&&e.nodeType===1){",
    ">":   ".parentElement;if(e){",
    "+":   ";while((e=e.previousSibling)&&!(" + IS_ELEMENT + "))continue;if(e){",
    "~":   ";while((e=e.previousSibling)){" + IF_ELEMENT
  };

  var TOKEN = /\be\b/g;

  MATCHER = new CSSSelectorParser({
    "(?:(<#selector>)(<#combinator>))?(<#tag>)(<#filter>)?$": function(match, before, combinator, tag, filters) {
      var group = "";
      if (tag !== "*") {
        var TAG = tag.toUpperCase();
        group += "if(e.nodeName==='" + TAG + (TAG === tag ? "" : "'||e.nodeName==='" + tag) + "'){";
      }
      if (filters) {
        group += "if(" + FILTER.parse(filters).slice(0, -2) + "){";
      }
      group = group.replace(TOKEN, "e" + this.index);
      if (combinator) {
        group += "var e=e" + (this.index++) + COMBINATOR[combinator];
        group = group.replace(TOKEN, "e" + this.index);
      }
      if (before) {
        group += this.parse(before);
      }
      return group;
    }
  });
  
  var BY_ID       = "e0=IE7._byId(d,'%1');if(e0){",
      BY_TAG_NAME = "var n=c.getElementsByTagName('%1');",
      STORE       = "if(r==null)return e0;r[k++]=e0;";

  var TAG_NAME = 1;

  var SELECTOR = new CSSSelectorParser({
    "^((?:<#selector>)?(?:<#combinator>))(<#tag>)(<#filter>)?$": true
  });

  var cache = {};

  var selectById = new CSSSelectorParser({
    "^(<#tag>)#(<#ident>)(<#filter>)?( [^,]*)?$": function(match, tagName, id, filters, after) {
      var block = format(BY_ID, id), endBlock = "}";
      if (filters) {
        block += MATCHER.parse(tagName + filters);
        endBlock = closeBlock(block);
      }
      if (after) {
        block += "s=c=e0;" + selectQuery.parse("*" + after);
      } else {
        block += STORE;
      }
      return block + endBlock;
    },

    "^([^#,]+)#(<#ident>)(<#filter>)?$": function(match, before, id, filters) {
      var block = format(BY_ID, id);
      if (before === "*") {
        block += STORE;
      } else {
        block += MATCHER.parse(before + filters) + STORE + "break";
      }
      return block + closeBlock(block);
    },

    "^.*$": ""
  });

  var selectQuery = new CSSSelectorParser({
    "<#grammar>": function(match, selector, remainingSelectors) {
      if (!this.groups) this.groups = [];

      var group = SELECTOR.exec(" " + selector);

      if (!group) throwSelectorError();

      this.groups.push(group.slice(1));

      if (remainingSelectors) {
        return this.parse(remainingSelectors.replace(COMMA, ""));
      }

      var groups = this.groups,
          tagName = groups[0][TAG_NAME]; // first tag name

      for (var i = 1; group = groups[i]; i++) { // search tag names
        if (tagName !== group[TAG_NAME]) {
          tagName = "*"; // mixed tag names, so use "*"
          break;
        }
      }

      var matcher = "", store = STORE + "continue filtering;";

      for (var i = 0; group = groups[i]; i++) {
        MATCHER.index = 0;
        if (tagName !== "*") group[TAG_NAME] = "*"; // we are already filtering by tagName
        group = group.join("");
        if (group === " *") { // select all
          matcher = store;
          break;
        } else {
          group = MATCHER.parse(group);
          if (useContext) group += "if(e" + MATCHER.index + "==s){";
          matcher += group + store + closeBlock(group);
        }
      }

      // reduce to a single loop
      var isWild = tagName === "*";
      return (isWild ? "var n=c.all;" : format(BY_TAG_NAME, tagName)) +
        "filtering:while((e0=n[i++]))" +
        (isWild ? IF_ELEMENT.replace(TOKEN, "e0") : "{") +
          matcher +
        "}";
    },

    "^.*$": throwSelectorError
  });

  var REDUNDANT_NODETYPE_CHECKS = /\&\&(e\d+)\.nodeType===1(\)\{\s*if\(\1\.nodeName=)/g;

  selectQuery.create = function(selector) {
    if (!cache[selector]) {
      selector = normalize(selector);
      this.groups = null;
      MATCHER.index = 0;
      var block = this.parse(selector);
      this.groups = null;
      MATCHER.index = 0;
      if (selector.indexOf("#") !== -1) {
        var byId  = selectById.parse(selector);
        if (byId) {
          block =
            "if(t===1||t===11|!c.getElementById){" +
              block +
            "}else{" +
              byId +
            "}";
        }
      }
      // remove redundant nodeType==1 checks
      block = block.replace(REDUNDANT_NODETYPE_CHECKS, "$2");
      block = getConstants(selector) + decode(block);
      cache[selector] = new Function("return function(c,r,s){var i=0,k=0,e0;" + block + "return r}")();
    }
    return cache[selector];
  };

  return cssQuery;
})();

function throwSelectorError() {
  throw new SyntaxError("Invalid selector.");
};

// -----------------------------------------------------------------------
// initialisation
// -----------------------------------------------------------------------

IE7.loaded = true;

(function() {
  try {
    // http://javascript.nwbox.com/IEContentLoaded/
    if (!document.body) throw "continue";
    documentElement.doScroll("left");
  } catch (ex) {
    setTimeout(arguments.callee, 1);
    return;
  }
  // execute the inner text of the IE7 script
  try {
    eval(script.innerHTML);
  } catch (ex) {
    // ignore errors
  }
  if (typeof IE7_PNG_SUFFIX == "object") {
    PNG = IE7_PNG_SUFFIX;
  } else {
    PNG = new RegExp(rescape(window.IE7_PNG_SUFFIX || "-trans.png") + "(\\?.*)?$", "i");
  }

  // frequently used references
  body = document.body;
  viewport = MSIE5 ? body : documentElement;

  // classes
  body.className += " ie7_body";
  documentElement.className += " ie7_html";

  if (MSIE5) ie7Quirks();

  IE7.CSS.init();
  IE7.HTML.init();

  IE7.HTML.apply();
  IE7.CSS.apply();

  IE7.recalc();
})();

})(this, document);
/*!
 * Modernizr v2.7.1
 * www.modernizr.com
 *
 * Copyright (c) Faruk Ates, Paul Irish, Alex Sexton
 * Available under the BSD and MIT licenses: www.modernizr.com/license/
 */

/*
 * Modernizr tests which native CSS3 and HTML5 features are available in
 * the current UA and makes the results available to you in two ways:
 * as properties on a global Modernizr object, and as classes on the
 * <html> element. This information allows you to progressively enhance
 * your pages with a granular level of control over the experience.
 *
 * Modernizr has an optional (not included) conditional resource loader
 * called Modernizr.load(), based on Yepnope.js (yepnopejs.com).
 * To get a build that includes Modernizr.load(), as well as choosing
 * which tests to include, go to www.modernizr.com/download/
 *
 * Authors        Faruk Ates, Paul Irish, Alex Sexton
 * Contributors   Ryan Seddon, Ben Alman
 */

window.Modernizr = (function( window, document, undefined ) {

    var version = '2.7.1',

    Modernizr = {},

    /*>>cssclasses*/
    // option for enabling the HTML classes to be added
    enableClasses = true,
    /*>>cssclasses*/

    docElement = document.documentElement,

    /**
     * Create our "modernizr" element that we do most feature tests on.
     */
    mod = 'modernizr',
    modElem = document.createElement(mod),
    mStyle = modElem.style,

    /**
     * Create the input element for various Web Forms feature tests.
     */
    inputElem /*>>inputelem*/ = document.createElement('input') /*>>inputelem*/ ,

    /*>>smile*/
    smile = ':)',
    /*>>smile*/

    toString = {}.toString,

    // TODO :: make the prefixes more granular
    /*>>prefixes*/
    // List of property values to set for css tests. See ticket #21
    prefixes = ' -webkit- -moz- -o- -ms- '.split(' '),
    /*>>prefixes*/

    /*>>domprefixes*/
    // Following spec is to expose vendor-specific style properties as:
    //   elem.style.WebkitBorderRadius
    // and the following would be incorrect:
    //   elem.style.webkitBorderRadius

    // Webkit ghosts their properties in lowercase but Opera & Moz do not.
    // Microsoft uses a lowercase `ms` instead of the correct `Ms` in IE8+
    //   erik.eae.net/archives/2008/03/10/21.48.10/

    // More here: github.com/Modernizr/Modernizr/issues/issue/21
    omPrefixes = 'Webkit Moz O ms',

    cssomPrefixes = omPrefixes.split(' '),

    domPrefixes = omPrefixes.toLowerCase().split(' '),
    /*>>domprefixes*/

    /*>>ns*/
    ns = {'svg': 'http://www.w3.org/2000/svg'},
    /*>>ns*/

    tests = {},
    inputs = {},
    attrs = {},

    classes = [],

    slice = classes.slice,

    featureName, // used in testing loop


    /*>>teststyles*/
    // Inject element with style element and some CSS rules
    injectElementWithStyles = function( rule, callback, nodes, testnames ) {

      var style, ret, node, docOverflow,
          div = document.createElement('div'),
          // After page load injecting a fake body doesn't work so check if body exists
          body = document.body,
          // IE6 and 7 won't return offsetWidth or offsetHeight unless it's in the body element, so we fake it.
          fakeBody = body || document.createElement('body');

      if ( parseInt(nodes, 10) ) {
          // In order not to give false positives we create a node for each test
          // This also allows the method to scale for unspecified uses
          while ( nodes-- ) {
              node = document.createElement('div');
              node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
              div.appendChild(node);
          }
      }

      // <style> elements in IE6-9 are considered 'NoScope' elements and therefore will be removed
      // when injected with innerHTML. To get around this you need to prepend the 'NoScope' element
      // with a 'scoped' element, in our case the soft-hyphen entity as it won't mess with our measurements.
      // msdn.microsoft.com/en-us/library/ms533897%28VS.85%29.aspx
      // Documents served as xml will throw if using &shy; so use xml friendly encoded version. See issue #277
      style = ['&#173;','<style id="s', mod, '">', rule, '</style>'].join('');
      div.id = mod;
      // IE6 will false positive on some tests due to the style element inside the test div somehow interfering offsetHeight, so insert it into body or fakebody.
      // Opera will act all quirky when injecting elements in documentElement when page is served as xml, needs fakebody too. #270
      (body ? div : fakeBody).innerHTML += style;
      fakeBody.appendChild(div);
      if ( !body ) {
          //avoid crashing IE8, if background image is used
          fakeBody.style.background = '';
          //Safari 5.13/5.1.4 OSX stops loading if ::-webkit-scrollbar is used and scrollbars are visible
          fakeBody.style.overflow = 'hidden';
          docOverflow = docElement.style.overflow;
          docElement.style.overflow = 'hidden';
          docElement.appendChild(fakeBody);
      }

      ret = callback(div, rule);
      // If this is done after page load we don't want to remove the body so check if body exists
      if ( !body ) {
          fakeBody.parentNode.removeChild(fakeBody);
          docElement.style.overflow = docOverflow;
      } else {
          div.parentNode.removeChild(div);
      }

      return !!ret;

    },
    /*>>teststyles*/

    /*>>mq*/
    // adapted from matchMedia polyfill
    // by Scott Jehl and Paul Irish
    // gist.github.com/786768
    testMediaQuery = function( mq ) {

      var matchMedia = window.matchMedia || window.msMatchMedia;
      if ( matchMedia ) {
        return matchMedia(mq).matches;
      }

      var bool;

      injectElementWithStyles('@media ' + mq + ' { #' + mod + ' { position: absolute; } }', function( node ) {
        bool = (window.getComputedStyle ?
                  getComputedStyle(node, null) :
                  node.currentStyle)['position'] == 'absolute';
      });

      return bool;

     },
     /*>>mq*/


    /*>>hasevent*/
    //
    // isEventSupported determines if a given element supports the given event
    // kangax.github.com/iseventsupported/
    //
    // The following results are known incorrects:
    //   Modernizr.hasEvent("webkitTransitionEnd", elem) // false negative
    //   Modernizr.hasEvent("textInput") // in Webkit. github.com/Modernizr/Modernizr/issues/333
    //   ...
    isEventSupported = (function() {

      var TAGNAMES = {
        'select': 'input', 'change': 'input',
        'submit': 'form', 'reset': 'form',
        'error': 'img', 'load': 'img', 'abort': 'img'
      };

      function isEventSupported( eventName, element ) {

        element = element || document.createElement(TAGNAMES[eventName] || 'div');
        eventName = 'on' + eventName;

        // When using `setAttribute`, IE skips "unload", WebKit skips "unload" and "resize", whereas `in` "catches" those
        var isSupported = eventName in element;

        if ( !isSupported ) {
          // If it has no `setAttribute` (i.e. doesn't implement Node interface), try generic element
          if ( !element.setAttribute ) {
            element = document.createElement('div');
          }
          if ( element.setAttribute && element.removeAttribute ) {
            element.setAttribute(eventName, '');
            isSupported = is(element[eventName], 'function');

            // If property was created, "remove it" (by setting value to `undefined`)
            if ( !is(element[eventName], 'undefined') ) {
              element[eventName] = undefined;
            }
            element.removeAttribute(eventName);
          }
        }

        element = null;
        return isSupported;
      }
      return isEventSupported;
    })(),
    /*>>hasevent*/

    // TODO :: Add flag for hasownprop ? didn't last time

    // hasOwnProperty shim by kangax needed for Safari 2.0 support
    _hasOwnProperty = ({}).hasOwnProperty, hasOwnProp;

    if ( !is(_hasOwnProperty, 'undefined') && !is(_hasOwnProperty.call, 'undefined') ) {
      hasOwnProp = function (object, property) {
        return _hasOwnProperty.call(object, property);
      };
    }
    else {
      hasOwnProp = function (object, property) { /* yes, this can give false positives/negatives, but most of the time we don't care about those */
        return ((property in object) && is(object.constructor.prototype[property], 'undefined'));
      };
    }

    // Adapted from ES5-shim https://github.com/kriskowal/es5-shim/blob/master/es5-shim.js
    // es5.github.com/#x15.3.4.5

    if (!Function.prototype.bind) {
      Function.prototype.bind = function bind(that) {

        var target = this;

        if (typeof target != "function") {
            throw new TypeError();
        }

        var args = slice.call(arguments, 1),
            bound = function () {

            if (this instanceof bound) {

              var F = function(){};
              F.prototype = target.prototype;
              var self = new F();

              var result = target.apply(
                  self,
                  args.concat(slice.call(arguments))
              );
              if (Object(result) === result) {
                  return result;
              }
              return self;

            } else {

              return target.apply(
                  that,
                  args.concat(slice.call(arguments))
              );

            }

        };

        return bound;
      };
    }

    /**
     * setCss applies given styles to the Modernizr DOM node.
     */
    function setCss( str ) {
        mStyle.cssText = str;
    }

    /**
     * setCssAll extrapolates all vendor-specific css strings.
     */
    function setCssAll( str1, str2 ) {
        return setCss(prefixes.join(str1 + ';') + ( str2 || '' ));
    }

    /**
     * is returns a boolean for if typeof obj is exactly type.
     */
    function is( obj, type ) {
        return typeof obj === type;
    }

    /**
     * contains returns a boolean for if substr is found within str.
     */
    function contains( str, substr ) {
        return !!~('' + str).indexOf(substr);
    }

    /*>>testprop*/

    // testProps is a generic CSS / DOM property test.

    // In testing support for a given CSS property, it's legit to test:
    //    `elem.style[styleName] !== undefined`
    // If the property is supported it will return an empty string,
    // if unsupported it will return undefined.

    // We'll take advantage of this quick test and skip setting a style
    // on our modernizr element, but instead just testing undefined vs
    // empty string.

    // Because the testing of the CSS property names (with "-", as
    // opposed to the camelCase DOM properties) is non-portable and
    // non-standard but works in WebKit and IE (but not Gecko or Opera),
    // we explicitly reject properties with dashes so that authors
    // developing in WebKit or IE first don't end up with
    // browser-specific content by accident.

    function testProps( props, prefixed ) {
        for ( var i in props ) {
            var prop = props[i];
            if ( !contains(prop, "-") && mStyle[prop] !== undefined ) {
                return prefixed == 'pfx' ? prop : true;
            }
        }
        return false;
    }
    /*>>testprop*/

    // TODO :: add testDOMProps
    /**
     * testDOMProps is a generic DOM property test; if a browser supports
     *   a certain property, it won't return undefined for it.
     */
    function testDOMProps( props, obj, elem ) {
        for ( var i in props ) {
            var item = obj[props[i]];
            if ( item !== undefined) {

                // return the property name as a string
                if (elem === false) return props[i];

                // let's bind a function
                if (is(item, 'function')){
                  // default to autobind unless override
                  return item.bind(elem || obj);
                }

                // return the unbound function or obj or value
                return item;
            }
        }
        return false;
    }

    /*>>testallprops*/
    /**
     * testPropsAll tests a list of DOM properties we want to check against.
     *   We specify literally ALL possible (known and/or likely) properties on
     *   the element including the non-vendor prefixed one, for forward-
     *   compatibility.
     */
    function testPropsAll( prop, prefixed, elem ) {

        var ucProp  = prop.charAt(0).toUpperCase() + prop.slice(1),
            props   = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');

        // did they call .prefixed('boxSizing') or are we just testing a prop?
        if(is(prefixed, "string") || is(prefixed, "undefined")) {
          return testProps(props, prefixed);

        // otherwise, they called .prefixed('requestAnimationFrame', window[, elem])
        } else {
          props = (prop + ' ' + (domPrefixes).join(ucProp + ' ') + ucProp).split(' ');
          return testDOMProps(props, prefixed, elem);
        }
    }
    /*>>testallprops*/


    /**
     * Tests
     * -----
     */

    // The *new* flexbox
    // dev.w3.org/csswg/css3-flexbox

    tests['flexbox'] = function() {
      return testPropsAll('flexWrap');
    };

    // The *old* flexbox
    // www.w3.org/TR/2009/WD-css3-flexbox-20090723/

    tests['flexboxlegacy'] = function() {
        return testPropsAll('boxDirection');
    };

    // On the S60 and BB Storm, getContext exists, but always returns undefined
    // so we actually have to call getContext() to verify
    // github.com/Modernizr/Modernizr/issues/issue/97/

    tests['canvas'] = function() {
        var elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));
    };

    tests['canvastext'] = function() {
        return !!(Modernizr['canvas'] && is(document.createElement('canvas').getContext('2d').fillText, 'function'));
    };

    // webk.it/70117 is tracking a legit WebGL feature detect proposal

    // We do a soft detect which may false positive in order to avoid
    // an expensive context creation: bugzil.la/732441

    tests['webgl'] = function() {
        return !!window.WebGLRenderingContext;
    };

    /*
     * The Modernizr.touch test only indicates if the browser supports
     *    touch events, which does not necessarily reflect a touchscreen
     *    device, as evidenced by tablets running Windows 7 or, alas,
     *    the Palm Pre / WebOS (touch) phones.
     *
     * Additionally, Chrome (desktop) used to lie about its support on this,
     *    but that has since been rectified: crbug.com/36415
     *
     * We also test for Firefox 4 Multitouch Support.
     *
     * For more info, see: modernizr.github.com/Modernizr/touch.html
     */

    tests['touch'] = function() {
        var bool;

        if(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
          bool = true;
        } else {
          injectElementWithStyles(['@media (',prefixes.join('touch-enabled),('),mod,')','{#modernizr{top:9px;position:absolute}}'].join(''), function( node ) {
            bool = node.offsetTop === 9;
          });
        }

        return bool;
    };


    // geolocation is often considered a trivial feature detect...
    // Turns out, it's quite tricky to get right:
    //
    // Using !!navigator.geolocation does two things we don't want. It:
    //   1. Leaks memory in IE9: github.com/Modernizr/Modernizr/issues/513
    //   2. Disables page caching in WebKit: webk.it/43956
    //
    // Meanwhile, in Firefox < 8, an about:config setting could expose
    // a false positive that would throw an exception: bugzil.la/688158

    tests['geolocation'] = function() {
        return 'geolocation' in navigator;
    };


    tests['postmessage'] = function() {
      return !!window.postMessage;
    };


    // Chrome incognito mode used to throw an exception when using openDatabase
    // It doesn't anymore.
    tests['websqldatabase'] = function() {
      return !!window.openDatabase;
    };

    // Vendors had inconsistent prefixing with the experimental Indexed DB:
    // - Webkit's implementation is accessible through webkitIndexedDB
    // - Firefox shipped moz_indexedDB before FF4b9, but since then has been mozIndexedDB
    // For speed, we don't test the legacy (and beta-only) indexedDB
    tests['indexedDB'] = function() {
      return !!testPropsAll("indexedDB", window);
    };

    // documentMode logic from YUI to filter out IE8 Compat Mode
    //   which false positives.
    tests['hashchange'] = function() {
      return isEventSupported('hashchange', window) && (document.documentMode === undefined || document.documentMode > 7);
    };

    // Per 1.6:
    // This used to be Modernizr.historymanagement but the longer
    // name has been deprecated in favor of a shorter and property-matching one.
    // The old API is still available in 1.6, but as of 2.0 will throw a warning,
    // and in the first release thereafter disappear entirely.
    tests['history'] = function() {
      return !!(window.history && history.pushState);
    };

    tests['draganddrop'] = function() {
        var div = document.createElement('div');
        return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
    };

    // FF3.6 was EOL'ed on 4/24/12, but the ESR version of FF10
    // will be supported until FF19 (2/12/13), at which time, ESR becomes FF17.
    // FF10 still uses prefixes, so check for it until then.
    // for more ESR info, see: mozilla.org/en-US/firefox/organizations/faq/
    tests['websockets'] = function() {
        return 'WebSocket' in window || 'MozWebSocket' in window;
    };


    // css-tricks.com/rgba-browser-support/
    tests['rgba'] = function() {
        // Set an rgba() color and check the returned value

        setCss('background-color:rgba(150,255,150,.5)');

        return contains(mStyle.backgroundColor, 'rgba');
    };

    tests['hsla'] = function() {
        // Same as rgba(), in fact, browsers re-map hsla() to rgba() internally,
        //   except IE9 who retains it as hsla

        setCss('background-color:hsla(120,40%,100%,.5)');

        return contains(mStyle.backgroundColor, 'rgba') || contains(mStyle.backgroundColor, 'hsla');
    };

    tests['multiplebgs'] = function() {
        // Setting multiple images AND a color on the background shorthand property
        //  and then querying the style.background property value for the number of
        //  occurrences of "url(" is a reliable method for detecting ACTUAL support for this!

        setCss('background:url(https://),url(https://),red url(https://)');

        // If the UA supports multiple backgrounds, there should be three occurrences
        //   of the string "url(" in the return value for elemStyle.background

        return (/(url\s*\(.*?){3}/).test(mStyle.background);
    };



    // this will false positive in Opera Mini
    //   github.com/Modernizr/Modernizr/issues/396

    tests['backgroundsize'] = function() {
        return testPropsAll('backgroundSize');
    };

    tests['borderimage'] = function() {
        return testPropsAll('borderImage');
    };


    // Super comprehensive table about all the unique implementations of
    // border-radius: muddledramblings.com/table-of-css3-border-radius-compliance

    tests['borderradius'] = function() {
        return testPropsAll('borderRadius');
    };

    // WebOS unfortunately false positives on this test.
    tests['boxshadow'] = function() {
        return testPropsAll('boxShadow');
    };

    // FF3.0 will false positive on this test
    tests['textshadow'] = function() {
        return document.createElement('div').style.textShadow === '';
    };


    tests['opacity'] = function() {
        // Browsers that actually have CSS Opacity implemented have done so
        //  according to spec, which means their return values are within the
        //  range of [0.0,1.0] - including the leading zero.

        setCssAll('opacity:.55');

        // The non-literal . in this regex is intentional:
        //   German Chrome returns this value as 0,55
        // github.com/Modernizr/Modernizr/issues/#issue/59/comment/516632
        return (/^0.55$/).test(mStyle.opacity);
    };


    // Note, Android < 4 will pass this test, but can only animate
    //   a single property at a time
    //   daneden.me/2011/12/putting-up-with-androids-bullshit/
    tests['cssanimations'] = function() {
        return testPropsAll('animationName');
    };


    tests['csscolumns'] = function() {
        return testPropsAll('columnCount');
    };


    tests['cssgradients'] = function() {
        /**
         * For CSS Gradients syntax, please see:
         * webkit.org/blog/175/introducing-css-gradients/
         * developer.mozilla.org/en/CSS/-moz-linear-gradient
         * developer.mozilla.org/en/CSS/-moz-radial-gradient
         * dev.w3.org/csswg/css3-images/#gradients-
         */

        var str1 = 'background-image:',
            str2 = 'gradient(linear,left top,right bottom,from(#9f9),to(white));',
            str3 = 'linear-gradient(left top,#9f9, white);';

        setCss(
             // legacy webkit syntax (FIXME: remove when syntax not in use anymore)
              (str1 + '-webkit- '.split(' ').join(str2 + str1) +
             // standard syntax             // trailing 'background-image:'
              prefixes.join(str3 + str1)).slice(0, -str1.length)
        );

        return contains(mStyle.backgroundImage, 'gradient');
    };


    tests['cssreflections'] = function() {
        return testPropsAll('boxReflect');
    };


    tests['csstransforms'] = function() {
        return !!testPropsAll('transform');
    };


    tests['csstransforms3d'] = function() {

        var ret = !!testPropsAll('perspective');

        // Webkit's 3D transforms are passed off to the browser's own graphics renderer.
        //   It works fine in Safari on Leopard and Snow Leopard, but not in Chrome in
        //   some conditions. As a result, Webkit typically recognizes the syntax but
        //   will sometimes throw a false positive, thus we must do a more thorough check:
        if ( ret && 'webkitPerspective' in docElement.style ) {

          // Webkit allows this media query to succeed only if the feature is enabled.
          // `@media (transform-3d),(-webkit-transform-3d){ ... }`
          injectElementWithStyles('@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}', function( node, rule ) {
            ret = node.offsetLeft === 9 && node.offsetHeight === 3;
          });
        }
        return ret;
    };


    tests['csstransitions'] = function() {
        return testPropsAll('transition');
    };


    /*>>fontface*/
    // @font-face detection routine by Diego Perini
    // javascript.nwbox.com/CSSSupport/

    // false positives:
    //   WebOS github.com/Modernizr/Modernizr/issues/342
    //   WP7   github.com/Modernizr/Modernizr/issues/538
    tests['fontface'] = function() {
        var bool;

        injectElementWithStyles('@font-face {font-family:"font";src:url("https://")}', function( node, rule ) {
          var style = document.getElementById('smodernizr'),
              sheet = style.sheet || style.styleSheet,
              cssText = sheet ? (sheet.cssRules && sheet.cssRules[0] ? sheet.cssRules[0].cssText : sheet.cssText || '') : '';

          bool = /src/i.test(cssText) && cssText.indexOf(rule.split(' ')[0]) === 0;
        });

        return bool;
    };
    /*>>fontface*/

    // CSS generated content detection
    tests['generatedcontent'] = function() {
        var bool;

        injectElementWithStyles(['#',mod,'{font:0/0 a}#',mod,':after{content:"',smile,'";visibility:hidden;font:3px/1 a}'].join(''), function( node ) {
          bool = node.offsetHeight >= 3;
        });

        return bool;
    };



    // These tests evaluate support of the video/audio elements, as well as
    // testing what types of content they support.
    //
    // We're using the Boolean constructor here, so that we can extend the value
    // e.g.  Modernizr.video     // true
    //       Modernizr.video.ogg // 'probably'
    //
    // Codec values from : github.com/NielsLeenheer/html5test/blob/9106a8/index.html#L845
    //                     thx to NielsLeenheer and zcorpan

    // Note: in some older browsers, "no" was a return value instead of empty string.
    //   It was live in FF3.5.0 and 3.5.1, but fixed in 3.5.2
    //   It was also live in Safari 4.0.0 - 4.0.4, but fixed in 4.0.5

    tests['video'] = function() {
        var elem = document.createElement('video'),
            bool = false;

        // IE9 Running on Windows Server SKU can cause an exception to be thrown, bug #224
        try {
            if ( bool = !!elem.canPlayType ) {
                bool      = new Boolean(bool);
                bool.ogg  = elem.canPlayType('video/ogg; codecs="theora"')      .replace(/^no$/,'');

                // Without QuickTime, this value will be `undefined`. github.com/Modernizr/Modernizr/issues/546
                bool.h264 = elem.canPlayType('video/mp4; codecs="avc1.42E01E"') .replace(/^no$/,'');

                bool.webm = elem.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/,'');
            }

        } catch(e) { }

        return bool;
    };

    tests['audio'] = function() {
        var elem = document.createElement('audio'),
            bool = false;

        try {
            if ( bool = !!elem.canPlayType ) {
                bool      = new Boolean(bool);
                bool.ogg  = elem.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,'');
                bool.mp3  = elem.canPlayType('audio/mpeg;')               .replace(/^no$/,'');

                // Mimetypes accepted:
                //   developer.mozilla.org/En/Media_formats_supported_by_the_audio_and_video_elements
                //   bit.ly/iphoneoscodecs
                bool.wav  = elem.canPlayType('audio/wav; codecs="1"')     .replace(/^no$/,'');
                bool.m4a  = ( elem.canPlayType('audio/x-m4a;')            ||
                              elem.canPlayType('audio/aac;'))             .replace(/^no$/,'');
            }
        } catch(e) { }

        return bool;
    };


    // In FF4, if disabled, window.localStorage should === null.

    // Normally, we could not test that directly and need to do a
    //   `('localStorage' in window) && ` test first because otherwise Firefox will
    //   throw bugzil.la/365772 if cookies are disabled

    // Also in iOS5 Private Browsing mode, attempting to use localStorage.setItem
    // will throw the exception:
    //   QUOTA_EXCEEDED_ERRROR DOM Exception 22.
    // Peculiarly, getItem and removeItem calls do not throw.

    // Because we are forced to try/catch this, we'll go aggressive.

    // Just FWIW: IE8 Compat mode supports these features completely:
    //   www.quirksmode.org/dom/html5.html
    // But IE8 doesn't support either with local files

    tests['localstorage'] = function() {
        try {
            localStorage.setItem(mod, mod);
            localStorage.removeItem(mod);
            return true;
        } catch(e) {
            return false;
        }
    };

    tests['sessionstorage'] = function() {
        try {
            sessionStorage.setItem(mod, mod);
            sessionStorage.removeItem(mod);
            return true;
        } catch(e) {
            return false;
        }
    };


    tests['webworkers'] = function() {
        return !!window.Worker;
    };


    tests['applicationcache'] = function() {
        return !!window.applicationCache;
    };


    // Thanks to Erik Dahlstrom
    tests['svg'] = function() {
        return !!document.createElementNS && !!document.createElementNS(ns.svg, 'svg').createSVGRect;
    };

    // specifically for SVG inline in HTML, not within XHTML
    // test page: paulirish.com/demo/inline-svg
    tests['inlinesvg'] = function() {
      var div = document.createElement('div');
      div.innerHTML = '<svg/>';
      return (div.firstChild && div.firstChild.namespaceURI) == ns.svg;
    };

    // SVG SMIL animation
    tests['smil'] = function() {
        return !!document.createElementNS && /SVGAnimate/.test(toString.call(document.createElementNS(ns.svg, 'animate')));
    };

    // This test is only for clip paths in SVG proper, not clip paths on HTML content
    // demo: srufaculty.sru.edu/david.dailey/svg/newstuff/clipPath4.svg

    // However read the comments to dig into applying SVG clippaths to HTML content here:
    //   github.com/Modernizr/Modernizr/issues/213#issuecomment-1149491
    tests['svgclippaths'] = function() {
        return !!document.createElementNS && /SVGClipPath/.test(toString.call(document.createElementNS(ns.svg, 'clipPath')));
    };

    /*>>webforms*/
    // input features and input types go directly onto the ret object, bypassing the tests loop.
    // Hold this guy to execute in a moment.
    function webforms() {
        /*>>input*/
        // Run through HTML5's new input attributes to see if the UA understands any.
        // We're using f which is the <input> element created early on
        // Mike Taylr has created a comprehensive resource for testing these attributes
        //   when applied to all input types:
        //   miketaylr.com/code/input-type-attr.html
        // spec: www.whatwg.org/specs/web-apps/current-work/multipage/the-input-element.html#input-type-attr-summary

        // Only input placeholder is tested while textarea's placeholder is not.
        // Currently Safari 4 and Opera 11 have support only for the input placeholder
        // Both tests are available in feature-detects/forms-placeholder.js
        Modernizr['input'] = (function( props ) {
            for ( var i = 0, len = props.length; i < len; i++ ) {
                attrs[ props[i] ] = !!(props[i] in inputElem);
            }
            if (attrs.list){
              // safari false positive's on datalist: webk.it/74252
              // see also github.com/Modernizr/Modernizr/issues/146
              attrs.list = !!(document.createElement('datalist') && window.HTMLDataListElement);
            }
            return attrs;
        })('autocomplete autofocus list placeholder max min multiple pattern required step'.split(' '));
        /*>>input*/

        /*>>inputtypes*/
        // Run through HTML5's new input types to see if the UA understands any.
        //   This is put behind the tests runloop because it doesn't return a
        //   true/false like all the other tests; instead, it returns an object
        //   containing each input type with its corresponding true/false value

        // Big thanks to @miketaylr for the html5 forms expertise. miketaylr.com/
        Modernizr['inputtypes'] = (function(props) {

            for ( var i = 0, bool, inputElemType, defaultView, len = props.length; i < len; i++ ) {

                inputElem.setAttribute('type', inputElemType = props[i]);
                bool = inputElem.type !== 'text';

                // We first check to see if the type we give it sticks..
                // If the type does, we feed it a textual value, which shouldn't be valid.
                // If the value doesn't stick, we know there's input sanitization which infers a custom UI
                if ( bool ) {

                    inputElem.value         = smile;
                    inputElem.style.cssText = 'position:absolute;visibility:hidden;';

                    if ( /^range$/.test(inputElemType) && inputElem.style.WebkitAppearance !== undefined ) {

                      docElement.appendChild(inputElem);
                      defaultView = document.defaultView;

                      // Safari 2-4 allows the smiley as a value, despite making a slider
                      bool =  defaultView.getComputedStyle &&
                              defaultView.getComputedStyle(inputElem, null).WebkitAppearance !== 'textfield' &&
                              // Mobile android web browser has false positive, so must
                              // check the height to see if the widget is actually there.
                              (inputElem.offsetHeight !== 0);

                      docElement.removeChild(inputElem);

                    } else if ( /^(search|tel)$/.test(inputElemType) ){
                      // Spec doesn't define any special parsing or detectable UI
                      //   behaviors so we pass these through as true

                      // Interestingly, opera fails the earlier test, so it doesn't
                      //  even make it here.

                    } else if ( /^(url|email)$/.test(inputElemType) ) {
                      // Real url and email support comes with prebaked validation.
                      bool = inputElem.checkValidity && inputElem.checkValidity() === false;

                    } else {
                      // If the upgraded input compontent rejects the :) text, we got a winner
                      bool = inputElem.value != smile;
                    }
                }

                inputs[ props[i] ] = !!bool;
            }
            return inputs;
        })('search tel url email datetime date month week time datetime-local number range color'.split(' '));
        /*>>inputtypes*/
    }
    /*>>webforms*/


    // End of test definitions
    // -----------------------



    // Run through all tests and detect their support in the current UA.
    // todo: hypothetically we could be doing an array of tests and use a basic loop here.
    for ( var feature in tests ) {
        if ( hasOwnProp(tests, feature) ) {
            // run the test, throw the return value into the Modernizr,
            //   then based on that boolean, define an appropriate className
            //   and push it into an array of classes we'll join later.
            featureName  = feature.toLowerCase();
            Modernizr[featureName] = tests[feature]();

            classes.push((Modernizr[featureName] ? '' : 'no-') + featureName);
        }
    }

    /*>>webforms*/
    // input tests need to run.
    Modernizr.input || webforms();
    /*>>webforms*/


    /**
     * addTest allows the user to define their own feature tests
     * the result will be added onto the Modernizr object,
     * as well as an appropriate className set on the html element
     *
     * @param feature - String naming the feature
     * @param test - Function returning true if feature is supported, false if not
     */
     Modernizr.addTest = function ( feature, test ) {
       if ( typeof feature == 'object' ) {
         for ( var key in feature ) {
           if ( hasOwnProp( feature, key ) ) {
             Modernizr.addTest( key, feature[ key ] );
           }
         }
       } else {

         feature = feature.toLowerCase();

         if ( Modernizr[feature] !== undefined ) {
           // we're going to quit if you're trying to overwrite an existing test
           // if we were to allow it, we'd do this:
           //   var re = new RegExp("\\b(no-)?" + feature + "\\b");
           //   docElement.className = docElement.className.replace( re, '' );
           // but, no rly, stuff 'em.
           return Modernizr;
         }

         test = typeof test == 'function' ? test() : test;

         if (typeof enableClasses !== "undefined" && enableClasses) {
           docElement.className += ' ' + (test ? '' : 'no-') + feature;
         }
         Modernizr[feature] = test;

       }

       return Modernizr; // allow chaining.
     };


    // Reset modElem.cssText to nothing to reduce memory footprint.
    setCss('');
    modElem = inputElem = null;

    /*>>shiv*/
    /**
     * @preserve HTML5 Shiv prev3.7.1 | @afarkas @jdalton @jon_neal @rem | MIT/GPL2 Licensed
     */
    ;(function(window, document) {
        /*jshint evil:true */
        /** version */
        var version = '3.7.0';

        /** Preset options */
        var options = window.html5 || {};

        /** Used to skip problem elements */
        var reSkip = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i;

        /** Not all elements can be cloned in IE **/
        var saveClones = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i;

        /** Detect whether the browser supports default html5 styles */
        var supportsHtml5Styles;

        /** Name of the expando, to work with multiple documents or to re-shiv one document */
        var expando = '_html5shiv';

        /** The id for the the documents expando */
        var expanID = 0;

        /** Cached data for each document */
        var expandoData = {};

        /** Detect whether the browser supports unknown elements */
        var supportsUnknownElements;

        (function() {
          try {
            var a = document.createElement('a');
            a.innerHTML = '<xyz></xyz>';
            //if the hidden property is implemented we can assume, that the browser supports basic HTML5 Styles
            supportsHtml5Styles = ('hidden' in a);

            supportsUnknownElements = a.childNodes.length == 1 || (function() {
              // assign a false positive if unable to shiv
              (document.createElement)('a');
              var frag = document.createDocumentFragment();
              return (
                typeof frag.cloneNode == 'undefined' ||
                typeof frag.createDocumentFragment == 'undefined' ||
                typeof frag.createElement == 'undefined'
              );
            }());
          } catch(e) {
            // assign a false positive if detection fails => unable to shiv
            supportsHtml5Styles = true;
            supportsUnknownElements = true;
          }

        }());

        /*--------------------------------------------------------------------------*/

        /**
         * Creates a style sheet with the given CSS text and adds it to the document.
         * @private
         * @param {Document} ownerDocument The document.
         * @param {String} cssText The CSS text.
         * @returns {StyleSheet} The style element.
         */
        function addStyleSheet(ownerDocument, cssText) {
          var p = ownerDocument.createElement('p'),
          parent = ownerDocument.getElementsByTagName('head')[0] || ownerDocument.documentElement;

          p.innerHTML = 'x<style>' + cssText + '</style>';
          return parent.insertBefore(p.lastChild, parent.firstChild);
        }

        /**
         * Returns the value of `html5.elements` as an array.
         * @private
         * @returns {Array} An array of shived element node names.
         */
        function getElements() {
          var elements = html5.elements;
          return typeof elements == 'string' ? elements.split(' ') : elements;
        }

        /**
         * Returns the data associated to the given document
         * @private
         * @param {Document} ownerDocument The document.
         * @returns {Object} An object of data.
         */
        function getExpandoData(ownerDocument) {
          var data = expandoData[ownerDocument[expando]];
          if (!data) {
            data = {};
            expanID++;
            ownerDocument[expando] = expanID;
            expandoData[expanID] = data;
          }
          return data;
        }

        /**
         * returns a shived element for the given nodeName and document
         * @memberOf html5
         * @param {String} nodeName name of the element
         * @param {Document} ownerDocument The context document.
         * @returns {Object} The shived element.
         */
        function createElement(nodeName, ownerDocument, data){
          if (!ownerDocument) {
            ownerDocument = document;
          }
          if(supportsUnknownElements){
            return ownerDocument.createElement(nodeName);
          }
          if (!data) {
            data = getExpandoData(ownerDocument);
          }
          var node;

          if (data.cache[nodeName]) {
            node = data.cache[nodeName].cloneNode();
          } else if (saveClones.test(nodeName)) {
            node = (data.cache[nodeName] = data.createElem(nodeName)).cloneNode();
          } else {
            node = data.createElem(nodeName);
          }

          // Avoid adding some elements to fragments in IE < 9 because
          // * Attributes like `name` or `type` cannot be set/changed once an element
          //   is inserted into a document/fragment
          // * Link elements with `src` attributes that are inaccessible, as with
          //   a 403 response, will cause the tab/window to crash
          // * Script elements appended to fragments will execute when their `src`
          //   or `text` property is set
          return node.canHaveChildren && !reSkip.test(nodeName) && !node.tagUrn ? data.frag.appendChild(node) : node;
        }

        /**
         * returns a shived DocumentFragment for the given document
         * @memberOf html5
         * @param {Document} ownerDocument The context document.
         * @returns {Object} The shived DocumentFragment.
         */
        function createDocumentFragment(ownerDocument, data){
          if (!ownerDocument) {
            ownerDocument = document;
          }
          if(supportsUnknownElements){
            return ownerDocument.createDocumentFragment();
          }
          data = data || getExpandoData(ownerDocument);
          var clone = data.frag.cloneNode(),
          i = 0,
          elems = getElements(),
          l = elems.length;
          for(;i<l;i++){
            clone.createElement(elems[i]);
          }
          return clone;
        }

        /**
         * Shivs the `createElement` and `createDocumentFragment` methods of the document.
         * @private
         * @param {Document|DocumentFragment} ownerDocument The document.
         * @param {Object} data of the document.
         */
        function shivMethods(ownerDocument, data) {
          if (!data.cache) {
            data.cache = {};
            data.createElem = ownerDocument.createElement;
            data.createFrag = ownerDocument.createDocumentFragment;
            data.frag = data.createFrag();
          }


          ownerDocument.createElement = function(nodeName) {
            //abort shiv
            if (!html5.shivMethods) {
              return data.createElem(nodeName);
            }
            return createElement(nodeName, ownerDocument, data);
          };

          ownerDocument.createDocumentFragment = Function('h,f', 'return function(){' +
                                                          'var n=f.cloneNode(),c=n.createElement;' +
                                                          'h.shivMethods&&(' +
                                                          // unroll the `createElement` calls
                                                          getElements().join().replace(/[\w\-]+/g, function(nodeName) {
            data.createElem(nodeName);
            data.frag.createElement(nodeName);
            return 'c("' + nodeName + '")';
          }) +
            ');return n}'
                                                         )(html5, data.frag);
        }

        /*--------------------------------------------------------------------------*/

        /**
         * Shivs the given document.
         * @memberOf html5
         * @param {Document} ownerDocument The document to shiv.
         * @returns {Document} The shived document.
         */
        function shivDocument(ownerDocument) {
          if (!ownerDocument) {
            ownerDocument = document;
          }
          var data = getExpandoData(ownerDocument);

          if (html5.shivCSS && !supportsHtml5Styles && !data.hasCSS) {
            data.hasCSS = !!addStyleSheet(ownerDocument,
                                          // corrects block display not defined in IE6/7/8/9
                                          'article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}' +
                                            // adds styling not present in IE6/7/8/9
                                            'mark{background:#FF0;color:#000}' +
                                            // hides non-rendered elements
                                            'template{display:none}'
                                         );
          }
          if (!supportsUnknownElements) {
            shivMethods(ownerDocument, data);
          }
          return ownerDocument;
        }

        /*--------------------------------------------------------------------------*/

        /**
         * The `html5` object is exposed so that more elements can be shived and
         * existing shiving can be detected on iframes.
         * @type Object
         * @example
         *
         * // options can be changed before the script is included
         * html5 = { 'elements': 'mark section', 'shivCSS': false, 'shivMethods': false };
         */
        var html5 = {

          /**
           * An array or space separated string of node names of the elements to shiv.
           * @memberOf html5
           * @type Array|String
           */
          'elements': options.elements || 'abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video',

          /**
           * current version of html5shiv
           */
          'version': version,

          /**
           * A flag to indicate that the HTML5 style sheet should be inserted.
           * @memberOf html5
           * @type Boolean
           */
          'shivCSS': (options.shivCSS !== false),

          /**
           * Is equal to true if a browser supports creating unknown/HTML5 elements
           * @memberOf html5
           * @type boolean
           */
          'supportsUnknownElements': supportsUnknownElements,

          /**
           * A flag to indicate that the document's `createElement` and `createDocumentFragment`
           * methods should be overwritten.
           * @memberOf html5
           * @type Boolean
           */
          'shivMethods': (options.shivMethods !== false),

          /**
           * A string to describe the type of `html5` object ("default" or "default print").
           * @memberOf html5
           * @type String
           */
          'type': 'default',

          // shivs the document according to the specified `html5` object options
          'shivDocument': shivDocument,

          //creates a shived element
          createElement: createElement,

          //creates a shived documentFragment
          createDocumentFragment: createDocumentFragment
        };

        /*--------------------------------------------------------------------------*/

        // expose html5
        window.html5 = html5;

        // shiv the document
        shivDocument(document);

    }(this, document));
    /*>>shiv*/

    // Assign private properties to the return object with prefix
    Modernizr._version      = version;

    // expose these for the plugin API. Look in the source for how to join() them against your input
    /*>>prefixes*/
    Modernizr._prefixes     = prefixes;
    /*>>prefixes*/
    /*>>domprefixes*/
    Modernizr._domPrefixes  = domPrefixes;
    Modernizr._cssomPrefixes  = cssomPrefixes;
    /*>>domprefixes*/

    /*>>mq*/
    // Modernizr.mq tests a given media query, live against the current state of the window
    // A few important notes:
    //   * If a browser does not support media queries at all (eg. oldIE) the mq() will always return false
    //   * A max-width or orientation query will be evaluated against the current state, which may change later.
    //   * You must specify values. Eg. If you are testing support for the min-width media query use:
    //       Modernizr.mq('(min-width:0)')
    // usage:
    // Modernizr.mq('only screen and (max-width:768)')
    Modernizr.mq            = testMediaQuery;
    /*>>mq*/

    /*>>hasevent*/
    // Modernizr.hasEvent() detects support for a given event, with an optional element to test on
    // Modernizr.hasEvent('gesturestart', elem)
    Modernizr.hasEvent      = isEventSupported;
    /*>>hasevent*/

    /*>>testprop*/
    // Modernizr.testProp() investigates whether a given style property is recognized
    // Note that the property names must be provided in the camelCase variant.
    // Modernizr.testProp('pointerEvents')
    Modernizr.testProp      = function(prop){
        return testProps([prop]);
    };
    /*>>testprop*/

    /*>>testallprops*/
    // Modernizr.testAllProps() investigates whether a given style property,
    //   or any of its vendor-prefixed variants, is recognized
    // Note that the property names must be provided in the camelCase variant.
    // Modernizr.testAllProps('boxSizing')
    Modernizr.testAllProps  = testPropsAll;
    /*>>testallprops*/


    /*>>teststyles*/
    // Modernizr.testStyles() allows you to add custom styles to the document and test an element afterwards
    // Modernizr.testStyles('#modernizr { position:absolute }', function(elem, rule){ ... })
    Modernizr.testStyles    = injectElementWithStyles;
    /*>>teststyles*/


    /*>>prefixed*/
    // Modernizr.prefixed() returns the prefixed or nonprefixed property name variant of your input
    // Modernizr.prefixed('boxSizing') // 'MozBoxSizing'

    // Properties must be passed as dom-style camelcase, rather than `box-sizing` hypentated style.
    // Return values will also be the camelCase variant, if you need to translate that to hypenated style use:
    //
    //     str.replace(/([A-Z])/g, function(str,m1){ return '-' + m1.toLowerCase(); }).replace(/^ms-/,'-ms-');

    // If you're trying to ascertain which transition end event to bind to, you might do something like...
    //
    //     var transEndEventNames = {
    //       'WebkitTransition' : 'webkitTransitionEnd',
    //       'MozTransition'    : 'transitionend',
    //       'OTransition'      : 'oTransitionEnd',
    //       'msTransition'     : 'MSTransitionEnd',
    //       'transition'       : 'transitionend'
    //     },
    //     transEndEventName = transEndEventNames[ Modernizr.prefixed('transition') ];

    Modernizr.prefixed      = function(prop, obj, elem){
      if(!obj) {
        return testPropsAll(prop, 'pfx');
      } else {
        // Testing DOM property e.g. Modernizr.prefixed('requestAnimationFrame', window) // 'mozRequestAnimationFrame'
        return testPropsAll(prop, obj, elem);
      }
    };
    /*>>prefixed*/


    /*>>cssclasses*/
    // Remove "no-js" class from <html> element, if it exists:
    docElement.className = docElement.className.replace(/(^|\s)no-js(\s|$)/, '$1$2') +

                            // Add the new classes to the <html> element.
                            (enableClasses ? ' js ' + classes.join(' ') : '');
    /*>>cssclasses*/

    return Modernizr;

})(this, this.document);
/*! Respond.js v1.4.2: min/max-width media query polyfill * Copyright 2013 Scott Jehl
 * Licensed under https://github.com/scottjehl/Respond/blob/master/LICENSE-MIT
 *  */

!function(a){"use strict";a.matchMedia=a.matchMedia||function(a){var b,c=a.documentElement,d=c.firstElementChild||c.firstChild,e=a.createElement("body"),f=a.createElement("div");return f.id="mq-test-1",f.style.cssText="position:absolute;top:-100em",e.style.background="none",e.appendChild(f),function(a){return f.innerHTML='&shy;<style media="'+a+'"> #mq-test-1 { width: 42px; }</style>',c.insertBefore(e,d),b=42===f.offsetWidth,c.removeChild(e),{matches:b,media:a}}}(a.document)}(this),function(a){"use strict";function b(){u(!0)}var c={};a.respond=c,c.update=function(){};var d=[],e=function(){var b=!1;try{b=new a.XMLHttpRequest}catch(c){b=new a.ActiveXObject("Microsoft.XMLHTTP")}return function(){return b}}(),f=function(a,b){var c=e();c&&(c.open("GET",a,!0),c.onreadystatechange=function(){4!==c.readyState||200!==c.status&&304!==c.status||b(c.responseText)},4!==c.readyState&&c.send(null))};if(c.ajax=f,c.queue=d,c.regex={media:/@media[^\{]+\{([^\{\}]*\{[^\}\{]*\})+/gi,keyframes:/@(?:\-(?:o|moz|webkit)\-)?keyframes[^\{]+\{(?:[^\{\}]*\{[^\}\{]*\})+[^\}]*\}/gi,urls:/(url\()['"]?([^\/\)'"][^:\)'"]+)['"]?(\))/g,findStyles:/@media *([^\{]+)\{([\S\s]+?)$/,only:/(only\s+)?([a-zA-Z]+)\s?/,minw:/\([\s]*min\-width\s*:[\s]*([\s]*[0-9\.]+)(px|em)[\s]*\)/,maxw:/\([\s]*max\-width\s*:[\s]*([\s]*[0-9\.]+)(px|em)[\s]*\)/},c.mediaQueriesSupported=a.matchMedia&&null!==a.matchMedia("only all")&&a.matchMedia("only all").matches,!c.mediaQueriesSupported){var g,h,i,j=a.document,k=j.documentElement,l=[],m=[],n=[],o={},p=30,q=j.getElementsByTagName("head")[0]||k,r=j.getElementsByTagName("base")[0],s=q.getElementsByTagName("link"),t=function(){var a,b=j.createElement("div"),c=j.body,d=k.style.fontSize,e=c&&c.style.fontSize,f=!1;return b.style.cssText="position:absolute;font-size:1em;width:1em",c||(c=f=j.createElement("body"),c.style.background="none"),k.style.fontSize="100%",c.style.fontSize="100%",c.appendChild(b),f&&k.insertBefore(c,k.firstChild),a=b.offsetWidth,f?k.removeChild(c):c.removeChild(b),k.style.fontSize=d,e&&(c.style.fontSize=e),a=i=parseFloat(a)},u=function(b){var c="clientWidth",d=k[c],e="CSS1Compat"===j.compatMode&&d||j.body[c]||d,f={},o=s[s.length-1],r=(new Date).getTime();if(b&&g&&p>r-g)return a.clearTimeout(h),h=a.setTimeout(u,p),void 0;g=r;for(var v in l)if(l.hasOwnProperty(v)){var w=l[v],x=w.minw,y=w.maxw,z=null===x,A=null===y,B="em";x&&(x=parseFloat(x)*(x.indexOf(B)>-1?i||t():1)),y&&(y=parseFloat(y)*(y.indexOf(B)>-1?i||t():1)),w.hasquery&&(z&&A||!(z||e>=x)||!(A||y>=e))||(f[w.media]||(f[w.media]=[]),f[w.media].push(m[w.rules]))}for(var C in n)n.hasOwnProperty(C)&&n[C]&&n[C].parentNode===q&&q.removeChild(n[C]);n.length=0;for(var D in f)if(f.hasOwnProperty(D)){var E=j.createElement("style"),F=f[D].join("\n");E.type="text/css",E.media=D,q.insertBefore(E,o.nextSibling),E.styleSheet?E.styleSheet.cssText=F:E.appendChild(j.createTextNode(F)),n.push(E)}},v=function(a,b,d){var e=a.replace(c.regex.keyframes,"").match(c.regex.media),f=e&&e.length||0;b=b.substring(0,b.lastIndexOf("/"));var g=function(a){return a.replace(c.regex.urls,"$1"+b+"$2$3")},h=!f&&d;b.length&&(b+="/"),h&&(f=1);for(var i=0;f>i;i++){var j,k,n,o;h?(j=d,m.push(g(a))):(j=e[i].match(c.regex.findStyles)&&RegExp.$1,m.push(RegExp.$2&&g(RegExp.$2))),n=j.split(","),o=n.length;for(var p=0;o>p;p++)k=n[p],l.push({media:k.split("(")[0].match(c.regex.only)&&RegExp.$2||"all",rules:m.length-1,hasquery:k.indexOf("(")>-1,minw:k.match(c.regex.minw)&&parseFloat(RegExp.$1)+(RegExp.$2||""),maxw:k.match(c.regex.maxw)&&parseFloat(RegExp.$1)+(RegExp.$2||"")})}u()},w=function(){if(d.length){var b=d.shift();f(b.href,function(c){v(c,b.href,b.media),o[b.href]=!0,a.setTimeout(function(){w()},0)})}},x=function(){for(var b=0;b<s.length;b++){var c=s[b],e=c.href,f=c.media,g=c.rel&&"stylesheet"===c.rel.toLowerCase();e&&g&&!o[e]&&(c.styleSheet&&c.styleSheet.rawCssText?(v(c.styleSheet.rawCssText,e,f),o[e]=!0):(!/^([a-zA-Z:]*\/\/)/.test(e)&&!r||e.replace(RegExp.$1,"").split("/")[0]===a.location.host)&&("//"===e.substring(0,2)&&(e=a.location.protocol+e),d.push({href:e,media:f})))}w()};x(),c.update=x,c.getEmValue=t,a.addEventListener?a.addEventListener("resize",b,!1):a.attachEvent&&a.attachEvent("onresize",b)}}(this);if (typeof window.localStorage == 'undefined' || typeof window.sessionStorage == 'undefined') (function () {

var Storage = function (type) {
  function createCookie(name, value, days) {
    var date, expires;

    if (days) {
      date = new Date();
      date.setTime(date.getTime()+(days*24*60*60*1000));
      expires = "; expires="+date.toGMTString();
    } else {
      expires = "";
    }
    document.cookie = name+"="+value+expires+"; path=/";
  }

  function readCookie(name) {
    var nameEQ = name + "=",
        ca = document.cookie.split(';'),
        i, c;

    for (i=0; i < ca.length; i++) {
      c = ca[i];
      while (c.charAt(0)==' ') {
        c = c.substring(1,c.length);
      }

      if (c.indexOf(nameEQ) == 0) {
        return c.substring(nameEQ.length,c.length);
      }
    }
    return null;
  }
  
  function setData(data) {
    data = JSON.stringify(data);
    if (type == 'session') {
      window.name = data;
    } else {
      createCookie('localStorage', data, 365);
    }
  }
  
  function clearData() {
    if (type == 'session') {
      window.name = '';
    } else {
      createCookie('localStorage', '', 365);
    }
  }
  
  function getData() {
    var data = type == 'session' ? window.name : readCookie('localStorage');
    return data ? JSON.parse(data) : {};
  }


  // initialise if there's already data
  var data = getData();

  return {
    length: 0,
    clear: function () {
      data = {};
      this.length = 0;
      clearData();
    },
    getItem: function (key) {
      return data[key] === undefined ? null : data[key];
    },
    key: function (i) {
      // not perfect, but works
      var ctr = 0;
      for (var k in data) {
        if (ctr == i) return k;
        else ctr++;
      }
      return null;
    },
    removeItem: function (key) {
      delete data[key];
      this.length--;
      setData(data);
    },
    setItem: function (key, value) {
      data[key] = value+''; // forces the value to a string
      this.length++;
      setData(data);
    }
  };
};

if (typeof window.localStorage == 'undefined') window.localStorage = new Storage('local');
if (typeof window.sessionStorage == 'undefined') window.sessionStorage = new Storage('session');

})();