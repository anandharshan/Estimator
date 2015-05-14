/**
 * THis script will be used by user_registration_tell_about_yourself.jsp
 */

function initTellYourself(){
	var ftype_ = $("#ftype").val();
	if(stdSmartFormUsrReg == ftype_){
		populateLessValuedProspectUserType();
		var fieldMap= {"department":"#sel_department"};
		loadDropdowns(fieldMap,"#personalDataUrl");
	}
	if( evalProductForm == ftype_ ){
		populateLessValuedProspectUserType();
		var fieldMap= {"salutation":"#sel_title","department":"#sel_department"};
		loadDropdowns(fieldMap,"#personalDataUrl");
	}
	
	$("#sel_department").change(populateJobRoles);
	
}

function populateJobRoles(){
	$("#sel_jobRole").attr("disabled", false);
	var field = {"jobrole":"#sel_jobRole"};
	var deptID = $("#sel_department").val();
	var url = $("#jobRoleDataUrl").val();
	var preSelectedVal = $("#sel_jobRole").val();
	clearOptions("#sel_jobRole");
	if(deptID ==""){
	$("#sel_jobRole").attr("disabled", true);
	$("#sel_jobRole").removeClass("error");
	return false;
	}
	populateDefaultOption(field,loadingDataForDropDown); 
	
	$.ajax({
			  url: url,
			  dataType: 'text json',
			  data : {"departmentID":deptID},
			  success: function(data) {
				  populateValues(data, field);
				  if(preSelectedVal != undefined && preSelectedVal!=''){
					  $("#sel_jobRole").val(preSelectedVal);
					  onJobRoleChange(); //BUG-00013822
					  
					  if(preSelectedVal != undefined && preSelectedVal!='' ){		
							var customerNumber = $("input[name='user.customerNumber']").val();
							if(customerNumber != undefined && customerNumber!='' && customerNumber!=0){ 
								removeErrorClass($("#sel_jobRole").parent());			
							}		
						}
				  }
				  	 
			  }
			}); 
	
}
