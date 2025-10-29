// src/components/MangaDetail.tsx
import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Image, Button, Tag, Tooltip, Spin, Descriptions, Flex, Radio, Select } from 'antd'
import {
  BookOutlined,
  LeftOutlined,
  RightOutlined,
  StarFilled,
  ZoomInOutlined,
  ZoomOutOutlined,
  LoadingOutlined
} from '@ant-design/icons'
import { ThemedDivider } from '@renderer/Layout/SharedComponents/styles'
import { CustomDrawer } from './Drawer'
import { BookmarkContainer, ChaptersContainer, ChaptersListWrapper, DetailTitle } from './styles'
import { useMangaDetail } from '../../Features/Hooks/useMangaDetail'
import { useMangaPages } from '../../Features/Hooks/useMangaPages'
import { fetchSingleProxiedImage, requiresProxy } from '@renderer/Features/Proxy/sinlgeProxy'
import moment from 'moment'

interface Chapter {
  id: string
  attributes: {
    chapter: string
    title: string
  }
}

export const MangaDetail = () => {
  const { state } = useLocation() as { state: { provider: string; id: string; title: string } }
  const { provider, id, title } = state || {}
  const navigate = useNavigate()
  
  // All hooks must be called before any conditional returns
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null)
  const [bookmarked, setBookmarked] = useState(false)
  const [pageSize, setPageSize] = useState(50)
  const [latestRead, setLatestRead] = useState<string | undefined>(undefined)
  const [readingMode, setReadingMode] = useState<'vertical' | 'horizontal' | 'click'>('vertical')
  const [pagesPerView, setPagesPerView] = useState<1 | 2>(1)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [proxiedCoverUrl, setProxiedCoverUrl] = useState<string | null>(null)

  const { detail, chapters, isLoading, isError } = useMangaDetail(provider, id || '')
  const selectedChapterId = selectedChapter?.id || ''
  const pagesQuery = useMangaPages(provider, selectedChapterId)
  const pages = pagesQuery.data ?? []

  const providerNeedsProxy = requiresProxy(provider || '')

  useEffect(() => {
    if (!title || !id || !provider) return
    ;(async () => {
      const bookmarks = await window.api.getBookmarks()
      const current = bookmarks.find((b: any) => b.title === title && b.link === id)
      setBookmarked(Boolean(current))
      if (current?.latestRead) {
        setLatestRead(current.latestRead)
      }
    })()
  }, [title, id, provider])

  useEffect(() => {
    if (!detail?.coverUrl || !provider) return
    ;(async () => {
      const proxiedUrl = await fetchSingleProxiedImage(provider, detail.coverUrl, {})
      setProxiedCoverUrl(proxiedUrl)
    })()
  }, [detail?.coverUrl, provider])

  // Reset page index when changing reading modes and handle horizontal mode
  useEffect(() => {
    setCurrentPageIndex(0)
    // Horizontal scroll always uses single page view
    if (readingMode === 'horizontal') {
      setPagesPerView(1)
    }
    // Click mode default to 100% page size
    if (readingMode === 'click') {
      setPageSize(100)
    }
  }, [readingMode, pagesPerView])

  // Mouse idle detection for click mode
  useEffect(() => {
    if (!isDrawerOpen || readingMode !== 'click') {
      setShowControls(true)
      return
    }

    let timer: NodeJS.Timeout | null = null

    const handleMouseMove = () => {
      setShowControls(true)
      
      if (timer) {
        clearTimeout(timer)
      }
      
      timer = setTimeout(() => {
        setShowControls(false)
      }, 2000) // Hide after 2 seconds of no mouse movement
    }

    window.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [isDrawerOpen, readingMode])

  // Keyboard navigation for click mode
  useEffect(() => {
    if (!isDrawerOpen || readingMode !== 'click') return

    const handleKeyDown = (e: KeyboardEvent) => {
      const increment = pagesPerView === 2 ? 2 : 1
      const decrement = pagesPerView === 2 ? 2 : 1
      
      if (e.key === 'ArrowLeft') {
        setCurrentPageIndex(prev => {
          if (prev - decrement >= 0) {
            return prev - decrement
          }
          return prev
        })
      } else if (e.key === 'ArrowRight') {
        setCurrentPageIndex(prev => {
          if (prev + increment < pages.length) {
            return prev + increment
          }
          return prev
        })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isDrawerOpen, readingMode, pagesPerView, pages.length])
  
  // Check for invalid state after all hooks are called
  if (!provider || !id || !title) return <div>Invalid or missing provider, id, or title.</div>

  if (isLoading) {
    return (
      <Flex align="center" gap="middle">
        <Spin
          tip={<div onClick={() => navigate('/')}>Fetching details</div>}
          fullscreen
          indicator={<LoadingOutlined spin />}
          size="large"
        />
      </Flex>
    )
  }

  if (isError) {
    return <div>Error</div>
  }

  if (!detail) {
    return <div>error</div>
  }

  // Handlers.
  const handleChapterSelect = (chapter: Chapter) => {
    setSelectedChapter(chapter)
    setDrawerOpen(true)
  }

  const handleDrawerClose = () => {
    if (selectedChapter && latestRead !== selectedChapter.attributes.chapter) {
      handleLatestRead(selectedChapter)
    }
    setDrawerOpen(false)
    setCurrentPageIndex(0)
  }

  const handleNextPage = () => {
    const increment = pagesPerView === 2 ? 2 : 1
    if (currentPageIndex + increment < pages.length) {
      setCurrentPageIndex(currentPageIndex + increment)
    }
  }

  const handlePreviousPage = () => {
    const decrement = pagesPerView === 2 ? 2 : 1
    if (currentPageIndex - decrement >= 0) {
      setCurrentPageIndex(currentPageIndex - decrement)
    }
  }
  const handleBookmarkClick = async () => {
    const updated = await window.api.toggleBookmark(
      title,
      id,
      detail.coverUrl,
      provider,
      '',
      detail.lastChapter?.trim() !== ''
        ? detail.lastChapter
        : (chapters?.[0]?.attributes?.chapter ?? '')
    )
    setBookmarked(updated.some((b: any) => b.title === title && b.link === id))
  }

  const handleLatestRead = async (chapter: Chapter) => {
    const newLatest =
      latestRead === chapter.attributes.chapter ? undefined : chapter.attributes.chapter
    await window.api.updateLatestRead(title, id, newLatest ?? null)
    setLatestRead(newLatest)
  }

  const chapterIndex = chapters ? chapters.findIndex(ch => ch.id === selectedChapter?.id) : -1
  const changeChapter = (offset: number) => {
    if (!chapters || chapterIndex < 0) return
    const target = chapters[chapterIndex + offset]
    if (target) {
      setSelectedChapter(target)
      setCurrentPageIndex(0) // Reset to first page when changing chapters
    }
  }

  return (
    <div>
      {/* Cover and manga info */}
      <div
        style={{ display: 'flex', gap: '28px', flexDirection: 'row' }}
        onClick={() => console.log(pagesQuery)}
      >
        <Image 
          width={300} 
          src={proxiedCoverUrl || detail.coverUrl} 
          preview={true}
          style={{ borderRadius: '12px' }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '60%' }}>
          <DetailTitle>
            {detail.title}
            <BookmarkContainer>
              <Tooltip title={bookmarked ? "Remove from bookmarks" : "Save into bookmarks"}>
                <Button
                  type="primary"
                  shape="circle"
                  icon={
                    <StarFilled
                      onClick={handleBookmarkClick}
                      style={{ fontSize: '22px', color: bookmarked ? '#FFFF00' : '#FFFFFF' }}
                    />
                  }
                />
              </Tooltip>
            </BookmarkContainer>
          </DetailTitle>
          <ThemedDivider />
          <Descriptions title="Manga Info" column={1} size="small" style={{ maxWidth: '80%' }}>
            <Descriptions.Item label="Author">{detail.author}</Descriptions.Item>
            <Descriptions.Item label="Status">{detail.status}</Descriptions.Item>
            <Descriptions.Item label="Latest Chapter">{detail.lastChapter}</Descriptions.Item>
            <Descriptions.Item label="Release Date">{detail.releaseDate}</Descriptions.Item>
            <Descriptions.Item label="Tags">
              {detail.tags.map((tag: string) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </Descriptions.Item>
            <Descriptions.Item label="Description">{detail.description}</Descriptions.Item>
          </Descriptions>
          <Flex style={{ marginTop: '20px' }}>Extension: {provider}</Flex>
        </div>
      </div>
      <ThemedDivider />
      {/* Chapters List */}
      <ChaptersListWrapper>
        <h1 onClick={() => console.log(chapters)}>Chapters</h1>
        {chapters?.map(ch => {
          const chapterDisplay = `${ch.attributes.chapter}${ch.attributes.title ? ' - ' + ch.attributes.title : ''}`
          return (
            <ChaptersContainer key={ch.id} isLatest={latestRead === ch.attributes.chapter}>
              <div onClick={() => handleChapterSelect(ch)}>
                {chapterDisplay} -{' '}
                {moment(ch.attributes.releaseDate).locale('en').format('DD MMM YYYY')}
              </div>
              <BookOutlined
                onClick={() => handleLatestRead(ch)}
                style={{
                  cursor: 'pointer',
                  color: latestRead === ch.attributes.chapter ? '#FFFF00' : 'currentColor'
                }}
              />
            </ChaptersContainer>
          )
        })}
      </ChaptersListWrapper>
      {/* Drawer for Pages */}
      <CustomDrawer
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        showHeader={readingMode === 'click' ? showControls : true}
        floatingHeader={readingMode === 'click'}
        chapter={
          selectedChapter
            ? `${selectedChapter.attributes.chapter}${selectedChapter.attributes.title ? ' - ' + selectedChapter.attributes.title : ''}`
            : ''
        }
        title={`${detail.title} - ${selectedChapter ? `${selectedChapter.attributes.chapter}${selectedChapter.attributes.title ? ' - ' + selectedChapter.attributes.title : ''}` : ''}`}
        width="95%"
        extra={
          <Flex gap="12px" wrap>
            <Button
              disabled={chapterIndex === -1 || chapterIndex === (chapters?.length || 0) - 1}
              onClick={() => changeChapter(1)}
              type={readingMode === 'click' ? 'text' : 'default'}
              size={readingMode === 'click' ? 'small' : 'middle'}
              icon={<LeftOutlined />}
              style={{ borderRadius: '16px' }}
            />
            <Button
              disabled={chapterIndex <= 0}
              onClick={() => changeChapter(-1)}
              type={readingMode === 'click' ? 'text' : 'default'}
              size={readingMode === 'click' ? 'small' : 'middle'}
              icon={<RightOutlined />}
              style={{ borderRadius: '16px' }}
            />
            
            {/* Reading Mode Selector */}
            <Select
              value={readingMode}
              onChange={setReadingMode}
              size={readingMode === 'click' ? 'small' : 'middle'}
              style={{ 
                width: readingMode === 'click' ? '100px' : '160px',
                borderRadius: '16px'
              }}
              popupClassName="rounded-select-dropdown"
              options={[
                { value: 'vertical', label: readingMode === 'click' ? 'Vertical' : 'Vertical Scroll' },
                { value: 'horizontal', label: readingMode === 'click' ? 'Horizontal' : 'Horizontal Scroll' },
                { value: 'click', label: readingMode === 'click' ? 'Click' : 'Click Navigation' }
              ]}
            />
            
            {/* Pages Per View - only for vertical scroll and click navigation */}
            {readingMode !== 'horizontal' && (
              <Select
                value={pagesPerView}
                onChange={setPagesPerView}
                size={readingMode === 'click' ? 'small' : 'middle'}
                style={{ 
                  width: readingMode === 'click' ? '80px' : '140px',
                  borderRadius: '16px'
                }}
                popupClassName="rounded-select-dropdown"
                options={[
                  { value: 1, label: readingMode === 'click' ? 'Single' : 'Single Page' },
                  { value: 2, label: readingMode === 'click' ? 'Double' : 'Double Page' }
                ]}
              />
            )}
            
            {/* Zoom controls */}
            <Radio.Group 
              size={readingMode === 'click' ? 'small' : 'middle'}
              style={{ borderRadius: '16px' }}
            >
              <Radio.Button
                onClick={() => setPageSize(pageSize < 90 ? pageSize + 10 : 100)}
                type={readingMode === 'click' ? 'text' : 'default'}
              >
                <ZoomInOutlined />
              </Radio.Button>
              <Radio.Button
                onClick={() => setPageSize(pageSize > 20 ? pageSize - 10 : 20)}
                type={readingMode === 'click' ? 'text' : 'default'}
              >
                <ZoomOutOutlined />
              </Radio.Button>
            </Radio.Group>
          </Flex>
        }
      >
        {pagesQuery.isFetching ? (
          <Flex align="center" gap="middle">
            <Spin
              tip={<div>Fetching pages...</div>}
              fullscreen
              indicator={<LoadingOutlined spin />}
              size="large"
            />
          </Flex>
        ) : pages.length > 0 ? (
          <>
            {/* Vertical Scroll Mode */}
            {readingMode === 'vertical' && (
              <Flex
                style={{ overflowY: 'auto', paddingRight: 10, width: '100%' }}
                vertical
                align="center"
              >
                {pagesPerView === 1
                  ? pages.map((page, index) => (
                      <Flex
                        key={index}
                        style={{ width: `${pageSize}%`, marginBottom: 16 }}
                        justify="center"
                        align="center"
                      >
                        <Image
                          width="100%"
                          src={providerNeedsProxy ? `data:image/jpeg;base64,${page.data}` : page.href}
                          alt={page.text}
                          preview={false}
                        />
                      </Flex>
                    ))
                  : pages.reduce((acc, page, index) => {
                      if (index % 2 === 0) {
                        const nextPage = pages[index + 1]
                        acc.push(
                          <Flex
                            key={index}
                            style={{ width: `${pageSize}%`, marginBottom: 16 }}
                            justify="center"
                            align="center"
                            gap="8px"
                          >
                            <Image
                              width="50%"
                              src={providerNeedsProxy ? `data:image/jpeg;base64,${page.data}` : page.href}
                              alt={page.text}
                              preview={false}
                            />
                            {nextPage && (
                              <Image
                                width="50%"
                                src={
                                  providerNeedsProxy
                                    ? `data:image/jpeg;base64,${nextPage.data}`
                                    : nextPage.href
                                }
                                alt={nextPage.text}
                                preview={false}
                              />
                            )}
                          </Flex>
                        )
                      }
                      return acc
                    }, [] as JSX.Element[])}
              </Flex>
            )}

            {/* Horizontal Scroll Mode - Always single page */}
            {readingMode === 'horizontal' && (
              <Flex
                style={{ 
                  overflowX: 'auto', 
                  overflowY: 'hidden',
                  width: '100%', 
                  height: '100%',
                  paddingBottom: '10px'
                }}
                align="center"
                gap="16px"
              >
                {pages.map((page, index) => (
                  <Flex
                    key={index}
                    style={{ height: `${pageSize}%`, flexShrink: 0 }}
                    justify="center"
                    align="center"
                  >
                    <Image
                      height="100%"
                      src={providerNeedsProxy ? `data:image/jpeg;base64,${page.data}` : page.href}
                      alt={page.text}
                      preview={false}
                    />
                  </Flex>
                ))}
              </Flex>
            )}

            {/* Click Navigation Mode */}
            {readingMode === 'click' && (
              <Flex
                style={{ 
                  width: '100%', 
                  height: '100%',
                  position: 'relative',
                  overflowY: 'auto',
                  background: 'var(--reader-bg)',
                  padding: '20px 0'
                }}
                justify="center"
                align="center"
              >
                {pagesPerView === 1 ? (
                  pages[currentPageIndex] && (
                    <Flex style={{ width: `${pageSize}%`, marginBottom: '16px' }} justify="center" align="center">
                      <Image
                        width="100%"
                        src={
                          providerNeedsProxy
                            ? `data:image/jpeg;base64,${pages[currentPageIndex].data}`
                            : pages[currentPageIndex].href
                        }
                        alt={pages[currentPageIndex].text}
                        preview={false}
                      />
                    </Flex>
                  )
                ) : (
                  <Flex
                    style={{ width: `${pageSize}%`, marginBottom: '16px' }}
                    justify="center"
                    align="center"
                    gap="8px"
                  >
                    {pages[currentPageIndex] && (
                      <Image
                        width="50%"
                        src={
                          providerNeedsProxy
                            ? `data:image/jpeg;base64,${pages[currentPageIndex].data}`
                            : pages[currentPageIndex].href
                        }
                        alt={pages[currentPageIndex].text}
                        preview={false}
                      />
                    )}
                    {pages[currentPageIndex + 1] && (
                      <Image
                        width="50%"
                        src={
                          providerNeedsProxy
                            ? `data:image/jpeg;base64,${pages[currentPageIndex + 1].data}`
                            : pages[currentPageIndex + 1].href
                        }
                        alt={pages[currentPageIndex + 1].text}
                        preview={false}
                      />
                    )}
                  </Flex>
                )}
                
                {/* Navigation Controls for Click Mode - Floating pill style */}
                <Flex 
                  justify="center" 
                  align="center"
                  gap="16px" 
                  style={{ 
                    position: 'fixed',
                    bottom: '25px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'var(--loading-indicator-bg)',
                    padding: '12px 24px',
                    borderRadius: '24px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    zIndex: 1000,
                    opacity: showControls ? 1 : 0,
                    pointerEvents: showControls ? 'auto' : 'none',
                    transition: 'opacity 0.3s ease'
                  }}
                >
                  <Button
                    onClick={handlePreviousPage}
                    disabled={currentPageIndex === 0}
                    icon={<LeftOutlined />}
                    size="middle"
                    type="text"
                    style={{ borderRadius: '16px' }}
                  >
                    Previous
                  </Button>
                  <span style={{ 
                    lineHeight: '32px', 
                    fontSize: '14px', 
                    fontWeight: '500',
                    color: 'var(--loading-indicator-text)',
                    minWidth: '80px',
                    textAlign: 'center'
                  }}>
                    {pagesPerView === 1 
                      ? `${currentPageIndex + 1} / ${pages.length}`
                      : `${currentPageIndex + 1}-${Math.min(currentPageIndex + 2, pages.length)} / ${pages.length}`
                    }
                  </span>
                  <Button
                    onClick={handleNextPage}
                    disabled={currentPageIndex + pagesPerView >= pages.length}
                    icon={<RightOutlined />}
                    iconPosition="end"
                    size="middle"
                    type="text"
                    style={{ borderRadius: '16px' }}
                  >
                    Next
                  </Button>
                </Flex>
              </Flex>
            )}
          </>
        ) : (
          <div>No pages available</div>
        )}
      </CustomDrawer>
    </div>
  )
}

export default MangaDetail
