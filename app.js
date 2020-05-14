'use strict';
/**
 * 「2010 年から 2015 年にかけて 15〜19 歳の人が増えた割合の都道府県ランキング」
*/

// 1. ファイルからデータを読み取る
const fs = require('fs');
const readline = require('readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ input: rs, output: {} });
const prefectureDataMap = new Map();    // key: 都道府県 value: 集計データのオブジェクト

rl.on('line', lineString => {
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefecture = columns[1];
    const popu = parseInt(columns[3]);
    // 2. 2010 年と 2015 年のデータを選ぶ
    if (year === 2010 || year === 2015) {
        let value = prefectureDataMap.get(prefecture);
        if (!value) {
            value = {
                popu10: 0,
                popu15: 0,
                change: null
            };
        }
        if (year === 2010) {
            value.popu10 = popu;
        }
        if (year === 2015) {
            value.popu15 = popu;
        }
        prefectureDataMap.set(prefecture, value);
    }
});

rl.on('close', () => {
    // 3. 都道府県ごとの変化率を計算する
    for (let [key, value] of prefectureDataMap) {
        value.change = value.popu15 / value.popu10;
    }
    // 4. 変化率ごとに並べる
    const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
        return pair2[1].change - pair1[1].change;
    });
    // 5. 並べられたものを表示する
    const rankingStrings = rankingArray.map(([key, value]) => {
        return (key + ': ' + value.popu10 + ' => ' + value.popu15 + ' 変化率: ' + value.change);
    });
    console.log(rankingStrings);
});
