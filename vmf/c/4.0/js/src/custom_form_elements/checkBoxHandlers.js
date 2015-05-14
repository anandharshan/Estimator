(function($){

if($){

$(document).on("click",".checker input:checkbox",function(){
	var $this = $(this), span = $this.parent("span");
	span.toggleClass("checked");
});
}

})(window.jQuery);