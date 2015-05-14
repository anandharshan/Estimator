var vmf_modules = ({
    mapping: {
        "base"://mandatory load
        {
            js:[
				"/m/base/1.0/javascript-xpath.js",
				"/m/base/1.0/jquery.accessibleTooltip.js",
				"/m/base/1.0/jquery.cookie.1.0.js",
				"/m/base/1.0/jquery.corner.js",
				"/m/base/1.0/jquery.md5.js",
				"/m/base/1.0/jquery.json-1.3.min.js",
				"/m/base/1.0/jquery.hoverIntent-min.js",
				"/m/base/1.0/superfish-min.js",
				"/m/base/1.0/supersubs-min.js"
			   ],  
            dependendJs: null,
            dependendModule: null,
			vmfpath:true,
            loadOnce: true
			
        },
		"datatable":
		{
			js:["/m/datatable/1.0/jquery.dataTables.min.js"],
			dependendJs: null,
			dependendModule: ["base"],
			vmfpath:true,
            loadOnce: true            
		},
        "modal":
        {
            js:["/m/modal/1.0/modal.js"],
            css:["module/1.0/modal.css"],                
            dependendJs: null,
            dependendModule: ["base"],
			vmfpath:true,
            loadOnce: true            
        },        
        "calander":
        {
            js:["/m/calendar/1.0/calendar.js"],
            dependendJs: null,
            dependendModule: ["base"],
			vmfpath:true,
            loadOnce: true            
        },
		"sat":
		{
			js:[
				"/m/sat/1.0/log.js", 
				"/m/sat/1.0/sat.js"
				],
			dependendJs: null,
            dependendModule: ["base"],
			vmfpath:true,
            loadOnce: true            
        },
		"managelicense":
		{
			js:["../symphony/js/libs/myvmware/manage.js"],
			dependendJs: null,
            dependendModule: ["base"],
			vmfpath:false,
            loadOnce: true            
        }
    }
});
