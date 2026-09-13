// GramDisha AI — Firebase Configuration & Ground Vendor Data Collection Service
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported, logEvent as fbLogEvent } from "firebase/analytics";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDl5iQv7hCbzRpGAu7hMKHTHJXSIx6o8vY",
  authDomain: "gramdishai.firebaseapp.com",
  projectId: "gramdishai",
  storageBucket: "gramdishai.firebasestorage.app",
  messagingSenderId: "610772809950",
  appId: "1:610772809950:web:854872cb4a2e7b9bf7ea4f",
  measurementId: "G-WFVR1YC19S"
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Analytics conditionally
export let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {});
}

/**
 * Log an analytics event safely
 */
export const trackEvent = (eventName, params = {}) => {
  try {
    if (analytics) {
      fbLogEvent(analytics, eventName, params);
    }
  } catch (err) {
    console.debug('Analytics log error (silent):', err);
  }
};

/**
 * Save Local Vendor Ground Survey Data to Firestore.
 * Used to collect field benchmark data from rural shopkeepers/artisans/farmers
 * to calibrate our AI viability models with actual local reality.
 */
export const submitVendorSurvey = async (surveyData) => {
  try {
    const docRef = await addDoc(collection(db, "vendor_surveys"), {
      ...surveyData,
      submitted_at: new Date().toISOString(),
      created_at: serverTimestamp(),
      platform: "GramDisha-AI-Web",
      version: "SIH-2026",
    });

    trackEvent("vendor_survey_submitted", {
      business_type: surveyData.business_type || "unspecified",
      state: surveyData.state || "unspecified",
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    console.warn("Firebase Firestore survey save warning (using local fallback):", error);
    // Graceful offline/fallback storage so user experience is never blocked
    try {
      const existing = JSON.parse(localStorage.getItem("gramdisha_offline_surveys") || "[]");
      existing.push({ ...surveyData, submitted_at: new Date().toISOString(), offline: true });
      localStorage.setItem("gramdisha_offline_surveys", JSON.stringify(existing));
    } catch (_) {}

    return { success: true, fallback: true };
  }
};

/**
 * Save Appraisal Feedback from Users / Credit Officers
 */
export const submitAppraisalFeedback = async (feedbackData) => {
  try {
    const docRef = await addDoc(collection(db, "appraisal_feedback"), {
      ...feedbackData,
      created_at: serverTimestamp(),
      submitted_at: new Date().toISOString(),
    });

    trackEvent("appraisal_feedback_submitted", {
      rating: feedbackData.rating || 5,
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    console.warn("Firebase Firestore feedback save warning:", error);
    return { success: true, fallback: true };
  }
};

export default app;
