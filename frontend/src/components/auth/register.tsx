import { useAuth } from "@/hooks/use-auth";
import { authSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import $axios from "@/http";
import { log } from "console";
import { authStore } from "@/store/auth.store";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import FillLoading from "../shared/fill-loading";

const Register = () => {
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
    mutationKey: ["register"],
    mutationFn: async (values: z.infer<typeof authSchema>) => {
      const { data } = await $axios.post("/auth/register", values);
      return data;
    },
    onSuccess: (data) => {
      setIsAuth(true);
      setUser(data.user);
      localStorage.setItem("accessToken", data.accessToken);
      toast.success("Register successfully!");
      navigate("/");
    },
    onError: (err) => {
      // @ts-ignore
      toast.error(err?.response?.data?.message);
    },
  });

  const onSubmit = (values: z.infer<typeof authSchema>) => {
    mutate(values);
  };

  return (
    <>
      {isPending && <FillLoading />}
      <h1 className="text-2xl font-bold">Register</h1>
      <p className="text-sm text-muted-foreground">
        Already have an account?{" "}
        <span
          className="cursor-pointer text-blue-500 hover:underline"
          onClick={() => setAuth("login")}
        >
          Sign in
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
                <Input
                  {...field}
                  type="email"
                  placeholder="example@gmail.com"
                />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <Input {...field} type="password" placeholder="*****" />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <span
              className="text-blue-500 cursor-pointer text-sm"
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

export default Register;
