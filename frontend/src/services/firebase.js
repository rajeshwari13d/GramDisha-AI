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

import { submitSurvey } from "./api";

/**
 * Save Local Vendor Ground Survey Data.
 * Saves to both Cloud Firestore and Backend Ground Dataset,
 * with automatic fallback to localStorage.
 */
export const submitVendorSurvey = async (surveyData) => {
  let firestoreId = null;
  let backendId = null;

  // 1. Try Firebase Firestore
  try {
    const docRef = await addDoc(collection(db, "vendor_surveys"), {
      ...surveyData,
      submitted_at: new Date().toISOString(),
      created_at: serverTimestamp(),
      platform: "GramDisha-AI-Web",
      version: "SIH-2026",
    });
    firestoreId = docRef.id;

    trackEvent("vendor_survey_submitted", {
      business_type: surveyData.category || "unspecified",
      state: surveyData.state || "unspecified",
    });
  } catch (fbErr) {
    console.warn("Firestore survey direct write note (falling back to backend & offline):", fbErr?.message || fbErr);
  }

  // 2. Sync to Backend Dataset
  try {
    const res = await submitSurvey(surveyData);
    if (res.data?.success) {
      backendId = res.data.id;
    }
  } catch (apiErr) {
    console.debug("Backend survey sync note:", apiErr?.message || apiErr);
  }

  // 3. Local offline backup
  try {
    const existing = JSON.parse(localStorage.getItem("gramdisha_offline_surveys") || "[]");
    existing.push({
      ...surveyData,
      firestoreId,
      backendId,
      submitted_at: new Date().toISOString(),
    });
    localStorage.setItem("gramdisha_offline_surveys", JSON.stringify(existing));
  } catch (_) {}

  return {
    success: true,
    firestoreId,
    backendId,
  };
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

