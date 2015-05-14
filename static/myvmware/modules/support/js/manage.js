/* ########################################################################### *
/* ***** DOCUMENT INFO  ****************************************************** *
/* ########################################################################### *
 * ##### NAME:  manage.js
 * ##### VERSION: v0.1
 * ##### UPDATED: 04/24/2011
/* ########################################################################### */


if (typeof(myvmware) == "undefined")  
	myvmware = {};

myvmware.manage = {

    init: function() {
      	// controller-wide code
      
    },
    
    licenses: function() {
	
    	var $keyManagement = $('#keyManagement');
    	
    	// Change the module which is displayed when the drop down value changes.
    	$keyManagement.find('.content').not('#'+$('#sel_wantTo').val()).hide(); // Hide all but the currently selected module in the drop down.
    	$keyManagement.find('header p').not('.'+$('#sel_wantTo').val()).hide(); // Hide all but the currently selected paragraph.
    	$('#sel_wantTo').change(function() {
    		var cc = $(this).val();
    		$keyManagement.find('.content:visible').slideUp('fast',function() {
    			$('#'+cc).slideDown();
    		});
    		$keyManagement.find('header p:visible').slideUp('fast',function() {
    			$('header p.'+cc).slideDown();
    		});
    	});
    		
    	// Open Close Functionality
    	$keyManagement.find('.more-details').hide();
    	$keyManagement.find('.openCloseSelect a').click(function() {
    		var $a = $(this);
    		$(this).parents('.key-wrapper').find('.more-details').slideToggle(function() {
    			if ($(this).is(':hidden')) {
    				$a.removeClass('open');
                } else {
                    $a.addClass('open');
                }
    		});
    		return false;
    	});
		
		// Open Close Functionality within a table
		/*	    
    	$keyManagement.find('.more-details').hide();
    	$keyManagement.find('.openCloseSelect a').click(function() {
    		var $a = $(this);
    		$(this).parents('td').find('.more-details').slideToggle(function() {
    			if ($(this).is(':hidden')) {
    				$a.removeClass('open');
                } else {
                    $a.addClass('open');
                }
    		});
    		return false;
    	});*/
    	
    	// Disabling and enabling inputs to which are allowed to be changed
    	$keyManagement.find('.openCloseSelect input').change(function() {
    		// Loop through list and confirm things
    		var $lis, folder;
    		$lis = $(this).parents('.content').find('ul li');
    		folder = $(this).parents('.key-wrapper').find('.env').html();
    		
    		// If they are checkboxes, then disable all other folders
    		if($(this).attr('type')=='checkbox' && ( $(this).val() == true || $lis.find('input:checked').length > 0 )){
    			$lis.each(function() {
	    			if( $(this).find('.env').html() != folder ) {
	    				$(this).addClass('disabled');
	    				$(this).find('input').attr('disabled', true);
	    			}
	    		});
    		} else {
    			// Remove all the disabled classes
    			$lis.each(function() {
    				$(this).removeClass('disabled');
    				$(this).find('input').attr('disabled', false);
    			});
    		}
    	});
    	
    },
    
    divide: function () {
    	$('#sel_howMany').change(function() {
    		var diff, $this, $newKeys, i, $newli, prevNo, newNo, prevLabel;
    	
    		$this = $(this);
    		$newKeys = $('#newKeys');

			// Difference
			diff = $this.val() - $newKeys.find('li').length;

			if(diff > 0){
				
				// foreach difference
				for (i=0; i<diff; i++){
					
					// Need to clone and create new ones
					$newli = $newKeys.find('li:first').clone();
					
					// Get the previous number
					// Look in the html for the second instance of "[" and then the second instance of "]".
					prevLabel = $newKeys.find('li:last label').attr('for');
					prevNo = prevLabel.substring(prevLabel.indexOf("[")+1, prevLabel.indexOf("]"));
					newNo = parseInt(prevNo)+1;
					
					// Simple, just find replace all the instances of [0] in attribute.
					$newli.find('label').attr('for', $newli.find('label').attr('for').replace(/\[0\]/, '['+newNo+']'));
					$newli.find('input').attr('id', $newli.find('input').attr('id').replace(/\[0\]/, '['+newNo+']'));
					$newli.find('input').attr('name', $newli.find('input').attr('name').replace(/\[0\]/, '['+newNo+']'));
					
					$newKeys.append($newli); //Put it into the DOM after the last li
					
				}
			}
			
			if(diff < 0) {
				// Remove n from the end of the li collection
				
				// foreach difference
				for (i=0; i>diff; i--){
					
					$newKeys.find('li:last').remove();
				
				}
			}
			
    	});
    },
    
    move: function() {
    	$('.toFolder li input').change(function(){
    		$('.toFrom .to').html($(this).attr('data-folder-path'));
    	});
    }
    
  }