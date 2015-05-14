//Here options need to be an array of strings.
//
//the data passes to value must have a key names "value"
/*
*
*directive example :: <ngd-dynamic-combo-box notesList = 'notesList' placeholder = globalVars.tagPlaceholder configobj = '{customClass: "className"}' value = 'dynabox'></ngd-dynamic-combo-box>
*where placeholder is expecting a  string
*options is expecting a Array of string
*inputvalue is expecting an object with property named "value"
*configobj is a Object.'{customClass: "dynamicSearchBox", maxlength : "100", dropdownCustomClass: "dynamicCBDropDown"}
*customClass: will be applied to the inputbox. So css should be written as #notetag.customClass
*maxlength : specifies the maximum length we can type in input box.
*dropdownCustomClass will be applied to the dropdown list.
*placeholder is the text to be shown when there is no text in the imput box.
*/


;angular.module('dynamicComboBox',[])
		.directive('ngVmcombobox', function(){
			return{
				scope : {
					options : '=',
					ngmodel : '=ngVmModel',
					configobj : '=',
					defaultvalue : '@'
				},
				replace: true,
				transclude: true,
				restrict : 'E',
				link : function(scope, element, attribute){
						//local scope for input box
						//Set the ng-model of inputbox to defaultvalue or ''(empty string)
						scope.locObj = {selected : ''};
						scope.locObj.selected = scope.defaultvalue || '';

						scope.userKeyboardDown = function($event){
							var keycode, inputScopeValue , myselectedItem, allElements,nextElement, prevElement, target, selected;
							keycode = $event.which;
							inputScopeValue = scope.locObj.selected;
							myselectedItem= element.find('li').filter(function() { return angular.element(this).hasClass('hoveroption'); });
							element.addClass("open"); //class added to show the dropdown
							if(keycode == 40) { // down arrows
							    if(myselectedItem.length == 1 ){
							    	nextElement = myselectedItem.next();
							    	if(nextElement.length == 1){
							    		myselectedItem.removeClass("hoveroption");
							    		nextElement.addClass("hoveroption");
							    		target =nextElement.get(0);
							    		target.parentNode.scrollTop = target.offsetTop; //logic for scrolling
							    	}
							    }else if(myselectedItem.length == 0){
							    	allElements = element.find('li');
							    	if(allElements.length > 0 ){
							    		allElements.first().addClass("hoveroption");
							    	}
							    }
							}else if(keycode == 38) { // up arrow
							    if(myselectedItem.length == 1 ){
							    	prevElement = myselectedItem.prev();
							    	if(prevElement.length == 1){
							    		myselectedItem.removeClass("hoveroption");
							    		prevElement.addClass("hoveroption");
							    		target =prevElement.get(0);
							    		target.parentNode.scrollTop = target.offsetTop; //logic for scrolling
							    	}
							    }
							}else if(keycode == 13) { // enter
							    if(myselectedItem.length == 1){

							    	selected = element.find("ul").find("li.hoveroption");
							    	selected.addClass("selectedoption");
							    	element.removeClass("open");
							    	scope.locObj.selected = myselectedItem.text();
					  				scope.ngmodel.value = myselectedItem.text();
							    }
							}else if(keycode == 8){
								inputScopeValue = inputScopeValue.substring(0, inputScopeValue.length - 1); //Hack for last charater is backspaced
								scope.ngmodel.value = inputScopeValue;
							} 
						}

						/*
						*Char code Info :: {0-9 :: 48- 57}, {A-Z :: 65 - 90}, {numpad  a-z:: 96-122 }
						*/
						scope.userKeyboardPress = function($event){
							var keycode = $event.which;
							//console.log("keycode :: " + keycode);
							if( (keycode>=48 && keycode <=57) ||  (keycode>= 65 && keycode <=90) || (keycode>=97 && keycode <=122) || (keycode == 32) ){
								var valviafunction = element.find("input").val();
								scope.ngmodel.value = valviafunction + String.fromCharCode($event.charCode); //Hack for the last character pressed
							}
							//console.log("value after manipulation:: " + scope.ngmodel.value + "-");
						}

						//For setting the selected option when we click or press enter
						scope.selectOption = function(note, $event){
							var currentElement = angular.element($event.currentTarget);
					  		scope.locObj.selected = note;
					  		scope.ngmodel.value = note;
					  		currentElement.parent().children().removeClass("selectedoption hoveroption");
					  		currentElement.addClass("selectedoption hoveroption");
					  		//console.log("the selected value has been set to :" + scope.value);
					  	}

					  	/*
					  	*When we hover on the list elements, 
					  	*first: all the "selectedoption" class is removed 
					  	*then "selectedoption" is added to the li wich has mouse over
					  	*/
					  	scope.userMouseOver = function($event){
					  		angular.element($event.currentTarget).parent().children().removeClass("hoveroption")
					  		angular.element($event.currentTarget).addClass("hoveroption");
					  	}
				},
				template:"<div class=\"btn-group vmComboBox\">" 
							+ "<input type=\"text\" ng-model=\"locObj.selected\" data-toggle=\"dropdown\""
									+ "placeholder =\"{{configobj.placeholder || ''}}\" class=\"vmComboBoxInput form-control {{ configobj.customClass || ''}}\""
									+ "maxlength=\" {{ configobj.maxlength || ''}} \""
									+ "ng-keydown = \"userKeyboardDown($event)\" ng-keypress = \"userKeyboardPress($event)\"></input>"
							+ "<span class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\">"
								+ "<span class=\"caret\"></span>"
								+ "<span class=\"sr-only\">{{globalVars[\"toggleDropdown\"]}}</span>" 
							+ "</span>"
							+ "<ul class=\"dropdown-menu intelliDropDown {{configobj.dropdownCustomClass || ''}}\" role=\"menu\">"
							+ "<li style=\"padding-left:10px;\" ng-click=\"selectOption(note, $event)\""
									+ "ng-mouseover=\"userMouseOver($event)\" ng-repeat=\"note in options | filter: locObj.selected\">{{note}}</li>"
							+ "</ul></div>"
			}
		});