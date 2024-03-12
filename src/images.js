const images = [
  {
    id: "43cc4957-36c7-4068-9998-7499dcce29df",
    url: new URL("./img/1.jpg", import.meta.url),
  },
  {
    id: "a9c37219-df17-4b70-bf9e-2861460de242",
    url: new URL("./img/2.jpg", import.meta.url),
  },
  {
    id: "6adcc36c-968c-49b2-b51f-8f7f586d6460",
    url: new URL("./img/3.jpg", import.meta.url),
  },
  {
    id: "970a6195-3a8e-4ac6-8009-8f6b07c04081",
    url: new URL("./img/4.jpg", import.meta.url),
  },
  {
    id: "6fc3578f-3ed1-4333-b52b-25aaa5b433ae",
    url: new URL("./img/5.jpg", import.meta.url),
  },
  {
    id: "2492d134-ee92-44a4-8a35-414d69d21519",
    url: new URL("./img/6.jpg", import.meta.url),
  },
  {
    id: "9e8c3349-5017-4455-b78d-8d32df7b5fbf",
    url: new URL("./img/7.jpg", import.meta.url),
  },
  {
    id: "eac3fe0f-56a1-417c-9f48-2c0c10adc079",
    url: new URL("./img/8.jpg", import.meta.url),
  },
  {
    id: "ce8de77f-7789-4147-b1be-2c791c6c8bf4",
    url: new URL("./img/9.jpg", import.meta.url),
  },
  {
    id: "529d8ab0-0e79-4614-bee5-7ae06383940a",
    url: new URL("./img/10.jpg", import.meta.url),
  },
  {
    id: "97661983-9718-4d56-95d6-602a9e78e1e4",
    url: new URL("./img/11.jpg", import.meta.url),
  },
  {
    id: "d3000c91-075f-48b0-bc3b-4615cf993026",
    url: new URL("./img/12.jpg", import.meta.url),
  },
];

export function randomImage() {
  // Select a random image w/ approximately equal distribution
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values_inclusive
  const idx = Math.floor(Math.random() * images.length);
  return images[idx];
}
