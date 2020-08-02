import React from 'react';
import { useTransition } from 'react-spring';

import Toast from './Toast';

import { Container } from './styles';

interface ToastMessage {
  id: string;
  type?: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

interface ToastContainerProps {
  messages: ToastMessage[];
}

const ToastContainer: React.FC<ToastContainerProps> = ({ messages }) => {
  const messagesWithTransictions = useTransition(
    messages,
    message => message.id,
    {
      from: { right: '-120%', opacity: 0 },
      enter: { right: '0%', opacity: 1 },
      leave: { right: '-120%', opacity: 0 },
    },
  );

  return (
    <Container>
      {messagesWithTransictions.map(({ item: message, key, props }) => (
        <Toast key={key} style={props} message={message} />
      ))}
    </Container>
  );
};

export default ToastContainer;
