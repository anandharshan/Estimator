/* ########################################################################### *
/* ***** DOCUMENT INFO  ****************************************************** *
/* ########################################################################### *
 * ##### NAME:  resetPwdConfirmation.js
 * ##### VERSION: v0.1
 * ##### UPDATED: 12/19/2011
/* ########################################################################### */

/*
 * This function is used to make an Ajax call to resend email
 * to the user again.
 * 
 * @author Kanhaiya Saxena
 */
if (typeof(myvmware) == "undefined")  
	myvmware = {};


myvmware.resetEmail = {
	init: function(){
		delcookies();
		/*BUG-00057095*/
		$('#userverifyPwd').val('').live('blur', function(){
			$('.incorrectpassmsg').html('');
		});
	}
};

function delcookies()
{
    var new_date = new Date();
    new_date = new_date.toGMTString();
    var thecookie = document.cookie.split(";");
    
    for (var i = 0;i < thecookie.length;i++) 
    {
    	var name = thecookie[i];
    	
		var eqPos = name.indexOf("=");
		var cookieName = eqPos > -1 ? name.substr(0, eqPos) : name;
    	
		if (cookieName != null && (cookieName.trim() == "JSESSIONID" || cookieName.trim() == "ObSSOCookie" ||cookieName.trim() == "ObTEMC") )
		{
    		
			deleteCookie(cookieName,"/",".vmware.com");
		
		}
    }
}

function deleteCookie( name, path, domain ) 
{	
	document.cookie = name + "=" + ";path=" + path + ";domain=" + domain + ";expires=Thu, 01-Jan-1970 00:00:01 GMT";
}

/*BUG-00057095*/
$('#userverifyPwd').keyup(function(){
	if($('#userverifyPwd').val() != '') {
		$('#emailChangeConfirm').attr('disabled', false);
		$('#emailChangeConfirm').removeClass('disabled');
	} else {
		$('#emailChangeConfirm').attr('disabled', true);
		$('#emailChangeConfirm').addClass('disabled');
	}
});


