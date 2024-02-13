import React, { useState, useContext, useEffect, Children, ReactNode } from 'react';

const TabsContext = React.createContext({
  activeTab: '',
  setActiveTab: (tabId: string) => {},
});

const Tabs: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log('TABS');

  const getInitialActiveTab = () => {
    let activeTabId = '';
  
    const findTabList = (children: React.ReactNode): React.ReactElement | undefined => {
      let foundTabList;
  
      React.Children.forEach(children, child => {
        if (React.isValidElement(child)) {
          if (child.type === TabList) {
            foundTabList = child;
          } else if (child.props && child.props.children && !foundTabList) {
            foundTabList = findTabList(child.props.children);
          }
        }
      });
  
      return foundTabList;
    };
  
    const tabList = findTabList(children);
    
    if (tabList) {
      const tabs = React.Children.toArray(tabList.props.children) as React.ReactElement[];
      const activeTab = tabs.find((tab: any) => tab.props && tab.props.active);
  
      activeTabId = activeTab ? activeTab.props.tabId : tabs[0] ? tabs[0].props.tabId : '';
    }
  
    return activeTabId;
  };

  const [activeTab, setActiveTab] = useState(getInitialActiveTab());

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  );
};

const TabList: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div role="tablist">{children}</div>;
};

const Tab: React.FC<{ tabId: string; active?: boolean; children: React.ReactNode }> = ({ tabId, active, children }) => {
  const { activeTab, setActiveTab } = useContext(TabsContext);

  useEffect(() => {
    if (active) {
      setActiveTab(tabId);
    }
  }, [active]);

  const handleClick = () => {
    setActiveTab(tabId);
  };

  return (
    <a role="tab" aria-selected={activeTab === tabId} onClick={handleClick}>
      {children}
    </a>
  );
};

const TabPanel: React.FC<{ tabId: string; children: React.ReactNode }> = ({ tabId, children }) => {
  const { activeTab } = useContext(TabsContext);

  if (activeTab !== tabId) return null;

  return <div>{children}</div>;
};

export { Tabs, TabList, Tab, TabPanel };
