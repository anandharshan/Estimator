if (typeof(epp) == "undefined")  
	epp = {};
	h = {};
epp.eppHome =  {
	remain_large:new Array(), //need to implement
	remain_small:new Array(),
	curFundJson:null,
    init: function() {
		h = epp.eppHome; //alias for myvmware.epp object		
		vmf.datatable.build($('#tbl-eppHome'),{
			"aoColumns": [
				{"sTitle": "","sClass":"tdOpenCloseButton","sWidth":"10px","bSortable":false},
				{"sTitle": "<span class='descending'>" + epp.globalVar.tht1FundName + "</span>","sWidth":"250px","bSortable":false},
				{"sTitle": "<span class='descending'>" + epp.globalVar.tht1FundOwner + "</span>","sWidth":"100px","bSortable":false},
				{"sTitle": "<span class='descending'>" + epp.globalVar.tht1ExpDate + "</span>","sWidth":"90px","bSortable":false},
				{"sTitle": "<span class='descending'>" + epp.globalVar.tht1TokenRemaining + "</span>","sWidth":"110px","bSortable":false},
				{"sTitle": epp.globalVar.graphicImageTitle,"sClass":"tdTokenVals","sWidth":"80px","bSortable":false},
				{"sTitle": "", "bVisible":false},
				{"sTitle": "", "bVisible":false},
				{"sTitle": "", "bVisible":false}
			],
			"oLanguage": {
				"sEmptyTable":epp.globalVar.msgNoFund,
				"sProcessing":epp.globalVar.loadingMsg,
				"sLoadingRecords":""
			},
			"sAjaxSource": $("#fundSummary").val(),
			"bInfo":false,
			"bAutoWidth":false,
			"bProcessing": true,
			"bServerSide": false,   
			"bAutoWidth" : false,
        	"sDom": 'zrtSpi',
			"bFilter":false,
			"fnRowCallback": function(nRow,aData,iDisplayIndex){ 
				var vals = aData[5].split(","), $nRow=$(nRow);
				$nRow.find("td:eq(0)").html("<span class=\"openclose\"></span>");
				//***Do not remove _VM_ variables as functionality with WSRP would fail
				$nRow.find("td:eq(1)").html("<a href=\"" + epp.globalVar.overviewUrl + "?_VM_fundDetails=true&_VM_back=false&_VM_preSelect=default&_VM_FundID=" + encodeURIComponent(aData[7]) 
					+ "\" id="+aData[7]+">"+aData[1]+"</a>");  
				
				if (aData[6]=="1"){
					$nRow.find("td:eq(3)").html("<span class=\"textRed\" title=\""+epp.globalVar.expiryTimeMsg+"\">"+aData[3]+"</span>");
				}
				if ($.trim(aData[4]).length && isNaN(parseInt(aData[4],10))){
					$nRow.find("td:eq(4)").html("<span class=\"tooltiptext\" title=\"" + epp.globalVar.vmtMsg + "\"><a class=\"viewTokens\" href=\"#\">"+epp.globalVar.viewMytokensMsg+"</a></span>");
				}
				$nRow.find("td:eq(5)").html("<div class='oVal'><div class='iVal' title='"+epp.globalVar.msgTimeImage+"'></div></div>");
				epp.common.bChart($nRow.find('td:eq(5) .oVal'), $nRow.find('td:eq(5) .iVal'),vals[1],vals[0],'small');
				$nRow[0].idx = iDisplayIndex;
				$nRow.data("fId",aData[7]).data("ea",aData[8]);
				if ($.trim(aData[9]).length && $.trim(aData[9])=="True-Up"){
					$nRow.find("td:eq(1)").append("<span class=\"badge true truTT\" title=\"" + epp.globalVar.trueupbadge + "\">TRUE-UP</span>");
				}
				if ($.trim(aData[4]).length && $.trim(aData[4])<=0 && $.trim(aData[9]).length && $.trim(aData[9])=="True-Up" && $.trim(aData[10])>=0 && $.trim(aData[12])=="FO"){
					$nRow.find("td:eq(4)").html(aData[11])
					$nRow.addClass('trueUpMode');
				}
				return nRow;
			},
			"fnDrawCallback": function(){ 			
				$(this.fnGetNodes()).addClass("expandable");
				var settings= this.fnSettings();
				if(settings.jqXHR && settings.jqXHR.responseText!==null && settings.jqXHR.responseText.length && typeof settings.jqXHR.responseText =="string"){
					h.curFundJson = vmf.getObjByIdx(vmf.json.txtToObj(settings.jqXHR.responseText),0);
				}
				if($('#tbl-eppHome .truTT').length) {
					myvmware.hoverContent.bindEvents($('.truTT'), 'defaultfunc');
				}
				if($('#tbl-eppHome .tooltiptext').length) {
					myvmware.hoverContent.bindEvents($('#tbl-eppHome .tooltiptext'), 'funcleft');
				}
			},
			"fnInitComplete": function (){
				h.dt = this;
				this.fnAdjustColumnSizing();
				this.parents('.column-wrapper').find("#expandall").removeClass('disabled');
				$('#tbl-eppHome').find('span.openclose').live("click",function (){
					h.expandRow($(this));
				});
				h.dt.find("a.viewTokens").live("click",function (){
					var $openClose = $(this).closest('tr').find('span.openclose');
					if(!$(this).hasClass('open')){
						$(this).addClass('open').text(epp.globalVar.hideMytokensMsg);
						h.expandRow($openClose);
					} else {
						$(this).addClass('close').removeClass('open').text(epp.globalVar.viewMytokensMsg);
						$(this).closest('tr').removeClass("expanded").find('span.openclose').removeClass('minus').end().next('tr.more-detail').hide();
					}
					return false;
				});
			},
			"bPaginate": false,
			"sPaginationType": "full_numbers"
		});
		$("a.disabled").click(function(e){
			e.preventDefault();
		})
		
	},//end of init
	expandRow :function(o){
		h.nTr = o[0].parentNode.parentNode;
		if (o.hasClass('minus')){
			o.removeClass('minus');
			$(h.nTr).removeClass("expanded").find('a.viewTokens').removeClass('open').text(epp.globalVar.viewMytokensMsg).end().next("tr").hide();
		}
		else{
			o.addClass('minus');
			$(h.nTr).addClass("expanded").find('a.viewTokens').addClass('open').text(epp.globalVar.hideMytokensMsg);
			if(!h.nTr.haveData){
				h.dt.fnOpen(h.nTr,h.showloading(),'');
				h.getCdata($(h.nTr), h.nTr.idx);
				h.nTr.haveData = true;
				$(h.nTr).next("tr").addClass('more-detail');
			}else $(h.nTr).next("tr").show();	
		};
	},
	showloading :function(){return sOut="<div class='loadWraper' style='text-align:center; padding-left:40%'><div class='loading_big'>"+epp.globalVar.loadingMsg+"</div></div>";},
	getCdata:function(rowObj, idx){
		var sOut = [];
		sOut.push('<div class="more-details-history">');
		sOut.push('<div class="history_more_content bottomarea clearfix">');
		sOut.push('<h4>'+epp.globalVar.eaTitle+':'+rowObj.data("ea")+'</h4>');
		sOut.push('<table class="file_details_tbl" id="'+ ("child-table-" + idx ) + '">');
		sOut.push('</table>');
		sOut.push('</div>');
		sOut.push('</div>');
		$(h.nTr).next("tr").addClass('more-detail').find("td").html(sOut.join(''));
			
		var $subTable = $("#child-table-" + idx);
		vmf.datatable.build($subTable,{
			"aoColumns": [
				{"sTitle": "<span>" + epp.globalVar.tht2SubFund + "</span>","sWidth":"31%","bSortable":false},
				{"sTitle": "<span>" + epp.globalVar.tht2SubFundUser + "</span>","sWidth":"31%","bSortable":false},
				{"sTitle": "<span>" + epp.globalVar.tht2TokenRemaining + "</span>","bSortable":false},
				{"sTitle": "", "bVisible":false}
			],
			"oLanguage": {
				"sEmptyTable":epp.globalVar.msgNoFund
			},
			"aaData":h.curFundJson.subaaData[rowObj.data("fId")],
			"bInfo":false,
			"bServerSide": false,
			"bAutoWidth" : false,
        	"sDom": 'zrtSpi',   
			"bFilter":false,
			"bAutoWidth": false,
			"aaSorting": [],
			"fnRowCallback":function(nRow,aData,iDisplayIndex){
				var subFundName=aData[0].replace(/\w+/g,function(str){
					return vmf.wordwrap(str,2);
				});
				$(nRow).find('td:eq(0)').html(subFundName);
				if($subTable.parents('tr.more-detail').prev('tr').hasClass('trueUpMode')){
					$(nRow).find("td:eq(0)").html('<span class=\"truTT\" title=\"' + epp.globalVar.trueupsubfundbadge + '\">'+aData[0]+'</span>');
					$(nRow).find("td:eq(1)").html('<span class=\"truTT\" title=\"' + epp.globalVar.trueupsubfundbadge + '\">'+aData[1]+'</span>');
					$(nRow).find("td:eq(2)").html('<span class=\"truTT\" title=\"' + epp.globalVar.trueupsubfundbadge + '\">'+aData[2]+'</span>');
					$(nRow).addClass('inactive');
				}
				if ($.trim(aData[3]).length && $.trim(aData[3])=="Y"){
					$(nRow).find("td:eq(0)").html('<span>'+aData[0]+'</span><span class=\"badge primary\">'+epp.globalVar.primaryLbl+'</span>');
					$(nRow).removeClass('inactive');
				}
				return nRow;
			},
			"fnDrawCallback": function(){
				if($subTable.find('.truTT').length) {
					myvmware.hoverContent.bindEvents($subTable.find('.truTT'), 'defaultfunc');
				}
			},
			"fnInitComplete": function (){},
			"bPaginate": false,
			"sPaginationType": "full_numbers"
		})
	}
};//end of main 