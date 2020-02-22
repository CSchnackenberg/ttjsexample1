/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2020, Christoph Schnackenberg <bluechs@gmx.de>
 *
 * Released under the MIT license
 * https://github.com/CSchnackenberg/TTjs/blob/develop/LICENSE
 *
 * Example game class that manages it all
 */
define([
	
	'ttjs/entity/EntityDefinitionParserJson',
	'ttjs/entity/ComponentManager',
    'ttjs/entity/EntityInstance',
    'ttjs/entity/EntityFactory',	
	'ttjs/entity/EntityManager',	
	'ttjs/entity/ResourceManager',
	'ttjs/entity/resources/ImageResources',
	'ttjs/entity/resources/TextResources',
	
	'game/core/RadiusEntityActivator',
	
	'ttjs/engine/map/tiled/LayerModel',
    'ttjs/engine/map/tiled/MapRenderModel',
    'ttjs/engine/map/tiled/TileSetModel',
	'game/core/Music',
	'game/core/GraphicEngine',

	'game/res/FxSpriteResources',
	'game/res/BitmapFontResources',
	'game/core/CameraBorderLineActivator',

	'game/core/DebugOptions',

	'game/assets/screens/screen1_conf',

    'jquery',

    'ttjs/util/TTTools',
	
], function(
	
	EntityDefinitionParserJson,
	ComponentManager,
	EntityInstance,
	EntityFactory,
	EntityManager,
	ResourceManager,
	ImageResources,
	TextResources,
	
	RadiusEntityActivator,
	
	LayerModel,
	MapRenderModel,
	TileSetModel,
	Music,
	GraphicEngine,

	FxSpriteResources,
	BitmapFontResources,
	CameraBorderLineActivator,

	DebugOptions,

	screen1,

    $,

    env

) {
    "use strict";



	const debugZoomSteps = [
		0.1,
		0.25,
		0.5,
		0.75,
		-1,
	];

	const screens = {
	    "screen1": screen1,
    };


	const Game = {
		
		music: new Music(),
		screenTime: 0,
		debugZoomIndex: debugZoomSteps.length-1,
		
		init: function(canvas, context) {
            let startScene = DebugOptions.getPropWithDefault("startScene", "screen1");

			this.canvas = canvas;
			this.context = context;			
			this.state = "loading";
			this.setupEngine();
			this.setupDebugFunctions();
			this.load(startScene);
		},

		setupDebugFunctions: function() {
		    if (!DebugOptions.getPropWithDefault("disableDebugKeys", false)) {
                window.addEventListener('keyup', e => {
                    switch(e.key) {
                        case '0':
                            this.debugZoomIndex = debugZoomSteps.length-1;
                            GraphicEngine.setDebugZoom(this.debugZoomIndex);
                            break;
                        case '+':
                            this.debugZoomIndex++;
                            if (this.debugZoomIndex > debugZoomSteps.length-1)
                                this.debugZoomIndex = debugZoomSteps.length-1;
                            GraphicEngine.setDebugZoom(debugZoomSteps[this.debugZoomIndex]);
                            break;
                        case '-':
                            this.debugZoomIndex--;
                            if (this.debugZoomIndex < 0)
                                this.debugZoomIndex = 0;
                            GraphicEngine.setDebugZoom(debugZoomSteps[this.debugZoomIndex]);
                            break;
                    }
                });
            }
		},

		setupEngine: function() {

			ComponentManager.pathPrefix = "game/components/";

			const resources = new ResourceManager();
			resources.addManager(new ImageResources());
			resources.addManager(new TextResources());
			resources.addManager(new FxSpriteResources());
			resources.addManager(new BitmapFontResources());

			this.resources = resources;
			// GraphicEngine.init(
			// 	this.canvas,
			// 	this.context);
		},

		load: function(scene) {
		    const newScene = screens[scene];
		    if (newScene)
		        this.currentScene = newScene;
		    else
		        console.error("cannot find scene", scene);
			this.reload();
		},

		reload: function() {

			this.debugZoomIndex = debugZoomSteps.length-1;
			if (this.manager) {
				this.state = "resetting";
				setTimeout(() => { // make sure we not in a mouse up context or something
					this.manager.reset(() => {
						setTimeout(() => {
							GraphicEngine.reset();
							CollisionEngine.clear();
							this.state = "loading";
							this.initObjects();

						}, 0);
					});
				}, 0);
			}
			else {
				this.state = "loading";
				if (this.currentScene.mapFile)
				    this.loadmap(this.currentScene.mapFile)
                else
				    this.initObjects();
			}
		},

        loadmap: function(file) {
            $.getJSON(file, { "noCache": "true" }) // TODO disable cache
                .done(json => {
                    this.initmap(json);
                })
                .fail(() => {
                    this.state = "failed";
                });
        },

        initmap: function(jsonMap) {
            const objects = [];
            GraphicEngine.init(this.canvas, this.context, jsonMap,
                function(stage, name, layer, index) {
                    var i=0, len = layer.objects.length;
                    for (; i<len; i++) {
                        var objData = layer.objects[i];
                        var parts = objData.name.split(":");
                        if (parts.length === 2) {
                            console.log(objData);
                            var spatial = {
                                x: objData.x,
                                y: objData.y,
                                w: objData.width,
                                h: objData.height,
                                type: "rect"
                            };
                            if (objData.ellipse)
                                spatial.type = "circle";
                            var propData = env.combineObjects(objData.properties, {"stage": stage, "stageName": name});
                            var instance = new EntityInstance(
                                parts[0],
                                parts[1],
                                spatial,
                                propData
                            );
                            objects.push(instance);
                        }
                    }
                }
            );

            setTimeout(() => this.initObjects(objects));
        },

		initObjects: function(existingStaticObjects) {

			const entityDefinitions = this.currentScene.objects;
			const activatorClass = this.currentScene.activator || CameraBorderLineActivator;

			if (entityDefinitions["_tags"]) // drop tags, if exists
			    delete entityDefinitions["_tags"];

			// eject instances
			const definitions = {};
			const staticObjects = [...existingStaticObjects];
			for (let i of Object.keys(entityDefinitions)) {
				if (i === "Instances") {
					const staticObjectList = entityDefinitions[i];
					for (let staticObject of staticObjectList) {

						// we allow two kinds of placements: just a name
						// or we also accept an object with spatial data
						if (typeof staticObject == 'string') {
							staticObjects.push(new EntityInstance(
								"Static" + staticObject,
								staticObject,
								{x: 0, y: 0, w: 1, h: 1},
								{}
							));
						}
						else {
							if (staticObject.type) {
								staticObjects.push(new EntityInstance(
									staticObject.name||("Static"+staticObject.type),
									staticObject.type,
									staticObject.spatial||{x: 0, y: 0, w: 1, h: 1},
									staticObject.props||{}
								));
							}
						}
					}
				}
				else {
					definitions[i] = entityDefinitions[i];
				}
			}

			// 1) component manager
			var parser = new EntityDefinitionParserJson();
			parser.addSource(definitions);
			var defs = parser.getEntityDefinition();
			// 2) parse definitions
			var factory = new EntityFactory(this.resources);
			factory.addDefinitions(defs);
			// 3) spatial entity activator
			var activator = new activatorClass();
			// 4) create manager
			var manager = new EntityManager(activator, factory);
			this.manager = manager;


			// per default we put everything in here
			if (this.currentScene.renderLayer) {
				for (let layer of this.currentScene.renderLayer) {
					GraphicEngine.addGameLayer(layer);
				}
			}
			if (this.currentScene.guiLayer) {
				for (let layer of this.currentScene.guiLayer) {
					GraphicEngine.addGuiLayer(layer);
				}
			}
			GraphicEngine.clearColor = this.currentScene.loadingColor || this.currentScene.clearColor;

			// let's start with the start objects
			manager.injectEntity(staticObjects, (created) => {
				GraphicEngine.clearColor = this.currentScene.clearColor;
				console.log("runable objects: ", created);
				Game.state = "run";
				Game.screenTime = 0;  // time in screen
				manager.firstUpdate();
			});
		},

		
		update: function(elapsed) {
			switch(this.state) {
				case "loading":
					this.updateLoading();
					break;
				case "resetting":
					console.log("resetting...");
					break;
				case "run":
					this.updateRun(elapsed);
					break;
				case "failed":
					return "Error in demo";
			}
		},
		
		updateLoading: function() {
			//console.log("loading...");
		},

		openWebsite: function(www) {

		    if (window.cordova) {
		        window.open(www, "_system");
            }
		    else {
                alert("open website: " + www);
            }
		},
		updateRun: function(elapsed) {

		    try {
                this.manager.update(elapsed);
                //GraphicEngine.tick(elapsed);
            }
            catch(error) {
		        console.error(error);
            }
			Game.screenTime += elapsed;
		}
	};

	return Game;
});