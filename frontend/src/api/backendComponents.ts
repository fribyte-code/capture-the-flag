/**
 * Generated by @openapi-codegen
 *
 * @version 1.0
 */
import * as reactQuery from "@tanstack/react-query";
import { useBackendContext, BackendContext } from "./backendContext";
import type * as Fetcher from "./backendFetcher";
import { backendFetch } from "./backendFetcher";
import type * as Schemas from "./backendSchemas";

export type LoginError = Fetcher.ErrorWrapper<undefined>;

export type LoginVariables = {
  body?: Schemas.LoginCredentials;
} & BackendContext["fetcherOptions"];

export const fetchLogin = (variables: LoginVariables, signal?: AbortSignal) =>
  backendFetch<undefined, LoginError, Schemas.LoginCredentials, {}, {}, {}>({
    url: "/Api/Auth/Login",
    method: "post",
    ...variables,
    signal,
  });

export const useLogin = (
  options?: Omit<
    reactQuery.UseMutationOptions<undefined, LoginError, LoginVariables>,
    "mutationFn"
  >
) => {
  const { fetcherOptions } = useBackendContext();
  return reactQuery.useMutation<undefined, LoginError, LoginVariables>({
    mutationFn: (variables: LoginVariables) =>
      fetchLogin({ ...fetcherOptions, ...variables }),
    ...options,
  });
};

export type LogoutError = Fetcher.ErrorWrapper<undefined>;

export type LogoutVariables = BackendContext["fetcherOptions"];

export const fetchLogout = (variables: LogoutVariables, signal?: AbortSignal) =>
  backendFetch<undefined, LogoutError, undefined, {}, {}, {}>({
    url: "/Api/Auth/Logout",
    method: "get",
    ...variables,
    signal,
  });

export const useLogout = <TData = undefined>(
  variables: LogoutVariables,
  options?: Omit<
    reactQuery.UseQueryOptions<undefined, LogoutError, TData>,
    "queryKey" | "queryFn" | "initialData"
  >
) => {
  const { fetcherOptions, queryOptions, queryKeyFn } =
    useBackendContext(options);
  return reactQuery.useQuery<undefined, LogoutError, TData>({
    queryKey: queryKeyFn({
      path: "/Api/Auth/Logout",
      operationId: "logout",
      variables,
    }),
    queryFn: ({ signal }) =>
      fetchLogout({ ...fetcherOptions, ...variables }, signal),
    ...options,
    ...queryOptions,
  });
};

export type MeError = Fetcher.ErrorWrapper<undefined>;

export type MeVariables = BackendContext["fetcherOptions"];

export const fetchMe = (variables: MeVariables, signal?: AbortSignal) =>
  backendFetch<Schemas.LoggedInUserDto, MeError, undefined, {}, {}, {}>({
    url: "/Api/Auth/Me",
    method: "get",
    ...variables,
    signal,
  });

export const useMe = <TData = Schemas.LoggedInUserDto>(
  variables: MeVariables,
  options?: Omit<
    reactQuery.UseQueryOptions<Schemas.LoggedInUserDto, MeError, TData>,
    "queryKey" | "queryFn" | "initialData"
  >
) => {
  const { fetcherOptions, queryOptions, queryKeyFn } =
    useBackendContext(options);
  return reactQuery.useQuery<Schemas.LoggedInUserDto, MeError, TData>({
    queryKey: queryKeyFn({
      path: "/Api/Auth/Me",
      operationId: "me",
      variables,
    }),
    queryFn: ({ signal }) =>
      fetchMe({ ...fetcherOptions, ...variables }, signal),
    ...options,
    ...queryOptions,
  });
};

export type LeaderboardError = Fetcher.ErrorWrapper<undefined>;

export type LeaderboardResponse = Schemas.LeaderboardEntry[];

export type LeaderboardVariables = BackendContext["fetcherOptions"];

export const fetchLeaderboard = (
  variables: LeaderboardVariables,
  signal?: AbortSignal
) =>
  backendFetch<LeaderboardResponse, LeaderboardError, undefined, {}, {}, {}>({
    url: "/Api/Leaderboard",
    method: "get",
    ...variables,
    signal,
  });

export const useLeaderboard = <TData = LeaderboardResponse>(
  variables: LeaderboardVariables,
  options?: Omit<
    reactQuery.UseQueryOptions<LeaderboardResponse, LeaderboardError, TData>,
    "queryKey" | "queryFn" | "initialData"
  >
) => {
  const { fetcherOptions, queryOptions, queryKeyFn } =
    useBackendContext(options);
  return reactQuery.useQuery<LeaderboardResponse, LeaderboardError, TData>({
    queryKey: queryKeyFn({
      path: "/Api/Leaderboard",
      operationId: "leaderboard",
      variables,
    }),
    queryFn: ({ signal }) =>
      fetchLeaderboard({ ...fetcherOptions, ...variables }, signal),
    ...options,
    ...queryOptions,
  });
};

