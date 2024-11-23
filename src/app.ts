import express from "express"
import cookieParser from "cookie-parser"

import { jwt } from "./services/jwt";
import { authRouter } from "./routers/auth";
import { nonAuthRouter } from "./routers/non-auth";

const app = express()

// middleware untuk baca body (json)
app.use(express.json())

// middleware untuk baca cookie
app.use(cookieParser())

// Router No Auth
app.use(nonAuthRouter)

// middleware check auth
app.use((request, response, next) => {
    const token = request.cookies.token
    const payload = jwt.verify(token)

    if (!payload) {
        response
            .status(401)
            .json({
                message: "Unauthorized",
            })

        return
    }

    // biar payload bisa dipanggil di endpoint lain
    response.locals.payload = payload

    next()
})

// Router Auth
app.use(authRouter)

app.listen(3000, () => {
    console.log("Server listening on port 3000")
})
