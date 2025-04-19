import React from 'react';
import styled from 'styled-components';
import { Button, Card, Typography } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const Container = styled.div`
  max-width: 720px;
  margin: 40px auto;
  padding: 0 24px;
`;

const StyledCard = styled(Card)`
  border-radius: 12px;
`;

const ButtonRow = styled.div`
  margin-top: 24px;
  display: flex;
  justify-content: flex-start;
`;

const UpdatePage: React.FC = () => {
  const handleCheckUpdates = () => {
    // Insert your IPC or update check logic here
  };

  return (
    <Container>
      <StyledCard>
        <Typography>
          <Title level={3}>Stay Updated</Title>
          <Paragraph>
            From time to time, extensions may stop working due to changes in third-party sources.
          </Paragraph>
          <Paragraph>
            Keeping the app up to date ensures these issues are fixed quickly, and that you have access to the <strong>latest features, UI improvements and new providers</strong>.
          </Paragraph>
          <Paragraph>
            If you're experiencing issues or just want to make sure you're using the latest version, click the button below to check for updates.
          </Paragraph>
        </Typography>

        <ButtonRow>
          <Button type="primary" icon={<ReloadOutlined />} onClick={handleCheckUpdates}>
            Check for Updates
          </Button>
        </ButtonRow>
      </StyledCard>
    </Container>
  );
};

export default UpdatePage;
