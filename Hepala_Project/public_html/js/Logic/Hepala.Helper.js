/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



var pi = Math.PI;

function degreeFromRadian(radian) {
    return (radian * 180) / pi;
}

function radianFromDegree(degrees){
    return (degrees * pi) / 180;
}

//this will be the general animating mechanismus

(function(){
    var UIAnimator = {
       /**
         * functions easing
         * Die logik davon habe ich mir abgeschaut. Da können wir auch unsere eigenen schreiben.
         */
        easing: {
            linear: function(progress) {
                return progress;
            },
            quadratic: function(progress) {
                return Math.pow(progress, 2);
            },
            swing: function(progress) {
                return 0.5 - Math.cos(progress * pi) / 2;
            },
            circ: function(progress) {
                return 1 - Math.sin(Math.acos(progress));
            },
            back: function(progress, x) {
                return Math.pow(progress, 2) * ((x + 1) * progress - x);
            },
            bounce: function(progress) {
                for (var x = 0, y = 1; 1; x += y, y /= 2) {
                    if (progress >= (7 - 4 * x) / 11) {
                        return -Math.pow((11 - 6 * x - 11 * progress) / 4, 2) + Math.pow(y, 2);
                    }
                }
            },
            elastic: function(progress, x) {
                return Math.pow(2, 10 * (progress - 1)) * Math.cos(20 * pi * x / 3 * progress);
            }
        },
        /**
         * function animate
         * Diese function errechnet den progress prozentual anhand der vergangenen Zeit.
         * @param {Object} options 
         * 
         */
        animate: function(options){
            var start = new Date;
            var id = setInterval(function() {
                var timePassed = new Date - start;
                var progress = timePassed / options.duration;
                if (progress > 1) {
                    progress = 1;
                }
                options.progress = progress;
                var delta = options.delta(progress);
                options.step(delta);
                if (progress == 1) {
                    clearInterval(id);
                    options.complete();
                }
            }, options.delay || 10);
        },
        /**
         * Diese function errechnet den progress anhand der wahren Zeit, die Vergangen ist.
         * @param {Object} options 
         * 
         */
        positionAnimation: function(options){
            var lastUpdate = new Date;
            var progress = 0;
            var id = setInterval(function() {
                var now = new Date;
                progress += now - lastUpdate;
                lastUpdate = new Date;
                if (progress >= options.duration){
                    clearInterval(id);
                    progress = options.duration;
                    options.complete();
                }
                options.progress = progress;
                var delta = options.delta(progress);
                options.step(delta);
                
            }, options.delay || 10);
        },
        
        /**
         * Animation mit Berechnung
         * @param {THREE} object 
         * @param {Options} options
         * @param {Number} toValue Default will be camera.postion.z
         */
        moveObjectWithCalculation: function(object ,options){
            var toValue = 0;
            this.animate({
                duration: options.duration,
                delay: options.delay,
                delta: function(progress){
                    progress = this.progress;
                    return UIAnimator.easing.linear(progress);
                },
                complete: options.complete,
                step: function (delta){
                    //TODO: Rummspielen
                }
            });
        },
        /**
         * Animation mit automatischen Werten
         * @param {THREE Object} startValues {x:Number,y:Number,z:Number}
         * @param {Object} endValues {x:Number,y:Number,z:Number}
         * @param {Object} options duration: Numbe, delay:Number, complete:function
         */
        moveObjectToPosition: function(threeObject, endPosition, options){
            this.positionAnimation({
                duration: options.duration,
                delay: options.delay,
                delta: function(progress){
                    progress = this.progress;
                    if (progress >= options.duration){
                        console.log("Ready");
                        return {
                            position:{
                                x: endPosition.x,
                                y: endPosition.y,
                                z: endPosition.z
                            }
                        };
                    }
                    var percent = progress / options.duration;
                    var updateValue = options.animationType(percent);
                    var complexResult = {
                        position:{
                            x: threeObject.position.x + (updateValue * (endPosition.x-threeObject.position.x)),
                            y: threeObject.position.y + (updateValue * (endPosition.y-threeObject.position.y)),
                            z: threeObject.position.z + (updateValue * (endPosition.z-threeObject.position.z))
                        }
                     };
                    return complexResult;
                },
                complete: options.complete,
                step: function (delta){
                    //set object new values
                    threeObject.position.x = delta.position.x;
                    threeObject.position.y = delta.position.y;
                    threeObject.position.z = delta.position.z;
                    console.log(delta.position.x);
                    console.log(delta.position.y);
                    console.log(delta.position.z);
                }
            });
        }
    };
    window.UIAnimator = UIAnimator;
    
})();
