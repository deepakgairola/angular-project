
define(['app'], function(app) {
    app.controller('EmailPlanController',
        [
            '$scope', '$rootScope', '$timeout', '$http', '$mdDialog','QuoteService','CommonQuoteService',
            function ($scope, $rootScope, $timeout, $http, $mdDialog,QuoteService,CommonQuoteService) {
                $scope.emailSent = false;
                $scope.closeModal = function() {
                    $mdDialog.cancel();
                };
                $scope.emailObj = {};
                $scope.emailObj.to = CommonQuoteService.getEmailId();
                $scope.enquiryId = CommonQuoteService.getEnquiryId();

                // If email id valid call send mail service on send button
                $scope.emailPlan = function(isValid){
                    if(isValid) {
                        QuoteService.sendMail($scope.emailObj, $scope.enquiryId).success(function (data) {
                            $scope.message = data;
                            $scope.emailSent = true;
                            $timeout(function () {
                                $scope.emailSent = false;
                                $scope.closeModal();
                            }, 2 * 1000);
                        }).error(function (data) {

                        });
                    }
                };

            }])

});
