const express = require('express');
const router = express.Router();
const models = require('../models');
const multer = require('multer');
const timestamp = require('time-stamp')
const mv = require('mv');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const fastCsv = require('fast-csv');
const AdmZip = require('adm-zip');

/**
 * 2024-7-25 https://medium.com/@akhilanand.ak01/converting-streams-to-buffers-a-practical-guide-745fc2f77728
 *
 * Because `adm-zip` doesn't handle streams
 */
async function streamToBuffer(readableStream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readableStream.on('data', data => {
      if (typeof data === 'string') {
        // Convert string to Buffer assuming UTF-8 encoding
        chunks.push(Buffer.from(data, 'utf-8'));
      } else if (data instanceof Buffer) {
        chunks.push(data);
      } else {
        // Convert other data types to JSON and then to a Buffer
        const jsonData = JSON.stringify(data);
        chunks.push(Buffer.from(jsonData, 'utf-8'));
      }
    });
    readableStream.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
    readableStream.on('error', reject);
  });
}

/**
 * multer for photo uploads
 */
const storage = multer.diskStorage({
  destination: '/tmp',
  filename: function (req, file, cb) {
    cb(null, file.originalname + timestamp('YYYY-MM-DD-HHmmssms'));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    files: 1,
    fileSize: 50 * 1024 * 1024,
   }
}).single('audio', 1);

router.get('/', function(req, res, next) {
  models.Upload.find({}).sort({ 'createdAt': -1 }).then(uploads => {
    res.render('index', { uploads: uploads });
  }).catch(err => {
    res.render('error', { error: err });
  });
})

router.post('/', upload, function(req, res, next) {

  // Strip querystring cruft
  let imgUrl;
  if (req.body.imageSource) {
    imgUrl = new URL(req.body.imageSource);
    imgUrl = imgUrl.origin + imgUrl.pathname;
  }

  const upload = {
    submissionSource: req.get('referer'),
    language: req.body.language,
    text: req.body.text,
    imageSource: imgUrl,
    audio: req.file ? `${timestamp('YYYY-MM-DD-HHmmssms')}.${mime.extension(req.file.mimetype)}` : undefined,
  };

  models.Upload.create(upload).then(obj => {

    if (obj.audio) {
      mv(req.file.path, path.join(__dirname, `/../uploads/${obj.audio}`), { mkdirp: true }, function(err) {
        if (err) {
          models.Upload.deleteOne({ _id: obj._id }).then(results => {
            return res.status(400).json({message: err});
          }).catch(err => {
            return res.status(500).json({message: err});
          });
        }
        else {
          res.status(201).json({message: 'Thank you!'});
        }
      });
    }
    else {
      res.status(201).json({message: 'Thank you!'});
    }
  }).catch(err => {
    if (err.errors) {
      res.status(400).json({message: 'Missing fields'});
    }
    else {
      res.status(500).json({message: 'Server error'});
    }
  });
});

router.get('/zip', function(req, res, next) {
  models.Upload.countDocuments({}).then(count => {
    if (!count) {
      return res.status(204).send();
    }

    /**
     * CSV export
     *
     * 2024-7-25 https://stackoverflow.com/a/75789864/1356582
     */
    const cursor = models.Upload.find().cursor();
    const transformer = (doc) => {
      return {
        Image: doc.imageSource,
        Text: doc.text,
        Audio: doc.audio,
        Language: doc.language,
        Source: doc.submissionSource,
        DateTime: doc.createdAt,
      };
    }
    const csvStream = fastCsv.format({headers: true}).transform(transformer);

    streamToBuffer(cursor.pipe(csvStream)).then(csvBuffer => {
      const zip = new AdmZip();
      zip.addFile('data.csv', csvBuffer);

      models.Upload.find({}).select('audio').then(async uploads => {

        for (let upload of uploads) {
          if (upload.audio) {
            try {
              await fs.promises.access(`uploads/${upload.audio}`, fs.constants.F_OK)
              zip.addLocalFile(`uploads/${upload.audio}`);
            }
            catch (err) {
              zip.addFile(`${upload.audio}-missing.txt`, Buffer.from('This audio file is missing. Where did it go?', 'utf8'));
            }
          }
        }

        res.header('Content-Disposition', `attachment; filename="crowd-sourced.zip"`);
        res.send(zip.toBuffer());
      })
      .catch(err => {
        res.status(500).send(err);
      });
    })
    .catch(err => {
      res.status(500).send(err);
    });

  }).catch(err => {
    res.status(500).send(err);
  });
});


module.exports = router;
