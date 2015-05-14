/**
* Context Menu jQuery Plugin
* Version **** 1.0  ****
* Updated: 10/05/2012
* This plugin will take the folder details on which context menu is required and produce the context menu with provided data.
*/
(function ($) {
    $.contextMenu = {
        defaults: {
            data: [],
            cClass: 'contextMenu',//context menu class
            cmenuId: '',
            targetElem: 'body',
            contextMenuFlag: true,
            funcName: 'default',
            actionBtnPos: "target",
            actionBtnClass: 'icon_more',
            actionBtnFlg: false,//if true, icon will be displayed for the respective folders
            disableMenuCls: 'disableMenu',
            inactiveCls: 'inactive',
			activeCls:'targetActive',
			activeBtnCls:'activeBtn',
            menuChgState: function (target, cmenuId, disableMnu) {},//For changing context menu state on right click
            getTargetDetails: function (target) {},//For getting right click folder details
            getTargetNode: function (targetEl) {},//For getting target node to append icon image
			getTarget: function (target,targetCls,actBtnCls) {}
        }
    };
    $.fn.contextMenu = {
        targetDetailsObj: null,
        cmenuPos: null,
        init: function (options) {
            config = options;
            config = $.extend({}, $.contextMenu.defaults, config);
            this.buildContextMenu(config.data, config.cmenuId, config.cClass);
            this.bindContextMenuEvents(config.data, config.cmenuId, config.getTarget);
            this.fnContextMenu(config.targetElem, config.contextMenuFlag, config.funcName, config.cmenuId, config.menuChgState, config.getTargetDetails, config.getTarget);
            if(config.actionBtnFlg){
                this.createActionBtn(config.targetElem, config.cmenuId, config.menuChgState, config.getTargetDetails, config.getTargetNode, config.funcName);
            }
        },
        buildContextMenu: function (mapObj, cmenuId, cClass) {
			if(!$('#' + cmenuId).length){
				var $dropdown = $('<div />').addClass(cClass).attr('id', cmenuId),
					$ul = $('<ul />');
				for (i in mapObj) {
					$ul.append($('<li class=' + mapObj[i].liCls + '><a href="javascript:;" id=' + mapObj[i].id + '>' + mapObj[i].text + '</a></li>'));
				}
				$dropdown.append($ul);
				$('body').append($dropdown);
				$('#' + cmenuId).find('ul li').filter(':first').addClass('paddingT10').end().filter(':last').addClass('paddingB10');
			}
        },
        bindContextMenuEvents: function (mapObj, cmenuId, getTarget) {
            var cmenu = $('#' + cmenuId);
			cmenu.find('a').unbind('mouseover mouseout').bind('mouseover mouseout', function (e) {
				if (e.type == "mouseover") {
					$(this).addClass('hover'); // Mouseover Background color
				} else {
					$(this).removeClass('hover'); // Remove Mouseover Background color
				} 
			});
			$(document).mousedown(function(e){
				if(cmenu.has(e.target).length){
					cmenu.find('a').unbind('click').bind('click', function (e) {
						if (!$(this).hasClass(config.disableMenuCls)) {
							var $i = cmenu.find('a').index($(this));
							if (targetDetailsObj) {
								mapObj[$i].callBk(targetDetailsObj);
							} else {
								mapObj[$i].callBk();
							}
							 cmenu.hide();
						} else {
							cmenu.show();
							return false;
						}
					});
				}else{
					cmenu.hide();
					targetNode.removeClass(config.activeCls).children().removeClass(config.activeCls);
					targetNode.find('.'+config.activeBtnCls).hide().removeClass(config.activeBtnCls).children().removeClass(config.activeBtnCls);
					getTarget(e.target,config.activeCls,config.activeBtnCls);
				}
			});
           
            $(window).bind('resize',function(){
				$('.'+config.cClass).hide();
            });
        },
        createActionBtn: function (targetElem, cmenuId, menuChangeState, getTargetDetails, getTargetNode, funcName) {
                var cmenu = $('#' + cmenuId),
                iconEl = $('<span />').addClass(config.actionBtnClass).unbind('mouseover mouseout click').bind('mouseover mouseout click', function (e) {
                    if (e.type == "mouseover") {
                        $(this).addClass('hover');
                    } else if (e.type == "mouseout") {
                        $(this).removeClass('hover');
                    } else {
                        e.stopPropagation();
                        targetEl = $(this);
                        cmenu.hide();
						targetEl.addClass(config.activeBtnCls);
                        cmenuPos = $.fn.contextMenu.getCmenuPosition(e, targetEl, cmenuId, config.actionBtnPos);
                        menuChangeState(e.target, cmenuId, config.disableMenuCls);
                        targetDetailsObj = getTargetDetails(e.target);
                        cmenu.css(cmenuPos).show();
                        return false;
                    }
                });
                targetNode = getTargetNode(targetElem);
                if (targetNode) {
                    targetNode.find('.'+config.actionBtnClass).remove().end().append(iconEl);
                    targetNode.live('mouseover mouseout', function (e) {
                        e.stopPropagation();
                        if (e.type == "mouseover" && !$(this).hasClass('disabled') && !$(this).children().hasClass('disabled')) {
                            $(this).children('.' + config.actionBtnClass).show();
                        } else if (e.type == "mouseout" && !$(this).hasClass(config.activeBtnCls) && !$(this).children().hasClass(config.activeBtnCls)) {
                            $(this).children('.' + config.actionBtnClass).hide();
                        }
                    });
                }
            return false;
        },
        fnContextMenu: function (targetElem, contextMenuFlag, funcName, cmenuId, menuChangeState, getTargetDetails,getTarget) {
            var targetElement = $('#' + targetElem),cmenu = $('#' + cmenuId);
			targetElement.mousedown(function (e) {
                if (contextMenuFlag) {
                    if (e.which === 3 && targetElement.has(e.target).length && !$(e.target).hasClass('disabled') && !$(e.target).attr('readonly')) {
                        $(e.target).unbind('contextmenu').bind("contextmenu", function (e) {
                            var targetEl = $(this);
                            cmenu.hide();
							var currTarget = getTarget(e.target),target;
							if(targetNode.has(currTarget).length){
								target = currTarget.parent();
							} else {
								target = currTarget;
							}
							target.addClass(config.activeCls);
							cmenuPos = $.fn.contextMenu.getCmenuPosition(e, targetEl, cmenuId, funcName);
                            menuChangeState(e.target, cmenuId, config.disableMenuCls);
                            targetDetailsObj = getTargetDetails(e.target);
                            cmenu.css(cmenuPos).show();
                            return false;
                        });
                    } else {
                        cmenu.hide();
                    }
                } else {
                   vmf.cmenu.unbind(e.target);
                }
            });
        },
        unbindContextMenu: function (target) {
            $(target).unbind('contextmenu');
        },
        getCmenuPosition: function (evt, targetEl, cmenuId, funcName) {
            var getLeftPos, getTopPos, getInvTopPos, cssObj, winHeight, cmenuHeight, $window = $(window);
            if (funcName === "default") {
                getLeftPos = targetEl.offset().left + targetEl.outerWidth() - 18;
                getTopPos = targetEl.offset().top + targetEl.outerHeight() / 2 + 3;
            } else if (funcName === "cursorPosition") {
                getLeftPos = evt.clientX + 10;
                getTopPos = targetEl.offset().top + targetEl.outerHeight() / 2;
            } else if (funcName == "target") {
                getLeftPos = targetEl.offset().left;
                getTopPos = targetEl.offset().top + targetEl.outerHeight() + 2;
                getInvTopPos = targetEl.offset().top-2;
            }
            winHeight = $window.height(),
            cmenuHeight = $('#' + cmenuId).outerHeight();
            if (getTopPos + cmenuHeight > winHeight + $window.scrollTop() > 0) {
                getTopPos = (getInvTopPos)? (getInvTopPos - cmenuHeight) : (getTopPos - cmenuHeight);
            }
            cssObj = {
                'left': getLeftPos,
                'top': getTopPos
            };
            return cssObj;
        }
    };
})(jQuery);

vmf.cmenu = {
    show: function (options) {
        $.fn.contextMenu.init(options);
    },
    unbind: function(target) {
        $.fn.contextMenu.unbindContextMenu(target);
    }
};