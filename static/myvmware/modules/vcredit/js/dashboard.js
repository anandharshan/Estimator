'use strict';
angular
    .module('dashboardConfig', ['ui.bootstrap', 'ui.router', 'ajaxModule'])
    .config(function myAppConfig($stateProvider, $urlRouterProvider, $sceProvider) {

        $urlRouterProvider.otherwise('/');
        $sceProvider.enabled(false);
        $stateProvider
            .state('dashboard', {
                url: '/',
                templateUrl: '/static/myvmware/modules/vcredit/templates/dashboard/dashboard.tpl.html',
                controller: 'dashboardCtrl'
            })
            .state('expire', {
                url: '/expireFunds',
                templateUrl: '/static/myvmware/modules/vcredit/templates/dashboard/expireFunds.tpl.html',
                controller: 'expireCtrl'
            })

    })
    .factory('newServiceFactory', function($http, ajaxCall) {
        var factory = {};
        factory.dashboardObj = {};
		factory.globalVars = vCredit.globalVars;
        factory.getServices = function(callbackFn, method, url, data) {
            //console.log(callbackFn, method, url, data);
            ajaxCall.call(url, method, data, callbackFn);
        }
        factory.postServices = function(successFn, errorFn, url, data, method) {
            ajaxCall.call(url, method, data, successFn, errorFn);
        }
        return factory;

    })
    .factory('vmf',function(){
        return vmf;
    })
/*  .directive('ngBreadCrumb', function() {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                link1: '@bLink1',
                link2: '@bLink2',
                link3: '@bLink3',
                link4: '@bexpire'
            },
            templateUrl: 'vcredit/templates/directives/breadcrumbs.tpl.html'
        }
    })*/
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

