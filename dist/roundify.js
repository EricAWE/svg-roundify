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
    var Legend = function Legend(_paper, _centerXP, _centerYP) {

        var _this = this;
        var paper      = _paper;
        var centerXP   = _centerXP;
        var centerYP   = _centerYP;

        this.init = function init(data, configs) {
            this.configs = configs;
            this.data    = data;

            var lines = this.constructLegend(data, _this.configs.colors);

            lines
                .attr({
                    transform : 'translate(0, -' + lines.getBBox().height / 2 + ')'
                })
                .animate({
                    opacity : 1
                }, 600);
        };

        this.constructLegend = function constructLegend(data, colors) {
            var lines = paper.g()
                .attr({
                    opacity : 0
                });
            var posx  = _this.configs.pos.x;
            var posy  = _this.configs.pos.y;

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
                    .text(posx + 200, posy, serie.value)
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

    };

    window.MainData = MainData;

})(window);

'use strict';

/**
 * Créer un cercle en fonction de la data passé
 *
 * @param {Object} _data
 *    - value : valeur de la série
 *    - name  : le nom de chaque séries
 *    - color : la couleur de la série (Opt)
 * @param {Object} configs
 */


(function(w) {
    var RoundifyCircle = function RoundifyCircle(_paper, _centerXP, _centerYP) {

        var _this      = this;
        var animePoint = 0;
        var paper      = _paper;
        var centerXP   = _centerXP;
        var centerYP   = _centerYP;
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
            // 2. Calcul la data en pourcentage
            var data = this.convertToPercent(_data);

            // 3. Construit les arcs composant le cercle
            data.forEach(function(v, k) {
                _this.arcs.push(new Arc(v, _this.configs.nowPoint, _this.configs.colors[k], _this.configs, _paper, _centerXP, _centerYP));
                _this.configs.nowPoint = _this.arcs[k].getEndPoint();
            });

            // 4. Met un setTimeout et lance l'animation
            animePoint = _this.arcs.length - 1;
            setTimeout(function() {
                _this.animate();
            }, 200);
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
                        transform   : 'translate(' + _this.configs.pos.x * 2 + '), scale(-1, 1)',
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
                            transform   : 'translate(' + _this.configs.pos.x * 2 + '), scale(-1, 1)',
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
                    transform   : 'translate(' + _this.configs.pos.x * 2 + '), scale(-1, 1)',
                    strokeWidth : _this.configs.stroke
                });
            });
        }
    };

    w.RoundifyCircle = RoundifyCircle;
})(window);

'use strict';

/**
 * TODO :
 *    - Créer un objet widget comprenant Roundify
 *    - Possibilité de créer une légende
 *    - Possibilité d'intégrer un chiffre middle
 *
 */

var Roundify = function Roundify(id, data, configs) {
    var paper    = Snap('#' + id);
    var centerXP = document.getElementById(id).offsetWidth / 2;
    var centerYP = document.getElementById(id).offsetHeight / 2;
    var _this      = this;
    this.configs   = {};
    this.round     = new RoundifyCircle(paper, centerXP, centerYP);
    this.legend    = new Legend(paper, centerXP, centerYP);
    this.mainData  = new MainData(paper, centerXP, centerYP);
    this.default   = {
        circle : {
            pos       : 'center',
            radius    : 100,
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

    this.init = function() {
        this.configs = configs ? this.extend(this.default, configs) : this.default;
        this.configs.legend.radius = this.configs.circle.radius;

        var positions = guessCirclePos(_this.configs.legend.pos || false);
        this.configs.circle.pos = positions.circle;
        this.configs.legend.pos = positions.legend;
        this.round.init(data, _this.configs.circle);
        this.legend.init(data, _this.configs.legend);
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
                    circle : {x : 10 + _this.configs.legend.radius, y : centerYP},
                    legend : {x : _this.configs.legend.radius * 2 + 50, y : centerYP}
                };
                break;
            case 'bottom':
                position = {x : centerXP, y : 10 + _this.configs.legend.radius};
                break;
            default:
                position = {x : centerXP, y : centerYP};
                break;
        }

        return position;
    }


    this.init();
};

var roundify = function(id, data, configs) {
    return new Roundify(id, data, configs);
};
