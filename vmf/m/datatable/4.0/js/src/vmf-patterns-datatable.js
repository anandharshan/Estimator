/*
 * VMWARE JavaScript Framework - Patterns Abstraction Functionality
 * Author : SuryaPavan Musti
 * Last Modified : Apr 24, 2014
 * 
 * Dependency : vmf-core.js
 *
 * TODO: Refactor/split when/if required
 */


/* 
 * "dataTable" pattern
 * Uses datatables.net plugin (loaded as part of core vmf)
 * Parameters:
 * 	el: Mandatory. CSS selector where table would be applied
 * 	param: Optional. Object with additional datatables.net settings
 */
;(function(vmf, document) {

	if(!vmf.patterns) {
	     if(window.console){
			return console.error("vmf Core not loaded");
		 }
	}

	vmf.patterns.dataTable = function(el, param) {
	    if(!$.fn.dataTableExt.oPagination){
			$.fn.dataTableExt.oPagination = {};
		}
		$.fn.dataTableExt.oPagination.starlight = {
	    "fnInit": function ( oSettings, nPaging, fnCallbackDraw )
	    {
	        var nFirst = document.createElement( 'span' );
	        var nPrevious = document.createElement( 'span' );
	        var nNext = document.createElement( 'span' );
	        var nLast = document.createElement( 'span' );
	        var nInput = document.createElement( 'input' );
	        var nPage = document.createElement( 'span' );
	        var nOf = document.createElement( 'span' );
	 
	        nFirst.innerHTML = oSettings.oLanguage.oPaginate.sFirst;
	        //nPrevious.innerHTML = oSettings.oLanguage.oPaginate.sPrevious;
	        //nNext.innerHTML = oSettings.oLanguage.oPaginate.sNext;
	        nLast.innerHTML = oSettings.oLanguage.oPaginate.sLast;
	 
	        nFirst.className = "paginate_button first hidden";
	        nPrevious.className = "paginate_button previous paging_disabled";
	        nNext.className="paginate_button next";
	        nLast.className = "paginate_button last hidden";
	        nOf.className = "paginate_of";
	        nPage.className = "paginate_page";
	        nInput.className = "paginate_input"
	 
	        if ( oSettings.sTableId !== '' )
	        {
	            nPaging.setAttribute( 'id', oSettings.sTableId+'_paginate' );
	            nPrevious.setAttribute( 'id', oSettings.sTableId+'_previous' );
	            nPrevious.setAttribute( 'id', oSettings.sTableId+'_previous' );
	            nNext.setAttribute( 'id', oSettings.sTableId+'_next' );
	            nLast.setAttribute( 'id', oSettings.sTableId+'_last' );
	        }
	 
	        nInput.type = "text";
	        //nInput.style.width = "31px";
	        nInput.style.display = "inline";
	        nPage.innerHTML = "Page ";
	 
	        nPaging.appendChild( nFirst );
	        nPaging.appendChild( nPrevious );
	        nPaging.appendChild( nPage );
	        nPaging.appendChild( nInput );
	        nPaging.appendChild( nOf );
	        nPaging.appendChild( nNext );
	        nPaging.appendChild( nLast );
	 
	        $(nFirst).click( function () {
	            oSettings.oApi._fnPageChange( oSettings, "first" );
	            fnCallbackDraw( oSettings );
	        } );
	 
	        $(nPrevious).click( function() {
	            oSettings.oApi._fnPageChange( oSettings, "previous" );
	            fnCallbackDraw( oSettings );
	        } );
	 
	        $(nNext).click( function() {
	            oSettings.oApi._fnPageChange( oSettings, "next" );
	            fnCallbackDraw( oSettings );
	        } );
	 
	        $(nLast).click( function() {
	            oSettings.oApi._fnPageChange( oSettings, "last" );
	            fnCallbackDraw( oSettings );
	        } );
	 
	        $(nInput).keyup( function (e) {
	            if ( e.which == 38 || e.which == 39 )
	            {
	                this.value++;
	            }
	            else if ( (e.which == 37 || e.which == 40) && this.value > 1 )
	            {
	                this.value--;
	            }
	 
	            if ( this.value === "" || this.value.match(/[^0-9]/) )
	            {
	                /* Nothing entered or non-numeric character */
	                return;
	            }
				/*if ( e.which == 13){
					var iNewStart = oSettings._iDisplayLength * (this.value - 1);
					if ( iNewStart > oSettings.fnRecordsDisplay() )
					{
						oSettings._iDisplayStart = (Math.ceil((oSettings.fnRecordsDisplay()-1) /
							oSettings._iDisplayLength)-1) * oSettings._iDisplayLength;
						fnCallbackDraw( oSettings );
						return;
					}
		 
					oSettings._iDisplayStart = iNewStart;
					fnCallbackDraw( oSettings );
					$(this).trigger("change");
				}*/
	        } );
			$(nInput).change( function (e) {	             
	            if ( this.value === "" || this.value.match(/[^0-9]/) )
	            {
	                /* Nothing entered or non-numeric character */
	                return;
	            }
				var iNewStart = oSettings._iDisplayLength * (this.value - 1);
				if ( iNewStart > oSettings.fnRecordsDisplay() )
				{
					/* Display overrun */
					oSettings._iDisplayStart = (Math.ceil((oSettings.fnRecordsDisplay()-1) /
						oSettings._iDisplayLength)-1) * oSettings._iDisplayLength;
					fnCallbackDraw( oSettings );
					return;
				}
	 
				oSettings._iDisplayStart = iNewStart;
				fnCallbackDraw( oSettings );
	        });
	 
	        /* Take the brutal approach to cancelling text selection */
	        $('span', nPaging).bind( 'mousedown', function () { return false; } );
	        $('span', nPaging).bind( 'selectstart', function () { return false; } );
	    },
	 
	 
	    "fnUpdate": function ( oSettings, fnCallbackDraw )
	    {
	        if ( !oSettings.aanFeatures.p )
	        {
	            return;
	        }
	        var iPages = Math.ceil((oSettings.fnRecordsDisplay()) / oSettings._iDisplayLength);
	        var iCurrentPage = Math.ceil(oSettings._iDisplayStart / oSettings._iDisplayLength) + 1;
	 
	        /* Loop over each instance of the pager */
	        var an = oSettings.aanFeatures.p;
	        for ( var i=0, iLen=an.length ; i<iLen ; i++ )
	        {
	            var spans = an[i].getElementsByTagName('span');
	            var inputs = an[i].getElementsByTagName('input');
	            spans[3].innerHTML = " of "+iPages;
	            inputs[0].value = iCurrentPage;
	        }

	        if(iCurrentPage == iPages){
	        	$(".paginate_button.next").addClass("paging_disabled");
	        	$(".paginate_button.previous").removeClass("paging_disabled");
	        }
	        else {
	        	$(".paginate_button.previous").removeClass("paging_disabled");
	        	$(".paginate_button.next").removeClass("paging_disabled");
	        }
	        if (iCurrentPage == 1 ){
	        	$(".paginate_button.previous").addClass("paging_disabled");
	        }
	    }
	};
		
		try {
			$.map(param.aoColumns, function(value){
				/* generate a SPAN element, for each the column heading, when bSortable is set to true */
				if( value.bSortable !== false ){
					value.sTitle += ' <span class="datatable-sort"></span>';
				}
			});

			/* Sending a custom configuration (to the pattern - bReflow). 
			   When set to true, adding some markup to the TD-elements to make it reflow - in fnDrawCallback
			   
			   Note: if fnDrawCallback is already used, then appending this reflow-logic after orignal-fnDrawCallback is executed */
			/*if( param.bReflow !== false ){
				// get the fnDrawCallback function definition - if already set
				var orgFnDrawCallback = ( !param.fnDrawCallback )?function(){}:param.fnDrawCallback;
				
				// add/update a property 'fnDrawCallback' to the 'param' obj
				param.fnDrawCallback = function( settings ) {
					// execute the original fnDrawCallback
					orgFnDrawCallback(settings);

					// reflow-logic: for all the TDs in the table, do the below 2 tasks
					//	1. wrap the existing content within 'div.cell-content'
					//	2. add 'b.cell-label' element in the TD which has that particular column's heading-text in it
			        var tableObj = settings.oInstance;
					tableObj.find('tbody td').each(function(){
					    var aPos = tableObj.fnGetPosition( this );
					    $(this).html('<div class="cell-content">'+$(this).html()+'</div>');
					    $(this).prepend('<b class="cell-label">'+tableObj.find('thead th').eq(aPos[2]).text()+'</b>');
					});
			    }

			    // 'bReflow' configuration is not needed for the param object (which will be passed to dataTable plugin)
				delete param.bReflow;
			}*/

			return $(el).dataTable( $.extend({
		          "bFilter": true 
		        , "bInfo": false
		    }, param) );
		    
		} catch (e) {
		   if(vmf.error){
				vmf.error("Error loading vmf.patterns.dataTable", e);
		   }
		}
	};

})(window.vmf = window.vmf || {}, document);