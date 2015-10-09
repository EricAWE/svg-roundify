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
            console.log(configs);

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
                var pict = paper
                    .circle(posx, posy - 5, 5)
                    .attr({
                        fill : colors[k]
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
