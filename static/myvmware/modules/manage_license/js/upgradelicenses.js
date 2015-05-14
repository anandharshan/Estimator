vmf.ns.use("mywmware");
VMFModuleLoader.loadModule("resize", function() {});
mywmware.upgradelicenses = {
	confirmUpgradeLicUrl:null,
	aa:[],
	confirmFlag:null,
    init: function(upLicUrl,confUpLicUrl) {
		vmf.scEvent = true;
		callBack.addsc({'f':'riaLinkmy','args':['my-licenses : upgrade']});
		mywmware.upgradelicenses.adjustHt();
		confirmUpgradeLicUrl = confUpLicUrl;
		$('#loading').show();
		$('#btn_confirm').attr('disabled', true);
		vmf.ajax.post(upLicUrl, null, mywmware.upgradelicenses.onSuccess,mywmware.upgradelicenses.onFail);
		if($('input[type=checkbox]#understand_warning').length > 0){
			$('input[type=checkbox]#understand_warning').change(function(){
				if ($('input[type=checkbox]:checked').length)
				{
					$('#btn_confirm').removeClass('disabled');
					$('#btn_confirm').attr('disabled', false);
					
				}
				else
				{
					$('#btn_confirm').addClass('disabled');
					$('#btn_confirm').attr('disabled', true);
				}

			});
		}
		$('#btn_confirm').click(function() {
			mywmware.upgradelicenses.confirmUpgrade();
		});	
		/*Resizing Panes CR Start*/
		vmf.splitter.show('mySplitter',{
			type: "v",
			sizeLeft:parseInt($("#leftpane").width(),10),
			resizeToWidth: true,
			outline:true,
			minLeft:parseInt($("#leftpane").width()*.8,10),
			maxLeft:parseInt(($("#leftpane").width() + ($("#newLicenses").width()*.2)),10),
			barWidth:false
		});
		/*Resizing Panes CR End*/
    },
	confirmUpgrade: function() {
		var isnumber = /^-{0,1}\d*\.{0,1}\d+$/;
		var count = 0;
		var licForUpgrade = "&licForUpgrade=";
		confirmFlag = true;
		$("#tbl_upgradelic tbody tr").each(function () {
			$(this).find("td:eq(2)").find("div").remove();
			var enteredQty	=	$(this).find("td:eq(2) input:text").val();
			var availQty	=	parseInt($(this).find("td:eq(2) span:eq(1)").text());
			if (!isnumber.test(enteredQty))
			{
				$(this).find("td:eq(2)").append('<div style="color:#d9541e;padding-top:2px;">'+ice.globalVars.invalidValuesMsg+'</div>');
				confirmFlag = false;
			}
			else if (enteredQty <= 0)
			{
				$(this).find("td:eq(2)").append('<div style="color:#d9541e;padding-top:2px;">'+ice.globalVars.enterOneOrMoreMsg+'</div>');
				confirmFlag = false;
			}
			else if (enteredQty > availQty)
			{
				$(this).find("td:eq(2)").append('<div style="color:#d9541e;padding-top:2px;">'+ice.globalVars.valueMustBeEqualMsg+'</div>');
				confirmFlag = false;
			}
			else
			{
				licForUpgrade = licForUpgrade + $(this).find("td:eq(0) span:eq(0)").text() + ':' + enteredQty + ',';
			}
			
		});
		if (confirmFlag)
		{
			var strLen = licForUpgrade.length;
			licForUpgrade = licForUpgrade.slice(0,strLen-1);
			confirmUpgradeLicUrl = confirmUpgradeLicUrl+licForUpgrade+"&productInventoryId="+$('#upgrade_server_name').val()+"&productName="+$("#upgrade_server_name option:selected").text();
			$('section.column.sixZeroZero.tall').addClass('disabled');
			$('#content_1 :input').attr('disabled', true);
			$('#btn_confirm').attr('disabled', true);
			vmf.ajax.post(confirmUpgradeLicUrl, null, mywmware.upgradelicenses.onUpgradeSuccess,mywmware.upgradelicenses.onUpgradeFail);
			$('#upgradePreviewMessage').hide();
			$('#upgradeLoading').show();
		}
	},
	onSuccess: function(data) {
				if($('#tbl_upgradelic').length>0){
					var _jsonResponse = vmf.json.txtToObj(data);
					var _loadData = _jsonResponse.aaData;
					var _len = _loadData.length;
					for(var i=0;i<_len;i++){
						mywmware.upgradelicenses.aa[i] = [];
						mywmware.upgradelicenses.aa[i][0] = '<span class="textBlack" id="key_'+i+'">'+_loadData[i][0] +'</span><br /><span class="textGrey">'+_loadData[i][1]+'</span>';
						mywmware.upgradelicenses.aa[i][1] = '<span>'+_loadData[i][2]+' '+_loadData[i][3]+'</span>';
						mywmware.upgradelicenses.aa[i][2] = '<input type="text" value="0" size="2" id="qty_'+i+'" class="text_right"><span> / </span><span id="max_'+i+'">'+_loadData[i][4]+'</span> <span>'+_loadData[i][3]+'</span/';
					};
					$('#tbl_upgradelic').dataTable( {
						"bPaginate": false,
						"bFilter":false,
						"sDom": 't',
						"bAutoWidth": false,
						"aoColumns": [{"sWidth":"240px"},{"sWidth":"105px","bSortable": false},{"sWidth":"135px","bSortable": false}],
						"aoColumnDefs": [ 
							{ "sClass": "with_input", "aTargets": [ 2 ] }
						],
						"aaData": mywmware.upgradelicenses.aa,
						"fnInitComplete": function () {
							$('#tbl_upgradelic input:text').click(function() {
								if(this.value==0)
									this.value = '';
							});
							$('#tbl_upgradelic input:text').blur(function() {
								$(this).parent("td").find("div").remove();
								if(this.value=='')
									this.value = 0;
							});
							$('#loading').hide();
						}
					});		
				}
	},
	onFail: function() {
		alert("error");
	},
	onUpgradeSuccess: function(data) {
		var _baseFlag = true;
		var _deactivateLength = 0;
		var _targetLength = 0;
		var _baseLength = 0;
		$('#upgradeLoading').hide();
		$('#upgradeText').show();
		try {
		var _responseData = vmf.json.txtToObj(data);
		_deactivateLength = _responseData.deactivatedLicenses.length;
		
		try {
		_baseLength = _responseData.baseProductDetails.baseProductLicenses.length;
		} catch(e) {
			_baseFlag = false;
		}
		var _licenseTxt = "";
		var _productTxt = "";
		_productTxt = _responseData.targetProductDetails.targetProduct;
		if($("#suiteProductName").length && $("#relationshipCode").length && $('#relationshipCode').val() == 'RESTRICTED_UPGRADE'){
			$("#suiteProductName").html($("#upgrade_server_name option:selected").text());
		}
		// Changes for SFF-R3, since displaying target product at each row level. 
		//$("#targetProduct").html(_productTxt);
		if(_baseFlag){
			_productTxt = _responseData.baseProductDetails.baseProduct;
			if($("#relationshipCode").length && $('#relationshipCode').val() == 'RESTRICTED_UPGRADE'){
				$('#restrictedPartialUpgradeRemainingKeys').show();
			} else {
				_productTxt = _productTxt + ':<span class="info">'+ice.globalVars.canNotUpgradeMsg+'</span>';
			}
			$("#baseProduct").html(_productTxt);
		}
		var _deactivatedLicenseUnitOfMeasure='';
		for(var i=0;i<_deactivateLength;i++)
		{
		_deactivatedLicenseUnitOfMeasure = _responseData.deactivatedLicenses[i][2];
		_licenseTxt = _licenseTxt + '<li><span class="key_list_number">'+_responseData.deactivatedLicenses[i][0]+'</span><span class="key_list_qty">'+_responseData.deactivatedLicenses[i][1]+' '+_responseData.deactivatedLicenses[i][2]+'</span></li>';
		}
		
		if($("#restrictedProductDetails").length && $("#relationshipCode").length && $('#relationshipCode').val() == 'RESTRICTED_UPGRADE'){
			var _restrictedProduct = '<li><span class="key_list_qty">' + _responseData.restrictedProductUpgrade.totalUpgradeDowngradeQuantity + ' ' + _deactivatedLicenseUnitOfMeasure + '</span><span class="key_list_number" style="display:inline;"> of ' + _responseData.restrictedProductUpgrade.actualRestrictedUpgradedProduct + '</span></li>';
			$("#restrictedProductDetails").html(_restrictedProduct);
		}
		
		$("#deacivatedKeyDetails").html(_licenseTxt);
		_licenseTxt = "";
		var _targetProductLicensesLength=_responseData.targetProductDetails.length;
		for(var i=_targetProductLicensesLength-1;i>=0;i--)
		{
			_licenseTxt = _licenseTxt + '<li><span class="target_product_name">'+_responseData.targetProductDetails[i].targetProduct+'</span></li>';
		_targetLength = _responseData.targetProductDetails[i].targetProductLicenses.length;	
		for(var j=0;j<_targetLength;j++)
		{
		_licenseTxt = _licenseTxt + '<li><span class="key_list_number">'+_responseData.targetProductDetails[i].targetProductLicenses[j][0]+'</span><span class="key_list_qty">'+_responseData.targetProductDetails[i].targetProductLicenses[j][1]+' '+_responseData.targetProductDetails[i].targetProductLicenses[j][2]+'</span><span class="badge new">'+ice.globalVars.newTxt+'</span></li>';
		}
		}
		$("#targetKeyDetails").html(_licenseTxt);
		_licenseTxt = "";		
		$('#tbl_upgradelic').find('span[id^="key_"]').each(function(){
			var lic_str = $(this).text();
			var newlic_str = myvmware.common.maskLicenseKey(lic_str);
		   $(this).text(newlic_str);
		})	
		if(_baseFlag) {
			for(var i=0;i<_baseLength;i++)
			{
			_licenseTxt = _licenseTxt + '<li><span class="key_list_number">'+_responseData.baseProductDetails.baseProductLicenses[i][0]+'</span><span class="key_list_qty">'+_responseData.baseProductDetails.baseProductLicenses[i][1]+' '+_responseData.baseProductDetails.baseProductLicenses[i][2]+'</span><span class="badge new">'+ice.globalVars.newTxt+'</span></li>';
			}
			$("#baseKeyDetails").html(_licenseTxt);	
		}
		}catch(e) {
			$('#upgradeLoading').hide();
			$('#newLicenses > div.scroll.nineSevenPer.clearBoth').html('<div style="color:red;text-align:center;margin-top:20px;">'+ice.globalVars.noDataReturnMsg+'</div>');			
		}
	},
	onUpgradeFail: function(data) {
		var _responseData = vmf.json.txtToObj(data);
		if(_responseData.error)
			$('#newLicenses > div.scroll.nineSevenPer.clearBoth').html('<div style="color:red;text-align:center;margin-top:20px;">'+_responseData.message+'</div>');
		$('#upgradeLoading').hide();					
		$('section.column.sixZeroZero.tall').removeClass('disabled');
		$("#content_1 :input").removeAttr("disabled");
		$('#btn_confirm').attr('disabled', false);
	},
	adjustHt: function(){
		myvmware.common.adjustPanes();
		var cHeight = ($("#content-section").height() > parseInt($("#content-section").css("min-height")))? parseInt($("#content-section").css("min-height")) : $("#content-section").height();
		var tabArea = $("#content_1").height()+(cHeight-$("#lkstep2").height());
		tabArea = (tabArea>495)? tabArea: 495;
		$("#mySplitter, section.column").height(tabArea+"px");
		var folderHeight = tabArea - $("section.column header").height();
		$("section.column .scroll, .splitter-bar-vertical").height(folderHeight+"px");
	}
}
window.onresize=mywmware.upgradelicenses.adjustHt;