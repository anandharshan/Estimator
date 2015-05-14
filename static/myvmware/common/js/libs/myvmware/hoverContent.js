if (typeof(myvmware) == "undefined")  myvmware = {};
myvmware.hoverContent = {
    hoverClass: "hoverContent hidden",
    hoverContainer:"",
    hoverTypeClass:"",
    hoverId:"",
    pageFlag: 0,
    array: [],
    hover_OnPopup : false,
    hover_OnElemRow : false,
    hover_Exists : false,
	width:160, //default width 
    init : function(elements, funcName){
        var self = this;
		if(typeof(elements) == "undefined"){elements = $('a.tooltip');}
		if(typeof(funcName) == "undefined"){funcName = 'defaultfunc';}
        myvmware.hoverContent.bindEvents(elements, funcName);
    },
    bindEvents : function(elements, funcName, offsetArea, tWidth, allowClickEvt){ //allowClickEvt is a flag that allow click event for Tooltip Element
        var self = this, hoverContent = '', timeoutID;
        var pageType = self.pageType(funcName);
        var className = pageType[0];
        var popUpContainer = pageType[1];
		var target="";
		$(".tooltip_flyout_def").die('mouseover mouseout').live('mouseover mouseout',function(e){
			if(e.type=="mouseover"){
				self.hover_OnPopup = true;
			} else {
				self.hover_OnPopup = false;
			}
		});
        $(elements).each(function(i, element){
        
		 $(element).click(function(e){
		 	
			if(this==e.target && !allowClickEvt){ 
				return false;  //BUG-00027338, BUG-00030014 fix
			}else{  
				$(e.target).trigger('mouseleave'); //Trigger mouseleave event to hide the tooltip forcefully once we click on the Tooltip Element
				return true; // Allowing click event to execute 
			}
		 }); 
		 
		 
            $(element).hover(function(e){
				//if (self.hover_OnPopup || self.hover_OnElemRow) {return false;}
				self.hover_OnElemRow = true;
				if (self.hover_Exists) {hideHover();}
				if($(this).data("title")==undefined) $(this).data("title", $(this).attr('title'))
				//hoverContent = $(this).attr('title');
				target=this;
				$(this).attr('title', "");
                if (funcName == "defaultfunc") {
					tEle = (offsetArea!=undefined && offsetArea=='firstTd') ? $(this).find("td:eq(0)") : $(this);
					var getTopPos = $(this).offset().top + $(this).outerHeight()/2;
					var getLeftPos = $(this).offset().left + tEle.outerWidth()+10;
                    $(popUpContainer).append($(this).data("title"))
					.css('top', getTopPos)
					.css('left', getLeftPos)
					.appendTo('body');
                } else if (funcName == "default"){
					targetEle=$(this);
					var getLeftPos = targetEle.offset().left + targetEle.closest('div.folderPane').outerWidth()-20;
					var getTopPos = targetEle.offset().top + targetEle.outerHeight()/2;
                    $(popUpContainer).append($(this).data("title"))
					.css('top', getTopPos)
					.css('left', getLeftPos)
					.appendTo('body');
                }else if (funcName == "epfunc") {
					tEle = (offsetArea!=undefined && offsetArea=='firstTd') ? $(this).find("td:eq(0)") : $(this);
					var getTopPos = $(this).offset().top + $(this).outerHeight()/2;
					var getLeftPos = $(this).offset().left + tEle.outerWidth()+10;
                    $(popUpContainer).append($(this).data("title"))
					.css('top', getTopPos)
					.css('left', getLeftPos)
					.appendTo('body');
                }else if(funcName == "cursorPosition"){
					$(popUpContainer).append($(this).data("title"))
					.css({'top': $(this).offset().top+$(this).outerHeight()/2,'left':e.clientX+20})
					.appendTo('body');
				  }else if (funcName == "funcleft") {
					var tEle = (offsetArea!=undefined && typeof offsetArea=='object') ? offsetArea : $(this);
					var oSet = (tWidth!=undefined)? tWidth+202-self.width:202;
					var getTopPos = tEle.offset().top + tEle.outerHeight()/2;
					var getLeftPos = tEle.offset().left - oSet;
                    $(popUpContainer).append($(this).data("title"))
					.css('top', getTopPos)
					.css('left', getLeftPos)
					.css('width',tWidth||self.width)
					.appendTo('body');
                }else if (funcName == "funcRight"){
                	var tEle = (offsetArea!=undefined && typeof offsetArea=='object') ? offsetArea : $(this);
					var oSet = (tWidth!=undefined)? tWidth+202-self.width:202;
					var getTopPos = tEle.offset().top + tEle.outerHeight()/2;
					var getRightPos =  $(window).width() - (tEle.offset().left -10);
                    $(popUpContainer).append($(this).data("title"))
					.css('top', getTopPos)
					.css('right', getRightPos)
					.css('width',tWidth||self.width)
					.appendTo('body');
                }
				self.hover_Exists = true;
            },
			function(){
				if (funcName == "default" || funcName == "epfunc") {
					setTimeout(function(){
						var t = setInterval(function(){
							if(!self.hover_OnPopup){
								$(document).unbind('mousemove').bind('mousemove',function(event){
									if (event.target==target || $.inArray(event.target, $(target).find('input, span, label')) !==-1){
									}else {
										self.hover_OnElemRow = false;
										$(target).attr('title', $(target).data("title"));
										hideHover();
										clearInterval(t);
										$(document).unbind('mousemove');
									}
								})
							}
						},100)
					},100);
				} else {
					self.hover_OnElemRow = false;
					$(target).attr('title', $(target).data("title"));
					hideHover();
				}
			});
            function hideHover(){
                //clearTimeout(timeoutID);
                //--> if the mouse isn't on the div then hide the bubble
                if (self.hover_Exists && !self.hover_OnPopup) {
                    var pageType = self.pageType('all');
                    var className = pageType[0];
                    $(className).remove();
					self.hover_Exists = false;
                }
            }
        });
        function keepHoverOpen(){var self = this;return self.hover_OnPopup = true;}
        function letHoverClose(){var self = this;return self.hover_OnPopup = false;hideHover();}
    },
    pageType : function(funcName){
        var self = this, pageTypeArray = [];
        // determine different classnames and the holding contaniers for the pointer popups
        switch(funcName){
			case 'defaultfunc':
                className = '.tooltip_flyout';
                popUpContainer = '<div class="tooltip_flyout"><div class="flyout_arrow"></div></div>';
                break;
			case 'default':
                className = '.tooltip_flyout_def';
                popUpContainer = '<div class="tooltip_flyout_def"><div class="flyout_arrow"></div></div>';
                break;
			case 'funcleft':
				className='.tooltip_flyout';
				popUpContainer = '<div class="tooltip_flyout"><div class="flyout_arrow_left"></div></div>';
				break;
			case 'funcRight':
				className='.tooltip_flyout';
				popUpContainer = '<div class="tooltip_flyout"><div class="flyout_arrow_left"></div></div>';
				break;
			case 'epfunc':
				className = '.tooltip_flyout_def';
                popUpContainer = '<div class="tooltip_flyout_def"><div class="flyout_arrow"></div></div>';
                break;	
            case 'all':
                className = '.tooltip_flyout, .tooltip_flyout_def';
                popUpContainer = '<div class=""></div>';
				break;
			case 'cursorPosition':
				className='.tooltip_flyout';
				popUpContainer = '<div class="tooltip_flyout"><div class="flyout_arrow"></div></div>';
				break;
        }
        pageTypeArray.push(className); // push the className to first position
        pageTypeArray.push(popUpContainer); // push the container to second position
      return pageTypeArray;
    }
};