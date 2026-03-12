import { cookies } from "next/headers"
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from "./database/secret"
import { pool } from "./database/db"



export const isUserLogin = async () => {
    try {
        const token = (await cookies()).get('supershop_user')?.value
        if (!token) {
            return {
                success: false, message: 'Please login'
            }
        }

        const decode = jwt.verify(token, JWT_SECRET)

        const data = await pool.query('SELECT user_id, email, phone, name FROM users WHERE user_id=$1', [decode.id])
        if (data.rowCount === 0) {
            return { success: false, message: 'User not found' }
        }
        const user = data.rows[0]
        return {
            success: true, message: 'Login verified successfully', payload: user
        }

    } catch (error) {
        return {
            success: false, message: "Failed to verify login"
        }

    }
}