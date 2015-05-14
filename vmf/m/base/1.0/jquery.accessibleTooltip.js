/* ########################################################################### *
/* ##### ACCESSIBLE TOOLTIPS (WCAG LEVEL AAA)
/* ########################################################################### */

/**
 * jQuery.accessibleTooltip - Accessible Tooltip Plugin.
 * Copyright (c) 2009-2010 Damian Keeghan - dkeeghan@deloitte.com.au
 * Date: 02/02/2010
 * @author Damian Keeghan
 * @version 1.0
 *
 */
(function($){
	//creates an accessibleTooltip from an A tag
	$.fn.accessibleTooltip = function(options){
		var defaults = {
			speed: 250,
			fadeoutspeed: 2500,
			associateWithLabel: true,
			labelText: function(btn){
				return $(btn).parent().find("label, .label").text().replace("*", "");	
			},
			helpPrefix: "Help text for",
			leftOffset: 15,
			topOffset: 3,
			preContent: "",
			buttonStyle: "tooltip",
			tooltipStyle: "tooltip",
			isAbbr: false,
			onShow: function(btn, tooltipDiv){
				$(tooltipDiv).animate({opacity: 1}, 0);	
			}
		};		
		var $cT=null;
		var options = $.extend(defaults, options);
		return this.each(function(){
			var aTooltip = $(this);
			var label = (options.associateWithLabel) ? options.labelText($(aTooltip)) : "";
			var helpText = $(aTooltip).attr("title");
			if(helpText==""){
				$(aTooltip).remove();
			} else {
				var tooltip;				
				if(options.isAbbr){
					$(aTooltip).removeAttr('title');
					tooltip = $(aTooltip);
				} else {
					$(aTooltip).after("<button type=\"button\" class=\""+options.buttonStyle+"\">"+options.helpPrefix+" "+label+"</button>");
					tooltip = $(aTooltip).parent().find("button."+options.buttonStyle);	
					$(aTooltip).remove();
				}
				$(tooltip).data("isClicked", false);
				var tooltipContent = "<div class=\""+options.tooltipStyle+"\" style=\"display: none\">";
					tooltipContent += options.preContent;
					tooltipContent += "<div class=\"content\">";
						tooltipContent += (options.associateWithLabel) ? "<h3 style=\"position: absolute; left: -99999px\">Help for "+label+"</h3>" : "";
						tooltipContent += "<p>"+helpText+"</p>";
						tooltipContent += (options.associateWithLabel) ? "<div style=\"position: absolute; left: -99999px\">End help</div>" : "";
					tooltipContent += "</div>";
				tooltipContent += "</div>";
				
				$(tooltip).after(tooltipContent);
				var tooltipDiv = $(tooltip).parent().find("div."+options.tooltipStyle);
				$(tooltip).unbind("click").bind("click", function(e){
					e.preventDefault();
					this.focus();
					if($(tooltip).data("isClicked")==false){
						$(tooltip).data("isClicked", true);
						setPosition(tooltip, tooltipDiv);
						
						if(options.speed==0){
							$(tooltipDiv).show();
							options.onShow($(aTooltip), $(tooltipDiv));
						} else {
							$(tooltipDiv).fadeIn(options.speed, function(){
								options.onShow($(aTooltip), $(tooltipDiv));										 
							});
						}
						$cT =  $(tooltip); //console.log("ct created : " + $cT);
					} else {
						if(options.fadeoutspeed==0){
							$(tooltipDiv).hide();
							$(tooltip).data("isClicked", false);
						} else {
							$(tooltipDiv).fadeOut(options.fadeoutspeed, function(){
								$(tooltip).data("isClicked", false);
							});
						}
					}
					return false;
				});
				
				//$(tooltip).bind("focus mouseover", function(){
				$(tooltip).bind("mouseover", function(){
					if($(tooltip).data("isClicked")==false){
						setPosition(tooltip, tooltipDiv,$cT);
						
						if(options.speed==0){
							$(tooltipDiv).show();
							options.onShow($(aTooltip), $(tooltipDiv));
						} else {
							$(tooltipDiv).stop().fadeIn(options.speed, function(){
								options.onShow($(aTooltip), $(tooltipDiv));
								setPosition(tooltip, tooltipDiv,$cT);								   
							});
						}
					}
				});
				$(tooltip).unbind("blur").bind("blur", function(e){
					/*if($cT!=null){
							$cTDiv =  $cT.parent().find("div."+options.tooltipStyle);	
							$cTDiv.hide();
							$cT.data("isClicked", false);
					}*/
					$.fn.toolTiponBlur($cT,options.tooltipStyle);
				});
				//$(tooltip).bind("blur mouseout", function(){
				$(tooltip).bind("mouseout", function(){
					if($(tooltip).data("isClicked")==false){
						if(options.fadeoutspeed==0){
							$(tooltipDiv).hide();
						} else {
							$(tooltipDiv).stop().fadeOut(options.fadeoutspeed);
						}
					}
				});	
				$(window).resize(function(){
					if($(tooltip).data("isClicked")==true){
						setPosition(tooltip, tooltipDiv);	
					}
				});
			}
		});
		function setPosition(tooltip, tooltipDiv, $d){
			
			var zIdx = ($d)?parseInt($d.parent().find("div."+options.tooltipStyle).css("zIndex"))+1:9001;
			//console.log("ct zindex : " + zIdx);
			var tooltipDimensions = {top: $(tooltip).position().top, left: $(tooltip).position().left, width: $(tooltip).width(), height: $(tooltip).height()}
			var tooltipDivHeight = $(tooltipDiv).height();
			var tooltipDivLeftPos = (tooltipDimensions.left + tooltipDimensions.width + options.leftOffset);
			var tooltipDivTopPos = tooltipDimensions.top + options.topOffset + $(tooltip).parents(".resultsWindow").scrollTop();
			$(tooltipDiv).css({top: tooltipDivTopPos, left: tooltipDivLeftPos,zIndex:zIdx});
		}
	};
	$.fn.toolTiponBlur=function($cT,opts){
		if($cT!=null){
							$cTDiv =  $cT.parent().find("div."+opts);	
							$cTDiv.hide();
							$cT.data("isClicked", false);
		}
	};
	$.fn.resetAccessibleTooltip = function(options){
		var defaults = {
			speed: 2500,
			tooltipStyle: "tooltip"
		};
		var options = $.extend(defaults, options);
		return this.each(function(){
			var tooltip = $(this);
			var tooltipDiv = $(tooltip).parent().find("div."+options.tooltipStyle);
			if(options.speed==0){
				$(tooltipDiv).hide();
				$(tooltip).data("isClicked", false);
			} else {
				$(tooltipDiv).fadeOut(options.speed, function(){
					$(tooltip).data("isClicked", false);
				});
			}						   
		});	
	};
})(jQuery);