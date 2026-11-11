import * as ImagePicker from 'expo-image-picker';

import { supabase } from './supabase';

/** Lets the user pick a photo and uploads it to their folder in the media bucket. Returns the public URL, or null if cancelled. */
export async function pickAndUpload(userId: string, folder: string, aspect?: [number, number]): Promise<string | null> {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: 'images',
    allowsEditing: !!aspect,
    aspect,
    quality: 0.85,
  });
  if (result.canceled || !result.assets?.length) return null;
  const asset = result.assets[0];
  const blob = await (await fetch(asset.uri)).blob();
  const type = asset.mimeType ?? blob.type ?? 'image/jpeg';
  const ext = type.split('/')[1]?.replace('jpeg', 'jpg') ?? 'jpg';
  const path = `${userId}/${folder}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from('media').upload(path, blob, { contentType: type, upsert: false });
  if (error) throw new Error(error.message);
  return supabase.storage.from('media').getPublicUrl(path).data.publicUrl;
}
