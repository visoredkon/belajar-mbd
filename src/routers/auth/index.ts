import { db } from "@/services/database"
import { jwt } from "@/services/jwt"
import { sqlClientErrors } from "@/utils/sqlClientErrors"
import express, { request, response } from "express"

const router = express.Router()

router.delete("/logout", (_request, response) => {
    response.cookie(
        "token",
        "",
        {
            maxAge: 0
        }
    )

    response.json({
        message: "Berhasil logout"
    })
})


router.get("/users", (request, response) => {
    const name = request.query.name
    const username = request.query.username

    if (name) {
        db.query("call search_user_by_name(?)", [name], (err, result) => {
            if (err) {
                console.log(err)
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

            const queryResult = result[0]

            return response
                .status(200)
                .json({
                    message: "Berhasil mendapatkan data users",
                    data: queryResult
                })
        })
    }

    if (username) {
        db.query("call search_user_by_username(?)", [username], (err, result) => {
            if (err) {
                console.log(err)
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

            const queryResult = result[0]

            return response
                .status(200)
                .json({
                    message: "Berhasil mendapatkan data users",
                    data: queryResult
                })
        })
    }

    db.query("call get_users()", [], (err, result) => {
        if (err) {
            console.log(err)
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

        const queryResult = result[0]

        return response
            .status(200)
            .json({
                message: "Berhasil mendapatkan data users",
                data: queryResult
            })
    })
})

router.put("/users/:id", (request, response) => {
    const id = request.params.id
    const body = request.body

    if (!(Number(id) && body)) {
        response
            .status(400)
            .json({
                message: "ID dan/atau body tidak valid"
            })

        return
    }

    const data = [
        id,
        body.name,
        body.username,
        body.password,
        body.role
    ]

    db.query("call edit_user(?, ?, ?, ?, ?)", data, (err, result) => {
        if (err) {
            console.log(err)
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

        return response
            .status(200)
            .json({
                message: "Berhasil mengedit data users",
                data: queryResult
            })
    })
})

router.delete("/users/:id", (request, response) => {
    const id = request.params.id
    const payload = response.locals.payload

    if (!Number(id)) {
        response
            .status(400)
            .json({
                message: "ID tidak valid"
            })

        return
    }

    const authorizedRoles = [
        "admin",
        "superadmin"
    ]

    if (!authorizedRoles.includes(payload.role)) {
        response
        .status(401)
        .json({
            message: "Hanya admin atau superadmin yang dapat menghapus user"
        })

        return
    }

    db.query("call delete_user(?)", [id], (err, _result) => {
        if (err) {
            console.log(err)
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
            .status(200)
            .json({
                message: "Berhasil menghapus data user",
                data: {
                    id: id
                }
            })
    })
})

export {router as authRouter}
