# Contributing to Manjaro KDE Web

Thank you for your interest in contributing! We welcome all contributions, big or small.

## Getting Started

1.  **Fork the repository** on GitHub.
2.  **Clone your fork** locally:
    ```bash
    git clone https://github.com/your-username/manjaro-kde-web.git
    ```
3.  **Install dependencies**:
    ```bash
    bun install
    ```
4.  **Create a branch** for your feature or fix:
    ```bash
    git checkout -b feat/your-feature
    ```

## Workflow

- We use **GitHub Issues** to track tasks. Please check if an issue exists or create one before starting work.
- We use a **Sprint** based workflow (simulated).
- **Pull Requests** should target the `develop` branch.

## Code Style

- Use **TypeScript** for all new components.
- Use **Tailwind CSS** for styling.
- Ensure all tests pass: `bun run test`.
- Lint your code: `bun run lint`.

## Commit Messages

Please follow conventional commits:
- `feat(...)`: New feature
- `fix(...)`: Bug fix
- `docs(...)`: Documentation
- `chore(...)`: Maintenance

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
