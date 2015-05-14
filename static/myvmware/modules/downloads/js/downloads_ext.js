	
	
	jQuery( function () { 
		jQuery('#version').change( 
			function(event) { 
				var selectobj = this;
				var optobj = selectobj.options[selectobj.selectedIndex];
				var downloadGroupId = jQuery(optobj).attr("downloadGroupId");
				var productId = jQuery(optobj).attr("productId");
				var detailsPage = jQuery('#detailsPageURL').val();
				//Liferay.fire('getProductDlgDetails', { downloadGroupId:downloadGroupId , productId:productId} ); 
				window.location.href = detailsPage+"?downloadGroup="+downloadGroupId+"&productId="+productId;
				return false; 
			} 
		) 
		} );
		
	
	jQuery( function () {
		Liferay.on( 'getProductDlgDetails', 
			function(event) { 
				var downloadGroupId = event.downloadGroupId;
				var productId = event.productId;
				if (downloadGroupId) { 
					var resourceUrl = jQuery('#getProductDetailsAjaxURL').val();
					jQuery('.scProductDlgTabDetails').html('Loading...'); 
					jQuery.ajax( 
						{ 
								
								url: resourceUrl, 
								data: { downloadGroup: downloadGroupId , productId: productId }, 
								error: function() { 
									jQuery('.scProductDlgTabDetails').html('' +  Liferay.Language.get('sorry-there-was-an-error') + ''); 
								}, 
								success: function(message) { 
									jQuery('.scProductDlgTabDetails').html(message); 
									try{
										jQuery('.scProductDlgTabDetails').html(message); 
										expandCollapseAll();
										bindFilter();
										unBindEventsForProdInfoReq();
										bindExpandColapseEvents();
										checkExpandCollapse();
										manageTab();   
										
									}catch(e){
									}	
								} 
						}	
					); 
					 
				}
			}	
		);
		} );	
	
	
	function getProductDetails(currentUrl, selectobj){
		var optobj = selectobj.options[selectobj.selectedIndex];
		var downloadGroupId = optobj.getAttribute("downloadGroupId");
		location.href=currentUrl+"?downloadGroup="+downloadGroupId;
	}
	
	
	

	
	
	