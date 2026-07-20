# AGENTS.md

## Project: Timeax Shadcn Registry

This repository is a **custom shadcn-compatible component registry**, not a normal application. Work in this repository must produce reusable, installable, framework-neutral React components that can be consumed by other projects through the shadcn registry flow.

Always take a look at the docs/ui/component-list.md file to understand the current state of the registry and what components are available use. This file should be updated as the registry evolves.

## Primary objective

Extract, modernize, consolidate, and package the strongest reusable UI patterns from the traced application, with particular emphasis on components repeatedly used by admin pages.

The desired result is a coherent registry library, not a dump of every source file. Each accepted component must be reusable across unrelated applications, properly typed, accessible, themeable, documented, and installable through the shadcn CLI.

## Repository conventions

Use this layout by default:

```txt
registry/
  new-york/
    component-name/
      component-name.tsx
      component-name-demo.tsx        # when a demo is useful
      component-name.types.ts         # only when types are substantial
public/
  r/                                  # generated registry output
```

- Registry item names and folders use `kebab-case`.
- React component names use `PascalCase`.
- Prefer one focused registry item over a large application subsystem.
- A tightly related compound API may live in one item, such as `DataTable`, `DataTableToolbar`, and `DataTablePagination`.
- Use `new-york` as the organizational style unless the task explicitly requests another style.

## Required implementation standards

- React and TypeScript only.
- Named exports for public components.
- Use `React.forwardRef` where DOM ref forwarding is useful.
- Use `cn()` from `@/lib/utils`.
- Prefer composition, slots, and render props over business-specific branches.
- Prefer semantic HTML and accessible Radix primitives.
- Support keyboard navigation, focus visibility, screen readers, and reduced motion where relevant.
- Support light and dark themes.
- Use Tailwind and theme tokens. Avoid hardcoded brand colours.
- Support Tailwind v4 conventions.
- Keep server, router, database, and network behaviour outside visual primitives.
- Do not assume Laravel, Inertia, Ziggy, Prisma, Axios globals, or a particular form library.
- Do not import from `database/prisma` in registry components.
- Do not call global `route()`, `window.axios`, or browser download APIs from a generic UI component unless the component is explicitly an integration item and the dependency is injected.
- Do not retain application-specific permission names, route names, model names, or domain enums in generic components.

## Registry dependency rules

When a component imports another shadcn registry component, declare it in `registryDependencies`.

```json
{
  "registryDependencies": ["button", "dropdown-menu"]
}
```

When a component imports an npm package or Radix primitive directly, declare it in `dependencies`.

```json
{
  "dependencies": ["@radix-ui/react-dialog", "class-variance-authority"]
}
```

Every registry item must include all files required for installation. Never rely on an undeclared local helper.

## Migration decision model

Classify each traced source into one of these outcomes:

1. **Promote** — already broadly reusable; clean and package it.
2. **Consolidate** — several overlapping files should become one coherent component family.
3. **Split** — separate generic UI from application orchestration or data fetching.
4. **Adapt** — retain the pattern but replace app-specific dependencies with callbacks, adapters, or controlled props.
5. **Reference only** — useful as a demo or composition example, but not suitable as a registry primitive.
6. **Reject** — business-specific, duplicated, broken, or too coupled to justify registry maintenance.

Do not migrate a component merely because it exists. A registry component must have a plausible reusable contract across multiple applications.

## Admin usage evidence and priority

Inspect the actual project in 'C:\Users\David\Herd\digital-growth-platform\resources\js' directly to understand how components are used across admin pages, partials, action dialogs, layouts, and feature-specific interfaces.

Prioritize components based on real usage throughout the codebase, especially components that appear repeatedly across the admin interface. Before extracting or redesigning a component, review its current consumers, supported props, variants, composition patterns, dependencies, and edge cases.

Preserve useful behavior, but improve weak areas such as typing, accessibility, API consistency, composition, styling, theme support, dependency boundaries, and maintainability.

The goal is not to copy existing components into the registry unchanged. Evolve them into polished, reusable, style-neutral, registry-ready shadcn components that can be installed and used across different applications.

Use this evidence to prioritize work:

