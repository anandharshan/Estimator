var pelogintab = (function($) {
	var tabSelected, tabOn;

	var flipTab = function() {
		if (tabOn) {
			tabOn.className = '';
		}
		tabOn = this.parentNode;
		tabOn.className = 'active';
		if (tabSelected) {
			tabSelected.hide();	
		}
		tabSelected = $(this.hash);
		tabSelected.show();
		$(".text:first", tabSelected).focus();
	};

	var activeTab = function(e) {
		flipTab.apply(this, arguments);	
		e.preventDefault();
	};

	var activeTabbyLink = function(e) {
		var hash = this.hash;
		$('#logontab ul li a').each(function() {
			if(this.hash == hash.replace("_link", "")) {
				flipTab.apply(this, arguments);
			}
			else {
				$(this.hash).hide();
			}
		});
		e.preventDefault();
	};

	//peactivetab is a global variable to mark an active tab
	if(typeof(peactivetab) === 'undefined' || !peactivetab) {
		peactivetab = 'tab_login';
	}

	return function () {
		$('#logontab ul li a').each(function() {
			$(this).click(activeTab);
			if(this.hash.substr(1) == peactivetab) {
				flipTab.apply(this, arguments);	
			}
			else {
				$(this.hash).hide();
			}
		});

		$('#tab_login_register_link').find('a').each(function() {
			$(this).click(activeTabbyLink);
		});
	};

})(jQuery);

window.onload = pelogintab;