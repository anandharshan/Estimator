angular.module('chooseServiseCtrlModule',[])
.controller('chooseServiseCtrl', ['$scope', '$state', '$modal', 'newServiceFactory', 'confirmDialog', '$window', function($scope, $state, $modal, newServiceFactory, confirmDialog, $window){
	$scope.localObj={};
	$scope.localObj.serviceSel="";
	$scope.showProgressBar=true;
	$scope.chooseServiceData = {};
	$scope.globalVars={};
	$scope.totalCartAmount = 0;
	// $scope.chooseServiceInitial = {};

	angular.copy(newServiceFactory.globalVars, $scope.globalVars);
	// angular.copy(newServiceFactory.initialSetupData, $scope.chooseServiceInitial);

	$scope.isEmpty = function(val){
    	return (val === undefined || val == null || val.length <= 0) ? true : false;
	}

	$scope.pageInit = function(getCurrState){
			//console.log(getCurrState);
			$scope.currState = getCurrState.name.split('.')[1];
		    angular.forEach($scope.steps,function(data){
		    	if(data.link == $scope.currState){
		    		$scope.pageHeader = data.header;
		    	}
		    });		    
		    
		    setTimeout(function(){
		    	$('li.active').removeClass('visited');
		    	$('li.active').prevAll().addClass('visited');
		    }, 200);

		    vmf.msg.page("");

	}

	$scope.steps = [];
	
	angular.copy(newServiceFactory.steps,$scope.steps);

	$scope.pageInit($state.current);

	$scope.$on(
		'$stateChangeStart',
		function(event, toState, toParams, fromState, fromParams){ 
		    $scope.pageInit(toState);
		}
	);

	$scope.cancelFn = function(){
		newServiceFactory.clearObjects();
		$state.go('payMethod');
	}

	$scope.cancelFlow = function(callbackFn){
		$scope.displayConfirmModal();
	}
	
	$scope.displayConfirmModal = function(){
	    confirmDialog.confirm({
            header : '',
            msg : $scope.globalVars.confirm_message,
            btnYesText : $scope.globalVars.confirm,
            btnNoText : $scope.globalVars.cancelBtn,
            confirmIconType : 'confirm' //confirm/alert/info/''
        },{/*size:'lg',keyboard: true,backdrop: false,*/windowClass: 'confirm-modal'})
        .result.then(function(btn){
            $scope.cancelFn();
        },function(btn){
   
        }); 
	}
}]);