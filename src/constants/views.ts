import HomeView from "@/views/home";
import TaskView from "@/views/tasks";
import CalendarView from "@/views/calendar";
import JournalView from "@/views/journal";
import WhiteboardView from "@/views/whiteboard";
import SettingsView from "@/views/settings";
import OnboardingView from "@/views/onboarding";
import NotesView from "@/views/notes";

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
    'fileExplorer': false,
    'sidebar': true,
  },
  "calendar": {
    'view': CalendarView,
    'path': 'calendar',
    'fileExplorer': false,
    'sidebar': true,
  },
  "notes": {
    'view': NotesView,
    'path': 'notes',
    'fileExplorer': true,
    'sidebar': false,
  },
  "journal": {
    'view': JournalView,
    'path': 'journal',
    'fileExplorer': true,
    'sidebar': false,
  },
  "whiteboard": {
    'view': WhiteboardView,
    'path': 'whiteboard',
    'fileExplorer': true,
    'sidebar': true,
  },
  "settings": {
    'view': SettingsView,
    'path': 'settings',
    'fileExplorer': false,
    'sidebar': false,
  },
}