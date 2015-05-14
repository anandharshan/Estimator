if (typeof(myvmware) == "undefined")  myvmware = {};

myvmware.download = {
  	init: function() {},
	my: function() {  
  		$('#pdFilterButton').click(function() {
			if(checkForEmptySearch('pd')) {
				
			} else {
				if(datesValidateProdFamily('pd')){
					getProdFamilyFilterResults('pd');
				} else {
					
				}
			}
		});	
		$('#dtFilterButton').click(function() {
			if(checkForEmptySearch('dt')) {
				
			} else {
				if(datesValidateProdFamily('dt')){
					getProdFamilyFilterResults('dt');
				} else {
					
				}
			}
		});
		$('#osFilterButton').click(function() {
			if(checkForEmptySearch('os')) {
				
			} else { 
				if(datesValidateProdFamily('os')){
					getProdFamilyFilterResults('os');
				} else {
					
				}
			}
		});
		$('#ciFilterButton').click(function() {
			if(checkForEmptySearch('ci')) {
				
			} else { 
				if(datesValidateProdFamily('ci')){
					getProdFamilyFilterResults('ci');
				} else {
					
				}
			}
		});
		$('#pdFilterReset').click(function() {
			resetFilter('pd');
			getProdFamilyFilterResults('pd');
			return false;
		});
		$('#dtFilterReset').click(function() {
			resetFilter('dt');
			getProdFamilyFilterResults('dt');
			return false;
		});
		$('#osFilterReset').click(function() {
			resetFilter('os');
			getProdFamilyFilterResults('os');
			return false;
		});
		$('#ciFilterReset').click(function() {
			resetFilter('ci');
			getProdFamilyFilterResults('ci');
			return false;
		});                
		$('#entitlementAccountNumber').change(function(){
			var getPageDataAjaxURL = $('#getPageDataAjaxURL').val();
			getPageData(getPageDataAjaxURL);
		});
                // To invoke survey popup on private version                
                $('span.btn_download a.md').click(function(){
                    var eulaStatus = $(this).attr('onclick');                       
                    if (typeof eulaStatus !== 'undefined' && eulaStatus !== false && eulaStatus !== null) {                                                            
                        //openSurvey();
                    }
                });                  
                window.onbeforeunload = function() {
                    if($('span.btn_download a.md').length){
                       // openSurvey();
                    }
                    // To invoke survey popup on public version                
                    if($('td.downloadManager a.primary').length){
                       //openSurvey();
                    }
                };
		try
		{
			var page = $('#page').val();
			if(page != undefined && page == 'myDownloads'){	
				$('#applyFilterMyDownloads').click(function(event) {
					if(checkForEmptySearchMydownloads()) {
						alert('Enter valid search criteria');
					} else {
						if(datesValidateMyDownloads()) {
							applyFilterMyDownloads();
						} else {
							alert('date validation error: Please enter valid dates');
						}
					}
				});
				$('#resetFilterMyDownloads').click(function() {
					resetMyDownloadsFilter();
					var getPageDataAjaxURL = $('#getPageDataAjaxURL').val();
					getPageData(getPageDataAjaxURL);
				});
				// Table row click
				bindMyDownloadsTableRowClickEvents();
				myvmware.download.getCalendar("txt_orderDate_from","txt_orderDate_to");
			} else {
		myvmware.download.getCalendar("pdOrderDateFrom","pdOrderDateTo");
		myvmware.download.getCalendar("dtOrderDateFrom","dtOrderDateTo");
		myvmware.download.getCalendar("osOrderDateFrom","osOrderDateTo");
			}
		}
		catch (err)
		{
			//expected exception... when there is no Page variable in the page.
		}
  		openCloseFamilyInfoBinrayTabCategories();
		manageTab();
	//	fillBreadcrumbs();	
		archivedProductsOnChange();
  	  	$('td .openClose').click(function() {  			
			var $tableBasedMore,
				$divBasedMore,
				$moreDetail,
				$this = $(this);
			//console.log($(this).parents('tr').next('.more-details').length);
			$tableBasedMore = $this.parents('tr').next('.more-details');
			$divBasedMore = $this.parent().parent().next().find('.more-details');
			var $totalProducts = $this.parent().parent().parent().parent().find('.openCloseSelect').length;
			
			if($tableBasedMore.length>0){
				$moreDetail = $tableBasedMore;
			} else {
				$moreDetail = $divBasedMore;
			}
			
  			if($this.hasClass('open')){
  				$moreDetail.hide();
  				$this.removeClass('open');
  				$this.parents('tr').removeClass('open');
  			}else{
  				$moreDetail.show();
  				$this.addClass('open');
  				$this.parents('tr').addClass('open');
  			}
			$openedProducts = $this.parent().parent().parent().parent().find('.openCloseSelect a.open').length;
			var $expandCollapseDiv = $(this).parent().parent().parent().parent().parent().parent().parent();
  			if($openedProducts == ($totalProducts) ){
				$expandCollapseDiv.find('.fn_expandAll').addClass('disabled');
				$expandCollapseDiv.find('.fn_collapseAll').removeClass('disabled');
			}else{
				if($openedProducts == 0){
					$expandCollapseDiv.find('.fn_collapseAll').addClass('disabled');
				}else{
					$expandCollapseDiv.find('.fn_collapseAll').removeClass('disabled');
				}
				$expandCollapseDiv.find('.fn_expandAll').removeClass('disabled');
			}
  			return false;
  			
		});	
		
		var $totalProducts1 = $('#tabbed_box_1').find('.tabContent:visible').find('.openCloseSelect').length;
		var $openedProducts1 = $('#tabbed_box_1').find('.tabContent:visible').find('.openCloseSelect a.open').length;
		var $parentDiv1 = $('#tabbed_box_1').find('.tabContent:visible');
		if($openedProducts1 == ($totalProducts1) ){
			$parentDiv1.find('.fn_expandAll').addClass('disabled');
			$parentDiv1.find('.fn_collapseAll').removeClass('disabled');
		}else{
			if($openedProducts1 == 0){
				$parentDiv1.find('.fn_collapseAll').addClass('disabled');
			}else{
				$parentDiv1.find('.fn_collapseAll').removeClass('disabled');
			}
			$parentDiv1.find('.fn_expandAll').removeClass('disabled');
		}
		
		var $activeTab = 'content_'+$('.tabs .active').attr('id');
		var $parentDiv = $('#'+$activeTab);
		var $totalChildProdNum =  $('#'+$activeTab).find('.activitiesLog table .openCloseSelect').length;
		
		var $totalProducts = $('#'+$activeTab).find('.openCloseSelect').length;
		var $openedProducts = $('#'+$activeTab).find('.openCloseSelect a.open').length;
		
		if($openedProducts == ($totalProducts) ){
			$parentDiv.find('.fn_expandAll').addClass('disabled');
			$parentDiv.find('.fn_collapseAll').removeClass('disabled');
		}else{
			if($openedProducts == 0){
				$parentDiv.find('.fn_collapseAll').addClass('disabled');
			}else{
				$parentDiv.find('.fn_collapseAll').removeClass('disabled');
			}
			$parentDiv.find('.fn_expandAll').removeClass('disabled');
		}
		
		if($totalChildProdNum == 0) {
			$parentDiv.find('.fn_expandAll').addClass('disabled');
			$parentDiv.find('.fn_collapseAll').addClass('disabled');
		}
		
		expandCollapseAll();
		
		if($('ul.tabs').hasClass('disabled')){
			$('ul.tabs').next().find('.fn_expandAll').addClass('disabled');
			$('ul.tabs').next().find('.fn_collapseAll').addClass('disabled');
		}
		
		$(".txt_datepicker").keydown(function(event) {
			// Allow only backspace and delete
			if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 109 || event.keyCode == 189) {
			 // let it happen, don't do anything
			}
			 else {
			// Ensure that it is a number and stop the keypress
			 if (event.keyCode < 48 || event.keyCode > 57) {
				if(event.keyCode != 9) {
					event.preventDefault(); 
				}
			}   
		 }
		 });
		setTimeout(function(){myvmware.download.adjustContentHeader();},10); // BUG-00048299 
  	},
	getCalendar: function(fromDate, toDate) {
		//vmf.dom.onload(function(){
                // Local variables to hold calendar elements
                var start_Date = vmf.dom.id(fromDate);
                var end_Date = vmf.dom.id(toDate);
				//var d = new Date();
				//var curr_date = d.getDate();
				//var curr_month = d.getMonth();
				//var curr_year = d.getFullYear();
                // Initialize the calendars
		vmf.calendar.build(vmf.dom.get(".txt_datepicker"), {
			dateFormat: 'yyyy-mm-dd',
			startDate: '1990-01-01',
			endDate: '2020-02-31',
			startDate_id: vmf.dom.id(fromDate),
			endDate_id: vmf.dom.id(toDate),
			error_msg_f:vmf.dom.get("#dateErrorMsg").text(),
            error_msg_t:vmf.dom.get("#dateErrorMsg").text()
                });
                // Bind event handler to the startDate calendar
                vmf.dom.addHandler(start_Date, "dpClosed", function(e, selDate){
                    var d = selDate[0];
                    if(d){
                        d = new Date(d);
                        vmf.calendar.setStartDate(end_Date, d.addDays(1).asString());
                    }
                });
                // Bind event handler to the endDate calendar
                vmf.dom.addHandler(end_Date, "dpClosed", function(e, selDate){
                    var d = selDate[0];
                    if(d){
                        d = new Date(d);
                        vmf.calendar.setEndDate(start_Date, d.addDays(-1).asString());
                    }
                });
		//})
	},
		historyInit: function(){
		myvmware.download.getCalendar("txt_orderDate_from","txt_orderDate_to");
		myvmware.download.getCalendar("txt_contractEndDate_from","txt_contractEndDate_to");
		myvmware.common.putplaceHolder('.txt_datepicker');
		$('#dwApplyFilter').click(function(){vmf.datatable.reload($('#tbl_download_history'),'downloads_reload.json')	});
			var dtd = null;
			var nTr = null;
			vmf.datatable.build($('#tbl_download_history'),{
					"bProcessing": true,
					"bAutoWidth": false,
					"aoColumns": [{"sWidth":"20px"},{"sWidth":"80px"},{ "sWidth": "200px"},{ "sWidth": "350px"},{ "sWidth": "100px"}],					
					"sAjaxSource": "downloads.json",
					"sPaginationType": "full_numbers",
					"aLengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]],
					"iDisplayLength": 5,
					"bServerSide": false,
					"oLanguage": {
						"sProcessing" : "<div class='loadingWrapper'>Loading...</div>",
						"sLoadingRecords":"",
						"sLengthMenu": "<label>Items per page</label> _MENU_",
						//"sZeroRecords": "Nothing found - sorry",
						"sInfo": "_START_ - _END_ of _TOTAL_ results",
						"sInfoEmpty": "0 - 0 of 0 results",
						"sInfoFiltered": "(filtered from _MAX_ total records)"
					},
					"sDom": 'rt<"bottom"lpi<"clear">>',
					"fnInitComplete": function(){
						dtd = this;
						//$tbl_id = $(dtd).attr('id');
						//$('#'+$tbl_id+'_first,#'+ $tbl_id+'_last,#'+$tbl_id+'_processing').hide();
						$(dtd).append('<tfoot><tr><td class="bottomarea" colspan="5"></td></tr></tfoot>');
			},
			"fnDrawCallback":function(){
				if(Math.ceil(this.fnSettings().fnRecordsDisplay()/this.fnSettings()._iDisplayLength)>1){
					$("#tbl_download_history_paginate").css("display", "block");
				} else {
					$("#tbl_download_history_paginate").css("display", "none");
				}
				if(this.fnSettings().fnRecordsDisplay()>parseInt($("#tbl_download_history_length option:eq(0)").val(),10)){
					$("#tbl_download_history_length").css("display", "block");
				} else {
					$("#tbl_download_history_length").css("display", "none");
				}
			}
		}); // End of datatable config
		vmf.datatable.build($('#tbl_download_history_nodownloads'),{
				"bPaginate": false,
				"bFilter":false,
				"sDom": 't',
				"bAutoWidth": false,
				"fnInitComplete": function (){
					$tbl = this;
					$htm = '';
					var $nTd = $tbl.find('td.dataTables_empty');
					if($nTd.length > 0){
						$tbl.css('height', '100%');
						 $tbl.find('thead').hide();
						$nTd.addClass('noborder').css('height','100%').css('vertical-align','middle');
						$nTd.html('');
						$htm += '<div class="no_downloads">';
						$htm += '<p class="no_msg">You have not downloaded any product yet.</p>';
						$htm += '<p class="no_info">To download products visit <a href="#">All Downloads</a>. To make a purchase, call 1-877-486-9273, <a href="#">Find a Partner</a> or visit the VMware Store.</p>';
						$htm += '</div>';
						$nTd.html($htm);						
					}
					$tbl.append('<tfoot><tr><td class="bottomarea" colspan="5"></td></tr></tfoot>');
				}
		});
		// Date range or all
		$('ul.showLastDownload li a').click(function(e){
			e.preventDefault();
			if($(e.target).parent('li').is('.active')) return;
			$('.filter-content').slideDown('slow',function(){
				var link = $('.filter-content').parent().find('div.filter a')
				if($(link).html().charAt(0)=='+'){
					$(link).html($(link).html().replace('+','-'));
				}
			});
			var id = $(e.target).attr('id');
			var diff;
			$('ul.showLastDownload li').removeClass('active');
			//console.log(id);			
			$(e.target).parent('li').addClass('active');
			if(id == 'lastThirtyDays'){
				diff = -30;
			}else if(id == 'lastNinetyDays'){
				diff = -90;
			}else{
				diff=0;
			}
			myvmware.download.setDateFields('#txt_orderDate_from','#txt_orderDate_to',diff);
			if(diff == 0){
				myvmware.download.RefreshTable('tbl_download_history','downloads.json');
			}else{
				myvmware.download.RefreshTable('tbl_download_history','downloads_reload.json');				
			}
			//console.log(e.target);			
		});
			$('table#tbl_download_history>tbody>tr').live('mouseover mouseout click',function(e){
				e.preventDefault();
				if($(this).is('.notd_pad,.disabled')) return;
				if(e.type=="mouseover"){
					//$(this).addClass("active");
				} else if (e.type=="mouseout"){
					//$(this).removeClass("active");
				} else {
					$(this).siblings().removeClass("clicked");
					$(this).addClass("clicked");
				}
				if(e.type == 'click'){
					$(this).find('div.openCloseSelect a').trigger('click');					
				}
			});
			$('div.openCloseSelect a').live('click',function(e) {
				e.preventDefault();
				$a = $(this);
				var getIdx = $a.attr('idx');
				nTr = $a.closest('tr')[0];
				if ($a.hasClass('open') && nTr.haveData)
				{
					$(nTr).next("tr").removeClass('notd_pad');
					$a.removeClass('open');	
					$(nTr).next("tr").hide();
				} 
				else{
					$a.addClass('open');
					if(!nTr.haveData){
					dtd.fnOpen(nTr,showloading(),'childRow');
					$(nTr).next("tr").addClass('notd_pad');
						if(getIdx == "notactive"){
							getDLdata_active(nTr);
						}else if(getIdx == "esxi"){
							getDLdata_esxi(nTr);
						}else{
						 getDLdata(nTr);						 
						}
						nTr.haveData = true;
					}else{
						$(nTr).next("tr").addClass('notd_pad');
						$(nTr).next("tr").show();
					}
					};
				return false;
			});
	},
		RefreshTable : function(tableId, urlData){
			$.getJSON(urlData, null, function( json )
			{
				table = $('#'+tableId).dataTable();
				oSettings = table.fnSettings();
				table.fnClearTable(this);
				for (var i=0; i<json.aaData.length; i++)
				{
					table.oApi._fnAddData(oSettings, json.aaData[i]);
				}
				oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
				table.fnDraw();
			});
		},
		setDateFields: function(startDateId, endDateId, diff){
			if(diff == 0){
				$('#txt_orderDate_from,#txt_orderDate_to,#txt_contractEndDate_from,#txt_contractEndDate_to').val('');
				myvmware.download.getCalendar("txt_orderDate_from","txt_orderDate_to");
				myvmware.download.getCalendar("txt_contractEndDate_from","txt_contractEndDate_to");
				myvmware.common.putplaceHolder('.txt_datepicker');
			}else{
				var nd = new Date();
				var ed = new Date();
				var df;
				df = nd.addDays(diff).asString();
				dt = ed.asString();
				$(startDateId).val(df);
				$(endDateId).val(dt);
				vmf.calendar.setStartDate($(startDateId), df);
				vmf.calendar.setDisplayMonth($(startDateId), nd.getMonth(), nd.getFullYear());
				vmf.calendar.setStartDate($(endDateId), dt);
				vmf.calendar.setDisplayMonth($(endDateId), ed.getMonth(), ed.getFullYear());
				var inputArray=new Array(startDateId,endDateId);
				myvmware.download.removePlaceHolderClass(inputArray);
			}			
		},
		removePlaceHolderClass: function(inputFields){
			$.each(inputFields, function(i,v) {
				 if($(v).hasClass('hasPlaceholder')) $(v).removeClass('hasPlaceholder');
		   });
			
		},
		adjustContentHeader: function(){  // BUG-00048299 
			var container = $('#content-header-container'), contentCol = $('#column-4'), searchCol = $('#column-5'), contentWid;
			if(container){
				contentWid = container.width() - searchCol.width() - (contentCol.outerWidth(true) - contentCol.width());
				contentCol.css('width',contentWid);
			}
		},initDropDown:function(){ 
			var qStr = getParameterByName('downloadGroup');
			var url = (qStr!="")?qStr:decodeURIComponent(window.location);
			var val = "";
			$("select#versionList > option").each(function(i) {
				if(qStr!=""){
					val = $(this).attr('downloadgroupid');
					if(url == val ){
						$("select#versionList").attr('selectedIndex', i);
					}
				}
				else {
					//val = this.value.substr(this.value.length-3,3);
					var loc = url.substring(url.lastIndexOf("/"));
					var val = this.value.substring(this.value.lastIndexOf("/"));
					if(val==loc){
							$("select#versionList").attr('selectedIndex', i);
					}
				}
			});
			if(vmf.dropdown && $("select#versionList").length && $("select#versionList").find("option").length>0){
				$('div.versionList').css("margin-top","-5px");
				vmf.dropdown.build($("select#versionList"), {
				optionsDisplayNum:10,
				ellipsisSelectText:false,
				ellipsisText:'',
				optionMaxLength:70,
				inputMaxLength:40,
				position:"right",
				onSelect:myvmware.download.onCategoryChange,
				optionsId:"eaDropDownOpts",
				inputWrapperClass:"eaInputWrapper",
				spanpadding:true,
				spanClass:"corner-img-left"});
				$('#eaDropDownOpts a:first').css({"border-bottom":"1px dotted #aaa"});
			}
			
			var ob = vmf.cookie.read("ObSSOCookie");

			if( !(ob == "loggedout" || ob == "loggedoutcontinue" || ob == null || ob == "") ){
				callBack.addsc({'f':'myvmware.common.showMessageComponent','args':['DOWNLOADS_FAMILY']});
				callBack.addsc({'f':'myvmware.download.showVersionSelectorBeak','args':[]});
				callBack.addsc({'f':'myvmware.download.showCustomISOBeak','args':[]});
			}
		}
		,onCategoryChange:function(){ 			
			var sel = $("select#versionList");	
			var opt =   $(sel).find('option:selected').val();
			var urls = decodeURIComponent(window.location.href.split('#')[0]);
			/*var oVal= opt.substr(opt.length-3,3);
                        if(urls.lastIndexOf('#') != -1){
                            var baseUrl = urls.substr(0, urls.lastIndexOf('#') - 3);
                            var hashUrl = urls.substr(urls.lastIndexOf('#'), urls.length);                        
                            opt = baseUrl+oVal+hashUrl;
                        }
                        else{
                            opt = urls.substr(0,urls.length-3)+oVal;
                        }                        
			//opt = urls.substr(0,urls.length-3)+oVal;*/
			if(getParameterByName('downloadGroup') !=""){
				var val = $(sel).find('option:selected').attr('downloadgroupid')
				opt = updateURLParameter(urls,'downloadGroup',val)
			}	
                        if(opt.indexOf('#errorCheckDiv' != -1)){
                            opt = opt.replace('#errorCheckDiv','');
                        }
			window.location.href = opt;
		},
		showVersionSelectorBeak: function(){
			myvmware.download.processBeak({
				  beakKeyString: "BEAK_DOWNLOADS_FAMILY_PAGE_FOR_VERSION_SELECTOR"
				, beakNewText: 'New: '
				, beakHeading: 'Version Selector'
				, beakContent: 'Switch between versions.'
				, beakTarget: $('.versionList')
				, multiple: true
			});
		},
		showCustomISOBeak: function(){
			myvmware.download.processBeak({
				  beakKeyString: "BEAK_DOWNLOADS_PAGE_FOR_CUSTOM_ISO_TAB"
				, beakNewText: 'New: '
				, beakHeading: 'Custom OEM ISOs Tab'
				, beakContent: 'Direct access to custom OEM ISOs.'
				, beakTarget: $('#24')
				, multiple: true
			});
		},
		processBeak: function( options ){
			myvmware.common.setBeakPosition({
				  beakId: myvmware.common.beaksObj[options.beakKeyString]
				, beakName: options.beakKeyString
				, beakNewText: options.beakNewText
				, beakHeading: options.beakHeading
				, beakContent: options.beakContent
				, target: options.beakTarget
				, beakLink: options.beakLink
				, multiple: options.multiple
			});
		}
}
function getDLdata(nTr){
	sOut="";
	sOut = '<div class="more-details-history" >';
	sOut +='<div class="history_more_content bottomarea clearfix">';
	sOut +='<h1>VMware ESXi 5.x Networking Driver CD for Dell QME8242-k, HP NC523SFP / CN1000Q, and QLogic 3200 / 8200 Series adapters <a href="#">View details</a></h1>';
	sOut +='<div class="pro_details_left"><div class="data"><label>Build Number:</label><span>260247</span></div><div class="data"><label>Version:</label><span>2.0</span></div><div class="data"><label>Type:</label><span>Drivers & Tools</span></div></div>';
	sOut +='<div class="pro_details_right"><div class="data"><label>Product Family:</label><span>VMware vSphere 4.1 <a href="#">View famliy</a></span></div><div class="data"><label>End-User License Agreement:</label><span><a href="#">View EULA</a></span></div></div>';
	sOut +='<table class="file_details_tbl">';
	sOut +='<thead><tr>';
    sOut +='<th class="firstCol">Files</th>';
    sOut +='<th class="secondCol">Information</th>';
    sOut +='<th class="thirdCol"></th>';
	sOut +='</tr></thead>';
	sOut +='<tbody>';
	sOut +='<tr><td><div class="down_name">ESX 4.1 Installable Update 1 (CD ISO)</div><div>394 M | .iso</div><div>Release Date 2011-02-10</div></td><td>Boot your server with this DVD in order to install ESX 4.1</td><td class="text_right"><button class="button">Download Manager</button><a href="#">Manually Download</a></td></tr>';
	sOut +='<tr><td><div class="down_name">ESX 4.1 Update 1 (upgrade ZIP from ESXi 4.0)</div><div>208 M | .zip</div><div>Release Date 2011-02-10</div></td><td>Boot your server with this DVD in order to install ESX 4.1</td><td class="text_right"><a href="#">Manually Download</a></td></tr>';
	sOut +='<tr><td><div class="down_name">ESX 4.1 (upgrade ZIP from ESXi 3.5)</div><div>206 M | .zip</div><div>Release Date 2011-02-10</div><div><a href="#">Hide Checksums</a></div><div>MD5SUM: d68d6c2e040a87cd04cd18c04c22c998</div><div>SHA1SUM:bbaacc0d34503822c14f6ccfefb6a5b62d18ae64</div></td><td>Boot your server with this DVD in order to install ESX 4.1</td><td class="text_right"><button class="button">Download Manager</button><a href="#">Manually Download</a></td></tr>';
	sOut +='<tr><td><div class="down_name">VMware Tools CD image for Linux Guest OSes</div><div>90 M | .iso</div><div>Release Date 2011-02-10</div><div><a href="#">Show Checksum</a></div></td><td>Boot your server with this DVD in order to install ESX 4.1</td><td class="text_right"><a href="#">Manually Download</a></td></tr>';
	sOut +='<tr><td><div class="down_name">VMware vSphere Client</div><div>244 M | .exe</div><div>Release Date 2011-02-10</div></td><td>Boot your server with this DVD in order to install ESX 4.1</td><td class="text_right"><button class="button">Download Manager</button><a href="#">Manually Download</a></td></tr>';
	sOut +='<tr><td><div class="down_name">VMware ESX SNMP MIB modules</div><div>66 KB | .zip</div><div>Release Date 2011-02-10</div></td><td>Boot your server with this DVD in order to install ESX 4.1</td><td class="text_right"><button class="button">Download Manager</button><a href="#">Manually Download</a></td></tr>';	
	sOut +='</tbody>';
	sOut +='</table>';
	sOut +='</div>';
	sOut +='</div>';
	$(nTr).next("tr").find("td").html(sOut);
	//return sOut;
};
function getDLdata_active(nTr){
	sOut="";
	sOut = '<div class="more-details-history">';
	sOut +='<div class="history_more_content bottomarea clearfix">';
	sOut +='<h1>VMware ESXi 5.x Networking Driver CD for Dell QME8242-k, HP NC523SFP / CN1000Q, and QLogic 3200 / 8200 Series adapters <a href="#">View details</a></h1>';
	sOut +='<div class="pro_details_left"><div class="data"><label>Build Number:</label><span>260247</span></div><div class="data"><label>Version:</label><span>2.0</span></div><div class="data"><label>Type:</label><span>Drivers & Tools</span></div></div>';
	sOut +='<div class="pro_details_right"><div class="data"><label>Product Family:</label><span>VMware vSphere 4.1 <a href="#">View famliy</a></span></div><div class="data"><label>End-User License Agreement:</label><span><a href="#">View EULA</a></span></div></div>';
	sOut +='<div class="alert-box-wrapper clearBoth"><div class="alert-box-holder"><div class="alert-title">Your request cannot be completed at this time.</div><p>We are looking into this issue and will notify you via email once the review is complete</p></div></div>';
	sOut +='<table class="file_details_tbl">';
	sOut +='<thead><tr>';
    sOut +='<th class="firstCol">Files</th>';
    sOut +='<th class="secondCol">Information</th>';
    sOut +='<th class="thirdCol"></th>';
	sOut +='</tr></thead>';
	sOut +='<tbody>';
	sOut +='<tr><td><div class="down_name">ESX 4.1 Installable Update 1 (CD ISO)</div><div>394 M | .iso</div><div>Release Date 2011-02-10</div></td><td>Boot your server with this DVD in order to install ESX 4.1</td><td class="text_right"><button class="button disabled">Download Manager</button><a href="#" class="disabled">Manually Download</a></td></tr>';
	sOut +='<tr><td><div class="down_name">ESX 4.1 Update 1 (upgrade ZIP from ESXi 4.0)</div><div>208 M | .zip</div><div>Release Date 2011-02-10</div></td><td>Boot your server with this DVD in order to install ESX 4.1</td><td class="text_right"><a href="#" class="disabled">Manually Download</a></td></tr>';
	sOut +='<tr><td><div class="down_name">ESX 4.1 (upgrade ZIP from ESXi 3.5)</div><div>206 M | .zip</div><div>Release Date 2011-02-10</div><div><a href="#">Hide Checksums</a></div><div>MD5SUM: d68d6c2e040a87cd04cd18c04c22c998</div><div>SHA1SUM:bbaacc0d34503822c14f6ccfefb6a5b62d18ae64</div></td><td>Boot your server with this DVD in order to install ESX 4.1</td><td class="text_right"><button class="button disabled">Download Manager</button><a href="#" class="disabled">Manually Download</a></td></tr>';
	sOut +='<tr><td><div class="down_name">VMware Tools CD image for Linux Guest OSes</div><div>90 M | .iso</div><div>Release Date 2011-02-10</div><div><a href="#">Show Checksum</a></div></td><td>Boot your server with this DVD in order to install ESX 4.1</td><td class="text_right"><a href="#" class="disabled">Manually Download</a></td></tr>';
	sOut +='<tr><td><div class="down_name">VMware vSphere Client</div><div>244 M | .exe</div><div>Release Date 2011-02-10</div></td><td>Boot your server with this DVD in order to install ESX 4.1</td><td class="text_right"><button class="button disabled">Download Manager</button><a href="#" class="disabled">Manually Download</a></td></tr>';
	sOut +='<tr><td><div class="down_name">VMware ESX SNMP MIB modules</div><div>66 KB | .zip</div><div>Release Date 2011-02-10</div></td><td>Boot your server with this DVD in order to install ESX 4.1</td><td class="text_right"><button class="button disabled">Download Manager</button><a href="#" class="disabled">Manually Download</a></td></tr>';	
	sOut +='</tbody>';
	sOut +='</table>';
	sOut +='</div>';
	sOut +='</div>';
	$(nTr).next("tr").find("td").html(sOut);
	//return sOut;
};
function getDLdata_esxi(nTr){
	sOut="";
	sOut = '<div class="more-details-history">';
	sOut +='<div class="history_more_content bottomarea clearfix">';
	sOut +='<h1>VMware ESXi Symphony v3.5</h1>';
	sOut +='<div class="pro_details_left"><div class="data"><label>Type:</label><span>Free Product</span></div></div>';
	sOut +='<table class="file_details_tbl">';
	sOut +='<thead><tr>';
    sOut +='<th class="comp_col">Component</th>';
    sOut +='<th></th>';
	sOut +='</tr></thead>';
	sOut +='<tbody>';
	sOut +='<tr><td><div class="down_name">VMware vSphere Hypervisor</div></td><td><a href="#" class="newwindow_icon">View Downloads / Licenses</a></td></tr>';
	sOut +='</tbody>';
	sOut +='</table>';
	sOut +='</div>';
	sOut +='</div>';
	$(nTr).next("tr").find("td").html(sOut);
	//return sOut;
};
function showloading(){
	var sOut="<span class='loading'>Loading.....</span>";
	return sOut;
};

