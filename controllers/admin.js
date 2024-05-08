
const User = require('../models/user');



// GET USERS
exports.getUsers = async (req, res, next) => {

    const userId = req.userId;
    const user = await User.findById(userId);
        if(user.role !== 'superAdmin') {
            throw new Error(`You're not authorized for this action.`)
        }

    try{
        const user = await User.findById(userId);
        if(user.role !== 'superAdmin') {
            throw new Error(`You're not authorized for this action.`)
        }

        const users = await User.find();


    res.status(200).json({
        users: users
    })
    }catch (error) {
        next(error)
    }

    
};



// UPDATE USERS
exports.updateUser = async (req, res, next) => {

    const userId = req.userId;

    const id = req.params.id;

    const { email, password, name, role } = req.body;
    try{

        const user = await User.findById(userId);
        if(user.role !== 'superAdmin') {
            throw new Error(`You're not authorized for this action.`)
        }


        const userToUpdate = await User.findById(id);
       
        if (!userToUpdate) {
            const error = new Error('User did not find!');
            error.statusCode = 404;
            throw error;
        }

        userToUpdate.name = name;
        userToUpdate.email = email;
        userToUpdate.password = password;
        userToUpdate.role = role;

        const result = await userToUpdate.save();
        
        

    res.status(200).json({
        user: result
    })
    }catch (error) {
        next(error)
    }

    
};





// DELETE USER
exports.deleteUser = async (req, res, next) => {

    const userId = req.userId;

    const idToDelete = req.params.id;

    try {

        const user = await User.findById(userId);
        if(user.role !== 'superAdmin') {
            throw new Error(`You're not authorized for this action.`)
        }


        const userToDelete = await User.findById(idToDelete);
        if (!userToDelete) {
            const error = new Error('User did not find!');
            error.statusCode = 404;
            throw error;
        }

        await User.deleteOne({ _id: idToDelete });

        res.status(200).json({
            success: true,
            message: "User has been deleted successfully."
        })

    } catch (error) {
        next(error)
    }
};