import React, { useState } from 'react';
import { HeaderContainer } from './styles';
import { useSearchStore } from '../../Features/Store/Search/useSearchStore';
import { useNavigate } from 'react-router-dom';
import { getAllProviderSearchResults } from '@renderer/Features/Store/useSearchAllProviders';
import Search from 'antd/es/input/Search';
import { Badge, Button, Divider, Flex, List, Popover, Select } from 'antd';
import { UpdateNotification } from '@renderer/types';
import { BellOutlined } from '@ant-design/icons';

const allProviders = ['mangadex', 'weebcentral'];

const Header: React.FC = () => {
  const { setSearchTerm, setData, setIsFetching, clear, isFetching } = useSearchStore();
  const [selectedProviders, setSelectedProviders] = useState<string[]>(allProviders);
  const [notifications, setNotifications] = useState<UpdateNotification[]>([]);
const [popoverVisible, setPopoverVisible] = useState(false);

  const navigate = useNavigate();

  const handleSearch = async (value: string) => {
    const trimmed = value.trim();
    setSearchTerm(trimmed);
    if (!trimmed || selectedProviders.length === 0) return;

    navigate('/');
    setIsFetching(true);
    const results = await getAllProviderSearchResults(trimmed, selectedProviders);
    setData(results);
    setIsFetching(false);
  };

  const fetchNotifications = async () => {
    const data = await window.api.getUpdateNotifications();
    setNotifications(data);
  };
  
  const handleOpenPopover = async (visible: boolean) => {
    setPopoverVisible(visible);
    if (visible) {
      await fetchNotifications();
    }
  };
  
  const handleClear = async () => {
    await window.api.clearUpdateNotifications();
    setNotifications([]);
  };
  

  return (
    <HeaderContainer gap={'12px'} align="center">
      <Search
        style={{ width: '60%', marginLeft: '20px' }}
        onSearch={handleSearch}
        onClear={() => clear()}
        placeholder="Search for mangas"
        enterButton="Search"
        size="large"
        loading={isFetching}
        allowClear
      />
        <Select
          mode="multiple"
          placeholder="Select providers"
          defaultValue={allProviders}
          size='large'
          onChange={(val) => setSelectedProviders(val)}
          options={allProviders.map((p) => ({ label: p, value: p }))}
        />
        <Flex style={{ marginLeft: 'auto', marginRight: '2%' }}>
        <Popover
          content={
            <div style={{ maxWidth: '300px', maxHeight: '60vh'}}>
              {notifications.length === 0 ? (
                <div>No new updates</div>
              ) : (
                <>
                  <List
                    size="small"
                    dataSource={notifications}
                    renderItem={(item) => (
                      <List.Item>
                        <div>
                          <strong>{item.title}</strong> has a new chapter: {item.newChapter}
                        </div>
                      </List.Item>
                    )}
                  />
                </>
              )}
            </div>
          }
          title={
            <><Flex align='center'><Flex style={{ fontSize: '16px', fontWeight: '500' }}>Chapter Updates</Flex>
              {notifications.length > 0 &&
                <Button type="link" onClick={handleClear} style={{ padding: 0, marginLeft: 'auto', width: 'fit-content' }}>
                  Clear all
                </Button>}

            </Flex><Divider style={{ margin: 0 }} /></>
          }
          trigger="click"
          open={popoverVisible}
          onOpenChange={handleOpenPopover}
          placement="bottomRight"
        >
          <Badge count={notifications.length} overflowCount={9}>
            <BellOutlined style={{ fontSize: '24px', cursor: 'pointer', color: '#000957' }} />
          </Badge>
        </Popover></Flex>


    </HeaderContainer>
  );
};

export default Header;
