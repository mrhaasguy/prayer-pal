import fs from "fs";

export function fileExist(filePath: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        resolve(false);
      }
      //file exists
      resolve(true);
    });
  });
}
