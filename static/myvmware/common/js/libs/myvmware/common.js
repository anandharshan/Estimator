document.write("<script type='text/javascript' src='/static/myvmware/common/js/libs/myvmware/jquery.i18n.properties.js'></scr"+"ipt>");
if (typeof(myvmware) == "undefined")  myvmware = {};
if (typeof myvmware.temp == "undefined") myvmware.temp = {};
myvmware.temp.common = {};
//myvmware.temp.common.th = null;  
myvmware.commonKeys = {};
if(typeof(myvmware.globalVars) !== "undefined") $.extend(myvmware.commonKeys,myvmware.globalVars);
myvmware.common = {
	supportedLang : {locales:[{lang:"en"},{lang:"jp"}]},
	ie6UnsupportedMessage : "We have detected that your using an old Internet browser which our website doesn\'t support.<br />Please upgrade your browser to ensure an amazing experience.",	
	init: function() {
		//myvmware.common.localize.init();
		myvmware.common.adjustPanes();
		var langauge=$('#localeFromLiferayTheme').text();
		myvmware.common.loadBundles(langauge);
		$('nav ul.sf-menu').superfish();
		// IE6 Main Navigation Hover Helper
		$("nav>ul>li").hover(function(){$(this).addClass('hover')},function(){$(this).removeClass('hover')});
		if(isIE(6, true)){$("#breadcrumb").after('<div id="warning-message"><div class="message-holder"><h2>' + myvmware.common.ie6UnsupportedMessage + '</h2></div></div>');}
		// Tooltip code
		if($("a.fn_tooltip").length>0){
			$.each($("a.fn_tooltip"),function(i,v){
				var $this = $(this);
				var topOffset = 1;
				var leftOffset = 4;
				var placementClass = "";
				//Check if placement should be bottom
				if($this.data('tooltip-position') == "bottom"){
					topOffset = 24;
					leftOffset = -72;
					placementClass = "bottom";
				}
				else if($this.data('tooltip-position') == "left-bottom"){
					topOffset = 28;
					leftOffset = -207;
					placementClass = "left-bottom";
				}
				else if($this.data('tooltip-position') == "config-bottom"){
					topOffset = 30;
					leftOffset = -90;
					placementClass = "bottom";
				}else{placementClass = "right";}
				$this.accessibleTooltip({topOffset: topOffset,leftOffset: leftOffset,associateWithLabel:false,preContent: "<div class=\"arrow "+placementClass+"\"></div>"});				
			});
		}
		// Collapse Left Navigation
		$subnav = $(".sub-nav");
		$subnav.find(".openClose, .closeTitle").click(function() {myvmware.common.toggleSubNav($subnav);	return false;});
		$("#tabbed_box_1 ul.tabs li a").each(function(){$(this).attr("title",($(this).text()));});//Adding title to Tabs
		$personalDetails = $("#personal-details");
		$personalDetails.find('.openClose').click(function() {// Account switch
			myvmware.common.toggleAccountSwitch($personalDetails);
			return false;
		});
		if($('.filter').length>0){// Filter Hide/Show toggle
			if($('.filter a').html().charAt(0)=='+')	{$('.filter-content').hide();};
			$('.filter a').click(function() {
				$this = $(this);
				$this.closest('section').find('.filter-content').slideToggle('fast',function() {
					if($this.html().charAt(0)=='-'){
						$this.html($this.html().replace('-','+'));
						$this.removeClass('minus').addClass('plus');							/* Added by 307179 #BUG-00010934*/ 
						$($('section.column')[0]).height( $this.closest('section')[0].scrollHeight);
						$('#isFilterChecked').val("plus");
					}else{
						$this.html($this.html().replace('+','-'));
						$this.removeClass('plus').addClass('minus');							/* Added by 307179 #BUG-00010934*/ 
						$($('section.column')[0]).height( $this.closest('section')[0].scrollHeight);
						$('#isFilterChecked').val("minus");
						if($('#txt_mySupportRequestView').is(":visible")){
							if(vmf.dropdown){
								if($('#isEaSelectorSet').val()=='NO'){
									vmf.dropdown.build($("#txt_mySupportRequestView"), {optionsDisplayNum:20,ellipsisSelectText:false,ellipsisText:'',optionMaxLength:62,inputMaxLength:37,position:"right",onSelect:getLevelOneFoldersBySelectedEA});																			
									$('#isEaSelectorSet').val("YES");
									vmf.dropdown.build($("#txt_product"), {optionsDisplayNum:20,ellipsisSelectText:false,ellipsisText:'',optionMaxLength:62,inputMaxLength:37,position:"left"});
								}
							}
						}
					}
				});
				return false;
			}); 
			$('.filter-content.showfilter').each(function(i,obj){
				$(obj).show();
				if($(obj).prev('.filter-header').find('.filter a').html().charAt(0)=='+'){
					$(obj).prev('.filter-header').find('.filter a').html($(obj).prev('.filter-header').find('.filter a').html().replace('+','-'));
				}
			})
			// Filter date toggling
			$('.filter-content .filter-date').not('.active').each(function() {
				$(this).find('.secondRow select, .secondRow input').attr('disabled', true);
			});
			$('.filter-content .filter-date .onoff').change(function() {
				var $this = $(this);
				$this.parents('.filter-content').find('.filter-date').removeClass('active').find('.secondRow select, .secondRow input').attr('disabled', true);
				$this.parents('.filter-date').addClass('active').find('.secondRow select, .secondRow input').attr('disabled',false);
			});	 
		}
		// Drop down config menus
		$dropDown = $(".settings-cog .dropdown");
		$dropDown.live('mouseover mouseout', function(e){
			if (e.type=='mouseover'){
				e.stopPropagation();
				$(e.target).parents('.settings-cog').addClass('open hover');
			} else {$(e.target).parents('.settings-cog').removeClass('open');}
		});
		$('.settings-cog').live('mouseover mouseout click',function(e){
			e.preventDefault();
			var gearIcon = $(this), $dropDown=$(this).find('.dropdown'),$cog=$(this).find('.cog');			
			var dd = gearIcon.find('.dropdown');
			if (e.type == "click"){return;} else if (e.type == "mouseover"){
				if($('.dataTables_scrollHead').length){$('.dataTables_scrollHead').css('overflow','visible')}
				setTimeout(function(){gearIcon.addClass('hover');$dropDown.show();},301);
			} else {
				setTimeout(function(){
				if(!$('.settings-cog').hasClass('open') || !$('.settings-cog').hasClass('hover')){
					if($('.dataTables_scrollHead').length){$('.dataTables_scrollHead').css('overflow','hidden')}
					$dropDown.hide();
					gearIcon.removeClass('hover');
				}}, 300);
			}
		});
		// to check whether user profile exists on header or not.
		if($("#site-tools .userID").html() != null){myvmware.common.checkUserProfile();}
		// Language Selector
		$dropDown = $(".language .languages");
		$dropDown.hide();		
		$dropDown.hover(function() {$(this).addClass('hovered');},
			function() {
				var cc = $(this);
				cc.removeClass('hovered');
				setTimeout(function(){if(!cc.hasClass('hovered')){cc.hide();}}, 500);
			}
		);
		$('.language').hoverIntent(function() {
			$(this).find('.languages').show();
		},function() {
			var cc = $(this);
			setTimeout(function(){
				if(!cc.find('.languages').hasClass('hovered')){
					cc.find('.languages').hide();
				}}, 500);
		});	
		// Select All functionality
		$('#select_all').click(function() {
			if($(this).attr('checked') == true){
				$(this).parents('section.column').find('input[type=checkbox]:not(:disabled)').attr('checked',true).parents('span.folderNode').addClass('selectedFolder');
			} else {
				$(this).parents('section.column').find('input[type=checkbox]:not(:disabled)').attr('checked',false).parents('span.folderNode').removeClass('selectedFolder')
			}
		});
		// Scrollable Tables
		if($('.scrollableTable').length > 0){
			var scrollableTableHeight = 300;
			if($('.scrollableTable').hasClass('sixFifty')){scrollableTableHeight = 650;}
			$('.scrollableTable').dataTable( {"sScrollY": scrollableTableHeight+"px","bPaginate": false,"bFilter":false,"sDom": 't',"bAutoWidth": false	});
		}
		//Table heading numbers
		$('section.column ul input[type=checkbox]').change(function() {
			var $this = $(this);
			if($this.parents('section.column').find('header h1 span.numberSelected').length > 0){
				//Work how how many checkboxes are selected
				$this.parents('section.column').find('header h1 span.numberSelected').html($this.parent().parent().find('input[type=checkbox]:checked').length);
			}
		});
		// Footer alignment
		if($('#main-content').hasClass('column-two-collapse')){$('#footer-container').addClass('indent');}
		if($.browser.msie) {/* The below code is added to fix the select box width for IE - Author::Nagaraj*/
			$('select').each(function(i){
				$(this).attr("origWidth",$(this).outerWidth())
					   .unbind('mousedown blur').bind('mousedown blur change',function (event) {
							$(this).css("width",$(this).attr("origWidth")+"px");
				});
			});
		}
		//Adding title to side-nav links/images
		$("aside nav li a").each(function() {  // BUG-00064475: Fixed for issue 'Title is replaced with label text'
			var title = $(this).attr("title");
			if (title == undefined || title === '') {
				$(this).attr("title",($(this).text()));	
			}
		});
		//BUG-00062520 - updating QuickLinks BG-Y Position
		myvmware.common.updateQLStyles()
		
		//Hari - Start: To update URL replacing zh with cn and ja with jp and ko with kr.
		var languageCode = langauge.substring(0,2);
		if(languageCode == "ko")	languageCode = "kr";
		else if(languageCode == "ja")	languageCode = "jp";
		else if(languageCode == "zh")	languageCode = "cn";		
		$('.sf-menu li a').each(function(){
			if(languageCode != "en") {
				this.href = this.href.replace("lan_code",languageCode);
				this.href = this.href.replace("/zh/","/cn/");
				this.href = this.href.replace("/ja/","/jp/");
				this.href = this.href.replace("/ko/","/kr/");
			}
			else {this.href = this.href.replace("lan_code/","");}		 	
		});
		//Hari - End: To update URL replacing zh with cn and ja with jp and ko with kr.
		//To fix height same in all dashboard pages (level-1)
		var maxR1H=0;
		var maxR2H=0;
		$('.summary-column-wrapper.row-1').each(function(){
			$this = $(this);
			if ( $this.height() > maxR1H ) {maxR1H = $this.height();}
		});
		$('.summary-column-wrapper.row-1').each(function(){$(this).css('height',maxR1H);});
		$('.summary-column-wrapper.row-2').each(function(){
			$this = $(this);
			if ( $this.height() > maxR2H ) {maxR2H = $this.height();}
		});
		$('.summary-column-wrapper.row-2').each(function(){$(this).css('height',maxR2H);});
		//Send an ominiture event whenever user clicks on learn more about my vmware.
		$('#learn_ot_id').click(function(){
			try{
				riaLink("orientation:from_learn_more:about_my_vmware");
			} catch(e) {}
		});
		//tooltip display whenever user mouseover on learn more about my vmware.
		$('#learn_ot_id').mouseover(function(){$('#toolTip_OT').show();});
		$('#learn_ot_id').mouseout(function(){$('#toolTip_OT').hide();});
		$('#toolTip_OT').delay(3000).fadeOut(1000); 			//Tooltip hiding after 10 seconds
		if(($('#header-container').find('nav').length==0) && (!$('#header-container').find('.exit').length>0)){// to integrate bug-00031586
			$('#header-container').css('height', '62px');  
			$('#spacer').css('margin-bottom', '10px');
		}
		// Update auto scroll call
		try{
			if($('#isFilterChecked').val()=="minus"){$('.filter a').click();}
		} catch(e) {	}
		/*Added for CR 15768*/
		var ob = vmf.cookie.read("ObSSOCookie"),
			path = window.location.href,
			pgNamesArr = [
				  "registration"
				, "activationbeforeauth"
				, "activation"
				, "inactiveaccount"
				, "terms-of-use"
				, "home"
				, "users-permissions"
				, "downloads"
				, "downloads_family"
				, "info"
				, "my-licenses","all-services","sdppartnercentral","sdpPartnerAllOrders","allrenewals","sdppartnerAllRateCards","subscription-services","billing-statements"
			],
			urlPieces = (path.split('#')[0]).split('/'),
			intersectionArr = $.map(pgNamesArr,function(a){
				return $.inArray(a, urlPieces) < 0 ? null : a;
			});

		if( intersectionArr.length == 0 && !(ob == "loggedout" || ob == "loggedoutcontinue" || ob == null || ob == "")) {
			myvmware.common.showMessageComponent("");
		}
		/*End of code added for CR 15768*/
		$(document).ajaxComplete(function() {
			if($('.modalOverlay').length){
				var expandPos = $('#content-container-wrapper').width() - $('#content-container').width() -  $('#content-container').offset().left + 'px';
				$('.expands	').css('left',expandPos);
				if($(window).width()>1600){
					$('.ribbon').css({'left':'auto','right':expandPos});
				}
				if(pgName === 'home'){
					$('.dragCol').css({
						'top':$('#alertInfoTable thead tr:first th:eq(1)').offset().top - $('#content-container').offset().top + $('#alertInfoTable thead tr:first th:eq(1)').outerHeight() + 'px',
						'left':$('#alertInfoTable thead tr:first th:eq(1)').offset().left + $('#alertInfoTable thead tr:first th:eq(1)').width() - 64 + 'px'
					});
				}
				myvmware.common.setOverlayPosition();
			}
		});
		/*End of code added for CR 15768*/
		// Binds omniture triggering event as per BUG-00064782
		$("#header_nav_id #Downloads").siblings("ul").find("li:last-child ul li:last-child").bind("click",function(){
			if(typeof(riaLinkmy) == "function"){
				riaLinkmy("downloads-more : virtual-appliances");
			}
		});

		//Validations
		$("input:text[data-valid='digit']").bind("keydown",function(event){
			if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 || 
				 // Allow: Ctrl+A
				(event.keyCode == 65 && event.ctrlKey === true) || 
				 // Allow: home, end, left, right
				(event.keyCode >= 35 && event.keyCode <= 39)) {
					 // let it happen, don't do anything
					 return;
			}
			else {
				// Ensure that it is a number and stop the keypress
				if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
					event.preventDefault();
				}   
			}
		});
		$("input:text[data-valid='number']").bind("keydown",function(event){
			if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 || 
				 // Allow: Ctrl+A
				(event.keyCode == 65 && event.ctrlKey === true) || 
				 // Allow: home, end, left, right
				(event.keyCode >= 35 && event.keyCode <= 39)) {
					 // let it happen, don't do anything
					 return;
			}
			else {
				// Ensure that it is a number and stop the keypress
				if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
					event.preventDefault();
				}   
			}
		}).bind("blur",function(){
			var str = $(this).val().split(',').join(''),
			pattern = /(-?\d+)(\d{3})/;
			if(str.length >= 4){
				while(pattern.test(str)) {
					str = str.replace(pattern, "$1,$2");
					$(this).val(str);
				}
			} else {
				$(this).val(str);
			}
		}).each(function(){
			var str = $(this).val().split(',').join(''),
			pattern = /(-?\d+)(\d{3})/;
			if(str.length >= 4){
				while(pattern.test(str)) {
					str = str.replace(pattern, "$1,$2");
					$(this).val(str);
				}
			} else {
				$(this).val(str);
			}
		});
		
		 //Feedback button URL fix
		if($('#navigation-bottom').length){
		  var $feedback = $('#navigation-bottom');
		  var feedbaklink = $feedback.find('li:last').find('a');
		  var themeLocaleVar = $("#localeFromLiferayTheme").html(); //Gets current locale from myvmware
		  
		  var urlLocaleMapper = {}; //Object that defines the locale's specific URL
		  urlLocaleMapper["en_US"] = "javascript:window.open('https://vmware.co1.qualtrics.com/SE/?SID=SV_3geP03w6FpSj8hf&Q_lang=EN','','width=715,height=675,location=no,menubar=no,resizable=no,scrollbars=yes,status=no,toolbar=no');void(0);";
		  urlLocaleMapper["en"] = "javascript:window.open('https://vmware.co1.qualtrics.com/SE/?SID=SV_3geP03w6FpSj8hf&Q_lang=EN','','width=715,height=675,location=no,menubar=no,resizable=no,scrollbars=yes,status=no,toolbar=no');void(0);";
		  urlLocaleMapper["zh_CN"] = "javascript:window.open('https://vmware.co1.qualtrics.com/SE/?SID=SV_3geP03w6FpSj8hf&Q_lang=ZH-S','','width=715,height=675,location=no,menubar=no,resizable=no,scrollbars=yes,status=no,toolbar=no');void(0);";
		  urlLocaleMapper["ja_JP"] = "javascript:window.open('https://vmware.co1.qualtrics.com/SE/?SID=SV_3geP03w6FpSj8hf&Q_lang=JA','','width=715,height=675,location=no,menubar=no,resizable=no,scrollbars=yes,status=no,toolbar=no');void(0);";
		  urlLocaleMapper["de_DE"] = "javascript:window.open('https://vmware.co1.qualtrics.com/SE/?SID=SV_3geP03w6FpSj8hf&Q_lang=DE','','width=715,height=675,location=no,menubar=no,resizable=no,scrollbars=yes,status=no,toolbar=no');void(0);";
		  urlLocaleMapper["fr_FR"] = "javascript:window.open('https://vmware.co1.qualtrics.com/SE/?SID=SV_3geP03w6FpSj8hf&Q_lang=FR','','width=715,height=675,location=no,menubar=no,resizable=no,scrollbars=yes,status=no,toolbar=no');void(0);";
		  urlLocaleMapper["ko_KR"] = "javascript:window.open('https://vmware.co1.qualtrics.com/SE/?SID=SV_3geP03w6FpSj8hf&Q_lang=KO','','width=715,height=675,location=no,menubar=no,resizable=no,scrollbars=yes,status=no,toolbar=no');void(0);";
		  urlLocaleMapper["undefined"] = "javascript:window.open('https://vmware.co1.qualtrics.com/SE/?SID=SV_3geP03w6FpSj8hf&Q_lang=EN','','width=715,height=675,location=no,menubar=no,resizable=no,scrollbars=yes,status=no,toolbar=no');void(0);";
		  urlLocaleMapper[""] = "javascript:window.open('https://vmware.co1.qualtrics.com/SE/?SID=SV_3geP03w6FpSj8hf&Q_lang=EN','','width=715,height=675,location=no,menubar=no,resizable=no,scrollbars=yes,status=no,toolbar=no');void(0);";
		  
		  feedbaklink.attr('href', urlLocaleMapper[themeLocaleVar]); //sets specific URL as href
		}
		
		$("input:text[data-valid='float']").bind('keypress',function(event){
			if (event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 || 
				 // Allow: Ctrl+A
				(event.keyCode == 65 && event.ctrlKey === true) || 
				 // Allow: home, end, left, right
				(event.keyCode >= 35 && event.keyCode <= 39)) {
					 // let it happen, don't do anything
						return;
			}
			else {
				if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
					event.preventDefault();
				}
			}
		}).bind('keyup',function(event){
			//Fix to 2 decimal points
			if ((event.which >= 48 && event.which<=57) && ($(this).val().indexOf('.')!=-1)){
				if($(this).val().split('.')[1].length >= 2) $(this).val(parseFloat($(this).val()).toFixed(2));
			}
			//Remove Leading 0's
			var s=$(this).val();
			while (s.substr(0,1) == '0' && s.length>1 && s.substr(1,1)!=".") { s = s.substr(1); }
			$(this).val(s);
		}).bind('blur',function(e){
			var value = $(this).val();
			(value.length == 0) ? $(this).val('') : $(this).val(parseFloat(value).toFixed(2));
		});
			
	},// End of init
	generateReports : function(url){// Generating xl reports 
		if($('body iframe').length>0){$('body iframe:first').attr('src',url);}	
		else{$("<iframe  src='" + url + "' style='display: none;' name='frameName' />").appendTo('body');}
	},
	generateCSVreports:function(url,postData,omnitureArgs, failedOmnitureArgs){
		riaLink(omnitureArgs); // Omniture events
		if(!vmf.loading){VMFModuleLoader.loadModule("loading",function(){vmf.loading.show({"overlay":true});});
		}else	vmf.loading.show({"overlay":true});
		vmf.ajax.post(url,postData,
			function(jData){//Success call
				var data = vmf.json.txtToObj(jData);
				if(data.error != null && data.error != 'undefined'){
					riaLink(failedOmnitureArgs);
					myvmware.common.showError('exportCsvError',data.error);
				} else {
					myvmware.common.generateReports(data.respUrl);
				} 
			},
			function(errMsg){
				riaLink(failedOmnitureArgs);
				
				if(errMsg != null && errMsg.responseText != null){
				myvmware.common.showError('exportCsvError',errMsg.responseText);
				} else {
					myvmware.common.showError('exportCsvError',"Oops!! We encountered an error.");
				}
			}, 
			function(){vmf.loading.hide();}// on complete 
		);
	},
	showError:function(id,msg){
		vmf.modal.show(id,{
				checkPosition: true,
				onShow: function (dialog) {
					$('.modalContent p.errorContent').html(msg);
					$('.modalContent .fn_cancel').click(function(){vmf.modal.hide();})
				}
			});
	},
	checkUserProfile : function() {// User Profile/alerts Drop down menu
		$profileDropDown = $(".userProfileWrapper .user_dropdown");
		$profileDropDown.hide();
		$profileDropDown.hover(
			function() {$(this).addClass('hovered');},
			function() {
				var cc = $(this);
				cc.removeClass('hovered');
				setTimeout(function(){if(!cc.hasClass('hovered')){cc.hide();}}, 500);
			}
		);
		$('.userProfileWrapper').hoverIntent(function() {
			$(this).find('.profileDD').addClass('opened');
			$(this).find('.user_dropdown').show();
		},function() {
			var cc = $(this);
			setTimeout(function(){
				if(!cc.find('.user_dropdown').hasClass('hovered')){
					$('.profileDD').removeClass('opened');
					cc.find('.user_dropdown').hide();
				}
			}, 500);
		});
		//To have maximum characters limit 35 for user first and last names
		$("#site-tools .userFirstName").each(function(){
			var $firstName = $(this);
			var $firstNameText = $firstName.text();
			if($firstNameText.length > 35){
				var $firstNameSubStr = $firstNameText.substring(0,35);
				$firstName.text($firstNameSubStr);
				$firstName.append("... ");
			}
		})
		$("#site-tools .userLastName").each(function(){
			var $lastName = $(this);
			var $lastNameText = $lastName.text();
			if($lastNameText.length > 35){
				var $lastNameSubStr = $lastNameText.substring(0,35);
				$lastName.text($lastNameSubStr);
				$lastName.append("... ");
			}
		})
		//To have maximum characters limit 50 for user name
		var $userIDCharLength = $("#site-tools .userID").html().length;
		var $userID = $("#site-tools .userID");
		if($userIDCharLength > 1 && $userIDCharLength <= 25){
			$userID.css({'word-wrap':'normal','white-space':'nowrap','height':'10px','width':'150px'})
			$(".user_dropdown").css("width","180px");
		}else if($userIDCharLength > 25 && $userIDCharLength <= 50){
			$userID.css({'word-wrap':'normal','white-space':'nowrap'})
			var $charCount = Math.round($userIDCharLength*5.9);
			if($.browser.msie){
				$userID.css("width",$charCount+"px");
				$(".user_dropdown").css("width",($charCount+30)+"px");
				$userID.css("overflow","visible");
			}else{
				$(".user_dropdown").css("width","auto");
				$userID.css("width","auto");
			}
			$userID.css("height","10px");
		}else if($userIDCharLength > 50){
			$userID.css({'width':'300px','word-wrap':'break-word','height':'auto','line-height':'12px','padding-bottom':'3px'});
			$(".user_dropdown").css("width","330px");
		}
	},
	loadBundles : function(lang) {
		jQuery.i18n.properties({name:'message', path:'/static/myvmware/common/message/', mode:'map', language:lang, callback: function() {myvmware.common.updateMessage();} });
	},
	updateMessage : function(){myvmware.common.ie6UnsupportedMessage=jQuery.i18n.prop('label.common.ie6.unsupportedMessage');},
	// Open and close the account switch panel
	toggleAccountSwitch: function($personalDetails) {   		
		var accountPanel = $('#accounts');
		var imgOpenClose = $('#icon');
		var ht = $('#personal-details').find('.name').outerHeight();
		if(accountPanel.hasClass('closed')) {
			var imgPath = imgOpenClose.attr("src").replace("bg-open-close.png", "icon_accountOpen-white.png");
			imgOpenClose.attr("src",imgPath); 
			accountPanel.slideDown('normal');
			$('#personal-details').addClass('bgImage');
			$('#personal-details').find('.name span').css('color','#ffffff');
			accountPanel.removeClass('closed').addClass('open');
			$(accountPanel).css('top',ht+'px');
		}else{
			var imgPath = imgOpenClose.attr("src").replace("icon_accountOpen-white.png", "bg-open-close.png");
			imgOpenClose.attr("src",imgPath); 
			accountPanel.slideUp('normal',function() {
				$('#personal-details').removeClass('bgImage');
			});		
			accountPanel.removeClass('open').addClass('closed');
			$('#personal-details').find('.name span').css('color','');
		}
	},
    // Open and close the left navigation
    toggleSubNav: function($subnav) {
    	$contentcontainer = $subnav.parents('#content-container');
    	if($contentcontainer.hasClass('open')){
			// The sub navigation is open, so we need to close it.
    		$('#content-section').stop().animate({"margin-left": "60px"}, 350, function() {
    			$contentcontainer.removeClass('open').addClass('closed');
    			$subnav.find('ul li a').animate({'padding-left': '50px'}, 200);
    			$subnav.find('.quickLinksTitle').animate({'left': '50px'}, 200);
				//checkPosition();
    		})//.width(($('#content-section').width()+130)+"px");
    		$subnav.removeClass('opening').addClass('closing');
    		$sectionsToHide = $contentcontainer.find('aside .asideSection').not('.sub-nav');
    		if(!$.browser.msie){$sectionsToHide.fadeOut('fast');}
			else{$sectionsToHide.hide();}
    	}else{
    		// The sub navigation is closed, so we need to open it.
    		$('#content-section').stop().animate({"margin-left": "190px"}, 350, function() {
				$contentcontainer.removeClass('closed').addClass('open');
				$sectionsToShow = $contentcontainer.find('aside .asideSection').not('.sub-nav');
				if(!$.browser.msie){
	    			$sectionsToShow.fadeIn('slow');
	    		}else{
	    			$sectionsToShow.show();
	    		}
				//checkPosition();
    		})//.width(($('#content-section').width()-130)+"px");
    		$subnav.removeClass('closing').addClass('opening');
    		$subnav.find('ul li a').animate({'padding-left': '41px'}, 200);
    		$subnav.find('.quickLinksTitle').animate({'left': '42px'}, 200);
    	}
	},
	//Show Account Details in Accounts Widget on the Home page
	showAccountDetails: function() {  	
		$('td .openClose').click(function() {  			
			var $divBasedMore,$moreDetail,$toggleLink,$this = $(this);
			$divBasedMore = $this.parent().parent().next().next().find('.accounts_details');
			$toggleLink = $this.parents('tr').find(".toggleLink");
			$moreDetail = $divBasedMore;
			if($this.hasClass('open')){
				$moreDetail.hide();
				if($toggleLink.length){$toggleLink.html('expand').addClass('expand');}
				$this.removeClass('open');
			}else{
				$moreDetail.show();
				if($toggleLink.length){$toggleLink.html('collapse').removeClass('expand');}
				$this.addClass('open');
			}
			return false;
		});			
		$('a.toggleLink').click(function(e){
			var $details, $this=$(this), $collapse;
			$details=$this.parents('tr').find(".accounts_details");
			$collapse=$this.parents('tr').find(".openClose");
			if ($this.hasClass('expand')){
				$this.html("collapse").removeClass('expand');
				$details.show();
				if($collapse.length){$collapse.addClass('open');}
			} else {
				$this.html("expand").addClass('expand');
				$details.hide();
				if($collapse.length){$collapse.removeClass('open');}
			}
			e.preventDefault();
			e.stopPropagation();
		});
  	},
	openHelpPage:function(URL,customWidth){
		var wd =   customWidth || '695px';
		NewWindow = window.open(URL,"_blank","width="+wd+",height=670,resizable=yes,left=100,top=100,screenX=100,screenY=100,toolbar=no, location=no,directories=no,status=no,menubar=no,scrollbars=yes,copyhistory=yes") ;
		NewWindow.location = URL;
	},
	/* Function for creating a placeholder test if the browser does not support placeholder attribute*/
	/* myvmware.common.putplaceHolder(elementname)*/
	/**************************************************************************/
	putplaceHolder: function(element){// Check whether browser supports placeholder property
		var elems;
		if(element != ""){elems = element;}
		else{elems = '.txt_datepicker';}
		if (!$.support.placeholder) {
			$(elems).die('focus blur change').live({
				focus: function(){
					if ($(this).attr('placeholder') != '' && $.trim($(this).val()) == $(this).attr('placeholder')) {
						$(this).val('').removeClass('hasPlaceholder');
				}},
				blur: function(){
					if ($(this).attr('placeholder') != '' && ($.trim($(this).val()) == '' || $.trim($(this).val()) == $(this).attr('placeholder'))) {
						$(this).val($(this).attr('placeholder')).addClass('hasPlaceholder');
				}},
				change: function(){$(this).removeClass('hasPlaceholder');}				
			});
			$(elems).trigger('blur');         
		}
	},
	vmExtendSession: function() {setTimeout("myvmware.common.extendSession()", 1000*60*3);},
	extendSession: function() {Liferay.Session.extend();	setTimeout("myvmware.common.extendSession()", 1000*60*3);},
	adjustHeightAllSections: function(mainElem){
		var oheight = $(mainElem).outerHeight(true);
		var e_height = 0;
		if(oheight > 320){
			$(mainElem).prevUntil('section').each(function(i,obj){
				if($(obj).is(':visible')){
				  oheight = oheight + $(obj).outerHeight(true)
				}
			})
			$(mainElem).parent('section.column').height(oheight);		
			$(mainElem).parent('section.column').prevAll('section.column').each(function(i,obj){
				$(obj).height(oheight);
				var scrolls = $(obj).find('.scroll').outerHeight(true);
				if($(obj).find('.scroll')){
					$(obj).find('.scroll').prevUntil('section').not('header,.scroll').each(function(j,o){
						e_height = $(o).outerHeight(true);
					})
					var scrollsHeight = oheight - $(obj).find('.scroll').outerHeight(true) - e_height;
					$(obj).find('.scroll').height($(obj).find('.scroll').outerHeight(true) + scrollsHeight - $(obj).find('header').outerHeight(true));				
				}
			})
		}
	},
	maskLicenseKey: function(str){// Mask middle characters of a license key.
		str = str.split('-');
		var newStr = '';
		if(str.length > 1){
			for(var i in str){
				var s = str[i];
				if(i == 0 || i == str.length - 1){
					if(i == 0){  newStr += s+"-";}
					else{newStr += s;}
				}else{
					newStr += s.replace(/[a-zA-Z 0-9]/g,'X');
					newStr += '-'
				}    
			}
		}else{newStr +=  str;}
		return newStr;
	},
	sortEAOptions: function(optionsHolder, value){
		var oldArr=[], newArr=[], topRows=[];
		$("a[name='"+value+"']").addClass("tick").siblings().removeClass("tick");
		if ($("a.defaultEA", $("div#eaDropDownOpts")).length){topRows.push(parseInt($("a.defaultEA", $("div#eaDropDownOpts")).attr("name"),10));}
		$("a", optionsHolder).each(function(i){oldArr.push(parseInt($(this).attr("name"),10));});
		oldArr=oldArr.sort();
		$.each(topRows, function(k,v){newArr.push($("a[name='"+v+"']", optionsHolder)[0]);});
		$.each(oldArr, function(k, v){
			if($.inArray(v, topRows)==-1){newArr.push($("a[name='"+v+"']", optionsHolder)[0]);}
		});optionsHolder.html($(newArr));
	},
	adjustPanes: function(){
		var minWidth = (typeof partnerType !="undefined") ? 1250 : 980;
		var paneWidth=($(window).width()>=1600)? 1600 : (($(window).width()<minWidth)?minWidth:$(window).width());
		var contentId="#content-section",homeLayout=false,regPage=false;
		if ($("#content-wrapper").length>0){
			contentId =  "#content-wrapper";
			homeLayout=true;
		}
		else if ($("#content-container-wrapper").length>0 && (!$("nav.sub-nav").length)){// specific to registration page
			if ($(".portlet-layout>aside").length) { // SDP Partner - Quick Links layout
				$("#main-content").removeClass("closed").addClass("partnerPage");
				$("#footer-container").removeClass("indent").addClass("partnerFooter");
			} else {
				contentId = "#content-container"
				regPage=true;
			}
		}
		var secheight = $(window).height()-($("#vmbar").outerHeight(true)+$("#header-container").outerHeight(true)+$("#account-content").outerHeight(true)+$("#footer-container").outerHeight(true)+$(contentId).outerHeight(true)-$(contentId).height()+$(".alert-box").outerHeight(true)+(($("#popinfo").is(":visible"))?$("#popinfo").outerHeight(true):0));
		secheight = (secheight <550) ? 550 : secheight;
		$("#content-container").width(paneWidth +"px");
		$(contentId).width((paneWidth-110) + "px").css('min-height',secheight + "px");
		if(homeLayout) {
			var contentWid = $(contentId).outerWidth(true)-$(contentId).width();
			$(contentId).width(paneWidth-contentWid + "px");
			$("#content-section").width(paneWidth-contentWid-$("aside").outerWidth(true)-contentWid);
		}
		if(regPage) {// specific to registration page
			$(contentId).width(paneWidth +"px");
		}
		var a=$.fn.dataTableSettings;
		if(typeof a !== "undefined"){
			for ( var i=0, iLen=a.length ; i<iLen ; i++ ) {
			  a[i].oInstance.fnAdjustColumnSizing(false);
			}
		}
		/*BUG-00048299 - Downloads Page liquid layout fix.*/
		if(myvmware.download){
			myvmware.download.adjustContentHeader();
		}else if(myvmware.downloadsHistory) {
			myvmware.downloadsHistory.adjustContentHeader();
		}else if(myvmware.evaluations){
			myvmware.evaluations.adjustMyEvalContent();
		}
		// liquid layout fix in patch downloads
		if(myvmware.ptd){
			if($(myvmware.ptd.dt).is(':visible')) 
				myvmware.ptd.postDatatable(myvmware.ptd.dt);
		}
	},
	addBreadScrumbDetails: function(){
			if(typeof rs.breadscrumbName!="undefined"){
				$("#breadcrumb").find("ul li").removeClass("last");
				$.each(rs.breadscrumbName,function(i,j){
					if (i==rs.breadscrumbName.length-1){
						$("#breadcrumb").find("ul").append("<li class='last'><span>"+j+"</span></li>");
					} else {
						$("#breadcrumb").find("ul").append("<li><span><a href='"+rs.breadscrumbUrl[i]+"'>"+j+"</a></span></li>");
					}
				});
			}
	},	
	showMessageComponent: function(pageName){
		var url ='/group/vmware/alogin?p_p_id=asynchLoginPortlet_WAR_itvmlogin&p_p_lifecycle=2&p_p_state=normal&p_p_mode=view&p_p_cacheability=cacheLevelPage&p_p_resource_id=getAllUIMessageComponentsForPage', _postData = new Object(),
		map = {
			  "Q1_PUSHPANE_ALL_PAGES":myvmware.common.showPushPane
			, "BEAK_HOME_PAGE_FOR_DOWNLOAD_MENU":myvmware.common.showGlobalBeaks//HOME
			, "BEAK_HOME_PAGE_FOR_PROFILE_DROPMENU":myvmware.common.showHomeBeaks//HOME
			, "BEAK_DOWNLOADS_PAGE_FOR_MY_PRODUCTS":myvmware.common.showBeaks//DOWNLOADS
			, "BEAK_DOWNLOADS_PAGE_FOR_ALL_PRODUCTS_HOVER_MENU":myvmware.common.showBeaks//DOWNLOADS
			, "BEAK_DOWNLOADS_FAMILY_PAGE_FOR_VERSION_SELECTOR":myvmware.common.showBeaks//DOWNLOADS_FAMILY
			, "BEAK_DOWNLOADS_PAGE_FOR_CUSTOM_ISO_TAB":myvmware.common.showBeaks//DOWNLOADS_FAMILY
			, "BEAK_USERPERMISSION_PAGE_FOR_SHARE_FOLDER":myvmware.common.showBeaks,//USER_PERMISSION
			"SDP_BEAK_SUBSCRIPTION_SERVICE_ALERT":myvmware.common.showBeaks,
			"SDP_BEAK_SUBSCRIPTION_SERVICE_EXPORT":myvmware.common.showBeaks,
			//"SDP_BEAK_SUBSCRIPTION_SERVICE_REMAINING_TERM":myvmware.common.showBeaks, // Added by Satya
			"SDP_BEAK_SUBSCRIPTION_INSTANCE_DETAIL_LAUNCH":myvmware.common.showBeaks,
			"SDP_BEAK_SUBSCRIPTION_INSTANCE_DETAIL_TERM":myvmware.common.showBeaks,
			"SDP_BEAK_SUBSCRIPTION_INSTANCE_DETAIL_ADDON":myvmware.common.showBeaks,
			"SDP_BEAK_SUBSCRIPTION_HOME_MEGAMENU":myvmware.common.showBeaks,
			"SDP_BEAK_USERPERMISSION_BYSERVICE":myvmware.common.showBeaks,
			"SDP_BEAK_PARTNER_CUSTOMER_ALERT":myvmware.common.showBeaks,
			"SDP_BEAK_PARTNER_CUSTOMER_MONTHLY_LIMIT":myvmware.common.showBeaks,
			"SDP_BEAK_PARTNER_RESELLER_ALERT":myvmware.common.showBeaks,
			"SDP_BEAK_PARTNER_RESELLER_MONTHLY_LIMIT":myvmware.common.showBeaks,
			"SDP_BEAK_PARTNER_RESELLR_ORDER_PENDING_TAB":myvmware.common.showBeaks,
			"SDP_BEAK_PARTNER_DISTI_ORDER_PENDING_TAB":myvmware.common.showBeaks,
			"SDP_BEAK_PARTNER_RESELLER_ORDER_PENDING_MONTHLY":myvmware.common.showBeaks,
			"SDP_BEAK_PARTNER_DISTI_ORDER_PENDING_MONTHLY":myvmware.common.showBeaks,
			"SDP_BEAK_PARTNER_RESELLER_RENEWAL_ALERT":myvmware.common.showBeaks,
			"SDP_BEAK_PARTNER_DISTI_RENEWAL_ALERT":myvmware.common.showBeaks,
			"SDP_BEAK_PARTNER_RESELLER_RENEWAL_RENEW":myvmware.common.showBeaks,
			"SDP_BEAK_PARTNER_DISTI_RENEWAL_RENEW":myvmware.common.showBeaks,
			"SDP_BEAK_PARTNER_PRICELIST_DEFAULT":myvmware.common.showBeaks,
			"SDP_BEAK_PARTNER_PRICELIST_UPLOAD":myvmware.common.showBeaks,
			"SDP_BEAK_PARTNER_PRICELIST_DOWNLOAD":myvmware.common.showBeaks
			, "SDP_BEAK_SUB_PRAXIS_INS_DET_MAN_SER": myvmware.common.showBeaks
			, "SDP_BEAK_SUB_PRAXIS_INS_DET_PAST_USG": myvmware.common.showBeaks
			, "SDP_BEAK_SUB_PRAXIS_BILL_DET_CSV_DOW": myvmware.common.showBeaks
			, "SDP_BEAK_SUB_PRAXIS_PAST_USG_CHAR_OPT": myvmware.common.showBeaks
		};
		if(typeof partnerType !="undefined") //Url for partner beaks
			url = rs.beak_url || '/web/sdppartner/blogin/-/consumer/WSRP_10132_718d37b1__1862__46dd__a5ab__8eb9291af1d3/normal/view/cacheLevelPage/WDJKbFlXdHpVRzl5ZEd4bGRGOVhRVkpmYVhSelpIQlFZWEowYm1WeVgzZHpjbkE5TVEqKg**?p_p_lifecycle=2&p_p_resource_id=getParnterUIComponents&p_p_col_id=column-3&p_p_col_count=1&_WSRP_10132_718d37b1__1862__46dd__a5ab__8eb9291af1d3_wsrp-resourceCacheability=cacheLevelPage';
		myvmware.common.beaksObj = {};
		_postData['pageName'] = pageName;
		vmf.ajax.post(url,_postData,function(data){
			if(typeof data!="object") data=vmf.json.txtToObj(data);
			var jsonData = data.allUIMessageComponents;
			if(jsonData && jsonData.length){
				for(var i =0;i<jsonData.length;i++){
					if (typeof map[jsonData[i].name] != "undefined") map[jsonData[i].name](jsonData[i].name,jsonData[i].id,pageName);
				}
			}
		},null,null,null,null,false); 
	},
	setMessageStatus: function(msgId){
		var url= '/group/vmware/alogin?p_p_id=asynchLoginPortlet_WAR_itvmlogin&p_p_lifecycle=2&p_p_state=normal&p_p_mode=view&p_p_cacheability=cacheLevelPage&p_p_resource_id=setUIMessageComponent', postData = new Object();
		if(typeof partnerType !="undefined") //Url for partner beaks
			url = rs.beak_set_url || '/web/sdppartner/blogin/-/consumer/WSRP_10132_718d37b1__1862__46dd__a5ab__8eb9291af1d3/normal/view/cacheLevelPage/WDJKbFlXdHpVRzl5ZEd4bGRGOVhRVkpmYVhSelpIQlFZWEowYm1WeVgzZHpjbkE5TVEqKg**?p_p_lifecycle=2&p_p_resource_id=setParnterUIComponents&p_p_col_id=column-3&p_p_col_count=1&_WSRP_10132_718d37b1__1862__46dd__a5ab__8eb9291af1d3_wsrp-resourceCacheability=cacheLevelPage';
		postData['displayId'] = msgId;
		vmf.ajax.post(url,postData,null,null);
	},
	showPushPane: function(overlayNm,id,pgNm){
		if( !$('.pushPaneMainContainer').length ){ /* to render pushpane only once */
			$('#vmbar').after(
			  '<div class="pushPane pushPaneMainContainer"><div class="pushPaneContent"><div class="feedbackinfo">' + 
			  myvmware.commonKeys.feedbackText + '</div><div class="feedbacktext">' + 
			  myvmware.commonKeys.comingSoonText + '</div><a href="javascript:;" class="closePane">closePane</a><a class="learnMoreLink" href="javascript:;">' + 
			  myvmware.commonKeys.learnMore + '</a></div></div>');
			$('.pushPane').show();
			var pushpaneHt = $('.pushPane').outerHeight(true);
			$('a.closePane').live('click',function(){
				$('.pushPane').hide().remove();
				$(window).trigger('resize'); // to position the beaks properly, on removing the pushpane element on the browser
				if($('.beak_tooltip_flyout_def').length){
					var config = myvmware.common.beakConfig;
					if(config && config.target){
						var getTopPos = (config.target.offset().top + (config.target.outerHeight(true)/2)) - $('.beak_tooltip_flyout_def').outerHeight(),getLeftPos;
						if(config.isFlip){
							getLeftPos = config.target.offset().left - $('.beak_tooltip_flyout_def').width();
						} else {
							getLeftPos = config.target.offset().left + config.target.width();
						}	
						$('.beak_tooltip_flyout_def').css({'top':getTopPos,'left':getLeftPos});
					}
				}
				if(typeof ice != 'undefined' && $('.modalOverlay').length){
					if(ice.alertinfo) {
						ice.alertinfo.setHomeOverlayPos();
					}
					else if(ice.managelicense) {
						ice.managelicense.setMessagesPosition();
					}
					myvmware.common.setOverlayPosition();
				}
				myvmware.common.setMessageStatus(id);
			});
			$('a.learnMoreLink').live('click',function(){
				myvmware.common.openHelpPage('//download3.vmware.com/microsite/myvmware/dot7/index.html','1060px');
			});
		}
	},
	showOverlay: function(overlayNm,id){
		$('body').append('<div class="modalOverlay"></div><div class="overlayCont"><span class="ribbon"><span class="closeTxt">New features that you&#39;ve been asking for are here!</span><a href="javascript:;" class="closeOverlay"></a></span><span class="getReports"></span><span class="expands"></span><span class="dragCol"></span><span class="panesResize"></span></div>');
		
		if(overlayNm === "Q1_OVERLAY_LICENSE_PAGE_HOME_SEEN"){
			$('.expands,.getReports').css({'background':'none'});
			$('.dragCol').addClass('dragColumnPos');
			$('.panesResize').addClass('panesResizeBtm');
		}else if(overlayNm === "Q1_OVERLAY_HOME_PAGE"){
			$('.panesResize').css({'background':'none'});
			$('.getReports').addClass('getReportsHome');
			$('.dragCol').addClass('dragColHome');
		} 
		var modalCls = $('.modalOverlay'),overlayCls = $('.overlayCont');
		modalCls.show();
		myvmware.common.setMessageStatus(id);
		$('.overlayCont,a.closeOverlay,#header-container a').die('click').live('click',function(){
			modalCls.remove();
			overlayCls.remove();
		});
	},
	setOverlayPosition: function(){
		var elem = $('#content-container-wrapper'),topVal = $('#content-container').offset().top,modalCls = $('.modalOverlay'),overlayCls = $('.overlayCont');
		$('.modalOverlay,.overlayCont').css({
			'top':topVal+'px',
			'width':elem.outerWidth(true),
			'height':(ice.managelicense)?(elem.outerHeight(true)):(elem.outerHeight(true) + $('#footer-container').outerHeight(true)) + 'px'
		});
	},
	showGlobalBeaks: function(overlayNm,id){
		myvmware.common.showBeaks(overlayNm,id);
		setTimeout(function(){
			myvmware.common.showDownloadsMenuBeak();
		}, 3000);
	},
	showBeaks: function(overlayNm,id){
		$('body').append('<div class="beak_tooltip_flyout_def" id="beak_'+id+'" style="display:none;"><a href="javascript:;" class="closeBeak"></a><span class="beak_corner"></span><div class="beak_flyout_lft"></div><div class="beak_flyout_middle"><span class="beakHeading">New: Custom Labels</span><span class="beakContent">Assign unique values to License Key labels to help track them more easily.</span><a href="javascript:;" class="learnMoreBk">' + myvmware.commonKeys.learnMore + '</a></div><div class="beak_flyout_rgt"></div></div>');
		var imgArr = [
			'/static/myvmware/common/css/img/beak_filter_left.png',
			'/static/myvmware/common/css/img/beak_filter_rgt.png',
			'/static/myvmware/common/css/img/beak_left.png',
			'/static/myvmware/common/css/img/beak_middle.png',
			'/static/myvmware/common/css/img/beak_right2.png',
			'/static/myvmware/common/css/img/corner.png',
			'/static/myvmware/common/css/img/corner_lft.png'
		];
		$(imgArr).each(function(){
			$('<img/>')[0].src = this;
		});
		myvmware.common.beaksObj[overlayNm] = id;
	},
	setBeakPosition: function(config){
		myvmware.common.beakConfig = {};
		myvmware.common.beakConfig = config;
		if(config.target.length > 0 && myvmware.common.beaksObj[config.beakName]){
			var beakObj = $("#beak_"+myvmware.common.beaksObj[config.beakName]);
			var getTopPos = config.target.offset().top + config.target.outerHeight(true)/2 - beakObj.outerHeight(),getLeftPos;
			if(typeof config.center != "undefined" && config.center) getTopPos += config.target.outerHeight(true)/2;
			if(config.noLearnMore){
				$('.learnMoreBk',beakObj).addClass('dispNone');
			}
			if(config.isFlip){
				$('.beak_flyout_lft',beakObj).addClass('beak_lft');
				$('.beak_flyout_rgt',beakObj).addClass('beak_rgt');
				$('.beak_corner',beakObj).addClass('beak_corner_lft');
				$('a.closeBeak',beakObj).css({'left':'212px'});
				$('.beak_flyout_middle',beakObj).addClass('beak_filter_mid');
				getLeftPos = config.target.offset().left - beakObj.width()+15;
				if(config.isVFlip){
					$('a.closeBeak',beakObj).css({'top':'96px','right':'18px','left':'auto'});
					getTopPos = config.target.offset().top + config.target.outerHeight(true) + 5;
					$('.beak_flyout_rgt',beakObj).removeClass('beak_rgt').addClass('beak_bottom_lft');
					$('.beak_corner',beakObj).removeClass('beak_corner_lft').addClass('beak_corner_bot_lft');
				}
				if(typeof config.center != "undefined" && config.center) getLeftPos += config.target.outerWidth(true)/2;
			} else {
				$('.beak_flyout_lft',beakObj).removeClass('beak_lft');
				$('.beak_flyout_rgt',beakObj).removeClass('beak_rgt');
				$('.beak_corner',beakObj).removeClass('beak_corner_lft');
				$('a.closeBeak',beakObj).css({'left':'auto'});
				$('.beak_flyout_middle',beakObj).removeClass('beak_filter_mid');
				if(config.beakName == "Q1_BEAK_ACCOUNT_SUMMARY_FOR_REMOVE_ACCOUNT_OPTION"){$('.beak_flyout_middle',beakObj).addClass('wdTwoThreeFive').parent().addClass('acctSummaryMinWid');}else{$('.beak_flyout_middle',beakObj).removeClass('wdTwoThreeFive').parent().removeClass('acctSummaryMinWid');}
				getLeftPos = config.target.offset().left + config.target.width();
				if(config.isVFlip){
					$(beakObj).addClass('beak_corner_lft_top');
					getTopPos += beakObj.outerHeight(true)+config.target.outerHeight(true);
				}
				if(typeof config.center != "undefined" && config.center) getLeftPos -= config.target.outerWidth(true)/2;
			}
			if(typeof config.multiple == "undefined" || !config.multiple) $('.beak_tooltip_flyout_def').hide();
			if(typeof config.beakNewText != "undefined") $('.beakHeading', beakObj).html('<span class="beakNewText">'+config.beakNewText+'</span>'+config.beakHeading);
			else $('.beakHeading', beakObj).html(config.beakHeading);
			$('.beakContent', beakObj).html(config.beakContent);
			beakObj.css({'top':getTopPos,'left':getLeftPos}).show();
			delete myvmware.common.beaksObj[config.beakName];
			myvmware.common.setMessageStatus(config.beakId);

			config.target.data('beak-obj', beakObj);

			$('a.closeBeak,.togNotes', beakObj).live('click',function(){
				$(this).closest('.beak_tooltip_flyout_def').remove();
				config.target.data('beak-obj');
			});
			config.beakLink = (config.beakLink)?config.beakLink:'';
			var beakUrl = (config.beakUrl) ? config.beakUrl : '//download3.vmware.com/microsite/myvmware/dot7/index.html';
			$('a.learnMoreBk', beakObj).die('click').live('click',function(){
				myvmware.common.openHelpPage(beakUrl+config.beakLink,'1060px');
			});
			var doit;
			$(window).resize(function(){
			  clearTimeout(doit);
			  doit = setTimeout(function(){
				getTopPos = (config.target.offset().top + (config.target.outerHeight(true)/2)) - beakObj.outerHeight()
				if(config.isFlip){
					getLeftPos = config.target.offset().left - beakObj.width()+15;
					if(config.isVFlip){
						getTopPos = config.target.offset().top + config.target.outerHeight(true) + 5;
					}
				} else {
					getLeftPos = config.target.offset().left + config.target.width();
					if(config.isVFlip){
						getTopPos += beakObj.outerHeight(true)+(config.target.height()*3/2);
					}
				}	
				beakObj.css({'top':getTopPos,'left':getLeftPos});
			  }, 100);
			});
		}
	},
	showDownloadsMenuBeak: function(){
		myvmware.common.setBeakPosition({
			  beakId: myvmware.common.beaksObj["BEAK_HOME_PAGE_FOR_DOWNLOAD_MENU"]
			, beakName: "BEAK_HOME_PAGE_FOR_DOWNLOAD_MENU"
			, beakNewText: 'New: '
			, beakHeading: 'Download Menu'
			, beakContent: 'Direct access downloads, trials patches and other resources'
			, target: $('#Downloads')
			, multiple: true
			, isVFlip: true
		});
	},
	showHomeBeaks: function(overlayNm,id){
		myvmware.common.showBeaks(overlayNm,id);
		setTimeout(function(){
			myvmware.common.showProfileDropMenuBeak();
		}, 3000);
	},
	showProfileDropMenuBeak: function(){
		myvmware.common.setBeakPosition({
			  beakId: myvmware.common.beaksObj["BEAK_HOME_PAGE_FOR_PROFILE_DROPMENU"]
			, beakName: "BEAK_HOME_PAGE_FOR_PROFILE_DROPMENU"
			, beakNewText: (myvmware.globalVars.bNewTxt) ? myvmware.globalVars.bNewTxt:'New:'
			, beakHeading: ' '
			, beakContent: (myvmware.globalVars.bProfileTxt) ? myvmware.globalVars.bProfileTxt:'Update your <a href="/group/vmware/profile" id="prfUrl">Profile</a> to receive MyVMware email in your preferred language.'
			, target: $('#site-tools .profileDD')
			, multiple: true
			, isFlip: true
			, isVFlip: true
			, noLearnMore: true
		});
	},
	/**
        * Function to calculate width of each folder and set the action button accordingly.Added as part of Wrap and Ellipsis.
        * @params
        * resizeFlag: boolean 
	*/
	adjustFolderNode: function(resizeFlag,serviceFlag){
		var targetElement = "#folderPane ul li span.folderNode";
		if (typeof serviceFlag!="undefined" && serviceFlag) targetElement='#folderPane ul li span.folderNode, #serviceList ul li span.folderNode';
		$(targetElement).each(function(){
			var self = $(this), l = parseInt(self.parent('li').attr('level'),10) ,folderTxtWid, plusWid;
			if(self.find('a.openClose.open').length || resizeFlag) {
				plusWid = 0;
			} else {
				plusWid = ((l-1)*18);
			}
			folderTxtWid = self.outerWidth(true) - (((self.outerWidth(true) - self.width()) + plusWid) + self.find('a.openClose').outerWidth(true) + self.find('input').outerWidth(true) + (self.children('span').last().outerWidth(true) * 2));
			if(self.find('.badge').length){
				folderTxtWid = folderTxtWid - self.find('.badge').outerWidth(true);
			}
			self.find('.folderTxt').css('width',folderTxtWid+'px');
			self.children('span').last().css({'right':'15px'});
		});
	},
	resizeCommon : function (e) {
			myvmware.common.adjustPanes();
			if (typeof oldResizeCommon === 'function' && oldResizeCommon.toString() != arguments.callee.toString()) {oldResizeCommon(); }
	
	},
	selectAllChks: function(tbl,cB){
		var $tbl=tbl.closest(".dataTables_wrapper");
		if ($(".tbl_selectAll", $tbl).length>0){
			$(".tbl_selectAll", $tbl).removeAttr("checked").unbind('click').bind('click',function(){
				var $this = $(this);
				if ($this.is(':checked')) {
					$('input:checkbox:enabled', $tbl).attr('checked', 'checked'); // Check all the items
					$(">tbody>tr",$tbl).not(".more-details, .disabled").addClass("active");
				} else {
					$('input:checkbox:enabled', $tbl).removeAttr('checked'); // Uncheck all the items
					$(">tbody>tr",$tbl).not(".more-details, .disabled").removeClass("active");
				}
				if(cB) cB($tbl);				
			});
			$("tbody>tr input:checkbox", tbl).die("click").live("click", function(e){
				var $this = $(this),$chk=$(this).closest("tbody").find("input:checkbox");
				if ($this.is(':checked') && $chk.filter(":checked").length==$chk.length) {
					$(".tbl_selectAll", $tbl).attr('checked', 'checked');
				} else {
					$(".tbl_selectAll", $tbl).removeAttr('checked');
				}
				if(cB) cB($tbl);
			});
		}
	},
	buildLocaleMsg:function(text,dObj){
		try{
			var re = /\{(.*?)\}/g, matches;
			while ((matches = re.exec(text)) !== null){
				text = text.replace(matches[0],(dObj instanceof Array) ? dObj[matches[1]] : dObj)
			}
		}
		catch(e){
			alert("There is a problem in text or dObj params, details are...\n\n"+e);
			return text;
		}
		return text;
	},
	//BUG-00062520 - Updating the icons on QuickLinks by changing bg-y position if multiline quick links
	updateQLStyles:function(){
		var selector;
		if($("#main .quick-links").length > 0){
			selector = $("#main .quick-links ul li a");
		}
		else{
			selector = $("#main .sub-nav ul li a");
		}
		
		selector.each(function( index ){
			//calculating line-height
			var lineH = parseInt(parseInt($(this).css("font-size"))*1.2);
			var numOfLines = myvmware.common.getNumOfLines($(this),lineH);
			if(numOfLines > 1){
				var increaseBGY = (lineH/2)*(numOfLines -1)
				var bgPosY;
				var bgPos;
				if($.browser.msie){
					bgPosY = parseFloat($(this).css('background-position-y'))
				}
				else{
					bgPos = $(this).css('backgroundPosition').split(" ")
					bgPosY = parseFloat(bgPos[1])
				}
				var newBGPosY = bgPosY + (increaseBGY + 1)
				//if(parseInt($.browser.version) == 7) newBGPosY += .5
				if($.browser.msie){
					$(this).css("background-position-y",newBGPosY+"px");
				}
				else{
					$(this).css("backgroundPosition",bgPos[0]+" "+newBGPosY+"px");
				}
				
			}
		});

	},	
	getNumOfLines:function(jqObj,lh){
		var objHeight = jqObj.height();
		return  parseInt(objHeight/lh);
	},
	ooGetLocaleJSFile: function (fileName,path){

		var updatedFileName;

		if((fileName === "reports.js") && (myvmware.common.getCurrentLocale()==="beta")){
			//This is a specific case of 'oo_my_reports.js' file 
			updatedFileName = "oo_my_"+fileName;
		}else{

			updatedFileName = "oo_"+myvmware.common.getCurrentLocale()+"_"+fileName;
		}       
    	 //VMFModuleLoader.loadJscripts(['/files/include/onlineopinion/v5/'+udpatedFileName]);
		//return udpatedFileName;
		
		var scriptNode = document.createElement('script');
		scriptNode.setAttribute('src',path+updatedFileName);
		document.getElementsByTagName("head")[0].appendChild(scriptNode);
	},
	ooInvokeLocaleSurvey: function (methodName){       
        
        var surveyMethodObject = "oo_"+myvmware.common.getCurrentLocale()+"_"+methodName;
		try
		{
        	vmf.json.txtToObj(surveyMethodObject).show();
       	}
       	catch(e){
       		if(console && console.log){
       			console.log("Function is not available, details are ----- \n"+e)
       		}
       	}
	},
	getCurrentLocale: function(){
		 //fileName
        var locale = $('#localeFromLiferayTheme').text().split("_")
        var currentLocale = (locale[0].toLowerCase() == 'en') ? 'en' : locale[1].toLowerCase();
        //if(currentLocale == "ja") currentLocale = "jp";
        var construct;
        for(var i in myvmware.common.supportedLang.locales){
                        if(myvmware.common.supportedLang.locales[i].lang.toLowerCase() == currentLocale){
                                        construct = currentLocale;
                                        break;
                        }
        }
        construct= ((construct == "en") || (typeof construct == "undefined")) ? "beta" : currentLocale;

        return construct;
	},
	setAutoScrollWidth: function(ullist){
		/*if($(ullist).length > 0){
			$($(ullist)[0]).removeAttr('style');
			var getScrollWidth = parseInt($(ullist).closest('.scroll')[0].scrollWidth);
			if(getScrollWidth > 0 )
				$($(ullist)[0]).width(getScrollWidth);
		}
	},openHelpPage:function(URL){
		   NewWindow = window.open(URL,"_blank","width=695,height=670,resizable=yes,left=100,top=100,screenX=100,screenY=100,toolbar=no, location=no,directories=no,status=no,menubar=no,scrollbars=yes,copyhistory=yes") ;
		   NewWindow.location = URL;
		}
		}*/
	}
}//End of main here
function isIE( version, lessThan ){//Check if the browser is IE
	version = (version==undefined) ? 6 : version;lessThan = (lessThan==undefined) ? false : lessThan;
	if(lessThan){if (($.browser.msie)&&(parseInt($.browser.version)<=version)){return true;}} 
	else {if (($.browser.msie)&&(parseInt($.browser.version)==version)){return true;}}
	return false;
}
;function adjustHtForIE7(){
	myvmware.common.adjustPanes();
	if(typeof(adjustHtForIE7_specific)!="undefined") adjustHtForIE7_specific()
};
var oldResizeCommon = window.onresize;
window.onresize =myvmware.common.resizeCommon;
