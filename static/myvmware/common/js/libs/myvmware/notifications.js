/* ########################################################################### *
/* ***** DOCUMENT INFO  ****************************************************** *
/* ########################################################################### *
 * ##### NAME:  notifications.js
 * ##### VERSION: v0.1
 * ##### UPDATED: 05/27/2011
/* ########################################################################### */

if (typeof(myvmware) == "undefined")  
	myvmware = {};

myvmware.notifications = {
  	init: function() {
		
		var myPrefixCode = "<li><div class='ctrlHolder'><input type='checkbox'><label>";
		var mySufixCode = "</label></div></li>";
		var tickMark = "&#x2713;"
		var dataCenterDownloads = new Array();
		dataCenterDownloads = ['item1-One','item2-Two','item3-Three','item4-Four','item5-Five','item6-Six'];
		
		var desktopDownloads = new Array();
		desktopDownloads = ['item 1 One','item 2 Two','item 3 Three','item 4 Four','item 5 Five','item 6 Six', 'item 7 Seven'];
		
		// To pass the datacenter products
		$(dataCenterDownloads).each(function(index) {
			var idAndName = dataCenterDownloads[index].split(' ').join('_');

			$('.all_Datacenter_Products').append("<li><div class='ctrlHolder'><input class='checkBox' id="+ idAndName + " name=" + idAndName +" type='checkbox'><label for="+ idAndName +">" + dataCenterDownloads[index] + mySufixCode);
  		});
		
		// To pass the desktop products
		$(desktopDownloads).each(function(index) {
			var idAndName = desktopDownloads[index].split(' ').join('_');
			
			$('.all_Desktop_Products').append("<li><div class='ctrlHolder'><input class='checkBox' id="+ idAndName + " name=" + idAndName +" type='checkbox'><label for="+ idAndName +">" + desktopDownloads[index] + mySufixCode);
  		});
		
		
		
		// Open close buttons
  	  	$('.profile-minimize-button').click(function() {
  			var $fieldset;
  			
  			
  			if($(this).parents('.list-wrapper').length > 0){
  				$fieldset = $(this).parents('.list-wrapper');
  			}else{
  				$fieldset = $(this).parents('fieldset');
  			}
  			
  			if($fieldset.hasClass('closed')){
  				$fieldset.find('.ctrlHolder, h3, .note, .list-hierarchy-wrapper, p, .success-msg').not('.hidden').show();
  				$fieldset.removeClass('closed');
  			}else{
  				$fieldset.find('.ctrlHolder, h3, .note, .list-hierarchy-wrapper, p, .success-msg').not('.hidden').hide();
  				$fieldset.addClass('closed');
  			}
  			
  			return false;
  		});
  		
  		
  		// Edit-Cancel-Save buttons		
  		$('a.fn_edit').click(function() {
  			var $fieldset = $(this).parents('fieldset');	
 			
  			//Hide all the read only fields
  			$fieldset.find('.long-read-only').not('.always-long-read-only').parent().addClass('hidden');
			
  			// Show all the editable fields
			$fieldset.find('.fn_editable').removeClass('hidden');
  			
			//Hide edit button
			$fieldset.find('.fn_edit').addClass('hidden');
			
			//Show Save/Cancel buttons
			$fieldset.find('.fn_save,.fn_cancel').removeClass('hidden');
  			
  			return false;
  		});
  		
  		$('a.fn_cancel').click(function() {
			var $fieldset = $(this).parents('fieldset');
			
			// Show all the read only fields
  			$fieldset.find('.long-read-only').parent().removeClass('hidden');
			
			// Hide all the editable fields
			$fieldset.find('.fn_editable').attr('style','').addClass('hidden');
			$fieldset.find('label.error').remove();
			
			//Show edit button
			$fieldset.find('.fn_edit').removeClass('hidden');
			
			//Hide Save/Cancel buttons
			$fieldset.find('.fn_save,.fn_cancel').addClass('hidden');  			
  			
			
  			return false;
  		});
		
		$('a.fn_save').click(function() {
			var $fieldset = $(this).parents('fieldset');
			var $fields = $(this).parents('fieldset').find('input, select, textarea');
			
			//Clear the checkboxes <li>'s
			$fieldset.find('.check-box-wrapper:not(".fn_editable") ul').html('');
			$fieldset.find('.ctrlHolder:not(".fn_editable") ul li ul').html('');
			
			$fields.each(function(){
				// See what type it is	
				
				if($(this).is('input[type="text"]')) {
					// Input fields
					inputValue = $(this).val();
					$(this).parent().prev('.long-read-only').html(inputValue);
				}
				
				// Select fields
				if($(this).is('select')) {					
					selectValue = $(this).val();
					$(this).parent().prev('.long-read-only').html(selectValue);
				}
								
				// Checkbox fields
				if($(this).is('input:checkbox:checked')) {										
					chValue = $(this).next('label').html();
					$(this).parents('.check-box-wrapper').prev().find('ul').append('<li><div class="long-read-only">✓ '+chValue+'</div></li>');
					if(chValue != "All Datacenter Products" && chValue != "All Desktop Products"){
						$(this).parents('.ctrlHolder').prev().find('ul li ul').append('<li><div class="long-read-only">✓ '+chValue+'</div></li>');
						
					}
				}
				
				// Radio button fields				
				if($(this).is('input:radio:checked')) {					
					radioValue = $(this).next('label').html();
					$(this).parent().prev('.long-read-only').html(radioValue);		
				}										
				

			  // Show all the read only fields
    		$fieldset.find('.long-read-only').parent().removeClass('hidden');
  			
  			// Hide all the editable fields
  			$fieldset.find('.fn_editable').attr('style','').addClass('hidden');
  			$fieldset.find('label.error').remove();
  				
  			//Show edit button
  			$fieldset.find('.fn_edit').removeClass('hidden');
  			
  			//Hide Save/Cancel buttons
  			$fieldset.find('.fn_save,.fn_cancel').addClass('hidden'); 				
			
			});

			
			return false;
		});
		
				
		$('.all_datacenter_products').click(function() {
			$('.all_Datacenter_Products').parents('.ctrlHolder').find('ul li ul :checkbox').attr('checked', this.checked);
		});
		
		$('.all_desktop_products').click(function() {
			$('.all_Desktop_Products').parents('.ctrlHolder').find('ul li ul :checkbox').attr('checked', this.checked);
		});
	}
	
}