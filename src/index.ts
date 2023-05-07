import express, {Request, Response} from 'express'
import cors from 'cors'

const itemsRouter = require('../routes/items.routes')
const app = express()
const port = 8080

app.use(cors())
app.use(express.json())
app.use('/api', itemsRouter)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})