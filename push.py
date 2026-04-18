#!/usr/bin/env python3
"""
Commit and push the current working tree to
https://github.com/a7madd-dev/portfolio.git.

Usage:
    python push.py                      # prompts for a commit message
    python push.py -m "your message"    # non-interactive
    python push.py --amend              # amend the last commit instead
    python push.py --branch main        # override the branch (default: current)

The script is idempotent:
  - adds the `origin` remote if it's missing
  - fixes the remote URL if it points somewhere else
  - skips the commit step when there's nothing staged
  - always ends with `git push -u origin <branch>`
"""

from __future__ import annotations

import argparse
import subprocess
import sys
from datetime import datetime
from pathlib import Path

REMOTE_NAME = "origin"
REMOTE_URL = "https://github.com/a7madd-dev/portfolio.git"


class GitError(RuntimeError):
    """Raised when a git subprocess exits non-zero."""


def run(
    args: list[str],
    *,
    capture: bool = False,
    check: bool = True,
) -> subprocess.CompletedProcess[str]:
    """Run a git command, streaming output unless `capture` is True."""
    printable = " ".join(args)
    print(f"$ {printable}")
    result = subprocess.run(
        args,
        text=True,
        capture_output=capture,
        check=False,
    )
    if capture and result.stdout:
        # Echo captured output so the user still sees what git said.
        sys.stdout.write(result.stdout)
    if check and result.returncode != 0:
        stderr = result.stderr.strip() if capture else ""
        raise GitError(
            f"`{printable}` exited with code {result.returncode}"
            + (f": {stderr}" if stderr else "")
        )
    return result


def ensure_git_repo() -> None:
    try:
        run(["git", "rev-parse", "--is-inside-work-tree"], capture=True)
    except GitError as err:
        raise GitError("Not inside a git repository. Run this from the project root.") from err


def ensure_remote() -> None:
    """Make sure `origin` exists and points at the configured URL."""
    existing = subprocess.run(
        ["git", "remote", "get-url", REMOTE_NAME],
        text=True,
        capture_output=True,
        check=False,
    )
    if existing.returncode != 0:
        run(["git", "remote", "add", REMOTE_NAME, REMOTE_URL])
        return

    current = existing.stdout.strip()
    if current != REMOTE_URL:
        print(f"→ Updating remote '{REMOTE_NAME}': {current} → {REMOTE_URL}")
        run(["git", "remote", "set-url", REMOTE_NAME, REMOTE_URL])
    else:
        print(f"→ Remote '{REMOTE_NAME}' already points at {REMOTE_URL}")


def current_branch() -> str:
    result = run(["git", "rev-parse", "--abbrev-ref", "HEAD"], capture=True)
    return result.stdout.strip()


def has_staged_changes() -> bool:
    # `git diff --cached --quiet` exits 1 when there is a staged diff.
    result = subprocess.run(
        ["git", "diff", "--cached", "--quiet"],
        check=False,
    )
    return result.returncode != 0


def working_tree_dirty() -> bool:
    result = run(["git", "status", "--porcelain"], capture=True)
    return bool(result.stdout.strip())


def resolve_message(cli_message: str | None) -> str:
    if cli_message:
        return cli_message
    try:
        entered = input("Commit message (blank = timestamp): ").strip()
    except EOFError:
        entered = ""
    if entered:
        return entered
    return f"chore: update ({datetime.now().strftime('%Y-%m-%d %H:%M:%S')})"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("-m", "--message", help="Commit message")
    parser.add_argument(
        "--amend",
        action="store_true",
        help="Amend the last commit instead of creating a new one",
    )
    parser.add_argument(
        "--branch",
        default=None,
        help="Branch to push (default: current)",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Use --force-with-lease on push (safer than --force)",
    )
    args = parser.parse_args()

    # Run every git command from the repo root so relative CWD doesn't matter.
    import os

    os.chdir(Path(__file__).resolve().parent)

    try:
        ensure_git_repo()
        ensure_remote()

        branch = args.branch or current_branch()
        if not branch or branch == "HEAD":
            raise GitError("Detached HEAD — check out a branch before pushing.")

        if working_tree_dirty():
            run(["git", "add", "-A"])
        else:
            print("→ Working tree clean — nothing to stage.")

        if has_staged_changes():
            if args.amend:
                run(["git", "commit", "--amend", "--no-edit"])
            else:
                message = resolve_message(args.message)
                run(["git", "commit", "-m", message])
        elif args.amend:
            # Allow `--amend` even with nothing staged (message/metadata only).
            run(["git", "commit", "--amend", "--no-edit", "--allow-empty"])
        else:
            print("→ No staged changes — skipping commit.")

        push_cmd = ["git", "push", "-u", REMOTE_NAME, branch]
        if args.force:
            push_cmd.insert(2, "--force-with-lease")
        run(push_cmd)

        print(f"\n✓ Pushed '{branch}' → {REMOTE_URL}")
        return 0

    except GitError as err:
        print(f"\n✗ {err}", file=sys.stderr)
        return 1
    except KeyboardInterrupt:
        print("\n✗ Interrupted.", file=sys.stderr)
        return 130


if __name__ == "__main__":
    raise SystemExit(main())
