vmf.ns.use("ice");
VMFModuleLoader.loadModule("resize", function() {});
ice.movekey = {
    fldConfnpMsgContent:null,
	selectedFolderUrl:null,
	portletN:null,
	folderPathResource:null,
	resourceUrlMove:null,
	myPermissionRenameFolderUrl:null,
	enterFolderName:null,
	folderAlreadyExists:null,
	unKnownError:null,
	movekeyAddFolderUrl:null,
	confirmMoveUrl:null,
	portletUrl:null,
	licenseArray : null,
	greyedOutFolderTooltip:null,
	folderPathResourceUrl : null,
	_folderVariable : null,
	init: function (npMsgContent,portN,selFolderUrl,fldPathResUrl,rUrlMove,rNameFUrl,efName,faExists,unKnwErr,mKeyAFUrl,confMKeyUrl,portUrl,cancelUrl,greyedOutFolderTooltipMsg) {
		vmf.scEvent = true;
		callBack.addsc({'f':'riaLinkmy','args':['my-licenses : move']});
		ice.movekey.adjustHt();
		fldConfnpMsgContent = npMsgContent;
		portletN = portN;
		selectedFolderUrl = selFolderUrl;
		folderPathResource = fldPathResUrl;
		resourceUrlMove = rUrlMove;
		myPermissionRenameFolderUrl = rNameFUrl;
		enterFolderName = efName;
		folderAlreadyExists = faExists;
		unKnownError = unKnwErr;
		movekeyAddFolderUrl = mKeyAFUrl;
		folderPathResourceUrl = '';
		confirmMoveUrl = confMKeyUrl;
		portletUrl = portUrl;
		ice.movekey.disableFunction('disable',1);
		greyedOutFolderTooltip=greyedOutFolderTooltipMsg;
		ice.movekey.selectedSourceFolder();
		ice.movekey.handleFolderTree();
		licenseArray = new Array();
		//$('.ctrlHolder.checkbox').css({'margin-left':'7px','margin-right':'4px'});
		//$('.moveKeys .checkbox.agree label').css({'width':'240px'});
		//$('#warning-message').css({'height':'57px','margin':'0 5px 25px'});
		$('.buttons').css({'margin-right':'18px'});
		$('.folderPane').css({'padding-bottom': '10px'});
		if ($('#folderAccess').val() == 'MANAGE'){
               //$("#createFolder").css('color','#ace3ff');
               //$("#renameFolder").css('color','#ace3ff');
			ice.movekey.disableEnableDropdown($('#createFolder,#renameFolder'),'enable');
        };
        /*$('#confirmMoveFolder').click(function () {
            ice.movekey.populateMoveLicensePreConfirm();
            return false;
        });*/
		$('#btn_cancel7,#returnToLicense,button#batchProcessCancelBtn').live('click',function () {
            window.location = cancelUrl;
        });
        $('#createFolder').click(function () {
			if(!$(this).hasClass('dummyClick')){
				if ($('#folderId').val().length > 0) {
					if ($('#folderAccess').val() == 'MANAGE')
						ice.movekey.populateAddFolderUI();
				} else
					vmf.modal.show('selectFolderToAdd');
				return false;
			}
        });
        $('#renameFolder').click(function () {
			if(!$(this).hasClass('dummyClick')){
				if ($('#folderId').val().length > 0) {
					if ($('#folderAccess').val() == 'MANAGE')
						ice.movekey.populateRenameFolderUI();
				} else
					vmf.modal.show('selectFolderToAdd');
				return false;
			}
        });
        $('#confirm').click(function () {
			ice.movekey.confirmAddFolder();			
            return false;
        });
		$('#createFolderContent #newFolderId').keypress(function(e){
			if(e.which == 13){
				$(this).addClass('waitcursor');
				$('#confirm').trigger('click');
			}
		});
        $('#renameConfirm').click(function () {
            ice.movekey.confirmRenameFolder();			
            return false;
        });
        $('div.dropdown li:eq(2) a, div.dropdown li:eq(3) a, div.dropdown li:eq(4) a').click(function () {
            return false;
        });
        $('#confirmButton').click(function () {
			if(ice.movekey.checkFolder()){
				$('.error').hide();
				if($('ul#licensekeylistUl .oldFolder').length > 1){
					ice.movekey.confirmMoveLicenseKey();
					ice.movekey.disableFunction('disable',2);
				}else{
					var strFval = $.trim($('ul#licensekeylistUl').find('div.oldFolder').text());
					var lenFval = strFval.length;
					if($('#fullFolderPath').val() == strFval || $('#fullFolderPath').val() == strFval.substring(2,lenFval)){
						$('#understand_warning').removeAttr('checked','checked');
						$('button#confirmButton').attr('disabled','disabled').addClass('disabled');
						$('#sameFolderErr').show().addClass('error');
					}
					else{
						ice.movekey.confirmMoveLicenseKey();
						ice.movekey.disableFunction('disable',2);
					}
					return false;
				}
			} else {
				$('#moveKeyIntroText').hide();
				ice.movekey.showErrorMessage(ice.globalVars.selectFolderConfirmMsg);
			}
        });
        $(".modalContent .fn_cancel").click(function () {
            vmf.modal.hide();
            $('.modalContent .button').uncorner();
            return false;
        });
		$('.helpLink').css({'right':'3px','top':'9px'});
		$('#understand_warning').live('click',function(){
			if($(this).attr('checked')==true){
				$('#confirmButton').removeAttr('disabled').removeClass('disabled');
			} else {
				$('#confirmButton').attr('disabled',true).addClass('disabled');
			}
		});
		
		$('button#batchProcessOkBtn').die('click').live('click',function(e){
			$('#loadingDiv').show();
			var selectedLicenseKeys = $('#selectedLicenseKeys').val();
			$('#selectedLicenseKeys').val("");
			$('#listOfsourceFolderWithKey').val("");
			var _targetFolderId = $("#folderId").val();
			var _targetFoldetPath = $("#fullFolderPath").val();
			var _postData = new Object(); 
			_postData['targetFolderId'] = _targetFolderId;
			_postData['targetFolderPath'] = _targetFoldetPath;
			//_postData['selectedLicenseKeys'] = selectedLicenseKeys; 
			vmf.ajax.post($bulkMoveURL, _postData, ice.movekey.onSuccessBatchProcess, ice.movekey.onFailBatchProcess);
			e.preventDefault();
		});
		
		/*Resizing Panes CR Start*/
		vmf.splitter.show('mySplitter',{
			type: "v",
			sizeLeft:parseInt($("#leftPane").width(),10),
			outline:true,
			resizeToWidth: true,
			minLeft: parseInt($("#leftPane").width()*.8,10),
			maxLeft: parseInt(($("#leftPane").width() + ($("#folderSection").width()*.2)),10),
			barWidth:false
		});

		vmf.splitter.show("centerRight",{
			type: "v",
			sizeRight:parseInt($("#confirmPane").width(),10),
			outline:true,
			resizeToWidth: true,
			maxRight:parseInt(($("#confirmPane").width() + ($("#folderSection").width()*.2)),10),
			minRight:parseInt($("#confirmPane").width()*.8,10),
			barWidth:false
		});
		/*Resizing Panes CR End*/	
		ice.movekey.adjustHt();
    },
	onSuccessBatchProcess: function(res){
		$('#moveKeyIntroText').hide();
		$('#loadingDiv').hide();
		$('.normal_movewrapper').hide();
		$('.warningbox_batch').remove();
		var msgHtml = "";
		$('.batch_movewrapper').show();
	},
	onFailBatchProcess: function(){},
    selectedSourceFolder: function () {
		vmf.ajax.post(selectedFolderUrl, null, ice.movekey.onSuccess, ice.movekey.onFail);
    },
    onSuccess: function (data) {
        _userjsonresponse = vmf.json.txtToObj(data);
		if(typeof(_userjsonresponse.error)!='undefined' && _userjsonresponse.error==true){
			$('#moveKeyIntroText').hide();
			ice.movekey.showErrorMessage(_userjsonresponse.message);
		} else {
			//$('#fromFolder').replaceWith(_userjsonresponse.sourceFolderPath);
			$('div.from').html("\\\\"+_userjsonresponse.sourceFolderPath);
			//VSUS Nov Release
			$('span.prod_name').html(_userjsonresponse.productName);
		}
    },
    onFail: function (data) {
		$('#moveKeyIntroText').hide();
		ice.movekey.showErrorMessage(ice.globalVars.failedMsg);
    },
    handleFolderTree: function () { 
        var _config = new Object();
        _config.uniqueDiv = portletN;
        _config.ajaxTimeout = 60000;
		_config.wrapEllipseBtn = true;
        _config.npMsgContent = fldConfnpMsgContent;
        _config.npMsgFunction = function (msg) {
            ice.movekey.showExceptionMessages(msg);
        };
        _config.cbOnClickFunction = function (folderId, cbState) {
			if($('.'+folderId).children('span').hasClass('active')){
				$('.folderTxt').removeClass('normalWhiteSpace');
				$('.'+folderId).children('span').find('.folderTxt').addClass('normalWhiteSpace').end().find('.openClose,input,.ellipsBadge').addClass('vAlignChilds');
			} else {
				$('.'+folderId).children('span').find('.folderTxt').removeClass('normalWhiteSpace').end().find('.openClose,input,.ellipsBadge').removeClass('vAlignChilds');
			}
            ice.movekey.folderTreeCBClick(folderId, cbState);
        };
        _config.cbOnClickSelFoldersFunction = function (selectedFolders, cbState) { 
            //ice.movekey.folderTreeCBSelected(selectedFolders, cbState);
        };
        _config.validateJSONFunction = function (folderListJSON) {
            if (folderListJSON.error) {
                ice.movekey.showExceptionMessages(folderListJSON.message);
            } else {
				ice.movekey.disableFunction('enable',1);
			}
        };
        _config.cbOnFolderNodeCreate = function(folderElement,folderIds) {
            if(folderElement.find('li span').hasClass('disabled')){
                folderElement.find('li input[type=radio]').parent().append('<a class="tooltip" title="'+greyedOutFolderTooltip+'" data-tooltip-position="bottom" href="#">'+greyedOutFolderTooltip+'</a>');
            }
            myvmware.hoverContent.bindEvents($('a.tooltip'), 'defaultfunc');
        };
        _config.errorFunction = function (response, errorDesc, errorThrown) {
            ice.movekey.showExceptionMessages(response.responseText);
        };
        _config.inputType = 'radio';
        _config.loadingClass = 'ajaxLoading';
        ice.movekey.disableEnableDropdown($('.dropdown li a'),'disable');
        $("#fullFolderPath").val('');
        $("#selectedFolderName").val('');
        $("#folderId").val('');
        $("#folderAccess").val('');
		$(".folderPane").html('');
        vmf.foldertree.build(resourceUrlMove,_config);
    },
    showExceptionMessages: function (message) {
        $('#moveLicenseExceptionMessage').html(message);
        vmf.modal.show("moveLicenseExceptionMessagePopup");
    },
    populateMoveLicensePreConfirm: function () {
        $('#to, #from').html('');
        $('#to').append('&nbsp;&nbsp;' + $('#toFolder').text());
        $('#from').append('&nbsp;&nbsp;' + $('#fromFolder').text());
        vmf.modal.show('confirmMoveFolderContent');
    },
    populateRenameFolderUI: function () {
        ice.common.wordwrap('existingFolderName', '\\\\'+$("#fullFolderPath").val(),'50','</br>','true');
        //$("#existingFolderName").html($("#fullFolderPath").val());//BUG-00019126
		myvmware.common.putplaceHolder('#renameFolderId');
        $('.error').html('');
		riaLinkmy('license-keys : move-license-keys : rename-folder');
        vmf.modal.show("renameFolderContent");
    },
    confirmRenameFolder: function () {
        var _newfolderName = $("#renameFolderId").val();
		var _folderid = $("#folderId").val();
		var duplicate = vmf.foldertree.duplicateFolder(_folderid, _newfolderName); //BUG-00018774
        if((_newfolderName.length > 0) && (_newfolderName != ice.globalVars.folderNameHint)){ //BUG-00061959
			if(duplicate == false) { //BUG-00018774
				$('#renameConfirm').attr('disabled',true).addClass('disabled');//BUG-00021672
				var _fullFolderPath = $("#fullFolderPath").val();
				var _renameFolderUrl = myPermissionRenameFolderUrl + '&selectedFolderId=' + _folderid + '&newFolderName=' + _newfolderName;
				//riaLink(_renameFolderUrl);
				vmf.ajax.post(_renameFolderUrl, null, ice.movekey.onSuccessRenameFolder, ice.movekey.onFailRenameFolder);
			} else {
				$('.error').html(ice.globalVars.duplicateFolderMsg);
			}
        } else
            $('.error').html(enterFolderName);
    },
    onSuccessRenameFolder: function (data) {
        if (jQuery.trim(data) != "")
		{
			var _errorMessage = vmf.json.txtToObj(data);
			if (_errorMessage != null && _errorMessage.error) {
				$('#renameConfirm').attr('disabled',false).removeClass('disabled');//BUG-00021672
				$('.error').html(_errorMessage.message); //BUG-00019110			
				return;
			}			
			 vmf.modal.hide();
            //location.reload();
			ice.movekey.handleFolderTree();
        } else {
            vmf.modal.hide();
            //location.reload();
			ice.movekey.handleFolderTree();
        }
    },
    onFailRenameFolder: function (data) {
    	$('#renameConfirm').attr('disabled',false).removeClass('waitcursor');//BUG-00021672
        $('.error').html(unKnownError);		
    },
    populateAddFolderUI: function () {
        ice.common.wordwrap('location', '\\\\'+$("#fullFolderPath").val(),'50','</br>','true');
        //$("#location").html($("#fullFolderPath").val());
        $('.error').html('');
		riaLinkmy('license-keys : move-license-keys : create-folder');
        vmf.modal.show("createFolderContent");
    },
    confirmAddFolder: function () {
        var _newfolderName = $("#newFolderId").val();
		var _folderid = $("#folderId").val();			
		var duplicate = vmf.foldertree.duplicateFolder(_folderid, _newfolderName);
        if (_newfolderName.length > 0){
			if(duplicate == false) {            
				$('#confirm').attr('disabled',true).addClass('waitcursor');//BUG-00021672
				var _fullFolderPath = $("#fullFolderPath").val();
				var _addFolderUrl = movekeyAddFolderUrl + '&selectedFolderId=' + _folderid + '&newFolderName=' + _newfolderName;
				//riaLink(_addFolderUrl);
				vmf.ajax.post(_addFolderUrl, null, ice.movekey.onSuccessCreateFolder, ice.movekey.onFailCreateFolder);
			} else {
				$('.error').html(ice.globalVars.duplicateFolderMsg);
			}
        } else{
			$('.error').html(enterFolderName);
		}
    },
    onSuccessCreateFolder: function (data) {
		if (jQuery.trim(data) != "")
		{
			var _errorMessage = vmf.json.txtToObj(data);
			if (_errorMessage != null && _errorMessage.error) {
				$('#confirm').attr('disabled',false).removeClass('waitcursor');//BUG-00021672
				$('.error').html(_errorMessage.message); //BUG-00019110				
				return;
			} 
			else{				
				vmf.modal.hide();
				//location.reload();
				ice.movekey.handleFolderTree();     
			}
		}
		else 
		{			
		    vmf.modal.hide();
			ice.movekey.handleFolderTree();        
        }
    },
    onFailCreateFolder: function (data) {
    	$('#confirm').attr('disabled',false).removeClass('waitcursor');//BUG-00021672
        $('.error').html(unKnownError);
		$('#createFolderContent #newFolderId').removeClass('waitcursor');
    },
    folderTreeCBClick: function (folderId, cbState) { 
		$('#sameFolderErr').hide();
        $("#fullFolderPath").val('');
        $("#selectedFolderName").val('');
        $("#folderId").val('');
        $("#folderAccess").val('');
        if (cbState == "checked") {
			$('#understand_warning').removeAttr('checked','checked').attr('disabled','disabled');
			$('button#confirmButton').attr('disabled','disabled').addClass('disabled');
            ice.movekey.getMinPermissionData(folderId, cbState);
        } else {
            $('.settings-cog .dropdown ul').removeAttr('id');
            //$('.settings-cog .dropdown li').css('background', '#CCCCCC');
			ice.movekey.disableEnableDropdown($('.dropdown li a'),'disable');
        }
    },
    /*calForTargetFolder: function (folderVariable) {
        var _folderPathResourceUrl = folderPathResource + "&param=" + folderVariable;
        vmf.ajax.post(_folderPathResourceUrl, null, ice.movekey.onSuccessConfirmFolderPath, ice.movekey.onFailConfirmFolderPath);
    },*/

    onSuccessConfirmFolderPath: function (data) {
        var _userjsonresponse = vmf.json.txtToObj(data);
        $('#toFolder').replaceWith(_userjsonresponse.targetFolderPath);
        if (_userjsonresponse != null && _userjsonresponse.error) {
			ice.movekey.disableFunction('enable',2);
            $('#loadingDiv').hide();
            ice.movekey.showErrorMessage(_userjsonresponse.message);
        } else {
			vmf.ajax.post(confirmMoveUrl, null, ice.movekey.onSuccessConfirmMove, ice.movekey.onFailConfirmMove);
		}
    },

    onFailConfirmFolderPath: function (data) {
		var _userjsonresponse = vmf.json.txtToObj(data);
        ice.movekey.disableFunction('enable',2);
    },
    confirmMoveLicenseKey: function () {
		var nodeLength = $('ul#licensekeylistUl li.folderNode').length;
		if(nodeLength >= $('input#licenseMoveCount').val()){
			riaLinkmy('my-licenses : move-license-key : offline');
			$('#moveKeyIntroText').hide();
			$('#loadingDiv').hide();
			$('.normal_movewrapper').hide();
			var warningHtml = '<div class="warning"><p>'+ice.globalVars.attentionMsg+'</p></div>';
			var btnHtml = '<div class="buttons mkbtn_container"> <div class="right-btns"> <button id="batchProcessOkBtn" class="button">'+ice.globalVars.okLbl+'</button> <button class="button secondary" id="batchProcessCancelBtn">'+ice.globalVars.cancelLbl+'</button> </div> </div>';
			$('div.moveKeyConfirmScroll').append('<div class="confirmation-wrapper top_margin warningbox_batch">' + warningHtml + btnHtml + '</div>');
			ice.movekey.disableFunction('enable',2);
		}else{
			riaLinkmy('my-licenses : move-license-key');
			$('#moveKeyIntroText').hide();
			$('#loadingDiv').show();
			licenseArray=($('#listOfsourceFolderWithKey').val()).split('||');
			var selectedLicenseKeys = $('#selectedLicenseKeys').val();
			var _targetFolderId = $("#folderId").val();
			var _targetFoldetPath = $("#fullFolderPath").val();
			var _postData = new Object(); 
			_postData['targetFolderId'] = _targetFolderId;
			_postData['targetFolderPath'] = _targetFoldetPath;
			_postData['selectedLicenseKeys'] = selectedLicenseKeys; 
			vmf.ajax.post(folderPathResource, _postData, ice.movekey.onSuccessConfirmFolderPath, ice.movekey.onFailConfirmFolderPath);
		}
    },
    onSuccessConfirmMove: function (data) {
        var _errorMessage = vmf.json.txtToObj(data);
		var strHTML='';
         if (_errorMessage != null) {
			$('#loadingDiv').hide();
            ice.movekey.showErrorMessage(_errorMessage);
		} else {
			for(var i=0;i<licenseArray.length;i++){
					var licenseArraySub=(licenseArray[i]).split(',');
					for(var j=0;j<licenseArraySub.length;j++){
						if(j==0){
							strHTML += '<li><span class="key_list_header">'+licenseArraySub[j]+'</span></li>';
						}else{
						strHTML += '<li><span class="key_list_number">'+licenseArraySub[j]+'</span></li>';
						}
					}
				
			}
			$('.key_list_content').append(strHTML);
			$('#loadingDiv').hide();
			$('.normal_movewrapper').show();
		}
    },
    onFailConfirmMove: function (data) {
		ice.movekey.disableFunction('enable',2);
		ice.movekey.showErrorMessage(ice.globalVars.failedMsg);
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
			success: function (folderPermission) {
                //Store permission in folder tree HT
                vmf.foldertree.storePermission(selectedFolder, folderPermission);
                ice.movekey.afterGetPermission(selectedFolder);
			},
			error: function (response, errorDesc, errorThrown) {
                console.log("In error: " + errorThrown);
			},
			beforeSend: function() {
				//TODO
			},
			complete: function(jqXHR, settings) {
				//TODO
			}
		});
    },
    afterGetPermission: function(folderId) {
        var _folderHT = vmf.foldertree.getFolderHashtable();
        var _folderTreeObj = vmf.foldertree.getFolderJSON();
        var _folderId = _folderHT.get(folderId).folderId;
        var _fullFolderPath = _folderHT.get(folderId).fullFolderPath;
         _folderVariable = _folderId + "," + _fullFolderPath;
    
        $("div#messagePreview").hide();
        $('div#preview').show();
        var _folderAccess = _folderHT.get(folderId).folderAccess;
        var _selectedFolderName = _folderHT.get(folderId).folderName;
        $("#fullFolderPath").val(_fullFolderPath);
        $("#selectedFolderName").val(_selectedFolderName);
        $("#folderId").val(_folderId);
        $("#folderAccess").val(_folderAccess);
        if (_folderAccess != 'MANAGE') {
         	ice.movekey.disableEnableDropdown($('.dropdown li a'),'disable');
        } else {
            if(_folderHT.get(folderId).folderType=='ROOT'){
                ice.movekey.disableEnableDropdown($('#createFolder'),'enable');
            } else {
                ice.movekey.disableEnableDropdown($('#createFolder,#renameFolder'),'enable');
            }
        }
		folderPathResourceUrl = folderPathResource + "&param=" + _folderVariable;
		
		if($('ul#licensekeylistUl .oldFolder').length > 1){
			$('#understand_warning').removeAttr('disabled','disabled');
		}else{
			var strFval = $.trim($('ul#licensekeylistUl').find('div.oldFolder').text());
			var lenFval = strFval.length;
			if($('#fullFolderPath').val() == strFval || $('#fullFolderPath').val() == strFval.substring(2,lenFval)){
				$('#sameFolderErr').show().addClass('error');
				$('#understand_warning').removeAttr('checked','checked').attr('disabled','disabled');
			}else{
				$('#understand_warning').removeAttr('disabled','disabled');
			}
		}
        //riaLink(_folderPathResourceUrl);
	},
	disableFunction : function(flag,options){
		if(options==1){
			if(flag=='disable'){
				$('#warningmessage').hide();
				$('.ctrlHolder').hide();
				$('.footer').hide();
			} else {
				$('#warningmessage').show();
				$('.ctrlHolder').show();
				$('.footer').show();
			}
		} else {
			if(flag=='disable'){
				$('.normal_movewrapper').hide();
				$('#confirmButton,#btn_cancel7').attr('disabled',true).addClass('disabled');
				$('#step2').addClass('disabled');
				$('#understand_warning').attr('disabled',true);
				$('.step3,.warning_container').addClass('disabled');
			} else {
				$('#confirmButton,#btn_cancel7').attr('disabled',false).removeClass('disabled');
				$('#step2').removeClass('disabled');
				$('.step3,.warning_container').removeClass('disabled');
				$('#understand_warning').attr('disabled',false);
			}
		}
	},
	showErrorMessage : function(message){
		$('.error').html('');
		$('.error').html(message).show();
	},
	checkFolder : function(){
		var countActiveFolders = $('.folderPane ul li').children('.active').length;
		if(countActiveFolders > 0)
			return true
		else 
			return false;
	},
	disableEnableDropdown : function(divObj,flag){
		(flag=='disable')?divObj.addClass('dummyClick').parent('li').addClass('inactive'):divObj.removeClass('dummyClick').parent('li').removeClass('inactive');
		return false;
	},
	adjustHt: function(){
		myvmware.common.adjustPanes();
		var cHeight = ($("#content-section").height() > parseInt($("#content-section").css("min-height")))? parseInt($("#content-section").css("min-height")) : $("#content-section").height();
		var tabArea = $("#content_1").height()+(cHeight-$("#lkstep2").height());
		tabArea = (tabArea>495)? tabArea: 495;
		$("#mySplitter, section.column").height(tabArea+"px");
		var folderHeight = tabArea - $("section.column header").height();
		$("section.column .scroll, .splitter-bar-vertical").height(folderHeight+"px");
		$("section.column .scroll.step3").height(folderHeight*.55+"px");
		$("section.column .scroll.warning_container").height(folderHeight*.45+"px")
	}
}
window.onresize=ice.movekey.adjustHt;