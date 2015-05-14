/* ########################################################################### *
/* ***** DOCUMENT INFO  ****************************************************** *
/* ########################################################################### *
 * ##### NAME:  downgradelicenses.js
 * ##### VERSION: v0.1
 * ##### UPDATED: 04/24/2011
/* ########################################################################### */
vmf.ns.use("mywmware");
VMFModuleLoader.loadModule("resize", function() {});
mywmware.downgradelicenses = {
	confirmDownLicUrl: null,
	aa:[],
	confirmFlag:null,
	preDowngradeVI3OrdersUrl:null,
	keyForVI3:null,
    init: function(downLicUrl, dConfUrl, vi3Url) {	    
		vmf.scEvent = true;
		callBack.addsc({'f':'riaLinkmy','args':['my-licenses : downgrade']});
		mywmware.downgradelicenses.adjustHt();
		confirmDownLicUrl = dConfUrl;
		preDowngradeVI3OrdersUrl = vi3Url;
		$('#loading').show();
		$('#btn_confirm').attr('disabled', true);
		vmf.ajax.post(downLicUrl, null, mywmware.downgradelicenses.onSuccess,mywmware.downgradelicenses.onFail);
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
			mywmware.downgradelicenses.confirmDowngrade();
		});
		/*Resizing Panes CR Start*/
		vmf.splitter.show('mySplitter',{
			type: "v",
			sizeLeft:parseInt($("#licenses").width(),10),
			resizeToWidth: true,
			outline:true,
			minLeft:parseInt($("#licenses").width()*.8,10),
			maxLeft:parseInt(($("#licenses").width() + ($("#newLicenses").width()*.2)),10),
			barWidth:false
		});
		/*Resizing Panes CR End*/	
},
confirmDowngrade: function() {
			var isnumber = /^-{0,1}\d*\.{0,1}\d+$/;
		//var count = 0;
		var licForDowngrade = "&licForDowngrade=";
		confirmFlag = true;
		$("#tbl_downgradelic input:text").each(function () {
			$(this).parent("td").find("div").remove();
			var qtylen = $(this).attr('id').length;
			var maxId = $(this).attr('id').substring(4,qtylen);
			if (!isnumber.test($(this).val())) 
			{
				$(this).parent("td").append('<div style="color:#d9541e;padding-top:2px;">'+ice.globalVars.invalidValuesMsg+'</div>');
				confirmFlag = false;
			}
			else if ($(this).val() <= 0)
			{
				$(this).parent("td").append('<div style="color:#d9541e;padding-top:2px;">'+ice.globalVars.enterOneOrMoreMsg+'</div>');
				confirmFlag = false;
			}
			else if ($(this).val() > parseInt($('#max_'+maxId).html()))
			{
				$(this).parent("td").append('<div style="color:#d9541e;padding-top:2px;">'+ice.globalVars.enterEqualOrLessMsg+'</div>');
				confirmFlag = false;
			}
			else
			{
				licForDowngrade = licForDowngrade + $('#key_'+maxId).html() + ':' + $(this).val() + ',';
			}
			//count++;
		});
		if (confirmFlag)
		{
			var strLen = licForDowngrade.length;
			licForDowngrade = licForDowngrade.slice(0,strLen-1);
			confirmDownLicUrl = confirmDownLicUrl+licForDowngrade+"&productInventoryId="+$('#downgrade_server_name').val()+"&productName="+$("#downgrade_server_name option:selected").text();
			$('section.column.sixZeroZero.tall > div.scroll').addClass('disabled');
			$('#content_1 div.buttons a').click(function(e) { e.preventDefault(); });
			$('#content_1 :input').attr('disabled', true);
			$('#btn_confirm').attr('disabled', true);
			$('#btn_confirm').addClass('disabled');
			vmf.ajax.post(confirmDownLicUrl, null, mywmware.downgradelicenses.onDowngradeSuccess,mywmware.downgradelicenses.onDowngradeFail);
			$('#downgradePreviewMessage').hide();
			$('#downgradeLoading').show();
		}
},
onSuccess: function(data) {
		if($('#tbl_downgradelic').length >0){
				var _jsonResponse = vmf.json.txtToObj(data);
                var _lData = _jsonResponse.aaData;
				var len = _lData.length;
				keyForVI3 = _lData[0][0];	
				for(var i=0;i<len;i++){
					 mywmware.downgradelicenses.aa[i] = [];
					 mywmware.downgradelicenses.aa[i][0] = '<span class="textBlack" id="key_'+i+'">'+_lData[i][0] +'</span><br /><span class="textGrey">\\\\'+_lData[i][1]+'</span>';
					 mywmware.downgradelicenses.aa[i][1] = '<input type="text" value="0" size="2" id="qty_'+i+'" class="text_right"><span> / </span><span id="max_'+i+'">'+  _lData[i][2] +'</span> <span>'+_lData[i][3]+'</span/';
				};							
				$('#tbl_downgradelic').dataTable( {
						"bPaginate": false,
						"bFilter":false,
						"sDom": 't',
						"bAutoWidth": false,
						"aoColumns": [{"sWidth":"350px"},{"sWidth":"auto"}],
						"aoColumnDefs": [ 
							{ "sClass": "with_input", "aTargets": [ 1 ] }
						],
						"aaData": mywmware.downgradelicenses.aa,
						"fnInitComplete": function () {
							$('#tbl_downgradelic input:text').click(function() {
								if(this.value==0)
									this.value = '';
							});
							$('#tbl_downgradelic input:text').blur(function() {
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
	onDowngradeSuccess: function(data) {
		var _baseFlag = true;
		var _deactivateLength = 0;
		var _targetLength = 0;
		var _baseLength = 0;
		$('#downgradeLoading').hide();
		$('#downgradeText').show();
		var _responseData = vmf.json.txtToObj(data);		
		if (_responseData != null && _responseData.error) {
			$("#KeySuccessMsgBlock").hide();
			$('#KeyErrorMsg span').html(_responseData.message);
			$("#KeyErrorMsg").show()
		} else {
			try {
			$('#KeySuccessMsgBlock').show();
			$('#KeyErrorMsg').hide();
			_deactivateLength = _responseData.deactivatedLicenses.length;
			//_targetLength = _responseData.targetProductDetails.targetProductLicenses.length;
			try {
			_baseLength = _responseData.baseProductDetails.baseProductLicenses.length;
			}
			catch(e) {
				_baseFlag = false;
			}
			var _licenseTxt = "";
			var _productTxt = "";
			_productTxt = _responseData.targetProductDetails.targetProduct+':';
			/*if($("#targetProduct").length){
				$("#targetProduct").html(_productTxt);
			}*/
			if(_baseFlag) {
			_productTxt = _responseData.baseProductDetails.baseProduct+':<span class="info">'+ice.globalVars.forTheQuantityMsg+'</span>';
			$("#baseProduct").html(_productTxt);
			}
			for(var i=0;i<_deactivateLength;i++)
			{
			
			_licenseTxt = _licenseTxt + '<li><span class="key_list_number">'+_responseData.deactivatedLicenses[i][0]+'</span><span class="key_list_qty">'+_responseData.deactivatedLicenses[i][1]+' '+_responseData.deactivatedLicenses[i][2]+'</span></li>';
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
			_licenseTxt = _licenseTxt + '<li><span class="key_list_number">'+_responseData.targetProductDetails[i].targetProductLicenses[j][0]+'</span><span class="key_list_qty">'+_responseData.targetProductDetails[i].targetProductLicenses[j][1]+' '+_responseData.targetProductDetails[i].targetProductLicenses[j][2]+'</span><span class="badge new">New</span></li>';
			}
			}
			/*for(var i=0;i<_targetLength;i++)
			{
			_licenseTxt = _licenseTxt + '<li><span class="key_list_number">'+_responseData.targetProductDetails.targetProductLicenses[i][0]+'</span><span class="key_list_qty">'+_responseData.targetProductDetails.targetProductLicenses[i][1]+' '+_responseData.targetProductDetails.targetProductLicenses[i][2]+'</span><span class="badge new">New</span></li>';
			}*/
			$("#targetKeyDetails").html(_licenseTxt);
			_licenseTxt = "";
			if($("#relationshipCode").length && $('#relationshipCode').val() != 'RESTRICTED_DOWNGRADE'){
				$('#tbl_downgradelic').find('span[id^="key_"]').each(function(){
					var lic_str = $(this).text();
					var newlic_str = myvmware.common.maskLicenseKey(lic_str);
				   $(this).text(newlic_str);
				})
			}
			if(_baseFlag) {
				for(var i=0;i<_baseLength;i++)
				{
				_licenseTxt = _licenseTxt + '<li><span class="key_list_number">'+_responseData.baseProductDetails.baseProductLicenses[i][0]+'</span><span class="key_list_qty">'+_responseData.baseProductDetails.baseProductLicenses[i][1]+' '+_responseData.baseProductDetails.baseProductLicenses[i][2]+'</span><span class="badge new">New</span></li>';
				}
				$("#baseKeyDetails").html(_licenseTxt);		
			}
			} catch(e) {
			
				$('#downgradeLoading').hide();
				$('#newLicenses > div.scroll.nineSevenPer.clearBoth').html('<div style="color:red;text-align:center;margin-top:20px;">'+ice.globalVars.noDataReturnMsg+'</div>');
			}
		}
	},
	onDowngradeFail: function() {
		var _responseData = vmf.json.txtToObj(data);
		if(_responseData.error)
			$('#newLicenses > div.scroll.nineSevenPer.clearBoth').html('<div style="color:red;text-align:center;margin-top:20px;">'+_responseData.message+'</div>');
		$('#downgradeLoading').hide();		
		$('section.column.sixZeroZero.tall').removeClass('disabled');
		$("#content_1 :input").removeAttr("disabled");
		$('#btn_confirm').attr('disabled', false);
		$('#btn_confirm').removeClass('disabled');
	},
	showDowngradeVI3OrderList: function () {
		$('#selectedLicenseKeys').val(keyForVI3);
		$("#contractForm").attr('action', preDowngradeVI3OrdersUrl);		
		$("#contractForm").submit();        
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
window.onresize=mywmware.downgradelicenses.adjustHt;