import React from 'react'
import { Modal, List, Button, Flex, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { GroupedManga } from './groupUtils'

interface ProviderModalProps {
  open: boolean
  manga: GroupedManga | null
  loadingProviders: Set<string>
  onClose: () => void
  onSelectProvider: (provider: string, mangaId: string) => void
}

export const ProviderModal: React.FC<ProviderModalProps> = ({
  open,
  manga,
  loadingProviders,
  onClose,
  onSelectProvider
}) => {
  if (!manga) return null

  return (
    <Modal
      title={`Select Provider for "${manga.displayName}"`}
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <List
        dataSource={manga.providers}
        renderItem={(item) => (
          <List.Item
            key={item.provider}
            style={{
              cursor: 'pointer',
              padding: '12px',
              borderRadius: '8px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f5f5f5'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            <List.Item.Meta
              title={
                <Flex justify="space-between" align="center">
                  <span style={{ textTransform: 'capitalize', fontSize: '16px' }}>
                    {item.provider}
                  </span>
                  <Button
                    type="primary"
                    onClick={() => onSelectProvider(item.provider, item.manga.id)}
                  >
                    View
                  </Button>
                </Flex>
              }
            />
          </List.Item>
        )}
      />

      {loadingProviders.size > 0 && (
        <>
          <div style={{ borderTop: '1px solid #f0f0f0', marginTop: '16px', paddingTop: '16px' }}>
            <h4 style={{ marginBottom: '12px', color: '#888' }}>Loading from other providers...</h4>
            {Array.from(loadingProviders).map((provider) => (
              <Flex
                key={provider}
                align="center"
                gap="middle"
                style={{ padding: '8px', marginBottom: '8px' }}
              >
                <Spin indicator={<LoadingOutlined spin />} size="small" />
                <span style={{ textTransform: 'capitalize', color: '#888' }}>{provider}</span>
              </Flex>
            ))}
          </div>
        </>
      )}
    </Modal>
  )
}

