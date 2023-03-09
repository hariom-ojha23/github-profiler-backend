const express = require('express')
const axios = require('axios')

const api = 'https://api.github.com'
const router = express.Router()

const token = process.env.TOKEN

const a = ''

router.get('/users', async (req, res) => {
    try {
        const { data } = await axios.get(`${api}/users`)
        const dataArr = []

        for (let user of data.slice(4, 10)) {
            const { data } = await axios.get(`${api}/users/${user.login}`, {
                headers: { Authorization: `token ${token}` },
            })
            dataArr.push(data)
        }

        res.status(200).send(dataArr)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.get('/users/:username', async (req, res) => {
    try {
        const { username } = req.params
        const { data } = await axios.get(`${api}/users/${username}`, {
            headers: { Authorization: `token ${token}` },
        })
        res.status(200).send(data)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.get('/users/repos/:username', async (req, res) => {
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    const total = parseInt(req.query.total)
    const username = req.params.username

    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const results = {}

    if (endIndex < total) {
        results.next = {
            page: page + 1,
            limit: limit,
        }
    }

    if (startIndex > 0) {
        results.previous = {
            page: page - 1,
            limit: limit,
        }
    }

    try {
        const { data } = await axios.get(
            `${api}/users/${username}/repos?page=${page}&per_page=${limit}`,
            { headers: { Authorization: `token ${token}` } }
        )

        res.status(200).send({ ...results, results: data })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/users/repos/languages/:username', async (req, res) => {
    try {
        const repo = req.query.repo
        const username = req.params.username

        const { data } = await axios.get(
            `${api}/repos/${username}/${repo}/languages`,
            {
                headers: { Authorization: `token ${token}` },
            }
        )

        res.status(200).send(data)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router
