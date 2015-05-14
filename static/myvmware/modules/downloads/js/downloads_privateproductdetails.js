$(document).ready(function(){
	if($('#startDownload').val() != undefined &&  $('#startDownload').val()=='true' 
		&& $('#canExecuteOnLoad').val() != undefined && $('#canExecuteOnLoad').val() =='true' ){
			if($('#refresh').val() != undefined && $('#refresh').val() !='true'){
			checkEulaAndPerform($('#downloadGroupCode').val(),$('#downloadFileId').val(),$('#downloadType').val(),$('#secureParam').val(),$('#tagId').val(),$('#productId').val(),$('#uuId').val());
			}
	}
});