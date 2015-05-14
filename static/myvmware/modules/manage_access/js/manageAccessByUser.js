// store user data globally
VMFModuleLoader.loadModule("resize", function() {});
var userJsonResponse;
/* * load users */
vmf.scEvent = true;
callBack.addsc({'f':'riaLinkmy','args':['users-permissions : by-user']});
var IsLoggedInUserSUorOU = false;
var IsLoggedInUserRootAccess = false;
var treeview = true;
ice.ui.IsloggedInUserAFM = false;
ice.ui.loaded=false;
ice.ui.isSuperUser = false;
ice.ui.loggedInUserPerm = false;
ice.ui.rootFolderPerm = false;
ice.ui.userRootFolderId = '';
ice.ui.createFolderFlg = null;
ice.ui.loadUsers = function(){
    myvmware.sdpUser.init();
    myvmware.common.showMessageComponent('USER_PERMISSION');
    ice.ui.showBeak();
    $("#serviceList").empty();
    $('#spreadsheetView1,#userDetails,#treeViewTextDiv').hide();
    $('#listFolderPath').live('change',function(){
        if($(this).val() != 'null'){
             $('#moveFolderNext').removeAttr('disabled').removeClass('disabled');
        }else{
            $('#moveFolderNext').attr('disabled','disabled').addClass('disabled');
        }
        ice.ui.populateTargetFolder();
    });
    $("#userDiv").html('<ul class="icons"><li class="initmsg">'+ userPane_staticText +'</li></ul>');
    $("#loadingDiv").hide();
    $("#folderPane").hide();
    $("#userPermissionPane").html('');
    ice.ui.clearUesrDetails();
    ice.ui.disableButtons();
    ice.ui.userFilterClearText(); //Added by Praveer for clearing default text on focus
    vmf.ajax.post(manageAccessByUser_action_getUserList_url,null, ice.ui.onSuccess_loadUsers, ice.ui.onFail_loadUsers);    
    $.regexAddFolder = /^[a-zA-Z0-9!@%&_=\.\+\-\(\)\^\#\$\s]*$/g;
    $.invalidFolderMsg = '<div class=\"textRed\">'+ice.globalVars.invalidFolderMsg+'  \!\@\#\$\%\^\&\(\)\-\_\=\+\. \{space\}</div>';
        /*Resizing Panes CR Start*/
        vmf.splitter.show('userSplitter',{
            type: "v",
            sizeLeft:parseInt($("#userHolder").width(),10),
            outline:true,
            resizeToWidth: true,
            minLeft: parseInt($("#userHolder").width()*.8,10),
            maxLeft: parseInt(($("#userHolder").width() + ($("section#centerRight section.twoSixZero").width() *.2)),10),
            barWidth:false
        });
        vmf.splitter.show("centerRight",{
            type: "v",
            sizeRight:parseInt($("#permissionSection").width(),10),
            outline:true,
            resizeToWidth: true,
            maxRight:parseInt(($("#permissionSection").width() + ($("section#centerRight section.twoSixZero").width()*.2)),10),
            minRight:parseInt($("#permissionSection").width()*.8,10),
            barWidth:false
        });
        /*Resizing Panes CR End*/
        $(window).trigger("resize");
        ice.removeUser.disableEnableLinks('applyInActive', $('#requestPermissionLink')); //  Disable request permission link
};
ice.ui.showBeak = function(){
    myvmware.common.setBeakPosition({
        beakId:myvmware.common.beaksObj["SDP_BEAK_USERPERMISSION_BYSERVICE"],
        beakName:"SDP_BEAK_USERPERMISSION_BYSERVICE",
        beakHeading:$byServiceBeakHeading,
        beakContent:$byServiceBeakContent,
        target:$("#tab6"),
        beakUrl:'//download3.vmware.com/microsite/myvmware/sdpcust2/index.html',
        beakLink:'#beak7'
    });
};
ice.ui.onSuccess_loadUsers = function(data){    // user load success
    if (typeof data != "object") data = vmf.json.txtToObj(data);    
    userJsonResponse = data;

    $("#userDiv").html('<ul class="icons"><li></li></ul>');
    if(userJsonResponse.error){
        ice.ui.showExceptionMessages(userJsonResponse.message);
    }else{
        ice.ui.renderUsers('');
    }
    ice.ui.isUserManageRole();
    setTimeout("ice.ui.adjustTabBtns()",5000);
};
ice.ui.onFail_loadUsers = function(data){// user load failure
    ice.ui.showExceptionMessages(ice.globalVars.errorLoadingMsg);
    $("#userDiv").html('<ul class="icons"><li></li></ul>');
    $("#treeViewTextDiv").hide();
    $("#userPermissionPane").html('');
};
/* * render users to the user pane */
ice.ui.renderUsers = function(filterText){
        ice.ui.disableButtons();
        ice.ui.clearUesrDetails();
        var _strHTML = '<ul class=\"icons info_list\">';
        filterText = $.trim(filterText).toUpperCase();
        var count = 0;
        $('#errorMsgFilter').hide();        
        var roleDef = {
            "s": $staticTextforSU,
            "p": $staticTextforPC,
            "sp": $staticTextforSUPC,
            "o": $staticTextforO,
            "so": $staticTextforSUO,
            "po": $staticTextforPCO,
            "spo": $staticTextforSUPCO, 
            "spao": $staticTextforSUPCAO,
            "sao": $staticTextforSUAO,
            "pao": $staticTextforPCAO,
            "ao": $staticTextforAO          
        };        
        if(userJsonResponse.userPaneContents.length>0){
            for(i=0;i<userJsonResponse.userPaneContents.length;i++){
                var _userFirstName = userJsonResponse.userPaneContents[i].firstName;
                _userFirstName = _userFirstName.toUpperCase();
                var _userLastName = userJsonResponse.userPaneContents[i].lastName;
                _userLastName = _userLastName.toUpperCase();
                var _userEmail = userJsonResponse.userPaneContents[i].email;
                _userEmail = _userEmail.toUpperCase();
                var _userFullName = _userFirstName + ' ' + _userLastName;
                var _roleIconAttr='';
                var htm="";
                if((filterText!='')){
                    
                    if((filterText==userSearchDefaultText.toUpperCase() || _userFirstName.indexOf(filterText)!=-1 || _userLastName.indexOf(filterText)!=-1 || _userFullName.indexOf(filterText)!=-1 || _userEmail.indexOf(filterText)!=-1)){
                       var _userRole='',_labelArr,labelArr = [], permArray = [userJsonResponse.userPaneContents[i].superPermission,userJsonResponse.userPaneContents[i].procPermission,userJsonResponse.userPaneContents[i].serviceOwnerPermission,userJsonResponse.userPaneContents[i].designeeServiceOwnerPermission], userRoleVar = ['s','p','o','d'];
                       
                       $.each(permArray, function (j,k) {                           
                            if(k){                              
                                _userRole += userRoleVar[j];
                                _roleIconAttr += userRoleVar[j];
                                labelArr.push('<span class="'+userRoleVar[j]+'Label"></span>');
                            }
                       });
                       _labelArr = labelArr.join("");
                       htm='<a href="#" class="hreftitle" title="'+roleDef[_userRole]+'" alt="'+roleDef[_userRole]+'">'+roleDef[_userRole]+'</a>';              
                        if (_userRole=='') {_userRole="without_icon";}
                        _strHTML = _strHTML + '<li id=\'user_'+ userJsonResponse.userPaneContents[i].cN +'\' email=\'' +  userJsonResponse.userPaneContents[i].email +'\' val=\'' +  userJsonResponse.userPaneContents[i].cN +'\' class=\'' + _userRole +'\' fName=\'' +  userJsonResponse.userPaneContents[i].firstName +'\' lName=\'' +  userJsonResponse.userPaneContents[i].lastName +'\'  cRole=\'' + _roleIconAttr +'\' sdp=\'' + userJsonResponse.userPaneContents[i].onlySdpUser +'\'>';
                        
                        _strHTML = _strHTML + '<label for=\"radio' + i + '\" class=\"userLabel\">' +_labelArr +  htm +' '+userJsonResponse.userPaneContents[i].firstName + ' ' + userJsonResponse.userPaneContents[i].lastName + '</label>';
                        _strHTML = _strHTML + '</li>';
                    } else {
                        count = count+1;
                    }
                } else if(filterText==''){
                    var _userRole='',labelArr = [],_labelArr,
                        permArray = [userJsonResponse.userPaneContents[i].superPermission,userJsonResponse.userPaneContents[i].procPermission,userJsonResponse.userPaneContents[i].serviceOwnerPermission,userJsonResponse.userPaneContents[i].designeeServiceOwnerPermission],
                        userRoleVar = ['s','p','o','d'];
                    
                       $.each(permArray, function (j,k) {                           
                            if(k){                              
                                _userRole += userRoleVar[j];
                                _roleIconAttr += userRoleVar[j];
                                labelArr.push('<span class="'+userRoleVar[j]+'Label"></span>');
                            }
                       });
                       _labelArr = labelArr.join("");                       
                       htm='<a href="#" class="hreftitle" title="'+roleDef[_userRole]+'" alt="'+roleDef[_userRole]+'">'+roleDef[_userRole]+'</a>';
                       
                    if (_userRole=='') {_userRole="without_icon";}
                    _strHTML = _strHTML + '<li id=\'user_'+ userJsonResponse.userPaneContents[i].cN +'\' class=\'' + _userRole +'\' val=\'' +  userJsonResponse.userPaneContents[i].cN +'\' email=\'' +  userJsonResponse.userPaneContents[i].email +'\' fName=\'' +  userJsonResponse.userPaneContents[i].firstName +'\' lName=\'' +  userJsonResponse.userPaneContents[i].lastName +'\' cRole=\'' + _roleIconAttr +'\' sdp=\'' + userJsonResponse.userPaneContents[i].onlySdpUser +'\'>';
                    
                    _strHTML = _strHTML + '<label for=\"radio' + i + '\" class=\"userLabel\">'+_labelArr + htm +' '+userJsonResponse.userPaneContents[i].firstName + ' ' + userJsonResponse.userPaneContents[i].lastName + '</label>';
                    _strHTML = _strHTML + '</li>';
                }
            }
            if(count>0 && count==userJsonResponse.userPaneContents.length){
                $('#errorMsgFilter').show();
                $('#errorMsgFilter').html(filterUserErrorMsg);
            }
        }
        _strHTML = _strHTML + '</ul>';
        treeview = true;
        if(userJsonResponse.userPaneContents.length==0){
            if($("button#exportAllToCsvButton") != null && $("button#exportAllToCsvButton") != 'undefined'){ //BUG-00047200
                $("button#exportAllToCsvButton").hide();
            }
            
            _strHTML = '<div class="emptyUser">'+emptyUsermsg+'</div>';
            treeview = false;
        } else {//BUG-00047200
            if($("button#exportAllToCsvButton") != null && $("button#exportAllToCsvButton") != 'undefined'){
                $("button#exportAllToCsvButton").show();
            }
        }
        $("#userDiv").html(_strHTML);
        //BUG-00026023
        if(userJsonResponse.homeViewPermission) $('#spreadsheetView1').show(); else $('#spreadsheetView1').hide();
        if(userJsonResponse.managePermission) {
            ice.ui.loggedInUserPerm=true;
            ice.ui.activeInactiveDropDown($('#addusers,#shareFolder'),'active');
            $('#addusers,#shareFolder').removeClass('dummyClick');
        } else {
            ice.ui.loggedInUserPerm=false;
            ice.ui.activeInactiveDropDown($('#addusers,#shareFolder'),'inactive');
            $('#addusers,#shareFolder').addClass('dummyClick');
        }
        $("#userPermissionPane").html('');
        if(treeview){
            $("#treeViewTextDiv").show();
            myvmware.common.setAutoScrollWidth('ul.icons');
        }
        else{$("#treeViewTextDiv").hide();}
        /*Set the isSuperUser flag true if logged in user is super user , added for right click CR*/
        var suList = $('#userDiv ul li').filter('.s,.sp');
        for(var i =0;i<suList.length;i++){
            if($('#loggedCustomer').text() === $(suList[i]).attr('val')){ice.ui.isSuperUser = true;}
        }
        /*Start of context menu CR code*/
        var map = [
            {id: 'remove_usr',text: ice.globalVars.removeUserLbl,liCls: 'inactive',callBk: ice.removeUser.populateRemoveUserAccount},
            {id: 'cpy_perms',text: ice.globalVars.copyPermissionsLbl,liCls: 'inactive',callBk: ice.ui.populateCopyPermissionsUI},
            //{id: 'request_perm',text: 'Request Permission',liCls: 'inactive',callBk: ice.requestAccessPermissions.populateEditPermissionUI},
            {id: 'user_exportToCSV',text: ice.globalVars.exportToCsvLbl,liCls: 'inactive',callBk: ice.ui.exportToCSV}
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
                ice.ui.setUserMenuState(target, cmenu, disableMnu);
                
            },
            getTargetDetails: function (target) {
                var targetDetailsObj = {
                    userId: $(target).closest('li').attr('val'),
                    userDetails:{"selUserName":$(target).closest('li').text(),"email":$(target).closest('li').attr('email')},
                    custId: $(target).closest('li').attr('val'),
                    fId:$('#folderId').val(),
                    fName:$('#selectedFolderName').val(),
                    fPath:$('#fullFolderPath').val()
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
        //ice.ui.adjustHt();
        /*End of context menu CR code*/
         ice.ui.bindEvents();

};
ice.ui.checkUserPerm = function(target){
    var permissionDataUrl,custNum = $(target).closest('li').attr('val'),fPerPostData = new Object();
            permissionDataUrl = manageAccessByUser_action_getFoldersPerUser_url + '&selectedUserCustomerNumber=' + custNum;
            vmf.ajax.post(permissionDataUrl,null,ice.ui.onSuccess_getUsrPerm,ice.ui.onFail_usrPerm,null,null,null,false);
            fPerPostData['selectedFolderId'] = ice.ui.userRootFolderId;
            vmf.ajax.post(folderMinPermissionURL,fPerPostData,ice.ui.onSuccess_getfolderPerm(target),ice.ui.onFail_folderPerm,null,null,null,false);

};
ice.ui.onSuccess_getUsrPerm = function(data){
    var json=(typeof data!="object")?vmf.json.txtToObj(data):data;
    ice.ui.userRootFolderId = json.folderContents[0].folderId;
    ice.ui.isSuperUser = json.superuser;
    
};
ice.ui.onFail_usrPerm = function(){
    //error
};
ice.ui.onSuccess_getfolderPerm = function(target){
    return function(folderPerm){
        var json=(typeof folderPerm!="object")?vmf.json.txtToObj(folderPerm):folderPerm;
        ice.ui.rootFolderPerm = json.manage;
    }
};
ice.ui.onFail_folderPerm = function(){
    //error
};
ice.ui.setUserMenuState = function(target,cmenu,disableMnu){
    /*Copy Permissions change state*/
    cmenu.find('a#user_exportToCSV').removeClass(disableMnu).parent('li').removeClass('inactive');
    //Disable copy permissions for only sdp user
    if($(target).closest("li").attr("sdp")=="true" || ($(target).closest("li").hasClass("active") && $("#serviceList li span").hasClass("active"))){
        cmenu.find('a#cpy_perms').addClass(disableMnu).parent('li').addClass('inactive');
    }
    else if(ice.ui.isSuperUser && userJsonResponse.userPaneContents.length > 1){
        cmenu.find('a#cpy_perms').removeClass(disableMnu).parent('li').removeClass('inactive');
    }else if(userJsonResponse.userPaneContents.length > 1){
        if(ice.ui.userRootFolderId == ''){ice.ui.checkUserPerm(target);}
        if(ice.ui.rootFolderPerm){cmenu.find('a#cpy_perms').removeClass(disableMnu).parent('li').removeClass('inactive');} 
        else {cmenu.find('a#cpy_perms').addClass(disableMnu).parent('li').addClass('inactive');}
    } else {
        cmenu.find('a#cpy_perms').addClass(disableMnu).parent('li').addClass('inactive');
    }
    /*Remove User change state*/
    //var _suorpu = $(target).closest('li').is('.s, .p, .sp');
    var _suorpu,targetClass = $(target).closest('li').attr('crole'),regEx = /[spo]/;    
    _suorpu =  regEx.test(targetClass);
    
    if($(target).closest("li").attr("sdp")=="true" || ($(target).closest("li").hasClass("active") && $("#serviceList li span").hasClass("active"))){
        cmenu.find('a#remove_usr').addClass(disableMnu).parent('li').addClass('inactive');
    }
    else if(ice.ui.isSuperUser && (!_suorpu)){
        cmenu.find('a#remove_usr').removeClass(disableMnu).parent('li').removeClass('inactive');
    }else{
        cmenu.find('a#remove_usr').addClass(disableMnu).parent('li').addClass('inactive');
    }
    /*Request Permissions CR -9915 Changes*/
    var selectedUserId = $(target).closest('li').attr('val'),folderId = $('#folderId').val();
    if($(target).closest("li").attr("sdp")=="true" || ($(target).closest("li").hasClass("active") && $("#serviceList li span").hasClass("active"))){
        cmenu.find('a#request_perm').addClass(disableMnu).parent('li').addClass('inactive');
    }
    else if(folderId){
        if(selectedUserId == $('#loggedCustomer').text()){
            cmenu.find('a#request_perm').removeClass(disableMnu).parent('li').removeClass('inactive');
        } else {
            cmenu.find('a#request_perm').addClass(disableMnu).parent('li').addClass('inactive');
        }
    } else {
        cmenu.find('a#request_perm').addClass(disableMnu).parent('li').addClass('inactive');
    }
};
/* * clear user details in the right top pane - above permissions */
ice.ui.clearUesrDetails = function(customerNumber){
    $('#slectedUserName').text('');
    $('#userPaneSelectedUserEmail').text('');
    $('#selectedUserRole').text('');
};
/* * populate user details in the right top pane - above permissions  */
ice.ui.populateUesrDetails = function(customerNumber){
    var _userName = '';
    var _userEmail = '';
    var _role ='';
    var flagSu=false;
    for(i=0;i<userJsonResponse.userPaneContents.length;i++){
        if(userJsonResponse.userPaneContents[i].cN==customerNumber){
            _userName = userJsonResponse.userPaneContents[i].firstName + ' ' +  userJsonResponse.userPaneContents[i].lastName;
            _userEmail = userJsonResponse.userPaneContents[i].email;
            if(userJsonResponse.userPaneContents[i].superPermission){
                flagSu=true;
                _role = _role + manageAccess_label_withoutbracketSU ;//BUG-00028535
            }                   
            if(userJsonResponse.userPaneContents[i].procPermission){
                //_role = _role + manageAccess_label_PU;
                 if(flagSu){ _role = _role + ", "+manageAccess_label_withoutbracketPU;} //BUG-00028535
                else{  _role = _role + manageAccess_label_withoutbracketPU;}
            }
            break;
        }
    }
    var _emailContent = '<a href="mailto:'+_userEmail+'">'+_userEmail+'</a>';
    $('#slectedUserName').text(_userName);
    $('#userPaneSelectedUserEmail').html(_emailContent);
    if(_role == '(IT Super User)(Procurement Contact)') _role =  'Super User, Procurement Contact';
    if(_role == '(Super User)') _role =  'Super User';
    if(_role == '(Procurement Contact)') _role =  'Procurement Contact';
    $('#selectedUserRole').text(_role);
    $('#userPermissionPane').html('');
    $("#userDetails").show();
};
/* * for user filtering */
$("#filterusersContent .searchInput").css('color','#999');
$("#filterusersContent .searchInput").focus(function() {
    $(this).css('color', '#333333');
    if(this.value == this.defaultValue) {   this.value = '';    }
    else {this.select();}
});
$("#filterusersContent .searchInput").blur(function() {
    $(this).css('color', '#999999');
    if($.trim(this.value) == '') {
        this.value = (this.defaultValue ? this.defaultValue : '');
    }
});
$("#filterusersContent").delegate(".clearSearch","click", function() {
    $("#filterusersContent .searchInput").val(ice.globalVars.enterEmail);
    $(this).removeClass('clearSearch').addClass('sIcon');
    ice.ui.filterUsers();
});
$('#filterusersContent #filterBtnId').click(function(){
    var userInputFilter = $("#filterusersContent .searchInput").val();
    if(userInputFilter!=ice.globalVars.enterEmail || userInputFilter!=''){
        $('#errorMsgFilter').hide();
        ice.ui.filterUsers();
    } else {
        $('#errorMsgFilter').show();
        $('#errorMsgFilter').html(ice.globalVars.enterNameEmailMsg);
        return false;
    }
});
ice.ui.filterUsers = function(){
    $("#userDiv").html('<ul><li class="initmsg">'+ userPane_staticText +'</li></ul>');
    if($("#userFilterTxt").val()!=''){
        ice.ui.renderUsers($("#userFilterTxt").val());      
    }else{
        ice.ui.renderUsers('');
    }
};
$('#findFolder').click(function() {
    if(!$(this).hasClass('dummyClick')){
    vmf.modal.show('findFolderContent',{focus:false});
    myvmware.common.putplaceHolder('.searchInput');
    }
});
/* for user filter clearing*/
ice.ui.checkToClearFilterRendering = function(){
    if($("#userFilterTxt").val()==''){
        ice.ui.renderUsers('');
    }
};
//store folder data globally
var folderJsonResponse;
/* * load folders based on selected user */
ice.ui.loadFolders = function (_self) {
    ice.ui.loaded=false;
    //var _customerNumber = $("input[@name=userId]:checked").val();
    _self = _self || $('ul.info_list li').filter('.active');
    var _customerNumber = _self.attr('val');
    $('#isManageFolderUser').val('NO');
    $("#" + portletNs).show();
    $("#fullFolderPath, #selectedFolderName, #folderId, #folderAccess").val('');
    ice.ui.disableButtons();
    ice.ui.activeInactiveDropDown($('#exportToCsvByUser').removeClass('dummyClick'),'active');

    var _config = new Object();
    _config.uniqueDiv = portletNs;
    _config.ajaxTimeout = 60000;
    _config.wrapEllipseBtn = true;
    _config.npMsgContent = folder_config_npMsgContent;
    _config.npMsgFunction = function(msg) {
        ice.ui.showExceptionMessages(msg);
    };
    _config.cbOnClickFunction = function(folderId, cbState) {
        if($('.'+folderId).children('span').hasClass('active')){
            $('.folderTxt').removeClass('normalWhiteSpace');
            $('.'+folderId).children('span').find('.folderTxt').addClass('normalWhiteSpace').end().find('.openClose,input,.ellipsBadge').addClass('vAlignChilds');
        } else {
            $('.'+folderId).children('span').find('.folderTxt').removeClass('normalWhiteSpace').end().find('.openClose,input,.ellipsBadge').removeClass('vAlignChilds');
        }
        (cbState == "checked")?selectedUsersFolderIds=folderId:selectedUsersFolderIds='';
        ice.ui.folderTreeCBClick(folderId, cbState);
    };
    _config.validateJSONFunction = function(folderListJSON) {
        //set folder data to global variable
        if(folderListJSON.error){
            ice.ui.showExceptionMessages(folderListJSON.message);
        }
        folderJsonResponse = folderListJSON;
    };
    _config.errorFunction = function(response, errorDesc, errorThrown) { 
        ice.ui.showExceptionMessages(response.responseText);
    };
    _config.cbOnFolderNodeCreate = function(folderElement,folderIds) { 
        if(folderElement.find('li span').hasClass('disabled')){ 
        folderElement.append('<a class="tooltip" title="'+manageAccessTooltipMessage+'" data-tooltip-position="bottom" href="#">'+ice.globalVars.helpTextLbl+'</a>'); 
        } 
        myvmware.hoverContent.bindEvents($('a.tooltip'), 'defaultfunc'); 
        $("#treeViewTextDiv").hide();
        $("#folderPane").show();
        $("#userPermissionPane").html('<ul class="icons"><li class="initmsg">'+ permissionPane_staticText +'</li></ul>');
        };
    _config.loadComplete = function () {//Start of Context Menu CR Code
        var map = [
            {id: 'add_user',text: ice.globalVars.inviteNewUserLbl,liCls: 'inactive',callBk: ice.ui.populateAddUserUI},
            {id: 'remove_user',text: ice.globalVars.removeUserLbl,liCls: 'inactive',callBk: ice.removeUser.populateRemoveUserPane},
            {id: 'share_folder',text: ice.globalVars.shareFolderLbl,liCls: 'inactive',callBk: ice.ui.populateShareFolder},
            {id: 'create_folder',text: ice.globalVars.createFolderLbl,liCls: 'inactive',callBk: ice.ui.populateAddFolderUI},
            {id: 'delete_folder',text: ice.globalVars.deleteFolderLbl,liCls: 'inactive',callBk: ice.ui.populateDeleteFolderUI},
            {id: 'rename_folder',text: ice.globalVars.renameFolderLbl,liCls: 'inactive',callBk: ice.ui.populateRenameFolderUI},
            {id: 'move_folder',text: ice.globalVars.moveFolderLbl,liCls: 'inactive',callBk: ice.ui.populateMoveFolderUI},
            {id: 'request_access',text: ice.globalVars.requestPermLbl,liCls: 'active',callBk: ice.requestAccessPermissions.populateEditPermissionUI}
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
                if(typeof fManage == "undefined"){
                    ice.ui.checkFolderPermissions(target);
                }
                if($(target).closest('li').data('fManage')){
                    ice.ui.setContextMenuState(target,cmenu,disableMnu);
                }
            },
            getTargetDetails: function (target) {
                if(typeof $(target).closest("li").data("fDetails")!="undefined"){
                    return $(target).closest("li").data("fDetails");
                }
                var folderId = $(target).closest('li').data('folderId'),
                    folderHT = vmf.foldertree.getFolderHashtable(),
                    fullFolderPath = folderHT.get(folderId).fullFolderPath,
                    folderName = folderHT.get(folderId).folderName,
                    parentfId = folderHT.get(folderId).parentFolderId,
                    userDivFilter = $('#userDiv ul li').filter('.active'),
                    targetDetailsObj = {
                        fPath: fullFolderPath,
                        fId: folderId,
                        fName: folderName,
                        parentfId: parentfId,
                        userId: userDivFilter.attr('val'),
                        custId: userDivFilter.attr('val'),
                        userDetails:{"selUserName":userDivFilter.find('label').text(),"email":userDivFilter.attr('email')}
                    };
                    $(target).closest("li").data("fDetails",targetDetailsObj);
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
        ice.ui.setCreateFolderPerm();

        myvmware.common.adjustFolderNode(false,true);
        $("#folderPane").show();
        setTimeout("ice.ui.adjustTabBtns()",3000);
        ice.ui.loaded=true;
        if(!ser.loaded) $(".loadingDiv").show();

    };//End of Context Menu CR Code
    _config.checkRootFolderPermisssion = function(response) { 
        if($.trim($('#folderPane').html()) !=""){
            var rootolderId = $('#folderPane ul:eq(0) li:eq(0)').attr('class').split(' ')[0];
            _self = $('ul.info_list li').filter('.active');
            var _suorpu = _self.is('.s, .p, .sp');
            if(response.managePermission) {
                ice.ui.activeInactiveDropDown($('#addusers,#shareFolder'),'active');
                $('#addusers,#shareFolder').removeClass('dummyClick');
            } else {
                ice.ui.activeInactiveDropDown($('#addusers,#shareFolder'),'inactive');
                $('#addusers,#shareFolder').addClass('dummyClick');
            }
            if(response.superuser && (userJsonResponse.userPaneContents.length > 1)){
                ice.ui.activeInactiveDropDown($('#copyPermissionsBtn'),'active');
                $('#copyPermissionsBtn').removeClass('dummyClick');
            }
            else if (userJsonResponse.userPaneContents.length > 1){ ice.ui.getRootPermissionData(rootolderId); }
            else{
                ice.ui.activeInactiveDropDown($('#copyPermissionsBtn'),'inactive');
                $('#copyPermissionsBtn').addClass('dummyClick');
            } 
        }
    };
    _config.inputType = 'radio';
    _config.loadingClass = 'loading';
    vmf.foldertree.build(manageAccessByUser_action_getFoldersPerUser_url+"&selectedUserCustomerNumber="+_customerNumber,_config);
    ice.ui.activeInactiveDropDown($('#findFolder'),'active');
    $('#findFolder').removeClass('dummyClick');
    $("#" + portletNs).show();  
};// End of loadFolders
/* * call back method for folder radio button selection */  
ice.ui.folderTreeCBClick = function(folderId, cbState) {
    if (cbState == "checked") {
        ice.ui.getMinPermissionData(folderId,cbState);
    }
};
/* * enable buttons/links based on permissions */   
ice.ui.enableButtons = function (){
    ice.ui.activeInactiveDropDown($('#addusers,#shareFolder'),'active');
    $('#addusers,#shareFolder').removeClass('secondary');
    $('#removeUserBtn').removeClass('secondary');
    if ($.rootFolder != 'ROOT'){
        ice.ui.activeInactiveDropDown($('.dropdown ul li a:not("#copyPermissionsBtn")'),'active');
        $('#content-container .settings-cog .dropdown ul li a:not("#copyPermissionsBtn")').removeClass('dummyClick');
    }
};
/* * disable buttons/links based on permissions */  
ice.ui.disableButtons = function (){
    ice.ui.activeInactiveDropDown($('#copyPermissionsBtn'),'inactive');
    $('#copyPermissionsBtn').addClass('dummyClick');
    $('#removeUserBtn').addClass('secondary');
    ice.ui.activeInactiveDropDown($('.dropdown ul li a'),'inactive');
    $('#content-container .settings-cog .dropdown ul li a').addClass('dummyClick');
    ice.ui.activeInactiveDropDown($('#addusers,#shareFolder'),'active');
    $('#addusers,#shareFolder').removeClass('dummyClick');
};
/* * load permissions data based on folder and user selection  */   
ice.ui.loadPermissions = function(customerNumber,folderId,refreshFlag,cbState){
    ice.removeUser.disableEnableLinks('applyInActive', $('#requestPermissionLink'));
    $("#selectedUserId").val(customerNumber);
    $('#userPermissionPane').html('<ul class="icons"><li class="initmsg">' + permissionPane_loading_staticText +'</li></ul>');
    // enable or disable copy permission button
    // folder links & user links
    var selectedFolderLevel = '';
    for(i=0;i<folderJsonResponse.folderContents.length;i++){
        if(folderJsonResponse.folderContents[i].folderId==folderId){
            if(folderJsonResponse.folderContents[i].folderAccess==FOLDER_ACCESS_PERMISSION_MANAGE_VIEW){                
                ice.ui.enableButtons();
            }else{
                ice.ui.disableButtons();
            }
            selectedFolderLevel = folderJsonResponse.folderContents[i].folderLevel;
            break;
        }
    }
    if (selectedFolderLevel == ''){
        var folderHT = vmf.foldertree.getFolderHashtable();
        selectedFolderLevel = folderHT.get(folderId).folderLevel;
    }
    var _dataObj = {};
    _dataObj['selectedUserCustomerNumber']=customerNumber;
    _dataObj['selectedFolderId']=folderId;
    if(refreshFlag){
        _dataObj['refreshFlag']=refreshFlag;
    }
    _dataObj['selectedFolderLevel']=selectedFolderLevel;
    var rootFolderContext = $('div#folderPane ul').children('li').attr('class').split(' ');
    var rootFolderId = rootFolderContext[0];
    var _rootFolderpermissionDataUrl = loggedPermissionUrl+ '&selectedFolderId=' + rootFolderId +'&selectedCustomerNumber='+ 
        customerNumber+'&refreshFlag=FALSE' + '&selectedFolderLevel=' + selectedFolderLevel;
    ice.ui.onSuccessRootFolderpermissionData(_rootFolderpermissionDataUrl, _dataObj, manageAccessByUser_action_getPermissionsPerFolderPerUser_url,folderId,cbState);
    
};
var hasRootLevelPermission = false;
ice.ui.onSuccessRootFolderpermissionData = function(_rootFolderpermissionDataUrl, _dataObj, manageAccessByUser_action_getPermissionsPerFolderPerUser_url,folderId, cbState){
    
    $.ajax({
        type: "GET",
        url: _rootFolderpermissionDataUrl,
        success: function(data){
            var folderjsonresponse = vmf.json.txtToObj(data);
            if(folderjsonresponse != null && folderjsonresponse != "undefined"){
                for(var i=0;i<folderjsonresponse.permissionPaneContents.length ;i++){
                    var permissionCode = folderjsonresponse.permissionPaneContents[i].permissionCode;
                    if(permissionCode == "PERMISSION02"){
                        hasRootLevelPermission = true;
                    }
                }
            }
            $.ajax({
                type: 'POST',
                url: manageAccessByUser_action_getPermissionsPerFolderPerUser_url,
                async: true,
                dataType: "json",
                data: _dataObj,
                success: function (jsonResponse) {
                    ice.ui.onSuccess_loadPermissions(jsonResponse);
                },
                error: function (response, errorDesc, errorThrown) {
                    if(console != undefined) {
                        console.log("In error: " + errorThrown);
                    }
                    ice.ui.onFail_loadPermissions(errorThrown);
                },
                beforeSend: function() {
                    //TODO
                },
                complete: function(jqXHR, settings) {
                    //TODO
                }
            });
        }
    });
};
// permissions load success
ice.ui.onSuccess_loadPermissions = function(data){

    var _permissionJSONresponse = data;
    
    $('#isManageFolderUser').val('NO');
    
    if(_permissionJSONresponse.managePermission) {
        ice.ui.activeInactiveDropDown($('#addusers,#shareFolder'),'active');
        $('#addusers,#shareFolder').removeClass('dummyClick');
    } else {
        ice.ui.activeInactiveDropDown($('#addusers'),'inactive');
        $('#addusers,#shareFolder').addClass('dummyClick');
    }
    if(!_permissionJSONresponse || !_permissionJSONresponse.permissionPaneContents ||
            _permissionJSONresponse.permissionPaneContents.length<=0){
        $('#userPermissionPane').html('<ul><li class="initmsg">' + permissionPane_nodata +'</li></ul>');
        //BUG-00020995 fix below code
        $('ul li a#editPermissionLink').addClass('dummyClick');
        //$('ul li a#editPermissionLink').css('color', '#CCCCCC');
        ice.ui.activeInactiveDropDown($('#editPermissionLink'),'inactive');
        ice.removeUser.disableEnableLinks('applyInActive', $('#requestPermissionLink'));
        $('ul li a#removeUserLink').addClass('dummyClick');
        //$('ul li a#removeUserLink').css('color', '#CCCCCC');
        ice.ui.activeInactiveDropDown($('#removeUserLink'),'inactive');
    }else if(_permissionJSONresponse.error){
        $('#userPermissionPane').html('<ul><li></li></ul>');
        ice.ui.showExceptionMessages(_permissionJSONresponse.message);
    }else{
        ice.removeUser.checkUserPermission(_permissionJSONresponse);
        $('#userPermissionPane').html('<ul><li></li></ul>');
        var _role ='';
        var _strHTMLGlobal = '';
        var _strHTMLByFolder = '';
        for(var i=0;i<_permissionJSONresponse.permissionPaneContents.length ;i++){
            var _strTemp='';
            if(_permissionJSONresponse.permissionPaneContents[i].permissionName != null){
                var status = _permissionJSONresponse.permissionPaneContents[i].isSet;
                _strTemp += '<tr id='+_permissionJSONresponse.permissionPaneContents[i].permissionCode+' checkStatus='+status+'>';
                //_strTemp += '<td></td>';
                if(_permissionJSONresponse.permissionPaneContents[i].level==1){
                    _strTemp += '<td class="col1 pad_left">'+_permissionJSONresponse.permissionPaneContents[i].permissionName+'</td>';
                } else {
                    _strTemp += '<td class="col1">'+_permissionJSONresponse.permissionPaneContents[i].permissionName+'</td>';
                }
                if(_permissionJSONresponse.permissionPaneContents[i].isSet){
                    if(_permissionJSONresponse.permissionPaneContents[i].permissionCode==MANAGE_FOLDER_USER_ACCESS_PERMISSION){
                        $('#isManageFolderUser').val('YES');
                        _role = manageAccess_label_FM;
                    }
                    _strTemp += '<td class="col2"><img src="/static/myvmware/common/img/dot.png"  alt="Yes" title="'+ $staticTextfortick +'" />';
                }else{
                    _strTemp += '<td class="col2"><img src="/static/myvmware/common/img/cross.png"  alt="No" title="'+ $staticTextforcross +'" />';
                }
                // show pad lock _permissionJSONresponse.permissionPaneContents[i].isInherited //                   
                if(!_permissionJSONresponse.permissionPaneContents[i].isLoggedInUserCanEdit){
                        _strTemp += '<img src="/static/myvmware/common/img/lock.png" alt="Lock" title="'+ $staticTextforLock +'" />';
                }
                _strTemp +='</td>';
                
                //_strTemp += '<td></td></tr>';
                _strTemp += '</tr>';
                if(_permissionJSONresponse.permissionPaneContents[i].category == PERMISSION_TYPE_GLOBAL){
                    _strHTMLGlobal = _strHTMLGlobal + _strTemp;
                }else{//ByFolder
                    _strHTMLByFolder = _strHTMLByFolder + _strTemp;
                }
            }
        }

        var _strHTML = '<table class="scrollTable">';
        _strHTML += '<tbody class="scrollContent">';
        
        /*_strHTML += '<tr class="row_header">';
        

        _strHTML +='<td colspan="2"><strong>'+ permissionPane_global +'</strong></td>';
        _strHTML +='</tr>'; */

        if(_strHTMLGlobal!=''){
            _strHTML = _strHTML + _strHTMLGlobal;
        }
        
        /*_strHTML += '<tr class="row_header">';
        
        _strHTML +='<td colspan="2"><strong>' + permissionPane_byFolder +'</strong></td>';
        _strHTML +='</tr>'; */
        
        if(_strHTMLByFolder!=''){
            _strHTML = _strHTML + _strHTMLByFolder;
        }
        
        _strHTML += '</tbody>';
        _strHTML += '</table>';
        
        $('#userPermissionPane').html(_strHTML);
        //Commented the below code as per BA's comments on BUG-00029134
        /*if($('#selectedUserRole').text()=='' ||   ($('#selectedUserRole').text()!=manageAccess_label_SU && 
                $('#selectedUserRole').text()!=manageAccess_label_PU
                && $('#selectedUserRole').text()!='Super User, Procurement Contact')){// if it is not set as PU or SU or empty
            $('#selectedUserRole').text(_role);
        }*/
        
        // Below code is to add Administrator role to the User roles except on Home folders
        var _userRole = $('#selectedUserRole').text();
        var selectedFolderId = $('#folderId').val();        
        if (_permissionJSONresponse.isFolderAdmin && $('li.'+selectedFolderId).attr('level') != 0){
            _role = "ad";
            if (_userRole.indexOf('Administrator') == -1){
                _userRole = _userRole == '' ? 'Administrator' : _userRole + ', ' + 'Administrator';
                $('#selectedUserRole').text(_userRole);
            }
        } else if (_userRole.indexOf('Administrator') != -1){ 
        // This code is to remove the Administrator role of the user as otherwise the selectedUserRole is not refreshed 
        //on selection of a different folder on By User tab     
            var _urole = '';
            if (_userRole.indexOf('Proc') != -1){
                _urole = ' Procurement Contact';
            }
            if (_userRole.indexOf('Super') != -1){
                _urole= _userRole=='' ? 'Super User' : 'Super User,' + _urole;
            }
            $('#selectedUserRole').text(_urole);
        }
        
        if(_role == manageAccess_label_FM){
            $('#selectedFolderUserPane ul').find('li').each(function(){
                if(!$(this).hasClass("sp") && !$(this).hasClass("s") && !$(this).hasClass('p')){
                    if($(this).hasClass('active') && $(this).hasClass('without_icon')){
                        $(this).attr('class','fm active without_icon');
                    }else if ($(this).hasClass('active')){
                        $(this).attr('class','fm active');
                    }else if ($(this).hasClass('without_icon')){
                        $(this).attr('class','fm without_icon');
                    }else{
                        $(this).attr('class','fm');
                    }
                }
            });
        }
        
        if(ice.ui.IsloggedInUserAFM && !(_permissionJSONresponse.isFolderAdmin)){
            $('#selectedFolderUserPane ul').find('li').each(function(){
                var customerIdArr = $(this).attr('id').split('_');
                var customerId = "";
                if(customerIdArr.length > 1){
                    customerId = customerIdArr[1];
                }else{
                    customerId = $(this).attr('id');
                }
                if(customerId == $('#loggedCustomer').text()){
                    if(!$(this).hasClass("sp") && !$(this).hasClass("s") && !$(this).hasClass('p')){
                        if($(this).hasClass('active') && $(this).hasClass('without_icon')){
                            $(this).attr('class','fm active without_icon');
                            $(this).attr('crole','fm');
                        }else if ($(this).hasClass('active')){
                            $(this).attr('class','fm active');
                            $(this).attr('crole','fm');                         
                        }else{
                            $(this).attr('class','fm');
                            $(this).attr('crole','fm');                         
                        }
                    }
                }
                else{
                    if(!$(this).hasClass("sp") && !$(this).hasClass("s") && !$(this).hasClass('p')){
                        $(this).attr('crole','');
                    }
                }
            });
        }else{
            $('#selectedFolderUserPane ul').find('li').each(function(){
                if(!$(this).hasClass("sp") && !$(this).hasClass("s") && !$(this).hasClass('p')){
                    $(this).attr('crole','');
                }
                if (_permissionJSONresponse.isFolderAdmin){
                    if ($(this).hasClass("sp")){
                        $(this).attr('crole','spa');    
                    }else if ($(this).hasClass("s")){
                        $(this).attr('crole','sa');
                    }else if ($(this).hasClass("p")){
                        $(this).attr('crole','pa');
                    }else {
                        $(this).attr('crole','ad');
                    }
                }
            });
        }
        ice.manageAcess.checkPermissionRule();
        if($('#folderPane').find('ul:eq(0) li span:eq(0)').hasClass('active')){
            ice.manageAcess.chekRootFolderPermission();
        }
        var loogedUserRole = "n";
        $('#selectedFolderUserPane ul').find('li').each(function(){
            var customerIdArr = $(this).attr('id').split('_'); //Split added to handle both tabs as the initializing the id are different
            if(customerIdArr.length > 1){
                if(customerIdArr[1] == $('#loggedCustomer').text()){
                    var roleClass = $(this).attr('class').split(' ');
                    var roleIcon = roleClass[0]; //Get role
                    if(roleIcon != "" && roleIcon != "active"){
                        loogedUserRole = roleIcon;
                    }
                }
            }
        });
    }
    //$('#content-container table td img').css({'margin-right':'0px'});
    $('.indent30').css({'text-indent': '30px'});
    //VSUS change - : User with Administer Account (Manage Roles) at Home or Level1 folder should be able to edit permission to assign roles    
    if (_permissionJSONresponse.manageRolesPermission && $('li.'+selectedFolderId).attr('level') == 1 && !($('#loggedCustomer').text() == $("#selectedUserId").val())){         
        ice.removeUser.disableEnableLinks('applyActive', $('#editPermissionLink'));
    }
    if($('#loggedCustomer').text() ==  $("#selectedUserId").val()){
        ice.removeUser.disableEnableLinks('applyActive', $('#requestPermissionLink'));
    }else{
        ice.removeUser.disableEnableLinks('applyInActive', $('#requestPermissionLink'));
    }
    //myvmware.common.adjustHeightAllSections('#userPermissionPane') //  BUG-00047983 fix
};

// permissions load fail
ice.ui.onFail_loadPermissions = function(data){
    $('#isManageFolderUser').val('NO');
    $('#userPermissionPane').html('<ul><li></li></ul>');
    ice.ui.showExceptionMessages(ice.globalVars.failedPermDetailMsg);
};

// show exceptions
ice.ui.showExceptionMessages = function(message){
    //$('#manageAccessExceptionMessage').html(message);
    //vmf.modal.show("manageAccessExceptionMessagePopup");
};

/*
 * for add folder 
 */
ice.ui.populateAddFolderUI = function(targetDetailsObj) { 
    //ice.common.wordwrap('location', '\\\\'+targetDetailsObj.fPath,'50','</br>','true');
        //$("#location").html($("#fullFolderPath").val());
        $('.error').html('');
        riaLinkmy('users-permissions : by-user : create-folder');
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
                vmf.dropdown.build($("select#listFolderPathCreate"), {optionsDisplayNum:20,optionMaxLength:37,inputMaxLength:37,position:"left",onSelect:ice.ui.activateSaveBtn,optionsClass:'overlayOpts',optionsHolderInline:true});
        });
        $('#confirm').data({fPath:targetDetailsObj.fPath,fId:targetDetailsObj.fId,fName:targetDetailsObj.fName});
        vmf.modal.show("createFolderContent");
};
ice.ui.activateSaveBtn = function(value,text,index){
        if(value!="null"){
            $('#confirm').removeAttr('disabled').removeClass('disabled');
        } else {
            $('#confirm').attr('disabled','disabled').addClass('disabled');
        }
    };
/*
 * For delete folder
 */
ice.ui.populateDeleteFolderUI  =function(targetDetailsObj) { 
    ice.common.wordwrap('deleteFolderLocation', '\\\\'+targetDetailsObj.fPath,'50','</br>','true');
    $('.error').html('');
    $('#deleteFolderConfirm').data({fPath:targetDetailsObj.fPath,fId:targetDetailsObj.fId,fName:targetDetailsObj.fName});
    vmf.modal.show("deleteFolderContent");
    };

/*
 * confirm add folder
 */
ice.ui.confirmAddFolder = function (){ 
    var _newfolderName = $("#newFolderId").val();
    var _folderid = $("#listFolderPathCreate option:selected").val();
    var duplicate = vmf.foldertree.duplicateFolder(_folderid, _newfolderName);
    if(_newfolderName.length > 0){
            if(duplicate) { 
                $('.error').html(ice.globalVars.duplicateFolderMsg);
            } 
            else if(!(_newfolderName.match($.regexAddFolder))) {
                $('.error').html($.invalidFolderMsg);
            }
            else {
                $('#confirm').attr('disabled',true).addClass('waitcursor');//BUG-00021672
                var _fullFolderPath = $('#confirm').data('fPath');
                var addFolderUrl = myPermissionAddFolderUrl;
                var _postData = new Object();
                _postData['selectedFolderId'] = _folderid;
                _postData['newFolderName'] = _newfolderName;
                $.ajax({
                    type: 'POST',
                    url: addFolderUrl,
                    data: _postData,
                    success: function (data) {
                        ice.ui.onSuccess_createFolder(data);
                    },
                    error: function (response, errorDesc, errorThrown) {
                        console.log("In error: " + errorThrown);
                        ice.ui.onFail_createFolder(errorThrown);
                    }
                });
            }
        } else {
            $('.error').html($msgEnterFolderName);
        }
};
// confirm folder success
ice.ui.onSuccess_createFolder = function(data){
    var _errorMessage = vmf.json.txtToObj(data);
    if(_errorMessage!=null && _errorMessage.error){
        $('#confirm').attr('disabled',false).removeClass('waitcursor');//BUG-00021672
        $('.error').html(_errorMessage.message); // BUG-00019110
        return;
    }else{          
            vmf.modal.hide();location.reload();
        }
};
//confirm folder failure
ice.ui.onFail_createFolder = function(data){
    $('#confirm').attr('disabled',false).removeClass('waitcursor');//BUG-00021672
    $('#createFolderTable #newFolderId').removeClass('waitcursor');
    $('.error').html(unknown_error);    
};

/*
 * for rename folder
 */
ice.ui.populateRenameFolderUI = function (targetDetailsObj) {   
    ice.common.wordwrap('existingFolderName', '\\\\'+targetDetailsObj.fPath,'50','</br>','true');
    myvmware.common.putplaceHolder('#renameFolderId');
    $('.error').html('');
    riaLinkmy('users-permissions : by-user : rename-folder');
    $('#renameConfirm').data({fPath:targetDetailsObj.fPath,fId:targetDetailsObj.fId});
    vmf.modal.show("renameFolderContent");
};

/*
 * confirm rename folder
 */
ice.ui.confirmRenameFolder = function(){ 
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
                $('#renameConfirm').attr('disabled',true).addClass('waitcursor');//BUG-00021672
                var _fullFolderPath = $('#renameConfirm').data('fPath');
                var renameFolderUrl = myPermissionRenameFolderUrl;
                var _postData = new Object();
                _postData['selectedFolderId'] = _folderid;
                _postData['newFolderName'] = _newfolderName;
                $.ajax({
                    type: 'POST',
                    url: renameFolderUrl,
                    data: _postData,
                    success: function (data) {
                        ice.ui.onSuccess_renameFolder(data);
                    },
                    error: function (response, errorDesc, errorThrown) {
                        console.log("In error: " + errorThrown);
                        ice.ui.onFail_renameFolder(errorThrown);
                    }
                });
            }
        } else {
            $('.error').html($msgEnterFolderName);
        }
};
// rename success
ice.ui.onSuccess_renameFolder = function(data){
    var _errorMessage = vmf.json.txtToObj(data);
    if(_errorMessage!=null && _errorMessage.error){
        $('#renameConfirm').attr('disabled',false).removeClass('waitcursor');//BUG-00021672
        $('.error').html(_errorMessage.message);// BUG-00019110
        return;
    }else{
            vmf.modal.hide();location.reload();
        }
};
// rename failure
ice.ui.onFail_renameFolder = function(data){
    $('#renameConfirm').attr('disabled',false).removeClass('waitcursor');//BUG-00021672
    $('.error').html(unknown_error);
};

