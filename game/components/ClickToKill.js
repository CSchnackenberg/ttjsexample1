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
    function ClickToKill() {};

    ClickToKill.requires = {
        need: {},
        opt:  {},
        cmps: [
			"FxNode"
		],    
        res: function(prop) {},
		children: function(prop) {}
    };	
	
    ClickToKill.prototype = {      
        onInit: function(entity) {
			
			this.nodeCmp = entity.findComponent("FxNode");			
			this.mouseClick = function(mouse) {                
                entity.dispose();
            };                        
			
        },
        onActivate: function(entity) { 
			this.nodeCmp.node.addEventListener("click", this.mouseClick); 
        },                
        onUpdate: function(entity, time) {        
        },
        onDeactivate: function(entity) {
			this.nodeCmp.node.removeEventListener("click", this.mouseClick); 
        },
		onDispose: function(entity) {			
		}
    };
        
	ComponentManager.registerComponentClass("ClickToKill", ClickToKill);
});
