# Manjaro KDE Web

A web-based simulation of the Manjaro KDE Plasma desktop environment, built with **Next.js**, **Tailwind CSS**, and **Zustand**.

![Manjaro KDE Web](public/images/wallpaper.png)

## Features

- **Desktop Environment**: Draggable windows, taskbar, start menu (placeholder), and system tray.
- **Window Management**: Minimize, maximize, close, and bring-to-front functionality.
- **Lock Screen**: Simulated lock screen with password entry and power options (Shutdown/Reboot).
- **File System**: Simulated file system with `Dolphin` file manager navigation.
- **Terminal**: Interactive terminal with commands like `ls`, `cd`, `pwd`, `help`, `xdg-open`.
- **Apps**:
  - **Terminal**: Command line interface.
  - **Dolphin**: File manager.
  - **Settings**: System information.
  - **Music**: Audio player (visuals only).
  - **Image Viewer**: View system images.
  - **VSCode**: Embedded Github1s.
  - **Chrome**: Embedded browser placeholder.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Icons**: SVG Sprites / Custom Components
- **Testing**: Vitest + React Testing Library

## Getting Started

### Prerequisites

- Node.js 18+
- Bun (optional, but recommended) or npm/yarn/pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/RobbyV2/manjaro-kde-web.git
   cd manjaro-kde-web
   ```

2. Install dependencies:
   ```bash
   bun install
   # or
   npm install
   ```

3. Run the development server:
   ```bash
   bun run dev
   # or
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser.

## Project Structure

- `src/app`: Next.js App Router pages and layout.
- `src/apps`: Individual application components (Terminal, Dolphin, etc.).
- `src/components`: Core UI components (Desktop, Taskbar, Window).
- `src/store`: Global state management (Zustand).
- `src/data`: Simulated filesystem data.
- `src/utils`: Utility functions.
- `public`: Static assets (images, icons).

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feat/feature-name`).
3. Commit your changes (`git commit -m 'feat: add some feature'`).
4. Push to the branch (`git push origin feat/feature-name`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License.