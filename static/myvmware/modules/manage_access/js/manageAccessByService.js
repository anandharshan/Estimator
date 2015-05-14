if (typeof myvmware == "undefined") myvmware = {};
VMFModuleLoader.loadModule("resize", function () {});
myvmware.sdp = {
    init: function () {
        ser = myvmware.sdp;
        ser.onPremiseTenant = false;
        ser.roleMap = {
            "super": "s",
            "proc": "p",
            "admin": "a",
            "manage": "",
            "serviceOwner":"o",
            "designeeServiceOwner":"d"
        };      
        ser.roleDef = {
            "s": rs.pane2.SU,
            "p": rs.pane2.PC,
            "sp": rs.pane2.SUPC,
            "spa": rs.pane2.SUPCA,
            "pa": rs.pane2.PCA,
            "a": rs.pane2.A,
            "o": rs.pane2.O,
            "so": rs.pane2.SUO,
            "po": rs.pane2.PCO,
            "spo": rs.pane2.SUPCO,
            "spao": rs.pane2.SUPCAO,
            "sao": rs.pane2.SUAO,
            "pao": rs.pane2.PCAO,
            "ao": rs.pane2.AO,
            "d":""
        }; //Tooltip text
        ser.roleDisplay = {
            "s": ice.globalVars.superUserLbl,
            "p": ice.globalVars.procurementContactLbl,
            "sp": ice.globalVars.superAndProContactLbl,
            "spa": ice.globalVars.suProCoAdminLbl,
            "pa": ice.globalVars.proContactAdminLbl,
            "a": ice.globalVars.adminstrationLbl,
            "": "",
            "o": ice.globalVars.serviceOwnerLbl,
            "so": ice.globalVars.suServiceOwnerLbl,
            "po": ice.globalVars.proCoServiceOwnerLbl,
            "spo": ice.globalVars.suProCoServiceOwnerLbl,
            "spao": ice.globalVars.suProCoAdminServiceOwnerLbl,
            "sao": ice.globalVars.suAdminServiceOwnerLbl,
            "pao": ice.globalVars.proCoAdminServiceOwnerLbl,
            "ao": ice.globalVars.adminServiceOwnerLbl,
            "d":""

        } //empty string is for no role
        ser.showSplitters();
        //Bind events for remaining tabs
        $("#tab1").unbind('click').bind('click', function () {
            window.location = rs.licenseFolderViewRenderURL
        });
        $('#tab2').unbind('click').bind('click', function () {
            window.location = rs.renderManageAccessByUser
        });
        $('#tab3').unbind('click').bind('click', function () {
            window.location = rs.renderManageAccessByContract
        });
        $('#tab4').unbind('click').bind('click', function () {
            window.location = rs.renderManageAccessMyPermissions
        });
        $('#tab5').unbind('click').bind('click', function () {
            window.location = rs.renderManageAccessMyEPP
        });
        //Load data in Funds pane
        ser.getServices();
        //Send tracking request
        vmf.scEvent = true;
        callBack.addsc({
            'f': 'riaLinkmy',
            'args': ['users-permissions : by-service']
        });
        if(ser.getParameterByName('_VM_inviteUser')!="" && ser.getParameterByName('_VM_inviteUser')=='true'){
            var selectedService = $("#serviceList li.folderlist span.active");
            var targetDetailsObj = {
                serviceId: (selectedService.length) ? selectedService.attr("sCode") : "",
                serviceName: (selectedService.length) ? selectedService.find('.folderTxt').text() : ""
            }
            ser.populateAddUserUI(targetDetailsObj);
        };
        myvmware.common.showMessageComponent('USER_PERMISSION');
        ser.showBeak();
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
    getParameterByName : function(key, URL_string){
        var regexS,regex,URL_string,results;
        key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        regexS = "[\\?&]" + key + "=([^&#]*)";
        regex = new RegExp(regexS);
        URL_string = URL_string || window.location.search;
        results = regex.exec(URL_string);
        if(results == null)
            return "";
        else
            return decodeURIComponent(results[1].replace(/\+/g, " "));
    },
    showSplitters: function () { //Resizing Panes CR Start
        vmf.splitter.show('service_user', {
            resizeToWidth: true,
            outline: true,
            anchorToWindow: true,
            minLeft: parseInt($("#serviceHolder").width() * .8, 10),
            sizeLeft: parseInt($("#serviceHolder").width(), 10),
            maxLeft: parseInt(($("#serviceHolder").width() + ($("#userCol").width() * .2)), 10),
            type: "v",
            barWidth: false,
            accessKey: "R"
        });
        vmf.splitter.show("user_perm", {
            resizeToWidth: true,
            outline: true,
            minRight: parseInt($("#permissionSection").width() * .8, 10),
            maxRight: parseInt($("#permissionSection").width() + $("#userCol").width() * .2, 10),
            sizeRight: parseInt($("#permissionSection").width(), 10),
            type: "v",
            barWidth: false,
            accessKey: "C"
        });
    },
    //Below code is to fetch services
    getServices: function () {
        ser.resetPage(); //Reset the page to default state
        //Send the request to controller to fetch data
        vmf.ajax.post(rs.pane1.getServicesUrl, {
            'selectedEANumber': ice.eaSelector.getSelectedEANumber()
        }, ser.loadServices, ser.error,

        function () {
            $("#serTreeLoading").addClass("hidden")
        }, null, function () {
            $("#serTreeLoading").removeClass("hidden");
            $("#emptyTree").hide();
            $("#removeUserLink, #copyPermissionsBtn, #editPermissionLink").addClass("dummyClick").closest("li").addClass("inactive");
        });
    },
    //Below code is to display services inside DOM
    loadServices: function (data) {
        if (typeof data != "object") data = vmf.json.txtToObj(data); //Evaluating the data
        var serviceJson = data.services, //Take funds in a object
            aTree = $("<ul></ul>"), //Store the tree structure in an object before appending to DOM
            chTree = $("<ul style=\"display:none;\"></ul>");; //Store the child tree in this object, before appending to DOM
        if (serviceJson.length > 0) {
            $("#emptyTree").hide();
            aTree.append("<li class=\"level1 folderlist\" level=\"1\"><span class=\"pName folderNode disabled serHeader\"><a class=\"openClose\" class=\"pName\"></a> "+ice.globalVars.allServicesLbl+" </span></li>");
            /*$.each(serviceJson, function (i, item) {
                if (item.sName != null && item.sId != null) chTree.append($("<li class=\"level2 folderlist no_child\" level=\"2\"><span sCode='" + item.sId + "' class=\"pName folderNode\"><span class='folderTxt'>" + item.sName + "</span></span></li>").data("perm", item.perm));
            });*/
            $.each(serviceJson, function (i, item) {
                if (item.sName != null && item.sId != null) {
                    if(item.onPremFlag == true){
                        chTree.append($("<li class=\"level2 folderlist horizonService no_child\" level=\"2\"><span sCode='" + item.sId + "' class=\"pName folderNode horizonService\"><span class='folderTxt'>" + item.sName + "</span></span></li>").data("perm", item.perm));
                    } else {
                        chTree.append($("<li class=\"level2 folderlist no_child\" level=\"2\"><span sCode='" + item.sId + "' class=\"pName folderNode\"><span class='folderTxt'>" + item.sName + "</span></span></li>").data("perm", item.perm));
                    }
                    
                }
            });
            aTree.append(chTree);
            $("#serviceList").append(aTree);
            $("#selectSerInfoDiv").show();
        } else {
            $("#emptyTree").show();
        }
        ser.bindEvents(); //Bind the events for services
        ser.applyContextMenuForService(); // Apply context menu for services
        myvmware.common.adjustFolderNode(null, true); //This is to adjust the mouse over icon - 2nd param represents service
    },
    //Binding the events for Services and Users
    bindEvents: function () {
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
                $("#serviceList li span").removeClass('active');
                $(this).addClass('active');
                $("#selectSerInfoDiv").hide();
                // if(typeof $(this).closest("li").data("perm") == "undefined")
                //    ser.getServicesPermission(this,ser.getUsersList);
                //else 
                if($(this).hasClass('horizonService')){
                    ser.onPremiseTenant = true;
                } else {
                    ser.onPremiseTenant = false;
                }
                ser.getUsersList(this);
            }
        });
        $("button.fn_cancel").die('click').live('click', function () {
            vmf.modal.hide()
        });
        $('ul.info_list li').live('mouseover mouseout click', function (e) {
            e.preventDefault();
            if (e.type == 'mouseover') {
                $(this).addClass('hover');
            } else if (e.type == 'mouseout') {
                $(this).removeClass('hover');
            } else {
                if ($(this).hasClass('active')) return;
                $(this).parents('ul.info_list').find('li').removeClass('active').find('label');
                $(this).addClass('active');
                $("#copyPermissionsBtn,#addusers,#removeUserLink").addClass("dummyClick").closest("li").addClass("inactive");
                ser.populateUserDetails($(this));
                ser.populatePermissions();
            }
        });
        $('#btn_next').live('click', function () {
            ice.inviteUser.customStyle('addUsersToFoldersContent3');
            if (!$("#addUsersToFoldersContent3 #serviceList ul li").length) {
                ser.addUser.getServices();
                ice.inviteUser.populateFoldersUI();
            } else {
                $('#addUserMain #addusersContent').hide();
                $('#addUserMain').parents('#simplemodal-container').css({
                    "width": "620px",
                    "left": "322px"
                });
                $('#addUserMain #addUsersToFoldersContent3').show();
            }
        });

        $('#addusers').click(function () {
            var selectedService = $("#serviceList li.folderlist span.active");
            var targetDetailsObj = {
                serviceId: (selectedService.length) ? selectedService.attr("sCode") : "",
                serviceName: (selectedService.length) ? selectedService.find('.folderTxt').text() : ""
            }
            if (!$(this).hasClass('dummyClick')) {
                ser.populateAddUserUI(targetDetailsObj);
            }
        });

        $('#copyPermissionsBtn').click(function () {
            var targetDetailsObj = {
                userId: $("#userDiv li.active").attr("id"),
                serviceId: $("#serviceList li.folderlist span.active")
            };
            //if(($('#folderId').val().length > 0) && (IsLoggedInUserFM) && ($("#selectedUserId").val().length > 0)) {
            if (!$('#copyPermissionsBtn').hasClass('dummyClick')) {
                ser.populateCopyPermissionsUI(targetDetailsObj);
            }
            //}
            return false;
        });

        $('#removeUserLink').click(function () {
            if (!$(this).hasClass('dummyClick')) {
                var serObj = {
                    "user": $("#userDiv li.active"),
                    "serviceId": $("#serviceList li span.active").attr("sCode"),
                    "serviceName": $("#serviceList li span.active .folderTxt").html()
                }
                ser.removeUser.populateRemoveUserPane(serObj);
                riaLinkmy('users-permissions : by-service : remove-user');
            }
        });
        $('#exportAllToCsvButton').click(function() {
            var _fPerPostData = new Object();
            _fPerPostData['selectedFolders'] = 'ALL';
            _fPerPostData['reportFor'] = 'byServicesFromExportAllButton';
            myvmware.common.generateCSVreports($exportToCsvActionUrl, _fPerPostData, "users-permissions : by-services : export-all", "users-permissions : by-services : Export-to-CSV : Error");
        });
    },
    //Below object holds all the functions for remove user
    "removeUser": {
        populateRemoveUserPane: function (obj) {
            //Display the modal window
            var _post = {
                "selectedUserCn": obj.user.attr("id"),
                "selectedServiceId": obj.serviceId,
                "selectedUserName": obj.user.data("data").fName + " " + obj.user.data("data").lName
            };
                        
            var classList =obj.user.attr('role'),regExp = /[d]/,
                isDesigneeSO = regExp.test(classList);
            
            if(isDesigneeSO)
            {
                vmf.modal.show("designeeServiceOwnerError");
            }
            else{
                vmf.modal.show('removeUserContent8', {
                    "onShow": function () {
                        $("#removeUserContent8 #serviceName").html(obj.serviceName);
                        $("#removeUserContent8 #userName").html(obj.user.data("data").fName + " " + obj.user.data("data").lName);
                        $("#removeUserContent8 #removeUserFromService").unbind("click").bind("click", function () {
                            $(this).attr("disabled", "disabled");
                            $('#removeUserContent8 .errorMsg').hide();
                            vmf.ajax.post(rs.removeUserConfirmUrl, _post, ser.removeUser.removeUserSuccess, ser.removeUser.removeUserError, function () {
                                vmf.loading.hide()
                            }, null, function () {
                                vmf.loading.show()
                            });
                        })
                    }
                });
            }
        },
        removeUserSuccess: function (data) {
            if (typeof data != "object") data = vmf.json.txtToObj(data);
            if (!data.status) {
                var msg = data.message || ice.globalVars.unableToProcessMsg;
                $('#removeUserContent8 .errorMsg').html(msg).show();
                $("#removeUserContent8 #removeUserFromService").removeAttr("disabled")
            } else { vmf.modal.hide(); location.reload();
            }
        },
        removeUserError: function (data) {
            $('#removeUserContent8 .errorMsg').html(ice.globalVars.unableToProcessMsg).show();
            $("#removeUserContent8 #removeUserFromService").removeAttr("disabled");
        }
    },
    "editPerm": {
        //Get Permissions pane contents in Edit Permissions modal window
        loadUserPermission: function () {
            _post = {
                "selectedUserId": $("#userDiv li.active").attr("id"),
                "selectedServiceId": $("#serviceList li.folderlist span.active").attr("sCode"),
                "selectedEANumber": ice.eaSelector.getSelectedEANumber(),
                "selectedUserOnPerm": ser.onPremiseTenant
            }
            vmf.ajax.post(rs.pane3.getPermissionsUrl, _post, ser.editPerm.onSuccessGetPermissionList, ice.manageAcess.onFailgetPermissionList);
        },
        //Load Permission pane with 
        onSuccessGetPermissionList: function (data) {
            var jsonPermissionRes = vmf.json.txtToObj(data),
                permissionHTML = [];
            if (jsonPermissionRes == null) {
                $('div#loadingEditPermission').hide();
                $('div#showEditPermission').html(ice.globalVars.noPermissionExistMsg).show();
                return false;
            }
            permissionHTML.push('<table id="tbl_edit" class="withborders incHeight"><thead><tr><th class="bdrLt1px">'+ice.globalVars.accessLbl+'</th><th class="bdrRt1px">'+ice.globalVars.allowedLbl+'</th></tr></thead><tbody id="perm_tbody"></tbody></table>');
            if(ice.inviteUser.checkselPerm){
            $('div#editPermissionDiv').html(permissionHTML.join(''));
            var seluser = $("#userDiv li.active").data("data");
            $('#editPermissionData').find('div.name span#userName').text(seluser.fName + " " + seluser.lName).end().find('div.email a').text(seluser.email);
            if ($("#userDiv li.active").attr("role").length > 0) $('#editPermissionData').find('div.name span.title').text(ser.roleDisplay[$("#userDiv li.active").attr("role")]);
            ice.inviteUser.checkselPerm = true;
            }else{
                $('div#inviteEditPermissionDiv').html(permissionHTML.join(''));
                ice.inviteUser.permissionList = jsonPermissionRes;
            }
            var permissionRow = [];

            if (jsonPermissionRes.permissions.length > 0) {
                $.each(jsonPermissionRes.permissions, function (i, v) {
                    if(v.isActiveFlag == false){
                        inputStr = '<input type="checkbox" disabled="disabled" id=' + v.pCode + '>';
                        
                        lockImg = '<a href="#" class="dumyLock tooltip" data-tooltip-position="bottom" title="' + ice.globalVars.managesrtolltip + '">'+ice.globalVars.helpTextLbl+'</a>';

                        permissionRow.push("<tr><td class='level"+v.level+" inactive'>" + v.pName + "</td><td class='lock'>" + inputStr + lockImg + "</td></tr>");
                    }else{
                        inputStr = (v.perm.set) ? '<input type="checkbox" checked="checked" id=' + v.pCode + '>' : '<input type="checkbox" id=' + v.pCode + '>';
                        
                        lockImg = (!v.perm.edit) ? '<a href="#" class="dumyLock tooltip" data-tooltip-position="bottom" title="' + ice.globalVars.managesrtolltip + '">'+ice.globalVars.helpTextLbl+'</a>' : '';
                        
                        permissionRow.push("<tr><td class='level"+v.level+"'>" + v.pName + "</td><td>" + inputStr + lockImg + "</td></tr>");
                    }
                });
            }
            $('table.withborders tbody').html(permissionRow.join(''));
            myvmware.hoverContent.bindEvents($('a.tooltip'), 'defaultfunc');

            $.each($("#editPermissionDiv table input:checkbox:checked"), function (i, v) {
                if ($(v).attr('id') == "manage-users") $('#editPermissionDiv #tbl_edit #view-subscriptions, #editPermissionDiv #tbl_edit #manage-subscriptions').attr('checked', true).attr('value', 'on');
            });
            $('table.withborders tr td a.dumyLock').each(function () {
                if($(this).parent().find(':checkbox').not(':disabled'))
                    $(this).parent().find(':checkbox').attr('disabled', 'disabled'); //Inherited permission can not be edited so checkbox disabled
            });
            $('div#loadingEditPermission').hide();
            $('div#inviteLoadingEditPermission').hide();
            $('div#inviteEditPermissionData p.description, div#inviteEditPermissionData div.bottomarea').show();            
            $('div#showEditPermission').show();
            //Lot of dependency in unselecting checkbox - below code is for that
            var finaldiv = "#editPermissionDiv";
            if(!ice.inviteUser.checkselPerm){
                finaldiv = "#inviteEditPermissionDiv";
                ice.inviteUser.checkselPerm = true;
            }
            $('div'+finaldiv+' input[type="checkbox"]').click(function () {
                if ($(this).is(':checked')) {
                    $(this).attr('value', 'on');
                    if ($(this).attr('id') == "manage-users") {
                        $(''+finaldiv+' #tbl_edit #view-subscriptions, '+finaldiv+' #tbl_edit #manage-subscriptions').attr('checked', true).attr('value', 'on');
                    } else if ($(this).attr('id') == "manage-sr" || $(this).attr('id') == "manage-subscriptions") {
                        $(''+finaldiv+' #tbl_edit #view-subscriptions').attr('checked', true).attr('value', 'on');
                    }
                } else {
                    $(this).attr('value', 'off').removeAttr("checked");
                    if ($(this).attr('id') == "view-subscriptions") {
                        var permissionId = $(this).attr('id');
                        if (($(''+finaldiv+' #manage-users').attr('checked')) || $(''+finaldiv+' #manage-sr').attr('checked') || $(''+finaldiv+' #manage-subscriptions').attr('checked')) {
                            $(this).attr('checked', true).attr('value', 'on');
                        }
                    } else if ($(this).attr('id') == "manage-subscriptions") {
                        if (($(''+finaldiv+' #manage-users').attr('checked'))) {
                            $(this).attr('checked', true).attr('value', 'on');
                        }
                    }
                }
            });
            myvmware.hoverContent.bindEvents($('a.tooltip1'), 'epfunc');
            $('a#kb_link_id').die('click').live('click', function (e) {
                myvmware.common.openHelpPage('http://kb.vmware.com/kb/2035526?plainview=true');
                e.preventDefault();
            });
            $(''+finaldiv+' table#tbl_edit thead th:eq(0)').css('width', '390px');
            $('div.chk_box_container').hide();
        },
        //Submit Changed Permissions in Edit Permissions window
        submitEditPermissions: function () {
            var selectedPer = [],
                unselectedPer = [];
            $.each($("#perm_tbody").find("input:checkbox"), function (i, v) {
                if ($(this).is(":checked")) selectedPer.push($(v).attr("id"))
                else unselectedPer.push($(v).attr("id"));
            });
            var _post = {
                "selectedPermissions": selectedPer.join(","),
                "unselectedPermissions": unselectedPer.join(","),
                "selectedCustomerId": $("#userDiv li.active").attr("id"),
                "selectedServiceId": $("#serviceList li.folderlist span.active").attr("sCode")
            }
            vmf.ajax.post(rs.editPermissionSubmit, _post, function (data) {
                if (typeof data != "object") data = vmf.json.txtToObj(data);
                if (data != null && data.status) {
                    vmf.modal.hide();
                    ser.populatePermissions();
                } else {
                    alert(ice.globalVars.unableToProcessMsg);
                    $("#savePermissionId").removeClass("disabled").removeAttr("disabled")
                }
            }, function () {
                $("#savePermissionId").removeClass("disabled").removeAttr("disabled");
                alert(ice.globalVars.unableToProcessMsg)
            });
        }
    },
    //Get Users for selected service
    getUsersList: function (targetEle) {
        var _target = targetEle;
        var _postData = {
            "serviceID": $(targetEle).attr("sCode"),
            "selectedEANumber": ice.eaSelector.getSelectedEANumber()
        };
        vmf.ajax.post(rs.pane2.getUsersUrl, _postData, ser.loadUsers, ser.userListFail, function () {
            $("#userTreeLoading").addClass("hidden");
            $("#userSelectionInfoDiv").removeClass("hidden");
            if ($(_target).closest('li').data('perm').manage) $('a#addusers').removeClass("dummyClick").parent('li').removeClass('inactive');
                else $('a#addusers').addClass("dummyClick").parent('li').addClass('inactive');
        }, null, function () {
            $("#userTreeLoading").removeClass("hidden");
            $("#selectSerInfoDiv, #userDiv, #userDetails #user, #userPermissionPane").hide();
            ser.resetDropdownItems();
        });
    },
    //Display fetched Users
    loadUsers: function (data) {
        if (typeof data != "object") data = vmf.json.txtToObj(data);
        var userArr = $("<ul class=\"icons info_list\"></ul>"),
            labelArr = [],
            role = [],
            _labelArr,_userRole, badge;
        data = vmf.getObjByIdx(data, 0);
        if (data.length) {          
            $.each(data, function (index, val) {
                for (var k in val.perm) {
                    if (val.perm[k]) {
                        role.push(ser.roleMap[k]);
                        labelArr.push('<span class="'+ser.roleMap[k]+'Label"></span>');
                    }
                }
                _labelArr = labelArr.join("");
                _userRole = role.join("");
                labelArr = [];
                role = [];
                badge = ($.trim(_userRole).length) ? "<a alt='" + ser.roleDef[_userRole] + "' title='" + ser.roleDef[_userRole] + "' class=\"hreftitle\" href='#'>" + ser.roleDef[_userRole] + "</a>" : "";
                userArr.append($("<li class='" + _userRole + "' id='" + val.cN + "' role='" + _userRole + "'><label class=\"userLabel\">" +_labelArr+ badge + val.fName + " " + val.lName + "</label></li>").data("data", val));
            });
        } else {
            userArr.append("<li><label>" + rs.pane2.noUsersMsg + "</label></li>");
        }
        $("#userDiv").html(userArr).show();
        ser.applyContextMenuForUser();
    },
    //Populate the header section in permissions pane
    populateUserDetails: function (user) {
        var sInfo = user.data("data"),
            role = user.attr("role"); 
        if(ser.roleDisplay[role] === undefined || ser.roleDisplay[role]== null){            
            $("#user").find("label").html(sInfo.fName + " " + sInfo.lName).end().find(".title").html('').end().find(".email").html("<a href=\"mailto:" + sInfo.email + "\">" + sInfo.email + "</a>").end().show();
        }
        else{
            $("#user").find("label").html(sInfo.fName + " " + sInfo.lName).end().find(".title").html(ser.roleDisplay[role]).end().find(".email").html("<a href=\"mailto:" + sInfo.email + "\">" + sInfo.email + "</a>").end().show();
        } 
         $("#userDetails.details").show();  
        
    },
    populatePermissions: function () {
        var _post = {
            "selectedUserId": $("#userDiv li.active").attr("id"),
            "selectedServiceId": $("#serviceList li.folderlist span.active").attr("sCode"),
            "selectedEANumber": ice.eaSelector.getSelectedEANumber(),
            "selectedUserOnPerm": ser.onPremiseTenant
        };
        $("#editPermissionLink").addClass("dummyClick").closest("li").addClass("inactive")
        vmf.ajax.post(rs.pane3.getPermissionsUrl, _post, ser.loadPermisions, ser.onFailPermissions,

        function () {
            $("#permTreeLoading, #userSelectionInfoDiv").addClass("hidden");
            $("#userDetails #user,#userPermissionPane").show();
        }, null, function () {
            $("#permTreeLoading").removeClass("hidden");
            $("#userDetails #user,#userPermissionPane").hide();
            $("#userSelectionInfoDiv ,initmsg").hide()
        });
    },
    loadPermisions: function (res) {
        var permArray = [],
            imgs = [];
        if (typeof res != "object") res = vmf.json.txtToObj(res);
        //res = vmf.getObjByIdx(res, 0);
        if (typeof (res) == 'undefined' || !res) {
            $('a#removeUserLink').addClass("dummyClick").parent('li').addClass('inactive');
        } else {
            $.each(res.permissions, function (i, v) {
                
                if(v.isActiveFlag == false){
                    imgs.push('<img src="/static/myvmware/common/img/cross.png" height="17" width="16" alt="' + rs.pane3.cross + '" title="' + rs.pane3.cross + '" />');

                    imgs.push('<img src="/static/myvmware/common/img/lock.png" height="16" width="14" alt="' + ice.globalVars.managesrtolltip + '" title="' + ice.globalVars.managesrtolltip + '" />');

                    permArray.push("<tr id=" + v.pCode + " status=" + v.perm.isSet + " class='inactive' ><td class='col1 level"+v.level+"'>" + v.pName + "</td><td class='col2'>" + imgs.join('') + "</td></tr>");
                }else{
                    (v.perm.set) ? imgs.push('<img src="/static/myvmware/common/img/dot.png" height="17" width="17" alt="' + rs.pane3.tick + '" title="' + rs.pane3.tick + '" />') : imgs.push('<img src="/static/myvmware/common/img/cross.png" height="17" width="16" alt="' + rs.pane3.cross + '" title="' + rs.pane3.cross + '" />');

                    if (!v.perm.edit) imgs.push('<img src="/static/myvmware/common/img/lock.png" height="16" width="14" alt="' + ice.globalVars.managesrtolltip + '" title="' + ice.globalVars.managesrtolltip + '" />');

                    permArray.push("<tr id=" + v.pCode + " status=" + v.perm.isSet + "><td class='col1 level"+v.level+"'>" + v.pName + "</td><td class='col2'>" + imgs.join('') + "</td></tr>");
                }
                imgs = [];
            });

            var _isSet = res.permissions[3].perm.set,
                _managePerm = res.managePermission,
                _permissionLen = res.permissions.length;
            
            $("#userDiv li.active").data({
                manage: _managePerm,
                permLen: _permissionLen
            });

            $("#userPermissionPane table").html(permArray.join(""));
            var userTypes, regExpression = /[spo]/;
            userTypes = regExpression.test($("#userDiv li.active").attr("role"))

            if (res.managePermission && !($('#loggedCustomer').text() == $("#userDiv li.active").attr("id")) && !userTypes) $("#editPermissionLink").removeClass("dummyClick").closest("li").removeClass("inactive")
            else $("#editPermissionLink").addClass("dummyClick").closest("li").addClass("inactive");
            ser.changePermissions();
        }    
        
    },
    changePermissions: function () {
        var selectedUser = $("#userDiv li.active");
        var _suorpu = selectedUser.is('.s, .p, .sp'),
            permDetails = selectedUser.data(),
            //_isSet = permDetails.isSet,
            //_permLen = permDetails.permLen;
           _manage = permDetails.manage;
        /*Remove User change state*/
        if (!_suorpu && !($('#loggedCustomer').text() == $("#userDiv li.active").attr("id")) && _manage) {
            $('a#removeUserLink').removeClass('dummyClick').parent('li').removeClass('inactive');
        } else {
            $('a#removeUserLink').addClass('dummyClick').parent('li').addClass('inactive');
        }
        /*Copy permissions change state*/
        if (_manage) {
            $('a#copyPermissionsBtn,a#addusers').removeClass('dummyClick').parent('li').removeClass('inactive');
        } else {
            $('a#copyPermissionsBtn,a#addusers').addClass('dummyClick').parent('li').addClass('inactive');
        }
    },
    onFailPermissions: function () {},
    error: function () {
        vmf.modal.show("errorModal")
    },
    /*getSelectedEA: function () {
        return $("#eaSelectorDropDown option:selected").val();
    },*/
    resetPage: function () {
        $("#serviceList ul, #userDiv ul li").remove();
        //$("#selectSerInfoDiv").show();
        $("#owner, #user, #userPermissionPane, #userDetails").hide();
    },
    applyContextMenuForUser: function () {
        var map = [{
            id: 'remove_user',
            text: ice.globalVars.removeUserLbl,
            liCls: 'inactive',
            callBk: ser.removeUser.populateRemoveUserPane
        }, {
            id: 'cpy_perm',
            text: ice.globalVars.copyPermissionsLbl,
            liCls: 'inactive',
            callBk: ser.populateCopyPermissionsUI
        }];

        vmf.cmenu.show({
            data: map,
            targetElem: 'userDiv',
            contextMenuFlag: true,
            actionBtnFlg: true,
            funcName: 'cursorPosition',
            cmenuId: 'userMenu',
            menuChgState: function (target, cmenuId, disableMnu) {
                var cmenu = $('#' + cmenuId);
                cmenu.find('a').addClass(disableMnu).parent('li').addClass('inactive');
                if (!$(target).closest('li').data('permLen')) {
                    ser.checkUserPerm(target);
                }
                if ($(target).closest('li').data('permLen')) {
                    ser.setUserMenuState(target, cmenu, disableMnu);
                }
            },
            getTargetDetails: function (target) {
                var targetDetailsObj = {
                    "userId": $(target).closest('li').attr('id'),
                    "user": $(target).closest('li'),
                    "serviceId": $("#serviceList li span.active").attr("sCode"),
                    "serviceName": $("#serviceList li span.active .folderTxt").html()
                };
                return targetDetailsObj;
            },
            getTargetNode: function (targetElem) {
                return $('#' + targetElem).find('li');
            },
            getTarget: function (target, targetCls, actBtnCls) {
                var tabCont = $('.tabContent');
                tabCont.find('.' + targetCls).removeClass(targetCls).end().find('.' + actBtnCls).hide().removeClass(actBtnCls);
                return $(target).closest('li');
            }
        });
        /*End of context menu CR code*/
        ice.filterUser.adjustUserList(); //Align Mouse over icon
    },
    applyContextMenuForService: function () {
        var map = [{
            id: 'add_user',
            text: ice.globalVars.inviteNewUserLbl,
            liCls: 'inactive',
            callBk: ser.populateAddUserUI
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
                if ($(target).closest('li').data('perm').manage) cmenu.find('a#add_user').removeClass(disableMnu).parent('li').removeClass('inactive');
                else cmenu.find('a#add_user').addClass(disableMnu).parent('li').addClass('inactive');
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
    },
    selSerPerm:function(){
        ice.inviteUser.checkselPerm = false;
        $('#addUserMain #addUsersToFoldersContent5').show();
        //$('div#inviteLoadingEditPermission').hide();
        $('div#showInviteEditPermission').show();
        $('div#inviteEditPermissionData .details').hide();
        /*__post1 = {
            "selectedUserId": $("#userDiv li.active").attr("id"),
            "selectedServiceId": $("#serviceList li.folderlist span.active").attr("sCode"),
            'selectedEANumber1': ice.eaSelector.getSelectedEANumber()
        }; */     
        /*_post = {
            'selectedServiceId':"",
            'selectedUserId': "",
            'selectedEANumber': ice.eaSelector.getSelectedEANumber()
        };*/

        var requestParams, selectedUsersServiceIds = [],
                arrayOfSelectedUsers = [];
        var $services = $("#serviceList ul.sublist", $("#addUsersToFoldersContent3")),
            serObj = {}, serArr = [];
        $.each($services.find("input:checkbox:checked"), function () {
            selectedUsersServiceIds.push($(this).closest("span").attr("sCode"));
        });
        selectedPermStr=ice.inviteUser.selectedPermissions;
        totselectedUsersServiceIds = selectedUsersServiceIds.join(",");

        _post = {
            'selectedEANumber': ice.eaSelector.getSelectedEANumber(),
            'selectedServiceId': totselectedUsersServiceIds
        }
        //requestParams = 'totselectedUsersServiceIds='+totselectedUsersServiceIds+'&SelectedPermissions='+selectedPermStr;


        //vmf.ajax.post(rs.pane3.getPermissionsUrl, _post, ice.inviteUser.showSuccessPermissions, ice.inviteUser.failurePermissions);
        vmf.ajax.post(rs.loadRolesUrl, _post, ser.editPerm.onSuccessGetPermissionList, ice.inviteUser.failurePermissions);
        if(!ice.inviteUser.checkselPerm){
            $('div#inviteLoadingEditPermission').show();
            $('div#inviteEditPermissionData p.description, div#inviteEditPermissionData div.bottomarea').hide();
        }
    },
    checkUserPerm: function (target) {
        var userId = $(target).closest('li').attr('id'),
            _post = {
                'selectedServiceId': $("#serviceList li.folderlist span.active").attr("sCode"),
                'selectedUserId': userId,
                'selectedEANumber': ice.eaSelector.getSelectedEANumber()
            };
        vmf.ajax.post(rs.pane3.getPermissionsUrl, _post, ser.onSuccess_getUserPerm(target), ser.onFail_userPerm, null, null, null, false);
    },
    setUserMenuState: function (target, cmenu, disableMnu) {
         //_suorpu = $(target).closest('li').is('.s, .p, .sp, .o'),
          var _suorpu,targetClass = $(target).closest('li').attr('role'),
            regEx = /[spo]/,
            permDetails = $(target).closest('li').data();
            var _manage = permDetails.manage;
            //_permLen = permDetails.permLen;
        //_manage = $("#serviceList li.folderlist span.active").closest("li").data("perm").manage;
        /*Remove User change state*/

        _suorpu =  regEx.test(targetClass);

        if (!_suorpu && _manage && !($('#loggedCustomer').text() == $(target).closest("li").attr("id"))) {
            cmenu.find('a#remove_user').removeClass(disableMnu).parent('li').removeClass('inactive');
        } else {
            cmenu.find('a#remove_user').addClass(disableMnu).parent('li').addClass('inactive');
        }
        /*Copy permissions change state*/
        if (_manage) {
            cmenu.find('a#cpy_perm').removeClass(disableMnu).parent('li').removeClass('inactive');
        } else {
            cmenu.find('a#cpy_perm').addClass(disableMnu).parent('li').addClass('inactive');
        }
    },
    onSuccess_getUserPerm: function (target) {
        return function (data) {
            var jsonResponse = (typeof data != "object") ? vmf.json.txtToObj(data) : data;
            var managePerm = jsonResponse.managePermission,
                _permissionLen = jsonResponse.permissions.length;
            if (typeof (jsonResponse) == 'undefined' || !jsonResponse) cmenu.find('a#remove_user').addClass(disableMnu).parent('li').addClass('inactive');
            else {
                $(target).closest('li').data({
                    manage: managePerm,
                    permLen: _permissionLen
                });
            }
        }
    },
    onFail_userPerm: function () {
        //error
    },
    populateCopyPermissionsUI: function (targetDetailsObj) {
        window.location.href = rs.renderCopyPermission + '&selectedUserId=' + targetDetailsObj.userId + '&byService=true';
    },
    populateAddUserUI: function (targetDetailsObj) {
        $('#addusersContent #headerForAFolder').html('<h1>' + $msgFolderToAdd + '<span id="folder_name"></span></h1>');
        $('#addUsersToFoldersContent6').find('#selectedAddUsersList, #selectedInviteUsersList, #inviteUserSelectedFolders').html(''); // clearing the user Details in the 3rd popup of invite user 
        ice.inviteUser.addUserStep1Flag = 'invite';
        vmf.modal.show('addUserMain',{"onShow":function(){$("#addusersContent .body>p").html(rs.adduser.step1Desc);$('#addusersContent #btn_invite').hide();}});
        ser.renderAddUser(targetDetailsObj);
        if (typeof riaLinkmy!= "undefined") riaLinkmy('users-permissions : by-service : add-user');
        return false;
    },
    renderAddUser: function (targetDetailsObj) {
        var addUserUrl = $manageAccessAddUserUrl
        var _postData = {
            "selectedServiceId": targetDetailsObj.serviceId,
            "selectedServiceName": targetDetailsObj.serviceName
        }
        vmf.ajax.post(addUserUrl, _postData, ser.get_success, ser.get_failure);
    },
    get_success: function (event) {
        var user_list = "",
            list_item = "";
        $('#addusersContent #content_8 .loading').hide();
        $('#addusersContent #accountUserPane').show();
        $('#eaNumber').html('');
        $.userjsonresponse_1 = vmf.json.txtToObj(event);
        user_list = ($.userjsonresponse_1) ? $.userjsonresponse_1.userList : "";
        $('#populate_list .possibleUsersList').html('');
        $('#eaNumber').html(($.userjsonresponse_1) ? $.userjsonresponse_1.eaNumber : " ");
        for (var i = 0; i < user_list.length; i++) {
            $('#populate_list .possibleUsersList').append('<li class="fn_userID_' + (i + 1) + '">' + '<input id="checkbox' + (i + 1) + '" name="checkbox" value=' + user_list[i].customerNumber + ' type="checkbox"/>' + '<label for="checkbox' + (i + 1) + '">' + user_list[i].firstName + ' ' + user_list[i].lastName + '</label>' + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="email indent15">' + user_list[i].email + '</span></li>');
        };

        $('.possibleUsersList li input').click(function () {
            $('#btn_next').removeAttr("disabled").removeClass('disabled').addClass('button');
            var $this = $(this),
                inputName,
                inputEmail,
                liClass = $this.parent().attr('class'); //find class name;
            //If checked, create users data
            if ($this.is(':checked')) {
                inputName = $this.parent().find('label').html(); //find name
                inputEmail = $this.parent().find('span').html(); //find email
                //insert new element into the right side (find the UL & .append(object);
                $this.parent('li').hide();
                var prevClass = "";
                var flag = true;
                $('ul.removeUsersList').find('li').each(function () {
                    var liClassSplit = liClass.split("fn_userID_");
                    var prevClassSplit = $(this).attr('class').split("fn_userID_");
                    var curClass = $(this).attr('class');
                    var curId = parseInt(liClassSplit[1]);
                    var prevId = parseInt(prevClassSplit[1]);
                    if (curId < prevId && flag) {

                        if (prevClass == "") {
                            $('<li class="' + liClass + '"> <a class="remove" href="#">'+ice.globalVars.removeLbl+'</a><span class="name">' + inputName + '</span> <span class="email emailremove">' + inputEmail + '</span> </li>').insertBefore($('ul.removeUsersList li.' + curClass));
                            $('#addUserMain #validatedUsers').append('<li class="' + liClass + '"> <a class="remove" href="#">'+ice.globalVars.removeLbl+'</a><span class="name">' + inputName + '</span> <span class="email emailremove">' + inputEmail + '</span> </li>');
                            $('#addUsersToFoldersContent6 #selectedAddUsersList').append('<tr class=' + liClass + '><td>' + inputName + '</td><td class="label">' + inputEmail + '</td></tr>'); // invite user's 3rd popup for adding account user
                        } else {
                            $('<li class="' + liClass + '"> <a class="remove" href="#">'+ice.globalVars.removeLbl+'</a><span class="name">' + inputName + '</span> <span class="email emailremove">' + inputEmail + '</span> </li>').insertAfter($('ul.removeUsersList li.' + prevClass));
                            $('#addUserMain #validatedUsers').append('<li class="' + liClass + '"> <a class="remove" href="#">'+ice.globalVars.removeLbl+'</a><span class="name">' + inputName + '</span> <span class="email emailremove">' + inputEmail + '</span> </li>');
                            $('#addUsersToFoldersContent6 #selectedAddUsersList').append('<tr class=' + liClass + '><td>' + inputName + '</td><td class="label">' + inputEmail + '</td></tr>'); // invite user's 3rd popup for adding account user
                        }
                        flag = false;

                    }
                    prevClass = $(this).attr('class');
                });
                if (flag) {
                    $('ul.removeUsersList').append('<li class="' + liClass + '"> <a class="remove" href="#">'+ice.globalVars.removeLbl+'</a><span class="name">' + inputName + '</span> <span class="email emailremove">' + inputEmail + '</span> </li>');
                    $('#addUserMain #validatedUsers').append('<li class="' + liClass + '"> <a class="remove" href="#">'+ice.globalVars.removeLbl+'</a><span class="name">' + inputName + '</span> <span class="email emailremove">' + inputEmail + '</span> </li>');
                    $('#addUsersToFoldersContent6 #selectedAddUsersList').append('<tr class=' + liClass + '><td>' + inputName + '</td><td class="label">' + inputEmail + '</td></tr>'); // invite user's 3rd popup for adding account user                          
                }
                var getCount = $('ul.removeUsersList li').size();
                ice.inviteUser.selectedUsers(); // total selected users
                ice.inviteUser.sortingAscLi();
                if (getCount != 0) {
                    $('span.numberSelected').html(getCount);
                } else {
                    $('span.numberSelected').html('0');
                }
                $('ul.removeUsersList .remove').click(function () {
                    var $this = $(this),
                        liClass;
                    liClass = $this.parent().attr('class'); //Get the class from the li
                    $this.parent().remove();
                    //invite user
                    $('#addUsersToFoldersContent6 #selectedAddUsersList .' + liClass).remove();
                    $('#addUserMain #validatedUsers .' + liClass).remove();
                    ice.inviteUser.selectedUsers(); // total selected users
                    // end for invite user
                    $('ul.possibleUsersList .' + liClass).show();
                    $('ul.possibleUsersList .' + liClass).find('input').attr('checked', false);
                    var getCount_new = $('ul.removeUsersList li').size();
                    if (getCount_new != 0) {
                        $('span.numberSelected').html(getCount_new);
                    } else {
                        $('span.numberSelected').html('0');
                        $('#btn_next').attr("disabled", "disabled").removeClass('button').addClass('disabled');
                    }
                    return false;


                });
            } else {
                $('#custNumber').val('');
                //Look to the right side for the class name and .remove();
                $('ul.removeUsersList .' + liClass).remove();
                var getCount_new = $('ul.removeUsersList li').size();
                if (getCount_new != 0) {
                    $('span.numberSelected').html(getCount_new);
                } else {
                    $('span.numberSelected').html('0');
                }
            }
            //_updateSelectedUsers();
        });
    },

    get_failure: function (statusError, msgtext) {
        vmf.modal.hide();
        if (msgtext == "parsererror") {
            vmf.modal.show("parsererror");
        } else {
            vmf.modal.show("systemexception");
        }
    },

    confirmUser: function () {
        $('#fldr_name').html('');
        $('#row').html('');
        var displayUserDetails = '<table><tbody>';
        var displayname = '';
        var displayemail = '';
        var arrayOfSelectedUsers = new Array();
        $(".possibleUsersList input:checkbox[name=checkbox]:checked").each(function () {
            arrayOfSelectedUsers.push($(this).val());
        });
        if (arrayOfSelectedUsers.length > 0) {
            $('#custNumber').val(arrayOfSelectedUsers);

        }
        //var totChecked = arrayOfSelectedUsers.length; 
        $(".possibleUsersList input:checkbox[name=checkbox]:checked").each(function () {
            var getParent = $(this).parent('li');
            displayUserDetails += '<tr>';
            displayUserDetails += '<td>';
            displayUserDetails += $(getParent).children('label').text();
            displayUserDetails += '</td>';
            displayUserDetails += '<td>';
            displayUserDetails += $(getParent).children('span').text();
            displayUserDetails += '</td>';
            displayUserDetails += '</tr>';
        });
        displayUserDetails += '</tbody></table>';
        $('#row').append(displayUserDetails);
        $('#fldr_name').append('<img src="/static/myvmware/common/css/img/folder_gray.png" height="10" width="18" alt="No" />');
        $('#fldr_name').append(' ');
        $('#fldr_name').append($('#folder_name').text());
        vmf.modal.hide();
        $("#confirmAddUserToFolderContent #row").css({
            "height": "150px",
            "overflow-y": "auto"
        });
        setTimeout(function () {
            vmf.modal.show('confirmAddUserToFolderContent');
        }, 20); // to show the second popup from the first popup
    },

    backToAddUser: function () {
        vmf.modal.hide();
    },

    confirmAddUser: function () {
        var custNumber = $('#custNumber').val();
        var folderId = $('#folderId').val();
        var url = $manageAccessAddUserToFolderUrl + '&selectedFolderId=' + folderId + '&customerNumbers=' + custNumber;
        vmf.ajax.post(url, null, ice.licensefolderview.success_move, ice.licensefolderview.failure_move);
    },
    "addUser": {
        getServices: function () {
            $("#serviceList", $("#addUsersToFoldersContent3")).html('');
            //Send the request to controller to fetch data
            vmf.ajax.post(rs.getServicesForManageUserRoleUrl, {
                'selectedEANumber': ice.eaSelector.getSelectedEANumber()
            }, ser.addUser.loadServices, ser.addUser.error,

            function () {
                $("#loadingDiv", $("#addUsersToFoldersContent3")).hide();
            }, null, function () {
                $("#loadingDiv", $("#addUsersToFoldersContent3")).show();
            });
        },
        loadServices: function (data) {
            if (typeof data != "object") data = vmf.json.txtToObj(data); //Evaluating the data
            var serviceJson = data.services, //Take funds in a object
                aTree = $("<ul></ul>"), //Store the tree structure in an object before appending to DOM
                chTree = $("<ul class=\"sublist\"></ul>");; //Store the child tree in this object, before appending to DOM
            if (serviceJson.length > 0) {
                //$("#emptyTree").hide();
                aTree.append("<li class=\"level1 folderlist\" level=\"1\"><span class=\"pName folderNode disabled serHeader\"><input type=\"checkbox\" class='ul_selectAll' /> All Services </span></li>");
                $.each(serviceJson, function (i, item) {
                    if (item.sName != null && item.sId != null) chTree.append($("<li class=\"folderlist no_child\" level=\"2\"><span sCode='" + item.sId + "' class=\"pName folderNode\"><input type=\"checkbox\"/><span>" + item.sName + "</span></span></li>"));
                });
                aTree.append(chTree);
                $("#serviceList", $("#addUsersToFoldersContent3")).html(aTree);
                ser.addUser.selectAllChks();
            } else {
               $("#serviceList", $("#addUsersToFoldersContent3")).html('<div class="emptyTree">'+rs.noServiceFoundWithPerm+'</div>');
            }
        },
        populateServices: function () {
            var $services = $("#serviceList ul.sublist", $("#addUsersToFoldersContent3")),
                serObj = {}, serArr = [];
            $.each($services.find("input:checkbox:checked"), function () {
                serObj[$(this).closest("span").attr("sCode")] = $(this).siblings("span").html();
            });
            for (var k in serObj) {
                serArr.push("<li sCode='" + k + "'><span>" + serObj[k] + "</span></li>");
            }
            if(typeof _byService!="undefined" && _byService){
                $("#addUsersToFoldersContent4 .body > span + p").html(rs.adduser.step4Confirm);
                $("#addUsersToFoldersContent4 .twoNineZero h1").html(rs.adduser.step4Services);
                $("#addUsersToFoldersContent4 #selectedInviteUsersList + p.data").html(rs.adduser.step4StaticText);
                $("#addUsersToFoldersContent4 #selectedAddUsersList + p.data").html(rs.adduser.step4StaticText1);
            }
            $("#addUsersToFoldersContent4 #inviteUserSelectedFolders").html(serArr.join(""));
            $("#addUsersToFoldersContent6 #inviteUserSelectedFolders").html(serArr.join(""));
        },
        selectAllChks: function () {
            var offset = $("#serviceList", $("#addUsersToFoldersContent3"));
            $(".ul_selectAll", offset).removeAttr("checked").unbind('click').bind('click', function () {
                var $this = $(this);
                if ($this.is(':checked')) {
                    $('input:checkbox:enabled', offset).attr('checked', 'checked').closest('span').addClass("active"); // Check all the items
                    $("#inviteContinue").removeClass("disabled").removeAttr("disabled");
                } else {
                    $('input:checkbox:enabled', offset).not(".disabled").removeAttr('checked').closest('span').removeClass("active"); // Uncheck all the items
                    $("#inviteContinue").addClass("disabled").attr("disabled", "disabled");
                }
            });
            $("ul.sublist input:checkbox", offset).die("click").live("click", function (e) {
                var $this = $(this),
                    $chk = $(this).closest("ul").find("input:checkbox");
                if ($this.is(':checked')) {
                    $this.closest('span').addClass("active");
                    if ($chk.filter(":checked").length == $chk.length) $(".ul_selectAll", offset).attr('checked', 'checked').closest('span').addClass("active");
                    $("#inviteContinue").removeClass("disabled").removeAttr("disabled");
                } else {
                    $this.closest('span').removeClass("active");
                    $(".ul_selectAll", offset).removeAttr('checked').closest('span').removeClass("active");
                    if (!$("ul.sublist input:checkbox:checked").length) $("#inviteContinue").addClass("disabled").attr("disabled", "disabled");
                }
            });
        }
    },
    resetDropdownItems: function () {
        $("#copyPermissionsBtn, #removeUserLink, #addusers").addClass("dummyClick").closest("li").addClass("inactive");
    },
    permissionPaneHt: function () {
        var permHt = $('#permissionSection').outerHeight(true) - ($('#userDetails').outerHeight(true) + $('#userDetails').next('header').outerHeight(true));
        $('#userPermissionPane').css({
            'height': permHt,
            'overflow-y': 'auto'
        });
    },
    adjustHt: function (e) { // adjusting height of the panes (licenses , users  & permissions and Account Summary pages 
        var cHeight = ($("#content-section").height() > parseInt($("#content-section").css("min-height"))) ? parseInt($("#content-section").css("min-height")) : $("#content-section").height();
        var serHeight = $("section.column .scroll").height() + (cHeight - $("#manageAccess").height());
        serHeight = (serHeight > 428) ? serHeight : 428;
        $("#service_user").height(serHeight + $("section.column header").height() + "px");
        $("section.splitter-pane").height(serHeight + $("section.splitter-pane header").outerHeight() + "px");
        $("section.column .scroll,.splitter-bar").height(serHeight + "px");
        ice.filterUser.adjustUserList();
        myvmware.sdp.permissionPaneHt();
        myvmware.common.adjustFolderNode(true, true);
    }
}

function adjustHtForIE7_specific() {
    ice.filterUser.adjustUserList();
    myvmware.sdp.permissionPaneHt();
    myvmware.common.adjustFolderNode(true, true);
}
if (typeof ice == "undefined") ice = {};
if (typeof ice.eaSelector == "undefined") ice.eaSelector = {};
ice.eaSelector.impl = {
    beforeEaSelectorChange: function () {
        //no implementation required
    },
    afterEaSelectorChange_success: function () {
        myvmware.sdp.getServices();
    },
    afterEaSelectorChange_error: function () {
        myvmware.sdp.error();
    }
};
window.onresize = myvmware.sdp.adjustHt;
