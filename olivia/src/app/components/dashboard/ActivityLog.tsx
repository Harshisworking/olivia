import { CheckCircle2, AlertCircle, Info } from "lucide-react";

export default function ActivityLog() {
    const logs = [
        { id: 1, type: "success", time: "1h ago", text: "PROJECT_ALPHA: Deployment successful. (Deployments: 11+13)" },
        { id: 2, type: "success", time: "2h ago", text: "SYSTEM: New node added (HARSH_HSH)." },
        { id: 3, type: "error", time: "2h ago", text: "SYSTEM: Node connection timeout (HARSH_HSH)." },
        { id: 4, type: "info", time: "3h ago", text: "USER_DRAGO_ULTRA: Sign-in from Authentication Node." },
    ];

    const getIcon = (type: string) => {
        if (type === 'success') return <CheckCircle2 className="w-4 h-4 text-[#00ff88]" />;
        if (type === 'error') return <AlertCircle className="w-4 h-4 text-red-500" />;
        return <Info className="w-4 h-4 text-[#00d1ff]" />;
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-sm font-bold tracking-wider text-white mb-6">RECENT ACTIVITY LOG</h3>
            <div className="space-y-3 overflow-y-auto max-h-[150px] pr-2">
                {logs.map((log) => (
                    <div key={log.id} className="flex items-start gap-3 text-xs">
                        <div className="mt-0.5">{getIcon(log.type)}</div>
                        <p className="text-zinc-300">
                            <span className="text-zinc-500 mr-2">{log.time} -</span>
                            {log.text}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}