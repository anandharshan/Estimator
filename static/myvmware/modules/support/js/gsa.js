(function($) {
    $(document).ready(function() {
        $("#sr_search_form").submit(function() {
            var hash = GSA.getHash();
            if(!hash) {
                var query = $.trim($("input#gsa_query").val());
                GSA.formSearch(query);
            } else {
                GSA.addQToFilterSearch();
            }
            return false;
        });
        /*$("a[name*='tag_']").click(function() {
            var query = $.trim($("input#gsa_query").val());
            var selectedTags = $(this).attr('text');*/
            /*if(GSA.internal.taglink == undefined) {
                GSA.internal.taglink = '<a href="#">'+selectedTags+'</a>';
            } else {
                GSA.internal.taglink += ' <a href="#">'+selectedTags+'</a>';
            }
            alert(GSA.internal.taglink);*/
            /*query =query +' '+selectedTags;
            GSA.formSearch(query);
            return false;
        });*/
        $("input[name*='button_reset']").click(function() {
           GSA.qEmptySearch();
            return false;
        });
        $("a[name*='metalink_']").click(function() {
            var name = $(this).attr('name');
            var value = $(this).text();
            GSA.filterSearch(name,value);
            //GSA.qEmptySearch(name,value);
            return false;
        });
       /* $("a[name*='clear_q']").click(function() {
            GSA.qEmptySearch();
            return false;
        });*/

        $(window).bind('hashchange', function() {
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
            hash: '',
            tagLink: ''
        },
        //Default search parameters
        defaults: {
            site:        'kb_collection',
            client:    'srfile_frontend',
            getfields: '*',
            output:    'xml_no_dtd',
            filter:     '0',
            proxyreload: '1',
            proxystylesheet: 'srfile_frontend',
            tpsearch_global: 'all',
            //sort: 'date:D:S:d1',
            num: '10',
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
                type: "GET",
                url: url,
                success: function(data, textStatus) {
                    //Remove date range query from the normal search query
                    data = data.replace(/\s*inmeta:dsca_rdate:daterange:\d{4}-\d{2}-\d{2}\.\.\d{4}-\d{2}-\d{2}/, '');
                    var docid = $(GSA.internal.docid);
                    docid.html(data);
                    $('#gsa-result-table tr:even', docid)
                        .filter(':gt(0)')
                           .removeClass('results-table-row-odd')
                           .addClass('results-table-row-even');

                     //GSA.dispProd(GSA.filters.dt, GSA.filters.dc);
                    //GSA.dispTagLinks();
                }
            });
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
                $("input#gsa_query").val(q);
                collection = "support_request_search";
                //Setting site catalyst tracking variables
                /*s.pageName="<?=$site?> : srfile : search"
                var lang = $.trim($("input#gsa_lang").val());
                if(lang != "en") {
                    s.pageName="vmw" + lang + " : srfile : search";
                } else {
                    s.pageName="vmware : srfile : search_results";
                }*/
                s.prop6=$.trim($("input#gsa_query").val());
                s.eVar6=$.trim($("input#gsa_query").val());
                s.prop15=collection;
                s.eVar8=collection;

                if(s.pageName.search("search_results") == -1){
                  s.pageName = s.pageName + " : search_results"
                }

               var s_code=s.t();if(s_code)document.write(s_code)
                //end site catalyst
            }

        },
        initSearch: function() {
            var query = $.trim($("input#gsa_query").val());
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
            //var query = $.trim($("input#gsa_query").val());
            //if(query == "") {
            //    return;
            //}
            var hash = GSA.composeFormHash(query);
            GSA.setHash(hash);
        },

        composeFormHash: function(query) {
            GSA.params = GSA.defaults;
            GSA.requirefields = {};
            //GSA.filters = {dr: '', dc: '', dt: ''};
            for(p in GSA.params) {
                var fieldname = "input#gsa_" + p;
                var formval = $.trim($(fieldname).val());
                if(formval != "") {
                    GSA.params[p] = formval;
                }
            }
            //var query = $.trim($("input#gsa_query").val());
           // if(query != "") {
                GSA.params.q = GSA.urlEncode(query);
            //}
            var category = $.trim($("select[id$='gsa_category'] :selected").text());
            if(category != "" && category != 'All Documents') {
                GSA.requirefields.doctype = category;
            }
            /*var lang = $.trim($("input#gsa_lang").val());
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
            $("input#gsa_query").val('');
        },
        addQToFilterSearch: function() {
            var hash = GSA.getHash();
            GSA.parseHash(hash);
            GSA.params.start = 0;
            var query = $.trim($("input#gsa_query").val());
            GSA.params.q =query;
            //GSA.parseFilters(name,value);
            hash = GSA.composeHash();
            GSA.setHash(hash);
            $("input#gsa_query").val('');
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
        pageSearch: function(hash,pagenum) {
            GSA.parseHash(hash);
            GSA.params.start = 0;
            //var pagenum = $("#per_page_select").val();
            GSA.params.num = pagenum;
            hash = GSA.composeHash();
            GSA.setHash(hash);
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
            return 'http://' + host + GSA.internal.script + '?' + qstr;
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
                $("#product").html("Selected Product: "+dcValue +" <a href='#' name='metalink_tpsearch_category_all' class='delete'></a>");
            }
            if(dtValue!="" && dtValue!="all") {// doctype
                $('#search_filters').show();
                $("#doctype").html("Selected Type: "+dtValue +" <a href='#' name='metalink_tpsearch_doctype_all' class='delete'></a>");
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
})(jQuery);