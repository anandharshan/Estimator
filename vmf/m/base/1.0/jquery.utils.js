/* * VMF 3.0
 * Copyright (c) 2011 VMware
 * $Rev: 1.0 $
 * laodjs, loadcss,dom,cookie,json,array, string,ns,ajax, form, url and animate.
 */
 
 jQuery.getScriptCache = function(url, callback) {
		return jQuery.ajax({
			type: "GET",
			url: url,
			data: null,
			success: callback,
			dataType: "script",
			cache: true
		});
};
/*Mega Menu for .com // from scrapper*/
(function(){
	var addEvent = function(object, evt, func, capture){
		if(!object)	return false;
		if(typeof func != 'function')	return false;
		if(object.addEventListener){
			object.addEventListener(evt, func, capture);
			return true;
		}
		else if(object.attachEvent){
			object.attachEvent('on' + evt, func);
			return true;
		}
		return false;
	};
    addEvent(window, "load", function(){
        var gsite = document.getElementById("global-sites") || document.getElementById("iglobal-sites");
        if(null == gsite || undefined == gsite){//primary navigation not available
        	return;
        }
        //var items = gsite.getElementsByTagName("div")[2].getElementsByTagName("ul")[0].childNodes;
	//var items = $('div.nav ul:eq(0)')[0].childNodes;
	var items = 0
	if ($('div.nav ul:eq(0)').length > 0 )
		items = $('div.nav ul:eq(0)')[0].childNodes ;
		
        var ldiv = null;
        var tid = -1;
        var mouseoutHandler = function(){  
            window.clearTimeout(tid);
        };
var hideDiv = function(e){
			if(ldiv && !$(e.target).closest('.drop-one').length){ldiv.style.display = "none";}
		};
        for(var i=0; i<items.length; i++){
            addEvent(items[i], "mouseover", function(idx){
                return function(){
                    var div = items[idx].getElementsByTagName("div")[0];
                    tid = window.setTimeout(function(){
                        if(ldiv){ldiv.style.display = "none";}
                        ldiv = div;
                        div.style.display = "block";					
                    }, 300);
                };
            }(i));
            addEvent(items[i], "mouseout", mouseoutHandler);
        }
       	$(document).bind('mouseover',hideDiv);
   });
})();
/* End of Mega Menu*/

