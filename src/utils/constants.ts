import HomeView from "../views/home";
import TaskView from "../views/tasks";
import CalendarView from "../views/calendar";
import JournalView from "../views/journal";
import WhiteboardView from "../views/whiteboard";
import SettingsView from "../views/settings";
import OnboardingView from "../views/onboarding";

export const APP_VIEW_CONFIG = {
  'onboarding': {
    'view': OnboardingView,
    'path': 'onboarding',
    'fileExplorer': false,
    'sidebar': false,
  },
  'home': {
    'view': HomeView,
    'path': 'home',
    'fileExplorer': false,
    'sidebar': false,
  },
  "tasks": {
    'view': TaskView,
    'path': 'tasks',
    'fileExplorer': true,
    'sidebar': true,
  },
  "calendar": {
    'view': CalendarView,
    'path': 'calendar',
    'fileExplorer': false,
    'sidebar': true,
  },
  "journal": {
    'view': JournalView,
    'path': 'journal',
    'fileExplorer': true,
    'sidebar': true,
  },
  "whiteboard": {
    'view': WhiteboardView,
    'path': 'whiteboard',
    'fileExplorer': true,
    'sidebar': false,
  },
  "settings": {
    'view': SettingsView,
    'path': 'settings',
    'fileExplorer': false,
    'sidebar': false,
  },
}