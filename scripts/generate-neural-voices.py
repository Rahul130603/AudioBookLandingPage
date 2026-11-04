"""Render all Chaptera voice assets with Microsoft Edge neural voices.

Run from the project root:
    PYTHONPATH=.vendor python scripts/generate-neural-voices.py

The generated MP3s live inside public/audio and are served as static assets.
"""
import asyncio
import os
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parent.parent
AUDIO = ROOT / "public" / "audio"
SAMPLES = AUDIO / "samples"
SAMPLES.mkdir(parents=True, exist_ok=True)

VOICE_IDS = {
    "en-aria": "en-US-AriaNeural",
    "en-atlas": "en-US-BrianNeural",
    "ta-kavya": "ta-IN-PallaviNeural",
    "ta-arun": "ta-IN-ValluvarNeural",
    "ur-noor": "ur-PK-UzmaNeural",
    "ur-rayan": "ur-PK-AsadNeural",
}

LANGUAGE_SAMPLES = {
    "language-en.mp3": ("en-aria", "Every book has a voice. Let yours be heard."),
    "language-ta.mp3": (
        "ta-kavya",
        "ஒவ்வொரு புத்தகத்திற்கும் ஒரு குரல் உண்டு. உங்கள் கதை இனிமையாக ஒலிக்கட்டும்.",
    ),
    "language-ur.mp3": (
        "ur-noor",
        "ہر کتاب کی ایک آواز ہوتی ہے۔ آپ کی کہانی خوبصورت لہجے میں سنائی دے۔",
    ),
}

STUDIO_SAMPLES = {
    "voice-en-aria.mp3": (
        "en-aria",
        "The evening light moved slowly across the page, and for the first time, the story did not feel silent. This is a preview of your Chaptera audiobook.",
    ),
    "voice-en-atlas.mp3": (
        "en-atlas",
        "The evening light moved slowly across the page, and for the first time, the story did not feel silent. This is a preview of your Chaptera audiobook.",
    ),
    "voice-ta-kavya.mp3": (
        "ta-kavya",
        "மாலை வெளிச்சம் பக்கத்தின் மேல் மெதுவாக நகர்ந்தது. இது உங்கள் Chaptera ஒலிப்புத்தகத்தின் முன்னோட்டம்.",
    ),
    "voice-ta-arun.mp3": (
        "ta-arun",
        "மாலை வெளிச்சம் பக்கத்தின் மேல் மெதுவாக நகர்ந்தது. இது உங்கள் Chaptera ஒலிப்புத்தகத்தின் முன்னோட்டம்.",
    ),
    "voice-ur-noor.mp3": (
        "ur-noor",
        "شام کی روشنی صفحے پر آہستہ آہستہ پھیل رہی تھی۔ یہ آپ کی چیپٹرا آڈیو بک کا پیش منظر ہے۔",
    ),
    "voice-ur-rayan.mp3": (
        "ur-rayan",
        "شام کی روشنی صفحے پر آہستہ آہستہ پھیل رہی تھی۔ یہ آپ کی چیپٹرا آڈیو بک کا پیش منظر ہے۔",
    ),
}

BOOK_SAMPLES = {
    "book-silent-meridian.mp3": (
        "en-aria",
        "On the last quiet evening of autumn, the city of Veyra folded itself into the fog.",
    ),
    "book-kaadal-nila.mp3": (
        "ta-kavya",
        "மழை வந்து கொண்டிருந்தது. அவள் கடிதத்தை மடித்து வைத்தாள்.",
    ),
    "book-aik-aur-subah.mp3": (
        "ur-noor",
        "ایک اور صبح، ایک اور کہانی۔",
    ),
    "book-cartographers-sleep.mp3": (
        "en-atlas",
        "The coastline changed while he slept, as it always did.",
    ),
    "book-neelam.mp3": (
        "ta-arun",
        "கடல் அலைகள் அவளது பெயரை மெதுவாக உச்சரித்தன.",
    ),
    "book-raat-ka-rasta.mp3": (
        "ur-rayan",
        "شہر کی روشنیوں میں کوئی چیز غائب تھی۔",
    ),
}