//Confirm delete folder
ice.ui.confirmDeleteFolder = function(){ 
    $('#deleteFolderConfirm').attr('disabled',true).addClass('waitcursor');//BUG-00021672
    var _folderid = $('#deleteFolderConfirm').data('fId');
    var _fullFolderPath = $('#deleteFolderConfirm').data('fPath');
    var deleteFolderUrl = myPermissionDeleteFolderUrl+ '&selectedFolderId=' + _folderid;
        
        vmf.ajax.post(deleteFolderUrl,
                null, 
                ice.ui.onSuccess_deleteFolder, 
                ice.ui.onFail_deleteFolder);
};


//delete success
ice.ui.onSuccess_deleteFolder = function(data){
    var errorMessage = vmf.json.txtToObj(data);
    if(errorMessage!=null && errorMessage.error){
        vmf.modal.hide();
        $('#deleteFolderConfirm').attr('disabled',false).removeClass('waitcursor');//BUG-00021672
        $("#deleteFolderName").html($('#deleteFolderConfirm').data('fName'));
        $("#deleteFolderNameTwo").html($('#deleteFolderConfirm').data('fName'));
        $('#error').html(errorMessage.message); // BUG-00019110
        ice.ui.showDeleteFailureContent(data);
    }else{
            vmf.modal.hide();
            location.reload();
        }
    };
    
