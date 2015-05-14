vmf.ns.use("ice");
ice.contractdetails = {
	getContractDetailsDataUrl:null,
	products:null,
	supportLevel:null,
	licenses:null,
	startdate:null,
	enddate:null,
	contractDetailsDatas:null,
	loadingErrorText:null,
	creditInfoMessage1:null,
	creditInfoMessage2:null,
	creditInfoMessage3:null,
	nonRenewalMessage:null,
	init: function (viewQuoteRequestSummuryUrl,portletUrl,getContDetDataUrl,prod,sLevel,lic,sDate,eDate,creditInfMsg1,creditInfMsg2,creditInfMsg3,noRenewalMsg,loadingError){
		vmf.scEvent = true;
		callBack.addsc({'f':'riaLinkmy','args':['support-contract-history : details']});
		getContractDetailsDataUrl = getContDetDataUrl;
		products = prod;
		supportLevel = sLevel;
		loadingErrorText = loadingError;
		licenses = lic;
		startdate = sDate;
		enddate = eDate;
		creditInfoMessage1 = creditInfMsg1;
		creditInfoMessage2 = creditInfMsg2;
		creditInfoMessage3 = creditInfMsg3;
		nonRenewalMessage = noRenewalMsg;
		ice.contractdetails.contractDetailsDatas=[];
		ice.contractdetails.contractDetailsData();
		vmf.datatable.reload($('#dataTableWrapper'),getContractDetailsDataUrl,'');
		$('#quoterequest').click(function () {
			$("#contractDetailsForm").attr("action", viewQuoteRequestSummuryUrl);
			$("#contractDetailsForm").submit();
			$('#quoterequest').html(contractdetails.globalVars.loadingMsg);
			$('#quoterequest').attr("disabled", "disabled");
		});
		$('#export').click(function () {window.location = portletUrl;});
	},// End of Init
	contractDetailsData: function () {
		vmf.datatable.build($('#dataTableWrapper'), {
			"aoColumns": [
				{"sTitle": '<span class="descending">'+products+'</span>',"sWidth":"391px"},
				{"sTitle": '<span class="descending">'+supportLevel+'</span>',"sWidth":"166px"}, 
				{"sTitle": '<span class="descending">'+licenses+'</span>', "sWidth" : "60px"}, 
				{"sTitle": '<span class="descending">'+startdate+'</span>', "sWidth" : "70px"}, 
				{"sTitle": '<span class="descending">'+enddate+'</span>', "sWidth" : "70px"}, 
				{"sTitle": ""}, 
				{"sTitle": ""}
			],
			"bServerSide":false,"aaData": ice.contractdetails.contractDetailsDatas,"bProcessing": true,"bAutoWidth": false,"bFilter": false,"bPaginate": false,
			//"sScrollY": 250,"sPaginationType": "full_numbers", "aLengthMenu": [[10, 20, 30, -1], [10, 20, 30, "All"]],//"iDisplayLength": 10,
			"oLanguage": {
				"sProcessing" : contractdetails.globalVars.loadingMsg,
				"sLoadingRecords":"",
				//"sLengthMenu": "<label>Items per page</label> _MENU_",
				"sInfo": contractdetails.globalVars.recordsInfo,
				"sInfoEmpty": contractdetails.globalVars.recordsEmpty,
				//"sInfoFiltered": "(filtered from _MAX_ total records)",
				"sEmptyTable":loadingErrorText
			},
			"sDom": 'rt<"clear">>',
			"fnRowCallback":function(nRow,aData,iDisplayIndex){
				/*settings= this.fnSettings();
				if(settings.jqXHR && settings.jqXHR.responseText!==null && settings.jqXHR.responseText.length && typeof settings.jqXHR.responseText =="string"){
					jsonRes = vmf.json.txtToObj(settings.jqXHR.responseText);
					ice.contractdetails.contractDetailsDatas=jsonRes.aaData;
				} */
				$(nRow).data("snsCreditFlag", aData[5]).data("snsDuration",aData[6]);
				return nRow;
			},
			"fnDrawCallback":function(){
				this.fnSetColumnVis(5,false);
				this.fnSetColumnVis(6,false);
			},
			"fnInitComplete": function () {
				$('#dataTableWrapper tbody tr').each(function (index) {
					var _snsCreditFlag = $(this).data('snsCreditFlag');
					var _snsDuration = $(this).data('snsDuration')+' '+contractdetails.globalVars.daysSupportMsg;
					if (_snsCreditFlag == 'Y') {
						$(this).find('td:nth-child(1)').append('<a href="#" class="dumyLock tooltip" data-tooltip-position="bottom" title="'+_snsDuration+'"></a>');
					}
				});
				myvmware.hoverContent.bindEvents($('a.tooltip'), 'defaultfunc');
			}
		});
		var _renewFlag = $('#renewEligible').val();
		if (_renewFlag == 'N') {
		$('#quoterequest').attr("disabled", "disabled");
		//Add css class tooltip and message
		}
	}
};