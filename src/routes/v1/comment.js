import express from 'express'

const router = express.Router();

router.get('/', (req, res) => {
    return res.json({
        message: "Welcome to comment route"
    })
})

router.get('/:id', (req, res) => {
    return res.json({
        message: "Welcome to comment route",
        id: req.params.id
    })
})