// Curated production flow, source-checked against the 0.28.0 snapshot.
// This directed overview is distinct from Graphify's full undirected graph.
export const levaSnapshot = {
  date: "23 Oktober 2026",
  version: "0.28.0",
  files: 167,
  nodes: 2356,
  edges: 7381,
  communities: 106,
  repository: "https://github.com/Diska404/Private_Assistant_AI",
};

export const levaModules = [
  {
    id: "desktop",
    label: "Desktop",
    group: "Input",
    x: 170,
    y: 48,
    source: "gui.py:214",
    detail:
      "Pesan ketikan masuk melalui LevaWindow.send. Permintaan membawa ruang aktif dan konteks pekerjaan.",
  },
  {
    id: "mic",
    label: "Mikrofon lokal",
    group: "Input",
    x: 480,
    y: 48,
    source: "gui.py:1105, 1127",
    detail:
      "Transkrip dicatat dalam inbox suara. Perintah yang siap diproses menunggu giliran lalu diteruskan ke dispatch utama.",
  },
  {
    id: "phone",
    label: "Web / HP",
    group: "Input",
    x: 790,
    y: 48,
    source: "web_host.py:133",
    detail:
      "WebBridge dan DesktopWebHost meneruskan pesan, lampiran, ruang, dan informasi perangkat. Mesin pelaksana tetap laptop.",
  },
  {
    id: "dispatch",
    label: "LevaWindow",
    group: "Koordinator",
    x: 480,
    y: 158,
    source: "gui.py:214",
    detail:
      "Koordinator UI memilih jalur percakapan atau Asisten, menjaga status sibuk, dan memisahkan hasil berdasarkan generasi permintaan.",
  },
  {
    id: "rooms",
    label: "Chat / Secret",
    group: "Percakapan",
    x: 230,
    y: 276,
    source: "conversation_rooms.py:41, 84",
    detail:
      "Riwayat disimpan per ruang dalam SQLite. Chat Auto memilih model berdasarkan arah personal atau informasi. Ruang ini tidak menerima alat kendali PC.",
  },
  {
    id: "assistant",
    label: "Asisten",
    group: "Eksekusi",
    x: 730,
    y: 276,
    source: "gui.py:304, 320",
    detail:
      "DesktopService memeriksa perintah langsung. Frontend percakapan dapat menjawab obrolan atau menyerahkan tujuan asli kepada agent.",
  },
  {
    id: "chatmodel",
    label: "Model percakapan",
    group: "Percakapan",
    x: 230,
    y: 388,
    source: "conversation_rooms.py:91, 109",
    detail:
      "Chat Auto memakai Qwen 4B untuk arah personal atau Saluki untuk informasi. Model yang dipilih pengguna tetap dapat digunakan; konteks aktif dibatasi.",
  },
  {
    id: "agent",
    label: "Agent + alat host",
    group: "Eksekusi",
    x: 730,
    y: 388,
    source: "agent_runtime.py:64; gui.py:995",
    detail:
      "Agent memilih alat yang tersedia, menerima hasil pelaksanaan dari host, lalu melanjutkan tugas. Model lebih besar tidak otomatis menambahkan jenis alat baru.",
  },
  {
    id: "journal",
    label: "TaskJournal",
    group: "Eksekusi",
    x: 810,
    y: 494,
    source: "agent_runtime.py:65",
    detail:
      "Tujuan, rencana, niat tindakan, dan hasil alat dicatat untuk kebutuhan klarifikasi serta kelanjutan tugas. Keadaan aplikasi perlu diperiksa ulang.",
  },
  {
    id: "result",
    label: "Antrean hasil",
    group: "Koordinator",
    x: 480,
    y: 516,
    source: "gui.py:420",
    detail:
      "LevaWindow.poll menerima progres, balasan, pembatalan, dan kesalahan. Teks yang sudah tersedia dapat ditampilkan sebelum audio selesai.",
  },
  {
    id: "text",
    label: "Teks & status web",
    group: "Output",
    x: 170,
    y: 638,
    source: "gui.py:508; web_host.py:149",
    detail:
      "Balasan dan snapshot keadaan disampaikan ke UI. Publikasi status dibatasi interval sekitar 250 ms; kesegaran metrik mengikuti waktu pengukuran.",
  },
  {
    id: "voice",
    label: "ReplyVoice → TTS",
    group: "Output",
    x: 480,
    y: 638,
    source: "gui.py:929; reply_voice.py:76",
    detail:
      "Terjemahan Jepang jika diperlukan, pembagian ucapan, pemilihan voice pack dan GPU, lalu sintesis melalui VoicePackService. Kekurangan VRAM dapat menunda proses.",
  },
  {
    id: "audio",
    label: "Audio laptop / HP",
    group: "Output",
    x: 790,
    y: 638,
    source: "web_host.py:35",
    detail:
      "Audio hasil sintesis dipublikasikan melalui bridge untuk web/HP. Kehadiran HP aktif menjeda mikrofon laptop; mic HP memakai tombol rekam.",
  },
] as const;

export const levaLinks = [
  ["desktop", "dispatch"],
  ["mic", "dispatch"],
  ["phone", "dispatch"],
  ["dispatch", "rooms"],
  ["dispatch", "assistant"],
  ["rooms", "chatmodel"],
  ["assistant", "agent"],
  ["assistant", "result"],
  ["agent", "journal"],
  ["journal", "result"],
  ["chatmodel", "result"],
  ["result", "text"],
  ["result", "voice"],
  ["voice", "audio"],
] as const;
