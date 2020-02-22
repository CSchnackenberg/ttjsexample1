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
	'game/core/GraphicEngine',
	'game/core/Rect'
], function(
    ComponentManager,
	GraphicEngine,
	Rect
) {
	"use strict";
    function FollowCamera() {};

    FollowCamera.requires = {
        need: {},
        opt:  {
			followSpeed: ["number", 0.1]
		},
        cmps: [],    
        res: function(prop) {},
		children: function(prop) {}
    };	
	
    FollowCamera.prototype = {   
        onInit: function(entity) {			
			this.currentPOI = {
				x: 0,
				y: 0
			};
			
        },
        onActivate: function(entity) { 
        },                
        onUpdate: function(entity, time) {        
	
			var camRect = GraphicEngine.getCamRect();
			var newX = camRect.x * (1-entity.props.followSpeed) + entity.props.followSpeed * (this.currentPOI.x - camRect.w*0.5);
			var newY = camRect.y * (1-entity.props.followSpeed) + entity.props.followSpeed * (this.currentPOI.y - camRect.h*0.5);
			
			if (newX < 0)
				newX = 0;
			if (newY < 0)
				newY = 0;			
			
			//console.log(newX, newY);
			GraphicEngine.setCam(newX, newY);	
        },
        onDeactivate: function(entity) {
        },
		onMessage_PointOfInterestMoved: function(entity, msg) {
			this.currentPOI.x = msg.x;
			this.currentPOI.y = msg.y;
		}
    };
        
	ComponentManager.registerComponentClass("FollowCamera", FollowCamera);
});
