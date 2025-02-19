"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        await signIn("credentials", { email, password, redirect: true, callbackUrl: "/" });
    };

    return (
        <section>
            <form onSubmit={handleSubmit}>
                <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="Email"
                    required 
                />
                <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Password" 
                    required
                />
                <p>Don't have an account? <Link href="/auth/signup">Sign Up</Link></p>
                <button type="submit">Sign In</button>
            </form>
        </section>
    );
}