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
