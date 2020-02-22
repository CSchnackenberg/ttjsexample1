define([
	'ttjs/lib/easeljs'
],
function(
	createjs
) {
    "use strict";

    // TODO implment this (later)

	/**
	 * Applies a color replace to DisplayObjects.
	 *
	 *
	 *
	 **/
	function ReplaceColorFilter(replaceList) {
		this.Filter_constructor();

		// public properties:
		/**
		 * Red channel multiplier.
		 * @property redMultiplier
		 * @type Number
		 **/
		this.redMultiplier = redMultiplier != null ? redMultiplier : 1;

		/**
		 * Green channel multiplier.
		 * @property greenMultiplier
		 * @type Number
		 **/
		this.greenMultiplier = greenMultiplier != null ? greenMultiplier : 1;

		/**
		 * Blue channel multiplier.
		 * @property blueMultiplier
		 * @type Number
		 **/
		this.blueMultiplier = blueMultiplier != null ? blueMultiplier : 1;

		/**
		 * Alpha channel multiplier.
		 * @property alphaMultiplier
		 * @type Number
		 **/
		this.alphaMultiplier = alphaMultiplier != null ? alphaMultiplier : 1;

		/**
		 * Red channel offset (added to value).
		 * @property redOffset
		 * @type Number
		 **/
		this.redOffset = redOffset || 0;

		/**
		 * Green channel offset (added to value).
		 * @property greenOffset
		 * @type Number
		 **/
		this.greenOffset = greenOffset || 0;

		/**
		 * Blue channel offset (added to value).
		 * @property blueOffset
		 * @type Number
		 **/
		this.blueOffset = blueOffset || 0;

		/**
		 * Alpha channel offset (added to value).
		 * @property alphaOffset
		 * @type Number
		 **/
		this.alphaOffset = alphaOffset || 0;

		this.FRAG_SHADER_BODY = (
			"uniform vec4 uColorMultiplier;" +
			"uniform vec4 uColorOffset;" +

			"void main(void) {" +
			"vec4 color = texture2D(uSampler, vRenderCoord);" +

			"gl_FragColor = (color * uColorMultiplier) + uColorOffset;" +
			"}"
		);

	}
	var p = createjs.extend(ReplaceColorFilter, createjs.Filter);

	// TODO: deprecated
	// p.initialize = function() {}; // searchable for devs wondering where it is. REMOVED. See docs for details.


// public methods:
	/** docced in super class **/
	p.shaderParamSetup = function(gl, stage, shaderProgram) {
		gl.uniform4f(
			gl.getUniformLocation(shaderProgram, "uColorMultiplier"),
			this.redMultiplier, this.greenMultiplier, this.blueMultiplier, this.alphaMultiplier
		);

		gl.uniform4f(
			gl.getUniformLocation(shaderProgram, "uColorOffset"),
			this.redOffset/255, this.greenOffset/255, this.blueOffset/255, this.alphaOffset/255
		);
	};

	/** docced in super class **/
	p.toString = function() {
		return "[ReplaceColorFilter]";
	};

	/** docced in super class **/
	p.clone = function() {
		return new ReplaceColorFilter(
			this.redMultiplier, this.greenMultiplier, this.blueMultiplier, this.alphaMultiplier,
			this.redOffset, this.greenOffset, this.blueOffset, this.alphaOffset
		);
	};

// private methods:
	/** docced in super class **/
	p._applyFilter = function(imageData) {
		var data = imageData.data;
		var l = data.length;
		for (var i=0; i<l; i+=4) {
			data[i] = data[i]*this.redMultiplier+this.redOffset;
			data[i+1] = data[i+1]*this.greenMultiplier+this.greenOffset;
			data[i+2] = data[i+2]*this.blueMultiplier+this.blueOffset;
			data[i+3] = data[i+3]*this.alphaMultiplier+this.alphaOffset;
		}
		return true;
	};


	createjs.ReplaceColorFilter = createjs.promote(ReplaceColorFilter, "Filter");


	return ReplaceColorFilter;

});