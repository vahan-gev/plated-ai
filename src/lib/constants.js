import {
    Sun,
    Sunset,
    SunDim,
    Cloud,
    Moon,
    Lightbulb,
    ArrowDown,
    ArrowDownRight,
    ArrowRight,
    Square,
    RectangleVertical,
    RectangleHorizontal,
    Smartphone,
    Tv,
    Camera,
} from "lucide-react";

export const ASPECT_RATIO_OPTIONS = [
    {
        value: "1:1",
        label: "Square (1:1)",
        description: "Menus & Grid",
        icon: Square,
    },
    {
        value: "3:4",
        label: "Portrait (3:4)",
        description: "Classic vertical",
        icon: RectangleVertical,
    },
    {
        value: "4:3",
        label: "Landscape (4:3)",
        description: "Classic horizontal",
        icon: RectangleHorizontal,
    },
    {
        value: "9:16",
        label: "Stories (9:16)",
        description: "Reels & TikTok",
        icon: Smartphone,
    },
    {
        value: "16:9",
        label: "Widescreen (16:9)",
        description: "Video format",
        icon: Tv,
    },
    {
        value: "3:2",
        label: "Photo (3:2)",
        description: "Traditional photo",
        icon: Camera,
    },
];

export const LIGHTING_OPTIONS = [
    {
        value: "soft_window_light",
        label: "Soft Window Light",
        icon: Sun,
        description: "Gentle, natural light through a window",
    },
    {
        value: "golden_hour_sunset",
        label: "Golden Hour",
        icon: Sunset,
        description: "Warm, golden sunset tones",
    },
    {
        value: "bright_midday",
        label: "Bright Midday",
        icon: SunDim,
        description: "Crisp, bright overhead light",
    },
    {
        value: "overcast_diffused",
        label: "Overcast / Diffused",
        icon: Cloud,
        description: "Soft, even diffused light",
    },
    {
        value: "moody_low_light",
        label: "Moody / Low Light",
        icon: Moon,
        description: "Dark, dramatic atmosphere",
    },
    {
        value: "neon_ambient",
        label: "Neon / Ambient",
        icon: Lightbulb,
        description: "Colorful ambient neon glow",
    },
];

export const COLOR_GRADE_OPTIONS = [
    {
        value: "natural_true",
        label: "Natural / True",
        description: "True-to-life colors",
    },
    {
        value: "warm_film",
        label: "Warm Film",
        description: "Warm analog film look",
    },
    {
        value: "faded_matte",
        label: "Faded / Matte",
        description: "Soft, muted tones",
    },
    {
        value: "high_contrast_vivid",
        label: "High Contrast Vivid",
        description: "Bold, saturated colors",
    },
    {
        value: "desaturated_editorial",
        label: "Desaturated Editorial",
        description: "Understated, editorial style",
    },
    {
        value: "moody_dark",
        label: "Moody Dark",
        description: "Deep, dark tones",
    },
];

export const SHOT_ANGLE_OPTIONS = [
    {
        value: "flat_lay_90",
        label: "Flat Lay (90°)",
        description: "Directly above, top-down view",
        icon: ArrowDown,
        promptDescription:
            "Camera positioned directly overhead, shooting straight down at 90 degrees. The dish is seen completely from above, no sides of the vessel are visible, the entire frame is filled with the surface and the food from a bird's eye view.",
    },
    {
        value: "45_degree",
        label: "45° Angle",
        description: "Natural dining perspective",
        icon: ArrowDownRight,
        promptDescription:
            "Camera positioned at a roughly 45-degree angle above the dish, halfway between overhead and eye level. The top of the food is clearly visible, the front face of the vessel is partially visible, and a moderate amount of the surface beneath is shown. The most natural and common food photography angle.",
    },
    {
        value: "eye_level_0",
        label: "Eye Level (0°)",
        description: "Straight-on, level view",
        icon: ArrowRight,
        promptDescription:
            "Camera positioned at the same height as the middle of the dish, shooting straight forward horizontally, as if the viewer is sitting at the table looking directly at the food. The top of the dish is visible but the surface beneath is minimal or not visible at all.",
    },
];

