import classNames from "classnames";
import { useEffect, useReducer } from "preact/hooks";

const initialState = {
  recorder: null,
  isRecording: false,
  audioUrl: null,
  bytes: [],
  blob: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "start":
      action.recorder.start();
      return {
        ...initialState,
        recorder: action.recorder,
        isRecording: true,
      };
    case "stop":
      state.recorder.stop();
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

export function AudioInput({ setAudio }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // watch state changes. Pass audio recording state to
  // parent component when audio blob changes
  useEffect(() => {
    if (!state.isRecording && state.blob !== null) {
      setAudio(state.blob);
    }
  }, [state]);

  const handleClick = (e) => {
    if (state.isRecording) {
      dispatch({ type: "stop" });
      return;
    }

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      console.log("getUserMedia supported");
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          const recorder = new MediaRecorder(stream);

          recorder.ondataavailable = (e) => {
            dispatch({ type: "data", newBytes: e.data });
          };

          recorder.onstop = (e) => {
            dispatch({ type: "postprocess", callback: setAudio });
          };

          dispatch({ type: "start", recorder: recorder });
        })
        .catch((err) => {
          console.log(`getUserMedia Error:${err}`);
        });
    } else {
      console.log("getUserMedia not supported on your browser");
    }
  };

  return (
    <div class="flex items-center space-x-3">
      <div>Speak:</div>
      {state.audioUrl === null ? (
        <button class="flex items-center" onClick={handleClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class={classNames("w-8 h-8", { "text-red-500": state.isRecording })}
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
            />
          </svg>
          {state.isRecording && (
            <div class="text-subscript text-red-500">recording...</div>
          )}
        </button>
      ) : (
        <div class="flex justify-between">
          <audio src={state.audioUrl} controls={true}></audio>
          <button
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
