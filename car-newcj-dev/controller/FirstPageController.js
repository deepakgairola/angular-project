/**
 * Created by Prashants on 6/1/2015.
 */
define(['app'], function(app) {
    app.controller('FirstPageController',
        [
            '$scope', '$rootScope', '$timeout','$http','CommonService','NewCarService','$window','$location','CommonQuoteService','$cookies','$q',
            function ($scope, $rootScope, $timeout,$http,CommonService,NewCarService,$window,$location,CommonQuoteService,$cookies,$q) {
                if($location.path() == '/question') {
                  PBOmniture.formStartEvent();
                }
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
                $scope.enquiryId = 0;
                $scope.isRegYearVisible = true;
                $scope.registYear = {};
                $scope.registYear.regisYear = '';
                $scope.registrationYear = [];
                $scope.errorPresent = false;
                $scope.loaderProceed = false;
                $scope.rtoCities = [];
                var FuelModel = {
                  IsCNGFitted: false,
                  TypeOfCNGKit: 0,
                  CNGAmount: 0
                };

                // Prefill data from enquiry id/uid from url
                function prefillData(data) {
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
                        if(dateObj!=null) {
                            var diffInDates = CommonQuoteService.getdiffInDates(dateObj[2], dateObj[1], dateObj[0]);
                            if (diffInDates < 0) {
                                $scope.policyType = 2;
                            } else {
                                $scope.policyType = 1;
                            }
                        }else{
                            $scope.policyType = data.PolicyType;
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
                      FuelModel = {
                        IsCNGFitted: data.IsCNGFitted,
                        TypeOfCNGKit: data.TypeOfCNGKit,
                        CNGAmount: data.CNGAmount
                      };
                      $scope.fuelTypes = CommonService.getFuelTypes($scope.specificVariantData);
                      if($scope.fuelTypes.indexOf('Petrol') != -1) {
                        // If any model has petrol fuel type, then append external kit manually
                        $scope.fuelTypes.push('External CNG Kit');
                      }
                      if(data.TypeOfCNGKit == 2) {
                        // in case 'External CNG Kit'
                        $scope.fuel = 'External CNG Kit';
                      }
                      $scope.modelVariant = CommonService.getVariantNameById($scope.specificVariantData,data.VariantId);
                      $scope.variants = CommonService.getVairantNameList($scope.specificVariantData);
                      $scope.isVariantDisabled = false;
                    },0);
                }

                // call http service to get the values to be prefilled from ither enquiry id from  new journey
                // or uid from old journey
                $scope.prefillValues = function() {
                    if ($location.$$search.enquiryId != null && Base64.decode($location.$$search.enquiryId)!=0) {
                        var enqId = '';
                            enqId = Base64.decode(($location.$$search.enquiryId).trim());
                        $scope.enquiryId = enqId;
						            NewCarService.FillProductEnquiryModel(parseInt(enqId,10)).success(function (data) {
                            prefillData(data);
                        }).error(function (data) {
                        });
                    }else if($location.$$search.uid!=null){
                        NewCarService.GetOldCJModel(encodeURIComponent($location.$$search.uid)).success(function (data) {
                            $scope.WebsiteLeadId = CommonService.encode(data.WebsiteLeadId,true);
                            prefillData(data);
                        }).error(function (data) {
                        });
                    }else{

                    }
                };

                var registrationYearList = CommonService.getRegistrationYear(15);
                var newYearArray = [];
                newYearArray = registrationYearList.splice(1);
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
                    // checking for bi fuel kit
                    if(fuel == 'External CNG Kit') {
                      FuelModel.IsCNGFitted = true;
                      FuelModel.TypeOfCNGKit = 2; // 2 in case of externally fitted
                      FuelModel.CNGAmount = 20000; // default CNG amount
                    } else if (fuel == 'CNG') {
                      FuelModel.IsCNGFitted = true;
                      FuelModel.TypeOfCNGKit = 1; // 1 in case of internally fitted
                      FuelModel.CNGAmount = 0;
                    } else {
                      FuelModel.IsCNGFitted = false;
                      FuelModel.TypeOfCNGKit = 0; // 1 in case of internally fitted
                      FuelModel.CNGAmount = 0;
                    }
                };

                // call http service to load the city details. If policy type is new the get city list. If policy type is
                // expired or rollover then get region list with region code.
                $scope.loadAllCity = function(type) {
                    var deferred = $q.defer();
                    $scope.selectedCityItem = null;
                    if(angular.equals($scope.rtoCities, [])) {
                      NewCarService.getCity(type).success(function(data) {
                        $scope.rtoCities = CommonService.getCity(data,type);
                        $scope.rtoCities = _.uniq($scope.rtoCities, function(x){
                            return x.regionCode;
                        });
                        $scope.city = $scope.rtoCities;
                        $scope.region = $scope.rtoCities;
                        deferred.resolve();
                      }).error(function(data){deferred.reject();});
                    }
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
                    FuelModel = {};
                    $scope.isFuelDisabled = true;
                    $scope.isVariantDisabled = true;
                    if(item!=undefined && item!=null && item!='' ){
                        $scope.isFuelDisabled = false;
                        $scope.specificVariantData = CommonService.getSpecificVariantData($scope.allVariantData,item.modelId);
                        $scope.fuelTypes = CommonService.getFuelTypes($scope.specificVariantData);

                        if($scope.fuelTypes.indexOf('Petrol') != -1) {
                          // If any model has petrol fuel type, then append external kit manually
                          $scope.fuelTypes.push('External CNG Kit');
                        }
                        if($scope.fuelTypes.length == 1) {
                          // If only one fuel type is there, then auto select it
                          $scope.fuel = $scope.fuelTypes[0];
                          $scope.changeFuelType($scope.fuel);
                        }
                        $scope.variants = CommonService.getVairantNameList($scope.specificVariantData);
                        if($scope.variants.length == 1) {
                          // If there is only one variant for make model fuel type combination,
                          // then auto select it
                          //$scope.modelVariant = $scope.variants[0];
                        }
                    }
                };

                // validation for registration details
                var checkForRegion = function(searchForm) {
                    if ($scope.selectedCityItem == null || Object.keys($scope.selectedCityItem).length<1) {
                        if ($scope.searchModel.regionSearchText && $scope.searchModel.regionSearchText.length >= 3) {
                            var searchtext = angular.copy($scope.searchModel.regionSearchText);
                            searchtext = CommonService.trimRegNumber(searchtext);
                            if (searchtext.length >= 8 && searchtext.length <= 11) {
                                //searchtext = searchtext.substring(0, 4);
                                // getting registration code
                                var matchedtext = searchtext.match(/(\w){2}\d{1,2}/);
                                if(matchedtext) {
                                  searchtext = matchedtext[0];
                                }
                            }
                            $scope.selectedCityItem = CommonService.getCityItemValue(searchtext, $scope.region);
                          }
                          if ($scope.selectedCityItem == null || !$scope.selectedCityItem || Object.keys($scope.selectedCityItem).length<1) {
                              searchForm.$valid = false;
                              $scope.errorPresent = true;
                              if ($scope.searchModel.regionSearchText.length == 0) {
                                $scope.regionErrorMessage = "Enter registration number";
                              } else {
                                $scope.regionErrorMessage = "Enter valid registration number(e.g. DL01AB1234)";
                              }
                          } else {
                              if ($scope.searchModel.regionSearchText.length >= 3) {
                                  $scope.errorPresent = false;
                                  $scope.selectedCityItem.registrationNumber = CommonService.trimRegNumber($scope.searchModel.regionSearchText);
                                  $scope.selectedCityItem.value = $scope.selectedCityItem.registrationNumber;
                              }
                          }
                      }
                };

                $scope.searchRegionTextChange = function(text){
                    $scope.regionSearchText = CommonService.trimRegNumber(text);
                    $scope.searchModel.regionSearchText = $scope.regionSearchText;
                    $scope.selectedCityItem = null;
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
                            $scope.data.CityId = $scope.selectedCityItem.contactCityId;
                            $scope.data.StateId = $scope.selectedCityItem.contactStateId;
                            $scope.data.RegisteredCityId = $scope.selectedCityItem.cityId;
                            $scope.data.RegisteredStateId = $scope.selectedCityItem.stateId;
                            var year = (new Date()).getFullYear();
                            var month = (new Date()).getMonth();
                            var date = (new Date()).getDate();
                            $scope.RegistrationDate = CommonService.getDateInFormat(new Date(year,month,date),year);
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
                        $scope.data.IsCNGFitted = FuelModel.IsCNGFitted;
                        $scope.data.TypeOfCNGKit = FuelModel.TypeOfCNGKit;
                        $scope.data.CNGAmount = FuelModel.CNGAmount;
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
                                        PBOmniture.enquiryGeneratedEvent(data.EnquiryId);
                                        //$location.$$search.enquiryId = CommonService.encode(data.EnquiryId,true);
                                        if($location.$$search.aid){
                                            $scope.viewPlanQuoteName = "Next";
                                            $scope.goToQuotes($scope.enqiryId);
                                        }else {
                                            //NewCarService.customerExistsCheck().success(function (data) {

                                                $scope.loaderProceed = false;
                                                // if (data.toLowerCase() == "false") {
                                                    $scope.viewPlanQuoteName = "Next";
                                                    CommonQuoteService.updateEnquiryId($scope.enqiryId);
                                                    $scope.trackId = data.TrackId;
                                                    $rootScope.$emit('CustomerEnquiryGenerated', $scope.enqiryId);
                                                    $scope.goToCustomerPage();
                                                // } else {
                                                //     $scope.viewPlanQuoteName = "View Quotes";
                                                //     $scope.goToQuotes($scope.enqiryId, $scope.WebsiteLeadId);
                                                // }

                                            // }).error(function (data) {
                                            // });
                                        }
                                    }else{
                                    $scope.loaderProceed = false;
                                        $scope.showSimpleToast();
                                    }
                                }else{
                                    $scope.trackingChangeModal($scope.trackingChange);
                                }
                            }else{
                                $scope.viewPlanQuoteName = "Retry";
                                $scope.loaderProceed = false;
                                $scope.showSimpleToast();
                            }
                        }).error(function (data) {
                        })


                    }

                };

                $scope.trim = function(value){
                    $scope.makeModelSearchText =  CommonService.trim(value);
                };


            }
        ])
});
