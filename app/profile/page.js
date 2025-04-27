"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();

  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (session?.user) {
      const fullName = `${session.user.firstName} ${session.user.lastName}`;
      setName(fullName.trim()); // Trim in case there's any empty space
      setFirstName(session.user.firstName);
      setLastName(session.user.lastName);
      setEmail(session.user.email);
      setBio(session.user.bio);
    }
  }, [session]);

  const getInitials = (first, last) => {
    if (!first && !last) return "??";
    return `${first?.[0] || ""}${last?.[0] || ""}`.toUpperCase();
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage("");

    try {
      const res = await fetch(`/api/user/${session?.user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bio }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Bio updated successfully!");
        console.log("Response Data:", data);
        await update({ 
          bio: data.user.bio,
        });
        console.log("Updated session:", session);
      } else {
        setMessage(data.message || "Failed to update bio.");
      }
    } catch (error) {
      setMessage("Error updating bio.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl min-h-screen mx-auto py-12 px-4">
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center space-x-4">
          <Avatar className="h-16 w-16">
            {/* <AvatarImage src="/profile-pic.jpg" /> */}
            <AvatarFallback>{getInitials(firstName, lastName)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{name}</CardTitle>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="profile">Profile Info</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="workouts">Workouts</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bio</label>
                <Textarea value={bio} onChange={(e) => setBio(e.target.value)} />
              </div>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Settings coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workouts">
          <Card>
            <CardHeader>
              <CardTitle>Your Workouts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Workout history and stats will show up here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
