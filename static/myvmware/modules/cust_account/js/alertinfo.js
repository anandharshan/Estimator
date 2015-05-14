vmf.ns.use("ice");

ice.alertinfo={
    init: function() {
        $.invalidAJAX = 'The AJAX response is invalid';
        $.loadingmsg = 'Alert Content is loading..';
        $.arrowdown = '/static/myvmware/common/img/anchor_blue.png';
        $.arrowup = '/static/myvmware/common/css/img/arrow_up_blue.png';
        $.alertNRow = 3;
        $.alertNCol = 3;
        $.alertInfo = null;
        $.alertMaxNRows = 10;
    
        ice.alertinfo.config();
        ice.alertinfo.getAlertInfo();
		/*CR 15768 Tooltips Changes*/
		myvmware.common.showMessageComponent('HOME');
		myvmware.common.setOverlayPosition();
		if($('.overlayCont').length){
			 ice.alertinfo.setHomeOverlayPos();
			 var doit;
			$(window).resize(function(){
			  clearTimeout(doit);
			  doit = setTimeout(function(){
				if($('.modalOverlay').length){
					myvmware.common.setOverlayPosition();
					ice.alertinfo.setHomeOverlayPos();
				}
			  }, 100);
			});
		}
		if(typeof showBeak!="undefined" && showBeak == "true"){
			myvmware.common.setBeakPosition({
				beakId:myvmware.common.beaksObj["SDP_BEAK_SUBSCRIPTION_HOME_MEGAMENU"],
				beakName:"SDP_BEAK_SUBSCRIPTION_HOME_MEGAMENU",
				beakHeading:head_subscription,
				beakContent:desc_subscription,
				target:$("#header_nav_id>ul>li:eq(1)"),
				beakLink:'#beak1',
				beakUrl:'//download3.vmware.com/microsite/myvmware/sdpcust2/index.html',
				center:true,
				isVFlip:true,
			});
		}
		/*End of CR 15768 Tooltips Changes*/
    },
    config: function() {
    },
    loadingInfo: function(message,element,flag) {
        if(flag == true) {
            element.find('tbody').remove();
            element.append('<tbody><tr><td colspan=\"3\" align=\"center\" class=\"textBlue\"><div class=\"loading\"><span class=\"loading_big\">'+accountinfo.globalVar.loading+'</span></div></td></tr></tbody>');
        }
        else {
            element.find('tbody').remove();
        }
    },
    toggleError: function(message,element,flag) {
        //Element must be a jQuery selected  table node
        //flag determines to show message or not
        if(flag == true) {
            element.find('tbody').remove();
            element.append('<tbody><tr><td colspan=\"3\" align=\"center\" class=\"grey_text\">' + message + '</td></tr></tbody>');
        }
        else {
            element.find('tbody').remove();
        }
    },
    getAlertInfo: function() {
        $.ajax({
            type: 'POST',
            //url: "/sample/alertinfo2.json",
            url: $.alertInfoURL,
            dataType: 'json',
            success: function(alertInfo) {
                $.alertInfo = alertInfo;
                ice.alertinfo.loadingInfo(null,$("#alertInfoTable"),false);
                var _validate = new Object();
                ice.alertinfo.valAndManipAlertInfo(alertInfo, _validate);
                if(_validate.result) {
                    ice.alertinfo.populateAlertInfoUI(alertInfo);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                ice.alertinfo.loadingInfo(null,$("#alertInfoTable"),false);
                if(textStatus == "parsererror") {
                    //TODO SHOW validation failed message in modal
                    ice.alertInfo.logError($.invalidAJAX);                
                }
            },
            beforeSend: function() {
                ice.alertinfo.loadingInfo($.loadingmsg,$("#alertInfoTable"),true);
            },
            complete: function() {
                //Do Nothing
            }
        });
    },
    valAndManipAlertInfo: function(alertInfo,validate) {
        if(alertInfo == undefined) {
            ice.alertinfo.toggleError($.generror,$('#alertInfoTable'),true);
            ice.alertinfo.logError($.invalidAJAX);
            validate.result = false;
        }
        else if(alertInfo.alertList.length == 0) {
            ice.alertinfo.toggleError($.noalerts,$('#alertInfoTable'),true);
            validate.result = false;
			$("#alertInfoToggle").parent().addClass('hidden');
        }
        else {
            //Manipulate data to render
            var alertString = '';
            for(var i=0;i<alertInfo.alertList.length;i++) {
                if(alertInfo.alertList[i][4]!= "null" && alertInfo.alertList[i][4].length > 0) { //If ea number is present then append it to first column
                    alertInfo.alertList[i][0] = alertInfo.alertList[i][4] + '<br>' + alertInfo.alertList[i][0];
                    //Set accAlert to true
                    alertString = "?" + $.staticEANum + "=" + alertInfo.alertList[i][4] 
                        + "&" + $.staticAlertType + "=" + $.alertTypeAcc;
                }
                else {
				    alertInfo.alertList[i][0] = $.alertTypeGen;
                    alertString = "?" + $.staticAlertType + "=" + $.alertTypeGen;
                }
                //Add Category
                if(alertInfo.alertList[i][5].length > 0) {
                    alertString += "&" + $.staticCategory + "=" + alertInfo.alertList[i][5];
                }
                //Add AlertID
                if(alertInfo.alertList[i][6].length > 0) { //If AlertId is present
                    alertString += "&" + $.staticAlertId + "=" + encodeURIComponent(alertInfo.alertList[i][6]);
                }
                //Add hyperlink
                alertInfo.alertList[i][2] = '<a href=\"' + $.alertPageURL + alertString + '\">' + alertInfo.alertList[i][2] + '</a>';
                if(alertInfo.alertList[i][3].length != 0) { //If date is present append it to third column
                    alertInfo.alertList[i][2] = alertInfo.alertList[i][2] + ' (' + alertInfo.alertList[i][3] + ')';
                }
            }
            validate.result = true;
        }
    },
    populateAlertInfoUI: function(alertInfo) {
        var _alertTable = $("#alertInfoTable");
        var _alertTableBody = $('<tbody></tbody>');
        var _alertLoopCount = 0;
        if($.alertNRow < alertInfo.alertList.length) {
            _alertLoopCount = $.alertNRow;
        }
        else {
            _alertLoopCount = alertInfo.alertList.length;
            //Hide the Show all link
            $("#alertInfoToggle").parent().addClass('hidden');
        }
        for(var i=0;i<_alertLoopCount;i++) {
            var _alertTr = $('<tr></tr>');
            if(i%2 == 0) { //even
                _alertTr.addClass('even');
            }
            else {
                _alertTr.addClass('odd');
            }
            for(var j=0;j<$.alertNCol;j++) {
                _alertTr.append('<td>' + alertInfo.alertList[i][j] + '</td>');
            }
            _alertTableBody.append(_alertTr);
        }
        ice.alertinfo.toggleError(null,_alertTable,false); //Cleanup table
        _alertTable.append(_alertTableBody); //Display table
        if(parseInt(alertInfo.totalUnread) > 0)  {
            $("#alertInfo h1").append('<span class=\"alert-number\">' + alertInfo.totalUnread + '</span>');
        }
        ice.alertinfo.attachAlertInfoEvents();
    },
    attachAlertInfoEvents: function() {
        $("#alertInfoToggle").addClass('expandable');
        $("#alertInfoToggle").click(function() {
            var _alertTable = $("#alertInfoTable");
            var _alertTableBody = $('tbody', _alertTable);
            if($(this).hasClass('expandable')) {
                if(!($(this).hasClass('hasdata'))) {
                    for(var i=$.alertNRow;i<$.alertInfo.alertList.length;i++) {
                        var _alertTr = $('<tr></tr>');
                        if(i%2 == 0) { //even
                            _alertTr.addClass('even');
                        }
                        else {
                            _alertTr.addClass('odd');
                        }
                        for(var j=0;j<$.alertNCol;j++) {
                            _alertTr.append('<td>' + $.alertInfo.alertList[i][j] + '</td>');
                        }
                        _alertTableBody.append(_alertTr);
                        /*if(i+1 == $.alertMaxNRows) {    //Code to limit number of rows displayed
                            _alertTableBody.css({
                                "max-height": _alertTableBody.height(),
                                "overflow": "auto"
                                });
                        }*/
                    }
                }
                else {
                    _hideRows = _alertTableBody.find('tr').slice($.alertNRow,$.alertInfo.alertList.length);
                    _hideRows.removeClass('hidden');
                }
                $(this).removeClass('expandable')
                    .addClass('collapsible hasdata close').text($.alerthideaccounts);
            }
            else {
                _hideRows = _alertTableBody.find('tr').slice($.alertNRow,$.alertInfo.alertList.length);
                _hideRows.addClass('hidden');
                $(this).removeClass('collapsible')
                    .addClass('expandable').removeClass('close').text($.alertshowaccounts);
            }
            return false;
        });
		
    },
    logError: function(error) {
        try {
            console.error(error);
        }
        catch(e) {
            //Do nothing
        }
    },
	setHomeOverlayPos: function(){
		$('.getReports').css({
			'top':$('#header_nav_id ul li:eq(1)').offset().top -$('#content-container').offset().top + $('#header_nav_id ul li:eq(1)').height() + 'px',
			'left':$('#header_nav_id ul li:eq(1)').offset().left + $('#header_nav_id ul li:eq(1)').width()/2 + 'px'
		});
		$('.ribbon').css({
			'top':$('#content-wrapper h1:first').offset().top - $('#content-container').offset().top - $('#content-wrapper h1:first').height()/2 + 3 + 'px',
			'left':$('#content-container-wrapper').outerWidth(true) - $('.ribbon').outerWidth(true) + 'px'
		});
		$('.expands	').css({
			'top':$('#content-wrapper').offset().top - $('#content-container').offset().top + 'px',
			'left':$('#content-container-wrapper').width() - $('#content-container').width() + 'px'
		});
	}
}