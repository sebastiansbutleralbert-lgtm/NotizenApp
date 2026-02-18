# 🎤 VoiceNotesApp - Intelligente Sprach-Notizen mit lokaler KI

Eine iOS-App für Sprachnotizen mit automatischer Strukturierung durch lokale LLM-Modelle (Large Language Models).

## 🎯 Features

- ✅ **Sprachaufnahme** - Notizen per Sprache aufnehmen (deutsche Spracherkennung)
- ✅ **Lokale KI-Strukturierung** - Automatische Organisation und Kategorisierung
- ✅ **Offline-Funktionalität** - Keine Internetverbindung erforderlich
- ✅ **Intelligente Tags** - Automatische Schlagwort-Erkennung
- ✅ **Priorisierung** - Automatische Einschätzung der Wichtigkeit
- ✅ **Suche** - Durchsuchen aller Notizen
- ✅ **Material Design UI** - Moderne, intuitive Benutzeroberfläche

## 🏗️ Architektur

```
┌─────────────────────────────────────────────┐
│          Sprachaufnahme (iOS STT)           │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│         Transkription (Text)                │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│      LLM-Analyse (llama.rn)                 │
│  • Titel-Generierung                        │
│  • Kategorisierung                          │
│  • Tag-Extraktion                           │
│  • Priorisierung                            │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│    Strukturierte Notiz (AsyncStorage)       │
└─────────────────────────────────────────────┘
```

## 📁 Projekt-Struktur

```
NotizenApp/
├── src/
│   ├── components/
│   │   └── VoiceRecorder.tsx      # Aufnahme-Button & Steuerung
│   ├── screens/
│   │   └── HomeScreen.tsx         # Hauptbildschirm mit Notizenliste
│   ├── services/
│   │   ├── VoiceService.ts        # Spracherkennung (iOS)
│   │   ├── LLMService.ts          # Lokales LLM für Strukturierung
│   │   └── StorageService.ts      # Lokale Datenspeicherung
│   └── types/
│       └── Note.ts                # TypeScript-Typen
├── ios/                           # iOS-spezifische Konfiguration
├── android/                       # Android-Konfiguration (optional)
└── App.tsx                        # Haupt-App-Komponente
```

## 🚀 Installation & Setup

### Voraussetzungen

- macOS mit Xcode installiert
- Node.js (v18+)
- CocoaPods
- iPhone oder iOS-Simulator

### Schritt 1: Repository klonen

```bash
git clone https://github.com/bastio89/NotizenApp.git
cd NotizenApp
```

### Schritt 2: Dependencies installieren

```bash
# Node-Pakete installieren
npm install

# iOS-Dependencies installieren
cd ios
pod install
cd ..
```

### Schritt 3: iOS-App in Xcode öffnen

```bash
open ios/VoiceNotesApp.xcworkspace
```

### Schritt 4: App bauen und testen

1. Wählen Sie Ihr Zielgerät (iPhone oder Simulator)
2. Klicken Sie auf den "Play"-Button in Xcode
3. Die App wird gebaut und auf dem Gerät gestartet

## 🧠 LLM-Integration

### ✨ Vollständig automatisiert - Keine manuelle Konfiguration nötig!

Die App lädt beim **ersten Start automatisch** ein KI-Modell herunter:

- **Modell**: TinyLlama 1.1B Chat (Q4 quantisiert)
- **Größe**: ~650 MB
- **Download**: Automatisch beim ersten Start
- **Speicherort**: Lokal auf dem Gerät (Document Directory)
- **Nachfolgende Starts**: Sofort einsatzbereit (kein erneuter Download)

### Beim ersten App-Start:

1. Die App zeigt einen Fortschrittsbalken
2. Das KI-Modell wird von Hugging Face heruntergeladen
3. Das Modell wird lokal gespeichert
4. Die KI-Strukturierung ist sofort aktiv

### Fallback-Modus:

Falls der Download fehlschlägt (z.B. keine Internetverbindung):
- Die App nutzt eine vereinfachte Strukturierung
- Einfache Titel-Generierung aus den ersten Wörtern
- Basis-Kategorisierung
- Keyword-Extraktion

