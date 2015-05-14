th = {};
$.extend(epp,{
    addCommas:function(nStr){
	nStr += '';var x = nStr.split('.');var x1 = x[0].replace(/,/g, '');var x2 = x.length > 1 ? '.' + x[1] : '';var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {x1 = x1.replace(rgx, '$1' + ',' + '$2');};return x1 + x2;
    }
});
epp.fD =  {
    _inCart: [],
    _inCartQty: [],
    _inCartSkuIdList: [],
    _snsTokenBalance: 0.0,
    _snsTrueUpUsage: false,
    _crossOverPresent: false,
    _snsTokenInCart: 0.0,
    _trueUpTokenBalance: parseFloat(epp.globalVar.trueUpTokensRemaining),
    _prevPartiallyIncludedObj: null,
    _preselectRedeem: false,
    _daysInYear: parseInt(365), //need to get from properties
    _threeYear: parseInt(3),
    _fixedFloatZero: "0.00",
	//_subFundIds:[],
	partnerIdArr:[], 
	pPartyIdArr : [],
	pCountryArr : [],
	_dt:null,
	_pdt:null,
	_pId:[],
	_pPartyId:[],
	_newSfName:null,
	sfuEmail:null, 
	sfFN:null, 
	sfLN:null,
	$prtnrName:null,
	// pName:null,
	// pCountry:null,
	partnerCountry:null,
	pId:null,
	pPId:null,
	//bChangePSel:null,
	CN: null,
	validEMSUser: null,
	validUser: null,
	bEmail:null,
	bFname:null,
	bLname:null,
	bDefault:null,
	bInRedem:null,
	arrPartnerList:null,
    _ENTER_KEY: 13,
    kbUrl:null,
	trueUpMode:null,
	upgradeFlagArr:[],
	addedPartner:[],
    init: function() {
        vmf.scEvent =true;
		bDefault = "n";
		th = epp.fD;
		tt = th.tt; // transfer tokens module
		bEmail=false;
		bFname=false;
		bLname=false;
		bError=true; //alias for epp.epp object
		isPrimaryFund=false;
		//_subFundIds = [];
		arrPartnerList = [];
		bChangePSel = false;
		epp.fD.bInRedem = false;
		epp.fD.trueUpMode = false;
        if(!epp.globalVar.futureAllowed) {
            epp.fD._snsTokenBalance = parseFloat(epp.globalVar.snsTokensRemainingValue);
            epp.globalVar.netSnSCredit = 0;
        }
        epp.common.bChart($('.loVal', $('#lGraph')), $('.liVal', $('#lGraph')), epp.globalVar.timeRatio, epp.globalVar.tokenRatio,'large');
        $("#filterVal").val('');
		$('a#partner_help_KB').click(function(){
			if(typeof myvmware.common.openHelpPage != "undefined"){
				myvmware.common.openHelpPage(epp.globalVar.kbUrlPartners);
			}
			return false;
		});
		//KBarticles Help Link
		kbUrl = epp.globalVar.kbUrlViewFunds;
		$('a#help_KB').click(function(){
			if(typeof myvmware.common.openHelpPage != "undefined"){
				myvmware.common.openHelpPage(kbUrl);
			}
			return false;
		})
        if(epp.fD.handlePreSelection()) {
            epp.fD._preselectRedeem = true;
        }
        else {
            $('#sfIwantTo option:eq(0)').attr('selected','selected');
            th.getSubFundDetails();
        }
        $('#createSubFund input,#renameFund input,#renameSubFund input,#changeDefaultPartner select').keypress(function(e){
		    if(e.which == epp.fD._ENTER_KEY) $(this).closest('.modalContent').find('button').not('.secondary').trigger('click');
		});
        $('#changeSubFundUser input').keypress(function(e){
		    if(e.which == epp.fD._ENTER_KEY) $('#addSFUser').not('.disabled').trigger('click');
		});
		$('#addRedemptPartner .partnerSearchArea input,#addRedemptPartner .partnerSearchArea select').keypress(function(e){
		    if(e.which == epp.fD._ENTER_KEY) $('#btn_findPartner').trigger('click');
		});
        $('#dPartner,#aPartChk').keypress(function(e){
		    if(e.which == epp.fD._ENTER_KEY) $('#btn_savePartner').trigger('click');
		});
        $('a#csfund').live('click',function(){
			if($(this).closest('li').hasClass('inactive')) return false;
			vmf.modal.show('createSubFund');
			//$('#newSFName').focus();
			$('#newSFName').select();
			return false;
		});
		$("#btn_csfund").live('click',function(){
			var sObj1 = new Object();
			sObj1['newFundName'] = $.trim($('#newSFName').val());
			$('#newSFName').parent().find('.errorMsg').remove();
			if(sObj1['newFundName'].match(epp.globalVar.fundDetailsValidation)
			&& ($.trim($('#newSFName').val()) != '')){
				var newUserEnteredSubFundName = escape($('#newSFName').val());
				vmf.modal.hide('createSubFund');
				//vmf.loading.show({'overlay':'true'});
				vmf.ajax.post(epp.globalVar.createSubFundURL, "&newSubFundName="+newUserEnteredSubFundName, th.updateSubFunds);
			}else{
				$('#newSFName').parent().append('<span class="errorMsg">'+epp.globalVar.showFund+'</span>');
			}
		});
		$('a#rsfund').live('click',function(){
			if($(this).closest('li').hasClass('inactive')) return false;
			vmf.modal.show('renameSubFund');
			$('#newfoName').select();
			var $selRow = _dt.find('tr.active'), curSbFnName = $selRow.find('td:eq(0) span.primaryTxt').text();
			if(curSbFnName == ''){
				curSbFnName = $selRow.find('td:eq(0)').text();
			}
			$('#currentSbFnName').text(curSbFnName);
			return false;
		});
		$("#btn_continuel21").live('click',function(){
			var $sfName = $('#tbl_eppCurFundsDetails').find('tr.active td:eq(0) span.primaryTxt').text(),
				$active = $('#tbl_eppCurFundsDetails').find('tr.active'),
				$index = $('#tbl_eppCurFundsDetails').find('tr.active').index(),
				sObj1 = new Object();
			sObj1['newRenameFund'] = $.trim($('#newfoName').val());
			sObj1['currentNameFund'] = $.trim($('#currentSbFnName').text());
			$('#newfoName').parent().find('.errorMsg').remove();
			if(sObj1['newRenameFund'].match(epp.globalVar.fundDetailsValidation)){
				if(($.trim($('#newfoName').val()).length) && 
				$sfName != sObj1['newRenameFund'] && 
				sObj1['newRenameFund'] != sObj1['currentNameFund']){
					_newSfName = escape($('#newfoName').val());
					vmf.modal.hide('renameSubFund');
					//vmf.loading.show({'overlay':'true'});
					vmf.ajax.post(epp.globalVar.renameSubFundURL, "&renameSubFund="+_newSfName+
					"&subFundId="+encodeURIComponent($active.data("id")), th.updateSubFunds);
				}else{ $('#newfoName').after('<label class="errorMsg" for="newfoName">'+epp.globalVar.showSubFund+'</label>');	}
			}else{$('#newfoName').after('<label class="errorMsg" for="newfoName">'+epp.globalVar.showSubFund+'</label>');}
		});
		$('a#dsfund').live('click',function(){
			if($(this).closest('li').hasClass('inactive')) return false;
			if(_dt.find('tr.active td:eq(0)').text() == '') return false;
			var tokensRemaining = $('#tbl_eppCurFundsDetails').find('tr.active td:eq(2)').text();
			if(parseInt(tokensRemaining) > 0 ) {return false;}
			vmf.modal.show('deleteSubFund');
			var deleteSubFundName = $('#tbl_eppCurFundsDetails').find('tr.active td:eq(0)').text();
			$('#delSbFnName').text(deleteSubFundName);
			return false;
		});
		$("#btn_deleteFnName").live('click',function(){
			var $curTr = _dt.find('tr.active'),
				$index = _dt.find('tr.active').index(), 
				tokensRemaining = _dt.find('tr.active td:eq(2)').text();
			if(!$curTr.hasClass('primary')){
				if(tokensRemaining == "0" || tokensRemaining == "0.00" ){
					//vmf.loading.show({'overlay':'true'});
					vmf.modal.hide('deleteSubFund');
					vmf.ajax.post(epp.globalVar.deleteSubFundURL, "&subFundId="+encodeURIComponent($curTr.data("id")), th.updateSubFunds);
				}else{
					vmf.modal.hide('deleteSubFund');
				}
			}
		});
		$('a#cfuser').live('click',function(){
			if($(this).closest('li').hasClass('inactive')) {return false;}
			if(!$('#tbl_eppCurFundsDetails').find('tr.active td:eq(0)').text().length) {return false;}
			var $index = $('#tbl_eppCurFundsDetails').find('tr.active').index();
			th.showChangeSFWin();
			vmf.modal.show('changeSubFundUser');
			$("#sf_error, #sf_success1, #sf_success3, #sf_invitation, #sf_submitDetail").hide();
			$('#sf_inst').show();
			epp.common.toggleButton($("#addSFUser"), false);
			epp.common.toggleButton($("#sfUContinue"), false);
			return false;
		});
		
		$("#sfUContinue").live('click',function(){
			//vmf.loading.show({'overlay':'true'});
			epp.common.toggleButton($(this), false);
			var $index = $('#tbl_eppCurFundsDetails').find('tr.active').index(), $url, $curRow;
			$curRow = $('#tbl_eppCurFundsDetails').find('tr.active');
			if (validUser=="true"){
				if(validEMSUser=="true") {$url = epp.globalVar.replaceSubFundUserURL;}
				else{ $url = epp.globalVar.createSubFundUserURL;}
				vmf.ajax.post($url, 
				  "&userEmail="+sfuEmail+
				  "&fisrtName="+sfFN+
				  "&lastName="+sfLN+
				  "&subFundId="+encodeURIComponent($curRow.data("id"))+
				  "&userId="+encodeURIComponent(userId), th.updateSubFundUser);
			}else{//vmf.loading.hide();
			}
        });
		$("#sfReset").live('click',function(){
			bEmail = false; bFname = false; bLname = false;
			$('#sf_inst').show();
			$("#sfUserForm").parents('.sec_content').removeClass('disabled').find("input[type='text']").val('').removeClass('disabled').attr('disabled',false);
			$("#sfUserForm button[type='reset']").removeClass('disabled').attr('disabled',false);
			$('#sf_submitDetail').hide().find('sf_warning').hide();
			epp.common.toggleButton($("#sfUContinue"),false);
			$(this).hide();
		});
		$("#editFnName").live('click',function(){
			vmf.modal.show('renameFund');
			//$('#newFundName').focus();
			$('#newFundName').select();
			$('#currentFnName').html($('#fnName').text());
			return false;
		});
		$("#btn_changeFnName").live('click',function(){
			var sObj = new Object(), curName = $('#currentFnName'), newName = $('#newFundName');
			sObj['userEnteredFundName'] = $.trim(newName.val());
			sObj['userCurrentFnName'] = $.trim(curName.text());
			$('#newFundName').parent().find('.errorMsg').remove();
			if($.trim(newName.val()).length && 
				sObj['userEnteredFundName'].match(epp.globalVar.fundDetailsValidation) &&
				sObj['userEnteredFundName'] != sObj['userCurrentFnName']){
				editFundName = escape(newName.val());
				vmf.modal.hide('renameFund');
				//vmf.loading.show({'overlay':'true'});
				vmf.ajax.post(epp.globalVar.renameFundURL, "&newfundName="+editFundName, th.updateFundName);
			}else newName.after('<label class="errorMsg" for="newFundName">'+epp.globalVar.showFund+'</label>');
		});

		$('a#addPartner').live('click',function(){vmf.modal.show('addRedemptPartner')});
		$('a#chPartner').live('click',function(){
		        var $partnerName = $('#defaultPartner').text(); 
				vmf.modal.show('changeDefaultPartner');
				$('#changePartner').html($partnerName);
				epp.common.toggleButton($('#btn_saveChangePartner'), false);
				th.getPartnersList();
				
		 });   
		$('a#delPartner').live('click',function(){
			if(!$(this).parent().hasClass('inactive')){ 
				var $partnerName = $('#tbl_rpSummary tbody').find('tr.active td:eq(1)').text(); 
				vmf.modal.show('removePartnerContent'); 
				$('#partner_name').html($partnerName);
			}else return false;
		});
		//Commenting below code to enable user to type any value as some partner names contain special chars
		/*$('#partnerName').bind('keyup blur', function () {//Restricting only alphanumerics and white space.
			if (this.value.match(/[^a-zA-Z0-9 ]/g)) this.value = this.value.replace(/[^a-zA-Z0-9 ]/g, '');
		});*/
		$('#btn_findPartner').live('click',function(e){
			e.preventDefault();
			epp.fD.partnerCountry = $("#partnerCountry").val();
			var thisBtn = $(this),
				pNameInput = $("#partnerName");
				partnerName =  $.trim(pNameInput.val()), 
				pCountry = $("#partnerCountry"),
				selectedCountry = pCountry.val(), 
				ptnrList = $('#tbl_rpSummary tbody'),
				trs = ptnrList.find('tr');
			if(th.validatePartnerInfo(pNameInput, pCountry)){
				pNameInput.parent().parent().find('label.errmsg').remove();			
				epp.common.toggleButton(thisBtn, false);
				th.partnerIdArr = []; th.pPartyIdArr = [];
				$('#addRedemptPartner .partnerDiv').siblings('.ctrlHolder').addClass('disabled').find(':input').attr('checked',false).attr('disabled',true);
				$('#searchedPartners tbody').html('<tr><td colspan="2" class="loadingTd"><div class="loadingWrapper"><div class="loading_big">'+epp.globalVar.loading+'</div></div></td></tr>');
				vmf.ajax.post(epp.globalVar._searchPartnersURL, "&partnerName="+partnerName+"&partnerCountry="+selectedCountry, function(data){
					var oList=[], jData = data.SearchedPartnerData.partnerList;
					if (jData!=null && jData.length){ //Check if it is a proper json response
						$("#numberOfPartners").html(data.SearchedPartnerData.iTotalDisplayRecords);
						$.each(jData, function(i,v){
							th.partnerIdArr.push(v.partnerID);
							th.pPartyIdArr.push(v.partnerPartyID);
							if(th.checkPartnerAdded(v.partnerName)){
								oList.push('<tr><td class="vspace2 w20"><input id="partnerRdo'+i+'" type="radio" name="p1" disabled="true" /></td><td class="vspace2 label">'+v.partnerName+'<span class="badge asp">'+epp.globalVar.partnerAlreadyAdded+'</span></td></tr>');
							}else{
								oList.push('<tr><td class="vspace2 w20"><input id="partnerRdo'+i+'" type="radio" name="p1" /></td><td class="vspace2 label">'+v.partnerName+'</td></tr>');
							}
						});
						$('#searchedPartners tbody').html(oList.join(''));
					} else {
						$("#numberOfPartners").html(0);
						$('#searchedPartners tbody').html('<tr><td colspan="2" class="noResults">'+epp.globalVar.noPartnersTryAgain+'</td></tr>');
						pNameInput.focus();
					}
					epp.common.toggleButton(thisBtn, true);
				});
			}
		});
		$('#searchedPartners input[type="radio"]').live('change', function(){
			$('#addRedemptPartner').find('.ctrlHolder.disabled').removeClass('disabled').find(':input').attr('disabled',false);
		});
		$('#aPartChk').live('change', function(){
			if($(this).is(':checked')) epp.common.toggleButton($('#btn_savePartner'), true);
				else epp.common.toggleButton($('#btn_savePartner'), false);
		});	
		$('#btn_savePartner').live('click', function(){
			var pIdx = $('#searchedPartners input[type="radio"]:checked').parent().parent().index(), 
				thisBtn = $(this), 
				pName = $('#searchedPartners input[type="radio"]:checked').parent().next().text(),
				pCountry = $('#partnerCountry').val();
			epp.common.toggleButton(thisBtn, false);
			pId = th.partnerIdArr[pIdx]; 
			pPId = th.pPartyIdArr[pIdx];
			if($('#dPartner').is(':checked')){bDefault = "y";}else {bDefault = "n";}
			vmf.modal.hide('addRedemptPartner');
			vmf.loading.show({'overlay':'true'});
			vmf.ajax.post(epp.globalVar.addPartnerURL, "&encPartnerId="+encodeURIComponent(pId)+"&partnerPartyID="+encodeURIComponent(pPId)+"&partnerName="+escape(pName)+"&defaultPartner="+bDefault+"&partnerCountry="+epp.fD.partnerCountry, function(jData){
				if(jData.GenericJSON) {
					if(epp.fD.bInRedem){
						th.getPartners();
					}else{
						if(bDefault == "y"){ $("#defaultPartner").html(pName);}
						th.buildPartnerTable();
						$("#errorMsg").hide();
					}
					if(typeof riaLinkmy != "undefined") {
						vmf.scEvent = false;
                    	s.eVar4 = "epp_fund details";
						s.eVar5 = "view partners";
                    	riaLinkmy(epp.globalVar.pageName + ' : view partners : add new partner');
                    }
				}else {$("#errorMsg").html(epp.globalVar.addPartnerErrorMsg+" "+epp.globalVar.genericErrorMsg).show(); }
				vmf.loading.hide();
			});
		});
		$('#btn_saveChangePartner').live('click',function(){
			var selectedPartnerId = $("#partersSelectBox").val(), thisBtn = $('#btn_saveChangePartner');
			$prtnrName = $("#partersSelectBox option:selected").text();
			vmf.modal.hide('removePartnerContent'); 
			vmf.loading.show({'overlay':'true'});
			vmf.ajax.post(epp.globalVar.changeCurrentPartnerURL, "&"+epp.globalVar.encPartnerID + encodeURIComponent(selectedPartnerId)+"&partnerName="+escape($prtnrName), function(jData){
				if(jData.GenericJSON) {
					$("#defaultPartner").html($prtnrName);
					th.buildPartnerTable();
					$("#errorMsg").hide();
					if(typeof riaLinkmy != "undefined") riaLinkmy(epp.globalVar.pageName + ' : view partners : change current partner');
				}else{
				  $("#errorMsg").html(epp.globalVar.changePartnerErrorMsg+" "+epp.globalVar.genericErrorMsg).show();
				}
				vmf.loading.hide();
			});
		});
		$('#btn_confirmDeletePartner').live('click',function(){
			var activeRow = _pdt.find('tr.active'), 
				partnerId = th._pId[activeRow.index()], 
				partnerPartyId = th._pPartyId[activeRow.index()]; 
				
			var selectedPCountry = (th.pCountryArr[activeRow.index()].length && th.pCountryArr[activeRow.index()] != null)? th.pCountryArr[activeRow.index()]:' ';
				
			vmf.modal.hide('removePartnerContent'); 
			vmf.loading.show({'overlay':'true'});
			vmf.ajax.post(epp.globalVar.removePartnerURL, 
				"&"+epp.globalVar.encPartnerID + encodeURIComponent(partnerId) + "&"+epp.globalVar.partnerPartyID + encodeURIComponent(partnerPartyId) + "&"+"partnerCountry=" + selectedPCountry, function(jData){
				if(jData != null && jData.GenericJSON != null && jData.GenericJSON == 'N') {
					$("#errorMsg").html(epp.globalVar.removePartnerErrorMsg+" "+epp.globalVar.partnerNoDelete).show();
				}else
				if(jData.GenericJSON) { 
				   th.buildPartnerTable();
				   $("#errorMsg").hide();
				   if(typeof riaLinkmy != "undefined") riaLinkmy(epp.globalVar.pageName + ' : view partners : remove partner');
				}else {
				$("#errorMsg").html(epp.globalVar.removePartnerErrorMsg+" "+epp.globalVar.genericErrorMsg).show();
				}
				vmf.loading.hide();
			});
		});
		$('#btn_cancelAddPartner').live('click',function(){th.partnerIdArr=[]; th.pPartyIdArr=[]; vmf.modal.hide('addRedemptPartner');});
		$('#btn_cancelChangePartner').live('click',function(){vmf.modal.hide('changeDefaultPartner')});
		$('#btn_cancelDeletePartner').live('click',function(){vmf.modal.hide('removePartnerContent')});
		$("#btn_cancelRename").live('click',function(){vmf.modal.hide('renameFund')});
		$("#btn_cancelRename2").live('click',function(){vmf.modal.hide('renameSubFund')});
        $('button#btn_cancel12').live('click',function(){vmf.modal.hide('changeSubFundUser')})
        $('button#btn_cancel5').live('click',function(){vmf.modal.hide('createSubFund')})
        $('button#btn_cancel21').live('click',function(){vmf.modal.hide('deleteSubFund')})
        $(".addCart", $("#prodList")).live('click',function(){ //Click event to Add to cart button
           var lParent=$(this).closest('li');
           var skuObj = lParent.data('jData');
            if(skuObj.upgradeFlag) {
				vmf.loading.show({'overlay':'true'});
                vmf.ajax.post(
                	epp.globalVar.validateUpgradeURL, 
					"&"+epp.globalVar.encSkuIdParam + skuObj.skuID + "&"+epp.globalVar.skuParam + skuObj.sku + "&" 
                	+ epp.globalVar.encSnsSkuIdParam + skuObj.snsSkuID + "&" + epp.globalVar.snsSkuParam + skuObj.snsSku, 
                	epp.fD.showUpgradeAlert
                );
            } else {
                epp.fD.addToCart(skuObj); //Pass the json obj to build table row 
                lParent.addClass('inCart'); //Add this class to decrease opacity
                var _cartButton = $('#prodList ul').find('.'+skuObj.sku);
                _cartButton.find('.addCart').replaceWith('<div class="cartMsg">'+epp.globalVar.inCartMsg+'</div>'); //Replace add to cart with static text
            }
            return false;
        });
        $('.dCart', $("#redeem_content")).live('click',function(){ //Remove from cart
            epp.fD.removeFromCart($(this));
            return false;
        });
        $("#eCart").click(function(){
            if ($("#cT tbody tr").length && !($(this).hasClass('disabled'))){ //Check if Cart has any entries..
                $.each($("#cT tbody tr"),function(j,pRow){
                    if($("li.inCart."+$(pRow).attr('liRef')).length){ //Update corresponding entry in tree
                        var liRef=$("li.inCart."+$(pRow).attr('liRef'));
                        liRef.find('.addBtn').html('<button class="secondary addCart">'+epp.globalVar.addToCartMsg+'</button>');
                        liRef.removeClass("inCart");
                    }
                    $(pRow).remove();
                });
                //Update total and remaining tokens
                var curCartObj=$('.tokenVal', $('.tokensInCart')), remainCartObj=$('.tokenVal', $('.tokensRemain'));
                var curCart= parseFloat(curCartObj.html()), remainCart=parseFloat($('#selectProds option:selected').attr('tnum'));
                curCartObj.html("0.00").removeClass('isFunds sFunds');
                remainCartObj.html(epp.fD.getFixedFloat(remainCart)).removeClass('isFunds sFunds');
                epp.fD._snsTokenBalance = epp.fD.getFixedFloat(parseFloat(epp.globalVar.snsTokensRemainingValue));
                epp.fD._snsTokenInCart = 0; //Reset to 0
                epp.fD.toggleContinue(false);
                $("#cT").hide();
                $("#cInst").show();
                epp.fD._inCart=[];
                epp.fD._inCartQty=[];
                epp.fD._inCartSkuIdList=[];
                epp.fD.upgradeFlagArr=[];
                $('#filterVal').val('');
                $('#filter').addClass('disabled');
                epp.fD.getProducts();
            }
            $("#includeTrueUp").attr("checked",false);
			$('#includeTrueUp').attr('disabled',true);
            $(this).addClass('disabled');
            return false;
        });
        $(".mQty .tknVal").die('keydown').live('keydown', function(event) {
            // Allow: backspace, delete, tab, escape, and enter
            if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 || 
                 // Allow: Ctrl+A
                (event.keyCode == 65 && event.ctrlKey === true) || 
                 // Allow: home, end, left, right
                (event.keyCode >= 35 && event.keyCode <= 39)) {
                     // let it happen, don't do anything
                     return;
            }
            else {
                // Ensure that it is a number and stop the keypress if it is not or stop if it has more than max digits
                if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )
                         || $(this).val().length >= epp.globalVar.maxQtySize) {
                    event.preventDefault();
                }
            }
        }).die('keyup').live('keyup', function(){
            var nVal = $(this).val(), tRow=$(this).closest('tr'), oldCount, newCount, mTotalVal=0.0;
            var data = tRow.data('jData');
            if(nVal=="") {
                nVal = $(this).val();
                $(this).closest('tkns').find('.sQty .tknVal').val('');
            } else if(nVal==0){
                $(this).val(epp.globalVar.zeroQty);
                $(this).closest('tkns').find('.sQty .tknVal').val(epp.globalVar.zeroQty);
                nVal = $(this).val();
            }
            if(isNaN(nVal)){
                alert(epp.globalVars.numErr);
                return;
            }
			if($(".sQty .tknVal", tRow).val() != epp.globalVar.nofutureindicator) {
				$(".sQty .tknVal", tRow).val(nVal);
			}
            if(data.termLicense.isTerm) {
                mTotalVal = data.skuTokens * nVal * data.snsDuration / epp.fD._daysInYear;
            } else {
                mTotalVal = data.skuTokens * nVal;
            }
            
            $(".mTotal", tRow).html(epp.fD.getFixedFloat(mTotalVal));
            if($(".sTotal", tRow).attr("oVal") != undefined && $(".sTotal", tRow).attr("oVal") != "") {
                var snsTokens = parseFloat($(".sTotal", tRow).attr("oVal")), snsDuration;
                //Try to get snsduration for current row, if not present get from prodlist
                if(tRow.attr('snsDur') != undefined && tRow.attr('snsDur') != null) {
                    snsDuration = tRow.attr('snsDur');
                }
                else {
                    snsDuration = $('#prodList .'+tRow.attr('liref')).data('jData').snsDuration;
                }
                $(".sTotal a", tRow).html(epp.fD.getFixedFloat(epp.fD.calcSnsTotalTokens(snsTokens,nVal,snsDuration)));
            }
            epp.fD.calcCart();
            //Update Cart quantity
            var qty=0, sku=tRow.attr('liref');
            if(nVal != "") {
                qty = nVal;
            }
			if(sku) {
                var skuIdx = $.inArray(sku,epp.fD._inCart);
                if(skuIdx >= 0) {
                    epp.fD._inCartQty[skuIdx] = qty;
                }
            }
        });
        $(".filterVal",$("#redeem_content")).die('keyup').live('keyup', function(e){
            var code = (e.keyCode ?  e.keyCode : e.which);
            if($("#selectProds option:selected").val() == "selectOne") {
                //If no subfund is selected dont apply filter
                return;
            }
            if($.trim($(this).val()).length == 0) {
                if(code == epp.fD._ENTER_KEY) {
                    $("#instText").hide();
                    $("#prodList ul.fullContent").show();
                    $("#prodList ul.fContent").remove();
                }
                $("#filter").removeClass("disabled").unbind('click').bind('click', function() {
					$("#instText").hide();
                    $("#prodList ul.fullContent").show();
                    $("#prodList ul.fContent").remove();
                });
            }
            else if ($.trim($(this).val()).length >= 3){
                if(code == epp.fD._ENTER_KEY) {
                    epp.fD.filterContent();
                }
                $("#filter").removeClass("disabled").unbind('click').bind('click',epp.fD.filterContent);
            }else{
                $("#filter").addClass("disabled").unbind('click');
            }
        });
        
        $('#sfIwantTo').change(function(){
             var $thisID = $(this).val();
             $('#fdMainContent').find('#'+$thisID+"_content").show().siblings().hide();
             if ($thisID=="viewsubfund") {
             	th.getSubFundDetails();
             	if(typeof riaLinkmy != "undefined") riaLinkmy(epp.globalVar.pageName);
             }
			 if ($thisID=="transfer") {
				(epp.fD.trueUpMode)?$('#noTransferTokens').show():tt.init();
			}
             if ($thisID=="redeem") th.getSubFunds(); //fetch sub-fund select box
             if ($thisID=="update") {
             	th.buildPartnerTable();
             	if(typeof riaLinkmy != "undefined") riaLinkmy(epp.globalVar.pageName + ' : view partners');
			}
             $("#errorMsg").hide();
             return false;
        });

        $('#selectProds').change(function(){
            if ($(this).val()!="selectOne"){
				if(epp.globalVar.userType=='FO' && epp.globalVar.trueUpEnabled=='Y' && $(this).find('option:selected').attr('default')=='Y') {
					$('#activateTrueUpDiv').removeClass('hidden');
					myvmware.hoverContent.bindEvents($('.tooltiptextTU', $("#activateTrueUpDiv")), 'funcleft', $('.tooltiptextTU', $("#activateTrueUpDiv")), 400);
				} else {
					$('#activateTrueUpDiv').addClass('hidden');
				}
                $(this).find("option[value=selectOne]").remove(); //Remove Select one option
                if($('#includeTrueUp').attr('checked')) {
                    epp.fD.calcCart();
                } else {
                    $('.tokenVal', $('.tokensRemain')).html(epp.fD.getFixedFloat(epp.fD.getFixedFloat(parseFloat($(this).find('option:selected').attr('tnum'))) - epp.fD.getFixedFloat(parseFloat($('.tokenVal', $('.tokensInCart')).html())))); //Update Total in Cart and Remaining tokens
                    epp.fD.updateColor();
                }
                if($("#instText").is(':visible')){ //Send request to get tree structure only for the first time
                    epp.fD.getCartItemsProducts();
                    $("#instText").hide();
                    $("#prodList").show();
                }
            } else {
                $("#instText").show();
                $("#prodList").hide();	
            }
             return false;
        });
		$(".sTotal a", $("#cT")).live('click',function(e){
			e.preventDefault();
			var curObj = $(this).closest('tr').data('jData');
            if(!epp.globalVar.futureAllowed && curObj.partiallyIncluded && !curObj.upgradeFlag) {
                vmf.modal.show('SnSCalculation_PIRG', {onShow:epp.fD.manipPIRGSnSCalc($(this))});
            } else if(!epp.globalVar.futureAllowed && curObj.partiallyIncluded && curObj.upgradeFlag) {
                vmf.modal.show('SnSCalculation_PIEU', {onShow:epp.fD.manipPIEUSnSCalc($(this))});
            }
			if(curObj.upgradeFlag) vmf.modal.show('SnSCalculation_UE', {onShow:epp.fD.manipEUSnSCalc($(this))});
			else vmf.modal.show('SnSCalculation', {onShow:epp.fD.manipSnSCalc($(this))});
		});
        $("a.termLicModal", $("#cT")).live('click', function(e) {
            e.preventDefault();
            vmf.modal.show('termLicCalculation', {onShow:epp.fD.manipTermLicCalc($(this))});
        });
        // To display account name only limitted length and show full name on hover.
        $('#fundHeader .charLimit').each(function(){
            var $name = $(this).text(), $charLen = $(this).text().length, $limit = 15;
            if($name.length && $name != null && $name != undefined){
                if($charLen > $limit){
                    $(this).css('cursor','pointer').html($name.substring(0, $limit)).append(' ...');
                    //adding mouseover event to show full name on hover
                    $(this).mouseover(function(){$(this).html($name);
                    }).mouseout(function(){$(this).html($name.substring(0, $limit)).append(' ...');})
                }
            }
            return false;
        });
	
		$('#snsCalcContinue').click(function() {
			vmf.modal.hide('SnSCalculation');
		});
        $('#termLicCalcContinue').click(function() {
			vmf.modal.hide('termLicCalculation');
		});
        $('#pirgSnsCalcContinue').click(function(){
			vmf.modal.hide('SnSCalculation_PIRG');
		});
        $('#pieuSnsCalcContinue').click(function(){
			vmf.modal.hide('SnSCalculation_PIEU');
		});
		
		$('#downloadRedemptionReport').click(function(e) {
			epp.fD.downloadRedemptionReport(e);
		});
		
		$('#downloadActivityReport').click(function(e) {
			epp.fD.downloadActivityReport(e);
		});
		$('#sfUserForm button[type="reset"]:not(".disabled")').live('click', function(e){
			epp.common.toggleButton($('#addSFUser'), false);
			bEmail = false; bFname = false; bLname=false;
		});
		var fname, lname, eaddr;
		$('form#sfUserForm input[type="text"]:not(".disabled")').live('keyup change', function(e){
			fname = $.trim($('#sfFName').val());
			lname = $.trim($('#sfLName').val());
			eaddr = $.trim($('#sfFMail').val());
			if(fname != "" && lname != "" && eaddr != "" ){
				epp.common.toggleButton($('#addSFUser'), true);
			}else{
				epp.common.toggleButton($('#addSFUser'), false);
			}
		});
		// Validations for Pop up
		$('#sfUserForm input[type="text"]:not(".disabled")').live('focusout', function(e){
			var $this = $(this),
				$thisVal = $(this).val(),
				$thisId = $(this).attr('id');
			if($thisId == 'sfFMail'){
				  var intRegex = /^[a-zA-Z0-9._\-!#$%^&+=' \/()]+@([a-zA-Z0-9._\-!#$%^&+=' \/()]+\.)+[a-zA-Z0-9._\-]+$/;
				  if($thisVal.length){
						if(!intRegex.test($thisVal)){
							  $this.next('.errorMsg').html(epp.globalVar.validEmail); bEmail = false;
						}
						else {$this.next('.errorMsg').html(''); bEmail = true;}
				  }
				  else{ $this.next('.errorMsg').html('Required'); bEmail = false;} 
			}
			else if($thisId == 'sfFName'){
				  var intRegex = /[\b,"'`;~*\b]/;
				  if($thisVal.length){
						if(intRegex.test($thisVal)){
							$this.next('.errorMsg').html(epp.globalVar.validFirstName); bFname=false;
						}
						else {
							$this.next('.errorMsg').html(''); bFname=true;
						}
				  }
				  else {$this.next('.errorMsg').html('Required');bFname=false;}  
			}
			else if($thisId == 'sfLName'){
				  var intRegex = /[\b,"'`;~*\b]/;
				  if($thisVal.length){
						if(intRegex.test($thisVal)){
							 $this.next('.errorMsg').html(epp.globalVar.validLastName); bLname=false;
						}
						else { $this.next('.errorMsg').html(''); bLname=true; }
				  }
				  else {$this.next('.errorMsg').html('Required'); bLname=false;}  
			}
			if( bEmail && bFname && bLname){ epp.common.toggleButton($('#addSFUser'), true); }
				else{ epp.common.toggleButton($('#addSFUser'), false);}
        });
		$('#addSFUser').live('click', function(e){		  
			epp.common.toggleButton($(this), false);
			$('#sf_inst').hide().before('<div class="loadingWrapper"><div class="loading_big">Loading...</div></div>');
			th.showChangeSFWin();			  
			var $sfName = $.trim($('#tbl_eppCurFundsDetails').find('tr.active td:eq(0)').text()),
				$curRow = $('#tbl_eppCurFundsDetails').find('tr.active'),
				$index = $('#tbl_eppCurFundsDetails').find('tr.active').index();	
			vmf.ajax.post(epp.globalVar.validateSubFundUserURL, 
			"&userEmail="+sfuEmail+
			"&subFundId="+encodeURIComponent($curRow.data("id")), 
			th.validateFundUser);					
			return false;
		});
		$('#clear_button').live('click',function(){
			$('#sfUserForm').find('.errorMsg').html('');
		});
        $('#eCart').addClass('disabled');

		$('#includeTrueUp').live('click',function() {
            epp.fD.adjustCartForTrueUp($(this));
        });
        $('#continueUpgrade').live('click',function() {
			//window.location = epp.globalVar.viewConfigureEditionUpgradeURL;
            $('#cartItemForm [name="pageSource"]').val('configEdUpg');
            epp.fD.submitCart();
		});
        
        $('#cT .configUpg').live('click',function() {
            var obj = $(this).parents('tr').data('jData');
            vmf.loading.show({'overlay':'true'});
			vmf.ajax.post(
                epp.globalVar.validateUpgradeURL, 
                "&"+epp.globalVar.encSkuIdParam + obj.skuID + "&"+epp.globalVar.skuParam + obj.sku + "&" 
                + epp.globalVar.encSnsSkuIdParam + obj.snsSkuID + "&" + epp.globalVar.snsSkuParam + obj.snsSku, 
                epp.fD.contConfigUpg
            );
		});
        
        $('#closeInvalidUpgrade').live('click',function() {
      		vmf.modal.hide('upgradeInvalidAlert');
        });
        $('#cancelUpgrade').live('click',function() {
      		vmf.modal.hide('upgradeAlert');
        });
       
        $('#ueSnsCalcContinue').click(function() {
            vmf.modal.hide('SnSCalculation_UE');
        });
        callBack.addsc({'f':'riaLinkmy','args':[epp.globalVar.pageName]});
	},//end of init
    contConfigUpg: function() {
		vmf.loading.hide();
        $('#cartItemForm [name="pageSource"]').val('reconfigEdUpg');
        epp.fD.submitCart();
    },
	clearUpgradeSession:function(){
	    vmf.ajax.post(epp.globalVar.clearUpgradeDetailsURL,null,function(){},function(){alert(epp.globalVar.genericErrorMsg)})
		vmf.modal.hide(); 
	},
	checkPartnerAdded:function(val){
		return ($.inArray(val, th.arrPartnerList) == -1)?false:true;
	},
	validatePartnerInfo:function(pN, pC){
		var bPn = false, bPc = false, patt=/[0-9a-zA-Z]/;
		$(pN).parent().parent().find('label.errmsg').remove();
		if(!patt.test($.trim($(pN).val()))){
			$(pN).after('<label class="errmsg" for="partnerName">'+epp.globalVar.enterValidName+'</label>');
		}else if(!$.trim($(pN).val()).length || $.trim($(pN).val()).length <= 2){
			$(pN).after('<label class="errmsg" for="partnerName">'+epp.globalVar.partnerNameErrorMsg+'</label>');
		}else{$(pN).parent().find('label.errmsg').remove(); bPn = true;}
		if($(pC).val() == "SelectOne"){
			$(pC).parent().after('<label class="errmsg" for="partnerCountry">'+epp.globalVar.partnerCountryErrorMsg+'</label>');
		}else{$(pC).parent().parent().find('label.errmsg').remove(); bPc = true;}
		if(bPn && bPc) return true; else return false;
	},
	validateFundUser : function(jData){	
		 if (jData!=null && jData.FundDetails != undefined){
			var oData = jData.FundDetails,
				nRD = oData.aaData[0],
				$fInput = $('#sfUserForm input');
			sfFN  = nRD[1];
			sfLN  = nRD[2];
			validEMSUser = nRD[3];
			validUser = nRD[4];
			userId = nRD[5];
			$('#changeSubFundUser').find('.loadingWrapper').remove();
			th.submitSFUForm(sfuEmail, sfFN, sfLN);
			$fInput.focusout();
			if (validUser=="true"){
				$('#sf_submitDetail').show().find('#newSFMail').html(sfuEmail).end().find('#newSFN').html(sfFN + " " + sfLN);
				epp.common.toggleButton($("#sfUContinue"), true);
				if(validEMSUser=="true") {
					$("#sf_success3, #sf_submitDetail, #sfReset, #sf_warning, #emsUser").show();
					$("#sf_inst, #sf_fail1, #sf_success1, #sf_error, #sf_invitation, #mvUser").hide();						
				}
				else{
					$('#sf_submitDetail').show().find('#newSFMail').html(sfuEmail).end().find('#newSFN').html(sfFN + " " + sfLN);
					$("#sf_success1, #sf_warning, #mvUser").show();
					$("#sf_inst, #sf_fail1, #sf_success3, #sf_error, #sf_invitation, #emsUser").hide();
					$("#sfUserForm").parents('.sec_content').addClass('disabled').find("input[type='text']").addClass('disabled').attr('disabled','true');
					$('#sfReset').show();
				}
			}  			
			else {
				th.showChangeSFWin();
				$('#sf_submitDetail').show().find('#newSFMail').html(sfuEmail).end().find('#newSFN').html(sfFN + " " + sfLN);
				$("#sf_inst, #sf_success1, #sf_fail1, #sf_success3, #sf_warning, #sf_invitation").hide();
				$('#sf_submitDetail, #sf_error').show();
				$("#sfUserForm").parents('.sec_content').addClass('disabled').find("input[type='text']").addClass('disabled').attr('disabled','true');
				$('#sfReset').show();
			}
			$('#sfUserForm').parents('.sec_content').addClass('disabled').find('input[type=text],button').addClass('disabled').attr('disabled',true);
			$('#sfReset').show();
		}else{
			$('#changeSubFundUser').find('.loadingWrapper').remove();
			$('#sf_submitDetail').show().find('#newSFMail').html(sfuEmail).end().find('#newSFN').html(sfFN + " " + sfLN);
			$('#sf_fail1').show();
			$("#sf_inst, #sf_success1, #sf_success3, #sf_invitation, #sf_error").hide();
		}
	},
	updateFundName: function(jData){
		if(jData.GenericJSON) {
			$('#fnName').html(unescape(editFundName));
		}else{
			$('#editFundErrorMsg').html(epp.globalVar.editFundNameErrorMsg);
		}
		//vmf.loading.hide();
	},
	showChangeSFWin:function(){
		var curSubFundName = $('#tbl_eppCurFundsDetails').find('tr.active td:eq(0)').text();
		$('#subfundName').text(curSubFundName);
		var curSbFnUser = $('#tbl_eppCurFundsDetails').find('tr.active td:eq(1)').text();
		$('#currentFundUser').text(curSbFnUser);
		sfuEmail = $.trim($('#sfUserForm #sfFMail').val());
		sfFN = $.trim($('#sfUserForm #sfFName').val());
		sfLN = $.trim($('#sfUserForm #sfLName').val());
	},
	updateSubFundUser: function(jData){
		if((jData.GenericJSON != null) && jData.GenericJSON){
			vmf.modal.hide('changeSubFundUser');
			th.getSubFundDetails();
			th.enableEppWidget();
		}
		else {
			$('#sf_submitDetail').show().find('#newSFMail').html(sfuEmail).end().find('#newSFN').html(sfFN + " " + sfLN);
			$("#sf_inst, #sf_invitation, #sf_warning, #sfReset").hide();
			$('#sf_errorMsg, #sf_errorMsg').show();
			epp.common.toggleButton($('#sfUContinue'), false);
			$('#sf_submitDetail, #sf_fail1, #sf_warning, #sfReset').show();	
		}
		//vmf.loading.hide();
	},
	enableEppWidget: function() {
        var dt = {emailAddress : sfuEmail}
				var enableEPPWidgetUrl = (location.protocol + '//'+location.hostname + epp.globalVar.enableEPPWidgetAjaxUrl);
				if(epp.globalVar.enableEPPWidgetAjaxUrl.length){
					vmf.ajax.post(enableEPPWidgetUrl,dt,function(jData){
						if(jData != null){ 
												
						}
					});
				}
    },
	manipSnSCalc: function($this){
		var $cR = $this.closest('tr');
		var snsTokens = parseFloat($(".sTotal", $cR).attr("oVal")), snsDuration, nVal=$cR.find(".mQty .tknVal").val();
		//Try to get snsduration for current row, if not present get from prodlist
                if($cR.attr('snsDur') != undefined && $cR.attr('snsDur') != null) {
                    snsDuration = $cR.attr('snsDur');
                }
                else {
                    snsDuration = $('#prodList .'+$cR.attr('liref')).data('jData').snsDuration;
                }
		$("#numTokens").html(epp.fD.getFixedFloat(snsTokens));
		$("#snsDur").html(snsDuration);
		$("#numDays").html(epp.fD._daysInYear);
		$(".actual .quanity").html(nVal);
		$(".actual .total").html(epp.fD.getFixedFloat(epp.fD.calcSnsTotalTokens(snsTokens,nVal,snsDuration)));
	},
	manipEUSnSCalc: function($this) {
	 	var $cR = $this.closest('tr'), ueSnsModal = $("#SnSCalculation_UE");
		var snsTokens = epp.fD.getFixedFloat($(".sTotal", $cR).attr("oVal")), snsDuration, 
			snsCr = epp.fD.getFixedFloat($cR.data('jData').snsCredit), 
			nVal = parseInt($cR.find(".mQty .tknVal").val());
		//Try to get snsduration for current row, if not present get from prodlist
        if($cR.attr('snsDur') != undefined && $cR.attr('snsDur') != null) {snsDuration = parseInt($cR.attr('snsDur'));}
        else {	snsDuration = parseInt($('#prodList .'+$cR.attr('liref')).data('jData').snsDuration);}
		ueSnsModal.find("#numTokens").html(snsTokens);
		ueSnsModal.find("#snsDur").html(snsDuration);
		ueSnsModal.find("#numDays").html(epp.fD._daysInYear);
		ueSnsModal.find("#snsCr").html(snsCr);
		ueSnsModal.find(".actual .quanity").html(nVal);
        var actTot = epp.fD.calcSnsTotalTokens(snsTokens,nVal,snsDuration) - snsCr;
		ueSnsModal.find(".actual .total").html(epp.fD.getFixedFloat(actTot));
    },
    manipPIRGSnSCalc: function($this) {
	 	var $cR = $this.closest('tr'), piRGSnsModal = $("#SnSCalculation_PIRG");
		var snsTokens = epp.fD.getFixedFloat($(".sTotal", $cR).attr("oVal")), 
            snsDuration = epp.globalVar.fullTermSnSDuration, 
			partialSnSApplied = epp.fD.getFixedFloat(parseFloat($cR.data('jData').partialSnSApplied)), 
			nVal = parseInt($cR.find(".mQty .tknVal").val());
		piRGSnsModal.find("#numTokens").html(snsTokens);
        piRGSnsModal.find("#snsDur").html(snsDuration);
        //Fix for display purpose
        var snsTotalTokens = epp.fD.calcSnsTotalTokens(snsTokens,nVal,snsDuration);
        var snsTokenBalance =  epp.fD.getFixedFloat(snsTotalTokens) - partialSnSApplied;
		piRGSnsModal.find("#snsCr").html(epp.fD.getFixedFloat(snsTokenBalance)); 
		piRGSnsModal.find(".actual .quanity").html(nVal);
		piRGSnsModal.find("#rgIncTotal").html(partialSnSApplied);
    },
    manipPIEUSnSCalc: function($this) {
	 	var $cR = $this.closest('tr'), piEUSnsModal = $("#SnSCalculation_PIEU");
		var snsTokens = epp.fD.getFixedFloat($(".sTotal", $cR).attr("oVal")), snsDuration, 
            snsCr = epp.fD.getFixedFloat($cR.data('jData').snsCredit), 
            snsTokenBalance = epp.fD.getFixedFloat(parseFloat($cR.data('jData').snsTokenBalance)),
			netSnSTokenBalance = epp.fD.getFixedFloat(parseFloat($cR.data('jData').snsTokenBalance)+parseFloat(snsCr)), 
			nVal = parseInt($cR.find(".mQty .tknVal").val());
        //Try to get snsduration for current row, if not present get from prodlist
        if($cR.attr('snsDur') != undefined && $cR.attr('snsDur') != null) {snsDuration = parseInt($cR.attr('snsDur'));}
        else {	snsDuration = parseInt($('#prodList .'+$cR.attr('liref')).data('jData').snsDuration);}
		piEUSnsModal.find("#numTokens").html(snsTokens);
		piEUSnsModal.find("#snsCr").html(snsCr);
        piEUSnsModal.find("#snsTok").html(snsTokenBalance);
        piEUSnsModal.find("#snsDur").html(snsDuration);
        piEUSnsModal.find("#numDays").html(epp.fD._daysInYear);
		piEUSnsModal.find(".actual .quanity").html(nVal);
        var actTot = epp.fD.calcSnsTotalTokens(snsTokens,nVal,snsDuration) - parseFloat(netSnSTokenBalance);
		piEUSnsModal.find("#euIncTotal").html(epp.fD.getFixedFloat(actTot));
    },
    manipTermLicCalc: function($this){
		var cR = $this.closest('tr');
		var termLicTokens = parseFloat($(".mTkns", cR).text()), termLicDuration, nVal=cR.find(".mQty .tknVal").val();
		//Try to get termLicDuration for current row, if not present get from prodlist
                if(cR.attr('termLicDur') != undefined && cR.attr('termLicDur') != null) {
                    termLicDuration = cR.attr('termLicDur');
                }
                else {
                    termLicDuration = $('#prodList .'+cR.attr('liref')).data('jData').termLicense.termDuration;
                }
		$("#termLicNumTokens").html(epp.fD.getFixedFloat(termLicTokens));
		$("#termLicDur").html(termLicDuration);
		$("#termLicTknQty").html(nVal);
		$("#termLicTotal").html(epp.fD.getFixedFloat(epp.fD.calcTermLicTotalTokens(termLicTokens,nVal,termLicDuration)));
	},
    getSubFundDetails: function() {
		//_subFundIds = [];
        if(!($('#tbl_eppCurFundsDetails').find('tbody tr').length)) {
            vmf.datatable.build($('#tbl_eppCurFundsDetails'),{
                "aoColumns": [
                    {"sTitle": epp.globalVar.subFundLabel+"<div class='th_set_cog'><div class='settings-cog'><a class='cog custom-cog custom-cog-icon' href='#'>Actions</a><div class='dropdown'><ul><li><span><a id='csfund' href=''>"+epp.globalVar.createSubFundLabel+"</a></span></li><li class='inactive'><span><a id='rsfund'  href=''>"+epp.globalVar.renameSubFundLabel+"</a></span></li><li class='inactive'><span><a id='dsfund' href=''>"+epp.globalVar.deleteSubFundLabel+"</a></span></li></ul></div></div></div>","sClass":"gear_icon","sWidth":"319px","bSortable":false},
                    {"sTitle": epp.globalVar.fundUserLabel+"<div class='th_set_cog'><div class='settings-cog'><a class='cog custom-cog custom-cog-icon' href='#'>Actions</a><div class='dropdown'><ul><li class='inactive'><span><a id='cfuser' href=''>"+epp.globalVar.changeSubFundLabel+"</a></span></li></ul></div></div></div>","sClass":"gear_icon","sWidth":"280px","bSortable":false},
                    {"sTitle": "<span class='descending'>"+epp.globalVar.tokenRemainingLabel+"</span>","sWidth":"190px"}
                ],
                "oLanguage": {
                    "sEmptyTable":'<div id="loadingerrormsg"><div id="innerMsg" class="error_innermsg"><p>'+epp.globalVar.noActiveFundLabel+'</p><p>'+epp.globalVar.moreInformationLabel+' <a href="#" class=\"nWindowIcon\">'+epp.globalVar.vppHomepageLabel+'</a></p></div></div>',
                    "sProcessing":epp.globalVar.loadingLabel,
                    "sLoadingRecords":""
                },
                "sAjaxSource":epp.globalVar.subFundSummaryURL,
                "fnServerParams": function ( aoData ) {
                    aoData.push( { "name": "encFundID", "value": epp.globalVar.encFundId } );
                },
                "bInfo":false,
                "bProcessing": true,
                "bServerSide": false,
                "bAutoWidth" : false,
                "sDom": 'zrtSpi',
                "bFilter":false,
                "bPaginate": false,
                "sScrollY": "225px",
                "aaSorting": [],
                "fnRowCallback": function(nRow,aData,iDisplayIndex){ 
                    var $nRow=$(nRow);
                    $nRow.data({'per':vmf.json.txtToObj(aData[3]),'id':aData[5]});
                    $nRow.click(function(){th.setPermissions($nRow);});
                    if($.trim(aData[4]).length && aData[4] == 1){
						$nRow.addClass('primary').find('td:eq(0)').html("<span class='primaryTxt'>"+aData[0]+"</span><span class=\"tooltiptext badge asp\" title=\""+epp.globalVar.primaryTooltip+"\">"+epp.globalVar.primarySubFundLabel+"</span>");
						$nRow.find('td:eq(1)').addClass('greyOut');
					};
					if($.trim(aData[4]).length && aData[4] == "1" && epp.globalVar.trueUpEnabled == 'Y' && epp.globalVar.tokensRemainingValue<=0 ){
						epp.fD.trueUpMode = true;
						$nRow.addClass('primary').find('td:eq(0)').html("<span class='primaryTxt'>"+aData[0]+"</span><span class=\"badge primary\" title=\""+"Primary"+"\">"+"Primary"+"</span>");
						$('#csfund').closest('li').addClass('inactive');
					}
					if(aData[4] != "1" && epp.globalVar.trueUpEnabled == 'Y' && epp.globalVar.tokensRemainingValue<=0){
						$nRow.addClass('grayOut').find('td:eq(0)').html('<span class=\"tooltiptext\">'+aData[0]+'</span>');
						$nRow.addClass('grayOut').find('td:eq(1)').html('<span class=\"tooltiptext\">'+aData[1]+'</span>');
						$nRow.addClass('grayOut').find('td:eq(2)').html('<span class=\"tooltiptext\">'+aData[2]+'</span>');
						$nRow.find('td .tooltiptext').attr('title',epp.globalVar.trueupsubfundbadge);	
					}			
                    return nRow;
                },
                "fnInitComplete": function (aoData) {
					_dt = this;
                    myvmware.hoverContent.bindEvents($('.tooltiptext'), 'defaultfunc');
				   
                    th.bindHoverEffects(this);
				    if(epp.fD.trueUpMode){
					   _dt.find('.tooltiptext').unbind('click').bind('click',function(){
							return true;
						})
					}
                    //$('#tbl_eppCurFundsDetails').not('.initialized').addClass('initialized');
					//on condition of fund user logged in
					var settings= this.fnSettings();					
					if(settings.jqXHR && settings.jqXHR.responseText!==null && settings.jqXHR.responseText.length && typeof settings.jqXHR.responseText =="string"){
						th.FundDetails = vmf.getObjByIdx(vmf.json.txtToObj(settings.jqXHR.responseText),0);
						//Disabling Transfer Tokens option in I want to selection when sub-fund is only one.
						if(th.FundDetails.aaData.length == 1 ) {
							$('#sfIwantTo option[value="transfer"]').remove();
						}else if(epp.globalVar.tokensRemaining == '0.00' && !epp.fD.trueUpMode){
							$('#sfIwantTo option[value="transfer"]').remove();
						}else{
							if(!$('#sfIwantTo option[value="transfer"]').length){$('#sfIwantTo option[value="viewsubfund"]').after('<option value="transfer">Transfer Tokens</option>');}
						};
						if(th.FundDetails.userType != "FO") {
							$('#csfund').closest('li').addClass('inactive');
							$('#sfIwantTo option[value="transfer"]').remove();
						}
						else return;
					}
                }
            });
        } else { // reloading the table
			vmf.datatable.reload($('#tbl_eppCurFundsDetails'), epp.globalVar.subFundSummaryURL, th.resetSFGearMenu(), "POST",{"encFundID":epp.globalVar.encFundId},th.reloadError);
		}
		kbUrl = epp.globalVar.kbUrlViewFunds;
    },
	resetSFGearMenu:function(){
		$('#tbl_eppCurFundsDetails_wrapper .th_set_cog li a').not('#csfund').closest('li').addClass('inactive');
	},
	setPermissions:function(trObj){
		var dt = trObj.data('per');
		for (var key in dt) {
			$('#'+key).closest('li').removeClass("inactive").addClass(dt[key]?"":"inactive");
			//Adding tooltips when it is inactive
			$('#'+key).closest('span').addClass(dt[key]?"":"tooltiptext"); 
			if(dt[key]){
				$('#'+key).closest('span.tooltiptext').removeClass('tooltiptext').removeAttr('title').unbind('mouseenter mouseleave');
				//myvmware.hoverContent.unbindEvents($('#'+key).closest('span'));
			}else{
				if(key == 'dsfund'){
					$('#'+key).parent().attr('title',epp.globalVar.deleteSubFundTooltip);
				}else if(key == 'rsfund'){
					$('#'+key).parent().attr('title',epp.globalVar.renameSubFundTooltip);
				}else if(key == 'cfuser'){
					$('#'+key).parent().attr('title',epp.globalVar.changeSubFundUserTooltip);
				}else if(key == 'csfund'){
					$('#'+key).parent().attr('title',epp.globalVar.createSubFundTooltip);
				}
				myvmware.hoverContent.bindEvents($('#'+key).closest('span.tooltiptext'), 'funcleft');
			}
			
		}
	},
	bSelect: function(selObj){ //This function is to create Sub-fund select box.
		vmf.ajax.post(epp.globalVar.transerTokensURL,null,function(data){
			var oList=[],jData=data.SubFundDetails;
			th.jSelect=jData // Storing in global array
			if (jData!=null){ 
				//Check if it is a proper json response
				oList.push('<option value="selectOne" tnum="0">Select One</option>');
				$.each(jData, function(i,v){
				oList.push("<option value='"+v.subFundId+"' tnum='"+v.subFundTokensRemaining+"' fname='"+v.subFundName+"'>"+v.subFundName+" - "+v.subFundTokensRemaining+" tokens</option>");
				}); 
				// changed v.tokens to v.subFundTokensRemaining, to display remaining tokens
				selObj.append(oList.join(''));
				$("select#sfFrom option[tnum='0.00'][value!='selectOne'], select#sfFrom option[tnum='0'][value!='selectOne']").remove();
			} else if(data.ERROR_CODE.length != null && data.ERROR_CODE.length) {
				$('#transferTokens').hide();$('#noTransferTokens').show();
			} else{alert(epp.globalVar.errorSubfundDetails);}
		},function(){alert(epp.globalVar.errorSubfundDetails)});
	},
	showloading :function(){return sOut="<div class='loadWraper' style='text-align:center; padding-left:40%'><div class='loading_big'>"+epp.globalVar.loadingLabel+"</div></div>";},
	submitSFUForm: function(sfuEmail, sfFN, sfLN){
		$('#sf_inst').hide();
		$('#sf_submitDetail').show().find('#newSFMail').html(sfuEmail).end().find('#newSFN').html(sfFN + " " + sfLN);
		//$('#sfUContinue').attr('disabled',false).removeClass('disabled').click(function(){
			//vmf.modal.hide('changeSubFundUser');
		//});
		return false;
	},
	bindHoverEffects: function(tableobj,sType){
		$(tableobj).find(">tbody>tr:not('.dynamicRow, .disabled')").die('click').live('mouseover mouseout click',function(e){
			e.preventDefault();
			if($(this).is(".dynamicRow, .disabled, .inactive")) return;
			if(e.type=="mouseover"){$(this).addClass("hover");} 
			else if (e.type=="mouseout"){$(this).removeClass("hover");} 
			else {
				if(sType == 'multi'){
					if($(this).hasClass('active')) $(this).removeClass('active').find('td:eq(0) input').attr('checked',false);
					else $(this).addClass('active').find('td:eq(0) input').attr('checked',true);
					epp.fD.ua.validateQty();
				}else{
					$(this).siblings().removeClass("active");
					$(this).addClass("active");
				}
				(tableobj.attr('id')=='tbl_rpSummary' && $(this).data('cur') != 'true')?$('#delPartner').parent().removeClass('inactive'):$('#delPartner').parent().addClass('inactive');
				if(tableobj.attr('id')=='licenseTbl') epp.fD.ua.calcPartial($(this));
			}
		});
	},
    getCartItemsProducts: function() {
        //Building query string/post data here....
		vmf.ajax.post(epp.globalVar.cartItemSummaryURL, null, epp.fD.prodCart, epp.fD.errorRes);
    },
    prodCart: function(data) {
        if(data != "undefined" && data.CartItemSummary != null && data.CartItemSummary.cartItemList != null) {
            var cItemList = data.CartItemSummary.cartItemList;
            for(var idx in cItemList) {
                epp.fD.addToCart(cItemList[idx]);
            }
            if(cItemList.length > 0) {
                $('#eCart').removeClass('disabled');
            }
            if(data.CartItemSummary.trueUpActive) {
                $("#includeTrueUp").attr("checked",true);
                epp.fD.adjustCartForTrueUp($("#includeTrueUp"));
            }
        }
        epp.fD.getProducts();
    },
	getProducts: function(){
		//Building query string/post data here....
        $('#prodTreeLoading').removeClass('hidden');
		vmf.ajax.post(epp.globalVar.productFamilyURL, null, epp.fD.prodTree, epp.fD.errorRes);
	},
	prodTree: function(data){ //This is to create Redemption sku/products Tree structure
        $('#prodTreeLoading').addClass('hidden');
		var prodJson= data.ProductFamily, aTree=[];
		if (prodJson.length>0){
			$.each(prodJson, function(i,item){
				aTree.push("<li class=\"level0\"><span class=\"pName\"><a class=\"openClose\" class=\"pName\"></a>"+item.productFamilyName+"</span>");
				if(item.productLine.length>0){
					aTree.push("<ul style=\"display:none;\">");
					$.each(item.productLine, function(j, prodData){
						aTree.push("<li class=\"level1\"><span pCode="+prodData.productLineCode+" class=\"pName\"><a class=\"openClose\"></a>"+prodData.productName+"</span></li>");  
					});
					aTree.push("</ul>");
				}
				aTree.push("</li>");
			});
			$("#prodList ul").html(aTree.join(''));
            $('#prodList').scrollTop(0);
		} else {
			$("#prodList ul").html("<li class=\"level0\"><span class=\"pName\">" + epp.globalVar.msgNoProductFamilies + "</span></li>");
		}
		epp.fD.bindEvents(); //bind click event for expand/collapse button
	},
	bindEvents: function(){
		$("#prodList a.openClose").unbind('click').bind('click',function(e){
			if($(this).parent().next("ul").length){ //toggle next ul if available
				$(this).toggleClass("open").parent().next().animate({ height: 'toggle', opacity: 'toggle'});
			} else { //If next ul is not available, send the request to server
				$(this).toggleClass("open");
                if($(this).hasClass("open")) {
                    vmf.ajax.post(epp.globalVar.skuDetailsListURL+"&productLineCode="+$(this).parents('.pName').attr('pCode'),null,epp.fD.leafNode($(this).closest('li')),epp.fD.errorNode);
                }
			}
			e.preventDefault();
			e.stopPropagation();
		});
		$('#cT .tknVal').live('keypress',function(e){
			if(e.which == epp.fD._ENTER_KEY) $('#cCart').not('.disabled').trigger('click');			
		});
	},
	errorRes: function(){
        $('#prodTreeLoading').addClass('hidden');
		$("#prodList ul").html("<li class=\"level0\"><span class=\"pName\">" + epp.globalVar.msgNoProductFamilies + "</span></li>");
	},
	leafNode: function(liNode){ //This is to create leaf node
		liNode.find('span').append('<ul class="loading"><li class="loading_text"><span class="loading_small no-border">'+epp.globalVar.loadingLabel+'</span></li></ul>');
		return function(res) {
            if(liNode.parent().hasClass('fContent')) {
                $('#prodTreeLoading').addClass('hidden');
            }
            if(res.ERROR_MESSAGE) {
                liNode.find("ul.loading").remove();
            }
			var leafJson, aTree=[], icClass="", isSearch = false;
            if(res.ProductDetails) {
                leafJson = res.ProductDetails;
            }
            else {
                leafJson = res.SearchResult;
                isSearch = true;
            }
			if(leafJson && leafJson.length){
				var ulList=$("<ul></ul>");
				$.each(leafJson, function(i,item){
					if (epp.fD._inCart.length && $.inArray(item.sku, epp.fD._inCart)!=-1){
						icClass="inCart";
					}
                    if(item.snsSku != "" && ( item.isFutureAllowed  || (epp.globalVar.trueUpEnabled == 'Y' && epp.globalVar.tokensRemainingValue == 0))) {
                        ulList.append($('<li class="level2 clearfix '+item.sku+' '+icClass+'"><div class="prTitle clearfix"><h4>'+item.sku+'</h4><div class="fnTitle">'+item.skuTokens + ' '+epp.globalVar.tokensandsnstokens+'</div></div><div class="addBtn"><button class="secondary addCart">'+epp.globalVar.addToCartMsg+'</button></div><div class="prDisc clearfix">'+item.skuDesc+'</div><div class="linkedProd clearfix"><h4>'+item.snsSku+'</h4><div class="subProDisc">'+item.snsSkuDesc+'</div><div class="showSNS clearfix"><span class="snsTime">'+epp.globalVar.snsduration+'</span><span class="snsVal">&#160;'+item.snsDuration+'  days</span></div></div></li>').data("jData",item));
                    }
                    else {
                        if(item.termLicense.isTerm) {
                            ulList.append($('<li class="level2 clearfix '+item.sku+' '+icClass+'"><div class="prTitle clearfix"><h4>'+item.sku+'</h4><div class="fnTitle">'+item.skuTokens +' '+epp.globalVar.tokens+'</div></div><div class="addBtn"><button class="secondary addCart">'+epp.globalVar.addToCartMsg+'</button></div><div class="prDisc clearfix">'+item.skuDesc+'</div><div class="showSNS clearfix"><span class="snsTime">'+epp.globalVar.termduration+'</span><span class="snsVal">&#160;'+item.termLicense.termDuration+'  days</span></div>').data("jData",item));
                        } else {
                            ulList.append($('<li class="level2 clearfix '+item.sku+' '+icClass+'"><div class="prTitle clearfix"><h4>'+item.sku+'</h4><div class="fnTitle">'+item.skuTokens +' '+epp.globalVar.tokens+'</div></div><div class="addBtn"><button class="secondary addCart">'+epp.globalVar.addToCartMsg+'</button></div><div class="prDisc clearfix">'+item.skuDesc+'</div>').data("jData",item));
                        }
                    }
					if (icClass=="inCart"){ 
						ulList.find("li."+item.sku+" button").replaceWith('<div class="cartMsg">'+epp.globalVar.inCartMsg+'</div>');
						icClass="";
					}
				});
				liNode.append(ulList).find("ul.loading").remove();
			}
            else if(leafJson && leafJson.length == 0) {
                liNode.find("ul.loading").remove();
				$("#instText .instText").eq(0).hide();
				$("#instText").show();				
				$('#filterNoResults').removeClass('hidden');
            }
		};
	},
	errorNode: function(liNode){
        $('#prodTreeLoading').addClass('hidden');
        alert(epp.globalVar.errorInResponse);
        $("#prodList a.openClose").closest('li').find("ul.loading").remove();
    },
	addToCart: function(obj){
		epp.fD._inCart.push(obj.sku);
		
		if(obj.upgradeFlag == true) epp.fD.upgradeFlagArr.push('Y');
		else epp.fD.upgradeFlagArr.push('N');
		
		if(typeof obj.skuQuantity != undefined && obj.skuQuantity != null) epp.fD._inCartQty.push(obj.skuQuantity);
        else epp.fD._inCartQty.push(epp.globalVar.defaultQty);
        var tknQty = epp.fD._inCartQty[epp.fD._inCartQty.length-1];
        epp.fD._inCartSkuIdList.push(obj.skuID);
        if(obj.snsSku != "") {
            //addToCart functionality here
            $("#cT tbody").append('<tr liRef='+obj.sku+'><td class="skuProd clearfix tooltiptext"><div class="mItem">'+obj.sku+'</div><div class="sItem">'+obj.snsSku+'</div></td><td class="tkns clearfix"><div class="mTkns">'+epp.fD.getFixedFloat(obj.skuTokens)+'</div><div class="sTkns">'+epp.fD.getFixedFloat(obj.snsSkuTokens)+'</div><div class="blankTkns"></div></td><td class="tkns clearfix"><div class="mQty"><input type="text" class="tknVal" pattern="[0-9]*" value="' + tknQty + '" /></div><div class="sQty"><input type="text" class="tknVal readOnlyQty" pattern="[0-9]*" value="' + tknQty + '" disabled="true" /></div><div class="blankQty"></div></td><td class="tkns clearfix"><div class="mTotal" oVal='+obj.skuTokens+'>'+obj.skuTokens+'</div><div class="sTotal" oVal='+obj.snsSkuTokens+'><a>'+obj.snsSkuTokens+'</a><span></span></div></td><td><a href="#" class="dCart"></a></td></tr>');
            var curTr = $("#cT tbody tr").last();
            
            if(obj.termLicense != undefined && obj.termLicense.isTerm) {
                var termLicCalTok = epp.fD.calcTermLicTotalTokens(parseFloat(obj.skuTokens),parseFloat(tknQty),parseFloat(obj.termLicense.termDuration));
                curTr.find('.mTotal').text(epp.fD.getFixedFloat(termLicCalTok)).attr('oval',epp.fD.getFixedFloat(termLicCalTok)).wrap('<a href=\"#\" class=\"termLicModal\"');
                curTr.attr('termLicDur',obj.termLicense.termDuration);
            }
            if(typeof obj.skuQuantity != undefined && obj.skuQuantity != null) {
                if(obj.termLicense != undefined && !obj.termLicense.isTerm) curTr.find('.mTotal').text(epp.fD.getFixedFloat(parseFloat(obj.skuTokens)*parseInt(obj.skuQuantity)));
                var snsCalTok = epp.fD.calcSnsTotalTokens(parseFloat(obj.snsSkuTokens),parseFloat(obj.skuQuantity),parseFloat(obj.snsDuration));
                if(snsCalTok != "") {
                    curTr.find('.sTotal a').text(epp.fD.getFixedFloat(snsCalTok));
                }
                curTr.attr('snsDur',obj.snsDuration);
            }
            else {
				var snsCalTok = epp.fD.calcSnsTotalTokens(parseFloat(obj.snsSkuTokens),parseFloat(epp.globalVar.defaultQty),parseFloat(obj.snsDuration));
                if(obj.termLicense != undefined && !obj.termLicense.isTerm) curTr.find('.mTotal').text(epp.fD.getFixedFloat(parseFloat(obj.skuTokens)*parseInt(epp.globalVar.defaultQty)));
                if(snsCalTok != "") {
                    curTr.find('.sTotal a').text(epp.fD.getFixedFloat(snsCalTok));
                }
				curTr.attr('snsDur',obj.snsDuration);
            }
			/*if(!obj.isFutureAllowed && parseFloat(epp.globalVar.tokensRemainingValue) > 0) {
                curTr.find('.sTkns').html(epp.globalVar.nofutureindicator);
                if(obj.snsCredit > 0) {
                    //curTr.find('.sTotal').html('<a>' + -1 * obj.snsCredit + '</a>'); Change done to match FRD, need to revisit after BA confirmation
                    curTr.find('.sTotal').html(epp.globalVar.futureincluded);
                } else {
                    curTr.find('.sTotal').html(epp.globalVar.futureincluded);
                }
				curTr.find('.sQty input').val(epp.globalVar.nofutureindicator);
				curTr.find('.sItem').css('background','none');
				$(".sTotal", curTr).attr("oVal","");
			}*/
        }
        else {
            $("#cT tbody").append('<tr liRef='+obj.sku+'><td class="skuProd clearfix tooltiptext"><div class="mItem">'+obj.sku+'</div></td><td class="tkns clearfix"><div class="mTkns">'+epp.fD.getFixedFloat(obj.skuTokens)+'</div></td><td class="tkns clearfix"><div class="mQty"><input type="text" class="tknVal" pattern="[0-9]*" value="' + tknQty + '" /></div></td><td class="tkns clearfix"><div class="mTotal" oVal='+obj.skuTokens+'>'+epp.fD.getFixedFloat(obj.skuTokens)+'</div></td><td><a href="#" class="dCart"></a></td></tr>');
            var curTr = $("#cT tbody tr").last();
            if(obj.termLicense != undefined && obj.termLicense.isTerm) {
                var termLicCalTok = epp.fD.calcTermLicTotalTokens(parseFloat(obj.skuTokens),parseFloat(tknQty),parseFloat(obj.termLicense.termDuration));
                curTr.find('.mTotal').text(epp.fD.getFixedFloat(termLicCalTok)).attr('oval',epp.fD.getFixedFloat(termLicCalTok)).wrap('<a href=\"#\" class=\"termLicModal\" />');
                curTr.attr('termLicDur',obj.termLicense.termDuration);
            }
            if(typeof obj.skuQuantity != undefined && obj.skuQuantity != null) {
                if(obj.termLicense != undefined && !obj.termLicense.isTerm) curTr.find('.mTotal').text(epp.fD.getFixedFloat(parseFloat(obj.skuTokens)*parseInt(obj.skuQuantity)));
                curTr.attr('snsDur',obj.snsDuration);
            }
        }
        if($("#cT").is(':hidden')){ //Check if this is the first entry in cart
			$("#cT").show();
			$("#cInst").hide();
		}
        epp.fD.updateSnSCreditInCart(curTr, obj);
        
        if(curTr.find('.sTotal a').text() != '') {
            if(!epp.globalVar.futureAllowed) {
                //Prep for blank tkns
                curTr.find('.tkns .blankTkns').hide().text(epp.globalVar.nofutureindicator);
                curTr.find('.tkns .blankQty').hide().text(epp.globalVar.nofutureindicator);
                if(obj.upgradeFlag) { //Pass the original SnS total token value for Edition upgrade product without credit
                    var curSnSTotal = parseFloat(curTr.find('.sTotal a').text());
                    if(curSnSTotal < 0) {
                        epp.globalVar.netSnSCredit = epp.globalVar.netSnSCredit + (-1 * curSnSTotal);
                    }
                    epp.fD.calcCart(parseFloat(curTr.find('.mTotal').text()),curSnSTotal,curTr, true);
                } else if(epp.fD._snsTokenBalance != 0) { //If Trueup token usage for SnS has not yet started always use full-term for sns
                    var fullTermSnSDuration = epp.globalVar.fullTermSnSDuration;
                    var nVal = parseInt(curTr.find(".mQty .tknVal").val());
                    var curSnSTotal = parseFloat(epp.fD.calcSnsTotalTokens(obj.snsSkuTokens,nVal,fullTermSnSDuration));
                    epp.fD.calcCart(parseFloat(curTr.find('.mTotal').text()),epp.fD.getFixedFloat(curSnSTotal),curTr, true);
                } else {
                    //If true-up usage has started then always show co-term sns duration
                    var coTermSnSDuration = epp.globalVar.coTermSnSDuration;
                    var nVal = parseInt($(curTr).find(".mQty .tknVal").val());
                    var curSnSTotal = epp.fD.getFixedFloat(parseFloat(epp.fD.calcSnsTotalTokens(obj.snsSkuTokens,nVal,coTermSnSDuration)));
                    epp.fD.calcCart(parseFloat(curTr.find('.mTotal').text()),epp.fD.getFixedFloat(curSnSTotal),curTr, true);
                }
            }
            else {
                epp.fD.calcCart(parseFloat(curTr.find('.mTotal').text()),parseFloat(curTr.find('.sTotal a').text()),curTr, true);
            }
        } else {
            epp.fD.calcCart(parseFloat(curTr.find('.mTotal').text()),0,curTr,true);
        }
		//Populate tooltip message
		if((epp.fD.trueUpMode || ( !epp.fD.trueUpMode && obj.isFutureAllowed)) && obj.snsSku != '') $('.tooltiptext', $("tr[liRef="+obj.sku+"]")).attr('title',"<div class=\"cartTooltip\"><h1>"+obj.sku+"</h1><div class=\"skudesc\">"+obj.skuDesc+"</div><h1 class=\"prDisc\">"+obj.snsSku+"</h1><div>"+obj.snsSkuDesc+"</div><div class=\"showSNS\"><span class=\"snsTime\">"+epp.globalVar.snsduration +"</span><span class=\"snsVal\">&#160;"+obj.snsDuration+" "+ epp.globalVar.days+"</span></div></div>");
        else if(obj.termLicense.isTerm) $('.tooltiptext', $("tr[liRef="+obj.sku+"]")).attr('title',"<div class=\"cartTooltip\"><h1>"+obj.sku+"</h1><div class=\"skudesc\">"+obj.skuDesc+"</div><div class=\"showSNS\"><span class=\"snsTime\">"+epp.globalVar.termduration +"</span><span class=\"snsVal\">&#160;"+obj.termLicense.termDuration+" "+ epp.globalVar.days+"</span></div></div>");
		else $('.tooltiptext', $("tr[liRef="+obj.sku+"]")).attr('title',"<div class=\"cartTooltip\"><h1>"+obj.sku+"</h1><div class=\"skudesc\">"+obj.skuDesc+"</div><h1 class=\"prDisc\">"+obj.snsSku+"</h1><div>"+obj.snsSkuDesc+"</div></div>");
        
		myvmware.hoverContent.bindEvents($('.tooltiptext', $("tr[liRef="+obj.sku+"]")), 'funcleft', $('.tooltiptext div:eq(0)', $("tr[liRef="+obj.sku+"]")), 275); 
        
		//If Empty Cart is disabled enable it
        if($('#eCart').hasClass('disabled')) $('#eCart').removeClass('disabled');

        if(typeof riaLinkmy != "undefined") riaLinkmy(epp.globalVar.pageName + ' : redeem tokens : add to cart');
	},
    updateSnSCreditInCart: function(curTr, obj) {
        if(obj != undefined && obj != "null") {
            if(obj.upgradeFlag) {
                curTr.addClass('upgConfigTr').find('.skuProd').append('<div class="cnfLinkHolder"><a href="#" class="configUpg">' + epp.globalVar.configureUpgradeText + '</a></div>');
                curTr.find('.mQty .tknVal').attr('diabled',true).addClass('readOnlyQty');
                //Store the original value
                obj.origSnSTotalToken = parseFloat(curTr.find('.sTotal a').text());
                //if(obj.isFutureAllowed || (!obj.isFutureAllowed && parseFloat(epp.globalVar.tokensRemainingValue) == 0)) {
                    curTr.find('.sTotal a').text(epp.fD.getFixedFloat(parseFloat(curTr.find('.sTotal a').text())-obj.snsCredit));
                //}
            }
            curTr.data('jData',obj);
        }
    },
	showUpgradeAlert:function(jData){
		vmf.loading.hide();
		if(jData.UserUpgradeDetails != undefined) {
            if(jData.UserUpgradeDetails.upgradeEligible) vmf.modal.show('upgradeAlert',{onClose: function (dialog) {epp.fD.clearUpgradeSession();}});
            else vmf.modal.show('upgradeInvalidAlert');
        }else vmf.modal.show('upgradeInvalidAlert'); //place holder, might need a different modal in future
	},
    removeFromCart: function(curCart) {
        var pRow=curCart.closest('tr'); //Get the target row
		var mTkn=parseFloat(pRow.find('.mTotal').html()), sTkn=0, sku=pRow.attr('liRef'); 
        if(pRow.find('.sTotal a').length > 0 && pRow.find('.sTotal a').html() != "") {
            sTkn=parseFloat(pRow.find('.sTotal a').html())
        }
		if($("li.inCart."+sku).length){ //Update corresponding entry in tree
            var liRef=$("li.inCart."+pRow.attr('liRef'));
            liRef.find('.addBtn').html('<button class="secondary addCart">'+epp.globalVar.addToCartMsg+'</button>');
            liRef.removeClass("inCart");
        }
        //Remove SnS Credit for this item from the netSnSCredit if it is upgradable product
        if(pRow.data('jData').upgradeFlag) {
            var curSnSCredit = pRow.data('jData').snsCredit;
            epp.globalVar.netSnSCredit = epp.globalVar.netSnSCredit - curSnSCredit;
        }
        pRow.remove(); //Remove selected row
        var skuIdx = $.inArray(sku,epp.fD._inCart)
        if (skuIdx >= 0) {
            epp.fD._inCart.splice(skuIdx,1);
            epp.fD._inCartQty.splice(skuIdx,1);
            epp.fD._inCartSkuIdList.splice(skuIdx,1);
            epp.fD.upgradeFlagArr.splice(skuIdx,1);
        }
        epp.fD.calcCart(-mTkn,-sTkn, null, false); //Update counts of redeemed count
        if (!$("#cT tbody tr").length){ //Get back default text if cart is empty
            $("#cT").hide();
            $("#cInst").show();
        }
        //Check the count of cart items and add disabled for empty cart if it is empty
        if(epp.fD._inCart.length == 0) {
            $('#eCart').addClass('disabled');
        }
    },
	calcCart: function(skuValue, snsValue, curTr, addFlag){ //Calculate total redeemed tokens in cart and remaining in sub-fund
		var curCartObj=$('.tokenVal', $('.tokensInCart')), remainCartObj=$('.tokenVal', $('.tokensRemain'));
		var curCart= parseFloat(curCartObj.html()), remainCart=parseFloat(remainCartObj.html()); //cart && remaining Cart
		if(skuValue!=undefined){ //Add to Cart or Remove a cart single entry
            if(snsValue == undefined) { //If the added product doesnt have support sku
                snsValue = 0;
            }
            //Update Cart
            if(epp.globalVar.futureAllowed) {
                curCartObj.html(epp.fD.getFixedFloat(curCart+skuValue+snsValue));
                remainCartObj.html(epp.fD.getFixedFloat(remainCart-(skuValue+snsValue)));
            } else {
                curCartObj.html(epp.fD.getFixedFloat(curCart+skuValue));
                remainCartObj.html(epp.fD.getFixedFloat(remainCart-skuValue));
                if(addFlag) { //Add SnS product
                    var trueUpSnSApplied = epp.fD.adjustCartItemForSnSIncluded(parseFloat(curCartObj.html()),snsValue,curTr);
                    curCart=parseFloat(curCartObj.html());
                    curCartObj.html(epp.fD.getFixedFloat(curCart+trueUpSnSApplied));
                    epp.fD._trueUpTokenBalance = epp.fD._trueUpTokenBalance - trueUpSnSApplied;
                } else { //Remove SnS product
                    epp.fD.adjustFullCart();
                }
            }
		} else { //Calculate from Cart Table (change quantity)
			epp.fD.adjustFullCart();
		}
        var tokRemInCart = parseFloat($('.tokenVal', $('.tokensRemain')).html());
        var tokInCart = parseFloat($('.tokenVal', $('.tokensInCart')).html());
		
		if(epp.globalVar.userType=='FO' && epp.globalVar.trueUpEnabled=='Y' && $('#selectProds option:selected').attr('default')=='Y') {
			$('#activateTrueUpDiv').removeClass('hidden');
		} else {
			$('#activateTrueUpDiv').addClass('hidden');
		}
		
        if((tokRemInCart < 0 || epp.fD._snsTokenBalance < 0) && ($('#includeTrueUp').attr('disabled') || $('#includeTrueUp').attr('disabled') ==undefined || !$('#includeTrueUp').attr('checked')) && epp.globalVar.trueUpEnabled == 'Y' && epp.globalVar.trueUpAllowed) {
                //when trueup option needs to be allowed for user to check
			$('#includeTrueUp').attr('disabled',false).parent().find('a.tooltip').attr('title',epp.globalVar.checkboxTooltip);
			$('#activateTrueUpDiv').removeClass('inactive');
            if(epp.globalVar.tokensRemaining == 0 && epp.fD._inCart.length > 0) {
                epp.fD.adjustCartForPosCartVal();
            }
        } 
        else if(epp.globalVar.trueUpEnabled == 'Y' && !epp.globalVar.trueUpAllowed) {
                    //coming from transfer tokens
			$('#includeTrueUp').attr('checked',false).attr('disabled',true).parent().find('a.tooltip').attr('title',epp.globalVar.checkboxTooltip);
			$('#activateTrueUpDiv').addClass('inactive');
			if($('#selectProds').val()!="selectOne")
				remainCartObj.html(epp.fD.getFixedFloat(parseFloat($('#selectProds option:selected').attr('tnum')) - parseFloat(curCartObj.html())));
        }
        else if(epp.globalVar.trueUpEnabled == 'Y' && tokInCart <= 0) {
            //If checkbox is checked then uncheck it if cart items dont need trueup tokens
            if($('#includeTrueUp').attr('checked') && (tokRemInCart - epp.globalVar.trueUpTokensRemaining) > 0) { 
				$('#includeTrueUp').attr('checked',false).attr('disabled',true);
				$('#activateTrueUpDiv').addClass('inactive');
            }    
            //If case is in true-up mode and we have a token credit we need to hide the activateTrueUpDiv
      		if(!$('#activateTrueUpDiv').hasClass('hidden') && $('#activateTrueUpDiv .trueupText').length) $('#activateTrueUpDiv').addClass('hidden');
      
            //The tokens will be credited back as regular tokens in this case
			epp.fD.adjustCartForNegCartVal();
        }
        else if((tokRemInCart > 0 && !($('#includeTrueUp').attr('checked')))) {
            //when activate true up checkbox needs to be disabled when items removed from cart
            //and the checkbox is not already enabled
            $('#includeTrueUp').attr('checked',false).attr('disabled',true);
			$('#activateTrueUpDiv').addClass('inactive');
        } else if(tokRemInCart > 0 && $('#includeTrueUp').attr('checked') 
                && ((tokRemInCart - epp.globalVar.trueUpTokensRemaining) > 0 
                    && (epp.globalVar.futureAllowed || epp.fD._snsTokenBalance > 0))
                    && !epp.fD._crossOverPresent) {
                //When checkbox is already enabled, manually disabled and uncheck it and reperform cart calculation
			$('#includeTrueUp').attr('checked',false).attr('disabled',true);
			$('#activateTrueUpDiv').addClass('inactive');
            epp.fD.adjustCartForTrueUp($('#includeTrueUp'));
        }
		epp.fD.updateColor();
		epp.fD.calcRowSize();
        if(parseFloat(curCartObj.html()) == 0) curCartObj.html(epp.fD._fixedFloatZero); //JavaScript precision bug(inherent to IEEE 754 rounding) affecting major browsers
	},
	updateColor: function(){ //This is to update color of remaining tokens and tokens cart
		var curCartObj=$('.tokenVal', $('.tokensInCart')), remainCartObj=$('.tokenVal', $('.tokensRemain'));
		var curCart= parseFloat(curCartObj.html()), remainCart=parseFloat(remainCartObj.html()); //cart && remaining Cart
        var hasInsufficient = false;
		epp.fD.toggleContinue(false);
        var curTrList = $("#cT tbody tr").get();
        if(!epp.globalVar.futureAllowed) {
            for(var i in curTrList) {
                if($(curTrList[i]).find('.sTotal span').is(':visible')
                        && $(curTrList[i]).find('.sTotal span').text() == epp.globalVar.insufficient) {
                    hasInsufficient = true;
                    break;
                }
            }
        }
        var arrInput = $('#cT tr .mQty input.tknVal'), sumQty=0;
        $.each(arrInput, function(i,inp) {
            sumQty = sumQty + parseInt($(inp).val());
        });
		if (remainCart<0){ //insufficient funds
			curCartObj.removeClass('sFunds').addClass('isFunds');
			remainCartObj.removeClass('sFunds').addClass('isFunds');
			$('.crMsg').hide();
		} else if (remainCart>=0 && sumQty>0 && epp.fD._inCart.length > 0 
                && !hasInsufficient && epp.fD._trueUpTokenBalance >= 0){ //sufficient funds
			curCartObj.removeClass('isFunds').addClass('sFunds');
			remainCartObj.removeClass('isFunds').addClass('sFunds');
			if(parseFloat(curCartObj.html())<0){ 
				$('.crMsg').show();
			} else {
				$('.crMsg').hide();
			}
			epp.fD.toggleContinue(true);
		} else {
			curCartObj.removeClass('sFunds isFunds');
			remainCartObj.removeClass('sFunds isFunds');
			$('.crMsg').hide();
		}
	},
	calcRowSize: function(){
		if($('.tokenVal', $('#redeem_content .tokensInCart')).text().length + $('.tokenVal', $('#redeem_content .tokensRemain')).text().length >17)
			$('#redeem_content .tokensInCart').removeClass("fRight").addClass("fLeft");
		else
			$('#redeem_content .tokensInCart').addClass("fRight").removeClass("fLeft");
	},
	toggleContinue: function(flag){ //Enable or Diasable Continue button
		if (flag)
			$("#cCart").removeClass('disabled').unbind('click').bind('click',epp.fD.submitCart);
		else 
			$("#cCart").addClass('disabled').unbind('click');
	},
    //Applies SnS credit as required for FPA=N and returns SnS Tokens used from Trueup
    adjustCartItemForSnSIncluded: function(remainCart,snsValue,curTr) {
        var partialSnSApplied = 0, prevSnSTokenBalance=epp.fD._snsTokenBalance, snsInitialZeroCase = false;
        var curObj = curTr.data('jData');
        var prevSnSTokenInCart = epp.fD._snsTokenInCart;
        epp.fD._snsTokenInCart = epp.fD._snsTokenInCart + parseFloat(snsValue);
        var snsTokens = parseFloat($(".sTotal", curTr).attr("oVal")), snsDuration=epp.globalVar.coTermSnSDuration, nVal=curTr.find(".mQty .tknVal").val();
        var coTermSnSVal = epp.fD.calcSnsTotalTokens(snsTokens,nVal,snsDuration);
        if(epp.fD._snsTokenBalance >= 0) { //Find SnS token Balance
                //Pre Trueup sns item
            epp.fD._snsTokenBalance = epp.fD.getFixedFloat(epp.fD._snsTokenBalance - snsValue);
        }
        if(parseFloat(epp.globalVar.snsTokensRemainingValue) + parseFloat(epp.globalVar.netSnSCredit) == 0) {
            snsInitialZeroCase = true;
        }
        //Re-initialize partially included as false
        curObj.partiallyIncluded = false;
        if(epp.fD._snsTokenBalance >= 0) {
            epp.fD._snsTrueUpUsage = false;
            curTr.find('.sTotal a').hide();
            curTr.find('.sTotal span').removeClass('textRed').html(epp.globalVar.futureincluded).show();
            curTr.find('.tkns .sTkns').hide();
            curTr.find('.tkns .blankTkns').show();
            curTr.find('.tkns .sQty').hide();
            curTr.find('.tkns .blankQty').show();
            if(curTr.find('.tooltipIns').length) curTr.find('.tooltipIns').removeClass('tooltipIns').removeAttr('title').unbind('mouseenter mouseleave');
            return 0;
        }
        else if((epp.fD._snsTokenBalance < 0 || epp.fD._snsTrueUpUsage) && ($('#includeTrueUp').attr('checked')
                || epp.globalVar.trueUpMode)) {
            if((epp.fD._snsTrueUpUsage && !curObj.partiallyIncluded) 
                    || snsInitialZeroCase) { //Sns item using trueup tokens
                //show original value
                epp.fD._snsTokenBalance = 0;
                curTr.find('.sTotal span').removeClass('textRed').hide();
                curTr.find('.sTotal a').show();
                curTr.find('.tkns .blankTkns').hide();
                curTr.find('.tkns .sTkns').show();
                curTr.find('.tkns .blankQty').hide();
                curTr.find('.tkns .sQty').show();
                //Update SnS for coterm duration removed for display fix
                //curTr.find('.tkns .sTotal a').text(epp.fD.getFixedFloat(coTermSnSVal));
                curObj.snsDuration = snsDuration;
                curTr.data('jData',curObj);
                if(curObj.upgradeFlag) {
                    return parseFloat(coTermSnSVal - parseFloat(curObj.snsCredit));
                } else {
                    return parseFloat(coTermSnSVal);
                }
            }
            else if(epp.fD._snsTokenBalance < 0) { //Crossover sns item
                var partialSnSApplied = Math.abs(epp.fD._snsTokenBalance);
                curObj.snsTokenBalance = prevSnSTokenBalance;
                curObj.partialSnSApplied = partialSnSApplied;
                curObj.partiallyIncluded = true;
                epp.fD._snsTokenBalance = 0;
                epp.fD._snsTrueUpUsage = true;
                epp.fD._crossOverPresent = true;
                curTr.find('.sTotal a').hide();
                curTr.find('.sTotal span').removeClass('textRed').html('<a>'+epp.globalVar.partiallyincluded+'</a>').show();
                curTr.data('jData',curObj);
                curTr.find('.tkns .sTkns').hide();
                curTr.find('.tkns .blankTkns').show();
                curTr.find('.tkns .sQty').hide();
                curTr.find('.tkns .blankQty').show();
                if(curTr.find('.tooltipIns').length) curTr.find('.tooltipIns').removeClass('tooltipIns').removeAttr('title').unbind('mouseenter mouseleave');
                return partialSnSApplied;
            }
        } else if(epp.fD._snsTokenBalance < epp.fD._snsTokenInCart && !$('#includeTrueUp').attr('checked')) {
            epp.fD._snsTrueUpUsage = false;
            curTr.find('.sTotal a').hide();
            curTr.find('.sTotal span').addClass('tooltipIns').attr('title',epp.globalVar.insufficientTooltip).addClass('textRed').html(epp.globalVar.insufficient).show();
            curTr.find('.tkns .sTkns').hide();
            curTr.find('.tkns .blankTkns').show();
            curTr.find('.tkns .sQty').hide();
            curTr.find('.tkns .blankQty').show();
            myvmware.hoverContent.bindEvents($('.tooltipIns'), 'funcleft');
            return 0;
        }
    },
    adjustFullCart: function() {
        var curCartObj=$('.tokenVal', $('.tokensInCart')), remainCartObj=$('.tokenVal', $('.tokensRemain'));
        var trueUpSnSApplied = 0, excessTrueUpTokens=0;
        var newCart=0,newRemainCart=0,curSnSTotal=0,curCart= parseFloat(curCartObj.html()),remainCart=parseFloat(remainCartObj.html());
        epp.fD._snsTokenInCart = 0; //Reset to 0 and calculate again
        epp.fD._snsTokenBalance = epp.fD.getFixedFloat(parseFloat(epp.globalVar.snsTokensRemainingValue));
        epp.globalVar.netSnSCredit = 0; //Reset netSnsCredit back to 0 as it will be re-calculated realtime
        epp.fD._snsTrueUpUsage = false;
        epp.fD._trueUpTokenBalance = parseFloat(epp.globalVar.trueUpTokensRemaining);
        $.each($("#cT tbody tr"), function(c,curTr){
            if($(curTr).find('.sTotal a').length > 0 && $(curTr).find('.sTotal a').html() != epp.globalVar.nofutureindicator) {
                //Cart Total
                var obj = $(curTr).data('jData');
                if(epp.globalVar.futureAllowed) {
                    newCart = newCart + parseFloat($(curTr).find('.mTotal').html()) + parseFloat($(curTr).find('.sTotal a').html());
                } else {
                    newCart = newCart + parseFloat($(curTr).find('.mTotal').html());
                    //SnS tokens
                    if(obj.upgradeFlag) { //If it is upgrade product original SnS Total tokens needs to be used
                        curSnSTotal = epp.fD.getFixedFloat(parseFloat($(curTr).find('.sTotal a').text()));
                        if(curSnSTotal < 0) {
                            epp.globalVar.netSnSCredit = epp.globalVar.netSnSCredit + (-1 * parseFloat(curSnSTotal));
                        }
                    } else if(epp.fD._snsTokenBalance != 0) { //If Trueup token usage for SnS has not yet started always use full-term for sns
                        var fullTermSnSDuration = epp.globalVar.fullTermSnSDuration;
                        var nVal = parseInt($(curTr).find(".mQty .tknVal").val());
                        curSnSTotal = epp.fD.getFixedFloat(parseFloat(epp.fD.calcSnsTotalTokens(obj.snsSkuTokens,nVal,fullTermSnSDuration)));
                    } else {
                            //If true-up usage has started then always show co-term sns duration
                        var coTermSnSDuration = epp.globalVar.coTermSnSDuration;
                        var nVal = parseInt($(curTr).find(".mQty .tknVal").val());
                        curSnSTotal = epp.fD.getFixedFloat(parseFloat(epp.fD.calcSnsTotalTokens(obj.snsSkuTokens,nVal,coTermSnSDuration)));
                    }
                    newRemainCart = epp.fD.getFixedFloat(remainCart-parseFloat((newCart-curCart).toFixed(2)));
                    trueUpSnSApplied = epp.fD.adjustCartItemForSnSIncluded(newRemainCart,epp.fD.getFixedFloat(curSnSTotal),$(curTr));
                    epp.fD._trueUpTokenBalance = epp.fD._trueUpTokenBalance - trueUpSnSApplied;
                    if(trueUpSnSApplied > 0) {
                        newCart = newCart + trueUpSnSApplied;
                    }
                }
            }
            else {
                //Sku tokens
                newCart = newCart + parseFloat($(curTr).find('.mTotal').html());
            }
        });
        if(epp.fD._trueUpTokenBalance < 0) {
            excessTrueUpTokens = Math.abs(epp.fD._trueUpTokenBalance);
        }
        //Update current cart
        curCartObj.html(epp.fD.getFixedFloat(newCart));
        //Update remaining cart
        if(epp.globalVar.futureAllowed) {
            if($('#includeTrueUp').attr('checked')) {
                remainCartObj.html(epp.fD.getFixedFloat(parseFloat($('#selectProds option:selected').attr('tnum')) +
                    parseFloat(epp.globalVar.trueUpTokensRemaining)-parseFloat((newCart).toFixed(2))));
            } else {
                remainCartObj.html(epp.fD.getFixedFloat(remainCart-parseFloat((newCart-curCart).toFixed(2))));
            }
        } else {
            if($('#includeTrueUp').attr('checked')) {
                remainCartObj.html(epp.fD.getFixedFloat(parseFloat($('#selectProds option:selected').attr('tnum')) +
                    parseFloat(epp.globalVar.trueUpTokensRemaining)-parseFloat((newCart-excessTrueUpTokens).toFixed(2))));
            } else {
                remainCartObj.html(epp.fD.getFixedFloat(remainCart-parseFloat((newCart-curCart).toFixed(2))));
            }
        }
    },
    adjustCartForNegCartVal: function() {
        var remainCartObj = $('.tokenVal', $('.tokensRemain'));
        var inCartVal=parseFloat($('.tokenVal', $('.tokensInCart')).text());
        remainCartObj.html(epp.fD.getFixedFloat(epp.globalVar.tokensRemaining-inCartVal));
    },
    adjustCartForPosCartVal: function() {
        var remainCartObj = $('.tokenVal', $('.tokensRemain'));
        var inCartVal=parseFloat($('.tokenVal', $('.tokensInCart')).text());
        remainCartObj.html(epp.fD.getFixedFloat(epp.globalVar.trueUpTokensRemaining-inCartVal));
    },
    adjustCartForTrueUp: function(actChkBox){
        var remainCartObj = $('.tokenVal', $('.tokensRemain'));
        var remainCartVal=parseFloat(remainCartObj.html());
        if(actChkBox.attr('checked')) {
            remainCartObj.html(epp.fD.getFixedFloat(remainCartVal + parseFloat(epp.globalVar.trueUpTokensRemaining)));
        } else {
            remainCartObj.html(epp.fD.getFixedFloat(remainCartVal - parseFloat(epp.globalVar.trueUpTokensRemaining)));
        }
        epp.fD.calcCart();
    },
	submitCart: function(){
        $('#cartItemForm input[name="csSkuList"]').val(epp.fD._inCartSkuIdList.toString());
        $('#cartItemForm input[name="csTokenQuantity"]').val(epp.fD._inCartQty.toString());
        $('#cartItemForm input[name="subFundId"]').val($('#selectProds option:selected').val());
        $('#cartItemForm input[name="trueUpActive"]').val($('#includeTrueUp').is(':checked').toString());
		$('#cartItemForm input[name="csUpgradeFlag"]').val(epp.fD.upgradeFlagArr.toString());	
        $('#cartItemForm input[name="netTotalInCart"]').val($('.tokenVal', $('.tokensInCart')).html());
        $('#cartItemForm input[name="snsTotalInCart"]').val(epp.fD._snsTokenInCart);
        $('#cartItemForm input[name="snsTokenBalance"]').val(epp.fD._snsTokenBalance);
		$('#cartItemForm').submit();
		/*$('#cartItemForm').submit(function() {
            //TODO handler for cart item validation
            return true;
        });*/
    },
    /*getTrueUpQuota: function(){
		var remCart=parseFloat($('.tokenVal', $('.tokensRemain')).html()), skuVal=0, skuAllocation=[], fundVal=parseFloat($('#selectProds option:selected').attr('tnum'));
		$.each($("#cT tbody tr"), function(c,oRow){
			if($(oRow).find('.sTotal a').length > 0 && $(oRow).find('.sTotal a').html() != epp.globalVar.nofutureindicator) {
				skuVal = parseFloat($(oRow).find('.mTotal').html()) + parseFloat($(oRow).find('.sTotal a').html());
			} else {
				skuVal = parseFloat($(oRow).find('.mTotal').html());
			}
			if (fundVal-skuVal>0){
				skuAllocation.push(skuVal+":0");
				fundVal-=skuVal;
			} else if (fundVal==0){
				skuAllocation.push("0:"+skuVal);
			} else {
				skuAllocation.push(fundVal+":"+(skuVal-fundVal));
				fundVal=0;
			}
		});
		return skuAllocation;
	},*/
	filterContent: function(){
		$("#prodList ul.fullContent").hide();
		$("#instText").hide();
        $("#prodList .fContent").remove();
		$("#prodList").append("<ul class=\"fContent\"><li class=\"level1\"></li></ul>");
        var sObj = new Object();
        sObj['searchString'] = $('#filterVal').val();
		if(sObj['searchString'].match(epp.globalVar.skuFilterRegex)) {
			$('#prodTreeLoading').removeClass('hidden');
			vmf.ajax.post(epp.globalVar.searchSkuURL,sObj,epp.fD.leafNode($("#prodList ul.fContent li")),epp.fD.errorNode);
		}
		else {
			$("#instText .instText").eq(0).hide();
			$("#instText").show();				
			$('#filterNoResults').removeClass('hidden');
		}
		if(typeof riaLinkmy != "undefined") riaLinkmy(epp.globalVar.pageName + ' : redeem tokens : filter : '+$('#filterVal').val());
	},
	buildReview: function(){
        vmf.scEvent =true;
		epp.fD.bInRedem = true;
        th = epp.fD;
        tt = th.tt; // transfer tokens module 
		vmf.datatable.build($('#tbl_review'),{
			"aoColumns": [
				{"sTitle": epp.globalVar.skuprodname,"sWidth":"575px","bSortable":false},
				{"sTitle": "","bVisible":false},
				{"sTitle": epp.globalVar.tokenunit,"sWidth":"100px","sClass":"right","bSortable":false},
				{"sTitle": epp.globalVar.qty,"sWidth":"25px","sClass":"right","bSortable":false},
				{"sTitle": epp.globalVar.totaltokens,"sClass":"right","bSortable":false},
				{"sTitle": "","bVisible":false},
				{"sTitle": "","bVisible":false},
				{"sTitle": "","bVisible":false},
				{"sTitle": "","bVisible":false},
				{"sTitle": "","bVisible":false},
				{"sTitle": "","bVisible":false},
                {"sTitle": "","bVisible":false},
                {"sTitle": "","bVisible":false},
                {"sTitle": "","bVisible":false}
			],
			"oLanguage": {
				"sEmptyTable":'<div id="loadingerrormsg"><div id="innerMsg" class="error_innermsg"><p>'+
				epp.globalVar.msgNoActiveFunds+'</p><p>'+epp.globalVar.msgContact+'<a href="#" class=\"nWindowIcon\">'+epp.globalVar.msgVpp+'</a>'+epp.globalVar.msgVpp1+'<a href="#" class=\"nWindowIcon\">'+epp.globalVar.msgLink+'</a></p></div></div>'
			},
			"sAjaxSource": epp.globalVar.reviewCartItemListURL,
			"bInfo":false,
			"bServerSide": false,
			"bAutoWidth":false,
			"sDom": 'zrtSpi',
			"bFilter":false,
			"bPaginate": false,
			"aaSorting": [],
			"fnRowCallback": function(nRow,aData,iDisplayIndex){ 
				var $nRow=$(nRow);
				$nRow.find("td:eq(0)").html('<h4>' + aData[0] + "</h4><div class='proDisc'>"+aData[1]+"</div>");
				//$nRow[0].idx = iDisplayIndex;
				$nRow.data('ue',aData[12]);
				return nRow;
			},
			"fnInitComplete": function (settings){
				epp.fD.rt = this;
                if(settings && settings.jqXHR && settings.jqXHR.responseText) {
                    var jsonObj = vmf.json.txtToObj(settings.jqXHR.responseText);
                    var bRFVal = epp.fD.getFixedFloat(parseFloat(jsonObj.ReviewCartItemList.totTokAvail));
                    var vCFVal = epp.fD.getFixedFloat(parseFloat(jsonObj.ReviewCartItemList.totTokCart));
                    var bFVal = epp.fD.getFixedFloat(parseFloat(jsonObj.ReviewCartItemList.remTok));
                    var bSFVal = epp.fD.getFixedFloat(parseFloat(jsonObj.ReviewCartItemList.remSfTok));
                    $('#tknDetails').show();
                    $('#step2Form').show();
                    if(jsonObj.ReviewCartItemList.regularOrder) {
                        $('#beforeRedeemDiv').show();
                        $('#tokenInCartNonTrueup').show();
                        $('#showBalTextNonTrueup').show();
                        $('#showSFBal').show();
                        $('#selPartnerContent').show();
                        $('#step2FormRGO').show();
                    }
                    else if(jsonObj.ReviewCartItemList.crossoverOrder) {
                        $('#beforeRedeemDiv').show();
                        $('#beforeTrueUp').show();
                        $('#tokenInCartTrueup').show();
                        $('#showBalTextTrueup').show();
                        $('#showSFBal').show();
                        $('#selPartnerContent').show();
                        $('#step2FormCOO').show();
                    } else if(jsonObj.ReviewCartItemList.trueupOrder) {
                        $('#beforeTrueUp').show();
                        $('#tokenInCartTrueup').show();
                        $('#showBalTextTrueup').show();
                        $('#step2Header').parent().hide();
                        $('#selPartnerContent').show();
                        $('#step2FormTUO').show();
                    }
                    $('#beforeRedeem').text(bRFVal);
                    $('#valInCart').text(vCFVal);
                    $('#balVal').text(bFVal);
                    $('#balSFVal').text(bSFVal);
					$('#trueupTokensRedem').text(epp.fD.getFixedFloat(parseFloat(vCFVal-bRFVal)));
                }
				var myVals =[], tInCart=parseFloat($('#valInCart').text()), totalBfr=parseFloat($('#beforeRedeem').text());
				epp.fD.rt.find('tbody tr').each(function () {
					var aData = epp.fD.rt.fnGetData( this );
                    $(this).find('td:eq(1)').text(epp.fD.getFixedFloat(aData[2]));
                    var objTermLic = vmf.json.txtToObj(aData[11]);
                    if(objTermLic.isTerm) {
                        var licTermAElem = $('<a class="licTermMLink" href="#">' + epp.fD.getFixedFloat(aData[4]) + '</a>').click(function() {
                            vmf.modal.show('termLicCalculation', {onShow:epp.fD.manipTermLicCalcReview(aData)});
                            return false;
                        });
                        $(this).find('td:eq(3)').html(licTermAElem);
                    } else {
                        $(this).find('td:eq(3)').text(epp.fD.getFixedFloat(aData[4]));
                    }
					if(($.trim(aData[5]).length != 0) && ($.trim(aData[6]).length != 0) && ($.trim(aData[7]).length != 0) && ($.trim(aData[8]).length != 0) && ($.trim(aData[9]).length!= 0) && ($.trim(aData[10]).length!= 0)){
						$(this).addClass('expanded');
						epp.fD.rt.fnOpen(this, '', ''); // Added new row
						$(this).next('tr').addClass('linkedRow');
                        if(isNaN(aData[10])) {
							$(this).next('tr').html("<td><div class='linkedProd'><h4>"+ aData[5] + "</h4><div class='subProDisc'>" +aData[6] +"</div></div></td><td>"+ aData[8] + "</td><td>"+ aData[9] + "</td><td>"+ aData[10] + "</td>");
						}
						else {
                            var snsTknUnit = 0.0;
                            if(isNaN(aData[8])) snsTknUnit = aData[8];
                            else snsTknUnit = epp.fD.getFixedFloat(aData[8]);
							$(this).next('tr').html("<td><div class='linkedProd'><h4>"+ aData[5] + "</h4><div class='subProDisc'>" +aData[6] +"<div><span class='snsTime'>" + epp.globalVar.snsduration + " </span>" +aData[7] +" days</div></div></div></td><td>"+ snsTknUnit + "</td><td>"+ aData[9] + "</td><td>"+ epp.fD.getFixedFloat(aData[10]) + "</td>");
						}
						$(this).next('tr').find('td:eq(1)').addClass('right');
						$(this).next('tr').find('td:eq(2)').addClass('right');
						
						if(($.trim(aData[12]).length != 0 && $.trim(aData[12]) == 'true')){
							var snsCalcAElem = $('<a class="snsMLink" href="#"></a>').click(function() {
			                    vmf.modal.show('SnSCalculation_UE', {onShow:epp.fD.manipEUSnSCalcReview(aData)})
	                            return false;
	                        });
						}else{
							var snsCalcAElem = $('<a class="snsMLink" href="#"></a>').click(function() {
		                        vmf.modal.show('SnSCalculation', {onShow:epp.fD.manipSnSCalcReview(aData)});
	                            return false;
	                        });
						}
                        
                        if(isNaN(aData[10])) {
                            $(this).next('tr').find('td:eq(3)').addClass('right');
                        } else {
                            $(this).next('tr').find('td:eq(3)').addClass('right').wrapInner(snsCalcAElem);
                        }
					}
                    if(objTermLic.isTerm) {
                        $(this).find('.proDisc').append("<div><span class='snsTime'>" + epp.globalVar.termduration + " </span>" +objTermLic.termDuration +" days</div>");
                    }
                    if(!epp.globalVar.futureAllowed) {
                        if(aData[15] == "false" && aData[16] == "false") { //neither crossover nor trueup
                            $(this).next('tr').find('td:eq(1)').text(epp.globalVar.nofutureindicator);
                            $(this).next('tr').find('td:eq(2)').text(epp.globalVar.nofutureindicator);
                            $(this).next('tr').find('td:eq(3)').text(epp.globalVar.futureincluded);
                        } else if(aData[15] == "true" && aData[16] == "false") { //crossover
                            var snsCalcAElem;
                            $(this).next('tr').find('td:eq(1)').text(epp.globalVar.nofutureindicator);
                            $(this).next('tr').find('td:eq(2)').text(epp.globalVar.nofutureindicator);
                            $(this).next('tr').find('td:eq(3)').text(epp.globalVar.partiallyincluded);
                            if(aData[12] == "true") { //upgrade product
                                snsCalcAElem = $('<a class="snsMLink" href="#"></a>').click(function() {
                                        vmf.modal.show('SnSCalculation_PIEU', {onShow:epp.fD.manipPIEUSnSCalcReview(aData)})
                                        return false;
                                    });
                            } else { //regular product
                                snsCalcAElem = $('<a class="snsMLink" href="#"></a>').click(function() {
                                        vmf.modal.show('SnSCalculation_PIRG', {onShow:epp.fD.manipPIRGSnSCalcReview(aData)})
                                        return false;
                                    });
                            }
                            $(this).next('tr').find('td:eq(3)').addClass('right').wrapInner(snsCalcAElem);
                        }
                    }
				});
				$('#tknDetails').show();
				if(tInCart > totalBfr){
				if(parseFloat($('#beforeRedeem').text())<0) $('#beforeRedeem').addClass('neg');
				if(parseFloat($('#valInCart').text())<0) $('#valInCart').addClass('neg');
				$('.crMsg').hide();
				}else{ 
					$('#valInCart').addClass('pos');
					if(parseFloat($('#valInCart').text())<0){ 
						$('.crMsg').show();
					} else {
						$('.crMsg').hide();
					}
				}
                $('#understand_warning').attr('checked',false).unbind('click').click(function(e) {
                    if($(this).attr('checked')) {
                        if(jsonObj.ReviewCartItemList.regularOrder || jsonObj.ReviewCartItemList.crossoverOrder)
						{
							if($('#selPartner option').length > 0 && $('#tbl_review tbody tr').length > 0) {
								$('#placeOrder').removeClass('disabled').attr('disabled','');
							}
							else {
								e.preventDefault();
							}
						} else if(jsonObj.ReviewCartItemList.trueupOrder)
						{
							if($('#tbl_review tbody tr').length > 0) {
								$('#placeOrder').removeClass('disabled').attr('disabled','');
							}
							else {
								e.preventDefault();
							}
						} else { //shouldnt happen
							e.preventDefault();
						}
                    }
                    else {
                        $('#placeOrder').addClass('disabled').attr('disabled',true);
                    }
                });
                //Format all floats to two decimal fixed floats
                var totTokRow = $('#tbl_review tbody tr').find('td:eq(3)');
                for(var idx=0;idx<totTokRow.length;idx++) {
					if(typeof $(totTokRow[idx]).text() == "number") {
						var fVal = parseFloat($(totTokRow[idx]).text());
						$(totTokRow[idx]).text(epp.fD.getFixedFloat(fVal));
					}
                }
				if(jsonObj.ReviewCartItemList.regularOrder || jsonObj.ReviewCartItemList.crossoverOrder) {
                    epp.fD.getPartners();
                }
                $('#placeOrder').live('click',function() {
					$(this).addClass('disabled').attr('disabled',true);
					epp.fD.placeRedemptionOrder();
				});
				
				epp.common.toggleButton($('#placeOrder'),false);
			}
		});
		
		$('#orderBack').click(function() {
		    window.location = epp.globalVar.viewFundDetailsURL + '&_VM_FundID=' + encodeURIComponent(epp.globalVar.encFundID)
			+ '&_VM_preSelect=' + epp.globalVar.preSelectRedeem + '&_VM_back=true';
		});
		$('#returnOverview a, a.returnLink').click(function() {
			window.location = epp.globalVar.viewFundDetailsURL + '&_VM_FundID=' + encodeURIComponent(epp.globalVar.encFundID)
			+ '&_VM_preSelect=default&_VM_back=false';
			return false;
		});
        
        $('#snsCalcContinue').click(function() {
            vmf.modal.hide('SnSCalculation');
        });
        $('#ueSnsCalcContinue').click(function(){
			vmf.modal.hide('SnSCalculation_UE');
		});
        $('#pirgSnsCalcContinue').click(function(){
			vmf.modal.hide('SnSCalculation_PIRG');
		});
        $('#pieuSnsCalcContinue').click(function(){
			vmf.modal.hide('SnSCalculation_PIEU');
		});
        $('#termLicCalcContinue').click(function() {
			vmf.modal.hide('termLicCalculation');
		});
        
        // To display account name only limitted length and show full name on hover.
        $('#reviewRedemptionHeader .charLimit').each(function(){
            var $name = $(this).text(), $charLen = $(this).text().length, $limit = 50;
            if($name.length && $name != null && $name != undefined){
                if($charLen > $limit){
                    $(this).css('cursor','pointer').html($name.substring(0, $limit)).append(' ...');
                    //adding mouseover event to show full name on hover
                    $(this).mouseover(function(){$(this).html($name);
                    }).mouseout(function(){$(this).html($name.substring(0, $limit)).append(' ...');})
                }
            }
            return false;
        });
        
        /*** Partner events START **/
        $('a#addPartner').live('click',function(){vmf.modal.show('addRedemptPartner')});
		$('a#chPartner').live('click',function(){
		        var $partnerName = $('#defaultPartner').text(); 
				vmf.modal.show('changeDefaultPartner');
				$('#changePartner').html($partnerName);
				epp.common.toggleButton($('#btn_saveChangePartner'), false);
				th.getPartnersList();
				
		 });   
		$('a#delPartner').live('click',function(){
			if(!$(this).parent().hasClass('inactive')){ 
				var $partnerName = $('#tbl_rpSummary tbody').find('tr.active td:eq(1)').text(); 
				vmf.modal.show('removePartnerContent'); 
				$('#partner_name').html($partnerName);
			}else return false;
		});
		$('#partnerName').bind('keyup blur', function () {//Restricting only alphanumerics and white space.
			if (this.value.match(/[^a-zA-Z0-9 ]/g)) this.value = this.value.replace(/[^a-zA-Z0-9 ]/g, '');
		});
		$('#btn_findPartner').live('click',function(e){
			e.preventDefault();
			epp.fD.partnerCountry = $("#partnerCountry").val();
			var thisBtn = $(this),
				pNameInput = $("#partnerName");
				partnerName =  $.trim(pNameInput.val()), 
				pCountry = $("#partnerCountry"),
				selectedCountry = pCountry.val(), 
				ptnrList = $('#tbl_rpSummary tbody'),
				trs = ptnrList.find('tr');
			if(th.validatePartnerInfo(pNameInput, pCountry)){
				pNameInput.parent().parent().find('label.errmsg').remove();			
				epp.common.toggleButton(thisBtn, false);
				th.partnerIdArr = []; th.pPartyIdArr = [];
				$('#addRedemptPartner .partnerDiv').siblings('.ctrlHolder').addClass('disabled').find(':input').attr('checked',false).attr('disabled',true);
				$('#searchedPartners tbody').html('<tr><td colspan="2" class="loadingTd"><div class="loadingWrapper"><div class="loading_big">'+epp.globalVar.loading+'</div></div></td></tr>');
				vmf.ajax.post(epp.globalVar._searchPartnersURL, "&partnerName="+partnerName+"&partnerCountry="+selectedCountry, function(data){
					var oList=[], jData = data.SearchedPartnerData.partnerList;
					if (jData!=null && jData.length){ //Check if it is a proper json response
						$("#numberOfPartners").html(data.SearchedPartnerData.iTotalDisplayRecords);
						$.each(jData, function(i,v){
							th.partnerIdArr.push(v.partnerID);
							th.pPartyIdArr.push(v.partnerPartyID);
							if(th.checkPartnerAdded(v.partnerName)){
								oList.push('<tr><td class="vspace2 w20"><input id="partnerRdo'+i+'" type="radio" name="p1" disabled="true" /></td><td class="vspace2 label">'+v.partnerName+'<span class="badge asp">'+epp.globalVar.partnerAlreadyAdded+'</span></td></tr>');
							}else{
								oList.push('<tr><td class="vspace2 w20"><input id="partnerRdo'+i+'" type="radio" name="p1" /></td><td class="vspace2 label">'+v.partnerName+'</td></tr>');
							}
						});
						$('#searchedPartners tbody').html(oList.join(''));
					} else {
						$("#numberOfPartners").html(0);
						$('#searchedPartners tbody').html('<tr><td colspan="2" class="noResults">'+epp.globalVar.noPartnersTryAgain+'</td></tr>');
						pNameInput.focus();
					}
					epp.common.toggleButton(thisBtn, true);
				});
			}
		});
		$('#searchedPartners input[type="radio"]').live('change', function(){
			$('#addRedemptPartner').find('.ctrlHolder.disabled').removeClass('disabled').find(':input').attr('disabled',false);
		});
		$('#aPartChk').live('change', function(){
			if($(this).is(':checked')) epp.common.toggleButton($('#btn_savePartner'), true);
				else epp.common.toggleButton($('#btn_savePartner'), false);
		});	
		$('#btn_savePartner').live('click', function(){
			var pIdx = $('#searchedPartners input[type="radio"]:checked').parent().parent().index(), 
				thisBtn = $(this), 
				pName = $('#searchedPartners input[type="radio"]:checked').parent().next().text(),
				pCountry = $('#partnerCountry').val();
				
			epp.common.toggleButton(thisBtn, false);
			pId = th.partnerIdArr[pIdx]; 
			pPId = th.pPartyIdArr[pIdx];
			epp.fD.addedPartner[0] = pName;
			epp.fD.addedPartner[1] = pCountry;
			if($('#dPartner').is(':checked')){bDefault = "y";}else {bDefault = "n";}
			vmf.modal.hide('addRedemptPartner');
			vmf.loading.show({'overlay':'true'});
			vmf.ajax.post(epp.globalVar.addPartnerURL, "&encPartnerId="+encodeURIComponent(pId)+"&partnerPartyID="+encodeURIComponent(pPId)+"&partnerName="+escape(pName)+"&defaultPartner="+bDefault+"&partnerCountry="+epp.fD.partnerCountry, function(jData){
				if(jData.GenericJSON) {
					if(epp.fD.bInRedem){
						th.getPartners();
					}else{
						if(bDefault == "y"){ $("#defaultPartner").html(pName);}
						th.buildPartnerTable();
						$("#errorMsg").hide();
						if(typeof riaLinkmy != "undefined") riaLinkmy(epp.globalVar.pageName + ' : change partner');
					}
				}else {$("#errorMsg").html(epp.globalVar.addPartnerErrorMsg+" "+epp.globalVar.genericErrorMsg).show(); }
				vmf.loading.hide();
			});
		});
		$('#btn_saveChangePartner').live('click',function(){
			var selectedPartnerId = $("#partersSelectBox").val(), thisBtn = $('#btn_saveChangePartner');
			$prtnrName = $("#partersSelectBox option:selected").text();
			vmf.modal.hide('removePartnerContent'); 
			vmf.loading.show({'overlay':'true'});
			vmf.ajax.post(epp.globalVar.changeCurrentPartnerURL, "&"+epp.globalVar.encPartnerID + encodeURIComponent(selectedPartnerId)+"&partnerName="+escape($prtnrName), function(jData){
				if(jData.GenericJSON) {
					$("#defaultPartner").html($prtnrName);
					th.buildPartnerTable();
					$("#errorMsg").hide();
					//if(typeof riaLinkmy != "undefined") riaLinkmy('epp_view-partners : save-default');
					callBack.addsc({'f':'riaLinkmy','args':[epp.globalVar.pageName + 'change partner']})
				}else{
				  $("#errorMsg").html(epp.globalVar.changePartnerErrorMsg+" "+epp.globalVar.genericErrorMsg).show();
				}
				vmf.loading.hide();
			});
		});
		$('#btn_confirmDeletePartner').live('click',function(){
			var activeRow = _pdt.find('tr.active'), partnerId = th._pId[activeRow.index()], partnerPartyId = th._pPartyId[activeRow.index()];
			vmf.modal.hide('removePartnerContent'); 
			vmf.loading.show({'overlay':'true'});
			vmf.ajax.post(epp.globalVar.removePartnerURL, 
				"&"+epp.globalVar.encPartnerID + encodeURIComponent(partnerId) + "&"+epp.globalVar.partnerPartyID + encodeURIComponent(partnerPartyId), function(jData){
				if(jData != null && jData.GenericJSON != null && jData.GenericJSON == 'N') {
					$("#errorMsg").html(epp.globalVar.removePartnerErrorMsg+" "+epp.globalVar.partnerNoDelete).show();
				}else
				if(jData.GenericJSON) { 
				   th.buildPartnerTable();
				   $("#errorMsg").hide();
				   //if(typeof riaLinkmy != "undefined") riaLinkmy('epp_view-partners : delete-partner');
				   callBack.addsc({'f':'riaLinkmy','args':[epp.globalVar.pageName + 'delete partner']})
				}else {
					$("#errorMsg").html(epp.globalVar.removePartnerErrorMsg+" "+epp.globalVar.genericErrorMsg).show();
				}
				vmf.loading.hide();
			});
		});
		$('#btn_cancelAddPartner').live('click',function(){th.partnerIdArr=[]; th.pPartyIdArr=[]; vmf.modal.hide('addRedemptPartner');});
		$('#btn_cancelChangePartner').live('click',function(){vmf.modal.hide('changeDefaultPartner')});
		$('#btn_cancelDeletePartner').live('click',function(){vmf.modal.hide('removePartnerContent')});
		$("#btn_cancelRename").live('click',function(){vmf.modal.hide('renameFund')});
		$("#btn_cancelRename2").live('click',function(){vmf.modal.hide('renameSubFund')});
        $('button#btn_cancel12').live('click',function(){vmf.modal.hide('changeSubFundUser')});
        $('button#btn_cancel5').live('click',function(){vmf.modal.hide('createSubFund')});
        $('button#btn_cancel21').live('click',function(){vmf.modal.hide('deleteSubFund')});
		
        /*** Partner events END **/
		
       //Ominature code to track review page loading
       callBack.addsc({'f':'riaLinkmy','args':[epp.globalVar.pageName]})
	},
	manipSnSCalcReview: function(aData) {
        if(aData[8] != undefined && !isNaN(parseFloat(aData[8]))) {
            $('#numTokens').text(epp.fD.getFixedFloat(aData[8]));
            $('#snsDur').text(aData[7]);
            $('#SnSCalculation .actual .quanity').text(aData[9]);
            $('#SnSCalculation .actual .total').text(epp.fD.getFixedFloat(aData[10]));
        }
    },
    manipEUSnSCalcReview: function(aData) {
    	if(aData[8] != undefined && !isNaN(parseFloat(aData[8]))) {
		 	var ueSnsModal = $("#SnSCalculation_UE");
			var snsTokens = epp.fD.getFixedFloat(aData[8]), 
				snsDuration = aData[7], 
				snsCr = epp.fD.getFixedFloat(aData[13]), 
				nVal=parseInt(aData[3]);
			ueSnsModal.find("#numTokens").html(snsTokens);
			ueSnsModal.find("#snsDur").html(snsDuration);
			ueSnsModal.find("#numDays").html(epp.fD._daysInYear);
			ueSnsModal.find("#snsCr").html(snsCr);
			ueSnsModal.find(".actual .quanity").html(nVal);
	        var actTot = epp.fD.calcSnsTotalTokens(snsTokens,nVal,snsDuration) - snsCr;
			ueSnsModal.find(".actual .total").html(epp.fD.getFixedFloat(actTot));
		}
    },
    manipPIRGSnSCalcReview: function(aData) {
	 	var piRGSnsModal = $("#SnSCalculation_PIRG");
		var snsTokens = epp.fD.getFixedFloat(aData[8]), snsDuration = aData[7], 
			snsTokenBalance = epp.fD.getFixedFloat(aData[14]),
			nVal = parseInt(aData[3]);
		piRGSnsModal.find("#numTokens").html(snsTokens);
        piRGSnsModal.find("#snsDur").html(snsDuration);
		piRGSnsModal.find("#snsCr").html(snsTokenBalance);
		piRGSnsModal.find(".actual .quanity").html(nVal);
		piRGSnsModal.find("#rgIncTotal").html(epp.fD.getFixedFloat(aData[10]));
    },
    manipPIEUSnSCalcReview: function(aData) {
	 	var piEUSnsModal = $("#SnSCalculation_PIEU");
		var snsTokens = epp.fD.getFixedFloat(aData[8]), snsDuration=parseInt(aData[7]), 
            snsCr = epp.fD.getFixedFloat(aData[13]), 
            snsTokenBalance = epp.fD.getFixedFloat(parseFloat(aData[14] - aData[13])),
			nVal = parseInt(aData[3]);
		piEUSnsModal.find("#numTokens").html(snsTokens);
		piEUSnsModal.find("#snsCr").html(snsCr);
        piEUSnsModal.find("#snsTok").html(snsTokenBalance);
        piEUSnsModal.find("#snsDur").html(snsDuration);
        piEUSnsModal.find("#numDays").html(epp.fD._daysInYear);
		piEUSnsModal.find(".actual .quanity").html(nVal);
		piEUSnsModal.find("#euIncTotal").html(epp.fD.getFixedFloat(aData[10]));
    },
    manipTermLicCalcReview: function(aData) {
        if(aData[2] != undefined && !isNaN(parseFloat(aData[2]))) {
            var objTermLic = vmf.json.txtToObj(aData[11]);
            $('#termLicNumTokens').text(epp.fD.getFixedFloat(aData[2]));
            $('#termLicDur').text(objTermLic.termDuration);
            $('#termLicTknQty').text(aData[3]);
            $('#termLicTotal').text(epp.fD.getFixedFloat(aData[4]));
        }
    },
	addPartner: function() {
		vmf.modal.show('addRedemptPartner');
	},
	changeCdParnter: function(){
		if(typeof riaLinkmy != "undefined") riaLinkmy(epp.globalVar.pageName + ' : change partner');
	},
    getSubFunds: function() {
	       vmf.ajax.post(epp.globalVar.redeemSubFundListURL,null,function(data){
			var oList=[],jData = data.RedeemSubFundList.subFundList;
            epp.globalVar.trueUpAllowed = data.RedeemSubFundList.trueUpAllowed;
			
            
			if (jData!=null){ //Check if it is a proper json response		
				$.each(jData, function(i,v) {
				if(epp.globalVar.userType=='FO' && epp.globalVar.trueUpEnabled=='Y' && epp.globalVar.tokensRemainingValue<=0){
					oList.push("<option default=" +data.RedeemSubFundList.subFundList[i].defaultSubFund +" value="+v.subFundId+" tnum="+v.subFundTokensRemaining+">"+v.subFundName+" - "+v.subFundTokensRemaining+" "+epp.globalVar.trueuptokensLabel+"</option>");
					}else{
						oList.push("<option default=" +data.RedeemSubFundList.subFundList[i].defaultSubFund +" value="+v.subFundId+" tnum="+v.subFundTokensRemaining+">"+v.subFundName+" - "+v.subFundTokensRemaining+" "+epp.globalVar.tokensLabel+"</option>");
					}
				});
                var prevSelSFId = $('#selectProds option:selected').attr('value');
                $('#selectProds :not(option[value="selectOne"])').remove();
				$('#selectProds').append(oList.join(''));
                if(prevSelSFId != undefined && prevSelSFId != null && prevSelSFId != 'selectOne') {
                    var preselectOption = $('#selectProds option[value="' + prevSelSFId + '"]');
                    if(preselectOption.length > 0) {
                        $('#selectProds option[value="' + prevSelSFId + '"]').attr('selected','selected'); 
                    } else {
                        $('#selectProds option:first').attr('selected','selected');
                    }
                    $('#selectProds').trigger('change');
                }
                else if(epp.fD._preselectRedeem && epp.globalVar.encSubFundId != null) {
                    var preselectOption = $('#selectProds option[value="' + epp.globalVar.encSubFundId + '"]');
                    if(preselectOption.length > 0) {
                        $('#selectProds option[value="' + epp.globalVar.encSubFundId + '"]').attr('selected','selected'); 
                    } else {
                        $('#selectProds option:first').attr('selected','selected');
                    }
                    $('#selectProds').trigger('change');
                }
                if(oList.length == 1) $('select#selectProds>option:eq(1)').attr('selected', true).trigger('change');
				if(typeof riaLinkmy != "undefined") riaLinkmy(epp.globalVar.pageName + ': redeem tokens');
				epp.fD.calcCart();
			} else {
                //TODO get message from properties
				alert(epp.globalVar.errormsgsubfund);
			}
		},function(){
            //TODO get message from properties
			alert(epp.globalVar.errormsgsubfund)
		});
		kbUrl = epp.globalVar.kbUrlRemeem;
    },
    getFixedFloat: function(inputFloat) {
		var numVal;
        if(typeof inputFloat != "number") {
            numVal = parseFloat(inputFloat).toFixed(2);
        }
        else {
            numVal = inputFloat.toFixed(2);
        }
		if(numVal == -0.00)
			return parseFloat(0).toFixed(2);
		else
			return numVal;
    },
    calcSnsTotalTokens: function(snsTokens,qty,snsDuration) {
        return(snsTokens*qty*snsDuration/epp.fD._daysInYear);
    },
    calcTermLicTotalTokens: function(termLicTokens,qty,termDuration) {
        return(termLicTokens*qty*termDuration/epp.fD._daysInYear);
    },
    placeRedemptionOrder: function() {
        //vmf.loading.show({"msg":epp.globalVar.msgWaitOrder, "overlay":true});
		var inputData;
		if(epp.globalVar.tokensRemainingValue<=0 && epp.globalVar.trueUpTokensUsed >= 0) inputData = ('&partnerId=' + 0);
		else {
            if($('#selPartner option:selected').val() != undefined) {
                inputData = '&partnerId=' + encodeURIComponent($('#selPartner option:selected').val());
            }
        }
        vmf.ajax.post(epp.globalVar.placeRedemptionOrderURL,inputData,function(data) {
            //Success
            if(data != undefined && data.RedemptionOrderResponse != null) {
                var jData = data.RedemptionOrderResponse;
                if(jData.orderStatus != null && jData.orderStatus == "success") {
                    //TODO
                    $('#placeOrder,#orderBack,#step1Header,#reviewRedemptionH1,#selPartnerContent,#content-header-container .btm_margin_two_zero').addClass('hidden');
                    $('#orderSubmitH1,#fundHeaderRight,#returnOverview,#content-header-container .reviewConfirm_Msg, #content-header-container .reviewConfirm_Note, #content-header-container .returnLink').removeClass('hidden');
					$("#reviewRedemptionHeader .fund-header-details-first").removeClass("wauto");
                    $('#understand_warning').parent().addClass('hidden');
                    
                    $('#balVal').addClass('pos');
                    
                    $('#partnerNameRedem').text($('#selPartner option:selected').text());
                    $('#orderDateTime').text(jData.orderDateTime);
                    $('#redemptionRefId').text(jData.poNumber);
		    $('#step1Form').addClass('hidden').next('.chkbox_wrappercontainer').addClass('hidden');
                    if(typeof riaLinkmy != "undefined") riaLinkmy(epp.globalVar.pageName + ' : confirm');
                }
            } else if(data.ERROR_CODE != undefined) {
                epp.fD.handlePlaceRedemptionError(data);
            } else {
                epp.fD.handlePlaceRedemptionError();
            }
            $('html, body').animate({scrollTop : 0},2000);
        },function(){
            //Error
            //TODO get message from properties
			epp.fD.handlePlaceRedemptionError();
		},function() {
            //Complete
            vmf.loading.hide();
        },null,function(){
			vmf.loading.show({"msg":epp.globalVar.msgWaitOrder, "overlay":true});
		});
    },
	handlePlaceRedemptionError: function(data) {
		$('#step1Header,#step2Header,#step2SubHeader,#step2Partner,#step2Form,'
			+ '#placeOrder,#content-header-container .btm_margin_two_zero').addClass('hidden');
		$('#understand_warning').parent().addClass('hidden');
		$('#fundHeaderRight,#mainContentWrapper .reviewErrorProcess_msg').removeClass('hidden');
        
        $('#showBal').addClass('hidden');
        if(parseFloat($('#beforeRedeem,#valInCart').text())<0) $('#beforeRedeem,#valInCart').addClass('neg');
		
		$('#orderBack').removeClass('secondary').addClass('primary');
        $('#fundHeaderRight').addClass('hidden');
        
        if(data != undefined) {
            var alertDiv = $('#reviewRedemptionAlert .alertTitle').clone();
            $('#reviewRedemptionAlert .alert-box-holder').html(alertDiv).append("<div>Error Code: "+data.ERROR_CODE+"</br>"+data.ERROR_MESSAGE+"</div>");
            $('html, body').animate({scrollTop : 0},2000);
        }
	},
    handlePreSelection: function() {
        if(epp.globalVar.iWantToPreselect != null && epp.globalVar.iWantToPreselect == epp.globalVar.iWantToRedeem) {
            var redeemElem = $('#sfIwantTo option[value="redeem"]');
            var redeemVal = redeemElem.val();
            redeemElem.attr('selected','selected');
            $('#fdMainContent').find('#'+redeemVal+"_content").show().siblings().hide();
            epp.fD.getSubFunds();
            return true;
        }
        else {
            return false;
        }
    },
   updateSubFunds:function(jData){
		if(jData.GenericJSON) {
			th.getSubFundDetails();
			$('#errorMsg').hide();
		}else{
			$('#errorMsg').html(epp.globalVar.genericErrorMsg).show();
			if(jData.ERROR_CODE.length != null && jData.ERROR_CODE.length) $('#errorMsg').html(jData.ERROR_MESSAGE).show();
		}
		//vmf.loading.hide();
    },
    getPartners: function() {
        vmf.ajax.post(epp.globalVar.getPartnerListURL,null,function(data){
			$('#step2Partner').removeClass('hidden');
			$('#selPartnerLoading').addClass('hidden');
			var oList=[], jData = data.PartnerSummary.partnerList
			if (jData!=null){ //Check if it is a proper json response
				oList=[];
				$('#selPartner').empty();
				if($('#step2Partner .inputHolderClass').length){$('#step2Partner .inputHolderClass').remove();}
				th.arrPartnerList = [];
				$.each(jData, function(i,v){
					th.arrPartnerList.push(v.partnerName);
					if(i == data.PartnerSummary.defaultIndex) {
	                    oList.push("<option value="+v.partnerId+">"+v.partnerName+" "+ epp.globalVar.defaultPartnerText +"</option>");
                    } else {
                    	oList.push("<option value="+v.partnerId+">"+v.partnerName+"</option>");
                    	if(epp.fD.addedPartner != null && epp.fD.addedPartner.length){
                    		if(epp.fD.addedPartner[0] == v.partnerName && epp.fD.addedPartner[1] == v.partnerCountry) oList[i] = "<option value="+v.partnerId+" selected=\"selected\">"+v.partnerName+"</option>";
                    	}
                    }
				});
				$('#selPartner').append(oList.join(''));
				if(vmf.dropdown && $("select#selPartner").length){
					if (epp.globalVar.userType == "FO"){
						if($("select#selPartner option").length) vmf.dropdown.build($("select#selPartner"), {optionsDisplayNum:20,ellipsisSelectText:false,ellipsisText:'',position:"right",optionsId:"partnerDropDownOpts",optionsClass:"dropdownOpts",allowEmptySelect:false, addLabel:[{"label":epp.globalVar.addnewpartner,"onSelect":epp.fD.addPartner},{"label":epp.globalVar.noPartnerText,"onSelect":null}],"onSelect":epp.fD.changeCdParnter}); 
						else vmf.dropdown.build($("select#selPartner"), {optionsDisplayNum:20,ellipsisSelectText:false,ellipsisText:'',position:"right",optionsId:"partnerDropDownOpts",optionsClass:"dropdownOpts",allowEmptySelect:true, addLabel:[{"label":epp.globalVar.addnewpartner,"onSelect":epp.fD.addPartner},{"label":epp.globalVar.noPartnerText,"onSelect":null,"selected":true}],"onSelect":epp.fD.changeCdParnter}); 
					}else{
						vmf.dropdown.build($("select#selPartner"), {optionsDisplayNum:20,ellipsisSelectText:false,ellipsisText:'',position:"right",optionsId:"partnerDropDownOpts",optionsClass:"dropdownOpts",allowEmptySelect:true, addLabel:[{"label":epp.globalVar.noPartnerText,"onSelect":null}]}); 
					}
				}
			} else {
                //TODO get message from properties
				alert(epp.globalVar.msgPartnerList);
			}
		},function(){
			//TODO get message from properties
			alert(epp.globalVar.msgPartnerList)
		});
    },
    buildPartnerTable: function(){
		th._pId = [];
		th._pPartyId = [];
		th.arrPartnerList = [];
		th.pCountryArr = [];
		if(!($('#tbl_rpSummary').find('tbody tr').length)) {
			vmf.datatable.build($('#tbl_rpSummary'),{
				"aoColumns": [
					{"sTitle": epp.globalVar.headerCurrent,"sWidth":"60","bSortable":false},
					{"sTitle": epp.globalVar.headerName,"sWidth":"420","bSortable":false},
					{"sTitle": epp.globalVar.headerCountry,"sWidth":"auto","bSortable":false},
					{"sTitle":"","bVisible":false}
				],
				"oLanguage": {
					"sEmptyTable":'<div id="loadingerrormsg"><div id="innerMsg" class="error_innermsg"><p>'+epp.globalVar.noPartnersAvailable+'</p></div></div>',
					"sProcessing":epp.globalVar.loadingLabel,
					"sLoadingRecords":""
				},
				"sAjaxSource": epp.globalVar.viewPartnersURL, //Source url to fetch details
				"fnRowCallback": function(nRow,aData,iDisplayIndex){ 
					$(nRow).data({'cur':aData[0],'pid':aData[3],'ppid':aData[4]});					
					th._pId.push(aData[3]);
					th._pPartyId.push(aData[4]);
					th.arrPartnerList.push(aData[1]);
					th.pCountryArr.push(aData[5]);
					if (aData[0]=="true") {
						$(nRow).addClass('default').find("td:eq(0)").html('<div class="defaultPartner"></div>');
					}
					return nRow;
				},
				"bInfo":false,
				"bProcessing": true,
				"bServerSide": false,
				"bAutoWidth":false,
				"sDom": 'zrtSpi',
				"bFilter":false,
				"bPaginate": false,
				//"sScrollY": "90px",
				"aaSorting": [[ 0, "desc" ]],
				"fnInitComplete": function (nRow,aData,iDisplayIndex) {
					_pdt = this;
					//$('#tbl_rpSummary').not('.initialized').addClass('initialized');
					th.bindHoverEffects(this);
				}
			});
		}else{
			vmf.datatable.reload($('#tbl_rpSummary'), epp.globalVar.viewPartnersURL, th.resetPartnerGear(), "POST", null,th.reloadError);
		}
		kbUrl = epp.globalVar.kbUrlPartners;
		$('#partersSelectBox').die('change').live('change',function(){
			($(this).val()=="selectOne")?epp.common.toggleButton($("#btn_saveChangePartner"),false):epp.common.toggleButton($("#btn_saveChangePartner"),true);
		});
	},
	reloadError: function(error){
		alert(epp.globalVar.genericErrorMsg);
	},
	resetPartnerGear:function(){
		$('#tbl_rpSummary_wrapper').prev().find('#delPartner').parent().addClass('inactive');
	},
	getPartnersList: function() {
		$('#partersSelectBox').html("<option value=''>"+epp.globalVar.loading+"</option>");
        vmf.ajax.post(epp.globalVar.getPartnersURL,null,function(data){
			var oList=[],jData = data.PartnerSummary.partnerList;
			if (jData!=null && jData.length){ //Check if it is a proper json response
				if(jData.length>1) oList.push('<option value="selectOne" tnum="0">Select One</option>');
				$.each(jData, function(i,v){
				    oList.push("<option value="+v.partnerId+">"+v.partnerName+"</option>");
				});
				$('#partersSelectBox').empty().append(oList.join(''));
				if (jData.length==1) epp.common.toggleButton($('#btn_saveChangePartner'),true); 
			} else {
               	$('#partersSelectBox').html("<option>"+epp.globalVar.noPartners+"</option>").attr('disabled',true);
			}
		});
    },
    downloadRedemptionReport: function(e) {
		e.preventDefault();
		location.href=epp.globalVar.downloadRedemptionExcelReportURL;
		if(typeof riaLinkmy != "undefined") riaLinkmy(epp.globalVar.pageName + ' : redemption report');
	},
	downloadActivityReport: function(e) {
		e.preventDefault();
		location.href=epp.globalVar.downloadRedemptionActivitiesExcelReportURL;
		if(typeof riaLinkmy != "undefined") riaLinkmy(epp.globalVar.pageName + ' : activity report');
	},
	//Transfer Tokens area
	tt:{//init function for Transfer Tokens
		//rg: /^[0-9][\.\d]*(,\d+)?$/,
		rg:/^(\d|-)?(\d|,\d{3})*\.?\d*$/,
		fflag:false, //insufficient funds flag
		tAmt:null,
		fAmt:null,
		toAmt:null,
		jSelect:[],
		init:function(){
			$('#transferTokens').show();
			tt.clearflds();
			tt.bindfuncs(); 
			if(typeof riaLinkmy != "undefined") riaLinkmy('epp_transfer-tokens');
			kbUrl = epp.globalVar.kbUrlTransferTokens;
		},
		clearflds:function(){//clear values/enable/disable/show/hide forrequired elements
			$('select#sfFrom , select#sfTo').empty();
			$('#tfInst .main_inst').html(epp.globalVar.transferTokensIntoMsg);
			$('#tfInst').show();
			$('input#txt_amt').val('0.00');
			$("#chk_tt_uw").removeAttr('checked');
			$('label#lbl_frmSf_Lt,label#lbl_toSf_Lt,label#lbl_frmTkns_Lt,label#lbl_toTkns_Lt').html('');
			epp.common.toggleButton($('#btn_tt_Reset'), true);
			epp.common.toggleButton($('button#btn_tt_Confrm'), false);
			$('div#step1').removeClass('disabled').find('select,input').removeAttr('disabled');	
			$('div#step2 div.div_row, div#step2 a').hide();
			th.bSelect($('select#sfFrom , select#sfTo')); //fetch sub-fund and load Transfer Tokens dropdowns (2) 
		},
		bindfuncs:function(){// bind event to elements
			$('input#txt_amt').keyup(function(){tt.dispRB();});
			$('input#txt_amt').bind('focusout',tt.disFloat);
			$('select#sfFrom').change(function(){tt.mngToSel($(this),$('select#sfTo'));})
			$('select#sfTo').change(function(){tt.mngToSel($(this),$('select#sfFrom'))})
			$('button#btn_tt_Confrm').unbind().bind('click',function(){ 
				epp.common.toggleButton($('#btn_tt_Confrm'), false);
				epp.common.toggleButton($('#btn_tt_Reset'), false); 
				tt.confirm();
			})
			$('#chk_tt_uw').change(function(){tt.validate(); })
			$('a#mkeOt,button#btn_tt_Reset').unbind().bind('click',function(){tt.clearflds(); return false;})
			$('#transfer_content #step1 input,#transfer_content #step1 select').bind('keypress',function(e){
				 if(e.which == epp.fD._ENTER_KEY) {
				 	$('#btn_tt_Confrm').not('.disabled').trigger('click');
				 	epp.common.toggleButton($('#btn_tt_Confrm'), false);
				 }
			})
		},
		mngToSel:function(fObj,tObj){
			if (th.jSelect !=null){ //Check if it is a proper json format
				var tVal =tObj.val(); //Store current value of second Dropdown
				tObj.find('option').remove(); //Remove All Options of second Dropdown
				var oList=[]; // Take empty array
				oList.push('<option value="selectOne" tnum="0">Select One</option>');//Push SelectOne option
				//Create select box dropdown
				$.each(th.jSelect, function(i,v){
					if (fObj.val()!=v.subFundId){ //Do not include the option selected in first dropdown
						if(v.subFundId==tVal) //Make already selected box as default
							oList.push("<option value='"+v.subFundId+"' tnum='"+v.subFundTokensRemaining+"' fname='"+v.subFundName+"' selected=\"selected\">"+v.subFundName+" - "+v.subFundTokensRemaining+" "+epp.globalVar.tokensLabel+"</option>");
						else oList.push("<option value='"+v.subFundId+"' tnum='"+v.subFundTokensRemaining+"' fname='"+v.subFundName+"'>"+v.subFundName+" - "+v.subFundTokensRemaining+" "+epp.globalVar.tokensLabel+"</option>");
					}
				}); 
				tObj.append(oList.join(''));
				$("select#sfFrom option[tnum='0.00'][value!='selectOne'], select#sfFrom option[tnum='0'][value!='selectOne']").remove();
				if($("select#sfFrom").val()!="selectOne") $("select#sfFrom").find("option[value=selectOne]").remove();
				if($("select#sfTo").val()!="selectOne") $("select#sfTo").find("option[value=selectOne]").remove();
			}
			tt.dispRB();
		},
		dispRB:function(){//Display Resulting Balances
			var $tAmt=$('input#txt_amt'), $fOpt=$('select#sfFrom option:selected'), $tOpt=$('select#sfTo option:selected'),
				$fLabel=$('label#lbl_frmTkns_Lt'), $tLabel=$('label#lbl_toTkns_Lt');
			tt.tAmt=$tAmt.val().replace(/,/g, ''); 
			tt.tAmt=(!$.trim(tt.tAmt).length || isNaN(tt.tAmt))? 0: parseFloat(tt.tAmt);
			tt.fAmt=parseFloat($fOpt.attr('tnum')) || 0;
			tt.toAmt=parseFloat($tOpt.attr('tnum')) || 0;
			if((tt.fAmt-tt.tAmt) < 0){
				$fLabel.html(epp.globalVar.insufficientFund).addClass('textRed bld');
				$tLabel.html('');
				tt.fflag=false;
			} else {
				if($fOpt.val()!="selectOne") $fLabel.html(epp.addCommas(epp.fD.getFixedFloat(tt.fAmt-tt.tAmt))+" "+ epp.globalVar.tokensLabel).removeClass('textRed bld');
				if($tOpt.val()!="selectOne") $tLabel.html(epp.addCommas(epp.fD.getFixedFloat(tt.toAmt+tt.tAmt)) +" "+ epp.globalVar.tokensLabel);
				tt.fflag=true;
			}
			
			if( tt.tAmt < 0){
				$fLabel.html('Invalid Amount').addClass('textRed bld');
				$tLabel.html('');
				tt.fflag=false;
			}
			
			$('label#lbl_frmSf_Lt').html($fOpt.attr('fname'));
			$('label#lbl_toSf_Lt').html($tOpt.attr('fname'));
			tt.validate();
		},
		disFloat: function(e){
			var $this=$(this), val=$(this).val().replace(/,/g, '');
			if(!$.trim(val).length){$this.val("0.00"); return;} //Check if field is empty
			val = (isNaN(val))? "0.00" : epp.fD.getFixedFloat(val); //Check if it a valid number
			if (val=="0.00") tt.btnED($('button#btn_tt_Confrm'),false);
			$this.val(epp.addCommas(val));
		},
		validate:function(){//validate inputs and lead to enable or disable buttons
			var  flg = (
						tt.rg.test(epp.addCommas($('#txt_amt').val())) && 
						$('#chk_tt_uw').is(':checked') && 
						tt.fflag && 
						parseFloat($("#txt_amt").val())>0 && 
						$('#sfTo option:selected').attr('tnum') != '0'
					   )?1:0
			if(isNaN($('#txt_amt').val().replace(/,/g, ''))) flg=0;
			tt.btnED($('button#btn_tt_Confrm'),flg);
		},
		btnED:function(btn,flg){//Enable or Disable buttons
			if(flg)	btn.removeClass('disabled').removeAttr('disabled');
			else	btn.addClass('disabled').attr('disabled','disabled');
		},
		confirm:function(){// Confirm click
			var fromSubFundId = $('select#sfFrom option:selected').val(),
				toSubFundId = $('select#sfTo option:selected').val(),
				transferTokens = $.trim($('#txt_amt').val());
			vmf.ajax.post(epp.globalVar.saveTransferedTokensURL,
			"&fromSubFundId="+encodeURIComponent(fromSubFundId)+
			"&toSubFundId="+encodeURIComponent(toSubFundId)+
			"&transferTokens="+transferTokens,
			function(data){
				var oList=[],jData=data.GenericJSON;
				if (jData!=null && jData){ //Check if it is a proper json response
					$('div#step1').addClass('disabled').find('select,input,button').attr('disabled','disabled');	
					epp.common.toggleButton($('#btn_tt_Confrm'), false);
					$('#tfInst').hide();
					$('div#step2 div.div_row, div#step2 a').show();
					$('label#trnsfrdTkns').html(epp.addCommas(epp.fD.getFixedFloat(tt.tAmt)) + " " + epp.globalVar.tokensLabel)
					$('label#lbl_frmSf_Rt').html($('select#sfFrom option:selected').attr('fname'));
					$('label#lbl_toSf_Rt').html($('select#sfTo option:selected').attr('fname'));
					$('label#lbl_frmTkns_Rt').html(epp.addCommas(epp.fD.getFixedFloat(tt.fAmt-tt.tAmt)) + " " + epp.globalVar.tokensLabel);
					$('label#lbl_toTkns_Rt').html(epp.addCommas(epp.fD.getFixedFloat(tt.toAmt+tt.tAmt)) + " " + epp.globalVar.tokensLabel);
					if(typeof riaLinkmy != "undefined") riaLinkmy(epp.globalVar.pageName + ' : transfer tokens : confirm');
				} else {$('#tfInst .main_inst').html(epp.globalVar.transferTokensFailMsg);}
			},function(){$('#tfInst .main_inst').html(epp.globalVar.transferTokensFailMsg);
			},function(){$("#transferLoading").addClass('hidden');$("#step2").removeClass('hidden');
			},null,function(){$("#transferLoading").removeClass('hidden');$("#step2").addClass('hidden');
			});
		}
	},//Transfer Tokens will end here
	ua:{
		tknPr:null,aTkn:null,maxBases:null,licLoaded:null,partialEU:null,curVal:null,reConfig:null,partialSkuList:null,futureAllowed:null,tokensRemaining:null,
		init: function(){
			epp.fD.ua.licLoaded = false;
			epp.fD.ua.reConfig = false;
			epp.fD.ua.fullUpgrade = 0;
			epp.fD.ua.partUpgrade = 0;
			epp.fD.ua.bindCmnEvents();
			epp.fD.ua.buildStep1();
		},
		handlePreSelection:function() {
			var keys = epp.globalVar.preSelLicenseKeys, tblTrs = $('#tbl_products tbody tr'), qtyInput = $('#inputQty');
			qtyInput.val(parseInt(epp.globalVar.preSelUserQuantity));
			for(var j in keys) { $('#' + keys[j]).parents('tr').trigger('click'); }
		},
		bindCmnEvents:function(){//Binding all common events in upgrade
			 $('#upgrade_warning').click(function(){
			 	var totQty = $('#inputQty').val(), totSel = parseInt($('#totSel').text());
				(totSel >= totQty && $(this).is(':checked') && epp.fD.ua.maxBases > 0 && totSel && totQty )?epp.common.toggleButton($("#btnContinueUpgrade"),true):epp.common.toggleButton($("#btnContinueUpgrade"),false);
			 })
			 
			 $("#btnContinueUpgrade").click(function(){
			 	if(parseInt($('#totSel').text()) > $('#inputQty').val()){
			 		vmf.modal.show('partialUpgradeWin', {onShow:epp.fD.ua.validatePartial()});
				}else epp.fD.ua.confirmUpgrade();
			 })
			 
			 $("#cancelConfig").click(function(){
			 	window.location = epp.globalVar.cancelEditionUpgUrl;
			 })
			 
			 $('.fn_cancel',$('#partialUpgradeWin')).live('click',function(){vmf.modal.hide('partialUpgradeWin');})
			 
			 $('#inputQty').live('keydown',function(e) {
			  	var tv = $(this).val();
				if ( e.which == 46 || e.which == 8 || e.which == 9 ) {}
				else if(((e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105 )) || e.shiftKey) e.preventDefault(); 
				else if( $.trim(tv).length && tv >= 0) epp.fD.ua.validateInput($(this));
			}).live('keyup',function(e){
				var tv = $(this).val();
				if ( e.which == 46 || e.which == 8 || e.which == 9 ) {}
				else if(((e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105 )) || e.shiftKey) e.preventDefault(); 
				else if( $.trim(tv).length && tv >= 0) epp.fD.ua.validateInput($(this));
			}).live('focusout',function(){epp.fD.ua.validateInput($(this));});

			$('#btnPartialContinue').live('click',function() {
				epp.fD.ua.partialEU = true;
				vmf.modal.hide('partialUpgradeWin');
				epp.fD.ua.confirmUpgrade();
			});
		},
		confirmUpgrade:function(){
			var euForm = $('#editionUpgForm'), qtyInput = $('#inputQty').val(), sTrs = $('#tbl_products tr.active'), qtys = [], licKeys = [];
			vmf.loading.show({'overlay':'true'});
			if($("#btnContinueUpgrade").is(':visible')) epp.common.toggleButton($("#btnContinueUpgrade"),false);
			if($("#cancelConfig").is(':visible')) epp.common.toggleButton($("#cancelConfig"),false);
			euForm.find('input[name="partialUpgradeFlag"]').val(epp.fD.ua.partialEU);
			$.each(sTrs, function(c,oRow){qtys.push($(oRow).data('pQty')); licKeys.push($(oRow).data('key'))})
			euForm.find('input[name="csLicQty"]').val(qtys.join(','));
			euForm.find('input[name="csLicKeys"]').val(licKeys.join(','));
			$('#editionUpgForm').submit();
		},
		validatePartial:function(){//Validating if selections need partial configure
			var trs = $('#tbl_products tr.active'), licTbl = $('#licenseTbl'), bal = parseInt($('#totSel').text()) - $('#inputQty').val();
		 	licTbl.empty();
		 	epp.fD.ua.fullUpgrade = 0;
			epp.fD.ua.partialSkuList = [];
			$('#totalQty').text($('#totSel').text());
			$('#selectedQty').text($('#inputQty').val());
			$('#difQty').text(bal);
			$.each(trs, function(c,oRow){
				if($(oRow).data('qty') > bal) {
					licTbl.append('<tr><td>'+ $(oRow).data('qty')+'</td><td>'+ $(oRow).data('disc')+'<br/>'+$(oRow).data('key')+'<br/>'+$(oRow).data('fld') +'</td></tr>');
					epp.fD.ua.partialSkuList.push($(oRow));
				}
				else epp.fD.ua.fullUpgrade += $(oRow).data('qty');
					
				licTbl.find('tr:eq('+c+')').data('qt',$(oRow).data('qty'));
			})
		 	epp.fD.bindHoverEffects(licTbl);
			if(licTbl.find('tr').length == 1) licTbl.find('tr').trigger('click');
			else {
				$('#resultInst').show();
				$('#resultData').hide();
			}
		},
		calcPartial:function(tr){//Calculating Partial configure
			var licTrs = $('#licenseTbl tbody tr'), upQtySum, remainQty, upgradeQty, qt = parseInt(tr.find('td:eq(0)').text()), section = $('#resultData'), pTot;
			epp.fD.ua.partUpgrade = 0;
			$.each(licTrs, function(c,oRow){
				if(!$(oRow).hasClass('active')) epp.fD.ua.partUpgrade += $(oRow).data('qt');
			});
			upQtySum = (epp.fD.ua.fullUpgrade + epp.fD.ua.partUpgrade);
			remainQty = $('#difQty').text();
			qt = parseInt(tr.find('td:eq(0)').text());
			upgradeQty = qt-remainQty;
			pTot = (parseInt($('#totSel').text()) - epp.fD.ua.fullUpgrade);
			
			$.each(licTrs, function(c,oRow){
				$(oRow).data('qt',epp.fD.ua.partialSkuList[c].data('qty'));
				epp.fD.ua.partialSkuList[c].data('pQty',$(oRow).data('qt'));
				if($(oRow).hasClass('active')) {
					epp.fD.ua.partialSkuList[c].data('pQty',upgradeQty);
				}
			});
			$('#resultInst').hide();
			$('#resultData').show();
			$('.cQ',section).text(qt-remainQty);
			$('.tQ',section).text(qt);
			$('.bQ',section).text(remainQty);
			$('.prD',section).text($('#tbl_upgrade tr.expanded .subProDisc').text());
			$('.prDto',section).text($('#tbl_products tr.active').data('disc'));
			epp.common.toggleButton($('#btnPartialContinue'),true);
		},
		buildStep1:function(jData){//Building table with main product detail including linked product
			$('#tbl_upgrade tbody').html('<tr><td colspan="3"><div class="loadingWrapper"><div class="loading_big">'+epp.globalVar.loadingLabel+'</div></div></td></tr>');
			vmf.ajax.post(epp.globalVar.productDetailsURL,null,function(jData){
				if(jData != null){
					var jD =jData.ProductDetails[0], tbl = $('#tbl_upgrade tbody'), oList = [];
					oList.push("<tr class='expanded'><td><div class='prodName'><h4>"+ jD.sku + "</h4><div class='subProDisc'>" + jD.skuDesc +"</div></div></td><td class='qty'><input id='inputQty' class='upgradeInput' type='text' maxlength='3' size='3'> <span>" + epp.globalVar.of+ "</span><span id='maxBases'>"+ jD.totalBaseQuantity +"</span> <span>" + epp.globalVar.availablebases +"</span><div class='errMsg' id='qtyError' style='display: none'>"+epp.globalVar.basesvalidationerror	+"</div></td><td class=\"tknsReq\">"+ parseFloat(0.00).toFixed(2) + "</td></tr>");
					epp.fD.ua.futureAllowed = jD.isFutureAllowed;
					epp.fD.ua.tokensRemaining = parseInt(jD.tokensRemaining);
					if(jD.snsSku != null && jD.snsSku.length) oList.push("<tr class='linkedRow'><td><div class='linkedProd'><h4>"+ jD.snsSku + "</h4><div class='subDisc'>" + jD.snsSkuDesc +"</div><div><span class='snsTime'>" + epp.globalVar.snsduration +"</span>" + jD.snsDuration +" " + epp.globalVar.days +"</div></div></td><td class='qty'><input id='linkedVal' class='uaReadOnly' readonly='readonly'></td><td class=\"tknsReq\">"+ parseFloat("0.00").toFixed(2) + "</td></tr>");
					tbl.empty().append(oList.join(''));
					
					epp.fD.ua.tknPr = parseFloat(jD.skuTokens);
					epp.fD.ua.aTkn = parseFloat(jD.snsSkuTokens);
                    epp.fD.ua.snsDuration = parseInt(jD.snsDuration);
					epp.fD.ua.maxBases = parseInt(jD.totalBaseQuantity);
					$('#maxBases').text(jD.totalBaseQuantity);
					epp.fD.ua.loadLicenses(epp.globalVar.licenseDetailsURL);
					epp.fD.ua.licLoaded = true;
					//checking of if its reconfiguration
					if(epp.globalVar.preSelUserQuantity != "undefined" && epp.globalVar.preSelUserQuantity != null) {
						epp.fD.ua.reConfig = true;						
					}
                    epp.fD.ua.handleSnSTokenCalculation();
				}
			},epp.fD.ua.reloadError)
		},
		buildDefaultTbl:function(){
			$('#tbl_products thead').html('<tr><th width="22px"></th><th width="56px">'+ epp.globalVar.hdrQty +'</th><th width="56px">'+ epp.globalVar.hdrAvail +'</th><th width="203px">'+ epp.globalVar.hdrLicense +'</th><th width="179px">'+ epp.globalVar.hdrFolder +'</th><th width="50px">'+ epp.globalVar.hdrBundle +'</th><th class="right">'+ epp.globalVar.hdrSnsVal +'</th></tr>');
			$('#tbl_products tbody').html('<tr><td colspan="7" class="dataTables_empty"><div class="inst_text">'+epp.globalVar.defaultInst+'</div></td></tr>');
		},
		buildLicenseTbl:function(dUrl,first){//Building licenses table
			var tbl = $('#tbl_products');
			tbl.empty();
			vmf.datatable.build(tbl,{
				"aoColumns": [
					{"sTitle": "","sWidth":"16px","sSortDataType": "dom-checkbox","bSortable":false},
					{"sTitle": "<span class='descending'>" + epp.globalVar.hdrQty + "</span>","sWidth":"45px","bSortable":true},
					{"sTitle": "<span class='descending'>" + epp.globalVar.hdrAvail + "</span>","sWidth":"45px","bSortable":true},
					{"sTitle": "<span class='descending'>" + epp.globalVar.hdrLicense + "</span>","sWidth":"170px","bSortable":true},
					{"sTitle": "","bVisible":false},
					{"sTitle": "<span class='descending'>" + epp.globalVar.hdrFolder + "</span>","sWidth":"150px","bSortable":true},
					{"sTitle": "<span class='descending'>" + epp.globalVar.hdrBundle + "</span>","sWidth":"40px","bSortable":true},
					{"sTitle": "<span class='descending' style='padding-right:15px'>" + epp.globalVar.hdrSnsVal + "</span>","sWidth":"110px","sClass":"right","bSortable":true}
				],
				"oLanguage": {
					"sEmptyTable":'<div class="inst_text">'+epp.globalVar.defaultInst+'</div>',
					"sProcessing":epp.globalVar.loadingLabel,
					"sLoadingRecords":""
				},
				"sAjaxSource": dUrl,
				"bInfo":false,"bProcessing": true,"bServerSide": false,"bAutoWidth":false,"bFilter":false,"bPaginate": false,"sScrollY": "225px","aaSorting": [[ 2, "desc" ]],
				"sDom": 'zrtSpi',
				"fnRowCallback": function(nRow,aData,iDisplayIndex){ 
					var $nRow=$(nRow);
					$nRow.data({'id':aData[0],'qty':parseInt(aData[2]),'max':parseInt(aData[2]),'disc':aData[4],'key':aData[3],'fld':aData[5]});
					$nRow.find("td:eq(0)").html('<input type=\"checkbox\" id=\"'+ aData[0] +'\">');
					$nRow.find("td:eq(1),td:eq(2)").addClass('qty');
					$nRow.find("td:eq(3)").html(aData[3]+'<br/>'+aData[4]);
					//if(!epp.fD.ua.futureAllowed && epp.fD.ua.tokensRemaining > 0) $nRow.find("td:eq(6)").html('Included');
					if(aData[2] == 0 || epp.fD.ua.maxBases == 0 || (!epp.fD.ua.reConfig && $.trim($('#inputQty').val()) == '') ) $nRow.addClass('inactive disabled');
					if(aData[2] == 0) $nRow.addClass('availZero');
					if($nRow.hasClass('active')) $('input:checkbox',$nRow).attr('checked',true).attr('disabled',false);
					if($nRow.hasClass('inactive')) $('input:checkbox',$nRow).attr('checked',false).attr('disabled',true); 
					$('input:checkbox',$nRow).click(function(e){e.stopPropagation();$nRow.trigger('click');});
					return nRow;
				},
				"fnInitComplete": function (){
					if(!first) epp.fD.bindHoverEffects(this,'multi');
					if(epp.fD.ua.reConfig){
						epp.fD.ua.handlePreSelection(); 
						epp.fD.ua.reConfig = false; 
						epp.fD.ua.validateQty();
					}
				}
			});
		},
		loadLicenses:function(dUrl){
			if(!epp.fD.ua.licLoaded) epp.fD.ua.buildLicenseTbl(dUrl);
			//vmf.datatable.reload($('#tbl_products'),dUrl,epp.fD.bindHoverEffects($('#tbl_products'),'multi'),"POST",null,epp.fD.ua.reloadError);
		},
		reloadError: function(error){
			alert('error');
		},
		validateInput:function(input){ //Common method to validate input on enter press or focus out of quantity field
			var tv = $(input).val(), iFld = $(input);
			if(epp.fD.ua.maxBases > 0){
				if(tv <= epp.fD.ua.maxBases && $.trim(tv).length > 0 && tv > 0 ){
					epp.fD.ua.loadLicenses(epp.globalVar.licenseDetailsURL);
					epp.fD.ua.licLoaded = true;
					if(tv != epp.fD.ua.curVal || iFld.hasClass('error')) epp.fD.ua.clearError(iFld);
					epp.fD.ua.curVal = tv;
				}
				if(tv > epp.fD.ua.maxBases || !$.trim(tv).length || tv <= 0) epp.fD.ua.showError(iFld);
			}else if(epp.fD.ua.maxBases == 0){
				if($.trim(tv).length > 0 && tv >= 0 ){
					epp.fD.ua.loadLicenses(epp.globalVar.licenseDetailsURL);
					epp.fD.ua.licLoaded = true;
				}
			}
		},
		showError:function(iFld){//Showing up error of quantity field and other related operations
			iFld.addClass('error');
			$('#qtyError').show();
			$('#tbl_products tr').removeClass('active').addClass('inactive').find('input:checkbox').attr('disabled',true).attr('checked',false);
			$('#overLimit').hide();
			iFld.parent().next().text('0.00');
			$('#totSel').text(0);
			$('#linkedVal').val('').parent().next().text('0.00');
			if(!$.trim(iFld.val()).length) iFld.val(0);
			epp.common.toggleButton($("#btnContinueUpgrade"),false);
		},
		clearError:function(iFld){//Clearing error
			if($.trim(iFld.val()).length || iFld.val() == 0) iFld.removeClass('error');
			else iFld.val(0);
			$('#qtyError').hide();
			if(epp.fD.ua.curVal == undefined || epp.fD.ua.curVal == null || epp.fD.ua.curVal == '') $('#tbl_products tr').not('.availZero').removeClass('inactive').removeClass('disabled').find('input:checkbox').attr('disabled',false).attr('checked',false);
			$('#tbl_products tr').not('.disabled').removeClass('active').find('input:checkbox').attr('disabled',false).attr('checked',false);
			epp.fD.ua.validateQty();
		},
		validateQty:function(){
			var trs = $('#tbl_products tr.active'), ts = 0, 
				skuInput = $('#inputQty'), tv = $('#inputQty').val(),
				tReq1 = ($('#inputQty').val()*epp.fD.ua.tknPr).toFixed(2),
				tReq2 = ($('#inputQty').val()*epp.fD.ua.aTkn*epp.fD.ua.snsDuration/epp.fD._daysInYear).toFixed(2);
			
			skuInput.parent().next('.tknsReq').text(tReq1);
			$('#linkedVal').attr('value',tv).parent().next('.tknsReq').text(tReq2);
			$.each(trs, function(c,oRow){ts += parseInt($(oRow).data('qty')); $(oRow).data('pQty',$(oRow).data('qty'))})
			$('#totSel').text(ts);
			(ts > 0)?$('#totSel').parents('.totalDetail').removeClass('zeroVal'):$('#totSel').parents('.totalDetail').addClass('zeroVal');
			(ts >= tv && !epp.fD.ua.reConfig)? $('#tbl_products tr').not('.active').addClass('inactive').find('input:checkbox').attr('disabled',true):$('#tbl_products tr').not('.disabled').removeClass('inactive').find('input:checkbox').attr('disabled',false);
			(ts > tv)?$('#overLimit').show():$('#overLimit').hide();
			($('#upgrade_warning').is(':checked') && ts >= tv)?epp.common.toggleButton($("#btnContinueUpgrade"),true):epp.common.toggleButton($("#btnContinueUpgrade"),false);
			if(tv == 0){
				$('#tbl_products tr').removeClass('active').addClass('inactive').find('input:checkbox').attr('disabled',true).attr('checked',false);
				$('#totSel').text(0);
				$('#overLimit').hide();
				epp.common.toggleButton($("#btnContinueUpgrade"),false);
			}
            epp.fD.ua.handleSnSTokenCalculation();
		},
        handleSnSTokenCalculation:function() {
            var snsTokensCurProduct = epp.fD.getFixedFloat($('#inputQty').val()*epp.fD.ua.aTkn*epp.fD.ua.snsDuration/epp.fD._daysInYear), inSufficientFlag = false;;
            if(!epp.globalVar.futureAllowed && epp.globalVar.snsTokenBalance > 0) {
                if(snsTokensCurProduct > 0) {
                    if(snsTokensCurProduct > epp.globalVar.snsTokenBalance) {
                        var excessSnSTokens = snsTokensCurProduct - epp.globalVar.snsTokenBalance;
                        if(epp.globalVar.trueUpActive) { //Show Partially included
                            $('#linkedVal').val(epp.globalVar.nofutureindicator);
                            //$('#tbl_upgrade .linkedRow .tknsReq').text(epp.globalVar.partiallyincluded);
                            $('#tbl_upgrade .linkedRow .tknsReq').text(epp.globalVar.nofutureindicator);
                        } else { //Show insufficient
                            $('#linkedVal').val(epp.globalVar.nofutureindicator);
                            //$('#tbl_upgrade .linkedRow .tknsReq').addClass('textRed').text(epp.globalVar.insufficient);
                            $('#tbl_upgrade .linkedRow .tknsReq').addClass('textRed').text(epp.globalVar.nofutureindicator);
                            inSufficientFlag = true;
                        }
                    } else { //Show included
                        $('#linkedVal').val(epp.globalVar.nofutureindicator);
                        //$('#tbl_upgrade .linkedRow .tknsReq').text(epp.globalVar.futureincluded);
                        $('#tbl_upgrade .linkedRow .tknsReq').text(epp.globalVar.nofutureindicator);
                    }
                } else {
                    if(epp.globalVar.snsTokenBalance > 0) {
                        $('#linkedVal').val(epp.globalVar.nofutureindicator);
                        //$('#tbl_upgrade .linkedRow .tknsReq').text(epp.globalVar.futureincluded);
                        $('#tbl_upgrade .linkedRow .tknsReq').text(epp.globalVar.nofutureindicator);
                    }
                }
            }
            //if(!inSufficientFlag) {
                $('#tbl_upgrade .linkedRow .tknsReq').removeClass('textRed');
            //}
        }
	}
};//End of fund details
