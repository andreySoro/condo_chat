import http from "k6/http";
import { sleep } from "k6";

export let options = {
  insecureSkipVerify: true,
  noConnectionReuse: false,
  vus: 120,
  duration: "60s",
};

export default function () {
  http.get("http://localhost:5050/loadTest");
  sleep(1);
}
