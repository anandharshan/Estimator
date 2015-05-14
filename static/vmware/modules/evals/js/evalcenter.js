$(document).ready(function() {

        vmf.scEvent = true;

    initializeEvalCenter();

    initializeTabCenter();

    initialiseCpuCount();

});


/***                                        loginwidget.js start                                        ***/

var pelogintab = (function($) {
    var tabSelected, tabOn;

    var flipTab = function() {
        if (tabOn) {
            tabOn.className = '';
        }
        tabOn = this.parentNode;
        tabOn.className = 'active';
        if (tabSelected) {
            tabSelected.hide();
        }
        tabSelected = $(this.hash);
        tabSelected.show();
        $(".text:first", tabSelected).focus();
    };

    var activeTab = function(e) {
        flipTab.apply(this, arguments);
        e.preventDefault();
    };

    var activeTabbyLink = function(e) {
        var hash = this.hash;
        $('#logontab ul li a').each(function() {
            if(this.hash == hash.replace("_link", "")) {
                flipTab.apply(this, arguments);
            }
            else {
                $(this.hash).hide();
            }
        });
        e.preventDefault();
    };

    //peactivetab is a global variable to mark an active tab
    if(typeof(peactivetab) === 'undefined' || !peactivetab) {
        peactivetab = 'tab_login';
    }

    return function () {
        $('#logontab ul li a').each(function() {
            $(this).click(activeTab);
            if(this.hash.substr(1) == peactivetab) {
                flipTab.apply(this, arguments);
            }
            else {
                $(this.hash).hide();
            }
        });

        $('#tab_login_register_link').find('a').each(function() {
            $(this).click(activeTabbyLink);
        });
    };

})(jQuery);

window.onload = pelogintab;

/***                                        loginwidget.js end                                      ***/

/***                                        tabcenter.js start                                      ***/

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
};

var selectTab = function(event) {
    flipTab.apply(this, arguments);
    event.preventDefault();
};

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

/***                                        tabcenter.js end                                        ***/

function initializeEvalCenter(){

    $("#main").children(".note").addClass("tab").removeClass("note");

    if($('#tab_download_hidden_license').length) {
        $("#tab_download").append($("#tab_download_hidden_license").html());
        $('#tab_download_hidden_license').remove();
    }

    if($('#tab_download_hidden_bom').length) {
        $("#tab_download").append($("#tab_download_hidden_bom").html());
        $('#tab_download_hidden_bom').remove();
    }

    if($('#tab_download_hidden_eula').length) {
        $("#tab_download").append($("#tab_download_hidden_eula").html());
        $('#tab_download_hidden_eula').remove();
    }

    if($('#tab_ssr_help').length) {
        $('#tab_ssr_help').html($('#tab_support_hidden_sr').html());
        $('#tab_support_hidden_sr').remove();
        myvmware.evalSupport.init();
    } else {
        $('#tab_support').html($('#tab_support_hidden_sr').html());
        $('#tab_support_hidden_sr').remove();
        myvmware.evalSupport.init();
    }


    var bc_hidden = $('#breadcrumb_hidden').val();
    if(typeof bc_hidden != 'undefined') {
        var breadcrumb = '<div id="breadcrumbs">'+bc_hidden+'</div>';
        $('#top-of-page').before(breadcrumb);
        $('#breadcrumb_hidden').remove();
    }


}


function initializeTabCenter(){

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
}


