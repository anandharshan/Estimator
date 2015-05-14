/* ########################################################################### *
/* ***** DOCUMENT INFO  ****************************************************** *
/* ########################################################################### *
 * ##### NAME:  downgradelicenses.js
 * ##### VERSION: v0.1
 * ##### UPDATED: 04/24/2011
/* ########################################################################### */
vmf.ns.use("ice");
ice.dvi3l = {
	dUrl:null,
	dVI3OrderDetail:null,
	dVI3OrderPreview:null,
	licenseHomeUrl:null,
	dVI3OrderConfirm:null,
	aa:[],
	sout:null,
	prodHeading:null,
	qtyHeading:null,
	orderHeading:null,
	dateHeading:null,
	noDataFlag:null,
	noOrdersGlobal:null,
    init: function(downVI3OrderListUrl, downgVI3OrderDetail, downVI3OrdersPreview, licenseHomeCancelURL, downgradeToVI3OrdersConfirm, title1, title2,title3,title4, noOrders) {	
	vmf.scEvent = true;
	callBack.addsc({'f':'riaLinkmy','args':['my-licenses : downgradevi3']});
	dVI3OrderDetail = downgVI3OrderDetail;
	dVI3OrderPreview = downVI3OrdersPreview;
	licenseHomeUrl = licenseHomeCancelURL;
	prodHeading = title1;
	qtyHeading = title2;
	orderHeading = title3;
	dateHeading =title4;
	noOrdersGlobal = noOrders;
	noDataFlag = true;
	dVI3OrderConfirm = downgradeToVI3OrdersConfirm;	
	$('#dvi3_confirm_btn').addClass('disabled');
	$('#dvi3_confirm_btn').attr('disabled', true);
	$('#btn_confirm').addClass('disabled');
	$('#btn_confirm').attr('disabled', true);
	$('#eaSelectorDropDown').attr('disabled','disabled');	
	$.ajax({
            type: 'POST',
            url: downVI3OrderListUrl,			
            success: function (data) {
				try {
				var _jsonResponse = vmf.json.txtToObj(data);
                var _lData = _jsonResponse.aaData;
				var len = _lData.length;				
				for(var i=0;i<len;i++){
					ice.dvi3l.aa[i] = [];
					ice.dvi3l.aa[i][0] = '<td><input type="checkbox" name="orderList" value="'+_lData[i][0]+'"/></td>';
					ice.dvi3l.aa[i][1] = '<td><div class="openCloseSelect"><a class="openClose" id = "'+_lData[i][0]+'" href="#"></a></div></td>'
					ice.dvi3l.aa[i][2] = _lData[i][0];
					ice.dvi3l.aa[i][3] = _lData[i][1];
					ice.dvi3l.aa[i][4] = '<td>&nbsp;</td>';
				};
				if($('#downgrade_order_tbl').length >0){			
					$('#downgrade_order_tbl').dataTable( {
						"bPaginate": false,
						"bFilter":false,
						"sDom": 't',
						"bAutoWidth": false,
						"aoColumns": [{"sWidth":"20px"},{"sWidth":"10px"},{"sWidth":"152px"},{"sWidth":"136px"},{"sWidth":"auto"}],
						"aoColumnDefs": [ 
								{ "sClass": "v_openclose", "aTargets": [ 1 ] }
							],
						"aaData": ice.dvi3l.aa,
						"fnInitComplete": function () {
							//alert("i am here");
							var dt = this;
							var $dlMid = $('#downgradelist_id');
							$dlMid.find('.more-details').hide();
							$dlMid.find('.openCloseSelect a').click(function() {
								$a = $(this);
								nTr = $a.closest('tr')[0];
								if ($a.hasClass('open') && nTr.haveData)
								{
									$(nTr).removeClass('noborder');
									$(nTr).next("tr").removeClass('notd_pad');
									$a.removeClass('open');
									$(nTr).next("tr").hide();
								}
								else{
									$a.addClass('open');
									$(nTr).addClass('noborder');
									if(!nTr.haveData){
										dt.fnOpen(nTr,ice.dvi3l.showloading(),'');										
										ice.dvi3l.showDowngradeVI3OrderDetail(this.id);
										$(nTr).next("tr").addClass('notd_pad');
										nTr.haveData = true;
									}else {
										$(nTr).next("tr").show(function(){
										$(nTr).next("tr").addClass('notd_pad');
										});
									}
								};
								//$(nTr).slideToggle(function() {});
								return false;
							}); 

						},
						"fnDrawCallback": function () {
							dt = this;
							$(this).find(">tbody>tr:not('.notd_pad,.divide-table-wrapper tr')").bind('mouseover mouseout click',function(e){
								//console.log(e.type);
								if($(this).is(".notd_pad,.divide-table-wrapper tr")) return;
								if(e.type=="mouseover"){
									$(this).addClass('hover'); // Mouseover Background color
								} else if (e.type=="mouseout"){
									$(this).removeClass('hover'); // Remove Mouseover Background color
								}	else {
									target= $(e.target);
									if (target.is("a.openClose")){
										return;
									} else if (target.is("input[type=checkbox]:not([readonly]):not([disabled])")){
										trEle=target.closest("tr"), $check=$(target);
										checked = target.is(':checked');
									} else {
										trEle=$(this), $check=$(this).find("input[type=checkbox]:not([readonly]):not([disabled])");
										checked = !trEle.hasClass('active');
									}
									if(checked){
										trEle.addClass("active");
										$check.attr("checked","checked");
										if($(dt).find('input[type=checkbox]:checked').length > 0){
											$('#btn_confirm').removeClass('disabled');
											$('#btn_confirm').attr('disabled', false);
											if($(dt).find('input[type=checkbox]').length == $(dt).find('input[type=checkbox]:checked').length){
												$('#dl_selectall').attr('checked',true);
											}else{
												$('#dl_selectall').attr('checked',false);
											}
										}
									} else {
										trEle.removeClass("active");
										$check.removeAttr("checked");
										if($(dt).find('input[type=checkbox]:checked').length < 1){
											$('#btn_confirm').addClass('disabled');
											$('#btn_confirm').attr('disabled', true);
										}
										$('#dl_selectall').attr('checked',false);
									}
								}							
							});
						}
					});
					$('#loading').hide();
					if($('td.dataTables_empty').html() == ice.globalVars.noData) {				
						noDataFlag = false;						
						$('td.dataTables_empty').html(noOrdersGlobal);
					}
				};
				}
				catch (e) {
					$('#downgrade_order_tbl').html('<thead><tr><th></th><th></th><th><span class="descending">'+ice.globalVars.orderNumberLbl+'</span></th><th><span class="descending">'+ice.globalVars.dateLbl+'</span></th><th></th></tr></thead><tr><td colspan="5" align="center">'+noOrdersGlobal+'</td></tr>');
				}
			},
			error: function () {
				//alert("error");
			},
	
		});
		$('#btn_confirm').click(function() {
			ice.dvi3l.showSelectedOrderList();
		});
		$('#dvi3_confirm_btn').click(function() {		   
			vmf.modal.hide();
			ice.dvi3l.showConfirmOrderList();					
		});
		$('#dvi3_btn_cancel').click(function() {		   
			vmf.modal.hide();			
		});			
		$('#dl_selectall').click(function() {
			if($(this).attr('checked') == true){
				if(noDataFlag == true)
				{
					$('#btn_confirm').removeClass('disabled');
					$('#btn_confirm').attr('disabled', false);
				}
				$(this).parents('section#downgradelist_id').find('input[type=checkbox]').attr('checked',true);
				$(this).parents('section#downgradelist_id').find('.downgrade_v13_order_tbl tbody tr').addClass('active');
			} else {
				$(this).parents('section#downgradelist_id').find('input[type=checkbox]').attr('checked',false);
				$(this).parents('section#downgradelist_id').find('.downgrade_v13_order_tbl tbody tr').removeClass('active');
				$('#btn_confirm').addClass('disabled');
				$('#btn_confirm').attr('disabled', true);
			}
		});
		if($('input[type=checkbox]#dvi3_ChkBox').length > 0){
			$('input[type=checkbox]#dvi3_ChkBox').change(function(){
				if ($('input[type=checkbox]#dvi3_ChkBox:checked').length)
				{
					$('#dvi3_confirm_btn').removeClass('disabled');
					$('#dvi3_confirm_btn').attr('disabled', false);
					
				}
				else
				{
					$('#dvi3_confirm_btn').addClass('disabled');
					$('#dvi3_confirm_btn').attr('disabled', true);
				}

			});
		}
		$('#dvi3_cancel_btn').click(function () {		    
            window.location = licenseHomeUrl;
        });
		$('#dvi3_close_btn').click(function () {			
            window.location = licenseHomeUrl;
        });
},
onDowngradeVi3Success: function (data) {
	var _responseData = vmf.json.txtToObj(data);
	var _dataLength = _responseData.aaData.length;
	sOut="";
	sOut = '<div class="more-details mleftOneZeroTwo" >';
	sOut +='<div class="divide-table-wrapper"><table width="100%"><thead><tr><th class="col1">'+prodHeading+'</th><th class="col2" style="width:300px;">'+qtyHeading+'</th></tr></thead>';
	sOut +='<tbody>';
	for(var i = 0; i < _dataLength ; i++ )
	{
		sOut +='<tr><td class="col1" width="60%" align="left">'+_responseData.aaData[i][0]+'</td><td class="col2" width="40%" aling="left">'+_responseData.aaData[i][1]+'</td></tr>';	
	}
	sOut +='</tbody></table></div>';
	sOut += '</div>';
	$(nTr).next("tr").find("td").html(sOut);
	//$('#loading, #pleaseConfirm').html('');					
},
onDowngradeVi3Fail: function (data) {
	//alert("error");				
},
showDowngradeVI3OrderDetail: function (_orderNumber) {
	var dVI3OrderUrl = dVI3OrderDetail+ '&orderNumber=' + _orderNumber;
	vmf.ajax.post(dVI3OrderUrl, null, ice.dvi3l.onDowngradeVi3Success, ice.dvi3l.onDowngradeVi3Fail);
},
showSelectedOrderList: function () {
	var _arrayOfSelectedOrders = new Array();
	$("#downgrade_order_tbl input:checkbox[name=orderList]:checked").each(function () {
		_arrayOfSelectedOrders.push($(this).val());
	});
	var dVI3OrderPreUrl = dVI3OrderPreview+ '&orderList=' + _arrayOfSelectedOrders;
	vmf.ajax.post(dVI3OrderPreUrl, null, ice.dvi3l.onDowngradeVi3Preview, ice.dvi3l.onDowngradeVi3Fail);	
},
showConfirmOrderList: function () {
	var _arrayOfSelectedOrders = new Array();
	$("#downgrade_order_tbl input:checkbox[name=orderList]:checked").each(function () {
		_arrayOfSelectedOrders.push($(this).val());
	});
	var dVI3OrderConfUrl = dVI3OrderConfirm+ '&confirmOrders=' + _arrayOfSelectedOrders;
	vmf.ajax.post(dVI3OrderConfUrl, null, ice.dvi3l.onDowngradeVi3Confirm, ice.dvi3l.onDowngradeVi3Fail);	
},
onDowngradeVi3Confirm: function (data) {   
	setTimeout(function(){vmf.modal.show("initiateVI3downgradeOrders");},90);	
},
onDowngradeVi3Preview: function (data) {    
	vmf.modal.show("confirmVI3downgradeOrders");
	var _responseData = vmf.json.txtToObj(data);
	var _dataLength = _responseData.aaData.length;
	var orderStr = ""
	orderStr = '<thead><tr><th class="col1">'+orderHeading+'</th><th class="col2">'+dateHeading+'</th><th class="col3">'+prodHeading+'</th><th class="col4 lastcol">'+qtyHeading+'</th></tr></thead><tbody>';
	for(var i = 0; i < _dataLength ; i++ )
	{
        orderStr += '<tr><td>'+_responseData.aaData[i][0]+'</td><td>'+_responseData.aaData[i][1]+'</td>';
		var _innerdataLength = _responseData.aaData[i][2].length;
		orderStr += '<td>'
		for(var j = 0; j < _innerdataLength; j++)
		{
			if(j == (_innerdataLength-1))
			{
				orderStr += _responseData.aaData[i][2][j][0];
			}
			else
			{
				orderStr += _responseData.aaData[i][2][j][0]+'<br>';
			}
		}

		orderStr += '</td><td class="lastcol">';
		for(var j = 0; j < _innerdataLength; j++)
		{
			if(j == (_innerdataLength-1))
			{
				orderStr += _responseData.aaData[i][2][j][1];
			}
			else
			{
				orderStr += _responseData.aaData[i][2][j][1]+'<br>';
			}
		}
		orderStr += '</td></tr>';
	}
	orderStr += '</tbody>';
	$("#order_details_tbl").html(orderStr);
	$("#order_details_tbl").find('tr:last').addClass('noborder');
	if($('#confirmVI3downgradeOrders .highlight').height() > 130){
		$('#confirmVI3downgradeOrders .highlight').height(130);
	}
},
showloading : function (){
	sOut="<div class='loading'><span class='loading_small'>"+ice.globalVars.loadingLbl+"</span></div>";
	return sOut;
}	
}