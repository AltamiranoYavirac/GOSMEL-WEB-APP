"use client";

import Lottie from "lottie-react";

import animationData from "./construccion.json";

export default function ComingSoonAnimation() {
  return <Lottie animationData={animationData} loop className="w-full h-auto" />;
}
