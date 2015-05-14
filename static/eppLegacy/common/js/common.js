if (typeof(epp) == "undefined") epp = {};

epp.cmn =  {
    _inCart: [],
    _inCartQty: [],
    _inCartSkuIdList: [],
    _totLicTok: 0.0,
    _totSnSTok: 0.0,
    _preselectRedeem: false,
    _daysInYear: parseInt(epp.globalVar.daysInYear), //need to get from properties
    _minTopTokFlag: false,
    _ENTER_KEY: 13,
    init: function() {
        vmf.scEvent =true;
        $("#filterVal").val('');
        $(".addCart", $("#prodList")).live('click',function(){ //Click event to Add to cart button
            var lParent=$(this).closest('li');
            epp.cmn.addToCart(lParent.data('jData')); //Pass the json obj to build table row 
            lParent.addClass('inCart'); //Add this class to decrease opacity
            var _cartButton = $('#prodList ul').find('.'+lParent.data('jData').sku);
            _cartButton.find('.addCart').replaceWith('<div class="cartMsg">'+epp.globalVar.currentlyInCart+'</div>'); //Replace add to cart with static text
            return false;
        });
        $('.dCart', $("#redeem_content")).live('click',function(){ //Remove from cart
            epp.cmn.removeFromCart($(this));
            return false;
        });
        $("#eCart").live('click',function(){
            if ($("#cT tbody tr").length && !($(this).hasClass('disabled'))){ //Check if Cart has any entries..
                $.each($("#cT tbody tr"),function(j,pRow){
                    if($("li.inCart."+$(pRow).attr('liRef')).length){ //Update corresponding entry in tree
                        var liRef=$("li.inCart."+$(pRow).attr('liRef'));
                        liRef.find('.addBtn').html('<button class="secondary addCart">'+epp.globalVar.addToCart+'</button>');
                        liRef.removeClass("inCart");
                    }
                    $(pRow).remove();
                });
                //Update total and remaining tokens
                var curCartObj=$('.tokenVal', $('.tokensInCart')), remainCartObj=$('.tokenVal', $('.tokensRemain'));
                var curCart= parseFloat(curCartObj.html()), remainCart=parseFloat(remainCartObj.html());
                remainCart+=curCart;
                curCartObj.html("0.00").removeClass('isFunds sFunds');
                remainCartObj.html(remainCart).removeClass('isFunds sFunds');
                $("#cT").hide();
                $("#cInst").show();
                epp.cmn._inCart=[];
                epp.cmn._inCartQty=[];
                epp.cmn._inCartSkuIdList=[];
                epp.cmn._totLicTok=0.0;
                epp.cmn._totSnSTok=0.0;
                //Populate tooltip message for above
                $('#tokenVal').data('title','<div><div>'+epp.globalVar.totalLicenseTokensMsg+epp.cmn.getFixedFloat(epp.cmn._totLicTok)+'</div><div>'
                    +epp.globalVar.totalSnSTokensMsg+epp.cmn.getFixedFloat(epp.cmn._totSnSTok)+'</div></div>');
				epp.cmn.toggleContinue(false);
                $('#filterVal').val('');
                $('#filter').addClass('disabled');
                epp.cmn.getProducts();
            }
            $(this).addClass('disabled');
            epp.cmn.eligibilityWrapper(0);
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
            var nVal = $(this).val(), tRow=$(this).closest('tr'), oldCount, newCount;
            if(nVal=="") {
                nVal = epp.globalVar.zeroQty;
                $(this).closest('tkns').find('.sQty .tknVal').val('');
            } else if(nVal==0){
                $(this).val(epp.globalVar.zeroQty);
                $(this).closest('tkns').find('.sQty .tknVal').val(epp.globalVar.zeroQty);
                nVal = epp.globalVar.zeroQty;
            }
            if(isNaN(nVal)){
                return;
            }
			if($(".sQty .tknVal", tRow).val() != epp.globalVar.nofutureindicator) {
				$(".sQty .tknVal", tRow).val(nVal);
			}
            var licRowTokVal = parseFloat($(".mTotal", tRow).attr("oVal"))*nVal;
            $(".mTotal", tRow).html(epp.cmn.getFixedFloat(licRowTokVal));
            if($(".sTotal", tRow).attr("oVal") != undefined && $(".sTotal", tRow).attr("oVal") != "") {
                var snsTokens = parseFloat($(".sTotal", tRow).attr("oVal")), snsDuration;
                //Try to get snsduration for current row, if not present get from prodlist
                if(tRow.attr('snsDur') != undefined && tRow.attr('snsDur') != null) {
                    snsDuration = tRow.attr('snsDur');
                }
                else {
                    snsDuration = $('#prodList .'+tRow.attr('liref')).data('jData').snsDuration;
                }
				if(snsTokens != "") {
					$(".sTotal", tRow).html(epp.cmn.getFixedFloat(epp.cmn.calcSnsTotalTokens(snsTokens,nVal,snsDuration)));
				}
            }
            epp.cmn.calcCart();
            //Calculate total license and SnS tokens
            var obj = tRow.data('jData');
            if(obj.skuTokens != "" && obj.termLicense != undefined && !obj.termLicense.isTerm) {
                var oldQty = tRow.attr('oldQty');
                if(oldQty == undefined || oldQty == '') {
                    oldQty = 0;
                }
                if(nVal == 0) {
                    epp.cmn._totLicTok = Math.abs(epp.cmn._totLicTok - parseFloat(oldQty*obj.skuTokens));
                } else {
                    epp.cmn._totLicTok = Math.abs(epp.cmn._totLicTok - parseFloat(oldQty*obj.skuTokens) + licRowTokVal);
                }
            }
            epp.cmn._totSnSTok = Math.abs(parseFloat($('#tokenVal').text()) - epp.cmn._totLicTok);
            //Populate tooltip message for above
            $('#tokenVal').data('title','<div><div>'+epp.globalVar.totalLicenseTokensMsg+epp.cmn.getFixedFloat(epp.cmn._totLicTok)+'</div><div>'+epp.globalVar.totalSnSTokensMsg+epp.cmn.getFixedFloat(epp.cmn._totSnSTok)+'</div></div>');
            
            //Forcefully trigger mouseover if the hover is already on in order to recalculate tooltip message
            //Disable this feature for IE7 and IE8 as not supported
            if(!($.browser.msie && $.browser.version.substr(0,1) < 9)) {
                if($('#tokenVal').is(":hover")) {
                    $('#tokenVal').trigger('mouseover');
                }
            }
            
            //Update Cart quantity
            var qty=0, sku=tRow.attr('liref');
            if(nVal != "") {
                qty = nVal;
            }
            if(sku) {
                var skuIdx = $.inArray(sku,epp.cmn._inCart);
                if(skuIdx >= 0) {
                    epp.cmn._inCartQty[skuIdx] = qty;
                }
            }
            //Store this value as old value
            tRow.attr('oldQty',nVal);
        });
        $(".filterVal",$("#redeem_content")).die('keyup').live('keyup', function(e){
            var code = (e.keyCode ?  e.keyCode : e.which);
            if($.trim($(this).val()).length == 0) {
                if(code == epp.cmn._ENTER_KEY) {
                    $("#instText .instText").hide();
                    $("#prodList ul.fullContent").show();
                    $("#prodList ul.fContent").remove();
                }
                $("#filter").removeClass("disabled").unbind('click').bind('click', function() {
					$("#instText .instText").hide();
                    $("#prodList ul.fullContent").show();
                    $("#prodList ul.fContent").remove();
                });
            }
            else if ($.trim($(this).val()).length >= 3){
                if(code == epp.cmn._ENTER_KEY) {
                    epp.cmn.filterContent();
                }
                $("#filter").removeClass("disabled").unbind('click').bind('click',epp.cmn.filterContent);
            }else{
                $("#filter").addClass("disabled").unbind('click');
            }
        });
		
		$("#prodList ul.fContent a.openClose").live('click',function(e){
            $(this).toggleClass("open");
            $(this).siblings(".prDisc, .linkedProd ").animate({height: 'toggle', opacity: 'toggle'});
            e.preventDefault();
            e.stopPropagation();
        });
		$("#editProgType").click(function(e){
			if($('#confg_modalPublic').length){
				vmf.modal.show('confg_modalPublic', {
					onShow:$('#btn_continue_public').click(function(){
						$("#progType").text($(".proType").val());
						vmf.modal.hide();
					})
				});
			}
			else if($('#confg_modalPartner').length){
				vmf.modal.show('confg_modalPartner', {
					onShow: epp.cmn.onShowPartnerModal()
				});
			}
		});
		$("#editVpp").click(function(e){
				vmf.modal.show('confg_modalPartner', {
					onShow: epp.cmn.onShowPartnerModal()
				});
		});
		$("#editFundOwnerEmail").click(function(e){
				vmf.modal.show('confg_modalPartner', {
					onShow: epp.cmn.onShowPartnerModal()
				});
		});

		epp.cmn.getProducts(); //Send request to get products
        $('#confg_modalPartner select,#confg_modalPartner input').keypress(function(e){
		    var enterKey = 13;
		    if(e.which == enterKey) $('#btn_continue').trigger('click');
		});
        //opening modal windows on page load
        if($('#confg_modalPublic').length) {
            vmf.modal.show('confg_modalPublic', {
                onShow: epp.cmn.onShowPublicModal()
            });
        }
        else if($('#confg_modalPartner').length) {
            if(epp.globalVar.preSelect != undefined && epp.globalVar.preSelect == epp.globalVar.eppLabel) {
                vmf.loading.show({"msg":epp.globalVar.partnerLoadingMsg,"overlay":true});
                var resultFlag = epp.cmn.onShowPartnerModal();
                if(!resultFlag || !epp.globalVar.autoSubmit) {
                    vmf.loading.hide();
                    vmf.modal.show('confg_modalPartner');
                }
            } else {
                vmf.modal.show('confg_modalPartner', {
                    onShow: epp.cmn.onShowPartnerModal()
                });
            }
        } 
        $('#btn_continue_disc').click(function() {
            vmf.modal.hide('discLevelModal');
        });
        $('#eCart').addClass('disabled');
        vmf.rotate.hide($('#arrow'),-180);
        vmf.rotate.hide($('#tulArrow'),-180);
        vmf.rotate.hide($('#turArrow'),-180);
        epp.cmn.clearEligEntries();
      $('#progTypeDropDown').live('change',function() {
		var selectedVal = $.trim($('#progTypeDropDown option:selected').val());
            if(selectedVal == epp.globalVar.eppLabel) {
                $('#vppOptionInput').addClass('hidden');
                $('#eppOptionInput').removeClass('hidden');
				$('#invalidPartnerEmailMsg').addClass('hidden');
				$('#invalidPartnerMsg').addClass('hidden');
				$('#invalidPartnerVPPMsg').addClass('hidden');
            } else if(selectedVal == epp.globalVar.vppLabel) {
                $('#eppOptionInput').addClass('hidden');
                $('#vppOptionInput').removeClass('hidden');
				$('#invalidPartnerEmailMsg').addClass('hidden');
				$('#invalidPartnerMsg').addClass('hidden');
				$('#invalidPartnerVPPMsg').addClass('hidden');
            } else {
                $('#eppOptionInput').addClass('hidden');
                $('#vppOptionInput').addClass('hidden');
				$('#invalidPartnerEmailMsg').addClass('hidden');
				$('#invalidPartnerMsg').addClass('hidden');
				$('#invalidPartnerVPPMsg').addClass('hidden');
            }
        });
        if(epp.globalVar.myvmwareUserFlag != undefined && epp.globalVar.myvmwareUserFlag) {
            $("#pubProgTypeSelect option[value='" + epp.globalVar.eppLabel + "']")
                .attr('selected','selected');
            $('#pubProgTypeSelect').trigger('change');
        } else {
            $("#pubProgTypeSelect option[value='" + epp.globalVar.commerciallicensetype + "']")
                .attr('selected','selected');
            $('#pubProgTypeSelect').trigger('change');
        }
        if(epp.globalVar.preSelect == epp.globalVar.eppLabel) {
            $("#pubProgTypeSelect option[value='" + epp.globalVar.eppLabel + "']")
                .attr('selected','selected');
            epp.globalVar.preSelect = "Selected";
            $('#pubProgTypeSelect').trigger('change');
            $('#btn_continue_public').trigger('click');
        } else if(epp.globalVar.progType == epp.globalVar.vppLabel && epp.globalVar.cType) {
            $("#progTypeDropDown option[value='" + epp.globalVar.eppLabel + "']")
                .remove();
            $("#progTypeDropDown option[value='" + epp.globalVar.vppLabel + "']")
                .attr('selected','selected');
            $('#progTypeDropDown').trigger('change');
        }
        $('#lPartnerInfo').addClass('hidden');
		
		$("#btn_Email_cart").live('click',function(){epp.cmn.submitEmail($('#newEmailAddress').val());});
        //Bind event for total license and sns tokens tooltip
        $('#tokenVal').addClass('tooltiptext').data('title','<div><div>'+epp.globalVar.totalLicenseTokensMsg+epp.cmn.getFixedFloat(epp.cmn._totLicTok)+'</div><div>'+epp.globalVar.totalSnSTokensMsg+epp.cmn.getFixedFloat(epp.cmn._totSnSTok)+'</div></div>');
        myvmware.hoverContent.bindEvents($('#tokenVal'),'funcleft',$('#tokenVal'),260);
        //Omniture page event
        callBack.addsc({'f':'riaLinkmy','args':[epp.globalVar.pageName]});
	},//end of init
    getFixedFloat: function(inputFloat) {
        if(typeof inputFloat != epp.globalVar.number) {
            return(parseFloat(inputFloat).toFixed(2));
        }
        else {
            return(inputFloat.toFixed(2));
        }
    },
	calcSnsTotalTokens: function(snsTokens,qty,snsDuration) {
		if(snsTokens == "" || qty == "" || snsDuration == "") {
			return ""
		} else if(epp.globalVar != undefined && 
                epp.globalVar.configuratorType == epp.globalVar.publicConfiguratorType) {
            return(parseFloat(snsTokens)*qty*epp.globalVar.publicSnsPreMultiplier);
        } else {
			return(parseFloat(snsTokens)*qty*snsDuration/parseFloat(epp.globalVar.daysInYear));
		}
    },
	filterContent: function(){
        $("#prodList>ul").hide();
        $("#instText").hide();
        $("#prodList").find(".fContent").remove();
        $("#prodList").append("<ul class=\"fContent\"><li class=\"level1\"></li></ul>");
        var sObj = new Object();
        sObj['searchString'] = $('#filterVal').val();
		if(sObj['searchString'].match(epp.globalVar.skuFilterRegex)) {
			$('#prodTreeLoading').removeClass('hidden');
            vmf.ajax.post(epp.globalVar.searchPublicSkuURL,sObj,epp.cmn.leafNode($("#prodList ul.fContent li"), true),epp.cmn.errorNode);
        }
		else {
			$("#instText .instText").eq(0).hide();
			$("#instText").show();
			$('#filterNoResults').removeClass('hidden');
		}
    },
	getProducts: function() {
		vmf.ajax.post(epp.globalVar.publicProductFamilyURL, null, epp.cmn.prodTree, epp.cmn.errorRes);
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
		} else {
			$("#prodList ul").html("<li class=\"level0\"><span class=\"pName\">"+ epp.globalVar.noproducts +"</span></li>");
		}
		epp.cmn.bindEvents(); //bind click event for expand/collapse button
	},
	bindEvents: function(){
		$("#prodList a.openClose").unbind('click').bind('click',function(e){
			if($(this).parent().next("ul").length){ //toggle next ul if available
				$(this).toggleClass("open").parent().next().animate({ height: 'toggle', opacity: 'toggle'});
			} else { //If next ul is not available, send the request to server
				$(this).toggleClass("open");
                if($(this).hasClass("open")) {
                    vmf.ajax.post(epp.globalVar.publicSkuDetailsListURL+"&productLineCode="+encodeURIComponent($(this).parents('.pName').attr('pCode')),null,epp.cmn.leafNode($(this).closest('li')),epp.cmn.errorNode);
                }
			}
			e.preventDefault();
			e.stopPropagation();
		});
	},
	errorRes: function(){
        $('#prodTreeLoading').addClass('hidden');
		$("#prodList ul").html("<li class=\"level0\"><span class=\"pName\">"+ epp.globalVar.noproducts +"</span></li>");
	},
	leafNode: function(liNode){ //This is to create leaf node
		liNode.find('span').append('<ul class="loading"><li class="loading_text"><span class="loading_small no-border">' + epp.globalVar.productloading + '</span></li></ul>');
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
					if (epp.cmn._inCart.length && $.inArray(item.sku, epp.cmn._inCart)!=-1){
						icClass="inCart";
					}
                    if(item.snsSku != "" && item.isFutureAllowed) {
                        ulList.append($('<li class="level2 clearfix '+item.sku+' '+icClass+'"><div class="prTitle clearfix"><h4>'+item.sku+'</h4><div class="fnTitle">'+item.skuTokens +' '+epp.globalVar.tokensandsnstokens+'</div></div><div class="addBtn"><button class="secondary addCart">'+ epp.globalVar.addToCart +'</button></div><div class="prDisc clearfix">'+item.skuDesc+'</div><div class="linkedProd clearfix"><h4>'+item.snsSku+'</h4><div class="subProDisc">'+item.snsSkuDesc+'</div><div class="showSNS clearfix"><span class="snsTime">'+epp.globalVar.snsduration+'</span><span class="snsVal">&nbsp;'+item.snsDuration+' '+epp.globalVar.days +'</span></div></div></li>').data("jData",item));
                    }
                    else {
                        ulList.append($('<li class="level2 clearfix '+item.sku+' '+icClass+'"><div class="prTitle clearfix"><h4>'+item.sku+'</h4><div class="fnTitle">'+item.skuTokens +' '+ epp.globalVar.tokens+'</div></div><div class="addBtn"><button class="secondary addCart">'+ epp.globalVar.addToCart +'</button></div><div class="prDisc clearfix">'+item.skuDesc+'</div><div class="linkedProd clearfix">').data("jData",item));
                    }
					if (icClass=="inCart"){ 
						ulList.find("li."+item.sku+" button").replaceWith('<div class="cartMsg">'+epp.globalVar.currentlyInCart+'</div>');
						icClass="";
					}
				});
				liNode.append(ulList).find("ul.loading").remove();
			}
            else if(leafJson && leafJson.length == 0) {
                liNode.find("ul.loading").remove();
				$("#instText .instText").eq(0).hide();
				$("#instText").show();				
				$('#filterNoResults').show().removeClass('hidden');
            }
		};
	},
	errorNode: function(liNode){
        $('#prodTreeLoading').addClass('hidden');
        $("#prodList a.openClose").closest('li').find("ul.loading").remove();
    },
	addToCart: function(obj){
		epp.cmn._inCart.push(obj.sku);
        if(typeof obj.skuQuantity != undefined && obj.skuQuantity != null) {
            epp.cmn._inCartQty.push(obj.skuQuantity);
        }
        else {
            epp.cmn._inCartQty.push(epp.globalVar.defaultQty);
        }
        var tknQty = epp.cmn._inCartQty[epp.cmn._inCartQty.length-1];
        epp.cmn._inCartSkuIdList.push(obj.skuID);
        if(obj.snsSku != "") {
            //addToCart functionality here
            $("#cT tbody").append('<tr liRef='+obj.sku+'><td class="skuProd clearfix tooltiptext"><div class="mItem">'+obj.sku+'</div><div class="sItem">'+obj.snsSku+'</div></td><td class="tkns clearfix"><div class="mTkns">'+epp.cmn.getFixedFloat(obj.skuTokens)+'</div><div class="sTkns">'+epp.cmn.getFixedFloat(obj.snsSkuTokens)+'</div></td><td class="tkns clearfix"><div class="mQty"><input type="text" class="tknVal" pattern="[0-9]*" value="' + tknQty + '" /></div><div class="sQty"><input type="text" class="tknVal" pattern="[0-9]*" value="' + tknQty + '" disabled="true" /></div></td><td class="tkns clearfix"><div class="mTotal" oVal='+obj.skuTokens+'>'+obj.skuTokens+'</div><div class="sTotal" oVal='+obj.snsSkuTokens+'>'+obj.snsSkuTokens+'</div></td><td><a href="#" class="dCart"></a></td></tr>');
			var curTr = $("#cT tbody tr").last();
            if(epp.globalVar != undefined) {
                curTr.find('.sTkns').text(epp.cmn.getFixedFloat(obj.snsSkuTokens*epp.globalVar.publicSnsPreMultiplier));
            }
            if(typeof obj.skuQuantity != undefined && obj.skuQuantity != null) {
                curTr.find('.mTotal').text(epp.cmn.getFixedFloat(parseFloat(obj.skuTokens)*parseInt(obj.skuQuantity)));
                var snsCalTok = epp.cmn.calcSnsTotalTokens(obj.snsSkuTokens,obj.skuQuantity,obj.snsDuration);
				if(snsCalTok != "") {
					curTr.find('.sTotal').text(epp.cmn.getFixedFloat(snsCalTok));
					epp.cmn.calcCart(parseFloat(curTr.find('.mTotal').text())+parseFloat(curTr.find('.sTotal').text()));
				}
				else {
					epp.cmn.calcCart(parseFloat(curTr.find('.mTotal').text()));
				}
                curTr.attr('snsDur',obj.snsDuration);
            }
            else {
				var snsCalTok = epp.cmn.calcSnsTotalTokens(obj.snsSkuTokens,epp.globalVar.defaultQty,obj.snsDuration);
				curTr.find('.mTotal').text(epp.cmn.getFixedFloat(parseFloat(obj.skuTokens)*parseInt(epp.globalVar.defaultQty)));
				if(snsCalTok != "") {
					curTr.find('.sTotal').text(epp.cmn.getFixedFloat(snsCalTok));
					epp.cmn.calcCart(parseFloat(curTr.find('.mTotal').text())+parseFloat(curTr.find('.sTotal').text()));
				}
				else {
					epp.cmn.calcCart(parseFloat(curTr.find('.mTotal').text()));
				}
				curTr.attr('snsDur',obj.snsDuration);
            }
			if(!obj.isFutureAllowed) {
				curTr.find('.sTkns').html(epp.globalVar.nofutureindicator);
				curTr.find('.sTotal').html(epp.globalVar.futureincluded);
				curTr.find('.sQty input').val(epp.globalVar.nofutureindicator);
				curTr.find('.sItem').css('background','none');
				$(".sTotal", curTr).attr("oVal","");
			}
        }
        else {
            $("#cT tbody").append('<tr liRef='+obj.sku+'><td class="skuProd clearfix tooltiptext"><div class="mItem">'+obj.sku+'</div></td><td class="tkns clearfix"><div class="mTkns">'+epp.cmn.getFixedFloat(obj.skuTokens)+'</div></td><td class="tkns clearfix"><div class="mQty"><input type="text" class="tknVal" pattern="[0-9]*" value="' + tknQty + '" /></div></td><td class="tkns clearfix"><div class="mTotal" oVal='+obj.skuTokens+'>'+obj.skuTokens+'</div></td><td><a href="#" class="dCart"></a></td></tr>');
            if(typeof obj.skuQuantity != undefined && obj.skuQuantity != null) {
                var curTr = $("#cT tbody tr").last();
                curTr.find('.mTotal').text(epp.cmn.getFixedFloat(parseFloat(obj.skuTokens)*parseInt(obj.skuQuantity)));
                epp.cmn.calcCart(parseFloat(curTr.find('.mTotal').text()));
                curTr.attr('snsDur',obj.snsDuration);
            }
            else {
                epp.cmn.calcCart(parseFloat(obj.skuTokens)); //calculate cart tokens
            }
        }
        if($("#cT").is(':hidden')){ //Check if this is the first entry in cart
			$("#cT").show();
			$("#cInst").hide();
		}
		//Populate tooltip message
		if(obj.isFutureAllowed) {
			$('.tooltiptext', $("tr[liRef="+obj.sku+"]")).attr(epp.globalVar.title,"<div class=\"cartTooltip\"><h1>"+obj.sku+"</h1><div class=\"skudesc\">"+obj.skuDesc+"</div><h1 class=\"prDisc\">"+obj.snsSku+"</h1><div>"+obj.snsSkuDesc+"</div><div class=\"showSNS\"><span class=\"snsTime\">"+epp.globalVar.snsduration+"</span><span class=\"snsVal\">&nbsp;"+obj.snsDuration+" "+epp.globalVar.days+ "</span></div></div>");
		}
		else {
			$('.tooltiptext', $("tr[liRef="+obj.sku+"]")).attr(epp.globalVar.title,"<div class=\"cartTooltip\"><h1>"+obj.sku+"</h1><div class=\"skudesc\">"+obj.skuDesc+"</div><h1 class=\"prDisc\">"+obj.snsSku+"</h1><div>"+obj.snsSkuDesc+"</div></div>");
		}
        $("#cT tbody tr").last().attr('oldQty',tknQty);
        //Calculate total license and sns tokens
        if(obj.skuTokens != "" && obj.termLicense != undefined && !obj.termLicense.isTerm) {
            epp.cmn._totLicTok = epp.cmn._totLicTok + parseFloat(obj.skuTokens);
        }
        epp.cmn._totSnSTok = parseFloat($('#tokenVal').text()) - epp.cmn._totLicTok;
        //Populate tooltip message for above
        $('#tokenVal').data('title','<div><div>'+epp.globalVar.totalLicenseTokensMsg+epp.cmn.getFixedFloat(epp.cmn._totLicTok)+'</div><div>'
            +epp.globalVar.totalSnSTokensMsg+epp.cmn.getFixedFloat(epp.cmn._totSnSTok)+'</div></div>');
		myvmware.hoverContent.bindEvents($('.tooltiptext', $("tr[liRef="+obj.sku+"]")), 'funcleft', $('.tooltiptext div:eq(0)', $("tr[liRef="+obj.sku+"]")), 275);
        //If Empty Cart is disabled enable it
        if($('#eCart').hasClass('disabled')) {
            $('#eCart').removeClass('disabled');			
        }
        //Add obj to current row
        $("#cT tbody tr").last().data('jData',obj);
        
        //Code for Ominature tracking of addtocart
        if(typeof riaLinkmy != "undefined") riaLinkmy(epp.globalVar.pageName + ' : add to cart');
	},
    removeFromCart: function(curCart) {
        var pRow=curCart.closest('tr'); //Get the target row
		var mTkn=parseFloat(pRow.find('.mTotal').html()), sTkn=0, sku=pRow.attr('liRef'); 
        if(pRow.find('.sTotal').length > 0 && pRow.find('.sTotal').html() != "") {
            sTkn=parseFloat(pRow.find('.sTotal').html())
        }
		if($("li.inCart."+sku).length){ //Update corresponding entry in tree
            var liRef=$("li.inCart."+pRow.attr('liRef'));
            liRef.find('.addBtn').html('<button class="secondary addCart">'+epp.globalVar.addToCart+'</button>');
            liRef.removeClass("inCart");
        }
        epp.cmn.calcCart(-(mTkn+sTkn)); //Update counts of redeemed count
        var skuIdx = $.inArray(sku,epp.cmn._inCart)
        if (skuIdx >= 0) {
            epp.cmn._inCart.splice(skuIdx,1);
            epp.cmn._inCartQty.splice(skuIdx,1);
            epp.cmn._inCartSkuIdList.splice(skuIdx,1);
        }
        if (!$("#cT tbody tr").length){ //Get back default text if cart is empty
            $("#cT").hide();
            $("#cInst").show();
        }
        //Check the count of cart items and add disabled for empty cart if it is empty
        if(epp.cmn._inCart.length == 0) {
            $('#eCart').addClass('disabled');
            epp.cmn.toggleContinue(false);
        }
        //Calculate total license and sns tokens
        var remItemObj = pRow.data('jData');
        if(remItemObj.skuTokens != "" && remItemObj.termLicense != undefined && !remItemObj.termLicense.isTerm) {
            epp.cmn._totLicTok = Math.abs(epp.cmn._totLicTok - parseFloat(mTkn));
        }
        epp.cmn._totSnSTok = Math.abs(parseFloat($('#tokenVal').text()) - epp.cmn._totLicTok);
        //Populate tooltip message for above
        $('#tokenVal').data('title','<div><div>'+epp.globalVar.totalLicenseTokensMsg+epp.cmn.getFixedFloat(epp.cmn._totLicTok)+'</div><div>'+epp.globalVar.totalSnSTokensMsg+epp.cmn.getFixedFloat(epp.cmn._totSnSTok)+'</div></div>');
        pRow.remove(); //Remove selected row
    },
	calcCart: function(value){ //Calculate total redeemed tokens in cart and remaining in sub-fund
		var curCartObj=$('.tokenVal', $('.tokensInCart')), remainCartObj=$('.tokenVal', $('.tokensRemain'));
		var curCart= parseFloat(curCartObj.html()), remainCart=parseFloat(remainCartObj.html()), newCart=0;; //cart && remaining Cart
		if(value!=undefined){ //Add to Cart or Remove a cart single entry
			curCartObj.html(epp.cmn.getFixedFloat(curCart+value));
			remainCartObj.html(epp.cmn.getFixedFloat(remainCart-value));
            newCart = curCart+value;
		} else { //Calculate from Cart Table
			$.each($("#cT tbody tr"), function(c,oRow){
				if($(oRow).find('.sTotal').length > 0
                        && $(oRow).find('.sTotal').html().length > 0 
                        && $(oRow).find('.sTotal').html() != epp.globalVar.nofutureindicator) {
					newCart += parseFloat($(oRow).find('.mTotal').html()) + parseFloat($(oRow).find('.sTotal').html());
				}
				else {
					newCart += parseFloat($(oRow).find('.mTotal').html());
				}
			});
			curCartObj.html(epp.cmn.getFixedFloat(Math.abs(newCart)));
			remainCartObj.html(epp.cmn.getFixedFloat(remainCart-(newCart-curCart)));
		}
		epp.cmn.updateColor();
        epp.cmn.eligibilityWrapper(newCart);
	},
	updateColor: function(){ //This is to update color of remaining tokens and tokens cart
		var curCartObj=$('.tokenVal', $('.tokensInCart'));
		var curCart= parseFloat(curCartObj.html());  //remaining Cart
		var tnknAmt = $("#tokenVal").text();
		
        if (curCart > 0){ //sufficient funds
			curCartObj.removeClass('isFunds').addClass('sFunds');		
			epp.cmn.toggleContinue(true);
		} else {
			curCartObj.removeClass('sFunds isFunds');
            epp.cmn.toggleContinue(false);
		}
	},
    eligibilityWrapper: function(cartValue) {
        if(epp.globalVar.cType && epp.globalVar.fundOwnerInfo != undefined && 
                typeof epp.globalVar.fundOwnerInfo.isTopup == "boolean" &&
                epp.globalVar.fundOwnerInfo.isTopup) {
            epp.cmn.manipEligibility('tulGraph',cartValue, 'tulArrow');
            epp.cmn.manipEligibility('turGraph',cartValue, 'turArrow');
        } else {
            epp.cmn.manipEligibility('lGraph',cartValue, 'arrow');
        }
    },
    clearEligEntries: function() {
        $("#dEligTUExistFundTokensToPurchase").text(epp.globalVar.hyphen).removeClass('greenTxt');
        $("#dEligTUExistFundDiscountLevel").text(epp.globalVar.hyphen);
        $("#dEligTUExistFundDiscountLevel").unbind('click').css('cursor','');
        $("#dEligTUExistFundSkuToOrder").text(epp.globalVar.hyphen);
        //$("#dEligTUExistFundName").text(epp.globalVar.hyphen);
        $("#dEligTUExistFundExp").html('&nbsp;');
    },
    manipEligibility: function(graph,value, arrow){ //Manage discount eligibility 
        //TODO
        var $eSection=$("#eSection");//graph=$(".graph",$("#"+graph));
		
        var level, obj;
        //BUG-00049484 code fix 
       if(epp.globalVar.cType && epp.globalVar.fundOwnerInfo !=undefined && epp.globalVar.fundOwnerInfo.vppPoints != "" && value >= 2500) {
            //IF VPP Points are present then add them to calculate level
            obj = epp.cmn.getEPPBandLevel(value+epp.globalVar.fundOwnerInfo.vppPoints, epp.globalVar.fundOwnerInfo.isTopup);
        } else if(epp.globalVar.cType && epp.globalVar.fundOwnerInfo !=undefined) {
            obj = epp.cmn.getEPPBandLevel(value, epp.globalVar.fundOwnerInfo.isTopup);
        } else {
            obj = epp.cmn.getEPPBandLevel(value, false);
        }
		
		if (epp.globalVar.cType && epp.globalVar.fundOwnerInfo !=undefined && epp.globalVar.fundOwnerInfo.isTopup && graph == 'turGraph'){
			$("#dEligTUExistFundTokensToPurchase").text(Math.ceil(value));
                (Math.ceil(value) > 0) ? $("#dEligTUExistFundTokensToPurchase").addClass('greenTxt'):$("#dEligTUExistFundTokensToPurchase").removeClass('greenTxt');
			$("#dEligTUExistFundTokensToRedeem").text(Math.ceil(value));
           if(obj.totalValue-epp.globalVar.fundOwnerInfo.vppPoints >= 500 && !epp.cmn._minTopTokFlag) {
                //$("#dEligTUExistFundName").text(epp.globalVar.fundOwnerInfo.fundName);
                $("#dEligTUExistFundExp").text("(expires " + epp.globalVar.fundOwnerInfo.expirationDate + ")");
                $("#dEligTUExistFundSkuToOrder").text(epp.cmn.getEPPSkuToOrderTrueUp(epp.globalVar.fundOwnerInfo.eppLevel));
                 $("#dEligTUExistFundDiscountLevel").html("<a class=\"discountLevel\">"+epp.globalVar.fundOwnerInfo.eppLevel+"</a>").unbind('click').bind('click',function() {
					vmf.modal.show('discLevelModal');
						});
                $("#dEligTUExistFundVPPPoints").parent().removeClass('hidden');
                $("#dEligTUExistFundRedeemTime").removeClass('hidden');
                $("#dEligTUExistFundRedeemTimeDefault").addClass('hidden');
                vmf.rotate.show($("#" + arrow),epp.cmn.getCenterRotation(epp.globalVar.fundOwnerInfo.eppLevel),3000);
                epp.cmn.changeLevel(graph,epp.globalVar.fundOwnerInfo.eppLevel);
                epp.cmn._minTopTokFlag = true;
            } else if(obj.totalValue-epp.globalVar.fundOwnerInfo.vppPoints < 500 || value == 0) {
                epp.cmn._minTopTokFlag = false;
                //$("#dEligTUExistFundName").text(epp.globalVar.hyphen);
                $("#dEligTUExistFundExp").html('&nbsp;');
                $("#dEligTUExistFundSkuToOrder").text(epp.globalVar.hyphen);
                $("#dEligTUExistFundDiscountLevel").text(epp.globalVar.hyphen).unbind('click').css('cursor','');
                $("#dEligTUExistFundTokensToPurchase").text(epp.globalVar.hyphen).removeClass('greenTxt');
                $("#dEligTUExistFundVPPPoints").parent().addClass('hidden');
                $("#dEligTUExistFundRedeemTime").addClass('hidden');
                $("#dEligTUExistFundRedeemTimeDefault").removeClass('hidden');
                vmf.rotate.hide($('#'+arrow),-180);
                epp.cmn.changeLevel(graph,"");
            }
        }
		
        if(graph == 'tulGraph' || graph == 'lGraph') {
            if(obj.totalValue >= 2500 && value > 0) {
                //for no true up screen
                if(epp.globalVar.cType) {
                    $("#dEligTUNewFundExp").text(epp.globalVar.expires+" "+ epp.globalVar.fundOwnerInfo.threeYearExpiration+")");
                    $('#dEligTUNewFundVPPPoints').text(epp.globalVar.fundOwnerInfo.vppPoints);
                    if(epp.globalVar.fundOwnerInfo.vppPoints > 0) {
                        $("#vppPointsNoTrueUp").text(epp.globalVar.fundOwnerInfo.vppPoints);
                        $('#dEligTUNewFundVPPPoints').parent().removeClass('hidden');
                    } else {
                        $('#dEligTUNewFundVPPPoints').parent().addClass('hidden');
                    }
                }
                $("#dEligTUNewFundSkuToOrder").text(obj.initialObj.tokenSku);
                $("#dEligTUNewFundTokensToPurchase").text(Math.ceil(value));
                (Math.ceil(value) > 0) ? $("#dEligTUNewFundTokensToPurchase").addClass('greenTxt'):$("#dEligTUNewFundTokensToPurchase").removeClass('greenTxt');
				$("#dEligTUNewFundTokens").text(Math.ceil(value));
                $("#dEligTUNewFundDiscountLevel").html("<a class=\"discountLevel\">"+obj.initialObj.level+"</a>").unbind('click').bind('click',function() {
					vmf.modal.show('discLevelModal');
						});
                //$("#dEligTUNewFund").text(epp.globalVar.newFund);
                $("#dEligTUNewFundRedeemTime").removeClass('hidden');
                $("#dEligTUNewFundRedeemTimeDefault").addClass('hidden');
                $("#qtyNoTrueUp").text(Math.ceil(value));
                (Math.ceil(value) > 0)? $("#qtyNoTrueUp").addClass('greenTxt'):$("#qtyNoTrueUp").removeClass('greenTxt');
                if(!epp.globalVar.cType || epp.globalVar.fundOwnerInfo.vppPoints == 0) {
                    $("#vppPointsNoTrueUpWrap").addClass('hidden');
					$(".eligibility-details-first").removeClass("vpp");
                } else {
                    $("#vppPointsNoTrueUpWrap").removeClass('hidden');
					$(".eligibility-details-first").addClass("vpp");
                }
				
                $("#discountlevelNoTrueUp").html("<a class=\"discountLevel\">"+obj.initialObj.level+"</a>").unbind('click').bind('click',function() {
					vmf.modal.show('discLevelModal');
						});
                $("#skuOrderNoTrueUp").text(obj.initialObj.tokenSku);
                
                for(var i in epp.globalVar.cartValueKeys) {
                    if (obj.totalValue >= epp.globalVar.cartValueKeys[i]) {
                        vmf.rotate.show($("#" + arrow),epp.globalVar.cartValueDegreeMap[epp.globalVar.cartValueKeys[i]],3000);
                        epp.cmn.changeLevel(graph,obj.initialObj.level);
                        break;
                    }
                }
                            
            } else{ 
            //Show - if cart has <2500 tokens
                //$("#dEligTUNewFund").text(epp.globalVar.hyphen);
                $("#dEligTUNewFundExp").html('&nbsp;');
                $("#dEligTUNewFundSkuToOrder").text(epp.globalVar.hyphen);
                $("#dEligTUNewFundTokensToPurchase").text(epp.globalVar.hyphen).removeClass('greenTxt');
                $("#dEligTUNewFundDiscountLevel").text(epp.globalVar.hyphen);
                $("#dEligTUNewFundDiscountLevel").unbind('click').css('cursor','');
                $("#dEligTUNewFundVPPPoints").parent().addClass('hidden');
                $('#dEligTUNewFundVPPPoints').text(epp.globalVar.hyphen);
                $("#dEligTUNewFundRedeemTime").addClass('hidden');
                $('#dEligTUNewFundRedeemTimeDefault').removeClass('hidden');
                $("#vppPointsNoTrueUpWrap").addClass('hidden');
                $("#vppPointsNoTrueUp").text(epp.globalVar.hyphen);
                $("#qtyNoTrueUp").text(epp.globalVar.hyphen).removeClass('greenTxt');
                $("#discountlevelNoTrueUp").text(epp.globalVar.hyphen);
                $("#discountlevelNoTrueUp").unbind('click').css('cursor','');
                $("#skuOrderNoTrueUp").text(epp.globalVar.hyphen);
                vmf.rotate.hide($('#'+arrow),-180);
                epp.cmn.changeLevel(graph,"");
            }
        }
        
    },
    getEPPBandLevel : function (totalValue, trueUpFlag){
		var obj ={};
        if(trueUpFlag){
        	obj.topUpObj = epp.cmn.getEPPBandLevelTrueUp(totalValue);
        }
        obj.initialObj = epp.cmn.getEPPBandLevelInitial(totalValue);
        obj.totalValue =  Math.ceil(totalValue);
		return obj
	},
	
    getEPPBandLevelTrueUp : function (tokensInCart){
        var minPoints,maxPoints;
		var obj = {};
        tokensInCart = Math.ceil(tokensInCart);
		for(var node in epp.globalVar.bandedSkuList) {
            if(epp.globalVar.bandedSkuList[node].minPoints =="" && epp.globalVar.bandedSkuList[node].skuType==epp.globalVar.topup){
                minPoints="";
            }else if(epp.globalVar.bandedSkuList[node].skuType==epp.globalVar.topup){
                minPoints = parseFloat(epp.globalVar.bandedSkuList[node].minPoints)
            }
            if(epp.globalVar.bandedSkuList[node].maxPoints =="" && epp.globalVar.bandedSkuList[node].skuType==epp.globalVar.topup){
                maxPoints="";
            }else if(epp.globalVar.bandedSkuList[node].skuType==epp.globalVar.topup){
                maxPoints = parseFloat(epp.globalVar.bandedSkuList[node].maxPoints)
            }
			
			obj.level = epp.globalVar.bandedSkuList[node].bandLevel;
			obj.tokenSku = epp.globalVar.bandedSkuList[node].bandedTokenSku;	
			if(tokensInCart >= minPoints &&	tokensInCart <= maxPoints && epp.globalVar.bandedSkuList[node].skuType==epp.globalVar.topup){
				return(obj);
			}else if (minPoints =="" &&	tokensInCart <= maxPoints && epp.globalVar.bandedSkuList[node].skuType==epp.globalVar.topup){
				return(obj);
			}else if(maxPoints =="" &&	tokensInCart >= minPoints && epp.globalVar.bandedSkuList[node].skuType==epp.globalVar.topup){
				return(obj);
			}
		}
        return obj;
	},
    
    getEPPSkuToOrderTrueUp : function (level){
        var minPoints,maxPoints;
		var obj = {};
        if(level == "" || level == undefined) {
            //This should not happend, this is bad
            return "";
        }
		for(var node in epp.globalVar.bandedSkuList) {
            if(epp.globalVar.bandedSkuList[node].bandLevel ==level && epp.globalVar.bandedSkuList[node].skuType==epp.globalVar.topup){
                return epp.globalVar.bandedSkuList[node].bandedTokenSku;
            }
		}
        //This should not happend, this is bad
        return "";
	},
	
    getEPPBandLevelInitial : function (tokensInCart){
        var minPoints,maxPoints;
		var obj = {};
        tokensInCart = Math.ceil(tokensInCart);
		for(var node in epp.globalVar.bandedSkuList) {
            if(epp.globalVar.bandedSkuList[node].minPoints =="" && epp.globalVar.bandedSkuList[node].skuType==epp.globalVar.initial){
                minPoints="";
            }else if(epp.globalVar.bandedSkuList[node].skuType==epp.globalVar.initial){
                minPoints = parseFloat(epp.globalVar.bandedSkuList[node].minPoints);
            }
            if(epp.globalVar.bandedSkuList[node].maxPoints =="" && epp.globalVar.bandedSkuList[node].skuType==epp.globalVar.initial){
                maxPoints="";
            }else if(epp.globalVar.bandedSkuList[node].skuType==epp.globalVar.initial){
                maxPoints = parseFloat(epp.globalVar.bandedSkuList[node].maxPoints);
            }
			obj.level = epp.globalVar.bandedSkuList[node].bandLevel;
			obj.tokenSku = epp.globalVar.bandedSkuList[node].bandedTokenSku;		
			if(tokensInCart >= minPoints &&	tokensInCart <= maxPoints && epp.globalVar.bandedSkuList[node].skuType==epp.globalVar.initial){
				return(obj);
			}else if (minPoints =="" &&	tokensInCart <= maxPoints && epp.globalVar.bandedSkuList[node].skuType==epp.globalVar.initial){
				return(obj);
			}else if(maxPoints =="" &&	tokensInCart >= minPoints && epp.globalVar.bandedSkuList[node].skuType==epp.globalVar.initial){
				return(obj);
			}
		}
        return obj;
	},
	
    changeLevel: function(graph,level) {
        if(graph == undefined || graph == "") {
            return false;
        }
        if(level == undefined || level == "") {
            $(".graph",$("#" +graph)).removeClass("L0 L7 L8 L9 L10").addClass('L0');
        } else {
            $(".graph",$("#" +graph)).removeClass("L0 L7 L8 L9 L10").addClass(level);
        }
    },
    getCenterRotation: function(level) {
        if(level != "" && epp.globalVar.levelRotationMap[level] != undefined) {
            return epp.globalVar.levelRotationMap[level];
        } else {
            return "L0";
        }
    },
	toggleContinue: function(flag){ //Enable or Diasable Continue button
		if (flag)
			$("#email").removeClass('disabled').unbind('click').bind('click',epp.cmn.showEmailWindow);
		else 
			$("#email").addClass('disabled').unbind('click');
	},
	showEmailWindow: function(flag){ //Enable or Diasable Continue button
		vmf.modal.show('modal_EmailPublic');
		//$("#btn_Email_cart").bind('click',epp.cmn.submitEmail);
		$("#btn_Email_cancel").bind('click',function(){vmf.modal.hide('modal_EmailPublic');});
	},
	submitEmail : function(email){
		var emailValid = true;
		var intRegex = /^[a-zA-Z0-9._\-!#$%^&+=' \/()]+@([a-zA-Z0-9._\-!#$%^&+=' \/()]+\.)+[a-zA-Z0-9._\-]+$/;
		if(email.length) {
			if(!intRegex.test(email)) {
				$('#configEmailerrorMessage').html("Please give a valid format");
				emailValid = false;
			} else {
				$('#configEmailerrorMessage').html('');
			}
		} else {
			$('#configEmailerrorMessage').html('Required');
			emailValid = false;
		}
		if(emailValid){
			//common	
			$('#sendEmailForm input[name="recepientEmail"]').val(email); 
			$('#sendEmailForm input[name="csTokenQty"]').val(epp.cmn._inCartQty.toString());
			$('#sendEmailForm input[name="tokToPurchase"]').val($("#dEligTUNewFundTokensToPurchase").text());
			$('#sendEmailForm input[name="initDiscLevel"]').val($("#discountlevelNoTrueUp").text());
			$('#sendEmailForm input[name="initImgDiscLevel"]').val($("#dEligTUNewFundDiscountLevel").text());//
			$('#sendEmailForm input[name="totCart"]').val($("#tokenVal").text()); //>2500 and 
			$('#sendEmailForm input[name="csSkuList"]').val(epp.cmn._inCartSkuIdList.toString());    		
			$('#sendEmailForm input[name="initSkuToOrder"]').val($('#skuOrderNoTrueUp').text());
			$('#sendEmailForm input[name="efTokPurchased"]').val($("#qtyNoTrueUp").text());//
		
			//partner
			if(epp.globalVar.cType ){
				//$('#sendEmailForm input[name="dateString"]').val(epp.cmn.dateString);
				$('#sendEmailForm input[name="initDiscLevel"]').val($("#dEligTUNewFundDiscountLevel").text());
				$('#sendEmailForm input[name="vppNumber"]').val(epp.globalVar.fundOwnerInfo.vppNumber);
				$('#sendEmailForm input[name="fundOwnerEmail"]').val(epp.globalVar.fundOwnerInfo.email);
				$('#sendEmailForm input[name="nfExpDate"]').val(epp.globalVar.fundOwnerInfo.threeYearExpiration); //
				$('#sendEmailForm input[name="nfTimeString"]').val($('#dEligTUNewFundRedeemTime').text()); 
				$('#sendEmailForm input[name="nfTokPurchased"]').val($("#dEligTUNewFundTokensToPurchase").text());//
				// BUG-00064351 code fix
				if ($('#dEligTUNewFundVPPPoints').text() == "-"){
				$('#sendEmailForm input[name="initVPPPoints"]').val('null'); //
				}
				else {
					$('#sendEmailForm input[name="initVPPPoints"]').val($('#dEligTUNewFundVPPPoints').text());
				}
				// end of code fix
				$('#sendEmailForm input[name="efName"]').val(epp.globalVar.fundOwnerInfo.fundName);//
				$('#sendEmailForm input[name="efExpDate"]').val(epp.globalVar.fundOwnerInfo.expirationDate);//
				$('#sendEmailForm input[name="efTimeString"]').val($('#dEligTUExistFundRedeemTime').text()); 
				$('#sendEmailForm input[name="efTokPurchased"]').val($("#dEligTUExistFundTokensToPurchase").text());//
				
				//topup... epp.globalVar.fundOwnerInfo.isTopup
				//add time string...
				$('#sendEmailForm input[name="tuSkuToOrder"]').val($("#dEligTUExistFundSkuToOrder").text()); 
				$('#sendEmailForm input[name="tuDiscLevel"]').val($("#dEligTUExistFundDiscountLevel").text()); 
				$('#sendEmailForm input[name="tuImgDiscLevel"]').val(epp.cmn.tuImgDiscLevel);	
	            $('#sendEmailForm input[name="isTopUp"]').val(epp.globalVar.fundOwnerInfo.isTopup);
				//initVPPPoints
				//	tokenVal
			}
			vmf.ajax.post(epp.globalVar.emailUrl, $('#sendEmailForm').serialize(), epp.cmn.afterEmail);
			vmf.modal.hide('modal_EmailPublic');
			if(typeof riaLinkmy != "undefined") riaLinkmy(epp.globalVar.pageName + ' : send email');
		}
	},
	afterEmail : function(){
	//alert('email sent');
	},
    handleLookupFund: function(data) {
        if(data.FundOwnerInfo != null ) {
			epp.globalVar.fundOwnerInfo = data.FundOwnerInfo;
			if(epp.globalVar.fundOwnerInfo != undefined && typeof epp.globalVar.fundOwnerInfo.isTopup == "boolean" &&
					epp.globalVar.fundOwnerInfo.isTopup) {
				$('#dEligNoTU').addClass('hidden');
				$('#dEligTU').removeClass('hidden');
				//$("#dEligTUExistFundName").text(epp.globalVar.fundOwnerInfo.fundName);
                //$("#dEligTUExistFundExp").text("(expires " + epp.globalVar.fundOwnerInfo.expirationDate + ")");
                if(epp.globalVar.fundOwnerInfo.fundName == epp.globalVar.na) {
                    $("#dEligTUExistFundNamePrefix").addClass('hidden');
                } else {
                    $("#dEligTUExistFundNamePrefix").removeClass('hidden');
                }
                $("#dEligTUExistFundName").text(epp.globalVar.fundOwnerInfo.fundName);
                $("#dEligTUNewFund").text(epp.globalVar.newFund);
			} else {
				$('#dEligTU').addClass('hidden');
				$('#dEligNoTU').removeClass('hidden');
			}
            if(epp.globalVar.fundOwnerInfo.vppNumber == "") {
                $('#vpp').text(epp.globalVar.na);
            } else {
                $('#vpp').text(epp.globalVar.fundOwnerInfo.vppNumber);
            }
            if(epp.globalVar.fundOwnerInfo.email == "") {
                $('#fundOwnerEmail').text(epp.globalVar.na);
            } else {
                $('#fundOwnerEmail').text(epp.globalVar.fundOwnerInfo.email);
            }
			$("#progType").text($(".proType").val());
			$('#dEligTUExistFundTimeString').text(epp.globalVar.fundOwnerInfo.expirationString);
            //Update Eligibility if there are items already in cart
            var cartVal = parseFloat($('.tokenVal', $('.tokensInCart')).text());
            if(typeof cartVal == epp.globalVar.number && cartVal > 0) {
                epp.cmn.eligibilityWrapper(cartVal);
            }
			vmf.modal.hide('handleLookupFund');
            vmf.loading.hide();
        } else if(data != undefined && data.ERROR_MESSAGE != undefined) {
            vmf.loading.hide();
            epp.cmn.handleLookupError(data);
        } else {
            vmf.loading.hide();
            epp.cmn.handleLookupError();
        }
    },
    handleLookupError: function(errMsg) {
        if(errMsg == undefined) {
            $('#invalidPartnerMsg').removeClass('hidden');
            $('#lPartnerInfo').addClass('hidden');
            $('#invalidPartnerVPPMsg').addClass('hidden');
            $('#invalidPartnerEmailMsg').addClass('hidden');
            $('#customMsg').remove();
        } else if(errMsg.ERROR_MESSAGE != undefined) {
            $('#invalidPartnerMsg').addClass('hidden');
            $('#lPartnerInfo').addClass('hidden');
            $('#invalidPartnerVPPMsg').addClass('hidden');
            $('#invalidPartnerEmailMsg').addClass('hidden');
            $('#customMsg').remove();
            $('#invalidPartnerMsg').parent()
                .append('<div class="redText" id="customMsg">' + errMsg.ERROR_MESSAGE + '</div>');
            vmf.modal.show('confg_modalPartner');
        }
    },
    onShowPublicModal: function() {
    	$('#pubProgTypeSelect').keypress(function(e){
		    var enterKey = 13;
		    if(e.which == enterKey) $('#btn_continue_public').trigger('click');
		});
        $('#btn_continue_public').unbind('click').click(function(){
            var selPubProgType = $("#pubProgTypeSelect").val();
            if(selPubProgType == epp.globalVar.eppLabel) {
                $("#progType").text(selPubProgType);
                vmf.modal.hide();
            } else if(selPubProgType == epp.globalVar.commerciallicensetype) {
                if(epp.globalVar.vppPublicConfigUrl != undefined) {
                    var vppRedirectUrl = epp.globalVar.vppPublicConfigUrl + '&licenseClass=' + epp.globalVar.commerciallicensetype;
                    window.location = vppRedirectUrl;
                }
            } else {
                if(epp.globalVar.vppPublicConfigUrl != undefined) {
                    var tppRedirectUrl = epp.globalVar.vppPublicConfigUrl + '&licenseClass=' + epp.globalVar.federallicensetype;
                    window.location = tppRedirectUrl;
                }
            }
        });
    },
    handleLoadingError: function() {
        vmf.loading.hide();
        vmf.modal.show('confg_modalPartner');
    },
    onShowPartnerModal: function() {
        //***Hardcoded value remove while checkin
        if($('#vpp').text() == epp.globalVar.na) {
            $('#vppMembNum').val('');
        } else {
            $('#vppMembNum').val($('#vpp').text());
        }
        if($('#fundOwnerEmail').text() == epp.globalVar.na) {
            $('#fnOwnerEmail').val('');
        } else {
            $('#fnOwnerEmail').val($('#fundOwnerEmail').text());
        }
        $('#lPartnerInfo').addClass('hidden');
		$('#btn_continue').unbind('click').click(function(){
				
            var fnEmail = $.trim($('#fnOwnerEmail').val()), vppNumber = $.trim($('#vppMembNum').val()), proType = $('.proType').val();
            var emailRegex = new RegExp(epp.globalVar.emailValidationRegex), 
                    vppNumberRegex = new RegExp(epp.globalVar.vppNumberValidationRegex);
            var selectedVal = $.trim($('#progTypeDropDown option:selected').val());
            var vppMemNum = $.trim($('#vppMembNumForVPP').val());
            //validate input
			if(selectedVal == 'TPP') {
              $('#configuratorFrm').attr('action',epp.globalVar.tppUrl);
              //Pending changes in VPP Portal
			  $('#configuratorFrm').submit();
			} else if(selectedVal == 'VPP') {
                if(vppNumberRegex.test(vppMemNum) || vppMemNum == ''){
					var vppSObj = epp.globalVar.vppUrl+'&vppNumber='+ vppMemNum;
					$('#configuratorFrm').attr('action',vppSObj);
                    //Pending changes in VPP Portal
					$('#configuratorFrm').submit();
				}
				else {
					$('#invalidPartnerVPPMsg').removeClass('hidden');
                    epp.cmn.handleLoadingError();
				}
            } else {
            
				if(epp.globalVar.emailValidationRegex != undefined &&
						(fnEmail == '' || emailRegex.test(fnEmail)) &&
						epp.globalVar.vppNumberValidationRegex != undefined &&
						(vppNumber == '' || vppNumberRegex.test(vppNumber))) {
					var sObj = '&fundOwnerEmail='+ fnEmail +
						'&vppNumber='+vppNumber;
					$('#lPartnerInfo').removeClass('hidden');
					vmf.ajax.post(epp.globalVar.fundOwnerLookupURL,sObj,epp.cmn.handleLookupFund,epp.cmn.handleLookupError); 
                    
				} else {
					if(!vppNumberRegex.test(vppNumber) && (emailRegex.test(fnEmail) || fnEmail == '')){
						$('#invalidPartnerVPPMsg').removeClass('hidden');
						$('#invalidPartnerEmailMsg').addClass('hidden');
						$('#invalidPartnerMsg').addClass('hidden');
                        epp.cmn.handleLoadingError();
					}else if(!emailRegex.test(fnEmail) && (vppNumberRegex.test(vppNumber) || vppNumber == '')){
						$('#invalidPartnerEmailMsg').removeClass('hidden');
						$('#invalidPartnerMsg').addClass('hidden');
						$('#invalidPartnerVPPMsg').addClass('hidden');$('#invalidPartnerEmailMsg').removeClass('hidden');
						$('#invalidPartnerMsg').addClass('hidden');
						$('#invalidPartnerVPPMsg').addClass('hidden');
                        epp.cmn.handleLoadingError();
					}else{
						$('#invalidPartnerEmailMsg').removeClass('hidden');
						$('#invalidPartnerMsg').addClass('hidden');
						$('#invalidPartnerVPPMsg').removeClass('hidden');
                        epp.cmn.handleLoadingError();
					}
				}
			}
        });
        if(epp.globalVar.preSelect != undefined && epp.globalVar.preSelect == epp.globalVar.eppLabel) {
            if(epp.globalVar.vppNumber != undefined && 
                    epp.globalVar.fundOwnerEmail != undefined) {
                if(epp.globalVar.vppNumber == "null") {
                    epp.globalVar.vppNumber = "";
                }
                if(epp.globalVar.fundOwnerEmail == "null") {
                    epp.globalVar.fundOwnerEmail = "";
                }
                $('#vppMembNum').val(epp.globalVar.vppNumber);
                $('#fnOwnerEmail').val(epp.globalVar.fundOwnerEmail);
                epp.globalVar.preSelect = 'PreSelected';
                if(epp.globalVar.autoSubmit) {
                    $('#btn_continue').trigger('click');
                }
            }
        }
        return true;
    }
}