function datesValidateMyDownloads(){
	//$('#txt_orderDate_to').val('');
	// String format yyyy-mm-dd
	var rgx = /^[0-9]{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])/;
	var fromDate = $('#txt_orderDate_from').val();
	var toDate = $('#txt_orderDate_to').val();
	if(fromDate == "" || toDate == "") {
		return true;
	} else {
		if(fromDate.match(rgx) && toDate.match(rgx) && fromDate < toDate) {
			return true;
		} else {
			return false;
		}
		
	}
}

function checkForEmptySearchMydownloads(){
	if($('#product').val() != "" || $('#version').val() != "" || $('#txt_orderDate_from').val() != "" || $('#txt_orderDate_to').val() != "") {
		return false;
	} else {
		return true;
	}
}

function checkForEmptySearch(filterFrom) {
	if($('#'+filterFrom+'ProductName').val() != "" || $('#'+filterFrom+'Version').val() != "" || ($('#'+filterFrom+'OrderDateFrom').val() != "" || $('#'+filterFrom+'OrderDateTo').val() != "") ) { 
		return false;
	} else {
		return true;
	}
}
function datesValidateProdFamily(filterFrom){
	//$('#txt_orderDate_to').val('');
	// String format yyyy-mm-dd
	var rgx = /^[0-9]{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])/;
	
	var fromDate = $('#'+filterFrom+'OrderDateFrom').val();
	var toDate =$('#'+filterFrom+'OrderDateTo').val();
	var validationStatus= true;
	
	if(fromDate !="" && toDate==""){
		vmf.calendar.displayErrorMsg($('#'+filterFrom+'OrderDateTo'),vmf.dom.get("#dateErrorMsg").text(),f=0);
		validationStatus=false;
	}
	
	if(fromDate !=""){
		if(!(fromDate.match(rgx))){
			validationStatus=false;
		}
	}
	
	
	if(fromDate =="" && toDate!=""){
		vmf.calendar.displayErrorMsg($('#'+filterFrom+'OrderDateFrom'),vmf.dom.get("#dateErrorMsg").text(),f=0);
		validationStatus=false;
	}
	
	if(toDate !=""){
		if(!(toDate.match(rgx))){
			validationStatus=false;
		}
	}
	
	
	if(toDate !="" && fromDate !="") {
		if(!(fromDate.match(rgx)) || !(toDate.match(rgx)) || !(fromDate < toDate)) {
			validationStatus=false;
		} 
	}
	return validationStatus;
}
// On change of the select redirect user to product family page.
function archivedProductsOnChange(){
	$('.scSelectAnArchive').change(function(event) {
		//Do for on change
		var option;
			option =  this.options[this.selectedIndex];
			location.href= jQuery(option).attr("customHref");
		
	})

}
  
