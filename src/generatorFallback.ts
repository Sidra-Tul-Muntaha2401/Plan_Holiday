import {
  CaptionArchitectInput,
  CaptionArchitectResult,
  CampaignPlannerInput,
  CampaignPlannerResult,
  VisualBriefInput,
  VisualBriefResult,
  TrendScoutInput,
  TrendScoutResult
} from "./types";

export function generateFallbackCaptions(inputs: CaptionArchitectInput): CaptionArchitectResult {
  const { holiday, brandCategory, sellingPoint, tone } = inputs;
  
  // Clean holiday name
  const holidayName = holiday.trim() || "Seasonal Holiday";
  const brand = brandCategory.trim() || "Brand";
  const offer = sellingPoint.trim() || "our exclusive holiday collection";

  return {
    caption1: `✨ ${holidayName} is just around the corner! Celebrate this season with ${brand}.\n\nHere's what we have in store for you: ${offer}. Whether you're planning ahead or treating someone special, make this holiday unforgettable.\n\n👉 Tap the link in our bio to explore and claim yours today!\n\n#${holidayName.replace(/\s+/g, '')} #${brand.replace(/[^a-zA-Z0-9]/g, '')} #HolidaySpecial #LimitedTime #HolidaySeason`,
    
    caption2: `The best part of ${holidayName}? The moments that remind us why we celebrate in the first place.\n\nAt ${brand}, we believe that holidays are made richer by small rituals and heartfelt connections. That's why ${offer} was crafted—to bring calm, joy, and inspiration to your days.\n\nTell us in the comments: what is your favorite tradition during ${holidayName}?\n\n#HolidayMoments #${holidayName.replace(/\s+/g, '')} #HeartfeltStories #CommunityFirst #HolidayVibes`,
    
    caption3: `Quick holiday check-in! As ${holidayName} approaches, what's your top priority?\n\n🅰️ Taking time to slow down and recharge\n🅱️ Finding the perfect gift / celebrating with friends\n🅲️ Both—and making the most of every second!\n\nDrop an A, B, or C below! Bonus: ${offer} is waiting for you at our link in bio!\n\n#HolidayPoll #${holidayName.replace(/\s+/g, '')} #JoinTheConversation #EngagementPost`,
    
    strategy: `Curated for a ${tone.toLowerCase()} tone. Caption 1 drives direct conversion and promotional momentum with clear incentives. Caption 2 leans into emotional connection and brand storytelling, while Caption 3 is optimized for algorithmic engagement and audience polling.`
  };
}

export function generateFallbackCampaign(inputs: CampaignPlannerInput): CampaignPlannerResult {
  const { holiday, campaignNarrative, product, durationDays } = inputs;
  const numDays = parseInt(durationDays, 10) || 3;
  const holidayName = holiday.trim() || "Holiday Season";
  const prod = product.trim() || "Featured Product";
  const narrative = campaignNarrative.trim() || "Celebrate the season with purpose and delight";

  const templateDays = [
    {
      title: "The Teaser: The Countdown Begins",
      postingTime: "9:00 AM (Morning Catch-Up)",
      captionFocus: `Introduce the core story: "${narrative}". Build curiosity around ${holidayName} anticipation.`,
      visualPromptBrief: `Clean, atmospheric teaser graphic featuring subtle holiday lighting with a teaser glimpse of ${prod}. High-key, aspirational styling.`,
      primaryMetric: "Saves & Story Shares"
    },
    {
      title: "The Spotlight: Core Benefits & Magic",
      postingTime: "1:00 PM (Lunch Break Peak)",
      captionFocus: `Deep-dive into how ${prod} solves a seasonal pain point or elevates ${holidayName} celebrations.`,
      visualPromptBrief: `High-resolution product flat-lay surrounded by seasonal textures (warm tones, botanical accents, festive details).`,
      primaryMetric: "Link Clicks & Product Views"
    },
    {
      title: "The Community Voice: User Stories & Tips",
      postingTime: "7:00 PM (Evening Wind-Down)",
      captionFocus: `Interactive conversation post asking followers for their seasonal prep routines while showcasing ${prod} in action.`,
      visualPromptBrief: `Carousel graphic: Step-by-step holiday checklist card or video mockup with warm typography.`,
      primaryMetric: "Comments & Direct Messages"
    },
    {
      title: "The Behind-the-Scenes: Craft & Quality",
      postingTime: "11:30 AM (Midday Browse)",
      captionFocus: `Show the dedication and care behind ${prod}. Connect back to the holiday spirit of craftsmanship.`,
      visualPromptBrief: `Editorial documentary-style photo showing textures, packaging, or studio creation process with warm bokeh.`,
      primaryMetric: "Profile Visits & Brand Recall"
    },
    {
      title: "The Urgent Call: Final Chance & Holiday Guarantee",
      postingTime: "6:00 PM (Prime Engagement)",
      captionFocus: `Friendly deadline reminder to secure ${prod} before ${holidayName}. Direct CTA with link in bio.`,
      visualPromptBrief: `Bold, striking graphic with clear offer overlay, high-contrast festive palette, and celebratory confetti / starburst details.`,
      primaryMetric: "Direct Conversions & Checkouts"
    },
    {
      title: "The Holiday Eve Gratitude & Celebration",
      postingTime: "4:00 PM (Holiday Eve Social)",
      captionFocus: `Heartfelt thank you to the community. Reflecting on the campaign and celebrating ${holidayName}.`,
      visualPromptBrief: `Warm, glowing hero card with handwritten holiday greeting and subtle brand emblem.`,
      primaryMetric: "Likes & Heart Reactions"
    },
    {
      title: "Post-Holiday Wrap-Up & Fresh New Horizons",
      postingTime: "10:00 AM (New Day Awakening)",
      captionFocus: `Keep the momentum going with reflections and looking ahead to what's next.`,
      visualPromptBrief: `Fresh, airy, minimalist aesthetic with optimistic pastel or crisp clean lighting.`,
      primaryMetric: "Follower Retention & Engagement"
    }
  ];

  const days = templateDays.slice(0, numDays).map((day, idx) => ({
    dayNumber: idx + 1,
    ...day
  }));

  return {
    campaignTitle: `${holidayName} Spotlight: ${prod}`,
    targetObjective: `Pacing campaign to drive awareness, narrative affinity, and direct action for ${prod} leading up to ${holidayName}.`,
    days
  };
}

