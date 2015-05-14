
if (typeof(myvmware) == "undefined") myvmware = {};
sdp={};
myvmware.sdp = {
	init:function(){
		var dtd = null;
		var nTr = null;
		sdp = myvmware.sdp ;
		sdp.bindEvents();
		sdp.loadData(); // load data
		sdp.map = {
			"tab0" : {"url":"tab0.json","tab_cnt":"tab_container_1","hasData":0,"func":sdp.tabs.loadTab1Data,"sfunc":sdp.onSucess,"ffunc":sdp.onFailure,"nodata":sdp.emptyTab},
			"tab1" : {"url":"tab1.json","tab_cnt":"tab_container_2","hasData":0,"func":sdp.tabs.loadTab2Data,"sfunc":sdp.onSucess,"ffunc":sdp.onFailure,"nodata":sdp.emptyTab},
		};
		sdp.tabs.loadTab1Data(sdp.map['tab0']);
	},
	//Bind Events
	bindEvents:function(){
		$('#monthly_limit').click(function(){
			vmf.modal.show('DefaultMonthlyAmt',{
				checkPosition: true,
				onShow: function (dialog) {
					$('#monthlyLimitVal').val($('#monthlyLimit span:first').text());
					$('.modalContent .fn_save').click(function(){
						//sdp.saveDefaultThresholdLimit
						var _postData = new Object(); 
						_postData['thresholdLimit'] = $('input#monthlyLimitVal').val();
						_postData['thresholdType'] =  "default"		
						vmf.ajax.post(setThresholdURL,_postData,function(){$('#monthlyLimit span:first').text( _postData['thresholdLimit']);},function(){});
						var tabId = (partnerType == 'RESELLER')?'#tbl_pCustomer':'#tbl_pReseller';
						vmf.datatable.reload($(tabId),sdpSubscriptionCustomerSummaryUrl)
						vmf.modal.hide();
					});
				}
			});
		}) 
		$('ul.tabs li a').click(function(o,i){
			$('ul.tabs li a').removeClass('active');
			$(this).addClass('active');
			var idx = $(this).parent($(this)).index();
			var m = sdp.map['tab'+idx];
			$('div.tabContainers').hide()
			$('#'+m.tab_cnt).show();
			if(!m.hasData)	m.func(m);
			return false;
		});
	},
	loadData:function(m){
		vmf.datatable.build($('#tbl_services'),{
			"bAutoWidth": false,
			"bPaginate": false,
			"bFilter": false,
			"bInfo":false,
			"aoColumns": [
				{"sTitle": "<span class='descending'>"+rs.si+"</span>", "sWidth":"90"},
				{"sTitle": "<span class='descending'>"+rs.serv_type+"</span>", "sWidth":"120px"},
				{"sTitle": "<span class='descending'>"+rs.status+"</span>", "sWidth":"60px"},
				{"sTitle": "<span class='descending'>"+rs.init_term+"</span>","sWidth":"80px"},
				{"sTitle": "<span class='descending'>"+rs.remaining+"</span>","sWidth":"80px"},
				{"sTitle": "<span class='descending'>"+rs.sub_renew+"</span>","sWidth":"120px"},
				{"sTitle": "<span class='descending'>"+rs.cost_monthly+"</span>","sWidth":"70px"}
			],
			"sAjaxSource": serviecInstanceDetailsURL,
			"bServerSide": false,
			"bProcessing":true,
			"errMsg":rs.Unable_to_process_your_request,
			"oLanguage": {
				"sProcessing" : rs.Loading,
				"sLoadingRecords":"",
				"sInfo": rs.recordsInfo,
				"sInfoEmpty": "",
				"sLengthMenu": "<label>" + rs.itemsPerPage + "</label> _MENU_",
				"sInfoFiltered": rs.recordsFiltered,
				"oPaginate": {
					"sPrevious": rs.DtablesPrevious,
					"sNext": rs.DtablesNext, 
					"sLast": rs.DtablesLast, 
					"sFirst": rs.DtablesFirst
	      		} 
			},
			"fnInitComplete": function(){
				dtd = this;
				$(dtd).append('<tfoot><tr><td class="bottomarea" colspan="7"></td></tr></tfoot>');
				settings= this.fnSettings();
			}
		})
	}, // End of components datatable config
	tabs:{
		loadTab1Data:function(m){
			var d = {"aaData":[["","3421","1004253","Amy John","3","12/23/2012","$ 340","10 mon"],["","3443","10031233","John Smith","6","12/24/2012","$ 450","10 mon"],["","3421","10031333","Scott Richard","8","12/28/2012","$ 450","12 mon"]],"status":null}
			vmf.datatable.build($('#tbl_pending'),{
				"bAutoWidth": false,
				"bFilter": false,
				"bPaginate": false,
				"bInfo":false,
				"aoColumns": [
					{"sTitle": "<input type='checkbox'>","sWidth":"30px","bSortable":false},
					{"sTitle": "<span class='descending'>"+rs.req_id+"</span>", "sWidth":"100px"},
					{"sTitle": "<span class='descending'>"+rs.sid+"</span>", "sWidth":"40px"},
					{"sTitle": "<span class='descending'>"+rs.requestor+"</span>", "sWidth":"80px"},
					{"sTitle": "<span class='descending'>"+rs.total_serv+"</span>", "sWidth":"80px"},
					{"sTitle": "<span class='descending'>"+rs.recieved_date+"</span>", "sWidth":"100px"},
					{"sTitle": "<span class='descending'>"+rs.pr_cost_monthly+"</span>", "sWidth":"60px"},
					{"sTitle": "<span class='descending'>"+rs.pr_remaining+"</span>", "sWidth":"50px"}
				],
				//sAjaxSource": pendingRequestDetailsURL,
				"aaData":d.aaData,
				"bServerSide": false,
				"bProcessing":true,
				"errMsg":rs.Unable_to_process_your_request,
				"oLanguage": {
				"sProcessing" : rs.Loading,
				"sLoadingRecords":"",
				"sInfo": rs.recordsInfo,
				"sInfoEmpty": "",
				"sLengthMenu": "<label>" + rs.itemsPerPage + "</label> _MENU_",
				"sInfoFiltered": rs.recordsFiltered,
				"oPaginate": {
					"sPrevious": rs.DtablesPrevious,
					"sNext": rs.DtablesNext, 
					"sLast": rs.DtablesLast, 
					"sFirst": rs.DtablesFirst
	      			} 
				},
				"fnRowCallback": function(nRow,aData,iDisplayIndex){ 
					$(nRow).find("td:eq(0)").html("<input type='checkbox' style='margin-right:5px'><span class=\"openclose\"></span>");
					$(nRow)[0].idx = iDisplayIndex;
					return nRow;
				},
				"fnInitComplete": function(){
					var dtd = this;
					$(dtd).append('<tfoot><tr><td class="bottomarea" colspan="8"></td></tr></tfoot>');
					settings= this.fnSettings();
					$('#tbl_pending').find('span.openclose').live("click",function (){
						sdp.tabs.expandRow1($(this),dtd);
					}); 
				}
			}); // End of addons
			m.hasData=1;
		},
		loadTab2Data:function(m){
			var d= {"aaData":[["","3445","1004253","Add On","Complete","Bobby Lee","vCloud Infrastucture Service","11/23/2012","$ 340","4 mon"],["","3447","10031233","Add On","Complete","Scott Richard","vCloud Infrastucture Service","11/23/2012","$ 340","4 mon"],["","3445","1004253","Add On","Complete","Amy John","vCloud Infrastucture Service","12/23/2012","$ 340","6 mon"]],"status":null}
			vmf.datatable.build($('#tbl_processed'),{
				"bAutoWidth": false,
				"bFilter": false,
				//"sScrollY": "300px",
				"bPaginate": false,
				"bInfo":false,
				"aoColumns": [
					{"sTitle": "<input type='checkbox'>","sWidth":"50px","bSortable":false},
					{"sTitle": "<span class='descending'>"+rs.order_id+"</span>", "sWidth":"50"},
					{"sTitle": "<span class='descending'>"+rs.processed_sid+"</span>", "sWidth":"50"},
					{"sTitle": "<span class='descending'>"+rs.order_type+"</span>","sWidth":"80"},
					{"sTitle": "<span class='descending'>"+rs.processed_status+"</span>","sWidth":"60"},
					{"sTitle": "<span class='descending'>"+rs.processed_requestor+"</span>", "sWidth":"90"},
					{"sTitle": "<span class='descending'>"+rs.services+"</span>", "sWidth":"100"},
					{"sTitle": "<span class='descending'>"+rs.prov_date+"</span>", "sWidth":"80"},
					{"sTitle": "<span class='descending'>"+rs.processed_cost_monthly+"</span>", "sWidth":"80"},
					{"sTitle": "<span class='descending'>"+rs.time_remaining+"</span>", "sWidth":"70"}
				],
				//"sAjaxSource": processedOrderedDetailsURL,
				"aaData":d.aaData,
				"bServerSide": false,
				"bProcessing":true,
				"errMsg":rs.Unable_to_process_your_request,
				"oLanguage": {
				"sProcessing" : rs.Loading,
				"sLoadingRecords":"",
				"sInfo": rs.recordsInfo,
				"sInfoEmpty": "",
				"sLengthMenu": "<label>" + rs.itemsPerPage + "</label> _MENU_",
				"sInfoFiltered": rs.recordsFiltered,
				"oPaginate": {
					"sPrevious": rs.DtablesPrevious,
					"sNext": rs.DtablesNext, 
					"sLast": rs.DtablesLast, 
					"sFirst": rs.DtablesFirst
	      			} 
				},
			"fnRowCallback": function(nRow,aData,iDisplayIndex){ 
					$(nRow).find("td:eq(0)").html("<input type='checkbox' style='margin-right:5px'><span class=\"openclose\"></span>");
					$(nRow)[0].idx = iDisplayIndex;
					return nRow;
				},
				"fnInitComplete": function(){
					var dtd = this;
					$(dtd).append('<tfoot><tr><td class="bottomarea" colspan="10"></td></tr></tfoot>');
					settings= this.fnSettings();
					$('#tbl_processed').find('span.openclose').live("click",function (){
						sdp.tabs.expandRow2($(this),dtd);
					}); 	
				}
			}); // End of related services table
			m.hasData=1;
		},
		expandRow1 :function(o,t){
			 nTr1 = o[0].parentNode.parentNode;
			if (o.hasClass('minus')){
				o.removeClass('minus');
				$(nTr1).removeClass("expanded").find('a.viewTokens').removeClass('open').end().next("tr").hide();
			}else{
				o.addClass('minus');
				$(nTr1).addClass("expanded").find('a.viewTokens').addClass('open');
				if(!nTr1.haveData){
					t.fnOpen(nTr1,sdp.tabs.showloading(),'');
					sdp.tabs.getCdata1($(nTr1), nTr1.idx);
					nTr1.haveData = true;
					$(nTr1).next("tr").addClass('more-detail');
				}else
					$(nTr1).next("tr").show();			
			}	
		},
		expandRow2 :function(o,t){
			nTr2 = o[0].parentNode.parentNode;
			if (o.hasClass('minus')){
				o.removeClass('minus');
				$(nTr2).removeClass("expanded").find('a.viewTokens').removeClass('open').end().next("tr").hide();
			}else{
				o.addClass('minus');
				$(nTr2).addClass("expanded").find('a.viewTokens').addClass('open');
				if(!nTr2.haveData){
					t.fnOpen(nTr2,sdp.tabs.showloading(),'');
					sdp.tabs.getCdata2($(nTr2), nTr2.idx);
					nTr2.haveData = true;
					$(nTr2).next("tr").addClass('more-detail');
				}else
					$(nTr2).next("tr").show();			
			}	
		},
		showloading :function(){return sOut="<div class='loadWraper' style='text-align:center; padding-left:40%'><div class='loading_big'>Loading.....</div></div>";},
		getCdata1:function(rowObj, idx){
			var sOut = [];
			sOut.push('<table class="file_details_tbl" id="'+ ("child-table1-" + idx ) + '"></table>');
			$(nTr1).next("tr").addClass('more-detail').find("td").html(sOut.join(''));
			
			var $subTable = $("#child-table1-" + idx);
			var cdata = {"aaData":[
					["532034","Compute 2.8 GHZ","4","$60/Mon","5 mon"],
					["532034","Compute 2.8 GHZ","4","$60/Mon","5 mon"],
					["532034","Compute 2.8 GHZ","4","$60/Mon","5 mon"]]
				};
			vmf.datatable.build($subTable,{
				"aoColumns": [
					{"sTitle": "<span>SKU</span>","sWidth":"195px","bSortable":false},
					{"sTitle": "<span>Add on</span>","sWidth":"205px","bSortable":false},
					{"sTitle": "<span>Quarterly</span>","sWidth":"195px","bSortable":false},
					{"sTitle": "<span>Montyly Price</span>","sWidth":"195px","bSortable":false},
					{"sTitle": "<span>Monthly Remaining</span>","sWidth":"195px","bSortable":false}
				],
				"aaData":cdata.aaData,
				"bInfo":false,
				"bServerSide": false,   
				"bFilter":false,
				"bPaginate": false,
				"sPaginationType": "full_numbers"
			})
		},
		getCdata2:function(rowObj, idx){
			var sOut = [];
			sOut.push('<table class="file_details_tbl" id="'+ ("child-table2-" + idx ) + '"></table>');
			$(nTr2).next("tr").addClass('more-detail').find("td").html(sOut.join(''));
			
			var $subTable = $("#child-table2-" + idx);
			var cdata = {"aaData":[
					["532034","Compute 2.8 GHZ","4","$60/Mon","5 mon"],
					["532034","Compute 2.8 GHZ","4","$60/Mon","5 mon"],
					["532034","Compute 2.8 GHZ","4","$60/Mon","5 mon"]]
				};
			vmf.datatable.build($subTable,{
				"aoColumns": [
					{"sTitle": "<span>SKU</span>","sWidth":"195px","bSortable":false},
					{"sTitle": "<span>Add on</span>","sWidth":"205px","bSortable":false},
					{"sTitle": "<span>Quarterly</span>","bSortable":false},
					{"sTitle": "<span>Montyly Price</span>","bSortable":false},
					{"sTitle": "<span>Monthly Remaining</span>","bSortable":false}
				],
				"aaData":cdata.aaData,
				"bInfo":false,
				"bServerSide": false,   
				"bFilter":false,
				"bPaginate": false,
				"sPaginationType": "full_numbers"
			})
		}
	}//end of tabs object
};//end of main
