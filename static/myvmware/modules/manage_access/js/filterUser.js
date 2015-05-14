vmf.ns.use("ice");

ice.filterUser = {
		filterErrMsg:null,
		init:function(filterErrMsgText){
			filterErrMsg=filterErrMsgText;
			$("#addusersContent .searchInput").focus(function() {
				$(this).css('color', '#333333');
				if(this.value == this.defaultValue) {
					this.value = '';
				}
				else {
					this.select();
				}
			});
			$("#addusersContent .searchInput").keyup(function() {
				if($.trim($(this).val()).length > 0) {
					$(this).next().removeClass('sIcon').addClass('clearSearch');
				}
				else {
					$(this).next().addClass('sIcon').removeClass('clearSearch');
				}
			});
			$("#addusersContent .searchInput").blur(function() {
				$(this).css('color', '#999999');
				if($.trim(this.value) == '') {
					this.value = (this.defaultValue ? this.defaultValue : '');
				}
			});
			$("#addusersContent").delegate(".clearSearch","click", function() {
				$("#addusersContent .searchInput").val('');
				$(this).removeClass('clearSearch').addClass('sIcon');
				ice.filterUser.resetFilter();
			});
			$('#addusersContent #filterBtnId').click(function(){
				var userInputFilter = $.trim($("#addusersContent .searchInput").val());
				if(userInputFilter!='' && userInputFilter!= ice.globalVars.enterEmail){
					ice.filterUser.searchUserDualList();
				} else {
					$('#filterErrorMsg').show();
					$('#filterErrorMsg').html(ice.globalVars.enterNameEmailMsg);
				}
			});
		},
		searchUserDualList : function (){
			$('#filterErrorMsg').hide();
			var searchBoxValue = $.trim($('#addusersContent .searchInput').val().toUpperCase());
			if(searchBoxValue != ice.globalVars.enterEmail){
				if(searchBoxValue.length > 0){
					var hideCount = 0;
					$('#filterErrorMsg').hide();
					$('ul.possibleUsersList').find('li').each(function(){
						if((searchBoxValue == $(this).find('label').text().toUpperCase()) || ($(this).find('label').text().toUpperCase().indexOf(searchBoxValue) != -1) || ($(this).find('span.email').text().toUpperCase().indexOf(searchBoxValue) != -1)){
							$(this).show();
						}else{
							$(this).hide();
							hideCount++;
						}
					});
					if($('ul.possibleUsersList').find('li').length == hideCount){
						$('#filterErrorMsg').html(filterErrMsg);
						$('#filterErrorMsg').show();
						hideCount = 0;
					}
				}
			}
		}, 
		resetFilter : function(){
			$('input.searchInput').val(ice.globalVars.enterEmail);
			$('ul.possibleUsersList').find('li').each(function(){
					$(this).show();
			});
			$('#filterErrorMsg').hide();
		},
		adjustUserList: function(){
			var userList = $('ul.info_list li');
			if(userList.length){
				var liFirst = $('ul.info_list li:first'), s = $('ul.info_list li.s'), sp = $('ul.info_list li.sp'), labelWid = parseInt(liFirst.width() - liFirst.find('span').outerWidth(true) * 3 , 10);
				userList.find('span').css({'left':liFirst.width()-15+'px'});
				userList.find('label').css('width',labelWid +'px');
				if(s.length || $('ul.info_list li.p').length || $('ul.info_list li.ad').length){
					userList.find('li.s label,li.p label,li.ad label').css('width',(labelWid - parseInt(s.find('label').css('padding-left'),10) + 'px'));
				}
				if(sp.length){
					sp.find('label').css('width',(labelWid - parseInt(sp.find('label').css('padding-left'),10) + 'px'));
				}
			}
		}
};