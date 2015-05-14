if (typeof(epp) == "undefined") epp = {};
epp.navigation =  {
    init: function() {
        //vmf.scEvent = true;
		$("#launchnow").click(function(e){
			$("#vppPortalForm").attr("action", vppConfigurator);	
			$('#vppPortalForm').submit(); 	
		});
		
		$("#vppcustomersearch").click(function(e){				
			$("#vppPortalForm").attr("action", vppCustomerSearch);		
			$('#vppPortalForm').submit(); 
			if(typeof riaLinkmy != "undefined") riaLinkmy('epp_partner central home : vpp customer search');	
		});
		
		$("#vppcontacts").click(function(e){		
			$("#vppPortalForm").attr("action", vppContacts);			
			$('#vppPortalForm').submit(); 
			if(typeof riaLinkmy != "undefined") riaLinkmy('epp_partner central home : contacts');
		});
        
        $("#vppNumCustomerSearch").click(function(e){		
			$("#vppPortalForm").attr("action", vppCustomerDetails+'&vppNumber='+$('#vppNumCustomerSearch').text());
			$('#vppPortalForm').submit();
		});
        //Omniture page event
       // callBack.addsc({'f':'riaLinkmy','args':['epp_partner central home']});
	}//,end of init
}