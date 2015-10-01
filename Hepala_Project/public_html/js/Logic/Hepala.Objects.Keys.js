/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// Define a class like this
function FKey(text, widht, height) {
    var y = 0.5;
    var keyGeo = new THREE.BoxGeometry(widht, y, height);
    var dynamicTexture = new THREEx.DynamicTexture(widht, height);
    dynamicTexture.drawText(text, widht / 2, height / 2, 'white');

    var keyMat = new THREE.MeshBasicMaterial({
        color: 0x2D2A36,
        map: dynamicTexture.texture
    });

    var key = new THREE.Mesh(keyGeo, keyMat);
    key.castShadow = true;
    key.receiveShadow = false;
    key.rotation.y = -1.57;
    this.mesh = key;
    
};

FKey.prototype.pressKey = function () {
    //todo store original position
    var object = this.mesh;
    UIAnimator.moveObjectToPosition(object,
            {
                x: object.position.x,
                y: object.position.y - 5,
                z: object.position.z
            },
    {
        duration: 500,
        delay: 30,
        animationType: UIAnimator.easing.circ,
        complete: function () {
            UIAnimator.moveObjectToPosition(object,
                    {
                        x: object.position.x,
                        y: object.position.y + 5,
                        z: object.position.z
                    },
            {
                duration: 500,
                delay: 30,
                animationType: UIAnimator.easing.circ,
                complete: function () {
                        
                }
            });
        }
    });
};

FKey.prototype.turnBackLightOn = function () {
    console.log("BL on");
};
FKey.prototype.turnBackLightOff = function () {
    console.log("BL off");
};
