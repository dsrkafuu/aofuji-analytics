const path = require('path');
const fs = require('fs');
const zlib = require('zlib');
const tar = require('tar');
const https = require('https');

/**
 * build geo database to `api/assets/geolite`
 */
async function buildGeoLite() {
  // init geolite database url
  let url =
    'https://cdn.jsdelivr.net/gh/GitSquared/node-geolite2-redist@master/redist/GeoLite2-Country.tar.gz';
  if (process.env.MAXMIND_LICENSE_KEY) {
    url =
      'https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-Country&license_key=' +
      process.env.MAXMIND_LICENSE_KEY +
      '&suffix=tar.gz';
  }

  // file infos
  const folder = path.resolve(__dirname, '../api/assets');
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }
  const zippedFile = path.join(folder, 'GeoLite2-Country.tar.gz');

  // fetch database from remote
  await new Promise((resolve, reject) => {
    // file write stream
    const zippedFileStream = fs.createWriteStream(zippedFile);
    zippedFileStream.on('finish', () => {
      resolve();
    });
    // https request
    const request = https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error('failed to fetch geo database'));
      }
      response.pipe(zippedFileStream);
    });
    // error handler
    const handleFailure = () => {
      fs.unlinkSync(zippedFile);
      reject(new Error('failed to write geo database file'));
    };
    zippedFileStream.on('error', handleFailure);
    request.on('error', handleFailure);
  });
  if (!fs.existsSync(zippedFile)) {
    throw new Error('failed to fetch geo database');
  }

  // extract file
  await new Promise((resolve, reject) => {
    const zippedFileStream = fs
      .createReadStream(zippedFile)
      .pipe(zlib.createGunzip())
      .pipe(tar.t());
    zippedFileStream.on('error', () => {
      reject(new Error('failed to read compressed geo database'));
    });
    zippedFileStream.on('entry', (entry) => {
      if (entry.path.endsWith('.mmdb')) {
        const file = path.join(folder, path.basename(entry.path));
        const extractedFileStream = fs.createWriteStream(file);
        entry.pipe(extractedFileStream);
        extractedFileStream.on('error', () => {
          fs.unlinkSync(file);
          reject(new Error('failed to write extracted geo database'));
        });
        extractedFileStream.on('finish', () => {
          resolve();
        });
      }
    });
  });
}

module.exports = buildGeoLite;
