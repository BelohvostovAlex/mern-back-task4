import jwt from 'jsonwebtoken';
import tokenModel from '../models/token-model.js';

class TokenService {
	generateAccessToken(payload) {
		const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
			expiresIn: '24h',
		});
		return accessToken;
	}
	async saveToken(userId, token) {
		const savedToken = await tokenModel.create({user: userId, token});
		return savedToken;
	}
	async removeToken(token) {
		const tokenData = await tokenModel.deleteOne({token});
		return tokenData;
	}
	async findToken(user) {
		const tokenData = await tokenModel.findOne({user});
		return tokenData;
	}
}

export default new TokenService();
