jQuery.extend({

    createUploadIframe: function(id, uri){
        //create frame
        var frameId = 'jUploadFrame' + id;

        if (window.ActiveXObject) {
            var io = document.createElement('<iframe id="' + frameId + '"name="' + frameId + '" />');
            if (typeof uri == 'boolean') {
                io.src = 'javascript:false';
            }
            else
                if (typeof uri == 'string') {
                    io.src = uri;
                }
        }
        else {
            var io = document.createElement('iframe');
            io.id = frameId;
            io.name = frameId;
        }
        io.style.position = 'absolute';
        io.style.top = '-1000px';
        io.style.left = '-1000px';

        //document.body.appendChild(io);

        //var myframe_src = (typeof uri == 'boolean') ? 'javascript:false' :uri;
        // var myframe = '<iframe style="position:absolute;top:-1000px;left:-1000px" id="' + frameId + '"name="' + frameId + '" src="' + myframe_src + '"></iframe>';
        $('body').append(io);
        return io;

    },
    createUploadForm: function(id, fileElementId){
        //create form
        var formId = 'jUploadForm' + id;
        var fileId = 'jUploadFile' + id;
        var form = $('<form  action="" method="POST" name="' + formId + '"id="' + formId + '" enctype="multipart/form-data"></form>');
        var oldElement = $('#' + fileElementId);
        var newElement = $(oldElement).clone();
        $(oldElement).attr('id', fileId);
        $(oldElement).before(newElement);
        $(oldElement).appendTo(form);
        //set attributes
        $(form).css('position', 'absolute');
        $(form).css('top', '-1200px');
        $(form).css('left', '-1200px');
        $(form).appendTo('body');
        return form;
    },

    ajaxFileUpload: function(s){
        // TODO introduce global settings, allowing the client to modifythem for all requests, not only timeout
        s = jQuery.extend({}, jQuery.ajaxSettings, s);
        var id = new Date().getTime();
        var form = jQuery.createUploadForm(id, s.fileElementId);
        var io = jQuery.createUploadIframe(id, s.secureuri);
        var frameId = 'jUploadFrame' + id;
        var formId = 'jUploadForm' + id;
        // Watch for a new set of requests
        if (s.global && !jQuery.active++) {
            jQuery.event.trigger("ajaxStart");
        }
        var requestDone = false;
        // Create the request object
        var xml = {};
        if (s.global)
            jQuery.event.trigger("ajaxSend", [xml, s]);
        // Wait for a response to come back
        var uploadCallback = function(isTimeout){
            var io = document.getElementById(frameId);
            try {
                if (io.contentWindow) {
                    xml.responseText = io.contentWindow.document.body ?io.contentWindow.document.body.innerHTML : null;
                    xml.responseXML = io.contentWindow.document.XMLDocument? io.contentWindow.document.XMLDocument : io.contentWindow.document;

                }
                else
                    if (io.contentDocument) {
                        xml.responseText = io.contentDocument.document.body? io.contentDocument.document.body.innerHTML : null;
                        xml.responseXML =io.contentDocument.document.XMLDocument ?io.contentDocument.document.XMLDocument : io.contentDocument.document;
                    }
            }
            catch (e) {
                $.handleError(s, xml, null, e);
            }
			if (xml || isTimeout == "timeout") {
                requestDone = true;
                var status;
                try {
                    status = isTimeout != "timeout" ? "success" : "error";
                    // Make sure that the request was successful ornotmodified
                    if (status != "error") {
                        // process the data (runs the xml through httpDataregardless of callback)
                        var data = jQuery.uploadHttpData(xml, s.dataType);
                        // If a local callback was specified, fire it andpass it the data
                        if (s.success)
                            s.success(data, status);
                        // Fire the global callback
                        if (s.global)
                            jQuery.event.trigger("ajaxSuccess", [xml, s]);
                    }
                    else
                        $.handleError(s, xml, status);
                }
                catch (e) {
                    status = "error";
                    $.handleError(s, xml, status, e);
                }

                // The request was completed
                if (s.global)
                    jQuery.event.trigger("ajaxComplete", [xml, s]);

                // Handle the global AJAX counter
                if (s.global && !--jQuery.active)
                    jQuery.event.trigger("ajaxStop");

                // Process result
                if (s.complete)
                    s.complete(xml, status);

                jQuery(io).unbind();

                setTimeout(function(){
                    try {
                        $(io).remove();
                        $(form).remove();

                    }
                    catch (e) {
                        $.handleError(s, xml, null, e);
                    }

                }, 100);

                xml = null;

            }
        }
        // Timeout checker
        if (s.timeout > 0) {
            setTimeout(function(){
                // Check to see if the request is still happening
                if (!requestDone)
                    uploadCallback("timeout");
            }, s.timeout);
        }
        try {
            // var io = $('#' + frameId);
            var form = $('#' + formId);
            $(form).attr('action', s.url);
            $(form).attr('method', 'POST');
            $(form).attr('target', frameId);
			$.each(s.ppost, function(i, val) {
				$(form).append(
				'<input type="hidden" name="'+i+'" value="'+val+'"'+'/>'
				);
			});
            if (form.encoding) {
                form.encoding = 'multipart/form-data';
            }
            else {
                form.enctype = 'multipart/form-data';
            }
            $(form).submit();

        }
        catch (e) {
            $.handleError(s, xml, null, e);
        }
        if (window.attachEvent) {
            document.getElementById(frameId).attachEvent('onload',uploadCallback);
        }
        else {
            document.getElementById(frameId).addEventListener('load',uploadCallback, false);
        }
        return {
            abort: function(){
            }
        };

    },

    uploadHttpData: function(r, type){
        var data = !type;
        data = (type == "xml" || data) ? r.responseXML : r.responseText;
        // If the type is "script", eval it in global context
        if (type == "script") {
            jQuery.globalEval(data);
        }
        // Get the JavaScript object, if JSON is used.
        if (type == "json") {
            eval("data = " + data);
        }
        // evaluate scripts within html
        if (type == "html") {
            //  jQuery("<div>").html(data).evalScripts();
            //jQuery("<div>").html(data);
        }

        //alert($('param',
        //data).each(function(){alert($(this).attr('value'));}));
        return data;
    }

}); 
