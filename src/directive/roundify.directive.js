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
                config : '='
            }
        };

        return directive;

        function svgRoundifyLink(scope, element) {
            var id     = element.attr('id');
            var $round = element.append('<svg class="' + id + '"></svg>').children();

            $round.roundify(scope.config.data, scope.config.options);
        }
    }

})();
