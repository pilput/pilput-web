"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Search, UserPlus, Users, ShieldAlert, ArrowUpDown, ArrowUp, ArrowDown, UserSearch } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { User } from "@/types/user";
import UserActionComponent from "@/components/user/action";
import { Paginate } from "@/components/common/Paginate";
import { EmptyState } from "@/components/common/EmptyState";
import { authStore } from "@/stores/userStore";
import { clearTokens, getToken, RemoveToken } from "@/utils/Auth";
import { apiClient, isHttpError } from "@/utils/fetch";
import { getProfilePicture } from "@/utils/getImage";
import { addUserSchema, type AddUserFormData } from "@/lib/validation";
import { parseBlogPageQueryParam } from "@/lib/blog-feed-data";
import { Suspense } from "react";

function SortHeader({
  column,
  label,
  orderBy,
  orderDirection,
  onToggle,
}: {
  column: string;
  label: string;
  orderBy: string;
  orderDirection: string;
  onToggle: (column: string) => void;
}) {
  const active = orderBy === column;
  return (
    <button
      type="button"
      onClick={() => onToggle(column)}
      className="inline-flex items-center gap-1 font-medium hover:text-foreground transition-colors"
      aria-label={`Sort by ${label} ${active && orderDirection === "desc" ? "ascending" : "descending"}`}
    >
      {label}
      {active ? (
        orderDirection === "desc" ? (
          <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
        ) : (
          <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
        )
      ) : (
        <ArrowUpDown className="h-3.5 w-3.5 opacity-40" aria-hidden="true" />
      )}
    </button>
  );
}

export default function ManageUserPage() {
  return (
    <Suspense fallback={<div className="w-full animate-pulse" />}>
      <ManageUserContent />
    </Suspense>
  );
}

function ManageUserContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const skipUrlSyncFromRouter = useRef(false);
  const auth = authStore((state) => state.data);
  const fetchAuth = authStore((state) => state.fetch);
  const [users, setusers] = useState<User[]>([]);
  const [modaluser, setmodaluser] = useState(false);
  const [showRevokeAllDialog, setShowRevokeAllDialog] = useState(false);
  const [revokeAllConfirmation, setRevokeAllConfirmation] = useState("");
  const [isRevokingAll, setIsRevokingAll] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const addUserForm = useForm<AddUserFormData>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      first_name: "",
      last_name: "",
    },
  });
  const [search, setSearch] = useState(() => searchParams.get("q") ?? "");
  const [roleFilter, setRoleFilter] = useState<string>(() => {
    const v = searchParams.get("role");
    return v === "admin" || v === "user" ? v : "all";
  });
  const [deletedFilter, setDeletedFilter] = useState<string>(() => {
    const v = searchParams.get("status");
    return v === "true" || v === "all" ? v : "false";
  });
  // Single sort key "column:direction" so the UI reads as one clear choice
  // (e.g. "Last active") instead of two separate dropdowns.
  const [sortKey, setSortKey] = useState<string>(() => searchParams.get("sort") ?? "last_logged_at:desc");
  const [orderBy, orderDirection] = useMemo(() => {
    const [col, dir] = sortKey.split(":");
    return [col ?? "created_at", dir === "asc" ? "asc" : "desc"];
  }, [sortKey]);
  const limit = 15;
  const [offset, setOffset] = useState(
    () => parseBlogPageQueryParam(searchParams.get("page")) * limit
  );
  const [total, setTotal] = useState(0);
  const currentPageIndex = Math.floor(offset / limit);

  const replaceUsersQuery = useCallback(
    (pageIndex: number, q: string, role: string, statusFilter: string, sort: string) => {
      const params = new URLSearchParams();
      if (pageIndex > 0) params.set("page", String(pageIndex + 1));
      const dq = q.trim();
      if (dq) params.set("q", dq);
      if (role !== "all") params.set("role", role);
      if (statusFilter !== "false") params.set("status", statusFilter);
      if (sort !== "last_logged_at:desc") params.set("sort", sort);
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router]
  );

  useLayoutEffect(() => {
    if (skipUrlSyncFromRouter.current) {
      skipUrlSyncFromRouter.current = false;
      return;
    }
    setOffset(parseBlogPageQueryParam(searchParams.get("page")) * limit);
    setSearch(searchParams.get("q") ?? "");
    const role = searchParams.get("role");
    setRoleFilter(role === "admin" || role === "user" ? role : "all");
    const st = searchParams.get("status");
    setDeletedFilter(st === "true" || st === "all" ? st : "false");
    setSortKey(searchParams.get("sort") ?? "last_logged_at:desc");
  }, [searchParams, limit]);

  useEffect(() => {
    const urlPage = parseBlogPageQueryParam(searchParams.get("page"));
    const urlQ = (searchParams.get("q") ?? "").trim();
    const urlRoleRaw = searchParams.get("role");
    const urlRole = urlRoleRaw === "admin" || urlRoleRaw === "user" ? urlRoleRaw : "all";
    const urlStatusRaw = searchParams.get("status");
    const urlStatus = urlStatusRaw === "true" || urlStatusRaw === "all" ? urlStatusRaw : "false";
    const urlSort = searchParams.get("sort") ?? "last_logged_at:desc";
    const sq = search.trim();
    if (
      urlPage === currentPageIndex &&
      urlQ === sq &&
      urlRole === roleFilter &&
      urlStatus === deletedFilter &&
      urlSort === sortKey
    )
      return;
    skipUrlSyncFromRouter.current = true;
    replaceUsersQuery(currentPageIndex, search, roleFilter, deletedFilter, sortKey);
  }, [currentPageIndex, search, roleFilter, deletedFilter, sortKey, replaceUsersQuery, searchParams]);

  const getPageHref = useCallback(
    (pageIndex: number) => {
      const params = new URLSearchParams();
      if (pageIndex > 0) params.set("page", String(pageIndex + 1));
      const sq = search.trim();
      if (sq) params.set("q", sq);
      if (roleFilter !== "all") params.set("role", roleFilter);
      if (deletedFilter !== "false") params.set("status", deletedFilter);
      if (sortKey !== "last_logged_at:desc") params.set("sort", sortKey);
      const qs = params.toString();
      return qs ? `?${qs}` : pathname;
    },
    [search, roleFilter, deletedFilter, sortKey, pathname]
  );

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setOffset(0);
  }, []);

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

  const handleAuthError = useCallback((error: unknown): boolean => {
    if (isHttpError(error)) {
      if (error.response?.status === 401) {
        RemoveToken();
        router.push("/login");
        return true;
      }
      if (error.response?.status === 403) {
        router.push("/forbidden");
        return true;
      }
    }
    return false;
  }, [router]);

  const refetchUsers = useCallback(
    async (fetchOffset: number = 0) => {
      setIsLoading(true);
      try {
        const { data } = await apiClient.get("/api/users", {
          params: {
            limit: limit,
            offset: fetchOffset,
            deleted: deletedFilter,
            order_by: orderBy,
            order_direction: orderDirection,
            orderBy,
            orderDirection,
          },
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
          toast.error("Cannot connect to server");
        }
      } catch (error) {
        if (handleAuthError(error)) return;
        toast.error("Cannot connect to server");
      } finally {
        setIsLoading(false);
      }
    },
    [limit, deletedFilter, orderBy, orderDirection, handleAuthError]
  );

  useEffect(() => {
    fetchAuth();
    let ignore = false;

    async function loadUsers() {
      try {
        const { data } = await apiClient.get("/api/users", {
          params: {
            limit,
            offset,
            deleted: deletedFilter,
            order_by: orderBy,
            order_direction: orderDirection,
            orderBy,
            orderDirection,
          },
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
        if (ignore) return;
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
          toast.error("Cannot connect to server");
        }
      } catch (error) {
        if (!ignore) {
          if (!handleAuthError(error)) {
            toast.error("Cannot connect to server");
          }
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadUsers();

    return () => {
      ignore = true;
    };
  }, [fetchAuth, offset, deletedFilter, limit, orderBy, orderDirection, handleAuthError]);

  function changeOffset(newOffset: number) {
    if (newOffset >= 0 && newOffset < total) {
      setIsLoading(true);
      setOffset(newOffset);
    }
  }

  function toggleSort(column: string) {
    setSortKey((prev) => {
      const [col, dir] = prev.split(":");
      const nextDir = col === column && dir === "desc" ? "asc" : "desc";
      return `${column}:${nextDir}`;
    });
    setOffset(0);
  }

  const currentPage = Math.floor(offset / limit) + 1;

  function closeModaluser() {
    setmodaluser(false);
    addUserForm.reset();
  }

  async function submitAddUser(data: AddUserFormData) {
    setIsCreating(true);
    const toastId = toast.loading("Creating user...");
    try {
      const response = await apiClient.post(
        "/api/users",
        {
          username: data.username,
          email: data.email,
          password: data.password,
          first_name: data.first_name,
          last_name: data.last_name,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      const result = response.data as { success?: boolean; message?: string };
      if (result.success !== false) {
        toast.success("User created successfully", { id: toastId });
        closeModaluser();
        refetchUsers(offset);
      } else {
        toast.error(result.message ?? "Failed to create user", { id: toastId });
      }
    } catch (error) {
      if (handleAuthError(error)) return;
      if (isHttpError(error)) {
        const msg =
          (error.response?.data as { message?: string })?.message ??
          "Failed to create user";
        toast.error(msg, { id: toastId });
      } else {
        toast.error("Failed to create user", { id: toastId });
      }
    } finally {
      setIsCreating(false);
    }
  }

  const REVOKE_ALL_PHRASE = "REVOKE ALL";

  const onRevokeAllSessions = async () => {
    setIsRevokingAll(true);
    const toastid = toast.loading("Revoking every session...");
    try {
      const { data } = await apiClient.post<{
        data?: { revoked_sessions?: number };
      }>(
        "/api/auth/sessions/revoke-all",
        { confirm: true },
        { headers: { Authorization: `Bearer ${getToken()}` } },
      );

      const count = data?.data?.revoked_sessions ?? 0;
      toast.success(`${count} sessions revoked across all users`, {
        id: toastid,
      });

      // This revoked our own refresh token too, so there is no session left to
      // keep this page on.
      clearTokens();
      router.push("/login");
    } catch (error) {
      if (isHttpError(error)) {
        const msg =
          (error.response?.data as { message?: string })?.message ??
          "Failed to revoke sessions";
        toast.error(msg, { id: toastid });
      } else {
        toast.error("Failed to revoke sessions", { id: toastid });
      }
      setIsRevokingAll(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
            User Management
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage system users, administrators, and permissions.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            className="flex items-center gap-2 w-full sm:w-auto font-semibold shrink-0 text-destructive border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
            onClick={() => {
              setRevokeAllConfirmation("");
              setShowRevokeAllDialog(true);
            }}
          >
            <ShieldAlert className="h-4 w-4" />
            Revoke all sessions
          </Button>
          <Dialog open={modaluser} onOpenChange={setmodaluser}>
            <DialogTrigger
              render={
                <Button className="flex items-center gap-2 w-full sm:w-auto font-semibold shrink-0" />
              }
            >
              <UserPlus className="h-4 w-4" />
              Add new user
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add new user</DialogTitle>
                <DialogDescription>
                  Create a new account with username, email, and password.
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={addUserForm.handleSubmit(submitAddUser)}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First name</Label>
                    <Input
                      id="first_name"
                      {...addUserForm.register("first_name")}
                      placeholder="First name"
                    />
                    {addUserForm.formState.errors.first_name && (
                      <p className="text-sm text-destructive">
                        {addUserForm.formState.errors.first_name.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last name</Label>
                    <Input
                      id="last_name"
                      {...addUserForm.register("last_name")}
                      placeholder="Last name"
                    />
                    {addUserForm.formState.errors.last_name && (
                      <p className="text-sm text-destructive">
                        {addUserForm.formState.errors.last_name.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    {...addUserForm.register("username")}
                    placeholder="Enter username"
                  />
                  {addUserForm.formState.errors.username && (
                    <p className="text-sm text-destructive">
                      {addUserForm.formState.errors.username.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...addUserForm.register("email")}
                    placeholder="Enter email"
                  />
                  {addUserForm.formState.errors.email && (
                    <p className="text-sm text-destructive">
                      {addUserForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    {...addUserForm.register("password")}
                    placeholder="Enter password"
                  />
                  {addUserForm.formState.errors.password && (
                    <p className="text-sm text-destructive">
                      {addUserForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...addUserForm.register("confirmPassword")}
                    placeholder="Confirm password"
                  />
                  {addUserForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-destructive">
                      {addUserForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={closeModaluser}
                    disabled={isCreating}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isCreating}>
                    {isCreating ? "Creating..." : "Create user"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Revoke All Sessions Confirmation Dialog */}
      <Dialog open={showRevokeAllDialog} onOpenChange={setShowRevokeAllDialog}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <ShieldAlert className="h-5 w-5" />
              Revoke Every Session
            </DialogTitle>
            <DialogDescription>
              This signs out every user on the platform — including you. Use it
              when a token leak is suspected but you do not know how far it
              spread.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-xs text-muted-foreground">
              Access tokens already issued stay valid until they expire, so API
              access can continue for up to 15 minutes. Everyone will have to
              log in again afterwards.
            </p>
            <div className="space-y-2">
              <Label htmlFor="revoke-all-confirm">
                Type{" "}
                <span className="font-mono font-semibold">
                  {REVOKE_ALL_PHRASE}
                </span>{" "}
                to confirm
              </Label>
              <Input
                id="revoke-all-confirm"
                value={revokeAllConfirmation}
                onChange={(e) => setRevokeAllConfirmation(e.target.value)}
                placeholder={REVOKE_ALL_PHRASE}
                autoComplete="off"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRevokeAllDialog(false)}
              disabled={isRevokingAll}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onRevokeAllSessions}
              disabled={
                isRevokingAll || revokeAllConfirmation !== REVOKE_ALL_PHRASE
              }
            >
              {isRevokingAll ? "Revoking..." : "Revoke all sessions"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* KPI Stats cards */}
      <div className="grid grid-cols-1 gap-4">
        <div className="glass-card border-glow-hover rounded-2xl transition-all duration-300 group flex items-center justify-between p-5">
          <div>
            <span className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
              Total Users
            </span>
            <div className="text-2xl font-bold tracking-tight text-foreground mt-1.5">
              {total}
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary ring-1 ring-border/40 group-hover:scale-105 transition-transform">
            <Users className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Main card wrapper for search filters and list */}
      <Card className="glass-card border-glow-hover rounded-2xl overflow-hidden transition-all duration-300">
        <CardHeader className="p-5 border-b border-border/60">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={roleFilter}
              onValueChange={(val) => {
                setRoleFilter(val);
                setOffset(0);
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={deletedFilter}
              onValueChange={(val) => {
                setDeletedFilter(val);
                setOffset(0);
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="false">Active Only</SelectItem>
                <SelectItem value="true">Deleted Only</SelectItem>
                <SelectItem value="all">All Users</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <ArrowUpDown
                className="h-4 w-4 text-muted-foreground shrink-0"
                aria-hidden="true"
              />
              <Select
                value={sortKey}
                onValueChange={(val) => {
                  setSortKey(val);
                  setOffset(0);
                }}
              >
                <SelectTrigger
                  className="w-full sm:w-[220px]"
                  aria-label="Sort users"
                >
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last_logged_at:desc">
                    Last active
                  </SelectItem>
                  <SelectItem value="created_at:desc">
                    Newest members
                  </SelectItem>
                  <SelectItem value="created_at:asc">Oldest members</SelectItem>
                  <SelectItem value="last_logged_at:asc">
                    Least recently active
                  </SelectItem>
                  <SelectItem value="username:asc">Username A–Z</SelectItem>
                  <SelectItem value="username:desc">Username Z–A</SelectItem>
                  <SelectItem value="email:asc">Email A–Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-2 sm:p-4 md:p-6">
          <div className="overflow-x-auto -mx-2 sm:-mx-4 md:-mx-6">
            <div className="min-w-[900px] px-2 sm:px-4 md:px-6">
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
                    <TableHead className="hidden md:table-cell">
                      <SortHeader
                        column="username"
                        label="Username"
                        orderBy={orderBy}
                        orderDirection={orderDirection}
                        onToggle={toggleSort}
                      />
                    </TableHead>
                    <TableHead className="hidden lg:table-cell">
                      <SortHeader
                        column="email"
                        label="Email"
                        orderBy={orderBy}
                        orderDirection={orderDirection}
                        onToggle={toggleSort}
                      />
                    </TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="hidden lg:table-cell">
                      <SortHeader
                        column="created_at"
                        label="Joined"
                        orderBy={orderBy}
                        orderDirection={orderDirection}
                        onToggle={toggleSort}
                      />
                    </TableHead>
                    <TableHead className="hidden xl:table-cell">
                      <SortHeader
                        column="last_logged_at"
                        label="Last active"
                        orderBy={orderBy}
                        orderDirection={orderDirection}
                        onToggle={toggleSort}
                      />
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
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
                        <TableCell className="hidden md:table-cell">
                          <Skeleton className="h-4 w-[100px]" />
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <Skeleton className="h-4 w-[180px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-20" />
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                        <TableCell className="hidden xl:table-cell">
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-8 w-[80px] ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="py-4">
                        <EmptyState
                          icon={UserSearch}
                          title={
                            users.length === 0
                              ? "No users yet"
                              : "No users match your search or filter"
                          }
                          description={
                            users.length === 0
                              ? "Newly registered users will appear here."
                              : "Try a different keyword, role, or status filter."
                          }
                          actions={
                            users.length === 0
                              ? []
                              : [
                                  {
                                    label: "Clear filters",
                                    variant: "outline",
                                    onClick: () => {
                                      setSearch("");
                                      setRoleFilter("all");
                                      setDeletedFilter("false");
                                      setOffset(0);
                                    },
                                  },
                                ]
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user, index) => (
                      <TableRow key={user.id}>
                        <TableCell className="text-muted-foreground tabular-nums">
                          {index + 1 + offset}
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
                            <span className="font-medium">
                              {user.first_name} {user.last_name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground hidden md:table-cell">
                          {user.username}
                        </TableCell>
                        <TableCell className="text-muted-foreground hidden lg:table-cell">
                          {user.email}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1.5">
                            {user.is_super_admin ? (
                              <Badge
                                variant="default"
                                className="border-0 bg-emerald-600 text-white dark:bg-emerald-500"
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
                            {user.deleted_at && (
                              <Badge
                                variant="destructive"
                                className="bg-red-600/10 text-red-600 border border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900"
                              >
                                Deleted
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground whitespace-nowrap text-sm hidden lg:table-cell">
                          {format(user.created_at, "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell className="text-muted-foreground whitespace-nowrap text-sm hidden xl:table-cell">
                          {user.last_logged_at
                            ? format(user.last_logged_at, "MMM dd, yyyy HH:mm")
                            : "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          <UserActionComponent
                            user={user}
                            auth={auth}
                            refetchUsers={refetchUsers}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground text-center sm:text-left">
              Showing {offset + 1} to {Math.min(offset + limit, total)} of{" "}
              {total} users
            </div>
            <Paginate
              prev={() => changeOffset(offset - limit)}
              next={() => changeOffset(offset + limit)}
              goToPage={(page: number) => changeOffset(page * limit)}
              limit={limit}
              offset={offset}
              total={total}
              length={users.length}
              currentPage={currentPage - 1}
              getPageHref={getPageHref}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

