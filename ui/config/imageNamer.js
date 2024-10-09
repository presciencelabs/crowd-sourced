const Namer = require('@parcel/plugin').Namer;
const path = require('path');

module.exports = new Namer({
  name({bundle}) {
    if (bundle.type === 'png' || bundle.type === 'jpg') {
      let filePath = bundle.getMainEntry().filePath;
      return `images/${path.basename(filePath)}`;
    }

    // Allow the next namer to handle this bundle.
    return null;
  }
});


