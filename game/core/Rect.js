/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2020, Christoph Schnackenberg <bluechs@gmx.de>
 *
 * Released under the MIT license
 * https://github.com/CSchnackenberg/TTjs/blob/develop/LICENSE
 *
 * Example app
 */
define(['ttjs/lib/lodash'],
function(_) {
	"use strict";

	var Rect = function(x, y, w, h) {    		
		this.x = x || 0;
		this.y = y || 0;	
		this.w = w || 0;
		this.h = h || 0;
	};

	Rect.prototype = {
		top: function() {
			return this.y;
		},
		left: function() {
			return this.x;
		},
		right: function() {
			return this.x+this.w;
		},
		bottom: function() {
			return this.y+this.h;
		},
		centerX: function() {
			return this.x+this.w*0.5;
		},
		centerY: function() {
			return this.y+this.h*0.5;
		},
		/** 
		 * true if the other object is completely inside
		 * the rectangle
		 * 
		 * @param {Mixed} other Rect or Circle
		 * @returns {Boolean} 
		 */
		contains: function(other) {
			return (
				other.left() >= this.x &&
				other.top() >= this.y &&
				other.right() <= this.right() &&
				other.bottom() <= this.bottom()				
			);		
		},
		intersects: function(other) {
			// TODO replace with true circular approach
			return !(
				other.left() > this.right() || 
				other.right() < this.x || 
				other.top() > this.bottom() ||
				other.bottom() < this.y
			);			
		}
	};
	
	return Rect;
});