require('dotenv').config()
const express = require('express')
const cors = require('cors')
const router = require('./route/main')

const app = express()

app.use(express.json())
app.use(cors())

app.use('/api', router)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log('server is running on port', PORT)
})
