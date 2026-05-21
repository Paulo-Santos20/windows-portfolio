# Windows Portfolio 🪟

Simulação interativa do **Windows 7** (Aero) e **Windows XP** rodando no navegador. Feita com React, Vite e Tailwind CSS.

Inclui área de trabalho, barra de tarefas, menu iniciar e uma suíte de aplicativos clássicos — tudo rodando 100% no front-end.

## 🚀 Como rodar

```bash
npm install
npm run dev
```

Para build de produção:

```bash
npm run build
npm run preview
```

## 🧰 Stack

- **React 19** + **Vite 7**
- **Tailwind CSS 3** — estilização
- **Zustand** — gerenciamento de estado global
- **Lucide React** — ícones
- **react-rnd** — janelas redimensionáveis e arrastáveis

## 🖥️ Aplicativos inclusos

| App | Descrição |
|-----|-----------|
| **Internet Explorer** | Navegador com iframe, histórico, favoritos |
| **Windows Live Messenger** | Chat com IA (Gemini) personificando Mr. Robot / fsociety |
| **Windows Media Player** | Player de música com visualizações |
| **Paint** | Editor de desenho com lápis, pincel e borracha |
| **Calculadora** | Calculadora estilo Windows |
| **Terminal** | Prompt de comando simulado |
| **Bloco de Notas** | Editor de texto simples |
| **Explorador de Arquivos** | Gerenciador de arquivos |
| **Visualizador de PDF** | Leitor de PDF embutido |
| **Jogos** | Jogo da velha, damas, xadrez |
| **Painel de Controle** | Configurações do tema |
| **Sobre Mim** | Portfólio profissional |

## 🎨 Temas

- **Windows 7 Aero** — vidro translúcido, superbar, orb, Aero Peek
- **Windows XP** — tema clássico azul, start menu XP, taskbar XP

Os ícones da área de trabalho e menu iniciar usam recursos reais extraídos de `shell32.dll`, `imageres.dll` e outros via [Visnalize/resources](https://github.com/Visnalize/resources).

## 🤖 Mr. Robot / fsociety

O MSN Messenger usa a **Gemini API** para conversar como **Mr. Robot** (Elliot Alderson). A IA é restrita a responder apenas sobre:
- Paulo Cardoso (o desenvolvedor do sistema)
- Projetos no GitHub
- Currículo e habilidades
- A série Mr. Robot e o fsociety

Tópicos fora disso são bloqueados. Requer `VITE_GEMINI_API_KEY` no `.env`.

## 📁 Estrutura

```
src/
├── assets/         # Ícones .ico, wallpapers, PDF
├── components/
│   ├── apps/       # Aplicativos (Browser, Paint, MSG, etc.)
│   └── os/         # Sistema (Desktop, Taskbar, WindowFrame, etc.)
├── store/          # Zustand stores
└── utils/          # Utilitários (sons WLM, etc.)
```

## 📄 Licença

MIT
