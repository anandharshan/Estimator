if (typeof myvmware == "undefined") myvmware = {};
vmf.scEvent=true;
myvmware.copyPerm = {
    init: function () {
        myvmware.sdpCopy.init();
        cP = myvmware.copyPerm;
        cP.bindEvents();
        if (_byService == "1") ser.getServices();
        else cP.ocFunc();
        myvmware.copyPerm.adjustHt()
        callBack.addsc({'f':'riaLinkmy','args':['users-permissions : copy-permissions']});
    },
    bindEvents: function () {
        $('button#filterBtnId').click(function () {
            var searchBoxValue = $.trim($('input.searchInput').val());
            if (searchBoxValue != ice.globalVars.enterEmail && searchBoxValue != '') {
                cP.searchUserDualList();
            }
        });

        $("input.searchInput").blur(function () {
            var searchBoxValue = $.trim($('input.searchInput').val());
            if ($.trim(this.value) == '') {
                this.value = (this.defaultValue ? this.defaultValue : '');
            }
            if ((searchBoxValue == ice.globalVars.enterEmail) || (searchBoxValue == '')) {
                if (searchBoxValue == ice.globalVars.enterEmail) {
                    $('input.searchInput').val('');
                }
                cP.resetFilter();
            }
        });

        $("#copyPermissionFilterRenderUser .searchInput").focus(function () {
            $(this).css('color', '#333333');
            if (this.value == this.defaultValue) {
                this.value = '';
            } else {
                this.select();
            }
        });

        $("#copyPermissionFilterRenderUser .searchInput").blur(function () {
            $(this).css('color', '#999999');
            if ($.trim(this.value) == '') {
                this.value = (this.defaultValue ? this.defaultValue : '');
            }
        });

        $('input.searchInput').click(function () {
            var searchBoxValue = $.trim($('input.searchInput').val());
            if (searchBoxValue == ice.globalVars.enterEmail) {
                $('input.searchInput').val('');
            }
        });
        $('.possibleUsersList li input').unbind('click').bind('click',function () {
            if ($('.removeUsersList').children().hasClass('initmsg')) {
                $('.removeUsersList .initmsg').remove();
            }
            
            var $this = $(this),
                inputName,
                inputEmail,
                liClass = $this.parent().attr('class'); //find class name;
            //If checked, create users data
            if ($this.is(':checked')) {
                $('#copyPerm_next').removeAttr("disabled").removeClass('disabled');
                inputName = $this.parent().find('label').html(); //find name
                inputEmail = $this.parent().find('span').html(); //find email
                //insert new element into the right side (find the UL & .append(object);
                //$this.parent('li').hide();
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
                            $('<li class="' + liClass + '"> <a class="remove" href="#">'+rs.removeLbl+'</a><span class="name">' + inputName + '</span> <span class="email emailremove">' + inputEmail + '</span> </li>').insertBefore($('ul.removeUsersList li.' + curClass));
                        } else {
                            $('<li class="' + liClass + '"> <a class="remove" href="#">'+rs.removeLbl+'</a><span class="name">' + inputName + '</span> <span class="email emailremove">' + inputEmail + '</span> </li>').insertAfter($('ul.removeUsersList li.' + prevClass));
                        }
                        flag = false;

                    }
                    prevClass = $(this).attr('class');
                });
                if (flag) {
                    $('ul.removeUsersList').append('<li class="' + liClass + '"> <a class="remove" href="#">'+rs.removeLbl+'</a><span class="name">' + inputName + '</span> <span class="email emailremove">' + inputEmail + '</span> </li>');
                }
                var getCount = $('ul.removeUsersList li').size();
                if (getCount != 0) {
                    $('span#rem_user_id').html(getCount);
                } else {
                    $('span#rem_user_id').html('0');
                }
                $('ul.removeUsersList .remove').unbind('click').bind('click', function () {
                    var $this = $(this),
                        liClass;
                    liClass = $this.parent().attr('class'); //Get the class from the li
                    $this.parent().remove();
                    $('ul.possibleUsersList .' + liClass).show();
                    $('ul.possibleUsersList .' + liClass).find('input').attr('checked', false);
                    var getCount_new = $('ul.removeUsersList li').size();
                    if (getCount_new != 0) {
                        $('span#rem_user_id').text(getCount_new);
                    } else {
                        $('.removeUsersList').append('<li class=\"initmsg\">' + $staticTextNoUsers + '</li>');
                        $('#copyPerm_next').attr("disabled", "disabled").addClass('disabled');
                        $('span#rem_user_id').text('0');
                         $('#copyPerm_next').attr("disabled", "disabled").addClass('disabled');
                    }
                    if (getCount_new >= 50) {
                        $(".possibleUsersList input:checkbox").not(":checked").attr("disabled", true);
                    } else {
                        $(".possibleUsersList input:checkbox").not(":checked").removeAttr("disabled");
                    }
                    myvmware.common.setAutoScrollWidth('ul.removeUsersList');
                    myvmware.common.setAutoScrollWidth('ul.possibleUsersList');
                    return false;
                });
                myvmware.common.setAutoScrollWidth('ul.removeUsersList');
                myvmware.common.setAutoScrollWidth('ul.possibleUsersList');
            } else {
                //Look to the right side for the class name and .remove();
                $('ul.removeUsersList .' + liClass).remove();
                var getCount_new = $('ul.removeUsersList li').size();
                if (getCount_new != 0) {
                    $('#copyPerm_next').removeAttr("disabled").removeClass('disabled');
                    $('span#rem_user_id').text(getCount_new);
                } else {
                    $('.removeUsersList').append('<li class=\"initmsg\">' + $staticTextNoUsers + '</li>');
                    $('span#rem_user_id').text('0');
                    $('#copyPerm_next').attr("disabled", "disabled").addClass('disabled');
                }
                myvmware.common.setAutoScrollWidth('ul.removeUsersList');
                myvmware.common.setAutoScrollWidth('ul.possibleUsersList');
            }
            if (getCount >= 50) {
                $(".possibleUsersList input:checkbox").not(":checked").attr("disabled", true);
            } else {
                $(".possibleUsersList input:checkbox").not(":checked").removeAttr("disabled");
            }
        });
        $('#backbutton').click(function () {
            $('#tabbed_box_2').hide();
            $('#tabbed_box_1').show();
        });
        $('#copyPerm_next').click(function () {
            var customerId = $('#custNumber').val();
            $('#tabbed_box_2').show();
            $('#column-wrapper_2').show();
            $('#errorMessage').hide();
            $('#confirm_copyPermission').show();
            $('#tabbed_box_1').hide();
            var htmlleft = $('#copydiv').html();
            $('#copydiv1').html('');
            $('#copydiv1').append(htmlleft);

            cP.ocFunc();

            $(".permissionsToCopy .openClose").removeClass('open');

            var displayUserDetails = '';
            var arrayOfSelectedUsers = new Array();
            displayUserDetails += '';
            $(".possibleUsersList input:checkbox[name=checkbox1]:checked").each(function () {
                arrayOfSelectedUsers.push($(this).val());
            });

            $('#custNumber').val(arrayOfSelectedUsers);

            var displayname = '';
            var displayemail = '';
            var totChecked = arrayOfSelectedUsers.length;
            $(".possibleUsersList input:checkbox[name=checkbox1]:checked").each(function () {
                var getParent = $(this).parent('li');
                displayUserDetails += '<div class="user-wrapper clearfix">';
                displayUserDetails += '<div class="name">';
                displayUserDetails += $(getParent).children('label').text();
                displayUserDetails += '</div>';
                displayUserDetails += '<div class="email">';
                displayUserDetails += $(getParent).children('span').text();
                displayUserDetails += '</div>';
                displayUserDetails += '</div>';

            });

            displayUserDetails += '';
            $('#selectedusers').html(displayUserDetails);
            $('#userCount').html(totChecked);
            //$('#selectedusers').attr('style','overflow-x:scroll');
            //$('#copydiv1').attr('style','overflow-x:scroll;height:89% !important;');
            $('ul.permissionsToCopy').attr('style');
            $('ul.permissionsToCopy').removeAttr('style');
            $('ul.permissionsToCopy').attr('style');
            myvmware.common.setAutoScrollWidth('ul.permissionsToCopy');
        });

        $('#confirm_copyPermission').click(function () {
            $('#confirm_copyPermission').attr('disabled', true).addClass('disabled');
            customerId = $('#custNumber').val();
            cP.confirmCopyPermission();
        });
        $('#copyPermissionCancelBtn, #copyPermissionPreviousCancelBtn').click(function () {
            window.location.href = _redirectmanageAccess;
        });
        myvmware.common.setAutoScrollWidth('ul.permissionsToCopy');
        myvmware.common.setAutoScrollWidth('ul.possibleUsersList');
        if ($('ul.possibleUsersList li').length > 0) {
            $('span#sel_user_id').text($('ul.possibleUsersList li').length);
        }
        $('.removeUsersList').append('<li class=\"initmsg\">' + $staticTextNoUsers + '</li>');
    },
    searchUserDualList: function () {
        var searchBoxValue = $.trim($('input.searchInput').val().toUpperCase());
        if (searchBoxValue != ice.globalVars.enterEmail) {
            if (searchBoxValue.length > 0) {
                var userListContainer = $('ul.possibleUsersList');
                $('#filterErrorMsg').hide();
                $('li', userListContainer).each(function () {
                    if (($(this).find('label').text().toUpperCase().indexOf(searchBoxValue) != -1) || ($(this).find('span.email').text().toUpperCase().indexOf(searchBoxValue) != -1)) {
                        $(this).show();
                    } else {
                        $(this).hide();
                        //hideCount++;
                    }
                });
                myvmware.common.setAutoScrollWidth('ul.possibleUsersList');
                if (!$('li:visible', userListContainer).length) {
                    $('#filterErrorMsg').html('<spring:message code="manageAccess.copyPermission.filterUser.errorMessage" text="No matches.  Change the filter and try again."/>')
                        .show();
                    //hideCount = 0;
                    //$('span#sel_user_id').text(hideCount);
                }
                $('span#sel_user_id').text($('ul.possibleUsersList li:visible').length);
            }
        }
    },
    resetFilter: function () {
        $('ul.possibleUsersList li').each(function () {
            $(this).show();
        });
        myvmware.common.setAutoScrollWidth('ul.possibleUsersList');
        $('span#sel_user_id').text($('ul.possibleUsersList li:visible').length);
        $('#filterErrorMsg').hide();
    },
    ocFunc: function () {
        // Open Close Functionality 
        var $permissions = $('.permissionsToCopy');

        $permissions.find('.more-details').hide();
        $permissions.find('a.openClose').die('click').live('click', function () {
            var $a = $(this);
            if (!($a.hasClass('hasdata'))) {
                var _folderClass = $a.next().attr('class');
                var _folderId = _folderClass;
                cP.getFolderPermissions(_folderId, $a);
            } else {
                $(this).parents('li').find('.more-details').slideToggle(200, function () {
                    if ($(this).is(':hidden')) {
                        $a.removeClass('open');
                    } else {
                        $a.addClass('open');
                    }
                });
            }
            return false;
        });
    },
    confirmCopyPermission: function () {
        var custNumber = $('#custNumber').val();
        var url = _copyPermConfirm;
        vmf.ajax.post(url, {
            customerNumbers: custNumber
        }, cP.success_copyPermission, cP.failure_copyPermission);
    },
    success_copyPermission: function (data) {
        var responseData = vmf.json.txtToObj(data);
        if (responseData != null && responseData.error) {
            $('#confirm_copyPermission').attr('disabled', false).removeClass('disabled');
            $('#column-wrapper_2').hide();
            $('#errorMessage').show();
            //$('#confirm_copyPermission').hide();
            $('#errorMessage').html(' ');
            $('#errorMessage').append(responseData.message);
        } else {
            window.location.href = _redirectmanageAccess;
        }
    },
    failure_copyPermission: function (statusError, msgtext) {
        $('#confirm_copyPermission').attr('disabled', false).removeClass('disabled');
        if (msgtext == "parsererror") {
            vmf.modal.show("parsererror");
        } else {
            vmf.modal.show("systemexception");
        }
    },
    getFolderPermissions: function (folderId, currAnchor) {

        $.ajax({
            type: 'POST',
            url: _getPermssionsUrl + '&selectedFolderId=' + folderId,
            async: true,
            dataType: "json",
            success: function (permissionData) {
                cP.success_getFolderPermission(permissionData, currAnchor);
            },
            error: function (response, errorDesc, errorThrown) {
                cP.failure_getFolderPermission(errorThrown);
            },
            beforeSend: function () {
                //TODO Loading icon
            },
            complete: function (jqXHR, settings) {
                //TODO Loading icon
            }
        });

    },
    success_getFolderPermission: function (data, currAnchor) {
        if (data != undefined && data.error) {

        } else {
            var _imgDot = '<img src="/static/myvmware/common/img/dot.png" height="17" width="17" alt="' + $staticTextfortick + '" title="' + $staticTextfortick + '" />';
            var _imgCross = '<img src="/static/myvmware/common/img/cross.png" height="17" width="16" alt="' + $staticTextforcross + '" title="' + $staticTextforcross + '"  />';
            var _imgLock = '<img src="/static/myvmware/common/img/lock.png" height="16" width="14" alt="' + $staticTextforLock + '" title="' + $staticTextforLock + '" />';
            var _permissionRowSkel = '<tr><td></td><td></td>' +
                '<td class=\"yesNo\">' +
                '</td>' +
                '<td class=\"lock\">' +
                '</td>' +
                '</tr>';
            var _permTable = currAnchor.closest('li').find('.more-details table');
            if (data.permissionPaneContents.length <= 0) {
                _permTable.append('<tr><td>' + permissionPane_nodata + '</td></tr>');
            } else {
                for (var i = 0; i < data.permissionPaneContents.length; i++) {
                    var _permTr = $(_permissionRowSkel).clone();
                    if (data.permissionPaneContents[i].level == 1) {
                        $('td', _permTr).eq(0).addClass('space');
                        $('td', _permTr).eq(1).append(data.permissionPaneContents[i].permissionName);
                    } else {
                        $('td', _permTr).eq(0).append(data.permissionPaneContents[i].permissionName);
                        $('td', _permTr).eq(0).attr('colspan', '2');
                        $('td', _permTr).eq(1).remove();
                    }
                    if (data.permissionPaneContents[i].isSet) {
                        $('td.yesNo', _permTr).append(_imgDot);
                    } else {
                        $('td.yesNo', _permTr).append(_imgCross);
                    }
                    if (!data.permissionPaneContents[i].isLoggedInUserCanEdit) {
                        $('td.lock', _permTr).append(_imgLock);
                    }
                    _permTable.append(_permTr);
                }
            }
            currAnchor.addClass('hasdata').addClass('open');
            currAnchor.closest('li').find('.more-details').css('display', '');
        }
    },
    failure_getFolderPermission: function (data) {
        alert('error');
    },
    adjustHt: function (e) { // adjusting height of the panes (licenses , users  & permissions and Account Summary pages
        myvmware.common.adjustPanes();
        var cHeight = ($("#content-section").height() > parseInt($("#content-section").css("min-height"))) ? parseInt($("#content-section").css("min-height")) : $("#content-section").height();
        var folderHeight = $("section.column .scrollx",$("#tabbed_box_1")).outerHeight()+(cHeight-$("#manageAccess").outerHeight());
        folderHeight = (folderHeight>428)? folderHeight: 428;
        var secHeight = folderHeight - $("section.column header").outerHeight(true);
        $("div.copyPerm").height(folderHeight + "px");
        $("section .scroll").height(secHeight + "px");
        $("#userList").height(secHeight - $("#copyPermissionFilterRenderUser").outerHeight(true)+"px")
    }
}

