const xlsx = require('xlsx');
const fs = require('fs').promises;

const xutil = xlsx.utils;

// ファイルの中でディレクトリのものだけを返す関数
const checkDir = (array) => {
  const newArray = [];
  for (let i = 0; i < array.length; i++) {
    if (array[i].isDirectory()) {
      newArray.push(array[i]);
    }
  }
  return newArray;
};

const xlsxTest = async () => {
  try {
    const dirPath = '/Users/kawamoto/Desktop/20210612_SB関東';
    const allFilesName = await fs.readdir(dirPath, { withFileTypes: true });
    console.log(allFilesName);
    const dirOnly = checkDir(allFilesName);
    for (let i = 0; i < dirOnly.length; i++) {
      console.log(dirOnly[i].name);
      const innerDir = await fs.readdir(`${dirPath}/${dirOnly[i].name}`, { withFileTypes: true });
      console.log(innerDir);
      const innerDirOnly = checkDir(innerDir);
      for (let j = 0; j < innerDirOnly.length; j++) {
        console.log(innerDirOnly[j].name);
        const innerDirInfiles = await fs.readdir(`${dirPath}/${dirOnly[i].name}/${innerDirOnly[j].name}`, { withFileTypes: true });
        console.log(innerDirInfiles);
      }
    }
  } catch (err) {
    console.log(err);
  }

  /*   let d = [
    ["one", "2番目", "3番目"],
    [4, 10, "https://www.yahoo.co.jp", "こんにちは"],
  ];

  let wb = xutil.book_new();
  let ws = xutil.aoa_to_sheet(d);
  let ws_name = "シート1番目";

  xutil.book_append_sheet(wb, ws, ws_name);
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
