if (typeof(myvmware) == "undefined")  
    myvmware = {};
	VMFModuleLoader.loadModule("loading", function(){});
    myvmware.evalsPortal= {
    
            init: function() {
            	// Open close div section content for ShortLogin Flow
            	$(".showline #plus").click(function() {
    			  	$(this).hide();
    				$(this).parent().parent().find("#minus").show();
    				$(this).parent().parent().parent().find(".binary-description").toggle('slow');
    				});
                $(".showline #minus").click(function() {
    			  	$(this).hide();
    				$(this).parent().parent().find("#plus").show();
    				$(this).parent().parent().parent().find(".binary-description").toggle('slow');
    				});
        // Open close div section content
        $productWrapper = $('.products-section-wrapper');
        $productWrapper.find('.products-section-head')
            .click(function(){
                var $productSectionContent,
                    $this = $(this); // <a href="" class="openclose"></a>
                
                // Find the products-section-content
                $productSectionContent = $this.parent().find('.products-section-content');            
                //debug("Value of variable :: "+$productSectionContent);
                
                // Check if it's closed or open
                // Show or hide, and apply the correct class
                // $this (anchor tag), add class open/closed
                var $openLink = $this.find('.openCloseSelect a');
                if($openLink.hasClass('open')){
                    //debug("inside open class");
                    $productSectionContent.hide();
                    $openLink.removeClass('open');
                }else{
                    //debug("inside closed class");
                    $productSectionContent.show();
                    $openLink.addClass('open');
                }
                
                return false;
            });
        
        
        // Open close div section content
        $productCategory = $('.products-content-category');
        $productCategory.find('.openCloseSelect a')
            .click(function(){
                var $productBinaries,
                    $this = $(this); // <a href="" class="openclose"></a>
                
                // Find the products-section-content
                $productBinaries = $this.parent().parent().find('.products-content-binary-wrapper');            
                //debug($productBinaries);
                
                // Check if it's closed or open
                // Show or hide, and apply the correct class
                // $this (anchor tag), add class open/closed
                if($this.hasClass('open')){
                    $productBinaries.hide();
                    $this.removeClass('open');
                }else{
                    $productBinaries.show();
                    $this.addClass('open');
                }
                
                return false;
            });
        
        // 2 level Changes start
        // Open close div section content
        $productWrapper.find('.products-section-head-level0')
            .click(function(){
                var $productSectionContent,
                    $this = $(this); // <a href="" class="openclose"></a>
                
                // Find the products-section-content
                $productSectionContent = $this.next('.products-section-content-level0');            
                //debug("Value of variable :: "+$productSectionContent);
                
                // Check if it's closed or open
                // Show or hide, and apply the correct class
                // $this (anchor tag), add class open/closed
                var $openLink = $this.find('.openCloseSelect a');
                if($openLink.hasClass('open')){
                    //debug("inside open class");
                    $productSectionContent.hide();
                    $openLink.removeClass('open');
                }else{
                    //debug("inside closed class");
                    $productSectionContent.show();
                    $openLink.addClass('open');
                }
                
                return false;
            });
        
        
        //Open close div section content
        /*$productCategorylevel0 = $('.products-content-category-level0');
        $productCategorylevel0.find('.openCloseSelect a')
            .click(function(){
                var $productBinaries,
                    $this = $(this); // <a href="" class="openclose"></a>
                
                // Find the products-section-content
                 $productBinaries = $this.parent().parent().find('.products-content-binary-wrapper');  
                //debug($productBinaries);
                
                // Check if it's closed or open
                // Show or hide, and apply the correct class
                // $this (anchor tag), add class open/closed
                if($this.hasClass('open')){
                    $productBinaries.hide();
                    $this.removeClass('open');
                }else{
                    $productBinaries.show();
                    $this.addClass('open');
                }
                
                return false;
            });*/

// 2 level Changes

        
        // Tab management - Hide and show the correct tabs
        $('.tabbed_area').each(function(){
            var $this = $(this),
                content_show;
            if($this.find('.tabs').length > 0){
                $this.find('.tabContent').hide();
                content_show = $this.find('.tabs .active').attr('title')
                $('#'+content_show).show();
            }
        });
    
        // When a link is clicked
        $("a.tab").click(function () {   
            
            $this = $(this);
      
            // switch all tabs off
            $this.parents('.tabs').find(".active").removeClass("active");   
            
            // switch this tab on
            $this.addClass("active");   
      
            // slide all elements with the class 'content' up
            $this.parents('.tabbed_area').find(".tabContent").hide();   
      
            // Now figure out what the 'title' attribute value is and find the
            // element with that id.
            var content_show = $(this).attr("title");   
            $("#"+content_show).show();   
            return false;
        });     
        
        // Expand All / Collapse All
        $('.fn_expandAll').click(function(){
            $(this).parents('.tabContent').find('tr.clickable').not('.open').trigger('click');
            myvmware.evalsPortal.checkExpandCollapse();
            return false;
        });
        
        $('.fn_collapseAll').click(function(){
            $(this).parents('.tabContent').find('tr.clickable.open').trigger('click');
            myvmware.evalsPortal.checkExpandCollapse();
            return false;
        });
        
        // Initial check to see if Expand All/Collapse All should be 'disabled'
        myvmware.evalsPortal.checkExpandCollapse();
        
        // Handle Decline button click for EULA acceptance on modal
        $(".modalContent .fn_cancel").click(function(){
        
        var euladeclinesection='<div id="eula_decline" class="alert-box-wrapper">'+
                '<div class="alert-box-holder">'+
                '<div class="alert-title">'+$('#eula_decline_hidden').val()+'</div>'+
                '<p>'+$('#eula_decline_message_hidden').val()+'</p>'+
                '</div></div>';
            
            $('#tab_download').prepend(euladeclinesection);
            //$('#tab_download').prepend('<div id="eula_decline" class="error-message">Please Accept EULA to download binary files.</div>');
            
            vmf.modal.hide();
            $('.modalContent .button').uncorner();
            
            if($('#eula_decline').offset().top < $(window).scrollTop()){
           $('html, body').animate({
            scrollTop: $('#eula_decline').offset().top
        }, 1000);
       }
            
            return false;
        });
        
        //Handle Accept button click for EULA acceptance on modal
        $("#btn_accepteula").click(function(){
            
            debug("Accept EULA button clicked");
            
            debug("Verifying EULA Acceptance checkbox selection");
            if($("#chk_accepteula").is(":checked")) {
               debug("Accept EULA Checkbox selected");
                $("#accepteula_error").html("");
                $('#eulaterms').removeClass('error-message');
            } else {
              debug("Accept EULA Checkbox not selected");
               $("#accepteula_error").html($('#eula_accept_error_hidden').val());
               $('#eulaterms').addClass('error-message');
               return false;
            }
            
            debug("Submitting EULA Acceptance");
            $.ajax({
                type : "POST",
                dataType : "json",
                url : $("#hidaccepteulaturl").val(),
                data: {eulaid:$("#hideualid").val(),akamaiurl:$("#hidpopupurl").val(),popupmode:$("#hidmode").val()},
                success : function(object) {

                    try {
                        var popupURL = object.akamaiurl;
                       debug("Download URL is :: "+popupURL);
                        
                        var popupmode = object.popupmode;
                       debug("Popup Open mode :: "+popupmode);
                        vmf.modal.hide();
                        $('.modalContent .button').uncorner();
                        
                        if(popupmode == 'manual') {
                            window.open(popupURL);
                        } else if(popupmode == 'akamai') {
                            window.open(popupURL,'Download_File','height=250,width=350,scrollbars=no,resizable=yes');
                        } 
                        return false;
                    } catch (err) {
                        //debug(err);(err);
                    }
                }
            }); 
            
        });
        
		// setting up download thank you functionality
		setupDownloadThankYou();
		var inValidBrowser = myvmware.evalsPortal.isUnsupportedBrowser();
		if(inValidBrowser){
			$("#alertAgentDiv").show();
		}
		if(($("[name='enableLaunchBtn']").val()=='true') && (!inValidBrowser)) {
			$("input[coursecode]").click(function(){
				myvmware.evalsPortal.handleLaunchHol(this);	
				
				
			});
			$(".box_footer").removeClass('grey_out');
		}
		if($("[name='silentRegistrationFlag']").val()=='true'){
			$("#silentRegDiv").show();
		}
    },
	handleLaunchHol: function(ele) {
		var courceCode = $(ele).attr('coursecode');
		//courceCode = 'scale1';
		var locationParent = location.search.replace("?","&");
		var labMyVURL = '/group/vmware/evalcenter?p_p_id=evalcenter_WAR_itevals_INSTANCE_Td0X&p_p_lifecycle=2&p_p_state=normal&p_p_mode=view&p_p_resource_id=getHolURL&courseCode='+courceCode+'&p_p_cacheability=cacheLevelPage&p_p_col_id=column-3&p_p_col_pos=4&p_p_col_count=8'+locationParent;
		
		vmf.ajax.post(labMyVURL,'',myvmware.evalsPortal.handleHolAjaxRes,myvmware.evalsPortal.handleHolAjaxErr,function(){vmf.loading.hide()},null,function(){vmf.loading.show()}, false);
		//$('#labHeadB').html( $( ele ).attr('coursename')+'<span id="labHeadS" class="holHeadSml">'+$(ele).attr('coursecode')+'</span>');
	},
	handleHolAjaxRes: function(holData){
		if(holData.neeURL!=null){
		//holData.neeURL.replace('http:', '');
		//$('#labWindow').attr('src',holData.neeURL);
		//vmf.modal.show('tstModal',{closeHTML:'<a class="modalHolClose" title="Close"></a>'});	
		 var params  = 'width='+screen.width;
		 params += ', height='+screen.height;
		 params += ', top=0, left=0'
		 params += ', fullscreen=yes';
		 window.open(holData.neeURL,'_blank',params);
		}else{
			if(holData.errorMessage!=null){
				$('#holErr').text(holData.errorMessage);
			}
			vmf.modal.show('holErrPopUp',{closeHTML:'<a class="modalHolClose" title="Close"></a>'});	
		}
	},
    handleHolAjaxErr:function(){
		vmf.modal.show('holErrPopUp',{closeHTML:'<a class="modalHolClose" title="Close"></a>'});
	},
 // Check to see if all all clickable rows are expanded or not
    checkExpandCollapse: function(){
        
        $('.expand-collapse').each(function(){
            // Do for each just to make sure that if there are 3 tabs on a page
            // that it gets applied to the correct one.
            
            var $this = $(this),
                clickableRows;
            
            // Clear previous classes
            $this.find('.fn_expandAll, .fn_collapseAll').removeClass('disabled');
            
            clickableRows = $this.parents('.filter-section').next('div').find('tr.clickable');
            openClickableRows = $this.parents('.filter-section').next('div').find('tr.clickable.open');
            
            if(clickableRows.length === openClickableRows.length) {
                // Disable Expand All button
                $this.find('.fn_expandAll').addClass('disabled');
            } else if (openClickableRows.length === 0) {
                // Disable the Collapse button
                $this.find('.fn_collapseAll').addClass('disabled');
            }
                        
        });
            
    },
    
    
    doDownloadAction: function (varURL){
       debug("inside Manual DownLoad Validations");
        
        $.ajax({
            type : "POST",
            dataType : "json",
            url : varURL,
			async : false,
            success : function(object) {

                try {
                    var popupURL = object.popupurl;
                   debug("Manual Download URL is :: "+popupURL);
                    
                    var eulaURL = object.eulaurl;
                    //eulaURL = "http://vmware.com"+eulaURL;
                   debug("EULA URL is :: "+eulaURL);
                    
                    var eulaid = object.eulaid;
                   debug("Latest EULA id is :: "+eulaid);
                    
                    var eulaterms = object.eulaterms;
                   debug("EULA Terms are :: "+eulaterms);
                    
                    var mode = object.popupmode;
                   debug("Popup Mode is :: "+mode);
                    
                    var ismodal = object.openmodal;
                   debug("Open Modal :: "+ismodal);
                    
                    $("#hideualid").val(eulaid);
                    $("#hidpopupurl").val(popupURL);
                    $("#freulaurl").attr("src", eulaURL);
                    $("#eulaterms").find("label").text(eulaterms);
                    $("#hidmode").val(mode);
                    
                    if(ismodal == 'yes') {
                        debug("Inside open model logic");
                        $('#eula_decline').remove();
                        
                        vmf.modal.show('eulaContent', { checkPosition: true });
                        $('.modalContent .button').corner();
                        return false;
                    } else {
                        debug("No Modal Open");
                        
                        if(mode == 'manual') {
						/* For Bug-fix  Jan-17 release Chrome freeze issue BUG-00068610*/
                             if (!$("#downloadFrame").length)
								{ 
									$('<iframe id="downloadFrame" name="downloadFrame" style="width:0px;height:0px;font-size:0">').appendTo('body');
								}	
							   $("#downloadFrame").attr("src",popupURL);
							//window.location.href=popupURL;
					        } else if(mode == 'akamai') {
                            window.open(popupURL,'Download_File','height=250,width=350,scrollbars=no,resizable=yes');
                        }
                        return false;
                    }
                    
                } catch (err) {
                    //debug(err);(err);
                }
            }
        }); 
    },
	
	isUnsupportedBrowser: function(){
		var version, browserDetect=false;
			var userAgent = navigator.userAgent.toLowerCase(); 
				if ($.browser.msie && parseFloat($.browser.version) < parseFloat("10")) {
					browser ="Internet Explorer";
					version = $.browser.version;
					 browserDetect = true;
				}
				else if(userAgent.indexOf('firefox') != -1){
				
					version = myvmware.evalsPortal.getBrowserVersion(userAgent,'firefox/');
					if(parseFloat(version) < parseFloat("13"))
					{
					  browserDetect = true;
					}				
				}
				else if(userAgent.indexOf('chrome') != -1){
						version = myvmware.evalsPortal.getBrowserVersion(userAgent,'chrome/');
						if( parseFloat(version) <  parseFloat("18"))
						{
						  browserDetect = true;
						}
						
				}
				else if(userAgent.indexOf('safari') != -1)
				{
						version = myvmware.evalsPortal.getBrowserVersion(userAgent,'version/');
						if((parseFloat(version) < parseFloat("6")) && (version != "6.0.5"))
						{
						   browserDetect = true;
						}
				}
				if(browserDetect)
				{
					return true;
				}
	},
	getBrowserVersion: function(userAgent,browserIdentity){
		userAgent = userAgent.substring(userAgent.indexOf(browserIdentity));
		if(browserIdentity!="firefox/") {userAgent = userAgent.substring(0,userAgent.indexOf(' '));}
		var version = userAgent.substring(userAgent.indexOf('/')+1);
		return version;
	}
    
}
 
    /**
     * Prints messages on console for debugging
     * 
     * @param msg
     */
    function debug(msg){

        // comment out the below line while debugging
        // console.log(msg);
    }   
	