ice.ui.showDeleteFailureContent = function (data) {
        setTimeout(function(){vmf.modal.show("deleteFolderFailureContent");},20);
    };  

    //delete failure
ice.ui.onFail_deleteFolder = function(data){
    $('#deleteFolderConfirm').attr('disabled',false).removeClass('waitcursor');//BUG-00021672
    $('.error').html(unknown_error);
    };
        
//Add User to Folder Scripts
/*
 * add user
 */
ice.ui.renderAddUser = function(targetDetailsObj){  
   var _folderid = targetDetailsObj.fId;
   var _addUserUrl = manageAccessAddUserUrl+ '&selectedFolderId=' + _folderid;
   vmf.ajax.post (_addUserUrl, null, ice.ui.get_success, ice.ui.get_failure);
};
// add user success
ice.ui.get_success = function(event){
    $('#addusersContent #content_8 .loading').hide();
    $('#addusersContent #accountUserPane').show();
    $('#eaNumber').html('');
_selectedFolderName = $("#selectedFolderName").val();
    var _userjsonresponse = vmf.json.txtToObj(event);
    var _folder_name = _selectedFolderName;
    var _user_list =(_userjsonresponse) ? _userjsonresponse.userList : "";
    var _list_item = '';
    $('#populate_list .possibleUsersList').html('');

    $('#eaNumber').append((_userjsonresponse)?_userjsonresponse.eaNumber:" ");
    for(var i=0;i<_user_list.length;i++){
        $('#populate_list .possibleUsersList').append('<li class="fn_userID_'+(i+1)+'">'+'<input id="checkbox'+(i+1)+'" name="checkbox" value='+_user_list[i].customerNumber+' type="checkbox"/>'+'<label for="checkbox'+(i+1)+'">'+_user_list[i].firstName+' '+_user_list[i].lastName+'</label>'+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="email">'+_user_list[i].email+'</span> </li>');        
                                
    }
    $('.possibleUsersList li input').click(function(){
                    $('#btn_next').removeAttr("disabled").removeClass('disabled').addClass('button');
                    //$('#btn_next').removeClass('disabled');
                    //$('#btn_next').addClass('button');                    
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
                            if(curId < prevId && flag)  { 
                                
                                if(prevClass == "") {
                                    $('<li class="' + liClass + '"> <a class="remove" href="#">'+ice.globalVars.removeLbl+'</a><span class="name">' + inputName + '</span> <span class="email emailremove">' + inputEmail + '</span> </li>').insertBefore($('ul.removeUsersList li.'+curClass));                                    
                                    $('#addUserMain #validatedUsers').append('<li class="' + liClass + '"> <a class="remove" href="#">'+ice.globalVars.removeLbl+'</a><span class="name">' + inputName + '</span> <span class="email emailremove">' + inputEmail + '</span> </li>');
                                    $('#addUsersToFoldersContent4 #selectedAddUsersList').append('<tr class='+liClass+'><td>'+inputName+'</td><td class="label">'+inputEmail+'</td></tr>');      // invite user's 3rd popup for adding account user                         
                                }
                                else    {
                                    $('<li class="' + liClass + '"> <a class="remove" href="#">'+ice.globalVars.removeLbl+'</a><span class="name">' + inputName + '</span> <span class="email emailremove">' + inputEmail + '</span> </li>').insertAfter($('ul.removeUsersList li.'+prevClass));
                                    $('#addUserMain #validatedUsers').append('<li class="' + liClass + '"> <a class="remove" href="#">'+ice.globalVars.removeLbl+'</a><span class="name">' + inputName + '</span> <span class="email emailremove">' + inputEmail + '</span> </li>');
                                    $('#addUsersToFoldersContent4 #selectedAddUsersList').append('<tr class='+liClass+'><td>'+inputName+'</td><td class="label">'+inputEmail+'</td></tr>');      // invite user's 3rd popup for adding account user                         
                                }
                                flag = false;
                                
                            }
                            prevClass = $(this).attr('class');
                        });
                        if(flag)    {
                            $('ul.removeUsersList').append('<li class="' + liClass + '"> <a class="remove" href="#">'+ice.globalVars.removeLbl+'</a><span class="name">' + inputName + '</span> <span class="email emailremove">' + inputEmail + '</span> </li>');                                                                                                      
                                $('#addUserMain #validatedUsers').append('<li class="' + liClass + '"> <a class="remove" href="#">'+ice.globalVars.removeLbl+'</a><span class="name">' + inputName + '</span> <span class="email emailremove">' + inputEmail + '</span> </li>');
                                $('#addUsersToFoldersContent4 #selectedAddUsersList').append('<tr class='+liClass+'><td>'+inputName+'</td><td class="label">'+inputEmail+'</td></tr>');      // invite user's 3rd popup for adding account user                         
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
                    //_updateSelectedUsers();
                });
};
//add user failure
ice.ui.get_failure = function(statusError,msgtext){
    vmf.modal.hide();
    if(msgtext=="parsererror") {    
        vmf.modal.show("parsererror");
   } else {
        vmf.modal.show("systemexception");
  }
}; 
                
