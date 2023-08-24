const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const register = async (req, res) => {
  // if (!name || !email || !password) {
  //   // dajemy throw bo  mamy w app.js wczytaną paczkę express async errors i wyłapie
  //   // w tym przypadku moongose by wyłapał błąd ale chemy lepszy erro rzucić
  //   throw new BadRequestError('Please provide name, email and password')
  // }
  const user = await User.create({ ...req.body })
  const token = user.createJWT()
  // zawsze jak towrzysz jwt to wysyłaj do frontendu token, reszta do zalezy od setupu
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })
}

const login = async (req, res) => {
  const { email, password } = req.body

  // jak nie dasz to error od userSchema będzie bo hasło będzie o długości mniejszej niz tam iles a jak maila to nie znajdzie
  if (!email || !password) {
    throw new BadRequestError('Please provide email and password')
  }
  const user = await User.findOne({ email })
  if (!user) {
    throw new UnauthenticatedError('Invalid credentials')
  }
  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid credentials')
  }

  const token = user.createJWT()
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token }) // zawsze ma byc token reszta to zalezy od frontendu
}

module.exports = { register, login }
