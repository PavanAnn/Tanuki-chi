import { Button, Upload, message } from 'antd'
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'

export const SharePage: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<any[]>([])

  useEffect(() => {
    const fetchBookmarks = async () => {
      const savedBookmarks = await window.api.getBookmarks()
      const mappedBookmarks = savedBookmarks.map((item: any) => ({
        title: item.title,
        link: item.link,
        cover: item.coverHref,
        provider: item.provider,
        latestRead: item.latestRead
      }))
      setBookmarks(mappedBookmarks)
    }

    fetchBookmarks()
  }, [])

  const exportBookmarks = () => {
    const blob = new Blob([JSON.stringify(bookmarks, null, 2)], { type: 'application/json' })

    const dateStr = new Date().toISOString().split('T')[0]
    const fileName = `tanuki-chi-backup-${dateStr}.json`

    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const importBookmarks = (file: File) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string)
        if (!Array.isArray(imported)) throw new Error('Invalid format')

        // Optionally: toggleBookmark for each
        for (const item of imported) {
          await window.api.toggleBookmark(item.title, item.link, item.cover, 'weebcentral')
        }

        setBookmarks(imported)
        message.success('Bookmarks imported successfully')
      } catch (err) {
        message.error('Invalid JSON file')
      }
    }

    reader.readAsText(file)
  }

  return (
    <>
      <h2>IMPORT / EXPORT</h2>
      <div style={{ display: 'flex', gap: '16px' }}>
        <Button icon={<DownloadOutlined />} onClick={exportBookmarks}>
          Export Bookmarks
        </Button>

        <Upload
          accept=".json"
          showUploadList={false}
          beforeUpload={(file) => {
            importBookmarks(file)
            return false
          }}
        >
          <Button icon={<UploadOutlined />}>Import Bookmarks</Button>
        </Upload>
        <Button onClick={() => console.log(bookmarks)}>Check</Button>
      </div>
    </>
  )
}
