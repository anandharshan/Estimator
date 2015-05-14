vmf.ns.use("ice");
ice.accountinfo={
	init: function() {
		$.accInvalidAJAX = 'The AJAX response is invalid';
		$.accLoadingmsg = 'Account Content is loading..';
		$.accArrowdown = '/static/myvmware/common/img/anchor_blue.png';
		$.accArrowup = '/static/myvmware/common/css/img/arrow_up_blue.png';
		$.blanktext = '';
		$.accountNRow = 3;
		$.accountNCol = 2;
		$.accountInfo = null;
		$.accountMaxNRows = 10;
		ice.accountinfo.config();
		ice.accountinfo.getAccountInfo();
	},//End of init
	config: function() {},
	loadingInfo: function(message,element,flag) {
		if(flag == true) {
			element.find('tbody').remove();
			element.append('<tbody><tr><td colspan=\"3\" align=\"center\"><div class=\"loading\"><span class=\"loading_big\">'+ accountinfo.globalVar.loading +'</span></div></td></tr></tbody>');
		}
		else {element.find('tbody').remove();}
	},
	toggleError: function(message,element,flag) {
		//Element must be a jQuery selected  table node
		//flag determines to show message or not
		if(flag == true) {
			element.find('tbody').remove();
			element.append('<tbody><tr><td colspan=\"3\" align=\"center\" class=\"grey_text"\>' + message + '</td></tr></tbody>');
		}
		else {element.find('tbody').remove();}
	},
	getAccountInfo: function() {
		$.ajax({
			type: 'POST',
			url: $.accountInfoURL,//url: "/sample/accountinfo1.json",
			dataType: 'json',
			success: function(accountInfo) {
				$.accountInfo = accountInfo;
				ice.accountinfo.loadingInfo(null,$("#accountInfoTable"),false);
				var _validate = new Object();
				ice.accountinfo.valAndManipAccountInfo(accountInfo, _validate);
				if(_validate.result) {
					ice.accountinfo.populateAccountInfoUI(accountInfo);
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				ice.accountinfo.loadingInfo(null,$("#accountInfoTable"),false);
				if(textStatus == "parsererror") {ice.accountInfo.logError($.accInvalidAJAX);}//TODO SHOW validation failed message in modal
			},
			beforeSend: function() {	ice.accountinfo.loadingInfo($.accLoadingmsg,$("#accountInfoTable"),true);},
			complete: function() {}//Do Nothing
		});
	},
	valAndManipAccountInfo: function(accountInfo, validate, eaNumList) {
		if(accountInfo == undefined) {
			ice.accountinfo.toggleError($.accGenerror,$('#accountInfoTable'),true);
			ice.accountinfo.logError($.accInvalidAJAX);
			validate.result = false;
		}
		else if(accountInfo.accountList.length == 0) {
			ice.accountinfo.toggleError($.noaccounts,$('#accountInfoTable'),true);
			validate.result = false;
		}
		else {
			accountInfo.eaNumber = new Array();			//To store ea numbers
			for(var i=0;i<accountInfo.accountList.length;i++) {//Manipulate data to render
				//Store EA number in accountInfo
				accountInfo.eaNumber[i] = accountInfo.accountList[i][2];
				if(accountInfo.accountList[i][2].length > 0) { //If ea number is present then append it to first column
					accountInfo.accountList[i][0] = accountInfo.accountList[i][2] + '<br>' + accountInfo.accountList[i][0];
				}
				//Add hyperlink to EA information
				accountInfo.accountList[i][0] = '<a href=\"' + $.accountpageurl + '\">' + accountInfo.accountList[i][0] + '</a>';
				// Added Static text
				accountInfo.accountList[i][1] = $.blanktext;
				accountInfo.accountList[i][1] = accountInfo.accountList[i][1].replace(/<#>/i, '<strong></strong>');
			}
			validate.result = true;
		}
	},// end of valAndManipAccountInfo
	populateAccountInfoUI: function(accountInfo) {
		var mLLink="", mALink="", mActLink="", mSerLink = "";
		var _productList = $('<div><ul></ul></div>').addClass('accounts_details').addClass('hidden');
		var _openClose = $('<td class=\"tdOpenCloseButton\">' +'<div class="\openCloseSelect\"><a class=\"openClose\" href="#"></a></div></td>');//openclose icon
		var _accountInfoProducts = $("#accountInfoProducts");//Account Info products
		var _accountTable = $("#accountInfoTable");
		var _accountTableBody = $('<tbody></tbody>');
		var _accountLoopCount = 0;
		if($.accountNRow < accountInfo.accountList.length) {
			_accountLoopCount = $.accountNRow;
			$("#accountInfoToggle").parent().removeClass('hidden');	//Show the Show all link
		}
		else {_accountLoopCount = accountInfo.accountList.length;}
		for(var i=0;i<accountInfo.accountList.length;i++) {
			var _accountTr = $('<tr></tr>');
			_accountTr.data('eaNumber', accountInfo.eaNumber[i]);
			(i%2 == 0)?_accountTr.addClass('even'):_accountTr.addClass('odd');
			_accountTr.append(_openClose.clone());
			for(var j=0;j<$.accountNCol;j++) {
				_accountTr.append('<td>' + accountInfo.accountList[i][j] + '</td>');
			}
			//$('td', _accountTr).eq(2).append('<div class="link_account_view" id="view_products_link"><a href="#">View products in this account</a></div>')
			$('td', _accountTr).eq(2).append(_accountInfoProducts.clone().removeClass('hidden'));
			//Add hidden product list
			//Pass EA number along with the request.
			mLLink=$('td:eq(2) #accountInfoProducts ul:eq(0) li:eq(0) a', _accountTr);
			mVLink=$('td:eq(2) #accountInfoProducts ul:eq(0) li:eq(1) a', _accountTr);
			mSerLink=$('td:eq(2) #accountInfoProducts ul:eq(0) li:eq(2) a', _accountTr);
			mALink=$('td:eq(2) #accountInfoProducts ul:eq(1) li:eq(0) a', _accountTr);
			mActLink=$('td:eq(2) #accountInfoProducts ul:eq(1) li:eq(1) a', _accountTr);
			
			mALink.attr("href",mALink.attr("href")+"?_VM_EAN="+accountInfo.eaNumber[i]);
			mVLink.attr("href",mVLink.attr("href")+"?_VM_EAN="+accountInfo.eaNumber[i]+"#tab1");
			mSerLink.attr("href",mSerLink.attr("href")+"?_VM_EAN="+accountInfo.eaNumber[i]);
			mLLink.attr("href",mLLink.attr("href")+"?_VM_EAN="+accountInfo.eaNumber[i]);
			mActLink.attr("href",mActLink.attr("href")+"?_VM_EAN="+accountInfo.eaNumber[i]);

			
			if(i>=_accountLoopCount)	_accountTr.addClass('hidden hRows');
			_accountTableBody.append(_accountTr);
		}
		ice.accountinfo.toggleError(null,_accountTable,false); //Cleanup table
		_accountTable.append(_accountTableBody); //Display table
		ice.accountinfo.attachAccountInfoEvents();
	},// end of populateAccountInfoUI
	attachAccountInfoEvents: function() {
		$("#accountInfoToggle").click(function() {  //For toggling accounts
			if($(this).hasClass('close')) {
				$("#accountInfoTable tr.hRows").addClass('hidden')
				$(this).removeClass('close').text($.accountshowaccounts);
			}
			else{
				$("#accountInfoTable tr.hRows").removeClass('hidden')
				$(this).addClass('close').text($.accounthideaccounts);
			};
			return false;
		});
		ice.accountinfo.registerExpandCollapse();
	},// end of attachAccountInfoEvents
	registerExpandCollapse: function() {
		//For expand collapse icon
		$("#accountInfoTable .openClose").
		each(function(index, value) {
			if($(this).data('events') == undefined) {
				$(this).click(function(e) {
					var _productColumn;
					if($(e.target).hasClass('openClose')){
						_productColumn = $(this).parents('td').siblings().last();
					}else{
						_productColumn = $(this).parents('td');
					}
					_productColumn.prepend('<div class="loading"><span class="loading_small">'+ accountinfo.globalVar.loading +'</span></div>');
					if($(this).hasClass('open')) {
						_productColumn.find('.accounts_details').addClass('hidden');
						//_productColumn.find('#view_products_link').show();
						_productColumn.find('.account_length').hide();
						_productColumn.find('div.loading').remove();
						$(this).removeClass('open');
					}
					else {
						var _currentTr = $(this).parents('tr');
						if((_productColumn.hasClass('hasData'))) {
							_productColumn.find('.accounts_details').removeClass('hidden');
							//_productColumn.find('#view_products_link').hide();
							_productColumn.find('div.loading').remove();
							_productColumn.find('.account_length').show();
						}
						else {
							//_productColumn.find('#view_products_link').hide();
							ice.accountinfo.getAccessProductList(_currentTr.data('eaNumber'), _productColumn);
						}
						if($(e.target).hasClass('openClose')){
								$(this).addClass('open');
						}else{
							$(this).parents('tr').find('td.tdOpenCloseButton div a.openClose').addClass('open');
						}
					}
					return false;
				});
			}
		});
	},// end of registerExpandCollapse
	getAccessProductList: function(eaNumber, productColumn) {
		var productListData = new Object();
		productListData["eaNumber"] = eaNumber;
		$.ajax({
			type: 'GET',
			url: $.productInfoURL,
			dataType: 'json',
			data: productListData,
			success: function(productInfo) {
				$.productInfo = productInfo;
				var _validate = new Object();
				ice.accountinfo.valAndManipProductInfo(productInfo, _validate);
				if(_validate.result) {
					ice.accountinfo.populateProductInfoUI(productInfo, productColumn);
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				//ice.accountinfo.loadingInfo(null,$("#accountInfoTable"),false);
				productColumn.find('div.loading').remove();
				if(textStatus == "parsererror") {					
					//TODO SHOW validation failed message in modal
					ice.accountInfo.logError($.accInvalidAJAX);
				}
			},
			beforeSend: function() {
				//ice.accountinfo.loadingInfo($.accLoadingmsg,$("#accountInfoTable"),true);
			},
			complete: function() {}//Do Nothing
		});
	},// end of getAccessProductList
	valAndManipProductInfo: function(productInfo, validate) {
		if(productInfo == undefined || productInfo.accessProductList == undefined) {
			ice.accountinfo.logError($.accInvalidAJAX);
			validate.result = false;
		}
		else {validate.result = true;}
	},//End of valAndManipProductInfo
	populateProductInfoUI: function(productInfo, productColumn) {
		var _accountAccessText = $.accountaccesstext;
		if(productInfo.accessProductList.length == 0) {
			_accountAccessText = _accountAccessText.replace(/<#>/i, '<strong>' + productInfo.accessProductList.length + '</strong>');
		}
		else {
			_accountAccessText = _accountAccessText.replace(/<#>/i, '<strong>' + productInfo.accessProductList.length + '</strong>');
			var _productList = $('<div><ul></ul></div>').addClass('accounts_details')
			for(var i=0;i<productInfo.accessProductList.length;i++) {
				var _productLi = $('<li>' + productInfo.accessProductList[i] + '</li>').addClass('withNoBackground');
				$('ul', _productList).append(_productLi);
			}
			productColumn.prepend(_productList);
		}
		productColumn.prepend('<div class="account_length">'+_accountAccessText+'</div>');
		productColumn.find('div.loading').remove();
		productColumn.addClass('hasData');
	},//end of populateProductInfoUI
	logError: function(error) {
		try {console.error(error);}
		catch(e) {}//Do nothing
	}
};//End of ice.accountinfo