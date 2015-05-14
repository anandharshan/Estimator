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

    .directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if (event.which === 13) {
                    scope.$apply(function() {
                        scope.$eval(attrs.ngEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    })
    .directive('ngEscape', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if (event.which === 27) {
                    scope.$apply(function() {
                        scope.$eval(attrs.ngEscape);
                    });

                    event.preventDefault();
                }
            });
        };
    })

    .directive('myTable',function(){
        return function(scope, element, attrs) {
            vmf.include("datatable",function(){
                var tableId = attrs.id,
                    urlData = attrs.dataurl,
                    url= vSpp.globalVars.SubscriptionServices+""+urlData,
                    commitID = attrs.commit;
                //console.log(tableId);
                //tableId.text('hi');
                 $("#"+tableId).dataTable({
                    //"bStateSave": true,
                    "bPaginate": false,
                    "bLengthChange": false,
                    "bFilter": false,
                    "bInfo": false,
                    "bAutoWidth":false,
                    //"bProcessing": true,
                    "bServerSide" : false,
                    "bDestroy": true,
                    "sAjaxSource": url,
					"error": function(table,json){
						var err_msg = (json.ERROR_MESSAGE) ? json.ERROR_MESSAGE : vSpp.globalVars.Unable_to_process_your_request
						var emptyRow =table.find("tbody tr td.dataTables_empty");
						if(emptyRow.length) emptyRow.html(err_msg).closest("tr").show();
						else {
							$("<tr><td colspan="+table.fnSettings().aoColumns.length+" class=\"dataTables_empty\">"+err_msg+"</td></tr>").appendTo(table.find("tbody")).show();
						}
					},
                    //"aaData": SubscriptionServices.serviceDetails,
                     "aoColumns": [
                        {"sTitle": "<span class='descending'>"+vSpp.globalVars.serviceID+"</span>"},
                        {"sTitle": "<span class='descending'>"+vSpp.globalVars.serviceStatus+"</span>"},
                        {"sTitle": "<span class='descending'>"+vSpp.globalVars.product+"</span>"},
                        {"sTitle": "<span class='descending'>"+vSpp.globalVars.termEnd+"</span>"},
                        {"sTitle": "<span class='descending'>"+vSpp.globalVars.actions+"</span>"}
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
                            var detailsUrl = '<a href="'+vSpp.globalVars.goToAllServiceURL+aData[4]+'">'+aData[0]+'</a>';//'<a href="'+viewDetailsUrl+'&_VM_serviceInstanceId='+encodeURIComponent(aData[10])+'&_VM_serviceInstanceName='+encodeURIComponent(aData[11])+'&_VM_subscriptionType='+aData[3]+'&_VM_instanceModel='+encodeURIComponent(aData[14])+'&_VM_daasFlag='+encodeURIComponent(aData[15])+'&_VM_daasDate='+encodeURIComponent(aData[16])+'">'+aData[2]+'</a>';
                            $nRow.find("td:eq(0)").html(detailsUrl).end();
                        }
                        if(aData[7] == '1'){
                            $nRow.find('td:eq(4)').html('<a href="'+vSpp.globalVars.configuratorUrl+'&_VM_serviceInstanceId='+encodeURIComponent(aData[6])+commitID+urlData+'&_VM_serviceID='+encodeURIComponent(aData[6])+'&_VM_flow=addon#/addOnService/configureAddons">'+vSpp.globalVars.purchaseAddOnText+'</a>');
                            /*if (aData[8]=='1') {

                                $nRow.find('td:eq(4)').html('<a href="'+vSpp.globalVars.purchaseAddOnUrl+'&_VM_serviceID='+encodeURIComponent(aData[4])+'&_VM_tokenFlag='+encodeURIComponent(aData[8])+'#/addOnService/configureAddons">'+vSpp.globalVars.purchaseAddOnText+'</a>');
                            }else{
                                //var a = aData[4];
                                $nRow.find('td:eq(4)').html('<a href="" data-export="'+encodeURIComponent(aData[4])+'" ng-click="AllSerNoPermissions(\''+aData[4]+'\')">'+vSpp.globalVars.purchaseAddOnText+'</a>');
                            }*/
                        }else{
                            $nRow.find('td:eq(4)').html('');
                        }
                    },
                     "fnInitComplete": function(oSettings, json) {
                       // console.log(oSettings, json);
                        if(json == undefined){$("#"+tableId).parents('article').find('.ajaxSpinner').show();}
                        else{
                            $("#"+tableId).parents('article').find('.ajaxSpinner').hide();
                             if(oSettings.aoData.length > 0){
                            $("#"+tableId).parents('article').find('.SubscriptionServiceData').show();
                            $("#"+tableId).parents('article').find('.SubscriptionServiceNoData').hide();
                            $("#"+tableId).parents('.subscriptionServicesTbl').show();
                        }else{
                            $("#"+tableId).parents('article').find('.SubscriptionServiceData').hide();
                            $("#"+tableId).parents('article').find('.SubscriptionServiceNoData').show();
                            $("#"+tableId).parents('.subscriptionServicesTbl').hide();
                        }
                        }
                       
                      //alert( 'DataTables has finished its initialisation.' );
                    },
					fnServerData : function ( url, data, callback, settings, type, errorCb) {
						settings.jqXHR = $.ajax( {
							"type":"POST",
							"url": url,
							"data": data,
							"success": function (json) {
								$(settings.oInstance).trigger('xhr', settings);
								if (typeof json.aaData != "object" || json.aaData==null){
									if(settings.oApi && settings.oApi._fnProcessingDisplay){
										settings.oApi._fnProcessingDisplay( settings, false );
									}
									if (settings.error) settings.error(settings.oInstance, json);
									else callback( json );
									return;
								} else callback( json );
							},
							"dataType": "json",
							"cache": false,
							"error": function (xhr, error, thrown) {
								if ( error == "parsererror" ) {
									/*alert( "DataTables warning: JSON data from server could not be parsed. "+
										"This is caused by a JSON formatting error." );*/
								}
								if(settings.error) settings.error(settings.oInstance, {"ERROR_CODE":500,"ERROR_MESSAGE":settings.errMsg});
								else if (errorCb) errorCb(error);
								_fnProcessingDisplay( settings, false );
							}
						} );
					},
                   "oLanguage": {
                        "sEmptyTable": ""
                    }
                });
            });
        }
    })
    .controller('vsspdashboardCtrl',['$scope', '$state', '$modal', 'newServiceFactory', '$compile',function($scope, $state, $modal,newServiceFactory,$compile) {
            $scope.globalVars = {};
            $scope.showLoader = true;
            $scope.vspplistObj={};
            $scope.userList = [];
            $scope.renameDiv =false;
            $scope.vsppIdentifierFlag = true;
            $scope.vsppCurrentIdentifier={};
            $scope.modaServiceData = [];
            $scope.removeModalServiceData = [];//for remove VSPP...
            $scope.errorUser = vSpp.globalVars.errorUser;
            $scope.errorUser2 = vSpp.globalVars.errorUser2;// Non vmware user..
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
              $scope.globalVars.VSPPAirEmpty = $scope.globalVars.VSPPAirEmpty.replace("{0}",$scope.globalVars.newPartnerUrl);
              //console.info("Inside controller");
              newServiceFactory.postServices(
                function(successData) {
                    $scope.showLoader = false;
                    if (!$scope.isEmpty(successData.ERROR_MESSAGE)) {
                        $scope.$apply(function() {
                            vmf.msg.page(successData.ERROR_MESSAGE, "", "danger",".alertBoxMainContainer");
                            $scope.showLoader = false;
                        });
                    }else{
                        $scope.$apply(function(){ 
                            $scope.vspplistObj = successData;
                            if ($scope.vspplistObj.entity==null || $scope.vspplistObj.entity.identifierDetails==null) {
                                $('.emptyResp').show();
                                if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : VSPP : No-Commitments");
                                return;
                            }
                            else {
                                if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : VSPP");
                            }
                            $scope.accountInfo =  $scope.vspplistObj.entity.identifierDetails;//.vsppIdentifierDetail;
                            //console.log($scope.accountInfo);
                            $scope.showLoader = false;
                           
                            angular.forEach($scope.accountInfo,function(value,key){
                               //var autoRenewalTooltip = $scope.globalVars.autoRenewalTooltip.replace('{1}', $scope.accountInfo[key].endDate);
                                $scope.accountInfo[key].toolTipTerm = $scope.globalVars.autoRenewalTooltip.replace('{1}', $scope.accountInfo[key].endDate);
                                $scope.accountInfo[key].learnAboutTxt = $scope.globalVars.learnAboutTxt.replace('{1}', $scope.accountInfo[key].aggregatorName);
                              })
                            
                            
                        });
                    }
                                     
                }, function(errorData) {
                },
              $scope.globalVars.getServiceUrl, // This comes from the jsp config object
                'GET'
            );
            
            $scope.getTooltipPlacement = function () {
                return ($(window).width() < 480) ? 'left' : 'right';
            }
            
            $scope.rename = function($index) {
                var renameIndex = $index;
                $('.form-control').eq(renameIndex).parsley('validate');
                $('.form-control').eq(renameIndex).val($('.vsppSubHeader').eq(renameIndex).find('span').text());
                $('.changeNameCont').eq(renameIndex).show('slow');
                $('.vsppSubHeader').eq(renameIndex).hide('slow');
            }
            $scope.validateRename = function($index){
                if (!$('.form-control').eq($index).parsley().isValid()){$scope.disableSave = true;}
                    else{$scope.disableSave = false;}                             
            }
            $scope.save = function($index) {
                var saveIndex = $index;
                var dataObj = {};
                $('.vsppSubHeader').eq(saveIndex).find('span').text($('.form-control').eq($index).val());
                dataObj.identifierName = $('.form-control').eq(saveIndex).val();
                dataObj.commitID = $scope.vspplistObj.entity.identifierDetails[saveIndex].encodedIdentifierId; //$scope.serviceData.fundGroups[saveIndex].fundName[1];
                $scope.SaveAddData = "commitID=" + dataObj.commitID + "&commitName=" + escape(dataObj.identifierName);
                
               // var alertRowLevelContainer = $(".alertBoxContainerRow").eq(saveIndex);
                //vmf.msg.page("", "", "warning",alertRowLevelContainer);
                if($(".form-control").eq(saveIndex).parsley().isValid()){

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
  
                }
                

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
                //debugger;
                if($(".form-control").eq(cancelIndex).parsley().isValid()){
                   
                     $('.changeNameCont').eq(cancelIndex).hide('slow');
                     $('.vsppSubHeader').eq(cancelIndex).show('slow');
                }
                else{
                     var identifierName = $scope.accountInfo[cancelIndex].identifierName;
                     $('.vsppSubHeader > .vsppIdentifier').eq(cancelIndex).text(identifierName);
                     $('.changeNameCont').eq(cancelIndex).hide('slow');
                    $('.vsppSubHeader').eq(cancelIndex).show('slow');
                }
                // var cancelIndex = $index;
                // if(!$(".form-control").eq(cancelIndex).parsley().isValid()){
                //     //  debugger;
                //     // var fundValue = $scope.accountInfo[cancelIndex].identifierName;
                //     // $('.changeNameCont').eq(cancelIndex).text(fundValue);
                //     $('.changeNameCont').eq(cancelIndex).show('slow');
                //     $('.vsppSubHeader').eq(cancelIndex).hide('slow');
                // }
                // else{
                //      $('.changeNameCont').eq(cancelIndex).hide('slow');
                //      $('.vsppSubHeader').eq(cancelIndex).show('slow');
                // }
                /*$scope.renameDiv = false ;
                $scope.vsppIdentifierFlag = true;*/
            }

            $scope.users = function($index) {
                removeUser = $index;
                $scope.selectedFundName = $('.vsppIdentifier').eq(removeUser).text(); //$scope.serviceData.fundGroups[$index].fundName[0];
                _VM_fundID = $scope.vspplistObj.entity.identifierDetails[removeUser].id;
                _VM_commitID = $scope.vspplistObj.entity.identifierDetails[removeUser].encodedIdentifierId;
                _VM_commitName = $scope.vspplistObj.entity.identifierDetails[removeUser].identifierName;
                $scope.removefundGroupId = "fundGroupId=" + _VM_fundID;
                var alertRowLevelContainer = $(".alertBoxContainerRow");
                //$scope.postdashboardModalUrl ="/static/myvmware/modules/vcredit/json/vspp/removeuser.json";
                    vmf.msg.page("", "", "warning",alertRowLevelContainer);
                                
                //Remove user changes as only one RS var is dispatched from portel team for remove..
                // Fetching list from dashboard JSON....
                    $scope.removeModalServiceData = [];         
               
                    angular.forEach($scope.accountInfo[removeUser].users,function(valUsers,keyUsers){
                        if($scope.accountInfo[removeUser].users[keyUsers].isAdminRole == false){
                            var userInfo = {};
                            userInfo = $scope.accountInfo[removeUser].users[keyUsers]; 
                            $scope.removeModalServiceData.push(userInfo);
                        }
                    })
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
                //changed fundId to commitID for VSPP...
                $scope.SubmitConfirmData = "commitID="+ _VM_commitID +"&userId=" + dataConfirmObj+"&commitName="+_VM_commitName;
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
                    $scope.globalVars.postServiceUrl, // This comes from the jsp config object for confirm remove user...
                    $scope.SubmitConfirmData, 'GET'
                );
            
            $scope.removeConfirmUser = function(successData) {
                if (successData.status = "success") {
                    $scope.$apply(function() {
                        for (var i = 0; i < dataConfirmObj.length; i++) {
                                deleteKey = dataConfirmObj[i];
                                for (var j = 0; j<$scope.vspplistObj.entity.identifierDetails[removeUser].users.length;  j++) {
                                    if ($scope.vspplistObj.entity.identifierDetails[removeUser].users[j].customerNumber == deleteKey) {
                                        $scope.vspplistObj.entity.identifierDetails[removeUser].users.splice(j,1);
                                    }
                                }
                                //delete $scope.vspplistObj.entity.identifierDetails[removeUser].users[deleteKey]; 
                                //console.log($scope.vspplistObj.entity.identifierDetails[removeUser].users[deleteKey]);
                            }
                            //$scope.usersObjectList();
                        });
                        $scope.CurrModal.close();

                }
            }
            } 
            $scope.redeem = function($index) {
                _VM_commitID = $scope.vspplistObj.entity.identifierDetails[$index].encodedIdentifierId;//$scope.serviceData.fundGroups[$index].fundName[1];
                _VM_contractNumber = $scope.vspplistObj.entity.identifierDetails[$index].encodedContractNumber;
                _VM_eaNumber = $scope.vspplistObj.entity.identifierDetails[$index].encodedAccountNumber;
                _VM_redemptionCurrency = $scope.vspplistObj.entity.identifierDetails[$index].currencyCode;
                var url = $scope.globalVars.configuratorUrl + '&_VM_commitID='+_VM_commitID+'&_VM_contractNumber='+_VM_contractNumber+'&_VM_eaNumber='+_VM_eaNumber+'&_VM_redemptionCurrency='+_VM_redemptionCurrency;
                window.location.assign(url);
            }   
            $scope.addUser = function($index) {
                vmf.include("parsley",function(){
                    indexVar = $index;
                    addFundId = $scope.vspplistObj.entity.identifierDetails[indexVar].identifierId;
                    //addFundId = $scope.serviceData.fundGroups[$index].fundName[1];
                    fundCommitID = $scope.vspplistObj.entity.identifierDetails[indexVar].encodedIdentifierId;
                    commitName = $scope.vspplistObj.entity.identifierDetails[indexVar].identifierName;
                    vsppCustomerNo = $scope.vspplistObj.entity.identifierDetails[indexVar].customerNumber;
                    $scope.oldFundName = $('.vsppIdentifier').eq(indexVar).text(); //scope.serviceData.fundGroups[$index].fundName[0];
                    $scope.resetAdd();
                     $scope.displaySaveError = null;
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
                addDataObj._VM_commitId = fundCommitID;
                addDataObj._VM_commitName = commitName;
                addDataObj._VM_customerNumber = vsppCustomerNo;
                //$scope.postaddUserServiceUrl = "/static/myvmware/modules/vcredit/json/vspp/adduser.json"
                addDataObj._VM_userFirstName = $('#firstName').val();
                addDataObj._VM_userLastName = $('#lastName').val();
                addDataObj._VM_userEmailAddress = $('#inputEmail').val();
                $scope.SaveAddUserData = "commitID=" + addDataObj._VM_commitId + "&userFirstName=" + addDataObj._VM_userFirstName + "&userLastName=" + addDataObj._VM_userLastName + "&userEmailAddress=" + addDataObj._VM_userEmailAddress;
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
                           $scope.vspplistObj.entity.identifierDetails[indexVar].users[0][newKey] = $scope.addedName;


                                $scope.vspplistObj.entity.identifierDetails[indexVar].users.push({
                                    customerNumber: newKey,
                                    lastName: addDataObj._VM_userLastName,
                                    firstName: addDataObj._VM_userFirstName,
                                    email:addDataObj._VM_userEmailAddress,
                                    isAdminRole:false
                                });
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
                $scope.confirmAddDes = "commitID=" + addDataObj._VM_commitId + "&commitName=" +addDataObj._VM_commitName+"&customerNumber="+addDataObj._VM_customerNumber+ "&userId=" + newKey + "&userFirstName=" + addDataObj._VM_userFirstName + "&userLastName=" + addDataObj._VM_userLastName + "&userEmailAddress=" + addDataObj._VM_userEmailAddress + "&validEMSUser=" + $scope.validEMSUser;
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