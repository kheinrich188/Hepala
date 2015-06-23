// Core.js
// Created by Konstantin Heinrich am 23.06.2015
//

/*
 History:
 
 */


function Point(x,y){
    var self = this;
    self.x = x
    self.y = y;
    return self
};

function Rect(x,y,widht,height) {
    var self = this;
    self.x = x;
    self.y = y;
    self.widht = widht;
    self.height = height;
    
    return self;
};

function RectMake(x,y,widht, height) {
    return Rect(x,y,widht,height);
}


function Key(frame){
    
    var self = this;
    self.frame = frame;
    self.value;
    
    self.setValue = function(text) {
        self.value = text;
    }
    
};

var newKey = new Key(RectMake(0,0,20,20));






