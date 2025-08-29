# Git Commit and Branch Naming Instructions for GitHub Copilot Coding Agent

## Overview
This repository follows strict conventions for both commit messages and branch names to ensure clarity, traceability, and automation compatibility. All contributions—automated or manual—must adhere to these standards. This document provides the required specifications for the Copilot Coding Agent.

---

## 1. Commit Message Specification

All commit messages **must** follow the [Conventional Commits 1.0.0 specification](https://www.conventionalcommits.org/en/v1.0.0/#specification). This enables automated changelogs, semantic versioning, and clear project history.

### Commit Message Format
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### Examples
- `feat(platform): add support for new Somfy Protect device`
- `fix(settings): correct config schema validation`
- `docs(readme): update usage instructions`
- `refactor(platformAccessory): simplify accessory registration logic`
- `test: add example Homebridge config for testing`

### Allowed Commit Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only changes
- `style`: Formatting, missing semi colons, etc. (no code change)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Performance improvement
- `test`: Adding or correcting tests
- `build`: Changes to build process or dependencies
- `ci`: Changes to CI configuration
- `chore`: Maintenance, tooling, or other changes
- `revert`: Revert a previous commit

### Commit Scope
- Use the relevant file, module, or feature as the scope (e.g., `platform`, `settings`, `config`, `readme`).
- Omit scope if not applicable.

### Commit Description
- Use the imperative mood (e.g., "add", "fix", "update").
- Keep under 72 characters.

---

## 2. Branch Naming Specification

All branch names **must** follow the [Conventional Branch specification](https://conventional-branch.github.io/#specification) for consistency and automation.

### Branch Name Format
```
<type>[/<scope>][/<description>]
```
- Use hyphens (`-`) to separate words in the description.
- All branch names must be lowercase.

#### Examples
- `feat/platform-add-alarm-support`
- `fix/settings-schema-validation`
- `docs/readme-update`
- `refactor/platformaccessory-cleanup`
- `test/add-example-config`
- `chore/update-dependencies`

### Allowed Branch Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only changes
- `style`: Formatting, missing semi colons, etc. (no code change)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Performance improvement
- `test`: Adding or correcting tests
- `build`: Changes to build process or dependencies
- `ci`: Changes to CI configuration
- `chore`: Maintenance, tooling, or other changes
- `revert`: Revert a previous branch

### Branch Scope and Description
- Scope is optional but recommended for clarity (e.g., file, module, or feature).
- Description should be concise and use hyphens for word separation.

---

## 3. General Guidance
- **Always** use these conventions for all commits and branches, including automated changes.
- **Never** use generic names like `dev`, `feature`, or `bugfix` alone.
- For pull requests, the branch name should reflect the change type and scope.
- If unsure, refer to the linked specifications above.

---

**References:**
- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#specification)
- [Conventional Branch](https://conventional-branch.github.io/#specification)

---

Adhering to these conventions ensures high-quality, maintainable, and automatable contributions for this Homebridge plugin repository.

