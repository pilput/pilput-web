"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Modal from "@/components/user/Modal";
import { getAuth, getToken, RemoveToken } from "@/utils/Auth";
import { axiosInstence, axiosInstence2 } from "@/utils/fetch";
import { getProfilePicture } from "@/utils/getImage";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ManageUser() {
  const [users, setusers] = useState<User[]>([]);
  const [username, setusername] = useState<string>();
  const [email, setemail] = useState<string>();
  const [password, setpassword] = useState<string>();
  const [repassword, setrepassword] = useState<string>();
  const [modaluser, setmodaluser] = useState(false);
  const [auth, setauth] = useState<User>();

  async function localGetAuth() {
    const auth = await getAuth();
    setauth(auth);
  }
  useEffect(() => {
    getUsers();
    localGetAuth();
  }, []);

  async function getUsers() {
    try {
      const { data } = await axiosInstence2.get("/v1/users", {
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
    }
  }

  async function deleteUser(id: string) {
    const toastid = toast.loading("Loading...");
    const response = await axiosInstence.delete("/v1/users/" + id);
    if (response.status === 200) {
      toast.success("User Deleted", { id: toastid });
    } else if (response.status === 403) {
      toast.error("Forbidden action", { id: toastid });
    } else {
      toast.error("Failed", { id: toastid });
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
    getUsers();
  }

  return (
    <>
      <div className="min-h-screen bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <header className="px-5 py-4 border-b border-gray-100 ">
          <span className="font-semibold text-gray-800">Users</span>
          {auth?.issuperadmin && (
            <button
              className="ml-3 bg-green-600 text-white py-2 px-4 rounded-xl hover:bg-green-700"
              onClick={showModaluser}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                />
              </svg>
            </button>
          )}
        </header>
        <div className="p-3">
          <div className="">
            <table className="table-auto w-full">
              <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                <tr>
                  <th className="p-2 whitespace-nowrap px-4 py-3">
                    <div className="font-semibold text-left">Username</div>
                  </th>
                  <th className="p-2 whitespace-nowrap px-4 py-3">
                    <div className="font-semibold text-left">Name</div>
                  </th>
                  <th className="p-2 whitespace-nowrap px-4 py-3">
                    <div className="font-semibold text-left">Email</div>
                  </th>
                  <th className="p-2 whitespace-nowrap  px-4 py-3">
                    <div className="font-semibold text-left">Super admin</div>
                  </th>

                  <th className="p-2 whitespace-nowrap px-4 py-3">
                    <div className="font-semibold text-center">Action</div>
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100">
                {users.map((user) => {
                  return (
                    <tr key={user.id} className="bg-white hover:bg-gray-50">
                      <td className="whitespace-nowrap  p-4">
                        <div className="flex gap-2 items-center">
                          <Avatar>
                            <AvatarImage
                              src={getProfilePicture(user.image)}
                              width={6}
                              height={6}
                              alt="Avatar"
                            ></AvatarImage>
                            <AvatarFallback>
                              {user.first_name}
                            </AvatarFallback>
                          </Avatar>
                          <div className="font-medium text-gray-800">
                            {user.first_name}
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap  p-4">
                        <div className="text-left">{user.first_name}</div>
                      </td>
                      <td className="whitespace-nowrap  p-4">
                        <div className="text-left">{user.email}</div>
                      </td>
                      <td className="whitespace-nowrap  p-4">
                        <div className="text-left font-semibold">
                          {user.issuperadmin ? (
                            <span className="text-purple-900">Yes</span>
                          ) : (
                            <span className="text-blue-700">No</span>
                          )}
                        </div>
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <div id={user.id} className="text-lg text-center">
                          <div className="tooltip" data-tip="Delete This User">
                            <button
                              className="bg-transparent text-red-400 hover:text-red-600"
                              onClick={() => {
                                deleteUser(user.id);
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-6 h-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {modaluser && (
        <Modal>
          <form onSubmit={submitHandler}>
            <div className="mb-5">
              <label className="mb-3 block text-base font-medium text-[#07074D]">
                User Name
              </label>
              <input
                type="text"
                value={username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setusername(e.target.value);
                }}
                placeholder="User Name"
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
            </div>
            <div className="mb-5">
              <label className="mb-3 block text-base font-medium text-[#07074D]">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setemail(e.target.value);
                }}
                required
                placeholder="example@domain.com"
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
            </div>

            <div className="mb-5">
              <label className="mb-3 block text-base font-medium text-[#07074D]">
                Password
              </label>
              <input
                value={password}
                type="password"
                onChange={(e) => {
                  setpassword(e.target.value);
                }}
                placeholder="Password"
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
            </div>
            <div className="mb-5">
              <label className="mb-3 block text-base font-medium text-[#07074D]">
                Retype Password
              </label>
              <input
                required
                value={repassword}
                type="password"
                onChange={(e) => {
                  setrepassword(e.target.value);
                }}
                placeholder="Retype Password"
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
            </div>

            <div>
              <button
                type="submit"
                className="btn hover:shadow-form rounded-md bg-[#6A64F1] py-2 px-8 text-base font-semibold text-white outline-none"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={closeModaluser}
                className="btn hover:shadow-form ml-2 rounded-md bg-gray-500 py-2 px-8 text-base font-semibold text-white outline-none"
              >
                Close
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
