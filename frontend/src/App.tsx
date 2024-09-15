import { Route, Routes } from "react-router-dom";
import Home from "@/pages/home";
import Auth from "@/pages/auth";
import Navbar from "@/components/shared/navbar";
import { authStore } from "./store/auth.store";
import $axios from "./http";
import { useEffect } from "react";
import { toast } from "sonner";
import RecoveryAccount from "./pages/recovery-account";

const App = () => {
  const { setLoading, setUser, setIsAuth } = authStore();
  const checkAuth = async () => {
    setLoading(true);
    try {
      const { data } = await $axios.get("/auth/refresh");
      localStorage.setItem("accessToken", data.accessToken);
      setUser(data.user);
      setIsAuth(true);
    } catch (error) {
      // @ts-ignore
      toast.error(error?.response?.data?.message);
      localStorage.removeItem("accessToken");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      checkAuth();
    }
  }, []);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/recovery-account/:token" element={<RecoveryAccount />} />
      </Routes>
    </>
  );
};

export default App;
