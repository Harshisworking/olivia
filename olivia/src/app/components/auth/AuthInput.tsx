interface AuthInputProps {
    type: string;
    placeholder: string;
    label: string;
    icon: string;
    isPassword?: boolean;
    changing: (value: string) => void
}

export const AuthInput: React.FC<AuthInputProps> = ({ type, placeholder, label, icon, isPassword, changing }) => {

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        changing(e.target.value);
    }

    return (
        <div className="w-full group">
            <div className="flex justify-between mb-1 px-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</label>
            </div>
            <div className="relative flex items-center">
                <span className="absolute left-4 text-sky-500/60 font-mono text-sm group-focus-within:text-sky-400">
                    {icon}
                </span>
                <input
                    type={type}
                    placeholder={placeholder}
                    className="w-full bg-black/30 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-500/50 focus:bg-black/50 transition-all"
                    onChange={handleChange}
                />
                {isPassword && (
                    <button type="button" className="absolute right-4 text-[10px] text-slate-500 hover:text-white uppercase font-bold tracking-tighter">
                        Show
                    </button>
                )}
            </div>
        </div>
    );
};