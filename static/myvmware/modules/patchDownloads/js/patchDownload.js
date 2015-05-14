if (typeof (myvmware) == "undefined") myvmware = {};
var th;

//New Variables Used 
var searchBlockShown = 0;
var cancelClickFlag = false;
var currentProdSelected, currentProdSelectedName, currentVersionSelectedName, currentreleaseDateVal;
var btn, prodVal, prodNameText, prodNameValue, verVal, verNameText, releaseDateVal, severityVal, categoryVal, classifyVal, releaseNum, buildNum, bulletinNum, dependencyVal;
var pSelected, vSelected, rdSelected, sevSelected, cSelected, classifySelected, rnSelected, bnSelected, bltnSelected, dSelected;
var filterTextFlag = false;
var checkManageColumns = false;
var loadFailedStatus = false;
var newprodSelected, newprodSelectedName;

ptd.common = {
    searchObj: null,
    resultType: null,
    depend: false,
    resultObj: null,
    dt: null,
    cRow: null,
    curHash: "search",
    hash: "",
    init: function () {
        th = ptd.common;
        th.getCal();
        th.bindCmtEvents();
        th.buildAllTbles();
        vmf.ajax.post(ptd.globalVars.searchPageUrl, null, th.buildSearch, th.loadFailed);
        th.renderEOL();
        th.getHashURL();
        th.setHashURL(th.curHash);
    },
    map: {
        "all": {
            "sections": "#pSearchMain,#resultContainer,#error_message,#3x5Text,#3xText,#patchResultSection3x,#patchResultSection4x,#patchResultSection5x,#patchResultSectionVc,#manageColumns3x,#manageColumns4x,#manageColumns5x,#manageColumnsVc,#productversionselectMsg,#productversionselectedMsg",
            "tbls": "#patchResultTbl3x,#patchResultTbl4x,#patchResultTbl5x",
            "loadFailedShow": "#productversionselectMsg,#error_message,#advancefilters,#byProdSearch",
            "loadFailedHide": "#productversionselectedMsg,#dpl_error_message,#resultContainer,#filterLink"
        },
        "3.x": {
            "section": "#pSearchMain,#resultContainer,#3x5Text,#3xText,#patchResultSection3x,#manageColumns3x,#productversionselectedMsg",
            "table": "#patchResultTbl3x",
            "manageColumn": "#manageColumns3x",
            "manageColumnMapping": ['1', '2', '3', '7', '5', '4', '6', '8'],
            "url": ptd.globalVars.searchResult3xUrl,
            "callBack": "rCB3x",
            "drawCallBack": "drawCallBackfn",
            "dtColumns": [{
                "sTitle": "<input type='checkbox' class='selectAll' id='selectAll'/>",
                "sClass": "inputTh",
                "bVisible": true,
                "bSortable": false
            }, {
                "sTitle": ptd.globalVars.releasename,
                "sClass": "rlsName",
                "bVisible": true,
                "bSortable": false
            }, {
                "sTitle": "<span class='descending'>" + ptd.globalVars.releasedate + "</span>",
                "sClass": "rlsDate",
                "bVisible": true,
                "bSortable": true
            }, {
                "sTitle": ptd.globalVars.buildnumber,
                "bVisible": true,
                "sClass": "buildNumber",
                "bSortable": false
            }, {
                "sTitle": "<span class='descending'>" + ptd.globalVars.systemimpact + "</span>",
                "sClass": "sysImpact sorting_asc",
                "bVisible": false,
                "bSortable": true
            }, {
                "sTitle": "<span class='descending'>" + ptd.globalVars.description + "</span>",
                "sClass": "descriptions sorting_asc",
                "bVisible": false,
                "bSortable": true
            }, {
                "sTitle": ptd.globalVars.checksums,
                "sClass": "chkSums",
                "bVisible": false,
                "bSortable": false
            }, {
                "sTitle": ptd.globalVars.supercedesrequires,
                "sClass": "supRequires",
                "bVisible": true,
                "bSortable": false
            }, {
                "sTitle": "<span class='descending'>" + ptd.globalVars.classify + "</span>",
                "sClass": "classifications sorting_asc",
                "bVisible": false,
                "bSortable": true
            }, {
                "sTitle": "",
                "sClass": "downloads",
                "bVisible": true,
                "bSortable": false
            }],
            "sorting": [
                [2, "desc"]
            ]
        },
        "4.x": {
            "section": "#pSearchMain,#resultContainer,#patchResultSection4x,#manageColumns4x,#productversionselectedMsg",
            "table": "#patchResultTbl4x",
            "manageColumn": "#manageColumns4x",
            "manageColumnMapping": ['1', '2', '3', '7', '4', '5', '6', '8'],
            "url": ptd.globalVars.searchResultUrl,
            "callBack": "rCB4x",
            "drawCallBack": "drawCallBackfn",
            "dtColumns": [{
                "sTitle": "<input type='checkbox' class='selectAll' id='selectAll'/>",
                "sClass": "inputTh",
                "bVisible": true,
                "bSortable": false
            }, {
                "sTitle": ptd.globalVars.releasename,
                "sClass": "rlsName",
                "bVisible": true,
                "bSortable": false
            }, {
                "sTitle": "<span class='descending'>" + ptd.globalVars.releasedate + "</span>",
                "sClass": "rlsDate",
                "bVisible": true,
                "sType": "date",
                "bSortable": true
            }, {
                "sTitle": ptd.globalVars.buildnumber,
                "sClass": "buildNumber",
                "bVisible": true,
                "bSortable": false
            }, {
                "sTitle": ptd.globalVars.systemimpact,
                "sClass": "sysImpact",
                "bVisible": false,
                "bSortable": true
            }, {
                "sTitle": ptd.globalVars.checksums,
                "sClass": "chkSums",
                "bVisible": false,
                "bSortable": false
            }, {
                "sTitle": ptd.globalVars.description,
                "sClass": "descriptions",
                "bVisible": false,
                "bSortable": false
            }, {
                "sTitle": ptd.globalVars.bulletinnumber,
                "sClass": "bulletinNumber",
                "bVisible": true,
                "bSortable": false
            }, {
                "sTitle": ptd.globalVars.classify,
                "sClass": "classifications",
                "bVisible": false,
                "bSortable": false
            }, {
                "sTitle": "",
                "sClass": "downloads",
                "bVisible": true,
                "bSortable": false
            }],
            "sorting": [
                [2, "desc"]
            ]
        },
        "5.x": {
            "section": "#pSearchMain,#resultContainer,#patchResultSection5x,#manageColumns5x,#productversionselectedMsg",
            "table": "#patchResultTbl5x",
            "manageColumn": "#manageColumns5x",
            "manageColumnMapping": ['1', '2', '3', '7', '4', '5', '6', '8', '9'],
            "url": ptd.globalVars.searchResultUrl,
            "callBack": "rCB5x",
            "drawCallBack": "drawCallBackfn",
            "dtColumns": [{
                "sTitle": "<input type='checkbox' class='selectAll' id='selectAll'/>",
                "sClass": "inputTh",
                "bVisible": true,
                "bSortable": false
            }, {
                "sTitle": ptd.globalVars.releasename,
                "sClass": "rlsName",
                "bVisible": true,
                "bSortable": false
            }, {
                "sTitle": "<span class='descending'>" + ptd.globalVars.releasedate + "</span>",
                "sClass": "rlsDate",
                "bVisible": true,
                "sType": "date",
                "bSortable": true
            }, {
                "sTitle": ptd.globalVars.buildnumber,
                "sClass": "buildNumber",
                "bVisible": true,
                "bSortable": false
            }, {
                "sTitle": ptd.globalVars.systemimpact,
                "sClass": "sysImpact",
                "bVisible": false,
                "bSortable": true
            }, {
                "sTitle": ptd.globalVars.checksums,
                "sClass": "chkSums",
                "bVisible": false,
                "bSortable": false
            }, {
                "sTitle": ptd.globalVars.description,
                "sClass": "descriptions",
                "bVisible": false,
                "bSortable": false
            }, {
                "sTitle": ptd.globalVars.bulletinnumber,
                "sClass": "bulletinNumber",
                "bVisible": true,
                "bSortable": false
            }, {
                "sTitle": ptd.globalVars.category,
                "sClass": "category",
                "bVisible": false,
                "bSortable": false
            }, {
                "sTitle": ptd.globalVars.severity,
                "sClass": "severity",
                "bVisible": false,
                "bSortable": false
            }, {
                "sTitle": "",
                "sClass": "downloads",
                "bVisible": true,
                "bSortable": false
            }],
            "sorting": [
                [2, "desc"]
            ]
        },
        "VCP": {
            "section": "#pSearchMain,#resultContainer,#patchResultSectionVc,#manageColumnsVc,#productversionselectedMsg",
            "table": "#patchResultTblVc",
            "manageColumn": "#manageColumnsVc",
            "manageColumnMapping": ['0', '1', '2', '3', '4', '7', '5', '6'],
            "url": ptd.globalVars.searchResultVcUrl,
            "callBack": "rCBvcp",
            "drawCallBack": "drawCallBackfn",
            "dtColumns": [{
                "sTitle": ptd.globalVars.releasename,
                "sClass": "rlsName",
                "bVisible": true,
                "bSortable": false
            }, {
                "sTitle": "<span class='descending'>" + ptd.globalVars.releasedate + "</span>",
                "sClass": "rlsDate",
                "sType": "date",
                "bVisible": true,
                "bSortable": true
            }, {
                "sTitle": "<input type='checkbox' class='selectAll' id='selectAll'/>" + ptd.globalVars.files,
                "sClass": "files",
                "bVisible": true,
                "bSortable": false
            }, {
                "sTitle": ptd.globalVars.description,
                "sClass": "descriptions",
                "bVisible": true,
                "bSortable": false
            }, {
                "sTitle": ptd.globalVars.systemimpact,
                "sClass": "sysImpact",
                "bVisible": false,
                "bSortable": false
            }, {
                "sTitle": ptd.globalVars.category,
                "sClass": "category",
                "bVisible": false,
                "bSortable": false
            }, {
                "sTitle": ptd.globalVars.severity,
                "sClass": "severity",
                "bVisible": false,
                "bSortable": false
            }, {
                "sTitle": ptd.globalVars.checksums,
                "sClass": "chkSums",
                "bVisible": false,
                "bSortable": false
            }, {
                "sTitle": "",
                "sClass": "downloads",
                "bVisible": true,
                "bSortable": false
            }],
            "sorting": [
                [1, "desc"]
            ]
        },
        "dtNoResult": {
            "sEmptyTable": '<div id="loadingerrormsg"><div class="error_innermsg"><p>' + ptd.globalVars.noresult + '</p></div></div>',
            "sProcessing": ptd.globalVars.loadingLabel,
            "sLoadingRecords": ""
        }
    },
    getHashURL: function () {
        th.hash = decodeURIComponent(window.location.hash.substring(1));
    },
    setHashURL: function (hrshURL) {
        th.curHash = hrshURL;
        window.location.hash = hrshURL;
    },
    bindCmtEvents: function () {
        $('#clearfilters').click(function(){
             th.resetfilters();
             $('#releaseDate').removeClass('enabledText').addClass('disabledText');
        });
        $('#releaseDate').change(function () {
            th.getCal();
        });
        $('#freeLink').click(function () {
            var baseURL = "//";
            baseURL += window.location.host.replace("my", "www");
            baseURL += ptd.globalVars.freelinkUrl;
            $(this).attr('href', baseURL);
        });
        $('.downloadLnk').live('click', function () {
            var downloadUrl = $(this).attr('name');
            window.open(downloadUrl);
        });
        $('.endOfLifeProducts').hoverIntent(function () {
            var w = $(this).find('.downarrow').width();
            var l = parseInt(w - 287) + "px";
            $('#eol_dropdown').css("left", l)
            $(this).find('.downarrow').addClass('opened');
            $(this).find('.downarrow').closest('li').find('.eol_dropdown').show().addClass('hovered');
        }, function () {
            var cc = $(this);
            setTimeout(function () {
                if (cc.find('.eol_dropdown').hasClass('hovered')) {
                    $('.endOfLifeProducts').find('.downarrow').removeClass('opened');
                    cc.find('.eol_dropdown').hide().removeClass('hovered');
                }
            }, 500);
        });

        $('.endOfLifeProducts').parent('li').css({
            'float': 'left',
            'width': '180px'
        });

        $('th.sorting_desc').live('click',function(){
            $('.dataTables_processing').css('visibility','hidden'); 
            
        });
        $('th.sorting_asc').live('click',function(){
            $('.dataTables_processing').css('visibility','hidden');
            
        });
        
        $('.buttonsContainer').hoverIntent(function () {
            //var w = $(this).find('.downarrow').width();
            //var l = parseInt(w - 167) + "px"; // commenting the line to fix for #BUG-00080897
            $(this).find('.downarrow').addClass('opened');
            $('#manageColumnsDiv').show().addClass('hovered');
        }, function () {
            var cc = $(this);
            setTimeout(function () {
                if (cc.find('#manageColumnsDiv').hasClass('hovered')) {
                    $('.buttonsContainer').find('.downarrow').removeClass('opened');
                    cc.find('#manageColumnsDiv').hide().removeClass('hovered');
                }
            }, 500);

        });


        $('#pSearchMain button.searchBtn').click(function () {  
            searchBlockShown = searchBlockShown + 1;
            btn = $("button.searchBtn");

            prodVal = $("#pSearchMain").find("select.prodName").val()
            prodNameText = $("#pSearchMain").find("select.prodName option:selected").text();
            prodNameValue = $("#pSearchMain").find("select.prodName option:selected").attr('value');
            currentProdSelected = prodNameText;
            currentProdSelectedName = prodNameValue;

            verVal = $("#pSearchMain").find("select#versionName1 option:selected").val();
            verNameText = $("#pSearchMain").find("select#versionName1 option:selected").text();
            currentVersionSelectedName = verVal;

            releaseDateVal = $('#releaseDate').val();
            severityVal = $('select#severity option:selected').val();
            severityVal = (severityVal === ptd.globalVars.allseverities)? 'All Severities' : severityVal;            
            categoryVal = $('select#category option:selected').val();
            categoryVal = (categoryVal === ptd.globalVars.allcategories)? 'All Categories' : categoryVal;
            classifyVal = $('select#classify option:selected').val();
            classifyVal = (classifyVal === ptd.globalVars.allclassifications)? 'All Classifications' : classifyVal;
            releaseNum = $('#releaseNumber').val();
            releaseNum = (releaseNum === ptd.globalVars.enterreleasenumber)? $('#releaseNumber').attr('val_en') : releaseNum;
            buildNum = $('#buildNumber').val();
            buildNum = (buildNum === ptd.globalVars.enterbuildnumber)? $('#buildNumber').attr('val_en') : buildNum;
            bulletinNum = $('#bulletinNumber').val();
            bulletinNum = (bulletinNum === ptd.globalVars.enterbulletin)? $('#bulletinNumber').attr('val_en') : bulletinNum;
            dependencyVal = $('#checkDependency').is(':checked') ? true : false;

            var postData = {
                "product": prodVal,
                "productName": prodNameText,
                "version": verVal,
                "versionName": verNameText,
                "resultType": th.resultType,
                "releasedate": releaseDateVal,
                "severity": severityVal,
                "category": categoryVal,
                "classify": classifyVal,
                "releasenumber": releaseNum,
                "buildnumber": buildNum,
                "bulletinnumber": bulletinNum,
                "dependency": dependencyVal
            };
			/*BUG-00065684 - updated the condition to work in other locales*/
            if (classifyVal !== 'All Classifications' || severityVal !== 'All Severities' || categoryVal !== 'All Categories' || releaseNum !== $('#releaseNumber').attr('val_en') || buildNum !== $('#buildNumber').attr('val_en') || bulletinNum !== $('#bulletinNumber').attr('val_en') || dependencyVal !== true || releaseDateVal !== ptd.globalVars.dateformat) {
                $('#filterLink').html(ptd.globalVars.editfilterText);
            } else {
                $('#filterLink').html(ptd.globalVars.addfilterText);
            }

            $.extend(postData);
            th.depend = $('#checkDependency').is(':checked');

            var fn = th[th.map[th.resultType].method],
                section = th.map[th.resultType].section,
                tbl = th.map[th.resultType].table,
                url = th.map[th.resultType].url;
            $(th.map.all.sections).hide();

            $('#advancefilters').css('position', 'absolute').css('top', '-20000px');
            $('#byProdSearch').hide();
            $('#filterLink').show();

            $(section).show();
            (th.resultType == '3.x' && postData.versionName == '3.5') ? $('#3xText').hide() : $('#3x5Text').hide();
            $('input.selectAll').attr('checked', false);
            
            if (currentProdSelectedName !== pSelected || currentVersionSelectedName !== vSelected || classifyVal !== classifySelected || severityVal !== sevSelected || categoryVal !== cSelected || releaseNum !== rnSelected || buildNum !== bnSelected || bulletinNum !== bltnSelected || dependencyVal !== dSelected || releaseDateVal !== rdSelected ) {               
                vmf.datatable.reload($(tbl), url, th.postDatatable, "POST", postData, th.loadFailed);               
            }
            else{
                if(loadFailedStatus==true){
                    vmf.datatable.reload($(tbl), url, th.postDatatable, "POST", postData, th.loadFailed);   
                }
                else{
                    th.showdplErrorMsg();
                }
            }
            
        });
        $('#selectOkBtn').click(function () {
            th.selectAllDepends(th.cRow);
            vmf.modal.hide();
        });
        $('#backToSearchBtn').click(function () {
            $('#resultContainer').hide();
            $('#pSearchMain').show();
            return false;
        });
        $('.fn_cancel', $('#simplemodal-container')).live('click', function () {
            vmf.modal.hide()
        });
        $('#filterLink').click(function () {
            searchBlockShown = 0;
            $('#productversionselectMsg').show();
            $(th.map.all.loadFailedHide).hide();
            $('#advancefilters').css('position', 'relative').css('top', '0px');
            $('#byProdSearch').toggle('fast');
            th.setPostVariables();
        });
        $('#confirmProductSelChange').click(function () {
            $('#filterLink').trigger('click');
            vmf.modal.hide('productSelChangeWarning');
            vmf.dropdown.updateOption($("select#productName"), newprodSelectedName);
            th.loadVersion();
        });
        $('#cancelProductSelChange').live('click', function () {
            vmf.dropdown.updateOption($("select#productName"), currentProdSelectedName);
            vmf.modal.hide('productSelChangeWarning');
        });
        $('.inputsDiv input#releaseDate').live({
            keydown:function(){
                $(this).removeClass('disabledText').addClass('enabledText');
            }
        });
        $('.inputsDiv input.resetField').live({
            focus: function () {
                $(this).removeClass('disabledText').addClass('enabledText');
                var defaultTxt;
                var inputId = $(this).attr("id");
                if (inputId == 'releaseNumber') {
                    defaultTxt = ptd.globalVars.enterreleasenumber
                } else if (inputId == 'buildNumber') {
                    defaultTxt = ptd.globalVars.enterbuildnumber
                } else if (inputId == 'bulletinNumber') {
                    defaultTxt = ptd.globalVars.enterbulletin
                };
                var currentTxt = $(this).val();
                if (currentTxt === defaultTxt) {
                    $(this).attr('value', '');
                } else {
                    $(this).attr('value', currentTxt).removeClass('disabledText').addClass('enabledText');
                }
            },
            blur: function () {
                $(this).removeClass('disabledText').addClass('enabledText');
                var defaultTxt;
                var inputId = $(this).attr("id");
                if (inputId == 'releaseNumber') {
                    defaultTxt = ptd.globalVars.enterreleasenumber
                } else if (inputId == 'buildNumber') {
                    defaultTxt = ptd.globalVars.enterbuildnumber
                } else if (inputId == 'bulletinNumber') {
                    defaultTxt = ptd.globalVars.enterbulletin
                };
                var currentTxt = $(this).val();
                if (currentTxt === '') {
                    $(this).attr('value', defaultTxt).addClass('disabledText').removeClass('enabledText');
                }

            }
        });
        $(window).hashchange(function () {
            th.getHashURL();
            th.curHash = (th.hash == "") ? th.curHash : th.hash;
            if (th.curHash == 'search') $('#backToSearchBtn').trigger('click');
        });
    },
    selectAllDepends: function (row) {
        var depends = row.data('patchName'),
            tbl = row.closest('tbody');
        var pData = {
            'patchname': depends
        };
        vmf.ajax.post(ptd.globalVars.dependentsUrl, pData, function (data) {
            var jRes = (typeof data != "object") ? vmf.json.txtToObj(data) : data;
            $.each(jRes.depends, function (i, k) {
                $('.prodCheck#' + k + ':checkbox:not(:disabled)').attr('checked', true);
            });
            th.dt.find('input.selectAll').attr('checked', (tbl.find('input:checked:not(:disabled)').length == tbl.find('input:checkbox:not(:disabled)').length));
        }, th.loadFailed);
    },
    validate: function (btn) {
        (btn.attr('id') != 'byProdSearch' && !$.trim($('#patchname').val()).length) ? $('#errInst').html('Enter ' + $('#releaseNameSelect option:selected').text()).show() : $('#errInst').hide();
        return (btn.attr('id') == 'byProdSearch' || (btn.attr('id') != 'byProdSearch' && $.trim($('#patchname').val()).length));
    },
    buildAllTbles: function () {
        var tblArr = [th.map["3.x"], th.map["4.x"], th.map["5.x"], th.map["VCP"]];
        $.each(tblArr, function (i, k) {
            vmf.datatable.build($(k.table), {
                "aoColumns": k.dtColumns,
                "oLanguage": th.map.dtNoResult,
                "aaSorting": k.sorting,
                "bInfo": false,
                "bStateSave": true,
                "bProcessing": true,
                "bServerSide": false,
                "bAutoWidth": false,
                "bFilter": false,
                "bPaginate": false,
                "fnRowCallback": th[k.callBack],
                "fnDrawCallback": th[k.drawCallBack]
            });
        })
    },
    rCB3x: function (nRow, aData, idx) {
        var $nRow = $(nRow);

        var splitData1 = th.splitRowData(aData[1]);
        var ptName = new Array();
        ptName = splitData1[0].split(' ');

        var trimPtName = $.trim(ptName[0]);
        $nRow.data({
            'patchName': trimPtName
        });


        if (aData[0] == 'true') {
            $nRow.find('td.inputTh').html('<div class="paddingClass"><a name="' + trimPtName + '"></a><p><input id="' + ptName[0] + '" class="prodCheck" type="checkbox" name="' + aData[9] + '"/></p></div>');
        } else {
            $nRow.find('td.inputTh').html('<div class="paddingClass"><a name="' + ptName[0] + '"></a><p><input id="' + ptName[0] + '"  class="prodCheck" type="checkbox" disabled="disabled" name="' + aData[9] + '" /></p></div>');
        }


        $nRow.find('td.rlsName').html('<div class="paddingClass"><p><span class="key">' + splitData1[0] + '</span></p><p><span class="key">' + ptd.globalVars.producthdr + '</span>' + splitData1[1] + '</p><p><span class="key">' + ptd.globalVars.downloadsizehdr + '</span>' + splitData1[2] + '</p></div>');

        $nRow.find('td.rlsDate').html('<div class="paddingClass"><p>' + aData[2] + '</p></div>');

        var splitData2 = th.splitColumnsData(aData[3]);
        var buildData1 = new Array();
        $(splitData2).each(function (i, k) {
            var t = th.splitRowData(k);
            buildData1[i] = '<p>' + t[0] + '<br/>' + t[1] + '<br/><a href=' + t[3] + ' target="_blank">' + t[2] + '</a></p>';
        });
        $nRow.find('td.buildNumber').html('<div class="paddingClass">'+buildData1.join('')+'</div>');
        $nRow.find('td.sysImpact').html('<div class="paddingClass"><p>' + aData[4] + '</p></div>');
        $nRow.find('td.descriptions').html('<div class="paddingClass"><p>' + aData[5] + '</p></div>');
        $nRow.find('td.chkSums').html('<div class="paddingClass"><p><span class="key">' + ptd.globalVars.md5sum + '</span>' + aData[6] + '</p></div>');

        var splitData3 = th.splitColumnsData(aData[7]);
        var t = th.splitRowData(splitData3[0]);

        var buildData2 = new Array();
        if (t == 0) {
            buildData2[0] = '<p>None</p>';
        } else {
            $(t).each(function (i, k) {
                buildData2[i] = '<p>' + t[i] + '</p>';
            });
        }
        var p = th.splitRowData(splitData3[1]);
        var buildData3 = new Array();
        if (p == 0) {
            buildData3[0] = '<p>None</p>';
        } else {
            $(p).each(function (i, k) {
                var q = th.splitRequiresData(k);
                buildData3[i] = '<p><a href="#' + $.trim(q[0]) + '" >' + q[0] + '</a></p>';
            });
        }
        $nRow.find('td.supRequires').html(('<div class="paddingClass">'+buildData2.join('')).concat(buildData3.join(''))+'</div>');
        $nRow.find('td.classifications').html('<div class="paddingClass"><p>' + aData[8] + '</p></div>');

        if (aData[0] == 'true') {
            $nRow.find('td.downloads').html('<div class="paddingClass"><p><button name="' + aData[9] + '" class="downloadLnk">' + ptd.globalVars.download + '</button></p></div>');
        } else {
            $nRow.find('td.downloads').html('<div class="paddingClass"><p><button name="' + aData[9] + '" class="downloadLnk disabled" disabled="disabled">' + ptd.globalVars.download + '</button></p></div>');
        }
        return nRow;

    },
    rCB4x: function (nRow, aData, idx) {
        var $nRow = $(nRow);


        if (aData[0] == 'true') {
            $nRow.find('td:eq(0)').html('<div class="paddingClass"><p><input id="prodChk' + idx + '" class="prodCheck" type="checkbox" name="' + aData[9] + '"  /></p></div>');
        } else {
            $nRow.find('td.inputTh').html('<div class="paddingClass"><p><input id="prodChk' + idx + '" class="prodCheck" type="checkbox" disabled="disabled" name="' + aData[9] + '"  /></p></div>');
        }

        var splitData1 = th.splitRowData(aData[1]);
        $nRow.find('td.rlsName').html('<div class="paddingClass"><p><span class="key">' + splitData1[0] + '</span></p><p><span class="key">' + ptd.globalVars.producthdr + '</span>' + splitData1[1] + '</p><p><span class="key">' + ptd.globalVars.downloadsizehdr + '</span>' + splitData1[2] + '</p></div>');
        $nRow.find('td.rlsDate').html('<div class="paddingClass"><p>' + aData[2] + '</p></div>');

        var splitData2 = th.splitColumnsData(aData[3]);
        var buildData1 = new Array();
        $(splitData2).each(function (i, k) {
            var t = th.splitRowData(k);
            buildData1[i] = '<p>' + t[0] + '<br/><a href=' + t[2] + ' target="_blank">' + t[1] + '</a></p>';
        });
        $nRow.find('td.buildNumber').html('<div class="paddingClass">'+buildData1.join('')+'</div>');
        $nRow.find('td.sysImpact').html('<div class="paddingClass"><p>' + aData[4] + '</p></div>');

        var splitData3 = th.splitRowData(aData[5]);
        $nRow.find('td.chkSums').html('<div class="paddingClass"><p><span class="key">' + ptd.globalVars.md5sum + '</span>' + splitData3[0] + '</p><p><span class="key">' + ptd.globalVars.shalsum + '</span>' + splitData3[1] + '</p></div>');

        var splitData4 = th.splitColumnsData(aData[6]);
        var buildData2 = new Array();
        $(splitData4).each(function (i, k) {
            var t = th.splitRowData(k);
            buildData2[i] = '<p><span class="paddingClass">' + t[1] + '<br/><a href="#" class="detailLink" title="' + t[0] + '">' + ptd.globalVars.details + '</a></span></p>';
        });
        $nRow.find('td.descriptions').addClass('subTblTd').html(buildData2.join(''));

        var splitData5 = th.splitColumnsData(aData[7]);
        var buildData3 = new Array();
        $(splitData5).each(function (i, k) {
            var t = th.splitRowData(k);
            buildData3[i] = '<p><span class="paddingClass">' + t[0] + '<br/><a href="' + t[2] + '" title="" target="_blank">' + t[1] + '</a></span></p>';
        });
        $nRow.find('td.bulletinNumber').addClass('subTblTd').html(buildData3.join(''));

        var splitData6 = th.splitColumnsData(aData[8]);
        var buildData4 = new Array();
        $(splitData6).each(function (i, k) {
            var t = th.splitRowData(k);
            buildData4[i] = '<p><span class="paddingClass">' + t[0] + '</span></p>';
        });
        $nRow.find('td.classifications').addClass('subTblTd').html(buildData4.join(''));
        if (aData[0] == 'true') {
            $nRow.find('td.downloads').html('<div class="paddingClass"><p><button name="' + aData[9] + '" class="downloadLnk">' + ptd.globalVars.download + '</button></p></div>');
        } else {
            $nRow.find('td.downloads').html('<div class="paddingClass"><p><button name="' + aData[9] + '" class="downloadLnk disabled" disabled="disabled">' + ptd.globalVars.download + '</button></p></div>');
        }
        return nRow;
    },
    rCB5x: function (nRow, aData, idx) {
        var $nRow = $(nRow);

        if (aData[0] == 'true') {
            $nRow.find('td:eq(0)').html('<div class="paddingClass"><p><input id="prodChk' + idx + '" class="prodCheck" type="checkbox" name="' + aData[10] + '"  /></p></div>');
        } else {
            $nRow.find('td.inputTh').html('<div class="paddingClass"><p><input id="prodChk' + idx + '" class="prodCheck" type="checkbox" disabled="disabled" name="' + aData[10] + '" /></p></div>');
        }

        var splitData1 = th.splitRowData(aData[1]);
        $nRow.find('td.rlsName').html('<div class="paddingClass"><p><span class="key">' + splitData1[0] + '</span></p><p><span class="key">' + ptd.globalVars.producthdr + '</span>' + splitData1[1] + '</p><p><span class="key">' + ptd.globalVars.downloadsizehdr + '</span>' + splitData1[2] + '</p></div>');
        $nRow.find('td.rlsDate').html('<div class="paddingClass"><p>' + aData[2] + '</p></div>');

        var splitData2 = th.splitColumnsData(aData[3]);
        var buildData1 = new Array();
        $(splitData2).each(function (i, k) {
            var t = th.splitRowData(k);
            buildData1[i] = '<p>' + t[0] + '<br/><a href=' + t[2] + ' target="_blank">' + t[1] + '</a></p>';
        });
        $nRow.find('td.buildNumber').html('<div class="paddingClass">'+buildData1.join('')+'</div>');
        $nRow.find('td.sysImpact').html('<div class="paddingClass"><p>' + aData[4] + '</p></div>');

        var splitData3 = th.splitRowData(aData[5]);
        $nRow.find('td.chkSums').html('<div class="paddingClass"><p><span class="key">' + ptd.globalVars.md5sum + '</span>' + splitData3[0] + '</p><p><span class="key">' + ptd.globalVars.shalsum + '</span>' + splitData3[1] + '</p></div>');

        var splitData4 = th.splitColumnsData(aData[6]);
        var buildData2 = new Array();
        $(splitData4).each(function (i, k) {
            var t = th.splitRowData(k);
            buildData2[i] = '<p><span class="paddingClass">' + t[1] + '<br/><a href="#" class="detailLink" title="' + t[0] + '">' + ptd.globalVars.details + '</a></span></p>';
        });
        $nRow.find('td.descriptions').addClass('subTblTd').html(buildData2.join(''));

        var splitData5 = th.splitColumnsData(aData[7]);
        var buildData3 = new Array();
        $(splitData5).each(function (i, k) {
            var t = th.splitRowData(k);
            buildData3[i] = '<p><span class="paddingClass">' + t[0] + '<br/><a href="' + t[2] + '" title="" target="_blank">' + t[1] + '</a></span></p>';
        });
        $nRow.find('td.bulletinNumber').addClass('subTblTd').html(buildData3.join(''));

        var splitData6 = th.splitColumnsData(aData[8]);
        var buildData4 = new Array();
        $(splitData6).each(function (i, k) {
            var t = th.splitRowData(k);
            buildData4[i] = '<p><span class="paddingClass">' + t[0] + '</span></p>';
        });
        $nRow.find('td.category').addClass('subTblTd').html(buildData4.join(''));

        var splitData7 = th.splitColumnsData(aData[9]);
        var buildData5 = new Array();
        $(splitData7).each(function (i, k) {
            var t = th.splitRowData(k);
            buildData5[i] = '<p><span class="paddingClass">' + t[0] + '</span></p>';
        });
        $nRow.find('td.severity').addClass('subTblTd').html(buildData5.join(''));

        if (aData[0] == 'true') {
            $nRow.find('td.downloads').html('<div class="paddingClass"><p><button name="' + aData[10] + '" class="downloadLnk">' + ptd.globalVars.download + '</button></p></div>');
        } else {
            $nRow.find('td.downloads').html('<div class="paddingClass"><p><button name="' + aData[10] + '" class="downloadLnk disabled" disabled="disabled">' + ptd.globalVars.download + '</button></p></div>');
        }
        return nRow;
    },
    rCBvcp: function (nRow, aData, idx) {
        var $nRow = $(nRow);
        var checkBoxArray = new Array();

        var splitData = th.splitRowData(aData[0]);


        $nRow.find('td.rlsName').html('<div class="paddingClass"><p><span class="key">' + splitData[0] + '</span></p><p><span class="key">' + ptd.globalVars.producthdr + '</span>' + splitData[1] + '</p><p><span class="key">' + ptd.globalVars.versionhdr + '</span>' + splitData[2] + '</p></div>');

        $nRow.find('td.rlsDate').html('<div class="paddingClass"><p>' + aData[1] + '</p></div>');

        var splitData1 = th.splitColumnsData(aData[2]);
        var splitData8 = th.splitColumnsData(aData[8]);

        var buildData1 = new Array();
        $(splitData1).each(function (i, k) {
            var t = th.splitRowData(k);
            checkBoxArray[i] = t[0];
            if(t[0]=='true'){
                buildData1[i] = '<p><span class="paddingClass"><input id="pro' + i + '" class="prodCheck" type="checkbox" name="' + splitData8[i] + '"/><span class="key"><label>' + t[1] + '</label></span><br/><br/><span class="key">' + ptd.globalVars.downloadsizehdr + '</span>' + t[2] + '</span></p>';
            }
            else{
                buildData1[i] = '<p><span class="paddingClass"><input id="pro' + i + '" class="prodCheck" disabled="disabled" type="checkbox" name="' + splitData8[i] + '"/><span class="key"><label>' + t[1] + '</label></span><br/><br/><span class="key">' + ptd.globalVars.downloadsizehdr + '</span>' + t[2] + '</span></p>';
            }
        });
        $nRow.find('td.files').addClass('subTblTd').html(buildData1.join(''));

        var splitData2 = th.splitColumnsData(aData[3]);
        var buildData2 = new Array();
        $(splitData2).each(function (i, k) {
            var t = th.splitRowData(k);
            buildData2[i] = '<p><span class="paddingClass">' + t[0] + '<br/><a href="' + t[2] + '" target="_bkank">' + t[1] + '</a></span></p>';
        });
        $nRow.find('td.descriptions').addClass('subTblTd').html(buildData2.join(''));

        var splitData3 = th.splitColumnsData(aData[4]);
        var buildData3 = new Array();
        $(splitData3).each(function (i, k) {
            buildData3[i] = '<p><span class="paddingClass">' + k + '</span></p>';
        });
        $nRow.find('td.sysImpact').addClass('subTblTd').html(buildData3.join(''));

        var splitData5 = th.splitColumnsData(aData[5]);
        var buildData5 = new Array();
        $(splitData5).each(function (i, k) {
            buildData5[i] = '<p><span class="paddingClass">' + k + '</span></p>';
        });
        $nRow.find('td.category').addClass('subTblTd').html(buildData5.join(''));

        var splitData6 = th.splitColumnsData(aData[6]);
        var buildData6 = new Array();
        $(splitData6).each(function (i, k) {
            buildData6[i] = '<p><span class="paddingClass">' + k + '</span></p>';
        });
        $nRow.find('td.severity').addClass('subTblTd').html(buildData6.join(''));

        var splitData7 = th.splitColumnsData(aData[7]);
        var buildData7 = new Array();
        $(splitData7).each(function (i, k) {
            var t = th.splitRowData(k);
            buildData7[i] = '<p ><span class="paddingClass"><span class="key">' + ptd.globalVars.md5sum + '</span>' + t[0] + '<br/><br/><span class="key">' + ptd.globalVars.shalsum + '</span>' + t[1] + '</span></p>';
        });
        $nRow.find('td.chkSums').addClass('subTblTd').html(buildData7.join(''));


        var buildData8 = new Array();

        $(splitData8).each(function (i, k) {

            if (checkBoxArray[i] == 'true') {
                buildData8[i] = '<p><span class="paddingClass"><button name="' + k + '" class="downloadLnk">' + ptd.globalVars.download + '</button></span></p>';
            } else {
                buildData8[i] = '<p><span class="paddingClass"><button name="' + k + '" disabled="disabled" class="downloadLnk disabled">' + ptd.globalVars.download + '</button></span></p>';
            }
        });

        $nRow.find('td.downloads').addClass('subTblTd').html(buildData8.join(''));

        return nRow;
    },
    drawCallBackfn: function (oSettings) {
        var checkedFlag = false;
        dt = $(this);
        var t = $(this).find('input#selectAll').attr('checked');
        if (t == true) {
            $(this).find('input.prodCheck:not(:disabled)').attr('checked', 'checked');
        } else {
            if ($(this).find('tr.isChecked').length > 0) {
                $(this).find('tr.isChecked').each(function (i, k) {
                    $(k).find('input.prodCheck:not(:disabled)').attr('checked', 'checked');
                });
            } else {
                $(this).find('tbody tr').removeClass('isChecked');
            }

        }

        th.showDepenedentPopup(dt);
        th.columnHeightAdjust(this);
    },
    getCal: function () {
        myvmware.common.putplaceHolder($('#releaseDate'));
        vmf.calendar.build(vmf.dom.get("#releaseDate"), { // Initialize the calendars
            dateFormat: 'yyyy-mm-dd', //should be in small case
            startDate: '1900-01-01',
            endDate: '2020-12-31'
        });
        $('#releaseDate').removeClass('disabledText').addClass('enabledText');
    },
    buildSearch: function (data) {
        var jRes = (typeof data != "object") ? vmf.json.txtToObj(data) : data;
        th.searchObj = jRes;
        var $prod = $('#pSearchMain').find('select.prodName');
        $('#patchname').val('').parent().find('.errInst').hide();
        th.appendOptions(jRes.searchPageObj.prodList, $prod, 'prodName');
        th.appendOptions(jRes.searchPageObj.classifications, $('#classify'), 'classify');
        th.appendOptions(jRes.searchPageObj.categories, $('#category'), 'category');
        th.appendOptions(jRes.searchPageObj.severities, $('#severity'), 'severity');

        if (vmf.dropdown && $("select#productName").length && $("select#productName").find("option").length > 0) {
            vmf.dropdown.build($("select#productName"), {
                optionsDisplayNum: 10,
                ellipsisSelectText: false,
                ellipsisText: '',
                optionMaxLength: 70,
                inputMaxLength: 40,
                position: "right",
                onSelect: th.loadVersion,
                optionsId: "eaDropDownOpts_productName",
                inputWrapperClass: "eaInputWrapper",
                spanpadding: true,
                spanClass: "corner-img-left",
                optionsClass: "dropdownOpts",
                shadowClass: "eaBoxShadow"
            });
        }
        var selects = ['versionName1', 'classify', 'category', 'severity']
        if (vmf.dropdown && $("select#productName").length && $("select#productName").find("option").length > 0) {
            $.each(selects, function (i, k) {
                vmf.dropdown.build($("select#" + k), {
                    optionsDisplayNum: 10,
                    ellipsisSelectText: false,
                    ellipsisText: '',
                    optionMaxLength: 70,
                    inputMaxLength: 40,
                    position: "right",
                    onSelect: th.updateFilter(this),
                    optionsId: "eaDropDownOpts_" + k,
                    inputWrapperClass: "eaInputWrapper",
                    spanpadding: true,
                    spanClass: "corner-img-left",
                    optionsClass: "dropdownOpts",
                    shadowClass: "eaBoxShadow"
                });
            });
        }
        
        ptd.common.updateDDWidthVN1();

        $('#eaSelectorWidgetDiv1').fadeTo('fast', 0.4).children().unbind('click');
        th.showVersionOptions();

    },
    updateDDWidthVN1:function(){
    	//Added min-width because in localization, text is truncating( #BUG-00065313)
        $('#eaSelectorWidgetDiv1 div.eaInputWrapper input.optionsHolder').css("min-width","94px");
        $('#eaSelectorWidgetDiv1 div.eaInputWrapper').css("min-width","104px");
    },
    postDatatable: function (dt) {
    
        th.showdplErrorMsg();
        
        th.dt = dt;
        (dt.find('input.prodCheck:not(:disabled)').length) ? dt.find('.selectAll').attr('checked', false).attr('disabled', false) : dt.find('.selectAll').attr('checked', false).attr('disabled', true);
        (dt.find('input:checked:not(:disabled)').length) ? $('#downloadBtn,#downloadBtn2').attr('disabled', false).removeClass('disabled') : $('#downloadBtn,#downloadBtn2').attr('disabled', true).addClass('disabled');
        var settings = dt.dataTable().fnSettings();
        if (settings.jqXHR && settings.jqXHR.responseText !== null && settings.jqXHR.responseText.length && typeof settings.jqXHR.responseText == "string") {
            th.resultObj = vmf.getObjByIdx(vmf.json.txtToObj(settings.jqXHR.responseText), 0);
        };
        if (!th.resultObj.aaData.length) {
            searchBlockShown = 0;
            loadFailedStatus = true;
            $(th.map.all.loadFailedShow).show();
            $(th.map.all.loadFailedHide).hide();
            $('#advancefilters').css('position', 'relative').css('top', '0px');
            th.setPostVariables();
        } else {
            if (prodNameValue !== pSelected || verVal !== vSelected) {
                var colLen = dt.fnSettings().aoColumns;
                $.each(colLen, function (i) {
                    dt.fnSetColumnVis(i, true);
                });
                var sel;
                if (th.resultType == '3.x') {
                    sel = '3x'
                };
                if (th.resultType == '4.x') {
                    sel = '4x'
                };
                if (th.resultType == '5.x') {
                    sel = '5x'
                };
                if (th.resultType == 'VCP') {
                    sel = 'Vc'
                };
                $.each(th.searchObj.searchPageObj.managedColumns, function () {
                    manageColData = th.loadManageColumns(this.value, this.name);
                    if (this.name == th.resultType) {
                        $('#manageColumns' + sel).html(manageColData);
                        if (th.resultType == 'VCP') {
                            $('#manageColumnsVc').find('#chk_2').attr('disabled', 'disabled');
                        }
                    }
                });
                th.checkManageColumns(dt, sel);
            } else {
                th.checkManageColumns(dt, sel);
            }
            if (!dt.find('tbody input:checkbox:not(:disabled)').length)
                dt.find('.selectAll').attr('checked', false).attr('disabled', true);
            else
                dt.find('input.selectAll').attr('checked', (dt.find('input.prodCheck:checked:not(:disabled)').length == dt.find('input.prodCheck:checkbox:not(:disabled)').length));

        };

        dt.find('.detailLink').live('click', function () {
            th.showDetailModal($(this));
            return false;
        });
        dt.find('input.selectAll').click(function () {
            var tbl = $(this).closest('table');
            if ($(this).is(':checked')) {
                th.dt.find('tbody tr').addClass('isChecked');
                th.dt.find('tbody input:checkbox:not(:disabled)').attr('checked', true).end().closest('.patchSearchPage').find('.downloadBtn').removeAttr('disabled').removeClass('disabled');
            } else {
                th.dt.find('tbody tr').removeClass('isChecked');
                tbl.find('tbody input:checkbox:not(:disabled)').attr('checked', false).end().closest('.patchSearchPage').find('.downloadBtn').attr('disabled', true).addClass('disabled');
            }
        });

        if (ptd.globalVars.isdplEnabled == 'n') {
            th.dt.find('.downloadLnk').addClass('disabled').attr('disabled', 'disabled');
            th.dt.find('.prodCheck').attr('disabled', 'disabled');
            th.dt.find('.selectAll').attr('disabled', 'disabled');          
        }

        th.showDepenedentPopup(dt);
        th.columnHeightAdjust(dt);
        $(window).bind('resize', function () {
            dt.fnAdjustColumnSizing();
            th.columnHeightAdjust(dt);
        });
    },
    loadFailed: function (data) {
        searchBlockShown = 0;
        loadFailedStatus = true;
        $(th.map.all.loadFailedShow).show();
        $(th.map.all.loadFailedHide).hide();
        $('#advancefilters').css('position', 'relative').css('top', '0px');
        th.setPostVariables();
    },
    renderEOL: function () {
        vmf.ajax.post(ptd.globalVars.eolURL, '', function (resp) {
            var list = vmf.json.txtToObj(resp).productCategoryList[0].proList;
            var txt = "";
            $.each(list, function (i, item) {
                txt += "<li class='eolList'><a href='" + item.actions[0].target + "'>" + item.name + "</a></li>"
            })
            $('#eol_dropdown').html(txt);
        }, function () {});
    },
    appendOptions: function (arr, obj, id) {
        var sHtml = '';
        if (id == 'prodName') {
            sHtml += '<option value="99999" id="selectProduct">' + ptd.globalVars.selectproduct + '</option>';
        }
        $.each(arr, function (i, k) {
            sHtml += '<option value="' + k.value + '">' + k.name + '</option>';
        });
        obj.empty().html(sHtml).trigger('change');
    },
    showDetailModal: function (link) {
        vmf.modal.show('detailModal',{
						onShow: function(){					
							$('.simplemodal-container').css({'background':'#fff','padding':'20px'});
						}
		});
        $('#modalMsg').html($(link).attr('title'));
    },

    loadVersion: function (value, text, selectIndex) {
        th.resetfilters();

        idx = $('#productName option:selected').index();
        if (idx == 0) {
            $('#patchDescription').html('');
            $('#eaSelectorWidgetDiv1').find('div.eaInputWrapper').remove();
            $("select#versionName1, #eaDropDownOpts_versionName1").empty();
            $("select#versionName1").append('<option value="">'+ptd.globalVars.selectversion+'</option>');
            if (vmf.dropdown && $("select#versionName1").length && $("select#versionName1").find("option").length > 0) {
                vmf.dropdown.build($("select#versionName1"), {
                    optionsDisplayNum: 10,
                    ellipsisSelectText: false,
                    ellipsisText: '',
                    optionMaxLength: 70,
                    inputMaxLength: 40,
                    position: "right",
                    onSelect: th.showVersionOptions,
                    optionsId: "eaDropDownOpts_versionName1",
                    inputWrapperClass: "eaInputWrapper",
                    spanpadding: true,
                    spanClass: "corner-img-left",
                    optionsClass: "dropdownOpts",
                    shadowClass: "eaBoxShadow"
                });
            }
            ptd.common.updateDDWidthVN1();
            
            $('#eaSelectorWidgetDiv1').fadeTo('fast', 0.4).children().unbind('click');
            $('#advancefilters').css('position', 'absolute').css('top', '-20000px');
            $('#byProdSearch').addClass("disabled").attr('disabled', 'disabled');
            $('#error_message').hide();
            if (searchBlockShown > 0) {
                $('#productversionselectMsg').show();
                $('#productversionselectedMsg').hide();
                $('#filterLink').hide();
                $('#resultContainer').hide();
                $('#byProdSearch').show();
                searchBlockShown = 0;
            }

        } else {

            idx = idx * 1;
            idx = idx - 1;
            arr = th.searchObj.searchPageObj.prodList[idx].versions;
            th.appendOptions(arr, $(this).closest('.patchSearch').find('select.versionSelect'));

            if (searchBlockShown > 0) {
                newprodSelected = $('#productName option:selected').text();
                newprodSelectedName = $('#productName option:selected').val();
                if (newprodSelected === currentProdSelected) {
                    $('#advancefilters').css('position', 'absolute').css('top', '-20000px');
                } else {
                    vmf.modal.show('productSelChangeWarning', {
                        maxWidth: 500,
						onShow: function(){					
							$('.simplemodal-container').css({'background':'#fff','padding':'20px'});
						},					
                       	onClose: function () {
                            vmf.dropdown.updateOption($("select#productName"), currentProdSelectedName);
                            vmf.modal.hide('productSelChangeWarning');
                        }
                    });
                }
            } else {
                $('#eaSelectorWidgetDiv1').find('div.eaInputWrapper').remove();
                $('#eaDropDownOpts_versionName1').remove();
                if (vmf.dropdown && $("select#versionName1").length && $("select#versionName1").find("option").length > 0) {
                    vmf.dropdown.build($("select#versionName1"), {
                        optionsDisplayNum: 10,
                        ellipsisSelectText: false,
                        ellipsisText: '',
                        optionMaxLength: 70,
                        inputMaxLength: 40,
                        position: "right",
                        onSelect: th.showVersionOptions,
                        optionsId: "eaDropDownOpts_versionName1",
                        inputWrapperClass: "eaInputWrapper",
                        spanpadding: true,
                        spanClass: "corner-img-left",
                        optionsClass: "dropdownOpts",
                        shadowClass: "eaBoxShadow"
                    });
                }
                
                ptd.common.updateDDWidthVN1();

                $('#eaSelectorWidgetDiv1').fadeTo('fast', 1).children().bind('click');
                $('#byProdSearch').removeClass("disabled").attr('disabled', '');

                if ($('#productName option:selected').text() == 'ESX') {
                    $('#patchDescription').html(ptd.globalVars.patchdescriptionesx)
                } else if ($('#productName option:selected').text() == 'ESXi (Embedded and Installable)') {
                    $('#patchDescription').html(ptd.globalVars.patchdescriptionesxi)
                } else if ($('#productName option:selected').text() == 'VEM') {
                    $('#patchDescription').html(ptd.globalVars.patchdescriptionvem)
                } else {
                    $('#patchDescription').html('');
                }
                $('#productversionselectMsg').show();
                $('#productversionselectedMsg').hide();
                $('#advancefilters').css('position', 'relative').css('top', '0px');
                th.showVersionOptions();
            }

        }
    },
    showVersionOptions: function () {
        $('#error_message').hide();
        pIdx = $("#eaSelectorWidgetDiv0 select option:selected").index();
        $(".advanceSearchFilters").show();
        if (pIdx !== 0) {
            pIdx = pIdx * 1;
            pIdx = pIdx - 1;
            tOpts = $(this).find('option'),
            tIdx = $('#versionName1 option:selected').index();
            th.resetfilters();

            arr = th.searchObj.searchPageObj.prodList[pIdx].versions[tIdx];
            th.resultType = th.searchObj.searchPageObj.prodList[pIdx].versions[tIdx].resultType;
            if (arr.searchProductFlag) {
                $('#categorySelectWidget').show();
                $('#severitySelectWidget').show();
                $('#classifySelectWidget').hide();
            } else {
                $('#categorySelectWidget').hide();
                $('#severitySelectWidget').hide();
                $('#classifySelectWidget').show();
            }

        }
        if (th.resultType == '3.x' || th.resultType == 'VCP') {
            $('#bulletinNumber').hide();
        } else {
            $('#bulletinNumber').show();
        }
        if (th.resultType == '4.x' || th.resultType == '5.x' || th.resultType == 'VCP') {
            $('.checkDependent').hide();
        } else {
            $('.checkDependent').show();
        }
        if (searchBlockShown > 0) {
            $('#pSearchMain button.searchBtn').trigger('click');
        }
    },
    updateFilter: function () {

    },
    columnHeightAdjust: function (dt) { 
        
       $.each(dt.find('tbody tr'), function (i, k) {
            var lengthVal = $(this).find('td.subTblTd:eq(0)').find('p').length;         
            $(this).find('td.subTblTd').css('height', $(k).find('td.rlsName').outerHeight() + 'px');
            var heightVal = parseInt(100) / parseInt(lengthVal);
            $(this).find('td.subTblTd').find('p').css('height', heightVal + '%');
        });
    },
    splitRowData: function (arr) {
        var element = arr.split("!^");
        return element;
    },
    splitColumnsData: function (arr) {
        var element = arr.split("!~");
        return element;
    },
    splitRequiresData: function (arr) {
        var element = arr.split("!*");
        return element;
    },
    showDepenedentPopup: function (dt) {
        dt.find('input.prodCheck').click(function () {
            if ($(this).is(':checked')) {
                $(this).closest('tr').addClass('isChecked');
            } else {
                $(this).closest('tr').removeClass('isChecked');
            }
            var chCount = dt.find('input.prodCheck:not(:disabled)').not('input.selectAll'),
                checks = dt.find('input.prodCheck:checked:not(:disabled)');
            if (checks.length) $('#downloadBtn,#downloadBtn2').attr('disabled', false).removeClass('disabled');
            else $('#downloadBtn,#downloadBtn2').attr('disabled', true).addClass('disabled');
            $('input.selectAll').attr('checked', (checks.length == chCount.length));
            if ($(this).is(':checked') && th.resultType == '3.x' && th.depend) {
                th.cRow = $(this).closest('tr');
                vmf.modal.show('promptModal',{
					onShow: function(){					
							$('.simplemodal-container').css({'background':'#fff','padding':'20px'});
					}				
				});
            }
        });
    },
    resetfilters: function () {
        var defaults = [ptd.globalVars.dateformat, ptd.globalVars.enterreleasenumber, ptd.globalVars.enterbuildnumber, ptd.globalVars.enterbulletin];
        var inputElems = $('.inputsDiv input');
        $.each(inputElems, function (i, k) {
            $(this).attr('value', defaults[i]).addClass('disabledText').removeClass('enabledText');
        });
        vmf.dropdown.updateOption($("select#classify"), ptd.globalVars.allclassifications);
        vmf.dropdown.updateOption($("select#category"), ptd.globalVars.allcategories);
        vmf.dropdown.updateOption($("select#severity"), ptd.globalVars.allseverities);
    },
    loadManageColumns: function (arrObj, resType) {
        var inputData;
        var ulData = "<ul>";
        $.each(arrObj, function (i) {
            if (i == 0) {
                inputData = '<li><input class="checkCategory" id="chk_' + i + '" type="checkbox" value="" name="' + resType + '"  checked="checked" disabled="disabled"/><label for="chk_' + i + '">' + arrObj[i] + '</label></li>';
            } else if ((i !== 0) && (i < 4)) {
                inputData = '<li><input class="checkCategory" id="chk_' + i + '" checked="checked"  type="checkbox" value="" name="' + resType + '" /><label for="chk_' + i + '">' + arrObj[i] + '</label></li>';
            } else {
                inputData = '<li><input class="checkCategory" id="chk_' + i + '" type="checkbox" value="" name="' + resType + '" /><label for="chk_' + i + '">' + arrObj[i] + '</label></li>';
            }
            ulData += inputData;
        });
        ulData += "</ul>";

        return ulData;
    },
    checkManageColumns: function (dt, sel) {
        var checkBox = $('#manageColumns' + sel).find('input:checkbox');
        $(checkBox).each(function (i) {
            $(this).bind('change', function () {
                dt.find('td.subTblTd').height('auto');
                var iCol = th.map[th.resultType].manageColumnMapping[i];
                var bVis = dt.fnSettings().aoColumns[iCol].bVisible;
                dt.fnSetColumnVis(iCol, bVis ? false : true, false);
                th.columnHeightAdjust(dt);
            });
            if ($(this).is(':checked')) {

            } else {
                dt.find('td.subTblTd').height('auto');
                var iCol = th.map[th.resultType].manageColumnMapping[i];
                var bVis = dt.fnSettings().aoColumns[iCol].bVisible;
                dt.fnSetColumnVis(iCol, bVis ? false : true, false);
            }

        });
    },
    setPostVariables: function () {
        pSelected = currentProdSelectedName;
        vSelected = currentVersionSelectedName;
        rdSelected = releaseDateVal;
        sevSelected = severityVal;
        cSelected = categoryVal;
        classifySelected = classifyVal;
        rnSelected = releaseNum;
        bnSelected = buildNum;
        bltnSelected = bulletinNum;
        dSelected = dependencyVal;
        checkManageColumns = true;
    },
    showdplErrorMsg: function(){
        if (ptd.globalVars.isdplEnabled == 'n') {
            $('#dpl_error_message').html(ptd.globalVars.dplErrorMessage).show();
        }       
    }

}