import User from '../models/user-model.js';
import TokenService from '../services/tokenService.js';
import UserDto from '../dtos/user-dto.js';
import bcrypt from 'bcryptjs';
import {validationResult} from 'express-validator';

class AuthController {
	async registration(req, res) {
		try {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return res.status(400).json({
					message: 'Registration error, check your password or name',
					errors,
				});
			}

			const {name, password, email} = req.body;
			const candidate = await User.findOne({name});

			if (candidate) {
				return res
					.status(400)
					.json({message: 'User with dat name already exists'});
			}

			const hashPassword = bcrypt.hashSync(password, 4);
			const user = new User({
				name,
				email,
				password: hashPassword,
			});

			await user.save();

			return res.json('User was successfully registered');
		} catch (error) {
			console.log(error);
			res.status(400).json({message: 'registration error'});
		}
	}
	async login(req, res) {
		try {
			const {name, password} = req.body;
			const user = await User.findOne({name});

			if (!user) {
				return res.status(404).json({message: `User "${name}" is not found`});
			}
			if (user.status !== 'Active') {
				return res.status(403).json({message: `User "${name}" is blocked`});
			}

			const validPassword = bcrypt.compareSync(password, user.password);
			if (!validPassword) {
				return res.status(400).json({message: 'The paassword is incorrect'});
			}

			await User.updateOne(
				{name: user.name},
				{
					$set: {
						dateOfLastEnter: Date.now(),
					},
				}
			);

			const userDto = new UserDto(user);

			const token = TokenService.generateAccessToken({
				...userDto,
			});

			await TokenService.saveToken(userDto.id, token);
			res.cookie('token', token, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
			});

			return res.json({...userDto, token});
		} catch (error) {
			console.log(error);
			res.status(400).json({message: 'login error'});
		}
	}
	async logout(req, res) {
		const {token} = req.cookies;

		await TokenService.removeToken(token);

		res.clearCookie('token');

		return res.json('User was successfully logout');
	}

	async getUsers(req, res) {
		try {
			const users = await User.find();

			return res.json(users);
		} catch (error) {
			console.log(error);
		}
	}

	async getCurrentUser(req, res) {
		try {
			const {name} = req.body;
			const candidate = await User.findOne({name});

			if (!candidate) {
				return res
					.status(400)
					.json({message: 'Whoops.. cant find a user with dat name'});
			}
			if (candidate.status === 'Blocked')
				return res.status(403).json({message: `User "${name}" is blocked`});

			const user = new UserDto(candidate);

			const {token} = await TokenService.findToken(candidate._id);

			return res.json({...user, token});
		} catch (error) {
			console.log(error);
		}
	}

	async deleteUser(req, res) {
		try {
			const {id} = req.body;

			User.findByIdAndDelete(
				{
					_id: id,
				},
				(err, doc) => {
					if (err) {
						console.log(err);

						return res.status(500).json({
							message: 'Cant delete a user',
						});
					}
					if (!doc) {
						return res.status(404).json({
							message: 'Cant find and delete a user',
						});
					}

					res.json({
						success: true,
					});
				}
			);
		} catch (error) {
			console.log(error);
		}
	}
}

export default new AuthController();
