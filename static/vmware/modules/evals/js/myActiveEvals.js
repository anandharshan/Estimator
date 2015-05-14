if (typeof(vmware) == "undefined")  vmware = {};
vmware.myActiveEvals = {

	init : function() {
	
		vmware.myActiveEvals.getMyActiveEvalsData();
		myvmware.hoverContent.bindEvents($('button.myEvalTip'), 'epfunc');
	}, 
	getMyActiveEvalsData : function () {	
	
			$.ajax({
			type : "GET",
			dataType : "html",
			url : $("#myActiveEvalsAjaxURL").val(),
			data : {				
			},

			success : function(object) {
				// show the dynamic content.
				$("#myActiveEvalsTableBody").html(object);
				var errorMsg = $("#noEvalsMsg").val();
				if(object != "" && !(object.indexOf(errorMsg) != -1)) {
					$("#viewAllEvals").show();
				}
			},

			error: function(jqXHR, textStatus, errorThrown) {
				// show no evaluations message.
				var errorMsg = $("#evalsErrorMsg").val();
				$("#myActiveEvalsTableBody").html("<tr><td colspan=5 style='color:#D9541E' align='center'>" + errorMsg + "</td></tr>");
			}
		});
	}
}// end of myActiveEvals