ice.ui.confirmUser = function (){   
    $('#fldr_name').html('');
    $('#row').html('');
    var _name, _email, _confirmStr ='';
    var _arrayOfSelectedUsers = new Array();
    _confirmStr = '<table><tbody>';             
    $(".possibleUsersList input:checkbox[name=checkbox]:checked").each(function() {
        _arrayOfSelectedUsers.push($(this).val());
        _name = $(this).next('label').text();
        _email = $(this).parent('li').find('.email').text();        
        _confirmStr += '<tr><td>'+_name+'</td><td>'+_email+'</td></tr>';
    });
    _confirmStr +='</tbody></table>';
    if(_arrayOfSelectedUsers.length > 0){
        $('#custNumber').val(_arrayOfSelectedUsers);
        
    }
    $('#row').append(_confirmStr); 
    $('#fldr_name').append('<img src="/static/myvmware/common/css/img/folder_gray.png" height="10" width="18" alt="No" />');
    $('#fldr_name').append(' ');
    $('#fldr_name').append($("#selectedFolderName").val()); 
    vmf.modal.hide();
    $("#confirmAddUserToFolderContent #row").css({"height":"150px","overflow-y":"auto"});
    setTimeout(function(){vmf.modal.show("confirmAddUserToFolderContent");},10);// to show the second popup from the first popup    
};
/*
 * navigate back to add user
 */
