import classNames from "classnames";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";

export function AudioInput({ setAudio }) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [bytes, setBytes] = useState([]);
  const mediaRecorder = useRef();

  const handleClick = (e) => {
    if (!isRecording) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        console.log("getUserMedia supported");
        setIsRecording(true);
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then((stream) => {
            mediaRecorder.current = new MediaRecorder(stream);
            mediaRecorder.current.start(1000);
            mediaRecorder.current.ondataavailable = (e) => {
              setBytes((bytes) => [...bytes, e.data]);
            };
          })
          .catch((err) => {
            console.log(`getUserMedia Error:${err}`);
          });
      } else {
        console.log("getUserMedia not supported on your browser");
      }
    }

    if (isRecording) {
      setIsRecording(false);
      mediaRecorder.current.stop();
      const blob = new Blob(bytes, {
        type: "audio/ogg; codecs=opus",
      });

      const url = URL.createObjectURL(blob);
      setAudioURL(url);
    }
  };

  return (
    <div class="flex items-center space-x-3">
      <div>Speak:</div>
      {audioURL === null ? (
        <button class="flex items-center" onClick={handleClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class={classNames("w-8 h-8", { "text-red-500": isRecording })}
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
            />
          </svg>
          {isRecording && (
            <div class="text-subscript text-red-500">recording...</div>
          )}
        </button>
      ) : (
        <div class="flex justify-between">
          <audio src={audioURL} controls={true}></audio>
          <button
            onClick={(e) => {
              console.log("Delete Audio/Allow Redo");
              setAudioURL(null);
              bytes.current = [];
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-8 h-8 text-red-400"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
