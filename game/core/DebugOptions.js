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
], 
function(
) {
	"use strict";

	/**
	 * http://localhost:5000#ttjsdb=${JSON}
	 *
	 * * example:
	 * http://localhost:5000#ttjsdb=testItem:true
	 *
	 * Translates to:
	 * {
	 *     testItem: true
	 * }
	 *
	 * * example:
	 * http://localhost:5000#ttjsdb=testItem:true, abc="yes"
	 *
	 * Translates to:
	 * {
	 *     testItem: true
	 *     abc: "yes"
	 * }
	 *
	 * * example:
	 * http://localhost:5000#ttjsdb=testItem:true, select=['abc', 'efg']"
	 *
	 * Translates to:
	 * {
	 *     testItem: true
	 *     select: [
	 *         'abc',
	 *         'efg'
	 *     ]
	 * }
	 *
	 *
	 * You don't need to set this. If you do
	 *
	 */
	const DebugOptions = {
		props: {}
	};
	const DEBUG_HASH = "#ttjsdb=";

	DebugOptions.getPropWithDefault = (key, def) => {
		const val = DebugOptions.props[key];
		return typeof val == 'undefined' ? def : val;
	};

	DebugOptions.isEmpty = () => {
		return Object.keys(DebugOptions.props).length <= 0;
	};

	DebugOptions.hasFlag = (flag) => {
		const flags = DebugOptions.getPropWithDefault("flags", null);
		if (!flags)
			return false;
		for (let i=0; i<flags.length; i++)
			if (flags[i] == flag)
				return true;

		return false;
	};

	DebugOptions.parse = (rawData) => {
		if (!rawData)
			return;

		const jsonStr = rawData.indexOf(DEBUG_HASH) == 0 ? "{ " + rawData.substring(DEBUG_HASH.length) + " }" : "";
		if (!jsonStr)
			return;

		console.log("----------------> ", jsonStr);
		try {
			const json = JSON.parse(jsonStr);
			if (typeof json.length == 'number') {
				alert("Invalid debug string. Must not be an array!");
				return;
			}
			DebugOptions.props = json;
		}
		catch(x) {
			alert("Error parsing debug string");
		}
	};

	DebugOptions.parseHash = () => {
		DebugOptions.parse(decodeURIComponent(window.location.hash));
	};

	// initial parsing is based on the hash
	DebugOptions.parseHash();
	return DebugOptions;
});