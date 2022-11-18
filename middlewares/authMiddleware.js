import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
	if (req.method === 'OPTIONS') {
		next();
	}
	try {
		const authorizationHeader = req.headers.authorization;
		const token = authorizationHeader.split(' ')[1];
		if (!token) {
			return res.status(403).json({message: `User is not authorized ${token}`});
		}

		const decodedData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
		req.user = decodedData;
		next();
	} catch (error) {
		console.log(error);
		return res.status(403).json({message: 'User is not authorized catched..'});
	}
};
