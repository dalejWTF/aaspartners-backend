const mongoose = require("mongoose")

const projectSchema = new mongoose.Schema({
    title:{ 
        type: String,
        required: true
    },
    description:{ 
        type: String,
        required: true
    },
    video:{ 
        type: String 
    }
    
  });

module.exports = mongoose.model('VideoBg', projectSchema);
  