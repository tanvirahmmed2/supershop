import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { JWT_SECRET } from './database/secret'
import { pool } from './database/db'

export const isStaff = async () => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('supershop_staff')?.value;

        if (!token) {
            return { success: false, message: 'Unauthorized: No token provided' };
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        
        const result = await pool.query('SELECT staff_id, role, name FROM staffs WHERE staff_id = $1', [decoded.id]);

        if (result.rowCount === 0) {
            return { success: false, message: 'Account not found' };
        }

        const staff = result.rows[0];

        return {
            success: true,
            message: 'Verification successful',
            payload: {
                id: staff.staff_id,
                role: staff.role, 
                name: staff.name
            }
        };

    } catch (error) {
        const msg = error.name === 'TokenExpiredError' ? 'Session expired' : 'Invalid token';
        return { success: false, message: msg };
    }
}

export const isManager = async () => {
    const auth = await isStaff();
    
    if (!auth.success) {
        return auth; 
    }

    if (auth.payload.role !== 'manager') {
        return { success: false, message: 'Access denied: Managers only' };
    }

    return {
        success: true, 
        message: 'Manager verification successful', 
        payload: auth.payload
    };
}

export const isBranchManager = async () => {
    const auth = await isStaff();
    
    if (!auth.success) {
        return auth; 
    }

    if (auth.payload.role !== 'branch-manager') {
        return { success: false, message: 'Access denied:Branch  Managers only' };
    }

    return {
        success: true, 
        message: 'Branch Manager verification successful', 
        payload: auth.payload
    };
}

export const isInventoryManager = async () => {
    const auth = await isStaff();
    
    if (!auth.success) {
        return auth; 
    }

    if (auth.payload.role !== 'inventory-manager') {
        return { success: false, message: 'Access denied: Inventory Managers only' };
    }

    return {
        success: true, 
        message: 'Inventory Manager verification successful', 
        payload: auth.payload
    };
}


export const isISales = async () => {
    const auth = await isStaff();
    
    if (!auth.success) {
        return auth; 
    }

    if (auth.payload.role !== 'sales') {
        return { success: false, message: 'Access denied: Sales only' };
    }

    return {
        success: true, 
        message: 'Sales verification successful', 
        payload: auth.payload
    };
}