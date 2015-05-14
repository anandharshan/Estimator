vmf.ns.use("ice");
VMFModuleLoader.loadModule("resize", function() {});
ice.dividelicensekeys = {
    unKnwErr:null,
	validateKeys:null,
	divLicKeysUrl:null,
	init: function (dLKeysUrl,portURL,vKeys,Err) {
		vmf.scEvent = true;
		callBack.addsc({'f':'riaLinkmy','args':['my-licenses : divide']});
		ice.dividelicensekeys.adjustHt();
        unKnwErr = Err;
		validateKeys = vKeys;
		divLicKeysUrl = dLKeysUrl;
		$("#understand_warning").attr('disabled', false);
		$("#previewConfirm").attr('disabled', true);
		vmf.dom.onload(ice.dividelicensekeys.clearTextFields);
        $('#previewConfirm').click(function () {
			ice.dividelicensekeys.confirmDivide();
        });
        $('#warning_ok').click(function () {
            vmf.modal.hide();
        });
        $('#understand_warning').click(function () {
            if ($('#understand_warning').is(':checked')) {
				if($('#KeyErrorMsg').html() == "" && parseInt($("#remaningCPU").text()) == 0){
					$('#previewConfirm').attr('disabled', false);
					$('#previewConfirm').removeClass('disabled');
				}
            } else {
                $('#previewConfirm').attr('disabled', true);
				$('#previewConfirm').addClass('disabled');
            }
        });
        $('#divideLicenseCancel').click(function () {
            window.location = portURL;
        });
        ice.dividelicensekeys.autoPopulate();
		/*Resizing Panes CR Start*/
		vmf.splitter.show('mySplitter',{
			type: "v",
			sizeLeft:parseInt($("#licenseKeyDetailSection").width(),10),
			resizeToWidth: true,
			outline:true,
			minLeft:parseInt($("#licenseKeyDetailSection").width()*.8,10),
			maxLeft:parseInt(($("#licenseKeyDetailSection").width()+ ($("#previewDivideConfSection").width()*.2)),10),
			barWidth:false
		});

		vmf.splitter.show("centerRight",{
			type: "v",
			sizeRight:parseInt($("#divideRenderSuccess").width(),10),
			resizeToWidth: true,
			outline:true,
			maxRight:parseInt(($("#divideRenderSuccess").width()+($("#previewDivideConfSection").width()*.2)),10),
			minRight:parseInt($("#divideRenderSuccess").width()*.8,10),
			barWidth:false
		});
		/*Resizing Panes CR End*/	
    },
    clearTextFields: function () {
        $("input:text").each(function () {
            $(this).val('');
        });
    },
    computeTotal: function () {
		$('#KeyErrorMsg').html('');
		var _total = 0;
        $("input:text").each(function () {
			if(!isNaN($(this).val())){
				if ($(this).val().length > 0) {
					var value = parseInt($(this).val());
					if(value > 0){
						_total = parseInt(_total + value);
					}else{
						$('#KeyErrorMsg').html(ice.globalVars.keyErrMsg);
					}
				}
			}else{
				$('#KeyErrorMsg').html(ice.globalVars.enterNumericMsg);
			}
        });
        var _maxCPU = parseInt($('#totcount').text());
		if(_maxCPU != _total){
			if($('#KeyErrorMsg').html() == ""){
				$('#KeyErrorMsg').html(ice.globalVars.shouldBeEqualMsg);
				$('#previewConfirm').attr('disabled', true);
				$('#previewConfirm').addClass('disabled');
				$('#understand_warning').attr('checked', false);
			}
		}
        _remaningCPU = _maxCPU - _total;
        if (_remaningCPU < 0) {
            _remaningCPU = 0;
        }
        $('#remaningCPU').replaceWith('<span id="remaningCPU">' + _remaningCPU + '</span>');
    },
    registerInputChange: function() {
        $('#newKeys,li,input').blur(function () {
			ice.dividelicensekeys.computeTotal();
        });
    },
    autoPopulate: function() {
        $("#totCPU").text($('#totcount').text());
		$("#remaningCPU").text($('#totcount').text());
		var tot_cpus = $('#totCPU').text();		
		if(tot_cpus != ''){
			var selval = $('#sel_howMany').val();
			$newKeys = $('#newKeys');			
			ice.dividelicensekeys.populatelists(selval,tot_cpus);
			$('#sel_howMany').change(function() {
				$("#remaningCPU").text($('#totcount').text());
				ice.dividelicensekeys.populatelists($(this).val(),tot_cpus);
                ice.dividelicensekeys.registerInputChange();
				ice.dividelicensekeys.computeTotal();
			})									
		}
		ice.dividelicensekeys.computeTotal();
        ice.dividelicensekeys.registerInputChange();		
    },
    populatelists: function(sv,tc){
		if( sv > 0){
				//var diff = sv - $newKeys.find('li').length;
				var dk = Math.floor(tc / sv);
				var mode = tc % sv;
                $newli = $newKeys.find('li:first').clone();
				$newKeys.find('li').remove();
				
                $newKeys.append($newli);
			
				// foreach difference
				for (i=0; i<sv -1; i++){
					
					// Divide with total count
										
					// Need to clone and create new ones
					$newli = $newKeys.find('li:first').clone();
					$newKeys.find('li:first input').val(dk);				
					
					// Get the previous number
					// Look in the html for the second instance of "[" and then the second instance of "]".
					prevLabel = $newKeys.find('li:last label').attr('for');
					prevNo = prevLabel.substring(prevLabel.indexOf("[")+1, prevLabel.indexOf("]"));
					newNo = parseInt(prevNo)+1;
					
					// Simple, just find replace all the instances of [0] in attribute.
					$newli.find('label').attr('for', $newli.find('label').attr('for').replace(/\[0\]/, '['+newNo+']'));
					$newli.find('input').attr('id', $newli.find('input').attr('id').replace(/\[0\]/, '['+newNo+']'));
					$newli.find('input').attr('name', $newli.find('input').attr('name').replace(/\[0\]/, '['+newNo+']'));
					$newli.find('input').attr('value', dk);								
					$newKeys.append($newli); //Put it into the DOM after the last li										
				}
				
				if( mode > 0 ){
					for(i=0; i<mode; i++){
						var iv = $newKeys.find('li input[name="licenseKey['+ i +']"]').val();
						var newv = Number(iv) + 1;
						$newKeys.find('li input[name="licenseKey['+ i +']"]').val(newv);						
					}
				}
			}
	},
    confirmDivide: function () {
        var _isKeysEqual = true;
        var _total = 0;
        $("input:text").each(function () {
            if ($(this).val().length > 0) {
                var _value = parseInt($(this).val());
                _total = parseInt(_total + _value);
            }
        });
        var _maxCPU = parseInt($('#totcount').text());
        if (_maxCPU != _total) {
            _isKeysEqual = false;
        }
        if (_isKeysEqual) {
			$("#previewDivideConfSection").addClass('disabled');
			$("#licenseKeyDetailSection").addClass('disabled');
			$('#previewConfirm, #divideLicenseCancel').attr('disabled', true);
			$('#previewConfirm, #divideLicenseCancel').addClass('disabled');
			$("#understand_warning").attr('disabled', true);
            $('#loading').show();
			$('#loadingImage').show();
            _selHowMany = $('#sel_howMany').val();
            var _getCPUValues = new Array();
            $("input:text").each(function () {
                _getCPUValues.push($(this).val());
            });
            var _divideLicenseKeysUrl = divLicKeysUrl + '&selectedLicenseKeys=' + $('#currentDivideKey').text() + '&newLicenseKeysQuantityList=' + _getCPUValues;
            //riaLink(_divideLicenseKeysUrl);
			$('#loading').html('<span class="loading_small">'+ice.globalVars.loadingLbl+'</span>');
			vmf.ajax.post(_divideLicenseKeysUrl, null, ice.dividelicensekeys.onSuccess, ice.dividelicensekeys.onFail);
        } else {
			$('#loading').show();
            $('#loading, #pleaseConfirm').html('');
            $('#loading').append(validateKeys);
        }
    },
    onSuccess: function (data) {
        var _dataStr = data;
		$('#loading, #pleaseConfirm').html('');
        if (typeof(data)=='undefined' || data == null || data=='') {
            $("#previewDivideConfSection").removeClass('disabled');
			$("#licenseKeyDetailSection").removeClass('disabled');
			$('#previewConfirm, #divideLicenseCancel').attr('disabled', false);
			$('#previewConfirm, #divideLicenseCancel').removeClass('disabled');
			$("#understand_warning").attr('disabled', false);
            $('#loading').append(ice.globalVars.reqErrMsg);
		} else {
			if(jQuery.trim(_dataStr).slice(0,4) == "<div")
			{
				$("#previewDivideConfSection,#licenseKeyDetailSection").find('div.scroll').addClass('disabled');
				$("#divideRenderSuccess")[0].innerHTML = data;
				var old_key_mask = $('#divided_key_id').text();
				$('#currentDivideKey').text('').text(old_key_mask);	
			}
			else
			{
				var _responseData = vmf.json.txtToObj(data);				
				$("#previewDivideConfSection").removeClass('disabled');
				$("#licenseKeyDetailSection").removeClass('disabled');
				$('#previewConfirm, #divideLicenseCancel').attr('disabled', false);
				$('#previewConfirm, #divideLicenseCancel').removeClass('disabled');
				$("#understand_warning").attr('disabled', false);
				$('#pleaseConfirm').append(_responseData.message);				
			}
        }
    },
    
    onFail: function (data) {
        $("#previewDivideConfSection").removeClass('disabled');
		$("#licenseKeyDetailSection").removeClass('disabled');
		$('#previewConfirm, #divideLicenseCancel').attr('disabled', false);
		$('#previewConfirm, #divideLicenseCancel').removeClass('disabled');
		$("#understand_warning").attr('disabled', false);
		$('#showexceptionmessage').html(unKnwErr);
        vmf.modal.show('showexceptionmessage');
    },
	
	adjustHt: function(){
		myvmware.common.adjustPanes();
		var cHeight = ($("#content-section").height() > parseInt($("#content-section").css("min-height")))? parseInt($("#content-section").css("min-height")) : $("#content-section").height();
		var tabArea = $("#content_1").height()+(cHeight-$("#lkstep2").height());
		tabArea = (tabArea>495)? tabArea: 495;
		$("#mySplitter, section.column").height(tabArea+"px");
		var folderHeight = tabArea - $("section.column header").height();
		$("section.column .scroll, .splitter-bar-vertical").height(folderHeight+"px");
	}
};
window.onresize=ice.dividelicensekeys.adjustHt;