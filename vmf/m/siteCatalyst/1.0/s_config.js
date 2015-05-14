/**

 * Include configuration related functions for the overture library

 * @author Tim Wong (timwong@vmware.com)

 */

if(window.vmf && window.siteCly){

    var _func = function(){

        var conf = window.siteCly;

        try {

            /* set s.prop1-5 */

            url.hierarchy = new Array();

            url.hierarchy = url.hier1.split(",");

            for (var i = 0; i < url.hierarchy.length; i++) {

                if (i <= 4) 

                    eval("url.prop" + (i + 1) + "='" + url.hierarchy[i] + "';");

            }

        

            for (var i = url.hierarchy.length; i < 5; i++) 

                eval("url.prop" + (i + 1) + "='" + url.hierarchy[url.hierarchy.length - 1] + "';");

        

            /* set page variables */

            url.pagename = url.hier1.replace(/,/g, " : ");

            url.fullpagename = url.pagename + " : " + url.file;

            url.channel = url.prop1;

        

            /* You may give each page an identifying name, server, and channel on

             * the next lines. */

            s.channel = url.channel

            s.pageName = url.fullpagename

            s.pageType = ""

            s.prop1 = url.prop1

            s.prop2 = url.prop2

            s.prop3 = url.prop3

            s.prop4 = url.prop4

            s.prop5 = url.prop5

            s.prop23 = "Typo3"

            s.prop30 = conf.prop30 || "";
			s.prop34=s.pageName
            s.prop37=s.evar37=conf.prop37 || "";

	        s.eVar22 = conf.evar22 || ""

            /* Conversion Variables */

            s.campaign = ""

            s.events = conf.events || "";

            /* Hierarchy Variables */

            s.hier1 = url.hier1

            /************* DO NOT ALTER ANYTHING BELOW THIS LINE ! **************/

            var s_code = s.t();

            if (s_code) 

                document.write(s_code)

            /*

            if (navigator.appVersion.indexOf('MSIE') >= 0) 

                document.write(unescape('%3C') + '\!-' + '-')

            */

        

        } 

        catch (e) {

        } 

    };

    if(null != window.Event && null != window.Event.observe)

        Event.observe(window, "load", _func);

    else

        vmf.dom.onload(_func);

}