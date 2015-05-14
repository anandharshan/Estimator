vmf.ns.use('ice');
ice.removeUser = {
	userPerm : null,
	folderCnt : null,
	removeUserEntryCheckForAdminWithSingleFolderAccessUrl : null,
	removeUserEntryCheckForNonAdminWithSingleFolderAccessUrl : null,
	removeUserEntryCheckForNonAdminWithMultiFolderAccessUrl : null,
	portletNs : null,
	folderNpMsgContent : null,
	folderTreeResourceUrl : null,
	userNames : null,
	userEmail : null,
	selectedFolderNames : null,
	getFolderId : null,
	selectedUserName : null,
	removeUserEntryCheckUrl : null,
	fullFolderPath : null,
	globalFullFolderPath : null,
	globalSelectedFolderName : null,
	globalSelectedFolderAccess : null,
	globalSelectedParentFolderId : null,
	removeUserFromAccountUrl : null,
	manageAccessByUserUrl : null,
	selectedUserIdAdminAccess : null,
	manageAccessByFolderUrl : null,
	removeUserFrmFolderUrl : null,
	removeAddUserUrl : null,
	globalFolderIdes : null,
	globalEaNumber : null,
	globalEaName : null,
	loggedInUserFolderAccess : null,
	removeUserLabel : null,
	removeUserFromLabel : null,
	folderIcon : null,
	removeUserNoteAdminAccess : null,
	removeUserNoteMultipleFolder : null,
	removeUserSelectAction : null,
	removeUserSelectActionReassign : null,
	removeUserSelectActionRemoveUserAccount : null,
	removeUserLabelErrorMessage : null,
	removeUserStaticLabelAccount : null,
	removeUserStaticLabelRemovedFrom : null,
	removeUserStaticLabelAddedTo : null,
	removeUserLabelLoading : null,
	removeUserBCSContract : null,
	noteRemoveFromAccount : null,
	backBtnFlag : null,
	init : function(removeUserEntryCheckForAdminWithSingleFolderAccessUri,removeUserEntryCheckForNonAdminWithSingleFolderAccessUri,removeUserEntryCheckForNonAdminWithMultiFolderAccessUri,portletNsNameSpace,folderNpMsgContents,folderTreeResource,removeUserEntryCheckUri,removeUserFromAccountUri,manageAccessByUserUri,manageAccessByFolderUri,removeUserFrmFolderUri,removeAddUserUri,removeUserLabelText,removeUserFromLabelText,folderIconImage,removeUserNoteAdminAccessText,removeUserNoteMultipleFolderText,removeUserSelectActionText,removeUserSelectActionReassignText,removeUserSelectActionRemoveUserAccountText,removeUserLabelErrorMessageText,removeUserStaticLabelAccountText,removeUserStaticLabelRemovedFromText,removeUserStaticLabelAddedToText,removeUserLabelLoadingText,removeUserBCSContractText,noteRemoveFromAccountText){
		removeUserEntryCheckForAdminWithSingleFolderAccessUrl = removeUserEntryCheckForAdminWithSingleFolderAccessUri;
		removeUserEntryCheckForNonAdminWithSingleFolderAccessUrl = removeUserEntryCheckForNonAdminWithSingleFolderAccessUri;
		removeUserEntryCheckForNonAdminWithMultiFolderAccessUrl =  removeUserEntryCheckForNonAdminWithMultiFolderAccessUri;
		portletNs = portletNsNameSpace;
		folderNpMsgContent = folderNpMsgContents;
		folderTreeResourceUrl = folderTreeResource;
		removeUserEntryCheckUrl = removeUserEntryCheckUri;
		removeUserFromAccountUrl = removeUserFromAccountUri;
		manageAccessByUserUrl = manageAccessByUserUri;
		manageAccessByFolderUrl = manageAccessByFolderUri;
		removeUserFrmFolderUrl = removeUserFrmFolderUri;
		loggedInUserFolderAccess = '';
		removeAddUserUrl = removeAddUserUri;
		removeUserLabel = removeUserLabelText;
		removeUserFromLabel = removeUserFromLabelText;
		folderIcon = folderIconImage; 
		removeUserNoteAdminAccess = removeUserNoteAdminAccessText;
		removeUserNoteMultipleFolder = removeUserNoteMultipleFolderText;
		removeUserSelectAction = removeUserSelectActionText;
		removeUserSelectActionReassign = removeUserSelectActionReassignText;
		removeUserSelectActionRemoveUserAccount = removeUserSelectActionRemoveUserAccountText;
		removeUserLabelErrorMessage = removeUserLabelErrorMessageText;
		removeUserStaticLabelAccount = removeUserStaticLabelAccountText;
		removeUserStaticLabelRemovedFrom = removeUserStaticLabelRemovedFromText;
		removeUserStaticLabelAddedTo = removeUserStaticLabelAddedToText;
		removeUserLabelLoading = removeUserLabelLoadingText;
		removeUserBCSContract = removeUserBCSContractText;
		noteRemoveFromAccount = noteRemoveFromAccountText;
		userNames = '';
		userEmail = '';
		selectedFolderNames = '';
		globalEaNumber = '';
		globalEaName = '';	
		vmf.scEvent = true;
		backBtnFlag = false;
		ice.removeUser.disableRemoveUserLink();
		$('#removeUserLink').click(function(){
			var folderObj = {
				userId:$("#selectedUserId").val(),
				userDetails:{"email":$('#userPaneSelectedUserEmail').find('a').text()},
				fId:$('#selectedFolderId').val(),
				fName:$('#selectedFolderName').val(),
				fPath:$('#fullFolderPath').val()
			};
			if(!$(this).hasClass('dummyClick')){
				$('.error').html('');
				ice.removeUser.populateRemoveUserPane(folderObj);
			}
		});
		$('#reassignUserBackBtn').click(function(){
			vmf.modal.hide('reassignUserToFolderContent');
			setTimeout(function(){vmf.modal.show('removeUserContent7');},10);
		});
		$('#removeUserContent5').find('.dataCell input[name="removeUserRadio1"]').live('click',function() {
			if($(this).attr('checked')==true){
				$('#removeUserContent5').find('#btn_confirm147').attr('disabled',false);
				$('#removeUserContent5').find('#btn_confirm147').removeClass('secondary');
			} 
		});
		$('button .fn_cancel').click(function() {
			vmf.modal.hide();
		});
		$('#btn_confirm16').click(function() {
			ice.removeUser.removeUserFromFolder();
		});
		$('#btn_confirm147').click(function() {
			ice.removeUser.checkUserOptions();
		});
		$('#btn_cancel137').click(function(){ 
			vmf.modal.hide('removeUserContent6');
			setTimeout(function(){vmf.modal.show('removeUserContent5');},10);
		});
		$('#btn_confirm47').click(function() {
			ice.removeUser.removeUserFromAccount();
		});
		$('#btn_confirm132').click(function() {
			ice.removeUser.confirmAssignUser();
		});
		$('#btn_back132').click(function() {
			vmf.modal.hide('removeUserContent7');
			setTimeout(function(){vmf.modal.show('removeUserContent5');},10);
		});
		$('#btn_back177').click(function() {
			vmf.modal.hide('removeUserContent2');
			ice.removeUser.handleFolderTree();
			$('#removeUserContent7').find('.name').html(userNames);
			$('#removeUserContent7').find('.email').html('<a href="mailto:'+userEmail+'">'+userEmail+'</a>');
			$('#removeUserContent7').find('.email').css({'margin-left':'0px'});
		});
		$('#btn_confirm177').click(function() {
			ice.removeUser.assignUser();
		});
		$('#removeusrChkBoxConfirmFinal').click(function() {
			if($(this).attr('checked')==true){
				$('#removeUserContent2').find('#btn_confirm177').attr('disabled',false);
				$('#removeUserContent2').find('#btn_confirm177').removeClass('secondary');
			} else {
				$('#removeUserContent2').find('#btn_confirm177').attr('disabled',true);
				$('#removeUserContent2').find('#btn_confirm177').addClass('secondary');
			}
		});
		$('#removeUserAdminAccess').click(function (){
			ice.removeUser.confirmRemoveUserAdminAccess();
		});
		$('#reassignUserConfirm').click(function(){
			ice.removeUser.confirmReassignUser();
			if(typeof(riaLinkmy) == "function"){
				var byFolderTabSelected = $(".tabs-wrapper ul li:nth-child(1) a").hasClass("active");
				var byUserTabSelected = $(".tabs-wrapper ul li:nth-child(3) a").hasClass("active");
				if(byFolderTabSelected){
					riaLinkmy("users-permissions : by-folder : reassign-user : confirm");
				}
				else if(byUserTabSelected){
					riaLinkmy("users-permissions : by-user : reassign-user : confirm");
				}
			}
		});
		$('#reassignConfirmBack').click(function(){
			vmf.modal.hide('reassignUserToFolderContent');
			ice.removeUser.handleFolderTree();
		});
		$('#removeUserContent3').find('.dataCell input[name="removeUserRadio"]').click(function() {
			if($(this).attr('checked')==true){
				if($(this).val()=='yes'){
					$('#warningmsgAdminAccount').slideUp('slow');
					$('#removeUserAdminAccess').attr('disabled',false);
					$('#removeUserAdminAccess').removeClass('disabled');
					$('#removeUserFolderAdmin').show();
					$('#removeUserAccountAdmin').hide();
					if($('#removeUserContent3').find('.warningctrls input[type=checkbox]').attr('checked')==true){
						$('#removeUserContent3').find('.warningctrls input[type=checkbox]').attr('checked',false);
					}
				} else {
					$('#removeUserAdminAccess').attr('disabled',true);
					$('#removeUserAdminAccess').addClass('disabled');
					$('#warningmsgAdminAccount').slideDown('slow');
					$('#removeUserContent3').find('.warningctrls input[type=checkbox]').click(function(){
						if($(this).attr('checked')==true){
							$('#removeUserAdminAccess').attr('disabled',false);
							$('#removeUserAdminAccess').removeClass('disabled');
						} else {
							$('#removeUserAdminAccess').attr('disabled',true);
							$('#removeUserAdminAccess').addClass('disabled');
						}
					});
					$('#removeUserFolderAdmin').hide();
					$('#removeUserAccountAdmin').show();
				}
			}
		});
	},
	handleFolderTree : function(){
		setTimeout(function(){vmf.modal.show('removeUserContent7');},10);
		$('#removeUserContent7').find('.name').html(userNames);
		$('#removeUserContent7').find('.email').html('<a href="mailto:'+userEmail+'">'+userEmail+'</a>');
		$('#removeUserContent7').find('.email').css({'margin-left':'0px'});
		var config = new Object();
        config.uniqueDiv = 'removeUserReassignFolder';
        config.ajaxTimeout = 60000;
        config.npMsgContent = folderNpMsgContent;
        config.npMsgFunction = function (msg) {
            ice.removeUser.showExceptionMessages(msg);
        };
        config.cbOnClickFunction = function (folderIdes, cbState) { 
			ice.removeUser.folderTreeCBClick(folderIdes,cbState);
        };
        config.validateJSONFunction = function (folderListJSON) {
            if (folderListJSON.error) {
				ice.ui.showExceptionMessages(folderListJSON.message);
            }
        };
		config.cbOnClickSelFoldersFunction = function(selectedFolders,cbState){
			if (selectedFolders.length>0) {
				globalFolderIdes = selectedFolders;
				$('#removeUserContent7').find('#btn_confirm132').attr('disabled',false);
				$('#removeUserContent7').find('#btn_confirm132').removeClass('secondary');
			} else{
				$('#removeUserContent7').find('#btn_confirm132').attr('disabled',true);
				$('#removeUserContent7').find('#btn_confirm132').addClass('secondary');
			}
		};
		config.cbOnFolderNodeCreate = function(folderElement,folderIds) {
			if(folderElement.find('li span').hasClass('disabled')){
				folderElement.find('li input[type=checkbox]').attr('disabled',true);
			}
			if(folderIds.folderId == getFolderId){
				folderElement.find('li input[type=checkbox]').attr('disabled',true);
				if(folderElement.find('li span').hasClass('enabled')){
					folderElement.find('li span').removeClass('enabled');
					folderElement.find('li span').addClass('disabled');
				}
			}
		};
        config.errorFunction = function (response, errorDesc, errorThrown) {
			ice.removeUser.showExceptionMessages(response.responseText);
        };
        config.inputType = 'checkbox';
        config.loadingClass = 'loadingDiv';
        config.expandSelect = false;
		config.requestParams = {"folderView": "addUserToFolder"};
		vmf.foldertree.build(folderTreeResourceUrl, config);
		$('#removeUserReassignFolder .folderPane').find('input[type=checkbox]').live('click', function(){
			if ($('#removeUserReassignFolder .folderPane').find('input[type=checkbox]:checked').length > 0) {
				$('#btn_confirm132').removeAttr('disabled').removeClass('disabled');
			}else{
				$('#btn_confirm132').attr("disabled","disabled").addClass("disabled");
			}
		})
		//$('.section-wrapper .column').css({'height':'340px'});
		//$('.section-wrapper .column .scroll').css({'border-right': '1px solid #FFFFFF','height': '74%','overflow-y': 'scroll'});
	},
	folderTreeCBClick : function(folderIdes,cbState) {
		var folderHT = vmf.foldertree.getFolderHashtable();
		var folderTreeObj = vmf.foldertree.getFolderJSON();
		if (cbState == "checked") {
			var _fullFolderPath = folderHT.get(folderIdes).fullFolderPath;
			var _selectedFolderName = folderHT.get(folderIdes).folderName;
			var _folderAccess = folderHT.get(folderIdes).folderAccess;
			var _parentFolderId = folderHT.get(folderIdes).parentFolderId;
			globalFullFolderPath = _fullFolderPath;
			globalSelectedFolderName = _selectedFolderName;
			globalSelectedFolderAccess = _folderAccess;
			globalSelectedParentFolderId = _parentFolderId;
			
		} else {
			
		}
	},
	showExceptionMessages : function(message) {
		$('#manageAccessExceptionMessage').html(message);
		vmf.modal.show("manageAccessExceptionMessagePopup");
	},
	populateRemoveUserPane : function(folderObj) {
		vmf.loading.show({"msg":removeUserLabelLoading, "overlay":true});
		var _strHTML = '';
		var selectedUsers = $('#selectedFolderUserPane').find('ul li').filter('.active');
		if(selectedUsers.length){
			selectedUserName = selectedUsers.find('label').text();
		}else{
			selectedUserName = folderObj.userDetails.selUserName;
		}
		backBtnFlag = false;
		var _userPaneSelectedUserEmail = folderObj.userDetails.email;
		var _selectedUserId = folderObj.userId;
		var _selectedFolderId = folderObj.fId;
		var _selectedFolderName = encodeURIComponent(folderObj.fName)  // Fix for BUG-00038504
		selectedUserIdAdminAccess = _selectedUserId;
		$.ajax({
			url: removeUserEntryCheckUrl+'&selectedUserCn='+_selectedUserId+'&selectedFolderId='+_selectedFolderId+'&selectedFolderName='+_selectedFolderName+'&selectedUserName='+selectedUserName+'&selectedUserEmail='+_userPaneSelectedUserEmail, 
			type: "POST",
			success: function(data){
				var _removeUserEntryJsonResponse = vmf.json.txtToObj(data);
				try{
					userNames = _removeUserEntryJsonResponse.userName;
					userEmail = _removeUserEntryJsonResponse.userEmail;
					selectedFolderNames = _removeUserEntryJsonResponse.selectedFolderName;
					globalEaNumber = _removeUserEntryJsonResponse.eaNumber;
					globalEaName = _removeUserEntryJsonResponse.eaName;	
					if(typeof(_removeUserEntryJsonResponse.error)!='undefined' && (_removeUserEntryJsonResponse.error!='' || _removeUserEntryJsonResponse.error!=null || _removeUserEntryJsonResponse.error == true)){
						vmf.loading.hide();
						$('#removeUserShowException').find('.body').html(_removeUserEntryJsonResponse.message);
						vmf.modal.show('removeUserShowException');
					} else {
						if(_removeUserEntryJsonResponse.hasManageFolderAccessOnRootFolder==true && _removeUserEntryJsonResponse.hasMultiFolderAccess==true){
							_strHTML += '<table class="noborders"><tbody><tr><td class="label"><strong>'+removeUserLabel+'</strong></td>';
							_strHTML += '<td class="dataCell">'+_removeUserEntryJsonResponse.userName+' <br> <a href="mailto:'+_removeUserEntryJsonResponse.userEmail+'">'+_removeUserEntryJsonResponse.userEmail+'</a></td>';			
							_strHTML += '</tr><tr><td class="label"><strong>'+removeUserBCSContract+'</strong></td><td class="dataCell">';
							_strHTML += '<input type="radio" value="yes" name="removeUserRadio"> '+folderObj.fPath+' <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="note">'+removeUserNoteAdminAccess+'</span>';
							_strHTML += '</td></tr><tr><td class="label"></td><td class="dataCell">';
							_strHTML += '<input type="radio" value="no" name="removeUserRadio"> &nbsp;'+removeUserStaticLabelAccount+' '+_removeUserEntryJsonResponse.eaNumber+' - '+_removeUserEntryJsonResponse.eaName+' <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="note">'+noteRemoveFromAccount+'</span>';
							_strHTML += '</td></tr></tbody></table>';
							$('#removeUserContent3').find('.highlight').html(_strHTML);
							
							vmf.loading.hide();
							vmf.modal.show('removeUserContent3');
						} else if(_removeUserEntryJsonResponse.hasMultiFolderAccess==true && _removeUserEntryJsonResponse.hasManageFolderAccessOnRootFolder==false && _removeUserEntryJsonResponse.hasManageFolderAccessOnSelectedFolder==true){
								_strHTML += '<table class="noborders"><tbody><tr><td class="label"><strong>'+removeUserLabel+'</strong></td>';
								_strHTML += '<td class="dataCell">'+_removeUserEntryJsonResponse.userName+' <br> <a href="mailto:'+_removeUserEntryJsonResponse.userEmail+'">'+_removeUserEntryJsonResponse.userEmail+'</a></td>';
								_strHTML += '</tr><tr><td class="label"><strong>'+removeUserFromLabel+'</strong></td>';
								_strHTML += '<td class="dataCell">'+folderObj.fPath+' <br> <span class="note">'+removeUserNoteMultipleFolder+'</span></td>';
								_strHTML += '</tr></tbody></table>';
								$('#removeUserContent1').find('.highlight').html(_strHTML);
								vmf.loading.hide();
								vmf.modal.show('removeUserContent1');
							} else {
								_strHTML += '<table class="noborders"><tbody><tr><td class="label"><strong>'+removeUserLabel+'</strong></td>';
								_strHTML += '<td class="dataCell">'+_removeUserEntryJsonResponse.userName+' <br> <a href="mailto:'+_removeUserEntryJsonResponse.userEmail+'">'+_removeUserEntryJsonResponse.userEmail+'</a></td>';
								_strHTML += '</tr><tr><td class="label"><strong>'+removeUserFromLabel+'</strong></td>';
								_strHTML += '<td class="dataCell">'+folderObj.fPath+' <br> <span class="note">'+removeUserNoteAdminAccess+'</span></td>';
								_strHTML += '</tr><tr><td class="label"><strong>'+removeUserSelectAction+'</strong></td>';
								_strHTML += '<td class="dataCell"><input type="radio" value="yes" name="removeUserRadio1"> '+removeUserSelectActionReassign;
								_strHTML += '</td></tr><tr><td class="label"></td><td class="dataCell">';
								_strHTML += '<input type="radio" value="no" name="removeUserRadio1"> '+removeUserSelectActionRemoveUserAccount;
								_strHTML += '</td></tr></tbody></table>';
								$('#removeUserContent5').find('.highlight').html(_strHTML);
								$('input[name=removeUserRadio1]').live('change', function(){
									if ($('input[name=removeUserRadio1]:checked').length > 0) {
										$('#btn_confirm147').removeAttr('disabled').removeClass('disabled');
									}
								});
								vmf.loading.hide();
								vmf.modal.show('removeUserContent5');
							}
						
						$('#removeUserContent3').find('.dataCell input[name="removeUserRadio"]').click(function() {
							if($(this).attr('checked')==true){
								if($(this).val()=='yes'){
									$('#warningmsgAdminAccount').slideUp('slow');
									$('#removeUserAdminAccess').attr('disabled',false);
									$('#removeUserAdminAccess').removeClass('disabled');
									$('#removeUserFolderAdmin').show();
									$('#removeUserAccountAdmin').hide();
									if($('#removeUserContent3').find('.warningctrls input[type=checkbox]').attr('checked')==true){
										$('#removeUserContent3').find('.warningctrls input[type=checkbox]').attr('checked',false);
									}
								} else {
									$('#removeUserAdminAccess').attr('disabled',true);
									$('#removeUserAdminAccess').addClass('disabled');
									$('#warningmsgAdminAccount').slideDown('slow');
									$('#removeUserContent3').find('.warningctrls input[type=checkbox]').click(function(){
										if($(this).attr('checked')==true){
											$('#removeUserAdminAccess').attr('disabled',false);
											$('#removeUserAdminAccess').removeClass('disabled');
										} else {
											$('#removeUserAdminAccess').attr('disabled',true);
											$('#removeUserAdminAccess').addClass('disabled');
										}
									});
									$('#removeUserFolderAdmin').hide();
									$('#removeUserAccountAdmin').show();
								}
							}
						});
						$('#removeUserContent5').find('.dataCell input[name="removeUserRadio1"]').live('click',function() {
							if($(this).attr('checked')==true){
								$('#removeUserContent5').find('#btn_confirm147').attr('disabled',false);
								$('#removeUserContent5').find('#btn_confirm147').removeClass('secondary');
							} 
						});
						$('#btn_confirm47').attr('disabled',true);
						$('#btn_confirm47').addClass('disabled');
						getFolderId =	folderObj.fId;
						//fullFolderPath = $('#fullFolderPath').val();
					}
				}
				catch(err){
					vmf.loading.hide();
					//var whenMoreFolder = ice.globalVars.thisActionMsg + " <a class='help' href=javascript:myvmware.common.openHelpPage('"+$removeuserWhenFolderLink+"'); id='moreAction'>KB article 2016052</a> "+ice.globalVars.forNextStepsMsg;
					var whenMoreFolder = myvmware.common.buildLocaleMsg(ice.globalVars.viewForNextSteps,$removeuserWhenFolderLink);
					$('#removeUserShowException').find('.body').html(whenMoreFolder);
					vmf.modal.show('removeUserShowException');
				}
			}, error : function(xhr, ajaxOptions, thrownError){
				vmf.loading.hide();
				$('#removeUserShowException').find('.body').html(thrownError);
				vmf.modal.show('removeUserShowException');
			}
		});
		$('#btn_confirm132').data({fId:folderObj.fId,fPath:folderObj.fPath});
		$('#reassignUserToFolderContent').find('right-btns button:eq(0)').attr('id','reassignUserBackBtn');
		if($('#tabbed_box_1 ul.tabs li:nth-child(1) a').hasClass("active")){
			byFolderTabSelected = true;
			riaLinkmy('users-permissions : by-folder : remove-user');}
		else if($('#tabbed_box_1 ul.tabs li:nth-child(3) a').hasClass("active")){
			byUserTabSelected = true;
			riaLinkmy('users-permissions : by-user : remove-user');}
	},
	populateRemoveUserAccount:function(targetDetailsObj){
		var eaDetails;
		if($("#eaSelectorDropDown").val().length > 0) {
			eaDetails = $("#eaSelectorDropDown option:selected").text();
		}
		else {
			eaDetails = $("#eaSelectorDropDown").text();
		}
		$('#btn_confirm47').attr('disabled',true);
		$('#btn_confirm47').addClass('disabled');
		backBtnFlag = true;
		globalEaNumber = eaDetails.split('-')[0];
		globalEaName = eaDetails.split('-')[1];
		userNames = targetDetailsObj.userDetails.selUserName;
		userEmail = targetDetailsObj.userDetails.email;
		selectedUserIdAdminAccess = targetDetailsObj.userId;
		selectedUserName = userNames;
		ice.removeUser.checkUserOptions();
	},
	checkUserOptions : function(){
		var _userOption = '';
		var _userOptions = document.getElementsByName('removeUserRadio1');
		for(i=0;i<_userOptions.length;i++){
			if(_userOptions[i].checked==true){
				_userOption = _userOptions[i].value;
			}
		}
		if(_userOption == 'yes'){
			vmf.modal.hide('removeUserContent5');
			ice.removeUser.handleFolderTree();
		} else {
			vmf.modal.hide('removeUserContent5');
			var _strHTML = '';
			_strHTML += '<table class="noborders"><tbody><tr><td class="label"><strong>'+removeUserLabel+'</strong></td>';
			_strHTML += '<td class="dataCell">'+userNames+' <br> <a href="mailto:'+userEmail+'">'+userEmail+'</a></td>';
			_strHTML += '</tr><tr><td class="label"><strong>'+removeUserFromLabel+'</strong></td>';
			_strHTML += '<td class="dataCell">'+removeUserStaticLabelAccount+' '+globalEaNumber+' - '+globalEaName+'.</td>';
			_strHTML += '</tr></tbody></table>';
			$('#removeUserContent6').find('.highlight').html(_strHTML);
			if(typeof rs!="undefined" && typeof rs.removeUserAlertForService!="undefined")
				$('#removeUserContent6 .warning').append("<div class='serviceMsg'>"+rs.removeUserAlertForService+"</div>");
			$('#removeusrChkBox2').click(function(){
				if($(this).attr('checked')==true){
					$('#btn_confirm47').attr('disabled',false);
					$('#btn_confirm47').removeClass('disabled');
				} else {
					$('#btn_confirm47').attr('disabled',true);
					$('#btn_confirm47').addClass('disabled');
				}
			});
			var cancelBtn = $('#btn_cancel137');
			if(backBtnFlag){
				cancelBtn.hide();
			} else {
				cancelBtn.show();
			}
			setTimeout(function(){vmf.modal.show('removeUserContent6');},10);
		}
	},
	confirmAssignUser : function(){
		vmf.modal.hide('removeUserContent7');
		var _selectedFolderIdReassign = globalFolderIdes;
		var _strHTML = '';
		_strHTML += '<tbody><tr><td> '+userNames+'</td><td class="label right"> <a href="mailto:'+userEmail+'">'+userEmail+'</a></td></tr></tbody>';
		var _folderHTML = "";
		_folderHTML += '<tbody><tr><td class="spacer subhead"><strong>'+removeUserStaticLabelRemovedFrom+'</strong></td></tr><tr>';
		_folderHTML += '<td><span>'+selectedFolderNames+'</span> <span class="email">'+$('#btn_confirm132').data('fPath')+'</span></td>';
		_folderHTML += '</tr><tr><td class="spacer subhead"><strong>'+removeUserStaticLabelAddedTo+'</strong></td></tr>';
		for(i=0;i<globalFolderIdes.length;i++){
			var folderHT = vmf.foldertree.getFolderHashtable();
			var folderTreeObj = vmf.foldertree.getFolderJSON();
			var _fullFolderPath = folderHT.get(globalFolderIdes[i]).fullFolderPath;
			var _selectedFolderName = folderHT.get(globalFolderIdes[i]).folderName;
			_folderHTML += '<tr><td><span>'+_selectedFolderName+'</span> <span class="email">'+_fullFolderPath+'</span></td></tr>';
		}
		_folderHTML += '</tbody>';
		$('#reassignUserToFolderContent').find('.accountUserSection table').html(_strHTML);
		$('#reassignUserToFolderContent').find('.scroll .withborders').html(_folderHTML);
		setTimeout(function(){vmf.modal.show('reassignUserToFolderContent');},10);
	},
	assignUser : function() {
		vmf.modal.hide();
	},
	confirmRemoveUserAdminAccess : function(){
		var _userOption = '';
		var _userOptions = document.getElementsByName('removeUserRadio');
		for(i=0;i<_userOptions.length;i++){
			if(_userOptions[i].checked==true){
				_userOption = _userOptions[i].value;
			}
		}		
		if(_userOption=='yes'){
			vmf.modal.hide();
			vmf.loading.show({"msg":removeUserLabelLoading, "overlay":true});
			$.ajax({
				url: removeUserFrmFolderUrl+'&selectedUserCn='+selectedUserIdAdminAccess+'&selectedFolderId='+$('#btn_confirm132').data('fId')+'&selectedUserName='+selectedUserName, 
				type: "POST",
				success: function(data){
					try{
						var _confirmJsonResponse = vmf.json.txtToObj(data);
						if(typeof(_confirmJsonResponse.error)!='undefined' && (_confirmJsonResponse.error!='' || _confirmJsonResponse.error!=null || _confirmJsonResponse.error == true)){
							vmf.loading.hide();
							$('#removeUserContent3').find('.error').html(_confirmJsonResponse.message);
							vmf.modal.show('removeUserContent3');
						} else {
							location.reload();
						}
					} catch(err){
						vmf.loading.hide();
						$('#removeUserContent3').find('.error').html(removeUserLabelErrorMessage);
						vmf.modal.show('removeUserContent3');
					}
					ice.removeUser.confirmOmntRemove();
				}, error: function(xhr, ajaxOptions, thrownError){
					vmf.loading.hide();
					$('#removeUserContent3').find('.error').html(thrownError);
					vmf.modal.show('removeUserContent3');
				}
			});
		} else {
			vmf.modal.hide();
			vmf.loading.show({"msg":removeUserLabelLoading, "overlay":true});
			$.ajax({
				url: removeUserFromAccountUrl+'&selectedUserCn='+selectedUserIdAdminAccess+'&selectedUserName='+selectedUserName+'&selectedFolderId='+$('#btn_confirm132').data('fId'), 
				type: "POST",
				success: function(data){
					var _confirmJsonResponse = vmf.json.txtToObj(data);
					try{
						if(typeof(_confirmJsonResponse.error)!='undefined' && (_confirmJsonResponse.error!='' || _confirmJsonResponse.error!=null || _confirmJsonResponse.error == true)){
							vmf.loading.hide();
							$('#removeUserContent3').find('.error').html(_confirmJsonResponse.message);
							vmf.modal.show('removeUserContent3');
						} else {
							location.reload();
						}
					} catch(err){
						vmf.loading.hide();
						$('#removeUserContent3').find('.error').html(removeUserLabelErrorMessage);
						vmf.modal.show('removeUserContent3');
					}
					ice.removeUser.confirmOmntRemove();
				}, error: function(xhr, ajaxOptions, thrownError){
					vmf.loading.hide();
					$('#removeUserContent3').find('.error').html(thrownError);
					vmf.modal.show('removeUserContent3');
				}
			});
		}
		$('#removeUserContent3').find('.dataCell input[name="removeUserRadio"]').click(function() {
			if($(this).attr('checked')==true){
				if($(this).val()=='yes'){
					$('#warningmsgAdminAccount').slideUp('slow');
					$('#removeUserAdminAccess').attr('disabled',false);
					$('#removeUserAdminAccess').removeClass('disabled');
					$('#removeUserFolderAdmin').show();
					$('#removeUserAccountAdmin').hide();
					if($('#removeUserContent3').find('.warningctrls input[type=checkbox]').attr('checked')==true){
						$('#removeUserContent3').find('.warningctrls input[type=checkbox]').attr('checked',false);
					}
				} else {
					$('#removeUserAdminAccess').attr('disabled',true);
					$('#removeUserAdminAccess').addClass('disabled');
					$('#warningmsgAdminAccount').slideDown('slow');
					$('#removeUserContent3').find('.warningctrls input[type=checkbox]').click(function(){
						if($(this).attr('checked')==true){
							$('#removeUserAdminAccess').attr('disabled',false);
							$('#removeUserAdminAccess').removeClass('disabled');
						} else {
							$('#removeUserAdminAccess').attr('disabled',true);
							$('#removeUserAdminAccess').addClass('disabled');
						}
					});
					$('#removeUserFolderAdmin').hide();
					$('#removeUserAccountAdmin').show();
				}
			}
		});
		$('#removeUserContent5').find('.dataCell input[type=radio]').click(function() {
			if($(this).attr('checked')==true){
				$('#removeUserContent5').find('#btn_confirm147').attr('disabled',false);
				$('#removeUserContent5').find('#btn_confirm147').removeClass('secondary');
			} 
		});
	},
	removeUserFromFolder : function(){
		vmf.modal.hide();
		vmf.loading.show({"msg":removeUserLabelLoading, "overlay":true});
		$.ajax({
			url: removeUserFrmFolderUrl+'&selectedUserCn='+selectedUserIdAdminAccess+'&selectedFolderId='+$('#btn_confirm132').data('fId')+'&selectedUserName='+selectedUserName, 
			type: "POST",
			success: function(data){
				var _confirmJsonResponse = vmf.json.txtToObj(data);
				try{
					if(typeof(_confirmJsonResponse.error)!='undefined' && (_confirmJsonResponse.error!='' || _confirmJsonResponse.error!=null || _confirmJsonResponse.error == true)){
						vmf.loading.hide();
						$('#removeUserContent1').find('.error').html(_confirmJsonResponse.message);
						vmf.modal.show('removeUserContent1');
					} else {
						location.reload();
					}
				} catch(err){
					vmf.loading.hide();
					$('#removeUserContent1').find('.error').html(removeUserLabelErrorMessage);
					vmf.modal.show('removeUserContent1');
				}
				ice.removeUser.confirmOmntRemove();
			}, error: function(xhr, ajaxOptions, thrownError){
				vmf.loading.hide();
				$('#removeUserContent1').find('.error').html(thrownError);
				vmf.modal.show('removeUserContent1');
			}
		});
	},
	confirmReassignUser : function(){
		vmf.modal.hide();
		vmf.loading.show({"msg":removeUserLabelLoading, "overlay":true});
		$.ajax({
			url: removeAddUserUrl+'&selectedUserCn='+selectedUserIdAdminAccess+'&selectedFolderId='+$('#btn_confirm132').data('fId')+'&removeUserSelectedFolderID='+globalFolderIdes+'&selectedUserName='+selectedUserName, 
			type: "POST",
			success: function(data){
				var _confirmJsonResponse = vmf.json.txtToObj(data);
				try{
					if(typeof(_confirmJsonResponse.error)!='undefined' && (_confirmJsonResponse.error!='' || _confirmJsonResponse.error!=null || _confirmJsonResponse.error == true)){
						vmf.loading.hide();
						$('#reassignUserToFolderContent').find('.error').html(_confirmJsonResponse.message);
						vmf.modal.show('reassignUserToFolderContent');
					} else {
						location.reload();
					}
				} catch(err){
					vmf.loading.hide();
					$('#reassignUserToFolderContent').find('.error').html(removeUserLabelErrorMessage);
					vmf.modal.show('reassignUserToFolderContent');
				}
			}, error: function(xhr, ajaxOptions, thrownError){
				vmf.loading.hide();
				$('#reassignUserToFolderContent').find('.error').html(thrownError);
				vmf.modal.show('reassignUserToFolderContent');
			}
		});
	},
	removeUserFromAccount : function(){
		vmf.modal.hide();
		vmf.loading.show({"msg":removeUserLabelLoading, "overlay":true});
		$.ajax({
			url: removeUserFromAccountUrl+'&selectedUserCn='+selectedUserIdAdminAccess+'&selectedUserName='+selectedUserName+'&selectedFolderId=""',  
			type: "POST",
			success: function(data){
				var _confirmJsonResponse = vmf.json.txtToObj(data);
				try {
					if(typeof(_confirmJsonResponse.error)!='undefined' && (_confirmJsonResponse.error!='' || _confirmJsonResponse.error!=null)){
						vmf.loading.hide();
						$('#removeUserContent6').find('.error').html(_confirmJsonResponse.message);
						vmf.modal.show('removeUserContent6');
					} else {						
						location.reload();
					}
				} catch(err){
					vmf.loading.hide();
					$('#removeUserContent6').find('.error').html(removeUserLabelErrorMessage);
					vmf.modal.show('removeUserContent6');
				}
				ice.removeUser.confirmOmntRemove();
			}, error: function(xhr, ajaxOptions, thrownError){
				vmf.loading.hide(); 
				$('#removeUserContent6').find('.error').html(thrownError);
				vmf.modal.show('removeUserContent6');
			}
		});
	},
	disableRemoveUserLink : function(){		
		ice.removeUser.disableEnableLinks('applyInActive', $('#removeUserLink'));
	},
	checkUserPermission : function(jsonResponse){
		var _cnt = 0, _selectedUserInherited = false, _isSet = jsonResponse.permissionPaneContents[4].isSet, _permissionLen = jsonResponse.permissionPaneContents.length;
		var _isLoggedInUserCanEdit = jsonResponse.permissionPaneContents[4].isLoggedInUserCanEdit;		
		if(typeof(jsonResponse)=='undefined' || !jsonResponse)			
			ice.removeUser.disableEnableLinks('applyInActive', $('#removeUserLink'));
		else {
			for(var i=0;i<jsonResponse.permissionPaneContents.length ;i++){
				if(jsonResponse.permissionPaneContents[i].isInherited==false)
					_cnt = _cnt+1;	
				if(jsonResponse.permissionPaneContents[i].isInherited == true)
				  _selectedUserInherited = true;
			}								
			_self = $('#userDiv ul li').filter('.active') || $('ul.info_list li').filter('.active');
			var _suorpu = _self.is('.s, .p, .sp');
			if(IsLoggedInUserSUorOU && (!_suorpu) && _selectedUserInherited == false)
				ice.removeUser.disableEnableLinks('applyActive', $('#removeUserLink'));			
			else if(( _isSet == true && loggedInUserFolderAccess == 'MANAGE' && !_isLoggedInUserCanEdit) || _selectedUserInherited == true || ( _permissionLen >_cnt ) || ( loggedInUserFolderAccess!='MANAGE' ))				
				ice.removeUser.disableEnableLinks('applyInActive', $('#removeUserLink'));			
			else
				ice.removeUser.disableEnableLinks('applyActive', $('#removeUserLink'));		// $('#remove','#remove1','#remopve2')				
		}
	},
	disableEnableLinks: function(flag, linkIds){ 
		if(flag == 'applyInActive')		
				linkIds.addClass('dummyClick').parent('li').addClass('inactive');			
		else if(flag == 'applyActive')			
				linkIds.removeClass('dummyClick').parent('li').removeClass('inactive');
	},
	setLoggedInUser : function(folderAccess){
		loggedInUserFolderAccess = folderAccess;
	},
	confirmOmntRemove : function(){
		if(typeof(riaLinkmy) == "function"){
			if(byFolderTabSelected){
				riaLinkmy("users-permissions : by-folder : remove-user : confirm");
				byFolderTabSelected = false;}
			else if(byUserTabSelected){
				riaLinkmy("users-permissions : by-user : remove-user : confirm");
				byUserTabSelected = false;}
		}
	}
};
