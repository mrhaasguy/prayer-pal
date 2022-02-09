import fs from "fs";

const result = require("dotenv").config();
if (result.error) {
  console.error(result.error);
}

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

/**
 * Returns a random number between 0 (inclusive) and max (exclusive)
 */
export function random(max: number) {
  return Math.floor(Math.random() * max);
}
export function takeRandom<T>(array: T[], count: number): T[] {
  let results: T[] = [];
  for (let i = 0; i < count; i += 1) {
    let index = random(array.length);
    results.push(...array.splice(index, 1));
  }
  return results;
}

export async function asyncForEach(
  array: any[],
  callback: (a: any) => Promise<void>
) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index]);
  }
}
