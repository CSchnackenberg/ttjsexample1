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
    function Sprite() {};

    Sprite.requires = {
        need: {},
        opt:  {
			spriteSheetUrl: ["string", "game/assets/figure.json"],
			startAnim: ["string", "idle_2"]
		},
        cmps: [
			"FxNode"
		],    
        res: function(prop) {
			return [
				"FxSprite!"+prop.spriteSheetUrl
			];							
		},
		children: function(prop) {}
    };	
	
    Sprite.prototype = {      
        onInit: function(entity) {
			this.node = entity.findComponent("FxNode").node;
            //this.sprite = new Fx.BitmapAnimation(entity.manager.getResource("FxSprite", entity.props.spriteSheetUrl;
            this.sprite = new Fx.Sprite(entity.manager.getResource("FxSprite", entity.props.spriteSheetUrl));
			this.sprite.gotoAndPlay(entity.props.startAnim);			
			this.node.addChild(this.sprite);
        },
        onActivate: function(entity) { 		
        },                
        onUpdate: function(entity, time) {        
        },
        onDeactivate: function(entity) {
        }        
    };
        
	ComponentManager.registerComponentClass("Sprite", Sprite);
});
