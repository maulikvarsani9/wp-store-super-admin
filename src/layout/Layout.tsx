import { AppSidebar } from '@/components/app-sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import { useStore } from '@/store/store';
import { useEffect, useRef, useState } from 'react';
import {
    FiAlertTriangle,
    FiChevronDown,
    FiLogOut,
    FiSettings,
    FiUser,
} from 'react-icons/fi';
import { Outlet, useNavigate } from 'react-router-dom';

const Layout = () => {
    const { user } = useStore();
    const navigate = useNavigate();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const { logout } = useStore();
    const userMenuRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        setShowLogoutConfirm(true);
    };

    const confirmLogout = () => {
        logout();
        setShowLogoutConfirm(false);
    };

    const cancelLogout = () => {
        setShowLogoutConfirm(false);
    };

    const handleProfileClick = () => {
        setShowUserMenu(false);
        navigate('/profile');
    };

    const handleSettingsClick = () => {
        setShowUserMenu(false);
        navigate('/settings');
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(event.target as Node)
            ) {
                setShowUserMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset className="bg-slate-100">
                    <header className="sticky top-0 z-50 flex justify-between bg-white h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="relative" ref={userMenuRef}>
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                >
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center">
                                        <Avatar>
                                            <AvatarImage
                                                src={
                                                    user?.profilePicture ||
                                                    'https://github.com/shadcn.png'
                                                }
                                                alt="@shadcn"
                                            />
                                            <AvatarFallback>
                                                {user?.name?.charAt(0) || 'SA'}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <div className="hidden sm:block text-left">
                                        <p className="text-sm font-medium text-gray-900">
                                            {user?.name}
                                        </p>
                                        <p className="text-xs text-gray-500">{user?.email}</p>
                                    </div>
                                    <FiChevronDown className="w-4 h-4 text-gray-400" />
                                </button>
                                {showLogoutConfirm && (
                                    <div
                                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                                        onClick={cancelLogout}
                                    >
                                        <div
                                            className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
                                            onClick={e => e.stopPropagation()}
                                        >
                                            <div className="p-6">
                                                <div className="flex items-center mb-4">
                                                    <div className="flex-shrink-0">
                                                        <FiAlertTriangle className="h-6 w-6 text-yellow-500" />
                                                    </div>
                                                    <div className="ml-3">
                                                        <h3 className="text-lg font-medium text-gray-900">
                                                            Confirm Logout
                                                        </h3>
                                                    </div>
                                                </div>
                                                <div className="mb-6">
                                                    <p className="text-sm text-gray-500">
                                                        Are you sure you want to logout? You will need to
                                                        sign in again to access your account.
                                                    </p>
                                                </div>
                                                <div className="flex justify-end space-x-3">
                                                    <button
                                                        onClick={cancelLogout}
                                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={confirmLogout}
                                                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                    >
                                                        Logout
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                                        <div className="p-2">
                                            <div className="px-3 py-2 border-b border-gray-100 mb-2">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {user?.name}
                                                </p>
                                                <p className="text-xs text-gray-500">{user?.email}</p>
                                                <p className="text-xs text-[#ff6b00] font-semibold mt-1">
                                                    {user?.role === 'superadmin' ? 'Super Admin' : 'Admin'}
                                                </p>
                                            </div>

                                            <div className="mb-2">
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-1">
                                                    Account
                                                </p>
                                                <button
                                                    onClick={handleProfileClick}
                                                    className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                                                >
                                                    <FiUser className="w-4 h-4 text-gray-500" />
                                                    <span className="text-sm text-gray-700">Profile</span>
                                                </button>
                                            </div>

                                            <div className="mb-2">
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-1">
                                                    Admin
                                                </p>
                                                <button
                                                    onClick={handleSettingsClick}
                                                    className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                                                >
                                                    <FiSettings className="w-4 h-4 text-gray-500" />
                                                    <span className="text-sm text-gray-700">
                                                        Settings
                                                    </span>
                                                </button>
                                            </div>

                                            <hr className="my-2" />
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                            >
                                                <FiLogOut className="w-4 h-4 text-red-500" />
                                                <span className="text-sm text-red-600">Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </header>
                    <div className="flex flex-1 flex-col gap-4 p-4">
                        <Outlet />
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
};

export default Layout;

