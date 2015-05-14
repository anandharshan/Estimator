vmf.ns.use("sdp");
sdp.eaSelector.impl={

	beforeEaSelectorChange:function(){
		 // $.nofilter = 'nofilter';
		//$("#warning-message").remove();
    },
	afterEaSelectorChange_success:function(){
		
		document.getElementById("test_tbl").innerHTML = "";
		document.getElementById("loading").style.display="block";
		$.get($.subscriptionSummary, function(response) {

			 var aaData = response.SubscriptionSummary.aaData;
			 var row="<table><tr><th>Service #</th><th>Service Name</th><th>Service Type</th><th>Status</th><th>Start Date</th><th>End Date</th><th>Provider</th></tr>";
			 if(aaData.length == 0)
			{
				row+="<tr><td>No Data Available</td></tr>";
			}
			else
			{
			 for(var i=0;i<aaData.length;i++){
			   var arr = aaData[i];
			   row +="<tr>";
			   for(var j=0;j<arr.length;j++) {
				   var temp = arr[0];
				 
				   if( (j==3) && (arr[j]==null || arr[j]=='')) {
					   row +="<td>ACTIVE</td>";
				   }
				   if(j==1)
					   {
						 var tempUrl = $.viewDetailsUrl+'&serviceInstanceId='+temp;
						
						 row +="<td><a href="+tempUrl+">"+arr[j]+"</a></td>";
					   }
				   else {
					   row +="<td>"+arr[j]+"</td>";
				   } 
			   }
			   row +="<td>Reseller 1</td></tr>";
			}
			}
			row +="</table>";
			document.getElementById("loading").style.display="none";
			document.getElementById("test_tbl").innerHTML += row;
			});
	},
	afterEaSelectorChange_error:function(){
		 // $.eaChangeFailed = 'Change of Entitlement Account has failed';
		//ice.supportentitlement.logError($.eaChangeFailed);
	}
};