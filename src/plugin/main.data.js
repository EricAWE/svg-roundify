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
                    transform : 'translate(' + configs.circle.pos.x + ', ' + (centerYP + (font / 4)) + ')'
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
