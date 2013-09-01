/**
 * @fileoverview General-purpose key frame animation
 * @author Tony Parisi
 */
goog.provide('Vizi.KeyFrameAnimator');
goog.require('Vizi.Component');

// KeyFrameAnimator class
// Construction/initialization
Vizi.KeyFrameAnimator = function(param) 
{
    Vizi.Component.call(this, param);
	    		
	param = param || {};
	
	this.interpdata = param.interps || [];
	this.animationData = param.animations;
	this.running = false;
	this.duration = param.duration ? param.duration : Vizi.KeyFrameAnimator.default_duration;
	this.loop = param.loop ? param.loop : false;
}

goog.inherits(Vizi.KeyFrameAnimator, Vizi.Component);
	
Vizi.KeyFrameAnimator.prototype.realize = function()
{
	Vizi.Component.prototype.realize.call(this);
	
	if (this.interpdata)
	{
		this.createInterpolators(this.interpdata);
	}
	
	if (this.animationData)
	{
		this.animations = [];
		var i, len = this.animationData.length;
		for (i = 0; i < len; i++)
		{				
			var animdata = this.animationData[i];
			if (animdata instanceof THREE.glTFAnimation) {
				this.animations.push(animdata);
			}
			else {
				
				THREE.AnimationHandler.add(animdata);
				var animation = new THREE.KeyFrameAnimation(animdata.node, animdata.name);
//			animation.timeScale = .01; // why?
				this.animations.push(animation);
			}
		}
	}
}

Vizi.KeyFrameAnimator.prototype.createInterpolators = function(interpdata)
{
	this.interps = [];
	
	var i, len = interpdata.length;
	for (i = 0; i < len; i++)
	{
		var data = interpdata[i];
		var interp = new Vizi.Interpolator({ keys: data.keys, values: data.values, target: data.target });
		interp.realize();
		this.interps.push(interp);
	}
}

// Start/stop
Vizi.KeyFrameAnimator.prototype.start = function()
{
	if (this.running)
		return;
	
	this.startTime = Date.now();
	this.lastTime = this.startTime;
	this.running = true;
	
	if (this.animations)
	{
		var i, len = this.animations.length;
		for (i = 0; i < len; i++)
		{
			this.animations.loop = this.loop;
			this.animations[i].play(this.loop, 0);
			this.endTime = this.startTime + this.animations[i].endTime / this.animations[i].timeScale;
		}
	}
}

Vizi.KeyFrameAnimator.prototype.stop = function()
{
	this.running = false;
	this.dispatchEvent("complete");

	if (this.animations)
	{
		var i, len = this.animations.length;
		for (i = 0; i < len; i++)
		{
			this.animations[i].stop();
		}
	}

}

// Update - drive key frame evaluation
Vizi.KeyFrameAnimator.prototype.update = function()
{
	if (!this.running)
		return;
	
	if (this.animations)
	{
		this.updateAnimations();
		return;
	}
	
	var now = Date.now();
	var deltat = (now - this.startTime) % this.duration;
	var nCycles = Math.floor((now - this.startTime) / this.duration);
	var fract = deltat / this.duration;

	if (nCycles >= 1 && !this.loop)
	{
		this.running = false;
		this.dispatchEvent("complete");
		var i, len = this.interps.length;
		for (i = 0; i < len; i++)
		{
			this.interps[i].interp(1);
		}
		return;
	}
	else
	{
		var i, len = this.interps.length;
		for (i = 0; i < len; i++)
		{
			this.interps[i].interp(fract);
		}
	}
}

Vizi.KeyFrameAnimator.prototype.updateAnimations = function()
{
	var now = Date.now();
	var deltat = now - this.lastTime;
	var complete = false;
	
	var i, len = this.animations.length;
	for (i = 0; i < len; i++)
	{
		this.animations[i].update(deltat);
		if (!this.loop && (now >= this.endTime))
			complete = true;
	}
	this.lastTime = now;	
	
	if (complete)
	{
		this.stop();
	}
}

// Statics
Vizi.KeyFrameAnimator.default_duration = 1000;
