// GSA related changes
var populateOmniture=false;
var problemTextSearch="";
var intialKbSearchDone=false;
var tagErrorKbSearch=false;
var tagKbSearchDataOverriden=false;

if (typeof(myvmware) == "undefined")  
	myvmware = {};
	function getKBDetails(url) {	
   window.open(url,  'GetHelp', 'width=595,height=570,resizable=yes,left=100,top=100,screenX=100,screenY=100,toolbar=no, location=no,directories=no,status=no,menubar=no,scrollbars=yes,copyhistory=yes'); 
};
function afterDelayedKeyup(selector, action, delay){
  jQuery(selector).keyup(function(){
    if(typeof(window['inputTimeout']) != "undefined"){
      clearTimeout(inputTimeout);
    }
    inputTimeout = setTimeout(action, delay);
  });
}
function afterDelayedChange(selector, action, delay){
	  jQuery(selector).focus(function(){
	    if(typeof(window['inputTimeout']) != "undefined"){
	      clearTimeout(inputTimeout);
	    }
	    inputTimeout = setTimeout(action, delay);
	  });
}
function deleteBitOnAjaxcall(tagRemoved){
		var valueToRemove = tagRemoved 
		var selTagValWithTagAttr = $('#gsa_selected_tags').val();
		var gsaQueryTxt = $('#gsa_query').val();		
		var newselTagValWithTagAttr;
		var matpattern = new RegExp('</tags><tags>' + valueToRemove+ '$');
		var matpatterntxt = new RegExp(','+valueToRemove+ '$');
		var selTagValWithTagAttr = $('#gsa_selected_tags').val();
		if(selTagValWithTagAttr.match(valueToRemove+'</tags><tags>')){
			newselTagValWithTagAttr = selTagValWithTagAttr.replace(valueToRemove+'</tags><tags>', "");
			
		}else if(selTagValWithTagAttr.match('<tags>'+valueToRemove+'</tags>')){
			newselTagValWithTagAttr = selTagValWithTagAttr.replace('<tags>'+valueToRemove+'</tags>', "");
			
		}else if(selTagValWithTagAttr.match(matpattern)){
			newselTagValWithTagAttr = selTagValWithTagAttr.replace(matpattern, "");
			
		}else{
			newselTagValWithTagAttr = selTagValWithTagAttr.replace(valueToRemove, "");
		}
		if(gsaQueryTxt.match(valueToRemove+',')){
			var newgsaQueryTxt = gsaQueryTxt.replace(valueToRemove+',', "");
		}else if(gsaQueryTxt.match(matpatterntxt)){
			var newgsaQueryTxt = gsaQueryTxt.replace(matpatterntxt, "");
		}else{
			var newgsaQueryTxt = gsaQueryTxt.replace(valueToRemove, "");
		}
		$('#gsa_selected_tags').val(newselTagValWithTagAttr);
		$('#gsa_query').val(newgsaQueryTxt);
		if(newselTagValWithTagAttr != ''){
			srfile.tagboxlist.tagCloudForRequestBody ='<tags>'+newselTagValWithTagAttr+'</tags>';
		}else{
			srfile.tagboxlist.tagCloudForRequestBody = '';
		}
		srfile.tagboxlist.onFirstLoad = false;
		srfile.tagboxlist.renderHtml();
	}
