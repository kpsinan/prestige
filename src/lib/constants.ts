// src/lib/constants.ts

export const VEHICLE_HIERARCHY = {
  Toyota: {
    logo: "/toyota.svg", // Replace with local path later
    models: {
      Innova: [
        { name: "TOYOTA GR STEERING WHEEL", handle: "toyota-gr-steering-wheel" },
        { name: "TOYOTA WHEELCAP", handle: "toyota-wheelcap" },
        { name: "TOYOTA REAR AC VENT", handle: "toyota-rear-ac-vent" },
      ],
      Crysta: [
        { name: "TOYOTA GR STEERING WHEEL", handle: "toyota-gr-steering-wheel" },
        { name: "TOYOTA WHEELCAP", handle: "toyota-wheelcap" },
        { name: "TOYOTA REAR AC VENT", handle: "toyota-rear-ac-vent" },
      ],
      Fortuner: [
        { name: "TOYOTA GR STEERING WHEEL", handle: "toyota-gr-steering-wheel" },
        { name: "TOYOTA WHEELCAP", handle: "toyota-wheelcap" },
      ],
    },
  },
  // Add more brands here following the exact same structure:
  // Suzuki: { logo: "...", models: { Swift: [...], Baleno: [...] } }
};