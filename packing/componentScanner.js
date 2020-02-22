/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2020, Christoph Schnackenberg <bluechs@gmx.de>
 *
 * Released under the MIT license
 * https://github.com/CSchnackenberg/TTjs/blob/develop/LICENSE
 */
require("amd-loader");


/**
 * The do-everything-in-one-function solution. ugly - but one step after another.
 *
 * Creates a file that requires all referenced components and the main function
 *
 * Scans for scene-desc files and determines the objects in it.
 * @param cb
 */
function writeComponentList(opts, cb) {



    const SCREEN_DIR_REQ = "./game/assets/screens/";
    const SCREEN_DIR = "./game/assets/screens/";
    const CMP_DIR = "./game/components/";
    const CMP_DIR_REQ = "./game/components/";
    const OUT_FILE = "./dist/build_src/mainWithCmps.js";





    const fs = require("fs")

    const objectFiles = [];

    fs.readdirSync(SCREEN_DIR).forEach(file => {
        console.log(file);
        if (file.indexOf("Objects") >= 0) {
            objectFiles.push(file);
        }
    });


    const requiredComponents = {};
    const needCmp = (cmpName) => {

        const finalFile = `${CMP_DIR}${cmpName}.js`;
        if (!fs.existsSync(finalFile)) {
            console.error("skipped file:", finalFile, "does not exist!");
            return;
        }

        if (requiredComponents[cmpName]) {
            requiredComponents[cmpName]++;
        }
        else {
            requiredComponents[cmpName] = 1;
        }
    }


    const processObjectDesc = (name, content) => {

        if (!content) {
            console.error("Cannot parse", name, "It is empty");
            return;
        }

        if (content._tags && content._tags.find(tag => tag == "debug")) {
            return;
        }

        Object.keys(content).forEach(k => (content[k].components ? content[k].components.forEach(c => needCmp(c)) : null ));
    }




    objectFiles.forEach((n) => processObjectDesc(n, require('./../' + SCREEN_DIR_REQ + n)));

    console.log(requiredComponents);

    const importList = [];
    const checkList = [];
    const cmpNameList = [];
    Object.keys(requiredComponents).forEach(cmpName => {
        importList.push(`\n\t'${CMP_DIR_REQ}${cmpName}'`);
        //checkList.push(`if (!${cmpName}) console.error("Error loading component: ${cmpName}. Circular dependency?");\n`);
        cmpNameList.push(`\n\t${cmpName}`);
    });
    importList.push(`\n\t'./main'`);
    cmpNameList.push(`\n\tmain`)

    const importListStr = JSON.stringify(importList);

    const outFile = `// AUTO GENERATED :-)
// Needed to allow packer to consider this files
define([${importList}
], function(${cmpNameList}
) {
    ${checkList.reduce((a, b) => a + "" + b, "")}        
    
    console.log("---------------------------------> should not be called!");
});
    `;


    fs.writeFile(OUT_FILE, outFile, 'utf8',function(err) {
        if(err) {
            console.log(err);
            cb(err);
        }
        else {
            cb();
        }
    });
}

exports.writeComponentList = writeComponentList;