export const VESSEL_OPTIONS = [
    { value: "plate", label: "Plate", folder: "plates", prefix: "plate" },
    { value: "board", label: "Board", folder: "plates", prefix: "board" },
    { value: "bowl", label: "Bowl", folder: "plates", prefix: "bowl" },
    { value: "cup_glass", label: "Cup / Glass", folder: "cups", prefix: "" },
];

export const SURFACE_IMAGES = Array.from({ length: 14 }, (_, i) => {
    const realNum = i === 0 ? 1 : i >= 1 ? i + 2 : i + 1;
    return {
        value: `tablecloth${realNum}`,
        src: `/assets/tablecloths/tablecloth${realNum}.png`,
    };
}).filter((_, i) => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].includes(i));

export const SURFACE_IMAGE_LIST = [
    "tablecloth1",
    "tablecloth3",
    "tablecloth4",
    "tablecloth5",
    "tablecloth6",
    "tablecloth7",
    "tablecloth8",
    "tablecloth9",
    "tablecloth10",
    "tablecloth11",
    "tablecloth12",
    "tablecloth13",
    "tablecloth14",
];

export const CUTLERY_STYLES = [
    { value: "cutlery1", src: "/assets/cutleries/cutlery1.png" },
    { value: "culterly2", src: "/assets/cutleries/culterly2.png" },
    { value: "cutlery3", src: "/assets/cutleries/cutlery3.png" },
    { value: "cutlery4", src: "/assets/cutleries/cutlery4.png" },
    { value: "cutlery5", src: "/assets/cutleries/cutlery5.png" },
    { value: "cutlery6", src: "/assets/cutleries/cutlery6.png" },
];

export const CUTLERY_PIECES = [
    { value: "fork", label: "Fork" },
    { value: "knife", label: "Knife" },
    { value: "spoon", label: "Spoon" },
];

export const getVesselImages = (vesselType) => {
    switch (vesselType) {
        case "plate":
            return Array.from({ length: 15 }, (_, i) => ({
                value: `plate${i + 1}`,
                src: `/assets/plates/plate${i + 1}.png`,
            }));
        case "board":
            return [
                { value: "board1", src: "/assets/plates/board1.png" },
                { value: "board2", src: "/assets/plates/board2.png" },
            ];
        case "bowl":
            return Array.from({ length: 10 }, (_, i) => ({
                value: `bowl${i + 1}`,
                src: `/assets/plates/bowl${i + 1}.png`,
            }));
        case "cup_glass":
            return [
                ...Array.from({ length: 8 }, (_, i) => ({
                    value: `cup${i + 1}`,
                    src: `/assets/cups/cup${i + 1}.png`,
                })),
                ...Array.from({ length: 12 }, (_, i) => ({
                    value: `glass${i + 1}`,
                    src: `/assets/cups/glass${i + 1}.png`,
                })),
            ];
        default:
            return [];
    }
};

