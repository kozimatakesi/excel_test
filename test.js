const fs = require('fs').promises;

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
const getAllFiles = async (directoryPath) => {
  const innerDirFiles = await fs.readdir(directoryPath, { withFileTypes: true });
  const dirOnly = checkDir(innerDirFiles);
  // 対象ディレクトリ内にディレクトリがなかった時は終了
  if (dirOnly.length === 0) {
    return;
  }
  for (const dir of dirOnly) {
    console.log(dir.name);
    const innerInnerDirFiles = await fs.readdir(`${directoryPath}/${dir.name}`, { withFileTypes: true });
    console.log(innerInnerDirFiles);
    const newDirPath = `${directoryPath}/${dir.name}`;
    await getAllFiles(newDirPath);
  }
};

getAllFiles(dirPath);
