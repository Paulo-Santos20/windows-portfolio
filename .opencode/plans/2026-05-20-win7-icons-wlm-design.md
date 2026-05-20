# Windows 7 Desktop Icons + Windows Live Messenger 2009 - Design Spec

## 1. Win7 Desktop Icons

### 1.1 New File: `src/components/os/Win7AeroIcons.jsx`

SVG Aero-style icons for Win7 theme. Each icon is a pure SVG component (48x48 viewBox).

Icon types to create:

| Type | Description | Visual |
|------|-------------|--------|
| `computer` | Computador | Monitor + pedestal, Aero blue glow |
| `folder` | Pasta amarela | Folder with tabs, Win7 yellow/gold gradient |
| `folder_open` | Pasta aberta | Same folder, slightly open |
| `recycle_full` | Lixeira cheia | Full bin with papers, Win7 silver/metallic |
| `recycle_empty` | Lixeira vazia | Empty bin, same style |
| `txt` | Arquivo texto | Notepad with lines, blue ribbon |
| `user` | Usuário | Person silhouette in circle, blue Aero |
| `ie` | Internet Explorer | "e" blue logo with orbit ring |
| `wmp` | Media Player | WMP icon with orange/green/blue squares |
| `games` | Jogos | Game controller, silver/blue |
| `settings` | Configurações | Gear/cog, silver Aero |
| `projects` | Projetos | Briefcase, brown leather Aero |
| `calc` | Calculadora | Calculator, Win7 Aero style |
| `paint` | Paint | Paint palette, Aero style |
| `cmd` | Prompt | Terminal window, dark Aero |
| `msg` | MSG Messenger | WLM butterfly logo (blue/orange) |

### 1.2 Modify `Desktop.jsx`

