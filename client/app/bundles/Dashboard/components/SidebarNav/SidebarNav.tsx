import React, { useEffect, useState } from 'react';
import { logout } from '../../../../services/sessionService';
import { Bookmark, Circle, Home, LibraryBig, LogOut, Menu, Search, Settings, User, X } from 'lucide-react';
import { useStore } from '../../../../hooks-store/store';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/common/components/ui/dropdown-menu';
import UserAvatar from '@/common/components/UserAvatar';
import { Button } from '@/common/components/ui/button';
import { useMediaQuery } from 'react-responsive';

type SidebarNavItem = {
  title: string;
  url: string;
  section: string;
  active: boolean;
  iconClass: string;
};

const SidebarNav: React.FC<{ items: SidebarNavItem[], title?: string, useCourseTitle?: boolean, userInfo: any }> = ({ items, title, useCourseTitle = false, userInfo }) => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const state = useStore()[0];
  const [navTitle, setNavTitle] = useState(title);

  useEffect(() => {
    if (useCourseTitle) {
      const course = state.course;
      if (course) {
        setNavTitle(course.title);
      }
    }
  }, [state]);

  const getItemIcon = (item: SidebarNavItem): any => {
    switch (item.iconClass) {
      case 'home':
        return Home;
      case 'courses':
        return LibraryBig;
      case 'discover':
        return Search;
      case 'library':
        return Bookmark;
    }
  };

  const getSections = (): SidebarNavItem[][] => {
    const itemsBySection: Record<string, SidebarNavItem[]> = {};
    items.forEach(item => {
      if (!itemsBySection[item.section]) {
        itemsBySection[item.section] = [];
      }
      itemsBySection[item.section].push(item);
    });
    return Object.values(itemsBySection);
  };

  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

  const sections = getSections();
  const isDesktop = useMediaQuery({
    query: '(min-width: 1024px)'
  })
  const dropdownContentProps: any = isDesktop
    ? {
      align: "end",
      side: "right",
      className: "w-56"
    }
    : {
      align: "center",
      side: "top",
      className: "w-screen"
    };

  return <nav className={`bg-secondary text-secondary-foreground ${isNavbarOpen ? 'open' : ''}`}>
    <div className="navbar">
      <a href="/">
        {/* TODO */}
        <Circle className="logo" />
      </a>
      {navTitle ? <h1>{navTitle}</h1> : <div></div>}
      {isNavbarOpen
        ? <X className="outline-0" role="button" tabIndex={0} onClick={toggleNavbar} />
        : <Menu className="outline-0" role="button" tabIndex={0} onClick={toggleNavbar} />
      }
    </div>
    <header>
      <span className="logo">Snaplearn</span>
    </header>
    {sections.map((section, index) => (
      <section key={index}>
        {section.map(item => {
          const ItemIcon = getItemIcon(item);
          return <a key={item.title} href={item.url} aria-current={item.active ? 'page' : undefined} title={item.title}>
            <ItemIcon className="w-4 h-4" />
            {item.title}
          </a>
        })}
      </section>
    ))}
    {userInfo && <footer>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-full justify-start px-6 py-4">
            <UserAvatar user={{ name: userInfo.username }} asLink={false}/>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent {...dropdownContentProps}>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => logout()}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </footer>}
  </nav>;
};

export default SidebarNav;