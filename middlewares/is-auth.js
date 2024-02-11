const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        const error = new Error('Not authenticated. Authorization Header is not present in the request.');
        error.statusCode = 401;
        throw error;
      }
      
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'secret')
        
    } catch (error) {
        error.statusCode = 500;
        throw error;
    }

    if (!decodedToken) {
        const error = new Error('Not authenticated. JWT token is not correct.');
        error.statusCode = 401;
        throw error;
      }

    req.userId = decodedToken.userId;
    next();
}