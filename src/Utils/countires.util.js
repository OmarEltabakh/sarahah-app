import axios from "axios";

// get country code
export async function getCountryCode(ip) {
    const response = await axios.get(`https://ipapi.co/${ip}/json/`);

    return response.data;
}
