// models/FileType.js

const mongoose = require('mongoose');

const FileTypeSchema = new mongoose.Schema({
    typeName: {
        type: String,
        unique: true,
    },
    description: {
        type: String,
    },
});



module.exports =  mongoose.model('FileType', FileTypeSchema);