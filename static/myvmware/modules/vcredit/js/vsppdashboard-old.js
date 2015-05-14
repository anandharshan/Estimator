angular
    .module('vsppDashboardConfig', ['ui.bootstrap', 'ui.router', 'ajaxModule'])
      .config(function myAppConfig($stateProvider, $urlRouterProvider, $sceProvider) {
        $urlRouterProvider.otherwise('/');
        $sceProvider.enabled(false);
        $stateProvider
            .state('vsppdashboard', {
                url: '/',
                templateUrl: '/static/myvmware/modules/vcredit/templates/dashboard/vsppdashboard.tpl.html',
                controller: 'vsspdashboardCtrl'
            })
    })
    .factory('newServiceFactory', function($http, ajaxCall) {
        var factory = {};
        factory.dashboardObj = {};
		factory.globalVars = vSpp.globalVars;
        factory.getServices = function(callbackFn, method, url, data) {
            //console.log(callbackFn, method, url, data);
            ajaxCall.call(url, method, data, callbackFn);
        }
        factory.postServices = function(successFn, errorFn, url, data, method) {
            ajaxCall.call(url, method, data, successFn, errorFn);
        }
        return factory;

    }).factory('vmf',function(){
        return vmf;
    })
    .controller('vsspdashboardCtrl',['$scope', '$state', '$modal', 'newServiceFactory', '$compile',function($scope, $state, $modal,newServiceFactory,$compile) {
            $scope.globalVars = {};
            $scope.showLoader = true;
            $scope.vspplistObj={};
            $scope.userList = [];
            $scope.renameDiv =false;
            $scope.vsppIdentifierFlag = true;
            $scope.vsppCurrentIdentifier={};
            $scope.modaServiceData = {};
            $scope.addedName = null;
            $scope.resetFlag = false;
            $scope.continueFlag = false;
            $scope.fundTrue = false;
            $scope.disableClear = false;
            $scope.confirmDisable = true;
            $scope.continueBtn = true;
            $scope.disableSave = false;
            var indexVar = null;
              var addDataObj = {};
              $scope.addsuccess = {};
              $scope.isEmpty = function(val) {
                return (val === undefined || val == null || val.length <= 0) ? true : false;
             }
              angular.copy(newServiceFactory.globalVars,$scope.globalVars);
              //console.info("Inside controller");
              newServiceFactory.postServices(
                function(successData) {
                    //$scope.showLoader = false;
                    if (!$scope.isEmpty(successData.ERROR_MESSAGE)) {
                        $scope.$apply(function() {
                            vmf.msg.page(successData.ERROR_MESSAGE, "", "danger",".alertBoxMainContainer");
                            $scope.showLoader = false;
                        });
                    }else{
                        $scope.$apply(function(){                        
                            $scope.vspplistObj = successData;
                            $scope.accountInfo =  $scope.vspplistObj.vsppAirDashBoardDisplay.vsppIdentifierDetail;
                            //console.log($scope.accountInfo);
                            $scope.showLoader = false;
                            $scope.vsppIdentifierList = $scope.vspplistObj.vsppAirDashBoardDisplay.vsppIdentifier;
                            /*angular.forEach($scope.accountInfo, function(k,v) {
                                var x = k.aaData;
                                var y = $("#subscriptionServiceTable"+v);
                                //console.log(k[v].aaData);//$('#' + tableId + 'Cont'), 
                                //console.log($scope.accountInfo[v].aaData);
                                $scope.displaySubscriptionServiceTable(x,y); 

                            });*/
                            /*if ($scope.accountInfo.subscriptionServiceFlag) {
                                $scope.displaySubscriptionServiceTable();   
                            }*/
                            //$scope.userList = $scope.vspplistObj.vsppAirDashBoardDisplay.vsppIdentifierDetail.users[0];
                            //$scope.adminList = $scope.vspplistObj.vsppAirDashBoardDisplay.vsppIdentifierDetail.users[1];
                            //$scope.usercategories();
                            //$scope.vsppCurrentIdentifier = $scope.vspplistObj.vsppAirDashBoardDisplay.vsppIdentifierDetail.vsppIdentifier;
                        });
                    }
                                     
                }, function(errorData) {
                },
              $scope.globalVars.getServiceUrl, // This comes from the jsp config object
                'GET'
            );
            $scope.usercategories = function(){
                $scope.usersAdminObject = [];
                angular.forEach($scope.adminList, function(value) {
                    //$scope.abcd.push($scope.userList[value]);
                        $scope.usersAdminObject.push({
                                        id: value,
                                        name: $scope.userList[value]
                                    });
                        delete $scope.userList[value];
                        //angular.copy(usersAdminObject, $scope.usersAdminObject);

                });
                $scope.usersObjectList();
            }
            $scope.usersObjectList= function(){
                $scope.usersNonAdminObject = [];
                angular.forEach($scope.userList, function(key,value) {
                    //$scope.abcd.push($scope.userList[value]);
                        $scope.usersNonAdminObject.push({
                                        id:value,
                                        name:key 
                                    });
                });
                //console.log($scope.usersNonAdminObject);
            }
            $scope.rename = function($index) {
                var renameIndex = $index;
                $('.form-control').eq(renameIndex).parsley('validate');
                $('.form-control').eq(renameIndex).val($('.vsppSubHeader').eq(renameIndex).find('span').text());
                $('.changeNameCont').eq(renameIndex).show('slow');
                $('.vsppSubHeader').eq(renameIndex).hide('slow');                    
                /*$scope.vsppCurrentIdentifier = $('.form-control').eq($index).val($('.renameEdit').eq($index).find('h3.headFnd').find('span').text());
                console.log($scope.vsppCurrentIdentifier);
                $scope.renameDiv = true;
                $scope.vsppIdentifierFlag = false;*/
            }
            $scope.validateRename = function($index){
                if (!$('.form-control').eq($index).parsley().isValid()){$scope.disableSave = true;}
                    else{$scope.disableSave = false;}                             
            }
        /*    $scope.save = function($index) {
                 var saveIndex = $index;
                var dataObj = {};
                $('.vsppSubHeader').eq(saveIndex).html($('.form-control').eq($index).val());
                dataObj.fundGroupName = $('.form-control').eq($index).val();
                //dataObj.fundGroupId = $scope.serviceData.fundGroups[saveIndex].fundName[1];
                $scope.SaveAddData = "fundGroupId=" + dataObj.fundGroupId + "&fundGroupName=" + escape(dataObj.fundGroupName);
                
                var alertRowLevelContainer = $(".alertBoxContainerRow").eq(saveIndex);
                vmf.msg.page("", "", "warning",alertRowLevelContainer);
                
                //var vsppIdentifierList = $scope.vsppIdentifierList[0];
                var vsppIdentifierSelectedVal = $scope.vsppIdentifierList[1];
                var vsppCurrentIdentifier = $('#VsppRename').val();
                var updatedIdentifier = {
                    "id" : vsppIdentifierSelectedVal,
                    "name" : vsppCurrentIdentifier
                }
                //console.log(updatedIdentifier);
                newServiceFactory.postServices(
                    function(successData) {
                        $scope.$apply(function() {
                        
                        $scope.vspplistObj.vsppAirDashBoardDisplay.vsppIdentifierDetail.vsppIdentifier = vsppCurrentIdentifier;
                        $scope.vsppCurrentIdentifier = vsppCurrentIdentifier;
                        //console.log($scope.vspplistObj.vsppIdentifierDetail.vsppIdentifier);
                        $scope.renameDiv = false ;
                        $scope.vsppIdentifierFlag = true;
                    });
                       //$scope.saveRenameData(successData);
                    }, function(errorData) {
                    },
                    $scope.getServiceUrl, // This comes from the jsp config object
                    $scope.SaveAddData,
                    'GET'
                );

            }*/
            $scope.save = function($index) {
                var saveIndex = $index;
                var dataObj = {};
                $('.vsppSubHeader').eq(saveIndex).find('span').html($('.form-control').eq($index).val());
                dataObj.fundGroupName = $('.form-control').eq($index).val();
                dataObj.fundGroupId = $scope.vspplistObj.vsppAirDashBoardDisplay.vsppIdentifierDetail[saveIndex].id; //$scope.serviceData.fundGroups[saveIndex].fundName[1];
                $scope.SaveAddData = "fundGroupId=" + dataObj.fundGroupId + "&fundGroupName=" + escape(dataObj.fundGroupName);
                
               // var alertRowLevelContainer = $(".alertBoxContainerRow").eq(saveIndex);
                //vmf.msg.page("", "", "warning",alertRowLevelContainer);
                
                newServiceFactory.postServices(
                    function(successData) {
                        if (!$scope.isEmpty(successData.ERROR_MESSAGE)) {
                             $scope.displaySaveError = successData.ERROR_MESSAGE;
                            $scope.fundFlag = false;
                            $scope.fundInitialFlag = true;
                            // Display modal if error
                            /*$scope.displayInfoModal({
                                'header': vCredit.globalVars.header,
                                'body': successData.ERROR_MESSAGE,
                                'okText': vCredit.globalVars.okText,
                                'cancelText': vCredit.globalVars.cancelText,
                                'showOk': true,
                                'showCancel': false
                            });*/
                            vmf.msg.page(successData.ERROR_MESSAGE, "", "warning",alertRowLevelContainer); //success/info/warning/danger
                            $('.renameEdit').eq(saveIndex).find('.renameDash').show();
                            $('.renameEdit').eq(saveIndex).find('h3.headFnd').hide();

                        } else {
                            // $scope.$apply(function() {
                            $scope.saveRenameData(successData);
                            //})
                        }

                    }, function(errorData) {
                        $scope.displaySaveError = errorData.ERROR_MESSAGE;
                        $scope.fundFlag = false;
                        $scope.fundInitialFlag = true;
                        /*$scope.displayInfoModal({
                            'header': vCredit.globalVars.header,
                            'body': vCredit.globalVars.ERROR_MESSAGE,
                            'okText': vCredit.globalVars.okText,
                            'cancelText': vCredit.globalVars.cancelText,
                            'showOk': true,
                            'showCancel': false
                        });*/
                        $scope.displaySaveError = errorData.ERROR_MESSAGE;
                        $('.renameEdit').eq(saveIndex).find('.renameDash').show();
                        $('.renameEdit').eq(saveIndex).find('h3.headFnd').hide();
                    },
                    $scope.globalVars.renameFundGroupURL, // This comes from the jsp config object
                    $scope.SaveAddData,
                    'GET'
                );


                //need to check --
                $scope.saveRenameData = function(data) {
                    //console.log(data);
                    if (data.status == "success") {
                        $scope.$apply(function() {
                            //$scope.displaySaveMessage = vCredit.globalVars.renameSuccess;
                            $scope.changedFundName = dataObj.fundGroupName;
                            $scope.fundFlag = true;
                            $scope.fundInitialFlag = false;
                            $('.changeNameCont').eq(saveIndex).hide('slow');
                            $('.vsppSubHeader').eq(saveIndex).show('slow'); 

                            //$('.renameEdit').eq(saveIndex).find('h3.headFnd').show('slow');
                            //$('.renameEdit').eq(saveIndex).find('.renameDash').hide('slow');
                        })

                    }
                    if (data.status == "error") {
                        $scope.$apply(function() {
                            $scope.fundFlag = false;
                            $scope.fundInitialFlag = true;
                           // $scope.displayErrorMessage = vCredit.globalVars.renameError;
                        })
                    }
                }
            }
            $scope.cancel = function($index) {
                var cancelIndex = $index;
                $('.changeNameCont').eq(cancelIndex).hide('slow');
                $('.vsppSubHeader').eq(cancelIndex).show('slow');
                /*$scope.renameDiv = false ;
                $scope.vsppIdentifierFlag = true;*/
            }
            $scope.users = function($index) {
                removeUser = $index;
                $scope.selectedFundName = $('.vsppIdentifier').eq(removeUser).text(); //$scope.serviceData.fundGroups[$index].fundName[0];
                _VM_fundID = $scope.vspplistObj.vsppAirDashBoardDisplay.vsppIdentifierDetail[removeUser].id
                $scope.removefundGroupId = "fundGroupId=" + _VM_fundID;
                var alertRowLevelContainer = $(".alertBoxContainerRow");
                //$scope.postdashboardModalUrl ="/static/myvmware/modules/vcredit/json/vspp/removeuser.json";
                                vmf.msg.page("", "", "warning",alertRowLevelContainer);
                newServiceFactory.postServices(
                    function(successData) {
                        $scope.showLoader = false;
                        if (!$scope.isEmpty(successData.ERROR_MESSAGE)) {
                            $scope.removeErrorMessage = successData.ERROR_MESSAGE;
                            vmf.msg.page(successData.ERROR_MESSAGE, "", "warning",alertRowLevelContainer); //success/info/warning/danger
                        } else {
                            $scope.modalDataUser(successData);
                        }
                    }, function(errorData) {
                        $scope.showLoader = false;
                        $scope.removeErrorMessage = errorData.ERROR_MESSAGE;
                        vmf.msg.page(vCredit.globalVars.ERROR_MESSAGE, "", "warning",alertRowLevelContainer); //success/info/warning/danger
                    },
                    $scope.globalVars.postdashboardModalUrl, // This comes from the jsp config object
                    $scope.removefundGroupId,
                    'GET'
                );
            }
            $scope.modalDataUser = function(successData) {
                angular.copy(successData, $scope.modaServiceData);
               // console.log($scope.successData);
               // console.log($scope.modaServiceData);

                $scope.CurrModal = $modal.open({
                        templateUrl: '/static/myvmware/modules/vcredit/templates/dashboard/removeModal.tpl.html',
                        scope: $scope
                });
            }
            $scope.AllSerNoPermissions = function(value) {
                 $scope.ServiceId = value;//.attr('data-export');

                //angular.copy(successData, $scope.modaServiceData);
                //console.log($scope.ServiceId);
                //console.log('hi');

                $scope.CurrModal = $modal.open({
                        templateUrl: '/static/myvmware/modules/vcredit/templates/dashboard/AvailableAddons.html',
                        scope: $scope
                });
            }
            $scope.isCheckboxChecked = function() {
                if ($('.radio input:checkbox:checked').length > 0 && $('.terms input:checkbox:checked').length > 0) {
                    return true;
                }
            }
            $scope.confirm = function() {
                var dataConfirmObj = [];
                 var ea = $('.remuser input');
                for (var i = 0; i < ea.length; i++) {
                    if (ea[i].checked == true) {
                        //dataConfirmObj.push()
                        dataConfirmObj.push($(ea[i]).attr('id'));
                    }
                }
                //$scope.postServiceUrl="/static/myvmware/modules/vcredit/json/vspp/confirmRemUser.json";
                $scope.SubmitConfirmData = "fundGroupId="+ _VM_fundID +"&userId=" + dataConfirmObj;
                newServiceFactory.postServices(
                    function(successData) {
                        if (!$scope.isEmpty(successData.ERROR_MESSAGE)) {
                            $scope.displayErrorMessage = successData.ERROR_MESSAGE;

                        } else {
                            $scope.removeConfirmUser(successData);
                        }

                    }, function(errorData) {
                        $scope.displayErrorMessage = errorData.ERROR_MESSAGE;
                    },
                    $scope.globalVars.postServiceUrl, // This comes from the jsp config object
                    $scope.SubmitConfirmData, 'GET'
                );
            
            $scope.removeConfirmUser = function(successData) {
                if (successData.status = "success") {
                    $scope.$apply(function() {
                        for (var i = 0; i < dataConfirmObj.length; i++) {
                                deleteKey = dataConfirmObj[i];
                                delete $scope.vspplistObj.vsppAirDashBoardDisplay.vsppIdentifierDetail[removeUser].users[0][deleteKey]; 
                            }
                            //$scope.usersObjectList();
                        });
                        $scope.CurrModal.close();

                }
            }
            } 
            $scope.redeem = function($index) {
                _VM_fundID = $scope.vspplistObj.vsppAirDashBoardDisplay.vsppIdentifierDetail[$index].id;//$scope.serviceData.fundGroups[$index].fundName[1];
                var url = $scope.globalVars.ConfiguratorUrl + _VM_fundID;
                window.location.assign(url);
            }   
            
        $scope.displaySubscriptionServiceTable = function(responseData,index) {
             /*$scope.ssDTDyanamicCoulmns =[{
                    "columnHeading": "ServiceId",
                    "isVisible": true
                },
                {
                    "columnHeading": "Service Status",
                    "isVisible": true
                },
                {
                    "columnHeading": "Product",
                    "isVisible": true
                }];*/

            //angular.copy(responseData, $scope.expiredData);
            //$scope.showExpiredTable=true;
            //console.log($scope.globalVars);
            //console.log(tableId);
            var tableId = $("#subscriptionServiceTable"+index);
            vmf.include("datatable",function(){
                //console.log(tableId);
                //tableId.text('hi');
                 tableId.dataTable({
                    //"bStateSave": true,
                    "bPaginate": false,
                    "bLengthChange": false,
                    "bFilter": false,
                    "bInfo": false,
                    "bAutoWidth":false,
                    "bProcessing": true,
                    "bDestroy": true,
                    "aaData": responseData,
                     "aoColumns": [
                        {"sTitle": "<span class='descending'>"+$scope.globalVars.serviceID+"</span>"},
                        {"sTitle": "<span class='descending'>"+$scope.globalVars.serviceStatus+"</span>"},
                        {"sTitle": "<span class='descending'>"+$scope.globalVars.product+"</span>"},
                        {"sTitle": "<span class='descending'>"+$scope.globalVars.termEnd+"</span>"}
                        //{"sTitle": "<span class='descending'>"+$scope.globalVars.actions+"</span>"}
                        //{"sTitle": "<span class='descending'>"+'Cost per month'+"</span>","sWidth":"70px"}
                    ], 
                    "fnRowCallback": function(nRow, aData, columIndex) {
                        var $nRow=$(nRow),
                        className = 'alertColor'+aData[5], icon = 'alertIcon'+aData[5];
                        $nRow.find("td:eq(1)").html("<span class='"+icon+" alertTxtSpace' title='' style='float:left'></span>"+aData[1]);
                        var serviceStatus = aData[1];
                        if(serviceStatus.toUpperCase() == "Cancelled".toUpperCase() || serviceStatus.toUpperCase() == "Suspended".toUpperCase() || serviceStatus.toUpperCase() == "Terminated".toUpperCase()){
                            $nRow.find('td:eq(1)').css('color','#CCC');
                        }else{
                            $nRow.find('td:eq(1)').addClass(className);                    
                            //$nRow.find('td:eq(5)').addClass(className);
                        }

                        if(serviceStatus.toUpperCase() == "Active".toUpperCase()) {
                            var detailsUrl = '<a href="'+$scope.globalVars.sidPageURL+''+aData[4]+'">'+aData[0]+'</a>';//'<a href="'+viewDetailsUrl+'&_VM_serviceInstanceId='+encodeURIComponent(aData[10])+'&_VM_serviceInstanceName='+encodeURIComponent(aData[11])+'&_VM_subscriptionType='+aData[3]+'&_VM_instanceModel='+encodeURIComponent(aData[14])+'&_VM_daasFlag='+encodeURIComponent(aData[15])+'&_VM_daasDate='+encodeURIComponent(aData[16])+'">'+aData[2]+'</a>';
                            $nRow.find("td:eq(0)").html(detailsUrl).end();
                        }
                        if(aData[7] == '1'){
                            if (aData[8]=='1') {
                                $nRow.find('td:eq(4)').html('<a href="'+$scope.globalVars.purchaseAddOnUrl+'&_VM_serviceID='+encodeURIComponent(aData[4])+'&_VM_tokenFlag='+encodeURIComponent(aData[8])+'#/addOnService/configureAddons">'+$scope.globalVars.purchaseAddOnText+'</a>');
                            }else{
                                //var a = aData[4];
                                $nRow.find('td:eq(4)').html($compile('<a href="" data-export="'+encodeURIComponent(aData[4])+'" ng-click="AllSerNoPermissions(\''+aData[4]+'\')">'+$scope.globalVars.purchaseAddOnText+'</a>')($scope));
                            }
                        }else{
                            $nRow.find('td:eq(4)').html('');
                        }
                    },
                    "oLanguage": {
                        "sEmptyTable": ""
                    }
                
                });
            });

        }
            $scope.addUser = function($index) {
                vmf.include("parsley",function(){
                    indexVar = $index;
                    addFundId = $scope.vspplistObj.vsppAirDashBoardDisplay.vsppIdentifierDetail[indexVar].id;
                    //addFundId = $scope.serviceData.fundGroups[$index].fundName[1];
                    $scope.oldFundName = $('.vsppIdentifier').eq(indexVar).text(); //scope.serviceData.fundGroups[$index].fundName[0];
                    $scope.resetAdd();
                    $scope.CurrModal = $modal.open({
                        templateUrl: '/static/myvmware/modules/vcredit/templates/dashboard/addUser.tpl.html',
                        scope: $scope,
                        windowClass: 'overlay-lg'
                    });
                    
                    $scope.CurrModal.opened.then(function(){
                        setTimeout(function () {$("#addUserForm").parsley();},10);
                    });
                });            
            }
            $scope.resetAdd = function() {
                $scope.disableClear = false;
                $scope.fundTrue = false;
                $scope.validTrue = false;
                $scope.emsTrue = false;
                $scope.errorTrue = false;
                $scope.resetFlag = false;
                $scope.confirmDisable = true;
                $('.addSection').css('opacity', '1');
                $scope.addedName = '';
                $scope.addedEmail = '';
                $scope.clearFields();
                $scope.displayModalErrorMessage="";
            }
            $scope.add = function() {
                addDataObj._VM_fundId = addFundId;
                //$scope.postaddUserServiceUrl = "/static/myvmware/modules/vcredit/json/vspp/adduser.json"
                addDataObj._VM_userFirstName = $('#firstName').val();
                addDataObj._VM_userLastName = $('#lastName').val();
                addDataObj._VM_userEmailAddress = $('#inputEmail').val();
                $scope.SaveAddUserData = "fundGroupId=" + addDataObj._VM_fundId + "&userFirstName=" + addDataObj._VM_userFirstName + "&userLastName=" + addDataObj._VM_userLastName + "&userEmailAddress=" + addDataObj._VM_userEmailAddress;
                 var JaLocale = $("#localeFromLiferayTheme").text().split("_");
                ///alert(JaLocale[0]);locale changes
                if(JaLocale[0] == 'ja' || JaLocale[0] =='jp') {
                    $scope.JaLocale = true;
                }else{$scope.JaLocale = false;}
                 newServiceFactory.postServices(
                    function(successData) {
                        $scope.showModalLoader = false;
                        if (!$scope.isEmpty(successData.ERROR_MESSAGE)) {
                        $scope.displaySaveError = successData.ERROR_MESSAGE;

                        } else {
                            // $scope.$apply(function() {
                            $scope.saveUserData(successData);
                            //})
                        }

                    }, function(errorData) {
                        $scope.showModalLoader = false;
                        $scope.displaySaveError = errorData.ERROR_MESSAGE;
                    },
                    $scope.globalVars.postaddUserServiceUrl, // This comes from the jsp config object
                    $scope.SaveAddUserData,
                    'GET'
                );
            }
            $scope.saveUserData = function(data) {
                    angular.copy(data.validateUser, $scope.addsuccess);
                    $scope.validEMSUser = "validEmsUser Message";
                    ////console.log($scope.addsuccess);
                    newKey = $scope.addsuccess.userId;
                    if ($scope.addsuccess.status == "success" && $scope.addsuccess.validVMWareUser == "true" && $scope.addsuccess.validEMSUser == "true") {

                        $scope.$apply(function() {
                            $scope.addedName = addDataObj._VM_userFirstName + " " + addDataObj._VM_userLastName;
                            $scope.addedJaName = addDataObj._VM_userLastName + " " + addDataObj._VM_userFirstName;
                            $scope.addedEmail = addDataObj._VM_userEmailAddress;
                            $scope.resetFlag = true;
                            $scope.fundTrue = true;
                            $scope.validTrue = true;
                            $scope.confirmDisable = false;
                            $scope.continueBtn = true;
                            $scope.disableClear = true;
                            $('.addSection').css('opacity', '0.6');
                        })


                    }

                    if ($scope.addsuccess.status == "success" && $scope.addsuccess.validVMWareUser == "true" && $scope.addsuccess.validEMSUser == "false") {

                        $scope.$apply(function() {
                            $scope.addedName = addDataObj._VM_userFirstName + " " + addDataObj._VM_userLastName;
                            $scope.addedJaName = addDataObj._VM_userLastName + " " + addDataObj._VM_userFirstName;
                            $scope.addedEmail = addDataObj._VM_userEmailAddress;
                            $scope.resetFlag = true;
                            $scope.emsTrue = true;
                            $scope.fundTrue = true;
                            $scope.confirmDisable = false;
                            $scope.continueBtn = true;
                            $scope.disableClear = true;
                            $('.addSection').css('opacity', '0.6');
                        })


                    }
                    if ($scope.addsuccess.status == "failure") {
                        $scope.$apply(function() {
                            $scope.addedName = addDataObj._VM_userFirstName + " " + addDataObj._VM_userLastName;
                            $scope.addedJaName = addDataObj._VM_userLastName + " " + addDataObj._VM_userFirstName;
                            $scope.addedEmail = addDataObj._VM_userEmailAddress;
                            $scope.resetFlag = true;
                            $scope.confirmDisable = true;
                            $scope.fundTrue = true;
                            $scope.errorTrue = true;
                            $scope.continueBtn = true;
                            $scope.disableClear = true;
                            $('.addSection').css('opacity', '0.6');
                        })
                    }

                }
           $scope.clearFields = function() {
                $('#firstName').val('');
                $('#lastName').val('');
                $('#inputEmail').val('');

            }
            $scope.userEmpty = function() {
                var addFields = $('.addSection input');
               // console.log(abc);
                for (var i = 0; i < addFields.length; i++) {
                    if (addFields[i].value !== "") {
                        $scope.continueBtn = false;
                    } else {
                        $scope.continueBtn = true;
                    }
                }
        //Disabling the button ....
                if (!$("#addUserForm").parsley().isValid()){$scope.continueBtn=true;return false;}else{$scope.continueBtn=false;}

            }
            $scope.modalClose = function() {
                $scope.CurrModal.close();
            }
            $scope.close = function() {
                $scope.CurrModal.close();
            }
            $scope.confirmUserData = function(successData) {
                    if ($scope.addsuccess.status == "success") {
                        $scope.$apply(function() {
                           $scope.vspplistObj.vsppAirDashBoardDisplay.vsppIdentifierDetail[indexVar].users[0][newKey] = $scope.addedName;


                                /*$scope.serviceData.fundGroups[indexVar].usersArray.push({
                                    id: newKey,
                                    name: $scope.addedName
                                });*/
                                /*$scope.usersNonAdminObject.push({
                                    id: newKey,
                                    name: $scope.addedName
                                })*/
                            })
                    } else if ($scope.addsuccess.status == "failure") {
                        $scope.displayModalErrorMessage = validateUser.ERROR_MESSAGE;
                    }
                    $scope.CurrModal.close();
                }
                $scope.confirmAdd = function() {
                    //$scope.confirmAddUserServiceUrl = "/static/myvmware/modules/vcredit/json/vspp/validAddUser.json";
                $scope.confirmAddDes = "fundGroupId=" + addDataObj._VM_fundId + "&userId=" + newKey + "&userFirstName=" + addDataObj._VM_userFirstName + "&userLastName=" + addDataObj._VM_userLastName + "&userEmailAddress=" + addDataObj._VM_userEmailAddress + "&validEMSUser=" + $scope.validEMSUser;
                $scope.displayModalErrorMessage="";
                newServiceFactory.postServices(
                    function(successData) {
                        if (!$scope.isEmpty(successData.ERROR_MESSAGE)) {
                            $scope.displayModalErrorMessage = successData.ERROR_MESSAGE;
                            return false;
                        } else {
                            $scope.confirmUserData(successData);
                        }
                    }, function(errorData) {
                        $scope.displayModalErrorMessage = errorData.ERROR_MESSAGE;
                    },
                    $scope.globalVars.confirmAddUserServiceUrl, // This comes from the jsp config object
                    $scope.confirmAddDes,
                    'GET'
                );
            }
        
         }]).filter('customCurrency', ["$filter", function ($filter) {       
            return function(amount, currencySymbol, locale){
                var currency = $filter('currency'); 
                var finalCurr;
                if(amount < 0){         
                     finalCurr = currency(amount, currencySymbol).replace("(", "-").replace(")", ""); 
                } else {
                     finalCurr = currency(amount, currencySymbol);
                }                
                var sep = finalCurr.indexOf('.');
                if(locale == 'JPY') { 
                    return finalCurr.substring(0, sep);
                }else{
                    return finalCurr;
                }
            };
        }]);
        window.ParsleyConfig = {
        validators: {
          alphaNumWithSpace: {
            fn: function (value, requirements) {
                var pattern = /^[a-zA-Z0-9!@&_=\.\+\-\(\)\^\#\%\!\$\ \s]*$/i;
                if(pattern.test(value))
                    return true;
                else
                    return false;
            },
            priority: 2
          }
        }
    };