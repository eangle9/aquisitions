import logger from "#config/logger.js"
import { getAllUsers } from "#services/users.service.js"

export const fetchAllUsers = async (req, res, next) => {
    try {
        logger.info("getting all users...");

        const allUsers = await getAllUsers();

        return res.status(200).json({
            message: "Successfully retrieved users",
            users: allUsers,
            count: allUsers.length
        })
    } catch(e) {
        logger.error('error getting users')

        next(e);
    }

}