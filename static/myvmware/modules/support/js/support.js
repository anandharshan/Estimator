/* ########################################################################### *
/* ***** DOCUMENT INFO  ****************************************************** *
/* ########################################################################### *
 * ##### NAME:  support.js
 * ##### VERSION: v0.1
 * ##### UPDATED: 05/08/2011
/* ########################################################################### */

if (typeof(myvmware) == "undefined")  	myvmware = {};

myvmware.support = {
  	init: function() {
		if($('section.step1').length == 0) {
			myvmware.supportCommonFlow.getTechnicalDropDown();
		}
		if($('#next_button').hasClass('disabled')) {
			$('div.products').find('input:radio:checked').each(function(){
				$(this).removeAttr('checked');
			});
			$('div.products').find('input:checkbox').each(function(){
				$(this).removeAttr('checked').attr('disabled', true);
			});
		}
		$('ul.list_instances').find('input:checkbox').die('click').live('click',function(){
			var allChks=$(this).closest('ul.list_instances').find('input:checkbox'), chkLen = allChks.length;
			var l =  $(this).closest('ul.list_instances').find('input:checkbox:checked').length;
			if($(this).attr('id')=="AllSvcInstances"){
				allChks.attr("checked", $(this).is(':checked'));
			}
			else{
				if($(this).is(':checked') && l==chkLen-1)
					$(this).closest('ul.list_instances').find('input#AllSvcInstances').attr("checked", true);
				else 
					$(this).closest('ul.list_instances').find('input#AllSvcInstances').attr("checked", false);
			}
			l = $(this).closest('ul.list_instances').find('input:checkbox:checked').length;
			if (l>0) {$('#next_button').addClass('primary').removeClass('disabled').removeAttr('disabled');}
			else {$('#next_button').removeClass('primary').addClass('disabled').attr('disabled','disabled');	}
		});
                // code to adjust width of filter-section and myProductContainer 
                if($('.productDetailWrapper').length != 0){
                    callBack.addsc({'f':'myvmware.support.resizeFilterPane','args':[]});                
                }
                callBack.addsc({'f':'myvmware.support.setDefaultText','args':[]});                
  		}, //end of init
  	getHelp: function() {  	
 		$('.products .subproduct .product:last-child').addClass('lastItem');
  		$('.products .subproduct').hide();
  		$('#firstItem').parent().addClass('topItem');//for removing the dotted line above the first product
		$('#firstItem').addClass('open');
		$('#firstItem').parent().addClass('open');
		$('#firstItem').parent().find('.subproduct').show();
  		var $totalProducts = $('.products .product').length;
  		$('.products .openClose').die('click').live('click',function(){
  			if($(this).hasClass('open')){			//close it
  				$(this).removeClass('open');
  				$(this).parent().removeClass('open');
  				$(this).parent().find('.subproduct:first').hide();
				if($(this).parent().find('.subproduct').find('.incDetail:visible')){
					$(this).parent().find('.subproduct').find('.incDetail').hide();
					$(this).parent().find('.subproduct').find('.incDetail').parent().parent().parent().parent().css('padding-bottom',"15px");
  				}
  			}else{	//open it
  				$(this).addClass('open');
  				$(this).parent().addClass('open');
  				$(this).parent().find('.subproduct:first').show();
				if($(this).attr('name') == 'get_ip_by_sn' && $(this).attr('id') != ''){
					var getipbysnurl = $("#getIPbySerialNumber").val();
					var cutomerEmailAddress = $("#customerEmailAddress").val();
					var serialNumber = $(this).attr('id');
					myvmware.support.myproducts.getIncidentPacksBySerialNumber(getipbysnurl, serialNumber, cutomerEmailAddress);		
				}
				if($(this).parent().find('.subproduct').find('.incDetail:visible')){
					$(this).parent().find('.subproduct').find('.incDetail').show();
					$(this).parent().find('.subproduct').find('.incDetail').parent().parent().parent().parent().css('padding-bottom',"0");
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
                        // to adjust height of right panel
                        myvmware.support.adjustRightPanel();
  			return false;
  		});
  		//Get All main issue
  		$('.getHelpColumn select').click(function(){return false;});
  		$('.getHelpColumn').click(function(){
  			$this = $(this);
  			$dropDown = $(this).find('select');
  			$(this).addClass('active').siblings().removeClass('active');
			return false;
  		});
		$('.getHelpMain select').change(function(){
		  $this = $(this);
		  $getMain = $(this).parent().parent().parent();
  		  $getMain.addClass('active').siblings().removeClass('active');
		  moduleId = $this.parents('.getHelpColumn').attr('id');
		  $('.step1').addClass('hidden');
		  $('.'+moduleId).removeClass('hidden');
		});
		//Below sections are specifically needed for MYPRODUCTS in technicalgetHelpPageOne
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
		//Below sections are specifically needed for MYPRODUCTS in technicalgetHelpPageOne
		//var $fieldset = $('.subproduct input[type=radio]');
		$('.subproduct input[type=radio]').each(function(){
			if($(this).is(':checked')) {$('#next_button').addClass('primary').removeClass('disabled').removeAttr('disabled');}
		});
                $('.btnSearchSubmit').click(function(){
                    $('#gsa_query').trigger('change');                    
                });                
                // To clear the text
                $('#gsa_query').focus(function(evt){                    
                    myvmware.support.hideDefaultText();
                });
                $('#gsa_query').blur(function(evt){                    
                    myvmware.support.showDefaultText();
                });
                $('#gsa_query').keypress(function(evt){                    
                    if(evt.keyCode == 13){
                        evt.preventDefault();
                        $('#gsa_query').trigger('change');                                          
                    }
                });
		//The Below condition is being written, to remove the product category title for expired products, 
		//the subProduct is never generated for this as we are checking status as active
		//BUG-00033365
		$(".product").each(function(){
			var $subProduct = $(this).find('.subproduct');			
			if($.trim($subProduct.text()).length == 0){				
				$subProduct.parent().remove();
			}
		});
  	},
  	details: function() {		
    	var $detailsManagement = $('.support-details-wrapper');
    	// Change the module which is displayed when the drop down value changes.
    	$detailsManagement.find('.sup_content').not('#'+$('#sel_wantTo').val()).hide(); // Hide all but the currently selected module in the drop down.
    	$detailsManagement.find('header p').not('.'+$('#sel_wantTo').val()).hide(); // Hide all but the currently selected paragraph.
		$('#sel_wantTo').change(function() {
    		var cc = $(this).val();
    		$detailsManagement.find('.sup_content:visible').slideUp('fast',function() {$('#'+cc).slideDown();    		});
    		$detailsManagement.find('header p:visible').slideUp('fast',function() {$('header p.'+cc).slideDown();    		});
    	});    	
    },
    showSeverity : function() {
    	var severitySelected = $("#selectedSeverity");
    	$("#selectedSeverity").change(function(){$("#supportContract").show();});
    },
    hideDropdown : function(id){$(id).attr('disabled','disabled');},
    //Below sections are specifically needed for MYPRODUCTS in technicalgetHelpPageOne
    enableSubmitButton	:	function(radioObj,url){
	var fieldObj = $(radioObj);
	fieldObj.closest('div.products').find('input[type="checkbox"]').removeAttr('checked').attr('disabled', 'disabled');
	var chkObj = (fieldObj.siblings('ul.list_instances').length>0) ? fieldObj.siblings('ul.list_instances').find('input') : fieldObj.closest("div.product").siblings(".product").find('input:checkbox');
	$("#technicalProductURL").val("");
        $("#isMAProduct").val(false);
        $('#megerAndAcquistionProductMessageDisplay').html("");
	if(url || 0 != url.length){
		$("#technicalProductURL").val(url);
	        $("#isMAProduct").val(true);
	        $('#megerAndAcquistionProductMessageDisplay').html($("#megerAndAcquistionProductMessage").val());
	}
		if(fieldObj.attr('category')){chkObj.removeAttr('disabled');}
		else{chkObj.attr('disabled','disabled').attr('checked',"");}
		fieldObj.closest("li").siblings("li").find("input:checkbox").attr('disabled','disabled').attr('checked',false);
		//var fieldObjVal = ((fieldObj.attr('type')=="checkbox" && fieldObj.is(':checked')) || fieldObj.attr('type')=="radio")?$(radioObj).attr("value"):"";
            var fieldObjVal = $(radioObj).attr("value");
		if(fieldObjVal.length > 0 && fieldObj.attr('category')!="instances"){
			  $('#next_button').addClass('primary').removeClass('disabled').removeAttr('disabled');
            }else{
			  $('#next_button').removeClass('primary').addClass('disabled').attr('disabled','disabled');
        }
    },            
    // code to adjust width of filter-section and myProductContainer 
    resizeFilterPane : function(){
                var wrapperWidth = $('.productDetailWrapper').innerWidth();                
                var leftWidth = wrapperWidth - 350;               
                myvmware.support.adjustRightPanel();                                               
                $('.pdWrapperLeft').css('width',leftWidth);                
    },
    adjustRightPanel : function(){        
        var leftHeight = $('.pdWrapperLeft').outerHeight(true);                
        $('.pdWrapperRight').css('height',leftHeight - 1);
    },
    setDefaultText: function(){        
        $('#gsa_query').val($('#defaultDescription').val());
    },
    hideDefaultText: function() {               
        if ($.trim($("#gsa_query").val()) == $.trim($("#defaultDescription").val())) {            
            $("#gsa_query").val('');            
        }
    },
    showDefaultText: function() {          
        if ($.trim($("#gsa_query").val()) == "" || $.trim($("#gsa_query").val()) == $.trim($("#defaultDescription").val())) {
            $("#gsa_query").val($("#defaultDescription").val());            
        }
    }
};

myvmware.subscriptionMngmt={// Specific for Subscription Management part of SDP
	subscription:function(){
		VMFModuleLoader.loadModule("datatable", function(){;	
			vmf.datatable.build($('#tbl_instances'),{
				//"aaData": data.aaData,	
				"bAutoWidth": false,
				"bServerSide": false,
				"bSort": false,
				"sScrollY": '75px',
				"sDom": 't',
				"fnInitComplete": function(){
					//dtd = this;
					//$(dtd).append('<tfoot><tr><td class="bottomarea" colspan="7"></td></tr></tfoot>');
					 this.closest('div.dataTables_scroll').addClass("bottomarea");
				}
			});
		})
	}
  };
  // To resize filter pane on window resize
  window.onresize = function(){   
      if($('.productDetailWrapper').length != 0){
        myvmware.support.resizeFilterPane();      
      }
  };
  
  myvmware.supportCommonFlow = {
  	getTechnicalDropDown : function() {
		var selectedValue = $('#technicalDropdown :selected').text();
		if ($('#technicalDropdown :selected').index() == 0) {
			selectedValue = "Select One"; //TODO : Need to move the Text to global variable
			//selectedValue = myvmware.globalVars.selectOneLbl;
		}

		vmf.dropdown.build($('#technicalDropdown'), {
					optionsDisplayNum:20,
					ellipsisSelectText:false,
					ellipsisText:'',
					optionMaxLength:150,
					position:"left",
					optionGroup:true,
					optionsId:"tsDropDownOpts",
					optionsClass:"dropdownOpts",
					shadowClass:"eaBoxShadow",
					allowEmptySelect:false, 
					spanpadding:true,
					"onSelect":myvmware.supportCommonFlow.getSupportTechnical,
					spanpadding:false
				});
			
			$('#supportRequestForm').find('input.optionsHolder').val(selectedValue); 
  	},
  	getSupportTechnical : function(x) {
  		if(rs.isFirstCall) submitForm('technical',$('#technicalDropdown')[0],rs.tsrDropDownURL);
  		else submitForm(rs.tsrDropDownURL);
  	}

  }
