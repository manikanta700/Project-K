import { useState, useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";

const Login = () => {
  const [currentState, setCurrentState] = useState("Sign Up");
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (currentState === "Sign Up") {
        const response = await axios.post(backendUrl + "/api/user/register", {
          name,
          email,
          password,
        });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
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
          <h1 className="prata-regular text-2xl text-gray-900">
            {currentState === "Login" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {currentState === "Login"
              ? "Sign in to your PureNature account"
              : "Join our natural living community"}
          </p>
        </div>

        <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">
          {currentState !== "Login" && (
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#2d7a4f] transition-colors bg-gray-50 focus:bg-white"
              placeholder="Your full name"
              required
            />
          )}

          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#2d7a4f] transition-colors bg-gray-50 focus:bg-white"
            placeholder="Email address"
            required
          />

          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#2d7a4f] transition-colors bg-gray-50 focus:bg-white"
            placeholder="Password"
            required
          />

          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span className="cursor-pointer hover:text-[#2d7a4f] transition-colors">
              Forgot password?
            </span>
            {currentState === "Login" ? (
              <span
                onClick={() => setCurrentState("Sign Up")}
                className="cursor-pointer text-[#2d7a4f] font-medium hover:underline"
              >
                Create account →
              </span>
            ) : (
              <span
                onClick={() => setCurrentState("Login")}
                className="cursor-pointer text-[#2d7a4f] font-medium hover:underline"
              >
                Login here →
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2d7a4f] text-white font-semibold py-3 rounded-xl hover:bg-[#235f3d] active:scale-95 transition-all disabled:opacity-70 flex items-center justify-center gap-2 mt-2 text-sm"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" color="white" />
                <span>Please wait…</span>
              </>
            ) : currentState === "Login" ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
