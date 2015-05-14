vmf.ns.use("ice");
ice.manageAcess={
		
	loadPermissionUrl:null,
	editPermissionUrl:null,
	loadLicenseFolderViewUrl: null,
	loggedUserInfoUrl : null,
	loggedUserPermissionMap : null,
	editPermssionToolTipMsg : null,
	enableFlag : null,
	permissionPaneEventObject : null,
	isFolderAdmin : null,
	init:function(arg1, arg2, arg3, arg4, editPermssionToolTipMsgText){
		
		editPermssionToolTipMsg = editPermssionToolTipMsgText;
		enableFlag = false;
		ice.manageAcess.disableEditPermissionLink();
		//Edit Permission
		loadPermissionUrl = arg1;
		$('ul li a#editPermissionLink').live('click', function(){
			/*if(($(this).attr('class') != "dummyClick") && ($('div#userDiv').find('input:radio:checked').length > 0)){
				ice.manageAcess.populateEditPermissionUI();
			}*///Commented out as part of removal of radio buttons
			if(!$(this).hasClass("dummyClick") && $('div#userDiv li').hasClass('active')){
				vmf.scEvent = true;
				if($.trim($('#tabbed_box_1').find('.active').attr('title')) == 'By Folder')
					riaLinkmy('users-permissions : by-folder : edit-permissions');
				else if($.trim($('#tabbed_box_1').find('.active').attr('title')) == 'By User')
					riaLinkmy('users-permissions : by-user : edit-permissions');
				else if($.trim($('#tabbed_box_1').find('.active').attr('title')) == 'By Service')
					riaLinkmy('users-permissions : by-service : edit-permissions');
				ice.manageAcess.populateEditPermissionUI();
			}
		});
		 
		//Save permission
		editPermissionUrl = arg2;
		loadLicenseFolderViewUrl = arg3;
		$('#savePermissionId').click(function(){
			$('#savePermissionId').removeClass('primary').attr('disabled', true).addClass('disabled');
			($("#serviceList li span.active").length>0) ? ser.editPerm.submitEditPermissions() :ice.manageAcess.editPermissions();
		});
		
		//Logged in user info
		loggedUserInfoUrl = arg4;
		vmf.ajax.post(loggedUserInfoUrl, null, ice.manageAcess.onSuccessLoggedUserInfo, ice.manageAcess.onFailLoggedUserInfo);
		
		//Close edit permission window
		$('#btn_cancel3').click(function(){
			vmf.modal.hide("editPermissionPopup");
		});
		
	},
	disableEditPermissionLink : function(){ 		
		ice.removeUser.disableEnableLinks('applyInActive', $('#editPermissionLink'));	
	},
	populateEditPermissionUI: function(){
		var classList1,regExp = /[d]/,isDesigneeSO2,roleCheck = $("#userDiv li.active").attr('role');
		
		if(typeof roleCheck !== typeof undefined && roleCheck !== false){
			classList1 = $("#userDiv li.active").attr('role') ;
		}else{
			classList1 = $("#userDiv li.active").attr('crole');
		}
		
		isDesigneeSO2 = regExp.test(classList1);
		if(isDesigneeSO2)
        {
                vmf.modal.show("designeeServiceOwnerError");
        }
        else{	
		vmf.modal.show('editPermissionPopup', { 
					checkPosition: true,
					onShow: function (dialog) {	
						$('input#edperm_chkbox').unbind('click').bind('click', function(){
							ice.manageAcess.populatePermChkBox($('input#edperm_chkbox'));
						})
					} 
			});
		}
		//Call to get selected user permission for selected folder //BUG-00024711
		if ($("#serviceList li span.active").length>0){
			ser.editPerm.loadUserPermission();
			return;
		} 
		var _loggedPermissionUrl = $userSelectionUrl+ '&selectedFolderId=' + $('#selectedFolderId').val() +'&selectedCustomerNumber='+$('#selectedUserId').val() + '&loggedInUserDataForEditPermissions=TRUE',successfn;
		enableFlag = false;
		vmf.ajax.post(_loggedPermissionUrl, null, ice.manageAcess.onSuccessloggedUserPermission, ice.manageAcess.onFailloggedUserPermission);
	},
	populatePermChkBox: function(chklm){ // get checkbox selected except one
		if(chklm.is(':checked')){
			var ttip = '<a href="#" class="dumyLock tooltip" data-tooltip-position="bottom" title="'+editPermssionToolTipMsg+'">'+ice.globalVars.helpTextLbl+'</a>';
			$('#editPermissionDiv #tbl_edit').find('tbody#savemsg_id').hide();
			$('#editPermissionDiv #tbl_edit').find('tbody#perm_tbody').show();
			$('#editPermissionDiv #tbl_edit').find('input:checkbox').not('input#PERMISSION07').attr('checked', 'checked');
			$('#editPermissionDiv #tbl_edit').find('input:checkbox').not('input#PERMISSION07').each(function(){
				$(this).attr('checked', 'checked');$(this).attr('disabled', 'disabled');
				if(!$(this).parents('td').hasClass('lock')){
					$(this).parents('td').addClass('lock').append(ttip);
				}				
			})
			myvmware.hoverContent.bindEvents($('a.tooltip'), 'defaultfunc');
		}else{			
			if (!ice.manageAcess.isFolderAdmin){
				$('div#editPermissionDiv').html('');
				ice.manageAcess.onSuccessGetPermissionList(ice.manageAcess.permissionPaneEventObject);
			} else {
				$('#editPermissionDiv #tbl_edit').find('tbody#perm_tbody').hide();
				var msgHtm = '';
				msgHtm += "<tbody id=\"savemsg_id\"><tr><td colspan=\"2\"><p><b>"+ice.globalVars.removeRequestMsg+"</b></p></td></tr></tbody>";
				$('#editPermissionDiv #tbl_edit').append(msgHtm);
				$('#editPermissionDiv #tbl_edit').find('input:checkbox').not('input#PERMISSION07').attr('checked', '');
				$('#editPermissionDiv #tbl_edit').find('input:checkbox').not('input#PERMISSION07').attr('disabled',false).parents('td').removeClass('lock');
				$('#adminRoleSelected').val("N");
				$('#editPermissionDiv #tbl_edit').find('input:checkbox').not('input#PERMISSION07').each(function(){
					$(this).attr('checked', '');$(this).attr('disabled', false);
					$(this).parents('td').removeClass('lock').find('a.dumyLock').remove();
				})
			}
		}
	},
	onSuccessGetPermissionList: function(event){
			ice.manageAcess.permissionPaneEventObject = event;
			var jsonPermissionRes = vmf.json.txtToObj(event);
			
			if(jsonPermissionRes == null){
				$('div#loadingEditPermission').hide();
				$('div#showEditPermission').html(ice.globalVars.noPermissions);
				$('div#showEditPermission').show();
				return false;
			}
			
			var permissionHTML = '<table id="tbl_edit"  class="withborders incHeight"><thead><tr><th class="bdrLt1px">'+ice.globalVars.accessLbl+'</th><th class="bdrRt1px">'+ice.globalVars.allowedLbl+'</th>';
				permissionHTML += '</tr></thead><tbody id="perm_tbody">';
				//permissionHTML += '<tr id="globalRow"><td class="spacer subhead"><strong>Global</strong></td><td class="spacer subhead"></td></tr>';
				//permissionHTML += '<tr id="folderRow"><td class="spacer subhead"><strong>By Folder</strong></td><td class="spacer subhead"></td></tr>';
				permissionHTML += '</tbody></table>';//FR-WI-USR-505, //FR-WI-USR-506
				
				
			$('div#editPermissionDiv').html(permissionHTML);
			
			$('#editPermissionData').find('div.name span#userName').text($('#slectedUserName').text()); //FR-WI-USR-503
			$('#editPermissionData').find('div.email a').text($('div#userPaneSelectedUserEmail a').text());
			
			if($('ul.tabs li:eq(0) a').hasClass('active')){
				$('#editPermissionData').find('div.name span.title').text($('#userRole').text()); //FR-WI-USR-504
			}
			if($('ul.tabs li:eq(1) a').hasClass('active')){
				$('#editPermissionData').find('div.name span.title').text($('#selectedUserRole').text()); //FR-WI-USR-504
			}
			var custmerRole = "";			
			var selectdCustomerId = $('#selectedFolderUserPane ul li').filter('.active').attr('val'); 
			$('#selectedCustomerId').val(selectdCustomerId);			
			$('#selectedFolderUserPane ul').find('li').each(function(){
				var roleClass = $(this).attr('class').split(' ');
				var roleIcon = "";
				if(roleClass.length > 0){
					roleIcon = roleClass[0]; //Get role
					
					//var customerIdArr = $(this).attr('id').split('_'); //Split added to handle both tabs as the initializing the id are different
					
					
					/*if(customerIdArr.length > 1){
						selectdCustomerId = customerIdArr[1]; //Get selected CN number
					}else{
						selectdCustomerId = $(this).attr('id'); //Get selected CN number
					}*/
					
					if(roleClass.length > 1 || roleIcon == "active"){						
						if(roleIcon != "active"){
							$('#editPermissionData').find('div.name span#userName').prev().attr('src','/static/myvmware/common/css/img/user_'+roleIcon+'.png');
						}
					}	
					if(selectdCustomerId == $('#loggedCustomer').text()){
						if(roleIcon != 'active'){
							custmerRole = roleIcon; //Logged in user role
						}else{
							custmerRole = "n"; //Normal user reference, Logged in user is a normal user
						}
					}
					
				}
			});
			
			if(jsonPermissionRes.permissionPaneContents.length > 0){
				var globRow = '';
				var foldRow = '';
				for(var i=0; i < jsonPermissionRes.permissionPaneContents.length ;i++){
					
					if(jsonPermissionRes.permissionPaneContents[i].permissionName != null){
						
						var permissioRow = '<tr>';
						
						if(!jsonPermissionRes.permissionPaneContents[i].isLoggedInUserCanEdit){
							if(jsonPermissionRes.permissionPaneContents[i].level == 1){
								permissioRow += '<td class="indent15 inactive">'+jsonPermissionRes.permissionPaneContents[i].permissionName+'</td><td class="lock">';
							}else{
								permissioRow += '<td class="inactive">'+jsonPermissionRes.permissionPaneContents[i].permissionName+'</td><td class="lock">';
							}
						}else{
							if(jsonPermissionRes.permissionPaneContents[i].level == 1){
								permissioRow += '<td class="indent15">'+jsonPermissionRes.permissionPaneContents[i].permissionName+'</td><td class="">';
							}else{
								permissioRow += '<td>'+jsonPermissionRes.permissionPaneContents[i].permissionName+'</td><td class="">';
							}
						}
							
						var permissionCode = jsonPermissionRes.permissionPaneContents[i].permissionCode;
						
						if(jsonPermissionRes.permissionPaneContents[i].isSet){
							permissioRow += '<input type="checkbox" checked="checked" id='+permissionCode+'>';
						}else{
							permissioRow += '<input type="checkbox" id='+permissionCode+'>';
						}
						
						if(!jsonPermissionRes.permissionPaneContents[i].isLoggedInUserCanEdit){
							//permissioRow += '<img src="/static/myvmware/common/img/lock.png" class="dumyLock" height="15" width="18"  alt="You do not have rights to modify the permission" title="You do not have rights to modify the permission"/>';
							permissioRow += '<a href="#" class="dumyLock tooltip" data-tooltip-position="bottom" title="'+editPermssionToolTipMsg+'">'+ice.globalVars.helpTextLbl+'</a>';
						} 
						
						permissioRow += '</td></tr>';
						
						/*if(jsonPermissionRes.permissionPaneContents[i].category == 'GLOBAL'){
							$(permissioRow).insertBefore($('table.withborders tr#folderRow'));
						}else{
							$(permissioRow).insertAfter($('table.withborders tr:last'));
						}*/
						
						if(jsonPermissionRes.permissionPaneContents[i].category == 'GLOBAL'){
							globRow += permissioRow;
						}else{
							foldRow += permissioRow;
						}
						
						permissioRow = "";
					}
					$('table.withborders tbody').html(globRow + foldRow);
				}
				
				myvmware.hoverContent.bindEvents($('a.tooltip'), 'defaultfunc');
				
				$('table.withborders tr td a.dumyLock').each(function(){
					$(this).parent().find(':checkbox').attr('disabled', 'disabled'); //Inherited permission can not be edited so checkbox disabled
				});
				
				$('table.withborders tr').each(function(){
					var selector = $(this).find('td:eq(2)').find(':checkbox');
					if(selector.attr('id') == "PERMISSION06"){ //Default permission should be grayed out and disabled - FR-USR-WI-803
						selector.attr('checked', 'checked');
						selector.attr('disabled', 'disabled');
						selector.parent().prev().addClass("inactive");
					}
					if(selector.attr('id') == "PERMISSION02"){ //Manage Folders, Users & Access should be disabled, only IT Super/Procrument user can remove the permission - FR-USR-WI-034
						if(selector.attr('checked')){
							selector.attr('disabled', 'disabled');
						}
					}
				});
				
				//$('div#editPermissionDiv input[type="checkbox"]').each(function(){
					$('div#editPermissionDiv input[type="checkbox"]').click(function(){
						if($(this).attr('checked')){
							$(this).attr('value', 'on'); 
							if(permissionCodeMap[$(this).attr('id')]){
								var permissionId = permissionCodeMap[$(this).attr('id')]; 
								$('#editPermissionDiv #tbl_edit #PERMISSION01').attr('checked', true); //FR-USR-WI-038, FR-USR-WI-039, FR-USR-WI-040
								$('#editPermissionDiv #tbl_edit #PERMISSION01').attr('value', 'on');	
							}								
						}else{
							$(this).attr('value', 'off'); 
							if($(this).attr('id')){
								var _id = '#editPermissionDiv #'+$(this).attr('id');
								$(_id).removeAttr('checked');
								
								if($(this).attr('id') == "PERMISSION01"){
									var permissionId = $(this).attr('id');
									if(($('#editPermissionDiv #PERMISSION02').attr('checked')) || $('#editPermissionDiv #PERMISSION03').attr('checked') || $('#editPermissionDiv #PERMISSION04').attr('checked')){
										$('#editPermissionDiv #tbl_edit #PERMISSION01').attr('checked', true); //FR-WI-USR-696
										$('#editPermissionDiv #tbl_edit #PERMISSION01').attr('value', 'on');
									}
								}
							}
						}
						if($(this).attr('id') == "PERMISSION07" && $(this).attr('checked')){
							ice.manageAcess.showAlertWindow();
						}
					});
				//});
				
				if((custmerRole == "s") || (custmerRole == "p") || (custmerRole == "sp")){ //User IT/P use can modify the manage folder And acess permission of user
					
					$('table.withborders tr').each(function(){
						var selector = $(this).find('td:eq(2)').find(':checkbox');
						if(selector.attr('id') != "PERMISSION06"){ //Default permission should be grayed out and disabled - FR-USR-WI-803
							if(!selector.next().hasClass('dumyLock')){
								selector.removeAttr('disabled');
						        selector.parent().prev().removeClass("inactive");
						    }
						}
					});
					
					if(loggedUserPermissionMap["PERMISSION02"].toString() != undefined){
						$('#folderPane ul').find('li').each(function(){
							if($(this).find('span:eq(0)').hasClass('selectedFolder')){
								if($(this).parent('li:eq(1)').length > 0){
									$('div#editPermissionDiv input[type="checkbox"]').each(function(){
										$(this).removeAttr('disabled');
									});
								}
							}
						});
					}
				}
				if(custmerRole == "fm"){ //Folder manager can add permission to another folder manager, he can not remove the permission, so disabling existing check box.
					$('table.withborders tr').each(function(){
						var selector = $(this).find('td:eq(2)').find(':checkbox');
						if(selector.attr('checked')){
							selector.attr("disabled", "disabled");
						}
					});
				}
				$('div#loadingEditPermission').hide();
				$('div#showEditPermission').show();
			}
			var fid = $('#selectedFolderId').val();
			ice.manageAcess.isFolderAdmin = jsonPermissionRes.isFolderAdmin;
			if($('li.'+fid).attr('level') == 1){
				$('div.chk_box_container').show();
				if(jsonPermissionRes.isFolderAdmin) {
					$('input#edperm_chkbox').attr('checked','checked');
					ice.manageAcess.populatePermChkBox($('input#edperm_chkbox'));				
				}
				if(!jsonPermissionRes.manageRolesPermission){
					$('input#edperm_chkbox').attr('disabled','disabled');
				}
			}else{
				$('div.chk_box_container').hide();
			}
			myvmware.hoverContent.bindEvents($('a.tooltip1'), 'epfunc');
			$('a#kb_link_id').die('click').live('click', function(e){
					myvmware.common.openHelpPage('http://kb.vmware.com/kb/2035526?plainview=true');
					e.preventDefault();
				})
			/*if($("a.ed_tooltip").length>0){
				var topOffset = -5;
				var leftOffset = 14;
				var placementClass = "";
				//Check if placement should be bottom
				if($("a.ed_tooltip").data('tooltip-position') == "bottom"){
					topOffset = 24;
					leftOffset = -72;
					placementClass = "bottom";
				}else{placementClass = "edge";}
				$("a.ed_tooltip").accessibleTooltip({topOffset: topOffset,leftOffset: leftOffset,fadeoutspeed:5000,associateWithLabel:false,preContent: "<div class=\"arrow "+placementClass+"\"></div>"});
				
			}*/
			
			$('#editPermissionDiv table#tbl_edit thead th:eq(0)').css('width','390px');
			//vmf.tablescroll.init('tbl_edit',{height:270,width:533});
			//$('#editPermissionDiv .tablescroll .tablescroll_head tr th:eq(0)').css('width','400px');
			//$('#editPermissionDiv .tablescroll .tablescroll_head tr th:eq(1)').css('width','150px');
			//$('#editPermissionDiv .tablescroll_wrapper table tr td:eq(0)').css('width','310px');
			//$('#editPermissionDiv .tablescroll_wrapper table tr td:eq(1)').css('width','140px');
	},
	onFailGetPermissionList: function(){
		$('div#loadingEditPermission').hide();
		$('.error').html(ice.globalVars.unknownErrorMsg);
	},
	showAlertWindow: function(){// When clicking on PERMISSION07 call this function
		$('#editPermissionData div.tabledata, #editPermissionData div.perm_footer').hide();
		$('#editPermissionPopup').parent().siblings('a.').hide();
		$('#editPermissionData div#warning_container, #editPermissionData div#warning_container div.warning_footer').show();
		$('button#close_warning').unbind('click').bind('click', function(){
				$('#editPermissionData div#warning_container,#editPermissionData div.warning_footer').hide();
				$('#editPermissionPopup').parent().siblings('a').show();
				$('#editPermissionData div.tabledata, #editPermissionData div.perm_footer').show();
		})
	},
	editPermissions : function(){
		$('#slectedFolderIdHide').val($('#selectedFolderId').val());
		
		var selectedPermissionIds = [];
		var unselectedPermissionIds = [];

		$('div#editPermissionDiv').find('input[type="checkbox"]').each(function(i,obj) {
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
		});
		
		
		$('#selectedPermissionIds').val(selectedPermissionIds);
		$('#unselectedPermissionIds').val(unselectedPermissionIds);
		var adminChbox =$('#edperm_chkbox');
		if (adminChbox.attr('disabled')=='undefined' || adminChbox.attr('disabled')!=true){
			if(adminChbox.attr('checked')== true){
				$('#adminRoleSelected').val("Y");
			}
		}

		var savePermissionUrl = editPermissionUrl+"&"+$('form#editPermissionForm').serialize();
	
		vmf.ajax.post(savePermissionUrl, null, ice.manageAcess.onSuccessEditPermissions, ice.manageAcess.onFailEditPermissions);
	},
	onSuccessEditPermissions : function(data){
		//window.location = loadLicenseFolderViewUrl;
        if(ice.ui != undefined) {
            ice.ui.loadPermissions($('#selectedCustomerId').val(),$('#selectedFolderId').val(),'TRUE');
        }
        else {
            ice.licensefolderview.loadPermissions($('#selectedCustomerId').val(),$('#selectedFolderId').val(),'TRUE');
        }
		vmf.modal.hide("editPermissionPopup");
	},
	onFailEditPermissions : function(){
	$('#savePermissionId').removeClass('disabled').attr('disabled', false).addClass('primary');
	},
	onSuccessLoggedUserInfo : function(event){
		var userVo = vmf.json.txtToObj(event);
		$('#loggedCustomer').text(userVo.customerNumber);
	},
	onFailLoggedUserInfo : function(){
	},
	onSuccessloggedUserPermission : function(event){	
		
		var PermissionListObj = vmf.json.txtToObj(event);
		
		if(PermissionListObj.permissionPaneContents.length > 0){
			loggedUserPermissionMap = {};
			for(var i=0; i < PermissionListObj.permissionPaneContents.length ;i++){
				loggedUserPermissionMap[PermissionListObj.permissionPaneContents[i].permissionCode] = PermissionListObj.permissionPaneContents[i].isSet;
				if(PermissionListObj.permissionPaneContents[i].permissionCode == "PERMISSION02"){
					if(!PermissionListObj.permissionPaneContents[i].isSet){
						//$('ul li a#editPermissionLink').addClass('dummyClick');
						//$('ul li a#editPermissionLink').css('color', '#CCCCCC');
						// Fix for BUG-00030982
						if(enableFlag)
						{
							ice.manageAcess.disableEditPermissionLink();
						}
						
						//vmf.modal.show("permissionErrorpopup");
					}
				}
			}
		}
		
		if(!isRootSelected){
			vmf.ajax.post(loadPermissionUrl, null, ice.manageAcess.onSuccessGetPermissionList, ice.manageAcess.onFailgetPermissionList);
		}else{
			//Root folder permission checking
			//Check if logged user has manage permission if yes then enable edit permission link //BUG-00024599
								if(loggedUserPermissionMap["PERMISSION02"]){                                  
                                    if($('ul li a#editPermissionLink').attr('class') == 'dummyClick')                                     
										ice.removeUser.disableEnableLinks('applyActive', $('#editPermissionLink'));                                    
								}
								else ice.manageAcess.disableEditPermissionLink();
		}
		
		isRootSelected = false;
	},
	onFailloggedUserPermission : function(){
	},
	chekRootFolderPermission : function(){
		isRootSelected = true;
		//Call to get logged in user permission w.r.t to Root folder special case
		var _loggedPermissionUrl = $userSelectionUrl+ '&selectedFolderId=' + $('#selectedFolderId').val() +'&selectedCustomerNumber='+$('#loggedCustomer').text() + '&loggedInUserDataForEditPermissions=TRUE';
		enableFlag = true;
		vmf.ajax.post(_loggedPermissionUrl, null, ice.manageAcess.onSuccessloggedUserPermission, ice.manageAcess.onFailloggedUserPermission);
	},
	checkPermissionRule : function(){
		isRootSelected = false;
		if($('ul li a#editPermissionLink').attr('class') == 'dummyClick'){			
			ice.removeUser.disableEnableLinks('applyActive', $('#editPermissionLink'));
		}		
		if($('#selectedFolderUserPane ul').find('li').length >= 1){ //Get Logged in user role
			var custmerRole = "";
			$('#selectedFolderUserPane ul').find('li').each(function(){
				var customerIdArr = $(this).attr('id').split('_');
				var customerId = "";
				if(customerIdArr.length > 1){
					customerId = customerIdArr[1];
				}else{
					customerId = $(this).attr('id');
				}
				if(customerId == $('#loggedCustomer').text()){
					var roleClass = $(this).attr('crole').split(' ');
					custmerRole = roleClass[0];
					if((custmerRole == "active") || (custmerRole == "")){
						custmerRole = "n";//Normal user reference
					}
				}
			});	
			if(custmerRole == "n")				
				ice.manageAcess.disableEditPermissionLink();
			var custmerRoleMap = {"n" : "fm,p,s,sp", "fm" : "s,p,sp", "s" : "p,sp", "p" : "s,sp", "sp" : "s,p", "spa" : "s,p", "sa" : "p,sp", "pa" : "s,sp", "ad" : "s,p,sp,spa,sa,pa"};
			var mappedRoleArr = "";
			//if((custmerRole == "n") || (custmerRole == "fm")){
				mappedRoleArr = custmerRoleMap[custmerRole].split(',');
			//}			
			$('#selectedFolderUserPane ul').find('li').each(function(){			
				if($(this).hasClass('active')){					
					var isSelectedLoggedUser = false;
					var customerIdArr = $(this).attr('id').split('_');
					var customerId = "";
					if(customerIdArr.length > 1){
						customerId = customerIdArr[1];
					}else{
						customerId = $(this).attr('id');
					}
					if(customerId == $('#loggedCustomer').text()){
						isSelectedLoggedUser = true;
					}
					
					var roleClass = $(this).attr('class').split(' ');
					var selectedUserRole = "";
					if(roleClass.length > 1){
						selectedUserRole = roleClass[0];
						if(mappedRoleArr.length > 0){
							for(var index = 0; index < mappedRoleArr.length; index++){
								if(selectedUserRole == mappedRoleArr[index])									
									ice.manageAcess.disableEditPermissionLink();									
							}
						}
					}
					
					//Assumption IT/P/FM/SP can not modify his own permissions to making editpermission link as disabled
					if(((isSelectedLoggedUser) && (custmerRole == "fm") && (selectedUserRole == "fm")) || ((custmerRole == "p") && (selectedUserRole == "p")) || ((custmerRole == "s") && (selectedUserRole == "s")) || ((custmerRole == "sp") && (selectedUserRole == "sp")) || ((isSelectedLoggedUser) && (custmerRole == "ad"))){
						ice.manageAcess.disableEditPermissionLink();					
					}
				}
			});
		}else			
			ice.manageAcess.disableEditPermissionLink();		
	}
};
var permissionCodeMap = {"PERMISSION02" : "PERMISSION01", "PERMISSION03" : "PERMISSION01", "PERMISSION04" : "PERMISSION01"};
