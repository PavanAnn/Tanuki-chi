import { useEffect, useState } from 'react'
import { mapBookmarks } from '../utils'

export const SharePage: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<any[]>([])

  useEffect(() => {
    const fetchBookmarks = async () => {
      const savedBookmarks = await window.api.getBookmarks()
      setBookmarks(mapBookmarks(savedBookmarks))
    }

    fetchBookmarks()
  }, [])


  return (
    <>
    {bookmarks.map((book) => 
    <h1>{book.auhtor}</h1>
    )}
    </>
  )
}
