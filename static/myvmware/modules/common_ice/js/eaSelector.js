vmf.ns.use("ice");
// constructs the entitlement account selector drop down based on the JSON data
// and attaches the on-change method to the drop down
ice.eaSelector={
	loadEASelector:function(){
		var _eaListDropDownHtml='<select id=\'';
		_eaListDropDownHtml = _eaListDropDownHtml + eaSelectorDropDownId + '\' ';
		_eaListDropDownHtml = _eaListDropDownHtml + '>';
		var moreThanOne = false;
		if(eaListTextOutput!='error'){
			var eaListJsonOutput = eaListTextOutput;
			/*BUG-00018733 Start, Cause: Case for one one Entitlement Account for a user was not addressed.
			Solution: Kept condition for checking one account, if so display it as text.
			*/
			if(eaListJsonOutput && eaListJsonOutput!='error' && eaListJsonOutput.eaList){ 
				var arrLength = eaListJsonOutput.eaList.length;
				if(arrLength > 1) {
					moreThanOne = true;
					for(var i=0;i<eaListJsonOutput.eaList.length;i++){
						_eaListDropDownHtml = _eaListDropDownHtml + '<option value=\'';
						_eaListDropDownHtml = _eaListDropDownHtml + eaListJsonOutput.eaList[i].eaNumber;
						_eaListDropDownHtml = _eaListDropDownHtml + '\'';
						if(eaListJsonOutput.selectedEANumber==eaListJsonOutput.eaList[i].eaNumber){
							_eaListDropDownHtml = _eaListDropDownHtml + ' selected=\'';
							_eaListDropDownHtml = _eaListDropDownHtml + eaListJsonOutput.selectedEANumber;
							_eaListDropDownHtml = _eaListDropDownHtml + '\' ';
						}
						if(eaListJsonOutput.defaultEANumber==eaListJsonOutput.eaList[i].eaNumber && eaListJsonOutput.selectedEANumber==eaListJsonOutput.eaList[i].eaNumber){
							_eaListDropDownHtml = _eaListDropDownHtml + ' class=\'defaultEA tick\'';
						} else if(eaListJsonOutput.selectedEANumber==eaListJsonOutput.eaList[i].eaNumber){
							_eaListDropDownHtml = _eaListDropDownHtml + ' class=\'tick\'';
						} else if(eaListJsonOutput.defaultEANumber==eaListJsonOutput.eaList[i].eaNumber){
							_eaListDropDownHtml = _eaListDropDownHtml + ' class=\'defaultEA\'';
						}
						_eaListDropDownHtml = _eaListDropDownHtml + '>';
						_eaListDropDownHtml = _eaListDropDownHtml + eaListJsonOutput.eaList[i].eaNumber;
						_eaListDropDownHtml = _eaListDropDownHtml + ' - ';
						_eaListDropDownHtml = _eaListDropDownHtml + eaListJsonOutput.eaList[i].eaName;
						_eaListDropDownHtml = _eaListDropDownHtml + '</option>';
					}	
				}	
				else if(arrLength == 1){
					_eaListDropDownHtml = '<label id=\'' + eaSelectorDropDownId + '\' style="text-transform:none;"> ';
					_eaListDropDownHtml = _eaListDropDownHtml + eaListJsonOutput.eaList[0].eaNumber + ' - ';
					_eaListDropDownHtml = _eaListDropDownHtml + eaListJsonOutput.eaList[0].eaName + '</label>';
					$('#eaSelectorWidgetDiv label').css('cursor','default');
				}
			}
		}
		if(moreThanOne){
			_eaListDropDownHtml = _eaListDropDownHtml + '</select>';
		}
		var _eaListDropDownHtmlWithLabel = '<label>'+ eaSelectorLabelTxt +'</label>';
		_eaListDropDownHtmlWithLabel = _eaListDropDownHtmlWithLabel + _eaListDropDownHtml;
		$('#eaSelectorWidgetDiv').html(_eaListDropDownHtmlWithLabel);
		//BUG-00018733 End//
		$('#' + eaSelectorDropDownId).change(function() {
			ice.eaSelector.setSelectedEAInSession();
		});
		VMFModuleLoader.loadModule("customDropdown", function(){
			if(vmf.dropdown && $("select#"+eaSelectorDropDownId).length && $("select#"+eaSelectorDropDownId).find("option").length>0){
				vmf.dropdown.build($("select#"+eaSelectorDropDownId), {optionsDisplayNum:10,ellipsisSelectText:false,ellipsisText:'',optionMaxLength:70,inputMaxLength:40,position:"right",onSelect:ice.eaSelector.setSelectedEAInSession,optionsId:"eaDropDownOpts",inputWrapperClass:"eaInputWrapper",spanpadding:true,spanClass:"corner-img-left",optionsClass:"dropdownOpts",shadowClass:"eaBoxShadow"});
				if($("#eaDropDownOpts").length)	myvmware.common.sortEAOptions($("#eaDropDownOpts"),eaListJsonOutput.selectedEANumber);
				
				//BUG-00062879 - Set proper width,left for IE7 and IE8
				var positionOpts = "right"
				var eaSelectorDD = $(".eaSelector .eaInputWrapper")
				
				if($(".ie8 .dropdownOpts.eaBoxShadow").length > 0){
					var ie8EASelector = $(".ie8 .dropdownOpts.eaBoxShadow")
					
					ie8EASelector.css("width","");
					if(positionOpts == "right"){
						var widthDiff = ie8EASelector.width() - eaSelectorDD.outerWidth();
						ie8EASelector.css("left",parseInt(eaSelectorDD.offset().left - widthDiff)+"px");
					}
					else{
						ie8EASelector.css("left",eaSelectorDD.offset().left+"px");
					}
				}
				else if($(".ie7 .dropdownOpts.eaBoxShadow").length > 0){
					var ie7EASelector = $(".ie7 .dropdownOpts.eaBoxShadow")
					ie7EASelector.css("width","");
					if(positionOpts == "right"){
						var widthDiff = ie7EASelector.width() - eaSelectorDD.outerWidth();
						ie7EASelector.css("left",parseInt(eaSelectorDD.offset().left - widthDiff)+"px");
					}
					else{
						ie7EASelector.css("left",eaSelectorDD.offset().left+"px");
					}
				}
				
				
			}
		});	
	},
	enableEASelectorDropDown:function(){$('#' + eaSelectorDropDownId).removeAttr('disabled');},
	disableEASelectorDropDown:function(){$('#' + eaSelectorDropDownId).attr('disabled','true');},
	// set the selected EA in session by hitting the corresponding controller
	setSelectedEAInSession:function(value, text, Index){
		var _selectedEANumber = $('#' + eaSelectorDropDownId).val();
		if(_selectedEANumber==0){
			window.location = eaSelectorMyAccountLink;
		}else{
			var _selectedEAText = $('#' + eaSelectorDropDownId + ' :selected').text();
			var _selectedEANumberRegEx = new RegExp(_selectedEANumber +' - ','g');
			var _selectedEAName = _selectedEAText.replace(_selectedEANumberRegEx,'');
			var _dataObj = {};
			_dataObj[eaNumberSelectedByUserParamName]=_selectedEANumber;
			_dataObj[eaNameSelectedByUserParamName]=_selectedEAName;
			try{
				ice.eaSelector.impl.beforeEaSelectorChange();
			}catch(e){
				// if implementation is not provided be silent
			}
			$('#' + eaSelectorDropDownId).attr('disabled','true');
			vmf.ajax.post(eaSelectorSelectionSaveURL,
					_dataObj, 
					ice.eaSelector.onSuccess_eaSelectionSave, 
					ice.eaSelector.onFail_eaSelectionSave);
		}
		$("a[name='"+value+"']").addClass("tick").siblings().removeClass("tick");
	},
	getSelectedEANumber: function() {
		if($("#eaSelectorDropDown").val().length > 0) {
			return $("#eaSelectorDropDown").val();
		}
		else {
			return $.trim($("#eaSelectorDropDown").text().split('-')[0]);
		}
	},
	onSuccess_eaSelectionSave:function(data){
		try{
			if(data==$('#' + eaSelectorDropDownId).val()){
				ice.eaSelector.impl.afterEaSelectorChange_success();
			}else{
				ice.eaSelector.impl.afterEaSelectorChange_error();
			}
		}catch(e){}// if implementation is not provided be silent
		$('#' + eaSelectorDropDownId).removeAttr('disabled');
	},
	onFail_eaSelectionSave:function(data){
		try{
			ice.eaSelector.impl.afterEaSelectorChange_error();
		}catch(e){}// 	if implementation is not provided be silent
		$('#' + eaSelectorDropDownId).removeAttr('disabled');
	}
};
