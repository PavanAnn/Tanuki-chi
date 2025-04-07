import { Button } from 'antd'
import { useEffect, useState } from 'react'

export const SharePage: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<any[]>([])


  useEffect(() => {
    const fetchBookmarks = async () => {
      const savedBookmarks = await window.api.getBookmarks()
      const mappedBookmarks = savedBookmarks.map((item: any) => ({
        title: item.title,
        link: item.link,
        cover: item.coverHref
      }))
      setBookmarks(mappedBookmarks)
    }

    fetchBookmarks()
  }, [])

  return (
    <>
    IMPORT/EXPORT
    <Button onClick={() => { console.log(bookmarks) } }>check</Button>
     </>
  )
}