ice.ui.backToAddUser = function(){
    vmf.modal.hide();               
};
/*
 * confirm adding user
 */             
ice.ui.confirmAddUser = function(){ 
    var _custNumber = $('#custNumber').val();
    var _folderId = $('#folderId').val(); 
    var _url=manageAccessAddUserToFolderUrl+ '&selectedFolderId=' + _folderId +'&customerNumbers=' +_custNumber;
    vmf.ajax.post (_url, null, ice.ui.success_move, ice.ui.failure_move);
};
// add user success
ice.ui.success_move = function(event){
    vmf.modal.hide();
    location.reload();
};
// add user failure
ice.ui.failure_move = function(statusError,msgtext){
    vmf.modal.hide();
    if(msgtext=="parsererror") {    
        vmf.modal.show("parsererror");
   } else {
        vmf.modal.show("systemexception");
  }
}; 
ice.ui.populateAddUserUI = function(targetDetailsObj){
    $('#addusersContent #headerForAFolder').html('<h1>'+ice.globalVars.folderToAddLbl+'<span id="folder_name"></span></h1>');
    $('#addusersContent .headerTitle #selFolder_name').remove();
        if(targetDetailsObj.fId){
            $('#addusersContent .headerTitle').append('<span id="selFolder_name">&nbsp;to&nbsp;&ldquo;<span></span>&rdquo;&nbsp;'+ice.globalVars.folderLbl+'</span>');
        }
    ice.inviteUser.addUserStep1Flag = 'invite';
    ice.ui.resetAddUserVal(targetDetailsObj);
    selectedUsersFolderIds = ice.inviteUser.selectedFolderId;
    //riaLinkmy('users-permissions : by-user : add-user'); 
    //vmf.modal.show('addUserMain');
    vmf.modal.show('addUserMain', { position:['10%']});
    ice.ui.renderAddUser(targetDetailsObj); 
};  
ice.ui.populateShareFolder = function (targetDetailsObj) { 
    if($('#shareFolderContent .headerTitle #selFolder_name').length) $('#shareFolderContent .headerTitle #selFolder_name').remove();
    if(targetDetailsObj.fId){
        $('#shareFolderContent .headerTitle span').html('<span id="selFolder_name">&ldquo;<span></span>&rdquo;</span>');
    }
    ice.inviteUser.addUserStep1Flag = 'share';
    ice.ui.resetAddUserVal(targetDetailsObj);
    selectedUsersFolderIds = ice.inviteUser.selectedFolderId;
    vmf.modal.show('addUserMain', { position:['10%','20%']});
    $('#addusersContent').hide();
    $('#shareFolderContent').show();
    $('#totalUsers,#totalSelectedUsers').text(0);
    $('#preLoader').show();
    ice.inviteUser.userJsonResponse = userJsonResponse;
    ice.inviteUser.renderUsers('');
};
ice.ui.resetAddUserVal = function(targetDetailsObj){
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
}
ice.ui.populateMoveFolderUI = function (targetDetailsObj) {         
    $("#moveFolderName").html('');
    ice.common.wordwrap('moveFolderName', '\\\\'+targetDetailsObj.fPath,'50','</br>','true');   
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
                vmf.dropdown.build($("select#listFolderPath"), {optionsDisplayNum:20,ellipsisSelectText:false,ellipsisText:'',optionMaxLength:37,inputMaxLength:37,position:"left",onSelect:ice.ui.activateMoveContinueBtn,optionsClass:'overlayOpts',optionsHolderInline:true});
        }); 
    $('#moveFolderconfirm').data({fPath:targetDetailsObj.fPath,fId:targetDetailsObj.fId,fName:targetDetailsObj.fName,parentfId:targetDetailsObj.parentfId});
    vmf.modal.show("moveFolderContent");
};

ice.ui.activateMoveContinueBtn= function(value,text,index){
    if(value!="null"){
        $('#moveFolderNext').removeAttr('disabled').removeClass('disabled');
    } else {
        $('#moveFolderNext').attr('disabled','disabled').addClass('disabled');
    }
    ice.ui.populateTargetFolder();
};

ice.ui.populateTargetFolder = function (){  
    $("#targetFolderLocation").html(vmf.wordwrap($("#listFolderPath option:selected").text(),2));
};

ice.ui.populateConfirmMoveFolderUI= function(){         
    $("#sourceFolderName").html('');
    $("#sourceFolderName").append($('#moveFolderconfirm').data('fName'));   
    vmf.modal.show("confirmMoveFolderContent");
};

ice.ui.confirmMoveFolder = function () {
    $('#moveFolderconfirm').attr('disabled',true).addClass('waitcursor');//BUG-00021672
    var selectedFolderID = $('#moveFolderconfirm').data('fId');
    var selectedFolderName = $('#moveFolderconfirm').data('fName');;
    var targetFullFolderPath = $("#targetFolderLocation").text();           
    var folderReadTime = $("#folderCacheTimestamp").val();
    var moveFolderUrl = manageAccessByUser_myPermissionMoveFolderUrl + '&selectedFolderId=' +selectedFolderID + '&targetFullFolderPath=' +targetFullFolderPath  +'&folderReadTime='+folderReadTime;
    vmf.ajax.post(moveFolderUrl,
            null, 
            ice.ui.onSuccess_moveFolder, 
            ice.ui.onFail_moveFolder);  
};
ice.ui.onSuccess_moveFolder = function(data) {
    var errorMessage = vmf.json.txtToObj(data);
    if (errorMessage!=null && errorMessage.error) {
        $('#moveFolderconfirm').attr('disabled',false).removeClass('waitcursor');//BUG-00021672
        if (errorMessage.message != null) {
            $('.error').html(errorMessage.message);
        } else {
            $('.error').html(moveFolder_folderexists);
        } 
    } else {
        vmf.modal.hide();
        location.reload();
      }     
};
ice.ui.onFail_moveFolder = function(data) {
    $('#moveFolderconfirm').attr('disabled',false).removeClass('waitcursor');//BUG-00021672
    $('.error').html(moveFolder_unknownError);
};
ice.ui.populateCopyPermissionsUI = function(targetDetailsObj){ 
    var selectedUserId = targetDetailsObj.userId;
    var copyPermissionUrl = manageAccessCopyPermissionsUrl + '&selectedUserId=' + selectedUserId;
    window.location.href = copyPermissionUrl;
};
ice.ui.exportToCSV = function(targetDetailsObj){//from contextmenu
    var _fPerPostData = new Object();
    _fPerPostData['selectedFolders'] = "ALL";
    _fPerPostData['selectedUserCustomerNumber'] = targetDetailsObj.userId;
    _fPerPostData['reportFor'] = 'byUserFromExportContextMenu';
    myvmware.common.generateCSVreports($exportToCsvActionByUserUrl, _fPerPostData, "users-permissions : by-user : contextmenu : export-all", "users-permissions : by-user: Export-to-CSV : Error");
            
    //var selectedUserId = targetDetailsObj.userId;
    //myvmware.common.generateReports($exportToCsvActionByUserUrl + '&reportFor=byUserFromExportContextMenu&folderId=ALL'+'&selectedUserId='+selectedUserId)
};
$('#exportToCsvByUser').click(function() {// Actions menu
    var targetDetailsObj = ice.ui.getTargetDetailsObj();
    var _fPerPostData = new Object();
    
    var cId = targetDetailsObj.custId+"";
    if(cId != 'undefined' && cId != ''){ // if the custId is blank then we should not submit from actions menu.
        _fPerPostData['selectedFolders'] = "ALL";
        _fPerPostData['selectedUserCustomerNumber'] = targetDetailsObj.custId;
        _fPerPostData['reportFor'] = 'byUserFromExportActions';
        myvmware.common.generateCSVreports($exportToCsvActionByUserUrl, _fPerPostData, "users-permissions : by-user : actions : export-all", "users-permissions : by-user: Export-to-CSV : Error");
    }
    
    //myvmware.common.generateReports($exportToCsvActionByUserUrl + '&reportFor=byUserFromExportActions&folderId=ALL'+'&selectedUserId='+targetDetailsObj.custId);
});
$('#exportAllToCsvButton').click(function() {
    var _fPerPostData = new Object();
    _fPerPostData['selectedFolders'] = "ALL";
    _fPerPostData['selectedUserCustomerNumber'] = "ALL";
    _fPerPostData['reportFor'] = 'byUserFromExportAllButton';
    myvmware.common.generateCSVreports($exportToCsvActionByUserUrl, _fPerPostData, "users-permissions : by-user : export-all", "users-permissions : by-user: Export-to-CSV : Error");
            
    //myvmware.common.generateReports($exportToCsvActionByUserUrl + '&reportFor=byUserFromExportAllButton&folderId=ALL&selectedUserId=ALL')
}); 
ice.ui.onSuccess_copyPermission = function(data){
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
                    //$('span.fn_selectedUsers').html(getCount);
                    $('#copyPerm_next').removeClass('secondary');
                    $('#copyPerm_next').removeAttr("disabled");
                }else{
                    //$('span.fn_selectedUsers').html('0');
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
                    //$('span.fn_selectedUsers').html(getCount_new);
                    $('#copyPerm_next').removeClass('secondary');
                    $('#copyPerm_next').removeAttr("disabled");
                }else{
                    //$('span.fn_selectedUsers').html('0');
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
                    //$('span.fn_selectedUsers').html(getCount_new);
                    $('#copyPerm_next').removeClass('secondary');
                    $('#copyPerm_next').removeAttr("disabled");
                }else{
                    //$('span.fn_selectedUsers').html('0');
                    $('#copyPerm_next').addClass('secondary');
                    $('#copyPerm_next').attr('disabled','disabled');
                }
            inputId = $this.parent().find('input').val();
            //Look to the right side for the class name and .remove();
            $('ul.copyPermissionRemoveUsersList li#'+inputId).remove();
        }
        //_updateSelectedUsers();
    });
};

