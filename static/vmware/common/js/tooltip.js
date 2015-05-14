// JavaScript Document
//Author: VMware
// Tooltip code
 jQuery(document).ready(function() {
                var curid = null;
                                                
                jQuery('img').each(function() {
                        var img = $(this);
                        
                        if(typeof(img.attr('rel')) != 'undefined') {
                                var hideDelay = 2500;
                                var hideTimer = null;
                                
                                var imgElement = document.getElementById(img.attr('id'));
                                if(imgElement.addEventListener) {
                                        imgElement.addEventListener('mouseover', function() {
                                           if (curid) {close(curid);}
                                           curid = img.attr('id');
                                           if (hideTimer)  clearTimeout(hideTimer);  
                                        showHelp(img.attr('id'));}, false);
                                        imgElement.addEventListener('mouseout', function() {
                                         if (hideTimer)  
           clearTimeout(hideTimer);  
           hideTimer = setTimeout(function()  
       {  
           close(img.attr('id'));  
       }, hideDelay);  
 
}, false);
                                } else {
                                        imgElement.attachEvent('onmouseover', function(){   if (curid) {close(curid);}
                                           curid = img.attr('id');showHelp(img.attr('id'));});
                                        imgElement.attachEvent('onmouseout', function(){ if (hideTimer)  
           clearTimeout(hideTimer);  
           hideTimer = setTimeout(function()  
       {  
           close(img.attr('id'));  
       }, hideDelay);  });
                                }
                                        
/*                              var infoElement = document.getElementById('h-' + imgElement);
                                if(infoElement.addEventListener) {
                                   infoElement.addEventListener('mouseout', function() {close(img.attr('id'));}, false);        
                                } else {
                                        infoElement.attachEvent('onmouseout', function(){close(img.attr('id'));});
                                }               */
                        }
 
                });              
		/* Fix for Global search background image and placeholder function */			
		/* Fix for Global search background image and placeholder function 		*/	
		  $('input.text-input').focus(function(){
			if($(this).val()=="Search"){
				$(this).val("");
			}
		   });
		  $('input.text-input').blur(function(e){
		 	if($(this).val()=="") {
				$(this).val("Search");
			 }
		  });
		 $('input.text-input').attr("placeholder","Search");
		 $('input.btn-search').css("background","none");
		 $('input.btn-search').attr("src","/static/vmware/common/css/img/search-b-icon.png"); 
		 putplaceHolder("input.text#FirstName"); putplaceHolder("input.text#LastName");putplaceHolder("input.text#Email");
		 putplaceHolder("#FirstName_Register_Tab"); putplaceHolder("#LastName_Register_Tab");putplaceHolder("#Email_Register_Tab");
 
 //Feedback button URL fix
    if($('#navigation-bottom').length){
      var $feedback = $('#navigation-bottom');
      var feedbaklink = $feedback.find('li:last').find('a');
      var themeLocaleVar = $("#localeFromLiferayTheme").html(); //Gets current locale from myvmware
      
      var urlLocaleMapper = {}; //Object that defines the locale's specific URL
      urlLocaleMapper["en_US"] = "javascript:window.open('https://vmware.co1.qualtrics.com/SE/?SID=SV_b3COdXybimzMJH7&Q_lang=EN','','width=715,height=675,location=no,menubar=no,resizable=no,scrollbars=yes,status=no,toolbar=no');void(0);";
      urlLocaleMapper["en"] = "javascript:window.open('https://vmware.co1.qualtrics.com/SE/?SID=SV_b3COdXybimzMJH7&Q_lang=EN','','width=715,height=675,location=no,menubar=no,resizable=no,scrollbars=yes,status=no,toolbar=no');void(0);";
      urlLocaleMapper["zh_CN"] = "javascript:window.open('https://vmware.co1.qualtrics.com/SE/?SID=SV_b3COdXybimzMJH7&Q_lang=ZH-S','','width=715,height=675,location=no,menubar=no,resizable=no,scrollbars=yes,status=no,toolbar=no');void(0);";
      urlLocaleMapper["ja_JP"] = "javascript:window.open('https://vmware.co1.qualtrics.com/SE/?SID=SV_b3COdXybimzMJH7&Q_lang=JA','','width=715,height=675,location=no,menubar=no,resizable=no,scrollbars=yes,status=no,toolbar=no');void(0);";
      urlLocaleMapper["de_DE"] = "javascript:window.open('https://vmware.co1.qualtrics.com/SE/?SID=SV_b3COdXybimzMJH7&Q_lang=DE','','width=715,height=675,location=no,menubar=no,resizable=no,scrollbars=yes,status=no,toolbar=no');void(0);";
      urlLocaleMapper["fr_FR"] = "javascript:window.open('https://vmware.co1.qualtrics.com/SE/?SID=SV_b3COdXybimzMJH7&Q_lang=FR','','width=715,height=675,location=no,menubar=no,resizable=no,scrollbars=yes,status=no,toolbar=no');void(0);";
      urlLocaleMapper["ko_KR"] = "javascript:window.open('https://vmware.co1.qualtrics.com/SE/?SID=SV_b3COdXybimzMJH7&Q_lang=KO','','width=715,height=675,location=no,menubar=no,resizable=no,scrollbars=yes,status=no,toolbar=no');void(0);";
      urlLocaleMapper["undefined"] = "javascript:window.open('https://vmware.co1.qualtrics.com/SE/?SID=SV_b3COdXybimzMJH7&Q_lang=EN','','width=715,height=675,location=no,menubar=no,resizable=no,scrollbars=yes,status=no,toolbar=no');void(0);";
      urlLocaleMapper[""] = "javascript:window.open('https://vmware.co1.qualtrics.com/SE/?SID=SV_b3COdXybimzMJH7&Q_lang=EN','','width=715,height=675,location=no,menubar=no,resizable=no,scrollbars=yes,status=no,toolbar=no');void(0);";
      
      feedbaklink.attr('href', urlLocaleMapper[themeLocaleVar]); //sets specific URL as href
    }
    
  //Social Share fix
    if($("#menu-share").length){
      var switchTo5x=true;
      var url = document.location.protocol == "http" ? "http://w.sharethis.com/button/buttons.js" : "https://ws.sharethis.com/button/buttons.js";
      $.getScript(url, function(){
        stLight.options({publisher: "ur-7d4b1f76-45d-c891-c19-c2924529ce2", doNotHash: false, doNotCopy: false, hashAddressBar: false});
      });
    }

}); // End of $(document).ready
        
        function showHelp(imgid) {
                var currBtnElement = origBtnElement = document.getElementById(imgid);
                var btnElement = document.getElementById('h-' + imgid);
                var currleft = currtop = 0;     
 
                do {
                        currleft += currBtnElement.offsetLeft;
                        currtop += currBtnElement.offsetTop;
                } while (currBtnElement = currBtnElement.offsetParent);
 
                currleft += origBtnElement.offsetWidth + 5;
              //  currtop += origBtnElement.offsetHeight - 142;
                if($("html").hasClass("ie7")){
                  currtop += origBtnElement.offsetHeight - 152; 
                }
                else{
                  currtop += origBtnElement.offsetHeight - 142;
                }
                
                var style = 'display:block; position:absolute;'; 
 
                btnElement.style.cssText = style;
                currtop -= 24;
                var mytest = origBtnElement.offsetLeft + 12;
 
                if (!document.all) {
                        
                        var styleReposition = 'display:block; left:' + mytest + 'px; top:' + currtop + 'px; position:absolute;';
/*                      var styleReposition = 'display:block; left:' + mytest + 'px; top:200px; position:absolute;'; */
                        btnElement.style.cssText = styleReposition;
                } else {
                        var styleReposition = 'display:block; top:' + currtop + 'px; position:absolute;';
                        /* var styleReposition = 'display:block; top:20px; position:absolute;'; */
                        btnElement.style.cssText = styleReposition;
                }
                
                if (btnElement.addEventListener) {
                /*      btnElement.addEventListener('mouseout', function() {close(imgid);}, false);      */
                } else {
                /*      btnElement.attachEvent('onmouseout', function(){close(imgid);}); */
                }
        }
        
        function close(btn) {
                jQuery('#h-' + btn).hide();
        }
		 function putplaceHolder(element){// Check whether browser supports placeholder property
		var elems;
		if(element != ""){elems = element;}
		else{elems = '.txt_datepicker';}
		if (!$.support.placeholder) {
			$(elems).die('focus blur change').live({
				focus: function(){
					if ($(this).attr('placeholder') != '' && $.trim($(this).val()) == $(this).attr('placeholder')) {
						$(this).val('').removeClass('hasPlaceholder');
				}},
				blur: function(){
					if ($(this).attr('placeholder') != '' && ($.trim($(this).val()) == '' || $.trim($(this).val()) == $(this).attr('placeholder'))) {
						$(this).val($(this).attr('placeholder')).addClass('hasPlaceholder');
				}},
				change: function(){$(this).removeClass('hasPlaceholder');}				
			});
			$(elems).trigger('blur');         
		}
	}