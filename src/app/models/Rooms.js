const mongoose = require('../../database');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({

    name:{
        type: String,
        unique: true,
        require: true,
    },
    users:{
        type: String,
        select: false,
    },
    createAt:{
        type: Date,
        default: Date.now,
    },
});

UserSchema.pre('save', async function(next){

    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

    next();

});

const User = mongoose.model('User', UserSchema);

module.exports = User;