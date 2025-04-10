import { DeleteOutlined } from '@ant-design/icons'
import { Button, Card, Flex, Image, Input, Tag } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const Bookmarks: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [allBookmarks, setAllBookmarks] = useState<any[]>([]);
  const [orderAsc, setOrderAsc] = useState(true);

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
      }))
  
      const sorted = mappedBookmarks.sort((a, b) => a.title.localeCompare(b.title));
  
      setBookmarks(sorted);
      setAllBookmarks(sorted);
    }
  
    fetchBookmarks()
  }, []);
  
  const handleDeleteBookmark = async (e, item) => {
    e.stopPropagation(); 

    await window.api.toggleBookmark(item.title, item.link, item.cover, item.provider);

    setBookmarks(prev => prev.filter(b => b.link !== item.link));
  }

  const searchBookmarks = (value) => {
    const search = value.toLowerCase();
    const filtered = allBookmarks.filter(b => b.title.toLowerCase().includes(search));
    setBookmarks(filtered);
  };

  const handleOrder = () => {
    const sorted = [...bookmarks].sort((a, b) => {
      return orderAsc
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    });
    setBookmarks(sorted);
    setOrderAsc(!orderAsc);
  };
  
  const handleClear = () => {
    window.api.clearBookmarks()
    setBookmarks([])
  }

  return (
    <>
    <Flex gap={'22px'}>
      <Input onChange={(e) => searchBookmarks(e.target.value)} style={{ width: '45%' }} placeholder='Search from your bookmarks' />
      <Button onClick={() => { handleOrder() } }>Order</Button>
      <Button onClick={() => { handleClear() } }>Clear bookmarks</Button>
    </Flex>
    
    <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', marginTop: '24px' }}>
      {bookmarks.map((item) => (
        <Card
          onClick={() => handleNavigate(item.provider, item.link, item.title)}
          title={item.title}
          variant="borderless"
          style={{ width: '15%', cursor: 'pointer' }}
          extra={
            <Flex><div className="icon-hover-delete">
              <DeleteOutlined onClick={(e) => handleDeleteBookmark(e, item)} />
            </div></Flex>}
        >
          <Image width={'100%'} src={item.cover} preview={false} />
          <Flex gap="4px 0" wrap style={{ marginTop: '20px' }}>
          {item.latestRead && <Tag color="cyan">Lastest read: {item.latestRead}</Tag>}
          {item.latestRead && <Tag color="magenta">Lastest chapter: {item.latestRead}</Tag>}
          </Flex>
        </Card>
      ))}
    </div></>
  )
}
