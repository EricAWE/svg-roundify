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

'use strict';
/**
 * Crée un arc snap.svg représentant
 * un pourcentage de donné
 *
 * @param {Number} total
 * @param {Number} from
 * @param {String} color
 * @param {Object} configs
 */

(function(window) {
    var Arc = function Arc(data, from, _color, configs, _paper, _centerXP, _centerYP) {

        var _this     = this;
        var paper      = _paper;
        var centerXP   = _centerXP;
        var centerYP   = _centerYP;
        this.endPoint = 0;

        /**
         * Initie un arc :
         *    - Calcul de l'arc
         *    - Initialisation snap de l'arc
         *
         */
        this.init = function() {
            // Initialisation lier à l'animation de la path
            var color        = data.color || _color;
            var total        = data.percent;
            var percent      = (total / 100) * 360;
            var radplus      = 5;
            _this.from       = describeArc(configs.pos.x, configs.pos.y, configs.radius, from + radplus, from + radplus);
            _this.path       = describeArc(configs.pos.x, configs.pos.y, configs.radius, from + radplus, from + percent - radplus);
            _this.loopLength = Snap.path.getTotalLength(_this.path);

            // Gestion de l'arc
            _this.endPoint  = from + percent;
            _this.draw = paper.path({
                stroke        : color,
                fillOpacity   : 0,
                strokeWidth   : 0,
                strokeLinecap : 'round'
            });
        };

        this.getEndPoint = function() {
            return _this.endPoint;
        };

        /**
         * @private
         * Transform des coordonées degrés en radian pour
         * la path SVG
         *
         * @param  {Number} centerX
         * @param  {Number} centerY
         * @param  {Number} radius
         * @param  {Number} angleInDegrees
         * @return {Object} cartesianCoordinates
         */
        function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
            var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

            return {
                x : centerX + (radius * Math.cos(angleInRadians)),
                y : centerY + (radius * Math.sin(angleInRadians))
            };
        }

        /**
         * @private
         * Créer une path (d) pour un arc donné
         *
         * @param  {Number} x
         * @param  {Number} y
         * @param  {Number} radius
         * @param  {Number} startAngle
         * @param  {Number} endAngle
         * @return {String} d
         */
        function describeArc(x, y, radius, startAngle, endAngle) {

            var start = polarToCartesian(x, y, radius, endAngle);
            var end = polarToCartesian(x, y, radius, startAngle);

            var arcSweep = endAngle - startAngle <= 180 ? '0' : '1';

            var d = [
                'M', start.x, start.y,
                'A', radius, radius, 0, arcSweep, 0, end.x, end.y
            ].join(' ');

            return d;
        }

        this.init();
    };

    window.Arc = Arc;

})(window);

'use strict';

/**
 * Crée la légende pour le cercle
 *
 */

(function(window) {
    var Legend = function Legend(_paper) {

        var _this = this;
        var paper      = _paper;

        this.init = function init(data, configs) {
            this.configs = configs;
            this.data    = data;

            var lines = this.constructLegend(data, _this.configs.colors);

            if (configs.pos.name === 'right') {
                lines.attr({
                    transform : 'translate(0, -' + ((lines.getBBox().height / 2) - 10) + ')'
                });
            }
            else {
                lines.attr({
                    transform : 'translate(-' + (lines.getBBox().width / 2) + ', 0)'
                });
            }

            lines
                .animate({
                    opacity : 1
                }, 600);

            return lines;
        };

        this.constructLegend = function constructLegend(data, colors) {
            var lines = paper.g()
                .attr({
                    opacity : 0
                });
            var posx  = _this.configs.pos.x;
            var posy  = _this.configs.pos.y;
            var minWidth = _this.getLegendMinWidth(data, _this.configs);

            data.forEach(function(serie, k) {
                var color = serie.color || colors[k];
                var pict  = paper
                    .circle(posx, posy - 5, 5)
                    .attr({
                        fill : color
                    });

                var text = paper
                    .text(posx + 20, posy, serie.name)
                    .attr({
                        fontFamily : _this.configs.font.fontFamily,
                        fontSize   : _this.configs.font.fontSize,
                        fill       : _this.configs.font.fill
                    });

                var result = paper
                    .text(posx + minWidth, posy, serie.value.toString())
                    .attr({
                        fontFamily : _this.configs.font.fontFamily,
                        fontSize   : _this.configs.font.fontSize,
                        fill       : _this.configs.font.fill,
                        fontWeight : '700',
                        textAnchor : 'end'
                    });

                lines.add(paper.g(pict, text, result));
                posy += parseInt(_this.configs.font.fontSize, 10) * 2;
            });

            return lines;
        };

        /**
         * Calcul le minimum de marge necessaire pour la legend
         *
         * @param  {Object} data
         * @return {Number} minWidth
         */
        this.getLegendMinWidth = function getLegendMinWidth(data, configs) {
            var width    = 0;
            var minWidth = 0;

            data.forEach(function(value) {
                width = value.name.length * configs.font.fontSize.split('px')[0] + 90;

                if (width > minWidth) {
                    minWidth = width;
                }
            });

            return minWidth;
        };

        /**
         * Calcul le minimum de marge necessaire pour la legend
         *
         * @param  {Object} data
         * @return {Number} minWidth
         */
        this.getLegendMinHeight = function getLegendMinHeight(data, configs) {
            var height = 0;

            data.forEach(function() {
                height += parseInt(configs.font.fontSize.split('px')[0]) + 10;
            });

            return height + 60;
        };
    };

    window.Legend = Legend;

})(window);

