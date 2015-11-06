/**
 * Created by Prashants on 5/1/2015.
 */
define([], function()
{
    var formCarousel = angular.module('new-form-carousel',[]);
formCarousel.controller('CarouselController', ['$scope',  '$animate', function ($scope,$animate) {
    var self = this,
        slides = self.slides = $scope.slides = [],
        currentIndex = -1;

    self.currentSlide = null;

    var destroyed = false;
    /* direction: "prev" or "next" */
    self.select = $scope.select = function(nextSlide, direction) {
        var nextIndex = self.indexOfSlide(nextSlide);
        //Decide direction if it's not given
        if (direction === undefined) {
            direction = nextIndex > self.getCurrentIndex() ? 'next' : 'prev';
        }
        if (nextSlide && nextSlide !== self.currentSlide) {
            goNext();
        }
        function goNext() {
            // Scope has been destroyed, stop here.
            if (destroyed) { return; }

            angular.extend(nextSlide, {direction: direction, active: true});
            angular.extend(self.currentSlide || {}, {direction: direction, active: false});
            if ($animate.enabled() && !$scope.noTransition && nextSlide.$element) {
                $scope.$currentTransition = true;
                nextSlide.$element.on('$animate:close', function closeFn() {
                    $scope.$currentTransition = null;
                });
            }

            self.currentSlide = nextSlide;
            currentIndex = nextIndex;

        }
    };
    $scope.$on('$destroy', function () {
        destroyed = true;
    });

    function getSlideByIndex(index) {
        if (angular.isUndefined(slides[index].index)) {
            return slides[index];
        }
        var i, len = slides.length;
        for (i = 0; i < slides.length; ++i) {
            if (slides[i].index == index) {
                return slides[i];
            }
        }
    }

    self.getCurrentIndex = function() {
        if (self.currentSlide && angular.isDefined(self.currentSlide.index)) {
            return +self.currentSlide.index;
        }
        return currentIndex;
    };

    /* Allow outside people to call indexOf on slides array */
    self.indexOfSlide = function(slide) {
        return angular.isDefined(slide.index) ? +slide.index : slides.indexOf(slide);
    };

    $scope.next = function() {
        var newIndex = (self.getCurrentIndex() + 1) % slides.length;

        //Prevent this user-triggered transition from occurring if there is already one in progress
        if (newIndex == 0) {
            return; // already reached the last slide
        }
        if (!$scope.$currentTransition) {
            return self.select(getSlideByIndex(newIndex), 'next');
        }

    };

    $scope.prev = function() {
        var newIndex = self.getCurrentIndex() - 1 < 0 ? slides.length - 1 : self.getCurrentIndex() - 1;

        if (newIndex == slides.length-1) {
            return; // already reached the last slide
        }
        //Prevent this user-triggered transition from occurring if there is already one in progress
        if (!$scope.$currentTransition) {
            return self.select(getSlideByIndex(newIndex), 'prev');
        }

    };

    $scope.isActive = function(slide) {
        return self.currentSlide === slide;
    };





    self.addSlide = function(slide, element) {
        slide.$element = element;
        slides.push(slide);
        //if this is the first slide or the slide is set to active, select it
        if(slides.length === 1 || slide.active) {
            self.select(slides[slides.length-1]);

        } else {
            slide.active = false;
        }
    };

    self.removeSlide = function(slide) {
        if (angular.isDefined(slide.index)) {
            slides.sort(function(a, b) {
                return +a.index > +b.index;
            });
        }
        //get the index of the slide inside the carousel
        var index = slides.indexOf(slide);
        slides.splice(index, 1);
        if (slides.length > 0 && slide.active) {
            if (index >= slides.length) {
                self.select(slides[index-1]);
            } else {
                self.select(slides[index]);
            }
        } else if (currentIndex > index) {
            currentIndex--;
        }
    };

}]);
formCarousel.directive('carousel', [function() {
    return {
        restrict: 'EA',
        transclude: true,
        replace: true,
        controller: 'CarouselController',
        require: 'carousel',
        templateUrl: './templates/carousel.html',
        scope: {
            interval: '=',
            noTransition: '=',
            noPause: '='
        },

        link:function(scope,element,attrs,controller){

        }
    };
}]);

formCarousel.directive('slide', function() {
    return {
        require: '^carousel',
        restrict: 'EA',
        transclude: true,
        replace: true,
        templateUrl: './templates/slide.html',
        scope: {
            active: '=?',
            index: '=?'
        },
        link: function (scope, element, attrs, carouselCtrl) {
            carouselCtrl.addSlide(scope, element);
            //when the scope is destroyed then remove the slide from the current slides array
            scope.$on('$destroy', function() {
                carouselCtrl.removeSlide(scope);
            });

            scope.$watch('active', function(active) {
                if (active) {
                    carouselCtrl.select(scope);
                }
            });
        }
    };
});

formCarousel.animation('.item', [
    '$animate',
    function ($animate) {
        return {
            beforeAddClass: function (element, className, done) {
                // Due to transclusion, noTransition property is on parent's scope
                if (className == 'active' && element.parent() &&
                    !element.parent().scope().noTransition) {
                    var stopped = false;
                    var direction = element.isolateScope().direction;
                    var directionClass = direction == 'next' ? 'left' : 'right';
                    element.addClass(direction);
                    $animate.addClass(element, directionClass).then(function () {
                        if (!stopped) {
                            element.removeClass(directionClass + ' ' + direction);
                        }
                        done();
                    });

                    return function () {
                        stopped = true;
                    };
                }
                done();
            },
            beforeRemoveClass: function (element, className, done) {
                // Due to transclusion, noTransition property is on parent's scope
                    if (className == 'active' && element.parent() &&
                    !element.parent().scope().noTransition) {
                    var stopped = false;
                    var direction = element.isolateScope().direction;
                    var directionClass = direction == 'next' ? 'left' : 'right';
                    $animate.addClass(element, directionClass).then(function () {
                        if (!stopped) {
                            element.removeClass(directionClass);
                        }
                        done();
                    });
                    return function () {
                        stopped = true;
                    };
                }
                done();
            }
        };

    }])
});