myvmware.kbSupport = {
		init :function() {
	
        $(window).bind('hashchange', function() {
            GSA.search();
        });
        $(window).trigger('hashchange');
        // Fix for BUG-00058419  - production issue
	var issueDes = $('#technicalProblemCategoryType').val();        
        if(issueDes != undefined && issueDes != ''){
                var issue = issueDes.split(",");
                $('.keyWord-wrapper').append('<span>'+ issue[0] +'</span>');
        }
       
        
	/*/ var gsastr=$("#gsa_query").val();
         if($("#gsa_query").val()==''){
         var gsastr= $("#gsa_query_init").val();
         }else{
         var gsastr = $('#gsa_query').val();
         }
         if( gsastr != undefined && gsastr != ''){			
         var gsastrArr = gsastr.split(",");	
         $('.keyWord-wrapper').append('<span>'+ gsastrArr[0] +'</span>');
         /*for (i=0;i<=gsastrArr.length;i++)
         {					
         if(gsastrArr[i] != undefined ){
         //BUG-00015735
         $('.keyWord-wrapper').append('<span>'+ gsastrArr[0] +', </span>');
         }			
         }
         
         }	*/				
                    afterDelayedKeyup('#gsa_query',"myvmware.kbSupport.performKBSearch()",500); 
                    afterDelayedChange('#gsa_query',"myvmware.kbSupport.recordKBEvent()",5000);
        
        
		//srfile.tagboxlist.initialize(); Commented for prod bug-00059313
		
		$(".keyWord-wrapper").delegate('a', 'click', function(event){
			
			$(this).parent('span').remove();
			
			try{				
				var tagRemoved = $.trim($(this).parent('span').text());				
				var searchStr=$('#gsa_query').val();
				
				if(tagRemoved==searchStr)
				{
					searchStr="";
				}else{
					
					var index = searchStr.search(tagRemoved);
					if(index!=-1)
					{
						index = searchStr.search(','+tagRemoved+',');
						if(index!=-1)
						{
							searchStr=searchStr.replace(' '+tagRemoved+',', "");							
							searchStr=searchStr.replace(tagRemoved+',', "");							
						}else{
							index = searchStr.search(tagRemoved+',');
							if(index!=-1)
							{
								searchStr=searchStr.replace(' '+tagRemoved+',', "");
								searchStr=searchStr.replace(tagRemoved+',', "");
							}else{						
								index = searchStr.search(', '+tagRemoved);
								if(index!=-1)
								{		
									searchStr=searchStr.replace(','+tagRemoved, "");
								}else{
									searchStr=searchStr.replace(tagRemoved, "");
								}
							}							
						}
					}					
				}
				if($.trim(searchStr)=="")
				{
					searchStr="";
				}
				if($.trim(searchStr)==",")
				{
					searchStr="";
				}
				deleteBitOnAjaxcall(tagRemoved);
				$('#gsa_query').val(searchStr);
				
				
			}catch(e){
				myvmware.kbSupport.performKBSearch();
			}
			return false;
		});
		$('#gsa_query').focusout(function(){
			if(populateOmniture==true)
			{				
				var eventName = $('#productFamily').val()+':'+$('#techSelProd').val()+':'+problemTextSearch;
				var prop15= 'get-support:technical:' + $('#technicalProblemCategoryType').val();
				try
				{
					s.prop6=eventName.toLowerCase();
					s.prop15=prop15.toLowerCase();
					//riaLink("technical");
					srfile.tagboxlist.riaTrackSupportLink("");
				}catch(e)
				{
				}				
				populateOmniture=false;
			}
		});
		
		// Expand and collapse Tag List added as part of Defect BUG-00015735  START
		  $('.expandTags').click(function(){
		     
		     if($(this).hasClass('open')){
		      //close it
		      $(this).removeClass('open');
		      $(this).parents('.popularTagsSection').find('.popularTags').removeClass('scrollable');
		      $(this).find('a#minimizeLink').addClass('hidden');
		      $(this).find('a#expandLink').removeClass('hidden');
		     }else{
		      //open it
		      $(this).addClass('open');
		      $(this).parents('.popularTagsSection').find('.popularTags').addClass('scrollable');
		      $(this).find('a#expandLink').addClass('hidden');
		      $(this).find('a#minimizeLink').removeClass('hidden');
		     }
		     return false;
		    });
		 //Expand and collapse Tag List added as part of Defect BUG-00015735 END 
    },
	performKBSearch : function() {
		
		var getEditableInpVal = $('ul.textboxlist-bits li.textboxlist-bit-editable:visible input.textboxlist-bit-editable-input').val();
		if(getEditableInpVal != ""){
			//gsatext.add(getEditableInpVal);
		}
		$('ul.textboxlist-bits li.textboxlist-bit-editable:visible input.textboxlist-bit-editable-input').val('');		
		//As part of defect BUG-00017357 start
		//gsastr = $('#gsa_query').val();
		gsastr = $.trim(($("#productCategorySearch").val()+","+$('#gsa_query').val()));
		//var query = $.trim($("#gsa_query").val());
		var query = $.trim(($("#productCategorySearch").val()+","+$("#gsa_query").val()));
		//As part of defect BUG-00017357 end
		GSA.params = GSA.defaults;
		GSA.requirefields = {};
		for(p in GSA.params) {
			var fieldname = "#gsa_" + p;
			var formval = $.trim($(fieldname).val());
			if(formval != "") {
				GSA.params[p] = formval;
			}
		}
		GSA.params.q = GSA.urlEncode(query);
		var category = $.trim($("select[id$='gsa_category'] :selected").text());
		if(category != "" && category != 'All Documents') {
			GSA.requirefields.doctype = category;
		}
		hash = GSA.composeHash();
		var url = GSA.composeGSAUrl(hash);
		GSA.call(url);	
		$("#gsa_query").focus();
		//problemTextSearch=gsastr;
		problemTextSearch=$("#gsa_query").val();
		populateOmniture=true;
		return false;	
	},recordKBEvent : function() {
		if(populateOmniture==true)
		{			
			var prop6 = $('#productFamily').val()+':'+$('#techSelProd').val()+':'+problemTextSearch;
			var prop15= 'get-support:technical:' + $('#technicalProblemCategoryType').val();
			try{
				s.prop6=prop6.toLowerCase();
				s.prop15=prop15.toLowerCase();
				//riaLink("technical");										
				srfile.tagboxlist.riaTrackSupportLink("");
			}catch(e){
			}			
			populateOmniture=false;
		}
		return false;
	}
};

