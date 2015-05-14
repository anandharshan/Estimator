if (typeof(myvmware) == "undefined")  myvmware = {};
myvmware.mySupportReq = {

	init : function() {
	
		myvmware.mySupportReq.getMySupportReqData();
	}, 
	getMySupportReqData : function () {	
	
			$.ajax({
			type : "GET",
			dataType : "html",
			url : $("#mySupportRequestAjaxURL").val(),
			data : {				
			},

			success : function(object) {
				// show the dynamic content.
				$("#mySuppRequestsTableBody").html(object);				
			},

			error: function(jqXHR, textStatus, errorThrown) {
				// show no support error message.
				var errorMsg = $("#suppErrorMsg").val();
				$("#mySuppRequestsTableBody").html("<tr><td colspan=3 style='color:#D9541E' align='center'>" + errorMsg + "</td></tr>");
			}
		});
	}
}// end of myActiveEvals