(function() {

    'use strict';

    /**
     * TODO :
     *    - Créer un objet widget comprenant Roundify
     *    - Possibilité de créer une légende
     *    - Possibilité d'intégrer un chiffre middle
     *
     */
    var Roundify = function Roundify(element, data, configs) {
        var paper;
        var W;
        var H;
        var centerXP;
        var centerYP;
        var _this      = this;
        this.chart   = null;
        this.configs = {};
        this.round = null;
        this.legend = null;
        this.mainData = null;
        this.chart = null;
        this.default  = null;

        this.initVariables = function() {
            paper    = Snap(element[0]);
            W        = configs.width  || element.prop('offsetWidth');
            H        = configs.height || element.prop('offsetHeight');
            centerXP = W / 2;
            centerYP = H / 2;

            this.round    = new RoundifyCircle(paper, centerXP, centerYP);
            this.legend   = new Legend(paper, centerXP, centerYP);
            this.mainData = new MainData(paper, centerXP, centerYP);
            this.default = {
               padding : 20,
               circle  : {
                   pos       : 'center',
                   nowPoint  : 0,
                   stroke    : 8,
                   colors    : ['#3498db', '#1abc9c', '#9b59b6'],
                   animation : {
                       type : 'parallel' // match : /parallel|smooth|none/
                   }
               },
               legend : {
                   pos    : 'right',
                   colors : ['#3498db', '#1abc9c', '#9b59b6'],
                   font   : {
                       fontFamily : '"Helvetica Neue", Helvetica, Arial, sans-serif',
                       fontSize   : '14px',
                       fill       : '#575757'
                   }
               },
               mainData : {}
           };
        };

        /**
         * Initiation du chart roundify
         */
        this.init = function() {
            this.first = this.first ? false : true;
            this.initVariables();
            this.configs = configs ? this.extend(this.default, configs) : this.default;

            if (W < 400) {
                this.configs.legend.pos = 'bottom';
            }

            this.configs.circle.radius = guessCircleRadius();
            this.configs.legend.radius = this.configs.circle.radius;

            centerXP = (_this.configs.width || W) / 2;
            centerYP = (_this.configs.height || H) / 2;

            var positions = guessCirclePos(_this.configs.legend.pos || false);
            this.chart = paper.g();

            this.configs.circle.pos = positions.circle;
            this.configs.legend.pos = positions.legend;
            var round  = this.round.init(data, _this.configs.circle);
            var legend = this.legend.init(data, _this.configs.legend);

            if (this.configs.mainData && this.configs.mainData.value) {
                var mainData = this.mainData.init(_this.configs);
                this.chart.append(mainData);
            }

            this.chart.append(round);
            this.chart.append(legend);
        };

        /**
         * Permet de merge les configurations
         * de default et celle apporté par l'utilisateur
         *
         * @param  {Object} defaultConfigs
         * @param  {Object} extendConfigs
         * @return {Object} configs
         */
        this.extend = function extend(_out) {
            var out = _out || {};

            for (var i = 1; i < arguments.length; i++) {
                var obj = arguments[i];

                if (!obj) {
                    continue;
                }

                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (typeof obj[key] === 'object') {
                            _this.extend(out[key], obj[key]);
                        }
                        else {
                            out[key] = obj[key];
                        }
                    }
                }
            }

            return out;
        };

        /**
         * @private
         * Set le radius du cercle en fonction
         * de la width
         */
        function guessCircleRadius() {
            var radius = 0;

            if (_this.configs.legend.pos === 'right') {
                var legendWidth = _this.legend.getLegendMinWidth(data, _this.configs.legend);

                // Si la width est supérieur à la height,
                // le radius est celui de la height
                if (W >= H) {
                    radius = (H / 2) - (_this.configs.padding * 2);
                }
                else {
                    radius = (W / 2) - (_this.configs.padding * 2);
                }

                if (W - legendWidth < radius * 2) {
                    radius = ((W - legendWidth) / 2) - (_this.configs.padding * 2);
                }
            }
            else {
                var legendHeight = _this.legend.getLegendMinHeight(data, _this.configs.legend);

                radius = (H - legendHeight - 40) / 2;

                if ((radius * 2) > (W - 40)) {
                    radius = (W - 40) / 2;
                }
            }

            return radius;
        }

        /**
         * @private
         * Set la position du cercle en fonction
         * de la position de la légend
         *
         * @param  {String} legendPos
         * @return {String} position
         */
        function guessCirclePos(legendPos) {
            var position;

            switch (legendPos) {
                case 'right':
                    position = {
                        circle : {x : _this.configs.padding + _this.configs.legend.radius, y : ((H - (_this.configs.circle.radius * 2)) / 2 ), name : 'right'},
                        legend : {x : _this.configs.legend.radius * 2 + 50, y : centerYP, name : 'right'}
                    };
                    break;
                case 'bottom':
                    position = {
                        circle : {x : centerXP, y : _this.configs.padding, name : 'bottom'},
                        legend : {x : centerXP, y : _this.configs.padding + (_this.configs.circle.radius * 2) + 60, name : 'bottom' }
                    };
                    break;
                default:
                    position = {x : centerXP, y : centerYP};
                    break;
            }

            return position;
        }


        this.init();
    };


    var $ = angular.element;

    $.prototype.roundify = function(data, configs) {
        var _this = this;
        this.round = new Roundify(this, data, configs);

        $(window).on('resize', function() {
            _this.round.chart.remove();
            _this.round.init();
        });

        return this;
    };

})();
