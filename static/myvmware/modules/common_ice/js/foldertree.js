/**
* Folder Tree jQuery Plugin
* Version **** 1.0.3  ****
* Updated: 12/30/2011
* This plugin can take in a list representation of tree structure and produce a folder tree for a subset of tree and attach events to the tree
* @author Praveer Sengaru (psengaru@vmware.com)
*/
(function($){
	/**
	* Function to get Folder JSON using Post Request, the response of this request is a JSON object
	* 
	* @params
	* url: url for which POST request has to be made
	* requestParams: The set of request attribute/value pairs to be sent in the POST request
	* onSuccess: The callback function invoked upon successful execution of JSON POST request
	* onFailure: The callback function invoked upon failed execution of JSON POST request
	* onComplete: The callback function invoked irrespective of whether the execution was success or failure
	* 
	* @return
	* JavaScript object representing folderPane as a Array List of folder information
	* 
	*/
	$.getFolderJSONPost = function (url, requestParams, onSuccess, onFailure, onComplete) {	//Make sure there is no current ongoing request, if yes cancel it
		if($._fjqXHR && $._fjqXHR.readystate != 4){
			$._fjqXHR.abort();
		}
        if($.opts.managePermViewFlag) {
            if(requestParams == null) {
                requestParams = new Object();
            }
            requestParams['managePermView'] = true;
        }
		$._fjqXHR = $.ajax({
			type: 'POST',
			url: url,
			async: true,
			dataType: "json",
			data: requestParams,
			success: function (jsonResponse) {
				$._folderListJSON = jsonResponse;			//Making sure to disable loading
				$("#" + $.opts.uniqueDiv + " ." + $.opts.loadingClass).hide();	//Do validation
				var validationResult = $.opts.validateJSONFunction(jsonResponse);
				if(validationResult != undefined && !validationResult) return false; //foldertree wont be constructed
				if (onSuccess != null) onSuccess(jsonResponse);
			},
			error: function (response, errorDesc, errorThrown) {
                if(errorDesc == "abort") {
                    if(console) {
                        console.log("Ongoing AJAX call aborted");
                    }
                }
				else if (onFailure != null) onFailure(response, errorDesc, errorThrown);
			},
			beforeSend: function() {
				$("#" + $.opts.uniqueDiv + " ." + $.opts.loadingClass).show();
			},
			complete: function(jqXHR, settings) {
				$("#" + $.opts.uniqueDiv + " ." + $.opts.loadingClass).hide();
				if(onComplete != null) onComplete(jqXHR, settings);
			},
			timeout: $.opts.ajaxTimeout
		});
		return $._folderListJSON;
	};
	/**
	* Function to populate the Folder Pane with tree structure
	* 
	* @params
	* folderTreeJSON: The folder tree JavaScript Object
	* 
           * u -  uniqueDiv
           * f -  json response data
           * p -  current parent ul node jquery element
           *
           * Abbreviations used
           * _fn - folder node
           * _fBuf - folder buffer
           *
	*/
	$.populateFolderUI=function (u,f,p){
		$rch = null;
        var _fBuf = null;
        var _skelFN = $('<li><span class="folderNode"></span></li>');
        var bdge = $('<span class="badge asp">ASP</span>');
        /*if(f.folderContents.length == 0) {
            if(console != undefined) {
                console.log("No Folders received in Json response");
            }
        }*/
       if($('#addUsersToFoldersContent3 #folderPane').length) $('#addUsersToFoldersContent3 #folderPane').css('height','auto').css('min-height','auto');
		$(f.folderContents).each(function (idx,v) {
			$._folderHT.put(v.folderId, v);
			_fn = _skelFN.clone().addClass(v.folderId).addClass("folderlist").data({"folderId":v.folderId,"ftype":v.folderType}).attr("level",v.folderLevel-1);
			if(!v.isLeaf && v.folderType!="ROOT"){$('span',_fn).eq(0).prepend($('<a></a>').addClass($.opts.oc));_fn.removeClass('no_child');} 
			if(v.isLeaf && v.folderType!="ROOT"){ _fn.addClass('no_child');} //Add no_child only if it is not a ROOT folder
			//($.opts.inputType == 'checkbox')?$('span', _fn).append('<input type=\"checkbox\">'):$('span', _fn).append('<input type=\"radio\" name=\"foldername\" >');
			if ($.opts.inputType == 'checkbox') $('span', _fn).append('<input type=\"checkbox\">');
			if($.opts.wrapEllipseBtn){
				$('span', _fn).append('<span class=\'folderTxt\'>'+v.folderName+'</span>'); 
			} else {
				$('span', _fn).append(v.folderName);
			}
      		if(v.folderType=="ASP" || v.folderType=="VCE"  || v.folderType=="CPL") {
				  var titleattr="";
				  if($.opts.wrapEllipseBtn){
					$('span.folderNode', _fn).append(bdge.clone().html(v.folderType));
				  } else {
					$('span', _fn).append(bdge.clone().html(v.folderType));
				  }
				  if(v.folderType == "ASP"){$('span', _fn).attr('title',((typeof  $staticTextforASP!="undefined")?$staticTextforASP:""));}
				  if(v.folderType == "VCE"){$('span', _fn).attr('title',((typeof  $staticTextforVCE!="undefined")?$staticTextforVCE:""));}
				  if(v.folderType == "CPL"){$('span', _fn).attr('title',((typeof  $staticTextforCPL!="undefined")?$staticTextforCPL:""));}
				  if ($.opts.inputType == 'checkbox') $('span', _fn).find('input:checkbox').addClass('special ' +v.folderType).data('folderType',v.folderType);
		      }
			if(v.folderAccess == "NONE"){
				//removed disabled attribute to span - It is causing issue in adding events to span in IE
				$(_fn).children().addClass("disabled tooltip").attr('title',(v.folderType!="ROOT")?$.opts.folderDisabledText:$.opts.homeDisabledText);
                $('input', _fn).attr('readonly', true);
            }
			if(v.folderType=='ROOT' && v.folderAccess != "NONE"){
				IsLoggedInUserRootAccess = true;
			}			
			$.opts.cbOnFolderNodeCreate(_fn,v);
			if(v.folderType=="ROOT") {
                if(_fBuf == null) {
                    //_fBuf = $('<ul></ul>');
					_fBuf = ($.opts.inputType == 'checkbox')? $('<ul class="checks"></ul>'):$('<ul class="noRadio"></ul>');
                }
				$('a', _fn).addClass($.opts.op).data('hasdata',true);
				$rch = $("<ul class='top_border'></ul>");
				$(_fn).append($rch);
                _fBuf.append(_fn);
			}
            else if(v.folderLevel == 2 && _fBuf != null) {
				if(v.folderType !="FLEX") // BUG-00025556
					$('ul', _fBuf).append(_fn);
            }
            if(p != undefined) { //When user drills down the folder tree
                if(_fBuf != null) {
                    _fBuf.append(_fn);
                }
                else { //_fBuf is null
                    _fBuf = $('<div></div>');
                    _fBuf.append(_fn);
                }
            }
		});
        if(p == undefined) {
            $('#' + u + ' .folderPane').append(_fBuf);
        }
        else {
            var _urFolder = p.siblings().filter('ul.urFolder'), checked = false;
            p.append(_fBuf.children());
            if(_urFolder.length > 0) {
                $(_urFolder.children()).each(function(ur_idx, ur_v) {
                    _ur_folderId = $(ur_v).data("folderId");
                    if($._folderHT.containsKey(_ur_folderId) 
                            && $._folderHT.get(_ur_folderId).folderIdList == undefined) { //UR Folder is rendered in this child tree
                        if($('input', ur_v).is(':checked')) {
                        	checked = true;
                            $("." + _ur_folderId + " .fWrap", p).addClass("active").find('input').attr('checked', true);
                        }
                        else {
                            $("." + _ur_folderId + " .fWrap", p).find('input').attr('checked', false);
                        }
                        $(ur_v).remove();
                       if(checked) $("." + _ur_folderId, p).find('input').attr('checked', true);
                       checked = false;
                    }
                    else {
                        $._selectedFolders.remove(_ur_folderId);
                        var _fObj = $._folderHT.get(_ur_folderId);
                        $._folderHT.remove(_ur_folderId);
                        if($('input', ur_v).is(':checked')) {
                            $.showURFolder(_ur_folderId, _fObj, false, true);
                        }
                        else {
                            $.showURFolder(_ur_folderId, _fObj, false, false);
                        }
                        $(ur_v).remove();
                    }
                });
            }
        }
		$.opts.checkRootFolderAccess();
		$.opts.loadComplete();//After complete folder tree is loaded this method will be invoked
	};

	/**
	* Function to expand and preselect folder given 'folderId'
	*
	*@params
	*
	*folderId, scrollEnabled
	* folderId - folderId for the folder to be preselected
	* scrollEnabled <boolean> - If this option is set to true and there is a vertical scrollbar for folder pane then the user will be automatically be navigated to the selected folder with given folderId
	*
	*/
	$.expandAndSelectFolder = function(folderId, scrollEnabled, selectEnabled) {
		if($._folderHT.containsKey(folderId)) {
			// clear previous highlights if input type is radio
			if($.opts.inputType == 'radio' && selectEnabled) {
				$('#' + $.opts.uniqueDiv + ' .folderPane').find('span.' + $.opts.folderSelectedClass).removeClass($.opts.folderSelectedClass);
				if($._prevCheckedRadio == null) {
					$._currCheckedRadio = $('#' + $.opts.uniqueDiv + ' .' + folderId).children().filter('span').children().filter('input');
					$._prevCheckedRadio = $._currCheckedRadio;
					$._currCheckedRadio.attr('checked', true);
				}
				else if($._prevCheckedRadio != null || $._prevCheckedRadio != undefined) {
					$._prevCheckedRadio.attr('checked', false);
					$._currCheckedRadio = $('#' + $.opts.uniqueDiv + ' .' + folderId).children().filter('span').children().filter('input');
					$._currCheckedRadio.attr('checked', true);
					$._prevCheckedRadio = $._currCheckedRadio;
				}
                $._selectedFolders.clear();
			}
			else if(selectEnabled) {
				$('#' + $.opts.uniqueDiv + ' .' + folderId).children().filter('span').children().filter('input').attr('checked', true);
			}

            if(selectEnabled) {
                $('#' + $.opts.uniqueDiv + ' .' + folderId).children().filter('span').addClass($.opts.folderSelectedClass);
            }
			if(!($._selectedFolders.containsKey(folderId)) && selectEnabled) {  //If not already selected
				$.opts.cbOnClickFunction(folderId, 'checked');
				$._selectedFolders.put(folderId, true);
				$.opts.cbOnClickSelFoldersFunction($._selectedFolders.keys(), 'checked');
                $.opts.cbOnClickSelFoldersEFunction($._selectedFolders.keys(), folderId, 'checked');
			}
			//Expand all parents if not already expanded
            var _currFolder = $('#' + $.opts.uniqueDiv + ' .' + folderId);
			var _parentsUl = _currFolder.parents('ul');
			$(_parentsUl).each(function(index, value) {
				if(!($(this).is(":visible"))) {
					$(this).show();
					$(this).siblings('ul').show();
					//$(this).siblings().first().find('a').removeClass($.opts.oc);
					$(this).siblings().first().find('a').addClass($.opts.op);
					var _expandedFid = $(this).parent().data('folderId');
					$._expandedFolders.put(_expandedFid, true);
				}
			});

			if(scrollEnabled) {
                var _folderPaneJQElem = $('#' + $.opts.uniqueDiv + ' .folderPane');
                if(_folderPaneJQElem.hasClass('scroll')) {
                    _folderPaneJQElem.scrollTo($('#' + $.opts.uniqueDiv + ' .' + folderId) ,$.opts.slideAnimSpeed, { "axis" : "y" } );
                }
                else {
                    _folderPaneJQElem.closest('.scroll').scrollTo($('#' + $.opts.uniqueDiv + ' .' + folderId) ,$.opts.slideAnimSpeed, { "axis" : "y" } );
                }
			}
			return _currFolder;
		}
		else {
			return null;
		}
	};
    
    
    /**
             * Function to display unrendered folders which are not in browser DOM
             */
    $.showURFolder = function(fId, fObj, invCB, selFlag) {
        var _fFound = false, _curFolderLevel=0;
        var _fPos = 0;
        for(var i=0;i<fObj.folderIdList.length;i++) {
            if($._folderHT.containsKey(fObj.folderIdList[i].toString())) {
                _fFound = true;
                _fPos = i;
                break;
            }
        }
        if(_fFound) {
            var _currFolder = $.expandAndSelectFolder(fObj.folderIdList[_fPos].toString(),false,false); //Expand upto the branch folder
			_curFolderLevel = parseInt(_currFolder.attr("level"),10);
            if(_currFolder != null) {
                //Construct UR Folder
                if($.opts.inputType == 'checkbox') {
                    var _urSkel = $("<li class=\"folderlist\"><span class=\"fWrap folderNode\"><input type=\"checkbox\"><span unselectable=\"on\"></span></span></li>");
                }
                else {
                    var _urSkel = $("<li class=\"folderlist\"><span class=\"fWrap folderNode\"><span unselectable=\"on\"></span></span></li>");
                }
                _urSkel.addClass(fObj.folderId).data("folderId", fObj.folderId).attr("level",_curFolderLevel+1);
                $('span', _urSkel).eq(0).prepend("...  ");
                $('span', _urSkel).eq(1).append(fObj.folderName);
                if(selFlag) {
                    $(_currFolder).parents('ul.noRadio').find('span.folderNode').removeClass('active');
                    $('input', _urSkel).attr('checked', true);
                    $('span', _urSkel).eq(0).addClass("active");
                }
                $._folderHT.put(fObj.folderId, fObj);
                $._selectedFolders.put(fObj.folderId, true);
                //Append UR Folder
                if($('ul', _currFolder).length > 0) {
                    $('ul', _currFolder).append(_urSkel);
                }
                else {
                    var _ulWrap = $("<ul></ul>").addClass('urFolder');
                    $(_currFolder).append(_ulWrap);
                    $('ul', _currFolder).append(_urSkel);
                }
                if(invCB) {
                    $.opts.cbOnClickSelFoldersFunction($._selectedFolders.keys(), 'checked');
                    $.opts.cbOnClickSelFoldersEFunction($._selectedFolders.keys(), fObj.folderId, 'checked');
                    $.opts.cbOnClickFunction(fObj.folderId, 'checked');
                }
            }
			$.attachEvents();
        }
    }
    
	/**Function to attach events to the Folder Pane tree structure
	* @params
	*/
	
	$.attachEvents = function () {
		//To disable folder name selection in IE on double click
		$('#' + $.opts.uniqueDiv + ' .folderPane li > span > span').each(function() {
			$(this).attr('unselectable', 'on');
			$(this).bind('selectstart',function(){ return false; });
		});
		//Attach events for expand and collapse click
		$('#' + $.opts.uniqueDiv + ' .folderPane a.'+$.opts.oc).unbind('click').bind('click', function () {
			$t = $(this);
			$ul = $t.closest('li').children().filter('ul').filter(function(idx) {
                return !($(this).hasClass('urFolder'));
            });
			if ($t.hasClass($.opts.op)) {
                if($ul.length <= $.opts.slideMax) {
                    $ul.slideUp($.opts.slideAnimSpeed);
					myvmware.common.setAutoScrollWidth('div.folderPane ul');
                }
                else {
                    $ul.css('display', 'none');
					myvmware.common.setAutoScrollWidth('div.folderPane ul');
                }
				$t.removeClass($.opts.op);
				//var _spanClass = $(this).parents('li').attr('class').split(' ');
				//$._expandedFolders.remove(_spanClass[0]);
			} 
			else{
				if($t.data("hasdata")){
                    if($ul.length <= $.opts.slideMax) {
                        $ul.slideDown($.opts.slideAnimSpeed,function(){
							myvmware.common.setAutoScrollWidth('div.folderPane ul');	
						});						
                    }
                    else {
                        $ul.css('display', '');
						myvmware.common.setAutoScrollWidth('div.folderPane ul');
                    }
                }else{
					$.getChildData($t);
					//console.log($(this).parent().addClass("no_border"));
				}
				$t.addClass($.opts.op);
				//var _spanClass = $(this).parents('li').attr('class').split(' ');
				//$._expandedFolders.put(_spanClass[0], true);
			}
			//$(this).parent().toggleClass("no_border");
			//$(this).parent().next().toggleClass("top_border"); 
			return false;
		});

		//Disable preselected select-all checkbox
		//$('#' + $.opts.uniqueDiv + ' .select-all').attr('checked', false);/*Commented as part of CR-13272 */
		//Attach event for select all checkbox
		$('#' + $.opts.uniqueDiv + ' .select-all').unbind('click').bind('click',function () {
			//On Select-All - Select all checkboxes except read-only and special folders(ASP, VCE, CPL)
			var allCheckboxes = $('#' + $.opts.uniqueDiv + ' .folderPane').find('input[type=checkbox]:not([readonly])').not('.special'), folderId='';
			if (!$(this).is(':checked')){ //If already checked then uncheck
				$(allCheckboxes).attr('checked', false);
                $._selectedFolders.clear();
				$(allCheckboxes).each(function (index, value) {
					folderId = $(this).closest('li').data('folderId');
					//$.opts.cbOnClickFunction(folderId, 'unchecked');
					$(this).closest('span').removeClass("active");
				});
                $.opts.cbOnClickSelFoldersEFunction($._selectedFolders.keys(), folderId, 'unchecked');
			} 
			else { //otherwise check all checkboxes
				$(allCheckboxes).attr('checked', true);
				$(allCheckboxes).each(function (index, value) {
					folderId = $(this).closest('li').data('folderId');
					if (!($._selectedFolders.containsKey(folderId))) {
						$._selectedFolders.put(folderId, true);
					}
					//$.opts.cbOnClickFunction(folderId, 'checked');
					$(this).closest('span').addClass("active");
				});
                $.opts.cbOnClickSelFoldersEFunction($._selectedFolders.keys(), folderId, 'checked');
			}
		});
		//Binds npMsgFunction as callback when readonly checkbox is clicked
		$('.folderPane input[readonly]').unbind('mousedown click').bind('mousedown click',function (e) {
			//$(this).attr('checked', false);
			e.preventDefault();
			$(this).removeAttr("checked");
			//$.opts.npMsgFunction($.opts.npMsgContent);
		});

		//Binds each non-readonly checkbox with the provided callback function
		/*$('#' + $.opts.uniqueDiv + ' .folderPane').find('input[type=checkbox]:not([readonly])').unbind('click').click(function () {
			var _spanClass = $(this).parents('li').attr('class').split(' ');
			var _checkBoxLength = $('#' + $.opts.uniqueDiv + ' .folderPane').find('input[type=checkbox]:not([readonly])').length;
			var _checkedLength = $('#' + $.opts.uniqueDiv + ' .folderPane').find('input[type=checkbox]:not([readonly]):checked').length;
			if ($(this).attr('checked') != true) { //If unchecked
				$('#' + $.opts.uniqueDiv + ' .select-all').attr('checked',false);
				$._selectedFolders.remove(_spanClass[0]);
				$.opts.cbOnClickSelFoldersFunction($._selectedFolders.keys(), 'unchecked');
                $.opts.cbOnClickSelFoldersEFunction($._selectedFolders.keys(), _spanClass[0], 'unchecked');
				$.opts.cbOnClickFunction(_spanClass[0], 'unchecked');
				$(this).parent().removeClass($.opts.folderSelectedClass);
			} 
			else { //If checked
				if(_checkBoxLength==_checkedLength){
					$('#' + $.opts.uniqueDiv + ' .select-all').attr('checked',true);
				}
				$._selectedFolders.put(_spanClass[0], true);
				$.opts.cbOnClickSelFoldersFunction($._selectedFolders.keys(), 'checked');
                $.opts.cbOnClickSelFoldersEFunction($._selectedFolders.keys(), _spanClass[0], 'checked');
				$.opts.cbOnClickFunction(_spanClass[0], 'checked');
				$(this).parent().addClass($.opts.folderSelectedClass);
			}
		});*/
		var spanEle, cnt, $folderPane=$('#' + $.opts.uniqueDiv + ' .folderPane ul.checks'),folderId=null;
		$folderPane.find('li span.folderNode:not(".disabled")').unbind('click mouseover mouseout').bind('click mouseover mouseout',function (e) {
			//e.stopPropagation();
			//e.preventDefault();
			if($(this).hasClass("disabled")) return;
			if(e.type=="mouseover"){
				$(this).addClass('hover'); // Mouseover Background color
			} else if (e.type=="mouseout"){
				$(this).removeClass('hover'); // Remove Mouseover Background color
			} else {
				target= $(e.target), cnt=true;
				if (target.is("a.openClose")){
					return;
				} else if (target.is("input[type=checkbox]:not([readonly])")){
					spanEle=target.closest("span.folderNode"), $check=$(target);
					checked = target.is(':checked');
				} else {
					spanEle=$(this), $check=$(this).find("input[type=checkbox]:not([readonly])");
					checked = !spanEle.hasClass('active');
				}
				if(checked){
					spanEle.addClass("active");
					//If it is a special folder - Unselect and disable all chcekboxes except same folderType
					if ($check.hasClass('special')){
						$check.closest("ul.checks").find('input:checkbox').removeClass("unselect");
						$check.closest("ul.checks").find('input[type=checkbox]:not([readonly]):not(.'+$check.data("folderType")+')').each(function(){
							$(this).removeAttr('checked').attr('disabled','disabled').addClass("unselect").parent('span').removeClass('active');
							$('#' + $.opts.uniqueDiv + ' .select-all').removeAttr("checked").attr('disabled','disabled').addClass('unselect');
							$._selectedFolders.remove($(this).closest('li').data('folderId'));
						});
					}
					$check.attr("checked","checked");
					folderId=spanEle.closest('li').data("folderId");
					$('input:checkbox:not(".special"):enabled', $folderPane).each(function(){
						if(!$(this).attr("checked"))  cnt=false;
					});
					if (cnt && $('input:checkbox:not(".special"):enabled', $folderPane).length){
						$('#' + $.opts.uniqueDiv + ' .select-all').attr("checked", "checked");
					}
					$._selectedFolders.put(folderId, true); //Selected Folders
					$.opts.cbOnClickSelFoldersFunction($._selectedFolders.keys(), 'checked');
					$.opts.cbOnClickSelFoldersEFunction($._selectedFolders.keys(), folderId, 'checked');
				} else {
					if ($check.hasClass('special') && !$('#folderPane input:checkbox:(".special"):checked').length){
						$check.closest("ul.checks").find('input[type=checkbox]:not([readonly])')
								.removeAttr('disabled').removeClass("unselect");
						$('#' + $.opts.uniqueDiv + ' .select-all').removeAttr("disabled").removeClass('unselect');
					}
					spanEle.removeClass("active");
					$check.removeAttr("checked");
					folderId=spanEle.closest('li').data("folderId");
					$._selectedFolders.remove(folderId);
					$('#' + $.opts.uniqueDiv + ' .select-all').removeAttr("checked");
					$.opts.cbOnClickSelFoldersFunction($._selectedFolders.keys(), 'unchecked');
					$.opts.cbOnClickSelFoldersEFunction($._selectedFolders.keys(), folderId, 'unchecked');
				}
			}
		});

		//Binds each non-readonly radio button with the provided callback function
		$('#' + $.opts.uniqueDiv + ' .folderPane ul.noRadio li.folderlist span.folderNode:not(".disabled")').live('click mouseover mouseout',function (e) {
			//e.preventDefault();
			if(e.type=="mouseover"){
				$(this).addClass('hover');
			} else if (e.type=="mouseout"){
				$(this).removeClass('hover');
			} else {
				if($(this).hasClass('active')){
					return;
				}
				$(this).closest('section').find('span.folderNode').removeClass('active');
				$(this).addClass('active');
				$.opts.cbOnClickFunction($(this).closest('li').data("folderId"), 'checked');
				// clear previous highlights
				/*$('#' + $.opts.uniqueDiv + ' .folderPane').find('span.' + $.opts.folderSelectedClass).removeClass($.opts.folderSelectedClass);
				// highlight current node
				//$(this).parent().addClass($.opts.folderSelectedClass);*/
			}
		});
		var l=0;
		$(".folderPane ul.checks li span.folderNode").each(function(){
			l=parseInt($(this).closest("li").attr("level"),10);
			$(this).css("padding-left",15+((l-1)*18)+"px");
		});
		$(".folderPane ul.noRadio li span.folderNode").each(function(){
			l=$(this).closest("li").attr("level");
			if(l==0){ $(this).css("padding-left",15+"px");}
			else if($(this).find("a.openClose").length) {
				$(this).css("padding-left",15+(l-1)*18+"px");
			} else {
				$(this).css("padding-left",15+l*18+"px");
			}
		});
		myvmware.hoverContent.bindEvents($('.folderPane .tooltip'), 'default');
	};
	$.getChildData = function (obj) {
		pLi = obj.closest('li'); // parent li
        var emsSelectFolderFromTreeURL = $.opts.url;
        if($.opts.requestParams == null) {
            var _postData = new Object();
        }
        else {
            var _postData = $.opts.requestParams;
        }
        _postData['navigatingFolderId'] = pLi.data('folderId');
        if($.opts.managePermViewFlag) {
            _postData['managePermView'] = true;
        }
		$.ajax({
			type: 'POST',
			url: emsSelectFolderFromTreeURL,
			async: true,
			dataType: "json",		
            data: _postData,			
			success: function (jsonResponse) {
				$._folderListJSON = jsonResponse;
				//Making sure to disable loading
				$("#" + $.opts.uniqueDiv + " ." + $.opts.loadingClass).hide();
				//Do validation
				var validationResult = $.opts.validateJSONFunction(jsonResponse);
				if(validationResult != undefined && !validationResult) return false; //foldertree wont be constructed
                obj.data('hasdata',true);
				pObj = $('<ul></ul>');
				pLi.append(pObj);
				$.populateFolderUI($.opts.uniqueDiv, jsonResponse,pObj);
				myvmware.common.setAutoScrollWidth('div.folderPane ul');
				if ($(".folderPane input:checkbox.special:checked").length) pLi.find("ul input:checkbox, ul span.folderNode")
					.filter('input:checkbox').attr("disabled","disabled").end()
					.filter('span').addClass('disabled');
				$.attachEvents();
			},
			error: function (response, errorDesc, errorThrown) {
                if(errorDesc == "abort") {
                    /*if(console) {
                        console.log("Ongoing AJAX call aborted");
                    }*/
                }
                else {
                    $.opts.errorFunction(response, errorDesc, errorThrown);
                    //console.log("In error: " + errorThrown);
                }
			},
			beforeSend: function() {
				$("#" + $.opts.uniqueDiv + " ." + $.opts.loadingClass).show();
			},
			complete: function(jqXHR, settings) {
				$("#" + $.opts.uniqueDiv + " ." + $.opts.loadingClass).hide();
				//if(onComplete != null) onComplete(jqXHR, settings);
				/*CR-13272 Code Changes Start*/
				var chkAll = $('#' + $.opts.uniqueDiv + ' .select-all');
				if(chkAll.length){
					if(chkAll.is(':checked')){
						 pLi.find("ul input:checkbox").attr('checked',true);
						 pLi.find('span.folderNode').addClass('active');
					} else {
						 pLi.find("ul input:checkbox").removeAttr('checked');
						 pLi.find('span.folderNode').removeClass('active');
					}
				}
				/*CR-13272 Code Changes End*/
			},
			timeout: $.opts.ajaxTimeout
		});
	};
	$.renderFolderPane = function (folderListJSON) {
		if(folderListJSON.emptyTree){
			if($("button#exportAllToCsvButton") != null && $("button#exportAllToCsvButton") != 'undefined'){ //BUG-00047200
				$("button#exportAllToCsvButton").hide();
			}
			
			$('#' + $.opts.uniqueDiv + ' .folderPane').append("<div class=\"emptyTree\">"+$.opts.emptyTreemsg+"</div>");
			if($('#selectFolderInfoDiv ul li').length > 0){$('#selectFolderInfoDiv ul li.initmsg').hide();} //BUG-00033285
			return;
		} else {//BUG-00047200
			if($("button#exportAllToCsvButton") != null && $("button#exportAllToCsvButton") != 'undefined'){
				$("button#exportAllToCsvButton").show();
			}
		}
		$.populateFolderUI($.opts.uniqueDiv, folderListJSON);
		myvmware.common.setAutoScrollWidth('div.folderPane ul');
		IsLoggedInUserSUorOU = folderListJSON.superuser;
		$.opts.checkRootFolderPermisssion(folderListJSON);
		if($('#selectFolderInfoDiv ul li').length > 0){$('#selectFolderInfoDiv ul li.initmsg').show();}//BUG-00033285
		$.attachEvents();
	};

	/**
	* Function to find folders from folder tree based upon search term
	* 
	* @params
	* searchTerm : search string as an input to the function
	* 
	* @return
	* Returns array of folder ids matching the given search term for folder name
	*
	*/

	$.findFolder = function(searchTerm) {
		searchTerm = searchTerm.toLowerCase();
		$._findFolderIds = [];
		var _fldCnt = 0;
		$($._folderListJSON.folderContents).each(function (index, value) {
			if(value.folderName.toLowerCase().indexOf(searchTerm) != -1) {
				$._findFolderIds[_fldCnt] = value.folderId;
				_fldCnt = _fldCnt + 1;
			}
		});
		return($._findFolderIds);
	};
    
    /**
	* Function to store the permission value in folder tree Hash table
	* 
	* @params
 	* 
 	*  - folderId
 	* 
	* permission object:
 	*  contains:
 	*  - viewP
	*  - manageP
 	*  - divCombP
 	*  - upgDwgP
	*
	*/
    $.storePermission = function(folderId, permissionObj) {
        var _currFolderObj = $._folderHT.get(folderId);
        if(permissionObj != undefined) {
            if(permissionObj.manage) {
                _currFolderObj.folderAccess = "MANAGE";
            }
            else if(permissionObj.view) {
                _currFolderObj.folderAccess = "VIEW";
            }
            else if(!(permissionObj.view)) {
                _currFolderObj.folderAccess = "NONE";
            }
            _currFolderObj.permission = permissionObj;
            $._folderHT.put(folderId, _currFolderObj);
        }
        /*else {
            if(console != undefined) {
                console.error("permissionObj for function storePerm cannot be undefined");
            }
        }*/
    }
    
    	/**
            * Function to validate the folders from folder tree based upon create and rename
            * 
            * @params
            * curFolderId : curFolderId string as an input to the function
			* curFolderName : foldername string as an input to the function
            * 
	 * @return
	 * Returns true/false, if it is true then the foldername is duplicate
	 *
            */
	$.duplicateFolder = function(curFolderId, curFolderName) {
		/*curFolderName = curFolderName.toLowerCase();
		$._duplicateFolder = false;                
		$($._folderListJSON.folderContents).each(function (index, value) {
				if(value.parentFolderId == curFolderId && value.folderName.toLowerCase() == curFolderName) { // 111==111 && test == test; return true
						$._duplicateFolder = true;                                
				}
		});
		return($._duplicateFolder);*/
        //This code wont work now, TODO need to revise the approach
        return false;
	};
	
	/** $ is an alias to jQuery object */
	$.foldertree = function (options) {
		$.opts = jQuery.extend({
			url: '',
			requestParams: null,
			defaultState: 'onelevelexpand', //Can take 'collapseall', 'expandall' and 'onelevelexpand'
			inputType: 'checkbox',			//Can take 'checkbox' and 'radio'
			uniqueDiv: 'folderDiv',
			collapsible: 'collapsible',
			expandable: 'expandable',
			oc:'openClose',
			op:'open',
			clickable: 'clickable',
			nonclickable: 'nonclickable',
			folderList: 'folderlist',
			ajaxTimeout: 20000,
			folderSelectedClass: 'active',
			filterClass: 'columnFilter',
			loadingClass: 'ajaxLoading',
			expandSelect: true,
			wrapEllipseBtn: false,
            slideMax: 30,
			slideAnimSpeed: 250, 	//Change the sliding (Up/Down) animation speed when folders are expanded and collapsed : lower values means higher speed and vice-versa
            managePermViewFlag: false,
			emptyTreemsg:(typeof emptyTreemsg!="undefined")? emptyTreemsg:"",
			homeDisabledText: (typeof ice.globalVars.homeDisabledText !="undefined") ? ice.globalVars.homeDisabledText : 'See Help for reasons why you cannot view the contents of this folder.',
			folderDisabledText: (typeof ice.globalVars.folderDisabledText != "undefined")?ice.globalVars.folderDisabledText :'Expand to see folders you can access.',
			npMsgFunction: function (msgTxt) {}, //No permission Message callback Function
			npMsgContent: '',		//No permission Message Content
			cbOnFolderNodeCreate: function (folderElem, folderValue) {},		//Callback gets executed when foldertree creates a node before adding it to browser's DOM
			//Argument 1: folder Node's DOM element, Argument 2: folder Node's value which is the equivalent of each entry on folderContents
			// !! Warning please use the above callback cautiously, any intensive operation should be avoided as it may cause severe delay in the foldertree construction !!
			cbOnClickFunction: function (folderID, cbState) {},			//Non readonly checkbox on Click callback function
			cbOnClickSelFoldersFunction: function (selectedFolders, cbState) {}, //Non readonly selected folders on Click callback function, valid only for checkboxes and not radio buttons
            cbOnClickSelFoldersEFunction: function(selectedFolders, folderId, cbState) {}, //Non readonly selected folders on Click callback function, valid only for checkboxes and not radio buttons
			validateJSONFunction: function (folderJSON) {}, //For validating the received JSON response
			errorFunction: function (response, errorDesc, errorThrown) {}, //For handling the error thrown in JSON response
			cbFolderNodeFunction: function() {},
			checkRootFolderPermisssion: function(response) {},
			checkRootFolderAccess: function(response) {},
			loadComplete: function(response){}//For invoking context menu after folder tree is loaded
		}, options);
		
		$._folderHT = new vmf.data.Hashtable();			//Create a Hashtable to store folder associated with each folderId
		$._selectedFolders = new vmf.data.Hashtable();	//Store selected folders
		$._expandedFolders = new vmf.data.Hashtable();	//Store expanded folders
		$._folderListJSON = null;						//Store Folder List JSON
		$._prevCheckedRadio = null;
		$._currCheckedRadio = null;
		$._findFolderIds = new Array();					//Array of found folder ids
        if($._fjqXHR == undefined) {
            $._fjqXHR = null;								//jqXHR object
        }
	};
})(jQuery);

