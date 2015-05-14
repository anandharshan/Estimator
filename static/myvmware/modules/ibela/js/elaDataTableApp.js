if ( typeof myvmware == "undefined"){
	myvmware = {};
}
// Create an object for ELA Applications
myvmware.ela = {};
/**
 * @class Holds all myvmware.ela.ResearchAccounts functionality
 * @name myvmware.accounts.Reports
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
		'selectEA'	: ela.globalVar.selectEA,
		'easSearchLimit' : ela.globalVar.easSearchLimit,
		'accountSearchLimit' : ela.globalVar.accountSearchLimit,
		'selectPrimary' : ela.globalVar.selectPrimary,
		'noRecords' : ela.globalVar.noRecordsMsg,
		'delRecords' : 'Relationship is deleted successfully.',
		'enable' : 'enabled',
		'listItem' : 'LISTITEM',
		'inputItem' : 'INPUTITEM',
		'search' : ela.globalVar.searchLookupPlaceHolder,
		'eaNosAlert' : ela.globalVar.easMaxLimit,
		'sfdcNosAlert' : ela.globalVar.accountsMaxLimit,
		'alreadyAvailable' : ela.globalVar.accountExistsMsg,
		'summarytext' :  ela.globalVar.summarytext,
		'validSearchString' : 'Enter a valid search string',
		'requestTimeOutMsg' : ela.globalVar.requestTimeoutMsg,
		'ELANote' : ela.globalVar.ELANote,
		'SavedEANote' : ela.globalVar.SavedEANote,
		'launchPoint' : ela.globalVar.launchPoint,
		'TryAgain' : ela.globalVar.TryAgain,
		'profileName' : ela.globalVar.elaProfileName
	},
	EMPTY_STRING : '',
	existingEasObj : {},
	startIndex : 0,
	filterCount : 0,
	saveTabfilterCount : 0,
	eaNumbersList : [],
	savedEANumbersList : [],
	groupCounts : {
		'Strong':0,
		'Probable':0,
		'Possible':0
	},
	responseLength : 0,
	savedResponseLength : 0,
	acnts : ela.globalVar.acnts || 0,
	txns : ela.globalVar.txns || 0,
	/* Object mapping with "eaResearchDtColNames". Note the key names from "eaResearchDtColNames"
	 should match with "eaResearchDtColNamesMapping" object */
	/* ---------------------------- Initialization of All the ELA Modules on Load ------------------------------------------*/
	init : function() {
		var that = myvmware.ela;
				
		if ($('#researchAcctContainer')[0]) {
			that.attachEventListeners();
			// Initializing the Account Lookup Modal Window 
			that.attachAccountEventListeners();
			that.attachListenerForUserSaves(true);
			$('#accountLookupContainer .addToListButton, #accountLookupContainer .deleteAccountButton').addClass('disabled').attr('disabled', true);
			callBack.addsc({'f':'riaLinkmy','args':['XELArate : Login : '+that.CONST_OBJ['launchPoint']]});
		}
		
		$('#manageSavedEAForm .filterContainer').find('.exclude').attr('name','excludeSave');
		$('#researchAccountsForm .filterContainer').find('.include').attr('checked','checked');
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
			$('.filterInput','#researchAccountsForm').val(that.EMPTY_STRING);
			$('.strong','#researchAccountsForm').removeAttr('checked');
			$('#researchAccountsForm .filterContainer').hide();
			//$('#researchAccountsForm .clearFilterBtn').addClass('disabled').attr('disabled',true);
			
			that.createDataTable(that.CONST_OBJ['resEaDt'], ela.globalVar.getResultsUrl, false, false, false);
		});
		
		//Filter Results
		$('#researchAccountsForm .filterBtn').live('click', function() {
			var excludeFlag = false;
			if($('#researchAccountsForm .exclude:checked').val() !== undefined){
				excludeFlag = $('#researchAccountsForm .exclude:checked').val();
			}

			that.createDataTable(that.CONST_OBJ['resEaDt'], ela.globalVar.getFilterResultsUrl, true, false,excludeFlag);
			//$('#researchAccountsForm .clearFilterBtn').removeClass('disabled').attr('disabled',false);
			that.filterCount = that.filterCount+1;
		});
		
		//Clearing filter results 		
		$('#researchAccountsForm .clearFilterBtn').live('click', function() {
			$('.filterInput','#researchAccountsForm').val(that.EMPTY_STRING);
			$('.strong','#researchAccountsForm').removeAttr('checked');
			$('.include','#researchAccountsForm').attr('checked','checked');
			//$('#researchAccountsForm .clearFilterBtn').addClass('disabled').attr('disabled',true); 
			that.createDataTable(that.CONST_OBJ['resEaDt'], ela.globalVar.getFilterResultsUrl, true, true, false);
			that.filterCount = 0;
		});
		$('#researchAcctContainer .userFeedBackbtn').live('click',function(e){
			e.preventDefault();
			/*var feedbackNote,
				modalWidth = 700;*/					
			var activeTab = $('#researchAcctContainer .tabbed_area').children('.tabs').find('.active').attr('title');
			
			if(activeTab === 'manageSavedEAForm'){
				//feedbackNote = SavedEANote;
				feedbackNote = that.CONST_OBJ['SavedEANote'];
			}else{
				//feedbackNote = ELANote;
				feedbackNote = that.CONST_OBJ['ELANote'];
			}
			$('#userFeedBackModalWindow .feedbackNote').html(feedbackNote);
			//$('#userFeedBackModalWindow .modalContent').width('auto');//to override the modalcontent width
			vmf.modal.show('userFeedBackModalWindow');
		});
		
		//Filter Results Managed Tab
		$('#manageSavedEAForm .filterBtn').live('click', function() {
			var excludeFlag = false;
			if($('#manageSavedEAForm .exclude:checked').val() !== undefined){
				excludeFlag = $('#manageSavedEAForm .exclude:checked').val();
			}
			that.createDataTable(that.CONST_OBJ['savedRelDt'], ela.globalVar.getFilterResultsUrl, true, false,excludeFlag);
			//$('#manageSavedEAForm .clearFilterBtn').removeClass('disabled').attr('disabled',false);
			that.saveTabfilterCount = that.saveTabfilterCount+1;
		});
		
		//Clearing filter results  Managed Tab		
		$('#manageSavedEAForm .clearFilterBtn').live('click', function() {
			$('.filterInput','#manageSavedEAForm').val(that.EMPTY_STRING);
			$('.strong','#manageSavedEAForm').removeAttr('checked');			
			$('.include','#manageSavedEAForm').attr('checked','checked');			
			that.createDataTable(that.CONST_OBJ['savedRelDt'], ela.globalVar.getFilterResultsUrl, true, true, false);
			//$('#manageSavedEAForm .clearFilterBtn').addClass('disabled').attr('disabled',true); 
			that.saveTabfilterCount = 0;
		});
		
		// Delete Row input El
		$('#researchAcctContainer').find('.del').live('click', function() {
			var $this = $(this),
				inputArrlen = $this.closest('.rowscontainer').find('.input-field').length,
				$inputEl = $this.closest('.rows').find('.input-field');
			
			delete that.existingEasObj[$inputEl.attr('data-id')];
			if(inputArrlen === 1){
				$this.closest('.rows').find('.input-field').attr('value','');
				$this.closest('.rows').find('.radio-primarykey').attr('checked', false);
				$this.closest('.rows').find('.radiogrp').removeClass('checked');
				$this.closest('.rows').find('.primaryKeyMessage').hide();
				$('.clearAllBtn').addClass('disabled').attr('disabled',true);
			}else{
				$this.closest('.rows').remove();
			}
			that.toggleResearchAccountBtnState();
			return false;
		});
		//clear all input El
		$('#researchAcctContainer').find('.clearAllBtn').live('click', function() {
			that.existingEasObj = {};
			$('#researchAcctContainer .accountNumber .input-field').each(function(i,v) {
				(i > 0)? $(this).closest('.rows').remove() : null;
				(i === 0)? $(this).attr('value',that.EMPTY_STRING) : null;
			});

			$('#researchAcctContainer .eaNumbers .input-field').each(function(i,v) {
				(i > 0)? $(this).closest('.rows').remove() : null;
				(i === 0)? $(this).attr('value',that.EMPTY_STRING) : null;
			});
			$('.radiogrp').removeClass('checked');
			$('.primaryKeyMessage').hide();
			$('.clearAllBtn').addClass('disabled').attr('disabled',true);
			$('.researchAccBtn').addClass('disabled').attr('disabled',true);
		});

		$('#researchAcctContainer .radiogrp').live('click', function() {
			var $this = $(this), 
				$inputEl = $(this).parent('.rows').find('.input-field'), 
				$selectedRadio = $this.parent('.rows').find('.radio-primarykey');

			if ($inputEl.val() === that.EMPTY_STRING) {
				//$inputEl.val(that.CONST_OBJ['empty']);
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
			if (inputVal === that.CONST_OBJ['empty']) {
				$(this).val(that.EMPTY_STRING);
			}
		});
		$('#manageSavedEAForm .input-field').live('blur', function() {
			var inputVal = $(this).val();
			//console.log(inputVal);
			
			if (inputVal === that.EMPTY_STRING) {
				$(this).val(that.CONST_OBJ['empty']);
			}
		});
		//Feedback functionality start
		$('.summary').live('focus', function() {
		      var inputVal = $(this).val();
		      //console.log(inputVal);
		      if (inputVal === that.CONST_OBJ['summarytext']) {
		        $(this).val(that.EMPTY_STRING);
		      }
		    });

		    $('.summary').live('blur', function() {
		      var inputVal = $(this).val();
		      //console.log(inputVal);
		      
		      if (inputVal === that.EMPTY_STRING) {
		        $(this).val(that.CONST_OBJ['summarytext']);
		      }
		    });
		    $('.summary').bind('paste keyup', function(e){
		        var LIMIT = 50;
				var chunks = [];
				var result;
				var str = $(this).val();
				str = str.replace(/(\r\n|\n|\r)/gm,"");
				//console.log('Str:' + str);
				var charsLength = str.length
				//for (var i = 0 ; i < charsLength; i += LIMIT) {
				//   chunks.push(str.substring(i, i + LIMIT));
				//}
				//console.log(charsLength);
				//if(chunks.length > 6){
				  // $('textarea').addClass('addScroll');
				//}else{
				//	$('textarea').removeClass('addScroll');
				//}
				//result = chunks.join('\n');
				
				if (charsLength >= 10 && charsLength <=1000) {
					  $('.SubmitFeedBackbtn').removeClass('disabled').attr('disabled', false);
				  
				}else if (charsLength > 1000){
					  //console.log('more than 1000');
					chunks = [];
					  str = str.substr(0, 1000);
					  $('.summary').val(str);
					 //var charsLength = str.length
					// for (var i = 0 ; i < charsLength; i += LIMIT) {
					 //  chunks.push(str.substring(i, i + LIMIT));
					// }
					// result = chunks.join('\n');
					  //$('.userFeddBackSummary').val(truncVal);
					  e.preventDefault();
				}else {
					  $('.SubmitFeedBackbtn').addClass('disabled').attr('disabled', true);
				} 
				//console.log(result);
				//$('.summary').val(result);
		      });
			  
			  $('.cancelFeedBackbtn').live('click',function(){
				vmf.modal.hide();
			  });
			  
			  $('.SubmitFeedBackbtn').live('click',function(){
                  var SavedEA = false;                                 
                      var activeTab = $('#researchAcctContainer .tabbed_area').children('.tabs').find('.active').attr('title');
                      if(activeTab === 'manageSavedEAForm'){
                             SavedEA = true;
                      }else{
                             SavedEA = false;
                      }
                var postData = {
                             'requestor' : $.trim($('.requestor').val()),
                             'userProfile' : $.trim($('.userProfile').val()),
                             'reason' : $.trim($('.reason option:selected').val()),
                             'summary' : $.trim($('.summary').val()),
                             'SavedEA' : SavedEA
                        };
                        $('.userFeedBackBodyContent,.bottomArea').hide();
                        $('<div class="loading_small clearfix">Loading...</div>').appendTo('#userFeedBackModalWindow .body');
                        vmf.ajax.post(ela.globalVar.getEmailMessageDetailsUrl, postData, function(data) {
                        	var status = data.emailStatus ? data.emailStatus : false;
                			if (status === true) {
                				$('#userFeedBackModalWindow .loading_small').hide();
                				$('.userFeedBacksuccessContent').show();
                			}else{
                				var tryagainvar = that.CONST_OBJ['TryAgain'];
                				
                				$('.userFeedBacksuccessContent').html(tryagainvar).show();
                				$('#userFeedBackModalWindow .loading_small').hide();	
                			}
                               
                        });
                });
			  $('.successFeedBackbtn').live('click',function(){
				  vmf.modal.hide();
			  });


		//Feedback functionality end
		
		//tabs functionality start  here
		$('#researchAcctContainer .tabbed_area').each(function() {
			var $this = $(this), content_show;
			if ($this.children('.tabs').length > 0) {
				$this.children('.main-container-wrapper').hide();
				content_show = $this.children('.tabs').find('.active').attr('title')
				$('#' + content_show).show();
			}
		});

		$("#researchAcctContainer .tabbed_area a.tab").click(function(e) {
			e.preventDefault();
			$('.main-container-wrapper').hide();
			$this = $(this);
			$this.parents('.tabs:eq(0)').find(".active").removeClass("active");
			$this.addClass("active");
			$this.parents('.tabbed_area:eq(0)').children(".main-container-wrapper").hide();
			var content_show = $(this).attr("title");
			if($this.attr('title') === 'manageSavedEAForm'){
				myvmware.ela.resetTab();
			}
			$("#" + content_show).show();
			//return false;
		});

		//tabs functionality end  here
		$('#manageSavedEAForm').find('.savedRelTypeCont input').live('keyup', function() {
			var sresult,
				sendData = {},
				secVal,
				inputVal = $.trim($(this).val());
				
			if (inputVal !== that.EMPTY_STRING && inputVal !== that.CONST_OBJ['empty']) {
				if($('#manageSavedEAForm .loading_small').is(':visible')){
					return;
				}
			}
			
			that.showHideRelationshipsBtn();
		});

		$('#manageSavedEAForm').find('.savedRelSecTypeCont input').live('keyup', function() {
			that.showHideRelationshipsBtn();
		});
		
		$('.filterContainer').live('change keyup', function(e){
			that.toggleFilterResultsBtnState();
		});

		
		$('.ajaxfire','#manageSavedEAForm').live('click', function() {
				var sresult,
				sendData = {},
				secVal,
				$parentSelector = '#manageSavedEAForm',
				$ajaxfireBtn = $('.ajaxfire',$parentSelector),
				primaryInputVal = $.trim($('.savedRelTypeCont input').val()),
				primaryInputType = $.trim($('#savedRelAccountIdorNo').val()),
				inputVal = $.trim($(this).val());
					if($('#manageSavedEAForm .loading_small').is(':visible')){
						return;
					}
					secVal = $('.savedRelSecTypeCont input').val();
					if (secVal == that.CONST_OBJ['empty']) {
						secVal = that.EMPTY_STRING;
					}
					if(primaryInputVal ==='Please enter a value' || primaryInputVal === ''){
						primaryInputVal = null;
						primaryInputType = null;
					}
					sresult = {
						'selectedAccountType' : primaryInputType,
						'selectedAccountId' : primaryInputVal,
						'selectedCriteria' : $('#savedRelSecAccountIdorNo').val(),
						'selectedCriteriaValue' : $.trim(secVal),
						'profile' : $('#savedRelProfile').val()
					};
					
					$('<div class="loading_small clearfix">Loading...</div>').appendTo('#manageSavedEAForm');
					sendData['jsonData'] = vmf.json.objToTxt(sresult);
					$ajaxfireBtn.addClass('disabled').attr('disabled',true);
					$('.filterInput','#manageSavedEAForm').val(that.EMPTY_STRING);
					$('.strong','#manageSavedEAForm').removeAttr('checked');
					$('#manageSavedEAForm .filterContainer').hide();
					$('.publishEaBtn').addClass('disabled').attr('disabled',true);
					$('.relationSearch', $parentSelector).die().addClass('disabled');
					//$(".relationSearchContent", $parentSelector).html(that.EMPTY_STRING);
					$('#savedRelationshipDataTableCont').html(that.EMPTY_STRING);
					$('.relationSearchNoRecords').hide();
					$('.savedStatus, .savedRelationshipDataTableActions').hide();
					$('.relationSearch', $parentSelector).hide();
					vmf.ajax.post(ela.globalVar.getRelationshipsUrl, sendData, function(data) {
						var responseData = data.relationshipsList.relation,
							accountType = $('#savedRelAccountIdorNo').val();
						
						$('#manageSavedEAForm .loading_small').remove();
						that.createRelationSearchMarkup(responseData, accountType);
					},function(){
						//$(".relationSearchContent", $parentSelector).html(that.CONST_OBJ['noRecords']);
						$('.relationSearchNoRecords').html('<div class="warning-msg clearfix">' + that.CONST_OBJ['delRecords'] + '</div>').show();
					});
				});
		$('.showMore','#manageSavedEAForm').live('click', function(e) {
			e.preventDefault();
			var $ele = $(this),
				isTxnList = $ele.closest('div').hasClass('transactionRelated'),
				count;
				if($ele.hasClass('disabled')){
					return false;
				}
				if(isTxnList){
					that.txns += 5;
					count = that.txns;
				}else{
					that.acnts += 5;
					count = that.acnts;
				}
				$ele.attr("disabled","disabled").addClass("disabled");
				$ele.next().show();
				vmf.ajax.post(ela.globalVar.getNextSavesUrl, 
				{
					'nR' : count,
					'isTxn' : isTxnList
				}, function(data) {
						var response = data.relationshipsList;
						if(typeof response !== 'undefined'){
							that.createRelationSearchMarkup(response.savesList, null, true);
							$ele.next().hide();
							if(!response.allowNext){
								$ele.attr("disabled","disabled").addClass("disabled");
							}else{
								$ele.removeClass("disabled").removeAttr('disabled')
							}
						}
				});
		});
		
		$('.refreshTab','#manageSavedEAForm').live('click', function(e){
				e.preventDefault();
				that.resetTab();
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
			that.toggleResearchAccountBtnState();
		});

		
		if ($(".editable").length > 0) {
			
			var $thisInput = $('.editable'),
				parentNode = $thisInput.closest('.rows'),
				inputVal,
				acctId,
				acctName;
				
			if($thisInput.val() !== that.EMPTY_STRING){
				inputVal = $thisInput.val().split(' ');
				acctId = $.trim(inputVal[0]);
				inputVal.shift();
				acctName = $.trim(inputVal.join(' '));
				$thisInput.attr('data-id', acctId).attr('data-name', acctName);	
				parentNode.find('.primaryKeyMessage').show().html(that.CONST_OBJ['primaryKeyMessage']);
				parentNode.find('.radiogrp').addClass('checked');
				parentNode.find('.radio-primarykey').attr('checked', true);
				$('#researchAccountsForm .researchAccBtn').removeClass("disabled").removeAttr('disabled');
				$('#researchAccountsForm .clearAllBtn').removeClass("disabled").removeAttr('disabled');
			}
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
			var $ele = $('<input/>',{
				'type': 'text',
    			'class': 'input-field primary',
    			'id': 'savedRelSecType',
    			'value': that.CONST_OBJ['empty']
			});
			$('#manageSavedEAForm .savedRelSecTypeCont').empty().html($ele);
			//$('#manageSavedEAForm .savedRelSecTypeCont').empty().html('<input type="text" class="input-field primary" id="savedRelSecType" value="Please enter a value"/>');
			that.autoSuggest($('#savedRelSecType'), ela.globalVar.getIDListUrl, $('#savedRelSecAccountIdorNo').val());
		});
		
		//that.autoSuggest($('#savedRelType'), ela.globalVar.getSavedAccountsListUrl, $('#savedRelAccountIdorNo').val());
		
		$("#savedRelAccountIdorNo").change(function() {
			$('#savedRelType').val(that.CONST_OBJ['empty']);
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
			return false;
		});
		$('#savedEaLookUpModal .serachNames').live('click',function(){
			$('#savedEaLookUpModal .showNames').hide();
			$('#savedEaLookUpModal .lookupNoRecords').hide();
			$('#savedEaLookUpModal .loading_small').show();
			var postData = {
				'category' : $('#savedRelAccountIdorNo').val(),
				'searchField' :$.trim($('#savedEaLookUpModal .nameSearchInput').val())
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
			var nameSearchInputVal =$.trim($(this).val()),
				resultValue = nameSearchInputVal.replace(/%/g,""); 

			if (resultValue.length >= 3) {
				$('#savedEaLookUpModal .serachNames').removeClass('disabled').attr('disabled',false);
			}else{
				$('#savedEaLookUpModal .serachNames').addClass('disabled').attr('disabled',true);

			}
		});

		$('.accountLookUpName').live('click',function(){
			$('.selectValue').removeClass('disabled').attr('disabled',false);

		});
		
		$('.tableFilterContainer .rulesContainer li').die().live('click',function(event){
			if(event.target.nodeName !== 'INPUT'){
				 return;
			}
			var $this = $(this),
				 dataKey = '';
			if(event.target.nodeName === 'INPUT'){
				 dataKey = 'data-' + $(event.target).attr('class');
				 $(event.target).is(':checked') ? $this.attr(dataKey, $(event.target).val()) : $this.attr(dataKey, '');
			}			
	   });

	/*-----------Saved Ea Lookup code -------END-------------*/
			$('.savepreferences').die().live('click',function(){
				var filterMap = that.populateUserPreferences();
				var tableId = $('.main-container-wrapper').filter(':visible').find('table').attr('id');
				var savedRelFlag = false;
				if(tableId === that.CONST_OBJ['savedRelDt']){
					savedRelFlag = true;
				}

				var excludeFlag = false;
				if($('#userPreferencesModalWindow .usrExclude:checked').val() !== undefined){
					excludeFlag = $('#userPreferencesModalWindow .usrExclude:checked').val();
				}
				var count = 0;
				for(var prop in filterMap.rule){
					count++;
				}
				if (filterMap.countries =="" && filterMap.customerDomain == "" && filterMap.eaName =="" && count===0) {
					excludeFlag = false;
				} 
				var pdata = {
					'filterCriteriaMap' : filterMap,
					'clearFilterFlag' : false,
					'sEcho' : 1,
					'position' : 0,
					'iDisplayLength': 500,
					'negationFlag':excludeFlag,
					'savedRelFlag':savedRelFlag
				};
				var filterRes = {
				  'filterCriteria' : vmf.json.objToTxt(pdata)
				 };
				
				vmf.ajax.post(ela.globalVar.saveUserPreferenceUrl,filterRes, function(data) {
					var jData = ( typeof data === 'object') ? data : vmf.json.txtToObj(data);
					if(jData.status=== 'success'){
						that.createDataTable(tableId, ela.globalVar.getFilterResultsUrl, true, false, false, filterRes);
					}
			    });
  			vmf.modal.hide();
		});
		$('.cancelPreferencesBtn').live('click',function(){
			vmf.modal.hide();
		});

		$('.userPreferences').live('click',function(){
			vmf.modal.show('userPreferencesModalWindow')
			vmf.ajax.post(ela.globalVar.showUserPefUrl, null, function(data) {
			if($.isEmptyObject(data.userPrefJSON)){
			return;
			}
				var ruleMap  = data.userPrefJSON.rule;
			  $('.userPreferencesFilterByCountry').val(data.userPrefJSON.countries);
			  $('.userPreferencesFilterByDomain').val(data.userPrefJSON.customerDomain);
			  $('.userPreferencesFilterByName').val(data.userPrefJSON.eaName);			 
				var target = '';
				if(data.userPrefJSON.includeExclude !== undefined){
					if(data.userPrefJSON.includeExclude){
						target = '.usrExc';
					}else{
					    target = '.usrInc';
					}
				}else{
					target = '.usrInc';
				}
			    $(target).attr('checked',true);
			  	$('.userRulesContainer li').each(function(i,el){
				var $this = $(el);
				if(ruleMap !== undefined){		
					if(ruleMap[$this.attr('class')]){
						$this.find('.strong').attr('checked', true);
					}
				}
			  });
			});
		});
	},
	
	/* ---------------------------------- Enable / Disable Research Account Button --------------------------------*/
	toggleResearchAccountBtnState : function(){
		var that = myvmware.ela,
			flag = false,
			inputVal,
			$researchAccBtn = $('#researchAccountsForm .researchAccBtn');
		
		$('#researchAccountsForm').find('.input-field').each(function(i, inputEl) {
			inputVal = $(inputEl).val();
			if (inputVal !== that.EMPTY_STRING && inputVal !== that.CONST_OBJ['empty']) {
				flag = true;
			}
		});
		
		(flag) ? $researchAccBtn.removeClass("disabled").removeAttr('disabled') : $researchAccBtn.addClass("disabled").attr('disabled',true);
	},	
	showHideRelationshipsBtn : function(){
		var that = myvmware.ela,
			$parentSelector = '#manageSavedEAForm',
			$ajaxfireBtn = $('.ajaxfire',$parentSelector),
			inputVal = $.trim($('#manageSavedEAForm').find('.savedRelTypeCont input').val()),
			secVal = $.trim($('.savedRelSecTypeCont input').val());
		
		if ((inputVal !== that.EMPTY_STRING && inputVal !== that.CONST_OBJ['empty']) 
			||	(secVal !== that.EMPTY_STRING && secVal !== that.CONST_OBJ['empty'])) {
			$ajaxfireBtn.removeClass('disabled').removeAttr('disabled');
		} else {
			$ajaxfireBtn.addClass('disabled').attr('disabled',true);  
		}
	},
	
	populateUserPreferences : function(){
		var ruleMap = {},
			$this,
			filterMap,
			that = myvmware.ela;		 
  		$('.userRulesContainer li').each(function(i,el){
    		var $this = $(el)
          	filterText = null;
        
	        if($(this).find('.strong').is(':checked')){
	          filterText = 'S,W';
	          ruleMap[$(this).attr('class')] = filterText;
	        } 
      	});

	  	filterMap = {
	        'countries' : $.trim($('.userPreferencesFilterByCountry').val()),
	        'customerDomain' : $.trim($('.userPreferencesFilterByDomain').val()),
	        'eaName' : $.trim($('.userPreferencesFilterByName').val()),
	        'rule' : ruleMap
	     };
	        
    return filterMap;
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
			startText : flag ? autoSuggestEl.val() :that.CONST_OBJ['empty'],
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

	/* --------------------------------Post Parameters for filterResults ---------------------------------------------------------*/
	postFilterParameters : function(tableId) {
	       var ruleMap = {};           
           $('#'+tableId+' .tableFilterContainer .rulesContainer li').each(function(i,el){
				var $this = $(el),
					filterText = null;
				
				if($this.find('.strong').is(':checked')){
					filterText = 'S,W';
					ruleMap[$this.attr('class')] = filterText;
				}	
		   });
            				
			var filterMap = {
				'countries' : $.trim($('#'+tableId+' .filterByCountry').val()),
				'customerDomain' : $.trim($('#'+tableId+' .filterByDomain').val()),
				'eaName' : $.trim($('#'+tableId+' .filterByName').val()),
				'rule' : ruleMap
			};
				
		return filterMap;

		//console.log(filterMap.rule);
	},
	
	toggleFilterResultsBtnState : function(){
		 var that = myvmware.ela,
		 	resultFlag = false, 
		  	inputFlag = false,
			checkboxFlag =  false;
			//console.log(e.type + ';' + e.target);
			that.filterCount = 0;
			that.saveTabfilterCount = 0;

			var tabContainerId = $('.main-container-wrapper').filter(':visible').attr('id');

			$('#' + tabContainerId).find('.rulesContent .strong').each(function(){
				if($(this).attr('checked')){ 
					inputFlag = true;
				}
			});	

			$('#' + tabContainerId).find('.filterInput').each(function(){
				if ($.trim($(this).val()) !== that.EMPTY_STRING ) {
					checkboxFlag = true;			
				} 
			});

			resultFlag = inputFlag || checkboxFlag;

			if(resultFlag){
				$('#' + tabContainerId).find('.filterBtn').removeClass('disabled').attr('disabled',false);
				if (tabContainerId =="researchAccountsForm") {
					that.filterCount = that.filterCount+1;
					//console.log(that.filterCount);

				}else{
					that.saveTabfilterCount = that.saveTabfilterCount+1;
					//console.log(that.saveTabfilterCount);
				}
			}else{
				$('#' + tabContainerId).find('.filterBtn').addClass('disabled').attr('disabled',true);
				if (tabContainerId =="researchAccountsForm") {
					that.filterCount = 0;
					//console.log(that.filterCount);

				}else{
					that.saveTabfilterCount = 0;
					//console.log(that.saveTabfilterCount);
				}
			}
	},
	/* -------------------------------- Post Parameters for EA Research / Saved Relationship  ------------------------------------*/
	postAjaxParameters : function(postData, id,userSavesFlow) {
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
				if (resultValue !== that.EMPTY_STRING && resultValue !== that.CONST_OBJ['empty']) {
					resultValue = resultValue.split(' ');
					inputElVal = resultValue[0];
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
			postData.push({
				'name' : 'sEcho',
				'value' : 1
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
					
					$('#savedRelAccountIdorNo').data('relData',{
						'headerId' : headerId,
						'type' : type,
						'userProfile' : ela.globalVar.elaProfileName,
                        'selectedProfile' : document.getElementById('savedRelProfile').value						
					});
				}

			});
			postData.push({
				'type' : type,
				'headerId' : headerId,
				'sEcho' : 1,
				'input'	: $('#savedRelAccountIdorNo').val(), 
				'value'	: $('#savedRelType').val()
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
                    myvmware.hoverContent.bindEvents($thisEl, 'defaultfunc','','', true);
                  }
            });  
       }   
          
	},

	/* -------------------------------- Showing/Hiding Error Message on the page ------------------------------------*/
	showHideErrorMessage : function(msg, el) {
		if(msg){
			if(el){
				$('#'+el).closest('.main-container-wrapper').children('.errorMessage').show().html(msg);
				$(window).scrollTop(0);
			}else{
				$('#errorMsg').show().html(msg);
				$(window).scrollTop(0);
			}
		}else{
			$('#errorMsg,.errorMessage').hide();
		}
	},

	showHideErrorMessageWindow : function(msg, el) {
		if(msg){
			$('#saveAccountsModalWindow #errorMsgWindow').show().html(msg);
			$(window).scrollTop(0);
		}else{
			$('#saveAccountsModalWindow #errorMsgWindow').hide();
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
	
	attachListenerForUserSaves : function(isUserSaveFlow){
		var that = myvmware.ela,
			$parentSelector = '#manageSavedEAForm',
			$relationRadioGrp = $(".relationRadio", $parentSelector);
			$relationRadioGrp.die().live('change', function() {
				if($(this).is(':checked')){
					$('.savedRelationshipBtn',$parentSelector).removeClass('disabled').removeAttr('disabled');
					$('.savedRelationshipBtn',$parentSelector).die().live('click',function(){
						$('.relationSearch').hide();
						that.createDataTable(that.CONST_OBJ['savedRelDt'], ela.globalVar.getShowSelectedRelationshipUrl, false, false, false,undefined,isUserSaveFlow);
						$('#savedRelationshipDataTableCont').show();
						//$('#manageSavedEAForm .filterContainer').show();
					});
				}
			});
	},
	createRelationSearchMarkup : function(arr, accountType,isUserSaveFlow,isNew,states){
		var $parentSelector = '#manageSavedEAForm',
			$relationRadioGrp = $(".relationRadio", $parentSelector),
			relSearchContainer = $(".relationSearch", $parentSelector)
			that = myvmware.ela;
		
		if(arr === null){ // No Data Found
			$('.relationSearchNoRecords').html('<div class="warning-msg clearfix">' + that.CONST_OBJ['noRecords'] + '</div>').show();
			relSearchContainer.hide();
			$('.savedStatus, .savedRelationshipDataTableActions').hide();
			$('.ajaxfire').removeClass('disabled').removeAttr('disabled');
			$('#manageSavedEAForm .filterContainer').hide();
			//$('#manageSavedEAForm .clearFilterBtn').addClass('disabled').attr('disabled',true);
			return;
		}
		
		var	relSearchContent = $(".relationSearchContent", $parentSelector),
			arrLen = arr.length,
			holders = that.createMarkup(arr, accountType,isUserSaveFlow),
			accountHolder = holders[0],
			transactionHolder = holders[1],
		    acntHeader = ela.globalVar.accntTitle,
			txnHeader = ela.globalVar.txnTitle,
			showMoreBlk = ela.globalVar.showMoreEle,
			last5Note = ela.globalVar.last5Ele,
			noSaves = ela.globalVar.noSavesMsg,
			ahtml = '',thtml='';
		
		if(!isUserSaveFlow){
			relSearchContainer.find('.relHeader').show();
			relSearchContainer.find('.savesHeader').hide();
			if(accountHolder.length > 0){
				ahtml = acntHeader + '<ul>'+accountHolder.join('')+'</ul>';
			}
			if(transactionHolder.length > 0){
				thtml = txnHeader + '<ul>'+transactionHolder.join('')+'</ul>';
			}
			relSearchContent.find('.accountRelated').html(ahtml);
			relSearchContent.find('.transactionRelated').html(thtml);
		}else{
			relSearchContainer.find('.relHeader').hide();
			relSearchContainer.find('.savesHeader').show();
			if(isNew){
				ahtml = acntHeader +' '+ last5Note;
				if(accountHolder.length > 0){
					ahtml = ahtml +'<ul>'+accountHolder.join('')+'</ul>';
					if(states[0]){
						ahtml += showMoreBlk;
					}
				}else{
					ahtml = ahtml +'<ul><li>'+noSaves+'</li></ul>';
				}
				thtml = txnHeader +' '+ last5Note;
				if(transactionHolder.length > 0){
					thtml = thtml +'<ul>'+transactionHolder.join('')+'</ul>';
					if(states[1]){
						thtml += showMoreBlk;
					}
				}else{
					thtml = thtml +'<ul><li>'+noSaves+'</li></ul>';
				}
				relSearchContent.find('.accountRelated').html(ahtml);
				relSearchContent.find('.transactionRelated').html(thtml);
			}else{
				if(accountHolder.length > 0){
					relSearchContent.find('.accountRelated ul').html(accountHolder.join(''));
				}else{
					relSearchContent.find('.transactionRelated ul').html(transactionHolder.join(''));
				}
			}
			
		}
		
		if(arrLen === 1 && !isUserSaveFlow){
			$(".relationRadio", $parentSelector).first().attr('checked',true);
			if($(".relationRadio", $parentSelector).is(':checked')){
				 relSearchContainer.hide();
				 $('.relationSearchNoRecords').hide();
				 $('#savedRelationshipDataTableCont').show();
				 that.createDataTable(that.CONST_OBJ['savedRelDt'], ela.globalVar.getShowSelectedRelationshipUrl, false, false, false,undefined,true);
				// $('#manageSavedEAForm .filterContainer').show();
			}
		}
		if((arrLen >= 0 && isUserSaveFlow) || arrLen > 1){
			$('.savedStatus', $parentSelector).hide();
			$('.savedRelationshipDataTableActions').hide();
			$('.relationSearchNoRecords').hide();
			$('#savedRelationshipDataTableCont').hide();
			relSearchContainer.show();
			$('.relationSearchNoRecords').hide();
			$('.savedRelationshipBtn',$parentSelector).addClass('disabled').attr('disabled','disabled');
			that.attachListenerForUserSaves(isUserSaveFlow);			
		}
		$('.ajaxfire').removeClass('disabled').removeAttr('disabled');
	},
	
	createMarkup : function(arr, accountType, isUserSaveFlow){
		var that = myvmware.ela, 
			i,
			
			arrLen = arr.length,
			resultObj = {},
			accountHolder = [],
			transactionHolder = [],
			listTemplate,
			acctNumber,
			acctType,
			//accountType = (accountType === 'accountID') ? 'accountId' : 'eaNumber', // map accountType to Key's
			subType,
			subTypeId,

			mapObject = {
				'SFDC ACCOUNT' : 'VMStar Account ID',
				'EA' : 'EA Number',
				'opportunityId' : 'Opportunity ID',
				'quoteId' : 'Quote ID',
				'caseId' : 'Case Number'
			},
			
			profile = document.getElementById('savedRelProfile').value,
			html;
		
		for( i =0; i < arrLen; i++){
			resultObj = arr[i];
			subType = resultObj['opportunityId'] ? mapObject['opportunityId'] : (resultObj['quoteId']? mapObject['quoteId']: mapObject['caseId']);
			subTypeId = resultObj['opportunityId'] ? resultObj['opportunityId'] : (resultObj['quoteId']? resultObj['quoteId']: resultObj['caseId']);
			acctNumber = (resultObj['primaryKeyType'] === 'EA') ? resultObj['eaNumber'] : resultObj['accountId'];
			if(resultObj['type'] === 'accountRelated'){
				html = '<input type="radio" name="acct" value="' + resultObj.headerId + '" class="relationRadio" /> ' + mapObject[resultObj.primaryKeyType] + ":" + acctNumber +", "+resultObj['primaryAcntName'] ;
				
				if(profile === 'any' || isUserSaveFlow){
					html += '  Profile :'+resultObj['profile'];
				}
				listTemplate = '<li>'+html+'</li>';
				accountHolder.push(listTemplate);
			}
			
			if(resultObj['type'] === 'transactionRelated'){
				
				html = '<input type="radio" name="acct" value="' + resultObj.headerId + '" class="relationRadio" /> ' + mapObject[resultObj.primaryKeyType] + ":" + acctNumber+ ", "+resultObj['primaryAcntName'] + " " + subType + ":" + subTypeId;
				if(profile === 'any' || isUserSaveFlow){
					html += '  Profile :'+resultObj['profile'];
				}
				listTemplate = '<li>'+html+'</li>';
				transactionHolder.push(listTemplate);
			}
		}
		var holders = [];
		holders.push(accountHolder,transactionHolder);
		return holders;
	},
	
	resetTab : function(){
		var that = myvmware.ela;
	    vmf.modal.show('loadingWindow',{
			'close' : false,
			'escClose': false
		});	
		
		vmf.ajax.get(ela.globalVar.getRefreshTabUrl, null,function(data){
			var response = data.relationshipsList;
			if(typeof response !== 'undefined'){
				var states = [response.allowNxtAcnts,response.allowNxtTxns];
				that.createRelationSearchMarkup(response.returnList, null, true,true,states);
				// reset other fields
				$('#savedRelAccountIdorNo').val('accountId');
				$('.savedRelTypeCont input').val(that.CONST_OBJ['empty']);
				$('#savedRelSecAccountIdorNo').val('opportunityId');
				$('.savedRelSecTypeCont input').val(that.CONST_OBJ['empty']);
				$('#savedRelProfile').val('any');
				$('.ajaxfire').addClass('disabled').attr('disabled','disabled');
				$('.filterInput','#manageSavedEAForm').val(that.EMPTY_STRING);
				$('.strong','#manageSavedEAForm').removeAttr('checked');			
				$('.include','#manageSavedEAForm').attr('checked','checked');
				$('.filterContainer','#manageSavedEAForm').hide();
				that.saveTabfilterCount = 0;
				that.acnts = response.acntsCount;
				that.txns = response.txnsCount;
				
			}
			vmf.modal.hide();
		});
	},

	/* -------------------------------- Fire Ajax for SaveResults ------------------------------------*/
	fireSaveResults : function(criteriaVal,tableId,showBI) {
		var that = myvmware.ela, 
			eaValue = '', 
			oppQuoteFlag = '', 
			oppQuoteId = '', 
			map = {}, 
			postData = {}, 
			selectedEAs = [], 
			checkedRows = $('#' + tableId).find('.delAcctCheckBox:checked'), 
			$primaryKey = $('.radio-primarykey:checked'), 
			$parent = $primaryKey.closest('.rowscontainer'), 
			acctType = '',
			selectedInputVal,
			primaryAcct,
			primaryAcctName = '',
			sFlag = false,
			savedRelFlag = false;
	
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
				oppQuoteId = $.trim($('#oppQuote').val());
			}
		}
		
		checkedRows.each(function() {
			var eaNos = $(this).val();
			map[eaNos] = $(this).data('coldata');
		});

		if(tableId === that.CONST_OBJ['resEaDt']){
			if ($parent.hasClass('accountNumber')) {
			 acctType = 'SFDC ACCOUNT';
			} else if ($parent.hasClass('eaNumbers')) {
			 acctType = 'EA';
			}
			selectedInputVal =  $('.radio-primarykey:checked').siblings().find('.input-field').val().split(' ');
			primaryAcct = selectedInputVal.shift();
			primaryAcctName = selectedInputVal.join(' ');
		}else{
			var type = $('#savedRelAccountIdorNo').val();
			if(type === 'accountId'){
				acctType = 'SFDC ACCOUNT';
			}else if(type === 'eaNumber'){
				acctType = 'EA';
			}
			primaryAcct = $('.savedRelTypeCont').find('.primary').val();
			primaryAcctName = $('#savedRelAccountIdorNo').data('acntName');
			savedRelFlag = true;
		}

		if($('#'+tableId).find('.selectall').is(':checked')){
		  sFlag = true;
		}
		var sresult = {
			'primaryAcct' : primaryAcct,
			'primaryAcctType' : acctType,
			'primaryAcctName':  primaryAcctName,
			'comment' : $('#saveAccountsModalWindow').find('.comments').val(),
			'eaNumbers' : map,
			'oppQuoteFlag' : oppQuoteFlag,
			'oppQuoteId' : oppQuoteId.toUpperCase(),
			'saveType' : 'saveEA',
			'selectAll' : sFlag,
			'savedRelTab' : savedRelFlag,
			'status' : $('#savedRelStatus').val()
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
					if((jdata.response.status === 'quoteOpp_success') || (criteriaVal === 'saveEa' && jdata.response.status === 'success')){
						$('#saveAccountsModalWindow').find('#statusMsg').html(jdata.response.message);
						$('#saveEaWindow,#saveUpdateEaWindow').hide();
						$('#saveAccountsModalWindow').find('#statusMsgWindow').show();
						$('#saveAccountsModalWindow').find('.close').die().live('click', function(){
							vmf.modal.hide();
							if(showBI){
								that.openBIDashboard(tableId);
							}
						});		
					}
				});
			};

			if(status === 'quoteOpp_success' || (criteriaVal === 'saveEa' && status === 'success')){
				$('#saveAccountsModalWindow').find('#statusMsg').html(data.response.message);
				$('#saveEaWindow,#saveUpdateEaWindow').hide();
				$('#saveAccountsModalWindow').find('#statusMsgWindow').show();
				$('#saveAccountsModalWindow').find('.close').die().live('click', function(){
					vmf.modal.hide();
					if(showBI){
						that.openBIDashboard(tableId);
					}
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
					/*omniture start here for Add to list*/
					if($(this).parent('div').attr('id')=="saveUpdateEaWindow"){
					if(typeof riaLinkmy !="undefined"){
						riaLinkmy('XELArate : saveRelation : addToExisting');
						}
					}
					/*omniture end here for Add to list*/
				});

				$('#quotableAssetsModelWindow .replaceList, #saveAccountsModalWindow .replaceList').die().live('click', function(){
					sresult.type = 'replace';
					postData['result'] = vmf.json.objToTxt(sresult);
					handler(postData);
					/*omniture start here for Replace list*/
					if($(this).parent('div').attr('id')=="saveUpdateEaWindow"){
					if(typeof riaLinkmy !="undefined"){
						riaLinkmy('XELArate : saveRelation : replaceExisting');
					}
					}
					/*omniture start herefor Replace list*/
				});

				$('#quotableAssetsModelWindow .cancelSave, #saveAccountsModalWindow .cancelSave').die().live('click', function(){
					vmf.modal.hide();
					if(status === 'showMW' && criteriaVal === 'showQuote')
						that.openBIDashboard(tableId);
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
			$parent = $('#savedRelAccountIdorNo').val();	
				
			$('#manageSavedEAForm .addToPrimaryList').removeClass('disabled').attr('disabled', false);
			$('#manageSavedEAForm .cancelList').removeClass('disabled').attr('disabled', false);
		
		
		if ($parent == 'accountId') {
			acctType = 'SFDC ACCOUNT';
		} else if ($parent == 'eaNumber') {
			acctType = 'EA';
		}
			
		var sresult = {
			'primaryAcct' :  $('.savedRelTypeCont input').val(),
			'primaryAcctType' : acctType,
			'comment' : $('#savedRelComments').val(),
			'oppQuoteFlag' : $('#savedRelSecAccountIdorNo').val(),
			'profile' : $('#savedRelProfile').val(),
			'oppQuoteId' :	$('.savedRelSecTypeCont input').val()
		};		

		$('.publishAccNo').html(sresult.primaryAcct);
		$('.publishKey').html(sresult.primaryAcctType);
		
		postData['eaResults'] = vmf.json.objToTxt(sresult);

		vmf.ajax.post(ela.globalVar.publishEAList, postData, function(data) {
			var status = data.response.status;
			if (status === 'success') {
				var count = data.response.count;	
				$('.listCount').html(count);
				$('.displayFooter').show();
				$('.addToPrimaryList').addClass('disabled').attr('disabled', true);
				$('.cancelList').addClass('disabled').attr('disabled', true);				
			}
		});
	},
	
	/* -------------------------------- Open BI DashBoard in a popup Window ------------------------------------*/
	openBIDashboard : function(tableId) {
		var that = myvmware.ela, 
			postData = [], 
			eaNos, 
			tableEle = $('#'+tableId),
			checkedRows = tableEle.find('.delAcctCheckBox:checked'), 
			postParams,
			height, 
			width, 
			windowAttr,
			savedRelFlag = false;

		var finalStr = "",
			limit = checkedRows.length;
		var sFlag = false;
		if(tableEle.find('.selectall').is(':checked')){
		   sFlag = true;
		   $('#biEaValue').val(null);
		}
		if(!sFlag){
		  for(var i=0;i< limit;i++){
			eaNos = '\"'+checkedRows[i].value+'\"';
			if(limit-1 != i)			
				finalStr = finalStr+eaNos;
			else
				finalStr = finalStr+eaNos;
		  }
		  $('#biEaValue').val(finalStr); 
		}
		
		height = screen.height;
		width = screen.width;
		windowAttr = "left=0,top=0,titlebar=yes, width=" + width + ",height=" + height;
		
		if(tableId === that.CONST_OBJ['savedRelDt']){
			savedRelFlag = true;
		}
		window.open("/web/vmware/elaib?_VM_BIReport=true&_VM_selectAll="+sFlag+"&_VM_savedEaRel="+savedRelFlag,'_blank', windowAttr);
	},
	
	/* -------------------------------- show Data Table in Modal Window------------------------------------*/
	showDataTableModalWindow : function(eaNo) {
		var that = myvmware.ela,
			modalWidth = 700;

		
		$('#showDtModalWindow .modalContent').width('auto');//to override the modalcontent width
		vmf.modal.show('showDtModalWindow',{minWidth:modalWidth,autoPosition:true});
		var modalWidth = $('#showDtModalWindow .modalContent .body').width();
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
				 { "sTitle": "Party Name", "mDataProp": "partyName", "sClass" : "partyName wrapColumn"},
				 { "sTitle": "DOMAIN(s)", "mDataProp": "domain", "sClass" : "domain wrapColumn"},
				 { "sTitle": "ADDRESS_LINE_1", "mDataProp": "address", "sClass" : "address wrapColumn"},
				 { "sTitle": "CITY", "mDataProp": "city", "sClass":"city", "sClass" : "city wrapColumn"},
				 { "sTitle": "POSTAL_CODE", "mDataProp": "postalCode"},
                 { "sTitle": "Country", "mDataProp": "country", "sClass":"country"}
			 ], 
			"oLanguage" : {
				"sEmptyTable" : that.CONST_OBJ['emptyTable'],
				"sProcessing" : that.CONST_OBJ['processing'],
				"sLoadingRecords" : ""
			},
			"fnRowCallback" : function(nRow, aData, iDisplayIndex) {
				var $nRow = $(nRow);
				$nRow.find('td.domain').html('<span class="wrapText">' + $nRow.find('td.domain').html() + '</span>');
				$nRow.find('td.partyName').html('<span class="wrapText">' + $nRow.find('td.partyName').html() + '</span>');
				$nRow.find('td.address').html('<span class="wrapText">' + $nRow.find('td.address').html() + '</span>');
				$nRow.find('td.city').html('<span class="wrapText">' + $nRow.find('td.city').html() + '</span>');
				return nRow;
			},

			"fnDrawCallback" : function(oSettings) {
				var modalDtRef = this;
				that.addEllipses(modalDtRef, {
					'domain' : 3,
					'city' : 3,
					'country' : 3
				}, true);
				
				
			},
			
			"fnInitComplete" : function(oSettings) {
				/*
				var tblWidth = $('#modalDataTable').width();
				var $modalCont = $('#showDtModalWindow .modalContent .body');
				// Add Horizontal Scroll when table exceeds the available width
				if(modalWidth < tblWidth){
					$modalCont.addClass('addScroll');
					$modalCont.width(modalWidth);
				}else{
					$modalCont.remove('addScroll');
				}*/
			
			}
		});

	},
	
	/* -------------------------------- Update Grooup Count on Every Add/Delete action on DataTable ------------------------------------*/
	updateGroupCount : function(dataTableRef, checkedGrpRows, infoFlag){
		
		 
			
		/*if(oSettings.aoData.length === 0){
			return;
		}*/
	    var i,
			that = myvmware.ela,
	    	indx,
			oSettings = dataTableRef.fnSettings(),
        	aoDataLen = oSettings.aoData.length,
        	iDisplayIndex,
			deleteRecords = 0,
        	sGroup;
        	//groupsCount = {
        		//'Strong' : 0,
        		//'Probable' : 0,
        		//'Possible' : 0
        	//}; 
        
		/*		
        for(i=0; i < aoDataLen; i++ ){	 
            iDisplayIndex = i;
            sGroup = oSettings.aoData[ oSettings.aiDisplay[iDisplayIndex] ]._aData.group;    	                 	 
         //   groupsCount[sGroup] = groupsCount[sGroup] || [];	                               
            groupsCount[sGroup] = groupsCount[sGroup] + 1;
        }
		*/
		var checkedCount = {
			'Strong':0,
			'Probable':0,
			'Possible':0
		};
		
        checkedGrpRows.each(function(){
			var $this  = $(this);			
			checkedCount[$this.attr('data-group')] = checkedCount[$this.attr('data-group')] + 1;
			deleteRecords = deleteRecords + 1;
		});
		
        //console.log(checkedCount);
		
        for( indx in that.groupCounts){

        	that.groupCounts[indx] = that.groupCounts[indx] - checkedCount[indx];		
        	if(that.groupCounts[indx] === 0){
        		dataTableRef.find('tbody tr.'+ indx).remove();
        	}else{
        		dataTableRef.find('tbody .' + indx + ' .count').html(that.groupCounts[indx]);				
        	}
        }
        // Update info section of data table
        if(infoFlag){
        	oSettings._iRecordsTotal = oSettings._iRecordsTotal - deleteRecords;
        	$('#' + dataTableRef[0].id + '_info').html('Showing '+ (startIndex + 1) + ' to ' + (startIndex + aoDataLen) + ' of ' + (oSettings._iRecordsTotal) + ' records');
        }
	},
	
	/* -------------------------------- Hover text on Table Headers------------------------------------*/
	addToolTipForTblHeader : function(dataTableRef){
		
		var hoverMappings = {
			  'ruleCompanyMaster' : ela.globalVar.hvrTxtCompanyMaster,
			  'ruleSavedEA' : ela.globalVar.hvrTxtSavedEA,
			  'ruleDuns' : ela.globalVar.hvrTxtDuns,
			  'ruleOrderBooking' : ela.globalVar.hvrTxtOrders,
			  'ruleCases' : ela.globalVar.hvrTxtCases,
			  'ruleContact' : ela.globalVar.hvrTxtContacts,
			  'ruleEmailDomain' : ela.globalVar.hvrTxtEmailDomain,
			  'ruleNormalizedName' : ela.globalVar.hvrTxtNormalizedName,
			  'ruleEla':  ela.globalVar.hvrTxtElaRule,
			  'manual' : ela.globalVar.hvrTxtManual
		};
		
		var $head = dataTableRef.find('thead');
		var $thEle = $head.find('th.ctryName');
		$thEle.attr('title', ela.globalVar.hvrTxtCountries);
		myvmware.hoverContent.bindEvents($thEle, 'defaultfunc','','', true);
		
		$thEle = $head.find('th.cusDomain');
		$thEle.attr('title', ela.globalVar.hvrTxtDomains);
		myvmware.hoverContent.bindEvents($thEle, 'defaultfunc','','', true);
		
		$thEle = $head.find('th.commentsCol');
		$thEle.attr('title', ela.globalVar.hvrTxtComments);
		myvmware.hoverContent.bindEvents($thEle, 'defaultfunc','','', true);
		
		// End :: Hover text on headers
		var ths = $head.find('th.vh'),
			classString;
		for(var i=0;i<ths.length;i++){
		  $thEle = $(ths[i]);
		  classString = ths[i].className.split(' ')[2];
		  $thEle.attr('title', hoverMappings[classString]);
		  myvmware.hoverContent.bindEvents($thEle, 'funcRight','','', true);
		}
				
	},

	/* ----------------- Populate Filter Section with Response Data (filterCriteria object in Response) on table creat ----*/
	populateFilterData : function($filterContainer, data, negationFlag){
		// Check for empty filterCriteria object
		if($.isEmptyObject(data)){
			return;
		}
		var that = myvmware.ela,
			ruleMap  = data.rule;

		$filterContainer.find('.filterByCountry ').val(data.countries);
		$filterContainer.find('.filterByDomain').val(data.customerDomain);
		$filterContainer.find('.filterByName').val(data.eaName);
		if(data.countries === '' && data.customerDomain === '' && data.eaName === '' && $.isEmptyObject(ruleMap)){
			negationFlag = false;
		}
		if(negationFlag){
			$filterContainer.find('.filterExclude').attr('checked',true);			
		}else{
			$filterContainer.find('.filterInclude').attr('checked',true);
		}
		
		if(ruleMap !== undefined){
			$filterContainer.find('.rulesContainer li').each(function(i,el){
					var $this = $(el);
					if(ruleMap[$this.attr('class')]){
						$this.find('.strong').attr('checked', true);
					}else{
						$this.find('.strong').attr('checked', false);
					}
		   });
	   }

	},


	/* -------------------------------- Create DataTable for EA Research / Saved Relationship ------------------------------------*/
	createDataTable : function(tableId, url, filterFlag, clearFilterFlag,negationFlag ,userPrefData,userSavesFlow) {
		var that = myvmware.ela, 
			dataTableRef, 
			ruleGroups, 
			selectAllFlag = false,
			parentContainer = $('#' + tableId + 'Cont'), 
			tableActions = $('.' + tableId + 'Actions'), 
			//postData = that.postAjaxParameters(tableId), 
			dtRef = $('#' + tableId), 
			// 0 based index in col defs
			columnMappings = {
				'ruleSavedEA' : 11,
				'ruleOrderBooking' : 13,
				'ruleEmailDomain' : 16,
				'ruleContact' : 19,
				'ruleCompanyMaster': 10,
				'ruleDuns':12,
				'ruleCases':14,
				'ruleNormalizedName':17,
				'ruleEla':20
			},
			tableIdTemp = '',
			blockOnProfile = false;

		var sAjaxDataProp;
		that.showHideErrorMessage();
		var timeInterval = 1000; // Start with 1 seconds
		var inSeconds = 0;
		var ajaxCompleteFlag = false;
		var ajaxTimer = setInterval(function(){
			inSeconds = inSeconds + timeInterval;
			//console.log((inSeconds/1000) + 'seconds');
		}, timeInterval);
		
		if (tableId === that.CONST_OBJ['resEaDt']) {
			sAjaxDataProp = 'eaDetailsList';
			$('#researchAccountsForm .researchAccBtn').addClass('disabled');
		} else {
			sAjaxDataProp = 'eaDetailsList';
		}
		parentContainer.html('<div class="dataTableInnerContainer"><table cellpadding="0" cellspacing="0" border="0" class="dataTable" id="' + tableId + '"></table> <table class="header-fixed dataTable"></table></div>');
		var contentWidth = $('#content-section').width();
		$('#' + tableId).width($('#content-section').width());  // Set the table width to available content-section.
		var count = 1;	
		vmf.datatable.build($('#' + tableId), {
			"aaSortingFixed": [[0,'desc']],
			"bPaginate" : true,
			"bLengthChange" : false,
			"sPaginationType": "full_numbers",
			"iDisplayLength": ela.globalVar.getDisplayLength,
			"bFilter" : false,
			"bSort" : true,
			"sDom": 'zrt<"table-wrapper"> <"bottom"lpi<"clear">>',
			"bInfo" : true,
			"bProcessing" : true,
			"bServerSide" : true,
			"sAjaxSource" : url,
			'sAjaxDataProp' : sAjaxDataProp,
			"bDeferRender": true,
			"fnInfoCallback": function( oSettings, iStart, iEnd, iMax, iTotal, sPre ) {
			    return 'Showing '+iStart +" to "+iEnd+' of '+iTotal+' records';
			 },
			"fnServerData" : function(sSource, aoData, fnCallback, oSettings) {
				
				$('#' + tableId+'_paginate').hide(); // Hide paginaton on load
				var oTable = $('#' + tableId).dataTable();
					var postUrl = '', 
					postData = {};				
					
					if(count === 1){
						if(filterFlag){
							var savedRelFlag = false;
							postUrl = ela.globalVar.getFilterResultsUrl;
							tableIdTemp = 'researchAccountsForm';
							if (tableId === that.CONST_OBJ['savedRelDt']) {
								//postUrl = ela.globalVar.getSaveEaFilterResultsUrl;
								tableIdTemp = 'manageSavedEAForm';
							}
							var filterMap = that.postFilterParameters(tableIdTemp);
							
							if(tableId === that.CONST_OBJ['savedRelDt']){
								savedRelFlag = true;
							}
							
						    var	filterData = {
								'filterCriteriaMap' : filterMap,
								'position' : oSettings._iDisplayStart,
								'sEcho' : count,
								'iDisplayLength': oSettings._iDisplayLength,
								'clearFilterFlag' : clearFilterFlag,
								'negationFlag' : negationFlag,
								'savedRelFlag' : savedRelFlag
							};
							//postData['filterCriteria'] = vmf.json.objToTxt(filterData);
							/*if(tableId === that.CONST_OBJ['savedRelDt']){
								savedRelFlag = true;
							}*/
							postData['filterCriteria'] = vmf.json.objToTxt(filterData);
							/*postData = {
								'filterCriteria' : vmf.json.objToTxt(filterData)
							};*/							
						}else{
							postUrl = url;
							postData = that.postAjaxParameters([], tableId,userSavesFlow);
							if (tableId === that.CONST_OBJ['savedRelDt']) {
								postData = $.param(postData[0]);
							}
						}
					}else{
						$('#' + tableId+'_processing').hide();
						var oSettings = oTable.fnSettings();						
						postUrl = ela.globalVar.getPaginationUrl;
						if (tableId === that.CONST_OBJ['savedRelDt']) {
							postUrl = ela.globalVar.getSavedEaPaginationUrl;
						}
						postData = {
							'position' : oSettings._iDisplayStart,
							'sEcho' : count,
							'iDisplayLength': oSettings._iDisplayLength,
							'iDisplayStart' : oSettings._iDisplayStart
						};
						

						//$('#' + tableId).find('.selectall').attr('checked', false); // uncheck selectAll Checkbox for every pagination							
						// Loader for Data Table
						vmf.modal.show('loadTableDataModelWindow',{
							'close' : false,
							'escClose': false
						});
					}
					$.ajax({
						"dataType" : 'json',
						"type" : "POST",
						"url" : postUrl,
						"data" : (userPrefData !== undefined) ? userPrefData : postData,
						"success" : function(aData) {							
							if(aData.eaSearchDetails !== undefined || aData.savedEaSearchDetails !== undefined){
								if (tableId === that.CONST_OBJ['resEaDt']){
									ruleGroups = aData.eaSearchDetails.ruleGroups;
									if(aData.eaSearchDetails.eaNumbersList !== null){
										that.eaNumbersList = aData.eaSearchDetails.eaNumbersList;
									}
									that.responseLength = aData.eaSearchDetails.iTotalDisplayRecords;
									that.groupCounts['Strong'] = aData.eaSearchDetails.strongCount;
									that.groupCounts['Probable'] = aData.eaSearchDetails.probableCount;
									that.groupCounts['Possible'] = aData.eaSearchDetails.possibleCount;
									count++;
									$('#' + tableId+'_paginate').show(); 
									that.populateFilterData($('#researchAccountsForm .filterContainer'), aData.eaSearchDetails.filterCriteria, aData.eaSearchDetails.negationFlag); 
									fnCallback(aData.eaSearchDetails);	
									that.toggleFilterResultsBtnState();
								}else{
									ruleGroups = aData.savedEaSearchDetails.ruleGroups;
									if(aData.savedEaSearchDetails.eaNumbersList !== null){
										that.savedEANumbersList = aData.savedEaSearchDetails.eaNumbersList;
									}
									that.savedResponseLength = aData.savedEaSearchDetails.iTotalDisplayRecords;
									$('#savedRelComments').val(aData.savedEaSearchDetails.comments);
									$('#lastUpdatedUser').html(aData.savedEaSearchDetails.lastUpdatedBy);
									$('#lastUpdatedDate').html(aData.savedEaSearchDetails.lastUpdatedDate);
									$("#savedRelStatus").val(aData.savedEaSearchDetails.status);
									$('#savedRelAccountIdorNo').data('acntName',aData.savedEaSearchDetails.primaryAcntName);
									$('.savedStatus').show();
									$('#manageSavedEAForm .filterContainer').show();
									that.toggleFilterResultsBtnState();
									$('.savedRelTypeCont .input-field').val(aData.savedEaSearchDetails.primaryKeyNumber);
									$('#savedRelAccountIdorNo').val((aData.savedEaSearchDetails.primaryKeyType === 'EA')? 'eaNumber' : 'accountId');
									if(aData.savedEaSearchDetails.transactionId !== null){
										$('.savedRelSecTypeCont .input-field').val(aData.savedEaSearchDetails.transactionId);
										$('#savedRelSecAccountIdorNo').val(aData.savedEaSearchDetails.transactionType);
										if(aData.savedEaSearchDetails.transactionFlag){
											$('.publishEaBtn').attr("disabled", false);
											$('.publishEaBtn').removeClass("disabled");
										}
									}									
									that.groupCounts['Strong'] = aData.savedEaSearchDetails.strongCount;
									that.groupCounts['Probable'] = aData.savedEaSearchDetails.probableCount;
									that.groupCounts['Possible'] = aData.savedEaSearchDetails.possibleCount;
									count++;
									$('#' + tableId+'_paginate').show(); 
									that.populateFilterData($('#manageSavedEAForm .filterContainer'),aData.savedEaSearchDetails.filterCriteria,aData.savedEaSearchDetails.negationFlag);
									if(ela.globalVar.elaProfileName !== aData.savedEaSearchDetails.profile ){
										blockOnProfile = true;
										$('.deleteRelBtn').addClass('disabled').attr('disabled', true);	
									}else{
										$('.deleteRelBtn').removeClass('disabled').removeAttr('disabled');
									}
									$('#savedRelProfile').val(aData.savedEaSearchDetails.profile);
									$('#savedRelAccountIdorNo').data('relData').selectedProfile = aData.savedEaSearchDetails.profile;
									fnCallback(aData.savedEaSearchDetails);
									that.toggleFilterResultsBtnState();
								}
							}else{
								var hcolSpan = $('#' + tableId).find('thead tr:first').find('th').length;
								$('#' + tableId+'_paginate').hide();
								$('#' + tableId+'_processing').hide();
								$('#' + tableId).find('tbody').html('<tr class="tblError"><td colspan="'+hcolSpan+'">'+aData.ERROR_MESSAGE+'</td></tr>');
							}
						},
						error: function(x, t, m) {
							var hcolSpan = $('#' + tableId).find('thead tr:first').find('th').length;
							$('#' + tableId+'_paginate').hide();
							$('#' + tableId+'_processing').hide();
							$('#' + tableId).find('tbody').html('<tr class="tblError"><td colspan="'+hcolSpan+'">'+that.CONST_OBJ['requestTimeOutMsg']+'</td></tr>');
						}
					});	
					
					startIndex = oSettings._iDisplayStart; // Update iDisplayStart
			},
			"aoColumns": [
				{ "sTitle": "" , "bSortable":false ,"bVisible": false,"mDataProp":"group"},
				{ "sTitle": ela.globalVar.eaNameColHeader, "bSortable":false,"mDataProp":"eaName"},
				{ "sTitle": ela.globalVar.eaNumColHeader, "bSortable":false,"mDataProp":"eaNumber","sClass": "eaNumberCol"},
				{ "sTitle": ela.globalVar.countryColHeader, "bSortable":false, "sClass": "ctryName","mDataProp":"countries"},
				{ "sTitle": ela.globalVar.commentsColHeader, "bSortable":false,"mDataProp":"note","sClass": "commentsCol"},
				{ "sTitle": ela.globalVar.sitesColHeader, "bSortable":false,"sClass": "sites","mDataProp":"sites"},
				{ "sTitle": ela.globalVar.custDomainColHeader, "bSortable":false, "sClass": "cusDomain","mDataProp":"customerDomain"},
				//{ "sTitle": ela.globalVar.suNameColHeader, "bSortable":false,"sClass":"wrapColumn suName","mDataProp":"suName"},
				{ "sTitle": ela.globalVar.suEmailColHeader, "bSortable":false,"sClass":"wrapColumn suEmailAddress","mDataProp":"suEmailAddress"},
				//{ "sTitle": ela.globalVar.pcNameColHeader, "bSortable":false,"sClass":"wrapColumn puName","mDataProp":"puName"},
				{ "sTitle": ela.globalVar.pcEmailColHeader, "bSortable":false,"sClass":"wrapColumn puEmailAddress","mDataProp":"puEmailAddress"},
				{ "sTitle": ela.globalVar.nodeLevelHeader, "bSortable":false,"sClass":"wrapColumn nodeLevel","mDataProp":"nodeLevelandGultUuid"},
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
				{ "sTitle": "<span> </span>", "bSortable":false, "sClass": "strength ruleEla vh","bVisible": false,"mDataProp":"ruleEla"},
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
					$('#' + tableId+'_info').hide();
				} else {
					dataTableRef.find('.selectall').attr('disabled', false);
					researchActionsEl.find('.exportAllLink').removeAttr('disabled').removeClass('disabled');
					selectAllFlag = false;
					$('#' + tableId+'_info').show();
				}

				if (!oSettings.aiDisplay.length) {
					researchActionsEl.hide();
					return;
				} else {
					researchActionsEl.show();
				}
				// Start :: Dynamic Cols Showing
				for (var j = 11; j < 21; j++) {
					dataTableRef.fnSetColumnVis(j, false,false);
				}
				if (ruleGroups !== undefined) {
					for (var i = 0; i < ruleGroups.length; i++) {
						var colName = ruleGroups[i];
						dataTableRef.fnSetColumnVis(columnMappings[colName], true,false);
					}
					dataTableRef.fnSetColumnVis(21, true,false);
				}
				// End :: Dynamic Cols Showing
				
				that.addToolTipForTblHeader(dataTableRef); // Add tooltip to table headers
				
				if(oSettings.aoData.length > 0){
					var i, 
						nTrs = dataTableRef.find('tbody tr'),
						iColspan = $(nTrs[0]).find('td').length, 
						sGroup,
						nGroup,
						sLastGroup,resultValue,inputElVal,inputEAs = [];
						
						$('#researchAccountsForm .rowscontainer').find('.input-field').each(function(i, inputEl) {
							resultValue = this.value;
							var rowContainerEl = $(this).closest('.rowscontainer');
							if (resultValue !== that.EMPTY_STRING && resultValue !== that.CONST_OBJ['empty']) {
								resultValue = resultValue.split(' ');
								inputElVal = resultValue[0];
								if (rowContainerEl.hasClass('eaNumbers')) {
									inputEAs.push(inputElVal);
								}
							}
						});
					
						for ( i = 0; i < nTrs.length; i++) { 
							var $nRow = $(nTrs[i]);
							//iDisplayIndex = oSettings._iDisplayStart + i;
							iDisplayIndex = i;
							var rdata = oSettings.aoData[ oSettings.aiDisplay[iDisplayIndex] ]._aData;
							if(rdata['deletedFlag'].toUpperCase() === "Y"){
								$(nTrs[i]).addClass('disabledRow');
							}
							sGroup = rdata['group'];
							if (that.groupCounts[sGroup] >= 1) {
								if (sGroup != sLastGroup){
									nGroup = $('<tr>').html('<td class="groupRow"' + 'colspan="' + iColspan + '">' + sGroup + ' '+ela.globalVar.matchText+ela.globalVar.resultsText+'(<span class="count">' + that.groupCounts[sGroup] + ' </span>' +ela.globalVar.resultsText+')' + '<span class="legend">'+ela.globalVar.legendText+'</span>'+'</td>').addClass(sGroup);
									nGroup.insertBefore(nTrs[i]);
									sLastGroup = sGroup;
								}
							}
							var eaNum = rdata['eaNumber'];
							if($.inArray(eaNum, inputEAs) !== -1){
							   var $ele = $nRow.find('td.eaNumberCol');
							   $ele.html('<span>' + (eaNum+'*') + '</span>');
							   $ele.find('span').attr('title', ela.globalVar.inputEAMsg);
							   myvmware.hoverContent.bindEvents($ele.find('span'), 'defaultfunc','','', true);
							}
							
							//$nRow.find('td.suName').html('<span class="wrapText">' + (rdata['suName'] || "") + '</span>');
							//$nRow.find('td.puName').html('<span class="wrapText">' + (rdata['puName'] || "")+ '</span>');
							$nRow.find('td.suEmailAddress').html('<span class="wrapText suEmailAddresshover">' + (rdata['suEmailAddress'] || "") + '</span>');
							$nRow.find('td.puEmailAddress').html('<span class="wrapText puEmailAddresshover">' + (rdata['puEmailAddress'] || "") + '</span>');
							var $suEmailAddress = $nRow.find('td span.suEmailAddresshover'),
								$puEmailAddress = $nRow.find('td span.puEmailAddresshover');
							$suEmailAddress.attr('title', rdata['suName']);
							myvmware.hoverContent.bindEvents($suEmailAddress, 'defaultfunc','','', true);
							$puEmailAddress.attr('title', rdata['puName']);
							myvmware.hoverContent.bindEvents($puEmailAddress, 'defaultfunc','','', true);
							var checkBoxEl = $('<input />', {
								'type' : 'checkbox',
								'name' : 'delAcctCheckBox',
								'class' : 'delAcctCheckBox',
								'value' : eaNum,
								'data-group' : sGroup
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
							// If selectall is checked, then for every page change we have to check all the accounts
							if(selectAllFlag){
								$('.selectall').attr('checked',true);
								checkBoxEl.attr('checked', true);
								$nRow.addClass('checkedRow');
							}
							
							
							 
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
				 // Load Data Table
				 if(oSettings._iRecordsTotal <= parseInt(oSettings._iDisplayLength)){
				 	$('#' + tableId+'_paginate').hide(); // Hide paginaton if number of records is less than equal to _iDisplayLength
				 }
				 vmf.modal.hide();
				 $(window).scrollTop($('#' + tableId).offset().top - 10); // on every page change scroll the page to the table position
			}, 

			"fnInitComplete" : function(oSettings) {				
				dataTableRef = this;
				var nTrs = dataTableRef.find('tbody tr'),
					$disabledRowhovercontent = $('.disabledRow').find('td:eq(1)');
					$disabledRowhovercontent.attr('title', 'EA is no longer Active');
					myvmware.hoverContent.bindEvents($disabledRowhovercontent, 'defaultfunc','','', true);
					$('.userFeedBackbtn').show();
					if (tableId === that.CONST_OBJ['resEaDt']) {
						$('#researchAccountsForm .filterContainer').show();
						that.toggleFilterResultsBtnState();
					}
				if(oSettings.aoData.length >= 1){
					tableActions.find('.exportAllLink').removeClass('disabled').attr('disabled',false);
					tableActions.find('.exportLink').addClass('disabled').attr('disabled',true);
					if (tableId === that.CONST_OBJ['resEaDt']) {
						$('#researchAccountsForm .filterContainer').show();
						that.toggleFilterResultsBtnState();
						if(that.filterCount > 0){
							tableActions.find('.exportLink').removeClass('disabled').attr('disabled',false);
						}
					}else{
						$('#manageSavedEAForm .filterContainer').show();
						that.toggleFilterResultsBtnState();
						if(that.saveTabfilterCount > 0){
							tableActions.find('.exportLink').removeClass('disabled').attr('disabled',false);
						}
					}
				}else{
					tableActions.find('.exportAllLink, .exportLink').attr('disabled',true).addClass('disabled');
				}
				
				tableActions.show();
				if (tableId === that.CONST_OBJ['resEaDt']) {
					$('#researchAccountsForm').find('.showQuotAssetsBtn').show();
					$('#researchAccountsForm .researchAccBtn').addClass('disabled').attr('disabled', true);
				}
				toggleButtons();
				
				dataTableRef.find('tbody .openDtModal').die().live('mousedown',function(){
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
						selectAllFlag = false;
				 	}

					var delBtn = tableActions.find('.deleteAccountsAction');
					if(dataTableRef.find('.delAcctCheckBox:checked').length > 0){
					  if(delBtn.hasClass('disabled')  && !blockOnProfile){
						 toggleButtons(that.CONST_OBJ['enable']);
					  }else if(blockOnProfile){
						tableActions.find('.showQuotAssetsBtn').removeClass('disabled').removeAttr('disabled');
					  }
					}else{
					   if(!delBtn.hasClass('disabled')){
					     toggleButtons();
					   }
					}
		 		});
				
				
				parentContainer.find('.selectall').die().live('click', function() {
					if ($(this).is(':checked')) {
						parentContainer.find('.selectall').attr("checked", true);
						dataTableRef.find('.delAcctCheckBox').attr("checked", "checked").closest('tr').addClass("checkedRow");
						if(blockOnProfile){
							tableActions.find('.showQuotAssetsBtn').removeClass('disabled').removeAttr('disabled');
						}else{
							toggleButtons(that.CONST_OBJ['enable']);
						}
						selectAllFlag = true;
					} else {
						parentContainer.find('.selectall').removeAttr("checked");
						dataTableRef.find('.delAcctCheckBox').removeAttr("checked").closest('tr').removeClass("checkedRow");
						//dataTableRef.find('tbody tr').removeClass("checkedRow");
						toggleButtons();
						selectAllFlag = false;
					}
				});
				
				parentContainer.find(".header-fixed").append($('#' + tableId).find('thead').clone());
				var tableOffsetLength = $('#' + tableId).offset().left;
				var cntWidthOnLoad = $('#' + tableId).width() + (tableOffsetLength *2);
				$('#content-container').width(cntWidthOnLoad);
				$('body').width(cntWidthOnLoad);
				
				$(window).resize(function(){
					var tableId = $('.main-container-wrapper').filter(':visible').find('table').attr('id');
					if(tableId){
						var cntWidth = $('#' + tableId).width() + (tableOffsetLength * 2);
						if($(document).width() === $(window).width()){
							$('#content-container').width($(document).width());
							$('body').width($(document).width());
						}else{
							$('#content-container').width(cntWidth);
							$('body').width(cntWidth);
						}
					}
				});
				//console.log($header);
				
				var tblWidth = $('#' + tableId).width();
				$('#' + tableId).find('thead th').removeAttr('style'); // FOR BUG Fix :: Fixed Header alignment
				var $header = $('#' + tableId).find('thead').clone();
				var tdsLen = $('#' + tableId).find('tbody tr').eq(1).find('td').length;
				var $fixedHeader = parentContainer.find(".header-fixed").html($header);
				that.addToolTipForTblHeader(parentContainer.find(".header-fixed")); // Add tooltip to Fixed table headers			
					
				$(window).bind("scroll", function() {
					
					var tableId = $('.main-container-wrapper').filter(':visible').find('table').attr('id');
					if(tableId){
						var tableOffset = $('#' + tableId).offset().top;
						var $fixedHeader = $('#' + tableId).closest('.dataTableInnerContainer').find('.header-fixed');
						if(!$fixedHeader.is(":visible")){
							for(var i=0; i < tdsLen; i++){
								var theadWidth = $('#' + tableId).find('thead th').eq(i).width();
								//console.log(i + ":" + theadWidth);
								parentContainer.find(".header-fixed").find('thead th').eq(i).width(theadWidth);
								//console.log('not visible')
							}
							parentContainer.find(".header-fixed").width(tblWidth);
						}
						//console.log(tableOffsetLeft);
						var offsetLeft = $(this).scrollLeft();
						var tableOffsetLeft = $('#' + tableId).offset().left;
						//console.log("Window Left: " + offsetLeft);
						//console.log("Table Left: " + tableOffsetLeft);
						
						if (offsetLeft >= tableOffsetLeft) {
							$fixedHeader.css("left", -(offsetLeft - tableOffsetLeft));
						} else if (offsetLeft < tableOffsetLeft) {
							$fixedHeader.hide();
							$fixedHeader.css("left", tableOffsetLeft);
						}
						
						var offset = $(this).scrollTop();
						if (offset >= tableOffset && $fixedHeader.is(":hidden")) {
							$fixedHeader.width(tblWidth);
							$fixedHeader.show();
						} else if (offset < tableOffset) {
							$fixedHeader.hide();
						}
					}
				});
			/*omniture start here for Research detail*/
				ajaxCompleteFlag = true;
				clearInterval(ajaxTimer);
				var resp_time = (inSeconds/1000);
				//console.log(resp_time);
				if(resp_time<=5){
					resp_time ='<5Sec';
				}else if (resp_time<=10){
					resp_time ='5-10';
				}else if (resp_time<=20) {
					resp_time ='11-20Sec';
				}else if (resp_time<=30) {
					resp_time ='21-30Sec';
				}else if (resp_time>30){
					resp_time ='>30Sec';
				}
				var result_count = oSettings._iRecordsTotal;
				if(result_count<10){
					result_count ='<10results';
				}else if (result_count<=49) {
					result_count ='10-49results';
				}else if (result_count<=99) {
					result_count ='50-99results';
				}else if (result_count<=200) {
					result_count ='100-200 results'
				}else if (result_count<=500){
					result_count ='201-500 results';
				}else if (result_count>500){
					result_count ='>500 results';
				}
			if(typeof riaLinkmy !="undefined"){
				riaLinkmy('XELArate : research : resp_time['+resp_time+'] (result_count['+result_count+'])');
				/*omniture end here for Research detail*/
			}
				
			}
			
		 });
		var toggleButtons =  function(state){
		 	if(state === that.CONST_OBJ['enable']){
		 		tableActions.find('.deleteAccountsAction,.showQuotAssetsBtn,.researchEaDataTableActions .saveEaResults,.exportResults').removeClass('disabled').removeAttr('disabled');
				if(!blockOnProfile){
				  tableActions.find('.saveEaResults,.addAccountsAction').removeClass('disabled').removeAttr('disabled');
				}
		 	}else{
		 		tableActions.find('.deleteAccountsAction,.showQuotAssetsBtn,.researchEaDataTableActions .saveEaResults,.exportResults').addClass('disabled').attr('disabled', true);
				if(blockOnProfile){
				  tableActions.find('.saveEaResults,.addAccountsAction').addClass('disabled').attr('disabled', true);
				}
		 	}
		};
		
		var validateSelections = function(tblId){
			var checkedRows = $('#'+tblId).find('.delAcctCheckBox:checked'),
				primaryKey, isValid = false;
			
			if(tblId === that.CONST_OBJ['resEaDt']){
				primaryKey = $('.radiogrp.checked');
				if (checkedRows.length !== 0 && primaryKey.length !== 0) {
					isValid = true;
				}else{
					if(checkedRows.length === 0) {
						that.showHideErrorMessage(that.CONST_OBJ['selectAccts'],tblId);
					}else if(primaryKey.length === 0) {
						that.showHideErrorMessage(that.CONST_OBJ['selectPriKey'],tblId);
					}
				}
			
			}else if(tblId === that.CONST_OBJ['savedRelDt']){
				primaryKey = $('.savedRelTypeCont').find('.primary').val();
				if (primaryKey !== that.CONST_OBJ['empty'] && primaryKey !== that.EMPTY_STRING) {
					isValid = true;
				}else{
					that.showHideErrorMessage(that.CONST_OBJ['selectPriKey'],tblId);
				}
				
			}
			return isValid;
		};

			
		$(".modalContent .addToList").attr('title', ela.globalVar.addList);
		myvmware.hoverContent.bindEvents($(".modalContent .addToList"), 'defaultfunc','','', true);

		$(".modalContent .replaceList").attr('title', ela.globalVar.replaceList);
		myvmware.hoverContent.bindEvents($(".modalContent .replaceList"), 'defaultfunc','','', true);

		$(".modalContent .cancelSave").attr('title', ela.globalVar.continuewithoutsave);
		myvmware.hoverContent.bindEvents($(".modalContent .cancelSave"), 'defaultfunc','','', true);
		
		tableActions.find('.deleteAccountsAction').die().live('click',function(e){
			e.preventDefault();
			if($('.checkedRow').length > 0){
			   vmf.modal.show('deleteAccountsModelWindow');
			   var tdata = {
			   	'dataTableRef' : dataTableRef,
			   	 'id' : tableId
			   };
			   $('#deleteAccountsModelWindow').find('input[name="confirmBtn"]').data('tdata',tdata);
			}else{
			  that.showHideErrorMessage(that.CONST_OBJ['selectAccts']);
			}
			
		});
			
		tableActions.find('.addAccountsAction').die().live('click',function(e){
			e.preventDefault();
			var $primaryKey = $('.radio-primarykey:checked');
		    	vmf.modal.show('addAccountsModelWindow');
		    	var tdata = {
			   	  'dataTableRef' : dataTableRef,
			   	  'id' : tableId,
			   	  'eaNumbersList' : that.eaNumbersList
				};
				
				
		    	$('#addAccountsModelWindow').find('input[name="submitAccountBtn"]').data('tdata',tdata).attr('disabled',true).addClass('disabled'); // Store DT Ref
		    	
		    	$('#addAccountsModelWindow').find('input[name="accountNumber"]').live('keyup', function() {
		    		if ($(this).val() === that.EMPTY_STRING) {
		    			$('#addAccountsModelWindow').find('input[name="submitAccountBtn"]').attr('disabled',true).addClass('disabled')
					}else {
						$('#addAccountsModelWindow').find('input[name="submitAccountBtn"]').removeAttr('disabled',true).removeClass('disabled');
					}
		    	});
		    	
		    	that.showHideErrorMessage();
		    // }
		    
		});

		tableActions.find('.showQuotAssetsBtn').die().live('click', function(e) {
			e.preventDefault();
			var $quotableWindow = $('#quotableAssetsModelWindow');
			$quotableWindow.find('.warnMessage').hide();
			var valid = validateSelections(tableId);
			var $contWithoutSavingBtn = $quotableWindow.find('input[name="contWithoutSavingBtn"]');
			if(valid){
				if(blockOnProfile){
					$quotableWindow.find('.saveAndContBtn').addClass('disabled').attr('disabled', true);
				}else{
					$quotableWindow.find('.saveAndContBtn').removeClass('disabled').removeAttr('disabled');
				}
				that.showHideErrorMessage();
				var $tableEle = $('#'+tableId),
					checkedRows = $tableEle.find('.delAcctCheckBox:checked'),
					resultSetLength = checkedRows.length;
				if($tableEle.find('.selectall').is(':checked')){	
					resultSetLength = that.responseLength;
			       if(tableId === that.CONST_OBJ['savedRelDt']){
					resultSetLength = that.savedResponseLength;
				   }
			    }
				
				if(resultSetLength >= ela.globalVar.qavLimit){
				  $quotableWindow.find('.warnMessage').show();
				}
				vmf.modal.show('quotableAssetsModelWindow');

				$contWithoutSavingBtn.attr('title', ela.globalVar.launchqawithoutsave);
                myvmware.hoverContent.bindEvents($contWithoutSavingBtn, 'defaultfunc','','', true);			

                $contWithoutSavingBtn.die().live('click', function() {
                     that.openBIDashboard(tableId);
                     $('#saveAndContinueBody').hide();
                           $('#addToListBody').show();
                           vmf.modal.hide();
                });
			}
			/*omniture start here for QAV*/
			if(typeof riaLinkmy !="undefined"){
			riaLinkmy('XELArate : showQuotableAssets');
			}
			/*omniture end here fro QAv*/
		});
		
		var saveCallback = function(e,obj) {
			e.preventDefault();
			var className = $(obj).attr('class');
			var splitArr = []; 
			splitArr = className.split(' ');
			var showBI = false;
			if(splitArr[0] === 'saveAndContBtn' ){
				showBI = true;
			}
		
			var valid = validateSelections(tableId);
			if(valid){
				that.showHideErrorMessage();
				vmf.modal.hide();
				setTimeout(function(){vmf.modal.show('saveAccountsModalWindow');}, 10);

				$(".saveEaNo label").attr('title', ela.globalVar.accountlevel);
                myvmware.hoverContent.bindEvents($(".saveEaNo label"), 'defaultfunc','','', true);

				$(".saveEaYes label").attr('title', ela.globalVar.transactionlevel);
                myvmware.hoverContent.bindEvents($(".saveEaYes label"), 'defaultfunc','','', true); 

				$('.submitSavedEa').addClass("disabled").attr("disabled",true);
				$('#saveAccountsModalWindow').find('.submitSavedEa').die().live('click', function(e) {			
					$('.submitSavedEa').addClass("disabled").attr("disabled",true);				
					that.fireSaveResults('saveEa',tableId,showBI);
					/*omniture start here for Save primary and Save secondary*/
					var saveEAvalue = $('.saveEaNumber:checked').val();
					var checkInputVal = $("#oppQuote").val().length;
					if(saveEAvalue=="Y" && checkInputVal>0){
						var SaveSecondary = $('#selectOppQuote option:selected').text();
						if(typeof riaLinkmy !="undefined"){
							riaLinkmy('XELArate : Save Secondary :'+SaveSecondary);
						}
					}else if(saveEAvalue=="N"){
					if(typeof riaLinkmy !="undefined"){
						riaLinkmy('XELArate : Save primary');
					}
					}
					/*omniture end here for Save primary and Save secondary*/
				});
			}	
		 };
		 tableActions.find('.saveEaResults,.saveAndContBtn').die().live('click', function(e){
			saveCallback(e,this);
		 });


		$('#addAccountsModelWindow').find('input[name="cancelAccountBtn"]').die().live('click',function(){
			vmf.modal.hide();
		});
			
		$('#addAccountsModelWindow').find('input[name="submitAccountBtn"]').die().live('click',function(){
			var tdata = $(this).data('tdata'),
				dataTableRef = tdata.dataTableRef,//Retrieve DT Ref
				eaNum = $('#addAccountsModelWindow').find('input[name="accountNumber"]').val().trim(),
				$primaryKey = $('.radio-primarykey:checked'), 
		       	$parent = $primaryKey.closest('.rowscontainer'),
		       	acctType,
				acctTypeValue,
		       	responseData,
		       	postUrl,rdata,
		       	resultSet = tdata.eaNumbersList;
				if(tdata.id === that.CONST_OBJ['savedRelDt']){
					resultSet = that.savedEANumbersList;
				}
		    	if($.inArray(eaNum, resultSet) !== -1){
			    	$('#addAccountsModelWindow').find('#errorMsgWindow').html(ela.globalVar.acntExistsErrorMsg);
					$('#addAccountsModelWindow').find('#errorMsgWindow').show();
			    }else{
				    $('#addAccountsModelWindow').find('#errorMsgWindow').hide();
					$('input[name="submitAccountBtn"]').attr('disabled',true).addClass('disabled');
					postUrl = ela.globalVar.getAddAccountsUrl;
					rdata = {
							'eaNumber':eaNum
					};
				    if(tdata.id === that.CONST_OBJ['resEaDt']){
						 rdata['isSavedRelTab'] = false;
					}else{
						rdata['isSavedRelTab'] = true;
					}
					
					vmf.ajax.post(postUrl,rdata,function(jData){
						if(jData.response.status === 'success'){
							var responseData = jData.response.eaDetails;
							that.groupCounts['Strong'] = that.groupCounts['Strong'] + 1;
							dataTableRef.fnAddData(responseData,false);
							$('#addAccountsModelWindow').find('.body').hide();
							$('#addAccountsModelWindow').find('#statusMsgWindow').show();
							$('#addAccountsModelWindow').find('.close').die().live('click', function(){
								vmf.modal.hide();
								if(dataTableRef.fnSettings()._iDisplayStart === 0){
									dataTableRef.fnDraw();
								}
							});
							$('#addAccountsModelWindow').closest('.simplemodal-container').find('.modalCloseImg').click(function(){
								if(dataTableRef.fnSettings()._iDisplayStart === 0){
									dataTableRef.fnDraw();
								}
							})
							//that.updateGroupCount(dataTableRef);
							/*omniture start here for click on Add Account Button*/
							if(typeof riaLinkmy !="undefined"){
		    				riaLinkmy('XELArate : addEas');
							}
		    				/*omniture end here for click on Add Account Button*/
						}else{
							$('#addAccountsModelWindow').find('#errorMsgWindow').html(jData.response.message);
							$('#addAccountsModelWindow').find('#errorMsgWindow').show();
							$('input[name="submitAccountBtn"]').removeAttr('disabled',true).removeClass('disabled');
						}
					});
			    }
		});
				
		$('#deleteAccountsModelWindow').find('input[name="confirmBtn"]').die().live('click',function(){
			var tdata = $(this).data('tdata'), //Retrieve DT Ref
				dataTableRef = tdata.dataTableRef,
				tableId = tdata.id,
				checkedRowsCount = dataTableRef.find('.checkedRow').length,
				checkedRows = dataTableRef.find('.delAcctCheckBox:checked'),
				eaNums = [],
				deletedData,index,
				resultSet = that.eaNumbersList,
				tblActions = $('.' + tableId + 'Actions');
			if(tableId === that.CONST_OBJ['savedRelDt']){
				resultSet = that.savedEANumbersList;
			}
			checkedRows.each(function() {
				 eaNums.push(this.value);
				 index = $.inArray(this.value, resultSet);
				 if(index !== -1){
				 	delete resultSet[index];
				 }
			});
			var sFlag = false;
			if($('#'+tableId).find('.selectall').is(':checked')){
			  sFlag = true;
			}
			deletedData = {
				'deletedAccounts' : eaNums.join(),
				'selectAll' : sFlag
			};
			var postUrl = ela.globalVar.getDeleteAccountsUrl;
			if(tdata.id === that.CONST_OBJ['savedRelDt']){
				deletedData['isSavedRelTab'] = true;
			}
			vmf.ajax.post(postUrl, deletedData, function(resData){
				
					dataTableRef.find('.checkedRow').each(function(i,rowEl){
						$(rowEl).closest('tr').remove();
				 		dataTableRef.fnDeleteRow(dataTableRef.fnGetPosition(rowEl),function(setting){
				 			if(i === (checkedRowsCount-1)){ // redraw only when aoData is empty array
				 				that.updateGroupCount(dataTableRef, checkedRows, true);
				 			}
				 		}, false);
				 		$('#deleteAccountsModelWindow').find('.body').hide();
						$('#deleteAccountsModelWindow').find('#statusMsgWindow').show();
						$('#deleteAccountsModelWindow').find('.close').die().live('click', function(){
							vmf.modal.hide();
							tblActions.find('.deleteAccountsAction,.showQuotAssetsBtn,.researchEaDataTableActions .saveEaResults').addClass('disabled').attr('disabled',true);
						});
						$('#deleteAccountsModelWindow').closest('.simplemodal-container').find('.modalCloseImg').click(function(){
							vmf.modal.hide();
							tblActions.find('.deleteAccountsAction,.showQuotAssetsBtn,.researchEaDataTableActions .saveEaResults').addClass('disabled').attr('disabled',true);
						});
					});
					//tableActions.find('.deleteAccountsAction,.showQuotAssetsBtn,.saveEaResults').addClass('disabled').attr('disabled',true);
					//vmf.modal.hide();
					var oSettings = dataTableRef.fnSettings();
				if(resData.status === 'deleteAll'){
					if(oSettings.aoData.length === 0){
						var hcolSpan = $('#' + tableId).find('thead tr:first').find('th').length;
						var tblId = dataTableRef.fnSettings().nTable.id;
						$('#' + tblId+'_paginate').hide();
						$('#' + tblId+'_processing').hide();
						$('#' + tblId+'_info').hide();
						$('#' + tblId).find('tbody').html('<tr><td class="dataTables_empty" colspan="'+hcolSpan+'">' + that.CONST_OBJ['emptyTable'] + '</td></tr>');
						dataTableRef.find('.selectall').removeAttr("checked").attr('disabled', true);
						//tableActions.find('.exportAllLink, .exportLink').attr('disabled',true).addClass('disabled'); // Disable if no records
					}
				}
				if(oSettings.aoData.length === 0){
					dataTableRef.find('.selectall').removeAttr("checked").attr('disabled', true);
					tableActions.find('.exportAllLink, .exportLink').attr('disabled',true).addClass('disabled'); // Disable if no records
				}
			});
			/*omniture start here for click on Remove Button*/
			if(typeof riaLinkmy !="undefined"){
				riaLinkmy('XELArate : removeEas');
			}
			/*omniture end here for click on Remove Button*/
		});
		$('#deleteAccountsModelWindow').find('input[name="cancelBtn"]').die().live('click',function(){
			vmf.modal.hide();
		});
		
		$('.publishEaBtn').die().live('click',function(){
			if($(this).hasClass('disabled')){
				return;
			}
			if ($('#savedRelAccountIdorNo').val() == 'accountId') {
				acctType = 'VmStar';
			} else if ($('#savedRelAccountIdorNo').val() == 'eaNumber') {
				acctType = 'EA';
			}

			$('.publishAccNo').html($('.savedRelTypeCont input').val());
			$('.publishKey').html(acctType);	
			vmf.modal.show('publishEaModalWindow');	
		});

		/*$('#savedRelStatus').die().live('change',function(){
			var postData = {
				'primaryAccount' : $('.savedRelTypeCont').find('.primary').val(),
				'status' : $(this).val()
			};
			vmf.ajax.post(ela.globalVar.getStatusUpdateUrl, postData, function(jData){
				if(jData.status === 'success'){
					$('#savedRelStatus').siblings().find('span.message').show();
				}
			});
		});*/
		
		$('.exportLink').die().live('click',function(e){
			var savedRelFlag = false;
			if($(this).parent().hasClass('savedRelationshipDataTableActions')){
				savedRelFlag = true;
			}

			if($(this).hasClass('disabled')){
				e.preventDefault();
			} else{
				$(this).attr('href', ela.globalVar.getExportResultsUrl+"&_VM_savedEaRel="+savedRelFlag+"&_VM_exportAll=false"); 
			} 
		});
		
		
		$('.exportAllLink').die().live('click',function(e){
			var savedRelFlag = false;
			if($(this).parent().hasClass('savedRelationshipDataTableActions')){
				savedRelFlag = true;
			}

			if($(this).hasClass('disabled')){
				e.preventDefault();
			} else{
				$(this).attr('href', ela.globalVar.getExportResultsUrl+"&_VM_savedEaRel="+savedRelFlag+"&_VM_exportAll=true"); 
			}
		});
   // Added by somr for email ExportResults
		$('.emailReport').die().live('click',function(e){
			var savedRelFlag = false;
			if($(this).parent().hasClass('savedRelationshipDataTableActions')){
				savedRelFlag = true;
			}

			if($(this).hasClass('disabled')){
				e.preventDefault();
			} else{
				$(this).attr('href', ela.globalVar.getExportResultsAndEmailUrl+"&_VM_savedEaRel="+savedRelFlag+"&_VM_exportAll=false"); 
			} 
		});
		
		$('.emailReport').die().live('click',function(e){
			var savedRelFlag = false;
			if($(this).parent().hasClass('savedRelationshipDataTableActions')){
				savedRelFlag = true;
			}

			if($(this).hasClass('disabled')){
				e.preventDefault();
			} else{
				$(this).attr('href', ela.globalVar.getExportResultsAndEmailUrl+"&_VM_savedEaRel="+savedRelFlag+"&_VM_exportAll=true"); 
			}
		});

		
       // Ends
		$('.addToPrimaryList').die().live('click',function(){	
			that.addToPrimaryList();			 
		});
		
		$('.cancelList, .closeWindow').die().live('click',function(){		
			vmf.modal.hide();
		});
		
		$('.deleteRelBtn').die().live('click',function(e){
			vmf.modal.show('deleteRelModalWindow');
			
			$('.simplemodal-close, .cancelList, .close').die().live('click',function(){		
				vmf.modal.hide();
			});
		});
		
		$('#deleteRelModalWindow').find('.confirmDelRel').die().live('click',function(){
			
			var postData = $('#savedRelAccountIdorNo').data('relData'),
				$parentSelector = '#manageSavedEAForm',
				relSearchContainer = $(".relationSearch", $parentSelector);			
			vmf.ajax.post(ela.globalVar.getDeleteRelationShipUrl, postData, function(jData){
				if(jData.status === 'success'){
					var $ele = $('#deleteRelModalWindow');
					$ele.find('.body').hide();
					$ele.find('.statusMsg').show();
					$('.filterInput','#manageSavedEAForm').val(that.EMPTY_STRING);
					$('.strong','#manageSavedEAForm').removeAttr('checked');
					$('#manageSavedEAForm .filterContainer').hide();
					$('.publishEaBtn').addClass('disabled').attr('disabled',true);
					
					//$('.relationSearch', $parentSelector).die().addClass('disabled');
					//$(".relationSearchContent", $parentSelector).html(that.EMPTY_STRING);
					$('#savedRelationshipDataTableCont').html(that.EMPTY_STRING);
					$('.relationSearchNoRecords').html('<div class="warning-msg clearfix">' + that.CONST_OBJ['delRecords'] + '</div>').show();
					relSearchContainer.hide();
					$('.savedRelationshipDataTableActions').hide();
				}
			});
			

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
					 			  '<div class="input-wrapper"><input data-id="{acctId}" data-name="{acctName}" type="text" class="input-field" value="{resVal}" disabled="disabled" readonly="readonly"/></div>',
								  '<a href="#" class="icons del"> delete </a>',
								  '<span class="primaryKeyMessage"> </span>',
			 		   	   '</div>'];
					 		   
		if(type === that.CONST_OBJ['listItem']){
			var liString='<li data-type="' + cfg.type + '"><span class="accountId">' + cfg.acctId + '</span><span class="accountName">' + cfg.acctName + '</span>';
			if(cfg.acctContacts==undefined)
				liString=liString+'</li>';
			else
				liString=liString+'<span class="contacts">' + cfg.acctContacts +'</span></li>';
		    return liString;
		}else if(type === that.CONST_OBJ['inputItem']){
		    rowTemplate = rowTemplate.join('');
		    rowTemplate = rowTemplate.replace(/{resVal}/g, cfg.resVal);
		    rowTemplate = rowTemplate.replace(/{acctName}/g, cfg.acctName);
		    resultTemplate = rowTemplate.replace(/{acctId}/g, cfg.acctId);
		    return resultTemplate;
		}
	},
	
	showHideAddDeleteBtns :  function(){/*  showHideAddDeleteBtns():: For show and hide Add and Delete Buttons	*/
		
		var addBtn = $('.addToListButton'),
			deleteBtn = $('.deleteAccountButton'),
			resultAccountListLen = $('.resultAccountList li.selected').length,
			addAccountListLen  = $('.accountNumbersList li.selected').length + $('.eaNumbersList li.selected').length;
			
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
	
	populateListItems : function($selectedList, typeofEl){
		var that = myvmware.ela,
			key,
			holder = [],
			inputItem,
		  	config= {};
		 
		 $selectedList.each(function(i,el){
		 	$el = $(el);
		 	if(typeofEl === that.CONST_OBJ['inputItem']){
      	    	config = {
      	    		'acctId' : $el.find('.accountId').text(),
					'acctName' : $el.find('.accountName').text(),
      	    		'resVal' : $el.find('.accountId').text() +' '+ $el.find('.accountName').text()
      	    	};
      	   		inputItem = that.createListItem(typeofEl,config);
		 	}else if(typeofEl === that.CONST_OBJ['listItem']){
		 		config = {
		 			'acctId' : $el.attr('data-id'),
		 			'acctName' : $el.attr('data-name')
		 		};
		 		if($el.val() !== that.EMPTY_STRING){
		 			inputItem = that.createListItem(typeofEl,config);
		 		}
		 	}
			//console.log(inputItem);
			holder.push(inputItem);
		  });
		  
		  return{
		  	getList: function(){
		  		return holder;
		  	},
		  	getLength : function(){
		  		return holder.length;
		  	}
		  }
	},
	
	/* attachAccountEventListeners():: Adding listeners for all the elements of Account lookup Module */
	attachAccountEventListeners : function(){
		var that = myvmware.ela,
			type = { 'sfdc' : 'SFDC', 'ea': 'EA'},
			searchEl = $('#accountLookupContainer .searchField');
		
		var getSelectedAccountCount = function($typeSelector){ // Get/Updated Accounts
			var id,
				COUNT = 0;
				
			$typeSelector.find('.input-field').each(function(i, inputEl) {
		  		if($(inputEl).val() !== that.EMPTY_STRING){
		  			rowContainerEl = $(inputEl).closest('.rowscontainer');
		  			if ($typeSelector.hasClass('accountNumber')) {
		  				that.existingEasObj[$(inputEl).attr('data-id')] = $(inputEl).attr('data-id');
					} else if ($typeSelector.hasClass('eaNumbers')) {
						that.existingEasObj[$(inputEl).attr('data-id')] = $(inputEl).attr('data-id');
					}
					
		  			COUNT++;
		  		}
		  	});
		  	return COUNT;
		};
				
		searchEl.live('focus',function(){
			($(this).val() === that.CONST_OBJ['search']) ? $(this).val(that.EMPTY_STRING) : null;
		});	
		searchEl.live('blur',function(){
			($(this).val() === that.CONST_OBJ['empty']) ? $(this).val(that.CONST_OBJ['search']) : null
		});	
	
		$("#accountLookupContainer .searchCriteria").change(function() {
			var toggleSearchBtn = $.trim($('#accountLookupContainer .searchField').val());
				resultValue = toggleSearchBtn.replace(/%/g, "");
				if (resultValue.length >= 3 && resultValue !== that.CONST_OBJ['search']) {
					$('#accountLookupContainer .searchAccounts').removeClass('disabled').attr('disabled', false);
				} else {
					$('#accountLookupContainer .searchAccounts').addClass('disabled').attr('disabled', true);
				}
		});

		searchEl.bind('paste keyup', function(){
			setTimeout(function(){
				var toggleSearchBtn = $.trim($('#accountLookupContainer .searchField').val());
				resultValue = toggleSearchBtn.replace(/%/g, "");
				if (resultValue.length >= 3) {
					$('#accountLookupContainer .searchAccounts').removeClass('disabled').attr('disabled', false);
				} else {
					$('#accountLookupContainer .searchAccounts').addClass('disabled').attr('disabled', true);
				}
			},100)

		});
		
		$('.accountLookupBtn').die().live('click', function(e) {
			vmf.modal.show('accountLookupModalWindow');
		  	// Update Count in DOM
		  	$('.addToListSection .eaCount').html(getSelectedAccountCount($('.eaNumbers')));
			$('.addToListSection .sfdcCount').html(getSelectedAccountCount($('.accountNumber')));
			
		 	var acctNumberList = that.populateListItems($('#researchAccountsForm .accountNumber .input-field'), that.CONST_OBJ['listItem']);
		  	var eaNumberList = that.populateListItems($('#researchAccountsForm .eaNumbers .input-field'), that.CONST_OBJ['listItem']);
		  	
		  	$('.accountNumbersList').html(acctNumberList.getList().join(''));
		  	$('.eaNumbersList').html(eaNumberList.getList().join(''));
		  	/*omniture start here*/
			if(typeof riaLinkmy !="undefined"){
		  	riaLinkmy('xELArate : look-up');
			}
		  	/*omniture end here*/
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
		
		$('.addToListButton').live('click',function() {	
			
			//$('.addToListButton').addClass('disabled').attr('disabled',true);
			$('.resultAccountList .selected').each(function() {
				var $listEl = $(this).clone().removeClass('selected');
				$listEl.children('span.contacts').remove();
				//console.log($listEl.data('listObj'));
				if($listEl.attr('data-type') === 'EA'){
					if(that.existingEasObj[$listEl.find('.accountId').text()] !== undefined){
						$(this).remove();
						//$('#accountLookupContainer .errorMessage').show().html(that.CONST_OBJ['alreadyAvailable']);
					}else{
						$('.eaNumbersList').append($listEl);
						//addedListArr.push($listEl.find('.accountId').text());
						that.existingEasObj[$listEl.find('.accountId').text()] = $listEl.find('.accountId').text();
						$(this).remove();
						$('#accountLookupContainer .errorMessage').hide()
					}
					//$('.addToListSection .eaCount').html($('.eaNumbersList li').length);
					
				}else if($listEl.attr('data-type') === 'SFDC'){
					if(that.existingEasObj[$listEl.find('.accountId').text()] !== undefined){
						$(this).remove();
						//$('#accountLookupContainer .errorMessage').show().html(that.CONST_OBJ['alreadyAvailable']);
					}else{
						$('.accountNumbersList').append($listEl);
						that.existingEasObj[$listEl.find('.accountId').text()] = $listEl.find('.accountId').text();
						$(this).remove();
						$('#accountLookupContainer .errorMessage').hide();
						//addedListArr.push($listEl.find('.accountId').text());
					}
					//$('.addToListSection .sfdcCount').html($('.accountNumbersList li').length);
				}
				// Update Count 
				//console.log(existingEasObj);
				
			});
			
			// Update Count in DOM
	  		$('.addToListSection .sfdcCount').html($('.accountNumbersList li').length);
	  		$('.addToListSection .eaCount').html($('.eaNumbersList li').length);
		  		
			var movedAccounts = $('.resultAccountList').find('li').length;
			if(movedAccounts===0){
				$('.selectallResult').removeAttr('checked');
				$('.resultSelection').hide();
			}
			that.showHideAddDeleteBtns();
			$('#accountLookupContainer .selectallResult').removeAttr('checked');
		});
		
		$('#accountLookupContainer').find('.deleteAccountButton').live('click',function() {
			
			$('.accountNumbersList .selected, .eaNumbersList .selected').each(function() {
				var $listEl = $(this).clone().removeClass('selected'),
					custId = $listEl.find('.accountId').text();
				
				delete that.existingEasObj[custId];
				$(this).remove();
				//$('.addToListSection .eaCount').html($('.eaNumbersList li').length);
				//$('.addToListSection .sfdcCount').html($('.accountNumbersList li').length);
			});
		  	
	  		// Update Count in DOM
	  		$('.addToListSection .sfdcCount').html($('.accountNumbersList li').length);
	  		$('.addToListSection .eaCount').html($('.eaNumbersList li').length);
		  		
			that.showHideAddDeleteBtns();
			//console.log(existingEasObj);
		});

		$('#accountLookupContainer').find('.selectallResult').live('click',function() {
			if ($('.selectallResult').attr('checked')){
				$.each($('.resultAccountList').find('li'),function(i,k){
					if(i>=15){
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
			$('.erromsgNodata','#accountLookupContainer').hide();		
			$('.loading_small','#accountLookupContainer').show();
			var postData = {
				'category' : $('.searchCriteria').val(),
				'searchField' : $.trim($('.searchField').val())
			};
			
			var regExp = /^[0-9\sA-Za-z#$%=@!{},`~&*()'<>?.:;_|^/+\t\r\n\[\]"-]*$/;
			if(!regExp.test(postData.searchField)){
				$('.loading_small','#accountLookupContainer').hide();
				$('.erromsgNodata','#accountLookupContainer').show();
				return false;
			}
			
			$('.resultAccountList','#accountLookupContainer').find('li').remove();
			$('.erromsgNodata','#accountLookupContainer').hide();		
			$('.loading_small','#accountLookupContainer').show();			
			$('#accountLookupContainer .errorMessage').hide();
					
			if (searchVal === that.CONST_OBJ['search'] || searchVal === that.EMPTY_STRING) {
				$('#accountLookupContainer').find('.errorMessage').show().html(that.CONST_OBJ['search']);
			} else {
				$('#accountLookupContainer').find('.errorMessage').hide();
				$(this).addClass('disabled').attr('disabled',true);
				$('.erromsgNodata','#accountLookupContainer').hide();
				vmf.ajax.post(ela.globalVar.getSearchLookupResultsUrl, postData, function(jData) {
					if(jData['ERROR_CODE'] !== undefined){
						vmf.modal.hide('accountLookupModalWindow');
						var $errorContainer = $('#researchAccountsForm').find('.errorMessage');
						$errorContainer.html(jData['ERROR_MESSAGE']);
						$errorContainer.show();
					}else{
						var listArr = [];
						var data = ( typeof jData === 'object') ? jData : vmf.json.txtToObj(jData);
						var resultList = data['resultList'];
						var numberOfResultList = jData.resultList;
						if ($.isEmptyObject(numberOfResultList)) {
							$('.loading_small','#accountLookupContainer').hide();
							$('.erromsgNodata','#accountLookupContainer').show();	
						}
						$.each(resultList, function(i, obj) {
							listItem = that.createListItem(that.CONST_OBJ['listItem'], { acctId : obj.id, acctName : obj.name, acctContacts : obj.contacts, type : obj.type });
							$(listItem).data('listObj', obj);
							//  console.log(listItem);
							listArr.push(listItem);
						});
						$('.loading_small','#accountLookupContainer').hide();
						$('#accountLookupContainer').find('.resultAccountList').empty().html(listArr.join(''));
						$('.addToListButton').show();
						that.showHideSelectButton();
						$(this).removeClass('disabled').attr('disabled',false);
					}
				});
			}
			var searchVal = $('#accountLookupContainer').find('.searchField').val();
			/*omniture start here for Search Parameters */
			if(typeof riaLinkmy !="undefined"){
			riaLinkmy('XELArate : look-up :' + postData.category );
			}
			/*omniture end here for Search Parameters*/
		}); 

		$('#accountLookupModalWindow').find('.acctLookupSubmitBtn').die().live('click',function(){
			var selectedEaListObj,
	          	selectedAccountListObj,
	          	sfdcCount,
	          	eaCount,
			  	MAX_COUNT = 15,
			  	$accountNosContainer = $('#researchAccountsForm').find('.accountNumber'),
			  	$eaNosContainer = $('#researchAccountsForm').find('.eaNumbers'),
				existingAccounts = $('.accountNumbersList').find('li').length,
				existingEas = $('.eaNumbersList').find('li').length;
		  	
		  selectedAccountListObj =  that.populateListItems($('.addToListSection .accountNumbersList li'),that.CONST_OBJ['inputItem']);
		  selectedEaListObj = that.populateListItems($('.addToListSection .eaNumbersList li'), that.CONST_OBJ['inputItem']);
		  // Update Count 	
		  sfdcCount = $('.addToListSection .accountNumbersList li').length;
		  eaCount = $('.addToListSection .eaNumbersList li').length;
		  if (sfdcCount >= 1 || eaCount>=1) {
		  	$('.clearAllBtn').removeClass('disabled').attr('disabled',false);
		  };
		  
		  // For Empty accounts
		  var config = { 'acctId' : '', 'acctName' : '', 'resVal' : '' };
		  
		  if(sfdcCount === 0){
		  	$accountNosContainer.html(that.createListItem(that.CONST_OBJ['inputItem'],config))
		  }
		  if(eaCount === 0){
		  	 $eaNosContainer.html(that.createListItem(that.CONST_OBJ['inputItem'],config))
		  }
		  
		  if(sfdcCount <= MAX_COUNT && selectedAccountListObj.getLength() > 0){
		  		$accountNosContainer.html(selectedAccountListObj.getList().join(''));
		  		//that.CONST_OBJ['groupCount'].sfdc = $('.accountNumber .input-field').length;
		  		that.toggleResearchAccountBtnState();
		  }
		  if(eaCount <= MAX_COUNT && selectedEaListObj.getLength() > 0){
		  		 $eaNosContainer.html(selectedEaListObj.getList().join(''));
		  		 that.toggleResearchAccountBtnState();
		  		 //that.CONST_OBJ['groupCount'].ea = $('.eaNumbers .input-field').length;
		  }
		  
		  if(sfdcCount > 0 && eaCount > 0 || sfdcCount > 0 && eaCount === 0){
		  		that.setPrimaryKey($accountNosContainer);
		  }

		  if(sfdcCount === 0 && eaCount > 0){
		  		that.setPrimaryKey($eaNosContainer);
		  }
		  
		  if(sfdcCount > MAX_COUNT){
	  			$('#accountLookupContainer .errorMessage').show().html(that.CONST_OBJ['sfdcNosAlert']);
	  			return false;
		  }
		  
		  if(eaCount > MAX_COUNT){
		  		$('#accountLookupContainer .errorMessage').show().html(that.CONST_OBJ['eaNosAlert']);
		  		return false;
		  }
		  
		  
          vmf.modal.hide();
          
		});
		
		$('#accountLookupModalWindow').find('.cancelAccountBtn').live('click',function(){
		     vmf.modal.hide();
		     that.existingEasObj = {};	// Nullify the object on cancel 
		});
	}
};