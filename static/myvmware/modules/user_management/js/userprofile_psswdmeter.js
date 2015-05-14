jQuery(document).ready(function() {
                var perc=0, $pwd="", $pwdlength=0;
                $('#user_newPassword').keyup(function(){
                $pwd=$(this).val();
                $pwdlength=$pwd.length;
                $('#result').html(passwordStrength($pwd)); 
                perc=passwordStrengthPercent($pwd);
                if(perc===0 && $pwdlength>0 && $pwdlength<6){
                                perc=5;
                } else if (perc >=68){
                                perc=100;
                }
                $('#colorbar').css("width",perc+"%");
                });
});
