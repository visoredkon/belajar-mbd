import express from "express"

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

export {router as authRouter}
