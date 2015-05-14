if (typeof(myvmware) == "undefined")  myvmware = {};
var thisVar = null;
myvmware.localize = {
		
		init: function() {
			
			thisVar = myvmware.localize;
			
			var locale = $('#localeFromLiferayTheme').text().split("_")
			thisVar.currentLocale = locale.length <= 1 ? 'en' : locale[0]
			thisVar.currentCountry = locale.length <= 1 ? 'US' : locale[1]
			thisVar.checkLocaleConditions();
		},// End of init
		checkLocaleConditions:function(){
			
			vmf.ajax.post(myvmware.globalVars.localeSelectorUrl,null,
			function(data){
				thisVar.langJSON = (typeof data!="object")?vmf.json.txtToObj(data):data;
				if(document.referrer === ""){		
					
					vmf.ajax.get(myvmware.globalVars.demandApiUrl, null, thisVar.demandAPISuccess,thisVar.demandAPIFailure);						
				}
			},function(){
				//alert("Problem in Locale JSON") //error handler
			})
			
			
		},
		demandAPISuccess:function(data){
			
			var demandJSON = (typeof data!="object")?vmf.json.txtToObj(data):data				
			if(thisVar.isOpenLangSel(demandJSON.registry_country_code))
			{
				
				thisVar.buildEvents();		
				thisVar.showSelector();
				
			}	
		},
		demandAPIFailure:function(){
			//error handling
			//alert("Problem in Demand API")
		},
		isOpenLangSel:function(userCntry){
			
			for(var key in thisVar.langJSON.locales){
				var localeObj = thisVar.langJSON.locales[key]
				if(localeObj.cCode.toUpperCase() == userCntry.toUpperCase() && localeObj.locale.toUpperCase() != "EN"
				&&  localeObj.cCode.toUpperCase() != thisVar.currentCountry.toUpperCase())
				{
					return true;
				}
			}
			return false;
			
		},
		showSelector:function(){
		
			//if(!$('#sb-container .loading_small').length)$('#sb-container').find('.option-locals > ul').before('<div class="loading_small">Loading...</div>');
			vmf.modal.show('sb-container',{onShow:function(){
				//vmf.ajax.get(myvmware.globalVars.localeSelectorUrl,null,thisVar.buildLocales,thisVar.failedLocales);()
				//alert("Rajesh")
				thisVar.buildLocales(thisVar.langJSON)
			},close:false});
		},
		buildEvents:function(){
		
			$('#close-selector').live('click',function(){
				vmf.modal.hide('sb-container');
				return false;
			});
			$('#option-right a.geo-link').live('click',function(){
				
				var cl = thisVar.currentLocale.toLowerCase()
				if($('#remember-choice').is(':checked')){
					vmf.cookie.write('pszGeoPref',$(this).attr('id').toLowerCase());
				}
				if($(this).attr('name') != cl) window.location.href = thisVar.changeUrl($.trim($(this).attr('name')).toLowerCase());
				vmf.modal.hide('sb-container');
				return false;
			});
		},
		buildLocales:function(data){
			var jRes = (typeof data!="object")?vmf.json.txtToObj(data):data,
				container = $('#option-inner-mid'),
				list = container.find('ul.country-list'),
				ltag ='',
				url = window.location.href;
			container.find('.loading_small').remove();
			$.each(jRes.locales,function(j,k){
				ltag += '<li><a class="geo-link" href="#" id="'+ $.trim(k.cCode).toLowerCase() +'" name="'+$.trim(k.locale).toLowerCase()+'">'+k.lang+'</a></li>';
			});
			list.empty().html(ltag);
		},
		
		changeUrl:function(loc){
			
			var baseURL = window.location.host
			var pathArray = window.location.pathname;
			if(pathArray[1].toLowerCase()!= loc.toLowerCase())
			{
				for(var i in thisVar.langJSON.locales)
				{
					var locale = thisVar.langJSON.locales[i].locale
					if(pathArray[1].toLowerCase() ==  locale.toLowerCase())
					{
						return window.location.pathname.replace("/"+locale.toLowerCase()+"/","/"+loc.toLowerCase()+"/");
					}
				}
				return "/"+loc+window.location.pathname
			}
			return window.location.pathname;
		}
}//End of main here
