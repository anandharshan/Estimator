//document onload
$(document).ready(function() {
	//comment becuase we now use vmf sbox and onChange in trigger on the page
    //bind version   
    $("select#filter-version-select").change(function() {
        $("select#filter-version-select option:selected").each(function() {
            if ($(this).val() != "") {        		
        		window.location = appFolder + '/info/' + $(this).val();
            }
        });
    });
   
    //bind archive dropdown on home page    
    $("select#filter-archive-select").change(function() {
        $("select#filter-archive-select option:selected").each(function() {
            if ($(this).val() != "") {        		
        		window.location = appFolder + '/info/' + $(this).val();
            }
        });
    });    

    //******Results Page*******
    //Tabs
    //on page load show the contents of the first child and hide the rest
    var tabSelected = tabOn = tabFloat = null;
    var selectTab = function(event) {
        if (tabOn != null) tabOn.toggleClass('ui-tabs-selected');
        tabOn = $(this.parentNode);
        tabOn.toggleClass('ui-tabs-selected');
        if (tabSelected != null) tabSelected.toggle();
        tabSelected = $(this.hash);
        tabSelected.toggle();
        event.preventDefault();
    }

    $("#tab-section .tab").hide();
    $("#tab-section ul.ui-tabs-nav li a").each(function() {
        $(this).click(selectTab);
        if ($(this.parentNode).is(":first-child")) {
            $(this.parentNode).attr('class', 'first');
            $(this).click();
        }
        if ($(this.parentNode).is(":last-child")) {
            $(this.parentNode).attr('class', 'last');
        }
    });
    //Tabs end
    //Details page: show/hide download files
    $("#show-download-files").click(function() {
        $("#download-files-table").toggle("normal");
        if ($(this).html() == $(this).attr("showtext")) {
            $(this).html($(this).attr("hidetext"));
        } else {
            $(this).html($(this).attr("showtext"));
        }
        return false;
    });
    
    $(".categoryRow").click(function() {
    	myarray = $(this).attr("id").split("-");
		$('.cat-' + myarray[1]).toggle();	    		
		$("#"+$(this).attr("id")+" span#ptoggle").toggleClass("tminus");
	    $(this).toggleClass("cathead");
	    return false;
	});
	//expand collaspe select other product
	$("#select_download_accordian_left").click(function() {
        $("#download_teaser2").toggle();
	    $(this).toggleClass("tplus2");
	    return false;
    });
});

/**
* Show eula pop up function
*/
var showeula = function(id) {
    var tag = jq('eula-hidden-' + id);
    //call ajax only if the eula has not been fetched before
    if ($(tag).html() == "eula") {
        $.ajax({
            type: "GET",
            url: appFolder + "/misc/geteulatext/" + id,
            success: function(data, textStatus) {
                $(tag).html(data);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert(errorThrown);
            },
            complete: function(XMLHttpRequest, textStatus) {
                popupeulabox(id);
            }
        });
    } else {
        popupeulabox(id);
    }
}
var popupeulabox = function(id) {
    var tag = jq('eulabox-' + id);
    $(tag).modal({
        close: false,
        overlayId: 'confirmModalOverlay',
        containerId: 'confirmModalContainer',
        persist: true
    });
}
modalOnOpen = function(dialog) {
    dialog.data.fadeIn('fast',
    function() {
        dialog.container.slideDown('slow',
        function() {
            dialog.data.fadeIn('fast');
        });
    });
}
modalOnClose = function(dialog) {
    dialog.data.fadeOut('fast',
    function() {
        dialog.container.slideUp('slow',
        function() {
            dialog.overlay.fadeOut('slow',
            function() {
                $.modal.close();
                // must call this to have SimpleModal
            });
        });
    });
}
showModal = function(element) {
    $.modal($('#' + element));
}

//toggle view/hide version history link in results page
var toggleArchives = function(link, id) {
    var cls = '.' + id;
    $(cls).toggleClass("hidden");
    if ($(link).html() == $(link).attr("showtext"))
    $(link).html($(link).attr("hidetext"));
    else
    $(link).html($(link).attr("showtext"));
    //change background of View/Hide td
    $(link.parentNode).toggleClass("cathead");
    $(link.parentNode).siblings().toggleClass("cathead");
    return false;
}
var jq = function(myid) {
    return '#' + myid.replace(/=/g, "\\=");
}
//expand collaspe category list on result page
var togglecat = function(link, id) {
    $('.' + id).toggle();
    $(link).toggleClass("tminus");
    //change css for parent td and all siblings td
    $(link.parentNode).toggleClass("cathead");
    $(link.parentNode).siblings().toggleClass("cathead");
    return false;
}
var validate_form = function(form) {	
	//alert('validate');
	if (jQuery.trim($('#gsa_query').val()) == "") {		
		return false;
	} else {		
		return true;
	}		
}