function getSelectedProductDetails(downloadGroupId){
	var ajaxUrl = $("#getSelectedProductDetailsAjaxURL").val();// + '&downloadGroupId='+downloadGroupId;
	var isFreeProduct = $('#freeProduct'+downloadGroupId).val();
	$("#section2Div").addClass('hidden');
	$("#errorDiv").addClass('hidden');
	var status=false;

	$.ajax({
		type : "POST",
		dataType : "html",
		url : ajaxUrl,
		data : {
			downloadGroupId : downloadGroupId,
			isFreeProduct : isFreeProduct,
			entitlementAccountNumber : $('#entitlementAccountNumber').val()
		},
		async : false,
		success : function(data) {		
			try{
				$("#updateHiddenDiv").html(data);					
				if($('#ajaxResultStatus').val()=='success'){
					$('#dFilesContentDiv').html($('#dFilesContentDivHidden').html());
					$('#resourcesContentDiv').html($('#resourcesContentDivHidden').html());
					$('#productInfoDiv').html($('#productInfoDivHidden').html());
					$('#drivers&toolsContentDiv').html($('#driver&toolsContentHiddenDiv').html());
					$('#dFilesCompatibilityDiv').html($('#resourcesCompatibilityDiv').html());
					if(isFreeProduct=='true'){
						$('#resourcesTabLi').addClass('hidden');
					}else{
						$('#resourcesTabLi').removeClass('hidden');
					}
					
					unBindEventsForProdInfoReq();
					unBindEulaEvents();
					subBindExpandColapseEvents();
					bindEulaEvents();
					hideEulaDeclinedSection();
					$("#section2Div").removeClass('hidden');
					status=true;
					window.location='#section2Div';
				} else if ($('#ajaxResultStatus').val()=='exception'){
					//alert($('#exceptionMsgDiv').html());
					status=false;
					window.location='#ajaxErrorMessage';
				}else{
					$("#errorDiv").removeClass('hidden');
					$('#errorProductInfoDiv').html($('#productInfoDivHidden').html());
					$("#errorMsgDiv").html($("#errorMsgDivHidden").html());
					status=false;
					window.location='#errorMsgDiv';
				}	
				
			}catch(err){
				if($("#section2Div")!=null){
				 $("#section2Div").addClass('hidden');
				}
				/*if($("#updateHiddenDiv")!=null){
				  $("#updateHiddenDiv").html('Error Occurred');
				}*/
				status=false;
				return false;
			}
		}
		
	});
	if(status){
		$("#ajaxErrorMessage").hide();
	}else{
		$("#ajaxErrorMessage").show();
	}
}
function applyFilterMyDownloads(){
	var ajaxUrl = $('#applyFilterURL').val();
	var productName = $('#product').val();
	var version = $('#version').val();
	var fromDate = $('#txt_orderDate_from').val();
	var toDate = $('#txt_orderDate_to').val();
	var selectedEANumber = $('#entitlementAccountNumber').val();
	var filterApplied = "true";
	$("#section2Div").addClass('hidden');

	$.ajax({
		type : "POST",
		dataType : "html",
		url : ajaxUrl,
		data : {
			name : productName,
			version : version,
			fromDate : fromDate,
			toDate : toDate,
			selectedEANumber : selectedEANumber,
			isFilterApplied : filterApplied
		},
		async : false,
		success : function(data) {
			try{
				$("#errorDiv").removeClass('hidden');
				$("#errorMsgDiv").html($("#errorMsgDivHidden").html());

				$(".grid-content").empty();
				$("#page-grid").append('<div class="grid-content" id="page-grid-content"></div>');
				$("#page-grid-content").html(data);
				bindExpandColapseEvents();
				bindMyDownloadsTableRowClickEvents();
				$('#content-container tr.clickable').click(function(event) {
					var downloadGroupId = $(this).attr('id');//50000035;//50003921;//8;//$(this).attr('id');$(this).attr('id');//
					getSelectedProductDetails(downloadGroupId);
				});

				$('#resetFilterMyDownloads').click(function() {
					resetMyDownloadsFilter();
					var getPageDataAjaxURL = $('#getPageDataAjaxURL').val();
					getPageData(getPageDataAjaxURL);
				});

				expandCollapseAll();

				$('#applyFilterMyDownloads').click(function(event) {
					if(checkForEmptySearchMydownloads()) {
						alert('Enter valid search criteria');
					} else {
						if(datesValidateMyDownloads()) {
							applyFilterMyDownloads();
						} else {
							alert('date validation error: Please enter valid dates');
						}
					}
				});


				//bindFilter();
				myvmware.download.getCalendar("txt_orderDate_from","txt_orderDate_to");
					
			}catch(err){
				$("#section2Div").addClass('hidden');
				$("#updateHiddenDiv").html('Error Occurred');
			}
		}
	});
}


