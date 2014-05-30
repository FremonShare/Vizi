
goog.require('Vizi.Prefabs');

Vizi.Prefabs.FirstPersonController = function(param)
{
	param = param || {};
	
	var controller = new Vizi.Object(param);
	var controllerScript = new Vizi.FirstPersonControllerScript(param);
	controller.addComponent(controllerScript);

	var intensity = param.headlight ? 1 : 0;
	
	var headlight = new Vizi.DirectionalLight({ intensity : intensity });
	controller.addComponent(headlight);
	
	return controller;
}

goog.provide('Vizi.FirstPersonControllerScript');
goog.require('Vizi.Script');

Vizi.FirstPersonControllerScript = function(param)
{
	Vizi.Script.call(this, param);

	this._enabled = (param.enabled !== undefined) ? param.enabled : true;
	this._move = (param.move !== undefined) ? param.move : true;
	this._look = (param.look !== undefined) ? param.look : true;
	this._turn = (param.move !== undefined) ? param.turn : true;
	this._mouseLook = (param.mouseLook !== undefined) ? param.mouseLook : false;
	
	this.collisionDistance = 10;
	this.moveSpeed = 13;
	this.turnSpeed = 5;
	this.lookSpeed = 1;
	
	this.savedCameraPos = new THREE.Vector3;	
	this.movementVector = new THREE.Vector3;
	
    Object.defineProperties(this, {
    	camera: {
			get : function() {
				return this._camera;
			},
			set: function(camera) {
				this.setCamera(camera);
			}
		},
    	enabled : {
    		get: function() {
    			return this._enabled;
    		},
    		set: function(v) {
    			this.setEnabled(v);
    		}
    	},
    	move : {
    		get: function() {
    			return this._move;
    		},
    		set: function(v) {
    			this.setMove(v);
    		}
    	},
    	look : {
    		get: function() {
    			return this._look;
    		},
    		set: function(v) {
    			this.setLook(v);
    		}
    	},
    	mouseLook : {
    		get: function() {
    			return this._mouseLook;
    		},
    		set: function(v) {
    			this.setMouseLook(v);
    		}
    	},
        headlightOn: {
	        get: function() {
	            return this._headlightOn;
	        },
	        set:function(v)
	        {
	        	this.setHeadlightOn(v);
	        }
    	},
    });
}

goog.inherits(Vizi.FirstPersonControllerScript, Vizi.Script);

Vizi.FirstPersonControllerScript.prototype.realize = function()
{
	this.headlight = this._object.getComponent(Vizi.DirectionalLight);
	this.headlight.intensity = this._headlightOn ? 1 : 0;
}

Vizi.FirstPersonControllerScript.prototype.createControls = function(camera)
{
	var controls = new Vizi.FirstPersonControls(camera.object, Vizi.Graphics.instance.container);
	controls.mouseLook = this._mouseLook;
	controls.movementSpeed = this._move ? this.moveSpeed : 0;
	controls.lookSpeed = this._look ? this.lookSpeed  : 0;
	controls.turnSpeed = this._turn ? this.turnSpeed : 0;

	this.clock = new THREE.Clock();
	return controls;
}

Vizi.FirstPersonControllerScript.prototype.update = function()
{
	this.saveCamera();
	this.controls.update(this.clock.getDelta());
	var collide = this.testCollision();
	if (collide && collide.object) {
		this.restoreCamera();
		this.dispatchEvent("collide", collide);
	}
	
	if (this.testTerrain()) {
		this.restoreCamera();
	}
	
	if (this._headlightOn)
	{
		this.headlight.direction.copy(this._camera.position).negate();
	}	
}

Vizi.FirstPersonControllerScript.prototype.setEnabled = function(enabled)
{
	this._enabled = enabled;
	this.controls.enabled = enabled;
}

Vizi.FirstPersonControllerScript.prototype.setMove = function(move)
{
	this._move = move;
	this.controls.movementSpeed = move ? this.moveSpeed : 0;
}

Vizi.FirstPersonControllerScript.prototype.setLook = function(look)
{
	this._look = look;
	this.controls.lookSpeed = look ? 1.0 : 0;
}

Vizi.FirstPersonControllerScript.prototype.setMouseLook = function(mouseLook)
{
	this._mouseLook = mouseLook;
	this.controls.mouseLook = mouseLook;
}

Vizi.FirstPersonControllerScript.prototype.setCamera = function(camera) {
	this._camera = camera;
	this.controls = this.createControls(camera);
	this.controls.movementSpeed = this.moveSpeed;
	this.controls.lookSpeed = 0.1;

}

Vizi.FirstPersonControllerScript.prototype.saveCamera = function() {
	this.savedCameraPos.copy(this._camera.position);
}

Vizi.FirstPersonControllerScript.prototype.restoreCamera = function() {
	this._camera.position.copy(this.savedCameraPos);
}

Vizi.FirstPersonControllerScript.prototype.testCollision = function() {
	
	this.movementVector.copy(this._camera.position).sub(this.savedCameraPos);
	if (this.movementVector.length()) {
		
        var collide = Vizi.Graphics.instance.objectFromRay(null, 
        		this.savedCameraPos,
        		this.movementVector, 1, 2);

        if (collide && collide.object) {
        	var dist = this.savedCameraPos.distanceTo(collide.hitPointWorld);
        }
        
        return collide;
	}
	
	return null;
}

Vizi.FirstPersonControllerScript.prototype.testTerrain = function() {
	return false;
}

Vizi.FirstPersonControllerScript.prototype.setHeadlightOn = function(on)
{
	this._headlightOn = on;
	if (this.headlight) {
		this.headlight.intensity = on ? 1 : 0;
	}
}

