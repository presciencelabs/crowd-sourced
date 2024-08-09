module.exports = function(mongoose) {
  const Schema = mongoose.Schema;
  const isLangCode = require('is-language-code').isLangCode;

  const UploadSchema = new Schema({
    imageSource: {
      type: String,
      trim: true,
      required: [true, 'No image source supplied'],
      empty: [false, 'No image source supplied'],
    },
    submissionSource: {
      type: String,
      trim: true,
      required: [true, 'No submission source supplied'],
      empty: [false, 'No submission source supplied'],
    },
    text: {
      type: String,
      trim: true,
      required: function() {
        return !this.text && !this.audio;
      },
      validate: {
        isAsync: true,
        validator: function(v) {
          return new Promise((resolve, reject) => {
            if (v === undefined || v === null) {
              resolve();
            }
            this.model('Upload').countDocuments({ audio: v }).then(count => {
              resolve(!count);
            }).catch(reject);
          });
        },
        message: 'Error on text validation'
      }
    },
    language: {
      type: String,
      trim: true,
      required: [true, 'No language code supplied'],
      empty: [false, 'No language code supplied'],
      validate: {
        validator: function(val) {
          return isLangCode(val).res;
        },
        message: 'Invalid language code supplied'
      }
    },
    audio: {
      type: String,
      trim: true,

      required: function() {
        return !this.text && !this.audio;
      },
      validate: {
        isAsync: true,
        validator: function(v) {
          return new Promise((resolve, reject) => {
            if (v === undefined || v === null) {
              resolve();
            }
            else if (v === '') {
              reject(new Error('No audio path supplied'));
            }

            this.model('Upload').countDocuments({ audio: v }).then(count => {
              resolve(!count);
            }).catch(reject);
          });
        },
        message: 'Audio path name collision'
      }
    },
  }, {
    timestamps: true
  });

  return UploadSchema;
};

