$( document ).ready(function() {
    $(".nav-level-1 li")
			.on("click", function(){
			    if($(this).hasClass("focused")){
				$(this).blur().removeClass("focused");
				}
			   else {
			    $(".nav-level-1 li").blur().removeClass("focused");	
			    $(this).focus().addClass("focused");
				}
	    	});
});

	