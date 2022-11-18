import User from '../models/user-model.js';

class StatusController {
	async blockStatus(req, res) {
		try {
			const {id} = req.body;

			User.findOneAndUpdate(
				{
					_id: id,
				},
				{
					$set: {
						status: 'Blocked',
					},
				},
				{
					returnDocument: 'after',
				},
				(err, doc) => {
					if (err) {
						console.log(err);

						return res.status(500).json({
							message: 'Cant find a user',
						});
					}
					if (!doc) {
						return res.status(404).json({
							message: 'User not found',
						});
					}

					res.json(doc);
				}
			);
		} catch (error) {
			console.log(error);
		}
	}
	async activeStatus(req, res) {
		try {
			const {id} = req.body;

			User.findOneAndUpdate(
				{
					_id: id,
				},
				{
					$set: {
						status: 'Active',
					},
				},
				{
					returnDocument: 'after',
				},
				(err, doc) => {
					if (err) {
						console.log(err);

						return res.status(500).json({
							message: 'Cant find a user',
						});
					}
					if (!doc) {
						return res.status(404).json({
							message: 'User not found',
						});
					}

					res.json(doc);
				}
			);
		} catch (error) {
			console.log(error);
		}
	}
}

export default new StatusController();
