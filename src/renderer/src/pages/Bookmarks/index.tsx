import { DeleteOutlined, LoadingOutlined } from '@ant-design/icons'
import { Button, Card, Flex, Image, Input, Select, Skeleton, Spin, Tag, Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUnreadChapters } from './utils'

const mapBookmark = (item: any) => ({
  title: item.title,
  link: item.link,
  cover: item.coverHref,
  provider: item.provider,
  latestRead: item.latestRead,
  createdAt: item.createdAt,
  latestChapter: item.latestChapter
})

const sortBookmarks = (items: any[], sortType: string) => {
  const sorted = [...items].sort((a, b) => {
    if (sortType === 'title') {
      return a.title.localeCompare(b.title, undefined, {
        numeric: true,
        sensitivity: 'base'
      })
    }
    if (sortType === 'createdAt') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    }
    if (sortType === 'unread') {
      const aUnread = getUnreadChapters(a.latestRead, a.latestChapter)
      const bUnread = getUnreadChapters(b.latestRead, b.latestChapter)
      const aZero = aUnread === 0
      const bZero = bUnread === 0
      if (aZero && !bZero) return 1
      if (!aZero && bZero) return -1
      return aUnread - bUnread
    }
    return 0
  })
  return sorted
}

export const Bookmarks: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [allBookmarks, setAllBookmarks] = useState<any[]>([])
  const [updating, setUpdating] = useState(false)

  const [sortType, setSortType] = useState<string>('unread')

  const navigate = useNavigate()

  const handleNavigate = (provider: string, mangaId: string, title: string) => {
    navigate('/detail', {
      state: { provider, id: mangaId, title },
    });
  };
 

  const fetchAndSetBookmarks = async () => {
    const savedBookmarks = await window.api.getBookmarks()
    const mapped = savedBookmarks.map(mapBookmark)
    setAllBookmarks(mapped)
    setBookmarks(sortBookmarks(mapped, sortType))
  }

  useEffect(() => {
    fetchAndSetBookmarks()
  }, [])

  const handleSortChange = (value: { value: string }) => {
    setSortType(value.value)
    setBookmarks(sortBookmarks(allBookmarks, value.value))
  }
  
  const searchBookmarks = (value: string) => {
    const search = value.toLowerCase()
    const filtered = allBookmarks.filter((b) => b.title.toLowerCase().includes(search))
    const sortedFiltered = sortBookmarks(filtered, sortType)
    setBookmarks(sortedFiltered)
  }
    
  const handleDeleteBookmark = async (e: React.MouseEvent, item: any) => {
    e.stopPropagation()
    await window.api.toggleBookmark(item.title, item.link, item.cover, item.provider)
    setBookmarks((prev) => prev.filter((b) => b.link !== item.link))
  }

  const handleUpdateChapters = async () => {
    setUpdating(true)
  
    // all bookmarks
    for (const b of allBookmarks) {
      try {
        const result = await window.api.getExtensionResult(b.provider, 'latest', b.link)
  
        const safeLatest =
          typeof result?.response?.data?.latestChapter === 'string'
            ? result.response.data.latestChapter
            : null
  
        if (safeLatest) {
          await window.api.updateLatestChapter(b.title, b.link, b.provider, safeLatest)
        }
      } catch (err) {
        console.error(`Error updating ${b.title}:`, err)
      }
    }
  
    await fetchAndSetBookmarks()
    setUpdating(false)
  }
    
  return (
    <>
      <Flex gap="22px">
        <Input
          onChange={(e) => searchBookmarks(e.target.value)}
          style={{ width: '45%' }}
          placeholder="Search from your bookmarks"
          disabled={updating}
        />
        <Select
          defaultValue={{ label: 'Unread', value: 'unread', key: 'unread' }}
          style={{ width: 160 }}
          onChange={handleSortChange}
          disabled={updating}
          options={[
            { value: 'unread', label: 'Unread', key: 'unread' },
            { value: 'title', label: 'Alphabetically', key: 'title' },
            { value: 'createdAt', label: 'Added Date', key: 'createdAt' }
          ]}
          labelInValue
        />
        <Button disabled={updating} type="default" onClick={handleUpdateChapters}>
          Update Chapters {updating && <Spin indicator={<LoadingOutlined spin />} size="small" />}
        </Button>
      </Flex>

      <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', marginTop: '24px' }}>
        {bookmarks.map((item, index) => {
          const unreadCount = getUnreadChapters(item.latestRead || '', item.latestChapter || '')
          return (
            <Card
              key={index}
              onClick={() => handleNavigate(item.provider, item.link, item.title)}
              title={
                <Tooltip title={item.title}>
                  <span>{item.title}</span>
                </Tooltip>
              }
              variant="borderless"
              style={{ width: '15%', cursor: 'pointer' }}
              extra={
                <Flex>
                  {unreadCount > 0 && (
                    <Tooltip title="Unread chapters">
                      <Tag color="blue-inverse">{unreadCount}</Tag>
                    </Tooltip>
                  )}
                  <Tooltip title="Delete bookmark" className="icon-hover-delete">
                    <DeleteOutlined
                      disabled={updating}
                      onClick={(e) => handleDeleteBookmark(e, item)}
                    />
                  </Tooltip>
                </Flex>
              }
            >
              <Image
                width="100%"
                src={item.cover}
                preview={false}
              />
              <Flex gap="4px 0" wrap style={{ marginTop: '20px' }}>
                {updating ? (
                  <Skeleton.Input active size="default" style={{ width: '80%', height: 20 }} />
                ) : (
                  <Tag color="geekblue">Latest chapter: {item.latestChapter}</Tag>
                )}
                {item.latestRead && <Tag color="cyan">Latest read: {item.latestRead}</Tag>}
              </Flex>
            </Card>
          )
        })}
      </div>
    </>
  )
}
