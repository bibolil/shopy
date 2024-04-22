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
    cart: builder.query({
      query: (userId) => ({
        url: `/cart/user/${userId}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["CartItem"],
    }),
    itemCart: builder.mutation({
      query: ({ body, userId }) => ({
        url: `/cart/addItem/${userId}`,
        method: "POST",
        body: body,
        credentials: "include",
      }),
      invalidatesTags: ["CartItem"],
    }),
    removeItemCart: builder.mutation({
      query: ({ userId, itemCode }) => ({
        url: `/cart/removeItem/${userId}/${itemCode}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["CartItem"],
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
  useCartQuery,
  useItemCartMutation,
  useRemoveItemCartMutation,
  useTestQuery,
} = userApiSlice;

export default userApiSlice;
