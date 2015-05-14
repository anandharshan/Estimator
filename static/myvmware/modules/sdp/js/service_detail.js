if (typeof(myvmware) == "undefined") myvmware = {};
sdp={};
VMFModuleLoader.loadModule("loading", function(){});
vmf.scEvent = true;
myvmware.sdp = {
	init:function(){
		myvmware.common.showMessageComponent('INSTANCE_DETAIL');
		var dtd = null;
		var nTr = null;
		sdp = myvmware.sdp;
		sdp.addOnVal = [];
		sdp.addOnDcVal = [];
		sdp.DCFlag = true;
		sdp.statusArr={"":rs.Show_All};
		sdp.statusArrDef="";
		sdp.cmn.addBreadScrumbDetails();
		//Add link in success response
		if(rs.encryptedRequestId && rs.encryptedRequestId.length>0)
			$(".alert-box-wrapper #_requestId").attr("href",rs.tab2.link+"&_VM_requestId="+encodeURIComponent(rs.encryptedRequestId)+"&_VM_productFamily="+rs.annualProductFamily); 
		//callBack.addsc({'f':'myvmware.common.showMessageComponent','args':['INSTANCE_DETAIL']});
		sdp.loadData(); // load data
		if(rs.oneTimeAvailable.toUpperCase() == "TRUE") sdp.loadOneTimeSkuTable();
		sdp.cmn.init();
		/*sdp.map = {
		"tab0" : {"url":availableAddonsUrl,"tab_cnt":"tab_container_1","hasData":0,"func":sdp.tabs.loadTab1Data,"sfunc":sdp.onSucess,"ffunc":sdp.onFailure,"nodata":sdp.emptyTab},
		"tab1" : {"url":requestedAddonsUrl,"tab_cnt":"tab_container_2","hasData":0,"func":sdp.tabs.loadTab2Data,"sfunc":sdp.onSucess,"ffunc":sdp.onFailure,"nodata":sdp.emptyTab}
		};
		if(rs.fromAddon) {
			sdp.tabs.loadTab2Data(sdp.map['tab1']);
			$('ul.tabs a').removeClass('active');
			$('ul.tabs a').eq(1).addClass('active');
			$('#tab_container_2').show();
			$('#tab_container_1').hide();
		} else {
			sdp.tabs.loadTab1Data(sdp.map['tab0']);
		}*/
		sdp.bindEvents();
		callBack.addsc({'f':'riaLinkmy','args':['subscription-service-detail']});
	},// End of INIT
	cmn:{
		init:function(){
			cur = myvmware.sdp.cmn;
			cur.bindEvents();
		},
		datatableLanguage: function() {
			var r = {}
			$.extend(r, { // for Datatable js
				sProcessing: rs.Loading,
				sLoadingRecords: "",
				sInfo: rs.recordsInfo, // default: "Showing _START_ to _END_ of _TOTAL_ entries"
				sInfoEmpty: '', // should be formatted like info, default: "Showing 0 to 0 of 0 entries"
				//sZeroRecords: '' // zero records, after filtering, default: "No matching records found"
				sEmptyTable: '', // zero records, regardless of filtering, default: "No data available in table"
				sInfoFiltered: rs.recordsFiltered, // default: "(filtered from _MAX_ total entries)"
				sLengthMenu: "<label>" + rs.itemsPerPage + "</label> _MENU_",
				oPaginate: {
					sPrevious: rs.DtablesPrevious,
					sNext: rs.DtablesNext,
					sLast: rs.DtablesLast,
					sFirst: rs.DtablesFirst
				}
			})
			return r
		},
		currency:{
			"FLAG": '',
			"USD": "$",
			"AUD": "$",
			"EUR": "€",
			"INR": "Rs"
		},
		currencyType:function(type, tblId, row){
			$(row).find('td').each(function(){
				if($(this).find('span.total').length){
					$(this).find('span.total').each(function(){
						$(this).before(type);
					});
				}
				if($(this).find('div.bRate').length){
					$(this).find('div.bRate').each(function(){
						$(this).prepend(type);
					});
				}
			});
		},
		convertToFloat:function(tblId, row, flag){
			flag = (typeof(flag) == 'undefined') ? 0 : flag;
			$(row).find('td').each(function(){
				if($(this).find('div.bRate span').length){
					$(this).find('div.bRate span').each(function(){
						var value = parseFloat($(this).html()).toFixed(2);
						if(!flag) $(this).html(cur.addComa(value)); else $(this).html(cur.addComa(value)).closest('div.bRate').append('*');
					});
				}
				if($(this).find('span.total').length){
					$(this).find('span.total').each(function(){
						var vals = parseFloat($(this).html()).toFixed(2);
						$(this).html(cur.addComa(vals));
					});
				}
			});
		},
		totalAmount: function(tblId,type){
			var month = 0, prepaid = 0, annual = 0, total = 0;
			if (tblId.find('tbody tr').length>0){
				tblId.find('tbody tr').each(function(){
					var countType = $(this).find('select.bType option:selected').val();
					if(countType.toLowerCase() == 'monthly') {
						month += parseFloat($(this).find('td:last span.total').attr('data-amount'));
					} else if(countType.toLowerCase() == 'annually') {
						annual += parseFloat($(this).find('td:last span.total').attr('data-amount'));
					} else {
						prepaid += parseFloat($(this).find('td:last span.total').attr('data-amount'));
					}
				});
			}
			total = parseFloat(month) + parseFloat(prepaid) + parseFloat(annual);
			total = (String(total).length) ? total : '0.00';
			month = (String(month).length) ? month : '0.00';
			prepaid = (String(prepaid).length) ? prepaid : '0.00';
			annual = (String(annual).length) ? annual : '0.00';
			$('span#contractVal').html(type+cur.addComa(total.toFixed(2)));
			$('span#mrValue').html(type+cur.addComa(month.toFixed(2)));
			$('span#arValue').html(type+cur.addComa(prepaid.toFixed(2)));
			$('span#anValue').html(type+cur.addComa(annual.toFixed(2)));
		},
		findTotal:function(elem,type){
			if(!elem.length) {cur.totalAmount($('#'+table),type); return;}
			var count = parseFloat((elem.val() == '' || elem.val() == 0) ? 1 : elem.val()),
				row = elem.closest('tr'), 
				table = elem.closest('table').attr('id'),
				remaining = elem.closest('tr').find('span.duration').attr('data-days').split('-'),
				price = 0,
				priceMode = (elem.closest('tr').find('select.bType option:selected').val()) ? elem.closest('tr').find('select.bType option:selected').val() : '';
				remaining[0] = (remaining[0] != '') ? remaining[0] : 1;
				remaining[1] = (remaining[1] != '') ? remaining[1] : 0;
				remaining[2] = (remaining[2] != '') ? remaining[2] : ((remaining[2] == '' && remaining[1] == '') ? 1 : 0);
				remaining[3] = (remaining[3] != '') ? remaining[3] : 365;
			row.find('div.bRate span').each(function(){ 
				price += parseFloat(cur.removeComa($(this).text()));
			});
			if (elem.closest('tr').find("select.bType").hasClass("oneTime")) var totalAmount= price * count;
			else 
				var totalAmount = (priceMode != '') ? ((priceMode.toLowerCase() == 'monthly') ? ((remaining[1] * price) + ((remaining[2] * price)/ 30))*count : ( (priceMode.toLowerCase() == 'annually') ? price * (remaining[0]/365)* count : price * (remaining[0]/remaining[3])* count)) : '';
			(totalAmount != '') ? row.find('span.total').attr('data-amount', totalAmount).html(cur.addComa(totalAmount.toFixed(2))) : '';
			cur.totalAmount($('#'+table),type);
		},
		updateRow:function(curRow){
			return function(data){
				if(typeof data=="string") data = vmf.json.txtToObj(data);
				var tableId = curRow.closest('table').attr('id');
				var dataTable = $('#'+tableId).dataTable(), rowData = curRow[0];
					var row = dataTable.fnGetPosition(rowData), settings = dataTable.fnSettings();
				dataTable.fnUpdate(data, row);
				dataTable.fnDraw();
				dataTable.oApi._fnInitComplete(settings);
				curRow.find('input.quant').trigger('keyup');
			}
		},
		addComa:function(string){
			var str = string.toString();
			var pattern = /(-?\d+)(\d{3})/;
			if(str.length >= 7){
				while(pattern.test(str))
					str = str.replace(pattern, "$1,$2");
					return str;
			} else {
				return str;
			}
		},
		removeComa:function(string) {
			return parseFloat(string.split(',').join(''));
		},
		adjustHeight:function(mTd,ttd){
			var tItems = $(ttd).find('div'), mItems = $(mTd).find('div'), hts = [];
			if(mItems.length == tItems.length) {
				$.each(mItems,function(i,k){
					($(tItems[i]).height() < $(k).height()) ? ($(tItems[i]).height($(k).height())) : ($(k).height($(tItems[i]).height()));
				});
			}
		},
		bindEvents: function(){
			$("a.exportCus").live("click",function(e){
				e.preventDefault();
				var that=this;
				if (!$("#exportFrame").length)
					$('<iframe id="exportFrame" name="exportFrame" style="width:0px;height:0px;font-size:0">').appendTo('body');
				$("#exportFrame").attr("src",$(that).attr("href"));
				if (typeof $(this).attr("data-track")!="undefined" && typeof riaLinkmy!="undefined"){
					riaLinkmy($(that).attr("data-track"));
				}
			});
			
			$("a.trackLink").live("click",function(){
				if (typeof $(this).attr("data-track")!="undefined" && typeof riaLinkmy!="undefined") riaLinkmy($(this).attr("data-track"));
			});
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
		}
	},
	addOnsInit:function(){
			myvmware.sdp.cmn.addBreadScrumbDetails();
			//myvmware.sdp.addOns.loadAddonTable();
			//myvmware.sdp.addOns.bindCalEvents();
			myvmware.sdp.cmn.init();
	},
	buildSelectBox:function(id,obj,def,flg,opt){// Make it common function
		var option=[];
		if(!flg) option.push("<option value='' selected='selected'>" + rs.Select_One + "</option>");
		for (key in obj){
			if (def && def==key)
				option.push("<option value='"+key+"' selected='selected'>"+obj[key]+"</option>");
			else 
				option.push("<option value='"+key+"'>"+obj[key]+"</option>");
		}
		$(id).html(option.join(""));

		if(opt) {
			if($(id+' option').length ==2)
    			 $(id+' option:eq(1)').attr('selected', 'selected');
    	}
	},
	dataTableSuccess:function(table){
		var exportLink = '.'+table.attr('id');
		if(table.find('tbody tr td').length != 1 ) {
			$(exportLink).attr('data-list', 'true').show();
		} else {
			$(exportLink).attr('data-list', 'false').hide();
		}
		$(exportLink).attr('data-list', 'true').show();
	},
	dataTableError:function(table,json){
		var err_msg = (json.ERROR_MESSAGE) ? json.ERROR_MESSAGE : rs.genericError;
		var emptyRow =table.find("tbody tr td.dataTables_empty"), exportLink = '.'+table.attr('id');
		$(exportLink).attr('data-list', 'false').hide();
		if(emptyRow.length) emptyRow.html(err_msg).closest("tr").show();
		else {
			$("<tr><td colspan="+table.fnSettings().aoColumns.length+" class=\"dataTables_empty\">"+err_msg+"</td></tr>").appendTo(table.find("tbody")).show();
		}
	},
	showErrorModal: function(msg){
		vmf.modal.show("errorModal",{
			onShow : function(){
				$("#errorModal #msg").html(msg);
			}
		});
	},
	bindEvents:function(){ //Bind Events
		//For modal functionality on click of EDIT(subscription renews).
		/*$('input:checkbox', $('#tbl_addons')).live('click', function(){
			if ($('input:checkbox:checked', $('#tbl_addons')).length > 0)
				$('#btn_buyAddon').removeAttr('disabled').removeClass('disabled').addClass('purchase');
			else
				$('#btn_buyAddon').attr('disabled','disabled').removeClass('purchase').addClass('disabled');
		});*/
		$('.fundChange').bind('click',function(e){
			e.preventDefault();
			vmf.modal.show('fundChangeMW',{
				onShow: function () {
					$('.fund_continue').addClass('disabled').attr('disabled',true);
					vmf.ajax.post(rs.chooseFundUrl,'',function(jsonResp){
						var funDetailsHolder = [];
						var data = vmf.json.txtToObj(jsonResp);
						$('.eaName').html(data.eaName);
						$('.eaNumber').html(data.eaNumber);
						var arrLen = data.fundDetails
						for( i =0; i < arrLen.length; i++){
							var value="";
							if (arrLen[i].redemptionCurrency=="JPY") {
								value = parseFloat(arrLen[i].balance).toFixed(0);
							}else{
								value = parseFloat(arrLen[i].balance).toFixed(2);	
							}
							var fundDetailsTemplate = '<li><input type="radio" name="funID" value="' + arrLen[i].id+ '" class="relationRadio" /><h6> '+arrLen[i].name+'</h6> <span>' + rs.balance + ' ' +arrLen[i].currency+''+cur.addComa(value)+ '</span><span> ' + rs.expiry + ' ' +arrLen[i].expiry+' </span></li>';
							funDetailsHolder.push(fundDetailsTemplate);
						}
						$('.fundDetailsUl').append('<ul>' + funDetailsHolder.join('') + '</ul>');

					},'',function(){vmf.loading.hide()},
				null,
				function(){vmf.loading.show()});
				}
			
			});
		});
		$('.relationRadio','#fundChangeMW').live('change',function(){
			var isChecked = $('.relationRadio:checked').length;			
			if (isChecked>0) {
				$('.fund_continue').removeClass('disabled').attr('disabled',false);				
			}
			$("#fundChangeMW").closest(".simplemodal-container").height($("#fundChangeMW").height());
			$.modal.setPosition();
		});
		$('.fund_continue').bind('click',function(){
			var selectedFnId = $('.relationRadio:checked').val(),
				fndEaName = $('.eaName','#fundChangeMW').val(),
			 	goToUrl = rs.ChangeFundUrl+'&_VM_fundGroupID='+selectedFnId+'&_VM_serviceID='+rs.encryptedServiceInstanceId;
			 	window.location.href = goToUrl;
			 	vmf.modal.hide();
		});
		$("#launchProduct").bind('click',function(e){
			e.preventDefault();
			if (typeof riaLinkmy!= "undefined") riaLinkmy("subscription-service-detail : launchvCHS")
			setTimeout(function(){window.open(rs.launchProdUrl)},500);
		})
		$('a.autoCloseBtn').live('click', function(){
			$(this).closest('div.autoClose').hide();
		});
		$('#selectdropdown').val('').change(function() {
			if($.trim($(this).val()).length) window.location = $(this).val();
		});
		$("#renewCancel,.closeRenew").live("click",function(){
			if(typeof riaLinkmy !="undefined") riaLinkmy("service-instance-detail : choose-renewal:cancel");
		});
		$('.purchaseAddon','.serviceDetailPage').live('click',function(e){
			if (rs.managePermission=='false') {
				e.preventDefault();
				vmf.modal.show('availableAddonConfirmation',{});
			}
		});
		$('#exportrBtn','#availableAddonConfirmation').bind('click',function(){
			window.location.href=rs.excelAddons;
			vmf.modal.hide();
		});
		/*$('#btn_buyAddon').click(function(){ 
			var val = [], dC, dCVal = [];
			if(typeof riaLinkmy !="undefined") riaLinkmy('subscription-service-detail : purchase');
			$(this).attr("disabled","disabled");
			$(':checkbox:checked').each(function(){
				if(($(this).attr('category')).toLowerCase() == (rs.directConnectDisplay).toLowerCase()) {
					sdp.addOnDcVal.push($(this).val());
					dC = true;
				} else {
					sdp.addOnVal.push($(this).val());
				}
			});
			if((rs.networkConnectivity).toLowerCase() == 'true' && sdp.DCFlag) {
				sdp.DCFlag = false;
				if(dC) {
					vmf.modal.show('directConnectConfirmation');
					$('#directConnectConfirmation').find('input:radio').eq(0).attr("checked","checked");
				} else {
					$('#purchaseAddonValues').val(sdp.addOnVal);
					document.forms[0].submit();
				}
			} else {
				var val = $.merge(sdp.addOnDcVal, sdp.addOnVal);
				$('#purchaseAddonValues').val(val);
				document.forms[0].submit();
			}
		}); */
		$('button#dConnect').live('click', function(){
			if(($('#directConnectConfirmation').find('input:radio:checked').val()).toLowerCase() == 'yes') {
				var val = $.merge(sdp.addOnDcVal, sdp.addOnVal);
				$('#purchaseAddonValues').val(val);
				document.forms[0].submit();
			} else {
				if(sdp.addOnVal.length) {
					$('#purchaseAddonValues').val(sdp.addOnVal);
					document.forms[0].submit();
				} else {
					//$('input', $('#tbl_addons')).removeAttr('checked');
					sdp.addOnDcVal = [];
					sdp.addOnVal = [];
				}
			}
			vmf.modal.hide();
		});
		$('a.modalCloseImg').live('click', function(){
			sdp.addOnDcVal = [];
			sdp.addOnVal = [];
			$('#btn_buyAddon').removeAttr('disabled');
		});
		$(".fn_cancel").bind("click",function(){vmf.modal.hide()});
		$('#editFnName').click(function(){
			vmf.modal.show('DefaultMonthlyAmt',{
				checkPosition: true,
				onShow: function (dialog) {
					$('#monthlyLimitVal').val($('#monthlyLimit span:first').text());
						$('.modalContent .fn_save').click(function(){
						//sdp.saveDefaultThresholdLimit
						var _postData = new Object(); 
						_postData['thresholdLimit'] = $('input#monthlyLimitVal').val();
						_postData['thresholdType'] =  "default"		
						vmf.ajax.post(setThresholdURL,_postData,function(){
								$('#monthlyLimit span:first').text( _postData['thresholdLimit']);
							},
							function(){
								myvmware.sdp.showErrorModal(rs.genericError);
							}
						);
						var tabId = (partnerType == 'RESELLER')?'#tbl_pCustomer':'#tbl_pReseller';
						vmf.datatable.reload($(tabId),sdpSubscriptionCustomerSummaryUrl)
						vmf.modal.hide();
					});
				}
			});
		});
		/*$('ul.tabs li a').click(function(o,i){
			$('ul.tabs li a').removeClass('active');
			$(this).addClass('active');
			var idx = $(this).parent($(this)).index();
			$('div.tabs-wrapper a.exportCus').hide();
			if(idx == 0) {
				if($('a.tbl_addons').attr('data-list') == 'undefined' || $('a.tbl_addons').attr('data-list') == 'true'){
					$('a.tbl_addons').show();
				}
			} else {
				if($('a.tbl_addonsRequest').attr('data-list') == 'undefined' || $('a.tbl_addonsRequest').attr('data-list') == 'true'){
					$('a.tbl_addonsRequest').show();
				}
			}
			var m = sdp.map['tab'+idx];
			$('div.tabContainers').hide()
			$('#'+m.tab_cnt).show();
			if(m.tab_cnt=='tab_container_1' && ($('#tbl_addons tbody tr td').length > 1)){$('.btn_buyAddon').show();} else {$('.btn_buyAddon').hide();};
			if(!m.hasData) m.func(m);
			return false;
		});
		$('#btn_ApplyFilter').click(function(){//reload data on Apply Filter click
			$("#tbl_addonsRequest").next(".bottom").hide();
			var _postData = new Object(); 
			_postData['status'] = $("#list_status").val();
			sdp.statusArrDef = $("#list_status").val();
			vmf.datatable.reload($('#tbl_addonsRequest'),filteringRequestAddonsUrl,sdp.exportLink('a.tbl_addonsRequest', _postData),"POST",_postData);
			if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-service-detail : add-on-requests : filter");
		});
		$('#resetFilter').click(function(){
			$("#tbl_addonsRequest").next(".bottom").hide();
			$("#list_status").val('');
			sdp.statusArrDef="";
			vmf.datatable.reload($('#tbl_addonsRequest'),requestedAddonsUrl,"","","");
			sdp.exportLink('a.tbl_addonsRequest', '');
		});*/
		$('#applyFilter').click(function(){
			$("#tbl_components").next(".bottom").hide();
			var _postData = new Object(); 
			_postData['component'] = $("#filComponent").val();
			if(rs.productFamily=='0'){_postData['type'] = $("#filType").val();}
			_postData['order'] = $("#filOrder").val();
			vmf.datatable.reload($('#tbl_components'),filteringComponentsUrl,sdp.exportLink('a.tbl_components', _postData),"POST",_postData);
			if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-service-detail : filter");
		});
		$('#resetFilterContent').click(function(){
			$("#tbl_components").next(".bottom").hide();
			$("#filComponent").val('');
			if(rs.productFamily=='0'){$("#filType").val('');}
			$("#filOrder").val('');
			vmf.datatable.reload($('#tbl_components'),subscriptionDetailsUrl,"","","");
			sdp.exportLink('a.tbl_components', '');
		});
		$('input[name="renewService"]').live("click",function(){		 
			$('table tbody tr.hiddenAttention').hide();
			$(this).closest('tr').next('tr').show();
		});
		$('input#termCondition').click(function(){
			if($(this).is(':checked')){
				$('button#applyButton').removeClass('disabled').attr('disabled', false);
			} else {
				$('button#applyButton').addClass('disabled').attr('disabled', true);
			}
		});
		$('input#cancelRenewal, input#modifyRenewal, input#automaticRenewal').click(function(){
			$(this).closest('table').find('td.strong').each(function(){
				$(this).removeClass('strong');
			})
			$(this).closest('td').next().addClass('strong');
		});
		$('button#applyButton').click(function(){
			var _postData = new Object();
			$("span.error",("#EditRenewalSettings")).hide();
			var target = $('input[name="renewService"]:checked');
			_postData['_VM_subscriptionRenewValue'] = target.val();
			_postData['_VM_serviceInstanceIdForRenewal'] = encodeURIComponent(encryptedServiceInstanceId);
			vmf.ajax.post(applySubscriptionRenewsUrl, _postData, myvmware.sdp.updateRenewalOption(target),
				function(){$("span.error",("#EditRenewalSettings")).show()},
				function(){vmf.loading.hide()},
				null,
				function(){vmf.loading.show()
			});
		});
		
		if(!rs.viewStatement) {
			$('a#viewStatement').addClass('disabled').attr('disabled', 'disabled').attr('href', '#');
		} else {
			if((rs.showAllStatements).toUpperCase() == 'N') {
				$('a#viewStatement').addClass('disabled').attr('disabled', 'disabled').attr('href', '#');
			} else {
				$('a#viewStatement').removeClass('disabled').removeAttr('disabled');
			}
		}
		$(document).click(function(event) {
			var $this = $(event.target), manageServiceBtn = $('#manageService');
			if($this.hasClass('btnBg') && ($this.parent().hasClass('drpDownCont') || $this.parent().parent().hasClass('drpDownCont'))) {
				if(manageServiceBtn.hasClass('active')){
					manageServiceBtn.removeClass('active');
					manageServiceBtn.next().hide();
				} else {
					manageServiceBtn.addClass('active');
					manageServiceBtn.next().show();
				}
			} else {
				manageServiceBtn.removeClass('active');
				manageServiceBtn.next().hide();
			}
		});
		$('.dropDownbtns ul li a.editRenewal, td#renewOption a.editRenewal').click(function(){	
					vmf.loading.show();
					var currentSelected = $(this).attr('data-option');
					vmf.ajax.post(rs.getRenewalUrl,'',function(jsonResp){
						vmf.loading.hide();
						var data = vmf.json.txtToObj(jsonResp);
						if(data.ERROR_CODE){
							myvmware.sdp.showErrorModal(data.ERROR_MESSAGE);
						}else{
							var tempArray = data.renewalPreferenceList, tableText = '';
							$('input#termCondition').attr('checked', false);
							$.each(data.renewalPreferenceList, function(i,k){
								if(currentSelected.toUpperCase() == data.renewalPreferenceList[i][0].toUpperCase()){	
									tableText += "<tr><td class='data dataCell'><input type='radio' name='renewService' checked='checked' id='automaticRenewal' value='"+data.renewalPreferenceList[i][0].toUpperCase()+"' data-text='"+data.renewalPreferenceList[i][1]+"' /></td><td>"+data.renewalPreferenceList[i][2]+"</td></tr><tr class='hiddenAttention'><td colspan='2'><div class='alert-box-wrapper nomargin nopadding'><div class='alert-box-holder confirmMsg error'>"+data.renewalPreferenceList[i][3]+"</div></div></td></tr>";
								}
								else{
									tableText += "<tr><td class='data dataCell'><input type='radio' name='renewService' id='automaticRenewal' value='"+data.renewalPreferenceList[i][0]+"' data-text='"+data.renewalPreferenceList[i][1]+"' /></td><td>"+data.renewalPreferenceList[i][2]+"</td></tr><tr style='display:none' class='hiddenAttention'><td colspan='2'><div class='alert-box-wrapper nomargin nopadding'><div class='alert-box-holder confirmMsg error'>"+data.renewalPreferenceList[i][3]+"</div></div></td></tr>";
								}
							});		
							$('#editRenewalOptions table tbody').html(tableText);								
							vmf.modal.show('EditRenewalSettings');
						}
					},
					function(){
						vmf.loading.hide();
						myvmware.sdp.showErrorModal(rs.Exception_Try_again_later);
					});
						
					
		});
	},
	renewalModal: function(elem){
		var value = elem.attr('data-option');
		$('table tr.hiddenAttention').hide();
		$('input[type="radio"]', $('#EditRenewalSettings')).each(function(){
			$(this).closest('tr').find('td.strong').removeClass('strong');
			$(this).attr('checked', false);
			if($(this).val().toUpperCase() == value.toUpperCase()){
				$(this).attr('checked', true).closest('td').next().addClass('strong').closest('tr').next('tr').show();
			}
		});	
		vmf.modal.show('EditRenewalSettings',{
			"onShow": function(){
				if(rs.nfr=="true") $('#automaticRenewal').closest("tr").hide();
				$("span.error",("#EditRenewalSettings")).hide();
				if(typeof riaLinkmy !="undefined") riaLinkmy("service-instance-detail : choose-renewal");
			},
			"closeClass": "closeRenew"
		});
	},
	showRenewBeak: function(){
		myvmware.common.setBeakPosition({
			beakId:myvmware.common.beaksObj["SDP_BEAK_SUBSCRIPTION_INSTANCE_DETAIL_TERM"],
			beakName:"SDP_BEAK_SUBSCRIPTION_INSTANCE_DETAIL_TERM",
			beakHeading:rs.head_term,
			beakContent:rs.desc_term,
			target:$('#renewOption span'),
			beakLink:'#beak5',
			beakUrl:'//download3.vmware.com/microsite/myvmware/sdpcust2/index.html',
			isFlip:true,
			multiple:true
		});
	},
	updateRenewalOption: function(target){
		return function(data){
			if (data!=null && (data=="true" || data==true)){
				$("#renewOption span").html(target.attr("data-text"));
				$('a.editRenewal').attr("data-option",target.val());
				vmf.modal.hide('EditRenewalSettings');
				if(typeof riaLinkmy !="undefined") riaLinkmy("service-instance-detail : choose-renewal : submit : "+target.val());
			} else {
				$("span.error",("#EditRenewalSettings")).show();
			}
		}
	},
	exportLink:function(link, param) {
		var elem = $(link), url = elem.attr('data-url'), parameter = '';
		if(typeof(param) == 'object'){
			for(key in param){
				parameter += '&'+key+'='+param[key];
			}
		}
		elem.attr('href', url+parameter);
	},
	searchSuccessCallback : function(radioButtonValue){
		return function(event){
			if(event != null && (event == true || event=='true')){
					renewalStatus = radioButtonValue;
			};
			vmf.modal.hide();
		}
	},
	loadOneTimeSkuTable: function(){
		vmf.datatable.build($('#tbl_oneTimeSku'),{
			"bAutoWidth": false,
			"bPaginate": true,
			"sPaginationType": "full_numbers",
			"aLengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]],
			"iDisplayLength": 5,
			"sDom": 'zrt<"bottom"lpi<"clear">>',
			"bFilter": false,
			"aoColumns": [
				{"sTitle": "<span class='descending'>"+rs.service+"</span>", "sWidth":"350px"},
				{"sTitle": "<span class='descending'>"+rs.qty+"</span>", "sWidth":"60px"},
				{"sTitle": "<span class='descending'>"+rs.type+"</span>", "sWidth":"80px"},
				{"sTitle": "<span class='descending'>"+rs.orderid+"</span>","sWidth":"80px"},
				{"sTitle": "<span class='descending'>"+rs.status+"</span>","sWidth":"80px"}
			],
			"sAjaxSource": oneTimeComponentsUrl,
			"error":myvmware.sdp.dataTableError,
			"bServerSide": false,
			"bProcessing":true,
			"aaSorting": [[0, 'desc']],
			"oLanguage": myvmware.sdp.cmn.datatableLanguage(),
			"errMsg":rs.Unable_to_process_your_request,
			"fnInitComplete": function(){
				dtd = this;
				if(!$(dtd).find('tfoot').length)
				$(dtd).append('<tfoot><tr><td class="bottomarea" colspan=5"></td></tr></tfoot>');
				settings= this.fnSettings();
				if(settings.jqXHR && settings.jqXHR.responseText!==null && settings.jqXHR.responseText.length && typeof settings.jqXHR.responseText =="string"){
						var jsonResp = vmf.json.txtToObj(settings.jqXHR.responseText);
				}
				if( jsonResp.needODTWebformLink==true ) {	
					$.each(jsonResp.odtOrderIDList, function(i,k){						
						var divElem = document.createElement('div'),linkTxtElem = $('#odtMessageDefaultContent').clone(), linkTxt= $(linkTxtElem).html(), odtUrlLink = rs.odtwebformurl+'?_VM_serviceInstanceId='+encodeURIComponent(rs.odtencryptedServiceInstanceId)+'&_VM_orderId='+encodeURIComponent(k[1])+'&_VM_formId=2';
						$(divElem).append($(linkTxt));
						$(divElem).find('.orderId').html(k[0]);
						$(divElem).find('.odtUrl').attr('href',odtUrlLink);
						$('#odtMessage').append($(divElem)).show();
					});				
				}
			},
			"fnDrawCallback":function(){
				if(Math.ceil(this.fnSettings().fnRecordsDisplay()/this.fnSettings()._iDisplayLength)>1){
					$("#tbl_oneTimeSku_paginate").css("display", "block");
				} else {
					$("#tbl_oneTimeSku_paginate").css("display", "none");
				}
				if(this.fnSettings().fnRecordsDisplay()>parseInt($("#tbl_oneTimeSku_length option:eq(0)").val(),10)){
					$("#tbl_oneTimeSku_length").css("display", "block");
				} else {
					$("#tbl_oneTimeSku_length").css("display", "none");
				}
			}
		});
	},
	loadData:function(m){
		var hFlag = rs.productFamily*1,frstCol = (hFlag==1)?rs.horizonProduct:rs.comp, secCol = (hFlag==1)?rs.horizonSupportLevel:rs.qty,thirdCol = (hFlag==1)?rs.qty:rs.type;
		vmf.datatable.build($('#tbl_components'),{
			"bAutoWidth": false,
			"bPaginate": true,
			"sPaginationType": "full_numbers",
			"aLengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]],
			"iDisplayLength": 5,
			"sDom": 'zrt<"bottom"lpi<"clear">>',
			"bFilter": false,
			"aoColumns": [
				{"sTitle": "<span class='descending'>"+frstCol+"</span>", "sWidth":"350px"},
				{"sTitle": "<span class='descending'>"+secCol+"</span>", "sWidth":"60px"},
				{"sTitle": "<span class='descending'>"+thirdCol+"</span>", "sWidth":"80px"},
				{"sTitle": "<span class='descending'>"+rs.orderid+"</span>","sWidth":"80px"},
				{"sTitle": "<span class='descending'>"+rs.status+"</span>","sWidth":"80px"},
				{"sTitle": "<span class='descending'>"+rs.start+"</span>","sWidth":"100px"},
				{"sTitle": (hFlag==1)?"<span class='descending'></span>":"","bVisible":(hFlag==1)?true:false,"sWidth":(hFlag==1)?"100px":"0px"},
				{"sTitle": "","bVisible":false}
			],
			"sAjaxSource": subscriptionDetailsUrl,
			"error":myvmware.sdp.dataTableError,
			"bServerSide": false,
			"bProcessing":true,
			"aaSorting": [[0, 'desc']],
			"oLanguage": myvmware.sdp.cmn.datatableLanguage(),
			"errMsg":rs.Unable_to_process_your_request,
			"fnRowCallback": function(nRow, aData){
				var $nRow = $(nRow);
				if(hFlag=!1){
					if(aData[6].toUpperCase() == 'Y'){
						var msg = (aData[2].toUpperCase() == 'CORE') ? rs.prepaidCoreMsg : rs.prepaidAddonMsg;
						$nRow.find("td:eq(2)").html(aData[2]+' <span class="badge pre" title="'+msg+'">'+rs.prepaid+'</span>');
					}
				}else{
					//$nRow.find("td:eq(4)").addClass('alertColor31').html("<span class='alertIcon31' title='"+rs.alert_2+"' style='float:left'></span>"+aData[4]+"");
					$nRow.find("td:eq(6)").html('<a href="'+licenseKeysUrl+'&_VM_orderLineID='+encodeURIComponent(aData[8])+'&_VM_skuID='+encodeURIComponent(aData[9])+'">'+aData[6]+'</a>');
				}
				if(aData[7].toUpperCase() == 'Y'){
					$nRow.find('td:eq(3)').html(aData[3]+' <span class="badge ela" title="'+rs.elaAbbr+'">'+rs.ela+'</span>');
				}
				return nRow;
			},
			"fnInitComplete": function(){
				dtd = this;				
				if(!$(dtd).find('tfoot').length)
				if(hFlag==1){
					$(dtd).append('<tfoot><tr><td class="bottomarea" colspan="6"></td></tr></tfoot>');
				}
				else{
					$(dtd).append('<tfoot><tr><td class="bottomarea" colspan="7"></td></tr></tfoot>');
				}
				$("#tbl_components").next(".bottom").show();
				settings= this.fnSettings();
				if(settings.jqXHR && settings.jqXHR.responseText!==null && settings.jqXHR.responseText.length && typeof settings.jqXHR.responseText =="string"){
					var jsonResp = vmf.json.txtToObj(settings.jqXHR.responseText);
				}
				var networkMessage = $('#networkMessage');
				if(jsonResp.needDirectConnectForm=="true" && rs.networkConnectivity=="true") {
					networkMessage.show();
					networkMessage.find('#orderId').html(jsonResp.orderIDForDirectConnect);
					networkMessage.find('#nwUrl').attr('href',rs.networkFormURL);
					networkMessage.find('.directConnectId').html(rs.directConnect);
				} else {
					networkMessage.hide();
				}
				myvmware.sdp.dataTableSuccess($(dtd));
				//callBack.addsc({'f':'sdp.showRenewBeak','args':[]});
				//callBack.addsc({'f':'sdp.showLaunchBeak','args':[]});
				//callBack.addsc({'f':'sdp.showAvailAddonBeak','args':[]});
				//sdp.showRenewBeak();
				setTimeout(function(){sdp.showLaunchBeak()},2000); 
				//sdp.showAvailAddonBeak();
			},
			"fnDrawCallback":function(){
				if(Math.ceil(this.fnSettings().fnRecordsDisplay()/this.fnSettings()._iDisplayLength)>1){
					$("#tbl_components_paginate").css("display", "block");
				} else {
					$("#tbl_components_paginate").css("display", "none");
				}
				if(this.fnSettings().fnRecordsDisplay()>parseInt($("#tbl_components_length option:eq(0)").val(),10)){
					$("#tbl_components_length").css("display", "block");
				} else {
					$("#tbl_components_length").css("display", "none");
				}
				//callBack.addsc({'f':'sdp.showLaunchBeak','args':[]});
				sdp.showTooltip();
			}
		});
	}, // End of components datatable config
	/*showAvailAddonBeak:function(){
		//setTimeout(function(){
			myvmware.common.setBeakPosition({
				beakId:myvmware.common.beaksObj["SDP_BEAK_SUBSCRIPTION_INSTANCE_DETAIL_ADDON"],
				beakName:"SDP_BEAK_SUBSCRIPTION_INSTANCE_DETAIL_ADDON",
				beakHeading:rs.head_addon,
				beakContent:rs.desc_addon,
				target:$('.tabs-wrapper ul li:first a'),
				beakLink:'#beak6',
				beakUrl:'//download3.vmware.com/microsite/myvmware/sdpcust2/index.html',
				isFlip:false,
				multiple:true
			});
		//},1200);
	},*/
	showLaunchBeak: function(){
		myvmware.common.setBeakPosition({
			beakId:myvmware.common.beaksObj["SDP_BEAK_SUBSCRIPTION_INSTANCE_DETAIL_LAUNCH"],
			beakName:"SDP_BEAK_SUBSCRIPTION_INSTANCE_DETAIL_LAUNCH",
			beakHeading:rs.head_launch,
			beakContent:rs.desc_launch,
			target:$('#launchProduct'),
			beakLink:'#beak4',
			beakUrl:'//download3.vmware.com/microsite/myvmware/sdpcust2/index.html',
			isFlip:true,
			multiple:true
		});
	},
	showTooltip : function(){
		if($("a.fn_tooltip").length>0){
			var topOffset = 1;
			var leftOffset = 4;
			var placementClass = "";
			//Check if placement should be bottom
			if($("a.fn_tooltip").data('tooltip-position') == "bottom"){
				topOffset = 24;
				leftOffset = -72;
				placementClass = "bottom";
			}else{
				placementClass = "right";
			}
			$("a.fn_tooltip").accessibleTooltip({topOffset: topOffset,leftOffset: leftOffset,associateWithLabel:false,preContent: "<div class=\"arrow "+placementClass+"\"></div>"});
		}
	},
	showWarningModal : function(cont,flag, page) {
		$('a').click(function(e){
			var url=$(this).attr("href"); //Store Url

			//Check if the target is new window
			if($(this).attr("target") && ($(this).attr("target")=="_blank" || $(this).attr("target")=="_new") || $(this).hasClass("help")) return true;

			//Check if the target is empty
			if(!url.length || url=="#" || url == "javascript:void(0)" || $('#tbl_addOnReq tbody tr td').length == 1 || $(this).hasClass("enableLink")) return true;

			//Stop default action
			e.preventDefault();

			vmf.modal.show(cont,{
				onShow: function(dialog){
					$('.modalContent button.primary').bind('click', function(){
						if (typeof riaLinkmy!="undefined") {
							if(flag)
								riaLinkmy('subscription-service-detail : warning : continue');
						}
						if(page == 'daas'){						
							daasForm.saveDraft(true);							
						} else {
							setTimeout(function(){window.location.replace(url)},500);
							vmf.modal.hide();
						}
					});
					$('.modalContent button.secondary').bind('click', function(){
						vmf.modal.hide();
						if (typeof riaLinkmy!="undefined") {
							if(flag) 
								riaLinkmy('subscription-service-detail : warning : cancel');
						}
						if(page == 'daas'){
							setTimeout(function(){window.location.replace(url)},500);
						} else {
							return false;
						}
					});
				}
			});
		});
	},
	tabs:{
		/*loadTab1Data:function(m){
			vmf.datatable.build($('#tbl_addons'),{
				"bAutoWidth": false,
				"bFilter": false,
				"bPaginate": false,
				"aLengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]],
				"iDisplayLength": 5,
				"sDom": 'zrt<"bottom"lpi<"clear">>',
				"bSort": false,
				"aoColumns": [
					{"sTitle": "", "bVisible":false},
					{"sTitle": "", "sWidth":"30", "bVisible":(rs.showPurchaseAddon.toUpperCase() == 'TRUE') ? true : false, "bSortable":false},
					{"sTitle": "", "sWidth":"350", "bSortable":false},
					{"sTitle": "<span style='padding-left:7px;'>"+rs.tab1.sku+"</span>", "sWidth":"205px", "bSortable":false},
					{"sTitle": "<span class=''>"+rs.tab1.billing_rate+"</span>", "sWidth":"200px","sClass":"rightAlign", "bSortable":false}
				],
				"sAjaxSource": m.url,
				"error":myvmware.sdp.dataTableError,
				"bServerSide": false,
				"bProcessing":true,
				"oLanguage": {"sProcessing" : "Loading...","sLoadingRecords":"", "sEmptyTable": "No data available in table","sInfo": "_START_ - _END_ of _TOTAL_ results","sInfoEmpty": ""},
				"fnRowCallback": function(nRow, aData){
					var $nRow = $(nRow), addon=aData[2].split('!|'), bill = aData[4].split('|'), sku = aData[3].split(','), skuData=[], billData=[], addonData=[], star="", supportClass;
					for(var j = 0; j< addon.length; j++){
						supportClass = (j!=0) ? "class=support-sku" :"";
						if (addon[j].length) addonData.push('<div '+supportClass+'>'+addon[j]+'</div>');
					}
					if(rs.showPurchaseAddon.toUpperCase() == 'TRUE'){
						$nRow.find("td:eq(1)").html(addonData.join(""));
					} else {
						$nRow.find("td:eq(0)").html(addonData.join(""));
					}
					
					for(var k = 0; k< sku.length; k++){
						if (sku[k].length) skuData.push('<div>'+sku[k]+'</div>');
					}
					if(rs.showPurchaseAddon.toUpperCase() == 'TRUE'){
						$nRow.find("td:eq(2)").html(skuData.join(""));
					} else {
						$nRow.find("td:eq(1)").html(skuData.join(""));
					}
					
					for(var i = 0; i< bill.length; i++){
						if (bill[i].length) billData.push('<div>'+bill[i]+star+'</div>');
					}
					if(rs.showPurchaseAddon.toUpperCase() == 'TRUE'){
						$nRow.find("td:eq(3)").html(billData.join("")).addClass('right');
					}else{
						$nRow.find("td:eq(2)").html(billData.join("")).addClass('right');
					}
					return nRow;
				},
				"fnInitComplete": function(){
					var addOns_tbl = this;
					var colspan = (rs.showPurchaseAddon.toUpperCase() == 'TRUE') ? 4 : 3;
					if($(addOns_tbl+ ' tfoot'.length == 0)) $(addOns_tbl).append('<tfoot><tr><td class="bottomarea" colspan="'+colspan+'"></td></tr></tfoot>');
					myvmware.sdp.dataTableSuccess($(addOns_tbl));
				},
				"fnDrawCallback":function(oSettings){
					var addOns_tbl = this, settings= this.fnSettings();
					if(Math.ceil(settings.fnRecordsDisplay()/settings._iDisplayLength)>1){
						$("#tbl_addons_paginate").css("display", "block");
					} else {
						$("#tbl_addons_paginate").css("display", "none");
					}
					if(settings.fnRecordsDisplay()>parseInt($("#tbl_addons_length option:eq(0)").val(),10)){
						$("#tbl_addons_length").css("display", "block");
					} else {
						$("#tbl_addons_length").css("display", "none");
					}
					$.each(this.find('tr'),function(i,v){
						if($(v).find('td:eq(2) div').length > 1) myvmware.sdp.cmn.adjustHeight($(v).find('td:eq(1)'),$(v).find('td:eq(2)'));
						if($(v).find('td:eq(3) div').length > 1) myvmware.sdp.cmn.adjustHeight($(v).find('td:eq(1)'),$(v).find('td:eq(3)'));
					});
					if($('#tbl_addons tbody tr td').length > 1){
						$('#btn_buyAddon').show();
						$('#tbl_addons').find('input[type=checkbox]').show();
					} else {
						$('#btn_buyAddon').hide();
						$('#tbl_addons').find('input[type=checkbox]').hide();
					}
					if (settings.fnRecordsDisplay()>0 && ($(this).find("input:checkbox:checked").length == settings.fnRecordsDisplay()))
						$(this).closest(".dataTables_wrapper").find(".tbl_selectAll").attr("checked",true);
						
						
					if(oSettings.aoData.length > 0){
						var i, 
						nTrs = addOns_tbl.find('tbody tr'),
						iColspan = $(nTrs[0]).find('td').length,
						lastComponent;
						for ( var i = 0; i < nTrs.length; i++) { 
							var $nRow = $(nTrs[i]);
							var rdata = oSettings.aoData[ oSettings.aiDisplay[i] ]._aData;
							var component = (typeof(rdata[0]) == 'string') ? rdata[0] : 'No Category';
							if (component != lastComponent) {
								//TODO need to changes inline css to class
								var rComponent = $('<tr>').html('<td style="padding:5px;"' + 'colspan="6" class="labelHead">' + component + '</td>').css({"height":"10px", "background-color":"#ccc"}); 
								rComponent.insertBefore(nTrs[i]);
								lastComponent = component;
							}
						}
					}
				}
			}); // End of addons
			m.hasData=1;
		},
		loadTab2Data:function(m){
			vmf.datatable.build($('#tbl_addonsRequest'),{
				"bAutoWidth": false,
				"bFilter": false,
				"bPaginate": true,
				"sPaginationType": "full_numbers",
				"aLengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]],
				"iDisplayLength": 5,
				"sDom": 'zrt<"bottom"lpi<"clear">>',
				"aoColumns": [
					{"sTitle": "<span class='descending'>"+rs.tab2.ao_aor+"</span>", "sWidth":"60"},
					{"sTitle": "<span class='descending'>"+rs.tab2.status+"</span>", "sWidth":"70"},
					{"sTitle": "<span class='descending'>"+rs.tab2.comp+"</span>", "sWidth":"300px"},
					{"sTitle": "<span class='descending'>"+rs.tab2.qty+"</span>","sWidth":"50"},
					{"sTitle": "<span class='descending'>"+rs.tab2.ao_sub+"</span>","sWidth":"120"},
					{"sTitle": "<span class='descending'>"+rs.tab2.ao_odate+"</span>", "sWidth":"100"},
					{"sTitle": "", "bVisible":false},
					{"sTitle": "", "bVisible":false}
				],
				"sAjaxSource": m.url,"bServerSide": false,"bProcessing":true,
				"error":myvmware.sdp.dataTableError,
				"aaSorting": [[0, 'desc']],
				"oLanguage": {
					"sProcessing" : "Loading...",
					"sLoadingRecords":"", 
					"sEmptyTable": rs.no_addon_request_available, 
					"sInfoEmpty": "", 
					"sInfo": "_START_ - _END_ of _TOTAL_ results",
					"sZeroRecords": "No records to display"
				},
				"fnInitComplete": function(){
					dtd = this;
					if(rs.fromAddon) {
						dtd.find('tbody tr').eq(0).find('td').eq(0).append('<sup class="newRequest">New!</sup>');
					}
					if(!$(dtd).find('tfoot').length)
					$(dtd).append('<tfoot><tr><td class="bottomarea" colspan="6"></td></tr></tfoot>');
					sdp.buildSelectBox("#list_status",sdp.statusArr,sdp.statusArrDef,true);
					settings= this.fnSettings();
					myvmware.sdp.dataTableSuccess($(dtd));
				},
				"fnRowCallback": function(nRow, aData){
					var $nRow = $(nRow), comp, quan, quanData = '', compData = '', className='';
					comp = aData[2].split('!|');
					quan = aData[3].split(',');
					for(var i = 0; i< comp.length; i++){
						if(comp[i].length) compData += '<div class="'+className+'">'+comp[i]+'</div>';
					}
					for(var i = 0; i< quan.length; i++){
						if(quan[i].length) quanData += '<div>'+quan[i]+'</div>';
					}
					$nRow.find("td:eq(2)").html(compData);
					$nRow.find("td:eq(3)").html(quanData);
					$nRow.find("td:eq(0)").html('<a href="'+rs.tab2.link+'&_VM_requestId='+encodeURIComponent(aData[6])+'&_VM_productFamily='+aData[8]+'">'+aData[0]+'</a>');
					return nRow;
				},
				"fnDrawCallback":function(){
					if(Math.ceil(this.fnSettings().fnRecordsDisplay()/this.fnSettings()._iDisplayLength)>1){
						$("#tbl_addonsRequest_paginate").css("display", "block");
					} else {
						$("#tbl_addonsRequest_paginate").css("display", "none");
					}
					if(this.fnSettings().fnRecordsDisplay()>parseInt($("#tbl_addonsRequest_length option:eq(0)").val(),10)){
						$("#tbl_addonsRequest_length").css("display", "block");
					} else {
						$("#tbl_addonsRequest_length").css("display", "none");
					}
					$("#btn_ApplyFilter, #resetFilter").removeAttr("disabled");
					var set= this.fnSettings();
						//Creating status dropdown inside fnrowCallaback will not work due to client side pagination. We have to get status and type in another object if it is serverside
					if(set.jqXHR && set.jqXHR.responseText!==null && set.jqXHR.responseText.length && typeof set.jqXHR.responseText =="string"){
						sdp.statusArr = vmf.json.txtToObj(set.jqXHR.responseText).statuses;
					}
					$.each(this.find('tr'),function(i,v){
						if($(v).find('td:eq(3) div').length > 1) myvmware.sdp.cmn.adjustHeight($(v).find('td:eq(2)'),$(v).find('td:eq(3)'));
					});
					$(this).next(".bottom").show();
				}
			}); // End of related services table
			m.hasData=1;
			if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-service-detail : add-on-requests");
		},
		purchaseAddons:function(){// not using now
			var val = [];
			$(':checkbox:checked').each(function(i){
				val[i] = $(this).val();
			});
			$('purchaseAddonValues').val(val);
			document.forms[0].submit();
		}*/
	},//end of tabs object
	addOns:{
		/*loadAddonTable:function(){
			$('input:checkbox').each(function(){
				$(this).attr('checked', false);
			});
			myvmware.sdp.addOns.dt=null;
			myvmware.sdp.addOns.qty=null;
			myvmware.sdp.addOns.currency=null;
			vmf.datatable.build($('#tbl_addOnReq'),{
				"bAutoWidth": false,
				"bFilter": false,
				"sDom" : 'zrtSpi',
				"bPaginate": false,
				"bInfo":false,
				"aoColumns": [
					{"sTitle": "<input id='checkall' class='tbl_selectAll' type='checkbox'>", "sWidth":"30px","bSortable":false},
					{"sTitle": "<span class='descending'>"+rs.adon+"</span>","sWidth":"190px"},
					{"sTitle": "<span class='descending'>"+rs.sku+"</span>","sWidth":"110px" },
					{"sTitle": "<span class='descending'>"+rs.quan+"</span>","sWidth":"50px" },
					{"sTitle": "<span class='descending'>"+rs.bType+"</span>","sWidth":"80px" },
					{"sTitle": "<span class='descending'>"+rs.bRate+"</span>","sWidth":"100px","sClass":"rightAlign"},
					{"sTitle": "<span class='descending'>"+rs.remPer+"</span>","sWidth":"100px"},
					{"sTitle": "<span class='descending'>"+rs.totOrd+"</span>","sWidth":"100px","sClass":"rightAlign","sType":"numeric-comma","sSortDataType":"dom-currency"},
					{"sTitle": "","bVisible":false},
					{"sTitle": "","bVisible": false}
				],
				"sAjaxSource": editAvailableAddonsUrl,
				"aaSorting": [[1, 'desc']],
				"error":myvmware.sdp.dataTableError,
				"bServerSide": false,
				"bProcessing":true,
				"oLanguage": {"sProcessing" : "Loading...","sLoadingRecords":"", "sEmptyTable": "No data available in table", "sInfo": "_START_ - _END_ of _TOTAL_ results","sInfoEmpty": ""},
				"fnRowCallback": function(nRow,aData,iDisplayIndex){ 
					var $nRow=$(nRow), bRate, bRateData = '', bType, hClass, bTypeData = '', sku, skuData = '',comp, compData = '',
						settings= this.fnSettings();
					if(settings.jqXHR && settings.jqXHR.responseText!==null && settings.jqXHR.responseText.length && typeof settings.jqXHR.responseText =="string"){
						var jsonResp = vmf.json.txtToObj(settings.jqXHR.responseText);
					}
					comp = aData[1].split('!|');
					for(var i = 0; i< comp.length; i++){
						supportClass = (i!=0) ? "class=support-sku" :"";
						if(comp[i].length) compData += '<div '+supportClass+'>'+comp[i]+'</div>';
					}
					$nRow.find("td:eq(1)").html(compData);
					
					if($nRow.attr('data-val') == 1){
						$nRow.find("td:eq(0)").html("<input type='checkbox' idx='"+iDisplayIndex+"' value='"+aData[0]+"' checked='checked'>");
					} else {
						$nRow.find("td:eq(0)").html("<input type='checkbox' idx='"+iDisplayIndex+"' value='"+aData[0]+"'>");
					}
					$nRow.find("td:eq(3)").html("<input type='text' class='quant' size='4' maxlength='3' idx='"+iDisplayIndex+"' value='"+aData[3]+"'>");
					
					bType = aData[4].split(',');
					for(var j = 0; j< bType.length; j++){
						bTypeData += '<option value="'+bType[j]+'">'+bType[j]+'</option>';
					}
					hClass= ['bType'];
					if(bType.length == 1) {
						hClass.push("hidden");
						if (aData[8].toUpperCase() == 'Y') hClass.push("oneTime");
						$nRow.find("td:eq(4)").append('<select class="'+hClass.join(" ")+'">'+bTypeData+'</select>');
					}
					else{
					$nRow.find("td:eq(4)").html('<select class="'+hClass.join(" ")+'">'+bTypeData+'</select>');}
					bRate = aData[5].split(',');
					for(var i = 0; i< bRate.length; i++){
						var type = '';
						if(i == 0){
							type = (bType[0] == 'Monthly') ? rs.permonth : ((bType[0] == 'Prepaid') ? rs.fortxt+' '+jsonResp.tPeriod+' '+rs.months : ( ((bType[0]).toLowerCase() == 'annually') ? rs.annual : '')); // Modified by Sathya
						}
						if(bRate[i].length) bRateData += '<div class="bRate"><span>'+bRate[i]+'</span>* '+type+'</div>';
					}
					$nRow.find("td:eq(5)").html(bRateData).addClass('right');
					
					sku = aData[2].split(',');
					for(var k = 0; k< sku.length; k++){
						if (sku[k].length) skuData += '<div>'+sku[k]+'</div>';
					}
					
					var duration = aData[6].split(',');
					if(isNaN(parseInt(duration[0])) || parseInt(duration[0]) == 0) {
						duration[0] = 1;
						duration[1] = '1 Day';
					}
					$nRow.find("td:eq(6)").html('<span class="duration" data-days="'+duration[0]+'">'+duration[1]+'</span>');
					
					$nRow.find("td:eq(2)").html(skuData);
					$nRow.find("td:eq(7)").html('<span class="total" data-amount="'+aData[7]+'">'+aData[7]+'</span>*').addClass('right');
					return nRow;
				},
				"fnDrawCallback":function(){
					var tbl_addOnReq = this, settings= this.fnSettings();
					if(settings.jqXHR && settings.jqXHR.responseText!==null && settings.jqXHR.responseText.length && typeof settings.jqXHR.responseText =="string"){
						var jsonResp = vmf.json.txtToObj(settings.jqXHR.responseText);
						myvmware.sdp.addOns.currency = jsonResp.currency;
						tbl_addOnReq.find('tbody tr').each(function(){
							cur.currencyType(jsonResp.currency, tbl_addOnReq, $(this));
							cur.convertToFloat(tbl_addOnReq, $(this));
							cur.findTotal($(this).find('input.quant'),myvmware.sdp.addOns.currency);
						});
					}
					if(Math.ceil(settings.fnRecordsDisplay()/settings._iDisplayLength)>1){
						$("#tbl_addOnReq_paginate").css("display", "block");
					} else {
						$("#tbl_addOnReq_paginate").css("display", "none");
					}
					if(settings.fnRecordsDisplay()>parseInt($("#tbl_addOnReq_length option:eq(0)").val(),10)){
						$("#tbl_addOnReq_length").css("display", "block");
					} else {
						$("#tbl_addOnReq_length").css("display", "none");
					}
					$.each(this.find('tr'),function(i,v){
						if($(v).find('td:eq(2) div').length > 1) myvmware.sdp.cmn.adjustHeight($(v).find('td:eq(1)'),$(v).find('td:eq(2)'));
						if($(v).find('td:eq(5) div').length > 1) myvmware.sdp.cmn.adjustHeight($(v).find('td:eq(1)'),$(v).find('td:eq(5)'));
					});
				},
				"fnInitComplete": function(){
					var dtd = this;
					myvmware.sdp.addOns.dt=dtd;
					if(!$(dtd).find('tfoot').length) $(dtd).append('<tfoot><tr><td colspan="8"></td></tr></tfoot>');
					myvmware.common.selectAllChks(dtd,function($tbl){
						if ($tbl.find('tbody input[type=checkbox]:checked').length > 0)
							$('#btn_remove').removeAttr('disabled').removeClass('secondary disabled').addClass('primary');
						else
							$('#btn_remove').attr('disabled','disabled').addClass('secondary disabled').removeClass('primary');
					});
					if($("input#agree").is(':checked') && $('#tbl_addOnReq tbody tr input:checkbox').length > 0) { 
						$('button#submitRequest').removeClass('disabled').removeAttr('disabled');
					}
				}
			});
			callBack.addsc({'f':'riaLinkmy','args':['subscription-services : add-on-request-order']});
		},
		bindCalEvents:function(){
			/*$('input:checkbox', $('#tbl_addOnReq')).live('click', function(){
				if($(this).is(':checked')){
					$(this).closest('tr').attr('data-val', 1);
				} else {
					$(this).closest('tr').attr('data-val', 0);
				}
			});
			$("#checkall").live("click",function(){
				if($(this).is(':checked')){
					$('input:checkbox', $('#tbl_addOnReq')).closest("tr").attr('data-val', 1);
				} else {
					$('input:checkbox', $('#tbl_addOnReq')).closest("tr").attr('data-val', 0);
				}
			});
			$('input:text', $('#tbl_addOnReq')).live('keypress', function(e){
				var event = e.which;
				if((event >= 48 && event <= 57) || event == 8 || event == 0) {
					return true;
				} else {
					return false;
				}
			}).live('focus', function(){
				myvmware.sdp.addOns.qty = $(this).val();
			}).die('keyup').live('keyup', function(){
				cur.findTotal($(this),myvmware.sdp.addOns.currency);
			});
			var existingVal = "";
			$('input:text, select.bType', $('#tbl_addOnReq')).live('focus', function(){
				existingVal = $('select.bType', $('#tbl_addOnReq')).val(); 
			});
			$('input:text, select.bType', $('#tbl_addOnReq')).die('change').live('change', function(){
				var curRow = $(this).closest('tr');
				if ($(this).closest('tr').find('td:eq(3) input').val() == 0 || $(this).closest('tr').find('td:eq(3) input').val() == "") { 
					$(this).closest('tr').find('td:eq(3) input').val(myvmware.sdp.addOns.qty);
					return;
				}
				var _postData = {
					"_VM_currentPaymentType": existingVal,
					"modifiedPlanNumber": $(this).closest('tr').find('td:eq(0) input:checkbox').val(),
					"modifiedQuantity": ($(this).closest('tr').find('td:eq(3) input').val() != 0) ? $(this).closest('tr').find('td:eq(3) input').val() : 1,
					"monthlyType": $(this).closest('tr').find('td:eq(4) select option:selected').val()
				};
				vmf.ajax.post(modifyCostsUrl, _postData, cur.updateRow(curRow),function(){vmf.loading.hide()},function(){vmf.loading.hide()},null,function(){vmf.loading.show({"overlay":true})});
			});
			$('select.bType', $('#tbl_addOnReq')).die('change').live('change', function(){cur.totalAmount($('#tbl_addOnReq'),myvmware.sdp.addOns.currency)});
			$("#submitRequest").bind('click',function(){
				$(this).attr("disabled","disabled").addClass("disabled");
				if($('input[type="checkbox"][name="agree"]').is(":checked")) myvmware.sdp.addOns.retriveData(this);
				else alert("Please accept terms and conditions");
			});

			//myvmware.sdp.showWarningModal('navigateAway', true);
			
			$('#btn_remove').die('click').live('click', function(){
				if($('#tbl_addOnReq thead tr th input#checkall').is(':checked')) {
					vmf.modal.show('navigateAway',{
						onShow: function(){
							$('.modalContent button.primary').bind('click', function(){
								myvmware.sdp.addOns.delRows($('#btn_remove'));
								vmf.modal.hide();
							});
							$('.modalContent button.secondary').bind('click', function(){
								vmf.modal.hide();
								return false;
							});
						}
					});
				} else {
					myvmware.sdp.addOns.delRows($('#btn_remove'));
				}
			});
			$("input#agree").bind("click",function(){
				if($(this).is(":checked") && $('#tbl_addOnReq tbody tr input:checkbox').length>0) $("#submitRequest").removeAttr('disabled').removeClass('disabled');
				else $("#submitRequest").attr('disabled',true).addClass('disabled');
			});
		},
		delRows: function(button){
			var selRows=$('#tbl_addOnReq tbody tr input:checkbox:checked').closest('tr');
			if(!selRows.length) return;
			$.each(selRows,function(i,v){
				myvmware.sdp.addOns.dt.fnDeleteRow(myvmware.sdp.addOns.dt.fnGetPosition($(v)[0]));
			});
			if(!$('#tbl_addOnReq tbody tr input:checkbox').length){
				$("#submitRequest").attr('disabled',true).addClass('disabled');
				$(".tbl_selectAll").attr("checked",false).attr("disabled","disabled");
			}
			button.addClass("disabled").attr("disabled","disabled");
		},
		retriveData: function(elem) {
			var _id = [], _quantity = [], _type = [], _total = [], url = '', table = $('#tbl_addOnReq'), setting;
			var oTable = $('#tbl_addOnReq').dataTable(), dcPurchased = 0, otherPurchased = 0,tenantTypeFlag;
			url = $(elem).closest('form').attr('action');
			$('table#tbl_addOnReq tbody tr').each(function(){
				_id.push($(this).find('td:eq(0) input').val());
				_quantity.push($(this).find('td:eq(3) input').val());
				_type.push($(this).find('td:eq(4) select option:selected').val());
				_total.push($(this).find('td:eq(7)').text());
			});
			$('input#planNumbers', 'form[name="addOnRequest"]').val(_id.join(','));
			$('input#quantities', 'form[name="addOnRequest"]').val(_quantity.join(','));
			$('input#type', 'form[name="addOnRequest"]').val(_type.join(','));
			$('input#totalOrderValue', 'form[name="addOnRequest"]').val(_total.join(','));
            var type= rs.tenantType, availQuotaUrl = calculateDirectAddonsAvailableQuotaUrl,_postData = $.trim($(".instanceId").text());
            for(var i = 0; i < oTable.fnSettings().fnRecordsDisplay(); i++){
                var lastColumn = oTable.fnGetData(i,9).split('|');
                if(lastColumn[0] == rs.directConnect){
                    dcPurchased = dcPurchased + parseInt(oTable.fnGetData(i,3)) * parseInt(lastColumn[1]);
                }else{
                	if(lastColumn[0] != "")
                    	otherPurchased = otherPurchased + parseInt(oTable.fnGetData(i,3)) * parseInt(lastColumn[1]);
                }                
            }
            if(dcPurchased > 0){
                function erroModalHide(){
                    $(".errorOK, a.modalCloseImg.simplemodal-close,.fn_cancel").bind("click",function(){
                        vmf.modal.hide();
                        $("#AddOnTable #agree").attr('checked', false);
                    });
                }
                vmf.ajax.post(availQuotaUrl, _postData, function(data){
                    if(data.hasOwnProperty('ERROR_MESSAGE')){
                        myvmware.sdp.showErrorModal(data.ERROR_MESSAGE);
                        erroModalHide();
                    }else{
                        if (typeof data!="object") data=vmf.json.txtToObj(data);
                        tenantTypeFlag = (dcPurchased > (otherPurchased + parseInt(data.availableQuota)));
							if(tenantTypeFlag){     
								vmf.modal.show("errorDC",{
									onShow : function(){
									   $("#errorDC #msg").html(rs.popupErrorMessage);
										erroModalHide();                               
									}
								});
								return false;	
							}else{	
								$('form[name="addOnRequest"]').submit(); 
							}
                    }
                }, function(data){
                    var errorMessage = data.hasOwnProperty('ERROR_MESSAGE')?data.ERROR_MESSAGE:rs.directConnectAjaxCallFailMessage;
                        myvmware.sdp.showErrorModal(errorMessage);
                        erroModalHide();                
                });
            }
            else{
                $('form[name="addOnRequest"]').submit();
            }
		}*/
	},
	networkCon: {
		init:function(){
			net = myvmware.sdp.networkCon;
			if($('#nwConForm').length>0) {
				net.loadTelcoProvider();
				net.validateNwConForm();
				net.bindEvents();
				net.formDropDown = {};
			}
			$("#typeOfService").attr('disabled', 'disabled');
		},
		validateSubIP:function(num){
			var reg = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
			return reg.test(num);
		},
		submitFormHandler : function() {
				var formID = $('form#nwConForm'), _postData = new Object();
				if($.browser.msie) {
					$.each($('input[placeholder]'), function() {
						if($(this).val()==$(this).attr('placeholder'))
							$(this).val('');
					});
				}
				_postData["telcoProvider"] = $.trim(formID.find('#telcoProvider').val());
				_postData["typeOfService"] = $.trim(formID.find('#typeOfService').val());
				_postData["gatewayIpAddress"] = $.trim(formID.find('#gatewayIP1').val()) + "." + $.trim(formID.find('#gatewayIP2').val()) + "." + $.trim(formID.find('#gatewayIP3').val()) + "." + $.trim(formID.find('#gatewayIP4').val());
				_postData["ipAddressStartRangeCust"] = $.trim(formID.find('#customerSideIPRangeFrom1').val()) + "." + $.trim(formID.find('#customerSideIPRangeFrom2').val()) + "." + $.trim(formID.find('#customerSideIPRangeFrom3').val()) + "." + $.trim(formID.find('#customerSideIPRangeFrom4').val());
				_postData["ipAddressEndRangeCust"] = $.trim(formID.find('#customerSideIPRangeTo1').val()) + "." + $.trim(formID.find('#customerSideIPRangeTo2').val()) + "." + $.trim(formID.find('#customerSideIPRangeTo3').val()) + "." + $.trim(formID.find('#customerSideIPRangeTo4').val());
				_postData["ipAddressSubnetMaskCust"] = $.trim(formID.find('#customerSideIPSubMask1').val()) + "." + $.trim(formID.find('#customerSideIPSubMask2').val()) + "." + $.trim(formID.find('#customerSideIPSubMask3').val()) + "." + $.trim(formID.find('#customerSideIPSubMask4').val());
				_postData["ipAddressStartRangeService"] = $.trim(formID.find('#serverSideIPRangeFrom1').val()) + "." + $.trim(formID.find('#serverSideIPRangeFrom2').val()) + "." + $.trim(formID.find('#serverSideIPRangeFrom3').val()) + "." + $.trim(formID.find('#serverSideIPRangeFrom4').val());
				_postData["ipAddressEndRangeService"] = $.trim(formID.find('#serverSideIPRangeTo1').val()) + "." + $.trim(formID.find('#serverSideIPRangeTo2').val()) + "." + $.trim(formID.find('#serverSideIPRangeTo3').val()) + "." + $.trim(formID.find('#serverSideIPRangeTo4').val());
				_postData["ipAddressSubnetMaskService"] = $.trim(formID.find('#serverSideIPSubMask1').val()) + "." + $.trim(formID.find('#serverSideIPSubMask2').val()) + "." + $.trim(formID.find('#serverSideIPSubMask3').val()) + "." + $.trim(formID.find('#serverSideIPSubMask4').val());		
				_postData["customerFirstName"] = $.trim(formID.find('#firstName').val());
				_postData["customerLastName"] = $.trim(formID.find('#lastName').val());
				_postData["customerEmailAddress"] = $.trim(formID.find('#adminEmail').val());
				_postData["customerPhone"] = $.trim(formID.find('#adminPhone').val());
				_postData["serviceIdValue"] = $.trim(formID.find('#serviceIdValue').val());
				_postData["tenantServiceInstanceIdValue"] = $.trim(formID.find('#tenantServiceInstanceIdValue').val());
				_postData["serviceInstanceNameValue"] = $.trim(formID.find('#serviceInstanceNameValue').val());
				_postData["requestorEmailAddressValue"] = $.trim(formID.find('#requestorEmailAddressValue').val());
				_postData["dataCenterValue"] = $.trim(formID.find('#dataCenterValue').val());
				_postData["orderDateValue"] = $.trim(formID.find('#orderDateValue').val());
				_postData["productFamilyValue"] = $.trim(formID.find('#productFamilyValue').val());
				_postData["loggedInUserFirstNameValue"] = $.trim(formID.find('#loggedInUserFirstNameValue').val());
				_postData["loggedInUserLastNameValue"] = $.trim(formID.find('#loggedInUserLastNameValue').val());

				vmf.ajax.post(rs.submitFormURL,_postData,function(data){
					data = vmf.json.txtToObj(data);
					if(data != null || data != ''){
						if(data.hasOwnProperty('ERROR_MESSAGE')){
							myvmware.sdp.showErrorModal(data.ERROR_MESSAGE);
						} else {
							if(data.status){
								window.location.replace(data.url);
							} else {
								var $modal = $('#formSubmitted');
								$('span#personName', $modal).html(data.name);
								$('span#date', $modal).html(data.date);
								vmf.modal.show('formSubmitted');
								$('button', $modal).die('click').live('click', function(){
									window.location.replace(data.url);
								});
								$('a.modalCloseImg').die('click').live('click', function(){
									$('button', $modal).trigger('click');
								});
							}
						}
					}
				},'',
				function(){vmf.loading.hide()},
				null,
				function(){vmf.loading.show()
				});
			
		}, // end of submitFormHandler
		validateNwConForm  : function() {
			$.validator.addMethod("phoneNumber", function(value, element) {
				if(($.browser.msie && value!=$(element).attr('placeholder')) || (!$.browser.msie && value!='')){
					var phone =  /^[0-9\-\+\.\(..\)\s]+$/i;
	    			return phone.test(value);  
    			}
    			return true;
    		}, '');
			$.validator.addMethod("subIPFormat", function(val, element) {
				var ipArr = [];
				var ip = $(element).data('ip');
				var ipEles = $('input[data-ip='+ip+']');
				$.each(ipEles, function(i, v) {
					ipArr.push($.trim(v.value));
				});
				var ipAddr = ipArr.join('.');
				var validIp = net.validateSubIP(ipAddr);

				if(validIp)
					ipEles.removeClass('error');
				return validIp;

			},"");

			 $("#nwConForm").validate({
			 	errorPlacement : function(error, element) {
					net.placeErrors(error, element);
				}, // end of errorPlacement
				rules : {
					_VM_telcoProvider: {
						required: true
					}
					,_VM_typeOfService: {
						required: true
					}
					,_VM_gatewayIP1 : {
						required: true
						,subIPFormat : true
					}
					,_VM_gatewayIP2 : {
						required: true
						,subIPFormat : true
					}
					,_VM_gatewayIP3 : {
						required: true
						,subIPFormat : true
					}
					,_VM_gatewayIP4 : {
						required: true
						,subIPFormat : true
					}
					,_VM_customerSideIPRangeFrom1 : {
						required: true
						,subIPFormat : true
					}
					,_VM_customerSideIPRangeFrom2 : {
						required: true
						,subIPFormat : true
					}
					,_VM_customerSideIPRangeFrom3 : {
						required: true
						,subIPFormat : true
					}
					,_VM_customerSideIPRangeFrom4 : {
						required: true
						,subIPFormat : true
					}
					,_VM_customerSideIPRangeTo1 : {
						required: true
						,subIPFormat : true
					}
					,_VM_customerSideIPRangeTo2 : {
						required: true
						,subIPFormat : true
					}
					,_VM_customerSideIPRangeTo3 : {
						required: true
						,subIPFormat : true
					}
					,_VM_customerSideIPRangeTo4 : {
						required: true
						,subIPFormat : true
					}
					,_VM_customerSideIPSubMask1: {
						required: true
						,subIPFormat : true
					}
					,_VM_customerSideIPSubMask2: {
						required: true
						,subIPFormat : true
					}
					,_VM_customerSideIPSubMask3: {
						required: true
						,subIPFormat : true
					}
					,_VM_customerSideIPSubMask4: {
						required: true
						,subIPFormat : true
					}
					,_VM_serverSideIPRangeFrom1: {
						required: true
						,subIPFormat : true
					}
					,_VM_serverSideIPRangeFrom2: {
						required: true
						,subIPFormat : true
					}
					,_VM_serverSideIPRangeFrom3: {
						required: true
						,subIPFormat : true
					}
					,_VM_serverSideIPRangeFrom4: {
						required: true
						,subIPFormat : true
					}
					,_VM_serverSideIPRangeTo1: {
						required: true
						,subIPFormat : true
					}
					,_VM_serverSideIPRangeTo2: {
						required: true
						,subIPFormat : true
					}
					,_VM_serverSideIPRangeTo3: {
						required: true
						,subIPFormat : true
					}
					,_VM_serverSideIPRangeTo4: {
						required: true
						,subIPFormat : true
					}
					,_VM_serverSideIPSubMask1: {
						required: true
						,subIPFormat : true
					}
					,_VM_serverSideIPSubMask2: {
						required: true
						,subIPFormat : true
					}
					,_VM_serverSideIPSubMask3: {
						required: true
						,subIPFormat : true
					}
					,_VM_serverSideIPSubMask4: {
						required: true
						,subIPFormat : true
					}
					,_VM_email: {
						 email: true
					}
					,_VM_phone: {
						phoneNumber : true
					}
				}, // end of rules
				messages : {
					_VM_telcoProvider: {
						required : rs.enterTelcoProvider
					}
					,_VM_typeOfService: {
						required: rs.enterTypeOfService
					}
					,_VM_gatewayIP1 : {
						required: rs.enterGatewayIPAddress
						,subIPFormat : rs.enterValidGatewayIPAaddress
					}
					, _VM_gatewayIP2 : {
						required: rs.enterGatewayIPAddress
						,subIPFormat : rs.enterValidGatewayIPAaddress
					}
					, _VM_gatewayIP3 : {
						required: rs.enterGatewayIPAddress
						,subIPFormat : rs.enterValidGatewayIPAaddress
					}
					, _VM_gatewayIP4 : {
						required: rs.enterGatewayIPAddress
						,subIPFormat : rs.enterValidGatewayIPAaddress
					}
					,_VM_customerSideIPRangeFrom1 : {
						required: rs.enterCustomerSideStartIPAddress
						,subIPFormat : rs.enterValidCustomerStartIPAddress
					}
					,_VM_customerSideIPRangeFrom2 : {
						required: rs.enterCustomerSideStartIPAddress
						,subIPFormat : rs.enterValidCustomerStartIPAddress
					}
					,_VM_customerSideIPRangeFrom3 : {
						required: rs.enterCustomerSideStartIPAddress
						,subIPFormat : rs.enterValidCustomerStartIPAddress
					}
					,_VM_customerSideIPRangeFrom4 : {
						required: rs.enterCustomerSideStartIPAddress
						,subIPFormat :rs.enterValidCustomerStartIPAddress
					}
					,_VM_customerSideIPRangeTo1 : {
						required: rs.enterCustomerEndIPAddress
						,subIPFormat :rs.enterValidCustomerEndIPAddress
					}
					,_VM_customerSideIPRangeTo2 : {
						required: rs.enterCustomerEndIPAddress
						,subIPFormat :rs.enterValidCustomerEndIPAddress
					}
					,_VM_customerSideIPRangeTo3 : {
						required: rs.enterCustomerEndIPAddress
						,subIPFormat :rs.enterValidCustomerEndIPAddress
					}
					,_VM_customerSideIPRangeTo4 : {
						required: rs.enterCustomerEndIPAddress
						,subIPFormat :rs.enterValidCustomerEndIPAddress
					}
					,_VM_customerSideIPSubMask1: {
						required: rs.enterCustomerIPAddressSubMask
						,subIPFormat :rs.enterValidCustomerIPAddressSubMask
					}
					,_VM_customerSideIPSubMask2: {
						required: rs.enterCustomerIPAddressSubMask
						,subIPFormat :rs.enterValidCustomerIPAddressSubMask
					}
					,_VM_customerSideIPSubMask3: {
						required: rs.enterCustomerIPAddressSubMask
						,subIPFormat :rs.enterValidCustomerIPAddressSubMask
					}
					,_VM_customerSideIPSubMask4: {
						required: rs.enterCustomerIPAddressSubMask
						,subIPFormat :rs.enterValidCustomerIPAddressSubMask
					}
					,_VM_serverSideIPRangeFrom1: {
						required: rs.enterServerStartIPAddress
						,subIPFormat :rs.enterValidServerStartIPAddress
					}
					,_VM_serverSideIPRangeFrom2: {
						required: rs.enterServerStartIPAddress
						,subIPFormat :rs.enterValidServerStartIPAddress
					}
					,_VM_serverSideIPRangeFrom3: {
						required: rs.enterServerStartIPAddress
						,subIPFormat :rs.enterValidServerStartIPAddress
					}
					,_VM_serverSideIPRangeFrom4: {
						required: rs.enterServerStartIPAddress
						,subIPFormat :rs.enterValidServerStartIPAddress
					}
					,_VM_serverSideIPRangeTo1 : {
						required: rs.enterServerEndIPAddress
						,subIPFormat :rs.enterValidServerEndIPAddress
					}
					,_VM_serverSideIPRangeTo2 : {
						required: rs.enterServerEndIPAddress
						,subIPFormat :rs.enterValidServerEndIPAddress
					}
					,_VM_serverSideIPRangeTo3 : {
						required: rs.enterServerEndIPAddress
						,subIPFormat :rs.enterValidServerEndIPAddress
					}
					,_VM_serverSideIPRangeTo4 : {
						required: rs.enterServerEndIPAddress
						,subIPFormat :rs.enterValidServerEndIPAddress
					}
					,_VM_serverSideIPSubMask1: {
						required: rs.enterServiceIPAddressSubMask
						,subIPFormat :rs.enterValidServiceIPAddressSubMask
					}
					,_VM_serverSideIPSubMask2: {
						required: rs.enterServiceIPAddressSubMask
						,subIPFormat :rs.enterValidServiceIPAddressSubMask
					}
					,_VM_serverSideIPSubMask3: {
						required: rs.enterServiceIPAddressSubMask
						,subIPFormat :rs.enterValidServiceIPAddressSubMask
					}
					,_VM_serverSideIPSubMask4: {
						required: rs.enterServiceIPAddressSubMask
						,subIPFormat :rs.enterValidServiceIPAddressSubMask
					}
					,_VM_email: {
						 email: rs.enterValidEmailAddress
					}
					,_VM_phone: {
						phoneNumber : rs.enterValidPhoneNumber
					}
				}, //end of messages
				onfocusout : false,
				success : function(em) {
					return false;
				},
				submitHandler : function() {
					// Attaching submit Btn  event Handler
					net.submitFormHandler();
					return false;
				} //end of submitHandler

			 }); //end of $("#quoteForm1").validate

		}, //end of validateNwConForm
		loadTelcoProvider : function() {
			var telcoProvider = $('#telcoProvider');
			vmf.loading.show();
			vmf.ajax.post(rs.providerDropdownURLforJS, '', function(data){
					if(data.hasOwnProperty('ERROR_MESSAGE')){
						telcoProvider.attr('disabled', 'disabled');
                    } else {
						data = vmf.json.txtToObj(data);
						myvmware.sdp.buildSelectBox("#telcoProvider", data.dropdownValues,rs.defaultTelcoProvider, false, '1option');
						telcoProvider.removeAttr('disabled');

						if(telcoProvider.val()!='') { //loading service selectbox when provider selectbox has value other than ''
							net.loadTypeOfServices();
						}
					}
					vmf.loading.hide();
		        },function(data){
					vmf.loading.hide();
				}
			);
		},
		populateVal:function(data){
			myvmware.sdp.buildSelectBox("#typeOfService", data, '', false,'1option');
			$("#nwConForm").find('#typeOfService').removeAttr('disabled');
			vmf.loading.hide();
		},
		loadTypeOfServices : function() {
			var nwConForm = $("#nwConForm"), value = nwConForm.find('#telcoProvider').val();
			if(value != '' && typeof net.formDropDown[value] == "undefined"){
				vmf.loading.show();
				vmf.ajax.post(rs.servicesDropdownURLforJS+"&_VM_serviceProvider="+value, '', 
					function(data){
						if(data.hasOwnProperty('ERROR_MESSAGE')){
							nwConForm.find('#typeOfService').attr('disabled', 'disabled');
						} else {
							data = vmf.json.txtToObj(data);
							net.formDropDown[value] = data.dropdownValues;
							net.populateVal(net.formDropDown[value]);
						}
					},
					function(){vmf.loading.hide();}
				);
			} else if (value != '') {
				net.populateVal(net.formDropDown[value]);
			} else {
				nwConForm.find("#typeOfService").attr('disabled','disabled').removeClass('error').html('');
				nwConForm.find("#typeOfService").parent().find('div.error_msg').html('');
			}
		},
		placeErrors:function(error, element){ //placing error message on validation of forms
			element.parent().find('div.error_msg').html(error);
		}, // end of placeErrors
		bindEvents:function(){
			var nwConForm = $("#nwConForm");
			nwConForm.find(".fn_cancel").click(function(){
				vmf.modal.show("cancelModal",{
					onShow: function(dialog){
						$('.modalContent button.primary').bind('click', function(){
							setTimeout(function(){window.location.replace(rs.cancelFormUrl)},500);
							vmf.modal.hide();
						});
						$('.modalContent button.secondary').bind('click', function(){
							vmf.modal.hide();
							return false;
						});
					}
				});
			});

			nwConForm.find("#telcoProvider").change(function(){
				net.loadTypeOfServices();
			});
			
			nwConForm.find('input.allowNumeric').keyup(function(){
				var $this = 'tabindex="'+(parseInt($(this).attr('tabindex')) + 1)+'"';
				if($(this).val().length == 3 && parseInt($(this).val()) < 256 && parseInt($(this).val()) != 0) {
					$('input['+$this+']').focus();
				}
			});

			if($.browser.msie) {
				myvmware.common.putplaceHolder($('#firstName'));
				myvmware.common.putplaceHolder($('#lastName'));
				myvmware.common.putplaceHolder($('#adminPhone'));
				$.each(nwConForm.find('input[placeholder]'), function() {
					var $this = $(this);
					$this.blur(function(i,v){
						if($this.val()==$this.attr('placeholder')) {
							$this.addClass('hasPlaceholder');
						} else {
							$this.removeClass('hasPlaceholder');
						}
					})
				});
			}		

			myvmware.sdp.showWarningModal('cancelModal', false);
		}
	},
	daasInstanceForm: {
		selectArr:[],
		init :function() {
			 daasForm = myvmware.sdp.daasInstanceForm;
			 if($('#daasInstanceForm').length>0) {
			 	 daasForm.fetchData();
			 }
		},
		fetchData: function(){
			 vmf.ajax.post(rs.fetchFormData,null,daasForm.onSuccessFormData,daasForm.onFailureFormData,function(){vmf.loading.hide()},null,function(){vmf.loading.show({msg:rs.Loading})});
		},
		onSuccessFormData:function(data){
			 if(typeof data!="object") data=vmf.json.txtToObj(data);
			 if(rs.readOnly=="true") {// to hide things in readonly
			 	 $(".dForm.ccs.formcss").addClass('display');
			 }
			 if(data.hasOwnProperty('ERROR_MESSAGE')){
				alert(data.ERROR_MESSAGE);
			 }			 
			 else{
				$('#daasInstanceForm').dynamicForm(data,rs.readOnly);
				$('#daasInstanceForm').validate({
			 	onfocusout : false,
			 	errorPlacement: function(error, element) {
			 		element.parent().find('div.error_msg').html(error);
			 		element.focus();
			 	}
				});
				daasForm.bindEvents();
			}
		},
		onFailureFormData:function(){
			 alert(rs.genericError);	 	 	 
		},
		saveDraft:function(param){
			if($.browser.msie) {
				$.each($('#daasInstanceForm input[placeholder]'), function() {
					if($(this).val()==$(this).attr('placeholder'))
						$(this).val('');
				});
			}
			var _postData = $('#daasInstanceForm').serialize();
			_postData += '&action=save';
			vmf.ajax.post(rs.submitFormUrl,_postData,function(data){
				//data = vmf.json.txtToObj(data);
				if(data != null || data != ''){
					if(data.hasOwnProperty('ERROR_MESSAGE')){
						myvmware.sdp.showErrorModal(data.ERROR_MESSAGE);
					} else {
						data = vmf.json.txtToObj(data);
						//Form is ODT
						if($('input#formId') && $('#formId').val() == 2){
							if(data.status){
								if(param) {
									setTimeout(function(){window.location.replace(rs.cancelFormUrl)},500);
									vmf.modal.hide();
								} else {
									vmf.modal.show('daasFormSaved');
								}
							} else {
								vmf.modal.hide();
								myvmware.sdp.showErrorModal(rs.genericError);
								
							}
						
						}
						//Form is DAAS
						else{
							if(data.status){
								if(param) {
									setTimeout(function(){window.location.replace(rs.cancelFormUrl)},500);
									vmf.modal.hide();
								} else {
									$('span.successMsg').addClass('success').html(rs.draftSaveSuccess);
								}
							} else {
								vmf.modal.hide();
								$('span.successMsg').addClass('error').html(rs.genericError);
							}
						}
					}
				}
			},
			function(data){
				alert(rs.genericError);
				if($.browser.msie) {
					$.each($('#daasInstanceForm input[placeholder]'), function() {
						var $this = $(this);
						myvmware.common.putplaceHolder($('#'+$this.attr('id')));
						$this.blur(function(i,v){
							if($this.attr('placeholder')==$this.val())
								$this.addClass('hasPlaceholder');
							else
								$this.removeClass('hasPlaceholder');
						});
					});
				}
			},function(){vmf.loading.hide()},null,function(){vmf.loading.show()});
		},
		bindEvents:function(){
			var daasFormObj = $(".dForm.ccs.formcss");
			$('.fn_odt_saved_ok').click(function(){
				vmf.modal.hide("daasFormSaved");
				window.location.replace(rs.cancelFormUrl);				
			});
			
			daasFormObj.find(".fn_cancel").click(function(){
					if($('input#formId') && $('input#formId').val() == 2){	
						$('#cancelModal').find('div.body').addClass('warning-message');
					}
					vmf.modal.show("cancelModal",{
					onShow: function(dialog){
						$('.modalContent button.primary').bind('click', function(){
							daasForm.saveDraft(true);
						});
						$('.modalContent button.secondary').bind('click', function(){
							if($('input#formId') && $('input#formId').val() == 2){				
								vmf.modal.hide('cancelModal');
							}else{
								setTimeout(function(){window.location.replace(rs.cancelFormUrl)},500);
								vmf.modal.hide();
							}
						});
					}
				});
			});
			daasFormObj.find('.fn_submit').click(function(e){
			      e.preventDefault();
			      if ($('#daasInstanceForm').validate().form()) {
			      	if($.browser.msie) {
						$.each($('#daasInstanceForm input[placeholder]'), function() {
							if($(this).val()==$(this).attr('placeholder'))
								$(this).val('');
						});
					}
			      	var _postData = $('#daasInstanceForm').serialize();
					_postData += '&action=submit';
			      	vmf.ajax.post(rs.submitFormUrl,_postData,function(data){						
						//data = vmf.json.txtToObj(data);
						if(data != null || data != ''){
							if(data.hasOwnProperty('ERROR_MESSAGE')){
								myvmware.sdp.showErrorModal(data.ERROR_MESSAGE);
							} else {
								data = vmf.json.txtToObj(data);
								if(data.status){
									window.location.replace(data.url);
								} else {
									var $modal = $('#daasFormSubmitted');
									$('span#personName', $modal).html(data.name);
									$('span#date', $modal).html(data.date);
									vmf.modal.show('daasFormSubmitted');
									$('button', $modal).die('click').live('click', function(){
										window.location.replace(data.url);
									});
									$('a.modalCloseImg').die('click').live('click', function(){
										$('button', $modal).trigger('click');
									});
								}
							}
						}
						},
						function(data){
							alert(rs.genericError);
							if($.browser.msie) {
								$.each($('#daasInstanceForm input[placeholder]'), function() {
									var $this = $(this);
									myvmware.common.putplaceHolder($('#'+$this.attr('id')));
									$this.blur(function(i,v){
										if($this.attr('placeholder')==$this.val())
											$this.addClass('hasPlaceholder');
										else
											$this.removeClass('hasPlaceholder');
									});
								});
							}
					},function(){vmf.loading.hide()},null,function(){vmf.loading.show()});
			        //$('#daasInstanceForm').submit();
				}
			});
			// Save to Draft
			daasFormObj.find('.fn_save').click(function(e){
				e.preventDefault();
				daasForm.saveDraft(false);
			});
			
			
			
			//Will show warning message when navigate away from page
			//TODO : put a logic that will only show warning if there is a activity made on the page
			if(rs.readOnly=="false") {
				myvmware.sdp.showWarningModal('cancelModal', false, 'daas');
			}

			$('#errorModal .fn_cancel').live('click', function() {
				vmf.modal.hide();
			});
			
			/* Dynamic Pool Planning - Starts */
			if($('#poolPlanning')){				
				var max = $('#poolPlanning').attr('data-available'),countFilled = 0,lastFilled = '',temp=0;
					def = $('#poolPlanning').attr('data-to-show') ;				
				$.each($('#poolPlanning .desktopPattern'),function(i,k){
					var checkVar = $(this).find('div.left').find('select').attr('data-defaultval');
					if(typeof checkVar !== typeof undefined && checkVar !== false){		
						countFilled = i;
						lastFilled = $(k).attr('id');
						lastFilled = parseInt(lastFilled.charAt(lastFilled.length -1));						
					}
				});	
				(lastFilled < def) ? lastFilled = def : lastFilled;					
				$('.desktopPattern').hide();	
				for (var i=0;i< lastFilled;i++){
					$('#poolPlanning').find('.desktopPattern:eq('+i+')').show();
				}			
				var aText = '<p class="patternLinks"><a href="javascript:void(0)" id="addPattern" class="addPattern" data-value="'+lastFilled+ '" >'+rs.addPatternLink+'</a><span class="spacer"> | </span><a href="javascript:void(0)" id="delPattern" class="delPattern" data-value="'+lastFilled+ '" >'+rs.delPatternLink+'</a></p>';				
				$('#poolPlanning .noteContent').append($(aText));				
			};
			$('.addPattern').live('click',function(){
				var nextVal = $(this).attr('data-value');
				$('#poolPlanning').find('.desktopPattern:eq('+nextVal+')').show();					
				$(this).attr('data-value',parseInt(nextVal)+1);	
				$('a.delPattern').attr('data-value',parseInt(nextVal)+1);				
				if((parseInt(nextVal)+1) == $('#poolPlanning').attr('data-available')){	
					$('.addPattern,.spacer').hide();				
				}
				if(parseInt(nextVal)==1){
					$('.delPattern,.spacer').show();
				}
			});
			
			$('.delPattern').live('click',function(){
				var prevVal = $(this).attr('data-value');				
				$('#poolPlanning').find('.desktopPattern:eq('+(parseInt(prevVal)-1)+')').hide();	
				$('#poolPlanning').find('.desktopPattern:eq('+(parseInt(prevVal)-1)+')').find('div.left select').removeAttr('data-defaultval').find('option:selected').removeAttr('selected');
				$(this).attr('data-value',parseInt(prevVal)-1);	
				$('a#addPattern').attr('data-value',parseInt(prevVal)-1);	
				
				if((parseInt(prevVal)-1) == 1){$('.delPattern,.spacer').hide();}
				if(parseInt(prevVal) == 10){$('.addPattern,.spacer').show();}
			});
			if(rs.readOnly=="true") {myvmware.sdp.daasInstanceForm.poolPlanningReadOnly();}
			
			/* Dynamic Pool Planning - Ends */
		},
		validateDform: function(elements) {
			$.validator.addMethod("phoneNumber", function(value, element) {
				if(($.browser.msie && value!=$(element).attr('placeholder')) || (!$.browser.msie && value!='')){
					var phone =  /^[0-9\-\+\.\(..\)\s]+$/i;
					return phone.test(value);  
				}
				return true;
			}, '');
			$.validator.addMethod("IPFormat", function(value, element) {
				if(($.browser.msie && value!=$(element).attr('placeholder')) || (!$.browser.msie && value!='')){
					var reg = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
					return reg.test(value);  
				}
				return true;
			},"");
			$.validator.addMethod("required", function(value, element, param) {
		        // check if dependency is met
		        if ( !this.depend(param, element) ) {
		            return "dependency-mismatch";
		        }
		        if ( element.nodeName.toLowerCase() === "select" ) {
		            // could be an array for select-multiple or a string, both are fine this way
		            var val = $(element).val();
		            return val && val.length > 0;
		        }
		        if ( this.checkable(element) ) {
		            return this.getLength(value, element) > 0;
		        }
	            var placeholderval = $(element).attr('placeholder');
	         	//if some placeholder values are actually default values, just use "default" attribute to mark them
	            var defaultvar = ($(element).attr('default') === undefined);
	            return (value.length > 0 && (value!=placeholderval || !defaultvar));
		    }, '');

			var element = elementHtml = subElementHtml = '';
			if (elements && elements.length < 1) return;

			for (var idx = 0; idx < elements.length; idx++) {
				if(elements[idx]['html']) {
					element = elements[idx];
					elementHtml = element['html'];
					for(var idy = 0; idy < elementHtml.length; idy++) {
						if(elementHtml[idy]['html']){
							subElementHtml = elementHtml[idy]['html'];
							for(var idz = 0; idz < subElementHtml.length; idz++) {
								if(subElementHtml[idz]['validate']){
									$(':input[name='+subElementHtml[idz]['name']+']').rules("add", subElementHtml[idz]['validate']);
								} else if(subElementHtml[idz]['namevalidate']){
									$(':input[name='+subElementHtml[idz]['first']['name']+']').rules("add", subElementHtml[idz]['namevalidate']);
									$(':input[name='+subElementHtml[idz]['last']['name']+']').rules("add", subElementHtml[idz]['namevalidate']);
								} else {}
							}
						} else {
							element = elements[idx]['html'];
							for(var ids = 0; ids < element.length; ids++) {
								if(element[ids]['validate'])    
									$(':input[name='+element[ids]['name']+']').rules("add", element[ids]['validate']);
							}
						}
					}           
				}
			}
			if($('#daasInstanceForm').find('.secHolder .left :input'))
				$('#daasInstanceForm').find('.secHolder .left').append('<div class="error_msg"></div>');
		},
		populateChild: function(elements) {
			if (elements && elements.length < 1) return;

			for (var idx = 0; idx < elements.length; idx++) {
				var element = elements[idx],
					usedefaultTxt = ''; 
				switch(element['type']) {
					case 'div': 
						var note = element['note'],
							className = (element['class'] ? element['class'] : ""),
							headerTag = (className.match('content-div')) ? "h2" : "h3";

						this.html += '<div ';
						if (element['id']) {							
							if(element['id'] == 'poolPlanning'){this.html += ' id="' + element['id'] + '" data-available= "'+ element['total_available'] +'" data-to-show="'+ element['to_be_shown'] +'"'}				
							else this.html += ' id="' + element['id'] + '"'; 
						}
						this.html += ' class="clearfix ' + (element['class'] ? element['class'] : "") + '">';

						// use our defaults link text for IPSec Configuration Phases
						/*if(element['usedefault']) usedefaultTxt = '<label class="usedefault">'+element['usedefault']['label']+' <a href="#">'+element['usedefault']['linklabel']+'</a></label>';

						if (element['label']) { this.html += '<'+ headerTag +'>' + element['label'] + ' '+usedefaultTxt+'</'+ headerTag +'>'; }*/

						if (note) this.html += '<div class="left noteContent" style="width:75%;">';
						
						
						if (element['label']) { 
							
								if((element['id'] == 'odt_shippingInfo') || (element['id'] == 'odt_network_details')){
										this.html += '<div class="secHolder clearfix setfloat"><'+ headerTag +'>' + element['label'] + '</'+ headerTag +'><div class="left marginTop10"><span class="required">*</span>'+element['reqLabel']+'</div></div>';
								}else
								{
										this.html += '<'+ headerTag +'>' + element['label'] + ' </'+ headerTag +'>'; 
								}
						}
						
						
						daasForm.populateChild.call(this,element['html']);
						/* TODO: move the style to CSS file */
						if (note) {
							this.html += '</div>' ;
							this.html += '<div class="left note"><div>';
							this.html += '<h3>' + element['label'] + '</h3>';
							this.html += note;
							this.html += '</div></div>';
						}
						this.html += '</div>';
						break;

					case "name" :
						var firstnameClass = element['first']['class'] ? element['first']['class'] : "small",
							lastnameClass = element['last']['class'] ? element['last']['class'] : "small",
							disabled = ''; 
						this.html += '<div class="secHolder clearfix">';
						this.html += '<h4>' + element['label'];
						if(element['namevalidate']!=undefined) {
							if(element['namevalidate']['required']) 
								this.html += " <span class='required'>*</span>";
						}
						this.html += '</h4>' ;
						this.html += '<div class="left">';
						disabled = (element['disabled']==true) ? 'disabled="disabled"' : '';
						this.html += '<input type="text" name="'+ element['first']['name'] + '" id="'+ element['first']['id']
							  + '" placeholder="' + element['first']['placeholder'] + '" value="'+element['first']['value']+'" class="' + firstnameClass + '" '+disabled+'/>'
							  + ' <input type="text" style="margin-left:12px;" name="'+ element['last']['name'] + '" id="'+ element['last']['id']
							  + '" placeholder="' + element['last']['placeholder'] + '" value="'+element['last']['value']+'" class="' + lastnameClass + '" '+disabled+'"/>'; 
						this.html += '</div>';
						this.html += '</div>';
					break;

					case "text" :
						this.html += '<div class="secHolder clearfix">';
						this.html += '<h4>' + element['label'] ;
						if(element['validate']!=undefined) {
							if(element['validate']['required']) 
							this.html += " <span class='required'>*</span>";
						}
						this.html += '</h4>' ;
						this.html += '<div class="left">';
						if (element['text-label']) {
							this.html += '<label>' + element['text-label'] + '</label>';
						}
						this.html += daasForm.getInputTextElement(element);
						this.html += '</div>';
						this.html += '</div>';
						break;

					case "select" :
						this.html += '<div class="secHolder clearfix">';
						this.html += '<h4>' + element['label'] ;
						if(element['validate']!=undefined) {
							if(element['validate']['required']) 
							this.html += " <span class='required'>*</span>";
						}
						this.html += '</h4>' ;
						this.html += '<div class="left">' + daasForm.getSelectElement(element) + '</div>';
						this.html += '</div>';
						break;

					case "radio" :
						this.html += '<div class="secHolder clearfix">';
						this.html += '<h4>' + element['label'] ;
						if(element['validate']!=undefined) {
							if(element['validate']['required']) 
							this.html += " <span class='required'>*</span>";
						}
						this.html += '</h4>' ;

						var selOptions = element['options'];
						var value = element['value'];
						for (var idxSel=0; idxSel < selOptions.length; idxSel++) {
							var checked = disabled = "";
							this.html += '<div class="left radio">';

							checked = (value && value == selOptions[idxSel]['value']) ? ' checked="checked" ' : '';
							disabled = (element['disabled']==true) ? 'disabled="disabled"' : '';

							if(element['displayContent'])
								this.html += '<input type="radio" name="' + element['name'] + '" value="' + selOptions[idxSel]['value'] + '" data-value="'+element['displayContent']['value']+'" data-class="'+element['displayContent']['actionClass']+'"  '+disabled+ ' '; 
							else 
								this.html += '<input type="radio" name="' + element['name'] + '" value="' + selOptions[idxSel]['value'] + '"  '+disabled+ ' '; 

							this.html += checked + ' > <span>' + selOptions[idxSel]['text'] + "</span>&nbsp;"; 
							this.html += '</div>'; 
						}

						this.html += '</div>';
						break;

					case "statecity" :
						this.html += '<div class="secHolder clearfix">';
						this.html += '<h4>' + element['label'] ;
						if(element['validate']!=undefined) {
							if(element['validate']['required']) 
							this.html += " <span class='required'>*</span>";
						}
						this.html += '</h4>' ;
						this.html += '<div class="left">' + daasForm.getSelectElement(element['state']);
						this.html += daasForm.getInputTextElement(element['city']) + '</div>';
						this.html += '</div>';
						break;

					case "value" :
						this.html += '<div class="secHolder clearfix">';
						this.html += '<h4>' + element['label'] + '</h4>' ;
						this.html += '<div class="left">';
						this.html += '<p ';
						if (element['class']) this.html += ' class="' + element['class'] +'"'
						this.html += ' >' + element['value'] + '</p>';
						this.html += '</div>';
						this.html += '</div>';
						break;

					case "comments" :
						if(element['value']!='') {
							this.html += '<div class="content-div clearfix">';
							this.html += '<h2>' + element['label'] + '</h2>' ;
							this.html += '<div class="left">';
							this.html += '<p ';
							if (element['class']) this.html += ' class="' + element['class'] +'"'
							this.html += ' >' + element['value'] + '</p>';
							this.html += '</div>';
							this.html += '</div>';
						}
						break;
				}
			}
		},
		populateChildDisplay: function(elements) {
			if (elements && elements.length < 1) return;

			for (var idx = 0; idx < elements.length; idx++) {
				var element = elements[idx],
					usedefaultTxt = ''; 
				switch(element['type']) {
					case 'div': 
						var note = element['note'],
							className = (element['class'] ? element['class'] : ""),
							headerTag = (className.match('content-div')) ? "h2" : "h3";

						this.html += '<div ';
						if (element['id']) { this.html += ' id="' + element['id'] + '"'; }
						this.html += ' class="clearfix display ' + (element['class'] ? element['class'] : "") + '">';

						// use our defaults link text for IPSec Configuration Phases
						/*if(element['usedefault']) usedefaultTxt = '<label class="usedefault">'+element['usedefault']['label']+' <a href="#">'+element['usedefault']['linklabel']+'</a></label>';

						if (element['label']) { this.html += '<'+ headerTag +'>' + element['label'] + ' '+usedefaultTxt+'</'+ headerTag +'>'; }*/

						if (note) this.html += '<div class="left noteContent" style="width:75%;">';
						if (element['label']) { this.html += '<'+ headerTag +'>' + element['label'] + ' </'+ headerTag +'>'; }
						daasForm.populateChildDisplay.call(this,element['html']);
						/* TODO: move the style to CSS file */
						if (note) {
							this.html += '</div>' ;
							this.html += '<div class="left note">';
							this.html += '<h3>' + element['label'] + '</h3>';
							this.html += note;
							this.html += '</div>';
						}
						this.html += '</div>';
						break;

					case "name" :
						this.html += '<div class="secHolder display clearfix">';
						this.html += '<h4>' + element['label'] + '</h4>' ;
						this.html += '<div class="left">' + element['first']['value'] + ' ' + element['last']['value'] + '</div>';
						this.html += '</div>';
						break;

					case "text" :
					case "value" :
					case "select" :
						var textLbl = (element['text-label']) ? element['text-label'] : '';
						this.html += '<div class="secHolder display clearfix">';
						this.html += '<h4>' + element['label'] + '</h4>' ;
						this.html += '<div class="left">'+ textLbl+''+element['value'] + '</div>';
						this.html += '</div>';
						break;			

					case "radio" :
						this.html += '<div class="secHolder display clearfix">';
						this.html += '<h4>' + element['label'] + '</h4>' ;
						var actionClass = (element['displayContent'] && element['value']==element['displayContent']['value']) ? element['displayContent']['actionClass'] : '';
						this.html += '<div class="left" data-class="'+actionClass+'">'+ element['value'] + '</div>';
						this.html += '</div>';
						break;

					case "statecity" :
						var statecityVals = ((element['state']['value']!='') ?  element['state']['value'] + ', &nbsp; '+ element['city']['value'] : element['city']['value'] );
						this.html += '<div class="secHolder display clearfix">';
						this.html += '<h4>' + element['label'] + '</h4>' ;
						this.html += '<div class="left">' + statecityVals + '</div>';
						this.html += '</div>';
						break;

					case "comments" :
						if(element['value']!='') {
							this.html += '<div class="content-div display clearfix">';
							this.html += '<h2>' + element['label'] + '</h2>' ;
							this.html += '<div class="left">'+ element['value'] + '</div>';
							this.html += '</div>';
						}
						break;
				}
			}
		},
		getSelectElement: function(element) {
			var dynamicField = element['dynamicField'];
			var html = '<select' 
						 + ' name="'+ element['name'] + '" ' 
						 + 'id="' + element['id'] + '"';
			var selected = disabled = ''; 
				 html += ' class="medium ';
				if ( element['class']) html += element['class'];
				html +=  '" ';

				if ( element['ajaxurl']) html += ' data-ajaxurl="' +  element['ajaxurl'] + '" ';

				disabled = (element['disabled']==true) ? 'disabled="disabled"' : '';

				if ( dynamicField)  {
					if ( dynamicField.actionClass) html += ' data-actionclass = "' +   dynamicField.actionClass + '" ';
					if ( dynamicField['initialvalue']) html += ' data-initialvalue = "' +   dynamicField['initialvalue'] + '" ';
					if ( dynamicField['ajaxurl']) html += ' data-dynamicurl = "' +   dynamicField['ajaxurl'] + '" ';
				}

				if (element['value']!='') html += 'data-defaultval = "'+element['value']+'" ';

				html += ' '+disabled+'>';

		    var selOptions = element['options'];
			for (var idxSel=0; idxSel < selOptions.length; idxSel++) {
				(element['value']==selOptions[idxSel]['value']) ? selected = 'selected="selected"' : selected = '';
		        html += '<option value="' + selOptions[idxSel]['value'] + '" '+selected+'>' + selOptions[idxSel]['text'] + '</option>';
			}
			html += '</select>';	

			return html;	
		},
		getInputTextElement: function(element) {
			var disabled = defaultVal = classVal = '';
			disabled = (element['disabled']==true) ? 'disabled="disabled"' : '';
			defaultVal = (element['value']!='') ? 'default ="' + element['value'] + '" ' : ' ';
			if(element['class']) {
				classVal = ((element['name']=='city') ? element['class'] : element['class']+' medium');
			} else
				classVal = 'medium';

			return  '<input type="text" ' 
						 + 'name="'+ element['name'] + '" ' 
						 + 'id="'+ element['id'] + '" '
						 + 'placeholder="' + (element['placeholder'] ? $.trim(element['placeholder']) : "") + '" '
						 +  defaultVal 
						 + 'class="' + classVal+ '" '
						 + ' value="'+ element['value']+'"'
						 + ' '+disabled+' />';
		},
		onChangeDropdown:function(){},
		showContent: function() {
		    $.each($(':input'), function(idx){
				var $this = $(this);
				if($this.data('value') && $this.data('class')) { // show and hide functionality of the radio buttons 
					//onchange
					$this.bind('change',function(el, ev){
						var parentContentDiv = $(this).closest('div.content-div');
						parentContentDiv.find('.note').hide();
						if($this.is(':checked') && $this.val()==$this.data('value')){
							daasForm.showRadioContent($this);
						} else {	 	  
							$('.'+$this.data('class')).hide().find(':input').attr('disabled', true);	 	  
						} 
						parentContentDiv.find('.note').height( parentContentDiv.height()).show();
					});
					if($this.val()==$this.data('value'))
						$this.trigger('change');
				} 

				// disabling all the elements with data-disabled="true"
				if($this.data('disabled')==true)
					$this.attr('disabled', true);
			});

			//adding placeholders in IE
			daasForm.placeHolderFn($('input[placeholder]'));
		},
		placeHolderFn: function(obj) {
			if($.browser.msie) {
				$.each(obj, function() {
		 	 		var $this = $(this);
		 	 		myvmware.common.putplaceHolder($('#'+$this.attr('id')));
		 	 		$this.blur(function(i,v){
						if($this.attr('placeholder')==$this.val())
							$this.addClass('hasPlaceholder');
						else
							$this.removeClass('hasPlaceholder');
					});
		 	 	});
			}
		},
		showRadioContent: function(ele) {
			var hiddenCont = $('.'+ele.data('class')),
				noteCont = hiddenCont.find('.note');

	 	 	hiddenCont.show().find(':input').removeAttr('disabled');

	 	 	//adding placeholders in IE
			daasForm.placeHolderFn(hiddenCont.find('input[placeholder]'));
	 	 	
	 	 	if(noteCont.length>0) {
		 	 	noteCont.height(noteCont.closest('div.content-div').height());
		 	 	noteCont.show();
		 	 }
	 	 		//$('.'+ele.data('class')).find('.note').height($('.'+ele.data('class')).height()).show();  
			/*setTimeout(function(){
				if(daasForm.selectArr.length>0){
					var selectedArr=[];
					for (var i=0; i<daasForm.selectArr.length;i++) {
						if ($("#"+daasForm.selectArr[i]).is(":visible") && $("#"+daasForm.selectArr[i]+" option").length>0){
							vmf.dropdown.build($("#"+daasForm.selectArr[i]), {
							optionsDisplayNum: 5,
							ellipsisSelectText: false,
							ellipsisText: '',	 
							optionMaxLength: 70,
							inputMaxLength: 40,	 
							position: "right",
							onSelect: daasForm.onChangeDropdown,
							inputWrapperClass: "eaInputWrapper",
							spanpadding: true,
							spanClass: "corner-img-left",
							optionsClass: "dropdownOpts",
							shadowClass: "eaBoxShadow"
							});
							selectedArr.push(daasForm.selectArr[i]);
						}
					}
					for (var j in selectedArr){
						daasForm.selectArr = jQuery.grep(daasForm.selectArr, function(value) {
							return value != selectedArr[j];
						});
					}
				} 
			},500);*/
	 	},
	 	poolPlanningReadOnly:function(){               
				$('.patternLinks').hide();
				$.each($('#poolPlanning .desktopPattern'),function(i,k){					
					if($(this).find('div.left:eq(0)').html() != ''){$(k).show()}
				});
			
		},
		showSubContent: function() {
			var form = $('.dForm.ccs.formcss'),
			lastChild = form.find('div.content-div:last-child');
			$.each(form.find('div.left'), function(){
				if($(this).attr('data-class'))
					form.find('div.'+$(this).attr('data-class')).show();
			});

			if(lastChild.is(':hidden'))
				lastChild.prev().addClass('nobtmborder');
			else
				lastChild.addClass('nobtmborder');
		},
		prepareNotes : function () {
			//calculate section content for note
			$('.content-div').each(function(){
				 if($(this).attr('id')=='poolPlanning'){
				  		 
				 };
				 $(this).find('.note').height( $(this).height()).show();
			});
		},
	 	dynamicSelect : function() {
	 	 	 $.each($('select'), function() {
	 	 	 	 var actionClass = $(this).data('actionclass'),
	 	 	 	 	 $this = $(this),
	 	 	 	 	 ajaxurl = $this.data('ajaxurl'),
 	 	 	 	 	 defaultval = $this.data('defaultval');
				//country integration
	 	 	 	switch(ajaxurl) {
					case 'countries': 
					   ajaxurl = rs.countriesUrl + "&paramName=country&paramValue=0";	  
					   break;				
				}

	 	 	 	 if (actionClass) {
	 	 	 	 	 var initialvalue = $this.data('initialvalue'),
	 	 	 	 	 	 dynamicajaxurl = $this.data('dynamicurl');
	 	 	 	 	 	 //state integration
	 	 	 	 	 	 if ($this.data('ajaxurl') == 'countries' && dynamicajaxurl == "states") {
	 	 	 	 	 	 	dynamicajaxurl =  rs.countriesUrl  +  "&paramName=state&paramValue=";	  
	 	 	 	 	 	 }
	 	 	 	 	 $this.change(function() {
						
	 	 	 	 	 	 if($this.val()!='' && $('input#formId') && $('input#formId').val() != 2){				
							
	 	 	 	 	 	 	 /* populate data base on other data */
	 	 	 	 	 	 	 vmf.loading.show();
	 	 	 	 	 	 	 var initialvalue = $(this).data('initialvalue'),
	 	 	 	 	 	 	 	 codeVal = $this.find('option[value="'+$this.val()+'"]').data('code');

	 	 	 	 	 	 	 vmf.ajax.post(dynamicajaxurl + codeVal,{},function(data){
	 	 	 	 	 	 	 	 	 var stateEl = $('select.' + actionClass),
	 	 	 	 	 	 	 	 	 	 options ='';
	 	 	 	 	 	 	 	 	 stateEl.html('');
	 	 	 	 	 	 	 	 	 if (initialvalue) {
	 	 	 	 	 	 	 	 	 	 options += '<option>' + initialvalue + '</option>';
	 	 	 	 	 	 	 	 	 }
	 	 	 	 	 	 	 	 	 if (typeof data!="object") data=vmf.json.txtToObj(data);
	 	 	 	 	 	 	 	 	 if (data.length) {	 	 	 	 	 	 	 	 	 	
	 	 	 	 	 	 	 	 	 	 for (var j in data) {
	 	 	 	 	 	 	 	 	 	 	 options +='<option value="' + $.trim(data[j]['description']) +'">' + $.trim(data[j]['description']) + '</option>';
	 	 	 	 	 	 	 	 	 	 }
	 	 	 	 	 	 	 	 	 	 stateEl.append(options).show();
	 	 	 	 	 	 	 	 	 	 if(stateEl.data('defaultval') && stateEl.data('defaultval')!='')
											stateEl.val(stateEl.data('defaultval'));
	 	 	 	 	 	 	 	 	 } else {
	 	 	 	 	 	 	 	 	 	 stateEl.hide();
	 	 	 	 	 	 	 	 	 	 $('input.'+actionClass).val('');
	 	 	 	 	 	 	 	 	 }
	 	 	 	 	 	 	 	 	 vmf.loading.hide();
	 	 	 	 	 	 	 	 },
	 	 	 	 	 	 	 	 function(data){vmf.loading.hide();
	 	 	 	 	 	 	 });
	 	 	 	 	 	 } else {
	 	 	 	 	 	 	 $('select.'+actionClass).hide();
	 	 	 	 	 	 }
	 	 	 	 	 }); //change
	 	 	 	 } //actionClass
	 	 	 	 if (ajaxurl) { 
	 	 	 	 	 vmf.ajax.post(ajaxurl,{},function(data){
	 	 	 	 	 	 var options = '';
	 	 	 	 	 	if (typeof data!="object") data=vmf.json.txtToObj(data);
	 	 	 	 	 	 if (data.length) {
	 	 	 	 	 	 	 for (var i in data) {
	 	 	 	 	 	 	 	 options += '<option value="' + $.trim(data[i]['description']) +'" data-code="'+ $.trim(data[i]['code'])+'">' + $.trim(data[i]['description']) + '</option>';
	 	 	 	 	 	 	 }
	 	 	 	 	 	 	 $this.append(options);
	 	 	 	 	 	 	 if(defaultval && defaultval!='')
	 	 	 	 	 	 	 	$this.val(defaultval).trigger('change');
	 	 	 	 	 	 }
	 	 	 	 	 	 $('select.' + actionClass).hide();
	 	 	 	 	 	 vmf.loading.hide();
	 	 	 	 	 },
	 	 	 	 	 	 function(data){vmf.loading.hide()}
	 	 	 	 	 );
	 	 	 	 } //ajaxurl
	 	 	 }); //each select
	 	} //dynamicSelect  
	}
};//end of main
myvmware.praxis = {
	parentContainer: $('#praxisContainer'),
	currentCategoryArray:[],
	currentHeaderData:{},
	allplotsData:{},
	pastOrCurrent:1,
	currentSelectedYear: "current",
	plots:{},
	pastPlots:{},
	plotOptions : {},
	pastPlotOptions : {},
	allPastPlotsData: {},
	yearServices: {},
	bsDates: {},
	pastClicked: 0,
	yearSelectedIndex:{},
	myInterval: null,
	toBeReploted: 0,
	resizedOrNot: false,
	minDate: '',
	maxDate: '',
	seriesExist: {},
	pastYears: [],
	resizeForPast: false,
    resizeForCurr: false,
	pastBeaks: 0,
	fundIdRedirection:null,
	init :{ 
		defaults:function(year){
			praxis = myvmware.praxis;
			praxis.commonEvents();
			//praxis.loadCurrentData();
		},
		carousel:function(year, obj){
			praxis.buildPlotWrappers(year, obj);
			praxis.buildCarousel(year);
			//praxis.pause();
			//praxis.resume();
		},
		graph:function(year){
			praxis.graphPlotOptionsSetup();
			praxis.graphInitialOptionSetup(year);
			praxis.drawCurrentPlot(0, year);
			praxis.alignElements(year);
		}
	},
	commonEvents: function(){
		$('a.serviceOwner').attr('title', rs.ownerEmail); //BUG-00086500 email badge for service owner link
		/*Hiding the Buy ODT addon link*/
		if(rs.odtActiveFlag == 'N' || rs.odtActiveFlag == 'n'){
			$('.buyNewServiceList').find('.buyAddOn').hide();
		}
		$('#praxisContainer .tabbed_area').each(function() {
			var $this = $(this), content_show;
			if ($this.children('.tabs').length > 0) {
				$this.children('.main-container-wrapper').hide();
				content_show = $this.children('.tabs').find('.active').attr('title');
				$('#' + content_show).show();
			}			
		});

		$("#praxisContainer .tabbed_area a.tab").click(function(e) {
			e.preventDefault();
			$('.main-container-wrapper').hide();
			$this = $(this);
			$this.parents('.tabs:eq(0)').find('.active').removeClass('active');
			$this.addClass('active');
			$this.parents('.tabbed_area:eq(0)').children('.main-container-wrapper').hide();
			var content_show = $(this).attr('title');			
			$("#" + content_show).show();
			return false;
		});

		$(window).bind('resize', function(){
			var praxis = myvmware.praxis;
			if($('.plotDivInView').length){
				var currentSelectedYear = praxis.currentSelectedYear, yearServices = praxis.yearServices, currentCategoryArray = praxis.currentCategoryArray, plotDivInViewString = '.plotWrapper_' + praxis.currentSelectedYear + '.plotDivInView', parentContainer = praxis.parentContainer, currentIndex = $(plotDivInViewString,parentContainer).find('.plotDiv').attr('id'), currentPlot;
	        		
				praxis.resizeForCurr = true;
                praxis.resizeForPast = true;
                praxis.resizedOrNot = true;
                praxis.toBeReploted = 1;
				if(currentIndex != undefined){
					currentIndex = parseInt(currentIndex.split('_')[2]);

					if(praxis.pastOrCurrent == 1){
						setTimeout(function(){
							if($.isEmptyObject(praxis.allplotsData)){return false;}
							currentPlot = praxis.plots[currentCategoryArray[currentIndex]];

							praxis.drawCurrentPlot(currentIndex, currentSelectedYear);
						}, 1); 
					}else{
						setTimeout(function(){
							if($.isEmptyObject(praxis.allPastPlotsData[currentSelectedYear])){return false;}
							currentPlot = praxis.pastPlots[yearServices[currentSelectedYear][currentIndex]][currentSelectedYear];
							
							praxis.drawCurrentPlot(currentIndex, currentSelectedYear);
							praxis.alignElements(currentSelectedYear);
						}, 1);
					}
				
				}
			}
		});
		$('a.serviceOwner','#praxisContainer').bind('click', function(e){
			e.preventDefault();
			window.location.href = 'mailto:'+rs.ownerEmail;
			//$(this).attr('href',mailLink);
		});
		//$('.launchService','#praxisContainer').bind('click', function(){
		$('.launchServiceBtn','#praxisContainer').bind('click', function(){
			if(typeof riaLinkmy !="undefined") riaLinkmy("praxis : subscription-service-detail : launch");
			//setTimeout(function(){window.location.href = rs.launchProductUrl;},500);
			setTimeout(function(){window.open(rs.launchProductUrl, '_blank');},500);
		});
		
		$('.newService','#praxisContainer').bind('click', function(){
			if(typeof riaLinkmy !="undefined") riaLinkmy("praxis : subscription-service-detail : buyService");
			//setTimeout(function(){window.location.href = rs.buyService;},500);
			//var hasXaasFund = true;
			if (rs.hasFundForNewService=="true") {
				vmf.modal.show("subscriptionFundService",{
			onShow : function(){
				$('.fundServiceSelecton input').removeAttr('checked');
				//$("input:radio[name='buyNewService']").eq(0).attr("checked",true);
				vmf.ajax.post(rs.fundDetailsUrl,'_VM_isNewPraxis=Y',function(jsonResp){
						var funDetailsHolder = [];
						jsonResp = (typeof jsonResp!="object")? vmf.json.txtToObj(jsonResp) : jsonResp;
						data = jsonResp.fundGroupPaymentMethod;
						if(jsonResp.ERROR_CODE){
						$('#subscriptionFundService span.error').html(jsonResp.ERROR_MESSAGE);
							return false;
						}
						var eaDetails = '<li><strong>'+rs.account+': </strong>'+data.eaNumber+' - '+data.eaName+'</li>';
						funDetailsHolder.push(eaDetails);
						var arrLen = data.fundDetails;
						for( i =0; i < arrLen.length; i++){
							var value="";
							if (arrLen[i].redemptionCurrency=="JPY") {
								value = parseFloat(arrLen[i].balance).toFixed(0);
							}else{
								value = parseFloat(arrLen[i].balance).toFixed(2);	
							}							
							var fundDetailsTemplate = '<li><input type="radio" name="newfunID" value="' + arrLen[i].id+ '" class="NewSerRelationRadio" /><span class="fundName"> '+arrLen[i].name+'</span><span class="light"> <span>' + rs.balance + ' </span> '+arrLen[i].currency+myvmware.sdp.cmn.addComa(value)+ '</span><span class="light">, <span>' + rs.expiry + ' </span> ' +arrLen[i].expiry+' </span></li>';
							funDetailsHolder.push(fundDetailsTemplate);
						}
						$('.buyfundDetailsUl').html('');
						$('.buyfundDetailsUl').append('<ul>' + funDetailsHolder.join('') + '</ul>');	
						},function(){},	function(){vmf.loading.hide()},null,function(){vmf.loading.show()});					
				}
				});

			}else{
				setTimeout(function(){window.open(rs.buyService, '_blank');},500);	
			}
			
		});
		$('.fundServiceSelecton','#subscriptionFundService').bind('change',function(){
			var isChecked = $('.buySubscriptionFunds').attr( "checked" );			
			if (isChecked) {
				$('.buyfundDetailsUl').show();
				$('#buyNewServiceSubmit').addClass('disabled').attr('disabled',true);
				$('.NewSerRelationRadio').removeAttr('checked');
			}else{
				$('.buyfundDetailsUl').hide();
				$('#buyNewServiceSubmit').removeClass('disabled').removeAttr('disabled');
			}
			$("#subscriptionFundService").closest(".simplemodal-container").height($("#subscriptionFundService").height());
			$.modal.setPosition();
		});
		$('#buyNewServiceSubmit','#subscriptionFundService').bind('click',function(){
			var isChecked = $('.buySubscriptionFunds').attr( "checked" );
			if (isChecked) {
				window.location.href= rs.buyNewServicePartOne+fundIdRedirection+'&_VM_flow=sidDetails&_VM_serviceID='+rs.encryptedServiceInstanceId+rs.buyNewServicePartTwo;
				vmf.modal.hide();
			}else{
				vmf.modal.hide();
				setTimeout(function(){window.open(rs.buyService, '_blank');},500);
			}
		});
		$('input[name="newfunID"]').live('change',function(){
			$('#buyNewServiceSubmit').removeClass('disabled').removeAttr('disabled');
			fundIdRedirection=$(this).val();
			
		});
		$('.currStmnts','#praxisContainer').bind('click',function(){
			/*e.preventDefault();
			if (!$("#currStmntiFrame").length)
				$('<iframe id="currStmntiFrame" name="currStmntiFrame" style="width:0px;height:0px;font-size:0">').appendTo('body');
			$("#currStmntiFrame").attr("src",rs.url.getCurrentBillingUrl); */
			if($.trim(rs.url.getCurrentBillingUrl).length){
				window.open(rs.url.getCurrentBillingUrl, '_blank');
			} else {
				window.location.href = rs.url.getZeroDollarInvoiceURL;
			}
			setTimeout(function(){if(typeof riaLinkmy !="undefined") riaLinkmy("praxis : subscription-service-detail : currentStatement");},500);
		});
		$('.allStmnts','#praxisContainer').bind('click',function(){
			window.location.href = rs.url.getBillingDetailsUrl;
			setTimeout(function(){if(typeof riaLinkmy !="undefined") riaLinkmy("praxis : subscription-service-detail : allStatements");},500);
		});
		
		$(document).unbind('click').bind('click', function(event) { 
			var btns = ['.viewStatementsBtn', '.manageServiceBtn', '.buyNewServiceBtn'];
			var btnClass = ['viewStatementsBtn', 'manageServiceBtn', 'buyNewServiceBtn'];
			var flag = 1, i = 0, j = 0;

			if($(event.target).hasClass('btnMenuCont')) {
				for(i = 0; i < btnClass.length && flag; i++){
					if($(event.target).hasClass(btnClass[i])){
						for(j = 0; j < btns.length; j++){
							if(j != i)
								$(btns[j]).next('ul').hide();
						}
						var $clickedBtn = $(btns[i]);
						var $currList = $clickedBtn.next('ul');
						if($currList.is(':visible')){
							$currList.hide();
						}else{
							$currList.show();
						}
						flag = 0;
					}	
				}
			} else {
				//$('.manageServiceList,.viewStatementsList').hide();
				for(j = 0; j < btns.length; j++){
					$(btns[j]).next('ul').hide();
				}
			}        
		});	
		
		$('.cancelService','#praxisContainer').live('click', function(){
			vmf.modal.show('cancelModalWindow',{
				onShow: function(){
					$('input#agree','#cancelModalWindow').attr('checked',false).bind("click",function(){
						if($(this).is(":checked")){ 
							$("#btn_confrm","#cancelModalWindow").removeAttr('disabled').removeClass('disabled');
								$("#btn_confrm","#cancelModalWindow").die('click').live("click",function(){
									var url=rs.url.cancelServiceDetailsUrl, prodfamilydesc = rs.prodFamDesc;
									$("div.step1CancelService, #btn_confrm,#btn_cancel","#cancelModalWindow").hide();
									vmf.ajax.post(url, null, function(data) {
										if (typeof data!="object") data=vmf.json.txtToObj(data);
											//if(typeof data.errorCode != "undefined"){
											if(data.errorCode || data.ERROR_CODE){
												$(".headerTitle",'#cancelModalWindow').html(rs.cancelErrHeader);
												$("div.step3CancelService,#btn_ok","#cancelModalWindow").show();
												var errorMsg = data.errorMessage;
												if(data.ERROR_MESSAGE){errorMsg=data.ERROR_MESSAGE}
												$(".step3BodyMsg","#cancelModalWindow").html(errorMsg);
												$('#btn_ok','#cancelModalWindow').die('click').live('click',function(){
														vmf.modal.hide();
												});
												return false;
											}
										$("div.step2CancelService,#btn_ok","#cancelModalWindow").show();
										$(".step2BodyMsg","#cancelModalWindow").html(data.successMessage)
										$('#btn_ok','#cancelModalWindow').die('click').live('click',function(){
											vmf.modal.hide();
											window.location.href = rs.url.canSuccessRedirectUrl;
											//window.location.replace(canSuccessRedirectUrl); 
										});
										if(typeof riaLinkmy !="undefined") riaLinkmy("praxis : subscription-service-detail : cancelService");								
									},function(){
										$(".headerTitle",'#cancelModalWindow').html(rs.cancelErrHeader);
										$("div.step3CancelService,#btn_ok","#cancelModalWindow").show();
										$(".step3BodyMsg","#cancelModalWindow").html(rs.canServConMsg);
										$('#btn_ok','#cancelModalWindow').die('click').live('click',function(){
											vmf.modal.hide();
										});									
									},function(){$(".modalContent","#cancelModalWindow").css('height','');vmf.loading.hide();},300000,function(){$(".modalContent","#cancelModalWindow").css('height','270px');vmf.loading.show();});
								});	
						}else {
							$("#btn_confrm").attr('disabled',true).addClass('disabled');
						}
					}); 
					$('.fn_cancel','#cancelModalWindow').click(function(){vmf.modal.hide();});
				}
			});
		});

		$(".editPaymentMethod a", "#praxisContainer").live('click',function(e){
			if (rs.hasFundForExistingService=="true") {
				e.preventDefault();
			vmf.modal.show('editSubscriptionFundService',{
				onShow : function(){
				$(".editFundServiceSelecton input").removeAttr("checked");
				vmf.ajax.post(rs.fundDetailsUrl,'_VM_isNewPraxis=N',function(jsonResp){
						var funDetailsHolder = [];
						jsonResp = (typeof jsonResp!="object")? vmf.json.txtToObj(jsonResp) : jsonResp;
						data = jsonResp.fundGroupPaymentMethod;
						if(jsonResp.ERROR_CODE){
							$('#editSubscriptionFundService span.error').html(jsonResp.ERROR_MESSAGE);
							return false;
						}
						var eaDetails = '<li><strong>'+rs.account+': </strong><span class="editEaNumber">'+data.eaNumber+'</span> - <span class="editEaName"> '+data.eaName+'</span></li>';
						funDetailsHolder.push(eaDetails);
						var arrLen = data.fundDetails;
						for( i =0; i < arrLen.length; i++){
							var value="";
							if (arrLen[i].redemptionCurrency=="JPY") {
								value = parseFloat(arrLen[i].balance).toFixed(0);
							}else{
								value = parseFloat(arrLen[i].balance).toFixed(2);	
							}
							var fundDetailsTemplate = '<li class="'+arrLen[i].trueUp+'"><input type="radio" name="editFunID" fundName="'+arrLen[i].name+'" value="' + arrLen[i].id+ '" class="editRelationRadio" /><span class="FundName"> '+arrLen[i].name+'</span> <span class="light"> ' + rs.balance+' '+arrLen[i].currency+'<span class="bal light" data-bal="'+value+'">'+myvmware.sdp.cmn.addComa(value)+ ', </span></span><span class="light">' + rs.expiry + ' ' +arrLen[i].expiry+' </span></li>';
							funDetailsHolder.push(fundDetailsTemplate);
						}
						$('.EditFundsSelecton').append('<ul>' + funDetailsHolder.join('') + '</ul>');
					},function(){},function(){vmf.loading.hide()},null,function(){vmf.loading.show()});					
				}
			});
			$("#editSubscriptionFundService").closest(".simplemodal-container").height($("#editSubscriptionFundService").height());
			$.modal.setPosition();
		}
			if(typeof riaLinkmy !="undefined") riaLinkmy("praxis : subscription-service-detail : editPaymentMethod");

		});
		$('.fn_cancel').live('click',function(){vmf.modal.hide();});
		$('.editFundServiceSelecton','#editSubscriptionFundService').bind('change',function(){
			var isChecked = $('.editSubscriptionFunds').attr( "checked" );
			if (isChecked) {
				$('.EditFundsSelecton,.infoFund').show();
				$('#editFundServiceSubmit').addClass('disabled').attr('disabled',true);
			}else{
				$('.EditFundsSelecton,.infoFund').hide();
				$('#editFundServiceSubmit').removeClass('disabled').removeAttr('disabled');
				$('input[name="editFunID"],#iagree').removeAttr('checked');
			}
			$("#editSubscriptionFundService").closest(".simplemodal-container").height($("#editSubscriptionFundService").height());
			$.modal.setPosition();
		});
		$('#editFundServiceSubmit','#editSubscriptionFundService').bind('click',function(){
			$(this).attr("disabled","disabled").addClass("disabled");
			$('#editSubscriptionFundService span.error').html("");
			var isChecked = $('.editSubscriptionFunds').attr( "checked" );
			if (isChecked) {
				//$('.availableFundsSelecton').show();
				//alert('cd2.5');
				var data = {
					funID : $('.editRelationRadio:checked').val(),
					eaName: $('.editEaName').text(),
					eaNumber: $('.editEaNumber').text(),
					editServiceAlertFlag : false,
					fundName:$('.editRelationRadio:checked').attr("fundName")
				}
				vmf.ajax.post(rs.editMethodPostData,{"_VM_praxisPaymentFundGroupID":data.funID},function(jsonResp){
					$('#editFundServiceSubmit','#editSubscriptionFundService').removeAttr("disabled","disabled").removeClass("disabled");
					if (typeof jsonResp!="object") jsonResp=vmf.json.txtToObj(jsonResp);
					if(jsonResp.ERROR_CODE){
						$('#editSubscriptionFundService span.error').html(jsonResp.ERROR_MESSAGE);
						return false;
					} else if (jsonResp.status=="S"){
						var trueUp = $('.editRelationRadio:checked').parents('li').attr('class');				
						var balance = $('.editRelationRadio:checked').parents('li').find('.bal').attr('data-bal');
						$('.headerTitle','#editSubscriptionFundService').html(rs.success);
						$('.fundName','#editSubscriptionFundService').html(jsonResp.fundGroupName);
						$('.fundbal','#editSubscriptionFundService').html(balance);
						$('.fundId','#editSubscriptionFundService').html(jsonResp.firstABDAfterPaymentChange);
							if (trueUp == 1 && balance<=0) {
								$('.purchaseAvailableSucc,.purchaseUnAvailableSucc').show();
								$('#editFundServiceSubmit,.fn_cancel','#editSubscriptionFundService').hide();
								$('#editSubscriptionFundService .body,.infoFund').hide();
								$('#fundBtnOk').show();

							}else{
								$('#editFundServiceSubmit,.fn_cancel','#editSubscriptionFundService').hide();
								$('.purchaseAvailableSucc').show();
								$('#fundBtnOk').show();
								$('#editSubscriptionFundService .body,.infoFund').hide();
							}
					} else {
						$('#editSubscriptionFundService span.error').html(rs.genericError);
					}
				});
			}else{
				var editServiceUrl = $('.editPaymentMethod').find('a').attr('href');
				vmf.modal.hide();
				setTimeout(function(){window.open(editServiceUrl, '_blank');},500);
				//$('.availableFundsSelecton').hide();
				vmf.modal.hide();
			}
		});
		$('input[name="editFunID"]').live('change',function(){
			var $this = $(this);
			var trueUp = $this.parents('li').attr('class');
			var balance = parseFloat($this.parents('li').find('.bal').attr('data-bal'));
			//console.log(trueUp);
			//console.log(balance);
			$('#iagree').removeAttr('checked');
			if (balance<=0 && trueUp=="0") {
				$('.purchaseUnAvailable').show();
				$('.purchaseAvailable').hide();
				$('#editFundServiceSubmit').addClass('disabled').attr('disabled',true);
			}else{
				//alert('b');
				
				$('.purchaseAvailable').show();
				$('.purchaseUnAvailable').hide();
			}
			$("#editSubscriptionFundService").closest(".simplemodal-container").height($("#editSubscriptionFundService").height());
			$.modal.setPosition();

		});
		
		$('#iagree').live('change',function(){
			var isChecked = $(this).attr( "checked" );
			if (isChecked) {
				$('#editFundServiceSubmit').removeClass('disabled').removeAttr('disabled');
			}else{
				$('#editFundServiceSubmit').addClass('disabled').attr('disabled',true);
			}
		});
		$('#fundBtnOk','#editSubscriptionFundService').live('click',function(){
			vmf.modal.hide();
			$('li.editPaymentMethod', "#praxisContainer").removeClass('editPaymentMethod').find('a').attr('href','javascript:void(0)').addClass('disableCSO').removeAttr("target");
		});
		if(rs.editServiceAlertFlag.toLowerCase() =="y"){
			$('li.editPaymentMethod', "#praxisContainer").removeClass('editPaymentMethod').find('a').attr('href','javascript:void(0)').addClass('disableCSO').removeAttr("target");
		}
		
		if(rs.changeServiceAlertFlag.toLowerCase() =="y"){
			$('li.changeServiceOwner', "#praxisContainer").removeClass('changeServiceOwner').find('a').attr('href','javascript:void(0)').addClass('disableCSO');
		}
		if(rs.serviceOwnerLoggedIn.toLowerCase() =="n"){
			$('li.cancelService, li.changeServiceOwner, li.editPaymentMethod, li.usageSpendNoti', "#praxisContainer")
			.removeClass().find('a').attr('href','javascript:void(0)').addClass('disableCSO').removeAttr("target");
			$('a.usageSpendNoti.usageValue', "#praxisContainer").removeAttr('class').attr('href','javascript:void(0)').addClass('disableCSO');
		}
		if(rs.showAllStatements.toLowerCase() =="n"){
			$('li.allStmnts, li.currStmnts', "#praxisContainer").unbind('click').removeClass().addClass('disableCSO');
		}
		$(".manageUsers a", "#praxisContainer").live('click',function(){
			if(typeof riaLinkmy !="undefined") riaLinkmy("praxis : subscription-service-detail : manageUsers");
		});

		$(".getSupport a", "#praxisContainer").live('click',function(){
			if(typeof riaLinkmy !="undefined") riaLinkmy("praxis : subscription-service-detail : getSupport");
		});

		$('.usageSpendNoti', "#praxisContainer").live('click', function(){
				vmf.modal.show('usageSpendModalWindow',{
				onShow: function(){
						var $userSpend1 = $('.userSpendAmount'), 
							$userSpend2 = $('.userSpendAmountOptinal'),
							placeholderText = rs.placeholder1,
							placeholderTextsec=rs.placeholder2,
							noValueText = rs.noValEntered, usageval = $("a.usageValue").text(),
							tLimit1 = $.trim(rs.thresholdLimit1), tLimit2= $.trim(rs.thresholdLimit2);
							$userSpend1.val((tLimit1 !="")?tLimit1:placeholderText);
							$userSpend2.val((tLimit2 !="")?tLimit2:placeholderTextsec);
							/*Place holder logic - starts from here*/
								myvmware.common.putplaceHolder($('.userSpendAmount'));
								myvmware.common.putplaceHolder($('.userSpendAmountOptinal'));	
							/*Place holder logic - ends here*/
							$('.btn_Save','#usageSpendModalWindow').die('click').live('click', function(){
								var url1=rs.url.setUsageSpendNotificationURL, pramirayInput = '',secondaryInput = '',curSym = rs.sidCurrency;
								$(".error",'#usageSpendModalWindow').hide();
								errorMsgflag1 = myvmware.praxis.validate($userSpend1,placeholderText),
								errorMsgflag2 = myvmware.praxis.validate($userSpend2,placeholderTextsec);
								var postData = {"_VM_thresholdLimit1":'',"_VM_thresholdLimit2":''};								
								if(errorMsgflag1 && errorMsgflag2) {
									pramirayInput  = $.trim($userSpend1.val().replace(placeholderText,""));
									secondaryInput = $.trim($userSpend2.val().replace(placeholderTextsec,""));
									postData._VM_thresholdLimit1 = pramirayInput;
									postData._VM_thresholdLimit2 = secondaryInput;
									var modUSN = "";
									if(pramirayInput =="" && secondaryInput ==""){
										modUSN = noValueText;
									}else if(pramirayInput !="" && secondaryInput =="") {
										modUSN = curSym+pramirayInput;
									}else if(pramirayInput =="" && secondaryInput !="") {
										modUSN = curSym+secondaryInput;
									}else{
										modUSN = curSym+pramirayInput+"/ "+curSym+secondaryInput;
									}
									if(pramirayInput != tLimit1 || secondaryInput!= tLimit2){
									vmf.ajax.post(url1, postData, function(data) {
										if (typeof data!="object") data=vmf.json.txtToObj(data);
											if(data.ERROR_CODE){
												$(".error",'#usageSpendModalWindow').html(data.ERROR_MESSAGE).show();
												return false;
											}
											//pramirayInput  = (pramirayInput =='0') ?"":pramirayInput;
											//secondaryInput = (secondaryInput =='0') ?"":secondaryInput;
											/*if(pramirayInput =="" && secondaryInput ==""){
												modUSN = noValueText;
											}else if(pramirayInput !="" && secondaryInput =="") {
												modUSN = curSym+pramirayInput;
											}else if(pramirayInput =="" && secondaryInput !="") {
												modUSN = curSym+secondaryInput;
											}else{
												modUSN = curSym+pramirayInput+"/ "+curSym+secondaryInput;
											}*/	
											if(typeof riaLinkmy !="undefined") riaLinkmy("praxis : subscription-service-detail : usageSpendNotification");	
											rs.thresholdLimit1 = pramirayInput;											
											rs.thresholdLimit2 =secondaryInput;
											$("a.usageValue").text(praxis.addComa(modUSN));
											vmf.modal.hide(); 
										},function(data){
											$(".error",'#usageSpendModalWindow').html(rs.canServConMsg).show();
											$('#btn_ok','#usageSpendModalWindow').die('click').live('click',function(){vmf.modal.hide();});	
											return false;
										},function(){vmf.loading.hide()},300000,function(){vmf.loading.show()});
									}else{
										$("a.usageValue").text(praxis.addComa(modUSN));
										vmf.modal.hide();
										return false;
									}
								}else{
									return false;
								}
						}); 
						$('#btn_cancel','#usageSpendModalWindow').live('click', function(){vmf.modal.hide();});
				}
			});
		});
		$('.changeServiceOwner', "#praxisContainer").live('click', function(){
			vmf.modal.show('changeServiceOwner',{
				checkPosition: true,
				onShow: function(){
					var url=rs.url.changeServiceOwnerDetailsURL, urlSave = rs.url.newChangeServiceOwnerURL, $csoCont = $('.csoList','#changeServiceOwner'), allOptions = '',tempData,OptionText,$csoDet = $('.csoDetailsCont','#changeServiceOwner'), selUser='';
					$('#btn_ok, #btn_cancel','#changeServiceOwner').die('click').live('click',function(){
						vmf.modal.hide();
					});	
					
					function errorCSO(msg){
						$(".headerTitle",'#changeServiceOwner').html(rs.csoErrHeader);
						$("div.step1CSO,#btn_submit,#btn_cancel","#changeServiceOwner").hide();
						$("div.step3CSO,#btn_ok","#changeServiceOwner").show();
						$(".step3BodyMsg","#changeServiceOwner").html(msg);
					}
					if (rs.isTokenEnabled=="false") {
						vmf.ajax.post(url,null, function(data) {
							if (typeof data!="object") data=vmf.json.txtToObj(data);
							if(data.ERROR_CODE){
								errorCSO(data.ERROR_MESSAGE);
								return false;
							}
							for(var i = 0; i < data.changeSerOwner.length; i++){
								tempData = data.changeSerOwner[i];
								OptionText = "<p class='csoName'>"+tempData[2]+"</p><p class='csoEmail'>"+tempData[1]+"</p>";

								allOptions += '<li data-csoName = "'+tempData[2]+'" data-csoEmail="'+tempData[1]+'" value="'+tempData[0]+'">'+OptionText+'</li>';
							}
							if(data.changeSerOwner.length ==0){
								allOptions = '<li class="noData">'+rs.csoNoEligibleUser+'</li>'
							}
							$csoCont.find('ul').html(allOptions);	
							$('.step1CSO','#changeServiceOwner').show();
							$("#changeServiceOwner").closest(".simplemodal-container").height($("#changeServiceOwner").height());
							$.modal.setPosition();
						},function(data){
							errorCSO(rs.canServConMsg); 
						},function(){vmf.loading.hide()},300000,function(){vmf.loading.show()});

						$("#changeServiceOwner").die('click').live('click', function(event){
							if($csoDet.is(':visible')){
								$csoDet.hide();
							}else{
								if($(event.target).hasClass('secondary') || $(event.target).hasClass('eaInputWrapper')){
									var that = $('.csoButton','#changeServiceOwner');
									$csoDet.show();
									$csoCont.find('li').die('click').live('click',function(e){
										if($(e.target).hasClass('noData')){return false;}
										var $this = $(this);
										selUser = $(this).data('csoname');
										that.text(selUser);
										$csoDet.hide();
										$('.csoAlertcont,.userInfoAftSel','#changeServiceOwner').show();
										$("#changeServiceOwner").closest(".simplemodal-container").height($("#changeServiceOwner").height());
										$.modal.setPosition();
										$('input#agree','#changeServiceOwner').attr('checked',false).bind("click",function(){
											if($(this).is(":checked")){
												$("#btn_submit","#changeServiceOwner").removeAttr('disabled').removeClass('disabled').die('click').live("click",function(){
													var postData={'_VM_newUserID':$this.attr('value'),'_VM_newEmailID':$this.data('csoemail'),'_VM_newServiceOwnerName':$this.data('csoname')};

													vmf.ajax.post(urlSave,postData, function(data) {
														if (typeof data!="object") data=vmf.json.txtToObj(data);
														if(data.ERROR_CODE || data.errorCode){
															var message =(data.ERROR_CODE)?data.ERROR_MESSAGE:data.errorMessage;
															errorCSO(message);
															return false;
														}
														$("div.step1CSO,#btn_submit,#btn_cancel","#changeServiceOwner").hide();

														$("div.step2CSO,#btn_ok","#changeServiceOwner").show();
														$(".step2BodyMsg","#changeServiceOwner").html(data.successMessage);
														$('#btn_ok','#changeServiceOwner').die('click').live('click',function(){
															window.location.reload();
															//history.go(0);
															//window.location.href=window.location.href;
															vmf.modal.hide();
														});			

													},function(data){
														errorCSO(rs.canServConMsg); 
													},function(){
														 if(typeof riaLinkmy !="undefined") riaLinkmy("praxis : subscription-service-detail : changeserviceowner");		
														vmf.loading.hide()},300000,function(){vmf.loading.show()});									
												});
											}
											else{
												$("#btn_submit").attr('disabled',true).addClass('disabled');
											}
										});	
									});							
								}
							}
						});
					}	
				} 
			});
		});
		$('.addOnNewService', "#praxisContainer").die('click').live('click', function() {
			var mqty = '0';
			vmf.modal.show('newOdtModalWindow', {
				checkPosition: true,
				onShow: function(){
					//var url = "odt-addon.json", _postData = null; 
					var url = rs.url.buyOdtAddonUrl, _postData = null; 
					var odtOrders = null, odtServiceID = "", odtCustNum = "", odtPostOrders = [], odtEaNum = "";

					var odtCreditText = rs.odtCreditText, odtAgreeText = rs.odtAgreementText;

					function errorODT(msg){
						$(".headerTitle",'#newOdtModalWindow').html(rs.Order_Submission_Error);
						$("#odtAddOnStep1, #odtBtnSubmit, #odtBtnCancel","#newOdtModalWindow").hide();
						$("#odtAddOnStep3, #odtBtnOk","#newOdtModalWindow").show();
						$("#odtAddOnStep3 .odtStep3BodyMsg","#newOdtModalWindow").html(msg);
					}

					vmf.ajax.post(url, _postData, 
						function(data){						//success
							//alert('success');
							//console.log(data.odtAddOnOrders);
							if (typeof data!="object") data=vmf.json.txtToObj(data);
							if(data.ERROR_CODE){
								errorODT(data.ERROR_MESSAGE);
								return false;
							}

							odtServiceID = data.serviceInstanceID;
							odtCustNum = data.customerNumber;
							odtEaNum = data.entitlementAccountNumber;
							odtOrders = data.orders;


							if(odtOrders.length > 0){
								var totalAmt = 0;
								var odtAddOnTable = $('<table class="odtAddOnTable"></table>');	
								var tableHead = $("<thead></thead>");
								var tableRow = $('<tr class="odtHeaderRow"></tr>');
								var headerCols = '<th>' + rs.Item + '</th><th>' + rs.Billing_Rate + '</th> <th style="text-align:center">' + rs.Quantity + '</th>';
								tableRow.html(headerCols);
								tableHead.append(tableRow);
								odtAddOnTable.append(tableHead);
								var tableBody = $("<tbody></tbody>");
								for(var i = 0; i < odtOrders.length; i++){
									//create table rows...
									//also calculate for the total amount that is to be shown as total
									tableRow = $('<tr class="odtAddOnRow"></tr>');
									var odtAddOnCols = '<td class="odtAddOnNameTd">'+odtOrders[i][0]+'</td><td class="odtBillingRateTd">'+odtOrders[i][1]+'/'+odtOrders[i][2]+'</td><td class="odtQuantityTd"><input type="text" class="odtAddonQty" maxLength="3" value="'+odtOrders[i][3]+'" ></td>';
									tableRow.html(odtAddOnCols);
									tableBody.append(tableRow);
									
									totalAmt += parseInt((odtOrders[i][1]).substring(1)) * odtOrders[i][3];
									odtPostOrders.push([odtOrders[i][4], odtOrders[i][3]]);
								}
								odtAddOnTable.append(tableBody);

								var odtTotalPriceDiv = $('<div class="odtTotalPriceRow clearfix"></div>')
								//tableRow = $('<tr class="odtTotalPriceRow"></tr>');
								var odtTotalAmtCols = '<div class="agreeTextDiv"><p class="odtCreditText">'+odtCreditText+'</p><p class="odtAgreeText"><input type="checkbox" id="odtAgreeTermsCheck"/>'+odtAgreeText+'</p></div><div class="odtTotalOrder"> <p class="odtTotalOrderText">' + rs.Order_Total + '</p> <p id="odtTotalOrderAmt">$'+totalAmt.toFixed(2)+'<p></div>';
								odtTotalPriceDiv.html(odtTotalAmtCols);
								//tableBody.append(tableRow);
								
								$('#newOdtModalWindow #odtAddOnStep1 #odtTableContainer').append(odtAddOnTable);	
								$('#newOdtModalWindow #odtAddOnStep1').append(odtTotalPriceDiv);	
							}
							$("#newOdtModalWindow").closest(".simplemodal-container").height($("#newOdtModalWindow").height());
							$.modal.setPosition();
						},
						function(){						//error
							errorODT(rs.odtErrorText);
						},
						function(){vmf.loading.hide()},		//complete
						null,								//timeout
						function(){vmf.loading.show()},		//beforesend
						false								//async
					);
					
					$('.odtAddonQty','#newOdtModalWindow').live('keypress', function(e){
						if (!e) var e = window.event;
						var event = e.which;
						if((event >= 48 && event <= 57) || event == 8 || event == 0) {
							return true;
						} else {
							return false;
						}
					}).live('focus', function(){
						mqty = $(this).val();
					}).die('keyup').live('keyup', function(e){
						if (!e) var e = window.event;
						calculateOdtAddonCost($(this), e);
					}).die('blur').live('blur', function(e){
						if (!e) var e = window.event;
						calculateOdtAddonCost($(this), e);
					}); 

					function calculateOdtAddonCost(qtyTb, event){
						var $qty = qtyTb;
						var qtyVal = $qty.val();
						if(((qtyVal == "") || (isNaN(parseFloat($qty.val()))) || (qtyVal == "0")) && (event.type == 'blur' || event.type == 'focusout')) {
							qtyVal = '1';	
							$qty.val('1');
						} else if((qtyVal == "") || (isNaN(parseFloat($qty.val())))){
							qtyVal = '0';	
						}
						var rowNo = $qty.closest('tr').index();
						var totalAmt = parseFloat($("#odtTotalOrderAmt").html().substring(1));
						var amtToSub = parseFloat((odtOrders[rowNo][1]).substring(1)) * odtPostOrders[rowNo][1];
						var amtToAdd = parseFloat((odtOrders[rowNo][1]).substring(1)) * parseFloat(qtyVal);
						totalAmt = totalAmt - amtToSub + amtToAdd;
						$("#odtTotalOrderAmt").html(rs.sidCurrency + totalAmt.toFixed(2));
						odtPostOrders[rowNo][1] = parseFloat(qtyVal);
					} 

					$('#odtAgreeTermsCheck','#newOdtModalWindow').die('change').live('change', function(){
						if($(this).is(":checked")){
							$('#odtBtnSubmit','#newOdtModalWindow').removeAttr('disabled').removeClass('disabled').die('click').live("click",function(){
								var urlSave = rs.url.submitPraxisAddon;
								var postOrders = null;
								var ordersString = '';
								for(var i = 0; i < odtPostOrders.length; i++){
									if(i == odtPostOrders.length - 1){
										ordersString += odtPostOrders[i][0]  + ':' + odtPostOrders[i][1];
									}
									else{		
										ordersString += odtPostOrders[i][0]  + ':' + odtPostOrders[i][1] + '|';
									}	
								}
								var postData={'_VM_serviceInstanceID': odtServiceID, '_VM_customerNumber': odtCustNum, '_VM_entitlementAccountNumber': odtEaNum, '_VM_Orders': ordersString};

								vmf.ajax.post(urlSave, postData, function(data) {
									if (typeof data!="object") data=vmf.json.txtToObj(data);
									if(data.ERROR_CODE || data.errorCode){
										var message =(data.ERROR_CODE)?data.ERROR_MESSAGE:data.errorMessage;
										errorODT(message);
										return false;
									}
									$("#odtAddOnStep1, #odtBtnSubmit, #odtBtnCancel","#newOdtModalWindow").hide();
									$(".headerTitle", "#newOdtModalWindow").html(rs.Add_on_Order);
									$("#odtAddOnStep2, #odtBtnOk","#newOdtModalWindow").show();
									$("#odtAddOnStep2 .odtStep2BodyMsg","#newOdtModalWindow").html(data.message).addClass('odtStep2SuccessText');
								},function(data){
									errorODT(rs.canServConMsg); 
								},function(){
									//if(typeof riaLinkmy !="undefined") riaLinkmy("praxis : subscription-service-detail : changeserviceowner");		
									vmf.loading.hide()},300000,function(){vmf.loading.show()});									
							});
						}
						else{
							$("#odtBtnSubmit").attr('disabled',true).addClass('disabled');
						}					
					}); 

					$('#odtBtnCancel','#newOdtModalWindow').die('click').live('click', function(){vmf.modal.hide();});
					$('#odtBtnOk','#newOdtModalWindow').die('click').live('click', function(){
						window.location.reload(); vmf.modal.hide();
					});
				}
			});
		});
	},
	addComa:function(string){
		var str = string.toString();
		var pattern = /(-?\d+)(\d{3})/;
		while(pattern.test(str)){
			str = str.replace(pattern, "$1,$2");
		}
		return str;
	},
    loadCurrentData :function(currentUrl){
		var urlString = currentUrl,parentContainer = praxis.parentContainer;
		$("#statementCurrentUsage","#praxisContainer").hide();
    	var allData = praxis.loadData(urlString);
		
		if(allData == null){return false;}
		$("#statementCurrentUsage","#praxisContainer").show();
		praxis.currentHeaderData = allData.headerData;
    	praxis.allplotsData = allData.plotData;

    	for(keys in praxis.currentHeaderData){
    		praxis.currentCategoryArray.push(keys);
    	}
    	$('.estiCTDval', parentContainer).html(allData.estimatedCostToDate);
    	$('.estiCTDdate', parentContainer).html(rs.mtdText+' - '+allData.monthToDate+' '+rs.daysText);
    	$('.curConUsageleftText2', parentContainer).html(allData.startDate + ' to ' + allData.endDate);
		praxis.minDate = allData.abdStart;
    	praxis.maxDate = allData.abdEnd;
    	praxis.pause();
    	praxis.resume();
    },
	
	loadData :function(url, year){
		var ret = null, postData = {};
		if(year != undefined){postData = {"_VM_yearID": year};}
		vmf.ajax.post(url,postData,
			function(data){
				var message;
				if(typeof data=="string") data = vmf.json.txtToObj(data);
				//data = $.parseJSON(data);				
				if(data.ERROR_CODE != undefined || 
				(data.headerData != undefined && $.isEmptyObject(data.headerData)) || 
				(data.plotData != undefined && $.isEmptyObject(data.plotData)) || 
				(data.years != undefined && data.years.length ==0) || 
				(data.services != undefined && data.services.length == 0)){
				if(praxis.pastOrCurrent == 1){
					message = (data.ERROR_CODE)?data.ERROR_MESSAGE:rs.noCurrentUsage;
				}
				else{
					message = (data.ERROR_CODE)?data.ERROR_MESSAGE:rs.noPastUsage;
				}					
				if(praxis.pastOrCurrent == 0) {
					if(data.years == undefined || data.years.length == 0) {$('p.curUsageErrorMsg','#praxisContainer').html('').html(message).show();}
						else{ret = data;}
					}else{
						$('p.curUsageErrorMsg','#praxisContainer').html('').html(message).show();
						$('a.exportCus.currExport').hide();
					}
					praxis.pause();
					return false;
				}	
				if(praxis.pastOrCurrent == 1) {	$('a.exportCus.currExport','#praxisContainer').show();}
				ret = data;
			},
			function(){
				$('p.curUsageErrorMsg',"#praxisContainer").html(rs.genericError);
			},		//error
			function(){$("#loadingSYm").hide();},	//complete
			null,									//timeout
			function(){},	//beforesend
			false									//async
		);	
		return ret;
    },    
	
	validate :function(inputEle,inputTxt){
		var regExp = /^[0-9]*$/,flag=false, inputEleVal = inputEle.val();
		if (inputEleVal !='' && inputEleVal != inputTxt ){
				if (!regExp.test(inputEleVal)) {
					inputEle.addClass('err');
					inputEle.next('span').find('.ErrMsg').show();
					flag=false;
				}else{
					inputEle.removeClass('err');
					inputEle.next('span').find('.ErrMsg').hide();
					flag=true;
				}
		}else{
			flag =true;
		}
		return flag;	 	    		
	},
	
	buildRibbonCarousel:function(headerData){
		var ulWrapper = $('div.ribbonNav'),
	    	ulstart = $('<ul class="currentHeadings"></ul>'),
	    	i=0, ctdOrOdt = '';
 	    for(var key in headerData){ 
			if(praxis.allplotsData[key].eleType == 1)	{
				ctdOrOdt = rs.odtOneTimeCost;
			} else {
				ctdOrOdt = rs.Cost_to_date;
			}
			var liElement = $('<li></li>').attr('id',"ribbonHeading_"+i),
			liText = '<p class="topText">'+praxis.allplotsData[key].displayName+'</p><div><p class="costValue">'+headerData[key][0]+'</p><p class="greyText">'+headerData[key][1]+'</p></div><p class="ctd">'+ ctdOrOdt + ' ' + headerData[key][2]+'</p>';
			liElement.html(liText);
			ulstart.append(liElement);
			i++;
		}
		ulstart.find('li:eq(0)').addClass('selectedRHead');
		if(ulstart.find('li').length==1) { 
			$('.leftNav,.rightNav').css('visibility','hidden'); 
		}else{ 
			$('.leftNav,.rightNav').css('visibility','visible');
		}
		ulWrapper.append(ulstart);
		praxis.setArrowPosition();
	},
	
	setArrowPosition:function(){
		$('.arrowMarker').css('left','0px');
		var offset3,offset4,leftposition;
		offset3 = $('.selectedRHead').offset();
		offset4 = $('.arrowMarker').offset();
		leftposition = offset3.left+($('.selectedRHead').width()/2) - offset4.left -20;
		$('.arrowMarker').css('left',leftposition);
	},
	
	buildPlotWrappers: function(year, obj){
		var parallexString = "parallex_", 
			plotWrapperString = "plotWrapper_"+year, 
			plotWrapperIdString = "plotWrapper_"+year+"_", 
			chartIdString = "chart_"+year+"_",
			//allPlotsWrapperString = '.allPastPlotsWrapper',
			categoryArray = praxis.yearServices[year],
			yearlyOrMonthly = "Yearly",
			parallexStart = '<div class = "'+parallexString+year+'">', parallexEnd = '</div>';
	    	wrapper = "", wrapperStart = "", legendBoxStart = "", wrapperEnd = "", legendBoxEnd = "",
	    	chartDiv = "",legendBox = "", firstLegendBox = "", secondLegendBox = "",parallexElement = "",allWrappers = "",chartTitle = "";			
		
		if(year == "current") {
	    	//allPlotsWrapperString = '.allPlotsWrapper'; 
	    	categoryArray = praxis.currentCategoryArray; 
	    	yearlyOrMonthly = "Monthly";
    	} 

    	for(var i = 0; i < categoryArray.length; i++){
    		wrapperStart = '<div id="'+plotWrapperIdString+i+'" class="'+plotWrapperString+'">';
    		chartTitle = '<div class="titleLegends"></div>';
    		legendBox ='<div class="legendBox2 clearfix"></div>';
    		wrapperEnd = '</div>';
    		chartDiv = '<div id="'+chartIdString+i+'" class="plotDiv"></div>';
    		wrapper = wrapperStart + chartTitle + legendBox + chartDiv + wrapperEnd;
    		allWrappers += wrapper;
    	}
    	parallexElement = parallexStart + allWrappers + parallexEnd;
    	obj.append(parallexElement);
	},  

	buildCarousel: function(year){
		var currentSelectedYear = year, 
			parentContainer = praxis.parentContainer, 
			parallexContainerString = '.parallex_' + currentSelectedYear,
			plotWrapperString = '.plotWrapper_' + currentSelectedYear,
			allYearPastPlots = $(plotWrapperString, parentContainer);
		
		$(parallexContainerString).addClass('newParallex_year');
	  	
	  	if (allYearPastPlots.length > 0) {
	        //$(plotWrapperString,parentContainer).css('left', '1200px');	
			$(plotWrapperString,parentContainer).css('left', '1357px');
	        $(plotWrapperString,parentContainer).addClass('pastPlotWrapper_year');
	        $(plotWrapperString,parentContainer).first().addClass('plotDivInView').css('left', '0px');
		}
	},

	bindEvents:{
		carouselEvents: function(){
			$('.plotDivInView').live('jqplotMouseEnter',function (ev, seriesIndex, pointIndex, data) {praxis.pause();});
            $('.plotDivInView').live('jqplotMouseLeave',function (ev, seriesIndex, pointIndex, data) {praxis.resume();});

			var parentContainer = myvmware.praxis.parentContainer;
			$('#ribbonLeft, #ribbonRight, #pastNext, #pastPrevious', parentContainer).live('click', function (e) {
				var praxis = myvmware.praxis, parentContainer = praxis.parentContainer, cElement = praxis, pastOrCurrent = praxis.pastOrCurrent, currentSelectedYear = praxis.currentSelectedYear, first, last,
					plotWrapper = $('.plotWrapper_' + currentSelectedYear),
		    	    plotWrapperString = '.plotWrapper_' + currentSelectedYear,
				    plotDivInViewString = '.plotWrapper_' + currentSelectedYear + '.plotDivInView',
				    plotDivInView = $(plotDivInViewString),
					currentIndex = $(plotDivInViewString,parentContainer).find('.plotDiv').attr('id'),
					targetId = $(this).attr('id'), localSelected;
				
				currentIndex = parseInt(currentIndex.split('_')[2]);

			    if (targetId == 'ribbonRight' || targetId == 'pastNext') {
					$('#'+targetId).attr('disabled','disabled').addClass('disabled');
					praxis.pause();
   	
					if($(plotWrapperString,parentContainer).length > 1){
						if(praxis.pastOrCurrent == 1){
							if($('li.selectedRHead').nextAll('.currentHeadings li').length == 0){
								first = $('.currentHeadings li:first');
								last = $('.currentHeadings li:last');
								first.insertAfter(last); 
							}
						}
						
						if (currentIndex == ($(plotWrapperString,parentContainer).length - 1)) {
							praxis.gotoNextPlot(0, currentIndex, targetId);
							localSelected = 0;
						} else {
							praxis.gotoNextPlot(currentIndex + 1, currentIndex, targetId);
							localSelected = currentIndex + 1;
						}
					}
			    }
			    if (targetId == 'ribbonLeft' || targetId == 'pastPrevious') {
					$('#'+targetId).attr('disabled','disabled').addClass('disabled');
					praxis.pause();
			    			
					if($(plotWrapperString,parentContainer).length > 1){
						if(praxis.pastOrCurrent == 1){
							if($('li.selectedRHead').prevAll('.currentHeadings li').length == 0){
								first = $('.currentHeadings li:first');
								last = $('.currentHeadings li:last');
								last.insertBefore(first);               
							}
						}
						
						if (currentIndex == 0) {
							praxis.gotoPreviousPlot($(plotWrapperString,parentContainer).length - 1, currentIndex, targetId);
							localSelected = $(plotWrapperString,parentContainer).length - 1;
						} else {
							praxis.gotoPreviousPlot(currentIndex - 1, currentIndex, targetId);
							localSelected =   currentIndex - 1; 
						}
					}
			    }
				if(praxis.pastOrCurrent == 0){ 	
					praxis.updateDropdown(localSelected, currentSelectedYear);	
				}

			    /*if(toBeReploted < currentCategoryArray.length){
			    	plots[currentCategoryArray[localSelected]].plot.replot({resetAxes: true});
			    	toBeReploted++;
			    }*/
				if(e.hasOwnProperty('originalEvent')){
				if(praxis.pastOrCurrent == 1)
					if(typeof riaLinkmy !="undefined") riaLinkmy("praxis : subscription-service-detail : currentusage : componentChange");
				else
					if(typeof riaLinkmy !="undefined") riaLinkmy("praxis : subscription-service-detail : pastusage : componentChange");
				}
			});
		},

		tabEvents: function(){
			var parentContainer = praxis.parentContainer, plotDivInViewString, allPlotsWrapperString, currentIndex;

			$('.currentUsage',parentContainer).bind('click', function(e){
				$('#beak_'+myvmware.praxis.pastBeaks).hide();
				var praxis = myvmware.praxis, checkData = praxis.allplotsData, cElement = praxis, pastOrCurrent = praxis.pastOrCurrent; 
				praxis.currentSelectedYear = "current";
				praxis.pause();
				praxis.pastOrCurrent = 1;
				praxis.toBeReploted = 0;
				$('a.exportCus.pastExport',parentContainer).hide();
				if(typeof riaLinkmy !="undefined") riaLinkmy("praxis : subscription-service-detail : currentUsage");
				
				e.preventDefault();
				if(checkData != undefined && !$.isEmptyObject(checkData)){
					$('#loadingSYm, p.curUsageErrorMsg','#praxisContainer').hide();
					$('#statementCurrentUsage','#praxisContainer').show();
					$('a.exportCus.currExport',parentContainer).show();
				
					if(praxis.resizeForCurr == true) {
                        plotDivInViewString = '.allPlotsWrapper .plotWrapper_' + praxis.currentSelectedYear + '.plotDivInView';
                        allPlotsWrapperString = '.allPlotsWrapper';

                        currentIndex = $(plotDivInViewString, parentContainer).find('.plotDiv').attr('id');
                        currentIndex = parseInt(currentIndex.split('_')[2]);
                        setTimeout(function(){
                            praxis.drawCurrentPlot(currentIndex, praxis.currentSelectedYear);
                        }, 10);
                    }
					praxis.resume();
				}else{
					$('#statementCurrentUsage,#curConUsage,#carouselHeadings,.graphWithMarker,.graphSection','#praxisContainer').hide();
					$('p.curUsageErrorMsg','#praxisContainer').html('').html(rs.noCurrentUsage).show();
					$('a.exportCus.currExport',parentContainer).hide();
					return false;
				}				
			});

			$('.pastUsage',parentContainer).bind('click', function(e){
				$('#beak_'+myvmware.praxis.pastBeaks).show();
				var praxis = myvmware.praxis, pastOrCurrent = praxis.pastOrCurrent, yearSelected, yearsFlag = false,allData={},url, parentContainer = praxis.parentContainer, currentSelectedYear = praxis.currentSelectedYear, clickedIndex = $('#variousCostsUsage', parentContainer)[0].selectedIndex, plotDivInViewString, currentIndex, allPlotsWrapperString, legendPlotWrapper;
				praxis.pause();
				e.preventDefault();
				praxis.pastOrCurrent = 0;
				praxis.toBeReploted = 0;
				if(typeof riaLinkmy !="undefined") riaLinkmy("praxis : subscription-service-detail : pastUsage");
				$('a.exportCus.currExport, p.curUsageErrorMsg', parentContainer).hide();
				yearsFlag = ($('#pastYears option').length <= 0);
				if(praxis.pastClicked == 0){
					$("#loadingSYm",'#praxisContainer').show();
					$('#statementPastUsage, .pastCont, .pastYearsCont, p.curUsageErrorMsg, .newGraphSection, .drpdwnCatCont',"#praxisContainer").hide();
					praxis.pastClicked = 1;
					url = rs.url.getYearForPastUsageDetailsUrl;
					allData = praxis.loadData(url);
					$("#loadingSYm",'#praxisContainer').show();
					if(allData == null){
						$("#loadingSYm",'#praxisContainer').hide(); 
						$('p.curUsageErrorMsg','#praxisContainer').html('').html(rs.noPastUsage).show(); 
						return false;
					}
					praxis.pastYears =  allData.years;
					praxis.createYearDropdown();
					$('#statementPastUsage,.pastCont,.pastYearsCont',"#praxisContainer").show();
					//yearsFlag = ($('#pastYears option').length <= 0);
					praxis.currentSelectedYear = $('#pastYears',parentContainer).val();
					praxis.allPastPlotsData[praxis.currentSelectedYear] = allData.plotData;
			    	praxis.yearServices[praxis.currentSelectedYear] = allData.services;
			    	praxis.bsDates[praxis.currentSelectedYear] = allData.billingDates;
			    	
					currentSelectedYear = praxis.currentSelectedYear; 
			    	plotDivInViewString = '.allPastPlotsWrapper .plotWrapper_' + praxis.currentSelectedYear + '.plotDivInView';
					if($.isEmptyObject(praxis.allPastPlotsData[praxis.currentSelectedYear])){
						$('p.curUsageErrorMsg','#praxisContainer').html('').html(rs.noPastUsage).show();
						$("#loadingSYm",'#praxisContainer').hide();	
						return false;
					}
					var urlForPastUsage = rs.url.pastusagereport + "&_VM_selectedYear="+$("#pastYears").val();
					$('a.exportCus.pastExport',parentContainer).attr('href',urlForPastUsage).show();
					$('.drpdwnCatCont, .newGraphSection',"#praxisContainer").show();
					$("#loadingSYm",'#praxisContainer').hide();	
					praxis.createServicesDropdown(praxis.currentSelectedYear);
					myvmware.praxisObj.pastUsage(praxis.currentSelectedYear, $('.allPastPlotsWrapper'));
					praxis.createBillingDropdown();
					praxis.alignElements(praxis.currentSelectedYear);
					praxis.resume();
					praxis.showPastPraxisBeaks();
				}else{
					if(!yearsFlag){
						praxis.currentSelectedYear = $('#pastYears',parentContainer).val();
						if($.isEmptyObject(praxis.allPastPlotsData[praxis.currentSelectedYear])){
							$('p.curUsageErrorMsg','#praxisContainer').html('').html(rs.noPastUsage);
							$('p.curUsageErrorMsg, #statementPastUsage',"#praxisContainer").show();
							return false;
						}
						$('a.exportCus.pastExport',parentContainer).show();	
						if(praxis.resizeForPast == true) {
                            plotDivInViewString = '.allPastPlotsWrapper .plotWrapper_' + praxis.currentSelectedYear + '.plotDivInView';
                            allPlotsWrapperString = '.allPastPlotsWrapper';

                            currentIndex = $(plotDivInViewString, parentContainer).find('.plotDiv').attr('id');
                            currentIndex = parseInt(currentIndex.split('_')[2]);
                            setTimeout(function(){
                                praxis.drawCurrentPlot(currentIndex, praxis.currentSelectedYear);
								praxis.alignElements(praxis.currentSelectedYear);
                            }, 10);
                        }
						praxis.resume();
					}else{
						$('p.curUsageErrorMsg','#praxisContainer').html('').html(rs.noPastUsage);
						$('p.curUsageErrorMsg, #statementPastUsage',"#praxisContainer").show();
						$('.newGraphSection',"#praxisContainer").hide();
						return false;
					}
				}				
			});
		},
		
		otherCurrentEvents: function(){
			var parentContainer = praxis.parentContainer;
			$('.currentHeadings li',parentContainer).bind('click', function () {
			    var clickedIndex = $(this).attr('id'),currentIndex = $('.plotDivInView').find('.plotDiv').attr('id');
					clickedIndex = parseInt(clickedIndex.split('_')[1]);
				    currentIndex = parseInt(currentIndex.split('_')[2]);
			    if (clickedIndex != currentIndex) {praxis.gotoNthPlot(clickedIndex, currentIndex);}
			});
			$('.currentHeadings li')
				.bind('mouseover', function(){$(this).addClass("ribbonBorderTop")})
				.bind('mouseout', function(){$(this).removeClass("ribbonBorderTop")})
		}
	},

	updateHeader: function (currentIndex) {
		var parentContainer = praxis.parentContainer,offset1, offset2, finalwidth;
	    $('.currentHeadings', parentContainer).find('li').removeClass('selectedRHead');
	    $('#ribbonHeading_'+currentIndex, parentContainer).addClass('selectedRHead');	
	    praxis.setArrowPosition();
		offset1 = $('#ribbonHeading_'+currentIndex).offset();
		offset2 = $('.ribbonNav').offset();			
		finalwidth = (offset1.left - offset2.left) + $('#ribbonHeading_'+currentIndex).width();
		
		if(finalwidth > $('.ribbonNav').width()){
			var scrollVal = finalwidth - $('.ribbonNav').width();				
			$( ".currentHeadings" ).animate({left: "-="+scrollVal}, 0, function() {});	
		}			
		if(offset2.left > (offset1.left + 20)){
				var temp = offset1.left + $('#ribbonHeading_'+currentIndex).width();			
				var finalScroll = temp + offset2.left;
				$( ".currentHeadings" ).css('left','0px');	
				/*$( ".currentHeadings" ).animate({left: "+="+finalScroll}, 0, function() {
								
				});	*/
		}
	},

	alignElements: function(year) {
		var praxis = myvmware.praxis, cElement = praxis, pastOrCurrent = praxis.pastOrCurrent, dataToPass = {}, parentContainer = praxis.parentContainer, plotDivInViewString, currentIndex, allPlotsWrapperString, legendPlotWrapper, legendRow, consumptionRow, i, m, n;

		if(pastOrCurrent == 1){
			plotDivInViewString = '.allPlotsWrapper .plotWrapper_' + year + '.plotDivInView';
			allPlotsWrapperString = '.allPlotsWrapper';
		}
		else{
			plotDivInViewString = '.allPastPlotsWrapper .plotWrapper_' + year + '.plotDivInView';
			allPlotsWrapperString = '.allPastPlotsWrapper';
		}
		currentIndex = $(plotDivInViewString, parentContainer).find('.plotDiv').attr('id');
	    currentIndex = parseInt(currentIndex.split('_')[2]);
	    legendPlotWrapper = "#plotWrapper_" + year + "_" + currentIndex;

		$('.consumptionDataDetails', legendPlotWrapper).width($('canvas.jqplot-overlayCanvas-canvas', legendPlotWrapper).width());
		if($('.y1axisLegend', legendPlotWrapper).length > 0){
			$('.y1axisLegend', legendPlotWrapper).width($('canvas.jqplot-overlayCanvas-canvas', legendPlotWrapper).offset().left-$(allPlotsWrapperString).offset().left + 'px');
		}

		if($('.y2axisLegend', legendPlotWrapper).length > 0){
			$('.y2axisLegend', legendPlotWrapper).width(($(allPlotsWrapperString).offset().left + $(allPlotsWrapperString).width()) - ($('canvas.jqplot-overlayCanvas-canvas', legendPlotWrapper).offset().left + $('canvas.jqplot-overlayCanvas-canvas', legendPlotWrapper).width()) + 'px');
		}

		if((pastOrCurrent == 0) && (praxis.allPastPlotsData[year][praxis.yearServices[year][currentIndex]].eleType == 0)){
			//if($('.billinStmtLabel', '.allPastPlotsWrapper').length > 0){
			if($('.consumptionCostData', legendPlotWrapper).length > 0){

				$('.lblCont', legendPlotWrapper).width($('canvas.jqplot-overlayCanvas-canvas', legendPlotWrapper).offset().left-$('.consumptionCostData', legendPlotWrapper).offset().left + 'px');
				
				$('.billinStmtLabel', '.allPastPlotsWrapper').width($('canvas.jqplot-overlayCanvas-canvas', $(plotDivInViewString, parentContainer)).offset().left-$('.allPastPlotsWrapper').offset().left + 'px');	

				consumptionRow = $(legendPlotWrapper+' .usageCont table tr');
				legendRow = $(legendPlotWrapper+' .lblCont p');

				for(i = 0; i < legendRow.length; i++){
					m = consumptionRow.get(i);
					n = legendRow.get(i);
					$(m).find('td').css('padding-top', $(n).css('padding-top'));
					$(m).find('td').height($(n).height());
					$(m).find('td').css('padding-bottom', $(n).css('margin-bottom'));
				}
			}	
		} else if((pastOrCurrent == 0) && (praxis.allPastPlotsData[year][praxis.yearServices[year][currentIndex]].eleType == 1)){
			$('.consumptionCostData', legendPlotWrapper).width($('.odtPurchaseHist', legendPlotWrapper).width());
			$('.billinStmtLabel', '.allPastPlotsWrapper').width($('.odtEleCont .consumptionCostData .lblCont').offset().left + $('.odtEleCont .consumptionCostData .lblCont').width() - $('.billingStmtWrapper .billinStmtLabel').offset().left + 'px');
		}
	},

	yearChangeHandler: function (){
		var lastYear = praxis.currentSelectedYear, yearServices = praxis.yearServices, allPastPlotsData = praxis.allPastPlotsData, yearSelectedIndex = praxis.yearSelectedIndex, year = this.value, dataToPass = {}, parentContainer = praxis.parentContainer,url,allData={}, allPlotsWrapperString, plotDivInViewString, currentIndex;
		praxis.pause();
        praxis.currentSelectedYear = year;
        praxis.toBeReploted = 0;
        praxis.resizeForPast = true;
   		$('#pastNext,#pastPrevious').removeAttr('disabled').removeClass('disabled');
		if(allPastPlotsData[year] === undefined){										//will go for ajax call as first time
			$("#loadingSYm").show();
			$('.drpdwnCatCont, .newGraphSection,p.curUsageErrorMsg',"#praxisContainer").hide();
			url = rs.url.getPastUsageDetailsServiceDetailsPage;
			allData = praxis.loadData(url, year);
			if(allData == null){praxis.allPastPlotsData[praxis.currentSelectedYear] = null; return false;}
			praxis.allPastPlotsData[praxis.currentSelectedYear] = allData.plotData;
	    	praxis.yearServices[praxis.currentSelectedYear] = allData.services;
	    	praxis.bsDates[praxis.currentSelectedYear] = allData.billingDates;
			
			if($.isEmptyObject(allData.plotData)){	return false; }						//if failed in ajax call or wrong data
			$('.drpdwnCatCont, .optionsHolder, .newGraphSection',"#praxisContainer").show();
			myvmware.praxisObj.pastUsage(year, $('.allPastPlotsWrapper'));
			yearSelectedIndex[year] = 0;
    	}else if($.isEmptyObject(allPastPlotsData[year])){								//if second time... data wasn't present
			$('p.curUsageErrorMsg',"#praxisContainer").html('').html(rs.noPastUsage).show();
			$('.drpdwnCatCont, .optionsHolder, .newGraphSection',"#praxisContainer").hide();
			$('.parallex_' + year,"#praxisContainer").hide();
			return false;
		}

		var urlForPastUsage = rs.url.pastusagereport + "&_VM_selectedYear="+year;
		$('a.exportCus.pastExport',parentContainer).attr('href',urlForPastUsage);
		praxis.createServicesDropdown(year);
		praxis.updateDropdown(yearSelectedIndex[year], year);
		praxis.createBillingDropdown(year);
		$('.drpdwnCatCont, .optionsHolder, .newGraphSection',"#praxisContainer").show();
		$('.parallex_' + year,"#praxisContainer").show();	
		$('.parallex_' + lastYear,"#praxisContainer").hide();
		$('p.curUsageErrorMsg',"#praxisContainer").hide();		
		
		if(praxis.resizeForPast == true) {
            plotDivInViewString = '.allPastPlotsWrapper .plotWrapper_' + praxis.currentSelectedYear + '.plotDivInView';
            allPlotsWrapperString = '.allPastPlotsWrapper';

            currentIndex = $(plotDivInViewString, parentContainer).find('.plotDiv').attr('id');
            currentIndex = parseInt(currentIndex.split('_')[2]);
            
            praxis.drawCurrentPlot(currentIndex, praxis.currentSelectedYear);
        }
		
		praxis.alignElements(praxis.currentSelectedYear);
		if(typeof riaLinkmy !="undefined") riaLinkmy("praxis : subscription-service-detail : yearchange");
		praxis.resume();
    },

	createServicesDropdown: function (year){
    	$('#eaSelectorWidgetDiv1').find('div.eaInputWrapper').remove();
    	$('#eaDropDownOpts_variousCostsUsage').remove();
        $("select#variousCostsUsage").empty();
    	var yearServices = praxis.yearServices, parentContainer = praxis.parentContainer, allPastPlotsData = praxis.allPastPlotsData, dropDownContainer = $('#variousCostsUsage', parentContainer), allOptions = '', lastElement;
		dropDownContainer.html("");
		for(var i = 0; i < yearServices[year].length; i++){
			//allOptions += '<option value= "'+allPastPlotsData[year][yearServices[year][i]].displayName+'">'+allPastPlotsData[year][yearServices[year][i]].displayName+'</option>';
			if(allPastPlotsData[year][yearServices[year][i]].sku != null){
				allOptions += '<option value= "'+allPastPlotsData[year][yearServices[year][i]].sku+'">'+allPastPlotsData[year][yearServices[year][i]].displayName+'</option>';
			}
			else{
				allOptions += '<option value= "'+allPastPlotsData[year][yearServices[year][i]].displayName+'">'+allPastPlotsData[year][yearServices[year][i]].displayName+'</option>';
			}
		}
		dropDownContainer.append(allOptions);
		if($('#variousCostsUsage option').length==1){$('#pastPrevious,#pastNext').hide();}
		else{$('#pastPrevious,#pastNext').show();}
		$('#variousCostsUsage',parentContainer).show().live('change', praxis.serviceChangeHandler);

		vmf.dropdown.build($("select#variousCostsUsage"), {
            optionsDisplayNum: 10,
            ellipsisSelectText: false,
            ellipsisText: '',
            optionMaxLength: 70,
            inputMaxLength: 40,
            position: "right",
            onSelect: praxis.serviceChangeHandler,
            optionsId: "eaDropDownOpts_variousCostsUsage",
            inputWrapperClass: "eaInputWrapper",
            spanpadding: true,
            spanClass: "corner-img-left",
            optionsClass: "dropdownOpts",
            shadowClass: "eaBoxShadow"
         });
		lastElement = $('#eaDropDownOpts_variousCostsUsage').children().last();
     	if(lastElement.attr('name') == yearServices[year][yearServices[year].length-1]){lastElement.css('border-top', '1px dotted black');}
	},
	
	createBillingDropdown: function(year){
		if($('.billingStmtWrapper').length > 0){
    		$('.billingStmtWrapper').remove();
    	}
    	if($.isEmptyObject(praxis.bsDates[praxis.currentSelectedYear])){return false;}

		var billingStmtWrapper = $('<div class="billingStmtWrapper clearfix"><div class="billinStmtLabel"><a href="'+rs.url.getBillingDetailsUrl+'">' + rs.Billing_Statements + '</a></div></div>');
		var divElement = $('<div class="eaSelector billingDropDownCont"></div>'), billingDropdownWrapper = $('<select id="billingDropdown" name="mydropdown"></select>'), allOptions='';
		allOptions += '<option selected="true">' + rs.Download_Monthly_Statement + '</option>';
		
		for(key in praxis.bsDates[praxis.currentSelectedYear]){
			allOptions += '<option value= "'+praxis.bsDates[praxis.currentSelectedYear][key]+'">'+key+'</option>';
		}

		billingDropdownWrapper.append(allOptions);
		$(divElement).append(billingDropdownWrapper);
		billingStmtWrapper.append(divElement);
		//$('.newGraphSection').append(billingStmtWrapper);
		$('.allPastPlotsWrapper').append(billingStmtWrapper);

		$('#billingDropdown').bind('change', praxis.updateBillingDate);

		vmf.dropdown.build($("select#billingDropdown"), {
            optionsDisplayNum: 5,
            ellipsisSelectText: false,
            ellipsisText: '',	
            optionMaxLength: 70,
            inputMaxLength: 40,	
            position: "left",
            onSelect: praxis.monthDropdown,
            optionsId: "eaDropDownOpts_billingDropdown",
            inputWrapperClass: "eaInputWrapper",
            spanpadding: true,
            spanClass: "corner-img-left",
            optionsClass: "dropdownOpts",
            shadowClass: "eaBoxShadow"
        });
	},
	updateDropdown: function (dropdownIndex, year){
		//var parentContainer = praxis.parentContainer, currentIndexText = $('#variousCostsUsage option:eq('+dropdownIndex+')', parentContainer).text();
		var parentContainer = praxis.parentContainer, currentIndexText = $('#variousCostsUsage option:eq('+dropdownIndex+')', parentContainer).attr('value');
		vmf.dropdown.updateOption($("select#variousCostsUsage"), currentIndexText);
		praxis.yearSelectedIndex[year] = dropdownIndex;
	},

	serviceChangeHandler: function (){
		var parentContainer = praxis.parentContainer, currentSelectedYear = praxis.currentSelectedYear, clickedIndex = $('#variousCostsUsage', parentContainer)[0].selectedIndex, plotDivInViewString = '.allPastPlotsWrapper .plotWrapper_' + currentSelectedYear + '.plotDivInView',currentIndex;
		
		currentIndex = $(plotDivInViewString, parentContainer).find('.plotDiv').attr('id');
	    currentIndex = parseInt(currentIndex.split('_')[2]);
		if(clickedIndex !=currentIndex){
			pastOrCurrent = 0;
			praxis.gotoNthPlot(clickedIndex, currentIndex);
		}
		if(typeof riaLinkmy !="undefined") riaLinkmy("praxis : subscription-service-detail : pastusage : componentChange");
	},

	monthDropdown: function(){
		if(typeof riaLinkmy !="undefined") riaLinkmy("praxis : subscription-service-detail : pastusage : billing-statement-pdf");
		var URLValue = $('#billingDropdown').val();
		var urlCheckRegExp = new RegExp("^(http|https)://", "i");
		if (urlCheckRegExp.test(URLValue)){
			window.open(URLValue, '_blank');
		}else{
			var URLwithFile= rs.billingPDFForPastUsageUrl +"&_VM_fileName="+URLValue;
			window.open(URLwithFile, '_blank');
			//var _postData = {'_VM_fileName':URLValue};
			//vmf.ajax.post(rs. billingPDFForPastUsageUrl, _postData, function(data) {
			//},function(data){
			//},function(){/*vmf.loading.hide()*/},300000,function(){/*vmf.loading.show()*/});	
		}	
	},

	updateBillingDate: function(){
		vmf.dropdown.updateOption($('select#billingDropdown'), rs.Download_Monthly_Statement);
	},
	createYearDropdown: function (){
		var dropDownContainer = $('#pastYears'), parentContainer = praxis.parentContainer;
		dropDownContainer.html("");
		var allOptions = '';
		for(var i = 0; i < praxis.pastYears.length; i++)
			allOptions += '<option value= "'+praxis.pastYears[i]+'" data-optionnum= "'+i+'" class="testspan">'+praxis.pastYears[i]+'</option>';
		dropDownContainer.append(allOptions);
		$("#pastYears",parentContainer).live('change', praxis.yearChangeHandler);
	},
	gotoNextPlot: function(selectedId, currentId, targetId) {
		myvmware.praxis.pause();
		if(praxis.pastOrCurrent == 1) vmf.loading.blockElement($('.usageBlock'));
		var pastOrCurrent = praxis.pastOrCurrent, 
			currentSelectedYear = praxis.currentSelectedYear, 
			parentContainer = praxis.parentContainer, 
			plotWrapperString = '.plotWrapper_' + currentSelectedYear, 
			plotWrapper = $(plotWrapperString, parentContainer), 
			selectedIdString = '#plotWrapper_' + currentSelectedYear + '_' + selectedId, 
			currentIdString = '#plotWrapper_' + currentSelectedYear + '_' + currentId, 
			plotDivInViewString = '.plotWrapper_' + currentSelectedYear + '.plotDivInView',
			plotDivInView = $(plotDivInViewString, parentContainer), cElement = this, allPlotsWrapperString, allPlotsWrapper, 
			first, last, year, allPrevPlots,leftPosNeg = '-1300px', leftPosPos = '1300px';
	    
		if(pastOrCurrent == 1){		//for current plots
	    	praxis.updateHeader(selectedId);
	    	//leftPosPos = '1200px';
	    	leftPosPos = $('.allPlotsWrapper').width() + 'px';
			//leftPosNeg = '-1200px';	    	
			leftPosNeg = '-' + $('.allPlotsWrapper').width() + 'px';
    	}
    	
    	if (plotDivInView.next(plotWrapper).length == 0) {
	    	allPrevPlots = plotDivInView.prevAll(plotWrapperString);
	    	for(var  i = allPrevPlots.length-1; i >= 0; i--){
            	first = $(plotWrapperString, parentContainer).first(),
                last = $(plotWrapperString, parentContainer).last();
                first.insertAfter(last);
                $(allPrevPlots[i]).css('left', leftPosPos);
	    	}
	       	first = $(plotWrapperString, parentContainer).first();
            last = $(plotWrapperString, parentContainer).last();
	        first.insertAfter(last).removeClass('plotDivInView').animate({'left':leftPosNeg},1000,function(){});
	        $(selectedIdString, parentContainer).addClass('plotDivInView').animate({left: '0'}, 1000, function () {
				first.css('left', leftPosPos);
				$('#'+targetId).removeAttr("disabled").removeClass('disabled');
				
				praxis.alignElements(currentSelectedYear);
				praxis.resume();
	        });
	    } else {
	        $(currentIdString, parentContainer).removeClass('plotDivInView').animate({'left': leftPosNeg}, 1000);
	        $(selectedIdString, parentContainer).addClass('plotDivInView').animate({'left': '0'}, 1000, function () {
	            $(this).nextAll(plotWrapperString).css('left', leftPosPos);
	            $(this).prevAll(plotWrapperString).css('left', leftPosNeg);
				$('#'+targetId).removeAttr("disabled").removeClass('disabled');
				
				praxis.alignElements(currentSelectedYear);
				praxis.resume();
	        });   	
	    }

	    if(pastOrCurrent == 1){
	    	year = "current";
			praxis.drawCurrentPlot(selectedId, year);
			praxis.currentSelectedYear = year;
    	} else{
			praxis.drawCurrentPlot(selectedId, praxis.currentSelectedYear);
			praxis.yearSelectedIndex[praxis.currentSelectedYear] = selectedId;
	    }
	    if(praxis.pastOrCurrent == 1)  setTimeout(function(){ vmf.loading.unblockElement($('.usageBlock')); }, 1250);
		myvmware.praxis.resume();
	},

	gotoPreviousPlot: function(selectedId, currentId, targetId) {
		myvmware.praxis.pause();
		if(praxis.pastOrCurrent == 1)  vmf.loading.blockElement($('.usageBlock'));
	   
		var pastOrCurrent = praxis.pastOrCurrent, 
			currentSelectedYear = praxis.currentSelectedYear, 
			parentContainer = praxis.parentContainer, 
			plotWrapperString = '.plotWrapper_' + currentSelectedYear, 
			plotWrapper = $(plotWrapperString, parentContainer), 
			selectedIdString = '#plotWrapper_' + currentSelectedYear + '_' + selectedId, 
			currentIdString = '#plotWrapper_' + currentSelectedYear + '_' + currentId, 
			plotDivInViewString = '.plotWrapper_' + currentSelectedYear + '.plotDivInView',
			plotDivInView = $(plotDivInViewString, parentContainer), cElement = this, allPlotsWrapperString, allPlotsWrapper, 
			first, last, year, allPrevPlots, leftPosNeg = '-1300px', leftPosPos = '1300px', leftval = 1300; 
		
		if(pastOrCurrent == 1){		//for current plots
			praxis.updateHeader(selectedId);
			//leftPosPos = '1200px';
	    	leftPosPos = $('.allPlotsWrapper').width() + 'px';
			//leftPosNeg = '-1200px';	    	
			leftPosNeg = '-' + $('.allPlotsWrapper').width() + 'px';	   
			leftval = $('.allPlotsWrapper').width(); 	
		}     
	    if (plotDivInView.prevAll(plotWrapperString).length == 0) {
			first = $(plotWrapperString, parentContainer).first(),
            last = $(plotWrapperString, parentContainer).last();
	        last.insertBefore(first).css('left', leftPosNeg);
	        $(currentIdString, parentContainer).removeClass('plotDivInView');	
	        $(selectedIdString, parentContainer).addClass('plotDivInView').animate({'left': '0'}, 1000, function () {
				$('#'+targetId).removeAttr("disabled").removeClass('disabled');
				
				praxis.alignElements(currentSelectedYear);
				praxis.resume();
			});
	        $(plotWrapperString).eq(1).animate({left: '+='+leftval}, 1000, function () {});
	    } else {
	        $(currentIdString, parentContainer).removeClass('plotDivInView').animate({'left': leftPosPos}, 1000, function () {});
	        $(selectedIdString, parentContainer).addClass('plotDivInView').animate({'left': '0'}, 1000, function () {
        		$(this).prevAll(plotWrapperString).css('left', leftPosNeg);
            	$(this).nextAll(plotWrapperString).css('left', leftPosPos);
				$('#'+targetId).removeAttr("disabled").removeClass('disabled');

				praxis.alignElements(currentSelectedYear);
				praxis.resume();
	        });
	    }
	    if(pastOrCurrent == 1){
	    	year = "current";
    		praxis.drawCurrentPlot(selectedId, year);
	    	praxis.currentSelectedYear = year;
    	} else{
			praxis.drawCurrentPlot(selectedId, praxis.currentSelectedYear);
			praxis.yearSelectedIndex[praxis.currentSelectedYear] = selectedId;
	    }
	    if(praxis.pastOrCurrent == 1) setTimeout(function(){vmf.loading.unblockElement($('.usageBlock'));}, 1250);
		myvmware.praxis.resume();
	},

	gotoNthPlot: function (selectedIndex, currentIndex) {
		if (selectedIndex > currentIndex) {
	        praxis.gotoNextPlot(selectedIndex, currentIndex);
	    } else {
	        praxis.gotoPreviousPlot(selectedIndex, currentIndex);
	    }
	},

	graphPlotOptionsSetup: function(){
		var xaxis = {
			renderer:$.jqplot.DateAxisRenderer,					//To render the date data
			rendererOptions: {
				baselineWidth: 1.5,
				baselineColor: '#b4b4b4',
				drawBaseline: true
			},
			tickRenderer:$.jqplot.CanvasAxisTickRenderer,
			tickOptions:{ 
				labelPosition: 'middle', 
				showGridline: false,
				showLabel: true,								//To hide the x-axis tick labels
				markSize: 5,
				formatString:'%m/%d',
				//fontFamily:'Helvetica',
				fontSize: '14px'
			},
			labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
			labelOptions:{
				fontFamily:'Helvetica',
				fontSize: '14px',
				show: false
			},
			label:rs.Day,
			tickInterval:'3 days'
	    };
	      
	    var yaxis = {
			tickOptions:{
				labelPosition: 'middle', 
				showGridline: true,
				formatString: "%'.3f",
				fontSize: '14px'
				//fontFamily:'Helvetica',
			},
			tickRenderer: $.jqplot.CanvasAxisTickRenderer,				
			labelRenderer: $.jqplot.CanvasAxisLabelRenderer,			//If used the labels are rotated
			labelOptions:{
				//fontFamily:'Helvetica',
				fontSize: '14px',
				show: false
			},
			label:rs.Default_Yaxis_Label,
			min: 0
	    };

	    var y2axis= {
	    	//important in case of y2axis to align the grid lines of both y-axes properly...
		    rendererOptions: {
		        // align the ticks on the y2 axis with the y axis.
		        alignTicks: true,
		        drawBaseline: false
		    },
		    tickRenderer:$.jqplot.CanvasAxisTickRenderer,
		    tickOptions: {
		    	labelPosition: 'middle', 
				showGridline: true,
				formatString: "%'.2f",
				fontSize: '14px'
				//fontFamily:'Helvetica',
		    },

			labelRenderer: $.jqplot.CanvasAxisLabelRenderer,			//To rotate the yaxis label
			labelOptions:{
				//fontFamily:'Helvetica',
				fontSize: '14px',
				show: false
			},
			label:rs.Default_Y2axis_Label,
			drawMajorTickMarks: false,
			min: 0
	    };

	    var series = [
			{yaxis: 'yaxis'},         
	      	{
	      		yaxis: 'y2axis',
	            linePattern: 'dotted'		
	      	}
	    ];
	    var axesDefaults= {};
	    var axes = {xaxis: xaxis, yaxis: yaxis, y2axis: y2axis};
	    var legend = {show: false};
	    var grid = {
	    	background: '#ffffff',
	    	shadow:false,
	        drawBorder:false,
	        drawGridlines:true 
	    };

	    var cursor = {
	    	style: 'default',
	        show: true,
	        zoom: false,
	        followMouse: true,
	        showTooltip: false,
	        showVerticalLine: true
	    };

	    var highlighter= {
	        show: true,
	        tooltipOffset: 10,
	        useAxesFormatters:false,
	        tooltipAxes: 'yx',
	        tooltipLocation : 'e',
	        tooltipContentEditor: function(str, neighbor, plot, series) {
	        	var hl = plot.plugins.highlighter,
		        	elem = hl._tooltipElem,
		        	serieshl = series.highlighter || {},
		        	opts = $.extend(true, {}, hl, serieshl),
		        	xfstr = '%Y-%m-%d',
		        	yfstr = '%.2f',
	        		xf = series._xaxis._ticks[0].formatter,
	        		yf = series._yaxis._ticks[0].formatter;

	        	var xstr = xf(xfstr, neighbor.data[0][0]);											//changed

	        	var plotDivInViewString = '.plotWrapper_' + praxis.currentSelectedYear + '.plotDivInView', parentContainer = praxis.parentContainer, currentIndex = $(plotDivInViewString,parentContainer).find('.plotDiv').attr('id');
	        		
				
				currentIndex = parseInt(currentIndex.split('_')[2]);

				var usageTooltipString = '<span class="tooltipContent"><span class="usageTooltip"><strong>%.3f ' + praxis.currentHeaderData[praxis.currentCategoryArray[currentIndex]][1] + '</strong></span>, %s</span>',
					costTooltipString = '<span class="tooltipContent"><span class="costTooltip"><strong>' + rs.sidCurrency + '%.2f</strong></span>, %s</span>',
	        		tooltipDoubleDisplayText = '<span class="tooltipContent"><span class="usageTooltip"><strong>%.3f ' + praxis.currentHeaderData[praxis.currentCategoryArray[currentIndex]][1] + '</strong></span>/<span class="costTooltip"><strong>' + rs.sidCurrency + '%.2f</strong></span>, %s</span>';

	        	var numberOfSeries = praxis.seriesExist[praxis.currentSelectedYear][praxis.currentCategoryArray[currentIndex]];
	        	if(neighbor.data.length > 1){
	        		var ystrs = [];
	        		for(var m = 0; m < neighbor.data.length; m++){
	        			for (var i=1; i<opts.yvalues+1; i++) {
			                //ystrs.push(neighbor.data[m][i]);									//changed
			                ystrs.push(neighbor.data[$.inArray(m,neighbor.seriesIndex)][i]);
			            }
	        		}
	        		opts.formatString = tooltipDoubleDisplayText;
	            	ystrs.push(xstr);
	            	var tooltipStr = $.jqplot.sprintf.apply($.jqplot.sprintf, [opts.formatString, ystrs[0], ystrs[1], ystrs[2]]);
	        	}else{
		        	var ystrs = [];
		        	for (var i=1; i<opts.yvalues+1; i++) {
		                ystrs.push(neighbor.data[0][i]);										//changed
		            }
	            	ystrs.push(xstr);
					if(numberOfSeries == 2){

	            		if(neighbor.seriesIndex == 0){
	            			opts.formatString = usageTooltipString;

	            		}else{
	            			opts.formatString = costTooltipString;
	            		}
	            	}else if(numberOfSeries == 1){

	            		opts.formatString = usageTooltipString;
	            	}else if(numberOfSeries == 0){

	            		opts.formatString = costTooltipString;
	            	}
	            	var tooltipStr = $.jqplot.sprintf.apply($.jqplot.sprintf, [opts.formatString, ystrs[0], ystrs[1]]);
	        	}
	            return tooltipStr;
	        }
	    };
	    var plotOptions = {
			legend: legend,
			axesDefaults: axesDefaults,
			axes: axes,
			grid: grid,
			cursor: cursor,
			seriesDefaults: {
				showMarker:true,
		      	pointLabels:{ show:false},
		      	breakOnNull: true
		    },
			series:series,
			highlighter: highlighter,
			seriesColors: [ "#FDB813", "#D9541E"],
			//resetAxes: true,
			resetAxes:{
				yaxis:true, 
				y2axis:true,
				xaxis: true
			}		
	    };

	    var xaxisForPast = {
			renderer: $.jqplot.CategoryAxisRenderer,				//To render the axis having text values
			rendererOptions: {
				baselineWidth: 1.5,
				baselineColor: '#b4b4b4',
				drawBaseline: true
			},
			tickRenderer:$.jqplot.CanvasAxisTickRenderer,
			tickOptions:{ 
				labelPosition: 'middle', 
				showGridline: false,
				showLabel: true,									//To hide the x-axis tick labels
				markSize: 5,
				formatString: "%s",
				//fontFamily:'Helvetica',
				fontSize: '14px'
			},
			labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
			labelOptions:{
				//fontFamily:'Helvetica',
				fontSize: '14px',
				show:false
			},
			label:rs.Month
	    }

	    var yaxisForPast = {
			tickOptions:{
				labelPosition: 'middle',
				showGridline: true,
				formatString: "%'.3f",
				fontSize: '14px'
				//fontFamily:'Helvetica',
			},
			tickRenderer: $.jqplot.CanvasAxisTickRenderer,				
			labelRenderer: $.jqplot.CanvasAxisLabelRenderer,			//If used the labels are rotated
			labelOptions:{
				//fontFamily:'Helvetica',
				fontSize: '14px',
				show: false
			},
			label:rs.Default_Yaxis_Label,
			min: 0
	    }

	    var y2axisForPast= {
	    	//important in case of y2axis to align the grid lines of both y-axes properly...
		    rendererOptions: {
		        // align the ticks on the y2 axis with the y axis.
		        alignTicks: true,
		        drawBaseline: false
		    },
		    tickRenderer:$.jqplot.CanvasAxisTickRenderer,
		    tickOptions: {
		    	labelPosition: 'middle', 
				showGridline: true,
				formatString: "%'.2f",
				fontSize: '14px'
				//fontFamily:'Helvetica',
		    },

			labelRenderer: $.jqplot.CanvasAxisLabelRenderer,			//To rotate the yaxis label
			labelOptions:{
				//fontFamily:'Helvetica',
				fontSize: '14px',
				show: false
			},
			label:rs.Default_Y2axis_Label,
			drawMajorTickMarks: false,
			min: 0
	    };

	    var axesForPast = {xaxis: xaxisForPast, yaxis: yaxisForPast, y2axis: y2axisForPast};
	    var legendForPast = {show: true};
	    var gridForPast = {
	    	background: '#ffffff',
	    	shadow:false,
	        drawBorder:false,
	        drawGridlines:true 
	    };
	    var cursorForPast = { 
	    	style: 'default',
	        show: true,
	        zoom: false,
	        followMouse: true,
	        showTooltip: false,
	        showVerticalLine: true
	    };

		var seriesForPast = [
			{yaxis: 'yaxis'},         
	      	{
	      		yaxis: 'y2axis',
	            linePattern: 'dotted'
	      	}
	    ];
	    var highlighterForPast= {
	        show: true,
	        tooltipOffset: 10,
	        useAxesFormatters:false,
	        tooltipAxes: 'yx',
	        tooltipLocation : 'e',
	        tooltipContentEditor: function(str, neighbor, plot, series) {
	        	var hl = plot.plugins.highlighter,
			        elem = hl._tooltipElem,
			        serieshl = series.highlighter || {},
			        opts = $.extend(true, {}, hl, serieshl),
			        xfstr = '%s',
			        yfstr = '%.2f',
		        	xf = series._xaxis._ticks[0].formatter,
		        	yf = series._yaxis._ticks[0].formatter,
		        	xstr = xf(xfstr, plot.data[0][neighbor.pointIndex[0]][0]);					//changed
				var plotDivInViewString = '.plotWrapper_' + praxis.currentSelectedYear + '.plotDivInView', parentContainer = praxis.parentContainer, currentIndex = $(plotDivInViewString,parentContainer).find('.plotDiv').attr('id');
	        		
				currentIndex = parseInt(currentIndex.split('_')[2]);

				var localDataToPlot = praxis.allPastPlotsData[praxis.currentSelectedYear][praxis.yearServices[praxis.currentSelectedYear][currentIndex]];
				var usageTooltipString = '<span class="tooltipContent"><span class="usageTooltip"><strong>%.3f ' + localDataToPlot.usageUOM + '</strong></span>, %s</span>',
					costTooltipString = '<span class="tooltipContent"><span class="costTooltip"><strong>' + rs.sidCurrency + '%.2f</strong></span>, %s</span>',
	        		tooltipDoubleDisplayText = '<span class="tooltipContent"><span class="usageTooltip"><strong>%.3f ' + localDataToPlot.usageUOM + '</strong></span>/<span class="costTooltip"><strong>' + rs.sidCurrency + '%.2f</strong></span>, %s</span>';	

	        	var numberOfSeries = praxis.seriesExist[praxis.currentSelectedYear][praxis.yearServices[praxis.currentSelectedYear][currentIndex]];	
	        	if(neighbor.data.length > 1){
	        		var ystrs = [];
	        		for(var m = 0; m < neighbor.data.length; m++){
	        			for (var i=1; i<opts.yvalues+1; i++) {
			                //ystrs.push(neighbor.data[m][i]);									//changed
							ystrs.push(neighbor.data[$.inArray(m,neighbor.seriesIndex)][i]);	
			            }
	        		}
	        		//opts.formatString = '<span class="usageTooltip"><b>%.2f GHz</b></span>/<span class="costTooltip">$ %.2f</b></span>, %s';
					opts.formatString = tooltipDoubleDisplayText;	
	            	ystrs.push(xstr);
	            	var tooltipStr = $.jqplot.sprintf.apply($.jqplot.sprintf, [opts.formatString, ystrs[0], ystrs[1], ystrs[2]]);
	        	}else{
		        	var ystrs = [];
		        	for (var i=1; i<opts.yvalues+1; i++) {
		                ystrs.push(neighbor.data[0][i]);										//changed
		            }
	            	ystrs.push(xstr);
					if(numberOfSeries == 2){

	            		if(neighbor.seriesIndex == 0){
	            			opts.formatString = usageTooltipString;
	            		}else{
	            			opts.formatString = costTooltipString;
	            		}
	            	}else if(numberOfSeries == 1){

	            		opts.formatString = usageTooltipString;
	            	}else if(numberOfSeries == 0){

	            		opts.formatString = costTooltipString;
	            	}
	            	var tooltipStr = $.jqplot.sprintf.apply($.jqplot.sprintf, [opts.formatString, ystrs[0], ystrs[1]]);
	        	}
	            return tooltipStr;
	        }
	    };
	    var pastPlotOptions = {
			axes: axesForPast,
			grid: gridForPast,
			cursor: cursorForPast,
			series:seriesForPast,
			seriesDefaults: {
				showMarker:true,
			  	pointLabels:{show:false},
			  	breakOnNull: true
			},
			highlighter: highlighterForPast,
			seriesColors: ["#FDB813", "#D9541E"],
			//resetAxes: true,
			resetAxes:{
				yaxis:true, 
				y2axis:true,
				xaxis: true
			}
	    };
	    praxis.plotOptions = plotOptions;
	    praxis.pastPlotOptions = pastPlotOptions;
	},

	graphInitialOptionSetup: function(year){
		var plots = praxis.plots, pastOrCurrent = praxis.pastOrCurrent, pastPlots = praxis.pastPlots, currentCategoryArray = praxis.currentCategoryArray, yearServices = praxis.yearServices;

		if(pastOrCurrent == 1){
			for(var i = 0; i < currentCategoryArray.length; i++){
			    plots[currentCategoryArray[i]] = {};
			    plots[currentCategoryArray[i]].plot = {};
			    plots[currentCategoryArray[i]].data = [];
			    plots[currentCategoryArray[i]].isDrawn = 0;
			}
		}else{
			for(var i = 0; i < yearServices[year].length; i++){
				if(pastPlots[yearServices[year][i]] == undefined)
			    	pastPlots[yearServices[year][i]] = {};
			    pastPlots[yearServices[year][i]][year] = {};
			    pastPlots[yearServices[year][i]][year].plot = {};
			    pastPlots[yearServices[year][i]][year].data = [];

			    pastPlots[yearServices[year][i]][year].isDrawn = 0;
			}
		}
		praxis.seriesExist[year] = {};
    },

	drawCurrentPlot: function(categoryNumber, year){
		var localDataToPlot = {},
			optionsToPlot = {},
			cElement = this, pastOrCurrent = praxis.pastOrCurrent, currentHeaderData = praxis.currentHeaderData, currentSelectedYear = praxis.currentSelectedYear, plots = praxis.plots, currentCategoryArray = praxis.currentCategoryArray, pastPlots = praxis.pastPlots, yearServices = praxis.yearServices, allPastPlotsData = praxis.allPastPlotsData, chartTargetId = "chart_" + year + "_" + categoryNumber, dataToPlot, parentContainer = praxis.parentContainer;
		var legendPlotWrapper = "#plotWrapper_" + year + "_" + categoryNumber, legendBoxSpans = '', ghzstring = $('li.selectedRHead p.greyText','.ribbonHead').text(), dollarString = rs.usDollarText, legendBoxSpan1, legendBoxSpan2, legendSpanEND = ' </span>', titleLegends = '', chartTitle = '', yearlyOrMonthly, titleLegendContainer='', secondLegendStyleChange = false;
		var leftLegendPad = '56px', rightLegendPad = '50px'; 

		if(praxis.pastOrCurrent == 1){
			leftLegendPad = '17px'; 
			rightLegendPad = '26px';
		}
		legendBoxSpan1 = '<span class="y1axisLegend" style="float: left; text-align:right;">';
		legendBoxSpan2 = '<span class="y2axisLegend" style="float: right; text-align:left;">';
		titleLegendContainerStart = '<div class="legendBox clearfix">';
		firstTitleLegend = '<div class="firstLegend"><span class="firstLegendStyle"></span><span>'+rs.graphConsumption+'</span></div>';
		secondTitleLegend = '<div class="secondLegend"><span class="secondLegendStyle"></span><span>'+rs.graphCost+'</span></div>';
		titleLegendContainerEnd = '</div>';
		if(pastOrCurrent == 1) {
			yearlyOrMonthly = "Monthly";
			localDataToPlot = praxis.allplotsData[currentCategoryArray[categoryNumber]];	
			if(localDataToPlot.eleType == 1){

				if(plots[currentCategoryArray[categoryNumber]].isDrawn == 0) {
					
					chartTitle = '<div class="chartTitle"><span class="dailyText">'+rs.graphDaily+'</span><span class="titleCategory"> ' + localDataToPlot.displayName + '</span><span class="consumptionCostText">' + rs.details + '</span></div>';
					//titleLegends = titleLegends + chartTitle;
					//$('.titleLegends', legendPlotWrapper).append(chartTitle);

					var odtPurchaseHist = "<div class = 'odtPurchaseHist'><div class='odtPurchaseHistDetails'>";
					for(var ele = 0; ele < localDataToPlot.purchaseHist.length; ele++) {
						odtPurchaseHist = odtPurchaseHist + "<p>" + rs.Purchased_by + "<span class='odtCustName'>" + localDataToPlot.purchaseHist[ele][0] + "</span>" + rs.on + ' ' + localDataToPlot.purchaseHist[ele][1] + ". " + rs.Quantity + ": <span class='odtQty'>" + localDataToPlot.purchaseHist[ele][2] + "</span></p>";  
					}
					odtPurchaseHist = odtPurchaseHist + "</div></div>"; 
					$("#"+chartTargetId).html(odtPurchaseHist).addClass("odtElement").append('<p class="nextBillingStmtText">' + rs.This_charge_will_appear_on_your_next_Billing_Statement + '</p>');

					plots[currentCategoryArray[categoryNumber]].isDrawn = 1;
				}

			//} else if ((plots[currentCategoryArray[categoryNumber]].plot._drawCount === undefined || plots[currentCategoryArray[categoryNumber]].plot._drawCount === 0) && (localDataToPlot.eleType == 0)) {
			} else if ((plots[currentCategoryArray[categoryNumber]].isDrawn == 0) && (localDataToPlot.eleType == 0)) {
					chartTitle = '<div class="chartTitle"><span class="dailyText">'+rs.graphDaily+'</span><span class="titleCategory"> ' + localDataToPlot.displayName + '</span><span class="consumptionCostText"> '+rs.graphCostNConsumption+'</span></div>';

					optionsToPlot = $.extend(true, {}, praxis.plotOptions);
					if(localDataToPlot.usage.length > 0 && localDataToPlot.cost.length > 0){

						dataToPlot = [localDataToPlot.usage, localDataToPlot.cost];
						legendBoxSpans = legendBoxSpan1 + currentHeaderData[currentCategoryArray[categoryNumber]][4] + legendSpanEND + legendBoxSpan2 + dollarString + legendSpanEND;
						firstTitleLegend = '<div class="firstLegend doubleLegendProperty"><span class="firstLegendStyle"></span><span>'+rs.graphConsumption+'</span></div>';
						titleLegendContainer = titleLegendContainerStart + firstTitleLegend + secondTitleLegend + titleLegendContainerEnd;
						praxis.seriesExist[year][currentCategoryArray[categoryNumber]] = 2;
						
					} else if(localDataToPlot.cost.length > 0){

						dataToPlot = [localDataToPlot.cost];
						legendBoxSpans = legendBoxSpan1 + dollarString + legendSpanEND;
						titleLegendContainer = titleLegendContainerStart + secondTitleLegend + titleLegendContainerEnd;
						secondLegendStyleChange = true;
						optionsToPlot.series[0].linePattern = 'dotted';
						optionsToPlot.seriesColors = ["#D9541E"];
						praxis.seriesExist[year][currentCategoryArray[categoryNumber]] = 0;
						
					} else if(localDataToPlot.usage.length > 0){

						dataToPlot = [localDataToPlot.usage];
						legendBoxSpans = legendBoxSpan1 + currentHeaderData[currentCategoryArray[categoryNumber]][4] + legendSpanEND;
						titleLegendContainer = titleLegendContainerStart + firstTitleLegend + titleLegendContainerEnd;
						praxis.seriesExist[year][currentCategoryArray[categoryNumber]] = 1;
					
					} else {
						chartTitle = '';
						titleLegendContainer = '';
						dataToPlot = "Empty String";
					}
					titleLegends = titleLegends + chartTitle + titleLegendContainer;
					$('.titleLegends', legendPlotWrapper).append(titleLegends);
					$('.legendBox2', legendPlotWrapper).append(legendBoxSpans);
					optionsToPlot.axes.xaxis.min= praxis.minDate;
					optionsToPlot.axes.xaxis.max= praxis.maxDate;
					plots[currentCategoryArray[categoryNumber]].plot =  vmf.jqplot.drawPlot(chartTargetId, dataToPlot, optionsToPlot);
					plots[currentCategoryArray[categoryNumber]].isDrawn = 1;

			} else if ((plots[currentCategoryArray[categoryNumber]].isDrawn == 1) && (localDataToPlot.eleType == 0) && (praxis.resizeForCurr == true)){		//redraw only plots
		    	var options = {
					resetAxes: true,
					axes:{
						xaxis:{
							min: praxis.minDate,
							max: praxis.maxDate,
							tickInterval: '3 days'
						},
						y2axis:{min: 0},
						yaxis:{min: 0}
					}
				};
		    	vmf.jqplot.redrawPlot(praxis.plots[praxis.currentCategoryArray[categoryNumber]].plot, options);
		    	//praxis.toBeReploted++;
				//if(praxis.toBeReploted >= currentCategoryArray.length){praxis.resizeForCurr = false;}
			}
		}	
		else {									//in past section
			currentCategoryArray = yearServices[year]; 
			localDataToPlot = allPastPlotsData[year][yearServices[year][categoryNumber]];
			yearlyOrMonthly = "Yearly";
			if(localDataToPlot.displayName == "Total Cost"){
				chartTitle = '<div class="chartTitle"><span class="yearMonthlyText">'+praxis.currentSelectedYear+ ' ' +rs.graphMonthly+'</span><span class="titleCategory"> ' + localDataToPlot.displayName + '</span></div>';
				secondTitleLegend = '<div class="secondLegend"><span class="secondLegendStyle"></span><span>' + rs.Total_Cost + '</span></div>';
			}else{
				var odtCostStr = (localDataToPlot.eleType == 0) ? rs.graphCostNConsumption : rs.graphCost;
				chartTitle = '<div class="chartTitle"><span class="yearMonthlyText">'+praxis.currentSelectedYear+ ' ' +rs.graphMonthly+'</span><span class="titleCategory"> ' + localDataToPlot.displayName + '</span><span class="consumptionCostText"> '+odtCostStr+'</span></div>';
			}


			if(localDataToPlot.eleType == 1){

				if(pastPlots[yearServices[year][categoryNumber]][year].isDrawn == 0){

					//chartTitle = '<div class="chartTitle"><span class="dailyText">'+rs.graphDaily+'</span><span class="titleCategory"> ' + localDataToPlot.displayName + '</span><span class="consumptionCostText"> details </span></div>';
					//titleLegends = titleLegends + chartTitle;
					$('.titleLegends', legendPlotWrapper).append(chartTitle);
					var odtPurchaseHist = "<div class = 'odtPurchaseHist'><div class='odtPurchaseHistDetails'>";
					for(var ele = 0; ele < localDataToPlot.purchaseHist.length; ele++) {
						odtPurchaseHist = odtPurchaseHist + "<p>" + rs.Purchased_by + "<span class='odtCustName'>" + localDataToPlot.purchaseHist[ele][0] + "</span>" + rs.on + " " + localDataToPlot.purchaseHist[ele][1] + ". " + rs.Quantity + ": <span class='odtQty'>" + localDataToPlot.purchaseHist[ele][2] + "</span></p>";  
					}
					odtPurchaseHist = odtPurchaseHist + "</div></div>"; 
					if(localDataToPlot.purchaseHist.length > 10){
						$('.odtPurchaseHist').css('height', '500px');
					}
					$("#"+chartTargetId).html(odtPurchaseHist).addClass("odtElement").parent().addClass('odtEleCont');
					pastPlots[yearServices[year][categoryNumber]][year].isDrawn = 1;
					praxis.createConsumptionCostData(localDataToPlot, legendPlotWrapper);
					$('.consumptionCostData', legendPlotWrapper).width($('.odtPurchaseHist', legendPlotWrapper).width());
				}

			} else if ((pastPlots[yearServices[year][categoryNumber]][year].isDrawn == 0) && (localDataToPlot.eleType == 0)){
				optionsToPlot = $.extend(true, {}, praxis.pastPlotOptions);
				var monthNullArray = null;
				monthNullArray = [["Jan", null], ["Feb", null], ["Mar", null], ["Apr", null], ["May", null], ["Jun", null], ["Jul", null], ["Aug", null], ["Sep", null], ["Oct", null], ["Nov", null], ["Dec", null]];
		
				var i, k = 0;
				var costNullArray = $.extend(true, [], monthNullArray), usageNullArray = $.extend(true, [], monthNullArray);
				if(localDataToPlot.usage.length > 0 && localDataToPlot.cost.length > 0){
					for(i = 0; i < usageNullArray.length && k < localDataToPlot.usage.length; i++) {
						if(usageNullArray[i][0] === localDataToPlot.usage[k][0]) {
							usageNullArray[i][1] = localDataToPlot.usage[k][1];
							k++;
						}
					}
					k = 0;
					for(i = 0; i < costNullArray.length && k < localDataToPlot.cost.length; i++) {
						if(costNullArray[i][0] === localDataToPlot.cost[k][0]) {
							costNullArray[i][1] = localDataToPlot.cost[k][1];
							k++;
						}
					}
					localDataToPlot.usage = usageNullArray;
					localDataToPlot.cost = costNullArray;
					dataToPlot = [localDataToPlot.usage, localDataToPlot.cost];
					ghzstring = localDataToPlot.usageLegend;
					legendBoxSpans = legendBoxSpan1 + ghzstring + legendSpanEND + legendBoxSpan2 + dollarString + legendSpanEND;
					firstTitleLegend = '<div class="firstLegend doubleLegendProperty"><span class="firstLegendStyle"></span><span>'+rs.graphConsumption+'</span></div>';
					titleLegendContainer = titleLegendContainerStart + firstTitleLegend + secondTitleLegend + titleLegendContainerEnd;
					praxis.seriesExist[year][yearServices[year][categoryNumber]] = 2;
				} else if(localDataToPlot.cost.length > 0){
					for(i = 0; i < costNullArray.length && k < localDataToPlot.cost.length; i++) {
						if(costNullArray[i][0] === localDataToPlot.cost[k][0]) {
							costNullArray[i][1] = localDataToPlot.cost[k][1];
							k++;
						}
					}
					localDataToPlot.cost = costNullArray;
					dataToPlot = [localDataToPlot.cost];
					legendBoxSpans = legendBoxSpan1 + dollarString + legendSpanEND;
					titleLegendContainer = titleLegendContainerStart + secondTitleLegend + titleLegendContainerEnd;
					secondLegendStyleChange = true;
					praxis.seriesExist[year][yearServices[year][categoryNumber]] = 0;
					optionsToPlot.series[0].linePattern = 'dotted';
					optionsToPlot.seriesColors = ["#D9541E"];
				} else if(localDataToPlot.usage.length > 0) {
					for(i = 0; i < usageNullArray.length && k < localDataToPlot.usage.length; i++) {
						if(usageNullArray[i][0] === localDataToPlot.usage[k][0]) {
							usageNullArray[i][1] = localDataToPlot.usage[k][1];
							k++;
						}
					}
					localDataToPlot.usage = usageNullArray;
					dataToPlot = [localDataToPlot.usage];
					ghzstring = localDataToPlot.usageLegend;
					legendBoxSpans = legendBoxSpan1 + ghzstring + legendSpanEND;
					titleLegendContainer = titleLegendContainerStart + firstTitleLegend + titleLegendContainerEnd;
					praxis.seriesExist[year][yearServices[year][categoryNumber]] = 1;
				} else {
					chartTitle = '';
					titleLegendContainer = '';
					dataToPlot = "Empty String";
				}

				titleLegends = titleLegends + chartTitle + titleLegendContainer;
				$('.titleLegends', legendPlotWrapper).append(titleLegends);
				$('.legendBox2', legendPlotWrapper).append(legendBoxSpans);
				pastPlots[yearServices[year][categoryNumber]][year].plot =  vmf.jqplot.drawPlot(chartTargetId, dataToPlot, optionsToPlot);
				pastPlots[yearServices[year][categoryNumber]][year].isDrawn = 1;
				//$(''+legendPlotWrapper+' .legendBox .firstLegendText').text(yearServices[year][categoryNumber] + ' GHz Hours');
				praxis.createConsumptionCostData(localDataToPlot, legendPlotWrapper);
				$('.consumptionDataDetails', legendPlotWrapper).width($('canvas.jqplot-overlayCanvas-canvas', legendPlotWrapper).width());

			} else if ((pastPlots[yearServices[year][categoryNumber]][year].isDrawn == 1) && (localDataToPlot.eleType == 0) && (praxis.resizeForPast == true)) {
			    //if((praxis.resizeForPast == true) && (praxis.toBeReploted < currentCategoryArray.length)){
				var options2 = {
					resetAxes: true
				};
				vmf.jqplot.redrawPlot(pastPlots[yearServices[year][categoryNumber]][year].plot, options2);
				//praxis.toBeReploted++;
				//if(praxis.toBeReploted >= currentCategoryArray.length){praxis.resizeForPast = false;}   
			}	
		}
	},

	createConsumptionCostData: function(localDataToPlot, legendPlotWrapper){
		var consCostStrings = [], costUsageStrings = [], consumptionDataWrapper = null, usageContainerWrapper = null, labelContainer = null, tdWrapper = null, liElement = null;
		consCostStrings = [rs.graphConsumption + " " + localDataToPlot.usageLegend, rs.graphCost + " " + rs.sidCurrency];
		costUsageStrings= ["usage", "cost"];
		consumptionDataWrapper = $('<div class="consumptionCostData clearfix"><div class="lblCont"></div></div>');

		if(localDataToPlot.eleType == 0){

			ulWrapper = $('<table class="consumptionDataDetails"></table>');

			usageContainerWrapper = $('<div class="usageCont"></div>');
			for(var j = 0; j < consCostStrings.length; j++){ 
			

				labelContainer = $('<p>'+consCostStrings[j]+'</p>');
				tdWrapper = $('<tr class="consumptionDataDetailsRow"></tr>');
				for(var i = 0; i < localDataToPlot[costUsageStrings[j]].length; i++) {
					liElement = $('<td class="monthData"></td>');
					liText = localDataToPlot[costUsageStrings[j]][i][1];
					liElement.html(liText);
					tdWrapper.append(liElement);
				}
				consumptionDataWrapper.find('.lblCont').append(labelContainer);
				usageContainerWrapper.append(ulWrapper.append(tdWrapper));
				consumptionDataWrapper.append(usageContainerWrapper);
				$(legendPlotWrapper).append(consumptionDataWrapper);
				//$('.consumptionCostData .consumptionDataDetails .monthData').width('8%');
			} 
			
			
			if((localDataToPlot.usage.length > 0) && (localDataToPlot.cost.length > 0)){
			} else if (localDataToPlot.usage.length > 0) {
				$('.lblCont p', legendPlotWrapper).eq(1).css('display', 'none');
				$('.usageCont tr.consumptionDataDetailsRow', legendPlotWrapper).eq(1).css('display', 'none');
			} else {
				$('.lblCont p', legendPlotWrapper).eq(0).css('display', 'none');
				$('.usageCont tr.consumptionDataDetailsRow', legendPlotWrapper).eq(0).css('display', 'none');
			}
		}else{
			if(localDataToPlot.cost != ""){
				labelContainer = $('<p>'+consCostStrings[1]+'</p>');
				consumptionDataWrapper.find('.lblCont').append(labelContainer);
				ulWrapper = $('<div class="odtCostData"></div>');
				ulWrapper.html(localDataToPlot.cost);
				consumptionDataWrapper.append(ulWrapper)
				$(legendPlotWrapper).append(consumptionDataWrapper);
			}
		}

	},

	/*	getPastdata: function (year){
		praxis.allPastPlotsData[year] = {};
		var urlString = rs.url.getPastUsageDetailsServiceDetailsPage;
		var allData = praxis.loadData(urlString, year);
		if(allData ==null){return false;}
    	praxis.allPastPlotsData[year] = allData.plotData;
    	praxis.yearServices[year] = allData.services;
	},*/

	resume: function(){
		window.clearInterval(myvmware.praxis.myInterval);
		myvmware.praxis.myInterval = window.setInterval(function(){
			var obj = (praxis.pastOrCurrent ==1) ? $("#ribbonRight") : $("#pastNext");
			obj.trigger('click');
	    }, parseInt(rs.interval));

	},

    pause: function (){
    	if (myvmware.praxis.myInterval) {
    		window.clearInterval(myvmware.praxis.myInterval);
			myvmware.praxis.myInterval= null;
		} 
    },
    showPraxisBeaks: function(){
    	$('.beak_tooltip_flyout_def').css('z-index', '1000');
    	myvmware.common.setBeakPosition({
			beakId:myvmware.common.beaksObj["SDP_BEAK_SUB_PRAXIS_INS_DET_MAN_SER"],
			beakName:"SDP_BEAK_SUB_PRAXIS_INS_DET_MAN_SER",
			beakHeading:rs.head_manageService,
			beakContent:rs.desc_manageService,
			target:$('.secondary.manageServiceBtn ','#praxisContainer'),
			beakLink:'#beak1',
			beakUrl:'//download3.vmware.com/microsite/myvmware/sdpcust3/index.html',
			multiple:true,
			isFlip:true
		});

		myvmware.common.setBeakPosition({
			beakId:myvmware.common.beaksObj["SDP_BEAK_SUB_PRAXIS_INS_DET_PAST_USG"],
			beakName:"SDP_BEAK_SUB_PRAXIS_INS_DET_PAST_USG",
			beakHeading:rs.head_pastUsage,
			beakContent:rs.desc_pastUsage,
			target:$('.tabbed_box .tab:eq(1)','#praxisContainer'),
			beakLink:'#beak2',
			beakUrl:'//download3.vmware.com/microsite/myvmware/sdpcust3/index.html',
			multiple:true,
			isFlip:false
		});
    },
	showPastPraxisBeaks: function(){
		myvmware.praxis.pastBeaks = myvmware.common.beaksObj["SDP_BEAK_SUB_PRAXIS_PAST_USG_CHAR_OPT"];
		myvmware.common.setBeakPosition({
			beakId:myvmware.common.beaksObj["SDP_BEAK_SUB_PRAXIS_PAST_USG_CHAR_OPT"],
			beakName:"SDP_BEAK_SUB_PRAXIS_PAST_USG_CHAR_OPT",
			beakHeading:rs.chartingOption,
			beakContent:rs.chartingContent,
			target:$('.eaInputWrapper','#eaSelectorWidgetDiv1'),
			beakLink:'#beak3',
			beakUrl:'//download3.vmware.com/microsite/myvmware/sdpcust3/index.html',
			isFlip:true,
			isVFlip:true,
			multiple:true
		});
	}
};	

