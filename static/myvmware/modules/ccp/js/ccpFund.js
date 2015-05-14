if (typeof ccp == "undefined")  ccp = {};
t = {};
ccp.fund =  {
	curFundJson:null,
	init: function() {
		t = ccp.fund; //alias for ccp object
		var $activeTab = $('ul.tabs li a.active'), $tabNum = $activeTab.attr('id').substring(4), $tabId = $('#content_'+$tabNum), $tbl2Loaded = false;;
		$('.tabContent').hide();
		$('#content_'+$tabNum).show();
		vmf.datatable.build($('#tbl_ccpCurFunds'),{
			"aoColumns": [
				{"sTitle": "","sClass":"tdOpenCloseButton","sWidth":"5px","bSortable":false},
				{"sTitle": "<span class='descending'>" + ccp.globalVar.fundName + "</span>","sWidth":"150px"},
				{"sTitle": "<span class='descending'>" + ccp.globalVar.fundOwner + "</span>","sWidth":"105px"},
				{"sTitle": "<span class='descending'>" + ccp.globalVar.expDate + "</span>","sWidth":"65px"},
				{"sTitle": "","bVisible":false},
				{"sTitle": "","bVisible":false},
				{"sTitle": "","bVisible":false},
				{"sTitle": "<span class='descending'>" + ccp.globalVar.creditType + "</span>","sWidth":"120px"},
				{"sTitle": "<span class='descending'>" + ccp.globalVar.currency + "</span>","sWidth":"35px"},
				{"sTitle": "<span class='descending'>" + ccp.globalVar.creditsRemaining + "</span>","sWidth":"80px"}
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
			"aaSorting": [[ 3, "asc" ]],
			"fnRowCallback": function(nRow,aData,iDisplayIndex){ 
				var $nRow=$(nRow);
				$nRow.find("td:eq(0)").html("<span class=\"openclose\"></span>");
				$nRow.find("td:eq(1)").html("<a href=\"ccp-fund-details" + "?_VM_fundDetails=true&_VM_FundID=" + encodeURIComponent(aData[5]) 
        + "\" id="+aData[5]+">"+aData[1]+"</a>"); 
		$nRow.find("td:eq(1)").html("<a href=\"" + ccp.globalVar.viewFundDetailsUrl 
					+ "&_VM_FundID=" + encodeURIComponent(aData[5]) + "\" id="+aData[5]+">"+aData[1]+"</a>"); 
				
				$nRow.find("td:eq(4)").html("<span class=\"tooltiptext\" title=\"" + ccp.globalVar.ccTypeText + "\">"+ (aData[7] == 'VSPP') ? ccp.globalVar.vsppType : aData[7] +"</span>");
				
				$nRow.find("td:eq(6)").addClass('right');
				if (aData[4]=="1"){ $nRow.find("td:eq(3)").html("<span class=\"textRed\">"+aData[3]+"</span>");	}
				if ($.trim(aData[9]).length && isNaN(parseInt(aData[9],10))){
					$nRow.find("td:eq(6)").html("<span class=\"tooltiptext\" title=\"" + ccp.globalVar.viewMyCreditsTooltip + "\"><a class=\"viewTokens\" href=\"#\">"+ccp.globalVar.viewMyCredits +"</a></span>");
					myvmware.hoverContent.bindEvents($('.tooltiptext'), 'funcleft'); 
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
				if($('#tbl_ccpCurFunds .tooltiptext').length) {
					myvmware.hoverContent.bindEvents($('#tbl_ccpCurFunds .tooltiptext'), 'funcleft');
				}
				$(this).find('tbody tr').each(function(){
					if ($(this).next("tr").hasClass('more-detail') && $(this).hasClass('expanded')){
						$(this).find('span.openclose').addClass('minus');
						$(this).find('a.viewTokens').addClass('open').text(ccp.globalVar.hideMyCredits);
					}
				});
			},
			"fnInitComplete": function (){
				t.dt = this;
				$('.dataTables_wrapper').find('.loadWraper').hide();
				this.parents('.column-wrapper').find("#expandall").removeClass('disabled');
				t.dt.find('span.openclose').live("click",function (){
					$(this).closest('tr').addClass('active').siblings().removeClass('active');
					t.expandRow($(this));
				});
				$(this).find('tbody tr').each(function(){
					if ($(this).next("tr").hasClass('more-detail')){
						$(this).find('span.openclose').addClass('minus');
						$(this).addClass("expanded").find('a.viewTokens').addClass('open').text(ccp.globalVar.hideMyCredits);
					}else{
						$(this).find('span.openclose').removeClass('minus');
						$(this).removeClass("expanded").find('a.viewTokens').removeClass('open').text(ccp.globalVar.viewMyCredits);
					}
				});
				$("a.viewTokens").live("click",function (){
					var $openClose = $(this).closest('tr').find('span.openclose');
					if(!$(this).hasClass('open')){
						$(this).addClass('open').text(ccp.globalVar.hideMyCredits);
					}else{
						$(this).removeClass('open').text(ccp.globalVar.viewMyCredits);
					}
					t.expandRow($openClose);
					return false;
				});
				//$('.tooltiptext').attr('title',ccp.globalVar.tootipText);
				$('.tooltip').attr('title',ccp.globalVar.tootipText);
				myvmware.hoverContent.bindEvents($('.tooltiptext'), 'funcleft'); 
			},
			"bPaginate": false,
			"sPaginationType": "full_numbers"
		});
		$('ul.tabs li a.tab').click(function(){
			var $this = $(this);
			$('ul.tabs li a.active').removeClass('active');
			$this.addClass('active');
			$this.parents('.tabbed_area').find(".tabContent").hide();  // slide all elements with the class 'content' up   
			var $curTabNum = $this.attr('id').substring(4); // Now figure out what the 'title' attribute value is and find the element with that id.  
			var $curContent = $("#content_"+$curTabNum);
			$curContent.show();
			if($curTabNum == 2){
				if(!$tbl2Loaded){
					t.buildExpBaseTable();
					$tbl2Loaded = true;
				}
			}
			return false;
		})
		$("#expandall").click(function(){
			t.expandall();
			$(this).addClass('disabled');
			$("#collapseall").removeClass('disabled');
			return false;
		});
		$("#collapseall").click(function(){
			t.collapseall();
			$(this).addClass('disabled');
			$("#expandall").removeClass('disabled');
			return false;
		});
		$("#expandall.disabled").click(function(e){
			e.preventDefault();
			return false;
		})
		$("#collapseall.disabled").click(function(e){
			e.preventDefault();
			return false;
		})
	},//end of init
	buildExpBaseTable :function(){
		vmf.datatable.build($('#tbl_ccpExpFunds'),{
			"aoColumns": [
				{"sTitle": "<span class='descending'>" + ccp.globalVar.fundName + "</span>","sWidth":"350px"},
				{"sTitle": "", "bVisible":false},
				{"sTitle": "", "bVisible":false},
				{"sTitle": "<span class='descending'>" + ccp.globalVar.expDate + "</span>","sWidth":"100px"},
				{"sTitle": "<span class='descending'>" + ccp.globalVar.reports + "</span>"}
			],
			"oLanguage": {
				"sEmptyTable":ccp.globalVar.noExpiredFunds
			},
			"sAjaxSource": ccp.globalVar.expFundsUrl,
			"bInfo":false,
			"bServerSide": false, 
			"bAutoWidth" : false,
        	"sDom": 'zrtSpi',  
			"bFilter":false,
			"fnRowCallback": function(nRow,aData,iDisplayIndex){ 
				var $nRow=$(nRow);
				$nRow.find("td:eq(0)").html(aData[0]+"<div class=\"eaTitle\">"+aData[1]+" - "+aData[2]+"</div>"); 
				$nRow.find("td:eq(1)").html(aData[3]);
				
				$nRow.find("td:eq(2)").html("<span class=\"userRep\"><a href="+ccp.globalVar.downloadActivitiesReportURL+"&_VM_FundID=" + encodeURIComponent(aData[5])+">" 
				+ ccp.globalVar.fundActivityReport + "</a></span>&nbsp;&nbsp;"
				+ "<span class=\"userRedeme\"><a href="+ccp.globalVar.downloadRedemptionsReportURL+"&_VM_FundID=" + encodeURIComponent(aData[5])+">" 
				+ ccp.globalVar.redemptionReport + "</a></span>");
				
				$nRow[0].idx = iDisplayIndex;
				return nRow;
			},
			"aaSorting": [],
			"fnInitComplete": function (){
				$('.dataTables_wrapper').find('.loadWraper').hide();
				$('#tbl_ccpExpFunds').show();
			},
			"bPaginate": false,
			"sPaginationType": "full_numbers"
		});
	},
	expandRow :function(o){
		t.nTr = o[0].parentNode.parentNode;
		if (o.hasClass('minus')){
			o.removeClass('minus');
			$(t.nTr).removeClass("expanded").find('a.viewTokens').removeClass('open').end().next("tr").hide();
		}else{
			o.addClass('minus');
			$(t.nTr).addClass("expanded").find('a.viewTokens').addClass('open');
			if(!t.nTr.haveData){
				t.dt.fnOpen(t.nTr,t.showloading(),'');
				t.getCdata($(t.nTr),t.nTr.idx);
				t.nTr.haveData = true;
				$(t.nTr).next("tr").addClass('more-detail');
			}else{
				$(t.nTr).next("tr").show();			
			}
		};
		t.checkOpenClose(o);
	},
	expandall:function(){
		$('#tbl_ccpCurFunds tbody').find('tr.expandable').each(function(i, el) {
			t.nTr = $(el)[0];
			o = $(el).find('td span.openclose');		
			if (!o.hasClass('minus')){
				o.addClass('minus');
				$(t.nTr).removeClass('active').addClass("expanded").find('a.viewTokens').addClass('open').text(ccp.globalVar.hideMyCredits);
				if(!t.nTr.haveData){
					t.dt.fnOpen(t.nTr,t.showloading(),'');
					t.getCdata($(t.nTr), t.nTr.idx);
					t.nTr.haveData = true;
					$(t.nTr).next("tr").addClass('more-detail');	
				}else
					$(t.nTr).next("tr").show();	
					
			};
		});
	},
	collapseall:function(){
		$('#tbl_ccpCurFunds tbody').find('tr.expandable').each(function(i, el) {
			t.nTr = $(el)[0];
			o = $(el).find('td span.openclose');	
			if (o.hasClass('minus')){
				o.removeClass('minus');
				$(t.nTr).removeClass('active').removeClass("expanded").find('a.viewTokens').removeClass('open').text(ccp.globalVar.viewMyCredits).end().next("tr").hide();
			};
		});
	},
	checkOpenClose :function(pObj){
		var $this = pObj.parents('table');
		var $totalRows = $this.find('td span.openclose').length;
		var $openedRows = $this.find('td span.openclose.minus').length;
		if($openedRows == ($totalRows) ){
			$('.fn_expandAll').addClass('disabled');
			$('.fn_collapseAll').removeClass('disabled');
		}else{
			($openedRows == 0) ? $('.fn_collapseAll').addClass('disabled'): $('.fn_collapseAll').removeClass('disabled');
			$('.fn_expandAll').removeClass('disabled');
		}
		return false;
	},
	showloading :function(){return sOut="<div class='loadWraper' style='text-align:center; padding-left:40%'><div class='loading_big'>Loading.....</div></div>";},
	getCdata:function(rowObj, idx){
		var sOut = [];
		sOut.push('<div class="more-details-history"><div class="history_more_content bottomarea clearfix">');
		sOut.push('<h4>'+rowObj.data("ea")+'</h4>');
		sOut.push('<table class="file_details_tbl" id="'+ ("child-table-" + idx ) + '"></table>');
		sOut.push('</div></div>');
		$(t.nTr).next("tr").addClass('more-detail').find("td").html(sOut.join(''));
	
		var $subTable = $("#child-table-" + idx);
		vmf.datatable.build($subTable,{
			"aoColumns": [
				{"sTitle": ccp.globalVar.subFundId, "sWidth":"40px","bSortable":false},
				{"sTitle": ccp.globalVar.subFundName, "sWidth":"150px","bSortable":false},
				{"sTitle": ccp.globalVar.fundUser, "sWidth":"80px","bSortable":false},
				{"sTitle": ccp.globalVar.creditsRemaining,"sClass":"right", "sWidth":"50px","bSortable":false}
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