import { baseApi } from "./base";
import buildConfig from "../utils/buildConfig";

export const getAllCars = (signal, token) => {
  return baseApi
    .get("allItems", buildConfig(signal, token))
    .then((res) => res.data);
};

export const getCarById = (carId, signal, token) => {
  return baseApi
    .get(`${carId}`, buildConfig(signal, token))
    .then((res) => res.data);
};

export const createCar = (payload, token) => {
  return baseApi
    .post("", payload, buildConfig(undefined, token))
    .then((res) => res.data);
};

export const updateCar = (carId, payload, token) => {
  return baseApi
    .put(`${encodeURIComponent(carId)}`, payload, buildConfig(undefined, token))
    .then((res) => res.data);
};

export const deleteCar = (carId, token) => {
  return baseApi
    .delete(`${encodeURIComponent(carId)}`, buildConfig(undefined, token))
    .then((res) => res.data);
};
