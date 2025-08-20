// Mock API functions that would connect to your backend

export async function createRoom(roomData: {
  name: string
  isPrivate: boolean
  battleDuration: number
  maxPlayers: number
}) {
  // This would be a POST request to your API
  const response = await fetch("/api/rooms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify(roomData),
  })

  if (!response.ok) {
    throw new Error("Failed to create room")
  }

  return response.json()
}

export async function joinRoom(roomId: string) {
  // This would be a POST request to your API
  const response = await fetch(`/api/rooms/${roomId}/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAuthToken()}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to join room")
  }

  return response.json()
}

export async function leaveRoom(roomId: string) {
  // This would be a DELETE request to your API
  const response = await fetch(`/api/rooms/${roomId}/leave`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to leave room")
  }

  return response.json()
}

export async function getRooms() {
  // This would be a GET request to your API
  const response = await fetch("/api/rooms", {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch rooms")
  }

  return response.json()
}

export async function getRoomById(roomId: string) {
  // This would be a GET request to your API
  const response = await fetch(`/api/rooms/${roomId}`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch room")
  }

  return response.json()
}

function getAuthToken() {
  // Get auth token from localStorage, cookies, or your auth provider
  return localStorage.getItem("authToken") || ""
}
