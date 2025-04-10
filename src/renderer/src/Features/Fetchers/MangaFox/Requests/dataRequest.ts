import axios from 'axios'

function getSearchMangasMangaFox() {
  return async (search) => {
    const response = await axios.get(
      `http://127.0.0.1:3000/api/mangafox/mangas/search?search=${search}`
    )

    return {
      response
    }
  }
}

function getDetailMangasMangaFox() {
  return async (search) => {
    const response = await axios.get(
      `http://127.0.0.1:3000/api/mangafox/mangas/detail?search=${search}`
    )

    return {
      response
    }
  }
}

function getMangasPagesMangaFox() {
  return async (search) => {
    const response = await axios.get(
      `http://127.0.0.1:3000/api/mangafox/mangas/pages?search=${search}`
    )

    return {
      response
    }
  }
}

export const MangaFoxAPI = {
  getSearchMangasMangaFox,
  getDetailMangasMangaFox,
  getMangasPagesMangaFox
}
