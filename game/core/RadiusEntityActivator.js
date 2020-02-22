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
	'game/core/ActivationCircle'
], 
function(
	env,
	BaseEntityActivator,
	ActivationCircle
) {
	
	/** @class Allows entity activation by a given radius */
	var RadiusEntityActivator = function()
	{  
		/** */
		this.activeRadius = new ActivationCircle(0, 0, 100);

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
			return this.activeRadius.collides(entity.params.anchor);
		};
	};

	env.inherits(RadiusEntityActivator, BaseEntityActivator);	
	return RadiusEntityActivator;
});