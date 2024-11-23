import mysql from "mysql2";

export const db = mysql.createConnection({
    host: "localhost",
    user: "admin_garasiku",
    password: "admin123",
    database: "garasiku"
})
