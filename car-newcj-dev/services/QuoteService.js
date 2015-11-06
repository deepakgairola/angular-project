/**
 * Created by Prashants on 6/4/2015.
 */

define(['app'], function (app) {
    app.service('QuoteService', function ($rootScope, $http) {
        'use strict';

        var QuoteService = {},
        insertQuoteUrl = getBaseServiceURL('quote/insertquotes'),
        getQuotesUrl = getBaseServiceURL('quote/getreceivedquotes'),
        getPlansUrl = getCdnPath('json/AllQuotes.json'),
        productEnquiryDetailsUrl = getBaseServiceURL('prequote/FillProductEnquiryModel'),
        carDetails = getBaseServiceURL('quote/GetQuotePageDetails'),
        updateDetailsUrl = getBaseServiceURL('prequote/UpdateEnquiryDetails'),
        previousInsurerUrl = getCdnPath('json/previousInsurer.json'),
        saveQuoteInformationUrl = getBaseServiceURL('prequote/SavePreviousInsurerModel'),
        premiumFactorsUrl = getBaseServiceURL('quote/GetPremiumFactors'),
        updatePremiumFactorsUrl = getBaseServiceURL('quote/UpdatePremiumFactors'),
        comparisonDataUrl = getBaseServiceURL('quote/GetPlanComparisionData'),
        professionUrl = getCdnPath('json/Profession.json'),
        updateDiscountUrl = getBaseServiceURL('quote/UpdateDiscounts'),
        updatePremiumCoversUrl = getBaseServiceURL('quote/UpdatePremiumCovers'),
        buyPlanUrl = getBaseServiceURL('quote/BuyPlan'),
        saveSelectedQuotesUrl =getBaseServiceURL('quote/SaveSelectedQuotes'),
        sendMailUrl = getBaseServiceURL('quote/SendQuotesMail'),
            getDiscountUrl = getBaseServiceURL('quote/GetDiscounts'),
		GetLeadEnquiryMapUrl = getBaseServiceURL('master/GetLeadEnquiryMap'),
            carDetailsUrl = getBaseServiceURL('quote/GetCarDetails'),
	    insertEventTrackingUrl = getBaseServiceURL('quote/InsertEventTracking'),
            getPersonInfoUrl = getBaseServiceURL('quote/getchatinfo'),
            getPrefCommUrl = 'http://apiqa.policybazaar.com/cs/customer/getPrefComm?productID=117&commTypeID=3',
            requestCallbackUrl = getBaseServiceURL('quote/requestCallBack');

        QuoteService.getAllPlans = function() {
        	var request = $http ({
                method : "GET",
                url : getPlansUrl
            });
            return request.success(
                function(data, status, headers, config) { }).error(function(data, status, headers, config) { });
        };

        QuoteService.updateEnquiryDetails = function(data) {
            var request = $http ({
                method : "POST",
                data:data,
                url : updateDetailsUrl
            });
            return request.success(
                function(data, status, headers, config) { }).error(function(data, status, headers, config) { });
        };

        QuoteService.getAllQuotes = function(data) {
            var url = getQuotesUrl+'/enquiry/'+data.enquiryId;
            var request = $http ({
                method : "GET",
                url : url
            });
            return request.success(
                function(data, status, headers, config) { }).error(function(data, status, headers, config) { });
        };

        QuoteService.insertQuotes = function(data) {
            var url = insertQuoteUrl+'/enquiry/'+data.enquiryId;
            var request = $http ({
                method : "POST",
                url : url,
                contentType: "application/json; charset=utf-8"
            });

            return request.success(
                function(data, status, headers, config) { }).error(function(data, status, headers, config) { });
        };

        QuoteService.getEnquiryDetails = function(data) {
            var url = carDetails+'/enquiry/'+data.enquiryId;
            var request = $http ({
                method : "GET",
                url : url,
                contentType: "application/json; charset=utf-8"
            });
            return request.success(
                function(data, status, headers, config) { }).error(function(data, status, headers, config) { });
        };

        QuoteService.getProductEnquiryDetails = function(data) {
            var url = productEnquiryDetailsUrl+'?enquiryId='+data.enquiryId;
            var request = $http ({
                method : "GET",
                url : url,
                contentType: "application/json; charset=utf-8"
            });
            return request.success(
                function(data, status, headers, config) { }).error(function(data, status, headers, config) { });
        };

        QuoteService.previousInsurer = function() {
            var request = $http ({
                method : "GET",
                url : previousInsurerUrl
            });
            return request.success(
                function(data, status, headers, config) { }).error(function(data, status, headers, config) { });
        };

        QuoteService.saveQuoteDetails = function(data){
            var request = $http ({
                method : "POST",
                data:data,
                url : saveQuoteInformationUrl
            });
            return request.success(
                function(data, status, headers, config) { }).error(function(data, status, headers, config) { });
        };

        QuoteService.getPremiumFactors = function(data){
            var url = premiumFactorsUrl+'/enquiry/'+data;
            var request = $http ({
                method : "GET",
                url : url
            });
            return request.success(
                function(data, status, headers, config) { }).error(function(data, status, headers, config) { });
        };

        QuoteService.updatePremiumFactors = function(data,enquiryId,trackId){
            var url = updatePremiumFactorsUrl+'/enquiry/'+enquiryId+'/tracking/'+trackId;
            var request = $http ({
                method : "POST",
                data:data,
                url : url
            });
            return request.success(
                function(data, status, headers, config) { }).error(function(data, status, headers, config) { });
        };

        QuoteService.getComparisonData = function(data) {
            var url = comparisonDataUrl+'/'+data;
            var request = $http ({
                method : "GET",
                url : url
            });
            return request.success(
                function(data, status, headers, config) { }).error(function(data, status, headers, config) { });
        };

        QuoteService.getProfession = function(data) {
            var request = $http ({
                method : "GET",
                url : professionUrl
            });
            return request.success(
                function(data, status, headers, config) { }).error(function(data, status, headers, config) { });
        };

		QuoteService.GetLeadEnquiryMap = function(data) {
		var url = GetLeadEnquiryMapUrl + '/enquiry/'+data;
            var request = $http ({
                method : "GET",
                url : url
            });
            return request.success(
                function(data, status, headers, config) { }).error(function(data, status, headers, config) { });
        };

        QuoteService.UpdateDiscounts = function(data,enquiryId,trackId){
            var url = updateDiscountUrl+'/enquiry/'+enquiryId+'/tracking/'+trackId;
            var request = $http ({
                method : "POST",
                data:data,
                url : url
            });
            return request.success(
                function(data, status, headers, config) { }).error(function(data, status, headers, config) { });
        };

        QuoteService.updatePremiumCovers = function(data,enquiryId,trackId){
            var url = updatePremiumCoversUrl+'/enquiry/'+enquiryId+'/tracking/'+trackId;
            var request = $http ({
                method : "POST",
                data:data,
                url : url
            });
            return request.success(
                function(data, status, headers, config) { }).error(function(data, status, headers, config) { });
        };

        QuoteService.getIp = function() {
            return "";
        };

        QuoteService.buyPlan = function(data,enquiryId,trackId){
            var url = buyPlanUrl+'/enquiry/'+enquiryId+'/tracking/'+trackId;
            var request = $http ({
                method : "POST",
                data:data,
                url : url
            });
            return request.success(
                function(data, status, headers, config) { }).error(function(data, status, headers, config) { });
        };

        QuoteService.saveSelectedQuote = function(data,enquiryId){
            var url = saveSelectedQuotesUrl+'/enquiry/'+enquiryId;
            var request = $http ({
                method : "POST",
                data:data,
                url : url
            });
            return request.success(
                function(data, status, headers, config) { }).error(function(data, status, headers, config) { });
        };

        QuoteService.sendMail = function(data,enquiryId){
            var url = sendMailUrl+'/enquiry/'+enquiryId;
            var request = $http ({
                method : "POST",
                data:data,
                url : url
            });
            return request.success(
                function(data, status, headers, config) { }).error(function(data, status, headers, config) { });
        };

        QuoteService.GetDiscount = function(data) {
            var url = getDiscountUrl + '/enquiry/'+data;
            var request = $http ({
                method : "GET",
                url : url
            });
            return request.success(
                function(data, status, headers, config) { }).error(function(data, status, headers, config) { });
        };

        QuoteService.RequestCallBack = function(data) {
            var url = requestCallbackUrl + '/enquiry/'+data;
            var request = $http ({
                method : "GET",
                url : url
            });
            return request.success(
                function(data, status, headers, config) { }).error(function(data, status, headers, config) { });
        };

        QuoteService.getCarDetails = function(data){
            var url = carDetailsUrl + '/enquiry/'+data;
            var request = $http ({
                method : "GET",
                url : url
            });
            return request.success(
                function(data, status, headers, config) { }).error(function(data, status, headers, config) { });
        };

        QuoteService.insertEventTracking = function(data){
            var url = insertEventTrackingUrl+"?enquiryId="+data.enquiryId+"&eventName="+data.eventName;
            var request = $http ({
                method : "POST",
                url : url
            });
            return request.success(
                function(data, status, headers, config) { }).error(function(data, status, headers, config) { });
        };
        QuoteService.getPersonInfo = function(enqId){
            var url = getPersonInfoUrl + '?enquiryId='+enqId;
            var request = $http ({
                method : "GET",
                url : url
            });
            return request.success(
                function(data, status, headers, config) { }).error(function(data, status, headers, config) { });
        };
        QuoteService.getPrefComm = function(customerID){
            var url = getPrefCommUrl + '&customerID='+customerID;
            var request = $http ({
                method : "GET",
                url : url
            });
            return request.success(
                function(data, status, headers, config) { }).error(function(data, status, headers, config) { });
        };

        return QuoteService;
    });
});
