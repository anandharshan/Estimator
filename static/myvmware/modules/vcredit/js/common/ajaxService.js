angular
        .module('ajaxModule',[])
        //Factory for Util module
	    .factory('ajaxCall',function(){
	        return {call : function(Url,requestType,sendData,successCallback,errorCallback){
	            $.ajax({
		              type: requestType,
		              async: true,
		              data: sendData,
		              url: Url,
		              contentType: 'application/json',
		              cache: false,
		              processData: false,
		              success: successCallback,
		              dataType: 'json',
		              error: errorCallback
				});
			}}
	    });