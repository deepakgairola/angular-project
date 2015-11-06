/**
 * Created by kamalk on 6/15/2015.
 */

define(['app'], function(app) {
    app.controller('CustomerController',
        [
            '$scope', '$rootScope', '$timeout', '$http', '$mdDialog','CommonService','NewCarService','$window','$location','CommonQuoteService', 'QuoteService',
            function ($scope, $rootScope, $timeout, $http, $mdDialog,CommonService,NewCarService,$window,$location,CommonQuoteService, QuoteService) {
                $scope.assist = {};
                $scope.assist.IsAssistanceReq = false;
                $scope.customerEntity = {};
                $scope.countryCodes = {};
                $scope.countryCodes.output = [];
                $scope.customerEntity.IsAssistanceReq = false;
                $scope.customerProceed = false;
                $scope.custFormSubmitName = "View Quotes";
                $scope.maxNum = 10;
                $scope.minNum = 10;

                // Make http request to get country codes from json
                NewCarService.getCountryCodes().success(function(data){
                    $scope.countryCodes = data.output;
                }).error(function(data){

                });

                var deregisterCustomerEnquiryGeneratedEvent = $rootScope.$on('CustomerEnquiryGenerated', function(event, enquiryId) {
                  if (enquiryId) {
                    var enqId = CommonService.decode(enquiryId, true);
                    QuoteService.getPersonInfo(enqId).success(function(data) {
                        $scope.customerEntity.CustomerName = data.CustName;
                        $scope.customerEntity.Email = data.CustEmail;
                        $scope.customerEntity.MobileNo = data.CustMobile;
                    });
                  }
                });

                $scope.$on('$destroy', function() {
                  deregisterCustomerEnquiryGeneratedEvent();
                });

                // Max length of the mobile number to be changed when country code is changed
                $scope.changeMaxLength = function(countryId){
                    if(countryId == 243){
                        $scope.maxNum = 10;
                        $scope.minNum = 10;
                    }else{
                        $scope.errorMessageHide=false;
                        $scope.maxNum = 20;
                        $scope.minNum = 0;
                    }
                };

                $scope.customerEntity.CountryID = 243;

                // Populate the customer details object to publish for customer login
                $scope.populateCustomerDetails = function(isValid){
                    if($scope.customerEntity.CountryID==243){
                        isValid = $scope.customerEntity.MobileNo<=9999999999&&$scope.customerEntity.MobileNo>=7000000000 ;
                        $scope.errorMessageHide = $scope.customerEntity.MobileNo.length!=10 || !isValid;
                    }
                    if(isValid){
                        $scope.customerProceed = true;

                        $scope.enquiryId = CommonQuoteService.getEnquiryId();


                        $scope.customerEntity.CustomerId = null;
                        $scope.customerEntity.ProviderId = null;
                        $scope.customerEntity.DOB = null;
                        $scope.customerEntity.FirstName = null;
                        $scope.customerEntity.MiddleName = null;
                        $scope.customerEntity.LastName = null;
                        $scope.customerEntity.FamilyName = null;
                        $scope.customerEntity.GenderID = null;
                        $scope.customerEntity.IsNRI = $scope.customerEntity.CountryID!=243;
                        $scope.customerEntity.IsAssistanceReq = !$scope.assist.IsAssistanceReq;
                        $scope.customerEntity.CityID = null;
                        $scope.customerEntity.IncomeGroupID = null;
                        $scope.customerEntity.MaritalStatusID = null;
                        $scope.customerEntity.CustMemId = null;
                        $scope.customerEntity.IsVerified = null;
                        $scope.customerEntity.VerifiedBy = null;
                        $scope.customerEntity.CustomerCount = null;
                        $scope.customerEntity.Title = null;
                        $scope.customerEntity.EnquiryId = CommonService.decode($scope.enquiryId,true);

                        NewCarService.setCustomerLoginDetails($scope.customerEntity).success(function(data){
                            $scope.customerProceed = false;
                            $scope.custFormSubmitName = "Please Wait";
                            if(!isNaN(Number(data))&&data>0) {
                                var leadId = CommonService.encode(data, true);
                                $scope.goToQuotes($scope.enquiryId, leadId);
                            }else{
                                $scope.custFormSubmitName = "Retry";
                                $scope.customerProceed = true;
                                $scope.showSimpleToast();
                            }
                        }).error(function(data){

                        });
                    }

                };
            }]);
});