CHAPTERS = {
    "chapter-01.mp3": (
        "Chapter One. The Mapmaker's Window. On the last quiet evening of autumn, the city of Veyra folded itself into the fog. Mira watched from the mapmaker's window as street lamps became small orange islands in a sea of grey. She had inherited the shop from her father, along with three hundred unfinished maps and one impossible promise. Somewhere beyond the northern line, he had written, there is a place that remembers every voice. That night, for the first time in eleven years, the brass compass on her desk began to turn on its own."
    ),
    "chapter-02.mp3": (
        "Chapter Two. A City Without Clocks. The road out of Veyra did not appear on any map Mira owned. It began behind the old theatre, where the pavement smelled of rain and burnt sugar, and it ended at a station with no name. The station clock had no hands. A woman in a copper coat sat beneath it, reading a book with no title. She looked up as Mira approached, and smiled as though they had been waiting for one another all their lives. You are late, she said softly. The last train left an hour ago, and also, it has not left yet. Mira held the compass tight. Its needle was no longer pointing north. It was pointing at the woman's voice."
    ),
    "chapter-03.mp3": (
        "Chapter Three. The Voice in the Static. Inside the train, every window showed a different city. One was drowned in summer. One was still being built. Another had been erased so completely that only its shadows remained. Mira walked through carriages filled with letters, thousands of them, unsent and unspoken. Each one carried a voice she almost recognized. At the final carriage, a radio crackled beneath a velvet cloth. Her father's voice came through the static, gentle and distant, the way voices sound in dreams. Mira, he said, maps do not show us where to go. They show us what we are willing to leave behind. Then the train entered the tunnel, and the whole world held its breath."
    ),
    "chapter-04.mp3": (
        "Chapter Four. Where the Meridian Ends. Dawn arrived without permission. Mira stepped onto a platform of white stone, and the city without clocks opened before her. Here, every story had a voice. The bridges hummed with old lullabies. The river repeated the names of the missing. And at the center of it all stood a library with no walls, where the books were read aloud by the wind. Mira placed her father's map upon the final shelf. For a moment, the paper was warm beneath her hand. Then the ink lifted into the air, became a thousand orange sparks, and somewhere behind her, a familiar voice began to speak. She turned. The meridian had ended. The story had not."
    ),
}


async def render(filename, voice_key, text, folder=AUDIO, rate=None):
    path = folder / filename
    if path.exists() and path.stat().st_size > 2000:
        print(f"skip   {filename}")
        return
    last_error = None
    for attempt in range(3):
        try:
            kwargs = {}
            if rate:
                kwargs["rate"] = rate
            communicate = edge_tts.Communicate(text, VOICE_IDS[voice_key], **kwargs)
            await communicate.save(str(path))
            print(f"render {filename}  {path.stat().st_size / 1024:.0f} KB")
            await asyncio.sleep(0.35)
            return
        except Exception as error:  # noqa: BLE001
            last_error = error
            print(f"retry  {filename} ({attempt + 1}/3): {error}")
            await asyncio.sleep(1.5)
    print(f"FAILED {filename}: {last_error}")


async def main():
    for filename, text in CHAPTERS.items():
        await render(filename, "en-aria", text, AUDIO, rate="-5%")

    for filename, (voice, text) in LANGUAGE_SAMPLES.items():
        await render(filename, voice, text, SAMPLES)

    for filename, (voice, text) in STUDIO_SAMPLES.items():
        await render(filename, voice, text, SAMPLES)

    for filename, (voice, text) in BOOK_SAMPLES.items():
        await render(filename, voice, text, SAMPLES)

    print("Done.")


if __name__ == "__main__":
    asyncio.run(main())
