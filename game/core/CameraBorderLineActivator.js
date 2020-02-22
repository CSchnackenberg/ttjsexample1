/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2020, Christoph Schnackenberg <bluechs@gmx.de>
 *
 * Released under the MIT license
 * https://github.com/CSchnackenberg/TTjs/blob/develop/LICENSE
 *
 */
define([
	'ttjs/util/TTTools',
    'ttjs/entity/BaseEntityActivator',
	'game/core/GraphicEngine'
], 
function(
	env,
	BaseEntityActivator,
	GraphicEngine
) {
	
	/** @class Allows entity activation by a given radius */
	var CameraBorderLineActivator = function()
	{  


		/** @param {Entity} entity activates the entity */
		this.check = function(entity) {
			if (entity.props.alwaysActive)
				return true;

			if (entity.props.manualActivation) {
				return entity.props.active;
			}

			if (!entity.props.anchor) {
				console.error("Found entity without Anchor. Disposed!");
				entity.dispose();
				return false;
			}

			const yy = GraphicEngine.camRect.y + GraphicEngine.camRect.h;

			if (yy < entity.props.anchor.y)
				return false;


			return true;
		};
	};

	env.inherits(CameraBorderLineActivator, BaseEntityActivator);	
	return CameraBorderLineActivator;
});