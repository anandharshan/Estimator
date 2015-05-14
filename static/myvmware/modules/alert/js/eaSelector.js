vmf.ns.use("ice");
// constructs the entitlement account selector drop down based on the JSON data
// and attaches the on-change method to the drop down
ice.eaSelector={
		loadEASelector:function(){
			
			var _eaListDropDownHtml='<select name=\''+eaSelectorDropDownId+'\' id=\'';
			_eaListDropDownHtml = _eaListDropDownHtml + eaSelectorDropDownId + '\' ';
			_eaListDropDownHtml = _eaListDropDownHtml + '>';
			var moreThanOne = false;
			
			_eaListDropDownHtml = _eaListDropDownHtml + '<option value=\'0\'>';
			_eaListDropDownHtml = _eaListDropDownHtml + eaSelectorViewAllOption;
			_eaListDropDownHtml = _eaListDropDownHtml + '</option>';
			
			_eaListDropDownHtml = _eaListDropDownHtml + '<option value=\'1\'>';
			_eaListDropDownHtml = _eaListDropDownHtml + eaSelectorGeneralOption;
			_eaListDropDownHtml = _eaListDropDownHtml + '</option>';
			
			if(eaListTextOutput!='error'){
				//var eaListJsonOutput = vmf.json.txtToObj(eaListTextOutput);
				//var json_obj = eval ("(" + eaListTextOutput + ")");
				var eaListJsonOutput = eaListTextOutput;
				
				if(eaListJsonOutput && eaListJsonOutput!='error' && eaListJsonOutput.eaList){
					for(var i=0;i<eaListJsonOutput.eaList.length;i++){
						_eaListDropDownHtml = _eaListDropDownHtml + '<option value=\'';
						_eaListDropDownHtml = _eaListDropDownHtml + eaListJsonOutput.eaList[i].eaNumber;
						_eaListDropDownHtml = _eaListDropDownHtml + '\'';
						/*if(eaListJsonOutput.selectedEANumber==eaListJsonOutput.eaList[i].eaNumber){
							_eaListDropDownHtml = _eaListDropDownHtml + ' selected=\'';
							_eaListDropDownHtml = _eaListDropDownHtml + eaListJsonOutput.selectedEANumber;
							_eaListDropDownHtml = _eaListDropDownHtml + '\' ';
						}*/
						if(eaListJsonOutput.defaultEANumber==eaListJsonOutput.eaList[i].eaNumber){
							_eaListDropDownHtml = _eaListDropDownHtml + ' class=\'textStrong\'';
						}
						_eaListDropDownHtml = _eaListDropDownHtml + '>';
						_eaListDropDownHtml = _eaListDropDownHtml + eaListJsonOutput.eaList[i].eaNumber;
						_eaListDropDownHtml = _eaListDropDownHtml + ' - ';
						_eaListDropDownHtml = _eaListDropDownHtml + eaListJsonOutput.eaList[i].eaName;
						_eaListDropDownHtml = _eaListDropDownHtml + '</option>';
						if(i==1){
							moreThanOne = true;
						}
					}	
					
					
				}
				/*if(moreThanOne){
					_eaListDropDownHtml = _eaListDropDownHtml + '<option value=\'0\'>';
					_eaListDropDownHtml = _eaListDropDownHtml + eaSelectorViewAllOption;
					_eaListDropDownHtml = _eaListDropDownHtml + '</option>';
				}*/
			}
			
			
			_eaListDropDownHtml = _eaListDropDownHtml + '</select>';
			var _eaListDropDownHtmlWithLabel = '<label>'+ eaSelectorLabelTxt +'</label>';
			_eaListDropDownHtmlWithLabel = _eaListDropDownHtmlWithLabel + _eaListDropDownHtml;
			$('#eaSelectorWidgetDiv').html(_eaListDropDownHtmlWithLabel);
		
			$('#' + eaSelectorDropDownId).change(function() {
				ice.eaSelector.setSelectedEAInSession();
			});
		},
		enableEASelectorDropDown:function(){
			$('#' + eaSelectorDropDownId).removeAttr('disabled');
		},
		disableEASelectorDropDown:function(){
			$('#' + eaSelectorDropDownId).attr('disabled','true');
		},
		// set the selected EA in session by hitting the corresponding controller
		setSelectedEAInSession:function(){
		    var _selectedEANumber = $('#' + eaSelectorDropDownId).val();
		    if(_selectedEANumber==0 || _selectedEANumber==1){
		    	//window.location = eaSelectorMyAccountLink;
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
		},
		onSuccess_eaSelectionSave:function(data){
			try{
				if(data==$('#' + eaSelectorDropDownId).val()){
					ice.eaSelector.impl.afterEaSelectorChange_success();
				}else{
					ice.eaSelector.impl.afterEaSelectorChange_error();
				}
			}catch(e){
				// if implementation is not provided be silent
			}
			$('#' + eaSelectorDropDownId).removeAttr('disabled');
		},
		onFail_eaSelectionSave:function(data){
			try{
				ice.eaSelector.impl.afterEaSelectorChange_error();
			}catch(e){
				// 	if implementation is not provided be silent
			}
			$('#' + eaSelectorDropDownId).removeAttr('disabled');
		}
};
