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
    'ttjs/entity/ComponentManager'
], function(
    ComponentManager
) {
	"use strict";
    function AlwaysActive() {};

    AlwaysActive.requires = {
        need: {},
        opt:  {},
        cmps: [],    
        res: function(prop) {},
		children: function(prop) {}
    };	
	
    AlwaysActive.prototype = {      
        onInit: function(entity) {
			entity.props.alwaysActive = true;			
        },
        onActivate: function(entity) { 
        },                
        onUpdate: function(entity, time) {    
			
        },
        onDeactivate: function(entity) {
        }        
    };
        
	ComponentManager.registerComponentClass("AlwaysActive", AlwaysActive);
});
