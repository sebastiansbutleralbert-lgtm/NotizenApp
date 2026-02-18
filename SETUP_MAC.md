# 🚀 Setup-Anleitung für Mac/Xcode

## Vorbereitungen auf Ihrem Mac

### 1. Repository klonen

```bash
cd ~/Desktop  # Oder ein anderer Ordner Ihrer Wahl
git clone https://github.com/sebastiansbutleralbert-lgtm/NotizenApp.git
cd NotizenApp
```

### 2. Node.js Dependencies installieren

```bash
npm install
```

### 3. iOS Dependencies (CocoaPods) installieren

```bash
cd ios
pod install
cd ..
```

**Wichtig:** Falls `pod install` einen Fehler wirft, führen Sie aus:
```bash
cd ios
pod repo update
pod install
cd ..
```

### 4. Xcode öffnen

```bash
open ios/VoiceNotesApp.xcworkspace
```

**⚠️ WICHTIG:** Öffnen Sie die `.xcworkspace` Datei, NICHT die `.xcodeproj` Datei!

---

## In Xcode

### 1. Signing & Capabilities

1. Wählen Sie das Projekt "VoiceNotesApp" in der linken Seitenleiste
2. Wählen Sie das Target "VoiceNotesApp"
3. Gehen Sie zum Tab "Signing & Capabilities"
4. Aktivieren Sie "Automatically manage signing"
5. Wählen Sie Ihr **Team** (Ihr Apple Developer Account)
6. Bundle Identifier sollte automatisch gesetzt werden: `org.reactjs.native.example.VoiceNotesApp`

### 2. Build Target auswählen

Oben in der Xcode-Toolbar:
- Wählen Sie ein Zielgerät (z.B. "iPhone 15 Pro" im Simulator)
- Oder verbinden Sie Ihr echtes iPhone per USB

### 3. App bauen und starten

1. Drücken Sie **⌘ + R** (oder klicken Sie auf den Play-Button ▶️)
2. Xcode kompiliert die App
3. Die App startet automatisch auf dem Simulator/Gerät

**Erste Build kann 3-5 Minuten dauern!**

---

## App testen

### Beim ersten Start:

1. Die App öffnet sich mit einem leeren Bildschirm
2. Unten rechts sehen Sie einen **violetten Mikrofon-Button**
3. iOS wird nach **Mikrofon-Berechtigung** fragen → **"Erlauben"** wählen
4. iOS wird nach **Spracherkennung-Berechtigung** fragen → **"Erlauben"** wählen

### Erste Notiz aufnehmen:

1. Tippen Sie auf den **Mikrofon-Button**
2. Der Button wird **rot** → Aufnahme läuft
3. Sprechen Sie eine Notiz (z.B. "Einkaufen morgen: Milch, Brot und Butter kaufen")
4. Tippen Sie erneut auf den Button zum Stoppen
5. Die App verarbeitet die Aufnahme
6. Eine Notiz-Karte erscheint mit:
   - Titel
   - Kategorie
   - Inhalt
   - Tags

---

## Bekannte Einschränkungen (aktuell)

### ✅ Was funktioniert:

- Sprachaufnahme (iOS Speech Recognition)
- Transkription (Sprache → Text)
- **Automatischer KI-Modell-Download** beim ersten Start
- **KI-gestützte Strukturierung** (TinyLlama 1.1B)
- Lokale Speicherung
- UI/UX komplett
- Suche

### 🤖 KI-Modell-Download:

**Beim ersten App-Start:**

1. Die App lädt automatisch das KI-Modell herunter (~650 MB)
2. Ein Fortschrittsbalken zeigt den Download-Status
3. Das Modell wird lokal gespeichert (nur einmalig)
4. Nachfolgende Starts sind sofort einsatzbereit

**Sie müssen nichts manuell herunterladen oder konfigurieren!**

**Fallback-Modus:**
- Falls der Download fehlschlägt (z.B. keine Internetverbindung)
- Nutzt die App eine vereinfachte Strukturierung
- Der Download kann später erneut versucht werden

---

## Troubleshooting

### Problem: "Command PhaseScriptExecution failed"

**Lösung:**
```bash
cd ios
pod deintegrate
pod install
```

### Problem: "Metro Bundler not running"

**Lösung:**
In einem separaten Terminal:
```bash
cd ~/Desktop/NotizenApp
npm start
```

### Problem: "Simulator startet nicht"

**Lösung:**
1. Xcode → Window → Devices and Simulators
2. Simulator auswählen und "Delete"
3. Neuen Simulator erstellen

### Problem: Mikrofon-Berechtigung wurde abgelehnt

**Lösung:**
1. iOS Einstellungen → Datenschutz → Mikrofon
2. "VoiceNotesApp" aktivieren
3. App neu starten

---

## Nächste Schritte (optional)

### Auf echtem iPhone testen:

1. iPhone per USB verbinden
2. iPhone entsperren
3. In Xcode: Wählen Sie Ihr iPhone als Target
4. iOS fragt "Developer vertrauen?" → Vertrauen
5. Build starten (⌘ + R)

### LLM-Modell hinzufügen:

1. Modell herunterladen (siehe README.md)
2. Zu Xcode-Projekt hinzufügen
3. `LLMService.initialize()` in `HomeScreen.tsx` aufrufen

---

## Support

Bei Fragen oder Problemen:
- **GitHub Issues:** https://github.com/sebastiansbutleralbert-lgtm/NotizenApp/issues
- **README.md** lesen für detaillierte Infos
- Albert kontaktieren (Telegram)

Viel Erfolg! 🎉
