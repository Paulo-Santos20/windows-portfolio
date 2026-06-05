# Windows Portfolio

Simulação interativa do **Windows 7** (Aero) e **Windows XP** rodando no navegador. Inclui área de trabalho, barra de tarefas, menu iniciar e uma suíte de aplicativos clássicos — tudo 100% front-end.

## Stack

- **React 19** + **Vite 7**
- **Tailwind CSS 3**
- **Zustand** — estado global
- **Lucide React** — ícones
- **react-rnd** — janelas redimensionáveis/arrastáveis

## Aplicativos

| App | Descrição |
|-----|-----------|
| **Internet Explorer** | Navegador com iframe, histórico, favoritos |
| **Windows Live Messenger** | Chat com IA (Gemini) personificando Mr. Robot |
| **Windows Media Player** | Player WMP9 com visualizações |
| **Paint** | Editor com lápis, pincel, borracha (com preview) |
| **Calculadora** | Calculadora estilo Windows |
| **Terminal** | Prompt de comando simulado com histórico por setas |
| **Bloco de Notas** | Editor de texto simples |
| **Explorador de Arquivos** | Gerenciador de arquivos estilo Windows |
| **Visualizador de PDF** | Leitor de PDF embutido |
| **Jogos** | Xadrez (com pré-moves e IA), damas, campo minado, paciência |
| **Painel de Controle** | Troca de tema (Win7/XP), wallpapers |
| **Sobre Mim** | Portfólio profissional com currículo |
| **Meus Projetos** | Galeria de projetos com screenshots reais |

## Easter Eggs

- **fsociety00.dat** no Terminal — senha: `leavemehere` → countdown para 19/07/2026

## Como rodar

```bash
npm install
npm run dev      # dev server localhost:5173
npm run build    # build produção
npm run preview  # preview do build
```

Tema padrão: WinXP (alterna em Painel de Controle). Requer `VITE_GEMINI_API_KEY` no `.env` para o MSN Messenger.

## Estrutura

```
src/
├── assets/         # Ícones .ico, wallpapers, screenshots, avatar, curriculo.pdf
├── components/
│   ├── apps/       # Aplicativos (Browser, Paint, ChessTitans, FsocietyPage, etc.)
│   └── os/         # Sistema (Desktop, Taskbar, WindowFrame, BootSequence, etc.)
├── store/          # Zustand (useOSStore.js)
└── utils/          # Utilitários (sons WLM, etc.)
```

## Licença

MIT
