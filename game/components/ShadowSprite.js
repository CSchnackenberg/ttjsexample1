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
	'game/core/GraphicEngine'
], function(
    ComponentManager,
	Fx,
	GraphicEngine)
{    
	"use strict";
    function ShadowSprite() {};

    ShadowSprite.requires = {
        need: {},
        opt:  {
			shadowSpriteUrl: ["string", "game/assets/figure.json"],
			shadowAnim: ["string", "shadow"],
			shadowLayerName: ["string", "shadows"],
			shadowOffset: ["any", {x:0, y:0}]
		},
        cmps: [],    
        res: function(prop) {},
		children: function(prop) {}
    };	
	
    ShadowSprite.prototype = {      
        onInit: function(entity) {
			
			//this.shadow = new Fx.BitmapAnimation(entity.manager.getResource("FxSprite", entity.props.shadowSpriteUrl));
            this.shadow = new Fx.Sprite(entity.manager.getResource("FxSprite", entity.props.shadowSpriteUrl));
			this.shadow.gotoAndPlay(entity.props.shadowAnim);						
			this.shadowStage = GraphicEngine.stages[entity.props.shadowLayerName];			

			this.relativeTo = entity.findComponent("FxNode");
			if (this.relativeTo) {
				this.shadow.x = this.relativeTo.node.x + entity.props.shadowOffset.x;
				this.shadow.y = this.relativeTo.node.y + entity.props.shadowOffset.y;
			}
			else {
				this.shadow.x = entity.spatial.x + entity.spatial.w * 0.5 + entity.props.shadowOffset.x;
	            this.shadow.y = entity.spatial.y + entity.spatial.h * 0.5 + entity.props.shadowOffset.y;
			}

			if (!this.shadowStage) {
				entity.dispose();
			}
        },
        onActivate: function(entity) { 			
			this.shadowStage.addChild(this.shadow);
        },                
        onUpdate: function(entity, time) {        
			if (this.relativeTo) {
				this.shadow.x = this.relativeTo.node.x + entity.props.shadowOffset.x;
				this.shadow.y = this.relativeTo.node.y + entity.props.shadowOffset.y;
			}
        },
        onDeactivate: function(entity) {
			this.shadowStage.removeChild(this.shadow);
        },
		onMessage_AppendDebugables: function(entity, gui)
		{
			gui.add(entity.props.shadowOffset, 'x').min(-50).max(50).step(1);
			gui.add(entity.props.shadowOffset, 'y').min(-50).max(50).step(1);
		}
    };
        
	ComponentManager.registerComponentClass("ShadowSprite", ShadowSprite);
});
