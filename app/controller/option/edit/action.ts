"use server"
import axios from "axios"
import { getToken } from "../../home/serverAction"
import { redirect } from "next/navigation"

export const updateOption = async (id: string, name: string, choices: string, required: boolean, multi_select: boolean, max_multi: number) => {
    if (!name || !choices) {
        return {
            status: 401,
            message: "Required field name and choices"
        }
    }

    try {
        const jwtToken = await getToken()
        const res = await axios.put(`${process.env.WEBSERVER_URL}/api/options/${id}`, {
            name,
            choices,
            required,
            multi_select,
            max_multi,
        }, {
            headers: {
                "Authorization": `Bearer ${jwtToken}`
            }
        })

        if (res.status === 200) {
            return {
                status: 200,
                message: res.data.status
            }
        }
    } catch (e: any) {
        if (e.message === "Request failed with status code 401") {
            redirect('/login')
        }
        console.error(e.message)
        return {
            status: 500
        }
    }
}