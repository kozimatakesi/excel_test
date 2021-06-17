/* eslint-disable no-restricted-syntax */
const fs = require('fs').promises;
const path = require('path');
const xlsx = require('xlsx');

const xutil = xlsx.utils;

const dirPath = '/Users/kawamoto/Desktop/20210612_SB関東';
// ディレクトリの中でディレクトリのものだけを返す関数
const checkDir = (array) => {
  const newArray = [];
  for (const i of array) {
    if (i.isDirectory()) {
      newArray.push(i);
    }
  }
  return newArray;
};

const AllFiles = [];

// 対象ディレクトリ内の全てのファイルを取得する関数
const getAllFiles = async (directoryPath) => {
  const dirName = path.basename(directoryPath);
  const innerDirFiles = await fs.readdir(directoryPath, { withFileTypes: true });
  for (const file of innerDirFiles) {
    if (file.isFile()) {
      const stats = await fs.stat(`${directoryPath}/${file.name}`);
      AllFiles.push({
        dir: dirName,
        name: file.name,
        size: stats.size,
        date: stats.mtime.toLocaleDateString(),
        time: stats.mtime.toLocaleTimeString(),
      });
    }
  }
  const dirOnly = checkDir(innerDirFiles);
  // 対象ディレクトリ内にディレクトリがなかった時は終了
  if (dirOnly.length === 0) {
    return;
  }
  for (const dir of dirOnly) {
    const newDirPath = `${directoryPath}/${dir.name}`;
    await getAllFiles(newDirPath);
  }
};

const forExcel = [['フォルダ名', 'ファイル名', 'ファイルサイズ', '更新日', '開始時間', '更新時間']];
(async () => {
  await getAllFiles(dirPath);
  for (const file of AllFiles) {
    if (file.name != '.DS_Store') {
      const checkTime = file.name.match(/_\d{6}/);
      let startTime = '';
      if (checkTime) {
        const time = checkTime[0].slice(1);
        const hour = time.slice(0, 2);
        const min = time.slice(2, 4);
        const sec = time.slice(4);
        startTime = `${hour}:${min}:${sec}`;
      }
      forExcel.push([file.dir, file.name, `${file.size}byte`, file.date, startTime, file.time]);
    }
  }
  console.log(forExcel);
  const wb = xutil.book_new();
  const ws = xutil.aoa_to_sheet(forExcel);
  const wsName = path.basename(dirPath);
  xutil.book_append_sheet(wb, ws, wsName);
  xlsx.writeFile(wb, `${path.basename(dirPath)}.xls`);
})();
