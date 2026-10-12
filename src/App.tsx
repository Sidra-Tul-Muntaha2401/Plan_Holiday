import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Calendar, 
  FileText, 
  Palette, 
  Lightbulb, 
  Copy, 
  Check, 
  RefreshCw, 
  Smartphone, 
  Compass, 
  MessageSquare, 
  ChevronRight, 
  Hash, 
  Clock, 
  TrendingUp,
  Image as ImageIcon,
  CheckCircle,
  HelpCircle,
  Info
} from "lucide-react";
import { 
  InputMode, 
  CaptionArchitectInput, 
  CampaignPlannerInput, 
  VisualBriefInput, 
  TrendScoutInput,
  CaptionArchitectResult, 
  CampaignPlannerResult, 
  VisualBriefResult, 
  TrendScoutResult 
} from "./types";
import {
  generateFallbackCaptions,
  generateFallbackCampaign,
  generateFallbackVisual,
  generateFallbackTrends
} from "./generatorFallback";

export default function App() {
  // Preset list of upcoming holidays
  const CURATED_HOLIDAYS = [
    { id: "thanksgiving", name: "Thanksgiving Day", desc: "Warm connection, gratitude, family, cozy fall" },
    { id: "christmas", name: "Christmas Season", desc: "Magic, gift giving, joy, holiday festive" },
    { id: "new-year", name: "New Year", desc: "Fresh start, resolutions, party, future outlook" },
    { id: "valentine", name: "Valentine's Day", desc: "Love, couples, gifting, self-care, elegant pink" },
    { id: "earth-day", name: "Earth Day", desc: "Sustainability, green, nature, conservation" },
    { id: "halloween", name: "Halloween", desc: "Spooky, playful, dark theme, autumn harvest" },
    { id: "pride-month", name: "Pride Month", desc: "Inclusivity, colorful, activism, community" }
  ];

  // Selected Holiday state
  const [selectedHoliday, setSelectedHoliday] = useState<string>("Thanksgiving Day");
  const [customHolidayActive, setCustomHolidayActive] = useState<boolean>(false);
  const [customHolidayName, setCustomHolidayName] = useState<string>("");

  // System states
  const [activeTab, setActiveTab] = useState<InputMode>("caption-architect");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Active inputs states
  const [captionInputs, setCaptionInputs] = useState<CaptionArchitectInput>({
    holiday: "Thanksgiving Day",
    brandCategory: "Healthy Meal Kits / Food Delivery",
    sellingPoint: "Zero-stress fresh ingredient boxes for your friendsgiving gathering",
    tone: "Witty & Conversational"
  });

  const [campaignInputs, setCampaignInputs] = useState<CampaignPlannerInput>({
    holiday: "Christmas Season",
    campaignNarrative: "12 Days of Unwinding: Focusing on mental rest and cozy self-care leading up to the holidays",
    product: "Organic Herbal Oils & Scented Candles",
    durationDays: "5"
  });

  const [visualInputs, setVisualInputs] = useState<VisualBriefInput>({
    holiday: "New Year",
    aesthetic: "Elegant Minimalist Noir (High-contrast, thin fonts, golden accents)",
    subjectFocus: "Premium smart wellness journal planner",
    platform: "Instagram Post (1:1 Square)"
  });

  const [trendInputs, setTrendInputs] = useState<TrendScoutInput>({
    holiday: "Earth Day",
    targetAudience: "Busy urban tech professionals",
    coreTopic: "Custom Productivity/Focus Software & App"
  });

  // Generated results states
  const [captionResult, setCaptionResult] = useState<CaptionArchitectResult | null>({
    caption1: "🍂 Leave the holiday panic to the chefs. Our Friendsgiving Meal Kit brings organic, pre-measured perfection to your table in under 30 minutes. Less sink-scrubbing, more wine-sipping! \n\n👉 Reserve your Thanksgiving feast box today at the link in bio. Use code GRATITUDE20 for 20% off. \n\n#Friendsgiving #ThanksgivingFeast #OrganicMealKit #EasyCooking #GratitudeSeason",
    caption2: "Gratitude isn't about the hours spent baking—it's about the hours spent sharing stories around the table. \n\nThis Thanksgiving, we're taking the complex prep work off your plate so you can savor the moments that actually count. Nourish your body, spend your precious energy on friends, and let us handle the rest. ✨\n\n#MindfulCooking #HoldTheStress #FriendsgivingDinner #GratitudeDaily #FamilyTime",
    caption3: "Be honest. What's the ultimate Thanksgiving dealbreaker dish? \n\n🥑 A) Lumpy mashed potatoes (a tragedy)\n🌽 B) Overly dry stuffing\n🥧 C) Store-bought pumpkin pie representation\n\nDrop your vote below, and tag the friend who's in charge of your Friendsgiving sides this year! 👇\n\n#ThanksgivingPoll #FriendsgivingTrivia #MashedPotatoes #FoodieDebates #HolidayCooking",
    strategy: "By contrasting seasonal burnout with 'zero-stress' convenience, we play into relatable social pain points while using conversational tone. Captions target both promotional velocity and long-form emotional branding."
  });

  const [campaignResult, setCampaignResult] = useState<CampaignPlannerResult | null>({
    campaignTitle: "12 Days of Unwinding Vibe",
    targetObjective: "Build a solid brand community and pre-orders by connecting physical scent relaxation with high holiday stress relief.",
    days: [
      {
        dayNumber: 1,
        title: "The Holiday Overwhelm Check-In",
        postingTime: "7:30 PM (Evening Unwind)",
        captionFocus: "Normalize feeling tired before Christmas gets busy. Ask followers what their favorite wind-down routine is.",
        visualPromptBrief: "Cozy warm bedroom setting, candle flame glowing, subtle background shadows with a soft focus on the oil bottle.",
        primaryMetric: "Saves & Engagement Comments"
      },
      {
        dayNumber: 2,
        title: "The Secret Chemistry of Lavender",
        postingTime: "12:15 PM (Midday Relief)",
        captionFocus: "Educate on how pure chamomile and organic herbal oils physically trigger muscle calming.",
        visualPromptBrief: "Minimalist graphic layout split-screen: side-by-side botanical watercolor sketch of lavender and clean white bottle.",
        primaryMetric: "Saves & Shares"
      },
      {
        dayNumber: 3,
        title: "Gift of Rest Checklist",
        postingTime: "8:00 AM (Morning Mindset)",
        captionFocus: "Provide a quick holiday boundaries checklist (e.g. say no to one party, take a 20-min bath) promoting the organic self-care bundle.",
        visualPromptBrief: "High-contrast card-style list graphic using corporate chic fonts with soft warm orange brand palette.",
        primaryMetric: "Direct Saves"
      }
    ]
  });

  const [visualResult, setVisualResult] = useState<VisualBriefResult | null>({
    moodDescription: "An ambient and sophisticated winter atmosphere. High contrast shadow graphics that exude high-end premium workspace design.",
    colorPalette: [
      { hex: "#0F172A", role: "Premium Slate Background" },
      { hex: "#E2E8F0", role: "Crisp Typography Overlay" },
      { hex: "#F59E0B", role: "Warm Golden Flare / Key Accents" },
      { hex: "#475569", role: "Subtle Shadows / Frame lines" }
    ],
    typography: "Header: Display Serif (Playfair style) tracked thin. Body Text: Clean Monospace (JetBrains / Atlas Mono) to state structural features.",
    imageGenerationPrompt: "Premium black velvet stationery notebook placed delicately on slate desk, sliced by dramatic warm golden morning light beam, minimalist cozy winter setup, atmospheric studio photography style, 4k, hyper-detailed",
    textOverlaySuggestion: "'A Clean Slate for the Journey Ahead. 2027 Goals.'"
  });

  const [trendResult, setTrendResult] = useState<TrendScoutResult | null>({
    uniqueAngles: [
      {
        title: "Earth Day 'Offline' Challenge for Coders",
        description: "Focus on how shutting down screens for 1 hour saves literal server energy and refreshes brain RAM. Directly plug your productivity app during off-time of Earth Day."
      },
      {
        title: "E-Waste Cleanout Guide",
        description: "Ask tech teams to delete old unused drafts, cloud files, and subscription spam to reduce data center power load. Very unique, nerd-relatable twist."
      }
    ],
    hooks: [
      "Wait, does your cloud storage consume more power than your coffee machine?",
      "The greenest line of code is the one you don't write. Let's optimize Earth Day.",
      "Is your desktop recycling bin cleaner than ours? Let's check."
    ],
    interactionIdeas: [
      {
        pollQuestion: "How much digital clutter is currently sitting in your downloads folder?",
        options: ["Less than 1GB (Pure Saint)", "1-10GB (Normal Human)", "100GB+ (I pack digital hoards)"]
      }
    ]
  });

  // State for toggling caption views in the simulated Instagram Mock Feed
  const [selectedMockCaption, setSelectedMockCaption] = useState<"caption1" | "caption2" | "caption3">("caption1");

  // Sync inputs with selected holiday presets
  const handleHolidaySelect = (holidayName: string) => {
    setSelectedHoliday(holidayName);
    setCustomHolidayActive(false);

    // Update the relevant field inside current active tab inputs
    if (activeTab === "caption-architect") {
      setCaptionInputs(prev => ({ ...prev, holiday: holidayName }));
    } else if (activeTab === "campaign-planner") {
      setCampaignInputs(prev => ({ ...prev, holiday: holidayName }));
    } else if (activeTab === "visual-brief") {
      setVisualInputs(prev => ({ ...prev, holiday: holidayName }));
    } else if (activeTab === "trend-scout") {
      setTrendInputs(prev => ({ ...prev, holiday: holidayName }));
    }
  };

  const handleCustomHolidayChange = (name: string) => {
    setCustomHolidayName(name);
    setSelectedHoliday(name);

    if (activeTab === "caption-architect") {
      setCaptionInputs(prev => ({ ...prev, holiday: name }));
    } else if (activeTab === "campaign-planner") {
      setCampaignInputs(prev => ({ ...prev, holiday: name }));
    } else if (activeTab === "visual-brief") {
      setVisualInputs(prev => ({ ...prev, holiday: name }));
    } else if (activeTab === "trend-scout") {
      setTrendInputs(prev => ({ ...prev, holiday: name }));
    }
  };

  const triggerCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // API handler to fetch real-world outputs with Gemini API
  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    let payloadInputs: any = {};
    if (activeTab === "caption-architect") {
      payloadInputs = captionInputs;
    } else if (activeTab === "campaign-planner") {
      payloadInputs = campaignInputs;
    } else if (activeTab === "visual-brief") {
      payloadInputs = visualInputs;
    } else if (activeTab === "trend-scout") {
      payloadInputs = trendInputs;
    }

    try {
      let parsedResult: any = null;

      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: activeTab,
            inputs: payloadInputs
          })
        });

        if (response.ok) {
          parsedResult = await response.json();
        } else {
          // If server returns error, check if it's 404/static environment
          const text = await response.text();
          try {
            const errJson = JSON.parse(text);
            if (response.status === 404 || !errJson) {
              parsedResult = null;
            } else {
              throw new Error(errJson.error || "Server generation failed.");
            }
          } catch {
            // Not JSON (e.g. 404 HTML on GitHub Pages or static host)
            parsedResult = null;
          }
        }
      } catch (networkErr: any) {
        // Backend unavailable (e.g. static hosting on GitHub Pages)
        console.warn("Backend unavailable, using client-side intelligent generation engine:", networkErr);
        parsedResult = null;
      }

      // If backend was not available (e.g. GitHub Pages static deployment), generate client-side
      if (!parsedResult) {
        if (activeTab === "caption-architect") {
          parsedResult = generateFallbackCaptions(captionInputs);
        } else if (activeTab === "campaign-planner") {
          parsedResult = generateFallbackCampaign(campaignInputs);
        } else if (activeTab === "visual-brief") {
          parsedResult = generateFallbackVisual(visualInputs);
        } else if (activeTab === "trend-scout") {
          parsedResult = generateFallbackTrends(trendInputs);
        }
      }

      // Bind result
      if (activeTab === "caption-architect") {
        setCaptionResult(parsedResult as CaptionArchitectResult);
        setSelectedMockCaption("caption1");
      } else if (activeTab === "campaign-planner") {
        setCampaignResult(parsedResult as CampaignPlannerResult);
      } else if (activeTab === "visual-brief") {
        setVisualResult(parsedResult as VisualBriefResult);
      } else if (activeTab === "trend-scout") {
        setTrendResult(parsedResult as TrendScoutResult);
      }

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Something went wrong. Please check your network connection.");
    } finally {
      setIsLoading(false);
    }
  };

  // Pre-configured templates as requested by the user
  const IDEAS_VUE_TEMPLATES = [
    {
      id: "caption-architect",
      title: "Idea 1: Caption & Hashtag Architect",
      template: "My app takes the chosen holiday, brand category, value proposition, and social tone and uses Gemini AI to auto-generate customized captions and optimized hashtags to create three engagement post variants that help social media managers quickly draft engaging campaigns without creative burnout.",
      inputs: "Chosen holiday, brand category, value theme, social tone",
      process: "Uses Gemini AI to auto-generate customized captions and trending optimized hashtags",
      output: "Three post drafts (Promo, Story, Question quiz)",
      goal: "Quickly draft engaging copy without holiday brain-fog"
    },
    {
      id: "campaign-planner",
      title: "Idea 2: Day-by-Day Micro-Campaign Calendar",
      template: "My app takes holiday focus, specific product name, campaign narrative, and timeline length and structures a comprehensive chronological sequence of daily content pieces, recommended posting slots, and visual assets briefs to create an interactive calendar dashboard that helps social media teams maintain narrative flow.",
      inputs: "Holiday focus, core item, campaign message narrative, day duration",
      process: "Structures a chronological daily campaign roadmap of specific pieces, times, and design briefs",
      output: "Interactive, day-by-day content schedule calendar outline",
      goal: "Maintain consistent narrative pacing across the holiday buildup"
    },
    {
      id: "visual-brief",
      title: "Idea 3: Creative Graphic Brief Studio",
      template: "My app takes the selected holiday, specific aesthetic voice, subject focus, and publishing platform and creates highly tailored spatial rules, hexadecimal custom palettes, font suggestions, typographic scales, and optimized AI image prompts to create a structured visual direction sheet that helps social media managers brief design departments.",
      inputs: "Selected holiday, specific aesthetic theme, subject focus, target platform",
      process: "Creates custom color palettes, canvas overlay texts, typography rules, and AI image prompts",
      output: "A complete professional art direction visual brief",
      goal: "Provide precise image generation scripts or handoffs to graphic teams"
    },
    {
      id: "trend-scout",
      title: "Idea 4: Holiday Trend Scout & Hook Scout",
      template: "My app takes calendar observances, core topics, and specific target audience demographics and filters out boring industry cliches to produce creative angles, disruptive interest-grabbers, and survey questionnaires to create an interactive brainstorming ledger that helps brands stand out with unexpected, highly personalized holiday spins.",
      inputs: "Calendar observance, target audience tech/niche, core brand topics",
      process: "Filters out predictable clichés to generate witty hooks, niche angles, and custom polls",
      output: "Brainstorming ledger of disruptive headlines, poles, and quirky content twists",
      goal: "Capture social feed attention with witty, hyper-relevant angles"
    }
  ];

  // Quick helper to auto-load configuration for an Idea
  const selectIdeaPreset = (ideaId: InputMode) => {
    setActiveTab(ideaId);
    
    // Custom presets for easy testing
    if (ideaId === "caption-architect") {
      setCaptionInputs({
        holiday: selectedHoliday,
        brandCategory: "Eco-Friendly Skincare",
        sellingPoint: "Zero-cruelty vegan sunscreens and aloe recovery mists",
        tone: "Warm & Mindful"
      });
    } else if (ideaId === "campaign-planner") {
      setCampaignInputs({
        holiday: selectedHoliday,
        campaignNarrative: "7 Days of Intentional Living: Small green routines leading up to Earth Day",
        product: "Reusable Zero-Waste Household Starter Kit",
        durationDays: "5"
      });
    } else if (ideaId === "visual-brief") {
      setVisualInputs({
        holiday: selectedHoliday,
        aesthetic: "Vibrant Retro 70s Warmth (Dusty mustard yellow, warm terracotta, thick fonts)",
        subjectFocus: "Limited edition eco thermos flask",
        platform: "Instagram Story (9:16 Portrait)"
      });
    } else if (ideaId === "trend-scout") {
      setTrendInputs({
        holiday: selectedHoliday,
        targetAudience: "Nostalgic Gen Z audience",
        coreTopic: "Custom local coffee shop & pastry cafe"
      });
    }
  };

  return (
    <div id="holiday-planner-root" className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900 pb-16">
      
      {/* Upper Brand Header Bar */}
      <header id="main-header" className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-indigo-200 shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                Holiday Social Media Planner
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Professional Full-Stack AI Campaign Studio
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs bg-slate-100 p-1.5 rounded-lg border border-slate-200">
            <span className="px-2 py-1 bg-white shadow-xs rounded font-semibold text-slate-700">Studio Version 2.5</span>
            <span className="text-slate-500 pr-1 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              Google Gemini-3.5-Flash Active
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* TOP PANEL: Interactive Proposal Showcase */}
        <section id="propositions-showcase" className="mb-10">
          <div className="bg-indigo-950 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-slate-800">
            <div className="absolute right-0 top-0 w-96 h-96 bg-gradient-to-bl from-indigo-500/10 via-indigo-600/5 to-transparent rounded-full pointer-events-none" />
            
            <div className="relative z-10 max-w-3xl">
              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 font-semibold tracking-wider text-[11px] rounded-full uppercase border border-indigo-400/20 inline-block mb-3">
                Approved Application Architecture
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 text-slate-100">
                Pick Your Campaign Blueprint
              </h2>
              <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                Choose any of the 4 standalone workflow modules recommended below to customize captions, calendar campaigns, designer briefs, or custom hook triggers.
              </p>
            </div>

            {/* Structured Formula Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
              {IDEAS_VUE_TEMPLATES.map((idea) => {
                const isActive = activeTab === idea.id;
                return (
                  <button
                    key={idea.id}
                    onClick={() => selectIdeaPreset(idea.id as InputMode)}
                    className={`text-left p-4 rounded-xl transition-all duration-300 flex flex-col justify-between group ${
                      isActive 
                        ? "bg-indigo-600 border-2 border-indigo-400 text-white shadow-md shadow-indigo-900/50 scale-[1.02]" 
                        : "bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-white"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-xs tracking-wider uppercase opacity-90 block">
                          {idea.id === "caption-architect" && "📝 Architect"}
                          {idea.id === "campaign-planner" && "📅 Planner"}
                          {idea.id === "visual-brief" && "🎨 Visuals"}
                          {idea.id === "trend-scout" && "💡 Trend Scout"}
                        </span>
                        <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isActive ? "text-indigo-200" : "text-slate-400"}`} />
                      </div>
                      <h3 className={`font-bold text-sm leading-tight mb-2 ${isActive ? "text-white" : "text-white/90"}`}>
                        {idea.title}
                      </h3>
                      <p className={`text-xs leading-relaxed mb-3 line-clamp-3 ${isActive ? "text-indigo-150" : "text-slate-400 font-medium"}`}>
                        {idea.template}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/10">
                      <span className="text-[10px] font-mono tracking-tight text-white/60 block">
                        Inputs: {idea.inputs.split(", ")[0]}...
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* WORKSPACE ELEMENT: Two columns layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT 7-COLUMNS: Control Panel & Form Inputs */}
          <section id="campaign-controls-column" className="lg:col-span-7 space-y-6">
            
            {/* 1. Global Holiday Curated Selector */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold tracking-tight text-slate-900 uppercase flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  Primary Seasonal Holiday
                </h3>
                <span className="text-xs text-slate-400">Select one or use custom</span>
              </div>

              {/* Curated list */}
              <div className="flex flex-wrap gap-2 mb-4">
                {CURATED_HOLIDAYS.map((h) => {
                  const isCuratedActive = selectedHoliday === h.name && !customHolidayActive;
                  return (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => handleHolidaySelect(h.name)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all duration-200 font-medium text-left ${
                        isCuratedActive
                          ? "bg-indigo-50 border-indigo-600 text-indigo-700 shadow-2xs font-semibold"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {h.name}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => {
                    setCustomHolidayActive(true);
                    setSelectedHoliday(customHolidayName || "Custom Holidays");
                  }}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all duration-200 font-medium ${
                    customHolidayActive
                      ? "bg-indigo-50 border-indigo-600 text-indigo-700 font-semibold"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  ✨ Custom Holiday...
                </button>
              </div>

              {/* Custom input drawer */}
              {customHolidayActive && (
                <div className="pt-2">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Enter Custom Holiday Name
                  </label>
                  <input
                    type="text"
                    value={customHolidayName}
                    onChange={(e) => handleCustomHolidayChange(e.target.value)}
                    placeholder="e.g. Clean Energy Day, National Pizza Day"
                    className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 outline-hidden focus:border-indigo-500 focus:bg-white transition-colors"
                  />
                </div>
              )}
            </div>

            {/* 2. Active Module Detail Form */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              
              {/* Tab Header inside card */}
              <div className="flex border-b border-slate-200 bg-slate-50/50 p-2 gap-1 overflow-x-auto">
                <button
                  onClick={() => setActiveTab("caption-architect")}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-2.5 rounded-lg whitespace-nowrap transition-all ${
                    activeTab === "caption-architect" 
                      ? "bg-white text-indigo-700 shadow-sm border border-slate-200/60" 
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <FileText className="w-4 h-4 text-indigo-600" />
                  Caption Architect
                </button>
                <button
                  onClick={() => setActiveTab("campaign-planner")}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-2.5 rounded-lg whitespace-nowrap transition-all ${
                    activeTab === "campaign-planner" 
                      ? "bg-white text-indigo-700 shadow-sm border border-slate-200/60" 
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  Micro-Campaign Plan
                </button>
                <button
                  onClick={() => setActiveTab("visual-brief")}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-2.5 rounded-lg whitespace-nowrap transition-all ${
                    activeTab === "visual-brief" 
                      ? "bg-white text-indigo-700 shadow-sm border border-slate-200/60" 
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Palette className="w-4 h-4 text-indigo-600" />
                  Visual Palette & Brief
                </button>
                <button
                  onClick={() => setActiveTab("trend-scout")}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-2.5 rounded-lg whitespace-nowrap transition-all ${
                    activeTab === "trend-scout" 
                      ? "bg-white text-indigo-700 shadow-sm border border-slate-200/60" 
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Lightbulb className="w-4 h-4 text-indigo-600" />
                  Trend Scout
                </button>
              </div>

              {/* Active Tab Form Body */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  {activeTab === "caption-architect" && (
                    <motion.div
                      key="caption-tab"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-start gap-2 max-w-md">
                          <Info className="w-4 h-4 text-indigo-600 pr-0.5 mt-0.5" />
                          <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                            Idea 1: Build ready-to-copy social post drafts under 3 target formulas (Promo hook, authentic narrative story, interactive poll).
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                            Target Holiday Theme
                          </label>
                          <input
                            type="text"
                            disabled
                            value={selectedHoliday}
                            className="w-full text-xs px-3.5 py-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                            Tone & Sentiment Vibe
                          </label>
                          <select
                            value={captionInputs.tone}
                            onChange={(e) => setCaptionInputs(p => ({ ...p, tone: e.target.value }))}
                            className="w-full text-xs px-3.5 py-3 rounded-lg border border-slate-200 bg-white outline-hidden focus:border-indigo-500 font-medium"
                          >
                            <option value="Witty & Conversational">Witty & Conversational</option>
                            <option value="Warm, Emotional & Nostalgic">Warm, Emotional & Nostalgic</option>
                            <option value="Sleek, Minimal & Professional">Sleek, Minimal & Professional</option>
                            <option value="Bold, Urgent & Sale-Focused">Bold, Urgent & Sale-Focused</option>
                            <option value="Quirky & Humorous">Quirky & Humorous</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                          Brand Category / Industry Niche
                        </label>
                        <input
                          type="text"
                          value={captionInputs.brandCategory}
                          onChange={(e) => setCaptionInputs(p => ({ ...p, brandCategory: e.target.value }))}
                          placeholder="e.g. Modern Workspace Tech, Handmade Ceramics"
                          className="w-full text-xs px-3.5 py-3 rounded-lg border border-slate-200 bg-white outline-hidden focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                          Core Value Prop / Seasonal Offer Link
                        </label>
                        <textarea
                          rows={3}
                          value={captionInputs.sellingPoint}
                          onChange={(e) => setCaptionInputs(p => ({ ...p, sellingPoint: e.target.value }))}
                          placeholder="What is the key takeaway, product link, or special discount code to highlight?"
                          className="w-full text-xs p-3.5 rounded-lg border border-slate-200 bg-white outline-hidden focus:border-indigo-500 resize-none leading-relaxed"
                        />
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "campaign-planner" && (
                    <motion.div
                      key="campaign-tab"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="w-4 h-4 text-indigo-600 mt-0.5" />
                        <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                          Idea 2: Day-by-day sequence content calendar leading up to the holiday with posting time guides, caption emphasis, and visual assets briefs.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                            Target Holiday
                          </label>
                          <input
                            type="text"
                            disabled
                            value={selectedHoliday}
                            className="w-full text-xs px-3.5 py-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                            Campaign Length
                          </label>
                          <select
                            value={campaignInputs.durationDays}
                            onChange={(e) => setCampaignInputs(p => ({ ...p, durationDays: e.target.value }))}
                            className="w-full text-xs px-3.5 py-3 rounded-lg border border-slate-200 bg-white outline-hidden focus:border-indigo-500 font-medium"
                          >
                            <option value="3">3 Days (Quick Pre-burst)</option>
                            <option value="5">5 Days (Standard Built Up)</option>
                            <option value="7">7 Days (Full Narrative Week)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                          Target Product / Feature
                        </label>
                        <input
                          type="text"
                          value={campaignInputs.product}
                          onChange={(e) => setCampaignInputs(p => ({ ...p, product: e.target.value }))}
                          placeholder="e.g. Ergonomic Office Desk Chair, Reusable Vegan Coffee Cup"
                          className="w-full text-xs px-3.5 py-3 rounded-lg border border-slate-200 bg-white outline-hidden focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                          Storytelling Narrative Vibe
                        </label>
                        <textarea
                          rows={3}
                          value={campaignInputs.campaignNarrative}
                          onChange={(e) => setCampaignInputs(p => ({ ...p, campaignNarrative: e.target.value }))}
                          placeholder="What is the story thread? (e.g., 12 Days of Unwinding, or 5 Days of green life decisions)"
                          className="w-full text-xs p-3.5 rounded-lg border border-slate-200 bg-white outline-hidden focus:border-indigo-500 resize-none leading-relaxed"
                        />
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "visual-brief" && (
                    <motion.div
                      key="visual-tab"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="w-4 h-4 text-indigo-600 mt-0.5" />
                        <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                          Idea 3: Design visual guidelines brief. Maps out custom color swatches, typography scales, graphic layovers, and an exact prompt for image generation tools.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                            Publishing Platform Format
                          </label>
                          <select
                            value={visualInputs.platform}
                            onChange={(e) => setVisualInputs(p => ({ ...p, platform: e.target.value }))}
                            className="w-full text-xs px-3.5 py-3 rounded-lg border border-slate-200 bg-white outline-hidden focus:border-indigo-500 font-medium"
                          >
                            <option value="Instagram Post (1:1 Square)">Instagram Post (1:1 Square)</option>
                            <option value="Instagram Reel / Tik Tok (9:16 Vertical)">Instagram Reel & Story (9:16 Vertical)</option>
                            <option value="Pinterest Pin (2:3 High Density)">Pinterest Pin (2:3 High Density)</option>
                            <option value="LinkedIn Header Banner">LinkedIn Post Card (4:3 Horizon)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                            Visual Style & Vibe
                          </label>
                          <input
                            type="text"
                            value={visualInputs.aesthetic}
                            onChange={(e) => setVisualInputs(p => ({ ...p, aesthetic: e.target.value }))}
                            placeholder="e.g. 70s Cozy Terracotta Retro, Dark Cyber Brutalist Mono"
                            className="w-full text-xs px-3.5 py-3 rounded-lg border border-slate-200 bg-white outline-hidden focus:border-indigo-500 font-medium"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                          Core Visual Subject / Product Focus
                        </label>
                        <textarea
                          rows={3}
                          value={visualInputs.subjectFocus}
                          onChange={(e) => setVisualInputs(p => ({ ...p, subjectFocus: e.target.value }))}
                          placeholder="Describe the main visual anchor. E.g., Cream insulated tumbler surrounded by warm dried orange slices and evergreen spices."
                          className="w-full text-xs p-3.5 rounded-lg border border-slate-200 bg-white outline-hidden focus:border-indigo-500 resize-none leading-relaxed"
                        />
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "trend-scout" && (
                    <motion.div
                      key="trend-tab"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="w-4 h-4 text-indigo-600 mt-0.5" />
                        <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                          Idea 4: Skip standard clichés. Scout cheeky, quirky angles, thumb-stopping headline hooks, and engagement metrics tools related to your industry.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                            Observance Focus
                          </label>
                          <input
                            type="text"
                            disabled
                            value={selectedHoliday}
                            className="w-full text-xs px-3.5 py-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                            Target Audience
                          </label>
                          <input
                            type="text"
                            value={trendInputs.targetAudience}
                            onChange={(e) => setTrendInputs(p => ({ ...p, targetAudience: e.target.value }))}
                            placeholder="e.g. Remote WFH remote parents, college students"
                            className="w-full text-xs px-3.5 py-3 rounded-lg border border-slate-200 bg-white outline-hidden focus:border-indigo-500 font-medium"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                          Core Brand Topic / Niche Industry
                        </label>
                        <textarea
                          rows={3}
                          value={trendInputs.coreTopic}
                          onChange={(e) => setTrendInputs(p => ({ ...p, coreTopic: e.target.value }))}
                          placeholder="Explain what your startup / brand does"
                          className="w-full text-xs p-3.5 rounded-lg border border-slate-200 bg-white outline-hidden focus:border-indigo-500 resize-none leading-relaxed"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Panel Error messages and Action Button */}
                <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    {errorMsg && (
                      <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200/65 rounded-lg px-3 py-1.5 max-w-sm flex items-start gap-1">
                        <span className="font-bold">Error:</span> {errorMsg}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="w-full md:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-indigo-300 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Gemini AI Orchestrating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Draft Post Blueprint
                      </>
                    )}
                  </button>
                </div>

              </div>
            </div>

            {/* Curated Campaign Quick Insight Details */}
            <div className="bg-slate-900 text-slate-300 rounded-xl p-6 border border-slate-800/80">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Compass className="w-4 h-4 text-indigo-400" />
                Why standalone and database-free works
              </h4>
              <p className="text-xs leading-relaxed mb-1 text-slate-300 font-semibold">
                By maintaining purely transient react bindings paired with standard structured outputs, we completely avoid heavy local DB maintenance or database latency. You get instant draft handoffs, copy-paste workflow acceleration, custom art visual specifications, and hashtag formatting guides directly in your workspace.
              </p>
            </div>
          </section>

          {/* RIGHT 5-COLUMNS: Post Simulation Output Frame */}
          <section id="campaign-output-column" className="lg:col-span-5 space-y-6">
            
            {/* Visual Header indicating results state */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 pb-6">
              
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <h3 className="text-xs font-bold tracking-tight text-slate-900 uppercase flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-indigo-600" />
                  Live Feed Simulator
                </h3>
                <span className="text-[10px] font-mono font-bold uppercase py-0.5 px-2 bg-indigo-50 border border-indigo-200 rounded text-indigo-700">Preview Deck</span>
              </div>

              {/* Dynamic Presentation Window depends on active tab */}
              <div className="space-y-6">
                
                {/* Visual Preview Card simulation (Shows color palette or aesthetic concept) */}
                <div className="relative rounded-xl overflow-hidden bg-slate-900 text-white border border-slate-800 aspect-square shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between">
                  
                  {/* Card Background Overlay depending on palette or custom visual generation state */}
                  {activeTab === "visual-brief" && visualResult ? (
                    <div className="absolute inset-0 z-0 flex flex-col">
                      <div 
                        className="flex-1 transition-colors duration-500 relative" 
                        style={{ backgroundColor: visualResult.colorPalette[0]?.hex || "#1e293b" }}
                      >
                        {/* Dynamic aesthetic illustration simulator */}
                        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.15)_50%,transparent_75%)] bg-[length:250px_250px]" />
                        <div 
                          className="absolute bottom-8 left-8 right-8 p-4 rounded-lg bg-black/40 backdrop-blur-xs border border-white/10"
                        >
                          <p 
                            className="text-center font-bold tracking-tight text-md leading-snug drop-shadow-sm text-balance"
                            style={{ color: visualResult.colorPalette[1]?.hex || "#ffffff" }}
                          >
                            {visualResult.textOverlaySuggestion.replace(/^'(.*)'$/, '$1')}
                          </p>
                        </div>
                      </div>
                      
                      {/* Color Palette visualization strip */}
                      <div className="h-14 grid grid-cols-4 border-t border-slate-700">
                        {visualResult.colorPalette.map((col, idx) => (
                          <div 
                            key={idx} 
                            className="relative group transition-transform duration-200 hover:scale-105"
                            style={{ backgroundColor: col.hex }}
                            title={`${col.role}: ${col.hex}`}
                          >
                            <span className="absolute bottom-1 left-1 bg-black/60 text-[8px] px-1 rounded text-white font-mono scale-90">
                              {col.hex}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    // Default Fallback Gradient Graphic matching chosen holiday theme
                    <div className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 flex items-center justify-center p-6 text-center">
                      <div className="space-y-3 relative z-10">
                        <span className="px-2.5 py-1 bg-white/10 text-indigo-200 font-semibold text-[10px] rounded-full border border-white/15 uppercase tracking-widest inline-block">
                          {selectedHoliday}
                        </span>
                        <h4 className="text-xl font-extrabold text-white tracking-tight px-4 leading-tight">
                          {activeTab === "caption-architect" && captionResult ? "Draft Captions Formulated" : ""}
                          {activeTab === "campaign-planner" && campaignResult ? campaignResult.campaignTitle : ""}
                          {activeTab === "trend-scout" && trendResult ? "Disruptive Angles Discovered" : ""}
                          {!captionResult && !campaignResult && !trendResult && "Holiday Planner Studio"}
                        </h4>
                        <div className="w-12 h-1 bg-indigo-500 mx-auto rounded-full" />
                        <p className="text-slate-400 text-xs px-6 leading-relaxed max-w-xs mx-auto">
                          {activeTab === "caption-architect" && "Tweak options below to swap simulated preview posts."}
                          {activeTab === "campaign-planner" && "Check the interactive day timeline details."}
                          {activeTab === "trend-scout" && "Audience interactive polls mapped out below."}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Top Feed bar mimicking social handle */}
                  <div className="relative z-10 w-full p-3 bg-slate-950/80 backdrop-blur-xs border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                        {captionInputs.brandCategory ? captionInputs.brandCategory.substring(0, 2) : "BM"}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-200 block">@your_brand</span>
                        <span className="text-[9px] text-slate-400 block -mt-0.5">Sponsored • {selectedHoliday}</span>
                      </div>
                    </div>
                    <span className="text-slate-400 font-bold text-xs pr-1">•••</span>
                  </div>

                  {/* Empty spacer to fit overlay */}
                  <div className="flex-1" />

                  {/* Instagram heart/chat interactive indicator mock bar */}
                  <div className="relative z-10 w-full p-3.5 bg-slate-950/90 border-t border-white/5 flex items-center justify-between">
                    <div className="flex gap-3 text-slate-300">
                      <span className="text-xs font-medium">❤️ 1,248</span>
                      <span className="text-xs font-medium">💬 54</span>
                      <span className="text-xs font-medium">♻️ 89</span>
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Instagram Square</span>
                  </div>

                </div>

                {/* Simulated Feed Post Description / Caption */}
                {activeTab === "caption-architect" && captionResult && (
                  <div className="space-y-3 bg-slate-50 rounded-xl p-4 border border-slate-200/80">
                    
                    {/* Toggle Caption variants */}
                    <div className="grid grid-cols-3 gap-1.5 border-b border-slate-200 pb-3">
                      <button
                        onClick={() => setSelectedMockCaption("caption1")}
                        className={`text-[10px] py-1.5 px-2 rounded-lg font-bold border text-center transition-all ${
                          selectedMockCaption === "caption1"
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        1. Promotional
                      </button>
                      <button
                        onClick={() => setSelectedMockCaption("caption2")}
                        className={`text-[10px] py-1.5 px-2 rounded-lg font-bold border text-center transition-all ${
                          selectedMockCaption === "caption2"
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        2. Narrative
                      </button>
                      <button
                        onClick={() => setSelectedMockCaption("caption3")}
                        className={`text-[10px] py-1.5 px-2 rounded-lg font-bold border text-center transition-all ${
                          selectedMockCaption === "caption3"
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        3. Interactive
                      </button>
                    </div>

                    {/* Active Caption string rendering with copy functionality */}
                    <div className="relative group">
                      <div className="text-xs leading-relaxed text-slate-700 whitespace-pre-wrap font-medium select-all max-h-56 overflow-y-auto pr-3">
                        {selectedMockCaption === "caption1" && captionResult.caption1}
                        {selectedMockCaption === "caption2" && captionResult.caption2}
                        {selectedMockCaption === "caption3" && captionResult.caption3}
                      </div>

                      <button
                        onClick={() => {
                          const val = selectedMockCaption === "caption1" 
                            ? captionResult.caption1 
                            : selectedMockCaption === "caption2" 
                              ? captionResult.caption2 
                              : captionResult.caption3;
                          triggerCopy(val, "caption");
                        }}
                        className="absolute right-0 top-0 p-1.5 bg-white border border-slate-200 rounded shadow-xs text-slate-500 hover:text-slate-800 transition-colors"
                        title="Copy Caption Text"
                      >
                        {copiedText === "caption" ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <div className="pt-2.5 border-t border-slate-200 mt-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Copywriting Strategy</span>
                      <p className="text-[11px] text-slate-500 italic leading-relaxed">
                        {captionResult.strategy}
                      </p>
                    </div>

                  </div>
                )}

                {/* Day-by-Day Calendar Timeline presentation */}
                {activeTab === "campaign-planner" && campaignResult && (
                  <div className="space-y-4">
                    <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
                      <h4 className="text-xs font-extrabold text-indigo-900 mb-1">
                        Campaign: {campaignResult.campaignTitle}
                      </h4>
                      <p className="text-[11px] text-indigo-700 leading-relaxed font-semibold">
                        Goal Focus: {campaignResult.targetObjective}
                      </p>
                    </div>

                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                      {campaignResult.days.map((dayPlan, idx) => (
                        <div 
                          key={dayPlan.dayNumber || idx}
                          className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs relative"
                        >
                          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                            <span className="text-xs font-bold text-indigo-800">
                              DAY {dayPlan.dayNumber} : {dayPlan.title}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400 font-semibold bg-slate-50 border px-1.5 rounded flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-500" />
                              {dayPlan.postingTime}
                            </span>
                          </div>

                          <div className="space-y-2.5 text-xs text-slate-600 font-medium">
                            <p>
                              <strong className="text-slate-900 block mb-0.5">Caption focus instructions:</strong>
                              {dayPlan.captionFocus}
                            </p>
                            <div className="p-2 sm:p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                              <strong className="text-slate-900 flex items-center gap-1 mb-1">
                                <ImageIcon className="w-3.5 h-3.5 text-indigo-600" /> Use Creative Asset prompt:
                              </strong>
                              <span className="text-slate-500 italic block leading-relaxed">{dayPlan.visualPromptBrief}</span>
                            </div>
                            <span className="text-[10px] uppercase font-bold text-indigo-700 tracking-wider block pt-1 bg-indigo-50/50 -mx-4 -mb-4 p-2.5 border-t">
                              🎯 Primary Metric Target: {dayPlan.primaryMetric}
                            </span>
                          </div>

                          {/* Quick separate copy button */}
                          <button
                            onClick={() => triggerCopy(`Day ${dayPlan.dayNumber}: ${dayPlan.title}\nTime: ${dayPlan.postingTime}\nCaption Focus: ${dayPlan.captionFocus}\nAsset Prompt: ${dayPlan.visualPromptBrief}`, `day-${idx}`)}
                            className="absolute right-4 top-2 text-slate-400 hover:text-indigo-600 transition-colors"
                            title="Copy single day plan info"
                          >
                            {copiedText === `day-${idx}` ? (
                              <Check className="w-4.5 h-4.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Creative Visual Brief & Palette breakdown */}
                {activeTab === "visual-brief" && visualResult && (
                  <div className="space-y-4">
                    <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3.5 text-xs">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Visual Atmosphere Definition</span>
                        <p className="text-slate-600 font-medium leading-relaxed">
                          {visualResult.moodDescription}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Harmonized Hex Palette</span>
                        <div className="grid grid-cols-2 gap-2">
                          {visualResult.colorPalette.map((col, idx) => (
                            <div 
                              key={idx} 
                              onClick={() => triggerCopy(col.hex, `hex-${idx}`)}
                              className="p-1.5 rounded-lg border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-between gap-1.5"
                            >
                              <div className="flex items-center gap-2">
                                <span className="w-4 h-4 rounded-md inline-block shadow-2xs border border-black/10" style={{ backgroundColor: col.hex }} />
                                <span className="font-mono text-[10px] text-slate-700 font-bold">{col.hex}</span>
                              </div>
                              <span className="text-[9px] text-slate-400 font-semibold italic text-right truncate max-w-20">
                                {copiedText === `hex-${idx}` ? "Copied" : col.role}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Recommended Typography Pairings</span>
                        <p className="text-slate-600 font-medium italic">
                          {visualResult.typography}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 relative group">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Detailed AI Image Generator Prompt</span>
                        <p className="text-slate-600 font-mono text-[10px] bg-slate-50 p-2.5 rounded-lg border leading-normal whitespace-pre-wrap select-all">
                          {visualResult.imageGenerationPrompt}
                        </p>
                        
                        <button
                          onClick={() => triggerCopy(visualResult.imageGenerationPrompt, "image-prompt")}
                          className="absolute right-2 top-8 p-1.5 bg-white border border-slate-200 rounded shadow-xs text-slate-500 hover:text-slate-800 transition-colors"
                          title="Copy prompt"
                        >
                          {copiedText === "image-prompt" ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Trend Scout Angles and Quick Hooks */}
                {activeTab === "trend-scout" && trendResult && (
                  <div className="space-y-4">
                    
                    {/* Unique Witty Angles */}
                    <div className="space-y-2.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Disruptive Campaign Angles</span>
                      {trendResult.uniqueAngles.map((ang, idx) => (
                        <div key={idx} className="bg-white border border-slate-200 p-3.5 rounded-xl">
                          <h5 className="text-xs font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                            <span className="w-4 h-4 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-[9px] flex items-center justify-center">
                              {idx + 1}
                            </span>
                            {ang.title}
                          </h5>
                          <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                            {ang.description}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Stopper Headline Hooks */}
                    <div className="bg-slate-900 rounded-xl p-4 text-white space-y-2.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Thumb-Stopping Post Hooks</span>
                      <ul className="space-y-2">
                        {trendResult.hooks.map((hook, idx) => (
                          <li 
                            key={idx} 
                            onClick={() => triggerCopy(hook, `hook-${idx}`)}
                            className="bg-white/5 hover:bg-white/10 p-2 text-xs rounded border border-white/5 cursor-pointer font-medium italic flex items-center justify-between gap-1 transition-colors"
                          >
                            <span>&quot;{hook}&quot;</span>
                            <span className="text-[9px] text-white/50 text-right shrink-0">
                              {copiedText === `hook-${idx}` ? "Copied ✅" : "Click to Copy"}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Interaction poll ideas */}
                    <div className="space-y-2.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Engagement Poll templates</span>
                      {trendResult.interactionIdeas.map((idea, idx) => (
                        <div key={idx} className="bg-white border text-xs border-indigo-100 rounded-xl p-3.5 shadow-2xs">
                          <span className="block text-[10px] font-mono tracking-wider font-extrabold text-indigo-700 uppercase mb-1">Poll Format Survey</span>
                          <strong className="text-slate-900 block mb-2">{idea.pollQuestion}</strong>
                          <div className="space-y-1">
                            {idea.options.map((opt, oIdx) => (
                              <div key={oIdx} className="p-2 border border-slate-100 rounded bg-slate-50 flex items-center justify-between">
                                <span className="text-slate-600 text-[11px] font-semibold">{opt}</span>
                                <span className="text-[10px] text-slate-300 font-bold">0%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                )}

              </div>
            </div>

          </section>

        </div>

      </main>
    </div>
  );
}
