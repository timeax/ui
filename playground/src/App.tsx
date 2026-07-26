import { useState, useEffect } from 'react';
import {
  Sun,
  Moon,
  LayoutGrid,
  Type,
  Columns2,
  CheckSquare,
  Zap,
  PlaySquare,
  CreditCard,
  BadgeCheck,
  Layers,
  Image,
  Users,
  GalleryHorizontal,
  Table2
} from 'lucide-react';
import SmartButtonDemo from './components/demos/smart-button-demo';
import TextDemo from './components/demos/text-demo';
import SplitButtonDemo from './components/demos/split-button-demo';
import StatusButtonDemo from './components/demos/status-button-demo';
import SpeedDialDemo from './components/demos/speed-dial-demo';
import SmartCardDemo from './components/demos/smart-card-demo';
import IconCardDemo from './components/demos/icon-card-demo';
import PaperDemo from './components/demos/paper-demo';
import VisualDemo from './components/demos/visual-demo';
import OverlapStackDemo from './components/demos/overlap-stack-demo';
import PeekDotsDemo from './components/demos/peek-dots-demo';
import DataTableDemo from './components/demos/data-table-demo';
import PaginatorDemo from './components/demos/paginator-demo';
import EnhancedTabsDemo from './components/demos/enhanced-tabs-demo';
import OverflowListDemo from './components/demos/overflow-list-demo';
import RenderIfDemo from './components/demos/render-if-demo';
import InfiniteScrollerDemo from './components/demos/infinite-scroller-demo';
import CommandSearchDemo from './components/demos/command-search-demo';
import DialogManagerDemo from './components/demos/dialog-manager-demo';
import DialogCompoundDemo from './components/demos/dialog-compound-demo';
import SidebarManagerDemo from './components/demos/sidebar-manager-demo';
import DescriptorDemo from './components/demos/descriptor-demo';
import SmartPopoverDemo from './components/demos/smart-popover-demo';
import CustomPopoverDemo from './components/demos/custom-popover-demo';
import RevealDemo from './components/demos/reveal-demo';
import FeedRendererDemo from './components/demos/feed-renderer-demo';
import NotificationBuilderDemo from './components/demos/notification-builder-demo';
import ActionsToolboxDemo from './components/demos/actions-toolbox-demo';
// import ConfigFormDemo from './components/demos/config-form-demo';
import { SidebarHost } from './components/ui/sidebar-manager/sidebar-host';

type ComponentId =
  | 'smart-button'
  | 'text'
  | 'split-button'
  | 'status-button'
  | 'speed-dial'
  | 'smart-card'
  | 'icon-card'
  | 'paper'
  | 'visual'
  | 'overlap-stack'
  | 'peek-dots'
  | 'data-table'
  | 'paginator'
  | 'enhanced-tabs'
  | 'overflow-list'
  | 'render-if'
  | 'infinite-scroller'
  | 'command-search'
  | 'dialog-manager'
  | 'dialog-compound'
  | 'sidebar-manager'
  | 'descriptor'
  | 'smart-popover'
  | 'custom-popover'
  | 'reveal'
  | 'feed-renderer'
  | 'notification-builder'
  | 'actions-toolbox';
  // | 'config-form';



interface RegistryComponent {
  id: ComponentId;
  name: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  demo: React.ComponentType;
}

