vmf.ns.use("ice");
vmf.scEvent=true;
ice.quotereqsummary = {
	getQuoteRequestSummaryDataUrl:null,selectedContractIdUrl:null,loadContractHistoryUrlLine:null,products:null,supportLevel:null,licenses:null,startDate:null,endDate:null,
	init: function (getQutReqSummDataUrl,selContIdUrl,loadContractHistoryUrl,prod,sLevel,lic,sDate,eDate) {
		getQuoteRequestSummaryDataUrl = getQutReqSummDataUrl;
		selectedContractIdUrl = selContIdUrl;
		loadContractHistoryUrlLine=loadContractHistoryUrl;
		products = prod;
		supportLevel = sLevel;
		licenses = lic;
		startDate = sDate;
		endDate = eDate; 
        ice.quotereqsummary.LoadProductDetails();
       	$('#continue').click(function () {
            $("#quoteSummaryForm").submit();
            $('#continue').html(loadingTxt);
            $('#continue').attr("disabled", "disabled");
        });
		$('#summaryBackBtn').click(function () {		    
		window.location = loadContractHistoryUrlLine;
		});
		callBack.addsc({'f':'riaLinkmy','args':['support-contract-history : request-quote-step-1']});
		//Form URL change from /ja/ to /jp/, /ko/ to /kr/ and /zh/ to /cn/ BUG-00065693
		var locOmntVar=$("#quoteSummaryForm").attr("action");
        if (locOmntVar.match('.vmware.com/ja') != null){locOmntVar = locOmntVar.replace('.vmware.com/ja','.vmware.com/jp');}
        if (locOmntVar.match('.vmware.com/ko') != null){locOmntVar = locOmntVar.replace('.vmware.com/ko','.vmware.com/kr');}
        if (locOmntVar.match('.vmware.com/zh') != null){locOmntVar = locOmntVar.replace('.vmware.com/zh','.vmware.com/cn');}
        $("#quoteSummaryForm").attr("action",locOmntVar);
    },
    LoadProductDetails: function () {
		vmf.ajax.post(getQuoteRequestSummaryDataUrl, null, ice.quotereqsummary.onSuccessLoadProductDetails, ice.quotereqsummary.onFailLoadProductDetails);
    },
    onSuccessLoadProductDetails: function (data) {	
        var _reqSummaryResponse = vmf.json.txtToObj(data);
        var _items = _reqSummaryResponse.quoteSummaryData;
        for (var i = 0; i < _items.length; i++) {
            _dataTableRender = '', _url = '';
            _arrayValue = '';
            var _arrayValue = _items[i];
            _tableId = i + 1;
            $('#dataTableWrapper').replaceWith('<table id="dataTableWrapper' + _tableId + '"><thead></thead><tbody></tbody></table>');
            _dataTableRender = 'dataTableWrapper' + _tableId;
            $("#contractid").replaceWith('<span>' + _arrayValue[0] + '</span>');
			$("#contractStatus").replaceWith('<span>' + _arrayValue[1] + '</span>');
            $("#orders").replaceWith('<span>' + _arrayValue[2] + '</span>');
            $("#startdate").replaceWith('<span>' + _arrayValue[3] + '</span>');
            $("#enddate").replaceWith('<span>' + _arrayValue[4] + '</span>');
            var _url = selectedContractIdUrl + '&selectedContractID=' + _arrayValue[6];           						
		    ice.quotereqsummary.renderDataTab(_dataTableRender, _url);			
			vmf.datatable.reload($('#dataTableWrapper' +_tableId), _url, ice.quotereqsummary.postProcessingData);	
            var _id = "#" + _arrayValue[0];
            $(_id).hide();
        }
    },
    onFailLoadProductDetails: function (data) {/*$('#loadingerrormsg').show();*/},
	clearTable: function(tableId,errorText){ 
		table = $('#'+tableId).dataTable();
		table.fnClearTable(); 
		table.find('tbody tr').css("height","50px").addClass('noborder default')
		     .find('td.dataTables_empty').html('<div id="loadingerrormsg" class="message">'+errorText+'</div>');
	},
	 postProcessingData: function(table, settings, _json){ 
		var _errorText;								
		if (_json == null || _json == '{}' || _json=='undefined' || _json.error) {		            				                				
			_errorText=loadingError; // loadingError= 'Error in loading'
			ice.quotereqsummary.clearTable(table.attr('id'),_errorText);			
		}else if(settings.fnRecordsTotal() == 0){ 
				_errorText= quotereqsummary.globalVars.noDataMsg;
				ice.quotereqsummary.clearTable(table.attr('id'),_errorText);			
		}			
	},
    renderDataTab: function (_dataTableRender, _url) {
	var _contractTypes = $('input[name=contractType]');	
	for(var i=0;i<_contractTypes.length;i++) {		
		if(_contractTypes[i].value == "MCS" || _contractTypes[i].value == "BCS"){$('#warning-message').show();}
	}
	vmf.datatable.build('#' + _dataTableRender, {
		"aoColumns": [{"sTitle": '<span class="descending">'+products+'</span>', "sWidth" : "auto"}, 
		{"sTitle": '<span class="descending">'+supportLevel+'</span>', "sWidth" : "190px"}, 
		{"sTitle": '<span class="descending">'+licenses+'</span>', "sWidth" : "75px"}, 
		{"sTitle": '<span class="descending">'+startDate+'</span>', "sWidth" : "85px"}, 
		{"sTitle": '<span class="descending">'+endDate+'</span>', "sWidth" : "85px"}],
		"bInfo": false,"sDom": 'T<"clear">lfrtip',"bServerSide": false,"aaData": [],"sScrollY": 150,"bFilter": false,"bAutoWidth": false,"bProcessing":true,
		"oLanguage": {"sProcessing" : loadingTxt,"sLoadingRecords":"","sEmptyTable":''},	
		"fnInitComplete": function () {
			var dt=this;
			dt.closest('div.dataTables_wrapper').addClass('bottomarea').css('min-height','60px').find('.dataTables_processing').css('top','37%');
			dt.closest('.dataTables_scrollBody').css('height',(dt.fnSettings().fnRecordsDisplay() > 3)?'150px':'auto');
		},
		"bPaginate": false,"sPaginationType": "full_numbers"
	});
    }
}