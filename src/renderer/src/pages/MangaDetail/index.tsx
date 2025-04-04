import { StarFilled, StarOutlined, ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons'
import {
  useGetDetailMangasWeebCentral,
  useGetMangasPagesWeebCentral
} from '@renderer/Features/Fetchers/WeebCentral/Hooks'
import { Divider, Drawer, Flex, Image } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { BookmarkContainer, ChaptersContainer, DetailInfoContainer, DetailTitle } from './styles'

interface Chapters {
  text: string
  href: string
}

interface DetailManga {
  author: string
  status: string
  latestChapter: string
  chapters: Chapters[]
  coverHref: string
}

interface Pages {
  text: string
  href: string
}

export const MangaDetail = () => {
  const [searchParams] = useSearchParams()
  const [open, setOpen] = useState(false)
  const [selectedLink, setSelectedLink] = useState<string | null>(null)
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null)
  const [bookmarked, setBookmarked] = useState(false)
  const [pageSize, setPageSize] = useState(50)
  const scrollRef = useRef<HTMLDivElement>(null)
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const link = searchParams.get('link')
  const title = searchParams.get('title')

  const { data, isFetching } = useGetDetailMangasWeebCentral(link ?? '')
  const { data: allPages, isLoading } = useGetMangasPagesWeebCentral(selectedLink ?? '')

  // Verifica se o manga atual está nos bookmarks sempre que title ou link mudarem
  useEffect(() => {
    const checkBookmark = async () => {
      if (title && link) {
        const bookmarks = await window.api.getBookmarks()
        const isBookmarked = bookmarks.some((b) => b.title === title && b.link === link)
        setBookmarked(isBookmarked)
      }
    }
    checkBookmark()
  }, [title, link])

  const startScrolling = (direction: 'up' | 'down') => {
    const container = scrollRef.current
    if (!container) return

    const scrollAmount = direction === 'down' ? 30 : -30

    scrollIntervalRef.current = setInterval(() => {
      container.scrollBy({ top: scrollAmount, behavior: 'auto' })
    }, 16)
  }

  const stopScrolling = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current)
      scrollIntervalRef.current = null
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open || scrollIntervalRef.current) return

      if (['ArrowDown', 'ArrowRight', 's', 'S', 'd', 'D'].includes(e.key)) {
        e.preventDefault()
        startScrolling('down')
      }

      if (['ArrowUp', 'ArrowLeft', 'w', 'W', 'a', 'A'].includes(e.key)) {
        e.preventDefault()
        startScrolling('up')
      }
    }

    const handleKeyUp = () => {
      stopScrolling()
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      stopScrolling()
    }
  }, [open])

  if (isFetching) {
    return <div>loading</div>
  }

  const showDrawer = (link: string, chapter: string) => {
    setSelectedChapter(chapter)
    setSelectedLink(link)
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
    setSelectedLink(null)
  }

  const res: DetailManga = data?.response.data
  const pages: Pages[] = allPages?.response.data.pages ?? []

  // Toggle de bookmark
  const handleBookmarkClick = async () => {
    if (title && link) {
      const updatedBookmarks = await window.api.toggleBookmark(title, link, res.coverHref)
      const isBookmarked = updatedBookmarks.some((b) => b.title === title && b.link === link)
      setBookmarked(isBookmarked)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: '28px', flexDirection: 'row' }}>
        <Image width={200} src={res.coverHref} preview={true} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <DetailTitle>
            {title}
            <BookmarkContainer>
              {bookmarked ? (
                <StarFilled
                  onClick={handleBookmarkClick}
                  style={{ fontSize: '22px', color: '#FFFF00' }}
                />
              ) : (
                <StarOutlined
                  onClick={handleBookmarkClick}
                  style={{ fontSize: '22px', color: '#FFFFFF' }}
                />
              )}
            </BookmarkContainer>
          </DetailTitle>
          <Divider style={{ borderColor: '#171738' }} />
          <DetailInfoContainer>
            <p>Author: {res.author}</p>
            <p>Status: {res.status}</p>
            <p>Latest Chapter: {res.latestChapter}</p>
          </DetailInfoContainer>
        </div>
      </div>

      <Divider style={{ borderColor: '#171738' }} />
      {res.chapters.map((element) => (
        <ChaptersContainer
          key={element.href}
          onClick={() => showDrawer(element.href, element.text)}
        >
          {element.text}
        </ChaptersContainer>
      ))}
      <Drawer
        aria-roledescription="navigation"
        width={'90%'}
        extra={
          <Flex gap={'16px'}>
            <ZoomInOutlined onClick={() => setPageSize(pageSize < 90 ? pageSize + 10 : 100)} />
            <ZoomOutOutlined onClick={() => setPageSize(pageSize > 20 ? pageSize - 10 : 20)} />
          </Flex>
        }
        title={title + '  -  ' + selectedChapter}
        onClose={onClose}
        open={open}
        loading={isLoading}
        styles={{
          body: { alignItems: 'center', display: 'flex', flexDirection: 'column', padding: '0' }
        }}
      >
        <Flex
          ref={scrollRef}
          style={{
            overflowY: 'auto',
            paddingRight: 10,
            width: '100%'
          }}
          vertical
          align="center"
        >
          {pages.map((element) => (
            <Flex
              key={element.href}
              style={{ width: `${pageSize}%`, marginBottom: 16 }}
              justify="center"
              align="center"
            >
              <Image
                width="100%"
                src={`http://localhost:3000/api/weebcentral/mangas/image-proxy?url=${encodeURIComponent(element.href)}`}
                preview={false}
              />
            </Flex>
          ))}
        </Flex>
      </Drawer>
    </div>
  )
}
