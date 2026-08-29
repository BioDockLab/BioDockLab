from __future__ import annotations

import json
import time
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Any
from urllib.parse import urlparse


HOST = "127.0.0.1"
PORT = 8765


SAMPLE = {
    "id": "ORG-BRAIN-001",
    "markerId": "BDL-GBM-001",
    "label": "뇌 오가노이드 연구 샘플",
    "model": "brain-organoid",
    "disease": "glioblastoma",
    "imageLabel": "Mock Camera Module 3 이미지",
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
}


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


class CellScopeMockHandler(BaseHTTPRequestHandler):
    server_version = "CellScopeMock/1.0"

    def log_message(self, format: str, *args: Any) -> None:
        print(
            f"[{self.log_date_time_string()}] "
            f"{self.address_string()} - {format % args}"
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

        # Vite frontend → localhost:8765 요청 허용
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

        self.end_headers()
        self.wfile.write(data)

    def _read_json(self) -> dict[str, Any]:
        content_length = int(
            self.headers.get("Content-Length", "0")
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
            print("[CellScope] Mock sample detected")

            time.sleep(0.35)

            self._send_json(
                200,
                SAMPLE,
            )
            return

        if path == "/api/cellscope/debug":
            self._send_json(
                200,
                {
                    "ok": True,
                    "device": device_state,
                    "sample": SAMPLE,
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
                f"[CellScope] Analyzing sample {sample_id}"
            )

            # 실제 Pi의 이미지 분석 지연을 흉내냄
            time.sleep(1.0)

            self._send_json(
                200,
                {
                    "sampleId": sample_id,
                    "capturedAt": utc_now(),
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
    print("==========================================")
    print(" Bio AI CellScope Mock Raspberry Pi")
    print("==========================================")
    print(f" API : http://{HOST}:{PORT}")
    print()
    print(" Endpoints")
    print(" GET  /api/cellscope/health")
    print(" GET  /api/cellscope/sample")
    print(" POST /api/cellscope/analyze")
    print(" POST /api/cellscope/led")
    print(" GET  /api/cellscope/debug")
    print()
    print(" Ctrl+C to stop")
    print("==========================================")
    print()

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print()
        print("[CellScope] Mock device stopped.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()