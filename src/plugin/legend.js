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
            lines
                .attr({
                    transform : 'translate(0, -' + (lines.getBBox().height / 2 - 10) + ')'
                })
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
    };

    window.Legend = Legend;

})(window);
