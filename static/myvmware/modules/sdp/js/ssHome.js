if (typeof(ssh) == "undefined")
	ssh = {};
	h = {};
	ssh.ssHome =  {  
		init: function () {
			h = ssh.ssHome;
			vmf.datatable.build($('#tbl_ssHome'),{
				"aoColumns": [
					{"sTitle": "<span class='descending'>"+rs.serviceID+"</span>", "sWidth":"100px"},
					{"sTitle": "<span class='descending'>"+rs.serviceStatus+"</span>","sWidth":"100px"},
					{"sTitle": "<span class='descending'>"+rs.sName+"</span>", "sWidth":"100px"},
					{"sTitle": "<span class='descending'>"+rs.sType+"</span>", "sWidth":"120px"},
					{"sTitle": "","bVisible":false},
					{"sTitle": "<span class='descending'>"+rs.remainingTerm+"</span>", "sWidth":"130px"},
					{"sTitle": "","bVisible":false},
					{"sTitle": "","bVisible":false},
					{"sTitle": "","bVisible":false},
					{"sTitle": "<span class='descending'>"+rs.provider+"</span>", "sWidth":"140px"},
					{"sTitle": "","bVisible":false},
					{"sTitle": "","bVisible":false},
					{"sTitle": "","bVisible":false},
					{"sTitle": "","bVisible":false}
				],				
				"sAjaxSource": rs.homeSSURL,
				"bInfo":false,
				"bServerSide": false,
				"bAutoWidth": false,
				"bSort" : false,				
				"sDom": 'zrtSpi',
				"bFilter":false,
				"bProcessing": true,
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
					if(!$(dtd).find('tfoot').length)
					$(dtd).append('<tfoot><tr><td class="bottomarea" colspan="6"></td></tr></tfoot>');
					$("#tbl_subscriptions").next(".bottom").show();
					
					var settings= this.fnSettings();
				    if(settings.jqXHR && settings.jqXHR.responseText!==null && settings.jqXHR.responseText.length && typeof settings.jqXHR.responseText =="string"){
					    var jsonResp = vmf.json.txtToObj(settings.jqXHR.responseText);
						var fundInfo=jsonResp.sdpFundInfo;
						if(fundInfo=="1"){
							$("#ssHome .ssFund").show();
							/*$('#totalFunds').html(fundInfo.totalFunds);
							//$('#fundBalance').html(fundInfo.balance);
							if(fundInfo.expiring=="" || fundInfo.expiring=="0")
								$('#ssHome .ssFund .partc').find("span").hide().end().append("<span class='activeFunds'>"+rs.allActiveFundsMsg+"</span>")
							else 
								$('#expiringFunds').html(fundInfo.expiring);
							$("#ssHome .ssFund").show();*/
						}
					}
				},
				"fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
					var $nRow=$(nRow),
					className = 'alertColor'+aData[13], icon = 'alertIcon'+aData[13],
					titleText = (eval("rs.alert_"+aData[13]) == undefined) ? '' : eval("rs.alert_"+aData[13]);
					$nRow.find("td:eq(1)").html("<span class='"+icon+" alertTxtSpace' title='"+titleText+"' style='float:left'></span><label class='alertStatusTxt'>"+aData[1]+"</label>").end().data("flag", aData[15]).data("id", aData[10]).data("date", aData[16]).data("name", aData[11]).data("type", aData[3]);
					var serviceStatus = aData[1];
					if(serviceStatus.toUpperCase() == rs.cancelledText.toUpperCase() || serviceStatus.toUpperCase() == rs.suspendText.toUpperCase() || serviceStatus.toUpperCase() == rs.terminatedText.toUpperCase()){
						$nRow.css('color','#CCC');
					}else{
						$nRow.find('td:eq(1),td:eq(4)').addClass(className);					
						//$nRow.find('td:eq(5)').addClass(className);
					}

					if(serviceStatus.toUpperCase() == rs.activeText.toUpperCase()) {
						var detailsUrl = '<a href="'+viewDetailsUrl+'&_VM_serviceInstanceId='+encodeURIComponent(aData[10])+'&_VM_serviceInstanceName='+encodeURIComponent(aData[11])+'&_VM_subscriptionType='+aData[3]+'&_VM_instanceModel='+encodeURIComponent(aData[14])+'">'+aData[2]+'</a>';
						$nRow.find("td:eq(2)").html(detailsUrl).end();
					}
				
					if(aData[13].toUpperCase() == ''){
						$nRow.find('td:eq(1), td:eq(5)').addClass('noStatus');
						//$nRow.find('td:eq(5)').addClass('noStatus');
					}
					if(aData[12].toUpperCase() == 'Y'){
						$nRow.find('td:eq(0)').html(aData[0] + '<span class="badge ela" title="Not for Resale">NFR</span>');
					}
					return nRow;
				}
		}); // End of datatable config
		}
};
