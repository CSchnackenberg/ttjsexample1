/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2020, Christoph Schnackenberg <bluechs@gmx.de>
 *
 * Released under the MIT license
 * https://github.com/CSchnackenberg/TTjs/blob/develop/LICENSE
 *
 * Loads a sprite resource
 */
define([
    'ttjs/util/TTTools',
    'jquery', 
    'ttjs/lib/easeljs',
	'game/filter/ReplaceColorFilter'
],
function(
    env,
	$,
	Fx,
	ReplaceColorFilter
){    
    "use strict";


	/**
	 * Loads a easeljs SpriteSheet from a standard easel-config source.
	 *
	 * The following extension allows you to define filters being perfomed
	 * on the images so one can have efficient color and pixel transfroms
	 * during loading times (as long as they are static).
	 *
	 * Just add the filter class name and provide an array with the parameters.
	 *
	 * For ColorMatrixFilter one can set a list of sub-arrays to make use of the
	 * order dependent color manipulation of a matrix.
	 *
	 *  add this to patch in simple filers
	 * "ttjs_filters": [
	 *   {
	 *      "type": "ColorFilter",
	 *      "params": [150, 100, 0, 1, 0, 255, 255]
	 *   },
	 *   {
	 *      "type": "ColorMatrixFilter",
	 *      "params": [
	 *         ["hue", 10],
	 *         ["saturation", 10],
	 *         ["contrast", 1]
	 *         ["brightness", 1]
	 *      ]
	 *   }
	 * ],
	 * @constructor
	 */
	function FxSpriteResources() {};


	FxSpriteResources.applyFilterToSpriteSheet = function(sheet, filterList) {
		for (let c=0; c<sheet._images.length; c++) {
			const img = sheet._images[c];
			const surface = document.createElement("canvas"); // memory leak?
			surface.width = img.width;
			surface.height = img.height;
			const ctx = surface.getContext("2d");
			for (let i=0; i<filterList.length; i++) {
				const filter = filterList[i];
				try {
					ctx.drawImage(img, 0, 0);
					const imageData = ctx.getImageData(0, 0, img.width, img.height);
					filter._applyFilter(imageData);
					ctx.putImageData(imageData, 0, 0);
				} catch (err) {
					console.error(err);
					return false;
				}
			}

			// patch spritesheet
			sheet._images[c] = surface;
			for (let f=0; f<sheet._frames.length; f++) {
				const frame = sheet._frames[f];
				if (frame.image == img) {
					frame.image = surface;
				}
			}
		}

		return true;
	};

	FxSpriteResources.parseFilterJSON = function(ttjsFilterJson, callback) {
		const ttjsFilter = [];
		if (ttjsFilterJson) {
			try {
				for (let i=0; i<ttjsFilterJson.length; i++) {
					const type = ttjsFilterJson[i].type;
					const params = ttjsFilterJson[i].params;
					if (type == "ColorMatrixFilter") {
						const colorMatrix = new Fx.ColorMatrix();
						const filter = new Fx.ColorMatrixFilter(colorMatrix);
						for (let a=0; a<params.length; a++) {
							const adjustType = params[a][0];
							const adjustValue = params[a][1];
							switch(adjustType) {
								case "hue": colorMatrix.adjustHue(adjustValue); break;
								case "saturation": colorMatrix.adjustSaturation(adjustValue); break;
								case "contrast": colorMatrix.adjustContrast(adjustValue); break;
								case "brightness": colorMatrix.adjustBrightness(adjustValue); break;
							}
						}
						ttjsFilter.push(filter);
					}
					else {
						const cls = Fx[type];
						if (!cls) {
							callback(false, "Error in spritesheet filter configuration: Unknown filter type: " + type);
							return false;
						}
						const ctr = cls.bind.apply(cls, [0, ...params]);
						const filter = new ctr(); // create filter object
						ttjsFilter.push(filter);
					}
				}
			}
			catch(err) {
				console.error(err);
				callback(false, "Error in spritesheet filter configuration: " + err);
				return false;
			}
		}
		return ttjsFilter;
	};
	
	FxSpriteResources.prototype = {
		getType: function() {
			return "FxSprite";
		},
		canHandle: function(url) {
            return (env.strEndsWith(url.toLowerCase(), ".sprite"));
		},		
        load: function(url, callback) {   			
			$.getJSON(url)
			.done(function(json) {
				const ttjsFilterJson = json["ttjs_filters"];
				const ttjsFilter = FxSpriteResources.parseFilterJSON(ttjsFilterJson, callback);
				if (ttjsFilter === false) // we already notified an error
					return;

				var sheet = new Fx.SpriteSheet(json);
				if (!sheet.complete) {
					sheet.addEventListener('complete', function() {
						if (ttjsFilter.length > 0) {
							if (!FxSpriteResources.applyFilterToSpriteSheet(sheet, ttjsFilter)) {
								callback(false, "Error apply spritesheet filter: " + err);
								return;
							}
						}
						callback(true, sheet);
					});
					sheet.addEventListener('error', function() {
						callback(false, "Cannot load spritesheet");
					});
				}
				else {
					if (ttjsFilter.length > 0) {
						if (!FxSpriteResources.applyFilterToSpriteSheet(sheet, ttjsFilter)) {
							callback(false, "Error apply spritesheet filter: " + err);
							return;
						}
					}
					callback(true, sheet);
				}
			})
			.fail(function() { 
				callback(false, "Cannot find resources");
			});
			
        }
	};	
	
	return FxSpriteResources;
});