function setupDownloadThankYou() {
	var thankYouDiv$ = $('div#div_thk_u');
	if (thankYouDiv$.length) {
		$('body').prepend(thankYouDiv$);
		thankYouDiv$.find('.close').mousedown(function(e) {
		     if(e.which != 1) return;
			$(window).unbind('scroll.thankyou resize.thankyou');
			thankYouDiv$.removeClass("posAbslte").hide();
			// SiteCatalyst
			/*if ($("#prgOmnDispName") && $("#prgOmnDispName").val()) {
				sendDownloadThankYouEvent($("#prgOmnDispName").val() + ' : reg : Download : ty : exit' );
			}*/
        });
		$('div.downloadManager a').click(function() {
			if (thankYouDiv$.is(':hidden')) {
				thankYouDiv$.show();
				var oMTop=thankYouDiv$.offset().top,
					vw=$(window),
					orgView=vw.scrollTop(); 
				if((orgView!=0)&&(orgView>oMTop)&&!thankYouDiv$.is(".posAbslte")){
					thankYouDiv$.addClass("posAbslte")
				}
				vw.bind("scroll.thankyou resize.thankyou", function(){
					var vt=vw.scrollTop(); 
					if((vt>oMTop)&&!thankYouDiv$.is(".posAbslte")){
						thankYouDiv$.addClass("posAbslte");
					} else if ((vt<=oMTop)&&thankYouDiv$.is(".posAbslte")){
						thankYouDiv$.removeClass("posAbslte");
					}
				})
				// SiteCatalyst
				/*if ($("#prgOmnDispName") && $("#prgOmnDispName").val()) {
					sendDownloadThankYouEvent( $("#prgOmnDispName").val() + ' : reg : Download : ty' );
				}*/
			}
		});	
	}
}

function sendDownloadThankYouEvent(data) {
	if (s.pageName) {
		var ppn = s.pageName;
		sendToOminature( 'group : evals' , data );
		s.pageName = ppn;
	}
}

function openHelpPage(url){
	
	NewWindow = window.open(url,"_blank","width=595,height=570,resizable=yes,left=100,top=100,screenX=100,screenY=100,toolbar=no, location=no,directories=no,status=no,menubar=no,scrollbars=yes,copyhistory=yes") ;
	NewWindow.location = url;
	//window.open(url, "Help");
}