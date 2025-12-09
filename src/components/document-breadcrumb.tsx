"use client";

import { useDocuments } from "@/context/documents-context";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";

export function DocumentBreadcrumb() {
    const { currentDocument, getBreadcrumbs, setCurrentDocumentId } = useDocuments();

    const breadcrumbs = getBreadcrumbs(currentDocument?.id);

    // Don't render if only root (no document selected)
    if (breadcrumbs.length <= 1) {
        return null;
    }

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {breadcrumbs.map((item, index) => {
                    const isLast = index === breadcrumbs.length - 1;

                    return (
                        <div key={item.id} className="flex items-center gap-1.5">
                            <BreadcrumbItem>
                                {isLast ? (
                                    <BreadcrumbPage className="text-zinc-100 max-w-[200px] truncate">
                                        {item.name}
                                    </BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink
                                        onClick={() => {
                                            if (item.type === 'document') {
                                                setCurrentDocumentId(item.id);
                                            }
                                            // For folders and root, we could add navigation logic here
                                            // For now, only document navigation is supported
                                        }}
                                        className="text-zinc-400 hover:text-zinc-200 cursor-pointer max-w-[150px] truncate"
                                    >
                                        {item.type === 'root' ? (
                                            <div className="flex items-center gap-1">
                                                <Home className="w-3.5 h-3.5" />
                                                <span>{item.name}</span>
                                            </div>
                                        ) : (
                                            item.name
                                        )}
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                            {!isLast && <BreadcrumbSeparator className="text-zinc-500" />}
                        </div>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
