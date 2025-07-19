import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const addFutsalShoes = async (shoe, brand, img) => {
  shoe = shoe.trim();
  brand = brand.trim().toLowerCase();
  img = img.trim().toLowerCase();
  const { data: existData, error: selectError } = await supabase
    .from("futsalShoes")
    .select("*")
    .eq("shoe", shoe)
    .eq("brand", brand)
    .limit(1);

  if (selectError && selectError.code !== "PGRST116") {
    console.error("Error checking existing data: ", selectError);
    return "exist";
  }

  if (existData.length > 0) {
    console.log("futsalShoes already exists, skipping insert:", existData);
    return "exist";
  }
  const { data, error } = await supabase
    .from("futsalShoes")
    .insert([{ shoe: shoe, brand: brand, img: img }]);

  if (error) {
    console.error("Error inserting data: ", error);
  } else {
    console.log("Data inserted succesful", data);
  }
};

export const addFutsalImg = async (file) => {
  if (!file) return null;

  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 10000);
  const fileExtension = file.name.split(".").pop();
  const fileName = `${timestamp}-${randomNum}.${fileExtension}`;

  const { data: existingFiles, error: listError } = await supabase.storage
    .from("futsal-images")
    .list("", { search: fileName });

  if (listError) {
    console.error("Error checking for existing file:", listError);
  }

  const isDuplicate = existingFiles?.some((f) => f.name === fileName);
  if (isDuplicate) {
    console.warn("이미 동일한 파일명이 존재합니다:", fileName);
    return null;
  }

  const { data, error } = await supabase.storage
    .from("futsal-images")
    .upload(`${fileName}`, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Image upload failed:", error);
    return null;
  }
  console.log("Image uploaded successfully:", data);

  return `${SUPABASE_URL}/storage/v1/object/public/futsal-images/${fileName}`;
};

export const getAllFutsal = async () => {
  const { data, error } = await supabase.from("futsalShoes").select("*");

  if (error) {
    console.error("Error fetching futsal: ", error);
    return [];
  }

  return data;
};

export const getFutsalById = async (id) => {
  const { data, error } = await supabase
    .from("futsalShoes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching futsal with id ${id}:`, error);
    return null;
  }

  return data;
};

export const incrementLike = async (id) => {
  const { data, error } = await supabase
    .from("futsalShoes")
    .select("like")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching like for id ${id}:`, error);
    return null;
  }

  const currentLike = Number(data.like) || 0;

  const { error: updateError } = await supabase
    .from("futsalShoes")
    .update({ like: currentLike + 1 })
    .eq("id", id);

  if (updateError) {
    console.error(`Error incrementing like for id ${id}:`, updateError);
    return null;
  }

  return currentLike + 1;
};
export const decrementLike = async (id) => {
  const { data, error } = await supabase
    .from("futsalShoes")
    .select("like")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching like for id ${id}:`, error);
    return null;
  }

  const currentLike = Number(data.like) || 0;

  const { error: updateError } = await supabase
    .from("futsalShoes")
    .update({ like: currentLike - 1 })
    .eq("id", id);

  if (updateError) {
    console.error(`Error incrementing like for id ${id}:`, updateError);
    return null;
  }

  return currentLike - 1;
};

export const addDetailComment = async (shoeid, comment) => {
  const { data, error } = await supabase
    .from("detailComment")
    .insert([{ shoeid: shoeid, comment: comment }]);

  if (error) {
    console.error("Error adding detail comment:", error);
    return null;
  }

  return data;
};

export const getCommentById = async (id) => {
  const { data, error } = await supabase
    .from("detailComment")
    .select("*")
    .eq("shoeid", id);

  if (error) {
    console.error(`Error fetching futsal with id ${id}:`, error);
    return null;
  }

  return data;
};

export const addTip = async (tip) => {
  const { data, error } = await supabase.from("tips").insert([{ tip: tip }]);

  if (error) {
    console.error("Error adding tip:", error);
    return null;
  }

  return data;
};

export const getAllTips = async () => {
  const { data, error } = await supabase.from("tips").select("*");

  if (error) {
    console.error(`Error fetching futsal tips:`, error);
    return null;
  }

  return data;
};
