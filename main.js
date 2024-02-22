const path = require("path");
/*
 * Project: Milestone 1
 * File Name: main.js
 * Description:
 *
 * Created Date:
 * Author:
 *
 */

const IOhandler = require("./IOhandler");
const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");
const pathProcessed = path.join(__dirname, "grayscaled");
const pathProcessed1 = path.join(__dirname, "sepia");


const main = async () =>{
    try{
        await IOhandler.unzip(zipFilePath, pathUnzipped)
        const files = await IOhandler.readDir(pathUnzipped)
        IOhandler.grayScale(files, pathProcessed)
        IOhandler.sepia(files, pathProcessed1)
    } catch (error){
        console.error(error)
    }
}
main()
