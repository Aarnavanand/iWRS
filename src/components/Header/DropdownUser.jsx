'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import * as cookie from 'cookie';
import ClickOutside from '@/components/ClickOutside';

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('/api/users/getLoginUser', {
          withCredentials: true, // Ensures cookies are sent with the request
        });
        setUser(response.data.user); // Update state with the 'user' object
        setIsAuthenticated(true); // User is authenticated
      } catch (error) {
        console.error('Error fetching user data:', error);
        setIsAuthenticated(false); // User is not authenticated
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const cookies = cookie.parse(document.cookie);
        const token = cookies.token;
  
        if (token) {
          const response = await axios.post(
            '/api/verifyToken',
            { token },
            { withCredentials: true }
          );
  
          if (!response.data.valid) {
            document.cookie = 'token=; Max-Age=0; path=/'; // Clear token cookie
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error verifying token:', error);
        document.cookie = 'token=; Max-Age=0; path=/'; // Clear token cookie on error
        setIsAuthenticated(false);
      }
    };
  
    const interval = setInterval(checkToken, 5 * 60 * 1000); // Check every 5 minutes
    checkToken(); // Run immediately on mount
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);
  
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login'); // Redirect to login when unauthenticated
    }
  }, [isAuthenticated, router]);
  

  // Handle logout
  const handleLogout = async () => {
    try {
      await axios.post(
        '/api/users/logout',
        {},
        {
          withCredentials: true, // Ensures cookies are handled correctly
        }
      );
      router.push('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black dark:text-white">
            {user ? user.fullName : 'Loading...'}
          </span>
          <span className="block text-xs">
            {user ? user.email : 'Loading...'}
          </span>
        </span>

        <span className="h-12 w-12 rounded-full">
          <Image
            width={112}
            height={112}
            src={user?.avatar || '/assets/color.svg'}
            alt="User Avatar"
          />
        </span>
      </button>

      {dropdownOpen && (
        <div
          className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark`}
        >
          <button
            onClick={handleLogout}
            className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
          >
            <svg
              className="fill-current"
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.5375 0.618744H11.6531C10.7594 0.618744 10.0031 1.37499 10.0031 2.26874V4.64062C10.0031 5.05312 10.3469 5.39687 10.7594 5.39687C11.1719 5.39687 11.55 5.05312 11.55 4.64062V2.23437C11.55 2.16562 11.5844 2.13124 11.6531 2.13124H15.5375C16.3625 2.13124 17.0156 2.78437 17.0156 3.60937V18.3562C17.0156 19.1812 16.3625 19.8344 15.5375 19.8344H11.6531C11.5844 19.8344 11.55 19.8 11.55 19.7312V17.3594C11.55 16.9469 11.2062 16.6031 10.7594 16.6031C10.3125 16.6031 10.0031 16.9469 10.0031 17.3594V19.7312C10.0031 20.625 10.7594 21.3812 11.6531 21.3812H15.5375C17.2219 21.3812 18.5625 20.0062 18.5625 18.3562V3.64374C18.5625 1.95937 17.1875 0.618744 15.5375 0.618744Z"
                fill=""
              />
              <path
                d="M6.05001 11.7563H12.2031C12.6156 11.7563 12.9594 11.4125 12.9594 11C12.9594 10.5875 12.6156 10.2438 12.2031 10.2438H6.08439L8.21564 8.07813C8.52501 7.76875 8.52501 7.2875 8.21564 6.97812C7.90626 6.66875 7.42501 6.66875 7.11564 6.97812L3.67814 10.4844C3.36876 10.7938 3.36876 11.275 3.67814 11.5844L7.11564 15.0906C7.25314 15.2281 7.45939 15.3312 7.66564 15.3312C7.87189 15.3312 8.04376 15.2625 8.21564 15.125C8.52501 14.8156 8.52501 14.3344 8.21564 14.025L6.05001 11.7563Z"
                fill=""
              />
            </svg>
            Log Out
          </button>
        </div>
      )}
    </ClickOutside>
  );
};

export default DropdownUser;