// add events to the links

$('#tab1').click(function() {   
    window.location = ManageAccessByFolder_url;
    
});
$('#tab3').click(function() {   
    window.location = ManageAccessMyPermissions_url;
    
});
$('#tab4').click(function() {   
    window.location = ManageAccessByContract_url;
    
});
$("#tab5").click(function() {
    window.location = $renderManageAccessMyEPP;
});
$("#tab6").click(function() {
    window.location = $renderManageAccessByServices;
});
$('#createFolder').click(function() {
    var targetDetailsObj = ice.ui.getTargetDetailsObj();
    if(!$(this).hasClass('dummyClick')){
        ice.ui.populateAddFolderUI(targetDetailsObj);
    }
});

$('#renameFolder').click(function() {
    var targetDetailsObj = ice.ui.getTargetDetailsObj();
    if(!$(this).hasClass('dummyClick')){
    if($('#folderId').val().length > 0){
        if($('#folderAccess').val()== FOLDER_ACCESS_PERMISSION_MANAGE_VIEW){
            ice.ui.populateRenameFolderUI(targetDetailsObj);
        }
    }
    return false;
}
});

$('#confirm').click(function() {    
    ice.ui.confirmAddFolder();  
});

$('#createFolderTable #newFolderId').keypress(function(e){
    if(e.which == 13){
        $(this).addClass('waitcursor');
        $('#confirm').trigger('click');
    }
});

$('#renameConfirm').click(function() {
    ice.ui.confirmRenameFolder();
});

