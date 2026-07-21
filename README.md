# Timeax UI — Custom shadcn Registry

A curated library of **production-grade, shadcn-compatible React components** extracted and modernized from a large-scale admin platform. Every component is reusable, typed, accessible, dark-mode aware, and installable through the [shadcn CLI](https://ui.shadcn.com/docs/cli).

---

## Table of Contents

1. [Installation](#installation)
2. [Components](#components)
   - [Button Family](#1-button-family)
     - [Button (SmartButton)](#button-smartbutton)
     - [SplitButton](#splitbutton)
     - [StatusButton](#statusbutton)
     - [SpeedDial](#speeddial)
     - [Reveal](#reveal)
   - [Card Family](#2-card-family)
     - [Card](#card)
     - [SmartCard](#smartcard)
     - [IconCard](#iconcard)
     - [Paper](#paper)
   - [Data Display](#3-data-display)
     - [DataTable / Table](#datatable--table)
     - [DateText](#datetext)
     - [Descriptor](#descriptor)
     - [Text](#text)
   - [Overlay & Dialog](#4-overlay--dialog)
     - [DialogManager](#dialogmanager)
     - [HeadlessResponsiveDialog](#headlessresponsivedialog)
     - [SidebarManager](#sidebarmanager)
     - [SmartPopover](#smartpopover)
   - [Navigation & Layout](#5-navigation--layout)
     - [EnhancedTabs](#enhancedtabs)
     - [OverflowList](#overflowlist)
     - [Paginator](#paginator)
     - [CommandSearch](#commandsearch)
   - [Media & Visual](#6-media--visual)
     - [Visual](#visual)
     - [OverlapStack](#overlapstack)
     - [PeekDots](#peekdots)
   - [State & Async](#7-state--async)
     - [RenderIf](#renderif)
     - [Empty](#empty)
     - [InfiniteScroller](#infinitescroller)
     - [Skeleton](#skeleton)
   - [Actions & Toolbox](#8-actions--toolbox)
     - [Actions](#actions)
     - [Toolbox](#toolbox)
     - [BulkToolbar](#bulktoolbar)
   - [Forms & Input](#9-forms--input)
     - [ConfigForm](#configform)
   - [Notifications](#10-notifications)
     - [FeedRenderer](#feedrenderer)
     - [NotificationBuilder](#notificationbuilder)
   - [Primitives & Utilities](#11-primitives--utilities)
     - [ScrollArea](#scrollarea)
     - [Hooks (use-mobile)](#hooks-use-mobile)

---

## Installation

### Using the shadcn CLI (recommended)

Point the CLI at this repository as your custom registry:

```bash
# Install a single component
npx shadcn@latest add timeax/ui/<component-name>

# Example — install smart-button
npx shadcn@latest add timeax/ui/smart-button
```

### Manual Installation

Copy any component folder from `registry/new-york/<component-name>/` into your project's `components/ui/` directory and ensure all listed `dependencies` and `registryDependencies` are installed.

### Prerequisites

All components target:
- **React 18+** with TypeScript
- **Tailwind CSS v4** with the standard shadcn CSS variable convention
- **`cn()` utility** from `@/lib/utils` (ships with every shadcn installation)

---

## Components

---

### 1. Button Family

#### Button (SmartButton)

A fully polymorphic, tone-aware button with built-in loading states, icon placement, and `as`-prop rendering for any HTML element or custom component.

**Install:**
```bash
npx shadcn@latest add timeax/ui/smart-button
```

**Dependencies:** `lucide-react`, `class-variance-authority`

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tone` | `'primary' \| 'success' \| 'info' \| 'warning' \| 'danger' \| 'theme' \| 'white' \| 'grey' \| 'secondary' \| 'neutral'` | `'primary'` | Color semantic of the button |
| `emphasis` | `'solid' \| 'soft' \| 'outline' \| 'ghost' \| 'link'` | `'solid'` | Visual weight / fill style |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| '3xl' \| 'icon-sm' \| 'icon-md' \| 'icon-lg' \| 'icon-xl' \| 'icon-2xl' \| 'icon-3xl' \| 'icon'` | `'md'` | Size preset (`icon-*` produces a square button) |
| `rounding` | `'md' \| 'full' \| 'none'` | `'md'` | Border-radius preset |
| `roundBy` | `number \| string` | — | Explicit custom border-radius in px or any CSS value |
| `icon` | `ReactNode` | — | Icon rendered beside the label |
| `iconPosition` | `'left' \| 'right'` | `'left'` | Which side of the label the icon appears on |
| `iconSize` | `number \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| '3xl'` | — | Override icon wrapper size |
| `iconGap` | `number \| string` | — | Custom gap between icon and label (px or CSS value) |
| `loading` | `boolean` | `false` | Shows a spinning `Loader2` overlay and sets `aria-busy` |
| `as` | `ElementType` | `'button'` | Render as any element (e.g. `'a'`, `Link`) |
| `disabled` | `boolean` | — | Disables the button; non-button elements use `data-disabled` |
| `contentClassName` | `string` | — | Class for the inner label `<span>` |
| `className` | `string` | — | Class on the root element |

**Usage:**

```tsx
import { Button } from '@/components/ui/smart-button';
import { Save, Trash2, MoreHorizontal } from 'lucide-react';

// Solid primary
<Button tone="primary" emphasis="solid">Save changes</Button>

// Soft danger with icon
<Button tone="danger" emphasis="soft" icon={<Trash2 />}>Delete</Button>

// Loading state
<Button tone="success" loading>Saving…</Button>

// Ghost icon-only button
<Button tone="theme" emphasis="ghost" size="icon" icon={<MoreHorizontal />} />

// Render as anchor
<Button as="a" href="/docs" tone="primary" emphasis="link">Read the docs</Button>
```

---

#### SplitButton

A compound button that pairs a primary action with a dropdown caret exposing secondary actions. Built on top of Radix UI's Dropdown Menu.

**Install:**
```bash
npx shadcn@latest add timeax/ui/split-button
```

**Dependencies:** `@radix-ui/react-dropdown-menu`, `lucide-react`

**Props:** Extends `ButtonProps` (all `Button` props apply to the main segment).

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `SplitButtonItem[]` | — | Dropdown action items |
| `dropdownClassName` | `string` | — | Class for the dropdown content |
| `caretClassName` | `string` | — | Class for the caret trigger segment |
| `align` | `'start' \| 'center' \| 'end'` | `'end'` | Dropdown content alignment |

**`SplitButtonItem`:**

| Field | Type | Description |
|-------|------|-------------|
| `label` | `ReactNode` | Item label |
| `icon` | `ReactNode` | Optional icon |
| `onClick` | `() => void` | Click handler |
| `href` | `string` | Render as anchor instead |
| `disabled` | `boolean` | Disable the item |
| `separator` | `boolean` | Render a separator above |
| `destructive` | `boolean` | Apply danger styling |

**Usage:**

```tsx
import { SplitButton } from '@/components/ui/split-button';
import { Download, Eye, Pencil, Trash2 } from 'lucide-react';

<SplitButton
  tone="primary"
  icon={<Download />}
  items={[
    { label: 'Preview', icon: <Eye />,    onClick: handlePreview },
    { label: 'Edit',    icon: <Pencil />, onClick: handleEdit },
    { separator: true },
    { label: 'Delete',  destructive: true, onClick: handleDelete },
  ]}
>
  Export
</SplitButton>
```

---

#### StatusButton

Maps a status string to a corresponding color, icon, and optional spin animation. Useful for displaying record states directly in tables.

**Install:**
```bash
npx shadcn@latest add timeax/ui/status-button
```

**Props:** Extends all `Button` props.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `status` | `string` | — | Status string (e.g. `"active"`, `"pending"`, `"failed"`) |
| `spin` | `boolean` | — | Spin the icon (useful for in-progress states) |

**Built-in status mappings:**

| Status keyword | Tone | Icon |
|---|---|---|
| `active`, `completed`, `approved`, `verified`, `paid` | `success` | `CheckCircle` |
| `pending`, `processing`, `running`, `scheduled` | `warning` | `Clock` / `Loader` |
| `failed`, `rejected`, `cancelled`, `error`, `blocked` | `danger` | `XCircle` |
| `draft`, `inactive`, `paused`, `archived` | `neutral` | `MinusCircle` |

**Usage:**

```tsx
import { StatusButton } from '@/components/ui/status-button';

<StatusButton status="completed" size="sm" />
<StatusButton status="pending" spin size="sm">In progress</StatusButton>
<StatusButton status={order.status} size="sm">{order.status}</StatusButton>
```

---

#### SpeedDial

A floating action button menu that fans out stagger-animated child actions, supporting both linear and radial layouts. Powered by Framer Motion.

**Install:**
```bash
npx shadcn@latest add timeax/ui/speed-dial
```

**Dependencies:** `framer-motion`, `lucide-react`

**`SpeedDialProps`:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | — | Controlled open state |
| `defaultOpen` | `boolean` | `false` | Initial open state (uncontrolled) |
| `onOpenChange` | `(open: boolean) => void` | — | Open state change handler |
| `trigger` | `ReactNode` | — | Custom trigger element (defaults to `+` button) |
| `openOnHover` | `boolean` | `false` | Open on mouse enter instead of click |
| `closeOnAction` | `boolean` | `true` | Close when an action is selected |
| `closeOnOutside` | `boolean` | `true` | Close on outside click |
| `escToClose` | `boolean` | `true` | Close on Escape key |
| `placement` | `'br' \| 'bl' \| 'tr' \| 'tl' \| 'center'` | `'br'` | Fixed screen placement |
| `offset` | `number` | — | Margin from the placement corner |
| `portal` | `boolean` | `true` | Render actions through a portal |
| `backdrop` | `boolean` | `false` | Show a semi-transparent page backdrop |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Trigger button size |
| `layout` | `'radial' \| 'linear'` | `'radial'` | Fan-out geometry |
| `direction` | `'up' \| 'down' \| 'left' \| 'right'` | `'up'` | Linear layout direction |
| `spacing` | `number` | `56` | Linear item spacing in px |
| `radius` | `number` | `96` | Radial orbit radius in px |
| `angleStart` | `number` | `225` | Radial start angle in degrees |
| `angleSweep` | `number` | `90` | Radial sweep angle in degrees |
| `staggerMs` | `number` | `35` | Stagger delay between items in ms |
| `className` | `string` | — | Class on the wrapper |
| `children` | `ReactNode` | — | `<SpeedDialAction>` elements |

**`SpeedDialActionProps`:**

| Prop | Type | Description |
|------|------|-------------|
| `icon` | `ReactNode` | Action icon (required) |
| `label` | `ReactNode` | Tooltip label |
| `onClick` | `() => void` | Click handler |
| `href` | `string` | Render as anchor |
| `disabled` | `boolean` | Disable the action |
| `tooltip` | `string` | Tooltip text override |
| `className` | `string` | Extra class |

**Usage:**

```tsx
import { SpeedDial, SpeedDialAction } from '@/components/ui/speed-dial';
import { Pencil, Share, Star, Trash2 } from 'lucide-react';

// Radial layout (default)
<SpeedDial placement="br" layout="radial">
  <SpeedDialAction icon={<Pencil />} label="Edit"     onClick={handleEdit} />
  <SpeedDialAction icon={<Share />}  label="Share"    onClick={handleShare} />
  <SpeedDialAction icon={<Star />}   label="Favourite" onClick={handleFav} />
  <SpeedDialAction icon={<Trash2 />} label="Delete"   onClick={handleDelete} />
</SpeedDial>

// Linear — fan up
<SpeedDial layout="linear" direction="up" placement="br">
  <SpeedDialAction icon={<Pencil />} label="Edit"  onClick={handleEdit} />
  <SpeedDialAction icon={<Share />}  label="Share" onClick={handleShare} />
</SpeedDial>
```

---

#### Reveal

A responsive disclosure container that collapses toolbar controls (e.g. search inputs, filters) behind an icon-trigger at configurable breakpoints.

**Install:**
```bash
npx shadcn@latest add timeax/ui/reveal
```

**`RevealProps`:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | Controls to show / hide |
| `icon` | `ReactNode` | `<Search />` | Custom trigger icon |
| `collapseAt` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| number` | — | Breakpoint below which children collapse |
| `open` | `boolean` | — | Controlled open state |
| `defaultOpen` | `boolean` | `false` | Initial state (uncontrolled) |
| `onOpenChange` | `(open: boolean) => void` | — | State change callback |
| `variant` | `'relative' \| 'absolute'` | `'relative'` | Slide-in strategy |
| `side` | `'left' \| 'right'` | `'right'` | Which side content expands from |
| `width` | `number \| string` | `'20rem'` | Max expanded width |
| `closeOnOutsideClick` | `boolean` | `true` | Auto-close on outside click |
| `closeOnEscape` | `boolean` | `true` | Auto-close on Escape |
| `keepOpenWhenExpanded` | `boolean` | `true` | Stays open on desktop |
| `disabled` | `boolean` | `false` | Disable the toggle button |
| `title` | `string` | `'Toggle'` | `aria-label` / `title` for the toggle button |

**Usage:**

```tsx
import { Reveal } from '@/components/ui/reveal';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

// Search bar that collapses below md breakpoint
<div className="flex items-center gap-2">
  <Reveal collapseAt="md" icon={<Search className="h-4 w-4" />}>
    <Input placeholder="Search…" className="w-56" />
  </Reveal>
  <Button>New Record</Button>
</div>
```

---

### 2. Card Family

#### Card

Standard shadcn card primitive exposing semantic layout parts: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, `CardFooter`.

**Install:** Ships as a base shadcn dependency — use the shadcn `card` primitive.

**Usage:**

```tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Revenue</CardTitle>
  </CardHeader>
  <CardContent>$42,000</CardContent>
</Card>
```

---

#### SmartCard

A compound container supporting multiple surface variants, nested inner/outer levels, spacing densities, header borders, and mapped link actions.

**Install:**
```bash
npx shadcn@latest add timeax/ui/smart-card
```

**`SmartCardProps`:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'solid' \| 'soft' \| 'outlined' \| 'ghost' \| 'soft-outline' \| 'soft-solid'` | `'solid'` | Surface style |
| `level` | `'outer' \| 'inner'` | `'outer'` | Nesting depth — inner uses a muted background |
| `density` | `'compact' \| 'default' \| 'loose'` | `'default'` | Padding density |
| `header` | `ReactNode` | — | Custom header content (renders above title) |
| `title` | `ReactNode` | — | Card title |
| `description` | `ReactNode` | — | Card description beneath the title |
| `footer` | `ReactNode` | — | Footer content |
| `headerBorder` | `boolean` | `false` | Add a border between header and content |
| `actions` | `LinkAction \| LinkAction[] \| ReactNode` | — | Header action links |
| `actionText` | `ReactNode` | — | Single action text shorthand |
| `actionHref` | `string` | — | Single action href shorthand |
| `actionTarget` | `string` | — | Link target for shorthand action |
| `contentClassName` | `string` | — | Class on the content region |

**Usage:**

```tsx
import { SmartCard } from '@/components/ui/smart-card';

<SmartCard
  variant="soft-outline"
  title="Monthly Revenue"
  description="Compared to last month"
  density="compact"
  actionText="View all"
  actionHref="/reports"
>
  <p className="text-3xl font-bold">$42,000</p>
</SmartCard>
```

---

#### IconCard

A promotional layout where a circular badge or icon element overlaps the top boundary of the card by exactly half its height.

**Install:**
```bash
npx shadcn@latest add timeax/ui/icon-card
```

**`IconCardProps`:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `ReactNode` | — | Icon or badge to show (inside the circular overlap) |
| `iconSize` | `number \| string` | `64` | Width/height of the overlap badge |
| `iconClassName` | `string` | — | Extra class on the overlap badge |
| `title` | `ReactNode` | — | Card title |
| `description` | `ReactNode` | — | Card subtitle |
| `footer` | `ReactNode` | — | Footer region |
| `contentClassName` | `string` | — | Class on the body region |
| `className` | `string` | — | Class on the root element |

**Usage:**

```tsx
import { IconCard } from '@/components/ui/icon-card';
import { ShieldCheck } from 'lucide-react';

<IconCard
  icon={<ShieldCheck className="h-8 w-8 text-success" />}
  title="Security Score"
  description="Your account is well protected"
>
  <p className="text-2xl font-bold text-success">98 / 100</p>
</IconCard>
```

---

#### Paper

A simpler flat surface container supporting surface variations, outer/inner levels, padding densities, and optional backdrop blur.

**Install:**
```bash
npx shadcn@latest add timeax/ui/paper
```

**`PaperProps`:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'solid' \| 'outline' \| 'ghost'` | `'solid'` | Surface style |
| `level` | `'outer' \| 'inner'` | `'outer'` | Nesting depth |
| `density` | `'compact' \| 'default' \| 'loose'` | `'default'` | Padding preset |
| `blur` | `boolean` | `false` | Apply `backdrop-blur` |
| `className` | `string` | — | Extra CSS class |
| `children` | `ReactNode` | — | Content |

**Usage:**

```tsx
import { Paper } from '@/components/ui/paper';

<Paper variant="outline" density="compact" level="inner">
  <p>Settings panel content</p>
</Paper>
```

---

### 3. Data Display

#### DataTable / Table

A full-featured data grid with declarative column definitions, sticky frozen columns, sorting, global text filtering, column visibility, row selection, row expansion, server-side pagination, and virtual scroll support.

**Install:**
```bash
npx shadcn@latest add timeax/ui/data-table
```

**Dependencies:** `lucide-react`
**Registry dependencies:** `table`, `scroll-area`, `checkbox`, `button`, `dropdown-menu`, `status-button`, `text`, `date-text`, `paginator`

**`TableProps<T>`:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `T[]` | — | Data array |
| `children` | `ReactNode` | — | `<Column>` definitions |
| `display` | `'spaced' \| 'normal' \| 'bordered' \| 'minimal' \| 'glass'` | `'spaced'` | Row visual style |
| `density` | `'comfortable' \| 'compact' \| 0–16` | `'compact'` | Cell padding level |
| `rowGap` | `1–16` | — | Gap between spaced rows |
| `rowRadius` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| '3xl' \| 'full'` | — | Row border-radius |
| `striped` | `boolean` | `false` | Alternating row shading |
| `rowHover` | `boolean` | `true` | Highlight row on hover |
| `loading` | `boolean` | `false` | Show loading overlay |
| `emptyMessage` | `ReactNode` | `'No records found'` | Empty state content |
| `selectionMode` | `'none' \| 'single' \| 'multiple'` | `'none'` | Row selection mode |
| `selection` | `any[]` | — | Controlled selected rows |
| `onSelectionChange` | `(rows: any[]) => void` | — | Selection change callback |
| `selectOnRowClick` | `boolean` | `false` | Toggle selection on row click |
| `checkbox` | `true \| CellFn \| { header?, cell? }` | — | Checkbox column config |
| `paginator` | `boolean` | `false` | Enable built-in paginator |
| `rows` | `number` | `10` | Page size |
| `first` | `number` | `0` | First row offset |
| `rowsPerPageOptions` | `number[]` | — | Page size choices |
| `onPage` | `(e) => void` | — | Page change callback |
| `sortField` | `string` | — | Controlled sort field |
| `sortOrder` | `1 \| -1 \| 0` | — | Controlled sort order |
| `onSort` | `(e) => void` | — | Sort change callback |
| `globalFilter` | `string` | — | Global filter string |
| `lazy` | `boolean` | `false` | Server-side mode |
| `totalRecords` | `number` | — | Server total for paging |
| `onQueryChange` | `(q) => void` | — | Combined server query callback |
| `columnVisibility` | `Record<string, boolean>` | — | Controlled column visibility |
| `showColumnVisibility` | `boolean` | `false` | Show column picker button |
| `stickyHeader` | `boolean` | `false` | Sticky table header |
| `stickyHeaderOffset` | `number \| string` | — | Sticky header offset |
| `viewportHeight` | `string \| number` | — | Scrollable viewport height |
| `toolbar` | `ReactNode` | — | Toolbar rendered above the table |
| `footer` | `ReactNode` | — | Footer content below the table |
| `highlightColumns` | `string[]` | — | Column keys to highlight |
| `highlightRowKey` | `string \| number` | — | Row key to scroll to and highlight |
| `rowExpansionTemplate` | `(row, i) => ReactNode` | — | Expandable row content |
| `expandedRows` | `any[]` | — | Controlled expanded rows |
| `onRowToggle` | `(expanded: any[]) => void` | — | Expand toggle callback |
| `virtualScroll` | `boolean` | `false` | Enable virtual scroll |
| `rowHeight` | `number` | — | Fixed row height for virtual scroll |
| `onRowClick` | `(row, i) => void` | — | Row click callback |
| `onRowDoubleClick` | `(row) => void` | — | Row double-click callback |
| `onGoto` | `(row) => string` | — | Double-click URL generator |

**`ColumnProps<T>`:**

| Prop | Type | Description |
|------|------|-------------|
| `field` | `keyof T` | Data field path (supports dot notation) |
| `header` | `ReactNode \| fn` | Header content or render function |
| `body` | `ReactNode \| fn` | Cell content or render function |
| `footer` | `ReactNode \| fn` | Footer content |
| `sortable` | `boolean` | Enable column sorting |
| `filter` | `boolean` | Enable column filtering |
| `filterType` | `'text' \| 'number' \| 'date' \| 'enum'` | Filter input type |
| `filterMatchMode` | `MatchMode` | Filter comparison mode |
| `frozen` | `true \| 'left' \| 'right'` | Freeze column to left or right |
| `width` | `number \| string` | Column width |
| `align` | `'left' \| 'right' \| 'center'` | Cell text alignment |
| `status` | `boolean` | Auto-render as `StatusButton` |
| `date` | `ColumnDateFormat \| DateMask` | Auto-format as date |
| `hidden` | `boolean` | Hide column |
| `columnKey` | `string` | Unique key (required when `field` is absent) |

**Usage:**

```tsx
import { Table, Column } from '@/components/ui/data-table';
import { Button } from '@/components/ui/smart-button';
import { Trash2 } from 'lucide-react';

type User = { id: number; name: string; email: string; status: string; createdAt: string };

<Table<User>
  value={users}
  display="spaced"
  density="compact"
  selectionMode="multiple"
  paginator
  rows={20}
  stickyHeader
  toolbar={<Input placeholder="Search…" />}
>
  <Column field="name"      header="Name"    sortable />
  <Column field="email"     header="Email"   sortable />
  <Column field="status"    header="Status"  status />
  <Column field="createdAt" header="Created" date="dateMedium" />
  <Column
    header="Actions"
    body={(row) => (
      <Button
        size="icon-sm"
        tone="danger"
        emphasis="ghost"
        onClick={() => handleDelete(row)}
        icon={<Trash2 />}
      />
    )}
  />
</Table>
```

---

#### DateText

A standalone date formatting component with named presets built on `Intl.DateTimeFormat`.

**Install:**
```bash
npx shadcn@latest add timeax/ui/date-text
```

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `value` | `string \| Date \| number` | Date to format |
| `format` | `ColumnDateFormat \| DateMask` | Named preset or custom mask |
| `locale` | `string` | BCP 47 locale (defaults to browser locale) |
| `className` | `string` | Extra class |

**Named presets:** `dateMedium`, `dateLong`, `dateShort`, `dateTime`, `isoDateTime`, `timeOnly`, `relative`

**Usage:**

```tsx
import { DateText } from '@/components/ui/date-text';

<DateText value={user.createdAt} format="dateMedium" />
// Output: "Jul 20, 2026"

<DateText value={order.createdAt} format="dateTime" />
// Output: "Jul 20, 2026, 11:45 PM"
```

---

#### Descriptor

A structured key-value metadata row supporting both a property-based API and a compound sub-component API.

**Install:**
```bash
npx shadcn@latest add timeax/ui/descriptor
```

**`DescriptorProps`:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `ReactNode` | — | Key / label text |
| `value` | `ReactNode` | — | Value |
| `layout` | `'horizontal' \| 'vertical'` | `'horizontal'` | Label-value stacking direction |
| `spacing` | `'compact' \| 'cozy' \| 'spacious'` | `'cozy'` | Row gap |
| `divider` | `'top' \| 'bottom' \| 'both' \| 'around' \| 'none'` | `'none'` | Divider visibility |
| `leading` | `ReactNode` | — | Icon or avatar before the label |
| `trailing` | `ReactNode` | — | Content after the value |

**Compound sub-components:** `Descriptor`, `DescriptorLeading`, `DescriptorBody`, `DescriptorTitle`, `DescriptorDescription`, `DescriptorTrailing`

**Usage:**

```tsx
import { Descriptor, DescriptorLeading, DescriptorBody, DescriptorTitle, DescriptorDescription, DescriptorTrailing } from '@/components/ui/descriptor';

// Property API
<Descriptor label="Email" value={user.email} divider="bottom" />

// Compound API
<Descriptor spacing="cozy" divider="bottom">
  <DescriptorLeading><Avatar src={user.avatar} /></DescriptorLeading>
  <DescriptorBody>
    <DescriptorTitle>{user.name}</DescriptorTitle>
    <DescriptorDescription>{user.email}</DescriptorDescription>
  </DescriptorBody>
  <DescriptorTrailing>
    <StatusButton status={user.status} size="sm" />
  </DescriptorTrailing>
</Descriptor>
```

---

#### Text

A polymorphic typography component with pre-defined variants, weight and size overrides, inline icon support, link handling, and number/currency formatting.

**Install:**
```bash
npx shadcn@latest add timeax/ui/text
```

**`TextBaseProps`:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'banner' \| 'title' \| 'subtitle' \| 'heading' \| 'subheading' \| 'lead' \| 'large' \| 'body' \| 'small' \| 'caption' \| 'muted' \| 'code'` | `'body'` | Typography style |
| `as` | `ElementType` | Inferred from variant | Override the rendered element |
| `asChild` | `boolean` | — | Use Radix Slot for composition |
| `size` | `string \| number` | — | Custom `font-size` override |
| `weight` | `string \| number` | — | Custom `font-weight` override |
| `italic` | `boolean` | — | Italic text |
| `upper` | `boolean` | — | `text-transform: uppercase` |
| `capitalise` | `boolean` | — | `text-transform: capitalize` |
| `center` | `boolean` | — | `text-align: center` |
| `color` | `string` | — | CSS color value |
| `href` | `string` | — | Render as anchor with this href |
| `link` | `string` | — | Alias for `href` |
| `icon` | `ReactNode` | — | Inline icon |
| `iconPos` | `'left' \| 'right'` | `'left'` | Icon side |
| `gap` | `number` | — | Gap between icon and text in px |
| `currency` | `string` | — | ISO currency code for formatting |
| `format` | `Intl.NumberFormatOptions` | — | Number format options |
| `thousandSeparator` | `boolean \| string` | — | Add thousand separators |
| `prefix` | `string` | — | String prepended after formatting |
| `suffix` | `string` | — | String appended after formatting |
| `noSelect` | `boolean` | — | `user-select: none` |

**Usage:**

```tsx
import { Text } from '@/components/ui/text';
import { User } from 'lucide-react';

<Text variant="heading">Dashboard</Text>
<Text variant="muted">Last updated 5 minutes ago</Text>

// Currency formatting
<Text variant="large" currency="USD">{42000}</Text>
// Output: $42,000.00

// Inline icon with link
<Text variant="small" href="/profile" icon={<User className="h-3.5 w-3.5" />}>
  View profile
</Text>
```

---

### 4. Overlay & Dialog

#### DialogManager

A centralized, promise-aware dialog registry enabling programmatic dialog control from anywhere in the component tree without prop drilling.

**Install:**
```bash
npx shadcn@latest add timeax/ui/dialog-manager
```

**Registry dependencies:** `dialog`, `alert-dialog`, `button`, `headless-responsive-dialog`

**Setup:**

```tsx
// app/layout.tsx (or your root provider)
import { DialogProvider } from '@/components/ui/dialog-manager';

<DialogProvider>
  <App />
</DialogProvider>
```

**Creating a dialog:**

```tsx
import { createDialog, DialogWrapper, DialogHeader, DialogContent, DialogFooter } from '@/components/ui/dialog-manager';
import { Button } from '@/components/ui/smart-button';

const MyDialog = createDialog<{ userId: string }, { saved: boolean }>(
  function MyDialog({ userId, onClose }) {
    return (
      <DialogWrapper>
        <DialogHeader />
        <DialogContent>
          <p>Editing user {userId}</p>
        </DialogContent>
        <DialogFooter>
          <Button onClick={() => onClose?.({ resolved: true, data: { saved: true } })}>
            Save
          </Button>
        </DialogFooter>
      </DialogWrapper>
    );
  },
  { id: 'my-dialog', title: 'Edit User' }
);
```

**Using the dialog hook:**

```tsx
import { useDialog } from '@/components/ui/dialog-manager';

function MyButton() {
  const dialog = useDialog();

  const handleOpen = async () => {
    const result = await dialog.open(MyDialog, { userId: '123' });
    if (result?.saved) console.log('Saved!');
  };

  const handleTrigger = dialog.trigger(MyDialog, { userId: '456' });

  return (
    <>
      <Button onClick={handleOpen}>Open (async)</Button>
      <Button onClick={handleTrigger}>Open (trigger)</Button>
    </>
  );
}
```

**`useDialog()` methods:**

| Method | Signature | Description |
|--------|-----------|-------------|
| `open` | `(idOrComp, props?, uid?) => Promise<TResult>` | Open and await result |
| `update` | `(idOrComp, props, uid?) => void` | Update props of an open dialog |
| `hide` | `(idOrComp, uid?) => void` | Close without resolving |
| `close` | `(idOrComp, uid?) => void` | Alias for `hide` |
| `confirm` | `(content?, accept?, reject?) => Promise<boolean>` | Built-in confirm dialog |
| `del` | `(content?, accept?, reject?) => Promise<boolean>` | Built-in delete confirm dialog |
| `trigger` | `(idOrComp, props?, uid?, opts?) => EventHandler` | Returns a click event handler |
| `loader` | `(show: boolean) => void` | Show/hide global loader |
| `error` | `(content, opts?) => void` | Show error dialog |

**Compound layout components:** `DialogWrapper`, `DialogHeader`, `DialogTitle`, `DialogClose`, `DialogContent`, `DialogFooter`

---

#### HeadlessResponsiveDialog

An adaptive dialog primitive that renders as a centered modal on desktop and a bottom sheet on mobile.

**Install:**
```bash
npx shadcn@latest add timeax/ui/headless-responsive-dialog
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | — | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | — | Open state callback |
| `title` | `ReactNode` | — | Dialog title |
| `description` | `ReactNode` | — | Description below the title |
| `className` | `string` | — | Class on the content panel |
| `children` | `ReactNode` | — | Dialog content |

**Usage:**

```tsx
import { HeadlessResponsiveDialog } from '@/components/ui/headless-responsive-dialog';

<HeadlessResponsiveDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Confirm action"
>
  <p>Are you sure?</p>
  <Button onClick={() => setIsOpen(false)}>Cancel</Button>
</HeadlessResponsiveDialog>
```

---

#### SidebarManager

A centralized, promise-aware registry for programmatic sliding detail sheets (drawers), mirroring the DialogManager API for a panel-based UX.

**Install:**
```bash
npx shadcn@latest add timeax/ui/sidebar-manager
```

**Registry dependencies:** `sheet`, `scroll-area`

**Setup:**

```tsx
import { SidebarProvider, SidebarHost } from '@/components/ui/sidebar-manager';

<SidebarProvider>
  <App />
  <SidebarHost sidebars={[UserDetailSidebar, OrderSidebar]} />
</SidebarProvider>
```

**Creating a sidebar:**

```tsx
import { createSidebar, SidebarWrapper, SidebarHeader, SidebarTitle, SidebarClose, SidebarContent, SidebarFooter } from '@/components/ui/sidebar-manager';

const UserDetailSidebar = createSidebar<{ userId: string }>(
  function UserDetailSidebar({ userId }) {
    return (
      <SidebarWrapper>
        <SidebarHeader>
          <SidebarTitle />
          <SidebarClose />
        </SidebarHeader>
        <SidebarContent>
          <p>User ID: {userId}</p>
        </SidebarContent>
        <SidebarFooter>
          <Button>Save</Button>
        </SidebarFooter>
      </SidebarWrapper>
    );
  },
  { id: 'user-detail', title: 'User Details' }
);
```

**`SidebarAttachedProps`:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `ReactNode` | — | Sidebar title (auto-rendered in `SidebarTitle`) |
| `description` | `ReactNode` | — | Description text |
| `side` | `'left' \| 'right' \| 'top' \| 'bottom'` | `'right'` | Sheet slide-in side |
| `size` | `'sm' \| 'default' \| 'lg' \| 'xl' \| 'full' \| string \| number` | `'default'` | Sheet width |
| `promise` | `boolean` | — | Enable promise-based result |
| `onClose` | `(result?) => void` | — | Close callback |

**`useSidebar()` methods:** `open`, `update`, `hide`, `close`, `trigger`

---

#### SmartPopover

A lightweight composition wrapper around the shadcn `Popover` with trigger-width matching, viewport-safe heights, and render-prop close callback.

**Install:**
```bash
npx shadcn@latest add timeax/ui/smart-popover
```

**`SmartPopoverProps`:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | — | Controlled open state |
| `defaultOpen` | `boolean` | — | Initial state |
| `onOpenChange` | `(open: boolean) => void` | — | State change callback |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | — | Preferred side |
| `align` | `'start' \| 'center' \| 'end'` | — | Content alignment |
| `sideOffset` | `number` | `6` | Distance from trigger |
| `matchTriggerWidth` | `boolean` | — | Content min-width matches trigger |
| `label` | `ReactNode` | — | Built-in trigger button label |
| `button` | `ReactNode` | — | Built-in trigger button content (wins over `label`) |
| `icon` | `ReactNode` | — | Trigger button icon |
| `tone` | `Tone` | `'grey'` | Trigger button tone |
| `emphasis` | `Emphasis` | `'outline'` | Trigger button emphasis |
| `size` | `BtnSize` | `'md'` | Trigger button size |
| `children` | `ReactNode \| ({ close }) => ReactNode` | — | Popover content or render-prop |
| `contentClassName` | `string` | — | Class on the popover panel |
| `disabled` | `boolean` | — | Disable trigger |

**Usage:**

```tsx
import { SmartPopover } from '@/components/ui/smart-popover';
import { ChevronDown } from 'lucide-react';

// With render-prop close
<SmartPopover label="Options" icon={<ChevronDown />} matchTriggerWidth>
  {({ close }) => (
    <div className="p-2">
      <Button onClick={() => { doSomething(); close(); }}>Apply</Button>
    </div>
  )}
</SmartPopover>
```

---

### 5. Navigation & Layout

#### EnhancedTabs

A responsive tab list with overflow handling (scroll arrows or dropdown), asynchronous guard callbacks, lazy panel mounting, and controlled/uncontrolled operation.

**Install:**
```bash
npx shadcn@latest add timeax/ui/enhanced-tabs
```

**Registry dependencies:** `overflow-list`

**`TabsProps`:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tabs` | `(string \| TabDescriptor)[]` | — | Tab definitions |
| `value` | `string` | — | Controlled active tab |
| `defaultValue` | `string` | — | Initial tab (uncontrolled) |
| `onChange` | `(next: string) => void` | — | Active tab change callback |
| `onBeforeChange` | `GuardFn` | — | Global async guard `({ from, to }) => boolean \| Promise<boolean>` |
| `variant` | `'underline' \| 'block'` | `'underline'` | Visual style |
| `size` | `'xs' \| 'sm' \| 'md'` | `'md'` | Tab trigger size |
| `overflow` | `'scroll' \| 'dropdown' \| 'both'` | `'scroll'` | Overflow handling strategy |
| `scrollBehavior` | `'smooth' \| 'auto'` | `'smooth'` | List scroll behavior |
| `scrollStep` | `number \| 'half' \| 'page'` | `'half'` | Arrow button scroll increment |
| `moreLabel` | `ReactNode` | `'More'` | Dropdown trigger label |
| `children` | `ReactNode` | — | `<TabPanel>` elements |

**`TabDescriptor`:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique ID (auto-derived from `label` if omitted) |
| `label` | `string` | Tab display text |
| `disabled` | `boolean` | Disable the tab |
| `icon` | `ReactNode` | Icon beside the label |
| `renderLabel` | `(active) => ReactNode` | Custom label renderer |
| `onBeforeLeave` | `GuardFn` | Per-tab async leave guard |

**Usage:**

```tsx
import { Tabs, TabPanel } from '@/components/ui/enhanced-tabs';
import { Settings } from 'lucide-react';

<Tabs
  tabs={['Overview', 'Activity', { label: 'Settings', icon: <Settings /> }]}
  defaultValue="overview"
  onChange={setActiveTab}
  variant="underline"
  overflow="both"
>
  <TabPanel id="overview"><OverviewPanel /></TabPanel>
  <TabPanel id="activity"><ActivityPanel /></TabPanel>
  <TabPanel id="settings"><SettingsPanel /></TabPanel>
</Tabs>
```

---

#### OverflowList

A generic overflow measurement engine that dynamically slices a list into visible and hidden items based on available container width.

**Install:**
```bash
npx shadcn@latest add timeax/ui/overflow-list
```

**`OverflowListProps<T>`:**

| Prop | Type | Description |
|------|------|-------------|
| `items` | `T[]` | All items to render |
| `renderItem` | `(item: T, index: number) => ReactNode` | Visible item renderer |
| `renderOverflow` | `(overflowed: T[]) => ReactNode` | Overflow indicator renderer |
| `className` | `string` | Class on the container |

---

#### Paginator

A template-driven, zoned pagination component supporting page-number and index-based navigation with customizable slot ordering.

**Install:**
```bash
npx shadcn@latest add timeax/ui/paginator
```

**`PaginatorProps<T>`:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `T[]` | — | Data array to paginate |
| `rows` | `number` | `10` | Page size |
| `first` | `number` | `0` | First row index offset |
| `totalRecords` | `number` | — | Server-side total override |
| `mode` | `'index' \| 'page'` | `'page'` | Navigation unit |
| `rowsPerPageOptions` | `number[]` | — | Page size options |
| `onPage` | `(e) => void` | — | Page change callback |
| `template` | `string` | — | Slot order string (e.g. `'prev range next'`) |
| `leftZone` | `ReactNode` | — | Content in the left zone |
| `rightZone` | `ReactNode` | — | Content in the right zone |
| `className` | `string` | — | Class on the container |
| `children` | `(page: T[]) => ReactNode` | — | Render-prop receiving the current page slice |

**Usage:**

```tsx
import { Paginator } from '@/components/ui/paginator';

<Paginator
  value={users}
  rows={20}
  onPage={({ first, rows }) => fetchUsers({ offset: first, limit: rows })}
  template="prev range next sizes"
>
  {(pageUsers) => <UserList users={pageUsers} />}
</Paginator>
```

---

#### CommandSearch

A keyboard-triggered command palette dialog (`Cmd+K` / `Ctrl+K`) with configurable item lists and click callbacks.

**Install:**
```bash
npx shadcn@latest add timeax/ui/command-search
```

**Registry dependencies:** `command`, `dialog`

**`CommandSearchItem`:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique item ID |
| `label` | `string` | Display label |
| `description` | `string` | Optional description |
| `icon` | `ReactNode` | Optional icon |
| `group` | `string` | Group category header |
| `onSelect` | `() => void` | Selection callback |
| `keywords` | `string[]` | Extra search keywords |

**`CommandSearchProps`:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `CommandSearchItem[]` | — | Available commands |
| `placeholder` | `string` | `'Search commands…'` | Input placeholder |
| `shortcut` | `string[]` | `['meta+k', 'ctrl+k']` | Activation keys |
| `open` | `boolean` | — | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | — | Open state callback |
| `className` | `string` | — | Class on the dialog content |

**Usage:**

```tsx
import { CommandSearch } from '@/components/ui/command-search';

<CommandSearch
  items={[
    { id: 'dashboard', label: 'Dashboard', group: 'Navigation', onSelect: () => router.push('/') },
    { id: 'users',     label: 'Users',     group: 'Navigation', onSelect: () => router.push('/users') },
    { id: 'new-user',  label: 'New User',  group: 'Actions',    onSelect: openNewUserDialog },
  ]}
  placeholder="Search or jump to…"
/>
```

---

### 6. Media & Visual

#### Visual

A smart media-frame component that sniffs the `src` type (URL, SVG string, inline `<svg>`, Iconify key) and renders the appropriate element with loading, fallback, aspect-ratio, shape, shadow, and overlay support.

**Install:**
```bash
npx shadcn@latest add timeax/ui/visual
```

**`VisualProps`:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string \| ReactNode` | — | Resource URL, SVG string, inline node, or Iconify key (e.g. `ph:star`) |
| `alt` | `string` | — | Alt text for images |
| `decorative` | `boolean` | — | Mark as decorative (`aria-hidden`) |
| `aspectRatio` | `number \| string` | — | CSS aspect-ratio value |
| `fit` | `'cover' \| 'contain' \| 'fill' \| 'none' \| 'scale-down'` | `'cover'` | Object-fit for images |
| `shape` | `'square' \| 'circle' \| 'rounded'` | `'square'` | Border-radius preset |
| `rounding` | `string` | — | Custom border-radius (Tailwind class) |
| `shadow` | `boolean \| string` | — | Apply box-shadow |
| `size` | `number \| string` | — | Fixed size (width and height) |
| `width` | `number \| string` | — | Width override |
| `height` | `number \| string` | — | Height override |
| `overlay` | `ReactNode` | — | Content rendered on top of the visual |
| `fallback` | `ReactNode` | — | Shown on error or missing src |
| `loading` | `boolean` | — | Force loading state |
| `className` | `string` | — | Class on the container |
| `iconClassName` | `string` | — | Class on SVG/icon elements |

**Usage:**

```tsx
import { Visual } from '@/components/ui/visual';

// Image with circle shape
<Visual src={user.avatar} alt={user.name} shape="circle" size={48} />

// Iconify icon
<Visual src="ph:star-fill" size={24} />

// SVG string
<Visual src="<svg>…</svg>" size={32} />

// With overlay
<Visual src={product.image} aspectRatio="16/9" shape="rounded">
  <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-white">
    Play
  </span>
</Visual>
```

---

#### OverlapStack

A horizontal or vertical stack of overlapping items (avatars, badges, icons) with configurable negative spacing, z-ordering, overflow count badge, and focus/hover elevation.

**Install:**
```bash
npx shadcn@latest add timeax/ui/overlap-stack
```

**`OverlapStackProps`:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `overlap` | `0–12` | `4` | Negative-margin overlap amount (Tailwind spacing scale) |
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | Stack direction |
| `reverse` | `boolean` | `false` | Reverse render order |
| `align` | `'start' \| 'center' \| 'end'` | `'center'` | Cross-axis alignment |
| `max` | `number` | — | Maximum visible items (shows `+N` badge for overflow) |
| `as` | `ElementType` | `'div'` | Root element type |
| `className` | `string` | — | Class on the container |

**`OverlapItemProps`:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `ElementType` | `'div'` | Item element type |
| `className` | `string` | — | Class on the item |
| `elevateOnHover` | `boolean` | `true` | Bring item to front on hover |

**Usage:**

```tsx
import { OverlapStack, OverlapItem } from '@/components/ui/overlap-stack';
import { Avatar } from '@/components/ui/avatar';

<OverlapStack max={4} overlap={3}>
  {users.map(u => (
    <OverlapItem key={u.id}>
      <Avatar src={u.avatar} alt={u.name} className="h-8 w-8 ring-2 ring-background" />
    </OverlapItem>
  ))}
</OverlapStack>
```

---

#### PeekDots

A horizontal scroll navigator with dot pagination controls that scroll hidden items into view on click.

**Install:**
```bash
npx shadcn@latest add timeax/ui/peek-dots
```

**`PeekDotsProps`:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `ReactNode[]` | — | Scrollable item nodes |
| `gap` | `number` | `8` | Gap between items in px |
| `dotSize` | `number` | `8` | Dot diameter in px |
| `dotGap` | `number` | `4` | Gap between dots |
| `activeDotColor` | `string` | — | Active dot Tailwind color class |
| `className` | `string` | — | Class on the container |
| `dotClassName` | `string` | — | Class on the dot row |

---

### 7. State & Async

#### RenderIf

A conditional renderer that shows content when data is non-empty, or displays a configurable `Empty` state placeholder otherwise. Correctly handles edge cases like `0`, empty strings, and empty arrays.

**Install:**
```bash
npx shadcn@latest add timeax/ui/render-if
```

**Registry dependencies:** `empty`

**`EmptyMeta`:**

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `title` | `string \| ReactNode` | — | Empty state title |
| `description` | `string \| ReactNode` | — | Empty state description |
| `icon` | `ReactNode \| () => ReactNode` | — | Illustration or icon |
| `mediaVariant` | `'default' \| 'icon'` | `'icon'` | Icon container style |
| `action` | `ReactNode` | — | CTA button or link |
| `layout` | `'vertical' \| 'horizontal'` | `'vertical'` | Layout direction |
| `align` | `'start' \| 'center'` | `'center'` | Content alignment |
| `hideMedia` | `boolean` | `false` | Hide the icon/illustration |
| `kicker` | `ReactNode` | — | Eyebrow text above the title |
| `before` | `ReactNode` | — | Content before the empty block |
| `after` | `ReactNode` | — | Content after the empty block |
| `wrapper` | `(node) => ReactNode` | — | Wrap the entire empty state |
| `className` | `string` | — | Class on the root |

**Usage:**

```tsx
import { RenderIf, renderIf } from '@/components/ui/render-if';
import { Users } from 'lucide-react';
import { Button } from '@/components/ui/smart-button';

// Component API
<RenderIf
  data={users}
  empty={{
    title: 'No users found',
    description: 'Add your first user to get started.',
    icon: <Users className="h-10 w-10 text-muted-foreground" />,
    action: <Button onClick={openNewUserDialog}>Add user</Button>,
  }}
>
  {(data) => <UserList users={data} />}
</RenderIf>

// Function API
return renderIf(
  users,
  (data) => <UserList users={data} />,
  { title: 'No users', icon: <Users /> }
);
```

---

#### Empty

A standalone visual placeholder container for empty states with composable regions.

**Install:**
```bash
npx shadcn@latest add timeax/ui/empty
```

**Sub-components:** `Empty`, `EmptyHeader`, `EmptyMedia`, `EmptyTitle`, `EmptyDescription`, `EmptyContent`

**Usage:**

```tsx
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from '@/components/ui/empty';
import { Inbox } from 'lucide-react';

<Empty>
  <EmptyHeader>
    <EmptyMedia><Inbox className="h-10 w-10 text-muted-foreground" /></EmptyMedia>
    <EmptyTitle>No messages</EmptyTitle>
    <EmptyDescription>Your inbox is empty.</EmptyDescription>
  </EmptyHeader>
  <EmptyContent>
    <Button>New Message</Button>
  </EmptyContent>
</Empty>
```

---

#### InfiniteScroller

An `IntersectionObserver`-based sentinel that triggers a callback when scrolled into view, enabling automatic lazy-loading of list pages.

**Install:**
```bash
npx shadcn@latest add timeax/ui/infinite-scroller
```

**`InfiniteScrollerProps`:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onLoadMore` | `() => void \| Promise<void>` | — | Fired when the sentinel enters the viewport |
| `hasMore` | `boolean` | — | When `false`, stops observing |
| `loading` | `boolean` | `false` | Suppress firing while loading |
| `threshold` | `number` | `0` | IntersectionObserver threshold |
| `rootMargin` | `string` | `'0px'` | Observer root margin |
| `loader` | `ReactNode` | — | Loading indicator element |
| `className` | `string` | — | Class on the sentinel wrapper |

**Usage:**

```tsx
import { InfiniteScroller } from '@/components/ui/infinite-scroller';
import { Loader2 } from 'lucide-react';

<div>
  {posts.map(p => <PostCard key={p.id} post={p} />)}
  <InfiniteScroller
    hasMore={hasNextPage}
    loading={isFetchingNextPage}
    onLoadMore={fetchNextPage}
    loader={<Loader2 className="mx-auto animate-spin" />}
  />
</div>
```

---

#### Skeleton

Standard shadcn Skeleton primitive for loading placeholders.

**Install:** Use the shadcn `skeleton` primitive.

---

### 8. Actions & Toolbox

#### Actions

A flexible row and toolbar action menu supporting nested items, icons, tooltips, danger styling, and conditional visibility.

**Install:**
```bash
npx shadcn@latest add timeax/ui/actions-toolbox
```

**Dependencies:** `@radix-ui/react-dropdown-menu`, `@radix-ui/react-tooltip`, `lucide-react`

**`ActionItem`:**

| Field | Type | Description |
|-------|------|-------------|
| `label` | `string` | Action label |
| `icon` | `ReactNode` | Action icon |
| `onClick` | `() => void` | Click handler |
| `href` | `string` | Render as link |
| `disabled` | `boolean` | Disable the item |
| `danger` | `boolean` | Apply destructive styling |
| `visible` | `boolean \| () => boolean` | Conditional visibility |
| `children` | `ActionItem[]` | Nested sub-menu items |
| `separator` | `boolean` | Render a separator above |
| `tooltip` | `string` | Tooltip label |

**`ActionsProps`:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `ActionItem[]` | — | Action items |
| `trigger` | `ReactNode` | — | Custom trigger element |
| `mode` | `'dropdown' \| 'toolbar'` | `'dropdown'` | Render as menu or inline buttons |
| `size` | `BtnSize` | `'icon-sm'` | Trigger button size |
| `align` | `'start' \| 'center' \| 'end'` | `'end'` | Dropdown alignment |

**Usage:**

```tsx
import { Actions } from '@/components/ui/actions';
import { Eye, Pencil, Trash2 } from 'lucide-react';

<Actions
  items={[
    { label: 'View',   icon: <Eye />,    onClick: () => handleView(row) },
    { label: 'Edit',   icon: <Pencil />, onClick: () => handleEdit(row) },
    { separator: true },
    { label: 'Delete', icon: <Trash2 />, onClick: () => handleDelete(row), danger: true },
  ]}
/>
```

---

#### Toolbox

A composable toolbar container with group, item, label, and separator primitives.

**Components:** `Toolbox`, `ToolboxGroup`, `ToolboxItem`, `ToolboxSeparator`, `ToolboxLabel`

**Usage:**

```tsx
import { Toolbox, ToolboxGroup, ToolboxItem, ToolboxSeparator } from '@/components/ui/toolbox';

<Toolbox>
  <ToolboxGroup>
    <ToolboxItem><Input placeholder="Search…" /></ToolboxItem>
    <ToolboxItem><DatePicker /></ToolboxItem>
  </ToolboxGroup>
  <ToolboxSeparator />
  <ToolboxGroup align="end">
    <ToolboxItem><Button tone="primary">Export</Button></ToolboxItem>
  </ToolboxGroup>
</Toolbox>
```

---

#### BulkToolbar

A sticky footer toolbar that appears when rows are selected, showing a count badge and bulk action buttons.

**`BulkToolbarProps`:**

| Prop | Type | Description |
|------|------|-------------|
| `count` | `number` | Number of selected rows |
| `actions` | `ActionItem[]` | Bulk action items |
| `onClearSelection` | `() => void` | Deselect all callback |
| `className` | `string` | Class on the toolbar |

---

### 9. Forms & Input

#### ConfigForm

A schema-driven settings form renderer that reads a `UiConfigSchemaPayload` and generates inputs, groups, tab navigation, visibility rules, and profile management automatically.

**Install:**
```bash
npx shadcn@latest add timeax/ui/config-form
```

**`NotificationTemplateEditorProps` (ConfigForm):**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `schema` | `UiConfigSchemaPayload` | — | Field schema with tabs |
| `value` | `Record<string, any>` | — | Controlled field values |
| `onChange` | `(values) => void` | — | Values change callback |
| `onSubmit` | `(values) => void` | — | Form submit handler |
| `profiles` | `SettingsProfile[]` | — | Available profiles |
| `activeProfile` | `number` | — | Active profile ID |
| `onProfileChange` | `(id) => void` | — | Profile switch callback |
| `readonly` | `boolean` | `false` | Render as read-only |

**Supported field types:** `text`, `toggle`, `tristate`, `password`, `email`, `number`, `tel`, `url`, `search`, `chips`, `checkbox`, `radio`, `color`, `range`, `select`, `multiselect`, `date`, `time`, `datetime-local`, `month`, `week`, `file`, `json`

---

### 10. Notifications

#### FeedRenderer

A flexible notification card renderer supporting multiple message types, icons, action buttons, and inline/vertical icon layouts.

**Install:**
```bash
npx shadcn@latest add timeax/ui/feed-renderer
```

**Dependencies:** `@iconify/react`
**Registry dependencies:** `smart-button`

**`MessagePayload`:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Message ID |
| `message` | `MessageHeaderPayload` | Header with `text`, `color`, `variant` |
| `messages` | `MessageLinePayload[]` | Body lines |
| `actions` | `MessageActionPayload[]` | Action buttons |

**`FlashPayload`:** For banner/dialog-style flash messages with a title, variant, icon, and up to two action buttons.

**Also includes:** `LoggerProvider` — a context provider that manages a message log with programmatic `log()` and `clear()` methods.

---

#### NotificationBuilder

A full-featured visual editor for composing notification templates across multiple channels (log, flash, push, email, SMS) with live preview.

**Install:**
```bash
npx shadcn@latest add timeax/ui/notification-builder
```

**`NotificationTemplateEditorProps`:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `'log' \| 'flash' \| 'push' \| 'email' \| 'sms'` | `'log'` | Active editor mode |
| `draft` | `MessagePayload \| FlashPayload \| …` | — | Initial draft payload |
| `onChange` | `(draft) => void` | — | Draft change callback |
| `onModeChange` | `(mode) => void` | — | Mode switch callback |
| `children` | `ReactNode` | — | Custom inspector content |

**Imperative API via `NotificationEditorRef`:** `getDraft()`, `setDraft()`, `addLine()`, `updateLine()`, `removeLine()`, `addAction()`, `removeAction()`, `validate()`, `toPayload()`

**Usage:**

```tsx
import { NotificationTemplateEditor } from '@/components/ui/notification-builder';
import type { NotificationEditorRef } from '@/components/ui/notification-builder';

const editorRef = useRef<NotificationEditorRef>(null);

<NotificationTemplateEditor
  ref={editorRef}
  mode="flash"
  onChange={(draft) => console.log(draft)}
/>

// Get current draft imperatively
const payload = editorRef.current?.getDraft();
```

---

### 11. Primitives & Utilities

#### ScrollArea

Radix UI-based ScrollArea wrapper managing vertical and horizontal custom scrollbars.

**Install:** Ships as a `scroll-area` shadcn registry dependency.

```tsx
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

<ScrollArea className="h-64 w-full">
  <div className="p-4">Long content…</div>
  <ScrollBar orientation="vertical" />
</ScrollArea>
```

---

#### Hooks (use-mobile)

Viewport-width hook that returns `true` when the window is narrower than the given breakpoint.

**Install:**
```bash
npx shadcn@latest add timeax/ui/use-mobile
```

```tsx
import { useIsMobile } from '@/hooks/use-mobile';

function Toolbar() {
  const isMobile = useIsMobile(768); // true when viewport < 768px
  return isMobile ? <CompactToolbar /> : <FullToolbar />;
}
```

---

## Registry JSON Format

Each component ships a `.json` descriptor available at `public/r/<name>.json` that the shadcn CLI reads to install the component and its dependencies.

```json
{
  "name": "smart-button",
  "type": "registry:ui",
  "dependencies": ["lucide-react", "class-variance-authority"],
  "registryDependencies": [],
  "files": [
    {
      "path": "registry/new-york/smart-button/smart-button.tsx",
      "type": "registry:ui",
      "target": "components/ui/smart-button.tsx"
    }
  ]
}
```

---

## Contributing

1. Add new components to `registry/new-york/<component-name>/`.
2. Create a corresponding `<component-name>.json` descriptor.
3. Add the component entry to `registry.json` at the project root.
4. Update `docs/ui/component-list.md` with the component status.

---

## License

MIT
