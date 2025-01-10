import React, { useState } from 'react';
import styled from 'styled-components';
import Calendar from './components/Calendar';
import EventsSidebar from './components/EventsSidebar';
import { EventsContext } from './components/Calendar';

const PageContainer = styled.div`
  min-height: 100vh;
  background: #000000;
`;

const Header = styled.header`
  padding: 2rem;
  padding-bottom: 1rem;
  background: #111111;
  margin-bottom: 2rem;
`;

const HeaderTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  background: linear-gradient(to right, #a855f7, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  letter-spacing: 0.05em;
`;

const AppContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

function App() {
  const [events, setEvents] = useState(() => {
    const storedEvents = localStorage.getItem('events');
    return storedEvents ? JSON.parse(storedEvents) : {};
  });

  return (
    <PageContainer>
      <Header>
        <HeaderTitle>EventFlow</HeaderTitle>
      </Header>
      <EventsContext.Provider value={{ events, setEvents }}>
        <AppContainer>
          <Calendar />
          <EventsSidebar />
        </AppContainer>
      </EventsContext.Provider>
    </PageContainer>
  );
}

export default App;
