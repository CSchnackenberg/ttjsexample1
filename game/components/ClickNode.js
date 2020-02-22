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
    'ttjs/entity/ComponentManager'
], function(
    ComponentManager
)
{    
	"use strict";
    function ClickNode() {};

    ClickNode.requires = {
        need: {},
        opt:  {},
        cmps: [
			"FxNode"
		],    
        res: function(prop) {},
		children: function(prop) {}
    };	
	
    ClickNode.prototype = {      
        onInit: function(entity) {
			this.shapeCmp = entity.findComponent("FxNode");			
			this.mouseClick = function(mouse) {
				console.log("clicked: ", entity.name);
                entity.sendMessage('NodeClicked', mouse);
            };
        },
        onActivate: function(entity) { 
			this.shapeCmp.node.addEventListener("click", this.mouseClick); 
        },                
        onUpdate: function(entity, time) {        
        },
        onDeactivate: function(entity) {
			this.shapeCmp.node.removeEventListener("click", this.mouseClick); 
        }        
    };
        
	ComponentManager.registerComponentClass("ClickNode", ClickNode);
});
