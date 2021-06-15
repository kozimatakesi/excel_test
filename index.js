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
    const d = [['あ', 'い', 'う'], ['え', 'お']];
    const wb = xutil.book_new();
    const ws = xutil.aoa_to_sheet(d);
    const ws_name = 'テストシート';
    xutil.book_append_sheet(wb, ws, ws_name);
    xlsx.writeFile(wb, 'test.xlsx');

    const new_wb = xlsx.readFile('./test.xlsx');
    const dirPath = '/Users/kawamoto/Desktop/20210612_SB関東';
    const allFilesName = await fs.readdir(dirPath, { withFileTypes: true });
    console.log(allFilesName);
    const dirOnly = checkDir(allFilesName);
    for (let i = 0; i < dirOnly.length; i++) {
      console.log(dirOnly[i].name);
      const new_ws_name = dirOnly[i].name;
      xlsx.utils.book_append_sheet(new_wb, ws, new_ws_name);
      xlsx.writeFile(new_wb, './test.xlsx');

      const innerDir = await fs.readdir(`${dirPath}/${dirOnly[i].name}`, { withFileTypes: true });
      console.log(innerDir);
      const innerDirOnly = checkDir(innerDir);
      for (let j = 0; j < innerDirOnly.length; j++) {
        console.log(innerDirOnly[j].name);
        const innerDirInfiles = await fs.readdir(`${dirPath}/${dirOnly[i].name}/${innerDirOnly[j].name}`, { withFileTypes: true });
        console.log(innerDirInfiles);
        const innerInnerDirOnly = checkDir(innerDirInfiles);
        for (let k = 0; k < innerInnerDirOnly.length; k++) {
          console.log(innerInnerDirOnly[k].name);
          const innerInnerDirInFiles = await fs.readdir(`${dirPath}/${dirOnly[i].name}/${innerDirOnly[j].name}/${innerInnerDirOnly[k].name}`, { withFileTypes: true });
          console.log(innerInnerDirInFiles);
        }
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