window.vmf=function(){
	var _1=function(id){return $("#"+id);};
	var _3=function(_4){document.write('<script src="' + _4 + '" type="text/javascript"><\/script>');};
	var _5=[];
	return { //main return starts
		hostname : window.location.protocol+"//"+window.location.hostname,
		baseloaded :false,
		scEvent :false,
		loadJs:function(_6,_7,_8){
			if(($.inArray(_6,_5)<0)){
				(_7)?$.getScript(_6,_8):_3(_6);
			}
		},
		getObjByIdx: function(obj, index){var i = 0;for (var attr in obj){if (index === i){return obj[attr];};i++;};return null;},
		wordwrap : function(text, size){
				/*$(".word-wrap").each(function(index){
					$(this).html($(this).html().replace(/(.*?)/g, "<wbr/>"));
				});*/
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
		loadCss:function(_9){var _a=document.createElement("link");_a.setAttribute("rel","stylesheet");_a.setAttribute("type","text/css");_a.setAttribute("href",_9);document.getElementsByTagName("head")[0].appendChild(_a);},
		dom:function(){ //dom methods
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
		}(),// end dom methods
		cookie:function(){return {//cookie methods
			read:function(_1c){var _1d=_1c+"=";var ca=document.cookie.split(";");for(var i=0;i<ca.length;i++){var c=ca[i];while(c.charAt(0)==" "){c=c.substring(1,c.length);}if(c.indexOf(_1d)==0){return c.substring(_1d.length,c.length);}}return null;},
			write:function(_21,_22,_23){var _24="";if(_23){var _25=new Date();_25.setTime(_25.getTime()+(_23*24*60*60*1000));_24="; expires="+_25.toGMTString();}else{_24="";}document.cookie=_21+"="+_22+_24+"; path=/";},
			clear:function(_26){vmf.cookie.write(_26,"",-1);}};
		}(),
		json:function(){return {//json methods
			txtToObj:function(txt){try{return $.evalJSON(txt);}catch(ex){return null;}},
			objToTxt:function(obj){return $.toJSON(obj);}};
		}(),
		array:function(){return {//array methods
			contains:function(val,_2a){return ($.inArray(val,_2a)>-1);},
			txtToAry:function(txt){return txt.split(",");},
			aryToTxt:function(_2c){return _2c.join(",");},
			objToAry:function(obj){return $.makeArray(obj);}};
		}(),
		string:function(){//string methods
			return {
				setCharAt:function(str,i,c){if(i>=str.length){return str;}else{var n=str.substring(0,i);n+=c;n+=str.substring(i+1,str.length);return n;}},
				trim:function(str){return $.trim(str);},
			
				htmlentities:function(str, quote_style){ 
					// http://kevin.vanzonneveld.net  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)     // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)    // +   improved by: nobbler    // +    tweaked by: Jack    // +   bugfixed by: Onno Marsman    // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)    // -    depends on: get_html_translation_table    // *     example 1:htmlentities('Kevin & van Zonneveld');    // *     returns 1: 'Kevin &amp; van Zonneveld'    // *     example 2: htmlentities("foo'bar","ENT_QUOTES");    // *     returns 2: 'foo&#039;bar'
				
					var histogram = {}, symbol = '', tmp_str = '', entity = '';
					tmp_str = str.toString();
					if (false === (histogram = get_html_translation_table('HTML_ENTITIES', quote_style))) {return false;}
					for (symbol in histogram) {
						entity = histogram[symbol];
						tmp_str = tmp_str.split(symbol).join(entity);
					}
					return tmp_str; 
				}
			}	
		}(),
		ns:function(){return {//ns (namespace) methods
			use:function(_33){var ary=_33.split(".");var obj=window;for(var i in ary){if(!obj[ary[i]]){obj[ary[i]]={};obj=obj[ary[i]];}else{obj=obj[ary[i]];}}}};
		}(),
		ajax:function(){return {//ajax methods
			connect:function(o){$.ajax(o);},
			get:function(url,_39,_3a,_3b,_3c,_3d,_3e,_3f){var o={type:"GET",url:url,data:_39,success:_3a,error:_3b,complete:_3c,beforeSend:_3e,async:_3f};if(_3d){o.timeout=_3d;}jQuery.ajax(o);},
			post:function(url,_40,_41,_42,_43,_44,_45,_46){var o={type:"POST",url:url,data:_40,success:_41,error:_42,complete:_43,beforeSend:_45,async:_46};if(_44){o.timeout=_44;}jQuery.ajax(o);}
		};}(),
		form:function(){return {//form methods
			serialize:function(id,_47){var _48=vmf.dom.id(id)||document.forms[id];if(!_48){return null;}if(_47){var _49=[];for(var i in _47){_49.push(_48[_47[i]]);}return jQuery(_49).serialize();}else{return jQuery(_48).serialize();}},
			getRadioBtn:function(id,_4c){var _4d=vmf.dom.id(id)||document.forms[id];if(!_4d){return null;}return jQuery("input[@name='"+_4c+"']:checked").val();},
			getCbk:function(id,_4f){var _50=vmf.dom.id(id)||document.forms[id];if(!_50){return false;}return _50[_4f].checked;},
			setCbk:function(id,_52,val){val=val||true;var _54=vmf.dom.id(id)||document.forms[id];if(_54){_54[_52].checked=val;}}};
		}(),
		url:function(){return { //url methods
			getParam:function(_55){var url=window.location.toString();var _57=url.indexOf("?");if(_57<0){return null;}var _58=url.substring(_57+1,url.length).split("&");for(var i in _58){var _5a=_58[i].split("=");if(_5a[0]==_55){return _5a[1];}}return null;},
			hasAnchor:function(_5b){var url=window.location.toString();var _5d=url.indexOf("#");if(_5d<0){return false;}else{return (url.substring(_5d+1,url.length)==_5b);}},
			redirect:function(_5e){if(!_5e.url){return;}switch(_5e.target){case "new":window.open(_5e.url);break;default:document.location=_5e.url;}}};
		}(),
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
		}// end of animate methods
	()};//end of main return
}();//end of vmf 

	//vmf.hostname = window.location.protocol+"//www.vmware.com";
	switch (window.location.hostname) {
		case 'www.vmware.com':
		case 'downloads.vmware.com':
		case 'my.vmware.com':
			vmf.hostname = window.location.protocol+"//www.vmware.com";
			break;
		case 'phnx-portal-stage.vmware.com':
		case 'downloads-stage.vmware.com':
			vmf.hostname = window.location.protocol+"//wwwapps-stage.vmware.com";
			break;
		case 'portal-vmwperf.vmware.com':
		case 'downloads-qa.vmware.com':
		case 'www-test2.vmware.com':
		case 'lrp-qai-vip.vmware.com':
		case 'my-perf.vmware.com':
		case 'my-uat.vmware.com':
		//case 'my-lt.vmware.com':
		case 'my-test.vmware.com': 
			//vmf.hostname = "http://wwwa-qa-lamp-1.vmware.com";/* wwwa-qa-lamp-1 does not support https, force http */
			vmf.hostname = window.location.protocol+"//portal-vmwperf.vmware.com";
			break;
		case 'my-lt.vmware.com':
			vmf.hostname = window.location.protocol+"//www-lt.vmware.com";
			break;
		case 'my-qai.vmware.com':
			vmf.hostname = window.location.protocol+"//www-qai.vmware.com";
			break;
		case 'newcastle.vmware.com':
		case 'wwwa-dev-sso-1.vmware.com':
		case 'poc-sym-vip.vmware.com':
		case 'lrp-dev3-vip.vmware.com':
		case 'lmpimage2.vmware.com':
		case 'web-dev3-sso-3.vmware.com':
		case 'my-dev2.vmware.com': 
			vmf.hostname = "http://lmpimage2.vmware.com"; /* lmpimage2 does not support https, force http */
			break;
		case 'serafina.vmware.com':
			vmf.hostname = window.location.protocol+"//serafina-home.vmware.com";
			break;
		default:
			vmf.hostname = window.location.protocol+"//www.vmware.com";
			break;
	}
