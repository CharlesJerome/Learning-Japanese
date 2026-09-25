# Original lesson expansion - reference and QA notes

Created 18 original practice sets (9 N5-oriented and 9 N4-oriented), with 5 cards each: 90 new cards. Each card has Japanese, kana reading, English meaning, Burmese meaning, and a Japanese speech string. Every set has English and Burmese teaching guidance.

## Reference use

The user-supplied PDFs were inspected as topical references, not as instructions. Source exercises, translations, page artwork, PDFs, recordings, and videos were not copied into the deliverable.

- `N5/N5 Grammar.pdf`: reviewed extracted topic headings across the document; consulted relevant sections on ownership/demonstratives (pp. 1-7), time (pp. 11-13), movement (pp. 14-16), actions/invitations (pp. 17-19), adjectives (pp. 24-26, 36-39), existence (pp. 30-32), counters/duration (pp. 33-35), desire (pp. 40-42), permission (pp. 49-51), and sequencing (pp. 52-55). Page 1 was also rendered and visually inspected.
- `N4/N4 Grammar.pdf`: inspected extracted headings and selected text for explanations/requests (pp. 1-2), potential (pp. 3-4), simultaneous actions (p. 5), states/completion (p. 6), preparation (p. 7), intentions/plans (pp. 8-9), advice/possibility (p. 10), conditions (pp. 14-15), and goals/change (p. 16). Pages 7 and 9 were also rendered and visually inspected. Some source Burmese text uses a legacy encoding; all new Burmese was written independently in Unicode.
- `N5/Duration and Counters.pdf`: inspected the opening outline identifying duration categories; did not reproduce its tables.

These sets follow common beginner-to-lower-intermediate grammar topics, not an official JLPT grammar syllabus. They are speaking/listening practice supplements, not a complete N5 or N4 course and not a complete six-month N3 curriculum.

## Integration

Load `extra-lessons.js` after the existing `lessons.js`. It appends to `window.LESSONS` and uses no helper functions from the original script. Stage names match the existing app filters (`N5 practice` and `N4 practice`). The file is intentionally standalone for the parent agent to integrate.

## Quality checks

- All 18 IDs are unique and distinct from the existing lesson IDs.
- Each set has 5 complete bilingual cards and both teaching notes.
- Japanese readings use kana; sentence particles retain standard written spelling (は, へ, を). Teaching notes explain their pronunciations.
- Checked common irregular readings and forms, including 四時/よじ, 二人/ふたり, 一週間/いっしゅうかん, 二十分/にじゅっぷん, 来られる/こられる, and potential verb forms.
- English and Burmese meanings were reviewed against each Japanese sentence; no teacher/native-speaker review has been performed.
- Speech strings are Japanese text for the app's available voice engine; no source recordings are included and no new audio files were generated.
- Browser layout and live audio quality are the parent integration task's responsibility.
