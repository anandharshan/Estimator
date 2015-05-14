vmf.ns.use("ice");
ice.orderdetails = {
	loadProductDataUrl:null,
	exportCSVUrl:null,
	productHeader:null,
	quantity:null,
	unitpriceHeader:null,
	estimatedHeader:null,
	expandViewDetails:null,
	viewContractDetailsUrl:null,
	orderDetailsData:null,
	newRowRender:null,
	isAllowedData:null,
	init: function (loadprdUrl,exporturl,prdheader,quantityhdr,unitpricehdr,estmtedhdr,expandVD,vwContrctDetails) {
		vmf.scEvent = true;
		callBack.addsc({'f':'riaLinkmy','args':['order-history : details']});
		loadProductDataUrl = loadprdUrl;
		exportCSVUrl = exporturl;
		productHeader=prdheader;
		quantity=quantityhdr;
		unitpriceHeader=unitpricehdr;
		estimatedHeader=estmtedhdr;
		expandViewDetails=expandVD;
		isAllowedData = '';
		viewContractDetailsUrl=vwContrctDetails;
		ice.orderdetails.orderDetailsData = [];
		ice.orderdetails.renderOrderDetailsData();
		newRowRender = '';
		// Defect fixed BUG-00027530 Start
		$('#content-container table tr.total td.line-top').css({'border-top':'1px solid #666666'});
		$('div.dataTables_wrapper').css({'min-height':'50px'});
		$('.orderDetailsField .supportOrderDetailsFieldName').css({'margin-top':'0px'});
		//$('.tabContent .column-wrapper').css({'min-height':'150px','height':'auto'});
		$('.supportOrderDetailsHeader').css({'padding-left':'15px'});
		$('.cityZip').css({'font-size':'11px'});
		/*ice.orderdetails.loadProductDetailsTable();*/
        $('#export').click(function () {
            window.location = exportCSVUrl;
			return false;
        }); 
        //$(".totals").css("display", "none");
    	$('#dataTableWrapper .contractProductDetails').live('click', function() {
			if($(this).hasClass('open')) {
				$(this).removeClass('open');
				$(this).closest('tr').next().css('display', 'none');
			}
			else {
				$(this).addClass('open');
				$(this).closest('tr').next().css('display', 'table-row');
			}
		});
		vmf.datatable.reload($('#dataTableWrapper'),loadProductDataUrl,ice.orderdetails.postProcessingData);
    },
	postProcessingData:function(){
	},
    /*loadProductDetailsTable: function () {
		$('#loading').show();
		$('#loadingerrormsg').hide();
		vmf.ajax.post(loadProductDataUrl, null, ice.orderdetails.renderSuccessLoadOrderDetails, ice.orderdetails.renderFailLoadOrderDetails);
    },
    renderSuccessLoadOrderDetails: function (data) {
        var _orderJsonResponse = vmf.json.txtToObj(data);
		var _orderDetailsResponse = _orderJsonResponse.aaData;
		var _showPrice = _orderJsonResponse.isAllowed;
		ice.orderdetails.renderOrderDetailsData(_orderDetailsResponse,_showPrice);
		$('#loading').hide();
    },
    renderFailLoadOrderDetails: function (data) {
        $('#loadingerrormsg').show();
    },*/
    renderOrderDetailsData: function () {
        vmf.datatable.build($('#dataTableWrapper'), {
            "aoColumns": [{
                "sTitle": '<span class="descending">'+ productHeader+'</span>', "sWidth" : "400px"
            }, {
                "sTitle": '<span class="descending">'+quantity+'</span>', "sWidth" : "100px" 
            }, {
                "sTitle": '<span class="descending">'+unitpriceHeader+'</span>', "sWidth" : "75px"
            }, {
                "sTitle": '<span class="descending">'+estimatedHeader+'</span>', "sWidth" : "100px", "sClass": "estimatedPrice"
            }, {
                "sTitle": ""
			}, {
                "sTitle": ""
            }],
			"bServerSide":false,
			"aaData": ice.orderdetails.orderDetailsData,
			"bProcessing":true,
			"bAutoWidth":false,
			"bFilter":false,
			"bPaginate":false,
			"bInfo":false,
			"oLanguage": {
					"sProcessing" : loadingTxt,
					"sLoadingRecords":""											
			},
			"fnRowCallback":function(nRow,aData,iDisplayIndex){
				settings= this.fnSettings();
				if(settings.jqXHR && settings.jqXHR.responseText!==null && settings.jqXHR.responseText.length && typeof settings.jqXHR.responseText =="string"){
					jsonRes = vmf.json.txtToObj(settings.jqXHR.responseText);
					ice.orderdetails.orderDetailsData=jsonRes.aaData;
					var _productName = aData[0];
					var estimatedPrice = aData[3];
					var splitEstimate = estimatedPrice.split(".");
					if(splitEstimate.length > 2){
						var newEstimatedPrice = estimatedPrice.substring(0,(estimatedPrice.length-3));
					} else {
						var newEstimatedPrice = estimatedPrice;
					}
					
					var unitPrice = aData[2];
					var splitUnit = unitPrice.split(".");
					if(splitUnit.length > 2){
						var newUnitPrice = unitPrice.substring(0,(unitPrice.length-3));
					} else {
						var newUnitPrice = unitPrice;
					}
					isAllowedData =jsonRes.isAllowed;
					if(aData[6] == 'SUBSCRIPTIONS') $('td:eq(0)', nRow).html('<div>'+_productName+'</div>');
					else $('td:eq(0)', nRow).html('<div class="openCloseSelect" ><a id="'+aData[4]+'" productLineType="'+aData[5]+'" class="openClose firstchild" href="javascript:void(0);"></a></div><div>'+_productName+'</div>');
					$('td:eq(3)',nRow).html(newEstimatedPrice);
					$('td:eq(2)',nRow).html(newUnitPrice);
					$('td:eq(0)',nRow).css({'padding-left':'11px'});
				}
				return nRow;
			},
            "fnDrawCallback": function() {
				if(isAllowedData==false){
					this.fnSetColumnVis(2,false);
					this.fnSetColumnVis(3,false);
				}else{
					this.fnSetColumnVis(2,true);
					this.fnSetColumnVis(3,true);
				}
				this.fnSetColumnVis(4,false);
				this.fnSetColumnVis(5,false);
				//$(".totals").css("display", "none");
				var orderDetailsView = $('#orderDetailsView #dataTableWrapper'); 
				orderDetailsView.find('.openCloseSelect a').click(function(){
		    		var _$a = $(this);
					var _nTr = this.parentNode.parentNode.parentNode; 
					if (_$a.hasClass('open')){ 
						_$a.removeClass('open');
						$(_nTr).removeClass('noborder');
						$(_nTr).next("tr").remove();
					} else {
						_$a.addClass('open');
						$(_nTr).addClass('noborder');
						var _rowSelector = $(_$a).parents('tr');
						var _newRow =$("<tr class='dynamicRow'></tr>");
						_newRow.html('<td colspan="4"><div class="loading"><span class="loading_small">'+loadingTxt+'</span></div></td>');
						newRowRender = $($(_newRow)).insertAfter(_rowSelector);
						orderDetailsView.find('.openCloseSelect a').unbind('click', '')
						var _productId = _$a.attr('id');
						var _productLineType =  _$a.attr('productLineType');
						ice.orderdetails.getRoworderdetails(_productId, _productLineType);
						_nTr.haveData	 = true;
					}
					return false;
				});
			},
			"fnInitComplete": function () {
				var dt=this;
				if(this.closest('div.dataTables_scrollBody')[0] && this.closest('div.dataTables_scrollBody').attr('style').toLowerCase().indexOf('overflow')!=-1){
					this.closest('div').css("overflow-y","scroll");
					setTimeout(function() {dt.fnAdjustColumnSizing(false);}, 500);
				}
			}
		});
		$('#amounts').show();
		$('#footerMessage').show();
    },
	getRoworderdetails: function (_productId, _productLineType) {
		
		var urlOrderexpDetail = expandViewDetails+"&productId="+_productId+"&productLineType="+_productLineType;
		$.ajax({
			type: "GET",
			dataType: "json",
			url: urlOrderexpDetail,
			success: function(data) {
				try{
					if(!data.error){
						var _showTableFlag = data.isAllowed;
						if(_showTableFlag == true){
							newRowRender.addClass('more-details');
							newRowRender.attr('style', 'display: table-row;');
							//Changes as part of BUG-00052407 to add encrypted ContractId for URL 
							var _contractDetailsCall = viewContractDetailsUrl + '&contractID=' + data.aaData[5]+'&contractStatus='+ data.aaData[4];
							newRowRender.find("td").html('<table style="width:95%;"><thead><tr><th class="col1">'+orderdetails.globalVar.contractIDHeader+'</th><th class="col2">'+orderdetails.globalVar.contractExpHeader+'</th></tr></thead><tbody><tr><td class="col1"><a href='+_contractDetailsCall+' target="_blank">'+data.aaData[0]+'</a></td><td class="col2">'+data.aaData[1]+'</td></tr></tbody></table>');							
						}else{
							newRowRender.addClass('more-details');
							newRowRender.attr('style', 'display: table-row;');
							var licenseKey ="";
							for(var i=0 ; i<data.aaData[2].length; i++){
								licenseKey += data.aaData[2][i] + "</br>";
							}
							newRowRender.find("td").html('<table style="width:95%;"><thead><tr><th class="col1">'+orderdetails.globalVar.detailsHeader+'</th><th class="col2">'+orderdetails.globalVar.trackingHeader+'</th></tr></thead><tbody><tr><td class="col1">'+data.aaData[0]+'</td><td class="col2">'+data.aaData[1]+'</td></tr></tbody></table>');											
						}	
						if(data.aaData[3].productList != '' && data.aaData[3].productList != undefined){
						    var tabHead ='<table style="width:95%;"><thead><tr><th>'+orderdetails.globalVar.productsHeader+'</th><th >'+orderdetails.globalVar.quantityHeader+'</th></tr></thead><tbody>';
						    var tabTail ='</tbody></table>';
						    var tabTr = '';
							for(var i =0 ; i < data.aaData[3].productList.length; i++){
								tabTr += '<tr><td><div style="float: left; margin-right: 20px;" class="inneropenCloseSelect"><a class="openClose contractProductDetails">&nbsp;</a></div>'+data.aaData[3].productList[i].productName+'</td><td>'+data.aaData[3].productList[i].quantity+'</td></tr>'; // Defect fixed BUG-00028520
								if(!data.aaData[3].productList[i].permissionFlag) {
									tabTr += '<tr class="more-details" style="display: none;"><td class="" colspan="5"><table style="width:95%;"><thead><tr><th>'+orderdetails.globalVar.detailsHeader+'</th><th>'+orderdetails.globalVar.trackingHeader+'</th></tr></thead><tbody><tr><td>' + data.aaData[3].productList[i].outputType + '</td><td>' + data.aaData[3].productList[i].trackingDetails + '</td></tr></tbody></table></td></tr>';
								} else {
									var _childContractDetailsCall = viewContractDetailsUrl + '&contractID=' + data.aaData[3].productList[i].contractID +'&contractStatus='+ data.aaData[3].productList[i].contractStatus;
									tabTr += '<tr class="more-details" style="display: none;"><td class="" colspan="5"><table style="width:95%;"><thead><tr><th>Contract ID</th><th>Contract Expiration Date</th></tr></thead><tbody><tr><td><a href='+_childContractDetailsCall+' target="_blank">'+data.aaData[3].productList[i].contractNumber+'</a></td><td>' +data.aaData[3].productList[i].contractEndDate.year + '-' + data.aaData[3].productList[i].contractEndDate.month + '-' + data.aaData[3].productList[i].contractEndDate.date+ '</tbody></table></td></tr>';
								}
							}
							newRowRender.find("td").eq(0).append(tabHead + tabTr+tabTail);
						}
						newRowRender.find("table").css({'margin-left':'17px'});
					} else{
						//alert(data.error);
					}
				} catch(err){
					//alert('Unable to load the data. Please try it again.');
				}
				var orderDetailsView = $('#orderDetailsView #dataTableWrapper'); 
				orderDetailsView.find('.openCloseSelect a').bind('click',function(){
					var _$a = $(this);
					var _nTr = this.parentNode.parentNode.parentNode; 
					if (_$a.hasClass('open')){ 
						_$a.removeClass('open');
						$(_nTr).removeClass('noborder');
						$(_nTr).next("tr").remove();
					} else {
						_$a.addClass('open');
						$(_nTr).addClass('noborder');
						var _rowSelector = $(_$a).parents('tr');
						var _newRow =$("<tr class='dynamicRow'></tr>");
						_newRow.html('<td colspan="4"><div class="loading"><span class="loading_small">'+loadingTxt+'</span></div></td>');
						newRowRender = $($(_newRow)).insertAfter(_rowSelector);
						orderDetailsView.find('.openCloseSelect a').unbind('click', '')
						var _productId = _$a.attr('id');
						var _productLineType =  _$a.attr('productLineType');
						ice.orderdetails.getRoworderdetails(_productId, _productLineType);
						_nTr.haveData	 = true;
					}
					return false;
				});
			}
		});
	},
	showloading :function(){
		return sOut='<span class="loading_small">'+loadingTxt+'</span>';
	}
};