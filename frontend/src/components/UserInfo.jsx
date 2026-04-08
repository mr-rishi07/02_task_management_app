import React from "react";

const UserInfo = ({ user }) => {
  return (
    <div className="flex items-center gap-3 bg-indigo-50 p-4 rounded-xl mb-5 shadow-sm">
      {/* Avatar */}
      <div className="h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">
        {user?.name?.charAt(0)?.toUpperCase()}
      </div>

      {/* User Details */}
      <div>
        <h2 className="text-lg font-semibold text-indigo-700">
          Welcome, {user?.name} 👋
        </h2>
        <p className="text-sm text-gray-600">
          Manage your daily tasks efficiently 🚀
        </p>
      </div>
    </div>
  );
};

export default UserInfo;