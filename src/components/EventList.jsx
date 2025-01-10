import React, { useState } from 'react';
import { format } from 'date-fns';
import styled from 'styled-components';
import { Button } from './ui/button';

const EventListContainer = styled.div`
  background: #1a1a1a;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
`;

const EventItem = styled.div`
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  background: ${props => {
    switch(props.category) {
      case 'work': return '#2563eb20';
      case 'personal': return '#dc262620';
      case 'other': return '#71717120';
      default: return '#2a2a2a';
    }
  }};
  border-left: 4px solid ${props => {
    switch(props.category) {
      case 'work': return '#2563eb';
      case 'personal': return '#dc2626';
      case 'other': return '#717171';
      default: return '#2a2a2a';
    }
  }};
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  background: #2a2a2a;
  border: 1px solid #333;
  border-radius: 4px;
  color: #ffffff;
`;

const ExportButton = styled(Button)`
  margin-bottom: 1rem;
`;

function EventList({ events, selectedDate, onDeleteEvent }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    const exportData = {
      date: format(selectedDate, 'yyyy-MM-dd'),
      events: events
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `events-${format(selectedDate, 'yyyy-MM-dd')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <EventListContainer>
      <h3 className="text-lg font-bold mb-4">
        Events for {format(selectedDate, 'MMMM d, yyyy')}
      </h3>

      <SearchInput
        type="text"
        placeholder="Search events..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <ExportButton onClick={handleExport}>
        Export Events
      </ExportButton>

      {filteredEvents.length === 0 ? (
        <p>No events found</p>
      ) : (
        filteredEvents.map(event => (
          <EventItem key={event.id} category={event.category}>
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold">{event.title}</h4>
                <p className="text-sm text-gray-400">
                  {event.startTime} - {event.endTime}
                </p>
                {event.description && (
                  <p className="text-sm mt-1">{event.description}</p>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDeleteEvent(event.id)}
              >
                Delete
              </Button>
            </div>
          </EventItem>
        ))
      )}
    </EventListContainer>
  );
}

export default EventList;
