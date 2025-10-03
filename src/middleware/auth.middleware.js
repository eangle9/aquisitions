import logger from "#config/logger.js";
import { tokens } from "#utils/jwt.js";

export const authenticationToken = (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            res.status(401).json({
                error: "Authentication failed",
                message: "token is not provided"
            });
        }
    
        const decoded = tokens.verify(token)
        
        req.user = decoded
    
        logger.info(`Successfully authenticated with email ${decoded.email}`);
    
        next();
    } catch(e) {
        logger.error(`Authentication error: ${e}`);
        res.status(401).json({
            error: "Authentication failed"
        });
    }
}

export const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                res.status(401).json({
                    error: "Authentication required",
                    message: "token is not provided"
                });
            }

            if (!allowedRoles.includes(req.user.role)) {
                logger.warn(`Access denied for user ${req.user.email} with role ${req.user.role}. Required: ${allowedRoles.join(', ')}`)
                res.status(403).json({
                    error: "Access denied",
                    message: "Insufficient permission"
                });
            }

            next();
        } catch(e) {
            logger.error(`Authorization error: ${e}`);
            res.status(500).json({
                error: "Intenal server error",
                message: "error on verification role"
            });
        }
    }
}