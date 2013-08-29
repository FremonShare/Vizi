goog.provide('Vizi.PerspectiveCamera');
goog.require('Vizi.Camera');

Vizi.PerspectiveCamera = function(param) {
	param = param || {};
	
	if (param.object) {
		this.object = param.object;
	}
	else {		
		var fov = param.fov || 45;
		var near = param.near || Vizi.Camera.DEFAULT_NEAR;
		var far = param.far || Vizi.Camera.DEFAULT_FAR;
		var container = Vizi.Graphics.instance.container;
		var aspect = param.aspect || (container.offsetWidth / container.offsetHeight);
		this.updateProjection = false;
		
		this.object = new THREE.PerspectiveCamera( fov, aspect, near, far );
	}
	
    // Create accessors for all properties... just pass-throughs to Three.js
    Object.defineProperties(this, {
        fov: {
	        get: function() {
	            return this.object.fov;
	        },
	        set: function(v) {
	        	this.object.fov = v;
	        	this.updateProjection = true;
	        }
		},    	
        aspect: {
	        get: function() {
	            return this.object.aspect;
	        },
	        set: function(v) {
	        	this.object.aspect = v;
	        	this.updateProjection = true;
	        }
    	},    	
        near: {
	        get: function() {
	            return this.object.near;
	        },
	        set: function(v) {
	        	this.object.near = v;
	        	this.updateProjection = true;
	        }
    	},    	
        far: {
	        get: function() {
	            return this.object.far;
	        },
	        set: function(v) {
	        	this.object.far = v;
	        	this.updateProjection = true;
	        }
    	},    	

    });

	Vizi.Camera.call(this, param);
	
    
}

goog.inherits(Vizi.PerspectiveCamera, Vizi.Camera);

Vizi.PerspectiveCamera.prototype.realize = function()  {
	Vizi.Camera.prototype.realize.call(this);	
}

Vizi.PerspectiveCamera.prototype.update = function()  {
	if (this.updateProjection)
	{
		this.object.updateProjectionMatrix();
		this.updateProjection = false;
	}
}