function getMyProductListData(parmaurl){
	
	var url = $('#getPageDataAjaxURL').val()+parmaurl;
	getPageData(url);
}

function getPageData(getPageDataUrl){
	
	var ajaxUrl = getPageDataUrl;
	var entitlementAccountNumber = $('#entitlementAccountNumber').val();
	$("#section2Div").addClass('hidden');
	
	$.ajax({
		type : "POST",
		dataType : "html",
		url : ajaxUrl,
		data : {
			downloadGroupId : '',
			selectedEANumber : entitlementAccountNumber
		},
		async : false,
		success : function(data) {
			try{
				$("#errorDiv").removeClass('hidden');
				//$('#errorProductInfoDiv').html($('#productInfoDivHidden').html());
				$("#errorMsgDiv").html($("#errorMsgDivHidden").html());


				$(".grid-content").remove();
				$("#page-grid").append('<div class="grid-content" id="page-grid-content"></div>');
				$("#page-grid-content").html(data);
				//$("#page-grid-ajax").show();
				bindExpandColapseEvents();
				bindMyDownloadsTableRowClickEvents();
				$('#content-container tr.clickable').click(function(event) {
					var downloadGroupId = $(this).attr('id');//50000035;//50003921;//8;//$(this).attr('id');$(this).attr('id');//
					getSelectedProductDetails(downloadGroupId);
				});

				$('#applyFilterMyDownloads').click(function(event) {
					if(checkForEmptySearchMydownloads()) {
						alert('Enter valid search criteria');
					} else {
						if(datesValidateMyDownloads()) {
							applyFilterMyDownloads();
						} else {
							alert('date validation error: Please enter valid dates');
						}
					}
				});

				//$('#resetFilterMyDownloads').click(function(event) {
					resetMyDownloadsFilter();
				//});

					$('#resetFilterMyDownloads').click(function() {
						resetMyDownloadsFilter();
						var getPageDataAjaxURL = $('#getPageDataAjaxURL').val();
						getPageData(getPageDataAjaxURL);
					});
				

				myvmware.download.getCalendar("txt_orderDate_from","txt_orderDate_to");

				expandCollapseAll();
				
				//bindFilter();
						
			}catch(err){
				///alert(err);
				//$("#section2Div").addClass('hidden');
				//$("#updateHiddenDiv").html('Error Occurred');
			}
		}
		
	});
}

