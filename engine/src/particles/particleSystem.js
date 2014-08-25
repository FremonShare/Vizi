goog.provide('Vizi.ParticleSystemScript');
goog.require('Vizi.Script');
goog.require('Vizi.ParticleEmitter');

Vizi.ParticleSystem = function(param) {

	param = param || {};
	
	var obj = new Vizi.Object;

	var texture = param.texture || null;
	var maxAge = param.maxAge || Vizi.ParticleSystemScript.DEFAULT_MAX_AGE;

	var visual = null;
	if (param.geometry) {
		
		var color = (param.color !== undefined) ? param.color : Vizi.ParticleSystem.DEFAULT_COLOR;
		var material = new THREE.ParticleSystemMaterial({color:color, size:param.size, map:param.map,
			transparent: (param.map !== null), vertexColors: (param.geometry.colors.length > 0)});
		var ps = new THREE.ParticleSystem(param.geometry, material);

		if (param.map)
			ps.sortParticles = true;
		
	    visual = new Vizi.Visual({object:ps});
	}
	else {
		
		var particleGroup = new ShaderParticleGroup({
	        texture: texture,
	        maxAge: maxAge,
	      });
		    
	    visual = new Vizi.Visual({object:particleGroup.mesh});
	}
	
    obj.addComponent(visual);
    
	param.particleGroup = particleGroup;
	
	var pScript = new Vizi.ParticleSystemScript(param);
	obj.addComponent(pScript);
	
	return obj;
}


Vizi.ParticleSystemScript = function(param) {
	Vizi.Script.call(this, param);

	this.particleGroup = param.particleGroup;
	
	this._active = true;
	
    Object.defineProperties(this, {
        active: {
	        get: function() {
	            return this._active;
	        },
	        set: function(v) {
	        	this.setActive(v);
	        }
    	},
    });

}

goog.inherits(Vizi.ParticleSystemScript, Vizi.Script);

Vizi.ParticleSystemScript.prototype.realize = function()
{
    this.initEmitters();

}

Vizi.ParticleSystemScript.prototype.initEmitters = function() {
	
	var emitters = this._object.getComponents(Vizi.ParticleEmitter);
	
	var i = 0, len = emitters.length;
	
    for (i = 0; i < len; i++) {
    	var emitter = emitters[i];
    	this.particleGroup.addEmitter(emitter.object);
    	emitter.active = this._active;
    }
    
    this.emitters = emitters;
}

Vizi.ParticleSystemScript.prototype.setActive = function(active) {

	var emitters = this.emitters;
	if (!emitters)
		return;
	
	var i = 0, len = emitters.length;
	
    for (i = 0; i < len; i++) {
    	var emitter = emitters[i];
    	emitter.active = active;
    }

    this._active = active;
}

Vizi.ParticleSystemScript.prototype.update = function() {
	if (this.particleGroup) {
		this.particleGroup.tick();
	}
}

Vizi.ParticleSystem.DEFAULT_COLOR = 0xffffff;
Vizi.ParticleSystemScript.DEFAULT_MAX_AGE = 1;

