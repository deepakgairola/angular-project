/**
 * Created by kamalk on 6/12/2015.
 */

define(['app'], function(app) {
    app.controller('ViewPlanController',
        [
            '$scope', '$rootScope', '$timeout', '$http', '$mdDialog','CommonQuoteService','CommonService','QuoteService','$window','$mdToast',
            function ($scope, $rootScope, $timeout, $http, $mdDialog,CommonQuoteService,CommonService,QuoteService,$window,$mdToast) {
                $scope.closeModal = function() {
                    $mdDialog.cancel();
                };
                $scope.loaderProceed = false;
                $scope.errorManuMessage = false;
                $scope.localNCBChanged = false;
                $scope.proceedName = "Proceed";
                $scope.purchaseName = "Purchase This Plan";
                $scope.reHitRequired = false;
                $scope.isNew = $rootScope.isNew;
                $scope.PlanPremiumCovers = {DriverCoverAmount:0,PassengerCoverAmount:0};
                $scope.DummyPlanPremiumCovers = CommonQuoteService.getPremiumCovers();
                $scope.PlanPremiumCovers = angular.copy($scope.DummyPlanPremiumCovers);
                $scope.PlanPremiumCovers.DriverCoverAmount = -$scope.PlanPremiumCovers.DriverCoverAmount;
                $scope.PlanPremiumCovers.PassengerCoverAmount = -$scope.PlanPremiumCovers.PassengerCoverAmount;
                $scope.previousPolicyDetails = CommonQuoteService.getPreviousPolicyDetails();
                $scope.previousPolicyDetails.EnquiryId = CommonQuoteService.getEnquiryId($scope.enquiryId);
                $scope.addOn = 0;
                $scope.trackingObj = CommonQuoteService.getTrackingObj();
                $scope.agentId = CommonQuoteService.getAId();
                $scope.message = 'Please Confirm The Following';

                $scope.viewPlanQuote = CommonQuoteService.getQuote();

                $scope.planNames = [];
                $scope.planNames = CommonQuoteService.getPlanNamesArray();
                $scope.planBeneFits = [];
                $scope.financialCover = {};
                $scope.financialCover.accCoverCheck = false;
                $scope.financialCover.toBeAddedSumIns = 100000;
                $scope.financialCover.toBeAdded = 1000;
                $scope.ncbPercentages = [0,20,25,35,45,50];
                $scope.ncbValues = CommonQuoteService.getPremiumFactors();
                $scope.newNcbValues = angular.copy($scope.ncbValues);
                $scope.thisNcbValues = {};
                $scope.thisNcbValues.IsClaimMade = $scope.ncbValues.IsClaimMade;
                $scope.thisNcbValues.currentNcb = $scope.ncbValues.CurrentNCBPercent;
                $scope.registrationDate = {date:'',year:'',month:''};
                $scope.manufacturingDate = {date:'',year:'',month:''};

                $scope.ipAddress = QuoteService.getIp();
                var split = [];
                if($scope.viewPlanQuote.listPlanBenefits[0].BenefitText.indexOf('<Br/>')!=-1){
                    split = $scope.viewPlanQuote.listPlanBenefits[0].BenefitText.split('<Br/>');
                }
                if($scope.viewPlanQuote.listPlanBenefits[0].BenefitText.indexOf('<br/>')!=-1) {
                    split = $scope.viewPlanQuote.listPlanBenefits[0].BenefitText.split('<br/>');
                }
                _.each(split,function(value){
                    $scope.planBeneFits.push(value.substring(value.indexOf(".") + 1));
                });

                $scope.regMonths = $scope.manuMonths = [{monthId:1,name:'January'},{monthId:2,name:'February'},{monthId:3,name:'March'},
                    {monthId:4,name:'April'},{monthId:5,name:'May'},{monthId:6,name:'June'},{monthId:7,name:'July'},
                    {monthId:8,name:'August'},{monthId:9,name:'September'},{monthId:10,name:'October'},
                    {monthId:11,name:'November'},{monthId:12,name:'December'}];
                $scope.regDates =  CommonQuoteService.populateDates($scope.registrationDate.month,$scope.regMonths);
                $scope.manuDates = CommonQuoteService.populateDates($scope.manufacturingDate.month,$scope.manuMonths);
                $scope.regYears = $scope.manuYears = CommonService.getRegistrationYear(15).splice(1);
                var dateObject = CommonQuoteService.getDateObject($scope.ncbValues.VehicleRegistationDate);
                $scope.registrationDate.date = parseInt(dateObject[2],10);
                $scope.registrationDate.month = $scope.regMonths[parseInt(dateObject[1],10)-1].monthId;
                $scope.registrationDate.year = dateObject[0];

                var dateManuObject = CommonQuoteService.getDateObject($scope.ncbValues.VehicleManufacturingDate);
                $scope.manufacturingDate.date = parseInt(dateManuObject[2],10);
                $scope.manufacturingDate.month = $scope.manuMonths[parseInt(dateManuObject[1],10)-1].monthId;
                $scope.manufacturingDate.year = dateManuObject[0];

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

                $scope.addAccidentalPremium = function(accCoverCheck){
                    if(accCoverCheck){
                        $scope.addOn =  $scope.financialCover.toBeAdded;
                    }else{
                        $scope.addOn =  0;
                    }
                };

                $scope.buyThisPlan = function(isValid){
                    if(CommonQuoteService.getReHitRequired() || ($rootScope.NCBChanged && !$rootScope.isNew)) {
                        if ($scope.viewPlanQuote.SupplierId == 1 || $scope.viewPlanQuote.SupplierId == 21) {
                            var diffinDates = CommonQuoteService.getDiffOfDates($scope.manufacturingDate.date, $scope.manufacturingDate.month, $scope.manufacturingDate.year, $scope.registrationDate.date, $scope.registrationDate.month, $scope.registrationDate.year);
                            if (diffinDates < 0) {
                                isValid = false;
                                $scope.errorManuMessage = true;
                            } else {
                                isValid = true;
                                $scope.errorManuMessage = false;
                            }
                        }
                        if (isValid) {
                            $scope.localNCBChanged = true;
                            if (!$scope.reHitRequired) {
                                $scope.loaderProceed = true;
                                $scope.proceedName = "Please Wait...";
                                $scope.purchaseName = "Please Wait...";
                                $scope.newNcbValues.CurrentNCBPercent = parseInt($scope.thisNcbValues.currentNcb, 10);
                                $scope.newNcbValues.IsClaimMade = $scope.thisNcbValues.IsClaimMade;
                                $scope.newNcbValues.VehicleRegistationDate = CommonQuoteService.changeDateFormat($scope.registrationDate.date, $scope.registrationDate.month, $scope.registrationDate.year);
                                if ($scope.viewPlanQuote.SupplierId == 1 || $scope.viewPlanQuote.SupplierId == 21) {
                                    $scope.newNcbValues.VehicleManufacturingDate = CommonQuoteService.changeDateFormat($scope.manufacturingDate.date, $scope.manufacturingDate.month, $scope.manufacturingDate.year);
                                }
                                var dateRegObj = CommonQuoteService.getDateObject($scope.newNcbValues.VehicleRegistationDate);
                                $rootScope.isZDAllowed = CommonQuoteService.getDiffInYears(dateRegObj[2], dateRegObj[1], dateRegObj[0]) <= 7;

                                var isObjectUnchanged = CommonQuoteService.isUnchanged($scope.newNcbValues, $scope.ncbValues);
                                QuoteService.saveSelectedQuote(populateSaveData(), $scope.previousPolicyDetails.EnquiryId).success(function (data) {

                                }).error(function (data) {
                                });
                                buyPlanConfirm(isObjectUnchanged);
                            } else {
                                reHitTheInsurer();
                            }
                        }
                    }else{
                        buyPlan();
                    }
                };

                function populatePurchaseData(){
                    return {
                        "MatrixLeadId":$scope.trackingObj.matrixLeadId,
                        "AgentId":$scope.agentId,
                        "ClientIP":$scope.ipAddress,
                        "supplierid":$scope.viewPlanQuote.SupplierId,
                        "planid":$scope.viewPlanQuote.PlanId,
                        "planname":$scope.viewPlanQuote.PlanName,
                        "policytype":$scope.trackingObj.policyType,
                        "topfirstplan":$scope.planNames[0]||'',
                        "topsecondplan":$scope.planNames[1]||'',
                        "topthirdplan":$scope.planNames[2]||'',
                        "isrenewal":false,
                        "previousinsurerid" : $scope.previousPolicyDetails.PrevInsurerId
                    }

                }

                function buyPlan(){
                    if($rootScope.isPurchaseAllowed) {
                        QuoteService.buyPlan(populatePurchaseData(), $scope.previousPolicyDetails.EnquiryId, $scope.trackingObj.trackId).success(function (data) {

                            if (data.Status == 'ok') {
                                $scope.trackingObj.trackId = data.TrackId;
                                $window.location.href = data.RedirectUrl;
                                CommonQuoteService.saveTrackingObj($scope.trackingObj);
                            }else{
                                $scope.trackingChange = data;
                                CommonQuoteService.saveTrackingChange($scope.trackingChange);
                                $mdDialog.hide("track");
                            }

                        }).error(function (data) {
                        });
                    }else{
                        $scope.showSimpleToast();
                        $scope.loaderProceed = false;
                        $scope.proceedName = "Proceed";
                        $scope.purchaseName = "Purchase This Plan";

                    }
                }

                function populateSaveData(){
                    return {"planId" : $scope.viewPlanQuote.PlanId, "premium" : $scope.viewPlanQuote.Breakup.FinalPremium-$scope.PlanPremiumCovers.DriverCoverAmount-$scope.PlanPremiumCovers.PassengerCoverAmount+$scope.addOn, "ClientIP" : $scope.ipAddress, "AgentId" : $scope.agentId>0?$scope.agentId:0}

                }

                var callIn = function(){
                    $scope.getPlans().then(function(){
                        $timeout(function(){startFetchingQuotes()},20000);
                    });
                };

                var reHitTheInsurer = function(){
                    var obj = {};
                    obj.enquiryId = $scope.previousPolicyDetails.EnquiryId;
                    obj.planId = $scope.viewPlanQuote.PlanId;
                    QuoteService.getAllQuotes(obj).success(function (data) {
                        if(data.PlanId==$scope.viewPlanQuote.PlanId) {
                            $scope.viewPlanQuote = data;
                        }else{
                            $scope.insurerErroMessage = "Oops! There seems to be a technical issue from the insurer's end. Please try again later, or select another plan.";
                            $scope.reHitPossible = false;
                        }

                    })
                };

                function startFetchingQuotes(){
                    var obj = {};
                    obj.enquiryId = $scope.previousPolicyDetails.EnquiryId;
                    obj.planId = null;
                    QuoteService.getAllQuotes(obj).success(function (data) {

                        $rootScope.plans = data;
                        angular.forEach($rootScope.plans,function(value) {

                            if(value.FinalPremium>0) {
                                value.display = true;
                                value.available = true;

                            }else{
                                value.display = false;
                                value.available = false;
                            }
                            if(value.AddOnFilters==null){
                                value.isComprehensive = true;
                            }
                            if(value.PlanId==1 || value.PlanId==13 || value.PlanId == 10){
                                value.isComprehensive = true;
                            }
                            value.isSelectedForCompare = false;
                            value.addNoMoreForCompare = false;
                            value.compareText = "Compare this plan";
                        });

                        angular.forEach($rootScope.plans,function(value) {
                            if($scope.viewPlanQuote.PlanId == value.PlanId){
                                if(value.display && value.available) {
                                    $scope.viewPlanQuote = value;
                                    $scope.message = 'This is your updated Premium';
                                    $scope.showChangedMessage = true;
                                }else{
                                    $scope.insurerErroMessage = 'Sorry, we were not able to connect to the insurer, Please try again';
                                    $scope.reHitRequired = true;
                                    $scope.reHitPossible = true;
                                }
                            }
                        });

                        var allNewQuotes = angular.copy($rootScope.plans);

                        CommonQuoteService.saveAllQuotes(allNewQuotes);
                        $scope.loaderProceed = false;
                        $scope.proceedName = "Proceed";
                        $scope.purchaseName = "Purchase This Plan";
                        $scope.localNCBChanged = false;
                        $scope.disableClose = false;
                        $scope.applyCommonFilter();
                    }).error(function (data) {
                    });
                }

                $scope.resetNCB = function(isClaimMade){
                    if(isClaimMade){
                        $scope.thisNcbValues.currentNcb = 0;
                    }
                };

                function buyPlanConfirm(isObjectUnchanged){
                    if (!isObjectUnchanged || CommonQuoteService.getReHitRequired()) {
                        if($scope.viewPlanQuote.SupplierId==1 || $scope.viewPlanQuote.SupplierId==21){
                            $scope.newNcbValues.VehicleManufacturingDate = CommonQuoteService.changeDateFormat($scope.manufacturingDate.date, $scope.manufacturingDate.month, $scope.manufacturingDate.year);
                        }else{
                            $scope.newNcbValues.VehicleManufacturingDate  = CommonQuoteService.getManufacturingDateFromReg($scope.newNcbValues.VehicleRegistationDate);
                        }
                        $scope.newNcbValues.ClientIP = $scope.ipAddress;
                        $scope.newNcbValues.AgentId = $scope.agentId;
                        $scope.newNcbValues.PolicyType = $scope.trackingObj.policyType;
                        $scope.newNcbValues.IsPolicyBreakIn = $scope.isBreakIn;
                        $scope.disableClose = true;
                        QuoteService.updatePremiumFactors($scope.newNcbValues, $scope.previousPolicyDetails.EnquiryId,$scope.trackingObj.trackId).success(function (data) {
                            $scope.trackingChange = data;
                            CommonQuoteService.saveTrackingChange($scope.trackingChange);
                            if(data.Status.toLowerCase()=="ok") {
                                $scope.trackingObj.trackId = data.TrackId;
                                $scope.getPremium().then(function (data) {
                                    $scope.ncbValues = data;
                                    $scope.newNcbValues = angular.copy($scope.ncbValues);
                                    CommonQuoteService.setPremiumFactors($scope.ncbValues);
                                    $scope.allPremiumFactors = angular.copy($scope.ncbValues);
                                });
                                CommonQuoteService.setReHitRequired(false);
                                callIn();
                            }else{
                                $mdDialog.hide("track");
                            }
                            CommonQuoteService.saveTrackingObj($scope.trackingObj);
                        }).error(function (data) {

                        });

                    }else{
                        buyPlan();
                    }
                }

                $scope.comparePlan = function(quote){

                    $mdDialog.hide(quote);
                };

                $scope.showSimpleToast = function() {
                    $mdToast.show(
                        $mdToast.simple()
                            .content('Car Insurance can be purchased maximum 45 days in advance.')
                            .hideDelay(3000)
                    );
                };
            }]);
});
