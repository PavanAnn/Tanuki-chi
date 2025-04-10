import { DeleteOutlined } from '@ant-design/icons'
import { Card, Flex, Image, Input, Select, Tag } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const Bookmarks: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [allBookmarks, setAllBookmarks] = useState<any[]>([])

  const navigate = useNavigate()

  const handleNavigate = (providerName: string, link: string, title: string) => {
    const encodedLink = encodeURIComponent(link)
    const encodedTitle = encodeURIComponent(title)
    const encodedProvider = encodeURIComponent(providerName)

    navigate(`/detail?provider=${encodedProvider}&link=${encodedLink}&title=${encodedTitle}`)
  }

  useEffect(() => {
    const fetchBookmarks = async () => {
      const savedBookmarks = await window.api.getBookmarks()
      const mappedBookmarks = savedBookmarks.map((item: any) => ({
        title: item.title,
        link: item.link,
        cover: item.coverHref,
        provider: item.provider,
        latestRead: item.latestRead,
        createdAt: item.createdAt
      }))

      const sorted = mappedBookmarks.sort((a, b) => a.title.localeCompare(b.title))

      setBookmarks(sorted)
      setAllBookmarks(sorted)
    }

    fetchBookmarks()
  }, [])

  const handleDeleteBookmark = async (e, item) => {
    e.stopPropagation()

    await window.api.toggleBookmark(item.title, item.link, item.cover, item.provider)

    setBookmarks((prev) => prev.filter((b) => b.link !== item.link))
  }

  const searchBookmarks = (value) => {
    const search = value.toLowerCase()
    const filtered = allBookmarks.filter((b) => b.title.toLowerCase().includes(search))
    setBookmarks(filtered)
  }

  const handleSortChange = (value: { value: string }) => {
    const sorted = [...bookmarks].sort((a, b) => {
      if (value.value === 'title') {
        return a.title.localeCompare(b.title, undefined, {
          numeric: true,
          sensitivity: 'base'
        })
      } else {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }
    })

    setBookmarks(sorted)
  }

  return (
    <>
      <Flex gap={'22px'}>
        <Input
          onChange={(e) => searchBookmarks(e.target.value)}
          style={{ width: '45%' }}
          placeholder="Search from your bookmarks"
        />
        <Select
          defaultValue={{ label: 'Alphabetically', value: 'title' }}
          style={{ width: 160 }}
          onChange={handleSortChange}
          options={[
            { value: 'title', label: 'Alphabetically' },
            { value: 'createdAt', label: 'Added Date' }
          ]}
          labelInValue
        />
      </Flex>

      <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', marginTop: '24px' }}>
        {bookmarks.map((item) => (
          <Card
            onClick={() => handleNavigate(item.provider, item.link, item.title)}
            title={item.title}
            variant="borderless"
            style={{ width: '15%', cursor: 'pointer' }}
            extra={
              <Flex>
                <div className="icon-hover-delete">
                  <DeleteOutlined onClick={(e) => handleDeleteBookmark(e, item)} />
                </div>
              </Flex>
            }
          >
            <Image width={'100%'} src={item.cover} preview={false} />
            <Flex gap="4px 0" wrap style={{ marginTop: '20px' }}>
              {item.latestRead && <Tag color="cyan">Lastest read: {item.latestRead}</Tag>}
              {item.createdAt && (
                <Tag color="magenta">Added at: {new Date(item.createdAt).toLocaleString()}</Tag>
              )}
            </Flex>
          </Card>
        ))}
      </div>
    </>
  )
}
