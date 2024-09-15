import { authSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import $axios from "@/http";
import { toast } from "sonner";
import FillLoading from "../shared/fill-loading";
import { authStore } from "@/store/auth.store";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { setAuth } = useAuth();
  const { setUser, setIsAuth } = authStore();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: async (values: z.infer<typeof authSchema>) => {
      const { data } = await $axios.post("/auth/login", values);
      return data;
    },

    onSuccess: (data) => {
      setUser(data.user);
      setIsAuth(true);
      localStorage.setItem("accessToken", data.accessToken);
      toast.success("Login successfully!");
      navigate("/");
    },
    onError: (err) => {
      // @ts-ignore
      toast.error(err?.response?.data?.message);
    },
  });

  function onSubmit(values: z.infer<typeof authSchema>) {
    mutate(values);
  }

  return (
    <>
      {isPending && <FillLoading />}
      <h1 className="text-2xl font-bold">Login</h1>
      <p className="text-sm text-muted-foreground">
        Don't have an account?{" "}
        <span
          className="cursor-pointer text-blue-500 hover:underline"
          onClick={() => setAuth("register")}
        >
          Sign up
        </span>
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input placeholder="example@gmail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} placeholder="*****" />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <span
              className="text-sm text-blue-500 hover:underline cursor-pointer"
              onClick={() => setAuth("forgot-password")}
            >
              Forgot password?
            </span>
          </div>
          <Button type="submit" className="mt-3" size={"sm"}>
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
};

export default Login;