| Approx. admin imports | Existing import | Migration implication |
|---:|---|---|
| 173 | `@/components/ui/smart-button` | Unify button semantics and variants. |
| 154 | `@/components/renderif` | Create a robust async/conditional state component. |
| 146 | `@/components/table` | Highest-value admin data-table family. |
| 136 | `@/components/dialog/DialogProvider` | Reusable programmatic dialog manager. |
| 116 | `@/components/table/utils` | Row actions, table utilities, and selection helpers. |
| 104 | `@/components/utils` | Split generic helpers from application-specific utilities. |
| 100 | `@/components/ui/toolbox` | Promote toolbar/toolbox composition. |
| 80 | `@/components/dialog/create-modal` | Programmatic modal factory; decouple from app permissions. |
| 69 | `@/components/actions` | Reusable row and toolbar action menus. |
| 67 | `@/components/actions/bulk` | Bulk-selection helpers and export utilities. |
| 63 | `@/components/button` | Consolidate button extensions. |
| 62 | `@/components/card` | Promote and rationalize the card family. |
| 31 | `@/components/ui/app-tabs` | Promote enhanced tabs after API cleanup. |
| 25 | `@/components/text` | Promote only if its typography API is coherent. |
| 17 | `@/components/ui/badge` | Usually retain as a base shadcn dependency. |
| 9 | `@/components/sidebar/SidebarProvider` | Review for reusable extraction. |
| 8 | `@/components/global-search/search-params` | Review for reusable extraction. |
| 7 | `@/components/charts` | Review for reusable extraction. |
| 6 | `@/components/ui/separator` | Review for reusable extraction. |
| 4 | `@/components/button/pill` | Review for reusable extraction. |

Usage frequency is evidence, not the sole criterion. Some visually valuable components, such as the card, visual, overlap, and toolbar families, may have fewer direct imports because they are composed through barrel exports or higher-level components.

## First-class component families

### 1. Card family — highest priority

Source candidates:

- `#140 resources/js/components/card/icon-card.tsx`
- `#141 resources/js/components/card/index.tsx`
- `#142 resources/js/components/card/paper.tsx`
- `#143 resources/js/components/card/smart-card.tsx`
- `#238 resources/js/components/ui/card.tsx` as the shadcn base

Expected registry direction:

- Keep the standard shadcn card primitive as a dependency, not a duplicate implementation.
- Consolidate `SmartCard`, `Paper`, and `IconCard` around a predictable compound API.
- Preserve useful concepts such as `variant`, `level`, actions, header/content/footer regions, icon presentation, and inset surfaces.
- Replace application-only tokens such as `card-inner` or `app-card--inset` with documented optional tokens or portable defaults.
- Avoid runtime child-position guessing when explicit compound components provide a clearer API.
- Consider separate registry items: `smart-card`, `icon-card`, and `paper`, sharing a small token contract.

### 2. Visual family — highest priority

Source candidates:

- `#283 resources/js/components/visual/image.tsx`
- `#284 resources/js/components/visual/index.tsx`

Expected registry direction:

- Inventory all exported visual primitives and variants before redesigning.
- Preserve reusable image loading, fallback, shape, fit, overlay, ratio, and presentation behaviours.
- Decouple from app model types and URL conventions.
- Ensure meaningful alt-text rules and decorative-image support.
- Use token-based surfaces and borders.
- Split a generic `Visual`, `VisualImage`, or media-frame primitive from domain-specific compositions.

### 3. Toolbar, toolbox, and action family — highest priority

Source candidates:

- `#118 resources/js/components/actions/bulk-toolbar.tsx`
- `#119 resources/js/components/actions/bulk.ts`
- `#120 resources/js/components/actions/index.tsx`
- `#278 resources/js/components/ui/toolbox.tsx`

Expected registry direction:

- Build a general `ActionMenu`/`Actions` component supporting row and toolbar modes.
- Retain nested actions, disabled state, visibility, danger styling, icons, tooltips, and event propagation control.
- Remove action-name heuristics as the primary source of icons; explicit icons should be preferred. Fallback icon inference may remain optional.
- Build `BulkToolbar` as a controlled component receiving selection count and actions.
- Generalize `Toolbox` into composable `Toolbox`, `ToolboxGroup`, `ToolboxItem`, and separator/label pieces.
- Keep export/download behaviour in opt-in utilities rather than embedding it into visual components.

### 4. Overlap family — highest priority

Source candidates:

- `#192 resources/js/components/overlap/index.tsx`
- `#193 resources/js/components/overlap/item.tsx`
- `#194 resources/js/components/overlap/overlap.tsx`
- `#195 resources/js/components/overlap/peek-dots.tsx`

Expected registry direction:

- Preserve polymorphic item and stack behaviour.
- Support avatars, icons, badges, thumbnails, and arbitrary children.
- Preserve controlled overlap spacing, direction, z-order, maximum visible count, and overflow representation.
- Treat `PeekDots` as an overflow indicator or integrate it as a slot.
- Ensure focus rings and pointer targets remain visible when items overlap.
- Consider naming the registry item `overlap-stack`.

### 5. Data table family — highest priority

Source candidates:

