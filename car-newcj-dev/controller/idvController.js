/**
 * Created by kamalk on 6/11/2015.
 */

define(['app'], function(app) {
    app.controller('idvController',
        [
            '$scope', '$rootScope', '$http', '$mdDialog','CommonQuoteService','$timeout',
            function ($scope, $rootScope,  $http, $mdDialog,CommonQuoteService,$timeout) {
                $scope.bestIdv = {};
                $scope.showCng = true;
                $scope.starting = false;
                $timeout(function(){$scope.starting = true;},100);
                if($rootScope.fuelType.toLowerCase().indexOf('cng')!=-1 || $rootScope.fuelType.toLowerCase()=='diesel'){
                    $scope.showCng = false;
                }

                $scope.closeModal = function() {
                    $mdDialog.cancel();
                };
                $scope.bestIdv = CommonQuoteService.getPremiumFactors();
                $scope.MinAllowed = $scope.bestIdv.IsCNGKitFitted?10000:0;

                if($scope.bestIdv.IdvAmountOpted>0){
                    if($scope.bestIdv.IdvAmountOpted>$scope.bestIdv.MaxIdv){
                        $scope.bestIdv.IdvAmountOpted=$scope.bestIdv.MaxIdv;
                    }
                    else if($scope.bestIdv.IdvAmountOpted<$scope.bestIdv.MinIdv){
                        $scope.bestIdv.IdvAmountOpted=$scope.bestIdv.MinIdv
                    }
                }

                $scope.initialValue = $scope.bestIdv.IdvAmountOpted;
                $scope.tempIdv = $scope.bestIdv.IdvAmountOpted==0?$scope.bestIdv.SupplierIdv:$scope.bestIdv.IdvAmountOpted;


                if($scope.bestIdv.IdvAmountOpted == 0 || $scope.bestIdv.IdvAmountOpted == null) {
                    $scope.bestIdv.idvChoose = false;
                }else{
                    $scope.bestIdv.idvChoose = true;
                }
                $scope.bestIdv.IdvAmountOpted = $scope.bestIdv.IdvAmountOpted==0?$scope.bestIdv.SupplierIdv:$scope.bestIdv.IdvAmountOpted;

                $scope.setDefaultValues = function(){
                  if($scope.bestIdv.IdvAmountOpted>$scope.bestIdv.MaxIdv){
                      $scope.bestIdv.IdvAmountOpted = $scope.bestIdv.MaxIdv;
                  }else if($scope.bestIdv.IdvAmountOpted<$scope.bestIdv.MinIdv){
                      $scope.bestIdv.IdvAmountOpted = $scope.bestIdv.MinIdv;
                  }
                    $scope.tempIdv = $scope.bestIdv.IdvAmountOpted;
                };

                $scope.changeTempValue = function(){
                    $scope.tempIdv = $scope.bestIdv.IdvAmountOpted==0?$scope.bestIdv.SupplierIdv:$scope.bestIdv.IdvAmountOpted;
                };

                $scope.changeFitted = function(isFitted){
                    $scope.bestIdv.ExternalKitAmount = isFitted?$scope.bestIdv.ExternalKitAmount:0;
                    $scope.MinAllowed = isFitted?10000:0;
                };

                $scope.submitChangedIdvValues = function(isValid){
                    if($scope.bestIdv.NonElecAccessoriesAmount>0){
                        $scope.bestIdv.IsNonElecAccessoryIncluded = true;
                    }else{
                        $scope.bestIdv.IsNonElecAccessoryIncluded = false;
                    }
                    if($scope.bestIdv.ElecAccessoriesAmount>0){
                        $scope.bestIdv.IsElecAccessoryIncluded = true;
                    }else{
                        $scope.bestIdv.IsElecAccessoryIncluded = false;
                    }
                    if(!$scope.bestIdv.IsCNGKitFitted){
                        $scope.bestIdv.ExternalKitAmount = 0;
                    }
                    if(isValid) {
                        if(!$scope.bestIdv.idvChoose){
                            $scope.bestIdv.IdvAmountOpted = 0;
                        }
                        CommonQuoteService.setPremiumFactors($scope.bestIdv);
                        $mdDialog.hide();
                    }
                };
            }
        ]
    );
});



