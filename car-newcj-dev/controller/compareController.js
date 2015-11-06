/**
 * Created by kamalk on 6/15/2015.
 */

define(['app'], function(app) {
    app.controller('compareController',
        [
            '$scope', '$rootScope', '$timeout', '$http', '$mdDialog','CommonQuoteService','QuoteService',
            function ($scope, $rootScope, $timeout, $http, $mdDialog,CommonQuoteService,QuoteService) {
                $scope.isDifferent = false;
                $rootScope.showDifferences = false;
                $scope.rightTick = true;
                $scope.crossTick = true;
                $scope.closeModal = function() {
                    $mdDialog.cancel();
                };

                $scope.populateCompareData = function(){
                    $scope.comparePlansFeaturesDetail();
                };

                $scope.comparePlan = CommonQuoteService.getComparePlanData();


                var populatePlanLists = function(){
                    var planlist  = [];
                    _.each($scope.comparePlan, function(plan) {
                        planlist.push(plan.PlanId);
                    });
                    return planlist.join(',');
                };

                var getComparisonData = function(){
                    QuoteService.getComparisonData($scope.planIds).success(function(data){
                        $scope.compareData = data;
                        $scope.populateCompareData();
                    }).error(function(data){

                    });
                };
                $scope.planIds = populatePlanLists();

                getComparisonData();



                $scope.toggleShowDifferences = function(flag){
                    $scope.isDifferent = flag;
                    $rootScope.showDifferences = flag;
                };

                $scope.comparePlansFeaturesDetail = function(){
                    _.each($scope.compareData,function(value){
                        _.each(value.Features,function(deepValue){
                            deepValue.isDisplay = true;
                            _.each(deepValue.Data,function(val){

                            });
                        });
                    });
                };

                $scope.showTicks = function(featureValues){
                    if(featureValues.Text.toUpperCase() == 'APPLICABLE'){
                        $scope.rightTick = true;
                    }else{
                        $scope.rightTick = false;
                    }

                    if(featureValues.Text.toUpperCase() == 'NOT APPLICABLE'){
                        $scope.crossTick = true;
                    }else{
                        $scope.crossTick = false;
                    }
                    return featureValues.Text.toUpperCase()!='APPLICABLE' && featureValues.Text.toUpperCase() != 'NOT APPLICABLE';
                }


            }]);
});



