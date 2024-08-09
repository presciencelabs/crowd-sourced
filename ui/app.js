import i18n from './components/i18n';
import { render } from "preact";
import { useEffect, useState } from "preact/compat";
import { GetSiteLanguageSelected } from "./helpers";
import { randomImage } from "./images";
import { Header } from "./components/header";
import { AudioInput } from "./components/input-audio";
import { TextInput } from "./components/input-text";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { Trans } from 'react-i18next';

function handleSubmit(e, payload, done) {
  const f = new FormData();
  Object.keys(payload).forEach((k) => {
    f.append(k, payload[k]);
  });
  fetch(`${process.env.API_URL}`, {
    method: "POST",
    body: f,
  })
  .then(response => response.text())
  .then(data => {
    done(false);
  })
  .catch(error => console.error(error));
}

function App({ img, language }) {
  const [audio, setAudio] = useState(null);
  const [text, setText] = useState(null);
  const [payload, setPayload] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);

  i18n.on('initialized', () => {
    setIsOpen(true);
  });

  useEffect(() => {
  }, []);

  useEffect(() => {
    setPayload({
      audio: audio,
      imageSource: img.url.href,
      text: text,
      //language: language.value,
      language: i18n.resolvedLanguage,
    });

    if (audio || text) {
      setSubmitDisabled(false);
    }
    else {
      setSubmitDisabled(true);
    }
  }, [img, audio, text, language]);

  return (
    isOpen && (
      <>
        <div
          className="relative z-10"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          {/* <!--
          Background backdrop, show/hide based on modal state.
      
          Entering: "ease-out duration-300"
            From: "opacity-0"
            To: "opacity-100"
          Leaving: "ease-in duration-200"
            From: "opacity-100"
            To: "opacity-0"
        --> */}
        </div>
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            {/* <!--
      Modal panel, show/hide based on modal state.

      Entering: "ease-out duration-300"
        From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        To: "opacity-100 translate-y-0 sm:scale-100"
      Leaving: "ease-in duration-200"
        From: "opacity-100 translate-y-0 sm:scale-100"
        To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
    --> */}
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="flex flex-row-reverse">
                  <button
                    id="close"
                    onClick={(e) => {
                      setIsOpen(false);
                    }}
                  >
                    <XMarkIcon className="h-8 w-8" />
                  </button>
                </div>
                <Header language={language} />

                {/* LANGUAGE SELECTOR */}

                {/* IMAGE APP */}
                {/* START IMAGE */}
                <div className="flex justify-around">
                  <img className="w-40 h-40" src={img.url} />
                </div>
                {/* END IMAGE */}
              </div>
              {/* <!-- INPUT SECTION --> */}
              <div className="flex flex-col space-y-3 px-4 sm:px-6">
                <TextInput text={text} setText={setText} />
                <AudioInput setAudio={setAudio} setSubmitDisabled={setSubmitDisabled} />
              </div>
              <div className="bg-gray-50 px-4 py-6 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  id="submit"
                  type="button"
                  className={`bg-blue-500 text-white font-bold py-2 px-4 rounded ${submitDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                  onClick={(e) => handleSubmit(e, payload, setIsOpen)}
                  disabled={submitDisabled}
                >
                  <Trans i18nKey="submit">
                    Submit
                  </Trans>
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  );
}

console.log("Starting CrowdSourced...");
const lang = GetSiteLanguageSelected() || { value: "en", text: "English" };
console.log(`crowdsourced selected language: ${JSON.stringify(lang)}`);

render(
  <App img={randomImage()} language={lang} />,
  document.getElementById("cswrapper")
);
