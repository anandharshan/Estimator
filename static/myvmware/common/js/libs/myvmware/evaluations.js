/* ########################################################################### *
/* ***** DOCUMENT INFO  ****************************************************** *
/* ########################################################################### *
 * ##### NAME:  download.js
 * ##### VERSION: v0.1
 * ##### UPDATED: 05/23/2011
 * ##### AUTHOR: Deloitte Consulting LLP (Jason Smale)
/* ########################################################################### *

  _    ____  ___                        
 | |  | |  \/  |                        
 | |  | | .  . |__      ____ _ _ __ ___ 
 | |/\| | |\/| |\ \ /\ / / _` | '__/ _ \
 \  /\  / |  | | \ V  V / (_| | | |  __/
  \/  \/\_|  |_/  \_/\_/ \__,_|_|  \___|
 
/* ########################################################################### */

if (typeof(myvmware) == "undefined")  
    myvmware = {};
vmf.scEvent=true;
myvmware.evaluations = {
    init: function() {
    // code which will run on all download pages  
	if(vmf.dropdown && $("select#selMyEvals").length && $("select#selMyEvals").find("option").length>0){
		vmf.dropdown.build($("select#selMyEvals"), {
		optionsDisplayNum:10,
		ellipsisSelectText:false,
		ellipsisText:'',
		optionMaxLength:70,
		inputMaxLength:40,
		position:"right",
		onSelect:myvmware.evaluations.onCategoryChange, 
		optionsId:"eaDropDownOpts",
		inputWrapperClass:"eaInputWrapper",
		spanpadding:true,
		spanClass:"corner-img-left"});
		$('#eaDropDownOpts a:first').css({"border-bottom":"1px dotted #aaa"});
                $('div.eaInputWrapper input.optionsHolder').val(rs.lblDropdownText);                
	}
        callBack.addsc({'f':'riaLinkmy','args':['myeval']});
    },
    
        my: function() {    
        
        	if (typeof(sortTable) !== 'undefined' && sortTable != 'default'){ 
				window.location.hash = '#'+sortTable; 
			}
        	
			$('.eval_tabbed_area').each(function(){
				var $this = $(this),
				content_show;
				if($this.find('.tabs').length > 0){
					$this.find('.tabContent').hide();
					content_show = $this.find('.tabs .active').attr('showTab')
					$('#'+content_show).show();
				}
			}); 
			
        	 // When a link is clicked   
    	    $("a.evalTab").click(function () {   
    	  		$this = $(this);
    	        // switch all tabs off   
    	        $this.parents('.tabs').find(".active").removeClass("active");   	
    	        // switch this tab on   
    	        $this.addClass("active");   
    	        // slide all elements with the class 'content' up   
    	        $this.parents('.eval_tabbed_area').find(".tabContent").hide();   
    	        // Now figure out what the 'title' attribute value is and find the element with that id.  
    	        var content_show = $(this).attr("showTab");   
    	        $("#"+content_show).show();   
    	  		return false;
    	    });
    	    
        // Open close tables
        //$('.more-details').hide().prev().find('.openClose').removeClass('open'); //Hide all the more detail rows and remove open classes
    	
        $('a.button.disabled').click(function(e){
			
			e.preventDefault();
			return false;
		});
        
        $('td .openClose').click(function() {           
                        
            var $tableBasedMore,
                $divBasedMore,
                $moreDetail,
                $this = $(this);
            
            //console.log($(this).parents('tr').next('.more-details').length);
            
            $tableBasedMore = $this.parents('tr').next('.more-details');
            $divBasedMore = $this.parent().parent().next().find('.more-details');
            
            var $totalProducts = $(this).parents('.activitiesLog').find('.openClose').length;
            
            if($tableBasedMore.length>0){
                $moreDetail = $tableBasedMore;
            } else {
                $moreDetail = $divBasedMore;
            }
            
            if($this.hasClass('open')){
                $moreDetail.hide();
                $this.removeClass('open');
                $this.parents('tr').removeClass('open');
            }else{
                $moreDetail.show();
                $this.addClass('open');
                $this.parents('tr').addClass('open');
            }
            
            $openedProducts = $(this).parents('.activitiesLog').find('.openClose.open').length;
			var $expandCollapseDiv = $('.expand-collapse');
  			
			if($openedProducts == ($totalProducts) ){
				
				$expandCollapseDiv.find('.fn_expandAll').addClass('disabled');
				$expandCollapseDiv.find('.fn_collapseAll').removeClass('disabled');
				
			}else{
				if($openedProducts == 0){
					$expandCollapseDiv.find('.fn_collapseAll').addClass('disabled');
				}else{
					$expandCollapseDiv.find('.fn_collapseAll').removeClass('disabled');
				}
				$expandCollapseDiv.find('.fn_expandAll').removeClass('disabled');
			}
            return false;
        }); 
        
        // Expand All / Collapse All
        $('.fn_expandAll').click(function(){
            //console.log('test');
        	if(!$(this).hasClass('disabled')){
        		
        		$(this).parents('.tabContent').find('.openCloseSelect-Eval a').not('.open').trigger('click');
        		$(this).parent().parent().find('.fn_collapseAll').removeClass('disabled');
        		$(this).addClass('disabled');
        	}
            return false;
        });
        $('.fn_collapseAll').click(function(){
            
        	if(!$(this).hasClass('disabled')){
        		
        		$(this).parents('.tabContent').find('.openCloseSelect-Eval a.open').trigger('click');
        		$(this).parent().parent().find('.fn_expandAll').removeClass('disabled');
				$(this).addClass('disabled');
        	}
            return false;
        }); 
        
        $('a.disabled').click(function(event){
			event.preventDefault();
			return false;
        });
        
        
                

    },
    
    openHelpPage : function(url){
    	
    	NewWindow = window.open(url,"_blank","width=595,height=570,resizable=yes,left=100,top=100,screenX=100,screenY=100,toolbar=no, location=no,directories=no,status=no,menubar=no,scrollbars=yes,copyhistory=yes") ;
		NewWindow.location = url;
    	//window.open(url, "Help");
    },
    
    openPageInNewWindow : function(url){
    	
    	NewWindow = window.open(url,"_blank") ;
		NewWindow.location = url;
    },
    
    openPageInSameWindow : function(url){
    	
    	window.location = url;
    },
    onCategoryChange:function(){    
		var sel = $("select#selMyEvals");	
		var opt =   $(sel).find('option:selected').attr('href');           
		window.location.href = opt;
    },
    adjustMyEvalContent: function(){ 
    
        var container = $('#content-section'), contentCol = $('.alignLeftTable'), searchCol = $('.alignCarousel'), contentWid;
            if(container){
		contentWid = container.width() - searchCol.width() - (contentCol.outerWidth(true) - contentCol.width());
		contentWid = (contentWid - 12) + 'px';
                contentCol.css('width',contentWid);                
            }
	}    
    }