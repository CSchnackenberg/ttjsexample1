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
    //'env',
    'ttjs/entity/ComponentManager',
	'ttjs/lib/gl-matrix',
    'ttjs/lib/easeljs'
], function(
    ComponentManager,
	XMath,
	Fx)
{    
	"use strict";
    function FigureAi() {};

    FigureAi.requires = {
        need: {},
        opt:  {
            'slowSpeed': ["number", 1],
            'fastSpeed': ["number", 1],
            selectedOnStart: {type: "enum", def: "false", allowed: ["true", "false"]},
            centerOffsetX: ["number", -10],
            centerOffsetY: ["number", -10],
        },
        cmps: [
			"FxNode",
			"Sprite"
		],    
        res: function(prop) {},
		children: function(prop) {}
    };	
	
    FigureAi.prototype = {      
		dirMap: {
			0: 4,
			7: 1,
			6: 2,
			5: 3, 
			4: 6,
			3: 9,
			2: 8,
			1: 7,
			8: 1
		},
		
        onInit: function(entity) {
			this.selected = false;
			this.node = entity.findComponent("FxNode").node;
			this.sprite = entity.findComponent("Sprite").sprite;

			this.position = XMath.vec2.create();
			this.dest = XMath.vec2.create();
			this.ray = XMath.vec2.create();
			
			XMath.vec2.set(this.position, this.node.x, this.node.y);		
			XMath.vec2.set(this.dest, this.node.x, this.node.y);
			
			this.lastAnim = "idle_2";
			this.wasAutoSelected = false;
        },
        onActivate: function(entity) { 
        },                
        onUpdate: function(entity, time) {


            if (!this.selected) {
                if (entity.props.selectedOnStart == "true" && !this.wasAutoSelected) {
                    entity.sendMessage("SelectFigure", entity);
                    this.wasAutoSelected = true;
                }
                return;
            }

            XMath.vec2.set(this.position, this.node.x, this.node.y);
            var dif = XMath.vec2.clone(this.ray);
            var nextAnim = this.lastAnim;
            var len = XMath.vec2.length(dif);
            let moveDir = 0;

            if (len > 0) {
            	var dir = (Math.atan2(dif[1], dif[0]) + Math.PI) / (Math.PI*2) * 8;
            	moveDir =  this.dirMap[Math.round(dir)];
            	nextAnim = "idle_" + moveDir;
            }

            if (len > 20) {
            	var speedUpAt = 50;
            	XMath.vec2.normalize(dif, dif);
            	XMath.vec2.scale(dif, dif, len > speedUpAt ? entity.props.fastSpeed : entity.props.slowSpeed);
            	XMath.vec2.add(this.position, this.position, dif);
            	this.node.x = this.position[0];
            	this.node.y = this.position[1];
            	nextAnim = len > speedUpAt ?
                    //"run_" + moveDir :
                    "walk_" + moveDir :
                    "walk_" + moveDir;
            }

            // switch animatuion
            if (this.lastAnim !== nextAnim){
            	this.sprite.gotoAndPlay(nextAnim);
            	this.lastAnim = nextAnim;
            }


            // highlight seelction
            entity.manager.sendMessage('PointOfInterestMoved', {x: this.node.x, y: this.node.y });

        },
        onDeactivate: function(entity) {
			this.selected = false;
        },
		onMessage_NodeClicked: function(entity, msg) {			
			entity.manager.sendMessage('SelectFigure', entity);
		},
		onMessage_SelectFigure: function(entity, selectedEntity) {
			if (selectedEntity === entity) {
				
				if (!this.selected) {					
                    //Sfx.Sound.play('assets/select.mp3|assets/select.ogg');
					this.selected = true;
					entity.sendMessage('openDebugGui', true);
				}								
			}
			else {
				if (this.selected)
					entity.sendMessage('openDebugGui', false);
                this.selected = false; 
			}
		},
        onMessage_MouseUp: function(entity, evt) {
		    if (!this.selected) {
		        return;
            }


            var dir = (Math.atan2(this.ray[1], this.ray[0]) + Math.PI) / (Math.PI*2) * 8;
            var moveDir =  this.dirMap[Math.round(dir)];
            const nextAnim = "idle_" + moveDir;

            this.sprite.gotoAndPlay(nextAnim);
            this.lastAnim = nextAnim;

		    XMath.vec2.set(this.ray, 0, 0);

        },

        onMessage_MouseDown: function(entity, evt) {
            if (!this.selected)
                return;

            XMath.vec2.set(this.dest, evt.world.x + entity.props.centerOffsetX, evt.world.y + entity.props.centerOffsetY);
            XMath.vec2.subtract(this.ray, this.dest, this.position);
        },
		onMessage_MouseMove: function(entity, evt) {
			if (!evt.isDown ||
				!this.selected)
				return;


			XMath.vec2.set(this.dest, evt.world.x + entity.props.centerOffsetX, evt.world.y + entity.props.centerOffsetY);
            XMath.vec2.subtract(this.ray, this.dest, this.position);
		},
    };
        
	ComponentManager.registerComponentClass("FigureAi", FigureAi);
});
