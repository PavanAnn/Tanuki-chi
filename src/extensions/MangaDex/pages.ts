import axios from 'axios'

export async function getPages(chapterId: string) {
  try {
    const { data } = await axios.get(`https://api.mangadex.org/at-home/server/${chapterId}`)

    // Extract the necessary data from the response
    const baseUrl = data.baseUrl // The base URL for images
    const { hash, data: pageFilenames } = data.chapter // The chapter information containing the file names

    // Generate the full image URLs using the base URL and hash
    const pages = pageFilenames.map((file: string) => ({
      href: `${baseUrl}/data/${hash}/${file}`, // Construct full image URL
      text: file // File name or text description of the page
    }))

    return pages
  } catch (error) {
    console.error('Error fetching pages:', error)
    return [] // Return an empty array in case of error
  }
}
