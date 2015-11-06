/**
 * Created by psharma on 6/14/15.
 */
define(['app'], function(app) {
    app.controller('NcbController',
        [
            '$scope', '$rootScope', '$timeout', '$http', 'CommonQuoteService','CommonService', 'QuoteService', '$mdDialog',
            function ($scope, $rootScope, $timeout, $http, CommonQuoteService,CommonService, QuoteService, $mdDialog) {

                $scope.ncbValues = {};
                $scope.closeModal = function() {
                    $mdDialog.cancel();
                };

                $scope.isRenewal = CommonQuoteService.getRenewal();
                $scope.ncbValues = CommonQuoteService.getPremiumFactors();
                $scope.loadInsurers = function(){
                    QuoteService.previousInsurer().success(function(data){
                        $scope.previousInsurerList = data;

                    }).error(function(data){

                    })
                };
                $scope.loadInsurers();
                $scope.isNew = $rootScope.isNew;

                $scope.ncbPercentages = [{'percent':0,'notClaimedFor':1},{'percent':20,'notClaimedFor':2},{'percent':25,'notClaimedFor':3},{'percent':35,'notClaimedFor':4},{'percent':45,'notClaimedFor':5},{'percent':50,'notClaimedFor':6}];
                $scope.registrationDate = {date:'',year:'',month:''};
                $scope.manufacturingDate = {date:'',year:'',month:''};

                $scope.regMonths = $scope.manuMonths = [{monthId:1,name:'January'},{monthId:2,name:'February'},{monthId:3,name:'March'},
                    {monthId:4,name:'April'},{monthId:5,name:'May'},{monthId:6,name:'June'},{monthId:7,name:'July'},
                    {monthId:8,name:'August'},{monthId:9,name:'September'},{monthId:10,name:'October'},
                    {monthId:11,name:'November'},{monthId:12,name:'December'}];
                $scope.regDates = CommonQuoteService.populateDates($scope.registrationDate.month,$scope.regMonths);
                $scope.manuDates = CommonQuoteService.populateDates($scope.manufacturingDate.month,$scope.manuMonths);
                $scope.regYears = CommonService.getRegistrationYear(15).splice(1);

                var dateObject = CommonQuoteService.getDateObject($scope.ncbValues.VehicleRegistationDate);
                $scope.registrationDate.date = parseInt(dateObject[2],10);
                $scope.registrationDate.month = $scope.regMonths[parseInt(dateObject[1],10)-1].monthId;
                $scope.registrationDate.year = dateObject[0];
                if(!$rootScope.isNew) {
                    var datePolicyExpiryObject = CommonQuoteService.getDateObject($scope.ncbValues.ExistingPolicyExpiryDate);
                    $scope.manufacturingDate.date = parseInt(datePolicyExpiryObject[2], 10);
                    $scope.manufacturingDate.month = $scope.regMonths[parseInt(datePolicyExpiryObject[1], 10) - 1].monthId;
                    $scope.manufacturingDate.year = datePolicyExpiryObject[0];
                    var today = new Date();
                    if(!$rootScope.isBreakIn) {
                        if (today.getMonth() == 11 || (today.getMonth() == 10 && today.getDate() >= 16)) {
                            $scope.manuYears.push(today.getFullYear() + 1);
                            $scope.manuYears.concat(CommonService.getRegistrationYear(0));
                        } else {
                            $scope.manuYears = CommonService.getRegistrationYear(0);
                        }
                    }else{
                        $scope.manuYears = CommonService.getRegistrationYear(2);
                    }
                }

                $scope.$watch('registrationDate.month',function(){
                    if($scope.registrationDate.month!='') {
                        if ($scope.registrationDate.date != '') {
                            $scope.regDates = CommonQuoteService.populateDates($scope.registrationDate.month, $scope.regMonths, $scope.registrationDate.year);
                            if ($scope.regDates.indexOf(parseInt($scope.registrationDate.date)) == -1) {
                                $scope.registrationDate.date = $scope.regDates[$scope.regDates.length - 1];
                            }
                        }
                    }
                });

                $scope.$watch('registrationDate.year',function(){
                    if($scope.registrationDate.year!='') {
                        if ($scope.registrationDate.date != '') {
                            $scope.regDates = CommonQuoteService.populateDates($scope.registrationDate.month, $scope.regMonths, $scope.registrationDate.year);
                            if ($scope.regDates.indexOf(parseInt($scope.registrationDate.date)) == -1) {
                                $scope.registrationDate.date = $scope.regDates[$scope.regDates.length - 1];
                            }
                        }
                    }
                });

                $scope.$watch('manufacturingDate.month',function(){
                    if($scope.manufacturingDate.month!='') {
                        if ($scope.manufacturingDate.date != '') {
                            $scope.manuDates = CommonQuoteService.populateDates($scope.manufacturingDate.month, $scope.manuMonths, $scope.manufacturingDate.year);
                            if ($scope.manuDates.indexOf(parseInt($scope.manufacturingDate.date)) == -1) {
                                $scope.manufacturingDate.date = $scope.manuDates[$scope.manuDates.length - 1];
                            }
                        }
                    }
                });


                $scope.$watch('manufacturingDate.year',function(){
                    if($scope.manufacturingDate.year!='') {
                        if ($scope.manufacturingDate.date != '') {
                            $scope.manuDates = CommonQuoteService.populateDates($scope.manufacturingDate.month, $scope.manuMonths, $scope.manufacturingDate.year);
                            if ($scope.manuDates.indexOf(parseInt($scope.manufacturingDate.date)) == -1) {
                                $scope.manufacturingDate.date = $scope.manuDates[$scope.manuDates.length - 1];
                            }
                        }
                    }
                });

                $scope.resetNCB = function(isClaimMade){
                    if(isClaimMade){
                        $scope.ncbValues.CurrentNCBPercent = 0;
                    }
                };

                $scope.submitChangedNcbValues = function(){
                    var isValid = true;
                    var diffinDates = CommonQuoteService.getDiffOfDates($scope.manufacturingDate.date, $scope.manufacturingDate.month, $scope.manufacturingDate.year, $scope.registrationDate.date, $scope.registrationDate.month, $scope.registrationDate.year);
                    if (diffinDates > 0) {
                        isValid = false;
                        $scope.errorManuMessage = true;
                    } else {
                        isValid = true;
                        $scope.errorManuMessage = false;
                    }
                    if(isValid) {
                        $scope.ncbValues.CurrentNCBPercent = parseInt($scope.ncbValues.CurrentNCBPercent);
                        if ($scope.registrationDate.date != '')
                            $scope.ncbValues.VehicleRegistationDate = CommonQuoteService.changeDateFormat($scope.registrationDate.date, $scope.registrationDate.month, $scope.registrationDate.year);
                        if ($scope.manufacturingDate.date != '')
                            $scope.ncbValues.ExistingPolicyExpiryDate = CommonQuoteService.changeDateFormat($scope.manufacturingDate.date, $scope.manufacturingDate.month, $scope.manufacturingDate.year);
                        $mdDialog.hide($scope.ncbValues);
                    }

                };
            }])
});
