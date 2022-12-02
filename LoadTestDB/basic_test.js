import http from "k6/http";
import { sleep } from "k6";

export let options = {
  // insecureSkipVerify: true,
  // noConnectionReuse: false,
  vus: 150,
  duration: "1s",
};

export default function () {
  const addUrl = "http://localhost:5050/loadTest";
  const deleteUrl = "http://localhost:5050/deleteTest";
  const payload = JSON.stringify({
    mandate: "New Law",
    vote: "for",
  });
  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  http.post(addUrl, payload, params);
  // http.get("http://playjetball.com");
  sleep(1);
}
