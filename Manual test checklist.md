# ✅ Manual Testing Checklists for Amplify/React Document App

---

## 🔐 Authentication & First-Time Modal

### 🆕 Sign Up (Email or Social)
- [ ] Triggered by:
    - [ ] Clicking “Login” in the top menu
    - [ ] Navigating to a secure page while unauthenticated
- [ ] Options:
    - [ ] Email/password sign-up
    - [ ] Social sign-up via Facebook, Google, or Amazon
- [ ] Email flow:
    - [ ] Enter email and password
    - [ ] Receive and enter confirmation code and/or validation link
    - [ ] Cognito enforces password strength (default)
- [ ] Social flow:
    - [ ] Authenticate via provider
    - [ ] Redirects back to app

### 🔑 Sign In
- [ ] Accessible via login page
- [ ] Accessible via Any Secured Page: Dashboard, Uplpoad, Etc
- [ ] Supports email/password and social login
- [ ] Error messages for incorrect credentials
- [ ] Redirects back to login message page or intended page

### 🔐 Password Reset Flow
- [ ] "Forgot Password" link works
- [ ] Receive password reset email
- [ ] Reset link works and expires appropriately
- [ ] Can set new password successfully

### 🧾 First-Time Modal Dialog
- [ ] Shown after first successful sign-in
- [ ] Collects missing profile fields (e.g., Name, Email, Waa, Clan)
- [ ] Enforces Required Fields: Name, Email
- [ ] Validates input and submits
- [ ] Dismisses and redirects

### 🚪 Sign Out
- [ ] Available in top menu, User Icon -> Logout
- [ ] Ends session and redirects to public view
- [ ] Hides authenticated-only features (Removal of User Icon in Top Menu)

### 🔔 Notifications & Feedback
- [ ] Success message after login or profile setup
- [ ] Error message for failed login or invalid input

### ❗ Error Handling
- [ ] Graceful handling of auth failures
- [ ] Clear messaging for missing fields or invalid credentials

### ♿ Accessibility & Language
- [ ] Keyboard accessible
- [ ] Clear in English and/or Smalgyax
- [ ] Screen reader compatible

---

## 👤 Profile Editing

### 🧾 First-Time Modal
- [ ] Shown after first sign-in
- [ ] Collects missing profile fields
- [ ] Enforces Required Fields: Name, Email
- [ ] Validates and submits

### 🛠️ Editing Profile
- [ ] Accessible via “Profile” link
- [ ] Editable fields: name, waa, clan
- [ ] Read-only fields (e.g., email) are clearly disabled or not changeable
- [ ] Email is currently editable, but not synced to Cognito

> ⚠️ Developer Note: Email is editable but not synced to Cognito.
> Eventually plan to make it read-only or sync changes.

### 🔔 Notifications & Feedback
- [ ] Success message after saving changes
- [ ] Error message for invalid input

### ❗ Error Handling
- [ ] Graceful handling of empty or invalid fields
- [ ] No silent failure

### ♿ Accessibility & Language
- [ ] Keyboard accessible
- [ ] Clear in English and/or Smalgyax

---

## 🧑‍🏫 Author Management

### ➕ Adding a New Author
- [ ] Via Authors page or inline during document editing
- [ ] Modal form appears, during inline
- [ ] Page when using Authors page
- [ ] Form validates input
- [ ] Author added and selectable

### ✏️ Editing Author
- [ ] Form pre-fills
- [ ] Updates reflected

### 🚫 Deletion
- [ ] No delete option (intentional)

### 🔔 Notifications & Feedback
- [ ] Success message after adding/editing
- [ ] Error message for duplicate or invalid input

### ❗ Error Handling
- [ ] Duplicate detection
- [ ] Graceful handling of missing fields

### ♿ Accessibility & Language
- [ ] Labels/buttons clear in English/Smalgyax
- [ ] Fully keyboard navigable

---

## 📄 Document Editing Edge

### 📄 Document Editing Edge Cases
- [ ] Edit document metadata after upload
- [ ] Cancel editing returns to previous state
- [ ] Multiple browser tabs don't conflict


---
## 📄 Document Upload & Versioning

### 🛤️ Upload via Upload Page
- [ ] Select file and fill metadata
- [ ] Add author inline
- [ ] Smalgyax filenames handled

### 🛤️ Upload New Version
- [ ] Use “Upload New Version” in edit form
- [ ] Original file replaced
- [ ] Preview updates

### 🚫 Duplicate Detection
- [ ] Duplicate blocked
- [ ] Error message is clear and easy to understand

### 🔔 Notifications & Feedback
- [ ] Success message after upload
- [ ] Error message for duplicate or failed upload

### ❗ Error Handling
- [ ] No unsupported file types (currently)
- [ ] No corruption validation
- [ ] Preview failure handled gracefully

### ♿ Accessibility & Language
- [ ] Keyboard accessible
- [ ] Clear in English and/or Smalgyax

---

## 👁️ Document Preview & Fallback

### ✅ Supported Files
- [ ] Preview opens correctly
- [ ] Multi-page navigation works, when docs like PDFs have multiple pages

