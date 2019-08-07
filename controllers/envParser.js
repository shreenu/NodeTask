const fs = require('fs');
const path = require('path');
const readline = require('readline');

const processFolderPath = path.normalize(
  path.join(__dirname, '../', 'Program Files'),
);

/**
 *
 * @param {String} processName
 *
 * to parse .env file by taking process folder path
 * @returns Promise
 */

function parseDotENV(processName) {
  return new Promise((resolve, reject) => {
    try {
      const processEnvPath = path.join(
        processFolderPath,
        processName,
        '.env',
      );
      if (
        fs.existsSync(
          path.join(processFolderPath, processName, '.env'),
        )
      ) {
        const envObject = {};
        const readInterface = readline.createInterface({
          input: fs.createReadStream(processEnvPath),
        });

        readInterface.on('line', line => {
          if (line.length > 0) {
            const values = line.split('=');
            envObject[values[0]] = values[1];
          }
        });

        readInterface.on('close', () => {
          resolve(envObject);
        });
        readInterface.on('error', () => {
          resolve(false);
        });
      } else {
        resolve(false);
      }
    } catch (err) {
      reject(err);
    }
  });
}

/**
 *
 * @param {String} process process folder path
 * @param {String} key .env config param key name to edit value
 * @param {String} value .env config param value to edit
 *
 * to edit .env file with process, key and value
 *
 */
function editDotEnvFile(process, key, value) {
  return new Promise((resolve, reject) => {
    try {
      const evnObjectProm = parseDotENV(process);
      const processEnvPath = path.join(
        processFolderPath,
        process,
        '.env',
      );
      evnObjectProm.then(
        data => {
          if (data !== false) {
            if (data[key] !== undefined) {
              data[key] = value;
              // uncomment below line to adding new config params
              // else data[key] = value;
              let fileContent = '';
              for (var paramName in data) {
                fileContent += `${paramName}=${data[paramName]}
`;
              }
              fs.writeFile(
                processEnvPath,
                fileContent,
                'utf8',
                error => {
                  if (error) reject(error);
                  resolve(true);
                },
              );
            } else resolve(false);
          } else resolve(false);
        },
        error => {
          reject(error);
        },
      );
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * serves /getEnvironment/:process  API to get the .env file information in JSON format
 * */
exports.getEnvironment = (req, res) => {
  const evnObjectProm = parseDotENV(req.params.process);
  evnObjectProm.then(
    evnObject => {
      if (evnObject) res.send(evnObject);
      else res.status(404).send('Process not found');
    },
    error => {
      res.status(500).send('Internal server error');
    },
  );
};

/**
 * serves /setEnvironment/:process/:key/:value  API to edit the .env file
 */
exports.setEnvironment = (req, res) => {
  editDotEnvFile(
    req.params.process,
    req.params.key,
    req.params.value,
  ).then(
    data => {
      let respData = {};
      if (data) respData[req.params.key] = req.params.value;
      else respData = { status: false, message: 'file not updated' };
      res.send(respData);
    },
    error => {
      res.status(500).send('Internal server error');
    },
  );
};

/**
 * to get the list process
 */
exports.getList = (req, res) => {
  const dirNames = fs
    .readdirSync(processFolderPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  res.send({ list: dirNames });
};
