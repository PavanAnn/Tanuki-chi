// src/components/MangaDetail.tsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Image, Button, Tag, Tooltip, Spin, Descriptions, Flex, Radio } from 'antd';
import { BookOutlined, LeftOutlined, RightOutlined, StarFilled, ZoomInOutlined, ZoomOutOutlined, LoadingOutlined } from '@ant-design/icons';
import { ThemedDivider } from '@renderer/Layout/SharedComponents/styles';
import { CustomDrawer } from './Drawer';
import { BookmarkContainer, ChaptersContainer, ChaptersListWrapper, DetailTitle } from './styles';
import { useMangaDetail } from '../../Features/Hooks/useMangaDetail';
import { useMangaPages } from '../../Features/Hooks/useMangaPages';
import { useProxiedImages } from '../../Features/Hooks/useProxiedImages';

interface Chapter {
  id: string;
  attributes: {
    chapter: string;
    title: string;
  };
}

export const MangaDetail = () => {
  const { state } = useLocation() as { state: { provider: string; id: string; title: string } };
  const { provider, id, title } = state || {};
  const navigate = useNavigate();

  if (!provider || !id || !title) return <div>Invalid or missing provider, id, or title.</div>;

  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [pageSize, setPageSize] = useState(50);
  const [latestRead, setLatestRead] = useState<string | undefined>(undefined);

  const { detail, chapters, isLoading } = useMangaDetail(provider, id);
  const selectedChapterId = selectedChapter?.id || '';
  const pagesQuery = useMangaPages(provider, selectedChapterId);
  const pages = pagesQuery.data ?? [];
  const proxiedImages = useProxiedImages(pages);

  useEffect(() => {
    (async () => {
      const bookmarks = await window.api.getBookmarks();
      const current = bookmarks.find((b: any) => b.title === title && b.link === id);
      setBookmarked(Boolean(current));
      if (current?.latestRead) {
        setLatestRead(current.latestRead);
      }
    })();
  }, [title, id, provider]);

  if (isLoading) {
    return (
      <Flex align="center" gap="middle">
        <Spin tip={<div onClick={() => navigate('/')}>Fetching details</div>} fullscreen indicator={<LoadingOutlined spin />} size="large" />
      </Flex>
    );
  }

  // Handlers.
  const handleChapterSelect = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    if (selectedChapter && latestRead !== selectedChapter.attributes.chapter) {
      handleLatestRead(selectedChapter);
    }
    setDrawerOpen(false);
  };

  if (!detail) {
    return <div>error</div>
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
      : chapters?.[0]?.attributes?.chapter ?? ''
      );
        setBookmarked(updated.some((b: any) => b.title === title && b.link === id));
  };

  const handleLatestRead = async (chapter: Chapter) => {
    const newLatest = latestRead === chapter.attributes.chapter ? undefined : chapter.attributes.chapter;
    await window.api.updateLatestRead(title, id, newLatest ?? null);
    setLatestRead(newLatest);
  };

  const chapterIndex = chapters ? chapters.findIndex(ch => ch.id === selectedChapter?.id) : -1;
  const changeChapter = (offset: number) => {
    if (!chapters || chapterIndex < 0) return;
    const target = chapters[chapterIndex + offset];
    if (target) setSelectedChapter(target);
  };


  return (
    <div>
      {/* Cover and manga info */}
      <div style={{ display: 'flex', gap: '28px', flexDirection: 'row' }}>
        <Image width={300} src={detail.coverUrl} preview={true} />
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '60%' }}>
          <DetailTitle>
            {detail.title}
            <BookmarkContainer>
              {bookmarked ? (
                <Tooltip title="Remove from bookmarks">
                  <Button type="primary" shape="circle" icon={<StarFilled onClick={handleBookmarkClick} style={{ fontSize: '22px', color: '#FFFF00' }} />} />
                </Tooltip>
              ) : (
                <Tooltip title="Save into bookmarks">
                  <Button type="primary" shape="circle" icon={<StarFilled onClick={handleBookmarkClick} style={{ fontSize: '22px', color: '#FFFFFF' }} />} />
                </Tooltip>
              )}
            </BookmarkContainer>
          </DetailTitle>
          <ThemedDivider />
          <Descriptions title="Manga Info" column={1} size="small" style={{ maxWidth: '80%' }}>
            <Descriptions.Item label="Author">{detail.author}</Descriptions.Item>
            <Descriptions.Item label="Status">{detail.status}</Descriptions.Item>
            <Descriptions.Item label="Latest Chapter">{detail.lastChapter}</Descriptions.Item>
            <Descriptions.Item label="Release Date">{detail.releaseDate}</Descriptions.Item>
            <Descriptions.Item label="Tags">
              {detail.tags.map((tag: string) => (<Tag key={tag}>{tag}</Tag>))}
            </Descriptions.Item>
            <Descriptions.Item label="Description">{detail.description}</Descriptions.Item>
          </Descriptions>
        </div>
      </div>
      <ThemedDivider />
      {/* Chapters List */}
      <ChaptersListWrapper>
        {chapters?.map(ch => {
          const chapterDisplay = `${ch.attributes.chapter}${ch.attributes.title ? ' - ' + ch.attributes.title : ''}`;
          return (
            <ChaptersContainer key={ch.id} isLatest={latestRead === ch.attributes.chapter}>
              <div onClick={() => handleChapterSelect(ch)} style={{ cursor: 'pointer' }}>
                {chapterDisplay}
              </div>
              <BookOutlined
                onClick={() => handleLatestRead(ch)}
                style={{ cursor: 'pointer', color: latestRead === ch.attributes.chapter ? '#FFFF00' : '#433D8B' }}
              />
            </ChaptersContainer>
          );
        })}
      </ChaptersListWrapper>
      {/* Drawer for Pages */}
      <CustomDrawer
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        chapter={selectedChapter ? `${selectedChapter.attributes.chapter}${selectedChapter.attributes.title ? ' - ' + selectedChapter.attributes.title : ''}` : ''}
        title={`${detail.title} - ${selectedChapter ? `${selectedChapter.attributes.chapter}${selectedChapter.attributes.title ? ' - ' + selectedChapter.attributes.title : ''}` : ''}`}
        width="90%"
        extra={
          <Flex gap="16px">
            <Button disabled={chapterIndex === -1 || chapterIndex === (chapters?.length || 0) - 1} onClick={() => changeChapter(1)} shape="default" icon={<LeftOutlined />}>
              Previous chapter
            </Button>
            <Button disabled={chapterIndex <= 0} onClick={() => changeChapter(-1)} shape="default" icon={<RightOutlined />}>
              Next chapter
            </Button>
            <Radio.Group>
              <Radio.Button onClick={() => setPageSize(pageSize < 90 ? pageSize + 10 : 100)} value="default">
                <ZoomInOutlined style={{ color: '#000957' }} />
              </Radio.Button>
              <Radio.Button onClick={() => setPageSize(pageSize > 20 ? pageSize - 10 : 20)} value="default">
                <ZoomOutOutlined style={{ color: '#000957' }} />
              </Radio.Button>
            </Radio.Group>
          </Flex>
        }
      >
        <Flex style={{ overflowY: 'auto', paddingRight: 10, width: '100%' }} vertical align="center">
          {pagesQuery.isFetching ? (
            <Flex align="center" gap="middle">
              <Spin tip={<div>Fetching pages...</div>} fullscreen indicator={<LoadingOutlined spin />} size="large" />
            </Flex>
          ) : pages.length > 0 ? (
            pages.map(page => (
              <Flex key={page.href} style={{ width: `${pageSize}%`, marginBottom: 16 }} justify="center" align="center">
                <Image width="100%" src={proxiedImages?.[page.href] || ''} preview={false} />
              </Flex>
            ))
          ) : (
            <div>No pages available</div>
          )}
        </Flex>
      </CustomDrawer>
    </div>
  );
};

export default MangaDetail;