export function generateFallbackVisual(inputs: VisualBriefInput): VisualBriefResult {
  const { holiday, aesthetic, subjectFocus, platform } = inputs;
  const holidayName = holiday.trim() || "Holiday Season";

  // Palette generator based on holiday or aesthetic keywords
  const isDarkOrNoir = aesthetic.toLowerCase().includes("noir") || aesthetic.toLowerCase().includes("dark") || aesthetic.toLowerCase().includes("brutalist");
  const isRetroOrWarm = aesthetic.toLowerCase().includes("retro") || aesthetic.toLowerCase().includes("terracotta") || aesthetic.toLowerCase().includes("warm");

  const palette = isDarkOrNoir
    ? [
        { hex: "#0F172A", role: "Deep Slate Midnight (Primary Background)" },
        { hex: "#F8FAFC", role: "Crisp Pure White (Header Typography)" },
        { hex: "#EAB308", role: "Gilded Gold Flare (Accent & Highlights)" },
        { hex: "#334155", role: "Muted Steel (Card Borders & Subtle Lines)" }
      ]
    : isRetroOrWarm
    ? [
        { hex: "#C2410C", role: "Burnt Terracotta (Primary Warm Anchor)" },
        { hex: "#FEF3C7", role: "Buttermilk Cream (Background & Canvas)" },
        { hex: "#D97706", role: "Warm Amber Mustard (Secondary Accents)" },
        { hex: "#451A03", role: "Deep Roasted Espresso (High-Contrast Text)" }
      ]
    : [
        { hex: "#1E1B4B", role: "Midnight Indigo (Rich Foundation Base)" },
        { hex: "#EEF2FF", role: "Starlight Frost (Clean High-Key Text)" },
        { hex: "#6366F1", role: "Electric Iris (Eye-Catching Accent)" },
        { hex: "#F43F5E", role: "Festive Crimson Glow (Call-to-Action Highlight)" }
      ];

  return {
    moodDescription: `A refined visual aesthetic celebrating ${holidayName} in a ${aesthetic} design language. Balances atmospheric holiday elements with crisp product clarity on ${platform}.`,
    colorPalette: palette,
    typography: "Headline: Modern Editorial Display Serif with elegant kerning. Subtitle/Body: Clean Geometric Sans-Serif (Inter / Plus Jakarta Sans) for effortless mobile legibility.",
    imageGenerationPrompt: `Commercial studio photography of ${subjectFocus}, holiday atmosphere with subtle seasonal textures of ${holidayName}, aesthetic style: ${aesthetic}, soft cinematic side lighting, ultra high definition 8k, award winning art direction`,
    textOverlaySuggestion: `'Celebrate the Magic of ${holidayName}'`
  };
}

export function generateFallbackTrends(inputs: TrendScoutInput): TrendScoutResult {
  const { holiday, targetAudience, coreTopic } = inputs;
  const holidayName = holiday.trim() || "Holiday Season";
  const audience = targetAudience.trim() || "digital creators and savvy shoppers";
  const topic = coreTopic.trim() || "modern lifestyle brand";

  return {
    uniqueAngles: [
      {
        title: `The Anti-Hustle ${holidayName} Reset`,
        description: `Instead of traditional holiday rush, position ${topic} as the calm antidote designed specifically for ${audience}. Highlight intentional downtime and mindful moments.`
      },
      {
        title: `The "Unconventional Traditions" Showcase`,
        description: `Highlight quirky, modern traditions that ${audience} actually practice, avoiding tired clichés and connecting directly with real day-to-day habits around ${topic}.`
      },
      {
        title: `The Digital Declutter & Refresh`,
        description: `Connect ${holidayName} with a refresh ritual—cleaning up digital spaces, streamlining workflows, or upgrading routines with ${topic}.`
      }
    ],
    hooks: [
      `Unpopular opinion: The best part of ${holidayName} is doing absolutely nothing. Here's our playbook.`,
      `If you're already feeling the seasonal burnout, this one's for you.`,
      `We asked ${audience} what they actually want this ${holidayName}. The answers surprised us.`
    ],
    interactionIdeas: [
      {
        pollQuestion: `How early do you actually get ready for ${holidayName}?`,
        options: [
          "Weeks in advance (Overprepared)",
          "48 hours before (Adrenaline rush)",
          "I wing it entirely on the day"
        ]
      },
      {
        pollQuestion: `When it comes to ${topic} during the holidays, what is your #1 priority?`,
        options: [
          "Maximum convenience & speed",
          "Highest quality & aesthetic",
          "Best value & thoughtful gifting"
        ]
      }
    ]
  };
}
