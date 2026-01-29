🏘️ Village Maintenance
======================

A living, slow‑burning ledger of tasks, nudges, and long‑arc transformations.  
Not a backlog. Not a roadmap. Just the things we don’t want to lose.

---

🧹 Path Clearing (Code Hygiene)
-------------------------------
Small, low‑ceremony tasks that keep the village tidy.

- [ ] Remove commented‑out code in various modules
- [ ] Review and tighten doc comments across types and helpers
- [ ] Audit for stray console logs or debug helpers
- [ ] migrate from console to logger for logging
- [ ] Remove unused imports and dead code paths
- [ ] Standardize comment style and tone across modules
- [ ] find and fix code with `// @ts-ignore` comments
- [ ] Improve Error Message consistency
- [x] Add lightweight markdown formatting to AlertBar (links, bold, italics)

---

🛖 Structural Repairs (Architecture Alignment)
-----------------------------------------------
Medium‑sized shifts that realign the codebase with its intended shape.

- [ ] Replace individual `skipRender` implementations with the unified `useSkipRender` hook
- [ ] Migrate sagas to use `ResponseValidator` and `ResponseValidatorList` 
- [ ] Refactor helper types to isolate unfriendly complexity
- [ ] Move Items list to `NonNullable` ( items: T[] from items: (T | null)[] | null)
- [ ] Find and update instances of `any` or `unknown` to actual types where possible
- [ ] Align SES templates with IaC structure (prep work before migration)
- [ ] Check for and missing Doc comments on widely uses objects and functions
- [ ] Move Files and Folders to match Architectural Guidelines
      - [ ] Move files `src/__utils__/__fixtures__/` -> `src/__utils__/__setup__/` 
      - [ ] Move `src/data/` → `src/__utils__/__fixtures__/`
      - [ ] Move `src/__utils__/DocumentDetailsUtilities.ts` -> `src/Document/__tests__/Document.helpers.ts` 
      - [ ] Split the current `testUtilities.tsx` into focused modules and group them under a single domain.
            - [ ] Create `src/__utils__/test/` as the home for global test infrastructure
            - [ ] Move and split `testUtilities.tsx` into the following files:
                  - [ ] `render.tsx` — render pipeline (store/saga setup, providers, router, renderWith*)
                  - [ ] `LocationDisplay.tsx` — component used for router‑aware tests
                  - [ ] `ui.ts` — UI interaction helpers (arrowDown, enterKey, ctrlClick)
                  - [ ] `matchers.ts` — contains, startsWith, endsWith
                  - [ ] `debug.ts` — verify, verifyWaitFor, ಠ_ಠ
                  - [ ] Add `index.ts` barrel file for easy imports
      - [ ] Move `src/AlertBar/` → `src/globalUI/AlertBar/`
      - [ ] Move `src/components/shared/` → `src/globalUI/` (except:)
        - `AppRoutes.tsx` && `constants.ts` → `src/app/`
        - `ContentCard.tsx` && `ContentGrid.tsx` → `src/components/layout/`
      - [ ] Move `src/components/forms/` → distribute to domains or `src/pages/`
      - [ ] Move `src/components/hooks/` → distribute to domains
      - [ ] Move `src/components/widgets/` → distribute to domains (except: `AWSFileUploader.tsx`) 
      - [ ] Move `src/components/pages/` → `src/pages/`
      - [ ] Move `src/images/` → `src/assets/`
      - [ ] Move `src/utils/translator.*` → `src/Translator/` 
      - [ ] Move `src/docs` → `src/Documents/` 
      - [ ] Remove `src/ui-components/` (empty or unused)

*NOTE:* SES Templates refers to storing rich Templates in SES
instead of simple templates in the Lambda itself.

---

🌄 Village Migrations (Architectural North Stars)
-------------------------------------------------
The long‑arc transformations — the big moves that change how the village lives.

- [ ] Gen‑2 supporting work (transport, validators, metadata)
- [ ] Larger folder architecture realignment (domain boundaries, sovereignty)
- [ ] Consider adding AWS services (SNS, SQS, Step Functions, etc.)
- [ ] Add IL8N support across UI and content layers
- [ ] Rewrite GraphQL transport validator to enforce invariants cleanly
- [ ] Finalize sovereign error‑handling boundaries (printer, replacer, fallback logic)
- [ ] SES template migration to IaC (full transformation)
- [ ] Custom domain email (receive + reply as admin@smalgyax-files.org) — see `docs/future-custom-domain-email.md`

---

📜 Adaawx Amwaal (Story Treasures)
----------------------------------
Cultural, narrative, and philosophical notes that guide stewardship.

- [ ] Revisit metaphor choices in doc comments for cultural alignment
- [ ] Write README section on architecture boundaries and sovereignty
- [ ] Capture reasoning behind error‑handling boundaries
- [ ] Record decisions about folder naming, domain vocabulary, and contributor empathy
- [ ] Maintain notes on intentional workflow experiments
- [ ] Finish Developer Onboarding Documentation

---
