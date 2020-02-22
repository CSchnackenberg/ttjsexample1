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
	'game/core/GraphicEngine'
], function(
    ComponentManager,
	GraphicEngine
)
{    
	"use strict";
    function SendMouseEvents() {};

    SendMouseEvents.requires = {
        need: {},
        opt:  {
            inputLayerName: ["string", "shadows"],
        },
        cmps: [],    
        res: function(prop) {},
		children: function(prop) {}
    };

    const mouseUpDownData = {
        event: null,
        world: {x: 0, y:0}
    };
    const mouseMoveData = {
        event: null,
        world: {x: 0, y:0},
        isDown: false
    };
	
    SendMouseEvents.prototype = {      
        onInit: function(entity) {
            this.mouseIsDown = false;
            var thiz = this;
            this.mouseMove = function(mouse) {
                mouseMoveData.event = mouse;
                mouseMoveData.world.x = GraphicEngine.camPos.x + mouse.stageX;
                mouseMoveData.world.y = GraphicEngine.camPos.y + mouse.stageY;
                entity.manager.sendMessage('MouseMove', mouseMoveData);
            };
            this.mouseDown = function(mouse) {
                mouseMoveData.isDown = true;
                mouseUpDownData.event = mouse;
                mouseUpDownData.world.x = GraphicEngine.camPos.x + mouse.stageX;
                mouseUpDownData.world.y = GraphicEngine.camPos.y + mouse.stageY;
                entity.manager.sendMessage('MouseDown', mouseUpDownData );
            };
            this.mouseUp = function(mouse) {
                mouseMoveData.isDown = false;
                mouseUpDownData.event = mouse;
                mouseUpDownData.world.x = GraphicEngine.camPos.x + mouse.stageX;
                mouseUpDownData.world.y = GraphicEngine.camPos.y + mouse.stageY;
                entity.manager.sendMessage('MouseUp', mouseUpDownData);
            };

            const stage = GraphicEngine.stages[entity.props.inputLayerName];

            stage.addEventListener("stagemousemove", this.mouseMove);
            stage.addEventListener("stagemousedown", this.mouseDown);
            stage.addEventListener("stagemouseup", this.mouseUp);
        },
        onActivate: function(entity) {
        },
        onUpdate: function(entity, time) {
        },
        onDeactivate: function(entity) {
        },
        onDispose: function(entity) {
            const stage = GraphicEngine.stages[entity.props.inputLayerName];
            stage.removeEventListener("stagemousemove", this.mouseMove);
            stage.removeEventListener("stagemousedown", this.mouseDown);
            stage.removeEventListener("stagemouseup", this.mouseUp);
        },

    };
        
	ComponentManager.registerComponentClass("SendMouseEvents", SendMouseEvents);
});
