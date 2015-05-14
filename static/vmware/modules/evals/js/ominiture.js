function sendToOminature(pageName, omnitureEvent){
//	vmf.scEvent = false;
//	callBack.addsc({'f':'trackPageVisit','args':[pageName, omnitureEvent]}); 
	trackPageVisit(pageName, omnitureEvent);
		
}  

function trackPageVisit(pageName,data){
		
        var hostUrl = new URLobj.init();
        s.pageName = hostUrl.ccode+" : "+hostUrl.subdomain+" : "+pageName+" : "+data;
        /************* DO NOT ALTER ANYTHING BELOW THIS LINE ! **************/
        s.hier1 = "";
        if (s.prop1) s.channel = s.prop1;
        setProps1t5();
        var s_code=s.t();
        if(s_code)document.write(s_code);

}

function stopPageLoadOmnitureEvent() {
	vmf.scEvent = true;
}
 

function initializeOnLoadOmniture(){
	vmf.scEvent = true;
	
	
//	var formLogin = $('#altEvalLoginId');
//	var formReg = $('#evalRegisterTabId'); 
//	
//	if(formReg != undefined || customerNumber != formLogin ){
//		var omnitureData = $('#prgShortName').val()+" : guest";
//		sendToOminature('evals', omnitureData)
//	}
	
	handleProfileEvents();
}

function handleProfileEvents(){
	var profileOmnitureData = $("#omtrkd").val();
	if(profileOmnitureData != undefined && profileOmnitureData!=''){
		var datas = profileOmnitureData.split("-"); 
		
		for(var i=0;i<datas.length;i++){ 
			var pageName = 'group : evals';
			var omnitureData=$("#prgOmnDispName").val()+' : '+datas[i]; 
			omnitureData = omnitureData.replace(/\_/g, ' : ');
			sendToOminature(pageName,omnitureData);
		}
		 
	}
	
}