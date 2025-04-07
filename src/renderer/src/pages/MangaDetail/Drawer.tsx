import React, { ReactNode, useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

interface CustomDrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  extra?: ReactNode;
  width?: string; // e.g. '90%' or any valid CSS width value
  children: ReactNode;
}

const slideIn = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`;

const slideOut = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(100%); }
`;

const DrawerOverlay = styled.div<{ open: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.4);
  opacity: ${({ open }) => (open ? 1 : 0)};
  visibility: ${({ open }) => (open ? 'visible' : 'hidden')};
  transition: opacity 0.3s ease, visibility 0.3s ease;
  z-index: 1000;
`;

const DrawerContainer = styled.div<{ open: boolean; width: string }>`
  position: fixed;
  top: 0;
  right: 0;
  width: ${({ width }) => width};
  height: 100%;
  background: #fff;
  box-shadow: -2px 0 8px rgba(0,0,0,0.15);
  z-index: 1001;
  animation: ${({ open }) => (open ? slideIn : slideOut)} 0.3s forwards;
`;

const DrawerHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: black;
`;

const DrawerBody = styled.div`
  padding: 16px;
  overflow-y: auto;
  height: calc(100% - 60px);
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 22px;
  cursor: pointer;
`;

export const CustomDrawer: React.FC<CustomDrawerProps> = ({
  open,
  onClose,
  title,
  extra,
  children,
  width = '90%',
}) => {

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (open) {
          setIsVisible(true);
        } else {
          const timer = setTimeout(() => setIsVisible(false), 300);
          return () => clearTimeout(timer);
        }
      }, [open]);
    
      if (!isVisible) return null;

  return (
    <>
      <DrawerOverlay open={open} onClick={onClose} />
      <DrawerContainer open={open} width={width}>
        <DrawerHeader>
          <div style={{ color: 'black' }}>{title}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {extra}
            <CloseButton style={{ color: '#000957' }} onClick={onClose}>&times;</CloseButton>
          </div>
        </DrawerHeader>
        <DrawerBody>{children}</DrawerBody>
      </DrawerContainer>
    </>
  );
};
