/* ########################################################################### *
/* ***** DOCUMENT INFO  ****************************************************** *
/* ########################################################################### *
 * ##### NAME:  account.js
 * ##### VERSION: v0.1
 * ##### UPDATED: 04/24/2011 
/* ########################################################################### */

if (typeof(myvmware) == "undefined")  
	myvmware = {};

myvmware.account = {
  	init: function() {
  		// code which will run on all account pages

  		// Open close tables within tables
  		$('tr.more-details').hide().prev().find('.openClose').removeClass('open'); //Hide all the more detail rows and remove open classes
  	  	
  	  	$('td .openClose').click(function() {
  			
  			var $moreDetail = $(this).parents('tr').next('.more-details');
  			var $this = $(this);
  			
  			if($this.hasClass('open')){
  				$moreDetail.hide();
  				$(this).removeClass('open');
          $this.parent().parent().parent().removeClass('opened');
  			}else{
  				$moreDetail.show();
  				$(this).addClass('open');
          $this.parent().parent().parent().addClass('opened');
  			}
  			
  			return false;
  		});
  		
		if($('#myAccountTable').length > 0){
			$('#myAccountTable').dataTable( {
				"sScrollY": "495px",
				"bPaginate": false,
				"bFilter":false,
				"sDom": 't',
				"bAutoWidth": false
			});
		}
  		
  	},

    detailsNotifications: function() {
      
      // Open & CLose functionality.
      $('.profile-maximize-button').click(function(){
        var $this = $(this),
            $fieldset = $this.parent().parent('fieldset');

        if($fieldset.hasClass('open')){
          $fieldset.removeClass('open').addClass('closed');
          $fieldset.find('> ul').hide();
        } else {
          $fieldset.removeClass('closed').addClass('open');
          $fieldset.find('> ul').show();
        }

        return false;
      });

      // Click one, click all
      $('.accountsAdditionalWrappers fieldset > ul > li input').click(function(){
        var $this = $(this);

        // Check current state of checkbox
        if(this.checked){
          // Select all the children
          $this.parent().parent().find('ul input').attr('checked','checked');
        } else {
          // Unselect all the children
          $this.parent().parent().find('ul input').removeAttr('checked');
        }

      });

    }

  }