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
        var paper      = Snap(element[0]);

        var W          = configs.width  || element.prop('offsetWidth');
        var H          = configs.height || element.prop('offsetHeight');
        var centerXP   = W / 2;
        var centerYP   = H / 2;
        var _this      = this;
        this.configs   = {};
        this.round     = new RoundifyCircle(paper, centerXP, centerYP);
        this.legend    = new Legend(paper, centerXP, centerYP);
        this.mainData  = new MainData(paper, centerXP, centerYP);
        this.default   = {
            padding : 20,
            circle  : {
                pos       : 'center',
                nowPoint  : 0,
                stroke    : 8,
                colors    : ['#3498db', '#1abc9c', '#9b59b6'],
                animation : {
                    type : 'parallel' // match : /parallel|smooth|false/
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
            mainData : {
                value : '32%'
            }
        };

        /**
         * Initiation du chart roundify
         */
        this.init = function() {
            this.configs = configs ? this.extend(this.default, configs) : this.default;

            this.configs.circle.radius = guessCircleRadius();
            this.configs.legend.radius = this.configs.circle.radius;

            centerXP = (_this.configs.width || W) / 2;
            centerYP = (_this.configs.height || H) / 2;

            var positions = guessCirclePos(_this.configs.legend.pos || false);
            var chart = paper.g();

            this.configs.circle.pos = positions.circle;
            this.configs.legend.pos = positions.legend;
            var round  = this.round.init(data, _this.configs.circle);
            var legend = this.legend.init(data, _this.configs.legend);

            chart.append(round);
            chart.append(legend);
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

            // Si la width est supérieur à la height,
            // le radius est celui de la height
            if (W >= H) {
                radius = (H / 2) - (_this.configs.padding * 2);
            }
            else {
                radius = (W / 2) - (_this.configs.padding * 2);
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
                        circle : {x : _this.configs.padding + _this.configs.legend.radius, y : 0},
                        legend : {x : _this.configs.legend.radius * 2 + 50, y : centerYP}
                    };
                    break;
                case 'bottom':
                    position = {
                        circle : {x : centerXP, y : _this.configs.padding + _this.configs.legend.radius},
                        legend : {x : centerXP, y : _this.configs.padding + _this.configs.legend.radius * 2}
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
        this.round = new Roundify(this, data, configs);

        return this;
    };

})();