function getProdFamilyFilterResults(filterFrom){
	var ajaxUrl = $('#getProductDetailsAjaxURL').val();
	if($('#getProdFamilyFilterURL').val()!=undefined){
		ajaxUrl = $('#getProdFamilyFilterURL').val();
	}
	var productName = $('#'+filterFrom+'ProductName').val();
	var version = $('#'+filterFrom+'Version').val();
	var fromDate = $('#'+filterFrom+'OrderDateFrom').val();
	var toDate = $('#'+filterFrom+'OrderDateTo').val();
	var slug = $('#slugTemp').val();
	var locale = $('#lsn').val();

	$.ajax({
		type : "GET",
		dataType : "html",
		url : ajaxUrl,
		data : {
			productName : productName,
			version : version,
			fromDate : fromDate,
			toDate : toDate,
			slug : slug,
			localeShortName : locale,
			filterFrom : filterFrom
		},
		async : false,
		success : function(data) {
			try{
				if(data!=''){
					$("#updateHiddenDiv").html(data);
					$('#'+filterFrom+'ActivitiesLog').html($('#'+filterFrom+'ActivitiesLogTemp').html());
					unBindEventsForProdInfoReq();
					bindExpandColapseEvents();
					//myvmware.download.getCalendar(filterFrom+"OrderDateFrom",filterFrom+"OrderDateTo");
					openCloseFamilyInfoBinrayTabCategories();
				}else{
					alert("Error Occurred while processing the request");
				}
				
			}catch(err){
				alert('error');
			}
		}
	});
}

function acceptEula(downloadUrl, baseStr){
	var ajaxUrl = $("#acceptEulaAjaxURL").val();// + '&downloadGroupId='+downloadGroupId;
	var eulaId = $("#eulaId").val();
	var downloadGroupId = $('#downloadGroupId').val();
	$.ajax({
		type : "POST",
		dataType : "html",
		url : ajaxUrl,
		data : {
			eulaId : eulaId,
			downloadGroupId : downloadGroupId
		},
		async : false,
		success : function(data) {
			try{
				if(data!=''){
					$("#updateEulaAccHiddenDiv").html(data);
					if($('#eulaAcceptAjaxResultStatus').val()=='success'){
						$("#eulaAgreementDiv").html($("#eulaAgreementDivHidden").html());
						$("#versionLabel").val($("#eulaVersion").val());
						//$('#eulaAlertTRow').remove();
						unBindEulaEvents();
						bindEulaEvents();
						
						if(downloadUrl!=undefined && downloadUrl!=null && downloadUrl!=''){
							changeViewToAcceptEula();
							startDownload(downloadUrl, baseStr);
						}else{
							hideEulaDeclinedSection();	
							hideEulaModal();
						}
						
						
					}else if($('#eulaAcceptAjaxResultStatus').val()=='exception'){
						alert($('#eulaAcceptExceptionMsg').val());
					}					
				}			
			}catch(err){
				
			}
		}
		
	});
}