export type AdminAllTasksError = Fetcher.ErrorWrapper<undefined>;

export type AdminAllTasksResponse = Schemas.CtfTask[];

export type AdminAllTasksVariables = BackendContext["fetcherOptions"];

export const fetchAdminAllTasks = (
  variables: AdminAllTasksVariables,
  signal?: AbortSignal
) =>
  backendFetch<
    AdminAllTasksResponse,
    AdminAllTasksError,
    undefined,
    {},
    {},
    {}
  >({ url: "/Api/TaskAdmin", method: "get", ...variables, signal });

export const useAdminAllTasks = <TData = AdminAllTasksResponse>(
  variables: AdminAllTasksVariables,
  options?: Omit<
    reactQuery.UseQueryOptions<
      AdminAllTasksResponse,
      AdminAllTasksError,
      TData
    >,
    "queryKey" | "queryFn" | "initialData"
  >
) => {
  const { fetcherOptions, queryOptions, queryKeyFn } =
    useBackendContext(options);
  return reactQuery.useQuery<AdminAllTasksResponse, AdminAllTasksError, TData>({
    queryKey: queryKeyFn({
      path: "/Api/TaskAdmin",
      operationId: "adminAllTasks",
      variables,
    }),
    queryFn: ({ signal }) =>
      fetchAdminAllTasks({ ...fetcherOptions, ...variables }, signal),
    ...options,
    ...queryOptions,
  });
};

export type AdminAddTaskError = Fetcher.ErrorWrapper<undefined>;

export type AdminAddTaskVariables = {
  body?: Schemas.CtfTaskWriteModel;
} & BackendContext["fetcherOptions"];

export const fetchAdminAddTask = (
  variables: AdminAddTaskVariables,
  signal?: AbortSignal
) =>
  backendFetch<
    Schemas.CtfTask,
    AdminAddTaskError,
    Schemas.CtfTaskWriteModel,
    {},
    {},
    {}
  >({ url: "/Api/TaskAdmin", method: "post", ...variables, signal });

export const useAdminAddTask = (
  options?: Omit<
    reactQuery.UseMutationOptions<
      Schemas.CtfTask,
      AdminAddTaskError,
      AdminAddTaskVariables
    >,
    "mutationFn"
  >
) => {
  const { fetcherOptions } = useBackendContext();
  return reactQuery.useMutation<
    Schemas.CtfTask,
    AdminAddTaskError,
    AdminAddTaskVariables
  >({
    mutationFn: (variables: AdminAddTaskVariables) =>
      fetchAdminAddTask({ ...fetcherOptions, ...variables }),
    ...options,
  });
};

export type AdminUpdateTaskPathParams = {
  /**
   * @format uuid
   */
  id: string;
};

export type AdminUpdateTaskError = Fetcher.ErrorWrapper<undefined>;

export type AdminUpdateTaskVariables = {
  body?: Schemas.CtfTaskWriteModel;
  pathParams: AdminUpdateTaskPathParams;
} & BackendContext["fetcherOptions"];

export const fetchAdminUpdateTask = (
  variables: AdminUpdateTaskVariables,
  signal?: AbortSignal
) =>
  backendFetch<
    Schemas.CtfTask,
    AdminUpdateTaskError,
    Schemas.CtfTaskWriteModel,
    {},
    {},
    AdminUpdateTaskPathParams
  >({ url: "/Api/TaskAdmin/{id}", method: "put", ...variables, signal });

export const useAdminUpdateTask = (
  options?: Omit<
    reactQuery.UseMutationOptions<
      Schemas.CtfTask,
      AdminUpdateTaskError,
      AdminUpdateTaskVariables
    >,
    "mutationFn"
  >
) => {
  const { fetcherOptions } = useBackendContext();
  return reactQuery.useMutation<
    Schemas.CtfTask,
    AdminUpdateTaskError,
    AdminUpdateTaskVariables
  >({
    mutationFn: (variables: AdminUpdateTaskVariables) =>
      fetchAdminUpdateTask({ ...fetcherOptions, ...variables }),
    ...options,
  });
};

export type AdminDeleteTaskPathParams = {
  /**
   * @format uuid
   */
  id: string;
};

