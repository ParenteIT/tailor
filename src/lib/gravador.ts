"use client";

import { useCallback, useRef, useState } from "react";

/**
 * Estado do botão de mic do quiz.
 *
 * "consentindo" é uma etapa deliberada, não um modal de permissão do sistema:
 * o consentimento do §2 do copy deck é nosso, explícito, com o texto exato
 * que ela lê antes de qualquer coisa gravar — o `getUserMedia` do navegador só
 * é chamado depois que ela diz sim aqui dentro.
 */
export type EstadoGravador =
  | "ocioso"
  | "consentindo"
  | "gravando"
  | "transcrevendo"
  | "erro";

export interface Gravador {
  estado: EstadoGravador;
  suportado: boolean;
  pedirConsentimento: () => void;
  consentir: () => void;
  recusarConsentimento: () => void;
  parar: () => void;
}

const MIME_PREFERIDOS = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];

function mimeSuportado(): string | undefined {
  if (typeof MediaRecorder === "undefined") return undefined;
  return MIME_PREFERIDOS.find((tipo) => MediaRecorder.isTypeSupported(tipo));
}

/**
 * `onConsentimento` recebe o timestamp do clique em "Pode gravar" — é essa
 * marca de tempo que vira `consentimento_audio_em` no banco, a evidência que
 * o LGPD by design do produto exige.
 */
export function useGravador(
  onTranscrito: (texto: string) => void,
  onConsentimento?: (emISO: string) => void
): Gravador {
  const [estado, setEstado] = useState<EstadoGravador>("ocioso");
  const suportado =
    typeof window !== "undefined" &&
    Boolean(navigator.mediaDevices?.getUserMedia) &&
    typeof MediaRecorder !== "undefined";

  const gravadorRef = useRef<MediaRecorder | null>(null);
  const trilhasRef = useRef<MediaStreamTrack[]>([]);
  const pedacosRef = useRef<Blob[]>([]);

  const encerrarStream = useCallback(() => {
    trilhasRef.current.forEach((trilha) => trilha.stop());
    trilhasRef.current = [];
  }, []);

  const pedirConsentimento = useCallback(() => {
    setEstado("consentindo");
  }, []);

  const recusarConsentimento = useCallback(() => {
    setEstado("ocioso");
  }, []);

  const transcreverEEnviar = useCallback(
    async (blob: Blob) => {
      setEstado("transcrevendo");
      try {
        const forma = new FormData();
        forma.append("audio", blob, "audio.webm");
        const resposta = await fetch("/api/transcribe", {
          method: "POST",
          body: forma,
        });
        if (!resposta.ok) throw new Error(String(resposta.status));
        const dados = (await resposta.json()) as { texto?: string };
        if (!dados.texto) throw new Error("vazio");
        onTranscrito(dados.texto);
        setEstado("ocioso");
      } catch {
        setEstado("erro");
      }
    },
    [onTranscrito]
  );

  const consentir = useCallback(() => {
    onConsentimento?.(new Date().toISOString());

    if (!suportado) {
      setEstado("erro");
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        trilhasRef.current = stream.getTracks();
        pedacosRef.current = [];
        const mime = mimeSuportado();
        const gravador = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
        gravadorRef.current = gravador;

        gravador.ondataavailable = (evento) => {
          if (evento.data.size > 0) pedacosRef.current.push(evento.data);
        };
        gravador.onstop = () => {
          encerrarStream();
          const blob = new Blob(pedacosRef.current, {
            type: mime ?? "audio/webm",
          });
          pedacosRef.current = [];
          void transcreverEEnviar(blob);
        };

        gravador.start();
        setEstado("gravando");
      })
      .catch(() => {
        setEstado("erro");
      });
  }, [suportado, onConsentimento, encerrarStream, transcreverEEnviar]);

  const parar = useCallback(() => {
    gravadorRef.current?.stop();
  }, []);

  return { estado, suportado, pedirConsentimento, consentir, recusarConsentimento, parar };
}
