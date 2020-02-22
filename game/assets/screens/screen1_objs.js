define([], function() {
    return {

		Instances: [
            "MouseRouter",
            "CameraController",
            "SpriteSorter"
		],



        CameraController: {
            components: [
                "AlwaysActive",
                "FollowCamera"
            ]
        },

        SpriteSorter: {
		    components: [
		        "AlwaysActive",
                "SpriteSorter"
            ],
            properties: {
		        sortLayer: "cows"
            }
        },


        EntityParent: {
            components: [
                "FxNode",
                "AlwaysActive",
                "DebugShape",
                "ClickToKill",
                "FollowMouse"
            ],
            properties: {
                abc: "abc",
                gaga: "haha",
                wink: true,
                finger: "X"
            }
        },

        MouseRouter: {
            components: [
                "SendMouseEvents",
                "AlwaysActive"
            ]
        },

        Entity1: {
            parent: "EntityParent",
            properties: {
                vv: 4711,
                inno: "true",
                name: "Ronda",
                numFireblob: 23,
                direction: 100,
                brakePower: 5.1,
                magicNumber: 2,
                spriteAnim: "xxx/url.png"
            }
        },


        Figure: {
            components: [
                "FxNode",
                "Sprite",
                "AlwaysActive",
                "ShadowSprite",
                "ClickNode",
                "FigureAi",
                "Pointer"
            ],
            properties: {
                shadowOffset: {
                    x: 3,
                    y: 3
                }
            }
        }

		
    };
});