myvmware.praxisObj = {
	praxis : myvmware.praxis,
	init:function(){
		myvmware.common.addBreadScrumbDetails();
		callBack.addsc({'f':'myvmware.common.showMessageComponent','args':['PRAXIS_INSTANCE_DETAIL']});
		myvmware.praxisObj.currentUsage('current', $('.allPlotsWrapper'), rs.url.currenctUsageDetailsServiceDetailsPage);
		callBack.addsc({'f':'riaLinkmy','args':['praxis : subscription-service-detail']});
		$('a.autoCloseBtn').click(function(){
			$(this).closest('div.autoClose').hide();
		});
	},
	currentUsage: function(currentYear, obj, currentUrl){
		this.praxis.init.defaults(currentYear);
		this.praxis.loadCurrentData(currentUrl);
		if(!$.isEmptyObject(praxis.currentHeaderData)){
			this.praxis.buildRibbonCarousel(praxis.currentHeaderData);				
			this.praxis.init.carousel(currentYear, obj);    
			this.praxis.init.graph(currentYear);			
		} 
		this.praxis.bindEvents.carouselEvents();	
		this.praxis.bindEvents.tabEvents();
		this.praxis.bindEvents.otherCurrentEvents();
		callBack.addsc({'f':'praxis.showPraxisBeaks','args':[]});
	},

	pastUsage: function(currentYear, obj){
		this.praxis.init.defaults(currentYear);
		this.praxis.init.carousel(currentYear, obj); 
		this.praxis.init.graph(currentYear);
	}
};
/*** Start of dynamic form plug in **/
/** Prototype Version **/

