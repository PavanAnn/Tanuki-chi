import {
  BookOutlined,
  LeftOutlined,
  RightOutlined,
  StarFilled,
  ZoomInOutlined,
  ZoomOutOutlined
} from '@ant-design/icons'
import { Button, Descriptions, Flex, Image, Radio, Tag, Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  BookmarkContainer,
  ChaptersContainer,
  ChaptersListWrapper,
  DetailTitle
} from './styles'
import { ThemedDivider } from '@renderer/Layout/SharedComponents/styles'
import { CustomDrawer } from './Drawer'
import { detailProviderMap } from '@renderer/Features/Store/Detail/useMangaDetailProvider'

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
  tags: string[]
  releaseDate: string
  description: string

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
  const [latest, setLatest] = useState<string | undefined>()
  const [pageSize, setPageSize] = useState(50)

  const provider = searchParams.get('provider')
  const link = searchParams.get('link')
  const title = searchParams.get('title')

  const providerFns = provider ? detailProviderMap[provider] : null
  if (!providerFns) {
    return <div onClick={() => console.log(window.location.href)}>Invalid or missing provider</div>
  }

  const { useDetail, usePages, imageProxyPrefix } = providerFns

  const { data, isFetching } = useDetail(link ?? '')
  const { data: allPages } = usePages(selectedLink ?? '')

  // Check if the manga is bookmarked
  useEffect(() => {
    const checkBookmarkDetails = async () => {
      if (!title || !link || !provider) return
      const bookmarks = await window.api.getBookmarks()
      const currentBookmark = bookmarks.find((b) => b.title === title && b.link === link)
      setBookmarked(Boolean(currentBookmark))
      if (currentBookmark?.latestRead) {
        setLatest(currentBookmark.latestRead)
      }
    }
    checkBookmarkDetails()
  }, [title, link])

  if (isFetching) {
    return <div>loading</div>
  }

  const showDrawer = (link: string, chapter: string) => {
    setSelectedChapter(chapter)
    setSelectedLink(link)
    setOpen(true)
  }

  const onClose = (chapter: string | null) => {
    if (!chapter) return
    if (latest !== chapter) handleLatestRead(chapter)
    setOpen(false)
    setSelectedLink(null)
  }

  const res: DetailManga = data?.response.data
  const pages: Pages[] = allPages?.response.data.pages ?? []

  // Toggle bookmark
  const handleBookmarkClick = async () => {
    if (title && link && provider) {
      const updatedBookmarks = await window.api.toggleBookmark(title, link, res.coverHref, provider)
      const isBookmarked = updatedBookmarks.some((b) => b.title === title && b.link === link)
      setBookmarked(isBookmarked)
    }
  }

  // Update latest read chapter
  const handleLatestRead = async (chapter: string) => {
    if (!title || !link) return
    const newLatest = latest === chapter ? undefined : chapter
    await window.api.updateLatestRead(title, link, newLatest ?? null)
    setLatest(newLatest)
  }

  const handleNextChapter = (link: string, chapter: string) => {
    setSelectedChapter(chapter)
    setSelectedLink(link)
  }

  const chapterIndex = res.chapters.findIndex((ch) => ch.text === selectedChapter)

  const changeChapter = (offset: number, chapter: string | null) => {
    if (chapter) handleLatestRead(chapter)

    const target = res.chapters[chapterIndex + offset]
    if (target) {
      handleNextChapter(target.href, target.text)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: '28px', flexDirection: 'row' }}>
        <Image
          width={200}
          src={`http://127.0.0.1:3000/api/${imageProxyPrefix}/mangas/image-proxy?url=${encodeURIComponent(res.coverHref)}`}
          preview={true}
        />
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '60%' }}>
          <DetailTitle>
            {title}
            <BookmarkContainer>
              {bookmarked ? (
                <Tooltip title='Remove from bookmarks'>
                  <Button type="primary" shape="circle" icon={<StarFilled
                    onClick={handleBookmarkClick}
                    style={{ fontSize: '22px', color: '#FFFF00' }}
                  />} />
                </Tooltip>
                
              ) : (
                <Tooltip title='Save into bookmarks'>
                <Button variant='solid' type="primary" shape="circle" icon={<StarFilled
                  onClick={handleBookmarkClick}
                  style={{ fontSize: '22px', color: '#FFFFFF' }}
                />} />
                </Tooltip>
              )}
            </BookmarkContainer>
          </DetailTitle>
          <ThemedDivider />
          <Descriptions
            title="Manga Info"
            column={1}
            size="small"
            style={{ maxWidth: '80%' }}
          >
            <Descriptions.Item label="Author">{res.author}</Descriptions.Item>
            <Descriptions.Item label="Status">{res.status}</Descriptions.Item>
            <Descriptions.Item label="Latest Chapter">{res.latestChapter}</Descriptions.Item>
            <Descriptions.Item label="Release Date">{res.releaseDate}</Descriptions.Item>
            <Descriptions.Item label="Tags">
              {res.tags.map((tag: string) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </Descriptions.Item>
            <Descriptions.Item label="Description">
              {res.description}
            </Descriptions.Item>
          </Descriptions>
        </div>
      </div>
      <ThemedDivider />
      <ChaptersListWrapper>
        {res.chapters.map((element, index) => (
          <ChaptersContainer isLatest={element.text === latest} key={index}>
            <div
              key={element.href}
              onClick={() => showDrawer(element.href, element.text)}
              style={{ cursor: 'pointer' }}
            >
              {element.text}
            </div>
            <BookOutlined
              onClick={() => {
                handleLatestRead(element.text)
              }}
              style={{ cursor: 'pointer', color: element.text === latest ? '#FFFF00' : '#433D8B' }}
            />
          </ChaptersContainer>
        ))}
      </ChaptersListWrapper>

      <CustomDrawer
        open={open}
        onClose={() => {
          onClose(selectedChapter)
        }}
        chapter={selectedChapter}
        title={`${title}  -  ${selectedChapter}`}
        width="90%"
        extra={
          <Flex gap="16px">
            <Button
              disabled={chapterIndex === res.chapters.length - 1}
              onClick={() => changeChapter(1, selectedChapter)}
              shape="default"
              icon={<LeftOutlined />}
            >
              Previous chapter
            </Button>

            <Button
              disabled={chapterIndex === 0}
              onClick={() => changeChapter(-1, selectedChapter)}
              shape="default"
              icon={<RightOutlined />}
            >
              Next chapter
            </Button>
            <Radio.Group>
              <Radio.Button
                onClick={() => setPageSize(pageSize < 90 ? pageSize + 10 : 100)}
                value="default"
              >
                <ZoomInOutlined style={{ color: '#000957' }} />
              </Radio.Button>
              <Radio.Button
                onClick={() => setPageSize(pageSize > 20 ? pageSize - 10 : 20)}
                value="default"
              >
                <ZoomOutOutlined style={{ color: '#000957' }} />
              </Radio.Button>
            </Radio.Group>
          </Flex>
        }
      >
        <Flex
          style={{ overflowY: 'auto', paddingRight: 10, width: '100%' }}
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
                src={`http://127.0.0.1:3000/api/${imageProxyPrefix}/mangas/image-proxy?url=${encodeURIComponent(element.href)}`}
                preview={false}
              />
            </Flex>
          ))}
        </Flex>
      </CustomDrawer>
    </div>
  )
}
