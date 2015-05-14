if (typeof myvmware === "undefined") myvmware = {};

myvmware.elaAdmin =  {
	
	setupRulesContext : "#elaRulesContentContainer",
	catRulesContext : "#matchRulesTableContainer",
	setupProfileContext : "#elaProfileContentContainer",
	
	CONST_OBJ : {
		"perform": {
			"1" : "Yes",
		    "0" :"No"
		},
		"type": {
		  	"1" : "deep",
		  	"0" : "standard"
		}
		/*'rule' : [{'label' : 'Any'}, {'label': 'S'},  {'label': 'W'}],
		'countSymbol' : {
			'lt' : '<',
			'gt' : '>',
			'eq' : '='
		},
		'maxLimit' : 'You have exceeded the max. limit if 3 rules.',
		'deleteRules' : 'You cannot delete all the rules. Atleast one should be present.'*/
	},
	EMPTY_STRING : '',
	profileClickCount : 0,	
	colCount : 1,
	
	/* -------------------------------- Initialization ------------------------------------*/
	init: function() {
		var	that = myvmware.elaAdmin; 
		that.attachEventListeners();
		// Remove Later
		$('.addRule, .deleteRule').removeClass("disabled").removeAttr('disabled');
		
		// TO DO :: Will remove later as the entire object will be available in the JSP itself
	/*	vmf.ajax.post(ela.globalVar.getprofileDetailsUrl,null,function(data) {
			var jdata = ( typeof data === 'object') ? data : vmf.json.txtToObj(data);
			that.populateSetupProfile(jdata);
		});*/				
	},
	
	/* -------------------------------- Add Listener for all the elements ------------------------------------*/
	attachEventListeners : function() {
		var	that = myvmware.elaAdmin;
	
		$('#adminTab').click(function(){
			if(that.profileClickCount === 0){
				$('.profileBasedDD').val(ela.globalVar.elaProfileId);
				that.populateProfileBasedRuleComponents(ela.globalVar.elaProfileId, true);
			}
			that.profileClickCount = that.profileClickCount+1;
		});
		
		$('#elaAdminContainer .subtabbed_area').each(function() {
			var $this = $(this), content_show;
			if ($this.children('.tabs').length > 0) {
				$this.children('.sub-container-wrapper').hide();
				content_show = $this.children('.tabs').find('.active').attr('title')
				$('#' + content_show).show();
			}
		});

		$("#elaAdminContainer .subtabbed_area a.tab").click(function() {
			$('#elaAdminContainer .sub-container-wrapper').hide();
			$this = $(this);
			$this.parents('.tabs:eq(0)').find(".active").removeClass("active");
			$this.addClass("active");
			$this.parents('.subtabbed_area:eq(0)').children(".sub-container-wrapper").hide();
			var content_show = $(this).attr("title");
			$("#" + content_show).show();
			return false;
		});
		
		$('#profileTab').click(function(){
			vmf.ajax.post(elaAdmin.globalVar.getprofileDetailsUrl,null,function(data) {
				var jdata = ( typeof data === 'object') ? data : vmf.json.txtToObj(data);
				that.populateSetupProfile(jdata);
			});
		});

		$('.sfdcProfileSelection', that.setupProfileContext).change(function(){
			$('.xElaRAteProfileSelection', that.setupProfileContext).val($(this).val());
		});
		
		$('.saveProfileResults', that.setupProfileContext).die().live('click',function(){
			var postData = {
				"sfdcProfile":$('.sfdcProfileSelection option:selected').text(),
				"xelarateProfileId":$('.xElaRAteProfileSelection option:selected').val()
			}
			vmf.modal.show('profileModelWindow');
			vmf.ajax.post(elaAdmin.globalVar.saveprofileDetailsUrl, postData, function(data) {
				var jdata = ( typeof data === 'object') ? data : vmf.json.txtToObj(data);
				if(jdata.status === 1){
					$('.sfdcProfileSelection option:selected', that.setupProfileContext).val($('.xElaRAteProfileSelection', that.setupProfileContext).val());
					var $cont = $('#profileModelWindow');
					$cont.find('.loading_big').hide();
					$cont.find('#statusMsgProfileWindow').show();
					$('#profileModelWindow').find('.close').die().live('click', function(){
						vmf.modal.hide();
					});
				}
			});
		});
		
		/*$('.addRule').die().live('click',function(){
			that.showHideErrorMessage();
			that.addCategoryRules('.matchRulesTable', 'ADDRULE');
		});*/
		
		/*$('.deleteRule').die().live('click',function(){
			var checkedRules = $('.matchRulesTable', that.catRulesContext).find('.deleteRuleChkBox:checked'),
				$this,
				currentIndex;
			
			that.showHideErrorMessage();
			checkedRules.each(function(){
				if($('.matchRulesTable', that.catRulesContext).find('.ruleHd').length === 1){
					that.showHideErrorMessage(that.CONST_OBJ.deleteRules);
					return;
				}
				$this = $(this);
				currentIndex = $('.matchRulesTable', that.catRulesContext).find('thead th').index($this.parent('.ruleHd'));
				$('.matchRulesTable', that.catRulesContext).find('tr').each(function(){
					$(this).find('th:eq('+ currentIndex + ')').remove();
					$(this).find('td:eq('+ currentIndex + ')').remove();
				})
			});
			// Reorder Rule Numbers
			$('.matchRulesTable', that.catRulesContext).find('.ruleHd').each(function(i,v){
				$(this).find('.ruleNumber').text(i+1);
				$(this).attr('data-ruleid',i+1);
			});		
		});*/
		
		/*$('.matchRulesTable .ruleDD', that.catRulesContext).die().live('change', function(){
			var $this = $(this),
				countS = 0,
				countW = 0,
				currentValue,
				selectDDFlag,
				currIndex = $this.closest('tr').find('td').index($this.parent('td')),	
				$operatorCountEl = $('.matchRulesTable .operatorCount td', that.catRulesContext).eq(currIndex);
			
			$('.matchRulesTable tbody tr').each(function(){
				selectDDFlag = $(this).find('td').eq(currIndex).find('.ruleDD').length > 0 ? true : false;
				if(selectDDFlag){
					currentValue =  $(this).find('td').eq(currIndex).find('.ruleDD').val();
					if(currentValue.toUpperCase() === 'S'){
						countS = countS + 1;
					}else if(currentValue.toUpperCase() === 'W'){
						countW = countW + 1;
					}
				}
				
			});
			//console.log('S:'+ countS + ',' + 'W:' + countW );
			that.updateRuleCount($operatorCountEl, '.countSSymbol', countS);
			that.updateRuleCount($operatorCountEl, '.countWSymbol', countW);
			//console.log($operatorCountEl);
		});
		*/
		$('.matchRulesSaveChanges', that.setupRulesContext).die().live('click',function(){
			that.showHideErrorMessage();
			that.saveMatchRulesResults();
		});
		
		$('.profileBasedDD').change(function(){
			that.populateProfileBasedRuleComponents($('.profileBasedDD').val());
		});		
		
		$('.actionType').change(function(){
			$(this).closest('tr').addClass('changed');
		});
		
	}, 
	
	/*--------------------------------- Populating profile based rule values---------------------------------------------------*/
	populateProfileBasedRuleComponents : function(profile) {
		var rdata = {
			'profile': profile
		};		
		
		vmf.modal.show('loadingWindow',{
			'close' : false,
			'escClose': false
		});			
						
		vmf.ajax.post(elaAdmin.globalVar.getRuleSetComponentsUrl,rdata,function(data) {		
			var	that = myvmware.elaAdmin;		
			var jdata = ( typeof data === 'object') ? data : vmf.json.txtToObj(data);
			if(jdata.ruleSetComponents.ruleComponents !== undefined){
				 $('.quotAssetViewDD').val(jdata.ruleSetComponents.ruleComponents.dashboardView);
				 $('.profileBasedDD').val(jdata.ruleSetComponents.ruleComponents.profileId);
				 var rules = jdata.ruleSetComponents.ruleComponents.ruleDetailsList;				 
				 $('.rules').each(function(){
					if (rules !== undefined) {
						for (var i = 0; i < rules.length; i++) {
							var colName = rules[i];
							var trId = $(this).closest('tr').attr('data-id');
							if($(this).closest('tr').attr('data-id') == rules[i].ruleId){
								$(this).siblings().find('.matchRulesPerform').val(rules[i].perform);
								$(this).siblings().find('.matchRulesType').val(rules[i].type);
							}
						}						
					}					
				 });				 		 
			}
			vmf.modal.hide();
		});
		
	},
	
	/* -------------------------------- Showing/Hiding Error Message on the page ------------------------------------*/
	showHideErrorMessage : function(msg, el) {
		if(!msg){
			$('.errorMessage').hide();
		}else{
			$('.errorMessage').show().html(msg);
			$(window).scrollTop(0);
		}
	},
	
	/* -------------------------------- Create Markup from template and Object  ------------------------------------*/
	createOptionMarkup : function(obj, flag) {
		var i,
			holder = [];
			if(flag){
				//holder.push('<option value="3"> None </option>');
			}
		for(var i in obj){
			holder.push('<option value="'+obj[i].bizGrpId + '">'+ obj[i].profileValue + '</option>');
		}
		return holder.join('');
	},
	
	/* -------------------------------- Update Rule Count  ------------------------------------*/
	/*updateRuleCount : function(el, countClass, count){
		var	that = myvmware.elaAdmin;
		if(count > 2){
			el.find(countClass).val(that.CONST_OBJ['countSymbol'].gt)
		}else if(count < 2){
			el.find(countClass).val(that.CONST_OBJ['countSymbol'].lt)
		}else if(count === 2){
			el.find(countClass).val(that.CONST_OBJ['countSymbol'].eq)
		}
	},*/
	
	/* -------------------------------- Create DOM elements like drop down for Setup profiles from JSP Object  ------------------------------------*/
	populateSetupProfile : function(profileObj){
		var	that = myvmware.elaAdmin;
		$('.sfdcProfileSelection', that.setupProfileContext).html(that.createOptionMarkup(profileObj.response.sfdcProfile,false));
		$('.xElaRAteProfileSelection', that.setupProfileContext).html(that.createOptionMarkup(profileObj.response.xELArateProfile,true));
		$('.xElaRAteProfileSelection', that.setupProfileContext).val($('.sfdcProfileSelection').val());
	},
	
	/* -------------------------------- Add Operator and Counts S & W rules  ------------------------------------*/
	/*addOperatorAndCounts : function(tableRef, colCount){
		var	that = myvmware.elaAdmin,
			COUNT = 1,
			template = '<label class="ruleOperatorlabel"> Operator</label><select class="ruleOperatorDD '+colCount+'"><option value="0"> And</option><option value="1"> Or</option> </select>' + 
						'<div class="countRow"> <label class="countSLabel"> Count S </label> <input class="countSSymbol" value=">" readonly type="text"/>' +
						'<input class="countSValue" value="2" readonly type="text"/> </div>'+
						'<div class="countRow"> <label class="countWLabel"> Count W </label> <input class="countWSymbol" value=">" readonly type="text"/>' +
						'<input class="countWValue" value="2" readonly type="text"/> </div>';
		return template; 
			
	},*/
	
	/* -------------------------------- Add Cateorization rules  ------------------------------------*/
	/*addCategoryRules : function(tableRef, catObj){
		var	that = myvmware.elaAdmin,
			ruleCount = $(tableRef, that.catRulesContext).find('.ruleHd').length;
		
		if(ruleCount === 4){
			that.showHideErrorMessage(that.CONST_OBJ.maxLimit);
			return;
		}
		
		that.colCount = that.colCount+1;
		
		if(catObj === 'ADDRULE'){ // If adding by clicking AddRule Button
			$(tableRef, that.catRulesContext).find('thead tr').append('<th class="ruleHd" data-ruleId="'+ (ruleCount+1) +'">Rule <span class="ruleNumber">'+  (ruleCount+1) + '</span><input class="deleteRuleChkBox" type="checkbox" value="0"/></th>');
		}else{
			$(tableRef, that.catRulesContext).find('thead tr').append('<th class="ruleHd" data-catId="'+ catObj.catId + '" data-ruleId="'+ (ruleCount+1) +'">Rule <span class="ruleNumber">'+  (ruleCount+1) + '</span><input class="deleteRuleChkBox" type="checkbox" value="0"/></th>');
		}
		
		$(tableRef, that.catRulesContext).find('tbody tr').each(function(){
			var $this = $(this);
			if($this.hasClass('ruleGrp')){ 				
				$this.append('<td class="'+that.colCount+'"><select class="ruleDD"><option value="0"> Any </option><option value="1"> S</option><option value="2"> W</option></select></td>')				
				
			}else{
				if($this.hasClass('operatorCount')){
					$this.append('<td class="operator '+that.colCount+'">' + that.addOperatorAndCounts(tableRef, that.colCount)  +'</td>');
					if(catObj !== 'ADDRULE'){
						$this.find('.operator').eq(catObj.catId-1).find('.ruleOperatorDD').val(catObj.operator);
					}
				}else{
					$this.append('<td></td>');
				}
			}
		});
	},	*/
		
	saveMatchRulesResults : function(){
		var that = myvmware.elaAdmin,
			postData = {},
			matchResultsObj = {
				'profileId' : $('.profileBasedDD', that.setupRulesContext).val(),
				'profileName' : $('.profileBasedDD option:selected').text(),
				'dashboardView' : $('.quotAssetViewDD ', that.setupRulesContext).val(),
				'userId' : "0",
				'ruleDetailsList' : []
			},
			categoryComponents = [],
			$thisTr;
		
		$('.matchRulesTable .changed').each(function(){
			$thisTr = $(this);
			matchResultsObj.ruleDetailsList.push({
				'ruleId' : $thisTr.attr('data-id'), 
				'perform': $thisTr.find('.matchRulesPerform').val(), 
				'type': $thisTr.find('.matchRulesType').val()
			})
		});
		
/*		// Category Rules Object Creation on click of 'save preference' button
		$('.matchRulesTable thead th').each(function(i,v){
			$thisTh = $(this);
			// Check for Rules index for which it has class: 'ruleHd'
			if($thisTh.hasClass('ruleHd')){
				
				var ruleObj = {
					"catId": $thisTh.attr('data-catId') ? $thisTh.attr('data-catId') : null,
	                "categoryStrength": null,
	                "operator": null,
	                "categoryCode": $thisTh.attr('data-ruleid'),
	                "strongCount": null,
	                "weakCount": null,
	                "deleteFlag": false,
	                "categoryRuleGroupMaps": []
				};
			
				//var ruleIndex = $thisTr.attr('data-ruleid');
				//console.log("ruleId: " + i);
				
				$('.matchRulesTable tbody tr').each(function(j,w){
					var $trs = $(this);
					var $ruleDD = $trs.find('td').eq(i).find('.ruleDD');
					if($ruleDD.length > 0){
						ruleObj["categoryRuleGroupMaps"].push({
							"categoryId": $ruleDD.attr('data-categoryId') ? $ruleDD.attr('data-categoryId') : null,
	                        "strength": $ruleDD.val(),
	                        "ruleGrpId": $trs.attr('data-id'),
	                        "catRuleGrpId": $thisTh.attr('data-ruleid')
						})
					}
					
					// operatorCount tr's. ruleOperatorDD selected Value for the corresponsing tds
					if($trs.hasClass('operatorCount')){
						ruleObj["operator"] = $trs.find('td').eq(i).find('.ruleOperatorDD').val();
					}
				});
				
				categoryComponents.push(ruleObj);
			}
			
		});
		
		console.log(categoryComponents);*/
		
		postData['inputRuleDetails'] = vmf.json.objToTxt(matchResultsObj);
		vmf.modal.show('adminModelWindow');
		vmf.ajax.post(elaAdmin.globalVar.updateRuleDetailsUrl,postData,function(data) {
			var jdata = ( typeof data === 'object') ? data : vmf.json.txtToObj(data);
			if(jdata.status == true){
				var $cont = $('#adminModelWindow');
				$cont.find('.loading_big').hide();
				$cont.find('#statusMsgAdminWindow').show();
				$('#adminModelWindow').find('.close').die().live('click', function(){
					vmf.modal.hide();
				});
			}
			
		});
		
	}
	
}; // End of ELA Admin :: xElaRAte
