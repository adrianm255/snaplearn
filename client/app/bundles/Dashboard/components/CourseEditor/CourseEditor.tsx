import React from 'react';
import { Course } from '../../../../types/course';
import { Tab, TabList, TabPanel, Tabs } from '../../../../common/components/Tabs/Tabs';
import useTranslation from '../../../../libs/i18n/useTranslation';

const CourseEditor: React.FC<{ course: Course }> = ({ course }) => {
  const { t } = useTranslation();
  
  return <Tabs>
    <header className="dashboard-header sticky">
      <h1>{course.title}</h1>
      <div className="actions">
        <button type="button">Test 1</button>
        <button type="button" className="accent">Test 2</button>
      </div>
      <TabList>
        <Tab tabId="courseTab">{t('course_editor.course_tab_label')}</Tab>
        <Tab tabId="contentTab">{t('course_editor.content_tab_label')}</Tab>
      </TabList>
    </header >
    <main className="content">
      <TabPanel tabId="courseTab">
        <p>This is the content of Tab 1</p>
      </TabPanel>
      <TabPanel tabId="contentTab">
        <p>This is the content of Tab 2</p>
      </TabPanel>
    </main>
  </Tabs>;
};

export default CourseEditor;