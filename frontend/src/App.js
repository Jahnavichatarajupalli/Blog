import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./login/login";
import Dashboard from "./components/Dashboard/Dashboard";
import BlogEditor from "./BlogEditor/BlogEditor";
import PublishedBlogs from "./PublishedBlogs/PublishedBlogs";
import DraftedBlogs from "./DraftedBlogs/DraftedBlogs";
import BlogViewer from "./Blogviewer/Blogviewer";

// import { useNavigate } from 'react-router-dom';


import './App.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
// import React, { useState } from 'react';

function App() {

  return (
    <GoogleOAuthProvider 
      clientId="632567001794-ta24salhdb4tv7g8ajrl0g9uujugn3rl.apps.googleusercontent.com"
      onScriptLoadError={(error) => console.error('Google OAuth Script Error:', error)}
      onScriptLoadSuccess={() => console.log('Google OAuth Script Loaded Successfully')}
      useOneTap={false}
      cookiePolicy={'single_host_origin'}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/editor" element={<BlogEditor/>} />
          <Route path="/editor" element={<BlogEditor />} />
          <Route path="/editor/:id" element={<BlogEditor />} />
          <Route path="/blog/:id" element={<BlogViewer />} />
          <Route path="/published-blogs" element={<PublishedBlogs />}/>
          <Route path="/draft-blogs" element={<DraftedBlogs/>} /> 
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
