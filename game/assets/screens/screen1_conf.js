define([
    'game/assets/screens/screen1_objs',
],
function(
    gameObjects

) {
    "use strict";

    return  {
        objects: gameObjects,
        collisionLayer: [],
        renderLayer: [],
        guiLayer: [],
        mapFile: "game/assets/map1.json",
        clearColor: "#302e5e",
    };
});
