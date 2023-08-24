const mongoose = require('mongoose')

// bcryptjs a nie bcrypt
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    minLength: 3,
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    // regular expression mozna w match dać, jak się nie zgadza to error message
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide valid email',
    ],
    // email musi być unikatowy a jak nie to wtedy erro
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minLength: 6,
  },
})
// MOONGOSE MIDDLEWARE

//dodajemy hasło juz od razu shashowane, na początku towrzenia usera
UserSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(10) // generuje random bytes, im więcej bezpieczniej ale 10 wystarcza i kodu nie powalnia
  this.password = await bcrypt.hash(this.password, salt) // miesza hasło z byte'ami

  // next() jak z async korzystasz to w docs piszą ze nie trzeba z next
})

// zawsze function uzywaj aby this dobrze działało
UserSchema.methods.createJWT = function () {
  // hasło powinno się tworzyć na jakiejś stronce, 256bit encryption key
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  )
}

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password)
  return isMatch
}
module.exports = mongoose.model('User', UserSchema)
