export function TextInput({ text, setText }) {
  return (
    <div class="flex items-baseline space-x-3">
      <div class="">Write:</div>
      <div class="relative mt-2 rounded-md shadow-sm">
        <input
          type="text"
          name="write"
          id="write"
          class="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="Add text..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
    </div>
  );
}