window.onresize = myvmware.copyPerm.adjustHt;

myvmware.sdpCopy = {
    init: function () {
        ser = myvmware.sdpCopy;
    },
    getServices: function () {
        //Send the request to controller to fetch data
        $("#copydiv .permissionsToCopy").hide();
        vmf.ajax.post(rs.getServicesUrl, {}, ser.loadServices, ser.error,

        function () {
            $("#serTreeLoading").addClass("hidden")
        }, null, function () {
            $("#serTreeLoading").removeClass("hidden")
        });
    },
    loadServices: function (data) {
        if (typeof data != "object") data = vmf.json.txtToObj(data); //Evaluating the data
        var serviceJson = data.services, //Take funds in a object
            aTree = $("<ul></ul>"); //Store the tree structure in an object before appending to DOM
        if (serviceJson.length > 0) {
            $("#emptyTree").addClass("hidden");
            $.each(serviceJson, function (i, item) {
                if (item.sName!=null && item.sId!=null)
                    aTree.append($("<li class=\"level1 folderlist no_child\" level=\"2\"><span sCode=" + item.sId + " class=\"pName folderNode\"><a class=\"openClose\" class=\"pName\" id='" + item.sId + "'></a><span class='folderTxt'>" + item.sName + "</span></span></li>").data("perm", item.perm));
            });
            $("#serviceList").append(aTree);
        } else {
            $("#emptyTree").removeClass("hidden");
        }
        ser.bindServiceEvents();
    },
    bindServiceEvents: function () {
        $('#serviceList a.openClose').die('click').live('click', function (e) {
            var $a = $(this);
            if (!($a.hasClass('hasdata'))) {
                ser.getPermissionList($a);
            } else {
                $(this).parents('li').find('.more-details').slideToggle(200, function () {
                    ($(this).is(':hidden')) ? $a.removeClass('open').closest("li").removeClass("noborder") : $a.addClass('open').closest("li").addClass("noborder");
                });
            }
            e.preventDefault();
            e.stopPropagation();
            return false;
        });
    },
    getPermissionList: function (targetEle) {
        if(!targetEle.closest("li").find(".more-details").length){
            targetEle.closest("li").addClass("noborder").append("<div class='more-details'><div class=\"loading_small\">"+ice.globalVars.loadingMsg+"</div></div>").end().addClass('hasdata open');
        }
        var _postData = {
            "selectedServiceId": targetEle.attr("id")
        };
        vmf.ajax.post(rs.getPermissionsUrl, _postData, ser.loadPermPane(targetEle), ser.permFail(targetEle));
    },
    loadPermPane: function (currAnchor) {
        return function (data) {
            if (typeof data != "object") data = vmf.json.txtToObj(data);
            if (data != undefined && data.error) {} else {
               // if(!currAnchor.closest("li").find(".more-details").length)
               // currAnchor.closest("li").append("<div class='more-details'><div class=\"loading_small\">Loading..</div></div>");
                var _permTable = $("<table><tbody></tbody></table>"),
                    permArray = [],
                    imgs = [],
                    target = currAnchor.closest("li").find(".more-details");
                if (!data.permissions.length) {
                    _permTable.append('<tr><td>' + permissionPane_nodata + '</td></tr>');
                } else {
                    $.each(data.permissions, function (i, v) {
                        (v.perm.set) ? imgs.push('<img src="/static/myvmware/common/img/dot.png" height="17" width="17" />') : imgs.push('<img src="/static/myvmware/common/img/cross.png" height="17" width="16" />');
                        if (!v.perm.edit) imgs.push('<img src="/static/myvmware/common/img/lock.png" height="16" width="14" />');
                        permArray.push("<tr id=" + v.pCode + " status=" + v.perm.isSet + "><td class='col1'>" + v.pName + "</td><td class='col2'>" + imgs.join('') + "</td></tr>");
                        imgs = [];
                    });
                }
                _permTable.append(permArray.join(''))
                target.html(_permTable);
                //currAnchor.addClass('hasdata open').closest("li").addClass("noborder");
            }
        }
    },
    permFail: function (currAnchor) {
        return function(res){
            currAnchor.closest("li").find(".more-details").remove();
        }
    }
}
