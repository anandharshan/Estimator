if (typeof(myvmware) == "undefined")  
    myvmware = {};

    myvmware.expireEvals= {
    
    		init: function() {
    			
    			$('#custDtls').val('');
				$('#custDtls').blur(function(){
    				
    				myvmware.expireEvals.fetchUserEvals(this);
    			})
    		},
    		fetchUserEvals : function(){
    			
    			$.ajax({
    		        type: "POST",
    		        dataType: "json",
    		        url:$('#fetchEvalsURL').val(),
    		        data: {custDtls : $('#custDtls').val()},
    		        success: function(object)
    		        {
    		        	myvmware.expireEvals.clearOptions($('#evalhistoryId'));
						$("#showUserEvals").show();
    		              var options=$('#evalhistoryId').attr("options");
    					  options[0]= new Option("Select One","");
    					  
    					  $.each(object.evalList,function(idx,value){
    						  var code = value[0]+'-';
    						  if(value[4]){
    							  code+='T';
    						  } else {
    							  code+='F';
    						  }
    						  var description = value[1]+' - '+ value[2];
    						  options[idx+1] = new Option( description ,code);
    						  $('#custNum').val(value[3]);
    					  });
    		        }, 
    		        error: function(XMLHttpRequest, textStatus, errorThrown) {
    		                
    		                debug("TextStatus=                          :   "+textStatus);
    		                debug("errorThrown=                         :   "+errorThrown);
    		                debug("Error XMLHttpRequest Ready State     :   "+XMLHttpRequest.readyState);
    		                debug("Error XMLHttpRequest status          :   "+XMLHttpRequest.status);
    		                debug("Error XMLHttpRequest status text     :   "+XMLHttpRequest.statusText);
    		                //debug("Error XMLHttpRequest response text   :   "+XMLHttpRequest.responseText);
    		                debug("Error XMLHttpRequest resp headers    :   "+XMLHttpRequest.getAllResponseHeaders());
    		                debug("Error XMLHttpRequest Location        :   "+XMLHttpRequest.getResponseHeader("Location"));
    		                debug("getting cookie"); 	               
    		            }
    		        });
    		},
    		clearOptions: function(selField) {
    			
    			if($(selField).attr("options").length>0){
    				$(selField).empty();
    			}
    		},
			processSubmit : function(actionURL) {
			
				document.forms["expirationForm"].action = actionURL;
				document.forms["expirationForm"].submit();
			}
    }