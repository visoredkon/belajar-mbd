import { db } from "./services/database"
import express from "express"

const app = express()

app.use(express.json())

// http method: post
// request: yang datang dari client
// response: yang server berikan ke client
// http://localhost:3000/register
app.post('/register', (request, response) => {
    const body = request.body

    const data = [
        body.name,
        body.username,
        body.password,
        body.is_admin,
    ]

    db.query("call register(?, ?, ?, ?)", data, (err, _result) => {
        if (err) {
            const sqlErrorCode = err.sqlState
            const clientErrors = [
                "23000",
                "45000"
            ]

            if (!clientErrors.includes(sqlErrorCode)) {
                return response
                    .status(500)
                    .json({
                        message: "Internal Server Error"
                    })
            }

            return response
                    .status(400)
                    .json({
                        message: err.message
                    })
        }

        response
            .status(201)
            .json({
                message: "Register akun berhasil"
            })
    })
})

app.listen(3000, () => {
    console.log("Server listening on port 3000")
})
