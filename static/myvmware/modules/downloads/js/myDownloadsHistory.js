if (typeof(myvmware) == "undefined")
  myvmware = {};
dt= null;
isFilterSearch = false;

myvmware.downloadsHistory =  {
        loadDownloadsHistoryData: null,
        tabId :null,
        borderRadiusSupported : $('html').hasClass('borderradius'),
        init: function(loadDownloadsHistoryData) {
                $('#dlgType option').sortElements(function(a, b){
                        return $(a).text() > $(b).text() ? 1 : -1;
                });
                $('#language option').sortElements(function(a, b){
                        return $(a).text() > $(b).text() ? 1 : -1;
                });
                if(vmf.dropdown && $("select#myProducts").length && $("select#myProducts").find("option").length>0){
                                vmf.dropdown.build($("select#myProducts"), {optionsDisplayNum:10,ellipsisSelectText:false,ellipsisText:'',optionMaxLength:70,inputMaxLength:40,position:"right",onSelect:myvmware.downloadsHistory.onCategoryChange,optionsId:"eaDropDownOpts",inputWrapperClass:"eaInputWrapper",spanpadding:true,spanClass:"corner-img-left"});
                               	//Added min-width because in localization, text is truncating( #BUG-00062228)
                                $('.mydownloadSelect div.eaInputWrapper input.optionsHolder').val(rs.lblDropdownText).css("min-width","190px");
                                $('.mydownloadSelect div.eaInputWrapper').css("min-width","200px");
                                $('#eaDropDownOpts a:first').css({"border-bottom":"1px dotted #aaa"});
                }
                myvmware.downloadsHistory.getCalendar("txt_release_from","txt_release_to");
                myvmware.downloadsHistory.getCalendar("txt_txDate_from","txt_txDate_to");
                myvmware.downloadsHistory.loadDownloadsHistoryData=loadDownloadsHistoryData;
                setTimeout(function(){myvmware.downloadsHistory.adjustContentHeader();},10);  // BUG-00048299
                var dtd = null;
                var nTr = null;
                vmf.datatable.build($('#tbl_download_history'),{
                                        "bProcessing": true,
                                        "bRetrive" : true,
                                        "bInfo":true,
                                        "bServerSide": true,
                                        "bAutoWidth": false,
                                        "aoColumns": [{"sWidth":"20px"},{"sWidth":"80px"},{ "sWidth": "200px"},{ "sWidth": "350px"},{ "sWidth": "100px"}],
                                        "sAjaxSource": loadDownloadsHistoryData,
                                        "sPaginationType": "full_numbers",
                                        "aLengthMenu": [[10, 25, 50], [10, 25, 50]],
                                        "iDisplayLength": 10,
                                        "aaSorting": [[ 1, 'desc' ]],
                                        "sDom": 'rt<"bottom"lpi<"clear">>',
                                        "oLanguage": {
                                                "sLengthMenu": "<label>"+downloadsHistory.globalVar.itemsPerPage+"</label> _MENU_",
                                                "sInfo": downloadsHistory.globalVar.recordsInfo,
                                                "sInfoEmpty": downloadsHistory.globalVar.recordsEmpty,
                                                "sInfoFiltered": downloadsHistory.globalVar.recordsFiltered,
			                        "sProcessing": downloadsHistory.globalVar.DtablesProcessing,
		    				"sLoadingRecords": downloadsHistory.globalVar.loadingLbl,
		    				"oPaginate": {
		    					"sPrevious": downloadsHistory.globalVar.DtablesPrevious,
		    					"sNext": downloadsHistory.globalVar.DtablesNext, 
		    					"sLast": downloadsHistory.globalVar.DtablesLast, 
		    					"sFirst": downloadsHistory.globalVar.DtablesFirst
			      				}                                                
                                        },
                                        "fnInitComplete": function(){
                                                dtd = this;
                                                $tbl = this;
                                                $('#tbl_download_history_processing').hide();
                                                /*if($('#tbl_download_history').find("tr").length<=5){
                                                        $('#tbl_download_history').parent().find('div.dataTables_paginate')[0].style.display = "none";
                                                } else {
                                                        $('#tbl_download_history').parent().find('div.dataTables_paginate')[0].style.display = "block";
                                                }*/
                                                $('div.openCloseSelect a:eq(0)').trigger('click');
                                        },
                                        "fnDrawCallback":function(){
                                                if(Math.ceil(this.fnSettings().fnRecordsDisplay()/this.fnSettings()._iDisplayLength)>1){
                                                        $("#tbl_download_history_paginate").css("display", "block");
                                                } else {
                                                        $("#tbl_download_history_paginate").css("display", "none");
                                                }
                                                if(this.fnSettings().fnRecordsDisplay()>parseInt($("#tbl_download_history_length option:eq(0)").val(),10)){
                                                        $("#tbl_download_history_length").css("display", "block");
                                                } else {
                                                        $("#tbl_download_history_length").css("display", "none");
                                                }
                                                $tbl = this;
                                                settings= this.fnSettings();
                                                var totalcnt = settings.fnRecordsTotal();
                                                if(totalcnt == 0){
                                                        var $nTd = $tbl.find('td.dataTables_empty');
                                                        $htm = '';
                                                        $tbl.css('height', '100%');
                                                        $nTd.addClass('noborder').css('height','100%').css('vertical-align','middle');
                                                        $nTd.html('');
                                                        if(isFilterSearch){
                                                                $htm += '<div class="no_downloads">';
                                                                $htm += '<p class="no_msg">' + downloadsHistory.globalVar.noProductsMatchWithFilter + '</p>';
                                                                $htm += '</div>';
                                                                $htm +='';
                                                                $(this).parent().parent().parent().parent().find(".filter-section a").addClass('disabled');
                                                                $(this).parent().parent().parent().parent().find(".filter-section li").removeClass('active');

                                                        }else{
                                                                var tryVmwareURL = $('#tryVmwareURL').val();
                                                                $htm += '<div class="no_downloads">';
                                                                $htm += '<p class="no_msg">' + downloadsHistory.globalVar.notDownloadedProducts + '</p>';
                                                                $htm += downloadsHistory.globalVar.toDownloadProducts
 																$htm += downloadsHistory.globalVar.toBuyProducts
 																$htm +=  myvmware.common.buildLocaleMsg(downloadsHistory.globalVar.toDownloadFreetrail,tryVmwareURL);
                                                                $htm += '</div>';



                                                                $('#dwApplyFilter').addClass( 'disabled' );
                                                                $('#resetFilter').addClass( 'disabled' );
                                                                $(this).parent().parent().parent().parent().find(".filter-section a").addClass('disabled');
                                                                $(this).parent().parent().parent().parent().find(".filter-section li").removeClass('active');
                                                                $('#filterLink').unbind('click');


                                                        }
                                                        $nTd.html($htm);
                                                }else{

                                                        $('#dwApplyFilter').click(function(){
                                                                if(!checkForEmptySearchForHistory() && datesValidateForHistory() &&	datesValidateForHistoryReleaseDates()) {
                                                                vmf.datatable.reload($('#tbl_download_history'),prepareAjaxUrlWithFilters(loadDownloadsHistoryData),myvmware.downloadsHistory.postProcessingData)
                                                                }
                                                                });
                                                        $('#resetFilter').click(function(){vmf.datatable.reload($('#tbl_download_history'),resetFilters(loadDownloadsHistoryData),myvmware.downloadsHistory.postProcessingData) });
                                                }
                                        }
                }); // End of datatable config

                //to disable link
                $('a.disabled').click(function(event){
                        event.preventDefault();
                        return false;
                });
                // Date range or all
                $('ul.showLastDownload li a').click(function(e){
                        var $this = $(this);
                        if(!$this.hasClass('disabled')){
                        e.preventDefault();
                        if($(e.target).parent('li').is('.active')) return;
                        /*$('.filter-content').slideDown('slow',function(){
                                var link = $('.filter-content').parent().find('div.filter a')
                                if(!link.hasClass('disabled')) {
                                if($(link).html().charAt(0)=='+'){
                                        $(link).html($(link).html().replace('+','-'));
                                }
                                }
                        });*/
                        var id = $(e.target).attr('id');
                        var diff;
                        if(!$('ul.showLastDownload li a').hasClass('disabled')){
                        $('ul.showLastDownload li').removeClass('active');
                        //console.log(id);
                        $(e.target).parent('li').addClass('active');
                        if(id == 'lastThirtyDays'){
                                diff = -30;
                        }else if(id == 'lastNinetyDays'){
                                diff = -90;
                        }else{
                                diff=0;
                        }
                        } else {
                                diff=0;
                        }
                        myvmware.downloadsHistory.setDateFields('#txt_txDate_from','#txt_txDate_to',diff);
                        if(diff == 0){
                                myvmware.downloadsHistory.RefreshTable('tbl_download_history',loadDownloadsHistoryData);
                        }else{
                                myvmware.downloadsHistory.RefreshTable('tbl_download_history',loadDownloadsHistoryData);
                        }
                        //console.log(e.target);
                        }
                        return false;
                });

                        $('table#tbl_download_history>tbody>tr').live('mouseover mouseout click',function(e){
                                e.preventDefault();
                                if($(this).is('.notd_pad,.disabled')) return;
                                if(e.type=="mouseover"){
                                        //$(this).addClass("active");
                                } else if (e.type=="mouseout"){
                                        //$(this).removeClass("active");
                                } else {
                                        $(this).siblings().removeClass("clicked");
                                        $(this).addClass("clicked");
                                }
                        });
                        $('div.openCloseSelect a').live('click',function(e) {
                                e.preventDefault();
                                $a = $(this);
                                var idx  = $a.attr('idx');
                                nTr = $a.closest('tr')[0];
                                $(nTr).addClass("clicked");
                                if ($a.hasClass('open') && nTr.haveData)
                                {
                                        $(nTr).next("tr").removeClass('notd_pad');
                                        $a.removeClass('open');
                                        $(nTr).removeClass("clicked");
                                        $(nTr).next("tr").hide();
                                }
                                else{
                                        $a.addClass('open');
                                        if(!nTr.haveData){
                                                dtd.fnOpen(nTr,showloading(),'childRow');
                                                $(nTr).next("tr").addClass('notd_pad');
                                                getDLdata(nTr,idx);
                                                nTr.haveData = true;
                                        }else
                                        $(nTr).next("tr").show();
                                        };
                                return false;
                        });
        },//end of init

        getCalendar: function(fromDate, toDate) {
                        // Local variables to hold calendar elements
                        var startDate = vmf.dom.id(fromDate);
                        var endDate = vmf.dom.id(toDate);
                        // Initialize the calendars
                        vmf.calendar.build(vmf.dom.get(".txt_datepicker"), {
                                dateFormat: 'yyyy-mm-dd',
                                startDate: '1990-01-01',
                                endDate: '2020-02-31',
                                startDate_id: vmf.dom.id(fromDate),
                                endDate_id: vmf.dom.id(toDate),
                                error_msg_f:vmf.dom.get("#dateErrorMsg").text(),
                                error_msg_t:vmf.dom.get("#dateErrorMsg").text()
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
        },

        RefreshTable : function(tableId, urlData){
                checkForEmptySearchForHistory();
                urlData = prepareAjaxUrlWithFilters(urlData);
                $.getJSON(urlData, null, function( json )
                {
                        table = $('#'+tableId).dataTable();
                        oSettings = table.fnSettings();
                        table.fnClearTable(this);
                        for (var i=0; i<json.aaData.length; i++)
                        {
                                table.oApi._fnAddData(oSettings, json.aaData[i]);
                        }
                        oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
                        table.fnDraw();
                });
        },//end of refresh table

        setDateFields: function(startDateId, endDateId, diff){
                if(diff == 0){
                        $('#txt_txDate_from,#txt_txDate_to').val('');
                        myvmware.downloadsHistory.getCalendar("txt_txDate_from","txt_txDate_to");
                        myvmware.common.putplaceHolder('.txt_datepicker');
                }else{
                        var nd = new Date();
                        var ed = new Date();
                        var df;
                        df = nd.addDays(diff).asString();
                        dt = ed.asString();
                        $(startDateId).val(df);
                        $(endDateId).val(dt);
                        vmf.calendar.setStartDate($(startDateId), df);
                        vmf.calendar.setDisplayMonth($(startDateId), nd.getMonth(), nd.getFullYear());
                        vmf.calendar.setStartDate($(endDateId), dt);
                        vmf.calendar.setDisplayMonth($(endDateId), ed.getMonth(), ed.getFullYear());
                        var inputArray=new Array(startDateId,endDateId);
                        myvmware.downloadsHistory.removePlaceHolderClass(inputArray);
                }
        },
        removePlaceHolderClass: function(inputFields){
                $.each(inputFields, function(i,v) {
                         if($(v).hasClass('hasPlaceholder')) $(v).removeClass('hasPlaceholder');
           });

        },
        postProcessingData: function(table, settings, _json){
                if(_json.error || !settings.fnRecordsTotal()){
                        error_text = downloadsHistory.globalVar.noMatchChangeFilterTryAgain;
                        table = $('#'+tableId).dataTable();
                        table.fnClearTable();
                        table.find('tbody tr').css("height","150px").addClass('noborder default')
                                 .find('td.dataTables_empty').html(error_text);
                }

        },
        adjustContentHeader: function(){  // BUG-00048299
                var container = $('#content-header-container'), contentCol = $('#content-header-container .main-container'), searchCol = $('#content-header-container .right-side-panel'), contentWid;
                if(container){
                        contentWid = container.width() - searchCol.width() - (contentCol.outerWidth(true) - contentCol.width());
                        //$('.more-details-history').css('width',contentWid-70);
                        //$('.file_details_tbl').css('width',contentWid-75);
                        contentCol.css('width',contentWid);
                }
        },
        onCategoryChange:function(){
            var sel = $("select#myProducts");
            var opt =   $(sel).find('option:selected').attr('href');
            window.location.href = opt;
        }
};//end of main

function getDLdata(nTr,idx){
        var getDlgDownloadsHistoryDetailsURL = $("#getDlgDownloadsHistoryDetailsURL").val();
        $.ajax({
                type : "POST",
                dataType : "html",
                url : getDlgDownloadsHistoryDetailsURL,
                data : {
                        dlgHistoryId : idx
                },
                async : false,
                success : function(data) {
                        try{
                                if(data!='' || data.length >= 0){
                                        $(nTr).next("tr").find("td").html(data);
                                }
                        }catch(err){

                        }
                }

        });
};
function showloading(){
        var sOut="<div style='width:100%; padding-top:15px; padding-left:43%; text-align:center;'><span class='loading_big'>" +
                downloadsHistory.globalVar.loadingLbl + "</span></div>";
        return sOut;
};

function datesValidateForHistory(){
        //$('#txt_orderDate_to').val('');
        // String format yyyy-mm-dd
        var rgx = /^[0-9]{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])/;
        var fromDate1 = $('#txt_txDate_from').val();
        var toDate1 = $('#txt_txDate_to').val();

        if(fromDate1 == "" || toDate1 == "" ) {

                if(fromDate1 == "" && toDate1 != "" ){
                        vmf.calendar.displayErrorMsg($('#txt_txDate_from'),vmf.dom.get("#dateErrorMsg").text(),f=0);
                        return false;
                }

                if(fromDate1 != "" && toDate1 == ""){
                        vmf.calendar.displayErrorMsg($('#txt_txDate_to'),vmf.dom.get("#dateErrorMsg").text(),f=0);
                        return false;
                }

                return displayErrorMessageForHistoryReleaseDates();

        } else {
                if(fromDate1.match(rgx) && toDate1.match(rgx) && fromDate1 <= toDate1) {
                        return true;
                }  else {
                        return false;
                }
        }

}

function displayErrorMessageForHistoryReleaseDates(){

        var fromDate2 = $('#txt_release_from').val();
        var toDate2 = $('#txt_release_to').val();
        if(fromDate2 == "" || toDate2 == "" ) {

                if(fromDate2 == "" && toDate2!=""){
                        vmf.calendar.displayErrorMsg($('#txt_release_from'),vmf.dom.get("#dateErrorMsg").text(),f=0);
                        return false;
                }

                if(fromDate2 != "" && toDate2 == ""){
                        vmf.calendar.displayErrorMsg($('#txt_release_to'),vmf.dom.get("#dateErrorMsg").text(),f=0);
                        return false;
                }

        }
        return true;
}

function datesValidateForHistoryReleaseDates(){
        //$('#txt_orderDate_to').val('');
        // String format yyyy-mm-dd
        var rgx = /^[0-9]{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])/;
        var fromDate2 = $('#txt_release_from').val();
        var toDate2 = $('#txt_release_to').val();
        if(fromDate2 == "" || toDate2 == "" ) {

                return displayErrorMessageForHistoryReleaseDates();

        } else {
                if(fromDate2.match(rgx) && toDate2.match(rgx) && fromDate2 <= toDate2) {
                        return true;
                } else {
                        return false;
                }
        }
}
function checkForEmptySearchForHistory(){
        if($('#txt_productfamily').val() != "" ||
           $('#txt_productName').val() != "" ||
          ($('#txt_txDate_from').val() != "" || $('#txt_txDate_to').val() != "") ||
          ($('#txt_release_from').val() != "" || $('#txt_release_to').val() != "") || $('#dlgType').val()!="all" || $('#language')!="all"){
                return false;
        } else {
                return true;
        }
}

