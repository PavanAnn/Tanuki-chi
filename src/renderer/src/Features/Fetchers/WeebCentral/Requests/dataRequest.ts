import axios from "axios"

/*
function getMangasKakalot() {
    return async (page) => {
        const response = await axios.get(
            `http://localhost:3000/api/mangas?page=${page}`
        );

        return {
            response
        }
    }
} */

function getSearchMangasWeebCentral() {
    return async (search) => {
        const response = await axios.get(
            `http://localhost:3000/api/weebcentral/mangas/search?search=${search}`
        );

        return {
            response
        }
    }
}

function getDetailMangasWeebCentral() {
    return async (search) => {
        const response = await axios.get(
            `http://localhost:3000/api/weebcentral/mangas/detail?search=${search}`
        );

        return {
            response
        }
    }
}

function getMangasPagesWeebCentral() {
    return async (search) => {
        const response = await axios.get(
            `http://localhost:3000/api/weebcentral/mangas/pages?search=${search}`
        );

        return {
            response
        }
    }
}


export const WeebCentralAPI = {
    getSearchMangasWeebCentral,
    getDetailMangasWeebCentral,
    getMangasPagesWeebCentral
}