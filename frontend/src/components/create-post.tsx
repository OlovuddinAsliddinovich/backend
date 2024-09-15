import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCreatePost } from "@/hooks/use-create-post";
import { postSchema } from "@/lib/validation";
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
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { ChangeEvent, useState } from "react";
import { toast } from "sonner";
import { postStore } from "@/store/post.store";
import $api from "@/http/api";
import { styleText } from "util";

const CreatePost = () => {
  const [loading, setLoading] = useState(false);
  const { isOpen, onClose } = useCreatePost();
  const [picture, setPicture] = useState<File | null>(null);

  const { posts, setPosts } = postStore();

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      body: "",
    },
  });

  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files && event.target.files[0];
    setPicture(file);
  }

  async function onSubmit(values: z.infer<typeof postSchema>) {
    setLoading(true);
    if (!picture) return null;

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("body", values.body);
    formData.append("picture", picture);

    try {
      const res = await $api.post("/post/create", formData);
      const newPost = [...posts, res.data];
      setPosts(newPost);
      form.reset();
      onClose();
    } catch (error) {
      console.log(error);
      // @ts-ignore
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Crete a post</SheetTitle>
          <SheetDescription>Write that is in your mind</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Create a blog post"
                      className="bg-secondary"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Body</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="In this article you can improve your skills"
                      className="bg-secondary min-h-32"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <Label htmlFor="picture">Picture</Label>
              <Input
                disabled={loading}
                className="bg-secondary"
                id="picture"
                type="file"
                onChange={onFileChange}
              />
            </div>
            <Button type="submit" disabled={loading}>
              Submit
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default CreatePost;
