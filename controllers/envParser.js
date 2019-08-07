const fs = require("fs");
const path = require("path");
const readline = require("readline");

const processFolderPath = path.normalize(path.join(__dirname, "../",'Program Files'));

exports.getEnvironment = (req, res)=>{
    const evnObjectProm = parseDotENV(req.params.process);
    evnObjectProm.then(evnObject=>{
        if(evnObject) res.send(evnObject);
        else res.status(404).send('Process not found')
    })
}

exports.setEnvironment = (req, res)=>{
    res.send(req.params);
    console.log(processFolderPath);
}

function parseDotENV(processName){
    return new Promise((resolve, reject)=>{
        const processEnvPath = path.join(processFolderPath, processName, '.env');
        if(fs.existsSync(path.join(processFolderPath, processName, '.env'))){
            const envObject = {};
            const readInterface = readline.createInterface({
                input: fs.createReadStream(processEnvPath),
                //output: process.stdout
            });

            readInterface.on('line', (line) => {
                const values = line.split('=');
                envObject[values[0]] = values[1];
            });

            readInterface.on('close', () => {
                resolve(envObject);
            });
            readInterface.on('error', () => {
                resolve(false);
            })
        }else{
            resolve(false);
        }
    });
}