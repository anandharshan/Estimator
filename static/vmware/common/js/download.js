$(document).ready(function() {
	// added to fix BUG-00051752 and BUG-00051753
	$('#toggleHandle').click(function(){                                        
            $('.sReadMore').toggleClass('displayNone');
            $('.sReadLess').toggleClass('displayNone');
            $('.toggleDetails').toggleClass('showAll');
	});
	$('.white-Box ul li a').each(function(){
		$(this).html(vmf.wordwrap($(this).text(),2))
	});
	if(!themeDisplay.isSignedIn()){bindFilter();}
	fillBreadcrumbs();
	archivedProductsOnChange();                
});
$("td.filename .readMoreDetails").click(function(){
	$(this).next().show();
	$(this).hide();
});

$("td.filename .detailsOnHover #closeDetails").click(function(){
	$(this).parent().prev().show();
	$(this).parent().hide();
});
function onloadCall(){
	var $more = $('.more-details');
	$more.each(function(){
		var $this = $(this);
		if($this.parents('table').hasClass('fn_startOpen')){
			$this.show().prev().addClass('open'); //Hide all the more detail rows and remove open classes
		} else {
			$this.hide().prev().removeClass('open'); //Hide all the more detail rows and remove open classes
		}
	});
	// Clickable table rows
	$("tr.clickable").hover(function() {
		$(this).addClass('hover');
	}, function() {
		$(this).removeClass('hover');
	}).click(function() {			
		var $tableBasedMore,
		$divBasedMore,
		$moreDetail,
		$this = $(this);							
		$tableBasedMore = $this.next('.more-details');
		$divBasedMore = $this.parent().parent().next().find('.more-details');
		if($tableBasedMore.length>0){
			$moreDetail = $tableBasedMore;
		} else {
			$moreDetail = $divBasedMore;
		}
		if($this.hasClass('open')){
			$moreDetail.hide();
			$this.removeClass('open');
		}else{
			$moreDetail.show();
			$this.addClass('open');
		}
		checkExpandCollapse();
		return false;
	});
	//Tab management - Hide and show the correct tabs
	// When a link is clicked   
	// Expand All / Collapse All
	expandCollapseAll();
	// Initial check to see if Expand All/Collapse All should be 'disabled'
	checkExpandCollapse();
}
// On change of the select redirect user to product family page.
function archivedProductsOnChange(){
	$('.scSelectAnArchive').change(function(event) {
		//Do for on change
		var option;
		option =  this.options[this.selectedIndex];
		location.href= jQuery(option).attr("customHref");
	})
}
// Start For UnBinding various events
	function unBindEventsForProdInfoReq(){
		//$('a.tab').unbind('click');
	}
// Check to see if all all clickable rows are expanded or not
function checkExpandCollapse(){
	$('.expand-collapse').each(function(){
		//Do for each just to make sure that if there are 3 tabs on a page that it gets applied to the correct one.
		var $this = $(this),
		clickableRows;
		//Clear previous classes
		$this.find('.fn_expandAll, .fn_collapseAll').removeClass('disabled');
		clickableRows = $this.parents('.filter-section').next('div').find('tr.clickable');
		openClickableRows = $this.parents('.filter-section').next('div').find('tr.clickable.open');
		if(clickableRows.length === openClickableRows.length) {
			//Disable Expand All button
			//	$this.find('.fn_expandAll').addClass('disabled');
		} else if (openClickableRows.length === 0) {
			//Disable the Collapse button
			//	$this.find('.fn_collapseAll').addClass('disabled');
		}
	});
};
function fillBreadcrumbs(){
	if(jQuery('.breadcrumbs')!=null && jQuery('#tempbreadcrumbs')!=null){
		jQuery('.breadcrumbs').html(jQuery('#tempbreadcrumbs').html());
		jQuery('#tempbreadcrumbs').html("").remove();
	}
}
function bindFilter(){
	// Filter Hide/Show toggle
	if($('.filter').length>0){
		$('.filter-content').hide();
		$('.filter a').html($('.filter a').html().replace('-','+'))
		.click(function() {
			$this = $(this);
			//$this.parents('.column-wrapper').find('.filter-content').slideToggle('fast',function() {
			if($this.html().charAt(0)=='-'){
				$this.html($this.html().replace('-','+'));
				$this.parents('.column-wrapper').find('.filter-content').hide();
			}else{
				$this.html($this.html().replace('+','-'));
				$this.parents('.column-wrapper').find('.filter-content').show();
			}
			return false;
		}); 
	}
};
function expandCollapseAll(){
	// Expand All / Collapse All
	$('.fn_expandAll').click(function(){
		$(this).parents('.tabContent').find('.openCloseSelect a').not('.open').trigger('click');
		return false;
	});
	$('.fn_collapseAll').click(function(){
		$(this).parents('.tabContent').find('.openCloseSelect a.open').trigger('click');
		return false;
	});
};