.controller('expireCtrl', ['$scope', '$state', '$modal', '$compile' ,'newServiceFactory',
    function($scope, $state, $modal, $compile ,newServiceFactory) {
	    if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : dashboard : expired-funds");
        $scope.globalVars = {};
		angular.copy(newServiceFactory.globalVars,$scope.globalVars);
		$scope.expiredData={};
		$scope.showExpiredTable=false;
		
		$scope.isEmpty = function(val) {
            return (val === undefined || val == null || val.length <= 0) ? true : false;
        }
		
		$scope.showLoader = true;
            newServiceFactory.postServices(
                function(successData) {
					$scope.showLoader = false;
                    if (!$scope.isEmpty(successData.ERROR_MESSAGE)) {
                        $scope.$apply(function() {
                            vmf.msg.page(successData.ERROR_MESSAGE, "", "danger",".alertBoxMainContainer");
                            $scope.showLoader = false;
                        });

                    } else {
                        $scope.$apply(function() {
                            $scope.displayExpiredTable(successData);
                        });
                    }

                }, function(errorData) {
					$scope.$apply(function() {
						$scope.showLoader = false;
	                    vmf.msg.page(vCredit.globalVars.ERROR_MESSAGE, "", "warning",".alertBoxMainContainer");
                	});
                },
                vCredit.globalVars.expiredFundsUrl,
                'GET'
        );
			
		$scope.displayExpiredTable = function(responseData) {
			angular.copy(responseData, $scope.expiredData);
			$scope.showExpiredTable=true;
			vmf.include("datatable",function(){
				var dataTable = $("#expiredTable").dataTable({
					//"bStateSave": true,
					"bPaginate": false,
					"bLengthChange": false,
					"bFilter": false,
					"bInfo": false,
					"bAutoWidth":true,
					"aaData": $scope.expiredData.aaData,
					"aoColumns" : [{"sWidth": "200px"}, {"sWidth": "200px"}, {"sWidth": "400px"}, 
									{"bVisible": false}, {"bVisible": false}
					],
					"fnRowCallback": function(nRow, aData, columIndex) {
						var links = "<a ng-click = \"taggingForRedemptionReport()\" href='" + vCredit.globalVars.fundRedemptionReportUrl + "&_VM_fundID=" + aData[2] + "'>" + vCredit.globalVars.fundRedemptionReportLabel + "</a>";
						if (aData[4] == "1")
							links = "<a ng-click = \"taggingForFundActivityReport()\" href='" + vCredit.globalVars.fundActivityReportUrl + "&_VM_fundID=" + aData[2] + "'>" + vCredit.globalVars.fundActivityReportLabel + "</a>  &nbsp;|  &nbsp;" + links
						var compiledLinks = $compile(links)($scope); 
                        $(nRow).find("td:eq(2)").html(compiledLinks);
						return nRow;
					},
					"oLanguage": {
						"sEmptyTable": vCredit.globalVars.noExpiredFunds
					}
				
				}).rowGrouping({
					sGroupLabelPrefix: "<span class='groupLabel'>" + vCredit.globalVars.fundGroupPrefix + " </span>",
					iGroupingColumnIndex: 3 // group by the first sorting column
				});
			});
		}

        $scope.taggingForFundActivityReport = function (){
            if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : expirefunds : excel : fundactivity-report");
        }

        $scope.taggingForRedemptionReport = function (){
            if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : expirefunds : excel : redemption-report");
        }

    }
])
    .controller('dashboardCtrl', ['$scope', '$state', '$modal', 'newServiceFactory', 'vmf',
        function($scope, $state, $modal, newServiceFactory, vmf) {
            if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : dashboard");
            $scope.globalVars = {};
            $scope.serviceData = {};
            $scope.modaServiceData = {};
            $scope.addsuccess = {};
			
			angular.copy(newServiceFactory.globalVars,$scope.globalVars);
            //Dashboard Url...
            $scope.getServiceUrl = vCredit.globalVars.getdashboardServiceUrl;
            //Remove user...
            $scope.postdashboardModalUrl = vCredit.globalVars.postdashboardModalUrl;
            //Remover user confirm...
            $scope.postServiceUrl = vCredit.globalVars.removeFundGroupUsersUrl;
            //Add user validate....
            $scope.postaddUserServiceUrl = vCredit.globalVars.postdashboardaddUserServiceUrl;
            //Add user confirm...
            $scope.confirmAddUserServiceUrl = vCredit.globalVars.confirmAddUserServiceUrl;
			//Rename User
			$scope.renameFundGroupURL = vCredit.globalVars.renameFundGroupURL;
			$scope.fundGroupActivityReportUrl = vCredit.globalVars.fundGroupActivityReportUrl+"&_VM_fundGroupID=";
			$scope.fundGroupRedemptionReportUrl = vCredit.globalVars.fundGroupRedemptionReportUrl+"&_VM_fundGroupID=";

            //$scope.link1 = 'My Vmware';
            //$scope.link2 = 'Accounts';
            $scope.link3 = vCredit.globalVars.subscriptionHeading;
            $scope.expire = vCredit.globalVars.expire;
            $scope.balance = vCredit.globalVars.balance;
            $scope.outstandingBalance = vCredit.globalVars.outstandingBalance;
            $scope.addNewUser = vCredit.globalVars.addNewUser;
            $scope.removeUser = vCredit.globalVars.removeUser;
            $scope.removeUserLabel = vCredit.globalVars.removeUserLabel;
            $scope.terms = vCredit.globalVars.terms;
            $scope.addDescription = vCredit.globalVars.addDescription;
            $scope.addDescription2 = vCredit.globalVars.addDescription2;
            $scope.addDescription3 = vCredit.globalVars.addDescription3;
			$scope.removeDescription=vCredit.globalVars.removeDescription;
            $scope.validUser = vCredit.globalVars.validUser;
            $scope.validEmsUser = vCredit.globalVars.validEmsUser;
            $scope.errorUser = vCredit.globalVars.errorUser;
            $scope.errorUser2 = vCredit.globalVars.errorUser2;
            $scope.loginPageUrl = vCredit.globalVars.loginPageUrl;
			$scope.showLoader = false;
            $scope.addUserError= null;
			
            $scope.resetFlag = false;
            $scope.continueFlag = false;
            $scope.fundTrue = false;
            $scope.disableClear = false;
            $scope.confirmDisable = true;
            $scope.continueBtn = true;
            //Save btn within rename disable
            $scope.disableSave = false;
			$scope.account_name="";
            $scope.displaySaveMessage = null;
            $scope.displayErrorMessage = null;
            $scope.displayModalErrorMessage = null;
            $scope.removeErrorMessage = null;
            $scope.addedName = null;
            $scope.validEMSUser = null;
            var _VM_fundID = null;
            var addFundId = null;
            var indexVar = null;
            var newKey = null;
            var removeUser = null;
            $scope.dashboard = null;
            //Add user global object
            var addDataObj = {};

            $scope.displayExpireIcon = false;
            $scope.alertType = '';
            $scope.alertTypeText = '';

            $("[data-toggle='tooltip']").tooltip('show');

            /*newServiceFactory.getServices(function(data) {
                $scope.$apply(function() {
                    $scope.displayServiceData(data);
                })

            }, 'GET', $scope.getServiceUrl);*/
            $scope.hideAll = function($event){
                var $showHideElem=$event.currentTarget.parentElement;

                angular.element($showHideElem).children("ul").find("li.nodisp").parent().hide();
                angular.element($showHideElem).find("a.subsViewLess").addClass("hidden").siblings("a.subsViewAll").removeClass("hidden");
                
                $scope.calcPosition(angular.element($showHideElem));
            }
            $scope.showAll = function($event){
                var $showHideElem=$event.currentTarget.parentElement;

                angular.element($showHideElem).children("ul").removeClass("hidden").find("li.nodisp").removeClass("hidden").parent().show();
                angular.element($showHideElem).find("a.subsViewAll").addClass("hidden").siblings("a.subsViewLess").removeClass("hidden");
                if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : dashboard : view-all-services");
            }

            $scope.calcPosition = function($elem){
                var parentPos = $elem.parents("article").position();
                window.scrollTo(0, parentPos.top);
            }

            $scope.isEmpty = function(val) {
                return (val === undefined || val == null || val.length <= 0) ? true : false;
            }
			$scope.showLoader = true;
            newServiceFactory.postServices(
                function(successData) {
					$scope.showLoader = false;
                    if (!$scope.isEmpty(successData.ERROR_MESSAGE)) {

                        // Display modal if error
                        /*$scope.displayInfoModal({
                            'header': vCredit.globalVars.header,
                            'body': successData.ERROR_MESSAGE,
                            'okText': vCredit.globalVars.okText,
                            'cancelText': vCredit.globalVars.cancelText,
                            'showOk': true,
                            'showCancel': false
                        });*/
                        $scope.$apply(function() {
                            vmf.msg.page(successData.ERROR_MESSAGE, "", "warning",".alertBoxMainContainer");
                            $scope.showLoader = false;
                        });

                    } else {
                        $scope.$apply(function() {
                            $scope.displayServiceData(successData);
                        });
                    }

                }, function(errorData) {
					$scope.$apply(function() {
						$scope.showLoader = false;
	                    /*$scope.displayInfoModal({
	                        'header': vCredit.globalVars.header,
	                        'body': vCredit.globalVars.ERROR_MESSAGE,
	                        'okText': vCredit.globalVars.okText,
	                        'cancelText': vCredit.globalVars.cancelText,
	                        'showOk': true,
	                        'showCancel': false
	                    });*/
	                    vmf.msg.page(vCredit.globalVars.ERROR_MESSAGE, "", "warning",".alertBoxMainContainer");
                	});
                },
                $scope.getServiceUrl, // This comes from the jsp config object
                'GET'
            );


            $scope.displayServiceData = function(getData) {
                angular.copy(getData, $scope.serviceData);
				$scope.sidPageURL = vCredit.globalVars.sidPageURL;

                angular.forEach($scope.serviceData.fundGroups, function(value, key) {
                    $scope.serviceData.fundGroups[key].usersArray = [];
                    var usersObject = [];
                    angular.forEach($scope.serviceData.fundGroups[key].users[0], function(val, key){
                        usersObject.push({
                            id: key,
                            name: val
                        })
                    });
                    angular.copy(usersObject, $scope.serviceData.fundGroups[key].usersArray);
                });
                //console.log($scope.serviceData);
                $scope.enableRedeem = function(index) {
                    /* angular.forEach($scope.serviceData.fundGroups, function(value, key) {
                    // //console.log(value, key);
                    if ($scope.serviceData.fundGroups[key].trueupFlag == "Y") {
                        $scope.enableRedeem = false;
                    }
                    if ($scope.serviceData.fundGroups[key].trueupFlag == "N" && $scope.serviceData.fundGroups[key].outstandingBalance == false) {
                        $scope.enableRedeem = false;
                    }
                    if ($scope.serviceData.fundGroups[key].trueupFlag == "N" && $scope.serviceData.fundGroups[key].outstandingBalance == false || $scope.serviceData.fundGroups[key].balance == "0") {
                        $scope.enableRedeem = true;
                    }
                });*/
                    var enableIndex = $scope.serviceData.fundGroups[index];
                    if(enableIndex.fundStatus == "1"){
                            if (enableIndex.trueupFlag == "Y") {
                                return false;
                            }
                            else if (enableIndex.trueupFlag == "N" ){
                                if(enableIndex.outstandingBalance == false && parseFloat(enableIndex.balance) > 0){
                                    return false;
                                }
                                else{
                                    return true;
                                }
                            }
                            else{
                                return true;
                            }
                    }
                    else{
                            return true;
                    }
                    
					//return true;

                }


            }

            $scope.getTooltipPlacement = function () {
                return ($(window).width() < 480) ? 'left' : 'right';
            }
            $scope.redeem = function($index) {
                _VM_fundID = $scope.serviceData.fundGroups[$index].fundName[1];
                var url = vCredit.globalVars.ConfiguratorUrl + _VM_fundID;
                window.location.assign(url);
            }
            $scope.isCheckboxChecked = function() {
                if ($('.radio input:checkbox:checked').length > 0 && $('.terms input:checkbox:checked').length > 0) {
                    return true;
                }
            }
            $scope.users = function($index) {
            	//$scope.showLoader = true;
                removeUser = $index;
				$scope.selectedFundName = $('.fundNameHead').eq(removeUser).text(); //$scope.serviceData.fundGroups[$index].fundName[0];
                _VM_fundID = $scope.serviceData.fundGroups[removeUser].fundName[1];
                $scope.removefundGroupId = "fundGroupId=" + _VM_fundID;
				$scope.removeErrorMessage="";
                /*newServiceFactory.getServices(function(data) {
                    $scope.modalData(data);
                }, 'POST', $scope.postModalUrl, _VM_fundID);*/
                var alertRowLevelContainer = $(".alertBoxContainerRow").eq(removeUser);
                vmf.msg.page("", "", "warning",alertRowLevelContainer);
                newServiceFactory.postServices(
                    function(successData) {
                    	$scope.showLoader = false;
                        if (!$scope.isEmpty(successData.ERROR_MESSAGE)) {
                        	$scope.removeErrorMessage = successData.ERROR_MESSAGE;
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

                        } else {
                            // $scope.$apply(function() {
                            $scope.modalDataUser(successData);
                            //})
                        }
                        if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : dashboard : remove-user");

                    }, function(errorData) {
                    	$scope.showLoader = false;
                    	$scope.removeErrorMessage = errorData.ERROR_MESSAGE;
                        /*$scope.displayInfoModal({
                            'header': vCredit.globalVars.header,
                            'body': vCredit.globalVars.ERROR_MESSAGE,
                            'okText': vCredit.globalVars.okText,
                            'cancelText': vCredit.globalVars.cancelText,
                            'showOk': true,
                            'showCancel': false
                        });*/
                        vmf.msg.page(vCredit.globalVars.ERROR_MESSAGE, "", "warning",alertRowLevelContainer); //success/info/warning/danger
                    },
                    $scope.postdashboardModalUrl, // This comes from the jsp config object
                    $scope.removefundGroupId,
                    'GET'
                );

                $scope.modalDataUser = function(successData) {

                    //console.log(successData);
                    angular.copy(successData, $scope.modaServiceData);
                    /*
                    if ($scope.modaServiceData.exception.status == false) {
                        $scope.displayModalErrorMessage = $scope.modaServiceData.exception.ERROR_MESSAGE;
                        $scope.CurrModal = $modal.open({
                            templateUrl: 'dashboard/removeModalError.tpl.html',
                            scope: $scope
                        });
                    } else if ($scope.modaServiceData.error.ERROR_CODE == "somecode") {
                        $scope.displayModalErrorMessage = $scope.modaServiceData.error.ERROR_MESSAGE;
                        $scope.CurrModal = $modal.open({
                            templateUrl: 'dashboard/removeModalError.tpl.html',
                            scope: $scope
                        });


                    } else {*/
                    //console.log($scope.modaServiceData.userInfo);


                    $scope.CurrModal = $modal.open({
                        templateUrl: '/static/myvmware/modules/vcredit/templates/dashboard/removeModal.tpl.html',
                        scope: $scope
                    });
                    //}


                }
            }
            $scope.confirm = function() {
                var dataConfirmObj = [];
                //dataConfirmObj.fundId = _VM_fundID;

                var ea = $('.remuser input');
                for (var i = 0; i < ea.length; i++) {
                    if (ea[i].checked == true) {
                        //dataConfirmObj.push()
                        dataConfirmObj.push($(ea[i]).attr('id'));
                    }
                }


                //dataConfirmObj.userId = $("input[name='rFType']:checked").attr('id');
                $scope.SubmitConfirmData = "fundGroupId=" + _VM_fundID + "&userId=" + dataConfirmObj;
                //console.log(dataConfirmObj);
                //console.log($scope.SubmitConfirmData);
                //newServiceFactory.getServices(function(data) {

                //}, 'POST', $scope.postServiceUrl, dataConfirmObj);

                newServiceFactory.postServices(
                    function(successData) {
                        if (!$scope.isEmpty(successData.ERROR_MESSAGE)) {
                        	$scope.displayErrorMessage = successData.ERROR_MESSAGE;
                            // Display modal if error
                            /*$scope.displayInfoModal({
                                'header': vCredit.globalVars.header,
                                'body': successData.ERROR_MESSAGE,
                                'okText': vCredit.globalVars.okText,
                                'cancelText': vCredit.globalVars.cancelText,
                                'showOk': true,
                                'showCancel': false
                            });*/

                        } else {
                            $scope.removeConfirmUser(successData);
                        }
                        if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : dashboard : remove-user : confirm");

                    }, function(errorData) {
                    	$scope.displayErrorMessage = errorData.ERROR_MESSAGE;
                        /*$scope.displayInfoModal({
                            'header': vCredit.globalVars.header,
                            'body': vCredit.globalVars.ERROR_MESSAGE,
                            'okText': vCredit.globalVars.okText,
                            'cancelText': vCredit.globalVars.cancelText,
                            'showOk': true,
                            'showCancel': false
                        });*/
                    },
                    $scope.postServiceUrl, // This comes from the jsp config object
                    $scope.SubmitConfirmData, 'GET'
                );

               /* $scope.removeConfirmUser = function(successData) {
                    if (successData.status = "success") {
                        for (var i = 0; i < dataConfirmObj.length; i++) {

                            var deleteKey = parseInt(dataConfirmObj[i]);
                            //alert(dataConfirmObj[i], deleteKey);
                            delete $scope.serviceData.fundGroups[removeUser].users[0].deleteKey;
                            ////console.log($scope.serviceData.fundGroups[removeUser].users[0]);
                            $scope.CurrModal.close();
                        }
                        console.log($scope.serviceData.fundGroups);
                    }

                }*/
				
				$scope.removeConfirmUser = function(successData) {
                    var deleteKey = "";
                    if (successData.status = "success") {
                        $scope.$apply(function() {
                            for (var i = 0; i < dataConfirmObj.length; i++) {

                                deleteKey = dataConfirmObj[i];
                                //alert(dataConfirmObj[i], deleteKey);
                                delete $scope.serviceData.fundGroups[removeUser].users[0][deleteKey];
                                //console.log($scope.serviceData.fundGroups[removeUser].users[0]);
                                //console.log(deleteKey);
                                for(var j = 0; j < $scope.serviceData.fundGroups[removeUser].usersArray.length; j++){
                                    if($scope.serviceData.fundGroups[removeUser].usersArray[j].id == deleteKey){
                                        //console.log($scope.serviceData.fundGroups[removeUser].usersArray[j]);
                                        $scope.serviceData.fundGroups[removeUser].usersArray.splice(j, 1);
                                    }
                                }
							     	
                            }
                        })
                        $scope.CurrModal.close();
                       // console.log($scope.serviceData.fundGroups);
                    }
                }



            }
            $scope.modalClose = function() {
                $scope.CurrModal.close();
            }
            $scope.ok = function() {
                $scope.CurrModal.close();
            }
            $scope.close = function(modalTagContext) {
                $scope.continueBtn=true;
                $scope.displaySaveError = null;
                $scope.CurrModal.close();
                if(modalTagContext == "addUser"){
                    if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : dashboard : add-user : cancel");
                }else{
                    if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : dashboard : remove-user : cancel");
                }
                
            }
            $scope.rename = function($index) {
                var renameIndex = $index;
                $('.form-control').eq(renameIndex).parsley('validate');
                //var str = $('.renameEdit').eq(renameIndex).find('h3.headFnd').find('span').text();
                //$scope.newFundName = str;
                //if ($('.form-control').eq(renameIndex).val() == "") {
                    $('.form-control').eq(renameIndex).val($('.renameEdit').eq(renameIndex).find('h3.headFnd').find('span').text());
                //}
                $('.renameEdit').eq(renameIndex).find('.renameDash').show('slow');
                $('.renameEdit').eq(renameIndex).find('h3.headFnd').hide('slow');
                if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : dashboard : rename");
                    
            }
            $scope.validateRename = function($index){
                if (!$('.form-control').eq($index).parsley().isValid()){$scope.disableSave = true;}
                    else{$scope.disableSave = false;}
                             
            }
            $scope.sizeOf = function(obj) {
				var count = 0;
				var i;
				for (i in obj) {
				   if (obj.hasOwnProperty(i)) {
					   count++;
				   }
				}
				return count;
            }
            /*$scope.escape = function($index, keyCode) {
                if (keyCode === 27) {
                    //alert("hi");
                    $scope.cancel($index);
                }

            }*/

            $scope.save = function($index) {
                var saveIndex = $index;
                var dataObj = {};
                $('.fundNameHead').eq(saveIndex).text($('.form-control').eq($index).val());
                dataObj.fundGroupName = $('.form-control').eq($index).val();
                dataObj.fundGroupId = $scope.serviceData.fundGroups[saveIndex].fundName[1];
                $scope.SaveAddData = "fundGroupId=" + dataObj.fundGroupId + "&fundGroupName=" + escape(dataObj.fundGroupName);
				
                var alertRowLevelContainer = $(".alertBoxContainerRow").eq(saveIndex);
                vmf.msg.page("", "", "warning",alertRowLevelContainer);
                if($(".renameFundName").eq(saveIndex).parsley().isValid()){

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
                    $scope.renameFundGroupURL, // This comes from the jsp config object
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
                            $('.renameEdit').eq(saveIndex).find('h3.headFnd').show('slow');
                            $('.renameEdit').eq(saveIndex).find('.renameDash').hide('slow');
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
                if(!$(".renameFundName").eq(cancelIndex).parsley().isValid()){
                    var fundValue = $scope.serviceData.fundGroups[cancelIndex].fundName[0];
                    $('.fundNameHead').eq(cancelIndex).text(fundValue);
                    $('.renameEdit').eq(cancelIndex).find('h3.headFnd').show('slow');
                    $('.renameEdit').eq(cancelIndex).find('.renameDash').hide('slow');
                }
                else{
                    $('.renameEdit').eq(cancelIndex).find('h3.headFnd').show('slow');
                    $('.renameEdit').eq(cancelIndex).find('.renameDash').hide('slow');
                }
                
                
            }
            $scope.addUser = function($index) {
				vmf.include("parsley",function(){
					indexVar = $index;
					addFundId = $scope.serviceData.fundGroups[$index].fundName[1];
					$scope.oldFundName = $('.fundNameHead').eq(indexVar).text(); //scope.serviceData.fundGroups[$index].fundName[0];
					$scope.resetAdd();
					$scope.CurrModal = $modal.open({
						templateUrl: '/static/myvmware/modules/vcredit/templates/dashboard/addUser.tpl.html',
						scope: $scope,
						windowClass: 'overlay-lg'
					});
					$scope.account_name="";
					$scope.account_name=$scope.serviceData.fundGroups[$index].account;
					$scope.CurrModal.opened.then(function(){
						setTimeout(function () {$("#addUserForm").parsley();},10);
					});
				}); 
                if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : dashboard : add-user"); //Add user link.                    
			}
            $scope.displayInfoModal = function(getModalData) {

                $scope.modalData = getModalData;

                $scope.CurrModal = $modal.open({
                    templateUrl: '/static/myvmware/modules/vcredit/templates/dashboard/removeModalError.tpl.html',
                    scope: $scope
                });

            }
            $scope.add = function() {
				
            	$scope.showModalLoader = true;
                addDataObj._VM_fundId = addFundId;
                addDataObj._VM_userFirstName = $('#firstName').val();
                addDataObj._VM_userLastName = $('#lastName').val();
                addDataObj._VM_userEmailAddress = $('#inputEmail').val();
				$scope.displayModalErrorMessage="";
                $scope.SaveAddUserData = "fundGroupId=" + addDataObj._VM_fundId + "&userFirstName=" + addDataObj._VM_userFirstName + "&userLastName=" + addDataObj._VM_userLastName + "&userEmailAddress=" + addDataObj._VM_userEmailAddress;
                //console.log(addDataObj);
                //console.log($scope.SaveAddUserData);
                /*newServiceFactory.getServices(function(data) {
                    $scope.saveUserData(data);
                }, 'POST', $scope.postaddUserServiceUrl, addDataObj);*/
                
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
                        $scope.$apply(function(){
                        $scope.showModalLoader = false;
                        $scope.addUserError = successData.ERROR_MESSAGE;    
                        })
                        
                        
                            // Display modal if error
                           /* $scope.displayInfoModal({
                                'header': vCredit.globalVars.header,
                                'body': successData.ERROR_MESSAGE,
                                'okText': vCredit.globalVars.okText,
                                'cancelText': vCredit.globalVars.cancelText,
                                'showOk': true,
                                'showCancel': false
                            });*/

                        } else {
                            // $scope.$apply(function() {
                            $scope.saveUserData(successData);
                            //})
                        }
                        if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : dashboard : add-user : continue");

                    }, function(errorData) {
                    	$scope.showModalLoader = false;
                    	$scope.displaySaveError = errorData.ERROR_MESSAGE;
                        
                    	/* $scope.displayInfoModal({
                            'header': vCredit.globalVars.header,
                            'body': vCredit.globalVars.ERROR_MESSAGE,
                            'okText': vCredit.globalVars.okText,
                            'cancelText': vCredit.globalVars.cancelText,
                            'showOk': true,
                            'showCancel': false
                        });*/
                    },
                    $scope.postaddUserServiceUrl, // This comes from the jsp config object
                    $scope.SaveAddUserData,
                    'GET'
                );

                $scope.saveUserData = function(data) {
                    angular.copy(data.validateUser, $scope.addsuccess);
                    $scope.validEMSUser = $scope.addsuccess.validEMSUser;
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
							if($scope.validTrue == true){	
								$scope.acc_name="";
								$scope.acc_name=$scope.globalVars.validUser;
								$scope.acc_name=$scope.acc_name.replace('{0}', $scope.account_name);
								//$scope.globalVars.validUser=$scope.globalVars.validUser.replace('{0}', $scope.account_name);

							}
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


                    //else { * /

                    ////console.log($scope.modaServiceData.userInfo);

                    /*$scope.CurrModal = $modal.open({
                        templateUrl: 'dashboard/addUser.tpl.html',
                        scope: $scope
                    });*/

                    //}

                }
                //$scope.CurrModal.close();
            }
            $scope.clearFields = function() {
                $('#firstName').val('');
                $('#lastName').val('');
                $('#inputEmail').val('');
                $scope.continueBtn=true;
                $scope.displaySaveError = null;
            }
            $scope.tagClear = function() { //for omniture tagging only, to avoid this tag to be triggered twice if inside clearFields()
                if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : dashboard : add-user : clear");
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

            $scope.confirmAdd = function() {
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
                    $scope.confirmAddUserServiceUrl, // This comes from the jsp config object
                    $scope.confirmAddDes,
                    'GET'
                );

                $scope.confirmUserData = function(successData) {
                    if ($scope.addsuccess.status == "success") {
                        $scope.$apply(function() {
                            $scope.serviceData.fundGroups[indexVar].users[0][newKey] = $scope.addedName;

                            $scope.serviceData.fundGroups[indexVar].usersArray.push({
                                id: newKey,
                                name: $scope.addedName
                            })
                        })
                    } else if ($scope.addsuccess.status == "failure") {
						$scope.displayModalErrorMessage = validateUser.ERROR_MESSAGE;
                    }
					$scope.CurrModal.close();
                }
            }

            $scope.getExpiration = function(daysToExpire){
                if (daysToExpire == 0 ){
                    $scope.alertType = 'icons-icn_danger';
                    $scope.alertTypeText = 'danger';
                    $scope.displayExpireIcon = true;
                } else if (daysToExpire == 1){
                    $scope.alertType = 'icons-icn_warning';
                    $scope.alertTypeText = 'warning';
                    $scope.displayExpireIcon = true;
                } else {
                    $scope.alertType = '';
                    $scope.alertTypeText = '';
                    $scope.displayExpireIcon = false;
                }
                return ($scope.displayExpireIcon) ? true : false;
            }

            $scope.showFundUser = function(that){
                if(Object.keys(that).length>1){
                    return true;
                } else{ return false; }
            }


            $scope.taggingTheRedemptionReportURL = function(){
                if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : dashboard : excel : redemption-report");
            }

            $scope.taggingTheActivityReportURL = function(){
               if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : dashboard : excel : activity-report");
            }
        }
    ]).filter('customCurrency', ["$filter", function ($filter) {       
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