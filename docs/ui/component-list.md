# Timeax Custom Shadcn Registry: Component List Spec (Revised)

This document contains the revised catalog and classification of components from the Digital Growth Platform (`digital-growth-platform`) project, updated to reflect the scoped active list of migration candidates. Excluded modules have been removed from active migration considerations.

Registry manifests reference Timeax-owned dependencies with the `timeax/ui/` prefix. Bare dependency names are reserved for upstream shadcn primitives.

---

## Part 1: Primary Active Migration Families

### 1. Actions and Bulk Toolbar (`actions` & `bulk-toolbar`)
* **Status:** Pending / Not Implemented
* **Source Files:**
  * `#120 resources/js/components/actions/index.tsx` (Actions)
  * `#118 resources/js/components/actions/bulk-toolbar.tsx` (BulkToolbar)
  * `#119 resources/js/components/actions/bulk.ts` (Helpers)
* **Description:** Represents individual context menus, row actions (icon-buttons with tooltips/dropdowns), and bulk table selection footers.
* **Migration Strategy:** **Consolidate & Adapt**.
  * Consolidate `#120 actions/index.tsx` and `#118 bulk-toolbar.tsx` under a unified action-toolbar framework.
  * Split `#119 bulk.ts` to expose clean async utilities like `runBulkByIds` and browser download `exportSelectedAsJson`.
  * Decouple the actions framework from hardcoded `react-icons/md` symbols, supporting native React nodes for icons.

---

### 2. Smart Button and Extensions (`smart-button`)
* **Status:** Implemented
* **Source Files:**
  * `#270 resources/js/components/ui/smart-button.tsx` (Smart Button)
  * `#134 resources/js/components/button/pill.tsx` (Pill Button)
  * `#137 resources/js/components/button/split-button.tsx` (Split Button)
  * `#138 resources/js/components/button/status-button.tsx` (Status Button)
