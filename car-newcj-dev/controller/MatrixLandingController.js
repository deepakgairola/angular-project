/**
 * Created by psharma on 6/14/15.
 */
define(['app'], function(app) {
    app.controller('MatrixLandingController',
        [
            '$scope', '$rootScope', '$timeout', '$http', 'CommonQuoteService','CommonService','NewCarService',  '$location','$window',
            function ($scope, $rootScope, $timeout, $http, CommonQuoteService,CommonService,NewCarService, $location,$window) {
                $scope.urlData = {};
                var uid = CommonService.decode($location.$$search.LeadId)||'0';
                var aid = CommonService.decode($location.$$search.AgentId)||'0';
                $scope.urlData.uid = CommonService.encode(uid,true);
                $scope.urlData.aid = CommonService.encode(aid,true);


                // redirec to the url provided when this page is loaded
                $scope.changeCourse = function(){
                    $window.location.href = $scope.redirectUrl.RedirectionURL+"&frame=true";
                };

                // call http service to know where to redired after continued journey.
                NewCarService.continueJourney($scope.urlData).success(function(data){
                    $scope.redirectUrl = data;
                    $scope.changeCourse();
                }).error(function(data){

                })

            }])
});