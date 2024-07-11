import { ToastAndroid } from "react-native";

/**
 * Capitalizes the first letter of each word in a phrase.
 *
 * @param {string} phrase - The phrase to be capitalized.
 * @return {string} - The capitalized phrase.
 */
export function capitalizePhrase(phrase: string): string {
  return phrase
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Converts a phrase into a hyphen-separated string.
 *
 * @param {string} phrase - The phrase to be hyphenized.
 * @return {string} - The hyphenized phrase.
 */
export function hyphenizePhrase(phrase: string): string {
  return phrase.split(" ").join("-");
}

/**
 * Appends a timestamp to a phrase.
 *
 * @param {string} phrase - The phrase to be timestamped.
 * @return {string} - The phrase with a timestamp appended.
 */
export function timestampPhrase(phrase: string): string {
  return `${phrase}-${Date.now()}`;
}

/**
 * Shows a toast message with the given text.
 *
 * @param {string} message - The message to be displayed in the toast.
 */
export function showToast(message: string): void {
  if (message) {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    console.log("Attempted to show a toast with an empty or null message");
  }
}
