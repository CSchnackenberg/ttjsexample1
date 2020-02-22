/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2020, Christoph Schnackenberg <bluechs@gmx.de>
 *
 * Released under the MIT license
 * https://github.com/CSchnackenberg/TTjs/blob/develop/LICENSE
 *
 * Loads BitmapFont
 */
define([
    'ttjs/util/TTTools',
    'jquery', 
    'ttjs/lib/easeljs',
	'game/res/FxSpriteResources'
],
function(
    env,
	$,
	Fx,
	FxSpriteResources
){    
    "use strict";


	/**
	 * BitMapFonts (BMF):
	 *
	 * They consist of:
	 *
	 *  fontName.fnt
	 *  fontName_0.png
	 *  fontName_1.png
	 *  fontName_....png
	 *  fontName_n.png
	 *
	 * This resource loader can only load text-based *.fnt files created using the bmfont64.exe tool. The *.BMFC file
	 * is the configuration of the font.
	 *
	 * The result of this file is a easeljs SpriteSheet class that is compatible with easeljs' BitmapFont and some meta data:
	 *
	 * {
	 *   sheet: SpriteSheet,
	 *   lineHeight: Number,
	 *   base: Number
	 *   outline: Boolean,
	 * }
	 *
	 */
	function BitmapFrontResource() {};


	/**
	 * the FNT-def file works like this:
	 *
	 * `<name0> <key0>=<value0> <key1>=<value1> <keyN>=<valueN>ENDOL`
	 * `<name1> <key0>=<value0> <key1>=<value1> <keyN>=<valueN>ENDOL`
	 * `...`
	 *
	 * One line of text is grouped by one name. The name, however, is not unique.
	 *
	 * This function basically just splits the whole thing into peaces so we can
	 * make sense of it in later.
	 *
	 * The returned structure looks like this:
	 *
	 * {
	 *     "name0": [
	 *         {
	 *             key0: value0,
	 *             key1: value1,
	 *             keyN: valueN,
	 *         },
	 *         {
	 *             key0: value0,
	 *             key1: value1,
	 *             keyN: valueN,
	 *         }
	 *     ],
	 *     "name1": [...]
	 * }
	 *
	 */
	const parseDefFile = (txt) => {
		const defData = {};
		const lines = txt.split(/\r?\n/);
		for (let i=0; i<lines.length; i++) {
			const line = lines[i];
			const parts = line.split(" ");
			if (!parts || parts.length == 0)
				continue;
			const name = parts[0];
			if (!name)
				continue;
			const rowEntry = {};
			if (!defData[name]) {
				defData[name] = [];
			}
			defData[name].push(rowEntry);
			for (let i2=1; i2<parts.length; i2++) {
				const part = parts[i2];
				const keyValuePair = part.split("=");
				if (!keyValuePair || keyValuePair.length != 2)
					continue;
				const key = keyValuePair[0];
				const rawValue = keyValuePair[1];
				let value = null;
				if (rawValue.startsWith("\"") && // string
					rawValue.endsWith("\"")) {
					value = rawValue.substring(1, rawValue.length - 1);
				}
				else if (rawValue.indexOf(",") > -1) { // number array
					const rawNumbers = rawValue.split(",");
					value = [];
					for (let i3=0; i3<rawNumbers.length; i3++) {
						value.push(Number(rawNumbers[i3]));
					}
				}
				else { // number
					value = Number(rawValue);
				}
				rowEntry[key] = value;
			}
		}
		return defData;
	};


	/**
	 * converts fnt to sprite sheet json
	 */
	const textToSpriteSheetDef = (txt, baseUrl) => {
		const fontDef = parseDefFile(txt);

		// We need to build a easeljs spritesheet out of this.

		// IMAGE
		// let's start with the images. The source data has a field called: "page". Each page is kind of the
		// an image.
		// Each page has an ID. Luckily the format makes it easy because we can simply use the index of a page
		// as the ID. This way we can also simply reuse that ID as image-Index in
		const outImages = [];
		const fontPages = fontDef["page"];
		for (let i=0; i<fontPages.length; i++) {
			let file = fontPages[i].file;
			const pathSep = file.lastIndexOf("/");
			if (pathSep > -1) {
				file = file.substring(pathSep + 1); // cut away path data
			}
			outImages.push(baseUrl + file);
		}

		// FRAMES
		//
		// For each frame we can define the following array:
		// >> [x, y, width, height, imageIndex*, regX*, regY*]
		// The values with an `*` are optional.
		//
		// Each character is represented by one specific frame. The SpriteSheet definition identifies a character by it's
		// index in the frames array. However, the font-def format uses an ID approach that does not work
		// well with array indices. To cover this we need to keep track of each frame-index with an additional ID.
		const fontChar = fontDef["char"];
		const outFrames = [];
		const charIdToFrameIndex = {};
		const charIdList = [];
		const lineHeight = fontDef["common"][0].lineHeight;
		const base = fontDef["common"][0].base
		for (let i=0; i<fontChar.length; i++) {
			const charDef = fontChar[i];
			// source data
			const id = charDef.id;
			const x = charDef.x;
			const y = charDef.y;
			const w = charDef.width;
			const h = charDef.height;
			const page = charDef.page;
			const xoffset = charDef.xoffset;
			const yoffset = charDef.yoffset;
			const xadvance = charDef.xadvance;

			// let's create a frame:
			const frameImageIndex = page;
			const frameX = x;
			const frameY = y;
			const frameWidth = w;
			const frameHeight = h;
			const frameRegX = -xoffset;
			const frameRegY = lineHeight -yoffset - base;

			// add frame and remember the ID
			charIdToFrameIndex[id] = i;
			charIdList.push(id);
			outFrames.push([
				frameX,
				frameY,
				frameWidth,
				frameHeight,
				frameImageIndex,
				frameRegX,
				frameRegY
			]);
		}

		// ANIMATIONS
		//
		// Finally we need to have one animation for each character. For example we need to have an "A": 0 in order to
		// be able to print an "A".
		//
		// In the variable charIdList we have a list with all supported characters and thanks to charIdToFrameIndex
		// also know the frame-index of each character. What we need to do now is to determine the JavaScript-String
		// literal that matches to the character ID.
		const outAnimation = {};
		const charset = fontDef["info"][0].charset;
		for (let i=0; i<charIdList.length; i++) {
			const charId = charIdList[i];
			const frameIndex = charIdToFrameIndex[charId];
			let letterChar = "";

			switch(charset) {
				case "ANSI":
					letterChar = String.fromCharCode(charId);
					break;
				default:
					// not supported :(
					break;
			}

			if (typeof letterChar === 'undefined') {
				console.error("Unsupported or unknown character. Char:", charId,", charset:", charset);
				continue;
			}

			// define the tuple: CHAR => FRAME_INDEX
			outAnimation[letterChar] = frameIndex;
		}



		// build the
		const result = {
			"images": outImages,
			"frames": outFrames,
			"animations": outAnimation,
		};
		return {
			sheetDef: result,
			lineHeight: lineHeight,
			base: base,
			outline: fontDef["info"][0].outline ? true: false,
		};
	};


	BitmapFrontResource.prototype = {
		getType: function() {
			return "BMF";
		},
		canHandle: function(url) {
            return (env.strEndsWith(url.toLowerCase(), ".fnt")) ||
				(env.strEndsWith(url.toLowerCase(), ".fntx.json"));
		},		
        load: function(url, callback) {

			const isFontExtended = env.strEndsWith(url.toLowerCase(), ".fntx.json");



			const loadImage = (fntUrl, filter) => {
				$.ajax({
					url: fntUrl,
					dataType: "text"
				})
				.done((fntTxtFile) => {
					const urlPath = fntUrl.substring(0, fntUrl.lastIndexOf("/"))+"/";
					const ssdef = textToSpriteSheetDef(fntTxtFile, urlPath);
					const result = ssdef;

					var sheet = new Fx.SpriteSheet(ssdef.sheetDef);
					if (!sheet.complete) {
						sheet.addEventListener('complete', function() {
							result.sheet = sheet;

							if (filter && filter.length > 0) {
								if (!FxSpriteResources.applyFilterToSpriteSheet(sheet, filter)) {
									callback(false, "Error apply font-X-sprite filter: " + err);
									return;
								}
							}

							callback(true, result);
						});
						sheet.addEventListener('error', function() {
							callback(false, "Cannot load bitmapfont");
						});
					}
					else {

						if (filter && filter.length > 0) {
							if (!FxSpriteResources.applyFilterToSpriteSheet(sheet, filter)) {
								callback(false, "Error apply font-X-sprite filter: " + err);
								return;
							}
						}

						result.sheet = sheet;
						callback(true, result);
					}
				})
				.fail(function() {
					callback(false, "Cannot find resources");
				});
			};

			if (!isFontExtended) {
				loadImage(url, null);
			}
			else {
				$.getJSON(url, { "noCache": Math.random() })
				.done(function(json) {
					const fntFile = json["font"];
					const filterJson = json["filters"];
					let filter = null;
					if (!fntFile) {
						callback(false, "Missing font entry in fntx.json");
						return;
					}

					if (filterJson) {
						filter = FxSpriteResources.parseFilterJSON(filterJson, callback);
						if (filter === false)
							return;
					}

					loadImage(fntFile, filter);
				})
				.fail(function() {
					callback(false, "Error loading fntx.json");
				});
			}



        }
	};	
	
	return BitmapFrontResource;
});