- `#218 resources/js/components/table/components.tsx`
- `#219 resources/js/components/table/date-text.tsx`
- `#220 resources/js/components/table/hooks.ts`
- `#221 resources/js/components/table/index.tsx`
- `#222 resources/js/components/table/permission-sync.tsx`
- `#223 resources/js/components/table/table-utils.ts`
- `#224 resources/js/components/table/types.ts`
- `#225 resources/js/components/table/utils.tsx`
- `#273 resources/js/components/ui/table.tsx` as the shadcn base

Expected registry direction:

- Separate generic table rendering from permission, route, and application concerns.
- Prefer TanStack Table only when the features justify the dependency; otherwise preserve a lightweight declarative column API.
- Support row selection, bulk selection, pagination, sticky columns, visibility controls, empty/loading/error states, custom cells, row actions, responsive overflow, and optional spaced-row presentation.
- Make server-side pagination and sorting controlled through callbacks.
- Do not fetch data internally.
- Package date display as a separate `date-text` item when it is independently useful.
- Convert `ActionColumn` into composition with the action family rather than a table-specific business helper.

### 6. Dialog and modal orchestration — highest priority

Source candidates:

- `#154 resources/js/components/dialog/create-modal.tsx`
- `#155 resources/js/components/dialog/DialogProvider.tsx`
- `#156 resources/js/components/dialog/dialogStore.ts`
- `#157 resources/js/components/dialog/types.ts`
- `#246 resources/js/components/ui/dialog.tsx`
- `#252 resources/js/components/ui/headless-responsive-dialog.tsx`

Expected registry direction:

- Preserve the valuable programmatic dialog registry pattern.
- Remove app permission checks, route assumptions, and model-specific payloads from the core.
- Support typed dialog IDs through module augmentation or a user-provided map.
- Support modal result promises, controlled closing, responsive dialog/sheet presentation, title/description, footer, size, and content overrides.
- Keep the Radix/shadcn dialog primitive as the accessibility foundation.
- Consider separate items: `dialog-manager`, `create-dialog`, and `responsive-dialog`.

### 7. Page shell and admin layout primitives

Source candidates:

- `#625 resources/js/pages/partials/admin/components/analytics-header.tsx`
- `#626 resources/js/pages/partials/admin/components/page-content.tsx`
- `#627 resources/js/pages/partials/admin/components/page-header.tsx`
- `#628 resources/js/pages/partials/admin/components/page-wrapper.tsx`
- `#756 resources/js/partials/components/analytics-header.tsx`
- `#757 resources/js/partials/components/page-content.tsx`
- `#758 resources/js/partials/components/page-header.tsx`
- `#759 resources/js/partials/components/page-wrapper.tsx`

The duplicated paths indicate generated or copied variants. Compare the authoritative ranges and consolidate into one portable page-shell family.

Expected registry direction: `Page`, `PageHeader`, `PageTitle`, `PageDescription`, `PageActions`, `PageContent`, and an optional `AnalyticsHeader`.

### 8. Sidebar manager and detail drawers

- `#209 resources/js/components/sidebar/create-sidebar.tsx`
- `#210 resources/js/components/sidebar/SidebarHost.tsx`
- `#211 resources/js/components/sidebar/SidebarProvider.tsx`
- `#212 resources/js/components/sidebar/sidebars.ts`
- `#213 resources/js/components/sidebar/types.ts`
- `#214–#216` are application-specific admin sidebar examples and should become demos or reference compositions, not generic primitives.

Preserve typed programmatic opening, result handling, side selection, size, and payload support. Remove order/payment/transaction coupling from the core.

### 9. Conditional and asynchronous state

- `#201 resources/js/components/renderif.tsx`
- `#249 resources/js/components/ui/empty.tsx`
- `#268 resources/js/components/ui/skeleton.tsx`

Design a coherent family for empty, loading, error, permission-denied, and resolved states. Avoid vague truthiness rules that treat valid values such as `0` as empty unless explicitly configured.

### 10. Enhanced tabs

- `#231 resources/js/components/ui/app-tabs.tsx`
- `#274 resources/js/components/ui/tabs.tsx`

Consolidate the enhanced admin-facing tabs on top of the base Radix/shadcn tabs. Preserve controlled/uncontrolled operation, lazy panels, counts/badges, actions, responsive overflow, and URL synchronization only through optional adapters.

### 11. Select and combobox family

- `#202 resources/js/components/select/ComboboxSelect.tsx`
- `#203 resources/js/components/select/DataMultiSelect.tsx`
- `#204 resources/js/components/select/DataSelect.tsx`
- `#205 resources/js/components/select/select-types.ts`

Remove implicit data fetching from generic selects. Support grouped options, custom rendering, searchable options, clearable values, single/multiple selection, async adapters, empty/loading states, and controlled values.

### 12. Button extension family

