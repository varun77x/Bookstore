import React from 'react';

const UsersSidebar = ({ users }) => {
  return (
    <div className="fixed top-0 right-0 h-full w-48 bg-white/90 shadow-md p-5 z-10">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Connected Users
      </h3>
      <ul className="space-y-2">
        {users.map((user, index) => (
          <li
            key={index}
            className="py-2 px-1 border-b border-gray-200 text-gray-600 text-sm"
          >
            {user}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersSidebar;