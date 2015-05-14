var tabSelected = tabOn = null;

var flipTab = function () {
	if (tabOn != null) 
		tabOn.toggleClass('active');
	tabOn = $(this);
	tabOn.toggleClass('active');
	if (tabSelected != null) 
		tabSelected.hide();	
	tabSelected = $(this.hash);
	tabSelected.show();
}

var selectTab = function(event) {
	flipTab.apply(this, arguments);
	event.preventDefault();
};

$(document).ready(function() {
	var showdownloadtab = false;
	var urlhash = (window.location.hash) ? window.location.hash : '';
	//BUG-00016378 fix to avoid automatic page scrolling.
	if(urlhash.indexOf('show_') != -1){
		urlhash = '#' + urlhash.substring(6);
	}
	if($("#tab_download_hidden").length) {
		$("#tab_download").html($("#tab_download_hidden").html());
		$("#tab_download_hidden").remove();
	}
	
	if(typeof(peshowtab) !== 'undefined' && peshowtab == 'download') {
		showdownloadtab = true;
	}
	var tabs = $(".evaltabhead ul li a");
	var tab_hashs = [];
	tabs.each(function(){ 
		tab_hashs.push(this.hash); 
	});
	var ishash = jQuery.inArray(urlhash, tab_hashs) >= 0;
	tabs.each(function(){
		$(this).click(selectTab);
		if ($(this.parentNode).is(":first-child")) {
			$(this).attr('class','first');
			if((!showdownloadtab && !ishash) || (this.hash == urlhash)) {
				flipTab.apply(this, arguments);
			}
			else {
				$(this.hash).hide();
			}
		}
		else if ($(this.parentNode).is(":last-child")) {
			$(this).attr('class','last');
			if ((typeof(showhowtobuy) !== 'undefined' && !ishash) || this.hash == urlhash) {
				flipTab.apply(this, arguments);
			}
		}
		else if((showdownloadtab && !ishash && this.hash=='#tab_download') || this.hash == urlhash) {
			flipTab.apply(this, arguments);
		}
		else {
			if(this.hash == urlhash) {
				flipTab.apply(this, arguments);
			}
		}
	});
});
//toggle view/hide version history link in results page
var toggleDetails = function (link, id) {
	$('#'+id).toggle();
	$(link).toggleClass("tminus");
	return false;	
}
//toggle download groups in download tab for vsphere
var togglevSphereDlgroup = function (link, id) {
	$('#'+id).toggle("slow");
	$(link).toggleClass("expanded");
	return false;   
}
