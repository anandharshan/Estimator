if (typeof(myvmware) == "undefined")  
	myvmware = {};
dt= null;

myvmware.supportRequestProfile =  {
	deleteProfileDataURL: null,
	createProfileDataURL: null,
	editProfileDataURL: null,
	tabId :null,
	borderRadiusSupported : $('html').hasClass('borderradius'),
	
    init: function(loadProfileDataList,deleteProfileData,createProfileData,editProfileData) {
		myvmware.supportRequestProfile.deleteProfileDataURL=deleteProfileData || loadProfileDataList;
		myvmware.supportRequestProfile.createProfileDataURL=createProfileData || loadProfileDataList;
		myvmware.supportRequestProfile.editProfileDataURL=editProfileData || loadProfileDataList;
		vmf.datatable.build($('#supportProfileDataList'),{
			"aoColumns": [
			              {"sTitle":"","sClass": "center"},
			              {"sTitle": "<span class='descending'>Profile Type</span>", "sClass": "left"},
			              {"sTitle": "<span class='descending' >Product Name</span>", "sClass": "left"},
			              {"sTitle": "<span class='descending' >Attribute Name</span>", "sClass": "left"},
			              {"sTitle": "<span class='descending' >Attribute Value</span>", "sClass": "left"},
			              {"sTitle":"","sClass": "center","bSortable":false},
			              {"sTitle":"","sClass": "center","bSortable":false}
			             ],
			"aoColumnDefs": [ 
                        { "bSearchable": false, "bVisible": false, "aTargets": [ 0 ] },
						{"fnRender": function ( oObj ) {return "<button type='button' class='button secondary edit' data-vmf-modal='editContent'>Edit</button>"},"aTargets": [5]},
						{"fnRender": function ( oObj ) {return "<button type='button' class='button secondary delete' data-vmf-modal='deleteContent' >X</button>"},"aTargets": [6]}], 
			"iDisplayLength": 10,
			"bRetrive" : true,
			"bInfo":true,
			"sDom": '<"top"lpi<"clear">>rt<"bottom"lpi<"clear">>',
			"bProcessing": true, //Display processing text while fetching from server
			"bServerSide": true,   //Get the data from server all the time
			"sAjaxSource": loadProfileDataList,
			"aaSorting": [[ 1, 'asc' ]],
			"bFilter":false, //Search option
			"fnDrawCallback": function(){ $(this.fnGetNodes()).addClass("clickable");},
			"fnInitComplete": function (){
									dt=this;
									myvmware.supportRequestProfile.tabId=dt.attr('id');
									myvmware.supportRequestProfile.bindEvents(myvmware.supportRequestProfile.tabId);
							  },
			"oLanguage": {
				"sLengthMenu": "<label>Items per page</label> _MENU_",
				"sZeroRecords": "Nothing found - sorry",
				"sInfo": "_START_ - _END_ of _TOTAL_ results",
				"sInfoEmpty": "0 - 0 of 0 results",
				"sInfoFiltered": "(filtered from _MAX_ total records)"
			},	
			"bPaginate": true,
			"sPaginationType": "full_numbers"
		});
		//vmf.datatable.wrodwrap($('#tbl2'),1);
		$("#"+myvmware.supportRequestProfile.tabId).css("width","100%");
		//$("#applyfilter").click(function(){
			//vmf.datatable.reload($("#"+myvmware.supportRequestProfile.tabId),'server_processing.php');
			//});
	},//end of init
	
	//Bind Events
	bindEvents:function(tid){
		//Highlighting the Row
		$("#"+tid+" tbody").die('mousedown').live('mousedown',myvmware.supportRequestProfile.highlightRow);
		
		//Adding Action to Delete button
		$("#"+tid+" button.delete").die('click').live('click', myvmware.supportRequestProfile.fnOnDeleteRow);
		
		//Add row save action moved to validator plugin
		$("button.primary.saveRow").die('.click').live('click', myvmware.supportRequestProfile.fnOnAddRow);
		
		//Show Modal windows code
		$("#"+tid+" button.edit").die('click').live('click',myvmware.supportRequestProfile.showEditOverlay);
		$("#"+tid+" button.delete").die('click').live('click',myvmware.supportRequestProfile.showDeleteRowOverlay);
		$(".modalContent .fn_cancel").die('click').live('click',myvmware.supportRequestProfile.closeDialog);
		
		//Edit Overlay save event handler moved to validator plugin
		$("#editContent .modalContent button.primary.edit").bind('click', myvmware.supportRequestProfile.fnOnEditSave);
		
		$('#addEntryForm input:text')
			.focus(function(){
				var $this = $(this);
				  
				if($this.val() == $this.attr("aValue")){
					$this.val('');
				}
			})
			.blur(function(){
				var $this = $(this);
				if($this.val() == ''){
					$this.val($this.attr("aValue"));
				}
			});
			
		//Resetting all the input elements
		myvmware.supportRequestProfile.resetAddForm();
	},
	
	highlightRow: function(event){
		event.preventDefault();
		event.stopPropagation();
		$(dt.fnSettings().aoData).each(function (){
			$(this.nTr).removeClass('selected');
		});
		$(event.target).parents('tr').addClass('selected');
	},
	
	resetAddForm: function(){
		$("form#addEntryForm select").val('').attr('selected',true); //Reset select elements
		$.each($("form#addEntryForm input:text"),function(id,ele){
			$(ele).val($(ele).attr("aValue"));
		});

	
	},
	
	showEditOverlay: function(e){
		myvmware.supportRequestProfile.populateEditOverlay();
		myvmware.supportRequestProfile.showDialog(this,true);
		myvmware.dt_validate.validate_editForm();
	},
	
	showDialog:function(that,cFlag){  // Add rule modal popup
		vmf.modal.show($(that).data('vmf-modal'), { checkPosition: true ,close:cFlag});
		if(!myvmware.supportRequestProfile.borderRadiusSupported){
			$('.modalContent .button').corner();
		}
		return false;
	},
	
	closeDialog: function(){
		vmf.modal.hide();
		if(!myvmware.supportRequestProfile.borderRadiusSupported){
			$('.modalContent .button').uncorner();
		}
		return false;
	},
	
	fnOnDeleteRow:function(){
		url=myvmware.supportRequestProfile.deleteProfileDataURL;
		data="action=delete&attributeId="+myvmware.supportRequestProfile.fnGetRowUniqueNumber();
		vmf.ajax.post(url,data,myvmware.supportRequestProfile.fnOnDeleteRowSucess,myvmware.supportRequestProfile.fnOnDeleteRowFailure);
		//myvmware.supportRequestProfile.showDeleteRowOverlay(this);
	},
	
	showDeleteRowOverlay:function(event){
		myvmware.supportRequestProfile.showDialog(this,false);
		myvmware.supportRequestProfile.fnOnDeleteRow();
	},
	
	fnOnDeleteRowSucess:function(sdata){
		if(typeof sdata !=="object"){
			sdata=vmf.json.txtToObj(sdata);
		}
		if(sdata.status=="success"){
			dt.fnDraw()
			myvmware.supportRequestProfile.closeDialog();
		}
	},
	
	fnOnDeleteRowFailure: function(){
		alert("There was an error deleting. Please try again later");
		myvmware.supportRequestProfile.closeDialog();
	},
	
	fnOnAddRow:function() {
			var profileName,productName,attributeName,attributeValue,addUrl,count;
			count=0;
			profileName = $("input[id='addProfileName']").val();
			if(profileName == "" || profileName == "Enter Profile Name"){			
				var parentDiv = $("#errorProfileName");
				parentDiv.html("Required Field");		
				count	= count+1;				
			}else{
				var parentDiv = $("#errorProfileName");
				parentDiv.html("");	
			}
			
			productName = $("input[id='addProductName']").val();
			if(productName == "" || productName == "Enter Product Name"){			
				var parentDiv = $("#errorProductName");
				parentDiv.html("Required Field");		
				count	= count+1;				
			}else{
				var parentDiv = $("#errorProductName");
				parentDiv.html("");	
			}
			
			attributeName = $("input[id='addAttributeName']").val();
			if(attributeName == "" || attributeName == "Enter Attribute Name"){			
				var parentDiv = $("#errorAttributeName");
				parentDiv.html("Required Field");		
				count	= count+1;				
			}else{
				var parentDiv = $("#errorAttributeName");
				parentDiv.html("");	
			}
			
			attributeValue = $("input[id='addAttributeValue']").val();
			if(attributeValue == "" || attributeValue == "Enter Attribute Value"){			
				var parentDiv = $("#errorAttributeValue");
				parentDiv.html("Required Field");		
				count	= count+1;				
			}else{
				var parentDiv = $("#errorAttributeValue");
				parentDiv.html("");	
			}
					
			if(count == 0){
				addUrl=myvmware.supportRequestProfile.createProfileDataURL;
				pData={"action":"addRow","profileName":profileName,"productName":productName,"attributeName":attributeName,"attributeValue":attributeValue};
				vmf.ajax.post(addUrl, pData, function(response){myvmware.supportRequestProfile.fnOnAddRowSuccess(response,pData);}, myvmware.supportRequestProfile.fnOnAddRowFailure);
			}
	},
	
	fnOnAddRowSuccess:function(sdata,pData){
	   if(typeof sdata !=="object"){
			sdata=vmf.json.txtToObj(sdata);
		}
		
		if(sdata && sdata.attributeId){
			//dt.fnAddData( [sdata.dataId, pData.issueType, pData.category, pData.article, pData.contentType, pData.details,"","" ] );			
			dt.fnDraw();
			myvmware.supportRequestProfile.resetAddForm();
			//dt.fnReloadAjax();
			//vmf.datatable.reload(myvmware.supportRequestProfile.tabId,'data.php');
		}
	},
	
	fnOnAddRowFailure:function(){
		alert("Addition failed. Please try again later");
	},
	
	populateEditOverlay:function(){
		var rowArray=myvmware.supportRequestProfile.fnGetRowData();
		$("input[id='editProfileType']").val(rowArray[1]);
		$("input[id='editProductName']").val(rowArray[2]);
		$("input[id='editAttributeName']").val(rowArray[3]);
		$("input[id='editAttributeValue']").val(rowArray[4]);
	},
	
	fnOnEditSave: function(){
		profileType = $("input[id='editProfileType']").val();
		productName = $("input[id='editProductName']").val();
		attributeName = $("input[id='editAttributeName']").val();
		attributeValue = $("input[id='editAttributeValue']").val();
		addUrl=myvmware.supportRequestProfile.editProfileDataURL;
		data="action=edit"+"&attributeName="+ attributeName +"&attributeValue="+attributeValue+"&attributeDetailID="+myvmware.supportRequestProfile.fnGetRowUniqueNumber();
		vmf.ajax.post(addUrl, data, function(sdata){
		  if(typeof sdata !=="object"){
			sdata=vmf.json.txtToObj(sdata);
		  }
			
			if(sdata.status=="success"){
				dt.fnUpdate( [myvmware.supportRequestProfile.fnGetRowUniqueNumber(),profileType,productName,attributeName, attributeValue,"","" ],myvmware.supportRequestProfile.fnGetSelectedPosition(),0);
				dt.fnDraw();
				myvmware.supportRequestProfile.closeDialog();
				if($.data($("form#editForm")[0], 'validator')){
					$.removeData($("#editForm")[0], 'validator');
				}
			} else {
				myvmware.supportRequestProfile.fnOnEditSaveFailure();
			}
		}, myvmware.supportRequestProfile.fnOnEditSaveFailure);
	},
	fnOnEditSaveFailure:function(){
		alert("updation failed");
	},
	
	fnGetSelectedRow: function(){
	
	return myvmware.supportRequestProfile.fnGetSelected(dt);
	},
	
	//Get Selected Row Position
	fnGetSelectedPosition:function(){
		return dt.fnGetPosition(myvmware.supportRequestProfile.fnGetSelectedRow()[0]);
	},
	
	fnGetRowData:function(){
		return dt.fnGetData(myvmware.supportRequestProfile.fnGetSelectedRow()[0]);
	},
	
	//Get Selected Row Unique Number
	fnGetRowUniqueNumber:function(){
		return myvmware.supportRequestProfile.fnGetRowData()[0];
	},
	
	fnGetSelected:function(tabObjLocal){
		var aReturn = new Array();
		var aTrs = tabObjLocal.fnGetNodes();
			 
		for ( var i=0 ; i<aTrs.length ; i++ ){
			if ( $(aTrs[i]).hasClass('selected') ){
				aReturn.push( aTrs[i] );
			}
		}
		return aReturn;
	}

};//end of main 