function initialiseCpuCount(){

    // hides the slickbox as soon as the DOM is ready
    // (a little sooner than page load)
    $('#hostcount').hide();
    //This function show/hide change host count display
    $('a#hostcount-toggle').click(function() {
        $('#cpucount').val("");
        $("#hostsubmiterror").html("");
        $('#hostcount').toggle(400);
        return false;
    });
    $('input#hostcount-cancel').click(function() {
        $('#cpucount').val("");
        $("#hostsubmiterror").html("");
        $('#hostcount').hide(400);
        return false;
    });

    //override to have only numbers allowed in the cpu count box

    $("#cpucount").keydown(function(event){

        // Allow only backspace and delete
        if ( event.keyCode == 46 || event.keyCode == 8 ) {
            // let it happen, don't do anything
        }
        else {
            // Ensure that it is a number and stop the keypress
            if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
                event.preventDefault();
            }
        }
    });


   //This function updates host for server 2.0
   $('input#hostcount-submit').click(function() {

        var cpucount = encodeURIComponent(jQuery.trim($('#cpucount').val()));
        debug(cpucount);

        if(cpucount.length == 0 ){
            $("#hostsubmiterror").html(itevals.globalVar.enterNumbers);
            return false;
        }

        if(cpucount == "0" || cpucount == "00" || cpucount == "000"){
            cpucount = "0";
            $("#cpucount").val("0");
            $("#hostsubmiterror").html(itevals.globalVar.enterNumbers);
            return false;
        }


        var currentcpucount = encodeURIComponent(jQuery.trim($('#hostdisplaytext').html()));
        debug(currentcpucount);

        var urlAjax = $("#saveCPUCount").val();
        debug(urlAjax);

        $.ajax({
            type    : "POST",
            async   : false,
            dataType: "json",
            url     : urlAjax,
            data    : {cpuCount: cpucount, existingCPUCount: currentcpucount, prgShortName: $("#prgShortName").val()},
            success : function(data) {
                        debug("Success init");
                        $("#hostdisplaytext").html(data.updatedCPUCount);
                        $('#cpucount').val("");
                        $("#hostsubmiterror").html("");
                        $('#hostcount').hide(400);
                        debug("Success complete");
                    },
            error: function(xhr, status, error) {
                debug("Error Happened" +xhr);
                debug("Error Happened" +error);
                $("#hostsubmiterror").html("Update Error!");
            }
        });
     });

    //for windows linuux counts
     $('#servercpu').hide();
     $('a#servercpu-toggle').click(function() {
             $('#windowscpu').val("");
             $('#linuxcpu').val("");
             $("#hostsubmiterror").html("");
             $('#servercpu').toggle(400);
             return false;
    });

    $('input#servercpu-cancel').click(function() {
             $('#windowscpu').val("");
             $('#linuxcpu').val("");
             $("#hostsubmiterror").html("");
             $('#servercpu').hide(400);
             return false;
    });

    $("#windowscpu").keydown(function(event){

        // Allow only backspace and delete
        if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 ) {
            // let it happen, don't do anything
        }
        else {
            // Ensure that it is a number and stop the keypress
            if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
                event.preventDefault();
            }
        }
    });

    $("#linuxcpu").keydown(function(event){

        // Allow only backspace and delete
        if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 ) {
            // let it happen, don't do anything
        }
        else {
            // Ensure that it is a number and stop the keypress
            if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
                event.preventDefault();
            }
        }
    });

   //This function updates host for server 2.0
   $('input#servercpu-submit').click(function() {

        var windowscount = encodeURIComponent(jQuery.trim($('#windowscpu').val()));
        var linuxcount   = encodeURIComponent(jQuery.trim($('#linuxcpu').val()));

        if(windowscount.length == 0 || linuxcount.length==0 ){
            $("#hostsubmiterror").html(itevals.globalVar.enterNumbers);
            return false;
        }

        if(windowscount == "0" || windowscount == "00" || windowscount == "000"){
            windowscount = "0";
        }

        if(linuxcount == "0" || linuxcount== "00" || linuxcount == "000"){
            linuxcount = "0";
        }

        if(windowscount ==  "0" && linuxcount == "0" ){
            $("#windowscpu").val("0");
            $("#linuxcpu").val("0");
            $("#hostsubmiterror").html(itevals.globalVar.enterNumbers);
            return false;
        }

        var totalCPUCOunt = parseInt(windowscount)+parseInt(linuxcount);

        if(totalCPUCOunt > 999){
            $("#hostsubmiterror").html(itevals.globalVar.enterNumbers);
            return false;
        }

        var urlAjax = $("#saveWindowsLinuxCount").val();
        debug(urlAjax);

        $.ajax({
            type    : "POST",
            async   : false,
            dataType: "json",
            url     : urlAjax,
            data    : {windowsCPU: windowscount, linuxCPU: linuxcount, prgShortName: $("#prgShortName").val()},
            success : function(data) {
                        debug("Success init");
                        $("#windowshosttext").html(data.updatedWindowsCount);
                        $("#linuxhosttext").html(data.updatedLinuxCount);
                        $('#cpucount').val("");
                        $("#hostsubmiterror").html("");
                        $('#servercpu').hide(400);
                        debug("Success complete");
                    },
            error: function(xhr, status, error) {
                debug("Error Happened" +xhr);
                debug("Error Happened" +error);
                $("#hostsubmiterror").html("Update Error!");
            }
        });
     });

}

function debug(message){
    // console.log("debug :::: "+message);
}