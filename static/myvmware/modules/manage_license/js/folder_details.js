/** Some naming conventions
	fd - folder details
	dt - data table
	ht - height
*/
if (typeof(myvmware) == "undefined") {
	myvmware = {};
}

myvmware.hoverContent = myvmware.hoverContent || {};
myvmware.hoverContent.bindEvents = function(){};

var fd = {};
myvmware.folderDetails = {
	init: function () {
		fd = myvmware.folderDetails;
		callBack.addsc({'f':'riaLinkmy','args':['my-licenses : folder-details']});
		$('.splitterPaneHeading, #userPermissionPane, #userDiv').show();
		$('li.'+rs.folderId).attr('level', rs.folderLevel);

		fd.attachEvents();
		fd.adjustPanesHt();
		
		fd.loadProductsDT();
		fd.loadUsersOfFolder();
		fd.loadPermissionsPane();
        // to show export drop down, taken from common.js
        fd.showExportDD();

		setTimeout(function(){
			vmf.splitter.show('fd_splitter',{
				type: "v",
				sizeLeft:parseInt($("#ltSec").width()*.9,10),
				resizeToWidth: true,
				outline:true,
				minLeft: parseInt($("#ltSec").width()*.8,10),
				maxLeft: parseInt($("#ltSec").width() + ($("#rtSec").width()*.2),10),
				barWidth:false
			});
			vmf.splitter.show("centerBottom",{
				splitHorizontal: true,
				sizeTop: true,
				outline:true,
				accessKey: "H",
				minTop:343,
				minBottom: 157
			});
		});
	},
	attachEvents: function(){
        var locale = $('#localeFromLiferayTheme').text().split("_");
        var currentLocale = (locale[0].toLowerCase() == 'en') ? 'en' : locale[1].toLowerCase();

		fd.oldResizeCommon = window.onresize;
		window.onresize = myvmware.folderDetails.adjustPanesHt;

		$('.manageKeysBtn').bind('click', function(ev){
			if(typeof riaLinkmy !="undefined") riaLinkmy('my-licenses : folder-details : manage-keys');
			setTimeout(function(){ window.location.href = '/'+currentLocale+'/group/vmware/my-licenses';},100);
			ev.preventDefault();
		});
		$('#viewPermissionsBtn').bind('click', function(ev){
			if(typeof riaLinkmy !="undefined") riaLinkmy('my-licenses : folder-details : view-permissions');
			setTimeout(function(){window.location.href = '/'+currentLocale+'/group/vmware/users-permissions';},100);
			ev.preventDefault();
		});
		// export to excel - for licensekeys options
		$('#fdExportLicenseKeys').bind('click', function(ev){
			if(typeof riaLinkmy !="undefined") riaLinkmy('my-licenses : folder-details : export-keys');
			vmf.ajax.post(rs.url.exportToCsvFromLicensesUrl, {reportFor: 'licenseKeysFromContextMenu', selectedFolders: rs.folderId}, function(resp){
				resp = vmf.json.txtToObj(resp);
				window.location.href = resp.respUrl;
			});
			ev.preventDefault();
		});
		// export to excel - for pemissions options
		$('#fdExportPermissions').bind('click', function(ev){
			if(typeof riaLinkmy !="undefined") riaLinkmy('my-licenses : folder-details : export-permissions');
			vmf.ajax.post(rs.url.exportToCsvFromLicensesGetUrl, {reportFor: 'byFolderFromContextMenu', selectedFolders: rs.folderId}, function(resp){
				resp = vmf.json.txtToObj(resp);
				window.location.href = resp.respUrl;
			});
			ev.preventDefault();
		});
        myvmware.folderDetails.attachRequestPermissionEvent();
		
	},
    attachRequestPermissionEvent:function(){
        $('#requestPermissionLink').live('click', function(){
			var targetDetailsObj = {
				fPath: rs.fullFolderPath,
				fId: rs.folderId,
				fName: rs.selectedFolderName,
				parentfId: null,
				custId: rs.selectedCustomerNumber
			};
			if(!$(this).hasClass("dummyClick") && targetDetailsObj.fId.length > 0){
				if(typeof riaLinkmy !="undefined") riaLinkmy('my-licenses : folder-details : request-permissions');
				ice.requestAccessPermissions.populateEditPermissionUI(targetDetailsObj);
			}
		});
    },
	adjustPanesHt: function(){
		if (typeof fd.oldResizeCommon === 'function' && fd.oldResizeCommon.toString() != arguments.callee.toString()) {fd.oldResizeCommon(); }
		var totalHt = $('#ltSec').height(), // total available height
			permissionsPaneHt = $('#permissionsListPane').height(), // permissions pane's height
			splitterBarHt = $('#rtSec .splitter-bar').height(), // splitter bar's height
			prodTableHt = $('#productDetails').height();

		// set the height of the datatable
		$('#productDetails_wrapper').addClass('bottomarea');
		var dtAvailableHt = totalHt-$('#productsTblManageKeysBtn').outerHeight(true)-$('.dataTables_scrollHead').height();
		if( prodTableHt > dtAvailableHt ){ // if the table contents are exceeding the available space
			/*Fix for BUG-00070317*/
            $('.dataTables_scrollBody').height(dtAvailableHt-11);
		}else if( prodTableHt > $('.dataTables_scrollBody').height() ){ // else if table height is more than default height
			/*Fix for BUG-00070317*/
            $('.dataTables_scrollBody').height(prodTableHt-11);
		}

		$('.dataTables_scrollHeadInner, .dataTables_scrollHeadInner table').width('inherit');
		// users list pane height setting
		$('#usersListPane').height(totalHt-permissionsPaneHt-splitterBarHt);
		
		// set the height of the UL for the 'permissions pane'
		$('#userPermissionPane').height(permissionsPaneHt-
										$('#permissionsListPane .splitterPaneHeading').outerHeight(true)-
										$('#permissionsListPane .paneActionButton').outerHeight(true)
		);

		// set the height of the UL for the 'users pane'
		$('#userDiv').height($('#usersListPane').height()-
							 $('#usersListPane .splitterPaneHeading').outerHeight(true)-
							 $('#usersListPane .paneActionButton').outerHeight(true)
		);
		if (typeof fd.adjustUserList === 'function' && fd.adjustUserList.toString() != arguments.callee.toString()) {fd.adjustUserList(); }
	},
	adjustUserList: function(){
		var userList = $('ul.info_list li');
		if(userList.length){
			var liFirst = $('ul.info_list li:first'), 
				s = $('ul.info_list li.s'), 
				sp = $('ul.info_list li.sp'), 
				labelWid = parseInt(liFirst.width()-40, 10);
			userList.find('span').css({'left':liFirst.width()-15+'px'});
			userList.find('label').css('width',labelWid +'px');
			if(s.length || $('ul.info_list li.p').length || $('ul.info_list li.ad').length){
				userList.find('li.s label,li.p label,li.ad label').css('width',(labelWid - parseInt(s.find('label').css('padding-left'),10) + 'px'));
			}
			if(sp.length){
				sp.find('label').css('width',(labelWid - parseInt(sp.find('label').css('padding-left'),10) + 'px'));
			}
		} 
	},
	/********************* Loading users of the folder - START *********************/
	loadUsersOfFolder: function(){
		vmf.ajax.connect({
			url: rs.url.folderSelectionUrl,
			data: "selectedFolderId="+rs.folderId,
			success: fd.onSuccess_loadUsers,
			error: fd.onFail_loadUsers,
			dataType: 'JSON'
		});
	},
	onSuccess_loadUsers: function(userjsonresponse) {
		$('#usersListPane .paneActionButton').show();
		$('#userDiv ul.icons').html("");
		if(userjsonresponse.error){
			// show exception message
			return;
		}
		var strHTML,
			i;

		for(i=0; i<userjsonresponse.userPaneContents.length; i++){
			var _userRole = '',
				_roleIconAttr = '',
				htm = "",
				getFId = rs.folderId;

			if(userjsonresponse.userPaneContents[i].superPermission && userjsonresponse.userPaneContents[i].procPermission && userjsonresponse.userPaneContents[i].folderAdmin && $('li.'+getFId).attr('level') != 0){
				_userRole='spa';
				htm='<a href="#" class="hreftitle" title="'+$staticTextforSUPUA+'">'+$staticTextforSUPUA+'</a>';
			}else if(userjsonresponse.userPaneContents[i].superPermission && userjsonresponse.userPaneContents[i].procPermission){
				_userRole='sp';
				htm='<a href="#" class="hreftitle" title="'+$staticTextforSUPC+'">'+$staticTextforSUPC+'</a>';
			}else if(userjsonresponse.userPaneContents[i].superPermission && userjsonresponse.userPaneContents[i].folderAdmin && $('li.'+getFId).attr('level') != 0){
				_userRole='sa';
				htm='<a href="#" class="hreftitle" title="'+$staticTextforSUA+'">'+$staticTextforSUA+'</a>';
			}else if(userjsonresponse.userPaneContents[i].procPermission && userjsonresponse.userPaneContents[i].folderAdmin && $('li.'+getFId).attr('level') != 0){
				_userRole='pa';
				htm='<a href="#" class="hreftitle" title="'+$staticTextforPUA+'">'+$staticTextforPUA+'</a>';
			}else if(userjsonresponse.userPaneContents[i].folderAdmin && $('li.'+getFId).attr('level') != 0){
				_userRole='ad';
				htm='<a href="#" class="hreftitle" title="'+$staticTextforA+'">'+$staticTextforA+'</a>';
			}else if(userjsonresponse.userPaneContents[i].superPermission){
				_userRole='s';
				htm='<a href="#" class="hreftitle" title="'+$staticTextforSU+'">'+$staticTextforSU+'</a>';
			}else if(userjsonresponse.userPaneContents[i].procPermission){
				if(_userRole==''){
					_userRole='p';
					htm='<a href="#" class="hreftitle" title="'+$staticTextforPC+'">'+$staticTextforPC+'</a>';
				}else{
					_userRole='sp';
					htm='<a href="#" class="hreftitle" title="'+$staticTextforSUPC+'">'+$staticTextforSUPC+'</a>';
				}
			}
			if(userjsonresponse.userPaneContents[i].managePermission && _userRole==''){
				_userRole = 'm';
			}

			if(_userRole != 'm'){
				_roleIconClass = 'class="'+_userRole+'"';
				_roleIconAttr = 'cRole="'+_userRole+'"';
			}else{
				_roleIconClass = 'class="fm"'; //Added "fm" by Tapas to know folder manager. Check this bug(BUG-00032115 307179)
				_roleIconAttr = 'cRole="fm"';
			}

			if(_userRole == ""){
				_roleIconClass = 'class="without_icon"';
			}
			$('#userDiv ul.icons').append($('<li id=\"'+userjsonresponse.userPaneContents[i].cN+'\" '+_roleIconClass+' val=\"'+userjsonresponse.userPaneContents[i].cN+'\" '+_roleIconAttr+'><label for=\"radio1\" class=\"userLabel\">'+ htm +' '+ userjsonresponse.userPaneContents[i].firstName + ' '+userjsonresponse.userPaneContents[i].lastName +'</label></li>').data({"email":userjsonresponse.userPaneContents[i].email}));						
		}
		$('ul.info_list').find('li#' + rs.selectedCustomerNumber).addClass('active');
		fd.adjustUserList();
	},
	onFail_loadUsers: function(){
		$('#userSelectionInfoDiv').removeClass('hidden');
	},
	/********************* Loading users of the folder - END *********************/

	/********************* Load Products summary datatable - START *********************/
	loadProductsDT: function(){
		vmf.datatable.build($('#productDetails'), {
            "aoColumns": [
				{"sTitle": "<span class='descending'>"+rs.dtHeadingProducts+"</span>", "sWidth":"63%"}, 
				{"sTitle": "<span class='descending'>"+rs.dtHeadingLicenses+"</span>", "sWidth":"18%"}, 
				{"sTitle": "<span>"+rs.dtHeadingTotQuanitity+"</span>","bSortable": false, "sWidth":"19%"}, 
				{"bVisible": false}, 
				{"bVisible": false}, 
				{"bVisible": false}],
            "bInfo": false,
            "bServerSide": false,
			"bAutoWidth" : false,
			"aaData": [],
			"bProcessing":true,
			"oLanguage": {
				"sProcessing" : "Loading...",
				"sLoadingRecords":""
			},
            "bPaginate": false,
            "sScrollY": 250,
            "sDom": 'zrtSpi',
            "bFilter": false
        });
		
		//BUG-00070874-added the page Name
		var postData = "param="+rs.folderId+"&iWantToSelection=viewLicense&pageName=folderPage";
		vmf.datatable.reload($('#productDetails'), rs.url.resourceProductSummaryUrl, fd.productsSummaryCallback, "POST", postData);
	},
	productsSummaryCallback: function(table, settings, _json){
		if(_json.error || !settings.fnRecordsTotal()){
			// error handling
			fd.clearTable("productDetails", rs.emptyProductsMsg);
		}else{
			// show the manage-keys button below the products datatable
			//$('#productsTblManageKeysBtn').show();
			fd.adjustPanesHt();
		}
	},
	clearTable: function(tableId,license_text){
		table = $('#'+tableId).dataTable();
		table.fnClearTable();
		table.find('tbody tr').css("height","150px").addClass('noborder default')
		     .find('td.dataTables_empty').html(license_text);
	},
	/********************* Load Products summary datatable - END *********************/

	/********************* Load Permissions pane - START *********************/
	loadPermissionsPane: function(){
		vmf.ajax.connect({
			url: $userSelectionUrl,
			data: "selectedFolderId="+rs.folderId+"&selectedCustomerNumber="+rs.selectedCustomerNumber,
			success: fd.onSuccess_loadPermissions,
			error: fd.onFail_loadPermissions,
			dataType: 'JSON',
			type: 'GET'
		});

		ice.requestAccessPermissions.init(rs.url.loadPermissionUrl, 
										  rs.url.submitReqPermissionUrl, 
										  rs.url.loadLicenseFolderViewUrl, 
										  rs.url.loggedUserInfoUrl, 
										  rs.editPermssionToolTipMsg);
	},
	/* Functions from manageAccessByFolder.js */
    // need to implement code for If user has all permissions, disable the "Request Permission"  functionality
	onSuccess_loadPermissions : function (folderjsonresponse) {
        var permissionLength = folderjsonresponse.permissionPaneContents.length;
        var permissionStatus = false;        
		var slectedFolderId = rs.folderId;
		$('#permissionsListPane .paneActionButton').show();
		$('#userPermissionPane').html('<ul><li></li></ul>');
		if(folderjsonresponse.error){
			// show exception message
			return;
		}
		if(!folderjsonresponse){
			$('#userPermissionPane').html('<ul><li class="staticmsg">' + $permissionPane_nodata +'</li></ul>');
			return;
		}
		var strHTML = '<table class="scrollTable">',
			i;
		strHTML += '<tbody class="scrollContent">';
		for(i=0; i<folderjsonresponse.permissionPaneContents.length; i++){
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
					strHTML += '<td class="col2"><img src="/static/myvmware/common/img/dot.png" title="'+ $staticTextfortick +'" />';
				}else{
					strHTML += '<td class="col2"><img src="/static/myvmware/common/img/cross.png" title="'+ $staticTextforcross +'" />';
				}
				//padlock folderjsonresponse.permissionPaneContents[i].isInherited ||
				if(!folderjsonresponse.permissionPaneContents[i].isLoggedInUserCanEdit){
					strHTML += '&nbsp;<img src="/static/myvmware/common/img/lock.png" height="16" width="14" title="'+ $staticTextforLock +'" />';
				}
				strHTML +='</td>';
				strHTML += '</tr>';
			}
		}
		for(i=0; i<folderjsonresponse.permissionPaneContents.length; i++){
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
					strHTML += '<td class="col2"><img src="/static/myvmware/common/img/dot.png" height="17" width="17" title="'+ $staticTextfortick +'" />';
				}else{
					strHTML += '<td class="col2"><img src="/static/myvmware/common/img/cross.png" height="17" width="16" title="'+ $staticTextforcross +'" />';
				}
				//padlock folderjsonresponse.permissionPaneContents[i].isInherited ||
				if(!folderjsonresponse.permissionPaneContents[i].isLoggedInUserCanEdit){
					strHTML += '&nbsp;<img src="/static/myvmware/common/img/lock.png" height="16" width="14" title="'+ $staticTextforLock +'" />';
				}
				strHTML +='</td>';
				strHTML += '</tr>';
			}
		}
		strHTML += '</tbody>';
		strHTML += '</table>';
		$('#userPermissionPane').html(strHTML);
        // to add disabled attribute
        for(var i=0; i<permissionLength;i++){
            if(!folderjsonresponse.permissionPaneContents[i].isSet){
                permissionStatus = true;
            }
        }
        if(!permissionStatus){
            $('#requestPermissionLink').attr('disabled','true');
            $('#requestPermissionLink').addClass('disabled');
        }
	},
    showExportDD : function() {
    // User Profile/alerts Drop down menu
		$profileDropDown = $(".fpExportDD .user_dropdown");
		$profileDropDown.hide();
		$profileDropDown.hover(
			function() {$(this).addClass('hovered');},
			function() {
				var cc = $(this);
				cc.removeClass('hovered');
				setTimeout(function(){if(!cc.hasClass('hovered')){cc.hide();}}, 500);
			}
		);
		$('.fpExportDD').hoverIntent(function() {
			$(this).find('.exportDD').addClass('opened');
			$(this).find('.user_dropdown').show();
		},function() {
			var cc = $(this);
			setTimeout(function(){
				if(!cc.find('.user_dropdown').hasClass('hovered')){
					$('.exportDD').removeClass('opened');
					cc.find('.user_dropdown').hide();
				}
			}, 500);
		});		
    },
	onFail_loadPermissions: function(){}

	/********************* Load Permissions pane - END *********************/
};
 myvmware.folderError = {
    init: function() {
        myvmware.folderDetails.attachEvents();
         myvmware.folderError.localizeLinks();
        ice.requestAccessPermissions.init(rs.url.loadPermissionUrl, 
										  rs.url.submitReqPermissionUrl, 
										  rs.url.loadLicenseFolderViewUrl, 
										  rs.url.loggedUserInfoUrl, 
										  rs.editPermssionToolTipMsg);
       if (rs.userHasNoPermissionToSeeTheFolderflag) {
            myvmware.folderDetails.attachRequestPermissionEvent();	
			callBack.addsc({'f':'riaLinkmy','args':['my-licenses : folder-details : no-permissions']});		
       }else if(rs.folderDeletedMessageflag){
			callBack.addsc({'f':'riaLinkmy','args':['my-licenses : folder-details : folder-deleted']});
	   }else if(rs.userRemovedFromEAflag){
			callBack.addsc({'f':'riaLinkmy','args':['my-licenses : folder-details : no-ea-access']});
	   }
    },
    localizeLinks:function(){
    	var locale = $('#localeFromLiferayTheme').text().split("_");
        var currentLocale = (locale[0].toLowerCase() == 'en') ? 'en' : locale[1].toLowerCase();
        
        $("#seeAllFolderBtn").attr("href", '/'+currentLocale+'/group/vmware/my-licenses');     
        $("#myVmwareBtn").attr("href", '/'+currentLocale+'/group/vmware/home');
 
    }
};