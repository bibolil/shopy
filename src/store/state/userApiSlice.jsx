import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../queries";

const userApiSlice = createApi({
  reducerPath: "userApi",
  baseQuery,
  tagTypes: ["User", "CartItem"],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({
        url: "/auth/authenticate",
        method: "POST",
        body,
        credentials: "include",
      }),
    }),
    register: builder.mutation({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "GET",
        credentials: "include",
      }),
    }),
    refresh: builder.mutation({
      query: () => ({
        url: "/auth/refresh-token",
        method: "GET",
        credentials: "include",
      }),
    }),

    getUsers: builder.query({
      query: () => ({
        url: "/user/getUsers",
        method: "GET",
        credentials: "include",
      }),
    }),

    deleteUser: builder.mutation({
      query: ({ userId }) => ({
        url: `/user/deleteUser/${userId}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),

    editUser: builder.mutation({
      query: ({ body, userId }) => ({
        url: `/user/updateUser/${userId}`,
        method: "PUT",
        body: body,
        credentials: "include",
      }),
    }),

    cart: builder.query({
      query: (userId) => ({
        url: `/cart/user/${userId}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["CartItem"],
    }),
    pendingOrder: builder.query({
      query: ({ userId }) => ({
        url: `/order/getLatestPendingOrder/${userId}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    test: builder.query({
      query: () => ({
        url: "/auth/testGet",
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useRefreshMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
  useEditUserMutation,
  useCartQuery,
  usePendingOrderQuery,
  useTestQuery,
} = userApiSlice;

export default userApiSlice;
