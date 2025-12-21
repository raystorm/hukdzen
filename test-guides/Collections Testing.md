# 📚 Collections Testing Checklist

## 📦 Collection Creation
- [ ] Create a new collection inside a box
  - [ ] Requires, Box, and Title.
  - [ ] Box is Selectable on Creation
- [ ] `id` is a unique GUID
- [ ] Title fields (`eng_title`, `bc_title`, `ak_title`) accept input and allow special characters/diacritics
- [ ] Descriptions (`eng_description`, `bc_description`, `ak_description`) optional but saved correctly
- [ ] `collectionOwner` set to current user
- [ ] `collectionBoxId` references containing box
- [ ] `created` and `createdAt` timestamps populated
- [ ] `updated` and `updatedAt` update correctly after edits
- [ ] Circular references prevented (A → B → C but not → A)

## 🌐 Translator (BC ↔ AK)
- [ ] Translator available for titles and descriptions
- [ ] `bc_title` → `ak_title` translation works
- [ ] `ak_title` → `bc_title` translation works
- [ ] `bc_description` → `ak_description` translation works
- [ ] `ak_description` → `bc_description` translation works
- [ ] Special characters, diacritics, Smalgyax script preserved
- [ ] Error message shown if translation fails
- [ ] Notifications shown after successful translation
- **TODO** add translation values based on Translator unit tests

## 📂 Adding Documents to Collections
- [ ] `items` list stores document IDs
- [ ] UI filters only show documents from same box
- [ ] Documents from other boxes not visible in add-document dialog
- [ ] Adding multiple documents works consistently
- [ ] Notifications shown after successful addition

## 🔄 Moving Collections Between Boxes
- [ ] Only empty collections (no documents, no sub-collections) can be moved
- [ ] When moved, `collectionBoxId` updates to new box
- [ ] Collection removed from any parent collections in old box
- [ ] Parent collections update immediately in UI
- [ ] Notifications shown after successful move
- [ ] Error message shown if move fails

## 📤 Moving Documents Between Boxes
- [ ] Document moved to different box automatically removed from collections in original box
- [ ] Other collection items remain intact
- [ ] Notifications shown after successful move
- [ ] Error message shown if move fails

## 🧩 Nested Collections
- [ ] Collections can contain other collections via `items` referencing collection IDs
- [ ] No circular references allowed
- [ ] Removing/moving nested collections behaves consistently
- [ ] Moving an empty nested collection removes it from parent collections

## 📄 Document Versioning
- [ ] Uploading new version updates `version` field and file reference
- [ ] `documentID` remains unchanged
- [ ] Collections referencing document remain valid after versioning
- [ ] Notifications shown after successful version update

## 🔔 Notifications & Feedback
- [ ] Success message after creating, adding, moving, or translating collections/documents
- [ ] Error message for invalid operations (circular reference, non-empty move, translation failure)
- [ ] Clear feedback for unsupported actions

## ❗ Error Handling
- [ ] Graceful handling of invalid references in `items`
- [ ] No silent failures when constraints violated
- [ ] Predictable behavior with unusual metadata