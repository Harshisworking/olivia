"use client"
import React from 'react';
import { useState, useEffect } from 'react';
import { io, Socket } from "socket.io-client";

const parseDockerStats = (rawData: string) => {
    try {
        // Find the JSON object hidden inside the ANSI escape codes
        const match = rawData.match(/\{.*\}/);
        if (!match) return null;

        const data = JSON.parse(match[0]);

        // Return strictly the requested fields
        return {
            cpu: data.CPUPerc,      // e.g., "0.00%"
            ram: data.MemUsage,     // e.g., "13.88MiB / 14.96GiB"
            disk: data.BlockIO      // e.g., "8.77MB / 4.1kB"
        };
    } catch (error) {
        return null;
    }
};
// Reusable Gauge Component
const CircularGauge = ({ percentage, label, color }: { percentage: number, label: string, color: string }) => (
    <div className="flex flex-col items-center">
        <div className="relative w-20 h-20 flex items-center justify-center rounded-full border-4 border-white/5">
            {/* Placeholder for actual SVG Circle Progress */}
            <div className={`absolute inset-0 border-4 rounded-full border-t-${color} border-r-${color} opacity-80`} style={{ transform: `rotate(${percentage * 3.6}deg)` }}></div>
            <span className="text-xl font-bold text-white">{percentage}%</span>
        </div>
        <span className="text-xs text-zinc-400 mt-2 font-semibold uppercase">{label}</span>
    </div>
);

export default function SystemOverview() {
    const [cpuPercentage, setCpuPercentage] = useState(90);
    const [memPercentage, setMemPercentage] = useState(90);
    const [diskPercentage, setDiskPercentage] = useState(90);

    useEffect(() => {
        const socket: Socket = io("http://localhost:4000");

        socket.on("connect", () => {
            console.log("connected to webSocket server");

            socket.emit("watch_system")
        })

        socket.on("system-stats-update", (data) => {
            const cleanData = JSON.parse(data)
            setCpuPercentage(cleanData?.cpu)
            setMemPercentage(cleanData?.ram)
            setDiskPercentage(cleanData?.disk)
        })
        return () => {
            socket.disconnect();
        }
    }, [])


    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
            <h3 className="text-sm font-bold tracking-wider text-white mb-6">SYSTEM OVERVIEW</h3>

            <div className="flex justify-around items-center mb-6">
                <CircularGauge percentage={cpuPercentage} label="CPU" color="[#00d1ff]" />
                <CircularGauge percentage={memPercentage} label="Memory" color="[#00ff88]" />
                <CircularGauge percentage={diskPercentage} label="Disk" color="[#00ff88]" />
            </div>

            <div className="flex justify-center text-xs text-zinc-400 border-t border-white/10 pt-4 mt-auto">
                <span>Total Projects: <strong className="text-white">8</strong></span>
            </div>
        </div>
    );
}