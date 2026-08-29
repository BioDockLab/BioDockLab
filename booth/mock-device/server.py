from __future__ import annotations

import json
import time
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Any
from urllib.parse import urlparse


HOST = "127.0.0.1"
PORT = 8765

BASE_URL = f"http://{HOST}:{PORT}"
MOCK_IMAGE_PATH = "/api/cellscope/image/latest"
MOCK_IMAGE_URL = f"{BASE_URL}{MOCK_IMAGE_PATH}"


SAMPLE = {
    "id": "ORG-BRAIN-001",
    "markerId": "BDL-GBM-001",
    "label": "뇌 오가노이드 연구 샘플",
    "model": "brain-organoid",
    "disease": "glioblastoma",
    "imageLabel": "Mock Camera Module 3 이미지",
    "imageUrl": MOCK_IMAGE_URL,
}


VALID_LED_STATES = {
    "idle",
    "checking-device",
    "waiting-for-sample",
    "sample-detected",
    "capturing",
    "analyzing",
    "complete",
    "error",
}


device_state = {
    "led": "idle",
    "camera": True,
    "button": True,
    "service": "CellScope Mock Raspberry Pi",
    "lastCaptureAt": None,
}


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def create_mock_camera_svg() -> bytes:
    """
    Camera Module 3가 아직 없는 개발 환경에서 사용할
    교육용 CellScope mock 이미지를 SVG로 생성한다.

    실제 Raspberry Pi에서는 이 endpoint가 JPEG/PNG 촬영 이미지로
    교체될 수 있으며 frontend의 imageUrl contract는 그대로 유지한다.
    """

    svg = """
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="1200"
  height="760"
  viewBox="0 0 1200 760"
>
  <defs>
    <radialGradient id="background" cx="50%" cy="45%" r="70%">
      <stop offset="0%" stop-color="#35266f"/>
      <stop offset="45%" stop-color="#18234f"/>
      <stop offset="100%" stop-color="#07152f"/>
    </radialGradient>

    <radialGradient id="cellA" cx="40%" cy="35%" r="70%">
      <stop offset="0%" stop-color="#d8c8ff"/>
      <stop offset="45%" stop-color="#9878e7"/>
      <stop offset="100%" stop-color="#503495"/>
    </radialGradient>

    <radialGradient id="cellB" cx="40%" cy="35%" r="70%">
      <stop offset="0%" stop-color="#b8efff"/>
      <stop offset="45%" stop-color="#54b7d7"/>
      <stop offset="100%" stop-color="#245a82"/>
    </radialGradient>

    <filter id="glow">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <filter id="soft">
      <feGaussianBlur stdDeviation="2"/>
    </filter>
  </defs>

  <rect
    width="1200"
    height="760"
    fill="url(#background)"
  />

  <g opacity=".25">
    <circle cx="120" cy="120" r="55" fill="#6ea8ff"/>
    <circle cx="1060" cy="120" r="80" fill="#8e74e8"/>
    <circle cx="1020" cy="650" r="105" fill="#4eaacb"/>
    <circle cx="160" cy="650" r="95" fill="#7154c7"/>
  </g>

  <g filter="url(#soft)" opacity=".36">
    <circle cx="260" cy="220" r="20" fill="#9edcff"/>
    <circle cx="840" cy="175" r="16" fill="#d0c3ff"/>
    <circle cx="950" cy="330" r="24" fill="#8dd5ef"/>
    <circle cx="260" cy="540" r="19" fill="#b5a5ef"/>
    <circle cx="850" cy="575" r="23" fill="#87cce4"/>
    <circle cx="410" cy="130" r="12" fill="#d2c8ff"/>
  </g>

  <g
    transform="translate(600 380)"
    filter="url(#glow)"
  >
    <circle
      cx="0"
      cy="0"
      r="214"
      fill="#422d80"
      opacity=".42"
    />

    <circle
      cx="-65"
      cy="-55"
      r="125"
      fill="url(#cellA)"
      opacity=".92"
    />

    <circle
      cx="72"
      cy="-30"
      r="112"
      fill="url(#cellB)"
      opacity=".86"
    />

    <circle
      cx="-20"
      cy="85"
      r="138"
      fill="url(#cellA)"
      opacity=".78"
    />

    <circle
      cx="-78"
      cy="50"
      r="57"
      fill="#d7c5ff"
      opacity=".48"
    />

    <circle
      cx="92"
      cy="55"
      r="48"
      fill="#a8edff"
      opacity=".38"
    />

    <circle
      cx="10"
      cy="-115"
      r="36"
      fill="#eadfff"
      opacity=".45"
    />

    <circle
      cx="5"
      cy="10"
      r="58"
      fill="#172c68"
      opacity=".42"
    />
  </g>

  <g
    fill="none"
    stroke="#8fd7ff"
    stroke-width="2"
    opacity=".42"
  >
    <circle cx="600" cy="380" r="255"/>
    <circle cx="600" cy="380" r="275"/>
  </g>

  <g
    font-family="Arial, sans-serif"
    fill="#ffffff"
  >
    <text
      x="44"
      y="58"
      font-size="24"
      font-weight="700"
    >
      BIO AI CELLSCOPE
    </text>

    <text
      x="44"
      y="90"
      font-size="16"
      opacity=".68"
    >
      Mock Camera Module 3 · Educational Preview
    </text>
  </g>

  <g
    transform="translate(915 665)"
    font-family="Arial, sans-serif"
  >
    <rect
      width="240"
      height="54"
      rx="14"
      fill="#07152f"
      opacity=".66"
    />

    <circle
      cx="28"
      cy="27"
      r="7"
      fill="#50d59d"
    />

    <text
      x="47"
      y="33"
      fill="#ffffff"
      font-size="15"
    >
      MOCK CAMERA ONLINE
    </text>
  </g>
</svg>
""".strip()

    return svg.encode("utf-8")