export type AdminDeleteTaskError = Fetcher.ErrorWrapper<undefined>;

export type AdminDeleteTaskVariables = {
  pathParams: AdminDeleteTaskPathParams;
} & BackendContext["fetcherOptions"];

export const fetchAdminDeleteTask = (
  variables: AdminDeleteTaskVariables,
  signal?: AbortSignal
) =>
  backendFetch<
    undefined,
    AdminDeleteTaskError,
    undefined,
    {},
    {},
    AdminDeleteTaskPathParams
  >({ url: "/Api/TaskAdmin/{id}", method: "delete", ...variables, signal });

export const useAdminDeleteTask = (
  options?: Omit<
    reactQuery.UseMutationOptions<
      undefined,
      AdminDeleteTaskError,
      AdminDeleteTaskVariables
    >,
    "mutationFn"
  >
) => {
  const { fetcherOptions } = useBackendContext();
  return reactQuery.useMutation<
    undefined,
    AdminDeleteTaskError,
    AdminDeleteTaskVariables
  >({
    mutationFn: (variables: AdminDeleteTaskVariables) =>
      fetchAdminDeleteTask({ ...fetcherOptions, ...variables }),
    ...options,
  });
};

export type AdminAllCategoriesError = Fetcher.ErrorWrapper<undefined>;

export type AdminAllCategoriesResponse = string[];

export type AdminAllCategoriesVariables = BackendContext["fetcherOptions"];

export const fetchAdminAllCategories = (
  variables: AdminAllCategoriesVariables,
  signal?: AbortSignal
) =>
  backendFetch<
    AdminAllCategoriesResponse,
    AdminAllCategoriesError,
    undefined,
    {},
    {},
    {}
  >({ url: "/Api/TaskAdmin/categories", method: "get", ...variables, signal });

export const useAdminAllCategories = <TData = AdminAllCategoriesResponse>(
  variables: AdminAllCategoriesVariables,
  options?: Omit<
    reactQuery.UseQueryOptions<
      AdminAllCategoriesResponse,
      AdminAllCategoriesError,
      TData
    >,
    "queryKey" | "queryFn" | "initialData"
  >
) => {
  const { fetcherOptions, queryOptions, queryKeyFn } =
    useBackendContext(options);
  return reactQuery.useQuery<
    AdminAllCategoriesResponse,
    AdminAllCategoriesError,
    TData
  >({
    queryKey: queryKeyFn({
      path: "/Api/TaskAdmin/categories",
      operationId: "adminAllCategories",
      variables,
    }),
    queryFn: ({ signal }) =>
      fetchAdminAllCategories({ ...fetcherOptions, ...variables }, signal),
    ...options,
    ...queryOptions,
  });
};

export type TasksError = Fetcher.ErrorWrapper<undefined>;

export type TasksResponse = Schemas.CtfTaskReadModel[];

export type TasksVariables = BackendContext["fetcherOptions"];

export const fetchTasks = (variables: TasksVariables, signal?: AbortSignal) =>
  backendFetch<TasksResponse, TasksError, undefined, {}, {}, {}>({
    url: "/Api/Tasks",
    method: "get",
    ...variables,
    signal,
  });

export const useTasks = <TData = TasksResponse>(
  variables: TasksVariables,
  options?: Omit<
    reactQuery.UseQueryOptions<TasksResponse, TasksError, TData>,
    "queryKey" | "queryFn" | "initialData"
  >
) => {
  const { fetcherOptions, queryOptions, queryKeyFn } =
    useBackendContext(options);
  return reactQuery.useQuery<TasksResponse, TasksError, TData>({
    queryKey: queryKeyFn({
      path: "/Api/Tasks",
      operationId: "tasks",
      variables,
    }),
    queryFn: ({ signal }) =>
      fetchTasks({ ...fetcherOptions, ...variables }, signal),
    ...options,
    ...queryOptions,
  });
};

export type SolvePathParams = {
  /**
   * @format uuid
   */
  id: string;
};

export type SolveError = Fetcher.ErrorWrapper<undefined>;

export type SolveVariables = {
  body?: Schemas.SolveTaskRequest;
  pathParams: SolvePathParams;
} & BackendContext["fetcherOptions"];

export const fetchSolve = (variables: SolveVariables, signal?: AbortSignal) =>
  backendFetch<
    Schemas.SolveTaskResponse,
    SolveError,
    Schemas.SolveTaskRequest,
    {},
    {},
    SolvePathParams
  >({ url: "/Api/Tasks/solve/{id}", method: "post", ...variables, signal });