'use strict';


(function(window) {

    /**
     * Remplit main data au centre
     *
     */
    var MainData = function MainData(paper, centerXP, centerYP) {

        this.init = function initMainData(configs) {
            var number = paper.g();
            var font   = configs.circle.radius / 2;

            number
                .attr({
                    transform : 'translate(' + configs.circle.pos.x + ', ' + (configs.circle.pos.y + configs.circle.radius + (font/4)) + ')'
                });

            var text = paper
                .text(0, 0, [configs.mainData.value, configs.mainData.unit])
                .attr({
                    fontFamily : configs.legend.font.fontFamily,
                    fontSize   : '14px',
                    fill       : configs.legend.font.fill,
                    textAnchor : 'middle'
                });

            text.select('tspan').attr({
                fontSize : font + 'px'
            });

            number.add(text);

            return number;
        };

    };

    window.MainData = MainData;

})(window);

/**
 * Créer un cercle en fonction de la data passé
 *
 * TODO :
 *    - Rendre responsive le widget
 *        - L'adapter en pourcentage
 *        - Le forcer à prendre la taille de son conteneur
 *
 * @param {Object} _data
 *    - value : valeur de la série
 *    - name  : le nom de chaque séries
 *    - color : la couleur de la série (Opt)
 * @param {Object} configs
 */


(function(w) {
    'use strict';

    var RoundifyCircle = function RoundifyCircle(_paper, _centerXP, _centerYP) {

        var _this      = this;
        var animePoint = 0;
        var paper      = _paper;
        this.arcs      = [];
        this.configs   = {};

        /**
         * Initie Roundify :
         *   2 - Calcul la data en pourcentage
         *   3 - Lance la création des arcs pour chaques data
         *   4 - Anime chacuns des arcs
         *
         */
        this.init = function(_data, configs) {

            this.configs = configs;
            var round    = paper.g();
            // 2. Calcul la data en pourcentage
            var data = this.convertToPercent(_data);

            // 3. Construit les arcs composant le cercle
            var i = 0;
            data.forEach(function(v, k) {
                if (v.percent > 2) {
                    _this.arcs.push(new Arc(v, _this.configs.nowPoint, _this.configs.colors[k], _this.configs, _paper, _centerXP, _centerYP));
                    _this.configs.nowPoint = _this.arcs[i].getEndPoint();

                    round.add(_this.arcs[i].draw);
                    i++;
                }
            });

            // 4. Met un setTimeout et lance l'animation
            animePoint = _this.arcs.length - 1;
            setTimeout(function() {
                _this.animate();
            }, 200);

            return round;
        };

        /**
         * Permet de convertir la data
         * en pourcentage
         *
         * @param  {Object} data
         * @return {Object} data
         */
        this.convertToPercent = function convertToPercent(data) {
            var total = _.sum(data, function(value) {
                return value.value;
            });

            data.forEach(function(value, key) {
                data[key].percent = (value.value * 100) / total;
            });

            return data;
        };

        /**
         * Permet d'animer les arcs les uns après les autres
         *
         * @param {Array} arcs
         */
        this.animate = function animate() {
            switch (_this.configs.animation.type) {
                case 'smooth' :
                    animateSmooth();
                    break;
                case 'parallel' :
                    animateParallel();
                    break;
                case 'none' :
                    animateFalse();
                    break;
                default :
                    animateFalse();
            }
        };

        /**
         * @private
         * Lance une animation smooth
         * Qui animera les arcs les uns après les autres
         *
         */
        function animateSmooth() {
            var arcs = _this.arcs;

            Snap.animate(0, arcs[animePoint].loopLength,
                function(step) {
                    arcs[animePoint].draw.attr({
                        path        : Snap.path.getSubpath(arcs[animePoint].path, 0, step),
                        transform   : 'translate(0 ' + (_this.configs.radius + 40) + ') scale(1, 1)',
                        strokeWidth : _this.configs.stroke
                    });
                },
                400,
                mina.easeInOut,
                function() {
                    // Si il reste des arcs à animer on relance l'animation
                    if (animePoint > 0) {
                        animePoint--;
                        _this.animate();
                    }
                }
            );
        }

        /**
         * @private
         * Lance une animation parallel
         * Qui animera les arcs en même temsps
         *
         */
        function animateParallel() {
            var arcs = _this.arcs;
            arcs.forEach(function(arc) {
                Snap.animate(0, arc.loopLength,
                    function(step) {
                        arc.draw.attr({
                            path        : Snap.path.getSubpath(arc.path, 0, step),
                            transform   : 'translate(0 ' + (_this.configs.radius) + ') scale(1, 1)',
                            strokeWidth : _this.configs.stroke
                        });
                    },
                    400,
                    mina.easeInOut
                );
            });
        }

        /**
         * @private
         * Aucunne animation lancés
         * Le cercle est simplement déssiné
         */
        function animateFalse() {
            var arcs = _this.arcs;
            arcs.forEach(function(arc) {
                arc.draw.attr({
                    path        : Snap.path.getSubpath(arc.path, 0, arc.loopLength),
                    transform   : 'translate(0 ' + (_this.configs.radius + 40) + ') scale(1, 1)',
                    strokeWidth : _this.configs.stroke
                });
            });
        }
    };

    w.RoundifyCircle = RoundifyCircle;
})(window);

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
