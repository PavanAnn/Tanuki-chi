import React, { ReactNode, useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'

interface CustomDrawerProps {
  open: boolean
  onClose: (chapter: string | null) => void
  title?: string
  extra?: ReactNode
  width?: string
  chapter: string | null
  children: ReactNode
  showHeader?: boolean
  floatingHeader?: boolean
}

const slideIn = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`

const slideOut = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(100%); }
`

const DrawerOverlay = styled.div<{ open: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  opacity: ${({ open }) => (open ? 1 : 0)};
  visibility: ${({ open }) => (open ? 'visible' : 'hidden')};
  transition:
    opacity 0.3s ease,
    visibility 0.3s ease;
  z-index: 1000;
`

const DrawerContainer = styled.div<{ open: boolean; width: string }>`
  position: fixed;
  top: 0;
  right: 0;
  width: ${({ width }) => width};
  height: 100%;
  background: ${({ theme }) => theme.colors.cardBg};
  box-shadow: -2px 0 8px ${({ theme }) => theme.colors.shadowColor};
  z-index: 1001;
  animation: ${({ open }) => (open ? slideIn : slideOut)} 0.3s forwards;
`

const DrawerHeader = styled.div<{ show?: boolean; floating?: boolean }>`
  padding: ${({ floating }) => floating ? '12px 24px' : '16px'};
  border-bottom: ${({ floating, theme }) => floating ? 'none' : `1px solid ${theme.colors.border}`};
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${({ theme }) => theme.colors.textPrimary};
  background: ${({ floating, theme }) => 
    floating ? 'var(--loading-indicator-bg)' : theme.colors.cardBg
  };
  opacity: ${({ show }) => (show !== undefined ? (show ? 1 : 0) : 1)};
  transition: opacity 0.3s ease;
  pointer-events: ${({ show }) => (show !== undefined ? (show ? 'auto' : 'none') : 'auto')};
  
  ${({ floating }) => floating && `
    position: fixed;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1002;
    width: 90%;
  `}
`

const DrawerBody = styled.div<{ fullHeight?: boolean }>`
  padding: ${({ fullHeight }) => fullHeight ? '0' : '16px'};
  overflow-y: auto;
  height: ${({ fullHeight }) => fullHeight ? '100%' : 'calc(100% - 60px)'};
  background: ${({ theme }) => theme.colors.cardBg};
`

const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 22px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textPrimary};
  transition: color 0.2s ease;
  
  &:hover {
    color: ${({ theme }) => theme.colors.activeText};
  }
`

export const CustomDrawer: React.FC<CustomDrawerProps> = ({
  open,
  onClose,
  title,
  extra,
  children,
  width = '90%',
  chapter,
  showHeader = true,
  floatingHeader = false
}) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (open) {
      return setIsVisible(true)
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300)
      return () => clearTimeout(timer)
    }
  }, [open])

  if (!isVisible) return null

  return (
    <>
      <DrawerOverlay
        open={open}
        onClick={() => {
          onClose(chapter)
        }}
      />
      <DrawerContainer open={open} width={width}>
        <DrawerHeader show={showHeader} floating={floatingHeader}>
          <div style={{ 
            fontSize: floatingHeader ? '14px' : '16px',
            fontWeight: '500',
            color: floatingHeader ? 'var(--loading-indicator-text)' : 'inherit',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: floatingHeader ? '400px' : 'auto'
          }}>
            {title}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
            {extra}
            <CloseButton
              onClick={() => {
                onClose(chapter)
              }}
            >
              &times;
            </CloseButton>
          </div>
        </DrawerHeader>
        <DrawerBody fullHeight={floatingHeader}>{children}</DrawerBody>
      </DrawerContainer>
    </>
  )
}
