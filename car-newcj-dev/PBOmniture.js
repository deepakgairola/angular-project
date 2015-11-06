var PBOmniture = (function() {
  //console.log('[*] Omniture wrapper loaded');

  var PBOmniture = {
    filterText: '',
    enquiryId: 0,
    leadId: 0,
    Motor: function(enquiryId, leadId) {
      var appliedFilter = [];
      var filterModel = {
        addons: [],
        premiumCovers: [],
        premiumFactors: [],
        discountApplied: false
      };
      PBOmniture.enquiryId = enquiryId || 0;
      PBOmniture.leadId = leadId || 0;
      PBOmniture.leadGenerated();

      this.populateFilterTextByAddonFilters = function(addonFilters) {
        appliedFilter = [];
        angular.forEach(Object.keys(addonFilters), function(filter) {
          // Populating list of applicable filters
          if(addonFilters[filter].checked) {
            appliedFilter.push(filter.match('Is(.+)')[1]);
          }
        });
        PBOmniture.filterText = _mergeFilterTexts('addons', appliedFilter);
        return PBOmniture.filterText;
      };

      this.populateFilterTextByPremiumCovers = function(premiumCovers) {
        appliedFilter = [];
        if(premiumCovers.DriverCoverOpted) {
          appliedFilter.push('DriverCover');
        }
        if(premiumCovers.PassengerCoverOpted) {
          appliedFilter.push('PassengerCover:' + premiumCovers.PassengerCoverAmount);
        }
        PBOmniture.filterText = _mergeFilterTexts('premiumCovers', appliedFilter);
        return PBOmniture.filterText;
      };

      this.populateFilterTextByPremiumFactors = function(premiumFactors) {
        appliedFilter = [];
        //console.log('premiumFactors ', premiumFactors);
        if(angular.isDefined(premiumFactors.IsClaimMade)) {
          appliedFilter.push('NCBClaimed');
        }
        if(premiumFactors.CurrentNCBPercent) {
          appliedFilter.push('NCB:' + premiumFactors.CurrentNCBPercent);
        }
        if(premiumFactors.VehicleRegistationDate) {
          appliedFilter.push('RegistationDate:' + premiumFactors.VehicleRegistationDate);
        }
        if(premiumFactors.ExistingPolicyExpiryDate) {
          appliedFilter.push('PolicyExpiryDate:' + premiumFactors.ExistingPolicyExpiryDate);
        }
        if(premiumFactors.PreviousInsurerId) {
          appliedFilter.push('PreviousInsurer:' + premiumFactors.PreviousInsurerId);
        }
        if(premiumFactors.IdvAmountOpted) {
          appliedFilter.push('IDV:' + (premiumFactors.IdvAmountOpted == 0 ? 'BestDeal' : premiumFactors.IdvAmountOpted));
        }
        if(premiumFactors.ElecAccessoriesAmount > 0) {
          appliedFilter.push('ElecAccessories:' + premiumFactors.ElecAccessoriesAmount);
        }
        if(premiumFactors.NonElecAccessoriesAmount > 0) {
          appliedFilter.push('NonElecAccessories:' + premiumFactors.NonElecAccessoriesAmount);
        }
        if(premiumFactors.ExternalKitAmount > 0) {
          appliedFilter.push('CNGKit:' + premiumFactors.ExternalKitAmount);
        }
        PBOmniture.filterText = _mergeFilterTexts('premiumFactors', appliedFilter);
        return PBOmniture.filterText;
      };

      this.setDiscount = function(isApply) {
        filterModel.discountApplied = isApply;
      };

      this.setFilterText = function(filter) {
        PBOmniture.filterText = filter;
      };

      var _mergeFilterTexts = function(filterType, appliedFilter) {
        //console.log('[+] List of applicable filters : ', appliedFilter);
        filterModel[filterType] = appliedFilter;
        var allAppliedFilter = filterModel.addons.concat(filterModel.premiumCovers).concat(filterModel.premiumFactors);
        if(filterModel.discountApplied) {
          allAppliedFilter.push('Discount');
        }
        PBOmniture.filterText = allAppliedFilter.length == 0 ? 'All Plans' : allAppliedFilter.join(' | ');
        return PBOmniture.filterText;
      };
    }
  };

  this._getUserType = function() {
    // can be 'guest' or 'signed-in'
    var userType = 'guest';
    if(document.cookie.indexOf('SessionLog') != -1) {
      userType = 'signed-in';
    }
    return userType;
  };

  this._getProductByQuotes = function(quotes) {
    //product':';<InsurerName>-<PlanName>;;;;eVar16=Price_ABC,;<InsurerName>-<PlanName>;;;;eVar16=Price_DEF’,;<InsurerName>-<PlanName>;;;;eVar16=Price_XYZ’
    var products = [];
    angular.forEach(quotes, function(quote) {
      if(quote.available && quote.display) {
        var product = ';' + quote.SupplierName + '-' + quote.PlanName
                          + ';;;;eVar16=' + quote.Breakup.FinalPremium + ',';
        products.push(product);
      }
    });
    return products.join('');
  };

  window.digitalData = {
     page: {
       pageName: 'pb:Car-Insurance-Index',
       channel: 'Car Insurance',
       subSection1: 'Home',
       subSection2: 'Motor Insurance',
       subSection3: 'Car Insurance',
       leadid: 0,
       enquiryId: 0,
       customerId: 0,
       userType: _getUserType(),
       formname: 'Car-PreQuotes'
    }
  };

  PBOmniture.pageBottomEvent = function() {
    //console.log('[+] event page bottom');
    _satellite.pageBottom();
  };

  PBOmniture.formStartEvent = function(pageName) {
    //console.log('[+] event form start');
    digitalData.page.pageName = pageName ? ('pb:Car-Insurance-' + pageName) : 'pb:Car-Insurance-PreQuote';
    _satellite.track('Pageparam');
	_satellite.track('formstart');
  };

  PBOmniture.enquiryGeneratedEvent = function(enquiryId) {
    digitalData.page.pageName = 'pb:Car-Insurance-PreQuote';
    digitalData.page.enquiryId = enquiryId;
    digitalData.page.userType = _getUserType();
    //console.log('[+] enquiry-generated', digitalData);
    _satellite.track('Pageparam');
    _satellite.track('enquiry-generated');
  };

  PBOmniture.leadGenerated = function(leadId, enquiryId) {
    digitalData.page.pageName = 'pb:Car-Insurance-Quote';
    digitalData.page.leadid = leadId || this.leadId;
    digitalData.page.enquiryId = enquiryId || this.enquiryId;
    digitalData.page.customerId = 0;
    digitalData.page.userType = _getUserType();
    digitalData.page.formname = 'Car-Quotes';
    //console.log('enqlead-generated: ', digitalData);
    _satellite.track('Pageparam');
    _satellite.track('enqlead-generated');
  };

  PBOmniture.quotesFiltered = function(quotes, filter) {
    console.log('total quotes: ', quotes.length, quotes);
    digitalData.page.pageName = 'pb:Car-Insurance-Quote';
    digitalData.page.leadid = this.leadId;
    digitalData.page.enquiryId = this.enquiryId;
    digitalData.page.customerId = 0;
    digitalData.page.userType = _getUserType();
    digitalData.page.formname = 'Car-Quotes';
    digitalData.page.filterApplied = filter || this.filterText;
    digitalData.page.product = _getProductByQuotes(quotes);
    //console.log('filterUsedCLEID: ', digitalData);
    //product':';<InsurerName>-<PlanName>;;;;eVar16=Price_ABC,;<InsurerName>-<PlanName>;;;;eVar16=Price_DEF’,;<InsurerName>-<PlanName>;;;;eVar16=Price_XYZ’
    _satellite.track('Pageparam');
    _satellite.track('filterUsedCLEID');
  };

  PBOmniture.compareQuotes = function(selectedQuotes) {
    digitalData.page.pageName = 'pb:Car-Insurance-Quote';
    digitalData.page.leadid = this.leadId;
    digitalData.page.enquiryId = this.enquiryId;
    digitalData.page.customerId = 0;
    digitalData.page.userType = _getUserType();
    digitalData.page.formname = 'Car-Quotes';
    digitalData.page.selectedPlan = selectedQuotes;
    //console.log('compared: ', digitalData);
    _satellite.track('Pageparam');
    _satellite.track('compared');
  };

  PBOmniture.pageParam = function(pageName) {
    digitalData.page.pageName = 'pb:Car-Insurance-' + pageName;
    //console.log('Pageparam: ', digitalData);
    _satellite.track('Pageparam');
  };

  return PBOmniture;
})();
