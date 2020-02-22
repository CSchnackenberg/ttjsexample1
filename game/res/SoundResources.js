/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2020, Christoph Schnackenberg <bluechs@gmx.de>
 *
 * Released under the MIT license
 * https://github.com/CSchnackenberg/TTjs/blob/develop/LICENSE
 *
 * Loads a sound resource
 */
define(['ttjs/util/TTTools'],
function(env)
{    
    "use strict";
	
	function ImageResources() {};	
	
	ImageResources.prototype = {
		getType: function() {
			return "sound";
		},
		canHandle: function(url) {
            return (env.strEndsWith(url.toLowerCase(), ".ogg") ||
                    env.strEndsWith(url.toLowerCase(), ".mp3"));
		},		
        load: function(url, callback) {      	
			// preload sound is somewhat strange
			// in the soundJs API.
			//
			// Not sure how to preload a tune.
        }
	};	
	
	return ImageResources;
});