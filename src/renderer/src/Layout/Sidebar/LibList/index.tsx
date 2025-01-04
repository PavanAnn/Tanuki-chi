import React from 'react'
import { LibListContainer, LibItem } from './styles'

const mockLibrary = [
    { id: 1, name: 'Library Item 1' },
    { id: 2, name: 'Library Item 2' },
    { id: 3, name: 'Library Item 3' },
    { id: 4, name: 'Library Item 4' },
    { id: 5, name: 'Library Item 5' },
    { id: 6, name: 'Library Item 6' },
    { id: 7, name: 'Library Item 7' },
    { id: 8, name: 'Library Item 8' },
    { id: 9, name: 'Library Item 9' },
    { id: 10, name: 'Library Item 10' },
    { id: 11, name: 'Library Item 11' },
    { id: 12, name: 'Library Item 12' },
    { id: 13, name: 'Library Item 13' },
    { id: 14, name: 'Library Item 14' },
    { id: 15, name: 'Library Item 15' },
    { id: 16, name: 'Library Item 16' },
    { id: 17, name: 'Library Item 17' },
    { id: 18, name: 'Library Item 18' },
    { id: 19, name: 'Library Item 19' },
    { id: 20, name: 'Library Item 20' },
    { id: 21, name: 'Library Item 21' },
    { id: 22, name: 'Library Item 22' },
    { id: 23, name: 'Library Item 23' },
  ]
  

const LibList: React.FC = () => {
  return (
    <LibListContainer>
      {mockLibrary.map((item) => (
        <LibItem key={item.id}>{item.name}</LibItem>
      ))}
    </LibListContainer>
  )
}

export default LibList