- `#131–#139 resources/js/components/button/*`
- `#236 resources/js/components/ui/button.tsx`
- `#270 resources/js/components/ui/smart-button.tsx`

Do not publish nine loosely related button items without a coherent strategy. Keep base button compatibility and selectively promote useful patterns: form/loading button, split button, status button, reveal button, speed dial, pill, and tool button. Avoid duplicating Radix toggle, dropdown, or tooltip behaviour.

## Complete root component inventory

The trace index contains **176 files under `resources/js/components/`**. Every file below must be classified before the migration is considered complete.

### Actions (3)

- `#118 resources/js/components/actions/bulk-toolbar.tsx`
- `#119 resources/js/components/actions/bulk.ts`
- `#120 resources/js/components/actions/index.tsx`

### Button (9)

- `#131 resources/js/components/button/dial.tsx`
- `#132 resources/js/components/button/form-button.tsx`
- `#133 resources/js/components/button/index.ts`
- `#134 resources/js/components/button/pill.tsx`
- `#135 resources/js/components/button/reveal.tsx`
- `#136 resources/js/components/button/speedial.tsx`
- `#137 resources/js/components/button/split-button.tsx`
- `#138 resources/js/components/button/status-button.tsx`
- `#139 resources/js/components/button/tool.tsx`

### Card (4)

- `#140 resources/js/components/card/icon-card.tsx`
- `#141 resources/js/components/card/index.tsx`
- `#142 resources/js/components/card/paper.tsx`
- `#143 resources/js/components/card/smart-card.tsx`

### Charts (8)

- `#144 resources/js/components/charts/category-chart-widget.tsx`
- `#145 resources/js/components/charts/chart-utils.ts`
- `#146 resources/js/components/charts/funnel-chart-widget.tsx`
- `#147 resources/js/components/charts/index.ts`
- `#148 resources/js/components/charts/time-series-chart-widget.tsx`
- `#149 resources/js/components/charts/types.ts`
- `#150 resources/js/components/charts/use-chart-data.ts`
- `#151 resources/js/components/charts/use-live-refresh.ts`

### Cms (1)

- `#152 resources/js/components/cms/puck-body-renderer.tsx`

### Dialog (4)

- `#154 resources/js/components/dialog/create-modal.tsx`
- `#155 resources/js/components/dialog/DialogProvider.tsx`
- `#156 resources/js/components/dialog/dialogStore.ts`
- `#157 resources/js/components/dialog/types.ts`

### Dropdown (2)

- `#158 resources/js/components/dropdown/index.tsx`
- `#159 resources/js/components/dropdown/types.ts`

### Feed (10)

- `#160 resources/js/components/feed/flash-feed.tsx`
- `#161 resources/js/components/feed/message-feed.tsx`
- `#162 resources/js/components/feed/renderers/flash-banner-renderer.tsx`
- `#163 resources/js/components/feed/renderers/flash-dialog-renderer.tsx`
- `#164 resources/js/components/feed/renderers/flash-renderer.tsx`
- `#165 resources/js/components/feed/renderers/message-renderer.tsx`
- `#166 resources/js/components/feed/renderers/parts/message-action.tsx`
- `#167 resources/js/components/feed/renderers/parts/message-icon.tsx`
- `#168 resources/js/components/feed/renderers/parts/message-line.tsx`
- `#169 resources/js/components/feed/renderers/parts/message-lines.tsx`

### Global Search (4)

- `#170 resources/js/components/global-search/provider.tsx`
- `#171 resources/js/components/global-search/registry.tsx`
- `#172 resources/js/components/global-search/search-params.ts`
- `#173 resources/js/components/global-search/types.ts`

### Icons (2)

- `#177 resources/js/components/icons/deposit.tsx`
- `#178 resources/js/components/icons/orders.tsx`

### Info (2)

- `#180 resources/js/components/info/descriptor.tsx`
- `#181 resources/js/components/info/index.tsx`

### Notifications (4)

- `#188 resources/js/components/notifications/notification-popover.tsx`
- `#189 resources/js/components/notifications/notification-sidebar.tsx`
- `#190 resources/js/components/notifications/template-builder-core.tsx`
- `#191 resources/js/components/notifications/utils.ts`

### Overlap (4)

- `#192 resources/js/components/overlap/index.tsx`
- `#193 resources/js/components/overlap/item.tsx`
- `#194 resources/js/components/overlap/overlap.tsx`
- `#195 resources/js/components/overlap/peek-dots.tsx`

### Plugins (1)

- `#197 resources/js/components/plugins/card.tsx`

### Policies (1)

- `#198 resources/js/components/policies/policy-editor.tsx`

### Receipts (1)

- `#200 resources/js/components/receipts/receipt-view-modal.tsx`

### Root-level files (29)

