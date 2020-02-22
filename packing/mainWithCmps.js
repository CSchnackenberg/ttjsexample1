/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2020, Christoph Schnackenberg <bluechs@gmx.de>
 *
 * Released under the MIT license
 * https://github.com/CSchnackenberg/TTjs/blob/develop/LICENSE
 *
 * entry point for r.js
 */
define([
    './../main',
    './componentlist.js',
], function(
	m,
	cmps
) {
    "use strict";

    if (window.cordova) {
        console.log("-----------------> cordova!");

        document.addEventListener('deviceready', () => {
            console.log("cordova is ready. Let's begin!");
            m();
        }, false);

    }
    else {
        console.log("-----------------> plain browser");
        m();
    }



    //return m;
});


