// src/lib/constants.ts

export const VEHICLE_HIERARCHY = {
  Toyota: {
    Innova: [
      { name: "TOYOTA GR STEERING WHEEL", handle: "toyota-gr-steering-wheel" },
      { name: "TOYOTA WHEELCAP", handle: "toyota-wheelcap" },
    ],
    Crysta: [
      { name: "TOYOTA GR STEERING WHEEL", handle: "toyota-gr-steering-wheel" },
      { name: "TOYOTA WHEELCAP", handle: "toyota-wheelcap" },
    ],
    Fortuner: [
      { name: "TOYOTA GR STEERING WHEEL", handle: "toyota-gr-steering-wheel" },
    ],
  },
  // You can easily add more brands here later
  // Suzuki: { Swift: [...], Baleno: [...] }
};

export type Brand = keyof typeof VEHICLE_HIERARCHY;