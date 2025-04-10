// components/CustomSpinner.tsx
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Spin } from 'antd';

const spinAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Custom spinner indicator, replace with your own SVG or styled div
const SpinnerIndicator = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top-color: #1890ff;
  border-radius: 50%;
  animation: ${spinAnimation} 1s linear infinite;
`;

const SpinnerWrapper = styled.div<{ fullScreen?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  ${({ fullScreen }) =>
    fullScreen &&
    `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(255, 255, 255, 0.8);
    z-index: 9999;
  `}
`;

type CustomSpinnerProps = {
  fullScreen?: boolean;
  message?: string;
};

const CustomSpinner: React.FC<CustomSpinnerProps> = ({ fullScreen, message }) => (
  <SpinnerWrapper fullScreen={fullScreen}>
    <Spin
      indicator={<SpinnerIndicator />}
      tip={message}
      size="large"
    />
  </SpinnerWrapper>
);

export default CustomSpinner;
