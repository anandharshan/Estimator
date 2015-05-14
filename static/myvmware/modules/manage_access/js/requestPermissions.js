vmf.ns.use("ice");

ice.manageAcess={
	loadRequestPermissionUrl:null,
	init:function(arg1, arg2){
		//Edit Permission
		loadRequestPermissionUrl = arg1;
		$('#requestPermissionLink').click(function(){
			ice.manageAcess.populateRequestPermissionUI();
		});
	},
	populateRequestPermissionUI: function(){
		if($('#folderId').val().length > 0){
			vmf.ajax.post(loadRequestPermissionUrl, null, ice.manageAcess.onSuccessGetPermissionList, ice.manageAcess.onFailgetPermissionList);
		}
	},
	onSuccessGetPermissionList: function(event){
			var jsonPermissionRes = vmf.json.txtToObj(event);
			var permissionHTML = '<table class="withborders incHeight" id="req_permission_tbl"><thead><tr><th>'+ice.globalVars.accessLbl+'</th><th class="center">'+ice.globalVars.allowedLbl+'</th><th class="center"> '+ice.globalVars.folderManagerLbl+'</th>';
				permissionHTML += '</tr></thead>';
				permissionHTML += '<tr id="globalRow"><td colspan="3" class="spacer subhead"><strong>'+ice.globalVars.globalLbl+'</strong></td></tr>';
				permissionHTML += '<tr id="folderRow"><td colspan="3" class="spacer subhead"><strong>'+ice.globalVars.byFolderLbl+'</strong></td></tr><tbody>';
				permissionHTML += '</tbody></table>';
				
			$('div#requestPermissionDiv').html(permissionHTML);
			if(jsonPermissionRes.permissionList.permissionPaneContents.length > 0){
				
				for(var i=0; i < jsonPermissionRes.permissionList.permissionPaneContents.length ;i++){
					
					if(jsonPermissionRes.permissionList.permissionPaneContents[i].permissionName != null){
						
						var permissioRow = '<tr><td>'+jsonPermissionRes.permissionList.permissionPaneContents[i].permissionName+'</td>';
						var permissionCode = jsonPermissionRes.permissionList.permissionPaneContents[i].permissionCode;
						
						if(jsonPermissionRes.permissionList.permissionPaneContents[i].isSet){
							var _listdis = ' visibility:hidden; ';
							permissioRow += '<td class="center"><input type="checkbox" checked="checked" disabled="disabled" id='+permissionCode+'>';
						}else{
							if(jsonPermissionRes.permissionList.permissionPaneContents[i].category == 'GLOBAL'){
								var _chkbval = 'gl';
							}
							else{
								var _chkbval = 'fl';
							}
							permissioRow += '<td class="center"><input type="checkbox" onchange="checkEmail(this);" id='+permissionCode+' value="'+_chkbval+'">';
							var _listdis = '';
						}
						permissioRow += '</td>';
						
						if(jsonPermissionRes.permissionList.permissionPaneContents[i].category == 'GLOBAL'){
							var _sbid = 'gl'+permissionCode;
							permissioRow += '<td> <select style="width:150px;'+_listdis+'" id='+_sbid+'  onchange="showEmail(this);"><option>'+ice.globalVars.selectUserLbl+'</option></select></td></tr>';
							$(permissioRow).insertBefore($('table.withborders tr#folderRow'));
							$('<tr style="display:none"><td></td><td></td><td></td></tr>').insertBefore($('table.withborders tr#folderRow'));
						}else{
							var _sbid = 'fl'+permissionCode;
							permissioRow += '<td> <select style="width:150px;'+_listdis+'" id='+_sbid+'  onchange="showEmail(this);"><option>'+ice.globalVars.selectUserLbl+'</option></select></td></tr>';
							$(permissioRow).insertAfter($('table.withborders tr:last'));
							$('<tr style="display:none"><td></td><td></td><td></td></tr>').insertAfter($('table.withborders tr:last'));
						}
						permissioRow = "";
					}
				}
				
				$('table.withborders tr').each(function(){
					var _sbidpart = $(this).find('select').attr('id');
					_sbidpart = _sbidpart+"";
					var _sbid = _sbidpart.substr(0,2);
					//if($(this).find('select').attr('id') == 'gl'){
					if(_sbid == 'gl'){
						for(var index = 0; index < jsonPermissionRes.globalFolderManagerList.length; index++){
							if(loggedInUserCustomerNumber!=jsonPermissionRes.globalFolderManagerList[index].cN){
								$(this).find('select').append('<option value='+jsonPermissionRes.globalFolderManagerList[index].email+'>'+jsonPermissionRes.globalFolderManagerList[index].firstName+" "+jsonPermissionRes.globalFolderManagerList[index].lastName+'</option>');
							}
						}
					}
					//if($(this).find('select').attr('id') == 'fl'){
					if(_sbid == 'fl'){
						for(var index = 0; index < jsonPermissionRes.userList.length; index++){
							if(loggedInUserCustomerNumber!=jsonPermissionRes.userList[index].cN){
								$(this).find('select').append('<option value='+jsonPermissionRes.userList[index].email+'>'+jsonPermissionRes.userList[index].firstName+" "+jsonPermissionRes.userList[index].lastName+'</option>');
							}
						}
					}
				});
				vmf.modal.show("requestPermissionPopup");
				
			}			
			vmf.tablescroll.init('req_permission_tbl',{ height:300, width:525 });
	},
	onFailGetPermissionList: function(){
		$('.error').html(ice.globalVars.unknownErrorMsg);
	}	
};
function showEmail(selector){
	var mail = "mailto:"+$(selector).val();
	var _sbidpart = $(selector).attr('id');
	_sbidpart = _sbidpart+"";
	var _cbid = '#'+_sbidpart.substr(2,_sbidpart.length);
	//Commented below code as per FR-WI-USR-562
	//if($(_cbid).attr('checked') == true){
			//$(selector).parents('tr:eq(0)').next().find('td:last').html('<a id="'+_cbid+'ln" href="'+mail+'">'+$(selector).val()+'</a>');
		//}
		//else{
			//$(selector).parents('tr:eq(0)').next().find('td:last').html($(selector).val());
		//}
	//Added below line of code as per FR-WI-USR-562
	$(selector).parents('tr:eq(0)').next().find('td:last').html('<a id="'+_cbid+'ln" href="'+mail+'">'+$(selector).val()+'</a>');
	if($(selector).val() != "Select User"){
		$(selector).parents('tr:eq(0)').next().show();
	}else{
		$(selector).parents('tr:eq(0)').next().hide();
	}
}

function checkEmail(selector){
	var _permissioncode	=	$(selector).attr('id');
	var selectbid	=	'#'+$(selector).val()+_permissioncode;
	var mail = "mailto:"+$(selectbid).val();
	//Commented below code as per FR-WI-USR-562
	//if($(selector).attr('checked') == true) {
			//$(selectbid).parents('tr:eq(0)').next().find('td:last').html('<a id="'+_permissioncode+'ln" href="'+mail+'">'+$(selectbid).val()+'</a>');
		//}
		//else{
			//$(selectbid).parents('tr:eq(0)').next().find('td:last').html($(selectbid).val());
		//}
	//Added below line of code as per FR-WI-USR-562
	$(selectbid).parents('tr:eq(0)').next().find('td:last').html('<a id="'+_permissioncode+'ln" href="'+mail+'">'+$(selectbid).val()+'</a>');
	if($(selectbid).val() != "Select User"){
		$(selectbid).parents('tr:eq(0)').next().show();
	}else{
		$(selectbid).parents('tr:eq(0)').next().hide();
	}
}