- `#121 resources/js/components/app-content.tsx`
- `#122 resources/js/components/app-header.tsx`
- `#123 resources/js/components/app-logo-icon.tsx`
- `#124 resources/js/components/app-logo.tsx`
- `#125 resources/js/components/app-shell.tsx`
- `#126 resources/js/components/app-sidebar-header.tsx`
- `#127 resources/js/components/app-sidebar.tsx`
- `#128 resources/js/components/appearance-dropdown.tsx`
- `#129 resources/js/components/appearance-tabs.tsx`
- `#130 resources/js/components/breadcrumbs.tsx`
- `#153 resources/js/components/delete-user.tsx`
- `#174 resources/js/components/heading-small.tsx`
- `#175 resources/js/components/heading.tsx`
- `#176 resources/js/components/icon.tsx`
- `#179 resources/js/components/infinite-scroller.tsx`
- `#182 resources/js/components/input-error.tsx`
- `#183 resources/js/components/money.tsx`
- `#184 resources/js/components/mosiac-scroller.tsx`
- `#185 resources/js/components/nav-footer.tsx`
- `#186 resources/js/components/nav-main.tsx`
- `#187 resources/js/components/nav-user.tsx`
- `#196 resources/js/components/paginator.tsx`
- `#199 resources/js/components/popover.tsx`
- `#201 resources/js/components/renderif.tsx`
- `#226 resources/js/components/text-link.tsx`
- `#227 resources/js/components/text.tsx`
- `#280 resources/js/components/user-info.tsx`
- `#281 resources/js/components/user-menu-content.tsx`
- `#282 resources/js/components/utils.tsx`

### Select (4)

- `#202 resources/js/components/select/ComboboxSelect.tsx`
- `#203 resources/js/components/select/DataMultiSelect.tsx`
- `#204 resources/js/components/select/DataSelect.tsx`
- `#205 resources/js/components/select/select-types.ts`

### Services (3)

- `#206 resources/js/components/services/promotion.ts`
- `#207 resources/js/components/services/service-card.tsx`
- `#208 resources/js/components/services/service-preview-dialog.tsx`

### Sidebar (5)

- `#209 resources/js/components/sidebar/create-sidebar.tsx`
- `#210 resources/js/components/sidebar/SidebarHost.tsx`
- `#211 resources/js/components/sidebar/SidebarProvider.tsx`
- `#212 resources/js/components/sidebar/sidebars.ts`
- `#213 resources/js/components/sidebar/types.ts`

### Sidebars (3)

- `#214 resources/js/components/sidebars/admin-order-summary-sidebar.tsx`
- `#215 resources/js/components/sidebars/admin-payment-session-sidebar.tsx`
- `#216 resources/js/components/sidebars/admin-transaction-sidebar.tsx`

### Site (1)

- `#217 resources/js/components/site/site-script-injector.tsx`

### Table (8)

- `#218 resources/js/components/table/components.tsx`
- `#219 resources/js/components/table/date-text.tsx`
- `#220 resources/js/components/table/hooks.ts`
- `#221 resources/js/components/table/index.tsx`
- `#222 resources/js/components/table/permission-sync.tsx`
- `#223 resources/js/components/table/table-utils.ts`
- `#224 resources/js/components/table/types.ts`
- `#225 resources/js/components/table/utils.tsx`

### Ui (52)

