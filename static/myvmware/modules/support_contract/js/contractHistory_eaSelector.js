vmf.ns.use("ice");
ice.eaSelector.impl={
	beforeEaSelectorChange:function(){
		//no implementation required
	},
	afterEaSelectorChange_success:function(){
		$('.activitiesLog').addClass('bottomarea');
		$('.bottom').hide();
		vmf.datatable.reload($('#dataTableWrapper'),contHistoryUrl,ice.contracthistory.postProcessingData);
	},
	afterEaSelectorChange_error:function(){
		alert(eaSelectorDropDownErrorMsg);
	}
};
