import { ChevronRight, type LucideIcon } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';

export function NavMain({
    items,
}: {
    items: {
        id: string;
        title: string;
        url: string;
        icon?: LucideIcon;
        items?: {
            title: string;
            url: string;
        }[];
    }[];
}) {
    const location = useLocation();

    return (
        <SidebarGroup>
            <SidebarMenu>
                {items?.map(item => {
                    const hasSubItems = item?.items && item?.items?.length > 0;
                    const isActive =
                        location?.pathname === item?.url ||
                        item?.items?.some(sub => sub?.url === location?.pathname);

                    return (
                        <SidebarMenuItem key={item?.id}>
                            {hasSubItems ? (
                                <Collapsible
                                    asChild
                                    defaultOpen={isActive}
                                    className="group/collapsible"
                                >
                                    <>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton
                                                tooltip={item?.title}
                                                className={`${isActive ? 'bg-primary text-white' : 'hover:bg-primary/50'}`}
                                            >
                                                {item?.icon && <item.icon />}
                                                <span>{item?.title}</span>
                                                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                {item?.items?.map(subItem => {
                                                    const isSubActive =
                                                        location?.pathname === subItem?.url;
                                                    return (
                                                        <SidebarMenuSubItem key={subItem?.title}>
                                                            <SidebarMenuSubButton
                                                                asChild
                                                                className={`${isSubActive ? 'bg-primary text-white' : ''
                                                                    }`}
                                                            >
                                                                <Link to={subItem?.url}>
                                                                    <span>{subItem?.title}</span>
                                                                </Link>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    );
                                                })}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </>
                                </Collapsible>
                            ) : (
                                <SidebarMenuButton
                                    asChild
                                    tooltip={item?.title}
                                    className={`${isActive ? 'bg-primary hover:bg-primary/80 hover:text-white text-white' : 'hover:bg-primary/50'} py-6 px-4`}
                                >
                                    <Link to={item?.url}>
                                        {item?.icon && <item.icon />}
                                        <span className="ml-1">{item?.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            )}
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}