function setEulaToViewMode(){
	$('#eulaCheckBoxDiv').html('');
	$('#eulaBaseButtonsDiv').html($('#eulaBaseButtonsViewModeDiv').html());
}
// For Binding Various Events
function bindMyDownloadsTableRowClickEvents(){
	$('#content-container tr.clickable').click(function(event) {
		$this = $(this);
		$this.parent().find('tr.clickable.selected').removeClass('selected');
		$this.parent().find('tr.alt-clickable.selected').removeClass('selected');
		if(!$this.hasClass('selected')){
			$this.addClass('selected');
		}
		var downloadGroupId = $(this).attr('id');
		getSelectedProductDetails(downloadGroupId);
	});
	/* if it is product info page dont bind*/
	
	$('#content-container tr.alt-clickable').click(function(event) {
			$this = $(this);
			$this.parents('table.expanded').find('tr.clickable.selected').removeClass('selected');
			$this.parent().find('tr.alt-clickable.selected').removeClass('selected');
			if(!$this.hasClass('selected')){
					$this.addClass('selected');
			}
			var downloadGroupId = $(this).attr('id');
			getSelectedProductDetails(downloadGroupId);
	});
	
}

function bindExpandColapseEvents(){
	// Open close tables
  		var $more = $('.more-details');
		$more.each(function(){
			var $this = $(this);
			if($this.parents('table').hasClass('fn_startOpen')){
				$this.show().prev().find('.openClose').addClass('open'); //Hide all the more detail rows and remove open classes
			} else {
				//if(!$this.parents('table').hasClass('expanded')){
				$this.hide().prev().find('.openClose').removeClass('open'); //Hide all the more detail rows and remove open classes
				//}
			}
		});
		
		subBindExpandColapseEvents();
}

function subBindExpandColapseEvents(){
	
	var $activeTab = 'content_'+$('.tabs .active').attr('id');
	var $totalProducts = $('#'+$activeTab).find('.openCloseSelect').length;
	var $openedProducts = $('#'+$activeTab).find('.openCloseSelect a.open').length;
	var $parentDiv = $('#'+$activeTab);
	var $totalChildProdNum =  $('#'+$activeTab).find('.activitiesLog table .openCloseSelect').length;
	
	//alert($openedProducts);
	if($openedProducts == ($totalProducts) ){
		$('#'+$activeTab).find('.fn_expandAll').addClass('disabled');
		$('#'+$activeTab).find('.fn_collapseAll').removeClass('disabled');
	}else{
		if($openedProducts == 0){
			$('#'+$activeTab).find('.fn_collapseAll').addClass('disabled');
		}else{
			$('#'+$activeTab).find('.fn_collapseAll').removeClass('disabled');
		}
		$('#'+$activeTab).find('.fn_expandAll').removeClass('disabled');
	}

	if($totalChildProdNum == 0) {
			$parentDiv.find('.fn_expandAll').addClass('disabled');
			$parentDiv.find('.fn_collapseAll').addClass('disabled');
	}

	$('td .openClose').click(function() {		
						
			var $tableBasedMore,
				$divBasedMore,
				$moreDetail,
				$this = $(this);
			
			//console.log($(this).parents('tr').next('.more-details').length);
			
			$tableBasedMore = $this.parents('tr').next('.more-details');
			$divBasedMore = $this.parent().parent().next().find('.more-details');
			var $totalProducts = $this.parent().parent().parent().parent().find('.openCloseSelect').length;
			
			if($tableBasedMore.length>0){
				$moreDetail = $tableBasedMore;
			} else {
				$moreDetail = $divBasedMore;
			}
			
  			if($this.hasClass('open')){
  				$moreDetail.hide();
  				$this.removeClass('open');
  				$this.parents('tr').removeClass('open');
  			}else{
  				$moreDetail.show();
  				$this.addClass('open');
  				$this.parents('tr').addClass('open');
  			}
  			$openedProducts = $this.parent().parent().parent().parent().find('.openCloseSelect a.open').length;
  			var $expandCollapseDiv = $(this).parent().parent().parent().parent().parent().parent().parent();
  			if($openedProducts == ($totalProducts) ){
				$expandCollapseDiv.find('.fn_expandAll').addClass('disabled');
				$expandCollapseDiv.find('.fn_collapseAll').removeClass('disabled');
			}else{
				if($openedProducts == 0){
					$expandCollapseDiv.find('.fn_collapseAll').addClass('disabled');
				}else{
					$expandCollapseDiv.find('.fn_collapseAll').removeClass('disabled');
				}
				$expandCollapseDiv.find('.fn_expandAll').removeClass('disabled');
			}
  			return false;
		});	
		
		// Expand All / Collapse All
		expandCollapseAll();
}

function bindEulaEvents(){
	
	$('#eulaAcceptButton').click(function(event){
		acceptEula();
	});
	
	$('#eulaDeclineButton').click(function(event){
		displayEulaDeclinedSection();
	});
	
	$(".modalContent .fn_cancel").click(function(){
		hideEulaModal();
		return false;
	}); 
	
	$('#acceptEULA').click(function(event){
		showEulaModal('eulaAcceptBaseDiv');
		return false;			
	});
	
	$('#viewEULA').click(function(event){
		showEulaModal('eulaAcceptBaseDiv');
		return false;
	});
	
	$('#eulaAcceptCheckBox').click(function(event){
		handleEulaAcceptCheckBoxEvent();
	
	});
		handleEulaAcceptCheckBoxEvent();	
}

//added this function with respect to eulaModal.jsp
function bindEulaModalEvents(){

	$('#acceptAndDownloadCheckBox').click(function(event){
		handleEulaModalCheckBoxEvent();
	});

	handleEulaModalCheckBoxEvent();	
}
// End For Binding various events

function handleEulaAcceptCheckBoxEvent(){
	if($('#eulaAcceptCheckBox').attr('checked')){
			$('#eulaAcceptButton').attr('disabled','');
			$('#eulaAcceptButton').removeClass('disabled');
		} else {
			$('#eulaAcceptButton').attr('disabled', 'disabled');
			$('#eulaAcceptButton').addClass('disabled');
		}
}


function handleEulaModalCheckBoxEvent(){
	if($('#acceptAndDownloadCheckBox').attr('checked')){
			$('#acceptAndDownload').attr('disabled','');
			$('#acceptAndDownload').removeClass('disabled');
		} else {
			$('#acceptAndDownload').attr('disabled', 'disabled');
			$('#acceptAndDownload').addClass('disabled');
		}
}

// Start For UnBinding various events
function unBindEventsForProdInfoReq(){
	$('td .openClose').unbind('click');
}

function unBindEulaModalEvents(){
	$('#acceptAndDownloadCheckBox').unbind('click');
}

function unBindEulaEvents(){
	$('#eulaAcceptButton').unbind('click');
	
	$('#eulaDeclineButton').unbind('click');
	
	$(".modalContent .fn_cancel").unbind('click');
	
	$('#acceptEULA').unbind('click');
	
	$('#viewEULA').unbind('click');

	$('#eulaAcceptCheckBox').unbind('click');

}
// End For UnBinding various events

function resetFilter(filterFrom){
	$('#'+filterFrom+'ProductName').val('');
	$('#'+filterFrom+'Version').val('');
	$('#'+filterFrom+'OrderDateFrom').val('');
	$('#'+filterFrom+'OrderDateTo').val('');
    vmf.calendar.resetCalenders($('#'+filterFrom+'OrderDateFrom'));
	vmf.calendar.resetCalenders($('#'+filterFrom+'OrderDateTo'));
	myvmware.download.getCalendar(filterFrom+'OrderDateFrom',filterFrom+'OrderDateTo');
}

function resetMyDownloadsFilter(){
	$('#product').val('');
	$('#version').val('');
	$('#txt_orderDate_from').val('');
	$('#txt_orderDate_to').val('');
}

