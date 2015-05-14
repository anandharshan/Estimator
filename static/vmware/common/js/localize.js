/*
 * Locale Selector
 * 
 * This is created for two different purposes. One is Autoshow Modal for Public pages - Here locale selector
 * will display automatically based on user ip address and page without any referrer.
 * Second is Normal Modal - will display when user clicks on the language selector link and this will work for MYVMware pages.
 */

if (typeof(myvmware) == "undefined")  myvmware = {};

myvmware.localize = {
		currentLocale:null,
		currentCountry:null,
		langJSON:null,
		pageDomain:null,
		//supportList:{'en':'English','ja':'日本語','jp':'日本語'},
		init: function(_pageDomain) {
			
			myvmware.localize.pageDomain = (typeof _pageDomain === "undefined") ? "VMWARE" : _pageDomain;
			var locale = $('#localeFromLiferayTheme').text().split("_")
			myvmware.localize.currentLocale = (locale[0].toLowerCase() == 'en') ? 'en' : locale[1].toLowerCase()
			//if(myvmware.localize.currentLocale.toLowerCase()== "ja") myvmware.localize.currentLocale = "jp";
			myvmware.localize.currentCountry = (locale[0].toLowerCase() == 'en') ? 'US' : locale[1]
			
			myvmware.localize.getLocales();
			
		},// End of init
		
		//Getting locales from backend
		getLocales:function(){
			
			//if(!$('#sb-container .loading_small').length)$('#sb-container').find('.option-locals > ul').before('<div class="loading_small">Loading...</div>');
			vmf.ajax.post(vmware.localeurls.localeSelectorUrl,null,
			function(data){
				//$('#sb-container').find('.loading_small').remove();
				myvmware.localize.langJSON = (typeof data!="object")?vmf.json.txtToObj(data):data;
				myvmware.localize.buildEvents();
			
				if(myvmware.localize.isPublicDomain()){
					myvmware.localize.checkLocaleConditions();
				}
				else{
					myvmware.localize.updateSelText();
				}
			},function(){
				//alert("Problem in Locale JSON") //error handler
			})
			
		},
		//Autoshow locale selector modal if page without any referral
		checkLocaleConditions:function(){
			//BUG-00064523 -  Checking cookie for prelogin modal/popup
			var geoCookie = vmf.cookie.read("pszGeoPref")
			if(document.referrer === "" && (geoCookie ==  null || geoCookie == 'null' || geoCookie == '')){		
				
				var demandUrl = '';
				if(jQuery.browser.msie) demandUrl = "&callback=?";
				else demandUrl = "";
				jQuery.ajax({			
					url: vmware.localeurls.demandApiUrl+demandUrl,	
					async: false,
					dataType: "json",
					success: myvmware.localize.demandAPISuccess,
					error: myvmware.localize.demandAPIFailure
				});					
			}
		},
		//Display the selected locale text
		updateSelText:function(){
			for(var key in myvmware.localize.langJSON.locales){
				var localeObject = myvmware.localize.langJSON.locales[key]
				if(localeObject.locale.toLowerCase() == myvmware.localize.currentLocale.toLowerCase()) 
				{
					$('#localeSelector a.locale-selector').text(localeObject.lang);
					break;
				}
			}
		},
		demandAPISuccess:function(data){
			
			var demandJSON = (typeof data!="object")?vmf.json.txtToObj(data):data				
			if(myvmware.localize.isOpenLangSel(demandJSON.registry_country_code))
			{
				myvmware.localize.showSelector()		
			}	
		},
		demandAPIFailure:function(){
			//error handling
			//alert("Problem in Demand API")
		},
		//Autoshow locale selector modal based on the user ip address only for public vmware pages
		isOpenLangSel:function(userCntry){
			
			//Updated the condition to support additional languages
			if((userCntry.toUpperCase() == "JP" || userCntry.toUpperCase() == "FR"
			|| userCntry.toUpperCase() == "DE" || userCntry.toUpperCase() == "CN")
			&& myvmware.localize.currentLocale.toUpperCase() == "EN"){
				return true;
			}
			return false;
			
		},
		showSelector:function(){
		
			vmf.modal.show('sb-container',{onShow:function(){
					
						myvmware.localize.buildLocales(myvmware.localize.langJSON)
				
			},close:false});
		},
		buildEvents:function(){
			
			// Register only if page is from MYVMware
			if(!myvmware.localize.isPublicDomain()){
				$('#localeSelector .locale-selector').click(function(){
					if(typeof riaLinkmy !="undefined") riaLinkmy('locale-selector');
					myvmware.localize.showSelector();
					return false;
				});
			}
			$('#close-selector').live('click',function(){
				vmf.modal.hide('sb-container');
				return false;
			});
			$('#option-right a.geo-link').live('click',function(){
				
				var cl = myvmware.localize.currentLocale.toLowerCase();
				var sLocale = $(this).attr('id');
				var sLocaleOm = $(this).attr('name');
					if(typeof riaLinkmy !="undefined") riaLinkmy('locale-selector : '+sLocaleOm.toUpperCase());
					myvmware.localize.setCookie('pszGeoPref',sLocale.toLowerCase(),new Date("Fri, 31 Dec 9999 23:59:59 GMT"),".vmware.com")
				if($(this).attr('name').toLowerCase() != cl) window.location.href = myvmware.localize.changeUrl($.trim($(this).attr('name')).toLowerCase());
				vmf.modal.hide('sb-container');
				return false;
			});
		},
		//setCookie
		setCookie:function(name,value,expires,domain){
             var path = "/";
             var cookie = name + "=" + escape(value) + ";";
 
			  if (expires) {
			    // If it's a date
			    if(expires instanceof Date) {
			      // If it isn't a valid date
			      if (isNaN(expires.getTime()))
			       expires = new Date();
			    }
			    else
			      expires = new Date(new Date().getTime() + parseInt(expires) * 1000 * 60 * 60 * 24);
			 
			    cookie += "expires=" + expires.toGMTString() + ";";
			  }
			 
			  if (path)
			    cookie += "path=" + path + ";";
			  if (domain)
			    cookie += "domain=" + domain + ";";
			 
			  document.cookie = cookie;
		},
		//Build the Modal with available locales
		buildLocales:function(data){
			var jRes = data,
				container = $('#option-inner-mid'),
				list = container.find('ul.country-list'),
				ltag ='',
				url = window.location.href;
			//container.find('.loading_small').remove();
			$.each(jRes.locales,function(j,k){
				if(k.fullySupported.toUpperCase() == "Y"){
					ltag += '<li><a class="geo-link" href="#" id="'+ $.trim(k.cCode).toLowerCase() +'" name="'+$.trim(k.locale).toLowerCase()+'">'+k.lang+'</a></li>';
				}
			});
			list.empty().html(ltag);
		},
		//URL Updation based on locale selection
		changeUrl:function(loc){
			
			var baseURL = window.location.host
			var pathArray = window.location.pathname.split("/");
			var newPath;
			if(pathArray[1].toLowerCase() !=  "web" && pathArray[1].toLowerCase() != "group")
			{	
				var replaceTxt = "/"+loc.toLowerCase()+"/" 				
				newPath =  window.location.pathname.replace( "/"+pathArray[1].toLowerCase()+"/",replaceTxt);
			}
			else{
			//var path = (loc == "en") ? window.location.pathname : "/"+loc+window.location.pathname
				newPath = "/"+loc+window.location.pathname;
			}
			//updating url with queryString and hash tags
			newPath += window.location.search + window.location.hash;
			return newPath;
			
		},
		// Identifying the page from VMWARE or MYVMware
		isPublicDomain:function(){
			
			if(myvmware.localize.pageDomain.toUpperCase() == "VMWARE"){
				return true;
			}
			return false;
		}
}//End of main here