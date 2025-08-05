import React from 'react';
import styled from 'styled-components';
import { Button, Card, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const StyledCard = styled(Card)`
  width: 100%;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const AboutPage: React.FC = () => {
  return (
    <Container>
      <StyledCard>
        <Typography>
          <Title level={2}>About This App</Title>
          <Paragraph>
            This app was created with one goal in mind — to be the best manga reading experience available.
          </Paragraph>
          <Paragraph>
            I know how frustrating it can be to rely on tools that constantly break, miss updates, or stop supporting your favorite mangas. That's why this app is built to be reliable, fast, and extensible — with constant maintenance to ensure everything keeps working.
          </Paragraph>
          <Paragraph>
            I aim to support a wide range of manga sources and maintain working integrations with them <b>99% of the time</b>, offering a seamless experience for all readers. Behind the scenes, i am constantly improving the UI, rolling out new features, and fixing extension issues as soon as they arise.
          </Paragraph>

          <Title level={3}>How can you help ?</Title>
          <Paragraph>
            This app is, and will continue to be, completely free and designed for the community, not profit. But to keep it running and improving, your support will be <strong>strongly</strong> appreciated.
          </Paragraph>
          <Paragraph>
            Infrastructure, extension development, maintenance — it all takes time and resources. Every small contribution helps keep the app alive and evolving.
          </Paragraph>
          <Paragraph>
            For the price of a coffee a month, you can help sustain development and ensure this app keeps getting better.
          </Paragraph>

          <Paragraph>
            <strong>Together, we can build and sustain the best manga reader out there.</strong>
          </Paragraph>
          <Paragraph>
            — A cringe developer with a dream
          </Paragraph>
        </Typography>
        <Button>Support us!</Button>
      </StyledCard>
    </Container>
  );
};

export default AboutPage;
