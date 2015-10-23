(function() {

    'use strict';

    angular
        .module('svgRoundify', [])
        .directive('svgRoundify', svgRoundifyDirective);

    svgRoundifyDirective.$inject = ['$filter', '$document'];

    function svgRoundifyDirective() {
        var directive = {
            link     : svgRoundifyLink,
            restrict : 'E',
            scope    : {
                config : '=',
                svgId  : '=svgId'
            }
        };

        return directive;

        function svgRoundifyLink(scope, element) {
            var $round = element.append('<svg class="svg-round"></svg>').children();
            $round.roundify(scope.config.data, scope.config.options);
        }
    }

})();
