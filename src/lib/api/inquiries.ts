import { supabase } from "@/integrations/supabase/client";

export async function submitInquiry(input: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}) {
  const { data, error } = await supabase.from("inquiries").insert(input).select().single();
  if (error) throw error;
  return data;
}

// Admin
export async function getInquiries() {
  const { data, error } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function updateInquiryStatus(id: string, status: string) {
  const { error } = await supabase.from("inquiries").update({ status }).eq("id", id);
  if (error) throw error;
}