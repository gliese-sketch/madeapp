"use client";
import { useEffect, useState } from "react";
import { HeroUIProvider } from "@heroui/react";
import { SignUp } from "@/components";
import { io } from "socket.io-client";

const socket = io(
  "https://congenial-zebra-69r46pjwvr6vf6pw-8000.app.github.dev/"
);

console.log(socket);

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const session = sessionStorage.getItem("user");
    if (session) {
      setUser(JSON.parse(session));
    }
  }, []);

  return (
    <HeroUIProvider>
      <div className="min-h-screen max-h-screen">
        {!user ? (
          <SignUp setUser={setUser} socket={socket} />
        ) : (
          `Welcome ${user.name}`
        )}
      </div>
    </HeroUIProvider>
  );
}
