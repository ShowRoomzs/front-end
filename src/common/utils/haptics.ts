import * as Haptics from "expo-haptics";

export async function likeHaptic() {
  await Haptics.selectionAsync();
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}
