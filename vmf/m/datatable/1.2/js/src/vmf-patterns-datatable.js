
vmf.datatable = function($){
		_t =this;
		tabObj = "123";
		conf = "";
    return {
			build_1: function(tableId, config){ 
				return $("#" + tableId).dataTable(config); 
			},
			build: function(tableObj, config){
				var self = this; 
			    config = $.extend( true, {fnServerData: self.fnServerData}, config );
				return this.tabObj = $(tableObj).dataTable(config); 
			},
			reload:	function (tableObj,url,cB,type,data,errorCb){
				var t = tableObj.dataTable();
				t.fnReloadAjax(url, cB, type, data, errorCb);
			},
			wrodwrap : function (tableObj,col) {
					var t = tableObj.dataTable();
					setTimeout(function() {t.fnAdjustColumnSizing(false);}, 500);
			},
			addEllipsis: function(){
				if(!$(".paging_full_numbers span.last").hasClass("paginate_button_disabled")){
					if(!$(".paginate_ellipse").length)
						$('<span class="paginate_ellipse">&hellip;</span>').insertBefore($(".paging_full_numbers span.next"));
				} else {
					$(".paginate_ellipse").remove();
				}
			},
			fnServerData : function ( url, data, callback, settings, type, errorCb) {
				settings.jqXHR = $.ajax( {
					"type":type || "GET",
					"url": url,
					"data": data,
					"success": function (json) {
						$(settings.oInstance).trigger('xhr', settings);
						var res = (!json.aaData) ? vmf.getObjByIdx(json,0): json;
						if (typeof res.aaData != "object" || res.aaData==null){
							if(settings.oApi && settings.oApi._fnProcessingDisplay){
								settings.oApi._fnProcessingDisplay( settings, false );
							}
							if (settings.error) settings.error(settings.oInstance, json);
							else callback( json );
							return;
						} else callback( res );
					},
					"dataType": "json",
					"cache": false,
					"error": function (xhr, error, thrown) {
						if ( error == "parsererror" ) {
							/*alert( "DataTables warning: JSON data from server could not be parsed. "+
								"This is caused by a JSON formatting error." );*/
						}
						if(settings.error) settings.error(settings.oInstance, {"ERROR_CODE":500,"ERROR_MESSAGE":settings.errMsg || "The system encountered a problem. Please try again later."});
						else if (errorCb) errorCb(error);
						_fnProcessingDisplay( settings, false );
					}
				} );
			}
    };
}(jQuery);
