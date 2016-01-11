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


function buildRotationMatrix(pivotMoving, axis, endPosition) {
    var final = new THREE.Matrix4();
    var rotation = new THREE.Matrix4();
    var pivot = new THREE.Matrix4().makeTranslation(pivotMoving[0], pivotMoving[1], pivotMoving[2]);
    var end = new THREE.Matrix4().makeTranslation(endPosition[0], endPosition[1], endPosition[2]);
    if (axis == "x") {
        rotation.makeRotationX(0);
    }
    else if (axis == "y") {
        rotation.makeRotationY(0);
    }
    else {
        rotation.makeRotationZ(0);
    }
    final.multiplyMatrices(pivot, rotation);
    final.multiply(end);
    return final;
}

function getCurrentRotationValue(object, axis) {
    if (axis == "x") {
        return object.rotation.x;
    }
    else if (axis == "y") {
        return object.rotation.y;
    }
    else {
        return object.rotation.z;
    }
}

function setRotationValue(object, axis, value) {
    if (axis == "x") {
        object.rotation.x = value;
    }
    else if (axis == "y") {
        object.rotation.y = value;
    }
    else {
        object.rotation.z = value;
    }
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
            bounce: function (progress) {
                for (var x = 0, y = 1; 1; x += y, y /= 2) {
                    if (progress >= (7 - 4 * x) / 11) {
                        return -Math.pow((11 - 6 * x - 11 * progress) / 4, 2) + Math.pow(y, 2);
                    }
                }
            }
        },
        /**
         * Diese function errechnet den progress anhand der wahren Zeit, die Vergangen ist.
         * @param {Object} options 
         * 
         */
        animate: function (options) {
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
         * Animation mit automatischen Werten
         * @param {THREE Object} startValues {x:Number,y:Number,z:Number}
         * @param {Object} endValues {x:Number,y:Number,z:Number}
         * @param {Object} options duration: Numbe, delay:Number, complete:function
         */
        moveObjectToPosition: function (threeObject, endPosition, options) {
            var startposition = threeObject.position;
            
            //math.abs wegen negativ zu positiv
            var xDif = Math.abs(endPosition.x - startposition.x);
            var yDif = Math.abs(endPosition.y - startposition.y);
            var zDif = Math.abs(endPosition.z - startposition.z);
            //array, damit ich besser min,max aufrufen kann
            var diffArray = [xDif, yDif, zDif];
            
            if(startposition.x == endPosition.x && startposition.y == endPosition.y && startposition.z == endPosition.z)
            {
                console.log("Fehler, Start = Ende!");
                options.duration = 0;
                options.delay = 360;
                options.complete;
            }
            var max = diffArray.max();
            //nimm den größten wert. hier dauert die animation exakt die länge der duration
            //kann man nachvollziehen, wenn man die animation nur auf den max wert anwendet (der wert der genau 1 ist)
            // die anderen sind jetzt kleiner als 1 da sie schneller gehen als der wert der 1 ist
            var percentX = xDif / max;
            var percentY = yDif / max;
            var percentZ = zDif / max;

            this.animate({
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
        rotateObjectAtAxis: function (threeObject, axis, degree, options) {
            var currentAxisValue = getCurrentRotationValue(threeObject, axis);
            var rad = radianFromDegree(degree);
            this.animate({
                duration: options.duration,
                delay: options.delay,
                delta: function (progress) {
                    progress = this.progress;
                    if (progress >= options.duration) {
                        return rad;
                    }
                    //percent ist der wert der die animation dauert (nach der hälfte 0.5 bei fertig = 1)
                    var percent = progress / options.duration;
                    var updateValue = options.animationType(percent);
                    var value = currentAxisValue + (updateValue * (rad - currentAxisValue));
                    return value;
                },
                complete: options.complete,
                step: function (delta) {
                    setRotationValue(threeObject, axis, delta);
                }
            });
        }
    };
    window.UIAnimator = UIAnimator;

})
();