/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2020, Christoph Schnackenberg <bluechs@gmx.de>
 *
 * Released under the MIT license
 * https://github.com/CSchnackenberg/TTjs/blob/develop/LICENSE
 */
define([

    'ttjs/lib/requestAnimationFrame',
    'jquery',
	'game/Game',
	'game/core/GraphicEngine',
], function(

    requestAnimationFrame,
    $,
	Game,
	GraphicsEngine,
) {
    "use strict";


    const internMain = function(version, gameScaleMode) {


        if (version) {
            console.log(version);
            Game.version = version;
        }

        
        const canvas = $('#gfx').get(0);
        const context = canvas.getContext('2d');


        if (gameScaleMode == "double") {

            canvas.style.width = "800px";


        }
        else if (gameScaleMode == "mobile") {
            let cw = 240;
            let ch = Math.floor((window.innerHeight / window.innerWidth) * canvas.width);;

            if (ch >= 320) {
                canvas.width = cw;
                canvas.height = ch;
                canvas.style.width = "100%";
            }
            else {
                canvas.width = 240;
                canvas.height = ch;
                canvas.style.height = "100%";
            }
        }
        else if (gameScaleMode == "") {

        }



		//console.log("canvas: ", canvas.width, canvas.height);
		//console.log("window: ", window.innerWidth, window.innerHeight);

        // no smoothing plz
		context.webkitImageSmoothingEnabled = false;
		context.mozImageSmoothingEnabled = false;
		context.imageSmoothingEnabled = false;

		Game.init(canvas, context);
		let frame = 0;
		const simpleMainloop = (overwriteFps) => {
			let lastTime = performance.now();
			const maxElapse = 1 / 10.0;
			const render = function() {
				context.clearRect(0,0, canvas.width, canvas.height);
				const now = performance.now();
				let elapsed = (now - lastTime)/1000.0;
				const exit = Game.update(elapsed > maxElapse ? maxElapse : elapsed);
				if (exit) {
					console.error("Exit mainloop");
					return;
				}
				GraphicsEngine.draw(elapsed);
				lastTime = now;
				frame ++;
				if (overwriteFps)
                    setTimeout(render, 1/overwriteFps*1000);
				else
				    requestAnimationFrame(render);
			};
			render();
		};

		const cleverMainloop = () => {
			let lastTime = performance.now();
			const render = function() {
				context.clearRect(0,0, canvas.width, canvas.height);
				const now = performance.now();
				let elapsed = (now - lastTime)/1000.0;
				if (elapsed > 1)
					elapsed = 1;
				const FPS = 1 / 55;
				const FPSPerfect = 1 / 60;
				if (elapsed > FPS) {
					let rest = elapsed
					while(rest > 0) {
						let time = rest;
						if (rest > FPSPerfect) {
							time = FPSPerfect;
							rest -= FPSPerfect;
						}
						else {
							rest = 0;
						}
						//const exit = Game.update(elapsed > maxElapse ? maxElapse : elapsed);
						//console.log("ft:", time);
						const exit = Game.update(time);
						if (exit) {
							console.error("Exit mainloop");
							return;
						}
					}
				}
				else {
					const exit = Game.update(elapsed);
					if (exit) {
						console.error("Exit mainloop");
						return;
					}
				}
				//const exit = Game.update(elapsed > maxElapse ? maxElapse : elapsed);
				GraphicsEngine.draw(elapsed);
				lastTime = now;
				frame ++;
				//setTimeout(render, 120);
				requestAnimationFrame(render);
			};
			render();
		}

		//simpleMainloop(20);
		cleverMainloop();

    };

    const main = function (version, gameScaleMode="double") {
        internMain(version, gameScaleMode);
    };

    return main;
});



