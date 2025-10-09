import React from 'react';
import { FiSettings, FiUser, FiLock, FiBell } from 'react-icons/fi';

const Settings: React.FC = () => {
    return (
        <div>
            <div className="max-w-full">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                    <p className="text-gray-600 mt-1">
                        Manage your super admin settings and preferences
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Profile Settings */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center mb-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <FiUser className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Profile Settings
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Update your personal information
                                </p>
                            </div>
                        </div>
                        <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                            Edit Profile
                        </button>
                    </div>

                    {/* Security Settings */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center mb-4">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <FiLock className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Security
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Password and authentication settings
                                </p>
                            </div>
                        </div>
                        <button className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                            Change Password
                        </button>
                    </div>

                    {/* Notification Settings */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center mb-4">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <FiBell className="h-6 w-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Notifications
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Manage notification preferences
                                </p>
                            </div>
                        </div>
                        <button className="w-full mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
                            Configure
                        </button>
                    </div>

                    {/* System Settings */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center mb-4">
                            <div className="p-3 bg-orange-100 rounded-lg">
                                <FiSettings className="h-6 w-6 text-orange-600" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    System Settings
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Platform-wide configurations
                                </p>
                            </div>
                        </div>
                        <button className="w-full mt-4 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors">
                            Manage
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;

