/* eslint-disable react/jsx-key */
import React from 'react'
import { Divider, Flex, Table, Tag } from 'antd'
import type { TableColumnsType } from 'antd'

interface DataType {
  key: React.Key
  extension: string
  overallStatus: 'OK' | 'DOWN'
  description: StatusType[]
}

type StatusType = {
  service: 'Search' | 'Details' | 'Chapters' | 'Pages'
  status: 'OK' | 'DOWN'
}

const columns: TableColumnsType<DataType> = [
  { title: 'Extension', dataIndex: 'extension', key: 'extension' },
  {
    title: 'Overall Status',
    dataIndex: 'overallStatus',
    key: 'overallStatus',
    render: status => <Tag color={status === 'OK' ? 'green' : 'red'}>{status}</Tag>
  }
]

const data: DataType[] = [
  {
    key: 1,
    extension: 'MangaDex',
    overallStatus: 'OK',
    description: [
      { service: 'Search', status: 'OK' },
      { service: 'Details', status: 'OK' },
      { service: 'Chapters', status: 'OK' },
      { service: 'Pages', status: 'OK' }
    ]
  },
  {
    key: 2,
    extension: 'WeebCentral',
    overallStatus: 'DOWN',
    description: [
      { service: 'Search', status: 'DOWN' },
      { service: 'Details', status: 'DOWN' },
      { service: 'Chapters', status: 'DOWN' },
      { service: 'Pages', status: 'DOWN' }
    ]
  },
  {
    key: 3,
    extension: 'MangaBat',
    overallStatus: 'OK',
    description: [
      { service: 'Search', status: 'OK' },
      { service: 'Details', status: 'OK' },
      { service: 'Chapters', status: 'OK' },
      { service: 'Pages', status: 'OK' }
    ]
  }
]

export const StatusPage: React.FC = () => {
  return (
    <Table<DataType>
      columns={columns}
      expandable={{
        expandedRowRender: record => (
          <div style={{ margin: 0 }}>
            {record.description.length === 0 ? (
              <p>No detailed service statuses.</p>
            ) : (
              <Flex style={{ flexDirection: 'column', gap: '12px' }}>
                {record.description.map((item, index) => (
                  <>
                    <Flex>
                      <Flex style={{ minWidth: '5%' }} key={index}>
                        {item.service}:{' '}
                      </Flex>
                      <Tag color={item.status === 'OK' ? 'green' : 'red'}>{item.status}</Tag>
                    </Flex>
                    <Divider style={{ margin: '0px'}} />
                  </>
                ))}
              </Flex>
            )}
          </div>
        ),
        rowExpandable: record => true
      }}
      dataSource={data}
    />
  )
}
