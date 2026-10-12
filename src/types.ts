export interface CuratedHoliday {
  id: string;
  name: string;
  date: string;
}

export type InputMode = "caption-architect" | "campaign-planner" | "visual-brief" | "trend-scout";

export interface CaptionArchitectInput {
  holiday: string;
  brandCategory: string;
  sellingPoint: string;
  tone: string;
}

export interface CampaignPlannerInput {
  holiday: string;
  campaignNarrative: string;
  product: string;
  durationDays: string;
}

export interface VisualBriefInput {
  holiday: string;
  aesthetic: string;
  subjectFocus: string;
  platform: string;
}

export interface TrendScoutInput {
  holiday: string;
  targetAudience: string;
  coreTopic: string;
}

export interface CaptionArchitectResult {
  caption1: string;
  caption2: string;
  caption3: string;
  strategy: string;
}

export interface DayPlan {
  dayNumber: number;
  title: string;
  postingTime: string;
  captionFocus: string;
  visualPromptBrief: string;
  primaryMetric: string;
}

export interface CampaignPlannerResult {
  campaignTitle: string;
  targetObjective: string;
  days: DayPlan[];
}

export interface ColorRole {
  hex: string;
  role: string;
}

export interface VisualBriefResult {
  moodDescription: string;
  colorPalette: ColorRole[];
  typography: string;
  imageGenerationPrompt: string;
  textOverlaySuggestion: string;
}

export interface UniqueAngle {
  title: string;
  description: string;
}

export interface InteractiveIdea {
  pollQuestion: string;
  options: string[];
}

export interface TrendScoutResult {
  uniqueAngles: UniqueAngle[];
  hooks: string[];
  interactionIdeas: InteractiveIdea[];
}