Der Download kann später manuell erneut versucht werden.

### Funktionsweise der KI-Strukturierung:

Das lokale LLM analysiert Ihre Sprachnotizen und erstellt automatisch:
- 📝 **Prägnante Titel** - Kurze, aussagekräftige Zusammenfassung
- 🏷️ **Kategorien** - "Arbeit", "Privat", "Einkauf", "Idee", "Todo", etc.
- ✨ **Formatierter Inhalt** - Markdown-Listen, Aufzählungen, Strukturierung
- 🔖 **Relevante Tags** - 3-5 Schlagworte für schnelles Suchen
- ⚡ **Priorität** - Automatische Einschätzung (low/medium/high)

## 🎨 UI-Komponenten

### VoiceRecorder

- **Mikrofon-Button** (FAB - Floating Action Button)
- **Aufnahme-Indikator** (Rot während Aufnahme)
- **Processing-Modal** (Ladeanzeige während KI-Verarbeitung)

### HomeScreen

- **Suchleiste** - Notizen durchsuchen
- **Notizenliste** - Alle Notizen sortiert nach Datum
- **Notiz-Karten** - Zeigen Titel, Kategorie, Inhalt, Tags, Priorität

## 📊 Datenmodell

```typescript
interface Note {
  id: string;
  timestamp: Date;
  rawTranscript: string;        // Original-Transkription
  structuredContent: {
    title: string;              // KI-generierter Titel
    category: string;           // Kategorie (z.B. "Arbeit", "Privat")
    content: string;            // Formatierter Inhalt
    tags: string[];             // Extrahierte Schlagworte
    priority?: 'low' | 'medium' | 'high';
  };
  processingStatus: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}
```

## 🔧 Konfiguration

### Sprache ändern

In `src/services/VoiceService.ts`:

```typescript
await Voice.start('de-DE'); // Deutsch
// await Voice.start('en-US'); // Englisch
```

### LLM-Parameter (Fortgeschritten)

Die Standardkonfiguration ist bereits optimiert. Bei Bedarf können Sie in `src/services/LLMService.ts` anpassen:

```typescript
await initLlama({
  model: modelPath,
  use_mlock: true,
  n_ctx: 2048,           // Context-Größe (2048 = gut für Notizen)
  n_gpu_layers: 1,       // GPU-Beschleunigung (iOS Metal)
});
```

**Hinweis**: Das Standard-Modell (TinyLlama 1.1B) ist für mobile Geräte optimiert und benötigt ca. 2-3 GB RAM.

## 🐛 Troubleshooting

### Problem: Spracherkennung funktioniert nicht

- **Lösung**: Überprüfen Sie die Mikrofon-Berechtigung in iOS-Einstellungen
- In Xcode: Capabilities → Background Modes aktivieren

### Problem: App stürzt beim Aufnehmen ab

- **Lösung**: Stellen Sie sicher, dass `Info.plist` die Mikrofon-Berechtigung enthält
- Siehe iOS-Konfiguration oben

### Problem: Notizen werden nicht gespeichert

- **Lösung**: AsyncStorage-Berechtigung überprüfen
- Console-Logs in StorageService.ts aktivieren

## 📝 TODO / Roadmap

- [x] LLM-Modell vollständig integrieren (Automatischer Download)
- [x] KI-gestützte Strukturierung
- [ ] Notizen bearbeiten/löschen
- [ ] Export-Funktion (PDF, Text)
- [ ] Cloud-Sync (optional)
- [ ] Dark Mode
- [ ] Kategorien-Filter
- [ ] Audio-Wiedergabe der Original-Aufnahme
- [ ] Multi-Language Support
- [ ] Manuelle Model-Auswahl (TinyLlama, Phi-3, Llama 3.2)

## 🤝 Entwicklung

Entwickelt von **Albert** (sebastiansbutleralbert@gmail.com)

### Git-Workflow

```bash
# Änderungen committen
git add .
git commit -m "Feature: Beschreibung"
git push origin main
```

## 📄 Lizenz

MIT License - Freie Nutzung und Modifikation

---

**Hinweis**: Diese App ist derzeit für iOS optimiert. Android-Support ist technisch möglich, aber nicht getestet.
