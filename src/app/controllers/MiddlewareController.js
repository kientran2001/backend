const jwt = require("jsonwebtoken");

module.exports = {
    //verifyToken
    verifyToken: (req, res, next) => {
        const accessToken = req.cookies.accessToken
        if (accessToken) {
            // bearer token
            // const accessToken = token.split(" ")[1];
            jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
                if (err) {
                    return res.status(403).json("Token is not valid");
                }
                req.user = user;
                next();
            });
        } else {
            res.status(401).json("You're not authenticated");
        }
    },

    verifyAdminAuth: (req, res, next) => {
        this.verifyToken(req, res, () => {
            if (req.user.role === 3) {
                next();
            } else {
                return res.status(403).json("You're not allowed to do this action");
            }
        });
    },

    verifyStaffAuth: (req, res, next) => {
        this.verifyToken(req, res, () => {
            if (req.user.role === 2 || req.user.role === 3) {
                next();
            } else {
                return res.status(403).json("You're not allowed to do this action");
            }
        });
    },
};

// module.exports = MiddlewareController;
