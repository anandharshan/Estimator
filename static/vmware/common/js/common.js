$(document).ready(function() {
	
		// My VMware Login Widget
		$dropDown = $(".my_vmware .my_vmware_dropdown_box");
		$dropDown.hide();		
		$dropDown.hover(
			function() {
				$(this).addClass('hovered');
			},
			function() {
				var cc = $(this);
				cc.removeClass('hovered');
				
				setTimeout(function(){
					if(!cc.hasClass('hovered')){
						cc.hide();
					}
				}, 500);
			}
		);
		$('.my_vmware').hover(function() {
			$(this).find('.my_vmware_dropdown_box').show();
		},function() {
			var cc = $(this);
			setTimeout(function(){
				if(!cc.find('.my_vmware_dropdown_box').hasClass('hovered')){
					cc.find('.my_vmware_dropdown_box').hide();
				}
			}, 500);
		});	
		
		// To fix Select boxes items getting cut in IE 7 and 8	
		if($.browser.msie) {
				$('select').mousedown(function () {
					$(this).css("width","auto");
				});
				
				$('select').change(function () {
					$(this).css("width","");
				});
					
				$('select').blur(function() {
					$(this).css("width","");
				});
		}
		
});