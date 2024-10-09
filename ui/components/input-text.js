import i18n from '../components/i18n';
import { Trans } from 'react-i18next';
export function TextInput({ text, setText }) {
  return (
    <div id="observation" className="relative rounded-md shadow-sm">
      <label
        for="write"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        <Trans i18nKey="write">
          Write
        </Trans>
      </label>
      <input
        type="text"
        name="write"
        id="write"
        className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        placeholder={i18n.t("addText")}
        value={text}
        onChange={(e) => {
          let text = e.target.value.trim();
          setText(text);
        }}
      />
    </div>
  );
}
