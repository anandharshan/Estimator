if (typeof(myvmware) == "undefined")  
	myvmware = {};

myvmware.common = {
    init: function() {
        // application-wide code
      	
      	$('nav ul.sf-menu').superfish();
      	
      	// IE6 Main Navigation Hover Helper
		$("nav>ul>li").hover(
			function(){$(this).addClass('hover')},
			function(){$(this).removeClass('hover')}
		);
		
		if(isIE(6, true)){
			$("#breadcrumb").after('<div id="warning-message"><div class="message-holder"><h2>We have detected that your using an old Internet browser which our website doesn\'t support.<br />Please upgrade your browser to ensure an amazing experience.</h2></div></div>');
		}
		
		
		// Tooltip code
		if($("a.fn_tooltip").length>0){
			$("a.fn_tooltip").accessibleTooltip({
				topOffset: -5,
				leftOffset: 10,
				preContent: "<div class=\"arrow\"></div>"
			});
		}
		
		// Collapse Left Navigation
		$subnav = $(".sub-nav");
		$subnav.find(".openClose, .closeTitle").click(function() {
			myvmware.common.toggleSubNav($subnav);
			return false;
		});
		
		// Account switch
		$personalDetails = $("#personal-details");
		$personalDetails.find('.openClose').click(function() {
			myvmware.common.toggleAccountSwitch($personalDetails);
			return false;
		});
		
		// Filter Hide/Show toggle
		if($('.filter').length>0){
			$('.filter-content').hide();
			$('.filter a').html($('.filter a').html().replace('-','+'))
						  .click(function() {
							$this = $(this);
							$this.parents('.column-wrapper').find('.filter-content').slideToggle('fast',function() {
								if($this.html().charAt(0)=='-'){
									$this.html($this.html().replace('-','+'));
								}else{
									$this.html($this.html().replace('+','-'));
								}
							});
							return false;
			}); 
			
			// Filter date toggling
			$('.filter-content .filter-date').not('.active').each(function() {
				$(this).find('.secondRow select, .secondRow input').attr('disabled', true);
			});
			$('.filter-content .filter-date .onoff').change(function() {
				var $this = $(this);
				$this.parents('.filter-content').find('.filter-date').removeClass('active').find('.secondRow select, .secondRow input').attr('disabled', true);
				$this.parents('.filter-date').addClass('active').find('.secondRow select, .secondRow input').attr('disabled',false);
			});	   
		}
		
		// Drop down config menus
		$dropDown = $(".settings .dropdown");
		$dropDown.hide();		
		$dropDown.hover(
			function() {
				$(this).addClass('hovered');
			},
			function() {
				var cc = $(this);
				cc.removeClass('hovered');
				
				setTimeout(function(){
					if(!cc.hasClass('hovered')){
						cc.hide();
					}
				}, 500);
			}
		);
		$('.settings').hoverIntent(function() {
			$(this).find('.dropdown').show();
		},function() {
			var cc = $(this);
			setTimeout(function(){
				if(!cc.find('.dropdown').hasClass('hovered')){
					cc.find('.dropdown').hide();
				}
			}, 500);
		});
		
		
		// VMware.com Drop down menu
		$dropDown = $(".my-vmware .my-vmware-dropdown");
		$dropDown.hide();		
		$dropDown.hover(
			function() {
				$(this).addClass('hovered');
			},
			function() {
				var cc = $(this);
				cc.removeClass('hovered');
				
				setTimeout(function(){
					if(!cc.hasClass('hovered')){
						cc.hide();
					}
				}, 500);
			}
		);
		$('.my-vmware').hoverIntent(function() {
			$(this).find('.my-vmware-dropdown').show();
		},function() {
			var cc = $(this);
			setTimeout(function(){
				if(!cc.find('.my-vmware-dropdown').hasClass('hovered')){
					cc.find('.my-vmware-dropdown').hide();
				}
			}, 500);
		});
			
		// Language Selector
		$dropDown = $(".language .languages");
		$dropDown.hide();		
		$dropDown.hover(
			function() {
				$(this).addClass('hovered');
			},
			function() {
				var cc = $(this);
				cc.removeClass('hovered');
				
				setTimeout(function(){
					if(!cc.hasClass('hovered')){
						cc.hide();
					}
				}, 500);
			}
		);
		$('.language').hoverIntent(function() {
			$(this).find('.languages').show();
		},function() {
			var cc = $(this);
			setTimeout(function(){
				if(!cc.find('.languages').hasClass('hovered')){
					cc.find('.languages').hide();
				}
			}, 500);
		});	
		
		
		// Select All functionality
		$('#select_all').click(function() {
			if($(this).attr('checked') == true){
				$(this).parents('section.column').find('input[type=checkbox]').attr('checked',true);
			} else {
				$(this).parents('section.column').find('input[type=checkbox]').attr('checked',false);
			}
		});
		
		// Table row click
		$('#content-container tr.clickable').click(function() {
			alert('Table row selected...');
		});
		
		// Scrollable Tables
		var scrollableTableHeight = 300;
		if($('.scrollableTable').hasClass('sixFifty')){
			scrollableTableHeight = 650;
		}
		$('.scrollableTable').dataTable( {
			"sScrollY": scrollableTableHeight+"px",
			"bPaginate": false,
			"bFilter":false,
			"sDom": 't',
			"bAutoWidth": false
		});
		
		//Table heading numbers
		$('section.column ul input[type=checkbox]').change(function() {
			var $this = $(this);
			
			if($this.parents('section.column').find('header h1 span.numberSelected').length > 0){
				//Work how how many checkboxes are selected
				$this.parents('section.column').find('header h1 span.numberSelected').html($this.parent().parent().find('input[type=checkbox]:checked').length);
			}
		});
		
    },
    
    // Open and close the account switch panel
    toggleAccountSwitch: function($personalDetails) {
    	
		var accountPanel = $('#accounts');
		var imgOpenClose = $('#icon');
		if(accountPanel.hasClass('closed')) {
			imgOpenClose.attr("src","css/img/icon_accountOpen.png");
			accountPanel.slideDown('normal');
			$('#personal-details').addClass('bgImage');

			accountPanel.removeClass('closed').addClass('open');
		}else{

			imgOpenClose.attr("src","css/img/bg-open-close.png");
			accountPanel.slideUp('normal',function() {
				$('#personal-details').removeClass('bgImage');	
			});
			
			accountPanel.removeClass('open').addClass('closed');
		}
    },
    
    // Open and close the left navigation
    toggleSubNav: function($subnav) {
    	
    	$contentcontainer = $subnav.parents('#content-container');
    	
    	if($contentcontainer.hasClass('open')){
			// The sub navigation is open, so we need to close it.
    		$('#content').stop().animate({"margin-left": "60px"}, 350, function() {
    			$contentcontainer.removeClass('open').addClass('closed');
    			$subnav.find('ul li a').animate({'padding-left': '47px'}, 200);
				//checkPosition();
    		});
    		$subnav.removeClass('opening').addClass('closing');
    		$sectionsToHide = $contentcontainer.find('aside section').not('.sub-nav');
    		if(!$.browser.msie){
    			$sectionsToHide.fadeOut('fast');
    		}else{
    			$sectionsToHide.hide();
    		}
    		
    		
    	}else{
    		// The sub navigation is closed, so we need to open it.
    		$('#content').stop().animate({"margin-left": "256px"}, 350, function() {
				$contentcontainer.removeClass('closed').addClass('open');
				$sectionsToShow = $contentcontainer.find('aside section').not('.sub-nav');
				if(!$.browser.msie){
	    			$sectionsToShow.fadeIn('slow');
	    		}else{
	    			$sectionsToShow.show();
	    		}
				//checkPosition();
    		});
    		$subnav.removeClass('closing').addClass('opening');
    		$subnav.find('ul li a').animate({'padding-left': '39px'}, 200);
    		
    	}
    	
		/*
		var checkPosition = function (){
			//Check which column should be positioned relative (which one is taller)
			$aside = $("#main aside");
			$content = $("#content");
			console.log($aside.height());
			console.log($content.height());
			if($aside.height() > $content.height()){
				$aside.css('position','relative');
				$content.css('position','absolute');
			}else{
				$aside.css('position','absolute');
				$content.css('position','relative');
			}
		}
		*/
		
    }
    
  }
  
  
$( document ).ready( myvmware.common.init );


//Check if the browser is IE
function isIE( version, lessThan ){
	version = (version==undefined) ? 6 : version;
	lessThan = (lessThan==undefined) ? false : lessThan;
	
	if(lessThan){
		if (($.browser.msie)&&(parseInt($.browser.version)<=version)){
			return true;
		}
	} else {
		if (($.browser.msie)&&(parseInt($.browser.version)==version)){
			return true;
		}
	}
	
	return false;	
}