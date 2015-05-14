if (typeof(epp) == "undefined")  
  epp = {};
  var pp, th;
epp.registration = {
	selState:"",
	countriesList:[],
	stateEnabledList:[],
	trillEnabledList:[],
    init: function() {
        vmf.scEvent =true;
        th = epp.registration; //Storing epp.registration object
		pp = th.pp;
        th.cmm.events(); //Bind all events in registration pages
        th.cmm.getStateEnabledList();
		//code for ominature tracking of log in page loading
		//callBack.addsc({'f':'riaLinkmy','args':[epp.globalVar.pageName + ' : epp']})
    },
	placeErrors:function(error, element){ //placing error message on validation of forms
		if(element.next('.tooltip').length > 0) {
			element.next('.tooltip').after(error);
		} else if(element.is('input[type=checkbox]')) {
			element.next('*').after(error);
		} else {
			element.after(error);
		}
	},
	loadBasicProfile:function(){ //Loading profile when no prepopulation required
    	vmf.ajax.post(epp.globalVar.loadNewProfileDetails, null, function(jData){
			if(typeof jData!="object") var jData = vmf.json.txtToObj(jData);
			if(jData!=null){
	    		var email = $('#txt_email'), sal=$('#sel_salutation'), country = $('#country'), cList=[];
				var pf = jData.ProfileJSON;
				email.val(pf.emailAddress);
				sal.find('option').not(':eq(0)').remove();
				for(var key in pf.salutationList){
					sal.append('<option value="'+pf.salutationList[key][1]+'">'+pf.salutationList[key][0]+'</option>');
				}
				cList=[];
				for(var key in pf.countryList){
					cList.push('<option value="'+pf.countryList[key][1]+'">'+pf.countryList[key][0]+'</option>');
				}
				country.find('option').not(':eq(0)').remove();
				country.append(cList.join(''));
				th.stateEnabledList = pf.stateEnabledCountries;
				if(pf.selectedCountry != null && pf.selectedCountry.length && th.checkStateEnable(pf.selectedCountry, th.stateEnabledList)){
					$('#country').parent().next('.ctrlHolder').removeClass('hidden');
					th.selState = pf.selectedState;
					$('#country').val(pf.selectedCountry).trigger('change');
				}
				//When short profile, hiding login information section.
				if(pf.shortProfile) {
					$('#txt_verify_email').val(pf.emailAddress);
					$('#loginInfo').hide();
				}
			}
			th.validateRegForm();
		},function(){th.cmm.genericError()},function(){vmf.loading.hide()},null,function(){vmf.loading.show({"overlay":true});});
	},
	loadProfile:function(){//Loading profile with prepopulation of data if user already filled
    	vmf.ajax.post(epp.globalVar.loadEditProfileDetails, null, function(jData){
			if(typeof jData !="object") jData=vmf.json.txtToObj(jData);
				if(jData!=null && jData.ProfileJSONEdit!=null){
	    		var em = $('#eppRegForm').find('input,select'), cList=[], stateEnabled = false;
	    		var pf = jData.ProfileJSONEdit;

				em.each(function(){
					var $id = $(this).attr('id');
					if($id == 'txt_email' && pf.emailAddress != null && pf.emailAddress.length){
						$(this).val(pf.emailAddress);
					}else if($id == 'txt_verify_email' && pf.verifyEmailAddress != null && pf.verifyEmailAddress.length){
						$(this).val(pf.verifyEmailAddress);
					}else if($id == 'sel_salutation' && pf.salutationList != null && pf.salutationList.length){
						$(this).find('option').not(':eq(0)').remove();
						for(var key in pf.salutationList){
							$(this).append('<option value="'+pf.salutationList[key][1]+'">'+pf.salutationList[key][0]+'</option>');
						}
						if(pf.salutation != null && pf.salutation.length) $(this).val(pf.salutation);
					}else if($id == 'txt_firstName' && pf.firstName != null && pf.firstName.length){
						$(this).val(pf.firstName)
					}else if($id == 'txt_lastName' && pf.lastName != null && pf.lastName.length){
						$(this).val(pf.lastName);
					}else if (pf.customerAddress != null ){					
						 if($id == 'txt_company' && pf.customerAddress.companyName != null && pf.customerAddress.companyName.length){
							$(this).val(pf.customerAddress.companyName);
						}else if($id == 'txt_address1' && pf.customerAddress.addressLine1 != null && pf.customerAddress.addressLine1.length){
							$(this).val(pf.customerAddress.addressLine1);
						}else if($id == 'txt_address2' && pf.customerAddress.addressLine2 != null && pf.customerAddress.addressLine2.length){
							$(this).val(pf.customerAddress.addressLine2);
						}else if($id == 'txt_city' && pf.customerAddress.city != null && pf.customerAddress.city.length){
							$(this).val(pf.customerAddress.city);
						}else if($id == 'txt_zip_postal_code' && pf.customerAddress.zipCode != null && pf.customerAddress.zipCode.length){
							$(this).val(pf.customerAddress.zipCode);
						}else if($id == 'country' && pf.countryList != null && pf.countryList.length){
							cList=[];
							for(var key in pf.countryList){
								cList.push('<option value="'+pf.countryList[key][1]+'">'+pf.countryList[key][0]+'</option>');
							}
							$(this).find('option').not(':eq(0)').remove();
							$(this).append(cList.join(''));
							th.stateEnabledList = pf.stateEnabledCountries;
							if(pf.selectedCountry.length && th.checkStateEnable(pf.selectedCountry, th.stateEnabledList)){
								$(this).parent().next('.ctrlHolder').removeClass('hidden');
								th.selState = pf.selectedState;
							}
							$(this).val(pf.selectedCountry).trigger('change');
						}else if($id == 'txt_busPhone' && pf.customerAddress.phone != null && pf.customerAddress.phone.length){
							$(this).val(pf.customerAddress.phone);
						}
					}
				});
				//When short profile, hiding login information section.
				if(pf.shortProfile) { $('#loginInfo').hide() };
			}
			th.validateRegForm();

    	},function(){th.cmm.genericError()},function(){vmf.loading.hide();},null,function(){vmf.loading.show({"overlay":true});})
    },
    checkStateEnable:function(val, eList){ //Checking if country is state enabled or not
    	var enableList = eList;
    	return($.inArray(val,enableList) == -1)?false:true;
    },
	validateRegForm: function() { // Validation of epp registration form.
		$.validator.addMethod("duplicate", function(val, element) {
		    if($(element).is(':hidden')) return true;
			var ret=false;
            $.ajaxSetup({async:false});
			vmf.ajax.post(epp.globalVar.checkDuplicate,{"email":$.trim(val)}, function(jData){
                if(typeof jData!="object") jData = vmf.json.txtToObj(jData);
				if(jData != null){ret=!jData.registeredUser;}
			},function(){alert(epp.globalVar.genericError)},function(){$("#duplicate_img").hide()},null,function(){$(element).siblings('label.error').hide(); $("#duplicate_img").show()},false);
            $.ajaxSetup({async:true});
            return ret;
		},epp.globalVar.existingUser);
		
		$.validator.addMethod("vppRegistered", function(val, element) {
			var cName=$.trim(val), $this=$(element);
			if (cName.length){
				vmf.ajax.post(epp.globalVar.companyExistUrl,{"cName":cName},function(res){
					if(typeof res!="object") res=vmf.json.txtToObj(res); 
					(res.status) ? $this.siblings("div.note").html(epp.globalVar.vppRegisteredMsg).show() : $this.siblings("div.note").hide();
				},function(){th.cmm.genericError()},function(){$("#loading_img").hide()},null,function(){
						$this.siblings('label.error').hide();
						$("#loading_img").show();
				},false);
			} else {
				$this.siblings("div.note").hide();
			}
			return true; //Always returning true as there is no need to stop execution
		},epp.globalVar.vppRegisteredMsg);
		
		$.validator.addMethod("customEmail", function(val, element) {
			var emailPattern = /^[a-zA-Z0-9._-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9.]+$/;
			return (emailPattern.test(val));
		},epp.globalVar.enterValidEmail);
		
		$.validator.addMethod("equalToNoCase", function (value, element, param) {
			return this.optional(element) || 
		             (value.toLowerCase() == $(param).val().toLowerCase());
		});

		$('#eppRegForm').validate({
			errorPlacement : function(error, element) {
				th.placeErrors(error, element);
				element.closest('.ctrlHolder').addClass('error');
			},
			rules : {
				regEmailAddress : {
					required : "#txt_email:visible",
					minlength : 6,
					email : true,
					duplicate : true,
					customEmail:true
				},
				regVerifyEmailAddress : {
					required : "#txt_verify_email:visible",
					equalToNoCase : '#txt_email'
				},
				regFirstName : {
					//text
					required : true
				},
				regLastName : {
					//text
					required : true
				},
				regCompanyName : {
					required : true,
					vppRegistered: true
				},
				regAddressLine1 : {
					//text
					required : true,
					minlength : 5
				},
				regCity : {
					//select
					required : true
				},
				regZipCode : {
					//alphanumeric
					required : true,
			        zipFormat:true
				},
				country : {
					//select
					required : true
				},
				state : {
					//select
					required : {
                        depends: function(element){
                           return th.checkStateEnable($("#country").val(), th.stateEnabledList);
                      	}
                    }
				},
				regPhone : {
					mformat : true,
					required : false
				}
				
			},
			messages : {
				regEmailAddress : {
					required : epp.globalVar.enterEmail,
					minlength : epp.globalVar.emailMinLength,
					email : epp.globalVar.enterValidEmail,
					duplicate : epp.globalVar.existingUser
				},
				regVerifyEmailAddress : {
					required : epp.globalVar.emailMatch,
					equalToNoCase : epp.globalVar.emailMatch
				},
				regFirstName : {
					//text
					required : epp.globalVar.required
				},
				regLastName : {
					//text
					required : epp.globalVar.required
				},
				regCompanyName : {
					required : epp.globalVar.required,
					vppRegistered:epp.globalVar.vppRegisteredMsg
				},
				regAddressLine1 : {
					//text
					required : epp.globalVar.required,
					minlength : epp.globalVar.AddMinLength
				},
				regCity : {
					//select
					required : epp.globalVar.required
				},
				regZipCode : {
					//text
					required : epp.globalVar.required,
					zipFormat: epp.globalVar.enterValidZip
				},
				country : {
					//select
					required : epp.globalVar.required
				},
				state : {
					//select
					required : epp.globalVar.required
				},

				regPhone : {
					mformat : epp.globalVar.enterValidPhone
				}
				
			},
			onfocusout : function(element) {
				this.element(element);
				if($(element).hasClass('error')) $(element).closest('.ctrlHolder').addClass('error');
			},
			success : function(em) {
				$(em).closest('.ctrlHolder').removeClass('error');
				return false;
			},
			invalidHandler: function(form, validator) {
		        var errors = validator.numberOfInvalids();
		        if (errors) {
		            //resize code goes here
		            $('#eppRegForm .errorDashBoard').show();
		        }
		   },
			submitHandler : function(form) {
				//submit handler code
				if($(form).find('.errorDashBoard').is(':visible')) $(form).find('.errorDashBoard').hide();
				/*th.checkStateEnable($('#country').val(), th.trillEnabledList)?th.validateTrillium(form):th.submitForm(form);Enhancement BUG-00039854*/
                th.validateTrillium(form);
				return false;
			}
		});	
	},
	validateTrillium:function(form){ //Posting to Trillium services to get address validation.
		var formData={
				"email": $("#txt_email").val(),
				"verifyEmail":$("#txt_verify_email").val(),
				"salutation": $("#sel_salutation").val(),
				"salutationName": $("#sel_salutation option:selected").text(),
				"fName": $("#txt_firstName").val(),
				"lName": $("#txt_lastName").val(),
				"cName": $("#txt_company").val(),
				"add1": $("#txt_address1").val(),
				"add2": $("#txt_address2").val(),
				"city": $("#txt_city").val(),
				"zip": $("#txt_zip_postal_code").val(),
				"cCode": $("#country").val(),
				"countryName": $("#country option:selected").text(),
				"state": $("#state_province").val(),
				"stateName": $("#state_province option:selected").text(),
				"phone": $("#txt_busPhone").val()
			};
		//if(th.checkStateEnable($("#country").val(), th.trillEnabledList)){ Enhancement BUG-00039854
			vmf.ajax.post(epp.globalVar.trillinium, formData, function(jData){
				if(typeof jData!="object") jData=vmf.json.txtToObj(jData);

				if(jData != null && jData.AddressValidationJSON != null){

					var trF = $('#trilliumForm'), ad = jData.AddressValidationJSON, suggestedAdd, originalAdd;
					if(ad.hasCleanseError) {
						$("#txt_zip_postal_code").next('label').text(ad.cleanseError).show();
					 } else if(ad.hasSuggested && ad.suggestedAddress[0] != null && (ad.suggestedAddress[0] != "null"  )){
						vmf.modal.show('trilliumModal');
						trF.find('label[for="address_1"]').html('<span class="addL">'+ ad.suggestedAddress[0] + '</span><br/><span class="addL">' + ad.suggestedAddress[1]+'</span>');
						trF.find('label[for="address_2"]').html('<span class="addTitle">'+ epp.globalVar.originalAdd + '</span><br/><span class="addL">' + ad.originalAddress[0] + '</span><br/><span class="addL">' + ad.originalAddress[1]+'</span>')
					} else{
						th.submitForm(form);
					}
				} else {
					th.cmm.genericError();
				}
			},function(){th.cmm.genericError()},function(){vmf.loading.hide();},null,function(){vmf.loading.show({"overlay":true});});

		/*}else {

			th.submitForm(form);
		}*/
	},
	submitForm:function(form){
		form.submit();
	},
	//cmn object is for common code across all pages
	cmm:{
		events: function(){
			//Event registration of country selection to show states
			$('#country').live('change',function() {
				if($(this).val().length && th.checkStateEnable($(this).val(), th.stateEnabledList)) {
					$(this).closest('.ctrlHolder').next('.ctrlHolder').removeClass('hidden');
					vmf.ajax.post(epp.globalVar.getStatesForcountry, {"countryCode" : $(this).val()}, th.cmm.showStates, th.cmm.genericError,function(){vmf.loading.hide();},null,function(){vmf.loading.show();});
				} else {
					if($('#state_province').is(':visible'))
						$('#state_province option:eq(0)').attr('selected','selected').closest('.ctrlHolder').addClass('hidden');
				}
				if($(this).closest("section#ltSec").length) pp.adjustHt(($('#state_province').is(':visible'))?true:false);
				/*if($('#txt_busPhone').val().length && $(this).val().length){
					if($(this).val() == 'US' || $(this).val() == 'CA') $('#txt_busPhone').attr('maxlength',10).focusout();
						else $('#txt_busPhone').attr('maxlength',20).focusout();
				}*/
			});
			//To continue after trillium address validation
			$('#btnTrill').live('click',function(){
				var bSuggested = false, add = $('#trilliumForm').find('input:checked');
				if(add.attr('id') == 'address_1') bSuggested = true;
				//Affiliate trillium code below
				if ($('#trilliumForm').data("program")){
					if (bSuggested){
						pp.affData.affId=pp.affData.affId1;
						pp.buildAffiliates(true)
					} else{
						pp.affData.affId=pp.affData.affId2;
						pp.buildAffiliates();
					}
					vmf.modal.hide();
				}else {
					//if(bSuggested) { $('#selectedAddress').val("Y"); } else {$('#selectedAddress').val("N"); }
					$('#selectedAddress').val((bSuggested)?"suggested":"N");

					$('#trilliumForm').submit();
				}
			});
			
			$("form select,form input").keypress(function (e) {
			    var enterKey = 13;
			    if(e.which == enterKey) $(this).closest('form').submit();
			});

			$('#btnRegCancel').live('click',function(){
				location.replace(epp.globalVar.returnUrl); 
			});
			//To close modal window
			$('#btnCloseTrill').live('click',function(){
				vmf.modal.hide('trilliumModal');
			});
			$.validator.addMethod("mformat", function(val, element) {
				return th.cmm.validateBusPhone($.trim(val));
			},epp.globalVar.enterValidPhone);			
			/*Zip format*/
			$.validator.addMethod("zipFormat", function(val, element) {
				var postalCodeRegex = /^[-\sa-zA-Z0-9]+$/;
				return postalCodeRegex.test(val);
			},epp.globalVar.enterValidZip);
			/*Allow only Alpha nuemeric*/
			$.validator.addMethod("alphanumeric", function(value, element) {
				return this.optional(element) || /^[a-zA-Z0-9]+$/.test(value);
			}); 
		},
		validateBusPhone:function(num){
			var reg = new RegExp('^[0-9\\.\\+\\-\\(\\)\\ \\s]*$');
			return reg.test(num);
			/*if(reg.test(num)){
				if($('#country').val() == 'US' || $('#country').val() == 'CA'){
					if(num.length > 10) return false; else return true;
				}else{
					return true;
				}
			}else{
				return false;
			}*/
		},
		getStateEnabledList:function(){
			vmf.ajax.post(epp.globalVar.stateEnabledListURL, null, function(jData){
				if(typeof jData != "object") jData=vmf.json.txtToObj(jData);
	    		if(jData != null){
					var eData = jData.StateEnabledJSON;
					th.countriesList = eData.countryList;
					th.stateEnabledList = eData.stateEnabledCountries;
					th.trillEnabledList = eData.trilliniumEnabledCountries;
					if ($("#eppLocation").length) th.cmm.getCountries('eppLocation');
					if ($("#vppLocation").length) th.cmm.getCountries('vppLocation');
					
					th.cmm.getCountries('country');
	    		}
				if(epp.globalVar.pageName == "registration")  {
					location.search.indexOf("pre=1")!=-1?th.loadProfile():th.loadBasicProfile();
				}
			},function(){th.cmm.genericError();});
		},
		getCountries:function(con){
			var cList=[];
			for(var key in th.countriesList){
				cList.push('<option value="'+th.countriesList[key][1]+'">'+th.countriesList[key][0]+'</option>');
			}
			$('#'+con).find('option').not(':eq(0)').remove();
			$('#'+con).append(cList.join(''));
		},
		showStates:function(jData){//Loading States information based country selection
			if(typeof jData !="object") jData=vmf.json.txtToObj(jData);
	    	if(jData != null){
				var selC = $('#country').val(), selSt = $('#state_province'), oList=[], st = jData.StatesList;
	    		selSt.attr('disabled',true);
	    		for(var key in st) {
	    			oList.push('<option value="'+st[key][1]+'">'+st[key][0]+'</option>');
	    		}
	    		selSt.find('option').not(':eq(0)').remove().end().end().append(oList.join('')).attr('disabled','');
	    		selSt.find('option:eq(0)').attr('selected','selected');
	    		if(th.selState != null && th.selState.length) selSt.val(th.selState);
	    	} else {
				th.cmm.genericError();
			}
	    },
		showLoading: function(ref){
			ref.html("<div class=\"loading_small\">Loading...</div>").show();
		},
		genericError: function(){
			alert(epp.globalVar.errorMessage);
		}
	},
	//Purchasing Program(pp - EPP & VPP) code Start
	pp:{
		sections:{
			"vpp":{"sec":"#progInfo, #progInfo #vpp_intro, #optionalInfo #vppPartner,#progInfo .options .option, #progHead, #btnPanel","enrollNo":1,"optional":"#optionalInfo, #affiliate, #vppPartner", "progType":"VPP"},
			"vpp_epp":{"sec":"#progInfo, #progInfo #vppepp_intro, #optionalInfo #vppPartner,#optionalInfo #eppPartner,#progInfo .options .option,#progHead, #btnPanel","enrollNo":3,"optional":"#optionalInfo, #affiliate, #vppPartner, #eppPartner, #eppAlternate","progType":"VPP & EPP"},
			"epp":{"sec":"#progInfo, #progInfo #epp_intro, #optionalInfo #eppPartner, #eppMsg, #progInfo .vppNumber, #btnPanel","enrollNo":2,"optional":"#optionalInfo, #eppPartner, #eppAlternate", "progType":"EPP"},
			"all":{"sec":"#progInfo, #progInfo #vpp_intro, #progInfo #vppepp_intro, #progInfo #epp_intro, #eppAlternate, #optionalInfo #affiliate, #optionalInfo #vppPartner,#optionalInfo #eppPartner, #optionalInfo, #progInfo .options .option, #progHead, #eppMsg,#vppMsg"}
		}, //map vpp, epp and vpp_epp elements
		addEPPArr:[], //Maintain Add EPP Partner details in this array
		addVPPArr:[], //Maintain Add VPP Partner details in this array
		addAffArr:[], //Maintain Add Affiliate details in this array
		map:{},
		cTab:0,
		affData:[],
		$del:$("<div class=\"remImg\"><a href=\"javascript:void(0)\" class=\"remove\">Remove</a></div>"), //creating delete image in myAffiliates
		addVppOrEpp:null,
		vppValidated:false, // Maintain state to disaply option info
		vppNum:null,
		init:function(){
			vmf.scEvent =true;
			th=epp.registration;
			pp=th.pp;
			th.cmm.getStateEnabledList();
			pp.map={
				"vpBtn":{"url": epp.globalVar.vppSearchPartnerUrl,"ref":$("#vppPartner .column-wrapper")},
				"epBtn":{"url": epp.globalVar.eppSearchPartnerUrl,"ref":$("#eppPartner .column-wrapper")},
				"btnAddVppPartner":{"arr":"pp.addVPPArr"},
				"btnAddEppPartner":{"arr":"pp.addEPPArr"}
			};
			pp.validateProgForm();
			pp.validateFOForm();
			pp.validateAflForm();
			pp.validateVppForm();
			pp.validateEppForm();
			pp.clearFields();
			pp.bindPPEvents();
			th.cmm.events();
			var psValue = "-999";
			if(epp.globalVar != undefined && epp.globalVar.preselectvalue != undefined)	psValue = epp.globalVar.preselectvalue;

			if(location.search.indexOf("pre=1")!=-1||psValue.indexOf("1")!=-1){ //This condition has to be changed later
				pp.getData();
			}
			if(epp.globalVar.existingVPPCustomer) {
				$("#vpp,#vpp_epp").addClass('hidden');
                $("#epp").removeClass('hidden').trigger('click');
            } else {
            	$("#vpp,#vpp_epp").removeClass('hidden');
				$("#epp").addClass('hidden');
            	if(epp.globalVar.partnerProgram != null && epp.globalVar.partnerProgram == '1'){
            		$("#vpp_epp").addClass('hidden');
            		$("#vpp").trigger('click');
            	}else if(epp.globalVar.partnerProgram != null && epp.globalVar.partnerProgram == '2'){
            		$("#vpp").addClass('hidden');
            		$("#vpp_epp").trigger('click');
            	}
            }
            myvmware.hoverContent.bindEvents($('#vpp.tooltiptext'), 'defaultfunc');
             //code for ominature tracking of enrollment
			callBack.addsc({'f':'riaLinkmy','args':[epp.globalVar.pageName]})
		},
		getData:function(){
			vmf.ajax.post(epp.globalVar.loadEditProgramProfileDetails,null,pp.prePopulate,function(){th.cmm.genericError();},function(){vmf.loading.hide();},null,function(){vmf.loading.show();});
		},
		prePopulate: function(data){
			if(typeof data!="object") data=vmf.json.txtToObj(data);
			if(data.RegistrationJSON.enrolType==0 && data.RegistrationJSON.multipleVPP){ //If multipleVPP true then show error message and return
				$("#eppAlternate,#optionalInfo,#continue").addClass("hidden");
				$("#progInfo .eppAlert").removeClass("hidden");
				return;
			}
			pp.cTab=data.RegistrationJSON.enrolType;
			switch (pp.cTab){
				case "1": $("#vpp.program").trigger('click'); break;
				case "2": $("#epp.program").trigger('click'); break;
				case "3": $("#vpp_epp.program").trigger('click'); break;
			}
			if(pp.cTab == 0) th.cmm.getCountries('eppLocation');
			
			if(data.RegistrationJSON.affiliates && data.RegistrationJSON.affiliates.length>0){
				//pp.addAffArr=data.RegistrationJSON.affiliates;
				$.each(data.RegistrationJSON.affiliates, function(i,v){
					pp.affData={
						"cName": v.cName,
						"add1": v.add1,
						"add2": v.add2,
						"city": v.city,
						"zip": v.zip,
						"cCode": v.cCode,
						"state": v.state,
						"affId":v.affId,
						"countryName": v.cName
					};
					pp.buildAffiliates();
				});
				$("#affiliate fieldset").removeClass("closed").addClass("open");
			}
			if(data.RegistrationJSON.eppPartner && data.RegistrationJSON.eppPartner.length>0){
				//pp.addEPPArr=data.RegistrationJSON.eppPartner;
				$.each(data.RegistrationJSON.eppPartner, function(i,v){
					pp.buildPartner(v,$("#eppPartner section:eq(1)"));
				});
				$("#eppPartner fieldset").removeClass("closed").addClass("open");
			}
			if(data.RegistrationJSON.vppPartner && data.RegistrationJSON.vppPartner.length>0){
				//pp.addVPPArr=data.RegistrationJSON.vppPartner;
				$.each(data.RegistrationJSON.vppPartner, function(i,v){
					pp.buildPartner(v,$("#vppPartner section:eq(1)"));
				});
				$("#vppPartner fieldset").removeClass("closed").addClass("open");
			}
			if(data.RegistrationJSON.vppNumber && $.trim(data.RegistrationJSON.vppNumber).length>0) {$('#progInfoForm .vppNumber').show(); pp.vppNum=data.RegistrationJSON.vppNumber; $("#vppTxt").val(data.RegistrationJSON.vppNumber);}
			if(data.RegistrationJSON.memType ==1 || data.RegistrationJSON.memType == '1') $("input#mem_2:radio").attr("checked","checked").next('label').find('span.desc').show();
			else if (data.RegistrationJSON.memType ==0) $("input#mem_1:radio").attr("checked","checked").next('label').find('span.desc').show();
			if($.trim(data.RegistrationJSON.altFirstName).length>0) $("#txt_firstName").val(data.RegistrationJSON.altFirstName);
			if($.trim(data.RegistrationJSON.altLastName).length>0) $("#txt_lastName").val(data.RegistrationJSON.altLastName);
			if($.trim(data.RegistrationJSON.altEmail).length>0) $("#txt_email").val(data.RegistrationJSON.altEmail);
			if($.trim(data.RegistrationJSON.altPhone).length>0) $("#txt_busPhone").val(data.RegistrationJSON.altPhone);
			if(data.RegistrationJSON.affSetting==0 || data.RegistrationJSON.affSetting=="0"
			|| data.RegistrationJSON.affSetting == "ALLOW_AFTER_APPROVAL")
			{			
				$("input#aff_1:radio").attr("checked","checked");
			}
			else if(data.RegistrationJSON.affSetting==1 || data.RegistrationJSON.affSetting=="1" 
			|| data.RegistrationJSON.affSetting == "NEVER_ALLOW" ) {
				$("input#aff_2:radio").attr("checked","checked");
			}
			pp.flipOptional(1);
			if(data.RegistrationJSON.memType == '1' && (data.RegistrationJSON.enrolType == '1' || data.RegistrationJSON.enrolType == '3')) $('#affiliate').hide();
		},
		failPopulate: function(data){
		
		},
		clearFields:function(){
			$("#vppTxt,#txt_firstName,#txt_lastName,#txt_email,#txt_busPhone,.filter-content input.pInput,.filter-content select.selLocation").val('');
			//$("input#aff_1:radio").attr("checked","checked");
			$("input[name=membership]").removeAttr("checked");
			$("#affiliate").hide();
			$("#myAffiliates,ul.addedItems,ul.license_folders_id").html('');
			$(".message_container").show();
			$("#affiliate fieldset, #eppPartner fieldset, #vppPartner fieldset").removeClass('open').addClass('closed');
			pp.resetAffiliateForm();
		},
		resetAffiliateForm:function(){
			$("#txt_company,#txt_address1,#txt_address2,#txt_city,#txt_zip_postal_code,#country").val('');
			$("#country").trigger('change'); //This is to hide state dropdown
		},
		showOptionalInfo:function(){
			if($("#mem_1").is(":checked")){
				pp.flipOptional(1);
			} else if ($("#mem_2").is(":checked") && pp.vppValidated){
				pp.flipOptional(1);
				$("#affiliate").hide();
			} else {
				pp.flipOptional(0);
				//  $('#progInfoForm').find('.vppNumber,.desc').hide();
			}
		},
		bindPPEvents: function(){
			//Tab activity
			$(".program", $("#selProg")).bind('click', function(e) {//Tab functionality
				if ($(this).hasClass('disabled') || $(this).hasClass('active')) return;
				e.preventDefault();
				$(this).siblings().removeClass('active').end().addClass('active'); //highlight secected program
				$("#prodDetails").show(); //show details section
				$(pp.sections.all.sec).hide(); // hide  all internal section
				$(pp.sections[$(this).attr("id")].sec).show(); // show required sections
				//$("#progInfo .options span.desc").hide();
				//Style VPP number for EPP only state
				$("#progInfo .options").removeClass("epp_only vpp_only vpp_epp_only").addClass($(this).attr("id") + "_only");
				
				//$("#affiliate .message_container").show();
				pp.cTab = pp.sections[$(this).attr("id")].enrollNo;
				//$("#input#mem_2:radio, input:radio#mem_1").removeAttr('checked');
				//pp.clearFields();
				//$("input[name=membership]").removeAttr("checked");
				//$(".actionSection .warningctrls").addClass("disabled").find("input:checkbox").removeAttr('checked').attr("disabled","disabled");
				//Reset all forms to remove error messages
				$.each($("form"),function(i,e){
					if($(e).data('validator')) $(e).data('validator').resetForm();
				});
				//pp.flipOptional(0); // By default hide optionalInfo
				if(epp.globalVar.existingVPPCustomer ==0 && pp.checkDataInForms()) {
					$('#mem_1').trigger('click').attr('checked',false).next('label').find('.desc').hide();
				}
				pp.showOptionalInfo();
			});
			$(".remove", $("section .remImg")).live('click', function() {//Remove an affiliate
				var $this=$(this), li=$(this).closest('li'), ref=$(this).closest('.column-wrapper');
				if(!li.siblings().length) ref.find("section .message_container").show();
				if(li.data("id")){
					if (ref.find("input:radio[id='"+li.data("id")+"']").length>0) ref.find("input:radio[id='"+li.data("id")+"']").removeAttr("disabled");
				}
				li.remove();
			});
			$("a.profile-minimize-button", $("#prodDetails")).bind('click', function(e) {
				$(this).closest('fieldset').toggleClass('open closed');
				e.preventDefault();
			});
			$(".partnerList input:radio").live('click', function() {
				var ref = $(this).closest('.column');
				if(ref.find('input:checkbox').attr("checked"))
					pp.activateBtn(true, ref);
				else
					pp.activateBtn(false, ref);
			});
			$(".actionSection input:checkbox").bind('click', function() {
				var ref = $(this).closest('.column');
				if($(this).attr("checked")) {
					if(ref.find('input:radio:checked').length)
						pp.activateBtn(true, ref);
					else
						pp.activateBtn(false, ref)
				} else {
					pp.activateBtn(false, ref);
				}
			});
			$(".actionSection button").bind('click', function() {
				if($(this).hasClass("disabled")) return;
				var ref = $(this).closest('.column'), selRow;
				selrow = ref.find("input:radio:checked");
				var dt={"pId":selrow.attr("id"),"pName":selrow.val(),"cCode":selrow.attr("cCode"),"ppID":selrow.attr("ppID"),"cName":selrow.attr("cName"),"pKey":selrow.attr("pKey")}
				pp.buildPartner(dt,ref.next("section"));
				//vmf.json.txtToObj(pp.map[$(this).attr('id')]["arr"]).push(dt);
				$(this).addClass("disabled");
				selrow.attr("disabled","disabled").removeAttr("checked");
			});
			$('input:radio',$("#progInfo .option")).bind("click",function(){
				($(this).attr('id') == 'mem_2')? $('#progInfoForm .vppNumber').show():$('#progInfoForm .vppNumber').hide();
				$(this).next('label').find('span.desc').show();
				//pp.clearFields();
				if($(this).attr('id') == 'mem_1'){
					pp.flipOptional(1);
					$("#affiliate").show();
					$("#mem_2").next('label').find('span.desc').hide();
				}else{
					pp.flipOptional(0);
					$("#affiliate").hide();
					$("#mem_1").next('label').find('span.desc').hide();
				}
				$("#vppMsg").hide(); //Hide Confirmation Message
			});
			$(".validateVPP a",$("#progInfo")).bind('click',function(e){
				$('#progInfoForm').submit();
			});
			$("#continue").bind('click',function(){
				if(pp.validateSubmit()){
					var postData={};
					postData.affiliates=pp.getSelectedids($("ul#myAffiliates li"));
					postData.eppPartner=pp.getSelectedids($(".addedItems li",$("#eppPartner")));
					postData.vppPartner=pp.getSelectedids($(".addedItems li",$("#vppPartner")));
					postData.vppNumber=($("#vppTxt").length) ? pp.vppNum : $("#vppNum").text();
					
					if(postData.vppNumber != null){
						postData.vppNumber =$.trim(postData.vppNumber);
					}
					
					postData.altFirstName=$("#txt_firstName").val();
					postData.altLastName=$("#txt_lastName").val();
					postData.altEmail=$("#txt_email").val();
					postData.altPhone=$("#txt_busPhone").val();
					postData.enrolType=pp.cTab;
					postData.memType=$("input:radio[name='membership']:checked").val();
					postData.affSetting=$("input:radio[name='aff']:checked").val();
					vmf.ajax.post(epp.globalVar.regPurchaseProgUrl,postData,function(data){
						if(typeof data!="object") data=vmf.json.txtToObj(data);
						if(data.success) {
							location.replace(epp.globalVar.gotoReviewAndSubmitURL); 
						}
						else th.cmm.genericError();
					},function(){th.cmm.genericError();},function(){vmf.loading.hide();},null,function(){vmf.loading.show();})
				}
			});
			$("#submitRegistration").bind('click',function(){
				$('#eppSubmitForm').submit();
				/*vmf.ajax.post(epp.globalVar.submitRegistration,  null, function(data){
					if(typeof data!="object") data=vmf.json.txtToObj(data);
					if(data.success) location.replace(epp.globalVar.redirectToEnrollOptions);
						//alert("success");
					else th.cmm.genericError();
				})
				*/
			});
		},
		checkDataInForms: function(){
			if(!$('#vppTxt').val().length
				&& !$('#affiliateForm input').val().length
				&& !$('#affiliateForm select').val().length
				&& !$('#vppPartnersForm input').val().length
				&& !$('#vppPartnersForm select').val().length
				&& !$('#eppPartnersForm input').val().length
				&& !$('#eppPartnersForm select').val().length
				&& !$('#myAffiliates li').length 
				&& !$('#vppPartnersForm .addedItems').length 
				&& !$('#eppPartnersForm .addedItems').length) return true; else return false;
		},
		flipOptional: function(flag){
			var activetab=$("#selProg .program.active");

			if(activetab.length){

				if (flag){
					$(pp.sections[activetab.attr("id")].optional).show();
					$('#continue').removeAttr('disabled').removeClass('disabled'); 
				} else {
					$(pp.sections[activetab.attr("id")].optional).hide();
					$('#continue').attr('disabled','disabled').addClass('disabled'); 
				}

			}
		},
		validateSubmit: function(){
			switch(parseInt(pp.cTab,10)){
				case 1 : return $("#progInfoForm").valid()
				case 2 : return $("#progInfoForm").valid() && $("#altFunOwnerForm").valid()
				case 3 : return $("#progInfoForm").valid() && $("#altFunOwnerForm").valid()
				case 0 : return $("#altFunOwnerForm").valid()
			}
			//return (pp.cTab =1 ) ? ($("#progInfoForm").valid() && $("#altFunOwnerForm").valid()) : $("#progInfoForm").valid();
		},
		getSelectedids: function(ref){
			var ep = [];
			$.each(ref,function(i,p){
				ep.push($(p).data("id"));
			});
			return ep.join(',');
		},
		buildPartner: function(json,ref){
			var liRef=ref.find("ul.addedItems li"), fl=false;
			if(liRef.length){
				$.each(liRef,function(n,curLi){
					if($(curLi).data("pKey")==json.pKey){
						$(curLi).data("id",json.pId).find(".pCountry").html(json.cName);
						fl=true;
						return false;
					}
				});
				if(fl) return;
			}
			var $liObj = $("<li class=\"clearfix\"></li>"), data;
			data = "<div class=\"flowleft partnerInfo\"><span>" + json.pName + "</span><span class=\"pCountry\">" + json.cName +"</span></div>";
			$liObj.append(pp.$del.clone()).append(data).data("id",json.pId).data("pKey",json.pKey);
			ref.find(".message_container").hide().end().find("ul").append($liObj);
		},
		validateVPP:function(){
			var vpp=$.trim($("input#vppTxt").val());
			vmf.ajax.post(epp.globalVar.vppValiateUrl,{"vppNumber":vpp},function(data){
				if(typeof data!="object") data=vmf.json.txtToObj(data);
				if(data!=null && data.ValidateVppJSON!=null){
					data=data.ValidateVppJSON;
					if(data.status){
						$("#vppMsg").html(epp.globalVar.validVpp).removeClass('failure').addClass("success").css("display","inline-block").find("#vppNumber").text(vpp).end().find("#progType").text(pp.sections[$(".program.active").attr("id")].progType); //We have to remove inline css later
						pp.flipOptional(1);
						$("#affiliate").hide();
						pp.vppNum = vpp;
						pp.vppValidated=true;
					} else{
						$("input#vppTxt").val('').focus();
						$("#vppMsg").html(data.errorMsg).addClass('failure').removeClass("success").css("display","inline-block"); //We have to remove inline css later
						pp.flipOptional(0);
						pp.vppValidated=false;
					}
				} else {
					th.cmm.genericError();
					pp.vppValidated=false;
				}
			},function(){th.cmm.genericError()},function(){vmf.loading.hide();},null,function(){vmf.loading.show();});
		},
		activateBtn: function(flag,ref){
			(flag)? ref.find('button').removeClass('disabled').removeAttr("disabled"):ref.find('button').addClass('disabled').attr("disabled","disabled");
		},
		enableAddPartner: function(flag,ref){
			(flag)? ref.find("div.actionSection .warningctrls").removeClass('disabled').find("input:checkbox").removeAttr("disabled"):ref.find("div.actionSection .warningctrls").addClass('disabled').find("input:checkbox").attr("disabled","disabled").removeAttr('checked');
		},
		findPartners:function(btn){
			var offset = $(btn).closest('div.filter-content'), btnId = $(btn).attr("id"), url, pData, ref; url = pp.map[btnId].url, ref = pp.map[btnId].ref
			pData = {
				"partner" : $.trim(offset.find("input.pInput").val()),
				"country" : offset.find("select.selLocation").val()
			};
			ref.find('.partnerList ul').show();
			ref.find('.partnerList .message_container').addClass('hidden');
			if(!ref.find("div.actionSection .warningctrls").hasClass('disabled')) pp.enableAddPartner(false,ref);
			pp.activateBtn(false,ref.find('.warningctrls'));
			vmf.ajax.post(url, pData, pp.pSuccess(btnId, ref), pp.pFailure,null,null,th.cmm.showLoading(ref.find(".partnerList ul")));
		},
		pSuccess: function(btnId,refObj){
			return function(data){
				var json=(typeof data!="object")?vmf.json.txtToObj(data):data,liObj=[],exist_part=[];
				if(json!=null && json.partners != null){
					if(json.partners.length>0){
						var exist_partners=refObj.find('.addedItems li');
						if(exist_partners.length>0){
							$.each(exist_partners,function(index,value){
								exist_part.push($(value).data('id'));
							});
						}
						refObj.find(".partnerList .message_container").addClass('hidden');
						refObj.find("span.pNum").html("("+json.partners.length+")");
						$.each(json.partners,function(i,v){
							if($.inArray(v.pId,exist_part)!=-1)
							liObj.push("<li><input type=\"radio\" id='"+v.pId+"' name="+btnId+" value='"+v.pName+"' cCode='"+v.cCode+"' cName='"+v.cName + "' ppID='"+v.ppID+"' pKey='"+v.pKey+"'  disabled=\"disabled\"><label for='"+v.pId+"'>"+v.pName+"</label></li>");
							else liObj.push("<li><input type=\"radio\" id='"+v.pId+"' name="+btnId+" value='"+v.pName+"' cCode='"+v.cCode+"' cName='"+v.cName + "'ppID='"+v.ppID+"' pKey='"+v.pKey+"' ><label for='"+v.pId+"'>"+v.pName+"</label></li>");
						});
						refObj.find(".partnerList ul").html(liObj.join('')).show().end().find("div.actionSection .warningctrls").removeClass('disabled').find("input:checkbox").removeAttr("disabled");
						pp.enableAddPartner(true,refObj);
					} else{
						refObj.find(".partnerList ul").hide();
						refObj.find(".partnerList .message_container").html(epp.globalVar.noPartnerResults).removeClass('hidden');
						refObj.find("span.pNum").html("");
						pp.enableAddPartner(false,refObj);
					}
				} else {
					refObj.find(".partnerList ul").hide();
					refObj.find(".partnerList .message_container").html(epp.globalVar.errorMessage).removeClass('hidden');
					refObj.find("span.pNum").html("");
					pp.enableAddPartner(false,refObj);
				}
			}
		},
		pFailure: function(){
			alert(epp.globalVar.errorMessage);
		},
		validateProgForm:function() {
			$('#progInfoForm').validate({
				errorPlacement : function(error, element) {
					$(element).siblings(":last").after(error);
				},
				invalidHandler: function(form, validator) {
					if (!validator.numberOfInvalids())
						return;
					$('html, body').animate({
						scrollTop: $(validator.errorList[0].element).offset().top
					}, 2000);
				},
				rules : {
					vppTxt : {
						required : function(element){return ($("#mem_2").is(':visible'))?$("#mem_2").is(':checked'):true},
						vformat : true
					}
				},
				messages : {
					vppTxt : {
						required : epp.globalVar.required,
						vformat : epp.globalVar.vppFormat
					}
				},
				onfocusout : function(element) {
					$("#vppMsg").hide();
					this.element(element);
				},
				success : function(em) {
					$("#vppMsg").hide(); //Hide Confirmation Message
					return false;
				},
				submitHandler : function(form) {
					pp.validateVPP();
					return false;
				}
			});
			$.validator.addMethod("vformat", function(vpp, element) {
				return (this.optional(element) || (vpp.match(/^[vV][0-9]{8}$/)));
			});
		}, 
		validateFOForm:function() {
			$.validator.addMethod("duplicate", function(val, element) {
				var curEmail = "";
				if(epp.globalVar.userEmailAddress != null) {
					curEmail = epp.globalVar.userEmailAddress.toLowerCase();
				}
				var newEmail = val.toLowerCase();
				if(newEmail == curEmail) {
					return false;
				} else {
					return true;
				}
			}, epp.globalVar.existingUser);
			
			$.validator.addMethod("customEmail", function(val, element) {
				var emailPattern = /^[a-zA-Z0-9._-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9.]+$/;
				return (emailPattern.test(val));
			},epp.globalVar.enterValidEmail);
			
			$('#altFunOwnerForm').validate({
				errorPlacement : function(error, element) {
					th.placeErrors(error, element);
				},
				invalidHandler: function(form, validator) {
					if (!validator.numberOfInvalids())
						return;
					$('html, body').animate({
						scrollTop: $(validator.errorList[0].element).offset().top
					}, 2000);
				},
				rules : {
					altOwnerEmail : {
						required : true,
						minlength : 6,
						email : true,
						duplicate : true,
						customEmail : true
					},
					altOwnerFirstName : {
						//text
						required : true
					},
					altOwnerLastName : {
						//text
						required : true
					},
					altOwnerPhone:{
						required:false,
						mformat:true
					}
				},
				messages : {
					altOwnerEmail : {
						required : epp.globalVar.enterEmail,
						minlength : epp.globalVar.emailMinLength,
						email : epp.globalVar.enterValidEmail,
						duplicate : epp.globalVar.existingUser
					},
					altOwnerFirstName : {
						//text
						required : epp.globalVar.required
					},
					altOwnerLastName : {
						//text
						required : epp.globalVar.required
					},
					altOwnerPhone : {
						mformat : epp.globalVar.enterValidPhone
					}
				},
				onfocusout : function(element) {
					this.element(element);
				},
				success : function(em) {
					return false;
				},
				submitHandler : function(form) {
					//submit handler code
					return false;
				}
			});
		}, 
		validateAflForm:function() {
			$.validator.addMethod("chkduplicate", function(val, element) {
				var ret=true;
				if($("#affiliate .company").length>0){
					$.each($("#affiliate .company"),function(i,v){
						if ($.trim(val).toLowerCase() == $.trim($(v).html()).toLowerCase()){
							ret =false;
						}
					});
				}
				return ret;
			},epp.globalVar.duplicateCompanyAdded);
			$.validator.addMethod("chkExist", function(val, element) {
				var ret=true;
				vmf.ajax.post(epp.globalVar.affiliateExistUrl,{"cName":$.trim(val)},function(d){
					if(typeof d !="object") d=vmf.json.txtToObj(d);
					if(d.status) ret=false;
					},function(){th.cmn.genericError()},function(){vmf.loading.hide()},null,function(){vmf.loading.show()},false);
				return ret;
			},epp.globalVar.duplicateCompanyExist);
			
			$('#affiliateForm').validate({
				errorPlacement : function(error, element) {
					th.placeErrors(error, element);
				},
				rules : {
					txt_company : {
						required : true,
						chkduplicate:true,
						chkExist:true
					},
					txt_address1 : {
						//text
						required : true,
						minlength : 5
					},
					txt_city : {
						//select
						required : true
					},
					txt_zip_postal_code : {
						//text
						required : true,
						zipFormat : true
					},
					country : {
						//select
						required : true
					},
					state_province : {
						//select
						required : {
	                        depends: function(element){
	                           return th.checkStateEnable($("#country").val(), th.stateEnabledList);
	                      	}
	                    }
					}
				},
				messages : {
					txt_email : {
						required : epp.globalVar.enterEmail,
						minlength : epp.globalVar.emailMinLength,
						email : epp.globalVar.enterValidEmail,
						remote : epp.globalVar.existingUser
					},
					txt_verify_email : {
						required : epp.globalVar.enterEmail,
						equalTo : epp.globalVar.emailMatch
					},
					txt_firstName : {
						//text
						required : epp.globalVar.required
					},
					txt_lastName : {
						//text
						required : epp.globalVar.required
					},
					txt_company : {
						required : epp.globalVar.required,
						chkduplicate: epp.globalVar.duplicateCompanyAdded,
						chkExist: epp.globalVar.duplicateCompanyExist
					},
					txt_address1 : {
						//text
						required : epp.globalVar.required,
						minlength : epp.globalVar.AddMinLength
					},
					txt_city : {
						//select
						required : epp.globalVar.required
					},
					txt_zip_postal_code : {
						//text
						required : epp.globalVar.required,
						zipFormat: epp.globalVar.enterValidZip
					},
					country : {
						//select
						required : epp.globalVar.required
					},
					state_province : {
						//select
						required : epp.globalVar.required
					}
				},
				onfocusout : function(element) {
					this.element(element);
				},
				success : function(em) {
					return false;
				},
				submitHandler : function(form) {
					pp.checkAffiliates();
					return false;
				}
			});
		}, 
		validateVppForm:function() {
			// Validating partner search form of VPP
			$('#vppPartnersForm').validate({
				errorPlacement : function(error, element) {
					th.placeErrors(error, element);
				},
				rules : {
					vppPartnerName : {
						required : true,
						minlength : 3
					},
					vppLocation : {
						required : true
					}
				},
				messages : {
					vppPartnerName : {
						required : epp.globalVar.required,
						minlength : epp.globalVar.firstNameMinLength
					},
					vppLocation : {
						required : epp.globalVar.required
					}
				},
				onfocusout : function(element) {
					this.element(element);
				},
				success : function(em) {
					return false;
				},
				submitHandler : function(form) {
					//submit handler code
					pp.addVppOrEpp = 'add vpp partners'
					pp.findPartners($('#vpBtn'));
					return false;
				}
			});
		}, 
		validateEppForm:function() {
			// Validating partner search form of VPP
			$('#eppPartnersForm').validate({
				errorPlacement : function(error, element) {
					th.placeErrors(error, element);
				},
				rules : {
					eppPartnerName : {
						required : true,
						minlength : 3
					},
					eppLocation : {
						required : true
					}
				},
				messages : {
					eppPartnerName : {
						required : epp.globalVar.required,
						minlength : epp.globalVar.firstNameMinLength
					},
					eppLocation : {
						required : epp.globalVar.required
					}
				},
				onfocusout : function(element) {
					this.element(element);
				},
				success : function(em) {
					return false;
				},
				submitHandler : function(form) {
					//submit handler code
					pp.addVppOrEpp = 'add epp partners'
					pp.findPartners($('#epBtn'));
					return false;
				}
			});
		},
		checkAffiliates:function(){
			pp.affData={
				"cName": $("#txt_company").val(),
				"add1": $("#txt_address1").val(),
				"add2": $("#txt_address2").val(),
				"city": $("#txt_city").val(),
				"zip": $("#txt_zip_postal_code").val(),
				"cCode": $("#country").val(),
				"state": $("#state_province").val(),
				"stateName": $("#state_province option:selected").text(),
				"countryName": $("#country option:selected").text()
			};
			vmf.ajax.post(epp.globalVar.trilliumUrl,pp.affData,function(data){
				if(typeof data!= "object") data = vmf.json.txtToObj(data);
				if(data!=null){
					pp.affData.affId=data.affId;
					if(data.AddressValidationJSON != null && data.AddressValidationJSON.hasCleanseError) {
						$("#txt_zip_postal_code").next('label').text(data.AddressValidationJSON.cleanseError).show();
					}else if(data.AddressValidationJSON!= null && data.AddressValidationJSON.hasSuggested){
						var ad = data.AddressValidationJSON, trF = $('#trilliumForm');
						vmf.modal.show('trilliumModal');
						trF.find('label[for="address_1"]').html(ad.suggestedAddress[0] + '<br/>' + ad.suggestedAddress[1])
						trF.find('label[for="address_2"]').html('<strong>' + epp.globalVar.originalAdd + '</strong><br/>' + ad.originalAddress[0] + '<br/>' + ad.originalAddress[1]);
						trF.data("program",pp.cTab);
						pp.affData.sugAdd1=ad.suggestedAddress[0];
						pp.affData.sugAdd2=ad.suggestedAddress[1];
						pp.affData.affId1=ad.suggestedAddress[2];
						pp.affData.affId2=ad.originalAddress[2];
						$($("div.afferr"),$("#affiliate")).addClass("vhidden");
					} else if (data.AddressValidationJSON!= null && !data.AddressValidationJSON.hasSuggested){
						//pp.addAffArr.push(pp.affData);
						pp.affData.affId=data.AddressValidationJSON.affId;
						pp.buildAffiliates();
						$($("div.afferr"),$("#affiliate")).addClass("vhidden");
					} else {
						$($("div.afferr"),$("#affiliate")).html(data.error).removeClass("vhidden");
					}
				} else {
					th.cmm.genericError();
				}
			},function(){th.cmm.genericError()},function(){vmf.loading.hide();},null,function(){vmf.loading.show();});
		},
		buildAffiliates: function(flg){
			var $myaff=$("#myAffiliates"),$liObj=$("<li class=\"clearfix\"></li>"),myArr=[], stateVal, address2Val;
			$("#affiliate .message_container").hide();
			myArr.push("<div class=\"flowleft\"><span class=\"company\">"+pp.affData.cName+"</span>");
			if(pp.affData.state != null)stateVal=pp.affData.state; else stateVal='';
			if(pp.affData.add2 != null)address2Val=pp.affData.add2; else address2Val='';
			if(flg){ // From Trillium Suggested address
				myArr.push("<span>"+pp.affData.sugAdd1+"</span><span>"+pp.affData.sugAdd2+"</span>");
			} else {
				myArr.push("<span>"+pp.affData.add1+"</span>");
				if (address2Val != null && address2Val != '') {
					myArr.push("<span>"+pp.affData.add2+"</span>");
				}
				myArr.push("<span>"+pp.affData.city+", "+ stateVal+" "+pp.affData.zip+"</span>");
				myArr.push("<span>"+pp.affData.countryName+"</span></div>");
			}
			$liObj.append(pp.$del.clone()).append(myArr.join('')).data("id",pp.affData.affId);
			$myaff.append($liObj);
			pp.affData={};
			pp.resetAffiliateForm()
		},
		adjustHt : function(flg){
			if(flg){ 
				$('#ltSec, #rtSec').removeClass('htThreeNinefive').addClass('htFourFourZero');
				$('#ltSec .affilliate, #rtSec .scroll').addClass("htFourTwoZero").removeClass('htThreeSevenfive');
			} else {
				$('#ltSec, #rtSec').addClass('htThreeNinefive').removeClass('htFourFourZero');
				$('#ltSec .affilliate, #rtSec .scroll').removeClass("htFourTwoZero").addClass('htThreeSevenfive');
			}
		},
		review:{
			init: function(){
                vmf.scEvent=true;
				$("#editProfile").bind('click',function(){
					if(epp.globalVar.fromPartner == 'Y' && epp.globalVar.shortProfile == 'Y'){
						location.replace(epp.globalVar.editPartnerProfileURL+"&pre=1");
					}else{
						location.replace(epp.globalVar.editProfileURL+"&pre=1");
					}
				});
				$("#editProgram").bind('click',function(){
					vmf.ajax.post(epp.globalVar.loadEditProgramProfileDetails,  null, function(data){
						if(data.RegistrationJSON.enrolType == 0){
							//TODO replace the url with correct jsp
							location.replace(epp.globalVar.redirectToEppEnrollOptions+"&pre=1");
						}else{
							location.replace(epp.globalVar.redirectToEnrollOptions+"&pre=1");
						}
					})
				});
				$("#chk_tt_uw").bind('click', function() {
					var $btn = $("#submitRegistration");
					($(this).attr("checked"))?$btn.removeClass('disabled').attr('disabled',''):$btn.addClass('disabled').attr('disabled','true');
				});
				$("#submitRegistration").bind('click',function(){
					$('#eppSubmitForm').submit();
				});
				//BUG-00041949
				$('#recaptcha_response_field').live('keypress',function(e){
					if(e.which == 13){
						if($("#chk_tt_uw").attr('checked') && !$("#submitRegistration").attr('disabled')){
							$('#eppSubmitForm').submit();
						}
						else return false;
					} 
				});

				$('#btnRegCancel').live('click',function(){
					location.replace(epp.globalVar.returnUrl); 
				});
				//Ominature capture for review page
				callBack.addsc({'f':'riaLinkmy','args':[epp.globalVar.pageName + ' : review']})
			}
		},
		confirm:{
			init: function(){
                vmf.scEvent=true;
				var dt = {emailAddress : epp.globalVar.emailAddress}
				var enableEPPWidgetUrl = (location.protocol + '//'+location.hostname + epp.globalVar.enableEPPWidgetAjaxUrl);
				if(epp.globalVar.enableEPPWidgetAjaxUrl.length && epp.globalVar.enrollType != "1"){
					vmf.ajax.post(enableEPPWidgetUrl,dt,function(jData){
						if(jData != null){ 
												
						}
					});
				}
                if(parseInt(epp.globalVar.enrollmentType) == 0) callBack.addsc({'f':'riaLinkmy','args':[epp.globalVar.pageName + ' : epp-bolt-on submit']})
                else if(parseInt(epp.globalVar.enrollmentType) == 1) callBack.addsc({'f':'riaLinkmy','args':[epp.globalVar.pageName + ' : vpp form submit']})
                else if(parseInt(epp.globalVar.enrollmentType) == 2) callBack.addsc({'f':'riaLinkmy','args':[epp.globalVar.pageName + ' : epp form submit']})
                else if(parseInt(epp.globalVar.enrollmentType) == 3) callBack.addsc({'f':'riaLinkmy','args':[epp.globalVar.pageName + ' : vpp-epp form submit']})
			}
		}
	}
  }
