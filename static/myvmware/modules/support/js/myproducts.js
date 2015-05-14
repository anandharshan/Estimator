// THE JS file is explicitly used only for MYPRODUCTS view in TSR getHelp page for FILTER implementation
myvmware.support.myproducts = {
		
	filterMyProducts	:	function(URL){
			$('#myProductContainerHolder').html($('#myProductContainer').html());		
			$('#myProductContainer').html('<div class="loadingWrapper"><span class="loading_big">'+support.globalVars.loadingMsg+'</span></div>');
			var filterText = $("#filterProductListBy").val();
			var customerNumber = $("#customerNumber").val();
			var selectedEntitlementAccount = $("select#eaSelector option:selected").val();
			var productObj = $("#productObj").val();
		$.ajax({
			type : "POST",
			dataType : "html",
			url : URL,
			data : {
				filteredText : filterText,
				customerNumber : customerNumber,
				entitlementAccount : selectedEntitlementAccount,
				productObj : productObj
			},
			success : function(returnData) {
				try {						
					$('#myProductContainerHolder').html($('#myProductContainer').html());							
					$('#myProductContainer').html(returnData);
					myvmware.support.getHelp();
					myvmware.support.myproducts.disableSubmitButton();	
				}catch (err) {
					alert("ERROR IS "+err);
				}
			}
		});
	 },
	 
	 getProductsBasedOnEA	:	function(URL){
		$('#myProductContainerHolder').html($('#myProductContainer').html());		
		$('#myProductContainer').html('<div class="loadingWrapper"><span class="loading_big">'+support.globalVars.loadingMsg+'</span></div>');
		var customerNumber = $("#customerNumber").val();
		var selectedEntitlementAccount = $("select#eaSelector option:selected").val();
		var productObj = $("#productObj").val();
		var cLocale = $('#reqLocale').val();
			
		$.ajax({
			type : "POST",
			dataType : "html",
			url : URL,
			data : {
				customerNumber : customerNumber,
				entitlementAccount : selectedEntitlementAccount,
				productObj : productObj,
				locale : cLocale
			},
			success : function(returnData) {
				try {						
					$('#myProductContainerHolder').html($('#myProductContainer').html());							
					$('#myProductContainer').html(returnData);
					myvmware.support.getHelp();
					myvmware.support.myproducts.disableSubmitButton();	
				}catch (err) {
					alert("ERROR IS "+err);
				}
			}
		});
	 },
	 
	 resetMyProducts	:	function(URL){
			$('#myProductContainerHolder').html($('#myProductContainer').html());		
			$('#myProductContainer').html('<div class="loadingWrapper"><span class="loading_big">'+support.globalVars.loadingMsg+'</span></div>');
			var customerNumber = $("#customerNumber").val();
			var selectedEntitlementAccount = $("select#eaSelector option:selected").val();
			var productObj = $("#productObj").val();
		$.ajax({
			type : "POST",
			dataType : "html",
			url : URL,
			data : {
				customerNumber : customerNumber,
				entitlementAccount : selectedEntitlementAccount,
				productObj : productObj
			},
			success : function(returnData) {
				try {						
					$('#myProductContainer').html(returnData);
					myvmware.support.getHelp();
					myvmware.support.myproducts.disableSubmitButton();	
				}catch (err) {
					alert("ERROR IS "+err);
				}
			}
		});
	 },
	
	 //Added to disable the submit button when the products get refreshed 
	disableSubmitButton : function (){		 
			$('#next_button').removeClass('primary');    				
			$('#next_button').addClass('disabled');
			$('#next_button').attr('disabled','disabled');
			
			/*var $fieldset = $('.subproduct input[type=radio]');
			$fieldset.each(function(){						
				$(this).attr("checked", false); 
			});	*/	 
	 },
	 
	 // The below functions are written to as all the events are getting unbinded once its returned from ajax calls
	 unBindEvents : function(){		 
		 $('.fn_expandAll').unbind('click');
		 $('.fn_collapseAll').unbind('click');
		 $('.products .subproduct ul').hide();
		 $('.products .openClose').unbind('click');
	 },
	 
	 bindEvents : function (){
		 	$('.products .subproduct ul').hide();
		 	//<!-- BUG-00020687 start-->
		 	$('#firstItem').parent().addClass('topItem'); //for removing the dotted line above the first product
			$('#firstItem').addClass('open');
			$('#firstItem').parent().addClass('open');
			$('#firstItem').parent().find('.subproduct ul').show();
			//<!-- BUG-00020687 end-->
			
		 	// To validate expand all collapse all functionality..
		 	var $totalProducts = $('.products .product').length;
		 	
		 	if($totalProducts == 0){
		 		$('.fn_expandAll').addClass('disabled');
				$('.fn_collapseAll').addClass('disabled');
		 	}else{
		 		$('.fn_expandAll').removeClass('disabled');
				$('.fn_collapseAll').removeClass('disabled');
		 	}
		 	$('.products .openClose').click(function(){
				
				if($(this).hasClass('open')){
					//close it
					$(this).removeClass('open');
					$(this).parent().removeClass('open');
					
					$(this).next('.subproduct').find('ul').hide();
					if($(this).parent().find('.subproduct').find('.incDetail:visible')){
						$(this).next('.subproduct').find('.incDetail').hide();
						$(this).next('.subproduct').find('.incDetail').parent().parent().parent().parent().css('padding-bottom',"15px");
	  				}
				}else{
					//open it
					$(this).addClass('open');
					$(this).parent().addClass('open');
					$(this).next('.subproduct').find('ul').show();
					
					if($(this).parent().find('.subproduct').find('.incDetail:visible')){
						$(this).next('.subproduct').find('.incDetail').show();
						$(this).next('.subproduct').find('.incDetail').parent().parent().parent().parent().css('padding-bottom',"0");
	  				}	
				}
				var $openedProducts = $('.products .product a.open').length;
	  			if($openedProducts == ($totalProducts) ){
					$('.fn_expandAll').addClass('disabled');
					$('.fn_collapseAll').removeClass('disabled');
				}else{
					if($openedProducts == 0){
						$('.fn_collapseAll').addClass('disabled');
					}else{
						$('.fn_collapseAll').removeClass('disabled');
					}
					$('.fn_expandAll').removeClass('disabled');
				}
				return false;
			});
		 	
		 	// Expand All / Collapse All
			$('.fn_expandAll').click(function(){
				if(!$(this).hasClass('disabled')){
					$(this).parents('.step1').find('a.openClose').not('.open').trigger('click');
					$(this).parents('.step1').find('a.openClose').each(function(){
						if($(this).hasClass('open')){
							$('.fn_expandAll').addClass('disabled');
						}else{
							$('.fn_expandAll').removeClass('disabled');
						}
					})
					$('.fn_collapseAll').removeClass('disabled');
				}
				return false;
			});
			$('.fn_collapseAll').click(function(){
				if(!$(this).hasClass('disabled')){
					$(this).parents('.step1').find('a.openClose.open').trigger('click');
					$(this).parents('.step1').find('a.openClose').each(function(){
						if($(this).hasClass('open')){
							$('.fn_collapseAll').removeClass('disabled');
						}else{
							$('.fn_collapseAll').addClass('disabled');
						}
					})
					$('.fn_expandAll').removeClass('disabled');
				}
				return false;
			});	
		 
			$('#next_button').removeClass('primary');    				
			$('#next_button').addClass('disabled');
			$('#next_button').attr('disabled','disabled');
			
			var $fieldset = $('.subproduct input[type=radio]');
			$fieldset.each(function(){						
				$(this).attr("checked", false); 
			});		 
	 },
		 
	 getIncidentPacksBySerialNumber	: function(URL, serialNumber, emailAddress){
		$('#container'+serialNumber).html('<div class="loadingWrapper"><span class="loading_big">'+support.globalVars.loadingMsg+'</span></div>');
		var customerNumber = $("#customerNumber").val();
		var selectedEntitlementAccount = $("select#eaSelector option:selected").val();	
		var ipexpired = $('#ipexpired'+serialNumber).val();
		$.ajax({
			type : "POST",
			dataType : "html",
			url : URL,
			data : {
				serialNumber : serialNumber,
				emailAddress : emailAddress,
				customerNumber : customerNumber,
				selectedEntitlementAccount : selectedEntitlementAccount,
				ipexpired : ipexpired
			},
			success : function(returnData) {
				try {
					
					$('#container'+serialNumber).html(returnData);
					
				}catch (err) {
					alert("ERROR IS "+err);
				}
			}
		});
	 }
  } 
