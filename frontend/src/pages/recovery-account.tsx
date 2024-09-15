import FillLoading from "@/components/shared/fill-loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import $axios from "@/http";
import { passwordSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const RecoveryAccount = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["recovery-account"],
    mutationFn: async (values: z.infer<typeof passwordSchema>) => {
      const obj = { token, password: values.password };
      const { data } = await $axios.put(`/auth/recovery-account`, obj);
      return data;
    },
    onSuccess: () => {
      toast.success("Successfully recovered, log in account!");
      navigate("/auth");
    },
    onError: (err) => {
      // @ts-ignore
      toast.error(err?.response?.data?.message);
    },
  });

  const onSubmit = (values: z.infer<typeof passwordSchema>) => {
    mutate(values);
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      {isPending && <FillLoading />}
      <Card className="w-1/3 p-3 relative">
        <CardContent>
          <h1 className="text-2xl font-bold">Recovery account</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <Input {...field} type="password" placeholder="*****" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <Input {...field} type="password" placeholder="*****" />
                  </FormItem>
                )}
              />
              <Button className="mt-3" type="submit">
                Send
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecoveryAccount;
