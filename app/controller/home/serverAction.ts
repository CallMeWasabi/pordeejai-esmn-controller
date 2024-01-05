"use server"

import axios from "axios"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const webServerUrl = process.env.WEBSERVER_URL

export const startTableService = async (tableId: number) => {
    try {
        const jwtToken = await getToken()
        const res = await axios.put(`${webServerUrl}/api/tables/${tableId}/status`, {
            status: "IN_SERVICE"
        }, {
            headers: {
                Authorization: `Bearer ${jwtToken}`
            }
        })
        return {
            status: 200,
            message: "เริ่มต้นการทำงานเสร็จสิ้น"
        }
    } catch (e: any) {
        if (e.message === "Request failed with status code 401") {
            return redirect("/login")
        }
    }
}

export const getToken = async () => {
    const token = cookies().get("token")?.value
    if (!token) {
        return "undifined"
    }
    return token
}

export const deleteToken = async () => {
    cookies().delete("token")
}