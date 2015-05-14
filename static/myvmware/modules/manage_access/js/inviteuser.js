vmf.ns.use("ice");
ice.inviteUser={	
	enterValidEmailIDformat:null,	
	selectedUsersFolderIds:null,	
	selectedCustomerNumbersInEA:null,
	folderTreeResourceUrl: null,
	portletNs: null,
	emailLists: null,
    firstNameList: null,
    lastNameList: null,
    custEmailMap: null,
	errorPermissionAccess:null,
	permissionCodeMap:null,
	permissionList:null,
	flagCheckForSelectPerm:null,
	selectedPermissions:null,
	selectedFolderId:null,
	flagCheckforBtoF:null,
	processPermissionsURL:null,
	baseFolderId:null,
	selectedFolderName:null,
	flagFolderTreeCBClick:null,
	addUserStep1Flag:null,
	selectPermFlg:null,
	userJsonResponse:null,
	lastChecked:null,
    init:function(processUserListURL, folderTreeUrl, ptltNs, ConfirmInviteUrl,ErrorMsgNoPermission,processPermissionsListURL){
        ice.inviteUser.customStyle('addusersContent');
		processPermissionsURL = processPermissionsListURL;
		enterValidEmailIDformat = ice.globalVars.enterValidEmailIDformat;	

        /*Below if Condition is added for licenses as folderTreeResourceUrl is Id of input type='hidden' in licenses Page which is causing conflict in IE7,IE8 browsers*/
		if(!$('#folderTreeResourceUrl').is(':hidden')){
			folderTreeResourceUrl = folderTreeUrl;
		}
		myvmware.sdpAddUser.init();
        portletNs = ptltNs;
        selectedUsersFolderIds='';
        selectedCustomerNumbersInEA='';
		baseFolderId='';
		ice.inviteUser.selectedFolderName='';
		ice.inviteUser.flagCheckForSelectPerm = false;
		ice.inviteUser.addUserStep1Flag = '';
		ice.inviteUser.flagFolderTreeCBClick = false;
		ice.inviteUser.selectPermFlg = false;
		ice.inviteUser.userJsonResponse = '';
		ice.inviteUser.flagCheckforBtoF = false;
        ice.inviteUser.emailLists = [];
		ice.inviteUser.selectedPermissions = [];
		ice.inviteUser.selectedFolderId = [];
        ice.inviteUser.firstNameList = [];
        ice.inviteUser.lastNameList = [];
        ice.inviteUser.custEmailMap = [];
		ice.inviteUser.permissionList = {};
		ice.inviteUser.permissionCodeMap = {"PERMISSION02" : "PERMISSION01", "PERMISSION03" : "PERMISSION01", "PERMISSION04" : "PERMISSION01"};
		ice.inviteUser.checkselPerm = true;
        errorPermissionAccess=ErrorMsgNoPermission;
        $('#addusers,#addUser,#add_user,#share_folder,#shareFolder,#shareFolderBtn,#inviteUserBtn').die('mouseup').live('mouseup',function() {
            ice.inviteUser.emailLists = [];
            ice.inviteUser.firstNameList = [];
            ice.inviteUser.lastNameList = [];
            ice.inviteUser.custEmailMap = [];
        });
        $('#inviteUserAdd').attr("disabled","disabled").addClass("disabled");
            $('#inviteUserAdd').live('click',function(){
                if($(this).hasClass('disabled')) {
                    return false;
                }
                $('#addusersContent .error').html('');
				$('.errorMsg').html('');
                var firstName, lastName, emailAddr, requestParams, selectedAddUsersList;
                firstName = $.trim($('#fName').val());
                lastName = $.trim($('#lName').val());
                emailAddr = $.trim($('#eAddr').val()).toLowerCase();
                var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;  
                requestParams = 'firstName='+firstName+'&lastName='+lastName+'&emailAddress='+emailAddr; 			
                if(firstName !='' && lastName !='' && emailAddr !=''){
                    if(!emailPattern.test(emailAddr)){
                        $('.errorMsg').html(enterValidEmailIDformat).show();
                    }else if(emailAddr.length>255){
                        $('.errorMsg').html(ice.globalVars.tooManyCharsMsg);
                    }else if($.inArray(emailAddr, ice.inviteUser.emailLists) != -1){
                        $('.errorMsg').html(ice.globalVars.duplicateEmailMsg);
                    }
                    else{
                        $('#inviteUserAdd').attr('disabled', true);
                        $('#addusersContent .error').html('');
						$('.errorMsg').html('');
                        $('#addUserMain #validatedUsers li').hide();
                        $('#addUserMain #validatedUsers p').show();												
                        ice.inviteUser.addUserToRight(firstName, lastName, emailAddr);
                        ice.inviteUser.clearUserFields();
                        ice.inviteUser.updateUserCount();
                        ice.inviteUser.sortingAscLi($('#addUserMain #validatedUsers li'));
                        //ice.inviteUser.sortingAscLi();					
                        $('#addUserMain #validatedUsers p').hide();
                        $('#addUserMain #validatedUsers li').show();
                    }			
                }
                else {
                    $('#addusersContent .error').html(ice.globalVars.enterRequiredFieldsMsg);
                }
            });				
            $('#clearInviteFields').live('click',function() { 
                ice.inviteUser.clearUserFields();
            });
            $('#inviteUserRemove').live('click',function() { // remove the user from the selected users pane
				var selectedUsrs = $('#validatedUsers li').filter('.active');
				ice.inviteUser.updateSelUserList(selectedUsrs);
				ice.inviteUser.updateUserCount();
				var getCountInviteUsers = $('#addUserMain #validatedUsers li').length;
				if(!getCountInviteUsers){
					$('#inviteUserRemove').attr("disabled", "disabled").removeClass('button').addClass('disabled');
				}
            });
	
			$('#validatedUsers li').live('mouseover mouseout click',function(e){
				if(e.type == "mouseover"){
					$(this).addClass('hover');
				} else if(e.type == "mouseout"){
					$(this).removeClass('hover');
				} else {
					$(this).toggleClass('active');
					if($('#validatedUsers li').filter('.active').length){
						$('#inviteUserRemove').removeAttr("disabled", "disabled").removeClass('disabled').addClass('button');
					} else {
						$('#inviteUserRemove').attr("disabled", "disabled").removeClass('button').addClass('disabled');
					}
					
					var $userList= $('#validatedUsers li');
					if(!ice.inviteUser.lastChecked) {
						ice.inviteUser.lastChecked = this;
						return;
					}
					if((e.shiftKey && e.ctrlKey) || e.shiftKey) {
						var start = $userList.index(this);
						var end = $userList.index(ice.inviteUser.lastChecked);
						$userList.slice(Math.min(start,end), Math.max(start,end)+ 1).addClass('active');
					}else if(e.ctrlKey && !e.shiftKey) {
						$(this).addClass('active');
					}else {
						$(this).addClass('active').siblings('li.active').removeClass('active');
					}
					ice.inviteUser.lastChecked = this;
				}
			});
            /* FIX for BUG-00022238 Start*/
            $('#addUsersToFoldersContent3 #inviteContinue').attr("disabled", "disabled").removeClass('button').addClass('disabled');
            /* FIX for BUG-00023993 Start*/		
            $('#addUsersToFoldersContent3 #inviteContinue').css({"margin-top": "0px","margin-bottom": "0px"});
            /* FIX for BUG-00023993 End*/
            $('#addUsersToFoldersContent3').find('#folderPane input[type=checkbox]:not([readonly])').live('click',function(){
                if($('#addUsersToFoldersContent3').find('#folderPane input[type=checkbox]:not([readonly]):checked').length>0){
                    $('#addUsersToFoldersContent3 #inviteContinue').removeAttr("disabled", "disabled").removeClass('secondary');
                }
            });
            $('#addUsersToFoldersContent5 #continuePermissionId').live('click',function() { 	
				$('#addUserMain #addUsersToFoldersContent5').hide();
				if(ice.inviteUser.addUserStep1Flag == 'share') $('#addUsersToFoldersContent4 .headerTitle').html(ice.globalVars.shareFolderLbl);
                $('#simplemodal-container').css({"width": "930px"});
				// get the screen height and width  
				var maskHeight = $(window).height();  
				var maskWidth = $(window).width();
				
				// calculate the values for center alignment
				var dialogTop =  (maskHeight  - $('#simplemodal-container').height())/2;  
				var dialogLeft = (maskWidth - $('#simplemodal-container').width())/2;
				$('#simplemodal-container').css({"top": dialogTop,"left":dialogLeft});
				 $('#addUserMain #addUsersToFoldersContent4 .modalContent').css({"width": "860px"})
                $('#addUserMain #addUsersToFoldersContent4').show();
                var _pULPost = new Object();
                _pULPost['emailList'] = ice.inviteUser.emailLists.toString();
                _pULPost['firstNameList'] = ice.inviteUser.firstNameList.toString();
                _pULPost['lastNameList'] = ice.inviteUser.lastNameList.toString();
                $.ajax({
                    type: 'POST',
                    url: processUserListURL,
                    async: true,
                    dataType: "json",
                    data: _pULPost,
                    success: function (invitedUserModel) {
                        if(invitedUserModel != null && invitedUserModel != undefined) {
                            ice.inviteUser.populateSummaryUI(invitedUserModel);
                        }
						ice.inviteUser.populatePermissionUI();
						if(typeof _byService!="undefined" && _byService){
							ser.addUser.populateServices();
						}
                    },
                    error: function (response, errorDesc, errorThrown) {
                        //console.log("In error: " + errorThrown);
                    },
                    beforeSend: function() {
                        $('#addUsersToFoldersContent4 .body').hide();
                        $('#addUsersToFoldersContent4 .loadingDiv').removeClass('hidden');
                    },
                    complete: function(jqXHR, settings) {
                        $('#addUsersToFoldersContent4 .loadingDiv').addClass('hidden');
                        $('#addUsersToFoldersContent4 .body').show();
                    }
                });
			});
			/* FIX for BUG-00022238 End*/
            $('#addUsersToFoldersContent3 #inviteContinue').live('click',function() { 	
                $('#addUserMain #addUsersToFoldersContent3').hide();
				if(typeof _byService!="undefined" && _byService){
					//sa.byPassPermissions();
					ser.selSerPerm();
					return false;					
				}
				if(!ice.inviteUser.flagCheckForSelectPerm){
					vmf.ajax.post(processPermissionsListURL, null, ice.inviteUser.showSuccessPermissions, ice.inviteUser.failurePermissions);
					$('#addUserMain #addUsersToFoldersContent5').show();
					$('#inviteLoadingEditPermission').show();
					
				} else {
					ice.inviteUser.setSelectPermStatus();
					$('#addUserMain #addUsersToFoldersContent5').show();
				}		
				myvmware.hoverContent.bindEvents($('a.tooltip1'), 'epfunc');
				 $('a#kb_link_id').die('click').live('click', function(e){
					myvmware.common.openHelpPage('http://kb.vmware.com/kb/2035526?plainview=true');
					e.preventDefault();
				});
								
            });	
          if(!(typeof _byService!="undefined" && _byService)){          
            $('#addUsersToFoldersContent4 #inviteConfirm').live('click',function() {
                var requestParams, selectedCustNumForAccountUsers, selectedUsersServiceIds=[];
                $('#custNumber').val('');
                var arrayOfSelectedUsers = new Array();
                $("#populate_list .possibleUsersList input:checkbox[name=checkbox]:checked").each(function() {  
                 arrayOfSelectedUsers.push($(this).val());
                });				
                if(arrayOfSelectedUsers.length > 0){
                    $('#custNumber').val(arrayOfSelectedUsers);
                }
							
				if($('#admin_sel_chkbox').is(":checked"))
				{
					ice.inviteUser.selectedPermissions.push("ADMIN_PERM");
				}
				selectedPermStr=ice.inviteUser.selectedPermissions;                
                selectedCustNumForAccountUsers = $('#custNumber').val();
                requestParams = 'totselectedUsersFolderIds='+selectedUsersFolderIds+"&SelectedPermissions="+selectedPermStr;
                vmf.ajax.post(ConfirmInviteUrl, requestParams, ice.inviteUser.confirmInviteUsers, ice.inviteUser.failureInviteUsersConfirm);
            });
}
            $('#addUsersToFoldersContent3 #backToMain').live('click',function() { 	
                $('#addUserMain #addUsersToFoldersContent3').hide();			
                $('#addUserMain').parents('#simplemodal-container').css({"width": "860px","left": "202px"});
				if(ice.inviteUser.addUserStep1Flag === 'invite'){
					$('#addUserMain #addusersContent').show();
				} else if(ice.inviteUser.addUserStep1Flag === 'share') {
					$('#addUserMain #shareFolderContent').show();
				}
			});		
            $('#addUsersToFoldersContent4 #backToPerm').live('click',function() { 	
                $('#addUserMain #addUsersToFoldersContent4').hide();			
                $('#addUserMain').parents('#simplemodal-container').css({"width": "620px","left": "322px"});
                $('#addUserMain #addUsersToFoldersContent5').show();			
            });
			$('#addUsersToFoldersContent5 #backToFolder').live('click',function() {
				$('#addUserMain #addUsersToFoldersContent5').hide();
				if(!ice.inviteUser.selectPermFlg){			
					$('#addUserMain').parents('#simplemodal-container').css({"width": "620px","left": "322px"});
					$('#addUserMain #addUsersToFoldersContent3').show();
				} else {
					$('#addUserMain').parents('#simplemodal-container').css({"width": "860px","left": "202px"});
					if(ice.inviteUser.addUserStep1Flag === 'invite'){
						$('#addUserMain #addusersContent').show();
					} else if(ice.inviteUser.addUserStep1Flag === 'share'){
						$('#addUserMain #shareFolderContent').show();
					}
				}
            });		
					
            $('.inviteUserForm').find('input[type=text]').live('keyup change focusout', function(e){
                var fname = $.trim($('#fName').val())
                var lname = $.trim($('#lName').val())
                var eaddr = $.trim($('#eAddr').val())
                if(fname != "" && lname != "" && eaddr != "" ){
                    $('#inviteUserAdd').removeAttr("disabled").removeClass("disabled");
                }else{
                    $('#inviteUserAdd').attr("disabled","disabled").addClass("disabled");
                }
            });	
			
			/*CR - 12085*/
			$("#userSearchInput").focus(function() {
				$(this).css('color', '#333333');
				if(this.value == this.defaultValue) {this.value = '';}
				else {this.select();}
			}).blur(function() {
				$(this).css('color', '#999999');
				if(!$.trim(this.value).length) {
					this.value = (this.defaultValue ? this.defaultValue : '');
				}else $(this).css('color', '#333333');
			}).keydown(function(e){
				if(e.which == 13) $('#findBtn').trigger('click');
			});
			$('#addUserBtn').live('click',function(){
				$('#uList li.active').removeClass('active').remove().appendTo('#sList');  
				$('#sList li input').attr('checked',false);
				ice.inviteUser.lastChecked = null;
				ice.inviteUser.updateListDetail();
				$('#sList li').each(function(index){
					var fName = $(this).attr('fName'),lName = $(this).attr('lName'),email = $(this).attr('emailAddr');
					if(!($.inArray(email,ice.inviteUser.emailLists) > -1)){
						ice.inviteUser.updateUsersList(fName,lName,email);
					}
				});	
				ice.inviteUser.sortingAscLi($('#sList li'));
			});
			$('#remove_Btn').live('click',function(){
				var selectedUsrs = $('#sList li.active');
				selectedUsrs.removeClass('active').remove().appendTo('#uList'); 
				ice.inviteUser.updateSelUserList(selectedUsrs);
				ice.inviteUser.lastChecked = null;
				ice.inviteUser.updateListDetail();
				ice.inviteUser.sortingAscLi($('#uList li'));
			});
			$('#uList li').live('mouseover mouseout click',function(e){
				if(e.type == "mouseover"){
					$(this).addClass('hover');
				} else if(e.type == "mouseout"){
					$(this).removeClass('hover');
				} else {
					$(this).hasClass('active')?$(this).removeClass('active').find('input').attr('checked',false):$(this).addClass('active').find('input').attr('checked',true);
					($('#uList li').filter('.active').length == $('#uList li').length)?$('#checkAll').attr('checked',true):$('#checkAll').attr('checked',false);
					if($('#uList li').filter('.active').length){
						$('#addUserBtn').removeAttr("disabled", "disabled").removeClass('disabled').addClass('button');
					} else {
						$('#addUserBtn').attr("disabled", "disabled").removeClass('button').addClass('disabled');
					}
					
					var $userList= $('#uList li');
					if(!ice.inviteUser.lastChecked) {
						ice.inviteUser.lastChecked = this;
						return;
					}
					if(e.shiftKey) {
						var start = $userList.index(this);
						var end = $userList.index(ice.inviteUser.lastChecked);
						$userList.slice(Math.min(start,end), Math.max(start,end)+ 1).addClass('active').find('input').attr('checked',true);
					}
					ice.inviteUser.lastChecked = this;
				}
			});
			$('#sList li').live('mouseover mouseout click',function(e){
				if(e.type == "mouseover"){
					$(this).addClass('hover');
				} else if(e.type == "mouseout"){
					$(this).removeClass('hover');
				} else {
					$(this).toggleClass('active');
					
					if($('#sList li').filter('.active').length){
						$('#remove_Btn').removeAttr("disabled", "disabled").removeClass('disabled').addClass('button');
					} else {
						$('#remove_Btn').attr("disabled", "disabled").removeClass('button').addClass('disabled');
					}
					
					var $userList= $('#sList li');
					if(!ice.inviteUser.lastChecked) {
						ice.inviteUser.lastChecked = this;
						return;
					}
					if((e.shiftKey && e.ctrlKey) || e.shiftKey) {
						var start = $userList.index(this);
						var end = $userList.index(ice.inviteUser.lastChecked);
						$userList.slice(Math.min(start,end), Math.max(start,end)+ 1).addClass('active');
					}
					else if(e.ctrlKey && !e.shiftKey) {
						$(this).addClass('active');
					}
					else {
						$(this).addClass('active').siblings('li.active').removeClass('active');
					}
					ice.inviteUser.lastChecked = this;
				}
			});	
			$('#checkAll').click(function(){
				if($(this).attr('checked')) {
					$('#uList').find('li').not('.active').trigger('click');
				}else{
					$('#uList').find('li.active').trigger('click');
				}
			});
			$('#findBtn').click(function(){
				ice.inviteUser.filterUsers();
			});
			
    },
	updateSelUserList:function(selectedUsrs){
		for(var i=0;i<selectedUsrs.length;i++) {
			var $this = $(selectedUsrs[i]), _custNumber, _findCustNumber, _status, _removeEmailAddr;								
			_custNumber = $this.attr('id');
			_status = $this.attr('id');
			_removeClass = $this.attr('emailAddr');
			_removeEmailAddr = $.trim($this.find('.email').text());
			if(ice.inviteUser.addUserStep1Flag === 'invite'){
				$this.remove();	// removing from invite user Tab
			}
			$('#addUsersToFoldersContent4 #selectedAddUsersList .'+_removeClass).remove();	// removing from confirm pop
			$('#addUsersToFoldersContent4 #selectedInviteUsersList .'+_removeClass).remove(); // removing from confirm pop
			$('ul.removeUsersList .'+_removeClass).remove(); // removing from add user pop - sometimes the status = liclass (fn_userID_1, ..)

			$('ul.possibleUsersList .'+_removeClass).show(); // showing the removed li in left panel of add user
			$('ul.possibleUsersList .'+_removeClass).find('input').attr('checked', false);	 // making false in left panel of add user		
			$('span.numberSelected').html($('ul.removeUsersList li').size());// reseting the count of selected Users in add user
			var _index = $.inArray(_removeEmailAddr, ice.inviteUser.emailLists);
			ice.inviteUser.emailLists.splice(_index, 1); //	remove the email address from emailLists array for duplicate email check purpose 		
			ice.inviteUser.firstNameList.splice(_index, 1);
			ice.inviteUser.lastNameList.splice(_index, 1);
			ice.inviteUser.custEmailMap[_removeEmailAddr] = null;
		}
	},
	populatePermissionUI:function(){
		ice.inviteUser.selectedPermissions=[];
		var globRow = '';
		var permissionHTML = '<table id="invite_tbl_confirm"  class="withborders incHeight"><tbody id="permission_tbody">';
			permissionHTML += '</tbody></table>';
		$('div#permissionsList').html(permissionHTML);
		var checkPermission = ice.inviteUser.permissionList;
		var permissionsArray = [];

		if(typeof _byService!="undefined" && _byService){
			checkPermission = ice.inviteUser.permissionList.permissions;
		}

		if(checkPermission!=null){
			for(i in checkPermission){
				var permissioRow = '<tr>';
				if(typeof _byService!="undefined" && _byService){
					permissioRow += '<td class="">'+checkPermission[i].pName+'</td><td class="iconCont">';
				}
				else{
					if(checkPermission[i].level == 1){
						permissioRow += '<td class="indent15">'+checkPermission[i].description+'</td><td class="iconCont">';
					}else{
						permissioRow += '<td class="">'+checkPermission[i].description+'</td><td class="iconCont">';
					}
				}
				permissioRow+= '</td></tr>';
				globRow += permissioRow;
				permissioRow = "";
			}
			$('div#permissionsList table.withborders tbody').html(globRow);
			var imgcont = $('#permissionsList #permission_tbody td.iconCont');
			if(checkPermission.length == undefined){
				for(var key in checkPermission){
					permissionsArray.push(checkPermission[key]);	
				}
			}else{
				permissionsArray = checkPermission;
			}

			$('#inviteEditPermissionDiv #perm_tbody input:checkbox').each(function(index){
				if((typeof _byService!="undefined" && _byService)){
					var $staticTextfortick = rs.pane3.tick,
					$staticTextforcross = rs.pane3.lock;
				}
				if($(this).attr('checked')) {
					$(imgcont[index]).html('<img src="/static/myvmware/common/img/dot.png" alt="'+ $staticTextfortick +'" title="'+ $staticTextfortick +'" />');
					ice.inviteUser.selectedPermissions.push($(this).attr('id'));
				} else if(!permissionsArray[index].isActiveFlag) {
					$(imgcont[index]).html('<img src="/static/myvmware/common/img/cross.png" alt="'+ $staticTextforcross +'" title="'+ $staticTextforcross +'" /><img src="/static/myvmware/common/img/lock.png" height="16" width="14" alt="' + $staticTextforcross + '" title="' + $staticTextforcross + '" />');
					$(imgcont[index]).closest('tr').addClass('inactive');
				}else {
					$(imgcont[index]).html('<img src="/static/myvmware/common/img/cross.png" alt="'+ $staticTextforcross +'" title="'+ $staticTextforcross +'" />');
					
				}
			});
		}
		
	},
	showSuccessPermissions: function(permissionsList){
		var permList = vmf.json.txtToObj(permissionsList);
		ice.inviteUser.permissionList = permList;
		var globRow = '';
		var arr =[];
		var inputEl = $('#addUsersToFoldersContent3 #folderPane input');
		inputEl.each(function(index){
			var self = this;
			if(self.checked == true){
				arr.push(parseInt($(this).closest('li').attr('level')));
			}
		});
		if(permList == null){
			$('div#inviteLoadingEditPermission').hide();
			$('div#showInviteEditPermission').html(ice.globalVars.noPermissionExistMsg);
			$('div#showInviteEditPermission').show();
			return false;
		}
		
		var permissionHTML = '<table id="invite_tbl_edit"  class="withborders incHeight"><thead><tr><th class="bdrLt1px">'+ice.globalVars.accessLbl+'</th><th class="bdrRt1px">'+ice.globalVars.allowedLbl+'</th>';
			permissionHTML += '</tr></thead><tbody id="perm_tbody">';
			permissionHTML += '</tbody></table>';
		$('div#inviteEditPermissionDiv').html(permissionHTML);
		
		if(permList!=null){
			for(i in permList){
				var permissioRow = '<tr>';
				if(permList[i].level == 1){
					permissioRow += '<td class="indent15">'+permList[i].description+'</td><td class="">';
				}else{
					permissioRow += '<td class="">'+permList[i].description+'</td><td class="">';
				}
				var permissionCode = permList[i].permissionCode;
				permissioRow += '<input type="checkbox" id='+permissionCode+'>';
				permissioRow += '</td></tr>';
				globRow += permissioRow;
				permissioRow = "";
			}
		}
		$('table.withborders tbody').html(globRow);
		ice.inviteUser.setSelectPermStatus();
		ice.inviteUser.flagCheckForSelectPerm = true;
		$('div#inviteLoadingEditPermission').hide();
		$('div#showInviteEditPermission').show();
		$('div#inviteEditPermissionDiv input[type="checkbox"]').unbind('click').bind('click',function(){
			if($(this).attr('id') == "PERMISSION07" && $(this).attr('checked')){
				ice.inviteUser.showAlertWindow();
			}
		});
		$('div#addUsersToFoldersContent5').show();		
	},
	showAlertWindow: function(){// When clicking on PERMISSION07 call this function
		$('#inviteEditPermissionData div.tabledata, #inviteEditPermissionData div.perm_footer,#inviteEditPermissionData p.description').hide();
		$('#inviteEditPermissionData div.warncontainerclass,#inviteEditPermissionData div.warncontainerclass div.warning_footer').show();
		$('button#close_warning_invite').unbind('click').bind('click', function(){
			$('#inviteEditPermissionData div.warncontainerclass,#inviteEditPermissionData div.warncontainerclass div.warning_footer').hide();
			$('#inviteEditPermissionData div.tabledata, #inviteEditPermissionData div.perm_footer,#inviteEditPermissionData p.description').show();
		})
	},
	failurePermissions: function(){
		//console.log('error');
	},
	setSelectPermStatus: function(){
		var arr =[], inputEl = $('#addUsersToFoldersContent3 #folderPane input'),inviteEditInputs=  $('#inviteEditPermissionDiv #perm_tbody input:checkbox');
		$('#admin_sel_chkbox').attr('checked','');
		$('#inviteEditPermissionDiv #perm_tbody td').removeClass('inactive lock').find('a.dumyLock').remove().end().find('input:checkbox').attr('checked','');
		if(ice.inviteUser.selectedFolderId.length && !inputEl.filter(':checkbox:checked').length){
			var $folderHT = vmf.foldertree.getFolderHashtable(),
			_folderLevel = $folderHT.get(ice.inviteUser.selectedFolderId[0]).folderLevel;
			arr.push(parseInt(_folderLevel - 1));
		} else {
			inputEl.each(function(index){
				var self = this;
				if(self.checked == true){
					arr.push(parseInt($(this).closest('li').attr('level')));
				}
			});
		}
		/*BUG-00066459 - Javascript scope issue (hoisting)*/
		if((typeof _byService!="undefined" && _byService)){
			$staticTextfortick = rs.pane3.tick;
			$staticTextforLock = rs.pane3.Lock;
		}
		if($.inArray(1,arr) > -1){
			$('#admin_sel_chkbox').removeAttr('disabled').parent('.chk_box_container').show();
			inviteEditInputs.removeAttr('disabled');
		} else {
			$('#admin_sel_chkbox').attr('disabled','disabled').parent('.chk_box_container').hide();
			if($.inArray(0,arr) > -1) {
				inviteEditInputs.removeAttr('disabled');
			} else {
				inviteEditInputs.removeAttr('disabled');
				$('#inviteEditPermissionDiv #perm_tbody').find('#PERMISSION09,#PERMISSION08,#PERMISSION07').attr('disabled','disabled').closest('td').addClass('lock').append('<a href="#" class="dumyLock tooltip" data-tooltip-position="bottom" title="'+ $staticTextforLock +'">'+ice.globalVars.helpTextLbl+'</a>').prev('td').addClass('inactive');
			}
		}
		var downloadProdPerm = $('#inviteEditPermissionDiv #perm_tbody #PERMISSION06');
		downloadProdPerm.attr({'checked':'checked','disabled':'disabled'});
		if(!downloadProdPerm.siblings('a.dumyLock').length){
			downloadProdPerm.closest('td').addClass('lock').append('<a href="#" class="dumyLock tooltip" data-tooltip-position="bottom" title="'+ $staticTextforLock +'">'+ice.globalVars.helpTextLbl+'</a>').prev('td').addClass('inactive');
		}
		inviteEditInputs.die('click').live('click',function(){
			if($(this).attr('checked')){
				if(ice.inviteUser.permissionCodeMap[$(this).attr('id')]){
					var permissionId = ice.inviteUser.permissionCodeMap[$(this).attr('id')]; 
					$('#inviteEditPermissionDiv #invite_tbl_edit #PERMISSION01').attr('checked', true);
				}								
			}else{
				if($(this).attr('id')){
					var _id = '#inviteEditPermissionDiv #'+$(this).attr('id');
					$(_id).removeAttr('checked');
					
					if($(this).attr('id') == "PERMISSION01"){
						var permissionId = $(this).attr('id');
						if(($('#inviteEditPermissionDiv #PERMISSION02').attr('checked')) || $('#inviteEditPermissionDiv #PERMISSION03').attr('checked') || $('#inviteEditPermissionDiv #PERMISSION04').attr('checked')){
							$('#inviteEditPermissionDiv #invite_tbl_edit #PERMISSION01').attr('checked', true);
						}
					}
				}
			}
					
		});	
		$('input#admin_sel_chkbox').die('click').live('click', function(){
			var inputSelect = inviteEditInputs.not('input#PERMISSION07,input#PERMISSION06');
			if($(this).attr('checked')){
				inputSelect.attr({'checked':'checked','disabled':'disabled'}).parent('td').addClass('lock').append('<a href="#" class="dumyLock tooltip" data-tooltip-position="bottom" title="'+ $staticTextforLock +'">'+ice.globalVars.helpTextLbl+'</a>');
			} else {
				inputSelect.removeAttr('checked').parent('td').removeClass('lock').find('a.dumyLock').remove();
				inputSelect.removeAttr('disabled');
			}
			myvmware.hoverContent.bindEvents($('a.tooltip'), 'defaultfunc');	
			
		});
		myvmware.hoverContent.bindEvents($('a.tooltip'), 'defaultfunc');	
		
	},
	populateSummaryUI: function(invitedUserModel) {
		$('#addUsersToFoldersContent4 #selectedAddUsersList').empty();
		$('#addUsersToFoldersContent4 #selectedInviteUsersList').empty();
		$('#selectedAddUsersList').parent('.accountUserSection').show();
		$('#selectedInviteUsersList').parent('.accountUserSection').show();
		if(invitedUserModel.addedUserList != undefined) {
			var _addedUser = [];
			for(var i=0;i < invitedUserModel.addedUserList.length;i++) {
				_addedUser.push('<li class="clearfix"><span class="name">' + vmf.wordwrap(invitedUserModel.addedUserList[i].firstName + ' ' 
				+ invitedUserModel.addedUserList[i].lastName,2) + '</span> <span class="email emailremove">'+vmf.wordwrap(invitedUserModel.addedUserList[i].email,2)+'</span></li>');
			}
			$('#addUsersToFoldersContent4 #selectedAddUsersList').append(_addedUser.join(' '));
			//ice.inviteUser.sortTdElem("selectedAddUsersList");//Sort td elements based on firstname and lastname
			ice.inviteUser.sortingAscLi($('#selectedAddUsersList li'));
		}
		if(invitedUserModel.invitedUserList != undefined) {
			var _invitedUser = [], _emailAddr = '';
			for(var i=0;i < invitedUserModel.invitedUserList.length;i++) {
				_emailAddr = invitedUserModel.invitedUserList[i].email.toLowerCase();
				if(ice.inviteUser.custEmailMap[_emailAddr] != undefined &&
				ice.inviteUser.custEmailMap[_emailAddr] != null)
				_invitedUser.push('<li><span class="name">' + vmf.wordwrap(ice.inviteUser.custEmailMap[_emailAddr].firstName + ' ' 
				+ ice.inviteUser.custEmailMap[_emailAddr].lastName,2) + '</span> <span class="email emailremove">'+vmf.wordwrap(_emailAddr,2)+'</span></li>');
			}
			$('#addUsersToFoldersContent4 #selectedInviteUsersList').append(_invitedUser.join(' '));
			//ice.inviteUser.sortTdElem("selectedInviteUsersList");//Sort td elements based on firstname and lastname
			ice.inviteUser.sortingAscLi($('#selectedInviteUsersList li'));
		}
		if($('#addUsersToFoldersContent4 #selectedAddUsersList li').length == 0) { // Adding exisiting users
			$('#selectedAddUsersList').closest('.accountUserSection').hide();
			$('#addUsersToFoldersContent4').find('.devider').hide();
		}
		else {
			$('#selectedAddUsersList').closest('.accountUserSection').show();
			$('#addUsersToFoldersContent4').find('.devider').show();
		}
		if($('#addUsersToFoldersContent4 #selectedInviteUsersList li').length == 0) {// Adding new users
			$('#selectedInviteUsersList').closest('.accountUserSection').hide();
			$('#addUsersToFoldersContent4').find('.devider').hide();
		}
		else {
			$('#selectedInviteUsersList').closest('.accountUserSection').show();
			$('#addUsersToFoldersContent4').find('.devider').show();
		}
		if(typeof(invitedUserModel.error) != 'undefined' && invitedUserModel.error!=''){
			var _errorMsg = invitedUserModel.message;
			$('#addUsersToFoldersContent4').find('span.errmsg').html(_errorMsg);
		}
		ice.inviteUser.customStyle('addUsersToFoldersContent4');
	},
	failureInviteUsersValidation:function(){
		$('#addusersContent .error').html(ice.globalVars.ajaxRequestFailMsg);		
	},
	addUserToRight: function(firstName, lastName, emailAddr){		
        inviteUserList ='<li unselectable="on" emailAddr="' + emailAddr + '" class="clearfix userElem"><span class="name">' + vmf.wordwrap(firstName + ' ' + lastName,2) + '</span> <span class="email emailremove" >'+vmf.wordwrap(emailAddr,2)+'</span> </li>';
		$('#addUserMain #validatedUsers').append(inviteUserList);
		//$('#validatedUsers .name,#validatedUsers .email').css({'width':'161px','word-wrap':'break-word'});
        ice.inviteUser.emailLists.push(emailAddr.toLowerCase());
        ice.inviteUser.firstNameList.push(firstName);
        ice.inviteUser.lastNameList.push(lastName);
        var _customer = new Object();
        _customer.firstName = firstName;
        _customer.lastName = lastName;
        ice.inviteUser.custEmailMap[emailAddr.toLowerCase()] = _customer;
        ice.inviteUser.customStyle('addUserRight');
	},
    updateUserCount: function() {
        var getCountInviteUsers = $('#addUserMain #validatedUsers li').size(); 
		if(getCountInviteUsers != 0){
				$('#addUserMain #content_9 .selectedNumInviteUser').html(getCountInviteUsers);
				$('#btn_next', $("#addUserMain")).removeAttr("disabled", "disabled").removeClass('disabled').addClass('button');
				$('#btn_invite').removeAttr("disabled", "disabled").removeClass('disabled').addClass('button');
		}else{
				$('#addUserMain #content_9 .selectedNumInviteUser').html('0');
				$('#btn_next', $("#addUserMain")).attr("disabled", "disabled").removeClass('button').addClass('disabled');
				$('#btn_invite').attr("disabled", "disabled").removeClass('button').addClass('disabled');
		}
    },
    clearUserFields: function() {
        $('#fName, #lName, #eAddr').val('');
		$('.errorMsg').html('');
        $('#inviteUserAdd').attr("disabled","disabled").addClass("disabled");
    },
	populateFoldersUI: function () {   			
		$('#addUserMain #addusersContent').hide();
		$('#addUsersToFoldersContent3').parents('#simplemodal-container').css({"width": "620px","left": "322px"});
		$('#addUserMain #addUsersToFoldersContent3').show();
	},
	handleFolderTree: function (portletNs, folderTreeResourceUrl) {
		$('#addUsersToFoldersContent3 .error').html('');
		flagCheckForFolderTree = true;
        var config = new Object();
        config.uniqueDiv = portletNs+"1";   	
        config.ajaxTimeout = 60000;
        config.npMsgContent = errorPermissionAccess;//'Please contact the Folder Manager for the necessary permissions'; // folder.config.npMsgContent ( check this variable in resource bundle)
        config.npMsgFunction = function (msg) {
			flagCheckForFolderTree = false;
           $('#addUsersToFoldersContent3 .error').html(msg);
        };
        config.cbOnClickFunction = function (folderId, cbState) { 
			ice.inviteUser.folderTreeCBClick(folderId,cbState);
        };
        config.cbOnClickSelFoldersFunction = function (selectedFolders, cbState) {
			ice.inviteUser.folderTreeCBSelected(selectedFolders, cbState);
        };
        config.validateJSONFunction = function (folderListJSON) {
            if (folderListJSON.error) {
				flagCheckForFolderTree = false;
				$('#addUsersToFoldersContent3 .error').html(msg);
            }
        };
        config.errorFunction = function (response, errorDesc, errorThrown) {
			flagCheckForFolderTree = false;
			$('#addUsersToFoldersContent3 .folderPane').html(manageAccess_addUser_NoFolderMsg);
        };
		config.loadComplete = function () {
			if(ice.inviteUser.selectedFolderName !== ""){
				var _inputSearch = new Object();
				_inputSearch['folderName'] = ice.inviteUser.selectedFolderName;
				vmf.ajax.post($findFolderUrl, _inputSearch, ice.inviteUser.successGetFolder, ice.inviteUser.failureGetFolder);
			}
			$('#addUsersToFoldersContent3 #folderPane ul li').live('click',function(e){
				ice.inviteUser.selectedFolderId = [];
				$('#selFolder_name').html('');
			});
			
		};
        config.inputType = 'checkbox';
        config.loadingClass = 'loadingDiv';
		var _customerNumber = $("input[@name=userId]:checked").val();
		var _inData = {"selectedUserCustomerNumber":_customerNumber, "folderView": "addUserToFolder"};
		config.requestParams = _inData;
        config.expandSelect = false;			
		vmf.foldertree.build(folderTreeResourceUrl, config);  			
    },
	folderTreeCBClick: function (folderId, cbState) { // Onclick of checkbox, we are storing the JSON datas for future purpose.   
    },
    folderTreeCBSelected: function (selectedFolders, cbState) {	
        if(selectedFolders.length > 0) {
			$('#addUsersToFoldersContent3 #inviteContinue').removeAttr("disabled", "disabled").removeClass('disabled').addClass('button');
		}
		else {
			$('#addUsersToFoldersContent3 #inviteContinue').attr("disabled", "disabled").removeClass('button').addClass('disabled');
		}
    
		var _selectedFolderName, _fullFolderPath;
		selectedUsersFolderIds = selectedFolders 
		$folderHT = vmf.foldertree.getFolderHashtable();
		var _selectedFolders = vmf.foldertree.getSelectedFolders();
		$selectedFolderPathHT = new vmf.data.Hashtable();
		$('#addUsersToFoldersContent4 #inviteUserSelectedFolders').html('');
		$.each(_selectedFolders.keys(), function (index, value) {		//valuse is folderId
			_selectedFolderName = $folderHT.get(value).folderName;
			_fullFolderPath = $folderHT.get(value).fullFolderPath;			
			$('#addUsersToFoldersContent4 #inviteUserSelectedFolders').append('<li> <span>'+ice.common.wordwrap('',_selectedFolderName,'50','<br>','true')+'</span> <span class="email">'+ice.common.wordwrap('',_fullFolderPath,'50','<br>','true')+'</span></li>');		                                              			
		});
    },
	confirmInviteUsers: function (data) {	
		var responseData = vmf.json.txtToObj(data);
		if(responseData!=null && responseData.error) {
			$('#addUsersToFoldersContent4 .error').html(ice.globalVars.errorTryAgainMsg);
		}else{
			vmf.modal.hide();
			location.reload();
		}
		if(typeof(riaLinkmy) == "function"){
            var omntModuleSel = (ice.managelicense) ? "my-licenses : " : "users-permissions : "; //Defines if invite-user or share-folder happens at License Keys Module or Users & Permissions Module
			var omntTag = (ice.inviteUser.addUserStep1Flag=="share") ? "share-folder" : "invite-new-user";
			riaLinkmy(omntModuleSel+omntTag+" : confirm");
		}
	},
	failureInviteUsersConfirm: function () {		
		$('#addusersContent #addUsersToFoldersContent4 .error').html(ice.globalVars.ajaxRequestFailMsg);
	},
	sortingAscLi: function(liObj){ //sortli.js
		var li = liObj;                                                 
		//sort('#addUserMain #validatedUsers li', '.name', true);
		li.sortElements (function(a, b){
			a = $(a).find('span:eq(0)');
			b = $(b).find('span:eq(0)');
			return $(a).text().toUpperCase() > $(b).text().toUpperCase() ? 1 : -1;
		}); 
	},
    customStyle:function(divObj){
 		if(divObj == 'addUserRight'){
			$('#addusersContent').find('#validatedUsers li').css({'padding-left':'15px'});
		} else if(divObj=='addUsersToFoldersContent3'){
			if(typeof _byService!="undefined"){ //By Service tab
				$("#folderPane",$("#addUsersToFoldersContent3")).attr("id","serviceList");
				$(".body>p",$("#addUsersToFoldersContent3")).html(rs.adduser.step2Desc);
				$(".sec_head>h1",$("#addUsersToFoldersContent3")).html(rs.adduser.step2Header);
				if(_byService){
					$("#addUsersToFoldersContent3 div.headerTitle").html(rs.adduser.step2Select);
					$("#addUsersToFoldersContent5 #inviteEditPermissionData .description").html(rs.adduser.step3StaticText);
				}
			}
			$('#'+divObj).find('.sec_head h1').css({'font-weight':'normal'});
			$('#'+divObj).find('.section-wrapper .column .scroll').css({'height':'253px'}).addClass('scrollx');
		} else if(divObj=="addUsersToFoldersContent4"){
			$('#'+divObj).find('.section-wrapper table td,.section-wrapper table.alignLeft td').css({'padding-left':'0px'});
			$('#'+divObj).find('.modalContent .body div.accountUserSection,.modalContent .section-wrapper .column ul.folderList li').css({'padding-left':'15px'});
		}
	},
	processInviteUserPerm: function(obj){
		$('#'+obj).hide();	
		$('#addUserMain').parents('#simplemodal-container').css({"width": "620px","left": "322px"});
		if(!ice.inviteUser.flagCheckForSelectPerm){
			vmf.ajax.post(processPermissionsURL, null, ice.inviteUser.showSuccessPermissions, ice.inviteUser.failurePermissions);
			$('#addUserMain #addUsersToFoldersContent5').show();
			$('#inviteLoadingEditPermission').show();
		} else {
			ice.inviteUser.setSelectPermStatus();
			$('#addUserMain #addUsersToFoldersContent5').show();
		}		
		myvmware.hoverContent.bindEvents($('a.tooltip1'), 'epfunc');
		 $('a#kb_link_id').die('click').live('click', function(e){
			myvmware.common.openHelpPage('http://kb.vmware.com/kb/2035526?plainview=true');
			e.preventDefault();
		});
	},
	successGetFolder: function(foundFolderList){
		var responseData = vmf.json.txtToObj(foundFolderList), folderObj = responseData.findFolderWithPathList,_selFolderObj;
		if(folderObj.length) {
			if(folderObj.length>1){
				for(var i=0;i<folderObj.length;i++){
					if(folderObj[i].folderId === ice.inviteUser.selectedFolderId[0]){
						_selFolderObj = folderObj[i];
					} 
				}
			} else {
				_selFolderObj = folderObj[0];
			}
			if(_selFolderObj){
				var _selFolderId = _selFolderObj.folderId;
				var _folderHT = vmf.foldertree.getFolderHashtable();
				if(_folderHT.containsKey(_selFolderId)) {
					vmf.foldertree.preSelectFolder(_selFolderId, true, true);
				}
				else {
					vmf.foldertree.showURFolder(_selFolderId, _selFolderObj, true, true);
				}
			}
		}
		ice.inviteUser.selectedFolderName = '';
	},
	failureGetFolder: function(){
		//Error Handling
	},
	renderUsers: function(filterText){
		var userJsonResponse = ice.inviteUser.userJsonResponse;
		var _strHTML = '<ul id=\"uList\">';
		filterText = $.trim(filterText).toUpperCase();
		var count = 0;
		if(userJsonResponse.userPaneContents.length>0){
			
			for(i=0;i<userJsonResponse.userPaneContents.length;i++){
				var _userFirstName = userJsonResponse.userPaneContents[i].firstName;
				_userFirstName = _userFirstName.toUpperCase();
				var _userLastName = userJsonResponse.userPaneContents[i].lastName;
				_userLastName = _userLastName.toUpperCase();
				var _userEmail = userJsonResponse.userPaneContents[i].email;
				_userEmail = _userEmail.toUpperCase();
				var _userFullName = _userFirstName + ' ' + _userLastName;
				if((filterText!='')){
					if((filterText==userSearchDefaultText.toUpperCase() || _userFirstName.indexOf(filterText)!=-1 || _userLastName.indexOf(filterText)!=-1 || _userFullName.indexOf(filterText)!=-1 || _userEmail.indexOf(filterText)!=-1) && !($.inArray(userJsonResponse.userPaneContents[i].email.toLowerCase(),ice.inviteUser.emailLists) > -1)){
						_strHTML = _strHTML + '<li val=\'' +  userJsonResponse.userPaneContents[i].cN +'\' emailAddr=\'' +  userJsonResponse.userPaneContents[i].email +'\' fName=\'' +  userJsonResponse.userPaneContents[i].firstName +'\' lName=\'' +  userJsonResponse.userPaneContents[i].lastName +'\'>';
						_strHTML = _strHTML + '<input type="checkbox" /><span class="uName">'+userJsonResponse.userPaneContents[i].firstName + ' ' + userJsonResponse.userPaneContents[i].lastName + '</span><span class="email">'+userJsonResponse.userPaneContents[i].email+'</span>';
						_strHTML = _strHTML + '</li>';
					} else {
						count = count+1;
					}
				} else if(filterText=='' && !($.inArray(userJsonResponse.userPaneContents[i].email.toLowerCase(),ice.inviteUser.emailLists) > -1)){
					_strHTML = _strHTML + '<li val=\'' +  userJsonResponse.userPaneContents[i].cN +'\' emailAddr=\'' +  userJsonResponse.userPaneContents[i].email +'\' fName=\'' +  userJsonResponse.userPaneContents[i].firstName +'\' lName=\'' +  userJsonResponse.userPaneContents[i].lastName +'\'>';
					_strHTML = _strHTML + '<input type="checkbox" /><span class="uName">'+userJsonResponse.userPaneContents[i].firstName + ' ' + userJsonResponse.userPaneContents[i].lastName + '</span><span class="email">'+userJsonResponse.userPaneContents[i].email+'</span>';
					_strHTML = _strHTML + '</li>';
				}
				
			}
		}
		_strHTML = _strHTML + '</ul>';
		$('#preLoader').hide();
		if(count>0 && count==userJsonResponse.userPaneContents.length){
			$("#usersList").html('<div class="center_text">' + findUserErrorMsg + '</div>');
		}else{
			$("#usersList").html(_strHTML);
			if(!$.trim(filterText).length) $('#totalUsers').text($('#uList li').length);
			$('#checkAll').attr('disabled',false);
		}
	},
	filterUsers : function(){
		if($.trim($("#userSearchInput").val()).length && $.trim($("#userSearchInput").val()) != userSearchDefaultText){
			ice.inviteUser.renderUsers($("#userSearchInput").val());		
		}else{
			ice.inviteUser.renderUsers('');
		}
	},
	updateUsersList: function(firstName,lastName,emailAddr){
		ice.inviteUser.emailLists.push(emailAddr.toLowerCase());
        ice.inviteUser.firstNameList.push(firstName);
        ice.inviteUser.lastNameList.push(lastName);
        var _customer = new Object();
        _customer.firstName = firstName;
        _customer.lastName = lastName;
        ice.inviteUser.custEmailMap[emailAddr.toLowerCase()] = _customer;
	},
	updateListDetail:function(){
		var totU = $('#totalUsers'), totSu = $('#totalSelectedUsers'), tU = $('#uList'), sU = $('#sList');
		totU.text(tU.find('li').length);
		totSu.text(sU.find('li').length);
		tU.find('li').length?$('#checkAll').attr('checked',false).attr('disabled',false):$('#checkAll').attr('checked',false).attr('disabled',true);
		tU.find('li.active').length?$('#addUserBtn').removeClass('disabled').attr('disabled',false):$('#addUserBtn').addClass('disabled').attr('disabled',true);
		sU.find('li.active').length?$('#remove_Btn').removeClass('disabled').attr('disabled',false):$('#remove_Btn').addClass('disabled').attr('disabled',true);
		sU.find('li').length?$('#sFConfirm').removeClass('disabled').attr('disabled',false):$('#sFConfirm').addClass('disabled').attr('disabled',true);
		sU.find('li').length?$('#shareMultiBtn').removeClass('disabled').attr('disabled',false):$('#shareMultiBtn').addClass('disabled').attr('disabled',true);
	},
	checkLength:function(name){
		var fullName = name;
		if(name.length > 45){
			name = name.substring(0,45) + '<span class="elipse" title="'+fullName+'"> ...</span>';
		}
		return name;
	}
}

