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
    'ttjs/lib/easeljs',
    'game/core/GraphicEngine'
], function(
    ComponentManager,
	XMath,
	Fx,
    GraphicEngine
) {
	"use strict";
    function Pointer() {};

    Pointer.requires = {
        need: {},
        opt:  {
            pointerLayerName: ["string", "ontop"],
            pointerOffsetX: ["number", -20],
            pointerOffsetY: ["number", 30],
        },
        cmps: [
			"FxNode",
			"Sprite"
		],    
        res: function(prop) {
			return [
				"jsImage!game/assets/arrow.png"
			];
		},
		children: function(prop) {}
    };	
	
    Pointer.prototype = {      

		
        onInit: function(entity) {
			this.selected = false;

            this.node = new Fx.Container();

            this.playerNode = entity.findComponent("FxNode").node;

            this.stage = GraphicEngine.stages[entity.props.pointerLayerName];
            if (!this.stage) {
                entity.setState("error", "Pointer::pointerLayerName" + entity.props.pointerLayerName + "not found");
                return;
            }


			this.highlightSelection = new Fx.Bitmap(entity.manager.getResource("jsImage", "game/assets/arrow.png"));
			this.node.addChild(this.highlightSelection);
			this.highlightSelection.x = 0;
			this.highlightSelection.y = -100;
			this.highlightSelection.visible = false;

			this.anim = 0;
			this.selected = false;
        },
        onActivate: function(entity) {
            this.stage.addChild(this.node);
        },
        onDeactivate: function(entity) {
            this.stage.removeChild(this.node);
        },
        onUpdate: function(entity, time) {

            if (this.selected) {
                this.anim += 0.1;
                this.highlightSelection.y = -100 + (Math.sin(this.anim) * 10);

                this.node.x = this.playerNode.x + entity.props.pointerOffsetX;
                this.node.y = this.playerNode.y + entity.props.pointerOffsetY;

            }

        },
		onMessage_SelectFigure: function(entity, selectedEntity) {
			if (selectedEntity === entity) {
				if (!this.selected) {
					this.selected = true;
				}								
			}
			else {

                this.selected = false; 
			}
			this.highlightSelection.visible = this.selected;
		},

    };
        
	ComponentManager.registerComponentClass("Pointer", Pointer);
});
