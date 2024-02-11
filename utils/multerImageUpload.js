const multer = require('multer');

function multerImageUpload() {


    const fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'images');
        },
        filename: (req, file, cb) => {
            cb(null, new Date().getTime() + '-' + file.originalname);
        },
    });

    const fileFilter = (req, file, cb) => {
        if (
            file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpg' ||
            file.mimetype === 'image/jpeg'
        ) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    };

    const upload = multer({ storage: fileStorage, fileFilter: fileFilter });
    return upload;
}


module.exports.multerImageUpload = multerImageUpload;