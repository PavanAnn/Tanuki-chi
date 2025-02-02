import axios from "axios"


function getMangasKakalot() {
    return async (page) => {
        const response = await axios.get(
            `http://localhost:3000/api/mangas?page=${page}`
        );

        return {
            response
        }
    }
}

function getSearchMangasKakalot() {
    return async (search) => {
        const response = await axios.get(
            `http://localhost:3000/api/mangas/search?search=${search}`
        );

        return {
            response
        }
    }
}


export const KakalotAPI = {
    getMangasKakalot,
    getSearchMangasKakalot
}