function prepareAjaxUrlWithFilters(fetchMyDownloadsHistory){
        isFilterSearch =true;
        var completeDownloadUrl = fetchMyDownloadsHistory+
        "&productFamily="+ $('#txt_productfamily').val() +"&productName="+$('#txt_productName').val()+
        "&txDateFrom="+$('#txt_txDate_from').val()+"&txDateTo="+$('#txt_txDate_to').val()+
        "&releaseDateFrom="+$('#txt_release_from').val()+"&releaseDateTo="+$('#txt_release_to').val() +
        "&dlgType="+$('#dlgType').val()+"&language="+$('#language').val();
        return completeDownloadUrl;
}

function resetFilters(fetchMyDownloadsHistory){
        $('#txt_txDate_from').val('');
        $('#txt_txDate_to').val('');
        $('#txt_release_from').val('');
        $('#txt_release_to').val('');
        vmf.calendar.resetCalenders($('#txt_release_from'));
        vmf.calendar.resetCalenders($('#txt_release_to'));
        vmf.calendar.resetCalenders($('#txt_txDate_from'));
        vmf.calendar.resetCalenders($('#txt_txDate_to'));
        myvmware.downloadsHistory.getCalendar("txt_release_from","txt_release_to");
        myvmware.downloadsHistory.getCalendar("txt_txDate_from","txt_txDate_to");
        $('#txt_productfamily').val('');
        $('#txt_productName').val('');
        $('#dlgType').val('all');
        $('#language').val('all');
        return prepareAjaxUrlWithFilters(fetchMyDownloadsHistory);
}

