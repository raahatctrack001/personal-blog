import multer from 'multer';

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    },
    destination: function (req, file, cb) {
      console.log("inside multer:")
      cb(null, 'public/files')
    }
  })
  
  const upload = multer({ storage: storage })
  export default upload;