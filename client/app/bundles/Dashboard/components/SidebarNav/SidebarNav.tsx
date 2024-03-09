import React, { useEffect, useState } from 'react';
import { logout } from '../../../../services/sessionService';
import { Bookmark, Circle, Home, LibraryBig, Menu, Search, X } from 'lucide-react';
import { useStore } from '../../../../hooks-store/store';
import { Separator } from '../../../../common/components/ui/separator';

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
      <div className="user-info">
        <span>{userInfo.email}</span>
        <a role="button" onClick={() => logout()}>Logout</a>
      </div>
    </footer>}
  </nav>;
};

export default SidebarNav;