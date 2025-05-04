"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

type ProfileFormProps = {
  userId: string;
};

export default function ProfileForm({ userId }: ProfileFormProps) {
  const supabase = createClient();
  
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    phoneNumber: "",
    birthYear: new Date().getFullYear().toString(),
    birthMonth: "1",
    birthDay: "1",
    marketingConsent: false,  // New state for marketing concern
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  // Fetch user details on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      const { data, error } = await supabase
        .from("user_details")
        .select("*")
        .eq("ref_id", userId)
        .single();
      
      if (error) {
        console.error("Error fetching user data:", error);
        return;
      }

      if (data) {
        // Set form values if user data exists
        setFormData({
          fullName: data.full_name || "",
          gender: data.gender || "",
          phoneNumber: data.phone_number || "",
          birthYear: data.date_of_birth ? new Date(data.date_of_birth).getFullYear().toString() : new Date().getFullYear().toString(),
          birthMonth: data.date_of_birth ? (new Date(data.date_of_birth).getMonth() + 1).toString() : "1",
          birthDay: data.date_of_birth ? new Date(data.date_of_birth).getDate().toString() : "1",
          marketingConsent: data.marketing_concern || false,  // Populate marketing concern
        });
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGenderSelect = (gender: string) => {
    setFormData({
      ...formData,
      gender,
    });
  };

  const handleMarketingConsentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      marketingConsent: e.target.checked,  // Update the marketing concern state
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");
  
    try {
      // Format the date of birth
      const dob = `${formData.birthYear}-${formData.birthMonth.padStart(2, '0')}-${formData.birthDay.padStart(2, '0')}`;
      
      // Check if the user already exists
      const { data: existingUser, error: userError } = await supabase
        .from('user_details')
        .select('ref_id')
        .eq('ref_id', userId)
        .single();
  
      if (userError) {
        throw userError;
      }
  
      // If the user already exists, update the record
      if (existingUser) {
        const { error } = await supabase
          .from('user_details')
          .update({
            full_name: formData.fullName,
            gender: formData.gender,
            phone_number: formData.phoneNumber,
            date_of_birth: dob,
            marketing_concern: formData.marketingConsent,
          })
          .eq('ref_id', userId);
  
        if (error) {
          throw error;
        }
  
        setSubmitMessage("Profile updated successfully!");
      } else {
        // If no user exists, insert a new record
        const { error } = await supabase
          .from('user_details')
          .insert({
            user_id: userId,
            full_name: formData.fullName,
            gender: formData.gender,
            phone_number: formData.phoneNumber,
            date_of_birth: dob,
            marketing_concern: formData.marketingConsent,
          });
  
        if (error) {
          throw error;
        }
  
        setSubmitMessage("Profile created successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setSubmitMessage("Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">

      <form onSubmit={handleSubmit} className="px-6 py-4">
        <h2 className="text-xl font-semibold text-start flex-1 pr-10 pb-8 pt-6">Update Profile</h2>

        <div className="mb-4">
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => handleGenderSelect("male")}
              className={`px-6 py-2 border rounded-md ${
                formData.gender === "male" ? "bg-blue-100 border-blue-500" : "border-gray-300"
              }`}
            >
              Man
            </button>
            <button
              type="button"
              onClick={() => handleGenderSelect("female")}
              className={`px-6 py-2 border rounded-md ${
                formData.gender === "female" ? "bg-blue-100 border-blue-500" : "border-gray-300"
              }`}
            >
              Woman
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              name="birthYear"
              value={formData.birthYear}
              onChange={handleChange}
              placeholder="YYYY"
              className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="birthMonth"
              value={formData.birthMonth}
              onChange={handleChange}
              placeholder="MM"
              className="w-16 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="birthDay"
              value={formData.birthDay}
              onChange={handleChange}
              placeholder="DD"
              className="w-16 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Marketing Consent Checkbox */}
        <div className="mb-4">
          <label className="inline-flex items-center text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              name="marketingConsent"
              checked={formData.marketingConsent}
              onChange={handleMarketingConsentChange}
              className="form-checkbox"
            />
            <span className="ml-2">I agree to receive marketing communications</span>
          </label>
        </div>

        {submitMessage && (
          <div className={`p-3 mb-4 rounded-md ${submitMessage.includes("success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {submitMessage}
          </div>
        )}

        <div className="mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}