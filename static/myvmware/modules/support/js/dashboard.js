myvmware.dashboard = {
		init :function() {
		
		$('#search').keypress(function(e){
											if(e.which == 13){
												$('#searchbtt').click();
											}		
		});	
		$('#searchbttMagnifyingGlass').click(function(e){
											$('#searchbtt').click();		
		});		
		
		$('#searchbtt').unbind('click').bind('click', function() {	
			
			var searchKey = $('#search').val();
			  if(searchKey=="" || searchKey=="Search")
		      {
				  searchKey="";
		      }
				var searchType = $('#searchType').val();	
				var url;
				
				if(searchType=="productdocs"){
					if(searchKey=="")
					{
						url="https://www.vmware.com/support/pubs/";
					}else{
						url="http://www.vmware.com/tpsearch/#site=VMware_Site_pubs&client=tpsearch_frontend&getfields=*&output=xml_no_dtd&filter=0&proxyreload=1&proxystylesheet=tpsearch_frontend&tpsearch_global=all&num=10&entqr=3&q="+searchKey+"&requiredfields=";
					}
				}
				else if(searchType=="community"){
					/*var communities = $("#communities").val();		
					if(searchKey=="")
					{
						//url="http://communities.vmware.com/";
						url = communities;
					}else{
						url= communities+"/search.jspa?resultTypes=&dateRange=last90days&peopleEnabled=false&q="+searchKey+"&containerType=&container=&containerName=&username=";
					}*/
					url= "http://search.vmware.com/search?q="+searchKey+"&cn=vmware&cc=www&client=VMware_Site&entqr=0&ud=1&output=xml_no_dtd&proxystylesheet=VMware_gsa_Site&site=VMware_Site_communities&ie=UTF-8&oe=UTF-8&image.x=0&image.y=0";
					
					
				}else{
					if(searchKey=="")
					{
						url="http://kb.vmware.com/selfservice/microsites/microsite.do";
					}else{/* fix for BUG-00086985*/
						var host_part = window.location.hostname.split('.');
			            if (host_part[0].indexOf("-") !=-1)
			            	{
			            	var host = host_part[0].split('-');
			            	url="http://www-"+host[1]+".vmware.com/support-search.html?cc=www&client=VMware_Site_support_center&site=VMware_Site_support_center&cn=vmware&num=20&output=xml_no_dtd&ie=UTF-8&oe=UTF-8&q="+searchKey+"#client=VMware_Site_support_center&numgm=4&getfields=*&filter=0&site=%28VMware_Site_kb%29&cc=en&ie=UTF-8&oe=UTF-8&start=0&num=20&cid=VM101W&tid=&cn=vmware&output=xml_no_dtd&q="+searchKey+"&product=";
			            	}
			            else 
			            	{url="http://www.vmware.com/support-search.html?cc=www&client=VMware_Site_support_center&site=VMware_Site_support_center&cn=vmware&num=20&output=xml_no_dtd&ie=UTF-8&oe=UTF-8&q="+searchKey+"#client=VMware_Site_support_center&numgm=4&getfields=*&filter=0&site=%28VMware_Site_kb%29&cc=en&ie=UTF-8&oe=UTF-8&start=0&num=20&cid=VM101W&tid=&cn=vmware&output=xml_no_dtd&q="+searchKey+"&product=";
				            }/* end fix for BUG-00086985*/
						}
				}
				window.open(url);
			});
		}
};