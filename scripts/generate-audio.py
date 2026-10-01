"""Offline build tool. No model, account, or Python runtime is needed by visitors."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import subprocess
import tempfile

SITE = Path(__file__).resolve().parents[1]
os.environ.setdefault('HF_HOME', str(SITE / '.sites-runtime' / 'voice-cache'))
os.environ.setdefault('HF_HUB_DISABLE_XET', '1')
import numpy as np
import soundfile as sf
import torch
from huggingface_hub import hf_hub_download
from kokoro import KModel, KPipeline
from imageio_ffmpeg import get_ffmpeg_exe

parser = argparse.ArgumentParser()
parser.add_argument('--only-corrections', action='store_true', help='Keep existing unchanged clips, including approved samples.')
args = parser.parse_args()
torch.set_num_threads(4)
repo = 'hexgrad/Kokoro-82M'
weights = hf_hub_download(repo, 'kokoro-v1_0.pth')
with open(weights, 'rb') as f:
    assert hashlib.file_digest(f, 'sha256').hexdigest() == '496dba118d1a58f5f3db2efc88dbdc216e0483fc89fe6e47ee1f2c53f18ad1e4'
model = KModel(repo_id=repo, config=hf_hub_download(repo, 'config.json'), model=weights).to('cpu').eval()
voice_file = hf_hub_download(repo, 'voices/jf_alpha.pt')
with open(voice_file, 'rb') as f:
    assert hashlib.file_digest(f, 'sha256').hexdigest() == '1bf4c9dc69e45ee46183b071f4db766349aac5592acbcfeaf051018048a5d787'
voice = torch.load(voice_file, weights_only=True)
pipeline = KPipeline(lang_code='j', repo_id=repo, model=model)
fixes = json.loads((SITE / 'scripts/pronunciation.json').read_text())
js = """
const fs=require('fs'),vm=require('vm'),c={};c.window=c;vm.createContext(c);
for(const f of ['lessons.js','extra-lessons.js'])vm.runInContext(fs.readFileSync('dist/'+f,'utf8'),c);
process.stdout.write(JSON.stringify([...c.LESSONS.flatMap(l=>l.cards.map(c=>c.speech)),...c.KANA_ROWS.flatMap(r=>[...r[1],...r[2]])]));
"""
texts = list(dict.fromkeys(json.loads(subprocess.check_output(['node', '-e', js], cwd=SITE))))
out = SITE / 'dist/audio'
out.mkdir(exist_ok=True)
manifest, completed = {}, set()
stats = []
with tempfile.TemporaryDirectory() as scratch:
    for text in texts:
        kana = ''.join(chr(ord(c)-96) if '\u30a1' <= c <= '\u30f6' else c for c in text)
        raw = fixes['kana'].get(kana) or fixes['phrases'].get(text)
        canonical = kana if kana in fixes['kana'] else text
        name = hashlib.sha256(canonical.encode()).hexdigest()[:16] + '.mp3'
        manifest[text] = 'audio/' + name
        if name in completed:
            continue
        completed.add(name)
        target = out / name
        if args.only_corrections and not raw and target.exists():
            continue
        torch.manual_seed(42)
        results = list(pipeline.generate_from_tokens(raw, voice=voice, speed=.95) if raw else pipeline(text, voice=voice, speed=.95, split_pattern=None))
        audio = np.concatenate([r.audio.detach().cpu().numpy() for r in results if r.audio is not None])
        assert np.isfinite(audio).all() and .2 < len(audio)/24000 < 30 and np.abs(audio).max() > .001, text
        wav = Path(scratch) / 'clip.wav'
        sf.write(wav, audio, 24000, subtype='PCM_16')
        subprocess.run([get_ffmpeg_exe(), '-loglevel', 'error', '-y', '-i', str(wav), '-codec:a', 'libmp3lame', '-b:a', '48k', str(target)], check=True)
        stats.append({'text': text, 'phonemes': ' '.join(r.phonemes for r in results), 'seconds': round(len(audio)/24000,3)})
        if len(stats)%20 == 0:
            print(f'Regenerated {len(stats)} corrected clips', flush=True)
payload = {'model': 'Kokoro-82M v1.0', 'voice': 'jf_alpha', 'license': 'Apache-2.0', 'clips': manifest}
(SITE / 'dist/audio-manifest.js').write_text('// AI-generated Japanese lesson audio. See AUDIO_SOURCES.md.\nwindow.NIHONGO_AUDIO='+json.dumps(payload,ensure_ascii=False,separators=(',',':'))+';\n')
(SITE / '.sites-runtime').mkdir(exist_ok=True)
(SITE / '.sites-runtime/audio-generation.json').write_text(json.dumps(stats, ensure_ascii=False, indent=2))
print(f'{len(manifest)} text keys, {len(completed)} unique clips, {len(stats)} regenerated')
