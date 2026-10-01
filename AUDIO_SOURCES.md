# Japanese practice voice

The default voice is AI-generated speech, not a human recording or a Duolingo voice.

- Model: [Kokoro-82M v1.0](https://huggingface.co/hexgrad/Kokoro-82M), Apache-2.0.
- Voice: `jf_alpha`, selected from the [official voice inventory](https://huggingface.co/hexgrad/Kokoro-82M/blob/main/VOICES.md).
- Generator: [Kokoro 0.9.4](https://github.com/hexgrad/kokoro), with [Misaki 0.9.4](https://github.com/hexgrad/misaki) Japanese phonemization and UniDic 3.1.0.
- Audio: mono MP3, 24 kHz, 48 kbit/s. Generated locally from the site's practice text. No model weights, original textbooks, or third-party audio recordings are distributed.

`scripts/pronunciation.json` sets isolated kana sounds explicitly so は/へ are taught as ha/he, and aligns selected ambiguous words and counters with the displayed lesson readings. Hiragana and katakana share the matching clips. Synthetic speech can still have accent or rhythm imperfections; linked native-speaker lessons remain useful. This is not a pronunciation scoring service.

Visitors do not need Python, an API key, or a paid voice account. Files load on demand after a tap. The browser's Japanese voice is used if a clip fails or is unavailable; visitors may also choose a device voice explicitly. A local Japanese device voice is needed for dependable offline speech. The service worker does not download or cache the audio library.

## Regenerate

Use Python 3.12 in a separate virtual environment. Install `scripts/voice-requirements.txt`, then run `python -m unidic download` and `python scripts/generate-audio.py`. Set `HF_HOME` to reuse an existing model cache. The generator verifies model and voice hashes. Model and dictionary downloads are only needed during asset preparation. `--only-corrections` retains already-generated ordinary clips while rebuilding explicit pronunciation corrections.

Generated audio is in `dist/audio/`; `dist/audio-manifest.js` maps lesson text to files. The generation report is in ignored `.sites-runtime/audio-generation.json`. Run `node --test tests/audio.test.cjs` after generation.
