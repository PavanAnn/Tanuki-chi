import { Card, Image } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const Bookmarks: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const navigate = useNavigate()

  const handleNavigate = (link: string, title: string) => {
    const encodedLink = encodeURIComponent(link)
    const encodedTitle = encodeURIComponent(title)

    navigate(`/detail?link=${encodedLink}&title=${encodedTitle}`)
  }

  useEffect(() => {
    const fetchBookmarks = async () => {
      const savedBookmarks = await window.api.getBookmarks()
      // Assuming you want to map over the bookmarks:
      const mappedBookmarks = savedBookmarks.map((item: any) => ({
        // Adjust mapping as needed, for example:
        title: item.title,
        link: item.link,
        cover: item.coverHref
      }))
      setBookmarks(mappedBookmarks)
    }

    fetchBookmarks()
  }, [])

  return (
    <div style={{ display: 'flex', gap: '18px' }}>
      {bookmarks.map((item) => (
        <Card
          onClick={() => handleNavigate(item.link, item.title)}
          title={item.title}
          variant="borderless"
          style={{ width: 300, cursor: 'pointer' }}
        >
          <Image src={item.cover} preview={false} />
        </Card>
      ))}
    </div>
  )
}
