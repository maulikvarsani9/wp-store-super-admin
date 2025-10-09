'use client';

import * as React from 'react';

import { NavMain } from '@/components/nav-main';
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarRail,
    SidebarSeparator,
} from '@/components/ui/sidebar';
import {
    FolderTree,
    Shield,
    Settings,
} from 'lucide-react';
import { useStore } from '@/store/store';

const data = {
    navMain: [
        {
            id: 'categories',
            title: 'Categories',
            icon: FolderTree,
            url: '/categories',
        },
        {
            id: 'settings',
            title: 'Settings',
            icon: Settings,
            url: '/settings',
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { user } = useStore();

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader className="px-6 py-4">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-[#ff6b00] rounded-lg flex items-center justify-center overflow-hidden shadow-sm">
                        <Shield className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <span className="text-lg font-bold text-gray-800 truncate block">
                            Kharidi360
                        </span>
                        <span className="text-xs text-gray-500 truncate block">
                            Super Admin Panel
                        </span>
                    </div>
                </div>
            </SidebarHeader>
            <SidebarSeparator className="!w-auto" />
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}

