/* eslint-disable react/display-name */
import React, { useEffect, useState, useMemo, useCallback, memo } from 'react'
import { DeleteOutlined, LoadingOutlined } from '@ant-design/icons'
import { Button, Card, Flex, Image, Input, Select, Skeleton, Spin, Tag, Tooltip } from 'antd'
import { useNavigate } from 'react-router-dom'
import { getUnreadChapters, mapBookmark, sortBookmarks } from './utils'
import { fetchSingleProxiedImage } from '@renderer/Features/Proxy/sinlgeProxy'

// Memoized individual card for reduced re-renders
const BookmarkCard = memo(
  ({
    item,
    onNavigate,
    onDelete,
    updating
  }: {
    item: any
    onNavigate: (provider: string, link: string, title: string) => void
    onDelete: (e: React.MouseEvent, item: any) => void
    updating: boolean
  }) => {
    const unreadCount = getUnreadChapters(item.latestRead || '', item.latestChapter || '')
    const [cover, setCover] = useState<string | null>(null)

    useEffect(() => {
      let mounted = true
      // Call your async proxy function here
      fetchSingleProxiedImage(item.provider, item.cover, {}).then(proxiedUrl => {
        if (mounted) {
          setCover(proxiedUrl)
        }
      })

      return () => {
        mounted = false
      }
    }, [item.provider, item.cover])

    return (
      <Card
        onClick={() => onNavigate(item.provider, item.link, item.title)}
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
            <Tooltip title="Delete bookmark">
              <DeleteOutlined onClick={e => onDelete(e, item)} disabled={updating} />
            </Tooltip>
          </Flex>
        }
      >
        {cover ? (
          <Image
            width="100%"
            src={cover}
            preview={false}
            loading="lazy"
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <Flex align="center" justify="center" style={{ height: 200 }}>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 24, margin: 'auto' }} spin />} />
          </Flex>
        )}
        <Flex gap="4px 0" wrap style={{ marginTop: '20px' }}>
          {updating ? (
            <Skeleton.Input active size="default" style={{ width: '80%', height: 20 }} />
          ) : (
            <Tag color="geekblue">Latest chapter: {item.latestChapter}</Tag>
          )}
          {item.latestRead && <Tag color="cyan">Last read: {item.latestRead}</Tag>}
        </Flex>
      </Card>
    )
  }
)

export const Bookmarks: React.FC = () => {
  const [allBookmarks, setAllBookmarks] = useState<any[]>([])
  const [updating, setUpdating] = useState(false)
  const [sortType, setSortType] = useState<string>('unread')
  const [searchTerm, setSearchTerm] = useState<string>('')

  const navigate = useNavigate()

  const fetchAndSetBookmarks = useCallback(async () => {
    const saved = await window.api.getBookmarks()
    const mapped = saved.map(mapBookmark)
    setAllBookmarks(mapped)
  }, [])

  useEffect(() => {
    fetchAndSetBookmarks()
  }, [fetchAndSetBookmarks])

  const handleNavigate = useCallback(
    (provider: string, link: string, title: string) => {
      navigate('/detail', { state: { provider, id: link, title } })
    },
    [navigate]
  )

  const handleDelete = useCallback(
    async (e: React.MouseEvent, item: any) => {
      e.stopPropagation()
      await window.api.toggleBookmark(item.title, item.link, item.cover, item.provider)
      setAllBookmarks(prev => prev.filter(b => b.link !== item.link))
    },
    [updating]
  )

  const handleSortChange = useCallback((value: any) => {
    setSortType(value.value)
  }, [])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }, [])

  const handleUpdateChapters = useCallback(async () => {
    setUpdating(true)
    for (const b of allBookmarks) {
      try {
        const result = await window.api.getExtensionResult(b.provider, 'latest', b.link)
        const safeLatest = typeof result.lastChapter === 'string' ? result.lastChapter : null
        if (safeLatest && safeLatest !== b.latestChapter) {
          await window.api.updateLatestChapter(b.title, b.link, b.provider, safeLatest)
          await window.api.addUpdateNotification({
            title: b.title,
            link: b.link,
            provider: b.provider,
            newChapter: safeLatest,
            date: new Date().toISOString()
          })
        }
      } catch (err) {
        console.error(`Error updating ${b.title}:`, err)
      }
    }
    await fetchAndSetBookmarks()
    setUpdating(false)
  }, [allBookmarks, fetchAndSetBookmarks])

  // Memoize filtered & sorted list
  const visibleBookmarks = useMemo(() => {
    let list = allBookmarks
    if (searchTerm) {
      const lower = searchTerm.toLowerCase()
      list = list.filter(b => b.title.toLowerCase().includes(lower))
    }
    return sortBookmarks(list, sortType)
  }, [allBookmarks, sortType, searchTerm])

  return (
    <>
      <Flex gap="22px">
        <Input
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ width: '45%' }}
          placeholder="Search from your bookmarks"
          disabled={updating}
        />
        <Select
          value={{ value: sortType, label: sortType }}
          style={{ width: 160 }}
          onChange={handleSortChange}
          disabled={updating}
          options={[
            { value: 'unread', label: 'Unread' },
            { value: 'title', label: 'Alphabetically' },
            { value: 'createdAt', label: 'Added Date' }
          ]}
          labelInValue
        />
        <Button disabled={updating} type="default" onClick={handleUpdateChapters}>
          Update Chapters {updating && <Spin indicator={<LoadingOutlined spin />} size="small" />}
        </Button>
      </Flex>

      <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', marginTop: '24px' }}>
        {visibleBookmarks.map(item => (
          <BookmarkCard
            key={item.link}
            item={item}
            onNavigate={handleNavigate}
            onDelete={handleDelete}
            updating={updating}
          />
        ))}
      </div>
    </>
  )
}