// This method is invoked when user clicks on any download button
function checkEulaAndPerform(downloadGroupCode,downloadFileId,baseStr,hashKey,tagId,productId){
        checkEulaAccepted(downloadGroupCode,downloadFileId,baseStr,hashKey,tagId,productId);
        return false;
}


// This method checks if the user has accepted the EULA
function checkEulaAccepted(downloadGroupCode,downloadFileId,baseStr,hashKey,tagId,productId){
        $.ajax({
        type : "POST",
                                dataType : "html",
                                async:    false,
                                url : $("#checkEulaAcceptanceURL").val(),
                                data : {
                                        downloadGroupCode : downloadGroupCode
                                },
                                async : false,
                                success : function(data) {
                                        try {
                                                        if(data.indexOf('true')!= -1){
                                                                getDownload(downloadGroupCode,downloadFileId,baseStr,hashKey,true,tagId,productId);
                                                        }else{
                                                                fetchEulaContent(downloadGroupCode,downloadFileId,baseStr,hashKey,tagId,productId);
                                                                showEulaModal('eulaContentDisplay_'+downloadGroupCode);
                                                                handleAcceptDeclineButtons(tagId,productId);
                                                        }
                                                } catch (err) {
                                        }
                                }
        });

}

function fetchEulaContent(downloadGroupCode,downloadFileId,baseStr, hashKey,tagId,productId){
        $.ajax({
                type : "POST",
                                        dataType : "html",
                                        url : $("#acceptEulaURLForDownloadsHistoryURL").val(),
                                        data : {
                                                downloadGroupCode : downloadGroupCode,
                                                downloadFileId:downloadFileId,
                                                baseStr:baseStr,
                                                hashKey:hashKey,
                                                tagId:tagId,
                                                productId:productId
                                        },
                                        async : false,
                                        success : function(data) {
                                                try {
                                                        $("#eulaContentDisplay_"+downloadGroupCode).html(data);
                                                        riaLink('EULA');
                                                } catch (err) {
                                                }
                                        }
        });

}
function getDownload(downloadGroupCode,downloadFileId,baseStr,hashKey, isEulaAccepted,tagId,productId){
        if(downloadFileId!=''){
                hideEulaModal();
                hideEulaDeclinedSection(tagId,productId);
                updateEulaAcceptanceLink(downloadGroupCode);
                if($('#view_eula_'+downloadGroupCode)!=undefined
                                && $('#accept_eula_'+downloadGroupCode)!=undefined ){
                                $('#view_eula_'+downloadGroupCode).css("display", "inline");
                                $('#accept_eula_'+downloadGroupCode).css("display", "none");
                                }
                var url = $('#downloadFilesURL').val()+'&downloadFileId='+downloadFileId+'&vmware=downloadBinary&baseStr='+baseStr+'&hashKey='+hashKey+'&productId='+productId+'&tagId='+tagId;
                url = url + '&downloadGroupCode='+downloadGroupCode;
                startDownload(url, baseStr,tagId,productId);
        }else{
                hideEulaModal();
                updateEulaAcceptanceLink(downloadGroupCode);
                hideEulaDeclinedSection(tagId,productId);
                if($('#view_eula_'+downloadGroupCode)!=undefined
                && $('#accept_eula_'+downloadGroupCode)!=undefined ){
                $('#view_eula_'+downloadGroupCode).css("display", "inline");
                $('#accept_eula_'+downloadGroupCode).css("display", "none");
        }
        }
        return false;
}
function startDownload(url, baseStr,tagId,productId){
        $.ajax({
                                type : "POST",
                                dataType : "json",
                                async:    false,
                                url : url,
                                success : function(object) {

                try {
                                                if(object.error!='error'){
                                                        var isdlm = object.dlm;
                                                        var downloadURL = object.downloadUrl;
                                                        //debug("is DLM? :: "+isdlm);
                                                        if(isdlm == 'yes') {
                                                                //debug("DLM yes");
                                                                trackMyDownloadsHistory("DLM", object.fileType, object.fileName);
                                                                window.open(downloadURL,'Download_File','height=250,width=350,scrollbars=no,resizable=yes' );
                                                                return false;
                                                        } else {

                                                                //window.open(downloadURL, 'Download_Manually_File');
                                                                //Customer didnt like opening a pop up
                                                                window.location.href=downloadURL;
                                                                trackMyDownloadsHistory("manual", object.fileType, object.fileName);
                                                                //debug("Manual yes");
                                                                return false;
                                                        }
                                                }else{
                                                        alert(downloadsHistory.globalVar.errorOccuredWhilePR);
                                                }

                } catch (e) {
                    debug("error occured in startDownload do nothing");
                }
            }
        });
}

