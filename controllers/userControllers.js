const User = require ("../models/User.js")
const bcryptjs = require ("bcryptjs")

const userControllers = {

    addNewUser: async (req, res) => {

        const {name, surname, email, password, image_url, country} = req.body
        const hashedPassword = bcryptjs.hashSync(password)
        const newUser = new User ({name, surname, email, password: hashedPassword, image_url, country})
        try{
            let repeatedUser = await User.findOne({email: email})
            if (repeatedUser) throw new Error
            await newUser.save()
            res.json ({success: true, response: {name: newUser.name, _id: newUser._id}, error: null })
        }   catch(error) {
            res.json({success: false, response: error.message})
        } 

    },

    signUser: async (req, res) => {
        const {email, password} = req.body
        try {
            let savedUser = await User.findOne({email}) 
            if (!savedUser) throw new Error ("Email and/or password incorrect")

            let match = bcryptjs.compareSync(password, savedUser.password) 
            if (!match) throw new Error ("Email and/or password incorrect")
            res.json ({success: true, response: {name: savedUser.name}})    

        } catch(error) {
            res.json({success: false, response: error.message })
        }
       
    }

}

module.exports = userControllers
