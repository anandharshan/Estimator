/* ########################################################################### *
/* ***** DOCUMENT INFO  ****************************************************** *
/* ########################################################################### *
 * ##### NAME:  history.js
 * ##### VERSION: v0.1
 * ##### UPDATED: 02/22/2012
/* ########################################################################### */
myvmware.history = {
		init :function() {
		if($('#txt_orderDate_from').val()=="" || $('#txt_orderDate_from').val()=="YYYY-MM-DD" || $('#txt_orderDate_to').val()=="" || $('#txt_orderDate_to').val()=="YYYY-MM-DD"){
				$('#specific_date_range').attr('checked', false);
			}else{
				$('#specific_date_range').attr('checked', true);
			}
		if($('#isPaginationSelected').val()=='YES')	{
				var new_position = $('#content_1').offset();        
	    		window.scrollTo(new_position.left,new_position.top);	  	
			}
            $('.expand-collapse a').click(function() {			
                  $this = $(this);                
                  $this.addClass('disabled');
                  $this.parent().siblings().find('a').removeClass('disabled');
                  return true;
            });            
            $('a.disabled').click(function(e) {
                  e.preventDefault(); 
					return false;
            });
			$('#getHelpButton').click(function(){
				var url = jQuery('#getHelpClick').attr('href');		
				window.open(url,'_self');		
				return false;
			})
			$('#set_date_range').click(function(){
				$('#txt_orderDate_to').val('');
				$('#txt_orderDate_from').val('');		
			})
			var $dd = $('#txt_mySupportRequestView'); // account dropdown dom
			if( $dd.is(":visible")){//applying vmf.dropdown on Account dropdown on page load, if the filter section is already opened -- BUG-00042280 fix - rvooka
				if(vmf.dropdown){
					//if($('#isEaSelectorSet').val()=='NO'){
						vmf.dropdown.build($("#txt_mySupportRequestView"), {optionsDisplayNum:20,ellipsisSelectText:false,ellipsisText:'',optionMaxLength:62,inputMaxLength:37,position:"right",onSelect:getLevelOneFoldersBySelectedEA});
						$('#isEaSelectorSet').val("YES");
						vmf.dropdown.build($("#txt_product"), {optionsDisplayNum:20,ellipsisSelectText:false,ellipsisText:'',optionMaxLength:62,inputMaxLength:37,position:"left",onSelect:getServicesBySelectedProduct});
					//}
				}
			}
			var selectOneTxt = support.globalVars.selectOneLbl;
			if ($dd.length > 0) { // make sure we found the select we were looking for
					    // save the selected value
					    var selectedVal = $dd.val();
					    // get the options and loop through them
					    var $options = $('option', $dd);
					    var arrVals = [];
					    $options.each(function(){
					        // push each option value and text into an array
					        arrVals.push({
					            val: $(this).val(),
					            text: $(this).text()
					        });
					    });
					    arrVals.sort(function(a, b){
				if(a.text.toLowerCase()==selectOneTxt.toLowerCase()){	    		
					    		return -1;
					    	}
					        if(a.val.toLowerCase()>b.val.toLowerCase()){
					            return 1;
					        }
					        else if (a.val==b.val){
					            return 0;
					        }
					        else {
					            return -1;
					        }
					    });
			    // loop through the sorted array and set the text/values to the options
			    for (var i = 0, l = arrVals.length; i < l; i++) {
			        $($options[i]).val(arrVals[i].val).text(arrVals[i].text);
			    }
			    // set the selected value back
			    $dd.val(selectedVal);
			}	
			$(".tempNote").each(function() {			
				$(this).html($(this).html().replace(/\n\r?/g, '<br />'));
			});
		//VSUS changes starts
		$("#folderID").css('width','105px'); 
		getLevelOneFoldersBySelectedEA();
		$('#txt_mySupportRequestView').change(function(){
			getLevelOneFoldersBySelectedEA();
		})
		//VSUS changes Ends ehre
		
		//SDP - Start
		$('#txt_product').change(function(){		
			getServicesBySelectedProduct();
		})
		//SDP - End

		$('#sel_date_range').find('option:[value=""]').text(support.globalVars.selectOneLbl);

	}//End of init	
};//End of myvmware.history
function submitenter(myfield,e){
        var keycode;
	if (window.event){
                keycode = window.event.keyCode;
	}else{
                return true;
        }
	if (keycode == 13){
                jQuery('#applyFilter').focus().click();
                return false;
	}else{
                return true;
        }
};
function submitForm(selectObj,url) {
	var idx = selectObj.selectedIndex; 
	var recordPerPageValue = selectObj.options[idx].value;
	var newUrl = url.replace('RecordPerPageValue',recordPerPageValue);
	location.href=newUrl;
};
function submitFilter(url){	
	var formValidation = true; 
	if($("#specific_date_range").attr("checked")==true){
   		var dateChk = vmf.calendar.checkDateFormat("yyyy-mm-dd",$('#txt_orderDate_from').val());
		if(dateChk==null){
			if($('#txt_orderDate_from').val()=="" || $('#txt_orderDate_from').val()=="YYYY-MM-DD"){
	    		$('#txt_orderDate_from').val(" ");		    		
	    	}
	    	formValidation=false;		   
	    	$('#txt_orderDate_from').focusout();
			if($('#txt_orderDate_from').val()==" "){
	    		$('#txt_orderDate_from').val("");
	    	}
	    }
	    dateChk = vmf.calendar.checkDateFormat("yyyy-mm-dd",$('#txt_orderDate_to').val());
		if(dateChk ==null && formValidation==true){
			if($('#txt_orderDate_to').val()=="" || $('#txt_orderDate_to').val()=="YYYY-MM-DD"){
	    		$('#txt_orderDate_to').val(" ");
	    	}
	    	formValidation=false;
	    	$('#txt_orderDate_to').focusout();
			if($('#txt_orderDate_to').val()==" "){
	    		$('#txt_orderDate_to').val("");
	    	}
	    }		   		
	}
	if(formValidation==true)
	{
		document.filterForm.action = url;
		document.filterForm.submit();	
	}        
};
//VSUS Changes START
function getLevelOneFoldersBySelectedEA(){
	//$("#folderID").removeClass("disabled");
	var eaSelected = $("select#txt_mySupportRequestView option:selected").val();
	var levelOneFoldersUrl = $("#getLevelFoldersAjaxURL").val();
	var customerNum = $("#customerNum").val();
	var productSelected = $("select#txt_product option:selected").val();
	var productType = $("select#txt_product").find("option:selected").attr("prdtype");
	//alert("easelected is :"+eaSelected + "---------"+ "url selected is "+levelOneFoldersUrl);
	if(eaSelected != 'All my Support Requests' && eaSelected != 'Support Requests not associated with an account'){
		if (productType != "sdp"){
		$.ajax({
			type : "POST",
			dataType : "json",
			url : levelOneFoldersUrl,
			data : {
				entitlementAccountNumber : eaSelected,
				customerNumber : customerNum
			},
			success : function(returnData) {
				$('#folderID').html('').attr('disabled','');
				populateFolderList(returnData);			
				if($('#folderID').siblings('div.inputHolderClass')){
					$('#folderID').siblings('div.inputHolderClass').remove();	
			}
				vmf.dropdown.build($('#folderID'), {optionsDisplayNum:20,ellipsisSelectText:false,ellipsisText:'',optionMaxLength:62,inputMaxLength:37,position:"righht"}); 
			},
			error: function(jqXHR, textStatus, errorThrown) { }
		});
		}
		else{
		       $('#folderID').html('<option value="All">'+support.globalVars.allLbl+'</option>').attr('disabled','true').show().siblings('div.inputHolderClass').remove();
		}		
		if (productSelected != "") {
			getServicesBySelectedProduct();	
		}
		else {
			$('#serviceInstanceID').html('').attr('disabled','true').css('display','block');
			$('#serviceInstanceID').append('<option value="All">'+support.globalVars.allLbl+'</option>');
			$('#serviceInstanceID').siblings('div.inputHolderClass').remove();
		}
				
	}else{
		$('#folderID').html('').attr('disabled','true').css('display','block');
		$('#folderID').append('<option value="All">'+support.globalVars.allLbl+'</option>');
		$('#folderID').siblings('div.inputHolderClass').remove();
		
		$('#serviceInstanceID').html('').attr('disabled','true').css('display','block');
		$('#serviceInstanceID').append('<option value="All">'+support.globalVars.allLbl+'</option>');
		$('#serviceInstanceID').siblings('div.inputHolderClass').remove();
	}
};
function populateFolderList(values){
	try {
		var existingFolderSelected =  $("#selectedFolderVar").val();
		var folderList = values.folderList;		
		$('#folderID').append('<option value="All">'+support.globalVars.allLbl+'</option>');
		if(folderList.length > 0){
			for ( var i = 0; i < folderList.length; i++) {
				if(existingFolderSelected == folderList[i].folderName){
					$('#folderID').append('<option value="'+folderList[i].folderName+'" selected>'+folderList[i].folderName+'</option>');
				}else{
					$('#folderID').append('<option value="'+folderList[i].folderName+'">'+folderList[i].folderName+'</option>');
				}
			}
	    }
	} catch (err) {
	}
}//VSUS Changes END

