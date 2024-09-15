import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { ModeToggle } from "../mode-toggle";
import CreatePost from "../create-post";
import { useCreatePost } from "@/hooks/use-create-post";
import { authStore } from "@/store/auth.store";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Avatar } from "../ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu";
import { Loader2 } from "lucide-react";
import $axios from "@/http";
import { IUser } from "@/interfaces";

const Navbar = () => {
  const { onOpen } = useCreatePost();
  const { isAuth, user, isLoading, setUser, setIsAuth } = authStore();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await $axios.post("/auth/logout");
      setIsAuth(false);
      setUser({} as IUser);
      localStorage.removeItem("accessToken");
      navigate("/");
    } catch (error) {
      // @ts-ignore
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <>
      <div className="w-full h-24 bg-slate-900 fixed inset-0">
        <div className="w-full h-full flex justify-between items-center container mx-auto">
          <Link to="/" className="flex items-center justify-center gap-2 ml-2">
            <img src="/logo.jpg" alt="logo" className="w-16 h-16 rounded-2xl" />
            <p className="font-bold text-3xl text-white">Backend</p>
          </Link>
          <div className="flex gap-2 items-center">
            <div>
              <ModeToggle />
            </div>
            {isAuth && (
              <Button
                className="rounded-full font-bold"
                size={"lg"}
                variant={"outline"}
                onClick={onOpen}
              >
                Create Post
              </Button>
            )}
            {isAuth ? (
              isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem className="text-red-700">
                      {user.isActivated ? "Activated" : "Not Activated"}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="line-clamp-1">
                      {user.email}
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )
            ) : (
              <Link to="/auth">
                <Button size={"lg"} className="rounded-full font-bold">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
      <CreatePost />
    </>
  );
};

export default Navbar;