- `#228 resources/js/components/ui/accordion.tsx`
- `#229 resources/js/components/ui/alert-dialog.tsx`
- `#230 resources/js/components/ui/alert.tsx`
- `#231 resources/js/components/ui/app-tabs.tsx`
- `#232 resources/js/components/ui/aspect-ratio.tsx`
- `#233 resources/js/components/ui/avatar.tsx`
- `#234 resources/js/components/ui/badge.tsx`
- `#235 resources/js/components/ui/breadcrumb.tsx`
- `#236 resources/js/components/ui/button.tsx`
- `#237 resources/js/components/ui/calendar.tsx`
- `#238 resources/js/components/ui/card.tsx`
- `#239 resources/js/components/ui/chart.tsx`
- `#240 resources/js/components/ui/checkbox.tsx`
- `#241 resources/js/components/ui/collapsible.tsx`
- `#242 resources/js/components/ui/color-picker.tsx`
- `#243 resources/js/components/ui/command.tsx`
- `#244 resources/js/components/ui/context-menu.tsx`
- `#245 resources/js/components/ui/date-picker.tsx`
- `#246 resources/js/components/ui/dialog.tsx`
- `#247 resources/js/components/ui/donut.tsx`
- `#248 resources/js/components/ui/dropdown-menu.tsx`
- `#249 resources/js/components/ui/empty.tsx`
- `#250 resources/js/components/ui/file-uploader.tsx`
- `#251 resources/js/components/ui/flex.tsx`
- `#252 resources/js/components/ui/headless-responsive-dialog.tsx`
- `#253 resources/js/components/ui/icon.tsx`
- `#254 resources/js/components/ui/input-otp.tsx`
- `#255 resources/js/components/ui/input.tsx`
- `#256 resources/js/components/ui/label.tsx`
- `#257 resources/js/components/ui/navigation-menu.tsx`
- `#258 resources/js/components/ui/placeholder-pattern.tsx`
- `#259 resources/js/components/ui/popover.tsx`
- `#260 resources/js/components/ui/progress.tsx`
- `#261 resources/js/components/ui/resizable.tsx`
- `#262 resources/js/components/ui/rich-editor.tsx`
- `#263 resources/js/components/ui/scroll-area.tsx`
- `#264 resources/js/components/ui/select.tsx`
- `#265 resources/js/components/ui/separator.tsx`
- `#266 resources/js/components/ui/sheet.tsx`
- `#267 resources/js/components/ui/sidebar.tsx`
- `#268 resources/js/components/ui/skeleton.tsx`
- `#269 resources/js/components/ui/slider.tsx`
- `#270 resources/js/components/ui/smart-button.tsx`
- `#271 resources/js/components/ui/stepper.tsx`
- `#272 resources/js/components/ui/switch.tsx`
- `#273 resources/js/components/ui/table.tsx`
- `#274 resources/js/components/ui/tabs.tsx`
- `#275 resources/js/components/ui/textarea.tsx`
- `#276 resources/js/components/ui/toggle-group.tsx`
- `#277 resources/js/components/ui/toggle.tsx`
- `#278 resources/js/components/ui/toolbox.tsx`
- `#279 resources/js/components/ui/tooltip.tsx`

### Visual (2)

- `#283 resources/js/components/visual/image.tsx`
- `#284 resources/js/components/visual/index.tsx`

### Widgets (9)

- `#285 resources/js/components/widgets/analytics.tsx`
- `#286 resources/js/components/widgets/data-viewer/index.tsx`
- `#287 resources/js/components/widgets/data-viewer/row.tsx`
- `#288 resources/js/components/widgets/data-viewer/utils.ts`
- `#289 resources/js/components/widgets/forti-process-progress.tsx`
- `#290 resources/js/components/widgets/index.ts`
- `#291 resources/js/components/widgets/plugin-process-window.tsx`
- `#292 resources/js/components/widgets/process-widget.tsx`
- `#293 resources/js/components/widgets/settings-form.tsx`

## Domain-specific component systems outside `resources/js/components/`

These are not automatic registry candidates. Review them for generic subcomponents, demos, or composition patterns:

### `resources/js/actions/finance-receipts/receipt-builder/components/` (6)

- `#28 resources/js/actions/finance-receipts/receipt-builder/components/ReceiptBlockRenderer.tsx`
- `#29 resources/js/actions/finance-receipts/receipt-builder/components/ReceiptBuilderLayout.tsx`
- `#30 resources/js/actions/finance-receipts/receipt-builder/components/ReceiptBuilderModal.tsx`
- `#31 resources/js/actions/finance-receipts/receipt-builder/components/ReceiptInspectorPanel.tsx`
- `#32 resources/js/actions/finance-receipts/receipt-builder/components/ReceiptLeftNav.tsx`
- `#33 resources/js/actions/finance-receipts/receipt-builder/components/ReceiptPaperPreview.tsx`

### `resources/js/actions/plugin/components/` (4)

- `#70 resources/js/actions/plugin/components/logs.tsx`
- `#71 resources/js/actions/plugin/components/parts.tsx`
- `#72 resources/js/actions/plugin/components/permission-accordion.tsx`
- `#73 resources/js/actions/plugin/components/settings-header.tsx`

### `resources/js/actions/user/components/` (1)

- `#111 resources/js/actions/user/components/panel.tsx`

### `resources/js/pages/partials/admin/components/` (4)

- `#625 resources/js/pages/partials/admin/components/analytics-header.tsx`
- `#626 resources/js/pages/partials/admin/components/page-content.tsx`
- `#627 resources/js/pages/partials/admin/components/page-header.tsx`
- `#628 resources/js/pages/partials/admin/components/page-wrapper.tsx`

### `resources/js/pages/partials/admin/guest/components/` (6)

- `#634 resources/js/pages/partials/admin/guest/components/classic-triangle-svg.tsx`
- `#635 resources/js/pages/partials/admin/guest/components/dashes-svg.tsx`
- `#636 resources/js/pages/partials/admin/guest/components/globe.tsx`
- `#637 resources/js/pages/partials/admin/guest/components/icons.tsx`
- `#638 resources/js/pages/partials/admin/guest/components/jet.tsx`
- `#639 resources/js/pages/partials/admin/guest/components/quotes.tsx`

