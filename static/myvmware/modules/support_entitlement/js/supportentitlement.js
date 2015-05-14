vmf.ns.use("ice");

ice.supportentitlement={
	supportEntListHeader1:null,
	supportEntListHeader2:null,
	supportEntListHeader3:null,
	supEntStdDetailsHeader1:null,
	supEntStdDetailsHeader2:null,
	supEntStdDetailsHeader3:null,
	supEntStdDetailsHeader4:null,
	supEntStdDetailsHeader5:null,
	supEntIncDetailsHeader1:null,
	supEntIncDetailsHeader2:null,
	supEntIncDetailsHeader3:null,
	supEntIncDetailsHeader4:null,
	supEntIncDetailsHeader5:null,
	supEntIncDetailsHeader6:null,
	incSRDetailsHeader1:null,
	incSRDetailsHeader2:null,
	incSRDetailsHeader3:null,
	incSRDetailsHeader4:null,
	serviceSubcriptionHeader1:null,
	serviceSubcriptionHeader2:null,
	serviceSubcriptionHeader3:null,
	serviceSubcriptionHeader4:null,
	serviceSubcriptionHeader5:null,
	
	
	
	init: function(supportEntListHeader1,supportEntListHeader2,supportEntListHeader3,supEntStdDetailsHeader1, supEntStdDetailsHeader2, supEntStdDetailsHeader3, supEntStdDetailsHeader4, supEntStdDetailsHeader5, supEntIncDetailsHeader1, supEntIncDetailsHeader2, supEntIncDetailsHeader3, supEntIncDetailsHeader4, supEntIncDetailsHeader5, supEntIncDetailsHeader6, incSRDetailsHeader1, incSRDetailsHeader2, incSRDetailsHeader3, incSRDetailsHeader4,serviceSubcriptionHeader1,serviceSubcriptionHeader2,serviceSubcriptionHeader3,serviceSubcriptionHeader4,serviceSubcriptionHeader5) {
        //VMFModuleLoader.loadModule('modal');
        $._prevSelTr = null;
        $._sDjqXHR = null;
        $.selectedSupEntData = null;
        /*Ent 'STANDARD' Filter state management constants*/
        $.stateSupEntDetail = null;
        $.stateApplyF2Filter = 'APPLYF2FILTER';
        $.stateApplyGetDetails = 'STDGETDETAILS';
        $.optionAll = myvmware.globalVars.allLbl;
        
        $.valueAllLbl = 'All';
       //$.listLoadingText = 'Support Entitlements are loading..';
        $.loadingText = ice.globalVars.loadingLbl;
        //$.selectProductText = 'Please select a product to see support entitlements';
		$.selectProductText = ice.globalVars.selectProductText;  // BUG NO: 23234
        $.invalidAJAX = 'The AJAX response is invalid';
        $.noSupportStdDetails = ice.globalVars.noSupportStdDetails;
        $.detailsStandard = 'REGULAR';
        $.detailsIncident = 'INCIDENT';
		$.detailsSdpSub = 'SDPSUBSCRIPTION';
        $.supportExpired = 'EXPIRED';	
        $.moreText = ice.globalVars.more;
		
        $.contractIdMaxMsg = ice.globalVars.contractIdMaxMsg;
        $.supEntDetailsForm = 'supEntStdDetailsForm';
        $.filterFlag = 'filter';
        $.nonFilterFlag = 'nofilter';
        ice.supportentitlement.supportEntListHeader1=supportEntListHeader1
		ice.supportentitlement.supportEntListHeader2=supportEntListHeader2;
		ice.supportentitlement.supportEntListHeader3=supportEntListHeader3;
		ice.supportentitlement.supEntStdDetailsHeader1=supEntStdDetailsHeader1;
		ice.supportentitlement.supEntStdDetailsHeader2=supEntStdDetailsHeader2;
		ice.supportentitlement.supEntStdDetailsHeader3=supEntStdDetailsHeader3;
		ice.supportentitlement.supEntStdDetailsHeader4=supEntStdDetailsHeader4;
		ice.supportentitlement.supEntStdDetailsHeader5=supEntStdDetailsHeader5;
		ice.supportentitlement.supEntIncDetailsHeader1=supEntIncDetailsHeader1;
		ice.supportentitlement.supEntIncDetailsHeader2=supEntIncDetailsHeader2;
		ice.supportentitlement.supEntIncDetailsHeader3=supEntIncDetailsHeader3;
		ice.supportentitlement.supEntIncDetailsHeader4=supEntIncDetailsHeader4;
		ice.supportentitlement.supEntIncDetailsHeader5=supEntIncDetailsHeader5;
		ice.supportentitlement.supEntIncDetailsHeader6=supEntIncDetailsHeader6;
		ice.supportentitlement.incSRDetailsHeader1=incSRDetailsHeader1;
		ice.supportentitlement.incSRDetailsHeader2=incSRDetailsHeader2;
		ice.supportentitlement.incSRDetailsHeader3=incSRDetailsHeader3;
		ice.supportentitlement.incSRDetailsHeader4=incSRDetailsHeader4;
		ice.supportentitlement.serviceSubcriptionHeader1=serviceSubcriptionHeader1;
		ice.supportentitlement.serviceSubcriptionHeader2=serviceSubcriptionHeader2;
		ice.supportentitlement.serviceSubcriptionHeader3=serviceSubcriptionHeader3;
		ice.supportentitlement.serviceSubcriptionHeader4=serviceSubcriptionHeader4;
		ice.supportentitlement.serviceSubcriptionHeader5=serviceSubcriptionHeader5;
		
		
        ice.supportentitlement.config();
        ice.ui.validateSupportEntitlementFilter({ "formId" : $.supEntDetailsForm, "contractIdMaxLen" : $.contractIdMaxMsg });
        ice.supportentitlement.getSupportEntListJSON($.nonFilterFlag);
	},
    config: function() {
        //$("#f1Status").css({"width" : "auto", "min-width": "150px"});
        //$("#f1SupportLevel").css({"width" : "auto", "min-width": "150px"});
        //$("#f1Product").css({"width" : "auto", "min-width": "150px"});
        $("#f1applyfilter").click(function() {
            ice.supportentitlement.getSupportEntListJSON($.filterFlag);
            return false;
        });
        $("#f1resetfilter").click(function() {
            $("#f1Status option:first").attr('selected','selected');
            $("#f1SupportLevel option:first").attr('selected','selected');
            $("#f1Product option:first").attr('selected','selected');
            ice.supportentitlement.getSupportEntListJSON($.filterFlag);
            return false;
        });
        $("#f2applyfilter").click(function() {
            if(!($("#" + $.supEntDetailsForm).valid())) {
                //Check if the fields of the form are validated
                return false;
            }
            $.stateSupEntDetail = $.stateApplyF2Filter;
            if($.selectedSupEntData == null) {
                ice.supportentitlement.getSupportEntDetailsJSON(
                    null,null,null,null,$.filterFlag);
            }
            else {
			if ($.selectedSupEntData[4] == $.detailsSdpSub){
                ice.supportentitlement.getSupportEntDetailsJSON(
                    $.selectedSupEntData[3],$.selectedSupEntData[4],$.selectedSupEntData[0],$.selectedSupEntData[5],$.filterFlag, true);}
					else
					{
						ice.supportentitlement.getSupportEntDetailsJSON(
                    $.selectedSupEntData[3],$.selectedSupEntData[4],$.selectedSupEntData[0],$.selectedSupEntData[5],$.filterFlag, null);
					}
					
            }
            return false;
        });
        $("#f2resetfilter").click(function() {
				// Reset calendar
			var startDateID = vmf.dom.id("f2DateFrom");
			var endDateID = vmf.dom.id("f2DateTo");
			vmf.calendar.resetCalenders(startDateID);
			vmf.calendar.resetCalenders(endDateID);
			
            $("#supportEntDetail :input").not(':button, :submit, :reset').val('').removeAttr('selected');
			ice.supportentitlement.rangeMapCalendar();
            $.stateSupEntDetail = $.stateApplyF2Filter;
            if($.selectedSupEntData == null) {
                ice.supportentitlement.getSupportEntDetailsJSON(
                    null,null,null,$.nonFilterFlag,false);
            }
            else {
				if ($.selectedSupEntData[4] == $.detailsSdpSub){
					ice.supportentitlement.getSupportEntDetailsJSON(
						$.selectedSupEntData[3],$.selectedSupEntData[4],$.selectedSupEntData[0],$.selectedSupEntData[5],$.nonFilterFlag,true);
				}
				else {
					ice.supportentitlement.getSupportEntDetailsJSON(
						$.selectedSupEntData[3],$.selectedSupEntData[4],$.selectedSupEntData[0],$.selectedSupEntData[5],$.nonFilterFlag,false);
				}
            }
            return false;
        });
        ice.supportentitlement.rangeMapCalendar();
    },
    resetEntList: function(flag, filterFlag) {
        if(filterFlag != "filter") {
            if(flag) {
                //if true show
                $("#supportEntHeader").removeClass('hidden');
                $("#supportEntDetail").removeClass('hidden');
                $("#supEntLoading").addClass('hidden');
                $("#supportEntDetail .simple").addClass('hidden');
                $("#supportEntDetail .active").addClass('hidden');
                $("#supportEntDetail .loading").text($.selectProductText).removeClass('hidden');
            }
            else {
                //false = hide
                $("#supportEntHeader").addClass('hidden');
                $("#supportEntDetail").addClass('hidden');
                $("#supEntLoading").removeClass('hidden');
            }
        }
        else {
            if(flag) {
                //if true show
                $("#supportEntList tbody").empty()
            }
            else {
                //false = hide
                $("#supportEntList").find("tbody").remove();
                $("#supportEntList").append("<tbody><tr class=\"noborder\"><td colspan=\"3\"><div class=\"loading\"><span class=\"loading_big\">" + $.listLoadingText + '</span></div></td></tr></tbody>');
            }
        }
    },
    resetEntDetails: function(detailsType) {
        $("#supportEntDetail .loading").addClass('hidden');
        if(detailsType == $.detailsStandard) {
            $("#supportEntDetail .simple").removeClass('hidden');
            $("#supportEntDetail .filter-content").css('display', 'none');
            var _filterA = $("#supportEntDetail .filter a")
            _filterA.text(_filterA.text().replace('-','+')).removeClass('minus').addClass('plus');
        }
        else {
            $("#supportEntDetail .active").removeClass('hidden');
        }
        //Clear Support Entitlement 'STANDARD' Details Filter values
        $("#supportEntDetail :input").not(':button, :submit, :reset').val('').removeAttr('selected');

    },
    toggleHeaderBody: function(flag, message) {
        if(flag == "hide") {
            $("#supportEntHeader").addClass('hidden');
            $("#supportEntDetail").addClass('hidden');
            $("#warning-message").remove();
            var _msgBox = $('<div><p class=\"message-holder\">' + message + '</p></div>').
                attr('id','warning-message').css('background', '#FFF9EA');
            $("#supportEntDetail").after(_msgBox);
        }
        else {
            $("#warning-message").remove();
            $("#supportEntHeader").removeClass('hidden');
            $("#supportEntDetail").removeClass('hidden');
        }
    },
    rangeMapCalendar: function() {
        var d = new Date();
        var curr_date = d.getDate();
        var curr_month = d.getMonth();
        var curr_year = d.getFullYear();
        // Local variables to hold calendar elements
        var startDate = vmf.dom.id("f2DateFrom");
        var endDate = vmf.dom.id("f2DateTo");
        // Initialize the calendars
        vmf.calendar.build(vmf.dom.get(".txt_datepicker"), {
            dateFormat: 'yyyy/mm/dd',
            startDate: '1990/01/01',
            endDate: '2030/02/31',
            startDate_id: vmf.dom.id('f2DateFrom'),
            endDate_id: vmf.dom.id('f2DateTo')
        });
        
        // Bind event handler to the startDate calendar
        vmf.dom.addHandler(startDate, "dpClosed", function(e, selectedDate){
            var d = selectedDate[0];
            if(d){
                d = new Date(d);
                vmf.calendar.setStartDate(endDate, d.addDays(1).asString());
            }
        });

        // Bind event handler to the endDate calendar
        vmf.dom.addHandler(endDate, "dpClosed", function(e, selectedDate){
            var d = selectedDate[0];
            if(d){
                d = new Date(d);
                vmf.calendar.setEndDate(startDate, d.addDays(-1).asString());
            }
        }); 
    },
    getSupportEntListJSON: function(filterFlag) {
        //Prefiltering
        var _supEntPostData = new Object();
        if($("#f1Status").attr('value') != "") {
            _supEntPostData[$("#f1Status").attr('name')] = $("#f1Status").attr('value');
        }
        else { //For IE
            _supEntPostData[$("#f1Status").attr('name')] = $("#f1Status option:first").text();
        }
        if($("#f1SupportLevel").attr('value') != "") {
            _supEntPostData[$("#f1SupportLevel").attr('name')] = $("#f1SupportLevel").attr('value')
        }
        else {
            _supEntPostData[$("#f1SupportLevel").attr('name')] = $("#f1SupportLevel option:first").text();
        }
        if($("#f1Product").attr('value') != "") {
            _supEntPostData[$("#f1Product").attr('name')] = $("#f1Product").attr('value');
        }
        else {
            _supEntPostData[$("#f1Product").attr('name')] = $("#f1Product option:first").text();
        }
        //Persist selected values
        /*$("#f1Status").data("selected", $("#f1Status").attr('value'));
        $("#f1SupportLevel").data("selected", $("#f1SupportLevel").attr('value'));
        $("#f1Product").data("selected", $("#f1Product").attr('value'));
        var _supEntPostData = $("#supEntListForm1").serialize();*/
        //Make the call
        $.ajax({
            type: 'POST',
            url: $.supEntList,
            data: _supEntPostData,
            dataType: 'json',
            success: function(supEntList) {
                ice.supportentitlement.resetEntList(true, filterFlag);
                var _validate = new Object();
                ice.supportentitlement.valAndManipSupList(supEntList, _validate, filterFlag);
                if(_validate.result) {
                    ice.supportentitlement.populateSupportEntListUI(supEntList,_supEntPostData);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                ice.supportentitlement.resetEntList(true, filterFlag);
                ice.supportentitlement.toggleHeaderBody("hide", $.noSupportEntitlements);
                if(textStatus == "parsererror") {
                    //TODO SHOW validation failed message in modal
                    ice.supportentitlement.logError($.invalidAJAX);                }
            },
            beforeSend: function() {
                ice.supportentitlement.resetEntList(false, filterFlag);
            },
            complete: function() {
                //Do Nothing
            }
        });
    },
    valAndManipSupList: function(supEntList, validate, filterFlag) {
        if(supEntList.error != undefined && supEntList.error) {
            ice.supportentitlement.toggleHeaderBody("hide", $.noSupportEntitlements);
            //TODO SHOW validation failed message in modal
            if(supEntList.message != undefined) {
                ice.supportentitlement.logError("Error received: " + supEntList.message);
            }
            else {
                ice.supportentitlement.logError($.invalidAJAX);
            }
            validate.result = false;
        }
        else if(supEntList.seList == undefined || supEntList.seList.length == 0) {
            //TODO SHOW validation failed message in modal
            if(supEntList.seList.length == 0 && filterFlag == $.nonFilterFlag) {
                ice.supportentitlement.toggleHeaderBody("hide", $.noSupportEntitlements);
                ice.supportentitlement.logError($.invalidAJAX);
            }
            else if(supEntList.seList.length == 0 && filterFlag == $.filterFlag){
                $("#supportEntList").append("<tbody><tr><td colspan=\"3\">" + $.noResults + '</td></tr></tbody>');
            }
            else {
                ice.supportentitlement.logError($.invalidAJAX);
            }
            validate.result = false;
        }
        else {
            //Toggle hidden content
            ice.supportentitlement.toggleHeaderBody("show", null);
            
            //Manipulate provided input
            for(var i=0;i<supEntList.seList.length;i++) {
                if(supEntList.seList[i][2].toUpperCase() == $.supportExpired) {
                    supEntList.seList[i][2] = supEntList.seList[i][2].replace(/expired/i, '<span class="badge expired only" title="'+ $.supportExpired +'">' + $.supportExpired + '</span>');
                }
            }
            validate.result = true;
        }
    },
    populateSupportEntListUI: function(supEntList,seListPostData) {
		if($("#supportEntList_wrapper").length){
			$("#supportEntList_wrapper").replaceWith('<table id="supportEntList"><thead></thead><tbody></tbody></table>');
		}
	
        $('#supportEntList').dataTable( {
            "aaData" : supEntList.seList,
            "sScrollY": "200px",
            //"bDestroy": true,
            "bPaginate": false, // bug - BUG-00019704
			//"iDisplayLength" : 10, // bug - BUG-00019704
			"sPaginationType": "full_numbers",
            "bFilter":false,
            "sDom": 'zt',
            "bAutoWidth": false,
            "oLanguage": {
                "sEmptyTable": $.noSupportEntitlements
            },
            //"aoColumns": [{"sWidth":"auto"},{},{"sWidth":"300px"},{ "bVisible": false },{ "bVisible": false },{ "bVisible": false }],
			"aoColumns": [{"sTitle": "<span class='descending'>"+ice.supportentitlement.supportEntListHeader1+"</span>" , "sWidth":"240px"}, {"sTitle": "<span class='descending'>"+ice.supportentitlement.supportEntListHeader2+"</span>" , "sWidth":"300px"},{"sTitle": "<span class='descending'>"+ice.supportentitlement.supportEntListHeader3+"</span>" , "sWidth":"100px"},{"bVisible":false},{"bVisible":false},{"bVisible":false}],
            "fnInitComplete": function () {
                var _dt = this; // datatable object
                if(this.closest('div.dataTables_scrollBody')[0] && this.closest('div.dataTables_scrollBody').attr('style').toLowerCase().indexOf('overflow')!=-1)
                {
                    this.closest('div').css("overflow-y","scroll");
					this.closest('div.dataTables_scroll').addClass("bottomarea");
                    setTimeout(function() {_dt.fnAdjustColumnSizing(false);}, 500);
                }
                ice.supportentitlement.attachSupEntListEvents(_dt);
            }
        });
        /*Populate Support Entitlement List Filter dropdown values*/
        //Status
        $("#f1Status").empty().append($("<option></option>").
            attr("value", $.valueAllLbl).
            text($.optionAll));
        for(var i=0;i<supEntList.aggStatus.length;i++) {
            var _option = $("<option></option>").
                attr("value", supEntList.aggStatus[i]).
                text(supEntList.aggStatus[i]);
            if(seListPostData[$("#f1Status").attr('name')] == supEntList.aggStatus[i]) {
                _option.attr('selected', 'selected');
            }
            $("#f1Status").append(_option);
        }
        //Support Level
        $("#f1SupportLevel").empty().append($("<option></option>").
            attr("value", $.valueAllLbl).
            text($.optionAll));
        for(var i=0;i<supEntList.aggSupportLevel.length;i++) {
            var _option = $("<option></option>").
                attr("value", supEntList.aggSupportLevel[i]).
                text(supEntList.aggSupportLevel[i]);
            if(seListPostData[$("#f1SupportLevel").attr('name')] == supEntList.aggSupportLevel[i]) {
                _option.attr('selected', 'selected');
            }
            $("#f1SupportLevel").append(_option);
        }
        //Product
        $("#f1Product").empty().append($("<option></option>").
            attr("value", $.valueAllLbl).
            text($.optionAll));
        for(var i=0;i<supEntList.aggProduct.length;i++) {
            var _option = $("<option></option>").
                attr("value", supEntList.aggProduct[i]).
                text(supEntList.aggProduct[i]);
            if(seListPostData[$("#f1Product").attr('name')] == supEntList.aggProduct[i]) {
                _option.attr('selected', 'selected');
            }
            $("#f1Product").append(_option);
        }
    },
    attachSupEntListEvents: function(_dt) {
        $(_dt.fnGetNodes()).addClass("clickable");
        $("#supportEntList_wrapper table tbody tr").click(function(e) {
			if(e.target.nodeName=="A" ||e.target.nodeName=='a'){
				return;
			}
            if($(this).parent().is("thead") || ($._prevSelTr != null && $._prevSelTr.get(0) == this)) {
			    return false;
            }
            if($._prevSelTr == null) {
                $._prevSelTr = $(this);
            }
            else {
                $._prevSelTr.removeClass('selected');
                $._prevSelTr = $(this);
            }
            $(this).addClass('selected');
            var _aData = _dt.fnGetData(this);
            $.selectedSupEntData = _aData;
            $.stateSupEntDetail = $.stateApplyGetDetails;
            ice.supportentitlement.getSupportEntDetailsJSON(_aData[3], _aData[4], _aData[0], _aData[5],"filter",_aData[6]);
			
        });
    },
    getSupportEntDetailsJSON: function(productId, supProdType, supProdName, supProdSKU, filterFlag,sdpService) {	
        var _loadingDiv = $("#supportEntDetail .loading");
        
        //Prefiltering
        var _seDetailPostData = new Object();

        if(supProdType == $.detailsStandard) {
            _seDetailPostData[$("#f2ContractId").attr('name')] = $("#f2ContractId").attr('value');
            if($("#f2SupLevel").attr('value') != "") {
                _seDetailPostData[$("#f2SupLevel").attr('name')] = $("#f2SupLevel").attr('value');
            }
            else {
                _seDetailPostData[$("#f2SupLevel").attr('name')] = $("#f2SupLevel option:first").text();
            }
            if($("#f2Status").attr('value') != "") {
                _seDetailPostData[$("#f2Status").attr('name')] = $("#f2Status").attr('value');
            }
            else {
                _seDetailPostData[$("#f2Status").attr('name')] = $("#f2Status option:first").text();
            }
            _seDetailPostData[$("#f2DateFrom").attr('name')] = $("#f2DateFrom").attr('value');
            _seDetailPostData[$("#f2DateTo").attr('name')] = $("#f2DateTo").attr('value');
            //_seDetailPostData = $("#supEntStdDetailsForm").serialize();
        }
		else if (supProdType == $.detailsSdpSub)
		{
		
		
		   _seDetailPostData[$("#f2ContractId").attr('name')] = $("#f2ContractId").attr('value');	
			if($("#f2SupLevel").attr('value') != "") {
                _seDetailPostData[$("#f2SupLevel").attr('name')] = $("#f2SupLevel").attr('value');
            }
            else {
                _seDetailPostData[$("#f2SupLevel").attr('name')] = $("#f2SupLevel option:first").text();
            }
            if($("#f2Status").attr('value') != "") {
                _seDetailPostData[$("#f2Status").attr('name')] = $("#f2Status").attr('value');
            }
            else {
                _seDetailPostData[$("#f2Status").attr('name')] = $("#f2Status option:first").text();
            }
            _seDetailPostData[$("#f2DateFrom").attr('name')] = $("#f2DateFrom").attr('value');
            _seDetailPostData[$("#f2DateTo").attr('name')] = $("#f2DateTo").attr('value');
		}
        _seDetailPostData["productId"] = productId;
        _seDetailPostData["supportProductType"] = supProdType;
        _seDetailPostData["sku"] = supProdSKU;
		_seDetailPostData["sdpService"] = sdpService;
		  //Make sure there is no current ongoing  AJAX request, if yes cancel it
        if($._sDjqXHR && $._sDjqXHR.readystate != 4) {
            $._sDjqXHR.abort();
        }
        
        $._sDjqXHR = $.ajax({
            type: 'POST',
            url: $.supEntDetail,
            data: _seDetailPostData,
            dataType: 'json',
            success: function(supEntDetails) {
                if($.stateSupEntDetail != $.stateApplyF2Filter) {
                    ice.supportentitlement.resetEntDetails(supProdType);
                }
                var _validate = new Object();
				ice.supportentitlement.valAndManipSupportEntDetails(supEntDetails, supProdName, _validate, filterFlag);
                if(_validate.result) {
			
                    ice.supportentitlement.populateSupportEntDetailsUI(supEntDetails,supProdName,_seDetailPostData);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                if($.stateSupEntDetail != $.stateApplyF2Filter) {
                    _loadingDiv.addClass('hidden');
                }
                if(textStatus == "parsererror") {
                    //TODO SHOW validation failed message in modal
                    ice.supportentitlement.logError($.invalidAJAX);
                    $("#supportEntDetail .stdheader h2").text(supProdName+' '+$.supEntDetailHeading);
                    $("#supEntStdDetails tbody").empty();
                    ice.supportentitlement.showError($.noSupportStdDetails);
                }
            },
            beforeSend: function() {
                if($.stateSupEntDetail != $.stateApplyF2Filter) {
                    $("#supportEntDetail .active").addClass('hidden');
                    $("#supportEntDetail .simple").addClass('hidden');
                    _loadingDiv.removeClass('hidden').html('<span class="loading_big">'+$.loadingText+'</span>');
                }
            },
            complete: function() {
                if($.stateSupEntDetail != $.stateApplyF2Filter) {
                    ice.supportentitlement.resetEntDetails(supProdType);
                }
            }
        });
    },
    valAndManipSupportEntDetails: function(supEntDetails,supProdName,validate,filterFlag) {
	if(supEntDetails.error != undefined && supEntDetails.error) {
            //TODO SHOW validation failed message in modal
            if(supEntDetails.message != undefined) {
                ice.supportentitlement.logError(supEntDetails.message);
                $("#supportEntDetail .stdheader h2").text(supProdName+' '+$.supEntDetailHeading);
                $("#supEntStdDetails tbody").empty();
                ice.supportentitlement.showError($.noSupportStdDetails);
            }
            else {
                ice.supportentitlement.logError($.invalidAJAX);
            }
            validate.result = false;
        }
        else if(supEntDetails.seDetails == undefined || supEntDetails.seDetails.length == 0) {
            //TODO SHOW validation failed message in modal
            ice.supportentitlement.logError($.invalidAJAX);
            //$("#supportEntDetail .stdheader h2").text($.msgDetailsHeader.replace(/<product>/i, supProdName));
            $("#supportEntDetail .stdheader h2").text(supProdName+' '+$.supEntDetailHeading);
            if(filterFlag == $.nonFilterFlag) {
                $("#supEntStdDetails tbody").empty();
                ice.supportentitlement.showError($.noSupportStdDetails);
            }
            else {
                ice.supportentitlement.showError($.noResults);
				$("#supEntStdDetails tbody").empty();
            }
            validate.result = false;
        }
        else {
            if(supEntDetails.seType == $.detailsStandard) {
                //Manipulate input to add contract id link for std details
                for(var i=0;i<supEntDetails.seDetails.length;i++) {
					var expiredStatus, prodDesc="";
                    if(supEntDetails.seDetails[i][2].toUpperCase() == $.supportExpired) {
						expiredStatus = $.supportExpired;
                        supEntDetails.seDetails[i][2] = supEntDetails.seDetails[i][2].replace(/expired/i, '<span class="badge expired only" title="'+ $.supportExpired +'">' + $.supportExpired + '</span>');
                    }else{
						expiredStatus =  supEntDetails.seDetails[i][2];
					}
					
					if($.trim(supEntDetails.seDetails[i][0]).length){
						prodDesc = "<div class=\"productInfo\">";
					
						if(supEntDetails.seDetails[i][0].indexOf(',')!=-1){
							prodDesc += supEntDetails.seDetails[i][0].split(',')[0]+"... <span class=\"tooltip\" title='"+supEntDetails.seDetails[i][0]+"'><a href=\"javascript:void(0)\">"+$.moreText+"</a></span>";
						} else {
							prodDesc += supEntDetails.seDetails[i][0];
						}
						prodDesc += "</div>";
					}
					
                    if(supEntDetails.seDetails[i][7] == "true") {
					//BUG-00025692
					var langCode = '' + $('#localeFromLiferayTheme').text().split('_')[0];			
					langCode = langCode === 'en' ? '' : '/' + langCode; 				
					 supEntDetails.seDetails[i][0] = "<a href='" + langCode + $.supportcontracturl + "?_VM_action=viewContractDetails&_VM_contractID=" +supEntDetails.seDetails[i][6] + "&_VM_contractStatus="+ expiredStatus  + "&_VM_selectedEANumber=" + $.vmSelectedEANumber +"' class=\"cNum\">" +supEntDetails.seDetails[i][5] + "</a>" + prodDesc;
                    }
                    else {
                        supEntDetails.seDetails[i][0] = "<div class=\"flowleft\">" + supEntDetails.seDetails[i][5] +
                        "&nbsp;</div>" + prodDesc;
                    }
                }
				 $("#instanceID").hide();
				 $("#contractID").show();
				  $("#instanceID").hide();
                validate.result = true;
				
            }
            else if(supEntDetails.seType == $.detailsIncident) {
                //Manipulate and add [+] expand icon
                for(var i=0;i<supEntDetails.seDetails.length;i++) {
                    if(supEntDetails.seDetails[i][1].toUpperCase() == $.supportExpired) {
                        supEntDetails.seDetails[i][1] = supEntDetails.seDetails[i][1].replace(/expired/i, '<span class="badge expired only" title="'+ $.supportExpired +'">' + $.supportExpired + '</span>');
						
                    }
                    supEntDetails.seDetails[i][0] = "<div class='openCloseSelect'><a class='openClose' href='#'></a></div>" + supEntDetails.seDetails[i][0];

                }
                validate.result = true;
            }
			else if (supEntDetails.seType ==$.detailsSdpSub)
			{
                  for(var i=0;i<supEntDetails.seDetails.length;i++) {
					if($.trim(supEntDetails.seDetails[i][0]).length){		
					
						if(supEntDetails.seDetails[i][0].indexOf('/') != -1){							
							instanceIDTrimmed = supEntDetails.seDetails[i][0].split('/')[0];
							instanceNameTrimmed = supEntDetails.seDetails[i][0].split('/')[1];
						} else {
							instanceIDTrimmed = supEntDetails.seDetails[i][0];
							instanceNameTrimmed = supEntDetails.seDetails[i][0];
						}
					}      
						if(supEntDetails.seDetails[i][2] != "Pending Provisioning"){
						supEntDetails.seDetails[i][0] = "<a href='" + $.supportInstanceDetailsUrl + "?_VM_action=viewSubscriptionDetails&_VM_serviceInstanceId=" + encodeURI(supEntDetails.seDetails[i][5]) +"&_VM_serviceInstanceName="+encodeURI(supEntDetails.seDetails[i][6])+"&_VM_eaName="+encodeURI(supEntDetails.seDetails[i][7])+ "' class=\"cNum\">" + instanceNameTrimmed +" (ID: " + instanceIDTrimmed +")" + "</a>";
						}
				}	
					$("#contractID").hide();
					$("#instanceID").show();
					validate.result = true;
				}
            else {
                //TODO SHOW validation failed message in modal
                ice.supportentitlement.logError($.invalidAJAX);
                validate.result = false;
            }
        }
    },
    populateSupportEntDetailsUI: function(supEntDetails, supProdName, seDetailPostData) {
        if(supEntDetails.seType == $.detailsStandard ) {
            //Populate header
            //$("#supportEntDetail .stdheader h2").text($.msgDetailsHeader.replace(/<product>/i, supProdName));
            $("#supportEntDetail .stdheader h2").text(supProdName+' '+$.supEntDetailHeading);
            //Make sure to empty the table before populating
            //$("#supEntStdDetails tbody").remove();
            //Populate the table
			if($("#supEntStdDetails_wrapper").length){
					$("#supEntStdDetails_wrapper").replaceWith('<table id="supEntStdDetails"><thead></thead><tbody></tbody></table>');
				}
            $('#supEntStdDetails').dataTable( {
                "aaData" : supEntDetails.seDetails,
                //"bDestroy": true,
				"sScrollY": "200px",  
                "bPaginate": false, // cometting the pagination to fix a blocker will revert back in future
				//"iDisplayLength" : 10, //bug-00021718
				"sPaginationType": "full_numbers",
                "bFilter":false,
                "sDom": 'zt',
                "bAutoWidth": false,
                "oLanguage": {
                    "sEmptyTable": $.noSupportStdDetails
                },
                /*"aoColumns": [{"sWidth": "300px"},{"sWidth": "175px"},{},{},{},{"bVisible":false},{"bVisible":false},{"bVisible":false}],*/
				"aoColumns": [{"sTitle": "<span class='descending'>"+ice.supportentitlement.supEntStdDetailsHeader1+"</span>" , "sWidth":"300px"}, {"sTitle": "<span class='descending'>"+ice.supportentitlement.supEntStdDetailsHeader2+"</span>" , "sWidth":"auto"},{"sTitle": "<span class='descending'>"+ice.supportentitlement.supEntStdDetailsHeader3+"</span>" , "sWidth":"auto"},{"sTitle": "<span class='descending'>"+ice.supportentitlement.supEntStdDetailsHeader4+"</span>","sWidth":"auto"},{"sTitle": "<span class='descending'>"+ice.supportentitlement.supEntStdDetailsHeader5+"</span>"},{"bVisible":false},{"bVisible":false},{"bVisible":false}],
                "fnInitComplete": function () {
                    var _dt = this; // datatable object
				if(this.closest('div.dataTables_scrollBody')[0] && this.closest('div.dataTables_scrollBody').attr('style').toLowerCase().indexOf('overflow')!=-1)
					{
						this.closest('div').css("overflow-y","scroll");
						this.closest('div.dataTables_scroll').addClass("bottomarea");
						setTimeout(function() {_dt.fnAdjustColumnSizing(false);}, 500);
					 }
                $.scrollTo("#supEntStdDetails");
                }
            });
            
            /*Populate Support Entitlement 'STANDARD' Details Filter dropdown values*/
            //Support Level
            $("#f2SupLevel").empty().append($("<option></option>").
                attr("value", $.valueAllLbl).
                text($.optionAll));
            if(supEntDetails.aggSupportLevel != null) {
                for(var i=0;i<supEntDetails.aggSupportLevel.length;i++) {
                    var _option = $("<option></option>").
                        attr("value", supEntDetails.aggSupportLevel[i]).
                        text(supEntDetails.aggSupportLevel[i]);
                    if(seDetailPostData[$("#f2SupLevel").attr('name')] == supEntDetails.aggSupportLevel[i]) {
                        _option.attr('selected', 'selected');
                    }
                    $("#f2SupLevel").append(_option);
                }
            }
            //Status    
            $("#f2Status").empty().append($("<option></option>").
                attr("value", $.valueAllLbl).
                text($.optionAll));
            if(supEntDetails.aggStatus != null) {
                for(var i=0;i<supEntDetails.aggStatus.length;i++) {
                    var _option = $("<option></option>").
                        attr("value", supEntDetails.aggStatus[i]).
                        text(supEntDetails.aggStatus[i]);
                    if(seDetailPostData[$("#f2Status").attr('name')] == supEntDetails.aggStatus[i]) {
                        _option.attr('selected', 'selected');
                    }
                    $("#f2Status").append(_option);
                }
            }
        }
        else if(supEntDetails.seType == $.detailsIncident) {
            //Populate header
            $("#supportEntDetail .incheader h2").text($.msgDetailsHeader.replace(/<product>/i, supProdName));
            //Populate the table
			if($("#supEntIncDetails_wrapper").length){
					$("#supEntIncDetails_wrapper").replaceWith('<table id="supEntIncDetails"><thead></thead><tbody></tbody></table>');
				}
            $('#supEntIncDetails').dataTable( {
			"aaData" : supEntDetails.seDetails,
			"bDestroy": true,
			"sScrollY": "200px",
			"bPaginate": false,// when you dont want pagination , please change the property value as false, otherwise you dont see all rows - BUG-00034775
			//"iDisplayLength" : 10, //bug-00021718
			//"sPaginationType": "full_numbers",
			"bFilter":false,"sDom": 'zt',	"bAutoWidth": false,
			"aoColumns": [{"sTitle": "<span class='descending'>"+ice.supportentitlement.supEntIncDetailsHeader1+"</span>" , "sWidth":"300px"}, {"sTitle": "<span class='descending'>"+ice.supportentitlement.supEntIncDetailsHeader2+"</span>" , "sWidth":"auto"},{"sTitle": "<span class='descending'>"+ice.supportentitlement.supEntIncDetailsHeader3+"</span>" , "sWidth":"auto"},{"sTitle": "<span class='descending'>"+ice.supportentitlement.supEntIncDetailsHeader4+"</span>","sWidth":"auto"},{"sTitle": "<span class='descending'>"+ice.supportentitlement.supEntIncDetailsHeader5+"</span>"},{"sTitle": "<span class='descending'>"+ice.supportentitlement.supEntIncDetailsHeader6+"</span>"}],
			"fnInitComplete": function () {
				var _dt = this; // datatable object
				if(this.closest('div.dataTables_scrollBody')[0] && this.closest('div.dataTables_scrollBody').attr('style').toLowerCase().indexOf('overflow')!=-1)
				{
					this.closest('div').css("overflow-y","scroll");
					this.closest('div.dataTables_scroll').addClass("bottomarea");
					setTimeout(function() {_dt.fnAdjustColumnSizing(false);}, 500);
				}
				ice.supportentitlement.attachSupportEntDetailEvents(_dt);
				$.scrollTo("#supEntIncDetails");
			}
            });
        }
		else if(supEntDetails.seType ==$.detailsSdpSub)
		{
            //Populate header
            //$("#supportEntDetail .stdheader h2").text($.msgDetailsHeader.replace(/<product>/i, supProdName));
            $("#supportEntDetail .stdheader h2").text(supProdName+' '+$.supEntDetailHeading);
			
			  //Make sure to empty the table before populating
            //$("#supEntStdDetails tbody").remove();
            //Populate the table
			if($("#supEntStdDetails_wrapper").length){
					$("#supEntStdDetails_wrapper").replaceWith('<table id="supEntStdDetails"><thead></thead><tbody></tbody></table>');
				}
			$('#supEntStdDetails').dataTable( {
                "aaData" : supEntDetails.seDetails,
                //"bDestroy": true,
				"sScrollY": "200px",  
                "bPaginate": false, // cometting the pagination to fix a blocker will revert back in future
				//"iDisplayLength" : 10, //bug-00021718
				"sPaginationType": "full_numbers",
                "bFilter":false,
                "sDom": 't',
                "bAutoWidth": false,
                "oLanguage": {
                    "sEmptyTable": $.noSupportStdDetails
                },
                /*"aoColumns": [{"sWidth": "300px"},{"sWidth": "175px"},{},{},{},{"bVisible":false},{"bVisible":false},{"bVisible":false}],*/
				"aoColumns": [{"sTitle": "<span class='descending'>"+ice.supportentitlement.serviceSubcriptionHeader1+"</span>" , "sWidth":"300px"}, 
				{"sTitle": "<span class='descending'>"+ice.supportentitlement.serviceSubcriptionHeader2+"</span>" , "sWidth":"auto"},
				{"sTitle": "<span class='descending'>"+ice.supportentitlement.serviceSubcriptionHeader3+"</span>" , "sWidth":"auto"},
				{"sTitle": "<span class='descending'>"+ice.supportentitlement.serviceSubcriptionHeader4+"</span>","sWidth":"auto"},
				{"sTitle": "<span class='descending'>"+ice.supportentitlement.serviceSubcriptionHeader5+"</span>"},
				{"bVisible":false},{"bVisible":false},{"bVisible":false}],
                "fnInitComplete": function () {
                    var _dt = this; // datatable object
				if(this.closest('div.dataTables_scrollBody')[0] && this.closest('div.dataTables_scrollBody').attr('style').toLowerCase().indexOf('overflow')!=-1)
					{
						this.closest('div').css("overflow-y","scroll");
						this.closest('div.dataTables_scroll').addClass("bottomarea");
						setTimeout(function() {_dt.fnAdjustColumnSizing(false);}, 500);
					 }
                $.scrollTo("#supEntStdDetails");
                }
            });
			$("#supportEntDetail .simple").removeClass('hidden');
			
			$("#f2SupLevel").empty().append($("<option></option>").
                attr("value", $.valueAllLbl).
                text($.optionAll));
            if(supEntDetails.aggSupportLevel != null) {
                for(var i=0;i<supEntDetails.aggSupportLevel.length;i++) {
                    var _option = $("<option></option>").
                        attr("value", supEntDetails.aggSupportLevel[i]).
                        text(supEntDetails.aggSupportLevel[i]);
                    if(seDetailPostData[$("#f2SupLevel").attr('name')] == supEntDetails.aggSupportLevel[i]) {
                        _option.attr('selected', 'selected');
                    }
                    $("#f2SupLevel").append(_option);
                }
            }
            //Status    
            $("#f2Status").empty().append($("<option></option>").
                attr("value", $.valueAllLbl).
                text($.optionAll));
            if(supEntDetails.aggStatus != null) {
                for(var i=0;i<supEntDetails.aggStatus.length;i++) {
                    var _option = $("<option></option>").
                        attr("value", supEntDetails.aggStatus[i]).
                        text(supEntDetails.aggStatus[i]);
                    if(seDetailPostData[$("#f2Status").attr('name')] == supEntDetails.aggStatus[i]) {
                        _option.attr('selected', 'selected');
                    }
                    $("#f2Status").append(_option);
                }
            }
			}
        else {
            //TODO SHOW Modal error
            ice.supportentitlement.logError($.invalidAJAX);
        }
		myvmware.hoverContent.bindEvents($('span.tooltip'), 'defaultfunc');
    },
    attachSupportEntDetailEvents: function(dt) {
        $('#supEntIncDetails .openCloseSelect a').click(function() {
            nTr = $(this).closest('tr')[0];
            if($(this).hasClass('open') && nTr.haveData) {
                $(this).removeClass('open');
                $(nTr).next('tr').addClass('hidden');
            }
            else {
                $(this).addClass('open');
                if(!nTr.haveData) {
                    var _aData = dt.fnGetData(nTr);
                    ice.supportentitlement.getIncPacksJSON(_aData[6],nTr,dt);
                    //dt.fnOpen(nTr,getSdata(),'more-details');
                    nTr.haveData = true;
                }
                else {
                    $(nTr).next('tr').removeClass('hidden');
                }
            }
            return false;
        });
    },
    getIncPacksJSON: function(incPackSerial,nTr,dt) {
        var _loadingDiv = $("#incPacksLoading").clone().removeAttr("id").removeClass("hidden").get(0);
        
        $.ajax({
            type: 'POST',
            url: $.supIncPacks,
            data: { "incidentPackSerial" : incPackSerial},
            dataType: 'json',
            success: function(incPacks) {
                $(nTr).find("incPacksLoading").remove();
                var _validate = new Object();
                ice.supportentitlement.valAndManipIncPacks(incPacks, _validate);
                if(_validate.result) {
                    ice.supportentitlement.populateIncPacks(incPacks,nTr,dt);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                //_loadingDiv.addClass('hidden');
                $(nTr).find("incPacksLoading").remove();
                if(textStatus == "parsererror") {
                    //TODO SHOW validation failed message in modal
                    ice.supportentitlement.logError($.invalidAJAX);
                }
            },
            beforeSend: function() {
                /*$("#supportEntDetail .active").addClass('hidden');
                $("#supportEntDetail .simple").addClass('hidden');
                _loadingDiv.removeClass('hidden').find('span').text($.loadingText);*/
                dt.fnOpen(nTr,_loadingDiv,'more-details');
            },
            complete: function() {
            }
        });
    },
    valAndManipIncPacks: function(incPacks,validate) {
        if(incPacks.error != undefined && incPacks.error) {
            //TODO SHOW validation failed message in modal
            if(incPacks.message != undefined) {
                ice.supportentitlement.logError(incPacks.message);
            }
            else {
                ice.supportentitlement.logError($.invalidAJAX);
            }
            validate.result = false;
        }
        else if(incPacks.seIncidentPacks == undefined) {
            //TODO SHOW validation failed message in modal
            ice.supportentitlement.logError($.invalidAJAX);
            validate.result = false;
        }
        else {
            //Manipulate input to add hyperlink to SRs
            for(var i=0;i<incPacks.seIncidentPacks.length;i++) {
            	//Bug Fix for BUG-00027367
            	//incPacks.seIncidentPacks[i][0] = '<a href="#">' + incPacks.seIncidentPacks[i][0] + '</a>';
                incPacks.seIncidentPacks[i][0] = '<a href="/group/vmware/support-requests?action=renderSummaryRequestDetailsForm&requestNumber=' + incPacks.seIncidentPacks[i][0] + '">' + incPacks.seIncidentPacks[i][0] + '</a>';			
            }
            validate.result = true;
        }
    },
    populateIncPacks: function(incPacks,nTr,dt) {
            var _incSRDetails = $('#incSRDetails').dataTable( {
                "aaData" : incPacks.seIncidentPacks,
                "bPaginate": true,
				//"iDisplayLength" : 10,
				"sPaginationType": "full_numbers",
                "bDestroy" : true,
                "bFilter":false,
                "bSort" : false,
                "sDom": 'zt',
                "bAutoWidth": false,
                //"aoColumns": [{},{},{},{}],
				"aoColumns": [{"sTitle": "<span class='descending'>"+ice.supportentitlement.incSRDetailsHeader1+"</span>"}, {"sTitle": "<span class='descending'>"+ice.supportentitlement.incSRDetailsHeader2+"</span>"},{"sTitle": "<span class='descending'>"+ice.supportentitlement.incSRDetailsHeader3+"</span>"},{"sTitle": "<span class='descending'>"+ice.supportentitlement.incSRDetailsHeader4+"</span>"}],
                "fnInitComplete": function () {
                    var _dt = this; // datatable object
                    $(_dt).find("thead th span").each(function() {
                        $(this).replaceWith(this.childNodes);
                    });
					if(this.closest('div.dataTables_scrollBody')[0] && this.closest('div.dataTables_scrollBody').attr('style').toLowerCase().indexOf('overflow')!=-1)
					{
						this.closest('div').css("overflow-y","scroll");
						this.closest('div.dataTables_scroll').addClass("bottomarea");
						setTimeout(function() {_dt.fnAdjustColumnSizing(false);}, 500);
					}
					$.scrollTo("#incSRDetails");
                }
            }).clone().removeAttr("id").removeClass("hidden").get(0);
            
            dt.fnOpen(nTr,_incSRDetails,'more-details');
			
			$('#supEntIncDetails .more-details thead').css('border', 'none');
    },
    logError: function(error) {
        try {
            //console.error(error);
        }
        catch(e) {
            //Do nothing
        }
    },
    showError: function(error) {
        if($('#supentalert').length == 0) {
            var _modalAlert = $('<div id=\"supentalert\"><div class=\"modalContent\"><div class=\"body clearfix\">' + error + '</div></div></div>').css('display','none');
            $('#supportEntDetail').append(_modalAlert);
        }
        else {
            $('#supentalert .body').empty().append(error);
        }
        vmf.modal.show('supentalert');
    }
};
