var env = "local",
config = {
    "local": {
        "protocol": "http://",
        //"rootApi" : "10.0.8.100:30101",
        "rootApi" : "carqa.policybazaar.com/CarDev",
        'rootUrl':"",
        "base" : "/",
        'cdnUrl':"cdn.policybazaar.com/assets/Car",
        'cdnHeader':"cdn.policybazaar.com/pbmodule",
        'breakInhdfcUrl' : 'netinsure.hdfcergo.com/onlineproducts/motoronline/NewBusiness/CalculatePremium.aspx?Ref=PB270106',
        'quoteUrl':'localhost:3000/#/quote',
        'preQuoteUrl':'localhost:3000/#'
    },
    "qa": {
        "protocol": "http://",
        "rootApi" : "carqa.policybazaar.com/CarDev",
        'rootUrl':"",
        "base" : "/Car",
        'cdnUrl':"cdn.policybazaar.com/assets/Car",
        'cdnHeader':"cdn.policybazaar.com/pbmodule",
        'breakInhdfcUrl' : 'netinsure.hdfcergo.com/onlineproducts/motoronline/NewBusiness/CalculatePremium.aspx?Ref=PB270106',
        'quoteUrl':'carqa.policybazaar.com/Car/#/quote',
        'preQuoteUrl':'carqa.policybazaar.com/CAR/#'

    },
    "uat": {
        "protocol": "http://",
        "rootApi" : "car.policybazaar.com",
        'rootUrl':"",
        'cdnUrl':"cdn.policybazaar.com/assets/Car",
        'cdnHeader':"cdn.policybazaar.com/pbmodule",
        "base" : "",
        'breakInhdfcUrl' : 'netinsure.hdfcergo.com/onlineproducts/motoronline/NewBusiness/CalculatePremium.aspx?Ref=PB270106',
        'quoteUrl':'carquotes.accuratequotes.in/#/quote',
        'preQuoteUrl':'carqa.policybazaar.com/#'

    },
    "live": {
        "protocol": "http://",
        "rootApi" : "car.policybazaar.com/MVCController",
        'rootUrl':"carquote",
        'cdnUrl':"pbstatic.policybazaar.com/assets/Car",
        'cdnHeader':"pbstatic.policybazaar.com/pbmodule",
        "base" : "",
        'breakInhdfcUrl' : 'netinsure.hdfcergo.com/onlineproducts/motoronline/NewBusiness/CalculatePremium.aspx?Ref=PB270106',
        'quoteUrl':'car.policybazaar.com/quote',
        'preQuoteUrl':'car.policybazaar.com'
    }

};

function getBaseServiceURL(webService) {
    return config[env].protocol +config[env].rootApi+ "/" + webService;
}

function preQuoteUrl(webService){
	if(webService!=undefined || webService!=null){
		return config[env].protocol  + config[env].preQuoteUrl + "/" + webService;
	}else{
		return config[env].protocol  + config[env].preQuoteUrl;
	}
}

function getHdfcRedirectUrl(){
    return config[env].protocol  + config[env].breakInhdfcUrl;
}

function getCdnPath(webService){
    return config[env].protocol +config[env].cdnUrl+ "/" + webService;
}

function getCdnHeaderPath(webService){
    return config[env].protocol +config[env].cdnHeader+ "/" + webService;
}

function getQuoteUrl(webService){
	if(webService!=undefined || webService!=null){
		return config[env].protocol +config[env].quoteUrl+ "/" + webService;
	}else{
		return config[env].protocol +config[env].quoteUrl;
	}
}
