/**
 * Created by Prashants on 6/8/2015.
 */

define(['app'], function(app) {
    app.controller('DialogController',
        [
            '$scope', '$rootScope', '$timeout', '$http', '$mdDialog','CommonService','CommonQuoteService','QuoteService',
            function ($scope, $rootScope, $timeout, $http, $mdDialog,CommonService,CommonQuoteService,QuoteService) {
                $scope.previousInsurerList = [];
                $scope.dontKnowClicked = {'prevInsurer':false,'date':false,'ncb':false};
                $scope.selectedExpiryDetails = {month:'',year:'',date:'',previousInsurer:'',IsClaimMade:false,ncb:''};
                $scope.ncbValues = CommonQuoteService.getPremiumFactors();
                $scope.dummyNCBVales = angular.copy($scope.ncbValues);
                $scope.selectedExpiryDetails.IsClaimMade = $scope.dummyNCBVales.IsClaimMade;
                $scope.selectedExpiryDetails.ncb = $scope.dummyNCBVales.CurrentNCBPercent;
                $scope.expiryDateOption = "";
                var enqId = CommonQuoteService.getEnquiryId();

                // Make http request and populate preivous insurer list
                $scope.loadInsurers = function(){
                    QuoteService.previousInsurer().success(function(data){
                        $scope.previousInsurerList = data;
                        if($scope.ncbValues.PreviousInsurerId>0) {
                            $scope.selectedExpiryDetails.previousInsurer = $scope.ncbValues.PreviousInsurerId;
                        }
                    }).error(function(data){

                    })
                };
                $scope.loadInsurers();
                $scope.ncbPercentages = [{'percent':0,'notClaimedFor':1},{'percent':20,'notClaimedFor':2},{'percent':25,'notClaimedFor':3},{'percent':35,'notClaimedFor':4},{'percent':45,'notClaimedFor':5},{'percent':50,'notClaimedFor':6}];
                $scope.months = [{monthId:1,name:'January'},{monthId:2,name:'February'},{monthId:3,name:'March'},
                    {monthId:4,name:'April'},{monthId:5,name:'May'},{monthId:6,name:'June'},{monthId:7,name:'July'},
                    {monthId:8,name:'August'},{monthId:9,name:'September'},{monthId:10,name:'October'},
                    {monthId:11,name:'November'},{monthId:12,name:'December'}];
                $scope.dates = CommonQuoteService.populateDates($scope.selectedExpiryDetails.month,$scope.months);
                $scope.years = [];
                if(!$rootScope.isBreakIn) {
                    var today = new Date();
                    if (today.getMonth() == 11 || (today.getMonth() == 10 && today.getDate() >= 16)) {
                        $scope.years.push((new Date()).getFullYear() + 1);
                        $scope.years.concat(CommonService.getRegistrationYear(0));
                    } else {
                        $scope.years = CommonService.getRegistrationYear(0);
                    }
                }else {
                    $scope.years = CommonService.getRegistrationYear(2);
                }


                /*// Date object for policy expiry date to prefill date values
                var dateObject = CommonQuoteService.getDateObject($scope.ncbValues.ExistingPolicyExpiryDate);
                $scope.selectedExpiryDetails.date = parseInt(dateObject[2],10);
                $scope.selectedExpiryDetails.month = $scope.months[parseInt(dateObject[1],10)-1].monthId;
                $scope.selectedExpiryDetails.year = dateObject[0];*/

                // Watch on expiry month so as to change date list with values 28/29/30/31 for diff months
                $scope.$watch('selectedExpiryDetails.month',function(){
                    if($scope.selectedExpiryDetails.month!='') {
                        if ($scope.selectedExpiryDetails.date != '') {
                            $scope.dates = CommonQuoteService.populateDates($scope.selectedExpiryDetails.month, $scope.months, $scope.selectedExpiryDetails.year);
                            if ($scope.dates.indexOf(parseInt($scope.selectedExpiryDetails.date)) == -1) {
                                $scope.selectedExpiryDetails.date = $scope.dates[$scope.dates.length - 1];
                            }
                        }
                    }
                });

                // Watch on expiry year so as to change date list with values 28/29 for leap year  
                $scope.$watch('selectedExpiryDetails.year',function(){
                    if($scope.selectedExpiryDetails.year!='') {
                        if ($scope.selectedExpiryDetails.date != '') {
                            $scope.dates = CommonQuoteService.populateDates($scope.selectedExpiryDetails.month, $scope.months, $scope.selectedExpiryDetails.year);
                            if ($scope.dates.indexOf(parseInt($scope.selectedExpiryDetails.date)) == -1) {
                                $scope.selectedExpiryDetails.date = $scope.dates[$scope.dates.length - 1];
                            }
                        }
                    }
                });

                // function that is called when dont know is clicked for previous insurer
                $scope.prevInsurerDontKnowClicked = function(isClicked){
                    $scope.dontKnowClicked.prevInsurer = isClicked;
                };

                // function that is called when dont know is clicked for NCB
                $scope.NCBDontKnowClicked = function(isClicked){
                    $scope.selectedExpiryDetails.ncb  = $scope.ncbValues.CurrentNCBPercent;
                    $scope.dontKnowClicked.ncb = isClicked;
                };

                // function that is called when dont know is clicked for previous expiry date
                $scope.dateDontKnowClicked = function(isClicked){
                    $scope.dontKnowClicked.date = isClicked;
                };

                $scope.expiryDateOptionChanged = function(expiryDateOption){
                    var expiryDate = null;
                    expiryDate = CommonQuoteService.addDaysToDate(parseInt(expiryDateOption,10));
                    $scope.selectedExpiryDetails.month = expiryDate.getMonth()+1;
                    $scope.selectedExpiryDetails.year = expiryDate.getFullYear();
                    $scope.selectedExpiryDetails.date = expiryDate.getDate();


                };



                // function that is called when dont know is clicked for is claim made
                $scope.resetncb = function(isClaimMade){
                    if(isClaimMade){
                        $scope.selectedExpiryDetails.CurrentNCBPercent = 0;
                    }
                };

                // http service to capture dont know click event
                function insertEventTrack(eventname){
                    var obj={'enquiryId':enqId,'eventName':eventname};
                    QuoteService.insertEventTracking(obj).success(function(){});
                }

                // If the form is valid then pass the details for more processing
                $scope.submitPreviousPolicyDetails = function(isValid){
                    if(isValid && $rootScope.letProceed) {
                        if($scope.dontKnowClicked.date){
                            if($scope.expiryDateOption == 46) {
                                insertEventTrack('Expiry Date - more than 45 days');
                            }else{
                                insertEventTrack('Expiry Date - ' + $scope.expiryDateOption + 'days');
                            }
                        }
                        if($scope.dontKnowClicked.ncb){
                            insertEventTrack('NCB');
                        }
                        if($scope.dontKnowClicked.prevInsurer){
                            insertEventTrack('Previous Insurer');
                        }

                        $mdDialog.hide($scope.selectedExpiryDetails);
                    }
                };

            }]);
});
