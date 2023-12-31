const mongoose = require("mongoose")

const projectSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    description: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    tags: [
        { 
        type: String, 
        }
    ],
    images: [
        { 
            type: String 
        }
    ] 
  });

module.exports = mongoose.model('Project', projectSchema);
  