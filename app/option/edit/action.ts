"use server"
import axios from "axios"

export const updateOption = async (id: string, name: string, choices: string, required: boolean, multi_select: boolean, max_multi: number) => {
    if (!name || !choices) {
        return {
            status: 401,
            message: "Required field name and choices"
        }
    }

    const response = await axios.put(`${process.env.WEBSERVER_URL}/api/options/${id}`, {
        name,
        choices,
        required,
        multi_select,
        max_multi,
    })

    if (response.status === 200) {
        return {
            status: 200,
            message: response.data.status
        }
    } else {
        return {
            status: response.status
        }
    }
}