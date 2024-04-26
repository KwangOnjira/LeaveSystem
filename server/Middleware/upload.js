const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination:(req,files,cb)=>{
        cb(null, './uploads/medical')
    },
    filename:(req,files,cb)=>{
        const uniqueSuffix = Date.now() + Math.round(Math.random() * 1E9)
        cb(null,`MDC_${uniqueSuffix+path.extname(files.originalname)}`)
    }
})


exports.upload = multer({storage:storage}).array("files")

