if ( typeof myvmware == "undefined"){
	myvmware = {};
}
// Create an object for ELA Applications
myvmware.ela = {};
/**
 * @class Holds all myvmware.ela.ResearchAccounts functionality
 * @name myvmware.accounys.Reports
 * @description performs all the functionality for Reports Module
 *
 */
myvmware.ela = {
	
	CONST_OBJ : {
		'empty' : ela.globalVar.empty,
		'primaryKeyMessage' : ela.globalVar.primaryKeyMessage,
		'emptyTable' : ela.globalVar.emptyTable,
		'errorLoadingDt' : ela.globalVar.errorLoadingDt,
		'processing' : ela.globalVar.processing,
		'ellipses' : '...',
		'resEaDt' : 'researchEaDataTable',
		'savedRelDt' : 'savedRelationshipDataTable',
		'selectPriKey' : ela.globalVar.selectPriKey,
		'selectOppQuote' : ela.globalVar.selectOppQuote,
		'loadingTable' : ela.globalVar.loadingTable,
		'selectAccts' : ela.globalVar.selectAccts,
		'easSearchLimit' : ela.globalVar.easSearchLimit,
		'accountSearchLimit' : ela.globalVar.accountSearchLimit,
		'selectPrimary' : ela.globalVar.selectPrimary,
		'noRecords' : 'No Records Found. Please try with different AccountId/EA(s)',
		'enable' : 'enabled',
		'listItem' : 'LISTITEM',
		'inputItem' : 'INPUTITEM',
		'search' : 'Enter search string here',
		'eaNosAlert' : 'You have reached max. limit count of 15 for EA. Please remove and submit.',
		'sfdcNosAlert' : 'You have reached max. limit count of 15 for Account No. Please remove and submit.',
		'alreadyAvailable' : 'EA number already exists. Please try adding other EA numbers ',
		'groupCount' : {
			'sfdc' : 1,
			'ea' : 1,
			'maxCount' : 15
		}
	},
	EMPTY_STRING : '',

	/* Object mapping with "eaResearchDtColNames". Note the key names from "eaResearchDtColNames"
	 should match with "eaResearchDtColNamesMapping" object */
	/* ---------------------------- Initialization of All the ELA Modules on Load ------------------------------------------*/
	init : function() {
		var that = myvmware.ela;
		if ($('#researchAcctContainer')[0]) {
			that.attachEventListeners();
			// Initializing the Account Lookup Modal Window 
			that.attachAccountEventListeners();
			$('#accountLookupContainer .addToListButton, #accountLookupContainer .deleteAccountButton').addClass('disabled').attr('disabled', true);
		}
	},
	savedEAlookup : function(res){
		return '<li><span class="inputEl"><input type="radio" name="accountLookUpName"  value="'+res.id+'" class="accountLookUpName"/></span><span  class="accountNameLook accountSerchNumber">' + res.id + '</span><span class="accountNumberLook accountSerchName">' +  res.name + '</span></li>';
	},
	
	/* -------------------------- Attach Event Listeners to All the Elements in 'researchAccountsForm' --------------------*/
	attachEventListeners : function() {
		var that = myvmware.ela;
		/*if (!$('#researchAccountsForm .accountNumber .input-field').attr('readonly')) {
			$('#researchAccountsForm .researchAccBtn').addClass('disabled').attr('disabled', true);
		} else {
			$('#researchAccountsForm .researchAccBtn').removeClass('disabled').attr('disabled', false);
		}*/
		
		// For Testing empty input Field to enable/disable the researchAccBtn button
		$('#researchAccountsForm .researchAccBtn').live('click', function() {
			that.createDataTable(that.CONST_OBJ['resEaDt'], ela.globalVar.getResultsUrl);
		});
		
		$('#researchAcctContainer').find('.del').live('click', function() {
			var inputArrlen = $(this).closest('.rowscontainer').find('.input-field').length;
			
			if(inputArrlen === 1){
				$(this).closest('.rows').find('.input-field').val('');
				$(this).closest('.rows').find('.radiogrp').removeClass('checked');
				$(this).closest('.rows').find('.primaryKeyMessage').hide();
				$('.researchAccBtn').addClass('disabled').attr('disabled',true);
			}else{
				$(this).closest('.rows').remove();
			}
			
			return false;
		});

		$('#researchAcctContainer .radiogrp').live('click', function() {
			var $this = $(this), 
				$inputEl = $(this).parent('.rows').find('.input-field'), 
				$selectedRadio = $this.parent('.rows').find('.radio-primarykey');

			if ($inputEl.val() === that.EMPTY_STRING || $inputEl.val() === that.CONST_OBJ['empty']) {
				$inputEl.val(that.CONST_OBJ['empty']);
				$selectedRadio.attr('checked', false);
				$this.removeClass('checked');
			} else {
				$('#researchAccountsForm .radiogrp').removeClass('checked');
				$('#researchAccountsForm .radio-primarykey').attr('checked', false);
				$('#researchAccountsForm').find('.primaryKeyMessage').hide();
				$this.addClass('checked');
				$selectedRadio.attr('checked', true);
				$this.parent('.rows').find('.primaryKeyMessage').show().html(that.CONST_OBJ['primaryKeyMessage']);
			}
		});
		$('#manageSavedEAForm .input-field').live('focus', function() {
			var inputVal = $(this).val();
			//console.log(inputVal);
			if (inputVal === 'Please enter a value') {
				$(this).val(that.EMPTY_STRING);
			}
		});
		$('.researchAccountsForm .input-field, #manageSavedEAForm .input-field').live('blur', function() {
			var inputVal = $(this).val();
			//console.log(inputVal);
			
			if (inputVal === that.EMPTY_STRING) {
				$(this).val('Please enter a value');
			}
		});

		//tabs functionality start  here
		$('#researchAcctContainer .tabbed_area').each(function() {
			var $this = $(this), content_show;
			if ($this.children('.tabs').length > 0) {
				$this.children('.main-container-wrapper').hide();
				content_show = $this.children('.tabs').find('.active').attr('title')
				$('#' + content_show).show();
			}
		});

		$("#researchAcctContainer .tabbed_area a.tab").click(function() {
			$('.main-container-wrapper').hide();
			$this = $(this);
			$this.parents('.tabs:eq(0)').find(".active").removeClass("active");
			$this.addClass("active");
			$this.parents('.tabbed_area:eq(0)').children(".main-container-wrapper").hide();
			var content_show = $(this).attr("title");
			$("#" + content_show).show();
			return false;
		});

		//tabs functionality end  here
		$('#manageSavedEAForm').find('.savedRelTypeCont input').live('keyup', function() {
			var sresult,
				sendData = {},
				secVal,
				$parentSelector = '#manageSavedEAForm',
				$ajaxfireBtn = $('.ajaxfire',$parentSelector),
				inputVal = $.trim($(this).val());
				
			if (inputVal !== that.EMPTY_STRING && inputVal !== that.CONST_OBJ['empty']) {
				if($('#manageSavedEAForm .loading_small').is(':visible')){
					return;
				}
				$ajaxfireBtn.removeClass('disabled').removeAttr('disabled');
			} else {
				$ajaxfireBtn.addClass('disabled').attr('disabled',true);
			}
		});


		$('.ajaxfire','#manageSavedEAForm').live('click', function() {
				var sresult,
				sendData = {},
				secVal,
				$parentSelector = '#manageSavedEAForm',
				$ajaxfireBtn = $('.ajaxfire',$parentSelector),
				inputVal = $.trim($(this).val());
					if($('#manageSavedEAForm .loading_small').is(':visible')){
						return;
					}
					secVal = $('.savedRelSecTypeCont input').val();
					if (secVal == that.CONST_OBJ['empty']) {
						secVal = that.EMPTY_STRING;
					}
					sresult = {
						'selectedAccountType' : $('#savedRelAccountIdorNo').val(),
						'selectedAccountId' : $('.savedRelTypeCont input').val(),
						'selectedCriteria' : $('#savedRelSecAccountIdorNo').val(),
						'selectedCriteriaValue' : secVal,
						'profile' : $('#savedRelProfile').val()
					};
					
					$('<div class="loading_small clearfix">Loading...</div>').appendTo('#manageSavedEAForm');
					sendData['jsonData'] = vmf.json.objToTxt(sresult);
					$ajaxfireBtn.addClass('disabled').attr('disabled',true);
					$('.publishEaBtn').addClass('disabled').attr('disabled',true);
					$('.relationSearch', $parentSelector).die().addClass('disabled');
					$(".relationSearchContent", $parentSelector).html(that.EMPTY_STRING);
					$('#savedRelationshipDataTableCont').html(that.EMPTY_STRING);
					$('.relationSearchNoRecords').hide();
					$('.savedStatus, .savedRelationshipDataTableActions').hide();
					$('.relationSearch', $parentSelector).hide();
					vmf.ajax.post(ela.globalVar.getRelationshipsUrl, sendData, function(data) {
						var responseData = data.relationshipsList,
							accountType = $('#savedRelAccountIdorNo').val();
						
						$('#manageSavedEAForm .loading_small').remove();
						that.createRelationSearchMarkup(responseData, accountType);
					},function(){
						$(".relationSearchContent", $parentSelector).html(that.CONST_OBJ['noRecords']);
					});
				});

		$("#researchAccountsForm .expand a").click(function() {
			$("#researchAccountsForm .slide").slideToggle("slow", function() {
				$("#researchAccountsForm .expand a").toggleClass('close');
				if ($("#researchAccountsForm .expand a").hasClass('close')) {
					$('#researchAccountsForm .dataTables_scrollBody').removeClass('fixed');
					var maxHeight = $('#content-section').height() + 'px';
					$('#researchEaDataTableCont .dataTables_scrollBody').height(maxHeight);
				} else {
					$('#researchAccountsForm .dataTables_scrollBody').addClass('fixed');
				}
			});
			return false;
		});

		$(".deepSearch").die().live('change', function() {
			var flag = false;
			var $researchAccBtn = $('#researchAccountsForm .researchAccBtn');
			var inputArr = $('#researchAccountsForm').find('.input-field');
			inputArr.each(function(i, inputEl) {
				var inputVal = $(inputEl).val();
				if (inputVal !== that.EMPTY_STRING && inputVal !== that.CONST_OBJ['empty']) {
					flag = true;
				}
			});
			
			if (flag) {
				$('#researchAccountsForm .researchAccBtn').removeClass("disabled");
				$('#researchAccountsForm .researchAccBtn').removeAttr('disabled');
				$('#researchAccountsForm .researchAccBtn').live('click', function() {
					that.createDataTable(that.CONST_OBJ['resEaDt'], ela.globalVar.getResultsUrl);

				});
			}
		});

		if ($(".editable").length > 0) {
			var $thisInput = $('.editable'),
				parentNode = $thisInput.closest('.rows');
				
			parentNode.find('.primaryKeyMessage').show().html(that.CONST_OBJ['primaryKeyMessage']);
			parentNode.find('.radiogrp').addClass('checked');
			parentNode.find('.radio-primarykey').attr('checked', true);

			$('#researchAccountsForm .researchAccBtn').removeClass("disabled");
			$('#researchAccountsForm .researchAccBtn').removeAttr('disabled');
			$('#researchAccountsForm .researchAccBtn').live('click', function() {
				that.createDataTable(that.CONST_OBJ['resEaDt'], ela.globalVar.getResultsUrl);
			});
		}

		$(".saveEaNumber").change(function(){		
			$('#saveAccountsModalWindow').find('.comments').val('');
			//$('#oppQuote').attr("disabled",false);
			$('#selectOppQuote').val('opportunityId');
			$('.submitSavedEa').attr("disabled",true).addClass("disabled");
			if($(this).val() == 'Y'){
				$('#selectOppQuote').attr("disabled",false);
				$('#oppQuote').attr("disabled",false).val(ela.globalVar.opportunityId);
			}
			if($(this).val() == 'N'){
				$('#oppQuote').val('').attr("disabled",true)
				$('#selectOppQuote').attr("disabled",true);
			}			
							
	   });
		  
		  
	  //enabling submit button only when comments are available.
	  $('#saveAccountsModalWindow').find('.comments').live('keyup',function(){	
			var comments = $(this).val();
			$.trim(comments);			
			if((comments !== null || comments !== '') && (comments.length >= 10)){
				$('.submitSavedEa').removeClass("disabled").attr('disabled',false);
				that.showHideErrorMessageWindow();					
			}else{	
				$('.submitSavedEa').attr("disabled",true).addClass("disabled");
			}				
	  }); 
		
		//auto Suggest start here
		/*$('#researchAccountsForm').find('.input-field').each(function(i, inpEl) {
			var $el = $(this);
			if ($el.attr('readonly') === false && $el.hasClass('editable') === false) {
				that.autoSuggest($(inpEl), ela.globalVar.getEAListUrl);
			} else if ($el.hasClass('editable') === true) {
				that.autoSuggest($el, ela.globalVar.getEAListUrl, '', true);
				$('#researchAccountsForm .researchAccBtn').removeClass('disabled');
				$('#researchAccountsForm .researchAccBtn').die().live('click', function() {
					that.createDataTable(that.CONST_OBJ['resEaDt'], ela.globalVar.getResearchAccountsUrl);
				});
			}
		});*/

		that.autoSuggest($('#savedRelSecType'), ela.globalVar.getIDListUrl, $('#savedRelSecAccountIdorNo').val());

		$("#savedRelSecAccountIdorNo").change(function() {
			$('#manageSavedEAForm .savedRelSecTypeCont').empty().html('<input type="text" class="input-field primary" id="savedRelSecType" value="Please enter a value"/>');
			that.autoSuggest($('#savedRelSecType'), ela.globalVar.getIDListUrl, $('#savedRelSecAccountIdorNo').val());
		});
		
		//that.autoSuggest($('#savedRelType'), ela.globalVar.getSavedAccountsListUrl, $('#savedRelAccountIdorNo').val());
		
		$("#savedRelAccountIdorNo").change(function() {
			$('#savedRelType').val("Please enter a value");
		});
	
	/*-----------Saved Ea Lookup code -------START-------------*/
	$('#manageSavedEAForm .searchEaNames').live('click',function(){
			var primarySelection = $('#savedRelAccountIdorNo').val();
			vmf.modal.show('savedEaLookUpModal');
			$('#savedEaLookUpModal .loading_small').hide();
			if(primarySelection === 'accountId'){
				//$('.eaNameModalInput').hide();
				$('#savedEaLookUpModal .vmstarNameSearchInput').show();

			}else{
				//$('.vmstarNameModalInput').hide();
				$('#savedEaLookUpModal .eaNameSearchInput').show();

			}
		});
		$('#savedEaLookUpModal .serachNames').live('click',function(){
			$('#savedEaLookUpModal .showNames').hide();
			$('#savedEaLookUpModal .lookupNoRecords').hide();
			$('#savedEaLookUpModal .loading_small').show();
			var postData = {
				'category' : $('#savedRelAccountIdorNo').val(),
				'searchField' : $('#savedEaLookUpModal .nameSearchInput').val()
			};
			vmf.ajax.post(ela.globalVar.saveLookupUrl, postData, function(data) {
				var jData = ( typeof data === 'object') ? data : vmf.json.txtToObj(data);
				var listArr = [];
				
				if(jData.savedEAlookupList === null || jData.savedEAlookupList.length === 0){
					$('#savedEaLookUpModal .lookupNoRecords').html(that.CONST_OBJ['noRecords']).show();
					$('#savedEaLookUpModal .loading_small').hide();
					return;
				}
				//var jData = JSON.parse(jData);
				$.each(jData.savedEAlookupList, function(index, obj){
					listArr.push(that.savedEAlookup(obj));
				});
				$('#savedEaLookUpModal .showNames').find('.nameList').html(listArr.join(''));
				$('.selectValue').addClass('disabled').attr('disabled',true);
				$('#savedEaLookUpModal .showNames').show();
				$('#savedEaLookUpModal .loading_small').hide();

			});

		});

		$('#savedEaLookUpModal .selectValue').live('click',function(){
			var selectedValue = $('.accountLookUpName:checked').val();
			vmf.modal.hide();
			$('#savedRelType').val(selectedValue);
			$('.ajaxfire').removeClass('disabled').removeAttr('disabled');
		});

		$('#savedEaLookUpModal .nameSearchInput').keyup(function(){
			var nameSearchInputVal =$(this).val(),
				resultValue = nameSearchInputVal.replace(/%/g,""); 

			if (resultValue.length >= 3) {
				$('#savedEaLookUpModal .serachNames').removeClass('disabled').attr('disabled',false);
			}else{
				$('#savedEaLookUpModal .serachNames').addClass('disabled').attr('disabled',true);

			}
		});

		$('.accountLookUpName').live('click',function(){
			$('.selectValue').removeClass('disabled').attr('disabled',false);

		})
	/*-----------Saved Ea Lookup code -------END-------------*/
	},

	/* -------------------------------- Attach AutoSuggest to all the input Elements ------------------------------------*/
	autoSuggest : function(autoSuggestEl, url, keyName, flag) {
		var that = this, 
			key, 
			$parentContainer = autoSuggestEl.closest('.rowscontainer'), 
			minCharLen;

		if ($parentContainer.hasClass('eaNumbers')) {
			key = 'eaNumber';
		} else if ($parentContainer.hasClass('accountNumber')) {
			key = 'accountId';
			minCharLen = 10;
		} else if (keyName) {
			key = keyName;
		}
		//console.log(key);
		autoSuggestEl.autoSuggest(url, {
			minChars : minCharLen ? minCharLen : 3,
			startText : flag ? autoSuggestEl.val() :'Please enter a value',
			emptyText : '',
			queryParam : key, // Post Parameter , { "eNumber" : value } or {"accountId" : value }
			searchObjProps : key,
			selectedItemProp : key,
			selectedValuesProp : key,
			isMultipleSelectionAllowed : false,
			resultClick : function(data, input) {
				input.val(data[key]);
				if ($('.radio-primarykey').is(':checked') === false) {
					var parentNode = $(input).closest('.rows');
					parentNode.find('.primaryKeyMessage').show().html(that.CONST_OBJ['primaryKeyMessage']);
					parentNode.find('.radiogrp').addClass('checked');
					parentNode.find('.radio-primarykey').attr('checked', true);
				}
			},
			retrieveComplete : function(data) {
				data = data.eaNumbersList || data.idsList;
				return data;
			},
			requestType : 'POST' // Extra parameter added to the jquery.autosuggest.js plugin to handle POST Request
		});
	},

	/* -------------------------------- Post Parameters for EA Research / Saved Relationship  ------------------------------------*/
	postAjaxParameters : function(postData, id) {
		var that = myvmware.ela, 
			$this, 
			rowContainerEl, 
			typeofAccounts, 
			deepSearchFlag, 
			inputElVal, 
			selAccountIds = [], 
			selEaNumbers = [],
			resultValue = '';

		if (id === that.CONST_OBJ['resEaDt']) {
			$('#researchAccountsForm .rowscontainer').find('.input-field').each(function(i, inputEl) {
				$this = $(inputEl);
				rowContainerEl = $this.closest('.rowscontainer');
				deepSearchFlag = $('#researchAccountsForm .deepSearch:checked').val();
				resultValue = $this.val();
				resultValue = resultValue.split(' ');
				inputElVal = resultValue[0];

				if (inputElVal !== that.EMPTY_STRING && inputElVal !== that.CONST_OBJ['empty']) {
					if (rowContainerEl.hasClass('accountNumber')) {
						selAccountIds.push(inputElVal);
					} else if (rowContainerEl.hasClass('eaNumbers')) {
						selEaNumbers.push(inputElVal);
					}
				}
			});
			if (selAccountIds.length > 0) {
				//pData['accountIds'] = selAccountIds.join();
				postData.push({
					'name' : 'accountIds',
					'value' : selAccountIds.join()
				});
			}
			if (selEaNumbers.length > 0) {
				//pData['eaNumbers'] = selEaNumbers.join();
				postData.push({
					'name' : 'eaNumbers',
					'value' : selEaNumbers.join()
				});
			}
			//postData['deepSearch'] = deepSearchFlag;
			postData.push({
				'name' : 'deepSearch',
				'value' : deepSearchFlag
			});
			//console.log(postData);
		} else if (id === that.CONST_OBJ['savedRelDt']) {
			var headerId, type;
			var $relationRadiEls = $('.relationRadio');
			$relationRadiEls.each(function(i, radioEl) {
				var $this = $(this);
				var checkFlag = $this.is(':checked');
				if (checkFlag) {
					headerId = $this.val();
					type = $this.closest('div').attr('class');
				}

			});
			postData.push({
				'type' : type,
				'headerId' : headerId
			});
		}
		//return pData;
		return postData;
	},

	/* -------------------------------- Adding Ellipses to some columns in DataTable ------------------------------------*/
	addEllipses : function(parentRef, obj, flag) {
		var i,
            indx, 
            finalValue, 
            $thisEl, 
            strLen,
            dummyArr,
            subArray,
            toolTipVal,
            actualVal,
            parentRef,
            flag;
       
       if(flag){ // Look inside Table tbody 
       		parentRef = parentRef.find('tbody');
       }
       
       for (indx in obj) {
            parentRef.find('.' + indx).each(function(i, el) {
                 finalValue = null;
                 toolTipVal ='';
                 dummyArr = [];
                 actualVal = '';
                 $thisEl = $(this).find('.openDtModal').length > 0 ? $(this).find('.openDtModal') : $(this);
                 actualVal = $thisEl.html();
                 if($thisEl.parent().hasClass('cusDomain')){
                   	toolTipVal = actualVal.split(',');
                   	toolTipVal = toolTipVal.join('<br/>');
                 }else{
                   	toolTipVal = actualVal;
                 }
                 subArray = actualVal.split(',');
                 subArrayLen = subArray.length;
                 if(subArrayLen > obj[indx]){
                    for(i=0; i < obj[indx]; i++){
            			dummyArr.push(subArray[i]);
                    }
                    finalValue = dummyArr.join(',');
                    finalValue = (finalValue + "...");
                    $thisEl.html(finalValue);
                    $thisEl.attr('title', toolTipVal);
                    myvmware.hoverContent.bindEvents($thisEl, 'defaultfunc');
                  }
            });  
       }   
	},

	/* -------------------------------- Showing/Hiding Error Message on the page ------------------------------------*/
	showHideErrorMessage : function(msg, el) {
		if(msg){
			$('#errorMsg').show().html(msg);
			$(window).scrollTop(0);
		}else{
			$('#errorMsg').hide();
		}
	},

	showHideErrorMessageWindow : function(msg, el) {
		if(msg){
			$('#errorMsgWindow').show().html(msg);
			$(window).scrollTop(0);
		}else{
			$('#errorMsgWindow').hide();
		}
	},
	
	showHideErrorMessageRelationWindow : function(msg, el) {
		if(msg){
			$('#errorMsgRelationWindow').show().html(msg);
			$(window).scrollTop(0);
		}else{
			$('#errorMsgRelationWindow').hide();
		}
	},
		
	/* -------------------------------- Create Relation Search Markup Container ------------------------------------*/
	createRelationSearchMarkup : function(arr, accountType){
		var that = myvmware.ela, 
			i,
			$parentSelector = '#manageSavedEAForm',
			arrLen,
			resultObj = {},
			accountHolder = [],
			transactionHolder = [],
			listTemplate,
			//accountType = (accountType === 'accountID') ? 'accountId' : 'eaNumber', // map accountType to Key's
			subType,
			subTypeId,
			$relationRadioGrp = $(".relationRadio", $parentSelector),
			mapObject = {
				'accountRelatedTitle' : 'Account Related',
				'transactionRelatedTitle' : 'Transaction Related',
				'accountId' : 'VmStar Account ID',
				'eaNumber' : 'EA Number',
				'opportunityId' : 'Opportunity ID',
				'quoteId' : 'Quote ID',
				'caseId' : 'Case Number'
			},
			relSearchContainer = $(".relationSearch", $parentSelector),
			relSearchContent = $(".relationSearchContent", $parentSelector);
		
		if(arr === null){ // No Data Found
			$('.relationSearchNoRecords').html('<div class="warning-msg clearfix">' + that.CONST_OBJ['noRecords'] + '</div>').show();
			relSearchContainer.hide();
			$('.savedStatus, .savedRelationshipDataTableActions').hide();
			$('.ajaxfire').removeClass('disabled').removeAttr('disabled');
			return;
		}
		
		arrLen = arr.length;
		for( i =0; i < arrLen; i++){
			resultObj = arr[i];
			subType = resultObj['opportunityId'] ? mapObject['opportunityId'] : (resultObj['quoteId']? mapObject['quoteId']: mapObject['caseId']);
			subTypeId = resultObj['opportunityId'] ? resultObj['opportunityId'] : (resultObj['quoteId']? resultObj['quoteId']: resultObj['caseId']);
			if(resultObj['type'] === 'accountRelated'){
				listTemplate = '<li><input type="radio" name="acct" value="' + resultObj.headerId + '" class="relationRadio" /> ' + mapObject[accountType] + resultObj[accountType] +'</li>';
				accountHolder.push(listTemplate);
			}
			if(resultObj['type'] === 'transactionRelated'){
				listTemplate = '<li><input type="radio" name="acct" value="' + resultObj.headerId + '" class="relationRadio" /> ' + mapObject[accountType] + ":" + resultObj[accountType] + " " + subType + ":" + subTypeId + '</li>';
				transactionHolder.push(listTemplate);
			}
		}
		if(accountHolder.length > 0){
			relSearchContent.append('<div class="accountRelated"><h4>' + mapObject['accountRelatedTitle'] + '</h4>' + '<ul>' + accountHolder.join('') + '</ul></div>');
		}
		if(transactionHolder.length > 0){
			relSearchContent.append('<div class="transactionRelated"><h4>' + mapObject['transactionRelatedTitle'] + '</h4>' + '<ul>' + transactionHolder.join('') + '</ul></div>');
		}
		if(arrLen === 1){
			$(".relationRadio", $parentSelector).first().attr('checked',true);
			if($(".relationRadio", $parentSelector).is(':checked')){
				 relSearchContainer.hide();
				 $('.relationSearchNoRecords').hide();
				 $('#savedRelationshipDataTableCont').show();
				 that.createDataTable(that.CONST_OBJ['savedRelDt'], ela.globalVar.getShowSelectedRelationshipUrl);
			}
		}
		if(arrLen > 1){
			$('.savedStatus', $parentSelector).hide();
			$('.savedRelationshipDataTableActions').hide();
			$('.relationSearchNoRecords').hide();
			$('#savedRelationshipDataTableCont').hide();
			relSearchContainer.show();
			$('.relationSearchNoRecords').hide();
			$('.savedRelationshipBtn',$parentSelector).addClass('disabled');
			$relationRadioGrp.die().live('change', function() {
				if($(this).is(':checked')){
					$('.savedRelationshipBtn',$parentSelector).removeClass('disabled');
					$('.savedRelationshipBtn',$parentSelector).die().live('click',function(){
						that.createDataTable(that.CONST_OBJ['savedRelDt'], ela.globalVar.getShowSelectedRelationshipUrl);
						$('.relationSearch').hide();
						$('#savedRelationshipDataTableCont').show();
					});
				}
			});
		}
		$('.ajaxfire').removeClass('disabled').removeAttr('disabled');
	},

	/* -------------------------------- Fire Ajax for SaveResults ------------------------------------*/
	fireSaveResults : function(criteriaVal) {
		var that = myvmware.ela, 
			eaValue = '', 
			oppQuoteFlag = '', 
			oppQuoteId = '', 
			map = {}, 
			postData = {}, 
			selectedEAs = [], 
			checkedRows = $('.delAcctCheckBox:checked'), 
			$primaryKey = $('.radio-primarykey:checked'), 
			$parent = $primaryKey.closest('.rowscontainer'), 
			acctType = '',
			selectedInputVal,
			primaryAcct,
			primaryAcctName;
	
		$(".saveEaNumber").each(function() {
			if ($(this).attr("checked") == true)
				eaValue = $(this).val();
		});
		
		if (eaValue == 'Y') {//user selected yes.so, need to send opp/quote id.
			/*if ($('.selectID option:selected').val() == 'oppId')
				oppQuoteFlag = 'opportunity';
			else if ($('.selectID option:selected').val() == 'quoteId')
				oppQuoteFlag = 'quote';
			else if ($('.selectID option:selected').val() == 'caseId')	
				oppQuoteFlag = 'case';*/
			oppQuoteFlag = $('.selectID option:selected').val();
			if ($('#oppQuote').val() == '' || $('#oppQuote').val() == null) {
				that.showHideErrorMessageWindow(that.CONST_OBJ['selectOppQuote']);
				return false;
			}else {
				that.showHideErrorMessageWindow();
				oppQuoteId = $('#oppQuote').val();
			}
		}
		
		checkedRows.each(function() {
			var eaNos = $(this).val();
			//var eaType = $(this).parent().find('.eaType').val();
			map[eaNos] = $(this).data('coldata');
		});

		if ($parent.hasClass('accountNumber')) {
			acctType = 'SFDC ACCOUNT';
		} else if ($parent.hasClass('eaNumbers')) {
			acctType = 'EA';
		}
		
		selectedInputVal =  $('.radio-primarykey:checked').siblings().find('.input-field').val().split(' ');
		primaryAcct = selectedInputVal.shift();
		primaryAcctName = selectedInputVal.join(' ');

		var sresult = {
			'primaryAcct' : primaryAcct,
			'primaryAcctType' : acctType,
			'primaryAcctName':  primaryAcctName,
			'comment' : $('#saveAccountsModalWindow').find('.comments').val(),
			'eaNumbers' : map,
			'oppQuoteFlag' : oppQuoteFlag,
			'oppQuoteId' : oppQuoteId,
			'saveType' : 'saveEA'
		};
		if(criteriaVal === 'showQuote'){
			sresult['saveType'] = 'QAV';
		}

		$('.primaryAccNo').html(sresult.primaryAcct);
		$('.primaryAccTyp').html(sresult.primaryAcctType);
		$('.elaProfile').html(ela.globalVar.elaProfileName);
		$('.transactionId').html(sresult.oppQuoteId);
		postData['result'] = vmf.json.objToTxt(sresult);

		vmf.ajax.post(ela.globalVar.getSaveEAResultsUrl, postData, function(data) {

			var status = data.response.status;
			var handler = function(reqData) {
				vmf.ajax.post(ela.globalVar.getSaveEAResultsUrl, postData, function(data) {
					var jdata = ( typeof data === 'object') ? data : vmf.json.txtToObj(data);
					if (jdata.response.status === 'success' && criteriaVal == 'showQuote') {
						vmf.modal.hide();
						that.openBIDashboard();
					}
					if((jdata.response.status === 'quoteOpp_success') || (criteriaVal === 'saveEa' && jdata.response.status === 'success')){
						$('#statusMsg').html(jdata.response.message);
						$('#saveEaWindow,#saveUpdateEaWindow').hide();
						$('#statusMsgWindow').show();
						$('#saveAccountsModalWindow').find('.close').die().live('click', function(){
							vmf.modal.hide();
						});
					}
				});
			};

			if (status === 'success' && criteriaVal === 'showQuote') {
				vmf.modal.hide();
				that.openBIDashboard();
			}else if(status === 'quoteOpp_success' || (criteriaVal === 'saveEa' && status === 'success')){
				$('#statusMsg').html(data.response.message);
				$('#saveEaWindow,#saveUpdateEaWindow').hide();
				$('#statusMsgWindow').show();
				$('#saveAccountsModalWindow').find('.close').die().live('click', function(){
					vmf.modal.hide();
				});
			} else if (status === 'showMW' || status === 'showQuoteOppMW') {

				if (status === 'showQuoteOppMW') {//with Quote/Opportunity
					$('#saveEaWindow').hide();
					$('#saveUpdateEaWindow').show();
					$('.hideTransaction').show();
				}

				if (status === 'showMW') {//without Quote/Opportunity
					if(criteriaVal == 'showQuote'){
						$('#saveAndContinueBody').hide();
						$('#addToListBody').show();
					}
					if(criteriaVal === 'saveEa'){	
						$('#saveEaWindow').hide();
						$('#saveUpdateEaWindow').show();
						$('.hideTransaction').hide();
					}
				}

				$('#quotableAssetsModelWindow .addToList, #saveAccountsModalWindow .addToList').die().live('click', function(){
					sresult.type = 'add';
					postData['result'] = vmf.json.objToTxt(sresult);
					handler(postData);
				});

				$('#quotableAssetsModelWindow .replaceList, #saveAccountsModalWindow .replaceList').die().live('click', function(){
					sresult.type = 'replace';
					postData['result'] = vmf.json.objToTxt(sresult);
					handler(postData);
				});

				$('#quotableAssetsModelWindow .cancelSave, #saveAccountsModalWindow .cancelSave').die().live('click', function(){
					vmf.modal.hide();
					if(status === 'showMW' && criteriaVal === 'showQuote')
						that.openBIDashboard();
				});
			}
		});
	},

		/* -------------------------------- Add EA's to primary List------------------------------------------------*/
	addToPrimaryList : function() {
		var that = myvmware.ela, 
			acctType = '',
			map = {}, 
			postData = {}, 
			checkedRows = $('.delAcctCheckBox:checked'), 
			$primaryKey = $('.radio-primarykey:checked'), 
			$parent = $('#savedRelAccountIdorNo').val();	
				
		checkedRows.each(function() {
			var eaNos = $(this).val();
			map[eaNos] = $(this).data('coldata');
		});
		
		if ($parent == 'accountId') {
			acctType = 'SFDC ACCOUNT';
		} else if ($parent == 'eaNumber') {
			acctType = 'EA';
		}
			
		var sresult = {
			'primaryAcct' :  $('.savedRelTypeCont input').val(),
			'primaryAcctType' : acctType,
			'comment' : $('#savedRelComments').val(),
			'eaNumbers' : map
		};		

		$('.publishAccNo').html(sresult.primaryAcct);
		$('.publishKey').html(sresult.primaryAcctType);
		
		postData['result'] = vmf.json.objToTxt(sresult);

		vmf.ajax.post(ela.globalVar.publishEAList, postData, function(data) {
			var status = data.response.status,
				count = data.response.count;
			if (status === 'success') {
				$('.listCount').html(count);
				$('.displayFooter').show();
			}
		});
	},
	
	/* -------------------------------- Open BI DashBoard in a popup Window ------------------------------------*/
	openBIDashboard : function() {
		var that = myvmware.ela, 
			postData = [], 
			eaNos, 
			checkedRows = $('.delAcctCheckBox:checked'), 
			postParams,
			height, 
			width, 
			windowAttr;

		var finalStr = "";
	
		checkedRows.each(function(i, rowEl) {
			eaNos = '\"'+$(rowEl).val()+'\"';	
			if(checkedRows.length-1 != i)			
				finalStr = finalStr+eaNos+"&#10;"
			else
				finalStr = finalStr+eaNos+"&#10"
			
		});
		$('#biEaValue').val(finalStr);

		//$('#biForm').submit();
		
		
		height = screen.height;
		width = screen.width;
		windowAttr = "left=0,top=0,titlebar=yes, width=" + width + ",height=" + height;

		window.open("/web/vmware/elaib?_VM_BIReport=true&_VM_eaNumbers=101",'_blank', windowAttr);
	},
	
	/* -------------------------------- show Data Table in Modal Window------------------------------------*/
	showDataTableModalWindow : function(eaNo) {
		var that = myvmware.ela;
		vmf.modal.show('showDtModalWindow');
		$('#showDtModalWindow').find('.body').html('<table cellpadding="0" cellspacing="0" border="0" class="dataTable" id="modalDataTable"></table>');

		vmf.datatable.build($('#modalDataTable'), {
			"sPaginationType" : "full_numbers",
			"bPaginate" : false,
			"sScrollY": "250px",
			"bScrollCollapse": true,
			"bLengthChange" : true,
			"bFilter" : false,
			"bSort" : false,
			"bInfo" : false,
			"bProcessing" : true,
			"bServerSide" : false,
			"sAjaxSource" : ela.globalVar.getAdditionalDetailsUrl,
			"fnServerParams" : function(aoData) {
				aoData.push({
					'name' : 'eaNumber',
					'value' : eaNo
				})
			},
			'sAjaxDataProp' : 'additionalDetails',
			 "aoColumns": [  
				 { "sTitle": "Party Number", "mDataProp": "partyNumber"},
				 { "sTitle": "Party Name", "mDataProp": "partyName"},
				 { "sTitle": "DOMAIN(s)", "mDataProp": "domain", "sClass" : "domain"},
				 { "sTitle": "ADDRESS_LINE_1", "mDataProp": "address"},
				 { "sTitle": "CITY", "mDataProp": "city", "sClass":"city"},
				 { "sTitle": "POSTAL_CODE", "mDataProp": "postalCode"},
                 { "sTitle": "Country", "mDataProp": "country"} 
			 ], 
			"oLanguage" : {
				"sEmptyTable" : that.CONST_OBJ['emptyTable'],
				"sProcessing" : that.CONST_OBJ['processing'],
				"sLoadingRecords" : ""
			},
			"fnRowCallback" : function(nRow, aData, iDisplayIndex) {
				var $nRow = $(nRow);
				return nRow;
			},

			"fnDrawCallback" : function(oSettings) {
				var modalDtRef = this;
				that.addEllipses(modalDtRef, {
					'domain' : 3,
					'city' : 3,
					'country' : 3
				}, true);
			}
		});

	},
	
	/* -------------------------------- Update Grooup Count on Every Add/Delete action on DataTable ------------------------------------*/
	updateGroupCount : function(dataTableRef){
		
		var oSettings = dataTableRef.fnSettings();
		if(oSettings.aoData.length === 0){
			return;
		}
	    var i,
	    	indx,
        	aoDataLen = oSettings.aoData.length,
        	iDisplayIndex,
        	sGroup,
        	groupsCount = {
        		'Strong' : 0,
        		'Probable' : 0,
        		'Possible' : 0
        	}; 
        	
        for(i=0; i < aoDataLen; i++ ){	 
            iDisplayIndex = oSettings._iDisplayStart + i;
            sGroup = oSettings.aoData[ oSettings.aiDisplay[iDisplayIndex] ]._aData.group;    	                 	 
         //   groupsCount[sGroup] = groupsCount[sGroup] || [];	                               
            groupsCount[sGroup] = groupsCount[sGroup] + 1;
        }
        
        //console.log(groupsCount);
        for( indx in groupsCount){
        	if(groupsCount[indx] === 0){
        		dataTableRef.find('tbody tr.'+ indx).remove();
        	}else{
        		dataTableRef.find('tbody .' + indx + ' .count').html(groupsCount[indx]);
        	}
        }
        
	},

	/* -------------------------------- Create DataTable for EA Research / Saved Relationship ------------------------------------*/
	createDataTable : function(tableId, url) {
		var that = myvmware.ela, 
			dataTableRef, 
			ruleGroups, 
			parentContainer = $('#' + tableId + 'Cont'), 
			tableActions = $('.' + tableId + 'Actions'), 
			postData = that.postAjaxParameters(tableId), 
			dtRef = $('#' + tableId), 
			columnMappings = {
				'ruleSavedEA' : 12,
				'ruleOrderBooking' : 14,
				'ruleEmailDomain' : 17,
				'ruleContact' : 20,
				'ruleCompanyMaster': 11,
				'ruleDuns':13,
				'ruleCases':15,
				'ruleNormalizedName':18
			},
			groupCounts = {
			  'Strong':0,
			  'Probable':0,
			  'Possible':0
			};

		var sAjaxDataProp;
		that.showHideErrorMessage();

		if (tableId === that.CONST_OBJ['resEaDt']) {
			sAjaxDataProp = 'eaDetailsList';
			$('#researchAccountsForm .researchAccBtn').addClass('disabled');
		} else {
			sAjaxDataProp = 'savedEaSearchDetails.eaDetailsList';
		}
		parentContainer.html('<div class="dataTableInnerContainer"><table cellpadding="0" cellspacing="0" border="0" class="dataTable" id="' + tableId + '"></table></div><div class="table-wrapper"></div>');
		
		//$('#' + tableId).width($('#content-section').width());  // Set the table width to available content-section.
		var contentWidth = $('#content-section').width();
		var count = 1;	
		vmf.datatable.build($('#' + tableId), {
			"aaSortingFixed": [[0,'desc']],
			"bPaginate" : true,
			"bLengthChange" : false,
			"sPaginationType": "full_numbers",
			"iDisplayLength": ela.globalVar.getDisplayLength,
			"bFilter" : false,
			"bSort" : true,
			"bInfo" : true,
			"bProcessing" : true,
			"bServerSide" : true,
			"sAjaxSource" : url,
			'sAjaxDataProp' : sAjaxDataProp,
			"bDeferRender": true,
			"fnServerParams" : function(aoData) {
				that.postAjaxParameters(aoData, tableId);
			},
			"fnServerData" : function(sSource, aoData, fnCallback, oSettings) {
				var oTable = $('#researchEaDataTable').dataTable();
					var postUrl = '', 
					postData = {};
					if (tableId === that.CONST_OBJ['resEaDt']) {
						if(count === 1){
							postUrl = url;
							aoData.push({'name' : 'sEcho','value' : 1} );
							postData = aoData;
						}else{
							postUrl = ela.globalVar.getPaginationUrl;
							
		    				var oSettings = oTable.fnSettings();
							postData = {
								'position' : oSettings._iDisplayStart,
								'sEcho' : count,
								'iDisplayLength': oSettings._iDisplayLength,
								'iDisplayStart' : oSettings._iDisplayStart
							};
						}
					}else{
						aoData = $.param(aoData[0]);
					}
					$.ajax({
						"dataType" : 'json',
						"type" : "POST",
						"url" : postUrl,
						"data" : postData,
						"success" : function(aData) {
							if (tableId === that.CONST_OBJ['resEaDt']){
								ruleGroups = aData.eaSearchDetails.ruleGroups;
								groupCounts['Strong'] = aData.eaSearchDetails.strongCount;
								groupCounts['Probable'] = aData.eaSearchDetails.probableCount;
								groupCounts['Possible'] = aData.eaSearchDetails.possibleCount;
								count++;
								fnCallback(aData.eaSearchDetails);
							}else{
								ruleGroups = aData.savedEaSearchDetails.ruleGroups;
								$('#savedRelComments').val(aData.savedEaSearchDetails.comments);
								$('#lastUpdatedUser').html(aData.savedEaSearchDetails.lastUpdatedBy);
								$('#lastUpdatedDate').html(aData.savedEaSearchDetails.lastUpdatedDate);
								$("#savedRelStatus").val(aData.savedEaSearchDetails.status);
								$('.savedStatus').show();
								if(aData.savedEaSearchDetails.transactionId !== null)
								{
									$('#savedRelSecType').val(aData.savedEaSearchDetails.transactionId);
									$('#savedRelSecAccountIdorNo').val(aData.savedEaSearchDetails.transactionType);
								}
								groupCounts['Strong'] = aData.savedEaSearchDetails.strongCount;
								groupCounts['Probable'] = aData.savedEaSearchDetails.probableCount;
								groupCounts['Possible'] = aData.savedEaSearchDetails.possibleCount;
								fnCallback(aData);
								if(aData.savedEaSearchDetails.transactionFlag){
									$('.publishEaBtn').attr("disabled", false);
									$('.publishEaBtn').removeClass("disabled");
								}
							}
						}
					});	
			},
			"aoColumns": [
				{ "sTitle": "" , "bSortable":false ,"bVisible": false,"mDataProp":"group"},
				{ "sTitle": "EA Name", "bSortable":false,"mDataProp":"eaName"},
				{ "sTitle": "EA Number", "bSortable":false,"mDataProp":"eaNumber"},
				{ "sTitle": "Country(s)", "bSortable":false, "sClass": "ctryName","mDataProp":"countries"},
				{ "sTitle": "EA Comments", "bSortable":false,"mDataProp":"note"},
				{ "sTitle": "Sites", "bSortable":false,"sClass": "sites wrapColumn","mDataProp":"sites","sWidth":"35px"},
				{ "sTitle": "Customer Domain", "bSortable":false, "sClass": "cusDomain","mDataProp":"customerDomain"},
				{ "sTitle": "SU Name", "bSortable":false,"sClass":"wrapColumn suName","mDataProp":"suName"},
				{ "sTitle": "SU Email Address", "bSortable":false,"sClass":"wrapColumn suEmailAddress","mDataProp":"suEmailAddress"},
				{ "sTitle": "PC Name", "bSortable":false,"sClass":"wrapColumn puName","mDataProp":"puName"},
				{ "sTitle": "PC Email Address", "bSortable":false,"sClass":"wrapColumn puEmailAddress","mDataProp":"puEmailAddress"},
				{ "sTitle": "<span> </span>", "bSortable":false, "sClass": "strength ruleCompanyMaster vh","bVisible": false,"mDataProp":"ruleCompanyMaster"},
				{ "sTitle": "<span> </span>", "bSortable":false, "sClass": "strength ruleSavedEA vh","bVisible": false,"mDataProp":"ruleSavedEA"},
				{ "sTitle": "<span> </span>", "bSortable":false, "sClass": "strength ruleDuns vh","bVisible": false,"mDataProp":"ruleDuns"},
				{ "sTitle": "<span> </span>", "bSortable":false, "sClass": "strength ruleOrderBooking vh","bVisible": false,"mDataProp":"ruleOrderBooking"},
				{ "sTitle": "<span> </span>", "bSortable":false, "sClass": "strength ruleCases vh","bVisible": false,"mDataProp":"ruleCases"},
				{ "sTitle": "<span> </span>", "bSortable":false, "sClass": "strength hist vh","bVisible": false,"mDataProp":"ruleHistoricalQuotes"},
				{ "sTitle": "<span> </span>", "bSortable":false, "sClass": "strength ruleEmailDomain vh","bVisible": false,"mDataProp":"ruleEmailDomain"},
				{ "sTitle": "<span> </span>", "bSortable":false, "sClass": "strength ruleNormalizedName vh","bVisible": false,"mDataProp":"ruleNormalizedName"},
				{ "sTitle": "<span> </span>", "bSortable":false, "sClass": "strength address vh","bVisible": false,"mDataProp":"ruleAddress"},
				{ "sTitle": "<span> </span>", "bSortable":false, "sClass": "strength ruleContact vh","bVisible": false,"mDataProp":"ruleContact"},
				{ "sTitle": "<span> </span>", "bSortable":false, "sClass": "strength licence vh","bVisible": false,"mDataProp":"ruleLicense"},
				{ "sTitle": "<span> </span>", "bSortable":false, "sClass": "strength manual vh","bVisible": false,"mDataProp":"manuallyAdded"},
				{ "sTitle": "<input class='selectall' name='group_all' type='checkbox'>&nbsp;<label for='select_all'>Select All</label> " , "bSortable":false,"sClass": "selectAllAccounts","mDataProp":"eaNumber"}
			],
			"oLanguage" : {
				"sEmptyTable" : that.CONST_OBJ['emptyTable'],
				"sProcessing" : that.CONST_OBJ['processing'],
				"sLoadingRecords" : ""
			},
			"fnDrawCallback" : function(oSettings) {
				dataTableRef = this;
				var researchActionsEl = $('.' + tableId + 'Actions');				
				if (oSettings.aoData.length === 0) {
					dataTableRef.find('.selectall').removeAttr("checked");
					dataTableRef.find('.selectall').attr('disabled', true);
				} else {
					dataTableRef.find('.selectall').attr('disabled', false);
				}

				if (!oSettings.aiDisplay.length) {
					researchActionsEl.hide();
					return;
				} else {
					researchActionsEl.show();
				}
				// Start :: Dynamic Cols Showing
				for (var j = 11; j < 22; j++) {
					dataTableRef.fnSetColumnVis(j, false,false);
				}
				if (ruleGroups !== undefined) {
					for (var i = 0; i < ruleGroups.length; i++) {
						var colName = ruleGroups[i];
						dataTableRef.fnSetColumnVis(columnMappings[colName], true,false);
					}
					dataTableRef.fnSetColumnVis(22, true,false);
				}
				// End :: Dynamic Cols Showing 	
				if(oSettings.aoData.length > 0){
					var i, 
						nTrs = dataTableRef.find('tbody tr'),
						iColspan = $(nTrs[0]).find('td').length, 
						sGroup,
						nGroup,
						sLastGroup;
					
						for ( i = 0; i < nTrs.length; i++) { 
							var $nRow = $(nTrs[i]);
							//iDisplayIndex = oSettings._iDisplayStart + i;
							iDisplayIndex = i;
							var rdata = oSettings.aoData[ oSettings.aiDisplay[iDisplayIndex] ]._aData;
							if(rdata['deletedFlag'].toUpperCase() === "Y"){
								$(nTrs[i]).addClass('disabledRow');
							}
							sGroup = rdata['group'];
							if (groupCounts[sGroup] >= 1) {
								if (sGroup != sLastGroup){
									nGroup = $('<tr>').html('<td class="groupRow"' + 'colspan="' + iColspan + '">' + sGroup + ' Match Results (<span class="count">' + groupCounts[sGroup] + ' </span> Results)' + '</td>').addClass(sGroup);
									nGroup.insertBefore(nTrs[i]);
									sLastGroup = sGroup;
								}
							}
							
							$nRow.find('td.suName').html('<span class="wrapText">' + rdata['suName'] + '</span>');
							$nRow.find('td.puName').html('<span class="wrapText">' + rdata['puName'] + '</span>');
							$nRow.find('td.suEmailAddress').html('<span class="wrapText">' + rdata['suEmailAddress'] + '</span>');
							$nRow.find('td.puEmailAddress').html('<span class="wrapText">' + rdata['puEmailAddress'] + '</span>');
							
							var checkBoxEl = $('<input />', {
								'type' : 'checkbox',
								'name' : 'delAcctCheckBox',
								'class' : 'delAcctCheckBox',
								'value' : rdata['eaNumber']
							});
							var isManual = rdata['manuallyAdded'] === 'X'?true:false;
							var coldata = {
								'acctType' : rdata['acctType'],
								'acctTypeValue' : rdata['acctTypeValue'],
								'acctName' : rdata['eaName'],
								'manual' : isManual
							};
							checkBoxEl.data('coldata', coldata);
							$nRow.hasClass('checkedRow') ? checkBoxEl.attr('checked', true) : null;
							// Checked status
							$nRow.find('td.selectAllAccounts').html(checkBoxEl);
					  
						    $nRow.find('td.ctryName').html('<a class="openDtModal" href="#">' + rdata['countries'] + '</a>');
							$nRow.find('td.cusDomain').html('<a class="openDtModal" href="#">' + rdata['customerDomain'] + '</a>');
							if(rdata['sites']==null || rdata['sites']==='null') {
								$nRow.find('td.sites').html('');
							} else {
								$nRow.find('td.sites').html('<a class="openDtModal" href="#">' + rdata['sites'] + '</a>');
							}

							$(nTrs[i]).find('.strength').each(function(i, tdEl) {
									tdElVal = $(tdEl).html();
									if (tdElVal.toUpperCase() === 'S') {
										$(tdEl).addClass('strong');
									} else if (tdElVal.toUpperCase() === 'W') {
										$(tdEl).addClass('weak');
									}
							}); 
							
							that.addEllipses($(nTrs[i]), {
							'ctryName': 5, 
							'cusDomain': 3
					    	});	
						} 
				 }
				
			}, 

			"fnInitComplete" : function(oSettings) {				
				dataTableRef = this;
				var nTrs = dataTableRef.find('tbody tr');
				
				tableActions.show();
				if (tableId === that.CONST_OBJ['resEaDt']) {
					$('#researchAccountsForm').find('.showQuotAssetsBtn').show();
				//	$('#researchAccountsForm .researchAccBtn');
					$('#researchAccountsForm .researchAccBtn').addClass('disabled');
					$('#researchAccountsForm .researchAccBtn').attr('disabled', true);
				}
				toggleButtons();
				
				dataTableRef.find('tbody .openDtModal').live('mousedown',function(){
					var eaNo = $(this).closest('tr').find('.delAcctCheckBox').val();
					that.showDataTableModalWindow(eaNo);
					return false;
				});

				dataTableRef.find('.delAcctCheckBox').live('click',function(){
				    var $ele = $(this);
					if($ele.is(':checked')){
						//$ele.addClass('delChecked');
					 	$ele.closest('tr').addClass('checkedRow');
				 	}else{
				 		//$ele.removeClass('delChecked');
				 		$ele.closest('tr').removeClass('checkedRow');
						$('.selectall').removeAttr('checked');
				 	}

					var quoteBtn = tableActions.find('.showQuotAssetsBtn');
					if(dataTableRef.find('.delAcctCheckBox:checked').length > 0){
					  if(quoteBtn.hasClass('disabled')){
						 toggleButtons(that.CONST_OBJ['enable']);
					  }
					}else{
					   if(!quoteBtn.hasClass('disabled')){
					     toggleButtons();
					   }
					}
		 		});
				
				dataTableRef.find('.selectall').die().live('click', function() {
					if ($(this).is(':checked')) {
						dataTableRef.find('.delAcctCheckBox').attr("checked", "checked").closest('tr').addClass("checkedRow");
						toggleButtons(that.CONST_OBJ['enable']);
					} else {
						dataTableRef.find('.delAcctCheckBox').removeAttr("checked").closest('tr').removeClass("checkedRow");
						//dataTableRef.find('tbody tr').removeClass("checkedRow");
						toggleButtons();
					}
				});
				
				var tbWidth = $('#' + tableId).width(); 
				if(contentWidth  < tbWidth){
					parentContainer.addClass('addScroll');
					$('#' + tableId).width(contentWidth);
				}else{
					parentContainer.remove('addScroll');
					$('#' + tableId).width(contentWidth);
					
				}
			}
		 });
		var toggleButtons =  function(state){
		 	if(state === that.CONST_OBJ['enable']){
		 		tableActions.find('.deleteAccountsAction,.showQuotAssetsBtn,.saveEaResults').removeClass('disabled').removeAttr('disabled');
		 	}else{
		 		tableActions.find('.deleteAccountsAction,.showQuotAssetsBtn,.saveEaResults').addClass('disabled').attr('disabled', true);
		 	}
		};
		
		tableActions.find('.deleteAccountsAction').die().live('click',function(e){
			e.preventDefault();
			if($('.checkedRow').length > 0){
			   vmf.modal.show('deleteAccountsModelWindow');
			   $('#deleteAccountsModelWindow').find('input[name="confirmBtn"]').data('dataTableRef',dataTableRef);
			}else{
			  that.showHideErrorMessage(that.CONST_OBJ['selectAccts']);
			}
		});
			
		tableActions.find('.addAccountsAction').die().live('click',function(e){
			e.preventDefault();
			vmf.modal.show('addAccountsModelWindow');
			$('#addAccountsModelWindow').find('input[name="submitAccountBtn"]').data('dataTableRef',dataTableRef); // Store DT Ref
		});

		$('#researchAccountsForm').find('.showQuotAssetsBtn').die().live('click', function() {
			var checkedRows = $('.delAcctCheckBox:checked');
			var primaryKey = $('.radio-primarykey:checked');
			if (checkedRows.length !== 0 && primaryKey.length !== 0) {
				that.showHideErrorMessage();
				vmf.modal.show('quotableAssetsModelWindow');

				$('#quotableAssetsModelWindow').find('input[name="contWithoutSavingBtn"]').die().live('click', function() {
					that.openBIDashboard();
					$('#saveAndContinueBody').hide();
					$('#addToListBody').show();
					vmf.modal.hide();
				});

				$('#quotableAssetsModelWindow').find('input[name="saveAndContBtn"]').die().live('click', function() {
					that.fireSaveResults('showQuote');
				});
			} else {
				if (checkedRows.length === 0) {
					that.showHideErrorMessage(that.CONST_OBJ['selectAccts']);
				} else if (primaryKey.length === 0) {
					that.showHideErrorMessage(that.CONST_OBJ['selectPrimary']);
				}
			}
		});

		 tableActions.find('.saveEaResults').die().live('click', function() {

			 var $primaryKey = $('.radio-primarykey:checked'),
			 	 checkedRows = $('.delAcctCheckBox:checked');
			 	
			 if ($primaryKey.length === 0) {
				that.showHideErrorMessage(that.CONST_OBJ['selectPriKey']);
			 }else if(checkedRows.length === 0){
				that.showHideErrorMessage(that.CONST_OBJ['selectAccts']);
			 }else {
				that.showHideErrorMessage();
				vmf.modal.show('saveAccountsModalWindow');
				$('.submitSavedEa').addClass("disabled").attr("disabled",true);
				$('#saveAccountsModalWindow').find('.submitSavedEa').die().live('click', function(e) {					
					that.fireSaveResults('saveEa');
				});
			 }
		 }); 

		$('#addAccountsModelWindow').find('input[name="cancelAccountBtn"]').die().live('click',function(){
			vmf.modal.hide();
		});
			
		$('#addAccountsModelWindow').find('input[name="submitAccountBtn"]').die().live('click',function(){
			
			var dataTableRef = $(this).data('dataTableRef'), //Retrieve DT Ref
				eaNum = $('#addAccountsModelWindow').find('input[name="accountNumber"]').val(),
				$primaryKey = $('.radio-primarykey:checked'), 
		       	$parent = $primaryKey.closest('.rowscontainer'),
		       	acctType,
		       	responseData;
		       
		    $('#addAccountsModelWindow').find('#errorMsgWindow').hide();
			$('input[name="submitAccountBtn"]').attr('disabled',true).addClass('disabled');
		    if ($parent.hasClass('accountNumber')) {
				acctType = 'SFDC ACCOUNT';
			} else if ($parent.hasClass('eaNumbers')) {
				acctType = 'EA';
			}
			var rdata = {
				'eaNumber':eaNum,
				'accountType':acctType,
				'accountTypeValue': $primaryKey.siblings().find('.input-field').val()
			};
			vmf.ajax.post(ela.globalVar.getAddAccountsPaginationUrl,rdata,function(jData){
				if(jData.response.status === 'success'){
					var responseData = jData.response.eaDetails;
					groupCounts['Strong'] = groupCounts['Strong'] + 1;
					if(dataTableRef.fnSettings()._iDisplayStart === 0){
						dataTableRef.fnAddData(responseData);
						vmf.modal.hide();
					}else{
						dataTableRef.fnAddData(responseData,false);
						$('#addAccountsModelWindow').find('.body').hide();
						$('#addAccountsModelWindow').find('#statusMsgWindow').show();
						$('#addAccountsModelWindow').find('.close').die().live('click', function(){
							vmf.modal.hide();
						});
					}
					that.updateGroupCount(dataTableRef);
				}else{
					$('#addAccountsModelWindow').find('#errorMsgWindow').html(jData.response.message);
					$('#addAccountsModelWindow').find('#errorMsgWindow').show();
					$('input[name="submitAccountBtn"]').removeAttr('disabled',true).removeClass('disabled');
				}
			});
		});
				
		$('#deleteAccountsModelWindow').find('input[name="confirmBtn"]').die().live('click',function(){
			var dataTblRef = $(this).data('dataTableRef'),
				checkedRowsCount = dataTblRef.find('.checkedRow').length,
				checkedRows = $('.delAcctCheckBox:checked'),
				eaNums = [],
				deletedData;
				
			checkedRows.each(function() {
				 eaNums.push($(this).val());
			});
			
			deletedData = {
				'deletedAccounts' : eaNums.join()
			};
			vmf.ajax.post(ela.globalVar.getDeleteAccountsUrl, deletedData, function(resData){
				if(resData.status === 'success'){
					dataTblRef.find('.checkedRow').each(function(i,rowEl){
						$(rowEl).closest('tr').remove();
				 		dataTblRef.fnDeleteRow(dataTblRef.fnGetPosition(rowEl),function(setting){
				 			if(i === (checkedRowsCount-1)){ // redaw only when aoData is empty array
				 				that.updateGroupCount(dataTblRef);
				 			}
				 		}, false);
				 		$('#deleteAccountsModelWindow').find('.body').hide();
						$('#deleteAccountsModelWindow').find('#statusMsgWindow').show();
						$('#deleteAccountsModelWindow').find('.close').die().live('click', function(){
							vmf.modal.hide();
							tableActions.find('.deleteAccountsAction,.showQuotAssetsBtn,.saveEaResults').addClass('disabled').attr('disabled',true);
						});
					});
					//tableActions.find('.deleteAccountsAction,.showQuotAssetsBtn,.saveEaResults').addClass('disabled').attr('disabled',true);
					//vmf.modal.hide();
				} 
			});
		});
			
		$('#deleteAccountsModelWindow').find('input[name="cancelBtn"]').die().live('click',function(){
			vmf.modal.hide();
		});
		
		$('.publishEaBtn').die().live('click',function(){		
			vmf.modal.show('publishEaModalWindow');
		});
		
		$('.addToPrimaryList').die().live('click',function(){	
			var checkedRows = $('.delAcctCheckBox:checked');
			 if(checkedRows.length === 0){
				that.showHideErrorMessageRelationWindow(that.CONST_OBJ['selectAccts']);
			 }else {
				that.showHideErrorMessageRelationWindow();		
				that.addToPrimaryList();		
			 }		
		});
		
		$('.cancelList, .closeWindow').die().live('click',function(){		
			vmf.modal.hide();
		});
		
		/*
		},function(){
		_showHideErrorMessage(CONST_OBJ['errorLoadingDt'],'#researchEaDataTableCont');
		tableActions.hide();
		$('#researchAccountsForm').find('.showQuotAssetsBtn').hide();
		}); // End of AJAX
		*/

		/*} else{
		$('#researchAccountsForm .researchAccBtn').addClass('disabled').die();
		var postReloadData = [];
		postReloadData = _postAjaxParameters(postReloadData, CONST_OBJ['resEaDt']);
		vmf.datatable.reload(dtRef, url, null, "POST", postReloadData, function(){
		//_showHideErrorMessage(CONST_OBJ['errorLoadingDt'],'#researchEaDataTableCont');
		tableActions.hide();
		$('#researchAccountsForm').find('.showQuotAssetsBtn').hide();
		});

		} */
		//	this.render();
		//this.subscribeTableActions();
	},
	
	/* ----------------------- Start of Account Lookup -------------------------*/
	
	createListItem : function(type, cfg){/* createListItem():: For Template Markup for ListItem and Input Item*/
		var that = myvmware.ela,
			resultTemplate,
			rowTemplate = ['<div class="rows"><input type="radio" name="primaryKey" value="" class="radio-primarykey"/>',
					 			  '<span class="icons radiogrp"> </span>',
					 			  '<div class="input-wrapper"><input type="text" class="input-field" value="{id}" disabled="disabled" readonly="readonly"/></div>',
								  '<a href="#" class="icons del"> delete </a>',
								  '<span class="primaryKeyMessage"> </span>',
			 		   	   '</div>'];
					 		   
		if(type === this.CONST_OBJ['listItem']){
		    return '<li data-type="' + cfg.type + '"><span class="accountId">' + cfg.id + '</span><span class="accountName">' + cfg.name + '</span></li>';
		}else if(type === this.CONST_OBJ['inputItem']){
		    rowTemplate = rowTemplate.join('');
		    resultTemplate = rowTemplate.replace(/{id}/g, cfg.id);
		    return resultTemplate;
		}
	},
	
	showHideAddDeleteBtns :  function(){/*  showHideAddDeleteBtns():: For show and hide Add and Delete Buttons	*/
		
		var addBtn = $('.addToListButton'),
			deleteBtn = $('.deleteAccountButton'),
			resultAccountListLen = $('.resultAccountList li').length,
			addAccountListLen  = $('.accountNumbersList li').length + $('.eaNumbersList li').length;
			
		(resultAccountListLen=== 0) ? addBtn.attr("disabled",true).addClass('disabled') : addBtn.attr("disabled",false).removeClass('disabled');
		(addAccountListLen === 0) ? deleteBtn.attr("disabled",true).addClass('disabled') : deleteBtn.attr("disabled",false).removeClass('disabled');
	},	
	
	showHideSelectButton : function(){
		var selectfiled  = $('.resultSelection'),
			resultFind = $('.resultAccountList').find('li').length;
			
		(resultFind=== 0) ? selectfiled.hide() : selectfiled.show();
	},
	
	setPrimaryKey : function(containerRef){
		
		if($('#researchAccountsForm .radio-primarykey').is(':checked') === true){
			return;
		}
		var that = myvmware.ela,
			rowRef = containerRef.find('.rows').first();
			inputVal = rowRef.find('.input-field').val();
		
		if(inputVal !== that.EMPTY_STRING && inputVal !== that.CONST_OBJ['empty']) {
			rowRef.find('.primaryKeyMessage').show().html(that.CONST_OBJ['primaryKeyMessage']);
			rowRef.find('.radiogrp').addClass('checked');
			rowRef.find('.radio-primarykey').attr('checked', true);
		}
	},
	
	/* attachAccountEventListeners():: Adding listeners for all the elements of Account lookup Module */
	attachAccountEventListeners : function(){
		var that = myvmware.ela,
			searchEl = $('#accountLookupContainer .searchField'),
			addedListArr = [];
		
		searchEl.live('focus',function(){
			($(this).val() === that.CONST_OBJ['search']) ? $(this).val(that.EMPTY_STRING) : null;
		});	
		searchEl.live('blur',function(){
			($(this).val() === that.CONST_OBJ['empty']) ? $(this).val(that.CONST_OBJ['search']) : null
		});	
		
		searchEl.keyup(function(){
			var toggleSearchBtn = $('.searchField').val();
			resultValue = toggleSearchBtn.replace(/%/g,""); 
			if (resultValue.length >= 3) {
				$('#accountLookupContainer .searchAccounts').removeClass('disabled').attr('disabled',false);
			}else{
				$('#accountLookupContainer .searchAccounts').addClass('disabled').attr('disabled',true);

			}
		});
		
		$('.accountLookupBtn').die().live('click', function(e) {
			vmf.modal.show('accountLookupModalWindow');
			return false;
		});
		
		$('.resultAccountList li, .accountNumbersList li, .eaNumbersList li').die().live('click',function() {
			 
			 $(this).toggleClass('selected');
			 if($('.resultAccountList').find('.selected').length < 1){
			 	$('.addToListButton').addClass('disabled').attr('disabled',true);
			 }else{
			 	$('.addToListButton').removeClass('disabled').attr('disabled',false);
			 }
			 
			 if($('.accountNumbersList').find('.selected').length < 1 &&  $('.eaNumbersList').find('.selected').length < 1 ){
			 	$('.deleteAccountButton').addClass('disabled').attr('disabled',true);
			 }else{
			 	$('.deleteAccountButton').removeClass('disabled').attr('disabled',false);
			 }
		});
		
		$('#accountLookupContainer .addToListButton').live('click',function() {	

			//$('.addToListButton').addClass('disabled').attr('disabled',true);
			$('.resultAccountList .selected').each(function() {
				var $listEl = $(this).clone().removeClass('selected');
				//console.log($listEl.data('listObj'));
				if($listEl.attr('data-type') === 'EA'){
					if(addedListArr.indexOf($(this).find('.accountId').text()) !== -1){
						$('#accountLookupContainer .errorMessage').show().html(that.CONST_OBJ['alreadyAvailable']);
					}else{
						$('.eaNumbersList').append($listEl);
						addedListArr.push($listEl.find('.accountId').text());
					}
					$('.addToListSection .eaCount').html($('.eaNumbersList li').length);
					
				}else if($listEl.attr('data-type') === 'SFDC'){
					if(addedListArr.indexOf($(this).find('.accountId').text()) !== -1){
						$('#accountLookupContainer .errorMessage').show().html(that.CONST_OBJ['alreadyAvailable']);
					}else{
						$('.accountNumbersList').append($listEl);
						addedListArr.push($listEl.find('.accountId').text());
					}
					$('.addToListSection .sfdcCount').html($('.accountNumbersList li').length);
				}
				$(this).remove();
			});
			var movedAccounts = $('.resultAccountList').find('li').length;
			if(movedAccounts===0){
				$('.selectallResult').removeAttr('checked');
				$('.resultSelection').hide();
			}
			that.showHideAddDeleteBtns();
		});
		
		$('#accountLookupContainer').find('.deleteAccountButton').live('click',function() {
			
			$('.accountNumbersList .selected, .eaNumbersList .selected').each(function() {
				var $listEl = $(this).clone().removeClass('selected');
				//$('.resultAccountList').append($listEl)
				$(this).remove();
				$('.addToListSection .eaCount').html($('.eaNumbersList li').length);
				$('.addToListSection .sfdcCount').html($('.accountNumbersList li').length);
			});
			that.showHideAddDeleteBtns();
		});

		$('#accountLookupContainer').find('.selectallResult').live('click',function() {
			if ($('.selectallResult').attr('checked')){
				$.each($('.resultAccountList').find('li'),function(i,k){
					if(i>=15)
					{
						return false;
					}
					$(k).addClass('selected');					
				});
				//$('.resultAccountList').find('li').addClass('selected');
				$('.addToListButton').removeClass('disabled').attr('disabled',false);
			}else{
				$('.resultAccountList').find('li').removeClass('selected');
				$('.addToListButton').addClass('disabled').attr('disabled',true);

			}

		});
	
		$('#accountLookupContainer').find('.searchAccounts').die().live('click', function() {
			$('.resultAccountList','#accountLookupContainer').find('li').remove();		
			$('.loading_small','#accountLookupContainer').show();
			var postData = {
				'category' : $('.searchCriteria').val(),
				'searchField' : $('.searchField').val()
			};
			var searchVal = $('#accountLookupContainer').find('.searchField').val();
			
			if (searchVal === that.CONST_OBJ['search'] || searchVal === that.EMPTY_STRING) {
				$('#accountLookupContainer').find('.errorMessage').show().html(that.CONST_OBJ['search']);
			} else {
				$('#accountLookupContainer').find('.errorMessage').hide();
				$(this).addClass('disabled').attr('disabled',true);
				vmf.ajax.post(ela.globalVar.getSearchLookupResultsUrl, postData, function(jData) {
					var listArr = [];
					var data = ( typeof jData === 'object') ? jData : vmf.json.txtToObj(jData);
					var resultList = data['resultList'];
					var numberOfResultList = jData.resultList;
					 //console.log(resultList);
					if ($.isEmptyObject(numberOfResultList)) {
						$('.loading_small','#accountLookupContainer').hide();
						$('.erromsgNodata','#accountLookupContainer').show();	
					}else{
						$('.erromsgNodata','#accountLookupContainer').hide();
					}
					
					$.each(resultList, function(i, obj) {
						listItem = that.createListItem(that.CONST_OBJ['listItem'], obj);
						$(listItem).data('listObj', obj);
						//  console.log(listItem);
						listArr.push(listItem);
					});
					$('.loading_small','#accountLookupContainer').hide();
					$('#accountLookupContainer').find('.resultAccountList').empty().html(listArr.join(''));
					$('.addToListButton').show();
					that.showHideSelectButton();
					$(this).removeClass('disabled').attr('disabled',false);

				});
			}
		}); 

		$('#accountLookupModalWindow').find('.submitAccountBtn').die().live('click',function(){
			
			var selectedEaList =  $('.addToListSection .eaNumbersList li'),
	          	selectedAccountList =  $('.addToListSection .accountNumbersList li'),
			  	inputItem,
			  	eaNosArr = [],
			  	accountIdArr = [],
			  	id,
			  	inputArr,
			  	inputVal,
			  	accountName,
			  	config= {},
			  	MAX_COUNT = 15,
			  	$accountNosContainer = $('#researchAccountsForm').find('.accountNumber'),
			  	$eaNosContainer = $('#researchAccountsForm').find('.eaNumbers'),
				existingAccounts = $('.accountNumbersList').find('li').length,
				existingEas = $('.eaNumbersList').find('li').length;
				
			if(existingAccounts>=1 && existingEas>=1 && existingAccounts<=15 && existingEas<=15 ){
				inputArr = $('#researchAccountsForm').find('.input-field');
				inputArr.each(function(i, inputEl) {
					inputVal = $(inputEl).val();
						if (inputVal == ''|| inputVal=='Please enter a value') {
							//console.log(inputEl);
							$(inputEl).closest('.rows').remove();
							
						}
				});
			}else if(existingAccounts>=1 && existingAccounts<=15 && existingEas===0 ){
				inputArr = $('.accountNumber').find('.input-field');
				inputArr.each(function(i, inputEl) {
					inputVal = $(inputEl).val();
					if (inputVal == ''|| inputVal=='Please enter a value') {
						//console.log(inputEl);
						$(inputEl).closest('.rows').remove();
					}
				});
			}else if(existingAccounts===0 && existingEas>=1 && existingEas<=15 ){
				inputArr = $('.eaNumbers').find('.input-field'),
				inputArr.each(function(i, inputEl) {
					inputVal = $(inputEl).val();
					if (inputVal == ''|| inputVal=='Please enter a value') {
						//console.log(inputEl);
						$(inputEl).closest('.rows').remove();
					}
				});
			}

	      selectedEaList.each(function(i,liEl){	
      	      $liEl = $(liEl);
      	      id = $liEl.find('.accountId').text();
			  accountName = $liEl.find('.accountName').text();
      	      config['id'] = id +' '+ accountName;
			  inputItem = that.createListItem(that.CONST_OBJ['inputItem'],config);
			  //console.log(inputItem);
	          eaNosArr.push(inputItem);
		  });
		  
		  selectedAccountList.each(function(i,liEl){	
      	      $liEl = $(liEl);
      	      id = $liEl.find('.accountId').text();
			  accountName = $liEl.find('.accountName').text();
      	      config['id'] = id +' '+ accountName;
			  inputItem = that.createListItem(that.CONST_OBJ['inputItem'],config);
			  //console.log(inputItem);
	      	  accountIdArr.push(inputItem);
		  });
		  
		  // Update Count 
		  that.CONST_OBJ['groupCount'].sfdc = $('.accountNumber .input-field').length + accountIdArr.length;
		  that.CONST_OBJ['groupCount'].ea = $('.eaNumbers .input-field').length + eaNosArr.length;
		  
		  //console.log(that.CONST_OBJ['groupCount']);
		  
		  if(that.CONST_OBJ['groupCount'].sfdc <= that.CONST_OBJ['groupCount'].maxCount && accountIdArr.length > 0){
		  		$accountNosContainer.append(accountIdArr.join(''));
		  		that.setPrimaryKey($accountNosContainer);
		  		that.CONST_OBJ['groupCount'].sfdc = $('.accountNumber .input-field').length;
		  		
		  }
		  if(that.CONST_OBJ['groupCount'].ea <= that.CONST_OBJ['groupCount'].maxCount && eaNosArr.length > 0){
		  		 $eaNosContainer.append(eaNosArr.join(''));
		  		 that.setPrimaryKey($eaNosContainer);
		  		 that.CONST_OBJ['groupCount'].ea = $('.eaNumbers .input-field').length;
		  }
		  if(that.CONST_OBJ['groupCount'].sfdc > that.CONST_OBJ['groupCount'].maxCount){
	  			$('#accountLookupContainer .errorMessage').show().html(that.CONST_OBJ['sfdcNosAlert']);
	  			return false;
		  }
		  
		  if(that.CONST_OBJ['groupCount'].ea > that.CONST_OBJ['groupCount'].maxCount){
		  		$('#accountLookupContainer .errorMessage').show().html(that.CONST_OBJ['eaNosAlert']);
		  		return false;
		  }
		  
		  // that.equalHeight($('#researchAccountsForm .accountType'));
          vmf.modal.hide();
          $('#researchAccountsForm .researchAccBtn').removeClass('disabled').removeAttr('disabled',false);
		});
		
		$('#accountLookupModalWindow').find('.cancelAccountBtn').live('click',function(){
		     vmf.modal.hide();	
		});
	}
};

 