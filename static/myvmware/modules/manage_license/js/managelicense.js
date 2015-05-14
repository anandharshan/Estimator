vmf.ns.use("ice");
VMFModuleLoader.loadModule("resize", function() {});
var selectedFolderCount = null ;  //to resolve "uncaught ReferenceError: selectedFolderCount is not defined" -- rvooka
ice.managelicense = {
	eaLabelsAssociated:null,
	eaLabelArr: [],
	removeLabelIdArr:[],
	eaLabelsFlag: false,
	dropHtml:'',
	clkcancel: false,
	rclholder: '',
	portletNs:null,
	resourceUrlProductSummary:null,
	resourceDetailPageURL:null,
	tabDetailOrderUrl:null,
	tabDetailSupportUrl:null,
	resourceUrl:null,
	selectAtleastOne:null,
	portletUrl:null,
	selectMoreThanOne:null,
	previewConfirmationUrl:null,
	preDowngradeVI3OrdersUrl:null,
	viewMoveKeyUrl:null,
	filterLicenseContentMsg:null,
	filterLicenseKeyDataUrl:null,
	urlProductSummary:null,
	urlLicenseDetail:null,
	urlOrderDetail:null,
	urlSupportDetail:null,
	producteaaData:null,
	previlagedUser:null,
	emailOfSuperUser:null,
	licenseaaData:null,
	splContractData:null,
	tbl:null,
	nTr:null,
	tableId:null,
	newRowRender:null,
	lkey:null,
	totcount:null,
	cplContract:null,
	totcountOrder:null,
	licenseKey:null,
	productId:null,
	loadFilter:null,
	licenseHistoryUrl:null,
	saveNoteUrl:null,
	viewContractDetailsUrl:null,
	successGetRowDataSupport:null,
	successGetRowDataSupportMsg:null,
	alertId:null,
	deactivateLicenseKeyPageUrl:null,
	loadingFlag:null,
	saveNoteGlobal:null,
	editNoteGlobal:null,
	supportLevelGlobal:null,
	endDateGlobal:null,
	expireGlobal:null,
	quantityGlobal:null,
	qtyHeaderGlobal:null,
	contractNumberGlobal:null,
	orderNumberGlobal:null,
	orderDateGlobal:null,
	poNumberGlobal:null,
	addNoteGlobal:null,
	viewLicenseHistoryGlobal:null,
	licenseKeysGlobal:null,
	licenseFolderGlobal:null,
	greyedOutFolderTooltip:null,
	productsGlobal:null,
	totalQuantityGlobal:null,
	filterGlobal:null,
	licensesGlobal:null,
	viewProductGlobal:null,
	viewLicensesGlobal:null,
	viewLicensesASP:null,
	alertText1:null,
	alertText2:null,
	alertText3:null,
	alertText4:null,
	alertText5:null,
	greyedOutLicenseMoveLicense:null,
	folderPermissionUrl:null,
	moveKeyNoPermission:null,	
	combineGreyedOutLicense:null,	
	divideGreyedOutLicense:null,	
	upgradeGreyedOutLicense:null,
	downgradeGreyedOutLicense:null,
	upgradeV3GreyedOutLicense:null,
	errSingleLicenseMsg:null,
	errRestrictedDowngradeMsg:null,
	selectedAllFoldersId:null,
	regexAddFolder:null,
	invalidFolderMsg:null,
	licHeaderData:null,
	qtyHeaderData:null,
	tableId:"licenseDetail",
	prevTableId:"licenseDetail",
	placeHolderFormat: 'YYYY-MM-DD',
	folderpathWithoutSlash:null,
	istooltipDisplayed:null,
	filterCall:false,
	filterErrorMsg:null,
	alertData:[],
	isRestrictDwngrdProd:null,
	createFolderFlg:null,
	pageTitle: null,
	licenseKeyCountURL:null,
	licenseKeyView: null,
	combineActionCount: 0,
	upGradeActionCount: 0,
	downGradeActionCount: 0,
	originalLicensePHt: 0,
	warningMsgOn: false,
	init: function (portlet,rUrlProdSum,rDetPagUrl,tabDtlOrdUrl,tabDtlSupUrl,tabFilterUrl,rUrl,selAtlOne,portUrl,selMThanOne,preConfirmUrl,vMovKeyUrl,licenseContentMsg,historyUrl,noteSaveUrl,filterKeyDataUrl,contractDetailsUrl, preDowngradeUrl, preUpgradeUrl, preDowngradeVI3Orders, deactivateUrl, saveNoteText,editNoteText,supportLevelText,endDateText,expireText,quantityText,qtyHeaderText,contractNumberText,orderNumberText,orderDateText,poNumberText,addNoteText,viewLicenseHistory,licenseKeysText,licenseFolderText,productText,totalQuantityText,filterText,licensesText,viewProductText,viewLicenseText,viewLicenseTextASP,topLink1,topLink2,topLink3,topLink4,topLink5,alertTxt1,alertTxt2,alertTxt3,alertTxt4,alertTxt5,greyedOutFolderTooltipMsg,greyedOutLicenseMoveLicenseMsg,moveKeyNoPermissionMsg,combineGreyedOutLicenseMsg,divideGreyedOutLicenseMsg,upgradeGreyedOutLicenseMsg,downgradeGreyedOutLicenseMsg,upgradeV3GreyedOutLicenseMsg,flexLink,errSingleLicense,errRestrictedDowngrade,keyCount) {
		vmf.scEvent = true;
		callBack.addsc({'f':'riaLinkmy','args':['my-licenses']});
		portletNs = portlet;
		loadFilter = tabFilterUrl;
		resourceUrlProductSummary = rUrlProdSum;
		resourceDetailPageURL = rDetPagUrl;
		urlLicenseDetail = rDetPagUrl;
		tabDetailOrderUrl = tabDtlOrdUrl;
		tabDetailSupportUrl = tabDtlSupUrl;
		resourceUrl = rUrl;
		selectAtleastOne = selAtlOne;
		portletUrl = portUrl;
		selectMoreThanOne = selMThanOne;
		previewConfirmationUrl = preConfirmUrl;
		preDowngradeConfirmUrl = preDowngradeUrl;
		preUpgradeConfirmUrl = preUpgradeUrl;
		preDowngradeVI3OrdersUrl = preDowngradeVI3Orders;
		viewMoveKeyUrl = vMovKeyUrl;
		filterLicenseContentMsg = licenseContentMsg;
		licenseHistoryUrl = historyUrl;
		saveNoteUrl = noteSaveUrl;
		viewContractDetailsUrl = contractDetailsUrl;
		filterLicenseKeyDataUrl = filterKeyDataUrl;
		deactivateLicenseKeyPageUrl = deactivateUrl;
		greyedOutFolderTooltip = greyedOutFolderTooltipMsg;
		greyedOutLicenseMoveLicense = greyedOutLicenseMoveLicenseMsg;
		moveKeyNoPermission = moveKeyNoPermissionMsg;
		saveNoteGlobal=saveNoteText;
		editNoteGlobal=editNoteText;
		supportLevelGlobal=supportLevelText;
		endDateGlobal=endDateText;
		expireGlobal=expireText;
		quantityGlobal=quantityText;
		qtyHeaderGlobal=qtyHeaderText;
		contractNumberGlobal=contractNumberText;
		orderNumberGlobal=orderNumberText;
		orderDateGlobal=orderDateText;
		poNumberGlobal=poNumberText;
		addNoteGlobal=addNoteText;
		viewLicenseHistoryGlobal=viewLicenseHistory;
		licenseKeysGlobal=licenseKeysText;
		licenseFolderGlobal=licenseFolderText;
		productsGlobal=productText;
		totalQuantityGlobal=totalQuantityText;
		filterGlobal=filterText;
		licensesGlobal=licensesText;
		viewProductGlobal=viewProductText;
		viewLicensesGlobal=viewLicenseText;
		viewLicensesASP=viewLicenseTextASP;
		combineGreyedOutLicense = combineGreyedOutLicenseMsg;
		divideGreyedOutLicense = divideGreyedOutLicenseMsg;
		upgradeGreyedOutLicense = upgradeGreyedOutLicenseMsg;
		downgradeGreyedOutLicense = downgradeGreyedOutLicenseMsg;
		upgradeV3GreyedOutLicense = upgradeV3GreyedOutLicenseMsg;
		errSingleLicenseMsg=errSingleLicense;
		errRestrictedDowngradeMsg=errRestrictedDowngrade;
		istooltipDisplayed = false;
		licenseKeyCountURL=keyCount;
		licenseKeyView = false;
		alertId = 0;
		selectedAllFoldersId = '';
		loadingFlag = false;
	        alertText1 = alertTxt1;
		alertText2 = alertTxt2;
		alertText3 = alertTxt3;
		alertText4 = alertTxt4;
		alertText5 = alertTxt5;
		ice.managelicense.pageTitle = document.title;
		ice.managelicense.uiSession = [];
		ice.managelicense.uiSession.prodId = "";
		regexAddFolder = /^[a-zA-Z0-9!@%&_=\.\+\-\(\)\^\#\$\s]*$/g;/*Regex for validating folder name for Create Folder*/
		invalidFolderMsg = '<div class=\"textRed\">'+ice.globalVars.invalidFolderMsg+'   \!\@\#\$\%\^\&\(\)\-\=\+\. \{space\}</div>';			
		var $keyManagement = $('#keyManagement');
		ice.managelicense.getDeActivateInfoAndLoad();
		//$.get(loadFilter); //not loading filter form here
		/* exposed filter - comment

		ice.managelicense.loadFilter();
		$('#licenseKeyFilterForm input').live('focusin',function () {$('#applyfilter').attr('disabled', false).removeClass('secondary').addClass('primary');});	
		$('#productName, #orderDateFrom,#orderDateTo, #contractEndDateFrom,#contractEndDateTo').live('change', function () {
			$('#applyfilter').attr('disabled', false).removeClass('secondary').addClass('primary');
		});
		
		exposed filter - comment */
		// Change the module which is displayed when the drop down value changes.
		$keyManagement.find('.content').not('#' + $('#sel_wantTo').val()).hide(); // Hide all but the currently selected module in the drop down.
		$keyManagement.find('header p').not('.' + $('#sel_wantTo').val()).hide(); // Hide all but the currently selected paragraph.
		/* exposed filter - comment

		$('#showFilter').unbind('click').bind('click',function(){
			$t = $(this);
			$('#filterAreaDiv').slideToggle('fast',function() {
				if($t.html().charAt(0)=='-'){$t.html($t.html().replace('-','+'))}
				else{$t.html($t.html().replace('+','-'))};
				ice.managelicense.adjustHt(true);
			});
			return false;
		});
		
		exposed filter - comment */
		$('#selectMoreThanOne_ok').click(function () {vmf.modal.hide();});
		if($('#sel_wantTo').val() == 'upgradeLicense') {		//BUG-00028484
			$("div.vi3DowngradeLink").hide();
			//$("button#exportAllToCsvButton").attr("disabled", "disabled").addClass('disabled'); // BUG-00046403
			$("button#exportAllToCsvButton").hide();
			$("button#showAllUpgradeOptionsButton").show();
			$(".filter-section-header",$("#keyManagement")).html(upgradeStepOne);
			ice.managelicense.tableId="licenseDetailUpgrade"; 
		}
		if($('#sel_wantTo').attr('disabled')) { // BUG-00047104  //tshaik
			//$("button#exportAllToCsvButton").attr("disabled", "disabled").addClass('disabled');
			$("button#exportAllToCsvButton").hide();
			$("button#showAllUpgradeOptionsButton").hide();
		} else {
			//$("button#exportAllToCsvButton").removeAttr('disabled').removeClass('disabled');
			$("button#exportAllToCsvButton").show();
			$("button#showAllUpgradeOptionsButton").show();
		}
		$('#sel_wantTo').change(function () {        	
			if(($('#sel_wantTo').val() == "viewLicense")) {//BUG-00047103
				$('#exportToCsv').removeClass('disableMenu').parent('li').removeClass('inactive'); //tshaik
				$('#export_to_CSV').removeClass('disableMenu').parent('li').removeClass('inactive'); //tshaik			   
			}
		   else {
		          
				$('#exportToCsv').addClass('disableMenu').parent('li').addClass('inactive'); //tshaik
				$('#export_to_CSV').addClass('disableMenu').parent('li').addClass('inactive'); //tshaik			   
		   }
			var emptyTableMsg="";
			$('.beak_tooltip_flyout_def').hide();
			$("#currentProductName, div.rightaligned_link").hide();
			//SFF- Hide upgrade options and toggle button for upgrade options 			
			$("#upgradeOptionsContainer,#selectedOptionsContainer,a.togUpgradeOptions").hide();

			if($('#sel_wantTo').val() != "viewLicense"){ice.managelicense.handleContinueBtn('show','disabled');} 
			else {ice.managelicense.handleContinueBtn('hide','disabled');}
			//Fixed BUG-00026241(remove the Licenses Tutorial hyper link)
			$("header div.topBar a#downgradeVI3").hide();
			$("header div.topBar a#licenseVI3").show();
			//$("button#exportAllToCsvButton").attr("disabled", "disabled").addClass('disabled'); // BUG-00046403
			$("button#exportAllToCsvButton").hide();
			$("button#showAllUpgradeOptionsButton").hide();
			switch($('#sel_wantTo').val()) {
				case 'combine':
					$(".filter-section-header",$keyManagement).html(combineStepOne);
					ice.managelicense.tableId="licenseDetailCombine";
					emptyTableMsg=ice.globalVars.noCombineMsg;
					break;
				case 'divide':
					$(".filter-section-header",$keyManagement).html(divideStepOne);
					ice.managelicense.tableId="licenseDetailDivide";
					emptyTableMsg=ice.globalVars.noDevideMsg;
					break;
				case 'move':
					$(".filter-section-header",$keyManagement).html(moveStepOne);
					ice.managelicense.tableId="licenseDetailMove";
					emptyTableMsg=ice.globalVars.noMoveMsg;
					break;
				case 'viewLicense':
					//$("button#exportAllToCsvButton").removeAttr('disabled').removeClass('disabled'); // BUG-00046403
					$("button#exportAllToCsvButton").show();
					$(".filter-section-header",$keyManagement).slideUp();
					ice.managelicense.tableId="licenseDetail";
					emptyTableMsg=ice.globalVars.noViewMsg;
					break;
				case 'downgradeLicense':
					$("div.topBar a#downgradeVI3").show();
					$("div.topBar a#licenseVI3").hide();
					$(".filter-section-header",$keyManagement).html(downgradeStepOne);
					ice.managelicense.tableId="licenseDetailDowngrade";
					emptyTableMsg=ice.globalVars.noDowngradeMsg;
					break;
				case 'upgradeLicense':
					$("button#showAllUpgradeOptionsButton").show();
					$(".filter-section-header",$keyManagement).html(upgradeStepOne);
					ice.managelicense.tableId="licenseDetailUpgrade";
					emptyTableMsg=ice.globalVars.noUpgradeMsg;
					break;
			}
			if (ice.managelicense.prevTableId=="licenseDetailDowngrade" || ice.managelicense.prevTableId=="licenseDetailUpgrade" || ice.managelicense.tableId=="licenseDetailUpgrade" || ice.managelicense.tableId=="licenseDetailDowngrade" || (ice.managelicense.uiSession.prodId!="")){
				if($._selectedFolders.entries().length){
					$('.dropdown li').addClass('inactive');
					 $('#findFolder').parent('li').removeClass('inactive');
					var productSummaryURL = resourceUrlProductSummary +'&iWantToSelection=' + $('#sel_wantTo').val();
					ice.managelicense.folderTreeCBSelected(productSummaryURL, $._selectedFolders.keys(), null, null, resourceDetailPageURL, tabDetailOrderUrl,tabDetailSupportUrl);
				}else{
					ice.managelicense.sessionTimeOutExtend();
				}
			}else{
				if($._selectedFolders.entries().length && $('#licenseDetail').is(':visible')){
				$("#currentProductName").show();
				istooltipDisplayed=false; //this is to enable tooltip
				ice.managelicense.RefreshTable('licenseDetail',licenseaaData);
				ice.managelicense.buildAlertInfo();
				} else if ($("div.splcontract").is(':visible')){
					$("#currentProductName").show();
				} else if($._selectedFolders.entries().length && $('#productSummary .dataTables_empty').is(':visible') && $('#productSummary .dataTables_empty').text()!=ice.managelicense.filterErrorMsg){
					ice.managelicense.clearTable("productSummary",emptyTableMsg);
				}
				ice.managelicense.sessionTimeOutExtend();
			}
			ice.managelicense.adjustHt();
			ice.managelicense.prevTableId=ice.managelicense.tableId;
		});
		$('#listFolderPath').live('change',function(){
			if($(this).val() != 'null'){
				 $('#moveFolderNext').removeAttr('disabled').removeClass('disabled');
			}else{
				$('#moveFolderNext').attr('disabled','disabled').addClass('disabled');
			}
			ice.managelicense.populateTargetFolder();
		});
		$('#listFolderPathCreate').live('change',function(){
			if($(this).val() != 'null'){
				 $('#confirm').removeAttr('disabled').removeClass('disabled');
			}else{
				$('#confirm').attr('disabled','disabled').addClass('disabled');
			}
		});
		$keyManagement.find('.fn_editNote,.fn_editlabels').die('click').live('click',function(eve){			
			var licenseKey = $(this).closest('tr').prev('tr').find('.key').html(), $this = $(this), $next="", note=$(this).closest('tr').data("fNotes");			
			ice.managelicense.expandLicenseKey($(this).closest('tr').prev('tr').find('a.openClose'),true,$this);
			eve.preventDefault();
		});
		$(".note-wrapper .sNote").live('click',function(){
			if ($(this).hasClass("open")) return;
			ice.managelicense.showFullNotes($(this));
			ice.managelicense.expandLicenseKey($(this).closest('tr').prev('tr').find('a.openClose'),false,$(this));
		});
//Start of create ,delete, find,move, rename folders
		$('.dropdown a').click(function(){  // new logic for create ,delete, find,move, rename folders (gear) -rvooka
			$i = $('.dropdown a').index($(this));
			var targetDetailsObj = {fPath :$('#fullFolderPath').val(),fId :$('#folderId').val(),fName:$('#selectedFolderName').val(),parentfId:$('#parentFolderId').val()};
			if( ($i == 6) || ($i == 7) || (!($(this).hasClass('disableMenu')) && (selectedFolderCount && selectedFolderCount == 1 )) || ($i == 2 && ice.managelicense.createFolderFlg) || ($i == 0 && !$(this).hasClass('disableMenu')) || ($i == 1 && !$(this).hasClass('disableMenu'))){
				switch ($i) {
					case 0 : //Add User
						ice.managelicense.populateAddUserUI(targetDetailsObj);
						break;
					case 1 : //Share Folder
						ice.managelicense.populateShareFolder(targetDetailsObj);
						break;
					case 2 : //Create folder
						ice.managelicense.populateAddFolderUI(targetDetailsObj);
						break;
					case 3: //Delete folder
						ice.managelicense.populateDeleteFolderUI(targetDetailsObj);	
						break;
					case 4 :	//Rename folder
						ice.managelicense.populateRenameFolderUI(targetDetailsObj);
						break;
					case 5:	//Move folder
						ice.managelicense.populateMoveFolderUI(targetDetailsObj);
						break;
					case 6 : //Find folder
						vmf.modal.hide();
							setTimeout(function(){
							vmf.modal.show('findFolderContent',{focus:false});
							myvmware.common.putplaceHolder('.searchInput');},10);
						break;
					case 7 : // Export to CSV from action menu
						ice.managelicense.exportToCSV(targetDetailsObj,true);
						break;
				}	
			};
			return false;	
		})
		$('#confirm').click(function() {
			ice.managelicense.confirmAddFolder();
			if(typeof(riaLinkmy) == "function"){
				riaLinkmy("license-keys : create-folder : confirm");
			}
		});
		$('#createFolderTable #newFolderId').keypress(function(e){
			if(e.which == 13){
				$(this).addClass('waitcursor');
				$('#confirm').trigger('click');
			}
		});
		$('#renameConfirm').click(function() {
			ice.managelicense.confirmRenameFolder();
			if(typeof(riaLinkmy) == "function"){
				riaLinkmy("license-keys : rename-folder : confirm");
			}
		});
		$('#deleteFolderConfirm').click(function() {ice.managelicense.confirmDeleteFolder();});
		$('#moveFolderconfirm').click(function() {ice.managelicense.confirmMoveFolder();});
		$('#moveFolderNext').click(function() {
			if ($("#listFolderPath").val()=="null") {
				$('.error').html(ice.globalVars.selectFolder);
				return false;
			} else {
				vmf.modal.hide();
				$('.error').html('');
				setTimeout(function(){ice.managelicense.populateConfirmMoveFolderUI();},10);// to show the second popup from the first popup
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
			setTimeout(function(){ice.managelicense.populateMoveFolderUI(targetDetailsObj);},10);// to show the second popup from the first popup
		});
	//End of create ,delete, find,	move, rename
	/*Start of Add User Events*/
		$('#addUserMain #btn_next,#btn_invite,#sFConfirm,#shareMultiBtn').click(function() {
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
					ice.inviteUser.handleFolderTree($portletNs,$resourceUrl);
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
				$('#btn_next', $("#addUserMain")).removeAttr("disabled", "disabled").removeClass('disabled').addClass('button');
			}else{		
				$('#btn_next', $("#addUserMain")).attr("disabled", "disabled").removeClass('button').addClass('disabled');
			}
		});
		$('#confirm_addUser').click(function() {ice.licensefolderview.confirmAddUser();});
		$('#btn_cancel7').click(function() {ice.licensefolderview.backToAddUser();});
		/*End of Add User Events*/
        //Fix for BUG-00015826
        $(".modalContent .fn_cancel").click(function(){
            vmf.modal.hide();
            $('.modalContent .button').uncorner();
            return false;
        });
		ice.managelicense.producteaaData=[];
		$(".filter-section-header",$("#keyManagement")).slideUp();
		if($('#sel_wantTo').val() != "viewLicense") ice.managelicense.handleContinueBtn('show','disabled');
		//$('#sel_wantTo option:first-child').attr("selected", "selected");
		ice.managelicense.buildProductSummaryTable();
		$('a.kb_article_726').die('click').live('click',function(e){
			myvmware.common.openHelpPage('http://kb.vmware.com/kb/2015726?plainview=true');
			e.preventDefault();
		});
		//reports
		 $('#exportAllToCsvButton').click(function() {
			var _fPerPostData = new Object();
			_fPerPostData['selectedFolders'] = "ALL";
			_fPerPostData['reportFor'] = 'licenseKeysFromExportAll';
			myvmware.common.generateCSVreports($exportToCsvFromLicensesUrl, _fPerPostData, "license-keys : export-all", "license-keys : Export-to-CSV : Error");
			//myvmware.common.generateReports($exportToCsvFromLicensesGetUrl + '&reportFor=licenseKeysFromExportAll&folderId=ALL')
		});		
		$('#showAllUpgradeOptionsButton').click(function() {
			var _fPerPostData = new Object();
			_fPerPostData['selectedFolders'] = "ALL";
			_fPerPostData['reportFor'] = 'showAllUpgradeOptions';
			myvmware.common.generateCSVreports($showAllUpgradeOptionsUrl, _fPerPostData, "license-keys : show-all-upgrade-options", "license-keys : Show-All-Upgrade-Options : Error");
			//myvmware.common.generateReports($showAllUpgradeOptionsUrl + '&reportFor=showAllUpgradeOptionsUrl&folderId=ALL')
		});
		$('#exportEligibleLicenseKeysLink').click(function() {
			var licenseKeysQtys; 
			/*var _fPerPostData = new Object();
			_fPerPostData['selectedFolders'] = "ALL";
			_fPerPostData['reportFor'] = 'licenseKeysFromExportAll';
			_fPerPostData['optionSelected'] = myvmware.managelicenses.selectedOption;
			if( (_fPerPostData['optionSelected']!==-1) && !myvmware.managelicenses.isManyFromProducts){	
				 licenseKyesQtys = myvmware.managelicenses.common.getUpgradeLicenseQtyString();			
				_fPerPostData['licForUpgrade'] = licenseKyesQtys;
			}*/			
            //vmf.ajax.post($downloadCsvOfEligibleLicenseKeysUrl, _fPerPostData, null, null, null);
            //Standard implementation with url returned back
			//myvmware.common.generateCSVreports($downloadCsvOfEligibleLicenseKeysUrl, _fPerPostData, "license-keys : export-all", "license-keys : Export-to-CSV : Error");
			//With Get URL 
			if( (myvmware.managelicenses.selectedOption!==-1) && !myvmware.managelicenses.isManyFromProducts){	
				licenseKeysQtys = myvmware.managelicenses.common.getUpgradeLicenseQtyString(true);	
				myvmware.common.generateReports($downloadCsvOfEligibleLicenseKeysUrl + '&selectedFolders=ALL&reportFor=licenseKeysFromExportAll&optionSelected='+myvmware.managelicenses.selectedOption+'&licForUpgrade='+licenseKeysQtys);
			}else{
				myvmware.common.generateReports($downloadCsvOfEligibleLicenseKeysUrl + '&selectedFolders=ALL&reportFor=licenseKeysFromExportAll&optionSelected='+myvmware.managelicenses.selectedOption);
			}
			
		});
				
		/*Resizing Panes CR Start*/
		setTimeout(function(){
			vmf.splitter.show('mySplitter',{
				type: "v",
				sizeLeft:parseInt($("#ltSec").width(),10),
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
				resizeTo: window,
				accessKey: "H",
				minTop:80,
				minBottom:($(window).width()>=1600 || $(window).height()>800)?215:182
			});
		},1);
		/*Resizing Panes CR End*/
		/* Getting License key count*/
		ice.managelicense.combineActionCount = $('input#licenseCombineCount').val();
		ice.managelicense.upGradeActionCount = $('input#licenseUpgradeCount').val();
		ice.managelicense.downGradeActionCount = $('input#licenseDowngradeCount').val();
		/*CR 15768 Tooltips Changes*/
		myvmware.common.showMessageComponent('LICENSE');		
		myvmware.common.setOverlayPosition();
		ice.managelicense.setMessagesPosition();
		var doit;
			$(window).resize(function(){
			  clearTimeout(doit);
			  doit = setTimeout(function(){
				if($('.modalOverlay').length){
					myvmware.common.setOverlayPosition();
					ice.managelicense.setMessagesPosition();
				}
			  }, 100);
			});
		/*End of CR 15768 Tooltips Changes*/
        
          /* init invoke moved from licenseHome.jsp */
          myvmware.managelicenses.init();
        
    },//End if init
	buildProductSummaryTable: function(){
		vmf.datatable.build($('#productSummary'), {
            "aoColumns": [
				{"sTitle": "<span class='descending'>"+productsGlobal+"</span>", "sWidth":"63%"}, 
				{"sTitle": "<span class='descending'>"+licensesGlobal+"</span>", "sWidth":"18%"}, 
				{"sTitle": "<span>"+totalQuantityGlobal+"</span>","bSortable": false, "sWidth":"19%"}, 
				{"sTitle": "<span class='descending'>"+ice.globalVars.productIdLbl+"</span>"}, 
				{"sTitle": "<span class='descending'>"+ice.globalVars.alertIdLbl+"</span>"}, 
				{"sTitle": "<span class='descending'>"+ice.globalVars.secondaryProductsLbl+"</span>"}],
            "bInfo": false,
            "bServerSide": false,
			"bAutoWidth" : false,
            "aaData": ice.managelicense.producteaaData,
			"bProcessing":true,
			"oLanguage": {
				"sProcessing" : ice.globalVars.loadingLbl,
				"sLoadingRecords":"",
				"sEmptyTable": viewProductGlobal
			},
            "bPaginate": false,
            "sPaginationType": "full_numbers",
            "sScrollY": 150,
            "sDom": 'zrtSpi',
            "bFilter": false,
			"fnRowCallback":function(nRow,aData,iDisplayIndex){
				settings= this.fnSettings();
				if(settings.jqXHR && settings.jqXHR.responseText!==null && settings.jqXHR.responseText.length && typeof settings.jqXHR.responseText =="string"){
					jsonRes = vmf.json.txtToObj(settings.jqXHR.responseText);
					ice.managelicense.producteaaData=jsonRes.aaData;
					emailOfSuperUser=jsonRes.emailOfSuperUser;
					var newHtml=new Array(), secProduct=$.trim(aData[5]);
					newHtml.push($.trim(aData[0]));
					if(secProduct.length){
						if(secProduct.length > 40){
							newHtml.push('<p class="secondary" title="'+secProduct+'">'+secProduct.substring(0,39)+'...</p>');
						} else {
							newHtml.push('<p class="secondary">'+secProduct+'</p>');
						}
					}
					if (parseInt(aData[4],10) > 0 && $('#sel_wantTo').val() == "upgradeLicense"){
						//if(jsonRes.PUORSU){
							newHtml.push('<span class="action">'+ice.globalVars.actionRequired+'</span>');
						//}//Removing the condition as per CR232 + BUG-00031526
					}
					
					$(nRow).data("productId",aData[3])
							.data("alertId", aData[4])
							.attr('id' , 'prodId'+aData[3])
							.find('td:eq(0)').html(newHtml.join(' '));
					newHtml=[];
					if(aData[1]>500){
						$('td:eq(1)', nRow).data('licKeyCount',aData[1]).html($('.prodLinkMsg').html());
						$('td:eq(1)', nRow).find('a.licenseKeys').die('click').live('click',function(e){
							e.stopPropagation();
							var currTd = $(this).closest('td'), currTr = $(this).closest('tr') , totalQty =currTd.next('td'),productId = currTr.data("productId"), _postData = new Object(); 
							currTd.html("<div class=\"loading_small\">&nbsp;</div>");
							_postData['folderId'] = selectedAllFoldersId.join(','); 
							_postData['productGrpId'] = productId;
							vmf.ajax.post($folderLicenseKeyCountUrl,_postData,ice.managelicense.onSuccessGetKeyCount(currTd,currTr,totalQty),ice.managelicense.onFailKeyCount);	
						});
						
					}
					
				}
				return nRow;
			},
            "fnDrawCallback": function(){
				$(this.fnGetNodes()).addClass("clickable");
				//Hide  'licenses' and 'total qty' columns for special contract folders :: BUG-00026755		
				if ($("#folderPane input:checkbox:checked").data("folderType")!=undefined){
					this.fnSetColumnVis(1,false);
					this.fnSetColumnVis(2,false);
				} else {
					this.fnSetColumnVis(1,true);
					this.fnSetColumnVis(2,true);
				}
				this.fnSetColumnVis(3,false);
				this.fnSetColumnVis(4,false);
				this.fnSetColumnVis(5,false);
				if(this.closest('div.dataTables_scrollBody')[0] && this.closest('div.dataTables_scrollBody').attr('style').toLowerCase().indexOf('overflow')!=-1){
					this.closest('div').css("overflow-y","scroll");
					setTimeout(function() {$tbl.fnAdjustColumnSizing(false);}, 500);
				}
				if ($(this).find('tbody tr').length ==1 && $(this).find('tbody tr td').hasClass('dataTables_empty')){
					$(this).find('tbody tr').css("height","150px").addClass('noborder default');
				}
			},
            "fnInitComplete": function () {
				$tbl=this;
				myvmware.hoverContent.bindEvents($('a.tooltip1'), 'epfunc');
				var msg="", folType;
				folType=$("#folderPane input:checkbox:checked").data("folderType");
				if (folType!=undefined && folType=="ASP"){
					msg=viewLicensesASP;
				} else {
					msg=viewLicensesGlobal;
				}
				$('#productMessage .message_container').html(msg).show();
				if($("#loadingText").length){
					$("#loadingText").remove();
					$('#productMessage .message_container').show();
				}
				$(this).find('tbody tr:not(".default")').die('click').live('click',function () {
					if($(this).hasClass("default")) return;
					productId = $(this).data("productId");
					alertId = $(this).data("alertId");
					$('#productSummary tbody tr').removeClass('selected');
					$(this).addClass('selected');
					$pName="<span>"+$(this).find('td:eq(0)').clone().find("p, span").remove().end().text()+"</span>";
					//SFF- Adding 'toggle upgrade options' link 
					$pName= ($(".togNotes,.togUpgradeOptions",$("#currentProductName")).length) ? $pName + ice.managelicense.outerHTML($(".togNotes,.togUpgradeOptions",$("#currentProductName"))) : $pName + "<a class=\"togUpgradeOptions\" style=\"display:none;\"> - "+mlRS.upgradeLicense.txt.hideUpgradeOptions+"</a>"+"<a class=\"togNotes\"> - "+$hideNotes+"</a>";
					$('#currentProductName').html($pName);
					if($(this).children('td:eq(1)').find('a').length){
						ice.managelicense.licenseKeyView = true;
					}
					ice.managelicense.getLicenseListByProductJSONPost(productId, alertId);
					/*CR15768 - Tooltip changes*/
					myvmware.common.setBeakPosition({
						beakId:myvmware.common.beaksObj["Q1_BEAK_LICENSE_PAGE_FOR_FILTER"],
						beakName:"Q1_BEAK_LICENSE_PAGE_FOR_FILTER",
						beakHeading:$licenseBeakHeadingFilter,
						beakContent:$licenseBeakContentFilter,
						target:$('#showFilter'),
						beakLink:'#row1',
						isFlip:true
					});
					/*End of CR15768 - Tooltip changes*/
					
				});
				$("a.togNotes", $("#licenseDivider header")).die('click').live('click',function(){
					($(this).hasClass("show"))? $(this).html("- "+$hideNotes) : $(this).html("+ "+$showNotes);
					var nRows=$("#licenseDetail tr.dynamicRow");
					if (nRows.length) nRows.find("div.note-wrapper .note").toggle();
					$(this).toggleClass("show");
					ice.managelicense.adjustHt();
				});
				//SFF- Handle toggling the display of upgrade options 
				$("a.togUpgradeOptions", $("#licenseDivider header")).die('click').live('click',function(){
					($(this).hasClass("show"))? $(this).html("- " + mlRS.upgradeLicense.txt.hideUpgradeOptions) : $(this).html("+ " + mlRS.upgradeLicense.txt.showUpgradeOptions);					
					$("#upgradeOptionsContainer").toggle();
					$(this).toggleClass("show");
					ice.managelicense.adjustHt();
				});
				ice.managelicense.adjustHt();
				setTimeout(function(){ice.managelicense.selectProd();},500);
            }
        });
	},
	onSuccessGetKeyCount: function(targetTd,targetTr,totalQtyTd){
		return function(data){
			var json=(typeof data!="object")?vmf.json.txtToObj(data):data;
			targetTd.html(json.licenseCount);
			totalQtyTd.html(json.totalQuantity);
			if(!targetTr.hasClass('selected')){
				targetTr.trigger('click');
			} else{
				if($('#licenseDetail tbody tr:first').find('.warning_big').length){
					$('#licenseDetail tbody tr:first').remove();
				}
				$('#licenseDetail tbody tr:last').remove();
				var keyVal = $('#productSummary').find('tr.selected td:eq(1)').html();
				var alertMoreLicense1 = "<tr><td colspan='4' style='text-align:center'><div class=''>"+ice.globalVars.totalKeyNumberMsg+"</div><span style='text-align:center;font-size:16px;'>"+keyVal+"</span></td></tr>";
				$("#viewLicense table > tbody > tr:last").after(alertMoreLicense1);
			}
		}
	},
	onFailKeyCount:function(){
		//console.log(error)
	},
	outerHTML: function($this){
		return $('<div></div>').html($this.clone()).html();
	},
	expandLicenseKey: function($a,edittrue,elm,saveTrue){
		nTr = $a.closest('tr')[0];
		licenseKey = $a.prev('input').attr('value');
		//Open this row 
		if ($a.hasClass('open') && nTr.haveData){
			if(elm.hasClass('fn_editlabels') || elm.hasClass('fn_editNote')){
				ice.managelicense.generateDetailHtmlvals(elm,elm.closest('tr.dynamicRow').data('fCLabels'));
			}else{
				$a.removeClass('open selfClick');
				if(saveTrue){
					nTr.haveData = false;
					var lo = $(elm).parents('tr.dynamicRow').prev('tr').find('a.openClose');
					$a.addClass('open');
					$(nTr).next("tr").find("div.more-details").remove().end().find(".note-wrapper").show().end().find(".details-wrapper,div.label_holder").remove();
					$(nTr).next("tr.dynamicRow").find('td').append("<div class=\"loading_small\">"+ice.globalVars.loadingLbl+"</div>");
					ice.managelicense.getRowdataSupport($tbl, $(nTr).next("tr.dynamicRow"),edittrue,$(lo));
					nTr.haveData = true;
					$(nTr).removeClass('refreshed')	
				}else{
					$(nTr).next("tr").find("div.more-details").hide().end().find(".note-wrapper").show().end().find(".details-wrapper,div.label_holder").hide();				
				}
				if($(nTr).next("tr").find(".sNote").length) ice.managelicense.truncateNotes($(nTr).next("tr").find(".sNote"));
			}
		} else {
			$a.addClass('open');
			$(nTr).addClass('noborder');
			if(!nTr.haveData || $(nTr).hasClass('refreshed')){
				$(nTr).next("tr").find("div.more-details").remove().end().find(".note-wrapper").show().end().find(".details-wrapper,div.label_holder").remove();
				$(nTr).next("tr.dynamicRow").find('td').append("<div class=\"loading_small\">"+ice.globalVars.loadingLbl+"</div>");
				ice.managelicense.getRowdataSupport($tbl, $(nTr).next("tr.dynamicRow"),edittrue,elm);
				nTr.haveData = true;
				$(nTr).removeClass('refreshed')
			} else {
				if(elm.hasClass('fn_editlabels') || elm.hasClass('fn_editNote')){
					ice.managelicense.generateDetailHtmlvals(elm,elm.closest('tr.dynamicRow').data('fCLabels'));
					var nextTr=$(nTr).next("tr");
					nextTr.find("div.more-details").show();
				}else{
					var nextTr=$(nTr).next("tr");
					nextTr.find("div.more-details").show();
					if (nextTr.find(".details-wrapper textarea").length){
						nextTr.find(".details-wrapper").show().end().find(".note-wrapper").hide();
					}else{nextTr.find("div.label_holder").show();}
				}
			}
			ice.managelicense.showFullNotes($(nTr).next("tr").find(".sNote"));
		}
	},
	showFullNotes: function(note){
		var tr = note.closest('tr');
		note.html($(tr).data("fNotes")+" ").addClass("open");
	},
	truncateNotes:function(note){
		var tr = note.closest('tr');
		if (tr.data("fNotes").length>90) note.html(tr.data("fNotes").substr(0,90)+"... ");
		note.removeClass("open");
	},
	cancelNote: function(a, c){
		$(a).attr('disabled', 'disabled')
		var tarElm = $(a).closest('tr.dynamicRow').prev('tr');
		var closestScroll = $(a).closest('div.dataTables_scrollBody');
		var editLink = ' <a class="edit fn_editNote" href="#">'+editNoteGlobal+'</a>', 
			$note = $(a).closest(".note-wrapper").find('.note'),
			addLink =  ' <a class="edit fn_editNote" href="#">'+addNoteGlobal+'</a>',
			$openclose=$(a).closest('tr').prev('tr').find('td:eq(0) a.openClose');
		var oldText = (c.length>0)? "<span class=\"sNote\">"+ c + " </span>"+ editLink : addLink;
		//$(a).closest(".note-wrapper").find('textarea, .btnWrapper').remove();
		$(a).closest("div.details-wrapper").remove();
		$(a).closest('tr.dynamicRow').find("div.note-wrapper").show();		
		$note.html(oldText).show();
		$(a).removeAttr('disabled', 'disabled');
		$(tarElm).addClass('refreshed');
		if($note.find(".sNote").length) ice.managelicense.truncateNotes($note.find(".sNote"));
		ice.managelicense.expandLicenseKey($openclose,false,$(a));
		ice.managelicense.scrollToElement(closestScroll,tarElm); // Scroll to closest main tr
	},
	showFolderLicenseKeyCount: function(){
		var _sPerPostData = new Object();
		_sPerPostData['folderId'] = '7759446';
		_sPerPostData['productGrpId'] = '619';
		var _licenseKeyCountURL = licenseKeyCountURL;
		$.ajax({
			url: _licenseKeyCountURL, 
			type: "POST",
			data: _sPerPostData,
			success: function(msg){
				
			}
		});
	},
    saveNote: function (a, b, c) { 
        var $this = $(a),erT = false,vnullChk = false,lenchk = false,lbltxt = '';
		if($this.parents('div.details-wrapper').find('div.clabeleditErrorCont').length){
			$this.parents('div.details-wrapper').find('div.clabeleditErrorCont').remove();
		}
		var errContHtml = "<div class=\"clabeleditErrorCont\"><span id=\"labelnameError\" class=\"first\"></span><span id=\"labelvalueError\" class=\"second\"></span></div>";
		$this.parents('div.details-wrapper').find('div.edLabelWrapper').each(function(inx, nchk){
			var txtVal = $.trim($(nchk).find('input.clvalue').val());
			if(!erT){ // Check special character error already present
				erT = ice.managelicense.checkSpecialCharacters(txtVal);
				if(erT){
					if(!$(nchk).find('div.clabeleditErrorCont').length){$(nchk).append(errContHtml);}
					$(nchk).find('span#labelvalueError').text('"~^" '+ice.globalVars.notAllowCharsMsg);
				}
			}
			if(!vnullChk || !lenchk){
				if($(nchk).find('label.labeltxt').length){
					lbltxt = $(nchk).find('label.labeltxt').text();
				}else{
					lbltxt = $(nchk).find('select').val();
				}
				if(($.trim(lbltxt) != "" && txtVal == "") || ($.trim(lbltxt) == "" && txtVal != "") || ($.trim(lbltxt) != "" && txtVal.length <3)){
					if(!$(nchk).find('div.clabeleditErrorCont').length){$(nchk).append(errContHtml);}										
					if(txtVal != "" && txtVal.length <3){
						lenchk = true;						
						$(nchk).find('span#labelvalueError').text(ice.globalVars.enterAtLeast3Msg);
					}else if(txtVal == ""){
						vnullChk = true;
						$(nchk).find('span#labelvalueError').text(ice.globalVars.noEmptyMsg);
					}
				}
			}			
		});
		if(erT || vnullChk || lenchk){
			var tarElm = $this.closest('tr.dynamicRow').prev('tr');
			var closestScroll = $this.closest('div.dataTables_scrollBody');
			ice.managelicense.scrollToElement(closestScroll,tarElm); // Scroll to closest main tr
			$this.removeAttr('disabled','disabled').removeClass('disabled');
		}else{
			var $textarea = $this.closest(".details-wrapper").find('textarea'),labelsData = "";
			var $note = $this.closest("tr.dynamicRow").find('.note'),
			$openclose=$this.closest('tr').prev('tr').find('td:eq(0) a.openClose'),
			editLink = ' </span><a class="edit fn_editNote" href="#">'+editNoteGlobal+'</a>',
			newText = '';
			$this.attr('disabled', 'disabled').addClass('disabled');
			// Get the current text
			newText = $textarea.val();
			var _saveNoteUrl = saveNoteUrl; 
			var _sPerPostData = new Object();
			_sPerPostData['licenseKey'] = b;
			_sPerPostData['licenseKeyNotes'] = newText.toString();		
			var cnt = $this.parents('div.details-wrapper').find('div.edLabelWrapper').length;
			var delLabels = $this.parents('div.details-wrapper').find('input.deletedLabels').val();
			$this.parents('div.details-wrapper').find('div.edLabelWrapper').each(function(ind, edl){
				if($(edl).find('label.labeltxt').length){
					if(ind != 0){labelsData += "^";}
					labelsData += $(edl).find('label.labeltxt').text()+"~"+$(edl).find('input.clvalue').val();
				}else{
					if($(edl).find('select').val() != ""){
						if(ind != 0){labelsData += "^";}
						labelsData += $(edl).find('select').val()+"~"+$(edl).find('input.clvalue').val()+"~NEW";
					}
				}
			});			
			if(delLabels == undefined){delLabels = "";}else{delLabels = delLabels +"^";}
			_sPerPostData['labelLov'] = delLabels+labelsData;			
			$.ajax({
				url: _saveNoteUrl, /* URL NEEDS TO BE UPDATED BY DEVELOPERS */
				type: "POST",
				data: _sPerPostData,
				success: function(msg){
					//$textarea.remove();
					//$this.parent().remove();
					var msgRes = vmf.json.txtToObj(msg);
					var tarElm = $this.closest('tr.dynamicRow').prev('tr');
					var closestScroll = $this.closest('div.dataTables_scrollBody');
					ice.managelicense.scrollToElement(closestScroll,tarElm); // Scroll to closest main tr
					if(msgRes.result != "fmw-exception"){		
						if(msg != "SAVE_ERROR"){
							// Update the old text & show the div
							$note.closest('tr').data("fNotes",newText);
							//Update licenseaaData for switch to case -> here we are refreshing with existing data
							$.each(licenseaaData,function(i,v){
								if(v[0].indexOf(b)!=-1) v[v.length-1]=newText;
							});
							newText = (newText.length>0) ? "<span class=\"sNote\">" + newText + editLink : '<a class="edit fn_editNote" href="#">'+addNoteGlobal+'</a>';
							$note.html(newText).next().html();
							if($note.find(".sNote").length) ice.managelicense.truncateNotes($note.find(".sNote"));
						}else{
							var oldText = c + editLink;
							$note.html(oldText).next().html(ice.globalVars.anotherUserModifyMsg);
						}
						$this.removeAttr('disabled','disabled').removeClass('disabled');
						$note.show();
						ice.managelicense.expandLicenseKey($openclose,false,$this,true);
					}else{
						$this.removeAttr('disabled','disabled').removeClass('disabled');
						$('#manageLicenseExceptionMessage').html('<p class="error">'+ice.globalVars.encounteredIssuesMsg+'</p>');
						vmf.modal.show("manageLicenseExceptionMessagePopup");
					}
				}
			});
		}
    },
    folderTreeCBSelected: function (URLProductSummary, selectedFolders, folderId, cbState, urlLicenseDetails, urlOrderDetails, urlSupportDetails) {
        $('.splcontract').remove();
		//ice.managelicense.handleContinueBtn('hide','enabled');
		if($('#sel_wantTo').val() != "viewLicense") ice.managelicense.handleContinueBtn('show','disabled');
        if(cbState == "checked") {
            var _popProdConf = new Object();
            _popProdConf.URLProductSummary = URLProductSummary;
            _popProdConf.selectedFolders = selectedFolders;
            _popProdConf.urlLicenseDetails = urlLicenseDetails;
            _popProdConf.urlOrderDetails = urlOrderDetails;
            _popProdConf.urlSupportDetails = urlSupportDetails;
            ice.managelicense.getMinPermissionListData(selectedFolders, _popProdConf);
			if($('#sel_wantTo').val() == 'downgradeLicense') {
				$('#selectedLicenseKeys').val(selectedFolders);
			}
        }
		else {ice.managelicense.onSuccessPopulateProducts(URLProductSummary,selectedFolders,urlLicenseDetails,urlOrderDetails,urlSupportDetails);}
		if(selectedFolders == ''){
			ice.managelicense.updateFilterLabelDropDown('');
			ice.managelicense.eaLabelsFlag = false;
		}else{
			if(!ice.managelicense.eaLabelsFlag){ice.managelicense.callEaLabelsAjax();}
		}
    },
	onSuccessPopulateProducts: function(URLProductSummary, selectedFolders, urlLicenseDetails, urlOrderDetails, urlSupportDetails) {
		urlLicenseDetail = urlLicenseDetails;
		urlOrderDetail = urlOrderDetails;
		urlSupportDetail = urlSupportDetails;
		$('#folderPane input[type=checkbox]:not([readonly]), #filter-section-header input.select-all').attr('disabled', 'disabled');
		$('#folderPane input[type=checkbox]:not([readonly])').closest('span').addClass('disabled');
		$folderHT = vmf.foldertree.getFolderHashtable();
		var _folderTreeObj = vmf.foldertree.getFolderJSON();
		selectedFolderCount = selectedFolders.length;
		selectedAllFoldersId = selectedFolders;
		if(selectedFolders.length==1){
			$("#parentFolderId").val($folderHT.get(selectedFolders[0]).parentFolderId);
			$("#fullFolderPath").val($folderHT.get(selectedFolders[0]).fullFolderPath);
			$("#selectedFolderName").val($folderHT.get(selectedFolders[0]).folderName);
			$("#folderId").val($folderHT.get(selectedFolders[0]).folderId);
			$("#folderAccess").val($folderHT.get(selectedFolders[0]).folderAccess);
			$('#selectedFolderId').val(selectedFolders[0]);
			var _folderAccess = $folderHT.get(selectedFolders[0]).folderAccess;
			var ftype = $folderHT.get(selectedFolders[0]).folderType;
			if($("#folderAccess").val()=='MANAGE'){ // Defect Fixed BUG-00024703
				if(ftype=='ROOT'){
					$('.dropdown li').each(function(){
						if($(this).find('a').attr('id')=='createFolder'){
							$(this).find('a').removeClass('disableMenu');
							$(this).removeClass('inactive');
						} else {
							$(this).find('a').addClass('disableMenu');
						}
					});
				} else if(ftype=="ASP" ||ftype=="CPL" ||ftype=="VCE" ) {// if it is not ROOT folder  and type is "ASP","CPL","VCE"
					$('.dropdown a').addClass('disableMenu'); // On first load, the disable class is not assigned
					$('.dropdown a#renameFolder').removeClass('disableMenu').parent('li').removeClass('inactive');
					$('#folderPane input[type=checkbox]').closest('span').removeClass('hover');
				}
				else{ //if it is not ROOT folder  and  not "ASP","CPL","VCE"
					$('.dropdown a').removeClass('disableMenu').parent('li').removeClass('inactive');
				};
				$('.dropdown a#addUser,.dropdown a#shareFolder').removeClass('disableMenu').parent('li').removeClass('inactive');
			} 
			else { // _folderAccess it not manage
				$('.dropdown a').addClass('disableMenu');
			}
		} else {
			$("#parentFolderId, #fullFolderPath, #selectedFolderName, #folderId, #folderAccess, #selectedFolderId").val('');
			$('.dropdown a').addClass('disableMenu');
			if(ice.managelicense.createFolderFlg){
				$('.dropdown').find('a#createFolder,a#addUser,a#shareFolder').removeClass('disableMenu').parent('li').removeClass('inactive');
			}
		}
		if (selectedFolders == '') {
			
			myvmware.filters.disableExposedFilterForm(true);

			ice.managelicense.clearTable('productSummary',viewProductGlobal);
			if($('#sel_wantTo').val() != "viewLicense") ice.managelicense.handleContinueBtn('show','disabled');
			$('#keyManagement, #productMessage, #currentProductName,.rightaligned_link').slideUp('slow', function(){	ice.managelicense.adjustHt();});
			$('#folderPane input[type=checkbox]:not([readonly])').not(".unselect").removeAttr('disabled', 'disabled').closest('span').removeClass('disabled');
			$('#filter-section-header input.select-all:not(".unselect")').removeAttr('disabled', 'disabled');
			var productOption = '<option value="">'+ice.globalVars.selectDefault+'</option>';
			if($('#productName').length > 0){$('#productName').html(productOption);}
			$('#exportToCsv').addClass('disableMenu').parent('li').addClass('inactive');
		} else {
		    if(($('#sel_wantTo').val() == "viewLicense"))//BUG-00047103
			{
				$('#exportToCsv').removeClass('disableMenu').parent('li').removeClass('inactive');} //tshaik
			else { 
				$('#exportToCsv').addClass('disableMenu').parent('li').addClass('inactive');
			} //tshaik
			
			$("#productMessage, #currentProductName, #keyManagement, .rightaligned_link").slideUp();
			$(".filter-section-header, .content", $("#keyManagement")).slideUp();
			$("#upgradeOptionsContainer, #selectedOptionsContainer").removeAttr("style");
			var selFolders = ($('.select-all').attr('checked'))?"":selectedFolders;
			urlProductSummary = URLProductSummary;
			data="param=" + selFolders;
			vmf.datatable.reload($('#productSummary'),urlProductSummary, ice.managelicense.postProcessingData,"POST", data);
		}
		return false;
	},
    getMinPermissionListData: function(selectedFolders, popProdConf) {
        var _fPerPostData = new Object();
        if(selectedFolders.length > 1) {
            _fPerPostData['selectedFolders'] = selectedFolders.toString();
        }
        else {
            _fPerPostData['selectedFolderId'] = selectedFolders.toString();
        }
        $.ajax({
			type: 'POST',
			url: $folderMinPermissionUrl,
			async: true,
			dataType: "json",
            data: _fPerPostData,
			success: function (folderPermission) {
                //Check number of permissions
                if(selectedFolders.length > 1) {
                    for(var i=0;i<selectedFolders.length;i++) {
                        vmf.foldertree.storePermission(selectedFolders[i], folderPermission[i]);
                    }
                }
                else {
                    //Store permission in folder tree HT
                    vmf.foldertree.storePermission(selectedFolders[0], folderPermission);
                }
                ice.managelicense.onSuccessPopulateProducts(
                    popProdConf.URLProductSummary,
                    popProdConf.selectedFolders,
                    popProdConf.urlLicenseDetails,
                    popProdConf.urlOrderDetails,
                    popProdConf.urlSupportDetails);
			},
			error: function (response, errorDesc, errorThrown) {
                //console.log("In error: " + errorThrown);
			},
			beforeSend: function() {
				//TODO
			},
			complete: function(jqXHR, settings) {
				//TODO
			}
		});
    },
    populateProductNameCombo : function(){
    	var length = ice.managelicense.producteaaData.length;
    	/*var productOption = '<option value="">'+ice.globalVars.selectDefault+'</option>';
    	for(var index = 0; index < length; index++){
    		var prodRow = ice.managelicense.producteaaData[index];
    		productOption += '<option value='+prodRow[3]+'>'+prodRow[0]+'</option>';
    	}
    	if($('#productName').length > 0){
    		$('#productName').html(productOption);
    	}*/
    	var productsData = [];
    	for(var index = 0; index < length; index++){
    		var prodRow = ice.managelicense.producteaaData[index];
    		var tempObj = {
    			  product_id: prodRow[3]
    			, product_name: prodRow[0]
    		};
    		productsData.push(tempObj);
    	}
    	$('#productName').data('suggest_data_src', productsData);
    },
    getLicenseListByProductJSONPost: function (productId, alertId) {
        $('.splcontract').remove();
        var _urlLicenseDetails = urlLicenseDetail + "&param=" + productId + "&firstAlertId=" + alertId;
        ice.managelicense.fetchaaData(_urlLicenseDetails);
    },
    fetchaaData: function (urlLicenseDetails) {
		$("div.rightaligned_link").hide();
		if($('#sel_wantTo').val() != "viewLicense") ice.managelicense.handleContinueBtn('show','disabled');
		if($('#licenseDetail').is(':visible')){
			//SFF- Added upgrade options container to list of hidden elements 
			$("#viewLicense .dataTables_scroll, #currentProductName, #keyManagement .filter-section-header,#upgradeOptionsContainer,#selectedOptionsContainer").hide();
			table = $('#licenseDetail').dataTable();
			oSettings = table.fnSettings();
			table.oApi._fnProcessingDisplay( oSettings, true );
		} else {
				$('#productMessage .message_container').hide();
				$('#productMessage').append('<span class="dataTables_processing" id="loadingText">'+ice.globalVars.loadingLbl+'</span>');
		}
        $.ajax({
            type: "POST",
            dataType: "",
		//data : _fPerPostData,
            url: urlLicenseDetails +'&iWantToSelection=' + $('#sel_wantTo').val(),
            success: function (data) {
                try {
                    //var _manageJsonResponse = licenseDetails;
			var _manageJsonResponse =  vmf.json.txtToObj(data);
                    if (_manageJsonResponse == null || _manageJsonResponse.error) {
                    } else {
						istooltipDisplayed = false;
                        licenseaaData = _manageJsonResponse.aaData;
						if(!licenseaaData.length){
							if($("#loadingText").length){
								$("#loadingText").remove();
							}
							$('#productMessage, #keyManagement .content').hide();
							$("#currentProductName").show();
							$('#keyManagement').after("<div class='splcontract'> "+ice.globalVars.noLicenseKeyMsg+"</div>");
							return false;
						}
                        splContractData = _manageJsonResponse.specialContract;
						isRestrictDwngrdProd = _manageJsonResponse.isRestrictDwngrdProd;
                        
						alertData = _manageJsonResponse.alertData;
						isRestrictDwngrdProd = _manageJsonResponse.isRestrictDwngrdProd;
						
                        /*Store the folder path of selected folders*/
                        var _selectedFolders = vmf.foldertree.getSelectedFolders();
                        $selectedFolderPathHT = new vmf.data.Hashtable();
                        $.each(_selectedFolders.keys(), function (index, value) {
                            $selectedFolderPathHT.put($folderHT.get(value).fullFolderPath, value);
                        });
                        $("#productMessage").hide();
						//$("#currentProductName").show();
						$("#viewLicense .dataTables_scroll, #currentProductName, #keyManagement .filter-section-header").show();
						$("#keyManagement").slideUp('fast');
						var splData = licenseaaData[0][0];  // this is for ASP and VCE contracts
						if(splData == "VCE" || splData == "ASP"){
							$('.splcontract').remove();
							var vals = [licenseaaData[0][1], v2 = licenseaaData[0][2], v3 = licenseaaData[0][3], v4 = licenseaaData[0][4]];
							$('#keyManagement').after("<div class='splcontract'>"+myvmware.common.buildLocaleMsg(ice.globalVars.productCoveredMsg,vals)+"</div>");
						} else {
							$('.splcontract').remove();
							ice.managelicense.licHeaderData = licenseKeysGlobal;
							ice.managelicense.qtyHeaderData = qtyHeaderGlobal;
							if(splContractData == "CPL") {
							  ice.managelicense.licHeaderData = "Description";
							  ice.managelicense.qtyHeaderData = "Metric";
							}
							if(!$("#licenseDetail_wrapper").length)	ice.managelicense.createLicenseDetail('licenseDetail');
							else ice.managelicense.RefreshTable('licenseDetail',licenseaaData);
							ice.managelicense.buildAlertInfo();
						}

						//SFF-Toggle display of 'upgrade options container'	
						$("#btn_cancel_ugl").attr("disabled","disabled").addClass('disabled').hide();
						myvmware.managelicenses.isOptionSelected = false;

						if($('#sel_wantTo').val() === "upgradeLicense"){
							$("#upgradeOptionsContainer").show();
							$("a.togUpgradeOptions").show();													
						}else{
							$("#upgradeOptionsContainer,#selectedOptionsContainer,a.togUpgradeOptions").hide();							
						} 

						//SFF-Hanlde 'check upgrade options' button
						var mlType = $('#sel_wantTo').val();
						$("#btn_checkUpgradeOptions").unbind('click').bind('click',function(){

							var _arrayOfLicenseKeyObjects = $("#licenseDetail input:checkbox[name=opensel12]");
							
							//BUG-00068963
							if($('#licenseDetail tbody tr:first').find('.warning_big').length){
								$('button#btn_warning_ok').trigger('click');
							}

							var _arrayOfValidKeyObjects = _arrayOfLicenseKeyObjects.filter(":not(':disabled')"); 
							var _availLicenseKeysCount = _arrayOfValidKeyObjects.length;
							var _arrayOfLicenseKeys = new Array(); 
							var _allowedLicenseKeysCount = 200;

							if(_availLicenseKeysCount>0){									
									//Convert to Array	
									_arrayOfValidKeyObjects.each(function(){
										_arrayOfLicenseKeys.push($(this).val());
									});	
									if(_availLicenseKeysCount>_allowedLicenseKeysCount){
									//send only 200 licenses 
									_arrayOfLicenseKeys = _arrayOfLicenseKeys.slice(0,_allowedLicenseKeysCount);	
									}

									myvmware.managelicenses.startManagingLicenses(mlType,_arrayOfLicenseKeys,true);	

							}else{

								$('#licenseDetailPopupValidationMsg .modalContent p').html('There are no available upgrades for the current folder and product selection.');
								vmf.modal.show('licenseDetailPopupValidationMsg');		

							}

						});
                    }
                } 	catch (err) {
                    //var _message = 'No license information available for the selected product.';
                    //$('#productMessage div.message_container').html(_message);
                }
	    },
			complete:function(){
				ice.managelicense.adjustHt();
				if($('#sel_wantTo').val() !== "viewLicense" && $('#sel_wantTo').val() !== "divide"){
					ice.managelicense.processBeaks();
				}
			}
        });
    },
	buildAlertInfo: function(){
		var $keyManagement = $('#keyManagement');
		var _cc = $('#sel_wantTo').val();
		$('#' + _cc).show();
		if(_cc == "downgradeLicense")					
			$("div.rightaligned_link").show();
		if(($('#sel_wantTo').val() == "viewLicense" || $('#sel_wantTo').val() == "upgradeLicense") && alertData && alertData[0][1]){
			var deactUrl = deactivateLicenseKeyPageUrl;

			if (alertData[0][0]){
				var alertStr = '<tr><td colspan="4"><div class="warning_big"><strong>'+ice.globalVars.attentionHdr+'</strong><br>'+ice.globalVars.attention1Msg;
			}else{
				var alertStr = '<tr><td colspan="3"><div class="warning_big"><strong>'+ice.globalVars.attentionHdr+'</strong><br>'+ice.globalVars.attention2Msg;
			}
			
			if ($('#sel_wantTo').val() == "upgradeLicense" && alertData[0][1]){
				$("#licenseDetail > tbody > tr:first").before(alertStr);
				$("#licenseDetail").find('.openCloseSelect input[type=checkbox]').attr('disabled', true);
				$("#licenseDetail").find('.openCloseSelect input[type=checkbox]').parent().next().append('<a class="tooltip" title="'+upgradeV3GreyedOutLicense+'" data-tooltip-position="bottom" href="#">'+upgradeV3GreyedOutLicense+'</a>');
				myvmware.hoverContent.bindEvents($('a.tooltip'), 'defaultfunc');
			}else{
				$("#licenseDetail > tbody > tr:first").before(alertStr);
			}							
         // for fixing BUG-00068565 13/12/2013 
         $(".warning_big a.deactLink").attr("href",deactUrl);			
		}
		
		if(ice.managelicense.licenseKeyView && (licenseaaData.length >= ($licenseRecordCountInfo-1))){
			var urlHelpPage = "<a class='help' href=javascript:myvmware.common.openHelpPage('"+$openKBURL+"'); id='moreAction'>"+$kbArticleAccessLicenseKey+"</a>"
			
			var alertMoreLicense = "<tr><td colspan='4'><div class='warning_big' style='margin:0px'><strong>"+ice.globalVars.attentionHdr+"</strong><br> "+myvmware.common.buildLocaleMsg(ice.globalVars.moreLicenseKeys,urlHelpPage)+"<a title='Close' class='alertCloseImg'></a> </div></td></tr>";
			$("#viewLicense table > tbody > tr:first").before(alertMoreLicense);
			var alertMoreLicense1 = "<tr><td colspan='4' style='text-align:center'><div>"+ice.globalVars.moreLicenseKeysMsg+$('.licTtipMsg').html()+"<br /><a href='javascript:;' class='exactKeyCount'>"+ice.globalVars.clickHereKeyCountMsg+"</a> </div></td></tr>";
			$("#viewLicense table > tbody > tr:last").after(alertMoreLicense1);
			ice.managelicense.licenseKeyView = false;
		} else if(licenseaaData.length >= ($licenseRecordCountInfo-1)){
			var keyVal = $('#productSummary').find('tr.selected td:eq(1)').html();
			var alertMoreLicense1 = "<tr><td colspan='4' style='text-align:center'><div class=''>"+ice.globalVars.totalKeyNumberMsg+"</div><span style='text-align:center;font-size:16px;'>"+keyVal+"</span></td></tr>";
			$("#viewLicense table > tbody > tr:last").after(alertMoreLicense1);
		}
		$('a.exactKeyCount').die('click').live('click',function(){
			var selectedProdLic = $('#productSummary').find('tr.selected td:eq(1) a.licenseKeys');
			if(selectedProdLic.length){
				selectedProdLic.trigger('click');
			}
		});
		$('a.alertCloseImg').die('click').live('click',function(){
			$(this).closest('tr').remove();
		});
		myvmware.hoverContent.bindEvents($('a.tooltip'), 'epfunc');
	},
    createLicenseDetail: function () {
		vmf.datatable.build($('#licenseDetail'), {
            //"bRetrieve": true,
            "bAutoWidth": false,
			"aoColumns": [
				{"sTitle": "<span class='descending' style='overflow:hidden'><input type='checkbox' id='licDetSelectAllid' name='licDetSelectAllname' class='licDetSelectAllclass' /><span>"+ice.managelicense.licHeaderData+"</span></span>" , "sWidth":"284px"}, 
				{"sTitle": "<span class='descending'>"+ice.managelicense.qtyHeaderData+"</span>" , "sWidth":"95px","sType":"numeric-comma"},
				{"sTitle": "<span class='descending'>"+expireGlobal+"</span>" , "sWidth":"50px"},
				{"sTitle": "<span class='descending'>"+licenseFolderGlobal+"</span>","sWidth":"150px"},
				{"sTitle": "<span class='descending'>Serialized</span>"},
				{"bVisible":false}],
			"fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
					tableId=ice.managelicense.tableId;
					$tblRef = this;
					if(tableId == 'licenseDetailDowngrade' && aData[6] && $.trim(aData[6]) == 'restrictDwngrdNotAllowed'){
						$(nRow).addClass('disabled tooltip').attr('title',errRestrictedDowngradeMsg).attr('data-tooltip-position','bottom');
						$('.openCloseSelect input', nRow).attr("disabled", true);
					}	
					if ( $.trim(aData[5]) == "Y" ){	
						if(tableId == 'licenseDetailCombine' || tableId == 'licenseDetailDivide' || tableId == 'licenseDetailDowngrade' || tableId == 'licenseDetailUpgrade'){
							$('.openCloseSelect input', nRow).attr("disabled", true);								
						}
						if((tableId == 'licenseDetailMove' || tableId == 'licenseDetail' || tableId == 'licenseDetailCombine' || tableId == 'licenseDetailDivide' || tableId == 'licenseDetailDowngrade' || tableId == 'licenseDetailUpgrade')
							&& $('a.padlock', nRow ).length == 0){
							$('td', nRow ).eq(0).append('<a class="tooltip padlock" title="'+ice.globalVars.keyLockedMsg+'" data-tooltip-position="bottom" href="#">'+ice.globalVars.keyLockedMsg+'</a>');	
						}
					}
					return nRow;
		      },
			"bInfo": false,
            "bServerSide": false,
			"aaSorting": [[3,'asc']],
            "aaData": licenseaaData,
            "sDom": 'zrtSpi',
            "sScrollY": 260,
			"bProcessing":true,
			"oLanguage": {
				"sProcessing" : ice.globalVars.loadingLbl,
				"sLoadingRecords":""
			},
            "bFilter": false,
            "fnDrawCallback": function () {
				tableId=ice.managelicense.tableId;
				var $keyManagement = $('#keyManagement #licenseDetail');
            	$keyManagement.find('tbody tr').each(function(){
					if (!$(this).next("tr").hasClass('dynamicRow'))
						$(this).find('.openCloseSelect .openClose').removeClass('open');
            	});
				var numRows=licenseaaData.length,fExpire=false;
				for (i=0;i<numRows;i++){
					if ($.trim(licenseaaData[i][2]).length){
						fExpire=true;
						break;
					}
				}
				(fExpire) ? this.fnSetColumnVis(2,true): this.fnSetColumnVis(2,false);
            	if(tableId == 'licenseDetailCombine' || tableId == 'licenseDetailDivide' || tableId == 'licenseDetailDowngrade' || tableId == 'licenseDetailUpgrade'){
					var _currentTime = new Date();
					var _month = _currentTime.getMonth() + 1;
					var _day = _currentTime.getDate();
					var _year = _currentTime.getFullYear();
					var _tDate = _year+'-'+_month+'-'+_day;
					var _expiredDate = $keyManagement.find('tbody td:eq(2)').text();
					var _changeDateFormat = _expiredDate.split('-');
					var _newExpiredDate = _changeDateFormat[2]+'-'+_changeDateFormat[1]+'-'+_changeDateFormat[0];
					//Check if expiration date will be less than current date then the row get disabled					
					if ((Date.parse(_newExpiredDate) < Date.parse(_tDate)) && _changeDateFormat.length == 3) {
						$keyManagement.find('tbody tr').addClass('disabled otherFolder tooltip').attr({'title':greyedOutFolderTooltip,'data-tooltip-position':'bottom'});
						$keyManagement.find('tbody tr td').addClass('inactive');
						$keyManagement.find('tbody tr td:eq(0) .openCloseSelect input').attr('disabled', 'disabled');
						istooltipDisplayed = true;
						//On hover tooltip for disabled license keys
					}
					//BUG-00019679	
					if(tableId == 'licenseDetailCombine'){
						var _whenSingle	= $keyManagement.find('.openCloseSelect').find('input[type=checkbox]').length;					
						if(_whenSingle == 1) // when we have only one combineKey, checkbox should be disabled, because we need more than one licenseKey(checkbox) to combine
							$keyManagement.find('.openCloseSelect').find('input:checkbox').attr('disabled', true);	
							if(! istooltipDisplayed){
								$('#keyManagement').find('.openCloseSelect input:checkbox:disabled').closest('tr').addClass('disabled tooltip').attr({'title':greyedOutFolderTooltip,'data-tooltip-position':'bottom'});
								if( $('#keyManagement').find('.openCloseSelect input:checkbox:disabled').parent().next().html() != null)
								istooltipDisplayed = true;
							}
							
					}	//end of BUG-00019679
						
				}
				this.fnSetColumnVis(4,false);	
			},
			"fnInitComplete": function () {
				$tbl = this;
				var $detTable = $('#keyManagement #viewLicense')
				$tbl.find('tbody tr').each(function () {
					var aData = $tbl.fnGetData( this ), notes="", data="";
					if (aData[7]!=null && ($.trim(aData[7]).length != 0)){
						notes = (aData[7].length>90)?aData[7].substr(0,90)+"...":aData[7];
						data =  "<span class=\"sNote\">" + notes + ' </span><a class="edit fn_editNote" href="#">'+editNoteGlobal+'</a><div id="noteError"></div>';
					} else {
						data = "<a class=\"edit fn_editNote\" href=\"#\">"+addNoteGlobal+"</a>";
					}
					$tbl.fnOpen(this, '', 'nopadding'); // Added new row
					$(this).addClass('noborder').next('tr').html("<td colspan='4'><div class=\"note-wrapper clearfix\"><div class='note'>"+ data + "</div></div></td>").addClass('dynamicRow').data("fNotes",aData[7] || "");
				});
				if ($(".togNotes",$("#currentProductName")).hasClass("show"))
					$tbl.find('tbody tr div.note-wrapper .note').hide();
				else 
					$tbl.find('tbody tr div.note-wrapper .note').show();
				if(this.closest('div.dataTables_scrollBody')[0] && this.closest('div.dataTables_scrollBody').attr('style').toLowerCase().indexOf('overflow')!=-1){
					this.closest('div').css("overflow-y","scroll");
					setTimeout(function() {$tbl.fnAdjustColumnSizing(false);}, 50);
				}
				
                var $keyManagement = $('#keyManagement #licenseDetail'), $key=$("#keyManagement");
				$("#loadingText", $('#productMessage')).remove();
				if($('#sel_wantTo').val() != 'viewLicense'){
					$(".filter-section-header",$("#keyManagement")).slideDown();
				}
				$(".content",$key).slideDown('slow', function(){
					//ice.managelicense.adjustHt();
				});
				$key.slideDown('slow', function(){
					ice.managelicense.adjustHt();
				});
                $keyManagement.find('.openCloseSelect a').unbind('click').bind('click',function () {
					var $a = $(this);
					($a.hasClass("open")) ? $a.removeClass("selfClick") : $a.addClass("selfClick"); // To get source of license key expansion
					ice.managelicense.expandLicenseKey($a,false,$(this));
					return false;
                });
                /*Disable License Keys with VIEW Permission*/
                if (tableId == 'licenseDetailCombine' || tableId == 'licenseDetailMove' || tableId == 'licenseDetailDivide') {
					var _curRow, _curCheck, _curFolPath, _curFldId, _curFldAccess, _divCombPerm = false, _manage=false;
					$keyManagement.find(">tbody>tr").each(function(i,v){
						_curRow=$(this); _curCheck=$(this).find("td:eq(0) input:checkbox");
						_curFolPath=$(this).find("td:last").text();
						if ($selectedFolderPathHT.containsKey(_curFolPath)) {
							_curFldId = $selectedFolderPathHT.get(_curFolPath);
							_divCombPerm = false;
							_manage=false;
							if($folderHT.get(_curFldId).permission != undefined) {
                                _divCombPerm = $folderHT.get(_curFldId).permission.divComb;
								_manage = $folderHT.get(_curFldId).permission.manage;
                            }
							if (tableId == 'licenseDetailCombine' || tableId == 'licenseDetailDivide') {
								if(!_divCombPerm){
									_curRow.addClass('disabled tooltip').attr({'title':moveKeyNoPermission,'data-tooltip-position':'bottom'});
									_curCheck.attr('disabled', true);
								}
							} else if (tableId == 'licenseDetailMove') {
								if(!_manage){
									_curRow.addClass('disabled tooltip').attr({'title':moveKeyNoPermission,'data-tooltip-position':'bottom'});
									_curCheck.attr('disabled', true);
								}
							}
						}
					});
                }
                /*Disable License keys belonging to other folders */
                if (tableId == 'licenseDetailCombine') {
                    $keyManagement.find('.openCloseSelect input:checkbox').unbind('click').bind('click',function () {
                        var _checkedCount = $keyManagement.find('.openCloseSelect input:checked').length, _folderPath, _expiredDates="";
                        if ($(this).is(":checked") && _checkedCount == 1) {
							_folderPath = $(this).closest('tr').find('td:last').text();
							if ($(this).closest('tr').children().length==4){
								_expiredDates = $(this).closest('tr').find('td:eq(2)').text();
							} else {
								_expiredDates="";
							}
							$keyManagement.find('>tbody>tr').each(function (index, value) {
								var $currentTr = $(this);
								if(!$currentTr.hasClass('dynamicRow')){
									if (($currentTr.find('td:last').text() != _folderPath || ($currentTr.children().length==4 && $currentTr.find('td:eq(2)').text() != _expiredDates)) && !($currentTr.hasClass('disabled'))) {
										$currentTr.addClass('disabled tooltip otherFolder').find('.openCloseSelect input').attr('disabled', true);
										$currentTr.attr({'title':combineGreyedOutLicense,'data-tooltip-position':'bottom'});
										myvmware.hoverContent.bindEvents($currentTr, 'cursorPosition');
									}
								}
							});
                        } else if (_checkedCount == 0) { //Unchecked
                            $keyManagement.find('>tbody>tr').each(function (index, value) {
                                var $currentTr = $(this);
                                if ($currentTr.hasClass('otherFolder')) {
									$currentTr.removeClass('disabled otherFolder tooltip').removeAttr('title').find('.openCloseSelect input:checkbox').removeAttr('disabled');
                                    $currentTr.unbind('mouseenter mouseleave');
                                }
                            });
                        }
                        if($(this).is(":unchecked")){
                        	$("#licDetSelectAllid").attr('checked',false);
                        }
                        else{
                        	var totCheckCount = $keyManagement.find('.openCloseSelect input:checkbox').not(':disabled').length;
                        	var checkedCount = $keyManagement.find('.openCloseSelect input:checked').length;
                        	if (totCheckCount == checkedCount){
                        		$("#licDetSelectAllid").attr('checked',true);
                        	}
                        }
                    });
                } else if (tableId == 'licenseDetailDivide') {				
                    var _newBtn, _originalBtn;
                    var _chklen = $("#licenseDetail input[type=checkbox]").length;
					var _pattern = /[0-9]+/;
                    var _countCPU;					
                    for (var i = 0; i < _chklen; i++) {
                        _originalBtn = $("#licenseDetail input[type=checkbox]:eq(0)");
                        _countCPU = _originalBtn.parent().parent().next().text();
                        var _matches = _countCPU.match(_pattern);
                        if ($.browser.msie) {
							var _originalBtnName = _originalBtn.attr('name');
							var _originalBtnValue = _originalBtn.attr('value');
							_newBtn = $('<input type="radio" name="'+_originalBtnName+'" value="'+_originalBtnValue+'">'); 
							_originalBtn.replaceWith(_newBtn);							
						}
						else if ($.browser.mozilla || $.browser.webkit) 
						{
							_newBtn = _originalBtn.clone();
							_newBtn.attr("type", "radio");
							//_newBtn.attr("style","display:none");
							_originalBtn.replaceWith(_newBtn);							
						}
						if(_matches == 1) {
							_newBtn = $("#licenseDetail input[type=radio]:eq("+i+")");
                            _newBtn.attr('disabled', true);
                            var _disabledKey = _newBtn.parent().parent().parent();
                            _disabledKey.addClass('disabled tooltip').attr({'title':errSingleLicenseMsg,'data-tooltip-position':'bottom'});
                        }
                    }
                }
                if(tableId != 'licenseDetail'){
					ice.managelicense.handleContinueBtn('show','disabled');
					if (tableId == 'licenseDetailCombine' || tableId == 'licenseDetailMove') {
						$keyManagement.find('.openCloseSelect input').click(function () {
							var _checkedForEnable = $keyManagement.find('.openCloseSelect input:checked').length, _makingDisEna = $('#sel_wantTo').val(); 
							if(_checkedForEnable > 0) {
								$('#'+_makingDisEna+'Key').attr('disabled', false).removeClass('secondary');
								/* changed for combine - When there is 2 license selected then only need to enable continue button #BUG-00028246 - Preejith*/
								if(tableId == 'licenseDetailCombine'){
									if(_checkedForEnable >= 1){ice.managelicense.handleSelectAllChkBox('enabled','');}else{ice.managelicense.handleSelectAllChkBox('disabled','');}
									if(_checkedForEnable > 1){ice.managelicense.handleContinueBtn('show','enabled');}else{ice.managelicense.handleContinueBtn('show','disabled');}
									if(_checkedForEnable > ice.managelicense.combineActionCount){
										$(this).removeAttr('checked','checked');
										ice.managelicense.showWarningCountMessage(tableId,ice.managelicense.combineActionCount);
									}else{ice.managelicense.removeWarningMsg(false);}
								};
								if(tableId == 'licenseDetailMove'){ice.managelicense.handleContinueBtn('show','enabled');};
							}else{ 
								if(tableId == 'licenseDetailCombine'){ice.managelicense.handleSelectAllChkBox('disabled','');}
								$('#'+_makingDisEna+'Key').attr('disabled', true).addClass('secondary');
								if($('#sel_wantTo').val() != 'viewLicense'){ice.managelicense.handleContinueBtn('show','disbled');}
							}
							if($(this).is(":unchecked")){
	                        	$("#licDetSelectAllid").attr('checked',false);
	                        }
	                        else{
	                        	var totCheckCount = $keyManagement.find('.openCloseSelect input:checkbox').not(':disabled').length;
	                        	var checkedCount = $keyManagement.find('.openCloseSelect input:checked').length;
	                        	if (totCheckCount == checkedCount){
	                        		$("#licDetSelectAllid").attr('checked',true);
	                        	}
	                        }
						});
					} /* code added as part of MN.Next-Restricted Downgrade to allow only one key selection */ 
					else if (tableId == 'licenseDetailDowngrade' && isRestrictDwngrdProd == true) {
						$keyManagement.find('.openCloseSelect input:checkbox').unbind('click').bind('click',function () {
						var _checkedCount = $keyManagement.find('.openCloseSelect input:checked').length;
                        if ($(this).is(":checked") && _checkedCount == 1) {
							$keyManagement.find('>tbody>tr').each(function (index, value) {
								var $currentTr = $(this);
								if(!$currentTr.hasClass('dynamicRow')){
									if (($currentTr.find('.openCloseSelect input:checkbox:not(:checked)').length > 0 ) && !($currentTr.hasClass('disabled'))) {
										$currentTr.addClass('disabled tooltip otherFolder').find('.openCloseSelect input').attr('disabled', true);
										$currentTr.attr({'title': $msgRestrictedDwgnAllowOneKey ,'data-tooltip-position':'bottom'});
										myvmware.hoverContent.bindEvents($currentTr, 'cursorPosition');
									}
								}
							});
                        } else if (_checkedCount == 0) { //Unchecked
                            $keyManagement.find('>tbody>tr').each(function (index, value) {
                                var $currentTr = $(this);
                                if ($currentTr.hasClass('otherFolder')) {
									$currentTr.removeClass('disabled otherFolder tooltip').removeAttr('title').find('.openCloseSelect input:checkbox').removeAttr('disabled');
                                    $currentTr.unbind('mouseenter mouseleave');
                                }
                            });
                        }
                        if($(this).is(":unchecked")){
                        	$("#licDetSelectAllid").attr('checked',false);
                        }
                        else{
                        	var totCheckCount = $keyManagement.find('.openCloseSelect input:checkbox').not(':disabled').length;
                        	var checkedCount = $keyManagement.find('.openCloseSelect input:checked').length;
                        	if (totCheckCount == checkedCount){
                        		$("#licDetSelectAllid").attr('checked',true);
                        	}
                        }
						});
					} else {
						$keyManagement.find('.openCloseSelect input:checkbox').unbind('click').bind('click',function () {
							var chkboxSel = $(this);
							var _checkedForEnable = $keyManagement.find('.openCloseSelect input:checked').length; 
							var _makingDisEna = $('#sel_wantTo').val();
							var decideCnt = '';
							if(tableId == 'licenseDetailDowngrade'){decideCnt = ice.managelicense.downGradeActionCount;}else if(tableId == 'licenseDetailUpgrade'){decideCnt = ice.managelicense.upGradeActionCount;}
							if(_checkedForEnable > 0) {
								$('#'+_makingDisEna+'Key').attr('disabled', false).removeClass('secondary');
								if($('#sel_wantTo').val() != 'viewLicense') ice.managelicense.handleContinueBtn('show','enabled');
								if(_checkedForEnable > decideCnt){ 
									chkboxSel.removeAttr('checked','checked');
									ice.managelicense.showWarningCountMessage(tableId,decideCnt);
								}else{ice.managelicense.removeWarningMsg(false);}
							}
							else{ 
								$('#'+_makingDisEna+'Key').attr('disabled', true).addClass('secondary');
								if($('#sel_wantTo').val() != 'viewLicense') ice.managelicense.handleContinueBtn('show','disabled');
							}
							if($(this).is(":unchecked")){
	                        	$("#licDetSelectAllid").attr('checked',false);
	                        }
	                        else{
	                        	var totCheckCount = $keyManagement.find('.openCloseSelect input:checkbox').not(':disabled').length;
	                        	var checkedCount = $keyManagement.find('.openCloseSelect input:checked').length;
	                        	if (totCheckCount == checkedCount){
	                        		$("#licDetSelectAllid").attr('checked',true);
	                        	}
	                        }
						});
					}
				}
                if (tableId=="licenseDetail"){
					$("#viewLicense #licenseDetail input[type=checkbox]").hide();
				}
                /* Enabling(or Diabling) the Expires column */
				/* Checking for serialized keys*/				
				if (tableId == 'licenseDetailDivide' || tableId == 'licenseDetailCombine')
				{
					var requiredRows = $keyManagement.find("tbody tr").not(".dynamicRow");
					//var _isTooltipAdded = false;
					for(t=0;t<licenseaaData.length;t++)
					{
						if(licenseaaData[t][4] == "serialized")
						{
							//$keyManagement.find('tbody tr:eq('+t+')').addClass('disabled tooltip').attr({'title':greyedOutFolderTooltip,'data-tooltip-position':'bottom'});
							//$keyManagement.find('tbody tr:eq('+t+') td:eq(0) .openCloseSelect input').attr('disabled', 'disabled');
							requiredRows.eq(t).addClass('disabled tooltip').attr({'title':greyedOutFolderTooltip,'data-tooltip-position':'bottom'});
							requiredRows.eq(t).find('td:eq(0) .openCloseSelect input').attr('disabled', 'disabled');
						}
					}
				}
				if (tableId == 'licenseDetailMove' || tableId == 'licenseDetailCombine' || tableId == 'licenseDetailDowngrade' || tableId == 'licenseDetailUpgrade'){ // Enable select all checkbox condition
					if($('input#licDetSelectAllid').is(':checked')){$('input#licDetSelectAllid').removeAttr('checked','checked')}
					ice.managelicense.handleSelectAllChkBox('','show');
					ice.managelicense.selectAllLicenseKeys(tableId);															
				}else{ice.managelicense.handleSelectAllChkBox('','hide');}
				$.scrollTo('#currentProductName');
				ice.managelicense.bindEvents($keyManagement, tableId, $detTable);
				ice.managelicense.adjustHt();
            },
            "bPaginate": false
        });
        $('#keyManagement').find('div.dataTables_scrollHead .dataTables_scrollHeadInner').css({'margin-left': '0pt','width': '628px'});
        $('#keyManagement').find('div.dataTables_scrollHeadInner table').css({'margin-left': '0pt','width': '612px'});
        $tbl.parents("div.dataTables_scroll").children('div.dataTables_scrollHead').find("table tr th:eq(0)").width($tbl.find("tbody tr td:eq(0)").width());
		$tbl.parents("div.dataTables_scroll").children('div.dataTables_scrollHead').find("table tr th:eq(1)").width($tbl.find("tbody tr td:eq(1)").width());
		$tbl.parents("div.dataTables_scroll").children('div.dataTables_scrollHead').find("table tr th:eq(2)").width($tbl.find("tbody tr td:eq(2)").width());				
    },
	showloading :function(){
		return sOut="<div class='loading'><span class='loading_small'>"+ice.globalVars.loadingLbl+"</span></div>";
	},
	processBeaks: function(){
		var wantTo = $('#sel_wantTo').val();
		if(wantTo === "viewLicense"){
			myvmware.common.setBeakPosition({
				beakId:myvmware.common.beaksObj["Q1_BEAK_LICENSE_PAGE_FOR_LABELS"],
				beakName:"Q1_BEAK_LICENSE_PAGE_FOR_LABELS",
				beakHeading:$licenseBeakHeading,
				beakContent:$licenseBeakContent,
				target:$('.addlinkContainer:first a:eq(0)'),
				beakLink:'#row2'
			});
		} else if(wantTo !== "viewLicense" && wantTo !== "divide"){
			myvmware.common.setBeakPosition({
				beakId:myvmware.common.beaksObj["Q1_BEAK_LICENSE_PAGE_FOR_SELECT_ALL_CHECKBOX"],
				beakName:"Q1_BEAK_LICENSE_PAGE_FOR_SELECT_ALL_CHECKBOX",
				beakHeading:$licenseBeakHeadingMove,
				beakContent:$licenseBeakContentMove,
				target:$('#licDetSelectAllid'),
				beakLink:'#row2'
			});
		}
	},
	processLicenseKeyRowsForRestricedDwng :function(_currRow) {
		var $keyManagement = $('#keyManagement #licenseDetail');
		var _checkedCount = $keyManagement.find('.openCloseSelect input:checked').length;
		if (_currRow.is(":checked") && _checkedCount == 1) {
			$keyManagement.find('>tbody>tr').each(function (index, value) {
				var $currentTr = $(this);
				if(!$currentTr.hasClass('dynamicRow')){
					if (($currentTr.find('.openCloseSelect input:checkbox:not(:checked)').length > 0 ) && !($currentTr.hasClass('disabled'))) {
						$currentTr.addClass('disabled tooltip otherFolder').find('.openCloseSelect input').attr('disabled', true);
						$currentTr.attr({'title': $msgRestrictedDwgnAllowOneKey ,'data-tooltip-position':'bottom'});
						myvmware.hoverContent.bindEvents($currentTr, 'cursorPosition');
					}
				}
			});
		} else if (_checkedCount == 0) { //Unchecked
			$keyManagement.find('>tbody>tr').each(function (index, value) {
				var $currentTr = $(this);
				if ($currentTr.hasClass('otherFolder')) {
					$currentTr.removeClass('disabled otherFolder tooltip').removeAttr('title').find('.openCloseSelect input:checkbox').removeAttr('disabled');
					$currentTr.unbind('mouseenter mouseleave');
				}
			});
		}
	},
    getRowdataSupport: function (tbls, newRow, edittrue, ckelm) {	
		totcount = '';
		cplContract = '';
		tbl = tbls;
		lkey = licenseKey;
		//BUG-00052407 to send EANumber for encryption
		var EANumber = ice.eaSelector.getSelectedEANumber();
		var _errTxt='';
        var _urlSupportDetail = urlSupportDetail + "&param=" + newRow.prev('tr').find('td:eq(0) .openCloseSelect input').val() + "&flag=" +EANumber;
        $.ajax({
            type: "GET",
            dataType: "",
            url: _urlSupportDetail,
            success: function (data) { 
				var responseData = vmf.json.txtToObj(data);
				
				if(responseData.customlabels != null && $.type(responseData.customlabels == 'object')){// Check custom labels present in response
					$(newRow).data("fCLabels", responseData.customlabels);
					ice.managelicense.callCustomLabelsForLicense(lkey,newRow, edittrue, ckelm);	
				}else{
					var ldata = "<div class=\"addlinkContainer\"><a class=\"edit fn_editlabels addCustomLabel\" href=\"#\">"+ice.globalVars.addCustomLableLbl+"</a></div>";
					if(newRow.find('div.label_holder').length){newRow.find('div.label_holder').remove();}
					newRow.find('.note-wrapper').append("<div class=\"label_holder\">"+ldata+"</div>");
				}
				if (responseData && (responseData.error==false || typeof(responseData.error)=='undefined')){
					//BUG-00052407 encryptedeANumber used for building URL
					encryptedEANumberforContract = responseData.supportEntitlementList.encryptedEANumber;
					totcount = responseData.supportEntitlementList.supportList;
					newRow.data("fnSupportList",responseData.supportEntitlementList.supportList);
					cplContract = responseData.specialContractType;
					successGetRowDataSupport = true;
					ice.managelicense.getRowdataOrder(newRow);
				}else { 
					successGetRowDataSupport = false;
					ice.managelicense.getRowdataOrder(newRow);
				}
            },
			complete: function(data){
				if($('table#licenseDetail tbody tr:first td:eq(0) a').hasClass('open') && $('table#licenseDetail tbody tr.dynamicRow:first td:eq(0)').find('.addCustomLabel').is(':visible')){
					ice.managelicense.processBeaks();
				}
            }
        });
    },
    getRowdataOrder: function (newRow) {
		totcountOrder = '';
		//BUG-00052407 to send EA for encryption
		var EANumber = ice.eaSelector.getSelectedEANumber();
    	var _urlOrderDetail = urlOrderDetail + "&param=" + newRow.prev('tr').find('td:eq(0) .openCloseSelect input').val() +"&flag=" +EANumber;
		var _errTxt='';
        $.ajax({
            type: "GET",
            dataType: "",
            url: _urlOrderDetail,
             success: function (data) { 
				var responseData = vmf.json.txtToObj(data);
				//Encrypted EA number to build URL
				encryptedEANumberforOrder = responseData.encryptedEANumber;
            	 if (responseData && (typeof(responseData.error)=='undefined') || responseData.error==false){
					if(responseData.orderList!=undefined && responseData.orderList!=null){
						totcountOrder = responseData.orderList;
						newRow.data("fnOrderList",responseData.orderList);
						ice.managelicense.getRowdataTest(newRow);
					} else{
						ice.managelicense.noSupportInfo(responseData, newRow);
					}
				} else {
					if(successGetRowDataSupport==true){
						ice.managelicense.getRowdataTest(newRow);
					} else {
						ice.managelicense.noSupportInfo(responseData, newRow);
						//newRowRender.find('td').html('License key does not have support.');
					}
                }
             }
        });
    },
	noSupportInfo: function(data, newRow){
		var _notes = "", _sOut=[];
		if (data.notes!=undefined){
			_notes = data.notes;
		}
		_sOut.push('<div class="more-details" style="display:block;">');
		_sOut.push('<div class="textStrong">'+ice.globalVars.noSupport+'</div>');
		newRow.find('td').append(_sOut.join(' ')).find('div.loading_small').remove();
		newRow.find('td').find("div.note").attr('id', lkey);
	},
    getRowdataTest: function (newRow) {
    	var _notes = "";
		if (totcountOrder[0]) {
			_notes = totcountOrder[0].notes;
		} 
		var fnSuuportListArr = newRow.data("fnSupportList");
        if (typeof fnSuuportListArr != "undefined" && fnSuuportListArr.length) {

			var _sOut = "", contractNumOrSID = "";
	        _sOut = '<div class="more-details" style="display: block;">';
	        _sOut += '<div class="divide-table-wrapper support">';
	        _sOut += '<table>';

	        if(fnSuuportListArr[0].serviceId != ""){
	        	contractNumOrSID = mlRS.common.serviceId;
	        }else{
	        	contractNumOrSID = contractNumberGlobal;
	        }

        	_sOut += '<thead class="no-border"> <tr><th class="col1">'+supportLevelGlobal+'</th><th class="col2">'+endDateGlobal+'</th><th class="col3">'+quantityGlobal+'</th><th class="col4">'+contractNumOrSID+'</th></tr></thead>';
	        
            for (i = 0; i < fnSuuportListArr.length; i++) {
            	//var _contractDetailsCall = viewContractDetailsUrl + '/-/contractHistoryPortlet/contract/' + fnSuuportListArr[i].contractId; To test
				//Changes as part of BUG-00052407
            	var _contractDetailsCall = viewContractDetailsUrl + '?_VM_action=viewContractDetails&_VM_contractID=' + fnSuuportListArr[i].encryptedContractId + '&_VM_contractStatus=' + fnSuuportListArr[i].status + '&_VM_selectedEANumber=' + encryptedEANumberforContract;
				var _elaType = "";
				if((fnSuuportListArr[i].elaType != undefined) && (fnSuuportListArr[i].elaType != "")){
					_elaType = '<span class="badge ela">'+fnSuuportListArr[i].elaType+'</span>';
				}
				_isAllowed = fnSuuportListArr[i].allowed;
					
				if(fnSuuportListArr[i].serviceId != ""){
					if(_isAllowed == true){	
	                	_sOut += '<tbody><tr><td class="col1">' + fnSuuportListArr[i].subTypeDescription + '</td><td class="col2">' + fnSuuportListArr[i].expirationDate + '</td><td class="col3">' + fnSuuportListArr[i].quantity + '</td><td class="col4"><a target="_blank" href="'+mlRS.common.serviceIdUrl+'&_VM_serviceInstanceId='+fnSuuportListArr[i].encryptedServiceId+'">' + fnSuuportListArr[i].serviceId + '</a>'+_elaType+'</td></tr></tbody>';
					}else{
			   			_sOut += '<tbody><tr><td class="col1">' + fnSuuportListArr[i].subTypeDescription + '</td><td class="col2">' + fnSuuportListArr[i].expirationDate + '</td><td class="col3">' + fnSuuportListArr[i].quantity + '</td><td class="col4">' + fnSuuportListArr[i].serviceId +_elaType+'</td></tr></tbody>';
					}
				}else{
					if(_isAllowed == true){
	                	_sOut += '<tbody><tr><td class="col1">' + fnSuuportListArr[i].subTypeDescription + '</td><td class="col2">' + fnSuuportListArr[i].expirationDate + '</td><td class="col3">' + fnSuuportListArr[i].quantity + '</td><td class="col4"><a target="_blank" href='+_contractDetailsCall+'>' + fnSuuportListArr[i].contactNumber + '</a>'+_elaType+'</td></tr></tbody>';
					}else{
			   			_sOut += '<tbody><tr><td class="col1">' + fnSuuportListArr[i].subTypeDescription + '</td><td class="col2">' + fnSuuportListArr[i].expirationDate + '</td><td class="col3">' + fnSuuportListArr[i].quantity + '</td><td class="col4">' + fnSuuportListArr[i].contactNumber +_elaType+'</td></tr></tbody>';
					}
				}

				
            }
        } else {
			_sOut += '<tbody><tr><td class="col1" colspan="4">'+ice.globalVars.productsNoSupportMsg+'</td></tr></tbody>';	
        }
        _sOut += '</table></div>';
        // Order detials
        _sOut += '<div class="divide-table-wrapper order">';
        _sOut += '<table>';
		var fnOrderListArr = newRow.data("fnOrderList");
         if (typeof fnOrderListArr != "undefined" && fnOrderListArr.length) {
            _sOut += '<thead class="no-border"><tr><th class="col1">'+orderNumberGlobal+'</th><th class="col2">'+orderDateGlobal+'</th><th class="col3">'+quantityGlobal+'</th><th class="col4">'+poNumberGlobal+'</th></tr></thead>';
            for (var i = 0; i < fnOrderListArr.length; i++) {
            	//var _orderDetailsCall = viewContractDetailsUrl + '/-/contractHistoryPortlet/order/' + totcountOrder[i].orderNumber+'/'+0;
				//Changes as part of BUG-00052407
            	var _orderDetailsCall = viewContractDetailsUrl + '?_VM_action=loadOrderDetails&_VM_orderId=0&_VM_ordernumber=' + fnOrderListArr[i].encryptedOrderNumber + '&_VM_selectedEANumber=' + encryptedEANumberforOrder;
            	_isAllowedToViewOrder = fnOrderListArr[0].allowed;
            	if(_isAllowedToViewOrder == true){
                _sOut += '<tbody><tr><td class="col1"><a target="_blank" href='+_orderDetailsCall+'>' + fnOrderListArr[i].orderNumber + '<a></td><td class="col2">' + fnOrderListArr[i].orderDate + '</td><td class="col3">' + fnOrderListArr[i].quantity + '</td>';
            	}else{
            	_sOut += '<tbody><tr><td class="col1">' + fnOrderListArr[i].orderNumber + '</td><td class="col2">' + fnOrderListArr[i].orderDate + '</td><td class="col3">' + fnOrderListArr[i].quantity + '</td>';
            	}
                if (fnOrderListArr[i].ponumber != null) _sOut += '<td class="col4">' + fnOrderListArr[i].ponumber + '</td></tr></tbody>';
                else _sOut += '<td class="col4">&nbsp;</td></tr></tbody>';
            }
        } else {
            _sOut += '<tbody><tr><td class="col1" colspan="4">'+ice.globalVars.licenseNoOrderMsg+'</td></tr></tbody>'; 
        }
        _sOut += '</table></div>';  
        if ( cplContract == "") {    
          _sOut += '<div class="divide-table-wrapper key"><a href="#">'+viewLicenseHistoryGlobal+'</a></div></div>';
        }
        newRow.find('td').append(_sOut).find('div.loading_small').remove();
		newRow.find('td').find("div.note").attr('id', lkey);
		newRow.find('td').find('div.key a').unbind('click').click(function(){
			ice.managelicense.viewLicenseHistory($(this).attr('id'));
			return false;
		});
		$('#keyManagement .key').css({'float':'none'});
		$('#keyManagement .openCloseSelect .key').css({'float':'left'});
    },
	resetFilter:function(){
		if($('#filterAreaDiv').css('display') == "block")	{
			if($('#productName').val()!=''){
				$('#productName').val('');
			} if($('#licenseKey').val()!=''){
				$('#licenseKey').val('');
			} if($('#notesKey').val()!=''){
				$('#notesKey').val('');
			} if($('#orderDateFrom').val()!=ice.managelicense.placeHolderFormat) {
				$('#orderDateFrom').val(ice.managelicense.placeHolderFormat);
				$('#orderDateFrom').val('');
			} if($('#productName').val()!='') {
				$('#productName').val('');
			} if($('#orderDateTo').val()!=ice.managelicense.placeHolderFormat) {
				$('#orderDateTo').val(ice.managelicense.placeHolderFormat);
				$('#orderDateTo').val('');
			} if($('#orderNumber').val()!='') {
				$('#orderNumber').val('');
			} if($('#contractNumber').val()!='') {
				$('#contractNumber').val('');
			} if($('#contractEndDateFrom').val()!=ice.managelicense.placeHolderFormat) {
				$('#contractEndDateFrom').val(ice.managelicense.placeHolderFormat); 
				$('#contractEndDateFrom').val(''); 
			} if($('#contractEndDateTo').val()!=ice.managelicense.placeHolderFormat) {
				$('#contractEndDateTo').val(ice.managelicense.placeHolderFormat);
				$('#contractEndDateTo').val('');
			}
			$('div.clbl_ctrlHolder:gt(0)').remove();
			$('div.clbl_ctrlHolder').find('a#add_searchlbl').show();
			if($('select.selectlabel') != ''){$('select.selectlabel').val('');}
			if($('input.lbl_value').val() != ''){$('input.lbl_value').val('');}
			$('input.lbl_value').attr('disabled','disabled');
			ice.ui.enableContractFields();
			ice.ui.enableOrderFields();
			if($('#sel_wantTo').val() != "viewLicense") ice.managelicense.handleContinueBtn('show','disabled');
            $('#keyManagement, #productMessage, #currentProductName, .rightaligned_link').slideUp('slow', function(){
				ice.managelicense.adjustHt();
			});
			if (selectedAllFoldersId != null && selectedAllFoldersId.length) {
				urlProductSummary = resourceUrlProductSummary +'&iWantToSelection=' + $('#sel_wantTo').val();
				data="param=" + selectedAllFoldersId.join(',');
				vmf.datatable.reload($('#productSummary'),urlProductSummary, ice.managelicense.postProcessingData,"POST", data);
			}
		}
	},
	/* exposed filter comment

    loadFilter: function () {
        $('div.filter-section').append('<div id="filterAreaDiv" class="filter-content" style="display:none;"></div>');
		$.get(loadFilter, function (data) {
            try {
                var _jsSer = vmf.json.txtToObj(data);
                if (_jsSer !==null && _jsSer.error) {
                    return false;
                }
            } catch (error) {}
            $('#filterAreaDiv').html(data);
			ice.managelicense.adjustHt();
            var _orderStartDate = vmf.dom.id("orderDateFrom");
            var _orderEndDate = vmf.dom.id("orderDateTo");
            // Initialize the calendars
            vmf.calendar.build(vmf.dom.get(".txt_datepicker"), {
            	dateFormat: 'yyyy-mm-dd', //should be in small case :: nmarkapuram
                startDate: '1900-01-01',
				endDate: '2020-12-31',
				startDate_id: vmf.dom.id('orderDateFrom'),
				endDate_id: vmf.dom.id('orderDateTo')
				
            });
            // Bind event handler to the startDate calendar
            vmf.dom.addHandler(_orderStartDate, "dpClosed", function(e, selectedDate){
                var d = selectedDate[0];
                if(d){
                    d = new Date(d);
                    vmf.calendar.setStartDate(_orderEndDate, d.addDays(1).asString());
					if($("#orderDateFrom").val() != null && $("#orderDateFrom").val() !='')	{
						ice.ui.disableContractFields();
					}
                }
            });
            // Bind event handler to the endDate calendar
            vmf.dom.addHandler(_orderEndDate, "dpClosed", function(e, selectedDate){
                var d = selectedDate[0];
                if(d){
                    d = new Date(d);
                    vmf.calendar.setEndDate(_orderStartDate, d.addDays(-1).asString());
					if($("#orderDateTo").val() != null && $("#orderDateTo").val() !='')	{
						ice.ui.disableContractFields();
					}
                }
            });
         // Local variables to hold calendar elements
            var _contractStartDate = vmf.dom.id("contractEndDateFrom");
            var _contractEndDate = vmf.dom.id("contractEndDateTo");
            // Initialize the calendars
            vmf.calendar.build(vmf.dom.get(".txt_datepicker"), {
            	dateFormat: 'yyyy-mm-dd', //should be in small case :: nmarkapuram
                startDate: '1900-01-01',
				endDate: '2020-12-31',
				startDate_id: vmf.dom.id('contractEndDateFrom'),
				endDate_id: vmf.dom.id('contractEndDateTo')

				
            });
            // Bind event handler to the startDate calendar
            vmf.dom.addHandler(_contractStartDate, "dpClosed", function(e, selectedDate){
                var d = selectedDate[0];
                if(d){
                    d = new Date(d);
                    vmf.calendar.setStartDate(_contractEndDate, d.addDays(1).asString());
					if($("#contractEndDateFrom").val() != null && $("#contractEndDateFrom").val() !='')	{
						ice.ui.disableOrderFields();
					}
                }
            });
            // Bind event handler to the endDate calendar
            vmf.dom.addHandler(_contractEndDate, "dpClosed", function(e, selectedDate){
                var d = selectedDate[0];
                if(d){
                    d = new Date(d);
                    vmf.calendar.setEndDate(_contractStartDate, d.addDays(-1).asString());
					if($("#contractEndDateTo").val() != null && $("#contractEndDateTo").val() !='')	{
						ice.ui.disableOrderFields();
					}
                }
            });
			// Include placeholder for date input fields
			myvmware.common.putplaceHolder('.txt_datepicker');
           
            $('#orderNumber').bind("change keyup input" ,function() {				
				if($('#orderNumber').val() != null && $('#orderNumber').val() != ''){
					ice.ui.disableContractFields();
				}else{
					ice.ui.enableContractFields();
				}
			}); 
			$('#contractNumber').bind("change keyup input" ,function() {
				if($("#contractNumber").val() != null && $("#contractNumber").val() != ''){
					ice.ui.disableOrderFields();
				}else{
					ice.ui.enableOrderFields();
				}
			});
			$('#orderDateFrom').keyup(function() {
				if(($("#orderDateFrom").val() != null && $("#orderDateFrom").val() !='' && $("#orderDateFrom").val() != ice.managelicense.placeHolderFormat) || ($("#orderDateTo").val() != null && $("#orderDateTo").val() !='' && $("#orderDateTo").val() != ice.managelicense.placeHolderFormat)){
					ice.ui.disableContractFields();
				}else{
					ice.ui.enableContractFields();
				}
			});
			$('#contractEndDateTo').keyup(function(){
				if(($("#contractEndDateFrom").val() != null && $("#contractEndDateFrom").val() !='' && $("#contractEndDateFrom").val() != ice.managelicense.placeHolderFormat) || ($("#contractEndDateTo").val() != null && $("#contractEndDateTo").val() !='' && $("#contractEndDateTo").val() != ice.managelicense.placeHolderFormat)){
					ice.ui.disableOrderFields();
				}else{
					ice.ui.enableOrderFields();
				}
			});
			$('#orderDateTo').keyup(function(){
				if(($("#orderDateFrom").val() != null && $("#orderDateFrom").val() !='' && $("#orderDateFrom").val() != ice.managelicense.placeHolderFormat) || ($("#orderDateTo").val() != null && $("#orderDateTo").val() !='' && $("#orderDateTo").val() != ice.managelicense.placeHolderFormat)){
					ice.ui.disableContractFields();
				}else{
					ice.ui.enableContractFields();
				}
			});
			$('#contractEndDateFrom').keyup(function() {
				if(($("#contractEndDateFrom").val() != null && $("#contractEndDateFrom").val() !='' && $("#contractEndDateFrom").val() != ice.managelicense.placeHolderFormat) || ($("#contractEndDateTo").val() != null && $("#contractEndDateTo").val() !='' && $("#contractEndDateTo").val() != ice.managelicense.placeHolderFormat )){
					ice.ui.disableOrderFields();
				}else{
					ice.ui.enableOrderFields();
				}
			});
            var _filterconfig = new Object();
            _filterconfig.licenseKeyLength = 5;
            _filterconfig.notesKeyLength = 1;
            _filterconfig.filterFormId = "licenseKeyFilterForm";
            ice.ui.validatefilter(_filterconfig);
            $("#licenseKeyFilterForm").submit(function () {
                return false;
            });			
            $("#applyfilter").click(function () {
				if($("#productName").val() != ""){
                     if($("#orderDateFrom").val()==ice.managelicense.placeHolderFormat || $("#orderDateTo").val()==ice.managelicense.placeHolderFormat)
                       {
                          $("#orderDateFrom, #orderDateTo").val('');
                       }
					   if($("#contractEndDateFrom").val()==ice.managelicense.placeHolderFormat ||  $("#contractEndDateTo").val()==ice.managelicense.placeHolderFormat)
                       {
                          $("#contractEndDateFrom, #contractEndDateTo").val('');
                       }
                }
                if($("#licenseKey").val()!= ""){
                       if($("#orderDateFrom").val()==ice.managelicense.placeHolderFormat || $("#orderDateTo").val()==ice.managelicense.placeHolderFormat)
                       {
                          $("#orderDateFrom, #orderDateTo").val('');
                       }
					   if($("#contractEndDateFrom").val()==ice.managelicense.placeHolderFormat ||  $("#contractEndDateTo").val()==ice.managelicense.placeHolderFormat)
                       {
                          $("#orderDateFrom, #orderDateTo, #contractEndDateFrom, #contractEndDateTo").val('');
                       }
                }
				if($("#contractNumber").val()!= ""){
                      if($("#contractEndDateFrom").val()==ice.managelicense.placeHolderFormat ||  $("#contractEndDateTo").val()==ice.managelicense.placeHolderFormat)
                       {
                          $("#contractEndDateFrom, #contractEndDateTo").val('');
                       }
                }
				var eflag = false,lmsg=false,sflag=false,labelValueLength = 2;
				$('select.selectlabel').each(function(cnt,elm){					
					if($(elm).val()!="" && !eflag){
						if($(elm).next('input.lbl_value').val() != ""){
							var lblval = $(elm).next('input.lbl_value').val();
							if($.trim(lblval).length <= labelValueLength && !lmsg) {
								sflag = true;
								lmsg = true;
							}
							eflag = false;
						}else{
							sflag = true;
							eflag = true;
						}
					}else{
						if($(elm).next('input.lbl_value').val() != ""){
							sflag = true;
						}
					}
				});
				//Nov release
				if($("#notesKey").val()!= ""){
                    if($("#orderDateFrom").val()==ice.managelicense.placeHolderFormat || $("#orderDateTo").val()==ice.managelicense.placeHolderFormat)
                    {
                       $("#orderDateFrom, #orderDateTo").val('');
                    }
					   if($("#contractEndDateFrom").val()==ice.managelicense.placeHolderFormat ||  $("#contractEndDateTo").val()==ice.managelicense.placeHolderFormat)
                    {
                       $("#orderDateFrom, #orderDateTo, #contractEndDateFrom, #contractEndDateTo").val('');
                    }
                }//End of Nov Release
				if($("#orderNumber").val()!= ""){
                      if($("#orderDateFrom").val()==ice.managelicense.placeHolderFormat || $("#orderDateTo").val()==ice.managelicense.placeHolderFormat)
                       {
                          $("#orderDateFrom, #orderDateTo").val('');
                       }
                }
				if(!sflag && $('input.lbl_value').val() == ""){
					var _formValid = $("#licenseKeyFilterForm").valid();
				}else{var _formValid = true;}
                var _formFieldLength = $('#licenseKeyFilterForm').serialize();
				
				if(eflag || lmsg || sflag){
					var aMsg = '';
					if(eflag && lmsg){
						aMsg = '<p class="error labelerror">'+ice.globalVars.enterLabelWith3Msg+'</p>';
					}else if(eflag){
						aMsg = '<p class="error labelerror">'+ice.globalVars.enterLabelMsg+'</p>';
					}else if(lmsg){aMsg =  '<p class="error labelerror">'+ice.globalVars.labelMustbe3CharMsg+'</p>';}
					if(sflag && lmsg){
						aMsg =  '<p class="error labelerror">'+ice.globalVars.labelMustbe3CharMsg+'</p>';
					}else if(sflag && eflag){
						aMsg = '<p class="error labelerror">'+ice.globalVars.enterLabelMsg+'</p>';
					}else{aMsg =  '<p class="error labelerror">'+ice.globalVars.selectLabelMsg+'</p>';}
					if($('div#simplemodal-container').find('div#errorpopup').length != 0){
						$('div#errorpopup').find('div#error_message').append(aMsg);
					}else{
						vmf.modal.show('errorpopup', { 
						checkPosition: true,
						onShow: function (dialog) {
								$('div#errorpopup').find('div#error_message').append(aMsg);
							}
						});
					}
					eflag=false;
					lmsg = false;
					sflag = false;
					return false;
				}
				if (_formValid && _formFieldLength.length != 121) {
                    ice.managelicense.loadFilterData();
                }
            });
            //ADDED CODE FOR RESET button
            $('#resetFilter').addClass('disabled');
            $("#licenseKeyFilterForm #productName,:input[type='text'],#notesKey,select.selectlabel").bind('change keyup',function(e){
				var errorFlag = false;
            	$('#resetFilter').removeClass('disabled');
				if($(e.target).hasClass('selectlabel')){
					var eOb = $(this);
					var eObval = $(eOb).val();
					eOb.next('input.lbl_value').removeAttr('disabled','disabled');
					if(eObval != ""){
						$(e.target).closest('div.filter-content-wrapper').find('select.selectlabel').not(this).each(function(cnt, sObj){
							if($(sObj).val().toString().toLowerCase() == $(eOb).val().toString().toLowerCase()){
								$('#manageLicenseExceptionMessage').html(myvmware.common.buildLocaleMsg(ice.globalVars.alreadySelectedLbl,eObval));//selectDifferentLabelMsg
								errorFlag = true;
								$(eOb).val('');
								vmf.modal.show("manageLicenseExceptionMessagePopup");
							}
						});
						if(errorFlag) {eOb.next('input.lbl_value').attr('disabled','disabled');errorFlag=false;}
					}else{
						eOb.next('input.lbl_value').attr('disabled','disabled');errorFlag=false;
					}
				}
            });
			$('#resetFilter').click(function(){
				if($(this).hasClass('disabled')){ return false;}
				else{
					ice.managelicense.resetFilter();
					$('#resetFilter').addClass('disabled');
				  }
			});
			
			//Update the product combo in aply filter
			if($('#productSummary tbody').find('tr').length > 0){
				ice.managelicense.populateProductNameCombo();
			}
			$('a#add_searchlbl').die('click').live('click', function(e){
				ice.managelicense.validateLabels(e)
				e.preventDefault();
			})
			$('div#filterAreaDiv').find('input.lbl_value').attr('disabled','disabled');
        });
    },
    

    loadFilterData: function () {
        var _postDataUrl = $("#licenseKeyFilterForm").serialize();
		var selStr = "", valStr = "";
		$('.selectlabel').each(function(i, selected){ 
		  selStr += $(selected).val() +"~";
		  valStr += $(selected).next('.lbl_value').val()+"~";
		});
		selStr = selStr.replace(/~([^~]*)$/,'$1'); // Replace last occurance of '~'  
        valStr = valStr.replace(/~([^~]*)$/,'$1'); // Replace last occurance of '~' 
		_postDataUrl += "&labelKey="+selStr +"&labelVal="+encodeURI(valStr);
//		_postDataUrl["labelVal"]=valArr;
//		+"&labelVal="+valArr;
		//$("#currentProductName, .rightaligned_link").hide();
		$('#keyManagement, #productMessage, #currentProductName,.rightaligned_link').slideUp('slow', function(){
			ice.managelicense.adjustHt();
		});
        //$('#licenseDetail_wrapper').replaceWith('<table id="licenseDetail"><thead></thead><tbody></tbody></table>');
        if (selectedAllFoldersId != null && selectedAllFoldersId != '') {		    
			ice.managelicense.loadFilteredProductSummary(filterLicenseKeyDataUrl +'&iWantToSelection=' + $('#sel_wantTo').val(), resourceDetailPageURL, tabDetailOrderUrl, tabDetailSupportUrl, _postDataUrl+'&param='+selectedAllFoldersId);
		}
    },

    exposed filter commnet */
    loadFilteredProductSummary: function (URLProductSummary, urlLicenseDetail, urlOrderDetail, urlSupportDetail, postData) {
		ice.managelicense.filterCall=true; //This flag used to display error message
		vmf.datatable.reload($('#productSummary'),URLProductSummary, ice.managelicense.postProcessingData,"POST",postData);
    },


	clearTable: function(tableId,license_text){
		table = $('#'+tableId).dataTable();
		table.fnClearTable();
		table.find('tbody tr').css("height","150px").addClass('noborder default')
		     .find('td.dataTables_empty').html(license_text);
	},
	postProcessingData: function(table, settings, _json){
		if(_json.error || !settings.fnRecordsTotal()){
			var error_text="";
			if (ice.managelicense.filterCall){
				error_text = noResultsForFilterText;
				ice.managelicense.filterErrorMsg=error_text;
			}else{
				switch($('#sel_wantTo').val()) {
					case 'downgradeLicense': 
						error_text= ice.globalVars.noDowngradeMsg;
						break;					
					case 'upgradeLicense':
						error_text=ice.globalVars.noUpgradeMsg;
						break;
					case 'combine':
						error_text=ice.globalVars.noCombineMsg;
						break;
					case 'divide':
						error_text=ice.globalVars.noDevideMsg;
						break;
					case 'move':
						error_text=ice.globalVars.noMoveMsg;
						break;
					case 'viewLicense':
						error_text=ice.globalVars.noViewMsg;
						break;
					default: error_text=noResultsForFilterText;
				}
			}
			
			riaLinkmy('my-licenses : filter-no-results');// omniture event when user filters the products, and no results found

			ice.managelicense.clearTable('productSummary',error_text);
			ice.managelicense.producteaaData=[]; //This is to populate filter values.
		}else{
			$(".content, .filter-section-header", $("#keyManagement")).hide();
			$("#keyManagement, #productMessage").slideDown('slow',function(){ice.managelicense.adjustHt();});
		}
		// dont update the productName's autosuggest when user applies filter. (it has to be updated only when user selects/unselects folder checkboxes)
		if( !ice.managelicense.filterCall ){
			ice.managelicense.populateProductNameCombo();
			myvmware.filters.disableExposedFilterForm(false);
		}else{
			ice.managelicense.filterCall=false;
		}

		$('#folderPane input[type=checkbox]:not([readonly])').not(".unselect").removeAttr('disabled').closest('span').removeClass('disabled');
		$('#filter-section-header .select-all:not(".unselect")').removeAttr('disabled');
		setTimeout(function(){ice.managelicense.adjustHt();},1000);
	},
	RefreshTable : function(tableId, json){
		$('.beak_tooltip_flyout_def').hide();//Added for CR-15768 Tooltips and Beaks
 		table = $('#'+tableId).dataTable();
		oSettings = table.fnSettings();
		table.fnClearTable();
		for (var i=0; i<json.length; i++){
			table.oApi._fnAddData(oSettings, json[i]);
		}
		oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
		table.fnDraw();
		table.oApi._fnInitComplete(oSettings, json[i]);	
		$("#keyManagement").show().slideDown('slow',function(){
			ice.managelicense.adjustHt();
		});
		table.oApi._fnProcessingDisplay( oSettings, false );
	},
	closeLicenseFilter:function(){			
			$('#showFilter').show();
			$('#hideFilterDiv').hide();
			$('#filterAreaDiv').remove();			
		ice.managelicense.adjustHt();			
	},
	showDowngradeVI3OrderList: function () {		    
		//var keyForVI3 = $("#licenseDetailDowngrade tbody tr:first").find("input[type=checkbox]").val();	
		//$('#selectedLicenseKeys').val(keyForVI3);
		$("#contractForm").attr('action', preDowngradeVI3OrdersUrl);
		$("#contractForm").submit();        
	},
	getfolderPermission_success:function(data){
    	
		var _permissionResponse = vmf.json.txtToObj(data);
    	
    },
    getfolderPermission_failure:function(data){
    	alert('Error');
    },
    handleFolderTree: function () {
    	$('.splcontract').remove();
		/* Fix for BUG-00022195 Start*/
		$('#sel_wantTo').attr('disabled', 'disabled');
		//$('button#exportAllToCsvButton').attr('disabled', 'disabled').addClass('disabled');
		$("button#exportAllToCsvButton").hide();
		$("button#showAllUpgradeOptionsButton").hide();
		$('.dropdown li').addClass('inactive');
		$('#findFolder').parent('li').removeClass('inactive');
		/* Fix for BUG-00022195 End*/
    	/* commented the below line as the rendering of select-all checkbox is modified in doing exposed-filter CR */
    	// $('#filter-section-header').html('<input type="checkbox" class="select-all" name="group_all"> &nbsp;<label for="select_all">'+ice.globalVars.selectAllLbl+'</label>');
    	/* code to uncheck the 'select-all' checkbox when new EA has got selected, and disabling the exposed-filter form */
    	$('#filter-section-header').find('.select-all').attr('checked', false);
    	myvmware.filters.disableExposedFilterForm(true);

    	$('#keyManagement').slideUp('slow', function(){
			ice.managelicense.adjustHt();
		});
		if($("#productSummary_wrapper").length)
			ice.managelicense.clearTable("productSummary",viewProductGlobal)
		$("#currentProductName").hide();
        var config = new Object();
        config.uniqueDiv = portletNs;
		config.wrapEllipseBtn = true;
        config.ajaxTimeout = 60000;
        config.npMsgContent = filterLicenseContentMsg;
        config.npMsgFunction = function (msg) {
            ice.managelicense.showExceptionMessages(msg);
        };
        config.cbOnClickFunction = function (folderId, cbState) { 
			ice.managelicense.folderTreeCBClick(folderId,cbState);
        };
        config.cbOnClickSelFoldersEFunction = function (selectedFolders, folderId, cbState) {
        	selectedUsersFolderIds = selectedFolders;
			if($('.'+folderId).children('span').find('input').attr('checked')){
				$('.folderTxt').removeClass('normalWhiteSpace');
				$('.'+folderId).children('span').find('.folderTxt').addClass('normalWhiteSpace').end().find('.openClose,input,.ellipsBadge').addClass('vAlignChilds');
			} else {
				$('.'+folderId).children('span').find('.folderTxt').removeClass('normalWhiteSpace').end().find('.openClose,input,.ellipsBadge').removeClass('vAlignChilds');
			}
			/*CR15768 - Tooltip changes*/
			$('.beak_tooltip_flyout_def').hide();
			if(selectedFolders.length == 1 && cbState == 'checked'){
				myvmware.common.setBeakPosition({
					beakId:myvmware.common.beaksObj["Q1_BEAK_LICENSE_PAGE_FOR_EXPORT_TO_CSV"],
					beakName:"Q1_BEAK_LICENSE_PAGE_FOR_EXPORT_TO_CSV",
					beakHeading:$licenseBeakHeadingCsv,
					beakContent:$licenseBeakContentCsv,
					target:$('.'+folderId).find('span.folderNode'),
					beakLink:'#row1'
				});
			}
			/*CR15768 - Tooltip changes End*/
			$('.dropdown li').addClass('inactive');
			 $('#findFolder').parent('li').removeClass('inactive');
			var productSummaryURL = resourceUrlProductSummary +'&iWantToSelection=' + $('#sel_wantTo').val();
			ice.managelicense.folderTreeCBSelected(productSummaryURL, selectedFolders, folderId, cbState, resourceDetailPageURL, tabDetailOrderUrl,tabDetailSupportUrl);
			
        };
        config.validateJSONFunction = function (folderListJSON) {
            if (folderListJSON.error) {
				$('#manageLicenseExceptionMessage').html(folderListJSON.message);
				vmf.modal.show('manageLicenseExceptionMessagePopup');
            }
        };
        config.cbOnFolderNodeCreate = function(folderElement,folderIds) {
            if(folderElement.find('li span').hasClass('disabled')){
                folderElement.find('li input[type=checkbox]').parent().append('<a class="tooltip" title="'+greyedOutFolderTooltip+'" data-tooltip-position="bottom" href="#">'+greyedOutFolderTooltip+'</a>');
            }
            myvmware.hoverContent.bindEvents($('a.tooltip'), 'defaultfunc');
			/* Fix for BUG-00022195 Start*/
			$('#sel_wantTo').attr('disabled', '');
			//$('button#exportAllToCsvButton').removeAttr('disabled').removeClass('disabled');
			if($('#sel_wantTo').val() == 'viewLicense'){
				$("button#exportAllToCsvButton").show();
				$("button#showAllUpgradeOptionsButton").hide();
			}else if($('#sel_wantTo').val() == 'upgradeLicense'){
				$("button#exportAllToCsvButton").hide();
				$("button#showAllUpgradeOptionsButton").show();
			}else{
				$("button#exportAllToCsvButton").hide();
				$("button#showAllUpgradeOptionsButton").hide();
			}
			
			/* Fix for BUG-00022195 End*/
        };
		/*Start of context menu code - right click CR*/
		config.loadComplete = function () {
			var map = [
				{id: 'add_user',text: ice.globalVars.inviteNewUserLbl,liCls: 'inactive',callBk: ice.managelicense.populateAddUserUI},
				{id: 'share_folder',text: ice.globalVars.shareFolderLbl,liCls: 'inactive',callBk: ice.managelicense.populateShareFolder},
				{id: 'create_folder',text: ice.globalVars.createFolderLbl,liCls: 'inactive',callBk: ice.managelicense.populateAddFolderUI},
				{id: 'delete_folder',text: ice.globalVars.deleteFolderLbl,liCls: 'inactive',callBk: ice.managelicense.populateDeleteFolderUI},
				{id: 'rename_folder',text: ice.globalVars.renameFolderLbl,liCls: 'inactive',callBk: ice.managelicense.populateRenameFolderUI},
				{id: 'move_folder',text: ice.globalVars.moveFolderLbl,liCls: 'inactive',callBk: ice.managelicense.populateMoveFolderUI},
				{id: 'request_access',text: ice.globalVars.requestPermLbl,liCls: 'inactive',callBk: ice.requestAccessPermissions.populateEditPermissionUI},
				{id: 'export_to_CSV',text: ice.globalVars.exportToCsvLbl,liCls: 'inactive',callBk: ice.managelicense.exportToCSV}
			];
			vmf.cmenu.show({
				data: map,
				targetElem: "ltSec #folderPane",
				contextMenuFlag: true,
				actionBtnFlg: true,
				funcName: 'cursorPosition',
				cmenuId: 'folderMenu',
				menuChgState: function (target, cmenuId, disableMnu) {
					var cmenu = $('#' + cmenuId),fManage= $(target).closest('li').data('fManage');
						cmenu.find('a').addClass(disableMnu).parent('li').addClass('inactive');
						if(typeof fManage == "undefined"){
							ice.managelicense.checkFolderPermissions(target);
						}
						if($(target).closest('li').data('fManage')){
							ice.managelicense.setContextMenuState(target,cmenu,disableMnu);
						}
					cmenu.find('a#request_access').removeClass(disableMnu).parent('li').removeClass('inactive');
					
					//on right click if the folder has View permissions then we need enable the export to csv.
					var className = $(target).closest('span').parent('span').attr('class');
					
					if(($('#sel_wantTo').val() == "viewLicense")) {//BUG-00048003 
						$('#export_to_CSV').removeClass('disableMenu').parent('li').removeClass('inactive'); 
					}else {
						$('#export_to_CSV').addClass('disableMenu').parent('li').addClass('inactive'); 			   
					}
					
			/* if(className && className.indexOf('disabled') == -1){
			   menu.find('a#export_to_CSV').removeClass(disableMnu).parent('li').removeClass('inactive');	
			}
			 */	
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
				getTarget: function(target){
					myvmware.common.setAutoScrollWidth('div.folderPane ul');
					return $(target);
				}
			});
			ice.managelicense.setCreateFolderPerm();
			myvmware.common.adjustFolderNode(false);
		};
		/*End of context menu code - right click CR*/
        config.errorFunction = function (response, errorDesc, errorThrown) {
        };
        config.inputType = 'checkbox';
        config.loadingClass = 'ajaxLoading';
        config.expandSelect = false;
		//Added for pull on ice
		var folderTreeResourceUrl = resourceUrl +'&iWantToSelection=' + $('#sel_wantTo').val();
		vmf.foldertree.build(folderTreeResourceUrl, config);
        //vmf.foldertree.build(resourceUrl, config);
    },
	folderTreeCBClick: function (folderId, cbState) {
        var _folderHT = vmf.foldertree.getFolderHashtable();
        var _folderTreeObj = vmf.foldertree.getFolderJSON();
        if (cbState == "checked") {
            var _fullFolderPath = _folderHT.get(folderId).fullFolderPath;
            var _selectedFolderName = _folderHT.get(folderId).folderName;
            var _folderAccess = _folderHT.get(folderId).folderAccess;
            var _parentFolderId = _folderHT.get(folderId).parentFolderId;
            $("#parentFolderId").val(_parentFolderId);
            $("#fullFolderPath").val(_fullFolderPath);
            $("#selectedFolderName").val(_selectedFolderName);
            $("#folderId").val(folderId);
            $("#folderAccess").val(_folderAccess);
			$('#findFolder').css({"color":"#ACE3FF"});
            $('#selectedFolderId').val(folderId);			
        } else {
			$('#findFolder').css({"color":"#ACE3FF"});
        }
    },
    showExceptionMessages: function (message) {
        $('#manageLicenseExceptionMessage').html(message);
        vmf.modal.show("manageLicenseExceptionMessagePopup");
    },
	populateAddFolderUI:function(targetDetailsObj) {
		$('.error').html('');
		riaLinkmy('license-keys : create-folder');
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
				vmf.dropdown.build($("select#listFolderPathCreate"), {optionsDisplayNum:20,optionMaxLength:37,inputMaxLength:37,position:"left",optionsClass:'overlayOpts',onSelect:ice.managelicense.activateSaveBtn,optionsHolderInline:true});
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
	confirmAddFolder:function(){ 		
		var _newfolderName = $("#newFolderId").val();
		var _folderid = $("#listFolderPathCreate option:selected").val();
		var duplicate = vmf.foldertree.duplicateFolder(_folderid, _newfolderName);
		if(_newfolderName.length > 0) {		
            if(duplicate) { //Check for duplicate folder
                $('.error').html(ice.globalVars.duplicateFolderMsg);
            }
            else if(!(_newfolderName.match(regexAddFolder))) { //Validate folder name against regex
                $('.error').html(invalidFolderMsg);
            }
            else {
				$('#confirm').attr('disabled',true).addClass('waitcursor');//BUG-00021672
				var _fullFolderPath = $('#confirm').data('fPath');
                var _addFolderUrl = $("#createFolderResourceUrl").val();
                var _postData = new Object();
                _postData['selectedFolderId'] = _folderid;
                _postData['newFolderName'] = _newfolderName;
                $.ajax({
                    type: 'POST',
                    url: _addFolderUrl,
                    dataType: "json",
                    data: _postData,
                    success: function (data) {
						if(data == null || !data.error)
                        ice.managelicense.onSuccess_createFolder(data);
						else
						ice.managelicense.onFail_createFolder(data.message);
                    },
                    error: function (response, errorDesc, errorThrown) {
                        //console.log("In error: " + errorThrown);
                        ice.managelicense.onFail_createFolder(ice.globalVars.unknownErrorOccurMsg);
                    }
                });
			}
		}
		else {
			$('.error').html(ice.globalVars.folderNameHint);
		}
	},
	onSuccess_createFolder:function(data){
		var _createErrmsg = vmf.json.txtToObj(data);
		if(_createErrmsg!=null && _createErrmsg.error){
			$('#confirm').attr('disabled',false).removeClass('waitcursor');//BUG-00021672
			$('.error').html(_createErrmsg.message);// BUG-00019110
			return;
		}else{
			vmf.modal.hide();
			ice.managelicense.handleFolderTree();
		}
	},
	onFail_createFolder:function(errorMessage){
		$('.error').html(errorMessage);
		$('#confirm').attr('disabled',false).removeClass('waitcursor');
		$('#createFolderTable #newFolderId').removeClass('waitcursor');
	},
	populateRenameFolderUI:function(targetDetailsObj) { 
	    ice.common.wordwrap('existingFolderName', '\\\\'+targetDetailsObj.fPath,'50','</br>','true');
		//$("#existingFolderName").html($("#fullFolderPath").val()); //BUG-00019126
		$('.error').html('');
		myvmware.common.putplaceHolder('#renameFolderId');
		 $('#renameConfirm').data({fPath:targetDetailsObj.fPath,fId:targetDetailsObj.fId});
		riaLinkmy('license-keys : rename-folder');
		vmf.modal.show("renameFolderContent");
	},
	confirmRenameFolder:function(){ 
		var _newfolderName = $("#renameFolderId").val();
		var _folderid =  $('#renameConfirm').data('fId');
		var duplicate = vmf.foldertree.duplicateFolder(_folderid, _newfolderName);
		 if((_newfolderName.length > 0) && (_newfolderName != ice.globalVars.folderNameHint)){ //BUG-00061959
			if(duplicate){		
				$('.error').html(ice.globalVars.duplicateFolderMsg);
			} 
            else if(!(_newfolderName.match(regexAddFolder))) { //Validate folder name against regex
				$('.error').html(invalidFolderMsg);
			}
            else {
                $('#renameConfirm').attr('disabled',true).addClass('secondary');//BUG-00021672
				var _fullFolderPath =  $('#renameConfirm').data('fPath');
				var _renameFolderUrl = $("#renameFolderResourceUrl").val();
                var _postData = new Object();
                _postData['selectedFolderId'] = _folderid;
                _postData['newFolderName'] = _newfolderName;
                $.ajax({
                    type: 'POST',
                    url: _renameFolderUrl,
                    dataType: "json",
                    data: _postData,
                    success: function (data) {
						if(data == null || !data.error)
                        ice.managelicense.onSuccess_renameFolder(data);
						else
						ice.managelicense.onFail_renameFolder(data.message);
                    },
                    error: function (response, errorDesc, errorThrown) {
                        //console.log("In error: " + errorThrown);
                        ice.managelicense.onFail_renameFolder(ice.globalVars.unknownErrorOccurMsg);
                    }
                });
            }
		}
		else {
			$('.error').html(ice.globalVars.folderNameHint);
		}
	},
	onSuccess_renameFolder:function(data){
		var _renameErrmsg = vmf.json.txtToObj(data);
		if(_renameErrmsg!=null && _renameErrmsg.error){
			$('#renameConfirm').attr('disabled',false).removeClass('secondary');//BUG-00021672
			$('.error').html(_renameErrmsg.message);// BUG-00019110
			return;
		}else{
			vmf.modal.hide();
			ice.managelicense.handleFolderTree();
		}
	},
	onFail_renameFolder:function(errorMessage){
		$('#renameConfirm').attr('disabled',false).removeClass('secondary');//BUG-00021672
		$('.error').html(errorMessage);
	},
	populateDeleteFolderUI:function(targetDetailsObj) { 
	    ice.common.wordwrap('deleteFolderLocation', '\\\\'+targetDetailsObj.fPath,'50','</br>','true');
		//$("#deleteFolderLocation").html($("#fullFolderPath").val());
		$('.error').html('');
		$('#deleteFolderConfirm').data({fPath:targetDetailsObj.fPath,fId:targetDetailsObj.fId,fName:targetDetailsObj.fName});
		vmf.modal.show("deleteFolderContent");
		if(typeof(riaLinkmy) == 'function'){
            riaLinkmy("my-licenses : delete-folder");
        }
	},
	confirmDeleteFolder:function(){ 
		$('#deleteFolderConfirm').attr('disabled',true).addClass('secondary');//BUG-00021672
		_folderid = $('#deleteFolderConfirm').data('fId');
		_fullFolderPath = $('#deleteFolderConfirm').data('fPath');
		$("#deleteFolderName").data($('#deleteFolderConfirm').data('fName'));
		var _deleteFolderUrl = $("#deleteFolderResourceUrl").val()+ '&selectedFolderId=' + _folderid;
		vmf.ajax.post(_deleteFolderUrl,null,ice.managelicense.onSuccessDeleteFolder,ice.managelicense.onFailDeleteFolder);
	},
	onSuccessDeleteFolder : function(data){
		var _deleteErrmsg = vmf.json.txtToObj(data);
		if(_deleteErrmsg!=null && _deleteErrmsg.error){
			vmf.modal.hide();
			$('#deleteFolderConfirm').attr('disabled',false).removeClass('secondary');//BUG-00021672
			$("#deleteFolderName").html($("#deleteFolderConfirm").data('fName'));
			$("#deleteFolderNameTwo").html($("#deleteFolderConfirm").data('fName'));
			$('#error').html(_deleteErrmsg.message);// BUG-00019110
			vmf.modal.hide("deleteFolderContent");
			ice.managelicense.showDeleteFailureContent();
		}else{
			vmf.modal.hide();
			ice.managelicense.handleFolderTree();
		}
		if(typeof(riaLinkmy) == 'function'){
            riaLinkmy("my-licenses : delete-folder : confirm");
        }
	},	
	showDeleteFailureContent: function (data) {
		setTimeout(function(){vmf.modal.show("deleteFolderFailureContent");},10);// to show the second popup (As raghavendra suggested for fixing IE compat.. , we added settimeout() )	
	},
	onFailDeleteFolder : function(data){
		$('#deleteFolderConfirm').attr('disabled',false).removeClass('secondary');//BUG-00021672
		$('.error').html(ice.globalVars.unknownErrorOccurMsg);
	},
	populateMoveFolderUI: function(targetDetailsObj) {
		$("#moveFolderName").html('');
		$('.error').html('');
		ice.common.wordwrap('moveFolderName', '\\\\'+targetDetailsObj.fPath,'50','</br>','true');
		//$("#moveFolderName").append($("#fullFolderPath").val()); //BUG-00019126
		var _foldersContentDataUrl = $loggedInUserFoldersWithManagepermissionUrl;
		var _folderPathHTML = new Array();
		var _currentfolderPath = targetDetailsObj.fPath;
		var _parentFolderId = targetDetailsObj.parentfId;
		$.post(_foldersContentDataUrl, function(data)
		{
			var foldersContentJsonResponse = vmf.json.txtToObj(data);
				_folderPathHTML.push("<select id='listFolderPath' class='wide'><option value=\"null\">"+ice.globalVars.selectOneLbl+"</option>");
				$.each(foldersContentJsonResponse.folderPathList, function(){
					if(this.folderId!=_parentFolderId && this.fullFolderPath.indexOf(_currentfolderPath)<0)
					_folderPathHTML.push("<option value='"+this.fullFolderPath+"'>"+this.fullFolderPath+"</option>");
				});
				_folderPathHTML.push("</select>");
				$("#fullFolderPathList").html(_folderPathHTML.join(' '));
				$(".overlayOpts").remove();
				vmf.dropdown.build($("select#listFolderPath"), {optionsDisplayNum:20,optionMaxLength:37,inputMaxLength:37,position:"left",onSelect:ice.managelicense.activateMoveContinueBtn,optionsClass:'overlayOpts',optionsHolderInline:true});
		});
		$('#moveFolderconfirm').data({fPath:targetDetailsObj.fPath,fId:targetDetailsObj.fId,fName:targetDetailsObj.fName,parentfId:targetDetailsObj.fId});
		vmf.modal.show("moveFolderContent");
		if(typeof(riaLinkmy) == 'function'){
            riaLinkmy("my-licenses : move-folder");
        }
	},
	activateMoveContinueBtn: function(value,text,index){
		if(value!="null"){
			$('#moveFolderNext').removeAttr('disabled').removeClass('disabled');
		} else {
			$('#moveFolderNext').attr('disabled','disabled').addClass('disabled');
		}
		ice.managelicense.populateTargetFolder();
	},
	activateCreateConfirmBtn: function(value,text,index){
		if(value!="null"){
			$('#confirm').removeAttr('disabled').removeClass('disabled');
		} else {
			$('#confirm').attr('disabled','disabled').addClass('disabled');
		}
	},
	confirmMoveFolder: function() {
		$('#moveFolderconfirm').attr('disabled',true).addClass('waitcursor');//BUG-00021672
		var _selectedFolderID = $('#moveFolderconfirm').data('fId');
		var _selectedFolderName = $('#moveFolderconfirm').data('fName');
		var _targetFullFolderPath =   folderpathWithoutSlash;//$("#targetFolderLocation").text();//Fixed BUG-00022584
		var _folderReadTime = $("#folderCacheTimestamp").val();
		var _moveFolderUrl = $("#moveFolderResourceUrl").val();
		var _postData = new Object(); 
		_postData['selectedFolderId'] = _selectedFolderID; 
		_postData['targetFullFolderPath'] = _targetFullFolderPath; 
		_postData['folderReadTime'] = _folderReadTime; 
		
		vmf.ajax.post(_moveFolderUrl,_postData,ice.managelicense.onSuccessMoveFolder,ice.managelicense.onFailMoveFolder);	
	},
	onSuccessMoveFolder: function(data) {
		var _moveErrmsg = vmf.json.txtToObj(data);
		if (_moveErrmsg!= null && _moveErrmsg.error) {
			$('#moveFolderconfirm').attr('disabled',false).removeClass('waitcursor');//BUG-00021672
			if (_moveErrmsg.message != null) {
				$('.error').html(_moveErrmsg.message);// BUG-00019110
			} else {
				$('.error').html(ice.globalVars.unableMoveFolder);
			} 
		} else {
			vmf.modal.hide();
			ice.managelicense.handleFolderTree();
		}
		if(typeof(riaLinkmy) == 'function'){
            riaLinkmy("my-licenses : move-folder : confirm");
        }
	},
	onFailMoveFolder: function(data) {
		$('#moveFolderconfirm').attr('disabled',false).removeClass('waitcursor');//BUG-00021672
		$('.error').html(ice.globalVars.unknownErrorOccurMsg);
	},
	populateConfirmMoveFolderUI:function(){			
		$("#sourceFolderName").html('');
		$("#sourceFolderName").append($('#moveFolderconfirm').data('fName'));
		vmf.modal.show("confirmMoveFolderContent");
	},
	populateTargetFolder:function(){	
	     folderpathWithoutSlash=$("#listFolderPath option:selected").text();
		$("#targetFolderLocation").empty().html("\\\\"+$("#listFolderPath option:selected").text());//fixed bug for folder path BUG-00022584
	},
	exportToCSV:function(obj,flag){
		if(flag){
			var folders  = (flag)?$._selectedFolders.keys():obj.fId;
			var _fPerPostData = new Object();
			if(folders.toString() != ''  && $('#sel_wantTo').val() == "viewLicense"){ // if the folder id is blank then we should not submit from actions menu.
				_fPerPostData['selectedFolders'] = folders.toString();
				_fPerPostData['reportFor'] = 'licenseKeysFromActions';
				myvmware.common.generateCSVreports($exportToCsvFromLicensesUrl, _fPerPostData, "license-keys : actions : export-all", "license-keys : Export-to-CSV : Error");
			}
			/*var folders  = (flag)?$._selectedFolders.keys():obj.fId;
			if ($('#exportCSV_form').length>0)	$('#exportCSV_form').remove();
			if($('body iframe').length==0){
				$('<iframe id="exportCSV_iframe" name="exportCSV_iframe" style="display: none;"/>').appendTo('body');
			}
				var inputs  = '<input type="hidden" name="selectedFolders" value="'+ folders.toString()+'" /><input type="hidden" name="reportFor" value="licenseKeysFromActions" />';
				$("body").append('<form id="exportCSV_form" target="exportCSV_iframe" action="'+ $exportToCsvFromLicensesUrl +'" method="post">'+inputs+'</form>');
				$('#exportCSV_form').submit();*/
		} else {
			var folders  = (flag)?$._selectedFolders.keys():obj.fId;
			var _fPerPostData = new Object();
			_fPerPostData['selectedFolders'] = folders.toString();
			_fPerPostData['reportFor'] = 'licenseKeysFromContextMenu';
			myvmware.common.generateCSVreports($exportToCsvFromLicensesUrl, _fPerPostData, "license-keys : contextmenu : export-all", "license-keys : Export-to-CSV : Error");
			//myvmware.common.generateReports($exportToCsvFromLicensesGetUrl + '&reportFor=licenseKeysFromContextMenu$&folderId='+folders);
		}
	},
	 //Add User to Folder Scripts
	populateAddUserUI:function(targetDetailsObj){
		$('#addusersContent .headerTitle #selFolder_name').remove();
		if(targetDetailsObj.fId){
			$('#addusersContent .headerTitle').append('<span id="selFolder_name">&nbsp;'+ice.globalVars.toLbl+'&nbsp;&ldquo;<span></span>&rdquo;&nbsp;'+ice.globalVars.folderLbl+'</span>');
		}
		ice.inviteUser.addUserStep1Flag = 'invite';
		ice.managelicense.resetAddUserVal(targetDetailsObj);
		selectedUsersFolderIds = ice.inviteUser.selectedFolderId;
		var folder_name = targetDetailsObj.fName;
		$('#folder_name').html('');
		$('#folder_name').append('<img src="/static/myvmware/common/css/img/folder_gray.png" height="10" width="18" alt="'+ice.globalVars.noLbl+'" />');
		$('#folder_name').append('&nbsp;&nbsp;');
		$('#folder_name').append(folder_name);					
		vmf.modal.show('addUserMain', {position:['10%']});
		ice.managelicense.renderAddUser(targetDetailsObj);				
		return false;
	},
	populateShareFolder:function(targetDetailsObj){
		$('.error').html(''); //BUG-00061962
		if($('#shareFolderContent .headerTitle #selFolder_name').length) $('#shareFolderContent .headerTitle #selFolder_name').remove();
		if(targetDetailsObj.fId){
			$('#shareFolderContent .headerTitle span').html('<span id="selFolder_name">&ldquo;<span></span>&rdquo;</span>');
		}
		ice.inviteUser.addUserStep1Flag = 'share';
		ice.managelicense.resetAddUserVal(targetDetailsObj);
		selectedUsersFolderIds = ice.inviteUser.selectedFolderId;
		vmf.modal.show('addUserMain', { position:['10%','20%']});
		$('#addusersContent').hide();
		$('#shareFolderContent').show();
		if(typeof(riaLinkmy) == 'function'){
            riaLinkmy("my-licenses : share-folder");
        }
		$('#totalUsers,#totalSelectedUsers').text(0);
		$('#preLoader').show();
		vmf.ajax.post(manageAccessByUser_action_getUserList_url,null, ice.managelicense.getUsers, ice.managelicense.failGettingUsers);
	},
	resetAddUserVal: function(targetDetailsObj){
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
	},
	getUsers:function(data){
		ice.inviteUser.userJsonResponse = vmf.json.txtToObj(data);
		ice.inviteUser.renderUsers('');
	},
	failGettingUsers:function(data){
		alert(data);
	},
	//Add User
	renderAddUser : function(targetDetailsObj){	
		var _folderid = targetDetailsObj.fId;
		var addUserUrl = $manageAccessAddUserUrl + '&selectedFolderId=' + _folderid;
		vmf.ajax.post(addUserUrl, null, ice.managelicense.get_success, ice.managelicense.get_failure);
	},
	get_success : function(event) {
		var user_list="",list_item="";
		$('#addusersContent #content_8 .loading').hide();
		$('#addusersContent #accountUserPane').show();
		$('#eaNumber').html('');				
		$.userjsonresponse_1 = vmf.json.txtToObj(event);
		user_list = ($.userjsonresponse_1) ? $.userjsonresponse_1.userList : "";
		$('#populate_list .possibleUsersList').html('');
		$('#eaNumber').html(($.userjsonresponse_1)?$.userjsonresponse_1.eaNumber:" ");
		for(var i=0;i<user_list.length;i++){
			$('#populate_list .possibleUsersList').append('<li class="fn_userID_'+(i+1)+'">'+'<input id="checkbox'+(i+1)+'" name="checkbox" value='+user_list[i].customerNumber+' type="checkbox"/>'+'<label for="checkbox'+(i+1)+'">'+user_list[i].firstName+' '+user_list[i].lastName+'</label>'+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="email indent15">'+user_list[i].email+'</span></li>');		
		};
		$('.possibleUsersList li input').click(function(){
			$('#btn_next', $("#addUserMain")).removeAttr("disabled").removeClass('disabled').addClass('button');
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
					if(curId < prevId && flag)	{ 
						
						if(prevClass == "")	{
							$('<li class="' + liClass + '"> <a class="remove" href="#">'+ice.globalVars.removeLbl+'</a><span class="name">' + inputName + '</span> <span class="email emailremove">' + inputEmail + '</span> </li>').insertBefore($('ul.removeUsersList li.'+curClass));									
							$('#addUserMain #validatedUsers').append('<li class="' + liClass + '"> <a class="remove" href="#">Remove</a><span class="name">' + inputName + '</span> <span class="email emailremove">' + inputEmail + '</span> </li>');
							$('#addUsersToFoldersContent4 #selectedAddUsersList').append('<tr class='+liClass+'><td>'+inputName+'</td><td class="label">'+inputEmail+'</td></tr>');		 // invite user's 3rd popup for adding account user							
						}
						else	{
							$('<li class="' + liClass + '"> <a class="remove" href="#">'+ice.globalVars.removeLbl+'</a><span class="name">' + inputName + '</span> <span class="email emailremove">' + inputEmail + '</span> </li>').insertAfter($('ul.removeUsersList li.'+prevClass));
							$('#addUserMain #validatedUsers').append('<li class="' + liClass + '"> <a class="remove" href="#">'+ice.globalVars.removeLbl+'</a><span class="name">' + inputName + '</span> <span class="email emailremove">' + inputEmail + '</span> </li>');
							$('#addUsersToFoldersContent4 #selectedAddUsersList').append('<tr class='+liClass+'><td>'+inputName+'</td><td class="label">'+inputEmail+'</td></tr>');		 // invite user's 3rd popup for adding account user							
						}
						flag = false;
					}
					prevClass = $(this).attr('class');
				});
				if(flag)	{
					$('ul.removeUsersList').append('<li class="' + liClass + '"> <a class="remove" href="#">'+ice.globalVars.removeLbl+'</a><span class="name">' + inputName + '</span> <span class="email emailremove">' + inputEmail + '</span> </li>');																										
						$('#addUserMain #validatedUsers').append('<li class="' + liClass + '"> <a class="remove" href="#">'+ice.globalVars.removeLbl+'</a><span class="name">' + inputName + '</span> <span class="email emailremove">' + inputEmail + '</span> </li>');
						$('#addUsersToFoldersContent4 #selectedAddUsersList').append('<tr class='+liClass+'><td>'+inputName+'</td><td class="label">'+inputEmail+'</td></tr>');		 // invite user's 3rd popup for adding account user							
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
						$('#btn_next', $("#addUserMain")).attr("disabled", "disabled").removeClass('button').addClass('disabled');
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
		});
		if(typeof(riaLinkmy) == 'function'){
            riaLinkmy("my-licenses : invite-new-user");
        }	
	},
	get_failure : function(statusError,msgtext) {
		vmf.modal.hide();
		if(msgtext=="parsererror") {vmf.modal.show("parsererror");} 
		else {vmf.modal.show("systemexception");}
	},
	confirmUser : function() {
		$('#fldr_name').html('');
		$('#row').html('');				
		var displayUserDetails = '<table><tbody>';								
		var displayname = '';
		var displayemail='';
		var arrayOfSelectedUsers = new Array(); 
		$(".possibleUsersList input:checkbox[name=checkbox]:checked").each(function() {arrayOfSelectedUsers.push($(this).val());	});				
		if(arrayOfSelectedUsers.length > 0){$('#custNumber').val(arrayOfSelectedUsers);}
		$(".possibleUsersList input:checkbox[name=checkbox]:checked").each(function() {
			var getParent = $(this).parent('li');
			displayUserDetails+='<tr>';
			displayUserDetails+='<td>';
			displayUserDetails += $(getParent).children('label').text();
			displayUserDetails+='</td>';
			displayUserDetails+='<td>';
			displayUserDetails += $(getParent).children('span').text();
			displayUserDetails+='</td>';
			displayUserDetails+='</tr>';
		});
		displayUserDetails+='</tbody></table>';
		$('#row').append(displayUserDetails);
		$('#fldr_name').append('<img src="/static/myvmware/common/css/img/folder_gray.png" height="10" width="18" alt="'+ice.globalVars.noLbl+'" />');
		$('#fldr_name').append(' ');
		$('#fldr_name').append($('#folder_name').text());
		vmf.modal.hide();
		$("#confirmAddUserToFolderContent #row").css({"height":"150px","overflow-y":"auto"});
		setTimeout(function(){vmf.modal.show('confirmAddUserToFolderContent');},20);// to show the second popup from the first popup
	},
	backToAddUser : function() {vmf.modal.hide();},
        confirmAddUser : function() {
		var custNumber = $('#custNumber').val();
		var folderId = $('#folderId').val(); 
		var url= $manageAccessAddUserToFolderUrl + '&selectedFolderId=' + folderId +'&customerNumbers=' +custNumber;
		vmf.ajax.post (url, null, ice.managelicense.success_move, ice.managelicense.failure_move);
	},
        success_move : function(event){
		vmf.modal.hide();
		location.reload();
	},
	failure_move : function(statusError,msgtext) {
		vmf.modal.hide();
		if(msgtext=="parsererror") {	vmf.modal.show("parsererror");}
		else {vmf.modal.show("systemexception");}
	},//End Add User to Folder
	viewLicenseHistory : function(){
		var _licenseHistoryUrl = licenseHistoryUrl+"&licenseKey="+lkey;
		vmf.ajax.post(_licenseHistoryUrl, null, ice.managelicense.onSuccessViewLicenseHistory, ice.managelicense.onFailViewLicenseHistory);	
	},
	onSuccessViewLicenseHistory : function(data){
		var responseObj = vmf.json.txtToObj(data);
		var row = "";
		$('table.withborders tbody').html('');
		if(responseObj != null && responseObj.length > 0){
			for(var index = 0; index < responseObj.length; index++){
				var dateTime = responseObj[index].date.split(" ");
				var timeZone = "";
				var activity = "";
				var licenseKeyNumber = "";
				var licenseKeyQuantity = "";
				var modifiedBy = "";
				var metrics = "";				
				if(dateTime.length > 2){timeZone = dateTime[2];}
				if(responseObj[index].activity != null){activity = responseObj[index].activity;}
				if(responseObj[index].licenseKeyNumber != null){licenseKeyNumber = responseObj[index].licenseKeyNumber;}
				if(responseObj[index].licenseKeyQuantity != null){licenseKeyQuantity = responseObj[index].licenseKeyQuantity;}
				if(responseObj[index].licenseKeyQuantity != null){metrics = responseObj[index].metrics;}
				if(responseObj[index].modifiedBy != null){
					var _modifiedBy = responseObj[index].modifiedBy;
					var _modifiedByArr = _modifiedBy.split(" ");
					var _firstName = _modifiedByArr[0];
					var _lastName = _modifiedByArr[1];
					if(_firstName == "null" && _lastName == "null"){modifiedBy = "Vmware";}
					else{modifiedBy = _firstName+" "+_lastName;}
				}
				row += '<tr><td>'+dateTime[0]+'<br><span class="time">'+dateTime[1]+' '+timeZone+'</span></td><td>'+ activity+'</td><td>'+licenseKeyNumber+' ['+licenseKeyQuantity+' '+metrics+']</td><td>'+modifiedBy+'</td></tr>';	
			}
			$('table.withborders tbody').html(row);
			vmf.modal.show('licenseKeyHistoryContent', { 
			checkPosition: true,
			onShow: function (dialog) {
					var origin = dialog.orig;
					if(origin.attr('id') == 'licenseKeyHistoryContent'){
						ice.managelicense.drawTable('tbl_license_key_history');
					}
				}
			});
		}else{
			$('table.withborders tbody').html('<tr><td class="empty_table" colspan="4">'+ice.globalVars.noActivitiesMsg+'</td></tr>');
			vmf.modal.show('licenseKeyHistoryContent');
		}
		$("#btn_close").click(function(){
			vmf.modal.hide();
			return false;
		});
	},
	drawTable: function(tableName){
		var oTable = $('#'+tableName).dataTable( {
			"aoColumns": [{"sWidth":"71px"},{"sWidth":"221px"},{"sWidth":"281px"},{ "sWidth": "auto"}],		
			"sScrollY": '184px',	"aaSorting": [[0, 'asc']],"bPaginate": false,"bFilter":false,"sDom": 't',"bAutoWidth": false,"bDestroy": true,"bRetrieve": false,
			"fnInitComplete": function () {
				var $hTbl = this;
				if($hTbl.closest('div.dataTables_scrollBody')[0] && $hTbl.closest('div.dataTables_scrollBody').attr('style').toLowerCase().indexOf('overflow')!=-1){
					$hTbl.closest('div').css("overflow-y","scroll");
					setTimeout(function() {$hTbl.fnAdjustColumnSizing(false);}, 500);
				}
			}		
		});
		oTable.fnDraw();
	},
	getDeActivateInfoAndLoad : function(){
		var vars = [], hash;
		var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
		for(var i = 0; i < hashes.length; i++){
			hash = hashes[i].split('=');
			vars.push(hash[0]);
			vars[hash[0]] = hash[1];
		}
		var _alertId = vars["alertId"];
		var _alertCategory = vars["category"];
		if(((_alertId != undefined) && (_alertId != "")) && ((_alertCategory != undefined) && (_alertCategory != ""))){
			if(_alertCategory == "EDITION_UPGRADE_DEACTIVATION"){
				var deactivateLicenseKeyUrl = deactivateLicenseKeyPageUrl + '&alertId=' + _alertId+'&alertCategory=' + _alertCategory;
				window.location = deactivateLicenseKeyUrl;
			}else{
				$('#deactivationLoading').hide();
				$('#licenseMainDiv').show();
				ice.managelicense.adjustHt();
				//$('#actionBtn').show();
				ice.managelicense.handleFolderTree();
			}
			if(_alertCategory == "SUBSCRIPTION_UPGRADE"){
				document.getElementById("sel_wantTo").options[5].selected = true;
			}
		}else{
			$('#deactivationLoading, #keyManagement').hide();
			$('#licenseMainDiv').show();
			ice.managelicense.handleFolderTree();
		}
	},
	//Adjust height of the columns
	adjustHt : function(flg){
		//myvmware.common.adjustPanes();
		var cHeight = ($("#content-section").outerHeight(true) > parseInt($("#content-section").css("min-height")))? parseInt($("#content-section").css("min-height")) : $("#content-section").outerHeight(true);
		$("#folderPane,.splitter-bar-vertical").css("min-height",450 - $("#ltSec header").outerHeight(true) +"px");
		var folderHeight = $("#folderPane").height()+(cHeight-$("#licenseMainDiv").outerHeight(true));
		//var curRight = $("#rtSec").height() - $("#productSummaryTableParent thead").outerHeight(true)-$(".filter-section .filter-header").outerHeight(true);
		var curRight = $("#rtSec").height() - $(".filter-section .filter-header").outerHeight(true);
		//SFF-Increased min height 
		folderHeight = (curRight > folderHeight) ? curRight : folderHeight;
		var mlType = $('#sel_wantTo').val();
		var defHeight = 450;
		var upgHeight = 650;
		if(folderHeight==defHeight || folderHeight==upgHeight) {
			if(ice.managelicense.originalLicensePHt==0){
				ice.managelicense.originalLicensePHt = folderHeight;
			}else{
				folderHeight = ice.managelicense.originalLicensePHt;
			}
		}else{
			ice.managelicense.originalLicensePHt = folderHeight;
		}
		var minHeight = (mlType == "upgradeLicense")?upgHeight:defHeight;
		folderHeight = (folderHeight<=minHeight) ? minHeight : folderHeight;
		
		$("#mySplitter").height(folderHeight + "px");
		$("#folderPane,.splitter-bar-vertical").height(folderHeight - $("#ltSec header").outerHeight(true) +"px"); // set the folder pane & devider ht
		$('#addUsersToFoldersContent3 #folderPane').css('height','auto').css('min-height','auto');
		//$("#centerBottom").height(folderHeight - $("#rtSec>.filter-section").height()); // removed this to fix BUG-00046726
		$("#centerBottom").height(folderHeight); // BUG-00058126 fix
		//if(!flg){
		$(".dataTables_scrollBody, tr.default",$("#productSummaryTableParent")).height($("#productSummaryTableParent").height()-$("#productSummaryTableParent thead").outerHeight(true));
		var prodPaneHt = folderHeight - ($("#rtSec>.filter-section").height()+((!$("#actionBtn").is(":visible")) ? 0 : $("#actionBtn").outerHeight(true))+$("#licenseDivider").outerHeight(true)+$("#centerBottom .splitter-bar-horizontal").outerHeight(true)+$("#productSummaryTableParent").height());
		var ht= prodPaneHt-($("#keyManagement .filter-section-header").is(":visible")?$("#keyManagement .filter-section-header").outerHeight(true):0);
		var ht= prodPaneHt-($("#upgradeOptionsContainer").is(":visible")?$("#upgradeOptionsContainer").outerHeight(true):0); //deducting the height of check upgrade option panel
		var ht= ht-($("#selectedOptionsContainer").is(":visible")?$("#selectedOptionsContainer").outerHeight(true):0); //deducting the height of Selection option panel
		$("#licenseDetail_wrapper").height(ht + "px");
		$(".dataTables_scrollBody, tr.default",$("#licenseDetail_wrapper")).height(ht-$("#licenseDetail_wrapper thead").outerHeight(true));
		//}
		$('#thirdPane').parent().height(folderHeight - $('#productSummaryTableParent').height()); //Fix for bottom panel height.
		$('#rtSec, #ltSec').css({'height':'auto'});
		var btnHt = ( $("#actionBtn").is(":visible") )? $("#actionBtn").outerHeight():0;
		$('#thirdPane').height( $('#thirdPane').parent().height() - btnHt);
		//if( $("#actionBtn").is(":visible") ){
		//	$('#thirdPane').height( $('#thirdPane').parent().height() - $("#actionBtn").outerHeight());
		//}
		myvmware.common.adjustFolderNode(true);
	},
	handleContinueBtn: function(displayType, enabledordisabled){
		if(displayType == "hide"){
			$("#actionBtn").hide();
		}else if(displayType == "show"){
			$("#actionBtn").show();
		}
		if(enabledordisabled == 'enabled'){
			$("#btn_next", $("#actionBtn")).removeAttr('disabled','disabled').removeClass('disabled secondary').unbind('click').bind('click',ice.managelicense.continueBtnClick);
		}else if(enabledordisabled == 'disabled'){
			$("#btn_next", $("#actionBtn")).attr('disabled','disabled').addClass('disabled secondary').unbind('click');
		}
		setTimeout(function(){ice.managelicense.adjustHt();},500);
	},
	continueBtnClick:function() {
		/** Manage Licenses ( Folder Persistence ) **/ 
		var mlType = $('#sel_wantTo').val();
		
		var _arrayOfSelectedLicenseIds = new Array();
                if($("#licenseDetail input:checkbox[name=opensel12]").length > 0){
                    $("#licenseDetail input:checkbox[name=opensel12]:checked").each(function() {
                            _arrayOfSelectedLicenseIds.push($(this).val());
                    });
					if ((_arrayOfSelectedLicenseIds.length > 0) && (mlType != "combine")) {
						myvmware.managelicenses.startManagingLicenses(mlType,_arrayOfSelectedLicenseIds,false);
					}else if ((_arrayOfSelectedLicenseIds.length > 1) && (mlType == "combine")) {
						myvmware.managelicenses.startManagingLicenses(mlType,_arrayOfSelectedLicenseIds,false);
					}
					else {
						switch($('#sel_wantTo').val()) {
							case 'combine':
								$('#licenseDetailPopupValidationMsg .modalContent p').html(selectMoreThanOne);
								vmf.modal.show("licenseDetailPopupValidationMsg");
							break;
							case 'move':
								$('#licenseDetailPopupValidationMsg .modalContent p').html('Please select the license key(s) you wish to move.');
								vmf.modal.show('licenseDetailPopupValidationMsg');					
							break;
							case 'downgradeLicense':
								$('#licenseDetailPopupValidationMsg .modalContent p').html('Select one or more Licenses to Downgrade');
								vmf.modal.show("licenseDetailPopupValidationMsg");						
							break;
							case 'upgradeLicense':
								$('#licenseDetailPopupValidationMsg .modalContent p').html('Select one or more Licenses to Upgrade');
								vmf.modal.show("licenseDetailPopupValidationMsg");
							break;
						}
					}
                }
                else{
                    var _selectedLicense = "", $activeRow;
                    $activeRow = $("#licenseDetail tr:.active");
                    if ($activeRow.length) {
                    	_selectedLicense = $activeRow.find("input:radio[name=opensel12]").val();
						myvmware.managelicenses.startManagingLicenses(mlType, _selectedLicense,false); 
                    }
					else{
						$('#licenseDetailPopupValidationMsg .modalContent p').html(selectAtleastOne);
						vmf.modal.show("licenseDetailPopupValidationMsg");	
					}                       
				}
		/** END: Manage Licenses ( Folder Persistence ) **/ 
		return false;
	},
	bindEvents:function(detailsPaneObj, tableId, detTable){
			if(detTable != "" && typeof(detTable) != 'undefined'){
				detTable.find('input#licDetSelectAllid').unbind('click').bind('click',function(e){
					e.stopPropagation();
					var chkbox = $(this);
					ice.managelicense.licDetSelectAllClick(chkbox,detailsPaneObj,tableId);					
				});
			}
			detailsPaneObj.find(">tbody>tr:not('.dynamicRow, .disabled')").bind('mouseover mouseout click',function(e){
				if($("#sel_wantTo").val()=="divide"){
					//e.preventDefault();
					if($(this).is(".dynamicRow, .disabled")) return;
					if($('input:radio', $(this)).is(":checked")){
						$(this).siblings().removeClass("active");
						$(this).addClass("active");
						ice.managelicense.handleContinueBtn("show","enabled");
					}
				} else if($("#sel_wantTo").val()!="viewLicense"){
					if($(this).is(".dynamicRow, .disabled")) return;
					if(e.type=="mouseover"){
						$(this).addClass('hover'); // Mouseover Background color
					} else if (e.type=="mouseout"){
						$(this).removeClass('hover'); // Remove Mouseover Background color
					} else {
						target= $(e.target);
						if (target.is("a.openClose")){
							return;
						} else if (target.is("input[type=checkbox]:not([readonly]):not([disabled])")){
							trEle=target.closest("tr"), $check=$(target);
							checked = target.is(':checked');
						} else {
							trEle=$(this), $check=$(this).find("input[type=checkbox]:not([readonly]):not([disabled])");
							checked = !trEle.hasClass('active');
						}
						if(checked){
							trEle.addClass("active");
							$check.attr("checked","checked");
							if (tableId == "licenseDetailDowngrade" && isRestrictDwngrdProd == true) {
								ice.managelicense.processLicenseKeyRowsForRestricedDwng($check);
							}
							if ((tableId!="licenseDetailCombine" || (tableId=="licenseDetailCombine" && (trEle.closest("tbody").find("input:checkbox:checked").length>1))) && !ice.managelicense.warningMsgOn){
								ice.managelicense.handleContinueBtn("show","enabled");
							}
						} else {
							trEle.removeClass("active");
							$check.removeAttr("checked");
							if (tableId == "licenseDetailDowngrade" && isRestrictDwngrdProd == true) {
								ice.managelicense.processLicenseKeyRowsForRestricedDwng($check);
							}
							if ((tableId!="licenseDetailCombine" && !trEle.closest("tbody").find("input:checkbox:checked").length) || (tableId=="licenseDetailCombine" && (trEle.closest("tbody").find("input:checkbox:checked").length<2) )){
								ice.managelicense.handleContinueBtn("show","disabled");
							}
						}
					}
				}
			});
			myvmware.hoverContent.bindEvents($('tr.tooltip'), 'cursorPosition');
			myvmware.hoverContent.bindEvents($('a.tooltip'), 'defaultfunc'); //for padlock
	},
	checkFolderPermissions: function(target){
		var _fPerPostData = new Object(),
			folderId = $(target).closest('li').data('folderId');
			_fPerPostData['selectedFolders'] = folderId;
			vmf.ajax.post($folderMinPermissionUrl,_fPerPostData,ice.managelicense.onsuccess_getPerm(target),ice.managelicense.onfailure_getPerm,null,null,null,false);
	},
	onsuccess_getPerm: function(target){
		return function(folderPermission){
			var json=(typeof folderPermission!="object")?vmf.json.txtToObj(folderPermission):folderPermission;
			$(target).closest('li').data({fManage:json.manage});
		}
	},
	onfailure_getPerm: function(){},
	setContextMenuState:function(target,cmenu,disableMnu){
		var ftype = $(target).closest('li').data('ftype');
		if (ftype == 'ROOT') {
			cmenu.find('li').each(function () {
				if ($(this).find('a').attr('id') == 'create_folder' || $(this).find('a').attr('id') == 'export_to_CSV') { //BUG-00047103
					if($('#sel_wantTo').val() == "viewLicense") {
						$(this).find('a').removeClass(disableMnu);
						$(this).removeClass('inactive');
					} else {
						$(this).find('a').addClass(disableMnu);
					}
				} else {
					$(this).find('a').addClass(disableMnu);
				}
			});
		} else if (ftype == "ASP" || ftype == "CPL" || ftype == "VCE") { // if it is not ROOT folder  and type is "ASP","CPL","VCE"
			cmenu.find('a').addClass(disableMnu); // On first load, the disable class is not assigned
			cmenu.find('a#rename_folder,a#add_user,a#share_folder').removeClass(disableMnu).parent('li').removeClass('inactive');
			$('#folderPane input[type=checkbox]').closest('span').removeClass('hover');
			
			if($('#sel_wantTo').val() == "viewLicense") {//BUG-00047103
				cmenu.find('a#export_to_CSV').removeClass(disableMnu).parent('li').removeClass('inactive');
			} else {
				cmenu.find('a#export_to_CSV').addClass(disableMnu);
			}
		} else { //if it is not ROOT folder  and  not "ASP","CPL","VCE"
			cmenu.find('a').removeClass(disableMnu).parent('li').removeClass('inactive');
			if($('#sel_wantTo').val() == "viewLicense") {//BUG-00047103
				cmenu.find('a#export_to_CSV').removeClass(disableMnu).parent('li').removeClass('inactive');
			} else {
				cmenu.find('a#export_to_CSV').addClass(disableMnu).parent('li').addClass('inactive');
			}
		}
		cmenu.find('a#add_user,a#share_folder').removeClass(disableMnu).parent('li').removeClass('inactive');
	},
	setCreateFolderPerm:function(){
		if(ice.managelicense.createFolderFlg == null){
			vmf.ajax.post($loggedInUserFoldersWithManagepermissionUrl,null,function(data){
				var json=(typeof data!="object")?vmf.json.txtToObj(data):data;
				if(json.folderPathList.length){
					$('.dropdown').find('a#createFolder,a#addUser,a#shareFolder').removeClass('disableMenu').parent('li').removeClass('inactive');
					ice.managelicense.createFolderFlg = true;
				} else {
					$('.dropdown').find('a#createFolder,a#addUser,a#shareFolder').addClass('disableMenu').parent('li').addClass('inactive');
					ice.managelicense.createFolderFlg = false;
				}
			},function(){
				/*error*/
			});
		} else if (ice.managelicense.createFolderFlg) {
			$('.dropdown').find('a#createFolder,a#addUser,a#shareFolder').removeClass('disableMenu').parent('li').removeClass('inactive');
		}
	},
	sessionTimeOutExtend: function(){
		var sessionalertpopup = $('.popup-alert-close');
		if(sessionalertpopup != null && typeof sessionalertpopup.text() != 'undefined' && sessionalertpopup.text() != '') {
			AUI().ready('aui-io', function(A) {
					if(A.one('.popup-alert-close')) {
						A.one('.popup-alert-close').simulate('click');
						document.title = ice.managelicense.pageTitle;
					}
				});			
		   } 
		   else {
			ice.managelicense.invokeBeforeAjax();
		   }			
	},
	invokeBeforeAjax: function() {
		if(Liferay.Session) {
			clearTimeout(Liferay.Session._stateCheck);
			Liferay.Session.extend();
		}
	},
	validateLabels: function(eve){ // Validate filled or not
		var tarElem = $(eve.target);
		ice.managelicense.filterCustomLabel(eve);
	},
	callCustomLabelsForLicense: function(lk,el,edittrue,ckelm){
		var ldata = "",mhtm = "", objcnt = 0;
		if(el.find('div.label_holder').length){el.find('div.label_holder').remove();}
		if(!$.isEmptyObject($(el).data("fCLabels") )){
			$.each($(el).data("fCLabels"), function(j, lVal){
				if(lVal != ""){
					mhtm += "<span class=\"sLabeln\">"+ j +": </span><span class=\"sLabelv\">"+ lVal +". </span>";
					objcnt++;
				}
			});
			mhtm = mhtm.replace(/.([^.]*)$/,'$1');
			ldata += "<div class=\"labelEllipsis\">"+mhtm+"</div>";
			ldata += "<a class=\"edit fn_editNote ed_custom_labels\" href=\"#\">"+ice.globalVars.editCustomLabelLbl+"</a>";
		}
		if(!(objcnt >= 10) && ($.isEmptyObject($(el).data("fCLabels")))){
			ldata += "<div class=\"addlinkContainer\"><a class=\"edit fn_editlabels addCustomLabel\" href=\"#\">"+ice.globalVars.addCustomLableLbl+"</a></div>";
		}
		if(ckelm.hasClass('openClose')){
			el.find('.note-wrapper').append("<div class=\"label_holder\">"+ldata+"</div>");			
		}else{
			el.find('.note-wrapper').append("<div class=\"label_holder\">"+ldata+"</div>");
			el.find('.note-wrapper').hide();
			ice.managelicense.generateDetailHtmlvals(ckelm,$(el).data("fCLabels"));
		}
		var spanElm = el.find('div.labelEllipsis')
		ice.managelicense.setLabelSpanWidth($('section#rtSec'),$(spanElm));
	},
	setLabelSpanWidth: function(mElm,sElm){
		var mainDivWidth = mElm.outerWidth(true);
		var newwidth = (mainDivWidth - 240); // Reduce custom labels width and paddings approximately
		var spnWidth = sElm.width();
		if(spnWidth > newwidth){
			sElm.width(newwidth+"px");
		}
	},
	generateDetailHtmlvals: function(tarElm,lblobj){ // Generate label elem like where to append what is the value this is the deciding function
		var licenseKey = tarElm.closest('tr').prev('tr').find('.key').html(), $this = tarElm, $next="", 
		note=tarElm.closest('tr').data("fNotes"),
		$closestTd = tarElm.closest('tr.dynamicRow td'),
		$noteHolder=tarElm.closest(".note-wrapper"),
		currentText = '',
		dOpt = '';
		ice.managelicense.dropHtml = ice.managelicense.generateSelectBox(); // generate HTML select box			
		
		ice.managelicense.generateDetailHolderHtml($this,note,$noteHolder,$closestTd,lblobj,ice.managelicense.dropHtml);
	},
	generateSelectBox: function(){ //Genrate HTML select box
		$dropdwn = $('<select class="labeldropdown"></select>');
		var eal = ice.managelicense.getEaLabelNames();
		var dOpt = "";
		//eal = eal.split(','); // Split all EAlabels
		ice.managelicense.eaLabelArr = [];
		dOpt += '<option value="">'+ice.globalVars.selectLabelNameLbl+'</option>'
		$.each(eal, function(i, val) { // Loop through it and create options
		  dOpt += '<option value="'+val+'">'+val+'</option>';
		  ice.managelicense.eaLabelArr.push(val);
		});
		$dropdwn.append(dOpt); // Append all options to dropdown
		return $dropdwn;
	},
	filterCustomLabel: function(eve){// Add custom label
		var elem = eve.target;
		var pelm = $(elem).parents('div.clbl_ctrlHolder');
		var clonedElem = $(elem).parents('div.clbl_ctrlHolder').clone(true);
		clonedElem.find('input[type=text]').val("").attr('disabled','disabled');
		pelm.after(clonedElem);
		$(elem).hide();
		if($('div.clbl_ctrlHolder').length == 5){$('div.clbl_ctrlHolder').last().find('a#add_searchlbl').remove();}
		ice.managelicense.adjustHt();
	},
	deleteCustomLabel: function(cElm,detH){// Delete custome label functionality will go tthere
		var inputElmTxt = cElm.find('label.labeltxt').text() +'~""';
		if(cElm.parents('div.labeledContainer').find('input.deletedLabels').length <= 0){
			var inputCelm = "<input type='hidden' name='deletedLabels' class='deletedLabels' value='"+inputElmTxt+"'/>"
			cElm.parents('div.labeledContainer').append(inputCelm);
		}else{
			var curTxtVal = cElm.parents('div.labeledContainer').find('input.deletedLabels').val();
			var newTxtVal = curTxtVal +"^"+inputElmTxt;
			cElm.parents('div.labeledContainer').find('input.deletedLabels').val(newTxtVal);
		}
		if(detH.find('.edLabelWrapper').length > 10){detH.find(".addclcontainer").hide();}else{detH.find(".addclcontainer").show();}
		cElm.remove();
		if(detH.find('.edLabelWrapper').length < 1){detH.find(".labelheadcontent").hide();}else{detH.find(".labelheadcontent").show();}
	},
	generateDetailHolderHtml: function(el,note,$noteHolder,$closestTd,lblobj,$dropdwn){ // Generate HTML for label holder
		// Get the current text
		var $labelHead = $('<label class="hdlabel labelhead">'+ice.globalVars.customLabelsLbl+'</label>'),
		$cLabel = $('<label class="labeltxt"></label>'),
		$dbtn = $('<span class="delete grey_col"><a href="#">'+ice.globalVars.deleteLbl+'</a></span>'),
		$noteHead = $('<label class="hdlabel notehead">'+ice.globalVars.notesLbl+'</label>'),
		$labelHead = $('<label class="hdlabel labelhead">'+ice.globalVars.customLabelsLbl+'</label>'),
		$lblWrapper = $('<div class="edLabelWrapper clearfix"></div>'),
		$lblHeadContent = $('<div class="labelheadcontent clearfix"><span class="first">'+ice.globalVars.labelsLbl+'</span><span class="second">'+ice.globalVars.valueLbl+'</span></div>'),
		$lblEditContainer = $('<div class="labeledContainer"></div>'),
		$textArea = $('<textarea class="editText"></textarea>'),
		$detailsWrapper = '<div class="details-wrapper"></div>',
		btns = '<div class="btnWrapper"><button type="button" class="button primary saveBtn saveTop lessChar">'+saveNoteGlobal+'</button><button type="button" class="secondary cancelBtn">'+$cancelBtn+'</button></div>',
		$clHtml = $('<input type="text" class="clvalue" name="lbltxt" placeholder="'+ice.globalVars.valueLbl+'" maxlength="50" />');
		
		currentText = (note.length)? note: "";
		/* Create a new holder and add all the elements inside that*/
		$noteHolder.hide(); // Hide all present content
		// Create a new holder and append to TD
		if( $closestTd.find('div.details-wrapper').length == 0){
			($closestTd.find('.more-details').length != 0) ? $closestTd.find('.more-details').before($detailsWrapper) : $closestTd.append($detailsWrapper);
		}else{
			$closestTd.find('div.details-wrapper').show();
		}
		
		$detholder = $closestTd.find('div.details-wrapper'); // Assign this to a variable
		// Create a text area and insert it into the DOM with the current note
		$textArea.val(currentText);
		($detholder.find(".notehead").length != 0) ? $detholder.find(".notehead").show() : $detholder.append($noteHead);// Notes header
		($detholder.find("textarea").length != 0) ? $detholder.find("textarea").show() : $detholder.append($textArea); // Append textarea
	
		if(typeof lblobj !== 'undefined'){
			($detholder.find(".labelhead").length != 0) ? $detholder.find(".labelhead").show() : $detholder.append($labelHead); // Label header
			($detholder.find(".labelheadcontent").length != 0) ? $detholder.find(".labelheadcontent").show() : $detholder.append($lblHeadContent); // Label header content
			var lbobjcnt = 0;
			$.each(lblobj, function(ind, lblVal){
				var lblClone = $lblWrapper.clone();
				lblClone.append($cLabel.clone());
				lblClone.append($clHtml.clone());
				lblClone.append($dbtn.clone());
				lblClone.find('label.labeltxt').text(ind).end().find('input[name=lbltxt]').val(lblVal);
				$lblEditContainer.append(lblClone);
				lbobjcnt++;				 
			});
			($detholder.find(".labeledContainer").length != 0) ? $detholder.find(".labeledContainer").show() : $detholder.append($lblEditContainer);
			if(lbobjcnt == 0){$detholder.find(".labelheadcontent").hide();}
			/*if(el.hasClass('addCustomLabel')){$lblEditContainer.find('div.edLabelWrapper').hide();}else{$lblEditContainer.find('div.edLabelWrapper').show();}*/ //BUG-00047156 Commenting it
		}
		if(el.hasClass('fn_editlabels')){
			($detholder.find(".labelhead").length != 0) ? $detholder.find(".labelhead").show() : $detholder.append($labelHead); // Label header
			($detholder.find(".labelheadcontent").length != 0) ? $detholder.find(".labelheadcontent").show() : $detholder.append($lblHeadContent); // Label header content
			ice.managelicense.addCustomLabeldrop($detholder,$dropdwn,$clHtml,$lblWrapper,$labelHead,$lblHeadContent);
		}
		($detholder.find(".addclcontainer").length != 0) ? $detholder.find(".addclcontainer").show() : $detholder.append('<div class="addclcontainer"><a href="#" class="addclhref">'+ice.globalVars.moreCustLbl+'</a></div>');
		($detholder.find(".btnWrapper").length != 0) ? $detholder.find(".btnWrapper").show() : $detholder.append(btns);
		$detholder.find('span.delete').unbind('click').bind('click', function(e){
			ice.managelicense.deleteCustomLabel($(e.target).parents('div.edLabelWrapper'),$detholder);
			e.preventDefault();
		})
		$detholder.find('button.saveBtn').unbind('click').click(function(){
			ice.managelicense.saveNote(this, licenseKey, currentText);
			return false;
		}).siblings('button.cancelBtn').unbind('click').click(function(){
			ice.managelicense.cancelNote(this, currentText);
			return false;
		});
		$textArea.bind('keypress', function(e){
			var code = (e.keyCode ? e.keyCode : e.which);
			if(code == 13) { //Enter keycode
				ice.managelicense.saveNote($(this).next('.saveBtn'), licenseKey, currentText);
				$(this).attr("disabled","disabled");
				return false;
			}
		});
		$detholder.find('a.addclhref').unbind('click').bind('click',function(){ // Bind click for add custom labels
			var dropdwn = ice.managelicense.generateSelectBox()
			ice.managelicense.addCustomLabeldrop($(this).parents('div.details-wrapper'),dropdwn,$clHtml,$lblWrapper,$labelHead,$lblHeadContent);
			return false;
		});
		if(!(lbobjcnt >= 10) && !($detholder.find('div.edLabelWrapper').length >= 10)){ // Hide add more custom labels if there are 10 labels and values
			$detholder.find(".addclcontainer").show();
		}else{$detholder.find(".addclcontainer").hide();}
		$next=el.closest("td").find('.more-details');
	},
	addCustomLabeldrop: function(dh,dd,cl,lw,lh,lhc){ // Add custom label.
		var lblClone = lw.clone();
		lblClone.append(dd.clone());
		lblClone.append(cl.clone());
		lblClone.find('input.clvalue').attr('disabled','disabled')
		if(dh.find('.edLabelWrapper').length != 0){
			dh.find('.edLabelWrapper:last').after(lblClone);
		}else{
			//find text area
			$txtarea = dh.find('textarea');
			(dh.find(".labelhead").length != 0 ) ? dh.find(".labelhead").show() : $txtarea.after(lh); // Label header
			(dh.find(".labelheadcontent").length != 0) ? dh.find(".labelheadcontent").show() : dh.find(".labelhead").after(lhc); // Label header content
			dh.find(".labelheadcontent").after(lblClone);
		}
		if(dh.find('.edLabelWrapper').length >= 10){dh.find(".addclcontainer").hide();}else{dh.find(".addclcontainer").show();}
		ice.managelicense.renderDropdownHtml(dh);
	},
	renderDropdownHtml: function(dh){
		var $de = '';
		dh.find('select.labeldropdown').not('.cl').each(function(i, selectObj){
			var getSel = $(this);
			$(this).addClass('cl').hide();
			var holder = $(this).parent('div.edLabelWrapper'), options = $(this).find('option'), drpmain = $('<div class="clWrapper"><span class="corner-img-left"></span><span class="optionsHolder">'+$(options[0]).html()+'</span></div>'), flyout = $('<div class="dropdown-flyout eaBoxShadow"></div>'), elms = $(drpmain).children(),$select=$(this);
			$(holder).prepend(drpmain);
			$(elms).parent().unbind('click').bind('click', function(event){
				$de = $(this);
				options = $select.find('option');
				ice.managelicense.renderDropdownOptions(holder,options,drpmain,flyout,$de,$select);	
			});
		});
	},
	renderDropdownOptions: function(h,opts,d,f,$de,$se){ // Render drop options
		var divoption = '';
		$('.dropdown-flyout').remove();
		$(f).html('');
		if($de.hasClass('clicked')){
			$de.removeClass('clicked').find('.dropdown-flyout').remove();
		}else{
			$de.addClass('clicked');
			$(opts).each(function(i, optionObj){
				if($(optionObj).val()) {
					divoption = '<a class="dropdown-option" alt="'+$(optionObj).val()+'" title="'+$(optionObj).text()+'">'+$(optionObj).text()+'</a>';
					$(f).append(divoption);
				}
			});
			$(f).find('a.dropdown-option:last').addClass('dottedline');
			$(f).append('<div class="flyout_custom_labels"></div>');
			var fcl = $(f).find('div.flyout_custom_labels');
			// Append other options after that
			$clcreateOpt = '<a class="dropdown-option create plus" alt="'+ice.globalVars.createNewLbl+'">'+ice.globalVars.createNewLbl+'</a>';
			$clrenameOpt = '<a class="dropdown-option edit redpen" alt="'+ice.globalVars.renameLabelLbl+'">'+ice.globalVars.renameLabelLbl+'</a>';
			$(fcl).append($clcreateOpt);
			$(fcl).append($clrenameOpt);
			$(h).append(f);					
			$(f).show();
		}
		// Bind events
		ice.managelicense.bindDropDownMenuEvents($de,h,$(f),$se);	
		
	},
	bindDropDownMenuEvents: function(de,h,fo,$se,$pElm){// Bind events to dropdown menu.
		var tarElm = $(fo).closest('div.edLabelWrapper')
		var closestScroll = $(fo).closest('div.dataTables_scrollBody');
		var errContHtml = "<div class=\"clabeleditErrorCont\"><span id=\"labelnameError\" class=\"first\"></span><span id=\"labelvalueError\" class=\"second\"></span></div>";
		if($pElm){
			$pElm.find('button.saveClBtn').unbind('click').click(function(e){
				$(this).attr("disabled","disabled").addClass('disabled');
				ice.managelicense.saveNewLabel($(this),de,h,fo,$se);			
				e.preventDefault();
			}).siblings('button.cancelClBtn').unbind('click').click(function(e){
				$(this).parents('div.cllabelwrapper').hide().end().parents('div.flyout_custom_labels').find('a.dropdown-option').show();
				e.preventDefault();
			});
		}else{
			fo.find('a.dropdown-option').unbind('click').bind('click', function(e){ // Bind click
				var $telm = $(e.target);
				if($telm.hasClass('create')) { // If element has class create
					ice.managelicense.generateclInputBox($telm,de,h,fo,$se);
				}else if($telm.hasClass('edit')){ // If element has class edit
					ice.managelicense.generateCustomLabelpopup(h);
				}else{ // all other elements
					var $getVal = $telm.attr('title');
					var $getid = $telm.attr('alt');
					var errorFlag = false;
					// Check dropdowns whether this value already selected
					if($telm.parents('div.edLabelWrapper').find('select').val() != $getVal){
						h.parents('div.details-wrapper').find('select.labeldropdown,label.labeltxt').each(function(c,sel){
							if($(sel).is('select')){
								if($(sel).val().toString().toLowerCase() == $getVal.toString().toLowerCase()){errorFlag = true;}
							}else{
								if($(sel).text().toString().toLowerCase() == $getVal.toString().toLowerCase()){errorFlag = true;}
							}
						});
						if(!errorFlag){
							if($telm.closest('div.edLabelWrapper').find('div.clabeleditErrorCont').length != 0){$telm.closest('div.edLabelWrapper').find('div.clabeleditErrorCont').remove();}
							ice.managelicense.scrollToElement(closestScroll,tarElm);
							$se.val($getid); // Set select dropdown
							de.find('span.optionsHolder').text($getVal).end().removeClass('clicked');
							de.siblings('input.clvalue').removeAttr('disabled','disabled');
							fo.remove();
						}else{
							if($telm.closest('div.edLabelWrapper').find('div.clabeleditErrorCont').length == 0){$telm.closest('div.edLabelWrapper').append(errContHtml);}
							$telm.closest('div.edLabelWrapper').find('div.clabeleditErrorCont span').text("");
							$telm.closest('div.edLabelWrapper').find('span#labelnameError').text(ice.globalVars.labelAlreadyUseLbl);
							$se.val("");
							de.siblings('input.clvalue').val('').attr('disabled','disabled');
							de.find('span.optionsHolder').text(ice.globalVars.selectLabelNameLbl).end().removeClass('clicked');
							fo.remove();
							ice.managelicense.scrollToElement(closestScroll,tarElm);
						}
					}else{
						de.removeClass('clicked')
						fo.remove();
					}
				}
				
			});	
			ice.managelicense.setZindex('#viewLicense .details-wrapper div.edLabelWrapper');			
			$(document).bind('mousedown',function(e) { // Bind mousedown anywhere else on the page other than dropoptions, hide dropdown
				if(!$(e.target).is('span.optionsHolder') && !$(e.target).is('div.clWrapper') && !$(e.target).is('a.dropdown-option') && !$(e.target).parents('div').is('div.dropdown-flyout') && $(e.target).parents('body').find('.dropdown-flyout').is(':visible')){
					ice.managelicense.scrollToElement(closestScroll,tarElm);
					$('.dropdown-flyout').remove();
					if($('div.clWrapper').hasClass('clicked')){$('div.clWrapper').removeClass('clicked');}
				}
				
			});
		}
	},
	saveNewLabel: function(ce,de,h,fo,$se){ // Save new label
		var pElm = ce.parents('div.cllabelwrapper'),newlbl = $(pElm).find('input#newclabel').val(), lblLC = newlbl.toString().toLowerCase();
		var dErMsg = ice.globalVars.labelAlreadyExistLbl;
		var empErMsg = ice.globalVars.enterLabelNameLbl;
		var cErrMsg = "~^ "+ice.globalVars.charsNotAllowedMsg;
		var maxErrMsg = ice.globalVars.max10Msg;
		var errContainer = '<div class="error_msg leftmargin"></div>';
		var lCArray = ice.managelicense.eaLabelArr;
		var arrLen = lCArray.length;
		$.each(lCArray, function(index, item) {	lCArray[index] = item.toLowerCase();});
		$(pElm).find('div.error_msg').remove();
		if(newlbl != ""){
			if(arrLen == 10){
				$(pElm).find('input#newclabel').after(errContainer);
				$(pElm).find('div.error_msg').html(maxErrMsg);
				ce.attr('disabled','').removeClass('disabled');
				return false;
			}
			var eflag = ice.managelicense.checkSpecialCharacters(newlbl);
			if(!eflag){
				if($.inArray(lblLC,lCArray) == -1){
					var url = $createLabelURL;
					var _postData = new Object();
					_postData['newLabelName'] = newlbl;
					vmf.ajax.post(url,_postData,ice.managelicense.onSuccessSaveNewLabel(ce,de,h,fo,$se,newlbl),ice.managelicense.onFailSaveNewLabel);				
				}else{
					//$(pElm).css('position','relative').append('<div class="alert_ico"></div>');
					$elm = $(pElm).find('input#newclabel');
					$(pElm).find('input#newclabel').after(errContainer);
					$(pElm).find('div.error_msg').html(dErMsg);
				}
			}else{
				//$(pElm).css('position','relative').append('<div class="alert_ico"></div>');
				$elm = $(pElm).find('input#newclabel');
				$(pElm).find('input#newclabel').after(errContainer);
				$(pElm).find('div.error_msg').html(cErrMsg);
			}
		}else{
			$(pElm).find('input#newclabel').after(errContainer);
			$(pElm).find('div.error_msg').html(empErMsg);
		}
		ce.attr('disabled','').removeClass('disabled');
	},
	onSuccessSaveNewLabel: function(ce,de,h,fo,$se,newlbl){ // Saving the new label
		return function(data){
			//var jsonRes = vmf.json.txtToObj(data);
			ice.managelicense.onSuccessGetEaLabel(data);
			fo.find('a.dottedline').removeClass('dottedline')
			fo.find('div.flyout_custom_labels div.cllabelwrapper').hide().end().find('div.flyout_custom_labels a.dropdown-option').show().end().find('div.flyout_custom_labels').before('<a class="dropdown-option dottedline" alt="'+newlbl+'" title="'+newlbl+'">'+newlbl+'</a>');
			var newOpt = '<option value="'+newlbl+'">'+newlbl+'</option>';
			ice.managelicense.eaLabelArr.push(newlbl);
			ice.managelicense.bindDropDownMenuEvents(de,h,fo,$se);
		}
	},
	generateclInputBox: function(elm,de,h,fo,$se){
		var pElm = elm.parents('div.flyout_custom_labels'),
		inp = '<div class="cllabelwrapper"><input type="text" name="newclabel" id="newclabel" class="fcinput" maxlength="25" /><div class="btnWrapper"><button type="button" class="button primary saveClBtn saveTop lessChar">'+saveNoteGlobal+'</button><button type="button" class="secondary cancelClBtn">'+$cancelBtn+'</button></div></div>';
		$(pElm).find('a.dropdown-option').hide();
		$(pElm).append(inp);
		ice.managelicense.bindDropDownMenuEvents(de,h,fo,$se,$(pElm));
	},
	generateCustomLabelpopup: function(mobj){ // Generate custom label popup
		var eal = ice.managelicense.getEaLabelNames();
		var mContainer = 'div#renameCustomLabelPopup', cContainer = $(mContainer).find('div.rename_container');
		$(cContainer).html('');
		$.each(eal, function(i, val) { // Loop through it and create options
			var rclHtml = $('<div class="rclholder clearfix"><label>'+ice.globalVars.labelLbl+'</label><div class="txt-holder"><input type="text" name="rcltext" value="'+val+'" maxlength="25" /></div><span class="delete_label">'+ice.globalVars.deleteLbl+'</span></div>');	
			rclHtml.data({'labelname':val});		
			$(cContainer).append(rclHtml.clone(true));
			$(cContainer).find('div.rclholder');
		});
		$(mContainer).find('button').each(function(j, obj){
			if($(obj).is(':disabled')){$(obj).removeAttr('disabled');}
		});
		vmf.modal.show('renameCustomLabelPopup', { 
				checkPosition: true,
				onShow: function (dialog){
					ice.managelicense.enableDisableButtons($('button#btnrenamecustom'),true,false);					
					$(mobj).parents('tr.dynamicRow').addClass('currentrow');
					$('input[name="rcltext"]').unbind('keydown').bind('keydown', function(e){
						var key = (e.keyCode ? e.keyCode : e.charCode);
						if(key == 13 || key == 9 || key == 18 || key == 17){}else{ice.managelicense.enableDisableButtons($('button#btnrenamecustom'),true,true);}
						var tin = $(this);						
						tin.closest('div.rename_container').find('span.rename_error').remove();// On keyup remove error message					
					})
					$(cContainer).find('span.delete_label').unbind('click').bind('click', function(e){
						ice.managelicense.enableDisableButtons($('button#btnrenamecustom'),false,false);
						ice.managelicense.labelModelPopupActions(e);
						e.preventDefault();
					});
					$(mContainer).find('button').unbind('click').bind('click', function(e){
						ice.managelicense.labelModelPopupActions(e,mobj);
						e.preventDefault();
					});
					ice.managelicense.adjustHeightForPopupWithScroll($('#renameCustomLabelPopup').find('div.rename_container'),250,'htclass');
				}
			}
		);				
	},
	labelModelPopupActions: function(e,mobj){
		var elm = $(e.target),clkcancel=false;
		$('div.rename_container').find('span.rename_error').remove().end().find('div.alert_ico').remove();
		if(elm.is('span.delete_label')){ // else if it is delete label
			var lname = elm.closest('div.rclholder').data().labelname,txt_warning = myvmware.common.buildLocaleMsg(ice.globalVars.sureToDeleteMsg,lname);
			elm.closest('div.rclholder').addClass('deleted')
			ice.managelicense.rclholder = elm.closest('div.rclholder');
			elm.closest('div.rename_container').hide().end().parents('div.body').append('<div class="warning_container">'+txt_warning+'</div>').end().parents('div.modalContent').find('button#btnrenamecustom').hide();
			elm.closest('div.modalContent').find('button#btnrenameconfirm').show();
			ice.managelicense.adjustHeightForPopupWithScroll($('#renameCustomLabelPopup').find('div.rename_container'),250,'htclass');
			ice.managelicense.clkcancel = true;
		}else if(elm.is('button#btnrenamecancel')){ // If it is cancel button
			if(ice.managelicense.clkcancel){
				elm.parents('div.modalContent').find('div.warning_container').remove().end().find('div.rename_container').show().end().closest('div.modalContent').find('button#btnrenameconfirm,button#btnrenamesave').hide().end().closest('div.modalContent').find('button#btnrenamecustom').show();
				ice.managelicense.enableDisableButtons($('button#btnrenamecustom'),true,true);
				ice.managelicense.clkcancel = false;
			}else{
				var tarElm = $(mobj).closest('tr.dynamicRow').prev('tr');
				var closestScroll = $(mobj).closest('div.dataTables_scrollBody');
				$(mobj).parents('tr.dynamicRow').removeClass('currentrow');
				ice.managelicense.scrollToElement(closestScroll,tarElm);
				vmf.modal.hide();
			}
		}else if(elm.is('button#btnrenameconfirm')){			
			var hdiv = ice.managelicense.rclholder;
			var pc = $(hdiv.parents('div.rename_container'));
			var inputElmTxt = "DELETE~"+$(hdiv).data().labelname;
			if(pc.find('input#popdeletedLabels').length <= 0){
				var inputCelm = "<input type='hidden' name='popdeletedLabels' class='popdeletedLabels' id='popdeletedLabels' value='"+inputElmTxt+"'/>"
				pc.append(inputCelm);
			}else{
				var curTxtVal = pc.find('input#popdeletedLabels').val();
				var newTxtVal = curTxtVal +"^"+inputElmTxt;
				pc.find('input#popdeletedLabels').val(newTxtVal);
			}
			$(hdiv).hide();
			elm.parents('div.modalContent').find('div.rename_container').show().end().find('div.warning_container').remove().end().find('button#btnrenameconfirm').hide().end().find('button#btnrenamecustom').show();
			ice.managelicense.enableDisableButtons($('button#btnrenamecustom'),true,true);
			if(ice.managelicense.clkcancel) ice.managelicense.clkcancel = false;
			
		}else if(elm.is('button#btnrenamecustom')){
			$('div.rename_container').find('span.rename_error').remove().end().find('div.alert_ico').remove();
			$('div.rename_container').find('div.rclholder').not('.deleted').each(function(cnt, rObj){
				var rclval = $(rObj).find('input[name=rcltext]').val();
				var sf = ice.managelicense.checkSpecialCharacters(rclval);
				if(sf){
					$(rObj).before('<span class="rename_error pad">'+ice.globalVars.noSpecialCharsMsg+'</span>');
					return false;
				}
			});
			var ef = false;	
			$('div.rename_container').find('div.rclholder').not('.deleted').each(function(cnt, rObj){				
				if(!ef){
					var curObj = $(rObj).find('input[name=rcltext]');
					var rclval = $(rObj).find('input[name=rcltext]').val();
					$('div.rename_container').find('div.rclholder').not('.deleted').find('input[name=rcltext]').not(curObj).each(function(k,nobj){
						var cVal = $(nobj).val()
						if((rclval.toString().toLowerCase() == cVal.toString().toLowerCase()) && !ef){
							ef = true;
							$(nobj).closest('div.rclholder').before('<span class="rename_error pad">'+ice.globalVars.alreadyLabelNameMsg+'</span>');
							return false;
						}
					});
				}
			}); 
			if($('div.rename_container').find('span.rename_error').length == 0){
				var txt_warning = ice.globalVars.sureToChangeMsg;
				elm.parents('div.modalContent').find('div.rename_container').hide().end().find('div.body').append('<div class="warning_container">'+txt_warning+'</div>').end().find('button#btnrenamecustom').hide().end().find('button#btnrenamesave').show();
				ice.managelicense.clkcancel = false;
			 }else{
				//$('div.rename_container').prepend('<span class="rename_error">Clear all the errors then continue!</span>');
			} 
		}else if(elm.is('button#btnrenamesave')){
			var renameStr = "";
			var len = $('div.rename_container').find('div.rclholder').not('.deleted').length;
			var delVals = $('div.rename_container').find('input#popdeletedLabels').val();
			$('div.rename_container').find('div.rclholder').not('.deleted').each(function(ind,obj){
				renameStr += "RENAME~"+$(obj).data('labelname')+"~"+$(obj).find('input[name=rcltext]').val();
				if(len-1 != ind){renameStr += "^";}
			});
			if(delVals == undefined){delVals = "";}else{delVals = delVals +"^";}
			var _saveNoteUrl = $renameDeleteURL;
			var _postDataRename = new Object();
			_postDataRename['lovRenDelLabel'] = delVals + renameStr; 
			 vmf.ajax.post(_saveNoteUrl,_postDataRename,ice.managelicense.onSuccessRenamePopupLabel(mobj),ice.managelicense.onFailRenamePopupLabel);			
		}	
		
	},
	onSuccessRenamePopupLabel: function(elm){ // Success of save popup label
		return function(resData){
			var jData = vmf.json.txtToObj(resData);
			var result = jData.result;
			if(result.toString().toLowerCase() == "s"){
				$('table#licenseDetail').find('tr.dynamicRow').not('.currentrow').each(function(i,dynR){
					$(dynR).find('div.label_holder,div.more-details,div.details-wrapper').remove();
					$(dynR).find('div.note-wrapper').show();
					$(dynR).prev('tr').addClass('refreshed').find('a.openClose').removeClass('open selfClick');
				});
				$(elm).parents('tr.dynamicRow').removeClass('currentrow');
				vmf.modal.hide();
				ice.managelicense.expandLicenseKey(elm.closest('tr.dynamicRow').prev('tr').find('a.openClose'),false,elm,true);
				ice.managelicense.onSuccessGetEaLabel(resData);
				ice.managelicense.clkcancel = false;
			}else{
				vmf.modal.hide();
				$(elm).parents('tr.dynamicRow').removeClass('currentrow');
				ice.managelicense.clkcancel = false;
				alert(ice.globalVars.encounteredIssuesMsg);
			}
		}
	},
	getDropPostion: function(targetEl){ // get element position
		var leftPos, topPos;
		leftPos = targetEl.offset().left;
		topPos = targetEl.offset().top + targetEl.outerHeight();
		cssObj = {'left': leftPos,'top': topPos - 2 };
        return cssObj; 
	},
	getEaLabelNames: function(ean){ // Get all the label names associated to particular EA
		var ealabels = ice.managelicense.eaLabelsAssociated;
		return ealabels;
	},
	setZindex: function(elem){ // Set z-index
		var zIndexNumber = 5000;
		$(elem).each(function() {
			$(this).css('zIndex', zIndexNumber);
			zIndexNumber -= 10;
		});
	},
	callEaLabelsAjax: function(){ //  Getting labels associated to particular EA
		var url = $getEALabelsURL;
		vmf.ajax.get(url,null,ice.managelicense.onSuccessGetEaLabel,ice.managelicense.onFailGetEaLabel);
	},
	onSuccessGetEaLabel: function(data){ // On success of EA label call
		var jsonRes = vmf.json.txtToObj(data);		
		if(typeof(jsonRes.labels) != "undefined" || jsonRes.labels != undefined){
			ice.managelicense.eaLabelsAssociated = jsonRes.labels;
			ice.managelicense.updateFilterLabelDropDown(jsonRes.labels);
			ice.managelicense.eaLabelsFlag = true;
		}else{
			$('#manageLicenseExceptionMessage').html(jsonRes.result);
			vmf.modal.show("manageLicenseExceptionMessagePopup");
		}
	},
	onFailGetEaLabel: function(){ },
	updateFilterLabelDropDown: function(lov){ // Update filter custom label dropdown
		lov = lov || [];
		$('section#keyManagement select.labeldropdown').each(function(i,obj){
			var oldSelectedVal = $(obj).val();
			$(obj).html('');
			var oHtml = "";
			oHtml += '<option value="">'+ice.globalVars.selectLabelNameLbl+'</option>';
			$.each(lov, function(ind, val) { // Loop through it and create options
			  oHtml += '<option value="'+val+'">'+val+'</option>';
			});
			$(obj).append(oHtml);
			$(obj).val(oldSelectedVal);
		});

		//updating data for customLabels dropdown in filter-form
		myvmware.filters.customLablesData = [];
    	for(var i = 0; i < lov.length; i++){
    		var tempObj = {
    			  custom_id: lov[i]
    			, custom_name: lov[i]
    		};
    		myvmware.filters.customLablesData.push(tempObj);
    	}
    	myvmware.filters.customLablesData = myvmware.filters.sortByKey(myvmware.filters.customLablesData, 'custom_name');
    	$('.customLabelsDiv input.customDDInput').data('suggest_data_src', myvmware.filters.customLablesData);
	},
	scrollToElement: function(closestScroll,tarElm){ // Scroll to a target element
		if(closestScroll != "" && tarElm != "") $(closestScroll).scrollTo(tarElm);
	},
	checkSpecialCharacters: function(txtval){ // Validate special characters in input box
		var	iChars = "^~";
		var eflag= false;
		for (var i = 0; i < txtval.length; i++) {
			if (iChars.indexOf(txtval.charAt(i)) != -1 && !eflag) {eflag = true;}
		}
		return eflag;
	},
	licDetSelectAllClick: function(chkbox,detailsPaneObj,tableId){
		chkbox.attr('disabled','disabled');
		var xcnt = "";
		switch(tableId) {
			case 'licenseDetailMove':
				xcnt = "";
				break;
			case 'licenseDetailCombine':
				xcnt = ice.managelicense.combineActionCount;
				break;
			case 'licenseDetailDowngrade':
				xcnt = ice.managelicense.downGradeActionCount;
				break;
			case 'licenseDetailUpgrade':
				xcnt = ice.managelicense.upGradeActionCount;
				break;
		}
		if(chkbox.is(':checked')){
			if(xcnt != ""){
				$(detailsPaneObj).find('.openCloseSelect input:checkbox').not(':disabled').attr('checked',false).closest('tr').removeClass('active');
				if($(detailsPaneObj).find('.openCloseSelect input:checkbox:not(:disabled)').length > xcnt){
					$(detailsPaneObj).find('.openCloseSelect input:checkbox:not(:disabled):lt('+xcnt+')').attr('checked',true).closest('tr').addClass('active');
					ice.managelicense.handleContinueBtn('show','disabled');
					ice.managelicense.showWarningCountMessage(tableId,xcnt);
				}else{
					$(detailsPaneObj).find('.openCloseSelect input:checkbox').not(':disabled').attr('checked',true).closest('tr').addClass('active');
					ice.managelicense.handleContinueBtn('show','enabled');
				}
			}else{
				ice.managelicense.removeWarningMsg(false);			
				$(detailsPaneObj).find('.openCloseSelect input:checkbox').not(':disabled').attr('checked',true).closest('tr').addClass('active');
				ice.managelicense.handleContinueBtn('show','enabled');
			}
			if(!ice.managelicense.warningMsgOn){chkbox.removeAttr('disabled','disabled');}
		}else{
			ice.managelicense.removeWarningMsg(false);
			ice.managelicense.handleContinueBtn('show','disabled');
			if(tableId != "licenseDetailCombine" && !ice.managelicense.warningMsgOn){chkbox.removeAttr('disabled','disabled');}else if(tableId == "licenseDetailCombine"){chkbox.attr('disabled','disabled');}
			$(detailsPaneObj).find('>tbody>tr').each(function (index, value) {
				var $currentTr = $(this);
				$currentTr.find('.openCloseSelect input:checkbox').attr('checked',false).closest('tr').removeClass('active')
				if ($currentTr.hasClass('otherFolder')) {
					$currentTr.removeClass('disabled otherFolder tooltip').removeAttr('title').find('.openCloseSelect input:checkbox').removeAttr('disabled');
					$currentTr.unbind('mouseenter mouseleave');
				}
			});
		}
		
	},
	selectAllLicenseKeys: function(tid){ // Select all checkbox functionality
		switch(tid) {
			case 'licenseDetailMove':
				ice.managelicense.handleSelectAllChkBox('enabled','');
				break;
			case 'licenseDetailCombine':
				ice.managelicense.handleSelectAllChkBox('disabled','');
				break;
			case 'licenseDetailDowngrade':
				ice.managelicense.handleSelectAllChkBox('enabled','');
				break;
			case 'licenseDetailUpgrade':
				ice.managelicense.handleSelectAllChkBox('enabled','');
				break;
		}
	},
	handleSelectAllChkBox: function(eord,dt){
		if(eord != ""){
			if(eord == 'enabled') {	$('input#licDetSelectAllid').removeAttr('disabled','disabled');
			}else if(eord == 'disabled'){$('input#licDetSelectAllid').attr('disabled','disabled');}
		}
		if(dt != ""){
			if(dt == 'show') {	$('input#licDetSelectAllid').show();
			}else if(dt == 'hide'){$('input#licDetSelectAllid').hide();}
		}
	},
	showWarningCountMessage: function(tid,cnt){ // Showing warning message if count exceeds.
		var msgHtml = '<div class="warning_big left"><strong>'+ice.globalVars.attentionHdr+'</strong><br />'+myvmware.common.buildLocaleMsg(ice.globalVars.onlyLicensesMsg,cnt)+'<div class="btn_bolder"><button id="btn_warning_ok">'+ice.globalVars.okLbl+'</button></div></div>';

		ice.managelicense.removeWarningMsg(false);		
		var msgFullContainer = "<tr class='warningtr'><td colspan='4' style='text-align:center'>"+msgHtml+"</td></tr>";
		$("#viewLicense table > tbody > tr:first").before(msgFullContainer);
		ice.managelicense.handleContinueBtn('show','disabled');
		ice.managelicense.warningMsgOn = true;
		ice.managelicense.disableorenableAllOtherRows('disable');
		var scrollElm = $('#viewLicense').find('div.dataTables_scrollBody');
		var tarElm = $('#viewLicense').find('tr.warningtr');
		ice.managelicense.scrollToElement(scrollElm,tarElm);
		$('button#btn_warning_ok').unbind('click').bind('click',function(e){
			ice.managelicense.handleSelectAllChkBox('enabled','show')
			ice.managelicense.disableorenableAllOtherRows('enable');
			ice.managelicense.handleContinueBtn('show','enabled');
			ice.managelicense.removeWarningMsg(true);
		});
	},
	removeWarningMsg: function(cl){
		ice.managelicense.warningMsgOn = false;	
		if(!cl){
			ice.managelicense.disableorenableAllOtherRows('enable');		
		}
		if($('#licenseDetail tbody tr:first').find('.warning_big').length){
			$('#licenseDetail tbody tr:first').remove();
		}
	},
	disableorenableAllOtherRows: function(action){
		var $detailstable = $('table#licenseDetail');
		if(action == 'disable'){
			ice.managelicense.handleSelectAllChkBox('disabled','true');
			$detailstable.find('tbody>tr').not('.warningtr,.dynamicRow,.disabled').each(function (index, value) {				
				var $cTr = $(this);
				$cTr.addClass('disabled tooltip warningEnabled').find('.openCloseSelect input').attr('disabled', true);
				$cTr.attr({'title':ice.globalVars.helpForReasonsMsg ,'data-tooltip-position':'bottom'});
				
				myvmware.hoverContent.bindEvents($cTr, 'cursorPosition');
			});
		}else{
			$detailstable.find('tbody>tr').each(function (index, value) {				
				var $cTr = $(this);
				if($cTr.hasClass('warningEnabled')){
					$cTr.removeAttr('title').removeClass('disabled tooltip warningEnabled').find('.openCloseSelect input').removeAttr('disabled', 'disabled');
					$cTr.unbind('mouseenter mouseleave');
				}
			});
		}
	},
	enableDisableButtons: function(e,t,v){
		if($(e).length){
			if(t){
				$(e).show();
				if(v){$(e).removeAttr('disabled','disabled').removeClass('disabled');}else{$(e).attr('disabled','disabled').addClass('disabled');}
			}else{
				$(e).hide();
			}
		}
	},
	adjustHeightForPopupWithScroll: function(holder, ht, sh){
		if(holder.hasClass(sh)){holder.removeClass(sh);}
		var oH = holder.outerHeight('true');
		if(oH > ht){holder.addClass('scroll '+sh);}else{holder.removeClass('scroll '+sh);}		
	},
	setMessagesPosition: function(){ /*Added for CR 15768 Tooltips Changes*/
		$('.dragCol').css({
			'top':$('#productSummary_wrapper table thead tr:first th:eq(0)').offset().top - $('#content-container').offset().top + $('#productSummary_wrapper table thead tr:first th:eq(0)').outerHeight() + 'px',
			'left':$('#productSummary_wrapper table thead tr:first th:eq(0)').offset().left + $('#productSummary_wrapper table thead tr:first th:eq(0)').width() - 64 + 'px'
		});
		$('.panesResize').css({
			'top':$('#productSummary_wrapper table thead tr:first th:eq(0)').offset().top - $('#content-container').offset().top + $('#productSummary_wrapper table thead tr:first th:eq(0)').outerHeight() + 'px',
			'left':$('#productSummary_wrapper table thead tr:first th:eq(0)').offset().left -96 + 'px'
		});
		$('.getReports').css({
			'top':$('#header_nav_id ul li:eq(1)').offset().top -$('#content-container').offset().top + $('#header_nav_id ul li:eq(1)').height() + 'px',
			'left':$('#header_nav_id ul li:eq(1)').offset().left + $('#header_nav_id ul li:eq(1)').width()/2 + 'px'
		});
		$('.ribbon').css({
			'top':$('#licenseMainDiv header').offset().top - $('#content-container').offset().top + 11 + 'px',
			'left':$('#content-container-wrapper').outerWidth(true) - $('.ribbon').outerWidth(true) + 'px'
		});
		$('.dragCol.dragColumnPos').css({
			'top':$('#productSummary_wrapper table thead tr:first th:eq(1)').offset().top - $('#content-container').offset().top + $('#productSummary_wrapper table thead tr:first th:eq(1)').outerHeight() + 'px',
			'left':parseInt($('#productSummary_wrapper table thead tr:first th:eq(0)').offset().left + $('#productSummary_wrapper table thead tr:first th:eq(0)').outerWidth(true) + $('#productSummary_wrapper table thead tr:first th:eq(1)').outerWidth(true) - $('.dragColumnPos').outerWidth(true) + 15,10) + 'px'
		});
		$('.panesResize.panesResizeBtm').css({
			'top':$('#thirdPane').offset().top - $('#content-container').offset().top - 9 + 'px',
			'left':$('#thirdPane').offset().left + 'px'
		});
		$('.expands	').css({
			'top':$('#main-content').offset().top - $('#content-container').offset().top + 'px'
		});
		
	},
	selectProd: function(){
		if(ice.managelicense.uiSession.prodId!=""){
			var prodId = ice.managelicense.uiSession.prodId;
			ice.managelicense.uiSession.prodId ="";
			$("#prodId"+prodId).trigger('click');
		}
	}
};
function adjustHtForIE7_specific(){myvmware.common.adjustFolderNode(true);}
window.onresize = ice.managelicense.adjustHt;



/**************************** exposed filter related stuff - START ***********************************/

if (typeof(myvmware) == "undefined")myvmware = {};
myvmware.filters = {
	  formObj: $('#exposedFilterForm')
	, init: function(){
		this.formObj.find('.customLabelsDiv .custumLabelsErrContainer').before(tmpl("customLabelsHTML"));
		this.formObj.find(':input').attr('disabled', false);
		myvmware.common.putplaceHolder(this.formObj.find('input[type=text]'));
		this.attachEvents();
		this.formObj.find(':input').trigger('blur')
								   .attr('disabled', true);
	}
	, attachEvents: function(){
		var oThis = this,
			orderInfoDateObj = [
				{option_id: "30", option_text: $orderDateLast30Days},
				{option_id: "60", option_text: $orderDateLast60Days},
				{option_id: "90", option_text: $orderDateLast90Days},
				{option_id: "120", option_text: $orderDateLast120Days}
			],
			contractEndDateObj = [
				{option_id: "30", option_text: $contractDateNext30Days},
				{option_id: "60", option_text: $contractDateNext60Days},
				{option_id: "90", option_text: $contractDateNext90Days},
				{option_id: "120", option_text: $contractDateNext120Days}
			];
		// change the class to enabled so that can attach autosuggest plugin. (after attaching, will be reverted to disabled class again)
		this.formObj.addClass('ef_enabled').removeClass('ef_disabled');
		this.enabledForm = $('#exposedFilterForm.ef_enabled');

		this.enabledForm.find('.moreOrlessFilter').live('click', function(){
			oThis.formObj.toggleClass('collapsed expanded');
			var anchorObj = $(this);
			if( oThis.formObj.hasClass('collapsed') ){
				riaLinkmy('my-licenses : show-less-filter');// omniture event when user clicks on less-filter
				anchorObj.text($filterTextMoreFilters).attr('title', $filterTooltipTextMoreFilters);
			}else{
				riaLinkmy('my-licenses : show-more-filter');// omniture event when user clicks on more-filter
				anchorObj.text($filterTextLessFilters).attr('title', $filterTooltipTextLessFilters);
			}
		})
		.end().find('input[name=orderOrContract]').live('change', function(){
			$('#optionDate, #optionDateValue, #optionNumber').val('');
			var targetRadioId =  this.id;
			var $filterTextServiceId = mlRS.common.serviceId, $filterTextServiceEndDate = mlRS.common.serviceEndDate;
			switch(targetRadioId){
				case 'orderInfo':
					oThis.formObj.find('#optionDate').attr('placeholder', $filterTextOrderDate)
												 		.data('suggest_data_src', orderInfoDateObj);
					oThis.formObj.find('#optionNumber').attr('placeholder', $filterTextOrderNumber);
					myvmware.filters.enableAfterSearchInfo(oThis);
				break;	 
				case 'contractInfo':
		          	oThis.formObj.find('#optionDate').attr('placeholder', $filterTextContractEndDate)
														.data('suggest_data_src', contractEndDateObj);
					oThis.formObj.find('#optionNumber').attr('placeholder', $filterTextContractNumber);

					myvmware.filters.enableAfterSearchInfo(oThis);
		        break;
		        case 'serviceInfo':
		        	oThis.formObj.find('#optionDate').attr('placeholder', $filterTextServiceEndDate)
														.data('suggest_data_src', contractEndDateObj);
														//serviceEndDateObj
					oThis.formObj.find('#optionNumber').attr('placeholder', $filterTextServiceId);

					myvmware.filters.disableForSearchInfo(oThis);
		        break;
			}
			myvmware.common.putplaceHolder('#optionDate,#optionNumber');
			$('#optionDate,#optionNumber').trigger('blur');
		})
		.end().find('.addLabel').live('click', function(){
			if($(this).attr('disabled')){
				return false;
			}
			// change the addlable link to delete
			$(this).toggleClass('addLabel delLabel').find('span').text($filterTextDelete)
				   .closest('.customLabelRow').removeClass('last');

			oThis.formObj.find('.customLabelsDiv .custumLabelsErrContainer').before(tmpl("customLabelsHTML"));
			// after adding a customlabel row, check if it reached to max of 5 lables and then update add/delete
			if( oThis.formObj.find('.customLabelRow').length == 5 ){
				// change the addlable link to delete
				oThis.formObj.find('.customLabelRow.last').find('.addLabel').toggleClass('addLabel delLabel').find('span').text($filterTextDelete);
			}
			myvmware.common.putplaceHolder($('.customLabelsDiv input[type=text]'));
			oThis.attachCustomLabelAutoSuggest();
		})
		.end().find('.delLabel').live('click', function(){
			if($(this).attr('disabled')){
				return false;
			}
			// remove current custom label fields
			$(this).closest('.customLabelRow').remove();

			// make sure that the last row's link to be add-label
			var lastAnchor = $('.addOrDeleteLabel:last a');
			if( lastAnchor.hasClass('delLabel') ){
				lastAnchor.toggleClass('addLabel delLabel').find('span').text($filterTextLabel);
			}

			// make sure that the last row should have the class last
			$('.customLabelRow:last').addClass('last');

			oThis.validateCustomLabels();
			if( oThis.formObj.find('[name=customLabelValue].errorBorder').length == 0 ){
				oThis.formObj.find('#customLabelValErr').css('visibility', 'hidden');
			}
		})
		.end().find('#productName').live('keypress', function(ev){
			if( ev.which == 37 && ev.shiftKey ){
				return false;
			}
		});

		this.formObj.live('submit', function(){
			var productDesc = oThis.formObj.find('#productName'),
				productID = oThis.formObj.find('#as-values-productName'),
				licenseKey = oThis.formObj.find('#licenseKey'),
				notesKey = oThis.formObj.find('#notesKey'),
				optionDate = oThis.formObj.find('#optionDate'),
				optionDateValue = oThis.formObj.find('#optionDateValue'),
				isOrderInfoSelected = oThis.formObj.find('#orderInfo').is(':checked'),
				isContractInfoSelected = oThis.formObj.find('#contractInfo').is(':checked'),
				isServiceInfoSelected = oThis.formObj.find('#serviceInfo').is(':checked'),
				optionNumber = oThis.formObj.find('#optionNumber'),

				productNameErr = oThis.formObj.find('#productNameErr'),
				licenseKeyErr = oThis.formObj.find('#licenseKeyErr'),
				notesKeyErr = oThis.formObj.find('#notesKeyErr'),
				optionDateErr = oThis.formObj.find('#optionDateErr'),
				optionNumberErr = oThis.formObj.find('#optionNumberErr'),
				customLabelDDErr =  oThis.formObj.find('#customLabelDDErr'),
				customLabelValErr = oThis.formObj.find('#customLabelValErr');

				$filterValidationServiceEndDate = mlRS.common.serviceEndDateValidationMsg;

			/* validations - START */
			var isError = false,
				isLabelsfilled = false,
				_filterconfig = {};

			_filterconfig.productDescLength = 3;
	        _filterconfig.licenseKeyLength = 5;
	        _filterconfig.customLabelVal = 3;

			oThis.clearErrorMessages();

			if( ($.trim(productDesc.val()) == '' || productDesc.val() == productDesc.attr('placeholder')) &&
				($.trim(licenseKey.val()) == '' || licenseKey.val() == licenseKey.attr('placeholder')) &&
				($.trim(notesKey.val()) == '' || notesKey.val() == notesKey.attr('placeholder')) &&
				($.trim(optionDate.val()) == '' || optionDate.val() == optionDate.attr('placeholder')) &&
				($.trim(optionNumber.val()) == '' || optionNumber.val() == optionNumber.attr('placeholder'))
			){
				oThis.enabledForm.find('[name=customLabelKey], [name=customLabelValue]').each(function(){
					var $this = $(this);
					if( $.trim($this.val()) != '' && $this.val() != $this.attr('placeholder') ){
						isLabelsfilled = true;
					}
				});
				if( !isLabelsfilled ){
					isError = true;
					optionDate.closest('ul.as-selections').addClass('errorBorder');
					if( isOrderInfoSelected ){
						optionDateErr.html($filterValidationOrderDate).css('visibility', 'visible');
					}else if( isContractInfoSelected ){
						optionDateErr.html($filterValidationCntrctEndDate).css('visibility', 'visible');
					}else if( isServiceInfoSelected ){
						optionDateErr.html($filterValidationServiceEndDate).css('visibility', 'visible');
					}
				}
			}

			if( !isError ){
	            // validate productName
	            if( $.trim(productDesc.val()) != '' && productDesc.val().length < _filterconfig.productDescLength ){
	            	isError = true;
	            	productDesc.closest('ul.as-selections').addClass('errorBorder');
	            	productNameErr.html($filterValidationProductDesc).css('visibility', 'visible');
	            }
	            // validate license key
	            if( $.trim(licenseKey.val()) != '' && licenseKey.val().length < _filterconfig.licenseKeyLength ){
	            	isError = true;
	            	licenseKey.addClass('errorBorder');
	            	licenseKeyErr.html($filterValidationLicenseKey).css('visibility', 'visible');
	            }
	            // validate order-number/contract-number
	            if( $.trim(optionNumber.val()) != '' && optionNumber.val() != optionNumber.attr('placeholder') && optionNumber.val() != parseInt(optionNumber.val()) && !isServiceInfoSelected ){
	            	isError = true;
	            	optionNumber.addClass('errorBorder');
	            	optionNumberErr.html($filterValidationOptionNbr).css('visibility', 'visible');
	            }

	            // validate custom-label null value check and dropdown null check
	            var labelValNullError = false,
	            	labelDDNullError = false;
	            oThis.enabledForm.find('[name=customLabelKey]').each(function(){
					var $this = $(this),
						inputEle = $this.closest('.customLabelRow').find('[name=customLabelValue]');

					if( $.trim(inputEle.val()) != '' && inputEle.val() != inputEle.attr('placeholder') && 
						($.trim($this.val()) == '' || $this.val() == $this.attr('placeholder')) ){
						labelDDNullError = true;
						$this.closest('ul.as-selections').addClass('errorBorder');
					}
					if( $.trim($this.val()) != '' && $this.val() != $this.attr('placeholder') && 
						($.trim(inputEle.val()) == '' || inputEle.val() == inputEle.attr('placeholder')) ){
						labelValNullError = true;
						inputEle.addClass('errorBorder');
					}
				});
				if( labelDDNullError ){
					isError = true;
					customLabelDDErr.html($filterValidationLabelKeyNull).css('visibility', 'visible');
				}else if( oThis.validateCustomLabels() ){
					isError = true;
				}

				if( labelValNullError ){
					isError = true;
		            customLabelValErr.html($filterValidationLabelNullValue).css('visibility', 'visible');
				}else{
		            // validate custom-label-value
		            var labelValLengthError = false;
					oThis.enabledForm.find('[name=customLabelValue]').each(function(){
						var $this = $(this);
						if( $.trim($this.val()) != '' && $this.val().length < _filterconfig.customLabelVal ){
							labelValLengthError = true;
							$this.addClass('errorBorder');
						}
					});
					if( labelValLengthError ){
		            	isError = true;
		            	customLabelValErr.html($filterValidationLabelValue).css('visibility', 'visible');
		            }
		        }
	        }

	        // if error is in advanced filter section and if the form is in collapsed mode, expanding it explicitly to show the error msg to the user
	        if( isError && oThis.formObj.hasClass('collapsed') && oThis.formObj.find('.advancedFilter .errorBorder').length > 0 ){
	        	oThis.formObj.toggleClass('collapsed expanded')
	        				 .find('.moreOrlessFilter').text($filterTextLessFilters).attr('title', $filterTooltipTextLessFilters);
	        }

            if( isError ){
            	return false;
            }
			/* validations - END */

			riaLinkmy('my-licenses : apply-filter');// omniture event when user clicks on applyfilter
			var _postDataUrl = {
				  productName: ''
				, productDesc: ''
				, licenseKey: ''
				, notesKey: ''

				, orderDateFrom: ''
				, orderDateTo: ''
				, orderNumber: ''

				, contractEndDateFrom: ''
				, contractEndDateTo: ''
				, contractNumber: ''

				, serviceEndDateFrom: ''
				, serviceEndDateTo: ''
				, serviceId: ''

				, labelKey: ''
				, labelVal: ''
			};
			
			
			if( productID.val() == '' && $.trim(productDesc.val()) != '' && productDesc.val() != productDesc.attr('placeholder') ){
				_postDataUrl.productDesc = '%'+ productDesc.val() +'%';
			}else if( productID.val() != '' ){
				_postDataUrl.productName = productID.val();
			}

			_postDataUrl.licenseKey = (licenseKey.val() == licenseKey.attr('placeholder'))?'':licenseKey.val();
			_postDataUrl.notesKey = (notesKey.val() == notesKey.attr('placeholder'))?'':notesKey.val();


			var optionDateArr = optionDateValue.val().split(' - '),
				fromDateStr = '',
				toDateStr = '';
			if( optionDateArr.length == 2 ){
				var fromDate = optionDateArr[0],
					fromDateArr = fromDate.split('/'),
					fromYY = fromDateArr[0],
					fromMM = fromDateArr[1],
					fromDD = fromDateArr[2];

				var toDate = optionDateArr[1],
					toDateArr = toDate.split('/'),
					toYY = toDateArr[0],
					toMM = toDateArr[1],
					toDD = toDateArr[2];

				fromDateStr = fromYY+'-'+fromMM+'-'+fromDD;
				toDateStr = toYY+'-'+toMM+'-'+toDD;
			}

			if( isOrderInfoSelected ){
				_postDataUrl.orderDateFrom = fromDateStr;
				_postDataUrl.orderDateTo = toDateStr;
				_postDataUrl.orderNumber = (optionNumber.val() == optionNumber.attr('placeholder') )?'':optionNumber.val();
			}else if( isContractInfoSelected ){
				_postDataUrl.contractEndDateFrom = fromDateStr;
				_postDataUrl.contractEndDateTo = toDateStr;
				_postDataUrl.contractNumber = (optionNumber.val() == optionNumber.attr('placeholder') )?'':optionNumber.val();
			}else if(isServiceInfoSelected){
				_postDataUrl.serviceEndDateFrom = fromDateStr;
				_postDataUrl.serviceEndDateTo = toDateStr;
				_postDataUrl.serviceId = (optionNumber.val() == optionNumber.attr('placeholder') )?'':optionNumber.val();
			}
			
			var lblKeyArr = [];
			$('[name=customLabelKey]').each(function(){
				var $this = $(this),
					lblKey = ($this.val() == $this.attr('placeholder'))?'':$this.val();
				lblKeyArr.push(lblKey);
			});
			var lblValueArr = [];
			$('[name=customLabelValue]').each(function(){
				var $this = $(this),
					lblVal = ($this.val() == $this.attr('placeholder'))?'':$this.val();
				lblValueArr.push(lblVal);
			});

			_postDataUrl.labelKey = lblKeyArr.join('~');
			_postDataUrl.labelVal = lblValueArr.join('~');

			$('#keyManagement, #productMessage, #currentProductName, .rightaligned_link').slideUp();
			var postData = $.param(_postDataUrl),
			folderData = ($("input[name='group_all']").is(':checked')) ? '&param=' : '&param='+selectedAllFoldersId;
			postData += folderData;
			ice.managelicense.loadFilteredProductSummary(  filterLicenseKeyDataUrl +'&iWantToSelection=' + $('#sel_wantTo').val()
														 , resourceDetailPageURL
														 , tabDetailOrderUrl
														 , tabDetailSupportUrl
														 , postData
														);
			$("#upgradeOptionsContainer").hide();
			return false;
		});
		
		this.enabledForm.find('#resetFilter').live('click', function(ev){
			riaLinkmy('my-licenses : clear-filter');// omniture event when user clicks on clear button
			// remove all the extra customlabel rows. so clear all and add one
			oThis.formObj.find('.customLabelRow').remove()
						 .end().find('.customLabelsDiv .custumLabelsErrContainer').before(tmpl("customLabelsHTML"));
			oThis.attachCustomLabelAutoSuggest();

			oThis.formObj.find('#orderInfo').attr('checked', true).trigger('change');
			oThis.formObj[0].reset();
			oThis.formObj.find(':input').trigger('blur');
			
			oThis.clearErrorMessages();
			$("#upgradeOptionsContainer").hide();

			if (selectedAllFoldersId != null && selectedAllFoldersId.length) {
				urlProductSummary = resourceUrlProductSummary +'&iWantToSelection=' + $('#sel_wantTo').val();
				data="param=" + selectedAllFoldersId.join(',');
				$('#keyManagement, #productMessage, #currentProductName, .rightaligned_link').slideUp();
				vmf.datatable.reload($('#productSummary'),urlProductSummary, ice.managelicense.postProcessingData,"POST", data);
			}
			ev.preventDefault();
		});

		var productsData = [{
			  product_id: ''
			, product_name: ''
		}];
		vmf.autoSuggest.start(this.enabledForm.find('#productName'), productsData, {
			  selectedItemProp: "product_name"
			, searchObjProps: "product_name"
			, selectedValuesProp:"product_id"
			, resultsHighlight: false
			, resultClick: this.productRecipientSelected
			, asHtmlID: 'productName'
			, neverSubmit: false
			, isMultipleSelectionAllowed: false
			, showEmptyText: false
		});

		this.enabledForm.find('#optionDate').live({
			focus: function(){
				this.select();
			}
			, keydown: function(ev){
				var keyCode = ev.keyCode || ev.which;
				if( keyCode == 8 || keyCode == 46 ){
					$(this).val('');
					
					oThis.formObj.find('#calendarIcon').val('')
								 .end()
								 .find('#optionDateValue').val('');
					ev.preventDefault();
				}
			}
		});
		vmf.autoSuggest.start(this.enabledForm.find('#optionDate'), orderInfoDateObj, {
			  isCustomDropdown: true
		    , selectedItemProp: "option_text"
			, searchObjProps: "option_text"
			, selectedValuesProp: "option_id"
			, resultsHighlight: false
			, asHtmlID: 'optionDate'
			, neverSubmit: true
			, isMultipleSelectionAllowed: false
			, resultClick: this.dateRangeSelected
			, emptyText: ""
		});

		this.customLablesData = [{
			  custom_id: ''
			, custom_name: ''
		}];
		this.attachCustomLabelAutoSuggest();

		// reverting the class to disabled
		this.formObj.removeClass('ef_enabled').addClass('ef_disabled');

		/* calendar stuff */
		vmf.calendarsPicker.start(this.formObj.find('#calendarIcon'), {
			  rangeSelect: true
			, monthsToShow: 2
			, yearRange: 'c-30:c+30'
			, onClose: this.showDate
			, commandsAsDateFormat: true
			, minDate: '1/1/1990'
			, prevText: ' '
			, todayText: ' '
			, nextText: ' '
			, nextJumpText: ' '
			, prevJumpText: ' '
			, closeText: '<img src="/vmf/m/multicalendar/1.0/img/close.png">'
			, renderer: $.extend({}
								 , $.calendars.picker.defaultRenderer
								 , { picker: $.calendars.picker.defaultRenderer.picker.replace(/\{link:prev\}/, '{link:prevJump}{link:prev}')
																 					  .replace(/\{link:next\}/, '{link:nextJump}{link:next}')
								 })
		});
	}
	, clearErrorMessages: function(){
		this.formObj.find('.filterErrorMsg').html('').css('visibility', 'hidden')
					.end().find('.errorBorder').removeClass('errorBorder');
	}
	, attachCustomLabelAutoSuggest: function(){
		vmf.autoSuggest.start(this.formObj.find('.customLabelRow:last input.customDDInput'), this.customLablesData, {
			  isCustomDropdown: true
			, selectedItemProp: "custom_name"
			, searchObjProps: "custom_name"
			, selectedValuesProp:"custom_id"
			, resultsHighlight: false
			, neverSubmit: true
			, isMultipleSelectionAllowed: false
			, resultClick: this.customRecipientSelected
			, emptyText: ""
		});
	}
	, validateCustomLabels: function(){
		// validate custom-dropdowns for duplicate values
		var oThis = this,
			unique_values = {},
			dup_values = [],
			customLabelDDErr =  oThis.enabledForm.find('#customLabelDDErr');

		oThis.enabledForm.find('.customLabelsDiv ul.as-selections.errorBorder').removeClass('errorBorder');
		customLabelDDErr.css('visibility', 'hidden');
		
		oThis.enabledForm.find('[name=customLabelKey]').each(function(){
			var $this = $(this);
			if( $.trim($this.val()) == '' || $this.val() == $this.attr('placeholder') ){
				// do nothing
			}else if ( !unique_values[$this.val()] ) {
				unique_values[$this.val()] = true;
			} else {
				dup_values.push($this.val());
			}
		});

		$.each(dup_values, function(index, value){
			oThis.enabledForm.find("[value='"+value+"']:visible").each(function(){
				$(this).closest('ul.as-selections').addClass('errorBorder');
			});
		});
		if( dup_values.length ){
			customLabelDDErr.html($filterValidationDuplLabel).css('visibility', 'visible');
		}

		return dup_values.length;
	}
	, disableExposedFilterForm: function(bool){
		var calendarObj = this.formObj.find('#calendarIcon');

		this.formObj.find(':input').attr('disabled', bool);
		var anchorObj = this.formObj.find('.moreOrlessFilter'); 
		if( bool ){ // disable the form
			if( calendarObj.val() != '' ){
				calendarObj.attr('orgValue', calendarObj.val())
						   .val('');
			}
			this.formObj.addClass('ef_disabled').removeClass('ef_enabled');
			this.formObj.find('#applyfilter, #resetFilter').addClass('disabled');
			anchorObj.removeAttr("title");
		}else{
			if( calendarObj.attr('orgValue') ){
				calendarObj.val(calendarObj.attr('orgValue'));
			}
			this.formObj.removeClass('ef_disabled').addClass('ef_enabled');
			this.formObj.find('#applyfilter, #resetFilter').removeClass('disabled');

			if( this.formObj.hasClass('collapsed') ){
				anchorObj.attr('title', $filterTooltipTextMoreFilters);
			}else{
				anchorObj.attr('title', $filterTooltipTextLessFilters);
			}
		}
	}
	, updateProductNames: function(){
		this.formObj.find('#productName').data('suggest_data_src', productsData);
	}
	, showDate: function(date) {
		if( date[0] && date[1] ){
			var fromDate = date[0]._year+'/'+(date[0]._month>9?date[0]._month:'0'+date[0]._month)+'/'+(date[0]._day>9?date[0]._day:'0'+date[0]._day),
				toDate = date[1]._year+'/'+(date[1]._month>9?date[1]._month:'0'+date[1]._month)+'/'+(date[1]._day>9?date[1]._day:'0'+date[1]._day);
			if( $("#optionDateValue").val() != (fromDate+' - '+toDate) ){
				$("#optionDate, #optionDateValue").val(fromDate+' - '+toDate).removeClass('hasPlaceholder');
			}
		}
	}

	/* callback methods for autosuggest plugin attached for diff fields - START */
	/* Note: scope of this is not this object literal */
	, productRecipientSelected: function(data, input){
		input.val(data.product_name);
	}
	, dateRangeSelected: function(data, input){
		var today = new Date(),
			daysToChange = parseInt(data.option_id),
			selectedDateObj = new Date();
		if( $('#orderInfo').is(':checked') ){
			selectedDateObj.setDate(selectedDateObj.getDate()-daysToChange);
		}else{
			selectedDateObj.setDate(selectedDateObj.getDate()+daysToChange);
		}

		var todayYear = today.getFullYear(),
			todayMonth = ((today.getMonth()+1)>9?(today.getMonth()+1):'0'+(today.getMonth()+1)),
			todayDate = (today.getDate()>9?today.getDate():'0'+today.getDate()),
			newYear = selectedDateObj.getFullYear(),
			newMonth = ((selectedDateObj.getMonth()+1)>9?(selectedDateObj.getMonth()+1):'0'+(selectedDateObj.getMonth()+1)),
			newDate = (selectedDateObj.getDate()>9?selectedDateObj.getDate():'0'+selectedDateObj.getDate());

		input.val(data.option_text).removeClass('hasPlaceholder');

		var optionDateValue, calendarIconValue;
		if( $('#orderInfo').is(':checked') ){
			optionDateValue = newYear+"/"+newMonth+"/"+newDate+" - "+todayYear+"/"+todayMonth+"/"+todayDate;
			calendarIconValue = newMonth+"/"+newDate+"/"+newYear+" - "+todayMonth+"/"+todayDate+"/"+todayYear;
		}else{
			optionDateValue = todayYear+"/"+todayMonth+"/"+todayDate+" - "+newYear+"/"+newMonth+"/"+newDate;
			calendarIconValue = todayMonth+"/"+todayDate+"/"+todayYear+" - "+newMonth+"/"+newDate+"/"+newYear;
		}
		$('#optionDateValue').val(optionDateValue);
		$('#calendarIcon').val(calendarIconValue);
	}
	, customRecipientSelected: function(data, input){
		input.val(data.custom_name).removeClass('hasPlaceholder');

		myvmware.filters.validateCustomLabels();
	}
	/* callback methods for autosuggest plugin attached for diff fields - START */

	, sortByKey: function(array, key) {
		return array.sort(function(a, b) {
			var x = a[key]; var y = b[key];
			return ((x < y) ? -1 : ((x > y) ? 1 : 0));
		});
	}
	, disableForSearchInfo: function(oThis) {
		oThis.formObj.find('.basicFilter').addClass('disabled')
											.find('input').attr('disabled', 'disabled');
		
		oThis.formObj.find('.customLabelsDiv').addClass('disabled')
											.find('input').attr('disabled', 'disabled').addClass('disabled')
											.end()
											.find('a').attr('disabled', 'disabled').addClass('disabled');
	}
	, enableAfterSearchInfo: function(oThis) {
		oThis.formObj.find('.basicFilter').removeClass('disabled')
											.find('input').removeAttr('disabled');
		
		oThis.formObj.find('.customLabelsDiv').removeClass('disabled')
											.find('input').removeAttr('disabled', 'disabled').removeClass('disabled')
											.end()
											.find('a').removeAttr('disabled', 'disabled').removeClass('disabled');
	}
};

// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
(function(){
  var cache = {};
 
  this.tmpl = function tmpl(str, data){
    // Figure out if we're getting a template, or if we need to
    // load the template - and be sure to cache the result.
    var fn = !/\W/.test(str) ?
      cache[str] = cache[str] ||
        tmpl(document.getElementById(str).innerHTML) :
     
      // Generate a reusable function that will serve as a template
      // generator (and which will be cached).
      new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +
       
        // Introduce the data as local variables using with(){}
        "with(obj){p.push('" +
       
        // Convert the template into pure JavaScript
        str
          .replace(/[\r\t\n]/g, " ")
          .split("<%").join("\t")
          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
          .replace(/\t=(.*?)%>/g, "',$1,'")
          .split("\t").join("');")
          .split("%>").join("p.push('")
          .split("\r").join("\\'")
      + "');}return p.join('');");
   
    // Provide some basic currying to the user
    return data ? fn( data ) : fn;
  };
})();

/* initialise the filters form */
callBack.addsc({'f':'initializeFilters'});

function initializeFilters(){
	myvmware.filters.init();
}
/* exposed filter related stuff - END */

/* Begin Merger - code from managelicense_fp.js */
/* 1. Resource bundle for all the text , map
2. map for identifying the containers, event handlers
3.

1. decide which containers to display , identify the urls to data calls
2. decide the event handlers to be attached / detached
3. identify the view state to be shown ( involves showing and hiding )
a. manage the view state navigation ( involves showing and hiding )
4. close : clean up the containers and data */

/* The following object literal contains all the resources ( text strings ) used in Manage Licenses modals. This will go in to the JSP page */

if (typeof(myvmware) == "undefined") {
    myvmware = {};
}
ml = {};
myvmware.managelicenses = {
    init: function() {
        ml = myvmware.managelicenses;
        //Following variables must be reset to default values on closing popup
        ml.$modalRef = null;
        ml.mlType = "";
        ml.isCheckUpgrade = false;
        ml.isOptionSelected = false;
        ml.maxAllowedLicenseKeys = 50; // For performing upgrade 
        ml.selectedOption = -1;
        ml.selectedOptionObj = {};
        ml.qtyDirtyFlag = false;
        ml.licenseQuantitiesData = {};
        ml.isManyFromProducts = false;
        ml.currentViewState = "";
        ml.selectedLicenses = [];
        ml.moveToFolderID = "";
        ml.moveToFolderPath = "";
        ml.moveLicensesPreviewData = {};
        ml.refreshLicensesPane = false;
        /* flag to reload the licenseKey pane in the main page... cleaned up in the destructor method */
        ml.refreshProductsPane = false;
        ml.haveCustomLabels = false;
        // add methods to capture post data
        ml.mlMap = {
            combine: {
                initFun: ml.showCombineLicensesModal,
                mainCntr: "clSelection",
                dataTableData: [],
                postUrl: mlRS.combine.url.confirmActionUrl,
                postFun: ml.postDataCombine,
                renderFun: ml.common.renderClDlSuccess,
                rHeading: mlRS.combine.txt.resultHeading,
                successHeadingMsg: mlRS.combine.txt.finalSuccessMsg,
                resultKey: mlRS.result.resultCombineKey
            },
            divide: {
                initFun: ml.showDivideLicensesModal,
                mainCntr: "dlContainer",
                postFun: ml.postDataDivide,
                postUrl: mlRS.divide.url.confirmActionUrl,
                renderFun: ml.common.renderClDlSuccess,
                rHeading: mlRS.divide.txt.resultHeading,
                successHeadingMsg: mlRS.divide.txt.finalSuccessMsg,
                resultKey: mlRS.result.resultDivideKey
            },
            downgradeLicense: {
                initFun: ml.showDowngradeLicensesModal,
                mainCntr: "dglContainer",
                postFun: ml.postDataDowngrade,
                postUrl: mlRS.downgradeLicense.url.confirmActionUrl,
                renderFun: ml.common.renderDgUpSuccess,
                rHeading: mlRS.downgradeLicense.txt.resultHeading,
                successHeadingMsg: mlRS.downgradeLicense.txt.finalSuccessMsg
            },
            move: {
                initFun: ml.handleMoveLicenses,
                mainCntr: "mvlContainer",
                postFun: ml.common.preparePostDataToMoveLicenses,
                postUrl: mlRS.move.url.confirmActionUrl,
                renderFun: ml.common.renderMoveSuccess,
                rHeading: mlRS.move.txt.resultHeading,
                successHeadingMsg: mlRS.move.txt.finalSuccessMsg
            },
            upgradeLicense: {
                initFun: ml.handleUpgradeLicenses,
                mainCntr: "uglContainer",
                postFun: ml.postDataUpgrade,
                postUrl: mlRS.upgradeLicense.url.confirmActionUrl,
                renderFun: ml.common.renderDgUpSuccess,
                rHeading: mlRS.upgradeLicense.txt.resultHeading,
                successHeadingMsg: mlRS.upgradeLicense.txt.finalSuccessMsg
            }
        };

        ml.omniture = {
            combine: {
                start: 'vmware : my : group : my-licenses : combine',
                blank: 'vmware : my : group : my-licenses : combine : leave-labels-blank',
                newL: 'vmware : my : group : my-licenses : combine : create-new-labels',
                continueB: 'vmware : my : group : my-licenses : combine : continue',
                confirmB: 'vmware : my : group : my-licenses : combine : confirm',
                cancel: 'vmware : my : group : my-licenses : combine : cancel',
                continueNLB: 'vmware : my : group : my-licenses : combine : new-label-confirm',
                cancelNLB: 'vmware : my : group : my-licenses : combine : new-label-cancel',
                email: 'vmware : my : group : my-licenses : combine : send-email'
            },
            divide: {
                start: 'vmware : my : group : my-licenses : divide',
                blank: 'vmware : my : group : my-licenses : divide : leave-labels-blank',
                newL: 'vmware : my : group : my-licenses : divide : create-new-labels',
                copyL: 'vmware : my : group : my-licenses : divide : copy-labels',
                continueB: 'vmware : my : group : my-licenses : divide : continue',
                confirmB: 'vmware : my : group : my-licenses : divide : confirm',
                cancel: 'vmware : my : group : my-licenses : divide : cancel',
                continueNLB: 'vmware : my : group : my-licenses : divide : new-label-confirm',
                cancelNLB: 'vmware : my : group : my-licenses : divide : new-label-cancel',
                email: 'vmware : my : group : my-licenses : divide : send-email'
            },
            move: {
                start: 'vmware : my : group : my-licenses : move',
                confirmB: 'vmware : my : group : my-licenses : move : confirm',
                cancel: 'vmware : my : group : my-licenses : move : cancel',
                addF: 'vmware : my : group : my-licenses : move : add-folder',
                cancelF: 'vmware : my : group : my-licenses : move : cancel-folder',
                email: 'vmware : my : group : my-licenses : move : send-email'
            },
            downgradeLicense: {
                start: 'vmware : my : group : my-licenses : downgrade',
                blank: 'vmware : my : group : my-licenses : downgrade : leave-labels-blank',
                newL: 'vmware : my : group : my-licenses : downgrade : create-new-labels',
                copyL: 'vmware : my : group : my-licenses : downgrade : copy-labels',
                continueB: 'vmware : my : group : my-licenses : downgrade : continue',
                confirmB: 'vmware : my : group : my-licenses : downgrade : confirm',
                cancel: 'vmware : my : group : my-licenses : downgrade : cancel',
                continueNLB: 'vmware : my : group : my-licenses : downgrade : new-label-confirm',
                cancelNLB: 'vmware : my : group : my-licenses : downgrade : new-label-cancel',
                email: 'vmware : my : group : my-licenses : downgrade : send-email'
            },
            upgradeLicense: {
                start: 'vmware : my : group : my-licenses : upgrade',
                blank: 'vmware : my : group : my-licenses : upgrade : leave-labels-blank',
                newL: 'vmware : my : group : my-licenses : upgrade : create-new-labels',
                copyL: 'vmware : my : group : my-licenses : upgrade : copy-labels',
                continueB: 'vmware : my : group : my-licenses : upgrade : continue',
                confirmB: 'vmware : my : group : my-licenses : upgrade : confirm',
                cancel: 'vmware : my : group : my-licenses : upgrade : cancel',
                continueNLB: 'vmware : my : group : my-licenses : upgrade : new-label-confirm',
                cancelNLB: 'vmware : my : group : my-licenses : upgrade : new-label-cancel',
                email: 'vmware : my : group : my-licenses : upgrade : send-email'
            }
        }

        ml.viewStates = {
            "selection": "selection",
            "notesLabels": "notesLabels",
            "result": "result"
        };
    },
    common: {
        /*-----------------------------------------------------------------------------*/
        //Common / Helper  methods for all the flows of managing license keys go here.
        /*-----------------------------------------------------------------------------*/

        /**
         * Updates text in header portion of the modal window.
         */
        updateHeader: function(headerText, showDesc) {

            headerText = typeof headerText !== "undefined" ? headerText : mlRS[ml.mlType].txt.heading;
            showDesc = typeof headerText !== "undefined" ? showDesc : true;
            //Update heaer text
            //ml.$modalRef.find('#heading').html(mlRS[ml.mlType].txt.heading);
            ml.$modalRef.find('#heading').html(headerText);
            //Update description text
            var descText = '';
            if (showDesc) {
                if (ml.currentViewState === ml.viewStates.selection) {
                    descText = mlRS[ml.mlType].txt.selHeadingDesc;
                } else if (ml.currentViewState == ml.viewStates.notesLabels) {
                    descText = mlRS.common.nlHeadingDesc;
                }
                ml.$modalRef.find('#headingDesc').html(descText);
            } else {
                ml.$modalRef.find('#headingDesc').html("");
            }
        },
        /**
         * Updates text in notes and labels selection portion of the modal window.
         */
        updateNotesAndLabels: function() {
            if (ml.mlType === "move") {
                //Do not display notes and labels selection for move licenses
                ml.$modalRef.find("#mlNotesLabelsSel").hide();
            } else {
                ml.$modalRef.find('#nlHeading').html(mlRS[ml.mlType].txt.notesAndCustomLabelsHeading)
                    .end().find('#nlLeaveBlankText').html(mlRS[ml.mlType].txt.leaveBlankNotesText)
                    .end().find('#nlCopyExistingText').html(mlRS[ml.mlType].txt.copyExistingNotesText)
                    .end().find('#nlCreateNewText').html(mlRS[ml.mlType].txt.createNewNotesText);

                // while initializing the notes&labels radios, leaveBlank checkbox to be checked by default
                ml.$modalRef.find('#leaveBlank').attr('checked', 'checked');

                ml.events.validateNotesTA(300);
            }
        },
        /**
         *Updates text in attention portion of the modal window.
         */
        updateAttentionText: function() {
            ml.$modalRef.find('#attentionHeader').html(mlRS.common.attentionHeading)
                .end().find('#attentionMsg').html(mlRS[ml.mlType].txt.attentionMessageText)
                .end().find('#disclaimerContainer').html('<strong>' + mlRS[ml.mlType].txt.disclaimerText + '</strong>');
        },
        /**
         * Updates text labels for action buttons ( buttons in footer portion of the modal window ).
         */
        updateActionButtonsText: function() {
            ml.$modalRef.find('#backButton').html(mlRS.common.backButtonText)
                .end().find('#continueButton').html(mlRS.common.continueButtonText)
                .end().find('#confirmButton').html(mlRS.common.confirmButtonText)
                .end().find('#cancelButton').html(mlRS.common.cancelButtonText)
                .end().find('#okButton').html(mlRS.common.okButtonText);
        },
        /**
         * Updates the attention text and buttons text in bulk move alert modal window.
         */
        updateBulkMoveModalText: function() {
            ml.$modalRef.find('#mlAttention').find('span.boldText').html(mlRS.common.attentionHeading);
            ml.$modalRef.find('#bulkMoveattentionMsg').html(mlRS.move.txt.bulkMoveAttentionText);
            ml.$modalRef.find('#bulkMoveContinueBtn').html(mlRS.common.continueButtonText);
            ml.$modalRef.find('#bulkMoveCancel').html(mlRS.common.cancelButtonText);
        },

        /**
         * Handles navigation between multiple view states  inside modal window.
         * Possible view states are 1) Selection 2) Notes and Labels 3) confirmation.
         */
        navigateTo: function(viewState) {
            //Save the view state to which the user is navigating
            ml.currentViewState = viewState;
            ml.$modalRef.find(".mlView").hide();
            //Update text in header portion
            ml.common.updateHeader();
            //Update display of action buttons
            ml.common.toggleActionButtons(viewState);

            if (viewState === "selection") {
                ml.$modalRef.find("#mlCenterContainer").show();
                ml.$modalRef.find("#" + ml.mlMap[ml.mlType].mainCntr).show();
                ml.$modalRef.find('#innerCon').addClass('innerConHt');
            } else if (viewState === "notesLabels") {
                ml.$modalRef.find("#mlNotesLabels").show();
                ml.$modalRef.find('#innerCon').removeClass('innerConHt');
            } else if (viewState === "result") {
                ml.$modalRef.find("#mlResult").show();
                ml.common.initializeZeroclip();
                ml.$modalRef.find('#innerCon').removeClass('innerConHt');
            }
        },
        /**
         * Handles visibility of actions buttons ( in footer portion of the modal window ).
         */
        toggleActionButtons: function(viewState) {
            ml.$modalRef.find("#mlActions button").show();
            ml.$modalRef.find("#editQtyButton,#saveQtyButton").hide();
            if (viewState === "selection") {
                ml.$modalRef.find("#backButton, #okButton").hide();
                ml.handlers.handleNlRadioChange();
                if (ml.mlType == "upgradeLicense") {
                    ml.$modalRef.find("#confirmButton").hide();
                }
            } else if (viewState === "notesLabels") {
                //Upgrade options specific                                   
                ml.$modalRef.find("#continueButton, #okButton").hide();
            } else if (viewState === "result") {
                ml.$modalRef.find("#backButton, #continueButton, #confirmButton, #cancelButton,#editQtyButton,#saveQtyButton").hide();
            }
        },
        /**
         * Adds Get help Icon to the Modal
         */
        updateGetHelp: function() {
            $('#simplemodal-container').prepend('<a class="help" href="javascript:myvmware.common.openHelpPage(&#39;' + mlRS[ml.mlType].txt.getHelp + '&#39;);"></a>');
        },
        /**
         * To initialize Zero clip board module - To enable copy button functionality
         */
        initializeZeroclip: function() {
            $(window).scrollTop(0);
            vmf.zeroClipboardShow.init("#btncopyToClipboard", mlRS.result.lblCopied);
        },
        /* @method to render the result of combine license and divide license result.
         * @param {JSON} response
         */
        renderClDlSuccess: function(response) {
            ml.refreshLicensesPane = true;
            /*
             * @ variables to hold rendering result
             */
            var oldKeyHtml = [],
                newKeyHtml = [],
                newProdName = '';
            // To construct html structre for old license key list
            oldKeyHtml.push('<ul class="oldKeyResultList">');
            $.each(response.oldLicenseList, function(key, value) {
                oldKeyHtml.push('<li class="leftList">' + value.licenseKey + '&nbsp;' + '</li><li class="rightList"><span class="instanceCount">' + value.quantity + '&nbsp;' + value.unitOfMeasure + '&nbsp;' + '</span>' + '</li>');
            });
            oldKeyHtml.push('</ul>');
            // Append list to oldKey container
            ml.$modalRef.find('#oldKeyContainer').append(oldKeyHtml.join(''));
            // To construct html structre for new license key list
            newKeyHtml.push('<ul class="newKeyResultList">');
            $.each(response.newLicenseList, function(key, value) {
                newProdName = value.productName;
                newKeyHtml.push('<li class="leftList">' + value.licenseKey + '&nbsp;' + '</li><li class="rightList"><span class="instanceCount">' + value.quantity + '&nbsp;' + value.unitOfMeasure + '&nbsp;' + '</span>' + '<span class="newBadge">' + mlRS.result.newKey + '&nbsp;' + '</span>' + '</li>');
            });
            newKeyHtml.push('</ul>');
            ml.$modalRef.find('#oldHeading').html(ml.mlMap[ml.mlType].rHeading)
                .end().find('#newHeading').html(ml.mlMap[ml.mlType].resultKey + '&nbsp;' + newProdName + ':');
            // Append list to newKey container
            ml.$modalRef.find('#cLdLheading').html(ml.mlMap[ml.mlType].newClDlHeading);
            ml.$modalRef.find('#cLdLheading').show();
            ml.$modalRef.find("#successMessage").show();
            ml.$modalRef.find('#newKeyContainer').append(newKeyHtml.join(''));
            ml.$modalRef.find("#okButton").show();
            // method to set text for copy button
            ml.common.setTextForCopy();
        },
        renderMoveSuccess: function(response) {
            var len1,
                moveFromString,
                i,
                len2,
                _folderName,
                j;
            if (typeof response === "object") {
                ml.refreshLicensesPane = true; // updating the licenses-refreshing flag TEMPORARILY. update the flag updating when the service is ready
                ml.$modalRef.find(".moveWrapper").show();
                ml.$modalRef.find("#successMessage").show();
                ml.$modalRef.find("#movedToCntr h2").html(mlRS.result.moveResult);
				ml.$modalRef.find("#movedToCntr").append("<div>"+response.targetFolder+"</div>");

                len1 = ml.moveLicensesPreviewData.folder.length;
                moveFromString = "";
                for (i = 0; i < len1; i++) {
                    len2 = ml.moveLicensesPreviewData.folder[i].licenseKeys.length;
                    _folderName = ml.moveLicensesPreviewData.folder[i].name;
                    moveFromString +=  '<p class="movedHeading">' +_folderName+ '&nbsp;' + '</p>' ;
                    for (j = 0; j < len2; j++) {
						moveFromString +=   '<p>' + ml.moveLicensesPreviewData.folder[i].licenseKeys[j] + '&nbsp;' + '</p>';
                    }
                }
                ml.$modalRef.find("#movedFromCntr h2").html(mlRS.result.movedFrom);
                ml.$modalRef.find("#movedFromCntr").append(moveFromString);

            } else if (typeof response === "string") {

                if (response === "S") { // bulk move success
                    ml.refreshLicensesPane = true; // updating the licenses-refreshing flag TEMPORARILY. update the flag updating when the service is ready

                    ml.$modalRef.find("#bulkMoveuccessMessage").show();
                    ml.$modalRef.find(".resultContainer").hide();
                    ml.$modalRef.find(".sendBtnContainer").hide();
                } else {
                    ml.$modalRef.find(".moveWrapper").hide();
                    ml.common.renderError(response);
                }
            }
            ml.$modalRef.find("#okButton").show();
            // method to set text for copy button
                        ml.common.setTextForMoveCopy();
        },
        /*
         * @method  to render downgrade license and upgrade license result
         * @param {JSON} response
         */
        renderDgUpSuccess: function(response) {
            // variables to hold differenent operation result
            var deActivatedList = [],
                upDatedLicense = [],
                remaningLicenses = [],
                newProdName = '',
                targetProductList,
                baseProductList,
                instanceType = '',
                targetProdLen, i;

            // To construct html structre for old license key list
            deActivatedList.push('<ul class="oldKeyResultList">');
            $.each(response.deactivatedLicenses, function(key, value) {
                value[3] = (value[3] == undefined) ? "" : value[3];
                deActivatedList.push('<li class="leftList">' + value[0] + '&nbsp;' + '</li><li class="rightList"><span class="instanceCount">' + value[1] + '&nbsp;' + value[2] + '</span><span class="uglFolderPath">' + value[3] + '</span></li>');
                instanceType = value[2];
            });
            deActivatedList.push('</ul>');
            // if the operation is restricted downgrade
            if (response.restrictedProductDowngrade) {
                upDatedLicense.push('<ul class="oldKeyResultList">');
                upDatedLicense.push('<li>' + response.restrictedProductDowngrade.actualRestrictedDowngradedProduct + ' <span class="instanceCount">' + response.restrictedProductDowngrade.totalUpgradeDowngradeQuantity + ' ' + instanceType + '</span></li>');
                upDatedLicense.push('</ul>');
            } else if (response.restrictedProductUpgrade) { // if the operation is restricted upgrade
                upDatedLicense.push('<ul class="oldKeyResultList">');
                upDatedLicense.push('<li>' + response.restrictedProductUpgrade.actualRestrictedUpgradedProduct + ' <span class="instanceCount">' + response.restrictedProductUpgrade.totalUpgradeDowngradeQuantity + ' ' + instanceType + '</span></li>');
                upDatedLicense.push('</ul>');
            } else {
                // Append list to oldKey container
                targetProdLen = response.targetProductDetails.length;
                for (i = 0; i < targetProdLen; i++) {
                    upDatedLicense.push('<p>' + response.targetProductDetails[i].targetProduct + ':' + '</p>');
                    targetProductList = response.targetProductDetails[i].targetProductLicenses;
                    upDatedLicense.push('<ul class="newKeyResultList">');
                    $.each(targetProductList, function(key, value) {
                        value[3] = (value[3] == undefined) ? "" : value[3];
                        upDatedLicense.push('<li class="leftList">' + value[0] + '&nbsp;' + '</li><li class="rightList"><span class="instanceCount">' + value[1] + '&nbsp;' + value[2] + '</span>' + '<span class="newBadge">' + mlRS.result.newKey + '</span><span class="uglFolderPath">' + value[3] + '</span></li>');
                    });
                    upDatedLicense.push('<li class="clear"></li>');
                    upDatedLicense.push('</ul>');
                }
            }
            if (response.baseProductDetails) { // In partial downgrade/upgrade operation baseProductDetails obj will be present in response
                ml.refreshLicensesPane = true;

                // render base product list
                $.each(response.baseProductDetails, function(key, value) {
                    remaningLicenses.push('<p>' + value.baseProduct + ':' + '</p>');
                    baseProductList = value.baseProductLicenses;
                });
                // render remaning product list
                remaningLicenses.push('<ul class="remaningKeyList">');
                $.each(baseProductList, function(key, value) {
                    value[3] = (value[3] == undefined) ? "" : value[3];
                    remaningLicenses.push('<li class="leftList">' + value[0] + '&nbsp;' + '</li><li class="rightList"><span class="instanceCount">' + value[1] + '&nbsp;' + value[2] + '</span>' + '<span class="newBadge">' + mlRS.result.newKey + '&nbsp;' + '</span><span class="uglFolderPath">' + value[3] + '</span></li>');
                });
                remaningLicenses.push('<li class="clear"></li>');
                remaningLicenses.push('</ul>');
            } else { //In FULL downgrade/upgrade operation baseProductDetails obj will not be present in response
                ml.refreshProductsPane = true;
            }
            ml.$modalRef.find('#oldKeyContainer').append(deActivatedList.join(''));
            ml.$modalRef.find('#oldHeading').html(ml.mlMap[ml.mlType].rHeading)
                .end().find('#newHeading').html(mlRS.result.resultUpgradeKey + '<p>' + newProdName + '</p>');
            ml.$modalRef.find('#newKeyContainer').append(upDatedLicense.join(''));
            ml.$modalRef.find("#successMessage").show();
            ml.$modalRef.find('#remaningKeyContainer').append(remaningLicenses.join(''));
            ml.$modalRef.find("#okButton").show();
            // method to set text for copy functionality
            ml.common.setTextForCopy();
        },
        renderError: function(response) {
            var errorMsg = response || mlRS.error.generalAjaError;
            ml.$modalRef.find('#mlErrorContainer').html(mlRS.error.generalAjaError)
                .end().find('#mlErrorContainer').show();
            ml.$modalRef.find("#okButton").show();
        },
        // Zeroclipboard plugin needs data without html structure to avoid unnecessary space and carriage return
        setTextForCopy: function() {
            var printData = [];
            ml.$modalRef.find('#resultDataContainer').children().each(function(index) {
                if ($.trim($(this).text()) != '') {
                    printData.push($.trim($(this).text()));
                }
            });
            ml.$modalRef.find('#printContainer').html(printData.join("\r\n"));
        },
                        // Fix for BUG-00069811, quick fix need to find a better solution
                setTextForMoveCopy:function(){
                var printData = [];
                ml.$modalRef.find('#resultDataContainer').children().children().children().each(function(index){
                    if($.trim($(this).text()) != ''){
                        printData.push($.trim($(this).text()));
                    }
                });                    
                ml.$modalRef.find('#printContainer').html(printData.join("\r\n"));                
            },
        /**
         * Prepares DIV element to display custom lables Text Input
         */
        prepareCustomLabelCntr: function(clName, clContainerID, clInputID) {
			return "<div class='ctrlHolder clearfix' id='" + clContainerID + "'>"
			 	+ "<label >" + clName + "</label>"
			 	+ "<input type='text' placeholder='" + mlRS.common.value + "' value='' name='" + clName + "' id='" + clInputID + "'>"
			 	+ "<br class='clear'/>"
			 	+ "<div class='error_msg'>&nbsp;</div>"
			 + "</div>";
        },
        /**
         * Checks for special characters in string.
         * Used to validate the entry while entering 'custom label' values.
         */
        checkSpecialCharacters: function(txtval) {
            var splChars = "^~",
                eflag = false,
                i;
            for (i = 0; i < txtval.length; i++) {
                if (splChars.indexOf(txtval.charAt(i)) != -1 && !eflag) {
                    eflag = true;
                }
            }
            return eflag;
        },
        /**
         * Validates the 'custom label' values.
         * Checks for special characters (~^) and minimum length (3 chars).
         * Doesn't validate if the user leave the custom lable field blank.
         */
        validateCustomLabels: function() {
            var isFormValid = true;
            ml.$modalRef.find("#mlLabelsContainer div.ctrlHolder input[type='text']").each(function() {
                var clValue = $.trim($(this).val()),
                    isEntryValid = false,
                    splCharChk = false,
                    lengthChk = false,
                    errorMsg = '&nbsp;';
                if (clValue.length > 0) { //validate for non-empty
                    splCharChk = ml.common.checkSpecialCharacters(clValue);
                    lengthChk = clValue.length < 3;
                    if (splCharChk) {
                        errorMsg = mlRS.common.specialCharsValidationMsg;
                    } else if (lengthChk) {
                        errorMsg = mlRS.common.minLengthValidationMsg;
                    }
                }
                $(this).siblings("div.error_msg").html(errorMsg);
                isEntryValid = !(splCharChk || lengthChk);
                isFormValid = (isFormValid && isEntryValid);
            });
            return isFormValid;
        },
        /**
         * Prepares a concatenated string of custom label 'name' and 'value'.
         * Format : "name~value~NEW^name~value~NEW".
         * This string is used in the post request.
         */
        prepareCustomLabelsString: function() {
            var clStringArray = [],
                clPostString = "";
            ml.$modalRef.find("#mlLabelsContainer div.ctrlHolder input[type='text']").each(function() {
                var $this = $(this),
                    clValue = $this.val(),
                    clName = $this.attr("name");
                if ($.trim(clValue) != '' && clValue != $this.attr('placeholder')) {
                    clStringArray.push(clName + "~" + clValue + "~NEW");
                }
            });
            clPostString = clStringArray.join("^");
            return clPostString;
        },
        /**
         * Prepares LI element to display 'folder name' and associated licenses selected for moving.
         */
        prepareMoveFromListItem: function(folderName, licensesArray) {
            var len = licensesArray.length,
                licenseLI = "",
                moveFromLI,
                i;
            for (i = 0; i < len; i++) {
                licenseLI += "<li class='licenseItem'>" + licensesArray[i] + "</li>";
            }
			moveFromLI = "<li class='folderItem'><span class='moveFolderN ellipsisTxt'>" + folderName
				 + "</span><ul class='moveFromList'>"
				+licenseLI
				 + "</ul>"
				 + "</li>";
            return moveFromLI;
        },
        /**
         * Displays folder tree for all the available folders.
         */
        renderMoveToContainer: function() {

            var config = new Object();
            config.uniqueDiv = 'targetfolderPane';
            config.ajaxTimeout = 60000;
            config.wrapEllipseBtn = true;
            config.loadingClass = 'ajaxLoading';
            config.inputType = 'radio';
            //config.npMsgContent = fldConfnpMsgContent;
            /*config.npMsgFunction = function (msg) {
			ice.movekey.showExceptionMessages(msg);
			};*/
            config.cbOnClickFunction = function(folderId, cbState) {
                if ($('.' + folderId).children('span').hasClass('active')) {
                    $('.folderTxt').removeClass('normalWhiteSpace');
                    $('.' + folderId).children('span').find('.folderTxt').addClass('normalWhiteSpace').end().find('.openClose,input,.ellipsBadge').addClass('vAlignChilds');
                } else {
                    $('.' + folderId).children('span').find('.folderTxt').removeClass('normalWhiteSpace').end().find('.openClose,input,.ellipsBadge').removeClass('vAlignChilds');
                }
                var _folderHT = vmf.foldertreeAnother.getFolderHashtable(),
                    _folderId = _folderHT.get(folderId).folderId,
                    _fullFolderPath = _folderHT.get(folderId).fullFolderPath;
                //Store selected folder ID and folder path 
                ml.moveToFolderID = _folderId;
                ml.moveToFolderPath = _fullFolderPath;

                ml.common.handleFolderSelection(folderId, cbState);
            };
            config.cbOnFolderNodeCreate = function(folderElement, folderIds) {
                if (folderElement.find('li span').hasClass('disabled')) {
                    folderElement.find('li input[type=radio]').parent().append('<a class="tooltip" title="' + greyedOutFolderTooltip + '" data-tooltip-position="bottom" href="#">' + greyedOutFolderTooltip + '</a>');
                }
                myvmware.hoverContent.bindEvents($('a.tooltip'), 'defaultfunc');
            };
            config.validateJSONFunction = function(folderListJSON) {
                if (folderListJSON.error) {
                    ml.common.renderError(folderListJSON.message);
                }
            };
            config.errorFunction = function(response, errorDesc, errorThrown) {
                ml.common.renderError(folderListJSON.message);
            };
            var folderTreeResourceUrl = mlRS.move.url.foldersList;
            vmf.foldertreeAnother.build(folderTreeResourceUrl, config);
        },
        handleFolderSelection: function(folderId, cbState) {
            if (cbState == "checked") {
                //Disable 'add new folder link', 'disclaimer checkbox' and 'confirm' button 
                //Handle enabling or disabling based on the permissions retrieved 			
                ml.$modalRef.find('#fpDisclaimer').removeAttr('checked', 'checked').attr('disabled', 'disabled');
                ml.$modalRef.find('#confirmButton').attr('disabled', 'disabled').addClass('disabled');
                ml.$modalRef.find("#addNewFolderLink").removeClass("active");

                ml.ajax.getMinPermissionData(folderId, cbState);
            }
        },
        preparePostDataToMoveLicenses: function() {
            var _postData = {};
            _postData.targetFolderId = ml.moveToFolderID;
            _postData.targetFolderPath = ml.moveToFolderPath;

            if (!(ml.mlMap.move.postUrl == mlRS.move.url.bulkMove)) {
                _postData.selectedLicenseKeys = ml.selectedLicenses.join(',');
            }

            return _postData;
        },
        validateDowngradeDT: function(ele) {
            /* element to be validated is passed when onblur is executed. ELSE all the elements should be validated */
            var ele = ele || ml.$modalRef.find("#tbl_downgradelic input:text"),
                isDowngradeError = false;

            ele.removeClass('errorBorder').each(function() {
                var $this = $(this),
                    isnumber = /^-{0,1}\d*\.{0,1}\d+$/,
                    qtylen = $this.attr('id').length;
                maxId = $this.attr('id').substring(4, qtylen),
                isError = false,
                error_msg = '&nbsp;';
                if (!isnumber.test($this.val())) {
                    error_msg = ice.globalVars.enterNumericVal; //Note: static text needs to be moved to resource bundle
                    isError = true;
                } else if ($this.val() <= 0) {
                    error_msg = ice.globalVars.enterOneOrMoreMsg; //Note: static text needs to be moved to resource bundle
                    isError = true;
                } else if ($this.val() % 1 !== 0) {
                    error_msg = ice.globalVars.enterOneOrMoreMsg; //Note: static text needs to be moved to resource bundle
                    isError = true;
                } else if ($this.val() > parseInt($('#max_' + maxId).html())) {
                    error_msg = ice.globalVars.valueMustBeEqualMsg; //Note: static text needs to be moved to resource bundle
                    isError = true;
                }

                if (isError) {
                    isDowngradeError = true;
                    $this.addClass('errorBorder');
                }
                $this.closest('td').find('.error_msg').html(error_msg);
                                if(error_msg != '&nbsp;'){
                                    $this.closest('td').find('.error_msg').show();
                                }
                                else{
                                    $this.closest('td').find('.error_msg').hide();
                                }
                                
            });
            if (isDowngradeError) {
                ml.$modalRef.find("#tbl_downgradelic input[type=text].errorBorder")[0].focus();
            }
            return isDowngradeError;
        },
        validateUpgradeDT: function(ele) {
            /* element to be validated is passed when onblur is executed. ELSE all the elements should be validated */
            var ele = ele || ml.$modalRef.find("#tbl_upgradeLicenseQuantities input.totalQty"),
                isUpgradeError = false;
            ele.removeClass('errorBorder').each(function() {
                var $this = $(this),
                    isnumber = /^-{0,1}\d*\.{0,1}\d+$/,
                    qtylen = $this.attr('id').length;
                maxId = $this.attr('id').substring(4, qtylen),
                isError = false,
                error_msg = '';
                if (!isnumber.test($this.val())) {
                    error_msg = ice.globalVars.enterNumericVal; //Note: static text needs to be moved to resource bundle
                    isError = true;
                } else if ($this.val() <= 0) {
                    error_msg = ice.globalVars.enterOneOrMoreMsg; //Note: static text needs to be moved to resource bundle
                    isError = true;
                } else if ($this.val() % 1 !== 0) {
                    error_msg = ice.globalVars.enterOneOrMoreMsg; //Note: static text needs to be moved to resource bundle
                    isError = true;
                } else if ($this.val() > parseInt($(this).data().qtyToUpgradeAvail)) { // parseInt($('#max_' + maxId).html())
                    error_msg = ice.globalVars.valueMustBeEqualMsg; //Note: static text needs to be moved to resource bundle
                    isError = true;
                }

                if (isError) {
                    isUpgradeError = true;
                    $this.addClass('errorBorder');
                }
                $this.closest('td').find('.error_msg').html(error_msg);
            });
            if (isUpgradeError) {
                ml.$modalRef.find("#tbl_upgradeLicenseQuantities input[type=text].errorBorder")[0].focus();
            }
            return isUpgradeError;
        },
        renderUpgradeOptions: function(upgradeOptions) {

            ml.$modalRef.find('#uglContainer .loading, #uglErrorContainer, #okButton').hide();
            ml.$modalRef.find("#uglOptionsContainer, div.exportLicenseKey").show();
            var len = upgradeOptions.options.length;
            var i,
                upgradeOptionObj,
                upgradeToString,
                upgradeFromString,
                upgradeToHeight,
                upgradeFromHeight,
                upgradeString,
                varBgClr = "";

            ml.$modalRef.find("##uplOptionsContent table").empty();

            for (i = 0; i < len; i++) {

                upgradeOptionObj = upgradeOptions.options[i];

                upgradeToString = ml.common.prepareUpgradeTo(upgradeOptionObj.option, upgradeOptionObj.to, true, false, null);
                upgradeFromString = ml.common.prepareUpgradeFrom(upgradeOptionObj.option, true, upgradeOptionObj.from, false);

                varBgClr = (i%2 != 0 ? " style='background-color: #F5FAFF;'" : "");
                upgradeString = "<tr" + varBgClr + ">" + upgradeFromString + upgradeToString + "</tr>";
                ml.$modalRef.find("#uplOptionsContent table").append(upgradeString);
                //Setting the upgrade option data which is used to display selected option on the licenses page 
                ml.$modalRef.find("#uglOptionsContainer button.selectOption").eq(i).data("selectedOption", upgradeOptionObj);
            }

            //Register event handler for option select 
            ml.$modalRef.find("#uglOptionsContainer button.selectOption").unbind('click').bind('click', ml.handlers.handleUpgradeOptionSelect);
        },
        prepareUpgradeTo: function(option, upgradeTo, withDesc, withQty, upgradeFrom) {

            var len = upgradeTo.length;
            var upgradeToProduct,
                upgradeToLIs = "",
                upgradeToDIV = "",
                upgradeToProdDesc = "",
                userUpgradeQuantity = 0,
                qtyToUpgradeAvail = 0,
                totalQuantity = "",
                i;

            if (withQty && upgradeFrom != null){
            	//var fromLen = upgradeFrom.length;
            	var upgradeFromProduct = upgradeFrom[0];
            	var licenseKeyLen = upgradeFromProduct.licenseKeys.length;
            	var j;
            	for (j = 0; j < licenseKeyLen; j++){
            		userUpgradeQuantity += upgradeFromProduct.licenseKeys[j].userUpgradeQty;
            		qtyToUpgradeAvail += upgradeFromProduct.licenseKeys[j].qtyToUpgradeAvail;
            	}
            }
            for (i = 0; i < len; i++) {
                upgradeToProduct = upgradeTo[i];

                if (upgradeToProduct.productDesc != null && upgradeToProduct.productDesc != "") {
                    upgradeToProdDesc = "<p>" + upgradeToProduct.productDesc + "</p>";
                } else {
                    upgradeToProdDesc = "";
                }
                if (withQty){
                	totalQuantity = Math.round((upgradeToProduct.totalAvailQty *  userUpgradeQuantity) /  qtyToUpgradeAvail);
                	totalQuantity = totalQuantity + " " + upgradeToProduct.uom;
                }
                upgradeToLIs += "<li><span class='qtyUOM'>" + (withQty ? totalQuantity : "") + "</span><label>" + upgradeToProduct.productName + "</label>" + (withDesc ? upgradeToProdDesc : "") + "</li>";
            }

            upgradeToDIV = " <div class='uplToProduct'><ul>" + upgradeToLIs + "</ul></div>";

            if (withDesc) { // Select option button is only displayed in the modal window 
                upgradeToDIV += "<button id='option_" + option + "' class='button primary selectOption'>Select this option</button>";
            }
            upgradeToDIV = "<td class='uglToProducts'>" + upgradeToDIV + "</td>";

            return upgradeToDIV;
        },
        prepareUpgradeFrom: function(option, showOption, upgradeFrom, withQty) {

            var len = upgradeFrom.length;
            var nonAnchorDescDIV = "<div class='nonAnchorDesc'><p>This option requires you to upgrade other related products at the same time.</p><label>These products include:</label></div>";
            var upgradeFromDIV = "",
                optionLabel = "",
                anchorProductLbl = "",
                nonAnchorProductLbl = "",
                nonAnchorProducts = "",
                isAnchorProduct = false,
                upgradeFromProduct, i , userUpgradeQuantity =0;
				if (withQty && upgradeFrom != null){
					var upgradeFromLicense = upgradeFrom[0];
					var licenseKeyLen = upgradeFromLicense.licenseKeys.length;
					var j;
					for (j = 0; j < licenseKeyLen; j++){
						userUpgradeQuantity += upgradeFromLicense.licenseKeys[j].userUpgradeQty;
					}
					var fromUom = upgradeFromLicense.licenseKeys[0].uom;
				}
            if (len == 1) { // There is only one product, so it has to be an anchor product 
                if (showOption) {
                    optionLabel = "<span class='uplFromOption'><p>OPTION " + option + "</p></span>";
                }
				if (withQty && upgradeFrom != null){
					 anchorProductLbl = "<span class='qtyUOM'>" + (withQty ? userUpgradeQuantity + " " + fromUom : "") + "</span><label class='anchorProduct'>" + upgradeFrom[0].productName + "</label>";
				}else{
					anchorProductLbl = "<span class='qtyUOM'>" + (withQty ? upgradeFrom[0].totalAvailQty : "") + "</span><label class='anchorProduct'>" + upgradeFrom[0].productName + "</label>";
				}
                upgradeFromDIV = "<div class='uplFromProduct'>" + optionLabel + anchorProductLbl + "</div>";
            } else {
                for (i = 0; i < len; i++) {
                    upgradeFromProduct = upgradeFrom[i];
                    isAnchorProduct = (upgradeFromProduct.anchor === "TRUE") ? true : false;
                    if (isAnchorProduct) {
                        if (showOption) {
                            optionLabel = "<span class='uplFromOption'><p>OPTION " + option + "</p></span>";
                        }
						if (withQty && upgradeFrom != null){
							anchorProductLbl = "<span class='qtyUOM'>" + (withQty ? userUpgradeQuantity + " " + fromUom : "") + "</span><label class='anchorProduct'>" + upgradeFromProduct.productName + "</label>";
						}else{
							anchorProductLbl = "<span class='qtyUOM'>" + (withQty ? upgradeFromProduct.totalAvailQty : "") + "</span><label class='anchorProduct'>" + upgradeFromProduct.productName + "</label>";
						}
                    } else {
                        nonAnchorProductLbl = "<span class='qtyUOM'>" + (withQty ? upgradeFromProduct.totalAvailQty : "") + "</span><label class='nonAnchorProduct'>" + upgradeFromProduct.productName + "</label>";
                        nonAnchorProducts += nonAnchorProductLbl;
                    }
                }
                upgradeFromDIV = "<div class='uplFromProduct'>" + optionLabel + anchorProductLbl + nonAnchorDescDIV + nonAnchorProducts + "</div>";
            }
            upgradeFromDIV = "<td class='uglFromProducts'>" + upgradeFromDIV + "</td>";

            return upgradeFromDIV;
        },
        addExpandCollapseColumn: function() {

            $('#tbl_upgradeLicenseQuantities tbody tr').each(function() {
                //this.insertBefore(nCloneTd.cloneNode(true), this.childNodes[0]);
                $(this).find("td:eq(0)").html('<div class="openCloseSelect"><a href="#" class="openClose"></a></div>' + $(this).find("td:eq(0)").html());
                $(this).find("td:eq(0)").css("width", "421px");
                $(this).find("td:eq(1)").css({
                    "width": "123px",
                    "text-align": "center"
                });
                $(this).find("td:eq(2)").css({
                    "width": "183px",
                    "text-align": "center"
                });

            });

            // Add event listener for opening and closing details          
            $('#tbl_upgradeLicenseQuantities tbody td a.openClose').unbind('click').bind('click', ml.handlers.handleDetailsExpandCollapse);
            $('#tbl_upgradeLicenseQuantities tbody td a.openClose').eq(0).trigger('click');

        },
        fnFormatDetails: function(oTable, nTr) {
            var aData = $('#tbl_upgradeLicenseQuantities').dataTable().fnGetData(nTr);

            var rowIndex = $('#tbl_upgradeLicenseQuantities').dataTable().fnGetPosition(nTr);
            var subTableId = "tbl_upgradeLicenseQuantities" + rowIndex;

            var sOut = "<table cellpadding='0' cellspacing='0' border='0' class='display' id='" + subTableId + "'>" +
                "<thead>" +
                "<tr>" +
                "<th>licenseKey</th>" +
                "<th>TtotalQty</th>" +
                "<th>qtyToUpgradeAvail</th>" +
                "<th>folder</th>" +
                "</tr>" +
                "</thead>" +
                "</table>";

            return sOut;
        },
        createUglQtyTable: function(fromData) {

            $("#tbl_upgradeLicenseQuantities").not('.isinitialized').addClass('isinitialized');
            vmf.datatable.build(ml.$modalRef.find('#tbl_upgradeLicenseQuantities'), {
                "bInfo": false,
                "bPaginate": false,
                "bFilter": false,
                "sDom": 'zrtSpi',
                "sScrollY": 275,
                "bAutoWidth": false,
                "bServerSide": false,
                "aoColumns": [{
                    "sWidth": "421px",
                    "sTitle": "<span class='uplQtyHeader'>"+ mlRS.common.productLabel+"</span>",
                    "bSortable": false,
                    "mDataProp": "productName"
                }, {
                    "sWidth": "123px",
                    "sTitle": "<span class='uplQtyHeader'>" + mlRS.common.dataTableHeadingCombine + "</span>",
                    "bSortable": false,
                    "mDataProp": function(data, type, full) {
                        return data.licenseKeys.length;
                    }
                }, {
                    "sWidth": "183px",
                    "sTitle": "<span class='uplQtyHeader'>"+ mlRS.common.totalAvailQtyTxt +"</span>",
                    "bSortable": false,
                    "mDataProp": "totalAvailQty"
                }],
                "aaData": fromData,
                "bSort": false,
                "fnInitComplete": function() {
                    ml.$modalRef.find("#tbl_upgradeLicenseQuantities_wrapper div.dataTables_scrollHeadInner").css("width", '100%');
                    ml.$modalRef.find("#tbl_upgradeLicenseQuantities_wrapper div.dataTables_scrollHeadInner table.isinitialized").css("width", '100%');
                    //$("#tbl_upgradeLicenseQuantities>thead").remove(); /*Removing the table header to show no header*/
                    ml.$modalRef.find("#tbl_upgradeLicenseQuantities_wrapper span.uplQtyHeader").parent("th").addClass("uglQtyHeader");
                    ml.common.addExpandCollapseColumn();
                }
            });
        },
        getUpgradeLicenseQtyString: function(isKeyId) {

            var originalVal, currentVal, licenseKey,keyId, i, j, len1, len2, fromObj, licenseObj,upgradeLicenseQtyString="";
            var arrayOfQtyChange = new Array();
            var _postData = {};
            
            var qtyInputs = $("#tbl_upgradeLicenseQuantities input.totalQty");
            if (qtyInputs.length > 0) {

                qtyInputs.each(function() {

                	if(isKeyId){
                    	keyId = $(this).data().keyId;
                    	currentVal = parseInt($(this).val());
                    	arrayOfQtyChange.push(keyId + ":" + currentVal);
                    }else{
                    	licenseKey = $(this).data().licenseKey;
                    	currentVal = parseInt($(this).val());
                    	arrayOfQtyChange.push(licenseKey + ":" + currentVal);
                    }                        

                });

            } else {

                len1 = ml.licenseQuantitiesData.from.length;
                for (i = 0; i < len1; i++) {
                    fromObj = ml.licenseQuantitiesData.from[i];
                    if (fromObj.anchor == "TRUE") {
                        len2 = fromObj.licenseKeys.length;
                        for (j = 0; j < len2; j++) {
                            licenseObj = fromObj.licenseKeys[j];

                            if(isKeyId){
                            	keyId = licenseObj.keyId;
                            	currentVal = licenseObj.userUpgradeQty;
                            	arrayOfQtyChange.push(keyId + ":" + currentVal);
                            }else{
                            	licenseKey = licenseObj.licenseKey;
                            	currentVal = licenseObj.userUpgradeQty;
                            	arrayOfQtyChange.push(licenseKey + ":" + currentVal);
                            }                            

                        }

                    }
                }
            }

           upgradeLicenseQtyString = arrayOfQtyChange.join(',');
           return upgradeLicenseQtyString; 

        },
        renderUglError: function(response) {
            if(ml.$modalRef){
                ml.$modalRef.find("#mlNotesLabelsSel,#mlAttention,#uglOptionsContainer,#uglQuantitiesContainer,#uglTblcontainer, div.exportLicenseKey, #uglContainer .loading, #cancelButton, #editQtyButton, #continueButton, #saveQtyButton, #backButton, #confirmButton").hide();
                ml.$modalRef.find('#innerCon').removeClass('innerConHt');
                var errorMsg = response || mlRS.error.generalAjaError;
                ml.$modalRef.find('#uglErrorContainer').html(mlRS.error.generalAjaError)
                    .end().find('#uglErrorContainer').show();
                ml.$modalRef.find("#okButton").show();    
            }
            
        }, 
        cleanUpgradeData:function(){

        	ml.isCheckUpgrade = false;
            ml.isOptionSelected = false;
            ml.selectedOption = -1;
            ml.selectedOptionObj = {};
            ml.qtyDirtyFlag = false;
            ml.licenseQuantitiesData = {};
            ml.isManyFromProducts = false;                       
        }
    },
    events: {
        /** All the event bindings go here **/
        addActionButtonHandlers: function() {
            ml.$modalRef.find("#backButton").bind('click', ml.handlers.handleBack);
            ml.$modalRef.find("#continueButton").bind('click', ml.handlers.handleContinue);
            ml.$modalRef.find("#confirmButton").bind('click', ml.handlers.handleConfirm);
            ml.$modalRef.find("#cancelButton").bind('click', ml.handlers.handleCancel);
            ml.$modalRef.find("#okButton").bind('click', ml.handlers.handleOk);
            //ml.$modalRef.find(".simplemodal-close").bind('click', ml.handlers.handleClose);
            $(".simplemodal-close").bind('click', ml.handlers.handleClose);
            /*Event Bindings for result component*/
            ml.$modalRef.find(".closeSuccessMsg").bind('click', function() {
                ml.$modalRef.find('#successMessage').hide();
            });
            ml.$modalRef.find("#btnPrint").bind('click', function() {
                ml.handlers.handlePrint();
            });
        },
        nlRadioChange: function() {
            ml.$modalRef.find('input[name=notesAndCustomlabels]').unbind('click').bind('click', ml.handlers.handleNlRadioChange);
        },
        disclaimerCheckboxChange: function() {
            ml.$modalRef.find('#fpDisclaimer').unbind('click').bind('click', ml.handlers.handleDisclaimerCheckBox).attr('checked', false);
        },
        /**
         * Registers event handles for 'Add' , 'Cancel' and 'New Folder' links in the Move To Container.
         */
        regNewFolderActionHandlers: function() {
            ml.$modalRef.find("#mlNewFolderName").unbind('keyup').bind('keyup', ml.handlers.newFolderNameChange);
            ml.$modalRef.find("#addNewFolderLink").unbind('click').bind('click', ml.handlers.toggleAddNewFolderCntr);
            ml.$modalRef.find("#mlAddFolderCancel").unbind('click').bind('click', ml.handlers.toggleAddNewFolderCntr);
            ml.$modalRef.find("#mlAddFolder").unbind('click').bind('click', ml.handlers.doAddNewFolder)
                .attr('disabled', true).addClass('disabled');
        },
        /**
         * Registers and handles actions in bulk move modal for Continue and Cancel buttons.
         */
        regBulkMoveModalActionHandlers: function() {

            ml.$modalRef.find('#bulkMoveContinueBtn').unbind('click').bind('click', function() {
                vmf.modal.hide();
                ml.mlMap.move.postUrl = mlRS.move.url.bulkMove;
                //Using normal URL for now for bulk move
                //ml.mlMap.move.postUrl = mlRS.move.url.confirm;
                // Timer added to wait for the completion of cleaning up data for previous modal before showing next modal. 
                setTimeout(function() {
                    ml.showMoveLicensesModal();
                }, 50);
            });
            ml.$modalRef.find('#bulkMoveCancel').unbind('click').bind('click', function() {
                vmf.modal.hide();
                ml.mlMap.move.postUrl = mlRS.move.url.confirm;
            });
        },
        validateNotesTA: function(limit) {
            ml.$modalRef.find('#mlNotesTA').unbind('keypress keydown').bind('keypress keydown', function(e) {
                var val = $(this).val(),
                    limit = $(this).attr('maxlength') || limit,
                    key = e.keyCode || e.charCode;
                if ((key != 8 && key != 46) && val.length > limit) {
                    e.preventDefault();
                }
            });
        },
        registerQuantityChageHandler: function() {

            ml.$modalRef.find('#tbl_upgradeLicenseQuantities input.totalQty').die('focus', 'blur').live({
                'focus': function() {
                    if (this.value == 0)
                        this.value = '';
                },
                'blur': function() {
                    if (this.value == '') {
                        this.value = 0;
                    }
                    ml.handlers.handleQuantityChange($(this));
                }
            });
        }
        /*, sendEmailCheckboxChange: function() {
		ml.$modalRef.find('#copyToMymail').to .unbind('click').bind('click', ml.handlers.handleCopytoMyMail).attr('checked', false);
		}*/
    },
    handlers: {
        /** All the  event handlers go here **/
        successCustomLabels: function(data) {
            //Hide the Loading Text content
            ml.$modalRef.find('#mlNotesLabels .loading').hide();

            //Show the container having custom label text inputs
            ml.$modalRef.find("#mlLabelsContainer").show();
            var labelsArray = vmf.json.txtToObj(data),
                len = labelsArray.labels.length,
                clName,
                clNameForID,
                clContainerID,
                clInputID,
                clContainerDiv,
                i;
            if (len > 0) {
                for (i = 0; i < len; i++) {
                    clName = labelsArray.labels[i];
                    clNameForID = clName.replace(/\s+/g, ''); //removeSpace
                    clContainerID = clNameForID + "Div";
                    clInputID = clNameForID + "TI";
                    clContainerDiv = ml.common.prepareCustomLabelCntr(clName, clContainerID, clInputID);
                    if (i < (len / 2)) {
                        ml.$modalRef.find("#mlLabelsContainer div.first").append(clContainerDiv);
                    } else {
                        ml.$modalRef.find("#mlLabelsContainer div.second").append(clContainerDiv);
                    }
                }
                ml.haveCustomLabels = true;
                myvmware.common.putplaceHolder(ml.$modalRef.find("#mlLabelsContainer input[type=text]"));
            }
        },
        handleContinue: function() {
            if (ml.mlType === 'divide') {
                var isError = ml.computeTotal();
                if (isError) {
                    return false;
                }
            } else if (ml.mlType === 'downgradeLicense') {
                if (ml.common.validateDowngradeDT()) {
                    return false;
                }
            } else if (ml.mlType === 'upgradeLicense') {
                ml.$modalRef.find("#editQtyButton,#saveQtyButton").hide();
                ml.$modalRef.find("#backButton").unbind('click').bind('click', ml.handlers.handleBack);
                if (ml.common.validateUpgradeDT()) {
                    return false;
                }
            }
            //Navigate to notes and custom labels view
            ml.common.navigateTo(ml.viewStates.notesLabels);
            //Make an ajax call to retrive custom labels if not already retrieved
            riaLinkmy(ml.omniture[ml.mlType].continueB);
            if (!ml.haveCustomLabels) {
                ml.ajax.getCustomLabels();
            }
        },
        handleConfirm: function() {

        	//Disabling the 'confirm' button to avoid duplicate calls  BUG-00071291
        	ml.$modalRef.find("#confirmButton").attr("disabled","disabled");

            if (ml.mlType === 'divide') {
                var isError = ml.computeTotal();
                if (isError) {
                    return false;
                }
            } else if (ml.mlType === 'downgradeLicense') {
                if (ml.common.validateDowngradeDT()) {
                    return false;
                }
            } else if (ml.mlType === 'upgradeLicense') {
                if (ml.common.validateUpgradeDT()) {
                    return false;
                }
            }

            //validateDisclaimer
            //perform validation based on the state ( i.e if the current state is in custom lables ) : validateNotesAndCustomLabels
            //post the data to the server
            var postData = {},
                isError;
            // get notes and labels data for post
            if (ml.currentViewState === ml.viewStates.notesLabels) {
                if (ml.common.validateCustomLabels()) {
                    postData.licenseKeyNotes = (ml.$modalRef.find("#mlNotesTA").val()).substring(0, 299);
                    postData.labelLov = ml.common.prepareCustomLabelsString();
                    riaLinkmy(ml.omniture[ml.mlType].continueNLB);
                } else {
                    return false;
                }
            } else {
                riaLinkmy(ml.omniture[ml.mlType].confirmB);
            }
            postData.notesLabelsOption = ml.$modalRef.find('input[name=notesAndCustomlabels]:checked').attr('id');
            $.extend(postData, ml.mlMap[ml.mlType].postFun.call());
            ml.common.navigateTo(ml.viewStates.result);
            // send the data to server to combine licensekeys
            vmf.ajax.post(ml.mlMap[ml.mlType].postUrl, postData, function(resp) {
                // on the ajax's success, Hide the Loading Text content AND enable the OK button
                ml.$modalRef.find('#mlResult .loading').hide()
                    .end().find(".sendBtnContainer, .resultMainContainer").show()
                    .end().find("#okButton").attr('disabled', false).removeClass('disabled')
                    .end().find("#lblSendMail").html('<strong>' + mlRS.result.lblSendCopy + '</strong>');
                ml.$modalRef.find("#successMessage h3").html(ml.mlMap[ml.mlType].successHeadingMsg);
                ml.$modalRef.find("#confirmButton").removeAttr("disabled");
                resp = vmf.json.txtToObj(resp);
                if (resp == null) {
                    ml.mlMap[ml.mlType].renderFun(resp)
                }
                resp.error ? ml.common.renderError(resp.message) : ml.mlMap[ml.mlType].renderFun(resp);

            }, function() {
                //error handler
            });
        },
        handleCancel: function() {
            if (ml.currentViewState === ml.viewStates.notesLabels) {
                riaLinkmy(ml.omniture[ml.mlType].cancelNLB);
            } else {
                riaLinkmy(ml.omniture[ml.mlType].cancel);
            }
            vmf.modal.hide();
            //TODO : move this to a common place 
            //ml.isOptionSelected = false;
            //ml.ajax.clearSessionForUpgrade();
        },
        handleBack: function() {
            ml.common.navigateTo(ml.viewStates.selection);
            if (ml.mlType === 'upgradeLicense') {
                ml.common.updateHeader(mlRS[ml.mlType].txt.headingLicKeysQtys, false);
                ml.$modalRef.find("#mlNotesLabelsSel input[type='radio']").eq(0).attr("checked", "checked");
                ml.$modalRef.find("#fpDisclaimer").removeAttr("checked");
                ml.$modalRef.find('#innerCon').removeClass('innerConHt');
                ml.$modalRef.find("#backButton").removeAttr('disabled').removeClass('disabled').show();
                ml.$modalRef.find("#continueButton").attr('disabled', 'disabled').addClass('disabled').hide();
                ml.$modalRef.find("#confirmButton").attr('disabled', 'disabled').addClass('disabled').show();
                ml.$modalRef.find("#backButton").unbind('click').bind('click', ml.handlers.handleBackForUGL);
            }
        },
        handlePopupClose: function(mlType, isCheckUpgrade) {
            if (ml.$modalRef) {
                ml.$modalRef.find('.modalContent [style]').removeAttr('style');
                ml.$modalRef.find('#mlActions button').unbind('click');
                //clean up validation messages ( notes and labels section )
                ml.$modalRef.find("#mlLabelsContainer div.error_msg").text('&nbsp;');
                ml.$modalRef = null;
                //ml.mlType = null;
                ml.currentViewState = null;
                ml.selectedLicenses = [];
                ml.refreshLicensesPane = false;
                ml.refreshProductsPane = false;
                ml.haveCustomLabels = false;

                var isInUpgradeFlow = (!isCheckUpgrade) && ml.isOptionSelected && (ml.mlType == 'upgradeLicense') && (mlType == 'upgradeLicense');

                if (isCheckUpgrade || !isInUpgradeFlow) {
                   ml.mlType = null;
                   ml.common.cleanUpgradeData();
                   ml.ajax.clearSessionForUpgrade();
                }
                vmf.modal.hide();
            }
        },        
        handleNlRadioChange: function() {
            var selRBtn = ml.$modalRef.find('input[name=notesAndCustomlabels]:checked').attr('id');
            if (selRBtn === 'createNew') {
                riaLinkmy(ml.omniture[ml.mlType].newL);
                ml.$modalRef.find("#continueButton").show()
                    .end().find("#confirmButton").hide();
                if (ml.$modalRef.find("#fpDisclaimer").is(":checked")) {
                    ml.$modalRef.find("#continueButton").removeAttr("disabled").removeClass('disabled');
                } else {
                    ml.$modalRef.find("#continueButton").attr("disabled", "disabled").addClass('disabled');
                }
            } else {
                switch (selRBtn) {
                    case 'leaveBlank':
                        riaLinkmy(ml.omniture[ml.mlType].blank);
                        break;
                    case 'copyExisting':
                        riaLinkmy(ml.omniture[ml.mlType].copyL);
                        break;
                }
                //ml.$modalRef.find("#fpDisclaimer").attr("checked",$(this).is(":checked"));
                ml.$modalRef.find("#continueButton").hide()
                    .end().find("#confirmButton").show();
            }
        },
        handleDisclaimerCheckBox: function() {
            ml.$modalRef.find("#continueButton, #confirmButton").attr('disabled', !$(this).is(":checked"))
                .toggleClass('disabled');
        },
        handlePrint: function() {
            var data = ml.$modalRef.find('#resultDataContainer').html();
            var parentLocation = window.location;
            var mywindow = window.open(parentLocation + '/print.html', '', 'height=400,width=600');
            mywindow.document.write('<!DOCTYPE html><html><head><title>Result</title><meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />');
            mywindow.document.write('</head><body>');
            mywindow.document.write(data);
            mywindow.document.write('</body></html>');
            mywindow.focus();
            mywindow.print();
            // IE bug - need to reload the page to execute window.print
            mywindow.location.reload();
            mywindow.close();
            return true;
        },
                handleIEPrint : function(){                   
                },
        handleOk: function() {
            var postParam = '';
            //TODO : move this to a common place 
            ml.isOptionSelected = false;
            ml.ajax.clearSessionForUpgrade();
            if (ml.$modalRef.find("#copyToMymail").attr('checked')) {
                postParam = 'licenseKeyAction=' + ml.mlType;
                riaLinkmy(ml.omniture[ml.mlType].email);
                vmf.ajax.post(mlRS.combine.url.sendEmails, postParam, function(resp) {
                    // @resp - is not used
                    $(".simplemodal-close").trigger('click');
                }); //*/                   
            } else {
                $(".simplemodal-close").trigger('click');
            }
        },
        handleClose: function() {
            //TODO : move this to a common place 
            //ml.isOptionSelected = false;
            //ml.ajax.clearSessionForUpgrade();
            if (ml.refreshLicensesPane || ml.refreshProductsPane) {
                ice.managelicense.uiSession = [];
                var productId = $('#productSummary tr.selected').data("productId");
                if (productId != "") {
                    ice.managelicense.uiSession.prodId = productId;
                }
				$("#sel_wantTo option[value='viewLicense']").attr("selected", "selected");
                $('#sel_wantTo').trigger('change');
                // code to clear the licensespane's content
                $("#productMessage, #currentProductName, #keyManagement, .rightaligned_link").slideUp();
                $(".filter-section-header, .content", $("#keyManagement")).slideUp();
            } else {
                if (ml.currentViewState === ml.viewStates.selection) {
                    riaLinkmy(ml.omniture[ml.mlType].cancel);
                } else if (ml.currentViewState == ml.viewStates.notesLabels) {
                    riaLinkmy(ml.omniture[ml.mlType].cancelNLB);
                }
            }
        },
        successMoveLicensesPreview: function(data) {

            ml.$modalRef.find(".moveFromWrapper .loading").hide();
            data = vmf.json.txtToObj(data);

            //save the data for rendering success page
            ml.moveLicensesPreviewData = data;

            var len = data.folder.length,
                moveFromLIs = "";
            ml.$modalRef.find("#moveProductName").text(ice.globalVars.productLbl + " " + data.prodName);
            for (var i = 0; i < len; i++) {
                moveFromLIs += ml.common.prepareMoveFromListItem(data.folder[i].name, data.folder[i].licenseKeys);
            }
            ml.$modalRef.find("#moveFromListItems").append(moveFromLIs);
            ml.$modalRef.find('#mvlContainer').find('.ellipsisTxt').die('click').live("click", function() {
                $(this).addClass('normalWhiteSpace');
            });

        },
        failureMoveLicensesPreview: function() {
            //handle display of error here
        },
        /**
         * Handles show / hide of the add new folder container.
         */
        toggleAddNewFolderCntr: function(event) {
            myvmware.common.putplaceHolder(ml.$modalRef.find("#mlNewFolderName"));
            var selCntrl = $(this).attr("id");
            if ((selCntrl == "addNewFolderLink") && (!$(this).hasClass("active"))) {
                event.preventDefault();
            } else {
                if (selCntrl != "addNewFolderLink") {
                    if (selCntrl == "mlAddFolderCancel") riaLinkmy(ml.omniture[ml.mlType].cancelF);
                    if ($("#addNewfolderDiv").is(':visible'))
                        ml.$modalRef.find("#addNewfolderDiv").toggle();
                } else {
                    ml.$modalRef.find("#addNewfolderDiv").toggle();
                }
                var $targetFolderPane = ml.$modalRef.find("#targetfolderPane");
                if (!$("#addNewfolderDiv").is(':visible')) {
                    ml.$modalRef.find("#targetfolderPane").removeClass("minimized");
                } else {
                    ml.$modalRef.find("#targetfolderPane").addClass("minimized");
                }
            }
        },
        doAddNewFolder: function(event) {
            riaLinkmy(ml.omniture[ml.mlType].addF);
            var _selectedFolderID = ml.moveToFolderID,
                $newFolderName = ml.$modalRef.find("#mlNewFolderName"),
                _newFolderName = ($newFolderName.val() !== $newFolderName.attr('placeholder')) ? $newFolderName.val() : '';
            if (_newFolderName.length > 0) {
                //_addFolderUrl = mlRS.move.url.addFolder + '&selectedFolderId=' + _selectedFolderID + '&newFolderName=' + _newFolderName;
                var _addFolderUrl = $("#createFolderResourceUrl").val();
                var _postData = new Object();
                _postData['selectedFolderId'] = _selectedFolderID;
                _postData['newFolderName'] = _newFolderName;
                $('#mlAddFolder').attr('disabled', true).addClass('waitcursor');
                vmf.ajax.post(_addFolderUrl, _postData, ml.handlers.onSuccessAddFolder, ml.handlers.onFailureAddFolder);
            } else {
                error_msg = "Enter folder name."; // NOTE: pls update this static text to rs variable
                $newFolderName.siblings("div.error_msg").html(error_msg);
            }
        },
        onSuccessAddFolder: function(data) {
            var $newFolderName = ml.$modalRef.find("#mlNewFolderName"),
                _errorMessage = vmf.json.txtToObj(data);
            if (_errorMessage != null && _errorMessage.error) {
                $('#mlAddFolder').attr('disabled', false).removeClass('waitcursor');
                $newFolderName.siblings("div.error_msg").html(_errorMessage.message);
                return;
            } else {
                ml.$modalRef.find("#mlNewFolderName").val('');
                ml.$modalRef.find("#addNewfolderDiv .error_msg").html('');

                ml.$modalRef.find("#mlAddFolderCancel").trigger('click');
                $('#mlAddFolder').attr('disabled', false).removeClass('waitcursor');
                $("#addNewFolderLink").removeClass("active");
                ml.common.renderMoveToContainer();
            }
        },
        onFailureAddFolder: function(data) {
            var $newFolderName = ml.$modalRef.find("#mlNewFolderName");
            $newFolderName.siblings("div.error_msg").html(data.message);
            $('#mlAddFolder').attr('disabled', false).removeClass('waitcursor');
        },
        handleGetMinPermissions: function(folderId) {

            var _folderHT = vmf.foldertreeAnother.getFolderHashtable();
            var _folderTreeObj = vmf.foldertreeAnother.getFolderJSON();
            var _folderId = _folderHT.get(folderId).folderId;
            var _fullFolderPath = _folderHT.get(folderId).fullFolderPath;
            var _folderVariable = _folderId + "," + _fullFolderPath;
            var _folderAccess = _folderHT.get(folderId).folderAccess;
            var _selectedFolderName = _folderHT.get(folderId).folderName;

            if (_folderAccess != 'MANAGE') {
                //Keep the add new folder link disabled
                ml.$modalRef.find("#addNewFolderLink").removeClass("active");
                //close add new folder container if it's open
                ml.$modalRef.find("#mlAddFolderCancel").trigger('click');
            } else {
                ml.$modalRef.find("#addNewFolderLink").addClass("active");
            }

            if (ml.moveLicensesPreviewData.folder.length > 1) {
                ml.$modalRef.find('#fpDisclaimer').removeAttr('checked', 'checked').removeAttr('disabled', 'disabled');
                ml.$modalRef.find("#sameFolderMsg").hide();
            } else {
                var oldFolderName = ml.moveLicensesPreviewData.folder[0].name;
                var lenFval = oldFolderName.length;
                if (_fullFolderPath == oldFolderName || _fullFolderPath == oldFolderName.substring(2, lenFval)) {
                    //Temporary , need to add a class
                    ml.$modalRef.find("#sameFolderMsg").css('color', 'red');
                    ml.$modalRef.find("#sameFolderMsg").show();
                    ml.$modalRef.find('#fpDisclaimer').removeAttr('checked', 'checked').attr('disabled', 'disabled');
                } else {
                    ml.$modalRef.find("#sameFolderMsg").hide();
                    ml.$modalRef.find('#fpDisclaimer').removeAttr('checked', 'checked').removeAttr('disabled', 'disabled');
                }
            }
        },
        newFolderNameChange: function() {
            var $this = $(this);
            if ($.trim($this.val()) !== '' && $this.val() !== $this.attr('placeholder')) {
                ml.$modalRef.find('#mlAddFolder').attr('disabled', false).removeClass('disabled');
            } else {
                ml.$modalRef.find('#mlAddFolder').attr('disabled', true).addClass('disabled');
            }
        },
        successUpgradeOptions: function(data) {

            var upgradeOptions = vmf.json.txtToObj(data);
            var len;

            if (upgradeOptions.options == undefined) {
                //TODO :  Handle wrong data
                //BUG-00069479
                if(upgradeOptions.error){
                    if(ml.$modalRef == null){
                        ml.showUpgradeLicenseOptionsModal(mlRS[ml.mlType].txt.headingOptions);
                    }
                    ml.common.renderUglError(upgradeOptions.message);
                }

            } else {
                len = upgradeOptions.options.length;
                if (ml.isCheckUpgrade) {
                    //Show upgrade options in modal window 
                    ml.common.renderUpgradeOptions(upgradeOptions);
                } else {                	
                    if (len > 1) {
                        //Show upgrade options in modal window as there is more than one option 
                        ml.showUpgradeLicenseOptionsModal(mlRS[ml.mlType].txt.headingOptions);
                        ml.common.renderUpgradeOptions(upgradeOptions);
                    } else {
                        //Get license keys & quantities, in this case there is only one option 
                        ml.selectedOption = 1;
                        ml.showUpgradeLicenseOptionsModal(mlRS[ml.mlType].txt.headingLicKeysQtys);
                        ml.ajax.getSelectedUpgradeLicenses(true);
                    }
                }
            }

        },
        failureUpgradeOptions: function() {
            //TODO: Handle the failure 

        },
        handleUpgradeOptionSelect: function() {

            var selectedOptionArr;

            ml.isOptionSelected = true;
            selectedOptionArr = $(this).attr("id").split("_");
            ml.selectedOption = selectedOptionArr[1];
            ml.selectedOptionObj = $(this).data("selectedOption");

            if (ml.isCheckUpgrade) {

                //Show processing for licenses data table 
                $("#viewLicense .dataTables_scroll, #keyManagement .filter-section-header,#upgradeOptionsContainer").hide();
                var table = $('#licenseDetail').dataTable();
                var oSettings = table.fnSettings();
                table.oApi._fnProcessingDisplay(oSettings, true);

                ml.ajax.getLicensesForSelUpgradeOption();
                vmf.modal.hide();
                $("#btn_cancel_ugl").removeAttr("disabled").removeClass('disabled').show();
                $("#btn_cancel_ugl").unbind('click').bind('click', ml.handlers.handleCancelForUGL);

            } else {
                ml.$modalRef.find("#mlNotesLabelsSel,#mlAttention,#uglOptionsContainer,#uglQuantitiesContainer,#uglTblcontainer, div.exportLicenseKey, #uglErrorContainer, #okButton").hide();
                ml.$modalRef.find('#uglContainer .loading').show();
                ml.ajax.getSelectedUpgradeLicenses(false);
            }

        },
        handleCancelForUGL: function() {

            ml.refreshLicensesPane = true;
            ml.refreshProductsPane = true;
            ml.isOptionSelected = false;
            ml.ajax.clearSessionForUpgrade();
            ml.handlers.handleClose();

        },
        handleContinueForUGL: function() {

            ml.$modalRef.find("#continueButton").hide();
            ml.$modalRef.find("#continueButton").unbind('click').bind('click', ml.handlers.handleContinue);

            ml.$modalRef.find("#uglOptionsContainer,#uglQuantitiesContainer,#uglTblcontainer,#editQtyButton,#saveQtyButton, div.exportLicenseKey, #uglErrorContainer, #okButton").hide();
            ml.$modalRef.find("#mlNotesLabelsSel,#mlAttention").show();

            if (ml.isManyFromProducts) ml.$modalRef.find("#copyExisting").parent().hide();

            ml.$modalRef.find("#backButton").removeAttr('disabled').removeClass('disabled').show();
            ml.$modalRef.find("#backButton").unbind('click').bind('click', ml.handlers.handleBackForUGL);

            ml.$modalRef.find("#confirmButton").attr("disabled", "disabled").addClass('disabled').show();
            ml.$modalRef.find('#innerCon').removeClass('innerConHt');

        },
        handleBackForUGL: function() {

            ml.$modalRef.find("#mlNotesLabelsSel input[type='radio']").eq(0).attr("checked", "checked");
            ml.$modalRef.find("#fpDisclaimer").removeAttr("checked");

            if (ml.isManyFromProducts) ml.$modalRef.find("#copyExisting").parent().hide();

            ml.$modalRef.find("#uglQuantitiesContainer,#editQtyButton,#continueButton, div.exportLicenseKey").show();
            ml.$modalRef.find("#continueButton").removeAttr('disabled').removeClass('disabled');
            ml.$modalRef.find("#mlNotesLabelsSel,#mlAttention,#backButton,#confirmButton, #uglErrorContainer, #okButton").hide();
            ml.$modalRef.find("#continueButton").unbind('click').bind('click', ml.handlers.handleContinueForUGL);

             if(ml.$modalRef.find('#innerCon').hasClass('qtyTblVisible')){
             	ml.$modalRef.find('#innerCon').addClass('innerConHt');
             	ml.$modalRef.find('#uglTblcontainer,#saveQtyButton').show();             	
             	ml.$modalRef.find('#editQtyButton').hide();
             }

            ml.common.updateHeader(mlRS[ml.mlType].txt.headingLicKeysQtys, false);

        },
        successUpgradeLicenseQuantities: function(data, isSave) {

            var upgradeToString,
                upgradeFromString,
                upgradeToHeight,
                upgradeString,
                i, j;

            if (typeof data == "string") {
                ml.licenseQuantitiesData = vmf.json.txtToObj(data);
            } else {
                ml.licenseQuantitiesData = data;
            }

           if (ml.licenseQuantitiesData.from == undefined) {
                if(ml.licenseQuantitiesData.error){
                    ml.common.renderUglError(ml.licenseQuantitiesData.message);
                }

            }else{
                ml.isManyFromProducts = ml.licenseQuantitiesData.from.length > 1 ? true : false;
                //Update header             
                ml.common.updateHeader(mlRS[ml.mlType].txt.headingLicKeysQtys, false);

                ml.$modalRef.find('#uglContainer .loading, #uglErrorContainer, #okButton').hide();
                ml.$modalRef.find("#uglQuantitiesContainer, div.exportLicenseKey").show();

                //Handle edit and save buttons 
                ml.$modalRef.find("#editQtyButton").show();
                ml.$modalRef.find("#saveQtyButton").hide();

                ml.$modalRef.find("#editQtyButton").unbind('click').bind('click', function() {
                    $(this).hide();
                    ml.$modalRef.find('#innerCon').addClass('innerConHt qtyTblVisible');
                    ml.$modalRef.find("#uglTblcontainer,#saveQtyButton").show();
                    ml.$modalRef.find("#saveQtyButton").attr('disabled', 'disabled').addClass('disabled');
                    //Register handler for saving the quantities 
                    ml.$modalRef.find("#saveQtyButton").unbind('click').bind('click', ml.handlers.saveUpgradeQty);

                });

                ml.$modalRef.find("#continueButton").removeAttr('disabled').removeClass('disabled').show();
                ml.$modalRef.find("#continueButton").unbind('click').bind('click', ml.handlers.handleContinueForUGL);

                //Prepare From and To HTML Strings 
                upgradeToString = ml.common.prepareUpgradeTo(ml.selectedOption, ml.licenseQuantitiesData.to, false, true, ml.licenseQuantitiesData.from);
                upgradeFromString = ml.common.prepareUpgradeFrom(ml.selectedOption, false, ml.licenseQuantitiesData.from, true);

                //Append the content 
                upgradeString = "<tr>" + upgradeFromString + upgradeToString + "</tr>";
                $("#uplQuantitiesContent table").empty().append(upgradeString);

                if ($("#tbl_upgradeLicenseQuantities").hasClass('isinitialized')) {
                    if ($("#tbl_upgradeLicenseQuantities").children().length > 0) {
                        //Table is available to so, destory it 
                        var ugltTable = $("#tbl_upgradeLicenseQuantities").dataTable();
                        ugltTable.fnDestroy();
                        $("#tbl_upgradeLicenseQuantities").empty();
                    }
                }

                var headerPadding = ml.$modalRef.find("#uglQuantitiesContainer .uglToHeader").width() - ml.$modalRef.find("#uglQuantitiesContainer .uplToProduct").width();
                ml.$modalRef.find("#uglQuantitiesContainer .uglToHeader").css("padding-left", headerPadding);
                ml.common.createUglQtyTable(ml.licenseQuantitiesData.from);

                if (isSave) {
                    ml.$modalRef.find("#uglTblcontainer").show();
                    ml.$modalRef.find("#editQtyButton").hide();
                    ml.$modalRef.find("#saveQtyButton").attr("disabled", "disabled").addClass("disabled").show();
                } else {
                    ml.$modalRef.find('#innerCon').removeClass('innerConHt');
                }
            } 

            

        },
        handleDetailsExpandCollapse: function() {

            var nTr = this.parentNode.parentNode.parentNode;
            $(this).parents("#tbl_upgradeLicenseQuantities tr").toggleClass("openSelectRowBackground");
            //this.src.match('details_close')
            if ($(this).hasClass("open")) {
                /* This row is already open - close it */
                $(this).removeClass("open");
                $('#tbl_upgradeLicenseQuantities').dataTable().fnClose(nTr);
            } else {
                /* Open this row */
                $(this).addClass("open");
                $('#tbl_upgradeLicenseQuantities').dataTable().fnOpen(nTr, ml.common.fnFormatDetails($('#tbl_upgradeLicenseQuantities').dataTable(), nTr), 'details');
                $("#tbl_upgradeLicenseQuantities td.details").attr("colspan", "4");

                var rowIndex = $('#tbl_upgradeLicenseQuantities').dataTable().fnGetPosition(nTr);
                var subTableId = "tbl_upgradeLicenseQuantities" + rowIndex;
                var ex = document.getElementById(subTableId);
                if (!$("#" + subTableId).hasClass('initialized')) {

                    $("#" + subTableId).not('.initialized').addClass('initialized');

                    vmf.datatable.build($("#" + subTableId), {
                        "bPaginate": false,
                        "bLengthChange": false,
                        "bSort": false,
                        "bInfo": false,
                        "bFilter": false,
                        "bAutoWidth": false,
                        "aaData": $('#tbl_upgradeLicenseQuantities').dataTable().fnGetData(nTr).licenseKeys,
                        "aoColumns": [{
                            "sWidth": "250px",
                            "sTitle": "<span>" + mlRS.common.dataTableHeadingCombine + "</span>",
                            "bSortable": false
                        }, {
                            "sWidth": "100px",
                            "sTitle": "<span>" + mlRS.common.totalQty + "</span>",
                            "bSortable": false

                        }, {
                            "sWidth": "150px",
                            "sTitle": "<span>" + mlRS.upgradeLicense.txt.qtyToUpgrade + "</span>",
                            "bSortable": false
                        }, {
                            "sWidth": "150px",
                            "sTitle": "<span>" + mlRS.common.folderName + "</span>",
                            "bSortable": false
                        }],
                        "aoColumnDefs": [{
                                "mDataProp": "licenseKey",
                                "aTargets": [0]
                            }, {
                                "mDataProp": function(data, type, full) {

                                    return data.totalQty + "&nbsp;" + data.uom;
                                },
                                "aTargets": [1]
                            }, {
                                "mDataProp": function(data, type, full) {

                                    if ($('#tbl_upgradeLicenseQuantities').dataTable().fnGetData(nTr).anchor == "FALSE") {
                                        return data.userUpgradeQty + "&nbsp;" + data.uom;
                                    } else {
                                        return '<input type="text" class="totalQty"  value="' + data.userUpgradeQty + '"></input> / ' + data.qtyToUpgradeAvail + "&nbsp;" + data.uom + "<br class='clear'/><div class='error_msg'></div>";
                                    }
                                },
                                "aTargets": [2]
                            }, {
                                "mDataProp": function(data, type, full) {
                                    if (data.folder == undefined) {
                                        return "No Folder Path";
                                    } else {
                                        return '<span class="textGrey ellipsisTxt folderPathUGL">\\\\' + data.folder + '</span>';
                                    }
                                },
                                "aTargets": [3]
                            }

                        ],
                        "fnRowCallback": function(nRow, aData, iDisplayIndex) {
                            $(nRow).find("td:eq(0)").prepend("<span class='openclose'></span>").end().data("id", aData);
                            $(nRow).find("input.totalQty").data({
                                "qtyToUpgradeAvail": aData.qtyToUpgradeAvail,
                                "licenseKey": aData.licenseKey,
                                "keyId": aData.keyId,
                                "userUpgradeQty": aData.userUpgradeQty
                            });
							ml.$modalRef.find('#tbl_upgradeLicenseQuantities').find('span.ellipsisTxt.folderPathUGL').die('click').live("click", function () {
								$(this).addClass('normalWhiteSpace').css({'width' : '145px'}); 
							});
                            return nRow;
                        },
                        "fnInitComplete": function() {
                            $tbl = this;
                            ml.$modalRef.find("#" + subTableId).find('span.openclose').die('click').live("click", function() {
                                ml.handlers.expandQtyRowDetails($(this), $tbl);
                            });
                            ml.events.registerQuantityChageHandler();
                        }
                    });
                }
            }

            return false;
        },
        expandQtyRowDetails: function(o, t) {
            var nTr1 = o[0].parentNode.parentNode;
            if (o.hasClass('minus')) {
                o.removeClass('minus');
                $(nTr1).removeClass("expanded noborder").next("tr").hide();
            } else {
                o.addClass('minus');
                $(nTr1).addClass("expanded noborder");
                if (!nTr1.haveData) {
                    t.fnOpen(nTr1, '', '');
                    ml.handlers.getQtyRowDetails($(nTr1), nTr1.idx);
                    nTr1.haveData = true;
                    $(nTr1).next("tr").addClass('more-detail');
                } else {
                    $(nTr1).next("tr").show();
                }
            }
        },
        getQtyRowDetails: function(rowObj, idx) {
            var sOut = [],
                cdata = rowObj.data("id"),
                cLHtml = [];
            sOut.push("<div class='note-wrapper clearfix'><div class='noteH'>"+ mlRS[ml.mlType].txt.dNote +"</div><span class='note ellipsisTxt'>" + cdata.notes + "</span></div>");
            $.each(cdata.customlabels, function(cL, cLv) {
                if (cLv != "") {
                    cLHtml.push("<div class='lCont'><div class='sLabeln'>" + cL + ": </div><div class='sLabelv'>" + cLv + "</div></div>");
                }
            });
            sOut.push("<div class='note-wrapper clearfix clDiv'>" + cLHtml.join('') + "</div>")
            rowObj.next("tr").addClass('more-detail').find("td").html(sOut.join(''));
        },
        failureUpgradeLicenseQuantities: function() {
            //TODO : Handle failure 
        },
        successLicensesForUpgradeOption: function(data) {

            var upgradeToString,
                upgradeFromString,
                upgradeToHeight,
                licenseData,
                upgradeString;
            //Display the containers for license details data table 
            $("#productMessage, #keyManagement").hide();
            $("#viewLicense .dataTables_scroll, #currentProductName, #keyManagement .filter-section-header").show();
            //Display license keys for selected option  
            licenseData = vmf.json.txtToObj(data).aaData;
            ice.managelicense.RefreshTable('licenseDetail', licenseData);
            //Display selected option details 
            $("#upgradeOptionsContainer,a.togUpgradeOptions").hide();
            $("#selectedOptionsContainer").show();
            upgradeToString = ml.common.prepareUpgradeTo(ml.selectedOptionObj.option, ml.selectedOptionObj.to, false, false, null);
            upgradeFromString = ml.common.prepareUpgradeFrom(ml.selectedOptionObj.option, false, ml.selectedOptionObj.from, false);
            upgradeString = "<tr>" + upgradeFromString + upgradeToString + "</tr>";
            $("#selUplOptionsContent table").empty().append(upgradeString);
            var headerWidth = ($("#selUplOptionsContent td.uglFromProducts").width() * 100) / $("#selUplOptionsContent").width();
            $("#selectedOptionsDiv td.uglFromHeader").width(headerWidth + "%");
            ice.managelicense.adjustHt();
        },
        successLicensesForUpgradeOption_old: function(data) {

            var upgradeToString,
                upgradeFromString,
                upgradeToHeight,
                licenseData;
            //Display the containers for license details data table 
            $("#productMessage, #keyManagement").hide();
            $("#viewLicense .dataTables_scroll, #currentProductName, #keyManagement .filter-section-header").show();
            //Display license keys for selected option  
            licenseData = vmf.json.txtToObj(data).aaData;
            ice.managelicense.RefreshTable('licenseDetail', licenseData);
            //Display selected option details 
            $("#upgradeOptionsContainer").hide();
            $("a.togUpgradeOptions").hide();
            $("#selectedOptionsContainer").show();
            upgradeToString = ml.common.prepareUpgradeTo(ml.selectedOptionObj.option, ml.selectedOptionObj.to, false, false, null);
            upgradeFromString = ml.common.prepareUpgradeFrom(ml.selectedOptionObj.option, false, ml.selectedOptionObj.from, false);
            $("#selectedOptionsDiv .uglToProducts").empty().append(upgradeToString);
            upgradeToHeight = $("#selectedOptionsDiv .uplToProduct").eq(0).outerHeight();
            $("#selectedOptionsDiv .uglFromProducts").empty().append(upgradeFromString);
            $("#selectedOptionsDiv .uglFromProduct").eq(0).css("height", upgradeToHeight + 20);
            var headerPadding = $("#selectedOptionsDiv .uglToHeader").width() - $("#selectedOptionsDiv .uplToProduct").width();
            $("#selectedOptionsDiv .uglToHeader").css("padding-left", headerPadding);
            ice.managelicense.adjustHt();
        },
        failureLicensesForUpgradeOption: function() {

            //TODO : Handle failure 
        },
        handleQuantityChange: function($inputElement) {

            var currentVal, qtyToUpgradeAvail,userUpgradeQty;

            if (!ml.common.validateUpgradeDT()) {

                ml.qtyDirtyFlag = false;
                ml.$modalRef.find("#tbl_upgradeLicenseQuantities input.totalQty").each(function() {

                    currentVal = parseInt($(this).val());
                    qtyToUpgradeAvail = parseInt($(this).data().qtyToUpgradeAvail);
                    userUpgradeQty = parseInt($(this).data().userUpgradeQty);
                    //Fix for defect BUG-00069707                                      
                    if (!(currentVal == userUpgradeQty) && (currentVal <=qtyToUpgradeAvail) ) {
                        ml.qtyDirtyFlag = true;
                    }                    

                });

                if (ml.qtyDirtyFlag) {
                    ml.$modalRef.find("#saveQtyButton").removeAttr('disabled').removeClass('disabled');
                    ml.$modalRef.find("#continueButton").attr('disabled', 'disabled').addClass('disabled');
                } else {
                    ml.$modalRef.find("#saveQtyButton").attr('disabled', 'disabled').addClass('disabled');
                    ml.$modalRef.find("#continueButton").removeAttr('disabled').removeClass('disabled');
                }
            }else{
					ml.$modalRef.find("#saveQtyButton").removeAttr('disabled').removeClass('disabled');
                    ml.$modalRef.find("#continueButton").attr('disabled', 'disabled').addClass('disabled');
			}
        },
        saveUpgradeQty: function() {
			
			if (ml.common.validateUpgradeDT()) {
				return true;
			}

            ml.$modalRef.find("#mlNotesLabelsSel,#mlAttention,#uglOptionsContainer,#uglQuantitiesContainer,#uglTblcontainer, div.exportLicenseKey, #uglErrorContainer, #okButton").hide();
            ml.$modalRef.find('#uglContainer .loading').show();
            if (!ml.isManyFromProducts) {

                var currentVal, licenseKey, i, j, len1, len2, fromObj, licenseObj;
                var _licenseKeyQtyMap = {};
                var qtyInputs = $("#tbl_upgradeLicenseQuantities input.totalQty");
                if (qtyInputs.length > 0) {

                    qtyInputs.each(function() {
                        licenseKey = $(this).data().licenseKey;
                        currentVal = parseInt($(this).val());
                        _licenseKeyQtyMap[licenseKey] = currentVal;
                    });

                    len1 = ml.licenseQuantitiesData.from.length;
                    for (i = 0; i < len1; i++) {
                        fromObj = ml.licenseQuantitiesData.from[i];
                        if (fromObj.anchor == "TRUE") {
                            len2 = fromObj.licenseKeys.length;
                            for (j = 0; j < len2; j++) {
                                licenseObj = fromObj.licenseKeys[j];
                                licenseObj.userUpgradeQty = _licenseKeyQtyMap[licenseObj.licenseKey];
                            }

                        }
                    }

                }

                ml.handlers.successUpgradeLicenseQuantities(ml.licenseQuantitiesData, true);

            } else {
                ml.ajax.saveSelectedUpgradeLicenses();
            }
        }
    },
    ajax: {
        /*--------------------------------------------------*/
        // All the methods handling server requests ( AJAX ) go here.
        /*--------------------------------------------------*/
        getCustomLabels: function() {
            vmf.ajax.post(mlRS.combine.url.getCustomLabels, {}, ml.handlers.successCustomLabels);
        },
        getDowngradeKeys: function() {
            var _postData = "selectedLicenseKeys=" + ml.selectedLicenses.join(',');
            vmf.ajax.post(mlRS.downgradeLicense.url.getDowngradeKeys, _postData, ml.renderDowngradeKeys);
        },
        getUpgradeKeys: function() {
            var _postData = "selectedLicenseKeys=" + ml.selectedLicenses.join(',');
            vmf.ajax.post(mlRS.upgradeLicense.url.getUpgradeKeys, _postData, ml.renderUpgradeKeys);
        },
        getMoveLicensesPreview: function() {
            var _postData = {};
            if (ml.selectedLicenses.length > 0) {
                _postData.selectedLicenseKeys = ml.selectedLicenses.join(',');
                vmf.ajax.post(mlRS.move.url.preview, _postData, ml.handlers.successMoveLicensesPreview, ml.handlers.failureMoveLicensesPreview);
            }
        },
        postMoveLicenses: function() {
            var _postData = {};
        },
        getMinPermissionData: function(selectedFolder, cbState) {

            var _fPerPostData = new Object();
            _fPerPostData['selectedFolderId'] = selectedFolder;
            $.ajax({
                type: 'POST',
                url: mlRS.move.url.folderPermission,
                async: true,
                dataType: "json",
                data: _fPerPostData,
                success: function(folderPermission) {
                    //Store permission in folder tree HT
                    vmf.foldertreeAnother.storePermission(selectedFolder, folderPermission);
                    ml.handlers.handleGetMinPermissions(selectedFolder);
                },
                error: function(response, errorDesc, errorThrown) {
					//console.log("In error: " + errorThrown);
                },
                beforeSend: function() {
                    //TODO
                },
                complete: function(jqXHR, settings) {
                    //TODO
                }
            });
        },
        getUpgradeOptions: function() {
            var _postData = {};
            _postData.licenseKeys = ml.selectedLicenses.join(',');
            _postData.isCheckUpgrade = ml.isCheckUpgrade;
            vmf.ajax.post(mlRS.upgradeLicense.url.upgradeOptions, _postData, ml.handlers.successUpgradeOptions, ml.handlers.failureUpgradeOptions);
        },
        getLicensesForSelUpgradeOption: function(option) {

            var _postData = {};
            _postData.optionSelected = ml.selectedOption;
            _postData.isCheckUpgrade = ml.isCheckUpgrade;
            vmf.ajax.post(mlRS.upgradeLicense.url.previewSelectedOption, _postData, ml.handlers.successLicensesForUpgradeOption, ml.handlers.failureLicensesForUpgradeOption);
        },
        getSelectedUpgradeLicenses: function(fromSession) {

            var _postData = {};
            _postData.licenseKeys = ml.selectedLicenses.join(',');
            _postData.isCheckUpgrade = ml.isCheckUpgrade;
            _postData.optionSelected = ml.selectedOption;
            if (fromSession) {
                vmf.ajax.post(mlRS.upgradeLicense.url.previewSelectedUpgradeLicensesFromSessionUrl, _postData,
                    function(data) {

                        ml.handlers.successUpgradeLicenseQuantities(data, false);

                    }, ml.handlers.failureUpgradeLicenseQuantities);
            } else {
                vmf.ajax.post(mlRS.upgradeLicense.url.previewSelectedUpgradeLicenses, _postData,
                    function(data) {

                        ml.handlers.successUpgradeLicenseQuantities(data, false);

                    }, ml.handlers.failureUpgradeLicenseQuantities);
            }

        },
        clearSessionForUpgrade: function() {
            var _postData = {};
            vmf.ajax.post(mlRS.upgradeLicense.url.clearSessionOnCancelOrConfirmUrl, _postData);
        },
        saveSelectedUpgradeLicenses: function() {
                        
            var _postData = {};      

            _postData.licForUpgrade = ml.common.getUpgradeLicenseQtyString(false);

            vmf.ajax.post(mlRS.upgradeLicense.url.previewEditUpgradeQuantity, _postData,
                function(data) {
                    ml.handlers.successUpgradeLicenseQuantities(data, true);
                },
            ml.handlers.failureUpgradeLicenseQuantities);
        }
    },
    startManagingLicenses: function(mlType, selectedLicenses, isCheckUpgrade) {

        //Note: temperory cleanup.. should be handled in onclose and handdlecancel
        ml.handlers.handlePopupClose(mlType, isCheckUpgrade);

        //Save manage license type
        ml.mlType = mlType;

        riaLinkmy(ml.omniture[ml.mlType].start);

        ml.isCheckUpgrade = ml.isCheckUpgrade ? ml.isCheckUpgrade : isCheckUpgrade;
        //Save selected licenes
        ml.selectedLicenses = selectedLicenses;

        if ((ml.mlType !== "move") && (ml.mlType !== "upgradeLicense")) {
            ml.showManageLicensesModal();
        }
        //Invoke the relevant method to handle the display of modal
        ml.mlMap[mlType].initFun.call();
    },
    showManageLicensesModal: function() {

        vmf.modal.show("mlMainContainer", {
            modalWidth: '900px',
            maximize: true
        });

        //Get the reference object for modal window
        ml.$modalRef = $("#simplemodal-container #mlMainContainer");
        // call the common methods to update the notesAndLabels, attention, action buttons (text) containers
        ml.common.updateActionButtonsText();

        //if (ml.mlType === "upgradeLicense") {
        //   ml.$modalRef.find("#mlNotesLabelsSel").css('visibility', 'hidden');
        //}

        ml.common.updateNotesAndLabels();
        //|| ml.mlType === "upgradeLicense"
        if (ml.mlType === "downgradeLicense") {
            ml.$modalRef.find('#mlAttention .warning_big').css('visibility', 'hidden');
            // show disclaimer text (explicitly showing for downgrade/upgrade)
            ml.$modalRef.find('#disclaimerContainer').html('<strong>' + mlRS[ml.mlType].txt.disclaimerText + '</strong>');
        } else {
            ml.common.updateAttentionText();
        }
        ml.common.updateGetHelp();
        ml.events.addActionButtonHandlers();
    },
    showCombineLicensesModal: function() {
        //Handle display of relevant containers
        ml.common.navigateTo(ml.viewStates.selection);
        // Attach notes&lables radio buttons' change event AND disclaimer checkbox change events
        ml.events.nlRadioChange();
        ml.events.disclaimerCheckboxChange();

        // hide un-wanted elements - specific to combine linceses flow ( move to common method )
        ml.$modalRef.find('#copyExisting').closest('div.nlOptionContainer').hide();

        ml.$modalRef.find('#clProductName').html(mlRS.common.productName);

        /* code to render datatable */
        ml.loadCLDataTable();
    },
    showDivideLicensesModal: function() {
        //Handle display of relevant containers
        ml.common.navigateTo(ml.viewStates.selection);
        // Attach notes&lables radio buttons' change event AND disclaimer checkbox change events
        ml.events.nlRadioChange();
        ml.events.disclaimerCheckboxChange();
        ml.loadDivideData();

    },
    handleMoveLicenses: function() {
        //Identify total number of licenses selected
        var len = ml.selectedLicenses.length;
        if (len > 200) {
            //show bulk move alert
            ml.showBulkMoveLicensesModal();

        } else {
            //URL to use for post in case of normal move
            ml.mlMap.move.postUrl = mlRS.move.url.confirm;
            ml.showMoveLicensesModal();
        }
    },
    showBulkMoveLicensesModal: function() {
        vmf.modal.show("mlBulkMoveCntr", {
            minHeight: '300px',
            modalWidth: '600px',
            maximize: false,
            escClose: false
        });
        //Get the reference object for modal window
        ml.$modalRef = $("#simplemodal-container #mlBulkMoveCntr");
        ml.common.updateBulkMoveModalText();
        ml.events.regBulkMoveModalActionHandlers();
    },
    showMoveLicensesModal: function() {

        vmf.modal.show("mlMainContainer", {
            minHeight: '500px',
            modalWidth: '900px',
            maximize: true,
            escClose: false
            /*, onClose: function(){
				ml.handlers.handlePopupClose();
			}*/
        });
        //Get the reference object for modal window
        ml.$modalRef = $("#simplemodal-container #mlMainContainer");

        //Specific to this scenario as enabling depends on selecting a folder 
        ml.$modalRef.find('#fpDisclaimer').removeAttr('checked', 'checked').attr('disabled', 'disabled')
        // call the common methods to update the notesAndLabels, attention, action buttons (text) containers
        ml.events.disclaimerCheckboxChange();
        ml.common.updateGetHelp();
        ml.events.addActionButtonHandlers();
        ml.common.updateActionButtonsText();
        ml.common.updateNotesAndLabels();
        ml.common.updateAttentionText();

        ml.events.regNewFolderActionHandlers();

        //show move selection
        ml.common.navigateTo(ml.viewStates.selection);
        ml.ajax.getMoveLicensesPreview();
        ml.common.renderMoveToContainer();

    },
    showUpgradeLicensesModal: function() {
        //Handle display of relevant containers
        ml.common.navigateTo(ml.viewStates.selection);

        // Attach notes&lables radio buttons' change event AND disclaimer checkbox change events
        ml.events.nlRadioChange();
        ml.events.disclaimerCheckboxChange();

        ml.ajax.getUpgradeKeys();
    },
    handleUpgradeLicenses: function() {
        	//1. 'Check Upgrade Options' button clicked 
        if (ml.isCheckUpgrade && !ml.isOptionSelected) {
            ml.showUpgradeLicenseOptionsModal(mlRS[ml.mlType].txt.headingOptions);
            //Retrieve the upgrade options 
            ml.ajax.getUpgradeOptions();
        } else if (ml.isCheckUpgrade && ml.isOptionSelected) {
            //2. 'Check Upgrade Options' clicked > Option selected > Continue button clickec 
            //Allow only 50 licenses to be upgraded
            if (ml.selectedLicenses.length > ml.maxAllowedLicenseKeys) {
                ml.selectedLicenses = ml.selectedLicenses.slice(0, ml.maxAllowedLicenseKeys);
                //NOTE: Do we ned to show any alert to the user here ? 
            }
            ml.showUpgradeLicenseOptionsModal(mlRS[ml.mlType].txt.headingLicKeysQtys);
            //Get license keys & quantities for selected option 
            ml.ajax.getSelectedUpgradeLicenses(false);
        } else if (!ml.isCheckUpgrade) {
        	ml.common.cleanUpgradeData();
            //3.User has clicked on continue button directly 
            if (ml.selectedLicenses.length > ml.maxAllowedLicenseKeys) {
                ml.selectedLicenses = selectedLicenses.slice(0, ml.maxAllowedLicenseKeys);
                //NOTE: Do we ned to show any alert to the user here ? 
            }
            //Retrieve the upgrade options 
            ml.ajax.getUpgradeOptions();
        }
    },
    showUpgradeLicenseOptionsModal: function(heading) {

        ml.showManageLicensesModal();
        ml.common.navigateTo(ml.viewStates.selection);
        ml.common.updateHeader(heading, false);
        ml.events.nlRadioChange();
        ml.events.disclaimerCheckboxChange();
        ml.$modalRef.find("#mlNotesLabelsSel,#mlAttention,#uglOptionsContainer,#uglQuantitiesContainer,#uglTblcontainer, div.exportLicenseKey, #uglErrorContainer, #okButton").hide();
        ml.$modalRef.find('#uglContainer .loading').show();
    },
    showDowngradeLicensesModal: function() {
        //Handle display of relevant containers
        ml.common.navigateTo(ml.viewStates.selection);

        // Attach notes&lables radio buttons' change event AND disclaimer checkbox change events
        ml.events.nlRadioChange();
        ml.events.disclaimerCheckboxChange();

        ml.ajax.getDowngradeKeys();
    },
    postDataCombine: function() {
        var postData = {};
        postData.selectedLicenseKeys = ml.selectedLicenses.join(',');
        return postData;
    },
    postDataDivide: function() {
        var postData = {},
            _selectedLicense = "",
            $activeRow,
            newList = '';
        $activeRow = $('#licenseDetail tr:.active');
        if ($activeRow.length) {
            _selectedLicense = $activeRow.find("input:radio[name=opensel12]").val();
        }
        postData.selectedLicenseKeys = _selectedLicense;
        ml.$modalRef.find('#newKeys li input').each(function() {
            newList += $(this).val() + ',';
        });
        postData.newLicenseKeysQuantityList = newList;
        return postData;
    },
    postDataUpgrade: function() {
        var postData = {},
            licForUpgradeArr = [];
        /*$("#tbl_upgradelic input:text").each(function() {
            var qtylen = $(this).attr('id').length,
                maxId = $(this).attr('id').substring(4, qtylen);

            licForUpgradeArr.push($('#key_' + maxId).html() + ':' + $(this).val());
        });*/
        var arrayOfQtyChange = new Array();
        var licensekey, currentVal, i, j, len1, len2, fromObj, licenseObj;

        if ($("#tbl_upgradeLicenseQuantities input.totalQty").length > 0) {

            $("#tbl_upgradeLicenseQuantities input.totalQty").each(function() {
                licenseKey = $(this).data().licenseKey;
                currentVal = parseInt($(this).val());
                arrayOfQtyChange.push(licenseKey + ":" + currentVal);
            });

        } else {

            len1 = ml.licenseQuantitiesData.from.length;
            for (i = 0; i < len1; i++) {
                fromObj = ml.licenseQuantitiesData.from[i];
                if (fromObj.anchor == "TRUE") {
                    len2 = fromObj.licenseKeys.length;
                    for (j = 0; j < len2; j++) {
                        licenseObj = fromObj.licenseKeys[j];
                        licenseKey = licenseObj.licenseKey;
                        currentVal = licenseObj.userUpgradeQty;
                        arrayOfQtyChange.push(licenseKey + ":" + currentVal);
                    }

                }
            }

        }
        postData.licForUpgrade = arrayOfQtyChange.join(',');

        //postData.licForUpgrade = licForUpgradeArr.join(',');
        //postData.productInventoryId = $('#upgrade_server_name').val();
        //postData.productName = $("#upgrade_server_name option:selected").text();

        return postData;
    },
    postDataDowngrade: function() {
        var postData = {},
            licForDowngradeArr = [];
        $("#tbl_downgradelic input:text").each(function() {
            var qtylen = $(this).attr('id').length,
                maxId = $(this).attr('id').substring(4, qtylen);

            licForDowngradeArr.push($('#key_' + maxId).html() + ':' + $(this).val());
        });
        postData.licForDowngrade = licForDowngradeArr.join(',');
        postData.productInventoryId = $('#downgrade_server_name').val();
        postData.productName = $("#downgrade_server_name option:selected").text();

        return postData;
    },
    postDataMove: function() {},
    loadCLDataTable: function() {

        /** need to hide the header through data table configuration, add scroll **/
        vmf.datatable.build(ml.$modalRef.find('#clDataTable'), {
            "aoColumns": [{
                "bVisible": false
            }, {
                "sTitle": "<span class='descending'>" + mlRS.common.dataTableHeadingCombine + "</span>",
                "sWidth": "35%",
                "bSortable": false
            }, {
                "sTitle": "<span class='descending'>" + mlRS.combine.txt.combineDataQuantity + "</span>",
                "sWidth": "25%",
                "bSortable": false
            }, {
                "sTitle": "<span class='descending'>" + mlRS.combine.txt.DataFolder + "</span>",
                "sWidth": "40%",
                "bSortable": false
            }, {
                "bVisible": false
            }, {
                "bVisible": false
				}
			],
            "bInfo": false,
            "bServerSide": false,
            "bAutoWidth": false,
            "aaData": ml.mlMap.combine.dataTableData,
            "bProcessing": true,
            "oLanguage": {
                "sProcessing": ice.globalVars.loadingLbl, // Note: to be moved to resource bundle
                "sLoadingRecords": ""
            },
            "bPaginate": false,
            "sPaginationType": "full_numbers",
            "sScrollY": 187,
            "sDom": 'zrtSpi',
            "bFilter": false,
            "fnRowCallback": function(nRow, aData, iDisplayIndex) {
                $(nRow).find("td:eq(0)").prepend("<span class='openclose'></span>").end().data("id", aData);
                $(nRow).find("td:eq(2)").html("<span class='ellipsisTxt folderPathCL'>" + aData[3] + "</span>");
                return nRow;
            },
            "fnDrawCallback": function() {
                var settings = this.fnSettings();
                if (settings.jqXHR && settings.jqXHR.responseText !== null && settings.jqXHR.responseText.length && typeof settings.jqXHR.responseText == "string") {
                    var jsonRes = vmf.json.txtToObj(settings.jqXHR.responseText);
                    ml.mlMap.combine.dataTableData = jsonRes.aaData;
                    ml.$modalRef.find('#clProductName').html(mlRS.common.productName + " : " + jsonRes.prodName);
                }
            },
            "fnInitComplete": function() {
                $tbl = this;
                ml.$modalRef.find('#clDataTable').find('span.openclose').die('click').live("click", function() {
                    ml.expandRow($(this), $tbl);
                });
                ml.$modalRef.find('#clDataTable').find('.ellipsisTxt').die('click').live("click", function() {
                    $(this).addClass('normalWhiteSpace');
                });
            }
        }); // End of datatable config

        var _postData = "selectedLicenseKeys=" + ml.selectedLicenses.join(',');
        vmf.datatable.reload(ml.$modalRef.find('#clDataTable'), mlRS.combine.url.getLicenseDetails, "", "POST", _postData);
    },
    expandRow: function(o, t) {
        var nTr1 = o[0].parentNode.parentNode;
        if (o.hasClass('minus')) {
            o.removeClass('minus');
            $(nTr1).removeClass("expanded noborder").next("tr").hide();
        } else {
            o.addClass('minus');
            $(nTr1).addClass("expanded noborder");
            if (!nTr1.haveData) {
                t.fnOpen(nTr1, '', '');
                ml.getCdata($(nTr1), nTr1.idx);
                nTr1.haveData = true;
                $(nTr1).next("tr").addClass('more-detail');
            } else {
                $(nTr1).next("tr").show();
            }
        }
    },
    getCdata: function(rowObj, idx) {
        var sOut = [],
            cdata = rowObj.data("id"),
            cLHtml = [];
        sOut.push("<div class='note-wrapper clearfix'><div class='noteH'>" + mlRS[ml.mlType].txt.dNote + "</div><span class='note ellipsisTxt'>" + cdata[4] + "</span></div>");
        $.each(cdata[5], function(cL, cLv) {
            if (cLv != "") {
                cLHtml.push("<div class='lCont'><div class='sLabeln'>" + cL + ": </div><div class='sLabelv'>" + cLv + "</div></div>");
            }
        });
        sOut.push("<div class='note-wrapper clearfix clDiv'>" + cLHtml.join('') + "</div>")
        rowObj.next("tr").addClass('more-detail').find("td").html(sOut.join(''));
    },
    loadDivideData: function() {
        var dlResp,
            postData = "selectedLicenseKeys=" + ml.selectedLicenses;
        vmf.ajax.post(mlRS.divide.url.getLicenseDetails, postData, function(resp) {
            ml.$modalRef.find('#dlContainer .loading').hide()
                .end().find('.dlDivideData').show();
            dlResp = vmf.json.txtToObj(resp);
            dlResp.error ? ml.dlGetLicenseFailure(dlResp) : ml.dlGetLicenseSuccess(dlResp);
        });

    },
    dlGetLicenseSuccess: function(dlResp) {
        var optionList = [],
            cData = [],
            i;
        // append strings form mlRS
		ml.$modalRef.find('#dlLabelKeyFrom').html(mlRS.common.productName+ '&nbsp;' +':'+ '&nbsp;' +dlResp.prodName);
        ml.$modalRef.find('#dlKeyHeading').html(mlRS.common.dlKey);
		ml.$modalRef.find('#dlLabelSelectedProduct').append('<span id="activeLicense">' + dlResp.licenseKey + '</span>');
        ml.$modalRef.find('#dlNotesLabel').html("<div class='note-wrapper clearfix'><div class='noteH'>" + mlRS[ml.mlType].txt.dNote + "</div><span class='note dlNotesLabel ellipsisTxt'>" + dlResp.note + "</span></div>");
        // append data from response  @ responsejson.value
        $.each(dlResp.custLabels, function(custKey, custValue) {
            if (custValue != "") {
                cData.push("<div class='lCont'><div class='sLabeln'>" + custKey + ": </div><div class='sLabelv dlNotesLabel'>" + custValue + "</div></div>");
            }
        });
        if (cData.join('') != "") {
            ml.$modalRef.find('#customData').append("<div class='note-wrapper clearfix clDiv'>" + cData.join('') + "</div>");
            ml.$modalRef.find('#customData').show();
        }
        ml.$modalRef.find('.dlKeyCount').append(mlRS.divide.txt.divideCount);
        ml.$modalRef.find('.dlTotalInstance').append(mlRS.divide.txt.totalCount + ' ' + dlResp.quantity + ' ' + dlResp.uom);
        ml.$modalRef.find('.dlRemaningInstance').append(mlRS.divide.txt.remaning + ' <span id="dlrInstance">' + '0' + '</span> ' + dlResp.uom);
        optionList.push('<select id="selectedInstance" class="dlInput">');
        for (i = 2; i <= dlResp.quantity; i++) {
            optionList.push('<option' + ' value="' + i + '"' + '>' + i + '</option>');
        }
        optionList.push('</select>');
        ml.$modalRef.find('.dlSelectedKeyCount').append(optionList.join(''));
        ml.$modalRef.find('#newKeys').find('.cpus').html(dlResp.uom);
        ml.autoPopulate(dlResp.quantity);
        ml.$modalRef.find('#dlContainer').find('.ellipsisTxt').die('click').live("click", function() {
            $(this).addClass('normalWhiteSpace');
        });
                ml.$modalRef.find('#dlLabelSelectedProduct .openclose').die('click').live("click", function (){
                    $(this).toggleClass('minus');
                    $('#dlNotesLabel').toggleClass('hideAll');
                    $('#customData').children('div').show();
                    $('#customData').toggleClass('hideAll');
                });
    },
    dlGetLicenseFailure: function(dlResp) {
        ml.$modalRef.find('.dlDivideData .error_msg').html(mlRS.divide.txt.ajaxError);
    },
    /*Re using the existing code  - @ needs clean up and opmization */
    autoPopulate: function(totalInstance) {
        if (totalInstance != '') {
            var selval = ml.$modalRef.find('#selectedInstance').val();
            ml.populatelists(selval, totalInstance);
            ml.$modalRef.find('#selectedInstance').change(function() {
                ml.populatelists($(this).val(), totalInstance);
                ml.registerInputChange();
                ml.computeTotal();
            });
        }
        // ml.computeTotal();
        ml.registerInputChange();
    },
    /*Re using the existing code  - @ needs clean up and opmization */
    populatelists: function(selectedValue, totalInstance) {
        var dividedKey,
            mode,
            prevLabel,
            prevNo,
            newNo,
            $newKeys = ml.$modalRef.find('#newKeys'),
            $newli,
            i;
        if (selectedValue > 0) {
            //var diff = selectedValue - $newKeys.find('li').length;
            dividedKey = Math.floor(totalInstance / selectedValue);
            mode = totalInstance % selectedValue;
            $newli = $newKeys.find('li:first').clone();
            $newKeys.find('li').remove();

            $newKeys.append($newli);

            // foreach difference
            for (i = 0; i < selectedValue - 1; i++) {
                // Divide with total count

                // Need to clone and create new ones
                $newli = $newKeys.find('li:first').clone();
                $newKeys.find('li:first input').val(dividedKey);

                // Get the previous number
                // Look in the html for the second instance of "[" and then the second instance of "]".
                prevLabel = $newKeys.find('li:last label').attr('for');
                prevNo = prevLabel.substring(prevLabel.indexOf("[") + 1, prevLabel.indexOf("]"));
                newNo = parseInt(prevNo) + 1;

                // Simple, just find replace all the instances of [0] in attribute.
                $newli.find('label').attr('for', $newli.find('label').attr('for').replace(/\[0\]/, '[' + newNo + ']'));
                $newli.find('input').attr('id', $newli.find('input').attr('id').replace(/\[0\]/, '[' + newNo + ']'));
                $newli.find('input').attr('name', $newli.find('input').attr('name').replace(/\[0\]/, '[' + newNo + ']'));
                $newli.find('input').attr('value', dividedKey);
                $newKeys.append($newli); //Put it into the DOM after the last li
            }

            if (mode > 0) {
                for (i = 0; i < mode; i++) {
                    var iv = $newKeys.find('li input[name="licenseKey[' + i + ']"]').val();
                    var newv = Number(iv) + 1;
                    $newKeys.find('li input[name="licenseKey[' + i + ']"]').val(newv);
                }
            }
        }
    },
    /*Re using the existing code  - @ needs clean up and opmization */
    registerInputChange: function() {
        ml.$modalRef.find('#newKeys li input').blur(function() {
            ml.computeTotal();
        });
    },
    /*Re using the existing code  - @ needs clean up and opmization */
    computeTotal: function() {
        var _total = 0,
            error_msg = '&nbsp;',
            isError = false,
            _maxCPU,
            remaningInstance;
        if (ml.$modalRef.find("#newKeys input[type=text]").length <= 1) {
            return isError;
        }
        ml.$modalRef.find("#newKeys input[type=text]").each(function() {
            if (!isNaN($(this).val())) {
                if ($(this).val().length > 0) {
                    var value = parseInt($(this).val());
                    if (value > 0) {
                        _total = parseInt(_total + value);
                    } else {
                        error_msg = mlRS.divide.txt.zeroError;
                        isError = true;
                    }
                }
            } else {
                error_msg = mlRS.divide.txt.nonNumericError;
                isError = true;
            }
        });
        _maxCPU = parseInt(ml.$modalRef.find('#selectedInstance option:last-child').val());
        remaningInstance = _maxCPU - _total;
        if (remaningInstance >= 0) {
            ml.$modalRef.find('#dlrInstance').html(remaningInstance);
        }
        if (_maxCPU != _total && !isError) {
            error_msg = mlRS.divide.txt.misMatchError;
            isError = true;
        }
        ml.$modalRef.find('.dlDivideData .error_msg').html(error_msg);
        return isError;
    },
    renderDowngradeKeys: function(data) {
        var _jsonResponse = vmf.json.txtToObj(data),
            _lData = _jsonResponse.aaData,
            dataTableData = [],
            versionList = _jsonResponse.versionList || [],
            i,
            versionOptionsArr = [];

        ml.$modalRef.find('#dglContainer > .loading').hide();
        ml.$modalRef.find('.dglMiddleContainer').show();

        ml.$modalRef.find('#mlAttention .warning_big').css('visibility', 'visible');
        if (_jsonResponse.prodConfig && _jsonResponse.prodConfig.notes) {
            // show the attension message if restricted upgrade
            ml.$modalRef.find('#attentionHeader').html(mlRS.common.attentionHeading)
                .end().find('#attentionMsg').html(myvmware.common.buildLocaleMsg(mlRS.downgradeLicense.txt.restrictedText1, _jsonResponse.prodConfig.notes));
        } else {
            ml.common.updateAttentionText();
        }
        // update the base product name
		ml.$modalRef.find('#baseProductName').text(ice.globalVars.downgradeFrom+' ' + _jsonResponse.baseProduct+' ' + mlRS.common.dgUpTo);

        // update the versionList-dropdown values
        for (i = 0; i < versionList.length; i++) {
            versionOptionsArr.push('<option value="' + versionList[i].strLicenseGenInventoryId + '">' + versionList[i].strPrimaryDescription + '</option>');
        }
        ml.$modalRef.find('#downgrade_server_name').html(versionOptionsArr.join(''));

        // render the datatable
        for (i = 0; i < _lData.length; i++) {
            dataTableData[i] = [];
            dataTableData[i][0] = '<span class="textBlack" id="key_' + i + '">' + _lData[i][0] + '</span>';
            dataTableData[i][1] = '<div><input type="text" value="0" size="2" id="qty_' + i + '" class="text_right"><span> / </span><span id="max_' + i + '">' + _lData[i][1] + '</span> <span>' + _lData[i][2] + '</span></div><div class="error_msg">&nbsp;</div><div class="clearfix"></div>';
            dataTableData[i][2] = '<span class="textGrey ellipsisTxt folderPathDGL">\\\\' + _lData[i][3] + '</span>';
                        dataTableData[i][3] = _lData[i][3];
                        dataTableData[i][4] = _lData[i][4];
                        dataTableData[i][5] = _lData[i][5];
                        //console.log('line 1741 : dataTableData[i][5] : '+dataTableData[i][5]);
        };
        vmf.datatable.build(ml.$modalRef.find('#tbl_downgradelic'), {
            "bInfo": false,
            "bPaginate": false,
            "sPaginationType": "full_numbers",
            "bFilter": false,
            "sDom": 'zrtSpi',
			"sScrollY" : '151px',
            "bAutoWidth": false,
            "aoColumns": [{
                "sWidth": "270px",
                "sTitle": "<span>" + mlRS.common.dataTableHeadingCombine + "</span>",
                "bSortable": false
            }, {
                "sWidth": "200px",
                "sTitle": "<span>" + mlRS.downgradeLicense.txt.qtyToDowngrade + "</span>",
                "bSortable": false
            }, {
                "sWidth": "auto",
                "sTitle": "<span>" + mlRS.common.folderName + "</span>",
                "bSortable": false
				}
			],
            "aoColumnDefs": [{
                "sClass": "with_input",
                "aTargets": [1]
				}
			],
            "aaData": dataTableData,
            "fnInitComplete": function() {
                            $tbl = this;
                ml.$modalRef.find('#tbl_downgradelic input:text').die('focus', 'blur').live({
                    'focus': function() {
                        if (this.value == 0)
                            this.value = '';
                    },
                    'blur': function() {
                        if (this.value == '') {
                            this.value = 0;
                        }
                        ml.common.validateDowngradeDT($(this));
                    }
                });
                ml.$modalRef.find('#loading').hide();
                                ml.$modalRef.find('#tbl_downgradelic').find('span.openclose').die('click').live("click", function () {
					ml.expandRow($(this), $tbl);
				});
				ml.$modalRef.find('#tbl_downgradelic').find('.ellipsisTxt').die('click').live("click", function () {
					$(this).addClass('normalWhiteSpace');
				});
            },
            "fnRowCallback": function(nRow, aData, iDisplayIndex) {
				ml.$modalRef.find('#tbl_downgradelic').find('span.ellipsisTxt.folderPathCL').die('click').live("click", function () {
					$(this).addClass('normalWhiteSpace').css({'width' : '140px'});
                });
                $(nRow).find("td:eq(0)").prepend("<span class='openclose'></span>").end().data("id", aData);
				$(nRow).find("td:eq(2)").html("<span class='ellipsisTxt folderPathCL'>" + aData[3] + "</span>");
                return nRow;
            }

        });
    },
    renderUpgradeKeys: function(data) {
        var _jsonResponse = vmf.json.txtToObj(data),
            _lData = _jsonResponse.aaData,
            dataTableData = [],
            versionList = _jsonResponse.targetProducts || [],
            i,
            versionOptionsArr = [];

        ml.$modalRef.find('#uglContainer > .loading').hide();
        ml.$modalRef.find('.uglMiddleContainer').show();

        ml.$modalRef.find('#mlAttention .warning_big').css('visibility', 'visible');
        if (_jsonResponse.prodConfig && _jsonResponse.prodConfig.notes) {
            // hide the notes&labels section in the initial screen for restricted upgrade
            ml.$modalRef.find("#mlNotesLabelsSel").hide();
            ml.$modalRef.find('#innerCon').removeClass('innerConHt');

            // show the attension message if restricted upgrade
            ml.$modalRef.find('#attentionHeader').html(mlRS.common.attentionHeading)
                .end().find('#attentionMsg').html(myvmware.common.buildLocaleMsg(mlRS.upgradeLicense.txt.restrictedText1, _jsonResponse.prodConfig.notes));
        } else {
            ml.$modalRef.find("#mlNotesLabelsSel").css('visibility', 'visible');
            ml.common.updateAttentionText();
        }

        // update the base product name
		ml.$modalRef.find('#baseProductName').text(ice.globalVars.upgradeFrom+' ' + _jsonResponse.baseProduct +' ' + mlRS.common.dgUpTo);

        // update the versionList-dropdown values
        for (i = 0; i < versionList.length; i++) {
            versionOptionsArr.push('<option value="' + versionList[i].strLicenseGenInventoryId + '">' + versionList[i].strPrimaryDescription + '</option>');
        }
        ml.$modalRef.find('#upgrade_server_name').html(versionOptionsArr.join(''));

        // render the datatable
        for (i = 0; i < _lData.length; i++) {
            dataTableData[i] = [];
            dataTableData[i][0] = '<span class="textBlack" id="key_' + i + '">' + _lData[i][0] + '</span>';
            dataTableData[i][1] = '<span class="textBlack">' + _lData[i][1] + '</span> <span>' + _lData[i][2] + '</span>';
			dataTableData[i][2] = '<div><input type="text" value="0" size="2" id="qty_' + i + '" class="text_right"><span> / </span><span id="max_' + i + '">' + _lData[i][3] + '</span> <span>' + _lData[i][2] + '</span></div><div class="error_msg">&nbsp;</div>';
            dataTableData[i][3] = '<span class="textGrey ellipsisTxt folderPathUGL">\\\\' + _lData[i][4] + '</span>';
            dataTableData[i][4] = _lData[i][5];
            dataTableData[i][5] = _lData[i][6];
        };
        vmf.datatable.build(ml.$modalRef.find('#tbl_upgradelic'), {
            "bInfo": false,
            "bPaginate": false,
            "sPaginationType": "full_numbers",
            "bFilter": false,
            "sDom": 'zrtSpi',
			"sScrollY" : '151px',
            "bAutoWidth": false,
            "aoColumns": [{
                "sWidth": "250px",
                "sTitle": "<span>" + mlRS.common.dataTableHeadingCombine + "</span>",
                "bSortable": false
            }, {
                "sWidth": "150px",
                "sTitle": "<span>" + mlRS.common.totalQty + "</span>",
                "bSortable": false
            }, {
                "sWidth": "200px",
                "sTitle": "<span>" + mlRS.upgradeLicense.txt.qtyToUpgrade + "</span>",
                "bSortable": false
            }, {
                "sWidth": "auto",
                "sTitle": "<span>" + mlRS.common.folderName + "</span>",
                "bSortable": false
				}
			],
            "aoColumnDefs": [{
                "sClass": "with_input",
                "aTargets": [1]
				}
			],
            "aaData": dataTableData,
            "fnInitComplete": function() {
                                $tbl = this;
                ml.$modalRef.find('#tbl_upgradelic input:text').die('focus', 'blur').live({
                    'focus': function() {
                        if (this.value == 0)
                            this.value = '';
                    },
                    'blur': function() {
                        if (this.value == '') {
                            this.value = 0;
                        }
                        ml.common.validateUpgradeDT($(this));
                    }
                });
                ml.$modalRef.find('#loading').hide();
				ml.$modalRef.find('#tbl_upgradelic').find('span.openclose').die('click').live("click", function () {
					ml.expandRow($(this), $tbl);
				});
				ml.$modalRef.find('#tbl_upgradelic').find('.ellipsisTxt').die('click').live("click", function () {
					$(this).addClass('normalWhiteSpace');
				});
            },
            "fnRowCallback": function(nRow, aData, iDisplayIndex) {
				ml.$modalRef.find('#tbl_upgradelic').find('span.ellipsisTxt.folderPathUGL').die('click').live("click", function () {
					$(this).addClass('normalWhiteSpace').css({'width' : '90px'});
                });
                 $(nRow).find("td:eq(0)").prepend("<span class='openclose'></span>").end().data("id", aData);
                return nRow;
            }
        });
    },
    showDowngradeVI3OrderList: function(contractFormActionURL) {
        $('#selectedLicenseKeys').val(ml.selectedLicenses.join(','));
        $("#contractForm").attr('action', contractFormActionURL)
            .attr('target', '_blank');
        $("#contractForm").submit();
    }
};

/**
 * Folder Tree jQuery Plugin
 * Version **** 1.0.3  ****
 * Updated: 12/30/2011
 * This plugin can take in a list representation of tree structure and produce a folder tree for a subset of tree and attach events to the tree
 * @author Praveer Sengaru (psengaru@vmware.com)
 */
(function($) {
    /**
     * Function to get Folder JSON using Post Request, the response of this request is a JSON object
     *
     * @params
     * url: url for which POST request has to be made
     * requestParams: The set of request attribute/value pairs to be sent in the POST request
     * onSuccess: The callback function invoked upon successful execution of JSON POST request
     * onFailure: The callback function invoked upon failed execution of JSON POST request
     * onComplete: The callback function invoked irrespective of whether the execution was success or failure
     *
     * @return
     * JavaScript object representing folderPane as a Array List of folder information
     *
     */
    $.ft = {};
    $.ft.getFolderJSONPost = function(url, requestParams, onSuccess, onFailure, onComplete) { //Make sure there is no current ongoing request, if yes cancel it
        if ($.ft._fjqXHR && $.ft._fjqXHR.readystate != 4) {
            $.ft._fjqXHR.abort();
        }
        if ($.ft.opts.managePermViewFlag) {
            if (requestParams == null) {
                requestParams = new Object();
            }
            requestParams['managePermView'] = true;
        }
        $.ft._fjqXHR = $.ajax({
            type: 'POST',
            url: url,
            async: true,
            dataType: "json",
            data: requestParams,
            success: function(jsonResponse) {
                $.ft._folderListJSON = jsonResponse; //Making sure to disable loading
                $("#" + $.ft.opts.uniqueDiv + " ." + $.ft.opts.loadingClass).hide(); //Do validation
                var validationResult = $.ft.opts.validateJSONFunction(jsonResponse);
                if (validationResult != undefined && !validationResult) return false; //foldertree wont be constructed
                if (onSuccess != null) onSuccess(jsonResponse);
            },
            error: function(response, errorDesc, errorThrown) {
                if (errorDesc == "abort") {
                    if (console) {
                        console.log("Ongoing AJAX call aborted");
                    }
                } else if (onFailure != null) onFailure(response, errorDesc, errorThrown);
            },
            beforeSend: function() {
                $("#" + $.ft.opts.uniqueDiv + " ." + $.ft.opts.loadingClass).show();
            },
            complete: function(jqXHR, settings) {
                $("#" + $.ft.opts.uniqueDiv + " ." + $.ft.opts.loadingClass).hide();
                if (onComplete != null) onComplete(jqXHR, settings);
            },
            timeout: $.ft.opts.ajaxTimeout
        });
        return $.ft._folderListJSON;
    };
    /**
     * Function to populate the Folder Pane with tree structure
     *
     * @params
     * folderTreeJSON: The folder tree JavaScript Object
     *
     * u -  uniqueDiv
     * f -  json response data
     * p -  current parent ul node jquery element
     *
     * Abbreviations used
     * _fn - folder node
     * _fBuf - folder buffer
     *
     */
    $.ft.populateFolderUI = function(u, f, p) {
        $rch = null;
        var _fBuf = null;
        var _skelFN = $('<li><span class="folderNode"></span></li>');
        var bdge = $('<span class="badge asp">ASP</span>');
        /*if(f.folderContents.length == 0) {
            if(console != undefined) {
                console.log("No Folders received in Json response");
            }
        }*/
        if ($('#addUsersToFoldersContent3 #folderPane').length) $('#addUsersToFoldersContent3 #folderPane').css('height', 'auto').css('min-height', 'auto');
        $(f.folderContents).each(function(idx, v) {
            $.ft._folderHT.put(v.folderId, v);
            _fn = _skelFN.clone().addClass(v.folderId).addClass("folderlist").data({
                "folderId": v.folderId,
                "ftype": v.folderType
            }).attr("level", v.folderLevel - 1);
            if (!v.isLeaf && v.folderType != "ROOT") {
                $('span', _fn).eq(0).prepend($('<a></a>').addClass($.ft.opts.oc));
                _fn.removeClass('no_child');
            }
            if (v.isLeaf && v.folderType != "ROOT") {
                _fn.addClass('no_child');
            } //Add no_child only if it is not a ROOT folder
            //($.ft.opts.inputType == 'checkbox')?$('span', _fn).append('<input type=\"checkbox\">'):$('span', _fn).append('<input type=\"radio\" name=\"foldername\" >');
            if ($.ft.opts.inputType == 'checkbox') $('span', _fn).append('<input type=\"checkbox\">');
            if ($.ft.opts.wrapEllipseBtn) {
                $('span', _fn).append('<span class=\'folderTxt\'>' + v.folderName + '</span>');
            } else {
                $('span', _fn).append(v.folderName);
            }
            if (v.folderType == "ASP" || v.folderType == "VCE" || v.folderType == "CPL") {
                var titleattr = "";
                if ($.ft.opts.wrapEllipseBtn) {
                    $('span.folderNode', _fn).append(bdge.clone().html(v.folderType));
                } else {
                    $('span', _fn).append(bdge.clone().html(v.folderType));
                }
                if (v.folderType == "ASP") {
                    $('span', _fn).attr('title', ((typeof $staticTextforASP != "undefined") ? $staticTextforASP : ""));
                }
                if (v.folderType == "VCE") {
                    $('span', _fn).attr('title', ((typeof $staticTextforVCE != "undefined") ? $staticTextforVCE : ""));
                }
                if (v.folderType == "CPL") {
                    $('span', _fn).attr('title', ((typeof $staticTextforCPL != "undefined") ? $staticTextforCPL : ""));
                }
                if ($.ft.opts.inputType == 'checkbox') $('span', _fn).find('input:checkbox').addClass('special ' + v.folderType).data('folderType', v.folderType);
            }
            if (v.folderAccess == "NONE") {
                //removed disabled attribute to span - It is causing issue in adding events to span in IE
                $(_fn).children().addClass("disabled tooltip").attr('title', (v.folderType != "ROOT") ? $.ft.opts.folderDisabledText : $.ft.opts.homeDisabledText);
                $('input', _fn).attr('readonly', true);
            }
            if (v.folderType == 'ROOT' && v.folderAccess != "NONE") {
                IsLoggedInUserRootAccess = true;
            }
            $.ft.opts.cbOnFolderNodeCreate(_fn, v);
            if (v.folderType == "ROOT") {
                if (_fBuf == null) {
                    //_fBuf = $('<ul></ul>');
                    _fBuf = ($.ft.opts.inputType == 'checkbox') ? $('<ul class="checks"></ul>') : $('<ul class="noRadio"></ul>');
                }
                $('a', _fn).addClass($.ft.opts.op).data('hasdata', true);
                $rch = $("<ul class='top_border'></ul>");
                $(_fn).append($rch);
                _fBuf.append(_fn);
            } else if (v.folderLevel == 2 && _fBuf != null) {
                if (v.folderType != "FLEX") // BUG-00025556
                    $('ul', _fBuf).append(_fn);
            }
            if (p != undefined) { //When user drills down the folder tree
                if (_fBuf != null) {
                    _fBuf.append(_fn);
                } else { //_fBuf is null
                    _fBuf = $('<div></div>');
                    _fBuf.append(_fn);
                }
            }
        });
        if (p == undefined) {
            $('#' + u + ' .folderPane').append(_fBuf);
        } else {
            var _urFolder = p.siblings().filter('ul.urFolder'),
                checked = false;
            p.append(_fBuf.children());
            if (_urFolder.length > 0) {
                $(_urFolder.children()).each(function(ur_idx, ur_v) {
                    _ur_folderId = $(ur_v).data("folderId");
                    if ($.ft._folderHT.containsKey(_ur_folderId) && $.ft._folderHT.get(_ur_folderId).folderIdList == undefined) { //UR Folder is rendered in this child tree
                        if ($('input', ur_v).is(':checked')) {
                            checked = true;
                            $("." + _ur_folderId + " .fWrap", p).addClass("active").find('input').attr('checked', true);
                        } else {
                            $("." + _ur_folderId + " .fWrap", p).find('input').attr('checked', false);
                        }
                        $(ur_v).remove();
                        if (checked) $("." + _ur_folderId, p).find('input').attr('checked', true);
                        checked = false;
                    } else {
                        $.ft._selectedFolders.remove(_ur_folderId);
                        var _fObj = $.ft._folderHT.get(_ur_folderId);
                        $.ft._folderHT.remove(_ur_folderId);
                        if ($('input', ur_v).is(':checked')) {
                            $.ft.showURFolder(_ur_folderId, _fObj, false, true);
                        } else {
                            $.ft.showURFolder(_ur_folderId, _fObj, false, false);
                        }
                        $(ur_v).remove();
                    }
                });
            }
        }
        $.ft.opts.checkRootFolderAccess();
        $.ft.opts.loadComplete(); //After complete folder tree is loaded this method will be invoked
    };

    /**
     * Function to expand and preselect folder given 'folderId'
     *
     *@params
     *
     *folderId, scrollEnabled
     * folderId - folderId for the folder to be preselected
     * scrollEnabled <boolean> - If this option is set to true and there is a vertical scrollbar for folder pane then the user will be automatically be navigated to the selected folder with given folderId
     *
     */
    $.ft.expandAndSelectFolder = function(folderId, scrollEnabled, selectEnabled) {
        if ($.ft._folderHT.containsKey(folderId)) {
            // clear previous highlights if input type is radio
            if ($.ft.opts.inputType == 'radio' && selectEnabled) {
                $('#' + $.ft.opts.uniqueDiv + ' .folderPane').find('span.' + $.ft.opts.folderSelectedClass).removeClass($.ft.opts.folderSelectedClass);
                if ($.ft._prevCheckedRadio == null) {
                    $.ft._currCheckedRadio = $('#' + $.ft.opts.uniqueDiv + ' .' + folderId).children().filter('span').children().filter('input');
                    $.ft._prevCheckedRadio = $.ft._currCheckedRadio;
                    $.ft._currCheckedRadio.attr('checked', true);
                } else if ($.ft._prevCheckedRadio != null || $.ft._prevCheckedRadio != undefined) {
                    $.ft._prevCheckedRadio.attr('checked', false);
                    $.ft._currCheckedRadio = $('#' + $.ft.opts.uniqueDiv + ' .' + folderId).children().filter('span').children().filter('input');
                    $.ft._currCheckedRadio.attr('checked', true);
                    $.ft._prevCheckedRadio = $.ft._currCheckedRadio;
                }
                $.ft._selectedFolders.clear();
            } else if (selectEnabled) {
                $('#' + $.ft.opts.uniqueDiv + ' .' + folderId).children().filter('span').children().filter('input').attr('checked', true);
            }

            if (selectEnabled) {
                $('#' + $.ft.opts.uniqueDiv + ' .' + folderId).children().filter('span').addClass($.ft.opts.folderSelectedClass);
            }
            if (!($.ft._selectedFolders.containsKey(folderId)) && selectEnabled) { //If not already selected
                $.ft.opts.cbOnClickFunction(folderId, 'checked');
                $.ft._selectedFolders.put(folderId, true);
                $.ft.opts.cbOnClickSelFoldersFunction($.ft._selectedFolders.keys(), 'checked');
                $.ft.opts.cbOnClickSelFoldersEFunction($.ft._selectedFolders.keys(), folderId, 'checked');
            }
            //Expand all parents if not already expanded
            var _currFolder = $('#' + $.ft.opts.uniqueDiv + ' .' + folderId);
            var _parentsUl = _currFolder.parents('ul');
            $(_parentsUl).each(function(index, value) {
                if (!($(this).is(":visible"))) {
                    $(this).show();
                    $(this).siblings('ul').show();
                    //$(this).siblings().first().find('a').removeClass($.ft.opts.oc);
                    $(this).siblings().first().find('a').addClass($.ft.opts.op);
                    var _expandedFid = $(this).parent().data('folderId');
                    $.ft._expandedFolders.put(_expandedFid, true);
                }
            });

            if (scrollEnabled) {
                var _folderPaneJQElem = $('#' + $.ft.opts.uniqueDiv + ' .folderPane');
                if (_folderPaneJQElem.hasClass('scroll')) {
                    _folderPaneJQElem.scrollTo($('#' + $.ft.opts.uniqueDiv + ' .' + folderId), $.ft.opts.slideAnimSpeed, {
                        "axis": "y"
                    });
                } else {
                    _folderPaneJQElem.closest('.scroll').scrollTo($('#' + $.ft.opts.uniqueDiv + ' .' + folderId), $.ft.opts.slideAnimSpeed, {
                        "axis": "y"
                    });
                }
            }
            return _currFolder;
        } else {
            return null;
        }
    };


    /**
     * Function to display unrendered folders which are not in browser DOM
     */
    $.ft.showURFolder = function(fId, fObj, invCB, selFlag) {
        var _fFound = false,
            _curFolderLevel = 0;
        var _fPos = 0;
        for (var i = 0; i < fObj.folderIdList.length; i++) {
            if ($.ft._folderHT.containsKey(fObj.folderIdList[i].toString())) {
                _fFound = true;
                _fPos = i;
                break;
            }
        }
        if (_fFound) {
            var _currFolder = $.ft.expandAndSelectFolder(fObj.folderIdList[_fPos].toString(), false, false); //Expand upto the branch folder
            _curFolderLevel = parseInt(_currFolder.attr("level"), 10);
            if (_currFolder != null) {
                //Construct UR Folder
                if ($.ft.opts.inputType == 'checkbox') {
                    var _urSkel = $("<li class=\"folderlist\"><span class=\"fWrap folderNode\"><input type=\"checkbox\"><span unselectable=\"on\"></span></span></li>");
                } else {
                    var _urSkel = $("<li class=\"folderlist\"><span class=\"fWrap folderNode\"><span unselectable=\"on\"></span></span></li>");
                }
                _urSkel.addClass(fObj.folderId).data("folderId", fObj.folderId).attr("level", _curFolderLevel + 1);
                $('span', _urSkel).eq(0).prepend("...  ");
                $('span', _urSkel).eq(1).append(fObj.folderName);
                if (selFlag) {
                    $(_currFolder).parents('ul.noRadio').find('span.folderNode').removeClass('active');
                    $('input', _urSkel).attr('checked', true);
                    $('span', _urSkel).eq(0).addClass("active");
                }
                $.ft._folderHT.put(fObj.folderId, fObj);
                $.ft._selectedFolders.put(fObj.folderId, true);
                //Append UR Folder
                if ($('ul', _currFolder).length > 0) {
                    $('ul', _currFolder).append(_urSkel);
                } else {
                    var _ulWrap = $("<ul></ul>").addClass('urFolder');
                    $(_currFolder).append(_ulWrap);
                    $('ul', _currFolder).append(_urSkel);
                }
                if (invCB) {
                    $.ft.opts.cbOnClickSelFoldersFunction($.ft._selectedFolders.keys(), 'checked');
                    $.ft.opts.cbOnClickSelFoldersEFunction($.ft._selectedFolders.keys(), fObj.folderId, 'checked');
                    $.ft.opts.cbOnClickFunction(fObj.folderId, 'checked');
                }
            }
            $.ft.attachEvents();
        }
    }

    /**Function to attach events to the Folder Pane tree structure
     * @params
     */

    $.ft.attachEvents = function() {
        //To disable folder name selection in IE on double click
        $('#' + $.ft.opts.uniqueDiv + ' .folderPane li > span > span').each(function() {
            $(this).attr('unselectable', 'on');
            $(this).bind('selectstart', function() {
                return false;
            });
        });
        //Attach events for expand and collapse click
        $('#' + $.ft.opts.uniqueDiv + ' .folderPane a.' + $.ft.opts.oc).unbind('click').bind('click', function() {
            $t = $(this);
            $ul = $t.closest('li').children().filter('ul').filter(function(idx) {
                return !($(this).hasClass('urFolder'));
            });
            if ($t.hasClass($.ft.opts.op)) {
                if ($ul.length <= $.ft.opts.slideMax) {
                    $ul.slideUp($.ft.opts.slideAnimSpeed);
                    myvmware.common.setAutoScrollWidth('div.folderPane ul');
                } else {
                    $ul.css('display', 'none');
                    myvmware.common.setAutoScrollWidth('div.folderPane ul');
                }
                $t.removeClass($.ft.opts.op);
                //var _spanClass = $(this).parents('li').attr('class').split(' ');
                //$.ft._expandedFolders.remove(_spanClass[0]);
            } else {
                if ($t.data("hasdata")) {
                    if ($ul.length <= $.ft.opts.slideMax) {
                        $ul.slideDown($.ft.opts.slideAnimSpeed, function() {
                            myvmware.common.setAutoScrollWidth('div.folderPane ul');
                        });
                    } else {
                        $ul.css('display', '');
                        myvmware.common.setAutoScrollWidth('div.folderPane ul');
                    }
                } else {
                    $.ft.getChildData($t);
                    //console.log($(this).parent().addClass("no_border"));
                }
                $t.addClass($.ft.opts.op);
                //var _spanClass = $(this).parents('li').attr('class').split(' ');
                //$.ft._expandedFolders.put(_spanClass[0], true);
            }
            //$(this).parent().toggleClass("no_border");
            //$(this).parent().next().toggleClass("top_border"); 
            return false;
        });

        //Disable preselected select-all checkbox
        //$('#' + $.ft.opts.uniqueDiv + ' .select-all').attr('checked', false);/*Commented as part of CR-13272 */
        //Attach event for select all checkbox
        $('#' + $.ft.opts.uniqueDiv + ' .select-all').unbind('click').bind('click', function() {
            //On Select-All - Select all checkboxes except read-only and special folders(ASP, VCE, CPL)
            var allCheckboxes = $('#' + $.ft.opts.uniqueDiv + ' .folderPane').find('input[type=checkbox]:not([readonly])').not('.special'),
                folderId = '';
            if (!$(this).is(':checked')) { //If already checked then uncheck
                $(allCheckboxes).attr('checked', false);
                $.ft._selectedFolders.clear();
                $(allCheckboxes).each(function(index, value) {
                    folderId = $(this).closest('li').data('folderId');
                    //$.ft.opts.cbOnClickFunction(folderId, 'unchecked');
                    $(this).closest('span').removeClass("active");
                });
                $.ft.opts.cbOnClickSelFoldersEFunction($.ft._selectedFolders.keys(), folderId, 'unchecked');
            } else { //otherwise check all checkboxes
                $(allCheckboxes).attr('checked', true);
                $(allCheckboxes).each(function(index, value) {
                    folderId = $(this).closest('li').data('folderId');
                    if (!($.ft._selectedFolders.containsKey(folderId))) {
                        $.ft._selectedFolders.put(folderId, true);
                    }
                    //$.ft.opts.cbOnClickFunction(folderId, 'checked');
                    $(this).closest('span').addClass("active");
                });
                $.ft.opts.cbOnClickSelFoldersEFunction($.ft._selectedFolders.keys(), folderId, 'checked');
            }
        });
        //Binds npMsgFunction as callback when readonly checkbox is clicked
        $('.folderPane input[readonly]').unbind('mousedown click').bind('mousedown click', function(e) {
            //$(this).attr('checked', false);
            e.preventDefault();
            $(this).removeAttr("checked");
            //$.ft.opts.npMsgFunction($.ft.opts.npMsgContent);
        });

        //Binds each non-readonly checkbox with the provided callback function
        /*$('#' + $.ft.opts.uniqueDiv + ' .folderPane').find('input[type=checkbox]:not([readonly])').unbind('click').click(function () {
			var _spanClass = $(this).parents('li').attr('class').split(' ');
			var _checkBoxLength = $('#' + $.ft.opts.uniqueDiv + ' .folderPane').find('input[type=checkbox]:not([readonly])').length;
			var _checkedLength = $('#' + $.ft.opts.uniqueDiv + ' .folderPane').find('input[type=checkbox]:not([readonly]):checked').length;
			if ($(this).attr('checked') != true) { //If unchecked
				$('#' + $.ft.opts.uniqueDiv + ' .select-all').attr('checked',false);
				$.ft._selectedFolders.remove(_spanClass[0]);
				$.ft.opts.cbOnClickSelFoldersFunction($.ft._selectedFolders.keys(), 'unchecked');
                $.ft.opts.cbOnClickSelFoldersEFunction($.ft._selectedFolders.keys(), _spanClass[0], 'unchecked');
				$.ft.opts.cbOnClickFunction(_spanClass[0], 'unchecked');
				$(this).parent().removeClass($.ft.opts.folderSelectedClass);
			} 
			else { //If checked
				if(_checkBoxLength==_checkedLength){
					$('#' + $.ft.opts.uniqueDiv + ' .select-all').attr('checked',true);
				}
				$.ft._selectedFolders.put(_spanClass[0], true);
				$.ft.opts.cbOnClickSelFoldersFunction($.ft._selectedFolders.keys(), 'checked');
                $.ft.opts.cbOnClickSelFoldersEFunction($.ft._selectedFolders.keys(), _spanClass[0], 'checked');
				$.ft.opts.cbOnClickFunction(_spanClass[0], 'checked');
				$(this).parent().addClass($.ft.opts.folderSelectedClass);
			}
		});*/
        var spanEle, cnt, $folderPane = $('#' + $.ft.opts.uniqueDiv + ' .folderPane ul.checks'),
            folderId = null;
        $folderPane.find('li span.folderNode:not(".disabled")').unbind('click mouseover mouseout').bind('click mouseover mouseout', function(e) {
            //e.stopPropagation();
            //e.preventDefault();
            if ($(this).hasClass("disabled")) return;
            if (e.type == "mouseover") {
                $(this).addClass('hover'); // Mouseover Background color
            } else if (e.type == "mouseout") {
                $(this).removeClass('hover'); // Remove Mouseover Background color
            } else {
                target = $(e.target), cnt = true;
                if (target.is("a.openClose")) {
                    return;
                } else if (target.is("input[type=checkbox]:not([readonly])")) {
                    spanEle = target.closest("span.folderNode"), $check = $(target);
                    checked = target.is(':checked');
                } else {
                    spanEle = $(this), $check = $(this).find("input[type=checkbox]:not([readonly])");
                    checked = !spanEle.hasClass('active');
                }
                if (checked) {
                    spanEle.addClass("active");
                    //If it is a special folder - Unselect and disable all chcekboxes except same folderType
                    if ($check.hasClass('special')) {
                        $check.closest("ul.checks").find('input:checkbox').removeClass("unselect");
                        $check.closest("ul.checks").find('input[type=checkbox]:not([readonly]):not(.' + $check.data("folderType") + ')').each(function() {
                            $(this).removeAttr('checked').attr('disabled', 'disabled').addClass("unselect").parent('span').removeClass('active');
                            $('#' + $.ft.opts.uniqueDiv + ' .select-all').removeAttr("checked").attr('disabled', 'disabled').addClass('unselect');
                            $.ft._selectedFolders.remove($(this).closest('li').data('folderId'));
                        });
                    }
                    $check.attr("checked", "checked");
                    folderId = spanEle.closest('li').data("folderId");
                    $('input:checkbox:not(".special"):enabled', $folderPane).each(function() {
                        if (!$(this).attr("checked")) cnt = false;
                    });
                    if (cnt && $('input:checkbox:not(".special"):enabled', $folderPane).length) {
                        $('#' + $.ft.opts.uniqueDiv + ' .select-all').attr("checked", "checked");
                    }
                    $.ft._selectedFolders.put(folderId, true); //Selected Folders
                    $.ft.opts.cbOnClickSelFoldersFunction($.ft._selectedFolders.keys(), 'checked');
                    $.ft.opts.cbOnClickSelFoldersEFunction($.ft._selectedFolders.keys(), folderId, 'checked');
                } else {
                    if ($check.hasClass('special') && !$('#folderPane input:checkbox:(".special"):checked').length) {
                        $check.closest("ul.checks").find('input[type=checkbox]:not([readonly])')
                            .removeAttr('disabled').removeClass("unselect");
                        $('#' + $.ft.opts.uniqueDiv + ' .select-all').removeAttr("disabled").removeClass('unselect');
                    }
                    spanEle.removeClass("active");
                    $check.removeAttr("checked");
                    folderId = spanEle.closest('li').data("folderId");
                    $.ft._selectedFolders.remove(folderId);
                    $('#' + $.ft.opts.uniqueDiv + ' .select-all').removeAttr("checked");
                    $.ft.opts.cbOnClickSelFoldersFunction($.ft._selectedFolders.keys(), 'unchecked');
                    $.ft.opts.cbOnClickSelFoldersEFunction($.ft._selectedFolders.keys(), folderId, 'unchecked');
                }
            }
        });

        //Binds each non-readonly radio button with the provided callback function
        $('#' + $.ft.opts.uniqueDiv + ' .folderPane ul.noRadio li.folderlist span.folderNode:not(".disabled")').live('click mouseover mouseout', function(e) {
            //e.preventDefault();
            if (e.type == "mouseover") {
                $(this).addClass('hover');
            } else if (e.type == "mouseout") {
                $(this).removeClass('hover');
            } else {
                if ($(this).hasClass('active')) {
                    return;
                }
                $(this).closest('section').find('span.folderNode').removeClass('active');
                $(this).addClass('active');
                $.ft.opts.cbOnClickFunction($(this).closest('li').data("folderId"), 'checked');
                // clear previous highlights
                /*$('#' + $.ft.opts.uniqueDiv + ' .folderPane').find('span.' + $.ft.opts.folderSelectedClass).removeClass($.ft.opts.folderSelectedClass);
				// highlight current node
				//$(this).parent().addClass($.ft.opts.folderSelectedClass);*/
            }
        });
        var l = 0;
        $(".folderPane ul.checks li span.folderNode").each(function() {
            l = parseInt($(this).closest("li").attr("level"), 10);
            $(this).css("padding-left", 15 + ((l - 1) * 18) + "px");
        });
        $(".folderPane ul.noRadio li span.folderNode").each(function() {
            l = $(this).closest("li").attr("level");
            if (l == 0) {
                $(this).css("padding-left", 15 + "px");
            } else if ($(this).find("a.openClose").length) {
                $(this).css("padding-left", 15 + (l - 1) * 18 + "px");
            } else {
                $(this).css("padding-left", 15 + l * 18 + "px");
            }
        });
        myvmware.hoverContent.bindEvents($('.folderPane .tooltip'), 'default');
    };
    $.ft.getChildData = function(obj) {
        pLi = obj.closest('li'); // parent li
        var emsSelectFolderFromTreeURL = $.ft.opts.url;
        if ($.ft.opts.requestParams == null) {
            var _postData = new Object();
        } else {
            var _postData = $.ft.opts.requestParams;
        }
        _postData['navigatingFolderId'] = pLi.data('folderId');
        if ($.ft.opts.managePermViewFlag) {
            _postData['managePermView'] = true;
        }
        $.ajax({
            type: 'POST',
            url: emsSelectFolderFromTreeURL,
            async: true,
            dataType: "json",
            data: _postData,
            success: function(jsonResponse) {
                $.ft._folderListJSON = jsonResponse;
                //Making sure to disable loading
                $("#" + $.ft.opts.uniqueDiv + " ." + $.ft.opts.loadingClass).hide();
                //Do validation
                var validationResult = $.ft.opts.validateJSONFunction(jsonResponse);
                if (validationResult != undefined && !validationResult) return false; //foldertree wont be constructed
                obj.data('hasdata', true);
                pObj = $('<ul></ul>');
                pLi.append(pObj);
                $.ft.populateFolderUI($.ft.opts.uniqueDiv, jsonResponse, pObj);
                myvmware.common.setAutoScrollWidth('div.folderPane ul');
                if ($(".folderPane input:checkbox.special:checked").length) pLi.find("ul input:checkbox, ul span.folderNode")
                    .filter('input:checkbox').attr("disabled", "disabled").end()
                    .filter('span').addClass('disabled');
                $.ft.attachEvents();
            },
            error: function(response, errorDesc, errorThrown) {
                if (errorDesc == "abort") {
                    /*if(console) {
                        console.log("Ongoing AJAX call aborted");
                    }*/
                } else {
                    $.ft.opts.errorFunction(response, errorDesc, errorThrown);
                    //console.log("In error: " + errorThrown);
                }
            },
            beforeSend: function() {
                $("#" + $.ft.opts.uniqueDiv + " ." + $.ft.opts.loadingClass).show();
            },
            complete: function(jqXHR, settings) {
                $("#" + $.ft.opts.uniqueDiv + " ." + $.ft.opts.loadingClass).hide();
                //if(onComplete != null) onComplete(jqXHR, settings);
                /*CR-13272 Code Changes Start*/
                var chkAll = $('#' + $.ft.opts.uniqueDiv + ' .select-all');
                if (chkAll.length) {
                    if (chkAll.is(':checked')) {
                        pLi.find("ul input:checkbox").attr('checked', true);
                        pLi.find('span.folderNode').addClass('active');
                    } else {
                        pLi.find("ul input:checkbox").removeAttr('checked');
                        pLi.find('span.folderNode').removeClass('active');
                    }
                }
                /*CR-13272 Code Changes End*/
            },
            timeout: $.ft.opts.ajaxTimeout
        });
    };
    $.ft.renderFolderPane = function(folderListJSON) {
        if (folderListJSON.emptyTree) {
            if ($("button#exportAllToCsvButton") != null && $("button#exportAllToCsvButton") != 'undefined') { //BUG-00047200
                $("button#exportAllToCsvButton").hide();
                if ($("button#showAllUpgradeOptionsButton") != 'undefined'){
                    $("button#showAllUpgradeOptionsButton").hide();
                }
            }

            $('#' + $.ft.opts.uniqueDiv + ' .folderPane').append("<div class=\"emptyTree\">" + $.ft.opts.emptyTreemsg + "</div>");
            if ($('#selectFolderInfoDiv ul li').length > 0) {
                $('#selectFolderInfoDiv ul li.initmsg').hide();
            } //BUG-00033285
            return;
        } else { //BUG-00047200
            if ($("button#exportAllToCsvButton") != null && $("button#exportAllToCsvButton") != 'undefined') {
                $("button#exportAllToCsvButton").show();
                if ($("button#showAllUpgradeOptionsButton") != 'undefined'){
                    $("button#showAllUpgradeOptionsButton").show();
                }
            }
        }
        $.ft.populateFolderUI($.ft.opts.uniqueDiv, folderListJSON);
        myvmware.common.setAutoScrollWidth('div.folderPane ul');
        IsLoggedInUserSUorOU = folderListJSON.superuser;
        $.ft.opts.checkRootFolderPermisssion(folderListJSON);
        if ($('#selectFolderInfoDiv ul li').length > 0) {
            $('#selectFolderInfoDiv ul li.initmsg').show();
        } //BUG-00033285
        $.ft.attachEvents();
    };

    /**
     * Function to find folders from folder tree based upon search term
     *
     * @params
     * searchTerm : search string as an input to the function
     *
     * @return
     * Returns array of folder ids matching the given search term for folder name
     *
     */

    $.ft.findFolder = function(searchTerm) {
        searchTerm = searchTerm.toLowerCase();
        $.ft._findFolderIds = [];
        var _fldCnt = 0;
        $($.ft._folderListJSON.folderContents).each(function(index, value) {
            if (value.folderName.toLowerCase().indexOf(searchTerm) != -1) {
                $.ft._findFolderIds[_fldCnt] = value.folderId;
                _fldCnt = _fldCnt + 1;
            }
        });
        return ($.ft._findFolderIds);
    };

    /**
     * Function to store the permission value in folder tree Hash table
     *
     * @params
     *
     *  - folderId
     *
     * permission object:
     *  contains:
     *  - viewP
     *  - manageP
     *  - divCombP
     *  - upgDwgP
     *
     */
    $.ft.storePermission = function(folderId, permissionObj) {
        var _currFolderObj = $.ft._folderHT.get(folderId);
        if (permissionObj != undefined) {
            if (permissionObj.manage) {
                _currFolderObj.folderAccess = "MANAGE";
            } else if (permissionObj.view) {
                _currFolderObj.folderAccess = "VIEW";
            } else if (!(permissionObj.view)) {
                _currFolderObj.folderAccess = "NONE";
            }
            _currFolderObj.permission = permissionObj;
            $.ft._folderHT.put(folderId, _currFolderObj);
        }
        /*else {
            if(console != undefined) {
                console.error("permissionObj for function storePerm cannot be undefined");
            }
        }*/
    }

    /**
     * Function to validate the folders from folder tree based upon create and rename
     *
     * @params
     * curFolderId : curFolderId string as an input to the function
     * curFolderName : foldername string as an input to the function
     *
     * @return
     * Returns true/false, if it is true then the foldername is duplicate
     *
     */
    $.ft.duplicateFolder = function(curFolderId, curFolderName) {
        /*curFolderName = curFolderName.toLowerCase();
		$.ft._duplicateFolder = false;                
		$($.ft._folderListJSON.folderContents).each(function (index, value) {
                    if(value.parentFolderId == curFolderId && value.folderName.toLowerCase() == curFolderName) { // 111==111 && test == test; return true
                           $.ft._duplicateFolder = true;                                
                    }
		});
		return($.ft._duplicateFolder);*/
    };

    /** $ is an alias to jQuery object */
    $.ft.foldertree = function(options) {
        $.ft.opts = jQuery.extend({
            url: '',
            requestParams: null,
            defaultState: 'onelevelexpand', //Can take 'collapseall', 'expandall' and 'onelevelexpand'
            inputType: 'checkbox', //Can take 'checkbox' and 'radio'
            uniqueDiv: 'folderDiv',
            collapsible: 'collapsible',
            expandable: 'expandable',
            oc: 'openClose',
            op: 'open',
            clickable: 'clickable',
            nonclickable: 'nonclickable',
            folderList: 'folderlist',
            ajaxTimeout: 20000,
            folderSelectedClass: 'active',
            filterClass: 'columnFilter',
            loadingClass: 'ajaxLoading',
            expandSelect: true,
            wrapEllipseBtn: false,
            slideMax: 30,
            slideAnimSpeed: 250, //Change the sliding (Up/Down) animation speed when folders are expanded and collapsed : lower values means higher speed and vice-versa
            managePermViewFlag: false,
            emptyTreemsg: (typeof emptyTreemsg != "undefined") ? emptyTreemsg : "",
            homeDisabledText: 'See Help for reasons why you cannot view the contents of this folder.',
            folderDisabledText: 'Expand to see folders you can access.',
            npMsgFunction: function(msgTxt) {}, //No permission Message callback Function
            npMsgContent: '', //No permission Message Content
            cbOnFolderNodeCreate: function(folderElem, folderValue) {}, //Callback gets executed when foldertree creates a node before adding it to browser's DOM
            //Argument 1: folder Node's DOM element, Argument 2: folder Node's value which is the equivalent of each entry on folderContents
            // !! Warning please use the above callback cautiously, any intensive operation should be avoided as it may cause severe delay in the foldertree construction !!
            cbOnClickFunction: function(folderID, cbState) {}, //Non readonly checkbox on Click callback function
            cbOnClickSelFoldersFunction: function(selectedFolders, cbState) {}, //Non readonly selected folders on Click callback function, valid only for checkboxes and not radio buttons
            cbOnClickSelFoldersEFunction: function(selectedFolders, folderId, cbState) {}, //Non readonly selected folders on Click callback function, valid only for checkboxes and not radio buttons
            validateJSONFunction: function(folderJSON) {}, //For validating the received JSON response
            errorFunction: function(response, errorDesc, errorThrown) {}, //For handling the error thrown in JSON response
            cbFolderNodeFunction: function() {},
            checkRootFolderPermisssion: function(response) {},
            checkRootFolderAccess: function(response) {},
            loadComplete: function(response) {} //For invoking context menu after folder tree is loaded
        }, options);

        $.ft._folderHT = new vmf.data.Hashtable(); //Create a Hashtable to store folder associated with each folderId
        $.ft._selectedFolders = new vmf.data.Hashtable(); //Store selected folders
        $.ft._expandedFolders = new vmf.data.Hashtable(); //Store expanded folders
        $.ft._folderListJSON = null; //Store Folder List JSON
        $.ft._prevCheckedRadio = null;
        $.ft._currCheckedRadio = null;
        $.ft._findFolderIds = new Array(); //Array of found folder ids
        if ($.ft._fjqXHR == undefined) {
            $.ft._fjqXHR = null; //jqXHR object
        }
    };
})(jQuery);

vmf.foldertreeAnother = function($) {
    return {
        build: function(url, config) {
            config = config || {};
            //Comment the following
            //url = '/sample/ft_json10_new.json';
            if (url != undefined || url != "undefined") {
                config.url = url;
            }

            //Pass the config settings
            $.ft.foldertree(config);
            //Clear the Division for folder tree if a previous tree is populated already
            $('#' + config.uniqueDiv + ' .folderPane > ul').remove();
            $('#' + config.uniqueDiv + ' .folderPane > .emptyTree').remove();
            //request for JSON and render the tree
            $.ft.getFolderJSONPost(url, $.ft.opts.requestParams, $.ft.renderFolderPane, $.ft.opts.errorFunction, null);
        },
        reload: function(requestParams) {
            //Empty the existing tree and construct a new tree
            $('#' + $.ft.opts.uniqueDiv + ' .folderPane > ul').remove();
            $.ft.getFolderJSONPost($.ft.opts.url, requestParams, $.ft.renderFolderPane, $.ft.opts.errorFunction, null);
        },
        populate: function(uniqueDiv, folderListJSON) {
            $.ft.populateFolderUI(uniqueDiv, folderListJSON);
            myvmware.common.setAutoScrollWidth('div.folderPane ul');
            $.ft.attachEvents();
        },
        getFolderJSON: function() {
            if ($.ft._folderListJSON != undefined) return $.ft._folderListJSON;
        },
        getFolderHashtable: function() {
            if ($.ft._folderHT != undefined && !($.ft._folderHT.isEmpty())) return $.ft._folderHT;
        },
        getExpandedFolders: function() {
            return $.ft._expandedFolders;
        },
        getSelectedFolders: function() {
            return $.ft._selectedFolders;
        },
        findFolder: function(searchTerm) {
            return $.ft.findFolder(searchTerm);
        },
        preSelectFolder: function(folderId, scrollEnabled, selectEnabled) {
            return $.ft.expandAndSelectFolder(folderId, scrollEnabled, selectEnabled);
        },
        storePermission: function(folderId, permissionObj) {
            return $.ft.storePermission(folderId, permissionObj);
        },
        duplicateFolder: function(curParentFolderId, curFolderName) {
            return $.ft.duplicateFolder(curParentFolderId, curFolderName);
        },
        showURFolder: function(fId, fObj, invCB, selFlag) {
            return $.ft.showURFolder(fId, fObj, invCB, selFlag);
        }
    };
}(jQuery);
/* End Merger - code from managelicense_fp.js */
