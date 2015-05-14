if (typeof ccp == "undefined")  
	ccp = {};
	t = {};
ccp.ccpHome = {
	curFundJson:null,
    init: function() {
		t = ccp.ccpHome; //alias for ccp.home object
		vmf.datatable.build($('#tbl-ccpHome'),{
			"aoColumns": [
				{"sTitle": "","sClass":"tdOpenCloseButton","sWidth":"5px","bSortable":false},
				{"sTitle": ccp.globalVar.fundName,"sWidth":"90px","bSortable":false},
				{"sTitle": ccp.globalVar.fundOwner,"sWidth":"75px","bSortable":false},
				{"sTitle": ccp.globalVar.expDate,"sWidth":"65px","bSortable":false},
				{"sTitle": "","bVisible":false},
				{"sTitle": "","bVisible":false},
				{"sTitle": "","bVisible":false},
				{"sTitle": ccp.globalVar.creditType,"sWidth":"120px","bSortable":false},
				{"sTitle": ccp.globalVar.currency,"sWidth":"35px","bSortable":false},
				{"sTitle": ccp.globalVar.creditsRemaining,"sWidth":"100px","bSortable":false}
			],
			"oLanguage": {
				"sEmptyTable":ccp.globalVar.noActiveFunds,
				"sProcessing":ccp.globalVar.loadingLabel,
                "sLoadingRecords":""
			},
			"sAjaxSource": ccp.globalVar.activeFundsUrl,
			"bInfo":false,
			"bServerSide": false, 
			"bAutoWidth" : false,
        	"sDom": 'zrtSpi',  
			"bFilter":false,
			"bProcessing":true,
			"fnRowCallback": function(nRow,aData,iDisplayIndex){ 
				var $nRow=$(nRow);
				$nRow.find("td:eq(0)").html("<span class=\"openclose\"></span>");
				$nRow.find("td:eq(1)").html("<a href=\"ccp-overview" + "?_VM_fundDetails=true&_VM_FundID=" + encodeURIComponent(aData[5]) 
        + "\" id="+aData[5]+">"+aData[1]+"</a>"); 
        
        		
				$nRow.find("td:eq(4)").html("<span class=\"tooltiptext\" title=\"" + ccp.globalVar.ccTypeText + "\">"+ (aData[7] == 'VSPP') ? ccp.globalVar.vsppType : aData[7] +"</span>");
				
				$nRow.find("td:eq(6)").addClass('right');
				if (aData[4]=="1"){ $nRow.find("td:eq(3)").html("<span class=\"textRed\">"+aData[3]+"</span>");	}
				if ($.trim(aData[9]).length && isNaN(parseInt(aData[9],10))){
					$nRow.find("td:eq(6)").html("<span class=\"tooltiptext\" title=\"" + ccp.globalVar.viewMyCreditsTooltip + "\"><a class=\"viewTokens\" href=\"#\">"+ccp.globalVar.viewMyCredits+"</a></span>");
					//myvmware.hoverContent.bindEvents($('.tooltiptext'), 'funcleft'); 
				}
				$nRow[0].idx = iDisplayIndex;
				$nRow.data("fId",aData[5]).data("ea",ccp.globalVar.accountLabel+" : "+aData[6]);
				return nRow;
			},
			"fnDrawCallback": function(){ 
				$(this.fnGetNodes()).addClass("expandable");
				var settings= this.fnSettings();
				if(settings.jqXHR && settings.jqXHR.responseText!==null && settings.jqXHR.responseText.length && typeof settings.jqXHR.responseText =="string"){
					t.curFundJson = vmf.getObjByIdx(vmf.json.txtToObj(settings.jqXHR.responseText),0);
				}
				if($('#tbl-ccpHome .tooltiptext').length) {
					myvmware.hoverContent.bindEvents($('#tbl-ccpHome .tooltiptext'), 'funcleft');
				}
			},
			"fnInitComplete": function (){
				t.dt = this;
				$('.dataTables_wrapper').find('.loadWraper').hide();
				t.dt.find('span.openclose').live("click",function (){
					t.expandRow($(this));
				});
				t.dt.find("a.viewTokens").live("click",function (){
					var $openClose = $(this).closest('tr').find('span.openclose');
					if(!$(this).hasClass('open')){
						$(this).addClass('open').text(ccp.globalVar.hideMyCredits);
					}else{
						$(this).removeClass('open').text(ccp.globalVar.viewMyCredits);
					}
					t.expandRow($openClose);
					return false;
				});
			},
			"bPaginate": false,
			"sPaginationType": "full_numbers"
		});
	},//end of init
	expandRow :function(o){
		t.nTr = o[0].parentNode.parentNode;
		if (o.hasClass('minus')){
			o.removeClass('minus');
			$(t.nTr).removeClass("expanded").find('a.viewTokens').removeClass('open').text(ccp.globalVar.viewMyCredits).end().next("tr").hide();
		}else{
			o.addClass('minus');
			$(t.nTr).addClass("expanded").find('a.viewTokens').addClass('open').text(ccp.globalVar.hideMyCredits);
			if(!t.nTr.haveData){
				t.dt.fnOpen(t.nTr,t.showloading(),'');
				t.getCdata($(t.nTr),t.nTr.idx);
				t.nTr.haveData = true;
				$(t.nTr).next("tr").addClass('more-detail');
			}else{
				$(t.nTr).next("tr").show();			
			}
		};
		//t.checkOpenClose(o);
	},
	showloading :function(){return sOut="<div class='loadWraper' style='text-align:center; padding-left:40%'><div class='loading_big'>"+ccp.globalVar.loadingLabel+"</div></div>";},
	getCdata:function(rowObj, idx){
		var sOut = [];
		sOut.push('<div class="more-details-history"><div class="history_more_content bottomarea clearfix">');
		sOut.push('<h4>'+rowObj.data("ea")+'</h4>');
		sOut.push('<table class="file_details_tbl" id="'+ ("ccp-child-table-" + idx ) + '"></table>');
		sOut.push('</div></div>');
		$(t.nTr).next("tr").addClass('more-detail').find("td").html(sOut.join(''));
		
		var $subTable = $("#ccp-child-table-" + idx);
		vmf.datatable.build($subTable,{
			"aoColumns": [
				{"sTitle": ccp.globalVar.subFundId, "sWidth":"40px"},
				{"sTitle": ccp.globalVar.subFundName, "sWidth":"150px"},
				{"sTitle": ccp.globalVar.fundUser, "sWidth":"80px"},
				{"sTitle": ccp.globalVar.creditsRemaining,"sClass":"right", "sWidth":"50px"}
			],
			"aaData":t.curFundJson.subaaData[rowObj.data("fId")],
			"bInfo":false,
			"bServerSide": false, 
			"bAutoWidth" : false,
        	"sDom": 'zrtSpi',
			"bFilter":false,
			"fnRowCallback": function(nRow,aData,iDisplayIndex){ 
				$(nRow).find('td:eq(3)').addClass('right');
				return nRow;
			},
			"fnDrawCallback": function(){
				if($subTable.find('.tooltiptext').length) {
					myvmware.hoverContent.bindEvents($subTable.find('.tooltiptext'), 'funcleft');
				}
			},
			"fnInitComplete": function (){},
			"bPaginate": false,
			"sPaginationType": "full_numbers"
		})
	}
};//end of main 