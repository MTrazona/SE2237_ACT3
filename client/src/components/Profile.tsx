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

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    console.log("formData", formData)

    if (formData.id) {
      // If ID exists, send PUT request to update
      axios
        .put(`http://localhost:3000/api/users/${formData.id}`, formData)
        .then((response) => {
          console.log("update response", response)
          alert("User updated successfully")
          fetchData() // Refresh the list after update
        })
        .catch((error) => {
          console.error("Error updating user:", error)
          alert("Error updating user")
        })
    } else {
      // If no ID, send POST request to create
      axios
        .post("http://localhost:3000/api/users", formData)
        .then((response) => {
          console.log("create response", response)
          alert("User created successfully")
          fetchData() // Refresh the list after creation
        })
        .catch((error) => {
          console.error("Error creating user:", error)
          alert("Error creating user")
        })
    }

    // Reset form after submission
    resetForm()
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

  const deleteUser = (userId: string) => {
    if (!userId) return

    if (window.confirm("Are you sure you want to delete this user?")) {
      axios
        .delete(`http://localhost:3000/api/users/${userId}`)
        .then(() => {
          alert("User deleted successfully")
          fetchData() // Refresh the list after deletion

          // If we're currently editing the user that was deleted, reset the form
          if (formData.id === userId) {
            resetForm()
          }
        })
        .catch((error) => {
          console.error("Error deleting user:", error)
          alert("Error deleting user")
        })
    }
  }

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/users")
      console.log("response", response.data)
      setUsers(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div>
      <div className="users-list">
        <h2>Users List</h2>
        {users.map((user, i) => (
          <div className="user-card" key={i}>
            <p>First name: {user.firstName}</p>
            <p>Last name: {user.lastName}</p>
            <p>Group name: {user.groupName}</p>
            <p>Role: {user.role}</p>
            <p>Expected salary: {user.expectedSalary}</p>
            <p>Expected date of defense: {user.expectedDateOfDefense}</p>
            <div className="user-actions">
              <button onClick={() => editUser(user)}>Edit</button>
              <button onClick={() => deleteUser(user.id || "")} className="delete-button">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="form-container">
        <h2>{formData.id ? "Update User" : "Create New User"}</h2>
        <form onSubmit={handleSubmit}>
          {/* Hidden ID field */}
          <input type="hidden" name="id" value={formData.id} />

          <label>
            First Name:
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
          </label>

          <label>
            Last Name:
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
          </label>

          <label>
            Group Name:
            <input type="text" name="groupName" value={formData.groupName} onChange={handleChange} />
          </label>

          <label>
            Role:
            <input type="text" name="role" value={formData.role} onChange={handleChange} />
          </label>

          <label>
            Expected Salary:
            <input type="number" name="expectedSalary" value={formData.expectedSalary} onChange={handleChange} />
          </label>

          <label>
            Expected Date of Defense:
            <input
              type="date"
              name="expectedDateOfDefense"
              value={
                formData.expectedDateOfDefense instanceof Date
                  ? formData.expectedDateOfDefense.toISOString().split("T")[0]
                  : formData.expectedDateOfDefense
              }
              onChange={handleChange}
            />
          </label>

          <div className="form-buttons">
            <button type="submit">{formData.id ? "Update" : "Submit"}</button>
            {formData.id && (
              <button type="button" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

