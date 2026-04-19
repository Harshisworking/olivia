"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
    return (
        <button
            onClick={() => signOut()}
            className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-all"
        >
            TERMINATE SESSION
        </button>
    );
}