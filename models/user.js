const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: [true, "The avatar field is required"],
    validate: {
      validator: (value) => validator.isURL(value),

      message: "You must enter a valid URL",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: "Invalid email format",
    },
  },
  password: {
    type: String,
    required: true,
    select: false, // Password won't be included in queries
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      // If user not found, throw error
      if (!user) {
        return Promise.reject(new Error("Incorrect email or password"));
      }

      // Compare provided password with hashed password
      return bcrypt.compare(password, user.password).then((matched) => {
        // If password doesn't match, throw error
        if (!matched) {
          return Promise.reject(new Error("Incorrect email or password"));
        }

        // If password matches, return user
        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
