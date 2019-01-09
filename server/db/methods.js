//import the model file (above) and use it in methods to manipulate model
const User = mongoose.model('User', UserSchema)

const addUser = (firstName, lastName) => new User({
  firstName,
  lastName,
}).save()

const getUser = (id) => User.findById(id)

const removeUser = (id) => User.remove({
  id
})
