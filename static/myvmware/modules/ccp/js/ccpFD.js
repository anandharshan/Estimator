th = {};
$.extend(ccp,{
    addCommas:function(nStr){
	nStr += '';var x = nStr.split('.');var x1 = x[0].replace(/,/g, '');var x2 = x.length > 1 ? '.' + x[1] : '';var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {x1 = x1.replace(rgx, '$1' + ',' + '$2');};return x1 + x2;
    }
});
ccp.fD =  {
    _inCart: [],
    _inCartQty: [],
    _inCartSkuIdList: [],
    _preselectRedeem: false,
    _daysInYear: parseInt(365), //need to get from properties
	_dt:null,
	sfTbl:null,
	mhTble:null,
	_newSfName:null,
	sfuEmail:null, 
	sfFN:null, 
	sfLN:null,
	validEMSUser: null,
	validUser: null,
	bEmail:null,
	bFname:null,
	bLname:null,
    _ENTER_KEY: 13,
    kbUrl:null,
	trueUpMode:null,
	upgradeFlagArr:[],
	optionals:{},
	activeSFId:null,
	activeTr:null,
	err:null,
	fnOwner:null,
    preSelectManageHold: false,
    nameRegEx:null,
	escSquence:[],
    init: function() {
        //vmf.scEvent =true;
		th = ccp.fD;
		hold = th.hold;
		sp = th.sp;
		tt = th.tt; // transfer tokens module
		th.sfTbl = $('#tbl_subFundSummary');
		th.mhTble = $('#tbl_managehold');
		th.spTble = $('#tbl_manageservice'); 
		th.err = $('#errorMsg');
		th.fnOwner = (ccp.globalVar.userType == 'CC_FUND_OWNER');
		th.bEmail=false;
		th.bFname=false;
		th.bLname=false;
		th.trueUpMode = false;
		th.optionals={'elements':'#btnRenameFund, #subFundHdr, #actionsInfo, #mngSpControls'};
		th.escSquence = [0,118,8];
		th.nameRegEx = /^[a-zA-Z0-9!@&_=\.\+\-\(\)\^\#\%\!\$\ ]*$/;
		th.buildAllEvents();
        if(ccp.globalVar.preSelect != '' 
                && ccp.globalVar.preSelect == ccp.globalVar.preSelectManageHoldRedemption) {
            var dummyTr = $('<tr></tr>').data('id',ccp.globalVar.subFundID);
            th.manageHold(dummyTr);
            th.preSelectManageHold = true;
        } else {
            th.showContent('viewsubfund');
        }
		myvmware.hoverContent.bindEvents($('a.tooltip'), 'defaultfunc');
		th.trimTitle($('#eaTitle'),15);
        //callBack.addsc({'f':'riaLinkmy','args':[ccp.globalVar.pageName]});
	},//end of init
	buildAllEvents:function(){
		$('a#partner_help_KB').click(function(){
			if(typeof myvmware.common.openHelpPage != "undefined") myvmware.common.openHelpPage(ccp.globalVar.kbUrlPartners);
			return false;
		});
		//KBarticles Help Link
		th.kbUrl = ccp.globalVar.kbUrlViewFunds;
		$('a#help_KB').click(function(){
			if(typeof myvmware.common.openHelpPage != "undefined") myvmware.common.openHelpPage(th.kbUrl);
			return false;
		})
		//CCP Fund Info hide and show - click event
		$('#actionsInfo a.openClose').click(function(){
			var content = $('#actionsInfo .actionContent');
			if(!$(this).hasClass('open')){
				$(this).addClass('open').text(ccp.globalVar.hide);
				content.slideDown();
			}else{
				$(this).removeClass('open').text(ccp.globalVar.show);
				content.slideUp();
			}
			return false;
		})
       
        $('#createSubFund input,#renameFund input,#renameSubFund input').keypress(function(e){
		    if(e.which == th._ENTER_KEY) {
				$(this).closest('.modalContent').find('button').not('.secondary').trigger('click');
			} else if($.inArray(e.which,th.escSquence) <= -1 && !th.nameRegEx.test(String.fromCharCode(e.which))){
				return false;
			}
		});
		$('input#txt_amt').keypress(function(e){
			var regExp=/^[0-9]$/;
			if($.inArray(e.which,th.escSquence) <= -1 && !regExp.test(String.fromCharCode(e.which))) {
				return false;
			}
		});
        $('#changeSubFundUser input').keypress(function(e){
		    if(e.which == th._ENTER_KEY) $('#addSFUser').not('.disabled').trigger('click');
		});
		$('#btnRenameFund').click(function(){th.renameFund();})
		$('#btnCreateSF').click(function(){th.createSubFund();})
		$("#btn_csfund").live('click',function(){
			var sObj1 = new Object();
			sObj1['newFundName'] = $.trim($('#newSFName').val());
			$('#newSFName').parent().find('.errorMsg').remove();
			if(sObj1['newFundName'].match(th.nameRegEx)
			&& ($.trim($('#newSFName').val()) != '')){
				var newUserEnteredSubFundName = escape($('#newSFName').val());
				//vmf.modal.hide('createSubFund');
				ccp.common.toggleButton($(this), false);
				th.showLoading($('#createSubFund'));
				vmf.ajax.post(ccp.globalVar.createSubFundURL, "&newSubFundName="+newUserEnteredSubFundName, th.updateSubFunds, th.reloadError);
			}else{
				$('#newSFName').after('<label class="errorMsg clear" for="newSFName">'+ccp.globalVar.showSubFund+'</label>');
			}
		});
		$("#btnCnfRenameSF").live('click',function(){
			var $sfName = $(th.activeTr).find('td:eq(0) span.primaryTxt').text(),
				sObj1 = new Object();
			sObj1['newRenameFund'] = $.trim($('#newfoName').val());
			sObj1['currentNameFund'] = $.trim($('#currentSbFnName').text());
			$('#newfoName').parent().find('.errorMsg').remove();
			if(sObj1['newRenameFund'].match(th.nameRegEx)) {
				if(($.trim($('#newfoName').val()).length) && 
				$sfName != sObj1['newRenameFund'] && 
				sObj1['newRenameFund'] != sObj1['currentNameFund']){
					_newSfName = escape($('#newfoName').val());
					//vmf.modal.hide('renameSubFund');
					th.showLoading($('#renameSubFund'));
					vmf.ajax.post(ccp.globalVar.renameSubFundURL, "&renameSubFund="+_newSfName+
					"&subFundId="+encodeURIComponent($(th.activeTr).data("id")), th.updateSubFunds, th.reloadError);
				} else{ $('#newfoName').after('<label class="errorMsg" for="newfoName">'+ccp.globalVar.showSubFund+'</label>');	}
			} else {
				$('#newfoName').after('<label class="errorMsg" for="newfoName">'+ccp.globalVar.showSubFund+'</label>');
			}
		});
		
		$('#btnCnfDeleteSF').click(function(){
			ccp.common.toggleButton($(this),false);
			th.showLoading($('#deleteSubFund'));
			vmf.ajax.post(ccp.globalVar.deleteSubFundURL, "&subFundId="+encodeURIComponent($(th.activeTr).data("id")), th.updateSubFunds);
		});
		
		$('#sfUContinue').live('click',function(){
			ccp.common.toggleButton($(this), false);
			if (th.validUser=="true"){
				if(th.validEMSUser) {$url = ccp.globalVar.replaceFundUserURL;}
				else{ $url = ccp.globalVar.createSubFundUserURL;}
				vmf.ajax.post($url, 
				  "&userEmail="+th.sfuEmail+
				  "&fisrtName="+th.sfFN+
				  "&lastName="+th.sfLN+
				  "&subFundId="+encodeURIComponent($(th.activeTr).data("id"))+
				  "&userId="+encodeURIComponent(userId), th.updateSubFundUser);
			}else{
				//vmf.loading.hide();
			}
        });
		$("#sfReset").live('click',function(){
			th.bEmail = false; th.bFname = false; th.bLname = false;
			$('#sf_inst').show();
			$("#sfUserForm").parents('.sec_content').removeClass('disabled').find("input[type='text']").val('').removeClass('disabled').attr('disabled',false);
			$("#sfUserForm button[type='reset']").removeClass('disabled').attr('disabled',false);
			$('#sf_submitDetail').hide().find('sf_warning').hide();
			ccp.common.toggleButton($("#sfUContinue"),false);
			$(this).hide();
		});
		$("#editFnName").live('click',function(){
			vmf.modal.show('renameFund');
			//$('#newFundName').focus();
			$('#newFundName').select();
			$('#currentFnName').html($('#fnName').text());
			return false;
		});
		$("#btnCnfRenameFund").live('click',function(){
			var sObj = new Object(), curName = $('#currentFnName'), newName = $('#newFundName');
			sObj['userEnteredFundName'] = $.trim(newName.val());
			sObj['userCurrentFnName'] = $.trim(curName.text());
			$('#newFundName').parent().find('.errorMsg').remove();
			if($.trim(newName.val()).length && 
				sObj['userEnteredFundName'].match(th.nameRegEx) &&
				sObj['userEnteredFundName'] != sObj['userCurrentFnName']){
				editFundName = escape(newName.val());
				ccp.common.toggleButton($(this), false);
				//$('#renameFund .sfAction').show();
				th.showLoading($('#renameFund'));
				vmf.ajax.post(ccp.globalVar.renameFundURL, "&newfundName="+editFundName, th.updateFundName, th.reloadError);
			}else newName.after('<label class="errorMsg clear" for="newFundName">'+ccp.globalVar.showFund+'</label>');
		});

		$('.fn_cancel',$('#simplemodal-container')).live('click',function(){vmf.modal.hide()});

        // To display account name only limitted length and show full name on hover.
        $('#fundHeader .charLimit').each(function(){
            var $name = $(this).text(), $charLen = $(this).text().length, $limit = 15;
            if($name.length && $name != null && $name != undefined){
                if($charLen > $limit){
                    $(this).css('cursor','pointer').html($name.substring(0, $limit)).append(' ...');
                    //adding mouseover event to show full name on hover
                    $(this).mouseover(function(){$(this).html($name);
                    }).mouseout(function(){$(this).html($name.substring(0, $limit)).append(' ...');})
                }
            }
            return false;
        });
	
		$('#downloadRedemptionReport').click(function(e) {
			th.downloadRedemptionReport(e);
		});
		
		$('#downloadActivityReport').click(function(e) {
			th.downloadActivityReport(e);
		});
		$('#sfUserForm button[type="reset"]:not(".disabled")').live('click', function(e){
			ccp.common.toggleButton($('#addSFUser'), false);
			$('form#sfUserForm .errorMsg').text('');
			th.bEmail = false; th.bFname = false; th.bLname = false;
		});
				
		$('form#sfUserForm input[type="text"]:not(".disabled")').live('keyup', function(e){
			var $this = $(this),
				$thisVal = $(this).val(),
				$thisId = $(this).attr('id'),
				fname = $.trim($('#sfFName').val()),
				lname = $.trim($('#sfLName').val()),
				eaddr = $.trim($('#sfFMail').val()),
				intRegex = /^[0-9a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF\s!@&_=\.\+\-\(\)\^\#\%\!\$\ ]*$/;				
			if($thisId == 'sfFMail'){
				  var emailRegex =  /^[a-zA-Z0-9._-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9.]+$/;
				  if($.trim($thisVal).length){
						if(!emailRegex.test($thisVal)){
							  $this.next('.errorMsg').html(ccp.globalVar.validEmail); th.bEmail = false;
						}
						else {$this.next('.errorMsg').html(''); th.bEmail = true;}
				  }
				  else{ $this.next('.errorMsg').html('Required'); th.bEmail = false;} 
			} else if($thisId == 'sfFName'){
				  if($.trim($thisVal).length){
						if(!intRegex.test($thisVal)){
							$this.next('.errorMsg').html(ccp.globalVar.validFName); th.bFname=false;
						}
						else {
							$this.next('.errorMsg').html(''); th.bFname=true;
						}
				  }
				  else {$this.next('.errorMsg').html('Required');th.bFname=false;}  
			} else if($thisId == 'sfLName'){
				  if($.trim($thisVal).length){
						if(!intRegex.test($thisVal)){
							 $this.next('.errorMsg').html(ccp.globalVar.validLName); th.bLname=false;
						}
						else { $this.next('.errorMsg').html(''); th.bLname=true; }
				  }
				  else {$this.next('.errorMsg').html('Required'); th.bLname=false;}  
			}
			
			if( th.bEmail && th.bFname && th.bLname){
				$(this).next('.errorMsg').html('');
				ccp.common.toggleButton($('#addSFUser'), true);
			}else{
				ccp.common.toggleButton($('#addSFUser'), false);
			}
		});
		// Validations for Pop up
		$('#sfUserForm input[type="text"]:not(".disabled")').live('focusout', function(e){
			var $this = $(this),
				$thisVal = $(this).val(),
				$thisId = $(this).attr('id'),
				intRegex = /^[0-9a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF\s!@&_=\.\+\-\(\)\^\#\%\!\$\ ]*$/;
			if($thisId == 'sfFMail'){
				  var emailRegex =  /^[a-zA-Z0-9._-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9.]+$/;
				  if($.trim($thisVal).length){
						if(!emailRegex.test($thisVal)){
							  $this.next('.errorMsg').html(ccp.globalVar.validEmail); th.bEmail = false;
						}
						else if(th.activeTr.data('email') == $thisVal){
							$this.next('.errorMsg').html(ccp.globalVar.changeFundUserEmailError); th.bEmail = false;
						}else{
							$this.next('.errorMsg').html(''); th.bEmail = true;
						}
				  }
				  else{ $this.next('.errorMsg').html('Required'); th.bEmail = false;} 
			}
			else if($thisId == 'sfFName'){
				  if($.trim($thisVal).length){
						if(!intRegex.test($thisVal)){
							$this.next('.errorMsg').html(ccp.globalVar.validFName); th.bFname=false;
						}
						else {
							$this.next('.errorMsg').html(''); th.bFname=true;
						}
				  }
				  else {$this.next('.errorMsg').html('Required');th.bFname=false;}  
			}
			else if($thisId == 'sfLName'){
				  if($.trim($thisVal).length){
						if(!intRegex.test($thisVal)){
							 $this.next('.errorMsg').html(ccp.globalVar.validLName); th.bLname=false;
						}
						else { $this.next('.errorMsg').html(''); th.bLname=true; }
				  }
				  else {$this.next('.errorMsg').html('Required'); th.bLname=false;}  
			}
			if( th.bEmail && th.bFname && th.bLname) ccp.common.toggleButton($('#addSFUser'), true); 
			else ccp.common.toggleButton($('#addSFUser'), false);
        });
		$('#addSFUser').click(function(){	
			//$('#sfUserForm input[type="text"]:not(".disabled")').trigger('focusout');
			if( th.bEmail && th.bFname && th.bLname){
				ccp.common.toggleButton($(this), false);
				$('#sf_inst').hide().before('<div class="loadingWrapper"><div class="loading_big">Loading...</div></div>');
				th.showChangeSFWin();
				vmf.ajax.post(ccp.globalVar.validateSubFundUserURL, 
				"&userEmail="+th.sfuEmail+
				"&subFundId="+encodeURIComponent(th.activeSFId), 
				th.validateFundUser);	
			}
		});
		$('#clear_button').live('click',function(){
			$('#sfUserForm').find('.errorMsg').html('');
		});
		
       //link to go back to fund information content.
       $('#backToInfo').click(function(){
	       	if(th.mhTble.is(':visible')) hd.hDt.fnClearTable();
			if(th.spTble.is(':visible')) msp.sDt.fnClearTable(); 
			$(th.optionals.elements).show();
			th.showContent('viewsubfund');
			return false;
       });
       $('#manageservice_content select.sfHolder').change(function(){
       		th.activeSFId = $(this).val();
       		th.activeTr = th.sfTbl.find('tr#'+$(this).val());
			msp.getSpDetails();
		});
		$('#managehold_content select.sfHolder').change(function(){
			th.activeSFId = $(this).val();
			th.activeTr = th.sfTbl.find('tr#'+$(this).val());
			hd.getHoldDetails();
		});
		$('#mngSpControls button.secondary').click(function(){msp.getSpDetails();});
		$('#mngSpConfirmBtn').click(function(){
			var agrantAccess = "", aviewAccess = "";
			$.each(th.spTble.find('tr'),function(k,v){
				if($(v).find('td:eq(0) input').is(':checked')) {
					agrantAccess=agrantAccess+($(v).data('spId'))+",";
				}
				if($(v).find('td:eq(1) input').is(':checked')) {
					aviewAccess = aviewAccess +($(v).data('spId'))+",";
				}
			});
			if(!agrantAccess.length)agrantAccess=0;
			if(!aviewAccess.length)aviewAccess=0;
			$('#mngSpControls').after('<div class="process fRight"><div class="loading_small">' + ccp.globalVar.loadingLabel + '</div></div>');		
			vmf.ajax.post(ccp.globalVar.confirmMngSpUrl,{'subFundID':th.activeSFId,'viewAccess':aviewAccess,'grantAccess':agrantAccess}, function(jData){		
				if(jData != null){
					th.err.hide();
					$('#mngSpControls').parent().find('.process').remove();
					msp.getSpDetails();
					return;
				}else{
					th.err.text(jData.ERROR_MESSAGE).show();
				}
			},th.reloadError)
		});
		
		$('#btnApprove').click(function(){
			ccp.common.toggleButton($(this), false);
			th.showLoading($('#approveModal'));
			hd.approveHold();
		});
		$('#btnReject').click(function(){
			ccp.common.toggleButton($(this), false);
			th.showLoading($('#rejectModal'));
			hd.rejectHold();
		});
		th.mhTble.find('span.openclose').live("click",function (e){
			e.stopPropagation();
			hd.expandRow($(this));
		});
		th.spTble.find('input.grantCheck').live('click',function(){
			if(ccp.globalVar.crType == 'VSPP' && th.fnOwner){
				($(this).is(':checked'))?$(this).closest('tr').find('td:eq(1) input').attr('disabled',false):$(this).closest('tr').find('td:eq(1) input').attr('disabled',true).attr('checked',false);
			}
		});
	},
	trimTitle:function(element,limit){
        var $name = $(element).text(), $charLen = $(element).text().length, $limit = limit;
        if($name.length && $name != null && $name != undefined){
            if($charLen > $limit){
                $(element).css('cursor','pointer').html($name.substring(0, $limit)).append(' ...');
                //adding mouseover event to show full name on hover
                $(element).mouseover(function(){$(this).html($name);
                }).mouseout(function(){$(element).html($name.substring(0, $limit)).append(' ...');})
            }
        }
	},
	showContent:function(section){
		$('#' + section +'_content').show().siblings().hide();
		th.err.hide();
        if(section == 'viewsubfund') {
			$('#backToInfo').closest('.backToFnInfo').not('.backToOver').hide();
			$('#backToOverviewLink').show();
			$('#pageTitle').text(ccp.globalVar.titleFundInfo);
			th.getSubFundDetails();
		}
		else {
			$('#backToInfo').closest('.backToFnInfo').show();
			$(th.optionals.elements).hide();
		}
	},
	updateSubFunds:function(jData){
		if(jData.Result) {
			th.err.hide();
			vmf.modal.hide();
			th.getSubFundDetails();
		}else {
			th.reloadError(jData);
		}
    },
    updateSFDropdown:function(section){
    	var crs = parseInt(hd.actHdTr.data('cr')), tr = $(th.activeTr);
    	var newVal = (parseInt(tr.data('crs')) + crs);
		var selObj = $('#' + section + '_content').find('select.sfHolder');
    	selObj.find('option:selected').text(tr.data('fnName') + ' - ' + tr.data('uName') + ' - ' + newVal +" "+ tt.getLabel(newVal));
    },
	getSubFundList:function(section){
		var selObj = $('#' + section + '_content').find('select.sfHolder'), oList=[];
		var sfList = [], sf = [], sfStr, sfId, sfName;
		if(th.mhTble.is(':visible')) {
			th.mhTble.find('.error_innermsg').hide();
			th.mhTble.closest('.dataTables_wrapper').find('.dataTables_processing').css('visibility','visible');
		}
		if(th.spTble.is(':visible')){
			th.spTble.find('.error_innermsg').hide();
			th.spTble.closest('.dataTables_wrapper').find('.dataTables_processing').css('visibility','visible');
		} 
		selObj.html('<option>'+ ccp.globalVar.loadingLabel +'</option>');
		vmf.ajax.post(ccp.globalVar.subFundSummaryURL,"&encFundID="+ccp.globalVar.encFundId, function(data){
			if (data!=null){ 
				var dt = data.FundDetails.aaData;
				$.each(dt,function(k,val){
					v = $(val);
					sf.push(v[1] + ' - ' + v[2] + ' - ' + v[6] +" "+ tt.getLabel(v[3]) + ":" + v[0]);
				});
				sf.sort();
				$.each(sf,function(k,val){
					sfStr = $(val).selector;
					sfId = sfStr.substring(sfStr.indexOf(":")+1, sfStr.length);
					sfName =  sfStr.substring(0, sfStr.indexOf(":"));
					sfList.push('<option value="' + sfId + '">' + sfName + '</option>');
				});
				selObj.empty().append(sfList.join(''));
				selObj.val($(th.activeTr).data('id')).trigger('change');
			}
		},th.reloadError);
	},
	manageHold:function(trObj){//managehold or redemption
		th.activeTr = $(trObj)
		th.showContent('managehold');
		$('#pageTitle').text(ccp.globalVar.titleManageHold);
		hold.init();
	},
	manageServiceProviders:function(trObj){//manage service providers
		th.activeTr = $(trObj)
		th.showContent('manageservice');
		(ccp.globalVar.crType == 'VPC')?$('#pageTitle').text(ccp.globalVar.titleViewSP):$('#pageTitle').text(ccp.globalVar.titleManageService);
		sp.init();
	},
	transferCredits:function(trObj){//transfer credits
		th.activeTr = $(trObj)
		th.showContent('transfer');
		$('#pageTitle').text(ccp.globalVar.titleTransferCredits);
		tt.init();
	},
	renameFund:function(){
		vmf.modal.show('renameFund');
		$('#newFundName').select();
		$('#currentFnName').html($('#fnName').text());
		return false;
	},
	deleteSubFund: function(trObj) {
		th.activeTr = $(trObj);
		vmf.modal.show('deleteSubFund');
		$('#delSbFnName').text($(trObj).data('fnName'));
	},
	changeFundUser:function(trObj){
		th.activeTr = $(trObj)
		th.activeSFId = $(trObj).data('id');
		$('#subfundName').text(th.activeTr.data('fnName'));
		$('#currentFundUser').text(th.activeTr.data('uName'));
		vmf.modal.show('changeSubFundUser');
		$("#sf_error, #sf_success1, #sf_success3, #sf_invitation, #sf_submitDetail").hide();
		$('#sf_inst').show();
		ccp.common.toggleButton($("#addSFUser"), false);
		ccp.common.toggleButton($("#sfUContinue"), false);
		return false;
	},
	createSubFund:function(trObj){
		th.activeTr = $(trObj)
		vmf.modal.show('createSubFund');
		$('#newSFName').select();
		return false;
	},
	renameSubFund:function(trObj){
		th.activeTr = $(trObj)
		vmf.modal.show('renameSubFund');
		var curSbFnName = $(trObj).data('fnName');
		$('#currentSbFnName').text(curSbFnName);
	},
	validateFundUser : function(jData){		
		 if (jData!=null && jData.FundDetails != undefined){
			var oData = jData.FundDetails,
				nRD = oData.aaData[0],
				$fInput = $('#sfUserForm input');
			//th.sfFN  = nRD[1];
			//th.sfLN  = nRD[2];
			th.validEMSUser = nRD[3];
			th.validUser = nRD[4];
			userId = nRD[5];
			$('#changeSubFundUser').find('.loadingWrapper').remove();
			th.submitSFUForm(th.sfuEmail, th.sfFN, th.sfLN);
			$fInput.focusout();
			if (th.validUser=="true"){
				$('#sf_submitDetail').show().find('#newSFMail').html(th.sfuEmail).end().find('#newSFN').html(th.sfFN + " " + th.sfLN);
				ccp.common.toggleButton($("#sfUContinue"), true);
				if(th.validEMSUser=="true") {
					$("#sf_success3, #sf_submitDetail, #sfReset, #sf_warning, #emsUser").show();
					$("#sf_inst, #sf_fail1, #sf_success1, #sf_error, #sf_invitation, #mvUser").hide();						
				}
				else{
					$('#sf_submitDetail').show().find('#newSFMail').html(th.sfuEmail).end().find('#newSFN').html(th.sfFN + " " + th.sfLN);
					$("#sf_success1, #sf_warning, #mvUser").show();
					$("#sf_inst, #sf_fail1, #sf_success3, #sf_error, #sf_invitation, #emsUser").hide();
					$("#sfUserForm").parents('.sec_content').addClass('disabled').find("input[type='text']").addClass('disabled').attr('disabled','true');
					$('#sfReset').show();
				}
			}  			
			else {
				th.showChangeSFWin();
				$('#sf_submitDetail').show().find('#newSFMail').html(th.sfuEmail).end().find('#newSFN').html(th.sfFN + " " + th.sfLN);
				$("#sf_inst, #sf_success1, #sf_fail1, #sf_success3, #sf_warning, #sf_invitation").hide();
				$('#sf_submitDetail, #sf_error').show();
				$("#sfUserForm").parents('.sec_content').addClass('disabled').find("input[type='text']").addClass('disabled').attr('disabled','true');
				$('#sfReset').show();
			}
			$('#sfUserForm').parents('.sec_content').addClass('disabled').find('input[type=text],button').addClass('disabled').attr('disabled',true);
			$('#sfReset').show();
		}else{
			$('#changeSubFundUser').find('.loadingWrapper').remove();
			$('#sf_submitDetail').show().find('#newSFMail').html(th.sfuEmail).end().find('#newSFN').html(th.sfFN + " " + th.sfLN);
			$('#sf_fail1').show();
			$("#sf_inst, #sf_success1, #sf_success3, #sf_invitation, #sf_error").hide();
		}
	},
	updateFundName: function(jData){
		vmf.modal.hide();
		if(jData.FundDetails) {
			th.err.hide();
			$('#fnName').html(unescape(editFundName));
		}else{
			$('#editFundErrorMsg').html(ccp.globalVar.editFundNameErrorMsg);
		}
	},
	showChangeSFWin:function(){
		th.sfuEmail = $.trim($('#sfUserForm #sfFMail').val());
		th.sfFN = $.trim($('#sfUserForm #sfFName').val());
		th.sfLN = $.trim($('#sfUserForm #sfLName').val());
	},
	updateSubFundUser: function(jData){
		if((jData.GenericJSON != null) && jData.GenericJSON){
			vmf.modal.hide('changeSubFundUser');
			th.getSubFundDetails();
			th.enableCCPWidget();
		}
		else {
			if(jData.ERROR_MESSAGE.length) {
				$('#sf_fail1').show().html(jData.ERROR_MESSAGE);
			} else {
				$('#sf_errorMsg, #sf_errorMsg').show();
			}
			$('#sf_success3').hide();
			$('#sf_submitDetail').show().find('#newSFMail').html(th.sfuEmail).end().find('#newSFN').html(th.sfFN + " " + th.sfLN);
			$("#sf_inst, #sf_invitation, #sf_warning, #sfReset").hide();
			ccp.common.toggleButton($('#sfUContinue'), false);
			$('#sf_submitDetail, #sf_fail1, #sfReset').show();	
		}
		//vmf.loading.hide();
	},
	enableCCPWidget: function() {
        var dt = {emailAddress : th.sfuEmail}
		var enableCCPWidgetUrl = (location.protocol + '//'+location.hostname + ccp.globalVar.enableCCPWidgetAjaxUrl);
		if(ccp.globalVar.enableCCPWidgetAjaxUrl.length){
			vmf.ajax.post(enableCCPWidgetUrl,dt,function(jData){
				if(jData != null){ 
					
				}
			});
		}
    },
    getSubFundDetails: function() {
        if(!(th.sfTbl.find('tbody tr').length)) {
            vmf.datatable.build(th.sfTbl,{
                "aoColumns": [
                    {"sTitle": "<span class='descending'>" + ccp.globalVar.subFundIdLabel + "</span>","sClass":"","sWidth":"120px","bSortable":true},
                    {"sTitle": "<span class='descending'>" + ccp.globalVar.subFundName + "</span>","sClass":"","sWidth":"200px","bSortable":true},
                    {"sTitle": "<span class='descending'>" + ccp.globalVar.fundUser + "</span>","sClass":"","sWidth":"200px","bSortable":true},
                    {"sTitle": "<span class='descending'>" + ccp.globalVar.creditRemaining + "</span>","sClass":"","sWidth":"120px","bSortable":true},
                    {"sTitle": ccp.globalVar.actions,"sWidth":"120px","bSortable":false},
                    {"sTitle": "","bVisible":false},
					{"sTitle": "","bVisible":false},
					{"sTitle": "","bVisible":false}
                ],
                "oLanguage": {
                    "sEmptyTable":'<div id="loadingerrormsg"><div id="innerMsg1" class="error_innermsg"><p>' + ccp.globalVar.noActiveFundLabel + '</p></div></div>',
                    "sProcessing":ccp.globalVar.loadingLabel,
                    "sLoadingRecords":""
                },
                "sAjaxSource":ccp.globalVar.subFundSummaryURL,
                "fnServerParams": function ( aoData ) {
                    aoData.push( { "name": "encFundID", "value": ccp.globalVar.encFundId } );
                },
                "bInfo":false,
                "bProcessing": true,
                "bServerSide": false,
                "bAutoWidth" : false,
                "sDom": 'zrtSpi',
                "bFilter":false,
                "bPaginate": false,
                "sScrollY": "270px",
				"aaSorting": [[ 5, "desc" ]],
                "fnRowCallback": function(nRow,aData,iDisplayIndex){ 
                    var $nRow=$(nRow);
					$nRow.data({'id':aData[0], 'crs':aData[3], 'crName':aData[6], 'fnName':aData[1], 'prime':aData[5], 'email': aData[7], 'uName':aData[2], 'per':vmf.json.txtToObj(aData[4])});
					$nRow.attr('id',aData[0]);
					$nRow.find('td:eq(2)').html(aData[2]);
					$nRow.find('td:eq(3)').addClass('right').html(aData[6]);
					if($.trim(aData[5]).length && aData[5] == "1" ){
						$nRow.addClass('primary').find('td:eq(1)').html("<span class='primaryTxt'>"+aData[1]+"</span><span class=\"tooltiptext badge primary\" title=\""+ccp.globalVar.primaryToolTip+"\">"+ccp.globalVar.primary+"</span>");
					}
					$nRow.find('td:eq(4)').html('<span class="dd"></span>');	
                    return nRow;
                },
                "fnDrawCallback": function(){ 
                	if($('#fnActions').length) $('#fnActions').hide();
                	th.setDropDownMenu();
                },
                "fnInitComplete": function (aoData) {
					th._dt = this;
                    myvmware.hoverContent.bindEvents($('.tooltiptext'), 'defaultfunc');
                    th.bindHoverEffects(this);
					//on condition of fund user logged in
					var settings= this.fnSettings();					
					if(settings.jqXHR && settings.jqXHR.responseText!==null && settings.jqXHR.responseText.length && typeof settings.jqXHR.responseText =="string"){
						th.FundDetails = vmf.getObjByIdx(vmf.json.txtToObj(settings.jqXHR.responseText),0);
					}
                }
            });
        } else { // reloading the table
			vmf.datatable.reload(th.sfTbl, ccp.globalVar.subFundSummaryURL, th.setDropDownMenu, "POST",{"encFundID":ccp.globalVar.encFundId},th.reloadError);
		}
		//th.kbUrl = ccp.globalVar.kbUrlViewFunds;
    },
	setDropDownMenu:function(){
		var map = [];
		if(th.fnOwner){
			map = [{
					id: 'mnghold',
					text: ccp.globalVar.actionsManageHold,
					liCls: 'inactive',
					callBk: th.manageHold
				}, {
					id: 'mngsp',
					text: ccp.globalVar.actionsManageService,
					liCls: 'inactive',
					callBk: th.manageServiceProviders
				}, {
					id: 'tcr',
					text: ccp.globalVar.actionsTransferCredits,
					liCls: 'inactive',
					callBk: th.transferCredits
				}, {
					id: 'cfuser',
					text: ccp.globalVar.actionsChangeFundUser,
					liCls: 'inactive',
					callBk: th.changeFundUser
				},{
					id: 'dsfund',
					text: ccp.globalVar.actionsDeleteSubFund,
					liCls: 'inactive',
					callBk: th.deleteSubFund
				},{
					id: 'rsfund',
					text: ccp.globalVar.actionsRenameSubFund,
					liCls: 'inactive',
					callBk: th.renameSubFund
				}];
			}else{
				map = [{
					id: 'mnghold',
					text: 'Manage Hold/Redemptions',
					liCls: 'inactive',
					callBk: th.manageHold
				}, {
					id: 'mngsp',
					text: 'Manage Service Providers',
					liCls: 'inactive',
					callBk: th.manageServiceProviders
				}];
			}
			vmf.cmenu.show({
				data: map,
				targetElem: 'tbl_subFundSummary',
				contextMenuFlag: false,
				cClass:'ccpDropDown',
				actionBtnFlg: true,
				funcName: 'cursorPosition',
				cmenuId: 'fnActions',
				actionBtnClass:'dropDown',
				showBtn:true,
				getTargetDetails:function(target){
					return $(target).closest('tr');
				},
				getTargetNode: function (targetElem) {
					return $('#' + targetElem).find('span.dd');
				},
				menuChgState: function (target, cmenuId, disableMnu) {
					var cmenu = $('#' + cmenuId), tr = $(target).closest('tr'), links = $(target).closest('tr').data('per');
					tr.addClass('active');
					cmenu.find('a').addClass(disableMnu).parent('li').addClass('inactive').removeClass('tooltip');
					for (var i in links){
						if(links[i]) cmenu.find('#'+i).removeClass(disableMnu).parent('li').removeClass('inactive').removeClass('tooltip').removeAttr('title').unbind('mouseenter mouseleave');
					}
					if(th.fnOwner && cmenu.find('li.inactive').length){
						cmenu.find('li.inactive a#cfuser').parent('li').addClass('tooltip').attr('title',ccp.globalVar.actChangeFundUserToolTip);
						cmenu.find('li.inactive a#dsfund').parent('li').addClass('tooltip').attr('title',ccp.globalVar.genericDeleteTooltip);
					}
					myvmware.hoverContent.bindEvents(cmenu.find('.tooltip'), 'funcleft');
				}
			});
			$('#tcr').closest('li').addClass('btmBorder');
	},
	bSelect: function(selObj,reset){ //This function is to create Sub-fund select box.
		/*var sfList = [], trs = th.sfTbl.find('tbody tr');
		var tSFlist = {"subFundList":[]};
		sfList.push('<option value="selectOne" tnum="0">Select One</option>');
		$.each(trs,function(k,val){
			v = $(val);
			sfList.push("<option value='" + v.data('id') + "' tnum='" + v.data('crs') + "' fname='" + v.data('fnName') + "'>" + v.data('fnName') + " - " + v.data('crs') + ccp.globalVar.creditLabel + "</option>");
			tSFlist.subFundList.push(
				'{"subFundCreditsRemaining":"' + v.data('crs') +'",'+
	            '"subFundId": "' + v.data('id') + '",' +
	            '"defaultSubFund":"' + 0 + '",' +
		        '"subFundName":"' + v.data('fnName') + '"}')
		});
		selObj.append(sfList.join(''));
		tt.jSelect = vmf.json.txtToObj(tSFlist);
		$("select#sfFrom option[tnum='0.00'][value!='selectOne'], select#sfFrom option[tnum='0'][value!='selectOne']").remove();
		$('select#sfFrom').val(th.activeSFId).trigger('change');
		*/
		//To be removed as this is additional call 
		th.activeSFId = $(th.activeTr).data('id');
		selObj.html('<option value="pre">' + ccp.globalVar.loadingLabel + '</option>')
		vmf.ajax.post(ccp.globalVar.transerCreditsURL,null,function(data){
			var oList=[],
				jData = data.subFundList;
				//jD = vmf.json.txtToObj(data),
				//jData = jD.subFundList;
			tt.jSelect=jData // Storing in global array
			if (jData!=null){ 
				//Check if it is a proper json response
				oList.push('<option value="selectOne" tnum="0">Select One</option>');
				$.each(jData, function(i,v){
					oList.push("<option value='"+v.subFundId+"' tnum='"+parseInt(v.subFundCreditsRemaining)+"' fname='"+v.subFundName+"'>"+v.subFundName+" - "+ v.subFundCreditsRemainingString +" "+ tt.getLabel(v.subFundCreditsRemainingString) + "</option>");
				}); 
				// changed v.tokens to v.subFundTokensRemaining, to display remaining tokens
				selObj.find('option[value="pre"]').remove();
				selObj.append(oList.join(''));
				$("select#sfFrom option[tnum='0'][value!='selectOne'], select#sfFrom option[tnum='0'][value!='selectOne']").remove();
				if(!reset) $('select#sfFrom').val(th.activeSFId).trigger('change');
			} else if(data.ERROR_CODE.length != null && data.ERROR_CODE.length) {
				$('#transferTokens').hide();$('#noTransferTokens').show();
			} else{alert(ccp.globalVar.errorSubfundDetails);}
		},function(){alert(ccp.globalVar.errorSubfundDetails)});
		
	},
	showloading :function(){return sOut="<div class='loadWraper' style='text-align:center; padding-left:40%'><div class='loading_big'>"+ccp.globalVar.loadingLabel+"</div></div>";},
	submitSFUForm: function(sfuEmail, sfFN, sfLN){
		$('#sf_inst').hide();
		$('#sf_submitDetail').show().find('#newSFMail').html(sfuEmail).end().find('#newSFN').html(sfFN + " " + sfLN);
		return false;
	},
	bindHoverEffects: function(tableobj,sType){
		$(tableobj).find(">tbody>tr:not('.dynamicRow, .disabled')").live('mouseover mouseout click',function(e){
			e.preventDefault();
			if($(this).is(".dynamicRow, .disabled, .inactive")) return;
			if(e.type=="mouseover"){$(this).addClass("hover");} 
			else if (e.type=="mouseout"){$(this).removeClass("hover");} 
			else {
				if(sType == 'multi'){
					if($(this).hasClass('active')) $(this).removeClass('active').find('td:eq(0) input').attr('checked',false);
					else $(this).addClass('active').find('td:eq(0) input').attr('checked',true);
					ccp.fD.ua.validateQty();
				}else{
					$(this).siblings().removeClass("active");
					$(this).addClass("active");
					if(tableobj.attr('id')=='tbl_managehold') hd.expandRow($(this).find('span.openclose'));
				}
				if(tableobj.attr('id')=='licenseTbl') ccp.fD.ua.calcPartial($(this));
			}
		});
	},
	toggleContinue: function(flag){ //Enable or Diasable Continue button
		if (flag)
			$("#cCart").removeClass('disabled').unbind('click').bind('click',th.submitCart);
		else 
			$("#cCart").addClass('disabled').unbind('click');
	},
    calcSnsTotalTokens: function(snsTokens,qty,snsDuration) {
        return(snsTokens*qty*snsDuration/th._daysInYear);
    },
    calcTermLicTotalTokens: function(termLicTokens,qty,termDuration) {
        return(termLicTokens*qty*termDuration/th._daysInYear);
    },
	reloadError: function(error){
		vmf.modal.hide();
		th.err.text(error.ERROR_MESSAGE).show();
	},
    downloadRedemptionReport: function(e) {
		e.preventDefault();
		location.href=ccp.globalVar.downloadRedemptionExcelReportURL;
		//if(typeof riaLinkmy != "undefined") riaLinkmy(ccp.globalVar.pageName + ' : redemption report');
	},
	downloadActivityReport: function(e) {
		e.preventDefault();
		location.href=ccp.globalVar.downloadRedemptionActivitiesExcelReportURL;
		//if(typeof riaLinkmy != "undefined") riaLinkmy(ccp.globalVar.pageName + ' : activity report');
	},
	hold:{
		hd:null,
		hDt:null,
		curFundJson:null,
		actHdTr:null,
		curhId:null,
		hdActions:{},
		init:function(){
			hd = ccp.fD.hold;
			th.getSubFundList('managehold');
			//setting approve and reject permissions
			hd.hdActions = {'approveLink':1,'rejectLink':1}
		},
		getHoldDetails:function(){
	        if(!(th.mhTble.find('tbody tr').length)) {
	            vmf.datatable.build(th.mhTble,{
	                "aoColumns": [
	                	{"sTitle": "","sClass":"tdOpenCloseButton","sWidth":"5px","bSortable":false},
						{"sTitle": "<span class='descending'>" + ccp.globalVar.type + "</span>","sClass":"","sWidth":"70px","bSortable":true},
	                    {"sTitle": "<span class='descending'>" + ccp.globalVar.referenceId + "</span>","sClass":"","sWidth":"120px","bSortable":true},
	                    {"sTitle": "<span class='descending'>" + ccp.globalVar.serviceProvider + "</span>","sClass":"","sWidth":"120px","bSortable":true},
	                    {"sTitle": "<span class='descending'>" + ccp.globalVar.status + "</span>","sClass":"","sWidth":"60px","bSortable":true},						
	                    {"sTitle": "<span class='descending'>" + ccp.globalVar.startDate + "</span>","sClass":"","sWidth":"80px","bSortable":true},
	                    {"sTitle": "<span class='descending'>" + ccp.globalVar.endDate + "</span>","sClass":"","sWidth":"80px","bSortable":true},
	                    {"sTitle": "<span class='descending'>" + ccp.globalVar.credits + "</span>","sClass":"","sWidth":"80px","bSortable":true},	                    
	                    {"sTitle": ccp.globalVar.actions,"sClass":"btnCol","sWidth":"100px","bSortable":false}
						],
	                "oLanguage": {
	                    "sEmptyTable":'<div id="loadingerrormsg"><div id="innerMsg2" class="error_innermsg"><p>'+ccp.globalVar.noHoldRedeemLabel+'</p></div></div>',
	                    "sProcessing":ccp.globalVar.loadingLabel,
	                    "sLoadingRecords":""
	                },
	                "fnServerParams": function ( aoData ) {
	                    aoData.push( { "name": "subFundID", "value": th.activeSFId } );
	                },
	                "sAjaxSource":ccp.globalVar.holdDetailsUrl,
	                "bInfo":false,
	                "bProcessing": true,
	                "bServerSide": false,
	                "bAutoWidth" : false,
                	"sDom": 'zrtSpi',
	                "bFilter":false,
	                "bPaginate": false,
					"aaSorting": [],
	                "fnRowCallback": function(nRow,aData,iDisplayIndex){ 
	                    var $nRow=$(nRow);
						$nRow.data({'fId':aData[0], 'hId':aData[2], 'cr':aData[7], 'type':aData[1], 'status':aData[4], 'payType':aData[9], 'per':hd.hdActions});
                        $nRow.attr('refId', aData[2]);
						$nRow.find('td:eq(0)').html('<span class=\"openclose\"></span>');
						$nRow.find('td:eq(1)').html(aData[1]);
						$nRow.find('td:eq(7)').addClass('right');
	                    if(aData[8] == 'Y') $nRow.find('td:eq(8)').html('<span class="dd"></span>');	
	                    $nRow[0].idx = iDisplayIndex;
	                    return nRow;
	                },
					"fnDrawCallback": function(){ 
						$(this.fnGetNodes()).addClass("expandable");
						$(this).find('tbody tr').each(function(){
							if ($(this).next('tr').hasClass('more-detail') && $(this).hasClass('expanded')){
								$(this).find('span.openclose').addClass('minus');
							}
							if($(this).hasClass('expandable') && $(this).hasClass('active')) $(this).addClass('active');
						});
						if($('#fnHdActions').length) $('#fnHdActions').hide();
	                	hd.setHoldDropDownMenu();
					},
	                "fnInitComplete": function (aoData) {
	                	hd.hDt = this;
						var settings= this.fnSettings();
						if(settings.jqXHR && settings.jqXHR.responseText!==null && settings.jqXHR.responseText.length && typeof settings.jqXHR.responseText =="string"){
							hd.curFundJson = vmf.getObjByIdx(vmf.json.txtToObj(settings.jqXHR.responseText),0);
						}
						$(this).find('tbody tr').each(function(){
							if ($(this).next("tr").hasClass('more-detail')){
								$(this).addClass('expanded').find('span.openclose').addClass('minus');
							}else{
								$(this).removeClass('expanded').find('span.openclose').removeClass('minus');
							}
						});
                        if(th.preSelectManageHold) {
                            var refId = '';
                            if(ccp.globalVar.entityType == 'CCP_HOLD') {
                                refId = 'H' + ccp.globalVar.entityId;
                            } else if(ccp.globalVar.entityType == 'CCP_REDEMPTION') {
                                refId = 'R' + ccp.globalVar.entityId;
                            }
                            $(this).find('tr[refId="' + refId + '"] > td:eq(0) span').trigger('click');
                            th.preSelectManageHold = false;
                        }
                        th.bindHoverEffects(hd.hDt);
	                }
	            });
	        } else { // reloading the table
				vmf.datatable.reload(th.mhTble, ccp.globalVar.holdDetailsUrl, hd.setHoldDropDownMenu, "POST",{"subFundID" : th.activeSFId},th.reloadError);
			}
	    },
	    expandRow :function(o){
			hd.nTr = o[0].parentNode.parentNode;
			$(hd.nTr).addClass("activeTr").siblings().removeClass("activeTr");
			if (o.hasClass('minus')){
				o.removeClass('minus');
				$(hd.nTr).removeClass("expanded").next("tr").hide();
			}else{
				o.addClass('minus');
				$(hd.nTr).addClass("expanded");
				if(!hd.nTr.haveData){
					hd.hDt.fnOpen(hd.nTr,hd.showloading(),'');
					hd.getCdata($(hd.nTr),hd.nTr.idx);
					hd.nTr.haveData = true;
					$(hd.nTr).next("tr").addClass('more-detail');
				}else{
					$(hd.nTr).next("tr").show();			
				}
			}
		},
		showloading :function(){return sOut="<div class='loadWraper' style='text-align:center; padding-left:40%'><div class='loading_big'>Loading.....</div></div>";},
		getCdata:function(rowObj, idx){
			var sOut = [];
			sOut.push('<div class="more-details-history ccpFtSub">');
			sOut.push('</div>');
			$(hd.nTr).next("tr").addClass('more-detail').find("td").html(sOut.join(''));
			var subData = hd.curFundJson.subaaData[rowObj.data('hId')];
			//added this code for 
			var holdData = "<p class='crDetails'>";
			
			if(rowObj.data('type') == 'Hold') {
				holdData = holdData +'<strong>'+ ccp.globalVar.holdDesc +'</strong>' + subData[4] + '</br><strong>'+ ccp.globalVar.holdType +'</strong>' + subData[2];
			} else {
				holdData = holdData +'<strong>'+ ccp.globalVar.redemptionDesc +'</strong>' + subData[4] + '</br><strong>'+ ccp.globalVar.redemptionType +'</strong>' + subData[2];
			}
			if(subData[2] != 'OTHER' && rowObj.data('type') == 'Hold') {
					holdData = holdData + '</br><strong>'+ccp.globalVar.creditsPerMonth +'</strong>' + subData[3] 
								+ '</br><strong>' + ccp.globalVar.billingDayInMonth +'</strong>' + subData[5];
			}
			holdData = holdData + '</br><strong>' + ccp.globalVar.spContact +'</strong>' + subData[7] + '</br><strong>' + ccp.globalVar.spEmail +'</strong>' + subData[8]+'</br>';
				
			if(rowObj.data('status') == 'Rejected' || rowObj.data('status') == 'Cancelled') {
					holdData = holdData +'<strong>'+ ((rowObj.data('status') == 'Rejected')?ccp.globalVar.reject:ccp.globalVar.cancel) + ccp.globalVar.comments + ': ' +'</strong>' + subData[6];
			}
			holdData = holdData + '</p>';
			
			$(rowObj).next('tr.more-detail').find('.more-details-history').html(holdData);
		},
		approveAction:function(tr){
			hd.curhId = tr.data('hId');
			vmf.modal.show('approveModal');
		},
		rejectAction:function(tr){
			hd.curhId = tr.data('hId');
			vmf.modal.show('rejectModal');
		},
		approveHold:function(){
			vmf.ajax.post(ccp.globalVar.approveHoldURL, '&holdId=' + hd.curhId, function(data){
				vmf.modal.hide();
				if(data.GenericJSON) {
					th.err.hide();
					$('#btnApprove').attr('disabled',false).removeClass('disabled');
					hd.getHoldDetails();
				}
			},th.reloadError);
		},
		rejectHold:function(){
			var rejComments = $('#rejectComments').val();
			vmf.ajax.post(ccp.globalVar.rejectHoldURL,'&subFundId=' + th.activeTr.data('id') + '&holdId=' + hd.curhId + '&rejectComments=' + rejComments, function(data){
				vmf.modal.hide();
				if(data.GenericJSON) {
					if(hd.actHdTr.data('payType') == '0') th.updateSFDropdown('managehold');
					//th.getSubFundList('managehold');
					if(data.GenericJSON.params != null){
						$('#crRemain').text(data.GenericJSON.params);
					}
					th.err.hide();
					ccp.common.toggleButton($('#btnReject'), true);
					hd.getHoldDetails();
				} else {
					th.reloadError(data);
				}
			},th.reloadError);
		},
		setHoldDropDownMenu:function(){
			var map = [{
				id: 'approveLink',
				text: ccp.globalVar.approveText,
				liCls: 'inactive',
				callBk: hd.approveAction
			}, {
				id: 'rejectLink',
				text: ccp.globalVar.rejectText,
				liCls: 'inactive',
				callBk: hd.rejectAction
			}];
			
			vmf.cmenu.show({
				data: map,
				targetElem: 'tbl_managehold',
				contextMenuFlag: false,
				cClass:'ccpDropDown',
				actionBtnFlg: true,
				funcName: 'cursorPosition',
				cmenuId: 'fnHdActions',
				actionBtnClass:'dropDown',
				showBtn:true,
				getTargetDetails:function(target){
					hd.actHdTr = $(target).closest('tr');
					return $(target).closest('tr');
				},
				getTargetNode: function (targetElem) {
					return $('#' + targetElem).find('span.dd');
				},
				menuChgState: function (target, cmenuId, disableMnu) {
					var cmenu = $('#' + cmenuId), tr = $(target).closest('tr'), links = $(target).closest('tr').data('per');
					tr.addClass('active').addClass('activeTr').siblings().removeClass('activeTr').removeClass('activeTr');
					cmenu.find('a').addClass(disableMnu).parent('li').addClass('inactive');
					for (var i in links){
						if(links[i]){
							cmenu.find('#'+i).removeClass(disableMnu).parent('li').removeClass('inactive');
						}
					}
				}
			});
			$('#tcr').closest('li').addClass('btmBorder');
		}
		
	},
	sp:{
		msp:null,
		sDt:null,
		init:function(){
			msp = ccp.fD.sp;
			//msp.bindSPevents();
			$('#mngSpControls').show();
			th.getSubFundList('manageservice');
		},
		getSpDetails:function(){		
			if(!th.spTble.find('tbody tr').length) {
	            vmf.datatable.build(th.spTble,{
	                "aoColumns": [
	                    {"sTitle": "","bVisible":false},
	                    {"sTitle": "","bVisible":false},
	                    {"sTitle": "","bVisible":false},
	                    {"sTitle": ccp.globalVar.hdrGrantAccess,"sClass":"","sWidth":"85px","bSortable":false},
	                    {"sTitle": ccp.globalVar.hdrViewAccess,"sClass":"","sWidth":"70px","bSortable":false},
	                    {"sTitle": ccp.globalVar.hdrServiceProvider,"sClass":"","bSortable":false},
	                    {"sTitle": "","bVisible":false},
	                    {"sTitle": "","bVisible":false}
	                ],
	                "oLanguage": {
	                    "sEmptyTable":'<div id="loadingerrormsg"><div id="innerMsg3" class="error_innermsg"><p>'+ccp.globalVar.noSPLabel+'</p></div></div>',
	                    "sProcessing":ccp.globalVar.loadingLabel,
	                    "sLoadingRecords":""
	                },
					"fnServerParams": function ( aoData ) {
	                    aoData.push( { "name": "subFundID", "value": th.activeSFId } );
	                },
	                "sAjaxSource":ccp.globalVar.serviceProvidersURL,
	                "bInfo":false,
	                "bProcessing": true,
	                "bServerSide": false,
	                "bAutoWidth" : false,
                	"sDom": 'zrtSpi',
	                "bFilter":false,
	                "bPaginate": false,
	                "sScrollY": "650px",
					"aaSorting": [],
	                "fnRowCallback": function(nRow,aData,iDisplayIndex){ 
	                    var $nRow=$(nRow);
						$nRow.data('spId',aData[6]);
						if(ccp.globalVar.crType == 'VSPP'){
							if(th.fnOwner){
								this.fnSetColumnVis(3,true);
								$nRow.find('td:eq(0)').addClass('center').html('<input type="checkbox" class="grantCheck" />');
								$nRow.find('td:eq(1)').addClass('center').html('<input type="checkbox" />');
								if(aData[0] == 'true') $nRow.find('td:eq(0) input').attr('checked','checked');else $nRow.find('td:eq(1) input').attr('disabled',true);
								if(aData[1] == 'true') $nRow.find('td:eq(1) input').attr('checked','checked');		
								$nRow.find('td:eq(2)').html(  '<div class="fLeft"><a href="http://'+aData[7]+'" target="_blank"><img class="imgHolder" src='+aData[2] +'></a> </div><div class="spContent fLeft"><p class="nomargin"><b>' + aData[3] + '</b> ' + aData[4] + ' <a href="http://'+aData[7]+'" target="_blank">'+ccp.globalVar.gotoLabel+ " "+aData[3] +'</a></p></div><div class="regionMsg">Region: ' + aData[5] +'</div>');
							} else {
								this.fnSetColumnVis(3,false);
								$nRow.find('td:eq(0)').addClass('center').html('<input type="checkbox" disabled="disabled" />');
								if(aData[1] == 'true') $nRow.find('td:eq(0) input').attr('checked','checked');	
								$nRow.find('td:eq(1)').html(  '<div class="fLeft"><a href="http://'+aData[7]+'" target="_blank"><img class="imgHolder" src='+aData[2] +'></a> </div><div class="spContent fLeft"><p class="nomargin"><b>' + aData[3] + '</b> ' + aData[4] + ' <a href="http://'+aData[7]+'" target="_blank">'+ccp.globalVar.gotoLabel+ " "+aData[3] +'</a></p></div><div class="regionMsg">Region: ' + aData[5] +'</div>');
							}				
						}
						else if(ccp.globalVar.crType == 'VPC'){
							if(th.fnOwner){
								this.fnSetColumnVis(4,false);
								$nRow.find('td:eq(0)').addClass('center').html('<input type="checkbox" />');
								$nRow.find('td:eq(1)').html('<div class="imgHolder '+ aData[2] +' fLeft"></div><div class="spContent fLeft"><p class="nomargin"><b>' + aData[3] + '</b> ' + aData[4] + ' <a href="http://'+aData[7]+'" target="_blank">'+ccp.globalVar.gotoLabel+ " "+aData[3] +'</a></p></div><div class="regionMsg">Region: ' + aData[5] +'</div>');	
								if(aData[0] == 'true') $nRow.find('td:eq(0) input').attr('checked','checked');
							}else{
								this.fnSetColumnVis(3,false);
								this.fnSetColumnVis(4,false);
								$nRow.find('td:eq(0)').html('<div class="imgHolder '+ aData[2] +' fLeft"></div><div class="spContent fLeft"><p class="nomargin"><b>' + aData[3] + '</b> ' + aData[4] + ' <a href="http://'+aData[7]+'" target="_blank">'+ccp.globalVar.gotoLabel+ " "+aData[3] +'</a></p></div><div class="regionMsg">Region: ' + aData[5] +'</div>');	
							}
						}
	                    return nRow;
	                },
	                "fnInitComplete": function (aoData) {
	                	msp.sDt = this;
	                	if(!th.fnOwner) $('#mngSpControls').hide();
	                }
	            });
	        } else { // reloading the table
				vmf.datatable.reload(th.spTble, ccp.globalVar.serviceProvidersURL, null, "POST",{"subFundID" : th.activeSFId},th.reloadError);				
			}
		}
	},
	//Transfer Tokens area
	tt:{//init function for Transfer Tokens
		rg:/^(\d|-)?(\d|,\d{3})*\.?\d*$/,
		fflag:false, //insufficient funds flag
		tAmt:null,
		fAmt:null,
		toAmt:null,
		jSelect:[],
		init:function(){
			$('#transferTokens').show();
			tt.clearflds();
			tt.bindfuncs(); 
			//if(typeof riaLinkmy != "undefined") riaLinkmy('epp_transfer-tokens');
			//kbUrl = ccp.globalVar.kbUrlTransferTokens;
		},
		getLabel:function(num){
			if(parseInt(num) == 1) return ccp.globalVar.creditLabel; else return ccp.globalVar.creditsLabel;
		},
		clearflds:function(reset){//clear values/enable/disable/show/hide forrequired elements
			$('select#sfFrom , select#sfTo').empty();
			$('#tfInst .main_inst').html(ccp.globalVar.transferTokensIntoMsg);
			$('#tfInst').show();
			$('input#txt_amt').val('0');
			$("#chk_tt_uw").removeAttr('checked');
			$('label#lbl_frmSf_Lt,label#lbl_toSf_Lt,label#lbl_frmTkns_Lt,label#lbl_toTkns_Lt').html('');
			ccp.common.toggleButton($('#btn_tt_Reset'), true);
			ccp.common.toggleButton($('button#btn_tt_Confrm'), false);
			$('div#step1').removeClass('disabled').find('select,input').removeAttr('disabled');	
			$('div#step2 div.div_row, div#step2 a').hide();
			th.bSelect($('select#sfFrom , select#sfTo'),reset); //fetch sub-fund and load Transfer Tokens dropdowns (2) 
		},
		bindfuncs:function(){// bind event to elements			
			$('input#txt_amt').keyup(function(){tt.dispRB();});
			$('input#txt_amt').focus(function(){if($(this).val() == 0) $(this).val('');	});
			$('input#txt_amt').bind('focusout',tt.disFloat);
			$('select#sfFrom').change(function(){tt.mngToSel($(this),$('select#sfTo'));})
			$('select#sfTo').change(function(){
				tt.mngToSel($(this),$('select#sfFrom'));
				if($.trim($('input#txt_amt').val()).length) $('input#txt_amt').trigger('focusout');
			})
			$('button#btn_tt_Confrm').unbind().bind('click',function(){ 
				ccp.common.toggleButton($('#btn_tt_Confrm'), false);
				ccp.common.toggleButton($('#btn_tt_Reset'), false); 
				tt.confirm();
			})
			$('#chk_tt_uw').change(function(){tt.validate(); })
			$('button#btn_tt_Reset').unbind().bind('click',function(){tt.clearflds(true); return false;});
			$('a#mkeOt').unbind().bind('click',function(){tt.clearflds(); return false;});
			$('#transfer_content #step1 input,#transfer_content #step1 select').bind('keypress',function(e){
				 if(e.which == th._ENTER_KEY) {
				 	$('#btn_tt_Confrm').not('.disabled').trigger('click');
				 	ccp.common.toggleButton($('#btn_tt_Confrm'), false);
				 }
			})
		},
		mngToSel:function(fObj,tObj){
			if (tt.jSelect !=null){ //Check if it is a proper json format
				var tVal =tObj.val(); //Store current value of second Dropdown
				tObj.find('option').remove(); //Remove All Options of second Dropdown
				var oList=[]; // Take empty array
				oList.push('<option value="selectOne" tnum="0">Select One</option>');//Push SelectOne option
				//Create select box dropdown
				$.each(tt.jSelect, function(i,v){
					if (fObj.val()!=v.subFundId){ //Do not include the option selected in first dropdown
						if(v.subFundId==tVal) //Make already selected box as default
							oList.push("<option value='"+v.subFundId+"' tnum='"+parseInt(v.subFundCreditsRemaining)+"'  fname='"+v.subFundName+"' selected=\"selected\">"+v.subFundName+" - "+v.subFundCreditsRemainingString+" "+tt.getLabel(v.subFundCreditsRemainingString)+"</option>");
						else oList.push("<option value='"+v.subFundId+"' tnum='"+parseInt(v.subFundCreditsRemaining)+"' fname='"+v.subFundName+"'>"+v.subFundName+" - "+v.subFundCreditsRemainingString +" "+tt.getLabel(v.subFundCreditsRemainingString)+"</option>");
					}
				}); 
				tObj.append(oList.join(''));
				$("select#sfFrom option[tnum='0'][value!='selectOne']").remove();
				if($("select#sfFrom").val()!="selectOne") $("select#sfFrom").find("option[value=selectOne]").remove();
				if($("select#sfTo").val()!="selectOne") $("select#sfTo").find("option[value=selectOne]").remove();
			}
			tt.dispRB();
		},
		dispRB:function(){//Display Resulting Balances
			var $tAmt=$('input#txt_amt'), $fOpt=$('select#sfFrom option:selected'), $tOpt=$('select#sfTo option:selected'),
				$fLabel=$('label#lbl_frmTkns_Lt'), $tLabel=$('label#lbl_toTkns_Lt'), regExp=/^[0-9]$/;
				tt.tAmt=parseInt($tAmt.val(),10); 
				if(isNaN(tt.tAmt)) $tAmt.val('');
				tt.tAmt=(!$.trim(tt.tAmt).length || isNaN(tt.tAmt))? 0: parseInt(tt.tAmt,10);
				tt.fAmt=parseInt($fOpt.attr('tnum')) || 0;
				tt.toAmt=parseInt($tOpt.attr('tnum')) || 0;
				if((tt.fAmt-tt.tAmt) < 0){
					$fLabel.html(ccp.globalVar.insufficientFund).addClass('textRed bld');
					$('label#lbl_frmSf_Lt,label#lbl_toSf_Lt').html('');
					$tLabel.html('');
					tt.fflag=false;
				} else {
					if($fOpt.val()!="selectOne") $fLabel.html(ccp.addCommas(parseInt(tt.fAmt-tt.tAmt))+" "+ tt.getLabel(parseInt(tt.fAmt-tt.tAmt))).removeClass('textRed bld');
					if($tOpt.val()!="selectOne") $tLabel.html(ccp.addCommas(parseInt(tt.toAmt+tt.tAmt)) +" "+ tt.getLabel(parseInt(tt.toAmt+tt.tAmt)));
					tt.fflag=true;
					$('label#lbl_frmSf_Lt').html($fOpt.attr('fname'));
					$('label#lbl_toSf_Lt').html($tOpt.attr('fname'));
				}
				
				if( tt.tAmt < 0){
					$fLabel.html('Invalid Amount').addClass('textRed bld');
					$tLabel.html('');
					tt.fflag=false;
				}
				
				tt.validate();
		},
		disFloat: function(e){
			var $this=$(this), val=$(this).val().replace(/,/g, '');
			if(!$.trim(val).length){$this.val("0"); return;} //Check if field is empty
			val = (isNaN(val))? "0" : parseInt(val,10); //Check if it a valid number
			if (val=="0") tt.btnED($('button#btn_tt_Confrm'),false);
			$this.val(ccp.addCommas(val));
		},
		validate:function(){//validate inputs and lead to enable or disable buttons
			var  flg = (
						tt.rg.test(ccp.addCommas($('#txt_amt').val())) && 
						$('#chk_tt_uw').is(':checked') && 
						tt.fflag && 
						parseInt($("#txt_amt").val())>0 && 
						$('#sfFrom option:selected').attr('tnum') != '0'
					   )?1:0;
			if(isNaN($('#txt_amt').val().replace(/,/g, ''))) flg=0;
			tt.btnED($('button#btn_tt_Confrm'),flg);
		},
		btnED:function(btn,flg){//Enable or Disable buttons
			if(flg)	btn.removeClass('disabled').removeAttr('disabled');
			else	btn.addClass('disabled').attr('disabled','disabled');
		},
		confirm:function(){// Confirm click
			var fromSubFundId = $('select#sfFrom option:selected').val(),
				toSubFundId = $('select#sfTo option:selected').val(),
				transferCredits = $.trim($('#txt_amt').val());
			vmf.ajax.post(ccp.globalVar.processCreditsTransferURL,
			"&fromSubFundId="+encodeURIComponent(fromSubFundId)+
			"&toSubFundId="+encodeURIComponent(toSubFundId)+
			"&transferCredits="+transferCredits,
			function(data){
				//var oList=[],jData=data.GenericJSON;
				var oList=[],jData=data.GenericJSON;
				if (jData!=null && jData){ //Check if it is a proper json response
					$('div#step1').addClass('disabled').find('select,input,button').attr('disabled','disabled');	
					ccp.common.toggleButton($('#btn_tt_Confrm'), false);
					$('#tfInst').hide();
					$('div#step2 div.div_row, div#step2 a').show();
					$('label#trnsfrdTkns').html(ccp.addCommas(parseInt(tt.tAmt)) + " " + tt.getLabel(tt.tAmt))
					$('label#lbl_frmSf_Rt').html($('select#sfFrom option:selected').attr('fname'));
					$('label#lbl_toSf_Rt').html($('select#sfTo option:selected').attr('fname'));
					$('label#lbl_frmTkns_Rt').html(ccp.addCommas(parseInt(tt.fAmt-tt.tAmt)) + " " + tt.getLabel(parseInt(tt.fAmt-tt.tAmt)));
					$('label#lbl_toTkns_Rt').html(ccp.addCommas(parseInt(tt.toAmt+tt.tAmt)) + " " + tt.getLabel(parseInt(tt.toAmt+tt.tAmt)));
					//if(typeof riaLinkmy != "undefined") riaLinkmy(ccp.globalVar.pageName + ' : transfer tokens : confirm');
				} else {$('#tfInst .main_inst').html(ccp.globalVar.transferTokensFailMsg);}
			},function(){$('#tfInst .main_inst').html(ccp.globalVar.transferTokensFailMsg);
			},function(){$("#transferLoading").addClass('hidden');$("#step2").removeClass('hidden');
			},null,function(){$("#transferLoading").removeClass('hidden');$("#step2").addClass('hidden');
			});
		}
	},//Transfer Tokens will end here
	downloadRedemptionReport: function(e) {
		e.preventDefault();
		location.href=ccp.globalVar.downloadRedemptionsReportURL;
		if(typeof riaLinkmy != "undefined") riaLinkmy(ccp.globalVar.pageName + ' : redemption report');
	},
	downloadActivitiesReport: function(e) {
		e.preventDefault();
		location.href=ccp.globalVar.downloadActivitiesReportURL;
		if(typeof riaLinkmy != "undefined") riaLinkmy(ccp.globalVar.pageName + ' : activities report');
	},
	showLoading:function(element){
		if(element.find('.preLoadHolder').length) element.find('.preLoadHolder').remove();
		element.append('<div class="preLoadHolder"><div class="loading_small">'+ ccp.globalVar.loadingLabel +'</div></div>');
	}
};//End of fund details