# Hepala
###### Dokumentation soll hier zusammen getragen werden: Hilfe für Markdown gibt es [hier](https://help.github.com/articles/markdown-basics/)


# Hepala.Helper.js
- var window
- var pi
* function degreeFromRadian(radian)
* function radianFromDegree(degrees)
* function buildRotationMatrix(pivotMoving, axis, endPosition) 
* function()
  -var UIAnimator
    - var easing
      - var linear: function (progress)
      - var quadratic: function (progress)
      - var swing: function (progress)
      - var circ: function (progress)
      - var bounce: function (progress)
    - var animate: function(options)
    - var moveObjectToPosition: function (threeObject, endPosition, options)
    - var rotateObjectAtAxis: function (threeObject, axis, degree, options)


## Transform and ThreeJS Object to a specific position
#### e.g you want to simulate the accularation of a train (nearly quadratic)

```
var destinationPosition = {x: 100,y: 0,z: 0};
UIAnimator.moveObjectToPosition(
    train,
    destinationPosition, 
    {
        duration: 7500, 
        delay: 30,
        animationType: UIAnimator.easing.quadratic,
        complete: function () {
          console.log("Ready");
        }
    }
);
```
## Rotate a ThreeJS Object at a specific axis

