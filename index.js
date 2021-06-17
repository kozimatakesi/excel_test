const xlsx = require('xlsx');
const fs = require('fs').promises;

const xutil = xlsx.utils;

// ファイルの中でディレクトリのものだけを返す関数
const checkDir = (array) => {
  const newArray = [];
  for (const i of array) {
    if (i.isDirectory()) {
      newArray.push(i);
    }
  }
  return newArray;
};

const xlsxTest = async () => {
  try {
    const d = [['あ', 'い', 'う'], ['え', 'お']];
    const wb = xutil.book_new();
    const ws = xutil.aoa_to_sheet(d);
    const wsName = 'テストシート';
    xutil.book_append_sheet(wb, ws, wsName);
    xlsx.writeFile(wb, 'test.xlsx');

    const newWb = xlsx.readFile('./test.xlsx');
    const dirPath = '/Users/kawamoto/Desktop/20210612_SB関東';
    const allFilesName = await fs.readdir(dirPath, { withFileTypes: true });
    console.log(allFilesName);
    const dirOnly = checkDir(allFilesName);
    /*     for (const file of dirOnly) {
      console.log(file.name);
      const newWsName = file.name;
      xlsx.utils.book_append_sheet(newWb, ws, newWsName);
      xlsx.writeFile(newWb, './test.xlsx');
      const innerDir = await fs.readdir(`${dirPath}/${file.name}`, { withFileTypes: true });
      console.log(innerDir);
      const innerDirOnly = checkDir(innerDir);
      for (const innerFile of innerDirOnly) {
        console.log(innerFile.name);
        const innerDirInfiles = await fs.readdir(`${dirPath}/${file.name}/${innerFile.name}`, { withFileTypes: true });
        console.log(innerDirInfiles);
        const innerInnerDirOnly = checkDir(innerDirInfiles);
        for (const innerInnerFile of innerInnerDirOnly) {
          console.log(innerInnerFile.name);
          const innerInnerDirInFiles = await fs.readdir(`${dirPath}/${file.name}/${innerFile.name}/${innerInnerFile.name}`, { withFileTypes: true });
          console.log(innerInnerDirInFiles);
        }
      }
    }
 */

    const dirSearchAndOpen = async (filesAndDirs, path) => {
      if (checkDir(filesAndDirs).length === 0) {
        return;
      }
      const dirsOnly = checkDir(filesAndDirs);
      for (dir of dirsOnly) {
        const innerDirFiles = await fs.readdir(`${path}/${dir}`, { withFileTypes: true });
        path = `${path}/${dir}`;
        dirSearchAndOpen(innerDirFiles, path);
      }
    };
  } catch (err) {
    console.log(err);
  }

  /*   let d = [
    ["one", "2番目", "3番目"],
    [4, 10, "https://www.yahoo.co.jp", "こんにちは"],
  ];

  let wb = xutil.book_new();
  let ws = xutil.aoa_to_sheet(d);
  let wsName = "シート1番目";

  xutil.book_append_sheet(wb, ws, wsName);
  xlsx.writeFile(wb, "test.xlsx");
 */

  /*   let wb = xlsx.readFile("../Desktop/test.ods");
  let ws = wb.Sheets[wb.SheetNames[0]];

  let d = [
    ["何だよ", "why japanese"],
    [1, "あ", "いうえぽ", "もしす"]
  ];

  xlsx.utils.sheet_add_aoa(ws, d, {origin:{r:5, c:0}});
  xlsx.writeFile(wb, "../Desktop/test.ods");
 */
};

xlsxTest();
