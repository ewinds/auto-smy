import request from "@/plugin/axios";

export function fetchList(query) {
  return request({
    url: "/admin/user/userPage",
    method: "get",
    params: query
  });
}