- Add `Win7Icon` import
- Create `AeroIcon` wrapper component that dispatches to `Win7Icon` or `XPIcon` based on `theme`
- Change `getIcon()` to use `AeroIcon`
- Update `DesktopIcon` for Win7 mode:
  - Selection: `rgba(0,120,215,0.15)` glow (no XP solid blue)
  - Labels: NO text shadow (Win7 doesn't use it), same font
  - Container size: `w-[88px] h-[100px]` vs XP `w-[86px] h-[98px]`
  - Hover: subtle border highlight vs XP opaque
- Add Recycle Bin icon to Win7 desktop layout

### 1.3 Store Changes

Add `recycleBinItems` array to file system (for recycle bin state tracking).

## 2. Windows Live Messenger 2009

### 2.1 Architecture: Two Windows

**Main Window:** `src/components/apps/MSGMain.jsx`
- Lista de contatos
- Login/logout
- Status, mensagem pessoal
- Abre janela de conversa

**Conversation Window:** `src/components/apps/MSGConversation.jsx`
- Chat bubbles estilo WLM 2009
- Toolbar com nudge, emoticons, etc
- Nudge shake effect
- Sons de notificação

### 2.2 Main Window Layout

```
┌─────────────────────────────────────┐
│ ─── Windows Live Messenger ─── □ X │  ← Win7 title bar (gradiente azul escuro)
├─────────────────────────────────────┤
│ ┌─────┐  Nome                       │  ← DP (48px) + nome + status dropdown
│ │ DP  │  └─ Online ─┘               │
│ └─────┘  "mensagem pessoal..."      │  ← Campo editável
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ 🔍 Procurar contatos...        │ │  ← Search input
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ ● Fsociety                          │
│   Oi, friend...                     │  ← Contato com DP mini + última msg
│                                     │
│ (Offline)                           │  ← Grupo offline (vazio)
│   Nenhum contato offline            │
├─────────────────────────────────────┤
│ [Adicionar] [Silenciar som] [⚙]     │  ← Bottom bar
└─────────────────────────────────────┘
```

### 2.3 Conversation Window Layout

```
┌─────────────────────────────────────────┐
│ ─── Fsociety — Conversa ────────── □ X  │
├─────────────────────────────────────────┤
│ [😊] [👊 Nudge!] [🎤] [📞] [🎨]        │  ← Toolbar
├─────────────────────────────────────────┤
│  ┌──────────────────────────┐           │
│  │ Mensagem do usuário      │           │  ← Blue gradient bubble
│  └──────────────────────────┘           │
│           ┌──────────────────────┐       │
│           │ Resposta Fsociety    │       │  ← White bubble
│           └──────────────────────┘       │
│  ┌──────────────────────────┐           │
│  │ * * * NUDGE * * *        │           │  ← Nudge message
│  └──────────────────────────┘           │
├─────────────────────────────────────────┤
│ ✏ Digite uma mensagem...        [Send]  │
├─────────────────────────────────────────┤
│ Última mensagem: 14:32                  │  ← Status bar
└─────────────────────────────────────────┘
```

### 2.4 Components

**MSGMain.jsx** (opens as window `msg-main`):
- States: `loggedIn`, `status` (online/away/busy/offline), `personalMessage`, `soundEnabled`
- Login screen (same as current MSG.jsx)
- Main screen: user info + search + contact list + settings
- Double-click Fsociety → opens `msg-conversation` window

**MSGConversation.jsx** (opens as window `msg-conversation`):
- Props: `contactName`, `contactAvatar`
- States: `messages`, `shaking`, `inputText`
- Toolbar: emoji (placeholder), Nudge, Voice (placeholder), Call (placeholder), Font (placeholder)
- Nudge: triggers CSS shake animation on the window container
- Chat bubbles: WLM style (blue gradient for user, white for contact)
- Input: textarea + send button

### 2.5 Sounds

Download 3 WLM sound files to `src/assets/sounds/`:
- `wlm_login.wav` — login sound (classic WLM typewriter)
- `wlm_newmsg.wav` — new message notification
- `wlm_nudge.wav` — nudge sound

Play sounds via `new Audio()`:
- Login: on successful login
- New message: on each AI reply received
- Nudge: on nudge send and receive

### 2.6 Nudge/Shake Effect

When nudge button clicked:
1. Play `wlm_nudge.wav`
2. Add message "enviou um nudge!" to chat
3. Trigger shake animation on conversation window:
   ```css
   @keyframes nudge-shake {
     0%, 100% { transform: translateX(0); }
     10%, 50%, 90% { transform: translateX(-8px); }
     30%, 70% { transform: translateX(8px); }
   }
   ```
4. Animation duration: 800ms
5. After shake: AI responds with a nudge-related message

### 2.7 Settings

Access via gear icon ⚙ in main window bottom bar:
- **Status:** Online / Away / Busy / Appear Offline (dropdown)
- **Mensagem pessoal:** Text input (max 100 chars)
- **Som:** Toggle on/off
- **Trocar DP:** Placeholder (opens file picker)
- **Cor do tema:** WLM default blue (no customization needed yet)

### 2.8 Store Changes

Add to `useOSStore.js`:
- `msgStatus` (online/away/busy/offline) + setter
- `msgPersonalMessage` (string) + setter
- `msgSoundEnabled` (boolean, default true) + setter
- `msgConversationOpen` (boolean) + setter
- Window config for `msg-main` (300x500, no menu bar)
- Window config for `msg-conversation` (500x420, no menu bar)

### 2.9 Register in Desktop.jsx

- Main window: `id="msg-main"` icon on desktop
- Conversation window: opened programmatically via `openWindow()` on double-click

## 3. Files Changed

| File | Action |
|------|--------|
| `src/components/os/Win7AeroIcons.jsx` | **NEW** - SVG Aero icons |
| `src/components/os/Desktop.jsx` | **EDIT** - AeroIcon + Win7 DesktopIcon styles |
| `src/components/apps/MSGMain.jsx` | **NEW** - WLM main window |
| `src/components/apps/MSGConversation.jsx` | **NEW** - WLM conversation window |
| `src/store/useOSStore.js` | **EDIT** - Add WLM state + window configs |
| `src/assets/sounds/` | **NEW** - 3 WLM sound files |
| `src/components/apps/MSG.jsx` | **DELETE** - Replaced by MSGMain + MSGConversation |

## 4. What Stays the Same

- Telegram Bot API integration (sendMessage + getUpdates polling)
- Gemini AI conversation (system prompt, history, fallback)
- XP theme icons (unchanged; Win7Icon is only used when theme === 'win7')
- Aero Snap + Shake (window-level feature, unaffected)
- Alt+Tab switcher
- Desktop Gadgets
- Jump Lists
