/* ########################################################################### *
/* ***** DOCUMENT INFO  ****************************************************** *
/* ########################################################################### *
 * ##### NAME:  tellCompany.js
 * ##### VERSION: v0.1
 * ##### UPDATED: 05/26/2011
/* ########################################################################### */

/**
 * This javascript file will have functions for dealing with user_registration_tell_about_company.jsp
 */

function initTellCompany(){			
//	$("#country").change( onCountrySelect );
	
	var ftype_ = $("#ftype").val();
	if(stdSmartFormUsrReg == ftype_){
		var fieldMap= {"industries":"#sel_industry"};
		//alert("initializing dropdowns as the page loading is done !!");
		loadDropdowns(fieldMap,"#getAllStaticDataUrl");
	}
	if( evalProductForm == ftype_ ){
		var fieldMap= {"industries":"#sel_industry","globalEmployees":"#sel_employees_globally","nationalEmployees":"#sel_employees_country"};
		loadDropdowns(fieldMap,"#getAllStaticDataUrl");
	}
	
	
//	var fieldMap= {"industries":"#sel_industry","globalEmployees":"#sel_employees_globally","nationalEmployees":"#sel_employees_country"};
//	//alert("initializing dropdowns as the page loading is done !!");
//	loadDropdowns(fieldMap,"#getAllStaticDataUrl");
	
}