* **Description:** A polymorphic, tone-aware, stateful button wrapper that handles loading overlays and normalizes behavior across buttons/anchors.
* **Migration Strategy:** **Consolidate & Adapt**.
  * Consolidate `pill.tsx` and standard buttons into properties and variants of `smart-button.tsx` rather than publishing multiple thin wrappers.
  * Re-evaluate `split-button.tsx` and `status-button.tsx` to extend `smart-button` behaviors directly.
  * **Tool button (#139)** is **Dropped**; its icon placement, disabled rules, and emphasis logic are absorbed into `smart-button`.
  * Decouple the loader from `react-icons/ai` and replace with a standard SVG spinner. Match tone styles to v4 Tailwind variables.
* **Current Implementation Summary:** Consolidated into three separate registry modules in the `registry/new-york/` directory:
  * [smart-button](file:///d:/Projects/GitHub/ui/registry/new-york/smart-button/smart-button.tsx): A fully polymorphic component (`as` prop rendering) supporting 10 tone/color variations (primary, success, info, warning, danger, theme, white, grey, secondary, neutral), 5 emphasis levels (solid, soft, outline, ghost, link), standard/square sizes (`sm` through `3xl`), customizable rounding (`md`, `full`, `none`, or custom pixels), custom icon gap/size settings, and stateful loading overlays with standard SVG spin animations (`Loader2` from `lucide-react`).
  * [split-button](file:///d:/Projects/GitHub/ui/registry/new-york/split-button/split-button.tsx): Combines two `Button` components side-by-side (primary action and a caret trigger) coupled with Radix UI's Dropdown Menu primitive to render secondary actions.
  * [status-button](file:///d:/Projects/GitHub/ui/registry/new-york/status-button/status-button.tsx): Maps a status text string (e.g. "completed", "pending", "failed") to corresponding styling tones and icons with optional spinning animations.

---

### 3. Speed Dial (`speed-dial`)
* **Status:** Implemented
* **Source Files:**
  * `#136 resources/js/components/button/speedial.tsx` (Speed Dial)
  * `#131 resources/js/components/button/dial.tsx` (Positioning/Animation Engine)
* **Description:** Radial or linear floating action button menu that fans out stagger-animated children.
* **Migration Strategy:** **Consolidate & Rebuild**.
  * Do not publish `dial.tsx` independently; keep it as an internal utility file of `speed-dial`.
  * Rebuild `SpeedDial` to match the accessibility, styling, and configuration standards of PrimeReact's SpeedDial.
  * **Required Specification Details:**
    * Open states (controlled and uncontrolled).
    * Radial (sweep angle, radius, start angle) and linear (up, down, left, right) item arrangements.
    * Positioning modes (fixed screen overlays vs. inline wrappers).
    * Dismissals (outside-click and Escape key).
    * Keyboard navigation support (arrow focus movements, tab orders) and screen reader labelling.
    * Reduced motion media query animations.
    * Clean composition API via `<SpeedDial>` and `<SpeedDialAction>`.
* **Current Implementation Summary:** Implemented in the [speed-dial](file:///d:/Projects/GitHub/ui/registry/new-york/speed-dial/speed-dial.tsx) registry directory:
  * A complete floating action button component built with Framer Motion animations. Implements both `linear` (up, down, left, right directions) and `radial` (sweep angle, radius, start angle calculations) layout modes.
  * Supports hover or click trigger types, controlled/uncontrolled visibility, click-outside and escape-key dismissals, page backdrops, portal rendering, and custom icons.

---

### 4. Card Family (`smart-card`)
* **Status:** Implemented
* **Source Files:**
  * `#143 resources/js/components/card/smart-card.tsx` (SmartCard)
  * `#140 resources/js/components/card/icon-card.tsx` (IconCard)
  * `#142 resources/js/components/card/paper.tsx` (Paper)
  * `#141 resources/js/components/card/index.tsx` (Entry point wrapper)
* **Description:** Surfaced container wrapper that segments header, content, and footer regions.
* **Migration Strategy:** **Consolidate**.
  * Consolidate the entire family under `smart-card` registry folder.
  * Replace custom classes like `app-card`, `app-card--inset` and `bg-card-inner` with semantic token configurations.
* **Current Implementation Summary:** Split into four clean registry entries under `registry/new-york/`:
  * [card](file:///d:/Projects/GitHub/ui/registry/new-york/card/card.tsx): A standard semantic base primitive wrapping layout parts (`Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, `CardFooter`) with custom CSS data-slots and margins.
  * [smart-card](file:///d:/Projects/GitHub/ui/registry/new-york/smart-card/smart-card.tsx): A container supporting variant structures (solid, soft, outlined, ghost, soft-outline, soft-solid), outer/inner nested surface levels, customizable header borders, multiple spacing densities (compact, default, loose), and mapped link actions.
  * [icon-card](file:///d:/Projects/GitHub/ui/registry/new-york/icon-card/icon-card.tsx): A promotional layout where a circular badge or icon overlaps the top boundary of the container by exactly half of its size.
  * [paper](file:///d:/Projects/GitHub/ui/registry/new-york/paper/paper.tsx): A simpler sheet layout backing standard surface variations (solid, outline, ghost), outer/inner levels, padding densities, and optional backdrop blurs.

---

### 5. Visual Family (`visual`)
* **Status:** Implemented
* **Source Files:**
  * `#284 resources/js/components/visual/index.tsx` (Visual wrapper)
  * `#283 resources/js/components/visual/image.tsx` (VisualImage)
* **Description:** Media sniffing frame supporting SVGs (inlining/rendering), standard images, and Iconify key lookup formats.
* **Migration Strategy:** **Consolidate**.
  * Combine `image.tsx` and `index.tsx` into a single `visual` package.
  * Ensure standard accessibility tags (aria labels and alt attributes) are supported.
* **Current Implementation Summary:** Consolidated into the `registry/new-york/visual/` directory:
  * [visual](file:///d:/Projects/GitHub/ui/registry/new-york/visual/visual.tsx): A media frame component implementing smart resource sniffing. It parses source files (including strings, SVG nodes, inline data, and icon keys) and provides loading indicators, error recovery, default placeholders, aspect ratio limits, roundings, and shadows.
  * [visual-image](file:///d:/Projects/GitHub/ui/registry/new-york/visual/visual-image.tsx): A lower-level image-specific component wrapping HTML images with loading detection, object-fit settings, and background-cover features.

---

### 6. Overlap Family (`overlap-stack`)
* **Status:** Implemented
* **Source Files:**
  * `#194 resources/js/components/overlap/overlap.tsx` (OverlapStack)
  * `#193 resources/js/components/overlap/item.tsx` (OverlapItem)
  * `#195 resources/js/components/overlap/peek-dots.tsx` (Scroll indicator)
* **Description:** Visual avatar/child stack with hover elevation, paired with dot indicator carousels.
* **Migration Strategy:** **Consolidate**.
  * Consolidate under the registry item `overlap-stack`. Keep item tags polymorphic.
* **Current Implementation Summary:** Structured into two registry directories in `registry/new-york/`:
  * [overlap-stack](file:///d:/Projects/GitHub/ui/registry/new-york/overlap-stack/overlap-stack.tsx): Includes `OverlapStack` (a polymorphic container managing negative spacing scales `0` to `12`, horizontal/vertical alignment, reverse layouts, and list tags for accessibility) and `OverlapItem` (a polymorphic wrapper supporting focus/hover elevation overlays), along with `OverlapStackOverflow` (render element for +N count badges).
  * [peek-dots](file:///d:/Projects/GitHub/ui/registry/new-york/peek-dots/peek-dots.tsx): A carousel/scroll navigator displaying horizontal slide items, measuring layout bounds to identify overflowing children, and rendering interactive dot pagination controls that scroll to hidden targets on click.

---

### 7. Data Table Family (`data-table`)
* **Status:** Implemented
* **Source Files:**
  * `#221 resources/js/components/table/index.tsx` (Table)
  * `#218 resources/js/components/table/components.tsx` (Paginator/Visibility Button)
  * `#220 resources/js/components/table/hooks.ts` (Sticky calculations)
  * `#223 resources/js/components/table/table-utils.ts`
  * `#225 resources/js/components/table/utils.tsx`
  * `#224 resources/js/components/table/types.ts`
  * `#219 resources/js/components/table/date-text.tsx` (Separated into `date-text`)
* **Description:** A lightweight declarative React grid handling sticky frozen columns, sorting, global filter matching, and visibility arrays.
* **Migration Strategy:** **Consolidate & Adapt**.
  * Consolidate layout calculations, paginator selectors, and visibility controls into the unified `data-table` package.
  * Separate Date rendering helper as the standalone `date-text` component.
  * Integrate custom Radix-based `ScrollArea` for smooth viewport scrolling and sticky column management.
* **Current Implementation Summary:** Structured into three separate registry modules:
  * [table](file:///d:/Projects/GitHub/ui/registry/new-york/table/table.tsx): Standard semantic HTML grid elements matching shadcn.
  * [scroll-area](file:///d:/Projects/GitHub/ui/registry/new-york/scroll-area/scroll-area.tsx): Radix-based ScrollArea wrapper managing vertical and horizontal scrollbars.
  * [date-text](file:///d:/Projects/GitHub/ui/registry/new-york/date-text/date-text.tsx): Standalone date text formatting component with built-in presets (e.g. `dateMedium`, `isoDateTime`) based on `Intl.DateTimeFormat`.
  * [data-table](file:///d:/Projects/GitHub/ui/registry/new-york/data-table/data-table.tsx): High-level table component wrapping sorting, paging, select-checklists, global search queries, column visibility dropdowns, and sticky headers (`stickyHeader` and `viewportHeight` settings).

---

### 8. Dialog and Modal Orchestration (`dialog-manager` & `responsive-dialog`)
* **Status:** Implemented
* **Source Files:**
  * `#155 resources/js/components/dialog/DialogProvider.tsx` (Provider)
  * `#154 resources/js/components/dialog/create-modal.tsx` (Modal Factory)
  * `#156 resources/js/components/dialog/dialogStore.ts` (Store Mapping)
  * `#157 resources/js/components/dialog/types.ts` (Types)
  * `#252 resources/js/components/ui/headless-responsive-dialog.tsx` (Layout)
* **Description:** centralized, promise-aware dialog registration provider, paired with responsive drawer-modals.
* **Migration Strategy:** **Consolidate & Adapt**.
  * Re-package provider, store, factory, and types into `dialog-manager`.
  * Reroute dialog layout behaviors through `#252 responsive-dialog` to support desktop modal and mobile drawer screens.
  * Decouple custom permissions verification hooks and error logging frameworks.
* **Current Implementation Summary:** Implemented under two separate registry items:
  * [dialog-manager](file:///d:/Projects/GitHub/ui/registry/new-york/dialog-manager/): Exposes the programmatic registry (`DialogProvider`, singleton store, dialog factory wrapper `createDialog`, and compound grid sub-components `DialogWrapper`, `DialogHeader`, `DialogContent`, `DialogFooter`, etc.).
  * [headless-responsive-dialog](file:///d:/Projects/GitHub/ui/registry/new-york/headless-responsive-dialog/): An adaptive dialog primitive that renders as a standard centered modal on desktop and transitions to a bottom sheet on mobile screens.


---

### 9. Sidebar Manager (`sidebar-manager`)
* **Status:** Implemented
* **Source Files:**
  * `#211 resources/js/components/sidebar/SidebarProvider.tsx`
  * `#209 resources/js/components/sidebar/create-sidebar.tsx`
  * `#213 resources/js/components/sidebar/types.ts`
  * `#210 resources/js/components/sidebar/SidebarHost.tsx`
* **Description:** central registry for sliding detail sheets opened programmatically via hooks.
* **Migration Strategy:** **Promote & Adapt**.
  * Expose a generic `sidebar-manager` item.
  * Modify `SidebarHost` to read mounted sidebars as a configuration prop rather than importing static application-specific routes.
* **Current Implementation Summary:** Consolidated and implemented in the [sidebar-manager](file:///d:/Projects/GitHub/ui/registry/new-york/sidebar-manager/) directory:
  * Exposes a fully generic programmatic sliding sheet system.
  * Extends layout support to compound layout helper components ([SidebarWrapper](file:///d:/Projects/GitHub/ui/registry/new-york/sidebar-manager/sidebar-compound.tsx), `SidebarHeader`, `SidebarTitle`, `SidebarClose`, `SidebarContent` with internal `ScrollArea`, `SidebarFooter`) to support complex designs.
  * Implements height constraints (`min-h-0` flexbox wrapping) for scrolling, hides duplicate absolute close buttons inside custom overlays, maps descriptions, and provides optional module augmentation hooks.


---

### 10. Render-if and Empty State (`render-if`)
* **Status:** Implemented
* **Source Files:**
  * `#201 resources/js/components/renderif.tsx`
  * `#249 resources/js/components/ui/empty.tsx`
* **Description:** Conditional renderer that falls back to custom placeholder vectors when collections or objects are empty.
* **Migration Strategy:** **Consolidate**.
  * Consolidate layout blocks from `empty.tsx` directly into the `render-if` folder.
* **Current Implementation Summary:** Consolidated into two separate registry items:
  * [render-if](file:///d:/Projects/GitHub/ui/registry/new-york/render-if/): A conditional renderer wrapper that handles asynchronous loading states, empty collections (preventing false positives for `0`), error messages, and resolved data outputs.
  * [empty](file:///d:/Projects/GitHub/ui/registry/new-york/empty/): Visual placeholder container that displays empty-state descriptions and action buttons.


---

### 11. Enhanced Tabs (`enhanced-tabs`)
* **Status:** Implemented
* **Source Files:**
  * `#231 resources/js/components/ui/app-tabs.tsx`
* **Description:** Tab navigators handling list overflows (scroll/dropdown combos) and asynchronous tab-changing validation guards.
* **Migration Strategy:** **Promote**. Clean layout dependencies and rename to `enhanced-tabs`.
* **Current Implementation Summary:** Implemented in the [enhanced-tabs](file:///d:/Projects/GitHub/ui/registry/new-york/enhanced-tabs/enhanced-tabs.tsx) and [overflow-list](file:///d:/Projects/GitHub/ui/registry/new-york/overflow-list/overflow-list.tsx) registry directories:
  * Extracted the list overflow measurement and slicing engine into a standalone generic `<OverflowList>` component. It measures node sizes dynamically via `ResizeObserver` and slices list items dynamically.
  * Supports smooth scrolling navigation arrows with entrance fade durations and adjustable shift steps.
  * Built `<Tabs>` and `<TabPanel>` wrappers leveraging `OverflowList` to render responsive tab list triggers.
  * Context-bound validation guards (`onBeforeLeave` / `onBeforeChange` callbacks) to intercept page/tab transitions asynchronously (e.g. form confirmation checks).

---

### 12. Command Search (`command-search`)
* **Status:** Implemented
* **Source Files:**
  * `#170 resources/js/components/global-search/provider.tsx`
  * `#171 resources/js/components/global-search/registry.tsx`
  * `#172 resources/js/components/global-search/search-params.ts`
  * `#173 resources/js/components/global-search/types.ts`
* **Description:** Command palette overlay mapped to keyboard event triggers.
* **Migration Strategy:** **Split & Adapt**.
  * Decouple router configurations and page redirection routes. Provide clean callback hooks for item select click events.
* **Current Implementation Summary:** Implemented in the [command-search](file:///d:/Projects/GitHub/ui/registry/new-york/command-search/) registry folder:
  * A keyboard-triggered command search dialog matching the layout patterns of shadcn command palettes.
  * Decouples hardcoded routes to support user-configured lists and click callbacks.


---

### 13. Infinite Scroller (`infinite-scroller`)
* **Status:** Implemented
* **Source File:**
  * `#179 resources/js/components/infinite-scroller.tsx`
* **Description:** Observer-based scrolling trigger for lazy-loading lists.
* **Migration Strategy:** **Promote**.
* **Current Implementation Summary:** Implemented in the [infinite-scroller](file:///d:/Projects/GitHub/ui/registry/new-york/infinite-scroller/) directory:
  * An IntersectionObserver-based scrolling anchor component that triggers page fetching automatically when scrolled into view.


---

### 14. Paginator (`paginator`)
* **Status:** Implemented
* **Source File:**
  * `#196 resources/js/components/paginator.tsx`
* **Description:** Centralized visual navigation controls.
* **Migration Strategy:** **Promote**.
* **Current Implementation Summary:** Implemented in the [paginator](file:///d:/Projects/GitHub/ui/registry/new-york/paginator/paginator.tsx) registry directory:
  * A template-driven, zoned pagination component supporting `index` and `page` modes.
  * Slices data structures dynamically via a render-prop children function.
  * Supports customizable order lists and left/right zones to render layout elements (ranges, page links, jump buttons, page sizes, page text inputs, spacers).
  * Exposes server-side total override `totalRecords` for seamless lazy datatable integrations.

---

### 15. Descriptor Layouts (`descriptor`)
* **Status:** Implemented
* **Source File:**
  * `#180 resources/js/components/info/descriptor.tsx`
* **Description:** Standard key-value descriptive metadata rows.
* **Migration Strategy:** **Promote**.
* **Current Implementation Summary:** Consolidated and implemented in the [descriptor](file:///d:/Projects/GitHub/ui/registry/new-york/descriptor/) registry directory:
  * Exposes both a property-based API (for 100% backward compatibility) and a new compound sub-components API (`Descriptor`, `DescriptorLeading`, `DescriptorBody`, `DescriptorTitle`, `DescriptorDescription`, `DescriptorTrailing`).
  * Features support for horizontal dividers (`top`, `bottom`, `both`, `around`), vertical/horizontal layouts, spacing presets (`compact`, `cozy`, `spacious`), and is fully integrated with the generic `Text` and `Visual` components.
  * Consolidates simple metadata grid layouts via `<Info>` inside `info.tsx`.


---

### 16. Typography/Text Primitive (`text`)
* **Status:** Implemented
* **Source File:**
  * `#227 resources/js/components/text.tsx`
* **Description:** A polymorphic typography wrapper supporting predefined text styles, weight/size overrides, currency/number formatting, text helpers, link overrides, and inline layout indicators.
* **Migration Strategy:** **Promote**. Cleaned and structured around standard variants and typography options.
* **Current Implementation Summary:** Implemented in the [text](file:///d:/Projects/GitHub/ui/registry/new-york/text/text.tsx) registry directory:
  * A polymorphic typographic component wrapping text tag types (`h1`-`h6`, `p`, `span`, `code`, etc.) supporting custom variants (banner, title, subtitle, heading, subheading, lead, large, body, small, caption, muted, code).
  * Implements weight overrides, italic/uppercase/capitalize helper classes, inline icons (left/right alignments, custom gaps), link handlers (acting as an anchor if `href` or `link` is passed), and built-in number/currency formatting using local `Intl.NumberFormat`.

---

## Part 2: Review Later / Undecided

### 17. Smart Popover (`smart-popover`)
* **Status:** Implemented
* **Source File:**
  * `#199 resources/js/components/popover.tsx`
* **Description:** Popover decorator exposing controlled toggles, trigger match-widths, render-prop close callbacks, and collision alignments.
* **Migration Strategy:** **Review Later**. Compare its API against standard combinations of shadcn Popover tags before defining a new registry item.
* **Current Implementation Summary:** Implemented in the [smart-popover](file:///d:/Projects/GitHub/ui/registry/new-york/smart-popover/) directory:
  * Exposes `SmartPopover` which acts as a lightweight composition wrapper around standard shadcn `<Popover>` components.
  * Supports trigger-width matching (`matchTriggerWidth`), viewport boundaries safe heights, and an inline functional render callback `({ close }) => ReactNode` to self-close programmatically (e.g. from within a form) without hoisting parent states.


---

### 18. Reveal Control (`reveal`)
* **Status:** Implemented
* **Source File:**
  * `#135 resources/js/components/button/reveal.tsx`
* **Description:** Collapses toolbar controls behind an icon-trigger on smaller breakpoints.
* **Migration Strategy:** **Review Later**. Inspect practical admin use cases to decide between `reveal` or standard shadcn compositions.
* **Current Implementation Summary:** Implemented in the [reveal](file:///d:/Projects/GitHub/ui/registry/new-york/reveal/) directory:
  * A responsive disclosure button container that hides inputs or filter toolbars behind an icon toggle on smaller viewports.
  * Integrates with the custom `useIsMobile` viewport hook to automatically detect window width boundaries (default is `768px` / `md`).
  * Features outside-click listeners and escape key event handlers.


---

### 19. Money Display (`money`)
* **Status:** Pending / Not Implemented
* **Source File:**
  * `#183 resources/js/components/money.tsx`
* **Description:** Currency formats wrapper.
* **Migration Strategy:** **Undecided**. Only retain if it implements metadata rules, compact formatting styles, loading states, or decimal conversions beyond native `Intl.NumberFormat`.

---

### 20. Notification Builder Components (`notification-builder`)
* **Status:** Pending / Not Implemented
* **Source Files:**
  * `#794` to `#812` inside `resources/js/services/notifications/components/` (19 files)
  * `#190 resources/js/components/notifications/template-builder-core.tsx`
* **Description:** layout items for notification builder templates.
* **Migration Strategy:** **Review Later (Consolidation Analysis)**. Inspect files individually for shared preview panels, fields, or selectors to merge under a unified builder-primitives family.

---

### 21. Feed & Alerts (`flash-feed`)
* **Status:** Pending / Not Implemented
* **Source Files:**
  * `#160` to `#169` inside `resources/js/components/feed/` (10 files)
* **Description:** System activity banners and user-notification alerts.
* **Migration Strategy:** **Review Later**. Analyze for generic presentation layout properties.

---

## Part 3: Explicitly Excluded Modules

The following files and folders are **outside the active registry scope** and will remain within the source application codebase:

### Excluded Presentation & Navigation
* App Header & Logo:
  * `#122 app-header.tsx`, `#123 app-logo-icon.tsx`, `#124 app-logo.tsx`
* App Shell & Sidebar Layouts:
  * `#121 app-content.tsx`, `#125 app-shell.tsx`, `#126 app-sidebar-header.tsx`, `#127 app-sidebar.tsx`
  * `#185 nav-footer.tsx`, `#186 nav-main.tsx`, `#187 nav-user.tsx`
* Other layout items:
  * `#128 appearance-dropdown.tsx`, `#129 appearance-tabs.tsx`, `#130 breadcrumbs.tsx`
  * `#153 delete-user.tsx`, `#174 heading-small.tsx`, `#175 heading.tsx`
  * `#182 input-error.tsx`, `#226 text-link.tsx`
  * `#280 user-info.tsx`, `#281 user-menu-content.tsx`, `#176 icon.tsx`
  * `#132 form-button.tsx` (Form Button)

### Excluded Select & Combobox Family
* `#202 ComboboxSelect.tsx`, `#203 DataMultiSelect.tsx`, `#204 DataSelect.tsx`, `#205 select-types.ts`
* *Reason:* Rely on standard shadcn select/command primitives instead.

### Excluded Widgets Family
* `#285 widgets/analytics.tsx`, `#286 data-viewer/index.tsx`, `#287 data-viewer/row.tsx`, `#288 data-viewer/utils.ts`
* `#289 forti-process-progress.tsx`, `#291 plugin-process-window.tsx`, `#292 process-widget.tsx`, `#293 settings-form.tsx`

### Excluded Charts Family
* `#144 category-chart-widget.tsx`, `#145 chart-utils.ts`, `#146 funnel-chart-widget.tsx`
* `#148 time-series-chart-widget.tsx`, `#150 use-chart-data.ts`, `#151 use-live-refresh.ts`

### Excluded Utilities
* `#282 utils.tsx` (unrelated components matrix).

### Excluded Domain Systems
* Puck Body Renderer: `#152 puck-body-renderer.tsx`
* Plugins Card: `#197 plugins/card.tsx`
* Policy Editor Grid: `#198 policies/policy-editor.tsx`
* Receipts Modal: `#200 receipts/receipt-view-modal.tsx`
* Script Injectors: `#217 site-script-injector.tsx`
* Receipt Builder & Plugin Panels outside `components/`
* Page-shell extraction from admin page-layout partials
