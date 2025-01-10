import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { CalendarIcon, PersonIcon } from '@radix-ui/react-icons';
import { EventsContext } from './Calendar';
import EventModal from './EventModal';

const SidebarContainer = styled.div`
  background: #111111;
  padding: 1.5rem;
  border-radius: 12px;
  color: #ffffff;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
`;

const AddEventButton = styled.button`
  background: #ffffff;
  color: #000000;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f0f0f0;
  }
`;

const EventCard = styled.div`
  background: #1a1a1a;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border-left: 4px solid ${props => {
    switch(props.category) {
      case 'work': return '#2563eb';
      case 'personal': return '#dc2626';
      default: return '#717171';
    }
  }};
`;

const EventTime = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666666;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const EventIcon = styled.span`
  display: inline-flex;
  align-items: center;
  margin-right: 0.5rem;
  color: ${props => {
    switch(props.category) {
      case 'work': return '#2563eb';
      case 'personal': return '#dc2626';
      default: return '#717171';
    }
  }};
`;

function EventsSidebar() {
  const { events, setEvents } = useContext(EventsContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayEvents = events[today] || [];

  // Sort events by start time
  const sortedEvents = [...todayEvents].sort((a, b) => {
    return new Date(`2000/01/01 ${a.startTime}`) - new Date(`2000/01/01 ${b.startTime}`);
  });

  const handleAddEvent = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const addEvent = (newEvent) => {
    setEvents(prevEvents => {
      const updatedEvents = { ...prevEvents };
      updatedEvents[today] = [...(updatedEvents[today] || []), newEvent];
      return updatedEvents;
    });
    setIsModalOpen(false);
  };

  return (
    <SidebarContainer>
      <Header>
        <Title>Events</Title>
        <AddEventButton onClick={handleAddEvent}>
          Add Event
        </AddEventButton>
      </Header>

      {sortedEvents.map(event => (
        <EventCard key={event.id} category={event.category}>
          <div>
            <EventIcon category={event.category}>
              {event.category === 'personal' ? <PersonIcon /> : <CalendarIcon />}
            </EventIcon>
            <span>{event.title}</span>
          </div>
          <EventTime>
            {event.startTime} - {event.endTime}
          </EventTime>
        </EventCard>
      ))}

      {sortedEvents.length === 0 && (
        <p>No events for today</p>
      )}

      <EventModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddEvent={addEvent}
        selectedDate={new Date()}
        events={todayEvents}
      />
    </SidebarContainer>
  );
}

export default EventsSidebar; 