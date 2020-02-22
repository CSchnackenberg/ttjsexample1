/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2020, Christoph Schnackenberg <bluechs@gmx.de>
 *
 * Released under the MIT license
 * https://github.com/CSchnackenberg/TTjs/blob/develop/LICENSE
 */
var fs = require('fs');
var git = require('git-rev-sync');


function updateBuildNumber(isProd, cb) {
    const versionData = JSON.parse(fs.readFileSync('version.json', 'utf8'));
    if (versionData) {


        versionData.counter++;
        const now = new Date();
        const yy = (""+(now.getFullYear())).substring(2); // 2019 => 19
        const yy2 = (""+((now.getFullYear()-2018))); // 2019 => 1
        const m = now.getMonth()+1;
        const mm = ""+(m < 10 ? "0" : "") + m;
        const d = now.getDay()+1;
        const dd = ""+(d < 10 ? "0" : "") + d;
        const h = now.getHours();
        const hh = ""+(h < 10 ? "0" : "") + h;
        const mi = now.getMinutes();
        const min = ""+(mi < 10 ? "0" : "") + mi;
        const s = Math.floor(now.getSeconds() / 10);
        const ss = ""+s;

        // 2147483647  << MAX Integer (signed)
        //
        //  109071327  << Example
        // YYMMDDHHKK  << Build ID parts
        //
        // YY = year - 2018 => 2019 = 1 => 20 Jahre stabil
        // MM = Monat => 01 = Januar
        // DD = Tag
        // HH = Stunde
        // KK = Minute
        //
        // 2112312359  << MAX Number => Date: 2039.12.31 23:59 (fair enough)

        let finalVersion = `${versionData.main}.${yy}${mm}.${dd}${hh}`;
        let bundleStr = `${yy2}${mm}${dd}${hh}${mi}`;
        let bundle = Number(bundleStr);
        versionData.ver = finalVersion;
        versionData.time = now.getTime();
        versionData.git = git.short();
        versionData.branch = git.branch();
        versionData.bundle = bundle;
        versionData.dev = isProd ? false: true;
        fs.writeFile('version.json', JSON.stringify(versionData, null, 2), function(err) {
            if (err) {
                console.error(err);
                cb(err);
            }
            else {
                cb();
            }
        });
    }


}


exports.updateBuildNumber = updateBuildNumber;
