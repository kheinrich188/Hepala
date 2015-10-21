/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function Keyboard(scene, widht, height, rows, colums){
    this.scene = scene;
    this.rows = rows;
    this.colums = colums;
    this.widht = widht;
    this.height = height;
    var keyboardY = 6;
    var keyboardGeo = new THREE.BoxGeometry(widht, keyboardY, height);
    
    var keyboardMat = new THREE.MeshBasicMaterial({
        color: 0xecf0f1
    });
    
    var keyboard = new THREE.Mesh(keyboardGeo, keyboardMat);
    keyboard.castShadow = true;
    keyboard.receiveShadow = false;
    keyboard.rotation.y = -1.57;
    
    //matrix has to fill in drawKeys
    this.matrix = [];
    
    this.mesh = keyboard;
    scene.add(this.mesh);
            
    
};

Keyboard.prototype.drawKeys = function(){
    var widthForKey = this.widht / this.colums;
    var heightForKey = this.height / this.rows;
    console.log(widthForKey);
    console.log(heightForKey);
    var margin = -220;
    var margin0 = -240;
    for (var r = 0; r < this.rows; r++){
        for (var c = 0; c < this.colums; c++){
            if (r == 0) {
                //hier haben wir die f tasten
                var name = "f"+c;
               
                var f = new FKey(name, widthForKey,heightForKey);
                f.mesh.position.set(160,120,margin);
                margin += widthForKey + 10;
                this.scene.add(f.mesh);
            }
            else if (r == 1){
                 var name = c;
               
                var f = new FKey(name, widthForKey,heightForKey);
                f.mesh.position.set(150-heightForKey,120,margin0);
                margin0 += widthForKey + 10;
                this.scene.add(f.mesh);
            }
            console.log("r: " + r + " c: " + c);
        }
    }
    
    
};

