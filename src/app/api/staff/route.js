import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";



export async function GET() {
    try {
        const data = await pool.query('SELECT * FROM staffs ORDER BY role ASC')
        if (data.rowCount === 0) {
            return NextResponse.json({
                success: false, message: "No staff found"
            }, { status: 400 })
        }

        return NextResponse.json({
            success: true, message: 'Successfully fetched staff data', payload: data.rows
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false, message: error.message
        }, { status: 500 })

    }

}

export async function DELETE(req) {
    try {
        const { id } = await req.json()
        if (!id) {
            return NextResponse.json({
                success: false, message: 'Id not recieved'
            }, { status: 400 })
        }

        const existStaff = await pool.query('SELECT * FROM staffs WHERE staff_id=$1', [id])
        if (existStaff.rowCount === 0) {
            return NextResponse.json({
                success: false, message: 'No staff found with this id'
            }, { status: 400 })
        }

        const staff = existStaff.rows[0];

        if (staff.role === 'manager') {
            const managerCountRes = await pool.query("SELECT COUNT(*) FROM staffs WHERE role='manager'");
            const totalManagers = parseInt(managerCountRes.rows[0].count);

            if (totalManagers <= 1) {
                return NextResponse.json({
                    success: false,
                    message: 'Action denied. You must have at least one manager in the system.'
                }, { status: 403 });
            }
        }

        await pool.query('DELETE FROM staffs WHERE staff_id=$1', [id]);

        return NextResponse.json({
            success: true,
            message: 'Staff deleted successfully'
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            success: false, message: error, message
        }, { status: 500 })

    }

}

export async function POST(req) {
    try {
        
    } catch (error) {
        return NextResponse.json({
            success:
        })
        
    }
    
}