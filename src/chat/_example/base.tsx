import React from 'react';
import Chat from '../Chat';
import ChatAction from '../components/ChatAction';
import ChatInput from '../components/ChatInput';
import ChatItem from '../components/ChatItem';
import ChatContent from '../components/ChatContent';

const BaseComponent = () => (
  <div style={{ width: '50%', margin: 'auto' }}>
    <ChatAction />
    <ChatInput />
    <ChatItem />
    <ChatContent />
    <Chat />
  </div>
);

export default BaseComponent;
