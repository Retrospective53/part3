const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const url = process.env.MONGODB_URI

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log(`error connecting to MongoDB: ${error.message}`)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    required: true,
    validate: {
      validator: function(phoneNumber) {
        return /^(\d{3}-\d{8}|\d{2}-\d{9})$/.test(phoneNumber)
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, 'User phone number required']

  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

personSchema.plugin(uniqueValidator)



module.exports = mongoose.model('Person', personSchema)