/**
 * Created by kamalk on 6/11/2015.
 */

define(['app'], function(app) {
    app.controller('DiscountController',
        [
            '$scope', '$rootScope', '$timeout', '$http', '$mdDialog','QuoteService','CommonQuoteService','CommonService',
            function ($scope, $rootScope, $timeout, $http, $mdDialog,QuoteService,CommonQuoteService,CommonService) {

                // Cancel dialog on cross button click
                $scope.closeModal = function() {
                    $mdDialog.cancel();
                };


                $scope.experinceYears =  [{"experince":0,"text":"No Experience"},{"experince":1,"text":"Upto 1 year"},{"experince":2,"text":"1 to 2 years"},{"experince":3,"text":"2 to 3 years"},{"experince":
4,"text":"3 to 4 years"},{"experince":5,"text":"4 to 5 years"},{"experince":6,"text":"5 to 6 years"},{"experince":7,"text":"6 to 7 years"},{"experince":8,"text":"7 to 8 years"},{"experince":9,"text":"8 to 9 years"},{"experince":10,"text":"9 to 10 years"},{"experince":11,"text":"Above 10 years"}];

                $scope.annualKmsRun = [{"bound":0,"text":"Select"},{"bound":1000,"text":"Upto 1000 kms"},{"bound":2000,"text":"1000-2000 Kms"},{"bound":3000,"text":"Above 2000 kms"}];

                // call http service to populate professions list
                var populateProfessions = function(){
                  QuoteService.getProfession().success(function(data){
                      $scope.occupations = data;
                  }).error(function(){});
                };

                $scope.enquiryId = CommonQuoteService.getEnquiryId();

                populateProfessions();
                $scope.dateOfBirth = {month:'',year:'',date:''};
                $scope.months = [{monthId:1,name:'January'},{monthId:2,name:'February'},{monthId:3,name:'March'},
                    {monthId:4,name:'April'},{monthId:5,name:'May'},{monthId:6,name:'June'},{monthId:7,name:'July'},
                    {monthId:8,name:'August'},{monthId:9,name:'September'},{monthId:10,name:'October'},
                    {monthId:11,name:'November'},{monthId:12,name:'December'}];
                $scope.dates = CommonQuoteService.populateDates($scope.dateOfBirth.month,$scope.months);
                $scope.years = CommonService.getBirthYear().reverse();
                $scope.discount = {VoluntaryDeductibleAmount:'',AntiTheftDiscountOpted:'',AAMDiscountOpted:'',DateOfBirth:'',ProfessionalDiscountId:'',IndividualOrgDiscountAmount:''};


                    // get the discount model for prefilling
                    CommonQuoteService.getDiscountModel($scope.enquiryId).then(function(data){
                        $scope.discount = data;
                        if($scope.discount.DateOfBirth!=null) {
                            var dateObject = CommonQuoteService.getDateObject($scope.discount.DateOfBirth);

                            $scope.dateOfBirth.date = parseInt(dateObject[2], 10);
                            $scope.dateOfBirth.month = $scope.months[parseInt(dateObject[1], 10) - 1].monthId;
                            $scope.dateOfBirth.year = dateObject[0];
                        }

                        $scope.oldDiscountObject = angular.copy($scope.discount);

                    });

                // Watch on birth month so as to change date list with values 28/29/30/31 for diff months
                $scope.$watch('dateOfBirth.month',function(){
                    if($scope.dateOfBirth.month!='') {
                        if ($scope.dateOfBirth.date != '') {
                            $scope.dates = CommonQuoteService.populateDates($scope.dateOfBirth.month, $scope.months, $scope.dateOfBirth.year);
                            if ($scope.dates.indexOf(parseInt($scope.dateOfBirth.date)) == -1) {
                                $scope.dateOfBirth.date = $scope.dates[$scope.dates.length - 1];
                            }
                        }
                    }
                });

                // Watch on birth year so as to change date list with values 28/29 for leap year  
                $scope.$watch('dateOfBirth.year',function(){
                    if($scope.dateOfBirth.year!='') {
                        if ($scope.dateOfBirth.date != '') {
                            $scope.dates = CommonQuoteService.populateDates($scope.dateOfBirth.month, $scope.months, $scope.dateOfBirth.year);
                            if ($scope.dates.indexOf(parseInt($scope.dateOfBirth.date)) == -1) {
                                $scope.dateOfBirth.date = $scope.dates[$scope.dates.length - 1];
                            }
                        }
                    }
                });

                // called on submit if all fields are properly filled and discount is needed the values are passed to mainController. 
                $scope.updateDiscountModal = function(isvalid){
                    if(isvalid) {
                        if ($scope.dateOfBirth.date != '' && $scope.dateOfBirth.month != '' && $scope.dateOfBirth.year != '') {
                            $scope.discount.DateOfBirth = CommonQuoteService.changeDateFormat($scope.dateOfBirth.date, $scope.dateOfBirth.month, $scope.dateOfBirth.year);
                        }
                        if ($scope.discount.VoluntaryDeductibleAmount > 0) {
                            $scope.discount.VoluntaryDeductibleOpted = true;
                        }
                        if ($scope.discount.DateOfBirth == "") {
                            $scope.discount.DateOfBirth = null;
                        }
                        if ($scope.discount.ProfessionalDiscountId != 0) {
                            for(var i = 0;i<$scope.occupations.length;i++){
                                if($scope.discount.ProfessionalDiscountId == $scope.occupations[i].Id){
                                    $scope.discount.Profession = $scope.occupations[i].Occupation;
                                    break;
                                }
                            }
                            $scope.discount.ProfessionalDiscountOpted = true;
                        }


                        var isObjectUnchanged = CommonQuoteService.isUnchanged($scope.discount, $scope.oldDiscountObject);
                        var myObj = {unchanged: isObjectUnchanged, discountObj: $scope.discount};
                        $mdDialog.hide(myObj);
                    }
                };
            }]);
});

