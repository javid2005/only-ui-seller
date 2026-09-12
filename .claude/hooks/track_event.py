#!/usr/bin/env python3
"""Claude Code hook handler: forwards every hook event to the local
live-dashboard server, and, when a transcript is available, computes the
token-usage delta since the last time this session was seen (by reading only
the new bytes appended to the transcript's JSONL file).

Never raises and never blocks Claude Code: any failure (dashboard not
running, malformed input, unreadable transcript) is swallowed and the
process exits 0.
"""
import json
import os
import sys
import time
import urllib.request

DASHBOARD_URL = os.environ.get("CLAUDE_DASHBOARD_URL", "http://127.0.0.1:4317/event")
STATE_DIR = os.path.expanduser("~/.claude-dashboard/offsets")

USAGE_FIELDS = (
    "input_tokens",
    "output_tokens",
    "cache_creation_input_tokens",
    "cache_read_input_tokens",
)


def read_stdin_json():
    try:
        raw = sys.stdin.read()
        return json.loads(raw) if raw.strip() else {}
    except Exception:
        return {}


def token_delta(transcript_path, session_id):
    """Sum usage fields from any assistant messages appended to the
    transcript since the last call for this session. Returns None if there
    is nothing new or the transcript can't be read."""
    if not transcript_path or not session_id or not os.path.exists(transcript_path):
        return None

    try:
        os.makedirs(STATE_DIR, exist_ok=True)
        offset_file = os.path.join(STATE_DIR, f"{session_id}.offset")
        last_offset = 0
        if os.path.exists(offset_file):
            try:
                last_offset = int(open(offset_file).read().strip() or 0)
            except Exception:
                last_offset = 0

        with open(transcript_path, "r", encoding="utf-8", errors="ignore") as f:
            f.seek(last_offset)
            new_data = f.read()
            new_offset = f.tell()

        totals = {k: 0 for k in USAGE_FIELDS}
        for line in new_data.splitlines():
            line = line.strip()
            if not line:
                continue
            try:
                obj = json.loads(line)
            except Exception:
                continue
            msg = obj.get("message") if isinstance(obj, dict) else None
            usage = msg.get("usage") if isinstance(msg, dict) else None
            if isinstance(usage, dict):
                for k in USAGE_FIELDS:
                    v = usage.get(k)
                    if isinstance(v, (int, float)):
                        totals[k] += v

        with open(offset_file, "w") as f:
            f.write(str(new_offset))

        return totals if any(totals.values()) else None
    except Exception:
        return None


def main():
    data = read_stdin_json()
    session_id = data.get("session_id", "unknown")

    payload = {
        "hook_event_name": data.get("hook_event_name"),
        "session_id": session_id,
        "cwd": data.get("cwd"),
        "tool_name": data.get("tool_name"),
        "tool_input": data.get("tool_input"),
        "tool_use_id": data.get("tool_use_id"),
        "agent_id": data.get("agent_id"),
        "agent_type": data.get("agent_type"),
        "permission_mode": data.get("permission_mode"),
        "model": data.get("model"),
        "ts": time.time() * 1000,
    }

    delta = token_delta(data.get("transcript_path"), session_id)
    if delta:
        payload["tokenDelta"] = delta

    try:
        req = urllib.request.Request(
            DASHBOARD_URL,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        urllib.request.urlopen(req, timeout=0.6)
    except Exception:
        pass  # dashboard offline — never break the session


if __name__ == "__main__":
    main()
    sys.exit(0)
