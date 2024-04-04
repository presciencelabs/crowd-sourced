export function Header({ language }) {
  return (
    <div class="sm:flex sm:items-start mb-2">
      <div class="text-center sm:ml-4 sm:mt-0 sm:text-left">
        <h3 class="font-semibold leading-6 text-gray-900">
          {language && text[language.id]}
        </h3>
      </div>
    </div>
  );
}

const text = {
  en: "Describe what you see",
  fa: "فارسی",
};
