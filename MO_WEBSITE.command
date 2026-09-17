#!/bin/zsh
cd -- "${0:A:h}"
VBNA_PYTHON="/Users/soainguyen/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3"
if [[ ! -x "$VBNA_PYTHON" ]]; then
  VBNA_PYTHON="$(command -v python3)"
fi
if [[ -z "$VBNA_PYTHON" ]]; then
  print "Cần cài Python 3 để mở website trên máy."
  read "?Nhấn Enter để đóng."
  exit 1
fi
"$VBNA_PYTHON" serve.py
read "?Nhấn Enter để đóng."