if (typeof myvmware == "undefined") myvmware = {}
myvmware.sdpAddUser = {
    init: function () {
        sa = myvmware.sdpAddUser;
        sa.bindEvents();
    },
    byPassPermissions: function () {
        $('#addUserMain #addUsersToFoldersContent3').hide().parents('#simplemodal-container').css({
            "width": "860px",
            "left": "202px"
        });
        $('#addUserMain #addUsersToFoldersContent6').show();
        var _pULPost = {
            'emailList': ice.inviteUser.emailLists.join(','),
            'firstNameList': ice.inviteUser.firstNameList.join(','),
            'lastNameList': ice.inviteUser.lastNameList.join(',')
        }
        vmf.ajax.post(rs.processUserListURL, _pULPost, function (invitedUserModel) {
            if (invitedUserModel != null && invitedUserModel != undefined) {
                sa.populateSummaryUI(invitedUserModel);
                ser.addUser.populateServices();
            }
        }, function () {}, function () {
            $('#addUsersToFoldersContent6').find('.loadingDiv').addClass('hidden').end().find('.body').show();
        }, null, function () {
            $('#addUsersToFoldersContent6').find('.loadingDiv').removeClass('hidden').end().find('.body').hide();
        });
    },
    populateSummaryUI: function (invitedUserModel) {
        if (typeof invitedUserModel != "object") invitedUserModel = vmf.json.txtToObj(invitedUserModel);
        $('#addUsersToFoldersContent6').find('#selectedAddUsersList, #selectedInviteUsersList').empty();
        $('#selectedAddUsersList').parent('.accountUserSection').show();
        $('#selectedInviteUsersList').parent('.accountUserSection').show();
        if (invitedUserModel.addedUserList != undefined) {
            var _addedUser = [];
            for (var i = 0; i < invitedUserModel.addedUserList.length; i++) {
                _addedUser.push('<li class="clearfix"><span class="name">' + vmf.wordwrap(invitedUserModel.addedUserList[i].firstName + ' ' + invitedUserModel.addedUserList[i].lastName, 2) + '</span> <span class="email emailremove">' + vmf.wordwrap(invitedUserModel.addedUserList[i].email, 2) + '</span></li>');
            }
            $('#addUsersToFoldersContent6 #selectedAddUsersList').append(_addedUser.join(' '));
            ice.inviteUser.sortingAscLi($('#selectedAddUsersList li'));
        }
        if (invitedUserModel.invitedUserList != undefined) {
            var _invitedUser = [],
                _emailAddr = '';
            for (var i = 0; i < invitedUserModel.invitedUserList.length; i++) {
                _emailAddr = invitedUserModel.invitedUserList[i].email.toLowerCase();
                if (ice.inviteUser.custEmailMap[_emailAddr] != undefined && ice.inviteUser.custEmailMap[_emailAddr] != null) _invitedUser.push('<li><span class="name">' + vmf.wordwrap(ice.inviteUser.custEmailMap[_emailAddr].firstName + ' ' + ice.inviteUser.custEmailMap[_emailAddr].lastName, 2) + '</span> <span class="email emailremove">' + vmf.wordwrap(_emailAddr, 2) + '</span></li>');
            }
            $('#addUsersToFoldersContent6 #selectedInviteUsersList').append(_invitedUser.join(' '));
            ice.inviteUser.sortingAscLi($('#selectedInviteUsersList li'));
        }
        if ($('#addUsersToFoldersContent6 #selectedAddUsersList li').length == 0) { // Adding exisiting users
            $('#selectedAddUsersList', $('#addUsersToFoldersContent6')).closest('.accountUserSection').hide();
            $('#addUsersToFoldersContent6').find('.devider').hide();
        } else {
            $('#selectedAddUsersList', $('#addUsersToFoldersContent6')).closest('.accountUserSection').show();
            $('#addUsersToFoldersContent6').find('.devider').show();
        }
        if ($('#addUsersToFoldersContent6 #selectedInviteUsersList li').length == 0) { // Adding new users
            $('#selectedInviteUsersList', $('#addUsersToFoldersContent6')).closest('.accountUserSection').hide();
            $('#addUsersToFoldersContent6').find('.devider').hide();
        } else {
            $('#selectedInviteUsersList', $('#addUsersToFoldersContent6')).closest('.accountUserSection').show();
            $('#addUsersToFoldersContent6').find('.devider').show();
        }
        if (typeof (invitedUserModel.error) != 'undefined' && invitedUserModel.error != '') {
            var _errorMsg = invitedUserModel.message;
            $('#addUsersToFoldersContent6').find('span.errmsg').html(_errorMsg);
        }
        ice.inviteUser.customStyle('addUsersToFoldersContent6');
    },
    confirmInviteUsers: function (data) {
        var responseData = vmf.json.txtToObj(data);
        if (responseData != null && responseData.error) {
            $('#addUsersToFoldersContent6 .error').html(ice.globalVars.errorTryAgainMsg);
        } else {
            vmf.modal.hide();
            location.reload();
        }
    },
    failureInviteUsersConfirm: function () {
        $('#addusersContent #addUsersToFoldersContent6 .error').html(ice.globalVars.ajaxRequestFailMsg);
    },
    bindEvents: function () {
		if(typeof _byService!="undefined" && _byService){
        /*$('#addUsersToFoldersContent6 #backToServiceSection').live('click', function () {
            $('#addUserMain #addUsersToFoldersContent6').hide().closest('#simplemodal-container').css({
                "width": "620px",
                "left": "322px"
            });
            $('#addUserMain #addUsersToFoldersContent3').show();
        });
		*/

        $('#addUsersToFoldersContent4 #inviteConfirm').live('click', function () {
            var requestParams, selectedUsersServiceIds = [],
                arrayOfSelectedUsers = [];
            var $services = $("#serviceList ul.sublist", $("#addUsersToFoldersContent3")),
                serObj = {}, serArr = [];
            $.each($services.find("input:checkbox:checked"), function () {
                selectedUsersServiceIds.push($(this).closest("span").attr("sCode"));
            });
			selectedPermStr=ice.inviteUser.selectedPermissions;
			totselectedUsersServiceIds = selectedUsersServiceIds.join(",");
			requestParams = 'totselectedUsersServiceIds='+totselectedUsersServiceIds+'&SelectedPermissions='+selectedPermStr;
            /*requestParams = {
                'totselectedUsersServiceIds': selectedUsersServiceIds.join(",")
            };*/
            vmf.ajax.post(rs.ConfirmInviteUrl, requestParams, sa.confirmInviteUsers, sa.failureInviteUsersConfirm);
         });
       } 
    }
}



