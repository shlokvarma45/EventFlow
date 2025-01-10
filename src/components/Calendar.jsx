import React, { useState, useEffect, createContext, useContext } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isWeekend, getDay } from 'date-fns';
import EventModal from './EventModal';
import EventList from './EventList';
import { Button } from './ui/button';
import { CalendarIcon } from '@radix-ui/react-icons';
import styled from 'styled-components';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CalendarContainer = styled.div`
  background: #111111;
  padding: 2rem;
  border-radius: 12px;
  color: #ffffff;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const MonthTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: #ffffff;
`;

const NavigationButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const NavButton = styled.button`
  background: #1a1a1a;
  border: none;
  color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  
  &:hover {
    background: #2a2a2a;
  }
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
`;

const DayHeader = styled.div`
  color: #666666;
  font-size: 0.9rem;
  padding: 0.5rem;
  text-align: center;
`;

const DayCell = styled.div`
  padding: 1rem;
  text-align: center;
  border-radius: 8px;
  cursor: pointer;
  color: ${props => props.isCurrentMonth ? '#ffffff' : '#444444'};
  background: ${props => {
    if (props.isToday) return '#6a6a6a';
    if (props.isSelected) return '#2563eb';
    return 'transparent';
  }};

  &:hover {
    background: ${props => {
      if (props.isToday) return '#872323';
      if (props.isSelected) return '#2563eb';
      return '#1a1a1a';
    }};
  }
`;

const DraggableDay = styled.div`
  height: 100%;
  width: 100%;
`;

const AddEventButton = styled(Button)`
  background: #ffffff;
  color: #000000;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 1rem;

  &:hover {
    background: #f0f0f0;
  }
`;

export const EventsContext = createContext({
  events: {},
  setEvents: () => {}
});

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState(() => {
    const storedEvents = localStorage.getItem('events');
    return storedEvents ? JSON.parse(storedEvents) : {};
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEventListOpen, setIsEventListOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const handleDateClick = (day) => {
    setSelectedDate(day);
    setIsEventListOpen(true);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleAddEvent = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCloseEventList = () => {
    setIsEventListOpen(false);
  };

  const addEvent = (newEvent) => {
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    setEvents(prevEvents => {
      const updatedEvents = { ...prevEvents };
      updatedEvents[dateKey] = [...(updatedEvents[dateKey] || []), newEvent];
      return updatedEvents;
    });
    setIsModalOpen(false);
  };

  const editEvent = (editedEvent) => {
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    setEvents(prevEvents => {
      const updatedEvents = { ...prevEvents };
      updatedEvents[dateKey] = updatedEvents[dateKey].map(event =>
        event.id === editedEvent.id ? editedEvent : event
      );
      return updatedEvents;
    });
    setIsModalOpen(false);
  };

  const deleteEvent = (eventId) => {
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    setEvents(prevEvents => {
      const updatedEvents = { ...prevEvents };
      updatedEvents[dateKey] = updatedEvents[dateKey].filter(event => event.id !== eventId);
      return updatedEvents;
    });
  };

  const renderHeader = () => {
    return (
      <CalendarHeader>
        <MonthTitle>
          {format(currentDate, 'MMMM yyyy')}
        </MonthTitle>
        <NavigationButtons>
          <NavButton onClick={handlePrevMonth}>&lt;</NavButton>
          <NavButton onClick={handleNextMonth}>&gt;</NavButton>
        </NavigationButtons>
      </CalendarHeader>
    );
  };

  const renderDays = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const startWeekday = getDay(monthStart);
    const blanks = Array(startWeekday).fill(null);
    
    return (
      <CalendarGrid>
        {DAYS_OF_WEEK.map(day => (
          <DayHeader key={day}>
            {day}
          </DayHeader>
        ))}
        
        {blanks.map((_, index) => (
          <DayCell key={`blank-${index}`} isCurrentMonth={false} />
        ))}

        {days.map((day) => (
          <DayCell
            key={day.toString()}
            isCurrentMonth={true}
            isSelected={selectedDate && isSameDay(day, selectedDate)}
            isToday={isToday(day)}
            onClick={() => handleDateClick(day)}
          >
            {format(day, 'd')}
          </DayCell>
        ))}
      </CalendarGrid>
    );
  };

  return (
    <EventsContext.Provider value={{ events, setEvents }}>
      <DndProvider backend={HTML5Backend}>
        <CalendarContainer>
          {renderHeader()}
          <div className="border rounded-md p-2">
            {renderDays()}
          </div>
          {selectedDate && (
            <EventModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              onAddEvent={addEvent}
              onEditEvent={editEvent}
              selectedDate={selectedDate}
              events={events[format(selectedDate, 'yyyy-MM-dd')] || []}
            />
          )}
          {selectedDate && (
            <EventList
              isOpen={isEventListOpen}
              onClose={handleCloseEventList}
              selectedDate={selectedDate}
              events={events[format(selectedDate, 'yyyy-MM-dd')] || []}
              onDeleteEvent={deleteEvent}
            />
          )}
          <AddEventButton onClick={handleAddEvent}>
            Add Event
          </AddEventButton>
        </CalendarContainer>
      </DndProvider>
    </EventsContext.Provider>
  );
}

export default Calendar;
