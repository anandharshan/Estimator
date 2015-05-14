vmf.ns.use("ice");
VMFModuleLoader.loadModule("resize", function() {});
ice.mypermission = {
	createFolderFlg : null,
	loaded:true,
    init: function() {
		vmf.scEvent = true;
		myvmware.sdpMyPerm.init();
		callBack.addsc({'f':'riaLinkmy','args':['users-permissions : my-permission']});
        $.regexAddFolder = /^[a-zA-Z0-9!@%&_=\.\+\-\(\)\^\#\$\s]*$/g;
        $.invalidFolderMsg = '<div class=\"textRed\">'+ice.globalVars.invalidFolderMsg +'\!\@\#\$\%\^\&\(\)\-\_\=\+\. \{space\}</div>';
        
        ice.mypermission.handleFolderTree();
        $('.dropdown li').addClass('inactive');
		$('#findFolder').parent('li').removeClass('inactive');
        $('#folderEngineSRC').click(function() {
            $('#folderEngine').toggle();
            return false;
        });

        $('#findFolder').click(function() {
            if(!$(this).hasClass('dummyClick')){
			//$('#folderEngine').toggle();
           vmf.modal.hide();
			setTimeout(function(){
				vmf.modal.show('findFolderContent',{focus:false});
				myvmware.common.putplaceHolder('.searchInput');
			},10);
			}
        });

        $('#createFolder').click(function() {
			var targetDetailsObj = ice.mypermission.getTargetDetailsObj();
            if(!$(this).hasClass('dummyClick')){
               ice.mypermission.populateAddFolderUI(targetDetailsObj);
               $('#folderEngine').hide();
				return false;
			}
        });

        $('#renameFolder').click(function() {
			var targetDetailsObj = ice.mypermission.getTargetDetailsObj();
            if(!$(this).hasClass('dummyClick')){
			if($('#folderId').val().length > 0){
                if($('#folderAccess').val()== 'MANAGE'){
                    ice.mypermission.populateRenameFolderUI(targetDetailsObj);
                }
            }
            $('#folderEngine').hide();
            return false;
}			
        });

        $('#moveFolder').click(function() {	
			var targetDetailsObj = ice.mypermission.getTargetDetailsObj();
            if(!$(this).hasClass('dummyClick')){
			if($('#folderId').val().length > 0){
                if($('#folderAccess').val()== 'MANAGE'){
                    $('.error').html('');
                    ice.mypermission.populateMoveFolderUI(targetDetailsObj);		
                }
            }
            $('#folderEngine').hide();
            return false;
			}
        });

        $('#confirm').click(function() {
            $('#confirm').attr('disabled', true);
            ice.mypermission.confirmAddFolder();
        });
		
		$('#createFolderTable #newFolderId').keypress(function(e){
			if(e.which == 13){
				$(this).addClass('waitcursor');
				$('#confirm').trigger('click');
			}
		});

        $('#renameConfirm').click(function() {
            ice.mypermission.confirmRenameFolder();
        });
		
		$('#listFolderPath').live('change',function(){
			if($(this).val() != 'null'){
				 $('#moveFolderNext').removeAttr('disabled').removeClass('disabled');
			}else{
				$('#moveFolderNext').attr('disabled','disabled').addClass('disabled');
			}
			ice.mypermission.populateTargetFolder();
	   });

        $('#moveFolderconfirm').click(function() {
            ice.mypermission.confirmMoveFolder();
        });

        $('#moveFolderNext').click(function() {
            if ($("#listFolderPath").val()=="null") {
                $('.error').html($msgMoveFolderEmpty);
                return false;
            } else {
                var _sTargetFolder = $("#listFolderPath option:selected").text();
                vmf.modal.hide();
                $('.error').html('');
                
                setTimeout(function(){ice.mypermission.populateConfirmMoveFolderUI(_sTargetFolder);},10);	// to show the second popup from the first popup
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
            ice.mypermission.populateMoveFolderUI(targetDetailsObj);
            setTimeout(function(){ice.mypermission.populateMoveFolderUI(targetDetailsObj);},10);	//to show the second popup from the first popup
        });

        $('#tab1').click(function() {	
            window.location = $renderURLManageAccessByFolder;
        });
        
        $('#tab2').click(function() {
            window.location = $renderURLManageAccessByUser;
        });
        
        $('#tab4').click(function() {	
            window.location = $renderURLManageAccessByContract;
        });

        $("#tab5").click(function() {
            window.location = $renderManageAccessMyEPP;
        });

        $("#tab6").click(function() {
            window.location = $renderManageAccessByServices;
        });

        $('#deleteFolder').click(function() {
			var targetDetailsObj = ice.mypermission.getTargetDetailsObj();
            if(!$(this).hasClass('dummyClick')){
			if($('#folderId').val().length > 0){
                if($('#folderAccess').val()== 'MANAGE'){
                    ice.mypermission.populateDeleteFolderUI(targetDetailsObj);
                }
            }
            $('#folderEngine').hide();
            return false;
			}
        });
        
        $('#deleteFolderConfirm').click(function() {
            ice.mypermission.confirmDeleteFolder();
        });

        $(".modalContent .fn_cancel").click(function(){
            vmf.modal.hide();
            $('.modalContent .button').uncorner();
            return false;
        });
        
		/*Resizing Panes CR Start*/
		vmf.splitter.show('permSplitter',{
			type: "v",
			outline:true,
			minLeft: parseInt($("#permSplitter section.threeZeroZero").width()*.8,10),
			maxLeft: parseInt(($("#permSplitter section.threeZeroZero").width()+ ($("#centerRight section.threeThreeZero").width()*.2)),10),
			sizeLeft:parseInt($("#permSplitter section.threeZeroZero").width(),10),
			resizeToWidth: true,
			accessKey: "R",
			barWidth:false
		});

		vmf.splitter.show("centerRight",{
			type: "v",
			outline:true,
			maxRight: parseInt(($("#centerRight section.twoFourZero").width() + ($("#centerRight section.threeThreeZero").width()*.2)),10),
			minRight: parseInt($("#centerRight section.twoFourZero").width()*.8,10),
			sizeRight: parseInt($("#centerRight section.twoFourZero").width(),10),
			resizeToWidth: true,
			accessKey: "V",
			barWidth:false
		});
		/*Resizing Panes CR End*/
       $(window).trigger("resize");
        //$('#findFolder').css({"color":"#ACE3FF"});
		
		$('#exportToCsvMyPermissions').click(function() {
			var _fPerPostData = new Object();
			if($('#folderId').val() != ''){ // if the folder id is blank then we should not submit from actions menu.
				_fPerPostData['selectedFolders'] = $('#folderId').val();
				_fPerPostData['reportFor'] = 'myPermissionsFromActions';
				myvmware.common.generateCSVreports($exportToCsvActionMyPermissionsUrl, _fPerPostData, "users-permissions : my-permissions : actions : export-all", "users-permissions : my-permissions : Export-to-CSV : Error");
			}
			//var folderId = $('#folderId').val();
			//myvmware.common.generateReports($exportToCsvActionMyPermissionsUrl + '&reportFor=myPermissionsFromActions&folderId=' + folderId);
		});
		
		ice.mypermission.exportToCSV = function(targetDetailsObj){
			var _fPerPostData = new Object();
			_fPerPostData['selectedFolders'] = targetDetailsObj.fId;
			_fPerPostData['reportFor'] = 'myPermissionsFromContextMenu';
			myvmware.common.generateCSVreports($exportToCsvActionMyPermissionsUrl, _fPerPostData, "users-permissions : my-permissions : contextmenu : export-all", "users-permissions : my-permissions : Export-to-CSV : Error");
			//var folderId = targetDetailsObj.fId;
			//myvmware.common.generateReports($exportToCsvActionMyPermissionsUrl + '&reportFor=myPermissionsFromContextMenu&folderId='+ folderId);
		};

		$('#exportAllToCsvButton').click(function() {
			var _fPerPostData = new Object();
			_fPerPostData['selectedFolders'] = "ALL";
			_fPerPostData['selectedUserCustomerNumber'] = "ALL";
			_fPerPostData['reportFor'] = 'myPermissionsFromExportAllButton';
			myvmware.common.generateCSVreports($exportToCsvActionMyPermissionsUrl, _fPerPostData, "users-permissions : my-permissions : export-all", "users-permissions : my-permissions : Export-to-CSV : Error");
			//myvmware.common.generateReports($exportToCsvActionMyPermissionsUrl + '&reportFor=myPermissionsFromExportAllButton&folderId=ALL&selectedUserId=ALL');
		});

		$('#eaSelectorDropDown').change(function() {
			setTimeout(function(){
				$(window).trigger("resize");	
			},5000);
		});
		myvmware.common.showMessageComponent('USER_PERMISSION');
		ice.mypermission.showBeak();
    },
	showBeak:function(){
		myvmware.common.setBeakPosition({
			beakId:myvmware.common.beaksObj["SDP_BEAK_USERPERMISSION_BYSERVICE"],
			beakName:"SDP_BEAK_USERPERMISSION_BYSERVICE",
			beakHeading:$byServiceBeakHeading,
			beakContent:$byServiceBeakContent,
			target:$("#tab6"),
			beakUrl:'//download3.vmware.com/microsite/myvmware/sdpcust2/index.html',
			beakLink:'#beak7'
		});
	},
    handleFolderTree: function() {
		//Call Services
		$("#serviceList").empty();
		ser.getServices();
		ice.mypermission.loaded=false
        $('#folderPermissionPane').html('<div id="permissionStaticText" class="center_text">'+$staticTextPermissionPane+'</div>'); /*BUG-00030973 & BUG-00033598*/
		$('#licenseFolderManagers').html('');
		
		var config = new Object();
		config.uniqueDiv = $portletNS;
		config.ajaxTimeout = 60000;
		config.wrapEllipseBtn = true;
		//$('#content-container .settings-cog .dropdown li').css('border-color', '#FFFFFF');
		config.npMsgContent = folder_config_npMsgContent;
		config.npMsgFunction = function(msg) {
			ice.mypermission.showExceptionMessages(msg);
		};
		config.cbOnClickFunction = function(folderId, cbState) {
			if($('.'+folderId).children('span').hasClass('active')){
				$('.folderTxt').removeClass('normalWhiteSpace');
				$('.'+folderId).children('span').find('.folderTxt').addClass('normalWhiteSpace').end().find('.openClose,input,.ellipsBadge').addClass('vAlignChilds');
			} else {
				$('.'+folderId).children('span').find('.folderTxt').removeClass('normalWhiteSpace').end().find('.openClose,input.ellipsBadge').removeClass('vAlignChilds');
			}
			ice.mypermission.folderTreeCBClick(folderId, cbState)
		};
		config.validateJSONFunction = function(folderListJSON) {
			if(folderListJSON.error){
				ice.mypermission.showExceptionMessages(folderListJSON.message);
			}
		};
		config.errorFunction = function(response, errorDesc, errorThrown) { 
			ice.mypermission.showExceptionMessages(response.responseText);
		};
		
		config.cbOnFolderNodeCreate = function(folderElement,folderIds) { 
			if(folderElement.find('li span').hasClass('disabled')){ 
				folderElement.find('li input[type=radio]').parent().append('<a class="tooltip" title="'+manageAccessTooltipMessage+'" data-tooltip-position="bottom" href="#">Help Text</a>'); 
				} 
				myvmware.hoverContent.bindEvents($('a.tooltip'), 'defaultfunc'); 
				ice.mypermission.adjustHt();
		};

		config.loadComplete = function () {//Start of Context Menu CR Code
		    //Show loading is services are yet to be loaded
			ice.mypermission.loaded=true;
			if(!ser.loaded) $(".loadingDiv").show();
			var map = [

			{
				id: 'create_folder',
				text: ice.globalVars.createFolderLbl,
				liCls: 'inactive',
				callBk: ice.mypermission.populateAddFolderUI
			}, {
				id: 'delete_folder',
				text: ice.globalVars.deleteFolderLbl,
				liCls: 'inactive',
				callBk: ice.mypermission.populateDeleteFolderUI
			}, {
				id: 'request_access',
				text: ice.globalVars.requestPermLbl,
				liCls: 'active',
				callBk: ice.requestAccessPermissions.populateEditPermissionUI
			}, {
				id: 'move_folder',
				text: ice.globalVars.moveFolderLbl,
				liCls: 'inactive',
				callBk: ice.mypermission.populateMoveFolderUI
			}, {
				id: 'rename_folder',
				text: ice.globalVars.renameFolderLbl,
				liCls: 'inactive',
				callBk: ice.mypermission.populateRenameFolderUI
			}, {
				id: 'permissions_exportToCSV',
				text: ice.globalVars.exportToCsvLbl,
				liCls: 'inactive',
				callBk: ice.mypermission.exportToCSV
			}];


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
						if(fManage != 'MANAGE'){
							ice.mypermission.checkFolderPermissions(target);
						}
						if($(target).closest('li').data('fManage') == 'MANAGE'){
							ice.mypermission.setContextMenuState(target,cmenu,disableMnu);
						}
						cmenu.find('a#request_access').removeClass(disableMnu).parent('li').removeClass('inactive');
						
						//on right click if the folder has View permissions then we need enable the export to csv.
						var className = $(target).closest('span').parent('span').attr('class');
						if(className.indexOf('disabled') == -1){
							cmenu.find('a#permissions_exportToCSV').removeClass(disableMnu).parent('li').removeClass('inactive');
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
			ice.mypermission.setCreateFolderPerm();

			myvmware.common.adjustFolderNode(false);
			setTimeout("ice.mypermission.adjustTabBtns()",3000);

		};//End of Context Menu CR Code
		config.inputType = 'radio';
		config.loadingClass = 'loading';
		$("#fullFolderPath").val('');
		$("#selectedFolderName").val('');
		$("#folderId").val(''); 
		$("#folderAccess").val('');
		$('.helpLink').css({'right':'0px','top':'17px'});
		vmf.foldertree.build($myPermissionFolderListJSON,config);
    },
    folderTreeCBClick : function(folderId, cbState) {
        var folderHT = vmf.foldertree.getFolderHashtable();
		var folderTreeObj = vmf.foldertree.getFolderJSON();
		$.rootFolder = '';
		$("#fullFolderPath").val('');
		$("#selectedFolderName").val('');
		$("#folderId").val('');
		$("#folderAccess").val('');
		$("#parentFolderId").val('');
		if (cbState == "checked") {
			$('#licenseFolderManagers').html('');
			var _fullFolderPath = folderHT.get(folderId).fullFolderPath;
			var _selectedFolderName = folderHT.get(folderId).folderName;
			var folderAccess = folderHT.get(folderId).folderAccess; 
			var parentFolderId = folderHT.get(folderId).parentFolderId;
			$("#parentFolderId").val(parentFolderId);
			$("#fullFolderPath").val(_fullFolderPath);
			$("#selectedFolderName").val(_selectedFolderName);
			$("#folderId").val(folderId);
			$.rootFolder = folderHT.get(folderId).folderType;
			//$("#folderAccess").val(folderAccess);
		    //if(folderAccess== 'MANAGE')
			//	$('.settings-cog .dropdown ul li a').css({"color":"#ACE3FF"});			
			//else
			//	$('.settings-cog .dropdown ul li a').css({"color":"#CCCCCC"});
            $('.settings-cog .dropdown ul li a').each(function(idx, val) {
                if(idx != 2) {
                    $(this).removeAttr('style');
					$(this).removeClass('dummyClick');
                }
            });
			ice.mypermission.loadSelectedFolderPermissions(folderId);
			$('#selectedFolderId').val(folderId);
		}
		else {
			//$('#content-container .settings-cog .dropdown ul').removeAttr('id');
			//$('#content-container .settings-cog .dropdown li').css('background', '#ccc');
		}
    },
    loadSelectedFolderPermissions: function(slectedFolderId) {
		var folderjsonresponse;
		$('#permissionStaticText').hide();
		$('#licenseFolderManagers').show();
		var permissionDataUrl = $folderPermissionUrl + '&selectedFolderId=' + slectedFolderId;
		var loading_txt = '<div class="loading"><span class="loading_small"> '+ $permissionPane_loading_staticText +'</span></div>'
		$('#folderPermissionPane').html(loading_txt);
		$.post(permissionDataUrl, function(data){
			folderjsonresponse = vmf.json.txtToObj(data);
            //Store folder permission
            var _minPermission = ice.mypermission.convertFullPermToMinPerm(folderjsonresponse);
            vmf.foldertree.storePermission(slectedFolderId, _minPermission);
			//testing the folder access by moving from folderTreeCBClick
            var _folderHT = vmf.foldertree.getFolderHashtable();
			var folderAccess = _folderHT.get(slectedFolderId).folderAccess;
			$("#folderAccess").val(folderAccess);			
			if(folderAccess== 'MANAGE')						
				ice.mypermission.disableEnableLinks('applyActive', $('.settings-cog .dropdown ul li a'));			
			else
				ice.mypermission.disableEnableLinks('applyInActive', $('.settings-cog .dropdown ul li a'));
				
			if(folderAccess== 'VIEW')	//BUG-00047202
				ice.mypermission.disableEnableLinks('applyActive', $('.settings-cog .dropdown ul li a#exportToCsvMyPermissions'));
				
			if($.rootFolder == 'ROOT'){
					$('.dropdown li').each(function(){
						if($(this).find('a').attr('id')=='createFolder' || $(this).find('a').attr('id')=='findFolder'  || $(this).find('a').attr('id')=='exportToCsvMyPermissions')
							ice.mypermission.disableEnableLinks('applyActive', $(this).find('a'));
						else 
							ice.mypermission.disableEnableLinks('applyInActive', $(this).find('a'));
					});
			}
			ice.mypermission.disableEnableLinks('applyActive', $('a#requestPermissionLink'));
			//testing the folder access by moving from folderTreeCBClick
			if(folderjsonresponse.permissionList && folderjsonresponse.permissionList.permissionPaneContents.length!=0){
				var strHTML = '<table class="scrollTable">';
				strHTML += '<tbody class="scrollContent">';
				/* strHTML += '<tr class="row_header">';
				strHTML +='<td colspan="2">Global</td>';
				strHTML +='</tr>'; */
				for(var i=0;i<folderjsonresponse.permissionList.permissionPaneContents.length ;i++){
					if(folderjsonresponse.permissionList.permissionPaneContents[i].permissionName !=null){
						if(folderjsonresponse.permissionList.permissionPaneContents[i].category=='GLOBAL'){
							strHTML += '<tr>';
							if(folderjsonresponse.permissionList.permissionPaneContents[i].level==1){
								strHTML += '<td class="col1 pad_left">'+folderjsonresponse.permissionList.permissionPaneContents[i].permissionName+'</td>';
							} else {
								strHTML += '<td class="col1">'+folderjsonresponse.permissionList.permissionPaneContents[i].permissionName+'</td>';
							}
							if(folderjsonresponse.permissionList.permissionPaneContents[i].isSet){
		                		strHTML += '<td class="col2"><img src="/static/myvmware/common/img/dot.png" alt="'+ $staticTextfortick +'" title="'+ $staticTextfortick +'" />';
							}else{
		                		strHTML += '<td class="col2"><img src="/static/myvmware/common/img/cross.png" alt="'+ $staticTextforcross +'" title="'+ $staticTextforcross +'" />';
		            		}
							if(!folderjsonresponse.permissionList.permissionPaneContents[i].isLoggedInUserCanEdit){
	                			strHTML += '<img src="/static/myvmware/common/img/lock.png" alt="'+ $staticTextforLock +'" title="'+ $staticTextforLock +'" />';
	                		}
							strHTML += '</td>';
							strHTML += '</tr>';
						}
			  		}
				}
			/* strHTML += '<tr class="row_header">';
			strHTML +='<td colspan="2">By Folder</td>';
			strHTML +='</tr>'; */
			for(var i=0;i<folderjsonresponse.permissionList.permissionPaneContents.length ;i++){
				if(folderjsonresponse.permissionList.permissionPaneContents[i].permissionName !=null){
					if(folderjsonresponse.permissionList.permissionPaneContents[i].category=='FOLDER'){
						strHTML += '<tr>';
						if(folderjsonresponse.permissionList.permissionPaneContents[i].level==1){
							strHTML += '<td class="col1 pad_left">'+folderjsonresponse.permissionList.permissionPaneContents[i].permissionName+'</td>';
						} else {
							strHTML += '<td class="col1">'+folderjsonresponse.permissionList.permissionPaneContents[i].permissionName+'</td>';
						}
						if(folderjsonresponse.permissionList.permissionPaneContents[i].isSet){
		                	strHTML += '<td class="col2"><img src="/static/myvmware/common/img/dot.png" title="'+ $staticTextfortick +'" alt="'+ $staticTextfortick +'" />';
						}else{
		                	strHTML += '<td class="col2"><img src="/static/myvmware/common/img/cross.png" title="'+ $staticTextforcross +'" alt="'+ $staticTextforcross +'" />';
		            	}
						if(!folderjsonresponse.permissionList.permissionPaneContents[i].isLoggedInUserCanEdit){
	                		strHTML += '<img src="/static/myvmware/common/img/lock.png" title="'+ $staticTextforLock +'" alt="'+ $staticTextforLock +'" />';
	                	}
						strHTML += '</td>';
						strHTML += '</tr>';
					}
			  	}
			}
			strHTML += '</tbody>';
			strHTML += '</table>';
		}else{
			strHTML = '<br>';
			strHTML += $msgNoPermissionExist;
		}
		/*loading of folder manager details*/ 
		$('#folderPermissionPane').html(strHTML);
		if(folderjsonresponse!=null){
			var folderManagerHTML = '';
			    folderManagerHTML += '<div class="introText">' + $rightPaneInsText + '</div>';
			    folderManagerHTML += '<ul class="icons ">';
				
				for(var j=0;j<folderjsonresponse.userList.length ;j++){
				var userRole = "";
				var htm="";
				
				if(folderjsonresponse.userList[j].superPermission && folderjsonresponse.userList[j].procPermission && folderjsonresponse.userList[j].folderAdmin && $('li.'+slectedFolderId).attr('level') != 0){
				userRole='spa';
				htm='<a href="#" class="hreftitle" title="'+$staticTextforSUPUA+'" alt="'+$staticTextforSUPUA+'">'+$staticTextforSUPUA+'</a>';
			}else if(folderjsonresponse.userList[j].superPermission && folderjsonresponse.userList[j].procPermission){
				userRole='sp';
				htm='<a href="#" class="hreftitle" title="'+$staticTextforSUPC+'" alt="'+$staticTextforSUPC+'">'+$staticTextforSUPC+'</a>';
			}else if(folderjsonresponse.userList[j].superPermission && folderjsonresponse.userList[j].folderAdmin && $('li.'+slectedFolderId).attr('level') != 0){
				userRole='sa';
				htm='<a href="#" class="hreftitle" title="'+$staticTextforSUA+'" alt="'+$staticTextforSUA+'">'+$staticTextforSUA+'</a>';
			}else if(folderjsonresponse.userList[j].procPermission && folderjsonresponse.userList[j].folderAdmin && $('li.'+slectedFolderId).attr('level') != 0){
				userRole='pa';
				htm='<a href="#" class="hreftitle" title="'+$staticTextforPUA+'" alt="'+$staticTextforPUA+'">'+$staticTextforPUA+'</a>';
			}else if(folderjsonresponse.userList[j].folderAdmin && $('li.'+slectedFolderId).attr('level') != 0){
				userRole='ad';
				htm='<a href="#" class="hreftitle" title="'+$staticTextforA+'" alt="'+$staticTextforA+'">'+$staticTextforA+'</a>';
			}else if(folderjsonresponse.userList[j].superPermission){
				userRole='s';
				htm='<a href="#" class="hreftitle" title="'+$staticTextforSU+'" alt="'+$staticTextforSU+'">'+$staticTextforSU+'</a>';
			}else if(folderjsonresponse.userList[j].procPermission){
				if(userRole==''){
					userRole='p';
					htm='<a href="#" class="hreftitle" title="'+$staticTextforPC+'" alt="'+$staticTextforPC+'">'+$staticTextforPC+'</a>';
				}else{
					userRole='sp';
					htm='<a href="#" class="hreftitle" title="'+$staticTextforSUPC+'" alt="'+$staticTextforSUPC+'">'+$staticTextforSUPC+'</a>';
				}
			}
				
				
				
				/*if(folderjsonresponse.userList[j].superPermission && folderjsonresponse.userList[j].procPermission && folderjsonresponse.userList[j].folderAdmin){
					userRole="spa";
					htm='<a href="#" class="hreftitle" title="'+$staticTextforSUPUA+'" alt="'+$staticTextforSUPUA+'">'+$staticTextforSUPUA+'</a>';
				}
				if(folderjsonresponse.userList[j].procPermission){
					userRole="p";
					htm='<a href="#" class="hreftitle" title="'+$staticTextforPC+'" alt="'+$staticTextforPC+'">'+$staticTextforPC+'</a>';
				}
				if((folderjsonresponse.userList[j].superPermission) && (folderjsonresponse.userList[j].procPermission)){
					userRole="sp";
					htm='<a href="#" class="hreftitle" title="'+$staticTextforSUPC+'" alt="'+$staticTextforSUPC+'">'+$staticTextforSUPC+'</a>';
				}*/
				if(userRole == ""){
					userRole = 'without_icon';
				}
				
				folderManagerHTML += '<li class="'+userRole+'">';
				folderManagerHTML += '<label>'+ htm +' '+folderjsonresponse.userList[j].firstName+'&nbsp;'+folderjsonresponse.userList[j].lastName+
				'<br><a href=\"mailto:' + folderjsonresponse.userList[j].email + '\">'+ice.common.wordwrap('',folderjsonresponse.userList[j].email,'25','<br>','true')+'</a></label>';
				folderManagerHTML += '</li>'; 

				}
				
				$('#licenseFolderManagers').html(folderManagerHTML);
				//$('.introText').css({'padding':'11px 10px 9px 15px'});
				myvmware.common.setAutoScrollWidth('#licenseFolderManagers ul.icons');
			}

		});
		$('#content-container table td img').css({'margin-right':'0px'});
		$('.indent30').css({'text-indent': '30px'});
	},
    populateAddFolderUI: function(targetDetailsObj) { 
        //ice.common.wordwrap('location', '\\\\'+targetDetailsObj.fPath,'50','</br>','true');
		//$("#location").html($("#fullFolderPath").val());
		$('.error').html('');
		riaLinkmy('users-permissions : my-permission : create-folder');
		var _foldersContentDataUrl = $loggedInUserFoldersWithManagepermissionUrl;
		var _folderPathHTML = new Array();
		var _currentfolderPath = targetDetailsObj.fPath;
		var _parentFolderId = targetDetailsObj.parentfId;
		$.post(_foldersContentDataUrl, function(data)
		{
			
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
				vmf.dropdown.build($("select#listFolderPathCreate"), {optionsDisplayNum:20,optionMaxLength:37,inputMaxLength:37,position:"left",onSelect:ice.mypermission.activateSaveBtn,optionsClass:'overlayOpts',optionsHolderInline:true});
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
    populateDeleteFolderUI: function(targetDetailsObj) { 
        ice.common.wordwrap('deleteFolderLocation', '\\\\'+targetDetailsObj.fPath,'50','</br>','true');
        $('.error').html('');
	//vmf.modal.show("deleteFolderFailureContent");
	$('#deleteFolderConfirm').data({fPath:targetDetailsObj.fPath,fId:targetDetailsObj.fId,fName:targetDetailsObj.fName});
	setTimeout(function(){vmf.modal.show("deleteFolderContent");},10);// to show the second popup (As raghavendra suggested for fixing IE compat.. , we added settimeout() )
	},
    populateRenameFolderUI: function(targetDetailsObj) { 
        ice.common.wordwrap('existingFolderName', '\\\\'+targetDetailsObj.fPath,'50','</br>','true');
        $('.error').html('');
		myvmware.common.putplaceHolder('#renameFolderId');
		$('#renameConfirm').data({fPath:targetDetailsObj.fPath,fId:targetDetailsObj.fId});
		riaLinkmy('users-permissions : my-permission : rename-folder');
        vmf.modal.show("renameFolderContent");
    },
    confirmAddFolder: function(){ 
        _newfolderName = $("#newFolderId").val();
        if(_newfolderName.length > 0) {
            _folderid = $("#listFolderPathCreate option:selected").val();
            _fullFolderPath = $('#confirm').data('fPath');
            var duplicate = vmf.foldertree.duplicateFolder(_folderid, _newfolderName);
            if(duplicate) {
                $('.error').html(ice.globalVars.duplicateFolderMsg);
            }
            else if(!(_newfolderName.match($.regexAddFolder))) {
                $('.error').html($.invalidFolderMsg);
            }
            else {
                $('#confirm').attr('disabled',true).addClass('waitcursor');//BUG-00021672
                var addFolderUrl = $myPermissionAddFolderUrl;
                    
                var _postData = new Object();
                _postData['selectedFolderId'] = _folderid;
                _postData['newFolderName'] = _newfolderName;
                $.ajax({
                    type: 'POST',
                    url: addFolderUrl,
                    data: _postData,
                    success: function (data) {
                        ice.mypermission.onSuccess_createFolder(data);
                    },
                    error: function (response, errorDesc, errorThrown) {
                        console.log("In error: " + errorThrown);
                        ice.mypermission.onFail_createFolder(errorThrown);
                    }
                });
            }
        }
        else {
            $('.error').html($msgPermissionEnterFolName);
        }
    },
    confirmRenameFolder: function() { 
       _newfolderName = $("#renameFolderId").val();
    
         if((_newfolderName.length > 0) && (_newfolderName != ice.globalVars.folderName)){
            _folderid = $('#renameConfirm').data('fId');
            _fullFolderPath = $('#renameConfirm').data('fPath');
            var duplicate = vmf.foldertree.duplicateFolder(_folderid, _newfolderName);
            if(duplicate) {
                $('.error').html(ice.globalVars.duplicateFolderMsg);
            }
            else if(!(_newfolderName.match($.regexAddFolder))) {
                $('.error').html($.invalidFolderMsg);
            }
            else {
                $('#confirm').attr('disabled',true).addClass('waitcursor');//BUG-00021672
                var renameFolderUrl = $myPermissionRenameFolderUrl;
                    
                var _postData = new Object();
                _postData['selectedFolderId'] = _folderid;
                _postData['newFolderName'] = _newfolderName;
                $.ajax({
                    type: 'POST',
                    url: renameFolderUrl,
                    data: _postData,
                    success: function (data) {
                        ice.mypermission.onSuccess_renameFolder(data);
                    },
                    error: function (response, errorDesc, errorThrown) {
                        console.log("In error: " + errorThrown);
                        ice.mypermission.onFail_renameFolder(errorThrown);
                    }
                });
            }
        }
        else {
            $('.error').html($msgPermissionEnterFolName);
        }
     },
    
    onSuccess_createFolder : function(data){
	var errorMessage = vmf.json.txtToObj(data);
	if(errorMessage!=null && errorMessage.error){
		$('.error').html($msgPermissionFolderExist);
                $('#confirm').attr('disabled',false).removeClass('waitcursor');//BUG-00021672
		return;
	}else{
			vmf.modal.hide();
			location.reload();
		}
	},
    
    onFail_createFolder : function(data){
	$('#confirm').attr('disabled',false).removeClass('waitcursor');//BUG-00021672
        $('.error').html($msgPermissionUnknownError);
        //$('#confirm').attr('disabled', false);
		$('#createFolderTable #newFolderId').removeClass('waitcursor');
	},
    
    onSuccess_renameFolder : function(data){
		var errorMessage = vmf.json.txtToObj(data);
		if(errorMessage!=null && errorMessage.error){
			$('#renameConfirm').attr('disabled',false).removeClass('waitcursor');//BUG-00021672
			$('.error').html($msgPermissionFolderExist);
			return;
		}else{
				vmf.modal.hide();
				location.reload();
			}
	},
    
    onFail_renameFolder : function(data){
		$('#renameConfirm').attr('disabled',false).removeClass('waitcursor');//BUG-00021672
		$('.error').html($msgPermissionUnknownError);
	},
    
    confirmDeleteFolder : function(){ 
			$('#deleteFolderConfirm').attr('disabled',true).addClass('waitcursor');//BUG-00021672
			_folderid = $('#deleteFolderConfirm').data('fId');
			_fullFolderPath = $('#deleteFolderConfirm').data('fPath');
			var deleteFolderUrl = $myPermissionDeleteFolderUrl+ '&selectedFolderId=' + _folderid;
				
				vmf.ajax.post(deleteFolderUrl,
						null, 
						ice.mypermission.onSuccess_deleteFolder, 
						ice.mypermission.onFail_deleteFolder);
    },
    
    onSuccess_deleteFolder : function(data){
		var _deleteErrmsg = vmf.json.txtToObj(data);
		if(_deleteErrmsg!=null && _deleteErrmsg.error){
			vmf.modal.hide();
			$('#deleteFolderConfirm').attr('disabled',false).removeClass('waitcursor');//BUG-00021672
			$("#deleteFolderName").html($("#deleteFolderConfirm").data('fName'));
			$("#deleteFolderNameTwo").html($("#deleteFolderConfirm").data('fName'));
			$('#error').html(_deleteErrmsg.message);// BUG-00019110
			vmf.modal.hide("deleteFolderContent");
			ice.mypermission.showDeleteFailureContent();
		}else{
			vmf.modal.hide();
			location.reload();
		}
	},	
	showDeleteFailureContent: function (data) {
		setTimeout(function(){vmf.modal.show("deleteFolderFailureContent");},10);// to show the second popup (As raghavendra suggested for fixing IE compat.. , we added settimeout() )	
	},
    
    onFail_deleteFolder : function(data){
                $('#deleteFolderConfirm').attr('disabled',false).removeClass('waitcursor');//BUG-00021672
		$('.error').html($msgPermissionUnknownError);
	},
	
    populateMoveFolderUI : function(targetDetailsObj) { 		
		$("#moveFolderName").html('');
		ice.common.wordwrap('moveFolderName', '\\\\'+targetDetailsObj.fPath,'50','</br>','true');		
		var foldersContentDataUrl =  $loggedInUserFoldersWithManagepermissionUrl;
		var folderPathHTML = new Array();
		var currentfolderPath = targetDetailsObj.fPath;
		var parentFolderId = targetDetailsObj.parentfId;
            $.post(foldersContentDataUrl, function(data)
				{
			/*var foldersContentJsonResponse = vmf.json.txtToObj(data);				
			folderPathHTML += "<select id='listFolderPath'>";
			folderPathHTML += '<option value="null"></option>';				
		      		   //var folderContentsList = foldersContentJsonResponse.folderContents;
		               var folderContentsLength = foldersContentJsonResponse.folderPathList.length;
                     //  var folderReadTime = foldersContentJsonResponse.folderCacheTimestamp;
    	             //   $("#folderCacheTimestamp").val(folderReadTime);
		        				
				for(var i=0;i<folderContentsLength;i++){        	  
		           // var fullFolderPath=folderContentsList[i].fullFolderPath;
		          //  var folderAccess=folderContentsList[i].folderAccess;
		           // var folderId=folderContentsList[i].folderId;		              
		            if(foldersContentJsonResponse.folderPathList[i].folderId != parentFolderId && (foldersContentJsonResponse.folderPathList[i].fullFolderPath.indexOf(currentfolderPath)<0)) {
                                  	 
			            	  folderPathHTML += "<option value="+foldersContentJsonResponse.folderPathList[i].fullFolderPath+">"+foldersContentJsonResponse.folderPathList[i].fullFolderPath+"</option>";
			                  
		            }
		        }
				
		        folderPathHTML += "</select>";
		        $("#fullFolderPathList").html('');
		        $("#fullFolderPathList").append(folderPathHTML);*/
				var foldersContentJsonResponse = vmf.json.txtToObj(data);
				folderPathHTML.push("<select id='listFolderPath' class='wide'><option value=\"null\">"+ice.globalVars.selectDefault+"</option>");
				$.each(foldersContentJsonResponse.folderPathList, function(){
					if(this.folderId!=parentFolderId && this.fullFolderPath.indexOf(currentfolderPath)<0)
					folderPathHTML.push("<option value='"+this.fullFolderPath+"'>"+this.fullFolderPath+"</option>");
				});
				folderPathHTML.push("</select>");
				$("#fullFolderPathList").html(folderPathHTML.join(' '));
				$(".overlayOpts").remove();
				vmf.dropdown.build($("select#listFolderPath"), {optionsDisplayNum:20,ellipsisSelectText:false,ellipsisText:'',optionMaxLength:37,inputMaxLength:37,position:"left",onSelect:ice.mypermission.activateMoveContinueBtn,optionsClass:'overlayOpts',optionsHolderInline:true});
				});
			$('#moveFolderconfirm').data({fPath:targetDetailsObj.fPath,fId:targetDetailsObj.fId,fName:targetDetailsObj.fName,parentfId:targetDetailsObj.parentfId});
			vmf.modal.show("moveFolderContent");
	},
	activateMoveContinueBtn: function(value,text,index){
		if(value!="null"){
			$('#moveFolderNext').removeAttr('disabled').removeClass('disabled');
		} else {
			$('#moveFolderNext').attr('disabled','disabled').addClass('disabled');
		}
		ice.mypermission.populateTargetFolder();
	},
    populateTargetFolder : function(selectedTarget) {	
		$("#targetFolderLocation").html('');
		$("#targetFolderLocation").append(selectedTarget);
	},
    
    populateConfirmMoveFolderUI : function(selectedTarget) {
		$("#sourceFolderName").html('');
		$("#sourceFolderName").append($('#moveFolderconfirm').data('fName'));
        ice.mypermission.populateTargetFolder(selectedTarget);
		vmf.modal.show("confirmMoveFolderContent");
	},
    
    confirmMoveFolder : function() {
			$('#moveFolderconfirm').attr('disabled',true).addClass('waitcursor');//BUG-00021672
			var selectedFolderID = $('#moveFolderconfirm').data('fId');
			var selectedFolderName = $('#moveFolderconfirm').data('fName');
			var targetFullFolderPath = $("#targetFolderLocation").text();			
			var folderReadTime = $("#folderCacheTimestamp").val();
			var moveFolderUrl = $myPermissionMoveFolderUrl + '&selectedFolderId=' +selectedFolderID + '&targetFullFolderPath=' +targetFullFolderPath  +'&folderReadTime='+folderReadTime;
			vmf.ajax.post(moveFolderUrl,
					null, 
					ice.mypermission.onSuccess_moveFolder, 
					ice.mypermission.onFail_moveFolder);	
	},
    
    onSuccess_moveFolder : function(data) {
		var errorMessage = vmf.json.txtToObj(data);						
		if (errorMessage!=null && errorMessage.error) {
		$('#moveFolderconfirm').attr('disabled',false).removeClass('waitcursor');//BUG-00021672
			if (errorMessage.message != null) {					
				$('.error').html(errorMessage.message);
			} 
            else {	
                $('.error').html($msgPermissionMoveFolderError);
			} 
		} 
        else {	
			vmf.modal.hide();
			location.reload();
		}
	},
    
    onFail_moveFolder : function(data) {
                $('#moveFolderconfirm').attr('disabled',false).removeClass('waitcursor');//BUG-00021672
		$('.error').html($msgPermissionMoveFolUnknownError);
	},
    
    convertFullPermToMinPerm: function(fullPermission) {
        var _folderPermission = new Object();
        _folderPermission['view'] = fullPermission.permissionList.permissionPaneContents[3].isSet;
        _folderPermission['manage'] = fullPermission.permissionList.permissionPaneContents[4].isSet;
        _folderPermission['divComb'] = fullPermission.permissionList.permissionPaneContents[5].isSet;
        _folderPermission['upgDwg'] = fullPermission.permissionList.permissionPaneContents[6].isSet;
        return _folderPermission;
    },
    
    showExceptionMessages : function(message) { 
		//$('#manageAccessExceptionMessage').html(message);
		//vmf.modal.show("manageAccessExceptionMessagePopup");
	},
	disableEnableLinks: function(flag, linkIds){ 
		if(flag == 'applyInActive')		
				linkIds.addClass('dummyClick').parent('li').addClass('inactive');			
		else if(flag == 'applyActive')			
				linkIds.removeClass('dummyClick').parent('li').removeClass('inactive');
	},
	getTargetDetailsObj:function(){
		var targetDetailsObj = {
					fPath :$('#fullFolderPath').val(),
					fId :$('#folderId').val(),
					fName:$('#selectedFolderName').val(),
					parentfId:$('#parentFolderId').val()
		};
		return targetDetailsObj;
	},
	checkFolderPermissions: function(target){
		var _fPerPostData = new Object(),permissionDataUrl,
			folderId = $(target).closest('li').data('folderId');
			_fPerPostData['selectedFolders'] = folderId;
			permissionDataUrl = $folderPermissionUrl + '&selectedFolderId=' + folderId;
			vmf.ajax.post(permissionDataUrl,_fPerPostData,ice.mypermission.onsuccess_getPerm(target),ice.mypermission.onfailure_getPerm,null,null,null,false);
	},
	onsuccess_getPerm: function(target){
		return function(folderPermission){
			var json=(typeof folderPermission!="object")?vmf.json.txtToObj(folderPermission):folderPermission;
			$(target).closest('li').data({fManage:json.permissionList.folderAccess});
		}
	},
	onfailure_getPerm: function(){
		//alert("");
	},
	setContextMenuState:function(target,cmenu,disableMnu){
		var ftype = $(target).closest('li').data('ftype');
		if (ftype == 'ROOT') {
			cmenu.find('li').each(function () {
				if ($(this).find('a').attr('id') == 'create_folder' || $(this).find('a').attr('id') == 'permissions_exportToCSV') {
					$(this).find('a').removeClass(disableMnu);
					$(this).removeClass('inactive');
				} else {
					$(this).find('a').addClass(disableMnu);
				}
			});
		} else if (ftype == "ASP" || ftype == "CPL" || ftype == "VCE") { // if it is not ROOT folder  and type is "ASP","CPL","VCE"
			cmenu.find('a').addClass(disableMnu); // On first load, the disable class is not assigned
			cmenu.find('a#rename_folder').removeClass(disableMnu).parent('li').removeClass('inactive');
			$('#folderPane input[type=checkbox]').closest('span').removeClass('hover');
		} else { //if it is not ROOT folder  and  not "ASP","CPL","VCE"
			cmenu.find('a').removeClass(disableMnu).parent('li').removeClass('inactive');
		}

	},
	setCreateFolderPerm:function(){
		if(ice.mypermission.createFolderFlg == null){
			vmf.ajax.post($loggedInUserFoldersWithManagepermissionUrl,null,function(data){
				var json=(typeof data!="object")?vmf.json.txtToObj(data):data;
				if(json.folderPathList.length){
					$('.dropdown').find('a#createFolder').removeClass('dummyClick').parent('li').removeClass('inactive');
					ice.mypermission.createFolderFlg = true;
				} else {
					$('.dropdown').find('a#createFolder').addClass('dummyClick').parent('li').addClass('inactive');
					ice.mypermission.createFolderFlg = false;
				}
			},function(){
				/*error*/
			});
		} else if (ice.mypermission.createFolderFlg) {
			$('.dropdown').find('a#createFolder').removeClass('dummyClick').parent('li').removeClass('inactive');
		}
	},
	adjustHt: function(){
		myvmware.common.adjustPanes();
		var cHeight = ($("#content-section").height() > parseInt($("#content-section").css("min-height")))? parseInt($("#content-section").css("min-height")) : $("#content-section").height();
		var folderHeight = $("section.column .scroll").height()+(cHeight-$("#manageAccess").height());
		folderHeight = (folderHeight>428)? folderHeight: 428;
		$("#mySplitter").height(folderHeight+$("section.column header").height()+"px");
		$("section.splitter-pane").height(folderHeight+$("section.splitter-pane header").outerHeight()+"px");
		$("section.column .scroll,.splitter-bar").height(folderHeight+"px");
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
	myvmware.common.adjustFolderNode(true);
	ice.mypermission.adjustTabBtns();
};
//window.onresize=ice.mypermission.adjustHt;

window.onresize = function(){
	ice.mypermission.adjustHt();
	ice.mypermission.adjustTabBtns();
};

if (typeof myvmware == "undefined") myvmware = {};
myvmware.sdpMyPerm = {
    init : function(){
        ser = myvmware.sdpMyPerm;
        ser.loaded = false;
        ser.onPremiseTenant = false,
        ser.roleMap = {"super": "s","proc": "p","admin": "a","manage": ""}; //Replace permission with class
        ser.roleDef = {"s": rs.SU,"p": rs.PC,"sp": rs.SUPC,"spa": rs.SUPCA,"pa": rs.PCA,"a": rs.A};//Tooltip text
        ser.roleDisplay = {
        	"s": ice.globalVars.superUserLbl,
        	"p": ice.globalVars.procurementContactLbl,
        	"sp": ice.globalVars.superAndProContactLbl,
        	"spa": ice.globalVars.suProCoAdminLbl,
        	"pa": ice.globalVars.proContactAdminLbl,
        	"a": ice.globalVars.adminstrationLbl,
        	"": ""
        } //empty string is for no role

    },
    getServices: function () {
        //Send the request to controller to fetch data
        ser.loaded=false;
        myvmware.sdpMyPerm.init();
        vmf.ajax.post(rs.getServicesUrl, {
            'selectedEANumber': ser.getSelectedEA
        }, ser.loadServices, ser.error,
        function () {
            $("#serTreeLoading").addClass("hidden")
        }, null, function () {
            $("#serTreeLoading").removeClass("hidden")
        });
    },
    getSelectedEA: function () {
        return $("#eaSelectorDropDown option:selected").val();
    },
    loadServices: function (data) {
        if (typeof data != "object") data = vmf.json.txtToObj(data); //Evaluating the data
        var serviceJson = data.services, //Take funds in a object
            aTree = $("<ul></ul>"), //Store the tree structure in an object before appending to DOM
            chTree = $("<ul style=\"display:none;\"></ul>"); //Store the child tree in this object, before appending to DOM
        if (serviceJson.length > 0) {
            $("#emptyTree").addClass("hidden");
            aTree.append("<li class=\"level1 folderlist\" level=\"1\"><span class=\"pName folderNode disabled serHeader\"><a class=\"openClose\" class=\"pName\"></a> "+ice.globalVars.allServicesLbl+" </span></li>");
            $.each(serviceJson, function (i, item) {
                if (item.sName!=null && item.sId!=null){
                	if(item.onPremFlag == true){
                		chTree.append($("<li class=\"level2 folderlist no_child\" level=\"2\"><span sCode='" + item.sId + "' class=\"pName horizonService folderNode\"><span class='folderTxt'>" + item.sName + "</span></span></li>"));
                	} else {
	                    chTree.append($("<li class=\"level2 folderlist no_child\" level=\"2\"><span sCode='" + item.sId + "' class=\"pName folderNode\"><span class='folderTxt'>" + item.sName + "</span></span></li>"));
                	}
                }
            });
            aTree.append(chTree);
            $("#serviceList").append(aTree);
            $("#selectSerInfoDiv").show();
        } else {
            $("#emptyTree").removeClass("hidden");
        }
        ser.loaded=true;
        if(ice.mypermission.loaded) $(".loadingDiv").hide();
        ser.bindServiceEvents();
    },
    bindServiceEvents: function(){
        $("#serviceList a.openClose").unbind('click').bind('click', function (e) {
            if ($(this).closest('li').next("ul").length) { //toggle next ul if available
                $(this).toggleClass("open").closest('li').next().animate({
                    height: 'toggle',
                    opacity: 'toggle'
                });
            }
            e.preventDefault();
            e.stopPropagation();
        });
        $("#serviceList li.level2>span:not('.disabled')").unbind('mouseover mouseout click').bind('mouseover mouseout click', function (e) {
            if (e.type == "mouseover") {
                $("#serviceList li span").removeClass('hover');
                $(this).addClass('hover');
            } else if (e.type == "mouseout") {
                $(this).removeClass("hover");
            } else {
                if ($(this).hasClass("active")) return;
                $(this).closest("section").find("li span").removeClass('active');
                $(this).addClass('active');
                $("#selectSerInfoDiv").hide();
                var loading_txt = '<div class="loading"><span class="loading_small"> '+ $permissionPane_loading_staticText +'</span></div>'
                $('#folderPermissionPane').html(loading_txt);
                $('#licenseFolderManagers').empty();
                ser.resetActionItems();
                if($(this).hasClass('horizonService')){
                	ser.onPremiseTenant = true;
                }else{
                	ser.onPremiseTenant = false;
                }
            	ser.getUsersPermissionList(this);
            }
        });
    },
    getUsersPermissionList: function(targetEle){
        var _postData = {
            "serviceID": $(targetEle).attr("sCode"),
            "selectedEANumber": ser.getSelectedEA,
            "selectedUserOnPerm": ser.onPremiseTenant
        };
        vmf.ajax.post(rs.getServicePermissionUrl, _postData, ser.loadUserPermPane, ser.userListFail, function () {
            $("#userTreeLoading").addClass("hidden");
            $("#userSelectionInfoDiv").removeClass("hidden")
        }, null, function () {
            $("#userTreeLoading").removeClass("hidden");
            $("#selectSerInfoDiv, #userDiv, #userDetails #user, #userPermissionPane, #permHeader").hide();
            ice.mypermission.disableEnableLinks('applyInActive', $('a#requestPermissionLink'))
        });
    },
    resetActionItems: function(){
        $('.dropdown li').addClass('inactive');
        //$('#findFolder').parent('li').removeClass('inactive');
        //if(ice.mypermission.createFolderFlg) $('.dropdown').find('a#createFolder').removeClass('dummyClick').parent('li').removeClass('inactive');
    },
    loadUserPermPane: function(data){
        if(typeof data!="object") data=vmf.json.txtToObj(data);
        if(data.userDetails) ser.loadUsers(data.userDetails);
        if(data.permissions) ser.loadPermisions(data.permissions);
    },
    loadUsers: function (data) {
        var userArr = $("<ul class=\"icons info_list\"><div class='introText'>" + rs.rightPaneInsText + "</div></ul>"),
            role = [],
            _userRole, badge;
        //data = vmf.getObjByIdx(data, 0);
        if (data.length) {
            $.each(data, function (index, val) {
                for (var k in val.perm) {
                    if (val.perm[k]) role.push(ser.roleMap[k]);
                }
                _userRole = role.join("");
                role = [];
                badge = ($.trim(_userRole).length) ? "<a alt='" + ser.roleDef[_userRole] + "' title='" + ser.roleDef[_userRole] + "' class=\"hreftitle\" href='#'>" + ser.roleDef[_userRole] + "</a>" : "";
                userArr.append("<li class='" + _userRole + "'><label> " + badge + val.fName + " " + val.lName + "<br/><a href='mailto:" + val.email + "'>"+vmf.wordwrap(val.email,'2')+"</a></label></li>");
            });
        } else {
            userArr.append("<li><label>" + rs.noUsersMsg + "</label></li>");
        }
        $("#licenseFolderManagers").html(userArr).show();
    },
    loadPermisions: function (res) {
        var permArray = ["<table><body>"],
        imgs = [];
        $.each(res, function (i, v) {
            
	    if(v.isActiveFlag == false){            
            	imgs.push('<img src="/static/myvmware/common/img/cross.png" height="17" width="16" alt="' + rs.cross + '" title="' + rs.cross + '" />');
            	
            	imgs.push('<img src="/static/myvmware/common/img/lock.png" height="16" width="14" alt="' + rs.lock + '" title="' + rs.lock + '" />');

            	permArray.push("<tr id=" + v.pCode + " status=" + v.perm.isSet + " class='inactive' ><td class='col1 level"+v.level+"'>" + v.pName + "</td><td class='col2'>" + imgs.join('') + "</td></tr>");
            } else {
            	(v.perm.set) ? imgs.push('<img src="/static/myvmware/common/img/dot.png" height="17" width="17" alt="' + rs.tick + '" title="' + rs.tick + '" />') : imgs.push('<img src="/static/myvmware/common/img/cross.png" height="17" width="16" alt="' + rs.cross + '" title="' + rs.cross + '" />');
            	
            	if (!v.perm.edit) imgs.push('<img src="/static/myvmware/common/img/lock.png" height="16" width="14" alt="' + rs.lock + '" title="' + rs.lock + '" />');
    			
    			permArray.push("<tr id=" + v.pCode + " status=" + v.perm.isSet + "><td class='col1 level"+v.level+"'>" + v.pName + "</td><td class='col2'>" + imgs.join('') + "</td></tr>");
            }
            imgs = [];
		});
        permArray.push("</tbody></table>");
        $("#folderPermissionPane").html(permArray.join(""));
    }
}
