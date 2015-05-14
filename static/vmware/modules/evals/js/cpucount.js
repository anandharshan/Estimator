// JavaScript Document
$(document).ready(function() {
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


});


function debug(message){
    // console.log("debug :::: "+message);
}
