/*
* VMWARE JavaScript Framework Library Mapping file Ver.1.0
* Author : Raghaendra Vooka
* Date : 04/10/2011
* This file maintained by the VMware WebDev team
*/
var vmf_modules = ({
	mapping: {
		// Base Module mandatory module
		"base":{js:["/m/base/1.0/jquery.accessibleTooltip.js","/m/base/1.0/jquery.json-1.3.min.js","/m/base/1.0/min1.js","/m/base/1.0/get_html_translation_table.js"], dependendJs: null,dependendModule: null,vmfpath:true,loadOnce: true},
		// Base Module mandatory module 1.1
		"base.1.1":{js:["/m/base/1.1/base.js"], dependendJs: null,dependendModule: null,vmfpath:true,loadOnce: true},
		//vmf datatable plug-in ver:1.0
		"datatable":{js:["/m/datatable/1.0/jquery.dataTables.js"],css:["/m/datatable/1.0/datatable.css"],dependendJs: null,dependendModule: ["base"],vmfpath:true,loadOnce: true},
		//vmf datatable ver:1.1
		"datatable1.1":{js:["/m/datatable/1.1/jquery.dataTables.js"],css:["/m/datatable/1.1/datatable.css"],dependendJs: null,dependendModule: ["base"],vmfpath:true,loadOnce: true},
		//vmf datatable ver:1.2
		"datatable1.2":{js:["/m/datatable/1.2/js/dataTables.js"],css:["/m/datatable/1.2/css/datatable.css"],dependendJs: null,dependendModule: ["base"],vmfpath:true,loadOnce: true},
		//vmf data grid moaldue
		"grid" :{js:["/m/grid/1.0/grid.js"],css:["/m/grid/1.0/grid.css"],dependendJs: null,dependendModule: ["base"],vmfpath:true,loadOnce: true},
		//vmf modal popups module
		"modal":{js:["/m/modal/1.0/modal.js"],dependendJs: null,dependendModule: ["base"],vmfpath:true,loadOnce: true},
		//vmf table scroll modue
		"tablescroll":{js:["/m/tablescroll/1.0/jquery.tablescroll.js"],dependendJs: null,dependendModule: ["base"],vmfpath:true,loadOnce: true},
		// vmf  table sorter module
		"tablesorter":{js:["/m/tablesorter/1.0/jquery.tablesorter.js"],dependendJs: null,dependendModule: ["base"],vmfpath:true,loadOnce: true},         
		// vmf Calendra module
		"calendar":{js:["/m/calendar/1.0/calendar.js"],css:["/m/calendar/1.0/calendar.css"],dependendJs: null,dependendModule: ["base"],vmfpath:true,loadOnce: true},
		// Tree view module
		"treeview" :{js:["/m/treeview/1.0/jquery.treelist.datafetch.js","/m/treeview/1.0/jquery.treelist.js"],css:["/m/treeview/1.0/jquery.treelist.css"],dependendJs: null,dependendModule: ["base"],vmfpath:true,loadOnce: true},
		 // jQuery Validation  ver 1.4
		"validation.1.0" :{js:["/m/validation/1.0/validation.js"],dependendJs: null,dependendModule: ["base"],vmfpath:true,loadOnce: true },
		// jQuery Validation  ver 1.8
		"validation.1.1" : {js:["/m/validation/1.1/jquery.validate.js"],dependendJs: null,dependendModule: ["base"],vmfpath:true,	loadOnce: true },
		// jQuery Validation Password  ver 1.2
		"validation.1.2" : {js:["/m/validation/1.2/jquery.validate.js"],dependendJs: null,dependendModule: ["base"],vmfpath:true,	loadOnce: true },
		// jQuery Validation Password  ver 1.0
		"validation.password.1.0" : {js:["/m/validation.password/1.0/jquery.validate.password.js"],css:["/m/validation.password/1.0/jquery.validate.password.css"],dependendJs: null,dependendModule: ["validation.1.1"],	vmfpath:true,loadOnce: true },
		//vmf dual list plug-in
		"duallist":{js:["/m/duallist/1.0/jquery.duallist.js"],dependendJs: null,dependendModule: ["base"],vmfpath:true,loadOnce: true },
		//PE Session 
		"pe_session":{css:["/m/session/1.0/session.css"],js:["/m/session/1.0/session_pe.js"],dependendJs: null,dependendModule: ["base"],vmfpath:true,loadOnce: true},
		// vmf loading modal popuo wiht custom message
		"loading":{js:["/m/loading/1.0/blockUI.js"],dependendJs: null,dependendModule: ["base"],vmfpath:true,loadOnce: true},
		//vmf custom dropdown
		"customDropdown":{js:["/m/customDropdown/1.0/dropdownReplacement.js"],css:["/m/customDropdown/1.0/dropdownReplacement.css"],dependendJs: null,dependendModule: ["base"],	vmfpath:true,loadOnce: true },
		"customDropdown1.1":{js:["/m/customDropdown/1.1/dropdownReplacement.js"],css:["/m/customDropdown/1.1/dropdownReplacement.css"],dependendJs: null,dependendModule: ["base"],	vmfpath:true,loadOnce: true },
		"rotate":{js:["/m/rotate/1.0/jQueryRotate.js"],dependendJs: null,dependendModule: ["base"],vmfpath:true,loadOnce: true},
		"resize": {js:["/m/resize/1.0/splitter.js"],css:["/m/resize/1.0/splitter.css"],dependendJs: null,dependendModule: ["base"],	vmfpath:true,loadOnce: true },
		"contextmenu": {js:["/m/contextmenu/1.0/contextMenu.js"],css:["/m/contextmenu/1.0/contextMenu.css"],dependendJs: null,dependendModule: ["base"],	vmfpath:true,loadOnce: true },
		/*==========================================================================================================================*/
		/*The below are mandatory for every project. Do not touch/edit the below one.*/
		"oolab":{js:["/m/opinionLab/1.0/oo_engine.js"],dependendJs: null,dependendModule: ["base"],vmfpath:true,loadOnce: true},
		// SAT Module, mandatory module
		//"sat":{js:["/m/base/1.0/javascript-xpath.js","/m/base/1.0/jquery.cookie.1.0.js","/m/base/1.0/jquery.md5.js","/m/sat/1.0/log.js", "/m/sat/1.0/sat.js"],dependendJs: null,dependendModule: ["base"],vmfpath:true,loadOnce: true},
		"sat":{js:["/m/sat/1.0/sat.js"],dependendJs: null,dependendModule: ["base"],vmfpath:true,loadOnce: true},
		 // Site Catalyst Module, with config , mandatory module for event tracking
		"sc_config" :{js:["/files/templates/inc/s_config.js?globalPath_11082013"],dependendJs: null,dependendModule: ["base"],vmfpath:false,loadOnce: true },
		 // Site Catalyst Module, wiht out config, just for URL tracking
		"sc" :{js:["/files/templates/inc/s_code_my.js?globalPath_11082013"],dependendJs: null,dependendModule: ["base"],vmfpath:false,loadOnce: true },
		//elq module
		"elqNow":{js:["/m/elqNow/1.0/elqCfg.js","/m/elqNow/1.0/elqImg.js"],dependendJs: null,dependendModule: ["base"],vmfpath:true,loadOnce: true },
		//Foresee module
		"foresee":{js:["/m/foresee/foresee-trigger.js"],dependendJs: null,dependendModule: ["base"],vmfpath:true,loadOnce: true}
	}//mapping object ends here
});
