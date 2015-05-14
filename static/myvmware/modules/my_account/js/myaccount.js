vmf.ns.use("ice");
VMFModuleLoader.loadModule("resize", function() {});
VMFModuleLoader.loadModule("customDropdown", function(){});
ice.myaccount = {
	loadEADetails: null,	loadChangeDefaultEA: null,contextPath: null,confirmUrl: null,myAccNumber: null,myAccName: null,myAccItAdmin: null,removeUrl: null,
	myAccProcContact: null,myAccItAdminCn: null,myAccProcContactCn: null,myAccPreferedReseller:null,loadEAListURLHolder:null,searchPartnersURL:null,changePreferredPartnerURL:null,
	deFaultHolder:null,accountNumberHolder:null,accountNameHolder:null,itAdmHolder:null,procContactHeaderHolder:null,selectedAccNumber:null,countryUrl:null,stateUrl:null,
	partnerNameAfterSearch:null,defaultPartnerNamePOPUP:null,defaultCountryCodePOPUP:null,defaultStateCodePOP:null,eaListJSON:null,
	//init starts here
	init: function (loadEAListURL, loadEAD, loadCDEA, cPath, cfrm, deFault, accountNumber, accountName, itAdm, procContactHeader,loadSelectedAccNumber,searchPartners, _countryUrl, _stateUrl,_savePartner, _removeEA) {
		loadEAListURLHolder=loadEAListURL;
		loadEADetails = loadEAD;
		loadChangeDefaultEA = loadCDEA;
		contextPath = cPath;
		confirmUrl = cfrm;
		removeUrl = _removeEA;
		deFaultHolder=deFault;
		accountNumberHolder=accountNumber;
		accountNameHolder=accountName;
		itAdmHolder=itAdm;
		procContactHeaderHolder=procContactHeader;
		selectedAccNumber=loadSelectedAccNumber;
		searchPartnersURL=searchPartners;
		changePreferredPartnerURL=_savePartner;
		countryUrl=_countryUrl;
		stateUrl=_stateUrl;
		CountryCodeAfterChange="";
		eaListJSON={};
		ice.myaccount.adjustHeight();
		// Added for BUG-00031154
		var _pathArray = location.pathname.split('/');
		var _strPath = '';
		for(var i = 0; i < _pathArray.length; i++)
		{
			if(_pathArray[i].toLowerCase() == 'group')
			{    
				break;   
			}
			else if (_pathArray[i] != '')
			{
				_strPath += _pathArray[i];
				_strPath += '/';
			}
			else
			{
				_strPath += '/';
			}
		}
		_strPath += 'group/vmware/get-help';
		$("#getSupport").attr("href", _strPath);
		$('.section-wrapper .column.h427').css({'height':'162px'});
		$('.settings-cog .dropdown ul li a').addClass('dummyClick').parent('li').addClass('inactive').unbind('click'); 
		$('.fn_cancel').click(function() { vmf.modal.hide(); });
		
		$('#exportAllToCsvButton').click(function() {
			var _fPerPostData = new Object();
			_fPerPostData['reportFor'] = 'accountSummaryFromExportAllButton';
			myvmware.common.generateCSVreports($exportToCsvActionFromAccountSummaryActionsUrl, _fPerPostData, "account-summary : export-all", "account-summary : Export-to-CSV : Error");
			//myvmware.common.generateReports($exportToCsvActionFromAccountSummaryActionsUrl + '&reportFor=accountSummaryFromExportAllButton')
		});
		
		
		$('#pref11,#pref12').click(function(){
			var _optionRadioButton = document.getElementsByName('pref1');
			var current_id=$(this).attr('id');
			//alert(current_id)
			if(current_id=="pref12")
			{
				$('#partnerTable').find('tr').each(function(){
					$(this).find('input[type=radio]').removeAttr('checked');
					$(this).find('input[type=radio]').attr('disabled',true);
				});
				partnerNameAfterSearch="VMware Direct";
			} else {
				$('#partnerTable').find('tr').each(function(){
					$(this).find('input[type=radio]').attr('disabled',false);
				});
			}
			for(i=0;i<_optionRadioButton.length;i++){
				if(_optionRadioButton[i].checked==true){
					//alert(_optionRadioButton[i].value);
					if(_optionRadioButton[i].value=='yes'){
						$('#saveButton').addClass('disabled');
						$('#saveButton').attr('disabled',true);
					} else if(_optionRadioButton[i].value=='no'){
						$('#saveButton').removeClass('disabled');
						$('#saveButton').attr('disabled',false);
					}
				}
			}
		});
		$("#partnerCountry").change(function(){
			CountryCodes="CA,US";
			countrycode=$(this).val();
			//alert(countrycode);
			var _strHTML = '';
			var _splitCountrycodes = CountryCodes.split(',');
			if(_splitCountrycodes[0]==countrycode||_splitCountrycodes[1]==countrycode){
				CountryCodeAfterChange = $(this).val();
				ice.myaccount.loadState();
			} else {
				_strHTML += '<option value="">'+ice.globalVars.selectState+'</option>';
				$('#partnerState').html(_strHTML);
			}
		});
		$('#partnerTable').find('.vspace2 input[type=radio]').live('click',function(){
			$('#saveButton').removeClass('disabled').attr('disabled',false);
		});
		$("#changePreferredPartnerContent2").hide();
		/*CR 15768 Tooltips Changes*/
		myvmware.common.showMessageComponent('ACCOUNT_SUMMARY');
		myvmware.common.setBeakPosition({
			beakId:myvmware.common.beaksObj["Q1_BEAK_ACCOUNT_SUMMARY_FOR_REMOVE_ACCOUNT_OPTION"],
			beakName:"Q1_BEAK_ACCOUNT_SUMMARY_FOR_REMOVE_ACCOUNT_OPTION",
			beakHeading:$acctSummaryBeakHeading,
			beakContent:$acctSummaryBeakContent,
			target:$('.custom-cog:first'),
			beakLink:'#row4'
		});
		/*End of CR 15768 Tooltips Changes*/
		$.ajax({
			type: 'POST',
			url: loadEAListURL,
			success: function (data) {
				var _defaultAccountFlag = "no";
				var _selectionHappenned="no";
				try {
					var _jsonResponse = vmf.json.txtToObj(data);
					if(typeof(_jsonResponse.error)!='undefined' && _jsonResponse.error!='' && _jsonResponse.error==true){
						if(_jsonResponse.message!=''){
							$('#loading').html(_jsonResponse.message);
							$('#loadingDetails').html(_jsonResponse.message);
						} else {
							$('#loading').html(ice.globalVars.unknownError);
							$('#loadingDetails').html(ice.globalVars.unknownError);
						}
					} else {
						var _loadEAListData = _jsonResponse.aaData;
						eaListJSON = _loadEAListData;
						vmf.datatable.build($('#myaccountList'), {
							"aoColumns": [
								{"sTitle": deFault, "bSortable": false,"sWidth" : "46px"},
								{"sTitle": '<span class="descending">'+accountNumber+'</span>',"sWidth": "80px" },
								{"sTitle": '<span class="descending">'+accountName+'</span>',"sWidth": "157px"},
								{"sTitle": '<span class="descending">'+itAdm+'</span>',"sWidth": "125px"},
								{"sTitle": '<span class="descending">'+procContactHeader+'</span>',"sWidth": "115px" },
								{"sTitle": "","bVisible": false}, {"sTitle": "","bVisible": false}, {"sTitle": "","bVisible": false}
							],
							"bInfo": false,
							"bServerSide": false,
							"bAutoWidth": false,
							"aaData": _loadEAListData,
							"sScrollY": "507px",
							"sDom" : 'zrtSpi',
							"bFilter": false,
							"bProcessing":true,
							"oLanguage": {"sProcessing" : loadingURL,"sLoadingRecords":""},
							"fnInitComplete": function () {
								dt = this; // datatable object	
								if(this.closest('div.dataTables_scrollBody')[0] && this.closest('div.dataTables_scrollBody').attr('style').toLowerCase().indexOf('overflow')!=-1){
									this.closest('div').css("overflow-y","scroll");
									setTimeout(function() {dt.fnAdjustColumnSizing(false);}, 500);
								}
								var theadLen = $('#myaccountList_wrapper .dataTables_scrollBody #myaccountList tbody tr').length;		
								(theadLen > 1)?ice.myaccount.attachDefaultAccount():ice.myaccount.dettachDefaultAccount;
								$('#myaccountList tbody tr td:first-child').find('span:eq(0)').hide();
								$(this.fnGetNodes()).addClass("clickable"); 
								$('#myaccountList tbody tr').click(function () {
									$('#myaccountList tbody tr').removeClass('selected');
									var tds = $(this).addClass('selected').find('td');
									myAccItAdminCn= $(this).find('td:eq(0) input:eq(0)').val();
									myAccProcContactCn= $(this).find('td:eq(0) input:eq(1)').val();
									myAccPreferedReseller= $(this).find('td:eq(0) input:eq(2)').val();
									//Get name from Json as name is getting wrapped around if it is long
															//********* Replace with unwrap code
									myAccNumber = vmf.unwrap($.trim(tds[2].innerHTML)); // account number and name need to swap in controller
									                                         //********* Replace with unwrap code upto here ****//
									myAccName =  $.trim(tds[1].innerHTML); // account number and name need to swap in controller
									myAccItAdmin = $.trim(tds[3].innerHTML);
									myAccProcContact = $.trim(tds[4].innerHTML);
									ice.myaccount.populateEADetailsUI();
									ice.myaccount.saveSelectedEA();
								});
								if ($('#myaccountList tbody tr td').hasClass('dataTables_empty')) {
									$('#loadingDetails').html(ice.globalVars.noData);
								} else {
									if(selectedAccNumber && selectedAccNumber!=null){
										$('#myaccountList tbody tr').each(function (index) {
											if($(this).closest('tr').find('td:nth-child(2)').text()==selectedAccNumber){
												$(this).closest('tr').attr('class', 'selected');
												_selectionHappenned="yes";
												                                         //********* Replace with unwrap code   
												myAccNumber = vmf.unwrap($(this).closest('tr').find('td:nth-child(3)').text()); // account number and name need to swap in controller
												                                         //********* Replace with unwrap code upto here
												myAccName = $(this).closest('tr').find('td:nth-child(2)').text(); // account number and name need to swap in controller
												myAccItAdmin = $(this).closest('tr').find('td:nth-child(4)').text();
												myAccProcContact = $(this).closest('tr').find('td:nth-child(5)').text();
												myAccItAdminCn= $(this).closest('tr').find('td:eq(0) input:eq(0)').val();
												myAccProcContactCn= $(this).closest('tr').find('td:eq(0) input:eq(1)').val();
												myAccPreferedReseller= $(this).closest('tr').find('td:eq(0) input:eq(2)').val();
												ice.myaccount.populateEADetailsUI();
											}
										});
									}
									if ($('#myaccountList tbody tr').length == 1) { 										
										$('.settings-cog .dropdown ul li').addClass('inactive'); //for graying out gear icon
										//$('#changePRLink').addClass('dummyClick');
									} else { 
										//$('#changePRLink').removeClass('dummyClick');
									}
									$('#myaccountList tbody tr td:first-child').each(function (index) {
										if ($.trim($(this).find('span:eq(0)').text()) != '' && !$('#myaccountList tbody tr td').hasClass('dataTables_empty')) {
											if(!$('#myaccountList tbody tr td:first-child').find('img').length){
												$(this).addClass('center').append('<img width="16px" src="/static/myvmware/common/img/dot.png" title="'+default_img_title+'"/>');
											}
											_defaultAccountFlag = "yes";
											$('#myaccountList').prepend($('#myaccountList tbody tr:last'));
											if(_selectionHappenned=="no"){
											                                 //********* Replace with unwrap code below
												myAccNumber = vmf.unwrap($(this).closest('tr').find('td:nth-child(3)').text()); // account number and name need to swap in controller
												myAccName = $(this).closest('tr').find('td:nth-child(2)').text(); // account number and name need to swap in controller
												myAccItAdmin = $(this).closest('tr').find('td:nth-child(4)').text();
												myAccProcContact = $(this).closest('tr').find('td:nth-child(5)').text();
												myAccItAdminCn= $(this).closest('tr').find('td:eq(0) input:eq(0)').val();
												myAccProcContactCn= $(this).closest('tr').find('td:eq(0) input:eq(1)').val();
												myAccPreferedReseller= $(this).closest('tr').find('td:eq(0) input:eq(2)').val();
												$(this).closest('tr').attr('class', 'selected');
												ice.myaccount.populateEADetailsUI();
											}
										}
									});
									if (_defaultAccountFlag == "no") { //when default account is null
										if(!$('#myaccountList tbody tr td:first-child').find('img').length){
											$('#myaccountList tbody tr td:eq(0)').addClass('center').append('<img width="16px" src="/static/myvmware/common/img/dot.png" title="'+default_img_title+'"/>');
										}
										var tds = $('#myaccountList tbody tr:first').find('td');
										if(_selectionHappenned=="no"){
											$('#myaccountList tbody tr:first').addClass('selected');
											                                    //********* Replace with unwrap code
											myAccNumber = vmf.unwrap($.trim(tds[2].innerHTML)); // account number and name need to swap in controller
											                                    //********* Replace with unwrap code upto here
											myAccName = $.trim(tds[1].innerHTML); // account number and name need to swap in controller
											myAccItAdmin = $.trim(tds[3].innerHTML);
											myAccProcContact = $.trim(tds[4].innerHTML);
											myAccItAdminCn= $('#myaccountList tbody tr:first').find('td:eq(0) input:eq(0)').val();
											myAccProcContactCn= $('#myaccountList tbody tr:first').find('td:eq(0) input:eq(1)').val();
											myAccPreferedReseller= $('#myaccountList tbody tr:first').find('td:eq(0) input:eq(2)').val();
											ice.myaccount.populateEADetailsUI();
										}
									}
								}
								$('#myaccountList_wrapper').find('div.dataTables_scrollHeadInner table').css({'margin-left': '0pt','width': '614px'});
								$('#myaccountList_wrapper').find('div.dataTables_scrollBody table').css({'margin-left': '0pt','width': '614px'}); // removing horizontal scrollbar in IE7
								ice.myaccount.saveSelectedEA();
								ice.myaccount.adjustHeight();
							},
							"fnRowCallback":function(nRow,aData,iDisplayIndex, iDisplayIndexFull){								
								$(nRow).find('td:nth-child(3)').html(vmf.wordwrap(aData[2],2));		
								preText='<input type="hidden" name="myAccountIdOne[]" id="myAccountIdOne_'+(parseInt(iDisplayIndex,10)+1)+'" value="'+aData[5]+'"><input type="hidden" name="myAccountIdTwo[]" id="myAccountIdTwo_'+(parseInt(iDisplayIndex,10)+1)+'" value="'+aData[6]+'"><input type="hidden" name="myAccountIdThree" id="myAccountIdThree_'+(parseInt(iDisplayIndex,10)+1)+'" value="'+aData[7]+'">';
								if(aData[0].length){
									$(nRow).find('td:eq(0)').html(preText+'<span class="hidden">'+aData[0]+'</span><img width="16px" src="/static/myvmware/common/img/dot.png" title="'+default_img_title+'"/>').addClass('center');
									_defaultAccountFlag = "yes";
									myAccNumber = vmf.unwrap(aData[2]);
									myAccName = aData[1];
									myAccItAdmin = aData[3];
									myAccProcContact = aData[4];
									myAccItAdminCn= aData[5];
									myAccProcContactCn= aData[6];
									myAccPreferedReseller= aData[7];
								} else {
									$(nRow).find('td:eq(0)').html(preText);
								}
								return nRow;
							},
							"bPaginate": false,
							"sPaginationType": "full_numbers"
						});
						$('#loading').hide();
					}
				} catch (err) {
					$('#loading').html('No data available');
					$('#loadingDetails').html('No data available in details pane');
				}
			},//success ends here
			error: function (statusError, msgtext) {
				if (msgtext == "parsererror") {
					$('#errorMyAccount').replaceWith('<span id="errorMyAccount">'+ice.globalVars.parseError+'</span>');
					vmf.modal.show("ErrorMyAccountPopup");
				}
			}
		});
		//ice.myaccount.dettachDefaultAccount();
		$(".modalContent .fn_cancel").click(function () {
			vmf.modal.hide();
			$('.modalContent .button').uncorner();
			return false;
		});
		/*	Donot delete this code, might required in future - commneted for BUG-00032180 - CR 353 - rvooka
$("#changePRLink").click(function () {
			$('#changePartnerHeader').text("Change Preferred Renewals Partner");			
			if(!$(this).hasClass('dummyClick')){
				CountryCodeAfterChange='US';
				//country code need to update if in myaccount page right panel had some value under preffered partner details
				if(defaultCountryCodePOPUP!=""){CountryCodeAfterChange=defaultCountryCodePOPUP;}
				//ends here
				ice.myaccount.loadCountry();
				ice.myaccount.loadState();				
				//vmf.modal.show("changePreferredPartnerContent2");
				vmf.modal.show("changePreferredPartnerContent2",{onShow: function (dialog) {
						$('.mfilter a').toggle(function(){$('.mfilter a').html($('.mfilter a').html().replace('- Collapse','+ Expand'));$('.partnerSearchArea').slideUp();return false;},
						function(){$('.mfilter a').html($('.mfilter a').html().replace('+ Expand','- Collapse'));$('.partnerSearchArea').slideDown();return false;})
					}
				});	
				$('.partnerDiv .partnerSearchArea .partnerNameInput').css({'float': 'right','width': '267px'});
				$("#pref11").attr('checked',true);
					return false;
					$.ajax({
						type: 'POST',
						url: searchPartnersURL,
						success: function (data) {
						try {
							var _jsonResponse = vmf.json.txtToObj(data);
							//var partnerList = _jsonResponse.partnerList;
							var _jsonLength = _jsonResponse.length;
							var _jsonStr = "<tbody>";
							for(i=0;i<_jsonLength;i++)
							{
								_jsonStr +='<tr><td class="vspace2 w20"><input type="radio" name="partner1" value='+_jsonResponse[i].partySiteId+'></td><td class="vspace2 label">'+_jsonResponse[i].partnerName+'<p> '+_jsonResponse[i].addressLine1+', '+_jsonResponse[i].city+', '+_jsonResponse[i].province+', '+_jsonResponse[i].country+'</p></td><td></td></tr>';       							
							}
							_jsonStr += '</tbody>';
							$("#partnerTable").html(_jsonStr);
							$("#loadingPartner").hide();
						} catch (err) {
							$('#loadingPartner').html('No partners match the search criteria. Change the search and try again.');
						}
					},
					error: function (statusError, msgtext) {					
						if (msgtext == "parsererror") {
							$('#errorMyAccount').replaceWith('<span id="errorMyAccount">Parse Error..Please try it again</span>');
							vmf.modal.show("ErrorMyAccountPopup");
						}
					}
				});
			}
			else {
				$('.dropdown').hide();
				return false;
			}
		});*/
		//***************************************added code for find partner***********************//
		$(document).keypress(function(e) {
			if(e.keyCode == 13){
				if($('input:radio[id=pref11]').is(':checked') == true){ 
					if($('input:radio[name=partner1]').is(':checked') == true)
						ice.myaccount.RPsaveBtn();
					else  
						ice.myaccount.renewelsPartnerSearch();	
				}
				else if($('input:radio[id=pref12]').is(':checked') == true) 
					ice.myaccount.RPsaveBtn();			
			}	   
		});
		$(".findBtn").click(function () {ice.myaccount.renewelsPartnerSearch();});
		$('.partnerDiv #partnerName').keypress(function(e){
				if(e.which == 13){
					$(".partnerDiv .findBtn").trigger('click');
				}
		 });
		//**************************************ends here********************************************//			
		//**********************************add for activate save button*****************************//
		$(".partnerListData").live('click',function(){partnerNameAfterSearch=$(this).attr('partnerName');});//this will print the partner name	
		//*******************************************ends here**************************************//				
		$('#saveButton').click(function(){
			//ice.myaccount.RPsaveBtn();
			ice.myaccount.savePartnerPreference();
			return false;
		});
		
		/*Resizing Panes CR Start*/
		vmf.splitter.show('mySplitter',{
			type: "v",
			sizeLeft:true,
			resizeToWidth: true,
			outline:true,
			minLeft: parseInt($("#myaccountList").width()*.8,10),
			minRight: parseInt($("#accountDetails").width()*.8,10),
			maxLeft: parseInt($("#myaccountList").width(),10)+ parseInt($("#accountDetails").width()*.2,10),
			maxRight: parseInt($("#accountDetails").width(),10) + parseInt($("#myaccountList").width()*.2,10),
			barWidth:false
		});
		/*Resizing Panes CR End*/	
			
	},// init ends here
	/*RPsaveBtn : function(){
		if($("#pref12").attr('checked')==true)
			ice.myaccount.VmwareSelectPartner();
		else if($("#pref11").attr('checked')==true)		
		ice.myaccount.savePartnerPreference();				
	},*/
	renewelsPartnerSearch : function(){
		var _dataObj = new Array();
		$("#PartnerTotalCount").html("");
		$(".PartnerErrorMsg").remove();
		$("#partnerName").css("border","none");
		/***********get input values***************/
		var _partnerName=$("#partnerName").val();
		var _partnerCountry=$("#partnerCountry").val();
		var _partnerState=$("#partnerState").val();
		//var _partnerID=$("#state").val();
		var _cnt = 0;
		/************check for empty input values*********/
		if(_partnerCountry==""){
			$("#partnerCountry").focus();
			$("#partnerCountry").css("border","1px solid red");
			_cnt = _cnt+1;
		}
		else if(_partnerCountry=="US" || _partnerCountry=="CA"){
			if(_partnerState==""){
				$("#partnerState").focus();
				$("#partnerState").css("border","1px solid red");
				$('#partnerStateErrorMsg').show().html(ice.globalVars.selectStateWithStar);
				_cnt = _cnt+1;
			} else {
				$("#partnerState").css("border","");
				$('#partnerStateErrorMsg').hide().html('');
			}
		}
		if(_partnerName==""){
			$("#partnerName").focus();$("#partnerName").css("border","1px solid red");
			$('#partnerNameErrorMsg').show().html(ice.globalVars.enterPartnerName);
			_cnt = _cnt+1;
		} else {
			$('#partnerNameErrorMsg').hide().html('');
			$("#partnerName").css({'border': '#E2E9EF 1px solid','border-top':'#AAADB2 1px solid'});
		}
		$('div.errmsg').css({'margin-left':'216px'});
		if(_cnt==0){
			$('.section-wrapper .column.h427').css({'height':'427px'});
			$("#simplemodal-container").css('top','0px'); //Fix for BUG-00019359
			$('#searchPartnerRender').slideDown('slow');
			$("#partnerName").removeAttr('style');
			$("#partnerCountry").css("border","1px solid #747474");
			$("#PartnerTotalCount").html("");
			$(".PartnerErrorMsg").remove();
			//$("#partnerName").css("border","none");
			/***********show loading image**************/
			$("#partnerTable").html("");
			$("#loadingPartner").show();
			/***************craete a array of post values************/ 
			_partnerName = $("#partnerName").val();
			_partnerCountry = $("#partnerCountry").val();
			_partnerState = $("#partnerState").val();
			$("#partnerName1").val(_partnerName);
			$("#partnerCountry1").val(_partnerCountry);
			$("#partnerState1").val(_partnerState);
			var _postDataUrl = $("#changePartnerForm").serialize();
			var _postDataUrl = searchPartnersURL +'&' + _postDataUrl;
			vmf.ajax.post(_postDataUrl, null, ice.myaccount.onSuccessLoadParner, ice.myaccount.onFailLoadLoadParner);
			return false;
		}
	},
	initWrapper : function(){
		$('#loading').show();
		$('#accountDetails').hide();
		$('#loadingDetails, .accountsDetails .loading').show();
		$('#myaccountList_wrapper').replaceWith('<table id="myaccountList"><thead></thead><tbody></tbody></table>');
		ice.myaccount.init(loadEAListURLHolder,loadEADetails,loadChangeDefaultEA,contextPath,confirmUrl,deFaultHolder,accountNumberHolder,accountNameHolder,itAdmHolder,procContactHeaderHolder,selectedAccNumber,searchPartnersURL,countryUrl,stateUrl,changePreferredPartnerURL,removeUrl);
	},
	savePartnerPreference:function(){
		var _partnerId ='';
		$('#partnerTable').find('tr').each(function(){
			if($(this).find('td input[type=radio]').attr('checked')==true){
				_partnerId = $(this).find('td input[type=radio]').val();
			}
		});
		_savePartnerUrl = changePreferredPartnerURL+'&partnerId='+_partnerId;
		$('#loading').show();
		$.ajax({
			type: "POST",
			dataType: "",
			data:"changePartnerForm",
			url: _savePartnerUrl,
			success: function (data) {
				/***************added code**********/
				// try {
				ice.myaccount.populateEADetailsUI();
				//$("#preResellers").html(partnerNameAfterSearch);
				vmf.modal.hide();
				$('#loading').hide();
				/*****************ends here*******/
				//ice.myaccount.populateEADetailsUI();
			}
		});
	},//savePartnerPreference ends here
	populateEADetailsUI: function () { // Poplating my accountdetails when clicking
		$('#accountDetails').hide();
		ice.myaccount.adjustHeight();
		$('#loadingDetails, .accountsDetails .loading').show();
		//ice.myaccount.dettachDefaultAccount(); 
		//if ($('#myaccountList tbody tr').length > 1) { 
		if(loggedInUserCustomerNumber==myAccItAdminCn || loggedInUserCustomerNumber==myAccProcContactCn){
			//$('.settings-cog .dropdown ul li a#changePRLink').removeClass('dummyClick').parent('li').removeClass('inactive');
			$('#removeAccount').unbind('click');
			$('#removeAccount').addClass('dummyClick'); 
			$('#removeAccount').parent('li').addClass('inactive');
			ice.replaceITSUOrPU.attachLinks('changeITSULink','changeITPULink',ice.myaccount.initWrapper);
		}else{
			//$('.settings-cog .dropdown ul li a#changePRLink').addClass('dummyClick').parent('li').addClass('inactive');
			
			$('#removeAccount').removeClass('dummyClick'); 
			$('#removeAccount').unbind('click').bind('click',function () {
				ice.myaccount.populateRemoveAccountDialog();
				return false;
			});
		$('#removeAccount').parent('li').removeClass('inactive');		
			ice.replaceITSUOrPU.detachLinks('changeITSULink','changeITPULink');
		}

		var _notApplicable = 'N|A';
		var _url = loadEADetails;
		var _dataObj = {};
		// some change in data table hence swapped hence myAccName contains number and myAccNumber contains name
		_dataObj["param"]=myAccName;// some change in data table hence swapped
		_dataObj["accountName"]=myAccNumber;// some change in data table hence swapped
		selectedAccNumber = _dataObj["param"]; 
		// for loading the details for child eas
		$.ajax({
			type: 'POST',
			url: _url,
			dataType: 'json',
			data: _dataObj,
			success: function (event) {
				//this code assigning default values in popup
				defaultPartnerNamePOPUP=event.partnerNameTrimmed;
				defaultCountryCodePOPUP=event.preferredCountry;
				defaultStateCodePOP=event.preferredState;
				//ends here
				$('#loadingDetails, .accountsDetails .loading').hide();
				$('#accountDetails').show();
				if (myAccNumber != null) {
					//$("#accountNumber").replaceWith('<span id="accountNumber" style="word-wrap: break-word" >' + myAccNumber + 'SOmetextgoeshereSOmetextgoeshereSOmetextgoeshere</span>');
					$("#accountNumber").html(myAccNumber);
				}
				if (myAccName != null) {
					$("#accountName").html(myAccName);
				}
				if (myAccItAdmin != '') {
					$("#itAdmin").replaceWith('<div id="itAdmin"  class="accountFieldName" style="word-wrap: break-word">' + myAccItAdmin + '</div>');
				} else {
					$("#itAdmin").replaceWith('<div id="itAdmin"  class="accountFieldName" style="word-wrap: break-word">' + _notApplicable + '</div>');
				}
				if (myAccProcContact != '') {
					$("#procurementContact").replaceWith('<div id="procurementContact"  class="accountFieldName" style="word-wrap: break-word">' + myAccProcContact + '</div>');
				} else {
					$("#procurementContact").replaceWith('<div id="procurementContact"  class="accountFieldName" style="word-wrap: break-word">' + _notApplicable + '</div>');
				}
				myAccPreferedReseller = event.preferredData;
				if (myAccPreferedReseller != '' && myAccPreferedReseller != undefined) { //BUG-00025367
					myAccPreferedResellerExp	=	/[\n]/g;
					myAccPreferedReseller = myAccPreferedReseller.replace(myAccPreferedResellerExp, "<br />");
					//$("#preResellers").replaceWith('<div id="preResellers" class="accountFieldName">' + myAccPreferedReseller + '</div>');
				} else {
					//$("#preResellers").replaceWith('<div id="preResellers" class="accountFieldName">' + _notApplicable + '</div>');
				}
				//var _responseData = vmf.json.txtToObj(event);
				// var _responseData = vmf.json.txtToObj(event);
				if(event.error){
					ice.replaceITSUOrPU.detachLinks('changeITSULink','changeITPULink');
					$('#errorMyAccount').replaceWith('<span id="errorMyAccount">'+ event.message +'</span>');
					vmf.modal.show("ErrorMyAccountPopup");
				}else{
					var chkTrue	= "true";
					var isAllow = event.isAllowed;
					//BUG-00025367
					//BUG-00025356 defect fix
					if(typeof(isAllow)!='undefined'){ 
						if(isAllow == "false"){
							$('div.accountsDetailsHeader').next().hide();
							$('div.accountSubField').hide();
						}else{
							if ($('#myaccountList tbody tr').length > 0) { 
								$('div.accountsDetailsHeader').next().show();
								$('div.accountSubField').show();
								//$('.settings-cog .dropdown ul li a#changePRLink').removeClass('dummyClick').parent('li').removeClass('inactive'); // BUG-00032180
								ice.replaceITSUOrPU.attachLinks('changeITSULink','changeITPULink',ice.myaccount.initWrapper);
							}
						}
					}
					if($('.accountsDetailsHeader').outerHeight(true) <= 45){
						$detHeader = $('.accountsDetailsHeader').outerHeight(true) - 1;
					}else{
						$detHeader = $('.accountsDetailsHeader').outerHeight(true);
					}
					var _height = $('section.accountsSummary').outerHeight(true)- $detHeader;
					$('.accountFieldSection').height(_height);                    
				}
				ice.myaccount.adjustHeight();
			}, //End of sucess
			error: function (statusError, msgtext) {
				if (msgtext == "parsererror") {
					$('#errorMyAccount').replaceWith('<span id="errorMyAccount">'+ice.globalVars.parseError+'</span>');
					vmf.modal.show("ErrorMyAccountPopup");
				}
			}
		});
	},//populateEADetailsUI ends here
	attachDefaultAccount : function(){
		$('#changeDefaultAccount').unbind('click').bind('click',function () { //Unbind event just ot make sure BUG-00025366
			ice.myaccount.populateChangeDefaultAccount();
			return false;
		});
		$('#updateDefaultUserBt').unbind('click').bind('click',function () {
			ice.myaccount.updateDefaultUser();
			return false;
		});
		$('#changeDefaultAccount').removeClass('dummyClick'); 
		$('#changeDefaultAccount').parent('li').removeClass('inactive');		
		
		$('#removeAccount').removeClass('dummyClick'); 
		$('#removeAccount').parent('li').removeClass('inactive');		
		$('#removeAccount').unbind('click').bind('click',function () {
			ice.myaccount.populateRemoveAccountDialog();
			return false;
		});
		$('#removeUserBt').unbind('click').bind('click',function () {
			ice.myaccount.removeUser();
			return false;
		});

		},//attachDefaultAccount ends here
	dettachDefaultAccount : function(){  		
		$('.settings-cog .dropdown ul li a#changeDefaultAccount').addClass('dummyClick').parent('li').addClass('inactive');
		//$('#changeDefaultAccount').parent('li').addClass('inactive');
		$('#changeDefaultAccount').unbind('click');
		$('#updateDefaultUserBt').unbind('click');
		
		$('.settings-cog .dropdown ul li a#removeAccount').addClass('dummyClick').parent('li').addClass('inactive');
		$('#removeAccount').unbind('click');
		$('#removeUserBt').unbind('click');
	},
	populateRemoveAccountDialog: function()
	{
		var vals = ["<strong>"+myAccName+"</strong>","<strong>"+myAccNumber+"</strong>"]
		$("#removeAlertLabel").html("<p>"+myvmware.common.buildLocaleMsg(ice.globalVars.removeAccFrmList,vals)+"</p>");
		if ($('#myaccountList tbody tr').length ==1 )
		{
			$('#logoutWarning').show();
		}
		else{
			$('#afterRemove').unbind('click').bind('click',function () {
				vmf.modal.hide("removeAccountContent");
				location.reload();
			});
			$('#logoutWarning').hide();
		
		}
		$('#removeUserBt').unbind('click').bind('click',function () {
			$("#remAcct").hide();
			$("#loadingRemoveUser").show();
			ice.myaccount.removeUser();
			return false;
		});
		vmf.modal.show('removeAccountContent',{close:false});
		if(typeof(riaLinkmy) == 'function'){
            riaLinkmy("account-summary : remove-account");
        }
	},
	postDataProcessing: function(){
		ice.myaccount.setActiveRow();
	},
	setActiveRow: function(){
		if(!$('#myaccountList tbody tr td:first-child').find('img').length){
			$('#myaccountList tbody tr td:eq(0)').addClass('center').append('<img width="16px" src="/static/myvmware/common/img/dot.png" title="'+default_img_title+'"/>');
		}
		var tds = $('#myaccountList tbody tr:first').find('td');
		$('#myaccountList tbody tr:first').addClass('selected');
		                                    //********* Replace with unwrap code
		myAccNumber = vmf.unwrap($.trim(tds[2].innerHTML)); // account number and name need to swap in controller
		                                    //********* Replace with unwrap code upto here
		myAccName = $.trim(tds[1].innerHTML); // account number and name need to swap in controller
		myAccItAdmin = $.trim(tds[3].innerHTML);
		myAccProcContact = $.trim(tds[4].innerHTML);
		myAccItAdminCn= $('#myaccountList tbody tr:first').find('td:eq(0) input:eq(0)').val();
		myAccProcContactCn= $('#myaccountList tbody tr:first').find('td:eq(0) input:eq(1)').val();
		myAccPreferedReseller= $('#myaccountList tbody tr:first').find('td:eq(0) input:eq(2)').val();
		ice.myaccount.populateEADetailsUI();
	},
	populateChangeDefaultAccount: function () {
		var _changedefaultaccurl = loadChangeDefaultEA;
		$.ajax({
			type: 'POST',
			url: _changedefaultaccurl,
			success: function (data) {
				var _strhtml = "";
				try {
					var _ealistresponse = vmf.json.txtToObj(data);
					var _ealist = _ealistresponse.eaList;
					var _lengthofealist = _ealist.length;
					if (_lengthofealist > 1) {
						//$('#changeDefaultAccount').parent().parent().css('background', '#FFFFFF');
						var _defaultname = _ealistresponse.defaultName;
						var _defaultnum = _ealistresponse.defaultNumber;
						if (_defaultnum != null && _defaultname != null) {
							$('#label').html(_defaultnum + ' ' + _defaultname);
						} else {
							$('#label').html('N|A' + ' ' + 'N|A');
						}
						if (_ealist != null) {
							_strhtml += '<select id="selectedEAList" class="wide">';

							for (i = 0; i < _lengthofealist; i++) {
								_eaname = _ealist[i].eaName;
								_eanum = _ealist[i].eaNumber;
								if (_eaname==_defaultname && _eanum == _defaultnum){
									_strhtml += '<option value=' + _eanum + ' class="textStrong">' + _eanum + '  ' + _eaname + '</option>';
								} else{
									_strhtml += '<option value=' + _eanum + '>' + _eanum + '  ' + _eaname + '</option>';
								}
							}
							_strhtml += '</select>';
							$('#eaListData').html(_strhtml);
						}
						vmf.modal.show('changeDefaultAccountContent',{onShow: function (dialog) {
							$(".overlayOpts").remove();
							if(vmf.dropdown && $("select#selectedEAList").length && $("select#selectedEAList").find("option").length>0){
								vmf.dropdown.build($("select#selectedEAList"), {optionsDisplayNum:20,ellipsisSelectText:false,ellipsisText:'',optionMaxLength:37,inputMaxLength:37,position:"left",optionsClass:'overlayOpts',optionsHolderInline:true});
							}
						}});
						
					} 
				} catch (err) {
					$('#eaListData').html(ice.globalVars.unableToLoad);
				}
				if(typeof(riaLinkmy) == 'function'){
            		riaLinkmy("account-summary : change-default-account");
        		}
			},
			error: function (statusError, msgtext) {
				if (msgtext == "parsererror") {
					vmf.modal.show("ErrorMyAccountPopup");
				}
			}
		});
	},//populateChangeDefaultAccount  ends here
	updateDefaultUser: function () {
		var _number = $('#selectedEAList').val();
		var _param = '&param=' + _number;
		$.ajax({
			type: 'POST',
			url: confirmUrl,
			dataType: '',
			data: _param,
			success: function (event) {
				var _jsonResponse = vmf.json.txtToObj(event);			
				if(_jsonResponse.error) {
					vmf.modal.hide();
					$('#errorMyAccount').replaceWith('<span id="errorMyAccount">' +_jsonResponse.message +'</span>');										
					setTimeout(function() { vmf.modal.show("ErrorMyAccountPopup"); },500);
				} else {
					location.reload();
				}
				if(typeof(riaLinkmy) == 'function'){
            		riaLinkmy("account-summary : change-default-account : confirm");
        		}
			},
			error: function (statusError, msgtext) {
				vmf.modal.hide();
				if (msgtext == "parsererror") {
					$('#errorMyAccount').replaceWith('<span id="errorMyAccount">'+ice.globalVars.parseError+'</span>');
					vmf.modal.show("ErrorMyAccountPopup");
				}
			}
		});
	},//updateDefaultUser ends here
	removeUser: function () {
		//riaLinkmy('my-account : remove-account');
        var _postData = '&param=' + myAccName;
		vmf.ajax.post(removeUrl,_postData,ice.myaccount.onSuccessRemoveAcct,ice.myaccount.onFailRemoveAcct);	
	},
	onSuccessRemoveAcct: function(data){
		var _jsonResponse = vmf.json.txtToObj(data);			
		if(_jsonResponse.error) {
			vmf.modal.hide();
			$('#errorMyAccount').html(_jsonResponse.message);					
			setTimeout(function() { vmf.modal.show("ErrorMyAccountPopup"); },500);
		}
		else
		{
			if($('#myaccountList tbody tr').length==1){
				window.location="/c/portal/logout";
			}
			else{
				var vals = ["<strong>"+myAccName+"</strong>","<strong>"+myAccNumber+"</strong>"]
				$("#confirmationMsg").html("<p>"+myvmware.common.buildLocaleMsg(ice.globalVars.accRemoved,vals)+"</p>");
				$("#loadingRemoveUser").hide();
				$("#remConf").show();	
			}	
		}
		if(typeof(riaLinkmy) == 'function'){
            riaLinkmy("account-summary : remove-account : confirm");
        }
	},
	onFailRemoveAcct: function(statusError, msgtext){
		vmf.modal.hide();
        if (msgtext == "parsererror") {
            $('#errorMyAccount').html(ice.globalVars.parseError);
            vmf.modal.show("ErrorMyAccountPopup");
        }
	},
	loadCountry: function()	{
		$('#partnerCountry').html('<option val="">'+loadingURL+'</option>');
		var _strHTML = '';
		$.ajax({
			type: 'POST',
			url: countryUrl,
			success: function (event) {
				var _jsonResponse = vmf.json.txtToObj(event);
				_strHTML += '<option value="" selected="selected">'+ice.globalVars.selectCountry+'</option>';
				for(i=0;i<_jsonResponse.length;i++){
					//if(_jsonResponse[i].isoCountryCode=="US"){
					if(_jsonResponse[i].isoCountryCode==defaultCountryCodePOPUP){
						_strHTML += '<option value="'+_jsonResponse[i].isoCountryCode+'" selected="selected">'+_jsonResponse[i].description+'</option>';
					}else{
						_strHTML += '<option value="'+_jsonResponse[i].isoCountryCode+'">'+_jsonResponse[i].description+'</option>';
					}
				}
				$('#partnerCountry').html(_strHTML);
			},
			error: function (statusError, msgtext) {
				vmf.modal.hide();
				if (msgtext == "parsererror") {
					$('#errorMyAccount').replaceWith('<span id="errorMyAccount">'+ice.globalVars.parseError+'</span>');
					vmf.modal.show("ErrorMyAccountPopup");
				}
			}
		});
	},//loadCountry ends here
	loadState: function()	{
		var _strHTML = '';
		$("#partnerName").val(defaultPartnerNamePOPUP); //BUG-00031299
		$('#partnerState').html('<option val="">'+loadingURL+'</option>');
		var countryId = $("#country").val();
		if(CountryCodeAfterChange!="" && countryId!="")
		{
			var _stateUrlWithAgrs = stateUrl+"&countryCode="+CountryCodeAfterChange;
			$.ajax({
				type: 'POST',
				url: _stateUrlWithAgrs,
				success: function (event) {
					var _jsonResponse = vmf.json.txtToObj(event);
					_strHTML += '<option value="">Select a state or province</option>';
					for(i=0;i<_jsonResponse.length;i++){
						if(defaultStateCodePOP!="" && _jsonResponse[i].state==defaultStateCodePOP){var fetchedStateCode=defaultStateCodePOP;var selectedDefault="selected";}
						else{fetchedStateCode=_jsonResponse[i].state; selectedDefault="";}
						_strHTML += '<option value="'+fetchedStateCode+'">'+_jsonResponse[i].description+'</option>';
					}
					$('#partnerState').html(_strHTML);
					$('#partnerState option[value=' + defaultStateCodePOP + ']').attr('selected', 'selected'); //BUG-00031299
				},
				error: function (statusError, msgtext) {
					vmf.modal.hide();
					if (msgtext == "parsererror") {
						$('#errorMyAccount').replaceWith('<span id="errorMyAccount">'+ice.globalVars.parseError+'</span>');
						vmf.modal.show("ErrorMyAccountPopup");
					}
				}
			});
		}else{
			_strHTML = '<option value="">'+ice.globalVars.selectState+'</option>';
			$('#partnerState').html(_strHTML);
		}
	},//loadState  ends here
	VmwareSelectPartner:function(){
		var _dataObj = new Array();
		_dataObj["partnerID"]=0;			
		var partnerID=0;
		$.ajax({
			type: 'POST',
			url: changePreferredPartnerURL +'&partnerId = '+partnerID,
			data: "",
			success: function (data) {
				ice.myaccount.populateEADetailsUI();
				vmf.modal.hide();
				$('#loading').hide();
			}
		});
	},
	onSuccessLoadParner: function (data) {				
		try {
			var _jsonResponse = vmf.json.txtToObj(data);
			var _jsonLength = _jsonResponse.length;
			$("#PartnerTotalCount").html('('+_jsonResponse.length+')');
			var _jsonStr = "<tbody>";
			if(_jsonLength>0){
				for(i=0;i<_jsonLength;i++){
					if(_jsonResponse[i].partySiteId!=null){
						patId=_jsonResponse[i].partySiteId;
					}else{
						patId="";
					}
					_jsonStr +='<tr><td class="vspace2 w20"><input id="partnerDetails" type="hidden" name="partnerDetails" value="'+patId+'"><input type="radio" value="'+patId+'" partnerName="'+_jsonResponse[i].partnerName+'"  name="partner1" class="partnerListData"></td><td class="vspace2 label">'+_jsonResponse[i].partnerName+'<p> '+_jsonResponse[i].addressLine1+', '+_jsonResponse[i].city+', '+_jsonResponse[i].province+', '+_jsonResponse[i].country+'</p></td><td></td></tr>';       							
				}
				_jsonStr += '</tbody>';
				$("#partnerTable").html(_jsonStr);
				$("#loadingPartner").hide();
			}
			else{
				$('#loadingPartner').html(ice.globalVars.noMatches);
			}
		} catch (err) {
			$('#loadingPartner').html(ice.globalVars.noMatches);
		}
	},//onSuccessLoadParner  ends here
	onFailLoadLoadParner: function (statusError, msgtext) {
		if (msgtext == "parsererror") {
			$('#errorMyAccount').replaceWith('<span id="errorMyAccount">'+ice.globalVars.parseError+'</span>');
			vmf.modal.show("ErrorMyAccountPopup");
		}
	},
	saveSelectedEA: function() {
		var _dataObj = {};
		_dataObj[eaNumberSelectedByUserParamName]=myAccName; //being swapped as it is stored other way around
		_dataObj[eaNameSelectedByUserParamName]=myAccNumber;
		
		vmf.ajax.post(eaSelectorSelectionSaveURL,
						_dataObj, 
						ice.myaccount.onSuccess_eaSelectionSave,
						ice.myaccount.onFail_eaSelectionSave); //*Call is asynchronous**
	},
	onSuccess_eaSelectionSave: function(data) {
		//Placeholder for success
	},
	onFail_eaSelectionSave:function(data) {
		//Placeholder for failure
	},
	adjustHeight: function(){
		myvmware.common.adjustPanes();
		var cHeight = ($("#content-section").height() > parseInt($("#content-section").css("min-height")))? parseInt($("#content-section").css("min-height")) : $("#content-section").height();
		var panesHeight = $("section.column").height()+(cHeight-$("section.portlet",$("#content-section")).height());
		panesHeight = (panesHeight>550)? panesHeight: 550;
		var dtHt = panesHeight-($(".supportOrderDetailsHeader").outerHeight(true)+$(".dataTables_scrollHead").outerHeight(true));
		$("section.column,#mySplitter").height(panesHeight + "px");
		var tableHeight = panesHeight-($(".supportOrderDetailsHeader").outerHeight(true)+ $("#myaccountList_wrapper .dataTables_scrollHead").outerHeight(true));
		$("#myaccountList_wrapper .dataTables_scrollBody").height(tableHeight);
		$(".splitter-bar-vertical",$("#mySplitter")).css("top",$("#accountDetails header").outerHeight(true)+"px");
		$("#accountDetails .accountFieldSection, #mySplitter .splitter-bar-vertical").height((panesHeight-$("#accountDetails header").outerHeight(true))+"px");
	}
};
window.onresize=ice.myaccount.adjustHeight;

/*Word Unwrap function*/
vmf.unwrap= function(text){

                return text.replace(/\<wbr\>\<span\ class\=\"wbr\"\>\<\/span\>/g,'');

};
