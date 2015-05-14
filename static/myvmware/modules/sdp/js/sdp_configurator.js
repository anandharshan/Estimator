if (typeof(myvmware) == "undefined")  myvmware = {};
VMFModuleLoader.loadModule("loading", function(){});
//vmf.scEvent = false;
myvmware.config = {
	"main" : {
		map: {
			"serviceOpts":[rs.newServiceOpts,rs.addOnServiceOpts,rs.renewalServiceOpts, rs.upgradeServiceOpts]			
		},
		init : function(){
			cfm = myvmware.config.main;
			cfm.configureLandingPage();
			cfm.bindEvents();
			if(partnerType.toUpperCase()=="RESELLER")
				callBack.addsc({'f':'riaLinkmy','args':['configreseller:home']});
			else if (partnerType.toUpperCase()=="DISTI")
				callBack.addsc({'f':'riaLinkmy','args':['configdisti:home']});
		},
		configureLandingPage: function(){
			$.each(cfm.map.serviceOpts, function (i,resp) {
				if(resp!=null){							
					var optionText = '<option value="">'+rs.selectProduct+'</option>';						
					for(key in resp){optionText += '<option value="'+resp[key]+'">'+key+'</option>';}
					$('.btnHolder').eq(i).html('<select id="'+rs.serviceSelectIds[i]+'" class="selectOpt">'+optionText+'</select>');
				}		
			});
			vmf.dropdown.build($("select#renewalService"), {
				optionsDisplayNum: 10,
				ellipsisSelectText: false,
				ellipsisText: '',
				optionMaxLength: 70,
				inputMaxLength: 40,
				position: "left",
				onSelect: cfm.configChangeDropDown,
				optionsId: "renewalOption",
				//inputWrapperClass: "eaInputWrapper",
				//spanpadding: true,
				//spanClass: "corner-img-left",
				optionsClass: "dropdownOpts",
				shadowClass: "eaBoxShadow"
			});
			vmf.dropdown.build($("select#addOnService"), {
				optionsDisplayNum: 10,
				ellipsisSelectText: false,
				ellipsisText: '',
				optionMaxLength: 70,
				inputMaxLength: 40,
				position: "left",
				onSelect: cfm.configChangeDropDown,
				optionsId: "addOnOption",
				optionsClass: "dropdownOpts",
				shadowClass: "eaBoxShadow"
			});
			vmf.dropdown.build($("select#newService"), {
				optionsDisplayNum: 10,
				ellipsisSelectText: false,
				ellipsisText: '',
				optionMaxLength: 70,
				inputMaxLength: 40,
				position: "left",
				onSelect: cfm.configChangeDropDown,
				optionsId: "newServiceOption",
				optionsClass: "dropdownOpts",
				shadowClass: "eaBoxShadow"
			});
			vmf.dropdown.build($("select#upgradeService"), {
				optionsDisplayNum: 10,
				ellipsisSelectText: false,
				ellipsisText: '',
				optionMaxLength: 70,
				inputMaxLength: 40,
				position: "left",
				onSelect: cfm.configChangeDropDown,
				optionsId: "upgradeServiceOption",
				//inputWrapperClass: "eaInputWrapper",
				//spanpadding: true,
				//spanClass: "corner-img-left",
				optionsClass: "dropdownOpts",
				shadowClass: "eaBoxShadow"
			});
		},
		configChangeDropDown: function(){
			$('.selectOpt').trigger('change');
		},
		bindEvents : function(){
			$('.selectOpt').change(function(event) {
				var $this = $(this),
				targetUrl = $this.parent().attr('tUrl'),
				prodFamily = $this.val();
				if(prodFamily!='')
					location.href= targetUrl +"&productFamilyCode="+escape(prodFamily);
			});
			$(".box").bind("mouseover mouseout",function(e){
				if(e.type == "mouseover"){
					if ($(this).hasClass("active")) return;
					$(this).closest(".box").addClass("active");
				} else {
					$(this).closest(".box").removeClass("active");
				}
			});
		}
	},
	"cmn" :{
		events: function(){
			$("#toStep1").bind("click",function(){
				$("#step2").hide();
				$("#step1").show();
				$("#progress").removeClass("s0 s2 s3");
			});
			
			$(".config_cancel").live("click",function(){
					if (rs.sourcePage == "" && rs.sourcePage.length == 0){location.href=rs.cancelAction;}
					else{location.href=rs.backURL;}
			});
			
			$("#resetTable").live("click",function(e){
				if($(this).hasClass('disabled')) { 
					return false;
				} else {
					$("#addonSection").find("tr").removeClass("active").find("input:checkbox").removeAttr("checked").end().find("input:text").val("0").removeClass('errorOutline').end().find("select").val("").removeClass('errorOutline').siblings("span.errorLabel").removeClass("err").addClass("hidden").end().end().find("span.errorLabel").removeClass("err").addClass("hidden").end().end().find(".tierHolder span.tierParent").addClass("hidden");
					$("#rateCardInfo span.error").hide();
					if(!rs.newService || (rs.horizon == true && rs.newService == true)) $("#s2Apply").addClass("disabled").attr("disabled","disabled");
					$(this).addClass('disabled').attr('disabled', 'disabled');
					e.preventDefault();
				}
				if(typeof riaLinkmy!="undefined"){
					var typeOfService;
					typeOfService = (rs.confType=="newService") ? "newaddcapacity" :((rs.confType=="addonService")?"addonaddiotional":"renewalmodify");
					if(partnerType.toUpperCase()=="RESELLER")
						riaLinkmy('configreseller:'+typeOfService+':reset');
					else if (partnerType.toUpperCase()=="DISTI")
						riaLinkmy('configdisti:'+typeOfService+':reset');
				}
			});
					
			/*$("#addOnTable tr input:checkbox").live("click", function() {
				var $row = $(this).closest("tr");
				if ($(this).is(":checked")) {
					$row.addClass("active");
					$("button#s2Apply").removeClass("disabled").removeAttr("disabled")
				} else {
					$row.removeClass("active")
						.find("span.errorLabel").hide().end()
						.find(".errorOutline").removeClass('errorOutline');
					if ($("#addOnTable tr input:checkbox:checked").length === 0 && rs.isAddonMandatory) {
						$("button#s2Apply").addClass("disabled").attr("disabled", "disabled");
					}
				}
			});*/
			
			$("#editRateCard").live("click",function(e){
				e.preventDefault();
				var curRateCard = $(this).attr("val");
				vmf.ajax.post(rs.fetchPriceList,null,function(data){
					if(typeof data!="object") data= vmf.json.txtToObj(data);
					if(data!=null){
						if (typeof data.ERROR_CODE!="undefined"){
							myvmware.config.cmn.showPreviewError(data);
							return;
						}
						var pList = vmf.getObjByIdx(data,0);
						//var pList=data.wrapper;
						if (myvmware.sdp.cmn.getObjectSize(pList)!=0){
							myvmware.config.cmn.displayPriceListData(pList, "priceListDetails",2 , curList);
							var selValue = $("#priceList").attr("val");
							if($("#priceListDetails input:radio[value="+curRateCard+"]").length>0)
								$("#priceListDetails input:radio[value="+curRateCard+"]").attr("checked",true);
							else if($("#priceListDetails select option[value="+curRateCard+"]").length>0){
								$("#priceListDetails select option[value="+curRateCard+"]").attr("selected",true);
								$("#priceListDetails input:radio[value='custom']").attr("checked",true);
							}
						} else {
							$("#priceListDetails").html(rs.noPriceListMsg);
						}
						vmf.modal.show("editPricelist",{});
						$("#editPricelist").closest(".simplemodal-container").height($("#editPricelist").height())
						$.modal.setPosition();
						if(typeof riaLinkmy!="undefined"){
							var typeOfService;
							typeOfService = (rs.confType=="newService") ? "newaddcapacity" :((rs.confType=="addonService")?"addonaddiotional":"renewalmodify");
							if(partnerType.toUpperCase()=="RESELLER")
								riaLinkmy('configreseller:'+typeOfService+':pricelistedit');
							else if (partnerType.toUpperCase()=="DISTI")
								riaLinkmy('configdisti:'+typeOfService+':pricelistedit');
						}
					} else {
						//$("#priceListDetails").html(rs.errorMsg);
						location.reload();
					}
				},function(){myvmware.sdp.cmn.showErrorModal(rs.genericError)},function(){vmf.loading.hide()},300000,function(){vmf.loading.show()});
			});
			
			$('#addOnTable input:text, #upgradeServicesTables input:text').live('keypress', function(e){
				var event = e.which;
				if((event >= 48 && event <= 57) || event == 8 || event == 0) {
					return true;
				} else {
					return false;
				}
			}).live('blur', function(){
				if($.trim($(this).val())=="") $(this).val("0");
				
				if(rs.horizon) {
					myvmware.config.cmn.enableDisable();
				}
				//myvmware.config.cmn.resetValues();
			}).live('keyup', function(){
				$('span.coreConfigResponse').fadeOut();
				myvmware.config.cmn.resetValues();
			});
			
			$("select.payType, select.levelType", $('#addOnTable')).live("change",function(){
				myvmware.config.cmn.supportPayment($(this));
			});
		},
		enableDisable: function(){
			var refEle = ($('#addOnTable').length) ? $('#addOnTable') :  ($('#upgradeServicesTables').length) ? $('#upgradeServicesTables') : null;

			if(refEle != null){
				var flag = false;
				var inputQty = $('input.qty', refEle).length ? $('input.qty', refEle) : $('input.upgradeToQty', refEle);

				inputQty.each(function(){
					if(parseInt($(this).val(), 10) > 0) {
						flag = true;
						/*if($(this).hasClass('errorOutline'))
							$(this).removeClass('errorOutline').closest('td').find('span.errorLabel').addClass('hidden');*/
					}
				});
				$("select.payType", refEle).each(function(){
					if($.trim($(this).val()) != "") {
						flag = true;
					}
				});
				$("select.levelType", refEle).each(function(){
					if($.trim($(this).val()) != "") {
						flag = true;
					}
				});
				if(flag) {
					$("button#s2Apply").removeClass("disabled").removeAttr("disabled");
				} else {
					$("button#s2Apply").addClass("disabled").attr("disabled", "disabled");
				}
			}
		},
		supportPayment: function(elem){
			var $this = $(elem),
				$thisKey = $this.attr("data-index"),
				tiers = $this.closest("tr").next("tr").find(".tierHolder span.tierParent").addClass("hidden"),
				val = $this.val();
			if(rs.horizon && val != ""){
				var values = ($this.find("option:selected").attr("data-support") != undefined) ? $this.find("option:selected").attr("data-support").split(",") : "undefined",
					dropDown = (($this.hasClass("payType")) ? $this.closest("tr").find("select.levelType") : $this.closest("tr").find("select.payType")), 
					previousSeletedVal =  dropDown.val();

				dropDown.find("option").each(function(){
					if($(this).val() != "") {
						$(this).remove();
					}
				});
				if($this.hasClass("levelType")) {
					var map = myvmware.config.cmn.horizonMap[$thisKey][0][5],
						options = map[val];
					$.each(options, function(a, b){
						dropDown.append("<option val='"+b+"'>"+b+"</option>");
					});
					
					if(dropDown.find("option").length == 2 ) {
						var valu = dropDown.find("option:last-child").attr("value");
						dropDown.val(valu);
					} else {
						dropDown.val(previousSeletedVal);
					}
				} else {
					var map = myvmware.config.cmn.horizonMap[$thisKey][0][6],
						options = map[val];
					$.each(options, function(a, b){
						dropDown.append("<option val='"+b+"'>"+b+"</option>");
					});
					if(dropDown.find("option").length == 2 ) {
						var valu = dropDown.find("option:last-child").attr("value");
						dropDown.val(valu);
					} else {
						dropDown.val(previousSeletedVal);
					}
				}
				myvmware.config.cmn.enableDisable();
			}
			var payVal = $this.closest("tr").find("select.payType").val(),
				levelVal = ((rs.horizon) ? "_"+$this.closest("tr").find("select.levelType").val() : ""),
				tierClass = payVal+levelVal;
			$('span.coreConfigResponse').fadeOut();
			tiers.filter("."+tierClass).removeClass("hidden");
			myvmware.config.cmn.resetValues();
		},
		resetValues:function(){
			var value = 0;
			$('input.qty', $('#addOnTable')).each(function(i,v){
				if(parseInt($(v).val(),10) != 0) value = 1
			});
			$('select.payType', $('#addOnTable')).each(function(j,k){
				if($(k).val() != '') value = 1
			});
			if(rs.horizon){
				$('select.levelType', $('#addOnTable')).each(function(l,m){
					if($(m).val() != '') value = 1
				});
			}
			(value == 0) ? $('a#resetTable').addClass('disabled').attr("disabled",true) : $('a#resetTable').removeClass('disabled').removeAttr("disabled");
		},
		displayPriceListData: function(pList,resHolder,flag,curList){
			var pArr=[],optArr=[], count = 0;
			$.each(pList.others, function(j,z){
				var	currencys = (z[2] != undefined) ? z[2].join(" ") : "";
				pArr.push("<div><input type='radio' data-currency='"+currencys+"' value='"+z[0]+"' name='priceList"+flag+"' class='priceListRadio' data-index='"+j+"' data-type='others'/> <span>"+z[1]+"</span></div>");
				count++;
			});
			if (pList.unique.length){
				optArr.push("<div><input type='radio' name='priceList"+flag+"' value='custom' class='priceListRadio' data-type='' /> "+rs.customprice+" <select class=\"dPrice\">");
				$.each(pList.unique, function(k,l){
					var	currencys = l[2].join(" ");
					optArr.push("<option class='priceListRadio' data-currency='"+currencys+"' value='"+l[0]+"' data-index='"+k+"'>"+l[1]+"</option>");
				});
				optArr.push("</select></div>");
			}
			pArr.push(optArr.join(''));
			$("#"+resHolder).html(pArr.join(''));
			

			// -------------- This is a Duplicate function ----------------- //
			// $('.priceListRadio').bind('click',function(){				
				// myvmware.config.cmn.bindCurrenncyPriceListData(pList,$(this),curList);
			// });
			// $('.dPrice').bind('change',function(){
				// $(this).closest('div').find('.priceListRadio').trigger('click');
			// });
		},
		bindCurrenncyPriceListData: function(pList,selElement,curVal){
			// -------------- This is a Duplicate function ----------------- //
			// var tempCurrencyArr = [], uniquetempCurrencyArr = [];
			// if(selElement.attr('data-type') == 'others'){
				// $.each(pList.others[selElement.attr('data-index')][2],function(i,k){									
					// tempCurrencyArr.push("<div class='radioHolder'><input type='radio' data-key='"+k+"' name='currency' value='"+k+"'/><span>"+curVal[k]+"</span></div>");
				// });
				// $("#currency").html(tempCurrencyArr.join(""));
			// }
			// else{				
				// $.each(pList.unique[$(".dPrice option:selected").index()][2],function(i,k){									
					// uniquetempCurrencyArr.push("<div class='radioHolder'><input type='radio' data-key='"+i+"' name='currency' value='"+k+"'/><span>"+curVal[k]+"</span></div>");
				// });
				// $("#currency").html(uniquetempCurrencyArr.join(""));
			// }
		},
		getSelectedRateCard: function(offset,flag){
			var target= $("input:radio:checked[name='priceList"+flag+"']",offset);
			if(target.val() != "custom") return target.val();
			return target.siblings("select").val();
		},
		adjustHt: function(){
			$.each($("#addOnPreviewTable tbody tr.withSupport"),function(i,v){
				var ht = $(v).find("td:eq(0) div.baseSkuInfo").height();
				$(v).find("td:eq(1) div:eq(0)").height(ht+"px")
				$(v).find("td:eq(3) div:eq(0)").height(ht+"px")
				$(v).find("td:eq(4) div:eq(0)").height(ht+"px")
			})
		},
		showPreviewError: function(data){
			vmf.modal.show("errorPreviewModal",{
				"onShow" : function(){
					var $errorTemp = $("p#msg", $("#errorPreviewModal")).html(data.ERROR_MESSAGE);
					if($("#msg",$("#errorPreviewModal")).find(".errorHeader").length)
						$errorTemp.addClass("msg").closest(".body").addClass("nopadding").siblings(".header").hide();
					else
						$errorTemp.removeClass("msg").closest(".body").removeClass("nopadding").siblings(".header").show();
						
					if (typeof data.aaData != "undefined" && data.aaData.length>0){
						vmf.datatable.build($('#categorySkutable'),{
							"bPaginate": false,
							"bFilter": false,
							"bInfo":false,
							"aoColumns": [
								{"sTitle": "<span>"+rs.category+"</span>","bSortable":false},
								{"sTitle": "<span>"+rs.SKU+"</span>","bSortable":false}
							],
							"aaData": data.aaData,
							"bSort": false,
							"sScrollY":"400px",
							"bServerSide": false,
							"bProcessing":false,
							"fnDrawCallback":function(){
								if($("#categorySkutable tbody").height() < $("#categorySkutable_wrapper .dataTables_scrollBody").height()){
									$("#categorySkutable_wrapper .dataTables_scrollBody").height($("#categorySkutable tbody").height()+1+"px");
								}
								$(this).closest(".dataTables_scroll").addClass("bottomarea");
							}
						});
					}
					$("#errorPreviewModal").closest(".simplemodal-container").height($("#errorPreviewModal").height());
					$.modal.setPosition();
				}
			});
		}
		/* Code Begins (by Sathya) */
		, validateBusPhone:function(num){
			var reg = new RegExp('^[0-9\\.\\+\\-\\(\\)\\ \\s]*$');
			return reg.test(num);
		}
		, validateQuoteForm1 : function() {
			$.validator.addMethod("phoneformat", function(val, element) {
				return myvmware.config.cmn.validateBusPhone($.trim(val));
			},rs.Enter_valid_phone_number);

			// Validations for quote form 1
		    $("#quoteForm1").validate({
		    	errorPlacement : function(error, element) {
					myvmware.config.cmn.placeErrors(error, element);
				},
				rules : {
					_VM_preparedbyName: {
						required: true
					}
					,_VM_preparedByTitle: {
						required: true
					}
					,_VM_preparedByContact: {
						required: true
					}
					,_VM_billName: {
						required: true
					}
					,_VM_billEmail: {
						required: true,
						email: true
					}
					,_VM_billPhone: {
						required: true,
						phoneformat: true
					}
					,_VM_billCompany: {
						required: true
					}
					,_VM_billAddressLine1: {
						required: true
					}
					,_VM_billCity: {
						required: true
					}
					,_VM_billState: {
						required: true
					}
					,_VM_billZipCode: {
						required : true
					}
					,_VM_billCountry: {
						required: true
					}					
				},
				messages : {
					_VM_preparedbyName: {
						required : rs.Enter_Name
					}
					,_VM_preparedByTitle: {
						required : rs.Enter_Title
					}
					,_VM_preparedByContact : {
						required : rs.Enter_Contact
					}
					,_VM_billName: {
						required : rs.Enter_Contact_Name
					}
					,_VM_billEmail: {
						required: rs.Enter_Email,
						email: rs.Valid_Email
					}
					,_VM_billPhone: {
						required: rs.Enter_Phone,
						phoneformat: rs.Valid_Phone
					}
					,_VM_billCompany: {
						required: rs.Enter_Company
					}
					,_VM_billAddressLine1: {
						required: rs.Enter_Address1
					}
					,_VM_billCity: {
						required: rs.Enter_City
					}
					,_VM_billState: {
						required: rs.Enter_State
					}
					,_VM_billZipCode: {
						required : rs.Enter_Zip_Code
					}
					,_VM_billCountry: {
						required: rs.Enter_Country
					}					
				},
				onfocusout : function(element) {
					this.element(element);
				},
				success : function(em) {
					return false;
				},
				submitHandler : function() {
					// Attaching Continu Btn  event Handler
					myvmware.config.cmn.continueEvHandler();
					return false;
				}
		    });
		}
		, validateQuoteForm2 : function() {
			// Validations for quote form 2
			$.validator.addMethod("validateEA", function(val, element) {
				myvmware.config.cmn.emptyEADiv();
				return myvmware.config.cmn.validateEANumber(val, element);
			},'');
			
		    $("#quoteForm2").validate({
		    	errorPlacement : function(error, element) {
					myvmware.config.cmn.placeErrors(error, element);
				},
				rules : {
					_VM_quoteName: {
						required: true
					}
					,_VM_shipContactName: {
						required: true
					}
					,_VM_shipEmail: {
						required: true,
						email: true
					}
					,_VM_shipPhone: {
						required: true,
						phoneformat: true
					}
					,_VM_endUserName: {
						required: true
					}
					,_VM_endUserEmail: {
						required: true,
						email: true
					}
					,_VM_endUserContact: {
						required: true,
						phoneformat: true
					}
					,_VM_shipCompany: {
						required: true
					}
					,_VM_shipAddressLine1: {
						required: true
					}
					,_VM_shipCity: {
						required: true
					}
					,_VM_shipState: {
						required: true
					}
					,_VM_shipZipCode: {
						required : true
					}
					,_VM_shipCountry: {
						required: true
					}
					,_VM_quoteEa: {
						required : true,
						validateEA:true
					}
				},
				messages : {
					_VM_quoteName: {
						required: rs.Enter_Quote_Name
					}
					,_VM_shipContactName: {
						required: rs.Enter_Contact_Name
					}
					,_VM_shipEmail: {
						required: rs.Enter_Email,
						email: rs.Valid_Email
					}
					,_VM_shipPhone: {
						required: rs.Enter_Phone,
						phoneformat: rs.Valid_Phone
					}
					,_VM_endUserName: {
						required: rs.Enter_Name
					}
					,_VM_endUserEmail: {
						required: rs.Enter_Email,
						email: rs.Valid_Email
					}
					,_VM_endUserContact: {
						required: rs.Enter_Phone,
						phoneformat: rs.Valid_Phone
					}
					,_VM_shipCompany: {
						required: rs.Enter_Company
					}
					,_VM_shipAddressLine1: {
						required: rs.Enter_Address1
					}
					,_VM_shipCity: {
						required: rs.Enter_City
					}
					,_VM_shipState: {
						required: rs.Enter_State
					}
					,_VM_shipZipCode: {
						required : rs.Enter_Zip_Code
					}
					,_VM_shipCountry: {
						required: rs.Enter_Country
					}
					,_VM_quoteEa: {
						required : rs.Enter_EA_Number
					}
				},
				onfocusout : function(element) {
					this.element(element);
				},
				success : function(em) {
					return false;
				},
				submitHandler : function() {
					// Attaching Print Quote Btn  event Handler
					myvmware.config.cmn.printQuoteEvHandler();
					return false;
				}
		    });
		}
		, placeErrors:function(error, element){ //placing error message on validation of forms
			element.next().html(error);
		},
		validateEANumber:function(val, element){				
				var returnVal = false;
				$(".errorTxt").html("");				
				if(val.toLowerCase() !== rs.noEaFound ){					
					vmf.ajax.post(rs.getEaNameUrl,
								  {"_VM_quoteEa":val},
								  function(resp) {	
									if(typeof resp!="object") resp=vmf.json.txtToObj(resp);	
									if (resp == null || typeof resp.wrapper != "object") {
										$.validator.messages.validateEA = rs.eaErrorMsg;	
										returnVal = false;	
									}
									resp = vmf.getObjByIdx(resp,0);
									if(resp!=null){								
											if (typeof resp.ERROR_CODE!="undefined"){								$.validator.messages.validateEA = resp.ERROR_MESSAGE;
												returnVal = false;									
											}
											else if(resp.eaName){	
												$('#eaName').text(resp.eaName).closest('#eaNameDiv').show();
												returnVal = true;											
											} else {												
												$.validator.messages.validateEA = rs.eaErrorMsg;	
												returnVal = false;	
											} 											
									}									
								  },
								  function() {
									
								  },
								  function(){
									vmf.loading.hide()
								  },
								  null,
								  function(){
									vmf.loading.show();
								  },
								  false);					
				}
				else{					
					returnVal = true;
				}				
				return returnVal;
				
		},
		emptyEADiv: function(){
			$('#eaNameDiv').hide();
			$('#eaName').text('');
		}
		, loadQuoteContent : function() {
			// Emptying the input fields and error text
			$("#ConfigPreview .quote .input").val("");
			$(".errorTxt").html("");

			// Get Quote Btn Click event
			$("#ConfigPreview .footer #getQuote").die("click").live("click",function(){
			    myvmware.config.viewState = "preview";
			    $("#ConfigPreview").removeClass("previewContent").addClass("quoteContent quote1");
			    // Attaching Validations for Quote form 1
				myvmware.config.cmn.validateQuoteForm1();
				$("#ConfigPreview").closest(".simplemodal-container")
										.height($("#ConfigPreview").height())
				$.modal.setPosition();	
			});

			// Continue Btn Click event -- STEP 1 Navigation
			$("#ConfigPreview .footer #continue").die("click").live("click",function(){
				// Attaching Continu Btn  event Handler
				myvmware.config.cmn.continueEvHandler();
				$("#ConfigPreview").closest(".simplemodal-container")
										.height($("#ConfigPreview").height())
				$.modal.setPosition();	
			});

			// Print Quote Btn Click event -- STEP 2 Navigation
			$("#ConfigPreview .footer #printQuote").die("click").live("click",function(){
				// Attaching Print Quote Btn  event Handler
				myvmware.config.cmn.printQuoteEvHandler();
			});

			// Back Btn Click event
			$("#ConfigPreview .footer #back").die("click").live("click",function(){
				$(".errorTxt").html("");
			    if(myvmware.config.viewState=="preview"){
			        $("#ConfigPreview").removeClass("quoteContent quote1").addClass("previewContent");
			    } else if(myvmware.config.viewState=="quote1") {
			        myvmware.config.viewState = "preview";
			        $("#ConfigPreview").toggleClass("quote2 quote1");
					
			        // Indexing according to the form fields in that Step
			        $("#ConfigPreview #back").attr("tabindex","15");
					$("#ConfigPreview .fn_cancel").attr("tabindex","16");
					
					//set proper height
					$("#ConfigPreview").closest(".simplemodal-container")
										.height($("#ConfigPreview").height())
					$.modal.setPosition();	
			    }					    
			});
		},
		afterExport:function(jData){
			var jd = vmf.json.txtToObj(jData);
			if(jd != null && !jd.status) myvmware.sdp.cmn.showErrorModal(jd.error_MESSAGE);
		}
		, continueEvHandler : function () {
			$(".errorTxt").html("");				
			// Checking the validity of Form 1
			if($('#quoteForm1').valid()) {
				if($("#quoteNo").val() == "") {
					// Fetching Quote Number
					
					vmf.ajax.post(rs.getQuoteUrl,null,function(resp) {		
						if(typeof resp!="object") resp=vmf.json.txtToObj(resp);
						if (resp == null || typeof resp.wrapper != "object") {
							$(".errorTxt").html(rs.errorMsg);
							$("#quoteNo").val("");
							return;
						}
						resp = vmf.getObjByIdx(resp,0);
						if(resp.quoteNumber){
							myvmware.config.viewState = "quote1";
							$("#ConfigPreview").toggleClass("quote1 quote2");
							$("#quoteNo").val(resp.quoteNumber);
							
							// Attaching Validations for Quote form 2
							myvmware.config.cmn.validateQuoteForm2();
							// Indexing according to the form fields in that Step
							$("#ConfigPreview #back").attr("tabindex","33");
							$(" #ConfigPreview .fn_cancel").attr("tabindex","34");
							$("#ConfigPreview").closest(".simplemodal-container")
										.height($("#ConfigPreview").height())
							$.modal.setPosition();	
						} else {
							$(".errorTxt").html(resp.ERROR_MESSAGE || rs.errorMsg);
						} 
					}, function() {
						$(".errorTxt").html(resp.ERROR_MESSAGE || rs.errorMsg);
					},function(){vmf.loading.hide()},null,function(){vmf.loading.show()});
				} else {
					myvmware.config.viewState = "quote1";
					$("#ConfigPreview").toggleClass("quote1 quote2");
					// Attaching Validations for Quote form 2
					myvmware.config.cmn.validateQuoteForm2();
					// Indexing according to the form fields in that Step
					$("#ConfigPreview #back").attr("tabindex","33");
					$(" #ConfigPreview .fn_cancel").attr("tabindex","34");
					$("#ConfigPreview").closest(".simplemodal-container")
										.height($("#ConfigPreview").height())
					$.modal.setPosition();	
				}
			}
		}
		, printQuoteEvHandler : function() {
			$(".errorTxt").html("");
			// Checking the validity of Form 2
		   	if($('#quoteForm2').valid()) {
		   		var addon=[],qty=[],pay=[], supportLevel=[],_post,rows = $("tr.active", $("#addOnTable")),support=[];
		   		if(rs.service=="add-on") {
		   			var _selected = $("input:radio['name'='sDetail']:checked").closest("tr");			
		   		}
				$.each(rows, function(i,v){
					addon.push($(v).find("input:checkbox").attr("id"));
					qty.push($(v).find("input:text").val());
					pay.push(($(v).find("select.payType").length) ? $(v).find("select.payType").val() : $(v).find("select.payType").closest("label").find("span").html());
					supportLevel.push(($(v).find("select.levelType").length) ? $(v).find("select.levelType").val() : $(v).find("select.levelType").closest("label").find("span").html());
					support.push((typeof $(v).find("input:checkbox").attr("supid") !="undefined")? $(v).find("input:checkbox").attr("supid") : "");
				});
				var currencyval =  ($('#totalCost').attr('data-currency')) ? $('#totalCost').attr('data-currency') :"";

				if(rs.service == "new") {
					if(rs.horizon){
						_post = {"_VM_baseSku":addon.join(","),
							"_VM_qty":qty.join(","),
							"_VM_paymentType":pay.join(","),
							"_VM_supportLevel":supportLevel.join(","),
							"_VM_rateCardId":$(".priceLists").val(),
							"_VM_crosssku":sc.getCrosssku(),
							"_VM_currency":currencyval,
							"_VM_quoteEa":$('#eaNo').val(),
							"_VM_eaName":$('#eaName').text(),
							"_VM_customerType": $("#cType input:radio:checked").val(),
							"_VM_serviceTerm": parseInt($("#serTerm").html(), 10),
							"productFamilyCode": escape(rs.productFamilyCode)
						};
					} else {
						_post = {"_VM_baseSku":addon.join(","),"_VM_qty":qty.join(","),"_VM_paymentType":pay.join(","),"_VM_rateCardId":$(".priceLists").val(),"_VM_crosssku":sc.getCrosssku(),"_VM_currency":currencyval,"_VM_quoteEa":$('#eaNo').val(),"_VM_eaName":$('#eaName').text()};
					}
				} else if(rs.service == "upgrade"){
					if(rs.horizon){
						var _selected = $("input:radio['name'='sDetail']:checked").closest("tr");
						var rateCardIdContainer = $('#priceList select'), rateCardId = '', rateCardCurrency = '';
						if(!rateCardIdContainer.length){
							rateCardIdContainer = $('#priceList label');
							rateCardId = rateCardIdContainer.attr('data-value');
							rateCardCurrency = rateCardIdContainer.data('currency');
						}else {
							rateCardId = rateCardIdContainer.val();
							rateCardCurrency = rateCardIdContainer.find('option:selected').data('currency');
						}
						_post = {
							"_VM_quoteEa":_selected.data("acc"),
							"_VM_serviceID":_selected.data("id"),
							"_VM_rateCardId": rateCardId,
							"_VM_currency": rateCardCurrency,
							"_VM_eaName":$('#eaName').text(),
							"productFamilyCode": escape(rs.productFamilyCode),
							"_VM_upgradeDetails": myvmware.config.uConfig.step2Step3String
						};
					}
				} else {
					if(rs.horizon){
						_post = {
							"_VM_baseSku":addon.join(","),
							"_VM_qty":qty.join(","),
							"_VM_paymentType":pay.join(","),
							"_VM_rateCardId":$("select.priceLists").val(),
							"_VM_quoteEa":_selected.data("acc"),
							"_VM_serviceID":_selected.data("id"),
							//"_VM_currency":currencyval,
							"_VM_eaName":$('#eaName').text(),
							"_VM_supportLevel":supportLevel.join(","),
							"productFamilyCode": escape(rs.productFamilyCode)
						};
					} else {
						_post = {"_VM_baseSku":addon.join(","),"_VM_qty":qty.join(","),"_VM_paymentType":pay.join(","),"_VM_rateCardId":$(".priceLists").val(),"_VM_quoteEa":_selected.data("acc"),"_VM_serviceID":_selected.data("id"),"_VM_currency":currencyval,"_VM_eaName":$('#eaName').text()};
					}
				}
		   		_postValues = $.param(_post)+"&"+$("#quoteForm1").serialize()+"&"+$("#quoteForm2").serialize();

				$("#pdfPopup").attr("src",rs.quotationPreview+"&"+_postValues);
				$("#pdfPopup").load(function(){
					var respObj = $.parseJSON($('#pdfPopup').contents().find('pre').text());
					(typeof(respObj) == 'undefined') ? '' : $(".errorTxt").html(respObj.ERROR_MESSAGE);
				});
				//$("#pdfPopup").attr("onload",myvmware.config.cmn.afterExport);
		   }
		}
		, tiersArray : function(value, index) {
			var tierArr = [];
			if(typeof value == "object" && myvmware.sdp.cmn.getObjectSize(value)!=0){ // Adding Tiers
				var size = 0, key, tierObj=value,k, cnt=0, hide="";
				for (key in tierObj){
					//(cnt!=0) ? hide = " hidden" : ""
					size=0;
					tierArr.push("<span class='tierParent hidden "+key+ "'>");
					for (k in tierObj[key]){
						keyDiff = k.split("_");
						tierArr.push("<span class=\"tier\">Tier"+ ++size +" ("+keyDiff[0]+" to "+keyDiff[1]+" Qty) = "+tierObj[key][k][0]+" </span>");
						if(!$.trim(tierObj[key][k][0]).length) myvmware.config.cmn.noTierArr.push(index+"_tHolder");
					}
					tierArr.push("</span>");
					cnt++;
				}
			} else{
				tierArr = [];
			}
			
			return tierArr.join('');
		},
		horizonMap : "",
		buildSku : function(addons) {
			var levelTxt = oTxt = tierTxt = supportTxt = emptyTierTxt = sadd = '', addonTierArr=[], supportTier = [], rsaMsg, supportLevel = "", levelText = "";
			myvmware.config.cmn.noTierArr = [];
			$.each(addons, function(index,value){
				supportLevel = (rs.horizon) ? "<td class='c3'></td>" : "";
				sadd+='<tr class="even noCheck" aid="'+index+'" sid="'+index+'"><td class="c1"><span class="aType">'+index+'</span></td><td class="c2"></td>'+supportLevel+'<td class="c3"></td></tr>';
				if(value.length) {
					$.each(value, function(index1, value1){
						supportTxt = '';
						if(rs.horizon){
							myvmware.config.cmn.horizonMap = addons;
							if(value1[3].length){
								levelTxt = '<td class="c3"><label class="payType"><div class="fRight"><select class="levelType floatNone" data-index="'+index+'">'+myvmware.config.cmn.buildPayDropDown(value1[3], value1[5], true)+'</select><span class="errorLabel hidden blockLevel floatNone">'+rs.supportLevel+'</span></div></label></td>';
							}
						}
						if(value1[9]=="1") { // Checking for One Time
							oTxt = value1[4]; // One Time Txt
							tierTxt = ''; // No Support Skus and Tiers
						} else {
							addonTierArr = myvmware.config.cmn.tiersArray(value1[8], index);
							
							if(value1[10]!='' && value1[10]!=undefined) { // Adding Support SKUs and Tiers
								supportTier = myvmware.config.cmn.tiersArray(value1[10][8], index);
								supportTxt = '<div class="skutiercont"><div class="supportSkuDesc">'+value1[10][7]+'</div></div><div class="tierHolder">'+supportTier+'</div>';		
							}
							oTxt = '<select class="payType floatNone" data-index="'+index+'">'+myvmware.config.cmn.buildPayDropDown(value1[4], value1[6])+'</select>'; // Select Box
							if(!(addonTierArr.length > 0)){
								tierTxt = '';
								if(index1 == (value.length - 1))		//only for the last phantom
									addonTierArr = "<span class='noTier'>"+rs.noTiersMsg+" "+index+"</span>"
							}
							if(myvmware.config.cmn.noTierArr.length){
								$.each(myvmware.config.cmn.noTierArr,function(i,j){
									emptyTierTxt = "<div class='emptyTier'><span class='alertIcon21 fLeft'></span> "+rs.tierInfoMissing+" </div>";
								});
								myvmware.config.cmn.noTierArr = [];
							} else {
								emptyTierTxt = '';
							}
							tierTxt = '<tr class="odd tHolder" sid="'+index+'_tHolder" aid="'+index+'"><td colspan="3"><div class="tierHolder">'+addonTierArr+'</div>'+supportTxt+emptyTierTxt+'</td></tr>'; //Support SKUs and Tiers			
						}
						if(value1[11] != '' && value1[11] != 'undefined' && value1[11] != undefined) {
							rsaMsg = '<tr class="odd tHolder" sid="'+index+'_tHolder" aid="'+index+'"><td colspan="3"><div class="autoClose info"><p>'+value1[11]+'</p></div></td></tr>';
						} else {
							rsaMsg = '';
						}
						sadd+='<tr class="odd withCheck" sid="'+index+'_desc" aid="'+index+'"><td class="c1"><input type="checkbox" name="add-on" id="'+value1[0]+'"/> <span class="aType">'+value1[7]+'</span></td><td class="c2"><span class="qtyHolder"><input type="text" size="4" maxlength="3" value="'+value1[2]+'" class="qty fRight"> <span class="fRight qtyTxt">' + rs.qty + '&nbsp;</span><span class="errorLabel hidden blockLevel floatNone clearBoth">'+rs.validateQtyMsg+'</span></span></td>'+levelTxt+'<td class="c3"><label class="payType"><div class="fRight">'+oTxt+'<span class="errorLabel hidden floatNone blockLevel">'+rs.validatePayMsg+'</span></div></label></td></tr>'+tierTxt+rsaMsg;
					});
				}	else {
					return true;
				}
				$("#addOnTable").html(sadd);
			});
		},
		buildPayDropDown: function(options, support, flag){
			var opt=options.split(","),optArr=["<option value=''>" + ((flag === true) ? rs.supportLevel : rs.Select_Payment) + "</option>"];
			$.each(opt,function(i,v){
				optArr.push("<option value='"+v+"' data-support='"+support[v]+"'>"+v+"</option>");
			})
			return optArr.join("");
		},
		addBreadScrumbDetails: function(){
			if(typeof rs.breadscrumbName!="undefined"){
				$("#breadcrumb").find("ul li").removeClass("last");
				$.each(rs.breadscrumbName,function(i,j){
					if (i==rs.breadscrumbName.length-1){
						$("#breadcrumb").find("ul").append("<li class='last'><span>"+j+"</span></li>");
					} else {
						$("#breadcrumb").find("ul").append("<li><span><a href=''>"+j+"</a></span></li>");
					}
				});
			}
		},
		isReseller: partnerType === "RESELLER",
		isStandardUser: rs.isStandardUser === "true"
	}, // cmn

	"sConfig" : { // new service
		init: function(){
			sc = myvmware.config.sConfig;
			sc.skumap=[];
			sc.categoryMap=[];
			sc.fetchData();
			sc.bindEvents();
			myvmware.sdp.cmn.events();
			myvmware.config.cmn.events();
			myvmware.config.cmn.addBreadScrumbDetails();
			if(partnerType.toUpperCase()=="RESELLER")
				callBack.addsc({'f':'riaLinkmy','args':['configreseller:newservice:'+rs.tenantType]});
			else if (partnerType.toUpperCase()=="DISTI")
				callBack.addsc({'f':'riaLinkmy','args':['configdisti:newservice:'+rs.tenantType]});
				
			if(rs.horizon) {
				$("#progress").addClass("newHorizon");
			}
		},
		fetchData: function(){
			//$("#step1").show();			
			vmf.ajax.post(rs.fetchServices,"productFamilyCode="+escape(rs.productFamilyCode),sc.loadData,sc.loadFail);
		},
		loadData: function(data){
			if (typeof data!= "object") data=vmf.json.txtToObj(data);
			if (typeof data.ERROR_CODE!="undefined") {
				$("#loadingDiv, #step1").hide();
				$("#noData").show().find('.alertTitle').html(data.ERROR_MESSAGE);
				$("#progress").addClass("s0").show();
				//myvmware.sdp.cmn.showErrorModal("Unexpected error occurred. Try again later.");
				return;
			}
			data = vmf.getObjByIdx(data,0);
			$("#loadingDiv").hide();
			var cType = data.customerType,  sType=data.serviceType, pList=data.priceList, pType= data.paymentType, reg=data.region, regArr=[], cTypeArr=[], pTypeArr=[], optArr=[], pArr=[], sTypeArr=[],currency = data.currency, currencyArr=[];
			sc.skumap = data.crossRefSKUMap;	
			if(!$.isEmptyObject(cType)){
				if(rs.horizon){
					for(key in cType){
						var sTerm = data.serviceType, months, count = 0;
						$.each(sTerm, function(a, b){
							if(count == 0 && key === b.licenseType) {
								months = b.term.join(" ");
								cTypeArr.push("<div class='radioHolder'><input type='radio' class='"+months+"' name='cType' ct1='"+cType[key]+"' value='"+key+"' ct='"+(cType[key]).toLowerCase()+"'/><span>"+cType[key]+"</span></div>");
								count = 1;
							}
						});
						count = 0;
					}
					$("#cType").html(cTypeArr.join(''));
				} else {
					$.each(cType, function(i,v){ 
						cTypeArr.push("<div class='radioHolder'><input type='radio' name='cType' value='"+v+"' ct='"+v.toLowerCase()+"'/><span>"+v+"</span></div>");
					});
					$("#cType").html(cTypeArr.join(''));
				}
			}else{
				$("#cType").closest(".secHolder").hide();
			}
			
			if(!jQuery.isEmptyObject(currency)){
				var curLen = 0;
				$.each(currency, function(i,v){
					currencyArr.push("<div class='radioHolder "+i+"' style='display:none;'><input type='radio' data-key='"+i+"' name='currency' value='"+v+"'/><span>"+v+"</span></div>");
					curLen++;
				});
				$("#currency").html(currencyArr.join(''));
				$("#currency").append("<span class='selectPriceList'>"+rs.selectPriceList+"</span>");
				if(curLen == 1) { $("#currency .radioHolder").find('input').attr('checked', 'checked') }
			} else {
				$("#currency").closest(".secHolder").hide();
			}
			
			if(myvmware.sdp.cmn.getObjectSize(pList)!= 0) {
				myvmware.config.cmn.displayPriceListData(pList,"pricelist",1);
			} else {
				$("#pricelist").closest(".secHolder").hide();
			}
			
			if(rs.horizon){
				if(!jQuery.isEmptyObject(data.terms)){
					var serviceTerm = [];
					for(key in data.terms){
						serviceTerm.push("<div class='radioHolder "+key+"months'><input type='radio' name='sTerm' value='"+key+"' ct='"+(data.terms[key]).toLowerCase()+"'/><span>"+data.terms[key]+" "+rs.serviceLengthText[key]+"</span></div>");
					}
					$("#sTerm").html(serviceTerm.join(''));
				}
			}
			if(!rs.horizon){
				if(reg!=null && reg.length){
					$.each(reg, function(l,v){ 
						regArr.push("<div class='radioHolder'><input type='radio' name='region' value='"+v+"' rt='"+v.replace(/\s+/g, "_").toLowerCase()+"'/><span>"+v+"</span></div>");
					});
					$("#region").html(regArr.join(''));
				} else {
					$("#region").closest(".secHolder").hide();
				}
							
				if (pType.length){
					$.each(pType, function(i,v){
						pTypeArr.push("<div class='radioHolder'><input type='radio' name='pType' value='"+v+"'/><span>"+v+"</span></div>");
					});
					$("#pType").html(pTypeArr.join(''));
				} else {
					$("#pType").closest(".secHolder").hide();
				}
				
				if(sType.length){
					//var contentHoldet=$("<div class='clearfix'></div>");
					$.each(sType,function(h,j){
						var licType=j.licenseType.toLowerCase(), region=(j.region!=null && j.region.length) ? ("_"+j.region.replace(/\s+/g, "_").toLowerCase()):"", hidFlag = (j.defaultFlag && j.defaultFlag.toLowerCase() != "y") ? "hidden" : "";
						if (j.defaultFlag.toLowerCase()=="y") $("#cType input:radio[ct='"+licType+"']").attr("checked","checked");
						sTypeArr.push("<div class='clearfix sType "+licType+region+" "+hidFlag+"'><div class='sTypeHolder'><div class=\"fLeft radioWidth\"><input type='radio' value='"+j.tenantType+"' name='tenentType'/></div><div class='sName fLeft'>"+j.serviceName+"</div></div><div class='sLengthHolder fade'><span class='sLength fLeft'>" + rs.Service_Length + "</span><div class='lengthHolder'>");
						$.each(j.term,function(o,p){
							sTypeArr.push("<div class=''><input type='radio' value="+p[1]+" name='term' pType='"+p[2]+"' disabled='disabled'/><span>"+p[0]+"</span></div>");
						});
						sTypeArr.push("</div></div></div>");
					});
					$("#sType").html(sTypeArr.join(''));
				}else{
					$("#sType").closest(".secHolder").hide();
				}
				$("#sType").prepend("<span class='noServiceType hidden'>"+rs.noServiceTypeMsg+"</span>");
				if(!$(".sType").is(":visible")) $("#sType").prepend("<span class='initMsg'>"+rs.initialCusTypeMsg+"</span>");
			}
			$("#step1,#progress").show();
		},
		bindEvents: function(){
			$("#cType input").live('click', function(){
				$("#sTerm .radioHolder").hide();
				var months = $(this).attr("class").split(" ");
				$.each(months, function(i, c){
					$("div.radioHolder."+c+"months", $("#sTerm")).show();
				});
			});
			$("#pricelist input").live('click', function(){
				$("#currency span.noServiceType, #currency span.selectPriceList").remove();
				$("#currency .radioHolder").hide();
				var currency = ($(this).data("currency") != undefined) ? $(this).data("currency").split(" ") : "",
					errorFlag = false;
				if($.trim(currency) != ""){
					$.each(currency, function(i, c){
						$("div.radioHolder."+c, $("#currency")).show();
					});
				} else {
					errorFlag = true;
					var currency1 = $("#pricelist select.dPrice").find("option:selected").attr("data-currency").split(" ");
					if($.trim(currency1) != "" && $.trim(currency1) != undefined){
						$.each(currency1, function(i, c){
							$("div.radioHolder."+c, $("#currency")).show();
						});
						errorFlag = false;
					}
				}
				if(errorFlag){
					$("#currency").append("<span class='noServiceType'>"+rs.noCurrencyAvailable+"</span>");
				}
			});
			$("#pricelist select.dPrice").live('change', function(){
				$(this).closest("div").find("input").attr("checked", true);
				$("#currency .radioHolder").hide();
				var currency = $(this).find("option:selected").attr("data-currency").split(" ");
				$.each(currency, function(i, c){
					$("div.radioHolder."+c, $("#currency")).show();
				});
			});
			$(".lengthHolder input[type='radio']").live("click", function(){
				var pTypeArr = $(this).attr("pType").split(",");
				$("#pType .radioHolder").hide().find("input:radio").removeAttr("checked");
				if (pTypeArr.length>1) {
					$.each(pTypeArr, function(i,v){
						$("#pType input:radio[value='"+v+"']").closest(".radioHolder").show();
					});
				}
				if (pTypeArr.length == 1 || (pTypeArr.length==2 && pTypeArr[0] == pTypeArr[1])) {
					$("#pType input:radio[value='"+pTypeArr[0]+"']").attr('checked','checked').closest(".radioHolder").show();
				}
			});
			$("#sType .sTypeHolder input:radio",$("#step1")).live("click",function(){
				var target = $(this).closest(".sTypeHolder").siblings(".sLengthHolder");
				if (!target.hasClass("fade")) return;
				$("#sType .sLengthHolder").addClass("fade").find("input:radio").removeAttr("checked").attr("disabled","disabled");
				target.removeClass("fade").find("input:radio").removeAttr("disabled");
			});
			$("#cNext").live("click",function(){
				var postData;
				if(!rs.horizon){
					postData = {"_VM_crosssku":sc.getCrosssku(),"_VM_rateCardId":myvmware.config.cmn.getSelectedRateCard($("#pricelist"),1),"_VM_currency":$("#currency input:radio[name='currency']:checked").attr('data-key')};
				} else {
					postData = {"productFamilyCode": escape(rs.productFamilyCode), "_VM_customerType": $("div#cType input:radio:checked").val(), "_VM_serviceTerm": $("div#sTerm input:radio:checked").val(), "_VM_rateCardId": myvmware.config.cmn.getSelectedRateCard($("#pricelist"),1), "_VM_currency": $("#currency input:radio[name='currency']:checked").attr('data-key')}
				}
				vmf.ajax.post(rs.getAddOnData,postData,sc.buildAddOn,sc.failBuildAddOn,function(){vmf.loading.hide();},300000,function(){vmf.loading.show();});
				if(typeof riaLinkmy!="undefined"){
					var usd=$("#currency input:radio[name='currency']:checked").attr('data-key').toLowerCase(),cusType=$("input:radio:checked[name='cType']").val().toLowerCase(),
						rCardIndex = $("#pricelist input:radio").index($("#pricelist input:radio:checked"));
					var rCardCode=(rCardIndex == 0) ? "msrp" : ((rCardIndex == 1)?"master":"custom");
					if(partnerType.toUpperCase()=="RESELLER")
						riaLinkmy('configreseller:newservice:'+cusType+':'+rCardCode+':'+usd);
					else if (partnerType.toUpperCase()=="DISTI")
						riaLinkmy('configdisti:newservice:'+cusType+':'+usd);
				}
			});
			
			$("#cType input:radio, #region input:radio",$("#step1")).live("click",function(eve){
				var regFlag = $("#region").is(":visible");
				if(regFlag && (!$("#region input:radio:checked").length || !$("#cType input:radio:checked").length)) return;
				var selected=$(this),type=$("#cType input:radio:checked").attr("ct"), area=(regFlag) ? ("_"+$("#region input:radio:checked").attr("rt")) :"";
				if($("#sType .sType").hasClass(type+area)){
					$("#sType").find("span.initMsg, span.noServiceType").addClass("hidden").end()
					.find(".sType").addClass("hidden").filter("."+type+area).removeClass("hidden").end()
					.find("input:radio").removeAttr("checked").end().find(".sLengthHolder").addClass("fade");
				} else {
					$("#sType").find("span.noServiceType").removeClass("hidden").end()
							   .find(".sType, span.initMsg").addClass("hidden");
				}
			})
			
			$("input:radio",$("#step1")).live("click",function(){
				//if (!$("#cNext").hasClass("disabled")) return;
				var allradio = $("input:radio",$("#step1")),i,v,flag=true;
				$.each(allradio, function(i,v){
				    if (!$("input:radio[name="+$(v).attr('name')+"]").is(":checked")) flag=false
				});
				if(flag) $("#cNext").removeClass("disabled").removeAttr("disabled");
				else $("#cNext").addClass("disabled").attr("disabled","disabled");
			});
			
			$("select.priceLists").live("change", function(){
				$('#rateCardInfo #priceListNoSIDMsg').html('');
				if(!rs.horizon){
					var postData = {
						"_VM_crosssku":sc.getCrosssku(),
						"_VM_rateCardId":$(this).val(),
						"_VM_currency":$("#currency2").attr('data-currency')
					}
				} else {
						postData = {"productFamilyCode": escape(rs.productFamilyCode), "_VM_customerType": $("div#cType input:radio:checked").val(), "_VM_serviceTerm": $("div#sTerm input:radio:checked").val(), "_VM_rateCardId": $(this).val(), "_VM_currency": $("#currency2").attr('data-currency')}
				}

				vmf.ajax.post(rs.updatePricelist,postData,function(res){
					if(typeof res != "object") res = vmf.json.txtToObj(res);
					if (typeof res.ERROR_CODE!="undefined"){
						$('#rateCardInfo #priceListNoSIDMsg').html("<span class='alertIcon21' style='margin-left:10px;'></span> "+res.ERROR_MESSAGE);
						//$("#choosePrice").removeAttr("disabled");
						return;
					}
					if(typeof res.status!="undefined" && !res.status){ 
						$('#rateCardInfo #priceListNoSIDMsg').html("<span class='alertIcon21' style='margin-left:10px;'></span> "+rs.genericError);
						//$("#choosePrice").removeAttr("disabled");
					} else {
						sc.buildAddOn(res);
						vmf.modal.hide();
					}
					if(typeof riaLinkmy!="undefined"){
						if(partnerType.toUpperCase()=="RESELLER")
							riaLinkmy('configreseller:newaddcapacity:pricelistsave');
						else if (partnerType.toUpperCase()=="DISTI")
							riaLinkmy('configdisti:newaddcapacity:pricelistsave');
					}
				},function(){
					$('#rateCardInfo #priceListNoSIDMsg').html("<span class='alertIcon21' style='margin-left:10px;'></span> "+rs.genericError);
					//$("#choosePrice").removeAttr("disabled");
				},function(){vmf.loading.hide()},300000,function(){vmf.loading.show()});
			});
			
			
			$("#choosePrice").live("click",function(e){
				var selPrice = $("#priceListDetails input:radio:checked").val(), selPriceName=$("#priceListDetails input:radio:checked").siblings("span").html();
				$(this).attr("disabled","disabled");
				$("#editPricelist span.error").hide();
				vmf.ajax.post(rs.updatePricelist,{"_VM_crosssku":sc.getCrosssku(),"_VM_rateCardId":myvmware.config.cmn.getSelectedRateCard($("#editPricelist"),2),"_VM_currency":$("#currency2").attr('data-currency')},function(res){
					if(typeof res != "object") res = vmf.json.txtToObj(res);
					if (typeof res.ERROR_CODE!="undefined"){
						$("#editPricelist span.error").html(res.ERROR_MESSAGE).show();
						$("#choosePrice").removeAttr("disabled");
						return;
					}
					if(typeof res.status!="undefined" && !res.status){ 
						$("#editPricelist span.error").html(rs.genericError).show();
						$("#choosePrice").removeAttr("disabled");
					} else {
						sc.buildAddOn(res);
						vmf.modal.hide();
					}
					if(typeof riaLinkmy!="undefined"){
						if(partnerType.toUpperCase()=="RESELLER")
							riaLinkmy('configreseller:newaddcapacity:pricelistsave');
						else if (partnerType.toUpperCase()=="DISTI")
							riaLinkmy('configdisti:newaddcapacity:pricelistsave');
					}
				},function(){
					$("#editPricelist span.error").html(rs.genericError).show();
					$("#choosePrice").removeAttr("disabled");
				},function(){vmf.loading.hide()},300000,function(){vmf.loading.show()});
			});
			
			$('#addOnTable input:text, #addOnTable select.payType, #addOnTable select.levelType').live('change',function(){
				var $this = $(this),
					$parenttr = $this.closest('tr'),
					$qty = $parenttr.find('input:text').val() * 1,
					$payType = $parenttr.find('select.payType').val(),
					$levelType = $parenttr.find('select.levelType').val(),
					$errorSpan = $parenttr.find('span.errorLabel'),
					$errorOutline = $parenttr.find('.errorOutline'),
					$checkBox = $parenttr.find('input:checkbox');
				
				$parenttr.removeClass('active');
				$checkBox.removeAttr('checked');
				$errorSpan.removeClass("err").addClass("hidden")
				$errorOutline.removeClass('errorOutline');

				if($qty == 0 && $.trim($payType) == "") {
					if(rs.horizon){
						if($.trim($levelType) == ""){
							$parenttr.removeClass('active');
							$checkBox.removeAttr('checked');
						} else {
							$parenttr.addClass('active');
							$checkBox.attr('checked', 'checked');
						}
					}
				} else {
					$parenttr.addClass('active');
					$checkBox.attr('checked', 'checked');
				}
				
				
				// if(($qty <= 0) && ($payType == "" || $payType == undefined) && ($levelType == "" || $levelType == undefined)) {
					// $parenttr.removeClass('active');
					// $checkBox.removeAttr('checked');
				// } else if(($payType != "" || $qty > 0 || $levelType != "") && (!$checkBox.attr('checked'))) {
					// $parenttr.addClass('active');
					// $checkBox.attr('checked', 'checked');
				// }
			});

			$("#s2Apply").live("click", function(){
				var addons = $("#addonSection input:checkbox:checked"), f=true, qty, level;
				$.each(addons,function(i,v){
					qty = $(v).closest("tr").find("input.qty"),
					pay = ($(v).closest("tr").find("select.payType").length) ? $(v).closest("tr").find("select.payType").val() : $(v).closest("tr").find("label.payType").text();
					qty.removeClass('errorOutline').closest("td").find("span.errorLabel").removeClass("err").addClass("hidden");
					$(v).closest("tr").find("select.payType").removeClass("errorOutline").closest("td").find("span.errorLabel").removeClass("err").addClass("hidden");
					if(rs.horizon){
						level = $(v).closest("tr").find("select.levelType");
						level.removeClass("errorOutline").closest("td").find("span.errorLabel").removeClass("err").addClass("hidden");
					}
					if(parseInt(qty.val(), 10) == 0 && pay=="") {
						if(rs.horizon){
							if(level.val()==""){
								f = true;
							} else {
								f = false;
								qty.addClass('errorOutline').closest("td").find("span.errorLabel").addClass("err").removeClass("hidden");
								$(v).closest("tr").find("select.payType").addClass("errorOutline").closest("td").find("span.errorLabel").addClass("err").removeClass("hidden");
							}
						} else {
							f = true;
						}
					} else {
						if(parseInt(qty.val(), 10) == 0) {
							f = false;
							qty.addClass('errorOutline').closest("td").find("span.errorLabel").addClass("err").removeClass("hidden");
						}
						if($.trim(pay).length == ""){
							f = false;
							$(v).closest("tr").find("select.payType").addClass("errorOutline").closest("td").find("span.errorLabel").addClass("err").removeClass("hidden");
						}
						if(rs.horizon){
							if($.trim(level.val()).length == ""){
								f = false;
								level.addClass("errorOutline").closest("td").find("span.errorLabel").addClass("err").removeClass("hidden");
							}
						}
					}
				});
				if(f){
					//$(this).attr("disabled","disabled");
					$("span.errorLabel").removeClass("err").addClass("hidden");
					var addon=[],qty=[],pay=[],supportType=[],_post,rows = $("tr.active");
					$.each(rows, function(i,v){
						addon.push($(v).find("input:checkbox").attr("id"));
						qty.push($(v).find("input:text").val());
						pay.push(($(v).find("select.payType").length) ? $(v).find("select.payType").val() : $(v).find("label.payType").html());
						if(rs.horizon){
							supportType.push(($(v).find("select.levelType").length) ? $(v).find("select.levelType").val() : $(v).find("select.levelType").closest("label").find("span").html());
						}
						//support.push((typeof $(v).find("input:checkbox").attr("supid") !="undefined")? $(v).find("input:checkbox").attr("supid") : "");
					});
					if(rs.horizon){
						_post = {"productFamilyCode": escape(rs.productFamilyCode),
							"_VM_customerType":$("#cType input:radio:checked").val(),
							"_VM_serviceTerm":parseInt($.trim($("#serTerm").html()), 10),
							"_VM_rateCardId":$(".priceLists").val(),
							"_VM_currency":$("#currency2").attr('data-currency'),
							"_VM_baseSku":addon.join(","),
							"_VM_paymentType":pay.join(","),
							"_VM_supportLevel":supportType.join(","),
							"_VM_qty":qty.join(",")
						}
					} else {
						_post = {"_VM_baseSku":addon.join(","),
							"_VM_qty":qty.join(","),
							"_VM_paymentType":pay.join(","),
							"_VM_rateCardId":$(".priceLists").val(),
							"_VM_crosssku":sc.getCrosssku(),
							"_VM_currency":$("#currency2").attr('data-currency')
						}
					}
					vmf.ajax.post(rs.getReviewPage,_post,sc.showPreview,sc.failedPreview,function(){vmf.loading.hide()},300000,function(){vmf.loading.show()});
					if(typeof riaLinkmy!="undefined"){
						var _addon = (addon.length==0)?"withoutaddon":"withaddon";
						if(partnerType.toUpperCase()=="RESELLER")
							riaLinkmy('configreseller:newaddcapacity:'+_addon);
						else if (partnerType.toUpperCase()=="DISTI")
							riaLinkmy('configdisti:newaddcapacity:'+_addon);
					}
				}
			})
		},
		showPriceListError:function(){
			myvmware.sdp.cmn.showErrorModal(rs.genericError);
		},
		failBuildAddOn: function(){
			$("#noAddon").show();
		},
		showPreview: function(data){
			if (typeof data!="object") data=vmf.json.txtToObj(data);
			if (typeof data.ERROR_CODE!="undefined"){
				myvmware.config.cmn.showPreviewError(data);
				return;
			}
			data = vmf.getObjByIdx(data,0);
			var currency3= $("#currency2",$("#step2")).attr('data-currency');
			$("#totalCost").attr('data-currency',currency3).html(data.totalCost);

			/*if(!data.aaData.length && !data.addOnTable.length){
				$("#serviceConfigPreviewTable span.error").html(rs.errorMsg);
				return;
			}*/
			vmf.modal.show("ConfigPreview",{
				onShow: function(){
					if(!rs.horizon) {
						sc.buildServicePreviewTable(data.aaData);
					}
					myvmware.config.viewState = "preview"; //Added By Sathya
					if(data.addOnTable!=null && data.addOnTable.length) sc.buildAddonPreviewTable(data.addOnTable);
					$("#progress").removeClass("s2").addClass("s3");
					$("#ConfigPreview").closest(".simplemodal-container")
										.height($("#ConfigPreview").height()); // Added By Sathya;					
					$.modal.setPosition();
					$("#export").bind("click",function(){
						var addon=[],qty=[],pay=[],_post,rows = $("tr.active", $("#addOnTable")),support=[], supportType=[];
						$.each(rows, function(i,v){
							addon.push($(v).find("input:checkbox").attr("id"));
							qty.push($(v).find("input:text").val())
							pay.push(($(v).find("select.payType").length) ? $(v).find("select.payType").val() : $(v).find("label.payType").html());
							supportType.push(($(v).find("select.levelType").length) ? $(v).find("select.levelType").val() : $(v).find("select.levelType").closest("label").find("span").html());
							support.push((typeof $(v).find("input:checkbox").attr("supid") !="undefined")? $(v).find("input:checkbox").attr("supid") : "");
						});
						if(rs.horizon){
							_post = {"productFamilyCode": escape(rs.productFamilyCode),
								"_VM_customerType":$("#cType input:radio:checked").val(),
								"_VM_serviceTerm":parseInt($.trim($("#serTerm").html()), 10),
								"_VM_rateCardId":$(".priceLists").val(),
								"_VM_currency":$("#currency2").attr('data-currency'),
								"_VM_baseSku":addon.join(","),
								"_VM_paymentType":pay.join(","),
								"_VM_supportLevel":supportType.join(","),
								"_VM_qty":qty.join(",")
							}
						} else {
							_post = {"_VM_baseSku":addon.join(","),"_VM_qty":qty.join(","),"_VM_paymentType":pay.join(","),"_VM_rateCardId":$(".priceLists").val(),"_VM_crosssku":sc.getCrosssku(),"_VM_currency":currency3}
						}
						
						//vmf.ajax.post(rs.exportNewServiceConfiguratorExcel,_post,sc.successExport,sc.failExport);
						$("#excelPopup").attr("src",rs.exportNewServiceConfiguratorExcel+"&"+$.param(_post));
						$("#excelPopup").attr("onload",myvmware.config.cmn.afterExport);
						if(typeof riaLinkmy!="undefined"){
							if(partnerType.toUpperCase()=="RESELLER")
								riaLinkmy('configreseller:newaddcapacity:addonpreview:export');
							else if (partnerType.toUpperCase()=="DISTI")
								riaLinkmy('configdisti:newaddcapacity:addonpreview:export');
						}
					});
					// Reattaching the tooltip for info icon -- Added by Sathya					
					$("#ConfigPreview a.fn_tooltip").accessibleTooltip({topOffset: 30,leftOffset: -90,associateWithLabel:false,preContent: "<div class='arrow bottom'></div>"});
					// Checking the condition for enabling and disabling Quote Btn -- Added By Sathya
					if (rs.isStandardUser.toLowerCase()=="true" && rs.quotationToolFlag=="Y"){
						$("#getQuote").removeClass("hidden");
						myvmware.config.cmn.loadQuoteContent();							
					}
					(data.showPrePayMsg) ? $("#ConfigPreview").find(".note").show() : $("#ConfigPreview").find(".note").hide();
					if(typeof riaLinkmy!="undefined"){
						if(partnerType.toUpperCase()=="RESELLER")
							riaLinkmy('configreseller:newaddcapacity:addonpreview');
						else if (partnerType.toUpperCase()=="DISTI")
							riaLinkmy('configdisti:newaddcapacity:addonpreview');
					}
				},
				onClose:function(){
					$("#progress").removeClass("s3").addClass("s2");
					vmf.modal.hide();
					// Replacing button and div with tooltip class to an anchor tag for reattaching the tooltip functionality -- Added by Sathya
					$("#ConfigPreview .tooltip").remove();
					$("#ConfigPreview .priceHolder").prepend('<a class="tooltip fn_tooltip nomargin" data-tooltip-position="bottom" title="'+rs.totalMonthlyCostToolTip+'"></a>');
				}
			});
			$(window).resize();
		},
		/*failExport: function(jData){
			if(jData != null && !jData.status) myvmware.sdp.cmn.showErrorModal(jDatas.error_MESSAGE);
		},*/
		buildServicePreviewTable: function(data){
			vmf.datatable.build($("#serviceConfigPreviewTable"),{
				"bPaginate": false,
				"bFilter": false,
				"bInfo":false,
				"bAutoWidth":false,
				"aoColumns": [
					{"sTitle": "<span>"+rs.sService+"</span>","sWidth":"350","bSortable":false},
					{"sTitle": "<span>"+rs.qty+"</span>","sWidth":"40","bSortable":false,"sClass":"normal"},
					//{"sTitle": "<span>"+rs.supportLevelLabel+"</span>","sWidth":"70","bSortable":false,"sClass":"normal", "bVisible":(rs.horizon) ? true : false},
					{"sTitle": "<span>"+rs.payType+"</span>","sWidth":"90px","bSortable":false,"sClass":"normal"},
					{"sTitle": "<span>"+rs.unitCost+"</span>","sWidth":"100px","bSortable":false,"sClass":"normal"},
					{"sTitle": "<span>"+rs.extCost+"</span>","sWidth":"100px","bSortable":false,"sClass":"normal"},
					{"sTitle": "","bVisible":false}
				],
				"aaData": data,
				"bSort": false,
				"bServerSide": false,
				"bProcessing":false,
				"fnRowCallback": function(nRow,aData,iDisplayIndex){
					$(nRow).find("td:eq(0)").html("<div><span class='core'>"+rs.core+"</span><span>"+aData[0]+"</span></div><div>"+aData[5]+"</div>");
					return nRow;
				}
			});
		},
		buildAddonPreviewTable: function(data){
			vmf.datatable.build($('#addOnPreviewTable'),{
				"bPaginate": false,
				"bFilter": false,
				"bInfo":false,
				"bAutoWidth":false,
				"aoColumns": [
					{"sTitle": "<span>"+((rs.horizon) ? rs.addprod : rs.addConf)+"</span>","sWidth":"340px","bSortable":false},
					{"sTitle": "<span>"+rs.qty+"</span>","sWidth":"40px","bSortable":false,"sClass":"normal"},
					{"sTitle": "<span>"+rs.supportLevelLabel+"</span>","sWidth":"70px","bSortable":false,"sClass":"normal", "bVisible":(rs.horizon) ? true : false},
					{"sTitle": "<span>"+rs.payType+"</span>","sWidth":"90px","bSortable":false,"sClass":"normal"},
					{"sTitle": "<span>"+rs.unitCost+"</span>","sWidth":"100px","bSortable":false,"sClass":"normal"},
					{"sTitle": "<span>"+rs.extCost+"</span>","sWidth":"100px","bSortable":false,"sClass":"normal"},
					{"sTitle": "","bVisible":false},
					{"sTitle": "","bVisible":false},
					{"sTitle": "","bVisible":false},
					{"sTitle": "","bVisible":false}
				],
				"aaData": data,
				"bSort": false,
				"bServerSide": false,
				"bProcessing":false,
				"sScrollY":"230px",
				"fnRowCallback": function(nRow,aData,iDisplayIndex){
					$(nRow).find("td:eq(0)").html("<div class='baseSkuInfo'><span class='addon'>"+aData[0]+"</span><span>"+aData[6]+"</span><div class='addonskuDesc'>"+aData[7]+"</div></div>");
					//$(nRow).find("td:eq(1)").html("<div class='qty'>"+aData[1]+"</div>");
					if (rs.horizon){
						$(nRow).find("td:eq(3)").html("<div class='unit'>"+aData[3]+"</div>");
						$(nRow).find("td:eq(4)").html("<div class='ext'>"+aData[4]+"</div>");
					} else {
						$(nRow).find("td:eq(3)").html("<div class='unit'>"+aData[4]+"</div>");
						$(nRow).find("td:eq(4)").html("<div class='ext'>"+aData[5]+"</div>");
					}
					var support = (typeof aData[9] == "string") ? vmf.json.txtToObj(aData[9]) : aData[9];
					if (support && support.length){
						if(rs.horizon)
							$(nRow).addClass("withSupport").find("td:eq(0)").append("<div><span class='supportSkuDesc'>"+support[5]+" - "+ support[6]+"</span></div>").end().find("td:eq(3)").append("<div class='unit'>"+support[3]+"</div>").end().find("td:eq(4)").append("<div class='ext'>"+support[4]+"</div>");
						else
							$(nRow).addClass("withSupport").find("td:eq(0)").append("<div><span class='supportSkuDesc'>"+support[6]+" - "+ support[7]+"</span></div>").end().find("td:eq(3)").append("<div class='unit'>"+support[4]+"</div>").end().find("td:eq(4)").append("<div class='ext'>"+support[5]+"</div>");
					}
					$(nRow).attr("sid",aData[0]);
					return nRow;
				},
				fnDrawCallback:function(){
					$(this).closest(".dataTables_scroll").addClass("bottomarea");
					/*$.each($('#addOnPreviewTable tbody tr'),function(){
						if($(this).hasClass("duplicate")){
							$("tr[sid='"+$(this).attr("category")+"']",$("#addOnPreviewTable")).addClass("withSupport").find("td:eq(0)").append("<div><span class='supportSkuDesc'>"+$(this).data("skuID")+" - "+ $(this).data("sku")+"</span></div>").end().find("td:eq(3)").append("<div class='unit'>"+$(this).data("unit")+"</div>").end().find("td:eq(4)").append("<div class='ext'>"+$(this).data("ext")+"</div>");
							$(this).hide();
						}
					});*/
					if($("#addOnPreviewTable tbody").height() < $("#addOnPreviewTable_wrapper .dataTables_scrollBody").height()){
						$("#addOnPreviewTable_wrapper .dataTables_scrollBody").height($("#addOnPreviewTable tbody").height()+1+"px");
					}
					//sc.categoryMap=[];
				},
				fnInitComplete: function(){
					myvmware.config.cmn.adjustHt();
				}
			});
		},
		getCrosssku: function(){
			var regVal = ($("#region").has("input:radio").length>0) ? ("_"+$("input:radio:checked[name='region']").val()):"", key = $("input:radio:checked[name='tenentType']").val()+"_"+$("input:radio:checked[name='term']").val()+"_"+$("input:radio:checked[name='pType']").val()+"_"+$("input:radio:checked[name='cType']").val()+regVal;
			return (!rs.horizon) ? sc.skumap[key] : "";
		},
		displayAddon:function(data){
			if(typeof data !="object") data=vmf.json.txtToObj(data);
			if(typeof data.ERROR_CODE!="undefined"){			    
				$('#priceListNoSIDMsg').html("<span class='alertIcon21 fLeft'></span> "+data.ERROR_MESSAGE);
				return;
			}
			$('#priceListNoSIDMsg').html('');
			data = vmf.getObjByIdx(data,0);
			var cService = data.serviceConfig.aaData[0], sAddon=data.addOnConfig, cHead=data.header, tierArr=[], hideClass="",category=[];
			$("#serType",$("#step2")).html(cHead.serType);
			$("#region2",$("#step2")).html(cHead.region);
			//var step2Curr = $("#currency input:radio[data-key='"+cHead.currency+"']",$("#step1")).val();
			var $step2CurTemp = $("#currency input[name=currency]:checked",$("#step1"));
			var step2Curr = $step2CurTemp.val(), step2CurrCode = $step2CurTemp.attr('data-key');
			$("#currency2",$("#step2")).html(cHead.currency).attr('data-currency',step2CurrCode);
			$("#serConfig tbody").html("<tr><td>"+cService[0]+"</td><td>"+cService[1]+"</td><td>"+cService[2]+"</td><td>"+cService[3]+"</td><td>"+cService[4]+"</td></tr>");
			$("#addOnTable").html("");
			if(!$.isEmptyObject(sAddon.addons)){
				myvmware.config.cmn.buildSku(sAddon.addons);
				$("#addOnTable").show();
				$("#noAddon").hide();
			} else {
				$("#addOnTable").hide();
				$("#noAddon").show();
			}
			$("#step1,#noData").hide();
			$("#step2").show();
			$("#progress").removeClass("s3 s0").addClass("s2");
			//$("button#s2Apply").addClass("disabled").attr("disabled","disabled");
			$('a#resetTable').addClass('disabled');
			if(typeof riaLinkmy!="undefined"){
				if(partnerType.toUpperCase()=="RESELLER")
					riaLinkmy('configreseller:newaddcapacity');
				else if (partnerType.toUpperCase()=="DISTI")
					riaLinkmy('configdisti:newaddcapacity');
			}
		},
		buildAddOn: function(data){
			if(typeof data !="object") data=vmf.json.txtToObj(data);
			if(typeof data.ERROR_CODE!="undefined"){
				//$("#noData").show().find('.alertTitle').html(data.ERROR_MESSAGE);
				myvmware.sdp.cmn.showErrorModal(data.ERROR_MESSAGE);
				return;
			}
			data = vmf.getObjByIdx(data,0);
			var cService = data.serviceConfig.aaData[0], sAddon=data.addOnConfig, cHead=data.header, tierArr=[], hideClass="",category=[];
			$("#serType",$("#step2")).html(cHead.serType);
			$("#region2",$("#step2")).html(cHead.region);
			$("#cusType",$("#step2")).html($("#step1 div#cType div.radioHolder input:radio:checked").val());
			if(rs.horizon) {
				$("#serTerm", $("#step2")).html($("#step1 div#sTerm div.radioHolder input:radio:checked").val() + " Months");
				if($("#step1 div#cType div.radioHolder input:radio:checked").attr("ct1")){
					$("#cusType",$("#step2")).html($("#step1 div#cType div.radioHolder input:radio:checked").attr("ct1"));
				}
			} else {
				$("#serTerm", $("#step2")).html(parseInt($("#step1 div#sType div.sLengthHolder input:radio:checked").val(), 10) + " Months");
			}
			//var step2Curr = $("#currency input:radio[data-key='"+cHead.currency+"']",$("#step1")).val();
			var $step2CurTemp = $("#currency input[name=currency]:checked",$("#step1"));
			var step2Curr = $step2CurTemp.val(), step2CurrCode = $step2CurTemp.attr('data-key');
			$("#currency2",$("#step2")).html(cHead.currency).attr('data-currency',step2CurrCode);
			/* tool tip defect
			if(rs.isStandardUser.toLowerCase()!="true"){
				var hoverText = $("button.priceListToolTip").attr("title") || "",
					hoverContentUpdated = hoverText.replace("#URL", "");
				$("button.priceListToolTip").attr("title", hoverContentUpdated);
				myvmware.hoverContent.bindEvents('.fn_tooltip', 'epfunc','','', true);			
			}*/
			if(cService != undefined) {
				var additionalVal = (rs.horizon) ? '<td>'+cService[5]+'</td>' : "";
				$("#serConfig tbody").html("<tr><td>"+cService[0]+"</td><td>"+cService[1]+"</td><td>"+cService[2]+"</td><td>"+cService[3]+"</td><td>"+cService[4]+"</td>"+additionalVal+"</tr>");
			} else {
				$("#serConfig").closest("div").hide();
			}
			var dropdown = ["<select class='priceLists'>"];
			$.each(sAddon.rateCardList, function(k,l){
				var	currencys = l[2].join(" "), selectedTxt="";
				if($.trim(sAddon.rateCardId)==l[0]) selectedTxt="selected='true'";
				dropdown.push("<option data-currency='"+currencys+"' value='"+l[0]+"' "+selectedTxt+">"+l[1]+"</option>");
			});
			dropdown.push("</select>");
			
			$("#rateCardInfo span#priceList").html(dropdown.join(" "));
			$("#rateCardInfo span#priceList select.priceLists").val(sAddon.rateCardId);
			if($("#rateCardInfo span#priceList select.priceLists option").length == 1) {
				var elem = $("#rateCardInfo span#priceList select.priceLists").hide();
				$("#rateCardInfo span#priceList").append("<label style='line-height:24px'>"+elem.find("option").text()+"</label>");
			}
			// if(sAddon.rateCardName!=null && sAddon.rateCardName!=""){
				// if(partnerType!="RESELLER") hideClass="hidden";
				// $("#priceList").html(sAddon.rateCardName + '<a class="editRateCard '+hideClass+'" id="editRateCard" href="javascript:void(0)" val="'+sAddon.rateCardId+'">Edit</a>');
			// } else {
				// $("#rateCardInfo").hide();
			// }
			$("#addOnTable").html("");
			if(!$.isEmptyObject(sAddon.addons)){
				myvmware.config.cmn.buildSku(sAddon.addons);
				$("#addOnTable").show();
				$("#noAddon").hide();
			} else {
				$("#addOnTable").hide();
				$("#noAddon").show();
			}
			$("#step1,#noData").hide();
			$("#step2").show();
			$("#progress").removeClass("s3 s0").addClass("s2");
			if(rs.horizon){
				$("button#s2Apply").addClass("disabled").attr("disabled","disabled");
			}
			$('a#resetTable').addClass('disabled');
			if(typeof riaLinkmy!="undefined"){
				if(partnerType.toUpperCase()=="RESELLER")
					riaLinkmy('configreseller:newaddcapacity');
				else if (partnerType.toUpperCase()=="DISTI")
					riaLinkmy('configdisti:newaddcapacity');
			}
		}
	}, // sConfig

	"aConfig":{ // add-on
		init:function(){
			ac = myvmware.config.aConfig;
			ac.subTable=[];
			ac.categoryMap=[];
			ac.bindEvents();
			myvmware.sdp.cmn.events();
			myvmware.config.cmn.events();
			myvmware.config.cmn.addBreadScrumbDetails();
			if(partnerType.toUpperCase()=="RESELLER")
				callBack.addsc({'f':'riaLinkmy','args':['configreseller:addonsearch:'+rs.tenantType]});
			else if (partnerType.toUpperCase()=="DISTI")
				callBack.addsc({'f':'riaLinkmy','args':['configdisti:addonsearch:'+rs.tenantType]});
				
			if(rs.horizon) {
				$("#progress").addClass("addonHorizon");
			}
		},
		bindEvents: function(){
			$(".search input:text").val("").removeAttr("disabled").bind("keyup",function(event){
				if(event.keyCode == 13){
					if (!$("#searchBtn").hasClass('disabled')){
						$("#searchBtn").click();
						}
				}
				if($.trim($(this).val()).length){
					var opts = $(this).closest(".ctrlHolder").siblings("div");
					opts.addClass("fade").find("input:text").attr("disabled","disabled").val("");
					$("#searchBtn").removeClass("disabled").removeAttr("disabled")
					$(this).closest(".ctrlHolder").addClass("active");
				} else {
					var opts = $(this).closest(".ctrlHolder").siblings("div");
					$(this).closest(".ctrlHolder").removeClass("active");
					opts.removeClass("fade").find("input:text").removeAttr("disabled");
					$("#searchBtn").addClass("disabled").attr("disabled","disabled");
				}
				if($(this).attr('id') == 'acntNum') {
					$('span.errorText').hide();
					$(this).removeClass('errorOutline');
					var val = $(this).val();
					if(val != ''){
						if(!val.match(/^\d+$/)){
							$(this).addClass('errorOutline');
							$('span.errorText').attr('style', 'display:block');
							$("#searchBtn").addClass("disabled").attr("disabled","disabled");
						} else {
							$('span.errorText').hide();
							$(this).removeClass('errorOutline');
						}
					}
				}
				
			}).bind('cut copy paste', function (e){ setTimeout(function(){$(e.target).trigger('keyup');},10)});
			
			$("#resetBtn").bind("click",function(){
				$(".search input:text").val("").removeAttr("disabled").closest("div.ctrlHolder").removeClass("fade");
				$("#searchBtn").addClass("disabled").attr("disabled","disabled");
				$('span.errorText').hide();
				$('.errorOutline').removeClass('errorOutline');
			})
			
			$("#searchBtn").bind("click",function(){
				
				var selectedOption;
				$.each($("form#searchForm").find("input:text"),function(i,v){
					if ($.trim($(v).val()).length) {selectedOption = $(v).attr("criteria") ; return false;}				
				});
				vmf.ajax.post(rs.getSearchResults, $("#searchForm").serialize()+"&productFamilyCode="+escape(rs.productFamilyCode), ac.displayResults,ac.noResults,
				function(){$("#loadingDiv").addClass("hidden")},
				300000,
				function(){$("#loadingDiv").removeClass("hidden");$("#results,#noData").hide()});

				if(typeof riaLinkmy!="undefined"){
					if(partnerType.toUpperCase()=="RESELLER")
						riaLinkmy('configreseller:addonsearch:'+selectedOption);
					else if (partnerType.toUpperCase()=="DISTI")
						riaLinkmy('configdisti:addonsearch:'+selectedOption);
				}
			});
			
			$("#resultSet .toggle").live("click",function(e){
				e.preventDefault();
				var o = $(this), $row=$(this).closest("div.row"),row=$row[0];
				if (o.hasClass('minus')){
					o.removeClass('minus').html("+ "+rs.show);
					$row.removeClass("active").next("div.more-details").hide();
				}else{
					o.addClass('minus').html("- "+rs.hide);
					$row.addClass("active");
					if(!row.haveData){
						ac.expandRow($row);
						row.haveData=true;
					} else
						$row.next("div.more-details").show();
				}
			});
			
			$("input:radio[name='sDetail']").live("click",function(){
				$("#aNext").removeClass("disabled").removeAttr("disabled");
			});
			
			if(rs.sourcePage == "" && rs.sourcePage.length == 0){
				$("#progress,#step1,#step2 #toStep1").show();
				$("#aNext").live("click",function(){
					var _selected = $("input:radio['name'='sDetail']:checked").closest("tr"), _post;
					_post= {"_VM_selectedEaNumber":_selected.data("acc"),"_VM_serviceID":_selected.data("id"), "productFamilyCode": escape(rs.productFamilyCode)}
					vmf.ajax.post(rs.getAddOnData,_post,ac.buildAddOn,ac.failBuildAddOn,function(){vmf.loading.hide();},300000,function(){vmf.loading.show();});
				});
			} else {
				$("#step1,#noData").hide();
				_post= {"_VM_selectedEaNumber":rs.eaNumber,"_VM_serviceID":rs.serviceID};
				//if (rs.horizon){
					_post["productFamilyCode"]=escape(rs.productFamilyCode);
				//}
				vmf.ajax.post(rs.getAddOnData,_post,ac.buildAddOn,ac.failBuildAddOn,function(){vmf.loading.hide();},300000,function(){vmf.loading.show();});
			}
			
			$("#serConfig .openclose").live("click",function(){
				if($(this).hasClass("minus")){
					$(this).removeClass("minus").closest("table").find("tr:not(:first-child)").addClass("hidden");
				} else {
					$(this).addClass("minus").closest("table").find("tbody tr").removeClass("hidden");
				}
			});
			
			$("#serviceConfigPreviewTable .openclose").live("click",function(){
				if($(this).hasClass("minus")){
					$(this).removeClass("minus").closest("table").find("tr:not(:first-child)").addClass("hidden").end().closest(".dataTables_scrollBody").css("height","80px");
				} else {
					$(this).addClass("minus").closest("table").find("tbody tr").removeClass("hidden").end().closest(".dataTables_scrollBody").css("height","130px");
				}
			});
			$("select.priceLists").live("change", function(){
				$("#rateCardInfo span.error").html('').hide();
				var _selected = $("input:radio['name'='sDetail']:checked").closest("tr");
				var postData = {
					"_VM_selectedEaNumber":_selected.data("acc"),
					"_VM_serviceID":_selected.data("id"),
					"_VM_rateCardId":$(this).val(),
					"_VM_currency":$("#currency2").attr('data-currency')
				}
				if (rs.horizon){
					postData["productFamilyCode"]=escape(rs.productFamilyCode);
				}
				vmf.ajax.post(rs.updatePricelist,postData,function(res){
					if(typeof res != "object") res = vmf.json.txtToObj(res);
					if (typeof res.ERROR_CODE!="undefined"){
						$("#rateCardInfo span.error").html("<span class='alertIcon21 fLeft'></span><span>"+res.ERROR_MESSAGE+"</span>").show();
						//$("#choosePrice").removeAttr("disabled");
						return;
					}
					if(typeof res.status!="undefined" && !res.status) $("#rateCardInfo span.error").html("<span class='alertIcon21 fLeft'></span><span>"+rs.genericError+"</span>").show();
					else{
						ac.buildAddOn(res);
						vmf.modal.hide();
					}
					if(typeof riaLinkmy!="undefined"){
						if(partnerType.toUpperCase()=="RESELLER")
							riaLinkmy('configreseller:addonaddiotional:pricelistsave');
						else if (partnerType.toUpperCase()=="DISTI")
							riaLinkmy('configdisti:addonaddiotional:pricelistsave');
					}
				},function(){
					$("#rateCardInfo span.error").html("<span class='alertIcon21 fLeft'></span><span>"+rs.genericError+"</span>").show();
				},function(){vmf.loading.hide()},null,function(){vmf.loading.show()});
			});
			
			$("#choosePrice").live("click",function(e){
				var selPrice = $("#priceListDetails input:radio:checked").val(), selPriceName=$("#priceListDetails input:radio:checked").siblings("span").html();
				$(this).attr("disabled","disabled");
				$("#editPricelist span.error").hide();
				var _selected = $("input:radio['name'='sDetail']:checked").closest("tr"), _post;
				_post= {"_VM_selectedEaNumber":_selected.data("acc"),"_VM_serviceID":_selected.data("id"),"_VM_rateCardId":myvmware.config.cmn.getSelectedRateCard($("#editPricelist"),2)}
				vmf.ajax.post(rs.updatePricelist,_post,function(res){
					if(typeof res != "object") res = vmf.json.txtToObj(res);
					if (typeof res.ERROR_CODE!="undefined"){
						$("#editPricelist span.error").html(res.ERROR_MESSAGE).show();
						$("#choosePrice").removeAttr("disabled");
						return;
					}
					if(typeof res.status!="undefined" && !res.status) $("#editPricelist span.error").html(rs.genericError).show();
					else{
						ac.buildAddOn(res);
						vmf.modal.hide();
					}
					if(typeof riaLinkmy!="undefined"){
						if(partnerType.toUpperCase()=="RESELLER")
							riaLinkmy('configreseller:addonaddiotional:pricelistsave');
						else if (partnerType.toUpperCase()=="DISTI")
							riaLinkmy('configdisti:addonaddiotional:pricelistsave');
					}
				},function(){
					$("#editPricelist span.error").html(rs.genericError).show();
				},function(){vmf.loading.hide()},null,function(){vmf.loading.show()});
			});
			$('#addOnTable input:text, #addOnTable select.payType, #addOnTable select.levelType').live('change',function(){
				var $this = $(this),
					$parenttr = $this.closest('tr'),
					$qty = $parenttr.find('input:text').val() * 1,
					$payType = $parenttr.find('select.payType').val(),
					$levelType = $parenttr.find('select.levelType').val(),
					$errorSpan = $parenttr.find('span.errorLabel'),
					$errorOutline = $parenttr.find('.errorOutline'),
					$checkBox = $parenttr.find('input:checkbox');
				
				$parenttr.removeClass('active');
				$checkBox.removeAttr('checked');
				$errorSpan.removeClass("err").addClass("hidden")
				$errorOutline.removeClass('errorOutline');

				if($qty == 0 && $.trim($payType) == "") {
					if(rs.horizon){
						if($.trim($levelType) == ""){
							$parenttr.removeClass('active');
							$checkBox.removeAttr('checked');
						} else {
							$parenttr.addClass('active');
							$checkBox.attr('checked', 'checked');
						}
					}
				} else {
					$parenttr.addClass('active');
					$checkBox.attr('checked', 'checked');
				}
				if($("#addOnTable tr input:checkbox:checked").length && rs.isAddonMandatory){
					$("button#s2Apply").removeClass('disabled').removeAttr('disabled');
				}
				
				// if(($qty <= 0) && ($payType == "" || $payType == undefined) && ($levelType == "" || $levelType == undefined)) {
					// $parenttr.removeClass('active');
					// $checkBox.removeAttr('checked');
				// } else if(($payType != "" || $qty > 0 || $levelType != "") && (!$checkBox.attr('checked'))) {
					// $parenttr.addClass('active');
					// $checkBox.attr('checked', 'checked');
				// }
			});
			// $('#addOnTable input:text, #addOnTable select').live('change',function(){
				// var $this = $(this),
					// $parenttr = $this.closest('tr'),
					// $qty = $parenttr.find('input:text').val() * 1,
					// $type = $parenttr.find('select').val(),
					// $errorSpan = $parenttr.find('span.errorLabel'),
					// $errorOutline = $parenttr.find('.errorOutline'),
					// $checkBox = $parenttr.find('input:checkbox');
				
				// $parenttr.removeClass('active');
				// $checkBox.removeAttr('checked');
				// $errorSpan.removeClass("err").addClass("hidden")
				// $errorOutline.removeClass('errorOutline');

				// $("button#s2Apply").addClass('disabled').attr('disabled','disabled');

				
				
				// if(($qty <= 0) && ($type == "" || $type == undefined)) {
					// $parenttr.removeClass('active');
					// $checkBox.removeAttr('checked');
				// } else if(($type != "" || $qty > 0) && (!$checkBox.attr('checked'))) {
					// $parenttr.addClass('active');
					// $checkBox.attr('checked', 'checked');
				// }
				 // if($("#addOnTable tr input:checkbox:checked").length && rs.isAddonMandatory){
					// $("button#s2Apply").removeClass('disabled').removeAttr('disabled');
				// }
			// });

			$("#s2Apply").live("click", function(){
				var addons = $("#addonSection input:checkbox:checked"), f=true, qty, level;
				$.each(addons,function(i,v){
					qty = $(v).closest("tr").find("input.qty"),
					pay = ($(v).closest("tr").find("select.payType").length) ? $(v).closest("tr").find("select.payType").val() : $(v).closest("tr").find("label.payType").text();
					qty.removeClass('errorOutline').closest("td").find("span.errorLabel").removeClass("err").addClass("hidden");
					$(v).closest("tr").find("select.payType").removeClass("errorOutline").closest("td").find("span.errorLabel").removeClass("err").addClass("hidden");
					if(rs.horizon){
						level = $(v).closest("tr").find("select.levelType");
						level.removeClass("errorOutline").closest("td").find("span.errorLabel").removeClass("err").addClass("hidden");
					}
					if(parseInt(qty.val(), 10) == 0 && $.trim(pay).length == 0) {
						if(rs.horizon){
							if($.trim(level.val()).length == 0){
								f = true;
							} else {
								f = false;
								qty.addClass('errorOutline').closest("td").find("span.errorLabel").addClass("err").removeClass("hidden");
								$(v).closest("tr").find("select.payType").addClass("errorOutline").closest("td").find("span.errorLabel").addClass("err").removeClass("hidden");
							}
						} else {
							f = true;
						}
					} else {
						if(parseInt(qty.val(), 10) == 0) {
							f = false;
							qty.addClass('errorOutline').closest("td").find("span.errorLabel").addClass("err").removeClass("hidden");
						}
						if($.trim(pay).length == 0){
							f = false;
							$(v).closest("tr").find("select.payType").addClass("errorOutline").closest("td").find("span.errorLabel").addClass("err").removeClass("hidden");
						}
						if(rs.horizon){
							if($.trim(level.val()).length == 0){
								f = false;
								level.addClass("errorOutline").closest("td").find("span.errorLabel").addClass("err").removeClass("hidden");
							}
						}
					}
				});
				if(f){
					//$(this).attr("disabled","disabled");
					$("span.errorLabel").removeClass("err").addClass("hidden");
					var addon=[],qty=[],pay=[], supportLevel=[],_post,rows = $("tr.active");
					$.each(rows, function(i,v){
						addon.push($(v).find("input:checkbox").attr("id"));
						qty.push($(v).find("input:text").val())
						pay.push(($(v).find("select.payType").length) ? $(v).find("select.payType").val() : $(v).closest("tr").find("label.payType").text());
						if(rs.horizon){
							supportLevel.push(($(v).find("select.levelType").length) ? $(v).find("select.levelType").val() : $(v).find("select.levelType").closest("label").find("span").html());
						}
						//support.push((typeof $(v).find("input:checkbox").attr("supid") !="undefined")? $(v).find("input:checkbox").attr("supid") : "");
					});
					var _selected = $("input:radio['name'='sDetail']:checked").closest("tr"), _post;
					if(rs.horizon){
						_post = {"_VM_baseSku":addon.join(","),"_VM_qty":qty.join(","),"_VM_paymentType":pay.join(","),"_VM_rateCardId":$(".priceLists").val(),"_VM_selectedEaNumber":_selected.data("acc"),"_VM_serviceID":_selected.data("id"), "_VM_supportLevel": supportLevel.join(","), "productFamilyCode": escape(rs.productFamilyCode) }
					} else {
						_post = {"_VM_baseSku":addon.join(","),"_VM_qty":qty.join(","),"_VM_paymentType":pay.join(","),"_VM_rateCardId":$(".priceLists").val(),"_VM_selectedEaNumber":_selected.data("acc"),"_VM_serviceID":_selected.data("id") }
					}
					
					vmf.ajax.post(rs.getReviewPage,_post,ac.showPreview,ac.failedPreview,function(){vmf.loading.hide()},300000,function(){vmf.loading.show()});
				}
				//Quote Tool Changes.				
				$('#eaNo').val($('td#cAccount').text());
				$('#eaName').text($('td#cName').text()).closest('#eaNameDiv').show();
				
			});
			
		},
		expandRow: function($row){
			var sOut = [];
			sOut.push('<div class="more-details"><table class="file_details_tbl" id="'+ ("child-table1-" + $row.attr("id")) + '" style="width:100%"></table></div>');
			$row.after(sOut.join(''));
			var $subTable = $("#child-table1-" + $row.attr("id"));
			var cdata = ac.subTable[$row.attr("val")];
			vmf.datatable.build($subTable,{
				"aoColumns": [
					{"sTitle": "","sWidth":"8px","bSortable":false},
					{"sTitle": "","sWidth":"8px","bSortable":false},
					{"sTitle": "<span>"+rs.sId+"</span>","sWidth":"105px","bSortable":false},
					{"sTitle": "<span>"+rs.sType+"</span>","sWidth":"150px","bSortable":false},
					{"sTitle": "<span>"+rs.region+"</span>","sWidth":"100px","bSortable":false},
					{"sTitle": "<span>"+rs.tEnd+"</span>","sWidth":"100px","bSortable":false},
					{"sTitle": "<span>"+rs.rTerm+"</span>","sWidth":"80px","bSortable":false}
				],
				"aaData":cdata,
				"error":myvmware.sdp.cmn.dataTableError,
				"bInfo":false,
				"bSort": false,
				"bAutoWidth":false,
				"bServerSide": false,   
				"bFilter":false,
				"bPaginate": false,
				"fnRowCallback": function(nRow,aData,iDisplayIndex){
					var $nRow=$(nRow);
					$nRow.find("td:eq(0)").html("<input type='radio' name='sDetail' />");
					$nRow.find("td:eq(1)").html("<span class=\"openclose\"></span>").end().data({"id":aData[2],"acc":$row.attr("val")});
					$(nRow)[0].idx = iDisplayIndex;
					return nRow;
				},
				"fnInitComplete":function(){
					var dtd=this;
					$(dtd).find(".openclose").bind("click", function(e){
						e.preventDefault();
						ac.expandRow2($(this),dtd);
					}); 
					//if(!dtd.find('tfoot').length) $(dtd).append('<tfoot><tr><td class="bottomarea" colspan="5"></td></tr></tfoot>');
				}
			});
		},
		expandRow2 :function(o,t){
			 nTr1 = o[0].parentNode.parentNode;
			if (o.hasClass('minus')){
				o.removeClass('minus');
				$(nTr1).removeClass("expanded noborder").next("tr").hide();
			}else{
				o.addClass('minus');
				$(nTr1).addClass("expanded noborder");
				if(!nTr1.haveData){
					t.fnOpen(nTr1,ac.showloading(),'');
					ac.getCdata2($(nTr1), nTr1.idx);
					nTr1.haveData = true;
					$(nTr1).next("tr").addClass('more-detail');
				}else
					$(nTr1).next("tr").show();	
			}	
		},
		getCdata2:function(rowObj, idx){
			var sOut = [];
			sOut.push('<table class="file_details_tbl" id="'+ ("child-table2-" + rowObj.closest("table").attr("id")+ idx ) + '"></table>');
			$(nTr1).next("tr").addClass('more-detail').find("td").html(sOut.join(''));
			var $subTable = $("#child-table2-" + rowObj.closest("table").attr("id")+ idx);
			vmf.datatable.build($subTable,{
				"aoColumns": [
					{"sTitle": "<span>"+rs.SKU+"</span>","sWidth":"130px","bSortable":false},
					{"sTitle": "<span>"+rs.component+"</span>","sWidth":"270px","bSortable":false},
					{"sTitle": "<span>"+rs.orderType+"</span>","sWidth":"75px","bSortable":false},
					{"sTitle": "<span>"+rs.payType+"</span>","sWidth":"80px"},
					{"sTitle": "<span>"+rs.monthly_Remaining+"</span>","sWidth":"100px","bSortable":false},
					{"sTitle": "<span>"+rs.quantity+"</span>","sWidth":"50px","bSortable":false}
				],
				"sAjaxSource":rs.fetchSkuDetails+"&_VM_serviceID="+rowObj.data("id")+"&_VM_selectedEaNumber="+rowObj.data("acc")+"&productFamilyCode="+escape(rs.productFamilyCode),
				"error":myvmware.sdp.cmn.dataTableError,
				"bInfo":false,
				"bServerSide": false,  
				"bSort": false,				
				"bAutoWidth":false,
				"bFilter":false,
				"bPaginate": false,
				"sPaginationType": "full_numbers",
				"fnInitComplete":function(){
					var dtd=this;
					//if(!dtd.find('tfoot').length) $(dtd).append('<tfoot><tr><td class="bottomarea" colspan="5"></td></tr></tfoot>');
				}
			})
		},
		showloading :function(){return sOut="<div class='loadWraper' style='text-align:center; padding-left:40%'><div class='loading_big'>" + rs.Loading + "</div></div>";},
		displayResults: function(data){
			if(typeof data !="object") data=vmf.json.txtToObj(data);
			if(typeof data.ERROR_CODE!="undefined"){
				$("#noData").show().find('.alertTitle').html(data.ERROR_MESSAGE);
				$("#results").hide();
				return false;
			}
			data = vmf.getObjByIdx(data,0);
			var res = data.results,resArr=[],uniRecords = data.iTotalRecords || 0;
			$("#results .num").html(uniRecords); // Phase 2 - FR-SDP2-CON-113 - fixed;
			if(res.length>0) {
				$.each(res,function(i,v){
					resArr.push("<div class='clearfix row' id='row"+i+"' val='"+v[0]+"'><div class='wrap c1 '><span class='label'>"+rs.accNum+": </span><span class='val'>"+v[0]+"</span></div><div class='wrap c2'><span class='label'>"+rs.custName+": </span><span class='val'>"+v[1]+"</span></div><div class='wrap c3'><span class='label'>"+rs.contact+": </span><span class='val'>"+v[2]+"</span></div><div class='wrap c4'><span class='label'>"+rs.sIds+": </span><span class='val'>"+v[3]+"</span></div><div class='c5'><a href='javascript:void(0)' class='toggle'>+ " + rs.Show + "</a></div></div>");
				});
				ac.subTable=data.subaaData;
				$("#resultSet").html(resArr.join('')).show().closest("#results").show();
			} else {
				$("#resultSet").hide();
			}
			$("#aNext").addClass("disabled").attr("disabled",true);
			$("#results").show();
		},
		displayAddOn: function(data){
			if(typeof data !="object") data=vmf.json.txtToObj(data);
			if(typeof data.ERROR_CODE!="undefined"){
				//$("#noData").show().find('.alertTitle').html(data.ERROR_MESSAGE);
				var errMsg = data.ERROR_MESSAGE;
				if(typeof data.ERROR_CODE!="undefined"){			    
				$('#priceListNoSIDMsg').html("<span class='alertIcon21 fLeft'></span> "+data.ERROR_MESSAGE);
				return;
			}
				return;
			}
			data = vmf.getObjByIdx(data,0);
			var cService = data.serviceConfig.aaData, sAddon=data.addOnConfig, cHead=data.header, sadd="", tierArr=[], hideClass="",category=[],ref=$("#step2"),serArr=[], hClass,cParam;
			$("#serType",ref).html(cHead.serType);
			cParam = (partnerType == "RESELLER") ? "?_VM_selectedAccountNumber="+cHead.customerAccount : "?_VM_source=DISTI&_VM_selectedAccountNumber="+cHead.prmId+"&_VM_selectedEaNumber="+cHead.customerAccount;
			$("#cName",ref).html((rs.isStandardUser.toLowerCase()!="true") ? "<a href='"+rs.compNameUrl+cParam+"' target='_blank'>"+cHead.companyName+"</a>" : cHead.companyName);
			$("#cAccount",ref).html(cHead.customerAccount);
			$("#pContact",ref).html("<a href='mailto:"+cHead.procContractEmail+"' title='"+cHead.procContractEmail+"' target='_blank'>"+cHead.procContract+"</a>");
			$("#soldBy",ref).html(cHead.soldBy);
			$("#sID",ref).html((rs.isStandardUser.toLowerCase()!="true") ? "<a href='"+rs.serviceIDUrl+"&_VM_serviceID="+cHead.encodedServiceID+"' target='_blank'>"+cHead.serviceID+"</a>" : cHead.serviceID);
			//$("#sID",ref).html((rs.isStandardUser.toLowerCase()!="true") ? "<a href='" + rs.backURL + cHead.encodedServiceID + "' target='_blank'>"+cHead.serviceID+"</a>" : cHead.serviceID);
			$("#sTerm",ref).html(cHead.serviceTerm);
			$("#sDate",ref).html(cHead.startDate);
			$("#rTerm",ref).html(cHead.remainTerm);
			$("#renew",ref).html(cHead.renewType);
			$("#currency2",$("#step2")).html(cHead.currency);
			$("#priceListCurrency", ref).html(cHead.currency);
			$("#region2",$("#step2")).html(cHead.region);
			$.each(cService,function(a,e){
				hClass = (a!=0) ? "class=hidden" : "";
				serArr.push("<tr "+hClass+"><td>"+e[0]+"</td><td>"+e[1]+"</td><td>"+e[2]+"</td>");
				if(rs.isStandardUser.toLowerCase()=="true") serArr.push("<td>"+e[3]+"</td><td>"+e[4]+"</td>");
				serArr.push("</tr>");
			});
			$("#serConfig tbody").html(serArr.join(""));
			if (cService.length>1 && !$("#serConfig thead tr th:first-child").find("span.openclose").length){
					$("#serConfig thead tr th:first-child").prepend("<span class='openclose'></span>").closest("table#serConfig").addClass("multipleServices")
			} else {
					$("#serConfig thead tr th:first-child").remove("span.openclose");
			}
			
			$("#serConfig thead tr th:first-child span.openclose").removeClass("minus") //This is required when user expand and goes back to previous step and comes back
			$("#addOnTable").html("");
			if(!$.isEmptyObject(sAddon.addons)){
				myvmware.config.cmn.buildSku(sAddon.addons);
				$("#addOnTable").show();
				$("#noAddon").hide();
			} else {
				$("#addOnTable").hide();
				$("#noAddon").show();
			}
			$("#step1,#noData").hide();
			$("#step2").show();
			$("#progress").show().removeClass("s3 s0").addClass("s2");
			$("button#s2Apply").addClass("disabled").attr("disabled","disabled");
			$('a#resetTable').addClass('disabled');
			if(typeof riaLinkmy!="undefined"){
				if(partnerType.toUpperCase()=="RESELLER")
					riaLinkmy('configreseller:addonaddiotional');
				else if (partnerType.toUpperCase()=="DISTI")
					riaLinkmy('configdisti:addonaddiotional');
			}
		},
		buildAddOn: function(data){
			if(typeof data !="object") data=vmf.json.txtToObj(data);
			if(typeof data.ERROR_CODE!="undefined"){
				//$("#noData").show().find('.alertTitle').html(data.ERROR_MESSAGE);
				var errMsg = data.ERROR_MESSAGE;
				vmf.modal.show('noAddonError', {
				    checkPosition: true,
				    onShow: function() {
				        $(".modalContent .bodyContentMsg", "#noAddonError").html(errMsg);
				        $('.modalContent .noAddon_ok', '#noAddonError').die('click').live('click', function() {
				            vmf.modal.hide();
				        });
				    }
				});
				return;
			}
			data = vmf.getObjByIdx(data,0);
			var cService = data.serviceConfig.aaData, sAddon=data.addOnConfig, cHead=data.header, sadd="", tierArr=[], hideClass="",category=[],ref=$("#step2"),serArr=[], hClass,cParam;
			$("#serType",ref).html(cHead.serType);
			cParam = (partnerType == "RESELLER") ? "?_VM_selectedAccountNumber="+cHead.customerAccount : "?_VM_source=DISTI&_VM_selectedAccountNumber="+cHead.prmId+"&_VM_selectedEaNumber="+cHead.customerAccount;
			$("#cName",ref).html((rs.isStandardUser.toLowerCase()!="true") ? "<a href='"+rs.compNameUrl+cParam+"' target='_blank'>"+cHead.companyName+"</a>" : cHead.companyName);
			$("#cAccount",ref).html(cHead.customerAccount);
			$("#pContact",ref).html("<a href='mailto:"+cHead.procContractEmail+"' title='"+cHead.procContractEmail+"'>"+cHead.procContract+"</a>");
			$("#soldBy",ref).html(cHead.soldBy);
			$("#sID",ref).html((rs.isStandardUser.toLowerCase()!="true") ? "<a href='"+rs.serviceIDUrl+"&_VM_serviceID="+cHead.encodedServiceID+"' target='_blank'>"+cHead.serviceID+"</a>" : cHead.serviceID);
			//$("#sID",ref).html((rs.isStandardUser.toLowerCase()!="true") ? "<a href='"+ rs.backURL + cHead.encodedServiceID + "' target='_blank'>"+cHead.serviceID+"</a>" : cHead.serviceID);
			$("#sTerm",ref).html(cHead.serviceTerm);
			$("#sDate",ref).html(cHead.startDate);
			$("#rTerm",ref).html(cHead.remainTerm);
			$("#renew",ref).html(cHead.renewType);
			$("#currency2",$("#step2")).html(cHead.currency);
			$("#priceListCurrency", ref).html(cHead.currency);
			$("#region2",$("#step2")).html(cHead.region);
			if(rs.isStandardUser.toLowerCase()!="true"){
				if(partnerType != "DISTI"){
					var hoverText = $("button.priceListToolTip").attr("title"),
						hoverContentUpdated = hoverText.replace("#URL", rs.compNameUrl+cParam);
					$("button.priceListToolTip").attr("title", hoverContentUpdated);
					myvmware.hoverContent.bindEvents('.fn_tooltip', 'epfunc','','', true);
				}
			}
			$.each(cService,function(a,e){
				var support = (rs.horizon) ? "<td>"+e[3]+"</td>" : "";
				hClass = (a!=0) ? "class=hidden" : "";
				header = ($.trim(e[6]) != "") ? "<strong>"+e[6]+"</strong><br />" : "";
				serArr.push("<tr "+hClass+"><td>"+e[0]+"</td><td>"+header+e[1]+"</td><td>"+e[2]+"</td>"+support);
				if(rs.isStandardUser.toLowerCase()=="true") serArr.push("<td>"+e[4]+"</td><td>"+e[5]+"</td>");
				serArr.push("</tr>");
			});
			
			
			$("#serConfig tbody").html(serArr.join(""));
			if (cService.length>1 && !$("#serConfig thead tr th:first-child").find("span.openclose").length){
					$("#serConfig thead tr th:first-child").prepend("<span class='openclose'></span>").closest("table#serConfig").addClass("multipleServices")
			} else {
					$("#serConfig thead tr th:first-child").remove("span.openclose");
			}
			
			$("#serConfig thead tr th:first-child span.openclose").removeClass("minus") //This is required when user expand and goes back to previous step and comes back
			
			var dropdown = ["<select class='priceLists'>"];
			$.each(sAddon.rateCardList, function(k,l){
				var	currencys = l[2].join(" "), selectedTxt="";
				if($.trim(sAddon.rateCardId)==l[0]) selectedTxt="selected='true'";
				dropdown.push("<option data-currency='"+currencys+"' value='"+l[0]+"' "+selectedTxt+">"+l[1]+"</option>");
			});
			dropdown.push("</select>");

			$("#rateCardInfo span#priceList").html(dropdown.join(" "));
			$("#rateCardInfo span#priceList select.priceLists").val(sAddon.rateCardId);
			if($("#rateCardInfo span#priceList select.priceLists option").length == 1) {
				var elem = $("#rateCardInfo span#priceList select.priceLists").hide();
				$("#rateCardInfo span#priceList").append("<label style='line-height:24px'>"+elem.find("option").text()+"</label>");
			}
			$("#addOnTable").html("");
			if(!$.isEmptyObject(sAddon.addons)){
				myvmware.config.cmn.buildSku(sAddon.addons);
				$("#addOnTable").show();
				$("#noAddon").hide();
			} else {
				$("#addOnTable").hide();
				$("#noAddon").show();
			}
			$("#step1,#noData").hide();
			$("#step2").show();
			$("#progress").show().removeClass("s3 s0").addClass("s2");
			$("button#s2Apply").addClass("disabled").attr("disabled","disabled");
			$('a#resetTable').addClass('disabled');
			if(typeof riaLinkmy!="undefined"){
				if(partnerType.toUpperCase()=="RESELLER")
					riaLinkmy('configreseller:addonaddiotional');
				else if (partnerType.toUpperCase()=="DISTI")
					riaLinkmy('configdisti:addonaddiotional');
			}
		},
		showPriceListError:function(){
			myvmware.sdp.cmn.showErrorModal(rs.genericError);
		},
		showPreview: function(data){
			if (typeof data!="object") data=vmf.json.txtToObj(data);
			if (typeof data.ERROR_CODE!="undefined"){
				myvmware.config.cmn.showPreviewError(data);
				return;
			}
			data = vmf.getObjByIdx(data,0);
			$("#totalCost").html(data.totalCost);
			if(!data.aaData.length && !data.addOnTable.length){
				$("#serviceConfigPreviewTable span.error").html(rs.errorMsg);
				return;
			}
			vmf.modal.show("ConfigPreview",{
				onShow: function(){
					ac.buildServicePreviewTable(data.aaData);
					ac.buildAddonPreviewTable(data.addOnTable);
					myvmware.config.viewState = "preview"; //Added By Sathya
					$("#progress").removeClass("s2").addClass("s3");
					$("#ConfigPreview").closest(".simplemodal-container")
							.height($("#ConfigPreview").height());
					$.modal.setPosition();
					$("#export").bind("click",function(){
						var addon=[],qty=[],pay=[],_post,rows = $("tr.active", $("#addOnTable")),support=[],supportType=[], _selected = $("input:radio['name'='sDetail']:checked").closest("tr");
						$.each(rows, function(i,v){
							addon.push($(v).find("input:checkbox").attr("id"));
							qty.push($(v).find("input:text").val())
							pay.push(($(v).find("select.payType").length) ? $(v).find("select.payType").val() : $(v).find("label.payType").html());
							supportType.push(($(v).find("select.levelType").length) ? $(v).find("select.levelType").val() : $(v).find("select.levelType").closest("label").find("span").html());
							support.push((typeof $(v).find("input:checkbox").attr("supid") !="undefined")? $(v).find("input:checkbox").attr("supid") : "");
						});
						if(rs.horizon){
							_post = {"productFamilyCode": escape(rs.productFamilyCode),
								"_VM_serviceID":_selected.data("id"),
								"_VM_selectedEaName": $("td#cName").html(),
								"_VM_selectedEaNumber":_selected.data("acc"),
								"_VM_rateCardId":$(".priceLists").val(),
								"_VM_baseSku":addon.join(","),
								"_VM_paymentType":pay.join(","),
								"_VM_supportLevel":supportType.join(","),
								"_VM_qty":qty.join(",")
							}
						} else {
							_post = {"_VM_baseSku":addon.join(","),"_VM_qty":qty.join(","),"_VM_paymentType":pay.join(","),"_VM_rateCardId":$(".priceLists").val(),"_VM_selectedEaNumber":_selected.data("acc"),"_VM_serviceID":_selected.data("id")};
						}
						
						$("#excelPopup").attr("src",rs.exportAddOnServiceConfiguratorExcel+"&"+$.param(_post));
						$("#excelPopup").attr("onload",myvmware.config.cmn.afterExport);
						if(typeof riaLinkmy!="undefined"){
							if(partnerType.toUpperCase()=="RESELLER")
								riaLinkmy('configreseller:addonpreview:export');
							else if (partnerType.toUpperCase()=="DISTI")
								riaLinkmy('configdisti:addonpreview:export');
						}
					});
					// Reattaching the tooltip for info icon -- Added by Sathya
					$("#ConfigPreview a.fn_tooltip").accessibleTooltip({topOffset: 30,leftOffset: -90,associateWithLabel:false,preContent: "<div class='arrow bottom'></div>"});
					// Checking the condition for enabling and disabling Quote Btn -- Added By Sathya
					if (rs.isStandardUser.toLowerCase()=="true" && rs.quotationToolFlag=="Y"){
						$("#getQuote").removeClass("hidden");
						myvmware.config.cmn.loadQuoteContent();							
					}
					(data.showPrePayMsg) ? $("#ConfigPreview").find(".note").show() : $("#ConfigPreview").find(".note").hide();
					if(typeof riaLinkmy!="undefined"){
						if(partnerType.toUpperCase()=="RESELLER")
							riaLinkmy('configreseller:addonpreview');
						else if (partnerType.toUpperCase()=="DISTI")
							riaLinkmy('configdisti:addonpreview');
					}
				},
				onClose:function(){
					$("#progress").removeClass("s3").addClass("s2");
					vmf.modal.hide();
					// Replacing button and div with tooltip class to an anchor tag for reattaching the tooltip functionality -- Added by Sathya
					$("#ConfigPreview .tooltip").remove();
					$("#ConfigPreview .priceHolder").prepend('<a class="tooltip fn_tooltip nomargin" data-tooltip-position="config-bottom" title="'+rs.totalMonthlyCostToolTip+'"></a>');
				}
			});
			$(window).resize();
			$("#serviceConfigPreviewTable").find("tbody tr td span").click(function(){
				setTimeout(function(){
					$(window).resize();
				},10);
			});
			var table = $("#serviceConfigPreviewTable");
			if(table.height() > "93") {
				var element = table.closest("div.dataTables_scrollBody").prev("div.dataTables_scrollHead");
				element.find("table thead tr th:last-child").removeAttr("style");
				element.find("table thead tr th:first-child").width("479px");
			}
		},
		/*failExport: function(jData){
			if(jData != null && !jData.status) myvmware.sdp.cmn.showErrorModal(jDatas.error_MESSAGE);
		},*/
		buildServicePreviewTable: function(data){
			vmf.datatable.build($('#serviceConfigPreviewTable'),{
				"bPaginate": false,
				"bFilter": false,
				"bInfo":false,
				"aoColumns": [
					{"sTitle": "<span>"+rs.sService+"</span>","sWidth":"320px","bSortable":false},
					{"sTitle": "<span>"+rs.qty+"</span>","sWidth":"40px","bSortable":false,"sClass":"normal"},
					{"sTitle": "<span>"+rs.supportLevelLabel+"</span>","sWidth":"50px","bSortable":false,"sClass":"normal","bVisible":((rs.horizon) ? true : false)},
					{"sTitle": "<span>"+rs.payType+"</span>","sWidth":"90px","bSortable":false,"sClass":"normal"},
					{"sTitle": "<span>"+rs.unitCost+"</span>","sWidth":"100px","bSortable":false,"bVisible":((rs.isStandardUser.toLowerCase()=="true") ? true : false),"sClass":"normal"},
					{"sTitle": "<span>"+rs.extCost+"</span>","sWidth":"100px","bSortable":false,"bVisible":((rs.isStandardUser.toLowerCase()=="true") ? true : false),"sClass":"normal"},
					{"sTitle": "","bVisible":false}
				],
				"aaData": data,
				"bSort": false,
				"bServerSide": false,
				"bProcessing":false,
				"sScrollY":"130px",
				"fnRowCallback": function(nRow,aData,iDisplayIndex){
					var hClass = '';
					if(data.length == 1){
						hClass = '';
						$(nRow).find("td:eq(0)").html("<div><span class='core'>"+aData[7]+"</span><span>"+aData[0]+"</span></div><div class='clear desc'>"+aData[6]+"</div>");
					}else if(data.length > 1){
						hClass = (iDisplayIndex==0) ? "openclose" : "hidden";

						$(nRow).find("td:eq(0)").html("<span class='icon "+hClass+"'>&nbsp;</span><div><span class='core'>"+aData[7]+"</span><span>"+aData[0]+"</span></div><div class='clear desc'>"+aData[6]+"</div>");
					}
					return nRow;
				},
				fnDrawCallback: function(){
					if(data.length>1){
						$(this).find("tbody tr:not(':first-child')").addClass("hidden").end().addClass("moreServices");
					}
					var tbody = $(this).find("tbody"), scroll = $(this).closest(".dataTables_scrollBody");
					if (tbody.height() < scroll.height()) scroll.height(tbody.height());
				}
			});
		},
		buildAddonPreviewTable: function(data){
			vmf.datatable.build($('#addOnPreviewTable'),{
				"bPaginate": false,
				"bFilter": false,
				"bInfo":false,
				"aoColumns": [
					{"sTitle": "<span>"+rs.addConf+"</span>","sWidth":"340px","bSortable":false},
					{"sTitle": "<span>"+rs.qty+"</span>","sWidth":"40px","bSortable":false,"sClass":"normal"},
					{"sTitle": "<span>"+rs.supportLevelLabel+"</span>","sWidth":"50px","bSortable":false,"sClass":"normal", "bVisible":((rs.horizon) ? true : false)},
					{"sTitle": "<span>"+rs.payType+"</span>","sWidth":"90px","bSortable":false,"sClass":"normal"},
					{"sTitle": "<span>"+rs.unitCost+"</span>","sWidth":"100px","bSortable":false,"sClass":"normal"},
					{"sTitle": "<span>"+rs.extCost+"</span>","sWidth":"100px","bSortable":false,"sClass":"normal"},
					{"sTitle": "","bVisible":false},
					{"sTitle": "","bVisible":false},
					{"sTitle": "","bVisible":false},
					{"sTitle": "","bVisible":false}
				],
				"aaData": data,
				"bServerSide": false,
				"bProcessing":false,
				"bSort": false,
				"sScrollY":"230px",
				"fnRowCallback": function(nRow,aData,iDisplayIndex){
					$(nRow).find("td:eq(0)").html("<div class='baseSkuInfo'><span class='addon'>"+aData[0]+"</span><span>"+aData[6]+"</span><div class='addonskuDesc'>"+aData[7]+"</div></div>");	
					if(rs.horizon){
						$(nRow).find("td:eq(3)").html("<div class='unit'>"+aData[3]+"</div>");
						$(nRow).find("td:eq(4)").html("<div class='ext'>"+aData[4]+"</div>");
					} else {
						$(nRow).find("td:eq(3)").html("<div class='unit'>"+aData[4]+"</div>");
						$(nRow).find("td:eq(4)").html("<div class='ext'>"+aData[5]+"</div>");
					}
					var support = (typeof aData[9] == "string") ? vmf.json.txtToObj(aData[9]) : aData[9];
					if (support && support.length){
						$(nRow).addClass("withSupport").find("td:eq(0)").append("<div><span class='supportSkuDesc'>"+support[6]+" - "+ support[7]+"</span></div>").end().find("td:eq(3)").append("<div class='unit'>"+support[4]+"</div>").end().find("td:eq(4)").append("<div class='ext'>"+support[5]+"</div>");
					}
					$(nRow).attr("sid",aData[0]);
					return nRow;
				},
				fnDrawCallback:function(){
					$(this).closest(".dataTables_scroll").addClass("bottomarea");
					/*$.each($('#addOnPreviewTable tbody tr'),function(){
						if($(this).hasClass("duplicate")){
							$("tr[sid='"+$(this).attr("category")+"']",$("#addOnPreviewTable")).addClass("withSupport").find("td:eq(0)").append("<div><span class='supportSkuDesc'>"+$(this).data("skuID")+" - "+$(this).data("sku")+"</span></div>").end().find("td:eq(3)").append("<div class='unit'>"+$(this).data("unit")+"</div>").end().find("td:eq(4)").append("<div class='ext'>"+$(this).data("ext")+"</div>");
							$(this).hide();
						}
					});*/
					//ac.categoryMap=[];
					if($("#addOnPreviewTable tbody").height() < $("#addOnPreviewTable_wrapper .dataTables_scrollBody").height()){
						$("#addOnPreviewTable_wrapper .dataTables_scrollBody").height($("#addOnPreviewTable tbody").height()+1+"px");
					}
				},
				fnInitComplete: function(){
					myvmware.config.cmn.adjustHt();
				}
			});
		}
	}, // aConfig

	"rConfig":{ // renewal
		init:function(){
			rc = myvmware.config.rConfig;
			rc.subTable=[];
			rc.bindEvents();
			myvmware.sdp.cmn.events();
			myvmware.config.cmn.events();
			myvmware.config.cmn.addBreadScrumbDetails();

			callBack.addsc({
				f: 'riaLinkmy',
				args: [
					'config' + partnerType.toLowerCase() + ':renewalsearch:' + rs.tenantType
				]
			})
			$.fn.selectOne = function(options) {
				var o = this.o = {}
				$.extend(o, {
					$container: this,
					$select: $('select', this), // showing for multiple selections
					$span: $('span', this), // showing for only one selection
					list: [
						// [ val0, html0 ], ...
					]
				}, options);
				o.$select.length || ( // defaulting elements
					o.$select = $('<select style="width:100%"/>').prependTo(this)
				)
				o.$span.length || (
					o.$span = $('<span/>').appendTo(this)
				)
				o.$select.empty().append(
					o.disableSelectOneOption || (
						$('<option/>').text(rs.Select_One)
					),
					$.map(o.list, function(v) {
						return $('<option/>').val(v[0]).html(v[1])[0]
					})
				)[
					o.list.length > 1 ? 'show' : 'hide'
				]();
				o.$span[
					o.list.length > 1 ? 'hide' : 'show'
				]();
				return o.$container.unbind('.rdd').bind({
					'revert.rdd': function(e, option) {
						$.extend(o, option)
						o.$select.val(
							o.list.length && (
								o.list.length > 1 ? o.revertValue : o.list[0][0]
							) || (
								rs.Select_One
							)
						).trigger('change')
						var selectionHtml = $('option:selected', o.$select).html() // copying html to span
						o.$span.html(
							selectionHtml === rs.Select_One ? '--' : (
								selectionHtml || '--'
							)
						)
						return o.$container
					},
					'isModified.rdd': function() {
						return o.$select.val() !== o.revertValue
					}
				})
			} // selectOne
		}, // init
		renewalBuildPayDropDown: function(options){
			var opt=options.split(","),optArr=["<option value='' selected='selected'>" + rs.Select_Payment + "</option>"];
			$.each(opt,function(i,v){
				optArr.push("<option value='"+v+"'>"+v+"</option>");
			})
			return optArr.join("");
		},
		renewalBuildSku : function(addons) {
			var oTxt = tierTxt = supportTxt = emptyTierTxt = sadd = '', addonTierArr=[], supportTier = [], rsaMsg;
			myvmware.config.cmn.noTierArr = [];
			$.each(addons, function(index,value){
				sadd+='<tr class="even noCheck" aid="'+index+'" sid="'+index+'"><td class="c1"><span class="aType">'+index+'</span></td><td class="c2"></td><td class="c3"></td></tr>';
				if(value.length) {
					$.each(value, function(index1, value1){
						supportTxt = '';
						if(value1[6]=="1") { // Checking for One Time
							oTxt = value1[3]; // One Time Txt
							tierTxt = ''; // No Support Skus and Tiers
						} else {
							addonTierArr = myvmware.config.cmn.tiersArray(value1[5], index);
							
							if(value1[7]!='') { // Adding Support SKUs and Tiers
								supportTier = myvmware.config.cmn.tiersArray(value1[7][5], index);
								supportTxt = '<div class="skutiercont"><div class="supportSkuDesc">'+value1[7][4]+'</div></div><div class="tierHolder">'+supportTier+'</div>';		
							}
							oTxt = '<select class="payType">'+rc.renewalBuildPayDropDown(value1[3])+'</select>'; // Select Box
							if(!(addonTierArr.length > 0)){
								tierTxt = '';
								if(index1 == (value.length - 1))		//only for the last phantom
									addonTierArr = "<span class='noTier'>"+rs.noTiersMsg+" "+index+"</span>"
							}
							if(myvmware.config.cmn.noTierArr.length){
								$.each(myvmware.config.cmn.noTierArr,function(i,j){
									emptyTierTxt = "<div class='emptyTier'><span class='alertIcon21 fLeft'></span> "+rs.tierInfoMissing+" </div>";
								});
								myvmware.config.cmn.noTierArr = [];
							} else {
								emptyTierTxt = '';
							}
							tierTxt = '<tr class="odd tHolder" sid="'+index+'_tHolder" aid="'+index+'"><td colspan="3"><div class="tierHolder">'+addonTierArr+'</div>'+supportTxt+emptyTierTxt+'</td></tr>'; //Support SKUs and Tiers			
						}
						if(value1[8] != '' && value1[8] != 'undefined' && value1[8] != undefined) {
							rsaMsg = '<tr class="odd tHolder" sid="'+index+'_tHolder" aid="'+index+'"><td colspan="3"><div class="autoClose info"><p>'+value1[8]+'</p></div></td></tr>';
						} else {
							rsaMsg = '';
						}
						sadd+='<tr class="odd withCheck" sid="'+index+'_desc" aid="'+index+'"><td class="c1"><input type="checkbox" name="add-on" id="'+value1[0]+'"/> <span class="aType">'+value1[4]+'</span></td><td class="c2"><span class="qtyHolder"><span>' + rs.qty + '</span> <input type="text" size="4" maxlength="3" value="'+value1[2]+'" class="qty"></span><span class="errorLabel hidden">'+rs.validateQtyMsg+'</span></td><td class="c3"><label class="payType">'+oTxt+'</label><span class="errorLabel hidden">'+rs.validatePayMsg+'</span></td></tr>'+tierTxt+rsaMsg;
					});
				}	else {
					return true;
				}
				$("#addOnTable").html(sadd);
			});
		},
		bindEvents: function(){
				$(".search input:text").val("").removeAttr("disabled").bind("keyup",function(event){
				if(event.keyCode == 13){
					if (!$("#searchBtn").hasClass('disabled')){
						$("#searchBtn").click();
						}
				}
				if($.trim($(this).val()).length){
					var opts = $(this).closest(".ctrlHolder").siblings("div");
					opts.addClass("fade").find("input:text").attr("disabled","disabled").val("");
					$("#searchBtn").removeClass("disabled").removeAttr("disabled")
					$(this).closest(".ctrlHolder").addClass("active");
				} else {
					var opts = $(this).closest(".ctrlHolder").siblings("div");
					$(this).closest(".ctrlHolder").removeClass("active");
					opts.removeClass("fade").find("input:text").removeAttr("disabled");
					$("#searchBtn").addClass("disabled").attr("disabled","disabled");
				}
				if($(this).attr('id') == 'acntNum') {
					$('span.errorText').fadeOut();
					$(this).removeClass('errorOutline');
					var val = $(this).val();
					if(val != ''){
						if(!val.match(/^\d+$/)){
							$(this).addClass('errorOutline');
							$('span.errorText').attr('style', 'display:block');
							$("#searchBtn").addClass("disabled").attr("disabled","disabled");
						} else {
							$('span.errorText').fadeOut();
							$(this).removeClass('errorOutline');
						}
					}
				}
				
			}).bind('cut copy paste', function (e){ setTimeout(function(){$(e.target).trigger('keyup');},10)});
			
			$("#searchBtn").bind("click",function(){
				var selectedOption;
				$.each($("form#searchForm").find("input:text"),function(i,v){
					if ($.trim($(v).val()).length) {selectedOption = $(v).attr("criteria") ; return false;}				
				});
				vmf.ajax.post(rs.getSearchResults,$("#searchForm").serialize()+"&productFamilyCode="+escape(rs.productFamilyCode),rc.displayResults,rc.noResults,
				function(){$("#loadingDiv").addClass("hidden")},
				300000,
				function(){$("#loadingDiv").removeClass("hidden");$("#results,#noData").fadeOut()});
				if(typeof riaLinkmy!="undefined"){
					if(partnerType.toUpperCase()=="RESELLER")
						riaLinkmy('configreseller:renewalsearch:'+selectedOption);
					else if (partnerType.toUpperCase()=="DISTI")
						riaLinkmy('configdisti:renewalsearch:'+selectedOption);
				}
			});
			
			$("#resultSet .toggle").live("click",function(e){
				e.preventDefault();
				var o = $(this), $row=$(this).closest("div.row"),row=$row[0];
				if (o.hasClass('minus')){
					o.removeClass('minus').html("+ "+rs.show);
					$row.removeClass("active").next("div.more-details").fadeOut();
				}else{
					o.addClass('minus').html("- "+rs.hide);
					$row.addClass("active");
					if(!row.haveData){
						rc.expandRow($row);
						row.haveData=true;
					} else
						$row.next("div.more-details").fadeIn();
				}
			});
			
			$("input:radio[name='sDetail']").live("click",function(){
				$("#aNext").removeClass("disabled").removeAttr("disabled");
			});


			if (rs.sourcePage) {
				$("#step1,#noData").fadeOut();
				vmf.ajax.post(rs.getAddOnData, {


					"_VM_selectedEaNumber": rs.eaNumber,
					"_VM_serviceID": rs.serviceID
				}, function(data) {
							rc.buildAddOn(data)
							$('.header-core-data .buttonbar').fadeOut()
						}, rc.failBuildAddOn, function() {
					vmf.loading.hide();
				}, 300000, function() {
					vmf.loading.show();
				});
			} else {
				$("#progress,#step1,#step2 #toStep1").fadeIn();
				$("#aNext").live("click", function() {
					var _selected = $("input:radio['name'='sDetail']:checked").closest("tr");
					vmf.ajax.post(
						rs.getAddOnData, {
							"_VM_selectedEaNumber": _selected.data("acc"),
							"_VM_serviceID": _selected.data("id")
						}, function(data) {
							rc.buildAddOn(data)
							$('.header-core-data .buttonbar').fadeOut()
						}, rc.failBuildAddOn,
						function() {
							vmf.loading.hide();
						}, 300000,
						function() {
							vmf.loading.show();
						}
					);
				});
			}

			$("#serviceConfigPreviewTable .openclose").live("click",function(){
				if($(this).hasClass("minus")){
					$(this).removeClass("minus").closest("table").find("tr:not(:first-child)").addClass("hidden").end().closest(".dataTables_scrollBody").css("height","80px");
				} else {
					$(this).addClass("minus").closest("table").find("tbody tr").removeClass("hidden").end().closest(".dataTables_scrollBody").css("height","130px");
				}
			});
			
			/*$('#addOnTable input.qty, #addOnTable select.payType').live('change', function() {
				var $parenttr = $(this).closest('tr');
				$('span.errorLabel', $parenttr).removeClass("err").addClass("hidden")
				$('.errorOutline', $parenttr).removeClass('errorOutline')

				var qty = parseInt(
					$('input.qty', $parenttr).val()
					
				), payType = ($('select.payType', $parenttr).length) ? $('select.payType', $parenttr).val() : $('label.payType', $parenttr).html();
				$parenttr[qty && payType ? 'addClass' : 'removeClass']('active');
				$('input:checkbox', $parenttr)[0].checked = qty || payType;
			});*/
			$('#addOnTable input:text, #addOnTable select').live('change',function(){
				var $this = $(this),
					$parenttr = $this.closest('tr'),
					$qty = $parenttr.find('input:text').val() * 1,
					$type = $parenttr.find('select').val(),
					$errorSpan = $parenttr.find('span.errorLabel'),
					$errorOutline = $parenttr.find('.errorOutline'),
					$checkBox = $parenttr.find('input:checkbox');
				
				$parenttr.removeClass('active');
				$checkBox.removeAttr('checked');
				$errorSpan.removeClass('err').addClass('hidden');
				$errorOutline.removeClass('errorOutline');

				if(($qty <= 0) && ($type == "" || $type == undefined)) {
					$parenttr.removeClass('active');
					$checkBox.removeAttr('checked');
				} else if(($type != "" || $qty > 0) && (!$checkBox.attr('checked'))) {
					$parenttr.addClass('active');
					$checkBox.attr('checked', 'checked');
				}
			});

			$("#s2Apply").live("click", function() {
				var addons = $("#addonSection input:checkbox:checked"), f=true, qty;
				$.each(addons,function(i,v){
					qty = $(v).closest("tr").find("input.qty"), pay = $(v).closest("tr").find("select.payType");
					if(qty.val()=="0" || qty.val()==""){
						f=false;
						qty.addClass('errorOutline').parent().siblings("span.errorLabel").addClass("err").removeClass("hidden");
					} else {
						qty.removeClass('errorOutline').parent().siblings("span.errorLabel").removeClass("err").addClass("hidden");
					}
					if(pay.val()==""){
						f=false;
						pay.addClass("errorOutline").parent().siblings("span.errorLabel").addClass("err").removeClass("hidden");
					} else {
						pay.removeClass("errorOutline").parent().siblings("span.errorLabel").removeClass("err").addClass("hidden");
					}
				});

				if(f){
				

					vmf.ajax.post(
						rs.getReviewPage,
						$.extend({}, rc.getCorePost(), rc.getAddonPost()),
						rc.showPreview,
						rc.failedPreview,
						function() {
							vmf.loading.hide()
						},
						300000,
						function() {
							vmf.loading.show()
						}
					);
					riaLinkmy && riaLinkmy(
						'config' + partnerType.toLowerCase() + ':renewalmodify:' + (
							addons.length ? 'withaddon' : 'withoutaddon'
						)
					)
				}
			}); // click s2Apply
			

			$('#coreSelection select, #sTerm select, #paymentType select, #priceListUsed select, #currency2 select ').live('change', function() {
				$(this).closest('label').next('.errorLabel').removeClass("err").addClass("hidden")
				$('span.coreConfigResponse').fadeOut()
				$('.header-core-data .buttonbar').fadeIn()
				
				var isModified, $this = $(this);	
				if(($this.attr('id') == 'rcchoosePriceDropdown') && ($this.val() != $this.attr('default-value'))){					
						isModified = true
				}
				else if(($this.attr('id') == 'rcChooseCurrencyDropdown') && ($this.val() != $('#selCur').val())){	
						isModified = true
				}
				else{
						isModified = rc.isCoreModified();
				}
				$('button#coreModify')[
					isModified ? 'removeClass' : 'addClass'
				]('disabled')[0].disabled = !isModified

				$('#s2Apply')[
					isModified ? 'addClass' : 'removeClass'
				]('disabled')[0].disabled = isModified
			});
			$('button#coreRestore').live('click', function() {
				$("#aNext").trigger('click')
			})
			$('button#coreModify').live('click', function() {
				var err = false; // validating input
				if($('#rcchoosePriceDropdown').val() == ''){
					err = true;
					$('#rcchoosePriceDropdown').closest('td').find('.errorLabel').removeClass('hidden').addClass('isNotSelected');}
				else{				
					$('#rcchoosePriceDropdown').closest('td').find('.errorLabel').removeClass('isNotSelected').addClass('hidden');
				}	
				if($('#selCur').val() == ''){
					err = true;
					$('#selCur').closest('td').find('.errorLabel').removeClass('hidden').addClass('isNotSelected');}
				else{				
					$('#selCur').closest('td').find('.errorLabel').removeClass('isNotSelected').addClass('hidden');
				}						
				$('select', '#coreSelection, #sTerm, #paymentType').each(function() {
					var $mySelect = $(this),
						isNotSelected = $mySelect.is(':visible') && (
							$mySelect.val() === 'Select one'
						);
					$mySelect.closest('label').next(".errorLabel")[
						isNotSelected ? 'addClass' : 'removeClass'
					]('err')[
						isNotSelected ? 'removeClass' : 'addClass'
					]('hidden')
					isNotSelected && (
						err = true
					)
				})
				
				if (err) return;

				var renewingCore = rc.cHead.crossRefSKUMap[[$('#coreSelection select').val(),$('#sTerm select').val(),$('#paymentType select').val()].join('_')];

				if(renewingCore[1] == "0"){
					$('#coreSelection').parent().next().addClass('err').removeClass('hidden').html(rs.nonRenewableCoreMsg);
					return;
				}
				vmf.ajax.post(
					rs.getAddOnData,
					rc.getCorePost(),
					function(data) {
						if (data.ERROR_CODE) { // handling response messages
							$('span.coreConfigResponse', 'table#coreConfig').html(data.ERROR_MESSAGE).removeClass('success').addClass('error').fadeIn(function(){$(this).css("display","inline-block")});
						} else {
							rc.buildAddOn(data);
							$('span.coreConfigResponse', 'table#coreConfig').html(rs.successMsg).removeClass('error').addClass('success').fadeIn(function(){$(this).css("display","inline-block")});
							$.isEmptyObject(rc.addOnConfig.addons) ||
								$('span.coreConfigResponse', '#addonSection')
									.html(rs.successMsgAddons)
									.removeClass('error')
									.addClass('success')
									.fadeIn();
							$('.header-core-data .buttonbar').fadeIn()
						}
					},
					rc.failBuildAddOn,
					function() {
						vmf.loading.hide();
					},
					300000,
					function() {
						$('span.coreConfigResponse').fadeOut();
						$('span.coreConfigResponse').fadeOut()
						vmf.loading.show();
					});
				riaLinkmy && riaLinkmy(
					'config' + partnerType.toLowerCase() + ':renewalmodify:modifycore'
				);
			}); // click coreModify
			
		},
		isCoreModified: function() {
			var isModified = false;
			$('#coreSelection, #sTerm, #paymentType').each(function() {
				if ($(this).triggerHandler('isModified')) {
					isModified = true
					return false // breaking loop
				}
			})	
			return isModified
		},
		expandRow: function($row){
			var sOut = [];
			sOut.push('<div class="more-details"><table class="file_details_tbl" id="'+ ("child-table1-" + $row.attr("id")) + '" style="width:100%"></table></div>');
			$row.after(sOut.join(''));
			var $subTable = $("#child-table1-" + $row.attr("id"));
			var cdata = rc.subTable[$row.attr("val")];
			vmf.datatable.build($subTable,{
				"aoColumns": [
					{"sTitle": "","sWidth":"8px","bSortable":false},
					{"sTitle": "","sWidth":"8px","bSortable":false},
					{"sTitle": "<span>"+rs.sId+"</span>","sWidth":"105px","bSortable":false},
					{"sTitle": "<span>"+rs.sType+"</span>","sWidth":"150px","bSortable":false},
					{"sTitle": "<span>"+rs.region+"</span>","sWidth":"100px","bSortable":false},
					{"sTitle": "<span>"+rs.tEnd+"</span>","sWidth":"100px","bSortable":false},
					{"sTitle": "<span>"+rs.rTerm+"</span>","sWidth":"80px","bSortable":false}
				],
				"aaData":cdata,
				"error":myvmware.sdp.cmn.dataTableError,
				"bInfo":false,
				"bSort": false,
				"bAutoWidth":false,
				"bServerSide": false,   
				"bFilter":false,
				"bPaginate": false,
				"fnRowCallback": function(nRow,aData,iDisplayIndex){
					var $nRow=$(nRow);
					$nRow.find("td:eq(0)").html("<input type='radio' name='sDetail' />");
					$nRow.find("td:eq(1)").html("<span class=\"openclose\"></span>").end().data({"id":aData[2],"acc":$row.attr("val")});
					$(nRow)[0].idx = iDisplayIndex;
					return nRow;
				},
				"fnInitComplete":function(){
					var dtd=this;
					$(dtd).find(".openclose").bind("click", function(e){
						e.preventDefault();
						rc.expandRow2($(this),dtd);
					}); 
					//if(!dtd.find('tfoot').length) $(dtd).append('<tfoot><tr><td class="bottomarea" colspan="5"></td></tr></tfoot>');
				}
			});
		},
		expandRow2 :function(o,t){
			 nTr1 = o[0].parentNode.parentNode;
			if (o.hasClass('minus')){
				o.removeClass('minus');
				$(nTr1).removeClass("expanded noborder").next("tr").fadeOut();
			}else{
				o.addClass('minus');
				$(nTr1).addClass("expanded noborder");
				if(!nTr1.haveData){
					t.fnOpen(nTr1,rc.showloading(),'');
					rc.getCdata2($(nTr1), nTr1.idx);
					nTr1.haveData = true;
					$(nTr1).next("tr").addClass('more-detail');
				}else
					$(nTr1).next("tr").fadeIn();	
			}	
		},
		getCdata2:function(rowObj, idx){
			var sOut = [];
			sOut.push('<table class="file_details_tbl" id="'+ ("child-table2-" + rowObj.closest("table").attr("id")+ idx ) + '"></table>');
			$(nTr1).next("tr").addClass('more-detail').find("td").html(sOut.join(''));
			var $subTable = $("#child-table2-" + rowObj.closest("table").attr("id")+ idx);
			vmf.datatable.build($subTable,{
				"aoColumns": [
					{"sTitle": "<span>"+rs.SKU+"</span>","sWidth":"130px","bSortable":false},
					{"sTitle": "<span>"+rs.component+"</span>","sWidth":"270px","bSortable":false},
					{"sTitle": "<span>"+rs.orderType+"</span>","sWidth":"75px","bSortable":false},
					{"sTitle": "<span>"+rs.payType+"</span>","sWidth":"80px"},
					{"sTitle": "<span>"+rs.monthly_Remaining+"</span>","sWidth":"100px","bSortable":false},
					{"sTitle": "<span>"+rs.quantity+"</span>","sWidth":"50px","bSortable":false}
				],
				"sAjaxSource":rs.fetchSkuDetails+"&_VM_serviceID="+rowObj.data("id")+"&_VM_selectedEaNumber="+rowObj.data("acc"),
				"error":myvmware.sdp.cmn.dataTableError,
				"bInfo":false,
				"bServerSide": false,  
				"bSort": false,				
				"bAutoWidth":false,
				"bFilter":false,
				"bPaginate": false,
				"sPaginationType": "full_numbers",
				"fnInitComplete":function(){
					var dtd=this;
					//if(!dtd.find('tfoot').length) $(dtd).append('<tfoot><tr><td class="bottomarea" colspan="5"></td></tr></tfoot>');
				}
			})
		},
		showloading :function(){return sOut="<div class='loadWraper' style='text-align:center; padding-left:40%'><div class='loading_big'>" + rs.Loading + "</div></div>";},
		displayResults: function(data){
			if(typeof data !="object") data=vmf.json.txtToObj(data);
			if(typeof data.ERROR_CODE!="undefined"){
				$("#noData").fadeIn().find('.alertTitle').html(data.ERROR_MESSAGE);
				$("#results").fadeOut();
				return false;
			}
			data = vmf.getObjByIdx(data,0);
			var res = data.results,resArr=[],uniRecords = data.iTotalRecords || 0;
			$("#results .num").html(uniRecords); // Phase 2 - FR-SDP2-CON-113 - fixed;
			if(res.length>0) {
				$.each(res,function(i,v){
					resArr.push("<div class='clearfix row' id='row"+i+"' val='"+v[0]+"'><div class='wrap c1 '><span class='label'>"+rs.accNum+": </span><span class='val'>"+v[0]+"</span></div><div class='wrap c2'><span class='label'>"+rs.custName+": </span><span class='val'>"+v[1]+"</span></div><div class='wrap c3'><span class='label'>"+rs.contact+": </span><span class='val'>"+v[2]+"</span></div><div class='wrap c4'><span class='label'>"+rs.sIds+": </span><span class='val'>"+v[3]+"</span></div><div class='c5'><a href='javascript:void(0)' class='toggle'>+ " + rs.Show + "</a></div></div>");
				});
				rc.subTable=data.subaaData;
				$("#resultSet").html(resArr.join('')).show().closest("#results").show();
			} else {
				$("#resultSet").hide();
			}
			$("#aNext").addClass("disabled").attr("disabled",true);
			$("#results").fadeIn();
		},
		failBuildAddOn: function(data){
			$('span.coreConfigResponse', 'table#coreConfig').html(rs.failureMsg).removeClass('success').addClass('error').fadeIn(function(){$(this).css("display","inline-block")});
		},
		getCorePost: function() {
			var _selected = $("input:radio['name'='sDetail']:checked").closest("tr");
			return {
				_VM_selectedEaNumber: _selected.data("acc"),
				_VM_serviceID: _selected.data("id"),
				_VM_rateCardId: $('#priceListUsed select').val() || $("#soldBy").data("rateCardId"),
				_VM_coreSKU: rc.coreTenant = $('#coreSelection select').val(),
				_VM_corePaymentType: rc.paymentType = $('#paymentType select').val() ,
				_VM_serviceTerm: rc.sTerm = $('#sTerm select').val(),
				_VM_currency:$('#currency2 select').val(),				
				_VM_crosssku: rc.cHead.crossRefSKUMap[
					[
						$('#coreSelection select').val(),
						$('#sTerm select').val(),
						$('#paymentType select').val()
					].join('_')
				][0]
			}
		},
		getAddonPost: function() {
			var addon = [],
				qty = [],
				pay = [];
			$("tr.active", "#addOnTable").each(function(i, v) {
				addon.push($("input:checkbox", v)[0].id);
				qty.push($("input:text", v).val())
				pay.push(($(v).find("select").length) ? $(v).find("select").val() : $(v).find("label.payType").html());
			});
			return {
				_VM_baseSku: addon.join(","),
				_VM_qty: qty.join(","),
				_VM_paymentType: pay.join(","),
			}
		},
		selectPriceListDropdown:function(p,tempIndex,rateCardListConfig,currencyMap,currentCurrency,p){	
					var tempCurrencyArr = [], tempSelectCurrencyArr = [], defaultCurrency = '', tooltip = "";				
					if(rateCardListConfig[tempIndex][2].length>1){						
							tempSelectCurrencyArr.push("<select id='rcChooseCurrencyDropdown' class='rcChooseCurrencyDropdown' default-value=''><option value=''>"+rs.Select_One+"</option>");
							$.each(rateCardListConfig[tempIndex][2],function(i,k){								
								if( p == true && currentCurrency == k){									
									tempSelectCurrencyArr.push("<option data-key='"+k+"' name='currency' selected='selected' value='"+k+"'>"+currencyMap[k]+"</option>");
									defaultCurrency = k;
								}else{
									tempSelectCurrencyArr.push("<option data-key='"+k+"' name='currency' value='"+k+"'>"+currencyMap[k]+"</option>");
								}
							});
							if(partnerType == "RESELLER") {
								tooltip = '<a href="#" data-tooltip-position="right" title="'+rs.pricelistdropdowntooltip+'" class="tooltip fn_tooltip"></a>';
							}
							tempSelectCurrencyArr.push('</select>' + tooltip);
							$('#rcChooseCurrencyDropdown').attr('default-value',defaultCurrency);
							$("#currency2").html(tempSelectCurrencyArr.join("")).closest('td').find('.errorLabel').addClass('hidden');
							if(partnerType == "RESELLER") {
								myvmware.hoverContent.bindEvents('.fn_tooltip', 'epfunc','','', true);	
							}
							$('#selCur').val(defaultCurrency);
					}
					else{
						if(partnerType == "RESELLER") {
							tooltip = '<a href="#" data-tooltip-position="right" title="'+rs.pricelistdropdowntooltip+'" class="tooltip fn_tooltip"></a>';
						}
						$("#currency2").html('<select class="hidden"><option value="'+rateCardListConfig[tempIndex][2][0]+'">'+rateCardListConfig[tempIndex][2][0]+'</option></select>'+currencyMap[rateCardListConfig[tempIndex][2][0]] + tooltip).closest('td').find('.errorLabel').addClass('hidden');
						if(partnerType == "RESELLER") {
							myvmware.hoverContent.bindEvents('.fn_tooltip', 'epfunc','','', true);	
						}
						$('#selCur').val(rateCardListConfig[tempIndex][2][0]);
					}	
			
		},
		buildAddOn: function(data){
			typeof data === "object" || (
				data = vmf.json.txtToObj(data)
			);
			if (data.ERROR_CODE) {
				$("#noData").fadeIn().find('.alertTitle').html(data.ERROR_MESSAGE);
				return;
			}
			var cHead = rc.cHead = data.wrapper.header,
				addOnConfig = rc.addOnConfig = data.wrapper.addOnConfig,
				rateCardListConfig = rc.addOnConfig.rateCardList = data.wrapper.addOnConfig.rateCardList,
				serviceConfig = rc.serviceConfig = data.wrapper.serviceConfig,
				cmn = myvmware.config.cmn,
				ref = '#step2';
			$("#cName", ref).empty().append(
				cmn.isStandardUser ? cHead.companyName :
				$('<a/>').attr({
					href: rs.compNameUrl + "?" + (
						cmn.isReseller ? "_VM_selectedAccountNumber=" + cHead.customerAccount :
						"_VM_source=DISTI&_VM_selectedAccountNumber=" + cHead.prmId +
						"&_VM_selectedEaNumber=" + cHead.customerAccount
					),
					target: '_blank'
				}).append(cHead.companyName)
			)
			if(rs.isStandardUser.toLowerCase()!="true" && partnerType != 'DISTI'){
				var hoverText = $(".plcurrencyTooltip").attr("title"),
					hoverContentUpdated = hoverText.replace("#URL", rs.compNameUrl + "?" + (
						cmn.isReseller ? "_VM_selectedAccountNumber=" + cHead.customerAccount :
						"_VM_source=DISTI&_VM_selectedAccountNumber=" + cHead.prmId +
						"&_VM_selectedEaNumber=" + cHead.customerAccount) );
				$(".plcurrencyTooltip").attr("title", hoverContentUpdated);		
				myvmware.hoverContent.bindEvents('.fn_tooltip', 'epfunc','','', true);				
			}
			$("#cAccount", ref).html(cHead.customerAccount);
			$("#pContact", ref).empty().append(
				$('<a/>').attr({
					href: 'mailto:' + cHead.procContractEmail,
					title: cHead.procContractEmail,
					target: '_blank'
				}).append(cHead.procContract)
			);
			$("#serType", ref).html(cHead.serType)
			$("#soldBy", ref).html(addOnConfig.rateCardName).data("rateCardId", addOnConfig.rateCardId);
			$("#sID", ref).html(
				cmn.isStandardUser ? cHead.serviceID : "<a href='" + rs.serviceIDUrl + "&_VM_serviceID=" + cHead.encodedServiceID + "' target='_blank'>" + cHead.serviceID + "</a>"
				//cmn.isStandardUser ? cHead.serviceID : "<a href='" + rs.backURL + cHead.encodedServiceID + "' target='_blank'>" + cHead.serviceID + "</a>"
			)
			$("#sDate", ref).html(cHead.startDate);
			$("#rTerm", ref).html(cHead.remainTerm);
			$("#renew", ref).html(cHead.renewType);
			$('#termEnd', ref).html(cHead.endDate);
			$("#region2", ref).html(cHead.region);
			$("#priceListCurrency", ref).html(cHead.currencyMap[cHead.currency]);

			var coreServices = serviceConfig.coreServices;
			$('#coreSelection').die('change').live('change', function() {
				var selectedTenant = $('select', this).val(),
					paymentTermList = $.map(coreServices, function(v) {
						return v.tenantType === selectedTenant ? v.term : null
					});
				$("#sTerm").die('change').live('change', function() {
					// service-term-length ---> service-term-frequency
					var selectedPaymentLength = $('select', this).val(),
						paymentFrequencyList = $.map(paymentTermList, function(v) {
							return v[1] === selectedPaymentLength ? v[2].split(',') : null
						});
					$('#paymentType').selectOne({
						list: $.map(paymentFrequencyList, function(v) {
							return [
								[v, v]
							]
						})
					}).triggerHandler('revert', {
						revertValue: ''
					})
				}).selectOne({
					list: $.map(paymentTermList, function(v) {
						return [
							[v[1], v[0]]
						]
					})
				}).triggerHandler('revert', {
					revertValue: ''
				})
				/*$('#currency2, #priceListUsed').each(function(i, v) { // clear these
					$(v).triggerHandler('revert', {
						revertValue: ''
					})
				})*/
			}).selectOne({
				list: $.map(coreServices, function(v) {
					return [
						[v.tenantType, v.serviceName]
					]
				}),
				disableSelectOneOption: true
			}).triggerHandler('revert', {
				revertValue: cHead.coreService
			})

			$('#sTerm').triggerHandler('revert', {
				revertValue: cHead.serviceTerm
			})
			$('#paymentType').triggerHandler('revert', {				
				revertValue: cHead.paymentType
			})

			$("#sQty", ref).html(
				serviceConfig.aaData[0][2]
			)
			/*var currencyMap = cHead.currencyMap,
				currencyCodeList = Object.keys(currencyMap);

			$("#currency2").selectOne({
				list: $.map(currencyCodeList, function(v) {
					return [
						[v, currencyMap[v]]
					]
				})
			}).triggerHandler('revert', {
				revertValue: cHead.currency
			})
			var rateCardMap = addOnConfig.rateCardMap,
				rateCardIds = Object.keys(rateCardMap);

			$("#priceListUsed").selectOne({
				list: $.map(rateCardIds, function(v) {
					return [
						[v, rateCardMap[v]]
					]
				})
			}).triggerHandler('revert', {
				revertValue: addOnConfig.rateCardId
			})*/
			
			
			var currencyMap = cHead.currencyMap, currentCurrency = cHead.currency ;
			if(rateCardListConfig!=null && rateCardListConfig!=""){						
				var optArr = [];
				optArr.push("<div><select class=\"dPrice\" id='rcchoosePriceDropdown' default-value='"+addOnConfig.rateCardId+"'><option value=''>Select One</option>");
				$.each(rateCardListConfig, function(k,l){
				    if(addOnConfig.rateCardId == l[0] ){
						optArr.push("<option class='rcpriceListRadio' value='"+l[0]+"' selected='selected' data-index='"+k+"'>"+l[1]+"</option>");						
					}else{
						optArr.push("<option class='rcpriceListRadio' value='"+l[0]+"' data-index='"+k+"'>"+l[1]+"</option>");
					}
				});
				optArr.push("</select></div>");		
				$("#priceListUsed").html(optArr.join('')).closest('td').find('.errorLabel').addClass('hidden');				
				rc.selectPriceListDropdown($('#rcchoosePriceDropdown'),$('#rcchoosePriceDropdown option:selected').attr('data-index'),rateCardListConfig,currencyMap,currentCurrency,true);
				
			}
			$('#rcchoosePriceDropdown').change(function(){
					rc.selectPriceListDropdown($('#rcchoosePriceDropdown'),$('#rcchoosePriceDropdown option:selected').attr('data-index'),rateCardListConfig,currencyMap,currentCurrency,false);
			});			
			$('#rcChooseCurrencyDropdown').live('change',function(){
				$('#selCur').val($(this).val());
			});
			if(!cmn.isReseller){$('#priceListUsed').hide()}
			
			$("#currentCoreSKU", ref).html(serviceConfig.aaData[0][0])
			$("#currentCoreDescription", ref).empty().append(
				serviceConfig.aaData[0][1]
			)

			$("#addOnTable").html("");
			$("#step1, #noData").fadeOut();
			$("#step2").fadeIn();
			if (!$.isEmptyObject(addOnConfig.addons)) {
				rc.renewalBuildSku(addOnConfig.addons);
				$("#addOnTable").fadeIn();

				$("#noAddon").fadeOut();
				rc.chkAddOnQtyOnload();
			} else {
				$("#addOnTable").fadeOut();
				$("#noAddon").fadeIn();
			}

			$('span.coreConfigResponse').hide();
			$('span.coreConfigResponse').hide()

			$("#progress").removeClass("s3 s0").addClass("s2");

			riaLinkmy && riaLinkmy('config' + partnerType.toLowerCase() + ':renewalmodify')
		}, // buildAddOn
		chkAddOnQtyOnload: function() {
 			$('#addOnTable input:checkbox').each(function(i, v){
 				rc.checkRowActive.call(v)
 			})
		},
		checkRowActive: function() {
			var row = this;
			row.tagName === "TR" || (
				row = $(row).closest('tr')[0]
			)
			var qty = parseInt(
					$('input.qty', row).val(), 10
				),
				payType = $('select.payType', row).val()
			$(row)[qty && payType ? 'addClass' : 'removeClass']('active');
			$('input:checkbox', row)[0].checked = qty || payType;
		},
		showPreview: function(data){
			if (typeof data!="object") data=vmf.json.txtToObj(data);
			if (typeof data.ERROR_CODE!="undefined"){
				myvmware.config.cmn.showPreviewError(data);
				return;
			}
			data = vmf.getObjByIdx(data,0);
			$("#totalCost").html(data.totalCost).attr('data-currency',$("#currency2 select").val());
			if(!data.aaData.length && !data.addOnTable.length){
				$("#serviceConfigPreviewTable span.error").html(rs.errorMsg);
				return;
			}
			vmf.modal.show("ConfigPreview",{
				onShow: function(){
					rc.buildServicePreviewTable(data.aaData);
					if(data.addOnTable!=null && data.addOnTable.length)  rc.buildAddonPreviewTable(data.addOnTable);
					$("#progress").removeClass("s2").addClass("s3");
					$("#ConfigPreview").closest(".simplemodal-container").height($("#ConfigPreview").height())
					$.modal.setPosition();
					$("#export").fadeIn().removeAttr('disabled').unbind("click").bind("click", function() {
						$("#excelPopup").attr("src", rs.exportAddOnServiceConfiguratorExcel + "&" + $.param(
							$.extend({}, rc.getCorePost(), rc.getAddonPost())
						));

						$("#excelPopup").attr("onload", rc.afterExport);
						if (typeof riaLinkmy != "undefined") {
							if (partnerType.toUpperCase() == "RESELLER")
								riaLinkmy('configreseller:renewalpreview:export');
							else if (partnerType.toUpperCase()=="DISTI")
								riaLinkmy('configdisti:renewalpreview:export');
						}
					});
					// Reattaching the tooltip for info icon -- Added by Sathya
					$("#ConfigPreview a.fn_tooltip").accessibleTooltip({topOffset: 30,leftOffset: -90,associateWithLabel:false,preContent: "<div class='arrow bottom'></div>"});
					(data.showPrePayMsg) ? $("#ConfigPreview").find(".note").fadeIn() : $("#ConfigPreview").find(".note").fadeOut();
					if(typeof riaLinkmy!="undefined"){
						if(partnerType.toUpperCase()=="RESELLER")
							riaLinkmy('configreseller:renewalpreview');
						else if (partnerType.toUpperCase()=="DISTI")
							riaLinkmy('configdisti:renewalpreview');
					}
				},
				onClose:function(){
					$("#progress").removeClass("s3").addClass("s2");
					vmf.modal.hide();
					// Replacing button and div with tooltip class to an anchor tag for reattaching the tooltip functionality -- Added by Sathya
					$("#ConfigPreview .tooltip").remove();
					$("#ConfigPreview .priceHolder").prepend('<a class="tooltip fn_tooltip nomargin" data-tooltip-position="config-bottom" title="'+rs.totalMonthlyCostToolTip+'"></a>');
				}
			});
			$(window).resize();
		},
		afterExport:function(jData){
			var jd = vmf.json.txtToObj(jData);
			if(jd != null && !jd.status) myvmware.sdp.cmn.showErrorModal(jd.error_MESSAGE);
				//else $('#billStatement').attr('src',rs.url.downloadeCsvBillingStatements+"&serialID="+downloadUrl);
		},
		/*failExport: function(jData){
			if(jData != null && !jData.status) myvmware.sdp.cmn.showErrorModal(jDatas.error_MESSAGE);
		},*/
		buildServicePreviewTable: function(data){
			vmf.datatable.build($('#serviceConfigPreviewTable'),{
				"bPaginate": false,
				"bFilter": false,
				"bInfo":false,
				"aoColumns": [
					{"sTitle": "<span>"+rs.sService+"</span>","sWidth":"350px","bSortable":false},
					{"sTitle": "<span>"+rs.qty+"</span>","sWidth":"50px","bSortable":false,"sClass":"normal"},
					{"sTitle": "<span>"+rs.payType+"</span>","sWidth":"100px","bSortable":false,"sClass":"normal"},
					{"sTitle": "<span>"+rs.unitCost+"</span>","sWidth":"100","bSortable":false,"sClass":"normal"},
					{"sTitle": "<span>"+rs.extCost+"</span>","sWidth":"100px","bSortable":false,"sClass":"normal"},
					{"sTitle": "","bVisible":false}
				],
				"aaData": data,
				"bSort": false,
				"bServerSide": false,
				"bProcessing":false,
				"fnRowCallback": function(nRow,aData,iDisplayIndex){
					var hClass = '';
					if(data.length == 1){
						hClass = '';
						$(nRow).find("td:eq(0)").html("<div><span class='core'>"+aData[6]+"</span><span>"+aData[0]+"</span></div><div class='clear desc'>"+aData[5]+"</div>");
					}else if(data.length > 1){
						hClass = (iDisplayIndex==0) ? "openclose" : "hidden";

						$(nRow).find("td:eq(0)").html("<span class='icon "+hClass+"'>&nbsp;</span><div><span class='core'>"+aData[6]+"</span><span>"+aData[0]+"</span></div><div class='clear desc'>"+aData[5]+"</div>");
					}

					/*Bug -  56259 fixed;
					$(nRow).find("td:eq(0)").html("<span class='icon "+hClass+"'>&nbsp;</span><div><span class='core'>"+rs.core+"</span><span>"+aData[0]+"</span></div><div class='clear desc'>"+aData[4]+"</div>");*/
					
					return nRow;
				},
				fnDrawCallback: function(){
					// if(data.length>1){
						// $(this).find("tbody tr:not(':first-child')").addClass("hidden").end().addClass("moreServices");
					// }
					// var tbody = $(this).find("tbody"), scroll = $(this).closest(".dataTables_scrollBody");
					// if (tbody.height() < scroll.height()) scroll.height(tbody.height());
				}
			});
		},
		buildAddonPreviewTable: function(data){
			vmf.datatable.build($('#addOnPreviewTable'),{
				"bPaginate": false,
				"bFilter": false,
				"bInfo":false,
				"aoColumns": [
					{"sTitle": "<span>"+rs.addConf+"</span>","sWidth":"350px","bSortable":false},
					{"sTitle": "<span>"+rs.qty+"</span>","sWidth":"50px","bSortable":false,"sClass":"normal"},
					{"sTitle": "","bVisible":false},
					{"sTitle": "<span>"+rs.payType+"</span>","sWidth":"100px","bSortable":false,"sClass":"normal"},
					{"sTitle": "<span>"+rs.unitCost+"</span>","sWidth":"100px","bSortable":false,"sClass":"normal"},
					{"sTitle": "<span>"+rs.extCost+"</span>","sWidth":"100px","bSortable":false,"sClass":"normal"},
					{"sTitle": "","bVisible":false},
					{"sTitle": "","bVisible":false},
					{"sTitle": "","bVisible":false},
					{"sTitle": "","bVisible":false}
				],
				"aaData": data,
				"bServerSide": false,
				"bProcessing":false,
				"bSort": false,
				"sScrollY":"230px",
				"fnRowCallback": function(nRow,aData,iDisplayIndex){
					$(nRow).find("td:eq(0)").html("<div class='baseSkuInfo'><span class='addon'>"+aData[0]+"</span><span>"+aData[6]+"</span><div class='addonskuDesc'>"+aData[7]+"</div></div>");
					//$(nRow).find("td:eq(1)").html("<div class='qty'>"+aData[1]+"</div>");
					$(nRow).find("td:eq(3)").html("<div class='unit'>"+aData[4]+"</div>");
					$(nRow).find("td:eq(4)").html("<div class='ext'>"+aData[5]+"</div>");
					var support = (typeof aData[9] == "string") ? vmf.json.txtToObj(aData[9]) : aData[9];
					if (support && support.length)
						$(nRow).addClass("withSupport").find("td:eq(0)").append("<div><span class='supportSkuDesc'>"+support[6]+" - "+ support[7]+"</span></div>").end().find("td:eq(3)").append("<div class='unit'>"+support[4]+"</div>").end().find("td:eq(4)").append("<div class='ext'>"+support[5]+"</div>");
					$(nRow).attr("sid",aData[0]);
					return nRow;
				},
				fnDrawCallback:function(){
					$(this).closest(".dataTables_scroll").addClass("bottomarea");
					/*$.each($('#addOnPreviewTable tbody tr'),function(){
						if($(this).hasClass("duplicate")){
							$("tr[sid='"+$(this).attr("category")+"']",$("#addOnPreviewTable")).addClass("withSupport").find("td:eq(0)").append("<div><span class='supportSkuDesc'>"+$(this).data("skuID")+" - "+$(this).data("sku")+"</span></div>").end().find("td:eq(3)").append("<div class='unit'>"+$(this).data("unit")+"</div>").end().find("td:eq(4)").append("<div class='ext'>"+$(this).data("ext")+"</div>");
							$(this).hide();
						}
					});
					rc.categoryMap=[];*/
					if($("#addOnPreviewTable tbody").height() < $("#addOnPreviewTable_wrapper .dataTables_scrollBody").height()){
						$("#addOnPreviewTable_wrapper .dataTables_scrollBody").height($("#addOnPreviewTable tbody").height()+1+"px");
					}
				},
				fnInitComplete: function(){
					myvmware.config.cmn.adjustHt();
				}
			});
		}
	}, // rConfig

	"uConfig":{ // Upgrade
		init:function(){
			uc = myvmware.config.uConfig;
			uc.subTable=[];
			uc.bindEvents();
			uc.tierInfo = {};
			uc.paySupportSelected = {};
			myvmware.sdp.cmn.events();
			myvmware.config.cmn.events();
			myvmware.config.cmn.addBreadScrumbDetails();

			callBack.addsc({
				f: 'riaLinkmy',
				args: [
					'config' + partnerType.toLowerCase() + ':renewalsearch:' + rs.tenantType
				]
			})

			$.fn.selectOne = function(options) {
				var o = this.o = {}
				$.extend(o, {
					$container: this,
					$select: $('select', this), // showing for multiple selections
					$span: $('span', this), // showing for only one selection
					list: [
						// [ val0, html0 ], ...
					]
				}, options);
				o.$select.length || ( // defaulting elements
					o.$select = $('<select style="width:100%"/>').prependTo(this)
				)
				o.$span.length || (
					o.$span = $('<span/>').appendTo(this)
				)
				o.$select.empty().append(
					o.disableSelectOneOption || (
						$('<option/>').text(rs.Select_One)
					),
					$.map(o.list, function(v) {
						return $('<option/>').val(v[0]).html(v[1])[0]
					})
				)[
					o.list.length > 1 ? 'show' : 'hide'
				]();
				o.$span[
					o.list.length > 1 ? 'hide' : 'show'
				]();
				return o.$container.unbind('.rdd').bind({
					'revert.rdd': function(e, option) {
						$.extend(o, option)
						o.$select.val(
							o.list.length && (
								o.list.length > 1 ? o.revertValue : o.list[0][0]
							) || (
								rs.Select_One
							)
						).trigger('change')
						var selectionHtml = $('option:selected', o.$select).html() // copying html to span
						o.$span.html(
							selectionHtml === rs.Select_one ? '--' : (
								selectionHtml || '--'
							)
						)
						return o.$container
					},
					'isModified.rdd': function() {
						return o.$select.val() !== o.revertValue
					}
				})
			} // selectOne
		}, // init

		bindEvents: function(){
			$(".search input:text").val("").removeAttr("disabled").bind("keyup",function(event){
			if(event.keyCode == 13){
				if (!$("#searchBtn").hasClass('disabled')){
					$("#searchBtn").click();
				}
			}
			if($.trim($(this).val()).length){
				var opts = $(this).closest(".ctrlHolder").siblings("div");
				opts.addClass("fade").find("input:text").attr("disabled","disabled").val("");
				$("#searchBtn").removeClass("disabled").removeAttr("disabled")
				$(this).closest(".ctrlHolder").addClass("active");
			} else {
				var opts = $(this).closest(".ctrlHolder").siblings("div");
				$(this).closest(".ctrlHolder").removeClass("active");
				opts.removeClass("fade").find("input:text").removeAttr("disabled");
				$("#searchBtn").addClass("disabled").attr("disabled","disabled");
			}
			if($(this).attr('id') == 'acntNum') {
				$('span.errorText').fadeOut();
				$(this).removeClass('errorOutline');
				var val = $(this).val();
				if(val != ''){
					if(!val.match(/^\d+$/)){
						$(this).addClass('errorOutline');
						$('span.errorText').attr('style', 'display:block');
						$("#searchBtn").addClass("disabled").attr("disabled","disabled");
					} else {
						$('span.errorText').fadeOut();
						$(this).removeClass('errorOutline');
					}
				}
			}
				
			}).bind('cut copy paste', function (e){ setTimeout(function(){$(e.target).trigger('keyup');},10)});
			
			$("#searchBtn").bind("click",function(){
				var selectedOption;
				$.each($("form#searchForm").find("input:text"),function(i,v){
					if ($.trim($(v).val()).length) {selectedOption = $(v).attr("criteria") ; return false;}				
				});
				vmf.ajax.post(rs.getSearchResults,$("#searchForm").serialize()+"&productFamilyCode="+escape(rs.productFamilyCode),uc.displayResults,uc.nsoResults,
				function(){$("#loadingDiv").addClass("hidden")},
				300000,
				function(){$("#loadingDiv").removeClass("hidden");$("#results,#noData").fadeOut()});
				if(typeof riaLinkmy!="undefined"){
					if(partnerType.toUpperCase()=="RESELLER")
						riaLinkmy('configreseller:renewalsearch:'+selectedOption);
					else if (partnerType.toUpperCase()=="DISTI")
						riaLinkmy('configdisti:renewalsearch:'+selectedOption);
				}
			});
			
			$("#resultSet .toggle").live("click",function(e){
				e.preventDefault();
				var o = $(this), $row=$(this).closest("div.row"),row=$row[0];
				if (o.hasClass('minus')){
					o.removeClass('minus').html("+ "+rs.show);
					$row.removeClass("active").next("div.more-details").fadeOut();
				}else{
					o.addClass('minus').html("- "+rs.hide);
					$row.addClass("active");
					if(!row.haveData){
						uc.expandRow($row);
						row.haveData=true;
					} else
						$row.next("div.more-details").fadeIn();
				}
			});
			
			$("input:radio[name='sDetail']").live("click",function(){
				$("#aNext").removeClass("disabled").removeAttr("disabled");
			});


			if (rs.sourcePage) {
				$("#step1,#noData").fadeOut();
				vmf.ajax.post(rs.getAddOnData, {
					"_VM_selectedEaNumber": rs.eaNumber,
					"_VM_serviceID": rs.serviceID
				}, uc.buildAddOn, uc.failBuildAddOn, function() {
					vmf.loading.hide();
				}, 300000, function() {
					vmf.loading.show();
				});
			} else {
				$("#progress,#step1,#step2 #toStep1").fadeIn();
				$("#aNext").live("click", function() {
					var _selected = $("input:radio['name'='sDetail']:checked").closest("tr");
					vmf.ajax.post(
						rs.getAddOnData, {
							"_VM_selectedEaNumber": _selected.data("acc"),
							"_VM_serviceID": _selected.data("id")
						}, function(data) {
							uc.buildAddOn(data)
							$('.header-core-data .buttonbar').fadeOut()
						}, uc.failBuildAddOn,
						function() {
							vmf.loading.hide();
						}, 300000,
						function() {
							vmf.loading.show();
						}
					);
				});
			}

			$("#serviceConfigPreviewTable .openclose, #nonUpgradeableTable .openclose").live("click",function(){
				if($(this).hasClass("minus")){
					$(this).removeClass("minus").closest("table").find("tr:not(:first-child)").addClass("hidden").end().closest(".dataTables_scrollBody").css("height","86px");
				} else {
					$(this).addClass("minus").closest("table").find("tbody tr").removeClass("hidden").end().closest(".dataTables_scrollBody").css("height","130px");
				}
			});

			$('#addOnTable input:text, #addOnTable select').live('change',function(){
				var $this = $(this),
					$parenttr = $this.closest('tr'),
					$qty = $parenttr.find('input:text').val() * 1,
					$type = $parenttr.find('select').val(),
					$errorSpan = $parenttr.find('span.errorLabel'),
					$errorOutline = $parenttr.find('.errorOutline'),
					$checkBox = $parenttr.find('input:checkbox');
				
				$parenttr.removeClass('active');
				$checkBox.removeAttr('checked');
				$errorSpan.removeClass('err').addClass('hidden');
				$errorOutline.removeClass('errorOutline');

				if(($qty <= 0) && ($type == "" || $type == undefined)) {
					$parenttr.removeClass('active');
					$checkBox.removeAttr('checked');
				} else if(($type != "" || $qty > 0) && (!$checkBox.attr('checked'))) {
					$parenttr.addClass('active');
					$checkBox.attr('checked', 'checked');
				}
			});


			$('#coreSelection select, #sTerm select, #paymentType select, #currency2 select, #priceListUsed select').live('change', function() {
				$(this).closest('label').next('.errorLabel').removeClass("err").addClass("hidden")
				$('span.coreConfigResponse').fadeOut()
				$('.header-core-data .buttonbar').fadeIn()
				var isModified = rc.isCoreModified();
				$('button#coreModify')[
					isModified ? 'removeClass' : 'addClass'
				]('disabled')[0].disabled = !isModified

				$('#s2Apply')[
					isModified ? 'addClass' : 'removeClass'
				]('disabled')[0].disabled = isModified
			});
			$('button#coreRestore').live('click', function() {
				$("#aNext").trigger('click');
			});

			$('.showHideUpgrades').live('click', function(){
				if($(this).hasClass('hidding')){
					$(this).html(rs.hideUpgradeOptionsText);
					$(this).closest('tr').siblings().removeClass('hidden');
					$(this).removeClass('hidding').addClass('showing');
					$(this).closest('tr.mainTr').find('td:not(:first)').removeClass('last-col').addClass('bg-bottom');
				}
				else{
					$(this).html(rs.showUpgradeOptionsText);
					$(this).removeClass('showing').addClass('hidding');
					$(this).closest('tr').siblings().addClass('hidden');
					$(this).closest('tr.mainTr').find('td').removeClass('bg-bottom').addClass('last-col');
				}
			});

			$('.upgradeableServiceTable td.upgradeableSupportLevel select').live('change', function(){
				
				var selectedSupportLevel = $(this).val();
				var thisParent = $(this).closest('tr');
				thisParent.find('div.tierHolder').find('span.tierParent').addClass('hidden');
				
				if(selectedSupportLevel != ''){
					$('#upgradeServicesTables div.qtySupportErrorContainer').hide();
					$('.upgradeableServiceTable select.payType').removeClass('errorOutline');
					$(this).closest('td').find('.errorLabel').addClass('hidden');

					var thisParentName = thisParent.find('span.upgradeableProductSkuName').html();
					var mainParentId = thisParent.data('upgradeFrom');
					var mainParent = $('#' + mainParentId);
					var paymentType = mainParent.find('td.upgradeablePaymentType').html();
					var tierHolderString = paymentType + '_' + selectedSupportLevel;
					var paySupportMap = {};
					
					tierHolderString = tierHolderString.split(' ').join('_');
					thisParent.find('div.tierHolder').find('span.' + tierHolderString).removeClass('hidden');
					paySupportMap[thisParentName] = tierHolderString;
					uc.paySupportSelected[mainParentId] = paySupportMap;
					myvmware.config.cmn.enableDisable();
				}
			});

			$("#s2Apply").live("click", function(e){
				var mainObj = {}, i, j;
				var allQtyBoxes = $('.upgradeableServiceTable td.upgradeableQty input.upgradeToQty');
				var objToBePassed = {};
				var upgradeToTotalQty = {};
				var upgradeLevelQtys = {};
				var prodSupportLevels = {};
				var allParentNames = {};
				var flag = true, payTypeValue = '';
				
				$('.upgradeableServiceTable td.upgradeableQty input').removeClass('errorOutline');
				$('.upgradeableServiceTable select.payType').removeClass('errorOutline');
				$('.upgradeableServiceTable label.payType').removeClass('errorOutline');
				$('#upgradeServicesTables div.qtySupportErrorContainer').hide();
				$('span.errorLabel', '#upgradeServicesTables').addClass('hidden');
				//$('#upgradeServicesTables div.upgradeableServiceTblCont').removeClass('adjustMargin');

				var allUpgradeToRows = $('.upgradeableServiceTable .upgradeTo');

				for(var allRows = 0; allRows < allUpgradeToRows.length; allRows++){
					var qtyValueBox = $(allUpgradeToRows[allRows]).find('input.upgradeToQty');
					var qtyValue = qtyValueBox.val();
					var payTypeBox = $(allUpgradeToRows[allRows]).find('select.payType');
					payTypeValue = '';
					
					/*if(payTypeBox.length == 0){
						payTypeBox = $(allUpgradeToRows[allRows]).find('label.payType');
						payTypeValue = payTypeBox.html();
					}else{
					}*/
					payTypeValue = payTypeBox.val();

					if(payTypeValue != '' && qtyValue == 0 && payTypeBox.length != 0) {
						qtyValueBox.addClass('errorOutline');
						qtyValueBox.closest('td').find('.errorLabel').removeClass('hidden');
						flag = false;
					}else if(qtyValue != 0 && payTypeValue == '' && payTypeBox.length != 0) {
						payTypeBox.addClass('errorOutline');
						payTypeBox.closest('td').find('.errorLabel').removeClass('hidden');
						flag = false;
					}
				}

				if(flag){

					for(i= 0; i < allQtyBoxes.length; i++){
						
						var upgradeQty = parseInt($(allQtyBoxes[i]).val(), 10);
						var thisParent = $(allQtyBoxes[i]).closest('tr');
						var thisParentName = thisParent.find('span.upgradeableProductSkuName').html();
						var mainParentId = thisParent.data('upgradeFrom');
						var mainParent = $('#' + mainParentId);
						var mainParentName = uc.tierInfo[mainParentId]["productName"];
						var selectBox = thisParent.find('select.payType');
						allParentNames[mainParentName] = mainParentId;
						payTypeValue = '';

						if(upgradeQty > 0){
							
							if(selectBox.length == 0){
								selectBox = thisParent.find('label.payType');
								payTypeValue = $(selectBox).html();
							}else{
								payTypeValue = $(selectBox).val();
							}
							
							if(payTypeValue == ''){
								$(selectBox).addClass('errorOutline');
								myvmware.sdp.cmn.showErrorModal("Select support level.");
								return false;
							}else{
								if(prodSupportLevels[thisParentName] != undefined){
									if(prodSupportLevels[thisParentName] != payTypeValue){
										var errorContainer = $('#upgradeServicesTables').find('.qtySupportErrorContainer[data-upgradeFrom = "'+mainParentId+'"]');
										errorContainer.find('.qtySupportError').html("Support levels must be same for: " + thisParentName);
										errorContainer.show();
										return false;
									}
								} else {
									prodSupportLevels[thisParentName] = payTypeValue;
								}
							}
							
							if(upgradeToTotalQty[mainParentId] == undefined) {
								upgradeToTotalQty[mainParentId] = 0;
							}
							upgradeToTotalQty[mainParentId] += upgradeQty;

							var mainParentPaymentType = mainParent.find('td.upgradeablePaymentType').html();
							var currentPaySupportString = mainParentPaymentType + '_' + payTypeValue;
							var allTiers = uc.tierInfo[mainParentId][thisParentName][currentPaySupportString];


							if(allTiers != undefined && allTiers.length){
								var upgradeLevelQtyName = uc.tierInfo[mainParentId][thisParentName][currentPaySupportString][0]['crossSku'];
								if(upgradeLevelQtys[upgradeLevelQtyName] == undefined) {
									upgradeLevelQtys[upgradeLevelQtyName] = {};
									upgradeLevelQtys[upgradeLevelQtyName]['qty'] = 0;
								}
								upgradeLevelQtys[upgradeLevelQtyName]['qty'] += upgradeQty;


								var flag = true;
								var skuToBePassed = '';
								for(j = 0; j < allTiers.length; j++){
									if ((upgradeLevelQtys[upgradeLevelQtyName]['qty'] >= allTiers[j].min) && (upgradeLevelQtys[upgradeLevelQtyName]['qty'] <= allTiers[j].max)) {
										if((allTiers[j].crossSku == '') || (allTiers[j].price == '')){
											/*myvmware.sdp.cmn.showErrorModal("Pricing information does not exists for " + thisParentName);
											return false;*/
										}else {
											skuToBePassed = allTiers[j].crossSku;
											upgradeLevelQtys[upgradeLevelQtyName]['crossSku'] = skuToBePassed;
										}
										break;
									}
								}	
							} /*else {
								myvmware.sdp.cmn.showErrorModal("Pricing information does not exists for " + thisParentName);
								//return false;
							}*/

							if(objToBePassed[mainParentName] == undefined) {
								objToBePassed[mainParentName] = {};
							}

							if(objToBePassed[mainParentName][mainParentId] == undefined) {
								objToBePassed[mainParentName][mainParentId] = {};
								
							}

							if(objToBePassed[mainParentName][mainParentId][upgradeLevelQtyName] == undefined){
								objToBePassed[mainParentName][mainParentId][upgradeLevelQtyName] = {};
							}

							objToBePassed[mainParentName][mainParentId][upgradeLevelQtyName]["crossSku"] = skuToBePassed;
							objToBePassed[mainParentName][mainParentId][upgradeLevelQtyName]["qty"] = upgradeQty;
						}
					}

					var qtyCheck = uc.checkForExceedQty(upgradeToTotalQty), errorContainer = null;
					if(qtyCheck.flag == false){
						if(qtyCheck.highQtyProds.length > 1){
							for(var exQtyProds in qtyCheck.highQtyProds){
								errorContainer = $('#upgradeServicesTables').find('.qtySupportErrorContainer[data-upgradeFrom = "'+qtyCheck.highQtyProds[exQtyProds][0]+'"]');
								errorContainer.find('.qtySupportError').html("Total quantity must be " + qtyCheck.highQtyProds[exQtyProds][1] + " or less");
								errorContainer.show();
							}
						}else if(qtyCheck.highQtyProds.length == 1){
							errorContainer = $('#upgradeServicesTables').find('.qtySupportErrorContainer[data-upgradeFrom = "'+qtyCheck.highQtyProds[0][0]+'"]');
							errorContainer.find('.qtySupportError').html("Total quantity must be " + qtyCheck.highQtyProds[0][1] + " or less");
							errorContainer.show();
						}
						$(this).addClass('disabled').attr('disabled', 'disabled');
						return false;
					}

					var passThis = {};
					for(var mpname in objToBePassed){
						passThis[mpname] = {};
						for(var mpid in objToBePassed[mpname]){
							passThis[mpname][mpid] = {};
							for(var tpname in objToBePassed[mpname][mpid]){
								if(upgradeLevelQtys[tpname]['crossSku'] != undefined){
									passThis[mpname][mpid][upgradeLevelQtys[tpname]['crossSku']] = objToBePassed[mpname][mpid][tpname]['qty'];
								}else{
									passThis[mpname][mpid][tpname] = objToBePassed[mpname][mpid][tpname]['qty'];
								}
							}
						}
					}

					for(var allPar in allParentNames){
						if(passThis[allPar] == undefined){
							passThis[allPar] = {};
							passThis[allPar][allParentNames[allPar]] = {};
						}
					}

					uc.step2Step3String = {};
					var strObjToBePassed = JSON.stringify(passThis);
					var _selected = $("input:radio['name'='sDetail']:checked").closest("tr");
					uc.step2Step3String = strObjToBePassed;
						
					var rateCardIdContainer = $('#priceList select'), rateCardId = '', rateCardCurrency = '';
					if(!rateCardIdContainer.length){
						rateCardIdContainer = $('#priceList label');
						rateCardId = rateCardIdContainer.attr('data-value');
						rateCardCurrency = rateCardIdContainer.data('currency');
					}else {
						rateCardId = rateCardIdContainer.val();
						rateCardCurrency = rateCardIdContainer.find('option:selected').data('currency');
					}	

					var post = {
						"_VM_upgradeDetails": strObjToBePassed,
						"_VM_selectedEaNumber": _selected.data("acc"),
						"_VM_serviceID": _selected.data("id"),
						"_VM_rateCardId": rateCardId,
						"_VM_coreSKU": $('#coreSelection select').val(),
						"_VM_corePaymentType":  $('#paymentType select').val(),
						"_VM_serviceTerm":  $('#sTerm select').val(),
						"_VM_currency": rateCardCurrency
					};

					vmf.ajax.post(
						rs.getReviewPage,
						//$.extend({}, uc.getCorePost(), uc.getAddonPost()),
						post,
						uc.showPreview,
						uc.failedPreview,
						function() {
							vmf.loading.hide();
						},
						300000,
						function() {
							vmf.loading.show();
						}
					);
				}

				//Quote Tool Changes.
				$('#eaNo').val($('td#cAccount').text());
				$('#eaName').text($('td#cName').text()).closest('#eaNameDiv').show();
				/*riaLinkmy && riaLinkmy(
					'config' + partnerType.toLowerCase() + ':renewalmodify:' + (
						addons.length ? 'withaddon' : 'withoutaddon'
					)
				)*/
			});
		},
		isCoreModified: function() {
			var isModified = false;
			$('#coreSelection, #sTerm, #paymentType, #currency2, #priceListUsed').each(function() {
				if ($(this).triggerHandler('isModified')) {
					isModified = true
					return false // breaking loop
				}
			})
			return isModified
		},
		expandRow: function($row){
			var sOut = [];
			sOut.push('<div class="more-details"><table class="file_details_tbl" id="'+ ("child-table1-" + $row.attr("id")) + '" style="width:100%"></table></div>');
			$row.after(sOut.join(''));
			var $subTable = $("#child-table1-" + $row.attr("id"));
			var cdata = uc.subTable[$row.attr("val")];
			vmf.datatable.build($subTable,{
				"aoColumns": [
					{"sTitle": "","sWidth":"8px","bSortable":false},
					{"sTitle": "","sWidth":"8px","bSortable":false},
					{"sTitle": "<span>"+rs.sId+"</span>","sWidth":"105px","bSortable":false},
					{"sTitle": "<span>"+rs.sType+"</span>","sWidth":"150px","bSortable":false},
					{"sTitle": "<span>"+rs.region+"</span>","sWidth":"100px","bSortable":false},
					{"sTitle": "<span>"+rs.tEnd+"</span>","sWidth":"100px","bSortable":false},
					{"sTitle": "<span>"+rs.rTerm+"</span>","sWidth":"80px","bSortable":false}
				],
				"aaData":cdata,
				"error":myvmware.sdp.cmn.dataTableError,
				"bInfo":false,
				"bSort": false,
				"bAutoWidth":false,
				"bServerSide": false,   
				"bFilter":false,
				"bPaginate": false,
				"fnRowCallback": function(nRow,aData,iDisplayIndex){
					var $nRow=$(nRow);
					$nRow.find("td:eq(0)").html("<input type='radio' name='sDetail' />");
					$nRow.find("td:eq(1)").html("<span class=\"openclose\"></span>").end().data({"id":aData[2],"acc":$row.attr("val")});
					$(nRow)[0].idx = iDisplayIndex;
					return nRow;
				},
				"fnInitComplete":function(){
					var dtd=this;
					$(dtd).find(".openclose").bind("click", function(e){
						e.preventDefault();
						uc.expandRow2($(this),dtd);
					}); 
					//if(!dtd.find('tfoot').length) $(dtd).append('<tfoot><tr><td class="bottomarea" colspan="5"></td></tr></tfoot>');
				}
			});
		},
		expandRow2 :function(o,t){
			nTr1 = o[0].parentNode.parentNode;
			if (o.hasClass('minus')){
				o.removeClass('minus');
				$(nTr1).removeClass("expanded noborder").next("tr").fadeOut();
			}else{
				o.addClass('minus');
				$(nTr1).addClass("expanded noborder");
				if(!nTr1.haveData){
					t.fnOpen(nTr1,uc.showloading(),'');
					uc.getCdata2($(nTr1), nTr1.idx);
					nTr1.haveData = true;
					$(nTr1).next("tr").addClass('more-detail');
				}else
					$(nTr1).next("tr").fadeIn();	
			}	
		},
		getCdata2:function(rowObj, idx){
			var sOut = [];
			sOut.push('<table class="file_details_tbl" id="'+ ("child-table2-" + rowObj.closest("table").attr("id")+ idx ) + '"></table>');
			$(nTr1).next("tr").addClass('more-detail').find("td").html(sOut.join(''));
			var $subTable = $("#child-table2-" + rowObj.closest("table").attr("id")+ idx);
			vmf.datatable.build($subTable,{
				"aoColumns": [
					{"sTitle": "<span>"+rs.SKU+"</span>","sWidth":"130px","bSortable":false},
					{"sTitle": "<span>"+rs.component+"</span>","sWidth":"270px","bSortable":false},
					{"sTitle": "<span>"+rs.orderType+"</span>","sWidth":"75px","bSortable":false},
					{"sTitle": "<span>"+rs.payType+"</span>","sWidth":"80px"},
					{"sTitle": "<span>"+rs.monthly_Remaining+"</span>","sWidth":"100px","bSortable":false},
					{"sTitle": "<span>"+rs.quantity+"</span>","sWidth":"50px","bSortable":false}
				],
				"sAjaxSource":rs.fetchSkuDetails+"&_VM_serviceID="+rowObj.data("id")+"&_VM_selectedEaNumber="+rowObj.data("acc"),
				"error":myvmware.sdp.cmn.dataTableError,
				"bInfo":false,
				"bServerSide": false,  
				"bSort": false,				
				"bAutoWidth":false,
				"bFilter":false,
				"bPaginate": false,
				"sPaginationType": "full_numbers",
				"fnInitComplete":function(){
					var dtd=this;
					//if(!dtd.find('tfoot').length) $(dtd).append('<tfoot><tr><td class="bottomarea" colspan="5"></td></tr></tfoot>');
				}
			})
		},
		showloading :function(){return sOut="<div class='loadWraper' style='text-align:center; padding-left:40%'><div class='loading_big'>" + rs.Loading + "</div></div>";},
		displayResults: function(data){
			if(typeof data !="object") data=vmf.json.txtToObj(data);
			if(typeof data.ERROR_CODE!="undefined"){
				$("#noData").fadeIn().find('.alertTitle').html(data.ERROR_MESSAGE);
				$("#results").fadeOut();
				return false;
			}
			data = vmf.getObjByIdx(data,0);
			var res = data.results,resArr=[],uniRecords = data.iTotalRecords || 0;
			$("#results .num").html(uniRecords); // Phase 2 - FR-SDP2-CON-113 - fixed;
			if(res.length>0) {
				$.each(res,function(i,v){
					resArr.push("<div class='clearfix row' id='row"+i+"' val='"+v[0]+"'><div class='wrap c1 '><span class='label'>"+rs.accNum+": </span><span class='val'>"+v[0]+"</span></div><div class='wrap c2'><span class='label'>"+rs.custName+": </span><span class='val'>"+v[1]+"</span></div><div class='wrap c3'><span class='label'>"+rs.contact+": </span><span class='val'>"+v[2]+"</span></div><div class='wrap c4'><span class='label'>"+rs.sIds+": </span><span class='val'>"+v[3]+"</span></div><div class='c5'><a href='javascript:void(0)' class='toggle'>+ " + rs.Show + "</a></div></div>");
				});
				uc.subTable=data.subaaData;
				$("#resultSet").html(resArr.join('')).show().closest("#results").show();
			} else {
				$("#resultSet").hide();
			}
			$("#aNext").addClass("disabled").attr("disabled",true);
			$("#results").fadeIn();
		},
		failBuildAddOn: function(data){
			$('span.coreConfigResponse', 'table#coreConfig').html(rs.failureMsg).removeClass('success').addClass('error').fadeIn(function(){$(this).css("display","inline-block")});
		},
		getCorePost: function() {
			var _selected = $("input:radio['name'='sDetail']:checked").closest("tr");
			var rateCardIdContainer = $('#priceList select'), rateCardId = '', rateCardCurrency = '';
			if(!rateCardIdContainer.length){
				rateCardIdContainer = $('#priceList label');
				rateCardId = rateCardIdContainer.attr('data-value');
				rateCardCurrency = rateCardIdContainer.data('currency');
			}else {
				rateCardId = rateCardIdContainer.val();
				rateCardCurrency = rateCardIdContainer.find('option:selected').data('currency');
			}
			return {
				"_VM_upgradeDetails": uc.step2Step3String,
				"_VM_selectedEaNumber": _selected.data("acc"),
				"_VM_serviceID": _selected.data("id"),
				"_VM_rateCardId": rateCardId,
				"_VM_coreSKU": $('#coreSelection select').val(),
				"_VM_corePaymentType":  $('#paymentType select').val(),
				"_VM_serviceTerm":  $('#sTerm select').val(),
				"_VM_currency": rateCardCurrency
			}
		},
		getAddonPost: function() {
			var addon = [],
				qty = [],
				pay = [];
			$("tr.active", "#addOnTable").each(function(i, v) {
				addon.push($("input:checkbox", v)[0].id);
				qty.push($("input:text", v).val())
				pay.push(($(v).find("select").length) ? $(v).find("select").val() : $(v).find("label.payType").html());
			});
			return {
				_VM_baseSku: addon.join(","),
				_VM_qty: qty.join(","),
				_VM_paymentType: pay.join(","),
			}
		},
		buildAddOn: function(data){
			typeof data === "object" || (
				data = vmf.json.txtToObj(data)
			);
			if (data.ERROR_CODE) {
				$("#noData").fadeIn().find('.alertTitle').html(data.ERROR_MESSAGE);
				return;
			}
			var cHead = uc.cHead = data.wrapper.header,
				nonUpgradeableServices = uc.nonUpgradeableServices = data.wrapper.nonUpgradable,
				upgradeableServices = uc.upgradeableServices = data.wrapper.upgradeable,
				rateCardListConfig = uc.rateCardList = data.wrapper.priceLists.rateCardList,
				currentRateCard = uc.currentRateCard = data.wrapper.priceLists.rateCardName,
				currentRateCardId = uc.currentRateCardId = data.wrapper.priceLists.rateCardId,
				cmn = myvmware.config.cmn, cParam,
				ref = '#step2';

			cParam = (partnerType == "RESELLER") ? "?_VM_selectedAccountNumber="+cHead.customerAccount : "?_VM_source=DISTI&_VM_selectedAccountNumber="+cHead.prmId+"&_VM_selectedEaNumber="+cHead.customerAccount;

			$("#cName", ref).empty().append(
				cmn.isStandardUser ? cHead.companyName :
				$('<a/>').attr({
					href: rs.compNameUrl + "?" + (
						cmn.isReseller ? "_VM_selectedAccountNumber=" + cHead.customerAccount :
						"_VM_source=DISTI&_VM_selectedAccountNumber=" + cHead.prmId +
						"&_VM_selectedEaNumber=" + cHead.customerAccount
					),
					target: '_blank'
				}).append(cHead.companyName)
			);
			$("#cAccount", ref).html(cHead.customerAccount);
			$("#pContact", ref).empty().append(
				$('<a/>').attr({
					href: 'mailto:' + cHead.procContractEmail,
					title: cHead.procContractEmail,
					//target: '_blank'
				}).append(cHead.procContract)
			);

			$("#serType", ref).html(cHead.serType)
			//$("#soldBy", ref).html(addOnConfig.rateCardName).data("rateCardId", addOnConfig.rateCardId);
			$("#sID", ref).html(
				cmn.isStandardUser ? cHead.serviceID :"<a href='" + rs.serviceIDUrl + "&_VM_serviceID=" + cHead.encodedServiceID + "' target='_blank'>" + cHead.serviceID + "</a>"
				//cmn.isStandardUser ? cHead.serviceID : "<a href='" + rs.backURL + cHead.encodedServiceID + "' target='_blank'>" + cHead.serviceID + "</a>"
			);
			/*$('#serviceTerm').triggerHandler('revert', {
				revertValue: cHead.serviceTerm
			});*/
			$('#serviceTerm', ref).html(cHead.serviceTerm);
			/*$('#paymentType').triggerHandler('revert', {
				revertValue: cHead.paymentType
			});*/
			$('#paymentType', ref).html(cHead.paymentType);
			$("#region2", ref).html(cHead.region);

			//3rd column
			$("#sDate", ref).html(cHead.termStart);
			$('#termEnd', ref).html(cHead.termEnd);
			$("#rTerm", ref).html(cHead.remainTerm);
			$("#renew", ref).html(cHead.renewType);
			$("#sidCurrency", ref).html(cHead.currency);
			$("#priceListCurrency", ref).html(cHead.currency);
			
			if(rs.isStandardUser.toLowerCase()!="true" && partnerType != "DISTI"){
				var hoverText = $("button.priceListToolTip").attr("title"),
					hoverContentUpdated = hoverText.replace("#URL", rs.compNameUrl+cParam);
				$("button.priceListToolTip").attr("title", hoverContentUpdated);
				myvmware.hoverContent.bindEvents('.fn_tooltip', 'epfunc','','', true);
			}

			/*$("#sQty", ref).html(
				serviceConfig.aaData[0][2]
			)*/
			var currencyMap = cHead.currencyMap,
				currencyCodeList = Object.keys(currencyMap);

			$("#currency2").selectOne({
				list: $.map(currencyCodeList, function(v) {
					return [
						[v, currencyMap[v]]
					]
				})
			}).triggerHandler('revert', {
				revertValue: cHead.currency
			})
			/*var rateCardMap = addOnConfig.rateCardMap,
				rateCardIds = Object.keys(rateCardMap);*/

			/*$("#priceListUsed").selectOne({
				list: $.map(rateCardIds, function(v) {
					return [
						[v, rateCardMap[v]]
					]
				})
			}).triggerHandler('revert', {
				revertValue: addOnConfig.rateCardId
			})*/
			/*$("#currentCoreSKU", ref).html(serviceConfig.aaData[0][0])
			$("#currentCoreDescription", ref).empty().append(
				serviceConfig.aaData[0][1]
			)*/

			$("#upgradeServicesTables").html("");
			$("#step1, #noData").fadeOut();
			$("#step2").fadeIn();
			//if no data present
			/*if (!$.isEmptyObject(addOnConfig.addons)) {
				cmn.buildSku(addOnConfig.addons);
				$("#addOnTable").fadeIn();

				$("#noAddon").fadeOut();
				rc.chkAddOnQtyOnload();
			} else {
				$("#addOnTable").fadeOut();
				$("#noAddon").fadeIn();
			}*/

			if(rateCardListConfig!=null && rateCardListConfig!=""){
				if(partnerType!="RESELLER") hideClass="hidden";
				var optArr = [], tooltipContent = '';

				if(cmn.isReseller){
					tooltipContent = '<a href="#" data-tooltip-position="right" title="'+rs.pricelistdropdowntooltip+'" class="tooltip fn_tooltip"></a>';
				}

				if(rateCardListConfig.length == 1){
					optArr.push('<div><label class="priceListRadio" data-value="'+rateCardListConfig[0][0]+'" data-currency="'+rateCardListConfig[0][2][0]+'" data-index="'+0+'" >' + rateCardListConfig[0][1] + '</label>'+ tooltipContent +'</div>');
				}else if(rateCardListConfig.length > 1){
					optArr.push("<div><select class=\"dPrice\" id='upgradeChoosePriceDropdown'>");

					$.each(rateCardListConfig, function(k,l){
						if(currentRateCard == l[1]){
							optArr.push("<option class='priceListRadio' value='"+l[0]+"' data-currency='"+l[2][0]+"' data-index='"+k+"' selected='selected'>"+l[1]+"</option>");	
						}else{
							optArr.push("<option class='priceListRadio' value='"+l[0]+"' data-currency='"+l[2][0]+"' data-index='"+k+"'>"+l[1]+"</option>");	
						}
					});
					optArr.push('</select>'+ tooltipContent +'</div>');
				}
				$("#priceList").html(optArr.join(''));
				if(cmn.isReseller){
					myvmware.hoverContent.bindEvents('.fn_tooltip', 'epfunc','','', true);
				}

			} else {
				$("#rateCardInfo").hide();
			}
			$('#upgradeChoosePriceDropdown').live('focus',function(){
				
				uc.prevPricelist = this.selectedIndex;
			}).live('change',function(){
				if($(this).find('option:selected').index() != -1){
					var _selected = $("input:radio['name'='sDetail']:checked").closest("tr");
					var plDropDown = $(this);
					vmf.modal.show("upgradePriceListChangeConfirmation",{
						onShow: function(){
							$('#pricelistConfirm').die('click').live('click', function(){
								vmf.modal.hide();
								uc.prevPricelist = plDropDown[0].selectedIndex;
								
								vmf.ajax.post(rs.getAddOnData,{
										"_VM_rateCardId":$('#upgradeChoosePriceDropdown option:selected').val(),
										"_VM_currency":$('#upgradeChoosePriceDropdown option:selected').attr('data-currency'),
										"_VM_selectedEaNumber": _selected.data("acc"), 
										"_VM_serviceID": _selected.data("id")
									},
									uc.buildAddOn,
									uc.showPriceListError,
									function(){
										vmf.loading.hide();
									},
									300000,
									function(){
										vmf.loading.show();
									}
								);
							});
							priceListCancel
							$('#priceListCancel').die('click').live('click', function(){
								plDropDown[0].selectedIndex = uc.prevPricelist;
							});
						},

						onClose:function(){
							vmf.modal.hide();
						}
					});	//modal end
				}//if end	
			});
			
			if(nonUpgradeableServices.length > 0){
				uc.buildNonUpgradeableServicesTable(nonUpgradeableServices);
				$('.nonUpgradeableSection').show();
			}else{
				$('.nonUpgradeableSection').hide();
			}

			if(!$.isEmptyObject(upgradeableServices)){
				uc.buildUpgradeableServicesTables(upgradeableServices);
				$('#upgradeAbleServiceContainer').show();
				$('#s2Apply').removeClass("disabled").removeAttr("disabled");
			}else{
				$("#s2Apply").addClass("disabled").attr("disabled","disabled");
				$('#upgradeAbleServiceContainer').hide();
			}

			$("#progress").removeClass("s3 s0").addClass("s2");
			$("#s2Apply").addClass("disabled").attr("disabled","disabled");
			riaLinkmy && riaLinkmy('config' + partnerType.toLowerCase() + ':renewalmodify')
		}, // buildAddOn

		buildNonUpgradeableServicesTable: function(nonUpgradeableServices){
			var tableHtml = '';
			var tableHeader = '<thead><tr class="nonUpgradable-header"><th class="first-sku-col">'+ rs.SKU + '</th><th class="product-col">' + rs.productsLabel + '</th><th>' + rs.qty + '</th><th>' + rs.supportLevelLabel + '</th><th>' + rs.unitCost + '</th><th>' + rs.extCost + '</th></tr></thead>';
			var tableBody = '<tbody>', trow = '', td = '';
			for(var i = 0; i < nonUpgradeableServices.length; i++){
				
				if(nonUpgradeableServices.length == 1){
					trow = '<tr>';
					td = '<td class="nonUpgradeCrossSku"><span>'+ nonUpgradeableServices[i][0] + '</span></td>'
				}else if(nonUpgradeableServices.length > 1){
					if(i == 0) {
						trow = '<tr>';
						td = '<td class="nonUpgradeCrossSku"><span class="icon openclose">&nbsp;</span><span>'+ nonUpgradeableServices[i][0] + '</span></td>'
					}else{
						trow = '<tr class="hidden">';
						td = '<td class="nonUpgradeCrossSku"><span>'+ nonUpgradeableServices[i][0] + '</span></td>'
					}
				}
				
				td +=	'<td class="nameAndDesc"><span class="prodName">'+ nonUpgradeableServices[i][6] + '</span><br><span class="prodDesc">' + nonUpgradeableServices[i][1] + '</span></td>' + 
						'<td class="prodQty"><span>'+ nonUpgradeableServices[i][2] + '</span></td>' + 
						'<td class="prodSupportLevel"><span>'+ nonUpgradeableServices[i][3] + '</span></td>' + 
						'<td class="prodUnitCost"><span>'+ nonUpgradeableServices[i][4] + '</span></td>' + 
						'<td class="prodExtCost"><span>'+ nonUpgradeableServices[i][5] + '</span></td>';

				trow += td + '</tr>';
				tableBody += trow;
			}
			tableHtml += tableHeader + tableBody;
			$('#nonUpgradeableTable').html(tableHtml);
		},

		buildUpgradeableServicesTables:function(upgradeableServices){
			for(var keys in upgradeableServices){
				uc.createUpgradeableServiceTable(upgradeableServices[keys], keys);
			}
		},

		createUpgradeableServiceTable: function(upgradeableService, mainProduct){
			var $upgradeCont = $('<div class="upgradeableServiceTblCont"></div>');
			var $upgradeTable = $('<table class="upgradeableServiceTable"></table>');
			var $thead = $('<thead class="upgradeableServiceTableHead"></thead>');
			var $tbody = $('<tbody class="upgradeableServiceTableBody"></tbody>');
			
			uc.tierInfo[upgradeableService.originalCrossSKU] = {};
			uc.tierInfo[upgradeableService.originalCrossSKU]["productName"] = mainProduct;
			uc.tierInfo[upgradeableService.originalCrossSKU]["qty"] = upgradeableService.qty;

			var mainTh = '<tr><th class="first-sku-col">'+ rs.SKU + '</th><th class="product-col">' + 'Products' + '</th><th>' + rs.qty + '</th><th class="supportLvl">' + 'Support Level' + '</th><th>Payment Type</th><th></tr>';

			var mainTr = '<tr id="'+ upgradeableService.originalCrossSKU +'" class="mainTr">';
			var allMainTds 	= 	'<td class="upgradeableCrossSku"><span class="upgradeableCrossSkuName">' + 							upgradeableService.originalCrossSKU + 
								'</span><br><a href="javascript:void(0)" class="showHideUpgrades hidding">'+rs.showUpgradeOptionsText+'</a></td><td class="upgradeableProduct"><span class="upgradeableProductSkuName">'+ upgradeableService.originalServiceTypeDesc + '</span><div class="upgradeableProductDesc">' + upgradeableService.originalSKULongDesc +
								'</div></td><td class="upgradeableQty">' + upgradeableService.qty + 
								'</td><td class="upgradeableSupportLevel">' + upgradeableService.supportLevel + 
								'</td><td class="upgradeablePaymentType">' + upgradeableService.paymentType + 
								'</td>';
			mainTr += allMainTds + '</tr>';
			
			/*uc.tierInfo[upgradeableService.originalCrossSKU]["productName"] = mainProduct;
			uc.tierInfo[upgradeableService.originalCrossSKU]["qty"] = upgradeableService.qty;*/

			var upgradeTos = upgradeableService.upgradeTo;
			
			for(var keys in upgradeTos){
				uc.tierInfo[upgradeableService.originalCrossSKU][upgradeTos[keys].eligibleServiceTypeDesc] = {};
				var supportLevelOptions = '', optionString = '', opts = upgradeTos[keys].supportLevel, errLabel = '';
				if(opts.length == 1){
					supportLevelOptions += '<label class="payType">' + opts[0] + '</label>'; 
				} else if(opts.length > 1){
					supportLevelOptions = '<select class="payType">';
					optionString = '<option value>'+ rs.Select_One +'</option>';
					for(var i = 0; i < opts.length; i++){
						optionString += '<option value="' + opts[i] + '">' + opts[i] + '</option>';
					}
					errLabel = '<br><span class="errorLabel hidden blockLevel floatNone clearBoth">'+rs.validateSupportLevel+'</span>'
					supportLevelOptions += optionString + '</select>' + errLabel;
				}
				
				var supportTier = uc.tiersArray(upgradeTos[keys].tiers, upgradeTos[keys].eligibleServiceTypeDesc, upgradeableService.originalCrossSKU, opts.length);

				var tr = '<tr data-upgradeFrom = "'+upgradeableService.originalCrossSKU+'" class="upgradeTo hidden tiersArray">';
				var allTds 	= 	'<td class="upgradeableCrossSku first-col">' +
								'</td><td class="upgradeableProduct"><span class="upgradeableProductSkuName">'+ upgradeTos[keys].eligibleServiceTypeDesc + '</span><div class="upgradeableProductDesc">' + upgradeTos[keys].addOnSKUDesc + '</div><div class="tierHolder">'+supportTier+'</div>' +
								'</td><td class="upgradeableQty"><span class="qtyHolder"><input type="text" class="upgradeToQty" size="2" maxlength="3" value="0"><br><span class="errorLabel hidden blockLevel floatNone clearBoth">'+rs.validateQtyMsg+'</span></span>' +
								'</td><td class="upgradeableSupportLevel">' + supportLevelOptions +
								'</td><td class="upgradeablePaymentType">' +
								'</td>';
				tr += allTds + '</tr>';
				mainTr += tr;
			}

			var $errorString = '<div class="qtySupportErrorContainer" data-upgradeFrom = "'+upgradeableService.originalCrossSKU+'"><span class="alertIcon21 fLeft"></span><span class="qtySupportError"></span></div>';

			var $upgradeTableContainer = $('#upgradeServicesTables');
			$thead.append(mainTh);
			$tbody.append(mainTr);
			$upgradeTable.append($thead);
			$upgradeTable.append($tbody);
			$upgradeCont.append($upgradeTable);
			$upgradeTableContainer.append($errorString);
			$upgradeTableContainer.append($upgradeCont);
			$upgradeTableContainer.find('.qtySupportErrorContainer').hide();
			$tbody.find('tr.mainTr:last td, tr.tiersArray:last td, td:first').addClass('last-col');
			$upgradeCont.find('table:first').addClass('first-table');
		},

		tiersArray : function(value, index, mainProduct, tierLength) {
			var tierArr = [], tierArrayClass;
			if(typeof value == "object" && myvmware.sdp.cmn.getObjectSize(value)!=0){ // Adding Tiers
				var size = 0, key, tierObj=value,k, cnt=0, hide="";
				var eachTier = {};
				for (key in tierObj){
					//(cnt!=0) ? hide = " hidden" : ""
					size=0;
					tierArrayClass = key.split(' ').join('_');
					if(tierLength == 1){
						tierArr.push("<span class='tierParent "+tierArrayClass+ "'>");
					}else{
						tierArr.push("<span class='tierParent hidden "+tierArrayClass+ "'>");
					}
					uc.tierInfo[mainProduct][index][key] = [];
					
					for (k in tierObj[key]){
						
						keyDiff = k.split("_");
						eachTier['min'] = parseInt(keyDiff[0], 10);
						eachTier['max'] = parseInt(keyDiff[1], 10);
						eachTier['crossSku'] = tierObj[key][k][1];
						eachTier['price'] = tierObj[key][k][0];
						uc.tierInfo[mainProduct][index][key].push(eachTier);
						
						if(k == '1_999999999999999' && tierObj[key][k][2] == 0) {
							tierArr.push("<span class='noTier'>"+ rs.noTiersMsg + " " + index + " </span>");
						} else {
							if(eachTier['crossSku'] != '' && eachTier['price'] != ''){
								tierArr.push("<span class=\"tier\">Tier"+ ++size +" ("+keyDiff[0]+" to "+keyDiff[1]+" Qty) = "+tierObj[key][k][0]+" </span>");
							}
						}
						eachTier = {};
						//if(!$.trim(tierObj[key][k][0]).length) myvmware.config.cmn.noTierArr.push(index+"_tHolder");
					}
					tierArr.push("</span>");
					cnt++;
				}
			} else{
				tierArr = [];
			}
			return tierArr.join('');
		},

		chkAddOnQtyOnload: function() {
 			$('#addOnTable input:checkbox').each(function(i, v){
 				rc.checkRowActive.call(v)
 			});
		},
		checkRowActive: function() {
			var row = this;
			row.tagName === "TR" || (
				row = $(row).closest('tr')[0]
			)
			var qty = parseInt(
					$('input.qty', row).val(), 10
				),
				payType = $('select.payType', row).val()
			$(row)[qty && payType ? 'addClass' : 'removeClass']('active');
			$('input:checkbox', row)[0].checked = qty || payType;
		},
		showPreview: function(data){
			if (typeof data!="object") data=vmf.json.txtToObj(data);
			if (typeof data.ERROR_CODE!="undefined"){
				myvmware.config.cmn.showPreviewError(data);
				return;
			}
			data = vmf.getObjByIdx(data,0);
			$("#totalCost").html(data.totalCost).attr('data-currency',$("#currency2 select").val());
			if(!data.currentProducts.length && !data.addOnConfigTable.length){
				$("#serviceConfigPreviewTable span.error").html(rs.errorMsg);
				return;
			}
			vmf.modal.show("ConfigPreview",{
				onShow: function(){
					if(data.currentProducts.length > 0){
						uc.buildServicePreviewTable(data.currentProducts);
					}
					if(data.addOnConfigTable!=null && data.addOnConfigTable.length) {
						uc.prepareUpgradeableData(data.addOnConfigTable);
					}
					$("#progress").removeClass("s2").addClass("s3");
					$("#ConfigPreview").closest(".simplemodal-container").height($("#ConfigPreview").height())
					$.modal.setPosition();
					$("#export").fadeIn().removeAttr('disabled').unbind("click").bind("click", function() {
						$("#excelPopup").attr("src", rs.exportAddOnServiceConfiguratorExcel + "&" + $.param(
							$.extend({}, uc.getCorePost())
						));

						$("#excelPopup").attr("onload", uc.afterExport);
						if (typeof riaLinkmy != "undefined") {
							if (partnerType.toUpperCase() == "RESELLER")
								riaLinkmy('configreseller:renewalpreview:export');
							else if (partnerType.toUpperCase()=="DISTI")
								riaLinkmy('configdisti:renewalpreview:export');
						}
					});
					// Reattaching the tooltip for info icon -- Added by Sathya
					$("#ConfigPreview a.fn_tooltip").accessibleTooltip({topOffset: 30,leftOffset: -90,associateWithLabel:false,preContent: "<div class='arrow bottom'></div>"});

					// Checking the condition for enabling and disabling Quote Btn -- Added By Sathya
					if (rs.isStandardUser.toLowerCase()=="true" && rs.quotationToolFlag=="Y"){
						$("#getQuote").removeClass("hidden");
						myvmware.config.cmn.loadQuoteContent();							
					}

					(data.showPrePayMsg) ? $("#ConfigPreview").find(".note").fadeIn() : $("#ConfigPreview").find(".note").fadeOut();
					if(typeof riaLinkmy!="undefined"){
						if(partnerType.toUpperCase()=="RESELLER")
							riaLinkmy('configreseller:renewalpreview');
						else if (partnerType.toUpperCase()=="DISTI")
							riaLinkmy('configdisti:renewalpreview');
					}
				},
				onClose:function(){
					$("#progress").removeClass("s3").addClass("s2");
					vmf.modal.hide();
					// Replacing button and div with tooltip class to an anchor tag for reattaching the tooltip functionality -- Added by Sathya
					$("#ConfigPreview .tooltip").remove();
					$("#ConfigPreview .priceHolder").prepend('<a class="tooltip fn_tooltip nomargin" data-tooltip-position="config-bottom" title="'+rs.totalMonthlyCostToolTip+'"></a>');
				}
			});
			$(window).resize();
		},
		afterExport:function(jData){
			var jd = vmf.json.txtToObj(jData);
			if(jd != null && !jd.status) myvmware.sdp.cmn.showErrorModal(jd.error_MESSAGE);
				//else $('#billStatement').attr('src',rs.url.downloadeCsvBillingStatements+"&serialID="+downloadUrl);
		},
		/*failExport: function(jData){
			if(jData != null && !jData.status) myvmware.sdp.cmn.showErrorModal(jDatas.error_MESSAGE);
		},*/
		prepareUpgradeableData: function(data){
			var allUpgradeFromTo = [], header1 = [], header2 = [],emptyRow1 =[],emptyRow2 =[];
			if(data.length){
				for(var temp =0; temp<data[0].upgradeFrom.length;temp++){
					header1.push("");
					header2.push("");
					emptyRow1.push("");
					emptyRow2.push("");
				}
			}
			for(var i = 0; i < data.length; i++){
				if(data[i].upgradeFrom != null){
					header1[6] = rs.upgradeFrom;
					allUpgradeFromTo.push(header1);
					allUpgradeFromTo.push(data[i].upgradeFrom);
					emptyRow1[0] = "<span class='emptyRow1'></span>";
					allUpgradeFromTo.push(emptyRow1);
					if(data[i].upgradeTo != null){
						for(var j = 0; j < data[i].upgradeTo.length; j++){
						    if(j===0){
								header2[6] = rs.upgradeTo;
								allUpgradeFromTo.push(header2);
							}
							allUpgradeFromTo.push(data[i].upgradeTo[j]);
							if(j===data[i].upgradeTo.length-1 && i!=data.length-1){
								emptyRow2[0] = "<span class='emptyRow2'></span>";
								allUpgradeFromTo.push(emptyRow2);
							}
						}	
					}
					uc.buildAddonPreviewTable(allUpgradeFromTo);
				}
			}
			return;
		},
		buildServicePreviewTable: function(data){
			vmf.datatable.build($('#serviceConfigPreviewTable'),{
				"bPaginate": false,
				"bFilter": false,
				"bInfo":false,
				"aoColumns": [
					{"sTitle": "<span>Current Products</span>","sWidth":"350px","bSortable":false},
					{"sTitle": "<span>"+rs.qty+"</span>","sWidth":"50px","bSortable":false,"sClass":"normal"},
					{"sTitle": "<span>"+rs.supportLevel+"</span>","sWidth":"50px","bSortable":false,"sClass":"normal"},
					{"sTitle": "<span>"+rs.payType+"</span>","sWidth":"100px","bSortable":false,"sClass":"normal"},
					{"sTitle": "<span>"+rs.unitCost+"</span>","sWidth":"100","bSortable":false,"sClass":"normal"},
					{"sTitle": "<span>"+rs.extCost+"</span>","sWidth":"100px","bSortable":false,"sClass":"normal"}
					/*{"sTitle": "","bVisible":false}*/
				],
				"aaData": data,
				"bSort": false,
				"bServerSide": false,
				"bProcessing":false,
				"sScrollY":"130px",
				"fnRowCallback": function(nRow,aData,iDisplayIndex){
					var hClass = '';
					if(data.length == 1){
						hClass = '';

						$(nRow).find("td:eq(0)").html("<div><span class='core'>"+aData[6]+"</span><span>"+aData[0]+"</span></div><div class='clear desc'>"+aData[7]+"</div>");

					}else if(data.length > 1){
						hClass = (iDisplayIndex==0) ? "openclose" : "hidden";

						$(nRow).find("td:eq(0)").html("<span class='icon "+hClass+"'>&nbsp;</span><div><span class='core'>"+aData[6]+"</span><span>"+aData[0]+"</span></div><div class='clear desc'>"+aData[7]+"</div>");
					}

					/*var hClass = ((data.length>1) && iDisplayIndex==0) ? "openclose" : "pLeft";*/
					
					if(iDisplayIndex > 0){
						$(nRow).addClass('hidden');
					}
					
					return nRow;
				},
				fnDrawCallback: function(){

					if($("#serviceConfigPreviewTable tbody").height() < $("#serviceConfigPreviewTable_wrapper .dataTables_scrollBody").height()){
						$("#serviceConfigPreviewTable_wrapper .dataTables_scrollBody").height($("#serviceConfigPreviewTable tbody").height()+1+"px");
					}
				}
			});
		},
		buildAddonPreviewTable: function(data){
			vmf.datatable.build($('#addOnPreviewTable'),{
				"bPaginate": false,
				"bFilter": false,
				"bInfo":false,
				"aoColumns": [
					{"sTitle": "<span>Upgrade Configuration</span>","sWidth":"350px","bSortable":false},
					{"sTitle": "<span>"+rs.qty+"</span>","sWidth":"50px","bSortable":false,"sClass":"normal"},
					{"sTitle": "<span>"+rs.supportLevel+"</span>","sWidth":"50px","bSortable":false,"sClass":"normal"},
					{"sTitle": "<span>"+rs.payType+"</span>","sWidth":"100px","bSortable":false,"sClass":"normal"},
					{"sTitle": "<span>"+rs.unitCost+"</span>","sWidth":"100px","bSortable":false,"sClass":"normal"},
					{"sTitle": "<span>"+rs.extCost+"</span>","sWidth":"100px","bSortable":false,"sClass":"normal"}
					/*{"sTitle": "","bVisible":false},
					{"sTitle": "","bVisible":false},
					{"sTitle": "","bVisible":false},
					{"sTitle": "","bVisible":false},
					{"sTitle": "","bVisible":false}*/
				],
				"aaData": data,
				"bServerSide": false,
				"bProcessing":false,
				"bSort": false,
				"bDestroy": true,
				"sScrollY":"150px",
				"fnRowCallback": function(nRow,aData,iDisplayIndex){
					$(nRow).find("td:eq(0)").html("<div class='baseSkuInfo'><span class='addon'>"+aData[6]+"</span><span>"+aData[0]+"</span><div class='addonskuDesc'>"+aData[7]+"</div></div>");
					
					if(iDisplayIndex && aData[0] == rs.upgradeFrom ){
						$(nRow).addClass("upgradeFromLabel");
					}
					if($(nRow).find(".emptyRow2").length>0){
						$(nRow).addClass("upgradeLabel moreSpace");
					}
					if($(nRow).find(".emptyRow1").length>0){
						$(nRow).addClass("moreSpace");
					}
					//$(nRow).find("td:eq(1)").html("<div class='qty'>"+aData[1]+"</div>");
					
					/*$(nRow).find("td:eq(3)").html("<div class='unit'>"+aData[3]+"</div>");
					$(nRow).find("td:eq(4)").html("<div class='ext'>"+aData[4]+"</div>");
					var support = (typeof aData[8] == "string") ? vmf.json.txtToObj(aData[8]) : aData[8];
					if (support && support.length)
						$(nRow).addClass("withSupport").find("td:eq(0)").append("<div><span class='supportSkuDesc'>"+support[5]+" - "+ support[6]+"</span></div>").end().find("td:eq(3)").append("<div class='unit'>"+support[3]+"</div>").end().find("td:eq(4)").append("<div class='ext'>"+support[4]+"</div>");
					$(nRow).attr("sid",aData[0]);*/
					
					return nRow;
				},
				fnDrawCallback:function(){
					$(this).closest(".dataTables_scroll").addClass("bottomarea");
					/*$.each($('#addOnPreviewTable tbody tr'),function(){
						if($(this).hasClass("duplicate")){
							$("tr[sid='"+$(this).attr("category")+"']",$("#addOnPreviewTable")).addClass("withSupport").find("td:eq(0)").append("<div><span class='supportSkuDesc'>"+$(this).data("skuID")+" - "+$(this).data("sku")+"</span></div>").end().find("td:eq(3)").append("<div class='unit'>"+$(this).data("unit")+"</div>").end().find("td:eq(4)").append("<div class='ext'>"+$(this).data("ext")+"</div>");
							$(this).hide();
						}
					});
					rc.categoryMap=[];*/
					if($("#addOnPreviewTable tbody").height() < $("#addOnPreviewTable_wrapper .dataTables_scrollBody").height()){
						$("#addOnPreviewTable_wrapper .dataTables_scrollBody").height($("#addOnPreviewTable tbody").height()+1+"px");
					}
				},
				fnInitComplete: function(){
					myvmware.config.cmn.adjustHt();
				}
			});
		},
		checkForExceedQty: function (upgradeToTotalQty) {
			var flag = true, returnElement = {};
			returnElement['highQtyProds'] = [];

			for(var allkeys in upgradeToTotalQty){
				
				if(upgradeToTotalQty[allkeys] > uc.tierInfo[allkeys]["qty"]){
					flag = false;
					returnElement['highQtyProds'].push([allkeys, uc.tierInfo[allkeys]["qty"]]); 
				}
			}	
			returnElement['flag'] = flag;
			return returnElement;
		},
		showPriceListError:function(){
			myvmware.sdp.cmn.showErrorModal(rs.genericError);
		}
	}
}