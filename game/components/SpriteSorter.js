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
require([
    'ttjs/entity/ComponentManager',
    'ttjs/lib/easeljs',
    'game/core/GraphicEngine',
], function(
    ComponentManager,
	Fx,
    GraphicEngine
) {
	"use strict";
    function SpriteSorter() {};

    SpriteSorter.requires = {
        need: {
            sortLayer: "string",
        },
        opt:  {
		},
        cmps: [],    
        res: function(prop) {},
		children: function(prop) {}
    };

    const YSorter = (a, b) => {
        if (a.y > b.y) {
            return 1;
        }
        if (a.y < b.y) {
            return -1;
        }
        return 0;
    };
	
    SpriteSorter.prototype = {      
        onInit: function(entity) {
            this.stage = GraphicEngine.stages[entity.props.sortLayer];

        },
        onActivate: function(entity) { 

        },                
        onUpdate: function(entity, time) {

            this.stage.sortChildren(YSorter);

        },
        onDeactivate: function(entity) {

        },     
		onDispose: function(entity) {			
		}
    };
        
	ComponentManager.registerComponentClass("SpriteSorter", SpriteSorter);
});
