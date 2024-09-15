import PostCard from "@/components/cards/post.card";
import ConfirmModal from "@/components/modals/confirm.modal";
import PostLoading from "@/components/shared/post.loading";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import $axios from "@/http";
import { IPost } from "@/interfaces";
import { postStore } from "@/store/post.store";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";

const Home = () => {
  const { setPosts, posts } = postStore();
  const { isLoading, error } = useQuery({
    queryKey: ["get-posts"],
    queryFn: async () => {
      const { data } = await $axios.get("post/get");
      setPosts(data);
      return data;
    },
  });

  return (
    <>
      <div className="container xl:max-w-7xl mx-auto mt-28">
        {error && (
          <Alert variant="destructive" className="w-full">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}
        <div className="grid  sm:grid-cols-3 xxs:grid-cols-2 grid-cols-1 gap-4">
          {isLoading &&
            Array.from({ length: 6 }).map((_, idx) => (
              <PostLoading key={idx} />
            ))}
          {posts.map((post: IPost) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </div>
      <ConfirmModal />
    </>
  );
};

export default Home;
