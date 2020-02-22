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
define([
], 
function(
) {

	var ActivationCircle = function(x, y, r)
	{    
		this._x = x ? x : 0;
		this._y = y ? y : 0;
		this._radius = r ? r : 1;    

		this.setPosition = function(x, y)
		{
		  this._x = x;
		  this._y = y;      
		};      

		this.setRadius = function(r)
		{
		  this._radius = r;      
		};      

		this.setAll = function(x,y,r)
		{
		  this._x = x;
		  this._y = y;
		  this._radius = r;
		};      

		/** 
		 * Checks if this circle collides with the other
		 * 
		 * @param {ActivationCircle} other description 
		 **/
		this.collides = function(other)
		{
			var a  = this._radius + other._radius;
			var dx = this._x - other._x;
			var dy = this._y - other._y;        

			var aa = a * a;
			var dd = dx*dx + dy*dy;        
			return aa > dd;            
		};
	};
	
	
	return ActivationCircle;
});