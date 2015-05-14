if (typeof(myvmware) == "undefined")
    myvmware = {};

myvmware.evalExtn = {

    init : function(){

        $("#extnComments").val($("#defaultComment").val());
        $('.alert-box-wrapper').hide();

        $("#applyExtnButton").click(function(){

            $("#reqExtnForm").submit();
            return false;
        });

        $("#extnComments").focus(function(){

            if($("#extnComments").val().toLowerCase() == $("#defaultComment").val().toLowerCase()) {
                $("#extnComments").val("");
            }
        });

        $("#extnComments").blur(function(){

            if($("#extnComments").val() == '') {
                $("#extnComments").val($("#defaultComment").val());
            }
        });

        $("#extnComments").keyup(function(){

            var maxlength = $("#extnComments").attr('maxlength');
            var commentLength = $("#extnComments").val().length;

            if( commentLength < maxlength){

                $("#charRemaining").html(maxlength - commentLength);

            } else if( commentLength == maxlength){

                $("#charRemaining").html(0);

            } else {

                $("#extnComments").val($("#extnComments").val().substring(0, maxlength));
            }
        });
    },

    validateReqExtnForm : function(){

        $.validator.methods.customRule = function(value, element, param) {
              return value == param;
            };

         $.validator.addMethod(
            'defaultCheck', function (value, element) {
                if (element.value == $("#defaultComment").val()) {
                    return false;
                }
                return true;
       });


        $("#reqExtnForm").validate({

            rules : {

                'extnVO.reasonId' : {
                    required : true
                },
                'extnVO.comments' : {
                    required: true,
                    defaultCheck: true,
                    maxlength : $("#extnComments").attr('maxlength')
                }
            },
            messages : {

                'extnVO.reasonId' : {
                    required : "Required"
                },
                'extnVO.comments' : {
                    required : "Required",
                    defaultCheck: "Required",
                    maxlength : $.format(itevals.globalVar.enterChars)
                }
            },
            errorPlacement : function(error, element) {

                var errorDiv = element.parents('.ctrlHolder').find('.messageHolder');
                errorDiv.html(error);
                errorDiv.addClass('error');
                $('.alert-box-wrapper').show();
            },
            //onfocusout: function(element){
                //this.element(element);
            //},
            success : function(label) {
                label.parent().removeClass('error');
                $('.alert-box-wrapper').hide();
            },
            submitHandler : function(form){
                $('.alert-box-wrapper').hide();
                if($("#extnComments").val().toLowerCase() == $("#defaultComment").val().toLowerCase()) {
                    $("#extnComments").val("");
                }
                //set the reason text
                $("#reason").val($("#reqReason option:selected").text());
                form.submit();
            }
        });
    }
};