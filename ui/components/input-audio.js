import classNames from "classnames";
import { useEffect, useReducer, useState } from "preact/hooks";
import { Trans } from 'react-i18next';

const initialState = {
  recorder: null,
  isRecording: false,
  audioUrl: null,
  bytes: [],
  blob: null,
  stream: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "start":
      action.recorder.start();
      return {
        ...initialState,
        recorder: action.recorder,
        isRecording: true,
        stream: action.stream,
      };
    case "stop":
      state.recorder.stop();

      const tracks = state.stream.getTracks();
      tracks.forEach(track => track.stop());

      return {
        ...state,
        isRecording: false,
      };
    case "postprocess":
      const blob = new Blob(state.bytes, {
        type: "audio/ogg; codecs=opus",
      });
      return {
        ...state,
        blob: blob,
        audioUrl: URL.createObjectURL(blob),
      };
    case "data":
      return {
        ...state,
        bytes: [...state.bytes, action.newBytes],
      };
    case "delete":
      return { ...initialState };
  }
  throw Error("Unknown action: " + action.type);
}

export function AudioInput({ setAudio, setSubmitDisabled }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [supported, setSupported] = useState(true);

  // watch state changes. Pass audio recording state to
  // parent component when audio blob changes
  useEffect(() => {
    if (!state.isRecording) {
      setAudio(state.blob);
    }
  }, [state]);

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    setSupported(true);
  }
  else {
    setSupported(false);
  }

  const handleClick = (e) => {
    if (state.isRecording) {
      dispatch({ type: "stop" });
      return;
    }
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      setSubmitDisabled(true);
      console.log("getUserMedia supported");
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          const recorder = new MediaRecorder(stream);

          recorder.ondataavailable = (e) => {
            dispatch({ type: "data", newBytes: e.data });
          };

          recorder.onstop = (e) => {
            dispatch({ type: "postprocess" });
          };

          dispatch({ type: "start", recorder: recorder, stream: stream });
        })
        .catch((err) => {
          console.log(`getUserMedia Error:${err}`);
          setSupported(false);
        });
    } else {
      console.log("getUserMedia not supported on your browser");
    }
  };

  return (
    supported && (
      <div id="audio-input">
        <label for="record-button" className="block text-sm font-medium leading-6 text-gray-900 mb-1.5">
          <Trans i18nKey="speak">
            Speak
          </Trans>
        </label>
        {state.audioUrl === null ? (
          <button id="record-button" className="flex items-center" onClick={handleClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className={classNames("w-8 h-8", { "text-red-500": state.isRecording })}
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
              />
            </svg>
            {state.isRecording && (
              <div className="text-subscript text-red-500">
                <Trans i18nKey="recording">
                  Recording... click again to stop
                </Trans>
              </div>
            )}
          </button>
        ) : (
          <div className="flex justify-between">
            <audio id="playback" src={state.audioUrl} controls={true}></audio>
            <button
              id="delete-button"
              onClick={(e) => {
                dispatch({ type: "delete" });
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-8 h-8 text-red-400"
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
    )
  );
}
