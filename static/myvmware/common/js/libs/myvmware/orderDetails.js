/* ########################################################################### *
/* ***** DOCUMENT INFO  ****************************************************** *
/* ########################################################################### *
 * ##### NAME:  orderDetails.js
 * ##### VERSION: v0.1
 * ##### UPDATED: 2011/10/08
/* ########################################################################### */

if (typeof(myvmware) == "undefined")  
	myvmware = {};

myvmware.orderDetails = {
    
    init: function() {
		if($('#orderHistoryTable').length >0){
			$('#orderHistoryTable').dataTable( {
				"sScrollY": "330px",
				"bPaginate": false,
				"bFilter":false,
				"sDom": 't',
				"bAutoWidth": false,
				"fnInitComplete": function (){
					dt = this; // datatable object	
				},
				"aoColumnDefs": [
						{ "bSortable": false, "aTargets": [ 3 ] }
				],
				"aaSorting": [ [0, 'desc'] ]
			});
		}
		
		if($('#orderHistoryPaginateTable').length >0){
			$('#orderHistoryPaginateTable').dataTable( {
				"sScrollY": "330px",
				"iDisplayLength": 25,
				"bPaginate": true,
				"sPaginationType": "full_numbers",
				"bFilter":false,
				"sDom": '<"top"lpi<"clear">>rt<"bottom"lpi<"clear">>',
				"bAutoWidth": false,
				"oLanguage": {
				"sLengthMenu": "<label>Items per page:</label> _MENU_",
				"sZeroRecords": "Nothing found - sorry",
				"sInfo": "_START_ - _END_ of _TOTAL_ results",
				"sInfoEmpty": "0 - 0 of 0 results",
				"sInfoFiltered": "(filtered from _MAX_ total records)"
				},
				"aaSorting": [ [1, 'desc'] ],
				"fnInitComplete": function (){
					dt = this; // datatable object
					$(".top").appendTo(".topPaginateDiv");
					$(".bottom").appendTo(".bottomPaginateDiv");
				}
			});
		};
	  	  
		if($('#orderDetailTable').length >0){
			$('#orderDetailTable').dataTable( {
				"aoColumns": [{"sWidth":"38px","bSortable":false},{"sWidth":"420px"},{"sWidth":"100px"},{"sWidth":"140px"},{ "sWidth": "120px"}],
				"aaSorting": [ [1, 'desc'] ],    
				"sScrollY": "330px",
				"bPaginate": false,
				"bFilter":false,
				"sDom": 't',
				"bAutoWidth": false,
				"fnInitComplete": function (){
					dt = this; // datatable object
				}
			});
		};
		
		var $oD = $('#orderDetailTable');
		$oD.find('.more-details').hide();
		$oD.find('.openCloseSelect a').click(function() {
    		$a = $(this);
			nTr = $a.closest('tr')[0];
			
				if ($a.hasClass('open') && nTr.haveData)
				{
					$(nTr).removeClass('noborder');
					$a.removeClass('open');	
					$(nTr).next("tr").hide();
				} 
				else{
					$a.addClass('open');
					$(nTr).addClass('noborder');	
					if(!nTr.haveData){
						dt.fnOpen(nTr,showloading(),'');
						 getDMdata();
						nTr.haveData = true;
					}else
						$(nTr).next("tr").show();	
				};
			//$(nTr).slideToggle(function() {}); 
			return false;
    	});
		function showloading(){
			var sOut="<span class='loading'>Loading.....</span>";
			return sOut;
		};
		function getDMdata($rel){
			sOut=new Array();
			sOut.push('<div class="more-details">');
			sOut.push('<table><thead><tr>');
			sOut.push('<th>Details</th><th>Tracking Information</th><th>Licenses</th>');
			sOut.push('</tr></thead>');
			sOut.push('<tbody>');
			sOut.push('<tr><td>Commercial Electronic Download Distribution</td><td>Magna aliquam erat volutpat. Ut wisi veniam</td><td>5M48P**********08uk4</td></tr>');
			sOut.push('</tbody></table>');
			sOut.push('</div>');
			console.log(sOut.join(''));
			$(nTr).next("tr").find("td").html(sOut.join(''));
		};
		
	  	  
  	},
	getCalendar: function() {
		vmf.dom.onload(function(){
			var d = new Date();
			var curr_date = d.getDate();
			var curr_month = d.getMonth();
			var curr_year = d.getFullYear();
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
				/*,
				selectedDate: '2011/07/20'*/
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
				
        });

	}
}