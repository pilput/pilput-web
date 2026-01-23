"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { UserPlus } from "lucide-react";
import { getAuth, getToken, RemoveToken } from "@/utils/Auth";
import { axiosInstance3 } from "@/utils/fetch";
import { getProfilePicture } from "@/utils/getImage";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { User } from "@/types/user";
import UserActionComponent from "@/components/user/action";

export default function ManageUser() {
  const [users, setusers] = useState<User[]>([]);
  const [username, setusername] = useState<string>();
  const [email, setemail] = useState<string>();
  const [password, setpassword] = useState<string>();
  const [repassword, setrepassword] = useState<string>();
  const [modaluser, setmodaluser] = useState(false);
  const [auth, setauth] = useState<User>();
  const [isLoading, setIsLoading] = useState(false);

  async function localGetAuth() {
    const auth = await getAuth();
    setauth(auth);
  }

  useEffect(() => {
    refetchUsers();
    localGetAuth();
  }, []);

  async function refetchUsers() {
    setIsLoading(true);
    try {
      const { data } = await axiosInstance3.get("/v1/users", {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const response = data as {
        data: User[];
        success: boolean;
        metadata: { totalItems: number };
      };
      if (response.success) {
        setusers(response.data);
      } else {
        toast.error("Cannot connecting with server");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          RemoveToken();
          window.location.href = "/login";
        }
      }
      toast.error("Cannot connecting with server");
    } finally {
      setIsLoading(false);
    }
  }


  function showModaluser() {
    setmodaluser(true);
  }

  function closeModaluser() {
    setmodaluser(false);
  }

  async function submitHandler(e: React.FormEvent) {
    e.preventDefault();
    refetchUsers();
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">User Management</h1>
        {auth?.is_super_admin && (
          <Dialog open={modaluser} onOpenChange={setmodaluser}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow">
                <UserPlus className="w-4 h-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Create a new user account with the following details.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={submitHandler} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setusername(e.target.value)}
                    placeholder="Enter username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setemail(e.target.value)}
                    placeholder="Enter email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setpassword(e.target.value)}
                    placeholder="Enter password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="repassword">Confirm Password</Label>
                  <Input
                    id="repassword"
                    type="password"
                    value={repassword}
                    onChange={(e) => setrepassword(e.target.value)}
                    placeholder="Confirm password"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" type="button" onClick={closeModaluser}>
                    Cancel
                  </Button>
                  <Button type="submit">Create User</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="rounded-lg border bg-card shadow-sm dark:shadow-gray-900/30">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/60">
              <TableHead className="font-semibold">User</TableHead>
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="font-semibold">Role</TableHead>
              <TableHead className="w-[100px] font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <Skeleton className="h-4 w-[150px]" />
                    </div>
                  </TableCell>
                  <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-[80px]" /></TableCell>
                </TableRow>
              ))
            ) : (
              users.map((user) => (
                <TableRow key={user.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="ring-2 ring-background">
                        <AvatarImage
                          src={getProfilePicture(user.username)}
                          alt={user.username}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {user.username.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{user.username}</p>
                        <p className="text-sm text-muted-foreground">
                          Joined {new Date(user.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">{user.email}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium shadow-sm ${
                      user.is_super_admin
                        ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                        : "bg-muted text-muted-foreground ring-1 ring-muted-foreground/20"
                    }`}>
                      {user.is_super_admin ? "Admin" : "User"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <UserActionComponent user={user} auth={auth} refetchUsers={refetchUsers} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
