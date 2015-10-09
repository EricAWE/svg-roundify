'use strict';

/**
 * TODO :
 *    - Créer un objet widget comprenant Roundify
 *    - Possibilité de créer une légende
 *    - Possibilité d'intégrer un chiffre middle
 *
 */
var paper = Snap('#svg');
var centerXP = document.getElementById('svg').offsetWidth / 2;
var centerYP = document.getElementById('svg').offsetHeight / 2;

var Roundify = function Roundify(data, configs) {
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
