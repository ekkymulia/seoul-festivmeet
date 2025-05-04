'use client'
import { useState } from 'react';
import { Sun, Moon, Github, Heart, Coffee, User, Users, Shuffle, MessageSquareMore } from 'lucide-react';

// Theme switcher component
const ThemeSwitcher = () => {
  const [theme, setTheme] = useState('light');
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    // In a real implementation, this would toggle the theme in your app
  };
  
  return (
    <button 
      onClick={toggleTheme} 
      className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    >
      {theme === 'light' ? (
        <>
          <Moon size={16} />
          <span>Dark</span>
        </>
      ) : (
        <>
          <Sun size={16} />
          <span>Light</span>
        </>
      )}
    </button>
  );
};

// Main footer component
export default function FooterNav() {
  const [activeTab, setActiveTab] = useState('swipe');
  
  const menuItems = [
    { id: 'match', name: 'My Match', icon: <Users size={20} /> },
    { id: 'swipe', name: 'Find Event', icon: <Shuffle size={20} /> },
    { id: 'chat', name: 'Messages', icon: <MessageSquareMore size={20} /> },
    { id: 'profile', name: 'My Profile', icon: <User size={20} /> }
  ];
  
  return (
    <footer className="w-full flex flex-col mx-auto sticky bottom-0 z-10 bg-background border-t">
      {/* Menu Navigation */}
      <div className="w-full max-w-5xl mx-auto">
        <nav className="flex justify-between items-center">
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`flex-1 flex flex-col items-center py-3 text-sm ${
                activeTab === item.id ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.icon}
              <span className="mt-1 text-xs">{item.name}</span>
            </button>
          ))}
        </nav>
      </div>
      
      {/* Secondary footer content */}
      {/* <div className="w-full border-t text-xs">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between px-4 py-2 gap-2">
          <div className="flex items-center gap-2">
            <p>
              Powered by{" "}
              <a
                href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
                target="_blank"
                className="font-bold hover:underline"
                rel="noreferrer"
              >
                Supabase
              </a>
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com" 
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 hover:text-gray-600 transition-colors"
            >
              <Github size={14} />
              <span>GitHub</span>
            </a>
            
            <ThemeSwitcher />
          </div>
        </div>
      </div> */}
    </footer>
  );
}