function showEulaModal(modalContentDivId){
        // See if border-radius is supported by the browser.
        var borderRadiusSupported = $('html').hasClass('borderradius');
        vmf.modal.show(modalContentDivId, { checkPosition: true });
        if(!borderRadiusSupported){
                $('.modalContent .button').corner();
        }
}

function hideEulaModal(){
        vmf.modal.hide();
        var borderRadiusSupported = $('html').hasClass('borderradius');
        if(!borderRadiusSupported){
                $('.modalContent .button').uncorner();
        }
}

function displayEula(downloadGroupCode,downloadFileId,baseStr,hashKey,tagId,productId){
        fetchEulaContent(downloadGroupCode,downloadFileId,baseStr,hashKey,tagId,productId);
        showEulaModal('eulaContentDisplay_'+downloadGroupCode);
        handleAcceptDeclineButtons(tagId,productId);
}

function updateEulaAcceptanceLink(downloadGroupCode){
        $.ajax({
                type : "POST",
                dataType : "json",
                url : $("#acceptEulaURL").val(),
                data : {
                        downloadGroupCode : downloadGroupCode
                },
                async : false,
                success : function(data) {
                        try {
                                //$("#eulaContentDisplay_"+downloadGroupCode).html(data);
                        } catch (err) {
                        }
                }
        });

}

