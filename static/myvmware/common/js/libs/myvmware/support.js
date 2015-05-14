/* ########################################################################### *
/* ***** DOCUMENT INFO  ****************************************************** *
/* ########################################################################### *
 * ##### NAME:  support.js
 * ##### VERSION: v0.1
 * ##### UPDATED: 05/08/2011
/* ########################################################################### *
/* ########################################################################### */
if (typeof(myvmware) == "undefined")  
	myvmware = {};

myvmware.support = {
  	init: function() {
  	  	// code which will run on all support pages
		$phtd = $('#phInfo').closest('td');
		$('.phDetail').hide();
  	  	$phtd.find('a').click(
			function(){
				if($(this).hasClass('open')){
  				//close it
  				$(this).removeClass('open');
  				$(this).parent().find('.phDetail').slideUp();
  				$(this).html(support.globalVars.showAllLbl);
  			}else{
  				//open it
  				$(this).addClass('open');
  				$(this).parent().find('.phDetail').slideDown();
  				$(this).html(support.globalVars.showDefaultLbl);
  			}
  			return false;
			});
		
  	},
  	
  	contractHistory: function() {
  		
		if($('#tbl_schnocheckboxes').length >0){
			$('#tbl_schnocheckboxes').dataTable( {
				"sScrollY": "400px",
				"bPaginate": false,
				"bFilter":false,
				"sDom": 'zt',
				"bAutoWidth": false,
				"fnInitComplete": function (){
					dt = this; // datatable object	
					if(this.closest('div.dataTables_scrollBody')[0] && this.closest('div.dataTables_scrollBody').attr('style').toLowerCase().indexOf('overflow')!=-1)
					{
						this.closest('div').css("overflow-y","scroll");
						setTimeout(function() {dt.fnAdjustColumnSizing(false);}, 500);
					}
				},
				"aoColumns": [{},{},{"sWidth":"200px"},{},{}]
			});
		};
		
  		if($('#table_contracts_list1').length >0){
			$('#table_contracts_list1').dataTable( {
				"bPaginate": false,
				"bFilter":false,
				"sDom": 'zt',
				"bAutoWidth": false,
				"fnInitComplete": function (){
					dt = this; // datatable object	
				},
				"aoColumns": [{"sWidth":"200px"},{},{},{},{}]
			});
		};
		if($('#table_contracts_list2').length >0){
			$('#table_contracts_list2').dataTable( {
				"bPaginate": false,
				"bFilter":false,
				"sDom": 'zt',
				"bAutoWidth": false,
				"fnInitComplete": function (){
					dt = this; // datatable object	
				},
				"aoColumns": [{"sWidth":"200px"},{},{},{},{}]
			});
		};
		if($('#table_contracts_history').length >0){
			$('#table_contracts_history').dataTable( {
				"sScrollY": "485px",
				"bPaginate": false,
				"bFilter":false,
				"sDom": 'zt',
				"bAutoWidth": false,
				"fnInitComplete": function (){
					dt = this; // datatable object	
				},
				"aoColumns": [{"sWidth":"200px"},{},{},{},{}]
			});
		};
  		$('input.disabled').hover(function(){
  			var $this = $(this),
  				position = $this.position(),
  				leftOffset = -60,
  				topOffset = 18;
  			$this.next('div.tooltip').css('top',position.top+topOffset).css('left',position.left+leftOffset).show().find('.bottom').css('top','-16px');
  		},function(){
  			$(this).next('div.tooltip').hide();
  		}).click(function(){
  			return false;
  		});
  		
  		
  		$('input:disabled').hover(function(e) {
			e.preventDefault();
			alert('hovered');
			
			//$(this).find('.dropdown').show();
		},function() {
			var cc = $(this);
			setTimeout(function(){
				//if(!cc.find('.dropdown').hasClass('hovered')){
				//	cc.find('.dropdown').hide();
				//}
				alert('unhover');
			}, 500);
		});
  	
  	},
	
	entitlement: function() {
	if($('#mysupEntitle').length >0){
			$('#mysupEntitle').dataTable( {
				"sScrollY": "200px",
				"bPaginate": false,
				"bFilter":false,
				"sDom": 'zt',
				"bAutoWidth": false,
				"fnInitComplete": function (){
					dt = this; // datatable object	
					if(this.closest('div.dataTables_scrollBody')[0] && this.closest('div.dataTables_scrollBody').attr('style').toLowerCase().indexOf('overflow')!=-1)
					{
						this.closest('div').css("overflow-y","scroll");
						setTimeout(function() {dt.fnAdjustColumnSizing(false);}, 500);
					}
				},
				"aoColumns": [{"sWidth":"auto"},{},{"sWidth":"300px"}]
			});
		};
		if($('#supEntDetails').length >0){
			$('#supEntDetails').dataTable( {
				"bPaginate": false,
				"bFilter":false,
				"sDom": 'zt',
				"bAutoWidth": false,
				"fnInitComplete": function (){dt = this; // datatable object	
				}
				//,"aoColumns": [{"sWidth":"auto"},{},{"sWidth":"300px"}]
			});
		};
		
		if($('#tblEntcode').length >0){
			$('#tblEntcode').dataTable( {
				"bPaginate": false,
				"bFilter":false,
				"sDom": 'zt',
				"bAutoWidth": false,
				"fnInitComplete": function (){
					dt = this; 
					$('.openCloseSelect a').click(function() {
						$a = $(this);
						nTr = $a.closest('tr')[0];
						if ($a.hasClass('open') && nTr.haveData)
						{
							$a.removeClass('open');	
							$(nTr).next("tr").hide();
						}
						else
						{
							$a.addClass('open');	
							if(!nTr.haveData){
								dt.fnOpen(nTr,getSdata(),'more-details');
								nTr.haveData = true;
							}else
								$(nTr).next("tr").show();
  			}			
  			return false;
		});	
				}
			})
		};
		
		function getSdata(){
			var sOut = "";
				sOut +='<tr class="more-details"><td colspan="6">';
				sOut +='<table><thead><tr><th>SERVICE REQUEST</th><th>OWNDED BY</th><th>DATE OPENED</th><th>DATE CLOSED</th></tr>';
				sOut +='</thead><tbody><tr><td><a href="">SR 123456789</a></td><td>First Last</td><td>YYYY-MM-DD</td><td>YYYY-MM-DD</td></tr><tr>';
				sOut +='<td><a href="">SR 123456789</a></td><td>First Last</td><td>YYYY-MM-DD</td><td>YYYY-MM-DD</td></tr></tbody></table>';
				sOut +='</td></tr>';
			return sOut;
		};
		// Open close tables
  		$('.more-details').hide().prev().find('.openClose').removeClass('open'); //Hide all the more detail rows and remove open classes
	},
  	
  	getHelp: function() {
  		
  		$('.products .subproduct .product:last-child').addClass('lastItem');
  		$('.products .product:first').find('.openClose').addClass('open');
  		
  		$('.products .subproduct').not(':first').hide();
  		$('.products .subproduct .product:first .subproduct').show();
  		$('.products .subproduct .product:first-child .subproduct .incDetail:first-child').parent().parent().find('.openClose').addClass('open');
  		$('.products .subproduct .product:first-child .subproduct .incDetail:first-child').parent().show();
  		$('.products .subproduct .incDetail').hide();
  		$('.products .subproduct ul:first').parent().find('.incDetail').show();
  		
  		var $totalProducts = $('.products .product').length;
  		
  		$('.products .openClose').click(function(){
  			
  			if($(this).hasClass('open')){
  				//close it
  				$(this).removeClass('open');
  				$(this).parent().find('.subproduct').find('.incDetail').hide();
  				//$(this).next('.subproduct').find('ul').hide();
  				$(this).parent().find('.subproduct:first').hide();
  			}else{
  				//open it
  				$(this).addClass('open');
  				//$(this).parent().find('.openClose').addClass('open');
  				$(this).parent().find('.subproduct').find('.incDetail').show();
  				$(this).parent().find('.subproduct:first').show();
  			}
  			
			var $openedProducts = $('.products .product a.open').length;
  			if($openedProducts == ($totalProducts) ){
				$('.fn_expandAll').addClass('disabled');
				$('.fn_collapseAll').removeClass('disabled');
			}else{
				if($openedProducts == 0){
					$('.fn_collapseAll').addClass('disabled');
				}else{
					$('.fn_collapseAll').removeClass('disabled');
				}
				$('.fn_expandAll').removeClass('disabled');
			}
  			return false;
  		});
  		
  		//Get All main issue
  		$('.getHelpColumn select').click(function(){
  			return false;
  		});
  		$('.getHelpColumn').click(function(){
  			$this = $(this);
  			$dropDown = $(this).find('select');
  			$(this).addClass('active').siblings().removeClass('active');
			return false;
  		});

                
  		$('.getHelpMain select').change(function(){
  		  $this = $(this);
  		  $getMain = $(this).parent().parent().parent();
  		  $getMain.addClass('active').siblings().removeClass('active');
  		  // $radioBtn = $this.parents('.getHelpColumn').find('.getHelpSelection input');
  		  // if(!$radioBtn.is(':checked')){
  		    // //Select the radio button
  		    // $radioBtn.attr('checked', true);
  		    // $radioBtn.parents('.getHelpColumn').addClass('active').siblings().removeClass('active');
  		  // }
  		  moduleId = $this.parents('.getHelpColumn').attr('id');
		  $('.step1').addClass('hidden');
		  $('.'+moduleId).removeClass('hidden');	
  		});
		
		// Expand All / Collapse All
		$('.fn_expandAll').click(function(){
			//console.log('test');
			if(!$(this).hasClass('disabled')){
				$(this).parents('.step1').find('a.openClose').not('.open').trigger('click');
				$(this).parents('.step1').find('a.openClose').each(function(){
					if($(this).hasClass('open')){
						$('.fn_expandAll').addClass('disabled');
					}else{
						$('.fn_expandAll').removeClass('disabled');
					}
				})
				$('.fn_collapseAll').removeClass('disabled');
			}
			return false;
		});
		$('.fn_collapseAll').click(function(){
			if(!$(this).hasClass('disabled')){
				$(this).parents('.step1').find('a.openClose.open').trigger('click');
				$(this).parents('.step1').find('a.openClose').each(function(){
					if($(this).hasClass('open')){
						$('.fn_collapseAll').removeClass('disabled');
					}else{
						$('.fn_collapseAll').addClass('disabled');
					}
				})
				$('.fn_expandAll').removeClass('disabled');
			}
			return false;
		});	
		
		// Expand and collapse Tag List
		$('.expandTags').click(function(){
			
			if($(this).hasClass('open')){
				//close it
				$(this).removeClass('open');
				$(this).parents('.popularTagsSection').find('.popularTags').removeClass('scrollable');
				$(this).find('a#minimizeLink').addClass('hidden');
				$(this).find('a#expandLink').removeClass('hidden');
			
			}else{
				//open it
				$(this).addClass('open');
				$(this).parents('.popularTagsSection').find('.popularTags').addClass('scrollable');
				$(this).find('a#expandLink').addClass('hidden');
				$(this).find('a#minimizeLink').removeClass('hidden');
				
			}
			return false;
		});

  		
  	},
  	
  	details: function() {		
    	var $detailsManagement = $('.support-details-wrapper');
    	// Change the module which is displayed when the drop down value changes.
		
    	$detailsManagement.find('.sup_content').not('#'+$('#sel_wantTo').val()).hide(); // Hide all but the currently selected module in the drop down.
    	$detailsManagement.find('header p').not('.'+$('#sel_wantTo').val()).hide(); // Hide all but the currently selected paragraph.
		
		$('#sel_wantTo').change(function() {
    		var cc = $(this).val();
    		$detailsManagement.find('.sup_content:visible').slideUp('fast',function() {
    			$('#'+cc).slideDown();
    		});
    		$detailsManagement.find('header p:visible').slideUp('fast',function() {
    			$('header p.'+cc).slideDown();
    		});
			$detailsManagement.find('.instruction_text').hide();
    	}); 
    	// Open close details-holder-content
    	$('.section-header a.openClose').click(function(){
			$(this).toggleClass("open").parent().next().toggle();
			return false;
		});
    	// Open close activity
    	$('.activity-type a.openClose').click(function(){
			$(this).toggleClass("open").next().toggle();
			return false;
		}); 
		
    },
	
	toggleFilter: function(){
			// Filter date toggling
			$('.filter-content .filter-date').not('.active').each(function() {
				$(this).find('.secondRow select, .secondRow input').attr('disabled', true);
				// disabling calender datepicker
				$(this).find('.secondRow .txt_datepicker').datePicker();
				$(this).find('.secondRow .txt_datepicker').dpSetDisabled(true);
			});
			$('.filter-content .filter-date .onoff').change(function() {
				var $this = $(this);
				$this.parents('.filter-content').find('.filter-date').removeClass('active').find('.secondRow select, .secondRow input').attr('disabled', true);
				$this.parents('.filter-date').addClass('active').find('.secondRow select, .secondRow input').attr('disabled',false);
				
				// enabling calender datepicker
				$this.parents('.filter-date').find('.secondRow .txt_datepicker').datePicker();
				$this.parents('.filter-date').find('.secondRow .txt_datepicker').dpSetDisabled(false);

			});	 
			$('#set_date_range').change(function() {
				// disabling calender datepicker
				$this.parent().parent().next().find('.secondRow').find('.txt_datepicker').datePicker();
				$this.parent().parent().next().find('.secondRow').find('.txt_datepicker').dpSetDisabled(true);
			})
			
			// To allow only numeric values and '/'
			
			/*$(".filter-date input").keydown(function(event) {
				if (event.keyCode == 9 || event.keyCode == 46 || event.keyCode == 8  || event.keyCode == 111 || event.keyCode == 191) {
					// let it happen, don't do anything
				}
				else {
					// Ensure that it is a number and stop the keypress
					if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)) {
	
					}
					else {
						event.preventDefault();
					}
				}
				
			});*/
			if($.validator){
			$.validator.addMethod("DateFormat", function(value,element) {
				return value.match(/^(0[1-9]|1[012])[- //.](0[1-9]|[12][0-9]|3[01])[- //.](19|20)\d\d$/);
					},
						support.globalVars.enterDateMsg
			);
			 $("#filterForm").validate({
					rules: {
						txt_orderDate_from: {
							required: true,
							DateFormat: true
						},
						txt_orderDate_to : {
							required: true,
							DateFormat: true
						}
					}
				});
		}

			// To allow only numeric values in Support Request Number
			// Removed this to fix BUG-00019469
			/*$('#support_request_number').keydown(function (e) {
				if (e.shiftKey || e.ctrlKey || e.altKey) { // if shift, ctrl or alt keys held down
					$(this).keyup(function(){
						this.value = this.value.replace(/[^\d]+/,'');
					});
    			// Prevent character input
				} else {
					var n = e.keyCode;
					if (!((n == 8)              // backspace
					|| (n == 46)                // delete
					|| (n >= 35 && n <= 40)     // arrow keys/home/end
					|| (n >= 48 && n <= 57)     // numbers on keyboard
					|| (n >= 96 && n <= 105))   // number on keypad
					) {
						e.preventDefault();     // Prevent character input
					}
				}
			});*/



	},
	activatePlaceholders: function() {
		if($.browser.msie) {
			$('[placeholder]').focus(function() {
			  var input = $(this);
			  if (input.val() == input.attr('placeholder')) {
				input.val('');
				input.removeClass('placeholder');
			  }
			}).blur(function() {
			  var input = $(this);
			  if (input.val() == '' || input.val() == input.attr('placeholder')) {
				input.addClass('placeholder');
				input.val(input.attr('placeholder'));
			  }
			}).blur();
			
			/*$('form').submit(function(){
				$this = $(this);
				var input = $($this).find('input');
				alert(input);
				
					if (input.hasClass('placeholder')) {
						that.value = '';
						alert(input.val());
					}
				
			});*/
		}
	},
	getCalendar: function() {
		vmf.dom.onload(function(){
				var d = new Date();
				var curr_date = d.getDate();
				var curr_month = d.getMonth();
				var curr_year = d.getFullYear();
                // Local variables to hold calendar elements
                var startDate = vmf.dom.id("txt_orderDate_from");
                var endDate = vmf.dom.id("txt_orderDate_to");
                // Initialize the calendars
                vmf.calendar.build(vmf.dom.get(".txt_datepicker"), {
                    dateFormat: 'yyyy-mm-dd',
                    startDate: '1990-01-01',
                    endDate: '2020-02-31',
					startDate_id: vmf.dom.id('txt_orderDate_from'),
					endDate_id: vmf.dom.id('txt_orderDate_to'),
					error_msg_f: support.globalVars.validFromDateMsg,
					error_msg_t: support.globalVars.validToDateMsg
					/*,
                    selectedDate: '2011/07/20'*/
                });

                // Bind event handler to the startDate calendar
                vmf.dom.addHandler(startDate, "dpClosed", function(e, selectedDate){
                    var d = selectedDate[0];
                    if(d){
                        d = new Date(d);
                        vmf.calendar.setStartDate(endDate, d.addDays(1).asString());
                    }
                });
                // Bind event handler to the endDate calendar
                vmf.dom.addHandler(endDate, "dpClosed", function(e, selectedDate){
                    var d = selectedDate[0];
                    if(d){
                        d = new Date(d);
                        vmf.calendar.setEndDate(startDate, d.addDays(-1).asString());
                    }
                });
				
            })

		},
		enableRelevantKeywords: function() {
			//alert('hi');
			/*$('#problem_descripText').keyup(function() {
				$this = $(this);
				var keyWordContainer = $('.keyWord-wrapper');
				//keyWordContainer.empty();
				keyWordContainer.append('<span class="textGreen">'+$this.val()+'<a href="#"><img src="static/myvmware/common/css/img/remove2.png" /></a>&nbsp;</span>');
			})*/
			$('.popularTags span.popularTag a').click(function(){
				$this = $(this);
				var clickedTag = $this.html();
				$('#problem_descripText').val(clickedTag);
				return false;
			})
			
			$('.keyWord-wrapper').delegate('img', 'click', function(event){
				//alert($(this).parent().parent().html());
				$(this).parent().parent('span').remove();
				return false;
			});
		}, openSupportHelpPage:function(URL){
		   NewWindow = window.open(URL,"_blank","width=595,height=570,resizable=yes,left=100,top=100,screenX=100,screenY=100,toolbar=no, location=no,directories=no,status=no,menubar=no,scrollbars=yes,copyhistory=yes") ;
		   NewWindow.location = URL;
		}, checkFilterSetting:function(){
		   if($('#isFilterChecked').val()=="minus")
		   {
			$('.filter a').click();
		    }
		}
  	
  }
