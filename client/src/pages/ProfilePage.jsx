import React from "react";
import { useState, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";
import ReactWebcam from "react-webcam";

export default function ProfilePage() {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const webcamRef = useRef(null);

  console.log("authUser", authUser);

  const captureFromWebcam = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setShowCamera(false);
    setSelectedImg(imageSrc);
    console.log("Captured Image:", imageSrc);
    if (!imageSrc) return;
    authUser.profilePic = imageSrc; // Update authUser with the new image
    await updateProfile({ authUser });
  };

  const handleImageUpload = async (file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      console.log("upload Image:", base64Image);
      if (!base64Image) return;
      authUser.profilePic = base64Image; // Update authUser with the new image
      await updateProfile({ authUser });
    };
  };

  return (
    <div className=" pt-20 bg-gradient-to-r ">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* avatar upload section */}

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              {/* Profile Image */}
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4"
              />

              {/* Camera Icon - toggles options */}
              <button
                type="button"
                onClick={() => setShowOptions((prev) => !prev)}
                className={`absolute bottom-0 right-0 p-2 rounded-full bg-base-content cursor-pointer hover:scale-105 transition-all duration-200 ${
                  isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                }`}
              >
                <Camera className="w-5 h-5 text-base-200" />
              </button>
              {showCamera && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                  <div className="bg-white p-4 rounded-md">
                    <ReactWebcam
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      width={300}
                    />
                    <div className="flex justify-between mt-4">
                      <button
                        onClick={captureFromWebcam}
                        className="btn btn-success"
                      >
                        Capture
                      </button>
                      <button
                        onClick={() => setShowCamera(false)}
                        className="btn btn-error"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Dropdown Options */}
              {showOptions && (
                <div className="absolute bottom-14 right-0 bg-base-100 border shadow-md rounded-lg z-50">
                  <button
                    type="button"
                    className="w-full px-4 py-2 hover:bg-base-200 text-left"
                    onClick={() => {
                      setShowOptions(false);
                      setShowCamera(true);
                    }}
                  >
                    📷 Take a Photo
                  </button>
                  <button
                    type="button"
                    className="w-full px-4 py-2 hover:bg-base-200 text-left"
                    onClick={() => {
                      setShowOptions(false);
                      document.getElementById("file-picker").click();
                    }}
                  >
                    📁 Choose from Gallery
                  </button>
                </div>
              )}

              {/* Hidden Inputs */}
              <input
                type="file"
                id="file-picker"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files[0])}
                disabled={isUpdatingProfile}
              />
            </div>

            <p className="text-sm text-zinc-400">
              {isUpdatingProfile
                ? "Uploading..."
                : "Click the camera icon to update your photo"}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.name}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.email}
              </p>
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
