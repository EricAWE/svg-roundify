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
            data.forEach(function(v, k) {
                _this.arcs.push(new Arc(v, _this.configs.nowPoint, _this.configs.colors[k], _this.configs, _paper, _centerXP, _centerYP));
                _this.configs.nowPoint = _this.arcs[k].getEndPoint();

                round.add(_this.arcs[k].draw);
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
                            transform   : 'translate(0 ' + (_this.configs.radius + 40) + ') scale(1, 1)',
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
