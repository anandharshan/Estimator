if (typeof(ccp) == "undefined")  ccp = {};

ccp.rep =  { //Start of fund details   
	th:null,
    init: function() {
		th = ccp.rep;
		th.bindEvents();
		$('#activityR').click(function(e) {
			ccp.rep.downloadActivitiesReport(e);
		});		
		$('#redemptionR').click(function(e) {
			ccp.rep.downloadRedemptionReport(e);
		});
		$('#overviewR').click(function(e) {
			ccp.rep.downloadOverviewReport(e);
		});
    },//end of init
    bindEvents:function(){
		$('#vppPortalPanel ul.menu a.linkItem').click(function(){
			var idx = $(this).parent().index();
			$(this).addClass('active').parent().siblings().find('.linkItem').removeClass('active');
			$('#contentPanel').find('.tabContent:eq(' + idx + ')').show().siblings().hide();
			return false;
		})
		th.buildCalendar($('#act_fromDt'),$('#act_toDt'));
		th.buildCalendar($('#redem_fromDt'),$('#redem_toDt'));
    },
    buildCalendar:function(frDt,toDt){
	var month=new Array();
		month[0]="01", month[1]="02", month[2]="03", month[3]="04", month[4]="05", month[5]="06", month[6]="07", 
		month[7]="08", month[8]="09", month[9]="10", month[10]="11", month[11]="12";
    	var d = new Date(), curr_date = d.getDate(), curr_month = d.getMonth(), curr_year = d.getFullYear();
		frDt.val(curr_year +"/"+ month[d.getMonth()] +"/"+ curr_date);
		frDt.attr('readonly', 'readonly');
		toDt.val(curr_year +"/"+ month[d.getMonth()] +"/"+ curr_date);
		toDt.attr('readonly', 'readonly');
        // Initialize the calendars
        vmf.calendar.build(vmf.dom.get(".datepicker"), {
            dateFormat: 'yyyy/mm/dd',
            startDate: '1990/01/01',
            endDate: '2020/12/31',
			startDate_id: frDt,
			endDate_id: toDt,
			error_msg_f: ccp.globalVar.error_from,
			error_msg_t: ccp.globalVar.error_to
        });
        // Bind event handler to the startDate calendar
        vmf.dom.addHandler(frDt, "dpClosed", function(e, selectedDate){
            var d = selectedDate[0];
            if(d){d = new Date(d); vmf.calendar.setStartDate(toDt, d.addDays(0).asString()); }
        });
        // Bind event handler to the endDate calendar
        vmf.dom.addHandler(toDt, "dpClosed", function(e, selectedDate){
            var d = selectedDate[0];
            if(d){ d = new Date(d); vmf.calendar.setEndDate(frDt, d.addDays(0).asString()); }
        });
    },
	downloadRedemptionReport: function(e) {
		var from = $('#redem_fromDt').val();
		var to = $('#redem_toDt').val();
		var fromDate = new Date(from);
		var toDate = new Date(to);
		if(fromDate <= toDate){
			e.preventDefault();
			location.href=ccp.globalVar.downloadRedemptionsReportURL + "&redem_fromDt=" + from + "&redem_toDt=" + to;
		}else{
			vmf.calendar.displayErrorMsg($('#redem_toDt'), ccp.globalVar.error_to);
		}
	},
	downloadActivitiesReport: function(e) {
		var from = $('#act_fromDt').val();
		var to = $('#act_toDt').val();
		var fromDate = new Date(from);
		var toDate = new Date(to);
		if(fromDate <= toDate){
			e.preventDefault();
			location.href=ccp.globalVar.downloadActivitiesReportURL + "&act_fromDt="+ from +"&act_toDt="+ to;
		}else{
			vmf.calendar.displayErrorMsg($('#act_toDt'), ccp.globalVar.error_to);
		}
	},
	downloadOverviewReport: function(e) {
		e.preventDefault();
		location.href=ccp.globalVar.downloadOverviewReportURL;
	}
};//End of fund details 