function toggleShowChecksumDiv(downloadFileId){
        $('#show_'+downloadFileId).css("display", "block");
        $('#hide_'+downloadFileId).css("display", "none");
        $('#checksum_'+downloadFileId).css("display", "none");
}

function toggleHideChecksumDiv(downloadFileId){
        $('#show_'+downloadFileId).css("display", "none");
        $('#hide_'+downloadFileId).css("display", "block");
        $('#checksum_'+downloadFileId).css("display", "block");
}

function handleEulaAcceptCheckBoxEvent(tagId,productId){
        var checkboxId = $('#acceptAndDownloadCheckBox_'+tagId+'_'+productId);
        if(checkboxId.attr('checked')){
                        $('#acceptAndDownload_'+tagId+'_'+productId).attr('disabled','');
                        $('#acceptAndDownload_'+tagId+'_'+productId).removeClass('disabled');
                } else {
                        $('#acceptAndDownload_'+tagId+'_'+productId).attr('disabled', 'disabled');
                        $('#acceptAndDownload_'+tagId+'_'+productId).addClass('disabled');
                }
}

function handleAcceptDeclineButtons(tagId,productId){
        var checkboxId = $('#acceptAndDownloadCheckBox_'+tagId+'_'+productId);
        if(checkboxId!=undefined){
                checkboxId.checked = false;
                $('#acceptAndDownload_'+tagId+'_'+productId).attr('disabled', 'disabled');
                $('#acceptAndDownload_'+tagId+'_'+productId).addClass('disabled');
                checkboxId.click(function(event){
                        handleEulaAcceptCheckBoxEvent(tagId,productId);
                });
        }
}

