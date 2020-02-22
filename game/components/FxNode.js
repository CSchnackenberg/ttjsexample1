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
], function(
    ComponentManager,
	Fx
) {
	"use strict";
    function FxNode() {};

    FxNode.requires = {
        need: {},
        opt:  {
			centerX: ["number", 0.5],
			centerY: ["number", 0.5]
		},
        cmps: [],    
        res: function(prop) {},
		children: function(prop) {}
    };	
	
    FxNode.prototype = {      
        onInit: function(entity) {			
			this.node = new Fx.Container();									
			
			this.node.x = entity.spatial.x + entity.spatial.w;
            this.node.y = entity.spatial.y + entity.spatial.h;
        },
        onActivate: function(entity) { 
			entity.props.stage.addChild(this.node);
        },                
        onUpdate: function(entity, time) {        
        },
        onDeactivate: function(entity) {
			entity.props.stage.removeChild(this.node);
        },     
		onDispose: function(entity) {			
		}
    };
        
	ComponentManager.registerComponentClass("FxNode", FxNode);
});
