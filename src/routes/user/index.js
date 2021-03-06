const express = require('express')
const User = require('../../models/user')
const auth = require('../../middleware/auth')

const router = express.Router()

router.post('/register', async (req, res) => {
    // Create a new user
    try {
        const user = new User(req.body)
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/login', async(req, res) => {
    //Login a registered user
    try {
        const { email, password } = req.body
        const user = await User.findByCredentials(email, password)
        if (!user) {
            return res.status(401).send({error: 'Login failed! Check authentication credentials'})
        }
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (error) {
        res.status(400).send({ error: error.message })
    }

})

router.get('/me', auth, async(req, res) => {
    // View logged in user profile
    res.send(req.user)
})

router.patch('/me/update', auth, async(req, res) => {
    // update user
    try {

        const { name, surname, phone,  password } = req.body
        const email = req.user.email;
        let user = await User.checkCredentials(email, password)

        if (!user) {
            return res.status(401).send({error: 'The password entered does not match. Please try again.'})
        }
        user.name = name;
        user.surname = surname;
        user.phone = phone;

        await user.save();

        res.status(200).send({ user })
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
})

router.post('/me/delete/verify', auth, async(req, res) => {
    // update user
    try {

        const { password } = req.body
        const email = req.user.email;
        let user = await User.checkCredentials(email, password)

        if (!user) {
            return res.status(401).send({error: 'Sorry, please check that all of your information is correct.'})
        }
        res.status(200).send({ message: 'Deactivating your account will stop it from working. To order with us again, you’ll have to create a new account. Do you still want to go ahead?'})
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
})

router.delete('/me/delete', auth, async(req, res) => {
    // update user
    try {
        const user = req.user;
        await user.delete();

        res.status(200).send({ message: 'Your account was successfully deactivated.'})
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
})

router.post('/me/logout', auth, async (req, res) => {
    // Log user out of the application
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
})

router.post('/me/logoutall', auth, async(req, res) => {
    // Log user out of all devices
    try {
        req.user.tokens.splice(0, req.user.tokens.length)
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router