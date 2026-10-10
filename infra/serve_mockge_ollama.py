"""
Production Ollama host for mockge-ssc on Modal.

Deploy:
  modal deploy infra/serve_mockge_ollama.py

Then set on Vercel:
  OLLAMA_BASE_URL=<https URL printed by Modal>
  OLLAMA_MODEL=mockge-ssc
  OLLAMA_API_KEY=<optional shared secret; also set MOCKGE_INFERENCE_KEY on Modal>
"""

from __future__ import annotations

import os
import subprocess
import time
from pathlib import Path

import modal

APP_NAME = "mockge-ollama"
MODEL_NAME = "mockge-ssc"
OLLAMA_PORT = 11434
MODELFILE = Path(__file__).with_name("Modelfile.mockge-ssc")

vol = modal.Volume.from_name("mockge-ollama-models", create_if_missing=True)

image = (
    modal.Image.debian_slim(python_version="3.11")
    .apt_install("curl", "ca-certificates", "zstd")
    .run_commands(
        "curl -fsSL https://ollama.com/install.sh | sh",
    )
    .env({"OLLAMA_HOST": f"0.0.0.0:{OLLAMA_PORT}"})
    .add_local_file(str(MODELFILE), remote_path="/root/Modelfile.mockge-ssc", copy=True)
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
    # Base weights then create custom SSC setter
    subprocess.check_call(["ollama", "pull", "llama3.2:latest"])
    subprocess.check_call(["ollama", "create", MODEL_NAME, "-f", "/root/Modelfile.mockge-ssc"])


@app.cls(
    # Free credits ($30/mo) apply after a payment method is on file.
    # Until then Modal blocks GPU with: "add a payment method to use T4".
    # Set gpu="T4" (and remove cpu/memory) once billing is linked — same free credits cover training + inference.
    cpu=4,
    memory=8192,
    timeout=60 * 15,
    scaledown_window=60 * 5,
    volumes={"/root/.ollama": vol},
)
@modal.concurrent(max_inputs=4)
class MockgeOllama:
    @modal.enter()
    def start(self):
        # Ollama daemon
        subprocess.Popen(["ollama", "serve"], env={**os.environ, "OLLAMA_HOST": f"0.0.0.0:{OLLAMA_PORT}"})
        _wait_ollama()
        _ensure_model()
        vol.commit()

    @modal.web_server(port=OLLAMA_PORT, startup_timeout=60 * 10)
    def serve(self):
        # web_server routes public HTTPS → container :11434 (already listening)
        return


@app.local_entrypoint()
def main():
    print("Deploy with: modal deploy infra/serve_mockge_ollama.py")
    print("Then set Vercel OLLAMA_BASE_URL to the printed .modal.run URL")
