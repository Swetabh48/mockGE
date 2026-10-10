"""
Production Ollama host for mockge-ies-civil on Modal.

Deploy:
  modal deploy infra/serve_mockge_ies_ollama.py

Then set on Vercel:
  OLLAMA_IES_BASE_URL=<https URL printed by Modal>
  OLLAMA_IES_MODEL=mockge-ies-civil
"""

from __future__ import annotations

import os
import subprocess
import time
from pathlib import Path

import modal

APP_NAME = "mockge-ies-ollama"
MODEL_NAME = "mockge-ies-civil"
OLLAMA_PORT = 11434
MODELFILE = Path(__file__).with_name("Modelfile.mockge-ies-civil")

vol = modal.Volume.from_name("mockge-ies-ollama-models", create_if_missing=True)

image = (
    modal.Image.debian_slim(python_version="3.11")
    .apt_install("curl", "ca-certificates", "zstd")
    .run_commands(
        "curl -fsSL https://ollama.com/install.sh | sh",
    )
    .env({"OLLAMA_HOST": f"0.0.0.0:{OLLAMA_PORT}"})
    .add_local_file(str(MODELFILE), remote_path="/root/Modelfile.mockge-ies-civil", copy=True)
)

app = modal.App(APP_NAME, image=image)


def _wait_ollama(timeout: int = 120) -> None:
    import urllib.request

    deadline = time.time() + timeout
    while time.time() < deadline:
        try:
            with urllib.request.urlopen(f"http://127.0.0.1:{OLLAMA_PORT}/api/tags", timeout=2) as r:
                if r.status == 200:
                    return
        except Exception:
            time.sleep(1)
    raise RuntimeError("Ollama failed to start")


def _ensure_model() -> None:
    tags = subprocess.check_output(["ollama", "list"], text=True)
    if MODEL_NAME in tags:
        return
    subprocess.check_call(["ollama", "pull", "llama3.2:latest"])
    # Prefer fine-tuned Modelfile if present on volume from train job
    tuned = Path("/root/.ollama/Modelfile.mockge-ies-civil.tuned")
    mf = str(tuned) if tuned.exists() else "/root/Modelfile.mockge-ies-civil"
    subprocess.check_call(["ollama", "create", MODEL_NAME, "-f", mf])


@app.cls(
    # Set gpu="T4" once Modal billing is linked for faster inference.
    cpu=4,
    memory=8192,
    timeout=60 * 15,
    scaledown_window=60 * 5,
    volumes={"/root/.ollama": vol},
)
@modal.concurrent(max_inputs=4)
class MockgeIesOllama:
    @modal.enter()
    def start(self):
        subprocess.Popen(
            ["ollama", "serve"],
            env={**os.environ, "OLLAMA_HOST": f"0.0.0.0:{OLLAMA_PORT}"},
        )
        _wait_ollama()
        _ensure_model()
        vol.commit()

    @modal.web_server(port=OLLAMA_PORT, startup_timeout=60 * 10)
    def serve(self):
        return


@app.local_entrypoint()
def main():
    print("Deploy with: modal deploy infra/serve_mockge_ies_ollama.py")
    print("Then set Vercel OLLAMA_IES_BASE_URL to the printed .modal.run URL")