### `resources/js/partials/components/` (4)

- `#756 resources/js/partials/components/analytics-header.tsx`
- `#757 resources/js/partials/components/page-content.tsx`
- `#758 resources/js/partials/components/page-header.tsx`
- `#759 resources/js/partials/components/page-wrapper.tsx`

### `resources/js/partials/guest/components/` (6)

- `#765 resources/js/partials/guest/components/classic-triangle-svg.tsx`
- `#766 resources/js/partials/guest/components/dashes-svg.tsx`
- `#767 resources/js/partials/guest/components/globe.tsx`
- `#768 resources/js/partials/guest/components/icons.tsx`
- `#769 resources/js/partials/guest/components/jet.tsx`
- `#770 resources/js/partials/guest/components/quotes.tsx`

### `resources/js/services/notifications/components/` (19)

- `#794 resources/js/services/notifications/components/ActionBuilder.tsx`
- `#795 resources/js/services/notifications/components/CssEditor.tsx`
- `#796 resources/js/services/notifications/components/FlashActionsBuilder.tsx`
- `#797 resources/js/services/notifications/components/FlashCloseBuilder.tsx`
- `#798 resources/js/services/notifications/components/FlashIconBuilder.tsx`
- `#799 resources/js/services/notifications/components/FlashTitleBuilder.tsx`
- `#800 resources/js/services/notifications/components/FlashUiBuilder.tsx`
- `#801 resources/js/services/notifications/components/FlashVariantBuilder.tsx`
- `#802 resources/js/services/notifications/components/IconBuilder.tsx`
- `#803 resources/js/services/notifications/components/index.ts`
- `#804 resources/js/services/notifications/components/InspectSection.tsx`
- `#805 resources/js/services/notifications/components/LineBuilder.tsx`
- `#806 resources/js/services/notifications/components/MailBuilder.tsx`
- `#807 resources/js/services/notifications/components/MessageActionsBuilder.tsx`
- `#808 resources/js/services/notifications/components/MessageExtrasBuilder.tsx`
- `#809 resources/js/services/notifications/components/MessageHeaderBuilder.tsx`
- `#810 resources/js/services/notifications/components/MessagePropsBuilder.tsx`
- `#811 resources/js/services/notifications/components/PushBuilder.tsx`
- `#812 resources/js/services/notifications/components/SmsBuilder.tsx`

Important domain systems include the receipt builder, plugin panels, notification-template builders, order panels, KYC builders, ticket-field builders, and workspace services. Extract only genuinely generic pieces; retain complete domain workflows as examples or leave them in the source application.

## Base shadcn primitives already present

The `resources/js/components/ui/` folder contains base or extended shadcn primitives. Before creating a new registry item, compare against the current upstream shadcn implementation and determine whether the traced file is: unchanged, lightly customized, materially extended, or obsolete.

Do not republish unchanged upstream primitives under new names. Registry value should come from meaningful extensions, composition, tokens, accessibility, or workflow improvements.

## Application couplings that must be removed or injected

- Laravel Ziggy `route(...)`.
- Inertia adapters and page props.
- `window.axios` and internally fixed endpoints.
- `database/prisma` model imports.
- `@timeax/form-palette` fields unless building an explicit adapter item.
- Project permission contexts and guard enums.
- Project-specific status enums and colour maps.
- `react-icons` as an unavoidable dependency; public APIs should accept `ReactNode` icons. Demos may use Lucide icons.
- Application CSS classes and undocumented tokens such as `app-card`, `app-card--inset`, or `bg-card-inner`.
- Global browser side effects, downloads, clipboard operations, or live-event subscriptions embedded in presentation components.
- Domain nouns such as DGP service, lab, order, payment session, plugin, permission, or account in otherwise generic primitives.

## Required work process for every component

1. Identify the source item from the trace index.
2. Read only its declared range and the ranges of direct dependencies needed to understand it.
3. Search declared admin-page ranges for representative usages.
4. Document useful behaviours, weak behaviours, app couplings, and duplicated concepts.
5. Decide promote/consolidate/split/adapt/reference/reject.
6. Define a registry-neutral API before writing code.
7. Implement under `registry/new-york/<item>/`.
8. Add a realistic demo covering common and edge states.
9. Add the registry item definition with correct dependencies and all files.
10. Build the registry and verify generated output under `public/r/`.
11. Test installation into a clean consumer app.
12. Record the source trace IDs and migration decisions in the pull request or migration notes.

## Component API requirements

Every public component should satisfy these rules where applicable:

