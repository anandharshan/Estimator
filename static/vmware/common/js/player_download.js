if (typeof(vmware) == "undefined")  vmware = {};
vmware.dp = {
	// Global variable to hold json for expand
	$mJsonObj: null,
	$jsonDetail:null,
	$vJson:null,
	$osJsonDetail: null,
	$dtJsonDetail: null,
	$dJres: null,
	$oLMjr: null, // Current major version val
	$oLMnr: null,// Current minor version val
	$loadingBig: null,
	$loadingSmall: null,
	$cTab: null, // Current tab id
	$cTabNameForOmniture: null, // create another global variable and use only in omniture
	$hTabVal: null, // Current tab hash val
	$noBinary: false,
	$dPostData: null,
	$pEle: null,
	$tEle: null,
	isTyRiaLinkCallEnabled: true,
	chkTCHit: false,
	onHide: false,	
	map:null,
	tp :null,
	to : null, 
	td : null,
	fLoad: true, 
	vMjr : $('#v_major'),
	vMnr : $('#v_minor'),
	$cDiv: $('#content'),
	btnDom:"<span class=\"btns arrow btn_download\"><span class=\"lt\"></span><button class=\"md\">"+rs.download+"</button><span class=\"rt\"></span></span>",
	email_rg:/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
	mUrl: $('#onLoadFetchPageDetails').val(),
	vUrl: $('#fetchProductVersionDetails').val(),// $('#majorVersion') is coming from hidden field in jsp 
	dUrl: $('#downloadFilesForPlayer').val(),
	sUrl: $('#subscribeForProduct').val(),
	stateUrl:$('#fetchStateBasedOnCountry').val(),
	lFlg :1,
	init: function() {// Initialize player page
		dp = vmware.dp;
		$('body').prepend($('div#div_thk_u'));
		dp.$loadingBig = "<div class=\"loading\"><span class=\"loading_big\">" + rs.loading + "...</span></div>";
		dp.$loadingSmall = "<div class=\"loading\"><span class=\"loading_small\">" + rs.loading + "...</span></div>";
		dp.$cDiv.append(dp.$loadingBig); // Append loading to the main content
		dp.map =  {
			"tab_prod" : {"url":$('#fetchProductBinaryTab').val(),"mmversn":"","tab_cnt":"tab_prod","hasData":0,"sfunc":dp.onPDSuccess,"ffunc":dp.onPDFailure,"nodata":dp.emptyTab,"tabName":"product-download-tab","hval":"product_downloads"},
			"tab_drivers" : {"url":$('#fetchDriversAndToolsTab').val(),"mmversn":"","tab_cnt":"tab_drivers","hasData":0,"sfunc":dp.onDTSuccess($('#tab_drivers')),"ffunc":dp.onDTFailure($('#tab_drivers')),"nodata":dp.emptyTab,"tabName":"drivers-tools-tab","hval":"drivers_tools"},
			"tab_opens" : {"url":$('#fetchOpenSourceTab').val(),"mmversn":"","tab_cnt":"tab_opens","hasData":0,"sfunc":dp.onOSSuccess($('#tab_opens')),"ffunc":dp.onOSFailure($('#tab_opens')),"nodata":dp.emptyTab,"tabName":"open-source-tab","hval":"open_source"}			
		};
		mdl = dp.modal;
		dp.tp = dp.map["tab_prod"];
		dp.td = dp.map["tab_drivers"];
		dp.to = dp.map["tab_opens"];
		
		dp.loadMainContent();
		
		dp.vMjr.change(function() {
			dp.$oLMjr = $(this).val();
			$('div.version_holder select').attr("disabled","disabled");dp.populateDd(dp.vMnr,$vJson.vMjr[this.selectedIndex].vMnr,0,1,1);
			riaLinkmy('downloads : ' + $('#productDisplayName').val() + ' : ' + dp.vMjr.find('option:selected').attr('omniname'));
		}); // loading minor dropdown
		dp.vMnr.change(function() {
			dp.$oLMnr = $(this).val();
			$('div.version_holder select').attr("disabled","disabled");dp.generateURL();
			riaLinkmy('downloads : ' + $('#productDisplayName').val() + ' : ' + dp.vMjr.find('option:selected').attr('omniname') + ' : ' + dp.vMnr.find('option:selected').val());
		});
		dp.isTyRiaLinkCallEnabled = true;
		//dp.tabClicks();
		mdl.init();
		$('#btn_thk_subscribe').die('click').live('click',function(){
			//mdl.validate($('#txt_thku_email'),dp.ss)
			if(!$(this).hasClass('hvaltrue')){
				$('#txt_thku_email').trigger('blur');
				if(!$('#txt_thku_email').hasClass('errbox')){dp.ss();}
			}else{
				dp.ss(1);
			}
			return false;
		});
		//$('#txt_thku_email').die('change').live('change',function(){mdl.validate($(this))});
		$('#div_thk_u .close').die('click').live('click',function(){
			vmf.cookie.write("pgcode",dp.vMnr.val());
			$('#div_thk_u').hide();
			/*var subText;
			if ((!dp.$dJres.loggedIn && vmf.cookie.read("dpPlayer") == "true") || 
					(dp.$dJres.loggedIn && dp.$dJres.subsribedUser)) {
				subText = 'sub';
			} else {
				subText = 'notsub';
			}
			riaLinkmy('downloads : ' + $('#productDisplayName').val() + ' : ' + dp.vMjr.find('option:selected').attr('omniname') + ' : ' + dp.vMnr.find('option:selected').val() + ' : ty : ' + subText + ' : exit');*/
		});
		$('ul#tab_list').undelegate('click').delegate('ul.tabs li','click', function(e){
			var cid = $(this).find('a').attr('custid');
			if(cid == "tab_drivers"){
				dp.$hTabVal = "drivers_tools";
				dp.$cTabNameForOmniture = "tab_drivers"; // create another global variable and use only in omniture
			}else if(cid == "tab_opens"){
				dp.$hTabVal = "open_source";
				dp.$cTabNameForOmniture = "tab_opens";
			}else{
				dp.$hTabVal = "product_downloads";
				dp.$cTabNameForOmniture = "tab_prod";
			}
			dp.generateHash('','',dp.$hTabVal);
			if(dp.chkTCHit && cid == dp.$cTab){dp.hightlightTabs(dp.$cTab);dp.chkTCHit = false;}
			riaLinkmy('downloads : ' + $('#productDisplayName').val() + ' : ' + dp.vMjr.find('option:selected').attr('omniname') + ' : ' + dp.vMnr.find('option:selected').val() + ' : ' +dp.map[dp.$cTabNameForOmniture].tabName);
			e.preventDefault();
            e.stopPropagation();
		});	
		$(window).hashchange( function(){// Alerts every time the hash changes!
			dp.getHashMap();
			dp.hightlightTabs(dp.$cTab);
		  });
	},
	
	loadMainContent: function(){
		var gUrl = "";
		dp.getHashMap();
		if(dp.$oLMjr) gUrl += "&slug="+dp.$oLMjr;
		if(typeof dp.$oLMnr !== "undefined" && dp.$oLMnr) gUrl += "&downloadGroup="+dp.$oLMnr; 
		dp.mUrl += gUrl;
		vmf.ajax.post(dp.mUrl, null, dp.onmSuccess, dp.errormRes); // Json call for main data on loading the page
	},
	onmSuccess: function(res){
		vmf.scEvent =true;
		var jObj = vmf.json.txtToObj(res);
		dp.$mJsonObj = jObj.pageDetails;
		if(dp.$mJsonObj && dp.$mJsonObj.status == "success"){
			
			if(dp.$oLMjr == null) dp.$oLMjr = dp.$mJsonObj.vMjrSlug;
			if(dp.$oLMnr == null) dp.$oLMnr = dp.$mJsonObj.vMnrDlg;
			
			dp.generateHeader(dp.$mJsonObj.breadCrumbHtml,dp.$mJsonObj.headerTitle);
			document.title = rs.download + ' ' + dp.$mJsonObj.pageTitle;
			$('#productDisplayName').val(dp.$mJsonObj.productDisplayName);
			if(typeof dp.$mJsonObj.promoWidgetContent !== "undefined" && dp.$mJsonObj.promoWidgetContent){
				// Show greenbox
				$('section.rightarea div.greenBox-right').removeClass('hidden');
				$('section.rightarea div.greenBox-right').append(dp.$mJsonObj.promoWidgetContent);
			}
			// this is only when we are trying to execute the rialink on page load
			//callBack.addsc({'f':'riaLinkmy','args':['downloads : ' + dp.$mJsonObj.productDisplayName + ' : ' + dp.$mJsonObj.productVersion + ' : ' + dp.$mJsonObj.vMnrDlg]})
			//callBack.execute();
			dp.loadDropBox(); // generate version dropdown through ajax
			
		}else{
			window.location.href = dp.$mJsonObj.redirectUrl;
		}
	},
	errormRes: function(){
	},
	generateHeader: function(bdata,hdata){
		$('ul#breadcrumb').html(bdata);
		$('div.playerHeader>h1').html(hdata);
		$('div#content-header-container').show();
	},
	loadAllJson: function(){// Load all the jsons in onload
		$.each(dp.map,function(i, item){
			item.mmversn ="&minorVersion="+dp.vMnr.find('option:selected').val()+"&majorVersion="+dp.vMjr.find('option:selected').val() ;
			item.hasData = 0;
		});
		dp.$cDiv.find('div.loading').remove();
		$('section.portlet').show();
		$('ul#tab_list').after($(dp.$loadingBig));
		dp.dJsonCall(dp.tp,function(){
			dp.dJsonCall(dp.td,function(){
				dp.dJsonCall(dp.to,function(){
					if(dp.lFlg) {
						var arg = 'downloads : ' + dp.$mJsonObj.productDisplayName + ' : ' + dp.$mJsonObj.productVersion + ' : ' + dp.$mJsonObj.vMnrDlg;
						riaLinkmy(arg)
						dp.lFlg=0;
					};
				})
			})
		});
	},
	getHashMap: function(){
		var hash = decodeURIComponent(window.location.hash.substring(1));
		var hvs = hash.split('|');
		var tArr = ["product_downloads","drivers_tools","open_source"];
		var tv = ($.inArray(hvs[2],tArr)!=-1)? hvs[2] : "product_downloads";
		// Get tab value
		if(tv == "drivers_tools"){dp.$cTab = dp.td.tab_cnt;
		}else if(tv == "open_source"){dp.$cTab = dp.to.tab_cnt;	
		}else{dp.$cTab = dp.tp.tab_cnt;	}
		// set Version
		if(hvs[0] != ""){dp.$oLMjr = hvs[0];}
		if(hvs[1] != ""){dp.$oLMnr = hvs[1];}
		if(hvs[2] != ""){dp.$hTabVal = hvs[2];}
		
	},
	setHash: function(hash){// Set hash val
		//url = url || window.location.href;
		window.location.hash = hash;
	},
	generateHash: function(vma,vmi,tab){
		if(!vma) vma = dp.vMjr.val();
		if(!vmi) vmi = dp.vMnr.val();
		if(!tab) tab = dp.$hTabVal || "product_downloads";
		var hash = vma + '|' + vmi + '|' + tab;
		dp.setHash(hash);
	},
	dJsonCall: function(o,cb){vmf.ajax.post(o.url+o.mmversn, null, o.sfunc, o.ffunc,cb); },// Json call
	onPDSuccess: function(data){// Product download ajax response
		var listJson= vmf.json.txtToObj(data);
		dp.$jsonDetail = listJson.widget;
		if(dp.$jsonDetail && dp.$jsonDetail.error == "nobinaries"){
			dp.$noBinary = true;
			if (dp.fLoad) {if(dp.$cTab==dp.tp.tab_cnt) dp.fLoad=false; dp.tp.nodata(dp.tp.tab_cnt,(dp.$cTab==dp.tp.tab_cnt)?"tab_prod":0,1);}
			else dp.tp.nodata(dp.tp.tab_cnt,(dp.$cTab==dp.tp.tab_cnt)?"tab_prod":0);
			return;
		}
		if(dp.$cTab === dp.tp.tab_cnt){
			dp.$noBinary = false;
			//dp.hightlightTabs(dp.tp.tab_cnt);
			if (dp.fLoad) {dp.hightlightTabs(dp.tp.tab_cnt);dp.fLoad=false;}
			else dp.generateHash(dp.vMjr.val(),dp.vMnr.val(),dp.$hTabVal);
			$('#tab_list li:eq(0)').show()
		}
	},
	onPDFailure: function(){// PD failure
		//console.log('failure')
	},
	onDTSuccess: function(pID){ // Open source & Drivers and tools success
		return function(data){
			var dtJson= vmf.json.txtToObj(data);
			dp.$dtJsonDetail = dtJson.dtosList; // store json to global variable
			if(dp.$dtJsonDetail && !dp.$dtJsonDetail.length){ // Check whether the response is empty
				if (dp.fLoad) {if(dp.$cTab==dp.td.tab_cnt) dp.fLoad=false; dp.tp.nodata(dp.td.tab_cnt,(dp.$cTab==dp.td.tab_cnt)?"tab_prod":0,1);}
				else dp.tp.nodata(dp.td.tab_cnt,(dp.$cTab==dp.td.tab_cnt)?"tab_prod":0);
				return;
			}
			if(dp.$cTab === dp.td.tab_cnt){
//				dp.hightlightTabs(dp.td.tab_cnt);
				//dp.getHashMap();
				if (dp.fLoad) {dp.hightlightTabs(dp.td.tab_cnt);dp.fLoad=false;}
				else dp.generateHash(dp.vMjr.val(),dp.vMnr.val(),dp.$hTabVal);
			}
			$('a[custid="'+dp.td.tab_cnt+'"]').parent('li').show();
			$('#tab_list li:eq(0)').show()
		};
	},
	onDTFailure: function(){ // Drivers tab failure
		return function(){
			//console.log('Drivers Tools Failure');
		};
	},
	onOSSuccess: function(pID){ // Open source & Drivers and tools success
		return function(data){
			var osJson= vmf.json.txtToObj(data);
			dp.$osJsonDetail = osJson.dtosList; // store json to global variable
			if(dp.$osJsonDetail && !dp.$osJsonDetail.length){
				if (dp.fLoad) {if(dp.$cTab==dp.to.tab_cnt) dp.fLoad=false; dp.tp.nodata(dp.to.tab_cnt,(dp.$cTab==dp.to.tab_cnt)?"tab_prod":0,1);}
				else dp.tp.nodata(dp.to.tab_cnt,(dp.$cTab==dp.to.tab_cnt)?"tab_prod":0);
				return;
			}
			if(dp.$cTab === dp.to.tab_cnt){
				//dp.hightlightTabs(dp.to.tab_cnt);
				if (dp.fLoad) {dp.hightlightTabs(dp.to.tab_cnt);dp.fLoad=false;}
				else dp.generateHash(dp.vMjr.val(),dp.vMnr.val(),dp.$hTabVal);
			}
			$('a[custid="'+dp.to.tab_cnt+'"]').parent('li').show();
			$('#tab_list li:eq(0)').show()
		};
	},
	onOSFailure: function(){// Opensource Failure
		return function(){
			//console.log('Open source Failure');
		};
	},
	emptyTab: function(id,ct,flg){
		if(id !=dp.tp.tab_cnt){ $('a[custId='+id+']').parent('li').hide();}
		if(ct){
			//dp.hightlightTabs(ct);
			dp.$cTab = id;
			dp.$hTabVal = dp.map[ct].hVal;
			dp.generateHash(dp.vMjr.val(),dp.vMnr.val(),dp.$hTabVal);
			if(flg) dp.hightlightTabs(ct);
		}
		if($('#tab_list li:visible').length ==1 ){
				$('#tab_list li').hide();
			}
	},
	hightlightTabs: function(custId){
		$('ul#tab_list li').find('a').removeClass('active').filter('a[custid="'+custId+'"]').addClass('active');
		$('.tabbed_area div.tabContent').hide();
		$('div.version_holder select').removeAttr("disabled");
		dp.$cTab = custId;
		if(custId == 'tab_prod') {
			if(!dp.tp.hasData){
				if(dp.$noBinary){
					riaLinkmy('downloads : ' + $('#productDisplayName').val() + ' : ' + dp.vMjr.find('option:selected').attr('omniname') + ' : ' + dp.vMnr.find('option:selected').val() + ' : error : no binaries');					
					var htm = '<h2 class="nopading orange">' + rs.noBinaries + '</h2>';
					$('div.tabbed_area').find("div.loading").remove();
					$('section#PDcolumn').append(htm).parents('div.tabContent').addClass('hasContent').show();
					$('div#rt_abtus').hide();
					dp.tp.hasData = 1;
				}else{
					//$('section#PDcolumn').html(dp.$loadingBig);
					//$('div#rt_abtus').html(dp.$loadingSmall);
					dp.ontbSuccess(dp.$jsonDetail);
					dp.tp.hasData = 1;
				}
			}else $('#'+custId).show();
		}else if(custId == 'tab_drivers'){
			if(!dp.td.hasData){
				dp.onosSuccess($('#tab_drivers'),dp.$dtJsonDetail);
				dp.td.hasData = 1;
			}else $('#'+custId).show();
		}else if(custId == 'tab_opens'){
			if(!dp.to.hasData){
				dp.onosSuccess($('#tab_opens'),dp.$osJsonDetail);
				dp.to.hasData = 1;
			}else $('#'+custId).show();
		}
	},
	// Load the selected tabs details via ajax
	getBtn: function(dT){
		switch(dT){
			case "1": return dp.btnDom+"<a href=\"#\" class=\"link_manual clear\">" + rs.downloadManager +"</a>";
			case "2": return dp.btnDom;
			default: return dp.btnDom+"<a href=\"#\" class=\"link_manual clear\">" + rs.downloadManager +"</a>";
		}
	},
	ontbSuccess: function(listJson){//Producr ajax call success
		// Json string to obj
		var jData=[];
		//$jsonDetail = listJson.widget; // Assign to global variable
		if (listJson.proDet.length>0){// Check the length of products
			var ulList=$("<ul id=\"prod_list\" class=\"downloadlist_wrapper\"></ul>");
			var pcnt = 1;
			$.each(listJson.proDet, function(i,item){// Loop through products and create main product line
				jData.push("<li class=\"download_lists\"><div class=\"list_header_wrapper clearfix\"><div class=\"pro_name_container\">"+item.pName+"<br/><span class=\"pro_type_det\">("+item.pType+" | "+item.pSize+")</span><div class=\"openCloseSelect\"><a href=\"#\" class=\"openClose\" battr='"+pcnt+"'>" + rs.showDetails + "</a></div></div><div class=\"pro_down_container\">"+dp.getBtn(item.pDownload)+"</div></div></li>");
				ulList.append($(jData.join('')).data("dVars",item));
				jData = [];
				pcnt++;
			});
			$("section#PDcolumn").append(ulList).parents('div.tabContent').addClass('hasContent').show().parents('div.tabbed_area').find("div.loading").remove();
			vmware.dp.bindEvents(listJson); //bind click event
			vmware.dp.renderAboutHtml(listJson);
		}
	},	
	bindEvents: function(listJson){// Bind event for epand collapse buttons
		$('.PDcolumn ul#prod_list a.openClose').die('click').live('click', function(e){
			var ci = $('li.download_lists').index($(this).parents('li.download_lists'));// Get clicked index
			var battr = $(this).attr('battr');
			if($(this).hasClass('open')){
				$(this).removeClass("open").text(rs.showDetails).parents('li.download_lists').children('div.more_details').toggle('slow');
			}else{
//				console.log($(this).parents('li.download_lists').contents().find('div.more_details').length);
				if($(this).parents('li.download_lists').hasClass('hasData')){
					$(this).addClass("open").text(rs.hideDetails).parents('li.download_lists').children('div.more_details').toggle('slow');
				}else{
					var arrDet = listJson.proDet[ci].pDetails, mData=[];
					mData.push("<div class=\"more_details\"><ul class=\"more_details_list\">");
					$.each(arrDet, function(j, detInfo){
						if($.type(detInfo) == 'object'){
							var epVal = "";
							$.each(detInfo, function(k, arrVal){
								if (rs[k]) {
									epVal += rs[k] + ": "+ arrVal + "<br />";
								} else {
									epVal += k + ": "+ arrVal + "<br />";
								}
							});
						}else{epVal = detInfo.replace('<BR />','').replace('<b>','');}
						mData.push("<li><label class=\"lbl_caps\">" + rs[j] + "</label><span class=\"det_info\">"+ epVal +"</span></li>");
					});
					mData.push("</ul></div>");
					$(this).parents('li.download_lists').append(mData.join(''));
					$(this).addClass("open").text(rs.hideDetails).parents('li.download_lists').addClass('hasData').children('div.more_details').toggle('slow');
				}
			}
			//riaLinkmy('downloads : ' + dp.vMnr.find('option:selected').val() + ' : bin'+battr+' : ' + ($(this).hasClass('open') ? 'show' : 'hide'));
			e.preventDefault();
            e.stopPropagation();
        });
		$('span.btn_download,a.link_manual').unbind('click').bind('click',function(e){
			if(!$(this).hasClass('disabled')){
				$(this).addClass('disabled');// BUG-00039291 fix
				var tId = listJson.tagId, pID = listJson.productId, dgCode = listJson.downloadGroupCode,forPd=true;
				var data = $(this).closest('li').data('dVars');
				var pdfId = data.pDownloadFileId, psParam = data.pSecureParam, uuId = data.uuid;
				if($(this).hasClass('btn_download')){
					dp.chkErrorDownload(this,this,forPd,tId,pID,dgCode,pdfId,psParam, '',uuId);
				}else{
					dp.chkErrorDownload(this,this,forPd,tId,pID,dgCode,pdfId,psParam, 'dlm',uuId);
				}
			}
			e.preventDefault();
            e.stopPropagation();
		});
	},
	renderAboutHtml: function(jD){// Render HTML for right hand side
		$abDet = jD.abDet;
		var aFlag = 0
		$html = "";
		$html += "<h3>" + rs.aboutThisProduct + "</h3>";
		if($abDet.aDesc!=null){
			$html += "<h4>" + rs.description + "</h4>";
			$html += "<p>"+$abDet.aDesc.txt+"</p>";
			aFlag=1;
		}
		if($abDet.aDoc){
			$html += "<h4>" + rs.documentation + "</h4>";
			$html += $abDet.aDoc.content;
			aFlag=1;
		}
		if($abDet.anote!=null){$html += "<h4>" + rs.notes + "</h4><p>"+$abDet.anote.txt+"</p>"; aFlag=1;}
		if($abDet.asup!=null){$html += "<h4>" + rs.osSupport + "</h4><p>"+$abDet.asup.txt+"</p>"; aFlag=1;}
		if($abDet.alan!=null){$html += "<h4>" + rs.language + "</h4><p>"+$abDet.alan.txt+"</p>"; aFlag=1;}
		if($abDet.awork!=null){
			$html += "<h4>" + rs.worksWith + "</h4>";
			$html += "<p>"+$abDet.awork.content;
			$html += "</p>";
			 aFlag=1;
		}
		if(aFlag){
			$('div#rt_abtus').html($html).show();
		}
		else	$('div#rt_abtus').hide();
		// Show greenbox
		//$('section.rightarea div.greenBox-right').removeClass('hidden');
	},
	loadDropBox: function(){ // function to make ajax call for getting json for version dropdowns. only happens on page refresh
		vmf.ajax.post(dp.vUrl+'&slug='+dp.$oLMjr+'&downloadGroup='+dp.$oLMnr, null, dp.onvSuccess, dp.errorvRes); // Json call
	},
	onvSuccess: function(data){// On success ajax call for version list
		$vJson = vmf.json.txtToObj(data);		// Json string to obj
		dp.populateDd(dp.vMjr,$vJson.vMjr,function(){ 
			var j = $vJson.vMjr[$('#v_major option:selected').index()].vMnr;
			dp.populateDd(dp.vMnr,j,0,1); //Load Minor dropdown
		})
	},
	populateDd:function(o,j,cbs,flg,vcflg){
		vcflg=vcflg || 0;
		o.html('');
		$.each(j, function(i, obj){
			if(i==0){
				o.append($('<option></option>').val(obj.url).html(obj.dN+' ('+rs.latest+')').attr('omniname',obj.dN));
			}else{
				o.append($('<option></option>').val(obj.url).html(obj.dN).attr('omniname',obj.dN));
			}
		});
		if(dp.$oLMjr != ""){
			$('#v_major').val(dp.$oLMjr);
		}

		if(cbs) cbs(); // Loding minor version dropdown
		if(flg && dp.$oLMnr) {
			if(dp.$oLMnr != ""){
				if(vcflg) $('#v_minor')[0].selectedIndex = 0;
				else $('#v_minor').val(dp.$oLMnr);dp.$oLMnr = "";				
				dp.generateURL();
			}
		}else if(flg) {
			dp.generateURL();
			
		} //flg is to check whether URL prepartion is true or false;
	},
	generateURL:function(){
		$.each(dp.map,function(i, item){
			item.hasData = 0;
			$('#'+item.tab_cnt).find('section:first').html('');
		});
		$('section.portlet>div#tab_tradeBeam').remove();
		$('div#tabbed_box_1').show();
		
		dp.loadAllJson();
		dp.isTyRiaLinkCallEnabled = true;
	},
	onosSuccess: function(pId,osJson){ // Open source tab success ajax call
				var osSection = $('.OScolumn_sec',pId);
				var ulList=$("<ul id=\"os_dglist_ul\"></ul>");		// Create UL element
				var dgMh = $("<div class=\"list_header_wrapper clearfix\"><h2 class=\"pro_name_container\"></h2><div class=\"openCloseSelect dg_group_showhide\"><a class=\"openClose\" href=\"#\" >" + rs.showDownloadGroups + "</a></div></div>");
				var catattrcnt = 1;
				$.each(osJson, function(i,item){
					var liOs = $("<li class=\"os_dglist_li\"></li>");
					if(item.name == "default"){
						$.each(osJson[i].dtOsDetails, function(j, oitem){
							var liOs2 = $("<li class=\"os_dglist_li\"></li>");
							dgMh.find('h2.pro_name_container').text(oitem.name);
							dgMh.find('div.openCloseSelect a.openClose').addClass('gpOther'); //Added class to differentiate default download
							dgMh.find('div.openCloseSelect a.openClose').attr('dlgCode', ((typeof oitem.downloadGroupCode!='undefined' && oitem.downloadGroupCode!=null) ? oitem.downloadGroupCode : oitem.tagName));
							liOs2.append(dgMh.clone()).data("jsonS",oitem);
							ulList.append(liOs2);
						});
					}else{
						dgMh.find('h2.pro_name_container').text(item.name);
						dgMh.find('div.openCloseSelect a.openClose').removeClass('gpOther'); //Removing gpOther from cloned object
						dgMh.find('div.openCloseSelect a.openClose').attr('catattrcnt', catattrcnt);
						catattrcnt++;
						liOs.append(dgMh.clone());
						ulList.append(liOs);
					}
				});
				osSection.append(ulList).parents('div.tabbed_area').find("div.loading").remove();
				$(pId).show();
				vmware.dp.bindEventsRoot(pId,osJson,function(){
					if(osJson.length==1  && osJson[0].dtOsDetails.length==1){
						var elem = $('ul#os_dglist_ul div.dg_group_showhide a.openClose',pId);//Second level node
						elem.trigger('click');
						if(!elem.hasClass('gpOther')){
							$('ul.ul_dgDetails div.dg_details_showhide a.openClose',pId).trigger('click');
						}	
					}
				});			
	},
	bindEventsRoot: function(pId,osJson,cb){ // attach event for show DG and generate html
		$('ul#os_dglist_ul div.dg_group_showhide a.openClose',pId).die('click').live('click', function(e){
			if($(this).hasClass('gpOther'))
				vmware.dp.generateLeafNodeJson(this,pId); //generate Leaf node
			else
				vmware.dp.generateOSRootHtml(this,pId,osJson); //Generate second level
			e.preventDefault();
            e.stopPropagation();
		});
		//The below event is to generate leaf node
		$('ul.ul_dgDetails div.dg_details_showhide a.openClose',pId).die('click').live('click', function(e){
			vmware.dp.generateLeafNodeJson(this,pId); //generate Leaf node
			e.preventDefault();
            e.stopPropagation();
		});
		cb();
	},
	generateOSRootHtml: function(elem,pId,osJson){
		var ci = $('li.os_dglist_li',pId).index($(elem).parents('li.os_dglist_li'));// Get clicked index
		if($(elem).hasClass('open')){
			$(elem).removeClass("open").text(rs.showDownloadGroups).closest('li').find('div.dgDetails').hide();
		}else{
			if($(elem).hasClass('hasdata')){
				$(elem).addClass("open").text(rs.hideDownloadGroups).closest('li').find('div.dgDetails').show();
			}else{
				var chJson = osJson[ci].dtOsDetails;// Get child node ci is index of the clicked element
				if(chJson && chJson.length){
					var dgDet = $("<div class=\"dgDetails clearfix\"><ul class=\"ul_dgDetails\"></ul></div>");
					var dgCh = $("<div class=\"list_header_wrapper\"><h3>VMware Workstation 8.0.4 and Player 4.0.4 Open Source</h3><div class=\"openCloseSelect dg_details_showhide\"><a class=\"openClose\" href=\"#\">" + rs.showDownloads + "</a></div></div>");
					$.each(chJson, function(i,chitem){
						var liOsCh = $("<li class=\"li_dglist\"></li>");
						dgCh.find('h3').text(chitem.name);
						dgCh.find('a.openClose').attr('dlgCode', ((typeof chitem.downloadGroupCode!='undefined' && chitem.downloadGroupCode!=null)?chitem.downloadGroupCode:chitem.tagName));
						liOsCh.append(dgCh.clone()).data("jsonS",chitem);
						dgDet.find('ul.ul_dgDetails').append(liOsCh);
					});
					$(elem).addClass('hasdata').parents('li').append(dgDet);
					$(elem).addClass("open").text(rs.hideDownloadGroups);
				}
			}
		}
		//riaLinkmy('downloads : ' + dp.vMnr.find('option:selected').val() + ' : ' + (dp.$cTabNameForOmniture == 'tab_opens' ? 'os' : 'dt') + ' : cat' + $(elem).attr('catattrcnt') + ' : ' + ($(elem).hasClass('open') ? 'show' : 'hide'));
	},
	generateLeafNodeJson: function(elem,pId){
		var tarElem = $(elem).hasClass('gpOther')? 'li.os_dglist_li' : 'li.li_dglist';
		if($(elem).hasClass('open')){
			$(elem).removeClass('open').text(rs.showDownloads).parents(tarElem).find('div.more_details').toggle('slow');
		}else{
			if($(elem).hasClass('hasdata')){
				$(elem).addClass('open').text(rs.hideDownloads).parents(tarElem).find('div.more_details').toggle('slow');
			}else{
				var jsonobj = $(elem).closest(tarElem).data('jsonS');
				vmware.dp.generateOSplusleafHtml(jsonobj,elem,tarElem,pId);
				$(elem).addClass("open").text(rs.hideDownloads);
			}
		}
		//riaLinkmy('downloads : ' + dp.vMnr.find('option:selected').val() + ' : ' + $(elem).attr('dlgcode') + ' : ' + ($(elem).hasClass('open') ? 'show' : 'hide'));
	},	
	generateOSplusleafHtml: function(json,le,tElem,pId){
		var leafJson = json,mdl = [];// Get child node ci is index of the clicked element
		var dgBiDet = $("<div class=\"more_details dg_more clearfix\"></div>"), dgBiMai = $("<div class=\"column dg_binary_det\"></div>"), dgBiAbt = $("<div class=\"column dg_binary_abt\">" + rs.aboutThisProduct + "</div>"), dgDetUl = $("<ul class=\"binarydetails_ul clearfix\"></ul>");					
		var dgmUl = $("<ul class=\"more_details_list\"></ul>"), bd_htm = [],bdabt_htm = [];
		var flg = 0
		if(leafJson && !$.isEmptyObject(leafJson)){
			// Create about html
			bdabt_htm.push("<h3>" + rs.aboutThisProduct + "</h3>");
			if(typeof leafJson.documentation != "undefined" && leafJson.documentation != null && leafJson.documentation != "null"){
				bdabt_htm.push("<h4>" + rs.documentation + "</h4>"+ leafJson.documentation);flg=1;
			}
			if(typeof leafJson.ossupport != "undefined" && leafJson.ossupport != null && leafJson.ossupport != "null"){
				bdabt_htm.push("<h4>" + rs.osSupport + "</h4><p>"+leafJson.ossupport+"</p>");flg=1;
			}
			if(typeof leafJson.language != "undefined" && leafJson.language != null && leafJson.language != "null"){
				bdabt_htm.push("<h4>" + rs.language + "</h4><p>"+leafJson.language+"</p>");flg=1;
			}
			if(typeof leafJson.compatability != "undefined" && leafJson.compatability != null && leafJson.compatability != "null"){
				bdabt_htm.push("<h4>" + rs.worksWith + "</h4><p>"+leafJson.compatability+"</p>");flg=1;
			}
			dgBiAbt.html(bdabt_htm.join(''));
			
			if(leafJson.description && leafJson.description!='null'){
				mdl.push("<li><label class=\"lbl_caps\">" + rs.description + "</label>"+leafJson.description+"</li>");
			 }
			 if(leafJson.notes && leafJson.notes!='null'){
				 mdl.push("<li><label class=\"lbl_caps\">" + rs.notes + "</label>"+leafJson.notes+"</li>");
			 }
			 dgmUl.html(mdl.join(''));// Put the lis in more_details_list
			 dgBiMai.html(dgmUl); //put the first part (ul to dg_binary_det)
			 dgBiDet.append(dgBiMai);
			 var dFJson = leafJson.downloadFiles;
			 var btnHtml = '';
			 if(dFJson && dFJson.length){
				$.each(dFJson, function(i,dfitem){
					bd_htm.push("<li><div class=\"bdCleft\"><h4>"+dfitem.name+" <br/><span>("+dfitem.type+". | "+dfitem.fileSize+")</span></h4><ul class=\"more_details_list noborder\">");
					if(dfitem.fileName){
						bd_htm.push("<li><label class=\"lbl_caps\">" + rs.fileName + "</label>"+dfitem.fileName+"</li>");
					}
					if(dfitem.build){
						bd_htm.push("<li><label class=\"lbl_caps\">" + rs.build + "</label>"+dfitem.build+"</li>");
					}
					if(dfitem.releaseDate){
						bd_htm.push("<li><label class=\"lbl_caps\">" + rs.releaseDate + "</label>"+dfitem.releaseDate+"</li>");
					}
					if(dfitem.checksum){
						bd_htm.push("<li><label class=\"lbl_caps\">" + rs.checksum + "</label><span class=\"det_info\">");
						$.each(dfitem.checksum, function(j,chitem){
							bd_htm.push(rs[j] + " : " + chitem + " <br />");										
						});
						bd_htm.push("</span></li>");
					}
					
					bd_htm.push("</ul></div>");
					bd_htm.push("<div class=\"bdCright\">");
					//bd_htm.push("<a class=\"btn_download\" title=\"Manually download\" href=\"#\">" + rs.download + "</a>");
					bd_htm.push(dp.btnDom);
					if(dfitem.downloadManager)	bd_htm.push("<a class=\"link_manual clear\" href=\"#\">" + rs.downloadManager + "</a>");
					bd_htm.push("</div></li>");
					dgDetUl.append($(bd_htm.join('')).data("osDvars",dfitem));
					bd_htm = [];
				});
			 }
			 //dgDetUl.html(bd_htm.join(''));
			 if((typeof leafJson.description === "undefined" || leafJson.description === null) && (typeof leafJson.notes === "undefined" || leafJson.notes === null)) dgDetUl.find('li:first').addClass('nopad_border');
			 dgBiMai.append(dgDetUl);
			 if(flg)	dgBiDet.append(dgBiAbt);
			 var nE = $(le).addClass('open hasdata').parents(tElem,pId).append(dgBiDet).find('div.more_details').toggle('slow');
			 
			 if(tElem == 'li.os_dglist_li') nE.addClass('dg_others');
			 dp.bindDTOSBtnEvents();
		}else{ alert('There is no Downloads!');}
	},
	bindDTOSBtnEvents: function(){
		$('div.bdCright>span.btn_download,div.bdCright>a.link_manual').die('click').live('click',function(e){
			if(!$(this).hasClass('disabled')){
				var cData = $(this).closest('li').data('osDvars');
				//var pdata = $(this).closest('li.os_dglist_li').data('jsonS');
				var pdfId = cData.fileId, psParam = cData.secureParam, uuId=cData.uuid;
				$(this).addClass('disabled');// BUG-00039291 fix
				if((typeof cData.secureParam !== "undefined" || cData.secureParam != null)){
					var pdata = ($(this).closest('li.li_dglist').length)?$(this).closest('li.li_dglist').data('jsonS'):$(this).closest('li.os_dglist_li').data('jsonS');
					var tId = pdata.tagId, psID = pdata.productId, dgCode = pdata.downloadGroupCode;
					if($(this).hasClass('btn_download')){
						dp.chkErrorDownload(this,this,'',tId,psID,dgCode,pdfId,psParam,'',uuId);
					}else{
						dp.chkErrorDownload(this,this,'',tId,psID,dgCode,pdfId,psParam,'dlm',uuId);
					}
				}else{
					var pOsdata = ($(this).closest('li.li_dglist').length)?$(this).closest('li.li_dglist').data('jsonS'):$(this).closest('li.os_dglist_li').data('jsonS');
									
					var dId = cData.fileId, dtId = pOsdata.tagId, posID = pOsdata.productId;
					
					if($(this).hasClass('btn_download')){
						dp.chkErrorDownload(this,this,'',dtId,posID,'',dId,'','',uuId);
					}else{
						dp.chkErrorDownload(this,this,'',dtId,posID,'',dId,'','dlm',uuId);
					}
				}
			}
			//dp.chkErrorDownload(this,e.target,'',dtId,pID,dgCode,pdfId,psParam);
			e.preventDefault();
            e.stopPropagation();
		});
	},
	chkErrorDownload: function(elem,tElm,forPd,tId,pID,dgCode,pdfId,psParam,dlm,uuId){ // Check the download messages
		//dp.dUrl += '?downloadFileId='+downloadFileId+'&vmware=downloadBinary&baseStr='+baseStr+'&hashKey='+hashKey+'&productId='+productId+'&tagId='+tagId;
		//downloadGroupCode,downloadFileId,baseStr,hashKey, isEulaAccepted,tagId,productId
		var postData = {'downloadFileId':pdfId,'vmware':'downloadBinary','baseStr':dlm,'hashKey':psParam,'productId':pID,'tagId':tId, 'downloadGroupCode':dgCode, 'uuId':uuId}
		dp.$dPostData = postData;
		dp.$pEle = elem;
		dp.$tEle = tElm;	
		$.ajax({
			type: 'post',async:false,url: dp.dUrl,data: dp.$dPostData,
			success:function(obj){dp.chkErrOnSuccess(obj,elem,tElm)},
			error:function(){ dp.chkErrOnFailure()}
		});
		//vmf.ajax.post(dp.dUrl, dp.$dPostData, dp.chkErrOnSuccess(dp.$pEle,dp.$tEle), dp.chkErrOnFailure); 
	},
	doDownload:function(er){
		var isdlm = er.dlm;
		var downloadURL = er.downloadURL;
		var omnitureText = 'downloads : ' + $('#productDisplayName').val() + ' : ' + dp.vMjr.find('option:selected').attr('omniname') + ' : ' + dp.vMnr.find('option:selected').val();
		if(isdlm) {
			trackPlayerDownloads(omnitureText, "DLM", er.downloadFileType, er.downloadFileName);
			window.open(downloadURL,'Download_File','height=250,width=350,scrollbars=no,resizable=yes' );
			//return false;
		} else {
			/* replacing code with iframewindow.location.href=downloadURL; */
			if (!$("#downloadFrame").length)
              $('<iframe id="downloadFrame" name="downloadFrame" style="width:0px;height:0px;font-size:0">').appendTo('body');
			$("#downloadFrame").attr("src",downloadURL);
			/*var subText;
			if ((!dp.$dJres.loggedIn && vmf.cookie.read("dpPlayer") == "true") || 
					(dp.$dJres.loggedIn && dp.$dJres.subsribedUser)) {
				subText = 'sub';
			} else {
				subText = 'notsub';
			}
			if (dp.isTyRiaLinkCallEnabled) {
				riaLinkmy('downloads : ' + $('#productDisplayName').val() + ' : ' + dp.vMjr.find('option:selected').attr('omniname') + ' : ' + dp.vMnr.find('option:selected').val() + ' : ty : ' + subText);
				dp.isTyRiaLinkCallEnabled = false;
			}*/
			trackPlayerDownloads(omnitureText, "manual", er.downloadFileType, er.downloadFileName);
			//return false;
		}
	},
	chkErrOnSuccess: function(data,elem,tElm,frmModal,idObj){ // json response Success
		//return function(data){
			var ej= vmf.json.txtToObj(data);
			dp.$dJres = ej.dResponseList;
			var ck_dlgCode=vmf.cookie.read("pgcode");			
			if($("#tab_tradeBeam",$('div.tabbed_area')).length) $("#tab_tradeBeam",$('div.tabbed_area')).remove();
						
			if(dp.$dJres != ""){// Show the success message
				if(frmModal){
					// && dp.$dJres.errorType.usaddressValidationError
					if(typeof dp.$dJres.errorType != 'undefined' && dp.$dJres.errorType.usaddressValidationError){
						$('.tbError',idObj).show(function(){$(this).html(dp.$dJres.errorType.message)});
						$('#city, #state, #pc').each(function(obj) {
							var telm = $(this);
							var mp = mdl.map[telm.attr('id')];
							if (mp && !telm.attr("disabled")) {
								telm.addClass('errbox').attr("placeholder", mp.ph);
							}
						});
						return false;
					}					
				}
				if(dp.$dJres.displayPopUp){
					var gArr = ['cn','zh','jp','ja','kr','ko'];
					if($.inArray(dp.$dJres.user.userLocale, gArr) != -1){ 
						var idObj = $('#needmoreinfo_glob'), idx = "needmoreinfo_glob", btn = "#btn_nmi_continue";
					}else{
						var idObj = $('#needmoreinfo'), idx = "needmoreinfo", btn = "#btn_nmi_continue";
					}
					if(dp.$dJres.error){
						if(dp.$dJres.errorType.tradeBeamError){
							dp.showTradeBeam();
						}
					}
					$(elem).removeClass('disabled');
					vmf.modal.show(idx, { checkPosition: true ,focus:false,closeHTML: '<a class="modalCloseImg blue_cross" title="'+rs.close+'"></a>',
						onShow: function (dialog) {
							mdl.generateModalPopup(idx,idObj,btn);
						},
						onClose: function (dialog) {dp.makeRialLinkCall();$.modal.close();}	
					}); 
					return false;
				}
				dp.onHide = true;
				if(frmModal && typeof dp.$dJres.errorType != 'undefined'){
						if(dp.$dJres.errorType.usaddressValidationError){
							$(elem).removeClass('disabled');				
							$('.tbError',idObj).show(function(){$(this).html(dp.$dJres.errorType.message)});
							return false; 		
							}
				}
				vmf.modal.hide();
				dp.onHide = false;
				if(!dp.$dJres.error && !dp.$dJres.loggedIn){
					if(ck_dlgCode != 'undefined' && ck_dlgCode !=dp.vMnr.val()){
						dp.showThankYou('body',elem,tElm,vmf.cookie.read("dpPlayer"),'','',dp.$dJres.productId);
					}
					$(elem).removeClass('disabled');
					dp.doDownload(dp.$dJres);
				}else{
					if(dp.$dJres.error){
						if(dp.$dJres.errorType.tradeBeamError || dp.$dJres.errorType.isSubscriptionError || dp.$dJres.errorType.isGenericError){
							dp.showTradeBeam();
							$(elem).removeClass('disabled');
							return;
						}
					}else{
						var uname = dp.$dJres.user.firstName +' '+dp.$dJres.user.lastName;
						if(ck_dlgCode != 'undefined' && ck_dlgCode !=dp.vMnr.val()){
							if(!dp.$dJres.subsribedUser){
								dp.showThankYou('body',elem,tElm,dp.$dJres.subsribedUser,uname,dp.$dJres.user.email, dp.$dJres.productId);
							}else{
								dp.showThankYou('body',elem,tElm,dp.$dJres.subsribedUser,'','','');
							}
						}
						dp.doDownload(dp.$dJres);
					}
				}
				$(elem).removeClass('disabled');

				dp.hightlightTabs(dp.$cTab);
				// dp.doDownload(dp.$dJres); -- Commented as doDownload is being called twice
			}else{
				
			}
		//}
	},
	showTradeBeam: function(){ // Show tradebeam
		var _tradeBeamHtm = $("#tab_tradeBeam");
		_tradeBeamHtm.find('div.detail-section').html(dp.$dJres.errorType.message);
		$('div.tabContent').hide().parents('div.tabbed_area').find('ul#tab_list li a').removeClass('active');
		$('div.tabbed_area').append(_tradeBeamHtm.clone().show());
		var errorTypeText;
		if (dp.$dJres.errorType.tradeBeamError) {
			errorTypeText = 'tradebeam';
		} else {
			errorTypeText = 'generic error';
		}
		dp.chkTCHit = true;
		
		riaLinkmy('downloads : ' + $('#productDisplayName').val() + ' : ' + dp.vMjr.find('option:selected').attr('omniname') + ' : ' + dp.vMnr.find('option:selected').val() + ' : error : ' + errorTypeText);
		
	},
	showThankYou: function(appElm,elem,tElm,subscribe,uname,email, productId){
		var tInn = '', tHtm = '', dId = 'div#div_thk_u';
		
		//$(dId).find('span.close').text(rs.close);
		$(dId).find('h2#msg').text(rs.thankyouh2);
		var p1Htm = rs.thankyoumessage;
		$(dId).find('p#in_desc').html(p1Htm);
		$(dId).find('p#subscribe').html('');
		if(!subscribe) {
			tHtm += '<label class="heavy">'+rs.productNewsPromo+': ';
			if(email != ""){				
				tHtm += '<span id="email_container"><span id="thku_email_id" class="txt_class">'+email+' </span><input id="txt_thku_email" type="hidden" value="'+email+'" productId="'+productId+'"><button id="btn_thk_subscribe" type="button" class="hvaltrue">'+rs.subscribe+'</button></span>';				
			}else{
				tHtm += '<span id="email_container"><input id="txt_thku_email" type="text" productId="'+productId+'" placeholder="'+rs.emailAddress+'"><button id="btn_thk_subscribe" type="button">'+rs.subscribe+'</button></span>';
			}
			tHtm += '</label>';
			$(dId).find('p#subscribe').html(tHtm);
		}
		var m = mdl.map['txt_thku_email'];		
		if (!Modernizr.input.placeholder) {
			$('#txt_thku_email').val(m.ph).addClass('placeholder');
		}
		$(dId).show();
		//var hT = $(dId).outerHeight(true);
		if($.browser.msie){
			if($.browser.version == "7.0"){ $(dId).height(parseInt($(dId).outerHeight(true) - 8));}
			else if($.browser.version == "8.0"){ $(dId).height(parseInt($(dId).outerHeight(true) - 3));}
			else if($.browser.version == "9.0"){ $(dId).height(parseInt($(dId).outerHeight(true) - 2));}
			else{$(dId).height(parseInt($(dId).outerHeight(true) - 1));}
		}else{$(dId).height(parseInt($(dId).outerHeight(true) - 1));}
		var tyDp=$(dId);if(tyDp.length>0){var oMTop=tyDp.offset().top,vw=$(window),orgView=vw.scrollTop();if((orgView!=0)&&(orgView>oMTop)&&!tyDp.is(".posAbslte")){tyDp.addClass("posAbslte")}vw.bind("scroll resize",function(){var vt=vw.scrollTop();if((vt>oMTop)&&!tyDp.is(".posAbslte")){tyDp.addClass("posAbslte")}else if((vt<=oMTop)&&tyDp.is(".posAbslte")){tyDp.removeClass("posAbslte")}})}
		$('#txt_thku_email').unbind('focus').bind('focus',function(){
			var t = $(this);
			var val = $.trim(t.val());
			t.removeAttr('placeholder').removeClass('errbox placeholder');				
			if (!Modernizr.input.placeholder) {
				if (val == $.trim(m.ph) || val ==m.errMsg) {t.val("");}
			}
		});
		$('#txt_thku_email').unbind('blur').bind('blur',function(){
			var t = $(this);
			var val = $.trim(t.val());
			if(val != ""){//true case
				t.removeAttr('placeholder',m.ph).removeClass('errbox placeholder');
				if (!Modernizr.input.placeholder) {
					if(val==m.ph || val ==m.errMsg ) {t.addClass('errbox');t.val(m.errMsg);}
				}
				}
			else if (val == ""){ //false
				t.attr('placeholder',m.errMsg).addClass('errbox').removeClass('placeholder').val(val);
				if (!Modernizr.input.placeholder) {
					t.val(m.errMsg)
				}
			}
			
		});
		//dp.proceedDownload(elem,tElm,forPd,tId,pID,dgCode)
		/*if (dp.$dJres.dlm && dp.isTyRiaLinkCallEnabled) {
			riaLinkmy('downloads : ' + $('#productDisplayName').val() + ' : ' + dp.vMjr.find('option:selected').attr('omniname') + ' : ' + dp.vMnr.find('option:selected').val() + ' : ty : ' + (subscribe ? 'sub' : 'notsub'));
			dp.isTyRiaLinkCallEnabled = false;
		}*/
	},
	proceedDownload: function(elem,tElm,forPd,tId,pID,dgCode){
		if(forPd){
			var data = $(elem).closest('li').data('dVars');
			var pdfId = data.pDownloadFileId, psParam = data.pSecureParam;
			if($(tElm).hasClass('btn_download')){
				getPlayerDownload(dgCode,pdfId,'',psParam,true,tId,pID);
			}else{
				getPlayerDownload(dgCode,pdfId,'dlm',psParam,true, tId,pID);
			}
		}else{
			var cData = $(elem).closest('li').data('osDvars');
			if((typeof cData.secureParam !== "undefined" || cData.secureParam != null)){
				var pdata = $(elem).closest('li.os_dglist_li').data('jsonS');
				var tId = pdata.tagId, pdfId = cData.fileId, psParam = cData.secureParam, psID = pdata.productId, dgCode = pdata.downloadGroupCode;
				if($(tElm).hasClass('btn_download')){
					getPlayerDownload(dgCode,pdfId,'',psParam,true,tId,psID);// Manual Dowload
				}else{
					getPlayerDownload(dgCode,pdfId,'dlm',psParam,true,tId,psID);// With DLM
				}
			}else{
				var pOsdata = $(elem).closest('li.li_dglist').data('jsonS');				
				var dId = cData.fileId, dtId = pOsdata.tagId, posID = pOsdata.productId;
				if($(tElm).hasClass('btn_download')){
					getPlayerDownload('',dId,'','',true,dtId,posID);// Manual Dowload
				}else{
					getPlayerDownload('',dId,'dlm','',true,dtId,posID);// With DLM
				}
			}
		}
		
	},
	makeRialLinkCall: function(){
		if(!dp.onHide){
			riaLinkmy('downloads : ' + $('#productDisplayName').val() + ' : ' + dp.vMjr.find('option:selected').attr('omniname') + ' : ' + dp.vMnr.find('option:selected').val() + ' : error : profile : exit');	
		}
	},
	errorosRes: function(pId){
		return function(err){
			alert("Error Response....")	
		}
	},
	ss:function(hidVal){
		vmf.cookie.write("dpPlayer",true);
		if(hidVal){
		var tval = dp.$dJres.user.email;
		}else{var tval = $('input#txt_thku_email').val();}
		var productId = $('input#txt_thku_email').attr('productId');
		var postData = {'customerEmailId':tval, 'productId':productId}
		vmf.ajax.post(dp.sUrl, postData, dp.chkSubscriptionSuc, dp.chkSubscriptionFail); 
	},
	chkSubscriptionSuc: function(data){
		var sr= vmf.json.txtToObj(data);
		var sl = sr.sResponseList
		if(sl != ""){
			dp.$dJres.subsribedUser = true;
			$('div#div_thk_u span#email_container').html(sl.message +' '+sl.emailAddress);
			s.prop10 = "";
			s.eVar10 = "";
			riaLinkmy('downloads : ' + $('#productDisplayName').val() + ' : ' + dp.vMjr.find('option:selected').attr('omniname') + ' : ' + dp.vMnr.find('option:selected').val() + ' : ty : notsub : opt in');			
			//if(sl.success){$('div#div_thk_u').slideUp();}
		}
	},
	putplaceHolder: function(element){// Check whether browser supports placeholder property
		var elems;
		if(element != ""){elems = element;}
		else{elems = '.txt_datepicker';}
		if (!Modernizr.input.placeholder) {
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
	modal:{// Modal Object for modal popup related code
		map:{
			"fn": {"type": "text","ph": rs.firstName + "*","errMsg": rs.enterValid + " " + rs.firstName,"errCls": "errbox","valid":0},
			"ln": {"type": "text","ph": rs.lastName + "*","errMsg": rs.enterValid + " " + rs.lastName,"errCls": "errbox","valid":0},
			"cntry": {"type": "select","ph": "","errMsg": rs.enterValid + " " + rs.countryText,"errCls": "errbox","valid":0},
			"state": {"type": "select","ph": "","errMsg": rs.enterValid + " " + rs.stateText,"errCls": "errbox","valid":0},
			"adres": {"type": "text","ph": rs.address + "*","errMsg": rs.enterValid + " " + rs.address,"errCls": "errbox","valid":0},
			"pc": {"type": "text","ph": rs.postalCode + "*","errMsg": rs.enterValid + " " + rs.postalCode,"errCls": "errbox","valid":0},
			"city": {"type": "text","ph": rs.city + "*","errMsg": rs.enterValid + " " + rs.city,"errCls": "errbox","valid":0},
			"txt_thku_email": {"type": "text","ph": rs.emailAddress,"errMsg": rs.emailAddressError,"errCls": "errbox","valid":0,"isEmail":1}
		},
		init:function(){
			$("#needmoreinf,#myvm_pro_modal").die('click').live('click',function(e){
				var gArr = ['cn','zh','jp','ja','kr','ko'];
				if($.inArray(dp.$dJres.user.userLocale, gArr) != -1){ 
					var idObj = $('#needmoreinfo_glob'), idx = "needmoreinfo_glob", btn = "#btn_nmi_continue";
				}else{
					var idObj = $('#needmoreinfo'), idx = "needmoreinfo", btn = "#btn_nmi_continue";
				}
				vmf.modal.show(idx, { checkPosition: true,focus:false,closeHTML: '<a class="modalCloseImg blue_cross" title="'+rs.close+'"></a>',
					onShow: function (dialog) {
						mdl.generateModalPopup(idx,idObj,btn);
					},
					onClose: function (dialog) {dp.makeRialLinkCall();$.modal.close();}		
				}); 
				e.preventDefault();
            	e.stopPropagation();	
			});
		},
		generateModalPopup: function(idx,idObj,btn){			
				$('#fn',idObj).val(dp.$dJres.user.firstName);$('#ln',idObj).val(dp.$dJres.user.lastName);$('#adres',idObj).val(dp.$dJres.user.address);$('#pc',idObj).val(dp.$dJres.user.zipcode);
				$('#city',idObj).val(dp.$dJres.user.city);
				var cDp = $('select#cntry',idObj);
				$.each(dp.$dJres.user.countryList, function() {
					cDp.append($("<option />").val(this.code).text(this.description));
				});
				$('select#cntry',idObj).val(dp.$dJres.user.country);
				var sDp = $('select#state',idObj);
				if(typeof dp.$dJres.user.stateList !== 'undefined'&& dp.$dJres.user.stateList.length != 0){
					sDp.attr('disabled','');
					$.each(dp.$dJres.user.stateList, function() {
						sDp.append($("<option />").val(this.code).text(this.description));
					});
					sDp.val(dp.$dJres.user.state);
				}else{ sDp.attr('disabled','disabled');}
				$('.genErr, .err, .tbError',idObj).hide();
				
				$('input:text,select',idObj).not('input#login_txt_email').each(function(i,v){
					var tids = $(v).attr('id');
					var tval = $(v).val();
					var mdlm = mdl.map[tids];
					if (mdlm.type=="text" && $.trim(tval) != "") {
						$(v).removeAttr('placeholder').removeClass(mdlm.errCls);
					} else if (mdlm.type=="select" && $(v).find('option:selected').index() != 0) {
						$(v).removeAttr('placeholder').removeClass('placeholder').removeClass(mdlm.errCls);
					}else if(!$(v).attr('disabled')){
						$(v).addClass(mdlm.errCls)
					}
					
					// fix for browsers not supporting placeholders
					if (!Modernizr.input.placeholder) {
						if (mdlm.type=="text" && $.trim(tval) == "") {
							$(v).val(mdlm.ph);
						}
					}
				})
				
				$(btn,idObj).unbind().bind('click',function(){mdl.validate($('#'+ idx +' :input:not(:button)'),mdl.ms,idObj);});
				$('#cntry, #state,#fn,#ln,#adres,#pc,#city', idObj).unbind('change').bind('change',function(){mdl.validate($(this))});
				$('select#cntry', idObj).unbind().bind('change', function(){
					if($(this).val() != ""){
						mdl.stateListRequest(this, idObj);
					}else{
						var sM = mdl.map['state'];
						var sDp = $('select#state', idObj).html('').attr('disabled','disabled');
						sDp.append($("<option />").text(rs.stateText).val(""));
						sDp.removeClass(sM.errCls);
					}
				});
				$('#cntry, #state,#fn,#ln,#adres,#pc,#city', idObj).unbind('focus').bind('focus',function(){
						var t = $(this),
						m = mdl.map[t.attr('id')];
						if (m.type=="text") {
							t.removeAttr('placeholder').removeClass(m.errCls);
							
							// fix for browsers not supporting placeholders
							if (!Modernizr.input.placeholder) {
								if ($.trim(t.val()) == $.trim(m.ph)) {
									t.val("");
								}
							}
							
						} else if (m.type=="select") {
							t.removeAttr('placeholder').removeClass('placeholder').removeClass(m.errCls);
						}
					});
					$('#cntry, #state,#fn,#ln,#adres,#pc,#city', idObj).unbind('blur').bind('blur',function(){
						mdl.validate($(this), false);
					});
				riaLinkmy('downloads : ' + $('#productDisplayName').val() + ' : ' + dp.vMjr.find('option:selected').attr('omniname') + ' : ' + dp.vMnr.find('option:selected').val() + ' : error : profile');
					
		},
		stateListRequest: function(elem, idObj){
			var cval = $(elem).val();
			var cData = {'ccode':cval}
			vmf.ajax.post(dp.stateUrl, cData, mdl.chkStateListSucc(idObj), mdl.chkStateListFail); 
		},
		chkStateListSucc: function(idObj){
			return function(res){
				var sLis = vmf.json.txtToObj(res);			
				var sDp = $('select#state', idObj).html('');
				sDp.append($("<option />").text(rs.stateText+"*").val(""));
				if(typeof sLis.jsonState.stateList !== 'undefined' && sLis.jsonState.stateList.length != 0){
					sDp.attr('disabled','').removeClass('placeholder').addClass(mdl.map[sDp.attr('id')].errCls);				
					$.each(sLis.jsonState.stateList, function() {
						sDp.append($("<option />").val(this.code).text(this.description));
					});
				}else{sDp.removeClass('errbox').attr('disabled','disabled');}
			}
		},
		ms:function(idObj){ //Need More Info... Modal popup sucess
			var pobj = dp.$dPostData;
			pobj['firstName']=$('#fn',idObj).val();
			pobj['lastName']=$('#ln',idObj).val();
			pobj['address']=$('#adres',idObj).val();
			pobj['zipcode']=$('#pc',idObj).val();
			pobj['city']=$('#city',idObj).val();
			pobj['country']=$('select#cntry',idObj).val();
			pobj['state']=$('select#state',idObj).val();
			pobj['editProfile']= true;
			//vmf.modal.hide();
			var frmModal = true;
			//vmf.ajax.post(dp.dUrl, pobj, dp.chkErrOnSuccess(dp.$pEle,dp.$tEle,frmModal,idObj), dp.chkErrOnFailure);  
			$.ajax({
				type: 'post',
				async:false,
				url: dp.dUrl,
				data: pobj,
				success:function(obj){
					dp.chkErrOnSuccess(obj,dp.$pEle,dp.$tEle,frmModal,idObj)
					},
				error:function(){ dp.chkErrOnFailure()}
			});
			riaLinkmy('downloads : ' + $('#productDisplayName').val() + ' : ' + dp.vMjr.find('option:selected').attr('omniname') + ' : ' + dp.vMnr.find('option:selected').val() + ' : error : profile : continue');			
		},
		 validate : function(o,cb,idObj){
			var flg = 1;
			var t = null;
			var m = null;
			o.each(function(obj){
				t= $(this);
				 m = mdl.map[t.attr('id')];
				if (m && !t.attr("disabled")) {
					if( (m.type=="text" && ($.trim(t.val())=="" || (!Modernizr.input.placeholder && $.trim(t.val())==$.trim(m.ph)))) || (m.type=="select" && t.find('option:selected').index() ==0) ){
						placeErr();
						flg=0;
						m.valid =0;
					} else {
						if (m.type=="text") {
								t.removeAttr('placeholder').removeClass(m.errCls);
						} else if (m.type=="select") {
							t.removeAttr('placeholder').removeClass('placeholder').removeClass(m.errCls);
						}
						m.valid =1;
					}
				}
			})
			function placeErr(){
				m.ph = (m.isEmail)? m.errMsg : m.ph;
				t.removeClass('placeholder').addClass(m.errCls).attr("placeholder", m.ph);
				if (!Modernizr.input.placeholder) {
					t.val(m.ph).removeClass('placeholder').addClass(m.errCls);
				}
			}
			if(flg && cb){
				$('.genErr, .tbError',idObj).hide();
				if(cb) cb(idObj);
			}
			else{
				if(flg != 1) {$('.genErr',idObj).show();$('.tbError',idObj).hide();}
			}
		}
	}// End of Modal Object and Methods
}// End of dp
function getPlayerDownload(downloadGroupCode,downloadFileId,baseStr,hashKey, isEulaAccepted,tagId,productId){
		var url = $('#downloadFilesForPlayer').val()+'&downloadFileId='+downloadFileId+'&vmware=downloadBinary&baseStr='+baseStr+'&hashKey='+hashKey+	'&productId='+productId+'&tagId='+tagId;
		url = url + '&downloadGroupCode='+downloadGroupCode;
		startPlayerDownload(url, baseStr, tagId, productId);
	return false;
	}
	function startPlayerDownload(url, baseStr,tagId,productId){
		$.ajax({
					type : "POST",
					dataType : "json",
					async:    false,
					url : url,
					success : function(jsonDownloadFile) {
					try {
							if(!jsonDownloadFile.isError){
								var isdlm = jsonDownloadFile.isDLM;
								var downloadURL = jsonDownloadFile.downloadURL;
								if(isdlm == 'yes') {
									trackDownloads("DLM", jsonDownloadFile.downloadFileType, jsonDownloadFile.downloadFileName);
									window.open(downloadURL,'Download_File','height=250,width=350,scrollbars=no,resizable=yes' );
									return false;
								} else {
									//Customer didnt like opening a pop up
									window.location.href=jsonDownloadFile.downloadURL;
									return false;
								}
							}else{
								alert("Error Occurred while processing the request");
							}
					} catch (e) {
						debug("errord occured in startDownload do nothing");
					}
				}
		});
	}
	/* * This is required, for downloads to set additional variables for tracking downloads. *  */
	function riaPlayerTrackDownloadsLink(appendName, fileName){
		var account = 'vmwareglobal';
		if (s_account)	account = s_account;
		var s=s_gi(account);
		s.linkTrackVars='prop1,prop2';
		s.linkTrackEvents='None';
		s.prop1 = getProp1();
		s.prop2 = getProp2();
		s.prop10 = fileName;
		s.eVar10 = s.prop10;
		if (s.pageName){
			var ppn = s.pageName;
			s.pageName += " : "+appendName;
			void(s.t());
			s.pageName = ppn;
		};
	}
	/** This is to track the Start download of Akamaiurls.* We need a seperate method as to track the Type */
	function trackPlayerDownloads(omnitureText, downloadType, fileType, fileName){
		
		try{
			if(fileType!=undefined && fileType!=null && fileType!=''){
				riaPlayerTrackDownloadsLink(omnitureText + " : " + fileType + " : " + downloadType, fileName);
			}else{
				riaPlayerTrackDownloadsLink(omnitureText + " : " + downloadType, fileName);
			}
		}catch(e){
			//do nothing.
		}
	}