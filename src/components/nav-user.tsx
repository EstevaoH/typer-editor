import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function NavUser(user: { name: string, email: string, image: string }) {
    return (
        <div className="px-2 pb-2 flex items-center gap-3 border-b border-zinc-700 cursor-pointer">
            <Avatar>
                <AvatarImage src={user.image} />
                <AvatarFallback className="bg-zinc-600 text-zinc-100">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-100 truncate">{user.name || 'Usuário'}</p>
                <p className="text-xs text-zinc-400 truncate">{user.email || 'm@example.com'}</p>
            </div>
        </div>
    )
}