function displayEulaDeclinedSection(tagId,productId){
        hideEulaModal();
        $("#eulaDeclinedSection_"+tagId+"_"+productId).show();
        riaLink('EULA : declined');
        window.location='#eulaDeclinedSection_'+tagId+'_'+productId;
}
function hideEulaDeclinedSection(tagId,productId){
        $("#eulaDeclinedSection_"+tagId+"_"+productId).hide();
}
/**
 * This is to track the Start download of Akamai urls.
 * We need a seperate method as to track the Type
 */
function trackMyDownloadsHistory(downloadType, fileType, fileName){
        try{
                if(fileType!=undefined && fileType!=null && fileType!=''){
                        riaTrackMyDownloadsHistoryLink(fileType+" : "+downloadType, fileName);
                }else{
                        riaTrackMyDownloadsHistoryLink(downloadType, fileName);
                }
        }catch(e){
                //do nothing.
        }
}
/*
 * This is required, for downloads to set additional variables for tracking downloads.
 *
 */
function riaTrackMyDownloadsHistoryLink(appendName, fileName){
        var account = 'vmwareglobal';
        if (s_account)	account = s_account;
        var s=s_gi(account);
        s.linkTrackVars='prop1,prop2';
        s.linkTrackEvents='None';
        s.prop1 = getProp1();
        s.prop2 = getProp2();

        s.prop10 = fileName;
        s.eVar10 = s.prop10;

        if (s.pageName){
                var ppn = s.pageName;
                s.pageName += " : "+appendName;
                void(s.t());
                s.pageName = ppn;
        };
}
;function showInNewWindows(url){
        var left = (screen.width/2)-(300);
        var top = (screen.height/2)-(300);
        window.open(url, "popup_id", "scrollbars,resizable,width=600,height=600"+',top='+top+',left='+left);
};