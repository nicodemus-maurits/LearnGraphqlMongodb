const mongoose = require('mongoose')

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    authorId: {
        type: String
    }
})

module.exports = mongoose.model('Book', BookSchema)
