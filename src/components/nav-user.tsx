import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function NavUser(user: { name: string, email: string, image: string }) {
    return (
        <div className="px-2 py-1.5 flex items-center gap-2 cursor-pointer hover:bg-zinc-700/50 rounded transition-colors">
            <Avatar className="w-7 h-7">
                <AvatarImage src={user.image} />
                <AvatarFallback className="bg-zinc-600 text-zinc-100 text-xs">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-zinc-100 truncate">{user.name || 'Usuário'}</p>
                <p className="text-[10px] text-zinc-400 truncate">{user.email || 'm@example.com'}</p>
            </div>
        </div>
    )
}