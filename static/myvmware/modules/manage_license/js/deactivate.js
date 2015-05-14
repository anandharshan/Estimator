/* ########################################################################### *
/* ***** DOCUMENT INFO  ****************************************************** *
/* ########################################################################### *
 * ##### NAME:  deactivate.js
 * ##### VERSION: v0.1
 * ##### UPDATED: 04/24/2011
/* ########################################################################### */
vmf.ns.use("myvmware");
myvmware.deactivate = {
    prodGroupUrl: null,
    loadFolderDetailUrl: null,
    confirmDeactivatiourl: null,
    groupId: null,
    currentGroup: null,
    groupFlag: null,
	groupTotal: null,
	entTotal:null,
	totalFlag:null,
	licenseTitle:null,
	qtyTitle:null,
	deQtyTitle:null,
	oneToOneRatioFlag:null,
	baseQuantity:null,
	newUpgLicenseKey:null,
	upgdedQyt:null,
	upgFolderPath:null,
	keyUom:null,
	noAccessMsg:null,
	selectAllMsg:null,
    init: function () {},
    licenses: function (prodGrpUrl, loadFDUrl, cfmDeactUrl,title1,title2,title3,ratioMessage,ratioMessage2) {
        myvmware.deactivate.groupId = [];
        myvmware.deactivate.groupFlag = [];
		myvmware.deactivate.entTotal = [];
		myvmware.deactivate.groupTotal = [];
		myvmware.deactivate.oneToOneRatioFlag = true;
		myvmware.deactivate.baseQuantity=0;
		myvmware.deactivate.newUpgLicenseKey="";
		myvmware.deactivate.upgdedQyt = 0;
		myvmware.deactivate.upgFolderPath = "";
		myvmware.deactivate.keyUom = "";
		currentGroup = 0;
		totalFlag = false;
        prodGroupUrl = prodGrpUrl;
        confirmDeactivatiourl = cfmDeactUrl;
        loadFolderDetailUrl = loadFDUrl;
		licenseTitle = title1;
		qtyTitle = title2;
		deQtyTitle = title3;
		noAccessMsg = ratioMessage;
		selectAllMsg = ratioMessage2;
		$('#btn_confirm').attr('disabled', true);
		$('#deact_keymgmt :input').attr('disabled', false);
		$('section.bottomarea.withbottomMargin.clearBoth :input').attr('disabled', false);
        if ($('input[type=checkbox]#understand_warning').length > 0) {
            $('input[type=checkbox]#understand_warning').change(function () {
                if ($('input[type=checkbox]:checked').length > 0 && totalFlag) {
                    $('#btn_confirm').removeClass('disabled');
					$('#btn_confirm').attr('disabled', false);
                } else {
                    $('#btn_confirm').addClass('disabled');
					$('#btn_confirm').attr('disabled', true);
                }
            });
        }
        $('table.tbl_review_deact div.input_box').find('input[type=radio]').each(function () {
            var $rIn = $(this);
            if ($rIn.attr('checked')) {
                $rIn.parents('tr').addClass('selected');
				var _unitOfMeasureToBind =  $rIn.parent().next().find('.prod_metric').text();
				$("#prod_metrics_to_set").html(_unitOfMeasureToBind);				
                //added for populating the preselected alert details.
                var productGroupUrl = prodGroupUrl + '&selectedOrderNo=' + $rIn.val() + '&upgrdInvProdId=' + $rIn.attr('upgrdInvProdId');
				var _productNameToBind =  $rIn.parent().next().find('.pro_name').text();
				noAccessMsg = noAccessMsg.replace(/\{2\}/gi, _productNameToBind);
				selectAllMsg = selectAllMsg.replace(/\{2\}/gi, _productNameToBind);
				$("#groupLoading").show();
                vmf.ajax.post(productGroupUrl, null, myvmware.deactivate.onGroupSuccess, myvmware.deactivate.onGroupFail);
            }
            $rIn.click(function (e) {
                var rbc = e.target;
                $('table.tbl_review_deact div.input_box input[type=radio]').parents('tr').removeClass('selected');
                $(rbc).closest('tr').addClass('selected');
				var _productNameToBind =  $rIn.parent().next().find('.pro_name').text();
				noAccessMsg = noAccessMsg.replace(/\{2\}/gi, _productNameToBind);
				selectAllMsg = selectAllMsg.replace(/\{2\}/gi, _productNameToBind);
				$('#ratioMessage').hide();
				var _unitOfMeasureToBind =  $rIn.parent().next().find('.prod_metric').text();
				$("#prod_metrics_to_set").html(_unitOfMeasureToBind);
				$('.title_bigtext').html(_productNameToBind);
				$('div.scroll.nineSixPer.clearBoth.posrelative').addClass('disabled');
				$("#groupLoading").show();
				var productGroupUrl = prodGroupUrl + '&selectedOrderNo=' + $(rbc).val() + '&upgrdInvProdId=' + $(rbc).attr('upgrdInvProdId'); //Defect fixed Bug-00029338
                vmf.ajax.post(productGroupUrl, null, myvmware.deactivate.onGroupSuccess, myvmware.deactivate.onGroupFail);

            });
        });
        $('#btn_confirm').click(function () {
            var _deactiveQty = "";
            var tempStr = "";    
            var _totalDeactiveQty = 0;

            $('#ratioMessage2').hide();

            $('#groupTreeContainer').find('input').each(function () {
                if ($(this).val() != '' && $(this).val() != 0) {
                    _totalDeactiveQty = _totalDeactiveQty + parseInt($(this).val());
                    var tempArr = this.name.split("_");
                    tempStr = "";
                    for(var q=0;q<tempArr.length-1;q++)
                    {
                        tempStr += tempArr[q] + "_";
                    }
                    _deactiveQty = _deactiveQty + tempStr + $(this).val() + ',';
                }
            });
            
            //START CR-00067742
            
            if(!myvmware.deactivate.oneToOneRatioFlag && myvmware.deactivate.baseQuantity != _totalDeactiveQty){
				noAccessMsg = noAccessMsg.replace(/\{1\}/gi, myvmware.deactivate.baseQuantity + myvmware.deactivate.keyUom);
				selectAllMsg = selectAllMsg.replace(/\{1\}/gi, myvmware.deactivate.baseQuantity + myvmware.deactivate.keyUom);
				$('#ratioMsgError2').html(selectAllMsg);
				$('#ratioMessage2').show();
                $('#btn_confirm').attr('disabled', true);
                $('#btn_confirm').addClass('disabled');
            
			} else {
			
                $('#deact_keymgmt').addClass('disabled');
                $('#deact_keymgmt :input').attr('disabled', true);
                $('section.bottomarea.withbottomMargin.clearBoth').addClass('disabled');
                $('section.bottomarea.withbottomMargin.clearBoth :input').attr('disabled', true);
                $('#btn_confirm').attr('disabled', true);
                $('#btn_confirm').addClass('disabled');
            
                // make an ajax call here
                var deactivationUrlWithData = confirmDeactivatiourl + '&confirmDeactivationData=' + _deactiveQty;
                $("#deactivationPreviewMessageDiv").hide();
                $("#resultLoading").show();
                 vmf.ajax.post(deactivationUrlWithData, null, myvmware.deactivate.onDeactivationSuccess, myvmware.deactivate.onDeactivationFail);
            
           }
            //END CR-00067742        
    
		});

    },
    onGroupSuccess: function (data) {
    	try {
    	var _responseData = vmf.json.txtToObj(data);
        var _groupTree = "";
        var _groupLength = _responseData.deactivationGroupList.deactivationGroups.length;
		var _productConfig = _responseData.productConfig;
		if(_productConfig && _productConfig.relationshipCode != null && $.trim(_productConfig.relationshipCode) == "RESTRICTED_DOWNGRADE"){
			$("#relationshipCode").val('RESTRICTED_DOWNGRADE');
			//new changes
			if($.trim(_productConfig.productFamilyCode.toUpperCase()) == "VCLOUD".toUpperCase()){
			 	var _resEdnUpgrdAttnMsg = $("#hdnRestrictDeactiveAttentionMsg_11").val()+ "&nbsp;" + $.trim(_productConfig.primaryDescription);			
			  _resEdnUpgrdAttnMsg = _resEdnUpgrdAttnMsg + "&nbsp;" + $("#hdnRestrictDeactiveAttentionMsg_21").val();
			   $("#attentionMessage").html(_resEdnUpgrdAttnMsg);
			}else{
			var _resEdnUpgrdAttnMsg = $("#hdnRestrictDeactiveAttentionMsg_1").val();//+ "&nbsp;" + $.trim(_productConfig.primaryDescription);			
			_resEdnUpgrdAttnMsg = _resEdnUpgrdAttnMsg + "&nbsp;" + $("#hdnRestrictDeactiveAttentionMsg_2").val();
			$("#attentionMessage").html(_resEdnUpgrdAttnMsg);
			}
			var _resEdnUpgrdConfirmMsg = $("#hdnRestrictDeactiveConfirmMsg_1").val() + "&nbsp;" + $.trim(_productConfig.primaryDescription) + "&nbsp;"; 
			_resEdnUpgrdConfirmMsg = _resEdnUpgrdConfirmMsg + $("#hdnRestrictDeactiveConfirmMsg_2").val() + "&nbsp;" + $('input:radio[name=rads]:checked').attr('existProd');
			_resEdnUpgrdConfirmMsg = _resEdnUpgrdConfirmMsg + $("#hdnRestrictDeactiveConfirmMsg_3").val();
			$("#restrictedEditionUpgradeMsg").html(_resEdnUpgrdConfirmMsg);
		} else{
			$("#attentionMessage").html($("#hdnDeactivateAttentionMsg").val());
			$("#restrictedEditionUpgradeMsg").empty();
			$("#relationshipCode").val('');
		}
		
        if(_groupLength == 0)
        {
        	$('#errorDeactivation').replaceWith('<span id="errorDeactivation">'+ice.globalVars.noDataMsg+'</span>');
            vmf.modal.show("ErrorDeactivationPopup");
        	return false;
        }        
		var _count = 0;
		for (var i = 0; i < _groupLength; i++) {
			myvmware.deactivate.groupTotal[i] = _responseData.deactivationGroupList.deactivationGroups[i].quantityToDeactivate;
		}
		for (var i = 0; i < _groupLength; i++) {		
			_groupTree = _groupTree + '<div class="openclose_container" id="c_' + _responseData.deactivationGroupList.deactivationGroups[i].groupId + '"><div class="opneclose_head clearfix"><a class="open_close_img" id="' + _responseData.deactivationGroupList.deactivationGroups[i].groupId + '"></a><span class="grp_txt">Original Order : '+_responseData.deactivationGroupList.deactivationGroups[i].originalOrderNumber+' </span><span class="exp_span" style="display: block;"><a href="#" class="exp_all">'+ice.globalVars.expandTxt+'</a> | <a class="col_all" href="#">'+ice.globalVars.collapseTxt+'</a> </span></div><div class="openclose_tbl" id="folder' + i + '"></div><div id="folderLoading'+i+'" style="display:none;" class="loading"><span class="loading_small">'+ice.globalVars.loadingLbl+'</span></div></div>';
            myvmware.deactivate.groupId[i] = _responseData.deactivationGroupList.deactivationGroups[i].groupId;
			myvmware.deactivate.groupFlag[i] = true;
			_count += myvmware.deactivate.groupTotal[i];
        }
		$("#enterTotal").html("0");
		$("#groupTotal").html(_count);
		$("#groupTotal1").html(_count); // VSUS Change
        $("#groupTreeContainer").html(_groupTree);
        var $dM = $('#deact_keymgmt');
        // open close section by bala
        if ($dM.find('div.opneclose_head a.open_close_img').length > 0) {
            $dM.find('div.openclose_tbl,span.exp_span,table.tbl_deact_select tr.sub_row').hide();
            $dM.find('div.opneclose_head a.open_close_img').click(function () {
                $aLink = this;
                if ($($aLink).hasClass('open')) {
                    $($aLink).removeClass('open');
                    $($aLink).parent('div.opneclose_head').next('div.openclose_tbl').slideUp();
                    $($aLink).parent('div.opneclose_head').children('span.exp_span').hide();

                } else {
                    $($aLink).addClass('open');
                    $($aLink).parent('div.opneclose_head').next('div.openclose_tbl').slideDown("slow", function () {
                        $($aLink).parent('div.opneclose_head').children('span.exp_span').show();
                    });
                }
                for (var k = 0; k < _groupLength; k++) {
                    myvmware.deactivate.entTotal[k] = 0;
					if (myvmware.deactivate.groupId[k] == $aLink.id) {
                        currentGroup = k;
                    }
                }
                var loadFolderDetailForselectedUrl = loadFolderDetailUrl + '&selectedGroupId=' + $aLink.id;
                if (myvmware.deactivate.groupFlag[currentGroup]) {
                    $("#folderLoading"+currentGroup).show();
					vmf.ajax.post(loadFolderDetailForselectedUrl, null, myvmware.deactivate.onFolderLoadSuccess, myvmware.deactivate.onFolderLoadFail);
                    myvmware.deactivate.groupFlag[currentGroup] = false;
                }
            });
            /*if ($dM.find('.exp_all').length > 0) {
                $dM.find('.exp_all').click(function () {
                    $expLink = $(this);
                    console.log($expLink);
                    if ($expLink.hasClass('opened')) {
                        var $sTr = $($expLink.removeClass('opened').parents('div.opneclose_head').next('div.openclose_tbl').find('tr.sub_row'));
                        $expLink.html('').html('Expand All');
                        $sTr.prev().removeClass('noborder').find('.inneropenCloseSelect a').removeClass('open');
                        $sTr.hide('slow');
                    } else {
                        var $sTr = $($expLink.addClass('opened').parents('div.opneclose_head').next('div.openclose_tbl').find('tr.sub_row'));
                        $expLink.html('').html('Collapse All');
                        $sTr.prev().addClass('noborder').find('.inneropenCloseSelect a').addClass('open');
                        $sTr.show('slow');
                    }
                    return false;
                });
            }*/
			if($dM.find('.exp_all').length > 0){
				$dM.find('.exp_all,.col_all').click(function(){
					$expLink = $(this);
					if($expLink.hasClass('col_all')){
						var $pTr = $($expLink.parents('div.opneclose_head').next('div.openclose_tbl').find('tr.pro_name'));
						var $sTr = $($expLink.removeClass('opened').parents('div.opneclose_head').next('div.openclose_tbl').find('tr.sub_row'));
						$pTr.find('div.lic_details').each(function(){
							$det = this;
							$($det).find('table>tbody>tr:first').removeClass('noborder');
							$($det).parents('tr.sub_row').hide();
						});
						$sTr.prev().removeClass('noborder').find('.inneropenCloseSelect a').removeClass('open');
						$pTr.addClass('hidden').prev().removeClass('noborder').find('.inneropenCloseSelect a').removeClass('open');
						$sTr.hide('slow');
					}else{
						var $pTr = $($expLink.parents('div.opneclose_head').next('div.openclose_tbl').find('tr.pro_name'));
						var $sTr = $($expLink.addClass('opened').parents('div.opneclose_head').next('div.openclose_tbl').find('tr.sub_row'));
						$pTr.find('div.lic_details').each(function(){
							$det = this;
							$($det).find('table>tbody>tr:first').addClass('noborder');
							$($det).parents('tr.sub_row').show();
						});
						$pTr.removeClass('hidden').prev().addClass('noborder').find('.inneropenCloseSelect a').addClass('open');
						$sTr.prev().addClass('noborder').find('.inneropenCloseSelect a').addClass('open');
						$sTr.show('slow');
					}
					return false;
				});
			}
        }
		$("#groupLoading").hide();
		$('div.scroll.nineSixPer.clearBoth.posrelative').removeClass('disabled');
    	}
    	catch (e) {
			$("#groupLoading").hide();
			$('div.scroll.nineSixPer.clearBoth.posrelative').removeClass('disabled');
    		$('#errorDeactivation').replaceWith('<span id="errorDeactivation">'+ice.globalVars.processErrorMsg+'</span>');
            vmf.modal.show("ErrorDeactivationPopup");
    	}

    },
    onGroupFail: function (data) {
        $("#groupLoading").hide();
        $('#errorDeactivation').replaceWith('<span id="errorDeactivation">'+ice.globalVars.processErrorMsg+'</span>');
        vmf.modal.show("ErrorDeactivationPopup");
    },
    onFolderLoadSuccess: function (data) {
        $("#folderLoading"+currentGroup).hide();
		try {
        var _folderTree = "";
        var _responseData = vmf.json.txtToObj(data);
        var _folderLength = _responseData.folderKeyDetails.length;
        if(_folderLength == 0)
        {
        	$('#errorDeactivation').replaceWith('<span id="errorDeactivation">'+ice.globalVars.noDataMsg+'</span>');
            vmf.modal.show("ErrorDeactivationPopup");
        	return false;
        } 
		//START CR-00067742
		if (typeof _responseData.oneToOneRatio != "undefined"){
			myvmware.deactivate.oneToOneRatioFlag = _responseData.oneToOneRatio;
		}
		if (typeof _responseData.baseQuantity != "undefined"){
			myvmware.deactivate.baseQuantity = _responseData.baseQuantity;
		}
		
		myvmware.deactivate.newUpgLicenseKey= _responseData.newUpgLicenseKey;
		myvmware.deactivate.upgdedQyt = _responseData.upgdedQuantity;
		myvmware.deactivate.upgFolderPath = _responseData.folderPath;
		myvmware.deactivate.keyUom = _responseData.keyUom;
		
		if(!myvmware.deactivate.oneToOneRatioFlag){
			if(_responseData.baseQuantity > _responseData.totalQuantity){
				noAccessMsg = noAccessMsg.replace(/\{1\}/gi, myvmware.deactivate.baseQuantity + myvmware.deactivate.keyUom);
				selectAllMsg = selectAllMsg.replace(/\{1\}/gi, myvmware.deactivate.baseQuantity + myvmware.deactivate.keyUom);
				$('#ratioMsgError').html(noAccessMsg);
				$('#ratioMessage').show();
				return false;
			}
		}
		//END CR-00067742
        _folderTree = '<table class="dt tbl_deact_select"><thead class="sort_th"><tr><th class="pad_left wdtwoNineZero sorting_desc"><span class="descending">'+licenseTitle+'</span></th><th class="sorting_desc"><span class="descending">'+qtyTitle+'</span></th><th class="no_cursor"><span class="">'+deQtyTitle+'</span></th></tr></thead><tbody>';
        for (var i = 0; i < _folderLength; i++) {
			if (i == 0)
			{
			_folderTree = _folderTree + '<tr class="row_head"><td class="group" colspan="3"><div class="inneropenCloseSelect wdTwoZero"><a href="#" class="openClose"></a></div><div class="key grey_text">' + _responseData.folderKeyDetails[i].fullFolderPath + '</div></td></tr>';
			}
			else
			{
			_folderTree = _folderTree + '<tr class="row_head"><td class="group" colspan="3"><div class="inneropenCloseSelect wdTwoZero"><a href="#" class="openClose"></a></div><div class="key grey_text">' + _responseData.folderKeyDetails[i].fullFolderPath + '</div></td></tr>';			
			}
			var _prodLength = _responseData.folderKeyDetails[i].productGroupKeyDetails.length;
			for (var k = 0; k < _prodLength; k++) {			
			_folderTree = _folderTree + '<tr class="pro_name hidden"><td colspan="3" class="pro_group"><table class="pro_group_tbl"><tbody><tr class="pro_head"><td colspan="3"><div class="inneropenCloseSelect"><a class="openClose lic_show" href="#"></a></div><div class="key grey_text">'+_responseData.folderKeyDetails[i].productGroupKeyDetails[k].productName+'</div></td></tr><tr class="sub_row" style="display: table-row;"><td class="sub_row_td" colspan="3"><div class="lic_details"><table class="tbl_row_sort"><thead style="display:none;"><tr><th>'+ice.globalVars.folderLbl+'</th><th>Metrics</th><th>'+ice.globalVars.deactivateQty+'</th></tr></thead><tbody>';
            var _keyLength = _responseData.folderKeyDetails[i].productGroupKeyDetails[k].keyDetails.length;
            for (var j = 0; j < _keyLength; j++) {				
				 if (j == 0)
				 {
					_folderTree = _folderTree + '<tr><td class="key">' + _responseData.folderKeyDetails[i].productGroupKeyDetails[k].keyDetails[j].licenseKey + '</td><td class="cpu">' + _responseData.folderKeyDetails[i].productGroupKeyDetails[k].keyDetails[j].quantity +' '+_responseData.folderKeyDetails[i].productGroupKeyDetails[k].keyDetails[j].unitOfMeasure+'</td><td class="inpu"><input type="text" name="' + _responseData.folderKeyDetails[i].productGroupKeyDetails[k].keyDetails[j].entitlementId + '_' + _responseData.folderKeyDetails[i].folderId + '_' + _responseData.folderKeyDetails[i].productGroupKeyDetails[k].keyDetails[j].licenseKeyId + '_' + _responseData.folderKeyDetails[i].productGroupKeyDetails[k].keyDetails[j].productId + '_' +currentGroup+'" size="2" value="0" class="text_right"/></td></tr>';
				 }
				 else
				 {
					_folderTree = _folderTree + '<tr><td class="key">' + _responseData.folderKeyDetails[i].productGroupKeyDetails[k].keyDetails[j].licenseKey + '</td><td class="cpu">' + _responseData.folderKeyDetails[i].productGroupKeyDetails[k].keyDetails[j].quantity + ' '+_responseData.folderKeyDetails[i].productGroupKeyDetails[k].keyDetails[j].unitOfMeasure+'</td><td class="inpu"><input type="text" name="' + _responseData.folderKeyDetails[i].productGroupKeyDetails[k].keyDetails[j].entitlementId + '_' + _responseData.folderKeyDetails[i].folderId + '_' + _responseData.folderKeyDetails[i].productGroupKeyDetails[k].keyDetails[j].licenseKeyId + '_' + _responseData.folderKeyDetails[i].productGroupKeyDetails[k].keyDetails[j].productId + '_' +currentGroup+'" size="2" value="0" class="text_right"/></td></tr>';
				 }
            }
            _folderTree = _folderTree + '</tbody></table></div></td></tr></tbody></table></td></tr>';
			}
        }
        _folderTree = _folderTree + '</tbody></table><div class="grey_box nobgcol clearfix"><span class="label_txt">'+ice.globalVars.numberOfLicenseMsg+'</span><span class="numbers"><span class="red_txt" id="folderTotal_'+currentGroup+'">0</span> of '+myvmware.deactivate.groupTotal[currentGroup]+'</span> </div>';
        $('#groupTreeContainer').find('#folder' + currentGroup).html(_folderTree);
        var $dM = $('#c_' + myvmware.deactivate.groupId[currentGroup]);
       
	   if ($dM.find('table.tbl_deact_select .inneropenCloseSelect a').length > 0) {
            $dM.find('table.tbl_deact_select tr.sub_row').hide();
			$dM.find('table.tbl_deact_select .inneropenCloseSelect a').click(function(e){
				$oLink = $(this);
				if($(e.target).hasClass('lic_show')){
					if($oLink.hasClass('open')){
						$oLink.removeClass('open').closest('tr.pro_head').removeClass('noborder').next('tr.sub_row').hide(function(){
							$(this).find('table.tbl_row_sort>tbody>tr:first').removeClass('noborder');	
						});
					}else{
						$oLink.addClass('open').closest('tr.pro_head').addClass('noborder').next('tr.sub_row').show(function(){
							$(this).find('table.tbl_row_sort>tbody>tr:first').addClass('noborder');	
						});
					}
				}else{
					if($oLink.hasClass('open')){
						$oLink.removeClass('open').closest('tr.row_head').removeClass('noborder').nextUntil('tr.row_head').addClass('hidden').hide('slow');
					}else{
						$oLink.addClass('open').closest('tr.row_head').addClass('noborder').nextUntil('tr.row_head').removeClass('hidden').show('slow');
					}
				}
				e.preventDefault();
			});	                       
			$('#folder'+currentGroup).find('input:text').blur(function () {
				var isNumber = /^-{0,1}\d*\.{0,1}\d+$/;				
				var entId = this.name.split("_");
				var temp = entId[4];
				var crrTotal = 0;
				myvmware.deactivate.entTotal[temp] = 0;
				var count1 = 0;
				var count2 = 0;
				var errFlag = false;
				totalFlag = false;
				$('#ratioMessage2').hide();
				$('#folder'+temp).find('input:text').each(function() {
					var totQty = $(this).parent("td").prev().html();
					var strLen = totQty.length;					
					totQty = totQty.slice(0,strLen-5);
					$(this).parent("td").find("div").remove();
					$(this).parent("td").find("sup").remove();
					if (isNumber.test($(this).val())) {
						myvmware.deactivate.entTotal[temp] += parseInt($(this).val());
					}
					else {
						if($(this).val() != "") {
							$(this).parent("td").append('<sup style="color:red;font-size:14px;"> *</sup><div style="color:red;clear:both;">'+ice.globalVars.invalidValuesMsg+'</div>');
							errFlag = true;
							}
					}
					if ($(this).val() < 0) {
						$(this).parent("td").append('<sup style="color:red;font-size:14px;"> *</sup><div style="color:red;clear:both;">'+ice.globalVars.noMinusValueMsg+'</div>');
						errFlag = true;
					}
					if ($(this).val() > parseInt(totQty)) {
						$(this).parent("td").append('<sup style="color:red;font-size:14px;"> *</sup><div style="color:red;clear:both;">'+ice.globalVars.noGreaterThanTotalMsg+'</div>');
						errFlag = true;
					}
				});
				$("#folderTotal_"+temp).html(myvmware.deactivate.entTotal[temp]);
				for(var y=0;y<myvmware.deactivate.entTotal.length;y++)
				{
					if(!isNaN(parseInt($("#folderTotal_"+y).html())))
					crrTotal += parseInt($("#folderTotal_"+y).html());
					if (parseInt($("#folderTotal_"+y).html()) == parseInt(myvmware.deactivate.groupTotal[y])) {
						count1 += 1;
					}
					if (parseInt($("#folderTotal_"+y).html()) > parseInt(myvmware.deactivate.groupTotal[y])) {
						count2 += 1;
					}
				}
				$("#enterTotal").html(crrTotal);
				if (count2 > 0)
				{
					$(this).parent("td").find("div").remove();
					$(this).parent("td").find("sup").remove();
					$(this).parent("td").append('<sup style="color:red;font-size:14px;"> *</sup><div style="color:red;clear:both;">'+ice.globalVars.noGreaterThanTotalMsg+'</div>');
					errFlag = true;
				}	
				if(!errFlag && parseInt($("#enterTotal").html()) > 0 && parseInt($("#enterTotal").html()) <= parseInt($("#groupTotal").html()))
				{
					totalFlag = true;
					if ($('input[type=checkbox]:checked').length > 0) {
						$('#btn_confirm').removeClass('disabled');
						$('#btn_confirm').attr('disabled', false);
					} else {
						$('#btn_confirm').addClass('disabled');
						$('#btn_confirm').attr('disabled', true);
					}
				}
				else {
					$('#btn_confirm').addClass('disabled');
					$('#btn_confirm').attr('disabled', true);
				}
				
			});	
        }
		}
		catch (e) {
			$('#errorDeactivation').replaceWith('<span id="errorDeactivation">'+ice.globalVars.processErrorMsg+'</span>');
            vmf.modal.show("ErrorDeactivationPopup");
		}
    },
    onFolderLoadFail: function (data) {
        $("#folderLoading"+currentGroup).hide();
        $('#errorDeactivation').replaceWith('<span id="errorDeactivation">'+ice.globalVars.processErrorMsg+'</span>');
        vmf.modal.show("ErrorDeactivationPopup");
    },
    onDeactivationSuccess: function (data) {
        
		try {
    	var _responseData = vmf.json.txtToObj(data);
        var _deactivateLength = _responseData.deacivatedKeyDetails.keyDetails.length;
        var _generateLength = _responseData.generatedKeyDetails.keyDetails.length;
        var _pendingLength = _responseData.pendingProductKeyDetails.productKeyDetail.length;		
        var _licenseTxt = "";
        var _productTxt = "";
        $("#resultLoading").hide();        
        $("#generatedKeyDiv").show();
        _productTxt = _responseData.generatedKeyDetails.productName + ':';
        if(_generateLength >  0){
			$("#generatedKeyProduct").html(_productTxt);
		}
        for (var i = 0; i < _deactivateLength; i++) {

            _licenseTxt += '<li><span class="key_list_number">' + _responseData.deacivatedKeyDetails.keyDetails[i].licenseKey + '</span><span class="key_list_qty">' + _responseData.deacivatedKeyDetails.keyDetails[i].quantity + ' '+_responseData.deacivatedKeyDetails.keyDetails[i].unitOfMeasure+'</span></li>';
        }
        $("#deacivatedKeyDetails").html(_licenseTxt);
        _licenseTxt = "";
        
		if(!myvmware.deactivate.oneToOneRatioFlag){
			_licenseTxt += '<li><span class="badge new">'+ice.globalVars.newTxt+'</span><span class="key_list_number">' + myvmware.deactivate.newUpgLicenseKey + '</span><span class="key_list_qty">' + myvmware.deactivate.upgdedQyt + ' '+myvmware.deactivate.keyUom+'</span><span class="key_list_folderspan">' + myvmware.deactivate.upgFolderPath + '</span></li>';
		}else{
			for (var i = 0; i < _generateLength; i++) {
            _licenseTxt += '<li><span class="badge new">'+ice.globalVars.newTxt+'</span><span class="key_list_number">' + _responseData.generatedKeyDetails.keyDetails[i].licenseKey + '</span><span class="key_list_qty">' + _responseData.generatedKeyDetails.keyDetails[i].quantity + ' '+_responseData.generatedKeyDetails.keyDetails[i].unitOfMeasure+'</span><span class="key_list_folderspan">' + _responseData.generatedKeyDetails.keyDetails[i].fullFolderPath + '</span></li>';
			}
		}
		
        if(_generateLength >  0){
			$("#generatedKeyDetails").html(_licenseTxt);
		}else{
			if(!myvmware.deactivate.oneToOneRatioFlag) {
				$("#generatedKeyProduct").html(_productTxt);
				$("#generatedKeyDetails").html(_licenseTxt);
			}
		}
		
        _licenseTxt = "";
        for (var i = 0; i < _pendingLength; i++) {
			_licenseTxt += '<div class="key_list_proname">'+_responseData.pendingProductKeyDetails.productKeyDetail[i].productName + ':<span class="info">'+ice.globalVars.canNotUpgradeMsg+'</span></div>';			
			var _pendingKeyLength = _responseData.pendingProductKeyDetails.productKeyDetail[i].keyDetails.length;
			for(var j=0; j < _pendingKeyLength; j++)
			{
			_licenseTxt += '<ul class="key_list_content"><li><span class="badge new">'+ice.globalVars.newTxt+'</span><span class="key_list_number">' + _responseData.pendingProductKeyDetails.productKeyDetail[i].keyDetails[j].licenseKey + '</span><span class="key_list_qty">' + _responseData.pendingProductKeyDetails.productKeyDetail[i].keyDetails[j].quantity + ' '+_responseData.pendingProductKeyDetails.productKeyDetail[i].keyDetails[j].unitOfMeasure+'</span><span class="key_list_folderspan">' + _responseData.pendingProductKeyDetails.productKeyDetail[i].keyDetails[j].fullFolderPath + '</span></li></ul>';
			}
        }
		$("#pendingProducts").html(_licenseTxt);
        }
        catch (e) {
			$("#resultLoading").hide();
			$("#deactivationPreviewMessageDiv").show();
			$('#deact_keymgmt').removeClass('disabled');
			$('#deact_keymgmt:input').attr('disabled', false);
			$('section.bottomarea.withbottomMargin.clearBoth').removeClass('disabled');
			$('section.bottomarea.withbottomMargin.clearBoth :input').attr('disabled', false);
			$('#btn_confirm').attr('disabled', false);
			$('#btn_confirm').removeClass('disabled');
        	$('#errorDeactivation').replaceWith('<span id="errorDeactivation">'+ice.globalVars.processErrorMsg+'</span>');
            vmf.modal.show("ErrorDeactivationPopup");
        }
    },
    onDeactivationFail: function (data) {
        $("#resultLoading").hide();
		$("#deactivationPreviewMessageDiv").show();
		$('#deact_keymgmt').removeClass('disabled');
		$('#deact_keymgmt:input').attr('disabled', false);
		$('section.bottomarea.withbottomMargin.clearBoth').removeClass('disabled');
		$('section.bottomarea.withbottomMargin.clearBoth :input').attr('disabled', false);
		$('#btn_confirm').attr('disabled', false);
		$('#btn_confirm').removeClass('disabled');
		$('#errorDeactivation').replaceWith('<span id="errorDeactivation">'+ice.globalVars.processErrorMsg+'</span>');
        vmf.modal.show("ErrorDeactivationPopup");
    }
}