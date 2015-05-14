vmf.ns.use("ice");
VMFModuleLoader.loadModule("resize", function() {});
var IsLoggedInUserSUorOU = false;
var IsLoggedInUserRootAccess = false;
ice.licensefolderview = {
	IsLoggedInUserFM:null,
	refFlag: false,
	selUId:'',
	createFolderFlg:null,
	init: function() {
		//vmf.scEvent = true;
		ice.licensefolderview.showSplitters();
		//callBack.addsc({'f':'riaLinkmy','args':['users-permissions : by-folder','byfolder']});
		ice.licensefolderview.riaLink();
		IsLoggedInUserFM = null;
		$.userjsonresponse = null;
		$.regexAddFolder = /^[a-zA-Z0-9!@%&_=\.\+\-\(\)\^\#\$\s]*$/g;
		$.invalidFolderMsg = '<div class=\"textRed\">' + ice.globalVars.invalidFolderMsg + '  \! \@ \# \$ \% \^ \& \(\) \- \= \+ \. \{ space \}</div>';			
		ice.licensefolderview.bindEventsinit();
		$("#selectFolderInfoDiv").html('<ul class="icons"><li class="initmsg">'+ $staticTxtFolder +'</li></ul>');
		myvmware.common.showMessageComponent('USER_PERMISSION');
		callBack.addsc({'f':'ice.licensefolderview.showBeak','args':[]});
		ice.licensefolderview.handleFolderTree();
		ice.licensefolderview.switchState('deleteFolderConfirm',ice.licensefolderview.confirmDeleteFolder,true);
		ice.licensefolderview.switchState('confirm',ice.licensefolderview.confirmAddFolder,true);
		ice.removeUser.disableEnableLinks('applyInActive', $('#requestPermissionLink')); //  Disable request permission link
		if(location.search.indexOf("viewpermission=true") != -1) $('#tab4').trigger('click');
		
	},// End of Init,
	showBeak:function(){
		myvmware.common.setBeakPosition({beakId:myvmware.common.beaksObj["SDP_BEAK_USERPERMISSION_BYSERVICE"],beakName:"SDP_BEAK_USERPERMISSION_BYSERVICE",beakHeading:$byServiceBeakHeading,beakContent:$byServiceBeakContent,target:$("#tab6"),beakUrl:'//download3.vmware.com/microsite/myvmware/sdpcust2/index.html',beakLink:'#beak7'});
	},
	riaLink:function(){
		setTimeout(function(){
			if(typeof riaLinkmy != "undefined") {
				vmf.scEvent = false;
				s.eVar5 = "byfolder";
	        	riaLinkmy('users-permissions : by-folder');
	        }
		},3000)
	},
	showSplitters :function(){//Resizing Panes CR Start
		vmf.splitter.show('mySplitter',{resizeToWidth: true,outline:true,anchorToWindow: true,minLeft:parseInt($("#folderHolder").width()*.8,10),sizeLeft:parseInt($("#folderHolder").width(),10),maxLeft:parseInt(($("#folderHolder").width() + ($("#usersCol").width()*.2)),10),type: "v",barWidth: false,accessKey: "R"});
		vmf.splitter.show("centerRight",{resizeToWidth: true,outline:true,minRight: parseInt($("#permissionSection").width()*.8,10),maxRight: parseInt($("#permissionSection").width() +  $("#usersCol").width()*.2,10),sizeRight: parseInt($("#permissionSection").width(),10),type: "v",barWidth: false,accessKey: "C"});
	},
	bindEventsinit:function(){ // Bind events
		$('#findFolder').click(function() {
			if(!$(this).hasClass('dummyClick')){
				vmf.modal.show('findFolderContent',{focus:false});
				myvmware.common.putplaceHolder('.searchInput');
			}
		});
		$('#shareFolder').click(function() {
			var targetDetailsObj = ice.licensefolderview.getTargetDetailsObj();
			if(!$(this).hasClass('dummyClick')){ice.licensefolderview.populateShareFolder(targetDetailsObj);}
		});
		$('#shareFolderBtn').click(function() {
			var targetDetailsObj = {
				fPath :'',
				fId :'',
				fName:'',
				parentfId:'',
				custId:''
			};
			ice.licensefolderview.populateShareFolder(targetDetailsObj);
		});
		$('#inviteUserBtn').click(function() {
			var targetDetailsObj = {
				fPath :'',
				fId :'',
				fName:'',
				parentfId:'',
				custId:''
			};
			ice.licensefolderview.populateAddUserUI(targetDetailsObj);
		});
		$('#createFolder').click(function() {
			var targetDetailsObj = ice.licensefolderview.getTargetDetailsObj();
			if(!$(this).hasClass('dummyClick')){ice.licensefolderview.populateAddFolderUI(targetDetailsObj);}
		});
		$('#renameFolder').click(function() {
			var targetDetailsObj = ice.licensefolderview.getTargetDetailsObj();
			if(!$(this).hasClass('dummyClick')){
				if($('#folderId').val().length > 0){
					if($('#folderAccess').val()== 'MANAGE'){ice.licensefolderview.populateRenameFolderUI(targetDetailsObj);}
				}
			}
		});
		$('#createFolderTable #newFolderId').keypress(function(e){
			if(e.which == 13){
				$(this).addClass('waitcursor');
				$('#confirm').trigger('click');
			}
		});
		$('#renameConfirm').click(function(){ice.licensefolderview.confirmRenameFolder();});
		$('#tab2').click(function() {window.location = $renderManageAccessByUser; });
		$('#tab3').click(function() {window.location =  $renderManageAccessByContract; });
		$('#tab4').click(function() {window.location = $renderManageAccessMyPermissions; });
		$("#tab5").click(function() {window.location = $renderManageAccessMyEPP;});
		$("#tab6").click(function() {window.location = $renderManageAccessByServices;});
		$('#addusers').click(function() {	
			var targetDetailsObj = ice.licensefolderview.getTargetDetailsObj();
			if(!$(this).hasClass('dummyClick')){
				ice.licensefolderview.populateAddUserUI(targetDetailsObj);
			}
		});
		$('#btn_next,#btn_invite,#sFConfirm,#shareMultiBtn').click(function() {
			if(ice.inviteUser.selectedFolderId.length){
				ice.inviteUser.baseFolderId = ice.inviteUser.selectedFolderId[0];
			}
			if(ice.inviteUser.selectedFolderId.length && $(this).attr('id') !== 'btn_invite' && $(this).attr('id') !== 'shareMultiBtn' ){
				ice.inviteUser.processInviteUserPerm('#addUserMain #addusersContent,#addUserMain #shareFolderContent');
				ice.inviteUser.selectPermFlg = true;
			} else {
				ice.inviteUser.selectPermFlg = false;
				ice.inviteUser.customStyle('addUsersToFoldersContent3');
				$('#addUserMain #addusersContent').hide();	
				$('#addUserMain #shareFolderContent').hide();
				if(flagCheckForFolderTree == false){
					ice.inviteUser.handleFolderTree($portletNs,$resourceUrl);
					ice.inviteUser.populateFoldersUI();
				} else{
					$('#addUserMain').parents('#simplemodal-container').css({"width": "620px","left": "322px"});
					$('#addUserMain #addUsersToFoldersContent3').show();	
				}
			}
		});
		$('#addUserMain .tab').click(function() {			
			var _currentTab = $(this).attr('title');			
			if((_currentTab == 'content_8' && $('#addUserMain .removeUsersList li').find('span').text()) || (_currentTab == 'content_9' && $('#addUserMain #validatedUsers li').find('span').text())){				
				$('#btn_next').removeAttr("disabled", "disabled").removeClass('disabled').addClass('button');
			}else{		
				$('#btn_next').attr("disabled", "disabled").removeClass('button').addClass('disabled');
			}
		});
		$('#confirm_addUser').click(function() {ice.licensefolderview.confirmAddUser();});
		$('#btn_cancel7').click(function() {ice.licensefolderview.backToAddUser();});
		$('#deleteFolder').click(function() {
			var targetDetailsObj = ice.licensefolderview.getTargetDetailsObj();
			if(!$(this).hasClass('dummyClick')){
				if($('#folderId').val().length > 0){
					if($('#folderType').val() == 'ASP' || $('#folderType').val() == 'CPL' || $('#folderType').val() == 'VCE') {return false;}
					if($('#folderAccess').val()== 'MANAGE'){ice.licensefolderview.populateDeleteFolderUI(targetDetailsObj);}
				}
			}
		});
		$('#moveFolder').click(function() {	
			var targetDetailsObj = ice.licensefolderview.getTargetDetailsObj();
			if(!$(this).hasClass('dummyClick')){
			if($('#folderId').val().length > 0){
				if($('#folderType').val() == 'ASP' || $('#folderType').val() == 'CPL' || $('#folderType').val() == 'VCE') {return false;}
		if($('#folderAccess').val()== 'MANAGE'){
						$('.error').html('');
						ice.licensefolderview.populateMoveFolderUI(targetDetailsObj);		
					}
				}
			}
			});
		$('#moveFolderconfirm').click(function() {ice.licensefolderview.confirmMoveFolder();});
		$('#listFolderPath').live('change',function(){
			if($(this).val() != 'null'){
				 $('#moveFolderNext').removeAttr('disabled').removeClass('disabled');
			}else{
				$('#moveFolderNext').attr('disabled','disabled').addClass('disabled');
			}
			ice.licensefolderview.populateTargetFolder();
		});
		$('#moveFolderNext').click(function() {
			if ($("#listFolderPath").val()=="null") {
				$('.error').html($msgFolderEmpty);
				return false;
			} else {
				vmf.modal.hide();
				$('.error').html('');
				setTimeout(function(){ice.licensefolderview.populateConfirmMoveFolderUI();},20);
			}	
		});

		$('#moveFolderBack').click(function() {
			vmf.modal.hide();
			$('.error').html('');
			var confirmBtn = $('#moveFolderconfirm');
			var targetDetailsObj = {
					fPath :confirmBtn.data('fPath'),
					fId :confirmBtn.data('fId'),
					fName:confirmBtn.data('fName'),
					parentfId:confirmBtn.data('parentfId')
			};
			setTimeout(function(){ice.licensefolderview.populateMoveFolderUI(targetDetailsObj);},20);
		});
		$(".modalContent .fn_cancel").click(function(){
			vmf.modal.hide();
			$('.modalContent .button').uncorner();
			return false;
		});
		$('#copyPermissionsBtn').click(function() {
			var targetDetailsObj = {userId:$("#selectedUserId").val()};
			if(($('#folderId').val().length > 0) && (IsLoggedInUserFM) && ($("#selectedUserId").val().length > 0)) {
				if(!$('#copyPermissionsBtn').hasClass('dummyClick')){
					ice.licensefolderview.populateCopyPermissionsUI(targetDetailsObj);
				}
			}
			return false;
		});
		$('#exportToCsv').click(function() {
			var _fPerPostData = new Object();
			if($('#folderId').val() != ''){ // if the folder id is blank then we should not submit from actions menu.
				_fPerPostData['selectedFolders'] = $('#folderId').val();
				_fPerPostData['reportFor'] = 'byFolderFromActions';
				myvmware.common.generateCSVreports($exportToCsvActionUrl, _fPerPostData, "users-permissions : by-folder : actions : export-all", "users-permissions : by-folder : Export-to-CSV : Error");
			}
		});
		$('#exportAllToCsvButton').click(function() {
			var _fPerPostData = new Object();
			_fPerPostData['selectedFolders'] = 'ALL';
			_fPerPostData['reportFor'] = 'byFolderFromExportAllButton';
			myvmware.common.generateCSVreports($exportToCsvActionUrl, _fPerPostData, "users-permissions : by-folder : export-all", "users-permissions : by-folder : Export-to-CSV : Error");
		});
		$('#eaSelectorDropDown').change(function() {
			setTimeout(function(){
				$(window).trigger("resize");	
			},5000);
		});  
		
	},// Bind events method ends here
	populateShareFolder:function(targetDetailsObj){
		if($('#shareFolderContent .headerTitle #selFolder_name').length) $('#shareFolderContent .headerTitle #selFolder_name').remove();
		if(targetDetailsObj.fId){
			$('#shareFolderContent .headerTitle span').html('<span id="selFolder_name">&ldquo;<span></span>&rdquo;</span>');
		}
		ice.inviteUser.addUserStep1Flag = 'share';
		ice.licensefolderview.resetAddUserVal(targetDetailsObj);
		selectedUsersFolderIds = ice.inviteUser.selectedFolderId;
		vmf.modal.show('addUserMain', { position:['10%','20%']});
		$('#addusersContent').hide();
		$('#shareFolderContent').show();
		$('#totalUsers,#totalSelectedUsers').text(0);
		$('#preLoader').show();
		vmf.ajax.post(manageAccessByUser_action_getUserList_url,null, ice.licensefolderview.getUsers, ice.licensefolderview.failGettingUsers);
		if(typeof(riaLinkmy) == 'function'){
            riaLinkmy("users-permissions : by-folder : share-folder");
        }
	},
	resetAddUserVal: function(targetDetailsObj){
		$('#addUsersToFoldersContent4 #selectedAddUsersList').html('');// clearing the user Details in the 3rd popup of invite user 
		$('#addUsersToFoldersContent4 #selectedInviteUsersList').html('');// clearing the user Details in the 3rd popup of invite user 
		$('#addUsersToFoldersContent4 #inviteUserSelectedFolders').html(''); // clearing the user Details in the 3rd popup of invite user 
		arrayOfselectedCustomerNumber = [''];					
		emailDuplicateValidation = [''];
		emailList = ['']; 
		flagCheckForFolderTree = false;
		ice.inviteUser.flagCheckForSelectPerm = false;
		ice.inviteUser.flagCheckForSelectPerm = false;
		ice.inviteUser.selectedPermissions = [];
		ice.inviteUser.selectedFolderId = [];
		ice.inviteUser.selectedFolderName = targetDetailsObj.fName;
		(targetDetailsObj.fId)?ice.inviteUser.selectedFolderId.push(targetDetailsObj.fId):ice.inviteUser.selectedFolderId = [];
		if(ice.inviteUser.selectedFolderId.length && ice.inviteUser.selectedFolderId.length === 1){
			if(ice.inviteUser.addUserStep1Flag){
				if(ice.inviteUser.addUserStep1Flag === 'invite'){
					$('#addusersContent .headerTitle #selFolder_name span').not('.elipse').html(ice.inviteUser.checkLength(targetDetailsObj.fName));
				} else if(ice.inviteUser.addUserStep1Flag === 'share') {
					$('#shareFolderContent .headerTitle #selFolder_name span').not('.elipse').html(ice.inviteUser.checkLength(targetDetailsObj.fName));
				}
				//BUG-00052494 and BUG-00052499
        		if($('#selFolder_name span.elipse').length) 
        			myvmware.hoverContent.bindEvents($('#selFolder_name span.elipse'), 'funcleft');
			}
			
			var _selectedFolderName, _fullFolderPath;
			var $folderHT = vmf.foldertree.getFolderHashtable();
			$('#addUsersToFoldersContent4 #inviteUserSelectedFolders').html('');
			_selectedFolderName = $folderHT.get(targetDetailsObj.fId).folderName;
			_fullFolderPath = $folderHT.get(targetDetailsObj.fId).fullFolderPath;			
			$('#addUsersToFoldersContent4 #inviteUserSelectedFolders').append('<li> <span>'+ice.common.wordwrap('',_selectedFolderName,'50','<br>','true')+'</span> <span class="email">'+ice.common.wordwrap('',_fullFolderPath,'50','<br>','true')+'</span></li>');
		}
		selectedUsersFolderIds = '';
		selectedCustomerNumbersInEA = '';
	},
	getUsers:function(data){
		ice.inviteUser.userJsonResponse = vmf.json.txtToObj(data);
		ice.inviteUser.renderUsers('');
	},
	failGettingUsers:function(data){
		alert(data);
	},
	populateAddUserUI:function(targetDetailsObj){
		//$('#addusersContent #headerForAFolder').html('<h1>' + $msgFolderToAdd + '<span id="folder_name"></span></h1>');
		$('#addusersContent .headerTitle #selFolder_name').remove();
		if(targetDetailsObj.fId){
			$('#addusersContent .headerTitle').append('<span id="selFolder_name">&nbsp;to&nbsp;&ldquo;<span></span>&rdquo;&nbsp;'+ice.globalVars.folderLbl+'</span>');
		}
		ice.inviteUser.addUserStep1Flag = 'invite';
		ice.licensefolderview.resetAddUserVal(targetDetailsObj);
		selectedUsersFolderIds = ice.inviteUser.selectedFolderId;
		var folder_name = targetDetailsObj.fName;
		$('#folder_name').html('');
		$('#folder_name').append('<img src="/static/myvmware/common/css/img/folder_gray.png" height="10" width="18" alt="No" />');
		$('#folder_name').append('&nbsp;&nbsp;');
		$('#folder_name').append(folder_name);					
		vmf.modal.show('addUserMain', { position:['10%','20%']});
		ice.licensefolderview.renderAddUser(targetDetailsObj);					
		return false;
	},
	activateMoveContinueBtn: function(value,text,index){
		if(value!="null"){$('#moveFolderNext').removeAttr('disabled').removeClass('disabled');} 
		else {$('#moveFolderNext').attr('disabled','disabled').addClass('disabled');}
		ice.licensefolderview.populateTargetFolder();
	},
	getMinPermissionData: function(selectedFolder, cbState) {
		var _fPerPostData = new Object();
		_fPerPostData['selectedFolderId'] = selectedFolder;
		$.ajax({
			type: 'POST',
			url: $folderMinPermissionUrl,
			async: true,
			dataType: "json",
			data: _fPerPostData,
			success: function (folderPermission) {//Store permission in folder tree HT
				vmf.foldertree.storePermission(selectedFolder, folderPermission);
				ice.licensefolderview.folderPermToDOM(selectedFolder, cbState);
				ice.licensefolderview.populateUserPaneUI(selectedFolder, cbState);
			},
			error: function (response, errorDesc, errorThrown) {/*console.log("In error: " + errorThrown);*/},
			beforeSend: function() {},
			complete: function(jqXHR, settings) {}
		});
	},
	getRootPermissionData: function(selectedFolder) {
		var _fPerPostData = new Object();
		_fPerPostData['selectedFolderId'] = selectedFolder;
		$.ajax({
			type: 'POST',
			url: $folderMinPermissionUrl,
			async: true,
			dataType: "json",
			data: _fPerPostData,
			success: function (folderPermission) {//Store permission in folder tree HT
				IsLoggedInUserFM = folderPermission.manage;
			},
			error: function (response, errorDesc, errorThrown) {IsLoggedInUserFM = false;},
			beforeSend: function() {},
			complete: function(jqXHR, settings) {	}
		});
	},
	folderPermToDOM: function(folderId, cbState) {
		var folderHT = vmf.foldertree.getFolderHashtable();
		var folderTreeObj = vmf.foldertree.getFolderJSON();
		$("#fullFolderPath").val('');
		$("#selectedFolderName").val('');
		$("#folderId").val('');
		$("#folderAccess").val('');
		$("#parentFolderId").val('');
		$("#folderType").val('');
		if (cbState == "checked") {
			var _fullFolderPath = folderHT.get(folderId).fullFolderPath;
			var _selectedFolderName = folderHT.get(folderId).folderName;
			var folderAccess = folderHT.get(folderId).folderAccess;
			var parentFolderId = folderHT.get(folderId).parentFolderId;
			var folderType = folderHT.get(folderId).folderType;
			ice.removeUser.setLoggedInUser(folderAccess);
			$("#parentFolderId").val(parentFolderId);
			$("#fullFolderPath").val(_fullFolderPath);
			$("#selectedFolderName").val(_selectedFolderName);
			$("#folderId").val(folderId);
			$("#folderAccess").val(folderAccess);
			$("#folderType").val(folderType);
			$('#slectedUserName').html("");
			$('#userRole').html("");
			$('#userPaneSelectedUserEmail').html("");
			ice.removeUser.disableEnableLinks('applyInActive', $('#copyPermissionsBtn'));
			if(folderAccess != 'MANAGE') {				
				ice.removeUser.disableEnableLinks('applyInActive', $('.dropdown a'));	// Disable addUsers link also as per Roopa's note on defect BUG-00032538			
				ice.removeUser.disableEnableLinks('applyActive', $('#findFolder'));
				
				ice.removeUser.disableEnableLinks('applyActive', $('#exportToCsv'));  //BUG-00047200
			}
			else { 						
			var ftype = folderHT.get(folderId).folderType;
				if(ftype=='ROOT'){
					$('.dropdown li').each(function(){
						if($(this).find('a').attr('id')=='createFolder' || $(this).find('a').attr('id')=='exportToCsv'){
							ice.removeUser.disableEnableLinks('applyActive', $(this).find('a'));
						} else {
							ice.removeUser.disableEnableLinks('applyInActive', $(this).find('a'));
						}
					});
				} 
				else if(ftype=="ASP" ||ftype=="CPL" ||ftype=="VCE" ) {// if it is not ROOT folder  and type is "ASP","CPL","VCE"
					ice.removeUser.disableEnableLinks('applyInActive', $('.dropdown a'));
					ice.removeUser.disableEnableLinks('applyActive', $('#findFolder, #renameFolder, #addusers, #shareFolder'));
				}
				else {
					ice.removeUser.disableEnableLinks('applyActive', $('.dropdown a'));
					ice.removeUser.disableEnableLinks('applyInActive', $('#editPermissionLink,#requestPermissionLink'));
				}	
				ice.removeUser.disableEnableLinks('applyActive', $('#findFolder, #addusers, #shareFolder'));
			}
			$('#selectedFolderId').val(folderId);
			ice.removeUser.disableEnableLinks('applyInActive', $('#removeUserLink'));
		}
		else {
			ice.removeUser.disableEnableLinks('applyInActive', $('.dropdown a'));
			ice.removeUser.disableEnableLinks('applyActive', $('#findFolder, #addusers, #shareFolder'));
			if(ice.licensefolderview.createFolderFlg){
				$('.dropdown a#createFolder').removeClass('dummyClick').parent('li').removeClass('inactive');
			}
		}
	},
	handleFolderTree : function() {
		$('#userPermissionPane').html("");
		$("#userDetails").hide();
		$('#userDiv').html("<ul class='icons info_list'></ul>");
		$('#slectedUserName').html("");
		$('#userRole').html("");
		$('#userPaneSelectedUserEmail').html("");
		ice.removeUser.disableEnableLinks('applyInActive', $('#copyPermissionsBtn'));
		var config = new Object();
		config.uniqueDiv = $portletNs;
		config.ajaxTimeout = 240000;
		config.wrapEllipseBtn = true;
		config.npMsgContent = $folder_config_npMsgContent;
		config.npMsgFunction = function(msg) {
			ice.licensefolderview.showExceptionMessages(msg);
		};
		config.cbOnClickFunction = function(folderId, cbState) {
			if($('.'+folderId).children('span').hasClass('active')){
				$('.folderTxt').removeClass('normalWhiteSpace');
				$('.'+folderId).children('span').find('.folderTxt').addClass('normalWhiteSpace').end().find('.openClose,input,.ellipsBadge').addClass('vAlignChilds');
			} else {vAlignT
				$('.'+folderId).children('span').find('.folderTxt').removeClass('normalWhiteSpace').end().find('.openClose,input,.ellipsBadge').removeClass('vAlignChilds');
			}
			(cbState == "checked")?selectedUsersFolderIds=folderId:selectedUsersFolderIds='';
			ice.licensefolderview.folderTreeCBClick(folderId, cbState);
		};
		config.validateJSONFunction = function(folderListJSON) { 
			//Changes for BUG-00045966 to display the spreadsheet view.
		    if(folderListJSON.folderContents && folderListJSON.folderContents[0].folderAccess == "VIEW") 
		            $('#spreadsheetView1').show(); 
     			 else 
				    $('#spreadsheetView1').hide();
			if(folderListJSON.error){
				ice.licensefolderview.showExceptionMessages(folderListJSON.message);
			}
		};
		config.errorFunction = function(response, errorDesc, errorThrown) { 
			ice.licensefolderview.showExceptionMessages(response.responseText);
		};
		config.cbOnFolderNodeCreate = function(folderElement,folderIds) { 
			if(folderElement.find('li span').hasClass('disabled')){ 
				folderElement.append('<a class="tooltip" title="'+manageAccessTooltipMessage+'" data-tooltip-position="bottom" href="#">'+ice.globalVars.helpTextLbl+'</a>'); 
				} 
				myvmware.hoverContent.bindEvents($('a.tooltip'), 'defaultfunc'); 
				};
		config.loadComplete = function () {//Start of Context Menu CR Code
			var map = [
				{id: 'add_user',text: ice.globalVars.inviteNewUserLbl,liCls: 'inactive',callBk: ice.licensefolderview.populateAddUserUI},
				{id: 'share_folder',text: ice.globalVars.shareFolderLbl,liCls: 'inactive',callBk: ice.licensefolderview.populateShareFolder},
				{id: 'create_folder',text: ice.globalVars.createFolderLbl,liCls: 'inactive',	callBk: ice.licensefolderview.populateAddFolderUI},
				{id: 'delete_folder',text: ice.globalVars.deleteFolderLbl,liCls: 'inactive',	callBk: ice.licensefolderview.populateDeleteFolderUI	},
				{id: 'rename_folder',text: ice.globalVars.renameFolderLbl,liCls: 'inactive',	callBk: ice.licensefolderview.populateRenameFolderUI	},
				{id: 'move_folder',text: ice.globalVars.moveFolderLbl,liCls: 'inactive',callBk: ice.licensefolderview.populateMoveFolderUI}, 
				{id: 'request_access',text: ice.globalVars.requestPermLbl,liCls: 'active',callBk: ice.requestAccessPermissions.populateEditPermissionUI},
				{id: 'con_exportToCSV',text: ice.globalVars.exportToCsvLbl,liCls: 'inactive',	callBk: ice.licensefolderview.exportToCSV}
			];
			vmf.cmenu.show({
				data: map,
				targetElem: 'folderPane',
				contextMenuFlag: true,
				actionBtnFlg: true,
				funcName: 'cursorPosition',
				cmenuId: 'folderMenu',
				menuChgState: function (target, cmenuId, disableMnu) {
					var cmenu = $('#' + cmenuId),fManage= $(target).closest('li').data('fManage');
						cmenu.find('a').addClass(disableMnu).parent('li').addClass('inactive');
						if(!fManage){
							ice.licensefolderview.checkFolderPermissions(target);
						}
						if($(target).closest('li').data('fManage')){
							ice.licensefolderview.setContextMenuState(target,cmenu,disableMnu);
						}
						cmenu.find('a#request_access').removeClass(disableMnu).parent('li').removeClass('inactive');
						
						//on right click if the folder has View permissions then we need enable the export to csv.
						var className = $(target).closest('span').parent('span').attr('class');
						if(className && className.indexOf('disabled') == -1){
							cmenu.find('a#con_exportToCSV').removeClass(disableMnu).parent('li').removeClass('inactive');
						}
				},
				getTargetDetails: function (target) {
					var folderId = $(target).closest('li').data('folderId'),
						folderHT = vmf.foldertree.getFolderHashtable(),
						fullFolderPath = folderHT.get(folderId).fullFolderPath,
						folderName = folderHT.get(folderId).folderName,
						parentfId = folderHT.get(folderId).parentFolderId,
						targetDetailsObj = {
							fPath: fullFolderPath,
							fId: folderId,
							fName: folderName,
							parentfId: parentfId,
							custId:$('#loggedCustomer').text()
						};
					return targetDetailsObj;
				},
				getTargetNode: function (targetElem) {
					return $('#' + targetElem).find('li>span');
				},
				getTarget: function(target,targetCls,actBtnCls){
					var tabCont = $('.tabContent');
					tabCont.find('.'+targetCls).removeClass(targetCls).end().find('.'+actBtnCls).hide().removeClass(actBtnCls);
					return $(target);
				}
			});
			ice.licensefolderview.setCreateFolderPerm();
			myvmware.common.adjustFolderNode(false);
			setTimeout("ice.licensefolderview.adjustTabBtns()",3000);
		};//End of Context Menu CR Code
		config.inputType = 'radio';
		config.loadingClass = 'loading';
		config.expandSelect = false;		
		$("#fullFolderPath").val('');
		$("#selectedFolderName").val('');
		$("#folderId").val('');
		$("#folderAccess").val('');
		ice.removeUser.disableEnableLinks('applyInActive', $('.dropdown a'));
		ice.removeUser.disableEnableLinks('applyActive', $('#findFolder, #addusers, #shareFolder'));
		$('.helpLink').css({'right':'0px','top':'17px'});
		IsLoggedInUserRootAccess = false; // Variable will be assigned in the folder tree
		vmf.foldertree.build($resourceUrl,config);
		IsLoggedInUserFM = null;
		//ice.licensefolderview.adjustHt();
	},
	folderTreeCBClick : function(folderId, cbState) {
		if (cbState == "checked") {
			
			ice.licensefolderview.getMinPermissionData(folderId, cbState);
		}
	},
	populateUserPaneUI : function (folderId){
		if(IsLoggedInUserFM == null){
			var rootolderId = $('#folderPane ul:eq(0) li:eq(0)').attr('class').split(' ')[0];
			ice.licensefolderview.getRootPermissionData(rootolderId);
		}
		var dataUrl = $folderSelectionUrl + '&selectedFolderId=' + folderId;
		$('#selectFolderInfoDiv').hide();
		$('#userDiv ul.icons').html('<li>'+ $userPane_staticText +'</li>');
		$('#userPermissionPane').html("");
		$('#slectedUserName').html("");
		$('#userRole').html("");
		ice.removeUser.disableEnableLinks('applyInActive', $('#copyPermissionsBtn'));		
		vmf.ajax.post(dataUrl,null, ice.licensefolderview.onSuccess_loadUsers, ice.licensefolderview.onFail_loadUsers);
	},
	onSuccess_loadUsers : function(data) {
		$('#userPermissionPane').html("");
		$('#userDiv ul.icons').html('');
		if(data.error){
			ice.licensefolderview.showExceptionMessages(message);
			return;
		}
		var strHTML;
		$.userjsonresponse = vmf.json.txtToObj(data);
		if($.userjsonresponse.userPaneContents.length >0){
			$('#userPermissionPane').html('<ul class="icons" id="userSelectionInfoDiv" style="display:none"><li class="initmsg">'+$statTxtPermission+'</li></ul>');
			$('#userSelectionInfoDiv').show();
		}
		for(var i=0;i<$.userjsonresponse.userPaneContents.length;i++){
			// set the super user are procurement user or both
			// if not super user and procurement user and if has Manage Folders & User" permission
			// set to mange folder
			var _userRole='';
			var _roleIconAttr = '';
			var htm="";
			var getFId = $('#selectedFolderId').val();
			if($.userjsonresponse.userPaneContents[i].superPermission && $.userjsonresponse.userPaneContents[i].procPermission && $.userjsonresponse.userPaneContents[i].folderAdmin && $('li.'+getFId).attr('level') != 0){
				_userRole='spa';
				htm='<a href="#" class="hreftitle" title="'+$staticTextforSUPUA+'" alt="'+$staticTextforSUPUA+'">'+$staticTextforSUPUA+'</a>';
			}else if($.userjsonresponse.userPaneContents[i].superPermission && $.userjsonresponse.userPaneContents[i].procPermission){
				_userRole='sp';
				htm='<a href="#" class="hreftitle" title="'+$staticTextforSUPC+'" alt="'+$staticTextforSUPC+'">'+$staticTextforSUPC+'</a>';
			}else if($.userjsonresponse.userPaneContents[i].superPermission && $.userjsonresponse.userPaneContents[i].folderAdmin && $('li.'+getFId).attr('level') != 0){
				_userRole='sa';
				htm='<a href="#" class="hreftitle" title="'+$staticTextforSUA+'" alt="'+$staticTextforSUA+'">'+$staticTextforSUA+'</a>';
			}else if($.userjsonresponse.userPaneContents[i].procPermission && $.userjsonresponse.userPaneContents[i].folderAdmin && $('li.'+getFId).attr('level') != 0){
				_userRole='pa';
				htm='<a href="#" class="hreftitle" title="'+$staticTextforPUA+'" alt="'+$staticTextforPUA+'">'+$staticTextforPUA+'</a>';
			}else if($.userjsonresponse.userPaneContents[i].folderAdmin && $('li.'+getFId).attr('level') != 0){
				_userRole='ad';
				htm='<a href="#" class="hreftitle" title="'+$staticTextforA+'" alt="'+$staticTextforA+'">'+$staticTextforA+'</a>';
			}else if($.userjsonresponse.userPaneContents[i].superPermission){
				_userRole='s';
				htm='<a href="#" class="hreftitle" title="'+$staticTextforSU+'" alt="'+$staticTextforSU+'">'+$staticTextforSU+'</a>';
			}else if($.userjsonresponse.userPaneContents[i].procPermission){
				if(_userRole==''){
					_userRole='p';
					htm='<a href="#" class="hreftitle" title="'+$staticTextforPC+'" alt="'+$staticTextforPC+'">'+$staticTextforPC+'</a>';
				}else{
					_userRole='sp';
					htm='<a href="#" class="hreftitle" title="'+$staticTextforSUPC+'" alt="'+$staticTextforSUPC+'">'+$staticTextforSUPC+'</a>';
				}
			}
			if($.userjsonresponse.userPaneContents[i].managePermission && _userRole==''){
				_userRole = 'm';
			}
			if(_userRole != 'm'){
				_roleIconClass = 'class="'+_userRole+'"';
				_roleIconAttr = 'cRole="'+_userRole+'"';
			}
			else
			{
				_roleIconClass = 'class="fm"'; //Added "fm" by Tapas to know folder manager. Check this bug(BUG-00032115 307179)
				_roleIconAttr = 'cRole="fm"';
			}
			if(_userRole == ""){
				_roleIconClass = 'class="without_icon"';
			}
			$('#userDiv ul.icons').append($('<li id=\"'+$.userjsonresponse.userPaneContents[i].cN+'\" '+_roleIconClass+' val=\"'+$.userjsonresponse.userPaneContents[i].cN+'\" '+_roleIconAttr+'><label for=\"radio1\" class=\"userLabel\">'+ htm +' '+ $.userjsonresponse.userPaneContents[i].firstName + ' '+$.userjsonresponse.userPaneContents[i].lastName +'</label></li>').data({"email":$.userjsonresponse.userPaneContents[i].email}));						
		}
		if(ice.licensefolderview.refFlag){
			$('ul.info_list').find('li#'+ice.licensefolderview.selUId).addClass('active');
			ice.licensefolderview.populatePermissionUI(ice.licensefolderview.selUId,true);
			ice.licensefolderview.refFlag = false;
		}
		/*Start of context menu CR code*/
		var map = [
			{id: 'remove_user',text: ice.globalVars.removeUserLbl,liCls: 'inactive',callBk: ice.removeUser.populateRemoveUserPane},
			{id: 'cpy_perm',	text: ice.globalVars.copyPermissionsLbl,liCls: 'inactive',callBk: ice.licensefolderview.populateCopyPermissionsUI}
			//{id: 'request_perm',text: 'Request Permission',liCls: 'inactive',callBk: ice.requestAccessPermissions.populateEditPermissionUI}
		];
		vmf.cmenu.show({
			data: map,
			targetElem: 'userDiv',
			contextMenuFlag: true,
			actionBtnFlg: true,
			funcName: 'cursorPosition',
			cmenuId: 'userMenu',
			menuChgState: function (target, cmenuId, disableMnu) {
				var cmenu = $('#'+cmenuId);
				cmenu.find('a').addClass(disableMnu).parent('li').addClass('inactive');
				if(!$(target).closest('li').data('permLen')){ice.licensefolderview.checkUserPerm(target);}
				if($(target).closest('li').data('permLen')){ice.licensefolderview.setUserMenuState(target,cmenu,disableMnu);}
			},
			getTargetDetails: function (target) {
				var targetDetailsObj = {
					userId: $(target).closest('li').attr('id'),
					userDetails:{"selUserName":$(target).closest('li').text(),"email":$(target).closest('li').data('email')},
					fId: $('#selectedFolderId').val(),
					fName: $('#selectedFolderName').val(),
					fPath:$('#fullFolderPath').val(),
					custId:$(target).closest('li').attr('id')
				};
				return targetDetailsObj;
			},
			getTargetNode: function (targetElem) {
				return $('#' + targetElem).find('li');
			},
			getTarget: function(target,targetCls,actBtnCls){
				var tabCont = $('.tabContent');
				tabCont.find('.'+targetCls).removeClass(targetCls).end().find('.'+actBtnCls).hide().removeClass(actBtnCls);
				return $(target).closest('li');
			}
		});
		/*End of context menu CR code*/
		ice.licensefolderview.bindEvents();
	},
		checkUserPerm:function(target){
			var userId=$(target).closest('li').attr('id');
			var url = $userSelectionUrl + '&selectedFolderId=' + $('#selectedFolderId').val() +'&selectedCustomerNumber='+userId;
			vmf.ajax.post(url,null,ice.licensefolderview.onSuccess_getUserPerm(target), ice.licensefolderview.onFail_userPerm,null,null,null,false);
		},
		onSuccess_getUserPerm:function(target){
			return function(data){
				var jsonResponse = (typeof data!="object")?vmf.json.txtToObj(data):data;
				var _cnt = 0, _selectedUserInherited = false, _isSet = jsonResponse.permissionPaneContents[4].isSet, _permissionLen = jsonResponse.permissionPaneContents.length;	
				//changes for BUG-00065244
				var _isLoggedInUserCanEdit = jsonResponse.permissionPaneContents[4].isLoggedInUserCanEdit;
				//end changes
				if(typeof(jsonResponse)=='undefined' || !jsonResponse)			
					cmenu.find('a#remove_user').addClass(disableMnu).parent('li').addClass('inactive');
				else {
					for(var i=0;i<jsonResponse.permissionPaneContents.length ;i++){
						if(jsonResponse.permissionPaneContents[i].isInherited==false)
							_cnt = _cnt+1;	
						if(jsonResponse.permissionPaneContents[i].isInherited == true)
						  _selectedUserInherited = true;
					}
					//changes for BUG-00065244
						$(target).closest('li').data({inherit:_selectedUserInherited,isSet:_isSet,permLen:_permissionLen,count:_cnt,isLoggedInUserCanEdit:_isLoggedInUserCanEdit});
					//end changes
				}
			}
		},
		onFail_userPerm:function(){},//error
		setUserMenuState:function(target,cmenu,disableMnu){
			var _suorpu = $(target).closest('li').is('.s, .p, .sp'),
				permDetails = $(target).closest('li').data(),
				_inherited=permDetails.inherit,
				_isSet=permDetails.isSet,
				_permLen=permDetails.permLen,
				_cnt=permDetails.count, //changes for BUG-00065244
				_isLoggedInUserCanEdit = permDetails.isLoggedInUserCanEdit;
			/*Remove User change state*/
			if(IsLoggedInUserSUorOU && (!_suorpu) && _inherited == false){
				cmenu.find('a#remove_user').removeClass(disableMnu).parent('li').removeClass('inactive');
			}else if(( _isSet == true && loggedInUserFolderAccess == 'MANAGE' && !_isLoggedInUserCanEdit) || _inherited == true || ( _permLen >_cnt ) || ( loggedInUserFolderAccess!='MANAGE' )){
				cmenu.find('a#remove_user').addClass(disableMnu).parent('li').addClass('inactive');
			}else{
				cmenu.find('a#remove_user').removeClass(disableMnu).parent('li').removeClass('inactive');
			}
			/*Copy permissions change state*/
			(IsLoggedInUserFM)?cmenu.find('a#cpy_perm').removeClass(disableMnu).parent('li').removeClass('inactive'):cmenu.find('a#cpy_perm').addClass(disableMnu).parent('li').addClass('inactive');
			if($('#userDiv ul.icons li').length == 1 && _suorpu){
				cmenu.find('a#cpy_perm').addClass(disableMnu).parent('li').addClass('inactive');
			}
			/*Request Permissions CR -9915 Changes*/
			var selectedUserId = $(target).closest('li').attr('id');
			if(selectedUserId == $('#loggedCustomer').text()){
				cmenu.find('a#request_perm').removeClass(disableMnu).parent('li').removeClass('inactive');
			} else {
				cmenu.find('a#request_perm').addClass(disableMnu).parent('li').addClass('inactive');
			}
		},
		onFail_loadUsers : function(data){
			$('#userDiv ul.icons').html('');
			ice.licensefolderview.showExceptionMessages(ice.globalVars.failedLoadingUserMsg);
		},
	populateCopyPermissionsUI : function(targetDetailsObj){ 
		var selectedUserId = targetDetailsObj.userId;
		var copyPermissionUrl = $manageAccessCopyPermissionsUrl + '&selectedUserId=' + selectedUserId;
		window.location.href = copyPermissionUrl;
	},
	onSuccess_copyPermission : function(data){
		$("#manageAccess").html('');
		$("#manageAccess").append(data);
		$('.possibleCopyPermissionUsersList li input').change(function(){
			$('#copyPerm_next').removeAttr("disabled");  
			var $this = $(this),
			inputName,
			inputEmail,
			liClass = $this.parent().attr('class');//find class name;
			//If checked, create users data
			if($this.is(':checked')) {			
				inputName = $this.parent().find('label').html();//find name
				inputEmail = $this.parent().find('span').html();//find email
				inputId = $this.parent().find('input').val();
				customerId = $('#custNumber').val();
				if(customerId!='')
				{
					customerId = customerId+','+inputId;
				}
				else
				{
					customerId = inputId;
				}
				$('#custNumber').attr('value',customerId);		
				//insert new element into the right side (find the UL & .append(object);
				//$this.parent('li').hide();
				$('ul.copyPermissionRemoveUsersList').append('<li class="' + liClass + '" id="'+inputId+'"> <a class="remove" href="#">'+ice.globalVars.removeLbl+'</a><span class="name">' + inputName + '</span> <span class="email emailremove">' + inputEmail + '</span> </li>');					
				var getCount = $('ul.copyPermissionRemoveUsersList li').size();
				if(getCount != 0){
						$('span.fn_selectedUsers').html(getCount);
						$('#copyPerm_next').removeClass('secondary');
						$('#copyPerm_next').removeAttr("disabled");
					}else{
						$('span.fn_selectedUsers').html('0');
						$('#copyPerm_next').addClass('secondary');
						$('#copyPerm_next').attr('disabled','disabled');
					}
				$('ul.copyPermissionRemoveUsersList .remove').click(function() {
					var $this = $(this),liClass;
					liClass = $this.parent().attr('class'); //Get the class from the li
					liId = $this.parent().attr('id');
					var cusNumber = $('#custNumber').val();
					cusNumber = cusNumber.split(',');
					for(i=0;i<cusNumber.length;i++)
					{
						cusNumber.splice(i,1);
					}
					$('#custNumber').attr('value',cusNumber);
					$this.parent().remove();
					//$('ul.possibleCopyPermissionUsersList .'+liClass).show();
					$('ul.possibleCopyPermissionUsersList li').find('input#'+liId).attr('checked', false);
					var getCount_new = $('ul.copyPermissionRemoveUsersList li').size();
					if(getCount_new != 0){
						$('span.fn_selectedUsers').html(getCount_new);
						$('#copyPerm_next').removeClass('secondary');
						$('#copyPerm_next').removeAttr("disabled");
					}else{
						$('span.fn_selectedUsers').html('0');
						$('#copyPerm_next').addClass('secondary');
						$('#copyPerm_next').attr('disabled','disabled');
					}		
					return false;
				});
			}
			else{
					var getCount_new = $('ul.copyPermissionRemoveUsersList li').size();
					getCount_new = getCount_new-1;
					if(getCount_new != 0){
						$('span.fn_selectedUsers').html(getCount_new);
						$('#copyPerm_next').removeClass('secondary');
						$('#copyPerm_next').removeAttr("disabled");
					}else{
						$('span.fn_selectedUsers').html('0');
						$('#copyPerm_next').addClass('secondary');
						$('#copyPerm_next').attr('disabled','disabled');
					}
				inputId = $this.parent().find('input').val();
				//Look to the right side for the class name and .remove();
				$('ul.copyPermissionRemoveUsersList li#'+inputId).remove();
			}
			//_updateSelectedUsers();
		});
	},
	loadPermissions : function(selectedUserId,folderId,refreshFlag){
		ice.licensefolderview.refFlag = true;
		ice.licensefolderview.selUId = selectedUserId;
		ice.licensefolderview.getMinPermissionData(folderId, 'checked');
	},
	populatePermissionUI : function(selectedUserId,refreshFlag){
		if(!refreshFlag){refreshFlag='FALSE';}
		$("#selectedUserId").val(selectedUserId);
		var slectedFolderId = $('#selectedFolderId').val();
		var folderHT = vmf.foldertree.getFolderHashtable();
		var folderAccess=folderHT.get(slectedFolderId).folderAccess;
		var permissionDataUrl = $userSelectionUrl + '&selectedFolderId=' + slectedFolderId +'&selectedCustomerNumber='+selectedUserId+'&refreshFlag='+refreshFlag;
		$('#userSelectionInfoDiv').hide();
		ice.removeUser.disableEnableLinks('applyActive', $('#copyPermissionsBtn'));	
		for(var i=0;i<$.userjsonresponse.userPaneContents.length;i++){
			if(selectedUserId == $.userjsonresponse.userPaneContents[i].cN){
				var userName= $.userjsonresponse.userPaneContents[i].firstName + " "+ $.userjsonresponse.userPaneContents[i].lastName;
				var userEmail = 'mailto:'+$.userjsonresponse.userPaneContents[i].email;
				var managePer ='';
				
				if($.userjsonresponse.userPaneContents[i].folderAdmin && $('li.'+slectedFolderId).attr('level') != 0){managePer = ' ' + ice.globalVars.adminstrationLbl;}
				if($.userjsonresponse.userPaneContents[i].procPermission){managePer = (managePer=='')?' ' + ice.globalVars.procurementContactLbl :' ' + ice.globalVars.procurementContactLbl + ',' + managePer;}
				if($.userjsonresponse.userPaneContents[i].superPermission){managePer = (managePer=='')?ice.globalVars.superUserLbl: ice.globalVars.superUserLbl + ',' + managePer;}				
				(IsLoggedInUserFM)?ice.removeUser.disableEnableLinks('applyActive', $('#copyPermissionsBtn')):ice.removeUser.disableEnableLinks('applyInActive', $('#copyPermissionsBtn'));
				var emailContent = '<a href="'+userEmail+'">'+$.userjsonresponse.userPaneContents[i].email+'</a>';
				$('#slectedUserName').html(userName);
				$('#userRole').html(managePer);
				$('#userPaneSelectedUserEmail').html(emailContent);
				if(ice.licensefolderview.selUId){ice.licensefolderview.selUId = '';}
				$("#userDetails").show();
			}
		}
		$('#selectedFolderUserPane ul').find('li').each(function(){
			if($(this).is('.s, .p, .sp')){ice.removeUser.disableEnableLinks('applyInActive', $('#copyPermissionsBtn'));}
		});
		$('#userPermissionPane').html('<ul><li>' + $permissionPane_loading_staticText +'</li></ul>');
		vmf.ajax.post(permissionDataUrl,null,ice.licensefolderview.onSuccess_loadPermissions, ice.licensefolderview.onFail_loadPermissions);
	},
	onFail_loadPermissions : function(data){
		$('#userPermissionPane').html('<ul><li></li></ul>');
		ice.licensefolderview.showExceptionMessages(ice.globalVars.failedPermDetailMsg);
	},
	onSuccess_loadPermissions : function (data) {
		var slectedFolderId = $('#selectedFolderId').val();
		$('#userPermissionPane').html('<ul><li></li></ul>');
		if(data.error){
			ice.licensefolderview.showExceptionMessages(message);
			return;
		}
		var folderjsonresponse = vmf.json.txtToObj(data);
		if(!folderjsonresponse){
			$('#userPermissionPane').html('<ul><li class="staticmsg">' + $permissionPane_nodata +'</li></ul>');
			ice.removeUser.disableEnableLinks('applyInActive', $('#editPermissionLink, #removeUserLink, #requestPermissionLink'));	
			return;
		}
	ice.removeUser.checkUserPermission(folderjsonresponse);
		var strHTML = '<table class="scrollTable" style="display:none">';
		strHTML += '<tbody class="scrollContent">';
		for(var i=0;i<folderjsonresponse.permissionPaneContents.length ;i++){
			if(folderjsonresponse.permissionPaneContents[i].permissionName != null && folderjsonresponse.permissionPaneContents[i].category == 'GLOBAL'){
				var permissionCode = folderjsonresponse.permissionPaneContents[i].permissionCode;
				var status = folderjsonresponse.permissionPaneContents[i].isSet;
				strHTML += '<tr id='+permissionCode+' checkStatus='+status+'>';
				if(folderjsonresponse.permissionPaneContents[i].level==1){
					strHTML += '<td class="col1 pad_left">'+folderjsonresponse.permissionPaneContents[i].permissionName+'</td>';
				} else {
					strHTML += '<td class="col1">'+folderjsonresponse.permissionPaneContents[i].permissionName+'</td>';
				}
				if(folderjsonresponse.permissionPaneContents[i].isSet){
					strHTML += '<td class="col2"><img src="/static/myvmware/common/img/dot.png" alt="'+ $staticTextfortick +'" title="'+ $staticTextfortick +'" />';
				}else{
					strHTML += '<td class="col2"><img src="/static/myvmware/common/img/cross.png" alt="'+ $staticTextforcross +'" title="'+ $staticTextforcross +'" />';
				}
				//padlock folderjsonresponse.permissionPaneContents[i].isInherited ||
				if(!folderjsonresponse.permissionPaneContents[i].isLoggedInUserCanEdit){
						strHTML += '&nbsp;<img src="/static/myvmware/common/img/lock.png" height="16" width="14" alt="'+ $staticTextforLock +'" title="'+ $staticTextforLock +'" />';
				}
				strHTML +='</td>';
				
				strHTML += '</tr>';
			}
		}
		for(var i=0;i<folderjsonresponse.permissionPaneContents.length ;i++){
			if(folderjsonresponse.permissionPaneContents[i].permissionName != null && folderjsonresponse.permissionPaneContents[i].category == 'FOLDER'){
				var permissionCode = folderjsonresponse.permissionPaneContents[i].permissionCode;
				var status = folderjsonresponse.permissionPaneContents[i].isSet;
				strHTML += '<tr id='+permissionCode+' checkStatus='+status+'>';
				if(folderjsonresponse.permissionPaneContents[i].level==1){
					strHTML += '<td class="col1 pad_left">'+folderjsonresponse.permissionPaneContents[i].permissionName+'</td>';
				} else {
					strHTML += '<td class="col1">'+folderjsonresponse.permissionPaneContents[i].permissionName+'</td>';
				}
				if(folderjsonresponse.permissionPaneContents[i].isSet){
					strHTML += '<td class="col2"><img src="/static/myvmware/common/img/dot.png" height="17" width="17" alt="'+ $staticTextfortick +'" title="'+ $staticTextfortick +'" />';
				}else{
					strHTML += '<td class="col2"><img src="/static/myvmware/common/img/cross.png" height="17" width="16" alt="'+ $staticTextforcross +'" title="'+ $staticTextforcross +'" />';
				}
				//padlock folderjsonresponse.permissionPaneContents[i].isInherited ||
				if(!folderjsonresponse.permissionPaneContents[i].isLoggedInUserCanEdit){
						strHTML += '&nbsp;<img src="/static/myvmware/common/img/lock.png" height="16" width="14" alt="'+ $staticTextforLock +'" title="'+ $staticTextforLock +'" />';
					}
					strHTML +='</td>';
				strHTML += '</tr>';
			}
		}
		strHTML += '</tbody>';
		strHTML += '</table>';
		$('#userPermissionPane').html(strHTML);
		$("table.scrollTable", $('#userPermissionPane')).slideDown('fast'); //BUG-00047983 fix - removed function(){myvmware.common.adjustHeightAllSections('#userPermissionPane')}
		ice.manageAcess.checkPermissionRule();
		if($('#folderPane').find('ul:eq(0) li span:eq(0)').hasClass('active')){ice.manageAcess.chekRootFolderPermission();}
		
		//check if selected user role is already assigned otherwise assign the role
		var _selUser = $('#selectedFolderUserPane ul').find('li.active');
		var _selUserRole = _selUser.attr('class').split(' ');
		if(_selUserRole == "") { //Assign role from permission list since role is not assigned
			for(var i=0;i<folderjsonresponse.permissionPaneContents;i++) {
				if(folderjsonresponse.permissionPaneContents[i].permissionCode == "PERMISSION02") {
					if(folderjsonresponse.permissionPaneContents[i].isSet) {
						//If permission02 is set for selected user
						_selUser.addClass('m');
					}
					break;
				}
			}
		}
		var loogedUserRole  = "n";
		$('#selectedFolderUserPane ul').find('li').each(function(){
			var customerId = $(this).attr('id');
			if(customerId == $('#loggedCustomer').text()){
				var roleClass = $(this).attr('class').split(' ');
				var roleIcon = roleClass[0]; //Get role
				if(roleIcon != "" && roleIcon != "active"){
					loogedUserRole = roleIcon;
				}
			}
		});
		if(loogedUserRole == 'n') { //Still role for logged in user is not found
			var _selectedFID = $('#folderId').val();
			var _folderHT = vmf.foldertree.getFolderHashtable();
			if(_folderHT.get(_selectedFID).folderAccess == 'MANAGE') {loogedUserRole = 'm';}
		}
		if(!IsLoggedInUserFM){ice.removeUser.disableEnableLinks('applyInActive', $('#copyPermissionsBtn'));}
		else{
			$('#selectedFolderUserPane ul').find('li').each(function(){
				if($(this).is('.active')){ice.removeUser.disableEnableLinks('applyActive', $('#copyPermissionsBtn'));}
			});	
		}
		if($('#userDiv ul.icons li').length == 1){ice.removeUser.disableEnableLinks('applyInActive', $('#copyPermissionsBtn'));}
		if(!IsLoggedInUserFM){ice.removeUser.disableEnableLinks('applyInActive', $('#copyPermissionsBtn'));}
		else{$('#selectedFolderUserPane ul').find('li').each(function(){if($(this).is('.active')){ice.removeUser.disableEnableLinks('applyActive', $('#copyPermissionsBtn'));}});}
		if($('#userDiv ul.icons li').length == 1){ice.removeUser.disableEnableLinks('applyInActive', $('#copyPermissionsBtn'));}
		$('.indent30').css({'text-indent': '30px'});
		//VSUS change - : User with Administer Account (Manage Roles) at Home or Level1 folder should be able to edit permission to assign roles		
		if (folderjsonresponse.manageRolesPermission && $('li.'+slectedFolderId).attr('level') == 1 && !($('#loggedCustomer').text() == $("#selectedUserId").val())){			
			ice.removeUser.disableEnableLinks('applyActive', $('#editPermissionLink'));
		}
		if($('#loggedCustomer').text() ==  $("#selectedUserId").val()){ice.removeUser.disableEnableLinks('applyActive', $('#requestPermissionLink'));}
		else{ice.removeUser.disableEnableLinks('applyInActive', $('#requestPermissionLink'));}
	},//END of onSuccess_loadPermissions
	showExceptionMessages : function(message){ },
	populateAddFolderUI  : function(targetDetailsObj) { 
		$('.error').html('');
		riaLinkmy('users-permissions : by-folder : create-folder');
		var _foldersContentDataUrl = $loggedInUserFoldersWithManagepermissionUrl;
		var _folderPathHTML = new Array();
		var _currentfolderPath = targetDetailsObj.fPath;
		var _parentFolderId = targetDetailsObj.parentfId;
		$.post(_foldersContentDataUrl, function(data){
			var foldersContentJsonResponse = vmf.json.txtToObj(data);
				_folderPathHTML.push("<select id='listFolderPathCreate' class='wide'><option value=\"null\">"+ice.globalVars.selectOneLbl+"</option>");
				$.each(foldersContentJsonResponse.folderPathList, function(){
					_folderPathHTML.push("<option value='"+this.folderId+"'>"+this.fullFolderPath+"</option>");
				});
				_folderPathHTML.push("</select>");
				$("#fullFolderPathListCreate").html(_folderPathHTML.join(' '));
				$('#listFolderPathCreate option').each(function(){
					if($(this).val() === targetDetailsObj.fId){
						$(this).attr('selected','selected');
						$('#confirm').removeAttr('disabled').removeClass('disabled');
					}
				});
				$(".overlayOpts").remove();
				vmf.dropdown.build($("select#listFolderPathCreate"), {optionsDisplayNum:20,optionMaxLength:37,inputMaxLength:37,position:"left",optionsClass:'overlayOpts',onSelect:ice.licensefolderview.activateSaveBtn,optionsHolderInline:true});
		});
		$('#confirm').data({fPath:targetDetailsObj.fPath,fId:targetDetailsObj.fId,fName:targetDetailsObj.fName});
		vmf.modal.show("createFolderContent");
	},
	activateSaveBtn: function(value,text,index){
		if(value!="null"){
			$('#confirm').removeAttr('disabled').removeClass('disabled');
		} else {
			$('#confirm').attr('disabled','disabled').addClass('disabled');
		}
	},
	populateDeleteFolderUI : function(targetDetailsObj) { 
		ice.common.wordwrap('deleteFolderLocation', '\\\\'+targetDetailsObj.fPath,'50','</br>','true');		
		$('.error').html('');
		$('#deleteFolderConfirm').data({fPath:targetDetailsObj.fPath,fId:targetDetailsObj.fId,fName:targetDetailsObj.fName});
		vmf.modal.show("deleteFolderContent");
		if(typeof(riaLinkmy) == 'function'){
            riaLinkmy("users-permissions : by-folder : delete-folder");
        }
	},
	populateRenameFolderUI : function(targetDetailsObj) { 
		ice.common.wordwrap('existingFolderName', '\\\\'+targetDetailsObj.fPath,'50','</br>','true');
		$('.error').html('');
		myvmware.common.putplaceHolder('#renameFolderId');
		riaLinkmy('users-permissions : by-folder : rename-folder');
		$('#renameConfirm').data({fPath:targetDetailsObj.fPath,fId:targetDetailsObj.fId});
		vmf.modal.show("renameFolderContent");
	},
	exportToCSV:function(){// context menu click
		//var folders  = (flag)?$._selectedFolders.keys():obj.fId;
		var _fPerPostData = new Object();
		_fPerPostData['selectedFolders'] = targetDetailsObj.fId;
		_fPerPostData['reportFor'] = 'byFolderFromContextMenu';
		myvmware.common.generateCSVreports($exportToCsvActionUrl, _fPerPostData, "users-permissions : by-folder : contextmenu : export-all", "users-permissions : by-folder : Export-to-CSV : Error");
		//myvmware.common.generateReports($exportToCsvActionUrl + '&reportFor=byFolderFromContextMenu&folderId=' + targetDetailsObj.fId);
	},
	confirmAddFolder : function(){ 
		var _newfolderName = $("#newFolderId").val();
		var _folderid = $("#listFolderPathCreate option:selected").val();
		var duplicate = vmf.foldertree.duplicateFolder(_folderid, _newfolderName);
		if(_newfolderName.length > 0){
			if(duplicate) {	
				$('.error').html(ice.globalVars.dupFolderName);
				ice.licensefolderview.switchState('confirm',ice.licensefolderview.confirmAddFolder,true);
			} 
			else if(!(_newfolderName.match($.regexAddFolder))) {
				$('.error').html($.invalidFolderMsg);
				ice.licensefolderview.switchState('confirm',ice.licensefolderview.confirmAddFolder,true);
			}
			else {
				ice.licensefolderview.switchState('confirm',ice.licensefolderview.confirmAddFolder,false);
				var _fullFolderPath = $('#confirm').data('fPath');
				var addFolderUrl = $myPermissionAddFolderUrl;
				var _postData = new Object();
				_postData['selectedFolderId'] = _folderid;
				_postData['newFolderName'] = _newfolderName;
				$.ajax({type: 'POST',url: addFolderUrl,data: _postData,success: function (data) {
						ice.licensefolderview.onSuccess_createFolder(data);
					},
					error: function (response, errorDesc, errorThrown) {ice.licensefolderview.onFail_createFolder(errorThrown);}
				});
			}
		} else {$('.error').html($msgEnterFolderName);}
	},
	confirmDeleteFolder : function(){ 
		ice.licensefolderview.switchState('deleteFolderConfirm',ice.licensefolderview.confirmDeleteFolder,false);
		_folderid = $('#deleteFolderConfirm').data('fId');
		_fullFolderPath = $('#deleteFolderConfirm').data('fPath');
		$("#deleteFolderName").data($('#deleteFolderConfirm').data('fName'));
		var deleteFolderUrl = $myPermissionDeleteFolderUrl + '&selectedFolderId=' + _folderid;
			vmf.ajax.post(deleteFolderUrl,
					null, 
					ice.licensefolderview.onSuccess_deleteFolder, 
					ice.licensefolderview.onFail_deleteFolder);
	},
	onSuccess_deleteFolder : function(data) {
		var errorMessage = vmf.json.txtToObj(data);
		if(errorMessage!=null && errorMessage.error){
			vmf.modal.hide();
			ice.licensefolderview.switchState('deleteFolderConfirm',ice.licensefolderview.confirmDeleteFolder,true);
			$("#deleteFolderName").html($("#deleteFolderConfirm").data('fName'));
			$("#deleteFolderNameTwo").html($("#deleteFolderConfirm").data('fName'));
			$('#error').html(errorMessage.message);// BUG-00019110
			ice.licensefolderview.showDeleteFailureContent(data);					
		}
		else{
				vmf.modal.hide();
				location.reload();
		}
		if(typeof(riaLinkmy) == 'function'){
            riaLinkmy("users-permissions : by-folder : delete-folder : confirm");
        }
	},
	showDeleteFailureContent: function (data) {setTimeout(function(){vmf.modal.show("deleteFolderFailureContent");},20);},
	onFail_deleteFolder : function(data) {
		ice.licensefolderview.switchState('deleteFolderConfirm',ice.licensefolderview.confirmDeleteFolder,true);
		ice.licensefolderview.displayError('deleteFolderTable',$msgUnknownError);
	},
	confirmRenameFolder : function(){ 
		var _newfolderName = $("#renameFolderId").val();
		var _folderid = $('#renameConfirm').data('fId');
		var duplicate = vmf.foldertree.duplicateFolder(_folderid, _newfolderName);

		if((_newfolderName.length > 0) && (_newfolderName != ice.globalVars.folderName)){
			if(duplicate) {	
				$('.error').html(ice.globalVars.duplicateFolderMsg);
			} 
			else if(!(_newfolderName.match($.regexAddFolder))) {
				$('.error').html($.invalidFolderMsg);
			}
			else {
				$('#confirm').attr('disabled',true).addClass('secondary');//BUG-00021672
				var _fullFolderPath = $('#renameConfirm').data('fPath');
				var _postData = new Object();
				_postData['selectedFolderId'] = _folderid;
				_postData['newFolderName'] = _newfolderName;
				$.ajax({
					type: 'POST',
					url: $myPermissionRenameFolderUrl,
					data: _postData,
					success: function (data) {						
						ice.licensefolderview.onSuccess_renameFolder(data);
					},
					error: function (response, errorDesc, errorThrown) {
						console.log("In error: " + errorThrown);
						ice.licensefolderview.onFail_renameFolder(errorThrown);
					}
				});
			}
		} else {
			$('.error').html($msgEnterFolderName);
		}
	},
	onSuccess_createFolder : function(data){
		var errorMessage = vmf.json.txtToObj(data);
		if(errorMessage!=null && errorMessage.error){
			//$('#confirm').attr('disabled',false).removeClass('secondary');//BUG-00021672
			ice.licensefolderview.switchState('confirm',ice.licensefolderview.confirmAddFolder,true);
			$('.error').html(errorMessage.message); // BUG-00019110
			return;
		}else{vmf.modal.hide();location.reload();}
	},
	onFail_createFolder : function(data) {
		ice.licensefolderview.switchState('confirm',ice.licensefolderview.confirmAddFolder,true);
		$('#createFolderTable #newFolderId').removeClass('waitcursor');
		$('.error').html($msgUnknownError);		
	},
	onSuccess_renameFolder : function(data){
		var errorMessage = vmf.json.txtToObj(data);
		if(errorMessage!=null && errorMessage.error){
			$('#renameConfirm').attr('disabled',false).removeClass('secondary');//BUG-00021672
			$('.error').html(errorMessage.message); // BUG-00019110
			return;
		}
		else {vmf.modal.hide();location.reload();}
	},
        onFail_renameFolder : function(data){
                $('#renameConfirm').attr('disabled',false).removeClass('secondary');//BUG-00021672
		$('.error').html($msgUnknownError);
	},
	//Add User to Folder Scripts //Add User
	renderAddUser : function(targetDetailsObj){	
		var _folderid = targetDetailsObj.fId;
		var addUserUrl = $manageAccessAddUserUrl + '&selectedFolderId=' + _folderid;
		vmf.ajax.post(addUserUrl, null, ice.licensefolderview.get_success, ice.licensefolderview.get_failure);
	},
	get_success : function(event) {
		var user_list="",list_item="";
		$('#addusersContent #content_8 .loading').hide();
		$('#addusersContent #accountUserPane').show();
		$('#eaNumber').html('');				
		$.userjsonresponse_1 = vmf.json.txtToObj(event);
		user_list = ($.userjsonresponse_1) ? $.userjsonresponse_1.userList : "";
		$('#populate_list .possibleUsersList').html('');
		$('#eaNumber').html(($.userjsonresponse_1)?$.userjsonresponse_1.eaNumber:" ");
		for(var i=0;i<user_list.length;i++){
			$('#populate_list .possibleUsersList').append('<li class="fn_userID_'+(i+1)+'">'+'<input id="checkbox'+(i+1)+'" name="checkbox" value='+user_list[i].customerNumber+' type="checkbox"/>'+'<label for="checkbox'+(i+1)+'">'+user_list[i].firstName+' '+user_list[i].lastName+'</label>'+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="email indent15">'+user_list[i].email+'</span></li>');		
		};
		$('.possibleUsersList li input').click(function(){
			$('#btn_next').removeAttr("disabled").removeClass('disabled').addClass('button');
			var $this = $(this),
			inputName,
			inputEmail,
			liClass = $this.parent().attr('class');//find class name;
			//If checked, create users data
			if($this.is(':checked')) {			
				inputName = $this.parent().find('label').html();//find name
				inputEmail = $this.parent().find('span').html();//find email																		
				//insert new element into the right side (find the UL & .append(object);
				$this.parent('li').hide();
				var prevClass = "";
				var flag = true;
				$('ul.removeUsersList').find('li').each(function(){					
					var liClassSplit = liClass.split("fn_userID_");
					var prevClassSplit = $(this).attr('class').split("fn_userID_");
					var curClass = $(this).attr('class');
					var curId = parseInt(liClassSplit[1]);
					var prevId = parseInt(prevClassSplit[1]);
					if(curId < prevId && flag)	{ 
						if(prevClass == "")	{
							$('<li class="' + liClass + '"> <a class="remove" href="#">Remove</a><span class="name">' + inputName + '</span> <span class="email emailremove">' + inputEmail + '</span> </li>').insertBefore($('ul.removeUsersList li.'+curClass));									
							$('#addUserMain #validatedUsers').append('<li class="' + liClass + '"> <a class="remove" href="#">Remove</a><span class="name">' + inputName + '</span> <span class="email emailremove">' + inputEmail + '</span> </li>');
							$('#addUsersToFoldersContent4 #selectedAddUsersList').append('<tr class='+liClass+'><td>'+inputName+'</td><td class="label">'+inputEmail+'</td></tr>');		 // invite user's 3rd popup for adding account user							
						}
						else	{
							$('<li class="' + liClass + '"> <a class="remove" href="#">Remove</a><span class="name">' + inputName + '</span> <span class="email emailremove">' + inputEmail + '</span> </li>').insertAfter($('ul.removeUsersList li.'+prevClass));
							$('#addUserMain #validatedUsers').append('<li class="' + liClass + '"> <a class="remove" href="#">Remove</a><span class="name">' + inputName + '</span> <span class="email emailremove">' + inputEmail + '</span> </li>');
							$('#addUsersToFoldersContent4 #selectedAddUsersList').append('<tr class='+liClass+'><td>'+inputName+'</td><td class="label">'+inputEmail+'</td></tr>');		 // invite user's 3rd popup for adding account user							
						}
						flag = false;
					}
					prevClass = $(this).attr('class');
				});
				if(flag){
					$('ul.removeUsersList').append('<li class="' + liClass + '"> <a class="remove" href="#">Remove</a><span class="name">' + inputName + '</span> <span class="email emailremove">' + inputEmail + '</span> </li>');																										
					$('#addUserMain #validatedUsers').append('<li class="' + liClass + '"> <a class="remove" href="#">Remove</a><span class="name">' + inputName + '</span> <span class="email emailremove">' + inputEmail + '</span> </li>');
					$('#addUsersToFoldersContent4 #selectedAddUsersList').append('<tr class='+liClass+'><td>'+inputName+'</td><td class="label">'+inputEmail+'</td></tr>');		 // invite user's 3rd popup for adding account user							
				}
				var getCount = $('ul.removeUsersList li').size();
				ice.inviteUser.selectedUsers(); // total selected users
				ice.inviteUser.sortingAscLi();
				if(getCount != 0){
						$('span.numberSelected').html(getCount);
					}else{
						$('span.numberSelected').html('0');
					}
				$('ul.removeUsersList .remove').click(function() {
					var $this = $(this),liClass;
					liClass = $this.parent().attr('class'); //Get the class from the li
					$this.parent().remove();
					//invite user								
					$('#addUsersToFoldersContent4 #selectedAddUsersList .'+liClass).remove();
					$('#addUserMain #validatedUsers .'+liClass).remove();							
					ice.inviteUser.selectedUsers(); // total selected users							
					// end for invite user
					$('ul.possibleUsersList .'+liClass).show();
					$('ul.possibleUsersList .'+liClass).find('input').attr('checked', false);
					var getCount_new = $('ul.removeUsersList li').size();
					if(getCount_new != 0){
						$('span.numberSelected').html(getCount_new);								
					}else{
						$('span.numberSelected').html('0');																
						$('#btn_next').attr("disabled", "disabled").removeClass('button').addClass('disabled');
					}								
					return false;
				});						
			}
			else{
				$('#custNumber').val('');
				//Look to the right side for the class name and .remove();
				$('ul.removeUsersList .'+liClass).remove();						
				var getCount_new = $('ul.removeUsersList li').size();
				if(getCount_new != 0){
					$('span.numberSelected').html(getCount_new);
				}else{
					$('span.numberSelected').html('0');
				}							
			}
		});
	},
	get_failure : function(statusError,msgtext) {
		vmf.modal.hide();
		if(msgtext=="parsererror") {	
			vmf.modal.show("parsererror");
		} else {
			vmf.modal.show("systemexception");
		}
	},
	confirmUser : function() {
		$('#fldr_name').html('');
		$('#row').html('');				
		var displayUserDetails = '<table><tbody>';								
		var displayname = '';
		var displayemail='';
		var arrayOfSelectedUsers = new Array(); 
		$(".possibleUsersList input:checkbox[name=checkbox]:checked").each(function() {arrayOfSelectedUsers.push($(this).val());});				
		if(arrayOfSelectedUsers.length > 0){$('#custNumber').val(arrayOfSelectedUsers);}
		$(".possibleUsersList input:checkbox[name=checkbox]:checked").each(function() {
				var getParent = $(this).parent('li');
			displayUserDetails+='<tr>';
			displayUserDetails+='<td>';
			displayUserDetails += $(getParent).children('label').text();
			displayUserDetails+='</td>';
			displayUserDetails+='<td>';
			displayUserDetails += $(getParent).children('span').text();
			displayUserDetails+='</td>';
			displayUserDetails+='</tr>';
		});
		displayUserDetails+='</tbody></table>';
		$('#row').append(displayUserDetails);
		$('#fldr_name').append('<img src="/static/myvmware/common/css/img/folder_gray.png" height="10" width="18" alt="No" />');
		$('#fldr_name').append(' ');
		$('#fldr_name').append($('#folder_name').text());
		vmf.modal.hide();
		$("#confirmAddUserToFolderContent #row").css({"height":"150px","overflow-y":"auto"});
		setTimeout(function(){vmf.modal.show('confirmAddUserToFolderContent');},20);// to show the second popup from the first popup
	},
	backToAddUser : function() {vmf.modal.hide();},
        confirmAddUser : function() {
		var custNumber = $('#custNumber').val();
		var folderId = $('#folderId').val(); 
		var url= $manageAccessAddUserToFolderUrl + '&selectedFolderId=' + folderId +'&customerNumbers=' +custNumber;
		vmf.ajax.post (url, null, ice.licensefolderview.success_move, ice.licensefolderview.failure_move);
	},
	success_move : function(event){
		vmf.modal.hide();
		location.reload();
	},
	failure_move : function(statusError,msgtext) {
		vmf.modal.hide();
		if(msgtext=="parsererror") {vmf.modal.show("parsererror");} 
		else {vmf.modal.show("systemexception");}
	},
	//End Add User to Folder
	//start of MoveFolder	
	populateMoveFolderUI : function(targetDetailsObj) {
		$("#moveFolderName").html('');
		$('.error_tr').hide();
		ice.common.wordwrap('moveFolderName', targetDetailsObj.fName,'50','</br>','true');
		var foldersContentDataUrl = $loggedInUserFoldersWithManagepermissionUrl;
		var folderPathHTML = new Array();
		var currentfolderPath = targetDetailsObj.fPath;
		var parentFolderId = targetDetailsObj.parentfId;
		$.post(foldersContentDataUrl, function(data){
				var foldersContentJsonResponse = vmf.json.txtToObj(data);
				folderPathHTML.push("<select id='listFolderPath' class='wide'><option value=\"null\">"+ice.globalVars.selectOneLbl+"</option>");
				$.each(foldersContentJsonResponse.folderPathList, function(){
					if(this.folderId!=parentFolderId && this.fullFolderPath.indexOf(currentfolderPath)<0)
					folderPathHTML.push("<option value='"+this.fullFolderPath+"'>"+this.fullFolderPath+"</option>");
				});
				folderPathHTML.push("</select>");
				$("#fullFolderPathList").html(folderPathHTML.join(' '));
				$(".overlayOpts").remove();
				vmf.dropdown.build($("select#listFolderPath"), {optionsDisplayNum:20,ellipsisSelectText:false,ellipsisText:'',optionMaxLength:37,inputMaxLength:37,position:"left",onSelect:ice.licensefolderview.activateMoveContinueBtn,optionsClass:'overlayOpts',optionsHolderInline:true});
		});	
		$('#moveFolderconfirm').data({fPath:targetDetailsObj.fPath,fId:targetDetailsObj.fId,fName:targetDetailsObj.fName,parentfId:targetDetailsObj.parentfId});
		vmf.modal.show("moveFolderContent");
		if(typeof(riaLinkmy) == 'function'){
            riaLinkmy("users-permissions : by-folder : move-folder");
        }
	},
	populateTargetFolder : function() {	$("#targetFolderLocation").html(vmf.wordwrap($("#listFolderPath option:selected").text(),2));},
	populateConfirmMoveFolderUI : function() {
		$("#sourceFolderName").html('');
		$("#sourceFolderName").append($("#selectedFolderName").val());			
		vmf.modal.show("confirmMoveFolderContent");
	},
	confirmMoveFolder : function() {
		$('#moveFolderconfirm').attr('disabled',true).addClass('waitcursor');//BUG-00021672
		var selectedFolderID = $('#moveFolderconfirm').data('fId');
		var selectedFolderName = $('#moveFolderconfirm').data('fName');
		var targetFullFolderPath = $("#targetFolderLocation").text();			
		var folderReadTime = $("#folderCacheTimestamp").val();
		var moveFolderUrl = $myPermissionMoveFolderUrl;
		var _postData = new Object(); 
		_postData['selectedFolderId'] = selectedFolderID; 
		_postData['targetFullFolderPath'] = targetFullFolderPath; 
		_postData['folderReadTime'] = folderReadTime; 
		vmf.ajax.post(moveFolderUrl,
		_postData, 
		ice.licensefolderview.onSuccess_moveFolder, 
		ice.licensefolderview.onFail_moveFolder);	
	},
	onSuccess_moveFolder : function(data) {
		var errorMessage = vmf.json.txtToObj(data);
		if (errorMessage!= null && errorMessage.error) {
				 $('#moveFolderconfirm').attr('disabled',false).removeClass('waitcursor');//BUG-00021672
			if (errorMessage.message != null) {
				$('.error_tr').show();
				$('.error').html(errorMessage.message);
			} else {
				$('.error_tr').show();
				$('.error').html($msgMoveFolderError);
			} 
		} else {
			vmf.modal.hide();
			location.reload();
		  }
		if(typeof(riaLinkmy) == 'function'){
            riaLinkmy("users-permissions : by-folder : move-folder : confirm");
        }
	},
	onFail_moveFolder : function(data) {
		$('#moveFolderconfirm').attr('disabled',false).removeClass('waitcursor');//BUG-00021672
		$('.error').html($msgMoveFolderUnknownError);
	},
	bindEvents: function(){
		ice.filterUser.adjustUserList();
		$('ul.info_list li').live('mouseover mouseout click',function(e){
			e.preventDefault();
			if(e.type=='mouseover'){
				$(this).addClass('hover');
			} else if(e.type=='mouseout'){
				$(this).removeClass('hover');
			} else {
				if($(this).hasClass('active')){
					return;
				}
				$(this).parents('ul.info_list').find('li').removeClass('active').find('label').removeClass('normalWhiteSpace');
				$(this).addClass('active').find('label').addClass('normalWhiteSpace');
				javascript:ice.licensefolderview.populatePermissionUI($(this).attr('id'));
			}
		});
	},
	switchState: function(id,func,flag){
		if (flag){
			$("#"+id).bind('click', func).css('cursor','pointer');
		} else {
			$("#"+id).unbind('click', func).css('cursor','wait');
		}
	},
	displayError: function(tableId, errorMsg){
		if($('.error', $("#"+tableId)).length) $('.error', $("#"+tableId)).html(errorMsg);
		else $("#"+tableId+" tbody").prepend('<tr><td class="error textRed" colspan="2" style="color:red">'+errorMsg+'</td></tr>');
	},
	getTargetDetailsObj:function(){
		var targetDetailsObj = {
					fPath :$('#fullFolderPath').val(),
					fId :$('#folderId').val(),
					fName:$('#selectedFolderName').val(),
					parentfId:$('#parentFolderId').val(),
					custId:$('#selectedUserId').val()
		};
		return targetDetailsObj;
	},
	checkFolderPermissions: function(target){
		var _fPerPostData = new Object(),
			folderId = $(target).closest('li').data('folderId');
			_fPerPostData['selectedFolders'] = folderId;
			vmf.ajax.post($folderMinPermissionUrl,_fPerPostData,ice.licensefolderview.onsuccess_getPerm(target),ice.licensefolderview.onfailure_getPerm,null,null,null,false);
	},
	onsuccess_getPerm: function(target){
		return function(folderPermission){
			var json=(typeof folderPermission!="object")?vmf.json.txtToObj(folderPermission):folderPermission;
			$(target).closest('li').data({fManage:json.manage});
		}
	},
	onfailure_getPerm: function(){},
	setContextMenuState:function(target,cmenu,disableMnu){
		var ftype = $(target).closest('li').data('ftype');
		if (ftype == 'ROOT') {
			cmenu.find('li').each(function () {
				if ($(this).find('a').attr('id') == 'create_folder' || $(this).find('a').attr('id') == 'con_exportToCSV') {
					$(this).find('a').removeClass(disableMnu);
					$(this).removeClass('inactive');
				} else {
					$(this).find('a').addClass(disableMnu);
				}
			});
		} else if (ftype == "ASP" || ftype == "CPL" || ftype == "VCE") { // if it is not ROOT folder  and type is "ASP","CPL","VCE"
			cmenu.find('a').addClass(disableMnu); // On first load, the disable class is not assigned
			cmenu.find('a#rename_folder,a#add_user,a#share_folder').removeClass(disableMnu).parent('li').removeClass('inactive');
			$('#folderPane input[type=checkbox]').closest('span').removeClass('hover');
		} else { //if it is not ROOT folder  and  not "ASP","CPL","VCE"
			cmenu.find('a').removeClass(disableMnu).parent('li').removeClass('inactive');
		}
		cmenu.find('a#add_user,a#share_folder').removeClass(disableMnu).parent('li').removeClass('inactive');
	},
	setCreateFolderPerm:function(){
		if(ice.licensefolderview.createFolderFlg == null){
			vmf.ajax.post($loggedInUserFoldersWithManagepermissionUrl,null,function(data){
				var json=(typeof data!="object")?vmf.json.txtToObj(data):data;
				if(json.folderPathList.length){
					$('#shareFolderBtn,#inviteUserBtn').show();

					//myvmware.common.showMessageComponent('USER_PERMISSION');
					myvmware.common.setBeakPosition({
						  beakId: myvmware.common.beaksObj["BEAK_USERPERMISSION_PAGE_FOR_SHARE_FOLDER"]
						, beakName: "BEAK_USERPERMISSION_PAGE_FOR_SHARE_FOLDER"
						, beakNewText: ice.inviteUser.beakNewTextLbl
						, beakHeading: ice.inviteUser.shareFolderLbl
						, beakContent: ice.globalVars.shareFolderBeakMsg
						, target: $('#shareFolderBtn')
						, multiple: true
					});

					$('.dropdown').find('a#createFolder').removeClass('dummyClick').parent('li').removeClass('inactive');
					ice.licensefolderview.createFolderFlg = true;
				} else {
					$('#shareFolderBtn,#inviteUserBtn').hide();
					$('.dropdown').find('a#createFolder').addClass('dummyClick').parent('li').addClass('inactive');
					ice.licensefolderview.createFolderFlg = false;
				}
			},function(){/*error*/});
		} else if (ice.licensefolderview.createFolderFlg) {
			$('.dropdown').find('a#createFolder').removeClass('dummyClick').parent('li').removeClass('inactive');
		}
	},//End of New Methods Added for Right Click CR
    //End of Move folder
	permissionPaneHt: function() {
		var permHt = $('#permissionSection').outerHeight(true) - ($('#userDetails').outerHeight(true) + $('#userDetails').next('header').outerHeight(true));
		$('#userPermissionPane').css({'height':permHt,'overflow-y':'auto'});
	},
	adjustHt: function(e){// adjusting height of the panes (licenses , users  & permissions and Account Summary pages 
		var cHeight = ($("#content-section").height() > parseInt($("#content-section").css("min-height")))? parseInt($("#content-section").css("min-height")) : $("#content-section").height();
		var folderHeight = $("section.column .scroll").height()+(cHeight-$("#manageAccess").height());
		folderHeight = (folderHeight>428)? folderHeight: 428;
		$("#mySplitter").height(folderHeight+$("section.column header").height()+"px");
		$("section.splitter-pane").height(folderHeight+$("section.splitter-pane header").outerHeight()+"px");
		$("section.column .scroll,.splitter-bar").height(folderHeight+"px");
		ice.filterUser.adjustUserList();
		ice.licensefolderview.permissionPaneHt();
		myvmware.common.adjustFolderNode(true);
	},
	adjustTabBtns: function(){
		var listWidth = 0;
		var listItemWidth = 0;
		
		if ($(".ie7").length > 0) {
			
			var listItemBtnWidth = 0;
			$('ul.tabs li.btn_csv button').map(function(){
			    if($(this).is(':visible')){
			    	listItemBtnWidth = listItemBtnWidth + $(this).outerWidth(true);
			    }
			}).get();
			
			listItemBtnWidth = listItemBtnWidth + 2;

			$("#tabbed_box_1").find("li.btn_csv").width(listItemBtnWidth+"px");

		}
		
		$('ul.tabs li').map(function(){
		    listItemWidth = listItemWidth + $(this).outerWidth(true);
		}).get();
		
		listWidth = $("#tabbed_box_1").find("ul.tabs").width();
		
		if (listWidth < listItemWidth + 20){
			$("#tabbed_box_1").css({"margin-top":"50px"}).find("li.btn_csv").css({"position":"absolute", "top":"-35px", "right":"0px"});
		} 
		else{
			$("#tabbed_box_1").css({"margin-top":"15px"}).find("li.btn_csv").css({"position":"", "top":"", "right":""}); 
		}
	}
};
function adjustHtForIE7_specific(){
	ice.filterUser.adjustUserList();
	ice.licensefolderview.permissionPaneHt();
	myvmware.common.adjustFolderNode(true);
	ice.licensefolderview.adjustTabBtns();
}

//window.onresize = ice.licensefolderview.adjustHt;
window.onresize = function(){
	ice.licensefolderview.adjustHt();
	ice.licensefolderview.adjustTabBtns();
};
