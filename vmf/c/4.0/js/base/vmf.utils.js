
;(function(vmf){

vmf.patterns = {};			
vmf.utils = {};	
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
};
vmf.ns = function(){return {//ns (namespace) methods
			use:function(_33){var ary=_33.split(".");var obj=window;for(var i in ary){if(!obj[ary[i]]){obj[ary[i]]={};obj=obj[ary[i]];}else{obj=obj[ary[i]];}}}};
		}();
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
		}();		
vmf.ajax = function(){
	return {//ajax methods
				connect:function(o){$.ajax(o);},
				get:function(url,_39,_3a,_3b,_3c,_3d,_3e,_3f){var o={type:"GET",url:url,data:_39,success:_3a,error:_3b,complete:_3c,beforeSend:_3e,async:_3f};if(_3d){o.timeout=_3d;}jQuery.ajax(o);},
				post:function(url,_40,_41,_42,_43,_44,_45,_46){var o={type:"POST",url:url,data:_40,success:_41,error:_42,complete:_43,beforeSend:_45,async:_46};if(_44){o.timeout=_44;}jQuery.ajax(o);}
	};
}();

vmf.utils = function(){
	return {
		hostname:window.location.protocol+"//"+window.location.hostname,
		ajax:{
			post: $.post,
			get:  $.get,
			send: $.ajax
		},
		wordwrap:function(text, size){
				if (typeof size == "undefined" || text.length <= size || size == 1) {
					return text;
				}
				var res = [];

				function getTokens(text, num) {
					if (text.length <= num) {
						res.push(text);
					} else {
						var tempText = text.substring(0, num);
						var ampInd = tempText.indexOf("&");
						var semInd = text.indexOf(';');
						if (ampInd != -1 && semInd != -1 && (semInd > ampInd) && (semInd - ampInd < 10)) {
							num = semInd + 1;
						}
						res.push(text.substring(0, num));
						getTokens(text.substring(num), size);
					}
				}
				getTokens(text, size);
				return res.join("<wbr /><span class=\"wbr\"></span>");
		},//End of WordWrap
		unwrap:function(text){
                return text.replace(/\<wbr\>\<span\ class\=\"wbr\"\>\<\/span\>/g,'');
		},
		json:function(){return {//json methods
			txtToObj:function(txt){try{return $.parseJSON(txt);}catch(ex){return null;}},
			objToTxt: $.toJSON
		};},
		array:function(){return {//array methods
			contains:function(val,_2a){return ($.inArray(val,_2a)>-1);},
			txtToAry:function(txt){return txt.split(",");},
			aryToTxt:function(_2c){return _2c.join(",");},
			objToAry:function(obj){return $.makeArray(obj);}};
		},
		form:function(){return {//form methods
			serialize:function(id,_47){var _48=vmf.dom.id(id)||document.forms[id];if(!_48){return null;}if(_47){var _49=[];for(var i in _47){_49.push(_48[_47[i]]);}return jQuery(_49).serialize();}else{return jQuery(_48).serialize();}},
			getRadioBtn:function(id,_4c){var _4d=vmf.dom.id(id)||document.forms[id];if(!_4d){return null;}return jQuery("input[@name='"+_4c+"']:checked").val();},
			getCbk:function(id,_4f){var _50=vmf.dom.id(id)||document.forms[id];if(!_50){return false;}return _50[_4f].checked;},
			setCbk:function(id,_52,val){val=val||true;var _54=vmf.dom.id(id)||document.forms[id];if(_54){_54[_52].checked=val;}}};
		},
		url:function(){return { //url methods
			getParam:function(_55){var url=window.location.toString();var _57=url.indexOf("?");if(_57<0){return null;}var _58=url.substring(_57+1,url.length).split("&");for(var i in _58){var _5a=_58[i].split("=");if(_5a[0]==_55){return _5a[1];}}return null;},
			hasAnchor:function(_5b){var url=window.location.toString();var _5d=url.indexOf("#");if(_5d<0){return false;}else{return (url.substring(_5d+1,url.length)==_5b);}},
			redirect:function(_5e){if(!_5e.url){return;}switch(_5e.target){case "new":window.open(_5e.url);break;default:document.location=_5e.url;break;}}};
		},
		animate:function(){return { // animate methods
			show:function(_5f,_60,_61){(_5f instanceof jQuery?_5f:jQuery(_5f)).show(_60,_61);},
			hide:function(_62,_63,_64){(_62 instanceof jQuery?_62:jQuery(_62)).hide(_63,_64);},
			toggle:function(_65){(_65 instanceof jQuery?_65:jQuery(_65)).toggle();},
			slideDown:function(_66,_67,_68){(_66 instanceof jQuery?_66:jQuery(_66)).slideDown(_67,_68);},
			slideUp:function(_69,_6a,_6b){(_69 instanceof jQuery?_69:jQuery(_69)).slideUp(_6a,_6b);},
			slideToggle:function(_6c,_6d,_6e){(_6c instanceof jQuery?_6c:jQuery(_6c)).slideToggle(_6d,_6e);},
			fadeIn:function(_6f,_70,_71){(_6f instanceof jQuery?_6f:jQuery(_6f)).fadeIn(_70,_71);},
			fadeOut:function(_72,_73,_74){(_72 instanceof jQuery?_72:jQuery(_72)).fadeOut(_73,_74);},
			fadeTo:function(_75,_76,_77,_78){(_75 instanceof jQuery?_75:jQuery(_75)).fadeTo(_76,_77,_78);}};
		},
		
		stopScrolling : function( $el, $window, _top, _bottom, _topGap ) {

			$window.bind("scroll resize", function() {
				var gap = $window.height() - $el.height() - _topGap;
				var visibleFoot = _bottom - ($(document).height() - $window.scrollTop() - $window.height());
				var scrollTop = $window.scrollTop();
				
				if(scrollTop < _top + _topGap) {
					$el.css({
						top: (_top - scrollTop) + "px",
						bottom: "auto"
					});
				} else if (visibleFoot > gap) {
					$el.css({
						top: "auto",
						bottom: visibleFoot + "px"
					});
				} else {
					$el.css({
						top: 0,
						bottom: "auto"
					});
				}
			});
		}

};
}();



vmf.msg = {
	pageEl: "body",		//where page level errors need to be shown. Use setup() to change
	bodyEl: "body"		
};

//To specify ( ideally project based ) where msg DOM nodes can be created
vmf.msg.setup = function(b, p) {
	if(b) vmf.msg.bodyEl = b;
	if(p) vmf.msg.pageEl = p;
}

//POPUP MESSAGING
//This replaces a browser confirm dialog box
vmf.msg.confirm = function( sMessage, sTitle, sPrimaryButtonText, sDefaultButtonText, fnCallback ) {
	var htmlArray = [
			'<div class="modal fade"><div class="modal-dialog"><div class="modal-content">',
				'<div class="modal-header">',
					'<span class="close" data-dismiss="modal" aria-hidden="true"></span>',
					'<h4 class="modal-title">' + (sTitle || 'vmf') + '</h4>',
				'</div>',
				'<div class="modal-body"><p>',
					(sMessage || ""),
				'</p></div>',
				'<div class="modal-footer">',
					'<button type="button" class="btn btn-default" data-dismiss="modal">' + (sDefaultButtonText || 'No') + '</button>',
					'<button type="button" class="btn btn-primary">' + (sPrimaryButtonText || 'Yes') + '</button>',
				'</div>',
			'</div></div></div>'
		],
		$msg = $( htmlArray.join('') ).appendTo( vmf.msg.bodyEl );

	//Primary Event
	$msg.modal('show').on('click', '.btn-primary', function (e) {
		if(fnCallback) fnCallback();
		$msg.modal('hide');
	});

	//Destroy on Hide/Close
	$msg.on('hidden.bs.modal', function (e) {
		$msg.off().remove();
	});
}

//PAGE LEVEL MESSAGING
//This shows a page level alert
//Target of page level DOM node is specified in vmf.msg.pageEl
//MessageType = success/info/warning/danger/
//Optional containerEl (jQuery selector), in case the page message needs to be shown in a different DOM container
vmf.msg.page = function( sMessage, sTitle, sMessageType, containerEl ) {
		if( !sMessage && !sTitle ){
			$('.alert-box').remove();
			return;
		}
		var htmlArray = [
				'<div class="alert-box"><div class="alert alert-' + (sMessageType || "info") + ' alert-dismissable" role="alert">',
					'<span aria-hidden="true" data-dismiss="alert" class="close icons-alert-close"></span>',
					(sTitle ? '<strong>' + sTitle + '</strong> ' : ""),
					'<div class="row"><span class="icons-alert-' + (sMessageType || "info") + '"></span>',
					'<div class="alert-text col-sm-10"><span>'+sMessage+'</span></div></div>',
				'</div></div>'
			],
			$msg = $( htmlArray.join('') ).appendTo( containerEl || vmf.msg.pageEl );
		//Destroy on Hide/Close
		$msg.on('closed.bs.alert', function (e) {
			$msg.remove();
		});
}

//INLINE MESSAGING
//This shows an alert (error by default) beside an element
vmf.msg.inline = function( $el, sMessage, sMessageType ) {

	if( !sMessage ) {
		$el.remove(".parsley-errors-list");
		return;
	} else {
		var errContainer = $el.find(".parsley-errors-list");
		if(errContainer.length > 0) {
			errContainer.html( sMessage );
		} else {
			var $errEl = $(document.createElement('div'));
			$errEl.addClass('parsley-errors-list').html( sMessage ).appendTo( $el );
		}
	}
}

vmf.msg.setup("body", ".messageContainer");



})(window.vmf = window.vmf || {});


//Show Error Next to an element. Hide all of called with no parameters
$.fn.showError = function( msg ) {
	if( !msg ) {
		this.remove(".parsley-errors-list");
	} else {
		this.each(function() {
			var msgHTML = $('<div class="parsley-errors-list">' + msg + '</div>');
			if($(this).find(".parsley-errors-list").length>0){
				$(this).find(".parsley-errors-list").html(msg);
			} else {
				$(this).append( msgHTML );
			}
		});
	}
	return this;
};
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