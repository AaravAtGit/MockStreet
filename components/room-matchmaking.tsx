"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Users, Plus, Search, Lock, Unlock, Trophy, Clock, Copy, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { io, Socket } from "socket.io-client"

const API_URL = "https://api.mockstreet.com"

interface Room {
  room_id: string
  room_name: string
  players: string[]
  isPrivate: boolean
  battleDuration: number
}

interface RoomMatchmakingProps {
  onBattleStart: (roomId: string, username: string) => void
}

export function RoomMatchmaking({ onBattleStart }: RoomMatchmakingProps) {
  const [activeTab, setActiveTab] = useState<"browse" | "create">("browse")
  const [rooms, setRooms] = useState<Room[]>([])
  const [roomName, setRoomName] = useState("")
  const [isPrivate, setIsPrivate] = useState(false)
  const [battleDuration, setBattleDuration] = useState(5)
  const [joinRoomId, setJoinRoomId] = useState("")
  const [username, setUsername] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [isJoining, setIsJoining] = useState<string | null>(null)
  const [isCheckingStatus, setIsCheckingStatus] = useState(false)
  const [socket, setSocket] = useState<Socket | null>(null)

  const checkUserStatus = useCallback(async (user: string) => {
    if (!user) return;
    setIsCheckingStatus(true);
    try {
      const response = await fetch(`${API_URL}/user/${user}/status`);
      const data = await response.json();
      if (data.status === 'in_battle') {
        toast({
          title: "🚀 Welcome Back!",
          description: "Redirecting you to your ongoing battle...",
        });
        onBattleStart(data.room_id, user);
      }
    } catch (error) {
      console.error("Failed to check user status:", error);
    } finally {
      setIsCheckingStatus(false);
    }
  }, [onBattleStart]);

  useEffect(() => {
    const newSocket = io(API_URL);
    setSocket(newSocket);

    fetchRooms();

    newSocket.on('connect', () => console.log('Connected to WebSocket server'));
    newSocket.on('player_joined', () => fetchRooms());
    newSocket.on('game_started', (data) => {
      if (data && data.room_id && rooms.flatMap(r => r.players).includes(username)) {
        toast({
          title: "Game Starting!",
          description: "Both players are in. Get ready to battle!",
        });
        onBattleStart(data.room_id, username);
      }
    });

    return () => {
      newSocket.off('player_joined');
      newSocket.off('game_started');
      newSocket.disconnect();
    };
  }, [username, onBattleStart, rooms]);

  const fetchRooms = async () => {
    try {
      const response = await fetch(`${API_URL}/rooms`);
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
      toast({
        title: "Error",
        description: "Could not fetch rooms from the server.",
        variant: "destructive",
      });
    }
  };

  const handleCreateRoom = async () => {
    setIsCreating(true);
    try {
      const response = await fetch(`${API_URL}/room`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          room_name: roomName,
          private: isPrivate,
          match_time: battleDuration,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        toast({
          title: "🎯 Room Created!",
          description: `Room "${roomName}" is ready. Waiting for opponent...`,
        });
        socket?.emit('join', { username, room: data.room_id });
        setRoomName("");
        setActiveTab("browse");
        fetchRooms();
        if (isPrivate) copyRoomId(data.room_id, false);
      } else {
        throw new Error(data.error || "Failed to create room");
      }
    } catch (error: any) {
      toast({ title: "❌ Error Creating Room", description: error.message, variant: "destructive" });
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinRoom = async (roomId: string) => {
    setIsJoining(roomId);
    try {
      const response = await fetch(`${API_URL}/room/${roomId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
      const data = await response.json();
      if (response.ok) {
        toast({ title: "🚀 Joined Room!", description: `Entering battle...` });
        socket?.emit('join', { username, room: roomId });
      } else {
        throw new Error(data.error || "Failed to join room");
      }
    } catch (error: any) {
      toast({ title: "❌ Error Joining Room", description: error.message, variant: "destructive" });
    } finally {
      setIsJoining(null);
    }
  };
  
  const copyRoomId = (roomId: string, showToast = true) => {
    navigator.clipboard.writeText(roomId);
    if (showToast) toast({ title: "📋 Copied!", description: "Room ID copied to clipboard." });
  };

  const isUsernameSet = username.trim().length > 0;

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <Card className="bg-black border-white/20 p-4 mb-6">
        {/* Header */}
      </Card>

      <div className="max-w-sm mx-auto mb-6">
        <Label htmlFor="username" className="text-white text-lg font-bold">Enter Your Username</Label>
        <div className="flex items-center space-x-2 mt-2">
          <Input
            id="username"
            placeholder="e.g., TraderX"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-gray-900 border-white/20 text-white placeholder:text-gray-500 text-center text-xl"
          />
          <Button onClick={() => checkUserStatus(username)} disabled={!isUsernameSet || isCheckingStatus}>
            {isCheckingStatus ? <Loader2 className="w-4 h-4 animate-spin" /> : "Go"}
          </Button>
        </div>
      </div>

      {isUsernameSet && (
        <>
          <div className="flex space-x-1 mb-6 justify-center">
            <Button onClick={() => setActiveTab("browse")} variant={activeTab === "browse" ? "default" : "outline"} className={activeTab === "browse" ? "bg-blue-600 text-white" : "border-white/30 text-white bg-transparent"}>
              <Search className="w-4 h-4 mr-2" /> Browse Rooms
            </Button>
            <Button onClick={() => setActiveTab("create")} variant={activeTab === "create" ? "default" : "outline"} className={activeTab === "create" ? "bg-blue-600 text-white" : "border-white/30 text-white bg-transparent"}>
              <Plus className="w-4 h-4 mr-2" /> Create Room
            </Button>
          </div>

          {activeTab === "browse" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="bg-black border-white/20">
                  <CardHeader><CardTitle className="text-white flex items-center space-x-2"><Users className="w-5 h-5 text-green-400" /><span>Available Rooms</span></CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {rooms.map((room) => (
                        <div key={room.room_id} className="flex items-center justify-between p-4 rounded-lg bg-gray-900 border border-white/10">
                          <div className="flex items-center space-x-4">
                            {room.isPrivate ? <Lock className="w-4 h-4 text-yellow-400" /> : <Unlock className="w-4 h-4 text-green-400" />}
                            <div>
                              <div className="text-white font-medium">{room.room_name}</div>
                              <div className="text-gray-400 text-sm">Players: {room.players.join(', ')}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-center">
                              <div className="text-white font-mono">{room.players.length}/2</div>
                              <div className="text-gray-400 text-xs">Players</div>
                            </div>
                            {room.players.length < 2 && (
                              <Button onClick={() => handleJoinRoom(room.room_id)} disabled={isJoining === room.room_id} className="bg-green-600 hover:bg-green-700 text-white">
                                {isJoining === room.room_id ? "Joining..." : "Join"}
                              </Button>
                            )}
                            {room.isPrivate && <Button onClick={() => copyRoomId(room.room_id)} variant="outline" size="sm" className="border-white/30 text-white"><Copy className="w-3 h-3 mr-1" /> Copy ID</Button>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div>
                <Card className="bg-black border-white/20">
                  <CardHeader><CardTitle className="text-white flex items-center space-x-2"><Lock className="w-5 h-5 text-yellow-400" /><span>Join Private Room</span></CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <Input id="room-id" placeholder="Enter room ID..." value={joinRoomId} onChange={(e) => setJoinRoomId(e.target.value)} className="bg-gray-900 border-white/20 text-white" />
                    <Button onClick={() => handleJoinRoom(joinRoomId)} className="w-full bg-yellow-600 hover:bg-yellow-700 text-white">Join Private Room</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "create" && (
            <div className="max-w-2xl mx-auto">
              <Card className="bg-black border-white/20">
                <CardHeader><CardTitle className="text-white flex items-center space-x-2"><Plus className="w-5 h-5 text-blue-400" /><span>Create New Room</span></CardTitle></CardHeader>
                <CardContent className="space-y-6">
                  <Input id="room-name" placeholder="Enter room name..." value={roomName} onChange={(e) => setRoomName(e.target.value)} className="bg-gray-900 border-white/20 text-white" />
                  <select value={battleDuration} onChange={(e) => setBattleDuration(Number(e.target.value))} className="w-full p-2 bg-gray-900 border border-white/20 text-white rounded-md">
                    <option value={5}>5 minutes</option><option value={10}>10 minutes</option><option value={15}>15 minutes</option>
                  </select>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="private-room" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} />
                    <Label htmlFor="private-room" className="text-white">Make room private</Label>
                  </div>
                  <Button onClick={handleCreateRoom} disabled={isCreating} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    {isCreating ? "Creating..." : "Create Room"} <Trophy className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  )
}
