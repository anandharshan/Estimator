/* ########################################################################### *
/* ***** DOCUMENT INFO  ****************************************************** *
/* ########################################################################### *
 * ##### NAME:  account.js
 * ##### VERSION: v0.1
 * ##### UPDATED: 08/29/2011
/* ########################################################################### */

if (typeof(vm) == "undefined")  vm = {};
vm.account = {
	init: function(){
		//alert('Comes here');
		vm.account.openClose();
		vm.account.updatecount();
	},
	openClose:function(){
		$companyList = $('ul.ul_company_list');
		$('ul.ul_company_list li .moredetails').hide();
		$companyList.find('.openCloseSelect a').click(function() {
    		var $a = $(this);
			if($a.hasClass('open')){
				$a.parents('.company_header').next('.moredetails').slideUp();
				$a.removeClass('open');
			}else{
				$companyList.find('.openCloseSelect a').removeClass('open');
				$companyList.find('.moredetails').slideUp();
				$a.parents('.company_header').next('.moredetails').animate({ height: 'toggle', opacity: 'toggle'});
				$a.toggleClass("open");


			}
    		return false;
    	});
	},
	/***********************************************************************/
	/***********Take count and update it in the light blue bar**************/
	/***********************************************************************/
	updatecount:function(){
		var gettotalcount = $('ul.ul_company_list').find('input[type=checkbox]').length;
		$('.result_bar span.tot_cnt').html('').html(gettotalcount);
		$('ul.ul_company_list input[type=checkbox]:checked').attr('checked', false);
		$('ul.ul_company_list input[type=checkbox]').click(function(){
			var getSelcnt = $('ul.ul_company_list input[type=checkbox]:checked').length;
			$('.result_bar span.sel_cnt').html('').html(getSelcnt);
		});
	}
}