//SDP - Start
function getServicesBySelectedProduct(){
	var eaSelected = $("select#txt_mySupportRequestView option:selected").val();
	var customerNum = $("#customerNum").val();
	var serviceInstancesUrl = $("#getServiceInstancesAjaxURL").val();
	var productSelected = $("select#txt_product option:selected").val();
	var productType = $("select#txt_product").find("option:selected").attr("prdtype");
	if(eaSelected != 'All my Support Requests' && eaSelected != 'Support Requests not associated with an account'){	
		if (productSelected != "" && productType != "nonSdp") {
			$.ajax({
				type : "POST",
				dataType : "json",
				url : serviceInstancesUrl,
				data : {
					entitlementAccountNumber : eaSelected,
					customerNumber : customerNum,
					productDesc : productSelected
				},
				success : function(returnData) {
					$('#serviceInstanceID').html('').attr('disabled','');
					populateInstanceList(returnData);			
					if($('#serviceInstanceID').siblings('div.inputHolderClass')){
						$('#serviceInstanceID').siblings('div.inputHolderClass').remove();	
				}
					vmf.dropdown.build($('#serviceInstanceID'), {optionsDisplayNum:20,ellipsisSelectText:false,ellipsisText:'',optionMaxLength:62,inputMaxLength:37,position:"righht"}); 
				},
				error: function(jqXHR, textStatus, errorThrown) { }
			});	
				$('#folderID').html('<option value="All">'+support.globalVars.allLbl+'</option>').attr('disabled','true').show().siblings('div.inputHolderClass').remove();
		}
		else {
			$('#serviceInstanceID').html('').attr('disabled','true').css('display','block');
			$('#serviceInstanceID').append('<option value="All">'+support.globalVars.allLbl+'</option>');
			$('#serviceInstanceID').siblings('div.inputHolderClass').remove();
			$('#folderID').html('<option value="All">'+support.globalVars.allLbl+'</option>').attr('disabled','').show().siblings('div.inputHolderClass').remove();
		}
				
	}else{
		$('#serviceInstanceID').html('').attr('disabled','true').css('display','block');
		$('#serviceInstanceID').append('<option value="All">'+support.globalVars.allLbl+'</option>');
		$('#serviceInstanceID').siblings('div.inputHolderClass').remove();
	}
}

function populateInstanceList(values){
	try {
		var existingInstanceSelected =  $("#selectedInstanceIdVar").val();
		var instanceList = values.instanceList;		
		$('#serviceInstanceID').append('<option value="All">'+support.globalVars.allLbl+'</option>');
		if(instanceList.length > 0){
			for ( var i = 0; i < instanceList.length; i++) {
				if(existingInstanceSelected == instanceList[i].instanceID){
					$('#serviceInstanceID').append('<option value="'+instanceList[i].instanceID+'" selected>'+ instanceList[i].instanceID + ' - ' +instanceList[i].instanceName+'</option>');
				}else{
					$('#serviceInstanceID').append('<option value="'+instanceList[i].instanceID+'">'+ instanceList[i].instanceID + ' - ' +instanceList[i].instanceName+'</option>');
				}
			}
	    }
	} catch (err) {
	}
}
//SDP - End
