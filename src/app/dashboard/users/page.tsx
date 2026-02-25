"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Search, UserPlus } from "lucide-react";
import { AxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { User } from "@/types/user";
import UserActionComponent from "@/components/user/action";
import { Paginate } from "@/components/common/Paginate";
import { authStore } from "@/stores/userStore";
import { getToken, RemoveToken } from "@/utils/Auth";
import { axiosInstance3 } from "@/utils/fetch";
import { getProfilePicture } from "@/utils/getImage";

export default function ManageUser() {
  const auth = authStore((state) => state.data);
  const fetchAuth = authStore((state) => state.fetch);
  const [users, setusers] = useState<User[]>([]);
  const [username, setusername] = useState<string>();
  const [email, setemail] = useState<string>();
  const [password, setpassword] = useState<string>();
  const [repassword, setrepassword] = useState<string>();
  const [modaluser, setmodaluser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const limit = 15;
  const [Offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        !search ||
        user.username.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole =
        roleFilter === "all" ||
        (roleFilter === "admin" && user.is_super_admin) ||
        (roleFilter === "user" && !user.is_super_admin);
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  useEffect(() => {
    fetchAuth();
    refetchUsers(Offset);
  }, [fetchAuth, Offset]);

  async function refetchUsers(fetchOffset: number = 0) {
    setIsLoading(true);
    try {
      const { data } = await axiosInstance3.get("/v1/users", {
        params: { limit: limit, offset: fetchOffset },
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const response = data as {
        success: boolean;
        data: User[];
        message?: string;
        meta?: {
          total_items: number;
          offset: number;
          limit: number;
          total_pages: number;
        };
      };
      if (response.success && Array.isArray(response.data)) {
        setusers(response.data);
        if (response.meta?.total_items) {
          setTotal(response.meta.total_items);
        }
      } else {
        toast.error("Cannot connecting with server");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          RemoveToken();
          window.location.href = "/login";
          return;
        }
        if (error.response?.status === 403) {
          window.location.href = "/forbidden";
          return;
        }
      }
      toast.error("Cannot connecting with server");
    } finally {
      setIsLoading(false);
    }
  }

  function changeOffset(newOffset: number) {
    if (newOffset >= 0 && newOffset < total) {
      setOffset(newOffset);
    }
  }

  const currentPage = Math.floor(Offset / limit) + 1;

  function showModaluser() {
    setmodaluser(true);
  }

  function closeModaluser() {
    setmodaluser(false);
  }

  async function submitHandler(e: React.FormEvent) {
    e.preventDefault();
    refetchUsers(Offset);
  }

  return (
    <div className="mx-auto p-8">
      <Card className="">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">User Management</CardTitle>
            <Dialog open={modaluser} onOpenChange={setmodaluser}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Add new user
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add new user</DialogTitle>
                  <DialogDescription>
                    Create a new account with username, email, and password.
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
                    <Label htmlFor="repassword">Confirm password</Label>
                    <Input
                      id="repassword"
                      type="password"
                      value={repassword}
                      onChange={(e) => setrepassword(e.target.value)}
                      placeholder="Confirm password"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={closeModaluser}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Create user</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All users</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>
              {isLoading
                ? "Loading..."
                : `Total ${total} user${total === 1 ? "" : "s"} found`}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead className="min-w-[200px]">User</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Last logged</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-muted-foreground">
                        <Skeleton className="h-4 w-6" />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                          <Skeleton className="h-4 w-[120px]" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[100px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[180px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-8 w-[80px] ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                : filteredUsers.length === 0
                  ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="h-24 text-center text-muted-foreground"
                      >
                        {users.length === 0
                          ? "No users yet."
                          : "No users match your search or filter."}
                      </TableCell>
                    </TableRow>
                    )
                  : filteredUsers.map((user, index) => (
                      <TableRow key={user.id}>
                        <TableCell className="text-muted-foreground tabular-nums">
                          {index + 1 + Offset}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 shrink-0">
                              <AvatarImage
                                src={getProfilePicture(user.image ?? "")}
                                alt={user.username}
                                className="object-cover"
                              />
                              <AvatarFallback className="bg-muted text-muted-foreground text-xs font-medium">
                                {user.username.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{user.first_name} {user.last_name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {user.username}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {user.email}
                        </TableCell>
                        <TableCell>
                          {user.is_super_admin ? (
                            <Badge
                              variant="default"
                              className="border-0 bg-emerald-600 text-white shadow-sm dark:bg-emerald-500"
                            >
                              Admin
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="border-amber-500/50 bg-amber-500/10 text-amber-800 dark:border-amber-400/50 dark:bg-amber-500/15 dark:text-amber-200"
                            >
                              User
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground whitespace-nowrap text-sm">
                          {format(user.created_at, "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell className="text-muted-foreground whitespace-nowrap text-sm">
                          {user.last_logged_at
                            ? format(user.last_logged_at, "MMM dd, yyyy HH:mm")
                            : "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          <UserActionComponent
                            user={user}
                            auth={undefined}
                            refetchUsers={refetchUsers}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
            </TableBody>
          </Table>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {Offset + 1} to{" "}
              {Math.min(Offset + limit, total)} of {total} users
            </div>
            <Paginate
              prev={() => changeOffset(Offset - limit)}
              next={() => changeOffset(Offset + limit)}
              goToPage={(page: number) => changeOffset(page * limit)}
              limit={limit}
              Offset={Offset}
              total={total}
              length={users.length}
              currentPage={currentPage - 1}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
