import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import React from 'react';

function Header() {
    return (
        <header className="bg-gray-800 text-white p-4">
            <NavigationMenu>
                <NavigationMenuList className="flex space-x-4">
                    <NavigationMenuItem>
                        <NavigationMenuLink href="/" className="text-white hover:text-gray-300">
                            QuickMark
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink href="/dashboard" className="text-white hover:text-gray-300">
                            Dashboard
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink href="/admin" className="text-white hover:text-gray-300">
                            Admin
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink href="/login" className="text-white hover:text-gray-300">
                            Logout
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </header>
    );
}

export default Header;