### ❌ Unsupported/Broken Files
- [ ] No validation for corrupted files
- [ ] Fallback message shown if preview fails

> 🔧 Developer Note: Consider adding corruption detection or fallback messaging.

### 🧪 Edge Cases
- [ ] Large files
- [ ] Unusual encoding
- [ ] Smalgyax filenames/content

### 🔔 Notifications & Feedback
- [ ] Message shown when preview fails

### ❗ Error Handling
- [ ] Graceful fallback for unreadable files
- [ ] No silent failure

### ♿ Accessibility & Language
- [ ] Keyboard navigation
- [ ] Screen reader compatible

---

## 🔍 Search

### 🛤️ Top Menu Search
- [ ] Navigates to search page
- [ ] Term pre-populated

### 🛤️ Search Page Refinement
- [ ] Dropdown controls field vs keyword
- [ ] Accurate results
- [ ] Feedback for no matches

### 🖼️ Layout
- [ ] Split view: table left, details right
- [ ] Responsive layout
- [ ] Smalgyax metadata displays correctly

### 📚 Content-Based Search (OpenSearch Indexing)
- [ ] Text and Office documents indexed for full-text search
- [ ] Search matches document body content
- [ ] Unsupported files excluded from indexing

### 🔎 Smalgyax Document Content Search

- [ ] Can the tester search using **Smalgyax words and phrases**,
    - [ ] Special characters like `ł`, `g̱a̱`, `ü`, etc.
    - [ ] Words that **start with or contain apostrophes**, such as `'nii` or `g̱a'awnsk`
- [ ] Do matching documents appear in search results?
- [ ] Is the match **highlighted or surfaced clearly** in the UI?
- [ ] Are **diacritics and modifiers** preserved and searchable?
- [ ] Is there **no silent failure** — unsupported characters should still yield predictable behavior?

> 🔧 Developer Note: Ensure OpenSearch indexing and query parsing support
> Unicode normalization, diacritic handling, and apostrophe-aware tokenization for Smalgyax content.

### 🔔 Notifications & Feedback
- [ ] Feedback shown for no results
- [ ] Loading indicators during search

### ❗ Error Handling
- [ ] Graceful handling of malformed queries
- [ ] No silent failure

### ♿ Accessibility & Language
- [ ] Keyboard accessible
- [ ] Clear in English and/or Smalgyax

---

## 🗂️ Dashboard Browsing

### 🖼️ Layout
- [ ] Split view: “Recent Documents” table left, details right

### 📋 Table Behavior
- [ ] Click row to select
- [ ] Sorted by recent activity
- [ ] Paginated

### 📄 Detail Panel
- [ ] Empty when no selection
- [ ] Populates with document fields

### 🔔 Notifications & Feedback
- [ ] Feedback shown for empty or failed load

### ❗ Error Handling
- [ ] Graceful handling of missing or broken data

### ♿ Accessibility & Language
- [ ] Keyboard accessible
- [ ] Clear in English and/or Smalgyax

---

## 📦 Bucket Reassignment

### 🛤️ Via Dropdown
- [ ] Bucket dropdown visible in edit form
- [ ] Select new bucket and submit
- [ ] Document moves behind the scenes
- [ ] Appears in new bucket view

### 🔔 Notifications & Feedback
- [ ] Success message after reassignment
- [ ] Error message if move fails

### ❗ Error Handling
- [ ] Graceful handling of invalid bucket selection

### ♿ Accessibility & Language
- [ ] Keyboard accessible
- [ ] Clear in English and/or Smalgyax

---

## 💸 Donations (PayPal – Off-Site Flow)

### 🧭 Access
- [ ] “Donate” link in footer
- [ ] Accessible without authentication

### 🔘 PayPal Buttons
- [ ] Single Donation
- [ ] Recurring Donation
- [ ] Redirects to PayPal-hosted flow

### 🔔 Notifications & Feedback
- [ ] Confirmation before redirect
- [ ] Feedback if PayPal fails to load

### ❗ Error Handling
- [ ] Graceful fallback if PayPal fails

### ♿ Accessibility & Language
- [ ] Keyboard accessible
- [ ] Clear in English and/or Smalgyax

---

## ❗ Error Handling

### 🔐 Auth & Access
- [ ] Redirects unauthenticated users
- [ ] Graceful access denial

### 🌐 Network & Routing
- [ ] Friendly error messages
- [ ] 404 page with link back

---

## 🔔 Notifications & Feedback

### ⏳ Loading
- [ ] Spinner or progress indicator
- [ ] UI blocked to prevent duplicates

### 🧭 Navigation
- [ ] Redirects after actions
- [ ] Confirmation shown

### ♿ Accessibility
- [ ] Keyboard and screen reader accessible

---

## ♿ Accessibility

### 🔄 Browser Compatibility
- [ ] Works in Chrome, Firefox, Safari, Edge
- [ ] Back/forward browser buttons work correctly
- [ ] Bookmarking specific documents works
- [ ] Page refresh doesn't lose progress