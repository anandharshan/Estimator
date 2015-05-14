(function($) {
	$(document).ready(function() {
		
		$("#dl_search_form").submit(function() {
			//alert('start');
			//return;
			GSA.formSearch();	
			return false;
		}); 
		
		$("#btn-search").click(function() {
			//alert('start');
			//return;
			GSA.formSearch();
			 if (("onhashchange" in window) && !($.browser.msie)) { 
			    $(window).bind('hashchange', function(e) {
					GSA.search();
				});           
			} else {
				GSA.search();
			}
			return false;
		}); 
		$("a[name*='metalink_']").click(function() {
			var name = $(this).attr('name');
			GSA.filterSearch(name);
			return false;
		});
		$(window).bind('hashchange', function(e) {
			GSA.search();
			});
	$(window).trigger('hashchange');
	});
})(jQuery);

var GSA;

(function($) {
	GSA = {
		internal:  {
			docid: '#dl-content-left',
			script: '/gsa/search',
			hash: ''
		},
		//Default search parameters
		defaults: {
			site: 	   'dsca_collection',
			client:    'dsca_frontend',
			getfields: '*',
			output:    'xml_no_dtd',
			filter: 	'0',
			proxyreload: '1',
			proxystylesheet: 'dsca_frontend',
			//sort: 'date:D:S:d1',
			num: '10',
			entqr:  3
		},
		params: {},
		//Meta fields
		requirefields: {},
		keymap: {
			dc: 	'Datacenter Downloads',
			dt:		'Desktop Downloads',
			all:	'All',
			pr:		'Product Binaries',
			dr:		'Drivers & Tools',
			op:		'Open Source'
		},
		filters: {
			dr: '',
			dc: '',
			dt: ''
		},
		call: function(url) {
			//alert(url);
			$.ajax({
				type: "GET",
				url: url, 
				success: function(data, textStatus) {
					//alert('success ' + textStatus);
					//Remove date range query from the normal search query
					//alert(data);
					data = data.replace(/\s*inmeta:dsca_rdate:daterange:\d{4}-\d{2}-\d{2}\.\.\d{4}-\d{2}-\d{2}/, '');
					var docid = $(GSA.internal.docid);
					//Show refine search results all the time.
					$('#refineSearch').show();
            		docid.html(data);
					$('#gsa-result-table').addClass('searchResTable');
					$('#gsa-result-table').next().addClass('moreLinks');
            		$('#gsa-result-table tr:even', docid)
						.filter(':gt(0)')
               			.removeClass('odd')
               			.addClass('even');
					$('#gsa-result-table tr:odd', docid)
						.filter(':gt(0)')
               			.removeClass('even')
               			.addClass('odd');
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
			if($('#gsa_query').val()!=null && $('#gsa_query').val()!=''){
				s.prop6 = $('#gsa_query').val().replace(/\+/g , ' ');
				s.evar6 = $('#gsa_query').val().replace(/\+/g, ' ');
				s.prop15= $('#gsa_site').val();
				s.evar8= $('#gsa_site').val();
			}
			
			if (s.pageName){
				var ppn = s.pageName;
				void(s.t());
				s.pageName = ppn;
			};
		},
		search: function() {
			var hash = GSA.getHash();
			if(!hash) {
				return;
			}
			//alert(hash);
			GSA.parseHash(hash);
			hash = GSA.composeHash();
			
			
			
			var url = GSA.composeGSAUrl(hash);
			//alert("url : " +  url);
			GSA.call(url);
			//alert(GSA.dump(GSA.filters));
			if($('#dl-content-right').is(':hidden')) {
				$('#dl-content-right').show();
			}
			$("a[name*='metalink_']").each(function() {
				var name = $(this).attr('name');
				if(name.match(/date_last(\d*|all)month$/)) {
					var tmp = RegExp.$1;
					tmp = (tmp != '') ? tmp : 1;
					if(tmp == GSA.filters.dr) {	
						$(this).addClass('gsa-filter-list-li');
					}
					else {
						$(this).removeClass('gsa-filter-list-li');
					}
				}
				if(name.match(/dsca_category_(.+)$/)) {
					if(RegExp.$1 == GSA.requirefields.dsca_category || (RegExp.$1 == GSA.filters.dc)) {	
						$(this).addClass('gsa-filter-list-li');
						$('#gsa_category option:selected').removeAttr('selected');
					    $("#gsa_category option[value='"+GSA.requirefields.dsca_category+"']").attr('selected','selected');
					}
					else {
						$(this).removeClass('gsa-filter-list-li');
					}
				}
				if(name.match(/dsca_type_(.+)$/)) {
					if(RegExp.$1 == GSA.filters.dt) {	
						$(this).addClass('gsa-filter-list-li');
					}
					else {
						$(this).removeClass('gsa-filter-list-li');
					}
				}
			});
			if(GSA.params.q) {
				var q = GSA.urlDecode(GSA.params.q);
				var q = q.replace(/\s*inmeta:dsca_rdate:daterange:\d{4}-\d{2}-\d{2}\.\.\d{4}-\d{2}-\d{2}/, '');
				$("input#gsa_query").val(q);
			}
		},
		initSearch: function() {
			var query = $.trim($("input#gsa_query").val());
			if(query == "") {
				return;
			}
			var hash = GSA.composeFormHash();
			var url = GSA.composeGSAUrl(hash);
			GSA.call(url);
			if($('#dl-content-right').is(':hidden')) {
				$('#dl-content-right').show();
			}
		},
		formSearch: function() {
			var query = $.trim($("input#gsa_query").val());
			if(query == "") {
				return;
			}
			var hash = GSA.getHash();
			if(hash) {
				GSA.track();
			}
			hash = GSA.composeFormHash();
			GSA.setHash(hash);
		},
		composeFormHash: function() {
			GSA.params = GSA.defaults;
			GSA.requirefields = {};
			GSA.filters = {dr: '', dc: '', dt: ''};
			for(p in GSA.params) {
				var fieldname = "input#gsa_" + p;
				var formval = $.trim($(fieldname).val());
				if(formval != "") {
					GSA.params[p] = formval;
				}
			}
			GSA.params['start']=0;
			var query = $.trim($("input#gsa_query").val());
			if(query != "") {
				GSA.params.q = GSA.urlEncode(query);
			}
			var category = $.trim($("#gsa_category").val());
			if(category != "" && category != 'All') {
				GSA.requirefields.dsca_category = category;
			}
			var lang = $.trim($("input#gsa_lang").val());
			if(lang != "") {
				GSA.requirefields.dsca_lang = lang;
			}
			return GSA.composeHash();
		},
		filterSearch: function(name) {
			var hash = GSA.getHash();
			GSA.parseHash(hash);
			GSA.params.start = 0;
			GSA.parseFilters(name);
			hash = GSA.composeHash();
			GSA.setHash(hash);
		},
		navSearch: function(hash) {
			GSA.setHash(hash);
		},
		sortSearch: function(hash) {
			GSA.parseHash(hash);
			GSA.params.start = 0;
			var sort = $("#gsa_sort").val();
			GSA.params.sort = sort;
			hash = GSA.composeHash();
			GSA.setHash(hash);
		},
		pageSearch: function(hash, obj) {
			GSA.parseHash(hash);
			GSA.params.start = 0;
			var pagenum = obj.value;
			GSA.params.num = pagenum;
			hash = GSA.composeHash();
			GSA.setHash(hash);
		},
		parseFilters: function(name) {
			if(name.match(/^metalink_(.+)$/)) {
				var tag = RegExp.$1;
				//Filter by date range
				if(tag.match(/^date_last(\d*|all)month$/)) {
					var tmp = RegExp.$1;
					tmp = (tmp != '') ? tmp : 1;
					GSA.filters.dr = tmp;
					GSA.composeDateRange(tmp);	
				}
				//Filter by product category or product type
				else if(tag.match(/^(dsca_category|dsca_type)_(.+)$/)) {
					if(RegExp.$1 == 'dsca_category') {
						GSA.filters.dc =RegExp.$2;
					}
					else {
						GSA.filters.dt = RegExp.$2;
					}
					GSA.setMetafield(RegExp.$1, RegExp.$2);
				}
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
			if(val == 'all' || val == 'All' ) {
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
				if(key=='dsca_category'){
					GSA.requirefields[key] = val;	
				}else{
					GSA.requirefields[key] = GSA.keymap[val];
				}
				
				
			}
		},
		urlEncode: function (string) {
			var returnString = escape(GSA.utf8Encode(string));
			eturnString = returnString.replace(/\./g, "%2E");
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
					GSA.filters.dr = (filters[0]) ? filters[0] : '';
					GSA.filters.dc = (filters[1]) ? unescape(filters[1]) : '';
					GSA.filters.dt = (filters[2]) ? filters[2] : '';
				}
				else {
					GSA.params[tmp[0]] = tmp[1];
				}
			}
		},
		composeHash: function() {
			GSA.params.dscaf = GSA.composeFilters();
			GSA.params.requiredfields = GSA.composeRequireFields();
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
			return location.protocol+'//' + host + GSA.internal.script + '?' + qstr;
		},
		getHash: function(url) {
			url = url || window.location.href;
			return url.replace(/^[^#]*#?(.*)$/, '$1');
		},
		setHash: function(hash, url) {
			url = url || window.location.href;
			//url = url.replace(/^([^#?]+)[?#]?.*$/, '$1' + "#" + hash) ;
			//alert(url);

			window.location.href = url.replace(/^([^#?]+)[?#]?.*$/, '$1' + "#" + hash);
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
		}
	};
})(jQuery);
