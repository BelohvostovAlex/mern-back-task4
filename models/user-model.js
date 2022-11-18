import {Schema, model} from 'mongoose';

const UserSchema = new Schema({
	name: {type: String, unique: true, required: true},
	password: {type: String, required: true},
	email: {type: String, unique: true, required: true},
	dateOfRegistration: {type: Date, default: Date.now},
	dateOfLastEnter: {type: Date, default: Date.now},
	status: {type: String, default: 'Active'},
});

export default model('User', UserSchema);