function showEulaModal(modalContentDivId){
	// See if border-radius is supported by the browser.
	var borderRadiusSupported = $('html').hasClass('borderradius');
	vmf.modal.show(modalContentDivId, { checkPosition: true });
	if(!borderRadiusSupported){
		$('.modalContent .button').corner();
	}	
}

function hideEulaModal(){
	
	//added this for BUG-00024748 not getting refreshed...
	$("#eulaAgreementDiv").html();

	vmf.modal.hide();
	var borderRadiusSupported = $('html').hasClass('borderradius');
	if(!borderRadiusSupported){
		$('.modalContent .button').uncorner();
	}
}


function checkEulaAccepted(downloadGroupCode,downloadFileId,baseStr,hashKey,tagId,productId,uuId){
	$('#downloadGroupCode').val(downloadGroupCode);
	$.ajax({
	type : "POST",
				dataType : "html",
				url : $("#checkEulaAcceptanceURL").val(),
				data : {
					downloadGroupCode : downloadGroupCode
				},
				async : false,
				success : function(data) {
					try {
							if(data.indexOf('true')!= -1){
								getDownload(downloadGroupCode,downloadFileId,baseStr,hashKey,true,tagId,productId,uuId);
							}else{
								fetchEulaContent(downloadGroupCode,downloadFileId,baseStr,hashKey,tagId,productId,uuId);									
								showEulaModal('eulaDisplayContent');														
							}						
						} catch (err) {
					}
				}
	});
			
}

function fetchEulaContent(downloadGroupCode,downloadFileId,baseStr, hashKey,tagId,productId,uuId){
	$.ajax({
		type : "POST",
					dataType : "html",
					url : $("#acceptEulaURLForDownloadURL").val(),
					data : {
						downloadGroupCode : downloadGroupCode,
						downloadFileId:downloadFileId,
						baseStr:baseStr,
						hashKey:hashKey,
						tagId:tagId,
						productId:productId,
						uuId:uuId
					},
					async : false,
					success : function(data) {
						try {
							$("#eulaContentDisplay").html(data);							
							//$('#eulaContentHTML').html($('#eulaContent').text());
							setDownloadsOmniture();
							unBindEulaModalEvents();
							bindEulaModalEvents();
						} catch (err) {
						}
					}
	});
				
}
		
function checkEulaAndPerform(downloadGroupCode,downloadFileId,baseStr,hashKey,tagId,productId,uuId){
	checkEulaAccepted(downloadGroupCode,downloadFileId,baseStr,hashKey,tagId,productId,uuId);
	return false;
}

function getDownload(downloadGroupCode,downloadFileId,baseStr,hashKey, isEulaAccepted,tagId,productId,uuId){
	var url = $('#downloadFilesURL').val()+'&downloadFileId='+downloadFileId+'&vmware=downloadBinary&baseStr='+baseStr+'&hashKey='+hashKey+
				'&productId='+productId+'&tagId='+tagId+'&uuId='+uuId;
	var page = $('#page').val();
	
	/* Added to change accept EULA to view EULA*/
	changeViewToAcceptEula();
	
	if(page != undefined && page == 'myDownloads'){	
	// in my Downloads page, there is a hidden downloadGroupCode parameter. So need not append it to url in the case of form submit.
	//	if(baseStr == 'dlm'){
			url = url + '&downloadGroupCode='+downloadGroupCode;
	//	}
		if(isEulaAccepted!= undefined && isEulaAccepted!=null && isEulaAccepted == true){
			startDownload(url, baseStr,tagId,productId);
		}else{
			startDownload(url, baseStr,tagId,productId);
		}
	}else{
		url = url + '&downloadGroupCode='+downloadGroupCode;
		startDownload(url, baseStr, tagId, productId);
	}	
	hideEulaModal();
	hideEulaDeclinedSection();	
	return false;
}


function getPlayerDownload(downloadGroupCode,downloadFileId,baseStr,hashKey, isEulaAccepted,tagId,productId){
	var url = $('#downloadFilesURL').val()+'&downloadFileId='+downloadFileId+'&vmware=downloadBinary&baseStr='+baseStr+'&hashKey='+hashKey+
				'&productId='+productId+'&tagId='+tagId;
	var page = $('#page').val();
	
	url = url + '&downloadGroupCode='+downloadGroupCode;
	startDownload(url, baseStr, tagId, productId);

	return false;
}