vmf.foldertree = function ($) {
	return {
		build: function (url, config) {
			config = config || {};
            //Comment the following
            //url = '/sample/ft_json10_new.json';
			if(url != undefined || url != "undefined") {
				config.url = url;
			}

			//Pass the config settings
			$.foldertree(config);
			//Clear the Division for folder tree if a previous tree is populated already
			$('#' + config.uniqueDiv + ' .folderPane > ul').remove();
			$('#' + config.uniqueDiv + ' .folderPane > .emptyTree').remove();
			//request for JSON and render the tree
			$.getFolderJSONPost(url, $.opts.requestParams, $.renderFolderPane, $.opts.errorFunction, null);
		},
		reload: function (requestParams) {
			//Empty the existing tree and construct a new tree
			$('#' + $.opts.uniqueDiv + ' .folderPane > ul').remove();
			$.getFolderJSONPost($.opts.url, requestParams, $.renderFolderPane, $.opts.errorFunction, null);
		},
		populate: function (uniqueDiv, folderListJSON) {
			$.populateFolderUI(uniqueDiv, folderListJSON);
			myvmware.common.setAutoScrollWidth('div.folderPane ul');
			$.attachEvents();
		},
		getFolderJSON: function () {
			if ($._folderListJSON != undefined) return $._folderListJSON;
		},
		getFolderHashtable: function () {
			if ($._folderHT != undefined && !($._folderHT.isEmpty())) return $._folderHT;
		},
		getExpandedFolders: function () {
			return $._expandedFolders;
		},
		getSelectedFolders: function () {
			return $._selectedFolders;
		},
		findFolder: function(searchTerm) {
			return $.findFolder(searchTerm);
		},
		preSelectFolder: function(folderId, scrollEnabled, selectEnabled) {
			return $.expandAndSelectFolder(folderId, scrollEnabled, selectEnabled);
		},
        storePermission: function(folderId, permissionObj) {
            return $.storePermission(folderId, permissionObj);
        },
        duplicateFolder: function(curParentFolderId, curFolderName) {
            return $.duplicateFolder(curParentFolderId, curFolderName);
        },  
        showURFolder: function(fId, fObj, invCB, selFlag) {
            return $.showURFolder(fId, fObj, invCB, selFlag);
        }
	};
}(jQuery);

