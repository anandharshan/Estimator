vmf.sbox = function($){
    return {
        build: function(id, config){
            var elm = null;
            var body = null;
            var head = null;
            var ipt = null;
            var c = {
                onChange: null,
                onOpen: null,
                onClose: null,
                width: null
            };
            var h = [];
            var idx = -1;
            // parameter checking
            if (!id || (elm = $("#" + id)) == null) 
                throw "Element not existed.";
            // extend the default configuration
            $.extend(c, config);
            // get the width of the select box
            c.width = c.width || elm.outerWidth();
            // set the button width
            c._btnWidth = 20;
            // loop through the options
            var opt = null;
            var opts = elm.children();
            var selOpt = elm.find("option:selected");
            var ct = 0;
            var gOpt = null;
            var gOpts = null;
            idx = selOpt[0].index;
            h = [];
            h.push("<div id='" + id + "_sbox' style='width:" + c.width + "px' class='" + "sbox_cont'><div class='header'><div style='width:" + (c.width - c._btnWidth) + "px' class='lbl'><div>");
            h.push(selOpt.text());
            h.push("</div></div><div style='width:" + c._btnWidth + "px' class='btn'><div>&diams;</div></div></div><div class='body'><ul>");
            for (var i = 0; i < opts.length; i++) {
                opt = $(opts[i]);
                if (opt.is("optgroup")) {
                    h.push("<li style='width:" + c.width + "px'><div idx='" + ct + "' class='sbLabel' value='" + opt.attr("value") + "'>" + opt.attr("label") + "</div></li>");
                    ct = ct + 1;
                    gOpts = opt.children();
                    for (var j = 0; j < gOpts.length; j++) {
                        gOpt = $(gOpts[j]);
                        h.push("<li style='width:" + c.width + "px'><a href='#'idx='" + ct + "' class='sbLink" + ((ct == idx) ? " selected" : "") + "' value='" + gOpt.attr("value") + "'>" + gOpt.text() + "</a></li>");
                        ct = ct + 1;
                    }
                }
                else {
                    if(opt.hasClass("sbLabel"))
                        h.push("<li style='width:" + c.width + "px'><div idx='" + ct + "' class='sbLabel' value='" + opt.attr("value") + "'>" + opt.text() + "</div></li>");
                    else
                        h.push("<li style='width:" + c.width + "px'><a href='#' idx='" + ct + "' class='sbLink" + ((ct == idx) ? " selected" : "") + "' value='" + opt.attr("value") + "'>" + opt.text() + "</a></li>");
                    ct = ct + 1;
                }
            }
            h.push("</ul></div></div><input type='hidden' name='" + elm.attr("name") + "' id='" + elm.attr("id") + "' value='" + elm.val() + "'/>");
            elm.replaceWith(h.join(""));
            // update the element
            elm = $("#" + id + "_sbox");
            body = $("#" + id + "_sbox > div.body > ul");
            head = $("#" + id + "_sbox > div.header > div.lbl > div");
            ipt = $("#" + id);
            // add event handlers
            elm.click(function(e){
                var t = $(e.target);
                var d = $(document);
                var handleMd = function(e){
                    var t = $(e.target);
                    var ol = body.find("li > a[@class*='selected']");
                    if (t.hasClass("sbLink")) {
                        ol.removeClass("selected");
                        head.html(t.text());
                        ipt.val(t.attr("value"));
                        c.value = t.attr("value");
                        t.addClass("selected");
                        if (c.onChange) 
                            c.onChange();
                    }
                    if (c.onClose) 
                        c.onClose();
                    body.hide();
                    d.unbind("mousedown", handleMd);
                }
                if (t.is("div")) {
                    if (c.onOpen) 
                        c.onOpen();
                    body.css("top", (head.height() + 4)).show();
                    d.mousedown(handleMd);
                }
            });
        }
    };
}(jQuery);