$.fn.dynamicForm = function(options,isReadOnly) {
	var $this = $(this),
		dformHtml = {html:"" };

	if (!isReadOnly) isReadOnly = false;

	if (typeof(isReadOnly) == 'string') {
		if ($.trim(isReadOnly).toLowerCase() == 'true') {
			isReadOnly = true;
		} else {
			isReadOnly = false;
		}
	}
	/*$this.html('');*/

	if (!isReadOnly) {
		$this.attr("method", options['method']);
		$this.attr("action", options['action']);

		myvmware.sdp.daasInstanceForm.populateChild.call(dformHtml,options['html']);
		$this.append('<div class="dynamic-Form">' + dformHtml.html + '</div>');

		setTimeout(function() {
			myvmware.sdp.daasInstanceForm.validateDform(options['html']);
			myvmware.sdp.daasInstanceForm.showContent();
			myvmware.sdp.daasInstanceForm.dynamicSelect();
			myvmware.sdp.daasInstanceForm.prepareNotes();

			/*var selectedArr=[];
			for (var i in daasForm.selectArr) {
				if ($("#"+daasForm.selectArr[i]).is(":visible") && $("#"+daasForm.selectArr[i]+" option").length>0){
					vmf.dropdown.build($("#"+daasForm.selectArr[i]), {
						optionsDisplayNum: 5,
						ellipsisSelectText: false,
						ellipsisText: '',	 
						optionMaxLength: 70,
						inputMaxLength: 40,	 
						position: "right",
						onSelect: daasForm.onChangeDropdown,
						//optionsId: "eaDropDownOpts_variousCostsUsage",
						inputWrapperClass: "eaInputWrapper",
						spanpadding: true,
						spanClass: "corner-img-left",
						optionsClass: "dropdownOpts",
						shadowClass: "eaBoxShadow"
					});
					selectedArr.push(daasForm.selectArr[i]);
				}
			}
			for (var j in selectedArr){
				daasForm.selectArr = jQuery.grep(daasForm.selectArr, function(value) {
					return value != selectedArr[j];
				});
			}*/
		}, 100);
		$('.dForm.ccs.formcss .submitContainer').show();
	} else {
		myvmware.sdp.daasInstanceForm.populateChildDisplay.call(dformHtml,options['html']);
		$this.append('<div class="dynamic-Form">' + dformHtml.html + '</div>');
		setTimeout(function() {  
			myvmware.sdp.daasInstanceForm.showSubContent();
		}, 100);
	}
}
/*** End of dynamic form plug in **/