$('#addusers').click(function() {
    var targetDetailsObj = ice.ui.getTargetDetailsObj();
    if(!$(this).hasClass('dummyClick')){
        ice.ui.populateAddUserUI(targetDetailsObj);
     }
});
$('#shareFolder').click(function() {
    var targetDetailsObj = ice.ui.getTargetDetailsObj();
    if(!$(this).hasClass('dummyClick')){
        ice.ui.populateShareFolder(targetDetailsObj);
     }
});
$('#shareFolderBtn').click(function() {
    var targetDetailsObj = {
        fPath :'',
        fId :'',
        fName:'',
        parentfId:'',
        custId:''
    };
    ice.ui.populateShareFolder(targetDetailsObj);
});
$('#inviteUserBtn').click(function() {
    var targetDetailsObj = {
        fPath :'',
        fId :'',
        fName:'',
        parentfId:'',
        custId:''
    };
    ice.ui.populateAddUserUI(targetDetailsObj);
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
            ice.inviteUser.handleFolderTree(portletNs,manageAccessByUser_action_getFoldersPerUser_url);
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
$('#confirm_addUser').click(function() {
    ice.ui.confirmAddUser();
});
$('#btn_cancel7').click(function() {
    ice.ui.backToAddUser();         
});

$('#moveFolder').click(function() { 
    var targetDetailsObj = ice.ui.getTargetDetailsObj();
    if(!$(this).hasClass('dummyClick')){
    if($('#folderId').val().length > 0){
        if($('#folderAccess').val()== FOLDER_ACCESS_PERMISSION_MANAGE_VIEW){
        $('.error').html('');
        ice.ui.populateMoveFolderUI(targetDetailsObj);      
        }
    }
    return false;
    }
});

$('#moveFolderconfirm').click(function() {
    ice.ui.confirmMoveFolder();
});

$('#deleteFolder').click(function() {
    var targetDetailsObj = ice.ui.getTargetDetailsObj();
    if(!$(this).hasClass('dummyClick')){
    if($('#folderId').val().length > 0){
        if($('#folderAccess').val()== FOLDER_ACCESS_PERMISSION_MANAGE_VIEW){
                ice.ui.populateDeleteFolderUI(targetDetailsObj);
        }
    }
    return false;
    }
    });

$('#deleteFolderConfirm').click(function() {
    ice.ui.confirmDeleteFolder();
});

$('#moveFolderNext').click(function() {
    if ($("#listFolderPath").val()=="null") {
        $('.error').html(moveFolder_empty_folder_msg);
        return false;
    } else {
        vmf.modal.hide();
        $('.error').html('');
        setTimeout(function(){ice.ui.populateConfirmMoveFolderUI();},10);   // to show the second popup from the first popup
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
    ice.ui.populateMoveFolderUI(targetDetailsObj);
    setTimeout(function(){ice.ui.populateMoveFolderUI(targetDetailsObj);},10);  // to show the second popup from the first popup
});
$('#removeUserBtn').click(function() {
    if($('#isManageFolderUser').val()=='YES'){
    ice.ui.renderRemoveUser();
    }
    else{
        return false;
    }
    
});

$('#copyPermissionsBtn').click(function() {
    var _userId = $('ul.info_list li').filter('.active').attr('val');
    $("#selectedUserId").val(_userId);
    var targetDetailsObj = {userId:$("#selectedUserId").val()};
    if($("#selectedUserId").val().length > 0) {
        if(!$('#copyPermissionsBtn').hasClass('dummyClick')){
            ice.ui.populateCopyPermissionsUI(targetDetailsObj);
        }
    }
    return false;
});

$('#eaSelectorDropDown').change(function() {
    setTimeout(function(){
        $(window).trigger("resize");    
    },5000);
});

ice.ui.renderRemoveUser = function () {
    var _selectedUserName = $("#slectedUserName").text();
    var _selectedUserEmail = $("#userPaneSelectedUserEmail").text();    
    //var _height=$("#permissionSection").outerHeight(true)- $("#userDetails").outerHeight(true)-22+"px"; //22px is header pane height
    //$("#userPermissionPane").height(_height);
    var removeUserUrl = manageAccessRemoveUserUrl+ '&selectedUserName=' + _selectedUserName +'&selectedUserEmail=' +_selectedUserEmail;
    vmf.ajax.post(removeUserUrl, null, ice.ui.onSuccess_removeUser, ice.ui.onFailure_removeUser);
};

ice.ui.onSuccess_removeUser = function(data) {
    var errorMessage = vmf.json.txtToObj(data); 
    var _selectedUserName = errorMessage.selectedUserName;
    var _selectedUserEmail = errorMessage.selectedUserEmail;    
    $("#selectedUserName").html(_selectedUserName);
    $("#selectedUserEmail").html(_selectedUserEmail);
    vmf.modal.show("removeUserPopup");
};

ice.ui.onFailure_removeUser = function(data) {
    vmf.modal.hide();
    if(msgtext=="parsererror") {    
        vmf.modal.show("parsererror");
    } else {
        vmf.modal.show("systemexception");
    }
};
ice.ui.onSuccess_confirm_removeUser = function(data) {
    var errorMessage = vmf.json.txtToObj(data); 
    if (errorMessage.status != null) {
        vmf.modal.hide();
        location.reload();
    }
};
$('#confirm_removeUser').click(function() {
    //var selectedUserCn = $("input[@name=userId]:checked").val();
    var selectedUserCn = $('ul.info_list li').filter('.active').attr('val');
    var removeUserUrl_confirm = manageAccessRemoveUserUrl_confirm+ '&selectedUserCn=' + selectedUserCn;
    vmf.ajax.post(removeUserUrl_confirm, null, ice.ui.onSuccess_confirm_removeUser, ice.ui.onFailure_removeUser);
});
$('.helpLink').css({'right':'0px','top':'17px'});
$('#cancel_removeUser').click(function() {
    vmf.modal.hide();
});

/**Added by Praveer for clearing default text on click for filter users*/
$(".modalContent .fn_cancel").click(function(){
    vmf.modal.hide();
    $('.modalContent .button').uncorner();
    return false;
 });
ice.ui.userFilterClearText = function() {
    $('#userFilterTxt').val(ice.globalVars.enterEmail);
    //$("#filterusersContent .searchInput").next().addClass('sIcon').removeClass('clearSearch');
    $("#userFilterTxt").focus(function() {
        if(this.value == this.defaultValue) {
            this.value = '';
        }
        else {
            this.select();
        }
    });

    $("#userFilterTxt").blur(function() {
        if($.trim(this.value) == '') {
            this.value = (this.defaultValue ? this.defaultValue : '');
        }
    });
};

ice.ui.getMinPermissionData = function(selectedFolder, cbState) {
        var _fPerPostData = new Object();
        _fPerPostData['selectedFolderId'] = selectedFolder;
        $.ajax({
            type: 'POST',
            url: folderMinPermissionURL,
            async: true,
            dataType: "json",
            data: _fPerPostData,
            success: function (folderPermission) {
                //Store permission in folder tree HT
                vmf.foldertree.storePermission(selectedFolder, folderPermission);
                ice.ui.folderPermToDOM(selectedFolder, cbState);
                //ice.ui.populateUserPaneUI(selectedFolder, cbState);
                var _userId = $('ul.info_list li').filter('.active').attr('val'); //$("input[@name=userId]:checked").val();
                ice.ui.loadPermissions(_userId,selectedFolder,'FALSE',cbState);
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
  };    
ice.ui.folderPermToDOM = function(folderId, cbState) {
        var folderHT = vmf.foldertree.getFolderHashtable();
        var folderTreeObj = vmf.foldertree.getFolderJSON();
        $.rootFolder = '';
        $("#fullFolderPath").val('');
        $("#selectedFolderName").val('');
        $("#folderId").val('');
        $("#folderAccess").val('');
        $("#parentFolderId").val('');
        if (cbState == "checked") {
            
            var _fullFolderPath = folderHT.get(folderId).fullFolderPath;
            var _selectedFolderName = folderHT.get(folderId).folderName;
            var folderAccess = folderHT.get(folderId).folderAccess;
            var parentFolderId = folderHT.get(folderId).parentFolderId;
            ice.removeUser.setLoggedInUser(folderAccess);
            $("#parentFolderId").val(parentFolderId);
            $("#fullFolderPath").val(_fullFolderPath);
            $("#selectedFolderName").val(_selectedFolderName);
            $("#folderId").val(folderId);
            $("#folderAccess").val(folderAccess);
            $('#selectedFolderId').val(folderId);
            if(folderAccess != 'MANAGE') {
                ice.ui.activeInactiveDropDown($('.dropdown ul li a'),'inactive');
                $('.dropdown a').addClass('dummyClick');
                ice.ui.activeInactiveDropDown($('#findFolder'),'active');
                $('#findFolder, #addusers,#shareFolder').removeClass('dummyClick');
            }
            else {                      
                if(folderHT.get(folderId).folderType=='ROOT'){
                    $.rootFolder = 'ROOT';
                    $('.dropdown li').each(function(){
                        if($(this).find('a').attr('id')=='createFolder'){
                            $(this).find('a').removeClass('dummyClick');
                            $(this).removeClass('inactive');
                        } else {
                            $(this).find('a').addClass('dummyClick');
                            $(this).removeClass('active').addClass('inactive');
                        }
                    });
                } else {
                    ice.ui.activeInactiveDropDown($('.dropdown ul li a:not("#copyPermissionsBtn")'),'active');
                    $('.dropdown a:not("#copyPermissionsBtn")').removeClass('dummyClick');
                }
                ice.ui.activeInactiveDropDown($('#findFolder, #addusers,#shareFolder'),'active');
                $('#findFolder, #addusers,#shareFolder').removeClass('dummyClick');
            }
        }
        else {
            ice.ui.activeInactiveDropDown($('.dropdown ul li a'),'inactive');
            $('.dropdown a').addClass('dummyClick');
            ice.ui.activeInactiveDropDown($('#findFolder, #addusers,#shareFolder'),'active');
            $('#findFolder, #addusers,#shareFolder').removeClass('dummyClick');
            if(ice.ui.createFolderFlg){
                $('.dropdown a#createFolder').removeClass('dummyClick').parent('li').removeClass('inactive');
            }
        }
        
        if(folderAccess == 'MANAGE') ice.ui.IsloggedInUserAFM = true; else ice.ui.IsloggedInUserAFM = false;
 }; 
 
 ice.ui.bindEvents= function(){
        ice.filterUser.adjustUserList();
        $('ul.info_list li').live('click mouseover mouseout',function(e){
            e.preventDefault();
            if(e.type=='mouseover'){
                $(this).addClass('hover'); return;
            } else if (e.type=='mouseout'){
                $(this).removeClass('hover');return;
            } else {
                if($(this).hasClass('active')){
                    return;
                }
                $(this).parents('ul.info_list').find('li').removeClass('active').find('label').removeClass('normalWhiteSpace');
                $(this).addClass('active').find('label').addClass('normalWhiteSpace');
                
                //Hide the existing elements and show loading.
                $("#loadingDiv").show();
                $("#treeViewTextDiv").hide();
                $("#serviceList").empty();
                ice.ui.populateUesrDetails($(this).attr('val'));
                if ($(this).attr("sdp")!="true"){
                    ice.ui.loadFolders($(this));
                } else {
                    ice.ui.loaded=true; //No need to call folders. Hence marking loading as true
                    ice.ui.resetAllFolderOps();
                    $("#folderPane").hide();
                }
                ser.getServices();
            }
        });
    };
ice.ui.activeInactiveDropDown = function(divObj,flag){
    if(flag=='active')
        divObj.parent('li').removeClass('inactive').removeClass('inactive');
    else
        divObj.parent('li').removeClass('active').addClass('inactive');
};
ice.ui.getRootPermissionData = function(selectedFolder) {
    var _fPerPostData = new Object();
    _fPerPostData['selectedFolderId'] = selectedFolder;
    $.ajax({
        type: 'POST',
        url: folderMinPermissionURL,
        async: true,
        dataType: "json",
        data: _fPerPostData,
        success: function (folderPermission) {
            //Store permission in folder tree HT
            var _isLoggedInUserFM = folderPermission.manage;
            if(_isLoggedInUserFM){
                ice.ui.activeInactiveDropDown($('#copyPermissionsBtn'),'active');
                $('#copyPermissionsBtn').removeClass('dummyClick');
            }else{
                ice.ui.activeInactiveDropDown($('#copyPermissionsBtn'),'inactive');
                $('#copyPermissionsBtn').addClass('dummyClick');
            }
        },
        error: function (response, errorDesc, errorThrown) {
            ice.ui.activeInactiveDropDown($('#copyPermissionsBtn'),'inactive');
            $('#copyPermissionsBtn').addClass('dummyClick');
        },
        beforeSend: function() {
            //TODO
        },
        complete: function(jqXHR, settings) {
            //TODO
        }
    });
};
ice.ui.getTargetDetailsObj = function(){
        var selectedUserId = $('#userDiv ul li').filter('.active').attr('val');
        var targetDetailsObj = {
                    fPath :$('#fullFolderPath').val(),
                    fId :$('#folderId').val(),
                    fName:$('#selectedFolderName').val(),
                    parentfId:$('#parentFolderId').val(),
                    custId:selectedUserId
        };
        return targetDetailsObj;
};
ice.ui.checkFolderPermissions = function(target){
    var _fPerPostData = new Object(),postData = new Object(),
        folderId = $(target).closest('li').data('folderId'),
        userId = $('#userDiv ul li').filter('.active').attr('val');
        _fPerPostData['selectedFolders'] = folderId;
        postData['selectedFolderId'] = folderId;
        postData['selectedUserCustomerNumber'] = userId;
        vmf.ajax.post(folderMinPermissionURL,_fPerPostData,ice.ui.onsuccess_getPerm(target),ice.ui.onfailure_getPerm,null,null,null,false);
        vmf.ajax.post(manageAccessByUser_action_getPermissionsPerFolderPerUser_url,postData,ice.ui.onSuccess_getUserPerm(target),ice.ui.onFail_userPerm,null,null,null,false);
};
ice.ui.onsuccess_getPerm = function(target){
    return function(folderPermission){
        var json=(typeof folderPermission!="object")?vmf.json.txtToObj(folderPermission):folderPermission;
        $(target).closest('li').data({fManage:json.manage});
    }
},
ice.ui.onfailure_getPerm = function(){
    //alert("");
},
ice.ui.onSuccess_getUserPerm = function(target){
        return function(data){
            var jsonResponse = (typeof data!="object")?vmf.json.txtToObj(data):data;
            if(jsonResponse.permissionPaneContents.length){
                var _cnt = 0, _selectedUserInherited = false, _isSet = jsonResponse.permissionPaneContents[4].isSet, _permissionLen = jsonResponse.permissionPaneContents.length;
                var _isLoggedInUserCanEdit = jsonResponse.permissionPaneContents[4].isLoggedInUserCanEdit;
                for(var i=0;i<jsonResponse.permissionPaneContents.length ;i++){
                    if(jsonResponse.permissionPaneContents[i].isInherited==false)
                        _cnt = _cnt+1;  
                    if(jsonResponse.permissionPaneContents[i].isInherited == true)
                      _selectedUserInherited = true;
                }
                $(target).closest('li').data({inherit:_selectedUserInherited,isSet:_isSet,permLen:_permissionLen,count:_cnt,isLoggedInUserCanEdit:_isLoggedInUserCanEdit});
            }
        }
    },
ice.ui.onFail_userPerm = function(){
        //error
},
ice.ui.setContextMenuState = function(target,cmenu,disableMnu){
    var ftype = $(target).closest('li').data('ftype'),
        fManage = $(target).closest('li').data('fManage');
    if(ftype=='ROOT'){
        cmenu.find('li').each(function () {
            if ($(this).find('a').attr('id') == 'create_folder') {
                $(this).find('a').removeClass(disableMnu);
                $(this).removeClass('inactive');
            } else {
                $(this).find('a').addClass(disableMnu);
            }
        });
    } else {
        cmenu.find('a').removeClass(disableMnu).parent('li').removeClass('inactive');
    }
    cmenu.find('a#add_user,a#share_folder').removeClass(disableMnu).parent('li').removeClass('inactive');
    /*Remove User change state*/
    if($(target).closest('li').data('permLen')){
        var _self = $('#userDiv ul li').filter('.active') || $('ul.info_list li').filter('.active');
        var _suorpu = _self.is('.s, .p, .sp'),
                permDetails = $(target).closest('li').data(),
                _inherited=permDetails.inherit,
                _isSet=permDetails.isSet,
                _permLen=permDetails.permLen,
                _cnt=permDetails.count,
                _isLoggedInUserCanEdit = permDetails.isLoggedInUserCanEdit;
            
            if(IsLoggedInUserSUorOU && (!_suorpu) && _inherited == false){
                cmenu.find('a#remove_user').removeClass(disableMnu).parent('li').removeClass('inactive');
            }else if(( _isSet == true && fManage && !_isLoggedInUserCanEdit) || _inherited == true || ( _permLen >_cnt ) || ( !fManage )){
                cmenu.find('a#remove_user').addClass(disableMnu).parent('li').addClass('inactive');
            }else{
                cmenu.find('a#remove_user').removeClass(disableMnu).parent('li').removeClass('inactive');
            }
    } else { 
        cmenu.find('a#remove_user').addClass(disableMnu).parent('li').addClass('inactive');
    }
    var selectedUserId = $('#userDiv ul li').filter('.active').attr('val');
    if(selectedUserId == $('#loggedCustomer').text()){
        cmenu.find('a#request_access').removeClass(disableMnu).parent('li').removeClass('inactive');
    } else {
        cmenu.find('a#request_access').addClass(disableMnu).parent('li').addClass('inactive');
    }
};
ice.ui.isUserManageRole = function(){
    vmf.ajax.post($loggedInUserFoldersWithManagepermissionUrl,null,function(data){
        var json=(typeof data!="object")?vmf.json.txtToObj(data):data;
        if(json.folderPathList.length){
            $('#shareFolderBtn,#inviteUserBtn').show();

            myvmware.common.showMessageComponent('USER_PERMISSION');
            myvmware.common.setBeakPosition({
                  beakId: myvmware.common.beaksObj["BEAK_USERPERMISSION_PAGE_FOR_SHARE_FOLDER"]
                , beakName: "BEAK_USERPERMISSION_PAGE_FOR_SHARE_FOLDER"
                , beakNewText: "New: "
                , beakHeading: "Share Folder"
                , beakContent: ice.globalVars.beakAddUsersMsg
                , target: $('#shareFolderBtn')
                , multiple: true
            });
        }else{
            $('#shareFolderBtn,#inviteUserBtn').hide();
        }
    },function(){
        /*error*/
    });
};
ice.ui.setCreateFolderPerm = function(){
        if(ice.ui.createFolderFlg == null){
            vmf.ajax.post($loggedInUserFoldersWithManagepermissionUrl,null,function(data){
                var json=(typeof data!="object")?vmf.json.txtToObj(data):data;
                if(json.folderPathList.length){
                    $('.dropdown').find('a#createFolder').removeClass('dummyClick').parent('li').removeClass('inactive');
                    ice.ui.createFolderFlg = true;
                } else {
                    $('.dropdown').find('a#createFolder').addClass('dummyClick').parent('li').addClass('inactive');
                    ice.ui.createFolderFlg = false;
                }
            },function(){
                /*error*/
            });
        } else if (ice.ui.createFolderFlg) {
            $('.dropdown').find('a#createFolder').removeClass('dummyClick').parent('li').removeClass('inactive');
        }
};
ice.ui.resetAllFolderOps = function(){
    $('.dropdown').find('a#createFolder,a#deleteFolder,a#findFolder,a#moveFolder,a#renameFolder,a#removeUserLink').addClass('dummyClick').parent('li').addClass('inactive');
}
ice.ui.permissionPaneHt = function() {
    var permHt = $('#permissionSection').outerHeight(true) - ($('#userDetails').outerHeight(true) + $('#userDetails').next('header').outerHeight(true));
    $('#userPermissionPane').css({'height':permHt,'overflow-y':'auto'});
};
ice.ui.adjustHt = function(){
        var cHeight = ($("#content-section").height() > parseInt($("#content-section").css("min-height")))? parseInt($("#content-section").css("min-height")) : $("#content-section").height();
        var folderHeight = $("section.column .scrollx",$("#tabbed_box_1")).outerHeight()+(cHeight-$("#manageAccess").outerHeight());
        folderHeight = (folderHeight>428)? folderHeight: 428;
        $("section.splitter-pane").height(folderHeight+$("section.splitter-pane header").outerHeight(true)+"px");
        $("section.column .scroll,.splitter-bar").height(folderHeight+"px");
        $("#userHolder").height(folderHeight-($("#filterusersContent").outerHeight(true))+"px");
        ice.filterUser.adjustUserList();
        ice.ui.permissionPaneHt();
        myvmware.common.adjustFolderNode(true,true);
};
ice.ui.adjustTabBtns = function(){
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
};
function adjustHtForIE7_specific(){
    myvmware.common.adjustFolderNode(true,true);
    ice.filterUser.adjustUserList();
    ice.ui.permissionPaneHt();
    ice.ui.adjustTabBtns();
};
//window.onresize=ice.ui.adjustHt;
window.onresize = function(){
    ice.ui.adjustHt;
    ice.ui.adjustTabBtns();
};

if (typeof myvmware == "undefined") myvmware = {};
myvmware.sdpUser = {
    init: function(){
        ser = myvmware.sdpUser;
        ser.loaded = false;
        ser.onPremiseTenant = false;
    },
    getServices: function () {
        //Send the request to controller to fetch data
        ser.loaded = false;
        vmf.ajax.post(rs.getServicesUrl, {
            'selectedEANumber': ice.eaSelector.getSelectedEANumber(),
            'selectedUserId': $("#selectedFolderUserPane ul li.active").attr("val")
        }, ser.loadServices, ser.error,
        function () {
            $("#serTreeLoading").addClass("hidden")
        }, null, function () {
            $("#serTreeLoading").removeClass("hidden")
        });
    },
    loadServices: function (data) {
        if (typeof data != "object") data = vmf.json.txtToObj(data); //Evaluating the data
        var serviceJson = data.services, //Take funds in a object
            aTree = $("<ul></ul>"), //Store the tree structure in an object before appending to DOM
            chTree = $("<ul style=\"display:none;\"></ul>"); //Store the child tree in this object, before appending to DOM
        if (serviceJson.length > 0) {
            $("#emptyTree").addClass("hidden");
            aTree.append("<li class=\"level1 folderlist\" level=\"1\"><span class=\"pName folderNode disabled serHeader\"><a class=\"openClose\" class=\"pName\"></a> "+ ice.globalVars.allServicesLbl+" </span></li>");
            /*$.each(serviceJson, function (i, item) {
                if (item.sName!=null && item.sId!=null)
                    chTree.append($("<li class=\"level2 folderlist no_child\" level=\"2\"><span sCode='" + item.sId + "' class=\"pName folderNode\"><span class='folderTxt'>" + item.sName + "</span></span></li>").data("perm", item.perm));
            });*/
            $.each(serviceJson, function (i, item) {
                if (item.sName != null && item.sId != null) {
                    if(item.onPremFlag == true){
                        chTree.append($("<li class=\"level2 folderlist no_child\" level=\"2\"><span sCode='" + item.sId + "' class=\"pName horizonService folderNode\"><span class='folderTxt'>" + item.sName + "</span></span></li>").data("perm", item.perm));
                    } else {
                        chTree.append($("<li class=\"level2 folderlist no_child\" level=\"2\"><span sCode='" + item.sId + "' class=\"pName folderNode\"><span class='folderTxt'>" + item.sName + "</span></span></li>").data("perm", item.perm));
                    }
                }
            });
            aTree.append(chTree);
            $("#serviceList").html(aTree);
            $("#selectSerInfoDiv").show();
        } else {
            $("#emptyTree").removeClass("hidden");
        }
        ser.bindServiceEvents();
        ser.loaded = true;
        if(ice.ui.loaded) $(".loadingDiv").hide();
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
                //ser.resetActionItems();
                ice.ui.resetAllFolderOps();
                if($(this).hasClass('horizonService')){
                    ser.onPremiseTenant = true;
                } else {
                    ser.onPremiseTenant = false;
                }
                ser.getPermissionList(this);
            }
        });
        ser.applyContextMenuForService();
        myvmware.common.adjustFolderNode(null,true);
    },
    getPermissionList: function(targetEle){
        var _postData = {
            "selectedServiceId": $("#serviceList li.folderlist span.active").attr("sCode"),
            "selectedEANumber": ice.eaSelector.getSelectedEANumber(),
            "selectedUserId": $("#userDiv li.active").attr("val"),
            "selectedUserOnPerm": ser.onPremiseTenant
        };
        $("#editPermissionLink").addClass("dummyClick").closest("li").addClass("inactive");
        vmf.ajax.post(rs.getPermissionsUrl, _postData, ser.loadPermPane, ser.permFail, function () {
        }, null, function () {
           $('#userPermissionPane').html('<ul class="icons"><li class="initmsg">' + permissionPane_loading_staticText +'</li></ul>');
           $("#requestPermissionLink, #copyPermissionsBtn, #removeUserLink").addClass("dummyClick").closest("li").addClass("inactive");
        });
    },
    resetActionItems: function(){
        $('#ser_folder .dropdown li').addClass('inactive');
        $('#findFolder').parent('li').removeClass('inactive');
        if(ice.ui.createFolderFlg) $('.dropdown').find('a#createFolder').removeClass('dummyClick').parent('li').removeClass('inactive');
    },
    loadPermPane: function (data) {
        if(typeof data!="object") data=vmf.json.txtToObj(data);
        var permArray = ["<table><body>"],
        imgs = [];
        $.each(data.permissions, function (i, v) {

            if(v.isActiveFlag == false){
                rs.lock = 'You cannot edit this permission';
                imgs.push('<img src="/static/myvmware/common/img/cross.png" height="17" width="16" alt="' + rs.cross + '" title="' + rs.cross + '" />');
                imgs.push('<img src="/static/myvmware/common/img/lock.png" height="16" width="14" alt="' + rs.lock + '" title="' + rs.lock + '" />');
                permArray.push("<tr class='inactive' id=" + v.pCode + " status=" + v.perm.isSet + "><td class='col1 level"+v.level+"'>" + v.pName + "</td><td class='col2'>" + imgs.join('') + "</td></tr>");
            }else{
                (v.perm.set) ? imgs.push('<img src="/static/myvmware/common/img/dot.png" height="17" width="17" alt="' + rs.tick + '" title="' + rs.tick + '" />') : imgs.push('<img src="/static/myvmware/common/img/cross.png" height="17" width="16" alt="' + rs.cross + '" title="' + rs.cross + '" />');
                if (!v.perm.edit) imgs.push('<img src="/static/myvmware/common/img/lock.png" height="16" width="14" alt="' + rs.lock + '" title="' + rs.lock + '" />');
                permArray.push("<tr id=" + v.pCode + " status=" + v.perm.isSet + "><td class='col1 level"+v.level+"'>" + v.pName + "</td><td class='col2'>" + imgs.join('') + "</td></tr>");
            }
            imgs = [];
        });
        permArray.push("</tbody></table>");
        $('#userPermissionPane').html(permArray.join(""));
        var _croleCheck,croleCheck = $("#userDiv li.active").attr("crole"), regExpCrole = /[spo]/;
        _croleCheck = regExpCrole.test(croleCheck);
        
        if (data.managePermission && !($('#loggedCustomer').text() == $("#userDiv li.active").attr("id")) && !_croleCheck)
            $("#editPermissionLink").removeClass("dummyClick").closest("li").removeClass("inactive");
        else 
            $("#editPermissionLink").addClass("dummyClick").closest("li").addClass("inactive");
    },
    "editPerm": {
    loadUserPermission: function () {
        var _post = {
            "selectedUserId": $("#userDiv li.active").attr("val"),
            "selectedServiceId": $("#serviceList li.folderlist span.active").attr("sCode"),
            "selectedEANumber": ice.eaSelector.getSelectedEANumber(),
            "selectedUserOnPerm": ser.onPremiseTenant
        }
        vmf.ajax.post(rs.getPermissionsUrl, _post, ser.editPerm.onSuccessGetPermissionList, ice.manageAcess.onFailgetPermissionList);
    },
    onSuccessGetPermissionList: function (data) {
        //ice.manageAcess.permissionPaneEventObject = data;
        var jsonPermissionRes = vmf.json.txtToObj(data), permissionHTML = [];
        if (jsonPermissionRes == null) {
            $('div#loadingEditPermission').hide();
            $('div#showEditPermission').html(ice.globalVars.noPermissionExistMsg).show();
            return false;
        }
        permissionHTML.push('<table id="tbl_edit" class="withborders incHeight"><thead><tr><th class="bdrLt1px">'+ice.globalVars.accessLbl+'</th><th class="bdrRt1px">'+ice.globalVars.allowedLbl+'</th></tr></thead><tbody id="perm_tbody"></tbody></table>');
        $('div#editPermissionDiv').html(permissionHTML.join(''));
        var seluser = $("#userDiv li.active")
        $('#editPermissionData').find('div.name span#userName').text(seluser.attr("fname") + " " + seluser.attr("lname")).end().find('div.email a').text(seluser.attr("email"));
        if ($("#userDiv li.active").attr("crole").length > 0) $('#editPermissionData').find('div.name span.title').text($('#selectedUserRole').text());
        var permissionRow = [];
        $('#selectedFolderUserPane ul').find('li').each(function () {
            var roleIcon = $(this).attr('crole');
        });
        if (jsonPermissionRes.permissions.length > 0) {
            $.each(jsonPermissionRes.permissions, function (i, v) {
                //change the inputStr and lockImg for the horizon service permission
                if(v.isActiveFlag == false){
                    inputStr = '<input type="checkbox" disabled="disabled" id=' + v.pCode + '>';
                    lockImg = '<a href="#" class="dumyLock tooltip" data-tooltip-position="bottom" title="' + editPermssionToolTipMsg + '">'+ice.globalVars.helpTextLbl+'</a>';
                    permissionRow.push("<tr><td class='level"+v.level+" inactive'>" + v.pName + "</td><td class='lock'>" + inputStr + lockImg + "</td></tr>");
                }else{
                    inputStr = (v.perm.set) ? '<input type="checkbox" checked="checked" id=' + v.pCode + '>' : '<input type="checkbox" id=' + v.pCode + '>';
                    lockImg = (!v.perm.edit) ? '<a href="#" class="dumyLock tooltip" data-tooltip-position="bottom" title="' + editPermssionToolTipMsg + '">'+ice.globalVars.helpTextLbl+'</a>' : '';
                    permissionRow.push("<tr><td class='level"+v.level+"'>" + v.pName + "</td><td>" + inputStr + lockImg + "</td></tr>");
                }
            });
        }
        $('table.withborders tbody').html(permissionRow.join(''));
        myvmware.hoverContent.bindEvents($('a.tooltip'), 'defaultfunc');
        $('table.withborders tr td a.dumyLock').each(function () {
            $(this).parent().find(':checkbox').attr('disabled', 'disabled'); //Inherited permission can not be edited so checkbox disabled
        });
        $('div#loadingEditPermission').hide();
        $('div#showEditPermission').show();
        //$('div#editPermissionDiv input[type="checkbox"]').each(function(){
        $('div#editPermissionDiv input[type="checkbox"]').click(function () {
            if ($(this).is(':checked')) {
                $(this).attr('value', 'on');
                if ($(this).attr('id') == "manage-users") {
                    $('#editPermissionDiv #tbl_edit #view-subscriptions, #editPermissionDiv #tbl_edit #manage-subscriptions').attr('checked', true).attr('value', 'on');
                } else if ($(this).attr('id') == "manage-sr" || $(this).attr('id') == "manage-subscriptions") {
                    $('#editPermissionDiv #tbl_edit #view-subscriptions').attr('checked', true).attr('value', 'on');
                }
            } else {
                $(this).attr('value', 'off').removeAttr("checked");
                if ($(this).attr('id') == "view-subscriptions") {
                    var permissionId = $(this).attr('id');
                    if (($('#editPermissionDiv #manage-users').attr('checked')) || $('#editPermissionDiv #manage-sr').attr('checked') || $('#editPermissionDiv #manage-subscriptions').attr('checked')) {
                        $(this).attr('checked', true).attr('value', 'on');
                    }
                } else if ($(this).attr('id') == "manage-subscriptions") {
                    if (($('#editPermissionDiv #manage-users').attr('checked'))) {
                        $(this).attr('checked', true).attr('value', 'on');
                    }
                }
            }
        });
        myvmware.hoverContent.bindEvents($('a.tooltip1'), 'epfunc');
        $('a#kb_link_id').die('click').live('click', function (e) {
            myvmware.common.openHelpPage('http://kb.vmware.com/kb/2035526?plainview=true');
            e.preventDefault();
        })
        $('#editPermissionDiv table#tbl_edit thead th:eq(0)').css('width', '390px');
        $('div.chk_box_container').hide();
    },
    submitEditPermissions: function(){
        var selectedPer=[], unselectedPer=[];
        $.each($("#perm_tbody").find("input:checkbox"),function(i,v){
            if($(this).is(":checked")) selectedPer.push($(v).attr("id"))
            else unselectedPer.push($(v).attr("id"));
        });
        var _post = {"selectedPermissions":selectedPer.join(","),"unselectedPermissions":unselectedPer.join(","),"selectedCustomerId": $("#userDiv li.active").attr("val"),"selectedServiceId": $("#serviceList li.folderlist span.active").attr("sCode")}
        vmf.ajax.post(rs.editPermissionSubmit,_post,function(data){
            if (typeof data!="object") data=vmf.json.txtToObj(data);
            if (data!=null && data.status){
                vmf.modal.hide();
                ser.getPermissionList();
            } 
            else {
            alert(ice.globalVars.unableToProcessMsg); 
            $("#savePermissionId").removeClass("disabled").removeAttr("disabled")}
        },function(){
            $("#savePermissionId").removeClass("disabled").removeAttr("disabled");
            alert(ice.globalVars.unableToProcessMsg)});
    }
    },
    applyContextMenuForService: function () {
        var map = [{
            id: 'add_user',
            text: ice.globalVars.addUserLbl,
            liCls: 'inactive',
            callBk: ser.populateAddUserUI
        },
        {
            id: 'remove_user',
            text: ice.globalVars.removeUserLbl,
            liCls: 'inactive',
            callBk: ice.removeUser.populateRemoveUserPane // dummy function
        }];

        vmf.cmenu.show({
            data: map,
            targetElem: 'serviceList',
            contextMenuFlag: true,
            actionBtnFlg: true,
            funcName: 'cursorPosition',
            cmenuId: 'serviceMenu',
            menuChgState: function (target, cmenuId, disableMnu) {
                var cmenu = $('#' + cmenuId);
                cmenu.find('a').addClass(disableMnu).parent('li').addClass('inactive');
                //Disable add user by default for services - Request by BA
               /* if (ice.ui.loggedInUserPerm) cmenu.find('a#add_user').removeClass(disableMnu).parent('li').removeClass('inactive');
                else cmenu.find('a#add_user').addClass(disableMnu).parent('li').addClass('inactive');*/
            },
            getTargetDetails: function (target) {
                var targetDetailsObj = {
                    serviceId: $(target).closest('span.folderNode').attr("sCode"),
                    serviceName: $(target).closest('span.folderNode').find('.folderTxt').text()
                };
                return targetDetailsObj;
            },
            getTargetNode: function (targetElem) {
                return $('#' + targetElem).find('li.level2>span');
            },
            getTarget: function (target, targetCls, actBtnCls) {
                var tabCont = $('.tabContent');
                tabCont.find('.' + targetCls).removeClass(targetCls).end().find('.' + actBtnCls).hide().removeClass(actBtnCls);
                return $(target).closest('li');
            }
        });
        /*End of context menu CR code*/
        //ser.bindEvents();
    },
    populateAddUserUI: function(){
        vmf.modal.show("addUserMain",{
            "onShow" : function(){
                var offset=$("#addUserMain");
                $('#tabbed_box_1', offset).hide()
                $(".body p", offset).html(rs.addUserMsgForService);
                $(".footer",offset).hide();
            }
        })
    }
 }
