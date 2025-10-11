export interface RentalProduct {
  title: string;
  subtitle: string;
  images: string[];
  features: string[];
  videoUrl: string;
}

export const rentalsData: RentalProduct[] = [
  {
    title: "DJI Osmo Pocket 3 Creator Combo",
    subtitle: "Compact and capable 4K pocket gimbal camera.",
    images: [
      "https://djioslo.no/Userfiles/Upload/images/Modules/Eshop/27490_31399_07.jpeg",
      "https://djioslo.no/Userfiles/Upload/images/Modules/Eshop/27490_31399_03.jpeg",
    ],
    features: [
      "1-Inch CMOS & 4K/120fps",
      "2-Inch Rotatable Screen & Smart Horizontal-Vertical Filming",
      "3-Axis Gimbal Mechanical Stabilization",
      "ActiveTrack 6.0",
      "Full-Pixel Fast Focusing",
      "D-Log M & 10-Bit", 
      "Stereo Recording",
      "Pocket-sized",
    ],
    videoUrl: "https://www.youtube.com/embed/MZq_2OJ5kOo",
  },
  {
    title: "Sony A7 IV",
    subtitle:
      "Mirrorless hybrid camera with image stabilization and lightning-fast autofocus.",
    images: [
      "https://www.japanphoto.no/imageserver/750/750/scale/p/japan/PIM_PROD/Sony/PIM1143909_Sony_1634709214767.jpg",
      "https://www.japanphoto.no/imageserver/750/750/scale/p/japan/PIM_PROD/Sony/PIM1143909_Sony_1634709233962.jpg",
    ],
    features: [
      "Newly developed back-illuminated 33 megapixel Exmor R sensor",
      "4K/60p video in super35 format",
      "4K/30p video upsampled from 7K in full frame",
      "Record slow motion in full HD/120p",
      "The BIONZ XR processor is eight times faster than the one in the A7 III",
      "Up to 15 stops of dynamic range",
      "3.69 million-dot OLED electronic viewfinder",
      "Softer tones and better details in photos and movies",
      "Performs incredibly well in low light conditions",
      "Burst shooting at 10 frames per second",
      "Buffer of over 800 RAW + JPEG with CFexpress A",
      "Same number of autofocus points as the A1 – 759 pieces",
      "Full foldable/rotatable LCD screen with touch",
    ],
    videoUrl: "https://www.youtube.com/embed/bUgOEDqhZVY",
  },
  {
    title: "DJI MINI 4 PRO FLY MORE COMBO (DJI RC 2)",
    subtitle:
      "Mirrorless hybrid camera with image stabilization and lightning-fast autofocus.",
    images: [
      "https://djioslo.no/Userfiles/Upload/images/Modules/Eshop/27473_31283_DJI-Mini-4-Pro-RC-2-2.jpeg",
      "https://djioslo.no/Userfiles/Upload/images/Modules/Eshop/27473_eddac3937fead916961e8596421efcbf-origin.jpg",
    ],
    features: [
      "Under 249g [1]",
      "4K/60fps HDR True Vertical Shooting",
      "Omnidirectional obstacle sensing",
      "Extended battery life [2]",
      "20 km FHD video transmission [3]",
      "ActiveTrack 360",
    ],
    videoUrl: "https://www.youtube.com/embed/FaCKViuXd_I",
  },
  {
    title: "Sony FE 28-70mm f/3.5-5.6 US",
    subtitle: "Lightweight, compact 35mm full-frame standard zoom lens.",
    images: [
      "https://www.sony.no/image/fd6df2f58083e52631a23154639f3571?fmt=pjpeg&wid=1014&hei=396&bgcolor=F1F5F9&bgc=F1F5F9",
      "https://www.sony.no/image/fd6df2f58083e52631a23154639f3571?fmt=pjpeg&wid=1014&hei=396&bgcolor=F1F5F9&bgc=F1F5F9",
    ],
    features: [
      "Lightweight, compact 35mm full-frame standard zoom lens",
      "28-70mm zoom range and F3.5-5.6 aperture",
      "Built-in optical SteadyShot image stabilization",
      "7-blade, circular aperture provides great defocusing",
      "The design is resistant to dust and moisture",
      "Minimum Focus Distance: 0.3–0.45 m",
      "Maximum Magnification Ratio (X): 0.19x",
      "Filter Diameter (mm): 55mm",
      "Weight: 295g",
    ],
    videoUrl: "https://www.youtube.com/embed/x4ZZC5nqS0o",
  },
  {
    title: "DJI MIC MINI",
    subtitle: "Carry Less, Capture More",
    images: [
      "https://djioslo.no/Userfiles/Upload/images/Modules/Eshop/31146_DJI-Mic-Mini-45-DJI-Mic-Mini-Transmitte(1).png",
      "https://djioslo.no/Userfiles/Upload/images/Modules/Eshop/31146_DJI-Mic-Mini-45-DJI-Mic-Mini-Transmitte(1).png",
    ],
    features: [
      "Small, ultralight, discreet",
      "High-quality sound with stable transmission",
      "48-hour operation with case",
      "DJI OsmoAudio™ direct connection for premium audio quality",
      "Two-level active noise cancellation",
      "Automatic limiting to prevent audio clipping",
    ],
    videoUrl: "https://www.youtube.com/embed/iBgZJJ-NBTs",
  },
  {
    title: "Canon EOS 5D Mark II",
    subtitle: "Full Frame DSLR Camera",
    images: [
      "https://m.media-amazon.com/images/I/819GW4aelwL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/819GW4aelwL._AC_SL1500_.jpg",
    ],
    features: [
      "21MP - Full frame CMOS Sensor",
      "ISO 100 - 6400( expands to 50 - 25600)",
      '3.00" Fixed Type Screen',
      "Optical (pentaprism) viewfinder",
      "4.0fps continuous shooting",
      "FHD at 30fps Video Recording",
      "850g. 152 x 114 x 75 mm",
      "Weather-sealed Body",
    ],
    videoUrl: "https://www.youtube.com/embed/y_34mvEZGx0",
  },
];