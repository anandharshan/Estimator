vmf.ns.use("ice");
ice.requestAccessPermissions={
		
	loadPermissionUrl:null,
	submitReqPermissionUrl:null,
	loadLicenseFolderViewUrl: null,
	loggedUserInfoUrl : null,
	loggedUserPermissionMap : null,
	editPermssionToolTipMsg : null,
	enableFlag : null,
	permissionPaneEventObject : null,
	isFolderAdmin : null,
	isConfirmbtn: false,
	rptaval: null,
	targetDetails: null,
	init:function(arg1, arg2, arg3, arg4, editPermssionToolTipMsgText){		
		editPermssionToolTipMsg = editPermssionToolTipMsgText;
		enableFlag = false;
		targetDetails = {};
		//Edit Permission
		loadPermissionUrl = arg1;
		$('ul li a#requestPermissionLink').live('click', function(){
			var targetDetailsObj = {
						fPath :$('#fullFolderPath').val(),
						fId :$('#folderId').val(),
						fName:$('#selectedFolderName').val(),
						parentfId:$('#parentFolderId').val(),
						custId:($('#selectedUserId').val())?$('#selectedUserId').val():$('#loggedCustomer').text()
			};
			if(!$(this).hasClass("dummyClick") && targetDetailsObj.fId.length > 0){
					ice.requestAccessPermissions.populateEditPermissionUI(targetDetailsObj);
			}
		});
		//Save permission
		
		submitReqPermissionUrl = arg2;
		loadLicenseFolderViewUrl = arg3;
		$('#submitRequestPermission').click(function(){
			$(this).removeClass('primary').attr('disabled', true).addClass('disabled');
			ice.requestAccessPermissions.editPermissions();
			if (ice.requestAccessPermissions.isConfirmbtn==false && typeof(riaLinkmy) == "function"){
				riaLinkmy("users-permissions : my-permissions : request-permission : confirm");
			}
		});
		//Logged in user info
		loggedUserInfoUrl = arg4;
		vmf.ajax.post(loggedUserInfoUrl, null, ice.requestAccessPermissions.onSuccessLoggedUserInfo, ice.requestAccessPermissions.onFailLoggedUserInfo);
		//Close edit permission window
		$('#btn_cancelrequestacces').click(function(){
			vmf.modal.hide("requestpermissionpopup");
		});
	},
	populateEditPermissionUI: function(targetDetailsObj){
	
		vmf.scEvent = true;
		if($.trim($('#tabbed_box_1').find('.active').attr('title')) == 'By Folder')
			riaLinkmy('users-permissions : by-folder : request-permission');
		else if($.trim($('#tabbed_box_1').find('.active').attr('title')) == 'By User')
			riaLinkmy('users-permissions : by-user : request-permission');
		else if($.trim($('#tabbed_box_1').find('.active').attr('title')) == 'My Permissions')
			riaLinkmy('users-permissions : my-permissions : request-permission');
		else 
			riaLinkmy('my-licenses : request-permission');
			
		ice.requestAccessPermissions.isConfirmbtn = false;
		vmf.modal.show('requestpermissionpopup', { 
					checkPosition: true,
					onShow: function (dialog) {	
						$('button#submitRequestPermission').attr('disabled','disabled').addClass('disabled');
						$('input#reqperm_chkbox').unbind('click').bind('click', function(){
							ice.requestAccessPermissions.populatePermChkBox($('input#reqperm_chkbox'));
							if($(this).attr('checked')){
								$('button#submitRequestPermission').removeAttr('disabled','disabled').removeClass('disabled');
							} else {
								$('button#submitRequestPermission').attr('disabled','disabled').addClass('disabled');
							}
						})				
					},
					onClose: function (dialog) {
						if($('body').find('div.tooltip_flyout').length){$('body').find('div.tooltip_flyout').remove();}
						$.modal.close();
					}
			});
		//Call to get selected user permission for selected folder //BUG-00024711
		var _loggedPermissionUrl = $userSelectionUrl+ '&selectedFolderId=' + targetDetailsObj.fId +'&selectedCustomerNumber='+targetDetailsObj.custId + '&loggedInUserDataForEditPermissions=';
		enableFlag = false;
		ice.requestAccessPermissions.targetDetails  = {};
		ice.requestAccessPermissions.targetDetails = targetDetailsObj;
		vmf.ajax.post(_loggedPermissionUrl, null, ice.requestAccessPermissions.onSuccessGetPermissionList, ice.requestAccessPermissions.onFailGetPermissionList);
	},
	populatePermChkBox: function(chklm){ // get checkbox selected except one
		if(chklm.is(':checked')){
			var ttip = '<a href="#" class="dumyLock tooltip" data-tooltip-position="bottom" title="'+editPermssionToolTipMsg+'">'+ice.globalVars.helpTextLbl+'</a>';
			$('#requestPermissionDiv #tbl_edit').find('tbody#savemsg_id').hide();
			$('#requestPermissionDiv #tbl_edit').find('tbody#perm_tbody').show();
			$('#requestPermissionDiv #tbl_edit').find('input:checkbox').not('input#PERMISSION07').attr('checked', 'checked');
			$('#requestPermissionDiv #tbl_edit').find('input:checkbox').not('input#PERMISSION07').each(function(){
				$(this).attr('checked', 'checked');$(this).attr('disabled', 'disabled');
			});
		}else{			
			if (!ice.requestAccessPermissions.isFolderAdmin){
				ice.requestAccessPermissions.rptaval = $('#requestaccesstxtarea').val();
				$('div#requestPermissionDiv').html('');
				ice.requestAccessPermissions.onSuccessGetPermissionList(ice.requestAccessPermissions.permissionPaneEventObject);
			} else {
				$('#requestPermissionDiv #tbl_edit').find('tbody#perm_tbody').hide();
				var msgHtm = '';
				msgHtm += "<tbody id=\"savemsg_id\"><tr><td colspan=\"2\"><p><b>"+ice.globalVars.requestRemoveAdminMsg+"</b></p></td></tr></tbody>";
				$('#requestPermissionDiv #tbl_edit').append(msgHtm);
				$('#requestPermissionDiv #tbl_edit').find('input:checkbox').not('input#PERMISSION07').attr('checked', '');
				$('#requestPermissionDiv #tbl_edit').find('input:checkbox').not('input#PERMISSION07').attr('disabled',false).parents('td').removeClass('lock');
				$('#adminReqRoleSelected').val("N");
				$('#requestPermissionDiv #tbl_edit').find('input:checkbox').not('input#PERMISSION07').each(function(){
					$(this).attr('checked', '');$(this).attr('disabled', false);
				})
			}
			
		}
	},
	getLicenseKeyFolderName: function(){ // return folder name which is selected
		return $('#folderPane ul').find('li>span.active').text();
	},
	onSuccessGetPermissionList: function(event){
			var jsonPermissionRes = vmf.json.txtToObj(event);
		
			if(jsonPermissionRes.permissionPaneContents.length > 0){
				loggedUserPermissionMap = {};
				for(var i=0; i < jsonPermissionRes.permissionPaneContents.length ;i++){
					loggedUserPermissionMap[jsonPermissionRes.permissionPaneContents[i].permissionCode] = jsonPermissionRes.permissionPaneContents[i].isSet;
					if(jsonPermissionRes.permissionPaneContents[i].permissionCode == "PERMISSION02"){
						if(!jsonPermissionRes.permissionPaneContents[i].isSet){
							if(enableFlag)
							{
								ice.requestAccessPermissions.disableEditPermissionLink();
							}
						}
					}
				}
			}
			ice.requestAccessPermissions.permissionPaneEventObject = event;
			var targetConfig = ice.requestAccessPermissions.targetDetails;
			
			if(jsonPermissionRes == null){
				$('div#loadingRequestPermission').hide();
				$('div#showRequestPermission').html(ice.globalVars.noPermissionExistMsg);
				$('div#showRequestPermission').show();
				return false;
			}
			
			var getFoldername = targetConfig.fName;
			$('span#spanfolderID').attr('title',getFoldername).text(getFoldername);
			ice.requestAccessPermissions.truncateAndShowEllipsis($('span#spanfolderID'),60);
			var permissionHTML = '<table id="tbl_edit"  class="withborders incHeight"><thead><tr><th class="bdrLt1px">'+ice.globalVars.permissionLbl+'</th>';
				permissionHTML += '</tr></thead><tbody id="perm_tbody">';
				permissionHTML += '</tbody></table>';//FR-WI-USR-505, //FR-WI-USR-506
			$('div#requestPermissionDiv').html(permissionHTML);
			var custmerRole = "";			
			var selectdCustomerId = $('#selectedFolderUserPane ul li').filter('.active').attr('val'); 
			$('#selectedCustomerId').val(selectdCustomerId);			
			$('#selectedFolderUserPane ul').find('li').each(function(){
				var roleClass = $(this).attr('class').split(' ');
				var roleIcon = "";
				if(roleClass.length > 0){
					roleIcon = roleClass[0]; //Get role
					if(selectdCustomerId && selectdCustomerId == $('#loggedCustomer').text()){
						if(roleIcon != 'active'){
							custmerRole = roleIcon; //Logged in user role
						}else{
							custmerRole = "n"; //Normal user reference, Logged in user is a normal user
						}
					}
					
				}
			});
			if(!(jsonPermissionRes.permissionPaneContents.length > 0)){
				jsonPermissionRes = custResponse;
			}
			if(jsonPermissionRes.permissionPaneContents.length > 0){
				var globRow = '';
				var foldRow = '';
				for(var i=0; i < jsonPermissionRes.permissionPaneContents.length ;i++){
					
					if(jsonPermissionRes.permissionPaneContents[i].permissionName != null){
						var permissioRow = '<tr>';
						var permissionCode = jsonPermissionRes.permissionPaneContents[i].permissionCode;
						//var chkbox = '';
						if(jsonPermissionRes.permissionPaneContents[i].isSet){
							var chkbox = '<input type="checkbox" checked="checked" id='+permissionCode+' class="right_marginonezero">';
						}else{
							var chkbox = '<input type="checkbox" id='+permissionCode+' class="right_marginonezero">';
						}
						if(!jsonPermissionRes.permissionPaneContents[i].isLoggedInUserCanEdit){
							if(jsonPermissionRes.permissionPaneContents[i].isSet){
								if(jsonPermissionRes.permissionPaneContents[i].level == 1){
									permissioRow += '<td class="indent15 inactive lock">'+chkbox + jsonPermissionRes.permissionPaneContents[i].permissionName+'<a href="#" class="dumyLock tooltip" data-tooltip-position="bottom" title="'+ice.globalVars.noChangePermissionMsg+'">'+ice.globalVars.helpTextLbl+'</a>';
								}else{
									permissioRow += '<td class="inactive lock">'+ chkbox + jsonPermissionRes.permissionPaneContents[i].permissionName+'<a href="#" class="dumyLock tooltip" data-tooltip-position="bottom" title="'+ice.globalVars.noChangePermissionMsg+'">'+ice.globalVars.helpTextLbl+'</a></td>';
								}
							}else{
								if(jsonPermissionRes.permissionPaneContents[i].level == 1){
								permissioRow += '<td class="indent15">'+ chkbox + jsonPermissionRes.permissionPaneContents[i].permissionName+'</td>';
								}else{
									permissioRow += '<td>'+ chkbox +jsonPermissionRes.permissionPaneContents[i].permissionName+'</td>';
								}
							}
						}else{
							if(jsonPermissionRes.permissionPaneContents[i].level == 1){
								permissioRow += '<td class="indent15">'+ chkbox + jsonPermissionRes.permissionPaneContents[i].permissionName+'</td>';
							}else{
								permissioRow += '<td>'+ chkbox +jsonPermissionRes.permissionPaneContents[i].permissionName+'</td>';
							}
						}
						permissioRow += '</tr>';
						if(jsonPermissionRes.permissionPaneContents[i].category == 'GLOBAL'){
							globRow += permissioRow;
						}else{
							foldRow += permissioRow;
						}						
						permissioRow = "";
					}					
					$('table.withborders tbody').html(globRow + foldRow);
				}
				var textArea = "<div class='textareaholder'><label>"+ice.globalVars.noteHdrLbl+"</label><textarea id='requestaccesstxtarea'></textarea></div>";
				$('div#requestPermissionDiv').append(textArea);
				// Textarea val has to reset
				if(ice.requestAccessPermissions.rptaval != ""){$('#requestaccesstxtarea').val(ice.requestAccessPermissions.rptaval);ice.requestAccessPermissions.rptaval = "";}
				$('table.withborders tr').each(function(){
					var selector = $(this).find('td').find(':checkbox');
					var alnk = $(this).find('td').find('a.dumyLock');
					if(selector.attr('id') == "PERMISSION06"){ //Default permission should be grayed out and disabled - FR-USR-WI-803
						selector.attr('checked', 'checked');
						selector.attr('disabled', 'disabled');
						selector.closest('td').addClass("inactive");
					}
					if(selector.attr('id') == "PERMISSION02"){ //Manage Folders, Users & Access should be disabled, only IT Super/Procrument user can remove the permission - FR-USR-WI-034
						if(selector.attr('checked')){
							selector.attr('disabled', 'disabled');
						}
					}
					if($(alnk).length != 0){
						selector.attr('disabled', 'disabled');
						selector.closest('td').addClass("inactive");
					}
				});
				
				//$('div#requestPermissionDiv input[type="checkbox"]').each(function(){
					$('div#requestPermissionDiv input[type="checkbox"]').click(function(){
						if($(this).attr('checked')){
							$(this).attr('value', 'on'); 
							if(permissionCodeMap[$(this).attr('id')]){
								var permissionId = permissionCodeMap[$(this).attr('id')]; 
								$('#requestPermissionDiv #tbl_edit #PERMISSION01').attr('checked', true); //FR-USR-WI-038, FR-USR-WI-039, FR-USR-WI-040
								$('#requestPermissionDiv #tbl_edit #PERMISSION01').attr('value', 'on');	
							}								
						}else{
							$(this).attr('value', 'off'); 
							if($(this).attr('id')){
								var _id = '#requestPermissionDiv #'+$(this).attr('id');
								$(_id).removeAttr('checked');
								
								if($(this).attr('id') == "PERMISSION01"){
									var permissionId = $(this).attr('id');
									if(($('#requestPermissionDiv #PERMISSION02').attr('checked')) || $('#requestPermissionDiv #PERMISSION03').attr('checked') || $('#requestPermissionDiv #PERMISSION04').attr('checked')){
										$('#requestPermissionDiv #tbl_edit #PERMISSION01').attr('checked', true); //FR-WI-USR-696
										$('#requestPermissionDiv #tbl_edit #PERMISSION01').attr('value', 'on');
									}
								}
							}
						}
						if($(this).attr('id') == "PERMISSION07" && $(this).attr('checked')){
							ice.requestAccessPermissions.showAlertWindow();
						}
						if($('div#requestPermissionDiv input[type="checkbox"]:checked').not(':disabled').length == 0){
							$('button#submitRequestPermission').attr('disabled','disabled').addClass('disabled');
						}else{$('button#submitRequestPermission').removeAttr('disabled','disabled').removeClass('disabled');}
					});
				//});
				
				if((custmerRole == "s") || (custmerRole == "p") || (custmerRole == "sp")){ //User IT/P use can modify the manage folder And acess permission of user
					
					$('table.withborders tr').each(function(){
						var selector = $(this).find('td').find(':checkbox');
						if(selector.attr('id') != "PERMISSION06"){ //Default permission should be grayed out and disabled - FR-USR-WI-803
							if(!selector.next().hasClass('dumyLock')){
								selector.removeAttr('disabled');
						        selector.closest('td').removeClass("inactive");
						    }
						}
					});
					
					if(loggedUserPermissionMap["PERMISSION02"].toString() != undefined){
						$('#folderPane ul').find('li').each(function(){
							if($(this).find('span:eq(0)').hasClass('selectedFolder')){
								if($(this).parent('li:eq(1)').length > 0){
									$('div#requestPermissionDiv input[type="checkbox"]').each(function(){
										$(this).removeAttr('disabled');
									});
								}
							}
						});
					}
				}
				if(custmerRole == "fm"){ //Folder manager can add permission to another folder manager, he can not remove the permission, so disabling existing check box.
					$('table.withborders tr').each(function(){
						var selector = $(this).find('td').find(':checkbox');
						if(selector.attr('checked')){
							selector.attr("disabled", "disabled");
						}
					});
				}
				$('table.withborders tr td').find("input[type='checkbox']:checked").each(function(){
					$(this).attr('disabled', 'disabled').closest('td').addClass('inactive');
				});
				$('div#loadingRequestPermission').hide();
				$('div#showRequestPermission').show();
			}
			var fid = targetConfig.fId;
			ice.requestAccessPermissions.isFolderAdmin = jsonPermissionRes.isFolderAdmin;
			if($('li.'+fid).attr('level') == 1){
				$('div.chk_box_container').show();
				if(jsonPermissionRes.isFolderAdmin) {
					$('input#reqperm_chkbox').attr('checked','checked').attr('disabled','disabled');
					ice.requestAccessPermissions.populatePermChkBox($('input#reqperm_chkbox'));				
				}
				if(!jsonPermissionRes.manageRolesPermission){
					//$('input#reqperm_chkbox').attr('disabled','disabled');
				}
			}else{
				$('div.chk_box_container').hide();
			}
			var toolTipHtm = '<a href="#" class="dumyLock tooltip" data-tooltip-position="bottom" title="'+ice.globalVars.noChangePermissionMsg+'">'+ice.globalVars.helpTextLbl+'</a>';
			if($('li.'+fid).attr('level') != 1 && $('li.'+fid).attr('level') != 0){
				$('input#PERMISSION09,input#PERMISSION08,input#PERMISSION07').each(function(cnt, obj){
					$(obj).attr('disabled','disabled');
					if(!$(obj).closest('tr').find('td').hasClass('lock')){
						$(obj).closest('tr').find('td').addClass('inactive lock').append(toolTipHtm);
					}
				})
			}
			myvmware.hoverContent.bindEvents($('a.tooltip'), 'defaultfunc');
			myvmware.hoverContent.bindEvents($('span#spanfolderID'), 'epfunc');
	},
	onFailGetPermissionList: function(){
		$('div#loadingRequestPermission').hide();
		$('.error').html(ice.globalVars.unknownErrorMsg);
	},
	editPermissions : function(){
		var targetConfig = ice.requestAccessPermissions.targetDetails;
		if(!ice.requestAccessPermissions.isConfirmbtn){
			$('#slectedFolderReqIdHide').val(targetConfig.fId);
			$('#selectedReqCustomerId').val(targetConfig.custId);
			var permDivClone = "";
			permDivClone = $('div#requestPermissionDiv').contents().clone(true);
			var selectedPermissionIds = [];
			var unselectedPermissionIds = [];
			$('#showRequestPermission').hide();
			$('#loadingRequestPermission').show();
			$('div#requestPermissionDiv').find('input[type="checkbox"]').each(function(i,obj) {
				if($(this).attr('id')=="PERMISSION06"){
					if($(this).attr('value') == 'on')
						selectedPermissionIds.push($(this).attr('id'));
				}else if($(this).attr('disabled')=='undefined' ||
						$(this).attr('disabled')!=true){
					if($(this).attr('checked')== true){
						if($(this).attr('value') == 'on')
							selectedPermissionIds.push($(this).attr('id'));
					}else{
						if($(this).attr('value') == 'off')
							unselectedPermissionIds.push($(this).attr('id'));
					}
				}
				$(this).attr('disabled', true);
				if($(this).attr('value') != 'on'){
					$(this).closest('td').addClass('inactive');
				}				
			});
			var adminChbox =$('#reqperm_chkbox');
			if (adminChbox.attr('disabled')=='undefined' || adminChbox.attr('disabled')!=true){
				if(adminChbox.attr('checked')== true){
					$('#adminReqRoleSelected').val("Y");
				}else{$('#adminReqRoleSelected').val("N");}
			}
			var ctxt = $('textarea#requestaccesstxtarea').val();
			$('textarea#txtareaRequestNote').val(ctxt);
			if(ctxt != ""){
				//var phtm = "<p class=\"rpTextAreaWrap\" title="+ctxt+">"+ctxt+"</p>";
				$('textarea#requestaccesstxtarea').attr('readonly',true);
			}else{$('div#requestPermissionDiv').find('div.textareaholder').hide();}
			//ice.requestAccessPermissions.truncateAndShowEllipsis($('p.rpTextAreaWrap'),90);
			$(permDivClone).find('textarea#requestaccesstxtarea').val(ctxt);
			$('div#requestpermissionpopup').find('div.headerTitle').text(ice.globalVars.confirmLbl).end().find('input#reqperm_chkbox').attr('disabled','disabled');
			$('div.buttons').find('button#btn_backrequestacces').show().end().find('button#submitRequestPermission').removeAttr('disabled').removeClass('disabled').text(ice.globalVars.submitRequestLbl);
			ice.requestAccessPermissions.isConfirmbtn = true;
			$('#selectedReqPermissionIds').val(selectedPermissionIds);
			$('#unselectedReqPermissionIds').val(unselectedPermissionIds);
			var requestedPermissionUserList = $reqPermisisonUserURL+"&"+$('form#requestPermissionFrom').serialize();	
			vmf.ajax.post(requestedPermissionUserList, null, ice.requestAccessPermissions.onSuccessUserList, ice.requestAccessPermissions.onFailUserList);			
			$('button#btn_backrequestacces').unbind('click').bind('click', function(e){	
				$(this).hide();		
				ice.requestAccessPermissions.backtoRequestPermissions(permDivClone);
				e.preventDefault();			
			});
		}else{
			var savePermissionUrl = submitReqPermissionUrl+"&"+$('form#requestPermissionFrom').serialize();	
			vmf.ajax.post(savePermissionUrl, null, ice.requestAccessPermissions.onSuccessEditPermissions, ice.requestAccessPermissions.onFailEditPermissions);
			ice.requestAccessPermissions.isConfirmbtn = false;
		}

	},
	onSuccessUserList: function(res){
		var headHtml = "";
		var userListJson = vmf.json.txtToObj(res);
		$.each(userListJson.approverList, function(j, val){
			headHtml += val.firstName +' '+val.lastName;
			if(userListJson.approverList.length != j+1){headHtml +=", ";}
		});
		$('span#approverListSpan').html(headHtml);
		$('p.approverListP,p.approverDesc').show();
		$('p.approverListP span.tooltip').attr('title',ice.globalVars.requestWillbeSentMsg)
		ice.requestAccessPermissions.truncateAndShowEllipsis($('span#approverListSpan'),125);
		myvmware.hoverContent.bindEvents($('p.approverListP span.tooltip'), 'epfunc');
		$('#loadingRequestPermission').hide();
		$('#showRequestPermission').show();
		
	},
	truncateAndShowEllipsis: function(elm,cnt){
		var myTag = $.trim(elm.text());
		if (myTag.length > cnt) {
		  var truncated = myTag.substring(0, cnt) + "…";
		  elm.text(truncated);
		}		
	},
	onFailUserList: function(){},
	onSuccessEditPermissions : function(data){vmf.modal.hide("requestpermissionpopup");},
	onFailEditPermissions : function(){
		$('#savePermissionId').removeClass('disabled').attr('disabled', false).addClass('primary');
	},
	onSuccessLoggedUserInfo : function(event){
		var userVo = vmf.json.txtToObj(event);
		var loggedCustomerNumer = userVo.customerNumber;
		$('#loggedCustomer').text(loggedCustomerNumer);
	},
	onFailLoggedUserInfo : function(){},
	onSuccessloggedUserPermission : function(event){	
		var PermissionListObj = vmf.json.txtToObj(event);
		if(PermissionListObj.permissionPaneContents.length > 0){
			loggedUserPermissionMap = {};
			for(var i=0; i < PermissionListObj.permissionPaneContents.length ;i++){
				loggedUserPermissionMap[PermissionListObj.permissionPaneContents[i].permissionCode] = PermissionListObj.permissionPaneContents[i].isSet;
				if(PermissionListObj.permissionPaneContents[i].permissionCode == "PERMISSION02"){
					if(!PermissionListObj.permissionPaneContents[i].isSet){
						if(enableFlag)
						{
							ice.requestAccessPermissions.disableEditPermissionLink();
						}
						
					}
				}
			}
		}
	},
	onFailloggedUserPermission : function(){
	},
	backtoRequestPermissions: function(clonedDiv){ // Onclick of back button change to request permission page with edit mode
		$('div#requestpermissionpopup').find('div.headerTitle').text('Request Permissions').end().find('input#reqperm_chkbox').removeAttr('disabled').end().find('button#submitRequestPermission').text(ice.globalVars.continueLbl);
		$('div#requestPermissionDiv').find('div.textareaholder').show().end().find('textarea#txtareaRequestNote').removeAttr('readonly',false).show();
		$('span#approverListSpan').html('');
		$('p.approverListP,p.approverDesc').hide();
		$('div#requestPermissionDiv').html(clonedDiv);
		ice.requestAccessPermissions.isConfirmbtn = false;
	},
	confirmRequestedPerm: function(){ // Show the selected test boxes with disabled
	},
	showAlertWindow: function(){// When clicking on PERMISSION07 call this function
		$('#requestPermissionData div.tabledata, #requestPermissionData div.perm_footer,#requestPermissionData p.description').hide();
		$('#requestPermissionData div.warncontainerclass, #requestPermissionData div.warncontainerclass div.warning_footer').show();
		$('button#reqPermCloseWarning').unbind('click').bind('click', function(){
				$('#requestPermissionData div.warncontainerclass,#requestPermissionData div.warning_footer').hide();
				$('#requestPermissionData div.tabledata, #requestPermissionData div.perm_footer,#requestPermissionData p.description').not('p.approverListP,p.approverDesc').show();
		})
	}
};
var permissionCodeMap = {"PERMISSION02" : "PERMISSION01", "PERMISSION03" : "PERMISSION01", "PERMISSION04" : "PERMISSION01"};
var custResponse = {"managePermission":null,"folderAccess":null,"permissionPaneCacheTimestamp":null,
"permissionPaneContents":[
{"level":0,"category":"GLOBAL","permissionCode":"PERMISSION09","sortOrder":10,"permissionName":ice.globalVars.manageRolesLbl,"isSet":false,"isInherited":false,"isLoggedInUserCanEdit":false},
{"level":0,"category":"GLOBAL","permissionCode":"PERMISSION08","sortOrder":20,"permissionName":ice.globalVars.viewSupportLbl,"isSet":false,"isInherited":false,"isLoggedInUserCanEdit":false},
{"level":0,"category":"GLOBAL","permissionCode":"PERMISSION07","sortOrder":30,"permissionName":ice.globalVars.viewOrdersLbl,"isSet":false,"isInherited":false,"isLoggedInUserCanEdit":false},
{"level":0,"category":"FOLDER","permissionCode":"PERMISSION01","sortOrder":40,"permissionName":ice.globalVars.viewLicenseLbl,"isSet":false,"isInherited":false,"isLoggedInUserCanEdit":false},
{"level":1,"category":"FOLDER","permissionCode":"PERMISSION02","sortOrder":50,"permissionName":ice.globalVars.manageFoldersLbl,"isSet":false,"isInherited":false,"isLoggedInUserCanEdit":false},
{"level":1,"category":"FOLDER","permissionCode":"PERMISSION03","sortOrder":60,"permissionName":ice.globalVars.devideCombineLbl,"isSet":false,"isInherited":false,"isLoggedInUserCanEdit":false},
{"level":1,"category":"FOLDER","permissionCode":"PERMISSION04","sortOrder":70,"permissionName":ice.globalVars.upgradeDowngradeLbl,"isSet":false,"isInherited":false,"isLoggedInUserCanEdit":false},
{"level":0,"category":"FOLDER","permissionCode":"PERMISSION05","sortOrder":80,"permissionName":ice.globalVars.fileTechnicalLbl,"isSet":false,"isInherited":false,"isLoggedInUserCanEdit":false},
{"level":0,"category":"FOLDER","permissionCode":"PERMISSION06","sortOrder":90,"permissionName":ice.globalVars.downloadProductsLbl,"isSet":true,"isInherited":false,"isLoggedInUserCanEdit":false}
],"isFolderAdmin":false,"manageRolesPermission":false}