export const useSolve = (
  options?: Omit<
    reactQuery.UseMutationOptions<
      Schemas.SolveTaskResponse,
      SolveError,
      SolveVariables
    >,
    "mutationFn"
  >
) => {
  const { fetcherOptions } = useBackendContext();
  return reactQuery.useMutation<
    Schemas.SolveTaskResponse,
    SolveError,
    SolveVariables
  >({
    mutationFn: (variables: SolveVariables) =>
      fetchSolve({ ...fetcherOptions, ...variables }),
    ...options,
  });
};

export type SolveHistoryError = Fetcher.ErrorWrapper<undefined>;

export type SolveHistoryResponse = Schemas.SolvedTaskReadModel[];

export type SolveHistoryVariables = BackendContext["fetcherOptions"];

export const fetchSolveHistory = (
  variables: SolveHistoryVariables,
  signal?: AbortSignal
) =>
  backendFetch<SolveHistoryResponse, SolveHistoryError, undefined, {}, {}, {}>({
    url: "/Api/Tasks/solve/history",
    method: "get",
    ...variables,
    signal,
  });

export const useSolveHistory = <TData = SolveHistoryResponse>(
  variables: SolveHistoryVariables,
  options?: Omit<
    reactQuery.UseQueryOptions<SolveHistoryResponse, SolveHistoryError, TData>,
    "queryKey" | "queryFn" | "initialData"
  >
) => {
  const { fetcherOptions, queryOptions, queryKeyFn } =
    useBackendContext(options);
  return reactQuery.useQuery<SolveHistoryResponse, SolveHistoryError, TData>({
    queryKey: queryKeyFn({
      path: "/Api/Tasks/solve/history",
      operationId: "solveHistory",
      variables,
    }),
    queryFn: ({ signal }) =>
      fetchSolveHistory({ ...fetcherOptions, ...variables }, signal),
    ...options,
    ...queryOptions,
  });
};

export type AllTeamsError = Fetcher.ErrorWrapper<undefined>;

export type AllTeamsResponse = Schemas.ApplicationUser[];

export type AllTeamsVariables = BackendContext["fetcherOptions"];

export const fetchAllTeams = (
  variables: AllTeamsVariables,
  signal?: AbortSignal
) =>
  backendFetch<AllTeamsResponse, AllTeamsError, undefined, {}, {}, {}>({
    url: "/Api/Team",
    method: "get",
    ...variables,
    signal,
  });

export const useAllTeams = <TData = AllTeamsResponse>(
  variables: AllTeamsVariables,
  options?: Omit<
    reactQuery.UseQueryOptions<AllTeamsResponse, AllTeamsError, TData>,
    "queryKey" | "queryFn" | "initialData"
  >
) => {
  const { fetcherOptions, queryOptions, queryKeyFn } =
    useBackendContext(options);
  return reactQuery.useQuery<AllTeamsResponse, AllTeamsError, TData>({
    queryKey: queryKeyFn({
      path: "/Api/Team",
      operationId: "allTeams",
      variables,
    }),
    queryFn: ({ signal }) =>
      fetchAllTeams({ ...fetcherOptions, ...variables }, signal),
    ...options,
    ...queryOptions,
  });
};

export type AddTeamError = Fetcher.ErrorWrapper<undefined>;

export type AddTeamVariables = {
  body?: Schemas.NewTeam;
} & BackendContext["fetcherOptions"];

export const fetchAddTeam = (
  variables: AddTeamVariables,
  signal?: AbortSignal
) =>
  backendFetch<undefined, AddTeamError, Schemas.NewTeam, {}, {}, {}>({
    url: "/Api/Team",
    method: "post",
    ...variables,
    signal,
  });

export const useAddTeam = (
  options?: Omit<
    reactQuery.UseMutationOptions<undefined, AddTeamError, AddTeamVariables>,
    "mutationFn"
  >
) => {
  const { fetcherOptions } = useBackendContext();
  return reactQuery.useMutation<undefined, AddTeamError, AddTeamVariables>({
    mutationFn: (variables: AddTeamVariables) =>
      fetchAddTeam({ ...fetcherOptions, ...variables }),
    ...options,
  });
};

export type GetInvitationLinkError = Fetcher.ErrorWrapper<undefined>;

export type GetInvitationLinkVariables = BackendContext["fetcherOptions"];

export const fetchGetInvitationLink = (
  variables: GetInvitationLinkVariables,
  signal?: AbortSignal
) =>
  backendFetch<
    Schemas.Invitation,
    GetInvitationLinkError,
    undefined,
    {},
    {},
    {}
  >({ url: "/Api/Team/invitation", method: "get", ...variables, signal });