- Controlled and uncontrolled modes are clearly separated.
- Callback names describe events, not business commands.
- Props do not expose internal application models.
- `className` is supported at the root; significant slots may expose `classNames` or slot props.
- Native element props are forwarded where sensible.
- Refs reach the meaningful DOM element.
- Variants use `class-variance-authority` only when it improves consistency.
- Boolean props are not overloaded with several meanings.
- Compound components expose explicit regions instead of guessing child order.
- Loading and disabled states are distinct.
- Destructive actions are visibly and semantically distinguished.
- Empty arrays, zero values, and empty strings are handled intentionally.
- Async callbacks handle rejected promises without leaving permanent loading state.

## Accessibility acceptance criteria

- All interactive controls are keyboard reachable.
- Icon-only actions have accessible names.
- Dialogs have title and description semantics or an explicit documented opt-out.
- Dropdowns, popovers, selects, tabs, and tooltips use accessible primitives.
- Focus is restored after overlays close.
- Overlapping interactive items retain usable focus outlines and hit areas.
- Tables expose meaningful headers and selection labels.
- Images require useful `alt` text unless marked decorative.
- Colour is never the sole status indicator.
- Motion respects `prefers-reduced-motion`.

## Styling and token acceptance criteria

- Use semantic tokens: `background`, `foreground`, `card`, `muted`, `accent`, `destructive`, `border`, `ring`, and documented extension tokens only.
- No hardcoded project brand palettes in reusable source.
- New extension tokens must include light and dark defaults.
- Components must remain usable without the original application stylesheet.
- Avoid arbitrary z-index escalation; document overlay layering when needed.
- Prefer responsive layouts that work from narrow admin drawers to full pages.

## Testing expectations

At minimum, verify:

- TypeScript compilation.
- Registry build generation.
- Clean installation through the shadcn CLI.
- Keyboard and focus behaviour for interactive components.
- Controlled and uncontrolled state where supported.
- Empty, loading, error, disabled, and destructive states.
- Light and dark themes.
- Mobile/narrow layouts.
- Ref forwarding and native prop forwarding.
- No undeclared imports after installation.

Prefer focused tests for behavioural components such as dialog managers, table selection, action menus, responsive overlays, and async selects.

## Registry item definition template

```json
{
  "name": "component-name",
  "type": "registry:ui",
  "title": "Component Name",
  "description": "A reusable description of the component.",
  "registryDependencies": ["button"],
  "dependencies": ["@radix-ui/react-dialog"],
  "files": [
    {
      "path": "registry/new-york/component-name/component-name.tsx",
      "type": "registry:ui"
    }
  ]
}
```

Only include dependency arrays that are actually needed.

## Deliverables for a component task

When asked to create or migrate a component, provide:

1. Final registry file path.
2. Full component code.
3. Demo/example file when useful.
4. Registry item entry.
5. Required CSS or token additions.
6. `registryDependencies`.
7. npm/Radix `dependencies`.
8. Brief migration notes identifying preserved behaviour and removed app coupling.

## Recommended implementation phases

### Phase 1 — Admin foundation

1. `smart-card` / card family
2. `visual` / image family
3. `actions` and `bulk-toolbar`
4. `overlap-stack`
5. `toolbox`
6. `data-table`
7. `dialog-manager` and `responsive-dialog`
8. `page-shell`

### Phase 2 — Common admin controls

1. enhanced tabs
2. async combobox/select
3. sidebar manager
4. empty/loading/error state family
5. date text and money display
6. pagination and infinite scrolling
7. info/descriptor components

### Phase 3 — Dashboards and advanced composition

1. analytics cards and chart widgets
2. data viewer
3. global search
4. feed/message renderers
5. settings screen
6. process/progress widgets

### Phase 4 — Selective domain extraction

Review receipt-builder, notification-builder, policy-editor, KYC-builder, ticket-builder, plugin, and order-panel systems for small generic pieces. Do not move complete business workflows into `registry:ui` merely to increase component count.

## Definition of done for the overall migration

- Every root component file in the complete inventory has a documented classification.
- High-frequency admin foundations have registry-ready replacements.
- Card, visual, toolbar/toolbox, overlap, table, dialog, page-shell, sidebar, and state families are explicitly addressed.
- Duplicate implementations are consolidated.
- Generic components contain no Laravel, Inertia, Prisma, Axios-global, or application-route coupling.
- Registry metadata is complete and generated output builds successfully.
- Components install into a clean app without manual repair.
- The resulting API is coherent enough that new admin pages can be composed primarily from registry items rather than app-local wrappers.

## Final guidance

Preserve the strongest ideas from the original project, especially its admin composition patterns. However, prefer a smaller set of polished, interoperable component families over a large number of narrowly named ports. The registry should feel deliberately designed, not mechanically extracted.
