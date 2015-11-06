define(['app'], function(app){
	
  app.filter('trimNameSpace', function () {
    return function (value) {
    		var arrString = value.split(" ");
    		if (arrString[0].length == 1 || arrString[0].length == 2) {
    			if(arrString[1] != undefined) {
    				var nameString = arrString[0] + " " + arrString[1];
    			} else {
    				var nameString = arrString[0];
    			}
    		} else {
    			var nameString = arrString[0];
    		}
        return nameString;
    };
  });

  app.filter('spaceToUnderscore', function () {
    return function (value) {
        if(value!=undefined) {
            var convertString = value.split(' ').join('_');
            return convertString;
        }
        return;
    };
  });

    app.filter('yesNo', function () {
        return function (value) {
            if(value!=undefined) {
                if(value){
                return 'Yes';
                }else{
                    return 'No';
                }
            }
        }
    });

    app.filter('customDateFormat',function(){
        var months = ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec'];
        var dateForm = [];
       return function(value){
          if(value!=undefined){
              var x = value.indexOf('T');
              dateForm = value.substr(0,x).split('-');
              return dateForm[2]+" "+months[dateForm[1]-1]+" "+dateForm[0];
          }
       } ;
    });

    app.filter('amountConvertString', function () {
    return function (value) {
        if(value!=undefined) {

            var num = Math.floor(value).toString(),
                numLength = num.length,
                displayNum = '',
                suffix = '';

            if (numLength == 5) {
                displayNum = num / 1000;
                suffix = (displayNum > 1) ? "K" : "K";
            } else if (numLength == 6) {
                displayNum = num / 100000;
                suffix = (displayNum > 1) ? "Lacs" : "Lacs";
            } else if (numLength == 7) {
                displayNum = num / 100000;
                suffix = (displayNum > 1) ? "Lacs" : "Lacs";
            } else if (numLength == 8) {
                displayNum = num / 10000000;
                suffix = (displayNum > 1) ? "Cr" : "Cr";
            } else if (numLength == 9) {
                displayNum = num / 10000000;
                suffix = (displayNum > 1) ? "Cr" : "Cr";
            }

            displayNum = Math.floor(100 * displayNum) / 100;
            return displayNum + " " + suffix;
        }
        return "";
    };
  });

    app.filter('addCommas', function () {
        return function (value) {
            if(value!=undefined) {
                value += '';
                var x = value.split('.');
                var x1 = x[0];
                var x2 = x.length > 1 ? '.' + x[1] : '';
                var lastThree = x1.substring(x1.length-3);
                var otherNumbers = x1.substring(0,x1.length-3);
                if(otherNumbers != '')
                    lastThree = ',' + lastThree;
                var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
                return res + x2;
            }else{
                return "";
            }
        };
    });

    app.filter('truncated', function () {
        return function (value) {
            if(value!=undefined) {
                var value = value.toTitleCase();
                if(value.length>37){
                    value = value.substr(0,37)+'...';
                }
                return value;
            }else{
                return "";
            }
        };
    });

    app.filter('titleCase', function () {
        return function (value) {
            if(value!=undefined) {
                return value.toTitleCase();
            }else{
                return '';
            }
        }
    });

    app.filter('removeHtmlTags', function () {
        return function (value) {
            if(value!=undefined) {
                var str = value.replace(/(<p>|<\/p>|<strong>|<\/strong>|<br>|<\/br>|<br\/>|<br \/>|<Br>|<\/Br>|<Br\/>|<Br \/>)/g, "");
                return str;
            }else{
                return '';
            }
        }
    });
    app.filter('showDifferences', function($rootScope) {
        return function( items, difference) {
            var filtered = [];

            var filterFeatures = function(items){
                var filtered = [];
                if(!angular.isUndefined(items) && items.length){
                    for(var i=0; i<items.length; i++){
                        var item = items[i];
                        filtered[i] = item;
                        for(var j=0; j<item.Features.length; j++){
                            var innerItem = item.Features[j];
                            filtered[i].Features[j] = innerItem;
                            innerItem.isDisplay = true;
                            if($rootScope.showDifferences){
                                var response = changeArrayFormat(innerItem.Data);
                                var isIdentical = isValuesIdentical(response);
                                if(isIdentical){
                                    innerItem.isDisplay = false;
                                }
                            }
                        }
                    }
                }else{
                    filtered = items;
                }
                return filtered;
            };

            var isValuesIdentical = function(values){
                var len = values.length - 1;
                while(len){
                    if(values[len--].toUpperCase() !== values[len].toUpperCase())
                        return false;
                }
                return true;
            };

            var changeArrayFormat = function(input){
                var response = [];
                angular.forEach(input, function(item) {
                    response.push(item.Text);
                });
                return response;
            };

            filtered = filterFeatures(items);
            return filtered;

        };
    });

});