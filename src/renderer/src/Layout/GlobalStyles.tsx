import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
  :root {
    --loading-indicator-bg: ${({ theme }) => 
      theme.colors.sidebarBg === '#25262b' 
        ? 'rgba(37, 38, 43, 0.95)' 
        : 'rgba(255, 255, 255, 0.95)'
    };
    --loading-indicator-text: ${({ theme }) => theme.colors.textSecondary};
    --empty-state-bg: ${({ theme }) => 
      theme.colors.sidebarBg === '#25262b' 
        ? '#2c2e33' 
        : '#f5f5f5'
    };
    --empty-state-text: ${({ theme }) => theme.colors.textSecondary};
    --reader-bg: ${({ theme }) => 
      theme.colors.sidebarBg === '#25262b' 
        ? '#000000' 
        : '#1a1a1a'
    };
  }

  body {
    color: ${({ theme }) => theme.colors.textPrimary};
    background-color: ${({ theme }) => theme.colors.bg};
  }

  /* Rounded Select Dropdowns */
  .ant-select-selector {
    border-radius: 16px !important;
  }

  .rounded-select-dropdown .rc-virtual-list-holder-inner .ant-select-item {
    border-radius: 8px;
    margin: 2px 4px;
  }

  .ant-radio-group .ant-radio-button-wrapper:first-child {
    border-radius: 16px 0 0 16px !important;
  }

  .ant-radio-group .ant-radio-button-wrapper:last-child {
    border-radius: 0 16px 16px 0 !important;
  }
`

