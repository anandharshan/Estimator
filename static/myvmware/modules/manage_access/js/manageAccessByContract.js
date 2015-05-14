vmf.ns.use("ice");
VMFModuleLoader.loadModule("resize", function() {});
ice.manageaccess={
    initContract: function() {
		vmf.scEvent = true;
		callBack.addsc({'f':'riaLinkmy','args':['users-permissions : by-special-contract']});
        $.prevContractTr = null;
        $.prevUserLi = null;
        $.userList = null;
        $.addUserAction = 'add';
        $.removeUserAction = 'remove';
		$.sLevel = null;
        $("#tab1").click(function() {
            window.location = licenseFolderViewRenderURL;
        });
        
        $("#tab2").click(function() {
            window.location = userAccessViewRenderURL;
        });
        
        $("#tab4").click(function() {
            window.location = permissionViewRenderURL;
        });

        $("#tab5").click(function() {
            window.location = $renderManageAccessMyEPP;
        });

        $("#tab6").click(function() {
            window.location = $renderManageAccessByServices;
        });
        
        $("#btn_cancel12").click(function() {
            vmf.modal.hide();
        });
        
        $("#btn_cancel16").click(function() {
            vmf.modal.hide();
        });
        
        $("#addUserContractAnchor").click(function() {
			vmf.modal.show('addUsersToContractContent',{focus:false});
			myvmware.common.putplaceHolder('.searchInput');
            ice.manageaccess.getAddUserList();
        });
        
        
        $("#userList .icons li").live('mouseover mouseout click', function(e) {
			if($(this).is(".disabled")) return;
			if(e.type == "mouseover"){
				$(this).addClass("hover");
			} else if (e.type == "mouseout"){
				$(this).removeClass("hover");
			} else {
				var _currUserLi = $(this);
				if(_currUserLi.hasClass("active")) return;
				_currUserLi.siblings().removeClass("active");
				_currUserLi.addClass("active");				
				var _userCN = _currUserLi.data('cN');
				$("#userCN").val(_userCN);
				if($.userList != undefined && $.userList != null) {
					//ice.manageaccess.showContractDetail();
					var _contractDetailPane = $("#contractDetail");
					var perm_text = $(_currUserLi).find('label a');
					$('.details .name', _contractDetailPane).empty().append($(_currUserLi).find('label').contents().filter(function() {return this.nodeType == 3;}).text());
					if(perm_text.length) $('.details .name', _contractDetailPane).append('<span id="userRole" class="title"> '+$(perm_text).text()+'</span>');
					$('.details .email a', _contractDetailPane).empty().append(_currUserLi.data('email'));
					$('.details .email a', _contractDetailPane).attr('href', 'mailto:' + _currUserLi.data('email'));
					$("#userCN").data('email', _currUserLi.data('email'));
					$("#userCN").data('fullName', $('label', _currUserLi).text());
					$('#contractDetail .info_wrapper').eq(1).removeClass('hidden');
					$("#contractDetail .contract_info_header").eq(1).removeClass('hidden');
					$('#loading').hide();
				}
                $("#removeUserContractAnchor").parent().removeClass('inactive');
                $("#removeUserContractAnchor").unbind('click').click(function() {
                    vmf.modal.show('removeUserContent1');
                    ice.manageaccess.populateRemoveUserContract();
                });
				$("#contractDetail .details").show();
			}
        });
		
		$("#contractList tbody tr").live('mouseover mouseout click', function(e) {
			if($(this).is(".disabled")) return;
			if(e.type == "mouseover"){
				$(this).addClass("hover");
			} else if (e.type == "mouseout"){
				$(this).removeClass("hover");
			} else {
				if($(this).hasClass("active")) return;
				$(this).siblings().removeClass("active");
				$(this).addClass("active");
				var _currContractTr = $(this);
				var _contractId = $('td', _currContractTr).eq(0).text();
				var _supportLevel = $('td', _currContractTr).eq(1).text();
				var _contractInput = $("#contractId");
				_contractInput.val(_contractId);
				_contractInput.data('supportLevel', _supportLevel);
				_contractInput.data('maxUserCount', $(this).find('td').data('maxUserCount'));
				//$("#loading").html('<ul class="icons"><li class="initmsg"></li></ul>');
				ice.manageaccess.clearContractDetail();
				ice.manageaccess.getUserList(_contractId);
				$.sLevel = '';
				var tds = $(this).find('td');
				$.each(tds, function(index, item) {
				if (index == 1)   
					$.sLevel = item.innerHTML;
				});
			}
        });
        
        $('#exportAllToCsvButton').click(function() {
			var _fPerPostData = new Object();
			_fPerPostData['selectedFolders'] = "ALL";
			_fPerPostData['selectedUserCustomerNumber'] = "ALL";
			_fPerPostData['reportFor'] = 'specialContractViewFromExportAllButton';
			myvmware.common.generateCSVreports($exportToCsvActionFromSpecialContractViewUrl, _fPerPostData, "users-permissions : by-special-contract : export-all", "users-permissions : by-special-contract: Export-to-CSV : Error");
			
			//myvmware.common.generateReports($exportToCsvActionFromSpecialContractViewUrl + '&reportFor=specialContractViewFromExportAllButton&folderId=ALL&selectedUserId=ALL')
		});
        
        $("#userList .settings-cog").addClass('hidden');
        
        ice.manageaccess.clearUserList(null);
		//Fixed bug for BUG-00030489
        ice.manageaccess.clearContractDetail(null);
        
        /*$("#removeUserContractAnchor").click(function() {
            
        });*/
        ice.manageaccess.attachPossibleUserListEvents();
        
        ice.manageaccess.getContractList();
		
		/*Resizing Panes CR Start*/
		vmf.splitter.show('contractSplitter',{
			resizeToWidth: true,
			sizeLeft:parseInt($("#contractList").width(),10),
			outline:true,
			type: "v",
			minLeft:parseInt($("#contractList").width()*.8,10),
			maxLeft:parseInt((($("#userList").width()*.2)+$("#contractList").width()),10),
			accessKey: "R",
			barWidth:false
		});

		vmf.splitter.show("centerRight",{
			resizeToWidth: true,
			sizeRight:parseInt($("#contractDetail").width(),10),
			outline:true,
			maxRight:parseInt(($("#contractDetail").width() + ($("#userList").width()*.2)),10),
			minRight:parseInt($("#contractDetail").width()*.8,10),
			type: "v",
			accessKey: "R",
			barWidth:false
		});
		/*Resizing Panes CR End*/
		$(window).trigger("resize");
    },
    getSelectedEA: function() {
        return $("#eaSelectorDropDown option:selected").val();
    },
    clearUserList: function(msg) {
        $("#userList .icons").empty();
        var _liSkel = $('<li class=\"initmsg \"></li>');
        if(msg != undefined && msg != null && msg != '') {
            $("#userList .icons").append(_liSkel.append( msg ));
        }
    },
    clearContractDetail: function(msg) {
        $("#contractDetail .contract_info_header, .info_wrapper").addClass('hidden');
        $("#contractDetail #loading ul li").empty();
        $("#contractDetail .details > .name, .email a").empty();
        if(msg != undefined && msg != null && msg != '') {
			$("#contractDetail #loading").show();
            $("#contractDetail #loading ul li").html(msg);
        }
    },
    showContractDetail: function() {
		$('#contractDetail .info_wrapper').eq(0).removeClass('hidden');
        $("#contractDetail .contract_info_header").eq(0).removeClass('hidden');
        $("#contractDetail #loading").hide();
		if($.sLevel == 'MCS')
		{
			$('#contractDetail p.info_wrapper').html($('#contractDetail p.info_wrapper').html().replace(/BCS/gi, "MCS"));
		}	
		else
		{
			$('#contractDetail p.info_wrapper').html($('#contractDetail p.info_wrapper').html().replace(/MCS/gi, "BCS"));
		}
    },
    getContractList: function() {
        var _contractPostData = new Object();
        var _selectedEA = ice.manageaccess.getSelectedEA();
        if(_selectedEA != '') {
            _contractPostData['selectedEANumber'] = _selectedEA;
        }
        
        $("#userList .settings-cog").addClass('hidden');
        $("#contractDetail .details").hide();
        //Make sure there is no current ongoing request, if yes cancel it
		if($.cLJQXHR && $.cLJQXHR.readystate != 4) {
            $.cLJQXHR.abort();
        }
        
        $.cLJQXHR = $.ajax({
            type: 'POST',
            url: contractListResourceURL,
            data: _contractPostData,
            dataType: 'json',
            success: function(contractList) {
                $("#contractList tbody").empty();
                var _validate = new Object();
                ice.manageaccess.validateContractList(contractList, _validate);
                if(_validate.result) {
                    ice.manageaccess.populateContractList(contractList);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                //TODO
                $("#contractList tbody").empty();
                if(textStatus == "parsererror") {
                    //TODO SHOW validation failed message in modal
                    ice.manageaccess.logError(ice.globalVars.invalidAJAX); 
                }
            },
            beforeSend: function() {
                $("#contractList tbody").empty().append('<tr><td><div class="loading"><span class="loading_small">'+ice.globalVars.loadingMsg+'</span></div></td></tr>');
            },
            complete: function() {
                //Do Nothing
            }
        });
    },
    validateContractList: function(contractList, validate) {
        if(contractList.error != undefined && contractList.error) {
            ice.manageaccess.logError("Error Received: " + contractList.message);
            validate.result = false;
        }
        else if(contractList.length == 0) {
			if($("button#exportAllToCsvButton") != null && $("button#exportAllToCsvButton") != 'undefined'){ //BUG-00047200
				$("button#exportAllToCsvButton").hide();
			}
			
            $("#contractList table tbody").empty().append('<tr class="disabled" style=\"cursor:auto\"><td><strong>' + ice.globalVars.noContractsForEA + '</strong></td></tr>');
            validate.result = false;
        }
        else {
			if($("button#exportAllToCsvButton") != null && $("button#exportAllToCsvButton") != 'undefined'){//BUG-00047200
			$("button#exportAllToCsvButton").show();
			}
			
            validate.result = true;
        }
    },
    populateContractList: function(contractList) {
        ice.manageaccess.clearUserList(ice.globalVars.selectContractMsg);
       // ice.manageaccess.clearContractDetail(ice.globalVars.selectUserMsg);
    
        var _contractTbody = $("#contractList tbody");
        var _skelContractRow = $("<tr><td></td><td></td></tr>");
        _contractTbody.empty();
        for(var i=0;i<contractList.length;i++) {
            var _contractRow = _skelContractRow.clone();
            var _contractTd = $('td', _contractRow);
            _contractTd.eq(0).text(contractList[i].contractNumber); //Contract Number
            _contractTd.eq(1).text(contractList[i].contractType); //Contract Type
            _contractTd.data('maxUserCount', contractList[i].userCount); //Max user count
            _contractTbody.append(_contractRow);
        }
        //ice.manageaccess.attachContractListEvents();
    },
    /*attachContractListEvents: function() {
        $("#contractList tbody tr").click(function() {
            if($.prevContractTr != null) {
                $.prevContractTr.removeClass('active');
            }
            var _currContractTr = $(this).parents('tr');
            _currContractTr.addClass('active');
            $.prevContractTr = _currContractTr;
            var _contractId = $('td', _currContractTr).eq(0).text();
            var _supportLevel = $('td', _currContractTr).eq(1).text();
            var _contractInput = $("#contractId");
            _contractInput.val(_contractId);
            _contractInput.data('supportLevel', _supportLevel);
            _contractInput.data('maxUserCount', $(this).find('td').data('maxUserCount'));
            ice.manageaccess.getUserList(_contractId);
        });
    },*/
	sortingAscLi: function(){
		var li = $('#userList ul.info_list li');
		li.sortElements (function(a, b){
		a = $(a).find('label:eq(0)');
		b = $(b).find('label:eq(0)');
		return $(a).text().toUpperCase() > $(b).text().toUpperCase() ? 1 : -1;
		});
	},
    getUserList: function(contractId) {
    
        var _userPostData = new Object();
        _userPostData['selectedContractNumber'] = contractId;
        var _selectedEA = ice.manageaccess.getSelectedEA();
        if(_selectedEA != '') {
            _userPostData['selectedEANumber'] = _selectedEA;
        }
        
        
        
        //Make sure there is no current ongoing request, if yes cancel it
		if($.uLJQXHR && $.uLJQXHR.readystate != 4){
            $.uLJQXHR.abort();
        }
        
        $.uLJQXHR = $.ajax({
            type: 'POST',
            url: userListResourceURL,
            data: _userPostData,
            dataType: 'json',
            success: function(userList) {
                $.userList = userList;
                $("#userList ul.icons").empty();
                var _validate = new Object();
                ice.manageaccess.validateUserList(userList, _validate);
                if(_validate.result) {
                    ice.manageaccess.populateUserList(userList);
					ice.manageaccess.sortingAscLi(); //Sorting the li elements through sortElements plug-in
					var _contractDetailPane = $("#contractDetail");
					var _detailItem = $('.info_wrapper .info_content', _contractDetailPane);
					_detailItem.eq(0).find('a').empty().append(userList.contractHeaderID); //ContractId
					//Changes for bug-00070807-passing encryptedContractHeaderID and status
					$('#contractIDLnk').attr("href", "/group/vmware/support-contract-history?_VM_action=viewContractDetails&_VM_contractID="+userList.encryptedContractHeaderID+ '&_VM_contractStatus=' + userList.status);
					if($.trim(userList.region) != ""){
						_detailItem.eq(1).show().find('span').empty().append(userList.region + '&nbsp;&nbsp;'); 
					}else{//Region
						_detailItem.eq(1).hide();
					}
					_detailItem.eq(2).find('span').empty().append(userList.contractEndDate); //End Date
					ice.manageaccess.showContractDetail();
					$("#loading").html('<ul class="icons"><li class="initmsg">'+ice.globalVars.selectUserMsg+'</li></ul>');
					$("#contractDetail #loading").show();
					
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                //TODO
                $("#userList ul.icons").empty();
                if(textStatus == "parsererror") {
                    //TODO SHOW validation failed message in modal
                    ice.manageaccess.logError(ice.globalVars.invalidAJAX); 
                }
            },
            beforeSend: function() {
                $("#userList ul.icons").empty().append('<li class=\"without_icons\"><div class="loading"><span class="loading_small">'+ice.globalVars.loadingMsg+'</span></div></li>');
            },
            complete: function() {
                //Do Nothing
            }
        });
    },
    validateUserList: function(userList, validate) {
        if(userList.error != undefined && userList.error) {
            ice.manageaccess.logError("Error Received: " + userList.message);
            validate.result = false;
        }
        else if(userList.user.length == 0) {
            $("#userList ul.icons").empty().append('<li class=\"without_icon disabled\" style=\"cursor:auto\"><strong>' + ice.globalVars.noUsersForContract + '</strong></li>');
            validate.result = false;
        }
        else {
            validate.result = true;
        }
        
        if(userList.impersonatingUser) {
            $("#userList .settings-cog").removeClass('hidden');
            //Hide remove user
            $("#removeUserContractAnchor").parent().addClass('inactive');
            $("#removeUserContractAnchor").unbind('click');
        }
    },
    populateUserList: function(userList) {

        ice.manageaccess.clearContractDetail(ice.globalVars.selectUserMsg);
    
        var _userListUl = $("#userList ul.icons");
        var _skelUserLi =  $('<li class=\"without_icon\"><label style=\"width:auto!important;\"></label></li>');
        $("#contractId").data('userCount', userList.user.length);
        for(var i=0;i<userList.user.length;i++) {
            var _userRow = _skelUserLi.clone();
            var _contractInput = $("#contractId");
			var str="";
			var htm="";
			//for PC user
			if(userList.user[i].procPermission==true){
				str="p";
				htm='<a href="#" class="hreftitle" title="'+$staticTextforPC+'" alt="'+$staticTextforPC+'">'+$staticTextforPC+'</a>';
			}
			//for ITSU
			if(userList.user[i].superPermission==true){
				str="s";
				htm='<a href="#" class="hreftitle" title="'+$staticTextforSU+'" alt="'+$staticTextforSU+'">'+$staticTextforSU+'</a>';
			}
			//for pc and itsu
			if(userList.user[i].procPermission==true && userList.user[i].superPermission==true){
				str="sp";
				htm='<a href="#" class="hreftitle" title="'+$staticTextforSUPC+'" alt="'+$staticTextforSUPC+'">'+$staticTextforSUPC+'</a>';
			}
			
			if(str != ""){
				$(_userRow).removeClass('without_icon').addClass(str);
				$('label', _userRow).append(htm);
			}
			$('label', _userRow).append(userList.user[i].firstName + ' ' + userList.user[i].lastName);//fixed bug for BUG-00025505
            
            _userRow.data('cN', userList.user[i].cN);
            _userRow.data('email', userList.user[i].email);
            _userRow.data('contractHeaderID', userList.contractHeaderID);
            _userRow.data('contractEndDate', userList.contractEndDate);
            _userRow.data('region', userList.region);
            _contractInput.data('region', userList.region);
            _userListUl.append(_userRow);
        }
        //ice.manageaccess.attachUserListEvents();
    },
    /*attachUserListEvents: function() {
        $("#userList li input").click(function() {
            if($.prevUserLi != null) {
                $.prevUserLi.removeClass('active');
            }
            var _currUserLi = $(this).parents('li');
            _currUserLi.addClass('active');
            $.prevUserLi = _currUserLi;
            var _userCN = _currUserLi.data('cN');
            $("#userCN").val(_userCN);
            if($.userList != undefined && $.userList != null) {
                ice.manageaccess.showContractDetail();
                var _contractDetailPane = $("#contractDetail");
                $('.details .name', _contractDetailPane).empty().append($('label', _currUserLi).text());
                $('.details .email a', _contractDetailPane).empty().append(_currUserLi.data('email'));
                $('.details .email a', _contractDetailPane).attr('href', 'mailto:' + _currUserLi.data('email'));
                $("#userCN").data('email', _currUserLi.data('email'));
                $("#userCN").data('fullName', $('label', _currUserLi).text());
                var _detailItem = $('.info_wrapper .info_content', _contractDetailPane);
                _detailItem.eq(0).find('a').empty().append(_currUserLi.data('contractHeaderID')); //ContractId
                _detailItem.eq(1).find('span').empty().append(_currUserLi.data('region') + '&nbsp;&nbsp;'); //Region
                _detailItem.eq(2).find('span').empty().append(_currUserLi.data('contractEndDate')); //End Date
            }
        });
    },*/
    getAddUserList: function() {
        //Populate header fields
        var _contractInput = $("#contractId");
        $("#contractIdHeader .stepdesc").empty().append(_contractInput.val());
        $("#supportLevelHeader .stepdesc").empty().append(_contractInput.data('supportLevel'));
		if($.trim(_contractInput.data('region')) != ""){
			$("#regionHeader").show();
	        $("#regionHeader .stepdesc").empty().append(_contractInput.data('region'));
		}else{
			$("#regionHeader").hide();
		}
    
        var _addUserCPostData = new Object();
        _addUserCPostData['selectedContractNumber'] = $("#contractId").val();
        var _selectedEA = ice.manageaccess.getSelectedEA();
        if(_selectedEA != '') {
            _addUserCPostData['selectedEANumber'] = _selectedEA;
        }
        
        //Make sure there is no current ongoing request, if yes cancel it
		if($.auLJQXHR && $.auLJQXHR.readystate != 4){
            $.auLJQXHR.abort();
        }
    
        $.auLJQXHR = $.ajax({
            type: 'POST',
            url: addUserContractResourceURL,
            data: _addUserCPostData,
            dataType: 'json',
            success: function(possibleUserList) {
                $("#userListLeft ul").empty();
                var _validate = new Object();
                ice.manageaccess.validatePossibleUserList(possibleUserList, _validate);
                if(_validate.result) {
                    ice.manageaccess.populatePossibleUserList(possibleUserList);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                //TODO
                $("#userListLeft ul").empty();
                if(textStatus == "parsererror") {
                    //TODO SHOW validation failed message in modal
                    ice.manageaccess.logError(ice.globalVars.invalidAJAX); 
                }
            },
            beforeSend: function() {
                $("#userListLeft ul").append('<li><div class="loading"><span class="loading_small">'+ice.globalVars.loadingMsg+'</span></div></li>');
            },
            complete: function() {
                //Do Nothing
            }
        });
    },
    validatePossibleUserList: function(possibleUserList, validate) {
        if(possibleUserList.error != undefined && possibleUserList.error) {
            ice.manageaccess.logError("Error Received: " + possibleUserList.message);
            validate.result = false;
        }
        else if(possibleUserList.length == 0) {
            vmf.modal.hide('addUsersToContractContent');
            ice.manageaccess.toggleModalError(ice.globalVars.noPossibleUsers, true);
            validate.result = false;
        }
        else {
            validate.result = true;
        }
    },
    populatePossibleUserList: function(possibleUserList) {
        //Populate Count
        $("#availUserCount").empty().append(possibleUserList.length);
		var _contractType= $("#contractId").data('supportLevel');
        var _selUserCount = parseInt($("#contractId").data('maxUserCount')) - parseInt($("#contractId").data('userCount'));

        if(_selUserCount <= 0 && _contractType == 'BCS') {
            vmf.modal.hide('addUsersToContractContent');
            ice.manageaccess.toggleModalError(ice.globalVars.userCountExceed, true);
            return false;
        }
        //$("#selectedUserCount").text(_selUserCount);
		if(_contractType == 'BCS'){
					$("#selectedUserCount").text(_selUserCount);
		}
		if(_contractType == 'MCS'){ //since there is no user count for MCS contract
			// $("#selectedUserCount").text('NA');
			$("#availableUsers").css("display","none");
		}else{
		    $("#availableUsers").css("{}");
		}
        
        var _skelUserLi = $('<li class=\"clearfix\"><input type=\"checkbox\" name="userChk"><span class=\"first\"></span><span class=\"second\"></span></li>');
        var _userListLeftUl = $("#userListLeft ul");
        _userListLeftUl.empty();
        
        $("#userListRight ul").empty().append('<li class=\"statictext\">' + ice.globalVars.selectUsersToAdd + '</li>');
        
        for(var i=0;i<possibleUserList.length;i++) {
            var _userLi = _skelUserLi.clone();
            $('span', _userLi).eq(0).append(possibleUserList[i].firstName + ' ' +  possibleUserList[i].lastName); //User name
            $('span', _userLi).eq(1).append(possibleUserList[i].email); //Email
            _userLi.data('cN', possibleUserList[i].cN); //CN
            _userLi.data('firstName', possibleUserList[i].firstName); //Firstname
            _userLi.data('lastName', possibleUserList[i].lastName); //Lastname
            _userListLeftUl.append(_userLi);
        }
    },
    attachPossibleUserListEvents: function() {
        $("#userListLeft ul").delegate('li input', 'click', function() {
            var _availUserCount = parseInt($("#availUserCount").text());
            var _selUserCount = parseInt($("#selectedUserCount").text());
	    var _contractType= $("#contractId").data('supportLevel');//test
        
            if(_selUserCount <= 0 && _contractType == 'BCS') {
                $("#addUsersToContractContent .userCountFull").remove();
                //$("#addUsersToContractContent .body").append('<div class=\"userCountFull textRed\">' + ice.globalVars.userCountExceed + '</div>');
				alert(ice.globalVars.userCountExceed);
                return false;
            }
            $("#availUserCount").text(_availUserCount-1);
			if(_contractType == 'BCS'){
						$("#selectedUserCount").text(_selUserCount-1);
			}
			if(_contractType == 'MCS'){ //since there is no user count for MCS contract
				 $("#selectedUserCount").text('NA');
			}
			
            var _userListRight = $("#userListRight ul");
            if(($('.statictext', _userListRight).length > 0) && ($('li', _userListRight).length == 1)) {
                $('.statictext', _userListRight).remove();
            }
            var _selUserLeftLi = $(this).parent();
            var _selUserClone = _selUserLeftLi.clone(true);
            _selUserLeftLi.remove();
            var _removeAnchor = $('<a class=\"remove\" href=\"#\"></a>').append('Remove');
            $('input', _selUserClone).remove();
            _selUserClone.prepend(_removeAnchor);
            _userListRight.append(_selUserClone);
            return false;
        });
        $("#userListRight ul").delegate('li a', 'click', function() {
            $("#addUsersToContractContent .userCountFull").remove();
            $("#availUserCount").text(parseInt($("#availUserCount").text())+1);
            $("#selectedUserCount").text(parseInt($("#selectedUserCount").text())+1);
            var _userListLeft = $("#userListLeft ul");
            var _userListRight = $("#userListRight ul");
			var _selUserRightLi = $(this).parent();
            var _selUserClone = _selUserRightLi.clone(true);
            _selUserRightLi.remove();
            var _checkBox = $('<input type=\"checkbox\" name="userChk">');
            $('a', _selUserClone).remove();
            _selUserClone.prepend(_checkBox);
            _userListLeft.append(_selUserClone);
            if(($('.statictext', _userListRight).length == 0) && ($('li', _userListRight).length == 0)) {
                _userListRight.empty().append('<li class=\"statictext\">' + ice.globalVars.selectUsersToAdd + '</li>');
            }           
            return false;
        });
        $("#addUserContractConfirm").click(function() {
            var _listSelUsers = $("#userListRight ul li");
            var _userList = new Array();
            for(var i=0;i<_listSelUsers.length;i++) {
                var _user = new Object();
                _user.cN = _listSelUsers.eq(i).data('cN');
                _userList.push(_user.cN);
            }
            ice.manageaccess.confirmAddUserContract(_userList);
        });
        
        $("#availUserSearch button").click(function() {
            var _searchTerm = $.trim($(this).prev().val());
            _searchTerm = _searchTerm.toLowerCase();
			var _errorResult = $("<span class='initMsg'>"+ice.globalVars.enterValue+"</span>");
			var _errorResult_no = $("<span class='initMsg'>"+ice.globalVars.noMatchFound+"</span>");
			var _defaultVal = $(this).prev().attr('placeholder');
			var _userList_ul = $("#userListLeft ul");
            var _userList = $("#userListLeft ul li");
			var no_result = false;
			if($(this).prev().val() == _defaultVal || _searchTerm == '') {
				$(_userList_ul).find('span.initMsg').remove();
				$(_userList).show();
				return true;
			}
            if(_searchTerm != '') {
                _userList.css('display', 'none');
				$(_userList_ul).find('span.initMsg').remove();
                if(_searchTerm.length > 100) {
                    _userList.append('<li class=\"display\">' + ice.globalVars.noResults + '</li>');
                }
                else {
                    $('li .display', _userList).remove();
                    if(_searchTerm.indexOf('@') != -1) {
                        //Search email
                        for(var i=0;i<_userList.length;i++) {
                            var _currEmail = $('span', _userList.eq(i)).eq(1).text().toLowerCase();
                            if(_searchTerm == _currEmail) {
                                _userList.eq(i).css('display','block');
								no_result = true;
                            }else{
								if(no_result != true){
									no_result = false;
								}
							}
                        }
                    }
                    else {
                        //Search name
                        for(var i=0;i<_userList.length;i++) {
                            var _currFN = _userList.eq(i).data('firstName').toLowerCase();
                            var _currLN = _userList.eq(i).data('lastName').toLowerCase();
                            var _currFullName = _currFN + ' ' + _currLN;
                            if((_currFN.indexOf(_searchTerm) != -1) || (_currLN.indexOf(_searchTerm) != -1)
                                || (_currFullName.indexOf(_searchTerm) != -1)) {
                                _userList.eq(i).css('display','block');
								no_result = true;
                            }else{
								if(no_result != true){
									no_result = false;
								}
							}
                        }
                    }
                }
				if(no_result == false){
					$(_userList_ul).append(_errorResult_no);
				}
            }
        });
		$('#availUserSearch .searchInput').keypress(function(e){
		  if(e.which == 13){
		   	$("#availUserSearch button").trigger('click');
		  }
     	});
        
        
    },
    confirmAddUserContract: function(userList) {    
        
        var _confirmAddPostData = new Object();
        _confirmAddPostData['selectedContractNumber'] = $("#contractId").val();
        var _selectedEA = ice.manageaccess.getSelectedEA();
        if(_selectedEA != '') {
            _confirmAddPostData['selectedEANumber'] = _selectedEA;
        }
		// Changed the label for add user as part of BUG-00068588
        _confirmAddPostData['action'] = $.addUserAction;
        _confirmAddPostData['customerNumbers'] = userList.toString();
        
        //Make sure there is no current ongoing request, if yes cancel it
		if($.cauLJQXHR && $.cauLJQXHR.readystate != 4){
            $.cauLJQXHR.abort();
        }
        
        $.cauLJQXHR = $.ajax({
            type: 'POST',
            url: addUserContractConfirmResourceURL,
            data: _confirmAddPostData,
            dataType: 'json',
            success: function(addUserConfirm) {
                //vmf.loading.hide();
                var _validate = new Object();
                ice.manageaccess.validatePossibleUserList(addUserConfirm, _validate);
                if(_validate.result) {
                    ice.manageaccess.getUserList(_confirmAddPostData['selectedContractNumber']);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                //TODO
                //vmf.loading.hide();
                if(textStatus == "parsererror") {
                    //TODO SHOW validation failed message in modal
                    ice.manageaccess.logError(ice.globalVars.invalidAJAX); 
                }
            },
            beforeSend: function() {
                vmf.modal.hide();
                //vmf.loading.show({"msg":ice.globalVars.addUserLoading, "overlay":true});
            },
            complete: function() {
                //Do Nothing
            }
        });
    },
    validateConfirmAddUserContract: function(addUserConfirm, validate) {
        if(addUserConfirm.error != undefined && addUserConfirm.error) {
            ice.manageaccess.toggleModalError(ice.globalVars.addUserNoSuccess, true);
            ice.manageaccess.logError(addUserConfirm.message);
            validate.result = false;
        }
        else {
            validate.result = true;
        }
    },
    populateRemoveUserContract: function() {
        $("#removeUserDetails").empty().append($("#userCN").data('fullName') + '<br>' + $("#userCN").data('email'));
        $("#removeUserFrom").empty().append($("#contractId").data('supportLevel'));
        $("#removeUserContractId").empty().append($("#contractId").val());
        
        $("#removeUserConfirm").click(function() {
            ice.manageaccess.confirmRemoveUserContract();
        });
    },
    confirmRemoveUserContract: function() {
        var _confirmRemovePostData = new Object();
        _confirmRemovePostData['selectedContractNumber'] = $("#contractId").val();
        var _selectedEA = ice.manageaccess.getSelectedEA();
        if(_selectedEA != '') {
            _confirmRemovePostData['selectedEANumber'] = _selectedEA;
        }
		// Changed the label for remove user as part of BUG-00068588
        _confirmRemovePostData['action'] = $.removeUserAction;
        _confirmRemovePostData['customerNumbers'] = $("#userCN").val();
            
        //Make sure there is no current ongoing request, if yes cancel it
		if($.cruLJQXHR && $.cruLJQXHR.readystate != 4){
            $.cruLJQXHR.abort();
        }
        
        $.cruLJQXHR = $.ajax({
            type: 'POST',
            url: addUserContractConfirmResourceURL,
            data: _confirmRemovePostData,
            dataType: 'json',
            success: function(removeUserConfirm) {
                //vmf.loading.hide();
                var _validate = new Object();
                ice.manageaccess.validateRemoveUser(removeUserConfirm, _validate);
                if(_validate.result) {
                    ice.manageaccess.getUserList(_confirmRemovePostData['selectedContractNumber']);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                //TODO
                //vmf.loading.hide();
                if(textStatus == "parsererror") {
                    //TODO SHOW validation failed message in modal
                    ice.manageaccess.logError(ice.globalVars.invalidAJAX); 
                }
            },
            beforeSend: function() {
                vmf.modal.hide();
                //vmf.loading.show({"msg":ice.globalVars.addUserLoading, "overlay":true});
            },
            complete: function() {
                //Do Nothing
            }
        });
    },
    validateRemoveUser: function(removeUserConfirm, validate) {
        if(removeUserConfirm.error != undefined && removeUserConfirm.error) {
            ice.manageaccess.toggleModalError(ice.globalVars.removeUserNoSuccess, true);
            ice.manageaccess.logError(removeUserConfirm.message);
            validate.result = false;
        }
        else {
            validate.result = true;
        }
    },
    toggleModalError: function(message,showFlag) {
        if(showFlag) {
            $("#manageAccessExceptionMessage").empty().append(message);
            //vmf.modal.show('manageAccessExceptionMessagePopup'); Not working needs to be fixed
            alert(message);
        }
        else {
            vmf.modal.hide();
        }
    },
    logError: function(error) {
        try {
            console.error(error);
        }
        catch(e) {
            //Do nothing
        }
    },
	adjustHt: function(){
		//myvmware.common.adjustPanes();
		var cHeight = ($("#content-section").height() > parseInt($("#content-section").css("min-height")))? parseInt($("#content-section").css("min-height")) : $("#content-section").height();
		var folderHeight = $("section.column").height()+(cHeight-$("#manageAccess").height());
		folderHeight = (folderHeight>428)? folderHeight: 428;
		$("#mySplitter").height(folderHeight+$("section.column header").height()+"px");
		$("section.splitter-pane").height(folderHeight+$("section.splitter-pane header").outerHeight()+"px");
		$("section.column .scroll,.splitter-bar").height(folderHeight+"px");
	},
};
function adjustHtForIE7_specific(){myvmware.common.adjustFolderNode(true);};
window.onresize=ice.manageaccess.adjustHt;
