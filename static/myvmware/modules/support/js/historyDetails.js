/* ########################################################################### *
/* ***** DOCUMENT INFO  ****************************************************** *
/* ########################################################################### *
 * ##### NAME:  history.js
 * ##### VERSION: v0.1
 * ##### UPDATED: 02/22/2012
 * ##### AUTHOR: Deloitte Consulting LLP 
/* ########################################################################### *

  _    ____  ___                        
 | |  | |  \/  |                        
 | |  | | .  . |__      ____ _ _ __ ___ 
 | |/\| | |\/| |\ \ /\ / / _` | '__/ _ \
 \  /\  / |  | | \ V  V / (_| | | |  __/
  \/  \/\_|  |_/  \_/\_/ \__,_|_|  \___|
 
/* ########################################################################### */
myvmware.summarydetails = {
		init :function() {
			
			$('.section-header a.openClose').click(function(){
				$(this).toggleClass("open").parent().next().toggle();
				return false;
				});
			
			// Open close activity
			$('.activity-type a.openClose').click(function(){
				$(this).toggleClass("open").next().toggle();
				return false;
			}); 
				
			if($('#sel_wantTo').val()=='add_attachments')
			{
				var new_position = $('#anchorPageAfterUpload').offset();        
			    window.scrollTo(new_position.left,new_position.top);	
			}
			       
			$('#btn_addAttachment').click(function() {
				$('#sel_wantTo').val('see_overview');
				$('#sel_wantTo').trigger('change');
			})
			$('#cancelAndResetNotes').click(function() {
				$('#sel_wantTo').val('see_overview');	
				$('#sel_wantTo').trigger('change');
			})
			$('#cancelAndResetClose').click(function() {
				$('#sel_wantTo').val('see_overview');	
				$('#sel_wantTo').trigger('change');
			})
			$('#cancelAndResetER').click(function() {
				$('#sel_wantTo').val('see_overview');	
				$('#sel_wantTo').trigger('change');
			})
			$('#cancelAndResetReopen').click(function() {
				$('#sel_wantTo').val('see_overview');	
				$('#sel_wantTo').trigger('change');
			})
			$('#cancelAndResetSR').click(function() {
				$('#sel_wantTo').val('see_overview');	
				$('#sel_wantTo').trigger('change');
			})
			
			$('#sel_wantTo option').sortElements(function(a, b){
				return $(a).text() > $(b).text() ? 1 : -1;
			});
				
		    $('#sel_wantTo').change(function (){		
		    	var errorDiv = $('.ctrlHolder').find('.messageHolder');
		        errorDiv.html('');
		        errorDiv.removeClass('error');
		        $('.ctrlHolder').removeClass('error');
		        $("#updateConfirmationMsg").hide();
			});
		    
			$('#sel_reason').focus(function (){		
				$("#bttnClose").addClass('primary');
				$("#bttnClose").removeClass('disabled');
				$("#bttnClose").removeAttr('disabled');
			});
			$('#description2').focus(function (){		
				$("#actionEscalate").addClass('primary');
				$("#actionEscalate").removeClass('disabled');
				$("#actionEscalate").removeAttr('disabled');
			});
			$('#addnotes').focus(function (){		
				$("#additionalNotesButton").addClass('primary');
				$("#additionalNotesButton").removeClass('disabled');
				$("#additionalNotesButton").removeAttr('disabled');
			});	
			
			// BUG-00024096 start
			$(".tempNote").each(function() {	
				//alert("test"+$(this).html());
				$(this).html($(this).html().replace(/\n\r?/g, '<br />'));
			});
			//VSUS START
			/*if("#eaSelector"){
				$('#eaSelector').change(function() {
					myvmware.summarydetails.getLevelOneFoldersWithFileSRPermission();
				});
				eaSelected = $("select#eaSelector option:selected").val();
				if(eaSelected != 'None' && eaSelected != ''){
					//if($('#folderListFileSR option').length <= 1){
						$('#folderListFileSR').html('').attr('disabled','');
						myvmware.summarydetails.getLevelOneFoldersWithFileSRPermission();
					//}
				}
				else{
					$('#folderListFileSR').html('').attr('disabled','true');
					$('#folderListFileSR').append('<option value="">None</option>');
				}
			}			*/	
		},

		//VSUS
		getLevelOneFoldersWithFileSRPermission :function() {
			var eaSelected = '';
			if("#eaSelector"){
				eaSelected = $("select#eaSelector option:selected").val();
			}
			var customerCN = $("#customerNumVar").val();
			var productID = $("#supportProductIDVar").val();
			if(productID == "null"){
				productID="";
			}
			var getLevelOneFoldersWithFileSRPermissionURL = $("#getLevelOneFoldersWithFileSRPermission").val();
			if(eaSelected != 'None' && eaSelected != ''){
				$.ajax({
					type : "POST",
					dataType : "json",
					url : getLevelOneFoldersWithFileSRPermissionURL,
					data : {
						entitlementAccountNumber : eaSelected,
						customerNumber : customerCN,
						productID	:	productID						
					},
					success : function(returnData) {
						$('#folderListFileSR').html('').removeAttr('disabled').removeClass('folderListFileSR'); //For Bug-00071312-Removed disable attribute, change made to remove attribute from disabled=""
						myvmware.summarydetails.populateFolderList(returnData);			
						$('#folderListFileSR').siblings('div.inputHolderClass').remove();
						vmf.dropdown.build($('#folderListFileSR'), {optionsDisplayNum:20,ellipsisSelectText:false,ellipsisText:'',optionMaxLength:62,inputMaxLength:37,position:"right"}); 
					},
					error: function(jqXHR, textStatus, errorThrown) { 
						console.log(errorThrown); 
						console.log(textStatus); 
					}
				});
			}else{
				$('#folderListFileSR').siblings('div.inputHolderClass').remove();
				$('#folderListFileSR').html('').attr('disabled','true').addClass('folderListFileSR').css('display','block');
				$('#folderListFileSR').append('<option value="" selected=selected>'+support.globalVars.noneLbl+'</option>')
			}
		},
		populateFolderList	:	function(values)
		{
			var existingFolderName =  $("#folderNameInfo").val();
			try 
			{
				var folderListVar = values.folderListWithFileSRPermission;		
				$('#folderListFileSR').append('<option value="">'+support.globalVars.noneLbl+'</option>');
				if(folderListVar.length > 0){
					
					for ( var i = 0; i < folderListVar.length; i++) 
					{
						if(existingFolderName == folderListVar[i].folderName){
							$('#folderListFileSR').append('<option value="'+folderListVar[i].folderName+'" selected>'+folderListVar[i].folderName+'</option>');
						}else{
							$('#folderListFileSR').append('<option value="'+folderListVar[i].folderName+'">'+folderListVar[i].folderName+'</option>');
						}
					}
			    }
			} catch (err) {
			}
		}
		
};