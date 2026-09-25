# Nihongo Studio

Japanese listening and speaking practice with English and Burmese guidance. Made by Charles.

[Open the website](https://nihongo-step-by-step-mm.zinmimilatt19.chatgpt.site)

## Learning features

- 48 practice sets with 241 cards: basic hiragana/katakana, 18 new N5/N4 sets and selected N3 phrases.
- Listening quizzes, slower playback, Japanese voice selection, recording and self-comparison.
- Natural/enhanced browser voices are preferred when available. Voices are synthetic and depend on the visitor's device; no paid voice service is configured.
- English/Burmese meanings and notes, a weekly timetable and a six-month roadmap.
- Burmese Minna no Nihongo playlist, NihonGoal, Japanese Ammo with Misa and official JLPT resources.
- Light, dark and device themes; responsive phone, tablet and desktop layouts.

These exercises supplement a course; they do not cover the complete JLPT N3 syllabus or guarantee exam readiness. See [lesson sources](LESSON_SOURCES.md). Original textbooks, source PDFs, recordings and videos are not included.

## Accounts and remaining email setup

Supabase Auth provides email/password login. Supabase row-level security limits saved completions and preferences to their owner. The publishable key in `dist/config.js` is intentionally public; never replace it with a secret or service-role key.

**Public signup is disabled in the website until email delivery is configured.** Existing confirmed accounts can sign in. Supabase's default email service only sends confirmation/reset messages to project-team addresses. Custom SMTP and a verified sender/domain are still needed for general signups. No email-service account has been created.

To finish:

1. Configure custom SMTP in Supabase Authentication using a service you own.
2. Set Authentication's Site URL to the published URL and allow the exact production/test redirect URLs you intend to use.
3. Keep email confirmation enabled. Test confirmation, login and password recovery with an address outside the project team.
4. Set `publicSignupReady` to `true` in `dist/config.js`, then republish.

`supabase/schema.sql` was already applied to the configured project; do not re-run it there. For a new project, apply it once and update the public URL/key. `supabase/validate-rls.sql` performs rollback-only isolation checks with temporary fixtures, without sending emails.

## Privacy, progress and offline use

- Signed-in progress is stored in Supabase and loaded on another device after sign-in or **Retry sync**. Unsynced completions queue locally under that account ID and retry on reconnection.
- Guest progress is device-only, separate from account progress, and is not automatically imported.
- Signed-in theme choices sync; guest themes and voice selections stay on the device.
- Recordings stay in the current tab and are never uploaded. Card/view changes, sign-out, account switching and closing the tab clear them.
- The HTTPS site caches static lesson/app files only. Authentication requests, progress data, query-bearing URLs and recordings are not stored in the service-worker cache. First visits, online voices and cloud sync need internet.
- There is no automatic pronunciation grading; listen and compare your recording.

Site access permissions are separate from Supabase accounts. Owner-only hosting must be changed or an invitation granted before another person can open the site.

## Run locally

Files in `dist/` are editable source; no package installation or build is needed:

```sh
python3 -m http.server 8080 --bind 127.0.0.1 --directory dist
```

Open http://localhost:8080. Microphone access requires HTTPS outside localhost. Service-worker caching runs only on HTTPS; offline queue handling also works locally.

The official Supabase SDK 2.117.1 is bundled in `dist/vendor/` with its MIT license. Change the cache version in `dist/sw.js` when publishing changed assets.

## Optional Docker

Docker is unnecessary for the hosted copy and Supabase. The supplied Docker files offer an alternative static host; no Docker server was connected to or started.

```sh
docker compose up -d --build
```

The service binds to `127.0.0.1:8080`. Use an HTTPS reverse proxy for remote microphone access. Ask the server owner before deploying.

## Files

- `dist/index.html`, `style.css`: layout, themes and account dialog.
- `dist/lessons.js`, `extra-lessons.js`: bilingual lesson material.
- `dist/app.js`: quizzes, speech, recording and navigation.
- `dist/account.js`, `config.js`: Supabase authentication and progress sync.
- `dist/theme.js`, `offline.js`, `sw.js`: preferences and static-file caching.
- `supabase/`: schema and rollback validation.
- `tests/account.test.cjs`: simulated account-switch, recovery and sync-race checks.
- `.openai/hosting.json`: identity of the Sites-hosted copy.

A GitHub push stores source; it does not publish Sites. Deploy the tested source through Sites, or serve `dist/` from another HTTPS static host and update Supabase redirects.

## Verification

JavaScript syntax, lesson schema/IDs, simulated account-state behavior and live SQL isolation were checked. Live SQL tests rolled back all fixtures. Browser checks cover phone/desktop themes, lesson navigation, signup setup messaging and Japanese playback. Real signup, email delivery, recovery emails and cross-device login still need verification after SMTP setup. No personal passwords or microphone recordings were used in these tests.
