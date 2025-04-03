"use client"

import { useState, useEffect } from "react"
import axios from "axios"

interface User {
  id?: string
  firstName: string
  lastName: string
  groupName: string
  role: string
  expectedSalary: string
  expectedDateOfDefense: string
}

export default function Profile() {
  const [users, setUsers] = useState<User[]>([])

  const [formData, setFormData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    groupName: "",
    role: "",
    expectedSalary: "",
    expectedDateOfDefense: new Date(Date.now()),
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      if (formData.id) {
        // If ID exists, send PUT request to update
        await axios.put(`http://localhost:3000/api/users/${formData.id}`, formData)
        alert("User updated successfully")
      } else {
        // If no ID, send POST request to create
        await axios.post("http://localhost:3000/api/users", formData)
        alert("User created successfully")
      }
      fetchData()
      resetForm()
    } catch (error) {
      console.error("Error submitting user:", error)
      alert("Error submitting user")
    }
  }

  const resetForm = () => {
    setFormData({
      id: "",
      firstName: "",
      lastName: "",
      groupName: "",
      role: "",
      expectedSalary: "",
      expectedDateOfDefense: new Date(),
    })
  }

  const editUser = (user: User) => {
    setFormData({
      id: user.id || "",
      firstName: user.firstName,
      lastName: user.lastName,
      groupName: user.groupName,
      role: user.role,
      expectedSalary: user.expectedSalary,
      expectedDateOfDefense: new Date(user.expectedDateOfDefense),
    })
  }

  const deleteUser = async (userId: string) => {
    if (!userId) return

    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:3000/api/users/${userId}`)
        alert("User deleted successfully")
        fetchData()
        // If we're currently editing the user that was deleted, reset the form
        if (formData.id === userId) {
          resetForm()
        }
      } catch (error) {
        console.error("Error deleting user:", error)
        alert("Error deleting user")
      }
    }
  }

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/users")
      setUsers(response.data)
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-800">User Management Dashboard</h1>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <section className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">
              {formData.id ? "Update User" : "Create New User"}
            </h2>
            <form onSubmit={handleSubmit}>
              <input type="hidden" name="id" value={formData.id} />

              {/* First Name */}
              <div className="flex items-center mb-6">
                <label className="w-1/3 font-medium text-gray-600">First Name:</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-2/3 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-500"
                />
              </div>

              {/* Last Name */}
              <div className="flex items-center mb-6">
                <label className="w-1/3 font-medium text-gray-600">Last Name:</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-2/3 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-500"
                />
              </div>

              {/* Group Name */}
              <div className="flex items-center mb-6">
                <label className="w-1/3 font-medium text-gray-600">Group Name:</label>
                <input
                  type="text"
                  name="groupName"
                  value={formData.groupName}
                  onChange={handleChange}
                  className="w-2/3 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-500"
                />
              </div>

              {/* Role */}
              <div className="flex items-center mb-6">
                <label className="w-1/3 font-medium text-gray-600">Role:</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-2/3 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-500"
                />
              </div>

              {/* Expected Salary */}
              <div className="flex items-center mb-6">
                <label className="w-1/3 font-medium text-gray-600">Salary:</label>
                <input
                  type="number"
                  name="expectedSalary"
                  value={formData.expectedSalary}
                  onChange={handleChange}
                  className="w-2/3 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-500"
                />
              </div>

              {/* Defense Date */}
              <div className="flex items-center mb-6">
                <label className="w-1/3 font-medium text-gray-600">Defense Date:</label>
                <input
                  type="date"
                  name="expectedDateOfDefense"
                  value={
                    formData.expectedDateOfDefense instanceof Date
                      ? formData.expectedDateOfDefense.toISOString().split("T")[0]
                      : formData.expectedDateOfDefense
                  }
                  onChange={handleChange}
                  className="w-2/3 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  {formData.id ? "Update" : "Submit"}
                </button>
                {formData.id && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>

          {/* Users Table Section */}
          <section className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">Users List</h2>
            <div className="overflow-x-auto">
              {users.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-lg text-gray-500">No users found. Please add a new user.</p>
                </div>
              ) : (
                <table className="min-w-full table-auto">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase">First Name</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase">Last Name</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase">Group Name</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase">Role</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase">Salary</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase">Defense Date</th>
                      <th className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-700">{user.firstName}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{user.lastName}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{user.groupName}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{user.role}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{user.expectedSalary}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{user.expectedDateOfDefense}</td>
                        <td className="px-6 py-4 text-sm font-medium flex gap-2">
                          <button
                            onClick={() => editUser(user)}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteUser(user.id || "")}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
