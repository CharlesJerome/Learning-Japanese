# Nihongo Studio

Japanese listening and speaking practice with English and Burmese guidance. Made by Charles.

[Open the website](https://nihongo-step-by-step-mm.zinmimilatt19.chatgpt.site)

## Learning features

- 48 practice sets with 241 cards: basic hiragana/katakana, 18 new N5/N4 sets and selected N3 phrases.
- Listening quizzes, slower playback, Japanese voice selection, recording and self-comparison.
- Free Kokoro Japanese AI clips are the default, with selectable Japanese device voices and automatic fallback if a clip cannot load. See [audio sources and generation](AUDIO_SOURCES.md).
- English/Burmese meanings and notes, a weekly timetable and a six-month roadmap.
- Burmese Minna no Nihongo playlist, NihonGoal, Japanese Ammo with Misa and official JLPT resources.
- Light, dark and device themes; responsive phone, tablet and desktop layouts.

These exercises supplement a course; they do not cover the complete JLPT N3 syllabus or guarantee exam readiness. See [lesson sources](LESSON_SOURCES.md). Original textbooks, source PDFs, recordings and videos are not included.

## Accounts and email delivery

Supabase Auth provides email/password login. Supabase row-level security limits saved completions and preferences to their owner. The publishable key in `dist/config.js` is intentionally public; never replace it with a secret or service-role key.

Public signup is enabled in the website. Resend has verified `auth.learningwithcharles.com`, and custom SMTP is saved in Supabase with `no-reply@auth.learningwithcharles.com` as the sender. The secret remains in Supabase, never in this repository. Email confirmation remains required.

The application continues to run at the published `chatgpt.site` URL. Purchasing the email domain does not move the website. Supabase's Site URL and redirect allowlist use that production URL.

Before considering the account launch fully verified, complete a real signup and confirmation, sign in, request a password reset and confirm that the new password works. These inbox and password steps must be completed by the account owner. If email delivery fails, set `publicSignupReady` to `false` in `dist/config.js` and republish while investigating.

`supabase/schema.sql` was already applied to the configured project; do not re-run it there. For a new project, apply it once and update the public URL/key. `supabase/validate-rls.sql` performs rollback-only isolation checks with temporary fixtures, without sending emails.

## Privacy, progress and offline use

- Signed-in progress is stored in Supabase and loaded on another device after sign-in or **Retry sync**. Unsynced completions queue locally under that account ID and retry on reconnection.
- Guest progress is device-only, separate from account progress, and is not automatically imported.
- Signed-in theme choices sync; guest themes and voice selections stay on the device.
- Recordings stay in the current tab and are never uploaded. Card/view changes, sign-out, account switching and closing the tab clear them.
- The HTTPS site caches an explicit list of lesson/app files only, including their fixed asset versions. Authentication requests, progress data, arbitrary query-bearing URLs, lesson audio and recordings are not stored in the service-worker cache. First visits, natural voice clips, online device voices and cloud sync need internet. Select a locally installed Japanese voice for offline speech.
- There is no automatic pronunciation grading; listen and compare your recording.

Site access is public: anyone with the website link can practise. Supabase accounts keep each person’s saved progress separate.

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

JavaScript syntax, lesson schema/IDs, simulated account-state behavior and live SQL isolation were checked. Live SQL tests rolled back all fixtures. Browser checks cover phone/desktop themes, lesson navigation, signup setup messaging and Japanese playback. SMTP settings and the sending domain are configured. Real inbox delivery, confirmation, password recovery and cross-device login still require account-owner verification. No personal passwords or microphone recordings were used in these tests.
