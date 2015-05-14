/* ########################################################################### *
/* ***** DOCUMENT INFO  ****************************************************** *
/* ########################################################################### *
 * ##### NAME:  manage.js
 * ##### VERSION: v0.1
 * ##### UPDATED: 04/24/2011
/* ########################################################################### */
if (typeof(myvmware) == "undefined")  myvmware = {};
myvmware.manage = {
    init: function() {},
    licenses: function() {
		var dt = null;
		var nTr = null;
		var sOut="";
		$('.folderPane li.folderlist').find('a.clickable').each(function(i, obj){
			link = $(obj);
			link.unbind('click').bind('click',function(e){
				var $self = $(this);
				$self.parent().next().animate({ height: 'toggle', opacity: 'toggle'});
				$self.parent().toggleClass("no_border");
				$self.parent().next().toggleClass("top_border");
				$self.toggleClass("collapsible");
				e.preventDefault();
			});    
		})
		if($('.folderPane li input[type=checkbox]').length > 0){
			$('.folderPane li input[type=checkbox]:checked').parents('span.folderNode').addClass('selectedFolder');
			$('.folderPane li input[type=checkbox]').change(function() { 
				if($(this).is(':checked')){
					$(this).parents('span.folderNode').addClass('selectedFolder');
				}else{
					$(this).parents('span.folderNode').removeClass('selectedFolder ')
				}
			});
		}
		if($('#tbl_license_prod').length >0){
			$('#tbl_license_prod').dataTable( {
				"sScrollY": "200px",
				"bPaginate": false,
				"bFilter":false,
				"sDom": 't',
				"bAutoWidth": false,
				"fnInitComplete": function (){
					$tbl = this;
					var $nTd = $tbl.find('td.dataTables_empty');
					if($nTd.length > 0){
						$tbl.css('height', '100%');
						 $tbl.find('thead').hide();
						$nTd.addClass('noborder').css('height','100%').css('vertical-align','middle');
						$nTd.html('');
						$nTd.html('Please select a folder to view permissions');						
					}
					if(this.closest('div.dataTables_scrollBody')[0] && this.closest('div.dataTables_scrollBody').attr('style').toLowerCase().indexOf('overflow')!=-1)
					{
						this.closest('div').css("overflow-y","scroll");
						setTimeout(function() {$tbl.fnAdjustColumnSizing(false);}, 500);
					}
				}
			});
		}
		
		if($('#tbl_licensedtls').length >0){
			$('#tbl_licensedtls').dataTable( {
				"sScrollY": "337px",
				"bPaginate": false,
				"bFilter":false,
				"sDom": 't',
				"bAutoWidth": false,
				"fnInitComplete": function (){
					dt = this; // datatable object	
					if(this.closest('div.dataTables_scrollBody')[0] && this.closest('div.dataTables_scrollBody').attr('style').toLowerCase().indexOf('overflow')!=-1)
					{
						this.closest('div').css("overflow-y","scroll");
						setTimeout(function() {dt.fnAdjustColumnSizing(false);}, 500);
					}
				}
			});
		};
		if($('#tbl_movelicense').length >0){
			$('#tbl_movelicense').dataTable( {
				"sScrollY": "300px",
				"bPaginate": false,
				"bFilter":false,
				"sDom": 't',
				"bAutoWidth": false,
				"fnInitComplete": function (){
					dt = this; // datatable object	
					if(this.closest('div.dataTables_scrollBody')[0] && this.closest('div.dataTables_scrollBody').attr('style').toLowerCase().indexOf('overflow')!=-1)
					{
						this.closest('div').css("overflow-y","scroll");
						setTimeout(function() {dt.fnAdjustColumnSizing(false);}, 500);
					}
				}
			});
		};
		if($('#tbl_licensedtls_deact').length >0){
			$('#tbl_licensedtls_deact').dataTable( {
				"sScrollY": "300px",
				"bPaginate": false,
				"bFilter":false,
				"sDom": 't',
				"bAutoWidth": false,
				"fnInitComplete": function (){
					dt = this; // datatable object
					$('<tr><td colspan="3"><div class="warning_big"><strong>Attention:</strong><br>You have 2 new vCenter Server 5 Enterprise Plus license keys via an upgrade. You must <a href="#">deactivate the old license keys</a> to remain in compliance.</div></td></tr>').insertBefore(dt.find('tbody tr:first'));	
					if(this.closest('div.dataTables_scrollBody')[0] && this.closest('div.dataTables_scrollBody').attr('style').toLowerCase().indexOf('overflow')!=-1)
					{
						this.closest('div').css("overflow-y","scroll");
						setTimeout(function() {dt.fnAdjustColumnSizing(false);}, 500);
					}
				}
			});
		}
		if($('#tbl_deactivate_select_qty').length >0){
			$('#tbl_deactivate_select_qty').dataTable( {
				"aoColumnDefs": [

				  { 'bSortable': false, 'aTargets': [ 2 ] }
			   ],
				"aoColumns": [{"sWidth":"auto"},{"sWidth":"100px"},{ "sWidth": "107px"}],
				"bPaginate": false,
				"bFilter":false,
				"sDom": 't',
				"bAutoWidth": false,
				"fnInitComplete": function (){
					dt = this; // datatable object	
					if(this.closest('div.dataTables_scrollBody')[0] && this.closest('div.dataTables_scrollBody').attr('style').toLowerCase().indexOf('overflow')!=-1)
					{
						this.closest('div').css("overflow-y","scroll");
						setTimeout(function() {dt.fnAdjustColumnSizing(false);}, 500);
					}
				}
			});
		};
		if($('#tbl_licensedtls_term').length >0){
			$('#tbl_licensedtls_term').dataTable( {
					"aoColumns": [{"sWidth":"240px"},{"sWidth":"50px"},{"sWidth":"50px"},{ "sWidth": "auto"}],
				"sScrollY": "340px",
				"bPaginate": false,
				"bFilter":false,
				"sDom": 't',
				"bAutoWidth": false,
				"fnInitComplete": function (){
					dt = this; // datatable object	
					if(this.closest('div.dataTables_scrollBody')[0] && this.closest('div.dataTables_scrollBody').attr('style').toLowerCase().indexOf('overflow')!=-1)
					{
						this.closest('div').css("overflow-y","scroll");
						setTimeout(function() {dt.fnAdjustColumnSizing(false);}, 500);
					}
				}
			});
		};
		if($('#tbl_prod').length >0){
			$('#tbl_prod').dataTable( {
				"aoColumnDefs": [
						{ "bSortable": false, "aTargets": [ 0,1,2 ] }
				],
				"sScrollY": "200px",
				"bPaginate": false,
				"bFilter":false,
				"sDom": 't',
				"bAutoWidth": false,
				"fnInitComplete": function (){
					$tbl = this;
					var $nTd = $tbl.find('td.dataTables_empty');
					if($nTd.length > 0){
						$nTd.addClass('noborder').css({'vertical-align':'middle'});
						$nTd.html('');
						$nTd.html('Please select a folder to view permissions');
						
					}
					if(this.closest('div.dataTables_scrollBody')[0] && this.closest('div.dataTables_scrollBody').attr('style').toLowerCase().indexOf('overflow')!=-1)
					{
						this.closest('div').css("overflow-y","scroll");
						setTimeout(function() {$tbl.fnAdjustColumnSizing(false);}, 500);
					}
				}
			});
			
		};
		if($('#tbl_deactivate').length >0){
			$('#tbl_deactivate').dataTable( {
				"sScrollY": "336px",
				"bPaginate": false,
				"bFilter":false,
				"sDom": 't',
				"bAutoWidth": false,
				"aoColumns": [{"sWidth":"250px"},{"sWidth":"70px"},{ "sWidth": "auto"}],
				"fnInitComplete": function (){
					dt = this; // datatable object
					$('<tr><td colspan="3"><div class="warning_big"><strong>Attention:</strong><br>You have 2 new vCenter Server 5 Enterprise Plus license keys via an upgrade. You must <a href="#">deactivate the old license keys</a> to remain in compliance. You must complete the current transaction before upgrading more licenses.</div></td></tr>').insertBefore(dt.find('tbody tr:first'));	
					
					if(this.closest('div.dataTables_scrollBody')[0] && this.closest('div.dataTables_scrollBody').attr('style').toLowerCase().indexOf('overflow')!=-1)
					{
						this.closest('div').css("overflow-y","scroll");
						setTimeout(function() {dt.fnAdjustColumnSizing(false);}, 500);
					}
				}
			});
			
		};
		if($('#tbl_upgradelic').length >0){
			$('#tbl_upgradelic').dataTable( {
				"bPaginate": false,
				"bFilter":false,
				"sDom": 't',
				"bAutoWidth": false,
				"aoColumns": [{"sWidth":"250px"},{"sWidth":"65px"},{ "sWidth": "170px"}],
				"aoColumnDefs": [
						{ "bSortable": false, "aTargets": [ 0,1,2 ] }
				]
			});
		};
		if($('#tbl_downgradelic').length >0){
			$('#tbl_downgradelic').dataTable( {
				"bPaginate": false,
				"bFilter":false,
				"sDom": 't',
				"bAutoWidth": false,
				"aoColumns": [{"sWidth":"auto"},{"sWidth":"150px"}]
			});
		};
		if($('#downgrade_order_tbl').length >0){
			$('#downgrade_order_tbl').dataTable( {
				"sScrollY": "600px",
				"bPaginate": false,
				"bFilter":false,
				"sDom": 't',
				"bAutoWidth": false,
				"aoColumns": [{"sWidth":"25px"},{"sWidth":"35px"},{ "sWidth": "180px"},{ "sWidth": "135px"},{ "sWidth": "auto"}],
				"aoColumnDefs": [
						{ "bSortable": false, "aTargets": [ 0,1,4 ] }
				],
				"fnInitComplete": function (){
					dt = this; // datatable object	
					if(this.closest('div.dataTables_scrollBody')[0] && this.closest('div.dataTables_scrollBody').attr('style').toLowerCase().indexOf('overflow')!=-1)
					{
						this.closest('div').css("overflow-y","scroll");
						setTimeout(function() {dt.fnAdjustColumnSizing(false);}, 500);
					}
				}
			});
		};
		
		/*if($('.tbl_deact_select').length > 0){
			$('.tbl_deact_select').dataTable( {
				"bPaginate": false,
				"bFilter":false,
				"sDom": 't',
				"fnDrawCallback": function ( oSettings ) {
						if ( oSettings.aiDisplay.length == 0 )
						{
							return;
						}
						
						var nTrs = $('tbody tr', oSettings.nTable);
						var iColspan = nTrs[0].getElementsByTagName('td').length;
						var sLastGroup = "";
						for ( var i=0 ; i<nTrs.length ; i++ )
						{
							var iDisplayIndex = oSettings._iDisplayStart + i;
							var sGroup = oSettings.aoData[ oSettings.aiDisplay[iDisplayIndex] ]._aData[0];
							if ( sGroup != sLastGroup )
							{
								var nGroup = document.createElement( 'tr' );
								var nCell = document.createElement( 'td' );
								nGroup.className = "row_head";
								nCell.colSpan = iColspan;
								nCell.className = "group";
								var createInnerHtml = '<div class="inneropenCloseSelect wdTwoZero"><a href="#" class="openClose"></a></div><div class="key grey_text">'+ sGroup +'</div>';
								nCell.innerHTML = createInnerHtml;
								nGroup.appendChild( nCell );
								nTrs[i].parentNode.insertBefore( nGroup, nTrs[i] );
								sLastGroup = sGroup;
							}
						}
					},
					"aoColumnDefs": [
						{ "bVisible": false, "aTargets": [ 0 ] },
						{ 'bSortable': false, 'aTargets': [ 3 ] }
					],
					"aaSortingFixed": [[ 0, 'asc' ]],
					"aaSorting": [[ 1, 'asc' ]],
					"fnInitComplete": function (){
						$tbl = this;
						$tbl.find('tr.sub_rows').hide();
						$tbl.find('.inneropenCloseSelect a').each(function(){
							$(this).bind('click',function(e){
								var antag = e.target;
								if($(antag).hasClass('open')){
									$(antag).removeClass('open').closest('tr.row_head').nextUntil('tr.row_head').hide();
								}else{
									$(antag).addClass('open').closest('tr.row_head').nextUntil('tr.row_head').slideDown('slow');
								}
								e.preventDefault();
							});
						});
					}
			});
		};*/
		$("#view tbody td input").hide().attr('checked', false);
		
    	var $kM = $('#keyManagement');
    	// Change the module which is displayed when the drop down value changes.
    	//$kM.find('.content').not('.tooltip .content, #'+$('#sel_wantTo').val()).hide(); // Hide all but the currently selected module in the drop down.
    	//$kM.find('header p').not('.'+$('#sel_wantTo').val()).hide(); // Hide all but the currently selected paragraph.
		var sval = $('#sel_wantTo').val();
		if(sval=='view'){
			$('#btn_next').css({'background':'none','background-color' : '#ccc','cursor':'default'});
			$('#btn_next').attr('disabled','disabled');
			}
		$kM.find('.content').not('#'+$('#sel_wantTo').val()).hide(); // Hide all but the currently selected module in the drop down.
    	$kM.find('header p').not('.'+$('#sel_wantTo').val()).hide(); // Hide all but the currently selected paragraph.
    	
		//$('#sel_wantTo').css("width","auto");
    	$('#sel_wantTo').change(function(){
			sval = $(this).val();
			$("#view").slideUp('fast').slideDown();
			//$kM.find('.content:visible').slideUp('fast',function(){$("#view").slideDown();});
			//$kM.find('header p:visible').slideUp('fast',function(){$('header p.'+sval).slideDown();});
			setInputs()
    	});	
		$('#sel_wantTo').trigger('change');
    	// Open Close Functionality
    	$kM.find('.more-details').hide();
    	$kM.find('.openCloseSelect a').click(function() {
    		$a = $(this);
			$rel = $a.attr('rel');
			nTr = $a.closest('tr')[0];
			
				if ($a.hasClass('open') && nTr.haveData)
				{
					$a.removeClass('open');	
					$(nTr).removeClass('noborder');
					$(nTr).next("tr").hide();
				} 
				else{
					$a.addClass('open');	
					$(nTr).addClass('noborder');
					if(!nTr.haveData){
						dt.fnOpen(nTr,showloading(),'');
						 getSdata($rel);
						 $(nTr).next("tr").addClass('notd_pad');
						nTr.haveData = true;
					}else
						$(nTr).next("tr").show(function(){
							$(nTr).next("tr").addClass('notd_pad');	
						});	
				};
			//$(nTr).slideToggle(function() {}); 
			return false;
    	});
		// For deactivate selected quantity
		var $dM = $('#deact_keymgmt');
		$dM.find('.more-details').hide();
		$dM.find('.openCloseSelect a').click(function() {
    		$a = $(this);
			nTr = $a.closest('tr')[0];
			
				if ($a.hasClass('open') && nTr.haveData)
				{
					$(nTr).removeClass('noborder');
					$(nTr).next("tr").removeClass('notd_pad');
					$a.removeClass('open');	
					$(nTr).next("tr").hide();
				} 
				else{
					$a.addClass('open');
					$(nTr).addClass('noborder');
					if(!nTr.haveData){
						dt.fnOpen(nTr,showloading(),'');
						 getDMdata();
						 $(nTr).next("tr").addClass('notd_pad');
						nTr.haveData = true;
					}else
						$(nTr).next("tr").show(function(){
							$(nTr).next("tr").addClass('notd_pad');		
						});
						
				};
			//$(nTr).slideToggle(function() {}); 
			return false;
    	});
		// Downgrade orders more details
		var $dlMid = $('#downgradelist_id');
		$dlMid.find('.more-details').hide();
		$dlMid.find('.openCloseSelect a').click(function() {
			$a = $(this);
			nTr = $a.closest('tr')[0];
			if ($a.hasClass('open') && nTr.haveData)
			{
				$(nTr).removeClass('noborder');
				$(nTr).next("tr").removeClass('notd_pad');
				$a.removeClass('open');	
				$(nTr).next("tr").hide();
			} 
			else{
				$a.addClass('open');
				$(nTr).addClass('noborder');
				if(!nTr.haveData){
					dt.fnOpen(nTr,showloading(),'');
					 getDLdata();
					 $(nTr).next("tr").addClass('notd_pad');
					nTr.haveData = true;
				}else
					$(nTr).next("tr").show(function(){
						$(nTr).next("tr").addClass('notd_pad');		
					});
					
				};
			//$(nTr).slideToggle(function() {}); 
			return false;
    	});
		function showloading(){
			var sOut="<span class='loading'>Loading.....</span>";
			return sOut;
		};
		function getSdata($rel){
			sOut="";
			sOut +='<div class="more-details" ><div class="note-wrapper clearfix">';
			if($rel == "nonotes"){
				sOut += '<a href="#" style="padding-left:3px;"><strong>Add Notes</strong></a>';
			}else{
			sOut +='<div class="note-header">Notes</div>';
				
			sOut +='<div class="note">Magna aliquam erat volutpat. Ut wisi enim ad minim veniam, qliquam erat volutpat. <br>Ut wisi ad minim veniam, quis nostrud exerci tation ullamcorpeorper suscipit lobortis nisl.<br />Magna aliquam erat volutpat.<a class="edit fn_editNote" href="#"> Edit</a></div>';
			sOut +='</div>';
			}

			sOut +='<div class="divide-table-wrapper support"><table><thead><tr><th class="col1">Support Level</th><th class="col2">Expires</th><th class="col3">Qty</th><th class="col4">Contract Number</th></tr></thead>';
			sOut +='<tbody><tr><td class="col1">Subscription</td><td class="col2">Feb 02, 2011</td><td class="col3">1</td><td class="col4"><a href="#">98765432</a><span class="badge ela">ELA</span></td></tr></tbody></table></div>';
			
			sOut +='<div class="divide-table-wrapper order"><table><thead><tr><th class="col1">Order Number</th><th class="col2">Order Date</th><th class="col3">Qty</th><th class="col4">PO Number</th></tr></thead>';
			sOut +='<tbody><tr><td class="col1"><a href="order_details.php">20098763</a></td><td class="col2">Feb 15, 2011</td><td class="col3">1</td><td class="col4">PO-12345</td></tr></tbody></table></div>';
			sOut +='<div class="divide-table-wrapper viewLicenseKeys"><a href="">View License History</a></div></div>';
			sOut +='</div>';
			$(nTr).next("tr").find("td").html(sOut);
			//return sOut;
		};
		// For deactivate license keys get data on click
		function getDMdata(){
			sOut="";
			sOut = '<table class="inner_moredetails_tbl">';
			sOut += '<tr>';
			sOut += '<td class="key_note">HJ0CN-0AK5M-08K3A-0243P-CXXH5</td><td class="met_note">8 CPUs</td><td><input type="text" name="quantity" size="2" value="3" class="text_right" /></td>';
			sOut += '</tr>';
			sOut += '<tr>';
			sOut += '<td class="key_note">HJ0CN-0AK5M-08K3A-0232P-CXXH5</td><td class="met_note">6 CPUs</td><td><input type="text" name="quantity" size="2" value="4" class="text_right" /></td>';
			sOut += '</tr>';
			sOut += '</table>';
			$(nTr).next("tr").find("td").html(sOut);
			//return sOut;
		};
		// For Downgrade order license
		function getDLdata(){
			sOut="";
			sOut = '<div class="more-details mleftOneZeroTwo" >';
			sOut +='<div class="divide-table-wrapper support"><table><thead><tr><th class="col1">Products</th><th class="col2" style="width:300px;">Quantity</th></tr></thead>';
			sOut +='<tbody>';
			sOut +='<tr><td class="col1">VMware vSphere 5.0 Enterprise Plus</td><td class="col2">10</td></tr>';
			sOut +='<tr><td class="col1">VMware vSphere 5.0 Enterprise</td><td class="col2">5</td></tr>';
			sOut +='<tr><td class="col1">VMware vSphere 5.0 Standard</td><td class="col2">3</td></tr>';
			sOut +='</tbody></table></div>';
			sOut += '</div>';
			$(nTr).next("tr").find("td").html(sOut);
			//return sOut;
		};
		function setInputs(){
			//var val = ice.ui.sval
			$("#view  tbody td input").hide().attr('checked', false);
			$kM.find('#btn_next').attr("style","");
			$("#view table").removeClass('withOpts');
			(sval=='view')?enablebtn(false):enablebtn(true);
			//disabled="disabled"
			 if(sval=='combine' || sval=='move' || sval=='upgrade' || sval=='downgrade'){
				 	$("#view  tbody td input[type=checkbox]").show();
					$("#view table").addClass('withOpts');
			}
			 if(sval=='divide'){
				 $("#view tbody td input[type=radio]").show();
				 $("#view table").addClass('withOpts');
			}	
		};
		function enablebtn(flag){
			if(flag){
				$('#btn_next').removeAttr('disabled');
				$('#btn_next').removeAttr('style');
			}
			else {
				$('#btn_next').css({'background':'none','background-color' : '#ccc','cursor':'default'});
				$('#btn_next').attr('disabled','disabled');
			}
		}
		// More detail notes - Edit, Save, Cancel
		function saveNote(a){ //Save the note using AJAX
			var $this = $(a),
			$textarea = $this.prev('textarea'),
			$note = $this.parent().find('.note'),
			editLink = ' <a class="edit fn_editNote" href="#">Edit</a>',
			addLink =  ' <a class="edit fn_editNote" href="#">Add note</a>',
			newText = '';
			// Get the current text
			newText = $textarea.val();
			if(newText.length>0){
				newText = newText + editLink;	
			}else{
				newText = newText + addLink;	
			}
			$.ajax({
				url: "/index.php", /* URL NEEDS TO BE UPDATED BY DEVELOPERS */
				type: "POST",
				data: {id: 23, updateText : newText}, /* ID needs to be set by developer - most likely using $textarea.attr('id'); Other variables may also be required to be passed */
				success: function(msg){
					 // Remove text area and save btn
					$textarea.remove();
					$this.remove();
					// Update the old text & show the div			
					$note.html(newText);
					$note.show();
				}
			});
		}
		$kM.find('.fn_editNote').live('click', function(){
			var $this = $(this),
				$textArea = $('<textarea class="editText"></textarea>'),
				saveBtn = '<button class="primary saveBtn flowright" style="margin-right: 19px;">Save</button>',
				currentText = '';
			
			// Get the current text
			currentText = $this.parent('.note').html();
			// Remove the edit link
			currentText = currentText.substring(0, currentText.toLowerCase().indexOf('<a'));			
			// Hide the current note
			$this.parent('.note').hide();
			// Create a text area and insert it into the DOM with the current note
			$textArea.val(currentText);
			$this.parent().parent().append($textArea).append(saveBtn);
			$textArea.next().click(function(){
				saveNote(this);
				return false;
			});
			$textArea.bind('keypress', function(e){
				var code = (e.keyCode ? e.keyCode : e.which);
				if(code == 13) { //Enter keycode
				   	saveNote($(this).next('.saveBtn'));
					return false;
				}
			});
			return false;
		});
    	// Disabling and enabling inputs to which are allowed to be changed
    	$kM.find('.openCloseSelect input').change(function() {
    		// Loop through list and confirm things
    		var $lis, folder;
    		$lis = $(this).parents('.content').find('ul li');
    		folder = $(this).parents('.key-wrapper').find('.env').html();
    		
    		// If they are checkboxes, then disable all other folders
    		if($(this).attr('type')=='checkbox' && ( $(this).val() == true || $lis.find('input:checked').length > 0 )){
    			$lis.each(function() {
	    			if( $(this).find('.env').html() != folder ) {
	    				$(this).addClass('disabled');
	    				$(this).find('input').attr('disabled', true);
	    			}
	    		});
    		} else {
    			// Remove all the disabled classes
    			$lis.each(function() {
    				$(this).removeClass('disabled');
    				$(this).find('input').attr('disabled', false);
    			});
    		}
    	});
		if($('input[type=checkbox]#understand_warning').length > 0){
			$('input[type=checkbox]#understand_warning').change(function(){
				if ($('input[type=checkbox]:checked').length)
				{
					$('#btn_confirm').removeClass('disabled');
				}
				else
				{
					$('#btn_confirm').addClass('disabled');
				}

			});
		}
		if($dM.find('div.opneclose_head a.open_close_img').length > 0){
			
			$dM.find('div.openclose_tbl,span.exp_span,table.tbl_deact_select tr.sub_row').hide();
			$dM.find('div.opneclose_head a.open_close_img').click(function(){
				$aLink = this; 
				if($($aLink).hasClass('open')){
					$($aLink).removeClass('open');
					$($aLink).parent('div.opneclose_head').next('div.openclose_tbl').slideUp();
					$($aLink).parent('div.opneclose_head').children('span.exp_span').hide();
					
				}else{
					$($aLink).addClass('open');
					$($aLink).parent('div.opneclose_head').next('div.openclose_tbl').slideDown("slow",function(){
						$($aLink).parent('div.opneclose_head').children('span.exp_span').show();
					});
				}
			});
			if($dM.find('.exp_all').length > 0){
				$dM.find('.exp_all').click(function(){
					$expLink = $(this);
					console.log($expLink);
					if($expLink.hasClass('opened')){
						var $sTr = $($expLink.removeClass('opened').parents('div.opneclose_head').next('div.openclose_tbl').find('tr.sub_row'));
						$expLink.html('').html('Expand All');
						$sTr.prev().removeClass('noborder').find('.inneropenCloseSelect a').removeClass('open');
						$sTr.hide('slow');
					}else{
						var $sTr = $($expLink.addClass('opened').parents('div.opneclose_head').next('div.openclose_tbl').find('tr.sub_row'));
						$expLink.html('').html('Collapse All');
						$sTr.prev().addClass('noborder').find('.inneropenCloseSelect a').addClass('open');
						$sTr.show('slow');
					}
					return false;
				});
			}
			
		}
		if($dM.find('table.tbl_deact_select .inneropenCloseSelect a').length > 0){
			$dM.find('table.tbl_deact_select tr.sub_row').hide();
			$dM.find('table.tbl_deact_select .inneropenCloseSelect a').click(function(e){
				$oLink = $(this);
				if($oLink.hasClass('open')){
					$oLink.removeClass('open').closest('tr.row_head').removeClass('noborder').next('tr.sub_row').hide();
				}else{
					$oLink.addClass('open').closest('tr.row_head').addClass('noborder').next('tr.sub_row').show();
				}
				e.preventDefault();
			});
			$(".tbl_row_sort").each(function(){
				$(".tbl_row_sort").tablesorter({
						headers: { 
							// assign the secound column (we start counting zero) 
							2: { 
								// disable it by setting the property sorter to false 
								sorter: false 
							}
						} 
					}
				);
			});
			if($("table.tbl_deact_select thead.sort_th").length > 0){
				$("table.tbl_deact_select thead.sort_th th").click(function(){
					var $th = $(this);
					var idx = $th.index();
					if($th.hasClass('sorting_desc')){
						var sorting =  [[idx,0]];
						$th.removeClass('sorting_desc');
						$th.addClass('sorting_asc');
						$(".tbl_row_sort").each(function(){
							$(".tbl_row_sort").trigger("sorton",[sorting]);						
						});
					}else{
						var sorting =  [[idx,1]];
						$th.removeClass('sorting_asc');
						$th.addClass('sorting_desc');
						$(".tbl_row_sort").each(function(){
							$(".tbl_row_sort").trigger("sorton",[sorting]);						
						});
					}
					return false;
				});
			}
		}
		// Select All functionality
		$('#dl_selectall').click(function() {
			if($(this).attr('checked') == true){
				$(this).parents('section#downgradelist_id').find('input[type=checkbox]').attr('checked',true);
			} else {
				$(this).parents('section#downgradelist_id').find('input[type=checkbox]').attr('checked',false);
			}
		});
		$('table.tbl_review_deact div.input_box').find('input[type=radio]').each(function(){
			$rIn = $(this);
			if($rIn.attr('checked')){
				$rIn.parents('tr').addClass('selected');
			}
			$rIn.click(function(e){
				var rbc = e.target;
				$('table.tbl_review_deact div.input_box input[type=radio]').parents('tr').removeClass('selected');
				$(rbc).closest('tr').addClass('selected');
			});
		});
    	
    },
    
    divide: function () {
    	$('#sel_howMany').change(function() {
    		var diff, $this, $newKeys, i, $newli, prevNo, newNo, prevLabel;
    	
    		$this = $(this);
    		$newKeys = $('#newKeys');

			// Difference
			diff = $this.val() - $newKeys.find('li').length;

			if(diff > 0){
				
				// foreach difference
				for (i=0; i<diff; i++){
					
					// Need to clone and create new ones
					$newli = $newKeys.find('li:first').clone();
					
					// Get the previous number
					// Look in the html for the second instance of "[" and then the second instance of "]".
					prevLabel = $newKeys.find('li:last label').attr('for');
					prevNo = prevLabel.substring(prevLabel.indexOf("[")+1, prevLabel.indexOf("]"));
					newNo = parseInt(prevNo)+1;
					
					// Simple, just find replace all the instances of [0] in attribute.
					$newli.find('label').attr('for', $newli.find('label').attr('for').replace(/\[0\]/, '['+newNo+']'));
					$newli.find('input').attr('id', $newli.find('input').attr('id').replace(/\[0\]/, '['+newNo+']'));
					$newli.find('input').attr('name', $newli.find('input').attr('name').replace(/\[0\]/, '['+newNo+']'));
					
					$newKeys.append($newli); //Put it into the DOM after the last li
					
				}
			}
			
			if(diff < 0) {
				// Remove n from the end of the li collection
				
				// foreach difference
				for (i=0; i>diff; i--){
					
					$newKeys.find('li:last').remove();
				
				}
			}
			
    	});
		if($('input[type=checkbox]#checkcheck').length > 0){
			$('input[type=checkbox]#checkcheck').change(function(){
				if ($('input[type=checkbox]:checked').length)
				{
					$('#btn_confirm').removeClass('disabled');
				}
				else
				{
					$('#btn_confirm').addClass('disabled');
				}

			});
		}
    },
    
    //Move Key
    move: function() {
    	$('.toFolder li input').change(function(){
    		$('.toFrom .to').html($(this).attr('data-folder-path'));
    	});
		if($('input[type=checkbox]#checkcheck').length > 0){
			$('input[type=checkbox]#checkcheck').change(function(){
				if ($('input[type=checkbox]:checked').length)
				{
					$('#btn_confirm').removeClass('disabled');
				}
				else
				{
					$('#btn_confirm').addClass('disabled');
				}

			});
		}
    },
    
    // Copy User Permissions
    copy: function() {
    	
    	// Open Close Functionality
    	var $permissions = $('.permissionsToCopy');
    	
    	$permissions.find('.more-details').hide();
    	$permissions.find('a.openClose').click(function() {
    		var $a = $(this);
    		$(this).parents('li').find('.more-details').slideToggle(200, function() {
    			if ($(this).is(':hidden')) {
    				$a.removeClass('open');
                } else {
                    $a.addClass('open');
                }
    		});
    		return false;
    	});
		
		
		//Select Users to Copy Permissions for
		var _updateSelectedUsers = function(){
			//Get the length of users selected
			var users = $('ul.removeUsersList li').length;
			//Look Selected Users class & replace the length in the span
			$('span.fn_selectedUsers').html(users);
			$('ul.removeUsersList li').removeAttr('style');
			myvmware.common.setAutoScrollWidth('ul.removeUsersList');	
		}
		
		//Input change event
		$('.possibleUsersList li input').change(function(){
				var $this = $(this),
					inputName,
					inputEmail,
					liClass = $this.parent().attr('class');//find class name;
					
				//If checked, create users data
				if($this.is(':checked')) {					
					inputName = $this.parent().find('label').html();//find name
					inputEmail = $this.parent().find('span').html();//find email					
					//insert new element into the right side (find the UL & .append(object);
					$('ul.removeUsersList').append('<li class="' + liClass + '"> <a class="remove" href="#">Remove</a><span>' + inputName + '</span> <span class="email">' + inputEmail + '</span> </li>');					
				}else{
					//Look to the right side for the class name and .remove();
					$('ul.removeUsersList .'+liClass).remove();
				}
				
				_updateSelectedUsers();
		
		});
		
		//When red remove icon is clicked
		$('ul.removeUsersList .remove').live('click', function() {
			var $this = $(this),
			liClass;			

			liClass = $this.parent().attr('class') //Get the class from the li
			$this.parent().remove();//Remove the li
						
			//Uncheck the input inside the li on the left side	
			$('ul.possibleUsersList .'+liClass).find('input').attr('checked', false);
			
			_updateSelectedUsers();
			
			return false;
		});
    },
	getCalendar: function() {
		vmf.dom.onload(function(){
                // Local variables to hold calendar elements
                var startDate = vmf.dom.id("txt_orderDate_from");
                var endDate = vmf.dom.id("txt_orderDate_to");
                // Initialize the calendars
                vmf.calendar.build(vmf.dom.get(".txt_datepicker"), {
                    dateFormat: 'yyyy/mm/dd',
                    startDate: '1990/01/01',
                    endDate: '2020/02/31',

startDate_id: vmf.dom.id('txt_orderDate_from'),
					endDate_id: vmf.dom.id('txt_orderDate_to')

					/*,selectedDate: '2011/07/20'*/
                });
	
                // Bind event handler to the startDate calendar
                vmf.dom.addHandler(startDate, "dpClosed", function(e, selectedDate){
                    var d = selectedDate[0];
                    if(d){
                        d = new Date(d);
                        vmf.calendar.setStartDate(endDate, d.addDays(1).asString());
                    }
                });
                // Bind event handler to the endDate calendar
                vmf.dom.addHandler(endDate, "dpClosed", function(e, selectedDate){
                    var d = selectedDate[0];
                    if(d){
                        d = new Date(d);
                        vmf.calendar.setEndDate(startDate, d.addDays(-1).asString());
                    }
                });
				
            })

		},
	
	permissionMgmt: function(){
		//$('div.tableContainer .scrollTable.showhide, header.result-section-header .settings-cog, .column .license_mgr').hide();
		// Create local variables required for this function
		var $licenseList = $('ul.license_folders_id');
		var $licenseLinks = $('ul.license_folders_id li a');
		var $licenseInput = $('ul.license_folders_id li input');
		// First hide all the toggle list
		$licenseList.find('.expandlist').hide();
		// on refresh remove all the selected input types 
		if($('ul.license_folders_id li input').length > 0){
		$('ul.license_folders_id li input')[0].checked = false;
		}
		
		// On hover show selected effect
		$licenseLinks.hover(function(){
			var $this = $(this);
			$this.parent('label').addClass('mouseenter');
		},
		function(){
			var $this = $(this);
			$this.parent('label').removeClass('mouseenter');
		});
		// Find all the a taga add click event to that.
		$($licenseLinks).each(function(i, obj){			
			link = $(obj);
			link.parents('li').find('input')[0].checked = false;
			// Bind click event to the links
			link.unbind('click').bind('click',function(e){
							
				//$('div.tableContainer .scrollTable, .column .license_mgr').hide();
				var $self = $(this);
				//$self.parent('label').addClass('active');
				$self.parent().next().animate({ height: 'toggle', opacity: 'toggle'});
				$self.toggleClass("open");
				e.preventDefault();
				e.stopPropagation();	
			});
		});
		/*$($licenseInput).each(function(i, obj){			
			input = $(obj);
			input.unbind('change').bind('change',function(){
				// Remove all the active class from the labels
				$licenseLinks.parent('label').removeClass('active');
				$self = $(this);
				if ($("input[type='radio']:checked")){
					// Hide all the righthand side columns.
					$('div.tableContainer .scrollTable, .column .license_mgr').hide();
					$self.next('label').addClass('active');
					var getrelVal = $self.next('label').find('a').attr('rel');
					if(getrelVal != ''){
						$('div.tableContainer div.loading').hide();
						$("header.result-section-header .settings-cog, div.tableContainer table."+ getrelVal +",.column div.license_mgr."+ getrelVal ).show();
					}else{
						$('div.tableContainer .scrollTable.showhide, .column .license_mgr').hide();
						$('div.tableContainer div.loading').show().html('Empty message will go here');
					}
				}
			});
		});*/
    }
    
  }