/**
 * Created by Prashants on 6/2/2015.
 */


define(['app'], function (app) {
    app.service('CommonService', function ($location, $filter) {
        'use strict';

        var CommonService = {};

        CommonService.getFuelName = function(id){
            if(id == 4){
                return 'Diesel';
            }else if(id == 7){
                return 'Petrol';
            }else if(id == 3){
                return 'CNG';
            }else if(id == 5){
                return 'LPG';
            }else if(id == 8){
                return 'LPG_Petrol';
            }else if(id == 9){
                return 'Electric';
            }
        }

        CommonService.getFuelId = function(name){
            if(name == 'Diesel'){
                return 4;
            }else if(name == 'Petrol' || name == 'External CNG Kit'){
                return 7;
            }else if(name == 'CNG'){
                return 3;
            }else if(name == 'LPG'){
                return 5;
            }else if(name == 'LPG_Petrol'){
                return 8;
            }else if(name == 'Electric'){
                return 9;
            }else if(name.indexOf('company')!=-1){
                return 10;
            }else if(name.indexOf('third')!=-1){
                return 11;
            }
        };

        CommonService.trim = function(value){
            return value.replace(/,/g, "").replace(/ /g, '').replace(/\(/g, '').replace(/\)/g, '').replace(/-/g, "").toLowerCase();
        }

        CommonService.trimRegNumber = function(value){
            if(value) {
              return value.replace(/[^a-zA-Z0-9]/, '').substr(0, 11).toUpperCase();
            }
        };

        CommonService.getModelAndModelName = function (data) {
            var allData = data;
            var callback = function (allData) {
                return{
                    modelId:allData.ModelId,
                    makeId:allData.MakeId,
                    display:allData.AliasModelName.toLowerCase().toTitleCase(),
                    searchString:CommonService.trim(allData.ModelName)+allData.ModelName.replace(" ","")+allData.ModelName
                }
            }
            var mapIns = allData.map(callback);
            return mapIns;
        };

        CommonService.getRegistrationYear = function(lastLimit){
            var registrationYear = [];
            var currentYear = new Date().getFullYear();
            for(var i=0;i<=lastLimit;i++){
                registrationYear.push(currentYear-i);
            }
            return registrationYear;
        };

        CommonService.getBirthYear = function(){
            var currentYear = new Date().getFullYear();
            var allowedMinYear = currentYear - 18;
            var allowedYearList = [];
            var lastLimit = currentYear-100;
            for(var i=lastLimit;i<=allowedMinYear;i++){
                allowedYearList.push(i);
            }
            return allowedYearList.reverse();
        }

        CommonService.getDateInFormat = function(date,regYear){
            var d =date;

            var y = regYear;
            var m = d.getMonth()+1;
            var da = d.getDate();

            return m+'/'+da+'/'+y;
        };

        CommonService.getCity = function (data,type) {
            var allData = data;
            var callback = function (allData) {
                var displayData=allData.AliasRegionCode+'-'+allData.CityName+'('+allData.StateName+')';
                var searchString=allData.AliasRegionCode+'('+allData.CityName+')'+allData.RegionCode;
                if(type!=0) {
                  var disValue=allData.RegionCode;
                } else {
                  var disValue=allData.AliasRegionCode+'-'+allData.CityName+'('+allData.StateName+')';
                }
                return{
                    display:displayData,
                    value:disValue,
                    searchString:searchString,
                    stateId:allData.StateId,
                    cityId:allData.CityId,
                    regionCode:allData.RegionCode,
                    aliasRegionCode:allData.AliasRegionCode,
                    registrationCode:allData.RegistrationCode,
                    contactStateId:allData.ContactStateId,
                    contactCityId:allData.ContactCityId,
                    RegisteredStateId:allData.RegisteredStateId,
                    RegisteredCityId:allData.RegisteredCityId
                }
            };
            return allData.map(callback);
        };


        CommonService.getCityItemValue = function(display,data){
        	var obj = {};
          	obj = _.findWhere(data, {regionCode: display.toUpperCase()});
        	if(display.toUpperCase().indexOf('DL') == 0 && obj == undefined) {
        	  // checking for DL1, DL2, etc cases
        	  obj = _.findWhere(data, {aliasRegionCode: display.toUpperCase()});
        	}
        	obj = obj == undefined ? {} : obj;
        	// _.each(data,function(value){
        	//     if(display.toLowerCase() == value.regionCode.toLowerCase()){
        	//         obj = value;
        	//     }
        	// });
        	return obj;
        };

        CommonService.getMakeModelValue = function(id,data){
            var obj = {};
            _.each(data,function(value){
                if(id == value.modelId){
                    obj = value;
                }
            });
            return obj;
        };

        CommonService.createFilterFor = function(query) {
            var lowercaseQuery = angular.lowercase(query);

            return function filterFn(data) {

                return (data.searchString.toLowerCase().indexOf(lowercaseQuery) != -1);
            };
        };

        CommonService.createFilterForFirst2Values = function(query) {
            var lowercaseQuery = angular.lowercase(query);

            return function filterFn(data) {

                return (data.searchString.toLowerCase().substr(0,2).indexOf(lowercaseQuery) != -1);
            };
        };



        CommonService.getSpecificVariantData = function(data,ModelId){
            return _.where(data, {ModelId: ModelId});
        };

        CommonService.getVairantNameList = function (data) {
            var allData = data;

            var callback = function (allData) {
                return allData.VariantName;
            };
            return allData.map(callback).unique();
        };

        CommonService.getVariantByFuel = function(data,fuel){
            var specificVariantData = _.where(data, {FuelTypeId: fuel});

            return CommonService.getVairantNameList(specificVariantData);
        };

        CommonService.getFuelTypes = function(data){
            var allData = data;
            var callback = function (allData) {
                return CommonService.getFuelName(allData.FuelTypeId);
            };
            return allData.map(callback).unique();
        };

        CommonService.getFuelTypeByVariant = function(data,modelVariant){
            var someData = data.filter(function(ele){
                return ele.VariantName == modelVariant;
            });
            var fuelType = CommonService.getFuelTypes(someData);
            if(fuelType[0].toLowerCase().indexOf('petrol')!=-1 || fuelType[0].toLowerCase().indexOf('diesel')!=-1) {
                fuelType.push('CNG (company fitted)');
            }
            return fuelType;
        };

        CommonService.getVariantId = function(specificVariantData,modelVariant){
            var someData = specificVariantData.filter(function(ele){
                return ele.VariantName == modelVariant;
            });

            return someData[0].VariantId;
        };

        CommonService.getVariantNameById = function(variantList,id){
            var name = '';
            _.each(variantList,function(value){
                if(value.VariantId == id){
                    name = value.VariantName;
                }
            });
            return name;
        };

        CommonService.populateSaveData = function(data){
            var productEnquiryModel = {};
            productEnquiryModel.UtmSource = $location.$$search.utm_source||"";
            productEnquiryModel.UtmTerm = $location.$$search.utm_term||"";
            productEnquiryModel.VisitorToken = "";
            productEnquiryModel.LandingPageName = "carprequote";
            productEnquiryModel.LeadSourceID = 10;
            productEnquiryModel.LeadSource = "PB";
            productEnquiryModel.UtmCampaign = $location.$$search.utm_campaign||"";
            productEnquiryModel.UtmMedium = $location.$$search.utm_medium||"";

            //before social login Start
            productEnquiryModel.MakeId = data.MakeId;
            productEnquiryModel.ModelId = data.ModelId;
            productEnquiryModel.VariantId = data.VariantId;
            productEnquiryModel.PolicyType = data.policyType;
            productEnquiryModel.RegisteredCityId = data.RegisteredCityId;
            productEnquiryModel.CityId = data.CityId;
            productEnquiryModel.StateId = data.StateId;
            productEnquiryModel.RegisteredStateId = data.RegisteredStateId;
            productEnquiryModel.RegistrationNumber = data.RegistrationNumber;
            productEnquiryModel.RegistrationCode = data.RegistrationCode;
            productEnquiryModel.FuelTypeId = data.FuelTypeId;
            productEnquiryModel.VehicleOwnedById = 1;
            productEnquiryModel.RegistrationDate = data.RegistrationDate;
            productEnquiryModel.RegistrationRTOCode = data.RegistrationRTOCode;
            productEnquiryModel.ManufacturingDate = data.ManufacturingDate;
            productEnquiryModel.CustTrackId = data.CustTrackId;
            productEnquiryModel.VisitID = data.VisitID;
            productEnquiryModel.isPolicyBreakCase = data.isPolicyBreakCase;
            productEnquiryModel.EnquiryId = data.EnquiryId;
            productEnquiryModel.AgentId = data.AgentId;
            productEnquiryModel.ReferalUrl = data.ReferalUrl;
            productEnquiryModel.IsCNGFitted = data.IsCNGFitted;
            productEnquiryModel.TypeOfCNGKit = data.TypeOfCNGKit;
            productEnquiryModel.CNGAmount = data.CNGAmount;
            return productEnquiryModel;
        };

        CommonService.encode = function(value,hasToUrlEncode){
            if(value!=undefined) {
                value = value.toString();
                var encodedValue = Base64.encode(value);
                if (hasToUrlEncode) {
                    encodedValue = encodeURIComponent(encodedValue);
                }
                return encodedValue;
            }
        };

        CommonService.decode = function(value,urlDecode){
            if(value!=undefined) {
                value = value.toString();
                if (urlDecode) {
                    value = decodeURIComponent(value);
                }

                return Base64.decode(value);
            }
        };

        CommonService.getFormattedDate = function(dateToBeFormatted) {
          var monthNames = [
            "01", "02", "03",
            "04", "05", "06", "07",
            "08", "09", "10",
            "11", "12"
          ];
          var date = new Date(dateToBeFormatted);
          var day = date.getDate();
          var monthIndex = date.getMonth();
          var year = date.getFullYear();
          if (day < 10) {
            day = "0" + day;
          }
          return monthNames[monthIndex] + "/" + day + "/" + year;
        };

        // Compares two object and returns the differences in Object form
        CommonService.getDiffObject = function(prevObj, newObj) {
          var diffObj = {};
          if(angular.isDefined(prevObj) && angular.isDefined(newObj)) {
            var keys = Object.keys(newObj);
            angular.forEach(keys, function(key) {
              if(prevObj[key] != newObj[key] ) {
                diffObj[key] = newObj[key];
              };
            });
          }
          return diffObj;
        };

        CommonService.getBreakupAddons = function(selectedQuote) {
          var breakupAddons = [];
          if(selectedQuote.AddOnFilters) {
            if(selectedQuote.AddOnFilters.IsZD || selectedQuote.Breakup.ZeroDepPremium > 0) {
              breakupAddons.push({
                text: 'Zero Depreciation',
                value: $filter('addCommas')(selectedQuote.Breakup.ZeroDepPremium)
              });
            }
            if(selectedQuote.AddOnFilters.IsRSA || selectedQuote.Breakup.RsaPremium > 0) {
              breakupAddons.push({
                text: 'Roadside Assistance',
                value: $filter('addCommas')(selectedQuote.Breakup.RsaPremium)
              });
            }
            if(selectedQuote.AddOnFilters.IsNCB || selectedQuote.Breakup.NcbProtectorPremium > 0) {
              breakupAddons.push({
                text: 'NCB Protection',
                value: $filter('addCommas')(selectedQuote.Breakup.NcbProtectorPremium)
              });
            }
            if(selectedQuote.AddOnFilters.IsEP || selectedQuote.Breakup.EngineProtectorPremium > 0) {
              breakupAddons.push({
                text: 'Engine Protector',
                value: $filter('addCommas')(selectedQuote.Breakup.EngineProtectorPremium)
              });
            }
            if(selectedQuote.AddOnFilters.IsINPC || selectedQuote.Breakup.InvoicePriceCoverPremium > 0) {
              breakupAddons.push({
                text: 'Invoice Prive Cover',
                value: $filter('addCommas')(selectedQuote.Breakup.InvoicePriceCoverPremium)
              });
            }
            if(selectedQuote.AddOnFilters.IsKLR || selectedQuote.Breakup.KeyReplacementPremium > 0) {
              breakupAddons.push({
                text: 'Key & Lock Replacement',
                value: $filter('addCommas')(selectedQuote.Breakup.KeyReplacementPremium)
              });
            }
            if(selectedQuote.AddOnFilters.IsLPB || selectedQuote.Breakup.LossOfPersonalBelongingPremium > 0) {
              breakupAddons.push({
                text: 'Loss of Personal Belongings',
                value: $filter('addCommas')(selectedQuote.Breakup.LossOfPersonalBelongingPremium)
              });
            }
            if(selectedQuote.AddOnFilters.IsCOC || selectedQuote.Breakup.CostOfConsumablesPremium > 0) {
              breakupAddons.push({
                text: 'Cost of consumables',
                value: $filter('addCommas')(selectedQuote.Breakup.CostOfConsumablesPremium)
              });
            }
            if(selectedQuote.AddOnFilters.IsPA || selectedQuote.Breakup.PersonelAssistancePremium > 0) {
              breakupAddons.push({
                text: 'Personel Assistance',
                value: $filter('addCommas')(selectedQuote.Breakup.PersonelAssistancePremium)
              });
            }
            if(selectedQuote.AddOnFilters.IsETHE || selectedQuote.Breakup.EmergencyTransportandHotelPremium > 0) {
              breakupAddons.push({
                text: 'Emergency Transport and Hotel',
                value: $filter('addCommas')(selectedQuote.Breakup.EmergencyTransportandHotelPremium)
              });
            }
            if(selectedQuote.AddOnFilters.IsDAC || selectedQuote.Breakup.DailyAllowancePremium > 0) {
              breakupAddons.push({
                text: 'Daily allowance',
                value: $filter('addCommas')(selectedQuote.Breakup.DailyAllowancePremium)
              });
            }
          }
          angular.forEach(breakupAddons, function(addon) {
            if(selectedQuote.SupplierId == 13 || addon.value == 0) {
              // In case of Bajaj, hide all premium values
              addon.value = 'Included';
            }
          });
          selectedQuote.breakupAddons = breakupAddons;
          return breakupAddons;
        };

        // Compares two object and returns the differences in Object form
        CommonService.getDiffObject = function(prevObj, newObj) {
          var diffObj = {};
          if(angular.isDefined(prevObj) && angular.isDefined(newObj)) {
            var keys = Object.keys(newObj);
            angular.forEach(keys, function(key) {
              if(prevObj[key] != newObj[key] ) {
                diffObj[key] = newObj[key];
              };
            });
          }
          return diffObj;
        };

        CommonService.isSkipInsertQuotesForIdvModel = function(prevIdvModel, currentIdvModel) {
          var skipInsertQuotes = false;
          var isSameAgeBand = false;
          var noChangeInBreakinCase = false;
          var onlyChangeInDates = false;

          // checking if there is only change in Reg. date and expiry date
          var diffIdvModel = CommonService.getDiffObject(prevIdvModel, currentIdvModel);
          delete diffIdvModel.VehicleRegistationDate;
          delete diffIdvModel.ExistingPolicyExpiryDate;
          delete diffIdvModel.NewPolicyStartDate;
          delete diffIdvModel.NewPolicyEndDate;
          onlyChangeInDates = angular.equals(diffIdvModel, {});
          console.log('diffIdvModel ', diffIdvModel);

          if(onlyChangeInDates) {
            var prevExpiryDate = new Date(prevIdvModel.ExistingPolicyExpiryDate);
            var currentExpiryDate = new Date(currentIdvModel.ExistingPolicyExpiryDate);

            var prevAgeDiff = prevExpiryDate.getTime() - new Date(prevIdvModel.VehicleRegistationDate).getTime();
            var prevAge = Math.ceil(prevAgeDiff / (1000*60*60*24*365.242199));
            var currentAgeDiff = currentExpiryDate.getTime() - new Date(currentIdvModel.VehicleRegistationDate).getTime();
            var currentAge = Math.ceil(currentAgeDiff / (1000*60*60*24*365.242199));

            // Checking if same age band
            isSameAgeBand = prevAge == currentAge;

            var today = new Date();
            var prevDiff = prevExpiryDate.getTime() - today.getTime();
            var currentDiff = currentExpiryDate.getTime() - today.getTime();

            noChangeInBreakinCase = prevDiff > 0 && currentDiff > 0;
            //var noChangeInBreakin = (prevDiff < 0 && currentDiff < 0) || (prevDiff > 0 && currentDiff > 0);
          }
          skipInsertQuotes = onlyChangeInDates && isSameAgeBand && noChangeInBreakinCase;
          return skipInsertQuotes;
        };

        return CommonService;
    });
});
