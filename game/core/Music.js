/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2020, Christoph Schnackenberg <bluechs@gmx.de>
 *
 * Released under the MIT license
 * https://github.com/CSchnackenberg/TTjs/blob/develop/LICENSE
 *
 */
define([
	'ttjs/util/TTTools',
	'jquery'
],
function(
	env,
	$
) {
	"use strict";
	
	const Music = function() {
		// create html5 audio tag
		const elem = $("<audio>")
			.attr("loop", "loop")
			.append("<source>")	
			.appendTo("body");		
		this.audio = elem.get(0);
		this.source = elem.find("source").get(0);
	};
	
	Music.prototype = {		
		play: function(tune) {
			if (this.audio.canPlayType('audio/mpeg;')) {
				this.source.type= 'audio/mpeg';
				this.source.src= tune + '.mp3';
			} else {
				this.source.type= 'audio/ogg';
				this.source.src= tune + '.ogg';
			}				
			$(this.source).detach().appendTo($(this.audio));			
			this.audio.play();
		},
		stop: function() {
			this.audio.pause();
			this.source.type= "";
			this.source.src = "";
		}
	};
	
	return Music;
});

