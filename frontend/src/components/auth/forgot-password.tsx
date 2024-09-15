import { useAuth } from "@/hooks/use-auth";
import { emailSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { boolean, z } from "zod";
import { Form, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import $axios from "@/http";
import { useNavigate } from "react-router-dom";
import FillLoading from "../shared/fill-loading";
import { useState } from "react";

const ForgotPassword = () => {
  const { setAuth } = useAuth();
  const [onSuccess, setOnSuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["forgot-password"],
    mutationFn: async (values: z.infer<typeof emailSchema>) => {
      const { data } = await $axios.post("/auth/forgot-password", values);
      console.log(data);
      return data;
    },
    onSuccess: () => {
      setOnSuccess(true);
    },
    onError: (err) => {
      // @ts-ignore
      toast.error(err?.response?.data?.message);
    },
  });

  const onSubmit = (values: z.infer<typeof emailSchema>) => {
    mutate(values);
  };

  if (onSuccess) {
    return (
      <>
        <h1 className="text-2xl font-bold">Success</h1>
        <p className="text-sm text-muted-foreground">
          Please check your email addres
        </p>
      </>
    );
  }

  return (
    <>
      {isPending && <FillLoading />}
      <h1 className="text-2xl font-bold">Forgot password</h1>
      <p className="text-sm text-muted-foreground">
        Don't have an account?{" "}
        <span
          className="text-blue-500 hover:underline cursor-pointer"
          onClick={() => setAuth("register")}
        >
          Sign up
        </span>
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name={"email"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email address</FormLabel>
                <Input
                  placeholder="example@gmail.com"
                  type="email"
                  {...field}
                />
              </FormItem>
            )}
          />
          <Button className="mt-3" size={"sm"}>
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
};

export default ForgotPassword;
