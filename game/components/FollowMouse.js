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
    function FollowMouse() {};

    FollowMouse.requires = {
        need: {},
        opt:  {},
        cmps: [
			"FxNode"
		],    
        res: function(prop) {},
		children: function(prop) {}
    };	
	
    FollowMouse.prototype = {      
        onInit: function(entity) {			
			this.node = entity.findComponent("FxNode").node;			
			this.dist = {
				x: this.node.x,
				y: this.node.y
			};
        },
        onActivate: function(entity) { 
        },        
        onUpdate: function(entity, time) {        
			this.node.x = (this.dist.x * entity.props.followSpeed) + (this.node.x * (1-entity.props.followSpeed));
			this.node.y = (this.dist.y * entity.props.followSpeed) + (this.node.y * (1-entity.props.followSpeed));
        },
        onDeactivate: function(entity) {
        },
				
		onMessage_mousemove: function(entity, mouse) {	
			this.dist.x = mouse.stageX;
			this.dist.y = mouse.stageY;
        }		
    };
        
	ComponentManager.registerComponentClass("FollowMouse", FollowMouse);
});
