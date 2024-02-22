/*
 * Project: Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date:
 * Author:
 *
 */


  
const yauzl = require('yauzl-promise'),
  fs = require('fs'),
  PNG = require("pngjs").PNG,
  path = require("path"),
  {pipeline} = require('stream/promises');

/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
const unzip =  async (pathIn, pathOut) => {
  const zip = await yauzl.open(pathIn);
  try {
    for await (const entry of zip) {
      if (entry.filename.endsWith('/')) {
        await fs.promises.mkdir(`${pathOut}/${entry.filename}`, {recursive: true});
      } else {
        const readStream = await entry.openReadStream();
        const writeStream = fs.createWriteStream(
          `${pathOut}/${entry.filename}`
          
        );
        await pipeline(readStream, writeStream);
      }
    }
  } finally {
    await zip.close();
  }
  
};

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
const readDir = (dir) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) {
        reject(err);
      } else {
        let pngFiles = [];
        files.forEach((file) => {
          if (file.endsWith(".png")) {
            pngFiles.push(path.join(dir, file));
          }
        });
        resolve(pngFiles);
      }
    });
  });
};
//exclude everything that is not a png file

/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */

const grayScale = (pathIn, pathOut) => {
  let allFiles = pathIn;
  return new Promise((resolve, reject) => {
    allFiles.forEach((file) => {
      fs.createReadStream(file)
        .pipe(new PNG(
          {
            filterType: 4
          }
        ))
        .on("parsed", function () {
          for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
              const idx = (this.width * y + x) << 2;
              const avg = (this.data[idx] + this.data[idx + 1] + this.data[idx + 2]) / 3;
              this.data[idx] = avg;
              this.data[idx + 1] = avg;
              this.data[idx + 2] = avg;
            }
          }
          console.log(file)
          let fileArr = file.split("\\");
          this.pack().pipe(fs.createWriteStream(`${pathOut}/${fileArr.slice(-1).pop()}`));
          resolve();
        });
          
    });   
  });
};
const sepia = (pathIn, pathOut) => {
  let allFiles = pathIn;
  return new Promise((resolve, reject) => {
    allFiles.forEach((file) => {
      fs.createReadStream(file)
        .pipe(new PNG(
          {
            filterType: 4
          }
        ))
        .on("parsed", function () {
          for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
              const idx = (this.width * y + x) << 2;
              const r = this.data[idx];
              const g = this.data[idx + 1];
              const b = this.data[idx + 2];
              this.data[idx] = Math.min(255, (0.393 * r + 0.769 * g + 0.189 * b));
              this.data[idx + 1] = Math.min(255, (0.349 * r + 0.686 * g + 0.168 * b));
              this.data[idx + 2] = Math.min(255, (0.272 * r + 0.534 * g + 0.131 * b));
            }
          }
          
          fileArr = file.split("\\");
          this.pack().pipe(fs.createWriteStream(`${pathOut}/${fileArr.slice(-1).pop()}`));
          resolve();
        });
        
    });
  });  
};
//read in the png file, and write grayscale image out to grayscaled folder


module.exports = {
  unzip,
  readDir,
  grayScale,
  sepia
};