export const useGetInvitationLink = <TData = Schemas.Invitation>(
  variables: GetInvitationLinkVariables,
  options?: Omit<
    reactQuery.UseQueryOptions<
      Schemas.Invitation,
      GetInvitationLinkError,
      TData
    >,
    "queryKey" | "queryFn" | "initialData"
  >
) => {
  const { fetcherOptions, queryOptions, queryKeyFn } =
    useBackendContext(options);
  return reactQuery.useQuery<Schemas.Invitation, GetInvitationLinkError, TData>(
    {
      queryKey: queryKeyFn({
        path: "/Api/Team/invitation",
        operationId: "getInvitationLink",
        variables,
      }),
      queryFn: ({ signal }) =>
        fetchGetInvitationLink({ ...fetcherOptions, ...variables }, signal),
      ...options,
      ...queryOptions,
    }
  );
};

export type PostInvitationLinkError = Fetcher.ErrorWrapper<undefined>;

export type PostInvitationLinkVariables = {
  body?: Schemas.InvitationWriteModel;
} & BackendContext["fetcherOptions"];

export const fetchPostInvitationLink = (
  variables: PostInvitationLinkVariables,
  signal?: AbortSignal
) =>
  backendFetch<
    undefined,
    PostInvitationLinkError,
    Schemas.InvitationWriteModel,
    {},
    {},
    {}
  >({ url: "/Api/Team/invitation", method: "post", ...variables, signal });

export const usePostInvitationLink = (
  options?: Omit<
    reactQuery.UseMutationOptions<
      undefined,
      PostInvitationLinkError,
      PostInvitationLinkVariables
    >,
    "mutationFn"
  >
) => {
  const { fetcherOptions } = useBackendContext();
  return reactQuery.useMutation<
    undefined,
    PostInvitationLinkError,
    PostInvitationLinkVariables
  >({
    mutationFn: (variables: PostInvitationLinkVariables) =>
      fetchPostInvitationLink({ ...fetcherOptions, ...variables }),
    ...options,
  });
};

export type RegisterWithInvitationLinkError = Fetcher.ErrorWrapper<undefined>;

export type RegisterWithInvitationLinkVariables = {
  body?: Schemas.Register;
} & BackendContext["fetcherOptions"];

export const fetchRegisterWithInvitationLink = (
  variables: RegisterWithInvitationLinkVariables,
  signal?: AbortSignal
) =>
  backendFetch<
    Schemas.ApplicationUser,
    RegisterWithInvitationLinkError,
    Schemas.Register,
    {},
    {},
    {}
  >({
    url: "/Api/Team/invitation/register",
    method: "post",
    ...variables,
    signal,
  });

export const useRegisterWithInvitationLink = (
  options?: Omit<
    reactQuery.UseMutationOptions<
      Schemas.ApplicationUser,
      RegisterWithInvitationLinkError,
      RegisterWithInvitationLinkVariables
    >,
    "mutationFn"
  >
) => {
  const { fetcherOptions } = useBackendContext();
  return reactQuery.useMutation<
    Schemas.ApplicationUser,
    RegisterWithInvitationLinkError,
    RegisterWithInvitationLinkVariables
  >({
    mutationFn: (variables: RegisterWithInvitationLinkVariables) =>
      fetchRegisterWithInvitationLink({ ...fetcherOptions, ...variables }),
    ...options,
  });
};

export type QueryOperation =
  | {
      path: "/Api/Auth/Logout";
      operationId: "logout";
      variables: LogoutVariables;
    }
  | {
      path: "/Api/Auth/Me";
      operationId: "me";
      variables: MeVariables;
    }
  | {
      path: "/Api/Leaderboard";
      operationId: "leaderboard";
      variables: LeaderboardVariables;
    }
  | {
      path: "/Api/TaskAdmin";
      operationId: "adminAllTasks";
      variables: AdminAllTasksVariables;
    }
  | {
      path: "/Api/TaskAdmin/categories";
      operationId: "adminAllCategories";
      variables: AdminAllCategoriesVariables;
    }
  | {
      path: "/Api/Tasks";
      operationId: "tasks";
      variables: TasksVariables;
    }
  | {
      path: "/Api/Tasks/solve/history";
      operationId: "solveHistory";
      variables: SolveHistoryVariables;
    }
  | {
      path: "/Api/Team";
      operationId: "allTeams";
      variables: AllTeamsVariables;
    }
  | {
      path: "/Api/Team/invitation";
      operationId: "getInvitationLink";
      variables: GetInvitationLinkVariables;
    };
