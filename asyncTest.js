/* eslint-disable no-restricted-syntax */
const fs = require('fs').promises;
const path = require('path');

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

// 対象ディレクトリ内の全てのファイルを取得する関数
const getAllFiles = async (directoryPath, array) => {
  const dirName = path.basename(directoryPath);
  const innerDirFiles = await fs.readdir(directoryPath, { withFileTypes: true });
  array.push({ dir: dirName, files: innerDirFiles.map((file) => file.name) });
  // console.log(innerDirFiles);
  const dirOnly = checkDir(innerDirFiles);
  // 対象ディレクトリ内にディレクトリがなかった時は終了
  if (dirOnly.length === 0) {
    return;
  }
  for (const dir of dirOnly) {
    // console.log(dir.name);
    const newDirPath = `${directoryPath}/${dir.name}`;
    await getAllFiles(newDirPath, array);
  }
};

const AllFiles = [];

(async () => {
  await getAllFiles(dirPath, AllFiles);
  console.log(AllFiles);
})();
