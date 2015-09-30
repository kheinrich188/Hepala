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
* **train**: is your threeJS Object
* **destinationPosition**: is your new position 
* **options**: {duration, delay, animationTyp, compelte}

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

#Rotation
## Preparing rotations
#### Before you can create custom rotations and specifiy a rotation center you have to to some steps:
1. Create a Pivot:
```
var pivot = new THREE.Object3D();
```
2. Positon your ThreeJS Object:
```
var meshGeo = new THREE.BoxGeometry(50, 2, 80);
var meshMat = new THREE.MeshPhongMaterial({color: 0xefefef});
var mesh = new THREE.Mesh(meshGeo, meshMat);
mesh.position.set(160, 105, 0);
mesh.rotation.z = 1.57 * 2;
```
3. Add mesh to pivot: 
```
pivot.position.set(50/2, 0, 0);
pivot.add(mesh);
scene.add(pivot);
```
4. Calculate Rotationmatrix (tricky part we moving rotation center to right border)
```
var matrix = buildRotationMatrix([24, 0, 0], "z", [0.5, 0, 0]);
mesh.updateMatrix();
mesh.geometry.applyMatrix(matrix);
mesh.matrix.identity();
```

## So how does *buildRotationMatrix* work:
```
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
```

## Now we can rotate a ThreeJS Object at a specific axis
#### Now you want to rotate an object at a specific axis
* **train**: is your threeJS Object
* **"z"**: is the axi where you want to rotate
* **70**: is amount of degree you want to rotate (it will calculate as rad) 
* **options**: {duration (ms), delay (ms), animationTyp, complete}
```
UIAnimator.rotateObjectAtAxis(
    train,
    "z",
    70,
    {
        duration: 7500,
        delay: 10,
        animationType: UIAnimator.easing.swing,
        complete: function () {
            console.log("Fertig");
        }
    }
);
```
