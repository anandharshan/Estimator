/* ########################################################################### *
/* ***** DOCUMENT INFO  ****************************************************** *
/* ########################################################################### *
 * ##### NAME:  account.js
 * ##### VERSION: v0.1
 * ##### UPDATED: 04/24/2011 
/* ########################################################################### */

if (typeof(myvmware) == "undefined")  
	myvmware = {};

myvmware.modals = {
	// code to call on all pages which require a modal
  	init: function() {

  		// See if border-radius is supported by the browser.
  		var borderRadiusSupported = $('html').hasClass('borderradius');
  		
  		$("a.fn_openModal").click(function(){  // Add rule model popup
			vmf.modal.show($(this).data('vmf-modal'), { 
					checkPosition: true,
					onShow: function (dialog) {
						var origin = dialog.orig;
						if(origin.attr('id') == 'licenseKeyHistoryContent'){
							myvmware.modals.drawTable('tbl_keyhistory');
						}else if(origin.attr('id') == 'requestPermissionContent'){
							//$('#req_permission_tbl').tableScroll({height:350});
							vmf.tablescroll.init('req_permission_tbl',{
									height:350,
									width:533
								}
							)
						}else if(origin.attr('id') == 'modifyPermissionContent1'){
							vmf.tablescroll.init('modifyPermissionTable',{
									height:270,
									width:533
									
								}
							)
							$('.tablescroll_wrapper table tr td:eq(0)').css('width','375px');
									$('.tablescroll_wrapper table tr td:eq(1)').css('width','140px');
						};
						$('.mfilter a').toggle(function(){
							$('.mfilter a').html($('.mfilter a').html().replace('- Collapse','+ Expand'));$('.partnerSearchArea').slideUp();return false;},
							function(){$('.mfilter a').html($('.mfilter a').html().replace('+ Expand','- Collapse'));$('.partnerSearchArea').slideDown();return false;}
						)
					} 
			});
			if(!borderRadiusSupported){
				$('.modalContent .button').corner();
			}
			return false;
		});
		
		$(".modalContent .fn_cancel").click(function(){
			vmf.modal.hide();
			if(!borderRadiusSupported){$('.modalContent .button').uncorner();}
			return false;
		});
  		
		/*Tree open and close*/
		$(".license_folders_id").find('li a').toggle( 
			function(){
				$li = $(this).closest('li');
				$li.find('ul').show();
				$(this).addClass("open")
				return false;
			},
			function(){
				$li = $(this).closest('li');
				$li.find('ul').hide();
				$(this).removeClass("open");
				return false;
			}
		)
		/*Tree open and close ENDS here*/
               myvmware.modals.ffolder();
  	},
	drawTable: function(tableName){
			

			 var oTable = $('#'+tableName).dataTable( {	
			 	"aoColumns": [{"sWidth":"100px"},{"sWidth":"240px"},{"sWidth":"300px"},{ "sWidth": "auto"}],		
				"sScrollY": '200px',
				"aaSorting": [[0, 'asc']],
				"bPaginate": false,
				"bFilter":false,
				"sDom": 't',
				"bAutoWidth": false,
				"bDestroy": true,
				"bRetrieve": false
				
			});
			//oTable.fnClearTable( 0 );
			oTable.fnDraw();

  	},
ffolder:function (){//Find a folder modal window.
		var $icon = $('.srIcon');
		var $txtbox = $('.modalContent input#searchFf');
		$icon.click(function(){
			if($(this).hasClass('.sIcon')){
				// do the search here
			}
			else{
				$txtbox.val('');
				$(this).addClass('sIcon');
			}
		});
		$txtbox.keyup(function(){
			setTimeout(function($t) {
				if($txtbox.val()=="" && !$('.srIcon').hasClass('sIcon')){$icon.addClass('sIcon');}
				else{$icon .removeClass('sIcon');};}, 500);
		});
		$('#findFolderContent').find('ul li input:radio').click(function(){
			if($(this).is(':checked')){	
				$(this).closest('ul').find('li.selected').removeClass('selected');
				$(this).closest('li').addClass('selected')
			}			
		});
	} // end of Find a folder

  }
