if (typeof epp == "undefined") epp = {};
al = {};
epp.alert =  {
	init: function(){
		al=epp.alert;
		al.buildEstimate();
		al.bindEvents();
        vmf.scEvent =true;
		callBack.addsc({'f':'riaLinkmy','args':[epp.globalVar.pageName]})
	},
	buildEstimate: function(){
		vmf.datatable.build($('#tbl_estimate'),{
			"aoColumns": [
				{"sTitle": epp.globalVar.header_prodName,"sWidth":"770px","bSortable":false},
				{"sTitle": epp.globalVar.header_deploy,"bSortable":false},
				{"sTitle":"",bVisible:false}
			],
			"oLanguage": {
				"sEmptyTable": epp.globalVar.norecords,
				"sProcessing":epp.globalVar.loadingLabel,
				"sLoadingRecords":""
			},
			"sAjaxSource": epp.globalVar.estimateUrl,
			"bServerSide": false,
			"bFilter":false,
			"bInfo":false,
			"bProcessing": true,
			"bAutoWidth": false,
			"bSort": false,
			"bPaginate": false,
			"fnRowCallback": function(nRow,aData,iDisplayIndex){
				var $nRow=$(nRow);
				$nRow.find("td:eq(0)").html('<h4>' + aData[0] + "</h4><div class='proDesc'>"+aData[1]+"</div>");
				$nRow.find("td:eq(1)").html('<input type="text" value="0" class="dInput"/> %').addClass("chBg").data("pId",aData[2]);
				return nRow;
			},
			"fnInitComplete": function (settings){
				$("div.estimate").removeClass("hidden");
			}
		});
	},
	bindEvents: function(){
		$tbl = $("#tbl_estimate");
		$("input.dInput",$tbl).live('keydown focusout keyup', function(event){
			// Allow: backspace, delete, tab, escape, and enter
			if(event.type=="keydown"){
				if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 || 
					 // Allow: Ctrl+A
					(event.keyCode == 65 && event.ctrlKey === true) || 
					 // Allow: home, end, left, right
					(event.keyCode >= 35 && event.keyCode <= 39)) {
						 // let it happen, don't do anything
						 return;
				}
				else {
					// Ensure that it is a number and stop the keypress
					if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
						event.preventDefault(); 
					}   
				}
			} else if(event.type=="focusout"){
				if (!$.trim($(this).val()).length) $(this).val(0);
			} else {
				var total=0,cls="",val=0;
				$.each($(".dInput",$tbl),function(i,v){
					val=(!$.trim($(v).val()).length)?0:$(v).val();
					total+=parseInt(val,10);
				});
				cls=(total>100 || total<0)?"neg":((total==100)?"pos":"");
				if(total==100) al.toggleButton($("#submit"),true);
				else al.toggleButton($("#submit"),false);
				$("#eTotal").html(total+"%").removeClass("neg pos").addClass(cls);
			}
			
		});
		$("#submit").bind('click',function(){
			if($(this).hasClass("disabled")) return;
			$("#confirmMsg").hide();
			var pdata={"selected":al.getParams()}
			vmf.ajax.post(epp.globalVar.submitEstimate,pdata,al.displayConfirmation,al.displayError,
				function(){vmf.loading.hide();},
				null,
				function(){vmf.loading.show()})
		});
		$("#reset").bind('click',function(){
			var inputs= $("input.dInput", $("#tbl_estimate"));
			$.each(inputs,function(i,v){$(v).val(0)});
			$("#eTotal").text('0%').removeClass("pos");
			al.toggleButton($("#submit"),false);
		});
	},
	getParams : function(){
		var inputs= $("input.dInput", $("#tbl_estimate")), param=[]; // All input boxes
		inputs = jQuery.grep(inputs, function(value) { //remove input elements with value 0
			return (parseInt($.trim($(value).val()),10)!= 0);
		});
		$.each(inputs,function(i,v){
			param.push($(v).closest('td').data("pId")+"_"+$(v).val());
		})
		return param.join(',');
	},
	toggleButton: function($this, flag){
		if (flag) $this.removeClass("disabled").removeAttr("disabled");
		else $this.addClass("disabled").attr("disabled",true);
	},
	displayConfirmation: function(data){
		if(data.ERROR_CODE != undefined){
			al.displayError(data);
		}else if(typeof data!="Object"){ 
			data=vmf.json.txtToObj(data);
			if (data.status){
				var rows= $('tr',$("#tbl_estimate")), inputVal=0;
				$.each(rows, function(i,v){
					inputVal=parseInt($.trim($(v).find("input.dInput").val()),10);
					if(inputVal==0){
						$(v).hide();
					} else {
						$(v).find('td:eq(1)').html(inputVal+"%").removeClass("chBg").addClass('right').end().find('td:eq(0) h4').addClass("normal");
					}
				});
				$("#confirmMsg").html(epp.globalVar.thankyouMsg).addClass('reviewConfirm_Msg').removeClass('error').show().focus();
				$("div.proDesc, div.note, div. div.buttonsBottom button, div.alert-box-wrapper").hide();
				$("span#eTotal").removeClass("totalVal pos neg");
				$(".returnLink").removeClass("hidden");
				$("#tbl_estimate").removeClass('fund_details_tbl').addClass('confimEstimate')
			}
		}	
	},
	displayError: function(data){
		$("#confirmMsg").html(epp.globalVar.errorMsg).removeClass('reviewConfirm_Msg').addClass('error').show().focus();
	}
};//End of fund details
