if (typeof(myvmware) == "undefined")  myvmware = {};

myvmware.oosurvey = {
	ooGetLocaleJSFile: function (fileName){

		var udpatedFileName;

		if((fileName === "reports.js") && (myvmware.oosurvey.getCurrentLocale()==="beta")){
			//This is a specific case of 'oo_my_reports.js' file 
			udpatedFileName = "oo_my_"+fileName;
		}else{

			udpatedFileName = "oo_"+myvmware.oosurvey.getCurrentLocale()+"_"+fileName;
		}       
    	return udpatedFileName;
	},
	ooInvokeLocaleSurvey: function (methodName){       
        
        var surveyMethodObject = "oo_"+myvmware.oosurvey.getCurrentLocale()+"_"+methodName;

        vmf.json.txtToObj(surveyMethodName).show();
	},
	getCurrentLocale: function(){
		 //fileName
        var locale = $('#localeFromLiferayTheme').text().split("_")
        var currentLocale = (locale[0].toLowerCase() == 'en') ? 'en' : locale[1].toLowerCase();
        //if(currentLocale == "ja") currentLocale = "jp";
        var construct;
        for(var i in myvmware.oosurvey.supportedLang.locales){
                        if(myvmware.oosurvey.supportedLang.locales[i].lang.toLowerCase() == currentLocale){
                                        construct = currentLocale;
                                        break;
                        }
        }
        construct= ((construct == "en") || (typeof construct == "undefined")) ? "beta" : currentLocale;

        return construct;
	}
}