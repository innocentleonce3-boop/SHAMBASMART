export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; full_name: string; phone: string | null; preferred_language: "en" | "sw"; role: "farmer" | "extension_officer" | "admin"; created_at: string; updated_at: string };
        Insert: { id: string; full_name?: string; phone?: string | null; preferred_language?: "en" | "sw"; role?: "farmer" | "extension_officer" | "admin" };
        Update: { full_name?: string; phone?: string | null; preferred_language?: "en" | "sw"; updated_at?: string };
        Relationships: [];
      };
      farms: {
        Row: { id: string; owner_id: string; name: string; region: string; district: string | null; village: string | null; latitude: number | null; longitude: number | null; area_hectares: number; soil_type: string | null; irrigation_type: string | null; description: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; owner_id: string; name: string; region: string; district?: string | null; village?: string | null; latitude?: number | null; longitude?: number | null; area_hectares: number; soil_type?: string | null; irrigation_type?: string | null; description?: string | null };
        Update: { name?: string; region?: string; district?: string | null; village?: string | null; latitude?: number | null; longitude?: number | null; area_hectares?: number; soil_type?: string | null; irrigation_type?: string | null; description?: string | null; updated_at?: string };
        Relationships: [];
      };
      fields: {
        Row: { id: string; farm_id: string; name: string; area_hectares: number; soil_type: string | null; notes: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; farm_id: string; name: string; area_hectares: number; soil_type?: string | null; notes?: string | null };
        Update: { name?: string; area_hectares?: number; soil_type?: string | null; notes?: string | null; updated_at?: string };
        Relationships: [];
      };
      crops: {
        Row: { id: string; name_en: string; name_sw: string; typical_duration_days: number | null; is_active: boolean; created_at: string };
        Insert: { id?: string; name_en: string; name_sw: string; typical_duration_days?: number | null; is_active?: boolean };
        Update: { name_en?: string; name_sw?: string; typical_duration_days?: number | null; is_active?: boolean };
        Relationships: [];
      };
      crop_seasons: {
        Row: { id: string; farm_id: string; field_id: string | null; crop_id: string; variety_id: string | null; season_name: string; planting_date: string; expected_harvest_date: string | null; growth_stage: string | null; cultivated_area_hectares: number; status: "planned" | "active" | "harvested" | "cancelled"; notes: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; farm_id: string; field_id?: string | null; crop_id: string; variety_id?: string | null; season_name: string; planting_date: string; expected_harvest_date?: string | null; growth_stage?: string | null; cultivated_area_hectares: number; status?: "planned" | "active" | "harvested" | "cancelled"; notes?: string | null };
        Update: { field_id?: string | null; variety_id?: string | null; season_name?: string; planting_date?: string; expected_harvest_date?: string | null; growth_stage?: string | null; cultivated_area_hectares?: number; status?: "planned" | "active" | "harvested" | "cancelled"; notes?: string | null; updated_at?: string };
        Relationships: [];
      };
      farm_activities: {
        Row: { id: string; farm_id: string; crop_season_id: string | null; activity_type: string; title: string; description: string | null; activity_date: string; status: "planned" | "in_progress" | "completed" | "cancelled"; cost_tzs: number | null; created_by: string; created_at: string; updated_at: string };
        Insert: { id?: string; farm_id: string; crop_season_id?: string | null; activity_type: string; title: string; description?: string | null; activity_date: string; status?: "planned" | "in_progress" | "completed" | "cancelled"; cost_tzs?: number | null; created_by?: string };
        Update: { crop_season_id?: string | null; activity_type?: string; title?: string; description?: string | null; activity_date?: string; status?: "planned" | "in_progress" | "completed" | "cancelled"; cost_tzs?: number | null; updated_at?: string };
        Relationships: [];
      };
      harvests: {
        Row: { id: string; farm_id: string; crop_season_id: string; harvested_on: string; quantity: number; unit: string; quality_grade: string | null; damaged_quantity: number; notes: string | null; created_by: string; created_at: string };
        Insert: { id?: string; farm_id: string; crop_season_id: string; harvested_on: string; quantity: number; unit: string; quality_grade?: string | null; damaged_quantity?: number; notes?: string | null; created_by?: string };
        Update: { harvested_on?: string; quantity?: number; unit?: string; quality_grade?: string | null; damaged_quantity?: number; notes?: string | null };
        Relationships: [];
      };
      sales: {
        Row: { id: string; farm_id: string; harvest_id: string | null; sold_on: string; quantity: number; unit: string; unit_price_tzs: number; total_tzs: number; buyer: string | null; notes: string | null; created_at: string };
        Insert: { id?: string; farm_id: string; harvest_id?: string | null; sold_on: string; quantity: number; unit: string; unit_price_tzs: number; buyer?: string | null; notes?: string | null };
        Update: { harvest_id?: string | null; sold_on?: string; quantity?: number; unit?: string; unit_price_tzs?: number; buyer?: string | null; notes?: string | null };
        Relationships: [];
      };
      expenses: {
        Row: { id: string; farm_id: string; crop_season_id: string | null; expense_type: "input" | "labor" | "transport" | "equipment" | "other"; description: string; amount_tzs: number; spent_on: string; notes: string | null; created_at: string };
        Insert: { id?: string; farm_id: string; crop_season_id?: string | null; expense_type: "input" | "labor" | "transport" | "equipment" | "other"; description: string; amount_tzs: number; spent_on: string; notes?: string | null };
        Update: { crop_season_id?: string | null; expense_type?: "input" | "labor" | "transport" | "equipment" | "other"; description?: string; amount_tzs?: number; spent_on?: string; notes?: string | null };
        Relationships: [];
      };
      crop_observations: {
        Row: { id: string; farm_id: string; crop_season_id: string | null; observed_at: string; growth_stage: string | null; plant_condition: "healthy" | "watch" | "poor" | "unknown" | null; symptoms: string | null; pest_observations: string | null; image_path: string | null; notes: string | null; created_by: string; created_at: string };
        Insert: { id?: string; farm_id: string; crop_season_id?: string | null; observed_at?: string; growth_stage?: string | null; plant_condition?: "healthy" | "watch" | "poor" | "unknown" | null; symptoms?: string | null; pest_observations?: string | null; image_path?: string | null; notes?: string | null; created_by?: string };
        Update: { crop_season_id?: string | null; observed_at?: string; growth_stage?: string | null; plant_condition?: "healthy" | "watch" | "poor" | "unknown" | null; symptoms?: string | null; pest_observations?: string | null; image_path?: string | null; notes?: string | null };
        Relationships: [];
      };
      disease_risk_assessments: {
        Row: { id: string; observation_id: string; risk_level: "low" | "moderate" | "high" | "unknown"; indicators: Json; ruleset_version: string; disclaimer: string; created_at: string };
        Insert: { id?: string; observation_id: string; risk_level: "low" | "moderate" | "high" | "unknown"; indicators?: Json; ruleset_version: string; disclaimer: string };
        Update: { risk_level?: "low" | "moderate" | "high" | "unknown"; indicators?: Json; ruleset_version?: string; disclaimer?: string };
        Relationships: [];
      };
      weather_cache: {
        Row: { id: string; farm_id: string; provider: string; forecast_for: string; fetched_at: string; temperature_c: number | null; precipitation_mm: number | null; wind_speed_kmh: number | null; payload: Json };
        Insert: { id?: string; farm_id: string; provider: string; forecast_for: string; fetched_at?: string; temperature_c?: number | null; precipitation_mm?: number | null; wind_speed_kmh?: number | null; payload: Json };
        Update: { fetched_at?: string; temperature_c?: number | null; precipitation_mm?: number | null; wind_speed_kmh?: number | null; payload?: Json };
        Relationships: [];
      };
      conversations: {
        Row: { id: string; subject: string; created_by: string; created_at: string };
        Insert: { id?: string; subject: string; created_by?: string };
        Update: { subject?: string };
        Relationships: [];
      };
      conversation_members: {
        Row: { conversation_id: string; user_id: string; last_read_at: string | null; joined_at: string };
        Insert: { conversation_id: string; user_id: string; last_read_at?: string | null };
        Update: { last_read_at?: string | null };
        Relationships: [];
      };
      messages: {
        Row: { id: string; conversation_id: string; sender_id: string; body: string; created_at: string };
        Insert: { id?: string; conversation_id: string; sender_id?: string; body: string };
        Update: { body?: string };
        Relationships: [];
      };
      notifications: {
        Row: { id: string; user_id: string; farm_id: string | null; kind: string; title: string; body: string; read_at: string | null; created_at: string };
        Insert: { id?: string; user_id: string; farm_id?: string | null; kind: string; title: string; body: string; read_at?: string | null };
        Update: { read_at?: string | null };
        Relationships: [];
      };
    };
    Views: Empty;
    Functions: {
      admin_overview_counts: { Args: Record<string, never>; Returns: { users_count: number; farms_count: number; active_crop_seasons_count: number; support_conversations_count: number }[] };
    };
    Enums: Empty;
    CompositeTypes: Empty;
  };
};
type Empty = { [_ in never]: never };