
/*Fix for starlight theme with vmf4 defining liferay and Myvmware objects for IE <= 8 */
if (typeof(myvmware) == "undefined")  
	myvmware = {};
myvmware.ie = function(){}
if (typeof(Liferay) == "undefined")  
	Liferay = {};
Liferay.ie = function(){}