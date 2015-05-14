/* ########################################################################### *
/* ***** DOCUMENT INFO  ****************************************************** *
/* ########################################################################### *
 * ##### NAME:  registration.js
 * ##### VERSION: v0.1
 * ##### UPDATED: 05/08/2011
/* ########################################################################### */


if (typeof(myvmware) == "undefined")  
  myvmware = {};

myvmware.registration = {
    init: function() {
        // code which should be run on all registration pages
        
        
        
    },
    validate: function(){
        
        // Validation code
        $("form").validate({
          errorPlacement: function(error, element) {
            if(element.next('.tooltip').length>0){
              element.next('.tooltip').after(error);
            }else if(element.is('input[type=checkbox]')){
				element.next('*').after(error);
            }else{
              element.after(error);
            }
          },
          rules: {
            txt_email: {
              required: true,
              minlength: 10,
              email: true,
              //remote: "users.php"
            },
            txt_verify_email: {
              required: true,
              equalTo: '#txt_email'
            },
            password: {
              required: true
            },
            password_verify: {
              required: true,
              equalTo: "#password"
            },
            txt_firstName: {
              //text
              required: true
            },
            txt_lastName: {
              //text
              required: true
            },
            vmware_partner: {
              //raido
              required: true
            },
            sel_department: {
              //select
              required: true
            },
            sel_jobRole: {
              //text
              required: true
            },
            txt_work_phone: {
              //number
              required: true,
              number: true
            },
            interest_area: {
              //checkbox
              required: true
            },
            txt_company: {
              required: true
            },
            sel_industry: {
              //select
              required: true
            },
            sel_employees_globally: {
              //select
              required: true
            },
            sel_employees_country: {
              //select
              required: true
            },
            txt_address1: {
              //text
              required: true,
              minlength: 5
            },
            txt_city: {
              //select
              required: true
            },
            txt_zip_postal_code: {
              //text
              required: true,
              minlength: 5,
              number: true
            },
            country: {
              //select
              required: true
            },
            state_province: {
              //select
              required: true
            },
            txt_ISV_number: {
              //text
              required: true,
              number: true
            },
            purchased_vmware_products: {
              //radio
              required: true
            },
            number_servers: {
              //select
              required: true
            },
            windows_on_mac: {
              //select
              required: true
            },
            storage_type: {
              //checkbox
              required: true
            },
            terms_conditions: {
              //checkbox
              required: true
            }
          },
          messages: {
            txt_email: {
              required: "Enter your email address",
              minlength: "At least 10 characters are necessary",
              email: "Please enter a valid email address",
              //remote: String.format("The email address {0} is already in use <a href=\"\">Click here to reactivate</a>")
            },
            txt_verify_email: {
              required: "Enter your email address",
              equalTo: "Email addresses must match"
            },
            password_verify: {
                    required: "Required",
                    equalTo: "Password does not match"
                  },
            txt_firstName: {
              //text
              required: "Required"
            },
            txt_lastName: {
              //text
              required: "Required"
            },
            vmware_partner: {
              //raido
              required: "Required"
            },
            sel_department: {
              //select
              required: "Required"
            },
            sel_jobRole: {
              //select
              required: "Required"
      
            },
            txt_work_phone: {
              //number
              required: "Required",
              number: "Enter your work phone number"
            },
            interest_area: {
              //checkbox
              required: "Required"
            },
            txt_company: {
              required: "Required"
            },
            sel_industry: {
              //select
              required: "Required"
            },
            sel_employees_globally: {
              //select
              required: "Required"
            },
            sel_employees_country: {
              //select
              required: "Required",
            },
            txt_address1: {
              //text
              required: "Required",
              minlength: "At least 5 characters are necessary"
            },
            txt_city: {
              //select
              required: "Required"
            },
            txt_zip_postal_code: {
              //text
              required: "Required",
              minlength: "At least 5 characters are necessary"
            },
            country: {
              //select
              required: "Required"
            },
            state_province: {
              //select
              required: "Required"
            },
            txt_ISV_number: {
              //text
              required: "Required"
            },
            purchased_vmware_products: {
              //radio
              required: "Required"
            },
            number_servers: {
              //select
              required: "Required"
            },
            windows_on_mac: {
              //select
              required: "Required"
            },
            storage_type: {
              //checkbox
              required: "Required"
            },
            terms_conditions: {
              //checkbox
              required: "Required"
            }
          }
        });
    
    
    },
    showDependant: function(){

      $('#sel_employees_globally').change(function(){
  
        var targetedItem = $(this).parent().next();
        
        var globalVal = $(this).val();
        
        if(globalVal == 'Other'){
          $(targetedItem).removeClass('hidden');
        }else{
          $(targetedItem).addClass('hidden');
        }
      });
      
      $('#country').change(function(){
  
        var targetedItem = $(this).parent().next();
  
        var globalVal = $(this).val();
        
        if(globalVal == 'UNITED STATES'){
          $(targetedItem).removeClass('hidden');
        }else{
          $(targetedItem).addClass('hidden');
        }
      });
  
    }
  

  }