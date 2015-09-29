/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



var pi = Math.PI;

function degreeFromRadian(radian) {
    return (radian * 180) / pi;
}

function radianFromDegree(degrees) {
    return (degrees * pi) / 180;
}

//this will be the general animating mechanismus

(function () {
    var UIAnimator = {
        /**
         * functions easing
         * Die logik davon habe ich mir abgeschaut. Da können wir auch unsere eigenen schreiben.
         */
        easing: {
            linear: function (progress) {
                return progress;
            },
            quadratic: function (progress) {
                return Math.pow(progress, 2);
            },
            swing: function (progress) {
                return 0.5 - Math.cos(progress * pi) / 2;
            },
            circ: function (progress) {
                return 1 - Math.sin(Math.acos(progress));
            },
            back: function (progress, x) {
                return Math.pow(progress, 2) * ((x + 1) * progress - x);
            },
            bounce: function (progress) {
                for (var x = 0, y = 1; 1; x += y, y /= 2) {
                    if (progress >= (7 - 4 * x) / 11) {
                        return -Math.pow((11 - 6 * x - 11 * progress) / 4, 2) + Math.pow(y, 2);
                    }
                }
            },
            elastic: function (progress, x) {
                return Math.pow(2, 10 * (progress - 1)) * Math.cos(20 * pi * x / 3 * progress);
            }
        },
        /**
         * function animate
         * Diese function errechnet den progress prozentual anhand der vergangenen Zeit.
         * @param {Object} options 
         * 
         */
        animate: function (options) {
            var start = new Date;
            var id = setInterval(function () {
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
        positionAnimation: function (options) {
            var lastUpdate = new Date;
            var progress = 0;
            var id = setInterval(function () {
                var now = new Date;
                progress += now - lastUpdate;
                lastUpdate = new Date;
                if (progress >= options.duration) {
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
        moveObjectWithCalculation: function (object, options) {
            var toValue = 0;
            this.animate({
                duration: options.duration,
                delay: options.delay,
                delta: function (progress) {
                    progress = this.progress;
                    return UIAnimator.easing.linear(progress);
                },
                complete: options.complete,
                step: function (delta) {
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
        moveObjectToPosition: function (threeObject, endPosition, options) {
            //Bug doesnt react if same. possible invalid type
            if (threeObject.position == endPosition) {
                console.log("Values same");
                options.complete();
                return;
            }
            this.positionAnimation({
                duration: options.duration,
                delay: options.delay,
                delta: function (progress) {
                    progress = this.progress;
                    if (progress >= options.duration) {
                        return {
                            position: {
                                x: endPosition.x,
                                y: endPosition.y,
                                z: endPosition.z
                            }
                        };
                    }
                    var percent = progress / options.duration;
                    var updateValue = options.animationType(percent);
                    var complexResult = {
                        position: {
                            x: threeObject.position.x + (updateValue * (endPosition.x - threeObject.position.x)),
                            y: threeObject.position.y + (updateValue * (endPosition.y - threeObject.position.y)),
                            z: threeObject.position.z + (updateValue * (endPosition.z - threeObject.position.z))
                        }
                    };
                    return complexResult;
                },
                complete: options.complete,
                step: function (delta) {
                    threeObject.position.set(delta.position.x, delta.position.y, delta.position.z);
                    console.log(delta.position.x);
                    console.log(delta.position.y);
                    console.log(delta.position.z);
                }
            });
        },
        moveObjectToPosition2: function (threeObject, endPosition, options) {
            var startposition = threeObject.position;

            //math.abs wegen negativ zu positiv
            var xDif = Math.abs(endPosition.x - startposition.x);
            var yDif = Math.abs(endPosition.y - startposition.y);
            var zDif = Math.abs(endPosition.z - startposition.z);
            //array, damit ich besser min,max aufrufen kann
            var diffArray = [xDif, yDif, zDif];
            var max = diffArray.max();
            //nimm den größten wert. hier dauert die animation exakt die länge der duration
            //kann man nachvollziehen, wenn man die animation nur auf den max wert anwendet (der wert der genau 1 ist)
            // die anderen sind jetzt kleiner als 1 da sie schneller gehen als der wert der 1 ist
            var percentX = xDif / max;
            var percentY = yDif / max;
            var percentZ = zDif / max;

            this.positionAnimation({
                duration: options.duration,
                delay: options.delay,
                delta: function (progress) {
                    progress = this.progress;
                    if (progress >= options.duration) {
                        return {
                            position: {
                                x: endPosition.x,
                                y: endPosition.y,
                                z: endPosition.z
                            }
                        };
                    }
                    //percent ist der wert der die animation dauert (nach der hälfte 0.5 bei fertig = 1)
                    var percent = progress / options.duration;
                    //setzte werte in Relation
                    var percentx = percent * percentX;
                    var percenty = percent * percentY;
                    var percentz = percent * percentZ;
                    var updateValueX = options.animationType(percentx);
                    var updateValueY = options.animationType(percenty);
                    var updateValueZ = options.animationType(percentz);

                    var complexResult = {
                        position: {
                            x: startposition.x + (updateValueX * (endPosition.x - startposition.x)),
                            y: startposition.y + (updateValueY * (endPosition.y - startposition.y)),
                            z: startposition.z + (updateValueZ * (endPosition.z - startposition.z))
                        }
                    };
                    return complexResult;
                },
                complete: options.complete,
                step: function (delta) {
                    //set object new values 
                    // eulerOrder goes here -> first x then y then z
                    //unlikly not expected behavior
                    threeObject.position.set(delta.position.x, delta.position.y, delta.position.z);
                }
            });
        },
        rotateObjectAtAxis: function (object, axis, degree, options) {
            degree = 120;
            object.geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, -25,0 ) );
            object.geometry.verticesNeedUpdate = true;
            return;
            this.positionAnimation({
                duration: options.duration,
                delay: options.delay,
                delta: function (progress) {
                    progress = this.progress;
                    if (progress >= options.duration) {
                        return degree;
                    }
                    //percent ist der wert der die animation dauert (nach der hälfte 0.5 bei fertig = 1)
                    var percent = progress / options.duration;
                    var updateValue = options.animationType(percent);
                    return 0 + (updateValue * (degree - 0));

                },
                complete: options.complete,
                step: function (delta) {
                    object.setRotationFromAxisAngle(new THREE.Vector3(0, 0, -1), radianFromDegree(delta));
                }
            });
        }
    };
    window.UIAnimator = UIAnimator;

})();