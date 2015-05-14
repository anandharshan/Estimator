/* ########################################################################### *
/* ***** DOCUMENT INFO  ****************************************************** *
/* ########################################################################### *
 * ##### NAME:  script.js
 * ##### VERSION: v0.1
 * ##### UPDATED: 04/20/2011
/* ########################################################################### */
function loadPopup(redirectUrl){	
		$(function() {
			setTimeout(function(){
				Redirect(redirectUrl);
			},10000); 
	});
}

function Redirect(redirectUrl){
	//alert(redirectUrl);
	if(enableAutoRedirection){
	$(".button.primary").attr('disabled',true);
	location.href = redirectUrl;
	}
}
function bindClickEventForContinueButton(){
	$('#submitActivation').click(function(){
		   enableAutoRedirection=false;
		   $('#activationFormCommand').submit();
			return false; //returning false cancels the click event to happen
		});
}

var enableAutoRedirection= true;

$(document).ready(function(){ 
		var redirectUrl=document.getElementById("redirectURL").value;
		bindClickEventForContinueButton();
		
			loadPopup(redirectUrl);
	
});
