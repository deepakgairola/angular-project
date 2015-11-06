/**
 * Created by Prashants on 6/4/2015.
 */

define(['app'], function(app) {
    app.controller('QuotesMainController',
        [
            '$scope', '$rootScope', '$timeout', '$http', 'CommonQuoteService','CommonService','QuoteService','$mdDialog','$location','$interval','$cookies','$window','$q','$mdToast','config',
            function ($scope, $rootScope, $timeout, $http, CommonQuoteService, CommonService,QuoteService,$mdDialog,$location,$interval,$cookies,$window,$q,$mdToast,config){
                var AllQuotes = {};
                var personInfo = {};
                var matrixLeadId = "";
                var person = {};
                var idv = {};
                var importantID = "";
                $scope.showCallMe = false;
                $scope.AllDisabled = true;
                $scope.extra = {driver:0,passenger:0,diverAmtWithTax:0,passengerAmtWithTax:0};
                $scope.PreviousInsurerModel = {};
                $scope.planCompare = [];
                $scope.showClearSelection = false;
                $scope.comparePlanButton = false;
                $scope.Idv = {};
                $rootScope.letProceed = false;
                $scope.alert = '';
                $rootScope.NCBChanged = true;
                $rootScope.isNew = false;
                $scope.zdText = 'Add';
                $scope.PriceName = "Price";
                $scope.showClear = false;
                $scope.CarDetails =  {
                    "MakeModelVariant": "",
                    "FuelType": "",
                    "RegistrationYear": 0,
                    "RtoCode": "",
                    "RtoCity": "",
                    "SeatingCapacity": 0
                };

                function decodeUTF16LE( binaryStr ) {
                    var cp = [];
                    for( var i = 0; i < binaryStr.length; i+=2) {
                        cp.push(
                            binaryStr.charCodeAt(i) |
                            ( binaryStr.charCodeAt(i+1) << 8 )
                        );
                    }

                    return String.fromCharCode.apply( String, cp );
                }

                function init() {
                    var timer1 = 0;
                    var timer2 = 0;
                    var currentdate = new Date();
                    var mm = (currentdate.getMonth() + 1);
                    if (mm < 10) {
                        mm = "0" + (currentdate.getMonth() + 1);
                    }
                    var dd = (currentdate.getDate());
                    if (dd < 10) {
                        dd = "0" + (currentdate.getDate());
                    }
                    var datetime = mm + "/"
                        + dd + "/"
                        + currentdate.getFullYear() + " "
                        + currentdate.getHours() + ":"
                        + currentdate.getMinutes() + ":"
                        + currentdate.getSeconds();

                    /*window.$zopim || (function (d, s) {
                        var z = $zopim = function (c) { z._.push(c) }, $ = z.s =
                            d.createElement(s), e = d.getElementsByTagName(s)[0]; z.set = function (o) {
                            z.set.
                                _.push(o)
                        }; z._ = []; z.set._ = []; $.async = !0; $.setAttribute("charset", "utf-8");
                        $.src = "http://v2.zopim.com/?3BTls1g49aPE10f7rBCOaESiCobqi9vd"; z.t = +new Date; $.
                            type = "text/javascript"; e.parentNode.insertBefore($, e)
                    })(document, "script");
*/

                    window.$zopim||(function(d,s){var z=$zopim=function(c){z._.push(c)},$=z.s=
                        d.createElement(s),e=d.getElementsByTagName(s)[0];z.set=function(o){z.set.
                        _.push(o)};z._=[];z.set._=[];$.async=!0;$.setAttribute("charset","utf-8");
                        $.src="//v2.zopim.com/?3DJInKwWllGioUhQv0QUosu2y0bcNNM3";z.t=+new Date;$.
                            type="text/javascript";e.parentNode.insertBefore($,e)})(document,"script");

                    $zopim(function () {
                        $zopim.livechat.setOnConnected(function() {
                          $zopim.livechat.departments.setVisitorDepartment('Car Insurance');
                        });
                        var setAttrOnChatWindowShow = function() {
                            console.log(personInfo);
                            if(personInfo!=null && !CommonQuoteService.isEmptyObject(personInfo)) {
                                $zopim.livechat.setName(personInfo.CustName);
                                $zopim.livechat.setEmail(personInfo.CustEmail);
                                $zopim.livechat.setPhone(personInfo.CustMobile);
                                if(($scope.aid==-1 || $scope.aid==null)) {
                                    $zopim.livechat.removeTags("LeadID: " + matrixLeadId, "CustomerID: " + person.CustomerID,"RegistrationNumber: " + $scope.carDetails.RtoCode, "Make: " + person.MakeName, "Model: " + person.ModelName, "Variant: " + person.VariantName, "FuelType: " + person.FuelType, "PreviousInsurer: " + person.SupplierName, "PolicyType: " + $scope.trackingObj.policyType, "NCB: " + idv.CurrentNCBPercent, "PolicyExpiryDate: " + CommonService.getFormattedDate(idv.ExistingPolicyExpiryDate), "RegistrationDate: " + CommonService.getFormattedDate(idv.VehicleRegistationDate), "FirstVisitURL: " + person.FirstVisitURL, "LastVisitURL: " + person.RecentVisitURL);
                                    //$zopim.livechat.clearAll();
                                    $zopim.livechat.addTags("LeadID: " + importantID, "CustomerID: " + personInfo.CustomerID,"RegistrationNumber: " + $scope.carDetails.RtoCode, "Make: " + personInfo.MakeName, "Model: " + personInfo.ModelName, "Variant: " + personInfo.VariantName, "FuelType: " + personInfo.FuelType, "PreviousInsurer: " + personInfo.SupplierName, "PolicyType: " + $scope.trackingObj.policyType, "NCB: " + $scope.Idv.CurrentNCBPercent, "PolicyExpiryDate: " + CommonService.getFormattedDate($scope.Idv.ExistingPolicyExpiryDate), "RegistrationDate: " + CommonService.getFormattedDate($scope.Idv.VehicleRegistationDate), "FirstVisitURL: " + personInfo.FirstVisitURL, "LastVisitURL: " + personInfo.RecentVisitURL);
                                    matrixLeadId = angular.copy(importantID);
                                    person = angular.copy(personInfo);
                                    idv = angular.copy($scope.Idv);
                                }
                            }
                        };

                        setAttrOnChatWindowShow();

                        function setAttrOnChatStart() {
                            clearTimeout(timer1);
                            clearTimeout(timer2);

                            if(angular.isDefined(personInfo) && personInfo.ParentLeadID != '') {
                            	$zopim.livechat.say("ChatID: " + personInfo.ParentLeadID + '_' + importantID);
                            	var dataToPost = '{"item":{"Data":{"LeadId":"' + personInfo.ParentLeadID + '","CustId":"' + personInfo.CustomerID + '","StartDate":"' + datetime + '","IntractionType":"1"}}}';
                            } else {
                            	$zopim.livechat.say("ChatID: " + importantID);
                            	var dataToPost = '{"item":{"Data":{"LeadId":"' + importantID + '","CustId":"' + personInfo.CustomerID + '","StartDate":"' + datetime + '","IntractionType":"1"}}}';
                            }

                            $.ajax({
                                url: 'http://offers.policybazaar.com/ChatService/SetCustomerInteraction',
                                headers: { 'Authorization': 'cG9saWN5 YmF6YWFy' },
                                type: 'POST',
                                data: dataToPost,
                                dataType: 'json',
                                contentType: 'application/json; charset=utf-8',
                                success: function (res) {
                                },
                                error: function (res) {
                                    //alert("Oops! error encountered");
                                }
                            });
                        }

                        function setAttrOnChatEnd() {
                            var endDate = new Date();
                            var endmm = (endDate.getMonth() + 1);
                            if (endmm < 10) {
                                endmm = "0" + (endDate.getMonth() + 1);
                            }
                            var enddd = (endDate.getDate());
                            if (enddd < 10) {
                                enddd = "0" + (endDate.getDate());
                            }
                            var enddatetime = endmm + "/"
                                + enddd + "/"
                                + endDate.getFullYear() + " "
                                + endDate.getHours() + ":"
                                + endDate.getMinutes() + ":"
                                + endDate.getSeconds();

                            if(angular.isDefined(personInfo) && personInfo.ParentLeadID != '') {
                              var dataToPost = '{"item":{"Data":{"LeadId":"' + personInfo.ParentLeadID + '","CustId":"' + personInfo.CustomerID + '","StartDate":"' + datetime + '","EndDate":"' + enddatetime + '","IntractionType":"1"}}}';
                            } else {
                              var dataToPost = '{"item":{"Data":{"LeadId":"' + importantID + '","CustId":"' + personInfo.CustomerID + '","StartDate":"' + datetime + '","EndDate":"' + enddatetime + '","IntractionType":"1"}}}';
                            }

                            $.ajax({
                                url: 'http://offers.policybazaar.com/ChatService/SetCustomerInteraction',
                                headers: { 'Authorization': 'cG9saWN5 YmF6YWFy' },
                                type: 'POST',
                                data: dataToPost,
                                dataType: 'json',
                                contentType: 'application/json; charset=utf-8',
                                success: function (res) {

                                },
                                error: function (res) {
                                    //alert("Oops! error encountered");
                                }
                            });
                        }

                        var showDelayTime = 30000;
                        var hideDelayTime = 10000;

                        if (!$zopim.livechat.isChatting()) {
                            $zopim.livechat.badge.hide();
                            timer1 = setTimeout(function () {
                                $zopim.livechat.window.show();
                                $zopim.livechat.window.onShow();
                                minimizeWindowPopup();
                            }, showDelayTime);

                            function minimizeWindowPopup() {
                                timer2 = setTimeout(function () {
                                    $zopim.livechat.window.hide();
                                    $zopim.livechat.badge.hide();

                                }, hideDelayTime);
                            }

                        }else {
                            $zopim.livechat.window.show();
                        }

                        //$zopim.livechat.window.onShow(showWindow());
                        $zopim.livechat.setOnChatStart(function(){
                            setAttrOnChatStart();
                        });
                        $zopim.livechat.setOnChatEnd(setAttrOnChatEnd);
                    });
                }


                // boolean value that determines if it is working hours
                $scope.workingHrs = CommonQuoteService.isWorkingHours();

                $scope.ip = QuoteService.getIp();

                $scope.searchObjectUrl = $location.$$search;
                // decode leadid if present in url
                if($scope.searchObjectUrl.leadid!=undefined) {
                    $scope.leadId = CommonService.decode($scope.searchObjectUrl.leadid);
                }
                // decode aid if present in url. Aid comes as UTF-16 encode so needed to decode using the function
                // decodeUTF16LE else set aid = -1
                if($scope.searchObjectUrl.aid!=undefined){
                    $scope.aid = parseInt(decodeUTF16LE(CommonService.decode($scope.searchObjectUrl.aid)),10);
                }else{
                    $scope.aid = -1;
                }
                // get enquiry id if present already otherwise get from url
                $scope.enquiryId = CommonQuoteService.getEnquiryId();
                if($scope.enquiryId<0||!Number($scope.enquiryId)) {
                    $scope.enquiryId = CommonService.decode($scope.searchObjectUrl.enquiryId);
                }
                var motorOmniture = new PBOmniture.Motor($scope.enquiryId, $scope.leadId);

                // Update enquiryid to commonservice so that can be used accross the application
                CommonQuoteService.updateEnquiryId($scope.enquiryId);
                // Update aid to commonservice so that can be used accross the application
                CommonQuoteService.updateAid($scope.aid);

                // Incase of new policy set the policy start date
                $scope.policyStartDate = CommonQuoteService.getDateFormatForNewDate();
                $scope.PremiumCovers = {"PassengerCoverOpted": false,"PassengerCoverAmount": 0,"DriverCoverOpted": false,"DriverCoverAmount": 0};
                CommonQuoteService.savePremiumCovers($scope.PremiumCovers);
                $scope.trackingChange = {};
                var noOfIntervals = 1;
                $scope.planFilters = {'IsRSA':{checked:false,'weight':25},'IsZD':{checked:false,'weight':40},'IsNCB':{checked:false,'weight':10},
                    'IsEP':{checked:false,'weight':10},'IsKLR':{checked:false,'weight':10},'IsCOC':{checked:false,'weight':5}};

                // set the premium covers to $scope.extra object
                function setPremiumCoverModelValues(data){
                    if(data.PassengerCoverOpted){
                        $scope.PremiumCovers.PassengerCoverOpted = true;
                        if(data.PassengerCoverAmount==100000) {
                            $scope.extra.passenger = -50;
                        }else{
                            $scope.extra.passenger = -100;
                        }
                        $scope.extra.passengerAmtWithTax =  Math.round($scope.extra.passenger*data.VehicleSeatingCapacity*config.SERVICE_TAX);
                        $scope.PremiumCovers.PassengerCoverAmount = Math.abs($scope.extra.passengerAmtWithTax);
                    }else{
                        $scope.PremiumCovers.PassengerCoverOpted = false;
                        $scope.PremiumCovers.PassengerCoverAmount = 0;
                    }
                    if(data.DriverCoverOpted){
                        $scope.PremiumCovers.DriverCoverOpted = true;
                        $scope.extra.driver = -50;
                        $scope.extra.diverAmtWithTax =  Math.round($scope.extra.driver*config.SERVICE_TAX);
                        $scope.PremiumCovers.DriverCoverAmount = Math.abs($scope.extra.diverAmtWithTax);
                    }else{
                        $scope.PremiumCovers.DriverCoverOpted = false;
                        $scope.PremiumCovers.DriverCoverAmount = $scope.extra.diverAmtWithTax;
                    }
                    CommonQuoteService.savePremiumCovers($scope.PremiumCovers);
                }

                // Landing modal show
                $scope.landingModal = function(){
                    $mdDialog.show({
                        escapeToClose:false,
                        clickOutsideToClose:false,
                        templateUrl: './templates/landing-modal.html'
                    }).then(function(policyDetails) {
                        if($scope.PreviousInsurerModel!=undefined) {
                            $scope.PreviousInsurerModel.PreviousPolicyExpiryDate = CommonQuoteService.getDateInFormat(policyDetails.date, policyDetails.month, policyDetails.year);
                            $rootScope.isPurchaseAllowed = !(CommonQuoteService.getdiffInDates(policyDetails.date, policyDetails.month, policyDetails.year)>45);

                            $scope.isBreakIn = CommonQuoteService.getdiffInDates(policyDetails.date, policyDetails.month, policyDetails.year)<0;
                            $scope.PreviousInsurerModel.PrevInsurerId = policyDetails.previousInsurer;
                            $scope.PreviousInsurerModel.AgentId = $scope.searchObjectUrl.aid||'';
                            $scope.PreviousInsurerModel.EnquiryId = $scope.enquiryId;
                            $scope.PreviousInsurerModel.CustTrackId = $scope.trackingObj.trackId;
                            $scope.Idv.ExistingPolicyExpiryDate = CommonQuoteService.changeDateFormat(policyDetails.date, policyDetails.month, policyDetails.year);
                            $scope.Idv.PreviousInsurerId = $scope.PreviousInsurerModel.PrevInsurerId;
                            $scope.Idv.CurrentNCBPercent = policyDetails.ncb;
                            $scope.Idv.IsClaimMade = policyDetails.IsClaimMade;
                            $scope.masteIdvValues = angular.copy($scope.Idv);
                            CommonQuoteService.setPremiumFactors($scope.masteIdvValues);
                            if ($rootScope.letProceed) {
                                $scope.saveQuoteDetails();
                            }
                        }
                    });
                };

                //Compare Modal
                $scope.showcompareModal = function(ev){
                    if(!$scope.AllDisabled) {
                        PBOmniture.compareQuotes($scope.planCompare.map(function(plan) { return plan.SupplierName + '-' + plan.PlanName}).join(' | '));
                        $mdDialog.show({
                            clickOutsideToClose:true,
                            templateUrl: './templates/compare-modal.html',
                            parent: angular.element(document.body),
                            targetEvent: ev
                        })
                        .then(function () {

                        });
                    }
                };

                //Get Car details and trackign details
                $scope.getAllEnquiryDetails = function(){
                    QuoteService.getEnquiryDetails({enquiryId:$scope.enquiryId}).success(function(data){
                        if(data!=undefined) {
                            $scope.trackingObj = {};
                            $scope.trackingObj.trackId = data.TrackId;
                            $scope.trackingObj.matrixLeadId = data.MatrixLeadId;
                            $scope.trackingObj.policyType = data.PolicyType;
                            $scope.trackingObj.isBreakIn = data.IsBreakin;
                            if(data.CarDetails!=undefined) {
                                $scope.carDetails = data.CarDetails;
                                $rootScope.fuelType = $scope.carDetails.FuelType;
                            }
                            CommonQuoteService.setEmailId(data.CustomerEmail);
                            if(data.PremiumCovers!=undefined){
                                setPremiumCoverModelValues(data.PremiumCovers);
                            }
                            if(data.PremiumFactors!=undefined) {
                                $scope.allPremiumFactors = data.PremiumFactors;
                                $scope.Idv = data.PremiumFactors;
                                $scope.Idv.idvChoose = data.PremiumFactors.IdvAmountOpted > 0;
                                $scope.masteIdvValues = angular.copy($scope.allPremiumFactors);
                                CommonQuoteService.setPremiumFactors($scope.masteIdvValues);
                                if (data.PolicyType.toLowerCase() != "new") {
                                    if (!angular.isUndefined($scope.allPremiumFactors)) {
                                        var dateObj = CommonQuoteService.getDateObject(data.PremiumFactors.ExistingPolicyExpiryDate);
                                        var diffInDates = CommonQuoteService.getdiffInDates(dateObj[2], dateObj[1], dateObj[0]);
                                        $rootScope.isPurchaseAllowed = !(diffInDates > 45);
                                        $scope.trackingObj.isBreakIn = diffInDates < 0;
                                        $rootScope.isBreakIn = $scope.trackingObj.isBreakIn;
                                        var dateRegObj = CommonQuoteService.getDateObject(data.PremiumFactors.VehicleRegistationDate);
                                        $rootScope.isZDAllowed = CommonQuoteService.getDiffInYears(dateRegObj[2], dateRegObj[1], dateRegObj[0])<=7;
                                    }
                                } else {
                                    $rootScope.isZDAllowed = true;
                                    $rootScope.isPurchaseAllowed = true;
                                    $rootScope.isNew = true;
                                }
                                CommonQuoteService.saveTrackingObj($scope.trackingObj);
                                // Get Dummy Plans
                                $scope.getPlans();

                                // Update Enquiry Details
                                $scope.updateEnquiryDetails().then(function (upData) {
                                  if (data.PolicyType.toLowerCase() != "new") {
                                      $scope.isRenewal = data.IsRenewal;
                                      CommonQuoteService.setIsRenewal($scope.isRenewal);
                                      if (!data.IsRenewal && $scope.allPremiumFactors.PreviousInsurerId < 1) {
                                          $scope.landingModal();
                                      } else {
                                          $scope.insertQuotes();
                                      }
                                  } else {
                                      $scope.insertQuotes();
                                  }
                                });

                            }
                        }

                    }).error(function(data){

                    });
                };

                // Update Enquiry details on page load
                $scope.updateEnquiryDetails = function(){
                    var deferred = $q.defer();
                    /*if($scope.leadId!=null && $scope.leadId!=undefined) {*/
                    QuoteService.updateEnquiryDetails({
                        enquiryId: $scope.searchObjectUrl.enquiryId,
                        leadId: $scope.searchObjectUrl.leadid||'',
                        custTrackId:$scope.trackingObj.trackId,
                        agentId:$scope.searchObjectUrl.aid||''
                    }).success(function (data) {
                        if(data!=undefined) {
                            $scope.trackingChange = data;
                            if (data.Status.toLowerCase() == 'ok') {
                                $scope.trackingObj.trackId = data.TrackId;
                                $rootScope.letProceed = true;
                            } else {
                                $scope.trackingChangeModal();
                                deferred.reject();
                            }
                            QuoteService.GetLeadEnquiryMap($scope.enquiryId).success(function (data) {
                                $scope.trackingObj.matrixLeadId = data.MatrixLeadId;
                                importantID = $scope.trackingObj.matrixLeadId;
                                CommonQuoteService.saveTrackingObj($scope.trackingObj);
                            }).error(function (data) {
                            });
                            CommonQuoteService.saveTrackingObj($scope.trackingObj);
                        }
                        deferred.resolve(data);
                    }).error(function (data) {
                        deferred.reject();
                    });
                    return deferred.promise;
                };




                $scope.showAdvanced = function(ev){
                    if(!$scope.AllDisabled) {
                        $mdDialog.show({
                            escapeToClose:true,
                            clickOutsideToClose:true,
                            templateUrl: './templates/idv-modal.html',
                            parent: angular.element(document.body),
                            targetEvent: ev
                        })
                            .then(function () {
                                $scope.newIdv = CommonQuoteService.getPremiumFactors();
                                $scope.newIdv.CurrentNCBPercent = parseFloat($scope.newIdv.CurrentNCBPercent);
                                $scope.Idv.idvChoose = $scope.newIdv.idvChoose;
                                var isObjectUnchanged = CommonQuoteService.isUnchanged($scope.newIdv, $scope.Idv);
                                if (!isObjectUnchanged) {
                                    motorOmniture.populateFilterTextByPremiumFactors(CommonService.getDiffObject($scope.Idv, $scope.newIdv));
                                    CommonQuoteService.setPremiumFactors($scope.newIdv);
                                    $scope.allPremiumFactors = angular.copy($scope.newIdv);
                                    $scope.Idv = angular.copy($scope.newIdv);
                                    $scope.allPremiumFactors.ClientIP = $scope.ip;
                                    $scope.allPremiumFactors.AgentId = $scope.aid;
                                    $scope.allPremiumFactors.PolicyType = $scope.trackingObj.policyType;
                                    $scope.allPremiumFactors.IsPolicyBreakIn = $rootScope.isBreakIn;
                                    $scope.allPremiumFactors.VehicleManufacturingDate  = CommonQuoteService.getManufacturingDateFromReg($scope.allPremiumFactors.VehicleRegistationDate);
                                    // for getting quotes from calculation
                                    var isCalculatedQuotes = true;
                                    $scope.allPremiumFactors.IsIdvChanges = isCalculatedQuotes;
                                    CommonQuoteService.setReHitRequired(isCalculatedQuotes);
									                  $scope.showIndeterminateProgressBar = isCalculatedQuotes;
                                    $scope.AllDisabled = isCalculatedQuotes;
                                    QuoteService.updatePremiumFactors($scope.allPremiumFactors, $scope.enquiryId,$scope.trackingObj.trackId).success(function (data) {
                                        $scope.trackingChange = data;
                                        if(!(data.Status.toLowerCase()=='ok' || data.Status.toLowerCase()=='error')) {
                                            $scope.trackingChangeModal();
                                        }else{
                                            $scope.trackingObj.trackId = data.TrackId;
                                            noOfIntervals = 1;
                                            $scope.getPlans().then(function () {
                                              if(isCalculatedQuotes) {
                                              		getQuotesByCalculation();
                                              	} else {
                                              		$scope.startFetchingQuotes();
                                              	}
                                            });
                                        }
                                        CommonQuoteService.saveTrackingObj($scope.trackingObj);

                                    }).error(function (data) {

                                    });
                                }
                            }, function () {
                                $scope.dummyIdv = angular.copy($scope.Idv);
                                CommonQuoteService.setPremiumFactors($scope.dummyIdv);

                            });
                    }
                };

                $scope.showNCB = function(ev){
                    if(!$scope.AllDisabled) {
                        $mdDialog.show({
                            escapeToClose:true,
                            clickOutsideToClose:true,
                            templateUrl: './templates/ncb-modal.html',
                            parent: angular.element(document.body),
                            targetEvent: ev
                        })
                            .then(function (ncbValues) {
                                $scope.newncbValues = ncbValues;
                                $scope.newncbValues.PreviousInsurerId = parseInt($scope.newncbValues.PreviousInsurerId,10);
                                var isObjectUnchanged = CommonQuoteService.isUnchanged($scope.newncbValues, $scope.Idv);
                                var skipInsertQuotes = CommonService.isSkipInsertQuotesForIdvModel($scope.Idv, $scope.newncbValues);
                                if (!isObjectUnchanged) {
                                    motorOmniture.populateFilterTextByPremiumFactors(CommonService.getDiffObject($scope.Idv, $scope.newncbValues));
                                    $scope.newncbValues.VehicleManufacturingDate  = CommonQuoteService.getManufacturingDateFromReg($scope.newncbValues.VehicleRegistationDate);
                                    $rootScope.NCBChanged = false;
                                    CommonQuoteService.setPremiumFactors($scope.newncbValues);
                                    $scope.allPremiumFactors = angular.copy($scope.newncbValues);
                                    $scope.Idv = angular.copy($scope.newncbValues);
                                    var dateRegObj = CommonQuoteService.getDateObject($scope.newncbValues.VehicleRegistationDate);
                                    $rootScope.isZDAllowed = CommonQuoteService.getDiffInYears(dateRegObj[2], dateRegObj[1], dateRegObj[0])<=7;
                                    resetZeroDepFilter();
                                    var expiryDate = [];
                                    expiryDate = CommonQuoteService.getDateObject($scope.newncbValues.ExistingPolicyExpiryDate);
                                    $rootScope.isPurchaseAllowed = !(CommonQuoteService.getdiffInDates(expiryDate[2], expiryDate[1], expiryDate[0])>45);
                                    $scope.Idv.SkipInsertQuotes = skipInsertQuotes;
                                    $scope.updatePremium($scope.Idv).then(function(data){
                                        $scope.trackingChange = data;
                                        if(!(data.Status.toLowerCase()=='ok' || data.Status.toLowerCase()=='error')) {
                                            $scope.trackingChangeModal();
                                        }else {
                                            $scope.trackingObj.trackId = data.TrackId;
                                            noOfIntervals = 1;
                                            $scope.getPremium().then(function (data) {
                                                $scope.Idv = data;
                                                if($scope.Idv.IdvAmountOpted>0) {
                                                    $scope.Idv.idvChoose = true;
                                                }
                                            });
                                            QuoteService.getCarDetails($scope.enquiryId).success(function (data) {
                                                $scope.carDetails = data;
                                            })
                                            if(!skipInsertQuotes) {
                                              $scope.getPlans().then(function () {
                                                  $scope.startFetchingQuotes();
                                              });
                                            } else {
                                              CommonQuoteService.setReHitRequired(true);
                                              $scope.showQuoteAnimation();
                                            }
                                        }
                                        CommonQuoteService.saveTrackingObj($scope.trackingObj);
                                    });
                                }
                            }, function () {

                                $scope.dummyIdv = angular.copy($scope.Idv);
                                CommonQuoteService.setPremiumFactors($scope.dummyIdv);
                            });
                    }
                };

                function populateSaveData(data){
                    return {"planId" : data.PlanId, "premium" : data.Breakup.FinalPremium, "ClientIP" : "", "AgentId" : $scope.aid>0?$scope.aid:0}
                };

                $scope.showPurchaseModal = function(ev,quote){

                    if(!$scope.AllDisabled) {
                        CommonQuoteService.setQuote(quote);
                        QuoteService.saveSelectedQuote(populateSaveData(quote), $scope.enquiryId).success(function (data) {

                        }).error(function (data) {
                        });
                        $mdDialog.show({
                            escapeToClose:true,
                            clickOutsideToClose:true,
                            scope:$scope,
                            preserveScope:true,
                            templateUrl: './templates/purchase-modal.html',
                            parent: angular.element(document.body),
                            targetEvent: ev
                        })
                            .then(function (answer) {
                                $scope.trackingObj = CommonQuoteService.getTrackingObj();
                                if(answer=='track'){
                                    $scope.trackingChange = CommonQuoteService.getTrackingChange();
                                    $scope.trackingChangeModal();
                                }
                                $scope.AllDisabled = false;
                                $scope.alert = 'You said the information was "' + answer + '".';


                            }, function () {
                                $scope.AllDisabled = false;
                                $scope.alert = 'You cancelled the dialog.';

                                $scope.allPremiumFactors = CommonQuoteService.getPremiumFactors();
                                $scope.Idv = angular.copy($scope.allPremiumFactors);
                                if($scope.Idv.IdvAmountOpted>0) {
                                    $scope.Idv.idvChoose = true;
                                }
                                $scope.trackingObj = CommonQuoteService.getTrackingObj();
                            });
                    }
                };

                $scope.showEditDiscountModal = function(ev){
                    if(!$scope.AllDisabled) {
                        $mdDialog.show({
                            escapeToClose:true,
                            clickOutsideToClose:true,
                            templateUrl: './templates/edit-discount-modal.html',
                            parent: angular.element(document.body),
                            targetEvent: ev
                        })
                            .then(function (obj) {
                                if(!obj.unchanged) {
                                    motorOmniture.setDiscount(true);
                                    $scope.discount = obj.discountObj;
                                    $scope.discount.ClientIP = $scope.ip;
                                    $scope.discount.AgentId = $scope.aid;
                                    QuoteService.UpdateDiscounts($scope.discount, $scope.enquiryId, $scope.trackingObj.trackId).success(function (data) {
                                        $scope.AllDisabled = true;
                                        $scope.trackingChange = data;
                                        if(data.Status.toLowerCase()=="ok") {
                                            $scope.trackingObj.trackId = data.TrackId;

                                            noOfIntervals = 1;
                                            $scope.getPlans().then(function () {

                                                $scope.startFetchingQuotes();
                                            });
                                        }else{
                                            $scope.trackingChangeModal();
                                        }
                                        CommonQuoteService.saveTrackingObj($scope.trackingObj);

                                    }).error(function () {

                                    })
                                }else{

                                }
                            }, function () {
                            });
                    }
                };

                $scope.showViewPlanModal = function(ev,quote){
                    if(!$scope.AllDisabled) {
                        CommonQuoteService.setQuote(quote);
                        $mdDialog.show({
                            escapeToClose:true,
                            clickOutsideToClose:true,
                            scope:$scope,
                            preserveScope:true,
                            templateUrl: './templates/view-plan-modal.html',
                            parent: angular.element(document.body),
                            targetEvent: ev
                        })
                            .then(function (answer) {
                                if(answer=='track'){
                                    $scope.trackingChange = CommonQuoteService.getTrackingChange();
                                    $scope.trackingChangeModal();
                                }else {
                                    $scope.AllDisabled = false;
                                    $scope.selectCompare(ev, quote, true);
                                }
                                CommonQuoteService.saveTrackingObj($scope.trackingObj);
                                $scope.allPremiumFactors = CommonQuoteService.getPremiumFactors();
                                $scope.Idv = angular.copy($scope.allPremiumFactors);
                                $scope.trackingObj = CommonQuoteService.getTrackingObj();
                            }, function () {
                                $scope.AllDisabled = false;

                                $scope.allPremiumFactors = CommonQuoteService.getPremiumFactors();
                                $scope.Idv = angular.copy($scope.allPremiumFactors);
                                if($scope.Idv.IdvAmountOpted>0) {
                                    $scope.Idv.idvChoose = true;
                                }
                                $scope.trackingObj = CommonQuoteService.getTrackingObj();
                            });
                    }
                };

                $scope.showEmailPlanModal = function(answer,ev){
                    if(!$scope.AllDisabled) {
                        $mdDialog.show({
                            escapeToClose:true,
                            clickOutsideToClose:true,
                            templateUrl: './templates/email-plan-modal.html',
                            parent: angular.element(document.body),
                            targetEvent: ev
                        })
                            .then(function (answer) {

                            }, function () {

                            });
                    }
                };

                $scope.closeModal = function() {
                    $mdDialog.hide();
                };

                $scope.cancel = function() {
                    $mdDialog.cancel();
                };

                $scope.answer = function(answer) {
                    $mdDialog.hide(answer);
                };

                $scope.getPlans = function(){
                    $scope.clearSelection();
                    $scope.AllDisabled = true;
                    var deferred = $q.defer();
                    QuoteService.getAllPlans().success(function(data){
                        $rootScope.plans = data;
                        angular.forEach($rootScope.plans,function(value){
                            value.display = true;
                            value.available = true;
                        });
                        deferred.resolve();

                    }).error(function(data){
                        deferred.reject();

                    });
                    return deferred.promise;
                };

                var getQuotesByCalculation = function() {
                  //$timeout(function(argument) {
					          var skipAddonFilterCheck = true;
                    $scope.getWithValues(skipAddonFilterCheck).then(function() {
					            $scope.showIndeterminateProgressBar = false;
                      $scope.showQuoteAnimation();
                    });
                    $scope.stopFetchingQuotes();
                    $scope.AllDisabled = false;
                  //}, 3000);
                };

                var getQuotes;
                // get the actual plans in every 5 secs
                $scope.startFetchingQuotes = function() {
                    $scope.showProgressbar = true;
                    $scope.determinateValue =0;
                    $scope.determinateValue2 = 0;
                    /*$scope.showQuoteToast();*/
                    getQuotes = $interval(function() {
                        noOfIntervals++;
                        if(noOfIntervals*5 <= 20) {
                            $scope.getWithValues();
                        }else{
                                $scope.stopFetchingQuotes();
                                $scope.AllDisabled = false;

                        }

                    }, 5*1000,5);
                    var noOfProgressTimes = 1;
                    $interval(function() {
                        noOfProgressTimes++;
                        if(noOfProgressTimes<=200) {
                            $scope.determinateValue += 0.5;
                            $scope.determinateValue2 += 0.5;
                        }else{

                        }
                    }, 100, 200, true);
                };

                $scope.stopFetchingQuotes = function() {
                    var discountAvailed = false;

                    if (angular.isDefined(getQuotes)) {
                        $interval.cancel(getQuotes);
                    }
					          $scope.showProgressbar = false;
                    angular.forEach($rootScope.plans,function(value){
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
                        if(value.Breakup.NetDiscount>0){
                            discountAvailed = true;
                        }
                        value.isSelectedForCompare = false;
                        value.addNoMoreForCompare = false;
                        value.compareText = "Compare this plan";
                    });

                    if(discountAvailed){
                        $scope.PriceName = "Discounted Price";
                    }else{
                        $scope.PriceName = "Price";
                    }

                    $rootScope.plans = CommonQuoteService.getComprehensivePlans($rootScope.plans);
		                $scope.getPremium().then(function(data){
                        $scope.Idv = data;
                        if($scope.Idv.IdvAmountOpted>0) {
                            $scope.Idv.idvChoose = true;
                        }
                        $scope.allPremiumFactors = data;
                        $scope.dummyPremiumfactors = angular.copy($scope.Idv);
                        CommonQuoteService.setPremiumFactors($scope.dummyPremiumfactors);
                    });
                    $scope.applyCommonFilter();
                      QuoteService.getPersonInfo($scope.enquiryId).success(function(data){
                        //QuoteService.getPrefComm(data.CustomerID).success(function(prefData) {
                          //var isAssist = prefData.output[0].IsAssist;

                          personInfo = data;
                          if(parseInt(importantID)>0) {
                              $(document).ready(function () {
                                  $timeout(function () {
                                      init();
                                  }, 10);
                              });
                          }
                        //});
                      });
                };

                $scope.getWithValues = function(skipAddonFilterCheck){
                    var obj = {};
                    obj.enquiryId = $scope.enquiryId;
                    obj.planId = null;
                    var deferred = $q.defer();
                    QuoteService.getAllQuotes(obj).success(function(data){
                        AllQuotes = data;

                        $rootScope.plans = CommonQuoteService.updateQuotes($rootScope.plans,data,skipAddonFilterCheck);
                        angular.forEach(AllQuotes,function(value) {
                            value.display = true;
                            value.available = true;
                            value.isSelectedForCompare = false;
                            value.addNoMoreForCompare = false;
                            value.compareText = "Compare this plan";
			                      if(value.AddOnFilters==null){
                                value.isComprehensive = true;
                            }
                            if(value.PlanId==1 || value.PlanId==13 || value.PlanId == 10){
                                value.isComprehensive = true;
                            }
                        });
                        deferred.resolve();
                    }).error(function(data){
                    })

                    return deferred.promise;
                };

                $scope.insertQuotes = function(){
                    var obj = {};
                    obj.enquiryId = $scope.enquiryId;
                    obj.planId = null;
                    noOfIntervals = 1;
                    QuoteService.insertQuotes(obj).success(function(){
                        $scope.startFetchingQuotes();
                    }).error(function(data){

                    })
                };

                $scope.refreshQuotes = function(){

                };

                $scope.saveQuoteDetails = function(){
                    $scope.updatePremium($scope.Idv).then(function(data){
                        $scope.trackingChange = data;
                        if(!(data.Status.toLowerCase()=='ok' || data.Status.toLowerCase()=='error')) {
                            $scope.trackingChangeModal();
                        }else {
                            $scope.trackingObj.trackId = data.TrackId;
                            noOfIntervals = 1;
                            $scope.getPremium().then(function (data) {
                                $scope.Idv = data;
                                if($scope.Idv.IdvAmountOpted>0) {
                                    $scope.Idv.idvChoose = true;
                                }
                            });
                            QuoteService.getCarDetails($scope.enquiryId).success(function (data) {
                                $scope.carDetails = data;
                            });
                            $scope.getPlans().then(function () {

                                $scope.startFetchingQuotes();
                            });
                        }
                        CommonQuoteService.saveTrackingObj($scope.trackingObj);
                    });
                };

                $scope.getAllEnquiryDetails();

                $scope.clearFilters = function(){
                    $scope.planFilters = {'IsRSA':{checked:false,'weight':25},'IsZD':{checked:false,'weight':40},'IsNCB':{checked:false,'weight':10},
                    'IsEP':{checked:false,'weight':10},'IsKLR':{checked:false,'weight':10},'IsCOC':{checked:false,'weight':5}};
                    $scope.applyCommonFilter();
                };

                $scope.changeZeroDepFilter = function(){
                    if($scope.planFilters.IsZD.checked){
                        $scope.zdText = 'Remove';
                    }else{
                        $scope.zdText = 'Add';
                    }
                    $scope.applyCommonFilter();
                };

                var resetZeroDepFilter = function(){
                    $scope.planFilters.IsZD.checked = false;
                    $scope.changeZeroDepFilter();
                };

                $scope.changeRsaFilter = function(){
                    $scope.applyCommonFilter();
                };
                $scope.changeNcbFilter = function(){
                    $scope.applyCommonFilter();
                };
                $scope.changeEngineProtectFilter = function(){
                    $scope.applyCommonFilter();
                };
                $scope.changekeyLockFilter = function(){
                    $scope.applyCommonFilter();
                };


                // When any filters are selected call this method to filter the data according to the weightage.
                $scope.applyCommonFilter = function(){
                    if(CommonQuoteService.getAllQuotes()!=null && CommonQuoteService.getAllQuotes()!=undefined && !CommonQuoteService.isEmptyObject(CommonQuoteService.getAllQuotes())){
                        AllQuotes = CommonQuoteService.getAllQuotes();
                        var emptyObject = {};
                        CommonQuoteService.saveAllQuotes(emptyObject);
                    }
                    $scope.showClear = $scope.planFilters.IsEP.checked || $scope.planFilters.IsKLR.checked|| $scope.planFilters.IsNCB.checked || $scope.planFilters.IsRSA.checked;
                    var dummyPlans = angular.copy(AllQuotes);
                    dummyPlans = CommonQuoteService.submitFilters($scope.planFilters,dummyPlans);

                    $rootScope.plans = dummyPlans;
                    $scope.clearSelection();
                    // Omniture Calling
                    motorOmniture.populateFilterTextByAddonFilters($scope.planFilters);
                    motorOmniture.populateFilterTextByPremiumCovers($scope.PremiumCovers);
                    PBOmniture.quotesFiltered($rootScope.plans);
                };

                // Clear all compare selections and empty the comapre plans list
                $scope.clearSelection = function(){

                    _.each($rootScope.plans, function (quote) {
                        quote.isSelectedForCompare = false;
                        quote.isSelectedForCompareCheckbox = false;
                        quote.compareText = "Compare this plan";
                        $scope.planCompare = [];
                        $scope.showClearSelection = false;
                        $scope.comparePlanButton = false;
                    });

                };

                // Request call back service call
                $scope.yescallCTCMe = function(){
                    var enquiryId = $scope.enquiryId;
                    $scope.disableAfterCall = true;
                    $scope.showCallToast();
                    QuoteService.RequestCallBack(enquiryId).success(function(data){

                    });
                };

                // Show compare data
                $scope.updateCompareData = function(event){
                    if(!$scope.AllDisabled) {
                        if ($scope.planCompare.length > 1) {
                            CommonQuoteService.setComparePlanData($scope.planCompare);
                            $scope.showcompareModal(event);
                        }
                    }
                };

                /*Compare */
                // if a particular plan has to be compared then this method is called. The plan is accepted for compare
                // only if plans to compare are less than 4. Only 4 plans can be compared at the time.
                $scope.selectCompare = function(event,quote, toggleCheckbox){
                    if(!$scope.AllDisabled) {
                        if (!quote.isSelectedForCompare) {
                            if ($scope.planCompare.length < 4) {
                                quote.isSelectedForCompare = true;
                                quote.isSelectedForCompareCheckbox = toggleCheckbox ? quote.isSelectedForCompare : quote.isSelectedForCompareCheckbox;
                                quote.compareText = "Unselect this plan";
                                $scope.planCompare.push(quote);
                                $scope.showClearSelection = true;
                            }
                        } else {
                            quote.isSelectedForCompare = false;
                            quote.isSelectedForCompareCheckbox = toggleCheckbox ? quote.isSelectedForCompare : quote.isSelectedForCompareCheckbox;
                            quote.compareText = "Compare this plan";
                            $scope.planCompare.splice($scope.planCompare.indexOf(quote), 1);
                        }

                        if ($scope.planCompare.length == 4) {
                          $timeout(function () {
                            quote.isSelectedForCompareCheckbox = quote.isSelectedForCompare;
                          }, 10);
                        }

                        if ($scope.planCompare.length > 3) {
                            _.each($rootScope.plans, function (quote) {
                                if (!quote.isSelectedForCompare)
                                    quote.compareText = "Unselect a Plan";
                            });
                        } else if ($scope.planCompare.length < 5) {
                            _.each($rootScope.plans, function (plan) {
                                if (plan.compareText == "Unselect a Plan") {
                                    plan.compareText = "Compare this plan";
                                }

                            });
                        }

                        if ($scope.planCompare.length == 0) {
                            $scope.showClearSelection = false;
                        }

                        $scope.comparePlanButton = $scope.planCompare.length > 1;
                    }
                };

                /*Premium Covers*/

                var updatePremiumCovers = function(){
                    CommonQuoteService.savePremiumCovers($scope.PremiumCovers);
                    $scope.toSendPremiumCovers = angular.copy($scope.PremiumCovers);
                    $scope.toSendPremiumCovers.ClientIP = $scope.ip;
                    $scope.toSendPremiumCovers.AgentId = $scope.aid;
                    $scope.toSendPremiumCovers.VehicleSeatingCapacity = $scope.carDetails.SeatingCapacity;
                    if(Math.abs($scope.extra.driver)>0 && $scope.toSendPremiumCovers.DriverCoverOpted){
                        $scope.toSendPremiumCovers.DriverCoverAmount = 100000;
                    }
                    if(Math.abs($scope.extra.passenger)>0 && $scope.toSendPremiumCovers.PassengerCoverOpted){
                        if(Math.abs($scope.extra.passenger)==50){
                            $scope.toSendPremiumCovers.PassengerCoverAmount = 100000;
                        }else{
                            $scope.toSendPremiumCovers.PassengerCoverAmount = 200000;
                        }
                    }
                    QuoteService.updatePremiumCovers($scope.toSendPremiumCovers,$scope.enquiryId,$scope.trackingObj.trackId).success(function (data) {
                        $scope.trackingChange = data;
                        if(!(data.Status.toLowerCase()=='ok' || data.Status.toLowerCase()=='error')) {
                            $scope.trackingChangeModal();
                        }else{
                            $scope.trackingObj.trackId = data.TrackId;
                        }
                        var obj = {};
                        obj.enquiryId = $scope.enquiryId;
                        obj.planId = null;
                        QuoteService.getAllQuotes(obj).success(function(data) {
                            AllQuotes = data;
                            angular.forEach(AllQuotes,function(value) {
                                value.display = true;
                                value.available = true;
                                value.isSelectedForCompare = false;
                                value.addNoMoreForCompare = false;
                                value.compareText = "Compare this plan";
                                if(value.AddOnFilters==null){
                                    value.isComprehensive = true;
                                }
                                if(value.PlanId==1 || value.PlanId==13 || value.PlanId == 10){
                                    value.isComprehensive = true;
                                }
                                $scope.clearSelection();
                            });
                            $scope.applyCommonFilter();
                        }).error(function(data){});
                        CommonQuoteService.saveTrackingObj($scope.trackingObj);
                    }).error(function (data) {

                    });
                };

                $scope.changePassengerValue = function(value){
                    $scope.extra.passengerAmtWithTax =  Math.round(value*$scope.carDetails.SeatingCapacity*config.SERVICE_TAX);
                    $scope.PremiumCovers.PassengerCoverOpted = Math.abs(value)>0;
                    $scope.PremiumCovers.PassengerCoverAmount = Math.round(Math.abs(value*$scope.carDetails.SeatingCapacity*config.SERVICE_TAX));
                    updatePremiumCovers();
                };

                $scope.changeDriverValue = function(value){
                    $scope.extra.diverAmtWithTax =  Math.round(value*config.SERVICE_TAX);
                    $scope.PremiumCovers.DriverCoverOpted = Math.abs(value)>0;
                    $scope.PremiumCovers.DriverCoverAmount = Math.round(Math.abs(value*config.SERVICE_TAX));
                    updatePremiumCovers();
                };

                $scope.updatePremium = function(data){
                    var deferred = $q.defer();
                    data.ClientIP = $scope.ip;
                    data.AgentId = $scope.aid;
                    data.PolicyType = $scope.trackingObj.policyType;
                    data.IsPolicyBreakIn = $rootScope.isBreakIn;
                    QuoteService.updatePremiumFactors(data, $scope.enquiryId,$scope.trackingObj.trackId).success(function (data) {
                        deferred.resolve(data);
                    }).error(function(data){
                        deferred.reject();
                    });
                    return deferred.promise;
                };

                $scope.getPremium = function(){
                    var deferred = $q.defer();
                    QuoteService.getPremiumFactors($scope.enquiryId).success(function (data) {
                        deferred.resolve(data);
                    }).error(function(data){
                        deferred.reject();
                    });
                    return deferred.promise;
                };

                $scope.trackingChangeModal = function(){
                    var confirm = $mdDialog.alert({
                        escapeToClose:false,
                        clickOutsideToClose:false})
                        .parent(angular.element(document.body))
                        .content('It seems your details were recently changed. You will be redirected to the page where your recent changes were made.')
                        .ok('Ok');
                    $mdDialog.show(confirm).then(function() {
                        $window.location.href = $scope.trackingChange.RedirectUrl;
                    });
                };

                $scope.netWorkHospital = function(){
                    $window.open("http://www.policybazaar.com/garage-locator/#/",'_blank');

                };

                $scope.showCallToast = function() {
                    $mdToast.show(
                        $mdToast.simple()
                            .content('We will call you back in a moment.')
                            .hideDelay(3000)
                    );
                };

                $scope.goToPreQuotes = function(){
                    if(!$scope.AllDisabled) {
                        if ($scope.isRenewal) {
                            $window.location.href = preQuoteUrl();
                        } else {
                            if($scope.searchObjectUrl.aid) {
                                $window.location.href = preQuoteUrl("question?enquiryId=" + CommonService.encode($scope.enquiryId, true) + "&aid="+CommonService.encode(CommonService.decode($location.$$search.aid),true));
                            }else {
                                $window.location.href = preQuoteUrl("question?enquiryId=" + CommonService.encode($scope.enquiryId, true));
                            }
                        }
                    }
                };

				        $scope.showPremiumBreakupModal = function(ev, quote){
                  if(!$scope.AllDisabled) {
                    $scope.selectedQuote = quote;
                    $mdDialog.show({
                        clickOutsideToClose:true,
                        scope:$scope,
                        preserveScope:true,
                        templateUrl: './templates/premium-breakup-modal.html',
                        parent: angular.element(document.body),
                        targetEvent: ev
                    })
				            .then(function () {

				            });
                  }
                };

                $scope.showQuoteToast = function() {
                    $mdToast.show(
                        $mdToast.simple()
                            .content('Please Wait while your quotes load')
                            .position($scope.getToastPosition())
                            .hideDelay(20*1000)

                    );
                };

                $scope.toastPosition = {
                    bottom: false,
                    top: true,
                    left: false,
                    right: true
                };

                $scope.getToastPosition = function() {
                    return Object.keys($scope.toastPosition)
                        .filter(function(pos) { return $scope.toastPosition[pos]; })
                        .join(' ');
                };

                $scope.getBreakupAddons = function(selectedQuote) {
                  return CommonService.getBreakupAddons(selectedQuote);
                };

                $scope.showQuoteAnimation = function() {
                  $scope.hideQuotes = true;
                  $timeout(function () {
                    $scope.hideQuotes = false;
                  }, 300);
                };

                $(document).ready(function () {
                    $timeout(function () {
                        var menu = document.querySelector('.some-nav-bar-show');
                        if (menu != null) {
                            var origOffsetY = menu.getBoundingClientRect().top;
                            $(window).on('scroll', function () {

                                if ($(window).scrollTop() >= origOffsetY) {
                                    $('.nav-bar').addClass('sticky');
                                    $('.grid-space').addClass('menu-padding');
                                } else {
                                    $('.nav-bar').removeClass('sticky');
                                    $('.grid-space').removeClass('menu-padding');
                                }
                            });
                        }
                    }, 10);
                });
            }]);
});
