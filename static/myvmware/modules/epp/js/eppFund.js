if (typeof(epp) == "undefined") epp = {};
t = {};
epp.fund =  {
	remain_large:new Array(), //need to implement
	remain_small:new Array(),
	curFundJson:null,
	init: function() {
		t = epp.fund; //alias for epp.fund object
		var $activeTab = $('ul.tabs li a.active'), $tabNum = $activeTab.attr('id').substring(4), $tabId = $('#content_'+$tabNum), $tbl2Loaded = false;;
		$('.tabContent').hide();
		$('#content_'+$tabNum).show();
		vmf.datatable.build($('#tbl_eppCurFunds'),{
			"aoColumns": [
				{"sTitle": "","sClass":"tdOpenCloseButton","sWidth":"5px","bSortable":false},
				{"sTitle": "<span class='descending'>" + epp.globalVar.currentFundTh1 + "</span>","sWidth":"310px"},
				{"sTitle": "<span class='descending'>" + epp.globalVar.currentFundTh2 + "</span>","sWidth":"160px"},
				{"sTitle": "<span class='descending'>" + epp.globalVar.currentFundTh3 + "</span>","sWidth":"105px"},
				{"sTitle": "<span class='descending'>" + epp.globalVar.currentFundTh4 + "</span>","sWidth":"120px"},
				{"sTitle": epp.globalVar.graphicImageTitle,"sClass":"tdTokenVals","bSortable":false,"sWidth":"75px"}, 
				{"sTitle": "", "bVisible":false},
				{"sTitle": "", "bVisible":false},
				{"sTitle": "", "bVisible":false}
			],
			"oLanguage": {
				"sEmptyTable":epp.globalVar.msgNoFund,
				"sProcessing": 'Loading...',
				"sLoadingRecords": ""
			},
			"sAjaxSource": epp.globalVar.currentFundSummaryUrl,
			"bInfo":false,
			"bProcessing": true,
			"bServerSide": false,
			"bAutoWidth":false,
			"bFilter":false,
			"sDom": 'zrtSpi',
			"fnRowCallback": function(nRow,aData,iDisplayIndex){ 
				var vals = aData[5].split(","), $nRow=$(nRow);
				$nRow.find("td:eq(0)").html("<span class=\"openclose\"></span>");
				$nRow.find("td:eq(1)").html("<a href=\"" + epp.globalVar.fundDetailsRenderUrl 
					+ "&fundID=" + encodeURIComponent(aData[7]) + "\" id="+aData[7]+">"+aData[1]+"</a>"); 
				if (aData[6]=="1"){
					$nRow.find("td:eq(3)").html("<span class=\"textRed\" title=\""+epp.globalVar.expiryTimeMsg+"\">"+aData[3]+"</span>");
				}
				if ($.trim(aData[4]).length && isNaN(parseInt(aData[4],10))){
					$nRow.find("td:eq(4)").html("<span class=\"tooltiptext\" title=\""+epp.globalVar.vmtMsg+"\"><a class=\"viewTokens\" href=\"#\">"+epp.globalVar.viewMytokensMsg+"</a></span>");
				}
				$nRow.find("td:eq(5)").html("<div class='oVal'><div class='iVal' title='"+epp.globalVar.msgTimeImage+"'></div></div>");
                epp.common.bChart($nRow.find('td:eq(5) .oVal'), $nRow.find('td:eq(5) .iVal'),vals[1],vals[0],'small');
				$nRow[0].idx = iDisplayIndex;
				$nRow.data("fId",aData[7]).data("ea",aData[8]);
				if ($.trim(aData[9]).length && $.trim(aData[9])=="True-Up"){
					$nRow.find("td:eq(1)").append("<span class=\"badge true tooltip\">TRUE-UP</span>");
				}
				if ($.trim(aData[4]).length && $.trim(aData[4])<=0 && $.trim(aData[9]).length && $.trim(aData[9])=="True-Up" && $.trim(aData[12])=="FO"){
					$nRow.find("td:eq(4)").html(aData[11])
					$nRow.addClass('trueUpMode');
				}
				return nRow;
			},
			"fnDrawCallback": function(){ 				
				$(this.fnGetNodes()).addClass("expandable");
				var settings= this.fnSettings(), $next;
				$(this).find('tbody tr').each(function(){
					$next=$(this).next("tr");
					if ($next.hasClass('more-detail') && $next.is(":visible"))
						$(this).find('.tdOpenCloseButton .openclose').addClass('minus');
            	});
				if(settings.jqXHR && settings.jqXHR.responseText!==null && settings.jqXHR.responseText.length && typeof settings.jqXHR.responseText =="string"){
					epp.fund.curFundJson = vmf.getObjByIdx(vmf.json.txtToObj(settings.jqXHR.responseText),0);
				}
			},
			"fnInitComplete": function (){
				t.dt = this;
				this.parents('.column-wrapper').find("#expandall").removeClass('disabled');
				$('#tbl_eppCurFunds').find('span.openclose').live("click",function (){
					t.expandRow($(this));
				});
				$("a.viewTokens").live("click",function (){
					var $openClose = $(this).closest('tr').find('span.openclose');
					if(!$(this).hasClass('open')){
						$(this).addClass('open').text(epp.globalVar.hideMytokensMsg);
						t.expandRow($openClose);
					} else {
						$(this).addClass('close').removeClass('open').text(epp.globalVar.viewMytokensMsg);
						$(this).closest('tr').removeClass("expanded").find('span.openclose').removeClass('minus').end().next('tr.more-detail').hide();
					}
					return false;
				});
				$('.tooltiptext').attr('title',epp.globalVar.tootipText);
				$('.tooltip').attr('title',epp.globalVar.trueupbadge);
				myvmware.hoverContent.bindEvents($('.tooltiptext'), 'funcleft'); 
				myvmware.hoverContent.bindEvents($('.tooltip'), 'defaultfunc'); 
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
		});
		$("#expSwitch").die('click').live('click',function(e){$("#tab_2").trigger('click');e.preventDefault()})
		if (typeof riaLinkmy!="undefined") riaLinkmy(epp.globalVar.pageName);
	},//end of init
	buildExpBaseTable :function(){
		vmf.datatable.build($('#tbl_eppExpFunds'),{
			"aoColumns": [
				{"sTitle": "<span class='descending'>" + epp.globalVar.expiredFundTh1 + "</span>","sWidth":"230px"},
				{"sTitle": "", "bVisible":false},
				{"sTitle": "", "bVisible":false},
				{"sTitle": "<span class='descending'>" + epp.globalVar.expiredFundTh2 + "</span>","sWidth":"70px"},
				{"sTitle": "<span class='descending'>" + epp.globalVar.expiredFundTh3 + "</span>","sWidth":"225px"}
			],
			"oLanguage": {
				"sEmptyTable":epp.globalVar.msgNoExpiredFund,
				"sProcessing": 'Loading...',
				"sLoadingRecords": ""
			},
			"sAjaxSource": epp.globalVar.expiredFundSummaryUrl,
			"bInfo":false,
			"bProcessing": true,
			"bServerSide": false,
			"bAutoWidth":false,
			"bFilter":false,
			"fnRowCallback": function(nRow,aData,iDisplayIndex){ 
				var $nRow=$(nRow);
				$nRow.find("td:eq(0)").html(aData[0]+"<div class=\"eaTitle\">"+aData[1]+" - "+aData[2]+"</div>"); 
				$nRow.find("td:eq(1)").html(aData[3]);
					if (aData[4]=="1"){
					$nRow.find("td:eq(2)").html("<span class=\"userRep\"><a href="+epp.globalVar.userReportURL+"&_VM_FundID=" + encodeURIComponent(aData[5])
                        + ">"+epp.globalVar.msgReportUserLabel+"</span><a href="+epp.globalVar.redemptionReportURL+"&_VM_FundID=" + encodeURIComponent(aData[5])
                        + ">"+epp.globalVar.msgReportRedemptionLabel+"</span>");
				}else if(aData[4]=="0"){
					$nRow.find("td:eq(2)").html(epp.globalVar.msgNoPermForReport);
				}
				$nRow[0].idx = iDisplayIndex;
				return nRow;
			},
			"bPaginate": false,
			"sPaginationType": "full_numbers"
		});
	},
	expandRow :function(o){
		t.nTr = o[0].parentNode.parentNode;
		if (o.hasClass('minus')){
			o.removeClass('minus');
			$(t.nTr).removeClass("expanded").find('a.viewTokens').removeClass('open').text(epp.globalVar.viewMytokensMsg).end().next("tr").hide();
		}
		else{
			o.addClass('minus');
			$(t.nTr).addClass("expanded").find('a.viewTokens').addClass('open').text(epp.globalVar.hideMytokensMsg);
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
		$('#tbl_eppCurFunds tbody').find('tr.expandable').each(function(i, el) {
			t.nTr = $(el)[0];
			o = $(el).find('td span.openclose');		
			if (!o.hasClass('minus')){
				o.addClass('minus');
				$(t.nTr).addClass("expanded").find('a.viewTokens').addClass('open');
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
		$('#tbl_eppCurFunds tbody').find('tr.expandable').each(function(i, el) {
			t.nTr = $(el)[0];
			o = $(el).find('td span.openclose');	
			if (o.hasClass('minus')){
				o.removeClass('minus');
				$(t.nTr).removeClass("expanded").find('a.viewTokens').removeClass('open').end().next("tr").hide();
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
			if($openedRows == 0){
				$('.fn_collapseAll').addClass('disabled');
			}else{
				$('.fn_collapseAll').removeClass('disabled');
			}
			$('.fn_expandAll').removeClass('disabled');
		}
		return false;
	},
	showloading :function(){return sOut="<div class='loadWraper' style='text-align:center; padding-left:40%'><div class='loading_big'>"+epp.globalVar.loading+"</div></div>";},
	getCdata:function(rowObj, idx){
		var sOut = [];
		sOut.push('<div class="more-details-history">');
		sOut.push('<div class="history_more_content bottomarea clearfix">');
		sOut.push('<h4>'+epp.globalVar.eaTitle+': '+rowObj.data("ea")+'</h4>');
		sOut.push('<table class="file_details_tbl" id="'+ ("child-table-" + idx ) + '">');
		sOut.push('</table>');
		sOut.push('</div>');
		sOut.push('</div>');
		
		$(t.nTr).next("tr").find("td").html(sOut.join(''));
	
		var $subTable = $("#child-table-" + idx);
		vmf.datatable.build($subTable,{
			"aoColumns": [
				{"sTitle": "<span>" + epp.globalVar.subFundTh1 + "</span>","sWidth":"250px","bSortable":false},
				{"sTitle": "<span>" + epp.globalVar.subFundTh2 + "</span>","sWidth":"273px","bSortable":false},
				{"sTitle": "<span>" + epp.globalVar.subFundTh3 + "</span>","bSortable":false}
			],
			"oLanguage": {
				"sEmptyTable":epp.globalVar.msgNoFund,
				"sProcessing":'Loading...',
				"sLoadingRecords":""
			},
			"aaData":epp.fund.curFundJson.subaaData[rowObj.data("fId")],
			"bInfo":false,
			"bServerSide": false,   
			"bFilter":false,
			"bAutoWidth": false,
			"aaSorting": [],
			"fnRowCallback":function(nRow,aData,iDisplayIndex){
				var subFundName=aData[0].replace(/\w+/g,function(str){
					return vmf.wordwrap(str,2);
				});
				$(nRow).find('td:eq(0)').html(subFundName);
				if($subTable.parents('tr').prev('tr').hasClass('trueUpMode')){
					$(nRow).find("td:eq(0)").html('<span class=\"tooltip\">'+aData[0]+'</span>');
					$(nRow).find("td:eq(1)").html('<span class=\"tooltip\">'+aData[1]+'</span>');
					$(nRow).find("td:eq(2)").html('<span class=\"tooltip\">'+aData[2]+'</span>');
					$(nRow).addClass('inactive');
				}
				if ($.trim(aData[3]).length && $.trim(aData[3])=="Y"){
					$(nRow).find("td:eq(0)").html('<span>'+aData[0]+'</span><span class=\"badge primary\">PRIMARY</span>');
					$(nRow).find("td:eq(1)").html(aData[1]);
					$(nRow).find("td:eq(2)").html(aData[2]);
					$(nRow).removeClass('inactive');
				}
				return nRow;
			},
			"fnDrawCallback": function(){},
			"fnInitComplete": function (){
				$subTable.find('.tooltip').attr('title',epp.globalVar.trueupsubfundbadge);
				myvmware.hoverContent.bindEvents($('.tooltip'), 'defaultfunc');
			},
			"bPaginate": false,
			"sPaginationType": "full_numbers"
		})
	}
};//end of main 