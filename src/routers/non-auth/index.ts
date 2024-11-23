import express from "express"

import { jwt } from "../../services/jwt";
import { db } from "../../services/database"
import { sqlClientErrors } from "../../utils/sqlClientErrors";

const router = express.Router()

// http method: post
// request: yang datang dari client
// response: yang server berikan ke client
// http://localhost:3000/register
router.post('/register', (request, response) => {
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

            if (!sqlClientErrors.includes(sqlErrorCode)) {
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

        return response
            .status(201)
            .json({
                message: "Register akun berhasil"
            })
    })
})

router.post("/login", (request, response) => {
    const body = request.body

    const data = [
        body.username,
        body.password,
    ]

    db.query("call login(?, ?)", data, (err, result) => {
        if (err) {
            const sqlErrorCode = err.sqlState

            if (!sqlClientErrors.includes(sqlErrorCode)) {
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

        const queryResult = result[0][0]

        response.cookie(
            "token",
            jwt.sign(queryResult),
            {
                maxAge: 3_600 * 1000
            }
        )

        return response
            .status(200)
            .json({
                message: "Login berhasil",
                data: queryResult
            })
    })
})

export {router as nonAuthRouter}