function startDownload(url, baseStr,tagId,productId){
	
	$.ajax({
				type : "POST",
				dataType : "json",
				async:    false,
				url : url,
				success : function(object) {

                try {
						if(object.error!='error'){
							var isdlm = object.dlm;
							var downloadURL = object.downloadUrl;
							//debug("is DLM? :: "+isdlm);
							if(isdlm == 'yes') {
								//debug("DLM yes");
								trackDownloads("DLM", object.fileType, object.fileName);
								window.open(downloadURL,'Download_File','height=250,width=350,scrollbars=no,resizable=yes' );
							/*	if((window.location.href).search('&refresh=true') ==-1){
									if((window.location.href).search('#eulaDeclinedSection') !=-1){
									//	window.location=(window.location.href).replace('#eulaDeclinedSection','&refresh=true');
									}
									else{
									//	window.location=window.location.href+'&refresh=true';
									}
								}
								else{
									if((window.location.href).search('#eulaDeclinedSection') !=-1){
									//	window.location=(window.location.href).replace('#eulaDeclinedSection','');
									}
								} */
							
								
								
								return false;
							} else {
								
								//window.open(downloadURL, 'Download_Manually_File');
								//Customer didnt like opening a pop up
								//window.location.href=downloadURL;
								
								if (!$("#downloadFrame").length){
									$('<iframe id="downloadFrame" name="downloadFrame" style="width:0px;height:0px;font-size:0">').appendTo('body');
								}	
								$("#downloadFrame").attr("src",downloadURL);

								trackDownloads("manual", object.fileType, object.fileName);
							/*	if((window.location.href).search('&refresh=true') ==-1){
								//	window.location=window.location.href+'&refresh=true';
								} */
								//debug("Manual yes");
								
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
/*
	if(baseStr=='dlm'){
		window.open(url,'Download_File','height=250,width=350,scrollbars=no,resizable=yes' );
	}else{
	//	document.forms["myDownloadsForm"].action = url;
	//	$('#myDownloadsForm').submit();
		window.open(url);
	} */
}

function submitForDownload(url, baseStr){
	if(baseStr=='dlm'){
		window.open(url,'Download_File','height=250,width=350,scrollbars=no,resizable=yes' );
	}else{
		document.forms["myDownloadsForm"].action = url;
		$('#myDownloadsForm').submit();
	}
}

function displayEulaDeclinedSection(){
	hideEulaModal();
	$("#eulaDeclinedSection").show();
	riaLink('EULA : declined');
	window.location='#eulaDeclinedSection';
}

function hideEulaDeclinedSection(){	
	$("#eulaDeclinedSection").hide();
}

function fillBreadcrumbs(){
	if(jQuery('.breadcrumbs')!=null && jQuery('#tempbreadcrumbs')!=null){
		jQuery('.breadcrumbs').html(jQuery('#tempbreadcrumbs').html());
		jQuery('#tempbreadcrumbs').html("").remove();
	}
}

function getEulaInfo(downloadGroupCode){
	var ajaxUrl = $("#getAcceptedEulaInfoAjaxURL").val();
	var eulaId = $("#eulaId").val();
	var downloadGroupId = $('#downloadGroupId').val();
	
	$.ajax({
		type : "POST",
		dataType : "html",
		url : ajaxUrl,
		data : {
			downloadGroupCode : downloadGroupCode
		},
		async : false,
		success : function(data) {
			try{
				if(data!=''){
					$("#updateEulaAccHiddenDiv").html(data);
					if($('#eulaAcceptAjaxResultStatus').val()=='success'){
						$("#eulaAgreementDiv").html($("#eulaAgreementDivHidden").html());
						$("#versionLabel").val($("#eulaVersion").val());
						hideEulaDeclinedSection();	
					}else if($('#eulaAcceptAjaxResultStatus').val()=='exception'){
						alert($('#eulaAcceptExceptionMsg').val());
					}			
				}					
			}catch(err){
				
			}
		}
		
	});
}

function acceptEulaForDlg(downloadGroupCode,productId){
	var url = $('#acceptEulaForDlgURL').val()+'&downloadGroupCode='+downloadGroupCode+'&downloadGroup='+downloadGroupCode+"&productId="+productId;
	location.href=url;	
	hideEulaModal();
	hideEulaDeclinedSection();

}

function openCloseFamilyInfoBinrayTabCategories(){
	// Open close tables
					var $more = $('.more-details');
					$more.each(function(){
						var $this = $(this);
						if($this.parents('table').hasClass('fn_startOpen')){
							$this.show().prev().find('.openClose').addClass('open'); //Hide all the more detail rows and remove open classes
							$this.show().prev().addClass('open'); 
						} else {
							//if(!$this.parents('table').hasClass('expanded')){
							$this.hide().prev().find('.openClose').removeClass('open'); //Hide all the more detail rows and remove open classes
							$this.hide().prev().removeClass('open');
							//}
						}
					});

}

function manageTab(){
	//Tab management - Hide and show the correct tabs
	 	$('.tabbed_area').each(function(){
	 		var $this = $(this),
	 			content_show;
	 		if($this.find('.tabs').length > 0){
	 			$this.find('.tabContent').hide();
	 			content_show = $this.find('.tabs .active').attr('id')
	 			$('#content_'+content_show).show();
	 		}
	 	});
		
	    // When a link is clicked   
	    $("a.tab").click(function () {   
	  		
	  		$this = $(this);
	        
	  		executeTab($(this))
	         
	    }); 
}


function executeTab(element){
	
	$this = $(element)
	// switch all tabs off   
    $this.parents('.tabs').find(".active").removeClass("active");   
		
    // switch this tab on   
    $this.addClass("active");   

    // slide all elements with the class 'content' up   
    $this.parents('.tabbed_area').find(".tabContent").hide();   

    // Now figure out what the 'title' attribute value is and find the element with that id.  
    var content_show = $this.attr("id");   
    $("#content_"+content_show).show();   
	
	var $allOpened = true;
	var $allClosed = true;
	var $thisContainer = $("#content_"+$this.attr("id"));
	
	var $totalProducts = $($thisContainer).find(".openCloseSelect").length;
	if($totalProducts == 0){
 		$thisContainer.find('.fn_expandAll').addClass('disabled');
		$thisContainer.find('.fn_collapseAll').addClass('disabled');
 	}else{
 		$thisContainer.find('.fn_expandAll').removeClass('disabled');
		$thisContainer.find('.fn_collapseAll').removeClass('disabled');
 	} 		

	var $openedProducts = $($thisContainer).find('.openCloseSelect a.open').length;
	
	if($openedProducts == ($totalProducts) ){
		$thisContainer.find('.fn_expandAll').addClass('disabled');
		$thisContainer.find('.fn_collapseAll').removeClass('disabled');
	}else{
		if($openedProducts == 0){
			$thisContainer.find('.fn_collapseAll').addClass('disabled');
		}else{
			$thisContainer.find('.fn_collapseAll').removeClass('disabled');
		}
		$thisContainer.find('.fn_expandAll').removeClass('disabled');
	}

	var $activeTab = 'content_'+$('.tabs .active').attr('id');
	var $parentDiv = $('#'+$activeTab);
	var $totalChildProdNum =  $('#'+$activeTab).find('.activitiesLog table .openCloseSelect').length;

	if($totalChildProdNum == 0) {
		$parentDiv.find('.fn_expandAll').addClass('disabled');
		$parentDiv.find('.fn_collapseAll').addClass('disabled');
	}
		return false;
}

function expandCollapseAll(){
		// Expand All / Collapse All
		$('.fn_expandAll').click(function(){
			//console.log('test');
			if(!$(this).hasClass('disabled')){
				$(this).parents('.tabContent').find('.openCloseSelect a').not('.open').trigger('click');
				$(this).parent().parent().find('.fn_collapseAll').removeClass('disabled');
			}
			return false;
		});
		$('.fn_collapseAll').click(function(){
			if(!$(this).hasClass('disabled')){
				$(this).parents('.tabContent').find('.openCloseSelect a.open').trigger('click');
				$(this).parent().parent().find('.fn_expandAll').removeClass('disabled');
				$(this).addClass('disabled');
			}
			return false;
		});	

		$('a.disabled').click(function(event){
			event.preventDefault();
			return false;
		});

}	

/**
     * Prints messages on console for debugging
     * 
     * @param msg
     */
    function debug(msg){

    	// comment out the below line while debugging
    	    	//console.log(msg);
    }   
		
	
	function setDownloadsOmniture(){
		
		//for product details page
		try{
			if($('#eulaOmnitureValue')!=undefined && $('#eulaOmnitureValue').val()!=undefined  ){
	//			debug($('#eulaOmnitureValue').val());
				riaLink('EULA');
			}
			
			if($('#eulaBetaOmnitureValue')!=undefined && $('#eulaBetaOmnitureValue').val()!=undefined ){
	//			debug($('#eulaBetaOmnitureValue').val());
				riaLink('EULA');
			}
			
			if($('#eulaMyDownloadsOmnitureValue')!=undefined && $('#eulaMyDownloadsOmnitureValue').val()!=undefined ){
	//			debug($('#eulaMyDownloadsOmnitureValue').val());
				riaLink('EULA');
			}
			
		}catch(e){
			//do nothing
		}
	
	}
	
	/**
	 * This is to track the Start download of Akamaiurls.
	 * We need a seperate method as to track the Type
	 */
	function trackDownloads(downloadType, fileType, fileName){
		
		try{
			if(fileType!=undefined && fileType!=null && fileType!=''){
				riaTrackDownloadsLink(fileType+" : "+downloadType, fileName);
			}else{
				riaTrackDownloadsLink(downloadType, fileName);
			}
			
			
		}catch(e){
			//do nothing.
		}
		
	}
	
	
	/*
	 * This is required, for downloads to set additional variables for tracking downloads.
	 * 
	 */
/*	function riaTrackDownloadsLink(appendName, fileName){
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
	}*/
	function riaTrackDownloadsLink(appendName, fileName){ //Changed to have event27 as an extra event
		s.linkTrackVars='prop1,prop2,prop10,prop34'; 
		s.linkTrackEvents='None'; 
		s.prop1 = getProp1(); 
		s.prop2 = getProp2(); 
		s.prop10 = fileName; 
		s.eVar10 = s.prop10; 
		s.events='event27'; 
		if (s.pageName){ 
			var ppn = s.pageName; 
			s.pageName += " : "+appendName; 
			s.prop34=s.pageName; 
			void(s.t()); 
			s.pageName = ppn; 
		} 
	}
	
	/*
	 * This is added to change View Eula to Accept Eula in details & get-download
	 */
	function changeViewToAcceptEula(){
		if($("#includeEulaClickLink")!=undefined && $("#includeEulaClickLink")!=null){
			setEulaToViewMode();
			$("#includeEulaClickLink").hide();
		}
		
		if($(".fn_showAcceptButton")!=undefined && $(".fn_showAcceptButton")!=null){
			var $showAcceptButton = $(".fn_showAcceptButton");
			
			$showAcceptButton.each(function(){
				var $this = $(this);
				$this.hide();
			});
		}

		
		if($("#includeViewEulaClickLink")!=undefined && $("#includeViewEulaClickLink")!=null){
			$("#includeViewEulaClickLink").show();
		}
		
	};
	function getParameterByName(name){
		name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
		var regexS = "[\\?&]" + name + "=([^&#]*)";
		var regex = new RegExp(regexS);
		var results = regex.exec(window.location.search);
		if(results == null)
			return "";
		else
			return decodeURIComponent(results[1].replace(/\+/g, " "));
	};
	function updateURLParameter(url, param, paramVal){
		var newAdditionalURL = "";
		var tempArray = url.split("?");
		var baseURL = tempArray[0];
		var additionalURL = tempArray[1];
		var temp = "";
		if (additionalURL) {
			tempArray = additionalURL.split("&");
			for (i=0; i<tempArray.length; i++){
				if(tempArray[i].split('=')[0] != param){
					newAdditionalURL += temp + tempArray[i];
					temp = "&";
				}
			}
		}
		var rows_txt = temp + "" + param + "=" + paramVal;
		return baseURL + "?" + newAdditionalURL + rows_txt;
	};
        function openSurvey() {                   
            var localeStr = $('#lsn').val();
            var selectedLocale='';
            //var localeStr = ($('#lsn').val()=="en")? "us" :$('#lsn').val();                
            if(localeStr == 'zh') 
            {
                selectedLocale = 'cn';
            }
            else if(localeStr == 'ko') 
            {
                selectedLocale = 'kr';
            }    
            else if(localeStr == 'en')
            {
                selectedLocale ='us';
            } 
            else if(localeStr == 'ja')
            {
                selectedLocale ='jp';
            } 
            else{
                selectedLocale = $('#lsn').val();
            }
            var fName = 'oo_dl_histclick_' + selectedLocale + '.show()';            
          //  eval(fName);               
        }