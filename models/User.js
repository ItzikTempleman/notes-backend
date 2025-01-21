const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isLoggedIn: { type: Boolean, default: false },
    phoneNumber: { type: String },
    profileImage: { type: String, default: '' },
    gender: { type: String, enum: ['SELECT_GENDER','MALE', 'FEMALE', 'OTHER'], required: true },
    dateOfBirth: { type: String },
    isViewGrid: { type: Boolean, default: false },
    selectedWallpaper: { type: String, default: '' }
});

module.exports = mongoose.model('User', UserSchema);
