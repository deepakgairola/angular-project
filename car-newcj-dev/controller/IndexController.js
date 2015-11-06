/**
 * Created by Prashants on 6/1/2015.
 */
define(['app'], function(app)
{
    app.controller('IndexController',
        [
            '$scope', '$rootScope','NewCarService','CommonService','QuoteService','$cookies','$location','$document','$timeout','$window','$mdDialog','$mdToast',
            function($scope, $rootScope,NewCarService,CommonService,QuoteService,$cookies,$location,$document,$timeout,$window,$mdDialog,$mdToast) {
                $scope.trackId = -1;
                $scope.active0 = true;
                $scope.active1 = false;
                $scope.active2 = false;
                $scope.active3 = false;
                $scope.showIt = false;
                $timeout(function(){$scope.showIt = true;},600);
                $scope.viewPlanQuoteName = "Next";
                $scope.noRecords = false;
                $scope.carNo = {};
                $scope.carNo.carRegNo = '';
                $scope.data = {};

                $scope.isYrsEnabled = false;
                $scope.trackingChange = {};

                // Customer exixts check
                NewCarService.customerExistsCheck().success(function(data){
                    if(data.toLowerCase()=='false') {
                        $scope.isYrsEnabled = false;

                    }else{
                        $scope.isYrsEnabled = true;
                        $scope.viewPlanQuoteName = "View Quotes";
                    }
                }).error(function(data){});

                // create visit data prefill
                var createVisitId = function(){
                    var productEnquiryModel = {};
                    productEnquiryModel.UtmSource = $location.$$search.utm_source||"";
                    productEnquiryModel.UtmTerm = $location.$$search.utm_term||"";
                    productEnquiryModel.VisitorToken = "";
                    productEnquiryModel.LandingPageName = "carprequote";
                    productEnquiryModel.LeadSourceID = 10;
                    productEnquiryModel.LeadSource = "PB";
                    productEnquiryModel.UtmCampaign = $location.$$search.utm_campaign||"";
                    productEnquiryModel.UtmMedium = $location.$$search.utm_medium||"";
                    productEnquiryModel.ReferalUrl = document.referrer;
                    NewCarService.getVisitId(productEnquiryModel).success(function(data) {

                        $scope.visitId = data;
                    }).error(function(data){})
                };

                var insertEventTrack = function(eventName) {
                  var trackObj = {
                    enquiryId: 999999,
                    eventName: eventName
                  };
                  QuoteService.insertEventTracking(trackObj).success(function(){});
                };

                // Called onload of page and redirected according to the url path defined.
                $scope.onLoad = function(){
                    if($location.$$url.indexOf("question") > -1){
                        $scope.active0 = false;
                        $scope.active2 = false;
                        $scope.active3 = false;
                        $scope.active1 = true;
                    }else if($location.$$url.indexOf("yrs")>-1){
                        $scope.openRecentSearches();
                    }else if($location.$$url.indexOf("customer")>-1){
                        $scope.active0 = false;
                        $scope.active2 = false;
                        $scope.active3 = false;
                        $scope.active1 = true;
                    }
                        if($cookies.Cookie_VisitLog==undefined || $cookies.Cookie_VisitLog==null || $cookies.Cookie_VisitLog=='undefined') {
                            createVisitId();
                        }else{
                            $scope.visitId = $cookies.Cookie_VisitLog;
                        }
                };

                // go to quetion page when begin comparison is clicked and appned question to url path
                $scope.beginComaparison = function(){
                    $location.path('/question',false);
                    $scope.active1 = true;
                    $scope.active0 = false;
                    $scope.active2 = false;
                    $scope.active3 = false;
                    PBOmniture.formStartEvent();
                };

                // go to index page if url does not contain any url paths
                $scope.getToIndexPage = function(){
                    $location.path('/',false);
                    $scope.active0 = true;
                    $scope.active1 = false;
                    $scope.active2 = false;
                    $scope.active3 = false;
                };

                // For previous policybazaar customers when registration number is entered and clicked on proceed
                // call createRenewal http service.
                $scope.createRenewal = function(ev){
                    $scope.isError = false;
                    insertEventTrack($scope.carNo.carRegNo);
                    if($scope.carNo.carRegNo!='' && $scope.carNo.carRegNo.length >= 8) {
                        $scope.carNo.carRegNo = $scope.carNo.carRegNo.replace('DL0', 'DL');
                        $scope.startLoader = true;
                        NewCarService.createRenewal({renewalRegistrationNumber: $scope.carNo.carRegNo}).success(function (data) {
                            $scope.trackingChange = data;
                            if (data != 'null' && data != null) {

                                if (data.Status.toLowerCase() == 'ok') {
                                    $scope.startLoader = false;
                                    if (data.EnquiryId > 0) {
                                        $scope.goToQuotes(CommonService.encode(data.EnquiryId, true));
                                    } else {
                                        $scope.isError = true;
                                    }
                                } else if (data.Status.toLowerCase() == 'false') {
                                    $scope.noRecords = true;
                                    $timeout(function () {
                                        $scope.startLoader = false;
                                        $scope.noRecords = false;
                                        $timeout(function () {
                                            $scope.beginComaparison();
                                        }, 1000);
                                    }, 2000);

                                } else {
                                    $scope.trackingChangeModal(ev);
                                }
                            } else {
                                $scope.noRecords = true;
                                $timeout(function () {
                                    $scope.noRecords = false;
                                    $scope.startLoader = false;
                                    $timeout(function () {
                                        $scope.beginComaparison();
                                    }, 1000);
                                }, 2000);
                            }
                        }).error(function (data) {
                        })
                    }else{
                        $scope.isError = true;
                    }
                };

                // method to go to YRS slide and calling of get preciousSearches request.
                $scope.openRecentSearches = function(){
                    $timeout(function(){
                    if($scope.isYrsEnabled) {
                        $scope.active1 = false;
                        $scope.active0 = false;
                        $scope.active2 = true;
                        $scope.active3 = false;
                        $location.path('/yrs', false);
                        NewCarService.getPreviousSearches().success(function (data) {
                            $scope.previousModels = data;
                        }).error(function (data) {
                        });
                    }
                    },100);
                };

                // redirection to quotes page
                $scope.goToQuotes  = function(enqId,leadId){
                    if(leadId!=null && leadId!=undefined) {
                        if($location.$$search.aid) {
                            $window.location.href = getQuoteUrl("?enquiryId=" + enqId + "&leadid=" + leadId + "&aid="+CommonService.encode(CommonService.decode($location.$$search.aid),true)+"&frame=true");
                        }else{
                            $window.location.href = getQuoteUrl("?enquiryId=" + enqId + "&leadid=" + leadId + "&frame=true");
                        }
                    }else{
                        if($location.$$search.aid) {
                            $window.location.href = getQuoteUrl("?enquiryId=" + enqId + "&aid="+CommonService.encode(CommonService.decode($location.$$search.aid),true)+"&frame=true");
                        }else {
                            $window.location.href = getQuoteUrl("?enquiryId=" + enqId + "&frame=true");
                        }
                    }
                };

                // on yrs page redirect to the required page when particular need is selected.
                $scope.yrsUrlRedirect = function(url){
                    $window.location.href = url;
                };

                // if tracking issue occurs show this message box and then redirect to the correct page.
                $scope.trackingChangeModal = function(trackModel){
                    var confirm = $mdDialog.alert({
                        escapeToClose:false,
                        clickOutsideToClose:false})
                        .parent(angular.element(document.body))
                        .content('It seems your details were recently changed. You will be redirected to the page where your recent changes were made.')
                        .ok('Ok')
                    $mdDialog.show(confirm).then(function() {
                        if($scope.trackingChange.RedirectUrl!=undefined) {
                            $window.location.href = $scope.trackingChange.RedirectUrl;
                        }else{
                            $window.location.href = trackModel.RedirectUrl;
                        }
                    });
                };

                // go to customer page on click of submit on question page
		        $scope.goToCustomerPage = function(){
                    $scope.active1 = false;
                    $scope.active0 = false;
                    $scope.active2 = false;
                    $scope.active3 = true;
                    $location.path('/customer',false)
                };

                $scope.onLoad();

                // if records not found for a partucalr registration number show this pop up
                $scope.showNoRecord = function(){
                    $scope.showAdvanced = function(ev) {
                        $mdDialog.show({
                            scope:$scope,
                            preserveScope:true,
                            templateUrl: 'no-record.html',
                            parent: angular.element(document.body),
                            targetEvent: ev
                        })
                            .then(function(answer) {
                                /*$scope.alert = 'You said the information was "' + answer + '".';*/
                            }, function() {
                                /*$scope.alert = 'You cancelled the dialog.';*/
                            });
                    };
                };

                $scope.showUploadDocumentModal = function(ev, quote){
                  $('pbfooter')[0].style.display = 'none';
        					$mdDialog.show({
        					  clickOutsideToClose:true,
        					  scope:$scope,
        					  preserveScope:true,
        					  templateUrl: './templates/upload-iframe-modal.html',
        					  parent: angular.element(document.body),
        					  targetEvent: ev
        					})
        					.then(function () {
                    $('pbfooter')[0].style.display = '';
        					});
                };

        				$scope.closeModal = function() {
                  $mdDialog.hide();
                };

                // Show this toast message of service fails
                $scope.showSimpleToast = function() {
                    $mdToast.show(
                        $mdToast.simple()
                            .content('Oops! Something went wrong. Please try again')
                            .hideDelay(3000)
                    );
                };

                $scope.changeRenewalRegNo = function(carRegNo) {
                  $scope.carNo.carRegNo = CommonService.trimRegNumber(carRegNo);
                };

            }
        ])
    });
