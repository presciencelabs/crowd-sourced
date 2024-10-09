import { Trans } from 'react-i18next';

export function Header({ language }) {

  return (
    <div class="sm:flex sm:items-start mb-2">
      <div class="text-center sm:ml-4 sm:mt-0 sm:text-left">
        <h3 class="font-semibold leading-6 text-gray-900">
          <Trans i18nKey="describe">
            Describe what you see
          </Trans>
        </h3>
      </div>
    </div>
  );
}

const text = {
  en: "Describe what you see",
  fa: "فارسی",
};
