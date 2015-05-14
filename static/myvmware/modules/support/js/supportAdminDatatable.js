if (typeof(myvmware) == "undefined")  
	myvmware = {};
dt= null;

myvmware.supportAdmin =  {
	deleteSADataURL: null,
	createSADataURL: null,
	editSADataURL: null,
	tabId :null,
	borderRadiusSupported : $('html').hasClass('borderradius'),
	
    init: function(loadSADataList,deleteSAData,createSAData,editSAData) {
		myvmware.supportAdmin.deleteSADataURL=deleteSAData || loadSADataList;
		myvmware.supportAdmin.createSADataURL=createSAData || loadSADataList;
		myvmware.supportAdmin.editSADataURL=editSAData || loadSADataList;
		vmf.datatable.build($('#supportAdminDataList'),{
			"aoColumns": [{"sTitle":"","sClass": "center"},{"sTitle": "<span class='descending'>Issue Type</span>", "sClass": "left"},{"sTitle": "<span class='descending' >Issue Category Title</span>", "sClass": "left"},
			{"sTitle": "<span class='descending' >Article Title</span>", "sClass": "left"},{"sTitle": "<span class='descending' >Type of Content</span>", "sClass": "left"},{"sTitle": "<span class='descending' >Details</span>","sClass": "left"},{"sTitle": "<span class='descending' >Rank</span>","sClass": "left"},{"sTitle":"","sClass": "center","bSortable":false},{"sTitle":"","sClass": "center","bSortable":false}],
			"aoColumnDefs": [ 
                        { "bSearchable": false, "bVisible": false, "aTargets": [ 0 ] },
						{"fnRender": function ( oObj ) {return "<button type='button' class='button secondary edit' data-vmf-modal='editContent'>Edit</button>"},"aTargets": [7]},
						{"fnRender": function ( oObj ) {return "<button type='button' class='button secondary delete' data-vmf-modal='deleteContent' >X</button>"},"aTargets": [8]}], 
			"iDisplayLength": 10,
			"bRetrive" : true,
			"bInfo":true,
			"sDom": '<"top"lpi<"clear">>rt<"bottom"lpi<"clear">>',
			"bProcessing": true, //Display processing text while fetching from server
			"bServerSide": true,   //Get the data from server all the time
			"sAjaxSource": loadSADataList,
			"aaSorting": [[ 1, 'asc' ]],
			"bFilter":false, //Search option
			"fnDrawCallback": function(){ $(this.fnGetNodes()).addClass("clickable");},
			"fnInitComplete": function (){
									dt=this;
									myvmware.supportAdmin.tabId=dt.attr('id');
									myvmware.supportAdmin.bindEvents(myvmware.supportAdmin.tabId);
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
		$("#"+myvmware.supportAdmin.tabId).css("width","100%");
		//$("#applyfilter").click(function(){
			//vmf.datatable.reload($("#"+myvmware.supportAdmin.tabId),'server_processing.php');
			//});
	},//end of init
	
	//Bind Events
	bindEvents:function(tid){
		//Highlighting the Row
		$("#"+tid+" tbody").die('mousedown').live('mousedown',myvmware.supportAdmin.highlightRow);
		
		//Adding Action to Delete button
		$("#"+tid+" button.delete").die('click').live('click', myvmware.supportAdmin.fnOnDeleteRow);
		
		//Add row save action moved to validator plugin
		$("button.primary.saveRow").die('.click').live('click', myvmware.supportAdmin.fnOnAddRow);
		
		//Show Modal windows code
		$("#"+tid+" button.edit").die('click').live('click',myvmware.supportAdmin.showEditOverlay);
		$("#"+tid+" button.delete").die('click').live('click',myvmware.supportAdmin.showDeleteRowOverlay);
		$(".modalContent .fn_cancel").die('click').live('click',myvmware.supportAdmin.closeDialog);
		
		//Edit Overlay save event handler moved to validator plugin
		$("#editContent .modalContent button.primary.edit").bind('click', myvmware.supportAdmin.fnOnEditSave);
		
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
		myvmware.supportAdmin.resetAddForm();
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
		myvmware.supportAdmin.populateEditOverlay();
		myvmware.supportAdmin.showDialog(this,true);
		myvmware.dt_validate.validate_editForm();
	},
	
	showDialog:function(that,cFlag){  // Add rule modal popup
		vmf.modal.show($(that).data('vmf-modal'), { checkPosition: true ,close:cFlag});
		if(!myvmware.supportAdmin.borderRadiusSupported){
			$('.modalContent .button').corner();
		}
		return false;
	},
	
	closeDialog: function(){
		vmf.modal.hide();
		if(!myvmware.supportAdmin.borderRadiusSupported){
			$('.modalContent .button').uncorner();
		}
		return false;
	},
	
	fnOnDeleteRow:function(){
		url=myvmware.supportAdmin.deleteSADataURL;
		data="action=delete&dataId="+myvmware.supportAdmin.fnGetRowUniqueNumber();
		vmf.ajax.post(url,data,myvmware.supportAdmin.fnOnDeleteRowSucess,myvmware.supportAdmin.fnOnDeleteRowFailure);
		//myvmware.supportAdmin.showDeleteRowOverlay(this);
	},
	
	showDeleteRowOverlay:function(event){
		myvmware.supportAdmin.showDialog(this,false);
		myvmware.supportAdmin.fnOnDeleteRow();
	},
	
	fnOnDeleteRowSucess:function(sdata){
		if(typeof sdata !=="object"){
			sdata=vmf.json.txtToObj(sdata);
		}
		if(sdata.status=="success"){
			dt.fnDraw()
			myvmware.supportAdmin.closeDialog();
		}
	},
	
	fnOnDeleteRowFailure: function(){
		alert("There was an error deleting. Please try again later");
		myvmware.supportAdmin.closeDialog();
	},
	
	fnOnAddRow:function() {
			var issueType, category, article, contentType, details, addUrl, data, count,sortOrder;
			count=0;
			issueType = $("select[id='addIssueType']").val();	
			//ADDED this if conditions as the JQuery Validate functionality was giving some issues.
			if(issueType == ""){			
				var parentDiv = $("#errorIssueType");
				parentDiv.html("Required Field");	
				count	= count+1;
			}else{
				var parentDiv = $("#errorIssueType");
				parentDiv.html("");				
			}
			category = $("input[id='addCategory']").val();
			if(category == "" || category == "Enter Issue Category"){			
				var parentDiv = $("#errorCategory");
				parentDiv.html("Required Field");		
				count	= count+1;				
			}else{
				var parentDiv = $("#errorCategory");
				parentDiv.html("");	
			}
			article = $("input[id='addArticle']").val();
			if(article == "" || article == "Enter Article Title"){			
				var parentDiv = $("#errorArticle");
				parentDiv.html("Required Field");	
				count	= count+1;
			}else{
				var parentDiv = $("#errorArticle");
				parentDiv.html("");	
			}
			contentType = $("select[id='addContentType']").val();
			if(contentType == ""){			
				var parentDiv = $("#errorContentType");
				parentDiv.html("Required Field");	
				count	= count+1;			
			}else{
				var parentDiv = $("#errorContentType");
				parentDiv.html("");	
			}
			details = $("input[id='addDetails']").val();
			if(details == "" || details=="Enter KB Article ID"){			
				var parentDiv = $("#errorDetails");
				parentDiv.html("Required Field");		
				count	= count+1;
			}else{
				var parentDiv = $("#errorDetails");
				parentDiv.html("");	
			}
			sortOrder = $("input[id='addSortOrder']").val();
			if(sortOrder == "" || sortOrder=="Enter Rank"){			
				var parentDiv = $("#errorSortOrder");
				parentDiv.html("Required Field");		
				count	= count+1;
			}else{
				var parentDiv = $("#errorSortOrder");
				parentDiv.html("");	
			}
			
			if(count == 0){
				addUrl=myvmware.supportAdmin.createSADataURL;
				pData={"action":"addRow","issueType":issueType,"category":category,"article":article,"contentType":contentType,"details":details,"sortOrder":sortOrder};
				vmf.ajax.post(addUrl, pData, function(response){myvmware.supportAdmin.fnOnAddRowSuccess(response,pData);}, myvmware.supportAdmin.fnOnAddRowFailure);
			}
	},
	
	fnOnAddRowSuccess:function(sdata,pData){
	   if(typeof sdata !=="object"){
			sdata=vmf.json.txtToObj(sdata);
		}
		
		if(sdata && sdata.dataId){
			//dt.fnAddData( [sdata.dataId, pData.issueType, pData.category, pData.article, pData.contentType, pData.details,"","" ] );			
			dt.fnDraw();
			myvmware.supportAdmin.resetAddForm();
			//dt.fnReloadAjax();
			//vmf.datatable.reload(myvmware.supportAdmin.tabId,'data.php');
		}
	},
	
	fnOnAddRowFailure:function(){
		alert("Addition failed. Please try again later");
	},
	
	populateEditOverlay:function(){
		var rowArray=myvmware.supportAdmin.fnGetRowData();
		$("select[id='editIssueType']").val($.trim(rowArray[1])).attr('selected',true);
		$("input[id='editCategory']").val(rowArray[2]);
		$("input[id='editArticle']").val(rowArray[3]);
		$("select[id='editContentType']").val(rowArray[4]).attr('selected',true);
		$("input[id='editDetails']").val(rowArray[5]);
		$("input[id='editSortOrder']").val(rowArray[6]);
	},
	
	fnOnEditSave: function(){
		issueType = $("select[id='editIssueType']").val();
		category = $("input[id='editCategory']").val();
		article = $("input[id='editArticle']").val();
		contentType = $("select[id='editContentType']").val();
		details = $("input[id='editDetails']").val();
		sortOrder = $("input[id='editSortOrder']").val();
		//For BUG-00022675 start
		if(details.substring("http")){
			details = encodeURIComponent(details); 
		}
		//For BUG-00022675 end
		addUrl=myvmware.supportAdmin.editSADataURL;
		data="action=edit"+"&issueType="+ issueType +"&category="+category+"&article="+article+"&contentType="+contentType+"&details="+details+"&sortOrder="+sortOrder+"&dataId="+myvmware.supportAdmin.fnGetRowUniqueNumber();
		vmf.ajax.post(addUrl, data, function(sdata){
		  if(typeof sdata !=="object"){
			sdata=vmf.json.txtToObj(sdata);
		  }
			
			if(sdata.status=="success"){
				//For BUG-00022675 start
				if(details.substring("http")){
					details = decodeURIComponent(details); 
				}
				//For BUG-00022675 end
				dt.fnUpdate( [myvmware.supportAdmin.fnGetRowUniqueNumber(),issueType, category, article, contentType, details,sortOrder,"","" ],myvmware.supportAdmin.fnGetSelectedPosition(),0);
				dt.fnDraw();
				myvmware.supportAdmin.closeDialog();
				if($.data($("form#editForm")[0], 'validator')){
					$.removeData($("#editForm")[0], 'validator');
				}
			} else {
				myvmware.supportAdmin.fnOnEditSaveFailure();
			}
		}, myvmware.supportAdmin.fnOnEditSaveFailure);
	},
	
	fnOnEditSaveFailure:function(){
		alert("updation failed");
	},
	
	fnGetSelectedRow: function(){
	
	return myvmware.supportAdmin.fnGetSelected(dt);
	},
	
	//Get Selected Row Position
	fnGetSelectedPosition:function(){
		return dt.fnGetPosition(myvmware.supportAdmin.fnGetSelectedRow()[0]);
	},
	
	fnGetRowData:function(){
		return dt.fnGetData(myvmware.supportAdmin.fnGetSelectedRow()[0]);
	},
	
	//Get Selected Row Unique Number
	fnGetRowUniqueNumber:function(){
		return myvmware.supportAdmin.fnGetRowData()[0];
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