var GSA;

    GSA = {
        internal:  {
            docid: '#dl-content-left',
            script: '/gsa/search',
            hash: '',
            tagLink: ''
        },
        //Default search parameters
        defaults: {
            site:        'kb_collection',
            client:    'gss_sr_help',
            getfields: '*',
            output:    'xml_no_dtd',
            filter:     '0',
            proxyreload: '1',
            proxystylesheet: 'gss_sr_help',
            tpsearch_global: 'all',
            //sort: 'date:D:S:d1',
            num: '5',
            entqr:  3
        },
        params: {},
        //Meta fields
        requirefields: {},
        /*keymap: {
            dc:     'Datacenter Downloads',
            dt:        'Desktop Downloads',
            all:    'all',
            pr:        'Product Binaries',
            dr:        'Drivers & Tools',
            op:        'Open Source'
        },*/
        filters: {
            dr: '',
            dc: '',
            dt: ''
        },
        call: function(url) {
            //alert(url);
            $.ajax({
                type: "POST",
                url: url,
                success: function(data, textStatus) {
                    //Remove date range query from the normal search query
                    data = data.replace(/\s*inmeta:dsca_rdate:daterange:\d{4}-\d{2}-\d{2}\.\.\d{4}-\d{2}-\d{2}/, '');
                    var docid = $(GSA.internal.docid);
                    //Changes for BUG-00023954 start
                    docid.html(data);					
                    if (data.indexOf("No results") !=-1) {
                    	$("#dl-content-left").prepend("<div id='noResults-header' class='queryListTitle'>"+support.globalVars.suggestedResLbl+"</div>");
                    	$("span.p").css("padding","30px 0 50px 0");
                    	$("span.p").css("font-size","16px");
                    	$("span.p").css("display","block");
                    	$("span.p").css("text-align","center");
                    }else{
                    	if($("#noResults-header").is(":visible")){
                    		$("#noResults-header").remove();
                    	}
                    }
                    //Changes for BUG-00023954 end
                    $('#gsa-result-table tr:even', docid)
                        .filter(':gt(0)')
                           .removeClass('results-table-row-odd')
                           .addClass('results-table-row-even');

                     //GSA.dispProd(GSA.filters.dt, GSA.filters.dc);
                    //GSA.dispTagLinks();
                },
                complete:function(){
                    myvmware.support.adjustRightPanel();
                }
            });
        },
		track: function(){
			var account = 'vmwareglobal';
			if (s_account)	account = s_account;
			var s=s_gi(account);
			s.linkTrackVars='prop1,prop2';
			s.linkTrackEvents='None';
			s.prop1 = getProp1();
			s.prop2 = getProp2();
			var eventName = $('#productFamily').val()+':'+$('#techSelProd').val()+':'+problemTextSearch;
				var prop15= 'get-support:technical:' + $('#technicalProblemCategoryType').val();
				try
				{
					s.prop6=eventName.toLowerCase();
					s.prop15=prop15.toLowerCase();					
					//srfile.tagboxlist.riaTrackSupportLink("");
				}catch(e)
				{
				}	
			if (s.pageName){
				var ppn = s.pageName;
				void(s.t());
				s.pageName = ppn;
			};
		},
        search: function() {
            var hash = GSA.getHash();
            //if(!hash) {
            //    return;
            //}
            //alert(hash);
            GSA.parseHash(hash);
            hash = GSA.composeHash();
            var url = GSA.composeGSAUrl(hash);
            GSA.call(url);
			
            //alert(GSA.params.requiredfields.tpsearch_category);
            //alert(GSA.requiredfields.doctype);
            //alert(GSA.requiredfields.category);
            if($('#dl-content-right').is(':hidden')) {
                $('#dl-content-right').show();
            }
            //GSA.dispProd(GSA.filters.dt, GSA.filters.dc);
            $("a[name*='metalink_']").each(function() {
                var name = $(this).attr('name');
                //var value = GSA.dump(GSA.params.requiredfields); //$(this).text();
                if(name.match(/category_(.+)$/)) {
                    //alert(RegExp.$1 +' ==  '+ GSA.filters.dc);
                    if(RegExp.$1 == GSA.filters.dc) {
                        //alert('inside == ' +RegExp.$1 +' ==  '+ GSA.filters.dc);
                        $(this).addClass('gsa-filter-list-li');
                    }
                    else {
                        $(this).removeClass('gsa-filter-list-li');
                    }
                }
                if(name.match(/doctype_(.+)$/)) {
                    if(RegExp.$1 == GSA.filters.dt) {
                        //alert(RegExp.$1 +' ==  '+ GSA.filters.dt);
                        $(this).addClass('gsa-filter-list-li');
                    }
                    else {
                        $(this).removeClass('gsa-filter-list-li');
                    }
                }
            });

            if(GSA.params.q) {
                var q = GSA.urlDecode(GSA.params.q);
                //var q = q.replace(/\s*inmeta:dsca_rdate:daterange:\d{4}-\d{2}-\d{2}\.\.\d{4}-\d{2}-\d{2}/, '');
                $("#gsa_query").val(q);
                collection = "support_request_search";              
									
               
            }

        },
        initSearch: function() {
        	
            var query = $.trim($("#gsa_query").val());            
            /*if(query == "") {
                return;
            }*/
            var hash = GSA.composeFormHash();
            var url = GSA.composeGSAUrl(hash);
            GSA.call(url);
            if($('#dl-content-right').is(':hidden')) {
                $('#dl-content-right').show();
            }
        },
        formSearch: function(query) {
            //var query = $.trim($("#gsa_query").val());
            //if(query == "") {
            //    return;
            //}
			//added for capturing omniture on page load of KB articles
			var hash = GSA.getHash();
			if(hash) {
				GSA.track();
			}
			
            var hash = GSA.composeFormHash(query);
            GSA.setHash(hash);
        },

        composeFormHash: function(query) {
            GSA.params = GSA.defaults;
            GSA.requirefields = {};
            //GSA.filters = {dr: '', dc: '', dt: ''};
            for(p in GSA.params) {
                var fieldname = "#gsa_" + p;
                var formval = $.trim($(fieldname).val());
                if(formval != "" && formval != undefined) {
                    GSA.params[p] = formval;
                }
            }
            //var query = $.trim($("#gsa_query").val());
           // if(query != "") {
                GSA.params.q = GSA.urlEncode(query);
            //}
            var category = $.trim($("select[id$='gsa_category'] :selected").text());
            if(category != "" && category != 'All Documents') {
                GSA.requirefields.doctype = category;
            }
            /*var lang = $.trim($("#gsa_lang").val());
            if(lang != "") {
                GSA.requirefields.dsca_lang = lang;
            }*/
            return GSA.composeHash();
        },
        filterSearch: function(name,value) {
            var hash = GSA.getHash();
            GSA.parseHash(hash);
            GSA.params.start = 0;
            GSA.parseFilters(name,value);
            hash = GSA.composeHash();
            GSA.setHash(hash);
        },
        qEmptySearch: function() {
            var hash = GSA.getHash();
            GSA.parseHash(hash);
            GSA.params.start = 0;
            GSA.params.q ='';
            //GSA.parseFilters(name,value);
            hash = GSA.composeHash();
            GSA.setHash(hash);
            $("#gsa_query").val('');
        },
        addQToFilterSearch: function() {
            var hash = GSA.getHash();
            GSA.parseHash(hash);
            GSA.params.start = 0;
            var query = $.trim($("#gsa_query").val());
            GSA.params.q =query;
            //GSA.parseFilters(name,value);
            hash = GSA.composeHash();
            GSA.setHash(hash);
            $("#gsa_query").val('');
        },

        navSearch: function(hash) {
            GSA.parseHash(hash);
            hash = GSA.composeHash();
	     var url = GSA.composeGSAUrl(hash);
	     GSA.call(url);
        },
        sortSearch: function(hash) {
            GSA.parseHash(hash);
            GSA.params.start = 0;
            var sort = $("#gsa_sort").val();
            GSA.params.sort = sort;
            hash = GSA.composeHash();
            GSA.setHash(hash);
        },
        pageSearch: function(hash,pagenum) {
            GSA.parseHash(hash);
            GSA.params.start = 0;
            GSA.params.num = pagenum;
            hash = GSA.composeHash();
	     var url = GSA.composeGSAUrl(hash);
	     GSA.call(url);
        },
        parseFilters: function(name,value) {
            if(name.match(/^metalink_(.+)$/)) {
                var tag = RegExp.$1;
                //alert(RegExp.$1 + '--' + RegExp.$2);
                //Filter by date range
                /*if(tag.match(/^date_last(\d*|all)month$/)) {
                    var tmp = RegExp.$1;
                    tmp = (tmp != '') ? tmp : 1;
                    GSA.filters.dr = tmp;
                    GSA.composeDateRange(tmp);
                }
                //Filter by product category or product type
                else*/
                if(tag.match(/^(tpsearch_category|tpsearch_doctype)_(.+)$/)) {
                    if(RegExp.$1 == 'tpsearch_category') {
                        GSA.filters.dc = RegExp.$2;
                    }
                    else {
                        GSA.filters.dt = RegExp.$2;
                    }
                    GSA.setMetafield(RegExp.$1, RegExp.$2);
                }
               /* if(tag.match(/^(tpsearch_category|tpsearch_doctype)_(.+)$/)) {
                    GSA.setMetafield(RegExp.$1,value);
                }*/
            }
            return GSA.composeGSAUrl();
        },
        composeDateRange: function(delta) {
            if(delta == '') {
                delta = 1;
            }
            var qdrange = '';
            if(delta != 'all') {
                var dates = GSA.getDateRange(delta);
                qdrange = 'inmeta:dsca_rdate:daterange:' + dates.start + '..' + dates.end;
            }

            var q = GSA.params.q;
            var query = '';

            if(q != '') {
                q = GSA.urlDecode(q);
                if(q.match(/^(.*?)inmeta:dsca_rdate:daterange:\d{4}-\d{2}-\d{2}\.\.\d{4}-\d{2}-\d{2}(.*)$/)) {
                    query = RegExp.$1 + RegExp.$2;
                   }
                else {
                    query = q;
                   }
            }
            else {
                query = '';
            }

            query = $.trim(query);
            if(qdrange != '') {
                if(query != '') {
                    query = query + ' ' + qdrange;
                }
                else {
                    query = qdrange;
                }
            }
            GSA.params.q = GSA.urlEncode(query);
        },
        getDateRange: function(delta) {
            var rdate = {};
            //These functions are from date.js
            rdate.end = Date.today().toString('yyyy-MM-dd');
            rdate.start = Date.today().addMonths(-delta).toString('yyyy-MM-dd');
            return rdate;
        },
        setMetafield: function(key, val) {
            if(val == 'all') {
                delete GSA.requirefields[key];
            }
            else {
                /*
                if(key == 'dsca_type') {
                    if(typeof GSA.requirefields[key] == 'undefined') {
                        GSA.requirefields[key] = [];
                    }
                    if(!GSA.in_array(GSA.keymap[val], GSA.requirefields[key])) {
                        GSA.requirefields[key].push(GSA.keymap[val]);
                    }
                    else {
                        var tmp = [];
                        for(var i=0; i<GSA.requirefields[key].length; i++) {
                            if(GSA.requirefields[key][i] != GSA.keymap[val]) {
                                tmp.push(GSA.requirefields[key][i]);
                            }
                        }
                        GSA.requirefields[key] = tmp;
                    }
                }
                else {
                    GSA.requirefields[key] = GSA.keymap[val];
                }
                */
                GSA.requirefields[key] = val;
            }
        },
        urlEncode: function (string) {
            var returnString = escape(GSA.utf8Encode(string));
            returnString = returnString.replace(/\./g, "%2E");
            returnString = returnString.replace(/\|/g, "%7C");
            return returnString.replace(/:/g, "%3A");
        },
        utf8Encode: function (string) {
            var utftext = "";
            if (string) {
                string = string.replace(/\r\n/g,"\n");
                for (var n = 0; n < string.length; n++) {
                      var c = string.charCodeAt(n);
                      var ch = string.charAt(n);
                      if (c < 128) {
                            utftext += String.fromCharCode(c);
                      }
                    else if((c > 127) && (c < 2048)) {
                            utftext += String.fromCharCode((c >> 6) | 192);
                        utftext += String.fromCharCode((c & 63) | 128);
                      }
                    else {
                        utftext += String.fromCharCode((c >> 12) | 224);
                        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                        utftext += String.fromCharCode((c & 63) | 128);
                      }
                }
              }
            return utftext;
        },
        urlDecode: function(string) {
            return GSA.utf8Decode(unescape(string));
        },
        utf8Decode: function(utftext) {
            var string = "";
            if (utftext) {
                var i = 0;
                var c = c1 = c2 = 0;
                while ( i < utftext.length ) {
                      c = utftext.charCodeAt(i);
                      if (c < 128) {
                            string += String.fromCharCode(c);
                        i++;
                      }
                    else if((c > 191) && (c < 224)) {
                        c2 = utftext.charCodeAt(i+1);
                        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                        i += 2;
                      }
                    else {
                        c2 = utftext.charCodeAt(i+1);
                        c3 = utftext.charCodeAt(i+2);
                        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                        i += 3;
                      }
                }
              }
              return string;
        },
        dump: function(arr, level) {
            var dumped_text = "";
            if(!level) level = 0;

            //The padding given at the beginning of the line.
            var level_padding = "";
            for(var j=0;j<level+1;j++) level_padding += "    ";

            if(typeof(arr) == 'object') { //Array/Hashes/Objects
                for(var item in arr) {
                    var value = arr[item];

                    if(typeof(value) == 'object') { //If it is an array,
                        dumped_text += level_padding + "'" + item + "' ...\n";
                        dumped_text += dump(value,level+1);
                    }
                    else {
                        dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
                    }
                }
            }
            else { //Stings/Chars/Numbers etc.
                dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
            }
            return dumped_text;
        },
        parseHash: function(str) {
            var params = str.split('&');
            for(var i=0; i<params.length; i++) {
                var tmp = params[i].split('=');
                if(tmp[0] == 'requiredfields' && tmp[1]) {
                    var rf = GSA.urlDecode(tmp[1]);
                    var rftmp = rf.split('.');
                    for(var j=0; j<rftmp.length; j++) {
                        if(rftmp[j].match(/^\((.+)\)$/)) {
                            var tmtmp = RegExp.$1;
                            var tftmp = tmtmp.split('|');
                            for(var k=0; k<tftmp.length; k++) {
                                var tfmeta = tftmp[k].split(':');
                                if(typeof GSA.requirefields[tfmeta[0]] == 'undefined') {
                                    GSA.requirefields[tfmeta[0]] = [];
                                }
                                var dtmp = GSA.urlDecode(tfmeta[1]);
                                if(!GSA.in_array(dtmp, GSA.requirefields[tfmeta[0]])) {
                                    GSA.requirefields[tfmeta[0]].push(dtmp);
                                }
                            }
                        }
                        else {
                            var rmeta = rftmp[j].split(':');
                            GSA.requirefields[rmeta[0]] = GSA.urlDecode(rmeta[1]);
                        }
                    }
                }
                else if(tmp[0] == 'dscaf') {
                    var filters = tmp[1].split('_');
                    /*category = (filters[0]) ? filters[0] : '';
                    doctype = (filters[1]) ? filters[1] : '';*/
                    //GSA.filters.dt = (filters[2]) ? filters[2] : '';
                }
                else {
                    GSA.params[tmp[0]] = tmp[1];
                }
            }
        },
        composeHash: function() {
            //GSA.params.dscaf = GSA.composeFilters();
         var incidentPack = $('#incidentPackSerialNumber').val();   
	 if(intialKbSearchDone==false)
	{		
		GSA.params = GSA.defaults;
		GSA.params['requiredfields'] = '';
		//GSA.params['partialfields']=GSA.urlEncode("products:"+$('#techSelProd').val());
		if(incidentPack != "")
		{
			GSA.params['partialfields']='';		
		}else{
			GSA.params['partialfields']= GSA.urlEncode("products:"+$('#productFamily').val())+'.'+GSA.urlEncode("issue:"+$('#technicalProblemCategoryType').val());	
		}
		GSA.params['q'] = "";
		GSA.params['tlen'] =GSA.urlEncode("200");
		intialKbSearchDone = true;		
	}else{
		if(incidentPack != "")
		{
			GSA.params['partialfields']='';		
		}else{
			GSA.params['partialfields']=GSA.urlEncode("products:"+$('#productFamily').val());		
		}
		GSA.params['tlen'] =GSA.urlEncode("200");
		GSA.params.requiredfields = GSA.composeRequireFields();
		GSA.params['requiredfields'] = "";
		var query = $.trim($("#gsa_query").val());
		GSA.params['q'] = GSA.urlEncode(query);
	}
            var params = [];
            for(p in GSA.params) {
                params.push(p + '=' + GSA.params[p]);
            }
            if(params.length > 0) {
                return params.join('&');
            }
            return '';
        },
        composeFilters: function() {
            var dr = (GSA.filters.dr) ? GSA.filters.dr : '';
            var dc = (GSA.filters.dc) ? GSA.filters.dc : '';
            var dt = (GSA.filters.dt) ? GSA.filters.dt : '';

            return dr + '_' + dc + '_' + dt;
        },
        composeRequireFields: function() {
            var fields = [];
            for(name in GSA.requirefields) {
                if(GSA.requirefields[name]) {
                    //alert(GSA.requirefields[name]);
                    if(GSA.is_array(GSA.requirefields[name])) {
                        var tmp = [];
                        for(var i=0; i<GSA.requirefields[name].length; i++) {
                            tmp.push(name + ':' + GSA.urlEncode(GSA.urlEncode(GSA.requirefields[name][i])));
                        }
                        if(tmp.length > 0) {
                            fields.push('(' + tmp.join('|') + ')');
                        }
                    }
                    else {
                        fields.push(name + ':' + GSA.urlEncode(GSA.urlEncode(GSA.requirefields[name])));
                    }
                }
            }
            if(fields.length > 0) {
                return fields.join('.');
            }
            return '';
        },
        composeGSAUrl: function(qstr) {
            var host = window.location.hostname;
            //MODIFIED this Method as part of  BUG-00017357
            //return 'https://' + host + GSA.internal.script + '?' + qstr;            
            var prefix = window.location.protocol + '//';
            return prefix + host + GSA.internal.script + '?' + qstr;

        },
        getHash: function(url) {
            url = url || window.location.href;
            return url.replace(/^[^#]*#?(.*)$/, '$1');
        },
        setHash: function(hash, url,name,value) {
            url = url || window.location.href;
            //url = url.replace(/^([^#?]+)[?#]?.*$/, '$1' + "#" + hash) ;
            //alert(url);
            //alert(hash);
            window.location.href = url.replace(/^([^#?]+)[?#]?.*$/, '$1' + "#" + hash);
           // GSA.dispProd(name,value);

        },
        is_array: function(arr) {
            if (!arr) {
                 return false;
            }
            if(typeof arr === 'object') {
                if(arr.hasOwnProperty) {
                    var key = '';
                    for(key in arr) {
                        if (false === arr.hasOwnProperty(key)) {
                            return false;
                        }
                    }
                }
                if (arr.propertyIsEnumerable('length') || typeof arr.length !== 'number') {
                    return false;
                }
                return true;
            }
            return false;
        },
        in_array: function(needle, arr) {
            var key = '';
            for(key in arr) {
                if(arr[key] === needle) {
                    return true;
                }
            }
            return false;
        },
        dispProd : function (dtValue,dcValue){
            $("#product").html("");
            $("#doctype").html("");
            $('#search_filters').hide();
            if(dcValue!="" && dcValue!="all" ) {//Category type
                $('#search_filters').show();
                $("#product").html(support.globalVars.selectedProd+": "+dcValue +" <a href='#' name='metalink_tpsearch_category_all' class='delete'></a>");
            }
            if(dtValue!="" && dtValue!="all") {// doctype
                $('#search_filters').show();
                $("#doctype").html(support.globalVars.selectedType+": "+dtValue +" <a href='#' name='metalink_tpsearch_doctype_all' class='delete'></a>");
            }
            $("#product a").click(function(){
                var name = $(this).attr('name');
                var value = $(this).text();
                GSA.filterSearch(name,value);

                return false;
            });
            $("#doctype a").click(function(){
                    var name = $(this).attr('name');
                    var value = $(this).text();
                    GSA.filterSearch(name,value);
                    return false;
                });
           },
           dispTagLinks : function (){
            //$("#tagLink").html("");
            var taglink = GSA.internal.taglink;
            if(taglink == '') {
               $("#tagLink").html("");
            }
            if(taglink!="") {
                $("#tagLink").html(taglink);
            }
           }

    };

var srfile = {};
srfile.tagboxlist = {
		tagCloudForRequestBody: '',
		onFirstLoad: true,
		initialize: function() {
			
			try
			{
				var selectedProductFamily = srfile.tagboxlist.createTagValue($('#productFamily').val());
				var selectIssueCategory =srfile.tagboxlist.createTagValue($('#technicalProblemCategoryType').val());
				var incidentPackSerialNumber = $('#incidentPackSerialNumber').val();
				if(incidentPackSerialNumber != "")
				{
					srfile.tagboxlist.tagCloudForRequestBody = selectIssueCategory;
				}else{
					srfile.tagboxlist.tagCloudForRequestBody = selectedProductFamily + selectIssueCategory;
				}
			}catch(e){
			
			}
			try
			{
				srfile.tagboxlist.renderHtml();
			}catch(e)
			{
			}
			if(tagErrorKbSearch==true)
			{
				myvmware.kbSupport.performKBSearch();
				tagErrorKbSearch=false;
			}
		},
		renderHtml: function(){
			var xmlRequestBody = $.trim("<getTagCloud><taggableTypes>801</taggableTypes><tags>kb</tags>"+srfile.tagboxlist.tagCloudForRequestBody+"<sort>6001</sort><numOfBuckets>10</numOfBuckets><numResults>75</numResults><recursive>true</recursive></getTagCloud>");
			var method = "POST";
			var location = "/communities_rest_api/tagCloudService/tagCloud";
			var params = xmlRequestBody;
			var type = 'xml';
			srfile.tagboxlist.callajaxrequest(method, location, params, type);
		},
		callajaxrequest: function(method, loc, params, type){
			var gettaglist;
			$.ajax({
				type: method,
				url: loc,//"/communitiesRest/"
				beforeSend : function (xhr) {
					xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
					xhr.setRequestHeader('Access-Control-Allow-Methods', 'POST');
					xhr.setRequestHeader('Access-Control-Allow-Headers', 'Content-Type');
					xhr.setRequestHeader('Access-Control-Max-Age', '86400');
				},
				dataType: type,
				data:params,
				contentType: "application/xml",
				error: function(XMLHttpRequest,textStatus,errorThrown) {
					$("#tag_clouds_display_div").append(support.globalVars.unableToProcessMsg);
					$('.expandTags').addClass('hidden');
					if(tagKbSearchDataOverriden==true)
					{
						myvmware.kbSupport.performKBSearch();
					}
					tagKbSearchDataOverriden=true;					
				},
				success: function(result){
					srfile.tagboxlist.parseajaxresponse(result);
				}
			});
		},
		parseajaxresponse: function(data){
			if(typeof data == "string") {
				xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
				xmlDoc.async = true;
				xmlDoc.loadXML(data);
			}
			else {
				xmlDoc = data;
			}
			//added on 10/20-
			 
			if($("#gsa_query").val()==''){
				var getGsaStr= 'kb,'+$("#productCategorySearch").val();
			}else{
				var getGsaStr = 'kb,'+ $('#gsa_query').val();
			}
			var getgsastrArr = getGsaStr.split(",");
			try
			{
				var cleanTags = [];
				$.each(getGsaStr.split(","), function(){
					cleanTags.push($.trim(this));
				});
				getgsastrArr = cleanTags;
			}catch(e){
			}
			var dispTagList = "";
			var dispTagListFull = "";
			var tagcount = 0;
			$(xmlDoc).find('return').each(function(){
				var tagVal =$(this).find('tag').text();
				var titleCount =$(this).find('count').text();
				if($.inArray(tagVal, getgsastrArr) == -1 ){
					dispTagListFull+= "<span class='taglist_popularity"+$(this).find('bucket').text()+"'><a name='tag_clouds' href='#' title='Number of articles tagged: "+titleCount+"'>"+tagVal+"</a> </span>";
					/*if(tagcount < 25 ){
						dispTagList+= "<span class='taglist_popularity"+$(this).find('bucket').text()+"'><a name='tag_clouds' href='#' title='Number of articles tagged: "+titleCount+"'>"+tagVal+"</a> </span>";
					}*/
					tagcount++;
				}
			});
			/*var dispTagList_new;
			if(tagcount > 25){
				dispTagList_new = dispTagList+'<div id="modal_box_tagclouds_id"><a href="#">Expand tag list >></a></div>';
			}else{
				dispTagList_new = dispTagListFull;
			}*/
			$('#tag_clouds_display_div').show();
			$('#tag_clouds_display_div').html('');
			//$('#tag_clouds_display_div').html(dispTagList_new);
			$('#tag_clouds_display_div').html(dispTagListFull);
			//Commented as part of  BUG-00015735 START
			/*$('#tag_clouds_display_full_div').hide();
			$('#tag_clouds_display_full_div').html('');
			$('#tag_clouds_display_full_div').html(dispTagListFull+'<div id="modal_box_tagclouds_id_collapse"><a href="#">Collapse tag list <<</a></div>');
			$('#modal_box_tagclouds_id a').unbind('click').bind('click',function (e) {
				e.preventDefault();
				$('#tag_clouds_display_div').hide();
				$('#tag_clouds_display_full_div').show();
			});
			$('#modal_box_tagclouds_id_collapse a').unbind('click').bind('click',function (e) {
				e.preventDefault();
				$('#tag_clouds_display_full_div').hide();
				$('#tag_clouds_display_div').show();
			});*/
			//Commented as part of  BUG-00015735 END			
			srfile.tagboxlist.showTagBoxList();
		},
		showTagBoxList: function(){
			//if($('.textboxlist')){
			//	$('.textboxlist').remove();
			//}
//			var gsatext = new $.TextboxList('#gsa_query', {unique: true, plugins: {autocomplete: {
//				minLength: 2,
//				queryRemote: true,
//				remote: {url: 'autocomplete.php'}
//			}}});
			//commented by saritha - 10/20
		//	var gsatext = $('#gsa_query');

//			gsatext.addEvent('bitBoxRemove', makeNewRequest);
//			gsatext.addEvent('bitBoxAdd', srfile.tagboxlist.checkBoxText);
			
			
//			Click on tag
			$("a[name='tag_clouds']").click(function(e) {
				
				var selectedTags = $(e.target).text();	
				var gsastr = $('#gsa_query').val();
				try
				{
					var checkVariable = '<tags>' + $('#gsa_selected_tags').val() + '</tags>';
					var checkTag = '<tags>' + selectedTags  + '</tags>';
					if (checkVariable.indexOf(checkTag) >= 0)
					{	
						return false;
					}
				}catch(e)
				{
				}
				
				var keywords=gsastr+','+selectedTags;
				//var eventName = $('#technicalProblemCategoryType').val() +' , ' + $('#techSelProd').val() +', ' + selectedTags;				
				var prop6 = $('#productFamily').val()+':'+$('#techSelProd').val()+':'+keywords;
				var prop15 = 'get-support:technical:' + $('#technicalProblemCategoryType').val();			             
				try
				{
					s.prop6=prop6.toLowerCase();
					s.prop15=prop15.toLowerCase();
					//riaLink("technical");
					srfile.tagboxlist.riaTrackSupportLink("");
				}catch(e)
				{
				}				
				//add the tag to relevant key word section
				$('.keyWord-wrapper').append('<span>'+ selectedTags +'<a href="#" class="removeIcon"></a> </span>');
				
				if(gsastr==""){
					gsastr=selectedTags;
				}else{
					//added space for BUG-00023954
					gsastr=gsastr+", "+selectedTags;
				}
				$('#gsa_query').val(gsastr);
				//gsatext.add(selectedTags);
				var gsa_selected_tagtext = $('#gsa_selected_tags').val();
				if(gsa_selected_tagtext != "" && gsa_selected_tagtext != undefined){
					gsa_selected_tagtext = gsa_selected_tagtext+'</tags><tags>'+selectedTags;
				}else{
					gsa_selected_tagtext = selectedTags;
				}
				$('#gsa_selected_tags').val(gsa_selected_tagtext);
				srfile.tagboxlist.tagCloudForRequestBody ='<tags>'+gsa_selected_tagtext+'</tags>';
				srfile.tagboxlist.renderHtml();
				return false;
			});

			if($("#gsa_query").val()==''){
				var getGsaTextBoxVal= $("#productCategorySearch").val();
			}else{
				var getGsaTextBoxVal =  $('#gsa_query').val();
			}				 		
			//var getGsaTextBoxVal = $('#gsa_query').val();
			getGsaTextBoxVal = getGsaTextBoxVal.replace(/,/g, " ");
			if(getGsaTextBoxVal != ""){
				//As part of defect BUG-00017357 start
				var query='';
				if($("#gsa_query").val()==''){					
					 query = $.trim($("#productCategorySearch").val());
				}else{					
					//var query = $.trim($("#gsa_query").val());
					 query = $.trim(($("#productCategorySearch").val() +","+ $("#gsa_query").val()));
				}
				//As part of defect BUG-00017357 end
				GSA.params = GSA.defaults;
				GSA.requirefields = {};
				for(p in GSA.params) {
					var fieldname = "#gsa_" + p;
					var formval = $.trim($(fieldname).val());
					if(formval != "") {
						GSA.params[p] = formval;
					}
				}
				GSA.params.q = GSA.urlEncode(query);
				var category = $.trim($("select[id$='gsa_category'] :selected").text());
				if(category != "" && category != 'All Documents') {
					GSA.requirefields.doctype = category;
				}
				if(tagKbSearchDataOverriden==true)
				{
					hash = GSA.composeHash();
					var url = GSA.composeGSAUrl(hash);
					GSA.call(url);
				}
				tagKbSearchDataOverriden=true;
			}else if(srfile.tagboxlist.onFirstLoad == false && getGsaTextBoxVal == ""){
				$('div#search-index').remove();				
			}
		},
		checkBoxText: function(args){
			if(args.value[1]== ""){
				args.remove();
			}else{
				var getGsaTextBoxVal = $('#gsa_query').val();
				getGsaTextBoxVal = getGsaTextBoxVal.replace(/,/g, " ");
				if(getGsaTextBoxVal != ""){
					GSA.formSearch(getGsaTextBoxVal);
				}
			}
		},
		/*
		 * This is required, to track pagename. 
		 * 
		 */
		riaTrackSupportLink :function (appendName){
			var account ;
			if (document.location.host =="my-qai.vmware.com") {
				account="vmwaremyvmware"
				} else {
				account = 'vmwareglobal';
				}		
			if (s_account)	account = s_account;
			var s=s_gi(account);
			s.linkTrackVars='prop1,prop2';
			s.linkTrackEvents='None';
			s.prop1 = getProp1();
			s.prop2 = getProp2();	
			
			if (s.pageName){
				var ppn = s.pageName;
				s.pageName += "  "+appendName;
				void(s.t());
				s.pageName = ppn;
			};
		},
		createTagValue :function (temp){
			try
			{				
				var index = temp.indexOf(" ");
				if(index !=-1)
				{
					temp = temp.replace(new RegExp(" ", 'g'),"-");
				}
				index = temp.indexOf("(");
				if(index !=-1)
				{
					temp = temp.replace(new RegExp("(", 'g'),"");
				}
				index = temp.indexOf(")");
				if(index !=-1)
				{
					temp = temp.replace(new RegExp(")", 'g'),"");
				}
				index = temp.indexOf("/");
				if(index !=-1)
				{
					temp = temp.replace(new RegExp("/", 'g'),"-");				
				}
				srfile.tagboxlist.tagCloudForRequestBody = temp;
			}catch(e)
			{
			}
			if(temp != "")
			{
				return "<tags>" + temp+ "</tags>";
			}
			else{
				return "";
			}
		}

};

