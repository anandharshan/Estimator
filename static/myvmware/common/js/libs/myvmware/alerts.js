/* ########################################################################### *
/* ***** DOCUMENT INFO  ****************************************************** *
/* ########################################################################### *
 * ##### NAME:  alerts.js
 * ##### VERSION: v0.1
 * ##### UPDATED: 09/07/2011 
/* ########################################################################### */

if (typeof(myvmware) == "undefined")  
	myvmware = {};

myvmware.alerts = {
    
    init: function() {
      // code which will run on all account pages
      
      // Handles the table hover states
      $('tr').hover(function(){
        $(this).addClass('hovered');
      },function(){
        $(this).removeClass('hovered');
      });

      // Dismiss button click handler
      $('.dismissBtn').click(function(){
        alert('AJAX call to make all messages as read');
      });		

      // Select all checkbox click handler
      $('.fn_selectAll').click(function(){
        var $this = $(this);
        
        if($this.is(':checked')){
          // Check all of the items
          $('.alertsModule td input').attr('checked','checked');
        }else{
          // Uncheck all of the items
          $('.alertsModule td input').removeAttr('checked');
        }
      });
	  
	  if($('#alertsTable').length >0){
			$('#alertsTable').dataTable( {
				"bPaginate": false,
				"sScrollY": "400px",
				"bFilter":false,
				"sDom": 't',
				"bAutoWidth": false,
				"fnInitComplete": function (){
					dt = this; // datatable object	
				},
				"aoColumnDefs": [
						{ "bSortable": false, "aTargets": [ 0 ] }
				]
			});
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
				
            })

  	}
  }