vmf.ns.use("ice");
VMFModuleLoader.loadModule("resize", function() {});
ice.combinelicensekeys = {
    unKnownError:null,
	combineLicenseKeysUrl:null,
	init: function (comLKeysUrl,portletUrl,unKwnErr) {
		vmf.scEvent = true;
		callBack.addsc({'f':'riaLinkmy','args':['my-licenses : combine']});
		ice.combinelicensekeys.adjustHt();
		combineLicenseKeysUrl = comLKeysUrl;
		unKnownError = unKwnErr;
		$("#understand_warning").attr('disabled', false);
		$('#understand_warning').click(function () {
            if ($('#understand_warning').is(':checked')) {
                $('#confirmCombineLicense').attr('disabled', false);
				$('#confirmCombineLicense').removeClass('disabled');
            } else {
                $('#confirmCombineLicense').attr('disabled', true);
				$('#confirmCombineLicense').addClass('disabled');
            }
        });
        $('#confirmCombineLicense').click(function () {
            if ($('#understand_warning').is(':checked')) {
                ice.combinelicensekeys.confirmCombine();
            } else {
                vmf.modal.show("confirmCombineLicenseContent");
            }
        });
        $('#warning_ok').click(function () {
            vmf.modal.hide();
        });
		// BUG-00016182 Start //
		$('#combineLicenseCancel').css({"cursor":"pointer"});
		// BUG-00016182 End //
		// BUG-00016425 Start //
		$('.helpLink').css({'right':'0px','top':'17px'});
		// BUG-00016425 End //
        $('#combineLicenseCancel').click(function () {
            window.location = portletUrl;
        });
		/*Resizing Panes CR Start*/
		vmf.splitter.show('mySplitter',{
			type: "v",
			sizeLeft:parseInt($("#selectedKeys").width(),10),
			resizeToWidth: true,
			outline:true,
			minLeft:parseInt($("#selectedKeys").width()*.8,10),
			maxLeft:parseInt(($("#selectedKeys").width() + ($("#combineRenderSuccess").width()*.2)),10),
			barWidth:false
		});
		/*Resizing Panes CR End*/	
    },
    confirmCombine: function () {
		$("#stepTwoBlock").addClass('disabled');
		$('#combineLicenseCancel, #confirmCombineLicense').attr('disabled', true);
		$('#combineLicenseCancel, #confirmCombineLicense').addClass('disabled');
		$("#understand_warning").attr('disabled', true);
        $('#loading').show();
		$('#loadingImage').show();
        //var _arrayOfSelectedLicenseKeys = new Array();
        //$("input:hidden").each(function () {
        //    _arrayOfSelectedLicenseKeys.push($(this).val());
        //});
         //combineLicenseKeysUrl = combineLicenseKeysUrl + '&selectedLicenseKeys=' + _arrayOfSelectedLicenseKeys;
		//riaLink(combineLicenseKeysUrl);
		//requestParams = '&selectedLicenseKeys=' + _arrayOfSelectedLicenseKeys; 
		vmf.ajax.post(combineLicenseKeysUrl, null, ice.combinelicensekeys.onSuccess, ice.combinelicensekeys.onFail);
	},
	onSuccess: function (data) {
		var _responseData = vmf.json.txtToObj(data);
		if (_responseData != null && _responseData.error) {
			$("#stepTwoBlock").removeClass('disabled');
			$('#combineLicenseCancel, #confirmCombineLicense').attr('disabled', false);
			$('#combineLicenseCancel, #confirmCombineLicense').removeClass('disabled');
			$("#understand_warning").attr('disabled', false);
			$('#loadingImage').hide();
			$('#loading #pleaseConfirm').html(_responseData.message);
		}  if(_responseData != null && _responseData.ERROR != null) {
			$("#stepTwoBlock").removeClass('disabled');
			$('#combineLicenseCancel, #confirmCombineLicense').attr('disabled', false);
			$('#combineLicenseCancel, #confirmCombineLicense').removeClass('disabled');
			$("#understand_warning").attr('disabled', false);
			$('#loadingImage').hide();
			$('#loading #pleaseConfirm').html(unKnownError);
		}else {
			$('#loading').hide();
			$('#loadingImage').hide();
			$('#combineLicenses').show();
			var licenseDetail = _responseData.licenseEntList;
			var resHTML = '';
			for(i=0;i<licenseDetail.length;i++)
			{
				resHTML = resHTML+'<li>';
				resHTML = resHTML+'<span class="key_list_number">'+licenseDetail[i].licenseKey+'</span>';
				resHTML = resHTML+'<span class="key_list_qty">'+licenseDetail[i].quantity+' '+licenseDetail[i].unitOfMeasure+'</span>';
				resHTML = resHTML+'</li>';
			}
			var newLicenseDetail = _responseData.newLicenseEntList;
			var newlicenseHTML = '';
			newlicenseHTML = newlicenseHTML+'<li><span class="key_list_number">'+newLicenseDetail[0].licenseKey+'</span><span class="key_list_qty">'+newLicenseDetail[0].quantity+' '+newLicenseDetail[0].unitOfMeasure+'</span><span class="badge new">'+ice.globalVars.newTxt+'</span></li>';
			$('#prodName').html(licenseDetail[0].productName+':');
			$('#licenseDetails').html(resHTML);
			$('#newLicense').html(newlicenseHTML);
			$('#comb_license_ley_id').find('div.key').each(function(){
				var lic_str = $(this).text();
				var newlic_str = myvmware.common.maskLicenseKey(lic_str);
				$(this).text(newlic_str);
			})
		}
    },
    onFail: function (data) {
	    $("#stepTwoBlock").removeClass('disabled');
	    $('#combineLicenseCancel, #confirmCombineLicense').attr('disabled', false);
		$('#combineLicenseCancel, #confirmCombineLicense').removeClass('disabled');
		$("#understand_warning").attr('disabled', false);
		//$("#understand_warning").removeAttr("checked");
        //vmf.modal.show(unKnownError);
		$('#loadingImage').hide();
		$('#loading #pleaseConfirm').html(unKnownError);
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
window.onresize=ice.combinelicensekeys.adjustHt;