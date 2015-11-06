/**
 * Created by Prashants on 6/8/2015.
 */

define(['app'], function (app) {
    app.service('CommonQuoteService', function ($rootScope, $http,QuoteService,$q) {
        'use strict';

        var CommonQuoteService = {},
        premiumFactors = {},
        planCompareData = [],
        quote = {},
        enqiryId = '',agentId='',emailId='',
        previousPolicyDetails = {},
        planNameArray = [],
        premiumCovers = {},
        isRenewal = false,
        reHitRequired = false,
        trackObject = {},trackChangeObject={},allNewQuotes={};

        // For each dummy plan update the plan when we get the actual quote from service
        CommonQuoteService.updateQuotes = function(quotes,data, skipAddonFilterCheck){
            angular.forEach(data,function(dataValue,dataKey){
                angular.forEach(quotes,function(quotesValue,quotesKey){
                    if(quotes[quotesKey].PlanId == dataValue.PlanId){
                        if(skipAddonFilterCheck || dataValue.AddOnFilters==null) {
                            quotes[quotesKey] = dataValue;
                        }
                    }
                });
            });
            return quotes;
        };


        // Check if an object is empty
        CommonQuoteService.isEmptyObject = function(obj){
                for(var prop in obj) {
                    if(obj.hasOwnProperty(prop))
                        return false;
                }
                return true;
        };

        // Populate date dropdow acording to the month and year
        CommonQuoteService.populateDates = function(month,months,year){
            var dates = [];
            if(months[3].monthId==month || months[5].monthId==month || months[8].monthId==month || months[10].monthId == month){
                dates = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
            }else if(months[1].monthId == month){
                if(year%4==0) {
                    dates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29];
                }else{
                    dates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28];
                }
            }else{
                dates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,29,30,31];
            }
            return dates;
        };

        // get date in the format mm/dd/yyyy
        CommonQuoteService.getDateInFormat = function(date,month,year){
            return month+'/'+date+'/'+year;
        };

        // Change the date in the format yyyy-mm-ddT00:00:00
        CommonQuoteService.changeDateFormat = function(date,month,year){
            return year+'-'+ ((month.toString().length==1&&month < 10) ? '0' : '') + month+'-'+((date.toString().length==1&&date < 10) ? '0' : '') + date+'T00:00:00';
        };

        // get the difference of a date from current date in no of days
        CommonQuoteService.getdiffInDates = function(date,month,year){
            var currDate = new Date(year,month-1, date);
            var newDate = new Date();
            var timeDiff = currDate.getTime() - newDate.getTime();
            return Math.ceil(timeDiff / (1000 * 3600 * 24));
        };

        // get the difference of dates in no of years
        CommonQuoteService.getDiffInYears = function(date,month,year){
            var currDate = new Date(year,month-1, date);
            var newDate = new Date();

            var timeDiff = newDate.getTime() - currDate.getTime();
            return Math.ceil(timeDiff / (1000*60*60*24*365.242199));
        };

        // get the difference of 2 dates in no of days
        CommonQuoteService.getDiffOfDates = function(date,month,year,secondDate,secondMonth,secondYear){
            var currDate = new Date(year,month-1, date);
            var newDate = new Date(secondYear,secondMonth-1,secondDate);

            var timeDiff = newDate.getTime() - currDate.getTime();
            return Math.ceil(timeDiff / (1000 * 3600 * 24));
        };

        //get date in format dd MMM YYYY for display
        CommonQuoteService.getDateFormatForNewDate = function(){
            var day = new Date();
            var year = day.getFullYear();
            var date = day.getDate();
            var month = day.getMonth();
            var months = ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec'];
            return parseInt(date,10) + " "+months[month]+" "+year;
        };

        // determine if the current hours are within 10 am and 7 pm
        CommonQuoteService.isWorkingHours = function(){
            var today = new Date();
            var hrs = today.getHours();

            return hrs>=10&&hrs<19;
        };

        // Setter method for premium factors
        CommonQuoteService.setPremiumFactors = function(data){
            premiumFactors = data;
        };

        // getter method for premium factors
        CommonQuoteService.getPremiumFactors = function(){
          return premiumFactors;
        };

        // Setter method for compare plan data
        CommonQuoteService.setComparePlanData = function(data){
            planCompareData = data;
        };

        // Getter method for comapre plan data
        CommonQuoteService.getComparePlanData = function(){
            return planCompareData;
        };

        // Setter method for a particular quote
        CommonQuoteService.setQuote = function(data){
            quote = data;
        };

        // getter method for a particular quote
        CommonQuoteService.getQuote = function(){
            return quote;
        };

        // Check if two objects are same
        CommonQuoteService.isUnchanged = function(firstObject,masterObject) {
            return angular.equals(firstObject, masterObject);
        };

        CommonQuoteService.isDisplayPlan = function(item,planFilters){
            var filterArray = [],addOnArray = [],isSubset = true;
            angular.forEach(planFilters, function (value, key) {
                if(value){
                    filterArray.push(key);
                }
            });
            angular.forEach(item.AddOnFilters, function (addOnValue, addOnKey) {
                addOnArray.push(addOnKey);
            });
            if(filterArray.length>addOnArray.length){
                isSubset = false;
            } else{
                for(var i=0;i<filterArray.length;i++){
                    if(addOnArray.indexOf(filterArray[i])==-1){
                        isSubset = false;
                        break;
                    }
                }
            }
            return isSubset;
        };

        CommonQuoteService.populateCompareObjects =  function(comparePlan){
            var compareData =[];
            var featureGrupName = [];
            _.each(comparePlan,function(value,key){
                featureGrupName.push(value.FeatureGroup);
            });
        };

        CommonQuoteService.getDateObject =  function(value) {
            if(value!=null) {
                var x = value.indexOf('T');
                return value.substr(0, x).split('-');
            }else{
                return null;
            }
        };

        CommonQuoteService.getManufacturingDateFromReg = function(date){
            var dateObj = CommonQuoteService.getDateObject(date);
            return CommonQuoteService.changeDateFormat(1,dateObj[1],dateObj[0]);
        };

        CommonQuoteService.updateEnquiryId = function(enqId){
            enqiryId  = enqId;
        };

        CommonQuoteService.getEnquiryId = function(){
            return enqiryId;
        };

        CommonQuoteService.setEmailId = function(email){
          if(angular.isDefined(email) && email != null) {
            emailId = email;
          }
        };

        CommonQuoteService.getEmailId = function(){
            return emailId;
        };

        CommonQuoteService.updateAid = function(aid){
            agentId  = aid;
        };

        CommonQuoteService.getAId = function(){
            return agentId;
        };

        CommonQuoteService.savePreviousPolicyDetails = function(data){
            previousPolicyDetails = data;
        };

        CommonQuoteService.getPreviousPolicyDetails = function(){
            return previousPolicyDetails;
        };

        CommonQuoteService.saveTrackingObj = function(trackingObj){
            trackObject = trackingObj;
        };

        CommonQuoteService.saveTrackingChange = function(trackingChange){
            trackChangeObject = trackingChange;
        }

        CommonQuoteService.getTrackingChange = function(){
            return trackChangeObject;
        }

        CommonQuoteService.getTrackingObj = function(){
            return trackObject;
        };

        CommonQuoteService.saveAllQuotes = function(quotes){
            allNewQuotes = quotes;
        };

        CommonQuoteService.getAllQuotes = function(){
            return allNewQuotes;
        };

        CommonQuoteService.savePremiumCovers = function(data){
            premiumCovers = data;
        };

        CommonQuoteService.getPremiumCovers = function(){
            return premiumCovers;
        };

        CommonQuoteService.getDiscountModel = function(enquiryId){

            var deferred = $q.defer();
            QuoteService.GetDiscount(enquiryId).success(function(data){
                deferred.resolve(data);
            }).error(function(data){
                deferred.reject();
            });
            return deferred.promise;
        };

        CommonQuoteService.setPlanNameArray = function(data){
            var planNames = [];
            var quotes = data.sort(function(a,b){
                return a-b;
            });
            _.each(quotes,function(value){
                if(planNames.length<=3){
                    if(value.available){
                        planNames.push(value.PlanName);
                    }
                }
            });

            planNameArray = planNames;
        };

        CommonQuoteService.getPlanNamesArray = function(){
            return planNameArray;
        };

        CommonQuoteService.setIsRenewal = function(isrenewal){
            isRenewal = isrenewal;
        };

        CommonQuoteService.getRenewal = function(){
            return isRenewal;
        };

        CommonQuoteService.getSupplierList = function(data){
            var allData = data;

            var callback = function (allData) {
                return allData.SupplierId;
            };
            return allData.map(callback).unique();
        };

        CommonQuoteService.useQuotes = function(quotes){

            var list = [];
            var supplierList =  CommonQuoteService.getSupplierList(quotes);
            for(var y=0;y<supplierList.length;y++){
                var tempList =[];
                for(var x=0;x<quotes.length;x++){


                    if(supplierList[y]==quotes[x].SupplierId){
                        if(quotes[x].AddOnFilters!= null){
                            tempList.push(quotes[x]);
                        }else {
                            tempList.insert(0,quotes[x]);

                        }
                    }
                }
                list.push(tempList);
            }
            return list;
        };

        // If filter is selected the push the filter name and weightage attached to it to an array
        function getFiltersSelectedArray(planFilters){
            var filterArray = [];
            angular.forEach(planFilters, function (value, key) {
                if(planFilters[key].checked){
                    filterArray.push([key,planFilters[key].weight]);
                }
            });
            return filterArray;
        }

        // If addons exists add the key to an array
        function seeIfAddOnsExist(item){
            var addOnArray = [];
            angular.forEach(item.AddOnFilters, function (addOnValue, addOnKey) {
                addOnArray.push(addOnKey);
            });

            return addOnArray;
        }

        // sorting method to sort first by one variable then the other
        function sortByProps(list, by, thenby){
            return list.sort(function(first, second){
                if(first[by] == second[by]){
                    return first[thenby] - second[thenby];
                }
                return second[by] - first[by];
            });
        }

        // Sort the plans according to weightage, and if weightage is same sort them by premium
        function sortAccToWeightAge(data){
            var sortedArray = sortByProps(data,'weightage','FinalPremium');
            if(sortedArray[0].weightage>0) {
                return sortedArray[0];
            }
        }

        // Sort by weightage method
        var sortByWeightAge = function(data){
            return sortByProps(data,'weightage','FinalPremium');
        };

        // Sort by premium method
        CommonQuoteService.sortByPremium = function(data){
            return data.sortByProp('FinalPremium');
        };

        CommonQuoteService.submitFilters = function(fil,quotes){
            var selectedFilters = getFiltersSelectedArray(fil);
            var totalWeightage = 0;

            if(selectedFilters.length>0) {
                angular.forEach(quotes, function (value, key) {
                    value.weightage = 0;
                    var arrayOfAddonAllowed = seeIfAddOnsExist(value);
                    angular.forEach(selectedFilters, function (filterValue) {
                        if (arrayOfAddonAllowed.indexOf(filterValue[0]) != -1) {
                            value.weightage += filterValue[1];
                        }
                    })
                });

                angular.forEach(selectedFilters, function (filterValue) {
                    totalWeightage += filterValue[1];
                });

                angular.forEach(quotes, function (value, key) {
                    value.percentageWeightage = Math.round((value.weightage/totalWeightage)*100);
                });

                var arraysAccToSupplier = CommonQuoteService.useQuotes(quotes);
                var filteredArray = [];
                for (var arr = 0; arr < arraysAccToSupplier.length; arr++) {
                    var supplierQuoteList = arraysAccToSupplier[arr];

                    filteredArray.push(sortAccToWeightAge(supplierQuoteList));
                }
                var lastArray =  filteredArray.filter(function(ele){
                    return ele!=undefined;
                });
                return sortByWeightAge(lastArray);
            }else{
                return CommonQuoteService.getComprehensivePlans(quotes);
            }
        };

        // only populate comprehensive plans according to the flag isComprehensive
        CommonQuoteService.getComprehensivePlans = function(data){
            var list = [];
            for(var x=0;x<data.length;x++){
                if(data[x].isComprehensive) {
                    data[x].percentageWeightage = 0;
                    list.push(data[x]);
                }
            }
            return CommonQuoteService.sortByPremium(list);
        };

        CommonQuoteService.addDaysToDate = function(numberOfDaysToAdd){
            var someDate = new Date();
            someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
            return someDate;
        };

        CommonQuoteService.setReHitRequired = function(rehitRequired) {
          reHitRequired = rehitRequired;
        };

        CommonQuoteService.getReHitRequired = function() {
          return reHitRequired;
        };

        return CommonQuoteService;
    });
});