MOCK_CAMERA_IMAGE = create_mock_camera_svg()


class CellScopeMockHandler(BaseHTTPRequestHandler):
    server_version = "CellScopeMock/1.1"

    def log_message(
        self,
        format: str,
        *args: Any,
    ) -> None:
        print(
            f"[{self.log_date_time_string()}] "
            f"{self.address_string()} - {format % args}"
        )

    def _send_cors_headers(self) -> None:
        self.send_header(
            "Access-Control-Allow-Origin",
            "*",
        )
        self.send_header(
            "Access-Control-Allow-Methods",
            "GET, POST, OPTIONS",
        )
        self.send_header(
            "Access-Control-Allow-Headers",
            "Content-Type, Accept",
        )

    def _send_json(
        self,
        status_code: int,
        payload: dict[str, Any],
    ) -> None:
        data = json.dumps(
            payload,
            ensure_ascii=False,
        ).encode("utf-8")

        self.send_response(status_code)

        self.send_header(
            "Content-Type",
            "application/json; charset=utf-8",
        )
        self.send_header(
            "Content-Length",
            str(len(data)),
        )

        self._send_cors_headers()

        self.end_headers()
        self.wfile.write(data)

    def _send_image(
        self,
        status_code: int,
        data: bytes,
        content_type: str,
    ) -> None:
        self.send_response(status_code)

        self.send_header(
            "Content-Type",
            content_type,
        )
        self.send_header(
            "Content-Length",
            str(len(data)),
        )

        self.send_header(
            "Cache-Control",
            "no-store, no-cache, must-revalidate",
        )

        self._send_cors_headers()

        self.end_headers()
        self.wfile.write(data)

    def _read_json(self) -> dict[str, Any]:
        content_length = int(
            self.headers.get(
                "Content-Length",
                "0",
            )
        )

        if content_length <= 0:
            return {}

        raw = self.rfile.read(content_length)

        try:
            payload = json.loads(
                raw.decode("utf-8")
            )
        except json.JSONDecodeError:
            return {}

        if isinstance(payload, dict):
            return payload

        return {}

    def do_OPTIONS(self) -> None:
        self.send_response(204)

        self._send_cors_headers()

        self.end_headers()

    def do_GET(self) -> None:
        path = urlparse(self.path).path

        if path == "/api/cellscope/health":
            self._send_json(
                200,
                {
                    "ok": True,
                    "camera": device_state["camera"],
                    "button": device_state["button"],
                    "led": True,
                    "service": device_state["service"],
                },
            )
            return

        if path == "/api/cellscope/sample":
            print(
                "[CellScope] Mock sample detected"
            )

            time.sleep(0.35)

            self._send_json(
                200,
                SAMPLE,
            )
            return

        if path == MOCK_IMAGE_PATH:
            device_state["lastCaptureAt"] = utc_now()

            print(
                "[CellScope Camera] "
                "Serving mock Camera Module 3 image"
            )

            self._send_image(
                200,
                MOCK_CAMERA_IMAGE,
                "image/svg+xml; charset=utf-8",
            )
            return

        if path == "/api/cellscope/debug":
            self._send_json(
                200,
                {
                    "ok": True,
                    "device": device_state,
                    "sample": SAMPLE,
                    "imageUrl": MOCK_IMAGE_URL,
                    "timestamp": utc_now(),
                },
            )
            return

        self._send_json(
            404,
            {
                "ok": False,
                "error": "Not found",
                "path": path,
            },
        )

    def do_POST(self) -> None:
        path = urlparse(self.path).path
        body = self._read_json()

        if path == "/api/cellscope/led":
            state = body.get("state")

            if state not in VALID_LED_STATES:
                self._send_json(
                    400,
                    {
                        "ok": False,
                        "error": "Invalid LED state",
                        "state": state,
                    },
                )
                return

            device_state["led"] = state

            print(
                f"[CellScope LED] state -> {state}"
            )

            self._send_json(
                200,
                {
                    "ok": True,
                    "state": state,
                },
            )
            return

        if path == "/api/cellscope/analyze":
            sample = body.get("sample")

            if not isinstance(sample, dict):
                self._send_json(
                    400,
                    {
                        "ok": False,
                        "error": "sample is required",
                    },
                )
                return

            sample_id = sample.get(
                "id",
                "UNKNOWN",
            )

            print(
                f"[CellScope] "
                f"Analyzing sample {sample_id}"
            )

            device_state["lastCaptureAt"] = utc_now()

            # 실제 Pi 이미지 분석 지연을 흉내냄
            time.sleep(1.0)

            self._send_json(
                200,
                {
                    "sampleId": sample_id,
                    "capturedAt":
                        device_state["lastCaptureAt"],
                    "morphologyScore": 84,
                    "structureScore": 89,
                    "distributionScore": 81,
                    "observation":
                        "Mock Camera 입력을 기반으로 "
                        "3차원 세포 집합의 형태와 분포 특징을 "
                        "교육용 지표로 시각화했습니다.",
                    "nextStep":
                        "관련 표적 단백질의 구조를 확인해 "
                        "연구 질문을 이어갑니다.",
                    "imageUrl": MOCK_IMAGE_URL,
                },
            )
            return

        self._send_json(
            404,
            {
                "ok": False,
                "error": "Not found",
                "path": path,
            },
        )


def main() -> None:
    server = ThreadingHTTPServer(
        (HOST, PORT),
        CellScopeMockHandler,
    )

    print()
    print(
        "=========================================="
    )
    print(
        " Bio AI CellScope Mock Raspberry Pi"
    )
    print(
        "=========================================="
    )

    print(
        f" API   : {BASE_URL}"
    )
    print(
        f" Image : {MOCK_IMAGE_URL}"
    )

    print()
    print(" Endpoints")
    print(
        " GET  /api/cellscope/health"
    )
    print(
        " GET  /api/cellscope/sample"
    )
    print(
        " GET  /api/cellscope/image/latest"
    )
    print(
        " POST /api/cellscope/analyze"
    )
    print(
        " POST /api/cellscope/led"
    )
    print(
        " GET  /api/cellscope/debug"
    )

    print()
    print(
        " Ctrl+C to stop"
    )

    print(
        "=========================================="
    )
    print()

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print()
        print(
            "[CellScope] Mock device stopped."
        )
    finally:
        server.server_close()


if __name__ == "__main__":
    main()