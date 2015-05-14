/* ########################################################################### *
/* ***** DOCUMENT INFO  ****************************************************** *
/* ########################################################################### *
 * ##### NAME:  profile.js
 * ##### VERSION: v0.1
 * ##### UPDATED: 04/24/2011
/* ########################################################################### */


if (typeof(myvmware) == "undefined")  
	myvmware = {};

myvmware.profile = {
  	init: function() {
  	  	// code which will run on patch alerts section on communication preferences
  	  	var myPrefixCode = "<li class='clearfix'><div class='ctrlHolder'><input type='checkbox'><label>";
		var mySufixCode = "</label></div></li>";
		var tickMark = "&#x2713;"
		var dataCenterDownloads = new Array();
		dataCenterDownloads = ['VMware vSphere 4','VMware vSphere Hypervisor (ESXi)','VMware vCloud Director','VMware vCloud Request Manager','VMware Infrastructure','VMware Server','VMware vCenter Operations','VMware vCenter Server Heartbeat','VMware vCenter Converter Standalone','VMware vCenter Lab Manager','VMware vCenter Site Recovery Manager','VMware vCenter Capacity IQ','VMware vCenter AppSpeed','VMware vCenter Chargeback','VMware vShield App','VMware vShield Edge','VMware vShield Endpoint','VMware vShield Manager','VMware vFabric Hyperic','VMware vFabric GemFire','VMware vFabric GemStone/S','VMware vFabric tc Server','VMware vFabric tc Server Developer Edition','VMware vFabric Enterprise Ready Server','VMware vCenter Configuration Manager','VMware vCenter Application Discovery Manager','VMware vCenter Lifecycle Manager','Vmware VMmark'];
		var desktopDownloads = new Array();
		desktopDownloads = ['VMware View','VMware ThinApp','VMware ACE','VMware Workstation','VMware Fusion','VMware Player'];
		var applicationManagement = ['VMware vCenter AppSpeed','VMware vCenter Application Discovery Manager'];
		
		var licenseAlerts = new Array();
		licenseAlerts = ['License: Keys Move, Divide and Combine','License Keys: Upgrade and Downgrade'];
		
		var accountMgmtAlerts = new Array();
		accountMgmtAlerts = ['Account Name Changes','Account Merges Changes','Support Contract Renewal Reminder','Support Contract Expired','Support Contract Renewed'];
		
		var userRoleAlerts = new Array();
		userRoleAlerts = ['Permissions: Added and Removed','IT Super User or Procurement Contact Change'];
		
		
		// To pass the datacenter products
		$(dataCenterDownloads).each(function(index) {
			var idAndName = dataCenterDownloads[index].split(' ').join('_');

			$('.all_Datacenter_Products').append("<li class='clearfix'><div class='ctrlHolder'><input class='checkBox' id="+ idAndName + " name=" + idAndName +" type='checkbox'><label for="+ idAndName +">" + dataCenterDownloads[index] + mySufixCode);
  		});
		
		// To pass the desktop products
		$(desktopDownloads).each(function(index) {
			var idAndName = desktopDownloads[index].split(' ').join('_');
			
			$('.all_Desktop_Products').append("<li class='clearfix'><div class='ctrlHolder'><input class='checkBox' id="+ idAndName + " name=" + idAndName +" type='checkbox'><label for="+ idAndName +">" + desktopDownloads[index] + mySufixCode);
  		});

		$(applicationManagement).each(function(index) {
			var idAndName = applicationManagement[index].split(' ').join('_');
			
			$('.all_Applicatiion_Products').append("<li class='clearfix'><div class='ctrlHolder'><input class='checkBox' id="+ idAndName + " name=" + idAndName +" type='checkbox' checked='checked'><label for="+ idAndName +">" + applicationManagement[index] + mySufixCode);
  		});

  		// To pass the license alerts
		$(licenseAlerts).each(function(index) {
			var idAndName = licenseAlerts[index].split(' ').join('_');
			
			$('.all_License_Alerts').append("<li class='clearfix'><div class='ctrlHolder accountSub'><input class='checkBox' id="+ idAndName + " name=" + idAndName +" type='checkbox'><label for="+ idAndName +">" + licenseAlerts[index] + mySufixCode);
  		});

  		// To pass the account management alerts
		$(accountMgmtAlerts).each(function(index) {
			var idAndName = accountMgmtAlerts[index].split(' ').join('_');
			
			$('.all_Account_Management').append("<li class='clearfix'><div class='ctrlHolder accountSub'><input class='checkBox' id="+ idAndName + " name=" + idAndName +" type='checkbox'><label for="+ idAndName +">" + accountMgmtAlerts[index] + mySufixCode);
  		});

  		// To pass the user roles & permissions alerts
		$(userRoleAlerts).each(function(index) {
			var idAndName = userRoleAlerts[index].split(' ').join('_');
			
			$('.all_UserRoles_Permissions').append("<li class='clearfix'><div class='ctrlHolder accountSub'><input class='checkBox' id="+ idAndName + " name=" + idAndName +" type='checkbox'><label for="+ idAndName +">" + userRoleAlerts[index] + mySufixCode);
  		});

  	  	// Open close buttons (will run on all profile pages)
  	  	$('.profile-minimize-button').click(function(evt) {
  			var $fieldset;
  			evt.preventDefault();
  			
  			if($(this).parents('.list-wrapper').length > 0){
  				$fieldset = $(this).parents('.list-wrapper');
  			}else{
  				$fieldset = $(this).parents('fieldset');
  			}
  			
			/*
  			if($fieldset.hasClass('closed')){
  				$fieldset.find('.ctrlHolder, h3, .note, .list-hierarchy-wrapper, p, .success-msg').not('.hidden').show();
  				$fieldset.removeClass('closed');
  			}else{
  				$fieldset.find('.ctrlHolder, h3, .note, .list-hierarchy-wrapper, p, .success-msg').not('.hidden').hide();
  				$fieldset.addClass('closed');
  			}
			*/
			
			if($fieldset.hasClass('closed')){
  				$fieldset.find('.ctrlHolder, h3, .note, .list-hierarchy-wrapper, p, .success-msg, .fn_editable').not('.hidden').show();
  				$fieldset.removeClass('closed remBorder').addClass('addBorder');
  			}else{
  				$fieldset.find('.ctrlHolder, h3, .note, .list-hierarchy-wrapper, p, .success-msg, .fn_editable').not('.hidden').hide();
  				$fieldset.addClass('closed remBorder').removeClass('addBorder');
  			}
			
  			
  			return false;
  		});
  		
		$("#content-section .profile .list-wrapper.disabled").find("label").css("opacity","0.5").end().find("input").attr("disabled","true");
  		
  		
  		// Edit-Cancel-Save buttons		
  		$('button.fn_edit').click(function() {
  			var $fieldset = $(this).parents('fieldset');
			var $fieldsetAccountPref = $(this).parents().find('fieldset.account');
  			// Hide all the read only fields
  			$fieldset.find('.read-only,.long-read-only').not('.always-read-only,.always-long-read-only').addClass('hidden');
			$fieldset.find('.list-wrapper .long-read-only').not('.always-read-only,.always-long-read-only').parent().addClass('hidden');
			$fieldsetAccountPref.find('.list-wrapper .long-read-only').not('.always-read-only,.always-long-read-only').parent().addClass('hidden');
			// Hide the read only  check-box-wrapper
			$fieldset.find('.ctrlHolder .check-box-wrapper').not('.fn_editable').addClass('hidden');
	  			
  			// Show all the editable fields
			$fieldset.find('.fn_editable').removeClass('hidden');
			$fieldsetAccountPref.find('.fn_editable').removeClass('hidden');
  			//alert($fieldset.find('.fn_editable').html());
			//Hide edit button
			$fieldset.find('.fn_edit').addClass('hidden');
			
			//Show Save/Cancel buttons
			$fieldset.find('.fn_save,.fn_cancel').removeClass('hidden');
			
			//Hide informational text				
			$fieldset.find('.informational-text').addClass('hidden');
			
  			return false;
  		});
  		
  		$('button.fn_cancel').click(function() {
			var $fieldset = $(this).parents('fieldset');
			var $fieldsetAccountPref = $(this).parents().find('fieldset.account');
			var $accountPrefFields = $(this).parents().find('fieldset.account').find('input');
			
			// Show all the read only fields
  			$fieldset.find('.read-only,.long-read-only').removeClass('hidden');
			$fieldset.find('.long-read-only').parent().removeClass('hidden');
			
			$fieldsetAccountPref.find('.read-only,.long-read-only').removeClass('hidden');
			$fieldsetAccountPref.find('.long-read-only').parent().removeClass('hidden');
			
			// Show the read only  check-box-wrapper
			$fieldset.find('.ctrlHolder .check-box-wrapper').not('.fn_editable').removeClass('hidden');
			$fieldsetAccountPref.find('.ctrlHolder .check-box-wrapper').not('.fn_editable').removeClass('hidden');
			
			
			// Hide all the editable fields
			$fieldset.find('.fn_editable').attr('style','').addClass('hidden');
			$fieldset.find('label.error').remove();
			$fieldsetAccountPref.find('.fn_editable').attr('style','').addClass('hidden');
			$fieldsetAccountPref.find('label.error').remove();
			
			//Show edit button
			$fieldset.find('.fn_edit').removeClass('hidden');
			
			//Hide Save/Cancel buttons
			$fieldset.find('.fn_save,.fn_cancel').addClass('hidden');
			
			//Hide informational text				
			$fieldset.find('.informational-text').addClass('hidden'); 
			$fieldsetAccountPref.find('.informational-text').addClass('hidden'); 		
  			
  			return false;
  		});
		
		$('button.fn_save').click(function() {
			var $fieldset = $(this).parents('fieldset');
			var $fields = $(this).parents('fieldset').find('input, select, textarea');
			
			var $fieldsetAccountPref = $(this).parents().find('fieldset.account');
			var $accountPrefFields = $(this).parents().find('fieldset.account.subscriptions').find('input:checkbox');
			
			//Clear the checkboxes <li>'s
			$fieldset.find('.check-box-wrapper:not(".fn_editable") ul').html('');
			$fieldset.find('.ctrlHolder:not(".fn_editable") ul li ul').html('');
	
			$fieldsetAccountPref.find('.ctrlHolder:not(".fn_editable") ul li ul').html('');
			
			$accountPrefFields.each(function(){
				//alert($(this).val())
				// Checkbox fields
				
				if($(this).is('input:checkbox:checked')) {	
					acChValue = $(this).next('label').html();
					//$(this).parents('.check-box-wrapper').prev().find('ul').append('<li class="clearfix"><div class="read-only">✓ '+acChValue+'</div></li>');

					if(!$(this).hasClass('fn_selectAllCheckbox')){
						console.log($(this).parents('.ctrlHolder').prev().find('ul li ul').append('<li class="clearfix"><div class="long-read-only">✓ '+acChValue+'</div></li>'));
					}
				}
				
				//If it is the parent level, do something different
				if($(this).is('input:checkbox') && $(this).hasClass('fn_selectAllCheckbox')){
					acChValue = $(this).next('label').html();
					if($(this).is('input:checkbox:checked')){
						$(this).parents('.ctrlHolder.accountSub').prev().find('div.long-read-only').html('✓ '+acChValue);
					}else{
						$(this).parents('.ctrlHolder.accountSub').prev().find('div.long-read-only').html('');
						//$(this).parents('.ctrlHolder.accountSub').prev().find('div.long-read-only').addClass('hidden');
					}
					//
				}
			})
			$fields.each(function(){
				// See what type it is	
				
				if($(this).is('input[type="text"]')) {
					// Input fields
					inputValue = $(this).val();
					$(this).parent().prev('.read-only,.long-read-only').html(inputValue);
				}
				
				// Select fields
				if($(this).is('select')) {					
					selectValue = $(this).val();
					$(this).parent().prev('.read-only,.long-read-only').html(selectValue);
				}
								
				// Checkbox fields
				if($(this).is('input:checkbox:checked')) {										
					chValue = $(this).next('label').html();
					$(this).parents('.check-box-wrapper').prev().find('ul').append('<li class="clearfix"><div class="read-only">✓ '+chValue+'</div></li>');

					if(!$(this).hasClass('fn_selectAllCheckbox')){
						$(this).parents('.ctrlHolder').prev().find('ul li ul').append('<li class="clearfix"><div class="long-read-only">✓ '+chValue+'</div></li>');
					}
				}
				
				//If it is the parent level, do something different
				if($(this).is('input:checkbox') && $(this).hasClass('fn_selectAllCheckbox')){
					chValue = $(this).next('label').html();
					if($(this).is('input:checkbox:checked')){
						$(this).parents('.ctrlHolder').prev().find('div.long-read-only').html('✓ '+chValue);
					}else{
						$(this).parents('.ctrlHolder').prev().find('div.long-read-only').html('');
					}
					//
				}
					
				// Radio button fields				
				if($(this).is('input:radio:checked')) {					
					radioValue = $(this).next('label').html();
					$(this).parents().prev('.read-only,.long-read-only').html(radioValue);		
				}										
				
			// Show all the read only fields
    		$fieldset.find('.read-only,.long-read-only').removeClass('hidden');
			$fieldset.find('.long-read-only').parent().removeClass('hidden');
			$fieldsetAccountPref.find('.read-only,.long-read-only').removeClass('hidden');
			$fieldsetAccountPref.find('.long-read-only').parent().removeClass('hidden');
			
			// Show the read only  check-box-wrapper 
			$fieldset.find('.ctrlHolder .check-box-wrapper').not('.fn_editable').removeClass('hidden');
  			$fieldsetAccountPref.find('.ctrlHolder').not('.fn_editable').removeClass('hidden');
			
  			// Hide all the editable fields
  			$fieldset.find('.fn_editable').attr('style','').addClass('hidden');
			$fieldsetAccountPref.find('.fn_editable').attr('style','').addClass('hidden');
  			$fieldset.find('label.error').remove();
			$fieldsetAccountPref.find('label.error').remove();
  				
  			//Show edit button
  			$fieldset.find('.fn_edit').removeClass('hidden');
  			
  			//Hide Save/Cancel buttons
  			$fieldset.find('.fn_save,.fn_cancel').addClass('hidden'); 
			
			//Hide informational text				
			$fieldset.find('.informational-text').addClass('hidden');
			$fieldsetAccountPref.find('.informational-text').addClass('hidden');
				
			});
			
			return false;
		});
		
		
		// When the top checkbox is selected, select all children
		$('.fn_selectAllCheckbox').click(function() {
			$(this).parent().parent().find('.fn_selectAllCheckboxChildren :checkbox').attr('checked', this.checked);
		});
		
		//When the children are selected, see if the top needs to be selected or unselected
		$('.fn_selectAllCheckboxChildren :checkbox').click(function(){
			var $this = $(this),
				chkChildren,
				numberSelected = 0;
			
			//find all the other children
			chkChildren = $this.parents('.fn_selectAllCheckboxChildren').find(':checkbox');
			
			//see if they are all selected or unselected
			chkChildren.each(function(){
				if($(this).attr('checked') == true){
					numberSelected += 1;	
				}
			});
					
			//if all selected
			if(numberSelected == chkChildren.length){
				//select parent checkbox
				$this.parents('.fn_selectAllCheckboxChildren').parent().parent().find('.fn_selectAllCheckbox').attr('checked', true);
			}else{
				//unselect parent checkbox
				$this.parents('.fn_selectAllCheckboxChildren').parent().parent().find('.fn_selectAllCheckbox').attr('checked', false);
			}
			
		});
		
  	  	
  	},
  	
  	view: function() {
  		
  	},
  	
  	validate: function(){
        
        
        // Custom validation rule - http://jquery.bassistance.de/validate/demo/custom-methods-demo.html
        $.validator.methods.customRule = function(value, element, param) {
          return value == param;
        };
        
        // Validation code
        $("form").validate({
          errorPlacement: function(error, element) {
            if(element.next('.tooltip').length>0){
              element.next('.tooltip').after(error);
            }else{
              element.after(error);
            }
          },
          rules: {
            txt_email: {
              required: true,
              minlength: 10,
              email: true
              //remote: "users.php"
            },
            txt_verify_email: {
              required: true,
              equalTo: '#txt_email'
            }
          },
          messages: {

          }
        });
    }
  	
  }