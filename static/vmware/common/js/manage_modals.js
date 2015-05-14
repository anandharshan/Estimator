
		$(document).ready(function(){   
			// AcreateUser1
			jQuery("a#eula").click(function(){  // Add rule model popup
				vmf.modal.show("eula-content", { checkPosition: true });
			});
			
			
			$("#eula-content #btn_cancel1").click(function(){vmf.modal.hide();});
			
			
			/* To toggle button enable on clicking check box of terms and conditioins. */
			$("#agreeEULA").click(function(){
				var $this = $(this);
				$this.parent().parent().find('#btn_accept').toggleClass('disabled');
			});
		});
