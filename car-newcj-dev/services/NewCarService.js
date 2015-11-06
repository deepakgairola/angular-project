/**
 * Created by Prashants on 6/2/2015.
 */
define(['app'], function (app) {
    app.service('NewCarService', function ($rootScope,$http) {
        'use strict';

        var NewCarService = {};

        var makeModelVariantUrl = getCdnPath('json/MakeModel.json');
        var contactCityUrl = getCdnPath('json/ContactCity.json');
        var contactCityDetailsUrl = getCdnPath('json/RegistraionRegion.json');
        var visitIdUrl = getBaseServiceURL('prequote/CreateVisit');
        var saveEnquiryUrl = getBaseServiceURL('prequote/SaveEnquiryDetails');
        var createRenewal = getBaseServiceURL('Renewal/CreateRenewal');
        var recentSearchesUrl = getBaseServiceURL('prequote/GetYRSDetails');
        var matrixContinueUrl = getBaseServiceURL('CommonAction/GetMatrixContinueURL');
        var customerExistsCheckUrl = getBaseServiceURL('prequote/IsCustomerCookieExist');
        var fillProductDetailsUrl = getBaseServiceURL('prequote/FillProductEnquiryModel');
        var GetOldCJModelUrl = getBaseServiceURL('prequote/GetOldCJModel');
        var getCountryCodesUrl = getCdnPath('json/contry_codes.json');
        var setCustomerLoginDetailsUrl = getBaseServiceURL('prequote/CustomerLogin');
        var variantUrl = getCdnPath('json/Variant.json');

        NewCarService.getVisitId = function(data) {
            var request = $http ({
                method : "POST",
                data: data,
                url : visitIdUrl
            });
            return request.success(
                function(data, status, headers, config) { }).error(function(data, status, headers, config) { });
        };

        NewCarService.saveEnquiry = function(data) {
            var request = $http ({
                method : "POST",
                data: data,
                url : saveEnquiryUrl
            });
            return request.success(
                function(data, status, headers, config) { }).error(function(data, status, headers, config) { });
        };


        NewCarService.getCity = function(data) {
            var contactUrl = contactCityDetailsUrl;
            // if(data == '0'){
            //     contactUrl = contactCityUrl;
            // }
            var request = $http ({
                method : "GET",
                url : contactUrl
            });
            return request.success(
                function(data, status, headers, config) { }).error(function(data, status, headers, config) { });
        };

        NewCarService.getMakeModel = function() {
            var request = $http ({
                method : "GET",
                url : makeModelVariantUrl
            });
            return request.success(
                function(data, status, headers, config) { }).error(function(data, status, headers, config) { });
        };


        NewCarService.getAllVariants = function() {

            var request = $http ({
                method : "GET",
                url : variantUrl
            });
            return request.success(
                function(data, status, headers, config) { }).error(function(data, status, headers, config) { });

        };

        NewCarService.createRenewal = function(data) {
            var request = $http ({
                method : "POST",
                data: data,
                url : createRenewal
            });
            return  request.success(
                function(data, status, headers, config) { }).error(function(data, status, headers, config) { });

        };

        NewCarService.getPreviousSearches = function() {
            var request = $http ({
                method : "GET",
                url : recentSearchesUrl
            });
            return request.success(
                function(data, status, headers, config) { }).error(function(data, status, headers, config) { });

        };

        NewCarService.continueJourney = function(data){
            var url = matrixContinueUrl+'?leadId='+data.uid+'&agentId='+data.aid;
            var request = $http ({
                method : "GET",
                url : url
            });
            return request.success(
                function(data, status, headers, config) { }).error(function(data, status, headers, config) { });
        };

        NewCarService.customerExistsCheck = function(){
            var request = $http ({
                method : "GET",
                url : customerExistsCheckUrl
            });
            return request.success(
                function(data, status, headers, config) { }).error(function(data, status, headers, config) { });
        };

        NewCarService.FillProductEnquiryModel = function(enqId){
            var url = fillProductDetailsUrl +'?enquiryId='+ enqId;
            var request = $http ({
                method : "GET",
                url : url
            });
            return request.success(
                function(data, status, headers, config) { }).error(function(data, status, headers, config) { });
        };

        NewCarService.GetOldCJModel = function(uid){
            var url = GetOldCJModelUrl +'?leadId='+ uid;
            var request = $http ({
                method : "GET",
                url : url
            });
            return request.success(
                function(data, status, headers, config) { }).error(function(data, status, headers, config) { });
        };

        NewCarService.getCountryCodes = function(){
            var request = $http ({
                method : "GET",
                url : getCountryCodesUrl
            });
            return request.success(
                function(data, status, headers, config) { }).error(function(data, status, headers, config) { });
        };

        NewCarService.setCustomerLoginDetails = function(data) {
            var request = $http ({
                method : "POST",
                data: data,
                url : setCustomerLoginDetailsUrl
            });
            return  request.success(
                function(data, status, headers, config) { }).error(function(data, status, headers, config) { });

        };

        return NewCarService;
    });
});
