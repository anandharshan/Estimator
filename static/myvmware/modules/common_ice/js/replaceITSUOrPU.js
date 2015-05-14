vmf.ns.use("ice");
ice.replaceITSUOrPU={
		// for string user data to make it use for filtering

		globalReplaceRoleFlag:null,
		outGoingUserFirstName:null,
		outGoingUserLastName:null,
		globalReplaceITSUPUDetailsData:null,

		globalSelectedUserCn:null,
		globalSelectedUserFN:null,
		globalSelectedUserLN:null,
		globalSelectedUserEmail:null,
		globalKeepRemoveOpt:null,		
		globalCallBackFunction:null,	    	

		attachLinks:function(suDivId,puDivId,callBackFunction){			
			globalCallBackFunction =callBackFunction;
			
			$('#' + suDivId).unbind('click');
			$('#' + puDivId).unbind('click');
			
			// do the action based on the selection of link
			$('#' + suDivId).bind('click',function() { 
				riaLinkmy('account-summary : change-super-user');
				ice.replaceITSUOrPU.loadUserData(replaceRoleFlagSU);
			});
			$('#' + puDivId).bind('click',function() {					
				riaLinkmy('account-summary : change-procurement-contact');
				ice.replaceITSUOrPU.loadUserData(replaceRoleFlagPU);
			});
			$('#' + suDivId).removeClass('dummyClick');
			$('#' + puDivId).removeClass('dummyClick');
			$('#' + suDivId).parent('li').removeClass('inactive');
			$('#' + puDivId).parent('li').removeClass('inactive');

		},
		detachLinks:function(suDivId,puDivId){
			globalCallBackFunction =null;
			$('#' + suDivId).unbind('click');
			$('#' + puDivId).unbind('click');
			$('#' + suDivId).addClass('dummyClick');
			$('#' + puDivId).addClass('dummyClick');
			$('#' + suDivId).parent('li').addClass('inactive');
			$('#' + puDivId).parent('li').addClass('inactive');
		},
		loadUserData:function(replaceFlag){			
			$('input').keyup(function(e) { if(e.keyCode == 13) ice.replaceITSUOrPU.filterUsers(); });
			globalReplaceRoleFlag = replaceFlag;
			globalReplaceITSUPUDetailsData = null;
			globalSelectedUserCn = null;
			globalSelectedUserFN=null;
			globalSelectedUserLN=null;
			globalSelectedUserEmail=null;
			globalKeepRemoveOpt = null;

			$('div#repSUOrPU_modalErrorDiv').html('<span class="loading_small">'+loadingURL+'</span>');
			$('div#repSUOrPU_modalConfirmErrorDiv').html('');

			vmf.modal.show("replaceITSuperUserContent2");
			$('div#replaceITSUOrPUWithUserData').hide();

			ice.replaceITSUOrPU.populateHeadersData();

			$('#repSuOrPU_btn_continue').attr('disabled', 'disabled');
			$('#repSuOrPU_btn_continue').addClass('disabled');

			var _dataObj = {};
			_dataObj[replaceRoleFlagParamName]=globalReplaceRoleFlag;
			vmf.ajax.post(loadITSUOrPUReplaceModal_url,
					_dataObj, 
					ice.replaceITSUOrPU.onSuccess_loadUserData, 
					ice.replaceITSUOrPU.onFail_loadUserData);

		},
		onSuccess_loadUserData:function(data){
			$('div#repSUOrPU_modalErrorDiv').html('');	
			$('#repSuOrPuUserList').html('');		
			//$('#repSuOrPU_btn_continue').attr('disabled', '');					
			//$('#repSuOrPU_btn_continue').removeClass('secondary');			
			$('div#replaceITSUOrPUWithUserData').show();
			$('div#repSUorPU_selected_details').html('<div class="users">'+repalceSUOrPU_rightPaneStaticText+'</div>');
			globalReplaceITSUPUDetailsData = vmf.json.txtToObj(data);
			if(globalReplaceITSUPUDetailsData.error){
				$('div#repSUOrPU_modalErrorDiv').html(globalReplaceITSUPUDetailsData.message);
			}else{
				ice.replaceITSUOrPU.populateUserData();
			}
		},
		onFail_loadUserData:function(data){
			$('div#repSUOrPU_modalErrorDiv').html(repalceSUOrPU_err_loadingUserData);
		},
		populateHeadersData:function(){
			var _header_text ='';
			var _confirm_source_text='';
			var _confirm_target_text='';
			var _selected_header_text ='';
			var _header_intro_text='';
			var _header_text_confirm ='';
			var _heading_text='';
			if(globalReplaceRoleFlag==replaceRoleFlagSU){ //for SU
				_header_text = ice.globalVars.changeSuTtl;
				_header_text_confirm = ice.globalVars.confirmReplaceSUMsg;
				//_confirm_source_text = repalceSUOrPU_replaceSection_source_prefix + ' ' ice.globalVarsix +  ' ' + repalceSUOrPU_replaceSection_source_suffix;
				_confirm_source_text = ice.globalVars.followingSUMsg;
				_confirm_target_text = ice.globalVars.followingNewSUMsg;
				_selected_header_text = ice.globalVars.selectedNewUserMsg;
				_header_intro_text = replacesupu_header_su_intro;
				_heading_text = ice.globalVars.selectNewUserMsg;
				_header_text_logout_wrn = ice.globalVars.noLongerSUMsg;
                _header_text_logout_wrn_body = ice.globalVars.replaceConfirmSUMsg; 			
			}else{ //for PU
				_header_text = ice.globalVars.changePcTtl;
				_header_text_confirm = ice.globalVars.confirmReplacePUMsg;
				_confirm_source_text = ice.globalVars.followingProContactMsg;
				_confirm_target_text = ice.globalVars.followingNewProContactMsg;
				_selected_header_text = ice.globalVars.selectedNewPUserMsg;
				_header_intro_text = replacesupu_header_pu_intro;
				_heading_text = ice.globalVars.selectNewPUserMsg;
			    _header_text_logout_wrn = ice.globalVars.noLongerPUMsg;
				_header_text_logout_wrn_body = ice.globalVars.replaceConfirmPCMsg;
			}
			$('div#repSUOrPU_headerTitle').html(_header_text);
			$('div#repSUOrPU_headerTitle_confirm').html(_header_text_confirm);
			$('#repSuorPU_replaceSection_confirm_source').html(_confirm_source_text);
			$('#repSuorPU_replaceSection_confirm_target').html(_confirm_target_text);
			$('#repSUorPU_selected_header').html(_selected_header_text);
			$('#repSUorPU_selected_header_intro').html(_header_intro_text);
			$('#repSUorPU_heading_text').html(_heading_text);
			$('div#replaceITSULogoutWrnTitle').html(_header_text_logout_wrn);
			$('div#replaceITSULogoutWrnBody').html(_header_text_logout_wrn_body);
		},
		populateUserData:function(){
			var _userData = globalReplaceITSUPUDetailsData;
			if(_userData){
				var _account_text='';				
				_account_text = repalceSUOrPU_account_prefix + ' ' + _userData.eaNumber + ' - ' + _userData.eaName;
				$('div#repSUorPU_account').html(_account_text);	
				$('div#repSUorPU_account_confirm').html(_account_text);	
				$('#repSUorPU_noOfAccUsers').html(' ' +_userData.totalAssignableUsers);	
				
			}
			ice.replaceITSUOrPU.renderUsers('');
		},
		renderUsers : function(filterText){			
			var _userDataList = globalReplaceITSUPUDetailsData.assignableUserList.userPaneContents;
			$('div#repSUOrPU_modalErrorDiv').html('');
			var userDataFound=0;
			var _strHTML = '';
			_strHTML= _strHTML + '<ul class="nopadding emailInline">';
			filterText = $.trim(filterText).toUpperCase();
			for(i=0;i<_userDataList.length;i++){

				var _userFirstName = _userDataList[i].firstName;
				_userFirstName = _userFirstName.toUpperCase();
				var _userLastName = _userDataList[i].lastName;
				_userLastName = _userLastName.toUpperCase();
				var _userEmail = _userDataList[i].email;
				_userEmail = _userEmail.toUpperCase();
				var _userFullName = _userFirstName + ' ' + _userLastName;
				if(filterText=='' || filterText==SUorPUSearchDefaultText.toUpperCase() || _userFirstName.indexOf(filterText)!=-1
						|| _userLastName.indexOf(filterText)!=-1
						|| _userFullName.indexOf(filterText)!=-1
					|| _userEmail.indexOf(filterText)!=-1){	

					_strHTML= _strHTML + '<li id="' + _userDataList[i].cN  +'">';
					//_strHTML= _strHTML + '<input type="radio" name="radio1" >';
					_strHTML= _strHTML + '<label class="textStrong" for="' + _userDataList[i].cN +'">' + vmf.wordwrap(_userDataList[i].firstName + ' ' + _userDataList[i].lastName,2) +'</label>';
					_strHTML= _strHTML + '<span class="email">' + vmf.wordwrap(_userDataList[i].email,2) +'</span>';
					_strHTML= _strHTML + '</li>';

					userDataFound=1;
				}
			}
			_strHTML= _strHTML + '</ul>';
			$('#repSuOrPuUserList').html(_strHTML);
			if(userDataFound==0){
				$('div#repSUOrPU_modalErrorDiv').html(SUorPUFilterNoDataMsg);
			}
			ice.replaceITSUOrPU.bindEvents();
		},
		filterUsers : function(){
			globalSelectedUserCn = null;
			globalSelectedUserFN=null;
			globalSelectedUserLN=null;
			globalSelectedUserEmail=null;
			
			globalKeepRemoveOpt = null;
//			$('div#repSUorPU_selected_details').html('');
			if($("#search").val()!=''){
				ice.replaceITSUOrPU.renderUsers($("#search").val());
			}else{
				ice.replaceITSUOrPU.renderUsers('');
			}
		},
		clearFilterRendering : function(){
			if($("#search").val()==''){
				globalSelectedUserCn = null;
				globalSelectedUserFN=null;
				globalSelectedUserLN=null;
				globalSelectedUserEmail=null;

				globalKeepRemoveOpt = null;
				//$('div#repSUorPU_selected_details').html('');
				ice.replaceITSUOrPU.renderUsers('');
			}
		},
		clearOnfocus : function(){
			if($("#search").val()==SUorPUSearchDefaultText){
				$("#search").val('');
			}
		},
		resetOnBlur : function(){
			if($("#search").val()==''){
				$("#search").val(SUorPUSearchDefaultText);
			}
		},
		populateSelectedUserData : function(selectedUserCn){

			$('div#repSUOrPU_modalErrorDiv').html('');
			globalSelectedUserCn = selectedUserCn;
			globalSelectedUserFN=ice.replaceITSUOrPU.getUserFirstName(selectedUserCn);
			globalSelectedUserLN=ice.replaceITSUOrPU.getUserLastName(selectedUserCn);
			globalSelectedUserEmail=ice.replaceITSUOrPU.getUserEmail(selectedUserCn);

			var _userData = globalReplaceITSUPUDetailsData;

			var _strHTML = '<div class="users">';
			if(globalReplaceRoleFlag==replaceRoleFlagSU){ //SU
				_strHTML = _strHTML + '<p><strong>' + ice.globalVars.outgoingSuperUserLbl+'</strong> : ';
			}else{ //PU
				_strHTML = _strHTML + '<p><strong>' + ice.globalVars.outgoingProContactLbl +'</strong> : ';
			}
			_strHTML = _strHTML + _userData.outGoingUser.firstName + ' ' + _userData.outGoingUser.lastName;
			_strHTML = _strHTML + '</p>';

			if(globalReplaceRoleFlag==replaceRoleFlagSU){ //SU
				_strHTML = _strHTML + '<p><strong>' + ice.globalVars.newSuperUserLbl +'</strong> : ';
			}else{ //PU
				_strHTML = _strHTML + '<p><strong>' + ice.globalVars.newProContactLbl +'</strong> : ';
			}
			var _selectedUserName = globalSelectedUserFN + ' ' + globalSelectedUserLN;
			_strHTML = _strHTML +  _selectedUserName;
			_strHTML = _strHTML + '</p>';
			_strHTML = _strHTML + '</div>';

			// if out going user is both SU and PU
			if(_userData.outGoingUser.procPermission && _userData.outGoingUser.superPermission){

				_strHTML = _strHTML + '<div class="superUserQn">';
				_strHTML = _strHTML + '<strong>' + _userData.outGoingUser.firstName + ' ' + _userData.outGoingUser.lastName   + '</strong>';
				//_strHTML = _strHTML + ' ' + outGoingIsSUPU_replace_msg_prefix;
				if(globalReplaceRoleFlag==replaceRoleFlagSU){ //SU
					_strHTML = _strHTML + ' ' + ice.globalVars.pCandPCMsg;
				}else{ //PU
					_strHTML = _strHTML + ' ' + ice.globalVars.sUandSUMsg;
				}
				//_strHTML = _strHTML + ' ' + outGoingIsSUPU_replace_msg_suffix
				_strHTML = _strHTML + '</div>';
				$('div#repSUorPU_selected_details').html(_strHTML);
				$('#repSuOrPU_btn_continue').removeClass('disabled').removeAttr('disabled', 'disabled').addClass('primary');		
			}else{


				_strHTML = _strHTML + '<div class="superUserQn">';
				//_strHTML = _strHTML + repalceSUOrPU_outging_question_prefix;

				
				//_strHTML = _strHTML + repalceSUOrPU_outging_question_suffix;
				
				_strHTML = _strHTML + repalceSUOrPU_outging_question_typeOfAccount
				_strHTML = _strHTML + '</div>';

				_strHTML = _strHTML + '<table class="">';
				_strHTML = _strHTML + '<tbody><tr><td>';
				_strHTML = _strHTML + '<input type="radio" name="keepRemoveOpt" id="' + replaceUserKeep  +'" onClick="ice.replaceITSUOrPU.setKeepRemoveToGlobal(\'' + replaceUserKeep  +'\')" value="' + replaceUserKeep +'">';
				_strHTML = _strHTML + '</td>';
				_strHTML = _strHTML + '<td><p>';
				//_strHTML = _strHTML + repalceSUOrPU_selected_detail_keep;
				//_strHTML = _strHTML + '</span> ';
				//_strHTML = _strHTML + repalceSUOrPU_selected_detail_keep_msg;
				_strHTML = _strHTML + repalceSUOrPU_selected_download_permissions;
				_strHTML = _strHTML + '</p></td></tr>';
				_strHTML = _strHTML + '<tr><td>';
				_strHTML = _strHTML + '<input type="radio" name="keepRemoveOpt" id="' + replaceUserRemove  +'"onClick="ice.replaceITSUOrPU.setKeepRemoveToGlobal(\'' + replaceUserRemove  +'\')" value="' + replaceUserRemove +'">';
				_strHTML = _strHTML + '</td>';
				_strHTML = _strHTML + '<td><p>';
				//_strHTML = _strHTML + repalceSUOrPU_selected_detail_remove;
				//_strHTML = _strHTML + '</strong> ';
				//_strHTML = _strHTML + repalceSUOrPU_selected_detail_remove_msg;
				_strHTML = _strHTML + repalceSUOrPU_selected_user_notaccess;
				_strHTML = _strHTML + '</p></td></tr>';
				_strHTML = _strHTML + '</tbody></table>';
				$('div#repSUorPU_selected_details').html(_strHTML);

				if(globalKeepRemoveOpt==null){
					globalKeepRemoveOpt = replaceUserKeep;
					$("#repSUorPU_selected_details input[id="+ replaceUserKeep + "]").attr('checked',true);
					$("#repSUorPU_selected_details input[id="+ replaceUserRemove + "]").attr('checked',false);
				}else{
					if(globalKeepRemoveOpt==replaceUserKeep){
						$("#repSUorPU_selected_details input[id="+ replaceUserKeep + "]").attr('checked',true);
						$("#repSUorPU_selected_details input[id="+ replaceUserRemove + "]").attr('checked',false);
					}else{
						$("#repSUorPU_selected_details input[id="+ replaceUserRemove + "]").attr('checked',true);
						$("#repSUorPU_selected_details input[id="+ replaceUserKeep + "]").attr('checked',false);
					}
				}
				$('#repSuOrPU_btn_continue').removeClass('disabled').removeAttr('disabled', 'disabled').addClass('primary');
			}
			// set confirm screen data
			$("#repSUorPU_source_name").html('<strong>'+ _userData.outGoingUser.firstName + ' ' + _userData.outGoingUser.lastName  +'</strong>');
			$("#repSUorPU_source_email").html(_userData.outGoingUser.email);

			$("#repSUorPU_target_name").html('<strong>'+ _selectedUserName  +'</strong>');
			$("#repSUorPU_target_email").html(globalSelectedUserEmail);
		},
		setKeepRemoveToGlobal : function(keepRemoveValueSelected){
				globalKeepRemoveOpt = keepRemoveValueSelected;
				$('#repSuOrPU_btn_continue').removeClass('disabled').removeAttr('disabled', 'disabled').addClass('primary');
		},
		getUserFirstName : function(userCnNumber){
			var _userDataList = globalReplaceITSUPUDetailsData.assignableUserList.userPaneContents;
			for(i=0;i<_userDataList.length;i++){
				if(_userDataList[i].cN==userCnNumber){
					return _userDataList[i].firstName;
				}
			}
		},
		getUserLastName : function(userCnNumber){
			var _userDataList = globalReplaceITSUPUDetailsData.assignableUserList.userPaneContents;
			for(i=0;i<_userDataList.length;i++){
				if(_userDataList[i].cN==userCnNumber){
					return _userDataList[i].lastName;
				}
			}
		},
		getUserEmail : function(userCnNumber){
			var _userDataList = globalReplaceITSUPUDetailsData.assignableUserList.userPaneContents;
			for(i=0;i<_userDataList.length;i++){
				if(_userDataList[i].cN==userCnNumber){
					return _userDataList[i].email;
				}
			}
		},
		replaceModalScreenCancel : function(){//first screen cancel
			vmf.modal.hide("replaceITSuperUserContent2");
		},
		replaceModalScreenContinue : function(){//first screen continue
			if(globalSelectedUserCn==null){
				$('div#repSUOrPU_modalErrorDiv').html(repalceSUOrPU_err_selectUser);
			}else{
				$('div#repSUOrPU_modalErrorDiv').html('');
				$('div#repSUOrPU_modalConfirmErrorDiv').html('');
				//show waring while option is remove
				if(globalKeepRemoveOpt==replaceUserRemove){
					$('div#repSUorPU_confirm_warning').show();
				}else{// hide if not remove
					$('div#repSUorPU_confirm_warning').hide();
				}
				vmf.modal.hide("replaceITSuperUserContent2");
				//setTimeout(function(){vmf.modal.show("replaceITSuperUserContent");},10);// to show the second popup from the first popup
				setTimeout(function(){vmf.modal.show("replaceITSuperUserContent", { onShow: function (dialog) {	
				//BUG-00028517 fix, not the right fix, but no time 02/12/2012 - rvooka
				tbls = $('#replaceITSuperUserContent .singleRow');
				td1 = $(tbls[0]).find('td:eq(0)');
				td2 = $(tbls[1]).find('td:eq(0)');
				(td1.width() > td2.width())?td2.width(td1.width()):td1.width(td2.width())
				//end of BUG-00028517
				} });},10)
			}
		},
		replaceConfirmModalScreenCancel : function(){//second screen cancel
			vmf.modal.hide("replaceITSuperUserContent");
		},
		replaceConfirmModalScreenBack : function(){//second screen back
			vmf.modal.hide("replaceITSuperUserContent");
			setTimeout(function(){vmf.modal.show("replaceITSuperUserContent2");},10);// to show the second popup from the first popup
			// load the data from global variables
			$('div#repSUOrPU_modalErrorDiv').html('');
			$('#repSuOrPU_btn_continue').removeAttr('disabled', 'disabled').removeClass('disabled');
			ice.replaceITSUOrPU.populateHeadersData();
			ice.replaceITSUOrPU.populateUserData();
			$("#repSuOrPuUserList li[id="+ globalSelectedUserCn + "]").attr('checked',true).addClass('active');
			ice.replaceITSUOrPU.populateSelectedUserData(globalSelectedUserCn);
		},
		replaceConfirmModalScreenConfirm : function(){//second screen confirm
				$('#repSuOrPU_btn_cancel_confirm').attr('disabled', 'true');
				$('#repSuOrPU_btn_back').attr('disabled', 'true');
				$('#repSuOrPU_btn_confirm').attr('disabled', 'true');
				$('#repSuOrPU_btn_confirm').addClass('disabled');
				//$('div#repSUOrPU_modalConfirmErrorDiv').html('<span class="loading_small">'+loadingURL+'</span>');
				var _dataObj = {};
				_dataObj[outGoingCustomerNumberParamName]=globalReplaceITSUPUDetailsData.outGoingUser.cN;
				_dataObj[newUserCustomerNumberParamName]=globalSelectedUserCn;
				_dataObj[newUserCustomerFNParamName]=globalSelectedUserFN;
				_dataObj[newUserCustomerLNParamName]=globalSelectedUserLN;
				_dataObj[newUserCustomerEmailParamName]=globalSelectedUserEmail;
				_dataObj[replaceRoleFlagParamName]=globalReplaceRoleFlag;
				_dataObj['outGoingUserFirstName']= globalReplaceITSUPUDetailsData.outGoingUser.firstName;
				_dataObj['outGoingUserLastName']= globalReplaceITSUPUDetailsData.outGoingUser.lastName;
				if(globalKeepRemoveOpt==null){
					_dataObj[keepOrRemoveParamName]=replaceUserKeep;// by default set to KEEP
				}else{
					_dataObj[keepOrRemoveParamName]=globalKeepRemoveOpt;
				}

				vmf.ajax.post(replaceITSUOrPUConfirm_url,
						_dataObj, 
						ice.replaceITSUOrPU.onSuccess_confirm, 
						ice.replaceITSUOrPU.onFail_confirm);

		},
		logoutModalScreenClose : function(){//second screen cancel
			vmf.modal.hide();
			window.location.href=SUorPULogoutURL;
		},
		onSuccess_confirm : function(data){
			var _responseData = vmf.json.txtToObj(data);
			$('div#repSUOrPU_modalConfirmErrorDiv').html('');
			$('#repSuOrPU_btn_cancel_confirm').attr('disabled', '');
			$('#repSuOrPU_btn_back').attr('disabled', '');
			$('#repSuOrPU_btn_confirm').attr('disabled', '');
			$('#repSuOrPU_btn_confirm').removeClass('disabled');

			if(_responseData.error){
				$('div#repSUOrPU_modalConfirmErrorDiv').html(_responseData.message);
			}else{
				if(SUorPUContinueWorkText.indexOf(_responseData)!=-1){
					// refresh current page/pane
					vmf.modal.hide("replaceITSuperUserContent");
					if (typeof globalCallBackFunction == "function") {
						globalCallBackFunction();
					}else{
						window.location.reload();
					}
				}else{
					vmf.modal.hide();
					setTimeout(function(){vmf.modal.show("replaceITSULogoutWrn",{onShow: function (dialog) {	
				   $("a.modalCloseImg", $("#simplemodal-container")).unbind('click').bind('click',function(){
                       ice.replaceITSUOrPU.logoutModalScreenClose();
                    });
				} })},10);
				}
			}
		},
		onFail_confirm : function(data){
			$('div#repSUOrPU_modalConfirmErrorDiv').html('');
			$('#repSuOrPU_btn_cancel_confirm').attr('disabled', '');
			$('#repSuOrPU_btn_back').attr('disabled', '');
			$('#repSuOrPU_btn_confirm').attr('disabled', '');
			$('#repSuOrPU_btn_confirm').removeClass('disabled');

			$('div#repSUOrPU_modalConfirmErrorDiv').html(repalceSUOrPU_err_savingReplace);
		},
		bindEvents: function(){
			$("#repSuOrPuUserList ul li").live("mouseover mouseout click",function(e){
				if(e.type=="mouseover"){
					$(this).addClass("hover");
				} else if(e.type=="mouseout"){
					$(this).removeClass("hover");
				} else {
					if($(this).hasClass("active")) return;
					$(this).siblings().removeClass("active");
					$(this).addClass("active");
					ice.replaceITSUOrPU.populateSelectedUserData($(this).attr('id')); 				
				}
			});
		}
};
$("#repSuOrPU_btn_confirm").click(function(){
	if(typeof(riaLinkmy) == "function"){
		var omntTag = (globalReplaceRoleFlag=="SU") ? "change-super-user" : "change-procurement-contact";
		riaLinkmy("account-summary : "+omntTag+" : confirm");
	}
});