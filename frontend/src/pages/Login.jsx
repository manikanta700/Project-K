import { useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post(backendUrl + "/api/user/google", {
        credential: credentialResponse.credential,
      });
      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        toast.success("Welcome! Signed in with Google.");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Google Sign-In failed. Please try again.");
    }
  };

  const handleGoogleError = () => {
    toast.error("Google Sign-In was cancelled or failed.");
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  });

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-[#e8f5ee] to-[#faf8f4] px-4 py-12">
      <div className="card p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#e8f5ee] rounded-2xl mb-4 text-2xl">
            🌿
          </div>
          <h1 className="prata-regular text-2xl text-gray-900">Welcome to PureNature</h1>
          <p className="text-gray-400 text-sm mt-1">
            Sign in to continue to your account
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 uppercase tracking-wide">Sign in with</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Google Sign-In Button */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            size="large"
            shape="pill"
            text="signin_with"
            theme="outline"
            logo_alignment="left"
            width="320"
          />
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          By signing in, you agree to our{" "}
          <span className="text-[#2d7a4f] cursor-pointer hover:underline">Terms of Service</span>{" "}
          and{" "}
          <span className="text-[#2d7a4f] cursor-pointer hover:underline">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
};

export default Login;
