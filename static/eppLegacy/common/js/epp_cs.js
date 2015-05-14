if (typeof(epp) == "undefined")  epp = {};

epp.cs =  { //Start of fund details   
		th:null,
		dt:null,
		topUpCheck:true,
		bEmail:false,// boolean for email validation in cuctomer search
		ndMsg : epp.globalVar.noDatamsg,
    init: function() {
		th = epp.cs;
		th.validateCustomSearch();
		//vmf.scEvent = true;
		if($('#vppPortalPanel ul.menu').length){
			var menu = $('#vppPortalPanel ul.menu');
			menu.find('li .linkItem').removeClass('active');
			if($('#pageId').length) menu.find('li:eq('+ $('#pageId').val() +')').find('.linkItem').addClass('active');
		}
		$('#eppCustomSearch input').keypress(function(e){
		    var enterKey = 13;
		    if(e.which == enterKey) $('#btnCustomSearch').not('.disabled').trigger('click');
		});
    },//end of init
    buildSearchResults:function(){
        if($('#eppSearchResults_tbl').is(':visible')){
			var $emailTxt = $('#emailTxt').val(),$companyNameTxt = $('#companyNameTxt').val(),$vppTxt = $('#vppTxt').val(); 
			var fURL = epp.globalVar.fundOwnersurl+"&email="+$emailTxt+"&cname="+encodeURIComponent($companyNameTxt)+"&vpp="+$vppTxt;						
			vmf.datatable.reload($('#eppSearchResults_tbl'),fURL);			
		}
		else{
    	   th.buildTable();
       }
    },
	buildTable: function(){
		$("#resultsContainer").show();
		var $emailTxt = $('#emailTxt').val(),$companyNameTxt = $('#companyNameTxt').val(),$vppTxt = $('#vppTxt').val(); 
		var fURL = epp.globalVar.fundOwnersurl+"&email="+$emailTxt+"&cname="+encodeURIComponent($companyNameTxt)+"&vpp="+$vppTxt;
		
		vmf.datatable.build($('#eppSearchResults_tbl'),{
	    		//"bRetrieve": true,
	            //"bDestroy":true,
				"aoColumns": [
					{"sTitle": "<span class='descending'>"+epp.globalVar.fundowneremail+"</span>","sWidth":"275px"},
					{"sTitle": "<span class='descending'>"+epp.globalVar.companyname+"</span>","sWidth":"320px"},
					{"sTitle": epp.globalVar.vppnumber,"sWidth":"160px","bSortable":false},
					{"sTitle": "", "bVisible":false},
					{"sTitle": "", "bVisible":false}
				],
				"oLanguage": {						
					"sEmptyTable": th.ndMsg
				},
				"sAjaxSource": fURL,
				"bInfo":false,
				"bServerSide": false,   
				"bFilter":false,
				"fnRowCallback": function(nRow,aData,iDisplayIndex){
					var $nRow=$(nRow);
					var fundIDValue = encodeURIComponent(aData[4]);
					var fundsURL = epp.globalVar.showFundsURL+"&fundOwnerId="+fundIDValue;
					if(aData[0]=="dist"){
						$nRow.find("td:eq(0)").html("<a href=\""+fundsURL+"\">"+aData[1] +"</a>");
					}else{
						$nRow.find("td:eq(0)").html("<a href=\""+fundsURL+"\">"+ aData[0]+"<br/>"+aData[1] +"</a>");
					}
					$nRow.find("td:eq(1)").html(aData[2]);
					//var configURLValue = epp.globalVar.eppConfigURL+"?_VM_preselect=EPP&_VM_autoSubmit=false&_VM_fundOwnerEmail="+aData[1]+"&_VM_vppNumber="+aData[3];					
					$nRow.find("td:eq(2)").html(aData[3]);
					return nRow;
				},				
				"fnInitComplete": function (){
				if(!$('#loadingerrormsg').is(':visible')) $('#downloadBtn').show();
				if(!$('#loadingerrormsg').is(':visible')) $('#downloadBtnSPP').show();
				var settings= this.fnSettings();					
				if(settings.jqXHR && settings.jqXHR.responseText!==null && settings.jqXHR.responseText.length && typeof settings.jqXHR.responseText =="string"){
					th.SearchResults = vmf.getObjByIdx(vmf.json.txtToObj(settings.jqXHR.responseText),0);
					/*
					siva to check
					if(!th.SearchResults.access){
						th.clearTable('eppSearchResults_tbl',epp.globalVar.noAccessmsg); 
						epp.cmn.htAdjustwithContent('#contentPanel','ul.menu');
					}*/
					if(typeof th.SearchResults.error!="undefined" && $.trim(th.SearchResults.error).length){
						th.clearTable('eppSearchResults_tbl',th.SearchResults.error);
					}
				}
				// For adjusting height in the menu section call common function
				//epp.cmn.htAdjustwithContent('#contentPanel','ul.menu');				
				},
				"bPaginate": false,
				"sPaginationType": "full_numbers"
			});
			
			$('#downloadBtn').bind('click', function(e){ // On button click, check the validations and pass the action
				e.preventDefault();
				location.href=epp.globalVar.downloadFundOwnersExcelReportURL;
				if(typeof riaLinkmy != "undefined") riaLinkmy('epp_partner central home : epp customer search : download search results');
			});
			
			$('#downloadBtnSPP').bind('click', function(e){ // On button click, check the validations and pass the action
				e.preventDefault();
				location.href=epp.globalVar.downloadSPPFundOwnersExcelReportURL;
				if(typeof riaLinkmy != "undefined") riaLinkmy('epp_partner central home : epp customer search : download search results');
			});
	},
    clearTable: function(tableId,msg_text){
		var table = $('#'+tableId).dataTable();
		table.fnClearTable();
		table.find('td.dataTables_empty').html(msg_text);
		$('#downloadBtn').hide();
		$('#downloadBtnSPP').hide();
	},
    validateErrors: function(){  
    	//var $emailTxt = $('#emailTxt').val(),
		var $emailTxt = $('#emailTxt').val($.trim($('#emailTxt').val())),
    		$companyNameTxt = $('#companyNameTxt').val(),
    		$vppTxt = $('#vppTxt').val(); 
    		
    	if($.trim($emailTxt).length==0 && $.trim($companyNameTxt).length==0 && $.trim($vppTxt)==0) return true;
    	else return false;
    },
    validateCustomSearch: function(){
    	$('.tooltiptext').attr('title',epp.globalVar.tootipText);
		myvmware.hoverContent.bindEvents($('.tooltiptext'), 'defaultfunc'); 
    	var queryString = $('#eppCustomSearch').serialize();  	
    	$.validator.addMethod("customEmail", function(val, element) {
    		var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
			return (emailPattern.test(val) || !val.length);
		},epp.globalVar.providemail);
		
        // Validation code       
		$('#eppCustomSearch').validate({ 
			errorPlacement : function(error, element) {
				element.parents('.column').find('.errorHolder').html(error);				
			},
			rules : {
				emailTxt : { 
					required : {
						depends: function(element){ 
						return th.validateErrors();						
						}
					},
					minlength : 6,
					email : true,
					customEmail:true
				},
				companyNameTxt : {
					required : {
						depends: function(element){ 
						return th.validateErrors();
						}
					},
					minlength : 2
				},
				vppTxt : {
					required : {
						depends: function(element){ 
						return th.validateErrors();
						}
					},
					minlength : 9,
					vformat : true
				}
			},
			messages : {
				emailTxt : {
					required : epp.globalVar.providemail,
					minlength : epp.globalVar.providemail,
					email : epp.globalVar.providemail
				},
				companyNameTxt : {
					required : epp.globalVar.providecname,
					minlength : epp.globalVar.providecname
				},
				vppTxt : {
					required : epp.globalVar.providevpp,
					minlength : epp.globalVar.providevpp,
					vformat : epp.globalVar.providevpp
				}
			},	
			onfocusout: function(element){
				this.element(element);				
			},
			success : function(em) {
				return false;
			},
			submitHandler: function(form) {
				th.buildSearchResults();
			}
		});
		$.validator.addMethod("vformat", function(vpp, element) {
	       return (this.optional(element) || (vpp.match(/^[vV][0-9]*$/)));
	    });		
    },
   buildActiveFunds:function(){    	
        vmf.scEvent =true;
		var activeFundsURL = epp.globalVar.showActiveFundsURL+"&fundOwnerIdValue="+encodeURIComponent(epp.globalVar.fundOwnerIdSelected);
    	vmf.datatable.build($('#activeFunds_tbl'),{
			"aoColumns": [
				{"sTitle": "<span class='descending'>"+epp.globalVar.fundNameTitle+"</span>","sWidth":"275px"},
				{"sTitle": "<span class='descending'>"+epp.globalVar.fundExpiryTitle+"</span>","sWidth":"120px"},
				{"sTitle": "<span class='descending'>"+epp.globalVar.trTitle+"</span>","sWidth":"100px"},
				{"sTitle": epp.globalVar.redemTitle,"bSortable":false},
				{"sTitle": "", "bVisible":false},
				{"sTitle": "", "bVisible":false}
			],
			"oLanguage": {
				"sEmptyTable":epp.globalVar.activeFundstxt
			},
			"sAjaxSource": activeFundsURL,
			"bInfo":false,
			"bServerSide": false,   
			"bFilter":false,
			"fnRowCallback": function(nRow,aData,iDisplayIndex){
				var $nRow=$(nRow);				 	
				
				if(aData[3]==1)
				{	
					var drURL = epp.globalVar.downloadRedemptionExcelReportURL+"&fundID="+encodeURIComponent(aData[6]);
					$nRow.find("td:eq(3)").html('<a href="'+drURL+'" class="button secondary">Download</a>');	
				}else{
					$nRow.find("td:eq(3)").html('<a href="#" class="button secondary disabled" disabled="true">Download</a>');
				}			
				
				if(aData[4]==1)$nRow.find("td:eq(1)").html('<span class=\"textRed\">'+aData[1]+'</span>');

				if(aData[5]==1){
					$nRow.find("td:eq(0)").html(aData[0]+'<span class=\"badge topup tooltiptext\">'+epp.globalVar.topUpText+'</span>');
				}			
				if(epp.cs.topUpCheck && aData[7] != null && $.trim(aData[7]) != ""){
					//$('#topUpDiv').append(aData[7]);	
					epp.cs.topUpCheck = false;
				}
				return nRow;					
			},
			"fnInitComplete": function (){
				$('.tooltiptext').attr('title',epp.globalVar.tootipText);
				myvmware.hoverContent.bindEvents($('.tooltiptext'), 'defaultfunc');
				// For adjusting height in the menu section call common function
				//epp.cmn.htAdjustwithContent('#contentPanel','ul.menu');	
			},
			"bPaginate": false,
			"sPaginationType": "full_numbers"
		});
		$('#activeFunds_tbl td a').live('click', function(e){ // On button click, check the validations and pass the action
            if(!$(this).hasClass('disabled')) {
                e.preventDefault();
                window.location=$(this).attr('href');
                if(typeof riaLinkmy != "undefined") riaLinkmy('epp_partner central home : epp customer search : download redemption');
            }
        });
		//SPP Redemption Report
		var sppActiveFundsURL = epp.globalVar.showSPPActiveFundsURL+"&fundOwnerIdValue="+encodeURIComponent(epp.globalVar.fundOwnerIdSelected);
    	vmf.datatable.build($('#sppActiveFunds_tbl'),{
			"aoColumns": [
				{"sTitle": "<span class='descending'>"+epp.globalVar.fundNameTitle+"</span>","sWidth":"275px"},
				{"sTitle": "<span class='descending'>"+epp.globalVar.fundExpiryTitle+"</span>","sWidth":"120px"},
				{"sTitle": "<span class='descending'>"+epp.globalVar.trTitle+"</span>","sWidth":"100px"},
				{"sTitle": epp.globalVar.redemTitle,"bSortable":false}
			],
			"oLanguage": {
				"sEmptyTable":epp.globalVar.activeFundstxt
			},
			"sAjaxSource": sppActiveFundsURL,
			"bInfo":false,
			"bServerSide": false,   
			"bFilter":false,
			"fnRowCallback": function(nRow,aData,iDisplayIndex){
				var $nRow=$(nRow);				 	
				var drURL = epp.globalVar.downloadSPPRedemptionExcelReportURL+"&fundID="+encodeURIComponent(aData[3]);
				$nRow.find("td:eq(3)").html('<a href="'+drURL+'" class="button secondary">Download</a>');				
				return nRow;					
			},
			"fnInitComplete": function (){
			},
			"bPaginate": false,
			"sPaginationType": "full_numbers"
		});
		$('#sppActiveFunds_tbl td a').live('click', function(e){ // On button click, check the validations and pass the action
            if(!$(this).hasClass('disabled')) {
                e.preventDefault();
                window.location=$(this).attr('href');
                if(typeof riaLinkmy != "undefined") riaLinkmy('pp_partner central home : epp customer search : download SPP redemption');
            }
        });
		//SPP Redemption Report
    },
    customerSearch: function(){ //Customer Email Search Function
    	$('.tooltiptext').attr('title',epp.globalVar.tootipText); //tool tip
		myvmware.hoverContent.bindEvents($('.tooltiptext'), 'defaultfunc');
		bEmail=false;//bAuthorize=false;
		$('.errorHolder, .errorAuHolder').empty();
		$('.emailInput[name=customerEmail]').bind('focusout',function(){ //email validation
			var intRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$/i,
				emailTxt = $.trim($(this).val());
			if(!$.trim(emailTxt).length){
				$('.errorHolder').html(epp.globalVar.emailRequired);
				bEmail=false;
				if($('#authorize').attr('checked')) $('#btnCustomSearch').addClass('disabled').attr('disabled',true);
			}
			else if(!intRegex.test(emailTxt)){
				$('.errorHolder').html(epp.globalVar.properEmail);
				bEmail=false;
				if($('#authorize').attr('checked')) $('#btnCustomSearch').addClass('disabled').attr('disabled',true);
			}
			else {
				bEmail=true;
				$('.errorHolder').html('');
				if($('#authorize').attr('checked')) $('#btnCustomSearch').removeClass('disabled').attr('disabled',false);
			}
		});	
		$('#authorize').bind('change', function() {
            if($(this).attr('checked')) {
            	if(bEmail){
            		$('#btnCustomSearch').removeClass('disabled').attr('disabled',false);
            	}else{
            		$('.emailInput[name=customerEmail]').trigger('focusout');
            	}
            }else{
            	$('#btnCustomSearch').addClass('disabled').attr('disabled',true);
            } 
        });
		$('#btnCustomSearch').bind('click', function(e){ // On button click, check the validations and pass the action
			e.preventDefault();
			if(bEmail){
				$('.errorHolder, .errorAuHolder').empty();
				epp.cs.validateSearchCustomer($('.emailInput[name=customerEmail]').val());
			}else{ 
				$('.errorAuHolder').empty();
				$('.emailInput[name=customerEmail]').trigger('focusout');
			}				
		});
    },
    validateSearchCustomer: function(email){// Display the results on entered email values
   	var $resultMsg = $('.resultMsg');
	$('#searchResultContent').show();
	$resultMsg.html('<div class="loadingWrapper"><div class="loading_big">Loading...</div></div>');	
	var furl = epp.globalVar.getCustomerStatusURL,url="",pdata="";
	url=furl.split("?")[0];
	pdata=furl.split("?")[1]+"&email="+email;
			vmf.ajax.post(url,pdata,function(jData){
			if(jData != null && jData.CustomerProfileVO != null){
				if(jData.CustomerProfileVO != null && jData.CustomerProfileVO.errorCode != null 
				&& $.trim(jData.CustomerProfileVO.errorCode).length) {
					if(jData.CustomerProfileVO.errorCode == 'VM-VPP-94'){
						$resultMsg.html(epp.globalVar.pmamsg);
					}
					if(jData.CustomerProfileVO.errorCode == '4015' && jData.CustomerProfileVO.userType=='INACTIVE'){
						$resultMsg.html(epp.globalVar.inactiveusermsg);
					}
					if(jData.CustomerProfileVO.errorCode == '4016' && jData.CustomerProfileVO.userType=='DEACTIVATED'){
						$resultMsg.html(epp.globalVar.deactiveusermsg);
					}
				}else
				if(jData.CustomerProfileVO.enrollmentStatusVO == ""){			
					$resultMsg.html(epp.globalVar.noRegisterMsg+"&nbsp;<a class=\"nWindowIcon\" target=\"_blank\" href=\""+epp.globalVar.registerlink+"\">"+epp.globalVar.registerlinkText+"</a>");
				}else
				if(jData.CustomerProfileVO != null && jData.CustomerProfileVO.enrollmentStatusVO != null) {
				
					if(jData.CustomerProfileVO.enrollmentStatusVO.nonCustomer=="Y"){
							$resultMsg.html(epp.globalVar.noRegisterMsg+"&nbsp;<a class=\"nWindowIcon\" target=\"_blank\"  href=\""+epp.globalVar.registerlink+"?_VM_partnerRegPage=true&_VM_emailAddress="+email+"&_VM_partnerID="+encodeURIComponent(jData.CustomerProfileVO.partnerID)+"&_VM_partnerPrgm="+encodeURIComponent(epp.globalVar.partnerProgram)+"\">"+epp.globalVar.registerlinkText+"</a>");
					}
					if(jData.CustomerProfileVO.enrollmentStatusVO.profileComplete=="N"){					
							$resultMsg.html(epp.globalVar.noRegisterMsg+"&nbsp;<a class=\"nWindowIcon\" target=\"_blank\"  href=\""+epp.globalVar.shortProfileLink+"&_VM_emailAddress="+email+"&_VM_partnerID="+encodeURIComponent(jData.CustomerProfileVO.partnerID)+"&_VM_partnerPrgm="+encodeURIComponent(epp.globalVar.partnerProgram)+"\">"+epp.globalVar.registerlinkText+"</a>");
					}
					if(jData.CustomerProfileVO.enrollmentStatusVO.profileComplete=="Y"
					&& ( (jData.CustomerProfileVO.enrollmentStatusVO.vppCustomer=="" && jData.CustomerProfileVO.enrollmentStatusVO.eppCustomer=="")
					|| (jData.CustomerProfileVO.enrollmentStatusVO.vppCustomer=="N" && jData.CustomerProfileVO.enrollmentStatusVO.eppCustomer=="N") )){
						$resultMsg.html(epp.globalVar.noRegisterMsg+"&nbsp;<a class=\"nWindowIcon\" target=\"_blank\"  href=\""+epp.globalVar.threeTabsLink+"&_VM_emailAddress="+email+"&_VM_partnerID="+encodeURIComponent(jData.CustomerProfileVO.partnerID)+"&_VM_partnerPrgm="+encodeURIComponent(epp.globalVar.partnerProgram)+"\">"+epp.globalVar.registerlinkText+"</a>");
					}
					
					if(jData.CustomerProfileVO.enrollmentStatusVO.vppCustomer=="Y" && jData.CustomerProfileVO.enrollmentStatusVO.eppCustomer=="N" ){
						if(jData.CustomerProfileVO.preferredPartner =='N'  ){
							$resultMsg.html(epp.globalVar.notPreferredMsg+" <a class=\"nWindowIcon\" target=\"_blank\" href=\""+epp.globalVar.notPreferredLink+"\">"+epp.globalVar.notPreferredMsgtxt+"</a>");
						}else{
							$resultMsg.html(epp.globalVar.vppRegisterYes+"<a class=\"nWindowIcon\" target=\"_blank\"  href=\""+epp.globalVar.epplink+"&_VM_emailAddress="+email+"&_VM_partnerID="+encodeURIComponent(jData.CustomerProfileVO.partnerID)+"&_VM_type="+encodeURIComponent(jData.CustomerProfileVO.partnerType)+"&_VM_partnerPrgm="+encodeURIComponent(epp.globalVar.partnerProgram)+"\">"+epp.globalVar.epplinkText+"</a>");
						}
					}					
					if(jData.CustomerProfileVO.enrollmentStatusVO.vppCustomer=="Y" && jData.CustomerProfileVO.enrollmentStatusVO.eppCustomer =="Y"){
						$resultMsg.html(epp.globalVar.registerVppEppMsg);
					}
				
				}
			}else{
				$resultMsg.html(epp.globalVar.errorSearchMessage);
			}
		},function(){alert("There is an error in processing your request")});
    	
    }
};//End of fund details 