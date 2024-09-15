import { IPost } from "@/interfaces";
import { Card, CardContent, CardFooter, CardTitle } from "../ui/card";
import { API_URL } from "@/http";
import { Button } from "../ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { postSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Popover, PopoverContent } from "../ui/popover";
import { useState } from "react";
import { PopoverTrigger } from "@radix-ui/react-popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { postStore } from "@/store/post.store";
import { toast } from "sonner";
import FillLoading from "../shared/fill-loading";
import $api from "@/http/api";

const PostCard = ({ post }: { post: IPost }) => {
  const { onOpen, setPost } = useConfirm();
  const [isOpen, setIsOpen] = useState(false);
  const { posts, setPosts } = postStore();

  const onDelete = () => {
    onOpen();
    setPost(post);
  };

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post.title,
      body: post.body,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["edit-post"],
    mutationFn: async (values: z.infer<typeof postSchema>) => {
      const { data } = await $api.put(`/post/edit/${post._id}`, values);
      return data;
    },
    onSuccess: (data) => {
      const newData = posts.map((post) =>
        post._id === data._id ? data : post
      );
      setPosts(newData);
      setIsOpen(false);
    },

    onError: (err) => {
      console.log(err);
      //@ts-ignore
      toast(err?.response?.data?.message);
    },
  });

  function onSubmit(values: z.infer<typeof postSchema>) {
    mutate(values);
  }

  return (
    <Card>
      <img
        src={`${API_URL}/${post.picture}`}
        alt={post.title}
        className="rounded-t-md w-full h-[250px]"
      />
      <CardContent className="mt-4">
        <CardTitle className="line-clamp-1 text-xl">{post.title}</CardTitle>
        <p className="line-clamp-2 mt-1 text-muted-foreground">{post.body}</p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button className="w-full" variant={"destructive"} onClick={onDelete}>
          Delete
        </Button>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button className="w-full" onClick={() => setIsOpen(true)}>
              Edit
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96">
            <Form {...form}>
              {isPending && <FillLoading />}
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
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
                          disabled={isPending}
                          placeholder="In this article you can improve your skills"
                          className="bg-secondary "
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isPending}>
                  Submit
                </Button>
              </form>
            </Form>
          </PopoverContent>
        </Popover>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