const COMPONENTS: RegistryComponent[] = [
  {
    id: 'smart-button',
    name: 'Smart Button',
    category: 'Buttons & Actions',
    icon: PlaySquare,
    demo: SmartButtonDemo,
  },
  {
    id: 'split-button',
    name: 'Split Button',
    category: 'Buttons & Actions',
    icon: Columns2,
    demo: SplitButtonDemo,
  },
  {
    id: 'status-button',
    name: 'Status Button',
    category: 'Buttons & Actions',
    icon: CheckSquare,
    demo: StatusButtonDemo,
  },
  {
    id: 'speed-dial',
    name: 'Speed Dial',
    category: 'Buttons & Actions',
    icon: Zap,
    demo: SpeedDialDemo,
  },
  {
    id: 'smart-card',
    name: 'Smart Card',
    category: 'Surfaces & Cards',
    icon: CreditCard,
    demo: SmartCardDemo,
  },
  {
    id: 'icon-card',
    name: 'Icon Card',
    category: 'Surfaces & Cards',
    icon: BadgeCheck,
    demo: IconCardDemo,
  },
  {
    id: 'paper',
    name: 'Paper Surface',
    category: 'Surfaces & Cards',
    icon: Layers,
    demo: PaperDemo,
  },
  {
    id: 'visual',
    name: 'Visual Frame',
    category: 'Media & Overlays',
    icon: Image,
    demo: VisualDemo,
  },
  {
    id: 'overlap-stack',
    name: 'Overlap Stack',
    category: 'Media & Overlays',
    icon: Users,
    demo: OverlapStackDemo,
  },
  {
    id: 'peek-dots',
    name: 'Peek Dots Carousel',
    category: 'Media & Overlays',
    icon: GalleryHorizontal,
    demo: PeekDotsDemo,
  },
  {
    id: 'data-table',
    name: 'Data Table',
    category: 'Data & Tables',
    icon: Table2,
    demo: DataTableDemo,
  },
  {
    id: 'paginator',
    name: 'Paginator',
    category: 'Data & Tables',
    icon: LayoutGrid,
    demo: PaginatorDemo,
  },
  {
    id: 'enhanced-tabs',
    name: 'Enhanced Tabs',
    category: 'Basic Primitives',
    icon: LayoutGrid,
    demo: EnhancedTabsDemo,
  },
  {
    id: 'overflow-list',
    name: 'Overflow List',
    category: 'Basic Primitives',
    icon: LayoutGrid,
    demo: OverflowListDemo,
  },
  {
    id: 'render-if',
    name: 'RenderIf State',
    category: 'Basic Primitives',
    icon: LayoutGrid,
    demo: RenderIfDemo,
  },
  {
    id: 'infinite-scroller',
    name: 'Infinite Scroller',
    category: 'Basic Primitives',
    icon: LayoutGrid,
    demo: InfiniteScrollerDemo,
  },
  {
    id: 'command-search',
    name: 'Command Search',
    category: 'Basic Primitives',
    icon: LayoutGrid,
    demo: CommandSearchDemo,
  },
  {
    id: 'dialog-manager',
    name: 'Dialog Manager',
    category: 'Basic Primitives',
    icon: LayoutGrid,
    demo: DialogManagerDemo,
  },
  {
    id: 'dialog-compound',
    name: 'Dialog Compound Layout',
    category: 'Basic Primitives',
    icon: LayoutGrid,
    demo: DialogCompoundDemo,
  },
  {
    id: 'sidebar-manager',
    name: 'Sidebar Manager',
    category: 'Basic Primitives',
    icon: LayoutGrid,
    demo: SidebarManagerDemo,
  },
  {
    id: 'descriptor',
    name: 'Descriptor Layouts',
    category: 'Basic Primitives',
    icon: LayoutGrid,
    demo: DescriptorDemo,
  },
  {
    id: 'smart-popover',
    name: 'Smart Popover',
    category: 'Basic Primitives',
    icon: LayoutGrid,
    demo: SmartPopoverDemo,
  },
  {
    id: 'custom-popover',
    name: 'Custom Popover',
    category: 'Basic Primitives',
    icon: LayoutGrid,
    demo: CustomPopoverDemo,
  },
  {
    id: 'reveal',
    name: 'Reveal Control',
    category: 'Basic Primitives',
    icon: LayoutGrid,
    demo: RevealDemo,
  },
  {
    id: 'text',


    name: 'Typography',
    category: 'Basic Primitives',
    icon: Type,
    demo: TextDemo,
  },
  {
    id: 'feed-renderer',
    name: 'Feed Renderer',
    category: 'Media & Overlays',
    icon: LayoutGrid,
    demo: FeedRendererDemo,
  },
  {
    id: 'notification-builder',
    name: 'Notification Builder',
    category: 'Media & Overlays',
    icon: LayoutGrid,
    demo: NotificationBuilderDemo,
  },
  {
    id: 'actions-toolbox',
    name: 'Actions & Toolbox',
    category: 'Buttons & Actions',
    icon: LayoutGrid,
    demo: ActionsToolboxDemo,
  },
  // {
  //   id: 'config-form',
  //   name: 'Config Form Adapter',
  //   category: 'Data & Tables',
  //   icon: LayoutGrid,
  //   demo: ConfigFormDemo,
  // },
];

function App() {
  const [activeComponent, setActiveComponent] = useState<ComponentId>('smart-button');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') || 
             localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const activeComp = COMPONENTS.find(c => c.id === activeComponent) || COMPONENTS[0];
  const DemoComponent = activeComp.demo;

  return (
    <div className="flex h-screen bg-background text-foreground transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col">
        {/* Header */}
        <div className="h-16 flex items-center px-6 border-b border-border gap-2">
          <LayoutGrid className="size-5 text-primary" />
          <span className="font-bold text-lg tracking-tight">Timeax Registry</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
            <span className="px-3 text-xs font-bold text-muted-foreground tracking-wider uppercase block mb-3">
              Components Playground
            </span>
            <div className="space-y-1">
              {COMPONENTS.map((comp) => {
                const Icon = comp.icon;
                return (
                  <button
                    key={comp.id}
                    onClick={() => setActiveComponent(comp.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 hover:cursor-pointer ${
                      activeComponent === comp.id
                        ? 'bg-primary text-primary-foreground shadow-xs'
                        : 'hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    <Icon className="size-4 shrink-0" />
                    <span>{comp.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Footer Toggle */}
        <div className="p-4 border-t border-border flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">Theme Mode</span>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:cursor-pointer"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
        </div>
      </aside>

      {/* Main Canvas */}
      <main className="flex-1 flex flex-col overflow-hidden bg-zinc-50 dark:bg-zinc-950/20">
        {/* Canvas Header */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-8">
          <div>
            <h1 className="text-lg font-semibold tracking-tight m-0">{activeComp.name}</h1>
            <p className="text-xs text-muted-foreground">{activeComp.category}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400 ring-1 ring-inset ring-emerald-600/10 dark:ring-emerald-500/20">
              Interactive Preview
            </span>
          </div>
        </header>

        {/* Preview Viewport */}
        <div className="flex-1 overflow-y-auto bg-background/50 backdrop-blur-sm">
          <DemoComponent />
        </div>
      </main>
      <SidebarHost />
    </div>
  );
}

export default App;
