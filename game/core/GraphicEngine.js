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
define([
    'ttjs/lib/easeljs',
    'jquery',
    'ttjs/engine/2d/tileRenderer/TileLayerRenderer_Canvas',
    'ttjs/engine/map/tiled/LayerModel',
    'ttjs/engine/map/tiled/MapRenderModel',
    'ttjs/engine/map/tiled/TileSetModel',
    'game/core/Music',
    'game/core/Rect',
], function(
	Fx,	
    $,
	TileLayerRenderer,
	LayerModel,
	MapRenderModel,
	TileSetModel,
	Music,
	Rect,
) {
    "use strict";
   
   
	/**
     * This is a fast hack to have multiple tile layer,
	 * objects, sprites, etc. 
	 * 
	 * In a real game you might create higher quality 
	 * objects. 
     */
	var GraphicEngine = {
		
		groundPosition:  {
			dest: {
				x: 0,
				y: 0
			},
			src: {
				x: 0,
				y: 0
			},
			seemless: {
				x: true,
				y: true
			}
		},
		
		cloudPosition: {
			dest: {
				x: 0,
				y: 0
			},
			src: {
				x: 0,
				y: 0
			},
			seemless: {
				x: true,
				y: true
			}
		},	
		
		renderLayer: [],	
		stages: {},
		stageList: [],
		camPos: {x: 0, y: 0},
		camRect: new Rect(0,0,0,0),
		
		init: function(canvas, context, mapData, objectCallback) {
			
			//DebugGui.init();
			
			// add jTiles	
            this.canvas = canvas;
			this.context = context;
			this.mapRenderModel = new MapRenderModel();
			this.camRect.w = canvas.width;
			this.camRect.h = canvas.height;
			// buildup Layers
			var layerIndex = 0;
			for (var a = 0; a < mapData.layers.length; a++) {
				var layer = new LayerModel();
				var layerData = mapData.layers[a];				
				if (layerData.visible === false)
					continue;
				
				if (layerData.data) { // tilelayer
					layer.initialize(layerData.name, layerData.width, layerData.height,
						mapData.tilewidth, mapData.tileheight, layerData.data);					
					this.renderLayer.push({
						layerIndex: layerIndex,
						update: function() {
							GraphicEngine.tileRenderer.drawLayer(
								GraphicEngine.context,            //canvasContext
								GraphicEngine.mapRenderModel,     //MapRenderModel
								this.layerIndex,                  //layerIndex
								GraphicEngine.groundPosition
							);
						}
					});
				}
				else {
					// object layer
					var layerName = layerData.name;					
					if (layerName.indexOf(":") > -1)
					{
						var parts = layerName.split(":")
						if (parts.length === 2) {
							if (parts[1] === "obj") {
								var stage = new Fx.Stage(GraphicEngine.canvas);
                                Fx.Touch.enable(stage);
								stage.autoClear = false;
								objectCallback(stage, parts[0], layerData, a);
								this.stages[parts[0]] = stage;
								this.stageList.push(stage);
								this.renderLayer.push(stage);
							}
							else if (parts[1] === "gui") {
								var stage = new Fx.Stage(GraphicEngine.canvas);
                                Fx.Touch.enable(stage);
								stage.autoClear = false;
								objectCallback(stage, parts[0], layerData, a);
								this.stages[parts[0]] = stage;								
								this.renderLayer.push(stage);
							}
						}
					}
				}
				this.mapRenderModel.addLayer(layer);
				layerIndex++;
			}
			// buildup tilesets
			for (var b = 0; b < mapData.tilesets.length; b++) {
				var tileSet = new TileSetModel();			
				var tileSetData = mapData.tilesets[b];

				// cut relative path
				var tsImage = tileSetData.image;			
				var cutPos = tsImage.lastIndexOf("/");
				if (cutPos > -1) {
					tsImage = tsImage.substring(cutPos+1);
				}			
				console.log(tileSetData.image, "=>", tsImage);
				tileSet.initialize(tileSetData.firstgid, tileSetData.tilewidth,
					tileSetData.tileheight, "game/assets/tiles/"+tsImage,
					tileSetData.imagewidth, tileSetData.imageheight);
				this.mapRenderModel.addTileSet(tileSet);
			}
			this.tileRenderer =  new TileLayerRenderer();
		},
		
		moveCam: function(x, y) {
			this.setCam(this.camPos.x + x, this.camPos.y + y);
		},
		
		getCam: function() {
			return this.camPos;
		},
				
		getCamRect: function() {
			return this.camRect;
		},
				
		setCam: function(x, y) {
			
			this.camPos.x = x;
			this.camPos.y = y;
			this.camRect.x = x;
			this.camRect.y = y;
			
			x = Math.floor(x);
			y = Math.floor(y);
			
			this.cloudPosition.src.x = x*1.3;
			this.cloudPosition.src.y = y*1.3;
			this.groundPosition.src.x = x;
			this.groundPosition.src.y = y;
			var i=0, len=this.stageList.length;			
			for(;i<len; i++) {
				this.stageList[i].x = -x;
				this.stageList[i].y = -y;
			}						
		},
		
		draw: function() {
			for (var i=0; i<this.renderLayer.length; i++) {                
				this.renderLayer[i].update();
			}
		}
	};

	return GraphicEngine;
});