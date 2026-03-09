# Refactoring & Enhancement Plan

## 1. Code Refactoring & Organization
- [ ] Create `src/actions` directory for Server Actions.
- [ ] Move theme activation logic from `src/app/admin/themes/page.tsx` to `src/actions/theme-actions.ts`.
- [ ] Create `src/actions/email-actions.ts` for managing email templates.
- [ ] Ensure `src/lib` contains only pure utility functions.

## 2. Email Template System (Admin)
- [ ] Create `src/app/admin/emails/page.tsx` to list email templates.
- [ ] Create `src/app/admin/emails/[id]/page.tsx` (or a modal) to edit email templates (Subject, HTML Content).
- [ ] Implement `sendVerificationRequest` in `src/lib/auth.ts` to use the dynamic `verification_email` template from the database.

## 3. Forgot Password Flow
- [ ] Create `src/app/forgot-password/page.tsx` (Input email).
- [ ] Create `src/app/api/auth/forgot-password/route.ts` to handle the request:
    - Generate a token.
    - Save to `VerificationToken` (or a new `ResetToken` if needed, but `VerificationToken` can be reused with a different identifier prefix like `reset-`).
    - Send email using `reset_password` template.
- [ ] Create `src/app/auth/reset-password/page.tsx` (Input new password, validates token).
- [ ] Create `src/app/api/auth/reset-password/route.ts` to update the password.

## 4. Documentation
- [ ] Update `README.md` with:
    - Project structure overview.
    - How to switch themes.
    - How to edit email templates.
    - How to deploy.

## 5. UI Polish
- [ ] Verify `theme-provider.tsx` correctly parses and applies the `config` JSON from the `Theme` model.
- [ ] Ensure the admin dashboard is responsive.
