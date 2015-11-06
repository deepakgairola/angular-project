/**
 * Created by prashants on 7/28/2015.
 */
define(['app'], function(app) {
    app.controller('EditCarDetailsController',
        [
            '$scope', '$rootScope', '$timeout', '$http', '$mdDialog', 'QuoteService', 'CommonQuoteService', 'CommonService','NewCarService','$q','$location',
            function ($scope, $rootScope, $timeout, $http, $mdDialog, QuoteService, CommonQuoteService, CommonService,NewCarService,$q,$location) {
                $scope.closeModal = function () {
                    $mdDialog.cancel();
                };
                $scope.States = {};
                $scope.cars = {};
                $scope.isCityDisabled = false;
                $scope.isRegionDisabled = false;
                $scope.isCarDisabled = false;
                $scope.makeModelSearchText = null;
                $scope.selectedCarItem = null;
                $scope.citySearchText = '';
                $scope.fuel = '';
                $scope.searchModel = {};
                $scope.searchModel.regionSearchText = '';
                $scope.selectedCityItem = null;
                $scope.isFuelDisabled = true;
                $scope.isVariantDisabled = true;
                $scope.fuelTypes = [];
                $scope.policyType = "1";
                $scope.modelVariant = '';
                $scope.enquiryId = CommonQuoteService.getEnquiryId();
                $scope.isRegYearVisible = true;
                $scope.registYear = {};
                $scope.registYear.regisYear = '';
                $scope.registrationYear = [];
                $scope.errorPresent = false;
                $scope.loaderProceed = false;
                $scope.viewPlanQuoteName = "Refresh Quotes";
                $scope.trackingObj = CommonQuoteService.getTrackingObj();
                $scope.trackId = $scope.trackingObj.TrackId;

                var showSimpleToast = function() {
                    $mdToast.show(
                        $mdToast.simple()
                            .content('Oops! Something went wrong. Please try again')
                            .hideDelay(3000)
                    );
                };
                // Prefill data from enquiry id
                function prefillData(data) {
                    $scope.visitId = data.VisitID;
                    var year = (new Date()).getFullYear();
                    var month = (new Date()).getMonth();
                    $scope.trackId = data.CustTrackId;
                    $scope.policyType = data.PolicyType;
                    if(data.PolicyType == 0){
                        $scope.isRegYearVisible = false;
                        $scope.loadAllCity(0).then(function(){
                            var cityObject = CommonService.getCityItemValue(data.RegistrationRTOCode, $scope.city);
                            $scope.citySearchText = cityObject.display;
                            $scope.selectedCityItem = cityObject;

                        });

                    }else {
                        var dateObj = CommonQuoteService.getDateObject(data.PreviousPolicyExpiryDate);
                        var diffInDates = CommonQuoteService.getdiffInDates(dateObj[2], dateObj[1], dateObj[0]);
                        if(diffInDates<0){
                            $scope.policyType = 2;
                        }else{
                            $scope.policyType = 1;
                        }
                        $scope.searchModel.regionSearchText = data.RegistrationRTOCode;
                        $scope.selectedCityItem = CommonService.getCityItemValue(data.RegistrationRTOCode, $scope.region);
                        $scope.registYear.regisYear = CommonQuoteService.getDateObject(data.RegistrationDate)[0];
                        $scope.RegistrationDate = CommonService.getDateInFormat(new Date(year,0,1),$scope.registYear.regisYear);
                    }
                    var makeModelObjectByModelId = CommonService.getMakeModelValue(data.ModelId, $scope.makeAndModel);
                    $scope.makeModelSearchText = makeModelObjectByModelId.display;
                    $scope.selectedCarItem = makeModelObjectByModelId;
                    $scope.specificVariantData = CommonService.getSpecificVariantData($scope.allVariantData, makeModelObjectByModelId.modelId);
                    $timeout(function(){
                        $scope.fuel = CommonService.getFuelName(data.FuelTypeId);
                        $scope.fuelTypeId = data.FuelTypeId;
                        $scope.fuelTypes = CommonService.getFuelTypes($scope.specificVariantData);
                        $scope.modelVariant = CommonService.getVariantNameById($scope.specificVariantData,data.VariantId);
                        $scope.variants = CommonService.getVairantNameList($scope.specificVariantData);
                        $scope.isVariantDisabled = false;
                    },0);
                }

                // call http service to get data from Product model and prefill the data
                $scope.prefillValues = function() {
                    if ($scope.enquiryId>0) {
                        var enqId = $scope.enquiryId;
                        NewCarService.FillProductEnquiryModel(parseInt(enqId,10)).success(function (data) {
                            prefillData(data);
                        }).error(function (data) {
                        });
                    }
                };

                var registrationYearList = CommonService.getRegistrationYear(15);
                var newYearArray = [];
                var currentMonth = new Date().getMonth();
                if(currentMonth <= 6){
                    newYearArray = registrationYearList.splice(1);
                }else{
                    newYearArray = registrationYearList;
                }
                $scope.registrationYear=newYearArray;

                // http service to get make and model list from json
                $scope.loadAllMakeModel = function() {
                    NewCarService.getMakeModel().success(function(data) {

                        $scope.makeAndModel = CommonService.getModelAndModelName(data);
                        $scope.loadAllCity($scope.policyType).then(function(){
                            $scope.prefillValues();
                        });
                    }).error(function(data){})
                };

                $scope.loadAllMakeModel();

                // called when policyType radio button has been changed
                $scope.changePolicyType =function(policyType,hasChanged){
                    $scope.citySearchText = '';
                    if(policyType == '0'){
                        $scope.isRegYearVisible = false;
                    }else{
                        $scope.isRegYearVisible = true;
                    }
                    if(hasChanged){
                        $scope.loadAllCity(policyType);
                    }
                };


                $scope.changePolicyType($scope.policyType,false);

                // Watch on car resgistration year to populate the registration date
                $scope.$watch('registYear.regisYear',function(){
                    if($scope.registYear.regisYear!=''){
                        var year = (new Date()).getFullYear();
                        $scope.RegistrationDate = CommonService.getDateInFormat(new Date(year,0,1),$scope.registYear.regisYear);
                    }
                });

                // Watch on model variant to select the variant id for that corresponding model variant
                $scope.$watch('modelVariant',function(){
                    if($scope.modelVariant!='' && $scope.modelVariant!=null &&$scope.modelVariant!=undefined ){
                        $scope.selectedVariantId = CommonService.getVariantId($scope.specificVariantData,$scope.modelVariant);
                    }
                });

                // called when the fuel type is selected to fill the car variants for the particular fuel type
                $scope.changeFuelType = function(fuel){
                    $scope.modelVariant = '';
                    $scope.fuelTypeId = CommonService.getFuelId(fuel);
                    $scope.variants = CommonService.getVariantByFuel($scope.specificVariantData,$scope.fuelTypeId);
                    $scope.isVariantDisabled = false;
                };

                // call http service to load the city details. If policy type is new the get city list. If policy type is 
                // expired or rollover then get region list with region code.
                $scope.loadAllCity = function(type) {
                    var deferred = $q.defer();
                    $scope.selectedCityItem = null;
                    NewCarService.getCity(type).success(function(data) {
                        if(type == '0') {

                            $scope.city = CommonService.getCity(data,type);
                            $scope.city = _.uniq($scope.city, function(x){
                                return x.display;
                            });
                        }else{
                            $scope.region = CommonService.getCity(data,type);
                            $scope.region = _.uniq($scope.region, function(x){
                                return x.regionCode;
                            });
                        }
                        deferred.resolve();
                    }).error(function(data){deferred.reject();});
                    return deferred.promise;
                };

                // load variants data from service. 
                $scope.loadAllVariantData = function(){
                    $scope.allVariantData = [];
                    NewCarService.getAllVariants().success(function(data) {

                        $scope.allVariantData = data;
                    }).error(function(data){})
                };
                $scope.loadAllVariantData();

                // called when any region is selected from autocomplete
                $scope.selectedRegionItemChange = function(item){
                    $scope.errorPresent = false;
                    $scope.selectedCityItem = item;
                };

                // called when any city is selected from autocomplete for new policytype
                $scope.selectedCityItemChange = function(item){
                    $scope.errorPresent = false;
                    $scope.selectedCityItem = item;
                };

                // called when any make and model is selected from autocomplete to populate fuel types and vairants for 
                // the particular model
                $scope.selectedMakeModelItemChange = function(item) {
                    $scope.modelVariant =null;
                    $scope.fuel = '';
                    $scope.isFuelDisabled = true;
                    $scope.isVariantDisabled = true;
                    if(item!=undefined && item!=null && item!='' ){
                        $scope.isFuelDisabled = false;
                        $scope.specificVariantData = CommonService.getSpecificVariantData($scope.allVariantData,item.modelId);
                        $scope.fuelTypes = CommonService.getFuelTypes($scope.specificVariantData);
                        $scope.variants = CommonService.getVairantNameList($scope.specificVariantData);
                    }
                };

                // validation for registration details
                var checkForRegion = function(searchForm) {
                    if ($scope.selectedCityItem == null || Object.keys($scope.selectedCityItem).length<1) {
                        if ($scope.searchModel.regionSearchText && $scope.searchModel.regionSearchText.length >= 3) {
                            var searchtext = angular.copy($scope.searchModel.regionSearchText);
                            if (searchtext.length == 10) {
                                searchtext = searchtext.substring(0, 4);
                            }
                            $scope.selectedCityItem = CommonService.getCityItemValue(searchtext, $scope.region);
                        }

                        if ($scope.selectedCityItem == null || !$scope.selectedCityItem || Object.keys($scope.selectedCityItem).length<1) {
                            searchForm.$valid = false;
                            $scope.errorPresent = true;
                            $scope.regionErrorMessage = "Enter registration number";
                        } else {
                            if ($scope.searchModel.regionSearchText.length > 4) {
                                $scope.errorPresent = false;
                                $scope.selectedCityItem.registrationNumber = $scope.searchModel.regionSearchText;
                                $scope.selectedCityItem.value = $scope.selectedCityItem.registrationNumber;
                            }
                        }
                    }
                };

                $scope.searchRegionTextChange = function(text){
                    $scope.searchModel.regionSearchText = text;
                };

                // validation for city
                var checkForCity = function(searchForm){
                    if($scope.selectedCityItem == null || Object.keys($scope.selectedCityItem).length<1){
                        searchForm.$valid = false;
                        $scope.errorPresent = true;
                        $scope.cityErrorMessage = "Enter registration city";
                    }
                };

                // filters for autocomplete for registration
                $scope.getRegistrationMatches = function(query) {
                    var results = [];
                    query = CommonService.trim(query);
                    if(query!=null && query.length>1){
                        if($scope.region!=undefined || $scope.region!=null ) {
                            if(query.length==2){
                                results = query ? $scope.region.filter(CommonService.createFilterForFirst2Values(query)) : [];
                            }
                            if(results.length==0 || query.length>2){
                                results = query ? $scope.region.filter(CommonService.createFilterFor(query)) : [];
                            }
                            return results;
                        }
                    }else{
                        return [];
                    }
                };

                // filters for autocomplete for make model
                $scope.getMakeModelMatches = function(query) {
                    var results = [];
                    query = CommonService.trim(query);
                    if(query!=null && query.length>1){
                        if($scope.makeAndModel!=undefined || $scope.makeAndModel!=null ) {

                            results = query ? $scope.makeAndModel.filter(CommonService.createFilterFor(query)) : [];

                            return results;
                        }
                    }else{
                        return [];
                    }
                };

                // Populate enquiry detials to save the car enquiry input by the customer
                $scope.populateEnquiryDetails = function(isValid,searchForm) {
                    $scope.data = {};
                    if($scope.policyType==0) {
                        checkForCity(searchForm);
                    }else {
                        checkForRegion(searchForm);
                    }

                    if (searchForm.$valid) {
                        $scope.data.MakeId = $scope.selectedCarItem.makeId;
                        $scope.data.ModelId = $scope.selectedCarItem.modelId;
                        $scope.data.VariantId = $scope.selectedVariantId;
                        var policyType = $scope.policyType;
                        if($scope.policyType == 2){
                            $scope.data.isPolicyBreakCase =true;
                        }else{
                            $scope.data.isPolicyBreakCase =false;
                        }
                        if($scope.policyType==1){
                            policyType = 2;

                        }
                        $scope.data.policyType = policyType;
                        if($scope.policyType == 0){
                            $scope.data.CityId = $scope.selectedCityItem.cityId;
                            $scope.data.StateId = $scope.selectedCityItem.stateId;
                            $scope.data.RegisteredCityId = $scope.selectedCityItem.RegisteredCityId;
                            $scope.data.RegisteredStateId = $scope.selectedCityItem.RegisteredStateId;
                            var year = (new Date()).getFullYear();
                            $scope.RegistrationDate = CommonService.getDateInFormat(new Date(year,0,1),year);
                        }else {
                            $scope.data.RegisteredCityId = $scope.selectedCityItem.cityId;
                            $scope.data.RegisteredStateId = $scope.selectedCityItem.stateId;
                            $scope.data.CityId = $scope.selectedCityItem.contactCityId;
                            $scope.data.StateId = $scope.selectedCityItem.contactStateId;
                        }

                        $scope.data.RegistrationRTOCode = $scope.selectedCityItem.regionCode || "";
                        $scope.data.RegistrationNumber = $scope.selectedCityItem.registrationNumber || $scope.selectedCityItem.regionCode || "";
                        $scope.data.RegistrationCode = $scope.selectedCityItem.registrationCode || '';
                        $scope.data.FuelTypeId = $scope.fuelTypeId;
                        $scope.data.RegistrationDate = $scope.RegistrationDate;
                        $scope.data.ManufacturingDate = $scope.RegistrationDate;
                        $scope.data.VisitID = $scope.visitId;
                        $scope.data.CustTrackId = $scope.trackId;
                        $scope.data.EnquiryId = $scope.enquiryId;
                        $scope.data.AgentId = $location.$$search.aid||'';
                        $scope.data.ReferalUrl = document.referrer||'';
                        var productEnquiryModel = CommonService.populateSaveData($scope.data);
                        $scope.loaderProceed = true;
                        $scope.viewPlanQuoteName = "Please Wait";

                        // call http service save enquiry to save the enquiry by user
                        NewCarService.saveEnquiry(productEnquiryModel).success(function (data) {

                            if(data!=undefined && data.EnquiryId!=undefined){
                                $scope.enqiryId = CommonService.encode(data.EnquiryId,true);
                                $scope.trackingChange = data;

                                if(data.Status.toLowerCase() == 'ok') {
                                    if(data.EnquiryId>0){
                                        $scope.trackingObj.TrackId = $scope.trackingChange.TrackId;
                                        CommonQuoteService.saveTrackingChange($scope.trackingObj);
                                        $scope.viewPlanQuoteName = "Refresh Quotes";
                                        $mdDialog.hide(data.EnquiryId);
                                    }else{
                                        $scope.loaderProceed = false;
                                        showSimpleToast();
                                    }
                                }else{
                                    $mdDialog.hide("error");
                                }
                            }else{
                                $scope.viewPlanQuoteName = "Retry";
                                $scope.loaderProceed = false;
                                showSimpleToast();
                            }
                        }).error(function (data) {
                        })


                    }

                };
            }
        ]
    )
});