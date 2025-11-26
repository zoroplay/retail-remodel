import React, { useEffect, useState, Fragment } from "react";
import { useAppSelector } from "../../../../hooks/useAppDispatch";
import { useGetAgentUsersQuery } from "../../../../store/services/user.service";
import {
  ChevronDown,
  ChevronRight,
  User,
  Users,
  Search,
  Filter,
  Loader,
  Lock,
  Eye,
  Wallet,
} from "lucide-react";
import environmentConfig from "@/store/services/configs/environment.config";
import Select from "@/components/inputs/Select";
import SingleSearchInput from "@/components/inputs/SingleSearchInput";
import { getClientTheme } from "@/config/theme.config";

interface UserData {
  id: number;
  username: string;
  firstName?: string;
  lastName?: string;
  role: string;
  balance: number;
  children?: UserData[];
  expanded?: boolean;
}

const UserList = () => {
  const { classes } = getClientTheme();
  const pageClasses = classes.user_management_page;
  const { user } = useAppSelector((state) => state.user);
  const [filtered, setFiltered] = useState<UserData[]>([]);
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [expandingUser, setExpandingUser] = useState<number | null>(null);
  const { data, isLoading, error } = useGetAgentUsersQuery(
    {
      agentId: user?.id || 0,
      clientId: Number(environmentConfig.CLIENT_ID),
    },
    {
      skip: !user?.id,
    }
  );
  const users = Array.isArray(data?.data) ? data?.data : [];
  console.log("UserList data:", users);

  const toggleUser = (userToToggle: UserData, indices: number[]) => {
    const newFiltered = [...filtered];
    let current: any = newFiltered;

    // Navigate to the correct nested level
    for (let i = 0; i < indices.length - 1; i++) {
      current = current[indices[i]].children;
    }

    const targetIndex = indices[indices.length - 1];
    const targetUser = current[targetIndex];

    if (targetUser.expanded) {
      targetUser.expanded = false;
    } else {
      // Fetch children if not already loaded
      if (!targetUser.children || targetUser.children.length === 0) {
        setExpandingUser(targetUser.id);
        // Here you would fetch children from API
        // For now, we'll just mark as expanded
        setTimeout(() => {
          targetUser.expanded = true;
          targetUser.children = [];
          setExpandingUser(null);
          setFiltered([...newFiltered]);
        }, 500);
      } else {
        targetUser.expanded = true;
      }
    }

    setFiltered([...newFiltered]);
  };

  const UserRow = ({
    userData,
    level,
    indices,
  }: {
    userData: UserData;
    level: number;
    indices: number[];
  }) => {
    const hasChildren = userData.children && userData.children.length > 0;
    const isExpanding = expandingUser === userData.id;

    return (
      <Fragment key={userData.id}>
        <tr
          className={`border-b ${pageClasses["row-border"]} ${pageClasses["row-hover"]} transition-colors`}
        >
          <td className="px-4 py-3">
            <div className="flex items-center gap-2">
              <span
                className="text-xs text-gray-400"
                style={{ marginLeft: `${level * 20}px` }}
              >
                {userData.id}
              </span>
            </div>
          </td>
          <td className="px-4 py-3">
            <div
              className="flex items-center gap-2"
              style={{ marginLeft: `${level * 20}px` }}
            >
              {hasChildren && (
                <button
                  onClick={() => toggleUser(userData, indices)}
                  className={`p-1 ${pageClasses["row-hover"]} rounded transition-colors`}
                >
                  {isExpanding ? (
                    <Loader
                      size={14}
                      className={`animate-spin ${pageClasses["header-icon-text"]}`}
                    />
                  ) : userData.expanded ? (
                    <ChevronDown
                      size={14}
                      className={pageClasses["header-icon-text"]}
                    />
                  ) : (
                    <ChevronRight
                      size={14}
                      className={pageClasses["subtitle-text"]}
                    />
                  )}
                </button>
              )}
              <span
                className={`px-2 py-0.5 rounded text-xs font-medium ${
                  userData.role === "Agent" || userData.role === "Shop"
                    ? `${pageClasses["badge-deposit-bg"]} ${pageClasses["badge-deposit-text"]}`
                    : userData.role === "Cashier"
                    ? `${pageClasses["badge-withdraw-bg"]} ${pageClasses["badge-withdraw-text"]}`
                    : `${pageClasses["info-card-bg"]} ${pageClasses["info-label-text"]}`
                }`}
              >
                {userData.role}
              </span>
            </div>
          </td>
          <td className="px-4 py-3">
            <span className={`text-sm font-medium ${pageClasses["row-text"]}`}>
              {userData.username}
            </span>
          </td>
          <td className="px-4 py-3">
            <span className={`text-sm ${pageClasses["info-label-text"]}`}>
              {userData.firstName || ""} {userData.lastName || ""}
            </span>
          </td>
          <td className="px-4 py-3">
            <span
              className={`text-sm font-semibold ${pageClasses["balance-text"]}`}
            >
              ₦{(userData.balance ?? 0).toFixed(2)}
            </span>
          </td>
          <td className="px-4 py-3">
            <div className="flex items-center gap-2">
              <button
                className={`p-1.5 ${pageClasses["header-icon-bg"]} ${pageClasses["row-hover"]} ${pageClasses["header-icon-text"]} rounded transition-colors`}
                title="View Details"
              >
                <Eye size={14} />
              </button>
              <button
                className={`p-1.5 ${pageClasses["badge-withdraw-bg"]} ${pageClasses["row-hover"]} ${pageClasses["badge-withdraw-text"]} rounded transition-colors`}
                title="Change Password"
              >
                <Lock size={14} />
              </button>
            </div>
          </td>
        </tr>

        {userData.expanded &&
          userData.children &&
          userData.children.length > 0 && (
            <>
              {userData.children.map((child, childIndex) => (
                <UserRow
                  key={child.id}
                  userData={child}
                  level={level + 1}
                  indices={[...indices, childIndex]}
                />
              ))}
            </>
          )}
      </Fragment>
    );
  };

  return (
    <div
      className={`h-[calc(100vh-110px)] overflow-y-auto ${pageClasses["page-bg"]} ${pageClasses["page-text"]}`}
    >
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`w-12 h-12 ${pageClasses["header-icon-bg"]} rounded-lg flex items-center justify-center`}
          >
            <Users size={24} className={pageClasses["header-icon-text"]} />
          </div>
          <div>
            <h1 className={`text-lg font-bold ${pageClasses["header-text"]}`}>
              User List
            </h1>
            <p className={`${pageClasses["subtitle-text"]} text-xs`}>
              Manage and view all users in your network
            </p>
          </div>
        </div>

        {/* Filters */}
        <div
          className={`${pageClasses["card-bg"]} backdrop-blur-sm rounded-lg p-4 border ${pageClasses["card-border"]} mb-4`}
        >
          <div className="grid md:grid-cols-2 gap-3">
            {/* Role Filter */}
            <div>
              <Select
                label="Filter By Role"
                value={[roleFilter ?? "all"]}
                options={[
                  { id: "all", name: "All Roles" },
                  ...(user?.role === "Super Agent" ||
                  user?.role === "Master Agent"
                    ? [{ id: "agent", name: "Agent" }]
                    : []),
                  ...(user?.role === "Super Agent" ||
                  user?.role === "Master Agent" ||
                  user?.role === "Agent"
                    ? [{ id: "20", name: "20" }]
                    : []),
                  { id: "PLAYER", name: "Player" },
                ]}
                onChange={(e) => setRoleFilter(e[0] as string)}
                placeholder={""}
                height="h-[42px]"
                bg_color={pageClasses["input-bg"]}
                text_color={pageClasses["input-text"]}
                border_color={`border ${pageClasses["input-border"]}`}
                className={`w-full border ${pageClasses["input-border"]} rounded-lg px-3 py-2 ${pageClasses["input-text"]} transition-all disabled:opacity-50`}
              />
            </div>

            {/* Search */}
            <div>
              <SingleSearchInput
                label="Fast Search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by username (min 3 characters)"
                height="h-[42px]"
                bg_color={pageClasses["input-bg"]}
                text_color={pageClasses["input-text"]}
                border_color={`border ${pageClasses["input-border"]}`}
                className={`w-full border ${pageClasses["input-border"]} rounded-lg px-3 py-2 ${pageClasses["input-text"]} transition-all disabled:opacity-50`}
                onSearch={function (query: string): void {
                  throw new Error("Function not implemented.");
                }}
                searchState={{
                  isValid: false,
                  isNotFound: false,
                  isLoading: false,
                  message: "",
                }}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div
          className={`${pageClasses["card-bg"]} backdrop-blur-sm rounded-lg border ${pageClasses["card-border"]} overflow-hidden`}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead
                className={`${pageClasses["column-header-bg"]} border-b ${pageClasses["card-border"]}`}
              >
                <tr>
                  <th
                    className={`px-4 py-3 text-left text-xs font-semibold ${pageClasses["column-header-text"]} uppercase tracking-wider`}
                  >
                    ID
                  </th>
                  <th
                    className={`px-4 py-3 text-left text-xs font-semibold ${pageClasses["column-header-text"]} uppercase tracking-wider`}
                  >
                    User Type
                  </th>
                  <th
                    className={`px-4 py-3 text-left text-xs font-semibold ${pageClasses["column-header-text"]} uppercase tracking-wider`}
                  >
                    Username
                  </th>
                  <th
                    className={`px-4 py-3 text-left text-xs font-semibold ${pageClasses["column-header-text"]} uppercase tracking-wider`}
                  >
                    Name
                  </th>
                  <th
                    className={`px-4 py-3 text-left text-xs font-semibold ${pageClasses["column-header-text"]} uppercase tracking-wider`}
                  >
                    Balance
                  </th>
                  <th
                    className={`px-4 py-3 text-left text-xs font-semibold ${pageClasses["column-header-text"]} uppercase tracking-wider`}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Loader
                          size={32}
                          className={`animate-spin ${pageClasses["header-icon-text"]}`}
                        />
                        <span
                          className={`text-sm ${pageClasses["subtitle-text"]}`}
                        >
                          Loading users...
                        </span>
                      </div>
                    </td>
                  </tr>
                )}

                {error && (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div
                          className={`w-16 h-16 ${pageClasses["badge-withdraw-bg"]} rounded-full flex items-center justify-center`}
                        >
                          <User
                            size={24}
                            className={pageClasses["badge-withdraw-text"]}
                          />
                        </div>
                        <span
                          className={`text-sm ${pageClasses["badge-withdraw-text"]}`}
                        >
                          Error loading users
                        </span>
                      </div>
                    </td>
                  </tr>
                )}

                {!isLoading && !error && users.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div
                          className={`w-16 h-16 ${pageClasses["header-icon-bg"]} rounded-full flex items-center justify-center`}
                        >
                          <Users
                            size={24}
                            className={pageClasses["subtitle-text"]}
                          />
                        </div>
                        <span
                          className={`text-sm ${pageClasses["subtitle-text"]}`}
                        >
                          No users found
                        </span>
                      </div>
                    </td>
                  </tr>
                )}

                {!isLoading &&
                  !error &&
                  users.map((userData, index) => (
                    <UserRow
                      key={userData.id}
                      userData={userData}
                      level={0}
                      indices={[index]}
                    />
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserList;