export const DECOR_CATEGORIES = [
    {
        name: "Herbs & Greens",
        items: [
            "Fresh basil leaves",
            "Rosemary sprig",
            "Thyme sprig",
            "Mint leaves",
            "Microgreens",
            "Edible flowers (pansies, violas)",
            "Baby arugula",
            "Chive stalks",
            "Dill fronds",
            "Parsley sprig",
        ],
    },
    {
        name: "Sauces & Drizzles",
        items: [
            "Olive oil drizzle",
            "Balsamic glaze dots",
            "Honey drizzle",
            "Chili oil pool",
            "Cream swirl",
            "Berry coulis streak",
        ],
    },
    {
        name: "Powders & Dusts",
        items: [
            "Powdered sugar dusting",
            "Cocoa powder dusting",
            "Matcha dusting",
            "Paprika dusting",
            "Activated charcoal dust",
            "Gold/silver edible dust",
        ],
    },
    {
        name: "Seeds, Nuts & Crumbs",
        items: [
            "Sesame seeds",
            "Crushed pistachios",
            "Toasted pine nuts",
            "Flaked almonds",
            "Panko crumbs",
            "Crushed walnuts",
        ],
    },
    {
        name: "Fruits & Zest",
        items: [
            "Lemon wedge",
            "Lime zest curl",
            "Orange zest",
            "Fresh berries (single or scattered)",
            "Fig half",
            "Pomegranate seeds",
        ],
    },
    {
        name: "Structural / Props",
        items: [
            "Small wooden board underneath",
            "Folded linen napkin beside",
            "Rustic bread slice beside",
            "Small ceramic dipping bowl",
            "Vintage spoon resting beside",
            "Small jar or bottle in background",
        ],
    },
    {
        name: "Seasonal / Specialty",
        items: [
            "Cinnamon stick",
            "Star anise",
            "Vanilla pod",
            "Dried chili",
            "Bay leaf",
            "Truffle shaving",
        ],
    },
];

export function buildPrompt({
    lighting,
    colorGrade,
    shotAngle,
    vesselImage,
    surfaceImage,
    cutleryPieces,
    cutleryStyleImage,
    decor,
    customNote,
    aspectRatio,
}) {
    const lightingLabel =
        LIGHTING_OPTIONS.find((o) => o.value === lighting)?.label || lighting;
    const colorGradeLabel =
        COLOR_GRADE_OPTIONS.find((o) => o.value === colorGrade)?.label ||
        colorGrade;
    const shotAngleLabel =
        SHOT_ANGLE_OPTIONS.find((o) => o.value === shotAngle)
            ?.promptDescription || shotAngle;
    const aspectLabel =
        ASPECT_RATIO_OPTIONS.find((o) => o.value === (aspectRatio || "1:1"))
            ?.label ||
        aspectRatio ||
        "1:1";

    let cutlerySection = "";
    if (cutleryPieces && cutleryPieces.length > 0) {
        const piecesStr = cutleryPieces.join(" and ");
        cutlerySection = `Include only a ${piecesStr} in the scene. A photo of the cutlery style to match is attached — use this style for the selected pieces only, not all pieces shown in the photo. Arrange them naturally beside the vessel.`;
    }

    let decorSection = "";
    if (decor && decor.length > 0) {
        decorSection = `Include the following decorative accents arranged naturally in the scene: ${decor.join(", ")}.`;
    } else {
        decorSection = "No decorative accents.";
    }

    let customNoteSection = "";
    if (customNote && customNote.trim()) {
        customNoteSection = `Additional direction: ${customNote.trim()}.`;
    }

    return `You are a professional food photographer and menu designer specializing in restaurant and artisan bakery menus.

A reference photo of the dish is attached. Recreate this exact dish as a polished, professional menu photograph. Preserve the dish's identity — same food, same general composition — but elevate it into a high-end presentation worthy of a printed restaurant menu.
A photo of the vessel to use is attached — place the dish on exactly this vessel.
A photo of the surface or tablecloth is attached — use this as the surface the vessel sits on.
${cutlerySection ? cutlerySection : ""}
${decorSection}
Shot angle: ${shotAngleLabel}.
Lighting: ${lightingLabel}.
Color grade: ${colorGradeLabel}.
${customNoteSection}
Rules: the dish is the clear focal point. Match the vessel, surface, cutlery, and decor as closely as possible to the attached reference images for each. Background must be simple and non-distracting. Soft background bokeh, sharp focus on the dish. No text, watermarks, or borders. Do not add ingredients or garnishes not visible in the dish reference image. Output a single photorealistic menu photograph with an aspect ratio of ${aspectLabel}.`.trim();
}
