"use client";
import React from 'react';
import { FacebookProvider, CustomChat } from 'react-facebook';


const ChatMess = () => {
    return (
        <FacebookProvider appId="549033800853497" chatSupport>
        <CustomChat pageId="464149403443149" minimized={true}/>
      </FacebookProvider>
    )

};

export default ChatMess;
