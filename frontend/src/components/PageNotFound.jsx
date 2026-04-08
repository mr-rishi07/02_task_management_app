import React from 'react'

function PageNotFound() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <span className="block text-7xl font-bold text-red-500">
          404
        </span>
        <p className="mt-4 text-2xl font-semibold text-gray-800">
          Page Not Found
        </p>
        <p className="mt-2 text-gray-600">
          Sorry, the page you are looking for does not exist.
        </p>
      </div>
    </div>
  )
}

export default PageNotFound
