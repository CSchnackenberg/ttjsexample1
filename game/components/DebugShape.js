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
    'ttjs/lib/easeljs'
], function(
    ComponentManager,
    Fx)
{    
	"use strict";
    function DebugShape() {};

    DebugShape.requires = {
        need: {},
        opt:  {
			followSpeed: ["number", 0.01]
		},
        cmps: [
			"FxNode"
		],    
        res: function(prop) {},
		children: function(prop) {}
    };	
	
    DebugShape.prototype = {    
        
        shape: null,		
        
        onInit: function(entity) {
	
			this.node = entity.findComponent("FxNode").node;
            
            var graphics = new Fx.Graphics();
            this.shape = new Fx.Shape(graphics);          
            if (entity.spatial.type === "rect") {
                graphics
                    .beginFill("rgba(255,0,0,0.5)")
                    .drawRect(
                        0,
                        0,
                        entity.spatial.w,
                        entity.spatial.h)
					.endFill()
					.beginStroke("#f00")
					.drawRect(
						0,
                        0,
                        entity.spatial.w,
                        entity.spatial.h);                
            }                  
			this.node.addChild(this.shape);
        },
        onActivate: function(entity) { 
			
        },                
        onUpdate: function(entity, time) {        
        },
        onDeactivate: function(entity) {
        }		
    };
        
	ComponentManager.registerComponentClass("DebugShape", DebugShape);
});
