/* ########################################################################### *
/* ***** DOCUMENT INFO  ****************************************************** *
/* ########################################################################### *
 * ##### NAME:  datatable_validate.js
/* ########################################################################### */


if (typeof(myvmware) === "undefined"){  
	myvmware = {};
}
  
/*jQuery.validator.addMethod("notEqual", function(value, element, param) {
  return this.optional(element) || value !== param;
}, "*Required");
*/
  
myvmware.dt_validate = {
    init: function() {
        // code which should be run on all dt_validate pages
        
   },
    validate_addForm: function(){
        // Validation code
        $("#addEntryForm").validate({
          errorPlacement: function(error, element) {
               element.parent().find("div.error").html(error);
            },
		  submitHandler : function(form){
	            myvmware.supportAdmin.fnOnAddRow();
	            return false; 	
	       },
          rules: {
            addCategory: {
              required: true,
			  notEqual: "Enter Issue Category"
            },
            addIssueType: {
              //select
              required: true
            },
            addDetails: {
              //text
              required: true,
			  notEqual: "Enter KB Article ID"
            },
            addContentType: {
              //select
              required: true
            },
            addArticle: {
              //text
              required: true,
			  notEqual: "Enter Article Title"
            }
          },
          messages: {
            addCategory: {
              required: "*Required"
            },
            addIssueType: {
              required: "*Required"
            },
            addDetails: {
              required: "*Required"
            },
            addContentType: {
              //text
              required: "*Required"
            },
            addArticle: {
              //text
              required: "*Required"
            }
           }
        });
	},
	validate_editForm: function(){
		 $("#editForm").validate({
          errorPlacement: function(error, element) {
               element.parent().find("div.error").html(error);
            },
		  submitHandler : function(form){
	            myvmware.supportAdmin.fnOnEditSave();
	            return false; 	
	       },
          rules: {
            editCategory: {
              required: true,
            },
            editIssueType: {
              //select
              required: true
            },
            editDetails: {
              //text
              required: true,
            },
            editContentType: {
              //select
              required: true
            },
            editArticle: {
              //text
              required: true,
            }
          },
          messages: {
            editCategory: {
              required: "*Required"
            },
            editIssueType: {
              required: "*Required"
            },
            editDetails: {
              required: "*Required"
            },
            editContentType: {
              //text
              required: "*Required"
            },
            editArticle: {
              //text
              required: "*Required"
            }
           }
        });
    }
   }  

   