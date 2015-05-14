vmf.ns.use("ice");

ice.common = {
    findFolderHandle: function() {
    
	$("#findFolderContent .searchInput").focus(function() {
		$(this).css('color', '#333333');
		if(this.value == this.defaultValue) {
			this.value = '';
		}
		else {
			this.select();
		}
		/*if($.trim(this.value) == '') {
			$(this).next().addClass('sIcon').removeClass('clearSearch');
		}	*/	
	});
    
    $("#btn_cancel12").click(function() {
        $('#folderEngine').hide();
        vmf.modal.hide();
    });
    
    /*$("#findFolderContent .searchInput").keyup(function() {        
		if($(this).val().length > 0) {
            $(this).next().removeClass('sIcon').addClass('clearSearch');
        }
        else {
            $(this).next().addClass('sIcon').removeClass('clearSearch');
        }
    });*/
	$("#findFolderContent .searchInput").blur(function() {
		$(this).css('color', '#999999');
		if($.trim(this.value) == '') {
			this.value = (this.defaultValue ? this.defaultValue : '');
			//$(this).next().addClass('sIcon').removeClass('clearSearch');
		}	
	});
	$("#findFolderContent .searchButton").click(function() {
		var _errorResult = $("<span class='initMsg'></span>");
		//var _defaultVal = $("#findFolderContent .searchInput")[0].defaultValue;
		var _defaultVal = $("#findFolderContent #searchFf").attr('placeholder');
		
		var _searchTerm = $.trim($('#searchFf').val());
		if(_searchTerm == _defaultVal || _searchTerm == '') {
			_errorResult.text($msgFolderEnterSearch); //Change value to point to properties file
			$("#findFolderContent .resultPane ul").empty().append(_errorResult);
			myvmware.common.setAutoScrollWidth('#findFolderContent ul.block');
			return true;
		}
		//var _foundFolderIds = vmf.foldertree.findFolder(_searchTerm);
		
        ice.common.getFoundFolders(_searchTerm);
        
	});
	$('#findFolderContent .searchInput').keypress(function(e){
		  if(e.which == 13){
		   	$("#findFolderContent .searchButton").trigger('click');
		  }
     });
    
    $("#findFolderContent").delegate("input[type=radio]","click", function() {
        if($._currFFRadio != undefined) {
            $._currFFRadio.parent().removeClass('selected');
        }
        $(this).parent().addClass('selected');
        
        $._currFFRadio = $(this);
    });
	
	$("#findFolderContent").delegate(".clearSearch","click", function() {
		var _searchInput = $("#findFolderContent .searchInput");
		var _errorResult = $("<span class='initMsg'></span>");
		_searchInput.val(_searchInput[0].defaultValue);
		_errorResult.text($msgFolderEnterSearch); //Change value to point to properties file
		$("#findFolderContent .resultPane ul").empty().append(_errorResult);
		myvmware.common.setAutoScrollWidth('#findFolderContent ul.block');
		$("#findFolderContent #selectFolder").addClass('disabled');
        $(this).removeClass('clearSearch').addClass('sIcon');
	});
	
	//TO BE Removed after clear search is present in HTML template
	$("#findFolderContent .clearSearch").css("cursor", "pointer");
	
	$("#findFolderContent #selectFolder").click(function() {
		var _selectedFolderElem = $("#findFolderContent input[type=radio]:checked");
		if(_selectedFolderElem.length > 0) {
            var _selFolderObj = _selectedFolderElem.data("folderObj");
			var _selFolderId = _selFolderObj.folderId;
			vmf.modal.hide('findFolderContent');
            var _folderHT = vmf.foldertree.getFolderHashtable();
            if(_folderHT.containsKey(_selFolderId)) {
                vmf.foldertree.preSelectFolder(_selFolderId, true, true);
            }
            else {
                vmf.foldertree.showURFolder(_selFolderId, _selFolderObj, true, true);
            }
		}
        
	});
    
    },
    getFoundFolders: function(searchTerm) {
        if($._ffJQXHR && $._ffJQXHR.readystate != 4){
			$._ffJQXHR.abort();
		}
        
        var _inputSearch = new Object();
        _inputSearch['folderName'] = searchTerm;
        
        var _ffJQXHR = $.ajax({
			type: 'POST',
			url: $findFolderUrl,
            //url: "/sample/findfolder1.json",
			async: true,
			dataType: "json",
            data: _inputSearch,
			success: function (foundFolderList) {
                var _validate = new Object();
				ice.common.validateFFList(foundFolderList, _validate, searchTerm);
                if(_validate.result) {
                    ice.common.populateFFList(foundFolderList);
                }
			},
			error: function (response, errorDesc, errorThrown) {
                ice.common.showError(errorThrown, null);
			},
			beforeSend: function() {
				//TODO
			},
			complete: function(jqXHR, settings) {
				//TODO
			},
			timeout: $.opts.ajaxTimeout
		});
    },
    validateFFList: function(ffList, validate, searchTerm) {
		$("#findFolderContent #selectFolder").addClass('disabled');
        if(ffList == null || ffList == undefined || 
                ffList.findFolderWithPathList == undefined || 
                ffList.findFolderWithPathList == null) {
            ice.common.showError((typeof ice.globalVars.noMatchFilter != "undefined" ) ? ice.globalVars.noMatchFilter : "No matches.  Change the filter and try again.", null);
			myvmware.common.setAutoScrollWidth('#findFolderContent ul.block');
            validate.result = false;
        }
        else if(ffList.error) {
            ice.common.showError(ffList.message, null);
            validate.result = false;
        }
        else if(ffList.findFolderWithPathList.length == 0) {
            ice.common.showError(null, searchTerm);
            validate.result = false;
        }
        else {
            validate.result = true;
        }
    },
    populateFFList: function(ffList) {
		var _folderHT = vmf.foldertree.getFolderHashtable();
		var _bareFolderLi = $("<li><input type=\"radio\" name=\"folderR\"><span></span><span></span></li>");
		$("#findFolderContent #selectFolder").addClass('disabled');
		_bareFolderLi.children().eq(2).addClass("folderPath");
		var _findFolderContent = $("#findFolderContent .resultPane ul");
		_findFolderContent.empty();
        for(var i=0;i<ffList.findFolderWithPathList.length;i++) {
            var _newFolderLi = _bareFolderLi.clone();
			if(ffList.findFolderWithPathList[i].folderAccess == "MANAGE" || ffList.findFolderWithPathList[i].folderAccess == "VIEW") {
                _newFolderLi.children().eq(0).data("folderObj", ffList.findFolderWithPathList[i]);
			}
			else {
				_newFolderLi.attr("title", $msgFolderNoAccess); //properties
				_newFolderLi.children().eq(0).data("folderObj", ffList.findFolderWithPathList[i]).attr("disabled", true);
			}
            _newFolderLi.children().eq(1).text(ffList.findFolderWithPathList[i].folderName);
			_newFolderLi.children().eq(2).text("\\\\"+ffList.findFolderWithPathList[i].fullFolderPath);
			_findFolderContent.append(_newFolderLi);
        }
		
		$('.resultPane ul.block li').unbind('click mouseover mouseout').bind('click mouseover mouseout',function (e) {
			if($(this).hasClass("disabled")) return;
			if(e.type=="mouseover"){
				$(this).addClass('hover'); // Mouseover Background color
			} else if (e.type=="mouseout"){
				$(this).removeClass('hover'); // Remove Mouseover Background color
			} else {
				$('.resultPane ul.block li').removeClass('selected');
				if($(this).hasClass('selected')){
					$(this).removeClass('selected');
					$(this).find('input:radio').attr('checked',false);
				}else{
					$(this).addClass('selected');
					$(this).find('input:radio').attr('checked',true);
				}
				if($('input[type=radio]:checked')){
					$("#findFolderContent #selectFolder").removeClass('disabled');
				}else{
					$("#findFolderContent #selectFolder").addClass('disabled');
				}
			}
		});
		$('ul.block li').find('input:radio').live('click',function(){
			if($('input[type=radio]:checked')){
				$("#findFolderContent #selectFolder").removeClass('disabled');
			}else{
				$("#findFolderContent #selectFolder").addClass('disabled');
			}
		})
		myvmware.common.setAutoScrollWidth(_findFolderContent);
    },
    showError: function(errMsg, searchTerm) {
        var _errorResult = $("<li class='noresult'></li>");
        if(searchTerm != null || searchTerm != undefined) {
            _errorResult.append($msgFolderNoResults.replace(/<searchterm>/, "<strong>\"" + searchTerm + "\"</strong>"));
        }
        else {
            _errorResult.append(errMsg);
        }
        $("#findFolderContent .resultPane ul").empty().append(_errorResult);
    },
	wordwrap : function(id, str, width, brk, cut) { // BUG-00024835
		/*brk = brk || '\n';
		width = width || 75;
		cut = cut || false;
		if (!str) { return str; }
		var regex = '.{1,' +width+ '}(\\s|$)' + (cut ? '|.{' +width+ '}|.+$' : '|\\S+?(\\s|$)');
		var breakingStr = str.match( RegExp(regex, 'g') ).join( brk );*/
		if(id!=''){
			$('#'+id).html(vmf.wordwrap(str,2));
		} else {
			return vmf.wordwrap(str,2);
		}
	}
}