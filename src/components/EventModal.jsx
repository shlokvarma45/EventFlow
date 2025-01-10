import React, { useState } from 'react';
import { format } from 'date-fns';
import { Dialog } from '@radix-ui/react-dialog';
import { Button } from './ui/button';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: #1a1a1a;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #ffffff;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border-radius: 4px;
  background: #2a2a2a;
  border: 1px solid #333;
  color: #ffffff;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border-radius: 4px;
  background: #2a2a2a;
  border: 1px solid #333;
  color: #ffffff;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const StyledButton = styled(Button)`
  padding: 0.5rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s ease;

  &.cancel {
    background: #2a2a2a;
    color: #ffffff;
    
    &:hover {
      background: #3a3a3a;
    }
  }

  &.submit {
    background: #2563eb;
    color: #ffffff;
    
    &:hover {
      background: #1d4ed8;
    }
  }
`;

function EventModal({ isOpen, onClose, onAddEvent, selectedDate, events = [] }) {
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [category, setCategory] = useState('work');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check for overlapping events
    const newEventStart = new Date(`${format(selectedDate, 'yyyy-MM-dd')}T${startTime}`);
    const newEventEnd = new Date(`${format(selectedDate, 'yyyy-MM-dd')}T${endTime}`);
    
    const hasOverlap = events.some(event => {
      const existingStart = new Date(`${format(selectedDate, 'yyyy-MM-dd')}T${event.startTime}`);
      const existingEnd = new Date(`${format(selectedDate, 'yyyy-MM-dd')}T${event.endTime}`);
      
      return (
        (newEventStart >= existingStart && newEventStart < existingEnd) ||
        (newEventEnd > existingStart && newEventEnd <= existingEnd)
      );
    });

    if (hasOverlap) {
      alert('This time slot overlaps with an existing event!');
      return;
    }

    onAddEvent({
      id: Date.now(),
      title,
      startTime,
      endTime,
      category,
      description
    });

    setTitle('');
    setStartTime('09:00');
    setEndTime('10:00');
    setCategory('work');
    setDescription('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <ModalOverlay>
        <ModalContent>
          <h2 className="text-xl font-bold mb-4">Add New Event</h2>
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Title</Label>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Start Time</Label>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>End Time</Label>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Category</Label>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="other">Other</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Description</Label>
              <Input
                as="textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormGroup>

            <ButtonGroup>
              <StyledButton 
                type="button" 
                className="cancel"
                onClick={onClose}
              >
                Cancel
              </StyledButton>
              <StyledButton 
                type="submit"
                className="submit"
              >
                Add Event
              </StyledButton>
            </ButtonGroup>
          </form>
        </ModalContent>
      </ModalOverlay>
    </Dialog>
  );
}

export default EventModal;
