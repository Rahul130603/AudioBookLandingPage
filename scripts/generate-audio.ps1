Add-Type -AssemblyName System.Speech

$out = Join-Path $PSScriptRoot '..\public\audio'
New-Item -ItemType Directory -Force -Path $out | Out-Null

$chapters = @(
  @{
    file = 'chapter-01.wav'
    text = "Chapter One. The Mapmaker's Window. On the last quiet evening of autumn, the city of Veyra folded itself into the fog. Mira watched from the mapmaker's window as street lamps became small orange islands in a sea of grey. She had inherited the shop from her father, along with three hundred unfinished maps and one impossible promise. Somewhere beyond the northern line, he had written, there is a place that remembers every voice. That night, for the first time in eleven years, the brass compass on her desk began to turn on its own."
  },
  @{
    file = 'chapter-02.wav'
    text = "Chapter Two. A City Without Clocks. The road out of Veyra did not appear on any map Mira owned. It began behind the old theatre, where the pavement smelled of rain and burnt sugar, and it ended at a station with no name. The station clock had no hands. A woman in a copper coat sat beneath it, reading a book with no title. She looked up as Mira approached, and smiled as though they had been waiting for one another all their lives. You are late, she said softly. The last train left an hour ago, and also, it has not left yet. Mira held the compass tight. Its needle was no longer pointing north. It was pointing at the woman's voice."
  },
  @{
    file = 'chapter-03.wav'
    text = "Chapter Three. The Voice in the Static. Inside the train, every window showed a different city. One was drowned in summer. One was still being built. Another had been erased so completely that only its shadows remained. Mira walked through carriages filled with letters, thousands of them, unsent and unspoken. Each one carried a voice she almost recognized. At the final carriage, a radio crackled beneath a velvet cloth. Her father's voice came through the static, gentle and distant, the way voices sound in dreams. Mira, he said, maps do not show us where to go. They show us what we are willing to leave behind. Then the train entered the tunnel, and the whole world held its breath."
  },
  @{
    file = 'chapter-04.wav'
    text = "Chapter Four. Where the Meridian Ends. Dawn arrived without permission. Mira stepped onto a platform of white stone, and the city without clocks opened before her. Here, every story had a voice. The bridges hummed with old lullabies. The river repeated the names of the missing. And at the center of it all stood a library with no walls, where the books were read aloud by the wind. Mira placed her father's map upon the final shelf. For a moment, the paper was warm beneath her hand. Then the ink lifted into the air, became a thousand orange sparks, and somewhere behind her, a familiar voice began to speak. She turned. The meridian had ended. The story had not."
  }
)

$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.SelectVoice('Microsoft Zira Desktop')
$synth.Rate = -1
$synth.Volume = 100

foreach ($chapter in $chapters) {
  $path = Join-Path $out $chapter.file
  $synth.SetOutputToWaveFile($path)
  $synth.Speak($chapter.text)
  $synth.SetOutputToNull()
  $info = Get-Item $path
  Write-Output ("{0}  {1:N0} KB" -f $info.Name, ($info.Length / 1KB))
}

$synth.Dispose()
