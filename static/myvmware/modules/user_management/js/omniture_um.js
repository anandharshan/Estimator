if (typeof(myvmware) == "undefined")  
	myvmware = {};

 function initumomniture(){
	 
		sendToOminature('web',$("#otrk").val().replace(/\_/g, ' : '));
		sendToOminature('web','registration : activation-instructions');
}